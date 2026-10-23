let workoutChartInstance = null;
let bodyChartInstance = null;
let sleepChartInstance = null;
let waterChartInstance = null;
let overlayChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProgressSavedState();
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

function loadAndRenderAnalytics() {
    const timeframeDays = parseInt(document.getElementById('analyticsTimeframe').value);
    const dates = getDatesRange(timeframeDays);

    const workoutLogs = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const bodyLogs = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const sleepLogs = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const waterLogs = JSON.parse(localStorage.getItem('water_metrics_history') || '{}');

    const workoutData = dates.map(d => calculateDailyWorkoutVolume(workoutLogs, d));
    const bodyData = dates.map(d => getBodyMetricForDate(bodyLogs, d));
    const sleepData = dates.map(d => getSleepHoursForDate(sleepLogs, d));
    const waterData = dates.map(d => getWaterVolumeForDate(waterLogs, d));

    renderWorkoutChart(dates, workoutData);
    renderBodyChart(dates, bodyData, bodyLogs);
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
    document.getElementById('workoutTrendBadge').textContent = totalVol > 0 ? `${Math.round(totalVol)} kg total` : 'No logs';

    const activeDays = data.filter(v => v > 0).length;
    let textDesc = "No training volume recorded in this timeframe. Logging sessions will display progressive overload trends.";
    if (activeDays > 0) {
        const avgVol = Math.round(totalVol / activeDays);
        textDesc = `Active training across ${activeDays} session days with an average volume of ${avgVol} kg per workout day. Overload development is active.`;
    }
    document.getElementById('workoutAnalysisText').textContent = textDesc;

    workoutChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Total Volume (kg)',
                data: data,
                backgroundColor: 'rgba(212, 175, 55, 0.7)',
                borderColor: 'var(--accent-color)',
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderBodyChart(labels, data, bodyLogs) {
    const ctx = document.getElementById('bodyChart').getContext('2d');
    if (bodyChartInstance) bodyChartInstance.destroy();

    const validData = data.filter(v => v !== null);
    let textDesc = "No body weight measurements recorded yet. Add metrics to evaluate BMI status and weight trends.";
    
    if (validData.length > 0) {
        const firstW = validData[0];
        const lastW = validData[validData.length - 1];
        const diff = (lastW - firstW).toFixed(1);
        const latestEntry = bodyLogs[bodyLogs.length - 1];
        
        let bmiStatusStr = "";
        if (latestEntry && latestEntry.Height > 0) {
            const bmi = lastW / (latestEntry.Height * latestEntry.Height);
            let cat = "Normal Weight";
            if (bmi < 18.5) cat = "Underweight";
            else if (bmi >= 25 && bmi < 30) cat = "Overweight";
            else if (bmi >= 30) cat = "Obese";
            bmiStatusStr = ` Current BMI is ${bmi.toFixed(1)} (${cat}).`;
        }

        if (diff > 0) {
            textDesc = `Weight increased by +${diff} kg over the period.${bmiStatusStr} Reflects positive caloric surplus or muscle mass development.`;
            document.getElementById('bodyTrendBadge').textContent = `+${diff} kg`;
        } else if (diff < 0) {
            textDesc = `Weight decreased by ${diff} kg over the period.${bmiStatusStr} Indicates caloric deficit or fat loss phase.`;
            document.getElementById('bodyTrendBadge').textContent = `${diff} kg`;
        } else {
            textDesc = `Weight remained stable at ${lastW} kg.${bmiStatusStr} Indicating weight maintenance phase.`;
            document.getElementById('bodyTrendBadge').textContent = `${lastW} kg`;
        }
    } else {
        document.getElementById('bodyTrendBadge').textContent = 'No logs';
    }

    document.getElementById('bodyAnalysisText').textContent = textDesc;

    bodyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Body Weight (kg)',
                data: data,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.15)',
                fill: true,
                tension: 0.3,
                spanGaps: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderSleepChart(labels, data) {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    if (sleepChartInstance) sleepChartInstance.destroy();

    const validData = data.filter(v => v !== null);
    let textDesc = "No sleep logs recorded in this timeframe. Track sleep to monitor recovery readiness.";
    
    if (validData.length > 0) {
        const avgSleep = (validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(1);
        document.getElementById('sleepTrendBadge').textContent = `${avgSleep} hrs avg`;
        
        if (avgSleep < 7.0) {
            textDesc = `Average sleep is ${avgSleep} hrs/day, which is below the recommended 7-9 hours. Recovery bottlenecks and fatigue accumulation are likely.`;
        } else {
            textDesc = `Average sleep is ${avgSleep} hrs/day, supporting optimal tissue regeneration and hormonal balance.`;
        }
    } else {
        document.getElementById('sleepTrendBadge').textContent = 'No logs';
    }

    document.getElementById('sleepAnalysisText').textContent = textDesc;

    sleepChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Sleep Duration (hrs)',
                data: data,
                borderColor: '#0dcaf0',
                backgroundColor: 'rgba(13, 202, 240, 0.2)',
                fill: true,
                tension: 0.2,
                spanGaps: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderWaterChart(labels, data) {
    const ctx = document.getElementById('waterChart').getContext('2d');
    if (waterChartInstance) waterChartInstance.destroy();

    const totalWater = data.reduce((a, b) => a + b, 0);
    const activeDays = data.filter(v => v > 0).length;
    let textDesc = "No hydration logs recorded in this timeframe.";

    if (activeDays > 0) {
        const avgWater = (totalWater / activeDays).toFixed(1);
        document.getElementById('waterTrendBadge').textContent = `${avgWater} L avg`;
        
        if (avgWater < 2.0) {
            textDesc = `Average intake is ${avgWater} L/day, falling short of optimal hydration. Risk of elevated perceived exertion during training.`;
        } else {
            textDesc = `Average intake is ${avgWater} L/day, maintaining cellular hydration and metabolic efficiency.`;
        }
    } else {
        document.getElementById('waterTrendBadge').textContent = 'No logs';
    }

    document.getElementById('waterAnalysisText').textContent = textDesc;

    waterChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [{
                label: 'Water (L)',
                data: data,
                backgroundColor: 'rgba(13, 202, 240, 0.6)',
                borderColor: '#0dcaf0',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderOverlayChart(labels, workoutVol, sleepHrs, waterL) {
    const ctx = document.getElementById('overlayChart').getContext('2d');
    if (overlayChartInstance) overlayChartInstance.destroy();

    const validSleep = sleepHrs.filter(s => s !== null);
    const avgSleep = validSleep.length > 0 ? validSleep.reduce((a, b) => a + b, 0) / validSleep.length : 7;
    const totalVol = workoutVol.reduce((a, b) => a + b, 0);

    let overlayDesc = "Holistic synthesis indicates steady alignment across training, sleep, and hydration.";
    if (avgSleep < 6.5 && totalVol > 5000) {
        overlayDesc = "Warning: High training volume combined with low sleep averages indicates elevated burnout risk. Prioritize recovery days.";
    } else if (avgSleep >= 7.5) {
        overlayDesc = "Optimal synergy: Adequate rest and hydration are reinforcing high workout volume capacity and steady body development.";
    }
    document.getElementById('overlayAnalysisText').textContent = overlayDesc;

    overlayChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.slice(5)),
            datasets: [
                { label: 'Workout Vol (kg)', data: workoutVol, borderColor: 'var(--accent-color)', yAxisID: 'yWorkout', tension: 0.2 },
                { label: 'Sleep (hrs)', data: sleepHrs, borderColor: '#0dcaf0', yAxisID: 'ySleep', tension: 0.2, spanGaps: true },
                { label: 'Water (L)', data: waterL, borderColor: '#20c997', yAxisID: 'yWater', tension: 0.2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yWorkout: { type: 'linear', position: 'left', title: { display: true, text: 'Volume (kg)' } },
                ySleep: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Sleep (hrs)' } },
                yWater: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Water (L)' } }
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

    if (avgSleep < 6.5 && totalWorkoutDays >= 3) {
        insights.push({
            type: 'warning',
            title: 'Sleep Deficit Impacting Recovery',
            desc: `Your average sleep duration is ${avgSleep.toFixed(1)} hrs. Research shows sleep under 7 hours can reduce CNS recovery and workout output by up to 15%. Consider adjusting bedtime.`
        });
    } else if (avgSleep >= 7.5) {
        insights.push({
            type: 'success',
            title: 'Optimal Recovery Window',
            desc: `Great job! Averaging ${avgSleep.toFixed(1)} hours of sleep provides optimal hormonal environment for muscle synthesis and metabolic health.`
        });
    }

    if (avgWater < 2.0) {
        insights.push({
            type: 'warning',
            title: 'Hydration Target Below Threshold',
            desc: `Averaging ${avgWater.toFixed(1)} L/day. Mild dehydration (1-2%) can decrease muscular force production and elevate rate of perceived exertion (RPE).`
        });
    } else {
        insights.push({
            type: 'success',
            title: 'Hydration Supporting Cellular Function',
            desc: `Consistent water intake (${avgWater.toFixed(1)} L/day) is maintaining nutrient transport and muscle fullness during training sessions.`
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'info',
            title: 'Building Data Baseline',
            desc: 'Keep logging daily workouts, body metrics, sleep, and water to unlock deeper cross-domain correlations.'
        });
    }

    insights.forEach(item => {
        const alertClass = item.type === 'warning' ? 'border-warning text-warning' : (item.type === 'success' ? 'border-success text-success' : 'border-info text-info');
        const iconClass = item.type === 'warning' ? 'bi-exclamation-triangle-fill' : (item.type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill');

        const card = document.createElement('div');
        card.className = `p-3 rounded-3 theme-box-toggle border ${alertClass} d-flex align-items-start gap-3`;
        card.innerHTML = `
            <i class="bi ${iconClass} fs-4 mt-1"></i>
            <div>
                <h6 class="fw-bold mb-1 theme-text-title text-light-adapt">${item.title}</h6>
                <p class="small theme-text-sub text-light-adapt mb-0">${item.desc}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function exportReportPDF() {
    const element = document.getElementById('exportableProgressReport');
    const opt = {
        margin:       0.3,
        filename:     `BIP_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, ignoreElements: (el) => el.classList.contains('no-export') },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function exportReportImage() {
    const element = document.getElementById('exportableProgressReport');
    html2canvas(element, { scale: 2, useCORS: true, ignoreElements: (el) => el.classList.contains('no-export') }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BIP_Progress_Report_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}