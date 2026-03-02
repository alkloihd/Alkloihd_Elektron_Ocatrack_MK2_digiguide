# Octatrack Tutorial Web App — Future Roadmap

**Last Updated:** March 2, 2026
**Current Phase:** Phase 1 Complete ✓
**Next Phase:** Phase 2 (In Progress)

---

## Executive Summary

The Octatrack tutorial web app is entering expansion mode. Phase 1 delivered a solid foundation: 8 interactive tutorials, progress tracking, quizzes, and confidence ratings. This roadmap outlines the path to a full-featured, monetized learning platform with AI assistance, cloud sync, and hardware visualization.

**Vision:** Transform this into the go-to Octatrack learning resource — combining interactive tutorials, community insights, AI mentorship, and hands-on practice tracking.

---

## Current State (Phase 1 ✓)

### What's Live

- **8 Interactive HTML Tutorials** (Tier 1 + Tier 2)
  - Understanding Parts
  - Understanding Scenes
  - Sample Locks & Multiple Clips
  - Timestretch & Flex Machines
  - Audio Editor Basics
  - Slicing & Grid Slice
  - Recording & Playback Setup
  - Effects on Tracks

- **Dashboard (index.html)**
  - Learning path visualization
  - Progress stats (completion %, quiz scores, confidence ratings)
  - Tutorial cards with difficulty badges
  - Play button → launch tutorial

- **Local Progress Tracking**
  - localStorage-based (survives browser refresh)
  - Per-tutorial: completion %, quiz score, confidence rating
  - No cloud sync yet

- **Design System**
  - Brutalist dark theme (dark background, bright accent colors)
  - Clean typography, music-production aesthetic
  - Responsive layout
  - Inline CSS/JS (no build step)

- **Server Setup**
  - `python3 -m http.server 8080` from `exercises/HTML TUTORIALS/`
  - Access: `http://localhost:8080`

---

## Phase 2: Enhanced Learning Experience (Next Session)

### 2.1 Notes / Notepad System

**Why:** Rishaal needs a way to capture insights, gotchas, and personal discoveries while learning.

**Features:**

- [ ] Collapsible notepad panel on each tutorial page
  - "Notes" button in top-right corner
  - Toggles a side panel with a `<textarea>`
  - Rich text or simple markdown support

- [ ] Persistent storage (localStorage)
  - Key: `octatrack-notes-{tutorialId}`
  - Auto-save on every keystroke (debounced to 500ms)
  - Display character count + word count

- [ ] Notes Overview Page (`notes.html`)
  - Dashboard-style view of all notes across all tutorials
  - Grouped by tutorial (with tutorial icon/color)
  - Search across all notes
  - Copy/export button (all notes as single markdown)

- [ ] Export functionality
  - "Export Notes as Markdown" button
  - Generates file: `Octatrack_Learning_Notes_{date}.md`
  - Format: markdown with tutorial headers + timestamps

**Implementation Details:**

```html
<!-- Add to each tutorial page, before </body> -->
<div class="notes-panel hidden">
  <div class="notes-header">
    <h3>📝 Notes</h3>
    <button class="btn-close">×</button>
  </div>
  <textarea class="notes-input" placeholder="Your notes here..."></textarea>
  <div class="notes-meta">
    <span class="notes-word-count">0 words</span>
    <button class="btn-export-note">📥 Copy</button>
  </div>
</div>

<style>
  .notes-panel {
    position: fixed;
    right: 0;
    top: 60px;
    width: 300px;
    height: calc(100vh - 60px);
    background: #1a1a1a;
    border-left: 2px solid #ff6b00;
    padding: 16px;
    overflow-y: auto;
    z-index: 1000;
  }
  .notes-panel.hidden {
    display: none;
  }
</style>
```

**Effort:** ~2-3 hours (includes notes.html page + export)

---

### 2.2 Experience Questionnaire

**Why:** Qualitative feedback is as important as quiz scores. Helps track what's working and what needs rework.

**Features:**

- [ ] End-of-tutorial modal with 4-5 freeform questions
  - "What was the most confusing part?"
  - "What would you like to practice more?"
  - "Rate your hands-on experience (1-5 stars)"
  - "Any tips you discovered?"
  - "Confidence on this topic now: 1-5"

- [ ] Responses logged to localStorage
  - Key: `octatrack-feedback-{tutorialId}`
  - Include timestamp
  - Multiple responses per tutorial are appended (not overwritten)

