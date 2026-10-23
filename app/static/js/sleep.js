document.addEventListener('DOMContentLoaded', () => {
    populateSleepHourSelects();

    if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    checkSleepMidnightReset();
    updateSleepDynamicDateLabels();
    loadSavedSleepState();

    setInterval(checkSleepReminders, 60000);
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

function populateSleepHourSelects() {
    const selectIds = ['dailySleepTargetSelect', 'sleepLogInput', 'editSleepLogInput', 'addPastSleepHours', 'modalCheckSleepHours'];
    
    selectIds.forEach(id => {
        const selectEl = document.getElementById(id);
        if (!selectEl) return;
        selectEl.innerHTML = '';

        for (let i = 0; i <= 288; i++) {
            let totalHours = i * (5 / 60);
            let hoursPart = Math.floor(totalHours);
            let minsPart = Math.round((totalHours - hoursPart) * 60);
            
            let text = "";
            if (hoursPart === 0) {
                text = minsPart + " Minutes";
            } else if (minsPart === 0) {
                text = hoursPart + (hoursPart === 1 ? " Hour" : " Hours");
            } else {
                text = hoursPart + "h " + minsPart + "m";
            }
            
            let opt = document.createElement('option');
            opt.value = totalHours.toFixed(2) + " hrs";
            opt.textContent = text;
            selectEl.appendChild(opt);
        }
        selectEl.selectedIndex = 96;
    });
}

function checkSleepMidnightReset() {
    const todayStr = new Date().toDateString();
    const lastLogDate = localStorage.getItem('sleep_last_log_date');

    if (lastLogDate && lastLogDate !== todayStr) {
        localStorage.removeItem('sleep_consumed_today');
        localStorage.removeItem('wake_status_today');
        localStorage.removeItem('wake_quality_score');
        localStorage.removeItem('sleep_checkin_triggered_today');
    }
    localStorage.setItem('sleep_last_log_date', todayStr);
}

function updateSleepDynamicDateLabels() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dayNumber = d.getDate();
        
        const labelEl0 = document.getElementById(`sleepDayLabel${i}`);
        const labelEl1 = document.getElementById(`qualDayLabel${i}`);

        if (labelEl0) labelEl0.textContent = (i === 6) ? "Today" : dayNumber;
        if (labelEl1) labelEl1.textContent = (i === 6) ? "Today" : dayNumber;
    }
}

function toggleSleepContainer(checkbox) {
    const container = document.getElementById('sleepHubContent');
    localStorage.setItem('sleep_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        container.classList.remove('d-none');
    } else {
        container.classList.add('d-none');
    }
}

