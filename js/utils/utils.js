
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
function ViewToggle() {

    const viewToggleChkBx = document.getElementById("view-toggle");
    const viewPref = localStorage.getItem("view-preference");
 
    const taskWindow = document.querySelector(".main-task-cards");

    if (viewPref === "false") {
        viewToggleChkBx.checked = false;
        taskWindow.classList.add("column-view")
        DisplayView();
     } else {
        viewToggleChkBx.checked = true;
         taskWindow.classList.add("list-view")
     }

    viewToggleChkBx.addEventListener("change", function () {

        if(viewToggleChkBx.checked){
           taskWindow.classList.add("column-view")
           taskWindow.classList.remove("list-view")
           DisplayView(); 
        } else {
            taskWindow.classList.add("list-view")
            taskWindow.classList.remove("column-view")
        }
        localStorage.setItem("view-preference", viewToggleChkBx.checked);
    });
}

function DisplayView() {

   const taskWindow = document.querySelector(".main-task-cards");

   const windowWidth = taskWindow.offsetWidth;
   let numOfColumnns = Math.floor(windowWidth/300);

   taskWindow.style.setProperty('--columns', numOfColumnns)

   taskWindow.innerHTML = "";

   for(let i = 0; i<numOfColumnns; i++ ){
    const div = document.createElement("div");
    div.className = "column";
    div.innerText = `column ${i+1}`;
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
    })
}


function CreateTaskForm() {

    const taskForm = document.getElementById("new-task-form")
    const taskDescription = document.getElementById("task-description");
    const taskTitle = document.getElementById("task-tittle")

    taskDescription.addEventListener("focus", function () {
        taskForm.classList.add("task-form-active");
        taskForm.classList.remove("task-form-inactive");

    })

     taskTitle.addEventListener("focus", function () {

    })
}

export { ThemeToggle, ViewToggle, BurgerMenu, CreateTaskForm};