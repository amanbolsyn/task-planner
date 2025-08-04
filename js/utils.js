// This file mainly contains:
// 1) Functions that don't use data from IDB: 
// ThemeToggle(), ViewToggle(), BurgerMenuToggle(), DisplayView(), ScrollTop() and etc.


import { DisplayData } from "./data.js";
import { RetriveTasks } from "./data.js";

const viewToggleChkBx = document.getElementById("view-toggle");
const aside = document.querySelector(".aside")
const burgerMenuOverlay = document.getElementById("burger-menu-overlay");
const burgerMenuChkBox = document.getElementById("burger-menu-toggle");
let windowWidth

//Theme selection functionality 
function ThemeToggle() {

    const themeToggleChkBox = document.getElementById("theme-toggle");
    //gets theme preference from local storage
    const prefTheme = localStorage.getItem("theme-preference");

    //apply value from localStorage
    if (prefTheme === "true") {
        themeToggleChkBox.checked = true;
    } else {
        themeToggleChkBox.checked = false;
    }

    //triggers when checkbox value changes
    themeToggleChkBox.addEventListener("change", function () {
        //saves new value to localStorage
        localStorage.setItem("theme-preference", themeToggleChkBox.checked)
    })

}

//Task view(column or list) functionality
function ViewTasksToggle() {

    const taskWindow = document.querySelector(".main-task-cards");
    //gets theme preference from local storage
    const viewPref = localStorage.getItem("view-preference");

    //apply value from local storage
    if (viewPref === "true") {
        viewToggleChkBx.checked = true;
        taskWindow.classList.add("list-view")
    } else {
        viewToggleChkBx.checked = false;
        taskWindow.classList.add("column-view")
    }

    //initial calling of DisplayView
    //DisplayView calculates number of columns based on user selection and window width
    DisplayView(viewToggleChkBx.checked)


    //triggers when checkbox value changes
    viewToggleChkBx.addEventListener("change", function () {

        if (viewToggleChkBx.checked) {
            taskWindow.classList.remove("column-view")
            taskWindow.classList.add("list-view")
        } else {
            taskWindow.classList.remove("list-view")
            taskWindow.classList.add("column-view")
        }

        //saves new value to localStorage
        localStorage.setItem("view-preference", viewToggleChkBx.checked);

        //call DisplayView everytime when checkbox value changes
        DisplayView(viewToggleChkBx.checked)
    });

}

//
function BurgerMenuToggle() {

    const prefState = localStorage.getItem("burger-menu-preference");
    windowWidth = window.innerWidth;
    if (prefState === "true") {
        burgerMenuChkBox.checked = true;
        aside.classList.remove("burger-menu-inactive");

        if (windowWidth < 600) {
            burgerMenuOverlay.classList.remove("hidden");
        }

    } else {
        burgerMenuChkBox.checked = false;
        aside.classList.add("burger-menu-inactive");

        if (windowWidth < 600) {
            burgerMenuOverlay.classList.add("hidden");
        }

    }

    burgerMenuChkBox.addEventListener("change", function () {

        windowWidth = window.innerWidth;

        if (burgerMenuChkBox.checked) {

            aside.classList.remove("burger-menu-inactive");

            if (windowWidth < 600) {
                burgerMenuOverlay.classList.remove("hidden");
            }

        } else {
            aside.classList.add("burger-menu-inactive");

            if (windowWidth < 600) {
                burgerMenuOverlay.classList.add("hidden");
            }

        }

        //stores new value of burger menu checkbox when checkbox is triggered
        localStorage.setItem("burger-menu-preference", burgerMenuChkBox.checked);

        DisplayView(viewToggleChkBx.checked);
    })
}


//clsoe burger menu
function CloseBurgerMenu() {
    burgerMenuChkBox.checked = false; // convert checkbox value to false
    localStorage.setItem("burger-menu-preference", burgerMenuChkBox.checked); // store new checkbox value in localStorage
    aside.classList.add("burger-menu-inactive");// hide/close burger menu
    burgerMenuOverlay.classList.add("hidden"); // hide burger menu overlay
}


