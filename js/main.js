import { ThemeToggle } from "./utils.js";
import { ViewTasksToggle } from "./utils.js";
import { BurgerMenu } from "./utils.js";
import { CreateTaskForm } from "./utils.js";

import { CreateDB } from "./data.js";
import { SaveNewTaskForm } from "./data.js";
import { ClearNewTaskForm } from "./data.js";

import { CloseEditTaskForm } from "./data.js";
import { DeleteTask } from "./data.js";
import { ClearEditTaskForm } from "./data.js";
import { SaveEditTask } from "./data.js";

import { RetreiveTasks } from "./data.js";

const searchInput = document.getElementById("search");
const statusFilter = document.querySelector(".status-filter");
const alphabetSort = document.querySelector(".alphabet-sort");
const dateSort = document.querySelector(".date-sort");

const clearNewFormBttn = document.getElementById("new-task-clear-button");
const saveNewFormBttn = document.getElementById("new-task-save-button");

const closeEditFormBttn = document.getElementById("edit-task-close-button");
const deleteTaskBttn = document.getElementById("delete-task-button");
const clearEditFormBttn = document.getElementById("edit-task-clear-button");
const saveEditFormBttn = document.getElementById("edit-task-save-button");

const screenOverlay = document.getElementById("screen-overlay");



document.addEventListener("DOMContentLoaded", () => {

  CreateDB();

  //View selection functionality 
  ViewTasksToggle();

  searchInput.addEventListener("input", RetreiveTasks);
  statusFilter.addEventListener("change", RetreiveTasks);
  alphabetSort.addEventListener("change", RetreiveTasks);
  dateSort.addEventListener("change", RetreiveTasks);


  saveNewFormBttn.addEventListener("click", SaveNewTaskForm);
  clearNewFormBttn.addEventListener("click", ClearNewTaskForm);

  closeEditFormBttn.addEventListener("click", CloseEditTaskForm);
  deleteTaskBttn.addEventListener("click", DeleteTask); //Delete task from edit 
  clearEditFormBttn.addEventListener("click", ClearEditTaskForm);
  saveEditFormBttn.addEventListener("click", SaveEditTask);

  screenOverlay.addEventListener("click", CloseEditTaskForm)

  CreateTaskForm();
});


//Theme selection functionality 
ThemeToggle();

//Burger menu functionality for large window sizes
BurgerMenu();


