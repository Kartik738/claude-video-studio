---
name: auto-shorts
description: Convert longer footage (podcast, vlog, talk, long video) into well-framed, professionally paced short-form clips with editorial review points. Use for 'make shorts/reels from this long video', 'clip this podcast'.
---
# /auto-shorts

## Procedure
1. **Transcribe:**
   - Premiere Speech-to-Text, or Edits `transcribeClip`
   - Adobe `media_summarize` only with the owner's OK (cloud service)
2. **Find moments:** self-contained 15–60 s segments with a strong opening line, one clear idea, and an ending or punchline. Score each on hook, clarity, emotion, and standalone sense. Propose the top 3–5 with timestamps and the reason.
3. **REVIEW CHECKPOINT:** the owner picks which ones to make. Never publish or skip this step.
4. **Reframe to 9:16:**
   - Edits: `autoReframe`
   - Premiere: Auto Reframe Sequence
   - AE: scale and position keyframes following the speaker
   - Keep the face in the upper third. Two speakers: cut between them, or use a split screen.
5. **Tighten:** remove dead air and filler words (Edits `findPauses`; Premiere text-based editing › delete pauses). Keep breaths that sound natural.
6. Add a hook title in the first 1.5 s (/kinetic-typography), captions (/auto-caption-studio), and a soft music bed if suitable (−24 to −28 LUFS under speech).
7. Export each clip with the `TV Reels` preset. Name files `<source>_short_<n>_<topic>.mp4`.

## Output
A table of clips (in/out, hook line, length) plus the rendered files.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
