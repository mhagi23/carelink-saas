// Main Application Logic
class CareLink {
    constructor() {
        this.currentUser = null;
        this.facilities = [];
        this.transfers = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadDashboard();
        this.attachEventListeners();
    }

    checkAuth() {
        const token = localStorage.getItem('carelink_token');
        if (token) {
            this.currentUser = JSON.parse(localStorage.getItem('carelink_user'));
        }
    }

    async loadDashboard() {
        if (!document.getElementById('app')) return;
        
        const dashboardHTML = `
            <div class="dashboard">
                <aside class="sidebar">
                    <div class="logo-section">
                        <h2>CareLink</h2>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="#" class="nav-item active" data-page="facilities">
                            <span>🏥</span> Find Facilities
                        </a>
                        <a href="#" class="nav-item" data-page="transfers">
                            <span>📋</span> Active Transfers
                        </a>
                        <a href="#" class="nav-item" data-page="analytics">
                            <span>📊</span> Analytics
                        </a>
                        <a href="#" class="nav-item" data-page="settings">
                            <span>⚙️</span> Settings
                        </a>
                    </nav>
                </aside>
                
                <main class="main-content">
                    <div class="content-header">
                        <h1>Find Homecare Facilities</h1>
                        <button class="btn btn-primary" onclick="app.openTransferModal()">
                            + New Transfer
                        </button>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Available Facilities</div>
                            <div class="stat-value">24</div>
                            <div class="stat-change positive">↑ 3 from yesterday</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Pending Transfers</div>
                            <div class="stat-value">7</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Avg Transfer Time</div>
                            <div class="stat-value">2.3h</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Success Rate</div>
                            <div class="stat-value">94%</div>
                        </div>
                    </div>
                    
                    <div class="search-section">
                        <h3>Search Filters</h3>
                        <div class="filter-grid">
                            <select id="careType" class="form-select">
                                <option>All Care Types</option>
                                <option>Post-Surgical</option>
                                <option>Rehabilitation</option>
                                <option>Wound Care</option>
                            </select>
                            <select id="distance" class="form-select">
                                <option>10 miles</option>
                                <option>25 miles</option>
                                <option>50 miles</option>
                            </select>
                            <select id="insurance" class="form-select">
                                <option>All Insurance</option>
                                <option>Medicare</option>
                                <option>Medicaid</option>
                            </select>
                            <button class="btn btn-primary" onclick="app.searchFacilities()">
                                Search
                            </button>
                        </div>
                    </div>
                    
                    <div id="facilitiesList" class="facilities-list">
                        <!-- Facilities will be loaded here -->
                    </div>
                </main>
            </div>
        `;
        
        document.getElementById('app').innerHTML = dashboardHTML;
        this.loadFacilities();
    }

    async loadFacilities() {
        // In production, this would be an API call
        const facilities = await API.getFacilities();
        this.renderFacilities(facilities);
    }

    renderFacilities(facilities) {
        const container = document.getElementById('facilitiesList');
        if (!container) return;

        container.innerHTML = facilities.map(facility => `
            <div class="facility-card">
                <div class="facility-header">
                    <div>
                        <h3>${facility.name}</h3>
                        <p class="facility-location">📍 ${facility.location}</p>
                    </div>
                    <span class="availability-badge ${facility.availabilityClass}">
                        ${facility.availabilityText}
                    </span>
                </div>
                <div class="facility-details">
                    <div class="detail-item">
                        <span class="detail-label">Beds Available</span>
                        <span class="detail-value">${facility.availableBeds}/${facility.totalBeds}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Response Time</span>
                        <span class="detail-value">${facility.responseTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rating</span>
                        <span class="detail-value">⭐ ${facility.rating}</span>
                    </div>
                </div>
                <div class="facility-actions">
                    <button class="btn btn-primary" onclick="app.requestTransfer('${facility.id}')">
                        Request Transfer
                    </button>
                    <button class="btn btn-secondary" onclick="app.viewDetails('${facility.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                e.preventDefault();
                this.switchPage(e.target.dataset.page);
            }
        });
    }

    switchPage(page) {
        console.log('Switching to page:', page);
        // Implement page switching logic
    }

    searchFacilities() {
        const filters = {
            careType: document.getElementById('careType').value,
            distance: document.getElementById('distance').value,
            insurance: document.getElementById('insurance').value
        };
        
        console.log('Searching with filters:', filters);
        // Implement search logic
    }

    requestTransfer(facilityId) {
        console.log('Requesting transfer to facility:', facilityId);
        // Implement transfer request
    }

    viewDetails(facilityId) {
        console.log('Viewing details for facility:', facilityId);
        // Implement view details
    }

    openTransferModal() {
        console.log('Opening transfer modal');
        // Implement modal logic
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CareLink();
});