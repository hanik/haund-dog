var express = require('express')
const puppethelper = require('../tools/puppet-helper')
const collector = require('../tools/element-collector')
var router = express.Router()

let url = 'http://52.78.181.46/'
let id = 'nexshop'
let pw = 'wearethe1'

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Baund-dog'})
})

router.post('/', function (req, res, next) {
    console.log('post method')
    if (!req.body) return res.sendStatus(400)

    let data = req.body;
    console.log(data);

    (async () => {
        let page = await puppethelper.getPage(url);
        
        // inject script code for RECODING :-(
        await page.addScriptTag({
            path: './tools/injects/scripts.js'
        })

        page.on('console', msg => {
            console.log(msg.text)
        });

        let hasJquery = true
        try {
            let version = await page.evaluate(() => $.fn.jquery)
            hasJquery = true;
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

        //Add 버튼을 클릭한다.
        let xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[2]/div'
        let handle = await collector.gethandle(page, xpath)
        await handle.click()

        //New playlist 메뉴를 선택한다.
        xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[6]'
        handle = await collector.gethandle(page, xpath)
        await handle.click()

        //Playlist 이름을 rosatest로 입력한다
        xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/input'
        handle = await collector.gethandle(page, xpath)
        await handle.type('rosatest')

        //Target Resolution을 
        xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[2]/div/div[1]/label'
        handle = await collector.gethandle(page, xpath)
        await handle.click()

        //HD 가로로 선택한다.
        xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[1]/div[2]/div/div[2]/div[3]/div/div[1]'
        handle = await collector.gethandle(page, xpath)
        await handle.click()

        //CREATE 버튼을 클릭한다
        xpath = '//*[@id="root"]/div/div[1]/div/div[2]/div[4]/div/div[1]/div[2]/div/div[2]/div[1]'
        handle = await collector.gethandle(page, xpath)
        await handle.click()

        xpath = '//*[@id="root"]/div/div[1]/div/div[1]/div[1]'
        handle = await collector.gethandle(page, xpath)
        console.log(await handle.getProperty('textContent'))

        let result = []
        // const handles = await collector.grap(page, text);

        // if (handles.length > 0) {
        //     /* case one : dom search를 통해 원하는 텍스트가 1개이상 검색되었을때 */
        //     for (let i = 0; i < handles.length; i++) {
        //         try {
        //             // element snapshot capture
        //             let options = {path: './screenshots/result_' + i + '.png'};
        //             await puppethelper.screenshot(handles[i], options)

        //             // result 에는 해당 text 의 like 검색결과에 따른 ract 가 모두 들어감
        //             let bounds = await handles[i].boundingBox()
        //             let x = (bounds.x + bounds.width) / 2
        //             let y = (bounds.y + bounds.height) / 2
        //             result.push({'x': x, 'y': y})

        //             // tagname : handles[i]._remoteObject.description
        //             // bounding : handles[i].boundingBox()
        //         } catch (error) {
        //             console.log(error.toString(), handles[i].getProperties());
        //         }
        //     }
        // }

        await puppethelper.close(page)

        res.send(JSON.stringify(result))
    })();
})

module.exports = router;

//TODO 각 기능들 module.exports 해서 router 로 넣어주기
//TODO 각 기능들 export 할때 내부 소스코드들 export 해주기
//TODO module function 스타일 변경
//TODO async await excption handling 확인하기

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
