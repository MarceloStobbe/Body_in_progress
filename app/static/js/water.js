let scheduledTimesList = [];

document.addEventListener('DOMContentLoaded', () => {
    populateWaterVolumeSelects();

    if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    checkMidnightReset();
    updateDynamicDateLabels();
    loadSavedWaterState();

    setInterval(checkHydrationReminders, 60000);
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

function populateWaterVolumeSelects() {
    const selectIds = ['dailyWaterTargetSelect', 'waterLogInput', 'editConsumedInput', 'addPastWaterVolume', 'modalCheckWaterVolume'];
    
    selectIds.forEach(id => {
        const selectEl = document.getElementById(id);
        if (!selectEl) return;
        selectEl.innerHTML = '';

        for (let i = 1; i <= 50; i++) {
            let val = (i / 10).toFixed(1);
            let text = val + (val === "1.0" ? " Liter" : " Liters");
            
            let opt = document.createElement('option');
            opt.value = val + " L";
            opt.textContent = text;
            selectEl.appendChild(opt);
        }
        if (id === 'dailyWaterTargetSelect') {
            selectEl.selectedIndex = 24; 
        } else {
            selectEl.selectedIndex = 19; 
        }
    });
}

function checkMidnightReset() {
    const todayStr = new Date().toDateString();
    const lastLogDate = localStorage.getItem('water_last_log_date');

    if (lastLogDate && lastLogDate !== todayStr) {
        localStorage.removeItem('water_consumed_today');
        localStorage.removeItem('water_checkin_triggered_today');
    }
    localStorage.setItem('water_last_log_date', todayStr);
}

function updateDynamicDateLabels() {
    const consumedStr = localStorage.getItem('water_consumed_today');
    const hasTodayConsumed = consumedStr !== null && consumedStr !== '';
    const today = new Date();

    const offsetStart = hasTodayConsumed ? 6 : 7;

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (offsetStart - i));
        const dayNumber = d.getDate();
        const labelEl = document.getElementById(`svgDayLabel${i}`);

        if (labelEl) {
            if (i === 6 && hasTodayConsumed) {
                labelEl.textContent = "Today";
            } else {
                labelEl.textContent = dayNumber;
            }
        }
    }
}

function toggleHydrationContainer(checkbox) {
    const container = document.getElementById('hydrationHubContent');
    localStorage.setItem('water_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        container.classList.remove('d-none');
    } else {
        container.classList.add('d-none');
    }
}

