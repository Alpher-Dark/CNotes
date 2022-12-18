#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri::{CustomMenuItem, Menu, Submenu};

fn view_menu() -> Menu {
  let new = CustomMenuItem::new("new".to_string(), "New Note").accelerator("Ctrl + N");
  let save = CustomMenuItem::new("save".to_string(), "Save Note").accelerator("Ctrl + S");
  let delete = CustomMenuItem::new("del".to_string(), "Delete Note").accelerator("Delete");
  let refresh = CustomMenuItem::new("refresh".to_string(), "Refresh Notes").accelerator("Ctrl + R");
  let settings = CustomMenuItem::new("settings".to_string(), "Settings");
  let file = Submenu::new(
    "File",
    Menu::new()
      .add_item(new)
      .add_item(save)
      .add_item(delete)
      .add_item(refresh)
      .add_item(settings),
  );
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let menu = Menu::new().add_submenu(file).add_item(quit);

  return menu;
}

fn open_settings(window: &tauri::Window) {
  let settings_window = window.app_handle().get_window("settings");
  if let Some(settings_win) = settings_window {
    if settings_win.is_visible().unwrap() {
      let _ = settings_win.hide();
    } else {
      let _ = settings_win.show();
    }
  }
}

fn main() {
  tauri::Builder::default()
    .menu(view_menu())
    .on_menu_event(|event| match event.menu_item_id() {
      "quit" => {
        std::process::exit(0);
      }
      "new" => {
        event.window().emit("new", "");
      }
      "save" => {
        event.window().emit("save", "");
      }
      "del" => {
        event.window().emit("del", "");
      }
      "settings" => {
        open_settings(event.window());
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
