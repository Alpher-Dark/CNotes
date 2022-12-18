import { appWindow } from "@tauri-apps/api/window";

let settingBtn = document.getElementById("settingBtn");
let themeDropdown = document.getElementById("theme-dropdown");
let closeBtn = document.getElementById("titlebar-close");

closeBtn.onclick = () => {
    appWindow.hide();
};

settingBtn.onclick = () => {
    themeDropdown.classList.toggle("activeDropdown");
};
