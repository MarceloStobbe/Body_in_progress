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

function formatHoursToDisplay(totalHours) {
    let hoursPart = Math.floor(totalHours);
    let minsPart = Math.round((totalHours - hoursPart) * 60);
    if (minsPart === 60) {
        hoursPart += 1;
        minsPart = 0;
    }
    if (hoursPart === 0) {
        return minsPart + "m";
    } else if (minsPart === 0) {
        return hoursPart + "h";
    } else {
        return hoursPart + "h " + (minsPart < 10 ? "0" : "") + minsPart + "m";
    }
}

function populateSleepHourSelects() {
    const selectIds = ['dailySleepTargetSelect', 'sleepLogInput', 'editSleepInput', 'editSleepLogInput', 'addPastSleepHours', 'modalCheckSleepHours'];
    
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
            opt.value = totalHours;
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
    localStorage.setItem('sleep_consumed_today', hoursVal);
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
    localStorage.setItem('sleep_consumed_today', inputVal);
    localStorage.setItem('wake_status_today', wakeStatus);
    localStorage.setItem('wake_quality_score', qualityScore);
    localStorage.setItem('sleep_last_log_date', new Date().toDateString());

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function enableEditSleep() {
    const currentSlept = parseFloat(localStorage.getItem('sleep_consumed_today') || '8.0');
    const editSelect = document.getElementById('editSleepInput');
    
    for (let i = 0; i < editSelect.options.length; i++) {
        if (Math.abs(parseFloat(editSelect.options[i].value) - currentSlept) < 0.01) {
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
    localStorage.setItem('sleep_consumed_today', newSlept);
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
        const currentSlept = parseFloat(localStorage.getItem('sleep_consumed_today') || '8.0');
        history.push({ date: todayDate, hours: currentSlept, status: newStatus, quality: qualityScore });
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));
    }

    updateSleepDynamicDateLabels();
    updateSleepDashboardDisplay();
}

