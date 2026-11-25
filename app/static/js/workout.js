const EXERCISE_CATALOG = {
    "Chest": [
        "Barbell Bench Press", "Incline Barbell Bench Press", "Decline Barbell Bench Press", 
        "Dumbbell Bench Press", "Incline Dumbbell Press", "Chest Flyes", "Pec Deck", 
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
        "Russian Twists", "Cable Woodchoppers", "Decline Bench Crunches", "Cable Crunch", "Leg Raises"
    ],
    "Calves": [
        "Standing Calf Raises", "Seated Calf Raises"
    ],
    "Glutes": [
        "Hip Thrusts", "Cable Glute Kickbacks", "Abductor Machine"
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
                { muscleGroup: "Chest", selectedExercises: ["Chest Press Machine", "Incline Dumbbell Press", "Chest Flyes", "Cable Crossover"] },
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
                { muscleGroup: "Chest", selectedExercises: ["Barbell Bench Press", "Incline Dumbbell Press", "Chest Flyes", "Cable Crossover"] },
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
                { muscleGroup: "Chest", selectedExercises: ["Barbell Bench Press", "Incline Dumbbell Press", "Decline Barbell Bench Press", "Chest Flyes", "Cable Crossover"] },
                { muscleGroup: "Abs / Core", selectedExercises: ["Plank", "Hanging Leg Raises"] }
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
                { muscleGroup: "Glutes", selectedExercises: ["Hip Thrusts", "Abductor Machine"] },
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

    window.addEventListener('resize', () => {
        if (localStorage.getItem('workout_configured') === 'true') {
            renderMuscleCharts();
        }
    });
});

function formatWeightStep250(val) {
    if (val === undefined || val === null || val === '') return '';
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const roundedQuarter = Math.round(num * 4) / 4;
    if (Number.isInteger(roundedQuarter)) {
        return String(roundedQuarter);
    }
    return roundedQuarter.toFixed(3);
}

function attachWeightStepBehavior(inputEl) {
    if (!inputEl) return;
    inputEl.step = '0.25';
    inputEl.addEventListener('blur', () => {
        if (inputEl.value.trim() === '') {
            inputEl.value = '';
            return;
        }
        inputEl.value = formatWeightStep250(inputEl.value);
    });
}

function cloneTemplate(templateId) {
    const tpl = document.getElementById(templateId);
    return tpl ? tpl.content.cloneNode(true) : document.createDocumentFragment();
}

function showBipModal(title, contentNodeOrText, customFooterNode = null) {
    document.getElementById('bipModalTitle').textContent = title;
    const bodyEl = document.getElementById('bipModalBody');
    const isNarrow = window.innerWidth < 460;
    bodyEl.innerHTML = '';

    const wrapper = document.createElement('div');
    if (isNarrow) {
        wrapper.style.fontSize = '0.85rem';
        wrapper.style.lineHeight = '1.35';
    }

    if (contentNodeOrText instanceof Node) {
        wrapper.appendChild(contentNodeOrText);
    } else {
        const p = document.createElement('p');
        p.className = 'mb-0';
        p.textContent = String(contentNodeOrText);
        wrapper.appendChild(p);
    }
    bodyEl.appendChild(wrapper);

    const footerEl = document.getElementById('bipModalFooter');
    footerEl.innerHTML = '';
    if (customFooterNode instanceof Node) {
        footerEl.appendChild(customFooterNode);
    } else {
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'btn btn-sm px-4 fw-bold rounded-pill';
        okBtn.setAttribute('data-bs-dismiss', 'modal');
        okBtn.style.backgroundColor = 'var(--accent-color)';
        okBtn.style.color = '#111';
        okBtn.textContent = 'OK';
        footerEl.appendChild(okBtn);
    }

    const modalObj = new bootstrap.Modal(document.getElementById('bipCustomModal'));
    modalObj.show();
}

