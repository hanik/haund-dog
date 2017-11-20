/**
 * tools.spec.js
 */
var should = require('should');
let pathmaker = require('../tools/path-maker')

describe('path-maker', function () {
    it('should return xpath string.', function () {
        let xpath = pathmaker.getPath('pathText')
        xpath.should.be.containEql('pathText')
    });
});
