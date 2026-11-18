---
name: project-cleanup
description: Organise a project: assets into folders/bins, consistent naming, comps/sequences tidy, without deleting potentially needed media. Use for 'clean up', 'organise', 'my project is messy'.
---
# /project-cleanup

## After Effects
1. Run `status.jsx`. If there are unsaved changes, ask the owner to save first, so the cleanup is its own undoable step.
2. Run `organize_project.jsx`. It sorts items into `01 Comps / 02 Precomps / 03 Footage / 04 Audio / 05 Images & Graphics / 06 Solids` and **never deletes**. Undo with one Cmd+Z.
3. Report the unused footage count (from `preflight.jsx`) and *suggest* AE's File › Dependencies › Remove Unused Footage. Don't run it automatically, and only with the owner's yes after they've seen the list.
4. Suggest File › Dependencies › Collect Files when the project must move to another drive.
5. **Naming:** comps `Brand_Topic_Format_v01` (e.g. `Tarotoverse_LoveMessage_9x16_v03`). Rename only with the owner's OK if other projects reference them.

## Premiere Pro (manual, with guidance)
- Bins: `01 Sequences / 02 Footage / 03 Audio / 04 Graphics / 05 Exports`.
- Use label colours: video = blue, audio = green, graphics = yellow.
- File › Project Manager › Consolidate (copy) to archive. Never "Remove unused" without a backup.

## Disk housekeeping (with permission)
- AE: Settings › Media & Disk Cache › Empty Disk Cache (it was 6.4 GB at the audit).
- Premiere: Media Cache › Delete unused.
- These are caches: safe to clear, and they rebuild automatically.

## Ground rules (all editing skills)
- Read `~/Claude AI/Adobe_Creative_Cloud_Pro_Optimization/07_Automation_Workflows/TOOLKIT.md` first: it holds the tested commands, delivery specs, and hardware limits.
- Work non-destructively. Never overwrite source media, never delete project items, and never close a project with unsaved changes. Save new versions (`_v2`, `_v3`).
- Before any After Effects script that changes something, run `status.jsx`. If the open project isn't the one the owner asked about and it has unsaved changes, ask them to save it first.
- The owner is non-technical. Report in plain language, show stills or a render instead of describing, and ask only for real creative choices.
- Never claim a step worked unless you saw it work (a script report, a frame grab, or a render file exists).
- Use only footage, music, fonts and assets the owner supplied or that are licensed for commercial use. Record the source of anything new in `06_Editing_Asset_Library/LICENSES.md`.
- Don't spend Adobe generative credits or any paid service without asking.
