/*
element-collector.js for get elements from target page
 */
const pathmaker = require('./path-maker')

const gethandle = async function(page, xpath) {
    const resultHandle = await page.evaluateHandle(xpath => {
        console.log(xpath);
        let query = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return query.singleNodeValue;
    }, xpath)
    return resultHandle;
}

const grap = async function(page, text) {
    let path = pathmaker.getPath(text)

    const resultsHandle = await page.evaluateHandle(path => {
        let results = [];

        let query = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < query.snapshotLength; i++) {
            try{
                let el = query.snapshotItem(i);

                // Visable check
                let rect = el.getBoundingClientRect()
                if(rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0){
                    if(el.tagName) {
                        results.push(el)
                    }
                }
            } catch(error) {
                console.log(error.toString())
            }
        }
        return results;
    }, path);
    const properties = await resultsHandle.getProperties();
    const result = [];
    const releasePromises = [];
    for (const property of properties.values()) {
        const element = property.asElement();
        if (element)
            result.push(element);
        else
            releasePromises.push(property.dispose());
    }
    await Promise.all(releasePromises);
    return result;
}

module.exports = {
    gethandle,
    grap
}