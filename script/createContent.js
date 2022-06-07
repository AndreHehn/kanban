/**
 * Returns a draggable "ticket" (div) with the content of the JSON-array.
 * 
 * @param {*} element is the content of the JSON ARRAY at defined index.
 * @returns HTML
 */
 function generateHtml(element, id) {
    return `
    <div class="card sub-card" draggable="true" ondragstart="startDrag(${id})" id="${id}">
    <div class="card-body">
        <h5 class="card-title priority${element['priority']}"> ${element['title']}</h5>
        <p class="card-text"> Assigned to: ${element['assigned']}</p>
        <div class="ticket-buttons">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeContent"
                onclick="pushValueToModal(${id})">edit</button>
            <button class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapse${id}"
                aria-expanded="false" aria-controls="collapseWidthExample" onclick="scrollToBottom(${id})">
                more
            </button>
        </div>
    </div>
    <div style="z-index:1;">
        <div class="collapse" id="collapse${id}">
            <div class="card card-body">
            ${element['content']}
            </div>
        </div>
    </div>
</div>`;
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