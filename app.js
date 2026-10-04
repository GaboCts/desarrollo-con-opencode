// ============================================
// Diario de Estudio - Lógica principal
// ============================================

// --- CONSTANTES Y SELECTORES ---
const STORAGE_KEY = 'diario_estudio_sesiones';

const form = document.getElementById('study-form');
const dateInput = document.getElementById('date');
const subjectInput = document.getElementById('subject');
const minutesInput = document.getElementById('minutes');
const sessionsListContainer = document.getElementById('sessions-list');
const streakNumberElement = document.getElementById('streak-number');
const bestStreakNumberElement = document.getElementById('best-streak-number');
const weeklyMinutesElement = document.getElementById('weekly-minutes');
const monthlyDaysElement = document.getElementById('monthly-days');

// Selectores del mapa de calor
const heatmapGrid = document.getElementById('heatmap-grid');
const heatmapMonths = document.getElementById('heatmap-months');
const heatmapTooltip = document.getElementById('heatmap-tooltip');

// --- FUNCIONES DE UTILIDAD DE FECHAS (Local) ---

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function subtractDays(dateString, days) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - days);
    return getLocalDateString(date);
}

function addDays(dateString, days) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
}

function formatDateReadable(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- GESTIÓN DE DATOS (localStorage) ---

function getSessions() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// --- CÁLCULO DE LA RACHA ACTUAL ---

function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;

    const studyDates = new Set(sessions.map(s => s.date));
    const todayStr = getLocalDateString();
    const yesterdayStr = subtractDays(todayStr, 1);

    let startDateStr = '';

    if (studyDates.has(todayStr)) {
        startDateStr = todayStr;
    } else if (studyDates.has(yesterdayStr)) {
        startDateStr = yesterdayStr;
    } else {
        return 0;
    }

    let streak = 0;
    let currentDateStr = startDateStr;

    while (studyDates.has(currentDateStr)) {
        streak++;
        currentDateStr = subtractDays(currentDateStr, 1);
    }

    return streak;
}

// --- CÁLCULO DE LA MEJOR RACHA ---

function calculateBestStreak(sessions) {
    if (sessions.length === 0) return 0;

    const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort();
    
    if (uniqueDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = uniqueDates[i - 1];
        const currDate = uniqueDates[i];

        if (addDays(prevDate, 1) === currDate) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
    }

    return maxStreak;
}

// --- CÁLCULO DE MINUTOS DE THE WEEK ---

function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    monday.setDate(monday.getDate() - distanceToMonday);

    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
    sunday.setDate(sunday.getDate() + 6);

    return {
        start: getLocalDateString(monday),
        end: getLocalDateString(sunday)
    };
}

function calculateWeeklyMinutes(sessions) {
    const { start, end } = getCurrentWeekRange();

    return sessions
        .filter(s => s.date >= start && s.date <= end)
        .reduce((total, s) => total + Number(s.minutes), 0);
}

// --- CÁLCULO DE DÍAS ESTUDIADOS ESTE MES ---

function calculateDaysThisMonth(sessions) {
    if (sessions.length === 0) return 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const uniqueDatesThisMonth = new Set(
        sessions
            .filter(s => {
                const [year, month] = s.date.split('-').map(Number);
                return year === currentYear && month === currentMonth + 1;
            })
            .map(s => s.date)
    );

    return uniqueDatesThisMonth.size;
}

// --- MAPA DE CALOR ---

function renderHeatMap(sessions) {
    const today = getLocalDateString();
    const range = HeatMapLib.getHeatMapRange(today);
    const data = HeatMapLib.buildHeatMapData(sessions, today);
    const weeks = HeatMapLib.getWeeksInRange(range.startDate, range.endDate, today);
    const monthLabels = HeatMapLib.getMonthLabels(weeks);

    // Renderizar etiquetas de mes
    heatmapMonths.innerHTML = '<span></span>'; // Espacio para días de la semana
    for (let i = 0; i < 12; i++) {
        const label = monthLabels.find(l => l.colIndex === i);
        const span = document.createElement('span');
        span.textContent = label ? label.label : '';
        heatmapMonths.appendChild(span);
    }

    // Renderizar cuadrícula
    heatmapGrid.innerHTML = '';

    weeks.forEach(week => {
        week.days.forEach(day => {
            // Ocultar días de semanas futuras
            if (day.isFuture && !day.isCurrentWeek) {
                return;
            }

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.dataset.date = day.date;

            const dayData = data.get(day.date);
            const minutes = dayData ? dayData.minutes : 0;
            const color = HeatMapLib.getDayColor(minutes);

            cell.style.backgroundColor = color;

            if (day.isFuture) {
                cell.classList.add('future');
                cell.style.backgroundColor = HeatMapLib.COLORS.FUTURE;
            }

            // Click para mostrar ventana emergente
            cell.addEventListener('click', (e) => {
                showTooltip(e, day.date, dayData);
            });

            heatmapGrid.appendChild(cell);
        });
    });
}

