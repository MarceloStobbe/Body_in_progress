const EXERCISE_CATALOG = {
    "Chest": [
        "Barbell Bench Press", "Incline Barbell Bench Press", "Decline Barbell Bench Press", 
        "Dumbbell Bench Press", "Incline Dumbbell Press", "Chest Flyes / Pec Deck", 
        "Dumbbell Pullover", "Dips", "Push-ups", "Cable Crossover", "Chest Press Machine"
    ],
    "Back": [
        "Lat Pulldowns", "Barbell Rows", "Seated Cable Rows", "Pull-ups", 
        "Deadlifts", "Single-Arm Dumbbell Row", "T-Bar Row", "Straight-Arm Pulldown", "Chin-ups",
        "Open Grip Lat Pulldown", "Machine Row"
    ],
    "Quadriceps": [
        "Barbell Back Squat", "Leg Press 45º", "Leg Extensions", "Front Squat", 
        "Walking Lunges", "Bulgarian Split Squat", "Hack Squat", "GobletSquat"
    ],
    "Hamstrings": [
        "Lying Leg Curls", "Romanian Deadlifts (Stiff)", "Seated Leg Curls", 
        "Good Mornings", "Nordic Hamstring Curls", "Single-Leg Deadlift"
    ],
    "Shoulders": [
        "Overhead Barbell Press", "Dumbbell Shoulder Press", "Dumbbell Lateral Raises", 
        "Front Raises", "Face Pulls", "Dumbbell Rear Delt Flyes", "Upright Rows",
        "Military Press", "Machine Shoulder Press"
    ],
    "Biceps": [
        "Barbell Bicep Curls", "Dumbbell Hammer Curls", "Preacher Curls", 
        "Concentration Curls", "Cable Bicep Curls", "Incline Dumbbell Curls", "Alternating Dumbbell Curls", "Rosca Scott"
    ],
    "Triceps": [
        "Tricep Rope Pushdowns", "Skullcrushers", "Close-Grip Bench Press", 
        "Overhead Tricep Extension", "Tricep Dips on Bench", "Single-Arm Cable Kickbacks", "Tricep Cable Cord"
    ],
    "Traps": [
        "Barbell Shrugs", "Dumbbell Shrugs", "Smith Machine Shrugs", "Farmer's Walk"
    ],
    "Abs / Core": [
        "Plank", "Hanging Leg Raises", "Abdominal Crunches", 
        "Russian Twists", "Cable Woodchoppers", "Decline Bench Crunches", "Cable Crunch", "Leg Raises", "Abdominal na polia", "Elevação de pernas", "Prancha abdominal"
    ],
    "Calves": [
        "Standing Calf Raises", "Seated Calf Raises", "Panturrilha em pé", "Panturrilha sentado"
    ],
    "Glutes": [
        "Hip Thrusts", "Cable Glute Kickbacks", "Abductor Machine", "Cadeira abdutora", "Elevação pélvica", "Glúteo na polia"
    ],
    "Cardio": [
        "Treadmill Running", "Stationary Bike", "Elliptical Trainer", 
        "Stair Climber", "Rowing Machine", "HIIT / Sprints"
    ]
};

const PRESET_ROUTINES_DATA = {
    "beginner": [
        {
            id: 1,
            name: "Workout A",
            selections: [
                { muscleGroup: "Chest", selectedExercises: ["Chest Press Machine", "Incline Dumbbell Press", "Chest Flyes / Pec Deck", "Cable Crossover"] },
                { muscleGroup: "Triceps", selectedExercises: ["Tricep Rope Pushdowns", "Overhead Tricep Extension"] }
            ]
        },
        {
            id: 2,
            name: "Workout B",
            selections: [
                { muscleGroup: "Back", selectedExercises: ["Lat Pulldowns", "Seated Cable Rows", "T-Bar Row", "Straight-Arm Pulldown"] },
                { muscleGroup: "Biceps", selectedExercises: ["Barbell Bicep Curls", "Alternating Dumbbell Curls"] }
            ]
        },
        {
            id: 3,
            name: "Workout C",
            selections: [
                { muscleGroup: "Quadriceps", selectedExercises: ["Leg Press 45º", "Leg Extensions"] },
                { muscleGroup: "Hamstrings", selectedExercises: ["Lying Leg Curls"] },
                { muscleGroup: "Glutes", selectedExercises: ["Abductor Machine"] },
                { muscleGroup: "Shoulders", selectedExercises: ["Military Press", "Dumbbell Lateral Raises"] },
                { muscleGroup: "Abs / Core", selectedExercises: ["Abdominal Crunches"] }
            ]
        }
    ],
    "intermediate": [
        {
            id: 1,
            name: "Workout A",
            selections: [
                { muscleGroup: "Chest", selectedExercises: ["Barbell Bench Press", "Incline Dumbbell Press", "Chest Flyes / Pec Deck", "Cable Crossover"] },
                { muscleGroup: "Triceps", selectedExercises: ["Skullcrushers", "Tricep Rope Pushdowns", "Overhead Tricep Extension"] }
            ]
        },
        {
            id: 2,
            name: "Workout B",
            selections: [
                { muscleGroup: "Back", selectedExercises: ["Pull-ups", "Lat Pulldowns", "Barbell Rows", "Single-Arm Dumbbell Row", "Straight-Arm Pulldown"] },
                { muscleGroup: "Biceps", selectedExercises: ["Barbell Bicep Curls", "Rosca Scott", "Dumbbell Hammer Curls"] }
            ]
        },
        {
            id: 3,
            name: "Workout C",
            selections: [
                { muscleGroup: "Quadriceps", selectedExercises: ["Barbell Back Squat", "Leg Press 45º", "Hack Squat", "Leg Extensions", "Walking Lunges"] },
                { muscleGroup: "Calves", selectedExercises: ["Standing Calf Raises", "Seated Calf Raises"] }
            ]
        },
        {
            id: 4,
            name: "Workout D",
            selections: [
                { muscleGroup: "Shoulders", selectedExercises: ["Dumbbell Shoulder Press", "Dumbbell Lateral Raises", "Dumbbell Rear Delt Flyes"] },
                { muscleGroup: "Hamstrings", selectedExercises: ["Romanian Deadlifts (Stiff)", "Lying Leg Curls", "Seated Leg Curls"] },
                { muscleGroup: "Glutes", selectedExercises: ["Hip Thrusts", "Abductor Machine"] }
            ]
        }
    ],
    "advanced": [
        {
            id: 1,
            name: "Workout A",
            selections: [
                { muscleGroup: "Chest", selectedExercises: ["Barbell Bench Press", "Incline Dumbbell Press", "Decline Barbell Bench Press", "Chest Flyes / Pec Deck", "Cable Crossover"] },
                { muscleGroup: "Abs / Core", selectedExercises: ["Abdominal na polia", "Elevação de pernas", "Prancha abdominal"] }
            ]
        },
        {
            id: 2,
            name: "Workout B",
            selections: [
                { muscleGroup: "Back", selectedExercises: ["Pull-ups", "Barbell Rows", "T-Bar Row", "Lat Pulldowns", "Single-Arm Dumbbell Row", "Straight-Arm Pulldown"] },
                { muscleGroup: "Traps", selectedExercises: ["Dumbbell Shrugs", "Face Pulls"] }
            ]
        },
        {
            id: 3,
            name: "Workout C",
            selections: [
                { muscleGroup: "Quadriceps", selectedExercises: ["Barbell Back Squat", "Hack Squat", "Leg Press 45º", "Leg Extensions", "Walking Lunges", "Bulgarian Split Squat"] },
                { muscleGroup: "Calves", selectedExercises: ["Standing Calf Raises", "Seated Calf Raises"] }
            ]
        },
        {
            id: 4,
            name: "Workout D",
            selections: [
                { muscleGroup: "Shoulders", selectedExercises: ["Overhead Barbell Press", "Dumbbell Lateral Raises", "Front Raises", "Dumbbell Rear Delt Flyes"] },
                { muscleGroup: "Biceps", selectedExercises: ["Barbell Bicep Curls", "Rosca Scott", "Dumbbell Hammer Curls"] },
                { muscleGroup: "Triceps", selectedExercises: ["Skullcrushers", "Tricep Rope Pushdowns", "Overhead Tricep Extension"] }
            ]
        },
        {
            id: 5,
            name: "Workout E",
            selections: [
                { muscleGroup: "Hamstrings", selectedExercises: ["Romanian Deadlifts (Stiff)", "Lying Leg Curls", "Seated Leg Curls"] },
                { muscleGroup: "Glutes", selectedExercises: ["Hip Thrusts", "Glúteo na polia", "Cadeira abdutora"] },
                { muscleGroup: "Calves", selectedExercises: ["Seated Calf Raises"] }
            ]
        }
    ]
};

