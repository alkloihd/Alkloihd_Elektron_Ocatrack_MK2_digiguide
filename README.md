# Octatrack MK2 Interactive Tutorial System

```
  ___  ___    _____  ___  ___     ___  ___  ___    ___   __ _
 / _ \/ __|  |_   _|/ _ \|_ _|   / _ \/ __|/ __|  | __| / _` |
| (_) \__ \    | | | (_) || |   | (_) \__ \\\__ \  | _| | (_| |
 \___/|___/    |_|  \___/|___|   \___/|___/|___/  |___| \__,_|

Interactive browser-based learning for Elektron Octatrack MK2
No dependencies. No build step. Just open and learn.
```

An interactive, browser-based learning system for the **Elektron Octatrack MK2**. Master the machine through guided tutorials, interactive exercises, real-time calculators, and built-in quizzes.

**Perfect for:** Beginners jamming with loops, intermediate users chopping samples, anyone who wants to understand the Octatrack inside-out.

---

## What's Inside

This repository contains **8 tutorials** across two tiers, covering everything from your first power-on to advanced multi-section arrangements. All tutorials run in your browser with zero setup.

### Tier 1: The Foundations

| Tutorial          | Topic                   | Duration | You'll Learn                                    |
| ----------------- | ----------------------- | -------- | ----------------------------------------------- |
| 🚀 Set Sail       | Your First Steps        | 15 min   | Power on, navigate menus, the big picture       |
| 📦 Load & Lock    | Static vs Flex Machines | 20 min   | RAM budgeting, when to use each machine type    |
| 🥁 Beat Basics    | Your First Pattern      | 25 min   | Creating patterns, placing trigs, tempo         |
| 🎵 The Audio Pool | Samples & Organization  | 20 min   | Folder structure, WAV format, sample management |

### Tier 2: Core Manipulation

| Tutorial                 | Topic                      | Duration | You'll Learn                                             |
| ------------------------ | -------------------------- | -------- | -------------------------------------------------------- |
| ✂️ Slice & Dice          | Chopping Loops             | 30 min   | Slicing, grid-based chopping, beat mangling              |
| 🔒 Sample Locks          | Multiple Clips Per Track   | 25 min   | Sample locks, rapid clip switching, dynamic arrangements |
| ⏱️ Loop Stretching       | Timestretch & BPM          | 25 min   | Matching tempos, preserving pitch, flex time-stretching  |
| 🏛️ Parts, Banks & Scenes | Multi-Section Arrangements | 30 min   | Banks, parts, scenes, crossfader transitions             |

### Tier 3+4 (Coming Soon)

- Trig Conditions & Probability
- Resampling & Creative Recording
- Effects Chains & Neighbor Tracks
- LFOs & Modulation Depth
- Live Performance & External Gear

---

## Quick Start

### Prerequisites

- Python 3.x (for local server)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No npm, no build tools, no dependencies

### Running Locally

```bash
# If you're at the source repo root:
cd "exercises/HTML TUTORIALS"

# Start the Python HTTP server
python3 -m http.server 8080

# Open in your browser
open http://localhost:8080
# Or visit: http://localhost:8080 in any browser
```

That's it. You're in.

### Run From Terminal (No IDE Required)

You can run this from a plain terminal on any major OS.

#### macOS / Linux

```bash
cd "exercises/HTML TUTORIALS"
python3 -m http.server 8080
```

Open: `http://localhost:8080`

#### Windows (PowerShell)

```powershell
cd "exercises/HTML TUTORIALS"
py -m http.server 8080
```

Open: `http://localhost:8080`

#### Windows (Command Prompt)

```bat
cd exercises\HTML TUTORIALS
py -m http.server 8080
```

Open: `http://localhost:8080`

If `py` is not available on Windows, try:

```bat
python -m http.server 8080
```

---

## Features

### Learning Experience

- **Dark, Brutalist UI** — clean typography, music-production aesthetic, neon accents
- **Interactive Diagrams** — hardware layouts, signal flow charts, decision trees (SVG)
- **Step-by-Step Exercises** — button presses, menu paths, real hardware procedures
- **Confidence Ratings** — self-assess your understanding (1–5 scale) per tutorial
- **Built-in Quizzes** — 4 questions per tutorial to verify what you've learned
- **Time Tracking** — see how long each tutorial took you

### Interactive Tools

- **RAM Calculator** — instantly see how much flex RAM you're using
- **Format Validator** — check if your WAV files are OT-compatible
- **BPM Filename Tester** — verify auto-detection (85–170 BPM range)
- **Step Sequencer Simulator** — place trigs, hear patterns
- **Crossfader Demo** — visualize scene transitions and equal-energy crossfading
- **Waveform Slicer** — interactive grid slicing with zero-crossing snap

### Progress Tracking

- **Automatic Saves** — progress persists in your browser's localStorage
- **Section Completion** — tracks which sections you've read (IntersectionObserver)
- **Dashboard View** — index.html shows overall completion, confidence trends, streaks
- **Export Your Data** — download progress as JSON for backup or sharing
- **Reset Anytime** — clear progress and start fresh from the footer

### Technical Highlights

- **Single-File Tutorials** — each tutorial is one self-contained HTML file (no build step)
- **Vanilla JS** — no frameworks, no dependencies (except Google Fonts)
- **Responsive Design** — works on desktop, tablet, and mobile
- **Fast Load Times** — all CSS/JS inlined; minimal HTTP requests
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation

---

## Project Structure

```
HTML TUTORIALS/
├── README.md                           # This file
├── index.html                          # Dashboard (tutorial overview & progress)
├── 01-set-sail.html                    # Tutorial 1: Your First Steps
├── 02-load-and-lock.html               # Tutorial 2: Static vs Flex Machines
├── 03-beat-basics.html                 # Tutorial 3: Your First Pattern
├── 04-audio-pool.html                  # Tutorial 4: Samples & Organization
├── 05-slice-and-dice.html              # Tutorial 5: Chopping Loops
├── 06-sample-locks.html                # Tutorial 6: Multiple Clips Per Track
├── 07-loop-stretching.html             # Tutorial 7: Timestretch & BPM
├── 08-parts-banks-scenes.html          # Tutorial 8: Multi-Section Arrangements
├── data/
│   └── progress.json                   # (Optional) server-side progress store
└── assets/
    └── (Future) hardware photos, screenshots, SVG reference files
```

Each tutorial HTML file is fully self-contained. No external CSS files, no build step.

---

## How to Use

### For Students

1. **Start with the Dashboard** — open `index.html` to see all tutorials and your progress
2. **Pick a Tutorial** — click any tutorial to begin
3. **Read, Watch, Interact** — follow the step-by-step sections
4. **Rate Your Confidence** — honest self-assessment helps you identify weak spots
5. **Take the Quiz** — verify you understood the material
6. **Track Progress** — your dashboard auto-updates as you complete tutorials

### For Developers / Contributors

1. **Create a New Tutorial** — copy an existing tutorial HTML file as a template
2. **Follow the Design System** — use the same CSS variables, structure, and interactive patterns
3. **Use localStorage** — save state with key `octatrack-tutorials-{tutorial-id}`
4. **Add Navigation** — include prev/next tutorial links at the bottom
5. **Update the Dashboard** — add your tutorial to the config in `index.html`
6. **Test Locally** — run `python3 -m http.server 8080` and verify in your browser

### Tutorial Template Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>[Tutorial Title] • Octatrack Tutorials</title>
    <style>
      /* Inline CSS using design system variables */
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Tutorial header, metadata, objectives -->
      <!-- Sections with content, diagrams, exercises -->
      <!-- Quiz -->
      <!-- Confidence rating -->
      <!-- Next/previous tutorial links -->
    </div>
    <script>
      // Inline JavaScript for interactivity
    </script>
  </body>
</html>
```

---

## Data & Progress

### How Progress is Saved

- **localStorage Key:** `octatrack-tutorials` (JSON object)
- **Stored Data:**
  - Tutorial completion status (0–100%)
  - Confidence ratings (1–5 scale)
  - Time spent per tutorial
  - Quiz scores
  - Timestamp of last update

- **Persistence:** Data survives browser restart and persists across sessions
- **Privacy:** Everything stays on your device; nothing sent to servers

### Resetting Progress

1. Open the **Dashboard** (`index.html`)
2. Scroll to the footer
3. Click **"Reset All Progress"**
4. Confirm

Your browser's localStorage will be cleared for the `octatrack-tutorials` key.

### Exporting Progress

From the dashboard footer, click **"Export My Data"** to download a JSON file of your progress. Use this for backup or analysis.

---

## Design System

### Color Palette

- **Background:** `#0a0a0a` (deep black)
- **Text (primary):** `#f0f0f0` (off-white)
- **Text (secondary):** `#888888` (gray)
- **Accent (primary):** `#00ff00` (neon green)
- **Accent (secondary):** `#ff00ff` (neon magenta)
- **Accent (tertiary):** `#00ffff` (neon cyan)
- **Borders:** `#222222` (dark gray)

### Typography

- **Headlines:** Space Mono (monospace, bold, 1.2 line height)
- **Body:** Inter (sans-serif, 16px, 1.6 line height)
- **Code:** Space Mono (monospace)

### Interactive Elements

- **Buttons:** Dark background, neon borders, scale on hover
- **Inputs:** Dark background, neon focus states
- **Diagrams:** SVG with neon strokes, white fills
- **Quizzes:** Multi-choice with instant feedback (green for correct, red for wrong)

---

## Roadmap

### Phase 1 (Current)

- [x] 8 foundational & intermediate tutorials
- [x] Progress tracking with localStorage
- [x] Interactive diagrams and tools
- [x] Quiz system
- [x] Confidence ratings
- [x] Dashboard with stats

### Phase 2 (Planned)

- [ ] Notes/notepad per tutorial (user annotations)
- [ ] Photo integration (Octatrack hardware mapped to SVGs)
- [ ] Keyboard navigation guide (all OT hotkeys)
- [ ] Video embeds (official Elektron + community tutorials)

### Phase 3 (Planned)

- [ ] Tier 3 tutorials: Trig Conditions, Resampling, Effects & Neighbors
- [ ] Tier 4 tutorials: LFOs & Modulation, Live Performance, External Gear Integration

### Phase 4+ (Future)

- [ ] AI-powered Q&A chatbot (local or API-based)
- [ ] Cloud deployment with user accounts (Firebase or similar)
- [ ] Mobile app (React Native or Flutter)
- [ ] Offline-first PWA with service workers
- [ ] Community contributions (GitHub pull requests)

---

## Troubleshooting

### Tutorials won't load

- **Check:** Is `python3 -m http.server 8080` running?
- **Fix:** Kill any existing server (`lsof -ti:8080 | xargs kill -9`), then restart

### Progress not saving

- **Check:** Is localStorage enabled in your browser?
- **Fix:** Go to Browser Settings > Privacy > ensure localStorage is allowed
- **Alternative:** Use a different browser (Chrome, Firefox, Safari all support localStorage)

### Quizzes not working

- **Check:** Are you using a modern browser (released in the last 3 years)?
- **Fix:** Update your browser or try a different one

### Videos not playing

- **Check:** Are you connected to the internet?
- **Note:** Video embeds (YouTube iframes) require internet connectivity

### Can't find a tutorial

- **Check:** Did you click the correct link from the dashboard?
- **Fix:** Go back to `index.html` and verify the tutorial exists

---

## Credits

**Created with:** Claude (Anthropic) as a learning tool for the Elektron Octatrack MK2 community.

**Content sourced from:**

- Official Elektron Octatrack MK2 Manual
- Merlin's Octatrack Guide (community reference)
- Octatrack Quick Start Guide
- Community knowledge and best practices

**Design inspiration:** Brutalist UI, music production software (Ableton Live, Max/MSP), Elektron's hardware aesthetic.

**Special thanks:** To the Octatrack community for feedback, bug reports, and ideas.

---

## License

**Free for personal use.** Share with fellow Octatrack users!

You may:

- Use these tutorials for learning
- Share the link with friends
- Print tutorials (for personal reference)
- Modify tutorials for your own learning (locally, not published)

You may not:

- Redistribute tutorials as your own work
- Sell or charge for access
- Remove credits or attribution

---

## Getting Help

### Found a bug?

- Note the tutorial name and section
- Describe what went wrong
- Include your browser version and OS

### Have an idea?

- Suggest new topics (Trig Conditions? Resampling? LFOs?)
- Propose new interactive tools
- Recommend improvements to existing tutorials

### Need more help?

- Check the official **Elektron Octatrack Manual** (referenced throughout)
- Visit **Elektronauts** (official community forum)
- Join the **Octatrack subreddit** (r/Octatrack)
- Ask in **Elektron Discord** servers

---

## Frequently Asked Questions

**Q: Can I use these tutorials offline?**
A: Not yet, but you can download the HTML files and open them directly (no internet needed). Video embeds will be broken, but all text and exercises work.

**Q: Will my progress sync across devices?**
A: Not automatically. Progress is stored locally on each device. To sync, export your progress from one device and import on another (coming in Phase 2).

**Q: Can I contribute tutorials?**
A: Yes! In Phase 3+, we'll accept community contributions via GitHub. Stay tuned.

**Q: Are these tutorials official Elektron content?**
A: No, but they're built on official documentation and community knowledge. Elektron hasn't endorsed or sponsored these tutorials, but they're accurate and freely shared.

**Q: What if I disagree with something in a tutorial?**
A: The Octatrack is deep—there's often more than one way to approach a task. If you find an error or outdated info, please report it.

---

## Changelog

### v1.0 (2026-03-02)

- Initial release
- 8 tutorials (Tiers 1–2)
- Progress tracking with localStorage
- Interactive tools and quizzes
- Dashboard with stats and reset functionality

---

## Support the Project

This project is free to use.

Like what you're using? Help me build more of these!

- https://paypal.me/Rishaal?locale.x=en_US&country.x=CA

If you'd rather support by sharing and feedback:

- **Share them** with other Octatrack users
- **Give feedback** — what topics should Tier 3 cover?
- **Contribute ideas** for interactive tools and exercises
- **Star this repo** if it's on GitHub (coming soon!)

---

## Creator

Built and curated by **alkloihd**.

- Instagram: https://www.instagram.com/alkloihd/
- Mixcloud: https://www.mixcloud.com/rish-ku/

---

**Happy learning. Make weird sounds. 🎛️**

---

## Acknowledgements (Short)

This project stands on the work of the broader Octatrack community:

- **Elektron** for the instrument, official manual, and support ecosystem
- **Merlin** for the definitive community guide and conceptual framework
- Educators including **Cuckoo**, **EZBOT**, **Dataline**, and other community teachers
- The **Elektronauts** community and related forums for techniques, troubleshooting, and shared workflows

For full attribution and links, see [credits.html](./credits.html).
