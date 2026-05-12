# Third-party notices — DocShift

This application may include or invoke the following third-party software. DocShift’s own license is stated in [`LICENSE`](LICENSE) (MIT by default). **Pandoc is not covered by that MIT license.**

---

## Pandoc

- **Project:** [Pandoc](https://pandoc.org/) — universal document converter  
- **Copyright:** © John MacFarlane and contributors (see upstream repository for full list).  
- **License:** **GNU General Public License, version 2 or any later version** (“GPL-2.0-or-later”).  
  - Full license text: <https://www.gnu.org/licenses/old-licenses/gpl-2.0.html>  
  - Upstream copy in repository: <https://github.com/jgm/pandoc/blob/master/COPYRIGHT>  
- **Corresponding source (for the GPL-covered program):**  
  <https://github.com/jgm/pandoc>  
  Use the tag or release that matches the Pandoc binary you ship (see `get_pandoc_version` in the app or your build logs).

### How DocShift uses Pandoc

DocShift does **not** link Pandoc into its Rust or JavaScript code as a library. It runs the **Pandoc executable** that you ship under `src-tauri/binaries/` (or equivalent) as a **separate process**. That arrangement is commonly treated as an **aggregate work**: DocShift and Pandoc remain separate programs; GPL obligations apply to **Pandoc** and to your distribution of the Pandoc binary, not to DocShift’s own MIT-licensed source **solely** because of this invocation pattern—**provided** you honor GPL terms for the Pandoc binary (notices, offer of source, etc.).

### GPL compliance checklist (for the Pandoc binary you distribute)

1. **Include license and copyright notice** for Pandoc with the application (this file satisfies the notice requirement; you may also show a short notice in the app UI, e.g. Settings → About).  
2. **Identify the GPL version** (GPL-2.0-or-later, as upstream).  
3. **Make corresponding source available** for the same version of Pandoc you ship—e.g. link to the matching GitHub tag and/or host a source archive. Partner Center and end users should be able to obtain Pandoc’s source without unreasonable effort.  
4. **Do not remove** upstream copyright or license files from any source redistribution of Pandoc you perform.

If you modify Pandoc’s source and distribute the result, GPL requirements for modified works apply to that derivative; seek legal advice.

---

## Other dependencies

Runtime and build-time libraries (Rust crates, npm packages) have their own licenses. Their texts are in each package’s repository or in `Cargo.lock` / `package-lock.json` metadata. For Store submission, Pandoc is the **copyleft** component that needs explicit disclosure.

---

*This file is provided for transparency and distributor convenience. It is not legal advice.*
