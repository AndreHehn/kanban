/**
 * Formular für neues Element erstellen
 * 
 * Element CSS
 * 
 * Überschrift
 * 
 * Löschfunktion
 * 
 * 
 */

let data = [
    {
        'title': 'test1',
        'content': 'blablabla1',
        'category': 'backlog'
    },
    {
        'title': 'test2',
        'content': 'blablabla2',
        'category': 'todo'
    },
    {
        'title': 'test3',
        'content': 'blablabla3',
        'category': 'progress'
    },
    {
        'title': 'test4',
        'content': 'blablabla4',
        'category': 'testing'
    },
    {
        'title': 'test5',
        'content': 'blablabla5',
        'category': 'done'
    }

];
let categories = ['backlog', 'todo', 'progress', 'testing', 'done'];
let currentDrag;

/**
 * Reads the JSON-array data and renders the elements in the according div.
 */
function updateHTML() {
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
            <h5 class="card-title"> ${element['title']}</h5>
            <p class="card-text"> ${element['content']}</p>
            <a href="#" class="btn btn-primary">edit delete</a>
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
    data[currentDrag]['category'] = category;
    updateHTML();
}