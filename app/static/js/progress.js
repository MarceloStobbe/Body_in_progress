let workoutChartInstance = null;
let durationChartInstance = null;
let bodyChartInstance = null;
let measurementsChartInstance = null;
let sleepChartInstance = null;
let waterChartInstance = null;
let overlayChartInstance = null;

let selectedMeasurementRegion = 'All';

document.addEventListener('DOMContentLoaded', () => {
    loadProgressSavedState();

    window.addEventListener('resize', () => {
        const analyticsEl = document.getElementById('progressAnalyticsContent');
        if (analyticsEl && !analyticsEl.classList.contains('d-none')) {
            loadAndRenderAnalytics();
        }
    });
});

function toggleProgressContainer(checkbox) {
    const container = document.getElementById('progressAnalyticsContent');
    localStorage.setItem('progress_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        container.classList.remove('d-none');
        loadAndRenderAnalytics();
    } else {
        container.classList.add('d-none');
    }
}

function saveProgressConfiguration() {
    localStorage.setItem('progress_configured', 'true');
    localStorage.setItem('progress_hub_optin', 'false');
    document.getElementById('progressConfigContainer').classList.add('d-none');
    document.getElementById('progressAnalyticsContent').classList.remove('d-none');
    loadAndRenderAnalytics();
}

function openProgressConfigurationHub() {
    document.getElementById('progressConfigContainer').classList.remove('d-none');
    document.getElementById('progressHubOptIn').checked = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadProgressSavedState() {
    const isConfigured = localStorage.getItem('progress_configured') === 'true';
    const optIn = localStorage.getItem('progress_hub_optin') === 'true';
    
    if (isConfigured || optIn) {
        document.getElementById('progressConfigContainer').classList.add('d-none');
        document.getElementById('progressAnalyticsContent').classList.remove('d-none');
        loadAndRenderAnalytics();
    } else {
        document.getElementById('progressConfigContainer').classList.remove('d-none');
        document.getElementById('progressHubOptIn').checked = false;
        document.getElementById('progressAnalyticsContent').classList.add('d-none');
    }
}

function getDatesRange(days) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

function isNarrowScreen() {
    return window.innerWidth < 576;
}

function formatCompactAxisNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '';
    const abs = Math.abs(val);
    if (abs >= 1000000) return `${(val / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (abs >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return Number.isInteger(val) ? String(val) : String(Number(val.toFixed(1)));
}

function formatCleanValue(val, decimals = 1) {
    if (val === null || val === undefined || isNaN(val)) return '';
    const num = Number(val);
    if (Number.isInteger(num)) return String(num);
    return num.toFixed(decimals).replace(/\.?0+$/, '');
}

function getResponsiveChartOptions(unitSuffix = '', showLegend = false) {
    const narrow = isNarrowScreen();
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: showLegend,
                position: 'top',
                labels: {
                    boxWidth: narrow ? 10 : 12,
                    padding: narrow ? 8 : 12,
                    color: '#cbd5e1',
                    font: {
                        size: narrow ? 10 : 11,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                enabled: true,
                padding: 8,
                titleFont: { size: narrow ? 11 : 12 },
                bodyFont: { size: narrow ? 11 : 12 },
                callbacks: {
                    label: function(context) {
                        const raw = context.parsed.y;
                        if (raw === null || raw === undefined) return `${context.dataset.label}: --`;
                        const formatted = formatCleanValue(raw, 2);
                        const suffix = unitSuffix ? ` ${unitSuffix}` : '';
                        return `${context.dataset.label}: ${formatted}${suffix}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: narrow ? 5 : 7,
                    font: {
                        size: narrow ? 9.5 : 10.5
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.12)'
                },
                ticks: {
                    color: '#94a3b8',
                    maxTicksLimit: narrow ? 4 : 5,
                    font: {
                        size: narrow ? 9.5 : 10.5
                    },
                    callback: function(value) {
                        const compact = formatCompactAxisNumber(value);
                        return unitSuffix ? `${compact} ${unitSuffix}` : compact;
                    }
                }
            }
        }
    };
}

