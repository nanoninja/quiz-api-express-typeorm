import 'mocha';

import chai = require('chai');
import chaiHttp = require('chai-http');

import { expect } from 'chai';
import { User } from '../src/entity/User';

chai.use(chaiHttp);

// authHelper(app, userTest, 200).then((token: string) => {
//     chai.request(app)
//         .get('/users')
//         .auth(token, { type: 'bearer' })
//         .then((res: any) => {
//             expect(res).to.be.json;
//             expect(res).to.have.status(200);
//             expect(res.body).to.be.a('array');
//             console.log(res.body);
//         });
// })
export async function authHelper(app: any, user: User, expectStatus: number): Promise<any> {
    return chai.request(app)
        .post('/users/authenticate')
        .send({ email: user.email, password: user.password })
        .then((res: any) => {
            expect(res).to.be.json;
            expect(res).to.have.status(expectStatus);

            return res;
        });
}
