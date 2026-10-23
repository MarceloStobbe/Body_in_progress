document.addEventListener('DOMContentLoaded', () => {
    loadSavedBodyState();
});

function showBipModal(title, htmlContent, customFooter = null) {
    document.getElementById('bipModalTitle').textContent = title;
    document.getElementById('bipModalBody').innerHTML = htmlContent;
    
    const footerEl = document.getElementById('bipModalFooter');
    if (customFooter) {
        footerEl.innerHTML = customFooter;
    } else {
        footerEl.innerHTML = '<button type="button" class="btn btn-sm px-4 fw-bold rounded-pill" data-bs-dismiss="modal" style="background-color: var(--accent-color); color: #111;">OK</button>';
    }

    const modalObj = new bootstrap.Modal(document.getElementById('bipCustomModal'));
    modalObj.show();
}

function toggleBodyContainer(checkbox) {
    const container = document.getElementById('bodyHubContent');
    const dashView = document.getElementById('bodyDashboardView');
    const weightView = document.getElementById('weightHistoryView');
    const trunkView = document.getElementById('trunkHistoryView');
    const armsView = document.getElementById('armsHistoryView');
    const legsView = document.getElementById('legsHistoryView');
    const historyMgmt = document.getElementById('historyManagementContainer');

    localStorage.setItem('body_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        container.classList.remove('d-none');
    } else {
        container.classList.add('d-none');
        dashView.classList.add('d-none');
        weightView.classList.add('d-none');
        trunkView.classList.add('d-none');
        armsView.classList.add('d-none');
        legsView.classList.add('d-none');
        historyMgmt.classList.add('d-none');
    }
}

function openBodyConfigurationHub() {
    const configContainer = document.getElementById('bodyConfigContainer');
    configContainer.classList.remove('d-none');
    document.getElementById('bodyHubOptIn').checked = true;
    document.getElementById('bodyHubContent').classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveBodyMetricsRecord() {
    const todayDate = new Date().toISOString().split('T')[0];

    const entry = {
        date: todayDate,
        Weight: parseFloat(document.getElementById('metricWeight').value) || 0,
        Height: parseFloat(document.getElementById('metricHeight').value) || 0,
        Neck: parseFloat(document.getElementById('metricNeck').value) || 0,
        Shoulders: parseFloat(document.getElementById('metricShoulders').value) || 0,
        Chest: parseFloat(document.getElementById('metricChest').value) || 0,
        Abdomen: parseFloat(document.getElementById('metricAbdomen').value) || 0,
        RightBicep: parseFloat(document.getElementById('metricRightBicep').value) || 0,
        LeftBicep: parseFloat(document.getElementById('metricLeftBicep').value) || 0,
        RightForearm: parseFloat(document.getElementById('metricRightForearm').value) || 0,
        LeftForearm: parseFloat(document.getElementById('metricLeftForearm').value) || 0,
        Glutes: parseFloat(document.getElementById('metricGlutes').value) || 0,
        RightThigh: parseFloat(document.getElementById('metricRightThigh').value) || 0,
        LeftThigh: parseFloat(document.getElementById('metricLeftThigh').value) || 0,
        RightCalf: parseFloat(document.getElementById('metricRightCalf').value) || 0,
        LeftCalf: parseFloat(document.getElementById('metricLeftCalf').value) || 0
    };

    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === todayDate);
    if (existingIndex >= 0) {
        let existing = history[existingIndex];
        for (let key in entry) {
            if (entry[key] === 0 && existing[key]) {
                entry[key] = existing[key];
            }
        }
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }

    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('body_metrics_history', JSON.stringify(history));
    localStorage.setItem('body_configured', 'true');
    localStorage.setItem('body_hub_optin', 'false');

    document.getElementById('bodyConfigContainer').classList.add('d-none');
    renderAllBodyCharts();
}

