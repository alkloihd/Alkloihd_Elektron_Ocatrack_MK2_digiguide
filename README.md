# Alkloihd Elektron Octatrack MK2 DigiGuide

Interactive, browser-based tutorials for learning the **Elektron Octatrack MK2**.

This repository is a public, fork-friendly distribution of the tutorial platform: standalone HTML lessons, SVG hardware overlay, curated video references, and progress tracking in the browser.

## What You Get

- 8 hands-on tutorials (`01` through `08`)
- Interactive SVG Octatrack hardware overlay
- Visual flowcharts, checklists, quizzes, and confidence tracking
- Curated video gallery (`videos.html` + `data/videos.json`)
- Zero build step: open in a browser and learn

## Quick Start

```bash
git clone https://github.com/alkloihd/Alkloihd_Elektron_Ocatrack_MK2_digiguide.git
cd Alkloihd_Elektron_Ocatrack_MK2_digiguide
python3 -m http.server 8080
```

Open: `http://localhost:8080`

Start with [`index.html`](./index.html).

## Repository Structure

- `index.html` - tutorial dashboard
- `01-set-sail.html` ... `08-parts-banks-scenes.html` - lessons
- `videos.html` - embedded tutorial video gallery
- `assets/` - SVG overlay engine + visual assets
- `data/` - overlay map, tooltips, videos, progress seed
- `docs/` - audit notes and support docs

## Intended Use

This repo is designed so you can:

1. Fork it and host it as-is (GitHub Pages, Netlify, Vercel static hosting, etc.)
2. Customize lessons, styling, and mappings for your own learning path
3. Extend with additional advanced tutorials (Tier 3/4)

## Notes for Contributors

- Keep tutorials standalone HTML files (no framework required).
- Keep Octatrack control references in bracket notation: `[FUNC]`, `[TRIG 1]`, `[AED]`, etc.
- Validate mapping consistency when editing overlays:

```bash
python3 .claude/skills/reviewing-quality/scripts/bracket-audit.py --all
python3 .claude/skills/reviewing-quality/scripts/mapping-validator.py --all
```

(These scripts exist in the source/private development repo; public repo consumers can still use the content without them.)

## Roadmap

Next tutorial set targets:

- Trig conditions and probability
- Resampling workflows
- FX chains and Neighbor machines
- LFO design and modulation strategy

## License

MIT - see [LICENSE](./LICENSE)

## Acknowledgements (Short)

Built by **Alkloihd** with gratitude to the wider Octatrack learning community:

- **Elektron** for the hardware, manual, and official support resources
- **Merlin** for the community guide that shaped how many users understand the machine
- Educators including **Cuckoo**, **EZBOT**, **Dataline**, and other creators sharing practical workflows
- The **Elektronauts** forum and related communities for years of user-led troubleshooting and knowledge sharing

Full attribution and links are available in [`credits.html`](./credits.html).
