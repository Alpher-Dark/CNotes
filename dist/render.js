const { appWindow } = window.__TAURI__.window;
const { readDir, readTextFile, writeTextFile, renameFile, removeFile, BaseDirectory } = window.__TAURI__.fs;

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

async function updateNotes() {
    noteList.innerHTML = "";
    notes = await readDir("", {dir: BaseDirectory.App, recursive: true});
    for (let note of notes) {
        if(note.name.endsWith(".txt")) {
            let item = document.createElement("li");
            item.setAttribute("class", "chooseNote");
            let noteName = note.name.slice(0, -4);
            item.onclick = async () => {
                noteText.value = await readTextFile("".concat(note.name), {dir: BaseDirectory.App});
                noteTitle.value = noteName;
                selected = note.name;
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