- [ ] Feedback Overview Page
  - View all feedback from all tutorials
  - Sort by: tutorial, date, confidence rating
  - Highlight patterns (e.g., "Filter Effects is confusing" appears 3 times)

- [ ] Optional: "Skip" button (don't force completion)

**Implementation Details:**

```javascript
// Trigger after quiz completion
function showExperienceQuestionnaire(tutorialId) {
  const modal = createModal({
    title: 'How was the learning experience?',
    questions: [
      { id: 'confusing', label: 'What was most confusing?', type: 'textarea' },
      { id: 'practice', label: 'What to practice more?', type: 'textarea' },
      { id: 'hands_on', label: 'Hands-on experience:', type: 'stars' },
      { id: 'tips', label: 'Any tips discovered?', type: 'textarea' },
    ],
  });

  modal.onSubmit = (responses) => {
    const key = `octatrack-feedback-${tutorialId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...responses, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
  };
}
```

**Effort:** ~2 hours

---

### 2.3 Progress Reset System

**Why:** Rishaal might want to re-learn a tutorial or start fresh. Give granular control.

**Features:**

- [ ] Per-tutorial reset
  - Settings button (⚙️) on each tutorial
  - "Reset this tutorial" with confirmation modal
  - Clears: progress %, quiz score, confidence, notes, feedback

- [ ] Tier reset
  - Dashboard: "Reset all Tier 1 tutorials" / "Reset all Tier 2"
  - Confirmation: "This will clear progress on 4 tutorials. Continue?"

- [ ] Full reset
  - "Nuclear option" button on dashboard (well-hidden)
  - "Completely clear all progress, notes, feedback"
  - Triple confirmation (email-like UX)

- [ ] Confirmation Modal Pattern
  ```html
  <div class="modal-confirm">
    <h2>Reset All Progress?</h2>
    <p>This action cannot be undone.</p>
    <input type="checkbox" />
    I understand this is permanent
    <button class="btn-danger">Reset Everything</button>
    <button class="btn-cancel">Never mind</button>
  </div>
  ```

**Effort:** ~1.5 hours

---

### 2.4 Photo Integration from PDF Manuals

**Why:** Visual reference is essential. Extract hardware diagrams and photos from the official manuals.

**Prerequisites:**

- `poppler-utils` installed (for `pdfimages`)
- Python 3 script to batch-extract

**Steps:**

1. [ ] Identify manual PDFs
   - Official Octatrack MK2 Manual
   - Merlin's Guide
   - (Already in `knowledge/` folder)

2. [ ] Extract images using Python

   ```bash
   # Install poppler (if not present)
   brew install poppler

   # Extract images from PDF
   pdfimages -png knowledge/octatrack-manual.pdf assets/manual-
   ```

3. [ ] Organize extracted images
   - Move to `assets/manual-photos/`
   - Rename with descriptive names: `ot-top-panel.png`, `screen-pattern-page.png`, etc.
   - Compress PNGs (60-100 KB per image)

4. [ ] Map photos to tutorials
   - Example: "Audio Editor Basics" → include `assets/manual-photos/audio-editor-menu.png`
   - Add captions with reference numbers (e.g., "Fig 3.2 from manual")
   - Link caption to full manual page number

5. [ ] Create an Assets Index (`assets/INDEX.md`)
   - Map each extracted image to its tutorial
   - Track which manual page it came from
   - Licensing note (official manual images)

**Implementation Example:**

```html
<!-- In a tutorial -->
<div class="figure">
  <img src="assets/manual-photos/audio-editor-menu.png" alt="Audio Editor menu" />
  <figcaption>
    The Audio Editor menu (Manual, p. 87)
    <a href="#" class="manual-ref">[Full page]</a>
  </figcaption>