function renderAllBodyCharts() {
    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const isConfigured = localStorage.getItem('body_configured') === 'true';

    if (!isConfigured || history.length === 0) {
        document.getElementById('bodyDashboardView').classList.add('d-none');
        document.getElementById('weightHistoryView').classList.add('d-none');
        document.getElementById('trunkHistoryView').classList.add('d-none');
        document.getElementById('armsHistoryView').classList.add('d-none');
        document.getElementById('legsHistoryView').classList.add('d-none');
        document.getElementById('historyManagementContainer').classList.add('d-none');
        return;
    }

    document.getElementById('bodyDashboardView').classList.remove('d-none');
    document.getElementById('weightHistoryView').classList.remove('d-none');
    document.getElementById('trunkHistoryView').classList.remove('d-none');
    document.getElementById('armsHistoryView').classList.remove('d-none');
    document.getElementById('legsHistoryView').classList.remove('d-none');
    document.getElementById('historyManagementContainer').classList.remove('d-none');
    document.getElementById('bodyConfigContainer').classList.add('d-none');

    const latest = history[history.length - 1];
    
    if (latest.Height > 0 && latest.Weight > 0) {
        const bmi = latest.Weight / (latest.Height * latest.Height);
        const minIdealW = (18.5 * latest.Height * latest.Height).toFixed(1);
        const maxIdealW = (24.9 * latest.Height * latest.Height).toFixed(1);

        document.getElementById('dashCurrentWeight').textContent = latest.Weight + ' kg';
        document.getElementById('dashIdealWeightRange').textContent = `${minIdealW} kg - ${maxIdealW} kg`;

        let progressPct = Math.round((latest.Weight / parseFloat(maxIdealW)) * 100);
        if (progressPct > 100) progressPct = 100;
        document.getElementById('bmiProgressBar').style.width = progressPct + '%';

        let status = 'Normal Weight';
        if (bmi < 18.5) status = 'Underweight';
        else if (bmi >= 25 && bmi < 30) status = 'Overweight';
        else if (bmi >= 30) status = 'Obese';

        document.getElementById('bmiStatusText').textContent = `BMI: ${bmi.toFixed(1)} (${status}) - Ideal target range calculated`;
    } else {
        document.getElementById('dashCurrentWeight').textContent = (latest.Weight || 0) + ' kg';
        document.getElementById('dashIdealWeightRange').textContent = 'Set height to calculate';
        document.getElementById('bmiStatusText').textContent = 'Please provide height to compute BMI & ideal weight range.';
    }

    document.getElementById('totalEntriesText').textContent = history.length;
    document.getElementById('latestEntryDateText').textContent = latest.date;

    renderWeightChart();
    renderTrunkChart();
    renderArmsChart();
    renderLegsChart();
}

function toggleLogsList() {
    const listSection = document.getElementById('logsListSection');
    listSection.classList.toggle('d-none');
    document.getElementById('bodyAddPastLogSection').classList.add('d-none');

    if (!listSection.classList.contains('d-none')) {
        populateLoggedDatesList();
    } else {
        document.getElementById('dateEditFormSection').classList.add('d-none');
    }
}

