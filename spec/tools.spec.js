/**
 * tools.spec.js
 */
// const should = require('should')
const pathmaker = require('../tools/path-maker')

describe('path-maker', () => {
    it('should return xpath string.', () => {
        const xpath = pathmaker.getPath('pathText')
        xpath.should.be.containEql('pathText')
    })
})
