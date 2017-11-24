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

let baundDogGuidance = document.createElement('div');
baundDogGuidance.id = 'baund-dog-guidance';
baundDogGuidance.style.color = 'yellow';
baundDogGuidance.style.position = 'absolute';
baundDogGuidance.style.top = '0px';
baundDogGuidance.style.left = '0px';
baundDogGuidance.style.background = 'black';
baundDogGuidance.style.borderRadius = '6px';
baundDogGuidance.style.opacity = '0.6';
baundDogGuidance.style.padding = '30px 30px 20px 30px';
baundDogGuidance.style.fontSize = '80px';
document.getElementsByTagName('body')[0].appendChild(baundDogGuidance);

baundDogGuidance.addEventListener('mouseover', e => {
    if (baundDogGuidance.style.top === '0px') {
        baundDogGuidance.style.top = null;
        baundDogGuidance.style.bottom = '0px';
    } else {
        baundDogGuidance.style.top = '0px';
        baundDogGuidance.style.bottom = null;
    }
})

let onelement
let listener = e => {
    let xpath = getXPathForElement(this)
    let message = {
        type: 'bd-element-click',
        message: baundDogGuidance.innerText.replace(',', ''),
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
