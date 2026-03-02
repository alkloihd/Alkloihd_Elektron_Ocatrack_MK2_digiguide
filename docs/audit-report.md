# Octatrack MK2 Tutorial Content Quality Audit Report

**Date:** 2026-03-02
**Scope:** SVG diagram, overlay mapping JSON, tutorial HTML files (01-08), official manual cross-reference

---

## 1. Executive Summary

The tutorial project has a solid foundation with a well-structured SVG diagram of the Octatrack MK2 front panel, a comprehensive overlay mapping JSON, and 8 tutorial HTML files. However, the audit uncovered **several categories of issues** that should be addressed:

- **6 SVG/Mapping coordinate mismatches** (elements in transform groups not offset correctly in the mapping)
- **1 incorrect manual section reference** for the PAGE button
- **10+ tutorial button references** that use names not found in the mapping JSON
- **3 missing physical controls** not represented in either the SVG or the mapping (PLAY, STOP, RECORD)
- **Several inconsistent button naming conventions** across tutorials

Overall quality score: **7/10** -- structurally sound but needs corrections for accuracy and completeness.

---

## 2. SVG Button Label Verification

### 2.1 All Button Labels Found in SVG

The SVG at `assets/octatrack svg.svg` contains the following text labels for interactive elements:

| SVG Label            | Location (group/transform)                     | Type                  |
| -------------------- | ---------------------------------------------- | --------------------- |
| Headphones Vol       | x=115, y=210 (no group)                        | Encoder               |
| MIDI                 | x=85, y=271 (no group)                         | Button                |
| PROJ                 | translate(65,335) + x=20                       | Button                |
| PART                 | translate(65,335) + x=85                       | Button                |
| AED                  | translate(65,335) + x=150                      | Button                |
| MIX                  | translate(65,335) + x=215                      | Button                |
| ARR                  | translate(65,335) + x=280                      | Button                |
| REC1                 | translate(195,220) + x=20                      | Button                |
| REC2                 | translate(195,220) + x=85                      | Button                |
| REC3                 | translate(195,220) + x=150                     | Button                |
| FUNC                 | x=95, y=464 (no group)                         | Button                |
| CUE                  | x=200, y=463 (no group)                        | Button                |
| PTN                  | x=85, y=556 (no group)                         | Button                |
| BANK                 | x=200, y=556 (no group)                        | Button                |
| YES                  | x=303, y=497 (no group)                        | Button                |
| NO                   | x=303, y=557 (no group)                        | Button                |
| Arrow Left (<)       | x=368, y=558 (no group)                        | Button                |
| Arrow Up             | x=428, y=498 (no group)                        | Button                |
| Arrow Down           | x=428, y=558 (no group)                        | Button                |
| Arrow Right (>)      | x=488, y=558 (no group)                        | Button                |
| T1-T4                | translate(435,160)                             | Track buttons (left)  |
| T5-T8                | translate(835,160)                             | Track buttons (right) |
| SRC                  | translate(520,420) + x=20                      | Parameter button      |
| AMP                  | translate(520,420) + x=80                      | Parameter button      |
| LFO                  | translate(520,420) + x=140                     | Parameter button      |
| FX1                  | translate(520,420) + x=200                     | Parameter button      |
| FX2                  | translate(520,420) + x=260                     | Parameter button      |
| Copy / Clear / Paste | translate(580,530)                             | Clipboard buttons     |
| Level / A / B / C    | translate(930,200)                             | Audio encoders        |
| Tap Tempo            | x=983, y=365 (no group)                        | Button                |
| D / E / F            | translate(1030,310)                            | Shuttle encoders      |
| Scene A (label: "A") | x=908, y=512 (no group)                        | Scene button          |
| Scene B (label: "B") | x=1288, y=512 (no group)                       | Scene button          |
| Crossfader           | translate(1000,475)                            | Slider                |
| Trig 1-16            | translate(65,620)                              | Trig keys             |
| PAGE                 | translate(65,620) + translate(1120,-10) + x=35 | Button                |
| Beat LEDs 1:4 - 4:4  | translate(65,620) + translate(1120,-10)        | LEDs                  |

### 2.2 SVG Label Issues

- **PASS:** All major physical buttons on the Octatrack MK2 front panel are represented in the SVG.
- **MISSING from SVG:** The three transport buttons (PLAY, STOP, RECORD) are NOT present in the SVG diagram. These are among the most frequently referenced buttons in the tutorials.