function updateSleepDashboardDisplay() {
    const targetGoalStr = localStorage.getItem('sleep_target_goal') || '8.0';
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

        document.getElementById('sleepConsumedDisplay').textContent = formatHoursToDisplay(consumed);
        document.getElementById('sleepTargetGoalDisplay').textContent = formatHoursToDisplay(targetGoal);
        document.getElementById('wakeStatusDisplay').textContent = consumedStr !== null && consumedStr !== '' ? wakeStatus : 'Not logged';

        let percentage = Math.round((consumed / targetGoal) * 100);
        if (percentage > 100) percentage = 100;

        document.getElementById('sleepProgressBar').style.width = percentage + '%';
        document.getElementById('sleepPercentageText').textContent = percentage + '% of target sleep reached';

        renderSleepTrendCharts();

        const durationMotivation = document.getElementById('sleepDurationMotivationMessage');
        if (consumed >= targetGoal) {
            durationMotivation.innerHTML = '<i class="bi bi-award-fill me-1"></i> Outstanding! You have fully achieved or exceeded your target sleep duration.';
        } else if (consumed >= 7.0) {
            durationMotivation.innerHTML = '<i class="bi bi-moon-stars-fill me-1"></i> Good sleep duration! You are maintaining solid rest habits for recovery.';
        } else if (consumed >= 5.0) {
            durationMotivation.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Moderate sleep duration. Try to catch up on rest to avoid sleep debt accumulation.';
        } else {
            durationMotivation.innerHTML = '<i class="bi bi-shield-exclamation me-1"></i> Low sleep duration detected! Prioritize an early bedtime tonight for optimal recovery.';
        }

        const qualityMotivation = document.getElementById('sleepQualityMotivationMessage');
        let activeQuality = consumedStr !== null && consumedStr !== '' ? qualityScore : 0;
        if (activeQuality >= 90) {
            qualityMotivation.innerHTML = '<i class="bi bi-award-fill me-1"></i> Peak physical readiness! Excellent sleep quality and high recovery score.';
        } else if (activeQuality >= 80) {
            qualityMotivation.innerHTML = '<i class="bi bi-activity me-1"></i> Great recovery performance! You woke up refreshed and ready for the day.';
        } else if (activeQuality >= 60) {
            qualityMotivation.innerHTML = '<i class="bi bi-dash-circle-fill me-1"></i> Fair recovery level. Minor fatigue noted—focus on wind-down routines tonight.';
        } else {
            qualityMotivation.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i> Low recovery score. Consider taking it easier today to support physical replenishment.';
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

function renderSleepTrendCharts() {
    const history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const today = new Date();
    
    let sleepPoints = [];
    let sleepGroup = document.getElementById('sleepDynamicElements');
    if (sleepGroup) {
        sleepGroup.innerHTML = '';
        let totalSleep = 0, countSleep = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const dayNumber = (i === 6) ? "Today" : d.getDate();
            const xCoord = 50 + i * 100;
            let labelColor = (i === 6) ? "var(--accent-color)" : "#a0aec0";

            sleepGroup.innerHTML += `<text x="${xCoord}" y="225" fill="${labelColor}" font-size="12" font-weight="bold" text-anchor="middle">${dayNumber}</text>`;

            const entry = history.find(item => item.date === dateStr);
            if (entry && entry.hours !== undefined) {
                const hrs = parseFloat(entry.hours);
                totalSleep += hrs;
                countSleep++;

                let capHrs = Math.min(hrs, 12.0);
                let yCoord = Math.round(200 - (capHrs / 12.0) * 200);
                sleepPoints.push(`${xCoord},${yCoord}`);

                let circleColor = (i === 6) ? "var(--bg-card, #1e1e1e)" : "var(--accent-color)";
                let strokeAttr = (i === 6) ? `stroke="var(--accent-color)" stroke-width="3"` : "";
                let textColor = (i === 6) ? "var(--accent-color)" : "currentColor";

                let textYCoord = yCoord - 12;
                if (yCoord < 20) {
                    textYCoord = yCoord + 18;
                }

                sleepGroup.innerHTML += `
                    <circle cx="${xCoord}" cy="${yCoord}" r="5" fill="${circleColor}" ${strokeAttr} />
                    <text x="${xCoord}" y="${textYCoord}" fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">${formatHoursToDisplay(hrs)}</text>
                `;
            }
        }
        document.getElementById('sleepTrendPolyline').setAttribute('points', sleepPoints.join(' '));
        document.getElementById('avgSleepText').textContent = countSleep > 0 ? formatHoursToDisplay(totalSleep / countSleep) : '0h 00m';
    }

    let qualPoints = [];
    let qualGroup = document.getElementById('qualityDynamicElements');
    if (qualGroup) {
        qualGroup.innerHTML = '';
        let totalQual = 0, countQual = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const dayNumber = (i === 6) ? "Today" : d.getDate();
            const xCoord = 50 + i * 100;
            let labelColor = (i === 6) ? "var(--accent-color)" : "#a0aec0";

            qualGroup.innerHTML += `<text x="${xCoord}" y="225" fill="${labelColor}" font-size="12" font-weight="bold" text-anchor="middle">${dayNumber}</text>`;

            const entry = history.find(item => item.date === dateStr);
            if (entry && entry.quality !== undefined) {
                const q = parseInt(entry.quality);
                totalQual += q;
                countQual++;

                let yCoord = Math.round(200 - (q / 100.0) * 200);
                qualPoints.push(`${xCoord},${yCoord}`);

                let circleColor = (i === 6) ? "var(--bg-card, #1e1e1e)" : "var(--accent-color)";
                let strokeAttr = (i === 6) ? `stroke="var(--accent-color)" stroke-width="3"` : "";
                let textColor = (i === 6) ? "var(--accent-color)" : "currentColor";

                let textYCoord = yCoord - 12;
                if (yCoord < 20) {
                    textYCoord = yCoord + 18;
                }

                qualGroup.innerHTML += `
                    <circle cx="${xCoord}" cy="${yCoord}" r="5" fill="${circleColor}" ${strokeAttr} />
                    <text x="${xCoord}" y="${textYCoord}" fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">${q}%</text>
                `;
            }
        }
        document.getElementById('qualityTrendPolyline').setAttribute('points', qualPoints.join(' '));
        document.getElementById('avgQualityText').textContent = countQual > 0 ? Math.round(totalQual / countQual) + '%' : '0%';
    }
}

function toggleAddPastSleepLogForm() {
    const formSection = document.getElementById('sleepAddPastLogSection');
    formSection.classList.toggle('d-none');

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
        localStorage.setItem('sleep_consumed_today', hoursVal);
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

    if (!listSection.classList.contains('d-none')) {
        populateSleepLoggedDatesList();
    } else {
        document.querySelectorAll('.sleep-inline-edit-form').forEach(el => el.remove());
    }
}

function populateSleepLoggedDatesList() {
    const history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    let container = document.getElementById('sleepLoggedDatesContainer');
    
    if (!container) {
        const listSection = document.getElementById('sleepLogsListSection');
        if (!listSection) return;
        
        container = document.createElement('div');
        container.id = 'sleepLoggedDatesContainer';
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
        wrapper.id = `sleep-log-wrapper-${entry.date}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3 rounded-3';
        btn.style.cssText = 'border-color: rgba(255,255,255,0.2); color: var(--text-color); background-color: var(--bg-input, rgba(0,0,0,0.2));';
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${entry.date}</span> <span class="small theme-text-sub">${formatHoursToDisplay(entry.hours)} (${entry.status})</span>`;
        btn.onclick = () => toggleSleepLogInlineEdit(entry.date, wrapper);
        
        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    });
}

