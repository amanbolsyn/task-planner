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

import { RetriveTasks } from "./data.js";

let lastSelectedFilter = null;
let lastSelectedOrder = null;
const searchForm = document.getElementById("search-form");
const newTaskForm = document.getElementById("new-task-form");
const editTaskForm = document.querySelector(".edit-task-form");

const searchInput = document.getElementById("search");
const statusOptions = document.querySelectorAll('input[name="task-status"]');
const sortOptions = document.querySelectorAll('input[name="sort-order"]');

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


  //preventing forms from submitting and reloding page by default 
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  newTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  editTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
  });


  searchInput.addEventListener("input", RetriveTasks);

  statusOptions.forEach((option) => {
    option.addEventListener("click", function() {
      if (lastSelectedFilter === this) {
        this.checked = false;
        lastSelectedFilter = null;
      } else {
        lastSelectedFilter = this;
      }
      RetriveTasks();
    })
  });

  sortOptions.forEach((option) => {

    option.addEventListener("click", function() {
      if (lastSelectedOrder === this) {
        this.checked = false;
        lastSelectedOrder = null;
      } else {
        lastSelectedOrder = this;
      }

      RetriveTasks();
    })
  })

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