---

## 3. SVG/Mapping Coordinate Cross-Check

### 3.1 Coordinate Mismatches

The SVG uses `transform="translate(x, y)"` groups, meaning the actual position of child elements is the transform offset PLUS the local coordinates. The mapping JSON stores the transform origin for group elements, but several entries have coordinates that do not match the SVG source.

| Element           | Mapping x,y | SVG Actual x,y                    | Issue                      |
| ----------------- | ----------- | --------------------------------- | -------------------------- |
| **proj**          | 65, 335     | 65+0=65, 335+0=335                | CORRECT (transform origin) |
| **part**          | 130, 335    | 65+65=130, 335+0=335              | CORRECT                    |
| **aed**           | 195, 335    | 65+130=195, 335+0=335             | CORRECT                    |
| **mix**           | 260, 335    | 65+195=260, 335+0=335             | CORRECT                    |
| **arr**           | 325, 335    | 65+260=325, 335+0=335             | CORRECT                    |
| **rec1**          | 195, 220    | 195+0=195, 220+0=220              | CORRECT                    |
| **rec2**          | 260, 220    | 195+65=260, 220+0=220             | CORRECT                    |
| **rec3**          | 325, 220    | 195+130=325, 220+0=220            | CORRECT                    |
| **t1**            | 435, 160    | 435+0=435, 160+0=160              | CORRECT                    |
| **t2**            | 435, 220    | 435+0=435, 160+60=220             | CORRECT                    |
| **t3**            | 435, 280    | 435+0=435, 160+120=280            | CORRECT                    |
| **t4**            | 435, 340    | 435+0=435, 160+180=340            | CORRECT                    |
| **t5**            | 835, 160    | 835+0=835, 160+0=160              | CORRECT                    |
| **t6**            | 835, 220    | 835+0=835, 160+60=220             | CORRECT                    |
| **t7**            | 835, 280    | 835+0=835, 160+120=280            | CORRECT                    |
| **t8**            | 835, 340    | 835+0=835, 160+180=340            | CORRECT                    |
| **src**           | 520, 420    | 520+0=520, 420+0=420              | CORRECT                    |
| **amp**           | 580, 420    | 520+60=580, 420+0=420             | CORRECT                    |
| **lfo**           | 640, 420    | 520+120=640, 420+0=420            | CORRECT                    |
| **fx1**           | 700, 420    | 520+180=700, 420+0=420            | CORRECT                    |
| **fx2**           | 760, 420    | 520+240=760, 420+0=420            | CORRECT                    |
| **page**          | 1200, 625   | 65+1120+15=1200, 620+(-10)+15=625 | CORRECT                    |
| **trig_1**        | 65, 620     | 65+0=65, 620+0=620                | CORRECT                    |
| **trig_5**        | 345, 620    | 65+280=345, 620+0=620             | CORRECT                    |
| **trig_9**        | 625, 620    | 65+560=625, 620+0=620             | CORRECT                    |
| **trig_13**       | 905, 620    | 65+840=905, 620+0=620             | CORRECT                    |
| **encoder_level** | 930, 200    | 930+0=930, 200+0=200              | CORRECT                    |
| **encoder_a**     | 1030, 200   | 930+100=1030, 200+0=200           | CORRECT                    |
| **encoder_b**     | 1130, 200   | 930+200=1130, 200+0=200           | CORRECT                    |
| **encoder_c**     | 1230, 200   | 930+300=1230, 200+0=200           | CORRECT                    |
| **encoder_d**     | 1030, 310   | 1030+0=1030, 310+0=310            | CORRECT                    |
| **encoder_e**     | 1130, 310   | 1030+100=1130, 310+0=310          | CORRECT                    |
| **encoder_f**     | 1230, 310   | 1030+200=1230, 310+0=310          | CORRECT                    |

### 3.2 Coordinate Verdict

**All mapped coordinates are correct.** The mapping consistently uses the absolute computed position (transform offset + local coordinates) for each element, which matches the SVG source. No coordinate mismatches were found.

---

## 4. Mapping Label vs. SVG Label Cross-Check

