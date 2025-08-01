
// This file mainly contains:
// 1)IDB func: CreateDB, 
// 2)New task/edit forms func: 
// 3)Search/Filter/Sort func: 


import { ConvertDate } from "./utils.js";

let db, dbTasks = [];
const tasksFragment = document.createDocumentFragment();
const tasksContainer = document.querySelector(".main-task-cards");
const editOverlay = document.getElementById("edit-screen-overlay")

const editTaskForm = document.querySelector(".edit-task-form");

const taskTitleInput = document.getElementById("new-task-title");
const taskDescriptionInput = document.getElementById("new-task-description");
const taskStatusInput = document.getElementById("new-task-status");

const editTitleInput = document.getElementById("edit-task-title");
const editDescriptionInput = document.getElementById("edit-task-description");
const editStatusInput = document.getElementById("edit-task-status");

const errorMessageEditForm = document.getElementById("edit-task-form-error");
const errorMessageNewForm = document.getElementById("new-task-form-error");

// 
function CreateDB() {

    return new Promise((resolve, reject) => {

        const openRequest = window.indexedDB.open("tasks_db", 1);

        openRequest.addEventListener("error", () => {
            console.log("Database failed to open");
            reject();
        })

        openRequest.addEventListener("success", async () => {
            console.log("Database successfully opened");

            db = openRequest.result;
            console.log("Database connected:", db.name);

            await iterateCursor();
            //Initial card creation 
            CreateTaskCards(dbTasks);
            resolve();
        })

        openRequest.addEventListener("upgradeneeded", (e) => {


            db = e.target.result;

            const objectStore = db.createObjectStore("tasks_os", {
                keyPath: "id",
                autoIncrement: true,
            });

            objectStore.createIndex("tittle", "title", { unique: false });
            objectStore.createIndex("body", "body", { unique: false });
            objectStore.createIndex("status", "status", { unique: false });
            objectStore.createIndex("position", "position", { unique: false })
            objectStore.createIndex("created", "created", { unique: true });
            objectStore.createIndex("edited", "edited", { unique: false });

            console.log("Database setup complete")
        })

    });
}

async function ReadData() {

    let taskCreationDate = new Date();

    const newTask = {
        "title": taskTitleInput.value.trim(),
        "body": taskDescriptionInput.value.trim(),
        "status": taskStatusInput.value.trim(),
        "position": 0,
        "created": taskCreationDate,
        "edited": false,
    };


    if (newTask.title === "") {
        errorMessageNewForm.innerText = "Tittle cannot be empty";
        errorMessageNewForm.classList.remove("hidden");
        return;
    }

    if (newTask.body.split("\n").length > 4) {
        errorMessageNewForm.innerText = "Line limit exceeded";
        errorMessageNewForm.classList.remove("hidden");
        return
    }

    if (newTask.body.length > 200) {
        errorMessageEditForm.innerText = "Character limit exceeded";
        errorMessageEditForm.classList.remove("hidden");
        return
    }

    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    const countRequest = objectStore.count();

    countRequest.onsuccess = () => {
        newTask.position = Number(countRequest.result) + 1;
        console.log("Total records in tasks_os: " + newTask.position)

        const addRequest = objectStore.add(newTask);

        addRequest.addEventListener("success", function () {
            ClearNewTaskForm();
        })

        //add error message. Crucial!
    }

    countRequest.onerror = () => {
        console.log("Failed to count records: " + countRequest.error);
    }


    transaction.addEventListener("complete", function () {
        console.log("Transaction completed: database modification finished.");
    })

    await iterateCursor();
    errorMessageNewForm.classList.add("hidden");
    CreateTaskCards(dbTasks);
}


