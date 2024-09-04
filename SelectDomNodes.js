const unsubscribers = []
const getSelectdNodes = () => {
    console.log(unsubscribers)
    addEvents()
    const selection = document.getSelection()
    const range = selection.getRangeAt(0)
    // const position = computePosition(range)
    // if (position) {
    //     highlightSelectedRange(position)
    // }

    const rangeNodes = getRangeSelectedNodes(range, {filter: (node) => {
        if (node.nodeName === "TR" && node.getAttribute("id") !== null) {
           return true
        }
        return false
    }})

    unsubscribers.push(() => selection.removeAllRanges())
    return rangeNodes
}

function addEvents(params) {
    const handleScroll = () => {
        unsubscribers.forEach(item => item())
    }
    document.addEventListener("scroll", handleScroll)
    unsubscribers.push(() => {
        document.removeEventListener("scroll", handleScroll)
    })
}

function getRangeSelectedNodes(range, options) {
    let startNode = range.startContainer;
    let endNode = range.endContainer;

    let rangeNodes = [];
    while (startNode && startNode != endNode) {
        startNode = nextNode(startNode)
        rangeNodes.push(startNode);
    }

    if (options && "filter" in options && typeof options.filter === "function") {
        rangeNodes = rangeNodes.filter(options.filter)
    }

    return rangeNodes
}

function nextNode(node) {
    if (node.hasChildNodes()) {
        return node.firstChild;
    } else {
        while (node && !node.nextSibling) {
            node = node.parentNode;
        }
        if (!node) {
            return null;
        }
        return node.nextSibling;
    }
}

function computePosition({endContainer, startContainer}) {
    if (endContainer.nodeType === 3 && startContainer.nodeType === 3) {
        new Notification("Can't highlight selected range")
        return null
    }
    const endPostion = endContainer.getBoundingClientRect()
    const startPosition = startContainer.getBoundingClientRect()

    const position = {
        x: null,
        y: null,
        width: null,
        height: null
    }

    position.x = Math.round(startPosition.x)
    position.y = Math.round(startPosition.y + startPosition.height)
    position.width = Math.round((endPostion.x + endPostion.width) - startPosition.x)
    position.height = Math.round(endPostion.y - startPosition.y)

    return position
}

function highlightSelectedRange({x, y, height, width}) {
    const div = document.createElement("div")
    const style = {
        position: "fixed",
        top: y + "px",
        left: x + "px",
        width: width + "px",
        height: height + "px",
        border: "2px dashed blue"
    }
    Object.assign(div.style, style)
    document.body.appendChild(div)
    unsubscribers.push(() => {
        div.remove()
    })
}

function performMarkCheckbox(node) {
    const input = node.lastElementChild.querySelector("input")
    if (input) {
        input.checked = true
    }
}

const nodes = getSelectdNodes()
for (let node of nodes) {
    performMarkCheckbox(node)
}
