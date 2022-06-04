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

function generateHtml(element) {
let id= data.indexOf(element);
    return `<div draggable ="true" ondragstart="startDrag(${id})" class="subelement"> ${element['title']}</div>`;
}


function startDrag(id){
currentDrag = id;
console.log(id);
}


function allowDrop(ev) {
    ev.preventDefault();
}


function drop(category) {
data[currentDrag]['category'] = category;
updateHTML();
}