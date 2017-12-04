const express = require('express')
const puppetHelper = require('../tools/puppet-helper')

const router = express.Router()

// TODO gaplant 로부터 받아야함
let url = process.env.url || 'http://52.78.181.46/'
let testCaseId = ''
let scenario = ''
let page = null

router.post('/', (req, res) => {
    console.log('baund-dog recorder post method')
    if (!req.body) return res.sendStatus(400)

    const requestBody = req.body
    const data = requestBody.testSteps
    if (requestBody.targetUrl) url = requestBody.targetUrl
    if (requestBody.testCaseId) testCaseId = requestBody.testCaseId
    if (requestBody.scenario) scenario = requestBody.scenario

    console.log(data)
    console.log(`data.length : ${data.length}`)

    return (async () => {
        const launchOptions = {
            headless: false,
        }
        page = await puppetHelper.getPage(url, launchOptions)
        await page.addScriptTag({
            path: './tools/injects/scripts.js',
        })

        await page.evaluate((inputScenario) => {
            scenarioData = inputScenario
        }, data)
        const result = 'on-going....'
        puppetHelper.resetRecords()
        return res.send(JSON.stringify(result))
    })()
})

router.post('/event', (req, res) => {
    const bodyMessage = req.body
    console.log(`bodyMessage : ${bodyMessage}`)
    return (async () => {
        await puppetHelper.runStep(bodyMessage, page)
        return res.send(JSON.stringify('step end.'))
    })()
})

router.get('/end', (req, res) => {
    console.log(puppetHelper.getRecords())
    res.send(JSON.stringify('끝났어 잘했어.'))
})

module.exports = router

/*
컨텐츠 페이지에 접속한다.
{"context": {"JKB": "컨텐츠 페이지"}, "entities": ["url", "브라우저 종류"], "intent": "Open Browser", "tag": "Open Browser", "text": "컨텐츠 페이지에 접속한다."}

Add 버튼을 클릭한다.
{"context": {"JKO": "add 버튼"}, "entities": ["[이벤트] 오브젝트"], "intent": "Click Element", "tag": "Click Element", "text": "add 버튼을 클릭한다."}

New playlist 메뉴를 선택한다.
Playlist Name을 rosatest로 입력한다
Target Resolution을 HD의 가로로 선택한다.
CREATE 버튼을 클릭한다
Playlist 페이지가 나타난다
PlayList Name에 rosatest가 나타난다
Target Resolution은 HD로 나타난다
Target Resolution은 가로로 나타난다
이미지 컨텐트를 Playlist로 드래그앤 드롭한다.
이미지 컨텐트가 Playlist에 나타난다
Playlist 목록 개수가 01로 표시된다
전체 재생 시간은 이미지 컨텐츠 재생시간과 동일하다
Save 버튼을 클릭한다
컨텐츠 페이지로 이동된다
컨텐츠 페이지 목록에 추가한 Playlist가 조회된다.
 */

/*
{
    "text": "컨텐츠 페이지에 접속한다.",
    "intent": "input text",
    "entities": [ { "entity": "[이벤트] 텍스트 입력 창" }, { "entity": "입력 할 텍스트" } ],
    "context":	[ { "JKB": "로그인 창" }, { "JKO": "rosatest" } ],
    "tag": "텍스트 입력(동사)",
    "xpath" : "path...."
}
 */

/*
add button : //*[@id="root"]/div/div[1]/div/div[2]/div[2]/div
text 가능 New playlist : //*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[6]
text 가능 Playlist Name : //*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/input
                input : rosatest
Target Resolution combo : //*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[2]/div/div[1]/label
Target Resolution : //*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[2]/div/div[2]/div[3]/div/div[1]
                HD, vertical
text 가능 CREATE : //*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[2]/div[1]
rosatest 페이지 : //*[@id="root"]/div/div[1]/div/div[1]/div[1]
Drag & Drop : ??????
Playlist 개수 : 01
        <div class="playlist-summary"><span class="playlist-summary__label">Counts</span><span class="playlist-summary__value">01</span><span class="playlist-summary__label">Total</span><span class="playlist-summary__value">00:00:30</span></div>
Save 버튼 : <div class="top-bar-sub-menu__item">SAVE</div>
            //*[@id="root"]/div/div[1]/div/div[1]/div[2]/div[2]
 */
