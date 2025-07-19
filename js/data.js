import { ConvertDate } from "./utils.js";

let db;
const tasksFragment = document.createDocumentFragment();
const tasksContainer = document.querySelector(".main-task-cards");
const screenOverlay = document.getElementById("screen-overlay")
const editTaskForm = document.querySelector(".edit-task-form");

const taskTitleInput = document.getElementById("new-task-title");
const taskDescriptionInput = document.getElementById("new-task-description");
const taskStatusInput = document.getElementById("new-task-status");

const editTitleInput = document.getElementById("edit-task-title");
const editDescriptionInput = document.getElementById("edit-task-description");
const editStatusInput = document.getElementById("edit-task-status");

function CreateDB() {

    const openRequest = window.indexedDB.open("tasks_db", 4);

    openRequest.addEventListener("error", () => {
        console.log("Database failed to open");
    })

    openRequest.addEventListener("success", () => {
        console.log("Database successfully opened");

        db = openRequest.result;
        console.log("Database connected:", db.name);

        //Initial card creation 
        CreateTaskCards();
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
        objectStore.createIndex("created", "created", { unique: true });

        console.log("Database setup complete")
    })
}

function ReadData(e) {

    let taskCreationDate = new Date();


    if (taskTitleInput.value.trim() === "") {
        console.log("Title cannot be empty");
        return;
    }

    const newTask = { "title": taskTitleInput.value.trim(), "body": taskDescriptionInput.value.trim(), "status": taskStatusInput.value.trim(), "created": taskCreationDate };

    const transaction = db.transaction(["tasks_os"], "readwrite");

    const objectStore = transaction.objectStore("tasks_os");

    const addRequest = objectStore.add(newTask);

    addRequest.addEventListener("success", function () {

        ClearNewTaskForm();

    })

    transaction.addEventListener("complete", function () {
        console.log("Transaction completed: database modification finished.");
    })

    tasksContainer.innerHTML = "";
    CreateTaskCards();
}


async function CreateTaskCards() {
    await iterateCursor();
    DisplayData();
    OpenEditTaskForm();
    DeleteBttnCard();
}

function iterateCursor() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("tasks_os");
        const objectStore = transaction.objectStore("tasks_os");
        const request = objectStore.openCursor(null, "prev");

        request.addEventListener("success", (e) => {
            const cursor = e.target.result;

            if (cursor) {
                const taskCardContainer = document.createElement("section");
                taskCardContainer.id = cursor.value.id;
                taskCardContainer.classList.add("task-card-container");

                const taskCard = document.createElement("article");
                taskCard.classList.add("task-card")
                taskCardContainer.appendChild(taskCard);


                const taskTitle = document.createElement("h3");
                taskTitle.innerText = cursor.value.title;
                taskTitle.classList.add("task-title");
                taskCard.appendChild(taskTitle);

                const taskDescription = document.createElement("p");
                taskDescription.innerText = cursor.value.body;
                taskDescription.classList.add("task-description");
                taskCard.appendChild(taskDescription);

                const taskStatus = document.createElement("a");
                taskStatus.innerText = cursor.value.status;
                taskStatus.classList.add("task-status");
                taskCard.appendChild(taskStatus);

                if (taskStatus.innerText === "Completed") {
                    taskCardContainer.classList.add("completed")
                }

                const taskCreated = document.createElement("a")
                taskCreated.innerText = ConvertDate(cursor.value.created)
                taskCreated.classList.add("task-date");
                taskCard.appendChild(taskCreated);


                const taskDeleteBttn = document.createElement("button");
                taskDeleteBttn.innerText = "delete";
                taskDeleteBttn.classList.add("card-delete-button");
                taskCard.appendChild(taskDeleteBttn);

                tasksFragment.appendChild(taskCardContainer);

                cursor.continue();
            } else {
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

function CloseNewTaskForm() {

    ReadData();

}

function ClearNewTaskForm() {

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskStatusInput.selectedIndex = 0;

}


function OpenEditTaskForm() {

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
            editStatusInput.value = task.querySelector(".task-status").innerText;

            screenOverlay.classList.remove("hidden");
        })
    })

}

function DeleteBttnCard() {
    const deleteBttns = document.querySelectorAll(".card-delete-button");


    deleteBttns.forEach((deleteBttn) => {
        deleteBttn.addEventListener("click", function (e) {
            e.stopPropagation();//Prevents event bubling to parent elements 
            DeleteTask(e);
        })
    })
}

function ClearEditTaskForm() {

    editTitleInput.value = "";
    editDescriptionInput.value = "";
    editStatusInput.selectedIndex = 0;

}


function CloseEditTaskForm() {

    editTaskForm.style.display = "none"
    screenOverlay.classList.add("hidden")

}


function DeleteTask(e) {

    let taskId = Number(e.target.parentNode.parentNode.getAttribute("id"));
    const currentTask = document.getElementById(taskId)


    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    const deleteRequest = objectStore.delete(taskId);

    transaction.addEventListener("complete", () => {
        
        currentTask.remove();
        CloseEditTaskForm();
        console.log(`Task with id:${taskId} was succesfully deleted`)
    });
}

function SaveEditTask(e) {

    const taskId = Number(e.target.parentNode.parentNode.getAttribute("id"));
      
    const transaction = db.transaction(["tasks_os"], "readwrite");
    const objectStore = transaction.objectStore("tasks_os");
    const requestTask = objectStore.get(taskId);

   requestTask.onsuccess = (e) => {
       
       const taskData = e.target.result;

       taskData.title = editTitleInput.value.trim();
       taskData.body = editDescriptionInput.value.trim();
       taskData.status = editStatusInput.value.trim();


       const updateTask = objectStore.put(taskData)

       updateTask.onsuccess = (e) => {
         console.log(`Task with id:${taskId} was succesfully updated`)
          const currentTaskCard = document.getElementById(taskId);
          currentTaskCard.querySelector(".task-title").innerText = taskData.title;
          currentTaskCard.querySelector(".task-description").innerText = taskData.body;
          currentTaskCard.querySelector(".task-status").innerText = taskData.status;
          CloseEditTaskForm();
       }
   }
}

export { CreateDB, ReadData, DisplayData, CloseNewTaskForm, ClearNewTaskForm, CloseEditTaskForm, DeleteTask, ClearEditTaskForm, SaveEditTask }