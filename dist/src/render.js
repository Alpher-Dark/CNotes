import { SettingsManager } from "tauri-settings";

import { appWindow } from "@tauri-apps/api/window";
import { readDir, readTextFile, writeTextFile, renameFile, removeFile, createDir, BaseDirectory } from "@tauri-apps/api/fs";

createDir("", {dir: BaseDirectory.App, recursive: true});

async function newFile() {
    await writeTextFile("New note.txt", "", {dir: BaseDirectory.App});
    noteText.value = await readTextFile("New note.txt", {dir: BaseDirectory.App});
    noteTitle.value = "New note";
    selected = "New note.txt";
    updateNotes();
}

async function saveFile() {
    await writeTextFile({path: selected, contents: noteText.value}, {dir: BaseDirectory.App});
    await renameFile(selected, `${noteTitle.value}.txt`, {dir: BaseDirectory.App});
    if(selected.length > `${noteTitle.value}.txt`.length) {
        removeFile(selected, {dir: BaseDirectory.App});
    }
    updateNotes();
}

async function deleteFile() {
    await removeFile(selected, {dir: BaseDirectory.App});
    updateNotes();
}

document.addEventListener("keydown", (event) => {
    if(event.defaultPrevented) {
        return;
    }

    if(event.ctrlKey && event.code == "KeyS") {
        saveFile();
    } else if(event.ctrlKey && event.code == "KeyN") {
        newFile();
    } else if(event.ctrlKey && event.code == "KeyR") {
        updateNotes();
    }else if(event.code == "Delete") {
        deleteFile();
    }
});

let notes;
let noteList = document.getElementById("noteList");
let noteText = document.getElementById("noteText");
let noteTitle = document.getElementById("noteTitle");
let selected;

// function reduceFontnoteTitle(){
//     if (noteTitle.clientHeight < noteTitle.scrollHeight) {
//         noteTitle.style.fontSize = `calc(${noteTitle.style.fontSize} - 1vh)`;
//     }
// }

// noteTitle.onkeydown = reduceFontnoteTitle();
// noteTitle.onchange = reduceFontnoteTitle();
// noteTitle.oninput = reduceFontnoteTitle();

async function updateNotes() {
    noteList.innerHTML = "";
    notes = await readDir("", {dir: BaseDirectory.App, recursive: true});
    for (let note of notes) {
        if(note.name.endsWith(".txt")) {
            let item = document.createElement("a");
            item.setAttribute("class", "button is-small is-text");
            let noteName = note.name.slice(0, -4);
            item.setAttribute("id", noteName);
            item.onclick = async () => {
                noteText.value = await readTextFile("".concat(note.name), {dir: BaseDirectory.App});
                noteTitle.value = noteName;
                selected = note.name;
                document.getElementById(noteName).style.border = "5px solid var(--text-color);";
            };
            item.innerText = noteName;
            noteList.appendChild(item); 
        }
    }
}

updateNotes();

appWindow.listen("new", async () => newFile());

appWindow.listen("refresh", async () => updateNotes());

appWindow.listen("save", async () => saveFile());

appWindow.listen("del", async () => deleteFile());

let Schema = {
    theme: "light" | "dark",
    accentColor: String,
    backgroundColor: String,
    textColor: String
}

const settingsManager = new SettingsManager<Schema>(
    {
        theme: "dark",
        accentColor: "rgb(60, 60, 60)",
        backgroundColor: "rgb(44, 44, 44)",
        textColor: "rgb(117, 117, 117)"
    },
    {
        fileName: "app.conf"
    }
);