</div>
```

**Effort:** ~3-4 hours (extraction + organization + mapping)

---

### 2.5 README & Documentation

**Why:** Make the tutorial system easy to share, maintain, and extend.

**Create:** `/exercises/HTML TUTORIALS/README.md`

**Contents:**

- Overview of the tutorial system
- How to serve locally (`python3 -m http.server 8080`)
- Tutorial structure (directory layout)
- Adding a new tutorial (template + checklist)
- Progress tracking (what localStorage keys exist)
- Maintenance notes (updating assets, fixing bugs)
- Known issues & TODO

**Effort:** ~1 hour

---

## Phase 2 Summary

| Task                       | Effort      | Priority  | Status |
| -------------------------- | ----------- | --------- | ------ |
| Notes/notepad system       | 2-3h        | 🔴 High   | —      |
| Experience questionnaire   | 2h          | 🔴 High   | —      |
| Progress reset system      | 1.5h        | 🟡 Medium | —      |
| Photo extraction from PDFs | 3-4h        | 🟡 Medium | —      |
| README documentation       | 1h          | 🟢 Low    | —      |
| **Phase 2 Total**          | **~10-11h** | —         | —      |

---

## Phase 3: Content Expansion & Hardware Visualization (Week 2-3)

### 3.1 Tier 3 Tutorials

**New tutorials to create:**

- [ ] **Trig Conditions Deep Dive**
  - FILL, !FILL, 1ST, X% probability
  - A:B, PRE, NEI conditions
  - Real examples: polyrhythmic patterns, fills, conditional effects
  - Interactive condition builder (click to create patterns)

- [ ] **Resampling & Mangling**
  - Recorder setup (SRC3, RLEN, one-shot trig)
  - The "tape loop" resampling workflow
  - Adding effects while recording
  - Volatility gotcha (save before power-off)

- [ ] **Effects Chains & Routing**
  - Track effects (FX1 + FX2)
  - Neighbor machine chaining
  - Effect automation with p-locks
  - Master bus trick (Track 8 as Thru + Compressor)

- [ ] **Static vs. Flex Deep Dive**
  - RAM budgeting (2.6 MB/min for 16-bit mono)
  - When to use each
  - Mixing Static stems with Flex one-shots
  - Performance considerations

**Template for New Tutorials:**

```html
<!-- Copy this structure -->
<!DOCTYPE html>
<html>
  <head>
    <title>Tutorial: [Name] — Octatrack Learning</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      /* All CSS inline */
      :root {
        --bg: #0a0a0a;
        --fg: #e0e0e0;
        --accent: #ff6b00;
      }
      /* ... (copy from existing tutorials) */
    </style>
  </head>
  <body>
    <!-- Header -->
    <header class="tutorial-header">
      <h1>[Title]</h1>
      <div class="meta">
        <span class="badge-difficulty">Intermediate</span>
        <span class="estimated-time">45 minutes</span>
      </div>
    </header>

    <!-- Learning Objectives -->
    <section class="objectives">
      <h2>What You'll Learn</h2>
      <ul>
        <li>Objective 1</li>
        <li>Objective 2</li>
      </ul>
    </section>

    <!-- Main Content (sections) -->
    <section class="content-section">
      <h2>Section 1</h2>
      <!-- ... -->
    </section>

    <!-- Interactive Component (e.g., quiz, simulator) -->
    <section class="interactive">
      <h2>Try It Out</h2>
      <!-- ... -->
    </section>

    <!-- Quiz -->
    <section class="quiz">
      <h2>Test Yourself</h2>
      <!-- ... -->
    </section>

    <!-- Confidence Rating -->
    <section class="confidence-rating">
      <!-- ... -->
    </section>

    <!-- Notes Panel -->
    <div class="notes-panel hidden">
      <!-- ... (shared component) -->
    </div>

    <script>
      const TUTORIAL_ID = 'trig-conditions';
      // ... (JavaScript, shared patterns)
    </script>
  </body>
