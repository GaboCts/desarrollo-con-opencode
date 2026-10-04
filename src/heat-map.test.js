// ============================================
// Tests para la lógica del mapa de calor
// Ejecutar con: node --test src/heat-map.test.js
// ============================================

const { test } = require('node:test');
const assert = require('node:assert');
const {
    COLORS,
    getLocalDateString,
    subtractDays,
    addDays,
    getHeatMapRange,
    buildHeatMapData,
    getDayColor,
    getWeeksInRange,
    getMonthLabels
} = require('./heat-map.js');

// ============================================
// Tests para getLocalDateString
// ============================================

test('getLocalDateString devuelve formato correcto', () => {
    const date = new Date(2026, 9, 4); // 4 de octubre de 2026
    assert.strictEqual(getLocalDateString(date), '2026-10-04');
});

test('getLocalDateString rellena con ceros', () => {
    const date = new Date(2026, 0, 5); // 5 de enero de 2026
    assert.strictEqual(getLocalDateString(date), '2026-01-05');
});

// ============================================
// Tests para subtractDays y addDays
// ============================================

test('subtractDays resta días correctamente', () => {
    assert.strictEqual(subtractDays('2026-10-04', 1), '2026-10-03');
    assert.strictEqual(subtractDays('2026-10-01', 1), '2026-09-30');
});

test('addDays suma días correctamente', () => {
    assert.strictEqual(addDays('2026-10-04', 1), '2026-10-05');
    assert.strictEqual(addDays('2026-09-30', 1), '2026-10-01');
});

// ============================================
// Tests para getHeatMapRange (RF-1)
// ============================================

test('getHeatMapRange devuelve 12 semanas', () => {
    const { startDate, endDate } = getHeatMapRange('2026-10-04');
    // 12 semanas = 11 semanas * 7 días + 6 días (lunes a domingo) = 83 días
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    const diffDays = Math.round((end - start) / (24 * 60 * 60 * 1000));
    assert.strictEqual(diffDays, 83); // 11*7 + 6 = 83 días = 12 semanas
});

test('getHeatMapRange endDate es domingo', () => {
    const { endDate } = getHeatMapRange('2026-10-04');
    const [y, m, d] = endDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    assert.strictEqual(date.getDay(), 0); // 0 = domingo
});

test('getHeatMapRange startDate es lunes', () => {
    const { startDate } = getHeatMapRange('2026-10-04');
    const [y, m, d] = startDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    assert.strictEqual(date.getDay(), 1); // 1 = lunes
});

test('getHeatMapRange funciona en cambio de mes', () => {
    const { startDate, endDate } = getHeatMapRange('2026-10-01');
    assert.ok(startDate <= endDate);
    assert.ok(startDate.startsWith('2026-07') || startDate.startsWith('2026-08'));
});

// ============================================
// Tests para buildHeatMapData (RF-1, RF-2, RF-3)
// ============================================

test('buildHeatMapData agrupa sesiones por fecha', () => {
    const sessions = [
        { date: '2026-10-01', minutes: 30, subject: 'Matemáticas' },
        { date: '2026-10-01', minutes: 20, subject: 'Programación' }
    ];
    const data = buildHeatMapData(sessions, '2026-10-04');
    assert.strictEqual(data.get('2026-10-01').minutes, 50);
    assert.deepStrictEqual(data.get('2026-10-01').topics, ['Matemáticas', 'Programación']);
});

test('buildHeatMapData ignora sesiones futuras', () => {
    const sessions = [
        { date: '2026-10-05', minutes: 30, subject: 'Futuro' }
    ];
    const data = buildHeatMapData(sessions, '2026-10-04');
    assert.strictEqual(data.has('2026-10-05'), false);
});

test('buildHeatMapData ignora minutos <= 0', () => {
    const sessions = [
        { date: '2026-10-01', minutes: 0, subject: 'Cero' },
        { date: '2026-10-02', minutes: -10, subject: 'Negativo' }
    ];
    const data = buildHeatMapData(sessions, '2026-10-04');
    assert.strictEqual(data.has('2026-10-01'), false);
    assert.strictEqual(data.has('2026-10-02'), false);
});

test('buildHeatMapData maneja tema vacío', () => {
    const sessions = [
        { date: '2026-10-01', minutes: 30, subject: '' }
    ];
    const data = buildHeatMapData(sessions, '2026-10-04');
    assert.deepStrictEqual(data.get('2026-10-01').topics, ['Sin tema']);
});

