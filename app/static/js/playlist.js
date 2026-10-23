const ALL_PRESETS = [
    { name: 'Ultimate Gym Station', stream: 'https://stream.antenne.de/antenne/stream/mp3' },
    { name: 'Heavy Rock & Metal Gym', stream: 'https://stream.rockantenne.de/heavy-metal/stream/mp3' },
    { name: 'Synthwave Workout Drive', stream: 'https://radio.plaza.one/mp3' },
    { name: 'Classic Rock Power', stream: 'https://stream.rockantenne.de/rockantenne/stream/mp3' },
    { name: 'Techno Peak Performance', stream: 'https://listen.technobase.fm/tunein-mp3-pls' },
    { name: 'EDM & House Fitness', stream: 'https://electro.dancewave.online/dance.mp3' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadSavedPlaylistState();
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

function togglePlaylistContainer(checkbox) {
    const content = document.getElementById('playlistHubContent');
    localStorage.setItem('playlist_hub_optin', checkbox.checked);

    if (checkbox.checked) {
        content.classList.remove('d-none');
        populateHubUI();
    } else {
        content.classList.add('d-none');
    }
}

function toggleAddCustomForm(show) {
    const form = document.getElementById('addPlaylistFormSection');
    if (show) {
        form.classList.remove('d-none');
    } else {
        form.classList.add('d-none');
        document.getElementById('newPlaylistName').value = '';
        document.getElementById('playlistUrlInput').value = '';
    }
}

function openPlaylistHub() {
    document.getElementById('playlistConfigContainer').classList.remove('d-none');
    document.getElementById('playlistDashboardView').classList.add('d-none');
    document.getElementById('playlistHubOptIn').checked = true;
    document.getElementById('playlistHubContent').classList.remove('d-none');
    populateHubUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveAndReturnToMain() {
    const playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    if (playlists.length > 0) {
        document.getElementById('playlistConfigContainer').classList.add('d-none');
        document.getElementById('playlistDashboardView').classList.remove('d-none');
        renderActivePlayer();
    } else {
        showBipModal("Info", "Please add at least one radio station first.");
    }
}

function saveNewPlaylist() {
    const name = document.getElementById('newPlaylistName').value.trim();
    const url = document.getElementById('playlistUrlInput').value.trim();

    if (!name || !url) {
        showBipModal("Error", "Please provide both a station name and a valid URL.");
        return;
    }

    let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    const newObj = { id: 'radio_' + Date.now(), name: name, stream: url };
    playlists.push(newObj);

    localStorage.setItem('bip_playlists_list', JSON.stringify(playlists));
    if (!localStorage.getItem('bip_active_playlist_id')) {
        localStorage.setItem('bip_active_playlist_id', newObj.id);
    }

    toggleAddCustomForm(false);
    populateHubUI();
}

function addPresetStream(name, stream) {
    let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    
    if (playlists.some(p => p.name === name)) return;

    const newObj = { id: 'radio_' + Date.now(), name: name, stream: stream };
    playlists.push(newObj);

    localStorage.setItem('bip_playlists_list', JSON.stringify(playlists));
    if (!localStorage.getItem('bip_active_playlist_id')) {
        localStorage.setItem('bip_active_playlist_id', newObj.id);
    }

    populateHubUI();
}

function populateHubUI() {
    const playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    
    const presetsContainer = document.getElementById('presetsContainer');
    presetsContainer.innerHTML = '';

    const activeNames = playlists.map(p => p.name);
    const availablePresets = ALL_PRESETS.filter(ap => !activeNames.includes(ap.name));

    if (availablePresets.length === 0) {
        presetsContainer.innerHTML = '<span class="small theme-text-sub text-light-adapt">All radio presets have been added to your session.</span>';
    } else {
        availablePresets.forEach(preset => {
            const item = document.createElement('div');
            item.className = 'd-flex justify-content-between align-items-center p-2 rounded-3 theme-box-toggle border border-secondary';
            item.innerHTML = `
                <div>
                    <strong class="theme-text-title text-light-adapt d-block" style="font-size: 0.85rem;">${preset.name}</strong>
                    <span class="small theme-text-sub text-light-adapt" style="font-size: 0.75rem;">Verified high quality gym radio.</span>
                </div>
                <button type="button" class="btn btn-sm px-3 rounded-pill fw-bold" onclick="addPresetStream('${preset.name}', '${preset.stream}')" style="background-color: var(--accent-color); color: #111; font-size: 0.75rem;">Add Preset</button>
            `;
            presetsContainer.appendChild(item);
        });
    }

    const savedContainer = document.getElementById('savedPlaylistsContainer');
    savedContainer.innerHTML = '';

    if (playlists.length === 0) {
        savedContainer.innerHTML = '<span class="small theme-text-sub text-light-adapt">No radio stations added yet. Choose a preset above.</span>';
        return;
    }

    playlists.forEach((pl) => {
        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between align-items-center p-3 rounded-3 theme-box-toggle border border-secondary';
        item.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-broadcast" style="color: var(--accent-color);"></i>
                <strong class="theme-text-title text-light-adapt">${pl.name}</strong>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-sm btn-outline-secondary py-1 px-2 rounded-pill" onclick="renamePlaylist('${pl.id}')" style="font-size: 0.75rem; border-color: rgba(255,255,255,0.2); color: var(--text-color);">Rename</button>
                <button type="button" class="btn btn-sm btn-outline-danger py-1 px-2 rounded-pill" onclick="deletePlaylist('${pl.id}')" style="font-size: 0.75rem;">Delete</button>
            </div>
        `;
        savedContainer.appendChild(item);
    });
}

function renderActivePlayer() {
    const playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    const activeId = localStorage.getItem('bip_active_playlist_id');
    const container = document.getElementById('activeStreamsLineByLineContainer');
    container.innerHTML = '';

    if (playlists.length === 0) {
        document.getElementById('playlistDashboardView').classList.add('d-none');
        document.getElementById('playlistConfigContainer').classList.remove('d-none');
        document.getElementById('playlistHubOptIn').checked = true;
        document.getElementById('playlistHubContent').classList.remove('d-none');
        populateHubUI();
        return;
    }

    document.getElementById('playlistConfigContainer').classList.add('d-none');
    document.getElementById('playlistDashboardView').classList.remove('d-none');

    const activePl = playlists.find(p => p.id === activeId) || playlists[0];
    renderRadioPlayerCard(activePl);

    playlists.forEach((pl, index) => {
        const isThisActive = (pl.id === activeId);
        const item = document.createElement('div');
        item.className = `d-flex justify-content-between align-items-center p-3 rounded-3 theme-box-toggle border ${isThisActive ? 'border-warning' : 'border-secondary'} drag-item`;
        item.setAttribute('draggable', 'true');
        item.setAttribute('data-index', index);
        
        item.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-grip-vertical text-muted fs-5 me-1" title="Drag to reorder"></i>
                <i class="bi ${isThisActive ? 'bi-broadcast text-warning fs-5' : 'bi-radio fs-5'}" style="color: var(--accent-color);"></i>
                <strong class="theme-text-title text-light-adapt" style="font-size: 0.9rem;">${pl.name}</strong>
            </div>
            <div>
                <button type="button" class="btn btn-sm px-3 rounded-pill fw-bold shadow" onclick="selectRadioStation('${pl.id}')" style="background-color: var(--accent-color); color: #111; font-size: 0.75rem;">
                    ${isThisActive ? 'Active' : 'Select'}
                </button>
            </div>
        `;

        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            item.classList.add('opacity-50');
        });
        item.addEventListener('dragend', () => item.classList.remove('opacity-50'));
        item.addEventListener('dragover', (e) => e.preventDefault());
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetIndex = index;
            if (!isNaN(draggedIndex) && draggedIndex !== targetIndex) {
                const movedItem = playlists.splice(draggedIndex, 1)[0];
                playlists.splice(targetIndex, 0, movedItem);
                localStorage.setItem('bip_playlists_list', JSON.stringify(playlists));
                renderActivePlayer();
            }
        });

        container.appendChild(item);
    });
}

