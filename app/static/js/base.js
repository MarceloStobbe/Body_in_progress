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