function isCustomExercise(exerciseName) {
    for (let mg in EXERCISE_CATALOG) {
        if (EXERCISE_CATALOG[mg].includes(exerciseName)) {
            return false;
        }
    }
    return true;
}

function openExerciseMedia(exerciseName) {
    const modalEl = document.getElementById('exerciseMediaModal');
    const modalTitle = document.getElementById('exerciseMediaModalTitle');
    const modalBody = document.getElementById('exerciseMediaModalBody');
    const modalFooter = document.getElementById('exerciseMediaModalFooter');

    modalTitle.textContent = exerciseName;
    modalBody.innerHTML = '';

    const isCustom = isCustomExercise(exerciseName);

    if (!isCustom) {
        const view = cloneTemplate('tplMediaShowcase');
        const listEl = view.querySelector('.media-images-list');
        const variants = [
            { suffix: 'main', maxH: '280px' },
            { suffix: 'start', maxH: '220px' },
            { suffix: 'peak', maxH: '220px' }
        ];

        const baseName = exerciseName.toLowerCase();

        variants.forEach(v => {
            const fileName = `${baseName} ${v.suffix}.webp`;
            const img = document.createElement('img');
            img.src = `/static/img/flat/${encodeURIComponent(fileName)}`;
            img.alt = `${exerciseName} ${v.suffix}`;
            img.className = 'img-fluid rounded-3 shadow d-none';
            img.style.maxHeight = v.maxH;
            img.style.objectFit = 'contain';
            img.addEventListener('error', () => {
                console.warn('Imagem não encontrada:', img.src);
                img.classList.add('d-none');
            });
            img.addEventListener('load', () => img.classList.remove('d-none'));
            listEl.appendChild(img);
        });

        modalBody.appendChild(view);
        modalFooter.innerHTML = '';
        modalFooter.style.display = 'none';
    } else {
        const mediaData = JSON.parse(localStorage.getItem('bip_exercise_media') || '{}');
        const exMedia = mediaData[exerciseName] || {};
        const currentVal = exMedia['photo'] || '';

        if (currentVal) {
            const view = cloneTemplate('tplCustomMediaView');
            const imgEl = view.querySelector('.custom-media-img');
            imgEl.src = currentVal;
            imgEl.alt = exerciseName;
            view.querySelector('.change-photo-btn').addEventListener('click', () => renderPhotoEditForm(exerciseName));

            modalBody.appendChild(view);
            modalFooter.innerHTML = '';
            modalFooter.style.display = 'none';
        } else {
            renderPhotoEditForm(exerciseName);
        }
    }

    const modalObj = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalObj.show();
}

function renderPhotoEditForm(exerciseName) {
    const modalBody = document.getElementById('exerciseMediaModalBody');
    const modalFooter = document.getElementById('exerciseMediaModalFooter');

    modalBody.innerHTML = '';
    modalBody.appendChild(cloneTemplate('tplPhotoEditForm'));

    modalFooter.style.display = 'flex';
    modalFooter.innerHTML = '';
    const footerNode = cloneTemplate('tplPhotoEditFooter');
    footerNode.querySelector('.save-photo-btn').addEventListener('click', () => saveExercisePhoto(exerciseName));
    modalFooter.appendChild(footerNode);
}

function saveExercisePhoto(exerciseName) {
    const urlInput = document.getElementById('mediaUrlInputField').value.trim();
    const fileInput = document.getElementById('mediaFileInputField');

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            persistPhotoData(exerciseName, e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput) {
        persistPhotoData(exerciseName, urlInput);
    } else {
        showBipModal("Error", "Please provide a valid image URL or select a file.");
    }
}

