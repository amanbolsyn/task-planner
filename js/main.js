import { ThemeToggle } from "./utils.js";
import { ViewTasksToggle } from "./utils.js";
import { BurgerMenu } from "./utils.js";
import { CreateTaskForm } from "./utils.js";
import { ScrollTop } from "./utils.js";
import { UpdateURLState } from "./utils.js";

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




document.addEventListener("DOMContentLoaded", async () => {

  await CreateDB();

  //View selection functionality 
  ViewTasksToggle();


  function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    const search = params.get("search");
    const status = params.get("status");
    const sort = params.get("sort");

    if (search) document.getElementById("search").value = search;
    if (status)
      document.querySelector(`input[name="task-status"][value="${status}"]`)?.click();
    if (sort) document.querySelector(`input[name="sort-order"][value="${sort}"]`)?.click();

    // You can call your display logic here:
    RetriveTasks();
  }

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

  saveNewFormBttn.addEventListener("click", SaveNewTaskForm);
  clearNewFormBttn.addEventListener("click", ClearNewTaskForm);

  closeEditFormBttn.addEventListener("click", CloseEditTaskForm);
  deleteTaskBttn.addEventListener("click", DeleteTask); //Delete task from edit 
  clearEditFormBttn.addEventListener("click", ClearEditTaskForm);
  saveEditFormBttn.addEventListener("click", SaveEditTask);

  screenOverlay.addEventListener("click", CloseEditTaskForm)

  CreateTaskForm();


  loadStateFromURL();
});


//Theme selection functionality 
ThemeToggle();

//Burger menu functionality for large window sizes
BurgerMenu();

ScrollTop();


