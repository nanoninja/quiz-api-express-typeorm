import 'mocha';
import * as app from '../src/main';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

chai.use(chaiHttp);

describe('API endpoint /', () => {
    it('GET / should return "Hello, World"', () => {
        chai.request(app)
            .get('/')
            .then((res: any) => {
                expect(res).to.have.status(200);
                expect(res).to.have.json;
                expect(res.body).to.have.eql({ message: 'Hello, World' });
            });
    });

    it('GET /test-invalid-route should return Not Found', () => {
        chai.request(app)
            .get('/invalid-route')
            .then((res: any) => {
                expect(res).to.have.status(404);
            });
    });
});