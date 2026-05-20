# DocMorph — Privacy Policy

**Effective date:** May 12, 2026  
**Last updated:** May 19, 2026  
**Applies to:** DocMorph desktop application for Microsoft Windows (including builds distributed through the Microsoft Store and other channels).

**Privacy policy URL (for Microsoft Partner Center):**  
`https://github.com/kent236896/DocShift/blob/main/PRIVACY.md`

---

## Summary

DocMorph runs **entirely on your device**. In the current open-source release, it **does not** upload your documents, file paths, or conversion history to our servers. We **do not** operate analytics, crash reporting, or advertising SDKs in this configuration. Optional platform services (for example Microsoft Store, Windows Update, and WebView2) are governed by **Microsoft’s** policies.

---

## 1. Data controller and scope

- **Data controller:** Tang Kun (唐昆).  
- **Scope:** This policy describes how the **DocMorph application** handles information. It does not govern third-party services or websites that you may access through files you open or create with the app.

---

## 2. Information we process

### 2.1 Files you choose to convert

Files you select for conversion are read and written **only on your computer**, by DocMorph and by the bundled **Pandoc** (and, when exporting to PDF, **Typst**) processes invoked locally. DocMorph does **not** transmit file contents to the data controller’s servers by default.

### 2.2 Conversion history (local storage)

The app may store a **SQLite database** in your Windows user application data folder (for example conversion history: input/output paths, formats, success or failure, and timestamps). This data **remains on your device**. You can clear history from within the app where that feature is available. Uninstalling the app may leave or remove this data depending on Windows and the version you use.

### 2.3 No built-in telemetry

The published source code for DocMorph **does not include** modules that send usage analytics, document content, or folder listings to the data controller. If you build or distribute a modified version with network features, you must update this privacy policy and the URL you provide in Microsoft Partner Center.

---

## 3. Third parties and system components

| Component | Role |
|-----------|------|
| **Pandoc** | Runs as a separate local program. License: GPL-2.0-or-later. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). |
| **Typst** | Used locally for PDF export when applicable. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). |
| **Microsoft Store / Windows** | May process purchase, update, and diagnostics data according to [Microsoft Privacy Statement](https://privacy.microsoft.com/). |
| **WebView2** | Renders the user interface; subject to Microsoft’s WebView2 and Windows terms and privacy documentation. |

---

## 4. Legal bases and retention (where applicable)

Where privacy laws require a legal basis, we process the above information to **provide the conversion service you request** on your device. Local history is kept until you delete it or uninstall the app, unless a longer period is required by law.

---

## 5. Children

DocMorph is a general document conversion tool. It is **not directed** at children under 13, and we do not knowingly collect personal information from children. If you believe a child’s information was processed in connection with the app, contact us using the details below.

---

## 6. Your rights and contact

Depending on your location, you may have rights to access, correct, delete, or restrict processing of personal information, or to lodge a complaint with a supervisory authority.

**Contact:**  
- **Email:** kent.neo9527@gmail.com  
- **Data controller:** Tang Kun (唐昆)

We will respond to reasonable requests within the timeframes required by applicable law.

---

## 7. International transfers

DocMorph is designed for local processing on your device. We do not operate servers that receive your document content in the default configuration. If that changes in a future version, this policy will be updated.

---

## 8. Changes to this policy

We may update this policy when features or legal requirements change. The current version will be posted at the public URL above (and, where applicable, linked from the Microsoft Store listing). Material changes may also be described in release notes or Store update descriptions.

---

## 9. Disclaimer

This policy describes the open-source DocMorph project as configured in this repository. **It is not legal advice.** For Microsoft Store and other regulatory obligations in your jurisdiction, consult qualified counsel and [Microsoft Partner Center](https://partner.microsoft.com/) documentation.