function renderRadioPlayerCard(radioObj) {
    const container = document.getElementById('activeRadioContainer');
    const streamUrl = radioObj.stream;

    container.innerHTML = `
        <div class="p-4 text-center rounded-4 theme-box-toggle border border-secondary shadow-sm">
            <div class="mb-3">
                <i class="bi bi-broadcast display-4 text-warning"></i>
            </div>
            <h4 class="text-light-adapt fw-bold mb-2">${radioObj.name}</h4>
            <p class="small theme-text-sub text-light-adapt mb-3">Live Workout Radio Station</p>
            
            <div class="d-flex flex-column align-items-center gap-3">
                <audio controls autoplay class="w-100 rounded-3" style="max-width: 500px;" src="${streamUrl}">
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    `;
}

function selectRadioStation(id) {
    localStorage.setItem('bip_active_playlist_id', id);
    renderActivePlayer();
}

function renamePlaylist(id) {
    let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    let pl = playlists.find(p => p.id === id);
    if (!pl) return;

    const modalBodyHtml = `
        <p class="small text-light-adapt mb-2">Enter new name for this station:</p>
        <input type="text" id="bipPromptRenameInput" class="form-control custom-select-dropdown mb-3" value="${pl.name}">
        <div class="text-center">
            <button type="button" class="btn btn-sm px-4 fw-bold rounded-pill" onclick="confirmRenamePlaylist('${id}')" style="background-color: var(--accent-color); color: #111;">Save</button>
        </div>
    `;
    showBipModal("Rename Station", modalBodyHtml, "");
}

function confirmRenamePlaylist(id) {
    const inputVal = document.getElementById('bipPromptRenameInput').value.trim();
    if (inputVal) {
        let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
        let pl = playlists.find(p => p.id === id);
        if (pl) {
            pl.name = inputVal;
            localStorage.setItem('bip_playlists_list', JSON.stringify(playlists));
            populateHubUI();
        }
    }
    const modalEl = document.getElementById('bipCustomModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
}

function deletePlaylist(id) {
    let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    playlists = playlists.filter(p => p.id !== id);
    localStorage.setItem('bip_playlists_list', JSON.stringify(playlists));
    
    const activeId = localStorage.getItem('bip_active_playlist_id');
    if (activeId === id) {
        if (playlists.length > 0) {
            localStorage.setItem('bip_active_playlist_id', playlists[0].id);
        } else {
            localStorage.removeItem('bip_active_playlist_id');
        }
    }
    
    if (!document.getElementById('playlistDashboardView').classList.contains('d-none')) {
        renderActivePlayer();
    } else {
        populateHubUI();
    }
}

function loadSavedPlaylistState() {
    let playlists = JSON.parse(localStorage.getItem('bip_playlists_list') || '[]');
    const activeId = localStorage.getItem('bip_active_playlist_id');
    
    if (playlists.length > 0 && activeId) {
        renderActivePlayer();
    } else {
        document.getElementById('playlistConfigContainer').classList.remove('d-none');
        document.getElementById('playlistHubOptIn').checked = false;
        document.getElementById('playlistHubContent').classList.add('d-none');
        document.getElementById('playlistDashboardView').classList.add('d-none');
    }
}