function loadAndRenderAnalytics() {
    const timeframeDays = parseInt(document.getElementById('analyticsTimeframe').value);
    const dates = getDatesRange(timeframeDays);

    const workoutLogs = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const bodyLogs = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const sleepLogs = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const waterLogs = JSON.parse(localStorage.getItem('water_metrics_history') || '{}');

    const workoutData = dates.map(d => calculateDailyWorkoutVolume(workoutLogs, d));
    const durationData = dates.map(d => getWorkoutDurationMinutesForDate(workoutLogs, d));
    const bodyData = dates.map(d => getBodyMetricForDate(bodyLogs, d));
    const sleepData = dates.map(d => getSleepHoursForDate(sleepLogs, d));
    const waterData = dates.map(d => getWaterVolumeForDate(waterLogs, d));

    renderWorkoutChart(dates, workoutData);
    renderDurationChart(dates, durationData);
    renderBodyChart(dates, bodyData, bodyLogs);
    renderMeasurementsChart(dates, bodyLogs);
    renderSleepChart(dates, sleepData);
    renderWaterChart(dates, waterData);
    renderOverlayChart(dates, workoutData, sleepData, waterData);

    generateCorrelationInsights(workoutData, sleepData, waterData, bodyData);
}

function calculateDailyWorkoutVolume(workoutLogs, dateStr) {
    let vol = 0;
    Object.keys(workoutLogs).forEach(mg => {
        const dayLog = workoutLogs[mg].find(l => l.date === dateStr);
        if (dayLog) {
            dayLog.exercises.forEach(ex => {
                ex.sets.forEach(s => {
                    vol += (s.kg * s.reps);
                });
            });
        }
    });
    return vol;
}

function getWorkoutDurationMinutesForDate(workoutLogs, dateStr) {
    let minutes = 0;
    let hasSession = false;

    const sessionHistory = JSON.parse(localStorage.getItem('bip_workout_sessions') || '[]');
    if (Array.isArray(sessionHistory)) {
        const foundSession = sessionHistory.find(s => s && s.date === dateStr);
        if (foundSession) {
            const rawSec = Number(foundSession.durationSeconds ?? foundSession.seconds ?? 0);
            const rawMin = Number(foundSession.durationMinutes ?? foundSession.minutes ?? 0);
            if (rawSec > 0) {
                minutes += rawSec / 60;
                hasSession = true;
            } else if (rawMin > 0) {
                minutes += rawMin;
                hasSession = true;
            }
        }
    }

    Object.keys(workoutLogs).forEach(mg => {
        const dayLog = workoutLogs[mg].find(l => l.date === dateStr);
        if (dayLog) {
            if (typeof dayLog.durationMinutes === 'number' && dayLog.durationMinutes > 0) {
                minutes = Math.max(minutes, dayLog.durationMinutes);
                hasSession = true;
            } else if (typeof dayLog.durationSeconds === 'number' && dayLog.durationSeconds > 0) {
                minutes = Math.max(minutes, dayLog.durationSeconds / 60);
                hasSession = true;
            } else if (!hasSession) {
                let totalSets = 0;
                (dayLog.exercises || []).forEach(ex => {
                    totalSets += (ex.sets || []).length;
                });
                if (totalSets > 0) {
                    minutes += totalSets * 2.5;
                }
            }
        }
    });

    return Number(minutes.toFixed(1));
}

function getBodyMetricForDate(bodyLogs, dateStr) {
    const entry = bodyLogs.find(b => b.date === dateStr);
    return entry ? parseFloat(entry.Weight) : null;
}

function getSleepHoursForDate(sleepLogs, dateStr) {
    const entry = sleepLogs.find(s => s.date === dateStr);
    return entry ? parseFloat(entry.hours) : null;
}

function getWaterVolumeForDate(waterLogs, dateStr) {
    if (Array.isArray(waterLogs)) {
        const entry = waterLogs.find(w => w.date === dateStr);
        return entry ? parseFloat(entry.volume) : 0;
    } else {
        return (waterLogs[dateStr] || 0) / 1000;
    }
}

