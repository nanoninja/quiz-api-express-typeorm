import 'mocha';
import * as app from '../src/main';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

chai.use(chaiHttp);

describe('API endpoint /users', async () => {

    it('POST /users/register should return Bad Request', () => {
        chai.request(app)
            .post('/users/register')
            .send({ mail: 'test@example.com', pass: '0000' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(400);
                expect(res.body.code).equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.name).equal('BadRequestError');
            });
    });

    it('POST /users/register the password is too short', () => {
        chai.request(app)
            .post('/users/register')
            .send({ email: 'test@example.com', password: '000000' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(400);
                expect(res.body.code).equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.name).equal('BadRequestError');
            });
    });

    it('POST /users/register should create a new user', () => {
        const email = `test.${Date.now()}@example.com`;
        const data = { email: email, password: '12345678' };

        chai.request(app)
            .post('/users/register')
            .send(data)
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res.body.id).to.not.equal('');
                expect(res.body.email).equal(data.email);
                expect(res).to.have.status(201);
            })
            .catch((err: any) => {
                expect(err.actual).equal(400);
            });
    });

    it('POST /users/authenticate should be create a new access token', () => {
        chai.request(app)
            .post('/users/authenticate')
            .send({ email: 'john.doe@gmail.com', password: '12345678' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body.access_token).to.not.equal('');
            })
            .catch((err: any) => {
                expect(err.actual).equal(401);
            });
    })
});