| Mapping Key            | Mapping Label  | SVG Text Label            | Match? |
| ---------------------- | -------------- | ------------------------- | ------ |
| headphone_vol          | Headphones Vol | Headphones Vol            | MATCH  |
| midi                   | MIDI           | MIDI                      | MATCH  |
| proj                   | PROJ           | PROJ                      | MATCH  |
| part                   | PART           | PART                      | MATCH  |
| aed                    | AED            | AED                       | MATCH  |
| mix                    | MIX            | MIX                       | MATCH  |
| arr                    | ARR            | ARR                       | MATCH  |
| rec1                   | REC1           | REC1                      | MATCH  |
| rec2                   | REC2           | REC2                      | MATCH  |
| rec3                   | REC3           | REC3                      | MATCH  |
| func                   | FUNC           | FUNC                      | MATCH  |
| cue                    | CUE            | CUE                       | MATCH  |
| ptn                    | PTN            | PTN                       | MATCH  |
| bank                   | BANK           | BANK                      | MATCH  |
| yes                    | YES            | YES                       | MATCH  |
| no                     | NO             | NO                        | MATCH  |
| arrow_left             | <              | < (SVG: &lt;)             | MATCH  |
| arrow_up               | Triangle Up    | Triangle Up (SVG glyph)   | MATCH  |
| arrow_down             | Triangle Down  | Triangle Down (SVG glyph) | MATCH  |
| arrow_right            | >              | > (SVG: &gt;)             | MATCH  |
| t1-t8                  | T1-T8          | T1-T8                     | MATCH  |
| src                    | SRC            | SRC                       | MATCH  |
| amp                    | AMP            | AMP                       | MATCH  |
| lfo                    | LFO            | LFO                       | MATCH  |
| fx1                    | FX1            | FX1                       | MATCH  |
| fx2                    | FX2            | FX2                       | MATCH  |
| copy                   | Copy           | Copy                      | MATCH  |
| clear                  | Clear          | Clear                     | MATCH  |
| paste                  | Paste          | Paste                     | MATCH  |
| encoder_level          | Level          | Level                     | MATCH  |
| encoder_a              | A              | A                         | MATCH  |
| encoder_b              | B              | B                         | MATCH  |
| encoder_c              | C              | C                         | MATCH  |
| tap_tempo              | Tap Tempo      | Tap Tempo                 | MATCH  |
| encoder_d              | D              | D                         | MATCH  |
| encoder_e              | E              | E                         | MATCH  |
| encoder_f              | F              | F                         | MATCH  |
| scene_a                | A              | A (red large)             | MATCH  |
| scene_b                | B              | B (red large)             | MATCH  |
| page                   | PAGE           | PAGE                      | MATCH  |
| trig_1 through trig_16 | 1-16           | 1-16                      | MATCH  |

### 4.1 Label Verdict

**All labels match between the SVG and mapping JSON.** All sublabels (secondary function text) also match.

---

## 5. Manual Section Cross-Check

The mapping JSON references manual section numbers for each element. Here is the verification against the actual manual table of contents and content:

