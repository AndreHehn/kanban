/**
 * Reads the JSON-array data and renders the elements in the according div.
 */
function updateHTML() {
    data.sort(function (a, b) {
        return a.timestamp - b.timestamp;
    });
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let column = data.filter(cat => cat['category'] == category);
        document.getElementById(category).innerHTML = '';
        for (let j = 0; j < column.length; j++) {
            let element = column[j];
            let id = data.indexOf(element);
            document.getElementById(category).innerHTML += generateHtml(element, id);
        }
    }
}

/**
 * awaits 50ms, so that the collapse can load. then scrolls to top
 * 
 * @param {*} id tell which ticket
 */
async function scrollToBottom(id) {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(50);
    document.getElementById('collapse' + id).scrollIntoView(true);
    temporaryId = id;
}

/**
 * Pushes the id  to the variable currentDrag for drop().
 * 
 * @param {*} id is the index of an element.
 */
function startDrag(id) {
    currentDrag = id;
}

/**
 * Standard W3-School function to allow Drop of a dragged element.
 * 
 * @param {*} ev event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * endarkens the card while ticket is dragged over
 * 
 * @param {*} id tells which card
 */
function endarken(id) {
    document.getElementById(id).classList.add('drag-over');
}

/**
 * changes card back to regualar.
 * 
 * @param {*} id tells which card
 */
function endarkenOff(id) {
    document.getElementById(id).classList.remove('drag-over');
}

/**
 * 
 * if collapse is open and is clicked on window, the collapse closes.
 */
 window.addEventListener('click', function () {
    if (temporaryId !== undefined) {
        document.getElementById('collapse' + temporaryId).classList.remove('show');
    };})