function persistPhotoData(exerciseName, value) {
    let mediaData = JSON.parse(localStorage.getItem('bip_exercise_media') || '{}');
    if (!mediaData[exerciseName]) mediaData[exerciseName] = {};
    mediaData[exerciseName]['photo'] = value;
    localStorage.setItem('bip_exercise_media', JSON.stringify(mediaData));

    bootstrap.Modal.getInstance(document.getElementById('exerciseMediaModal')).hide();
    showBipModal("Success", `Photo saved successfully for ${exerciseName}!`);
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
    const chartsSection = document.getElementById('workoutChartsSection');
    const historySection = document.getElementById('workoutHistoryManagementContainer');
    const isOpening = dashboardView.classList.contains('d-none');

    dashboardView.classList.toggle('d-none');

    if (isOpening) {
        if (chartsSection) chartsSection.classList.add('d-none');
        if (historySection) historySection.classList.add('d-none');
        window.scrollTo({ top: dashboardView.offsetTop - 20, behavior: 'smooth' });
    } else {
        if (chartsSection) chartsSection.classList.remove('d-none');
        if (historySection) historySection.classList.remove('d-none');
        renderMuscleCharts();
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

        const cardNode = cloneTemplate('tplRoutineConfigCard');
        cardNode.querySelector('.routine-name-label').textContent = `Routine ${i} Name`;

        const nameInput = cardNode.querySelector('.routine-name-input');
        nameInput.id = `routineName_${i}`;
        nameInput.value = routineName;

        const areasContainer = cardNode.querySelector('.routine-areas-container');
        areasContainer.id = `routineBodyAreasContainer_${i}`;

        cardNode.querySelector('.add-area-btn').addEventListener('click', () => addBodyAreaSelector(i));

        container.appendChild(cardNode);

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

    routines.forEach(r => {
        const cardNode = cloneTemplate('tplPresetRoutineCard');
        cardNode.querySelector('.preset-routine-title').textContent = r.name;

        const summaryEl = cardNode.querySelector('.preset-routine-summary');
        r.selections.forEach(sel => {
            const mgTitle = document.createElement('div');
            mgTitle.className = 'small fw-bold theme-text-title mb-1';
            mgTitle.textContent = `${sel.muscleGroup}:`;
            summaryEl.appendChild(mgTitle);

            const ul = document.createElement('ul');
            ul.className = 'small theme-text-sub ps-3 mb-2';
            sel.selectedExercises.forEach(ex => {
                const li = document.createElement('li');
                li.textContent = ex;
                ul.appendChild(li);
            });
            summaryEl.appendChild(ul);
        });

        container.appendChild(cardNode);
    });
}

function addBodyAreaSelector(routineIdx) {
    appendBodyAreaBlock(routineIdx, "Chest", []);
}

function appendBodyAreaBlock(routineIdx, selectedMG, checkedExercises) {
    const areaContainer = document.getElementById(`routineBodyAreasContainer_${routineIdx}`);
    const blockId = 'area_block_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    const blockNode = cloneTemplate('tplBodyAreaBlock');
    const blockEl = blockNode.querySelector('.body-area-block');
    blockEl.id = blockId;

    const mgSelect = blockNode.querySelector('.mg-select');
    mgSelect.id = `mgSelect_${blockId}`;
    Object.keys(EXERCISE_CATALOG).forEach(mg => {
        const opt = document.createElement('option');
        opt.value = mg;
        opt.textContent = mg;
        if (mg === selectedMG) opt.selected = true;
        mgSelect.appendChild(opt);
    });
    mgSelect.addEventListener('change', () => {
        updateBlockExercises(routineIdx, blockId);
        mgSelect.size = 1;
        mgSelect.blur();
    });
    mgSelect.addEventListener('focus', () => {
        mgSelect.size = Math.min(mgSelect.options.length, 5);
    });
    mgSelect.addEventListener('blur', () => {
        mgSelect.size = 1;
    });

    blockNode.querySelector('.remove-area-btn').addEventListener('click', () => {
        document.getElementById(blockId).remove();
    });

    const checkboxListEl = blockNode.querySelector('.exercises-checkbox-list');
    checkboxListEl.id = `exercisesCheckboxList_${blockId}`;

    blockNode.querySelector('.add-custom-ex-btn').addEventListener('click', () => {
        openAddCustomExerciseModal(routineIdx, blockId);
    });

    areaContainer.appendChild(blockNode);
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
        const rowNode = cloneTemplate('tplExerciseCheckboxRow');
        const inputEl = rowNode.querySelector('.ex-checkbox');
        const labelEl = rowNode.querySelector('.ex-checkbox-label');
        const inputId = `chk_${blockId}_${idx}`;

        inputEl.value = ex;
        inputEl.id = inputId;
        inputEl.checked = checkedExercises.includes(ex);

        labelEl.htmlFor = inputId;
        labelEl.textContent = ex;

        rowNode.querySelector('.view-photo-btn').addEventListener('click', () => openExerciseMedia(ex));

        checkboxContainer.appendChild(rowNode);
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
        const emptySpan = document.createElement('span');
        emptySpan.className = 'small theme-text-sub';
        emptySpan.textContent = 'No routines configured yet.';
        container.appendChild(emptySpan);
        return;
    }

    routines.forEach((r, idx) => {
        const colNode = cloneTemplate('tplDashboardRoutineCol');
        const isFirst = idx === 0;
        const cardBox = colNode.querySelector('.routine-card-box');
        cardBox.classList.add(isFirst ? 'border-warning' : 'border-secondary');
        if (isFirst) cardBox.classList.add('shadow-sm');

        if (isFirst) {
            colNode.querySelector('.up-next-badge').classList.remove('d-none');
            colNode.querySelector('.up-next-br').classList.remove('d-none');
        }

        colNode.querySelector('.routine-title').textContent = r.name;

        const summaryEl = colNode.querySelector('.routine-exercises-summary');
        if (r.selections && r.selections.length > 0) {
            r.selections.forEach(sel => {
                const mgDiv = document.createElement('div');
                mgDiv.className = 'small fw-bold theme-text-title mb-1';
                mgDiv.textContent = `${sel.muscleGroup}:`;
                summaryEl.appendChild(mgDiv);

                const ul = document.createElement('ul');
                ul.className = 'small theme-text-sub ps-3 mb-2';
                sel.selectedExercises.forEach(ex => {
                    const li = document.createElement('li');
                    li.textContent = ex;
                    ul.appendChild(li);
                });
                summaryEl.appendChild(ul);
            });
        } else {
            const noneSpan = document.createElement('span');
            noneSpan.className = 'small theme-text-sub';
            noneSpan.textContent = 'No exercises selected.';
            summaryEl.appendChild(noneSpan);
        }

        const performBtn = colNode.querySelector('.perform-routine-btn');
        performBtn.addEventListener('click', () => {
            performRoutine(r.name, JSON.parse(JSON.stringify(r.selections || [])));
        });

        container.appendChild(colNode);
    });

    document.getElementById('topActionButtonsWrapper').classList.remove('d-none');
    document.getElementById('workoutChartsSection').classList.remove('d-none');
    document.getElementById('workoutHistoryManagementContainer').classList.remove('d-none');
    populateWorkoutLoggedDatesList();
    renderMuscleCharts();
}