function openSleepConfigurationHub() {
    const configContainer = document.getElementById('sleepConfigContainer');
    configContainer.classList.remove('d-none');
    document.getElementById('sleepHubOptIn').checked = true;
    document.getElementById('sleepHubContent').classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function convertTo24Hour(timeStr) {
    if (!timeStr) return "";
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
}

function checkSleepReminders() {
    const isConfigured = localStorage.getItem('sleep_configured') === 'true';
    if (!isConfigured) return;

    const checkinTime = localStorage.getItem('sleep_checkin_time');
    const triggeredToday = localStorage.getItem('sleep_checkin_triggered_today');

    if (checkinTime && checkinTime !== "" && triggeredToday !== 'true') {
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeFormatted = `${currentHours}:${currentMinutes}`;

        let checkin24 = convertTo24Hour(checkinTime);
        if (checkin24 === currentTimeFormatted) {
            localStorage.setItem('sleep_checkin_triggered_today', 'true');
            triggerInteractiveCheckinModal();
        }
    }
}

function triggerInteractiveCheckinModal() {
    const html = `
        <p class="small theme-text-sub mb-3">⏰ <strong>Check-in Closing Time:</strong> Please log your sleep hours and morning status for today:</p>
        <div class="mb-3">
            <label class="small fw-bold theme-text-title mb-1">Hours Slept</label>
            <select id="modalCheckSleepHours" class="form-select form-select-sm border-secondary custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
            </select>
        </div>
        <div class="mb-3">
            <label class="small fw-bold theme-text-title mb-1">How did you wake up?</label>
            <select id="modalCheckSleepStatus" class="form-select form-select-sm custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
                <option value="Energized & Disposed">Energized & Disposed (Excellent)</option>
                <option value="Rested & Good" selected>Rested & Good (Good)</option>
                <option value="Slightly Fatigued">Slightly Fatigued (Fair)</option>
                <option value="Did Not Sleep Enough">Did Not Sleep Enough (Poor)</option>
            </select>
        </div>
    `;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow" onclick="submitModalCheckin()" style="background-color: var(--accent-color); color: #111;">Submit Check-in</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;

    showBipModal("Sleep & Recovery Check-in", html, footer);
    setTimeout(populateSleepHourSelects, 100);
}

function submitModalCheckin() {
    const hoursSelect = document.getElementById('modalCheckSleepHours');
    const statusSelect = document.getElementById('modalCheckSleepStatus');
    
    const hoursVal = parseFloat(hoursSelect.value);
    const wakeStatus = statusSelect.value;

    if (isNaN(hoursVal) || hoursVal < 0) {
        showBipModal("Error", "Please select valid sleep hours.");
        return;
    }

    let qualityScore = 85;
    if (wakeStatus === 'Energized & Disposed') qualityScore = 95;
    else if (wakeStatus === 'Rested & Good') qualityScore = 85;
    else if (wakeStatus === 'Slightly Fatigued') qualityScore = 65;
    else if (wakeStatus === 'Did Not Sleep Enough') qualityScore = 45;

    const todayDate = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === todayDate);
    const entry = { date: todayDate, hours: hoursVal, status: wakeStatus, quality: qualityScore };
    
    if (existingIndex >= 0) {
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    localStorage.setItem('sleep_consumed_today', hoursVal.toFixed(2));
    localStorage.setItem('wake_status_today', wakeStatus);
    localStorage.setItem('wake_quality_score', qualityScore);
    localStorage.setItem('sleep_last_log_date', new Date().toDateString());

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function saveSleepConfiguration() {
    const targetSelect = document.getElementById('dailySleepTargetSelect');
    const checkSelect = document.getElementById('dailyCheckSelect');

    if (!targetSelect.value) {
        showBipModal("Error", "Please select a target sleep hours goal.");
        return;
    }

    localStorage.setItem('sleep_target_goal', targetSelect.value);
    localStorage.setItem('sleep_checkin_time', checkSelect.value || "");
    localStorage.setItem('sleep_configured', 'true');
    localStorage.setItem('sleep_hub_optin', 'false');

    document.getElementById('sleepConfigContainer').classList.add('d-none');
    updateSleepDashboardDisplay();
}

function logSleepIntake() {
    const selectEl = document.getElementById('sleepLogInput');
    const inputVal = parseFloat(selectEl.value);
    const wakeStatus = document.getElementById('wakeStatusSelect').value;

    if (isNaN(inputVal) || inputVal < 0) {
        showBipModal("Error", "Please select valid sleep hours.");
        return;
    }

    let qualityScore = 85;
    if (wakeStatus === 'Energized & Disposed') qualityScore = 95;
    else if (wakeStatus === 'Rested & Good') qualityScore = 85;
    else if (wakeStatus === 'Slightly Fatigued') qualityScore = 65;
    else if (wakeStatus === 'Did Not Sleep Enough') qualityScore = 45;

    const todayDate = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === todayDate);
    const entry = { date: todayDate, hours: inputVal, status: wakeStatus, quality: qualityScore };
    
    if (existingIndex >= 0) {
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    localStorage.setItem('sleep_consumed_today', inputVal.toFixed(2));
    localStorage.setItem('wake_status_today', wakeStatus);
    localStorage.setItem('wake_quality_score', qualityScore);
    localStorage.setItem('sleep_last_log_date', new Date().toDateString());

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function enableEditSleep() {
    const currentSlept = parseFloat(localStorage.getItem('sleep_consumed_today') || '8.00');
    const editSelect = document.getElementById('editSleepInput');
    
    for (let i = 0; i < editSelect.options.length; i++) {
        if (parseFloat(editSelect.options[i].value) === currentSlept) {
            editSelect.selectedIndex = i;
            break;
        }
    }
    document.getElementById('editSleepContainer').classList.remove('d-none');
}

function saveEditedSleep() {
    const editSelect = document.getElementById('editSleepInput');
    const newSlept = parseFloat(editSelect.value);
    if (isNaN(newSlept) || newSlept < 0) {
        showBipModal("Error", "Please select valid sleep hours.");
        return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('sleep_consumed_today', newSlept.toFixed(2));
    document.getElementById('editSleepContainer').classList.add('d-none');

    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    let idx = history.findIndex(item => item.date === todayDate);
    if (idx >= 0) {
        history[idx].hours = newSlept;
        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    } else {
        const wakeStatus = localStorage.getItem('wake_status_today') || 'Rested & Good';
        let qualityScore = parseInt(localStorage.getItem('wake_quality_score') || '85');
        history.push({ date: todayDate, hours: newSlept, status: wakeStatus, quality: qualityScore });
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    }

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function enableEditStatus() {
    const currentStatus = localStorage.getItem('wake_status_today') || 'Rested & Good';
    document.getElementById('editStatusSelect').value = currentStatus;
    document.getElementById('editStatusContainer').classList.remove('d-none');
}

function saveEditedStatus() {
    const newStatus = document.getElementById('editStatusSelect').value;
    let qualityScore = 85;
    if (newStatus === 'Energized & Disposed') qualityScore = 95;
    else if (newStatus === 'Rested & Good') qualityScore = 85;
    else if (newStatus === 'Slightly Fatigued') qualityScore = 65;
    else if (newStatus === 'Did Not Sleep Enough') qualityScore = 45;

    const todayDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('wake_status_today', newStatus);
    localStorage.setItem('wake_quality_score', qualityScore);
    document.getElementById('editStatusContainer').classList.add('d-none');

    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    let idx = history.findIndex(item => item.date === todayDate);
    if (idx >= 0) {
        history[idx].status = newStatus;
        history[idx].quality = qualityScore;
        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    } else {
        const currentSlept = parseFloat(localStorage.getItem('sleep_consumed_today') || '8.00');
        history.push({ date: todayDate, hours: currentSlept, status: newStatus, quality: qualityScore });
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    }

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function updateSleepDashboardDisplay() {
    const targetGoalStr = localStorage.getItem('sleep_target_goal') || '8.00 hrs';
    const consumedStr = localStorage.getItem('sleep_consumed_today');
    const wakeStatus = localStorage.getItem('wake_status_today') || 'Rested & Good';
    const qualityScore = parseInt(localStorage.getItem('wake_quality_score') || '85');
    const isConfigured = localStorage.getItem('sleep_configured') === 'true';

    if (isConfigured) {
        document.getElementById('sleepConfigContainer').classList.add('d-none');
        document.getElementById('sleepDashboardView').classList.remove('d-none');
        document.getElementById('sleepHistoryView').classList.remove('d-none');
        document.getElementById('sleepQualityHistoryView').classList.remove('d-none');
        document.getElementById('sleepHistoryManagementContainer').classList.remove('d-none');

        if (consumedStr !== null && consumedStr !== '') {
            document.getElementById('sleepIntakeContainer').classList.add('d-none');
        } else {
            document.getElementById('sleepIntakeContainer').classList.remove('d-none');
        }

        const consumed = consumedStr !== null && consumedStr !== '' ? parseFloat(consumedStr) : 0;
        const targetGoal = parseFloat(targetGoalStr);

        document.getElementById('sleepConsumedDisplay').textContent = consumed.toFixed(2) + ' hrs';
        document.getElementById('sleepTargetGoalDisplay').textContent = targetGoalStr;
        document.getElementById('wakeStatusDisplay').textContent = consumedStr !== null && consumedStr !== '' ? wakeStatus : 'Not logged';

        let percentage = Math.round((consumed / targetGoal) * 100);
        if (percentage > 100) percentage = 100;

        document.getElementById('sleepProgressBar').style.width = percentage + '%';
        document.getElementById('sleepPercentageText').textContent = percentage + '% of target sleep reached';

        let capConsumed = Math.min(consumed, 12.0);
        let sleepTodayY = Math.round(200 - (capConsumed / 12.0) * 200);

        let sleepPolyline = document.getElementById('sleepTrendPolyline');
        let sleepCircle = document.getElementById('sleepTodayCircle');
        let sleepText = document.getElementById('sleepTodayText');

        if (sleepPolyline) {
            sleepPolyline.setAttribute('points', `50,80 150,100 250,70 350,90 450,60 550,80 650,${sleepTodayY}`);
        }
        if (sleepCircle) {
            sleepCircle.setAttribute('cy', sleepTodayY);
        }
        if (sleepText) {
            sleepText.setAttribute('cy', sleepTodayY);
            sleepText.setAttribute('y', sleepTodayY - 12);
            sleepText.textContent = consumed.toFixed(2) + 'h';
        }

        let activeQuality = consumedStr !== null && consumedStr !== '' ? qualityScore : 0;
        let qualityTodayY = Math.round(200 - (activeQuality / 100.0) * 200);

        let qualityPolyline = document.getElementById('qualityTrendPolyline');
        let qualityCircle = document.getElementById('qualityTodayCircle');
        let qualityText = document.getElementById('qualityTodayText');

        if (qualityPolyline) {
            qualityPolyline.setAttribute('points', `50,60 150,80 250,50 350,70 450,40 550,60 650,${qualityTodayY}`);
        }
        if (qualityCircle) {
            qualityCircle.setAttribute('cy', qualityTodayY);
        }
        if (qualityText) {
            qualityText.setAttribute('cy', qualityTodayY);
            qualityText.setAttribute('y', qualityTodayY - 12);
            qualityText.textContent = activeQuality + '%';
        }

        const durationMotivation = document.getElementById('sleepDurationMotivationMessage');
        if (consumed >= targetGoal) {
            durationMotivation.innerHTML = '<i class="bi bi-award-fill me-1"></i> You have reached your target sleep duration, congratulations!';
        } else {
            durationMotivation.innerHTML = '<i class="bi bi-moon-stars-fill me-1"></i> Keep prioritizing your sleep schedule to hit your target hours!';
        }

        const qualityMotivation = document.getElementById('sleepQualityMotivationMessage');
        if (activeQuality >= 80) {
            qualityMotivation.innerHTML = '<i class="bi bi-award-fill me-1"></i> Excellent sleep quality and recovery performance!';
        } else {
            qualityMotivation.innerHTML = '<i class="bi bi-activity me-1"></i> Focus on consistent wind-down habits to boost your recovery score!';
        }

    } else {
        document.getElementById('sleepConfigContainer').classList.remove('d-none');
        document.getElementById('sleepHubOptIn').checked = false;
        document.getElementById('sleepHubContent').classList.add('d-none');
        
        document.getElementById('sleepIntakeContainer').classList.add('d-none');
        document.getElementById('sleepDashboardView').classList.add('d-none');
        document.getElementById('sleepHistoryView').classList.add('d-none');
        document.getElementById('sleepQualityHistoryView').classList.add('d-none');
        document.getElementById('sleepHistoryManagementContainer').classList.add('d-none');
    }
}

function toggleAddPastSleepLogForm() {
    const formSection = document.getElementById('sleepAddPastLogSection');
    formSection.classList.toggle('d-none');
    document.getElementById('sleepDateEditFormSection').classList.add('d-none');

    if (!formSection.classList.contains('d-none')) {
        document.getElementById('addPastSleepDate').value = new Date().toISOString().split('T')[0];
    }
}

function saveNewPastSleepLog() {
    const dateStr = document.getElementById('addPastSleepDate').value;
    const hoursSelect = document.getElementById('addPastSleepHours');
    const hoursVal = parseFloat(hoursSelect.value);
    const statusVal = document.getElementById('addPastSleepStatus').value;

    if (!dateStr) {
        showBipModal("Error", "Please select a valid date.");
        return;
    }
    if (isNaN(hoursVal) || hoursVal < 0) {
        showBipModal("Error", "Please select valid sleep hours.");
        return;
    }

    let qualityScore = 85;
    if (statusVal === 'Energized & Disposed') qualityScore = 95;
    else if (statusVal === 'Rested & Good') qualityScore = 85;
    else if (statusVal === 'Slightly Fatigued') qualityScore = 65;
    else if (statusVal === 'Did Not Sleep Enough') qualityScore = 45;

    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === dateStr);
    if (existingIndex >= 0) {
        showBipModal("Notice", "A sleep log for this date already exists. Please use View & Edit Past Logs to modify it.");
        return;
    }

    const entry = { date: dateStr, hours: hoursVal, status: statusVal, quality: qualityScore };
    history.push(entry);
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('sleep_metrics_history', JSON.stringify(history));

    const todayDate = new Date().toISOString().split('T')[0];
    if (dateStr === todayDate) {
        localStorage.setItem('sleep_consumed_today', hoursVal.toFixed(2));
        localStorage.setItem('wake_status_today', statusVal);
        localStorage.setItem('wake_quality_score', qualityScore);
    }

    document.getElementById('sleepAddPastLogSection').classList.add('d-none');
    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
    populateSleepLoggedDatesList();
}

function toggleSleepLogsList() {
    const listSection = document.getElementById('sleepLogsListSection');
    listSection.classList.toggle('d-none');
    document.getElementById('sleepAddPastLogSection').classList.add('d-none');

    if (!listSection.classList.contains('d-none')) {
        populateSleepLoggedDatesList();
    } else {
        document.getElementById('sleepDateEditFormSection').classList.add('d-none');
    }
}

function populateSleepLoggedDatesList() {
    const history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const container = document.getElementById('sleepLoggedDatesContainer');
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
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${entry.date}</span> <span class="small theme-text-sub">${entry.hours.toFixed(2)} hrs (${entry.status})</span>`;
        btn.onclick = () => loadSleepLogForEditing(entry.date);
        container.appendChild(btn);
    });
}

function loadSleepLogForEditing(dateStr) {
    const history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const entry = history.find(item => item.date === dateStr);
    if (!entry) return;

    document.getElementById('sleepEditingDateTitle').textContent = entry.date;
    
    const editSleepSelect = document.getElementById('editSleepLogInput');
    for (let i = 0; i < editSleepSelect.options.length; i++) {
        if (parseFloat(editSleepSelect.options[i].value) === (entry.hours || 0)) {
            editSleepSelect.selectedIndex = i;
            break;
        }
    }

    document.getElementById('editWakeStatusSelect').value = entry.status || 'Rested & Good';
    document.getElementById('sleepDateEditFormSection').classList.remove('d-none');
}

function saveEditedSleepLogEntry() {
    const dateStr = document.getElementById('sleepEditingDateTitle').textContent;
    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    
    let index = history.findIndex(item => item.date === dateStr);
    if (index >= 0) {
        const editSleepSelect = document.getElementById('editSleepLogInput');
        const newHours = parseFloat(editSleepSelect.value) || 0;
        const newStatus = document.getElementById('editWakeStatusSelect').value;

        let qualityScore = 85;
        if (newStatus === 'Energized & Disposed') qualityScore = 95;
        else if (newStatus === 'Rested & Good') qualityScore = 85;
        else if (newStatus === 'Slightly Fatigued') qualityScore = 65;
        else if (newStatus === 'Did Not Sleep Enough') qualityScore = 45;

        history[index] = {
            date: dateStr,
            hours: newHours,
            status: newStatus,
            quality: qualityScore
        };

        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));

        const todayDate = new Date().toISOString().split('T')[0];
        if (dateStr === todayDate) {
            localStorage.setItem('sleep_consumed_today', newHours.toFixed(2));
            localStorage.setItem('wake_status_today', newStatus);
            localStorage.setItem('wake_quality_score', qualityScore);
        }

        document.getElementById('sleepDateEditFormSection').classList.add('d-none');
        populateSleepLoggedDatesList();
        updateSleepDashboardDisplay();
    }
}

function deleteSleepLogEntry() {
    const dateStr = document.getElementById('sleepEditingDateTitle').textContent;
    
    const html = `<p class="small theme-text-sub mb-3">Are you sure you want to delete the sleep log for <strong>${dateStr}</strong>?</p>`;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-danger" onclick="confirmDeleteSleepLog('${dateStr}')">Delete</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;
    showBipModal("Confirm Deletion", html, footer);
}

function confirmDeleteSleepLog(dateStr) {
    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    history = history.filter(item => item.date !== dateStr);

    localStorage.setItem('sleep_metrics_history', JSON.stringify(history));

    const todayDate = new Date().toISOString().split('T')[0];
    if (dateStr === todayDate) {
        localStorage.removeItem('sleep_consumed_today');
        localStorage.removeItem('wake_status_today');
        localStorage.removeItem('wake_quality_score');
    }

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    document.getElementById('sleepDateEditFormSection').classList.add('d-none');
    populateSleepLoggedDatesList();
    updateSleepDashboardDisplay();
}

function loadSavedSleepState() {
    const isConfigured = localStorage.getItem('sleep_configured') === 'true';
    
    if (!isConfigured) {
        localStorage.setItem('sleep_hub_optin', 'false');
    }

    if (localStorage.getItem('sleep_target_goal')) {
        document.getElementById('dailySleepTargetSelect').value = localStorage.getItem('sleep_target_goal');
    }
    if (localStorage.getItem('sleep_checkin_time')) {
        document.getElementById('dailyCheckSelect').value = localStorage.getItem('sleep_checkin_time');
    }

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}