function renderWorkoutChart(labels, data) {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    if (workoutChartInstance) workoutChartInstance.destroy();

    const totalVol = data.reduce((a, b) => a + b, 0);
    document.getElementById('workoutTrendBadge').textContent = totalVol > 0 ? `${formatCompactAxisNumber(Math.round(totalVol))} kg` : 'No logs';

    const activeDays = data.filter(v => v > 0).length;
    let textDesc = "Shows daily training volume (kg × reps) across the selected period. No training volume logged yet; recording workout sets will reveal session frequency, average load per session, and progressive overload consistency.";
    if (activeDays > 0) {
        const avgVol = Math.round(totalVol / activeDays);
        textDesc = `Shows daily training volume (kg × reps) across the selected period: ${activeDays} active workout days with an average of ${formatCompactAxisNumber(avgVol)} kg per session and ${formatCompactAxisNumber(Math.round(totalVol))} kg total volume.`;
    }
    document.getElementById('workoutAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('kg', false);

    workoutChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Volume',
                data: data,
                backgroundColor: 'rgba(212, 175, 55, 0.72)',
                borderColor: 'var(--accent-color)',
                borderWidth: 1.5,
                borderRadius: 4,
                maxBarThickness: isNarrowScreen() ? 14 : 22
            }]
        },
        options: opts
    });
}

function renderDurationChart(labels, data) {
    const ctx = document.getElementById('durationChart').getContext('2d');
    if (durationChartInstance) durationChartInstance.destroy();

    const totalMin = data.reduce((a, b) => a + b, 0);
    const activeDays = data.filter(v => v > 0).length;

    let textDesc = "Shows time spent training (in minutes) per session day across the selected period. No workout duration logged yet; completing sessions will show training time consistency and average session length.";
    if (activeDays > 0) {
        const avgMin = Math.round(totalMin / activeDays);
        const totalHrs = formatCleanValue(totalMin / 60, 1);
        document.getElementById('durationTrendBadge').textContent = `${avgMin}m avg`;
        textDesc = `Shows time spent training (in minutes) per session day: ${activeDays} active days with an average of ${avgMin} min/session and ${formatCleanValue(Math.round(totalMin), 0)} min (${totalHrs}h) total time.`;
    } else {
        document.getElementById('durationTrendBadge').textContent = 'No logs';
    }

    document.getElementById('durationAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('min', false);

    durationChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Duration',
                data: data,
                backgroundColor: 'rgba(212, 175, 55, 0.55)',
                borderColor: '#d4af37',
                borderWidth: 1.5,
                borderRadius: 4,
                maxBarThickness: isNarrowScreen() ? 14 : 22
            }]
        },
        options: opts
    });
}

function renderBodyChart(labels, data, bodyLogs) {
    const ctx = document.getElementById('bodyChart').getContext('2d');
    if (bodyChartInstance) bodyChartInstance.destroy();

    const validData = data.filter(v => v !== null);
    let textDesc = "Tracks body weight measurements over time and compares current weight against height for BMI reference. No weight measurements recorded yet in this period.";
    
    if (validData.length > 0) {
        const firstW = validData[0];
        const lastW = validData[validData.length - 1];
        const diff = Number((lastW - firstW).toFixed(1));
        const latestEntry = bodyLogs[bodyLogs.length - 1];
        
        let bmiStr = "";
        if (latestEntry && latestEntry.Height > 0) {
            const bmi = lastW / (latestEntry.Height * latestEntry.Height);
            bmiStr = ` Current BMI is ${bmi.toFixed(1)}.`;
        }

        if (diff > 0) {
            textDesc = `Tracks body weight over time: gained +${formatCleanValue(diff, 1)} kg across the period, reaching ${formatCleanValue(lastW, 1)} kg.${bmiStr}`;
            document.getElementById('bodyTrendBadge').textContent = `+${formatCleanValue(diff, 1)} kg`;
        } else if (diff < 0) {
            textDesc = `Tracks body weight over time: changed by ${formatCleanValue(diff, 1)} kg across the period, currently at ${formatCleanValue(lastW, 1)} kg.${bmiStr}`;
            document.getElementById('bodyTrendBadge').textContent = `${formatCleanValue(diff, 1)} kg`;
        } else {
            textDesc = `Tracks body weight over time: weight remained steady at ${formatCleanValue(lastW, 1)} kg across the period.${bmiStr}`;
            document.getElementById('bodyTrendBadge').textContent = `${formatCleanValue(lastW, 1)} kg`;
        }
    } else {
        document.getElementById('bodyTrendBadge').textContent = 'No logs';
    }

    document.getElementById('bodyAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('kg', false);
    opts.scales.y.beginAtZero = false;

    bodyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Weight',
                data: data,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.15)',
                fill: true,
                tension: 0.3,
                pointRadius: isNarrowScreen() ? 2 : 3,
                spanGaps: true
            }]
        },
        options: opts
    });
}

