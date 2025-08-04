
// This file mainly contains:
// 1)IDB func: CreateDB, AddData,
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


//Opens and creates db in IDB
function CreateDB() {

    return new Promise((resolve, reject) => {

        const openRequest = window.indexedDB.open("tasks_db", 1);

        //failed to open db error with promise rejection
        openRequest.addEventListener("error", () => {
            console.error("Database failed to open:", openRequest.error);
            reject(new Error("Database failed to open"));
        })


        openRequest.addEventListener("success", async () => {
            console.log("Database successfully opened");

            db = openRequest.result;
            console.log("Database connected:", db.name);

            //populates dbTasks array with values form db
            await iterateCursor();
            //initial card creation using populated dbTasks array
            CreateTaskCards(dbTasks);
            resolve();

        })

        //database creation
        //runs ones at first and later when version of db is changed
        openRequest.addEventListener("upgradeneeded", (e) => {

            db = e.target.result;

            const objectStore = db.createObjectStore("tasks_os", {
                keyPath: "id", //primary key
                autoIncrement: true,
            });

            //taks model
            objectStore.createIndex("tittle", "title", { unique: false });//task title
            objectStore.createIndex("body", "body", { unique: false });//task description 
            objectStore.createIndex("status", "status", { unique: false });//task status
            objectStore.createIndex("position", "position", { unique: false })//task position in db. used for drag and drop feature
            objectStore.createIndex("created", "created", { unique: true });//task creation
            objectStore.createIndex("edited", "edited", { unique: false });//is taks previouly edited. values: true or false

            console.log("Database setup complete")
        })

    });
}


//adding new entry ot task_os db
async function AddTask() {


    //populating newTask object form new task form
    let taskCreationDate = new Date();

    const newTask = {
        "title": taskTitleInput.value.trim(),
        "body": taskDescriptionInput.value.trim(),
        "status": taskStatusInput.value.trim(),
        "position": 0,
        "created": taskCreationDate,
        "edited": false,
    };


    //error handelling for new tasks
    if (newTask.title === "") {
        errorMessageNewForm.innerText = "Tittle cannot be empty";
        errorMessageNewForm.classList.remove("hidden");
        return;
    }

    if (newTask.body.split("\n").length > 4) {
        errorMessageNewForm.innerText = "Line limit exceeded";
        errorMessageNewForm.classList.remove("hidden");
        return;
    }

    if (newTask.body.length > 200) {
        errorMessageNewForm.innerText = "Character limit exceeded";
        errorMessageNewForm.classList.remove("hidden");
        return;
    }

    //opening a transaction for read/write
    const transaction = db.transaction(["tasks_os"], "readwrite");

    transaction.addEventListener("error", function (e) {
        console.error("Transaction failed accessing 'tasks_os':", e.target.error)
    })

    const objectStore = transaction.objectStore("tasks_os");
    const countRequest = objectStore.count();//counts all etries in db

    countRequest.addEventListener("success", function () {

        newTask.position = Number(countRequest.result) + 1; //adds position entry to newTask object using count request reuslt
        // console.log("Total records in tasks_os:" + newTask.position)

        const addRequest = objectStore.add(newTask);//adding populated object to db

        addRequest.addEventListener("success", function () {
            ClearNewTaskForm();
            console.log("Task was successfully added")
        })

        addRequest.addEventListener("error", function () {
            console.error("Failed to add task:", addRequest.error);
        })

    })

    countRequest.addEventListener("error", function () {
        console.error("Failed to count records: " + countRequest.error);
    })

    transaction.addEventListener("complete", function () {
        console.log("Transaction completed: database modification finished.");
    })

    await iterateCursor();//populate dbTask array again after adding new entry
    errorMessageNewForm.classList.add("hidden");
    CreateTaskCards(dbTasks);//create task card from updated dbTasks array
}


