/**
 * users.spec.js
 */
var should = require('should');
var users = require('../routes/users');
var app = require('../app');
var httpMocks = require('node-mocks-http');
req = httpMocks.createRequest({
    method: 'GET',
    url: '/',
    eventEmitter: require('events').EventEmitter
});
res = httpMocks.createResponse();

describe('Users', function () {
    it('should return the statusCode 200', function () {
    });

    it('should return user array', function () {
    });
});

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
