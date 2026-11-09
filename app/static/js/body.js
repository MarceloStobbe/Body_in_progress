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

    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    if (history.length > 0) {
        const latest = history[history.length - 1];
        if (document.getElementById('metricWeight')) document.getElementById('metricWeight').value = latest.Weight || '';
        if (document.getElementById('metricHeight')) document.getElementById('metricHeight').value = latest.Height || '';
        if (document.getElementById('metricNeck')) document.getElementById('metricNeck').value = latest.Neck || '';
        if (document.getElementById('metricShoulders')) document.getElementById('metricShoulders').value = latest.Shoulders || '';
        if (document.getElementById('metricChest')) document.getElementById('metricChest').value = latest.Chest || '';
        if (document.getElementById('metricAbdomen')) document.getElementById('metricAbdomen').value = latest.Abdomen || '';
        if (document.getElementById('metricRightBicep')) document.getElementById('metricRightBicep').value = latest.RightBicep || '';
        if (document.getElementById('metricLeftBicep')) document.getElementById('metricLeftBicep').value = latest.LeftBicep || '';
        if (document.getElementById('metricRightForearm')) document.getElementById('metricRightForearm').value = latest.RightForearm || '';
        if (document.getElementById('metricLeftForearm')) document.getElementById('metricLeftForearm').value = latest.LeftForearm || '';
        if (document.getElementById('metricGlutes')) document.getElementById('metricGlutes').value = latest.Glutes || '';
        if (document.getElementById('metricRightThigh')) document.getElementById('metricRightThigh').value = latest.RightThigh || '';
        if (document.getElementById('metricLeftThigh')) document.getElementById('metricLeftThigh').value = latest.LeftThigh || '';
        if (document.getElementById('metricRightCalf')) document.getElementById('metricRightCalf').value = latest.RightCalf || '';
        if (document.getElementById('metricLeftCalf')) document.getElementById('metricLeftCalf').value = latest.LeftCalf || '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveBodyMetricsRecord() {
    const todayDate = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    
    let previousWeight = 0;
    let previousHeight = 0;
    if (history.length > 0) {
        const latestExisting = history[history.length - 1];
        previousWeight = latestExisting.Weight || 0;
        previousHeight = latestExisting.Height || 0;
    }

    const inputWeight = parseFloat(document.getElementById('metricWeight').value);
    const inputHeight = parseFloat(document.getElementById('metricHeight').value);

    const finalWeight = (!isNaN(inputWeight) && inputWeight > 0) ? inputWeight : previousWeight;
    const finalHeight = (!isNaN(inputHeight) && inputHeight > 0) ? inputHeight : previousHeight > 0 ? previousHeight : 0;

    const entry = {
        date: todayDate,
        Weight: finalWeight,
        Height: finalHeight,
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

    renderWeightChart();
    renderTrunkChart();
    renderArmsChart();
    renderLegsChart();
}

function toggleLogsList() {
    const listSection = document.getElementById('historyManagementContainer');
    let logsListSec = document.getElementById('logsListSection');
    logsListSec.classList.toggle('d-none');
    document.getElementById('bodyAddPastLogSection').classList.add('d-none');

    if (!logsListSec.classList.contains('d-none')) {
        populateLoggedDatesList();
    } else {
        document.querySelectorAll('.body-inline-edit-form').forEach(el => el.remove());
    }
}

function toggleAddPastLogForm() {
    const formSection = document.getElementById('bodyAddPastLogSection');
    formSection.classList.toggle('d-none');
    document.querySelectorAll('.body-inline-edit-form').forEach(el => el.remove());

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

    let previousWeight = 0;
    let previousHeight = 0;
    if (history.length > 0) {
        const latestExisting = history[history.length - 1];
        previousWeight = latestExisting.Weight || 0;
        previousHeight = latestExisting.Height || 0;
    }

    const inputWeight = parseFloat(document.getElementById('addPastBodyWeight').value);
    const inputHeight = parseFloat(document.getElementById('addPastBodyHeight').value);

    const finalWeight = (!isNaN(inputWeight) && inputWeight > 0) ? inputWeight : previousWeight;
    const finalHeight = (!isNaN(inputHeight) && inputHeight > 0) ? inputHeight : previousHeight > 0 ? previousHeight : 0;

    const entry = {
        date: dateStr,
        Weight: finalWeight,
        Height: finalHeight,
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
    let container = document.getElementById('loggedDatesContainer');
    
    if (!container) {
        const listSection = document.getElementById('logsListSection');
        if (!listSection) return;
        
        container = document.createElement('div');
        container.id = 'loggedDatesContainer';
        container.className = 'd-flex flex-column gap-2 mb-3';
        listSection.appendChild(container);
    }
    
    container.innerHTML = '';

    if (history.length === 0) {
        container.innerHTML = '<span class="small theme-text-sub">No history logs found.</span>';
        return;
    }

    const reversedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    reversedHistory.forEach(entry => {
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex flex-column gap-2';
        wrapper.id = `body-log-wrapper-${entry.date}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3 rounded-3';
        btn.style.cssText = 'border-color: rgba(255,255,255,0.2); color: var(--text-color); background-color: var(--bg-input, rgba(0,0,0,0.2));';
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${entry.date}</span> <span class="small theme-text-sub">Weight: ${entry.Weight || 0}kg</span>`;
        btn.onclick = () => toggleBodyLogInlineEdit(entry.date, wrapper);
        
        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    });
}

function toggleBodyLogInlineEdit(dateStr, wrapperEl) {
    const existingForm = wrapperEl.querySelector('.body-inline-edit-form');
    if (existingForm) {
        existingForm.remove();
        return;
    }

    document.querySelectorAll('.body-inline-edit-form').forEach(el => el.remove());

    const history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    const entry = history.find(item => item.date === dateStr);
    if (!entry) return;

    const safeKey = dateStr.replace(/-/g, '_');
    const formDiv = document.createElement('div');
    formDiv.className = 'body-inline-edit-form pt-3 pb-2 px-3 border border-secondary rounded-3 theme-box-toggle mt-1 mb-2';
    formDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0" style="color: var(--accent-color);">Editing Log for: <span class="theme-text-title text-light-adapt">${entry.date}</span></h6>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteLogEntryInline('${entry.date}')" style="font-size: 0.8rem;">Delete Log</button>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-6">
                <label class="small theme-text-sub mb-1 text-light-adapt">Weight (kg)</label>
                <input type="number" id="editLogWeight_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Weight || ''}">
            </div>
            <div class="col-md-6">
                <label class="small theme-text-sub mb-1 text-light-adapt">Height (m)</label>
                <input type="number" id="editLogHeight_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.01" min="0" value="${entry.Height || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Neck</label>
                <input type="number" id="editLogNeck_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Neck || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Shoulders</label>
                <input type="number" id="editLogShoulders_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Shoulders || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Chest</label>
                <input type="number" id="editLogChest_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Chest || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Abdomen</label>
                <input type="number" id="editLogAbdomen_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Abdomen || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Right Bicep</label>
                <input type="number" id="editLogRightBicep_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.RightBicep || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Left Bicep</label>
                <input type="number" id="editLogLeftBicep_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.LeftBicep || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Right Forearm</label>
                <input type="number" id="editLogRightForearm_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.RightForearm || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Left Forearm</label>
                <input type="number" id="editLogLeftForearm_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.LeftForearm || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Glutes</label>
                <input type="number" id="editLogGlutes_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.Glutes || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Right Thigh</label>
                <input type="number" id="editLogRightThigh_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.RightThigh || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Left Thigh</label>
                <input type="number" id="editLogLeftThigh_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.LeftThigh || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Right Calf</label>
                <input type="number" id="editLogRightCalf_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.RightCalf || ''}">
            </div>
            <div class="col-md-3">
                <label class="small theme-text-sub mb-1 text-light-adapt">Left Calf</label>
                <input type="number" id="editLogLeftCalf_${safeKey}" class="form-control form-control-sm custom-select-dropdown" step="0.1" min="0" value="${entry.LeftCalf || ''}">
            </div>
        </div>

        <div class="text-center">
            <button type="button" class="btn btn-sm px-4 py-2 fw-bold rounded-pill shadow" onclick="saveInlineLogEntry('${entry.date}')" style="background-color: var(--accent-color); color: #111;">
                Save Changes
            </button>
        </div>
    `;

    wrapperEl.appendChild(formDiv);
}

function saveInlineLogEntry(dateStr) {
    const safeKey = dateStr.replace(/-/g, '_');
    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    let index = history.findIndex(item => item.date === dateStr);
    
    if (index >= 0) {
        history[index] = {
            date: dateStr,
            Weight: parseFloat(document.getElementById(`editLogWeight_${safeKey}`).value) || 0,
            Height: parseFloat(document.getElementById(`editLogHeight_${safeKey}`).value) || 0,
            Neck: parseFloat(document.getElementById(`editLogNeck_${safeKey}`).value) || 0,
            Shoulders: parseFloat(document.getElementById(`editLogShoulders_${safeKey}`).value) || 0,
            Chest: parseFloat(document.getElementById(`editLogChest_${safeKey}`).value) || 0,
            Abdomen: parseFloat(document.getElementById(`editLogAbdomen_${safeKey}`).value) || 0,
            RightBicep: parseFloat(document.getElementById(`editLogRightBicep_${safeKey}`).value) || 0,
            LeftBicep: parseFloat(document.getElementById(`editLogLeftBicep_${safeKey}`).value) || 0,
            RightForearm: parseFloat(document.getElementById(`editLogRightForearm_${safeKey}`).value) || 0,
            LeftForearm: parseFloat(document.getElementById(`editLogLeftForearm_${safeKey}`).value) || 0,
            Glutes: parseFloat(document.getElementById(`editLogGlutes_${safeKey}`).value) || 0,
            RightThigh: parseFloat(document.getElementById(`editLogRightThigh_${safeKey}`).value) || 0,
            LeftThigh: parseFloat(document.getElementById(`editLogLeftThigh_${safeKey}`).value) || 0,
            RightCalf: parseFloat(document.getElementById(`editLogRightCalf_${safeKey}`).value) || 0,
            LeftCalf: parseFloat(document.getElementById(`editLogLeftCalf_${safeKey}`).value) || 0
        };

        localStorage.setItem('body_metrics_history', JSON.stringify(history));
        populateLoggedDatesList();
        renderAllBodyCharts();
    }
}

function deleteLogEntryInline(dateStr) {
    const html = `<p class="small theme-text-sub mb-3 text-light-adapt">Are you sure you want to delete the log for <strong>${dateStr}</strong>?</p>`;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-danger" onclick="confirmDeleteLogInline('${dateStr}')">Delete</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;
    showBipModal("Confirm Deletion", html, footer);
}

function confirmDeleteLogInline(dateStr) {
    let history = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    history = history.filter(item => item.date !== dateStr);

    localStorage.setItem('body_metrics_history', JSON.stringify(history));

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

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