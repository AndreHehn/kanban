/**
 * 
 * Dringlichkeit hinzufügen (Farben)
 * 
 * Assigned to hinzufügen (nachdem man das aus backlog herausnimmt)
 * 
 * Erstellungsdatum hinzufügen
 * 
 * Deadline hinzufügen
 * 
 * Mülleimer
 * 
 */


let data = [
    {
        "title": "test1",
        "content": "blablabla1",
        "category": "backlog",
        "timestamp": 0,
        "priority": "high",
        "assigned": "no"
    },
    {
        "title": "test2",
        "content": "blablabla2",
        "category": "todo",
        "timestamp": 0,
        "priority": "high",
        "assigned": "no"
    },
    {
        "title": "test3",
        "content": "blablabla3",
        "category": "progress",
        "timestamp": 0,
        "priority": "high",
        "assigned": "no"
    },
    {
        "title": "test4",
        "content": "blablabla4",
        "category": "testing",
        "timestamp": 0,
        "priority": "high",
        "assigned": "no"
    },
    {
        "title": "test5",
        "content": "blablabla5",
        "category": "done",
        "timestamp": 0,
        "priority": "high",
        "assigned": "no"
    }
];

let categories = ['backlog', 'todo', 'progress', 'testing', 'done'];
let currentDrag;

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
            const element = column[j];
            document.getElementById(category).innerHTML += generateHtml(element);
        }
    }
}

/**
 * Returns a draggable "ticket" (div) with the content of the JSON-array.
 * 
 * @param {*} element is the content of the JSON ARRAY at defined index.
 * @returns HTML
 */
function generateHtml(element) {
    let id = data.indexOf(element);
    return `
    <div class="card sub-card" draggable ="true" ondragstart="startDrag(${id})">
        <div class="card-body">
            <h5 class="card-title priority${element['priority']}"> ${element['title']}</h5>
            <p class="card-text"> ${element['content']}</p>
            <p class="card-text"> Assigned to:${element['assigned']}</p>
            <div class="ticket-buttons">
            <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeContent" onclick="pushValueToModal(${id})">edit</a>
            <a href="#" class="btn btn-primary"  onclick="deleteTicket(${id})">delete</a></div>
        </div>
    </div>`;
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
 * Changes The content of the "category"-key.
 * refreshes the kanban-board.
 * 
 * @param {*} category is the id of the div in which the element is dropped.
 */
function drop(category) {
    let time = new Date().getTime();
    data[currentDrag]['category'] = category;
    data[currentDrag]['timestamp'] = time;
    updateHTML();
}

/**
 * saves content to array and refreshes page
 * 
 * @param {*} title id of textfield
 * @param {*} content id of textarea
 */
function newContent(title, content, priority, assigned) {
    let time = new Date().getTime();
    let newContent = {
        "title": title.value,
        "content": content.value,
        "category": "backlog",
        "timestamp": time,
        "priority": priority.value,
        "assigned": assigned.value
    }
    data.push(newContent);
    setBackForNewContent();
    updateHTML();
}

/**
 * sets back value of Modal to default.
 * 
 */
function setBackForNewContent(){
    document.getElementById('changeTitle').value = ``;
    document.getElementById('changeInnerContent').value = ``;
    document.getElementById('changeAssigned').value = `unassigned`;
    document.getElementById('changePriority').value = `low`;
}

/**
 * deletes ticket from page and array
 * 
 * @param {*} id tells which ticket
 */
function deleteTicket(id) {
    data.splice(id, 1);
    updateHTML();
}

/**
 * changes HTML elements of the modal
 * 
 * @param {*} id tells which ticket
 */
function pushValueToModal(id) {
    document.getElementById('changeButton').setAttribute('onclick', `saveTicket(${id})`);
    if (id !== undefined) {
        document.getElementById('changeTitle').value = `${data[id]['title']}`;
        document.getElementById('changeInnerContent').value = `${data[id]['content']}`;
        document.getElementById('changePriority').value = `${data[id]['priority']}`;
        document.getElementById('changeAssigned').value = `${data[id]['assigned']}`;
    }
}

/**
 * saves ticket to array and refreshes site
 * 
 * @param {*} id tells which tickelt
 */
function saveTicket(id) {
    let title = document.getElementById('changeTitle');
    let content = document.getElementById('changeInnerContent');
    let priority = document.getElementById('changePriority');
    let assigned = document.getElementById('changeAssigned');
    if (id == undefined) {
        newContent(title, content, priority, assigned);
    }
    else {
        editContent(title, content, priority, assigned, id);
    }
}

/**
 * edits Ticket
 * 
 * @param {*} title 
 * @param {*} content 
 * @param {*} priority 
 * @param {*} assigned document.getElementbyID....
 */
function editContent(title, content, priority, assigned, id) {
    data[id]['title'] = title.value;
    data[id]['content'] = content.value;
    data[id]['priority'] = priority.value;
    data[id]['assigned'] = assigned.value;
    document.getElementById('changeTitle').value = ``;
    document.getElementById('changeInnerContent').value = ``;
    document.getElementById('changeAssigned').value = `unassigned`;
    document.getElementById('changePriority').value = `low`;
    updateHTML();

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