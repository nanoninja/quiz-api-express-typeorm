import 'mocha';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

import { server } from '../src/main';
import { userTest, clearUserTest, createUserTest } from './helper';

chai.use(chaiHttp);

const tearDown = () => server.close();

describe('API endpoint /users', () => {

    before(clearUserTest);
    afterEach(clearUserTest);
    after(tearDown);

    it('POST /users/register should return Bad Request : Data format is invalid', async () => {
        const response = await chai.request(server).post('/users/register').send({ mail: '', pass: '' });

        expect(response).to.be.json;
        expect(response).to.have.status(400);
        expect(response.body.status).equal(400);
        expect(response.body).to.be.an('object');
    });

    it('POST /users/register should return Bad Request : password must be longer than or equal to 8 characters', async () => {
        const response = await chai.request(server).post('/users/register').send({
            email: 'test@example.com',
            password: '12345'
        });

        expect(response).to.be.json;
        expect(response).to.have.status(400);
        expect(response.body.status).equal(400);
        expect(response.body).to.be.an('object');
    });

    it('POST /users/register should create a new user', async () => {
        const response = await chai.request(server).post('/users/register').send({
            email: userTest.email,
            password: userTest.password
        });

        try {
            expect(response).to.be.json;
            expect(response.body.id).to.not.equal('');
            expect(response.body.email).equal(userTest.email);
            expect(response).to.have.status(201);
        } catch (err) {
            expect(err.actual).equal(500);
        }
    });

    it('POST /users/authenticate should be create a new access token', async () => {
        const response = await chai.request(server).post('/users/authenticate').send({
            email: 'john.doe@gmail.com',
            password: '123456789'
        });

        try {
            expect(response).to.be.json;
            expect(response).to.have.status(201);
            expect(response.body).to.be.an('object');
            expect(response.body.access_token).to.not.equal('');
        } catch (err) {
            expect(err.actual).equal(401);
        }
    });

    it('GET /users should have forbidden', async () => {
        try {
            await createUserTest();

            const response = await chai.request(server).post('/users/authenticate').send({
                email: userTest.email,
                password: userTest.password
            });

            expect(response).to.be.json;
            expect(response).to.have.status(403);
        } catch (err) {
            expect(err.actual).equal(401);
        }
    });
});