function createSetRowElement(setNumber, kgValue = '') {
    const rowNode = cloneTemplate('tplSetRow');
    rowNode.querySelector('.set-label').textContent = `Set ${setNumber}`;

    const kgInput = rowNode.querySelector('.set-kg');
    kgInput.value = formatWeightStep250(kgValue);
    attachWeightStepBehavior(kgInput);

    const repsInput = rowNode.querySelector('.set-reps');
    repsInput.value = '';

    return rowNode;
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
        const emptySpan = document.createElement('span');
        emptySpan.className = 'small theme-text-sub';
        emptySpan.textContent = 'No exercises in this routine.';
        listContainer.appendChild(emptySpan);
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

            const cardNode = cloneTemplate('tplActiveExerciseCard');
            const exCard = cardNode.querySelector('.exercise-log-card');
            const exIndexCopy = globalExIdx;

            exCard.id = `exerciseCard_${exIndexCopy}`;
            exCard.setAttribute('data-muscle', sel.muscleGroup);
            exCard.setAttribute('data-exercise', ex);

            cardNode.querySelector('.ex-name-label').textContent = ex;
            cardNode.querySelector('.ex-photo-btn').addEventListener('click', () => openExerciseMedia(ex));
            cardNode.querySelector('.saved-badge').id = `savedBadge_${exIndexCopy}`;
            cardNode.querySelector('.delete-ex-btn').addEventListener('click', () => removeExerciseFromActiveSession(sIdx, eIdx));

            if (lastKg !== '') {
                const refBox = cardNode.querySelector('.last-ref-box');
                refBox.classList.remove('d-none');
                refBox.querySelector('.last-ref-text').textContent = `${formatWeightStep250(lastKg)} kg × ${lastReps} reps`;
            }

            const setsContainer = cardNode.querySelector('.sets-container');
            setsContainer.id = `setsContainer_${exIndexCopy}`;
            setsContainer.appendChild(createSetRowElement(1, lastKg));

            cardNode.querySelector('.add-set-btn').addEventListener('click', () => addSetRow(exIndexCopy));

            const saveBtn = cardNode.querySelector('.save-ex-btn');
            saveBtn.id = `saveBtn_${exIndexCopy}`;
            saveBtn.addEventListener('click', () => saveExerciseSets(exIndexCopy));

            listContainer.appendChild(cardNode);
            globalExIdx++;
        });
    });

    window.scrollTo({ top: document.getElementById('activeExecutionPanel').offsetTop - 20, behavior: 'smooth' });
}

