const puppeteer = require('puppeteer');
const collector = require('./element-collector');
const pubsub = require('pubsub-js')
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
    let options = {
        headless: true,
        devtools: false,
        // slowMo: 100,
        // timeout: 30000
    }
    options = await _addsignOptions(options, additionalOptions)
    if(!browser) browser = await puppeteer.launch(options)
    let page = await browser.newPage()
    await _handleAuth(page)

    let viewport = {
        width: 1280,
        height: 720
    }
    await page.setViewport(viewport)
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

const runAlone = async function (page, xpath, text, comment, action) {
    await page.evaluate(comment => {
        document.querySelector('#bound-dog-guidance').innerHTML = comment;
    }, comment);
    let handle = await collector.gethandle(page, xpath)
    await page.waitFor(1000)
    if(action === 'type') {
        await handle.type(text)
    } else if (action === 'none'){
    } else {
        await handle.click()
    }
}

/*
"entities": [
      "url",
      "브라우저 종류"
    ],
    "intent": "Open Browser",
    "tag": "Open Browser",
    "text": "컨텐츠 페이지에 접속한다.",
    "context": {
      "JKB": "컨텐츠 페이지"
    }
*/

async function wait(ms) {
    return new Promise((r, j) => {
        setTimeout(resolve => {
            pubsub.subscribe('CLICK', function( msg, data ){
                console.log(arguments)
                resolve();
            }, r)
        }, ms);
    })
}

const runStep = async function (step) {
    let entities = step.entities
    let intent = step.intent
    let tag = step.tag
    let text = step.text
    let contents = Object.values(step.context)

    console.log('=-=========settimeoutstart')
    //TODO WAIT COMMAND CLICK IN BROWSER
    // var wait = (ms) => new Promise((resolve, reject)=>setTimeout(resolve, ms))
    await wait(10000)
    // pubsub.subscribe('CLICK', function( msg, data ){
    //     console.log('====subscribe======')
    //     console.log(msg)
    //     console.log( data )
    // })

    console.log('=-=========23=2=423=4')
}

async function _addsignOptions (defaults, additional) {
    let options = defaults
    if(additional) {
        Object.assign(options, additional);
    }
    return options;
}
    
async function _handleAuth (page, id, pw) {
    let user = 'nexshop';
    let pass = 'wearethe1';

    if(id) user = id;
    if(pw) pass = pw;
    const auth = new Buffer(`${user}:${pass}`).toString('base64');
    await page.setExtraHTTPHeaders({
        'Authorization': `Basic ${auth}`
    });
    // page.on('request', request => console.log(`Request: ${request.resourceType}: ${request.url} (${JSON.stringify(request.headers)})`));
}

module.exports = {
    screenshot, 
    getPage, 
    close, 
    execOCR,
    runAlone,
    runStep
}