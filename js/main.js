import { ThemeToggle } from "./utils.js";
import { ViewTasksToggle } from "./utils.js";
import { BurgerMenuToggle } from "./utils.js";
import { CreateTaskForm } from "./utils.js";
import { ScrollTop } from "./utils.js";
import { UpdateURLState } from "./utils.js";
import { CloseBurgerMenu } from "./utils.js";
import { loadStateFromURL } from "./utils.js";

import { CreateDB } from "./data.js";
import { SaveNewTaskForm } from "./data.js";
import { ClearNewTaskForm } from "./data.js";

import { DeleteSelectedTasks } from "./data.js";
import { ChangeStatusSelected } from "./data.js";

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

const deleteSelectedBttn = document.getElementById("delete-selected")
const headerStatusSelecter = document.getElementById("header-status-selecter")

const clearNewFormBttn = document.getElementById("new-task-clear-button");
const saveNewFormBttn = document.getElementById("new-task-save-button");

const closeEditFormBttn = document.getElementById("edit-task-close-button");
const deleteTaskBttn = document.getElementById("delete-task-button");
const clearEditFormBttn = document.getElementById("edit-task-clear-button");
const saveEditFormBttn = document.getElementById("edit-task-save-button");

const editOverlay = document.getElementById("edit-screen-overlay");
const burgerMenuOverlay = document.getElementById("burger-menu-overlay");




document.addEventListener("DOMContentLoaded", async () => {

  await CreateDB();

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

  searchInput.addEventListener("input", function () {
    UpdateURLState();
    RetriveTasks();
  });

  statusOptions.forEach((option) => {
    option.addEventListener("click", function () {

      // gives uncheck functionality for radio buttons
      if (lastSelectedFilter === this) {
        this.checked = false;
        lastSelectedFilter = null;
      } else {
        lastSelectedFilter = this;
      }

      UpdateURLState();
      RetriveTasks();
    })
  });

  sortOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // gives uncheck functionality for radio buttons
      if (lastSelectedOrder === this) {
        this.checked = false;
        lastSelectedOrder = null;
      } else {
        lastSelectedOrder = this;
      }

      UpdateURLState();
      RetriveTasks();
    })
  })

  deleteSelectedBttn.addEventListener("click", DeleteSelectedTasks);
  headerStatusSelecter.addEventListener("input", ChangeStatusSelected);

  // new form buttons
  saveNewFormBttn.addEventListener("click", SaveNewTaskForm);
  clearNewFormBttn.addEventListener("click", ClearNewTaskForm);

  // edit form buttons
  closeEditFormBttn.addEventListener("click", CloseEditTaskForm);

  deleteTaskBttn.addEventListener("click", function (e) {
    DeleteTask(Number(e.target.closest("div[id]").id));
  });

  clearEditFormBttn.addEventListener("click", ClearEditTaskForm);
  saveEditFormBttn.addEventListener("click", function (e) {
    SaveEditTask(e, Number(e.target.closest("div[id]").id));
  });

  // overlay event listeners
  editOverlay.addEventListener("click", CloseEditTaskForm);
  burgerMenuOverlay.addEventListener("click", CloseBurgerMenu);

  CreateTaskForm();//new task form logic

  loadStateFromURL();
});


//Theme selection functionality 
ThemeToggle();

//Burger menu functionality for large window sizes
BurgerMenuToggle();

// Scroll top
ScrollTop();