//task card creation using dbTasks array values
function CreateTaskCards(tasksData) {

    tasksContainer.innerHTML = "";//emptying out prevous task cards inside container

    //display "no tasks to display" message if an array is empty 
    if (tasksData.length === 0) {
        CreateNoTaskMessage();
    } else {
        for (let i = 0; i < tasksData.length; i++) {

            //card containers
            const taskCardContainer = document.createElement("section");
            taskCardContainer.id = tasksData[i].id
            taskCardContainer.draggable = true;
            taskCardContainer.classList.add("task-card-container");

            const taskCard = document.createElement("article");
            taskCard.classList.add("task-card")
            taskCardContainer.appendChild(taskCard);

            //task checkbox. used for multiple selection feature
            taskCard.insertAdjacentHTML("beforeend", `
            <label class = "task-checkbox-label">
                <input type = "checkbox" class = "task-checkbox" name=${tasksData[i].id}>
        <svg class ="tooltip" width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#ffffff"/>
<path d="M17.0001 9L10 16L7 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span class = "tooltip-text">Select note</span></label>`)

            //task title element
            const taskTitle = document.createElement("h3");
            taskTitle.innerText = tasksData[i].title;
            taskTitle.classList.add("task-title");
            taskCard.appendChild(taskTitle);

            //task description element
            const taskDescription = document.createElement("p");
            taskDescription.innerText = tasksData[i].body;
            taskDescription.classList.add("task-description");
            taskCard.appendChild(taskDescription);

            //task bottom container element
            //holds task status selector, task date, delete button
            const cardBottomContainer = document.createElement("div");
            cardBottomContainer.classList.add("card-bottom-container");
            taskCard.appendChild(cardBottomContainer);

            //task status selector element
            cardBottomContainer.insertAdjacentHTML("beforeend", `      
        <select class="task-status" name="task-status" autofocus="off">
          <option value="Completed">Completed</option>
          <option value="In progress">In progress</option>
          <option value="Not started">Not started</option>
          <option value="On hold">On hold</option>
        </select>`)
            cardBottomContainer.querySelector(".task-status").value = tasksData[i].status;

            //checks for status and adds appropiate class to card container
            if (tasksData[i].status === "Completed") {
                taskCardContainer.classList.add("completed")
            }

            //task date element
            const taskCreated = document.createElement("a")

            if (tasksData[i].edited === true) { //checks if task was edited
                taskCreated.innerText = "Edited "
            }

            taskCreated.innerText += ConvertDate(tasksData[i].created);//converts date to convinient form
            taskCreated.classList.add("task-date");
            cardBottomContainer.appendChild(taskCreated);


            //task delete button element
            cardBottomContainer.insertAdjacentHTML("beforeend",
                `<svg  class = "card-delete-button tooltip" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.15" d="M18 18V6H6V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18Z" fill="#999999"/>
<path d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`)

            //tooltip for delete button 
            const deleteToolTip = document.createElement("span");
            deleteToolTip.innerText = "Delete";
            deleteToolTip.classList.add("tooltip-text")
            cardBottomContainer.appendChild(deleteToolTip);

            tasksFragment.appendChild(taskCardContainer);//appending all created tasks cards to fragment one by one

        }

    }

    //appends finished fragment to DOM
    DisplayData();

    //add events to elements in task card 
    SelectCardEvent(); //change status
    EditTaskFormEvent(); //edit task
    DeleteBttnEvent(); //delete task
    StatusSelectEvent(); //select card 
    ApplyDragEvent(); //drag task
}


//drag and drop event 
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

    //finds 
    let targetTask = e.target.closest("section[id]");
    targetTask.before(document.getElementById(draggedTaskId));

    ChangeTaskPositions();//chagnes and saves card positions

});

//chagnes and saves card positions
function ChangeTaskPositions() {

    const transaction = db.transaction(["tasks_os"], "readwrite");

    transaction.addEventListener("error", function (e) {
        console.error("Transaction failed accessing 'tasks_os':", e.target.error)
    })

    const objectStore = transaction.objectStore("tasks_os");
    const taskCards = document.querySelectorAll(".task-card-container");
    let positionNum = taskCards.length;

    //change positon of every card
    for (let i = 0; i < taskCards.length; i++) {
        //get task form db using id of the card
        const requestTask = objectStore.get(Number(taskCards[i].id));

        requestTask.addEventListener("success", function (e) {

            let taskData = e.target.result;
            taskData.position = positionNum;
            positionNum--;//decending order

            //update position
            const updatePosition = objectStore.put(taskData);

            updatePosition.addEventListener("error", function () {
                console.error("Failed to change task position:", updatePosition.error);
            })
        })

        requestTask.addEventListener("error", function () {
            console.error("Failed to retrive task data from db:", requestTask.error);
        })

        transaction.addEventListener("complete", function () {
            console.log("Task position was successfully changed");
        })
    }
}

//populates dbTasks array with values from db
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
                dbTasks.push(cursor.value)//pushes every entry to an array

                cursor.continue()
            } else {
                // No more entries — resolve the promise
                resolve();
            }
        });

        request.addEventListener("error", () => {
            console.error("Cursor failed:", request.error)
            reject(new Error("Cursor failed"));
        });
    });
}


function DisplayData() {
    tasksContainer.appendChild(tasksFragment);
}

//new task form button functons
function SaveNewTaskForm() {
    AddTask();
}

function ClearNewTaskForm() {

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskStatusInput.selectedIndex = 0;

}

//Dynamically checks textarea input
//Modify later
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

//handels edit form opening when clicking to task card
function EditTaskFormEvent() {

    const tasks = document.querySelectorAll(".task-card-container");
    const editTitleInput = document.getElementById("edit-task-title");
    const editDescriptionInput = document.getElementById("edit-task-description");
    const editStatusInput = document.getElementById("edit-task-status");

    tasks.forEach((task) => {
        //attach edit form opening ever to each card
        task.addEventListener("click", function () {

            editTaskForm.style.display = "block";
            editTaskForm.id = task.getAttribute("id")

            //populates edit form inputs with clicked card data
            editTitleInput.value = task.querySelector(".task-title").innerText;
            editDescriptionInput.value = task.querySelector(".task-description").innerText;
            editStatusInput.value = task.querySelector(".task-status").value;

            editOverlay.classList.remove("hidden");
        })
    })

}