function CreateTaskCards(tasksData) {

    tasksContainer.innerHTML = "";

    for (let i = 0; i < tasksData.length; i++) {
        const taskCardContainer = document.createElement("section");
        taskCardContainer.id = tasksData[i].id
        taskCardContainer.draggable = true;
        taskCardContainer.classList.add("task-card-container");

        const taskCard = document.createElement("article");
        taskCard.classList.add("task-card")
        taskCardContainer.appendChild(taskCard);



        taskCard.insertAdjacentHTML("beforeend", `
            <label class = "task-checkbox-label">
                <input type = "checkbox" class = "task-checkbox" name=${tasksData[i].id}>
        <svg class ="tooltip" width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#ffffff"/>
<path d="M17.0001 9L10 16L7 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span class = "tooltip-text">Select note</span></label>`)


        const taskTitle = document.createElement("h3");
        taskTitle.innerText = tasksData[i].title;
        taskTitle.classList.add("task-title");
        taskCard.appendChild(taskTitle);

        const taskDescription = document.createElement("p");
        taskDescription.innerText = tasksData[i].body;
        taskDescription.classList.add("task-description");
        taskCard.appendChild(taskDescription);


        const cardBottomContainer = document.createElement("div");
        cardBottomContainer.classList.add("card-bottom-container");
        taskCard.appendChild(cardBottomContainer);

        // const taskStatus = document.createElement("a");
        // taskStatus.innerText = tasksData[i].status
        // taskStatus.classList.add("task-status");
        // cardBottomContainer.appendChild(taskStatus);


        cardBottomContainer.insertAdjacentHTML("beforeend", `      
        <select class="task-status" name="task-status" autofocus="off">
          <option value="Completed">Completed</option>
          <option value="In progress">In progress</option>
          <option value="Not started">Not started</option>
          <option value="On hold">On hold</option>
        </select>`)
        cardBottomContainer.querySelector(".task-status").value = tasksData[i].status;
        if (tasksData[i].status === "Completed") {
            taskCardContainer.classList.add("completed")
        }

        const taskCreated = document.createElement("a")

        if (tasksData[i].edited === true) {
            taskCreated.innerText = "Edited "
        }

        taskCreated.innerText += ConvertDate(tasksData[i].created);


        taskCreated.classList.add("task-date");
        cardBottomContainer.appendChild(taskCreated);


        // const taskDeleteBttn = document.createElement("button");
        // taskDeleteBttn.innerText = "delete";
        // taskDeleteBttn.classList.add("card-delete-button");
        // taskCard.appendChild(taskDeleteBttn);

        cardBottomContainer.insertAdjacentHTML("beforeend",
            `<svg  class = "card-delete-button tooltip" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.15" d="M18 18V6H6V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18Z" fill="#999999"/>
<path d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`)

        const deleteToolTip = document.createElement("span");
        deleteToolTip.innerText = "Delete";
        deleteToolTip.classList.add("tooltip-text")
        cardBottomContainer.appendChild(deleteToolTip);

        tasksFragment.appendChild(taskCardContainer);

    }

    DisplayData();
    SelectCardEvent();
    EditTaskFormEvent();
    DeleteBttnEvent();
    StatusSelectEvent();
    ApplyDragEvent();
}

function ApplyDragEvent() {
    const taskCards = document.querySelectorAll(".task-card-container");

    taskCards.forEach((taskCard) => {
        taskCard.addEventListener("dragstart", function (e) {
            // Add the target element's id to the data transfer object
            e.dataTransfer.setData("application/my-app", e.target.id);
            e.dataTransfer.effectAllowed = "move";
        })
    })
}

tasksContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"
})

tasksContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const draggedTaskId = e.dataTransfer.getData("application/my-app");

    let targetTask = e.target.closest("section[id]");
    targetTask.before(document.getElementById(draggedTaskId));

    ChangeTaskPositions();

});


function ChangeTaskPositions() {
    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    const taskCards = document.querySelectorAll(".task-card-container");
    let positionNum = taskCards.length;

    for (let i = 0; i < taskCards.length; i++) {

        const requestTask = objectStore.get(Number(taskCards[i].id));

        requestTask.onsuccess = (e) => {

            let taskData = e.target.result;
            taskData.position = positionNum;
            positionNum--;


            const updatePosition = objectStore.put(taskData);

            updatePosition.onsuccess = () => {
                console.log("")
            }

        }
    }

}

