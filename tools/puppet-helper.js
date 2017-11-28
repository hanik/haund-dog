const puppeteer = require('puppeteer')
const collector = require('./element-collector')
// TODO variables occurred concurrency problem
let browser

async function _handleAuth(page, id, pw) {
    let user = 'nexshop'
    let pass = 'wearethe1'

    if (id) user = id
    if (pw) pass = pw
    const auth = new Buffer(`${user}:${pass}`).toString('base64')
    await page.setExtraHTTPHeaders({
        Authorization: `Basic ${auth}`,
    })
}

// TODO split for behavior
const screenshot = async function (handle, additionalOptions) {
    let options = {}
    if (!additionalOptions || !additionalOptions.path) {
        options = {path: `./screenshots/${handle.url().split('://')[1].split('/')[0]}.png`, fullPage: true}
    }
    options = Object.assign(options, additionalOptions)
    if (!handle) {
        console.error('Puppeteer error : need url or handle for screenshot.')
        return
    }
    try {
        await handle.screenshot(options)
    } catch (err) {
        console.error(`${err.toString()} : ${options.path}`)
    }
}

const getPage = async function (url, additionalOptions) {
    // TODO find and apply target page size
    let options = {
        headless: true,
        devtools: false,
        timeout: 30000,
        slowMo: 100,
        args: ['--window-size=1280,960'],
    }
    options = Object.assign(options, additionalOptions)
    if (!browser) browser = await puppeteer.launch(options)
    const pages = await browser.pages()
    const page = await pages[0]
    await _handleAuth(page)

    const viewport = {
        width: 1280,
        height: 720,
    }
    await page.setViewport(viewport)
    await page.goto(url)
    return page
}

const close = async function (page) {
    if (page) await page.close()
    if (browser) {
        await browser.close()
        browser = null
    }
}

const runAlone = async function (page, xpath, text, comment, action) {
    await page.evaluate((commentText) => {
        document.querySelector('#baund-dog-guidance').innerHTML = commentText
    }, comment)
    const handle = await collector.gethandle(page, xpath)
    await page.waitFor(1000)
    // TODO json
    if (action === 'input') {
        await handle.type(text)
    } else if (action === 'none') {
    } else {
        await handle.click()
    }
}

const runStep = async function (body, page) {
    const step = body.scenarioData
    const contents = Object.values(step.context)
    const commandIntent = step.intent
    let actionDescription

    console.log(`commandIntent : ${commandIntent}`)
    if (commandIntent.search('Click') >= 0) actionDescription = 'click'
    else if (commandIntent.search('Input') >= 0) actionDescription = 'input'
    else if (commandIntent.search('should') >= 0) actionDescription = 'should'
    else actionDescription = 'click'

    console.log(`actionDescription : ${actionDescription}`)

    const commandContext = {
        page,
        entities: step.entities,
        commandIntent,
        tag: step.tag,
        text: step.text,
        contents,
        from: contents[0],
        to: (contents[1]) ? contents[1] : null,
        action: actionDescription,
    }

    const recordedCase = {
        xpath: body.xpath,
        comment: commandContext.text,
        action: actionDescription,
        from: commandContext.from,
        to: commandContext.to,
    }

    return recordedCase
}

module.exports = {
    screenshot,
    getPage,
    close,
    runAlone,
    runStep,
}
