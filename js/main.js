import { ThemeToggle } from "./utils/utils.js";
import { ViewTasksToggle } from "./utils/utils.js";
import { BurgerMenu } from "./utils/utils.js";
import { DisplayView } from "./utils/utils.js";
import { CreateTaskForm } from "./utils/utils.js";



document.addEventListener("DOMContentLoaded", ({


}));

//Theme selection functionality 
ThemeToggle();

//Burger menu functionality for large window sizes
BurgerMenu();

//View selection functionality 
ViewTasksToggle();

CreateTaskForm();