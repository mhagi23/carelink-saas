// Analytics module for dashboard
class Analytics {
    constructor() {
        this.charts = {};
    }

    initCharts() {
        this.createTransferChart();
        this.createFacilityUtilization();
        this.createResponseTimeChart();
    }

    createTransferChart() {
        const ctx = document.getElementById('transferChart');
        if (!ctx) return;

        // Using Chart.js (include via CDN)
        this.charts.transfers = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Transfers Completed',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createFacilityUtilization() {
        const ctx = document.getElementById('utilizationChart');
        if (!ctx) return;

        this.charts.utilization = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'Occupied', 'Reserved'],
                datasets: [{
                    data: [30, 55, 15],
                    backgroundColor: [
                        '#10b981',
                        '#2563eb',
                        '#f59e0b'
                    ]
                }]
            }
        });
    }

    getMetrics() {
        return {
            totalTransfers: 145,
            avgTransferTime: 2.3,
            successRate: 94,
            activeFacilities: 24,
            pendingRequests: 7,
            monthlyGrowth: 12
        };
    }
}