let currentConfigMode = 'custom';
let customAddedExercises = {};
let activeRoutineSelections = [];
let currentPerformingRoutineName = "";

let workoutSessionInterval = null;
let workoutSeconds = 0;
let restTimerInterval = null;
let restSeconds = 60;
let restTargetSeconds = 60;
let isRestRunning = false;

document.addEventListener('DOMContentLoaded', () => {
    loadSavedWorkoutState();
    updateLiveExerciseDropdown();
    updateEditDayExerciseDropdown();
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

function toggleWorkoutContainer(checkbox) {
    const container = document.getElementById('workoutHubContent');
    localStorage.setItem('workout_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        container.classList.remove('d-none');
        if (currentConfigMode === 'custom') {
            generateRoutineConfigurations();
        } else {
            loadPresetRoutineConfiguration();
        }
    } else {
        container.classList.add('d-none');
    }
}

function openWorkoutConfigurationHub() {
    document.getElementById('workoutConfigContainer').classList.remove('d-none');
    document.getElementById('topActionButtonsWrapper').classList.add('d-none');
    document.getElementById('workoutDashboardView').classList.add('d-none');
    document.getElementById('activeExecutionPanel').classList.add('d-none');
    document.getElementById('workoutChartsSection').classList.add('d-none');
    document.getElementById('workoutHistoryManagementContainer').classList.add('d-none');
    document.getElementById('workoutHubOptIn').checked = true;
    document.getElementById('workoutHubContent').classList.remove('d-none');
    
    if (currentConfigMode === 'custom') {
        generateRoutineConfigurations();
    } else {
        loadPresetRoutineConfiguration();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchConfigMode(mode) {
    currentConfigMode = mode;
    const customSec = document.getElementById('customConfigSection');
    const presetSec = document.getElementById('presetConfigSection');
    const customBtn = document.getElementById('modeCustomBtn');
    const presetBtn = document.getElementById('modePresetBtn');

    if (mode === 'custom') {
        customSec.classList.remove('d-none');
        presetSec.classList.add('d-none');
        customBtn.style.backgroundColor = 'var(--accent-color)';
        customBtn.style.color = '#111';
        customBtn.classList.remove('btn-outline-secondary');
        
        presetBtn.style.backgroundColor = 'transparent';
        presetBtn.style.color = 'var(--text-color)';
        presetBtn.classList.add('btn-outline-secondary');
        generateRoutineConfigurations();
    } else {
        customSec.classList.add('d-none');
        presetSec.classList.remove('d-none');
        presetBtn.style.backgroundColor = 'var(--accent-color)';
        presetBtn.style.color = '#111';
        presetBtn.classList.remove('btn-outline-secondary');
        
        customBtn.style.backgroundColor = 'transparent';
        customBtn.style.color = 'var(--text-color)';
        customBtn.classList.add('btn-outline-secondary');
        loadPresetRoutineConfiguration();
    }
}

function toggleRoutinesList() {
    const dashboardView = document.getElementById('workoutDashboardView');
    dashboardView.classList.toggle('d-none');
    if (!dashboardView.classList.contains('d-none')) {
        window.scrollTo({ top: dashboardView.offsetTop - 20, behavior: 'smooth' });
    }
}

function generateRoutineConfigurations() {
    const count = parseInt(document.getElementById('routineCountSelect').value);
    const container = document.getElementById('routineConfigBuildersContainer');
    container.innerHTML = '';

    const savedRoutines = JSON.parse(localStorage.getItem('bip_custom_routines') || '[]');
    const defaultNames = ["Workout A", "Workout B", "Workout C", "Workout D", "Workout E", "Workout F", "Workout G", "Workout H"];

    for (let i = 1; i <= count; i++) {
        const defaultName = defaultNames[i - 1] || `Workout ${i}`;
        const foundSaved = savedRoutines.find(r => r.id === i);
        const routineName = (foundSaved && foundSaved.name && !foundSaved.name.toLowerCase().includes('advanced')) ? foundSaved.name : defaultName;
        const existingSelections = foundSaved ? foundSaved.selections : [];

        const routineCard = document.createElement('div');
        routineCard.className = 'p-3 rounded-3 theme-box-toggle border border-secondary';
        routineCard.innerHTML = `
            <div class="mb-3">
                <label class="small fw-bold theme-text-title mb-1">Routine ${i} Name</label>
                <input type="text" id="routineName_${i}" class="form-control theme-card theme-text-title" value="${routineName}">
            </div>
            <div id="routineBodyAreasContainer_${i}" class="d-flex flex-column gap-3 mb-3"></div>
            <button type="button" class="btn btn-sm btn-outline-secondary px-3 rounded-pill fw-bold" onclick="addBodyAreaSelector(${i})" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);">
                <i class="bi bi-plus-circle me-1"></i> Add Body Area / Muscle Group
            </button>
        `;
        container.appendChild(routineCard);

        const areaContainer = document.getElementById(`routineBodyAreasContainer_${i}`);
        if (existingSelections && existingSelections.length > 0) {
            existingSelections.forEach(sel => {
                appendBodyAreaBlock(i, sel.muscleGroup, sel.selectedExercises);
            });
        } else {
            appendBodyAreaBlock(i, "Chest", []);
        }
    }
}

function loadPresetRoutineConfiguration() {
    const level = document.getElementById('presetLevelSelect').value;
    const container = document.getElementById('presetRoutinePreviewContainer');
    container.innerHTML = '';

    const routines = PRESET_ROUTINES_DATA[level] || [];

    routines.forEach((r, idx) => {
        let exercisesSummary = '';
        r.selections.forEach(sel => {
            exercisesSummary += `<div class="small fw-bold theme-text-title mb-1">${sel.muscleGroup}:</div><ul class="small theme-text-sub ps-3 mb-2">`;
            sel.selectedExercises.forEach(ex => {
                exercisesSummary += `<li>${ex}</li>`;
            });
            exercisesSummary += `</ul>`;
        });

        const card = document.createElement('div');
        card.className = 'p-3 rounded-3 theme-box-toggle border border-secondary';
        card.innerHTML = `
            <h6 class="fw-bold mb-2" style="color: var(--accent-color);">${r.name}</h6>
            <div class="mb-2">${exercisesSummary}</div>
        `;
        container.appendChild(card);
    });
}

function addBodyAreaSelector(routineIdx) {
    appendBodyAreaBlock(routineIdx, "Chest", []);
}

function appendBodyAreaBlock(routineIdx, selectedMG, checkedExercises) {
    const areaContainer = document.getElementById(`routineBodyAreasContainer_${routineIdx}`);
    const blockId = 'area_block_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    const block = document.createElement('div');
    block.id = blockId;
    block.className = 'p-3 rounded-3 border border-secondary theme-card';

    let mgOptions = Object.keys(EXERCISE_CATALOG).map(mg => `<option value="${mg}" ${mg === selectedMG ? 'selected' : ''}>${mg}</option>`).join('');

    block.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <select class="form-select form-select-sm w-75 theme-card theme-text-title custom-select-dropdown" onchange="updateBlockExercises('${routineIdx}', '${blockId}')" id="mgSelect_${blockId}">
                ${mgOptions}
            </select>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="document.getElementById('${blockId}').remove()" style="font-size: 0.75rem;">Remove</button>
        </div>
        <div class="mb-2" id="exercisesCheckboxList_${blockId}" style="max-height: 180px; overflow-y: auto;"></div>
        <div class="text-end">
            <button type="button" class="btn btn-sm btn-link text-decoration-none text-warning p-0" style="font-size: 0.8rem;" onclick="openAddCustomExerciseModal('${routineIdx}', '${blockId}')">
                <i class="bi bi-plus-circle me-1"></i> Add Custom Exercise
            </button>
        </div>
    `;
    areaContainer.appendChild(block);
    populateBlockExercises(routineIdx, blockId, selectedMG, checkedExercises);
}

function updateBlockExercises(routineIdx, blockId) {
    const mg = document.getElementById(`mgSelect_${blockId}`).value;
    populateBlockExercises(routineIdx, blockId, mg, []);
}

function populateBlockExercises(routineIdx, blockId, muscleGroup, checkedExercises) {
    const checkboxContainer = document.getElementById(`exercisesCheckboxList_${blockId}`);
    checkboxContainer.innerHTML = '';

    let exercises = EXERCISE_CATALOG[muscleGroup] || [];
    if (customAddedExercises[muscleGroup]) {
        exercises = exercises.concat(customAddedExercises[muscleGroup]);
    }

    exercises.forEach((ex, idx) => {
        const isChecked = checkedExercises.includes(ex) ? 'checked' : '';
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${ex}" id="chk_${blockId}_${idx}" ${isChecked}>
            <label class="form-check-label small theme-text-title" for="chk_${blockId}_${idx}">${ex}</label>
        `;
        checkboxContainer.appendChild(div);
    });
}

function openAddCustomExerciseModal(routineIdx, blockId) {
    const mg = document.getElementById(`mgSelect_${blockId}`).value;
    document.getElementById('targetRoutineIndexModal').value = routineIdx;
    document.getElementById('targetMuscleGroupModal').value = mg;
    document.getElementById('displayCustomMuscleGroup').value = mg;
    document.getElementById('customExerciseNameInput').value = '';

    const modal = new bootstrap.Modal(document.getElementById('addCustomExerciseModal'));
    modal.show();
}

function saveCustomExercise() {
    const mg = document.getElementById('targetMuscleGroupModal').value;
    const exName = document.getElementById('customExerciseNameInput').value.trim();
    const routineIdx = document.getElementById('targetRoutineIndexModal').value;

    if (!exName) {
        showBipModal("Error", "Please provide a valid exercise name.");
        return;
    }

    if (!customAddedExercises[mg]) customAddedExercises[mg] = [];
    if (!customAddedExercises[mg].includes(exName)) {
        customAddedExercises[mg].push(exName);
    }

    bootstrap.Modal.getInstance(document.getElementById('addCustomExerciseModal')).hide();

    const areaContainer = document.getElementById(`routineBodyAreasContainer_${routineIdx}`);
    const blocks = areaContainer.querySelectorAll('.border');
    blocks.forEach(block => {
        const mgSelect = block.querySelector('select');
        if (mgSelect && mgSelect.value === mg) {
            const blockId = block.id;
            const checked = Array.from(block.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            populateBlockExercises(routineIdx, blockId, mg, checked);
        }
    });
    updateLiveExerciseDropdown();
    updateEditDayExerciseDropdown();
}

function saveWorkoutConfiguration() {
    let routines = [];

    if (currentConfigMode === 'custom') {
        const count = parseInt(document.getElementById('routineCountSelect').value);
        const defaultNames = ["Workout A", "Workout B", "Workout C", "Workout D", "Workout E", "Workout F", "Workout G", "Workout H"];
        for (let i = 1; i <= count; i++) {
            const fallbackName = defaultNames[i - 1] || `Workout ${i}`;
            const nameInputVal = document.getElementById(`routineName_${i}`).value.trim();
            const name = (nameInputVal && !nameInputVal.toLowerCase().includes('advanced')) ? nameInputVal : fallbackName;
            
            const areaContainer = document.getElementById(`routineBodyAreasContainer_${i}`);
            const blocks = areaContainer.querySelectorAll('.border');
            
            let selections = [];
            blocks.forEach(block => {
                const mgSelect = block.querySelector('select');
                if (mgSelect) {
                    const mg = mgSelect.value;
                    const checkedBoxes = block.querySelectorAll('input[type="checkbox"]:checked');
                    const selectedExercises = Array.from(checkedBoxes).map(cb => cb.value);
                    if (selectedExercises.length > 0) {
                        selections.push({ muscleGroup: mg, selectedExercises: selectedExercises });
                    }
                }
            });

            routines.push({ id: i, name: name, selections: selections });
        }
    } else {
        const level = document.getElementById('presetLevelSelect').value;
        routines = JSON.parse(JSON.stringify(PRESET_ROUTINES_DATA[level] || []));
    }

    localStorage.setItem('bip_custom_routines', JSON.stringify(routines));
    localStorage.setItem('workout_configured', 'true');
    localStorage.setItem('workout_hub_optin', 'false');

    document.getElementById('workoutConfigContainer').classList.add('d-none');
    renderWorkoutDashboard();
}

function renderWorkoutDashboard() {
    const routines = JSON.parse(localStorage.getItem('bip_custom_routines') || '[]');
    const container = document.getElementById('workoutRoutinesContainer');
    container.innerHTML = '';

    if (routines.length === 0) {
        container.innerHTML = '<span class="small theme-text-sub">No routines configured yet.</span>';
        return;
    }

    routines.forEach((r, idx) => {
        let exercisesListHtml = '';
        if (r.selections && r.selections.length > 0) {
            r.selections.forEach(sel => {
                exercisesListHtml += `<div class="small fw-bold theme-text-title mb-1">${sel.muscleGroup}:</div><ul class="small theme-text-sub ps-3 mb-2">`;
                sel.selectedExercises.forEach(ex => {
                    exercisesListHtml += `<li>${ex}</li>`;
                });
                exercisesListHtml += `</ul>`;
            });
        } else {
            exercisesListHtml = '<span class="small theme-text-sub">No exercises selected.</span>';
        }

        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const isFirst = idx === 0;
        const cardBorderClass = isFirst ? 'border-warning shadow-sm' : 'border-secondary';
        const badgeHtml = isFirst ? '<span class="badge bg-warning text-dark mb-2">Up Next Today</span><br>' : '';

        col.innerHTML = `
            <div class="card theme-card ${cardBorderClass} p-3 h-100 rounded-3">
                ${badgeHtml}
                <h6 class="fw-bold mb-2" style="color: var(--accent-color);">${r.name}</h6>
                <div class="mb-3 flex-grow-1">${exercisesListHtml}</div>
                <button type="button" class="btn btn-sm btn-outline-success fw-bold rounded-pill w-100" onclick="performRoutine('${r.name}', ${JSON.stringify(r.selections).replace(/"/g, '&quot;')})">
                    <i class="bi bi-play-fill me-1"></i> Perform Routine
                </button>
            </div>
        `;
        container.appendChild(col);
    });

    document.getElementById('topActionButtonsWrapper').classList.remove('d-none');
    document.getElementById('workoutChartsSection').classList.remove('d-none');
    document.getElementById('workoutHistoryManagementContainer').classList.remove('d-none');
    populateWorkoutLoggedDatesList();
    renderMuscleCharts();
}

function performRoutine(routineName, selections) {
    startWorkoutSession();
    activeRoutineSelections = selections;
    currentPerformingRoutineName = routineName;
    document.getElementById('activeExecutionPanel').classList.remove('d-none');
    document.getElementById('activeRoutineTitleBadge').textContent = routineName;
    document.getElementById('workoutDashboardView').classList.add('d-none');
    document.getElementById('workoutChartsSection').classList.add('d-none');
    document.getElementById('workoutHistoryManagementContainer').classList.add('d-none');

    const listContainer = document.getElementById('activeExercisesList');
    listContainer.innerHTML = '';

    if (!selections || selections.length === 0) {
        listContainer.innerHTML = '<span class="small theme-text-sub">No exercises in this routine.</span>';
        return;
    }

    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');

    let globalExIdx = 0;
    selections.forEach((sel, sIdx) => {
        const header = document.createElement('h6');
        header.className = 'fw-bold theme-text-title mt-3 mb-2';
        header.textContent = sel.muscleGroup;
        listContainer.appendChild(header);

        sel.selectedExercises.forEach((ex, eIdx) => {
            let lastKg = '';
            let lastReps = '';
            if (muscleHistory[sel.muscleGroup]) {
                for (let i = muscleHistory[sel.muscleGroup].length - 1; i >= 0; i--) {
                    let dayLog = muscleHistory[sel.muscleGroup][i];
                    let foundEx = dayLog.exercises.find(e => e.name === ex);
                    if (foundEx && foundEx.sets.length > 0) {
                        lastKg = foundEx.sets[0].kg;
                        lastReps = foundEx.sets[0].reps;
                        break;
                    }
                }
            }

            const exCard = document.createElement('div');
            exCard.id = `exerciseCard_${globalExIdx}`;
            exCard.className = 'card theme-card border-secondary p-3 mb-3 rounded-3 exercise-log-card';
            exCard.setAttribute('data-muscle', sel.muscleGroup);
            exCard.setAttribute('data-exercise', ex);
            exCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong class="theme-text-title fs-6">${ex}</strong>
                    <div class="d-flex align-items-center gap-2">
                        <span id="savedBadge_${globalExIdx}" class="badge bg-secondary d-none">Saved</span>
                        <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeExerciseFromActiveSession(${sIdx}, ${eIdx})" style="font-size: 0.75rem;">Delete</button>
                    </div>
                </div>
                ${lastKg !== '' ? `<div class="small theme-text-sub mb-2" style="font-size: 0.75rem;"><i class="bi bi-clock-history me-1 text-warning"></i>Last session reference: <strong>${lastKg} kg × ${lastReps} reps</strong></div>` : ''}
                <div id="setsContainer_${globalExIdx}" class="d-flex flex-column gap-2 mb-3">
                    <div class="row g-2 align-items-center set-row">
                        <div class="col-3"><span class="small theme-text-sub">Set 1</span></div>
                        <div class="col-4">
                            <div class="input-group input-group-sm">
                                <input type="number" class="form-control form-control-sm theme-card theme-text-title set-kg" placeholder="Kg" value="${lastKg}">
                                <span class="input-group-text theme-card theme-text-title border-secondary small px-2">kg</span>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="input-group input-group-sm">
                                <input type="number" class="form-control form-control-sm theme-card theme-text-title set-reps" placeholder="Reps" value="${lastReps}">
                                <span class="input-group-text theme-card theme-text-title border-secondary small px-2">reps</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-sm btn-link text-decoration-none text-warning p-0" style="font-size: 0.8rem;" onclick="addSetRow('${globalExIdx}')">
                        <i class="bi bi-plus-circle me-1"></i> Add Set
                    </button>
                    <button id="saveBtn_${globalExIdx}" type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow" onclick="saveExerciseSets('${globalExIdx}')" style="background-color: var(--accent-color); color: #111; font-size: 0.8rem;">
                        Save Exercise
                    </button>
                </div>
            `;
            listContainer.appendChild(exCard);
            globalExIdx++;
        });
    });

    window.scrollTo({ top: document.getElementById('activeExecutionPanel').offsetTop - 20, behavior: 'smooth' });
}

function addSetRow(exIdx) {
    const container = document.getElementById(`setsContainer_${exIdx}`);
    const setCount = container.children.length + 1;
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-center set-row';
    row.innerHTML = `
        <div class="col-3"><span class="small theme-text-sub">Set ${setCount}</span></div>
        <div class="col-4">
            <div class="input-group input-group-sm">
                <input type="number" class="form-control form-control-sm theme-card theme-text-title set-kg" placeholder="Kg">
                <span class="input-group-text theme-card theme-text-title border-secondary small px-2">kg</span>
            </div>
        </div>
        <div class="col-4">
            <div class="input-group input-group-sm">
                <input type="number" class="form-control form-control-sm theme-card theme-text-title set-reps" placeholder="Reps">
                <span class="input-group-text theme-card theme-text-title border-secondary small px-2">reps</span>
            </div>
        </div>
    `;
    container.appendChild(row);
}

function updateLiveExerciseDropdown() {
    const mg = document.getElementById('liveAddMuscleSelect').value;
    const exSelect = document.getElementById('liveAddExerciseSelect');
    exSelect.innerHTML = '';
    let list = EXERCISE_CATALOG[mg] || [];
    if (customAddedExercises[mg]) list = list.concat(customAddedExercises[mg]);
    list.forEach(ex => {
        const opt = document.createElement('option');
        opt.value = ex;
        opt.textContent = ex;
        exSelect.appendChild(opt);
    });
}

function addExerciseToActiveSession() {
    const mg = document.getElementById('liveAddMuscleSelect').value;
    const ex = document.getElementById('liveAddExerciseSelect').value;
    if (!ex) return;

    let foundGroup = activeRoutineSelections.find(s => s.muscleGroup === mg);
    if (foundGroup) {
        if (!foundGroup.selectedExercises.includes(ex)) {
            foundGroup.selectedExercises.push(ex);
        }
    } else {
        activeRoutineSelections.push({ muscleGroup: mg, selectedExercises: [ex] });
    }
    performRoutine(document.getElementById('activeRoutineTitleBadge').textContent, activeRoutineSelections);
}

function removeExerciseFromActiveSession(sIdx, eIdx) {
    activeRoutineSelections[sIdx].selectedExercises.splice(eIdx, 1);
    if (activeRoutineSelections[sIdx].selectedExercises.length === 0) {
        activeRoutineSelections.splice(sIdx, 1);
    }
    performRoutine(document.getElementById('activeRoutineTitleBadge').textContent, activeRoutineSelections);
}

function saveExerciseSets(exIdx) {
    const card = document.getElementById(`exerciseCard_${exIdx}`);
    const inputs = card.querySelectorAll('input[type="number"]');
    let hasData = false;

    inputs.forEach(input => {
        if (input.value.trim() !== '') hasData = true;
    });

    if (!hasData) {
        showBipModal("Notice", "Please fill in at least one set with kg and reps before saving.");
        return;
    }

    inputs.forEach(input => input.setAttribute('disabled', 'true'));
    
    card.style.borderColor = 'var(--accent-color)';
    const saveBtn = document.getElementById(`saveBtn_${exIdx}`);
    saveBtn.className = 'btn btn-sm px-4 fw-bold rounded-pill shadow btn-success';
    saveBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Saved ✓';
    saveBtn.setAttribute('disabled', 'true');

    const muscleGroup = card.getAttribute('data-muscle');
    const exerciseName = card.getAttribute('data-exercise');
    const setRows = card.querySelectorAll('.set-row');
    let setsData = [];

    setRows.forEach((row, rIdx) => {
        const kg = parseFloat(row.querySelector('.set-kg').value) || 0;
        const reps = parseInt(row.querySelector('.set-reps').value) || 0;
        const estimated1RM = reps > 0 ? Math.round(kg * (1 + reps / 30)) : kg;
        setsData.push({ set: rIdx + 1, kg: kg, reps: reps, rm1: estimated1RM });
    });

    saveMuscleGroupLog(muscleGroup, exerciseName, setsData);
}

function saveMuscleGroupLog(muscle, exercise, sets) {
    const todayDate = new Date().toISOString().split('T')[0];
    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    if (!muscleHistory[muscle]) muscleHistory[muscle] = [];

    let dayLog = muscleHistory[muscle].find(l => l.date === todayDate);
    if (!dayLog) {
        dayLog = { date: todayDate, exercises: [] };
        muscleHistory[muscle].push(dayLog);
    }

    let exLog = dayLog.exercises.find(e => e.name === exercise);
    if (exLog) {
        exLog.sets = sets;
    } else {
        dayLog.exercises.push({ name: exercise, sets: sets });
    }

    localStorage.setItem('bip_muscle_logs', JSON.stringify(muscleHistory));
    checkAndUpdatePersonalRecords(exercise, sets);
}

function checkAndUpdatePersonalRecords(exercise, sets) {
    let maxKg = 0;
    let max1RM = 0;
    sets.forEach(s => {
        if (s.kg > maxKg) maxKg = s.kg;
        if (s.rm1 > max1RM) max1RM = s.rm1;
    });

    let prs = JSON.parse(localStorage.getItem('bip_workout_prs') || '{}');
    if (!prs[exercise] || maxKg > prs[exercise].maxKg) {
        prs[exercise] = { maxKg: maxKg, max1RM: max1RM, date: new Date().toISOString().split('T')[0] };
        localStorage.setItem('bip_workout_prs', JSON.stringify(prs));
    }
}

function renderMuscleCharts() {
    const muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const prs = JSON.parse(localStorage.getItem('bip_workout_prs') || '{}');
    const container = document.getElementById('dynamicExerciseChartsContainer');
    container.innerHTML = '';

    let hasAnyLogs = false;

    Object.keys(muscleHistory).forEach(mg => {
        const logs = muscleHistory[mg] || [];
        if (logs.length === 0) return;

        let availableExercises = new Set();
        logs.forEach(log => {
            log.exercises.forEach(ex => availableExercises.add(ex.name));
        });

        if (availableExercises.size === 0) return;
        hasAnyLogs = true;

        const exercisesList = Array.from(availableExercises);
        const cardId = mg.replace(/[^a-zA-Z0-9]/g, '_');

        const card = document.createElement('div');
        card.className = 'card rounded-4 shadow-lg border-secondary theme-card p-4 mb-3';
        
        let optionsHtml = exercisesList.map((ex, idx) => `<option value="${ex}" ${idx === 0 ? 'selected' : ''}>${ex}</option>`).join('');

        card.innerHTML = `
            <div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
                <h5 class="fw-bold theme-text-title mb-0"><i class="bi bi-graph-up me-2" style="color: var(--accent-color);"></i>${mg} Progression</h5>
                <div style="max-width: 240px;">
                    <select id="selectEx_${cardId}" class="form-select form-select-sm border-secondary theme-card theme-text-title custom-select-dropdown" onchange="updateExerciseChart('${mg}')">
                        ${optionsHtml}
                    </select>
                </div>
            </div>
            <div id="prBadgeContainer_${cardId}" class="mb-3 p-2 rounded-3 theme-box-toggle border border-secondary text-center small fw-bold" style="color: var(--accent-color);">
                <i class="bi bi-trophy-fill me-1"></i> Personal Record (PR): --
            </div>
            <div class="p-3 rounded-3 theme-box-toggle border border-secondary mb-3">
                <div class="d-flex" style="height: 220px;">
                    <div id="yAxis_${cardId}" class="d-flex flex-column justify-content-between text-end pe-2 theme-text-sub small fw-bold" style="width: 50px; font-size: 0.75rem; height: 180px; border-right: 1px solid rgba(255,255,255,0.2);"></div>
                    <div class="position-relative flex-grow-1" style="height: 220px;">
                        <div class="position-absolute w-100 d-flex flex-column justify-content-between top-0 start-0" style="height: 180px; pointer-events: none; opacity: 0.15;">
                            <div style="border-bottom: 1px dashed currentColor; width: 100%;"></div>
                            <div style="border-bottom: 1px dashed currentColor; width: 100%;"></div>
                            <div style="border-bottom: 1px dashed currentColor; width: 100%;"></div>
                            <div style="border-bottom: 1px dashed currentColor; width: 100%;"></div>
                            <div style="border-bottom: 1px solid currentColor; width: 100%;"></div>
                        </div>
                        <svg id="svgCanvas_${cardId}" class="position-absolute w-100 h-100 top-0 start-0" style="z-index: 2;" viewBox="0 0 700 220" preserveAspectRatio="none">
                            <polyline id="poly_${cardId}" fill="none" stroke="var(--accent-color)" stroke-width="3" points="" />
                            <g id="points_${cardId}"></g>
                        </svg>
                    </div>
                </div>
                <div class="text-center mt-3"><span class="small theme-text-sub" id="desc_${cardId}">Displaying average weight reference per repetition volume.</span></div>
            </div>
            <div class="p-3 rounded-3 theme-box-toggle border border-secondary">
                <h6 class="fw-bold small theme-text-title mb-1"><i class="bi bi-info-circle-fill me-1" style="color: var(--accent-color);"></i>Progression Tracking & Analytics</h6>
                <p class="small theme-text-sub mb-0">This chart evaluates your progressive overload for ${mg} exercises by calculating the weighted average load across recent training sessions. Consistently increasing your working weight or repetition volume directly drives muscle growth and strength adaptations.</p>
            </div>
        `;
        container.appendChild(card);
        drawExerciseChart(mg);
    });

    if (!hasAnyLogs) {
        document.getElementById('workoutChartsSection').classList.add('d-none');
    } else {
        document.getElementById('workoutChartsSection').classList.remove('d-none');
    }
}

function updateExerciseChart(mg) {
    drawExerciseChart(mg);
}

function drawExerciseChart(mg) {
    const cardId = mg.replace(/[^a-zA-Z0-9]/g, '_');
    const selectEl = document.getElementById(`selectEx_${cardId}`);
    if (!selectEl) return;
    const selectedEx = selectEl.value;

    const muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const prs = JSON.parse(localStorage.getItem('bip_workout_prs') || '{}');
    const prContainer = document.getElementById(`prBadgeContainer_${cardId}`);

    if (prs[selectedEx]) {
        prContainer.innerHTML = `<i class="bi bi-trophy-fill me-1 text-warning"></i> Personal Record (PR): <strong>${prs[selectedEx].maxKg} kg</strong> max load | Est. 1RM: <strong>${prs[selectedEx].max1RM} kg</strong> (${prs[selectedEx].date})`;
    } else {
        prContainer.innerHTML = `<i class="bi bi-trophy-fill me-1"></i> Personal Record (PR): No record yet.`;
    }

    const logs = muscleHistory[mg] || [];
    let exerciseData = [];
    logs.sort((a, b) => new Date(a.date) - new Date(b.date));

    logs.forEach(log => {
        let foundEx = log.exercises.find(e => e.name === selectedEx);
        if (foundEx && foundEx.sets.length > 0) {
            let totalKg = 0;
            let totalReps = 0;
            foundEx.sets.forEach(s => {
                totalKg += (s.kg * s.reps);
                totalReps += s.reps;
            });
            let avgWeight = totalReps > 0 ? Math.round(totalKg / totalReps) : 0;
            exerciseData.push({ date: log.date, value: avgWeight });
        }
    });

    const recentEntries = exerciseData.slice(-7);
    const polyline = document.getElementById(`poly_${cardId}`);
    const pointsGroup = document.getElementById(`points_${cardId}`);
    const yAxis = document.getElementById(`yAxis_${cardId}`);
    const desc = document.getElementById(`desc_${cardId}`);

    pointsGroup.innerHTML = '';

    if (recentEntries.length === 0) {
        polyline.setAttribute('points', '');
        yAxis.innerHTML = '<span>--</span><span>--</span><span>--</span><span>--</span>';
        desc.textContent = `No performance data logged yet for ${selectedEx}.`;
        return;
    }

    const values = recentEntries.map(e => e.value);
    let minVal = Math.floor(Math.min(...values) * 0.9);
    let maxVal = Math.ceil(Math.max(...values) * 1.1);
    if (minVal === maxVal) { minVal = 0; maxVal = maxVal * 1.2 || 100; }

    yAxis.innerHTML = `
        <span>${maxVal.toFixed(0)} kg</span>
        <span>${(maxVal - (maxVal - minVal) * 0.33).toFixed(0)} kg</span>
        <span>${(maxVal - (maxVal - minVal) * 0.66).toFixed(0)} kg</span>
        <span>${minVal.toFixed(0)} kg</span>
    `;

    const totalPoints = recentEntries.length;
    const xStep = totalPoints > 1 ? 600 / (totalPoints - 1) : 0;
    let pointsString = '';

    recentEntries.forEach((entry, idx) => {
        const x = totalPoints === 1 ? 350 : 50 + (idx * xStep);
        const val = entry.value;
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
        textVal.textContent = val + ' kg';
        pointsGroup.appendChild(textVal);

        const textDate = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textDate.setAttribute('x', x);
        textDate.setAttribute('y', 205);
        textDate.setAttribute('fill', idx === recentEntries.length - 1 ? 'var(--accent-color)' : '#a0aec0');
        textDate.setAttribute('font-size', '10');
        textDate.setAttribute('font-weight', 'bold');
        textDate.setAttribute('text-anchor', 'middle');
        const dParts = entry.date.split('-');
        textDate.textContent = `${dParts[1]}/${dParts[2]}`;
        pointsGroup.appendChild(textDate);
    });

    polyline.setAttribute('points', pointsString.trim());
    desc.textContent = `Progressive overload tracking for ${selectedEx} across last ${recentEntries.length} sessions (weighted average reference).`;
}

function updateRestTargetTime() {
    const select = document.getElementById('restTargetSelect');
    restTargetSeconds = parseInt(select.value);
    restSeconds = restTargetSeconds;
    updateRestTimerDisplay();
}

function updateRestTimerDisplay() {
    const mins = String(Math.floor(restSeconds / 60)).padStart(2, '0');
    const secs = String(restSeconds % 60).padStart(2, '0');
    document.getElementById('restTimerDisplay').textContent = `${mins}:${secs}`;
}

function startWorkoutSession() {
    document.getElementById('workoutTimersBar').classList.remove('d-none');
    if (!workoutSessionInterval) {
        workoutSessionInterval = setInterval(() => {
            workoutSeconds++;
            const hrs = String(Math.floor(workoutSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((workoutSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(workoutSeconds % 60).padStart(2, '0');
            document.getElementById('workoutSessionTimerDisplay').textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
}

function toggleRestTimer() {
    const icon = document.getElementById('restTimerIcon');
    if (!isRestRunning) {
        isRestRunning = true;
        icon.className = 'bi bi-pause-fill';
        restTimerInterval = setInterval(() => {
            if (restSeconds > 0) {
                restSeconds--;
                updateRestTimerDisplay();
                if (restSeconds === 0) {
                    triggerRestAlarm();
                }
            }
        }, 1000);
    } else {
        isRestRunning = false;
        icon.className = 'bi bi-play-fill';
        clearInterval(restTimerInterval);
    }
}

function resetRestTimer() {
    clearInterval(restTimerInterval);
    isRestRunning = false;
    restSeconds = restTargetSeconds;
    updateRestTimerDisplay();
    document.getElementById('restTimerIcon').className = 'bi bi-play-fill';
}

function triggerRestAlarm() {
    clearInterval(restTimerInterval);
    isRestRunning = false;
    document.getElementById('restTimerIcon').className = 'bi bi-play-fill';

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.log('Audio Context not supported or blocked');
    }

    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 400]);
    }
}

function confirmFinishWorkoutModal() {
    const timeStr = document.getElementById('workoutSessionTimerDisplay').textContent;
    const html = `
        <p class="small theme-text-sub mb-3">🏆 Great Job! Total workout time: <strong class="text-warning">${timeStr}</strong>.</p>
        <p class="small theme-text-sub mb-0">Would you like to finish and save this workout session?</p>
    `;
    const footer = `
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow" onclick="finalizeWorkoutLog()" style="background-color: var(--accent-color); color: #111;">Confirm & Save</button>
        <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill shadow btn-outline-secondary" data-bs-dismiss="modal" style="border-color: rgba(255,255,255,0.2); color: var(--text-color);">Cancel (Keep Running)</button>
    `;
    showBipModal("Finish Workout", html, footer);
}

function cancelWorkoutSession() {
    clearInterval(workoutSessionInterval);
    workoutSessionInterval = null;
    workoutSeconds = 0;
    document.getElementById('workoutSessionTimerDisplay').textContent = '00:00:00';
    document.getElementById('workoutTimersBar').classList.add('d-none');
    document.getElementById('activeExecutionPanel').classList.add('d-none');
    document.getElementById('workoutChartsSection').classList.remove('d-none');
    document.getElementById('workoutHistoryManagementContainer').classList.remove('d-none');
    resetRestTimer();
}

function finalizeWorkoutLog() {
    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    
    let routines = JSON.parse(localStorage.getItem('bip_custom_routines') || '[]');
    if (routines.length > 1 && currentPerformingRoutineName) {
        let index = routines.findIndex(r => r.name === currentPerformingRoutineName);
        if (index >= 0) {
            let finishedRoutine = routines.splice(index, 1)[0];
            routines.push(finishedRoutine);
            localStorage.setItem('bip_custom_routines', JSON.stringify(routines));
        }
    }

    cancelWorkoutSession();
    populateWorkoutLoggedDatesList();
    renderWorkoutDashboard();
    renderMuscleCharts();
    showBipModal("Success", "Workout session saved successfully! Routine sequence updated for your next training day.");
}

function toggleWorkoutLogsList() {
    const listSection = document.getElementById('workoutLogsListSection');
    listSection.classList.toggle('d-none');
    document.getElementById('workoutDateEditFormSection').classList.add('d-none');

    if (!listSection.classList.contains('d-none')) {
        populateWorkoutLoggedDatesList();
    }
}

function populateWorkoutLoggedDatesList() {
    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    let allDatesSet = new Set();
    Object.keys(muscleHistory).forEach(mg => {
        muscleHistory[mg].forEach(log => allDatesSet.add(log.date));
    });

    let datesList = Array.from(allDatesSet).sort((a, b) => new Date(b) - new Date(a));
    const container = document.getElementById('workoutLoggedDatesContainer');
    container.innerHTML = '';

    if (datesList.length === 0) {
        container.innerHTML = '<span class="small theme-text-sub">No history logs found.</span>';
        return;
    }

    datesList.forEach(dateStr => {
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex flex-column gap-2';
        wrapper.id = `workout-log-wrapper-${dateStr}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-2 px-3 rounded-3';
        btn.style.cssText = 'border-color: rgba(255,255,255,0.2); color: var(--text-color); background-color: var(--bg-input, rgba(0,0,0,0.2));';
        btn.innerHTML = `<span><i class="bi bi-calendar-event me-2" style="color: var(--accent-color);"></i>${dateStr}</span> <span class="small theme-text-sub">View & Edit</span>`;
        btn.onclick = () => loadWorkoutLogForEditing(dateStr, wrapper);
        
        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    });
}

function loadWorkoutLogForEditing(dateStr, wrapperEl) {
    const editFormSection = document.getElementById('workoutDateEditFormSection');
    
    if (wrapperEl && !wrapperEl.contains(editFormSection)) {
        wrapperEl.appendChild(editFormSection);
    }
    
    document.getElementById('workoutEditingDateTitle').textContent = dateStr;
    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const container = document.getElementById('editDayExercisesContainer');
    container.innerHTML = '';

    let hasExercises = false;
    Object.keys(muscleHistory).forEach(mg => {
        let dayLog = muscleHistory[mg].find(l => l.date === dateStr);
        if (dayLog) {
            dayLog.exercises.forEach((ex, eIdx) => {
                hasExercises = true;
                const card = document.createElement('div');
                card.className = 'p-3 rounded-3 border border-secondary theme-card edit-ex-card';
                card.setAttribute('data-muscle', mg);
                card.setAttribute('data-exname', ex.name);

                let setsHtml = '';
                ex.sets.forEach((s, sIdx) => {
                    setsHtml += `
                        <div class="row g-2 align-items-center mb-1 edit-set-row">
                            <div class="col-3"><span class="small theme-text-sub">Set ${s.set}</span></div>
                            <div class="col-4">
                                <div class="input-group input-group-sm">
                                    <input type="number" class="form-control form-control-sm theme-card theme-text-title edit-set-kg" value="${s.kg}">
                                    <span class="input-group-text theme-card theme-text-title border-secondary small px-2">kg</span>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="input-group input-group-sm">
                                    <input type="number" class="form-control form-control-sm theme-card theme-text-title edit-set-reps" value="${s.reps}">
                                    <span class="input-group-text theme-card theme-text-title border-secondary small px-2">reps</span>
                                </div>
                            </div>
                        </div>
                    `;
                });

                card.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="theme-text-title small">${mg} — ${ex.name}</strong>
                        <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="this.closest('.edit-ex-card').remove()" style="font-size: 0.75rem;">Delete Exercise</button>
                    </div>
                    <div class="d-flex flex-column gap-1">${setsHtml}</div>
                `;
                container.appendChild(card);
            });
        }
    });

    if (!hasExercises) {
        container.innerHTML = '<span class="small theme-text-sub">No exercises recorded for this date.</span>';
    }

    editFormSection.classList.remove('d-none');
}

function updateEditDayExerciseDropdown() {
    const mg = document.getElementById('editDayAddMuscle').value;
    const exSelect = document.getElementById('editDayAddExercise');
    exSelect.innerHTML = '';
    let list = EXERCISE_CATALOG[mg] || [];
    if (customAddedExercises[mg]) list = list.concat(customAddedExercises[mg]);
    list.forEach(ex => {
        const opt = document.createElement('option');
        opt.value = ex;
        opt.textContent = ex;
        exSelect.appendChild(opt);
    });
}

function addExerciseToEditedDay() {
    const mg = document.getElementById('editDayAddMuscle').value;
    const ex = document.getElementById('editDayAddExercise').value;
    if (!ex) return;

    const container = document.getElementById('editDayExercisesContainer');
    if (container.innerHTML.includes('No exercises recorded')) {
        container.innerHTML = '';
    }

    const card = document.createElement('div');
    card.className = 'p-3 rounded-3 border border-secondary theme-card edit-ex-card';
    card.setAttribute('data-muscle', mg);
    card.setAttribute('data-exname', ex);
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong class="theme-text-title small">${mg} — ${ex}</strong>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="this.closest('.edit-ex-card').remove()" style="font-size: 0.75rem;">Delete Exercise</button>
        </div>
        <div class="d-flex flex-column gap-1">
            <div class="row g-2 align-items-center mb-1 edit-set-row">
                <div class="col-3"><span class="small theme-text-sub">Set 1</span></div>
                <div class="col-4">
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control form-control-sm theme-card theme-text-title edit-set-kg" value="0">
                        <span class="input-group-text theme-card theme-text-title border-secondary small px-2">kg</span>
                    </div>
                </div>
                <div class="col-4">
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control form-control-sm theme-card theme-text-title edit-set-reps" value="10">
                        <span class="input-group-text theme-card theme-text-title border-secondary small px-2">reps</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(card);
}

function saveEditedWorkoutLogDay() {
    const dateStr = document.getElementById('workoutEditingDateTitle').textContent;
    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');

    Object.keys(muscleHistory).forEach(mg => {
        muscleHistory[mg] = muscleHistory[mg].filter(l => l.date !== dateStr);
    });

    const cards = document.querySelectorAll('.edit-ex-card');
    cards.forEach(card => {
        const mg = card.getAttribute('data-muscle');
        const exName = card.getAttribute('data-exname');
        const setRows = card.querySelectorAll('.edit-set-row');
        let sets = [];

        setRows.forEach((row, rIdx) => {
            const kg = parseFloat(row.querySelector('.edit-set-kg').value) || 0;
            const reps = parseInt(row.querySelector('.edit-set-reps').value) || 0;
            const estimated1RM = reps > 0 ? Math.round(kg * (1 + reps / 30)) : kg;
            sets.push({ set: rIdx + 1, kg: kg, reps: reps, rm1: estimated1RM });
        });

        if (!muscleHistory[mg]) muscleHistory[mg] = [];
        let dayLog = muscleHistory[mg].find(l => l.date === dateStr);
        if (!dayLog) {
            dayLog = { date: dateStr, exercises: [] };
            muscleHistory[mg].push(dayLog);
        }
        dayLog.exercises.push({ name: exName, sets: sets });
    });

    localStorage.setItem('bip_muscle_logs', JSON.stringify(muscleHistory));
    document.getElementById('workoutDateEditFormSection').classList.add('d-none');
    populateWorkoutLoggedDatesList();
    renderMuscleCharts();
    showBipModal("Success", "Workout log updated successfully!");
}

function deleteEntireWorkoutDayLog() {
    const dateStr = document.getElementById('workoutEditingDateTitle').textContent;
    let muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');

    Object.keys(muscleHistory).forEach(mg => {
        muscleHistory[mg] = muscleHistory[mg].filter(l => l.date !== dateStr);
    });

    localStorage.setItem('bip_muscle_logs', JSON.stringify(muscleHistory));
    document.getElementById('workoutDateEditFormSection').classList.add('d-none');
    populateWorkoutLoggedDatesList();
    renderMuscleCharts();
    showBipModal("Success", "Workout log deleted successfully!");
}

function loadSavedWorkoutState() {
    const isConfigured = localStorage.getItem('workout_configured') === 'true';
    if (isConfigured) {
        document.getElementById('workoutConfigContainer').classList.add('d-none');
        renderWorkoutDashboard();
    } else {
        document.getElementById('workoutConfigContainer').classList.remove('d-none');
        document.getElementById('workoutHubOptIn').checked = false;
        document.getElementById('workoutHubContent').classList.add('d-none');
        generateRoutineConfigurations();
        loadPresetRoutineConfiguration();
    }
}