

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
            <p class="card-text"> Assigned to: ${element['assigned']}</p>
            <div class="ticket-buttons">
            <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeContent" onclick="pushValueToModal(${id})">edit</a>
            <a href="#" class="btn btn-primary"  onclick="showInfo(${id})">more</a></div>
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
function doDrop(category) {
    let time = new Date().getTime();
    data[currentDrag]['category'] = category;
    data[currentDrag]['timestamp'] = time;
    openModal(category);
    updateHTML();
}

/**
 * defines what happes after drop.
 * 
 * @param {*} category is the id of the div in which the element is dropped.
 * @returns 
 */
function drop(category) {
    let currentCategory = data[currentDrag]['category'];
    let amountCategory = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i]['category'] == category) {
            amountCategory++;
        }
    }
    ifsForDrop(category, currentCategory, amountCategory);
}


/**
 * 
 * @param {*} category is the id of the div in which the element is dropped.
 * @param {*} currentCategory is the id of the div from which the element is dropped.
 * @param {*} amountCategory is the amount of tickets the card has.
 */
function ifsForDrop(category, currentCategory, amountCategory){
    if ((category == 'todo' || category == 'progress' || category == 'testing' || category == 'done') && amountCategory < maxTickets) {
        doDrop(category);
    }
    else if ( category == 'backlog'){doDrop(category);}
    else if (category == 'delete') {
        deleteTicket(currentDrag);
    }
    else if (category == 'archive' && currentCategory !== "trash") {
        setNewVar();
        doDrop(category);
    }
    else if (category == 'trash' && currentCategory !== "archive") {
        setNewVar();
        doDrop(category);
    }
}

/**
 * pushes value to key oldCategory.
 */
function setNewVar() {
    data[currentDrag]["oldCategory"] = data[currentDrag]["category"];
}

function restore() {
    let nextCategory = data[currentDrag]["oldCategory"];
    drop(nextCategory);

}
/**
 * opens Modal to edit assignment
 * 
 * @param {*} category tells which category the ticket is beeing dropped
 */
function openModal(category) {
    if (category == 'backlog' || category == 'todo') {
        data[currentDrag]['assigned'] = 'unassigned';
    }
    else if (category == 'progress' || category == 'testing') {
        document.getElementById('modalTitle').classList.add('d-none');
        document.getElementById('labelPriority').classList.add('d-none');
        document.getElementById('changePriority').classList.add('d-none');
        document.getElementById('modalContent').classList.add('d-none');
        document.getElementById('changeButton').setAttribute('onclick', `saveTicket('assign'+${currentDrag})`);
        let myModal = new bootstrap.Modal(document.getElementById("changeContent"), {});
        myModal.toggle();
    }
}

/**
 * saves content to array and refreshes page
 * 
 * @param {*} title id of textfield
 * @param {*} content id of textarea
 */
function newContent(title, content, priority,) {
    let time = new Date().getTime();
    let newContent = {
        "title": title.value,
        "content": content.value,
        "category": "backlog",
        "timestamp": time,
        "priority": priority.value,
        "assigned": 'unassigned',
        "oldCategory": ""
    }
    data.push(newContent);
    setBackContent();
    updateHTML();
}

/**
 * sets back value of Modal to default.
 * 
 */
function setBackContent() {
    document.getElementById('changeTitle').value = ``;
    document.getElementById('changeInnerContent').value = ``;
    document.getElementById('changeAssigned').value = `unassigned`;
    document.getElementById('changePriority').value = `low`;
    document.getElementById('labelAssigned').classList.remove('d-none');
    document.getElementById('changeAssigned').classList.remove('d-none');
    document.getElementById('modalTitle').classList.remove('d-none');
    document.getElementById('labelPriority').classList.remove('d-none');
    document.getElementById('changePriority').classList.remove('d-none');
    document.getElementById('modalContent').classList.remove('d-none');
}

function moveToTrash(id) {
    data[id]['category'] = 'trash';
    updateHTML();
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
    else {
        document.getElementById('labelAssigned').classList.add('d-none');
        document.getElementById('changeAssigned').classList.add('d-none');
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
    ifForSaveTicket(title, content, priority, assigned, id);
}

/**
 * if check for saveticket
 * 
 * @param {*} title 
 * @param {*} content 
 * @param {*} priority 
 * @param {*} assigned value of textfields of modal
 * @param {*} id  
 */
function ifForSaveTicket(title, content, priority, assigned, id) {
    if (id == undefined) {
        newContent(title, content, priority);
    }
    else if (id.includes('assign')) {
        data[currentDrag]['assigned'] = assigned.value;
        setBackContent();
        updateHTML();
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

function showInfo(id) {
    // content (deadline, created on)


}