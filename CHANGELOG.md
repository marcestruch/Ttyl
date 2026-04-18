# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-18

### ✨ Added
- **Multi-Project System**: Support for creating and managing different workspaces/projects to group related tasks.
- **Sidebar Navigation**: Implemented a collapsible sidebar layout (`Ctrl+B`) inspired by Anthropic's Claude UI.
- **Task Expansion**: Tasks in the dashboard can now be expanded to view full Markdown descriptions inline.
- **Interactive Task Input**: Added a fixed bottom input bar for quick task creation with support for priorities and Pomodoro estimations (`Shift+Enter` to expand).
- **Settings View**: First iteration of an in-app Settings view to modify user profile details, default Pomodoro duration, and application theme.
- **Enhanced Command Palette**: Major upgrade to the `Ctrl+K` palette. Added sections for Projects, navigating to specific tasks, and shortcuts with Lucide icons.
- **Focus Session History**: Focus modes now generate `FocusSession` data payloads upon completion, enabling future analytics capabilities, stored safely on local JSON.

### 🎨 Changed
- **Design System Overhaul**: Entire color palette has been shifted from default Tailwind/shadcn cool grays to a premium "warm" dark color scheme (`#161413`).
- **Typography Swap**: Removed Playfair Display (Serif) entirely. Headings now exclusively use Inter (Sans-serif) in tighter font-weights (`600`/`700`), promoting a more developer-focused IDE aesthetic.
- **Focus Mode Redesign**: Timer now uses tabular monospaced digits with subtle visual feedback (pulsing indicator) when under 60 seconds remaining.

### 🔥 Removed
- **Legacy Styles**: Dropped the old `App.css` file carried over from the initial Tauri template, permanently fixing color bleeding and contrast issues on light/dark mode toggles.

---

## [0.1.0] - Initial Release

### Added
- Core Application (React + Vite + Tauri + Rust)
- Persistent local JSON storage via Tauri FS plugin.
- Basic Focus Mode with Pomodoro tracking.
- System Hooks execution (`on_start.sh` and `on_stop.sh`).
- Theme toggles.
