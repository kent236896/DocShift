# DocShift — Copyright and distribution notice

## DocShift application (this repository)

- **License:** See [`LICENSE`](LICENSE) (MIT), unless you replace it with another license you own or have rights to use.
- **Copyright:** Replace the copyright line in `LICENSE` with your legal name or entity before publishing to the Microsoft Store (Partner Center will expect a consistent rights holder).

DocShift is a separate work from Pandoc: it invokes the Pandoc executable as a **standalone bundled program** (aggregate distribution). DocShift’s own source code is not derived from Pandoc’s source code.

## Bundled third-party software

Pandoc is bundled under the **GNU General Public License, version 2 or later**. Full attribution, source pointers, and compliance notes are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## Privacy

See [`PRIVACY.md`](PRIVACY.md). Host the same content at a **public HTTPS URL** and enter that URL in Microsoft Partner Center as your **Privacy policy**.

## Microsoft Store — practical checklist

1. **Privacy policy URL:** Publish `PRIVACY.md` (same wording) on a public page (e.g. GitHub Pages or your site) and link it in Partner Center.
2. **Store listing:** Mention that conversion is performed locally and that Pandoc is included under GPLv2+; link to `THIRD_PARTY_NOTICES.md` or your hosted copy.
3. **In-product:** Settings already references Pandoc; keep `THIRD_PARTY_NOTICES.md` and `PRIVACY.md` shipped with the app (see `tauri.conf.json` `bundle.resources`).

This document is not legal advice. For commercial or Store-specific obligations, consult qualified counsel.