function extractMeasurementRegions(bodyLogs) {
    const regions = new Set();
    const ignoredKeys = new Set(['date', 'Weight', 'weight', 'Height', 'height', 'bodyFat', 'body_fat']);

    (bodyLogs || []).forEach(entry => {
        if (!entry || typeof entry !== 'object') return;
        if (entry.measurements && typeof entry.measurements === 'object') {
            Object.keys(entry.measurements).forEach(k => {
                if (!ignoredKeys.has(k) && entry.measurements[k] !== null && entry.measurements[k] !== '' && !isNaN(parseFloat(entry.measurements[k]))) {
                    regions.add(k);
                }
            });
        }
        Object.keys(entry).forEach(k => {
            if (!ignoredKeys.has(k) && entry[k] !== null && entry[k] !== '' && !isNaN(parseFloat(entry[k]))) {
                regions.add(k);
            }
        });
    });

    return Array.from(regions);
}

function getMeasurementValueForDate(bodyLogs, dateStr, regionKey) {
    const entry = (bodyLogs || []).find(b => b.date === dateStr);
    if (!entry) return null;
    if (entry.measurements && entry.measurements[regionKey] !== undefined && entry.measurements[regionKey] !== '') {
        const val = parseFloat(entry.measurements[regionKey]);
        return isNaN(val) ? null : val;
    }
    if (entry[regionKey] !== undefined && entry[regionKey] !== '') {
        const val = parseFloat(entry[regionKey]);
        return isNaN(val) ? null : val;
    }
    return null;
}

function renderMeasurementTabs(regions) {
    const tabsEl = document.getElementById('measurementRegionTabs');
    if (!tabsEl) return;
    tabsEl.innerHTML = '';

    if (regions.length === 0) return;

    const options = ['All', ...regions];
    if (!options.includes(selectedMeasurementRegion)) {
        selectedMeasurementRegion = 'All';
    }

    options.forEach(reg => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = selectedMeasurementRegion === reg;
        btn.className = `btn btn-sm py-0 px-2 rounded-pill fw-bold ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`;
        btn.style.fontSize = '0.7rem';
        if (!isActive) {
            btn.style.color = '#cbd5e1';
            btn.style.borderColor = 'rgba(148, 163, 184, 0.3)';
        }
        btn.textContent = reg === 'All' ? 'All Regions' : reg;
        btn.addEventListener('click', () => {
            selectedMeasurementRegion = reg;
            loadAndRenderAnalytics();
        });
        tabsEl.appendChild(btn);
    });
}

