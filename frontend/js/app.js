// Main Application Logic
class CareLink {
    constructor() {
        this.currentUser = null;
        this.facilities = [];
        this.transfers = [];
        this.init();
    }

    async init() {
        this.checkAuth();
        if (document.getElementById('app')) {
            await this.loadDashboard();
        }
        this.attachEventListeners();
    }

    checkAuth() {
        const token = localStorage.getItem('carelink_token');
        if (token) {
            this.currentUser = JSON.parse(localStorage.getItem('carelink_user') || '{}');
        }
    }

    async loadDashboard() {
        const dashboardHTML = `
            <div class="dashboard">
                <aside class="sidebar">
                    <div class="logo-section">
                        <h2>🏥 CareLink</h2>
                        <p style="font-size: 12px; color: #999; margin-top: 5px;">
                            ${this.currentUser?.hospitalName || 'Demo Hospital'}
                        </p>
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
                            <div class="stat-value" id="availableCount">0</div>
                            <div class="stat-change positive">Real-time updates</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Pending Transfers</div>
                            <div class="stat-value" id="pendingCount">0</div>
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
                                <option>All Types</option>
                                <option>Post-Surgical</option>
                                <option>Rehabilitation</option>
                                <option>Wound Care</option>
                                <option>Cardiac Care</option>
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
                                <option>Blue Cross</option>
                            </select>
                            <button class="btn btn-primary" onclick="app.searchFacilities()">
                                Search
                            </button>
                        </div>
                    </div>
                    
                    <div id="facilitiesList" class="facilities-list">
                        <div class="loading">Loading facilities...</div>
                    </div>
                </main>
            </div>
            
            <!-- Transfer Modal -->
            <div id="transferModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Request Patient Transfer</h2>
                        <button class="modal-close" onclick="app.closeTransferModal()">×</button>
                    </div>
                    <form id="transferForm" onsubmit="app.submitTransfer(event)">
                        <div class="form-group">
                            <label>Patient Name *</label>
                            <input type="text" name="patientName" required>
                        </div>
                        <div class="form-group">
                            <label>Medical Record Number *</label>
                            <input type="text" name="mrn" required>
                        </div>
                        <div class="form-group">
                            <label>Age</label>
                            <input type="number" name="age">
                        </div>
                        <div class="form-group">
                            <label>Primary Diagnosis *</label>
                            <input type="text" name="diagnosis" required>
                        </div>
                        <div class="form-group">
                            <label>Care Type</label>
                            <select name="careType">
                                <option>Post-Surgical Care</option>
                                <option>Rehabilitation</option>
                                <option>Wound Care</option>
                                <option>Cardiac Care</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Insurance</label>
                            <select name="insurance">
                                <option>Medicare</option>
                                <option>Medicaid</option>
                                <option>Blue Cross</option>
                                <option>Aetna</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea name="notes" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Submit Transfer</button>
                            <button type="button" class="btn btn-secondary" onclick="app.closeTransferModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('app').innerHTML = dashboardHTML;
        await this.loadFacilities();
    }

    async loadFacilities() {
        try {
            this.facilities = await API.getFacilities();
            this.renderFacilities(this.facilities);
            
            // Update stats
            const available = this.facilities.filter(f => f.availableBeds > 0).length;
            document.getElementById('availableCount').textContent = available;
        } catch (error) {
            console.error('Failed to load facilities:', error);
            this.showNotification('Failed to load facilities. Please try again.', 'error');
        }
    }

    renderFacilities(facilities) {
        const container = document.getElementById('facilitiesList');
        if (!container) return;

        if (facilities.length === 0) {
            container.innerHTML = '<div class="no-results">No facilities found matching your criteria.</div>';
            return;
        }

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
                    <div class="detail-item">
                        <span class="detail-label">Success Rate</span>
                        <span class="detail-value">${facility.successRate}%</span>
                    </div>
                </div>
                <div class="facility-services">
                    ${facility.specialties ? facility.specialties.map(spec => 
                        `<span class="service-tag">${spec}</span>`
                    ).join('') : ''}
                </div>
                <div class="facility-actions">
                    <button class="btn btn-primary" onclick="app.requestTransfer(${facility.id})">
                        Request Transfer
                    </button>
                    <button class="btn btn-secondary" onclick="app.viewDetails(${facility.id})">
                        View Details
                    </button>
                    <button class="btn btn-secondary" onclick="app.contactFacility(${facility.id})">
                        📞 Contact
                    </button>
                </div>
            </div>
        `).join('');
    }

    async searchFacilities() {
        const filters = {
            careType: document.getElementById('careType').value,
            distance: document.getElementById('distance').value,
            insurance: document.getElementById('insurance').value
        };
        
        this.showNotification('Searching facilities...', 'info');
        
        try {
            this.facilities = await API.getFacilities(filters);
            this.renderFacilities(this.facilities);
            this.showNotification(`Found ${this.facilities.length} facilities`, 'success');
        } catch (error) {
            this.showNotification('Search failed. Please try again.', 'error');
        }
    }

    requestTransfer(facilityId) {
        this.selectedFacilityId = facilityId;
        this.openTransferModal();
    }

    async viewDetails(facilityId) {
        try {
            const facility = await API.getFacility(facilityId);
            this.showNotification(`Loading details for ${facility.name}...`, 'info');
            // In a real app, this would open a detailed view
        } catch (error) {
            this.showNotification('Failed to load facility details', 'error');
        }
    }

    contactFacility(facilityId) {
        const facility = this.facilities.find(f => f.id === facilityId);
        if (facility) {
            this.showNotification(`Contact: ${facility.contactPhone || '(555) 123-4567'}`, 'info');
        }
    }

    openTransferModal() {
        document.getElementById('transferModal').classList.add('active');
    }

    closeTransferModal() {
        document.getElementById('transferModal').classList.remove('active');
    }

    async submitTransfer(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const transferData = {
            patientName: formData.get('patientName'),
            patientMRN: formData.get('mrn'),
            age: formData.get('age'),
            diagnosis: formData.get('diagnosis'),
            careType: formData.get('careType'),
            insurance: formData.get('insurance'),
            notes: formData.get('notes'),
            toFacility: this.selectedFacilityId,
            fromHospital: this.currentUser?.hospitalName || 'Demo Hospital'
        };
        
        try {
            await API.createTransfer(transferData);
            this.closeTransferModal();
            this.showNotification('Transfer request submitted successfully!', 'success');
            event.target.reset();
            
            // Update pending count
            const pendingCount = document.getElementById('pendingCount');
            if (pendingCount) {
                pendingCount.textContent = parseInt(pendingCount.textContent) + 1;
            }
        } catch (error) {
            this.showNotification('Failed to submit transfer request', 'error');
        }
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                e.target.classList.add('active');
                this.switchPage(e.target.dataset.page);
            }
        });
    }

    switchPage(page) {
        this.showNotification(`Loading ${page}...`, 'info');
        // Implement page switching logic here
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CareLink();
});
