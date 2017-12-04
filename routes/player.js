const express = require('express')
const recorder = require('./recorder')
const puppethelper = require('../tools/puppet-helper')
const puppeteer = require('puppeteer')
const assert = require('assert');

const router = express.Router()

const url = process.env.url || 'http://52.78.181.46/'

let runArray = []
router.get('/', (req, res) => {
    (async () => {
        const launchoptions = {
            headless: false,
        }
        let page

        console.log(puppethelper.getRecords())
        runArray = puppethelper.getRecords()

        // TODO XPath list from somewhere kindof database
        runArray = getDemo()
        console.log(runArray)

        var Mocha = require('mocha')

        var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '')

        var mocha = new Mocha({
            timeout: 500000,
            bail: false,
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir: 'public/rosamiaTestResult',
                reportTitle: 'Testcase Result Scenario Name',
                reportPageTitle: 'Rosamia Test Result',
                reportFilename: `TESTRESULT_${utc}`,
                autoOpen: true,
            },
        })

        var suiteInstance = Mocha.Suite.create(mocha.suite, 'Test Suite')
        const Test = Mocha.Test

        suiteInstance.beforeAll('Open Browser', async () => {
            page = await puppethelper.getPage(url, launchoptions)
            await page.addScriptTag({
                path: './tools/injects/scripts.js',
            })
        })

        suiteInstance.afterAll('Close Browser', async () => {
            await puppethelper.close(page)
        })

        let isFailed = false
        for (let i = 0; i < runArray.length; i += 1) {
            const run = runArray[i]
            try {
                suiteInstance.addTest(new Test(`testing ${run.comment}`, async () => {
                    if (isFailed) assert.fail('Failed :: Because previous test step Failed!')
                    await puppethelper.runAlone(page, run.xpath, run.to, run.comment, run.action)
                }))
            } catch (error) {
                console.error(`runAlone ERROR:: ${error.message}`)
            }
        }

        mocha.run()
            .on('pass', () => {
                console.log('Test passed')
            })
            .on('fail', (test, err) => {
                console.log('Test fail')
                console.log(err.message)
                isFailed = true
            })

        const result = ['Success.']
        res.send(JSON.stringify(result))
    })()
})

function getDemo() {
    const demoArray = []
    // Add 버튼을 클릭한다.
    demoArray.push({
        xpath: 'id(\'root\')/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]',
        comment: 'Add 버튼을 클릭한다.',
        action: 'click',
    })
    // New playlist 메뉴를 선택한다.
    demoArray.push({
        xpath: 'id(\'root\')/div[1]/div[1]/div[1]/div[2]/div[4]/div[1]/div[6]',
        comment: 'New playlist 메뉴를 선택한다.',
        action: 'click',
    })
    // Playlist 이름을 rosatest로 입력한다
    demoArray.push({
        xpath: '//*[@id=\'root\']/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/input',
        comment: 'Playlist 이름을 rosatest로 입력한다',
        to: 'rosatest11111',
        action: 'type',
    })
    // Target Resolution을
    demoArray.push({
        xpath: '//*[@id=\'root\']/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[3]/div/div/label',
        comment: 'Target Resolution을',
        action: 'click',
    })
    // HD 가로로 선택한다.
    demoArray.push({
        xpath: '//*[@id=\'root\']/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[3]/div/div[2]/div[3]/div/div[1]',
        comment: 'HD 가로로 선택한다',
        action: 'click',
    })
    // CREATE 버튼을 클릭한다
    demoArray.push({
        xpath: '//*[@id=\'root\']/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[2]/div[1]',
        comment: 'CREATE 버튼을 클릭한다',
        action: 'click',
    })
    // Playlist 페이지가 나타난다
    demoArray.push({
        xpath: '//*[@id=\'root\']/div/div[1]/div/div[1]/div[1]',
        comment: 'Playlist 페이지가 나타난다',
        action: 'none',
    })
    return demoArray
}

module.exports = router
