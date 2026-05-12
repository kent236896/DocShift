# DocShift

DocShift 是一个基于 **Tauri 2 + React 18 + TypeScript** 的桌面文档格式转换工具，作为 Pandoc 的本地 GUI 封装，支持离线转换 40+ 文档格式。

## 1. 环境要求

请先安装以下依赖：

1. Rust（稳定版）：<https://rustup.rs>
2. Node.js 20 LTS：<https://nodejs.org>
3. Tauri CLI：

```bash
cargo install tauri-cli
```

4. Pandoc（Windows）  
   从 <https://github.com/jgm/pandoc/releases> 下载后，将可执行文件放到：

`src-tauri/binaries/pandoc-x86_64-pc-windows-msvc.exe`

> 当前项目已按此路径放置二进制。

---

## 2. 安装依赖

在项目根目录执行：

```bash
npm install
```

---

## 3. 开发模式启动

```bash
cargo tauri dev
```

说明：
- 会先启动 Vite 前端（端口 `1420`）
- 然后启动 Tauri 桌面窗口
- 支持热更新

---

## 4. 生产构建

```bash
cargo tauri build
```

构建产物位于：

`src-tauri/target/release/bundle/`

---

## 5. 基础功能测试（手工）

启动应用后，按下面步骤验证：

1. **拖拽导入**
   - 拖入 `*.md`、`*.docx`、`*.html` 等文件
   - 检查队列是否显示文件名、大小、源格式

2. **格式选择**
   - 在输出格式下拉选择 `docx` / `pdf` / `markdown`
   - 检查选择结果是否正确显示

3. **批量转换**
   - 点击“Convert All”
   - 观察状态从 `pending -> converting -> done/error`
   - 检查进度条变化

4. **历史记录**
   - 打开 History 面板
   - 确认成功/失败记录写入
   - 验证过滤和“Convert again”功能

5. **设置面板**
   - 切换语言（Auto / English / 中文）
   - 切换主题（Light / Dark / System）
   - 修改最大并发数（1-10）
   - 设置自定义输出目录后再次转换

6. **快捷键**
   - `Ctrl + O`：打开文件选择
   - `Ctrl + Enter`：开始转换
   - `Ctrl + H`：切换到历史面板

---

## 6. 常见问题排查

### 1) 提示找不到 Pandoc

检查文件是否存在且命名正确：

`src-tauri/binaries/pandoc-x86_64-pc-windows-msvc.exe`

### 2) 端口占用（1420）

关闭占用端口的进程，或按需修改 `vite.config.ts` 与 `src-tauri/tauri.conf.json` 中的开发端口配置（需保持一致）。

### 3) WebView2 问题

Windows 需安装 Edge WebView2 Runtime。一般系统已预装，若缺失请安装官方运行时。

---

## 7. 推荐开发命令

```bash
# 前端单独调试
npm run vite:dev

# Tauri 联调（推荐）
cargo tauri dev

# 构建产物
cargo tauri build
```

