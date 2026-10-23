document.addEventListener('DOMContentLoaded', () => {
    loadDashboardQuickMetrics();
});

function loadDashboardQuickMetrics() {
    const bodyHistory = JSON.parse(localStorage.getItem('body_metrics_history') || '[]');
    if (bodyHistory.length > 0) {
        const latestWeight = bodyHistory[bodyHistory.length - 1].Weight;
        if (latestWeight > 0) {
            document.getElementById('dashCardWeight').textContent = latestWeight + ' kg';
        }
    }

    const consumedSleep = localStorage.getItem('sleep_consumed_today');
    if (consumedSleep !== null && consumedSleep !== '') {
        document.getElementById('dashCardSleep').textContent = parseFloat(consumedSleep).toFixed(1) + ' hrs';
    }

    const consumedWater = localStorage.getItem('water_consumed_today');
    if (consumedWater !== null && consumedWater !== '') {
        document.getElementById('dashCardWater').textContent = parseFloat(consumedWater).toFixed(1) + ' L';
    }
}