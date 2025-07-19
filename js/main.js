import { ThemeToggle } from "./utils.js";
import { ViewTasksToggle } from "./utils.js";
import { BurgerMenu } from "./utils.js";
import { CreateTaskForm } from "./utils.js";

import { CreateDB } from "./data.js";
import { CloseNewTaskForm } from "./data.js";
import { ClearNewTaskForm } from "./data.js";

import { CloseEditTaskForm } from "./data.js";
import { DeleteTask } from "./data.js";
import { ClearEditTaskForm } from "./data.js";

const clearNewFormBttn = document.getElementById("new-task-clear-button");
const closeNewFormBttn = document.getElementById("new-task-close-button");

const closeEditFormBttn = document.getElementById("edit-task-close-button");
const deleteTaskBttn = document.getElementById("delete-task-button");
const clearEditFormBttn = document.getElementById("edit-task-clear-button");



document.addEventListener("DOMContentLoaded", () => {

  CreateDB();

  //View selection functionality 
  ViewTasksToggle();

  closeNewFormBttn.addEventListener("click", CloseNewTaskForm);
  clearNewFormBttn.addEventListener("click", ClearNewTaskForm);

  closeEditFormBttn.addEventListener("click", CloseEditTaskForm);
  deleteTaskBttn.addEventListener("click", DeleteTask); //Delete task from edit form
  clearEditFormBttn.addEventListener("click", ClearEditTaskForm);


  //Theme selection functionality 
  ThemeToggle();

  //Burger menu functionality for large window sizes
  BurgerMenu();

  CreateTaskForm();
});