function toggleAddPastLogForm() {
    const formSection = document.getElementById('bodyAddPastLogSection');
    formSection.classList.toggle('d-none');
    document.getElementById('dateEditFormSection').classList.add('d-none');

    if (!formSection.classList.contains('d-none')) {
        document.getElementById('addPastBodyDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('addPastBodyWeight').value = '';
        document.getElementById('addPastBodyHeight').value = '';
        document.getElementById('addPastBodyNeck').value = '';
        document.getElementById('addPastBodyShoulders').value = '';
        document.getElementById('addPastBodyChest').value = '';
        document.getElementById('addPastBodyAbdomen').value = '';
        document.getElementById('addPastBodyRightBicep').value = '';
        document.getElementById('addPastBodyLeftBicep').value = '';
        document.getElementById('addPastBodyRightForearm').value = '';
        document.getElementById('addPastBodyLeftForearm').value = '';
        document.getElementById('addPastBodyGlutes').value = '';
        document.getElementById('addPastBodyRightThigh').value = '';
        document.getElementById('addPastBodyLeftThigh').value = '';
        document.getElementById('addPastBodyRightCalf').value = '';
        document.getElementById('addPastBodyLeftCalf').value = '';
    }
}

function saveNewPastBodyLog() {
    const dateStr = document.getElementById('addPastBodyDate').value;
    if (!dateStr) {
        showBipModal("Error", "Please select a valid date.");
        return;
    }

    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    let existingIndex = history.findIndex(item => item.date === dateStr);
    
    if (existingIndex >= 0) {
        showBipModal("Notice", "A body log for this date already exists. Please use View & Edit Past Logs to modify it.");
        return;
    }

    const entry = {
        date: dateStr,
        Weight: parseFloat(document.getElementById('addPastBodyWeight').value) || 0,
        Height: parseFloat(document.getElementById('addPastBodyHeight').value) || 0,
        Neck: parseFloat(document.getElementById('addPastBodyNeck').value) || 0,
        Shoulders: parseFloat(document.getElementById('addPastBodyShoulders').value) || 0,
        Chest: parseFloat(document.getElementById('addPastBodyChest').value) || 0,
        Abdomen: parseFloat(document.getElementById('addPastBodyAbdomen').value) || 0,
        RightBicep: parseFloat(document.getElementById('addPastBodyRightBicep').value) || 0,
        LeftBicep: parseFloat(document.getElementById('addPastBodyLeftBicep').value) || 0,
        RightForearm: parseFloat(document.getElementById('addPastBodyRightForearm').value) || 0,
        LeftForearm: parseFloat(document.getElementById('addPastBodyLeftForearm').value) || 0,
        Glutes: parseFloat(document.getElementById('addPastBodyGlutes').value) || 0,
        RightThigh: parseFloat(document.getElementById('addPastBodyRightThigh').value) || 0,
        LeftThigh: parseFloat(document.getElementById('addPastBodyLeftThigh').value) || 0,
        RightCalf: parseFloat(document.getElementById('addPastBodyRightCalf').value) || 0,
        LeftCalf: parseFloat(document.getElementById('addPastBodyLeftCalf').value) || 0
    };

    history.push(entry);
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('body_metrics_history', JSON.stringify(history));

    document.getElementById('bodyAddPastLogSection').classList.add('d-none');
    renderAllBodyCharts();
    populateLoggedDatesList();
}

function populateLoggedDatesList() {
    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const container = document.getElementById('loggedDatesContainer');
    container.innerHTML = '';

    if (history.length === 0) {
        container.innerHTML = '<span class="small theme-text-sub">No history logs found.</span>';
        return;
    }

    history.forEach(entry => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3 rounded-3';
        btn.style.cssText = 'border-color: rgba(255,255,255,0.2); color: var(--text-color); background-color: var(--bg-input, rgba(0,0,0,0.2));';
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${entry.date}</span> <span class="small theme-text-sub">Weight: ${entry.Weight || 0}kg</span>`;
        btn.onclick = () => loadLogForEditing(entry.date);
        container.appendChild(btn);
    });
}

function loadLogForEditing(dateStr) {
    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const entry = history.find(item => item.date === dateStr);
    if (!entry) return;

    document.getElementById('editingDateTitle').textContent = entry.date;
    document.getElementById('editLogWeight').value = entry.Weight || '';
    document.getElementById('editLogHeight').value = entry.Height || '';
    document.getElementById('editLogNeck').value = entry.Neck || '';
    document.getElementById('editLogShoulders').value = entry.Shoulders || '';
    document.getElementById('editLogChest').value = entry.Chest || '';
    document.getElementById('editLogAbdomen').value = entry.Abdomen || '';
    document.getElementById('editLogRightBicep').value = entry.RightBicep || '';
    document.getElementById('editLogLeftBicep').value = entry.LeftBicep || '';
    document.getElementById('editLogRightForearm').value = entry.RightForearm || '';
    document.getElementById('editLogLeftForearm').value = entry.LeftForearm || '';
    document.getElementById('editLogGlutes').value = entry.Glutes || '';
    document.getElementById('editLogRightThigh').value = entry.RightThigh || '';
    document.getElementById('editLogLeftThigh').value = entry.LeftThigh || '';
    document.getElementById('editLogRightCalf').value = entry.RightCalf || '';
    document.getElementById('editLogLeftCalf').value = entry.LeftCalf || '';

    document.getElementById('dateEditFormSection').classList.remove('d-none');
}

function saveEditedLogEntry() {
    const dateStr = document.getElementById('editingDateTitle').textContent;
    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    
    let index = history.findIndex(item => item.date === dateStr);
    if (index >= 0) {
        history[index] = {
            date: dateStr,
            Weight: parseFloat(document.getElementById('editLogWeight').value) || 0,
            Height: parseFloat(document.getElementById('editLogHeight').value) || 0,
            Neck: parseFloat(document.getElementById('editLogNeck').value) || 0,
            Shoulders: parseFloat(document.getElementById('editLogShoulders').value) || 0,
            Chest: parseFloat(document.getElementById('editLogChest').value) || 0,
            Abdomen: parseFloat(document.getElementById('editLogAbdomen').value) || 0,
            RightBicep: parseFloat(document.getElementById('editLogRightBicep').value) || 0,
            LeftBicep: parseFloat(document.getElementById('editLogLeftBicep').value) || 0,
            RightForearm: parseFloat(document.getElementById('editLogRightForearm').value) || 0,
            LeftForearm: parseFloat(document.getElementById('editLogLeftForearm').value) || 0,
            Glutes: parseFloat(document.getElementById('editLogGlutes').value) || 0,
            RightThigh: parseFloat(document.getElementById('editLogRightThigh').value) || 0,
            LeftThigh: parseFloat(document.getElementById('editLogLeftThigh').value) || 0,
            RightCalf: parseFloat(document.getElementById('editLogRightCalf').value) || 0,
            LeftCalf: parseFloat(document.getElementById('editLogLeftCalf').value) || 0
        };

        localStorage.setItem('body_metrics_history', JSON.stringify(history));
        showBipModal("Success", "Log updated successfully!");
        
        document.getElementById('dateEditFormSection').classList.add('d-none');
        populateLoggedDatesList();
        renderAllBodyCharts();
    }
}

function deleteLogEntry() {
    const dateStr = document.getElementById('editingDateTitle').textContent;
    const html = `<p class="small theme-text-sub mb-3 text-light-adapt">Are you sure you want to delete the log for <strong>${dateStr}</strong>?</p>`;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-danger" onclick="confirmDeleteLog('${dateStr}')">Delete</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;
    showBipModal("Confirm Deletion", html, footer);
}

function confirmDeleteLog(dateStr) {
    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    history = history.filter(item => item.date !== dateStr);

    localStorage.setItem('body_metrics_history', JSON.stringify(history));

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    document.getElementById('dateEditFormSection').classList.add('d-none');
    populateLoggedDatesList();
    renderAllBodyCharts();
}

function renderSpecificChart(metricKey, polylineId, pointsGroupId, yAxisId, unit = 'cm') {
    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const validEntries = history.filter(item => item[metricKey] && item[metricKey] > 0);

    const polyline = document.getElementById(polylineId);
    const pointsGroup = document.getElementById(pointsGroupId);
    const yAxis = document.getElementById(yAxisId);

    pointsGroup.innerHTML = '';

    if (validEntries.length === 0) {
        polyline.setAttribute('points', '');
        yAxis.innerHTML = '<span>--</span><span>--</span><span>--</span><span>--</span>';
        return;
    }

    const values = validEntries.map(e => e[metricKey]);
    let minVal = Math.floor(Math.min(...values) * 0.9);
    let maxVal = Math.ceil(Math.max(...values) * 1.1);
    if (minVal === maxVal) { minVal = 0; maxVal = maxVal * 1.2 || 100; }

    yAxis.innerHTML = `
        <span>${maxVal.toFixed(0)}</span>
        <span>${(maxVal - (maxVal - minVal) * 0.33).toFixed(0)}</span>
        <span>${(maxVal - (maxVal - minVal) * 0.66).toFixed(0)}</span>
        <span>${minVal.toFixed(0)}</span>
    `;

    const totalPoints = validEntries.length;
    const xStep = totalPoints > 1 ? 600 / (totalPoints - 1) : 0;
    let pointsString = '';

    validEntries.forEach((entry, idx) => {
        const x = totalPoints === 1 ? 350 : 50 + (idx * xStep);
        const val = entry[metricKey];
        const y = Math.round(180 - ((val - minVal) / (maxVal - minVal)) * 180);

        pointsString += `${x},${y} `;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', 'var(--accent-color)');
        pointsGroup.appendChild(circle);

        const textVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textVal.setAttribute('x', x);
        textVal.setAttribute('y', y - 10);
        textVal.setAttribute('fill', 'currentColor');
        textVal.setAttribute('font-size', '11');
        textVal.setAttribute('font-weight', 'bold');
        textVal.setAttribute('text-anchor', 'middle');
        textVal.textContent = val + unit;
        pointsGroup.appendChild(textVal);

        const textDate = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textDate.setAttribute('x', x);
        textDate.setAttribute('y', 205);
        textDate.setAttribute('fill', idx === validEntries.length - 1 ? 'var(--accent-color)' : '#a0aec0');
        textDate.setAttribute('font-size', '10');
        textDate.setAttribute('font-weight', 'bold');
        textDate.setAttribute('text-anchor', 'middle');
        const dParts = entry.date.split('-');
        textDate.textContent = `${dParts[1]}/${dParts[2]}`;
        pointsGroup.appendChild(textDate);
    });

    polyline.setAttribute('points', pointsString.trim());
}

function renderWeightChart() {
    renderSpecificChart('Weight', 'weightPolyline', 'weightPointsGroup', 'weightYAxis', 'kg');
}

function renderTrunkChart() {
    const metric = document.getElementById('trunkFilterSelect').value;
    renderSpecificChart(metric, 'trunkPolyline', 'trunkPointsGroup', 'trunkYAxis', 'cm');
}

function renderArmsChart() {
    const metric = document.getElementById('armsFilterSelect').value;
    renderSpecificChart(metric, 'armsPolyline', 'armsPointsGroup', 'armsYAxis', 'cm');
}

function renderLegsChart() {
    const metric = document.getElementById('legsFilterSelect').value;
    renderSpecificChart(metric, 'legsPolyline', 'legsPointsGroup', 'legsYAxis', 'cm');
}

function loadSavedBodyState() {
    const isConfigured = localStorage.getItem('body_configured') === 'true';
    if (!isConfigured) {
        localStorage.setItem('body_hub_optin', 'false');
    }

    if (isConfigured) {
        renderAllBodyCharts();
    } else {
        document.getElementById('bodyConfigContainer').classList.remove('d-none');
        document.getElementById('bodyHubOptIn').checked = false;
        document.getElementById('bodyHubContent').classList.add('d-none');
        document.getElementById('bodyDashboardView').classList.add('d-none');
        document.getElementById('weightHistoryView').classList.add('d-none');
        document.getElementById('trunkHistoryView').classList.add('d-none');
        document.getElementById('armsHistoryView').classList.add('d-none');
        document.getElementById('legsHistoryView').classList.add('d-none');
        document.getElementById('historyManagementContainer').classList.add('d-none');
    }
}