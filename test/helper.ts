import 'mocha';
import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

import { User } from '../src/entity/User';
import { DeleteResult, getCustomRepository } from "typeorm";
import { UserRepository } from "../src/repository/UserRepository";
import { Application } from "express";

chai.use(chaiHttp);

export const userTest = newUser('xyz@example.com', 'testP@$$w0rd');

export function newUser(email: string, password: string) {
    const user = new User();

    user.email = email;
    user.password = password;

    return user;
}

export function clearUserTest(): Promise<DeleteResult> {
    return getCustomRepository(UserRepository)
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('email = :email', { email: userTest.email })
        .execute();
}

export function createUserTest(): Promise<User> {
    return getCustomRepository(UserRepository).save(userTest);
}

/**
 * Auth helper
 *
 * userHelper(app, userTest, 200).then((token: string) => {
 *     chai.request(app)
 *         .get('/users')
 *         .auth(token, { type: 'bearer' })
 *         .then((res: any) => {
 *             expect(res).to.be.json;
 *             expect(res).to.have.status(200);
 *             expect(res.body).to.be.a('array');
 *             console.log(res.body);
 *         });
 * })
 */
export async function auth(app: Application, user: User, expectStatus: number): Promise<ChaiHttp.Agent> {
    return chai.request(app)
        .post('/users/authenticate')
        .send({ email: user.email, password: user.password })
        .then((response: any) => {
            expect(response).to.be.json;
            expect(response).to.have.status(expectStatus);

            return response;
        });
}