function renderMeasurementsChart(labels, bodyLogs) {
    const ctx = document.getElementById('measurementsChart').getContext('2d');
    if (measurementsChartInstance) measurementsChartInstance.destroy();

    const regions = extractMeasurementRegions(bodyLogs);
    renderMeasurementTabs(regions);

    const palette = ['#0d6efd', '#20c997', '#d4af37', '#0dcaf0', '#a855f7', '#f97316'];
    const activeRegions = selectedMeasurementRegion === 'All'
        ? regions.slice(0, 4)
        : [selectedMeasurementRegion];

    let hasAnyMeasurement = false;
    let summaryParts = [];

    const datasets = activeRegions.map((reg, idx) => {
        const series = labels.map(d => getMeasurementValueForDate(bodyLogs, d, reg));
        const valid = series.filter(v => v !== null);
        if (valid.length > 0) {
            hasAnyMeasurement = true;
            const firstVal = valid[0];
            const lastVal = valid[valid.length - 1];
            const diff = Number((lastVal - firstVal).toFixed(1));
            const sign = diff > 0 ? '+' : '';
            summaryParts.push(`${reg}: ${formatCleanValue(lastVal, 1)} cm (${sign}${formatCleanValue(diff, 1)})`);
        }

        const color = palette[idx % palette.length];
        return {
            label: reg,
            data: series,
            borderColor: color,
            backgroundColor: 'transparent',
            tension: 0.25,
            pointRadius: isNarrowScreen() ? 2 : 2.5,
            spanGaps: true
        };
    });

    let textDesc = "Tracks body circumference changes (in cm) across recorded body regions. No body measurements logged yet; adding regional measurements will display area-by-area progress.";
    if (hasAnyMeasurement) {
        if (selectedMeasurementRegion === 'All') {
            document.getElementById('measurementsTrendBadge').textContent = `${activeRegions.length} areas`;
            textDesc = `Tracks body circumference changes (in cm) across recorded regions (${summaryParts.join(' · ')}). Use the filter buttons above to inspect a single region.`;
        } else {
            const firstMatch = summaryParts[0] || `${selectedMeasurementRegion}`;
            const series = labels.map(d => getMeasurementValueForDate(bodyLogs, d, selectedMeasurementRegion)).filter(v => v !== null);
            const diff = series.length > 1 ? Number((series[series.length - 1] - series[0]).toFixed(1)) : 0;
            const badgeDiff = `${diff > 0 ? '+' : ''}${formatCleanValue(diff, 1)} cm`;
            document.getElementById('measurementsTrendBadge').textContent = badgeDiff;
            textDesc = `Focused view for ${firstMatch} over the selected period, showing exact circumference progression in centimeters.`;
        }
    } else {
        document.getElementById('measurementsTrendBadge').textContent = 'No logs';
    }

    document.getElementById('measurementsAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('cm', datasets.length > 1);
    opts.scales.y.beginAtZero = false;

    measurementsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: datasets
        },
        options: opts
    });
}

function renderSleepChart(labels, data) {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    if (sleepChartInstance) sleepChartInstance.destroy();

    const validData = data.filter(v => v !== null);
    let textDesc = "Monitors nightly sleep hours to evaluate recovery readiness. No sleep records logged yet for this timeframe.";
    
    if (validData.length > 0) {
        const avgSleep = validData.reduce((a, b) => a + b, 0) / validData.length;
        const cleanAvg = formatCleanValue(avgSleep, 1);
        document.getElementById('sleepTrendBadge').textContent = `${cleanAvg}h avg`;
        
        textDesc = avgSleep < 7.0
            ? `Monitors nightly sleep hours across ${validData.length} logged days: average is ${cleanAvg}h/day, which is below the 7h–9h target for full recovery.`
            : `Monitors nightly sleep hours across ${validData.length} logged days: average is ${cleanAvg}h/day, supporting consistent recovery and energy.`;
    } else {
        document.getElementById('sleepTrendBadge').textContent = 'No logs';
    }

    document.getElementById('sleepAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('h', false);

    sleepChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Sleep',
                data: data,
                borderColor: '#0dcaf0',
                backgroundColor: 'rgba(13, 202, 240, 0.18)',
                fill: true,
                tension: 0.25,
                pointRadius: isNarrowScreen() ? 2 : 3,
                spanGaps: true
            }]
        },
        options: opts
    });
}

function renderWaterChart(labels, data) {
    const ctx = document.getElementById('waterChart').getContext('2d');
    if (waterChartInstance) waterChartInstance.destroy();

    const totalWater = data.reduce((a, b) => a + b, 0);
    const activeDays = data.filter(v => v > 0).length;
    let textDesc = "Tracks daily water intake in liters to show hydration consistency. No hydration records logged yet in this period.";

    if (activeDays > 0) {
        const avgWater = totalWater / activeDays;
        const cleanAvg = formatCleanValue(avgWater, 1);
        document.getElementById('waterTrendBadge').textContent = `${cleanAvg}L avg`;
        
        textDesc = avgWater < 2.0
            ? `Tracks daily water intake in liters across ${activeDays} logged days: average is ${cleanAvg}L/day (${formatCleanValue(totalWater, 1)}L total), below the 2L daily reference.`
            : `Tracks daily water intake in liters across ${activeDays} logged days: average is ${cleanAvg}L/day (${formatCleanValue(totalWater, 1)}L total), supporting steady hydration.`;
    } else {
        document.getElementById('waterTrendBadge').textContent = 'No logs';
    }

    document.getElementById('waterAnalysisText').textContent = textDesc;

    const opts = getResponsiveChartOptions('L', false);

    waterChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Water',
                data: data,
                backgroundColor: 'rgba(13, 202, 240, 0.65)',
                borderColor: '#0dcaf0',
                borderWidth: 1.5,
                borderRadius: 4,
                maxBarThickness: isNarrowScreen() ? 14 : 22
            }]
        },
        options: opts
    });
}

