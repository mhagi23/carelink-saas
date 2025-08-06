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

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return response.json();
    }

    static async getFacilities(filters = {}) {
        // Mock data for now
        return [
            {
                id: '1',
                name: 'Sunshine Senior Care',
                location: '2.3 miles away',
                availableBeds: 3,
                totalBeds: 12,
                responseTime: '15 min',
                rating: 4.8,
                availabilityClass: 'available',
                availabilityText: 'Available'
            },
            {
                id: '2',
                name: 'Harmony Healthcare',
                location: '3.7 miles away',
                availableBeds: 1,
                totalBeds: 20,
                responseTime: '30 min',
                rating: 4.6,
                availabilityClass: 'limited',
                availabilityText: 'Limited'
            },
            {
                id: '3',
                name: 'Willow Creek Rehab',
                location: '5.1 miles away',
                availableBeds: 8,
                totalBeds: 30,
                responseTime: '20 min',
                rating: 4.9,
                availabilityClass: 'available',
                availabilityText: 'Available'
            }
        ];
    }

    static async createTransfer(data) {
        return this.request('/transfers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
}