function iterateCursor() {
    dbTasks = [];

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("tasks_os");
        const objectStore = transaction.objectStore("tasks_os");
        const positionIndex = objectStore.index("position");

        const request = positionIndex.openCursor(null, "prev");

        request.addEventListener("success", (e) => {
            const cursor = e.target.result;

            if (cursor) {
                dbTasks.push(cursor.value)

                cursor.continue()
            } else {

                if(dbTasks.length === 0){
                    console.log("No entries in db")
                }
                // No more entries — resolve the promise
                resolve();
            }
        });

        request.addEventListener("error", () => {
            reject("Cursor failed");
        });
    });
}


function DisplayData() {
    tasksContainer.appendChild(tasksFragment);
}

function SaveNewTaskForm() {
    ReadData();
}

function ClearNewTaskForm() {

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskStatusInput.selectedIndex = 0;

}




//Dynamically check textarea input
// function CheckDescriptionLimit(e){

//     let isValid;
//     let descriptionIinput =  e.target.value
//     let form = e.target.closest("form");
//     let errorMessage = form.querySelector(".error");
//     let numOfLines = descriptionIinput.split('\n');

//     if(numOfLines.length > 4) {
//         errorMessage.innerText = "Line limit excedeed";
//         errorMessage.classList.remove("hidden");
//         return isValid = false
//     } else {
//         errorMessage.innerText = "";   
//         errorMessage.classList.add("hidden");
//         return isValid = true;
//     }
// }


function EditTaskFormEvent() {

    const tasks = document.querySelectorAll(".task-card-container");
    const editTitleInput = document.getElementById("edit-task-title");
    const editDescriptionInput = document.getElementById("edit-task-description");
    const editStatusInput = document.getElementById("edit-task-status");


    tasks.forEach((task) => {
        task.addEventListener("click", function () {

            editTaskForm.style.display = "block";
            editTaskForm.id = task.getAttribute("id")

            editTitleInput.value = task.querySelector(".task-title").innerText;
            editDescriptionInput.value = task.querySelector(".task-description").innerText;
            editStatusInput.value = task.querySelector(".task-status").value;

            editOverlay.classList.remove("hidden");
        })
    })

}

function DeleteBttnEvent() {
    const deleteBttns = document.querySelectorAll(".card-delete-button");


    deleteBttns.forEach((deleteBttn) => {
        deleteBttn.addEventListener("click", function (e) {
            e.stopPropagation();//Prevents event bubling to parent elements 
            DeleteTask(e);
        })
    })
}

function StatusSelectEvent() {
    const statusSelects = document.querySelectorAll(".task-status");

    statusSelects.forEach((statusSelect) => {
        statusSelect.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevents event bubbling to parent elements
        });

        statusSelect.addEventListener("change", function (e) {
            SaveEditTask(e);
        })
    });
}

function SelectCardEvent() {

    const selectCheckBoxes = document.querySelectorAll(".task-checkbox-label");

    selectCheckBoxes.forEach((selectCheckBox) => {
        selectCheckBox.addEventListener("click", function (e) {
            e.stopPropagation();
        })

        selectCheckBox.addEventListener("change", function (e) {

            const currentTaskCard = e.target.closest("section[id]")

            if (e.target.checked === true) {
                currentTaskCard.classList.add("selected-card");
                selectCheckBox.style.display = "block";
            } else {
                currentTaskCard.classList.remove("selected-card");
                selectCheckBox.removeAttribute("style");
            }
        })
    })
}

function ClearEditTaskForm() {

    editTitleInput.value = "";
    editDescriptionInput.value = "";
    editStatusInput.selectedIndex = 0;

    errorMessageEditForm.classList.add("hidden");

}


function CloseEditTaskForm() {

    editTaskForm.style.display = "none";
    editOverlay.classList.add("hidden");
    errorMessageEditForm.classList.add("hidden");

}