</html>
```

**Effort:** ~15-20 hours (4 tutorials × 4-5 hours each)

---

### 3.2 SVG Hardware Replicas

**Why:** Interactive hardware diagrams make learning much more tangible.

**Approach 1: Gemini-Assisted Tracing (Recommended)**

- Use Google Gemini's image-to-SVG capability
- Provide extracted photos from Phase 2
- Request detailed SVG outlines of:
  - OT MK2 top panel (all buttons, encoder, LEDs, crossfader)
  - Rear I/O panel (USB, audio in/out, sync)
  - Screen mockups (various menu pages)

**Approach 2: Manual SVG Creation**

- Use Inkscape or Adobe Illustrator
- Trace from manual photos
- More time-consuming but pixel-perfect

**Deliverables:**

1. [ ] **Top Panel SVG** (`assets/svg/ot-top-panel.svg`)
   - All 16 trig buttons (with labels)
   - Encoder ring (FUNC, DATA, TRIG, and rotary labels)
   - Crossfader with A/B labels
   - Track select buttons
   - Mode buttons (GRID, RECORD, etc.)
   - Interactive: hover on button → highlight in tutorials, click → navigate

2. [ ] **Screen Mockups** (`assets/svg/screen-*.svg`)
   - Pattern selection page
   - Audio Editor menu
   - Machine browser
   - Effects page
   - Scene selection
   - Can be simplified (white text on black background)

3. [ ] **Rear I/O Panel** (`assets/svg/ot-rear-panel.svg`)
   - USB connector
   - Audio I/O pairs (A/B, C/D, CUE)
   - Sync in/out
   - Power

4. [ ] **Interactive Hardware Guide** (`hardware.html`)
   - Embed main panel SVG
   - Hover over any button → show what it does
   - Click any button → jump to relevant tutorial
   - Build up understanding progressively

**Example SVG Integration:**

```html
<svg class="interactive-panel" viewBox="0 0 1024 200">
  <!-- Top panel outline -->
  <rect class="panel-bg" width="1024" height="200" fill="#222" />

  <!-- Trig buttons (row of 16) -->
  <g class="trig-buttons">
    <button class="trig-btn" data-button="trig-1" data-tutorial="sample-locks">
      <circle cx="50" cy="50" r="20" fill="#ff6b00" />
      <text>1</text>
    </button>
    <!-- ... repeat 16 times -->
  </g>

  <!-- Crossfader -->
  <g class="crossfader" data-tutorial="scenes">
    <rect class="fader-track" width="150" height="30" />
    <rect class="fader-handle" width="10" height="30" x="75" />
  </g>
</svg>

<script>
  document.querySelectorAll('[data-tutorial]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const tutorialId = el.dataset.tutorial;
      window.location.href = `${tutorialId}.html`;
    });
  });
