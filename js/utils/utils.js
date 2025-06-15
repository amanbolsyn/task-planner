function ThemeToggle(){

const selectedTheme = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme-preference");

if(savedTheme === "false"){
     selectedTheme.checked = false;
} else {
    selectedTheme.checked = true;
}

selectedTheme.addEventListener("change", function(){
    localStorage.setItem("theme-preference", selectedTheme.checked)
})
  
}


export {ThemeToggle};