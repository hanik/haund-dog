//TODO split for usecases

function getXPathForElement(element) {
    const idx = (sib, name) => sib
        ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.querySelector(`#${elm.id}`) === elm
            ? [`id('${elm.id}')`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}

function getElementByXPath(path) {
    return (new XPathEvaluator()).evaluate(path, document.documentElement, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

let styleClass = {
    color: 'yellow',
    position: 'absolute',
    top: '0px',
    left: '0px',
    background: 'black',
    borderRadius: '6px',
    opacity: '0.6',
    padding: '30px 30px 20px 30px',
    fontSize: '80px'
}
let baundDogGuidance = document.createElement('div')
baundDogGuidance.id = 'baund-dog-guidance'
Object.assign(baundDogGuidance.style, styleClass)
document.getElementsByTagName('body')[0].appendChild(baundDogGuidance)
baundDogGuidance.addEventListener('mouseover', e => {
    if (top === '0px') {
        top = null;
        bottom = '0px';
    } else {
        top = '0px';
        bottom = null;
    }
})

var myHeaders = new Headers();

var myInit = { method: 'POST',
               headers: myHeaders,
               cache: 'default' };

fetch('flowers.jpg', myInit).then(function(response) {
  return response.blob();
}).then(function(myBlob) {
  var objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});

let onelement
let listener = e => {
    let xpath = getXPathForElement(this)
    let message = {
        type: 'bd-element-click',
        message: baundDogGuidance.innerText.replace(',', ''),
        xpath: xpath
    }
    let url = 'http://localhost:8080/users'
    fetch(url, myInit).then(response => response.json()).then(data => console.log(data));
    
    console.log('bd-message::' + JSON.stringify(message))
}

document.body.addEventListener('mousemove', e => {
    let x = e.clientX
    let y = e.clientY
    let elementMouseIsOver = document.elementFromPoint(x, y)
    if (!elementMouseIsOver.isEqualNode(onelement)) {
        if (onelement) {
            onelement.style.border = 'none'
            onelement.removeEventListener('click', listener)
        }
        onelement = elementMouseIsOver
        onelement.style.border = '2px solid blue'
        onelement.addEventListener('click', listener)
    }
})
