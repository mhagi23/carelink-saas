const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
    try {
        // Test health endpoint
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health check:', health.data);

        // Test facilities endpoint
        const facilities = await axios.get(`${API_URL}/facilities`);
        console.log('✅ Facilities found:', facilities.data.length);

        // Test search with filters
        const filtered = await axios.get(`${API_URL}/facilities?careType=Rehabilitation`);
        console.log('✅ Filtered facilities:', filtered.data.length);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();