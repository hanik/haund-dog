//http://192.168.30.80:5000/parse?query=Add 버튼을 클릭한다.
/*
컨텐츠 페이지에 접속한다.
Add 버튼을 클릭한다.
New playlist 메뉴를 클릭한다.
Playlist Name을 rosatest로 입력한다
Target Resolution 리스트 박스를 클릭한다
Target Resolution을 HD 가로로 클릭한다.
CREATE 버튼을 클릭한다

PlayList Name에 rosatest 나타난다
Target Resolution은 HD로 나타난다
Target Resolution은 가로로 보여진다
이미지 컨텐트를 Playlist로 드래그앤 드롭한다.
이미지 컨텐트가 Playlist에 보여진다
Playlist 목록 개수가 01로 표시된다
추가한 이미지 컨텐츠 재생시간은 30초로 나타난다
Save 버튼을 클릭한다

컨텐츠 페이지 목록에 rosatest가 나타난다.
 */
const request = require('request')
let resultList = []

function API_Call(query) {
    var OPTIONS = {
        headers: {'Content-Type': 'application/json'},
        url: null,
        body: null
    }
    let queryString = encodeURIComponent(query)
    const PORT = '5000'
    const BASE_PATH = '/parse'
    var HOST = 'http://192.168.30.80'
    let url = HOST + ':' + PORT + BASE_PATH + '?query=' + queryString
    request.get(url, function (err, res, result) {
        let json = JSON.parse(result)
        if(json['error code']==2000) {
            console.log('resultList.length : ' + resultList.length)
            console.log(JSON.stringify(resultList))
        } else {
            resultList.push(json)
            console.log(JSON.stringify(json) + ',')
        }
    })
}

const list = [
    '컨텐츠 페이지에 접속한다.',
    'Add 버튼을 클릭한다.',
    'New playlist 메뉴를 클릭한다.',
    'Playlist Name을 rosatest로 입력한다',
    'Target Resolution 텍스트를 클릭한다',
    'Target Resolution을 HD 가로로 클릭한다.',
    'CREATE 버튼을 클릭한다',
    'PlayList Name에 rosatest 나타난다',
    'Target Resolution은 HD로 나타난다',
    'Target Resolution은 가로로 보여진다',
    '이미지 컨텐트를 Playlist로 드래그앤 드롭한다.',
    '이미지 컨텐트가 Playlist에 보여진다',
    'Playlist 목록 개수가 01로 표시된다',
    '추가한 이미지 컨텐츠 재생시간은 30초로 나타난다',
    'Save 버튼을 클릭한다',
    '컨텐츠 페이지 목록에 rosatest가 나타난다.',
]

let get = function() {
    for(let i = 0 ; i <= list.length ; i++) {
        if(i === list.length) {
            API_Call(null)
            return;
        }
        API_Call(list[i])
    }
}

get()