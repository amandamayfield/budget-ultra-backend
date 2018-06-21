const request = require('supertest');
const app = require('../../../src/app');

describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/hello-world');
        expect(response.statusCode).toBe(200);
    });
});
