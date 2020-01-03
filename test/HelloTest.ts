import 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

chai.use(require('chai-http'));

describe('Test hello controller', () => {

    it('should return say hello messge', () => {
        expect(1 + 1).eql(2);
    });

});
