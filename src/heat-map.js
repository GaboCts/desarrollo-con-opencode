// ============================================
// Lógica pura del mapa de calor
// Sin DOM, sin localStorage. Funciones puras.
// ============================================

// Constantes de color (estilo GitHub)
const COLORS = {
    EMPTY: '#ebedf0',
    LEVEL_1: '#9be9a8',
    LEVEL_2: '#40c463',
    LEVEL_3: '#30a14e',
    LEVEL_4: '#216e39',
    FUTURE: '#f6f8fa'
};

// Niveles de minutos para cada color
const LEVELS = [
    { min: 0, max: 0, color: COLORS.EMPTY },
    { min: 1, max: 30, color: COLORS.LEVEL_1 },
    { min: 31, max: 60, color: COLORS.LEVEL_2 },
    { min: 61, max: 120, color: COLORS.LEVEL_3 },
    { min: 121, max: Infinity, color: COLORS.LEVEL_4 }
];

/**
 * Obtiene la fecha en formato YYYY-MM-DD usando hora local
 */
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Resta días a una fecha YYYY-MM-DD (hora local)
 */
function subtractDays(dateString, days) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - days);
    return getLocalDateString(date);
}

/**
 * Suma días a una fecha YYYY-MM-DD (hora local)
 */
function addDays(dateString, days) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
}

/**
 * RF-1: Calcula el rango de 12 semanas que termina en la semana actual
 * @param {string} today - Fecha actual en formato YYYY-MM-DD
 * @returns {{ startDate: string, endDate: string }}
 */
function getHeatMapRange(today) {
    const [year, month, day] = today.split('-').map(Number);
    const todayDate = new Date(year, month - 1, day);
    const dayOfWeek = todayDate.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

    // Distancia al lunes (si es domingo, 6 días atrás)
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Lunes de la semana actual
    const mondayThisWeek = subtractDays(today, distanceToMonday);

    // Lunes de la primera semana (11 semanas antes)
    const startDate = subtractDays(mondayThisWeek, 77); // 11 * 7 = 77 días

    // Domingo de la semana actual
    const endDate = addDays(mondayThisWeek, 6);

    return { startDate, endDate };
}

/**
 * RF-1, RF-2, RF-3: Agrupa sesiones por fecha
 * @param {Array} sessions - Array de sesiones { date, minutes, subject }
 * @param {string} today - Fecha actual en formato YYYY-MM-DD
 * @returns {Map<string, { minutes: number, topics: string[] }>}
 */
function buildHeatMapData(sessions, today) {
    const data = new Map();

    for (const session of sessions) {
        // Ignorar sesiones futuras
        if (session.date > today) continue;

        // Ignorar minutos <= 0
        const minutes = Number(session.minutes);
        if (minutes <= 0) continue;

        if (!data.has(session.date)) {
            data.set(session.date, { minutes: 0, topics: [] });
        }

        const dayData = data.get(session.date);
        dayData.minutes += minutes;

        // Añadir tema si no está ya
        const subject = session.subject || 'Sin tema';
        if (!dayData.topics.includes(subject)) {
            dayData.topics.push(subject);
        }
    }

    return data;
}

/**
 * RF-2: Devuelve el color según los minutos estudiados
 * @param {number} minutes - Minutos estudiados
 * @returns {string} Color en formato hex
 */
function getDayColor(minutes) {
    if (minutes <= 0) return COLORS.EMPTY;

    for (const level of LEVELS) {
        if (minutes >= level.min && minutes <= level.max) {
            return level.color;
        }
    }

    return COLORS.EMPTY;
}

/**
 * RF-1: Genera la estructura de semanas con sus días
 * @param {string} startDate - Fecha de inicio YYYY-MM-DD
 * @param {string} endDate - Fecha de fin YYYY-MM-DD
 * @param {string} today - Fecha actual YYYY-MM-DD
 * @returns {Array<{ weekStart: string, days: Array<{ date: string, isFuture: boolean, isCurrentWeek: boolean }> }>}
 */
function getWeeksInRange(startDate, endDate, today) {
    const weeks = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const days = [];
        const weekStart = currentDate;

        for (let i = 0; i < 7; i++) {
            const dayDate = addDays(weekStart, i);
            const isFuture = dayDate > today;

            // Verificar si es la semana actual
            const [y, m, d] = today.split('-').map(Number);
            const todayDateObj = new Date(y, m - 1, d);
            const dayOfWeek = todayDateObj.getDay();
            const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const mondayThisWeek = subtractDays(today, distanceToMonday);
            const sundayThisWeek = addDays(mondayThisWeek, 6);
            const isCurrentWeek = dayDate >= mondayThisWeek && dayDate <= sundayThisWeek;

            days.push({
                date: dayDate,
                isFuture,
                isCurrentWeek
            });
        }

        weeks.push({ weekStart, days });
        currentDate = addDays(weekStart, 7);
    }

    return weeks;
}

/**
 * RF-5: Genera etiquetas de mes para el eje horizontal
 * @param {Array} weeks - Array de semanas
 * @returns {Array<{ label: string, colIndex: number }>}
 */
function getMonthLabels(weeks) {
    const labels = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    let lastMonth = -1;

    weeks.forEach((week, index) => {
        const [year, month] = week.weekStart.split('-').map(Number);
        const monthIndex = month - 1;

        if (monthIndex !== lastMonth) {
            labels.push({
                label: monthNames[monthIndex],
                colIndex: index
            });
            lastMonth = monthIndex;
        }
    });

    return labels;
}

// Exportar para tests (Node.js) y uso en navegador
const HeatMapLib = {
    COLORS,
    getLocalDateString,
    subtractDays,
    addDays,
    getHeatMapRange,
    buildHeatMapData,
    getDayColor,
    getWeeksInRange,
    getMonthLabels
};

// Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeatMapLib;
}

// Navegador
if (typeof window !== 'undefined') {
    window.HeatMapLib = HeatMapLib;
}