</script>
```

**Effort:** ~6-8 hours (extraction + creation + interactive scripting)

---

### 3.3 Basic AI Chat Widget (Direct API)

**Why:** Context-aware help without leaving the tutorial.

**Phase 3.3 Scope: Simple, direct API calls**

- User provides their own Anthropic API key (stored in localStorage, not sent to any server)
- Small chat widget on each tutorial page (bottom-right)
- Uses tutorial content as system prompt
- Single session per tutorial (cleared on refresh)

**Features:**

- [ ] Chat widget UI
  - Minimized: small chat bubble icon (bottom-right)
  - Expanded: chat window with message history
  - Textarea for user input
  - "Send" button or Enter to submit

- [ ] API Key Management
  - First time: "Enter your Claude API key" modal
  - Key stored in localStorage (scoped to tutorial domain)
  - "Reset API key" button in settings

- [ ] System Prompt

  ```
  You are an Octatrack MK2 learning assistant. The user is currently learning about [TUTORIAL_TOPIC].

  Context: [INSERT TUTORIAL CONTENT HERE]

  Keep answers focused on the current topic. Use the official manual and Merlin's Guide when relevant.
  Reference specific button presses, menu paths, and page numbers.
  Be encouraging and practical.
  ```

- [ ] Frontend Implementation

  ```javascript
  async function sendChatMessage(userMessage, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6', // Use the fastest model for chat
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [...chatHistory, { role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  }
  ```

- [ ] Limitations & Warnings
  - Display: "This uses your API key directly. Cost ~$0.01 per message."
  - Rate limit: max 10 messages per session
  - Store chat history in localStorage for context carry-over

**Effort:** ~3-4 hours

---

### 3.4 Export Progress & Notes

**Why:** Let Rishaal archive learning for reference.

**Features:**

- [ ] "Export All" button on dashboard
  - Generates ZIP file with:
    - `progress.json` (all quiz scores, confidence ratings)
    - `notes.md` (all notes organized by tutorial)
    - `feedback.json` (questionnaire responses)
    - Timestamp: `octatrack-learning-backup-2026-03-02.zip`

- [ ] Implementation (client-side only)

  ```javascript
  function exportAllProgress() {
    const zip = new JSZip();

    // Collect all data from localStorage
    const progress = JSON.parse(localStorage.getItem('octatrack-progress') || '{}');
    const notes = getAllNotes(); // helper function
    const feedback = getAllFeedback();

    zip.file('progress.json', JSON.stringify(progress, null, 2));
    zip.file('notes.md', notesToMarkdown(notes));
    zip.file('feedback.json', JSON.stringify(feedback, null, 2));

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `octatrack-learning-backup-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
    });
  }
  ```

**Note:** Requires `jszip.js` library (add to `<script src>`)

**Effort:** ~2 hours

---

## Phase 3 Summary

| Task                                | Effort      | Priority  | Status |
| ----------------------------------- | ----------- | --------- | ------ |
| Tier 3 tutorials (4 tutorials)      | 15-20h      | 🔴 High   | —      |
| SVG hardware replicas + interactive | 6-8h        | 🟡 Medium | —      |
| Basic AI chat widget                | 3-4h        | 🔴 High   | —      |
| Export all progress/notes           | 2h          | 🟢 Low    | —      |
| **Phase 3 Total**                   | **~26-34h** | —         | —      |

---

## Phase 4: Cloud Infrastructure & Authentication (Month 2)

### 4.1 Firebase Setup

**Why:** Enable cloud sync, user accounts, and secure API access.

**Architecture:**

```
┌─────────────────────────────────────────────────┐
│         Frontend (Static HTML)                   │
│         (Firebase Hosting)                       │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Firebase Auth      │
        │  (email/password)   │
        └──────────┬──────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐ ┌─────▼──────┐ ┌───▼─────────┐
│Firestore│ │   Storage  │ │Cloud        │
│(progress)│ │(PDF, images)│ │Functions    │
└─────────┘ └────────────┘ │(API proxy)  │
                            └─────┬───────┘
                                  │
                        ┌─────────▼────────┐
                        │ Anthropic API    │
                        │ (Claude)         │
                        └──────────────────┘
```

**Tasks:**

1. [ ] Create Firebase project
   - Go to https://console.firebase.google.com
   - Create new project: `octatrack-tutorials`
   - Enable Firestore Database (production mode, with security rules)
   - Enable Authentication (email/password)
   - Enable Hosting

2. [ ] Firestore Schema

   ```
   users/
     {uid}/
       email: string
       createdAt: timestamp
       isPaid: boolean
       aiCreditBalance: number

   progress/
     {uid}/
       {tutorialId}/
         completionPercent: number
         quizScore: number
         confidenceRating: number
         lastUpdated: timestamp

   notes/
     {uid}/
       {tutorialId}/
         content: string
         updatedAt: timestamp

   feedback/
     {uid}/
       {tutorialId}/
         [{ question: string, answer: string, timestamp: ... }]
   ```

3. [ ] Security Rules (Firestore)

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
       }
       match /progress/{uid}/{document=**} {
         allow read, write: if request.auth.uid == uid;
       }
       match /notes/{uid}/{document=**} {
         allow read, write: if request.auth.uid == uid;
       }
       match /feedback/{uid}/{document=**} {
         allow read, write: if request.auth.uid == uid;
       }
     }
   }
   ```

4. [ ] Install Firebase SDK
   ```html
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-functions.js"></script>
   ```

**Effort:** ~4-5 hours

---

### 4.2 Firebase Authentication Integration

**Why:** Secure user accounts, enable cloud sync.

**Features:**

- [ ] Login/Signup flow
  - Simple form: email + password
  - "Sign up" or "Sign in" tabs
  - Error messages (user exists, wrong password, etc.)
  - "Forgot password?" link → email reset

- [ ] Auth state management

  ```javascript
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('Logged in:', user.email);
      CURRENT_USER_ID = user.uid;
      syncProgressFromCloud();
    } else {
      console.log('Not logged in');
      window.location.href = '/login.html';
    }
  });
  ```

- [ ] localStorage → Firestore sync
  - On login, merge localStorage progress into Firestore
  - On logout, save Firestore back to localStorage
  - Real-time listener: update UI when progress changes on another device

- [ ] Account page (`account.html`)
  - Display email, join date
  - "Logout" button
  - "Delete account" button (with confirmation)
  - Password change
  - Subscription status (for Phase 5 monetization)

**Effort:** ~3-4 hours

---

### 4.3 Firebase Hosting Deployment

**Why:** Make the app live on the web.

**Steps:**

1. [ ] Install Firebase CLI

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. [ ] Deploy

   ```bash
   cd /path/to/exercises/HTML\ TUTORIALS
   firebase init
   # Choose: Hosting
   # Public directory: . (current)
   # Configure as SPA: Yes
   firebase deploy
   ```

3. [ ] Custom domain (optional, Phase 5)
   - Point `octatrack-tutorials.rishaal.dev` to Firebase Hosting
   - SSL certificate auto-provisioned

**Result:** Live at `https://octatrack-tutorials.web.app`

