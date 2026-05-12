use chrono::Utc;
use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoryRecord { pub id: i64, pub input_path: String, pub output_path: String, pub from_format: String, pub to_format: String, pub success: bool, pub error_msg: Option<String>, pub created_at: String, pub file_size: i64 }
pub struct HistoryDb { path: PathBuf }
impl HistoryDb {
  pub fn new(app_data_dir: PathBuf) -> Result<Self> { let dir = app_data_dir.join("docshift"); fs::create_dir_all(&dir).map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?; Ok(Self { path: dir.join("history.db") }) }
  fn connect(&self) -> Result<Connection> { let conn = Connection::open(&self.path)?; conn.pragma_update(None, "journal_mode", "WAL")?; Ok(conn) }
  pub fn init(&self) -> Result<()> { let conn = self.connect()?; conn.execute_batch("CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT,input_path TEXT NOT NULL,output_path TEXT NOT NULL,from_format TEXT NOT NULL,to_format TEXT NOT NULL,success INTEGER NOT NULL DEFAULT 1,error_msg TEXT,created_at TEXT NOT NULL,file_size INTEGER NOT NULL DEFAULT 0)")?; Ok(()) }
  pub fn insert(&self, record: &HistoryRecord) -> Result<i64> { let conn = self.connect()?; conn.execute("INSERT INTO history (input_path,output_path,from_format,to_format,success,error_msg,created_at,file_size) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)", params![record.input_path, record.output_path, record.from_format, record.to_format, if record.success {1} else {0}, record.error_msg, Utc::now().to_rfc3339(), record.file_size])?; Ok(conn.last_insert_rowid()) }
  pub fn get_all(&self) -> Result<Vec<HistoryRecord>> { let conn = self.connect()?; let mut stmt = conn.prepare("SELECT id,input_path,output_path,from_format,to_format,success,error_msg,created_at,file_size FROM history ORDER BY created_at DESC LIMIT 500")?; let rows = stmt.query_map([], |r| Ok(HistoryRecord { id: r.get(0)?, input_path: r.get(1)?, output_path: r.get(2)?, from_format: r.get(3)?, to_format: r.get(4)?, success: r.get::<_, i64>(5)? == 1, error_msg: r.get(6)?, created_at: r.get(7)?, file_size: r.get(8)? }))?; let mut out = Vec::new(); for row in rows { out.push(row?); } Ok(out) }
  pub fn clear_all(&self) -> Result<usize> { let conn = self.connect()?; conn.execute("DELETE FROM history", []) }
}
