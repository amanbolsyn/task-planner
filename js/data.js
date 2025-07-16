let db;
const tasksFragment = document.createDocumentFragment();
const tasksContainer = document.querySelector(".main-task-cards");


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

    let taskTitleInput = document.getElementById("new-task-title");
    let taskDescriptionInput = document.getElementById("new-task-description");
    let taskStatusInput = document.getElementById("new-task-status");
    let taskCreationDate = new Date();


    if(taskTitleInput.value.trim() === ""){
        console.log("title cannot be empty");
        return;
    }

    const newTask = { "title": taskTitleInput.value.trim(), "body": taskDescriptionInput.value.trim(), "status": taskStatusInput.value.trim(), "created": taskCreationDate };

    const transaction = db.transaction(["tasks_os"], "readwrite");

    const objectStore = transaction.objectStore("tasks_os");

    const addRequest = objectStore.add(newTask);

    addRequest.addEventListener("success", function () {

        taskTitleInput.value = "";
        taskDescriptionInput.value = "";
        taskStatusInput.selectedIndex = 0;

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
                

                const taskTitile = document.createElement("h3");
                taskTitile.innerText = cursor.value.title;
                taskCard.appendChild(taskTitile);

                const taskDescription = document.createElement("p");
                taskDescription.innerText = cursor.value.body;
                taskCard.appendChild(taskDescription);

                const taskStatus = document.createElement("a");
                taskStatus.innerText = cursor.value.status;
                taskCard.appendChild(taskStatus);

                if(taskStatus.innerText === "Completed") {
                    taskCardContainer.classList.add("completed")
                }

                const taskCreated = document.createElement("a")
                taskCreated.innerText = cursor.value.created;
                taskCreated.style.display = "none";
                taskCard.appendChild(taskCreated);


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

export { CreateDB, ReadData, DisplayData }