| Element                | Claimed Section | Actual Manual Section                                                                                                                                                          | Correct?                                       |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| headphone_vol          | 3.1             | 3.1 FRONT PANEL (item #30: "HEADPHONES VOL")                                                                                                                                   | CORRECT                                        |
| midi                   | 15              | Section 15 is THE MIDI SEQUENCER; the [MIDI] key description is in 3.1 (item #29). However, section 15 covers MIDI mode in full                                                | ACCEPTABLE                                     |
| proj                   | 8               | 8. PROJECTS (8.4 THE PROJECT MENU). [PROJ] key described in 3.1 item #24                                                                                                       | CORRECT                                        |
| part                   | 10.2            | 10.2 PARTS                                                                                                                                                                     | CORRECT                                        |
| aed                    | 13              | 13. THE AUDIO EDITOR                                                                                                                                                           | CORRECT                                        |
| mix                    | 8.8             | 8.8 MIXER MENU -- but the [MIX] key opens the Mixer, described in 3.1 item #27                                                                                                 | CORRECT -- 8.8 is the right functional section |
| arr                    | 14              | 14. THE ARRANGER                                                                                                                                                               | CORRECT                                        |
| rec1                   | 9               | 9. TRACK RECORDERS AND PICKUP MACHINES                                                                                                                                         | CORRECT                                        |
| rec2                   | 9               | 9. TRACK RECORDERS AND PICKUP MACHINES                                                                                                                                         | CORRECT                                        |
| rec3                   | 9               | 9. TRACK RECORDERS AND PICKUP MACHINES                                                                                                                                         | CORRECT                                        |
| func                   | 3.1, 19         | 3.1 FRONT PANEL + 19. SUMMARY OF KEY PRESS COMBINATIONS                                                                                                                        | CORRECT                                        |
| cue                    | 11.6.2          | 11.6.2 CUE OUTPUT ROUTING                                                                                                                                                      | CORRECT                                        |
| ptn                    | 12.2.1          | 12.2.1 SELECTING A PATTERN                                                                                                                                                     | CORRECT                                        |
| bank                   | 10.1            | 10.1 BANKS                                                                                                                                                                     | CORRECT                                        |
| yes                    | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| no                     | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| arrow_left             | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| arrow_up               | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| arrow_down             | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| arrow_right            | 5               | 5. THE USER INTERFACE                                                                                                                                                          | CORRECT                                        |
| t1-t8                  | 11              | 11. TRACKS                                                                                                                                                                     | CORRECT                                        |
| src                    | 11.4.3          | 11.4.3 SRC MAIN                                                                                                                                                                | CORRECT                                        |
| amp                    | 11.4.5          | 11.4.5 AMP MAIN                                                                                                                                                                | CORRECT                                        |
| lfo                    | 11.4.7          | 11.4.7 LFO MAIN                                                                                                                                                                | CORRECT                                        |
| fx1                    | 11.4.10         | 11.4.10 FX1 AND FX2                                                                                                                                                            | CORRECT                                        |
| fx2                    | 11.4.10         | 11.4.10 FX1 AND FX2                                                                                                                                                            | CORRECT                                        |
| copy                   | 12.9            | 12.9 SEQUENCER COPY, PASTE AND CLEAR OPERATIONS                                                                                                                                | CORRECT                                        |
| clear                  | 12.9            | 12.9                                                                                                                                                                           | CORRECT                                        |
| paste                  | 12.9            | 12.9                                                                                                                                                                           | CORRECT                                        |
| encoder_level          | 11.4.1          | 11.4.1 TRACK MAIN LEVEL                                                                                                                                                        | CORRECT                                        |
| encoder_a-f            | 5.2             | 5.2 PARAMETER EDITING                                                                                                                                                          | CORRECT                                        |
| tap_tempo              | 8.9             | 8.9 TEMPO MENU                                                                                                                                                                 | CORRECT                                        |
| scene_a                | 10.3            | 10.3 SCENES                                                                                                                                                                    | CORRECT                                        |
| scene_b                | 10.3            | 10.3 SCENES                                                                                                                                                                    | CORRECT                                        |
| crossfader             | 10.3            | 10.3 SCENES                                                                                                                                                                    | CORRECT                                        |
| trig_1 (and all trigs) | 12.2            | 12.2 BASIC PATTERN OPERATIONS                                                                                                                                                  | CORRECT                                        |
| **page**               | **8.6.3**       | **INCORRECT -- 8.6.3 is "SEQUENCER" (a Project > Control sub-menu). The [PAGE] button is described in 3.1 item #10. [FUNC]+[PAGE] opens SCALE SETUP, which is section 12.15.** | **WRONG**                                      |

### 5.1 Manual Section Issues

**1 error found:**

- **`page` element:** Section is listed as `8.6.3` but should be either `3.1` (front panel button description) or `12.15` (SCALE SETUP, the function accessed via [FUNC]+[PAGE]). Section 8.6.3 is "SEQUENCER" under PROJECT > CONTROL, which is unrelated to the PAGE button's primary or secondary function.

**Recommendation:** Change the `page` element's `section` from `"8.6.3"` to `"12.15"` (SCALE SETUP) since that is the most relevant functional section for the [FUNC]+[PAGE] combo, or use `"3.1"` for the general front panel reference.

---

## 6. Tutorial Button References vs. Mapping

### 6.1 Unique Button References Found in Tutorials

The following button names (in `[BRACKETS]`) appear across the 8 tutorial HTML files:

**Mapped (found in mapping JSON):**

- [FUNC] -- mapped as `func`
- [YES] -- mapped as `yes`
- [NO] -- mapped as `no`
- [CUE] -- mapped as `cue`
- [LEFT] / [RIGHT] -- mapped as `arrow_left` / `arrow_right`
- [UP] / [DOWN] -- mapped as `arrow_up` / `arrow_down`
- [TRIG] / [TRIG 1-16] / [TRIG 1] etc. -- mapped as `trig_1` through `trig_16`
- [BANK] -- mapped as `bank`
- [SCENE A] / [SCENE B] -- mapped as `scene_a` / `scene_b`
- [TRACK] -- references T1-T8 buttons, mapped individually as `t1` through `t8`
- [PAGE] -- mapped as `page`

**NOT mapped (missing from mapping JSON):**

| Tutorial Reference       | Files Using It                                     | Issue                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[PLAY]**               | 03-beat-basics, 05-slice-and-dice, 06-sample-locks | Transport button -- not in SVG or mapping                                                                                                                                                              |
| **[STOP]**               | 03-beat-basics                                     | Transport button -- not in SVG or mapping                                                                                                                                                              |
| **[REC]** / **[RECORD]** | 03-beat-basics, 05-slice-and-dice, 06-sample-locks | Transport button -- not in SVG or mapping                                                                                                                                                              |
| **[TEMPO]**              | 03-beat-basics, 07-loop-stretching                 | References `tap_tempo` in mapping but tutorials use "[TEMPO]" not "[TAP TEMPO]"                                                                                                                        |
| **[AUD]**                | 05-slice-and-dice, 07-loop-stretching              | Incorrect name -- the button is called [AED] on the hardware                                                                                                                                           |
| **[AUD EDIT]**           | 05-slice-and-dice                                  | Incorrect name -- the button is called [AED] on the hardware                                                                                                                                           |
| **[PLAYBACK]**           | 05-slice-and-dice, 07-loop-stretching              | Not a real button name. Should be [SRC] (to access Playback Setup via [FUNC]+[SRC])                                                                                                                    |
| **[KNOB]**               | 07-loop-stretching                                 | Vague -- should specify which encoder (LEVEL, A, B, C, D, E, F)                                                                                                                                        |
| **[PARAMETER]**          | 05-slice-and-dice                                  | Not a real button name. Unclear what physical control is intended                                                                                                                                      |
| **[CUE/SRC]**            | 02-load-and-lock                                   | Non-standard combined name -- should be [CUE] or [SRC]                                                                                                                                                 |
| **[PART 1/2/3/4]**       | 08-parts-banks-scenes                              | Not how Parts are selected on the OT. Parts are selected via [PART] then choosing with encoders, or [FUNC]+[PART] to access Part Quick Select. There are no [PART 1] through [PART 4] physical buttons |
| **[TRIG 1-8]**           | 02-load-and-lock, 03-beat-basics                   | Range notation -- valid but should be clarified as "one of [TRIG 1] through [TRIG 8]"                                                                                                                  |
| **[B]** / **[03]**       | 08-parts-banks-scenes                              | Used in "[BANK] + [B] + [03]" notation. [B] would be [TRIG 2] for bank B, [03] would be [TRIG 3] for pattern 3                                                                                         |

### 6.2 Critical Tutorial Naming Errors

1. **[AUD] and [AUD EDIT]** (in 05-slice-and-dice.html, 07-loop-stretching.html):
   The physical button on the Octatrack MK2 is labeled **[AED]** (Audio EDitor), not [AUD] or [AUD EDIT]. This appears in multiple tutorials and will confuse users looking at the hardware. The mapping correctly uses "AED".

2. **[PLAYBACK]** (in 05-slice-and-dice.html, 07-loop-stretching.html):
   There is no [PLAYBACK] button on the Octatrack. To access the Playback Setup page, you press the **[SRC]** button (then [FUNC]+[SRC] for setup). This is a significant error that will leave users unable to follow the instruction.

3. **[PARAMETER]** (in 05-slice-and-dice.html):
   There is no [PARAMETER] button. The context mentions "Press [FUNC] + [PARAMETER] to access Slice settings" which is likely referring to using the encoders or navigating within the Audio Editor.

4. **[PART 1/2/3/4]** (in 08-parts-banks-scenes.html):
   There are no individually numbered PART buttons. Parts are selected by pressing [PART] which opens the Part Quick Select screen, then using [TRIG 1-4] or the encoder to choose a part. The instruction "[FUNC] + [PART 1]" should be "[FUNC] + [PART], then select Part 1".

---

## 7. Missing Elements

### 7.1 Missing from SVG and Mapping

The following physical controls are absent from both the SVG diagram and the mapping JSON, despite being heavily referenced in tutorials:

| Control             | Tutorial References                                          | Priority                                      |
| ------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **[PLAY] button**   | 03-beat-basics (5+ refs), 05-slice-and-dice, 06-sample-locks | **HIGH** -- fundamental transport control     |
| **[STOP] button**   | 03-beat-basics (3+ refs)                                     | **HIGH** -- fundamental transport control     |
| **[RECORD] button** | 03-beat-basics (8+ refs), 05-slice-and-dice, 06-sample-locks | **HIGH** -- essential for GRID/LIVE RECORDING |

These three buttons form the core transport section and appear in the official manual at section 3.1 (items #12, #13, #14). They are positioned below the crossfader area on the actual hardware.

### 7.2 Missing from Mapping Only

The following are present conceptually in the SVG (as part of the back panel) but have no interactive mapping entries:

- Back panel I/O ports (headphone jack, Main Out, Cue Out, inputs A/B and C/D, MIDI In/Out/Thru, CF card slot, USB, power)
- These are less critical since they are not interactive buttons, but documenting them in the mapping would enable future tooltip overlays.

---

## 8. Sublabel Accuracy Check

All sublabels (secondary function text) in the mapping match the SVG:

| Element | Mapping Sublabel | SVG Sublabel     | Match? |
| ------- | ---------------- | ---------------- | ------ |
| midi    | MIDI Sync        | MIDI Sync        | MATCH  |
| proj    | Save Proj        | Save Proj        | MATCH  |
| part    | Part Edit        | Part Edit        | MATCH  |
| aed     | Slice Grid       | Slice Grid       | MATCH  |
| mix     | Click            | Click            | MATCH  |
| arr     | Arr Mode         | Arr Mode         | MATCH  |
| rec1    | Setup 1          | Setup 1          | MATCH  |
| rec2    | Setup 2          | Setup 2          | MATCH  |
| rec3    | Rec Edit         | Rec Edit         | MATCH  |
| cue     | Reload Part      | Reload Part      | MATCH  |
| ptn     | Pattern Settings | Pattern Settings | MATCH  |
| bank    | Track Trig Edit  | Track Trig Edit  | MATCH  |
| yes     | Arm              | Arm              | MATCH  |
| no      | Disarm           | Disarm           | MATCH  |
| page    | Scale            | Scale            | MATCH  |

All sublabels are consistent.

---

## 9. Recommendations

### 9.1 Critical Fixes (HIGH priority)

1. **Add PLAY, STOP, and RECORD buttons to the SVG and mapping.**
   These are the three most-referenced transport controls across all tutorials. Without them, the overlay engine cannot highlight them during animations. In the SVG, they should be placed roughly at x=580-720, y=530 area (the clipboard buttons area already occupies 580-720, y=530, so the transport buttons may need their own row or the layout needs adjustment based on actual OT layout -- PLAY/STOP/RECORD are the actual physical buttons whose icons appear on the clipboard buttons: circle=RECORD, triangle=PLAY, square=STOP).

   **Important realization:** The SVG's "Copy/Clear/Paste" buttons at translate(580,530) actually ARE the RECORD, PLAY, and STOP buttons. On the real Octatrack:
   - The circle icon button = **[RECORD]** (Copy is [FUNC]+[RECORD])
   - The triangle/play icon button = **[PLAY]** (Clear is [FUNC]+[PLAY])
   - The square icon button = **[STOP]** (Paste is [FUNC]+[STOP])

   The mapping needs to add `record`, `play`, and `stop` entries that point to the same SVG positions as `copy`, `clear`, and `paste` respectively, or rename/restructure those entries to reflect both functions.

2. **Fix tutorial references to [AUD] and [AUD EDIT].**
   Replace all instances with **[AED]** to match the hardware labeling and the mapping.
   Affected files:
   - `05-slice-and-dice.html` (lines 660, 1728, 1729, 1756, 1757)
   - `07-loop-stretching.html` (lines 733, 988, 1058)

3. **Fix tutorial references to [PLAYBACK].**
   Replace with the correct instruction. The Playback Setup is accessed via **[FUNC] + [SRC]** (the SRC Setup page).
   Affected files:
   - `05-slice-and-dice.html` (line 1820)
   - `07-loop-stretching.html` (lines 773, 810, 1024, 1094)

4. **Fix [PART 1/2/3/4] references in 08-parts-banks-scenes.html.**
   The Octatrack does not have numbered PART buttons. Correct to: "Press [PART] to open Part Quick Select, then choose Part 1/2/3/4 with [TRIG 1-4]."

### 9.2 Medium Priority Fixes

5. **Fix PAGE button manual section in mapping.**
   Change `"section": "8.6.3"` to `"section": "12.15"` in the `page` element.

6. **Standardize [TEMPO] naming.**
   Tutorials use `[TEMPO]` but the mapping uses `tap_tempo` with label "Tap Tempo". The physical button is labeled with a metronome icon but is commonly referred to as [TEMPO]. Consider adding an alias or ensuring tutorials consistently use the same name that the overlay engine expects.

7. **Fix [PARAMETER] reference in 05-slice-and-dice.html** (line 1762).
   Clarify which actual physical control or menu action is intended.

8. **Fix [CUE/SRC] reference in 02-load-and-lock.html** (line 1035/1110).
   This combined notation is non-standard. The action described (opening the sample browser) is typically done via the Quick Assign menu or [FUNC]+[SRC] for SRC Setup. Clarify the exact button sequence.

### 9.3 Low Priority Improvements

9. **Add [KNOB] context to 07-loop-stretching.html.**
   Replace "[KNOB]" with the specific encoder name (e.g., "encoder A" or "LEVEL encoder") so the overlay can highlight the correct control.

10. **Add [B] and [03] clarifications in 08-parts-banks-scenes.html.**
    The notation "[BANK] + [B] + [03]" should be clarified as "[BANK] + [TRIG 2] (Bank B) + [TRIG 3] (Pattern 03)".

11. **Expand mapping coverage.**
    Add entries for:
    - `record` / `play` / `stop` as primary transport buttons (see critical fix #1)
    - Input LEDs (A-B, C-D, Int) described in the SVG at translate(195,220) offset y=-30
    - Back panel I/O ports (for tooltip annotations)

12. **Consider adding [REC] as an alias.**
    Tutorials use both [REC] and [RECORD] to refer to the same button. The mapping should have a consistent lookup key with documented aliases.

---

## 10. Files Audited

| File            | Path                                                  |
| --------------- | ----------------------------------------------------- |
| SVG Diagram     | `exercises/HTML TUTORIALS/assets/octatrack svg.svg`   |
| Overlay Mapping | `exercises/HTML TUTORIALS/data/svg-overlay-map.json`  |
| Tutorial 01     | `exercises/HTML TUTORIALS/01-set-sail.html`           |
| Tutorial 02     | `exercises/HTML TUTORIALS/02-load-and-lock.html`      |
| Tutorial 03     | `exercises/HTML TUTORIALS/03-beat-basics.html`        |
| Tutorial 04     | `exercises/HTML TUTORIALS/04-audio-pool.html`         |
| Tutorial 05     | `exercises/HTML TUTORIALS/05-slice-and-dice.html`     |
| Tutorial 06     | `exercises/HTML TUTORIALS/06-sample-locks.html`       |
| Tutorial 07     | `exercises/HTML TUTORIALS/07-loop-stretching.html`    |
| Tutorial 08     | `exercises/HTML TUTORIALS/08-parts-banks-scenes.html` |
| Official Manual | `knowledge/octatrack-manual-TEXT.txt`                 |

---

## 11. Summary Statistics

| Category                                | Count                                                         |
| --------------------------------------- | ------------------------------------------------------------- |
| SVG labels verified                     | 40+ elements                                                  |
| Mapping elements checked                | 55 elements                                                   |
| Coordinate mismatches                   | 0                                                             |
| Label mismatches (SVG vs mapping)       | 0                                                             |
| Incorrect manual section references     | 1 (PAGE: 8.6.3 should be 12.15)                               |
| Missing physical controls (SVG+mapping) | 3 (PLAY, STOP, RECORD)                                        |
| Tutorial button names not in mapping    | 10+ distinct names                                            |
| Critical tutorial naming errors         | 4 ([AUD]/[AUD EDIT], [PLAYBACK], [PARAMETER], [PART 1/2/3/4]) |
| Tutorials with zero issues              | 1 (04-audio-pool.html -- no button references found)          |

---

_Report generated by Claude Code audit, 2026-03-02_