**Effort:** ~1-2 hours

---

### 4.4 Cloud Functions: AI Chat Proxy

**Why:** Hide API keys, prevent abuse, track usage.

**Create:** `/functions/api/chat.js`

```javascript
const functions = require('firebase-functions');
const fetch = require('node-fetch');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

exports.chat = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { message, tutorialId, conversationHistory } = data;

  // Rate limiting: max 100 messages per user per day
  const usageRef = admin.firestore().collection('usage').doc(userId);
  const usage = await usageRef.get();
  const today = new Date().toDateString();

  if (usage.exists && usage.data().date === today && usage.data().count >= 100) {
    throw new functions.https.HttpsError('resource_exhausted', 'Daily message limit reached (100)');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        system: `You are an Octatrack learning assistant. Answer questions about the current topic: ${tutorialId}. Be concise and practical.`,
        messages: conversationHistory.concat({
          role: 'user',
          content: message,
        }),
      }),
    });

    const data = await response.json();
    const reply = data.content[0].text;

    // Update usage tracking
    await usageRef.set(
      {
        date: today,
        count: (usage.data()?.count || 0) + 1,
      },
      { merge: true }
    );

    return { reply };
  } catch (error) {
    console.error('API error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get response');
  }
});
```

**Deploy:**

```bash
firebase deploy --only functions
```

**Frontend Usage:**

```javascript
const functions = firebase.functions();
const chat = functions.httpsCallable('chat');

async function sendMessage(message, tutorialId) {
  const result = await chat({
    message,
    tutorialId,
    conversationHistory: currentConversation,
  });
  return result.data.reply;
}
```

**Effort:** ~3-4 hours

---

### 4.5 Tier 4 Tutorials

**New tutorials:**

- [ ] **LFOs & Modulation**
  - 3 LFOs per track, targeting any parameter
  - Modes: FREE, TRIG, HOLD, ONE
  - Custom LFO Designer
  - Meta-modulation (LFO3 modulating LFO1 speed)
  - Practical rhythmic examples

- [ ] **Live Performance Setup**
  - Pattern switching (quantized vs. instant)
  - CUE transitions (headphone preview)
  - Crossfader automation + scenes
  - Managing effects tails during transitions
  - Live looping with Pickup machine
  - External gear integration preview

**Effort:** ~8-10 hours (2 tutorials)

---

## Phase 4 Summary

| Task                           | Effort      | Priority  | Status |
| ------------------------------ | ----------- | --------- | ------ |
| Firebase project setup         | 4-5h        | 🔴 High   | —      |
| Auth integration               | 3-4h        | 🔴 High   | —      |
| Hosting deployment             | 1-2h        | 🔴 High   | —      |
| Cloud Functions API proxy      | 3-4h        | 🔴 High   | —      |
| Tier 4 tutorials (2 tutorials) | 8-10h       | 🟡 Medium | —      |
| **Phase 4 Total**              | **~19-25h** | —         | —      |

---

## Phase 5: Monetization & Advanced Features (Month 3+)

### 5.1 Payment Integration (Choose One)

**Option A: Stripe Subscription (Recommended)**

```
User signs up → Stripe Checkout → Webhook confirms payment → Enable "Pro" features
```

- [ ] Stripe account setup
  - Dashboard: https://dashboard.stripe.com
  - Create product: "Octatrack Tutorials Pro"
  - Prices: $5/mo, $10/mo tiers

- [ ] Cloud Function: create Stripe Checkout Session

  ```javascript
  exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      customer_email: context.auth.token.email,
      line_items: [
        {
          price: 'price_xxxx', // Your Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://octatrack-tutorials.web.app/account?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://octatrack-tutorials.web.app/account',
    });
    return { sessionId: session.id };
  });
  ```

- [ ] Webhook: handle payment confirmation

  ```javascript
  exports.stripeWebhook = functions.https.onRequest((req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_ENDPOINT_SECRET);

    if (event.type === 'customer.subscription.updated') {
      const uid = event.data.object.metadata.firebase_uid;
      admin.firestore().collection('users').doc(uid).update({ isPaid: true });
    }
    res.json({ received: true });
  });
  ```