function renderOverlayChart(labels, workoutVol, sleepHrs, waterL) {
    const ctx = document.getElementById('overlayChart').getContext('2d');
    if (overlayChartInstance) overlayChartInstance.destroy();

    const validSleep = sleepHrs.filter(s => s !== null);
    const avgSleep = validSleep.length > 0 ? validSleep.reduce((a, b) => a + b, 0) / validSleep.length : 7;
    const totalVol = workoutVol.reduce((a, b) => a + b, 0);

    let overlayDesc = "Compares workout volume (kg), sleep (h), and water (L) side by side over time to see how rest and hydration align with training output.";
    if (avgSleep < 6.5 && totalVol > 5000) {
        overlayDesc = "Compares workout volume (kg), sleep (h), and water (L) over time: higher training volume combined with lower sleep average can signal recovery strain.";
    } else if (avgSleep >= 7.5) {
        overlayDesc = "Compares workout volume (kg), sleep (h), and water (L) over time: solid sleep duration supports training output and daily hydration habits.";
    }
    document.getElementById('overlayAnalysisText').textContent = overlayDesc;

    const narrow = isNarrowScreen();

    overlayChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [
                {
                    label: 'Volume (kg)',
                    data: workoutVol,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    yAxisID: 'yWorkout',
                    tension: 0.25,
                    pointRadius: narrow ? 1.5 : 2.5
                },
                {
                    label: 'Sleep (h)',
                    data: sleepHrs,
                    borderColor: '#0dcaf0',
                    backgroundColor: 'rgba(13, 202, 240, 0.1)',
                    yAxisID: 'ySleep',
                    tension: 0.25,
                    pointRadius: narrow ? 1.5 : 2.5,
                    spanGaps: true
                },
                {
                    label: 'Water (L)',
                    data: waterL,
                    borderColor: '#20c997',
                    backgroundColor: 'rgba(32, 201, 151, 0.1)',
                    yAxisID: 'yWater',
                    tension: 0.25,
                    pointRadius: narrow ? 1.5 : 2.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: narrow ? 10 : 12,
                        padding: narrow ? 8 : 12,
                        color: '#cbd5e1',
                        font: {
                            size: narrow ? 10 : 11,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const raw = context.parsed.y;
                            if (raw === null || raw === undefined) return `${context.dataset.label}: --`;
                            return `${context.dataset.label}: ${formatCleanValue(raw, 1)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: narrow ? 5 : 7,
                        font: { size: narrow ? 9.5 : 10.5 }
                    }
                },
                yWorkout: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.12)' },
                    ticks: {
                        color: '#d4af37',
                        maxTicksLimit: 4,
                        font: { size: narrow ? 9 : 10 },
                        callback: (v) => `${formatCompactAxisNumber(v)}kg`
                    }
                },
                ySleep: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    display: !narrow,
                    grid: { drawOnChartArea: false },
                    ticks: {
                        color: '#0dcaf0',
                        maxTicksLimit: 4,
                        font: { size: 10 },
                        callback: (v) => `${formatCompactAxisNumber(v)}h`
                    }
                },
                yWater: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    display: false,
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

function generateCorrelationInsights(workout, sleep, water, body) {
    const container = document.getElementById('insightsContainer');
    container.innerHTML = '';

    let insights = [];
    const validSleep = sleep.filter(s => s !== null);
    const avgSleep = validSleep.length > 0 ? validSleep.reduce((a, b) => a + b, 0) / validSleep.length : 0;
    const avgWater = water.reduce((a, b) => a + b, 0) / water.length;
    const totalWorkoutDays = workout.filter(w => w > 0).length;

    if (validSleep.length > 0 && avgSleep < 6.5 && totalWorkoutDays >= 3) {
        insights.push({
            type: 'warning',
            title: 'Sleep Deficit vs Training Load',
            desc: `Avg ${formatCleanValue(avgSleep, 1)}h sleep across ${totalWorkoutDays} workout days may limit recovery.`
        });
    } else if (validSleep.length > 0 && avgSleep >= 7.5) {
        insights.push({
            type: 'success',
            title: 'Strong Sleep Recovery',
            desc: `Avg ${formatCleanValue(avgSleep, 1)}h sleep supports consistent recovery and performance.`
        });
    }

    if (avgWater > 0 && avgWater < 2.0) {
        insights.push({
            type: 'warning',
            title: 'Hydration Below 2L Average',
            desc: `Avg ${formatCleanValue(avgWater, 1)}L/day — increasing intake may help training stamina.`
        });
    } else if (avgWater >= 2.0) {
        insights.push({
            type: 'success',
            title: 'Hydration On Track',
            desc: `Avg ${formatCleanValue(avgWater, 1)}L/day supports steady daily hydration.`
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'info',
            title: 'Baseline in Progress',
            desc: 'Log workouts, sleep, body metrics, and water to see correlation summaries.'
        });
    }

    insights.forEach(item => {
        const alertClass = item.type === 'warning' ? 'border-warning text-warning' : (item.type === 'success' ? 'border-success text-success' : 'border-info text-info');
        const iconClass = item.type === 'warning' ? 'bi-exclamation-triangle-fill' : (item.type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill');

        const card = document.createElement('div');
        card.className = `p-3 rounded-3 theme-box-toggle border ${alertClass} d-flex align-items-center gap-3`;
        card.innerHTML = `
            <i class="bi ${iconClass} fs-5 flex-shrink-0"></i>
            <div style="min-width: 0;">
                <h6 class="fw-bold mb-0 theme-text-title text-light-adapt" style="font-size: 0.9rem;">${item.title}</h6>
                <p class="small theme-text-sub text-light-adapt mb-0 mt-1" style="font-size: 0.78rem; line-height: 1.35;">${item.desc}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function getExportableReportElement() {
    const analyticsContent = document.getElementById('progressAnalyticsContent');
    if (analyticsContent && !analyticsContent.classList.contains('d-none')) {
        return analyticsContent;
    }
    return document.getElementById('exportableProgressReport');
}

function createExportClone(sourceEl) {
    const clone = sourceEl.cloneNode(true);
    clone.classList.remove('d-none');
    clone.querySelectorAll('.no-export').forEach(el => el.remove());

    const sourceCanvases = sourceEl.querySelectorAll('canvas');
    const cloneCanvases = clone.querySelectorAll('canvas');

    sourceCanvases.forEach((srcCanvas, idx) => {
        const dstCanvas = cloneCanvases[idx];
        if (!dstCanvas) return;
        try {
            const img = document.createElement('img');
            img.src = srcCanvas.toDataURL('image/png', 1.0);
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            dstCanvas.parentNode.replaceChild(img, dstCanvas);
        } catch (err) {
            console.error('Canvas snapshot error:', err);
        }
    });

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-99999px';
    wrapper.style.top = '0';
    wrapper.style.width = '780px';
    wrapper.style.backgroundColor = '#14181f';
    wrapper.style.color = '#f8fafc';
    wrapper.style.padding = '16px';
    wrapper.style.zIndex = '-1';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    return { wrapper, target: clone };
}

function loadScriptOnce(src, checkFn) {
    return new Promise((resolve, reject) => {
        if (checkFn()) {
            resolve();
            return;
        }
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

async function ensureExportLibs() {
    await loadScriptOnce(
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
        () => typeof html2canvas === 'function'
    );
    await loadScriptOnce(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        () => Boolean(window.jspdf && window.jspdf.jsPDF)
    );
}

function getBlockBreakPoints(targetEl, scale) {
    const wrapperRect = targetEl.getBoundingClientRect();
    if (!wrapperRect || wrapperRect.height <= 0) return [];

    const selectors = [
        '.col-md-6 > .card',
        '.card.rounded-4',
        '.p-3.rounded-4',
        '.row.g-3'
    ];

    const candidates = Array.from(targetEl.querySelectorAll(selectors.join(',')));
    const leafCards = candidates.filter((el) => {
        if (el.classList.contains('row')) return false;
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.height < wrapperRect.height * 0.85;
    });

    const edgesSet = new Set();
    leafCards.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const topPx = Math.round((rect.top - wrapperRect.top) * scale);
        const bottomPx = Math.round((rect.bottom - wrapperRect.top) * scale);
        if (topPx > 0) edgesSet.add(topPx);
        if (bottomPx > 0) edgesSet.add(bottomPx);
    });

    return Array.from(edgesSet).sort((a, b) => a - b);
}

function chooseSafeBreakY(breakPoints, currentY, maxSliceHeightPx, minAdvancePx) {
    const hardLimitY = currentY + maxSliceHeightPx;
    const minY = currentY + minAdvancePx;

    const validBreaks = breakPoints.filter((y) => y > minY && y <= hardLimitY);
    if (validBreaks.length > 0) {
        return validBreaks[validBreaks.length - 1];
    }

    const fallbackBreaks = breakPoints.filter((y) => y > currentY + 40 && y <= hardLimitY + Math.round(maxSliceHeightPx * 0.15));
    if (fallbackBreaks.length > 0) {
        return fallbackBreaks[fallbackBreaks.length - 1];
    }

    return hardLimitY;
}

async function exportReportPDF() {
    const sourceEl = getExportableReportElement();
    if (!sourceEl) return;

    let wrapper = null;
    try {
        await ensureExportLibs();
        const built = createExportClone(sourceEl);
        wrapper = built.wrapper;
        const target = built.target;

        const scale = 2;
        const breakPoints = getBlockBreakPoints(target, scale);

        const canvas = await html2canvas(target, {
            scale: scale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#14181f',
            logging: false
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const marginPt = 18;
        const pageWidthPt = pdf.internal.pageSize.getWidth() - marginPt * 2;
        const pageHeightPt = pdf.internal.pageSize.getHeight() - marginPt * 2;

        const pxPerPt = canvas.width / pageWidthPt;
        const maxSliceHeightPx = Math.floor(pageHeightPt * pxPerPt);
        const minAdvancePx = Math.floor(maxSliceHeightPx * 0.35);

        let currentY = 0;
        let pageIndex = 0;

        while (currentY < canvas.height) {
            const remainingPx = canvas.height - currentY;
            let nextY = remainingPx <= maxSliceHeightPx
                ? canvas.height
                : chooseSafeBreakY(breakPoints, currentY, maxSliceHeightPx, minAdvancePx);

            if (nextY <= currentY) {
                nextY = Math.min(canvas.height, currentY + maxSliceHeightPx);
            }

            const sliceHeightPx = nextY - currentY;
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeightPx;

            const sliceCtx = sliceCanvas.getContext('2d');
            sliceCtx.fillStyle = '#14181f';
            sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            sliceCtx.drawImage(
                canvas,
                0,
                currentY,
                canvas.width,
                sliceHeightPx,
                0,
                0,
                canvas.width,
                sliceHeightPx
            );

            if (pageIndex > 0) {
                pdf.addPage();
            }

            const sliceHeightPt = sliceHeightPx / pxPerPt;
            const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.96);
            pdf.addImage(sliceImgData, 'JPEG', marginPt, marginPt, pageWidthPt, sliceHeightPt);

            currentY = nextY;
            pageIndex++;
        }

        const filename = `BIP_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
    } catch (err) {
        console.error('PDF export failed:', err);
    } finally {
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }
}

async function exportReportImage() {
    const sourceEl = getExportableReportElement();
    if (!sourceEl) return;

    let wrapper = null;
    try {
        await ensureExportLibs();
        const built = createExportClone(sourceEl);
        wrapper = built.wrapper;
        const target = built.target;

        const canvas = await html2canvas(target, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#14181f',
            logging: false
        });

        const link = document.createElement('a');
        link.download = `BIP_Progress_Report_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error('Image export failed:', err);
    } finally {
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }
}