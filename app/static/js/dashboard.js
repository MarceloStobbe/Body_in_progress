document.addEventListener('DOMContentLoaded', () => {
    loadDashboardQuickMetrics();
    loadWorkoutStreakMetrics();
});

function loadDashboardQuickMetrics() {
    const bodyHistory = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    if (bodyHistory.length > 0) {
        const latestWeight = bodyHistory[bodyHistory.length - 1].Weight;
        if (latestWeight > 0) {
            document.getElementById('dashCardWeight').textContent = latestWeight + ' kg';
        }
    }

    const consumedSleep = localStorage.getItem('sleep_consumed_today');
    if (consumedSleep !== null && consumedSleep !== '') {
        document.getElementById('dashCardSleep').textContent = parseFloat(consumedSleep).toFixed(1) + ' hrs';
    }

    const consumedWater = localStorage.getItem('water_consumed_today');
    if (consumedWater !== null && consumedWater !== '') {
        document.getElementById('dashCardWater').textContent = parseFloat(consumedWater).toFixed(1) + ' L';
    }
}

function loadWorkoutStreakMetrics() {
    const daysEl = document.getElementById('dashWorkoutDays');
    const labelEl = document.getElementById('dashWorkoutDaysLabel');
    const barEl = document.getElementById('dashConsistencyBar');
    const textEl = document.getElementById('dashConsistencyText');

    if (!daysEl || !labelEl || !barEl || !textEl) {
        return;
    }

    const weeklyDays = getWeeklyCompletedWorkoutDays();
    const routineCount = getConfiguredRoutineCount();
    const stepPercentage = 100 / routineCount;
    const rawConsistency = Math.min(100, weeklyDays * stepPercentage);
    const formattedConsistency = formatConsistencyPercentage(rawConsistency);

    daysEl.textContent = weeklyDays;
    labelEl.textContent = weeklyDays === 1 ? 'day' : 'days';
    barEl.style.width = rawConsistency + '%';
    barEl.setAttribute('aria-valuenow', Math.round(rawConsistency));
    textEl.textContent = `Consistency target: ${formattedConsistency}% achieved`;
}

function getConfiguredRoutineCount() {
    const routines = JSON.parse(localStorage.getItem('bip_custom_routines') || '[]');
    if (Array.isArray(routines) && routines.length > 0) {
        return Math.min(8, Math.max(1, routines.length));
    }
    return 1;
}

function getWeeklyCompletedWorkoutDays() {
    const muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    if (!muscleHistory || typeof muscleHistory !== 'object') {
        return 0;
    }

    const weekDates = getCurrentWeekDateStrings();
    const activeDays = new Set();

    Object.keys(muscleHistory).forEach((muscleGroup) => {
        const logs = muscleHistory[muscleGroup];
        if (!Array.isArray(logs)) {
            return;
        }
        logs.forEach((dayLog) => {
            if (dayLog && dayLog.date && weekDates.has(dayLog.date)) {
                const hasSets = Array.isArray(dayLog.exercises) && dayLog.exercises.some(
                    (ex) => Array.isArray(ex.sets) && ex.sets.length > 0
                );
                if (hasSets) {
                    activeDays.add(dayLog.date);
                }
            }
        });
    });

    return activeDays.size;
}

function getCurrentWeekDateStrings() {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const dates = new Set();
    const cursor = new Date(startOfWeek);
    while (cursor <= endOfWeek) {
        const year = cursor.getFullYear();
        const month = String(cursor.getMonth() + 1).padStart(2, '0');
        const day = String(cursor.getDate()).padStart(2, '0');
        dates.add(`${year}-${month}-${day}`);
        cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
}

function formatConsistencyPercentage(value) {
    const rounded = Math.round(value * 100) / 100;
    if (Number.isInteger(rounded)) {
        return String(rounded);
    }
    return rounded.toFixed(2).replace(/\.?0+$/, '');
}