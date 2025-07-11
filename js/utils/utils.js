
const viewToggleChkBx = document.getElementById("view-toggle");

//Theme selection functionality 
function ThemeToggle() {

    const themeToggleChkBox = document.getElementById("theme-toggle");

    //get 
    const prefTheme = localStorage.getItem("theme-preference");

    //check 
    if (prefTheme === "true") {
        themeToggleChkBox.checked = true;
    } else {
        themeToggleChkBox.checked = false;
    }

    themeToggleChkBox.addEventListener("change", function () {
        localStorage.setItem("theme-preference", themeToggleChkBox.checked)
    })

}

//Task view(column or list) functionality
function ViewTasksToggle() {

    const viewPref = localStorage.getItem("view-preference");

    const taskWindow = document.querySelector(".main-task-cards");

    if (viewPref === "true") {
        viewToggleChkBx.checked = true;
        taskWindow.classList.add("list-view")
    } else {
        viewToggleChkBx.checked = false;
        taskWindow.classList.add("column-view")
    }

    DisplayView(viewToggleChkBx.checked)

    viewToggleChkBx.addEventListener("change", function () {

        if (viewToggleChkBx.checked) {
            taskWindow.classList.remove("column-view")
            taskWindow.classList.add("list-view")
        } else {
            taskWindow.classList.remove("list-view")
            taskWindow.classList.add("column-view")
        }

        localStorage.setItem("view-preference", viewToggleChkBx.checked);

        DisplayView(viewToggleChkBx.checked)
    });

}


function DisplayView(viewPref) {

    const taskWindow = document.querySelector(".main-task-cards");
    let numOfColumnns;

    if (viewPref === true) {
        numOfColumnns = 1;
    } else {
        const windowWidth = taskWindow.offsetWidth;
        numOfColumnns = Math.floor(windowWidth / 300);
    }

    taskWindow.style.setProperty('--columns', numOfColumnns)

    taskWindow.innerHTML = "";

    for (let i = 0; i < numOfColumnns; i++) {
        const div = document.createElement("div");
        div.className = "column";
        div.innerText = `column ${i + 1}`;
        taskWindow.appendChild(div)
    }

}

function BurgerMenu() {

    const burgerMenuChkBox = document.getElementById("burger-menu-toggle");
    const prefState = localStorage.getItem("burger-menu-preference");

    const aside = document.querySelector(".aside")

    if (prefState === "true") {
        burgerMenuChkBox.checked = true;
        aside.classList.add("burger-menu-active");
        aside.classList.remove("burger-menu-inactive");
    } else {
        burgerMenuChkBox.checked = false;
        aside.classList.remove("burger-menu-active");
        aside.classList.add("burger-menu-inactive");

    }

    burgerMenuChkBox.addEventListener("change", function () {

        if (burgerMenuChkBox.checked) {
            aside.classList.add("burger-menu-active");
            aside.classList.remove("burger-menu-inactive");
        } else {
            aside.classList.remove("burger-menu-active");
            aside.classList.add("burger-menu-inactive");
        }

        //stores new value of burger menu checkbox when checkbox is triggered
        localStorage.setItem("burger-menu-preference", burgerMenuChkBox.checked);

         DisplayView(viewToggleChkBx.checked);
    })
}


function CreateTaskForm() {

    const taskForm = document.getElementById("new-task-form")
    const taskDescription = document.getElementById("task-description");
    const taskTitle = document.getElementById("task-tittle")

    taskForm.addEventListener("focusin", function () {
        taskForm.classList.add("task-form-active");
        taskForm.classList.remove("task-form-inactive");

        // console.log(taskDescription.contains(document.activeElement) , taskTitle.contains(document.activeElement));
    })

    taskForm.addEventListener("focusout", function () {
        setTimeout(() => {
            if (!taskForm.contains(document.activeElement)) {
                taskForm.classList.remove("task-form-active");
                taskForm.classList.add("task-form-inactive");

            }
        }, 0);
    })
}

window.addEventListener("resize", () => DisplayView(viewToggleChkBx.checked));
window.addEventListener("load", () => DisplayView(viewToggleChkBx.checked));

export { ThemeToggle, ViewTasksToggle, BurgerMenu, CreateTaskForm, DisplayView };