function addSetRow(exIdx) {
    const container = document.getElementById(`setsContainer_${exIdx}`);
    const setCount = container.children.length + 1;
    container.appendChild(createSetRowElement(setCount, ''));
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
    saveBtn.innerHTML = '';
    const checkIcon = document.createElement('i');
    checkIcon.className = 'bi bi-check-circle-fill me-1';
    saveBtn.appendChild(checkIcon);
    saveBtn.appendChild(document.createTextNode('Saved ✓'));
    saveBtn.setAttribute('disabled', 'true');

    const muscleGroup = card.getAttribute('data-muscle');
    const exerciseName = card.getAttribute('data-exercise');
    const setRows = card.querySelectorAll('.set-row');
    let setsData = [];

    setRows.forEach((row, rIdx) => {
        const kgInput = row.querySelector('.set-kg');
        const rawKg = parseFloat(kgInput.value) || 0;
        const kg = Math.round(rawKg * 4) / 4;
        kgInput.value = formatWeightStep250(kg);
        const reps = parseInt(row.querySelector('.set-reps').value) || 0;
        const estimated1RM = reps > 0 ? Math.round((kg * (1 + reps / 30)) * 4) / 4 : kg;
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

        const cardNode = cloneTemplate('tplMuscleChartCard');
        cardNode.querySelector('.chart-mg-title').textContent = `${mg} Progression`;

        const selectEl = cardNode.querySelector('.chart-ex-select');
        selectEl.id = `selectEx_${cardId}`;
        exercisesList.forEach((ex, idx) => {
            const opt = document.createElement('option');
            opt.value = ex;
            opt.textContent = ex;
            if (idx === 0) opt.selected = true;
            selectEl.appendChild(opt);
        });
        selectEl.addEventListener('change', () => {
            updateExerciseChart(mg);
            selectEl.size = 1;
            selectEl.blur();
        });
        selectEl.addEventListener('focus', () => {
            selectEl.size = Math.min(selectEl.options.length, 5);
        });
        selectEl.addEventListener('blur', () => {
            selectEl.size = 1;
        });

        cardNode.querySelector('.pr-badge-box').id = `prBadgeContainer_${cardId}`;
        cardNode.querySelector('.pr-badge-text').id = `prBadgeText_${cardId}`;

        const yAxisEl = cardNode.querySelector('.chart-y-axis');
        yAxisEl.id = `yAxis_${cardId}`;

        const svgEl = cardNode.querySelector('.chart-svg');
        svgEl.id = `svgCanvas_${cardId}`;

        const polyEl = cardNode.querySelector('.chart-polyline');
        polyEl.id = `poly_${cardId}`;

        const pointsGroupEl = cardNode.querySelector('.chart-points-group');
        pointsGroupEl.id = `points_${cardId}`;

        const descEl = cardNode.querySelector('.chart-desc');
        descEl.id = `desc_${cardId}`;

        cardNode.querySelector('.chart-info-text').textContent =
            `This chart evaluates your progressive overload for ${mg} exercises by calculating the weighted average load across recent training sessions. Consistently increasing your working weight or repetition volume directly drives muscle growth and strength adaptations.`;

        container.appendChild(cardNode);
        drawExerciseChart(mg);
    });

    if (!hasAnyLogs) {
        document.getElementById('workoutChartsSection').classList.add('d-none');
    } else if (document.getElementById('workoutDashboardView').classList.contains('d-none')) {
        document.getElementById('workoutChartsSection').classList.remove('d-none');
    }
}