**Option B: PayPal (Simpler)**

- PayPal Subscription buttons
- IPN (Instant Payment Notification) webhook
- Less setup, good for MVP

**Option C: Credit-Based System (Advanced)**

- User buys credits ($5 = 100 credits)
- Each AI chat message = 1-5 credits
- Track balance in Firestore
- Stripe one-time charges

---

### 5.2 Monetization Tiers

**Recommended: Freemium Model**

| Feature                  | Free | Basic ($5/mo) | Pro ($15/mo) |
| ------------------------ | ---- | ------------- | ------------ |
| Tier 1 tutorials (4)     | ✓    | ✓             | ✓            |
| Tier 2 tutorials (4)     | —    | ✓             | ✓            |
| Tier 3+ tutorials        | —    | —             | ✓            |
| Notes + export           | ✓    | ✓             | ✓            |
| Progress sync            | —    | ✓             | ✓            |
| AI chat (50 messages/mo) | —    | ✓             | —            |
| AI chat (unlimited)      | —    | —             | ✓            |
| Hardware SVG interactive | ✓    | ✓             | ✓            |

**Implementation:**

```javascript
async function checkAccess(featureId, userId) {
  const user = await admin.firestore().collection('users').doc(userId).get();
  const tier = user.data().subscriptionTier || 'free';

  const access = {
    tier1_tutorials: ['free', 'basic', 'pro'],
    tier2_tutorials: ['basic', 'pro'],
    tier3_tutorials: ['pro'],
    unlimited_ai: ['pro'],
  };

  return access[featureId]?.includes(tier) || false;
}
```

---

### 5.3 Community Features (Optional)

- [ ] Shared notes gallery
  - Users can mark notes as "public"
  - Browse other users' notes on each topic
  - Upvote/comment on helpful notes

- [ ] Leaderboard
  - Top learners by completion %
  - Top confidence gainers
  - Weekly challenges ("Complete all resampling exercises")

- [ ] Forum (lightweight)
  - Q&A board per tutorial
  - Moderate to keep quality high
  - Rishaal + community answers

---

### 5.4 Mobile PWA (Progressive Web App)

- [ ] Enable offline mode (Service Worker)
  - Cache tutorials, assets, quizzes
  - Sync progress when back online
  - Works on iOS + Android

- [ ] Install prompt
  - "Add to home screen" banner
  - Works like a native app

---

### 5.5 Tier 5-6 Tutorials (Advanced Topics)

- [ ] **External Gear Integration**
  - MIDI In: triggering OT from external synth
  - Clock Sync: syncing OT to Ableton
  - Audio I/O: Thru machine for guitar/synth processing

- [ ] **Sample Chains & OctaChainer**
  - Building sample chains (64 sounds in 1 slot)
  - Tool recommendations: OctaChainer, python scripts
  - Workflow: record → consolidate → import

- [ ] **Arranging & Arranger Mode**
  - Pattern sequences (up to 256 rows)
  - Automation in Arranger
  - Live switching between arrangements

- [ ] **Advanced Resampling**
  - Feedback patching (recorder → input)
  - Granular mangling (slice + retrigger + effects)
  - Polyrhythmic overdubbing

---

## Phase 5 Summary

| Task                             | Effort      | Priority  | Status |
| -------------------------------- | ----------- | --------- | ------ |
| Stripe integration               | 4-5h        | 🔴 High   | —      |
| Paywall implementation           | 2-3h        | 🔴 High   | —      |
| Community features (optional)    | 6-8h        | 🟢 Low    | —      |
| PWA + offline support            | 4-5h        | 🟡 Medium | —      |
| Tier 5-6 tutorials (4 tutorials) | 16-20h      | 🟡 Medium | —      |
| **Phase 5 Total**                | **~32-41h** | —         | —      |

---

## Technical Debt & Maintenance

### Regular Maintenance Tasks

- [ ] Update Firebase SDKs (quarterly)
- [ ] Review security rules (quarterly)
- [ ] Monitor API costs (monthly)
- [ ] Backup user data (monthly)
- [ ] User support + feedback review (weekly)

### Known Issues / TODO

- [ ] Mobile responsiveness: tutorial content on small screens
- [ ] Accessibility: WCAG 2.1 AA compliance (keyboard nav, screen reader)
- [ ] Performance: lazy-load images, compress videos
- [ ] PDF manual linking: direct page jumps (PDF.js integration)