test('buildHeatMapData maneja sesiones sin subject', () => {
    const sessions = [
        { date: '2026-10-01', minutes: 30 }
    ];
    const data = buildHeatMapData(sessions, '2026-10-04');
    assert.deepStrictEqual(data.get('2026-10-01').topics, ['Sin tema']);
});

// ============================================
// Tests para getDayColor (RF-2)
// ============================================

test('getDayColor devuelve gris para 0 minutos', () => {
    assert.strictEqual(getDayColor(0), COLORS.EMPTY);
});

test('getDayColor devuelve verde claro para 1-30 min', () => {
    assert.strictEqual(getDayColor(1), COLORS.LEVEL_1);
    assert.strictEqual(getDayColor(15), COLORS.LEVEL_1);
    assert.strictEqual(getDayColor(30), COLORS.LEVEL_1);
});

test('getDayColor devuelve verde medio para 31-60 min', () => {
    assert.strictEqual(getDayColor(31), COLORS.LEVEL_2);
    assert.strictEqual(getDayColor(45), COLORS.LEVEL_2);
    assert.strictEqual(getDayColor(60), COLORS.LEVEL_2);
});

test('getDayColor devuelve verde oscuro para 61-120 min', () => {
    assert.strictEqual(getDayColor(61), COLORS.LEVEL_3);
    assert.strictEqual(getDayColor(90), COLORS.LEVEL_3);
    assert.strictEqual(getDayColor(120), COLORS.LEVEL_3);
});

test('getDayColor devuelve verde intenso para 121+ min', () => {
    assert.strictEqual(getDayColor(121), COLORS.LEVEL_4);
    assert.strictEqual(getDayColor(200), COLORS.LEVEL_4);
});

test('getDayColor devuelve gris para minutos negativos', () => {
    assert.strictEqual(getDayColor(-10), COLORS.EMPTY);
});

// ============================================
// Tests para getWeeksInRange (RF-1)
// ============================================

test('getWeeksInRange genera 12 semanas', () => {
    const weeks = getWeeksInRange('2026-07-13', '2026-10-04', '2026-10-04');
    assert.strictEqual(weeks.length, 12);
});

test('getWeeksInRange cada semana tiene 7 días', () => {
    const weeks = getWeeksInRange('2026-07-13', '2026-10-04', '2026-10-04');
    for (const week of weeks) {
        assert.strictEqual(week.days.length, 7);
    }
});

test('getWeeksInRange marca días futuros correctamente', () => {
    const weeks = getWeeksInRange('2026-07-13', '2026-10-04', '2026-10-04');
    const lastWeek = weeks[weeks.length - 1];
    // El 4 de octubre es domingo, así que no hay días futuros en la última semana
    // Pero si today fuera miércoles, jueves y viernes serían futuros
    const futureDays = lastWeek.days.filter(d => d.isFuture);
    assert.strictEqual(futureDays.length, 0);
});

test('getWeeksInRange marca días futuros en semana actual', () => {
    // 2026-10-01 es jueves. Si hoy es jueves, los días futuros son viernes, sábado, domingo = 3
    const weeks = getWeeksInRange('2026-07-13', '2026-10-04', '2026-10-01');
    const lastWeek = weeks[weeks.length - 1];
    const futureDays = lastWeek.days.filter(d => d.isFuture);
    assert.strictEqual(futureDays.length, 3); // Viernes, sábado, domingo
});

// ============================================
// Tests para getMonthLabels (RF-5)
// ============================================

test('getMonthLabels genera etiquetas correctas', () => {
    const weeks = getWeeksInRange('2026-07-13', '2026-10-04', '2026-10-04');
    const labels = getMonthLabels(weeks);
    assert.ok(labels.length >= 3); // Al menos Jul, Ago, Sep, Oct
    assert.strictEqual(labels[0].label, 'Jul');
});

test('getMonthLabels detecta cambio de mes', () => {
    const weeks = getWeeksInRange('2026-09-28', '2026-10-25', '2026-10-04');
    const labels = getMonthLabels(weeks);
    const sepLabel = labels.find(l => l.label === 'Sep');
    const octLabel = labels.find(l => l.label === 'Oct');
    assert.ok(sepLabel);
    assert.ok(octLabel);
    assert.ok(sepLabel.colIndex < octLabel.colIndex);
});
