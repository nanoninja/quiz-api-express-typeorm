import 'mocha';
import { server } from '../src/main';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { expect } from 'chai';

chai.use(chaiHttp);

const tearDown = () => server.close();

describe('API endpoint /', () => {
    after(tearDown);

    it('GET / should return "Hello, World"', async () => {
        const response = await chai.request(server).get('/');

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.have.eql({ message: 'Hello, World' });
    });

    it('GET /test-invalid-route should return Not Found', async () => {
        const response = await chai.request(server).get('/test-invalid-route');
        expect(response).to.have.status(404);
    });
});