// API Service Layer
const API_BASE_URL = 'http://localhost:3000/api';

class API {
    static async request(endpoint, options = {}) {
        const token = localStorage.getItem('carelink_token');
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    static async getFacilities(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `/facilities${queryParams ? '?' + queryParams : ''}`;
            return await this.request(url);
        } catch (error) {
            console.error('Failed to fetch facilities:', error);
            // Return mock data as fallback
            return [
                {
                    id: 1,
                    name: 'Sunshine Senior Care',
                    location: '2.3 miles away',
                    availableBeds: 3,
                    totalBeds: 12,
                    responseTime: '15 min',
                    rating: 4.8,
                    availabilityClass: 'available',
                    availabilityText: 'Available'
                }
            ];
        }
    }

    static async getFacility(id) {
        return await this.request(`/facilities/${id}`);
    }

    static async createTransfer(data) {
        return await this.request('/transfers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async getTransfers() {
        return await this.request('/transfers');
    }

    static async login(email, password) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    static async register(data) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

// Make API available globally
window.API = API;