function toggleSleepLogInlineEdit(dateStr, wrapperEl) {
    const existingForm = wrapperEl.querySelector('.sleep-inline-edit-form');
    if (existingForm) {
        existingForm.remove();
        return;
    }

    document.querySelectorAll('.sleep-inline-edit-form').forEach(el => el.remove());

    const history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    const entry = history.find(item => item.date === dateStr);
    if (!entry) return;

    const formDiv = document.createElement('div');
    formDiv.className = 'sleep-inline-edit-form pt-3 pb-2 px-3 border border-secondary rounded-3 theme-box-toggle mt-1 mb-2';
    formDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0" style="color: var(--accent-color);">Editing Sleep Log for: <span class="theme-text-title">${entry.date}</span></h6>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteSleepLogEntryInline('${entry.date}')" style="font-size: 0.8rem;">Delete Log</button>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-6">
                <label class="small theme-text-sub mb-1">Hours Slept</label>
                <select id="inlineEditSleepHours_${entry.date.replace(/-/g, '_')}" class="form-select form-select-sm border-secondary custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
                </select>
            </div>
            <div class="col-md-6">
                <label class="small theme-text-sub mb-1">Wake Status</label>
                <select id="inlineEditSleepStatus_${entry.date.replace(/-/g, '_')}" class="form-select form-select-sm custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
                    <option value="Energized & Disposed">Energized & Disposed (Excellent)</option>
                    <option value="Rested & Good">Rested & Good (Good)</option>
                    <option value="Slightly Fatigued">Slightly Fatigued (Fair)</option>
                    <option value="Did Not Sleep Enough">Did Not Sleep Enough (Poor)</option>
                </select>
            </div>
        </div>

        <div class="text-center">
            <button type="button" class="btn btn-sm px-4 py-2 fw-bold rounded-pill shadow" onclick="saveInlineSleepLogEntry('${entry.date}')" style="background-color: var(--accent-color); color: #111;">
                Save Changes
            </button>
        </div>
    `;

    wrapperEl.appendChild(formDiv);

    const selectEl = document.getElementById(`inlineEditSleepHours_${entry.date.replace(/-/g, '_')}`);
    if (selectEl) {
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
            opt.value = totalHours;
            opt.textContent = text;
            selectEl.appendChild(opt);
        }

        for (let i = 0; i < selectEl.options.length; i++) {
            if (Math.abs(parseFloat(selectEl.options[i].value) - (entry.hours || 0)) < 0.01) {
                selectEl.selectedIndex = i;
                break;
            }
        }
    }

    const statusEl = document.getElementById(`inlineEditSleepStatus_${entry.date.replace(/-/g, '_')}`);
    if (statusEl) {
        statusEl.value = entry.status || 'Rested & Good';
    }
}

function saveInlineSleepLogEntry(dateStr) {
    const safeDateKey = dateStr.replace(/-/g, '_');
    const hoursSelect = document.getElementById(`inlineEditSleepHours_${safeDateKey}`);
    const statusSelect = document.getElementById(`inlineEditSleepStatus_${safeDateKey}`);
    
    if (!hoursSelect || !statusSelect) return;

    const newHours = parseFloat(hoursSelect.value) || 0;
    const newStatus = statusSelect.value;

    let qualityScore = 85;
    if (newStatus === 'Energized & Disposed') qualityScore = 95;
    else if (newStatus === 'Rested & Good') qualityScore = 85;
    else if (newStatus === 'Slightly Fatigued') qualityScore = 65;
    else if (newStatus === 'Did Not Sleep Enough') qualityScore = 45;

    let history = JSON.parse(localStorage.getItem('sleep_metrics_history') || '[]');
    let index = history.findIndex(item => item.date === dateStr);
    
    if (index >= 0) {
        history[index] = {
            date: dateStr,
            hours: newHours,
            status: newStatus,
            quality: qualityScore
        };

        localStorage.setItem('sleep_metrics_history', JSON.stringify(history));

        const todayDate = new Date().toISOString().split('T')[0];
        if (dateStr === todayDate) {
            localStorage.setItem('sleep_consumed_today', newHours);
            localStorage.setItem('wake_status_today', newStatus);
            localStorage.setItem('wake_quality_score', qualityScore);
        }

        populateSleepLoggedDatesList();
        updateSleepDashboardDisplay();
    }
}

function deleteSleepLogEntryInline(dateStr) {
    const html = `<p class="small theme-text-sub mb-3">Are you sure you want to delete the sleep log for <strong>${dateStr}</strong>?</p>`;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-danger" onclick="confirmDeleteSleepLogInline('${dateStr}')">Delete</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;
    showBipModal("Confirm Deletion", html, footer);
}

function confirmDeleteSleepLogInline(dateStr) {
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