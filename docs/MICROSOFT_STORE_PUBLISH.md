# Microsoft 应用商店（Partner Center）发布与编译打包说明

本文说明如何为 **Microsoft Store**（「EXE 或 MSI」应用类型）准备 Tauri 2 生成的 **Windows 安装包**，以及与 Partner Center 中应用身份的对应关系。

> **官方参考**：[Tauri — Microsoft Store](https://v2.tauri.app/distribute/microsoft-store/)、[将应用发布到 Microsoft Store](https://learn.microsoft.com/zh-cn/windows/apps/publish/)。

---

## 1. Partner Center 中的应用身份（登记信息）

以下由 Partner Center 分配或你方在登记时确定，**用于审核、上架与技术支持对照**；其中 **Package SID**、**PFN**、**Store ID** 由 Microsoft 生成，勿手工改写入安装包。

| 项目 | 值 |
|------|-----|
| **Package/Identity/Name** | `DF1049EA.DocShift` |
| **Package/Identity/Publisher** | `CN=E2CDB98F-2BEB-4CD5-BDEF-657F4F848F1D` |
| **Package/Properties/PublisherDisplayName** | `唐昆` |
| **Package Family Name (PFN)** | `DF1049EA.DocShift_2z56fg7ja5tr2` |
| **Package SID** | `S-1-15-2-4165016054-3785219236-440171465-3969641029-159186102-1818548856-3713534965` |
| **Store ID** | `9N426GTQPNHW` |

**与本仓库配置的对应关系：**

| Partner Center / 清单概念 | 本仓库中的位置 |
|---------------------------|----------------|
| Package/Identity/Name | `src-tauri/tauri.conf.json` → `identifier`（`DF1049EA.DocShift`） |
| PublisherDisplayName | `src-tauri/tauri.conf.json` → `bundle.publisher`（`唐昆`） |
| Publisher（`CN=...`） | **不在** JSON 中填写；由你在 **签名安装包** 时使用的 **代码签名证书** 主题（Subject）决定，需与 Partner Center 为你的应用分配的发布者一致（通常使用 Partner Center 提供的 **机密 / 证书** 流程）。 |
| PFN / Package SID | 由 Name + Publisher 哈希派生，**无需**写入 Tauri 配置。 |
| Store ID | 仅用于商店链接、运营与 API；例如列表页路径中会使用该 ID。 |

**重要：** `CN=E2CDB98F-2BEB-4CD5-BDEF-657F4F848F1D` 与 `.pfx` 等签名材料属于敏感资产，请放在安全位置与 CI 密钥库中，**不要**提交到 Git。

---

## 2. 前置条件

1. **Microsoft 合作伙伴中心** 已注册，并已创建「EXE 或 MSI」类应用，预留名称与上述身份一致。
2. **开发环境**（在 Windows 上构建 Windows 安装包）：
   - [Rust](https://rustup.rs/)、[Node.js](https://nodejs.org/)（LTS 即可）
   - [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（含 **使用 C++ 的桌面开发** / Windows SDK / WebView2 相关组件，按 Tauri 官方 Windows 前置说明勾选）
   - [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)：商店渠道要求安装包使用 **离线安装程序** 模式嵌入 WebView2（见下文合并配置）。
3. **代码签名**：商店提交的 MSI 需使用 Partner Center 认可的证书签名（具体以 [Partner Center 应用包](https://learn.microsoft.com/zh-cn/windows/apps/publish/publish-your-app/create-app-submission) 文档为准）。本地可先使用 `npm run tauri ... -- --no-sign` 做未签名试打包，**提交前必须完成正式签名**。

---

## 3. 版本号

上架前在以下位置统一提升版本（与 Partner Center 提交版本一致）：

- `src-tauri/tauri.conf.json` → `version`
- `src-tauri/Cargo.toml` → `version`（建议与上一致）

---

## 4. 商店专用配置（WebView2 离线安装程序）

本仓库提供 **`src-tauri/tauri.microsoftstore.conf.json`**，在打包阶段与主配置 **合并**，将 Windows 安装包中的 WebView2 安装方式设为 **`offlineInstaller`**，以满足 [Tauri 对 Microsoft Store 的要求](https://v2.tauri.app/distribute/microsoft-store/)。

日常侧载 / 非商店分发仍使用主配置中的 `embedBootstrapper`（或其它你自行选择的模式），无需改主文件即可区分渠道。

---

## 5. 推荐编译与打包命令

在项目根目录（含 `package.json` 的目录）执行。

### 5.1 一步脚本（推荐）

仅生成 **MSI**（商店「EXE 或 MSI」流程常用；可按 Partner Center 实际要求改为同时打 NSIS）：

```bash
npm run store:bundle
```

该脚本等价于：先 **`tauri build --no-bundle`**（编译 Rust + 执行 `beforeBuildCommand` 生成前端），再 **`tauri bundle`** 并 **合并** `tauri.microsoftstore.conf.json`，且 **仅打 MSI 包**。

### 5.2 分步执行（便于排查）

```bash
# 1) 编译应用本体，跳过安装包生成
npx tauri build --no-bundle

# 2) 合并商店配置，仅生成 MSI 安装包
npx tauri bundle --config src-tauri/tauri.microsoftstore.conf.json -b msi
```

产物目录以 CLI 输出为准，一般为 **`src-tauri/target/release/bundle/msi/`** 下的 `.msi` 文件。

### 5.3 代码签名

在已配置证书的环境变量或 Tauri 的 Windows 签名相关配置后，对 **不要** 使用 `--no-sign` 的完整构建进行签名；或将签名作为 CI 步骤在生成 MSI 之后执行。具体命令取决于你持有的证书形态（`.pfx`、云签名等），此处不展开，请以 Microsoft 与 Tauri [Windows 签名](https://v2.tauri.app/distribute/sign/windows/) 文档为准。

---

## 6. 上传到 Partner Center

1. 登录 [Partner Center](https://partner.microsoft.com/dashboard) → 你的应用（Store ID：`9N426GTQPNHW`）。
2. 创建或更新提交，在「程序包」步骤上传 **签名后的 MSI**（或按中心要求上传附加文件）。
3. 填写商店一览、隐私政策 HTTPS 链接、年龄分级等；本项目法律与第三方说明见仓库根目录 `PRIVACY.md`、`THIRD_PARTY_NOTICES.md`、`COPYRIGHT.md`。
4. 提交认证；根据反馈修改后重新上传新版本安装包。

---

## 7. 更换 `identifier` 的影响说明

主配置中的 **`identifier`** 已与 Partner Center 的 **Package Identity Name** 对齐为 `DF1049EA.DocShift`。若此前已以 `com.docshift.app` 安装过开发版，**应用数据目录**等可能与旧版不一致；上架商店时请按新版本完整测试安装与升级路径。

---

## 8. 常见问题

| 现象 | 处理方向 |
|------|----------|
| 认证提示 WebView2 / 离线安装不符合要求 | 确认商店包是使用 **`tauri.microsoftstore.conf.json` 合并** 后的构建，且为 **MSI** 流程要求的离线模式。 |
| 签名与 Partner Center 不一致 | 检查证书 Subject 是否为 `CN=E2CDB98F-2BEB-4CD5-BDEF-657F4F848F1D`（或与中心显示完全一致）。 |
| 仅想本地试装、无证书 | 使用 `npm run tauri -- bundle ... -- --no-sign` 生成未签名 MSI，**不可**用于商店最终提交。 |

---

## 9. 相关链接

- 商店应用（示例）：`https://www.microsoft.com/store/productId/9N426GTQPNHW`（以 Microsoft 实际生成的商店 URL 为准）
- 项目主说明：[README.md](../README.md) 第六节「Microsoft Store 与法律文件」