function DeleteTask(e) {

    let taskIdElement = e.target.closest("section[id], div[id]");
    let taskId = Number(taskIdElement.id);

    const currentTask = document.getElementById(taskId)

    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    objectStore.delete(taskId);

    transaction.addEventListener("complete", async () => {

        currentTask.remove();
        CloseEditTaskForm();
        await iterateCursor();
        console.log(`Task with id:${taskId} was succesfully deleted`)

    });
}

function SaveEditTask(e) {


    let taskIdElement = e.target.closest("section[id], div[id]");
    let taskId = Number(taskIdElement.id);

    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    const requestTask = objectStore.get(taskId);

    requestTask.onsuccess = (e) => {

        const taskData = e.target.result;



        if (taskIdElement.tagName === "DIV") {
            if (taskData.title === editTitleInput.value.trim() && taskData.body === editDescriptionInput.value.trim() && taskData.status === editStatusInput.value.trim()) {
                CloseEditTaskForm();
                return
            }

            taskData.title = editTitleInput.value.trim();

            if (taskData.title === "") {
                errorMessageEditForm.innerText = "Tittle cannot be empty";
                errorMessageEditForm.classList.remove("hidden");
                return
            }

            taskData.body = editDescriptionInput.value.trim();

            if (taskData.body.length > 200) {
                errorMessageEditForm.innerText = "Character limit exceeded";
                errorMessageEditForm.classList.remove("hidden");
                return
            }

            if (taskData.body.split("\n").length > 4) {
                errorMessageEditForm.innerText = "Description line limit exceeded";
                errorMessageEditForm.classList.remove("hidden");
                return
            }

            taskData.status = editStatusInput.value;

        } else {

            taskData.status = taskIdElement.querySelector(".task-status").value;
        }


        taskData.created = new Date();
        taskData.edited = true;


        const updateTask = objectStore.put(taskData)

        updateTask.onsuccess = () => {

            console.log(`Task with id:${taskId} was succesfully updated`)
            const currentTaskCard = document.getElementById(taskId);
            currentTaskCard.querySelector(".task-title").innerText = taskData.title;
            currentTaskCard.querySelector(".task-description").innerText = taskData.body;
            currentTaskCard.querySelector(".task-status").value = taskData.status;
            currentTaskCard.querySelector(".task-date").innerText = `Edited ${ConvertDate(taskData.created)}`;


            if (taskData.status === "Completed") {
                currentTaskCard.classList.add("completed")
            } else {
                currentTaskCard.classList.remove("completed")
            }

            CloseEditTaskForm();
        }
    }
}


function RetriveTasks() {

    let processedTasks = [...dbTasks]
    const searchStr = document.getElementById("search").value.trim().toLowerCase();

    //search logic
    //finding matched article titles by searching from search input
    for (let idx = processedTasks.length - 1; idx >= 0; idx--) {
        if (processedTasks[idx].title.toLowerCase().search(searchStr) === -1) {
            processedTasks.splice(idx, 1);
        }
    }

    const selectedStatus = document.querySelector('input[name="task-status"]:checked');
    if (selectedStatus) {
        for (let idx = processedTasks.length - 1; idx >= 0; idx--) {
            if (processedTasks[idx].status.toLowerCase() !== selectedStatus.value) {
                processedTasks.splice(idx, 1);
            }
        }
    }

    const selectedOrder = document.querySelector('input[name="sort-order"]:checked');

    if (selectedOrder) {
        if (selectedOrder.value === "a-z") {
            processedTasks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedOrder.value === "z-a") {
            processedTasks.sort((a, b) => b.title.localeCompare(a.title));
        } else if (selectedOrder.value === "newest") {
            processedTasks.sort((a, b) => new Date(b.created) - new Date(a.created));
        } else if (selectedOrder.value === "oldest") {
            processedTasks.sort((a, b) => new Date(a.created) - new Date(b.created));
        }
    }

    CreateTaskCards(processedTasks);
}



export { CreateDB, ReadData, DisplayData, SaveNewTaskForm, ClearNewTaskForm, CloseEditTaskForm, DeleteTask, ClearEditTaskForm, SaveEditTask, RetriveTasks }