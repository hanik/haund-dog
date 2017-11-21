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

let boundDogGuidance = document.createElement('div');
boundDogGuidance.id = 'bound-dog-guidance';
boundDogGuidance.style.color = 'yellow';
boundDogGuidance.style.position = 'absolute';
boundDogGuidance.style.top = '0px';
boundDogGuidance.style.left = '0px';
boundDogGuidance.style.background = 'black';
boundDogGuidance.style.borderRadius = '6px';
boundDogGuidance.style.opacity = '0.6';
boundDogGuidance.style.padding = '30px 30px 20px 30px';
boundDogGuidance.style.fontSize = '80px';
document.getElementsByTagName('body')[0].appendChild(boundDogGuidance);

boundDogGuidance.addEventListener('mouseover', function (e) {
    if (boundDogGuidance.style.top === '0px') {
        boundDogGuidance.style.top = null;
        boundDogGuidance.style.bottom = '0px';
    } else {
        boundDogGuidance.style.top = '0px';
        boundDogGuidance.style.bottom = null;
    }
})

let onelement
let listener = function (e) {
    let xpath = getXPathForElement(this)
    let message = {
        type: 'bd-element-click',
        message: boundDogGuidance.innerText.replace(',', ''),
        xpath: xpath
    }
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
