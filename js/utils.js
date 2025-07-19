import { DisplayData } from "./data.js";


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

    taskForm.addEventListener("focusin", function () {
        taskForm.classList.add("new-task-form-active");
        taskForm.classList.remove("new-task-form-inactive");
    })

    taskForm.addEventListener("focusout", function () {
        setTimeout(() => {
            if (!taskForm.contains(document.activeElement)) {
                taskForm.classList.remove("new-task-form-active");
                taskForm.classList.add("new-task-form-inactive");
            }
        }, 0);
    })
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

    DisplayData();
    
}


function ConvertDate(date){

    let days = date.getDate();
    // let year = date.getFullYear().toString().slice(2);
    let month = date.toLocaleString("en-US", {month: "long"});


    function GetOrdinal(day) {
        if(day>9) {
            day = day.toString().slice(1);
        }

        switch(day){
            case "1": return "st";
            case "2": return "nd";
            case "3": return "rd";
            default: return "th";
        }
    }

    return `${month} ${days}${GetOrdinal(days)}`
}

window.addEventListener("resize", () => DisplayView(viewToggleChkBx.checked));
window.addEventListener("load", () => DisplayView(viewToggleChkBx.checked));

export { ThemeToggle, ViewTasksToggle, BurgerMenu, CreateTaskForm, DisplayView, ConvertDate };