function updateExerciseChart(mg) {
    drawExerciseChart(mg);
}

function setYAxisLabels(yAxisEl, labels) {
    yAxisEl.innerHTML = '';
    labels.forEach(txt => {
        const span = document.createElement('span');
        span.textContent = txt;
        yAxisEl.appendChild(span);
    });
}

function drawExerciseChart(mg) {
    const cardId = mg.replace(/[^a-zA-Z0-9]/g, '_');
    const selectEl = document.getElementById(`selectEx_${cardId}`);
    if (!selectEl) return;
    const selectedEx = selectEl.value;

    const muscleHistory = JSON.parse(localStorage.getItem('bip_muscle_logs') || '{}');
    const prs = JSON.parse(localStorage.getItem('bip_workout_prs') || '{}');
    const prTextEl = document.getElementById(`prBadgeText_${cardId}`);

    if (prs[selectedEx]) {
        prTextEl.textContent = `Personal Record (PR): ${prs[selectedEx].maxKg} kg max load | Est. 1RM: ${prs[selectedEx].max1RM} kg (${prs[selectedEx].date})`;
    } else {
        prTextEl.textContent = `Personal Record (PR): No record yet.`;
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
            let avgWeight = totalReps > 0 ? Math.round((totalKg / totalReps) * 4) / 4 : 0;
            exerciseData.push({ date: log.date, value: avgWeight });
        }
    });

    const recentEntries = exerciseData.slice(-7);
    const polyline = document.getElementById(`poly_${cardId}`);
    const pointsGroup = document.getElementById(`points_${cardId}`);
    const yAxis = document.getElementById(`yAxis_${cardId}`);
    const desc = document.getElementById(`desc_${cardId}`);
    const svgEl = document.getElementById(`svgCanvas_${cardId}`);

    pointsGroup.innerHTML = '';

    if (recentEntries.length === 0) {
        polyline.setAttribute('points', '');
        setYAxisLabels(yAxis, ['--', '--', '--', '--']);
        desc.textContent = `No performance data logged yet for ${selectedEx}.`;
        return;
    }

    const svgWidth = 700;
    const actualWidth = (svgEl && svgEl.clientWidth > 0) ? svgEl.clientWidth : svgWidth;
    const scaleX = svgWidth / actualWidth;
    const isNarrow = actualWidth < 460;

    const values = recentEntries.map(e => e.value);
    let minVal = Math.floor(Math.min(...values) * 0.9);
    let maxVal = Math.ceil(Math.max(...values) * 1.1);
    if (minVal === maxVal) { minVal = 0; maxVal = maxVal * 1.2 || 100; }

    setYAxisLabels(yAxis, [
        `${maxVal.toFixed(0)} kg`,
        `${(maxVal - (maxVal - minVal) * 0.33).toFixed(0)} kg`,
        `${(maxVal - (maxVal - minVal) * 0.66).toFixed(0)} kg`,
        `${minVal.toFixed(0)} kg`
    ]);

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
        circle.setAttribute('r', isNarrow ? '4.5' : '5');
        circle.setAttribute('fill', 'var(--accent-color)');
        pointsGroup.appendChild(circle);

        const textVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textVal.setAttribute('x', x);
        textVal.setAttribute('y', y < 20 ? y + 16 : y - 10);
        textVal.setAttribute('fill', 'currentColor');
        textVal.setAttribute('font-size', isNarrow ? '9.5' : '11');
        textVal.setAttribute('font-weight', 'bold');
        textVal.setAttribute('text-anchor', 'middle');
        textVal.setAttribute('transform', `translate(${x}, 0) scale(${scaleX}, 1) translate(${-x}, 0)`);
        textVal.textContent = val + ' kg';
        pointsGroup.appendChild(textVal);

        const showDate = !isNarrow || idx === recentEntries.length - 1 || idx % 2 === 0;
        if (showDate) {
            const textDate = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textDate.setAttribute('x', x);
            textDate.setAttribute('y', 205);
            textDate.setAttribute('fill', idx === recentEntries.length - 1 ? 'var(--accent-color)' : '#a0aec0');
            textDate.setAttribute('font-size', isNarrow ? '9.5' : '10');
            textDate.setAttribute('font-weight', 'bold');
            textDate.setAttribute('text-anchor', 'middle');
            textDate.setAttribute('transform', `translate(${x}, 0) scale(${scaleX}, 1) translate(${-x}, 0)`);
            const dParts = entry.date.split('-');
            textDate.textContent = `${dParts[1]}/${dParts[2]}`;
            pointsGroup.appendChild(textDate);
        }
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
    const bodyNode = cloneTemplate('tplFinishWorkoutBody');
    bodyNode.querySelector('.finish-time-val').textContent = timeStr;

    const footerNode = cloneTemplate('tplFinishWorkoutFooter');
    footerNode.querySelector('.confirm-finish-btn').addEventListener('click', finalizeWorkoutLog);

    showBipModal("Finish Workout", bodyNode, footerNode);
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
    document.getElementById('addPastWorkoutLogFormSection').classList.add('d-none');

    if (!listSection.classList.contains('d-none')) {
        populateWorkoutLoggedDatesList();
    }
}

