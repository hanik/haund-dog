/*
path-maker.js for make xpath text for find target
 */

const getPath = function (text) {
    // let path = '//*[text()="' + text.trim() + '"]';
    let path = '//*[contains(text(), "' + text.trim() + '")]'
    path += '| //input[contains(@value, "' + text.trim() + '")]'
    path += '| //input[contains(@placeholder, "' + text.trim() + '")]'
    return path
}

module.exports = {
    getPath
}