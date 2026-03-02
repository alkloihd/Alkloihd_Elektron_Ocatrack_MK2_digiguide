# Octatrack MK2 Interactive Tutorial System

```
    ___       __       __ __    __       ____     ____   __  __   ____
   /   |     / /      / //_/   / /      / __ \   /  _/  / / / /  / __ \
  / /| |    / /      / ,<     / /      / / / /   / /   / /_/ /  / / / /
 / ___ |   / /___   / /| |   / /___   / /_/ /  _/ /   / __  /  / /_/ /
/_/  |_|  /_____/  /_/ |_|  /_____/   \____/  /___/  /_/ /_/  /_____/

Interactive browser-based learning for Elektron Octatrack MK2
No dependencies. No build step. Just open and learn.
```

An interactive, browser-based learning system for the **Elektron Octatrack MK2**. Master the machine through guided tutorials, interactive exercises, real-time calculators, and built-in quizzes.

**Perfect for:** Beginners jamming with loops, intermediate users chopping samples, anyone who wants to understand the Octatrack inside-out.

**Like what you're using?** Help me build more tutorials, or request a new topic with a donation:
https://paypal.me/Rishaal?locale.x=en_US&country.x=CA

---

## What's Inside

This repository contains **16 tutorials** across four tiers, covering everything from your first power-on to live DJ performance. All tutorials run in your browser with zero setup.

### Tier 1: Foundation

| Tutorial          | Topic                   | Duration | You'll Learn                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------ |
| 01 Set Sail       | Your First Steps        | 15 min   | Power on, navigate menus, Sets/Projects/Banks/Patterns |
| 02 Load & Lock    | Static vs Flex Machines | 20 min   | RAM budgeting, when to use each machine type           |
| 03 Beat Basics    | Your First Pattern      | 25 min   | Grid recording, placing trigs, tempo, mixer basics     |
| 04 The Audio Pool | Samples & Organization  | 20 min   | Folder structure, WAV format, BPM auto-detection       |

### Tier 2: Core Techniques

| Tutorial                 | Topic                      | Duration | You'll Learn                                         |
| ------------------------ | -------------------------- | -------- | ---------------------------------------------------- |
| 05 Slice & Dice          | Chopping Loops             | 30 min   | Grid/manual slicing, zero-crossing, sample chains    |
| 06 Sample Locks          | Multiple Clips Per Track   | 25 min   | Sample locks, rapid clip switching, dynamic patterns |
| 07 Loop Stretching       | Timestretch & BPM          | 25 min   | Matching tempos, preserving pitch, TSTR modes        |
| 08 Parts, Banks & Scenes | Multi-Section Arrangements | 30 min   | Banks, parts, scenes, crossfader, XVOL               |

### Tier 3: Advanced Sequencing

| Tutorial             | Topic                   | Duration | You'll Learn                                             |
| -------------------- | ----------------------- | -------- | -------------------------------------------------------- |
| 09 Trig Conditions   | Conditional Logic       | 25 min   | FILL, probability, A:B counting, pattern variation       |
| 10 Resampling        | Creative Recording      | 30 min   | SRC3 setup, recorder trigs, CUE trick, saving recordings |
| 11 FX & Neighbors    | Effects Chains          | 30 min   | FX1/FX2, Neighbor machines, Thru machines, master bus    |
| 12 LFOs & Modulation | Bringing Tracks to Life | 30 min   | 3 LFOs/track, LFO Designer, meta-modulation              |

### Tier 4: Performance & Integration

| Tutorial            | Topic                    | Duration | You'll Learn                                        |
| ------------------- | ------------------------ | -------- | --------------------------------------------------- |
| 13 Arranger         | Pattern Chaining & Songs | 30 min   | 256-row arranger, HALT/LOOP/JUMP, per-row BPM       |
| 14 MIDI Sequencing  | External Gear & Sync     | 30 min   | MIDI tracks, arpeggiator, CC automation, clock sync |
| 15 Pickup Machines  | Live Looping             | 25 min   | Master/slave, overdub, foot controller, RAM budget  |
| 16 Performance & DJ | Putting It All Together  | 35 min   | Scenes, crossfader, master bus, live set building   |

---

## Quick Start

### Prerequisites

- Python 3.x (for local server)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No npm, no build tools, no dependencies

### Running Locally

```bash
cd "site"
python3 -m http.server 8080
```

Open: `http://localhost:8080`

That's it. You're in.

#### Windows (PowerShell)

```powershell
cd "site"
py -m http.server 8080
```

