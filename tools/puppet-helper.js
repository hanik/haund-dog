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
  {
    "entities": [
      "[이벤트] 오브젝트"
    ],
    "intent": "Click Element",
    "tag": "Click Element",
    "text": "add 버튼을 클릭한다.",
    "context": {
      "JKO": "add 버튼"
    }
  },
  {
    "entities": [
      "[이벤트] 입력 창",
      "입력 할 텍스트"
    ],
    "intent": "Input Text",
    "tag": "Input Text",
    "text": "playlist name을 rosatest로 입력한다",
    "context": {
      "JKO": "playlist name",
      "JKB": "rosatest"
    }
  },

*/

let flag = false

async function wait(ms) {
    return new Promise((resolve, reject) => {
        let id = setInterval(() => {
            console.log('interval Flag : ' + flag)
            if(flag) {
                clearInterval(id)
                resolve()
            }
        }, ms)
    })
}

let currentStep = {}

const _setCurrentStep = function (step, page) {
    let contents = Object.values(step.context)
    let intent = step.intent
    let obj = {
        page : page,
        entities : step.entities,
        intent : intent,
        tag : step.tag,
        text : step.text,
        contents : contents,
        target : contents[0],
        input : (contents[1]) ? contents[1] : null,
        action : (intent.indexOf('Input')==0) ? 'type' : 'click'
    }
    currentStep = obj
}

pubsub.subscribe('CLICK', async function (msg, data) {
    // await runAlone(currentStep.page, data.xpath, currentStep.input, currentStep.text, currentStep.action)
    flag = true;
    console.log('flag : ' + flag)
})

const runStep = async function (step, page) {
    _setCurrentStep(step, page)

    await page.evaluate(text => {
        document.querySelector('#bound-dog-guidance').innerHTML = text;
    }, currentStep.text);

    await wait(1000)
    flag = false;
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