//handels card delete event when clicking to delete button on a card
function DeleteBttnEvent() {
    const deleteBttns = document.querySelectorAll(".card-delete-button");

    //attaching clicking event to every delete button on a card
    deleteBttns.forEach((deleteBttn) => {
        deleteBttn.addEventListener("click", function (e) {
            e.stopPropagation();//Prevents event bubling to parent elements 
            DeleteTask(e);//fire delete function
        })
    })
}

//handels status change event when clicking to status selecter on a card
function StatusSelectEvent() {
    const statusSelects = document.querySelectorAll(".task-status");

    statusSelects.forEach((statusSelect) => {
        statusSelect.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevents event bubbling to parent elements
        });

        //attaching changing event to every status selecter on a card
        statusSelect.addEventListener("change", function (e) {
            SaveEditTask(e);//fires edit function
        })
    });
}

//
function SelectCardEvent() {

    const selectCheckBoxes = document.querySelectorAll(".task-checkbox-label");

    selectCheckBoxes.forEach((selectCheckBox) => {
        selectCheckBox.addEventListener("click", function (e) {
            e.stopPropagation();// Prevents event bubbling to parent elements
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


//edit forms button functions
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

    //retrives closest element with id attribute 
    let taskIdElement = e.target.closest("section[id], div[id]");
    let taskId = Number(taskIdElement.id);//retrives an id which is an id of task card

    const currentTask = document.getElementById(taskId)

    const transaction = db.transaction(["tasks_os"], "readwrite");

    transaction.addEventListener("error", function (e) {
        console.error("Transaction failed accessing 'tasks_os':", e.target.error)
    })

    const objectStore = transaction.objectStore("tasks_os");
    const deleteTask = objectStore.delete(taskId);//deletes task from db using id 

    //successfully deletes an entry
    deleteTask.addEventListener("success", async function () {

        currentTask.remove();//removes from DOM without refreshing webpage
        CloseEditTaskForm();
        await iterateCursor();//populates dbTasks array with updated db values

        if (dbTasks.length === 0) { //checks if deleted task is not the last in db
            //if no more entires in db show the appropriate message
            CreateNoTaskMessage();
            DisplayData();
        }

        console.log(`Task with id:${taskId} was succesfully deleted`)
    });

    deleteTask.addEventListener("error", function () {
        console.error(`Failed to delete the task with id:${taskId}:`, deleteTask.error);
    })

}

function SaveEditTask(e) {

    //retrives closest element with id attribute 
    let taskIdElement = e.target.closest("section[id], div[id]");
    let taskId = Number(taskIdElement.id);//retrives an id which is an id of task card

    const transaction = db.transaction(["tasks_os"], "readwrite");

    transaction.addEventListener("error", function (e) {
        console.error("Transaction failed accessing 'tasks_os':", e.target.error)
    })

    const objectStore = transaction.objectStore("tasks_os");
    const requestTask = objectStore.get(taskId);//gets task from db using id

    requestTask.addEventListener("success", function (e) {

        const taskData = e.target.result;

        //doesn't save anything even though "save" button was clicked because initail input values didn't change
        //it is needed for "edited" entry
        if (taskIdElement.tagName === "DIV") {
            if (taskData.title === editTitleInput.value.trim() && taskData.body === editDescriptionInput.value.trim() && taskData.status === editStatusInput.value.trim()) {
                CloseEditTaskForm();
                return;
            }

            //populating taskData object with inputs form edit form
            taskData.title = editTitleInput.value.trim();

            //error handelling for edited inputs
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


        //update current object with taskData object
        const updateTask = objectStore.put(taskData)

        updateTask.addEventListener("success", function () {

            //update task card without refreshing web page
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
            console.log(`Task with id:${taskId} was succesfully updated`)
        })

        updateTask.addEventListener("error", function () {
            console.error("Failed to update the task:", updateTask.error);
        })
    });
}

//handles searching, filtering and sorting in one function
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

    //status filtering logic
    const selectedStatus = document.querySelector('input[name="task-status"]:checked');
    if (selectedStatus) {
        for (let idx = processedTasks.length - 1; idx >= 0; idx--) {
            if (processedTasks[idx].status.toLowerCase() !== selectedStatus.value) {
                processedTasks.splice(idx, 1);
            }
        }
    }

    //sorting logic
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



//no task data message 
function CreateNoTaskMessage() {
    const noTaskMessage = document.createElement("h3");
    noTaskMessage.innerText = "No tasks to display";
    noTaskMessage.id = "no-tasks";
    tasksFragment.appendChild(noTaskMessage);
}



export { CreateDB, DisplayData, SaveNewTaskForm, ClearNewTaskForm, CloseEditTaskForm, DeleteTask, ClearEditTaskForm, SaveEditTask, RetriveTasks }