function showTooltip(event, date, dayData) {
    const minutes = dayData ? dayData.minutes : 0;
    const topics = dayData ? dayData.topics : [];

    let html = `<div class="tooltip-date">${formatDateReadable(date)}</div>`;
    html += `<div class="tooltip-minutes">${minutes} min</div>`;

    if (topics.length > 0) {
        html += '<div class="tooltip-topics">';
        const maxTopics = 5;
        const displayTopics = topics.slice(0, maxTopics);
        html += displayTopics.map(t => `• ${escapeHTML(t)}`).join('<br>');
        if (topics.length > maxTopics) {
            html += `<br><span class="tooltip-more">+${topics.length - maxTopics} más</span>`;
        }
        html += '</div>';
    } else {
        html += '<div class="tooltip-topics">Sin temas</div>';
    }

    heatmapTooltip.innerHTML = html;
    heatmapTooltip.classList.add('visible');

    // Posicionar cerca del click
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    heatmapTooltip.style.left = `${x}px`;
    heatmapTooltip.style.top = `${y}px`;
}

function hideTooltip() {
    heatmapTooltip.classList.remove('visible');
}

// --- RENDERIZADO DE LA INTERFAZ ---

function render() {
    const sessions = getSessions();

    // 1. Ordenar sesiones
    sessions.sort((a, b) => {
        if (b.date !== a.date) {
            return b.date.localeCompare(a.date);
        }
        return (b.id || 0) - (a.id || 0);
    });

    // 2. Actualizar métricas
    const streak = calculateStreak(sessions);
    const bestStreak = calculateBestStreak(sessions);
    const weeklyMinutes = calculateWeeklyMinutes(sessions);
    const monthlyDays = calculateDaysThisMonth(sessions);

    streakNumberElement.textContent = streak;
    bestStreakNumberElement.textContent = bestStreak;
    weeklyMinutesElement.textContent = weeklyMinutes;
    monthlyDaysElement.textContent = monthlyDays;

    // 3. Renderizar lista de sesiones
    sessionsListContainer.innerHTML = '';

    if (sessions.length === 0) {
        sessionsListContainer.innerHTML = '<p class="empty-state">No hay sesiones registradas todavía. ¡Empieza hoy!</p>';
    } else {
        sessions.forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item';

            item.innerHTML = `
                <div class="session-info">
                    <span class="session-subject">${escapeHTML(session.subject)}</span>
                    <span class="session-date">${formatDateReadable(session.date)}</span>
                </div>
                <div class="session-minutes">
                    ${session.minutes} min
                </div>
            `;

            sessionsListContainer.appendChild(item);
        });
    }

    // 4. Renderizar mapa de calor
    renderHeatMap(sessions);
}

// --- UTILIDADES ---

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// --- GESTIÓN DE EVENTOS ---

function init() {
    dateInput.value = getLocalDateString();
    render();

    form.addEventListener('submit', handleFormSubmit);

    // Ocultar tooltip al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('heatmap-cell')) {
            hideTooltip();
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const date = dateInput.value;
    const subject = subjectInput.value.trim();
    const minutes = parseInt(minutesInput.value, 10);

    if (!date || !subject || isNaN(minutes) || minutes <= 0) {
        alert('Por favor, completa todos los campos correctamente. Los minutos deben ser mayores que 0.');
        return;
    }

    const newSession = {
        id: Date.now(),
        date: date,
        subject: subject,
        minutes: minutes
    };

    const sessions = getSessions();
    sessions.push(newSession);
    saveSessions(sessions);

    subjectInput.value = '';
    minutesInput.value = '';
    dateInput.value = getLocalDateString();

    render();
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
