use crate::formats::is_valid_output_format;
use crate::history::{HistoryDb, HistoryRecord};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};
use tokio::process::Command;
use tokio::sync::Mutex;
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConversionProgressEvent { pub id: String, pub progress: u8, pub status: String, pub error_message: Option<String>, pub output_path: Option<String> }
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConvertFileArgs { pub id: String, pub input_path: String, pub output_path: String, pub from_format: String, pub to_format: String, pub extra_args: String }
fn pandoc_path(app: &AppHandle) -> String { if let Ok(res) = app.path().resource_dir() { let p = if cfg!(target_os = "windows") { res.join("binaries").join("pandoc-x86_64-pc-windows-msvc.exe") } else { res.join("binaries").join("pandoc") }; if p.exists() { return p.to_string_lossy().to_string(); } } "pandoc".to_string() }
#[tauri::command]
pub async fn convert_file(app: AppHandle, args: ConvertFileArgs) -> Result<String, String> {
  if !Path::new(&args.input_path).exists() { return Err(format!("Input file not found: {}", args.input_path)); }
  if !is_valid_output_format(&args.to_format) { return Err(format!("Unsupported output format: {}", args.to_format)); }
  if let Some(parent) = Path::new(&args.output_path).parent() { tokio::fs::create_dir_all(parent).await.map_err(|e| format!("Failed to create output directory: {}", e))?; }
  let _ = app.emit("conversion_progress", ConversionProgressEvent { id: args.id.clone(), progress: 10, status: "converting".into(), error_message: None, output_path: None });
  let mut cmd = Command::new(pandoc_path(&app));
  cmd.arg("-f").arg(&args.from_format).arg("-t").arg(&args.to_format);
  if !args.extra_args.trim().is_empty() {
    for a in args.extra_args.split_whitespace() {
      cmd.arg(a);
    }
  }
  cmd.arg("-o").arg(&args.output_path).arg(&args.input_path);
  let out = cmd.output().await.map_err(|e| format!("Pandoc binary not found. Please reinstall DocShift. {}", e))?;
  let db: tauri::State<'_, Arc<Mutex<HistoryDb>>> = app.state();
  let meta = tokio::fs::metadata(&args.input_path).await.ok();
  if out.status.success() {
    let _ = app.emit("conversion_progress", ConversionProgressEvent { id: args.id.clone(), progress: 100, status: "done".into(), error_message: None, output_path: Some(args.output_path.clone()) });
    let _ = db.lock().await.insert(&HistoryRecord { id: 0, input_path: args.input_path.clone(), output_path: args.output_path.clone(), from_format: args.from_format.clone(), to_format: args.to_format.clone(), success: true, error_msg: None, created_at: String::new(), file_size: meta.map(|m| m.len() as i64).unwrap_or(0) });
    Ok(args.output_path)
  } else {
    let err = String::from_utf8_lossy(&out.stderr).trim().to_string();
    let msg = if err.is_empty() { "Conversion failed with unknown error.".to_string() } else { format!("Conversion failed: {}", err) };
    let _ = app.emit("conversion_progress", ConversionProgressEvent { id: args.id.clone(), progress: 100, status: "error".into(), error_message: Some(msg.clone()), output_path: None });
    let _ = db.lock().await.insert(&HistoryRecord { id: 0, input_path: args.input_path.clone(), output_path: args.output_path.clone(), from_format: args.from_format.clone(), to_format: args.to_format.clone(), success: false, error_msg: Some(msg.clone()), created_at: String::new(), file_size: meta.map(|m| m.len() as i64).unwrap_or(0) });
    Err(msg)
  }
}
#[tauri::command]
pub async fn get_pandoc_version(app: AppHandle) -> Result<String, String> { let out = Command::new(pandoc_path(&app)).arg("--version").output().await.map_err(|e| format!("Pandoc binary not found. Please reinstall DocShift. {}", e))?; if !out.status.success() { return Err("Failed to query pandoc version".into()); } let s = String::from_utf8_lossy(&out.stdout); Ok(s.lines().next().unwrap_or("pandoc unknown").replace("pandoc ", "").trim().to_string()) }
#[tauri::command]
pub async fn get_history(app: AppHandle) -> Result<Vec<crate::history::HistoryRecord>, String> {
  let db: tauri::State<'_, Arc<Mutex<HistoryDb>>> = app.state();
  let guard = db.lock().await;
  let result = guard.get_all().map_err(|e| format!("Failed to load history: {}", e));
  result
}
#[tauri::command]
pub async fn clear_history(app: AppHandle) -> Result<(), String> {
  let db: tauri::State<'_, Arc<Mutex<HistoryDb>>> = app.state();
  let guard = db.lock().await;
  let result = guard
    .clear_all()
    .map(|_| ())
    .map_err(|e| format!("Failed to clear history: {}", e));
  result
}
#[tauri::command]
pub async fn open_path(path: String) -> Result<(), String> { if !Path::new(&path).exists() { return Err(format!("Path does not exist: {}", path)); } #[cfg(target_os = "windows")] { Command::new("explorer").arg(path).spawn().map_err(|e| format!("Failed to open path: {}", e))?; } #[cfg(target_os = "macos")] { Command::new("open").arg(path).spawn().map_err(|e| format!("Failed to open path: {}", e))?; } #[cfg(all(unix, not(target_os = "macos")))] { Command::new("xdg-open").arg(path).spawn().map_err(|e| format!("Failed to open path: {}", e))?; } Ok(()) }
