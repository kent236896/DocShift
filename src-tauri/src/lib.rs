mod pandoc;
mod history;
mod formats;

use pandoc::{clear_history, convert_file, get_history, get_pandoc_version, open_path};
use tauri::Manager;

pub fn run() {
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            convert_file,
            get_pandoc_version,
            get_history,
            clear_history,
            open_path,
        ])
        .setup(|app| {
            let app_data = app.path().app_data_dir().expect("Could not get app data dir");
            let db = history::HistoryDb::new(app_data).expect("Could not open history DB");
            db.init().expect("Could not initialize history DB");
            app.manage(std::sync::Arc::new(tokio::sync::Mutex::new(db)));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