---

## Estimated Costs

### Hosting & Services

| Service                | Cost                         | Notes                              |
| ---------------------- | ---------------------------- | ---------------------------------- |
| Firebase Hosting       | Free                         | 10 GB/month, HTTPS included        |
| Firebase Firestore     | Free                         | 50K reads/day free tier            |
| Cloud Functions        | Free                         | 2M invocations/month free tier     |
| Stripe                 | 2.9% + $0.30 per transaction | Only if payment processed          |
| Anthropic API (Claude) | $0.01-0.05 per message       | ~$0.30 per user/month (basic tier) |
| Custom domain          | $12/year                     | Optional, via Google Domains       |
| **Total (100 users)**  | **~$30-100/month**           | Mostly API costs                   |

### Development Time (Total)

- Phase 2: ~10-11 hours
- Phase 3: ~26-34 hours
- Phase 4: ~19-25 hours
- Phase 5: ~32-41 hours
- **Total: ~87-111 hours (~3-4 months, part-time)**

---

## Success Metrics

### Phase 2 Checkpoints

- [ ] All 8 tutorials have working notes panels
- [ ] Feedback collected from >50% of tutorial completions
- [ ] PDF photos extracted and mapped to tutorials
- [ ] README published and shared

### Phase 3 Checkpoints

- [ ] 4 new Tier 3 tutorials published and >100 views each
- [ ] Hardware SVG interactive panel live and clickable
- [ ] AI chat widget functioning with <1s response time
- [ ] Export feature tested and working

### Phase 4 Checkpoints

- [ ] Cloud auth working (sign up, login, logout)
- [ ] Progress syncing across devices
- [ ] Hosting live at octatrack-tutorials.web.app
- [ ] Cloud Functions API proxy active and secure
- [ ] 2 new Tier 4 tutorials published

### Phase 5 Checkpoints

- [ ] Payment integration tested (1 test transaction)
- [ ] Freemium paywall enforcement working
- [ ] Stripe/PayPal subscription active
- [ ] 4 new Tier 5-6 tutorials published
- [ ] PWA installable on mobile

---

## Decision Points (Polls for Rishaal)

1. **Photo Extraction:** Use Gemini-assisted SVG tracing (Phase 3.2) vs. manual SVG creation?
2. **API Key Management (Phase 3.3):** Direct client-side API calls vs. immediate backend proxy?
3. **Payment (Phase 5):** Stripe (professional) vs. PayPal (simpler) vs. wait for user demand?
4. **Community Features (Phase 5):** Include shared notes + leaderboard or focus on core features?
5. **Mobile App:** PWA wrapper now, or native iOS/Android apps later?

---

## Resources & References

### Documentation

- Firebase: https://firebase.google.com/docs
- Stripe: https://stripe.com/docs
- Anthropic API: https://docs.anthropic.com
- PWA: https://web.dev/progressive-web-apps/

### Tools

- Gemini: https://gemini.google.com/ (for SVG tracing)
- Inkscape: https://inkscape.org/ (SVG creation)
- Firebase CLI: `npm install -g firebase-tools`
- JSZip: https://stuk.github.io/jszip/ (client-side zip)

### Code Repositories

- Phase 1 tutorials: `/exercises/HTML TUTORIALS/`
- Firebase config: `/exercises/HTML TUTORIALS/firebase.json` (to be created)
- Knowledge base: `/knowledge/` (manual text extracts, gotchas)

---

## Next Steps (Immediate)

1. **Review this roadmap with Rishaal**
   - Agree on Phase 2 scope
   - Prioritize monetization (Phase 5) preferences
   - Confirm timeline expectations

2. **Start Phase 2**
   - Begin with notes/notepad system (quickest win, high value)
   - Parallelize: extract PDFs while building notes UI
   - Set target: complete by end of next session

3. **Create Phase 2 Checklist**
   - Break down into 2-3 hour sprints
   - Daily commits to track progress
   - Weekly demos to Rishaal

---

## Version History

| Date       | Version | Changes                                           |
| ---------- | ------- | ------------------------------------------------- |
| 2026-03-02 | 1.0     | Initial roadmap, 5 phases, 87-111 hours estimated |

---

**Last Updated:** March 2, 2026
**Next Review:** After Phase 2 completion
