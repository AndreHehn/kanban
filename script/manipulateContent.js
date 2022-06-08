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
function ifsForDrop(category, currentCategory, amountCategory) {
    if ((category == 'todo' || category == 'progress' || category == 'testing' || category == 'done') && amountCategory < maxTickets) {
        doDrop(category);
    }
    else if (category == 'backlog') { doDrop(category); }
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
 * pushes value to key oldCategory.
 * for restoring to the category the ticket was before trash or archive.
 */
function setNewVar() {
    data[currentDrag]["oldCategory"] = data[currentDrag]["category"];
}

/**
 * sends ticket to the previous category.
 */
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
        document.getElementById('closebutton').classList.add('d-none');
        document.getElementById('changeButton').setAttribute('onclick', `saveTicket('assign'+${currentDrag})`);
        let myModal = new bootstrap.Modal(document.getElementById("changeContent"), {});
        myModal.toggle();
    }
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
    document.getElementById('closebutton').classList.remove('d-none');
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