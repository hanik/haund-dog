
function getXPathForElement(element) {
    const idx = (sib, name) => sib
        ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.querySelector(`#${elm.id}`) === elm
            ? [`id("${elm.id}")`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}

function getElementByXPath(path) {
    return (new XPathEvaluator()).evaluate(path, document.documentElement, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

let onelement
let listener = function (e) {
    let xpath = getXPathForElement(this)
    console.log(xpath)
    // e.stopPropagation() 
}
document.body.addEventListener("mousemove", e => {
    let x = e.clientX
    let y = e.clientY
    elementMouseIsOver = document.elementFromPoint(x, y)
    if (!elementMouseIsOver.isEqualNode(onelement)) {
        if (onelement) {
            onelement.style.border = "none"
        }
        onelement = elementMouseIsOver
        onelement.style.border = "2px solid blue"
        onelement.addEventListener("click", listener)
    }
})