function toggleAddPastWorkoutLogForm() {
    const formSec = document.getElementById('addPastWorkoutLogFormSection');
    formSec.classList.toggle('d-none');
    const dateInput = document.getElementById('newWorkoutLogDateInput');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function createDateLogWrapper(dateStr) {
    const node = cloneTemplate('tplLoggedDateWrapper');
    const wrapper = node.firstElementChild;
    wrapper.id = `workout-log-wrapper-${dateStr}`;
    node.querySelector('.date-log-label').textContent = dateStr;
    node.querySelector('.date-log-btn').addEventListener('click', () => loadWorkoutLogForEditing(dateStr, wrapper));
    return wrapper;
}

function openWorkoutLogForNewDate() {
    const dateStr = document.getElementById('newWorkoutLogDateInput').value;
    if (!dateStr) {
        showBipModal("Notice", "Please select a valid date.");
        return;
    }

    document.getElementById('addPastWorkoutLogFormSection').classList.add('d-none');

    let wrapper = document.getElementById(`workout-log-wrapper-${dateStr}`);
    if (!wrapper) {
        const container = document.getElementById('workoutLoggedDatesContainer');
        if (container.textContent.includes('No history logs found')) {
            container.innerHTML = '';
        }
        wrapper = createDateLogWrapper(dateStr);
        container.prepend(wrapper);
    }

    loadWorkoutLogForEditing(dateStr, wrapper);
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
        const emptySpan = document.createElement('span');
        emptySpan.className = 'small theme-text-sub';
        emptySpan.textContent = 'No history logs found.';
        container.appendChild(emptySpan);
        return;
    }

    datesList.forEach(dateStr => {
        container.appendChild(createDateLogWrapper(dateStr));
    });
}

