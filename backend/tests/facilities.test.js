const request = require('supertest');
const app = require('../server');

describe('Facilities API', () => {
    test('GET /api/facilities should return facilities list', async () => {
        const response = await request(app)
            .get('/api/facilities')
            .expect(200);
        
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('GET /api/facilities with filters', async () => {
        const response = await request(app)
            .get('/api/facilities?careType=Rehabilitation')
            .expect(200);
        
        expect(response.body.length).toBeGreaterThan(0);
    });
});