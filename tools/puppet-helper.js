const puppeteer = require('puppeteer');
const jsdom = require('jsdom'); 
let browser;

const screenshot = async function (handle, additionalOptions) {
    let options = {}
    if(!additionalOptions || !additionalOptions.path) {
        options = {path: './screenshots/' + handle.url().split('://')[1].split('/')[0] + '.png', fullPage:  true};
    }
    options = await _addsignOptions(options, additionalOptions)
    if(!handle) {
        console.error('Puppeteer error : need url or handle for screenshot.')
        return;
    }
    try {
        await handle.screenshot(options)
    } catch (err) {
        // console.error(err.toString() + ' : ' + options.path)
    }
}

const getPage = async function (url, additionalOptions) {
    let options = {headless:false, devtools: false}
    options = await _addsignOptions(options, additionalOptions)
    if(!browser) browser = await puppeteer.launch(options)
    let page = await browser.newPage()
    await _handleAuth(page)    
    await page.goto(url)
    return page
}
    
const close = async function (page) {
    if(page) await page.close()
    if(browser) {
        await browser.close()
        browser = null;
    }
    return;
}
    
const execOCR = async function (cmd){
    const execSync = require('child_process').execSync;
    execSync(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log(`err: ${err}`);
            return;
        }
    });
}
    
async function _addsignOptions (defaults, additional) {
    let options = defaults
    if(additional) {
        Object.assign(options, additional);
    }
    return options;
}
    
async function _handleAuth (page) {
    const user = 'nexshop';
    const pass = 'wearethe1';
    
    const auth = new Buffer(`${user}:${pass}`).toString('base64');
    await page.setExtraHTTPHeaders({
        'Authorization': `Basic ${auth}`
    });
    page.on('request', request => console.log(`Request: ${request.resourceType}: ${request.url} (${JSON.stringify(request.headers)})`));
}

module.exports = {
    screenshot, 
    getPage, 
    close, 
    execOCR
}
