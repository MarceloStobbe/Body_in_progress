document.addEventListener('DOMContentLoaded', () => {
    const bodyElement = document.body;

    const savedTheme = localStorage.getItem('BIP_theme') || 'dark';
    bodyElement.setAttribute('data-theme', savedTheme);

    const savedAccent = localStorage.getItem('BIP_accent') || 'default';
    if (savedAccent !== 'default') {
        bodyElement.setAttribute('data-accent', savedAccent);
    }

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        const themeIcon = document.getElementById('themeIcon');
        updateIcon(savedTheme);

        toggleBtn.addEventListener('click', () => {
            const currentTheme = bodyElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            bodyElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('BIP_theme', newTheme);
            updateIcon(newTheme);
        });

        function updateIcon(theme) {
            if (theme === 'light') {
                themeIcon.className = 'bi bi-moon-fill';
            } else {
                themeIcon.className = 'bi bi-sun-fill';
            }
        }
    }

    initGlobalRadioPlayer();
});

/**
 * @param {string} themeName 
 * @param {string} colorHex 
 */
function setAccentTheme(themeName, colorHex) {
    const bodyElement = document.body;
    if (themeName === 'default') {
        bodyElement.removeAttribute('data-accent');
        localStorage.removeItem('BIP_accent');
    } else {
        bodyElement.setAttribute('data-accent', themeName);
        localStorage.setItem('BIP_accent', themeName);
    }
}

let globalRadioAudio = null;

function initGlobalRadioPlayer() {
    const barEl = document.getElementById('headerRadioBar');
    const nameEl = document.getElementById('headerRadioName');
    const toggleBtn = document.getElementById('headerRadioToggleBtn');
    const toggleIcon = document.getElementById('headerRadioToggleIcon');
    const closeBtn = document.getElementById('headerRadioCloseBtn');

    if (!barEl || !nameEl || !toggleBtn || !toggleIcon || !closeBtn) {
        return;
    }

    globalRadioAudio = document.getElementById('bipGlobalRadioAudio');
    if (!globalRadioAudio) {
        globalRadioAudio = document.createElement('audio');
        globalRadioAudio.id = 'bipGlobalRadioAudio';
        globalRadioAudio.preload = 'none';
        globalRadioAudio.style.display = 'none';
        document.body.appendChild(globalRadioAudio);
    }

    function getStation() {
        const raw = localStorage.getItem('bip_header_radio_station');
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function syncUIAndAudio(shouldAutoPlay = false) {
        const station = getStation();
        const isClosed = localStorage.getItem('bip_header_radio_closed') === 'true';
        const isPlaying = localStorage.getItem('bip_header_radio_playing') === 'true';

        if (!station || !station.stream || isClosed) {
            barEl.classList.add('d-none');
            barEl.classList.remove('d-flex');
            globalRadioAudio.pause();
            globalRadioAudio.removeAttribute('src');
            globalRadioAudio.load();
            return;
        }

        barEl.classList.remove('d-none');
        barEl.classList.add('d-flex');
        nameEl.textContent = station.name || 'Radio';

        const isOnPlaylistPage = Boolean(document.getElementById('workoutRadioAudio'));

        if (globalRadioAudio.src !== station.stream) {
            globalRadioAudio.src = station.stream;
        }

        if (isPlaying && !isOnPlaylistPage) {
            toggleIcon.className = 'bi bi-pause-fill';
            if (shouldAutoPlay || globalRadioAudio.paused) {
                globalRadioAudio.play().catch(() => {
                    localStorage.setItem('bip_header_radio_playing', 'false');
                    toggleIcon.className = 'bi bi-play-fill';
                });
            }
        } else if (isPlaying && isOnPlaylistPage) {
            toggleIcon.className = 'bi bi-pause-fill';
            globalRadioAudio.pause();
        } else {
            toggleIcon.className = 'bi bi-play-fill';
            globalRadioAudio.pause();
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isPlaying = localStorage.getItem('bip_header_radio_playing') === 'true';
        const isOnPlaylistPage = Boolean(document.getElementById('workoutRadioAudio'));

        if (isPlaying) {
            localStorage.setItem('bip_header_radio_playing', 'false');
            globalRadioAudio.pause();
            toggleIcon.className = 'bi bi-play-fill';
            if (isOnPlaylistPage) {
                window.dispatchEvent(new CustomEvent('bipHeaderRadioCommand', { detail: { action: 'pause' } }));
            }
        } else {
            localStorage.setItem('bip_header_radio_closed', 'false');
            localStorage.setItem('bip_header_radio_playing', 'true');
            toggleIcon.className = 'bi bi-pause-fill';
            if (isOnPlaylistPage) {
                window.dispatchEvent(new CustomEvent('bipHeaderRadioCommand', { detail: { action: 'play' } }));
            } else {
                const station = getStation();
                if (station && station.stream) {
                    if (globalRadioAudio.src !== station.stream) {
                        globalRadioAudio.src = station.stream;
                    }
                    globalRadioAudio.play().catch(() => {});
                }
            }
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('bip_header_radio_closed', 'true');
        localStorage.setItem('bip_header_radio_playing', 'false');
        globalRadioAudio.pause();
        globalRadioAudio.removeAttribute('src');
        globalRadioAudio.load();
        barEl.classList.add('d-none');
        barEl.classList.remove('d-flex');
        window.dispatchEvent(new CustomEvent('bipHeaderRadioCommand', { detail: { action: 'close' } }));
    });

    window.addEventListener('bipRadioStateChanged', () => {
        syncUIAndAudio(true);
    });

    syncUIAndAudio(true);
}