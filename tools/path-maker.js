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

const useJquery = async function (page) {
    let hasJquery = false
    try {
        let version = await page.evaluate(() => $.fn.jquery)
        hasJquery = true
    } catch (err) {
        console.log('The page has no jquery.')
    }

    if (!hasJquery) {
        console.log('Add jquery script tag')
        let scriptTagOption = {
            url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'
        }
        await page.addScriptTag(scriptTagOption)
    }
    return
}

module.exports = {
    getPath,
    useJquery
}