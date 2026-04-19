use std::path::PathBuf;
use std::process::Command;

#[tauri::command]
fn run_system_script(script_name: &str) -> Result<String, String> {
    // Attempt to run ~/.config/miapp/<script_name>
    let config_dir = dirs::config_dir().ok_or("Could not find config directory")?;
    let script_path: PathBuf = config_dir.join("ttyl").join(script_name);

    if !script_path.exists() {
        return Err(format!("Script {:?} does not exist", script_path));
    }

    let output = Command::new("bash")
        .arg(&script_path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![run_system_script])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