function createEditSetRowElement(setNumber, kgVal = '', repsVal = '') {
    const rowNode = cloneTemplate('tplEditSetRow');
    rowNode.querySelector('.edit-set-label').textContent = `Set ${setNumber}`;
    const kgInput = rowNode.querySelector('.edit-set-kg');
    kgInput.value = formatWeightStep250(kgVal);
    attachWeightStepBehavior(kgInput);
    rowNode.querySelector('.edit-set-reps').value = (repsVal !== undefined && repsVal !== null && repsVal !== '') ? repsVal : '';
    return rowNode;
}

function addEditSetRow(btnEl) {
    const card = btnEl.closest('.edit-ex-card');
    const setsContainer = card.querySelector('.edit-sets-container');
    const nextSetNum = setsContainer.querySelectorAll('.edit-set-row').length + 1;
    setsContainer.appendChild(createEditSetRowElement(nextSetNum, '', ''));
}

function createEditExerciseCardElement(mg, exName, setsArray, showPhotoButton = true) {
    const cardNode = cloneTemplate('tplEditExerciseCard');
    const cardEl = cardNode.querySelector('.edit-ex-card');
    cardEl.setAttribute('data-muscle', mg);
    cardEl.setAttribute('data-exname', exName);

    cardNode.querySelector('.edit-ex-title').textContent = `${mg} — ${exName}`;

    if (showPhotoButton) {
        cardNode.querySelector('.edit-photo-btn').addEventListener('click', () => openExerciseMedia(exName));
    } else {
        cardNode.querySelector('.edit-photo-wrapper').remove();
    }

    cardNode.querySelector('.delete-edit-ex-btn').addEventListener('click', () => cardEl.remove());

    const setsContainer = cardNode.querySelector('.edit-sets-container');
    setsArray.forEach((s, sIdx) => {
        const kgVal = (s.kg !== undefined && s.kg !== null && s.kg !== '') ? s.kg : '';
        const repsVal = (s.reps !== undefined && s.reps !== null && s.reps !== '') ? s.reps : '';
        setsContainer.appendChild(createEditSetRowElement(s.set || (sIdx + 1), kgVal, repsVal));
    });

    const addSetBtn = cardNode.querySelector('.add-edit-set-btn');
    addSetBtn.addEventListener('click', () => addEditSetRow(addSetBtn));

    return cardEl;
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
            dayLog.exercises.forEach(ex => {
                hasExercises = true;
                container.appendChild(createEditExerciseCardElement(mg, ex.name, ex.sets || [], true));
            });
        }
    });

    if (!hasExercises) {
        const emptySpan = document.createElement('span');
        emptySpan.className = 'small theme-text-sub';
        emptySpan.textContent = 'No exercises recorded for this date.';
        container.appendChild(emptySpan);
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
    if (container.textContent.includes('No exercises recorded')) {
        container.innerHTML = '';
    }

    container.appendChild(createEditExerciseCardElement(mg, ex, [{ set: 1, kg: '', reps: '' }], false));
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
            const kgInput = row.querySelector('.edit-set-kg');
            const rawKg = parseFloat(kgInput.value) || 0;
            const kg = Math.round(rawKg * 4) / 4;
            kgInput.value = formatWeightStep250(kg);
            const reps = parseInt(row.querySelector('.edit-set-reps').value) || 0;
            const estimated1RM = reps > 0 ? Math.round((kg * (1 + reps / 30)) * 4) / 4 : kg;
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