#### Windows (Command Prompt)

```bat
cd site
py -m http.server 8080
```

If `py` is not available on Windows, try `python -m http.server 8080`.

---

## Features

### Interactive Hardware Overlay

Every tutorial includes a **real-time SVG overlay** of the Octatrack MK2 hardware. As you scroll through sections, the overlay highlights the buttons and encoders being discussed. Click any control for detailed info pulled from the official manual and Merlin's Guide.

- 68+ mapped hardware controls (buttons, encoders, faders)
- Tooltips with function descriptions, combos, tips, and common mistakes
- Animated button sequences showing multi-step procedures
- Section-aware: overlay follows your reading position

### Theme System

Switch between **Dark**, **Light**, and **System** (auto-detect OS preference) themes. Your choice persists across sessions via localStorage.

### Learning Experience

- **Step-by-Step Exercises** with exact button presses and menu paths
- **Confidence Ratings** (1-5 scale) per tutorial for honest self-assessment
- **Built-in Quizzes** (3-5 questions per tutorial) with instant feedback
- **Time Tracking** per tutorial and overall
- **YouTube Video Embeds** from educators like Cuckoo, EZBOT, and Elektron

### Interactive Tools

- **RAM Calculator** — Flex memory budget at a glance
- **Step Sequencer Simulator** — place trigs, visualize patterns
- **Crossfader Demo** — scene transitions with equal-energy (XVOL) visualization
- **Waveform Slicer** — interactive grid slicing with zero-crossing snap
- **Arrangement Flow Simulator** — build arranger rows visually
- **LFO Waveform Visualizer** — see LFO shapes and modulation targets
- **MIDI Step Visualizer** — note entry and CC automation

### Progress Tracking

- **Automatic Saves** — progress persists in your browser's localStorage
- **Section Completion** — scroll tracking marks sections as you read them
- **Dashboard** — overall completion, confidence trends, streaks, quiz scores
- **Export / Reset** — download progress as JSON or start fresh

### Video Library

A curated collection of **97 YouTube tutorials** from the best Octatrack educators, searchable and filterable by topic. Add your own videos too.

---

## Project Structure

```
.
├── README.md
├── LICENSE
├── .github/workflows/ci.yml
├── docs/
│   ├── audit-report.md
│   ├── CONTENT-SYSTEM-README.md
│   └── SOURCES-MANIFEST.md
└── site/
    ├── index.html                    # Dashboard — progress, stats, tutorial grid
    ├── videos.html                   # Curated video library (97 videos)
    ├── credits.html                  # Full attribution and educator links
    ├── 01-set-sail.html ... 16-performance-and-dj.html
    ├── assets/
    │   ├── theme.css                 # Dark/Light/System theme
    │   ├── theme.js                  # Theme toggle (localStorage)
    │   └── svg-overlay.js            # Interactive hardware overlay engine
    └── data/
        ├── svg-overlay-map.json
        ├── button-tooltips.json
        ├── merlin-tips.json
        ├── videos.json
        └── progress.json
```

Each tutorial is a **self-contained HTML file** with inline CSS/JS. No build step, no bundler, no framework.

---

## How to Use

### For Learners

1. **Open the Dashboard** (`site/index.html`) to see all 16 tutorials and your progress
2. **Pick a tutorial** — start with Tier 1 if you're new, or jump to your level
3. **Read, watch, interact** — follow the step-by-step exercises
4. **Use the hardware overlay** — click buttons on the SVG to see what they do
5. **Rate your confidence** — honest self-assessment helps identify weak spots
6. **Take the quiz** — verify you understood the material
7. **Check the video library** — `site/videos.html` has 97 curated tutorials from top educators

### For Contributors

1. Copy an existing tutorial HTML file as a template
2. Follow the CSS custom properties in `site/assets/theme.css` for theming
3. Use `[BRACKET]` notation for hardware controls (powers the SVG overlay)
4. Add your tutorial to the config in `site/index.html`
5. Run `python3 -m http.server 8080` and test in browser

---

## Data & Progress

- **Storage:** localStorage (key: `octatrack-tutorials`)
- **Tracked:** completion %, confidence (1-5), quiz scores, time spent, sections read
- **Privacy:** Everything stays on your device. Nothing sent to any server.
- **Export:** Download progress as JSON from the dashboard footer
- **Reset:** Clear all progress from the dashboard footer (with confirmation)

---

## Design System

### Themes

