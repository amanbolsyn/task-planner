
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

//Task view functionality
function ViewToggle() {

}

function BurgerMenu() {

    const burgerMenuChkBox = document.getElementById("burger-menu-toggle");
    const navbar = document.getElementsByTagName("nav")
    const prefState = localStorage.getItem("burger-menu-preference");

    if (prefState === "true") {
        burgerMenuChkBox.checked = true;
        navbar[0].classList.add("burger-menu-active")
        navbar[0].classList.remove("burger-menu-inactive")
    } else {
        burgerMenuChkBox.checked = false;
        navbar[0].classList.remove("burger-menu-active")
        navbar[0].classList.add("burger-menu-inactive")

    }

    burgerMenuChkBox.addEventListener("change", function () {

        if (burgerMenuChkBox.checked) {
            navbar[0].classList.add("burger-menu-active")
            navbar[0].classList.remove("burger-menu-inactive")
        } else {
            navbar[0].classList.remove("burger-menu-active")
            navbar[0].classList.add("burger-menu-inactive")
        }

        //stores new value of burger menu checkbox when checkbox is triggered
        localStorage.setItem("burger-menu-preference", burgerMenuChkBox.checked);

    })

}


export { ThemeToggle, ViewToggle, BurgerMenu };