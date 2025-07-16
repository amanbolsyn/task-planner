import { ThemeToggle } from "./utils.js";
import { ViewTasksToggle } from "./utils.js";
import { BurgerMenu } from "./utils.js";
import { CreateTaskForm } from "./utils.js";

import { CreateDB } from "./data.js";
import { ReadData } from "./data.js";

    
const closeFormBttn = document.getElementById("close-form-button");

document.addEventListener("DOMContentLoaded", () => {

    CreateDB();

    //View selection functionality 
    ViewTasksToggle();


    closeFormBttn.addEventListener("click", function () {

        ReadData();

    })


});

//Theme selection functionality 
ThemeToggle();

//Burger menu functionality for large window sizes
BurgerMenu();

CreateTaskForm();