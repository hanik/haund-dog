/**
 * users.spec.js
 */
const should = require('should')
const users = require('../routes/users')
const app = require('../app')
const httpMocks = require('node-mocks-http')

const req = httpMocks.createRequest({
    method: 'GET',
    url: '/',
    eventEmitter: require('events').EventEmitter,
})
const res = httpMocks.createResponse()

describe('Users', () => {
    it('should return the statusCode 200', () => {
    })

    it('should return user array', () => {
    })
})

// describe('Users Mock', function () {
//     it('should return the statusCode 200', function () {
//         users.getList(req, res);
//         res.statusCode.should.be.equal(200);
//     });
//
//     it('should return user array', function () {
//         users.getList(req, res);
//         JSON.parse(res._getData()).should.be.an.instanceOf(Array).and.have.a.lengthOf(2);
//     });
// })