| Mode           | Background  | Text          | Accents                     |
| -------------- | ----------- | ------------- | --------------------------- |
| Dark (default) | `#0a0a0a`   | `#e0e0e0`     | Cyan, Magenta, Lime, Orange |
| Light          | `#f5f5f5`   | `#2a2a2a`     | Adjusted for readability    |
| System         | Auto-detect | OS preference | Matches OS setting          |

### Typography

- **Headlines:** Space Mono (monospace, bold)
- **Body:** Inter (sans-serif, 16px)
- **Code:** Space Mono (monospace)

### Accents

- Cyan `#00ffff` — primary interactive elements
- Magenta `#ff00ff` — highlights, active states
- Lime `#00ff41` — success, correct answers
- Orange `#ffaa00` — warnings, tips

---

## Roadmap

### Completed

- [x] 16 tutorials across 4 tiers (Foundation through Performance)
- [x] Progress tracking with localStorage
- [x] Interactive hardware overlay with 68+ mapped controls
- [x] Dark/Light/System theme toggle
- [x] Dashboard with stats, streaks, and confidence trends
- [x] Video library with 97 curated tutorials
- [x] Built-in quizzes and confidence ratings
- [x] Credits page with full educator attribution

### Planned

- [ ] Notes/notepad per tutorial (user annotations)
- [ ] Offline-first PWA with service workers
- [ ] Community contributions via GitHub pull requests
- [ ] More interactive widgets and simulators

---

## Troubleshooting

| Problem                 | Fix                                                         |
| ----------------------- | ----------------------------------------------------------- |
| Tutorials won't load    | Make sure `python3 -m http.server 8080` is running          |
| Progress not saving     | Check that localStorage is enabled in your browser settings |
| Videos not playing      | Video embeds require an internet connection                 |
| SVG overlay not showing | Reload the page; check browser console for errors           |
| Theme not switching     | Clear localStorage key `ot-theme` and reload                |

---

## Credits

**Built with:** Claude (Anthropic) as a learning tool for the Elektron Octatrack MK2 community.

**Content sourced from:**

- Official Elektron Octatrack MK2 Manual (OS 1.40A)
- Merlin's Octatrack Guide (community reference)
- Octatrack Quick Start Guide

**Educators featured:** Cuckoo, EZBOT, Thavius Beck, Dataline, Red Means Recording, Elektron official

**Design inspiration:** Brutalist UI, music production software, Elektron's hardware aesthetic.

For full attribution and educator links, see [site/credits.html](./site/credits.html).

---

## License

**Free for personal use.** Share with fellow Octatrack users!

You may:

- Use these tutorials for learning
- Share the link with friends
- Print for personal reference
- Modify locally for your own learning

You may not:

- Redistribute as your own work
- Sell or charge for access
- Remove credits or attribution

---

## Changelog

### v2.0 (2026-03-02)

- 16 tutorials across 4 tiers (up from 8)
- Interactive SVG hardware overlay with 68+ mapped controls
- Dark/Light/System theme toggle
- Video library with 97 curated tutorials
- Credits page with full educator attribution
- Tier 3: Trig Conditions, Resampling, FX & Neighbors, LFOs & Modulation
- Tier 4: Arranger, MIDI Sequencing, Pickup Machines, Performance & DJ

### v1.0 (2026-03-02)

- Initial release: 8 tutorials (Tiers 1-2)
- Progress tracking with localStorage
- Interactive tools and quizzes
- Dashboard with stats

---

## Support the Project

This project is free to use and always will be.

**Like what you're using? Help me build more tutorials, or request a new topic with a donation:**

https://paypal.me/Rishaal?locale.x=en_US&country.x=CA

If you'd rather support by sharing:

- **Share** with other Octatrack users
- **Give feedback** — what topics should we cover next?
- **Star this repo** on GitHub
- **Contribute ideas** for interactive tools and exercises

---

## Creator

Built and curated by **alkloihd**.

- Instagram: https://www.instagram.com/alkloihd/
- Mixcloud: https://www.mixcloud.com/rish-ku/

---

## Acknowledgements

This project stands on the work of the broader Octatrack community:

- **Elektron** for the instrument, official manual, and support ecosystem
- **Merlin** for the definitive community guide and conceptual framework
- Educators including **Cuckoo**, **EZBOT**, **Dataline**, and other community teachers
- The **Elektronauts** community and related forums for techniques, troubleshooting, and shared workflows

For full attribution and links, see [site/credits.html](./site/credits.html).

---

**Happy learning. Make weird sounds.**