function openConfigurationHub() {
    const configContainer = document.getElementById('hydrationConfigContainer');
    
    configContainer.classList.remove('d-none');
    document.getElementById('hydrationHubOptIn').checked = true;
    document.getElementById('hydrationHubContent').classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderReminderBadges() {
    const listContainer = document.getElementById('scheduleList');
    listContainer.innerHTML = '';
    scheduledTimesList.forEach((t, index) => {
        listContainer.innerHTML += `
            <div class="badge theme-badge border d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm">
                <i class="bi bi-alarm" style="color: var(--accent-color);"></i> <span>${t}</span>
                <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-1" onclick="removeReminder('${index}')"><i class="bi bi-x-circle-fill"></i></button>
            </div>`;
    });
}

function addReminderTime() {
    const select = document.getElementById('timeSelectAMPM');
    if (select.value && !scheduledTimesList.includes(select.value)) {
        scheduledTimesList.push(select.value);
        scheduledTimesList.sort((a, b) => {
            let timeA = convertTo24Hour(a);
            let timeB = convertTo24Hour(b);
            return timeA.localeCompare(timeB);
        });
        renderReminderBadges();
    }
}

function removeReminder(index) {
    scheduledTimesList.splice(index, 1);
    renderReminderBadges();
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

function checkHydrationReminders() {
    const isConfigured = localStorage.getItem('water_configured') === 'true';
    if (!isConfigured) return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeFormatted = `${currentHours}:${currentMinutes}`;

    const savedTimes = JSON.parse(localStorage.getItem('water_scheduled_times') || '[]');
    if (savedTimes.length > 0) {
        savedTimes.forEach((tStr, index) => {
            let t24 = convertTo24Hour(tStr);
            if (t24 === currentTimeFormatted) {
                const targetGoalStr = localStorage.getItem('water_target_goal') || '2.5 L';
                const totalTarget = parseFloat(targetGoalStr);
                const intervalCount = savedTimes.length;
                const portion = (totalTarget / intervalCount).toFixed(1);

                const message = `💧 Hydration Reminder (${index + 1}/${intervalCount}): Time to drink water! Recommended target for this interval: ${portion} L.`;

                if (window.Notification && Notification.permission === "granted") {
                    new Notification("Body in Progress | Water & Hydration Tracker", { body: message, icon: "/static/favicon.ico" });
                } else {
                    showBipModal("Hydration Reminder", `<p class="small theme-text-sub mb-0">${message}</p>`);
                }
            }
        });
    }

    const checkinTime = localStorage.getItem('water_checkin_time');
    const triggeredToday = localStorage.getItem('water_checkin_triggered_today');

    if (checkinTime && checkinTime !== "" && triggeredToday !== 'true') {
        let checkin24 = convertTo24Hour(checkinTime);
        if (checkin24 === currentTimeFormatted) {
            localStorage.setItem('water_checkin_triggered_today', 'true');
            triggerInteractiveCheckinModal();
        }
    }
}

function triggerInteractiveCheckinModal() {
    const html = `
        <p class="small theme-text-sub mb-3">⏰ <strong>Check-in Closing Time:</strong> Your hydration tracking for today is closing. Please log your final total water consumption:</p>
        <div class="mb-3">
            <label class="small fw-bold theme-text-title mb-1">Total Water Consumed</label>
            <select id="modalCheckWaterVolume" class="form-select form-select-sm border-secondary custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
            </select>
        </div>
    `;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow" onclick="submitModalCheckin()" style="background-color: var(--accent-color); color: #111;">Submit Check-in</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;

    showBipModal("Hydration Check-in", html, footer);
    setTimeout(populateWaterVolumeSelects, 100);
}

function submitModalCheckin() {
    const volumeSelect = document.getElementById('modalCheckWaterVolume');
    const volumeVal = parseFloat(volumeSelect.value);

    if (isNaN(volumeVal) || volumeVal < 0) {
        showBipModal("Error", "Please select a valid water volume.");
        return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === todayDate);
    const entry = { date: todayDate, volume: volumeVal };
    
    if (existingIndex >= 0) {
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('water_metrics_history', JSON.stringify(history));
    localStorage.setItem('water_consumed_today', volumeVal.toFixed(1));
    localStorage.setItem('water_last_log_date', new Date().toDateString());

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    updateDynamicDateLabels();
    updateDashboardDisplay();
}

function saveHydrationConfiguration() {
    const targetSelect = document.getElementById('dailyWaterTargetSelect');
    const checkSelect = document.getElementById('dailyCheckSelect');

    if (!targetSelect.value) {
        showBipModal("Error", "Please select a target daily water volume.");
        return;
    }

    localStorage.setItem('water_target_goal', targetSelect.value);
    localStorage.setItem('water_checkin_time', checkSelect.value || "");
    localStorage.setItem('water_scheduled_times', JSON.stringify(scheduledTimesList));
    localStorage.setItem('water_configured', 'true');
    localStorage.setItem('water_hub_optin', 'false');

    document.getElementById('hydrationConfigContainer').classList.add('d-none');

    updateDashboardDisplay();
}

function logWaterIntake() {
    const selectEl = document.getElementById('waterLogInput');
    const inputVal = parseFloat(selectEl.value);
    if (isNaN(inputVal) || inputVal < 0) {
        showBipModal("Error", "Please select a valid water volume.");
        return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === todayDate);
    const entry = { date: todayDate, volume: inputVal };
    
    if (existingIndex >= 0) {
        history[existingIndex] = entry;
    } else {
        history.push(entry);
    }
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('water_metrics_history', JSON.stringify(history));
    localStorage.setItem('water_consumed_today', inputVal.toFixed(1));
    localStorage.setItem('water_last_log_date', new Date().toDateString());

    updateDynamicDateLabels();
    updateDashboardDisplay();
}

function enableEditConsumed() {
    const currentConsumed = parseFloat(localStorage.getItem('water_consumed_today') || '2.0');
    const editSelect = document.getElementById('editConsumedInput');
    
    for (let i = 0; i < editSelect.options.length; i++) {
        if (parseFloat(editSelect.options[i].value) === currentConsumed) {
            editSelect.selectedIndex = i;
            break;
        }
    }
    document.getElementById('editConsumedContainer').classList.remove('d-none');
}

function saveEditedConsumed() {
    const editSelect = document.getElementById('editConsumedInput');
    const newConsumed = parseFloat(editSelect.value);
    if (isNaN(newConsumed) || newConsumed < 0) {
        showBipModal("Error", "Please select a valid water volume.");
        return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('water_consumed_today', newConsumed.toFixed(1));
    document.getElementById('editConsumedContainer').classList.add('d-none');

    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    let idx = history.findIndex(item => item.date === todayDate);
    if (idx >= 0) {
        history[idx].volume = newConsumed;
        localStorage.setItem('water_metrics_history', JSON.stringify(history));
    } else {
        history.push({ date: todayDate, volume: newConsumed });
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('water_metrics_history', JSON.stringify(history));
    }

    updateDynamicDateLabels();
    updateDashboardDisplay();
}

function updateDashboardDisplay() {
    const targetGoalStr = localStorage.getItem('water_target_goal') || '2.5 L';
    const consumedStr = localStorage.getItem('water_consumed_today');
    const isConfigured = localStorage.getItem('water_configured') === 'true';

    if (isConfigured) {
        document.getElementById('hydrationConfigContainer').classList.add('d-none');
        document.getElementById('waterHistoryManagementContainer').classList.remove('d-none');

        if (consumedStr !== null && consumedStr !== '') {
            document.getElementById('hydrationIntakeContainer').classList.add('d-none');
        } else {
            document.getElementById('hydrationIntakeContainer').classList.remove('d-none');
        }

        const consumed = consumedStr !== null && consumedStr !== '' ? parseFloat(consumedStr) : 0;
        const targetGoal = parseFloat(targetGoalStr);

        document.getElementById('consumedDisplay').textContent = consumed.toFixed(1) + ' L';
        document.getElementById('targetGoalDisplay').textContent = targetGoalStr;

        let percentage = Math.round((consumed / targetGoal) * 100);
        if (percentage > 100) percentage = 100;

        document.getElementById('hydrationProgressBar').style.width = percentage + '%';
        document.getElementById('hydrationPercentageText').textContent = percentage + '% of daily goal reached';

        renderTrendChart();

        const motivationBox = document.getElementById('motivationMessage');
        if (consumed >= targetGoal) {
            motivationBox.innerHTML = '<i class="bi bi-award-fill me-1"></i> Outstanding! You have fully achieved or exceeded your daily hydration goal.';
        } else if (consumed >= (targetGoal * 0.75)) {
            motivationBox.innerHTML = '<i class="bi bi-droplet-fill me-1"></i> Great progress! You are very close to completing your daily hydration target.';
        } else if (consumed >= (targetGoal * 0.4)) {
            motivationBox.innerHTML = '<i class="bi bi-droplet-half me-1"></i> Keep going with your hydration to reach your daily goal!';
        } else {
            motivationBox.innerHTML = '<i class="bi bi-shield-exclamation me-1"></i> Low water intake detected! Drink more fluids to stay properly hydrated today.';
        }

    } else {
        document.getElementById('hydrationConfigContainer').classList.remove('d-none');
        document.getElementById('hydrationHubOptIn').checked = false;
        document.getElementById('hydrationHubContent').classList.add('d-none');
        
        document.getElementById('hydrationIntakeContainer').classList.add('d-none');
        document.getElementById('waterHistoryManagementContainer').classList.add('d-none');
    }
}

function renderTrendChart() {
    const history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    const today = new Date();
    
    let polylinePoints = [];
    let dynamicGroup = document.getElementById('trendDynamicElements');
    if (!dynamicGroup) return;
    dynamicGroup.innerHTML = '';

    let totalSum = 0;
    let countEntries = 0;

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayNumber = (i === 6) ? "Today" : d.getDate();
        
        const xCoord = 50 + i * 100;
        let labelColor = (i === 6) ? "var(--accent-color)" : "#a0aec0";
        dynamicGroup.innerHTML += `<text x="${xCoord}" y="225" fill="${labelColor}" font-size="12" font-weight="bold" text-anchor="middle">${dayNumber}</text>`;

        const logEntry = history.find(item => item.date === dateStr);
        if (logEntry && logEntry.volume !== undefined && logEntry.volume !== null) {
            const vol = parseFloat(logEntry.volume);
            totalSum += vol;
            countEntries++;

            let capVol = Math.min(vol, 5.0);
            let yCoord = Math.round(200 - (capVol / 5.0) * 200);

            polylinePoints.push(`${xCoord},${yCoord}`);

            let circleColor = (i === 6) ? "var(--bg-card, #1e1e1e)" : "var(--accent-color)";
            let strokeAttr = (i === 6) ? `stroke="var(--accent-color)" stroke-width="3"` : "";
            let textColor = (i === 6) ? "var(--accent-color)" : "currentColor";

            let textYCoord = yCoord - 12;
            if (yCoord < 20) {
                textYCoord = yCoord + 18;
            }

            dynamicGroup.innerHTML += `
                <circle cx="${xCoord}" cy="${yCoord}" r="5" fill="${circleColor}" ${strokeAttr} />
                <text x="${xCoord}" y="${textYCoord}" fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">${vol.toFixed(1)}L</text>
            `;
        }
    }

    const polylineEl = document.getElementById('trendPolyline');
    if (polylineEl) {
        polylineEl.setAttribute('points', polylinePoints.join(' '));
    }

    const avg = countEntries > 0 ? (totalSum / countEntries).toFixed(1) : "0.0";
    const avgTextEl = document.getElementById('avgConsumptionText');
    if (avgTextEl) {
        avgTextEl.textContent = avg + ' L';
    }
}

function toggleAddPastWaterLogForm() {
    const formSection = document.getElementById('waterAddPastLogSection');
    formSection.classList.toggle('d-none');
    document.querySelectorAll('.water-inline-edit-form').forEach(el => el.remove());

    if (!formSection.classList.contains('d-none')) {
        document.getElementById('addPastWaterDate').value = new Date().toISOString().split('T')[0];
    }
}

function saveNewPastWaterLog() {
    const dateStr = document.getElementById('addPastWaterDate').value;
    const volumeSelect = document.getElementById('addPastWaterVolume');
    const volumeVal = parseFloat(volumeSelect.value);

    if (!dateStr) {
        showBipModal("Error", "Please select a valid date.");
        return;
    }
    if (isNaN(volumeVal) || volumeVal < 0) {
        showBipModal("Error", "Please select a valid water volume.");
        return;
    }

    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    
    let existingIndex = history.findIndex(item => item.date === dateStr);
    if (existingIndex >= 0) {
        showBipModal("Notice", "A hydration log for this date already exists. Please use View & Edit Past Logs to modify it.");
        return;
    }

    const entry = { date: dateStr, volume: volumeVal };
    history.push(entry);
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('water_metrics_history', JSON.stringify(history));

    const todayDate = new Date().toISOString().split('T')[0];
    if (dateStr === todayDate) {
        localStorage.setItem('water_consumed_today', volumeVal.toFixed(1));
    }

    document.getElementById('waterAddPastLogSection').classList.add('d-none');
    updateDynamicDateLabels();
    updateDashboardDisplay();
    populateWaterLoggedDatesList();
}

function toggleWaterLogsList() {
    const listSection = document.getElementById('waterLogsListSection');
    listSection.classList.toggle('d-none');
    document.getElementById('waterAddPastLogSection').classList.add('d-none');

    if (!listSection.classList.contains('d-none')) {
        populateWaterLoggedDatesList();
    } else {
        document.querySelectorAll('.water-inline-edit-form').forEach(el => el.remove());
    }
}

function populateWaterLoggedDatesList() {
    const history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    let container = document.getElementById('waterLoggedDatesContainer');
    
    if (!container) {
        const listSection = document.getElementById('waterLogsListSection');
        if (!listSection) return;
        
        container = document.createElement('div');
        container.id = 'waterLoggedDatesContainer';
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
        wrapper.id = `water-log-wrapper-${entry.date}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3 rounded-3';
        btn.style.cssText = 'border-color: rgba(255,255,255,0.2); color: var(--text-color); background-color: var(--bg-input, rgba(0,0,0,0.2));';
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${entry.date}</span> <span class="small theme-text-sub">${entry.volume.toFixed(1)} L</span>`;
        btn.onclick = () => toggleWaterLogInlineEdit(entry.date, wrapper);
        
        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    });
}

function toggleWaterLogInlineEdit(dateStr, wrapperEl) {
    const existingForm = wrapperEl.querySelector('.water-inline-edit-form');
    if (existingForm) {
        existingForm.remove();
        return;
    }

    document.querySelectorAll('.water-inline-edit-form').forEach(el => el.remove());

    const history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    const entry = history.find(item => item.date === dateStr);
    if (!entry) return;

    const formDiv = document.createElement('div');
    formDiv.className = 'water-inline-edit-form pt-3 pb-2 px-3 border border-secondary rounded-3 theme-box-toggle mt-1 mb-2';
    formDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0" style="color: var(--accent-color);">Editing Hydration Log for: <span class="theme-text-title">${entry.date}</span></h6>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteWaterLogEntryInline('${entry.date}')" style="font-size: 0.8rem;">Delete Log</button>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-12">
                <label class="small theme-text-sub mb-1">Water Volume</label>
                <select id="inlineEditWaterVolume_${entry.date.replace(/-/g, '_')}" class="form-select form-select-sm border-secondary custom-select-dropdown" onfocus="this.size=5;" onblur="this.size=1;" onchange="this.size=1; this.blur();">
                </select>
            </div>
        </div>

        <div class="text-center">
            <button type="button" class="btn btn-sm px-4 py-2 fw-bold rounded-pill shadow" onclick="saveInlineWaterLogEntry('${entry.date}')" style="background-color: var(--accent-color); color: #111;">
                Save Changes
            </button>
        </div>
    `;

    wrapperEl.appendChild(formDiv);

    const selectEl = document.getElementById(`inlineEditWaterVolume_${entry.date.replace(/-/g, '_')}`);
    if (selectEl) {
        selectEl.innerHTML = '';
        for (let i = 1; i <= 50; i++) {
            let val = (i / 10).toFixed(1);
            let text = val + (val === "1.0" ? " Liter" : " Liters");
            
            let opt = document.createElement('option');
            opt.value = val + " L";
            opt.textContent = text;
            selectEl.appendChild(opt);
        }

        for (let i = 0; i < selectEl.options.length; i++) {
            if (parseFloat(selectEl.options[i].value) === (entry.volume || 0)) {
                selectEl.selectedIndex = i;
                break;
            }
        }
    }
}

function saveInlineWaterLogEntry(dateStr) {
    const safeDateKey = dateStr.replace(/-/g, '_');
    const volumeSelect = document.getElementById(`inlineEditWaterVolume_${safeDateKey}`);
    
    if (!volumeSelect) return;

    const newVolume = parseFloat(volumeSelect.value) || 0;

    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    let index = history.findIndex(item => item.date === dateStr);
    
    if (index >= 0) {
        history[index] = {
            date: dateStr,
            volume: newVolume
        };

        localStorage.setItem('water_metrics_history', JSON.stringify(history));

        const todayDate = new Date().toISOString().split('T')[0];
        if (dateStr === todayDate) {
            localStorage.setItem('water_consumed_today', newVolume.toFixed(1));
        }

        populateWaterLoggedDatesList();
        updateDashboardDisplay();
    }
}

function deleteWaterLogEntryInline(dateStr) {
    const html = `<p class="small theme-text-sub mb-3">Are you sure you want to delete the hydration log for <strong>${dateStr}</strong>?</p>`;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-danger" onclick="confirmDeleteWaterLogInline('${dateStr}')">Delete</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel</button>
    `;
    showBipModal("Confirm Deletion", html, footer);
}

function confirmDeleteWaterLogInline(dateStr) {
    let history = JSON.parse(localStorage.getItem('water_metrics_history') || '[]');
    history = history.filter(item => item.date !== dateStr);

    localStorage.setItem('water_metrics_history', JSON.stringify(history));

    const todayDate = new Date().toISOString().split('T')[0];
    if (dateStr === todayDate) {
        localStorage.removeItem('water_consumed_today');
    }

    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    populateWaterLoggedDatesList();
    updateDashboardDisplay();
}

function loadSavedWaterState() {
    const isConfigured = localStorage.getItem('water_configured') === 'true';
    
    if (!isConfigured) {
        localStorage.setItem('water_hub_optin', 'false');
    }

    const savedTimes = JSON.parse(localStorage.getItem('water_scheduled_times') || '[]');
    scheduledTimesList = savedTimes;
    renderReminderBadges();

    if (localStorage.getItem('water_target_goal')) {
        document.getElementById('dailyWaterTargetSelect').value = localStorage.getItem('water_target_goal');
    }
    if (localStorage.getItem('water_checkin_time')) {
        document.getElementById('dailyCheckSelect').value = localStorage.getItem('water_checkin_time');
    }

    updateDynamicDateLabels();
    updateDashboardDisplay();
}