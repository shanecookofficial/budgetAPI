const request = require('supertest');
const server = require('../../app');

describe('GET /', () => {
    it('responds with HTML containing Google authentication link', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('<a href="/auth/google">Authenticate with Google</a>');
    });
});

afterAll(done => {
    server.close(done);
});
