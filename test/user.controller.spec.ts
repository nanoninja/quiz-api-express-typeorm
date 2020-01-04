import 'mocha';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

import * as app from '../src/main';
import { User } from '../src/entity/User';
import { UserRepository } from '../src/repository/UserRepository';
import { getCustomRepository } from 'typeorm';

chai.use(chaiHttp);

const userTest = new User();
userTest.email = 'test@example.com';
userTest.password = 'testP@$$w0rd';

describe('API endpoint /users', () => {

    function clearUserTest() {
        return getCustomRepository(UserRepository)
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("email = :email", { email: userTest.email })
            .execute();
    }

    function createUserTest(): Promise<User> {
        return getCustomRepository(UserRepository).save(userTest);
    }

    before(clearUserTest)
    afterEach(clearUserTest)

    it('POST /users/register should return Bad Request', done => {
        chai.request(app)
            .post('/users/register')
            .send({ mail: 'test@example.com', pass: '0000' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(400);
                expect(res.body.code).equal(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('POST /users/register the password is too short', done => {
        chai.request(app)
            .post('/users/register')
            .send({ email: 'test@example.com', password: '12345' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(400);
                expect(res.body.code).equal(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('POST /users/register should create a new user', done => {
        chai.request(app)
            .post('/users/register')
            .send({ email: userTest.email, password: userTest.password })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res.body.id).to.not.equal('');
                expect(res.body.email).equal(userTest.email);
                expect(res).to.have.status(201);
                done();
            })
            .catch((err: any) => {
                expect(err.actual).equal(500);
                done();
            });
    });

    it('POST /users/authenticate should be create a new access token', done => {
        chai.request(app)
            .post('/users/authenticate')
            .send({ email: 'john.doe@gmail.com', password: '12345678' })
            .then((res: any) => {
                expect(res).to.be.json;
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body.access_token).to.not.equal('');
                done();
            })
            .catch((err: any) => {
                expect(err.actual).equal(401);
                done();
            });
    });

    it('GET /users should have forbidden', done => {
        createUserTest().then((user: User) => {
            chai.request(app)
                .post('/users/authenticate')
                .send({ email: userTest.email, password: userTest.password })
                .then((res: any) => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(403);
                    done();
                })
                .catch((err: any) => {
                    expect(err.actual).equal(401);
                    done();
                });
        });
    });
});