//Create New Task Form functionality
function CreateTaskForm() {

    const taskForm = document.getElementById("new-task-form")
    const errorMessageNewForm = document.getElementById("new-task-form-error");

    //make new task form active when user focuses on description input
    //opens up whole form
    taskForm.addEventListener("focusin", function () {
        taskForm.classList.add("new-task-form-active");
        taskForm.classList.remove("new-task-form-inactive");
    })

    //form disapperes when user focuses out form the the form 
    taskForm.addEventListener("focusout", function () {
        setTimeout(() => {
            if (!taskForm.contains(document.activeElement)) {
                taskForm.classList.remove("new-task-form-active");
                taskForm.classList.add("new-task-form-inactive");
                errorMessageNewForm.classList.add("hidden"); //hide error when user focusses out from the form
            }
        }, 0);
    })
}

function DisplayView(viewPref) {

    const taskWindow = document.querySelector(".main-task-cards");
    let numOfColumnns;
    windowWidth = window.innerWidth;

    if (viewPref === true) { //list view = 1 column
        numOfColumnns = 1;
    } else {
        if (windowWidth >= 600) {  // column view and medium/large screens = compute number of columns
            const taskWindowWidth = taskWindow.offsetWidth;
            numOfColumnns = Math.floor(taskWindowWidth / 300);
        } else { //columns view and small screens = 2 columns
            numOfColumnns = 2; //2 columns for small screens
        }
    }

    //update --columns global variable with calculated columns
    taskWindow.style.setProperty('--columns', numOfColumnns)

    DisplayData();
}

//converts date into readiable string
function ConvertDate(date) {

    let days = date.getDate();
    // let year = date.getFullYear().toString().slice(2);
    let month = date.toLocaleString("en-US", { month: "long" });


    function GetOrdinal(day) {
        if (day > 9) {
            day = day.toString().slice(1);
        }

        switch (day.toString()) {
            case "1": return "st";
            case "2": return "nd";
            case "3": return "rd";
            default: return "th";
        }
    }

    return `${month} ${days}${GetOrdinal(days)}`
}

//handles logic of scrool top button and header shodow styling
function ScrollTop() {

    const scrollTopBttn = document.getElementById("scroll-top");
    const header = document.querySelector(".header");


    window.addEventListener("scroll", function () { 
        if (document.documentElement.scrollTop > 400 || //user scolled more than 400 pixels 
            document.body.scrollTop > 400
        ) {
            //display scroll top button
            scrollTopBttn.style.display = "block";
        } else {
            //hide scroll top button
            scrollTopBttn.style.display = "none";
        }

        //if user scrolled down add header shadow styling to header element
        if((document.documentElement.scrollTop > 0 ||
            document.body.scrollTop > 0)){
                header.classList.add("header-shadow");
            } else {
               header.classList.remove("header-shadow");
            }
    });

    //scrools to top 
    scrollTopBttn.addEventListener("click", function () {
        scrollTo(0, 0);
    })
}

//helps to save web page state using urls
function UpdateURLState() {

    const searchValue = document.getElementById("search").value.trim();
    const selectedStatus = document.querySelector('input[name="task-status"]:checked')?.value;
    const sortValue = document.querySelector('input[name="sort-order"]:checked')?.value;

    const params = new URLSearchParams();

    if (searchValue) params.set("search", searchValue);
    if (selectedStatus) params.set("status", selectedStatus);
    if (sortValue) params.set("sort", sortValue);

    history.replaceState(null, "", "?" + params.toString());

}

//helps to save web page state using urls
function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    const search = params.get("search");
    const status = params.get("status");
    const sort = params.get("sort");

    if (search) document.getElementById("search").value = search;
    if (status)
        document.querySelector(`input[name="task-status"][value="${status}"]`)?.click();
    if (sort) document.querySelector(`input[name="sort-order"][value="${sort}"]`)?.click();

    RetriveTasks();
}
//fire DisplayView function everytime when windown resizes or loads 
//in order to calculate and update number of columns accrodingly 
window.addEventListener("resize", () => DisplayView(viewToggleChkBx.checked)); 
window.addEventListener("load", () => DisplayView(viewToggleChkBx.checked));

export { ThemeToggle, ViewTasksToggle, BurgerMenuToggle, CreateTaskForm, DisplayView, ConvertDate, ScrollTop, UpdateURLState, CloseBurgerMenu, loadStateFromURL };