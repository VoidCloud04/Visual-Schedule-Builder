# Course Conflict Display — Implementation Guide

## Goal

Surface scheduling conflicts (courses that overlap — or sit closer than a configurable minimum gap) in three places:

1. The **Schedule viewer** course holders, via `Chip` / `ChipList`.
2. The **Course Configuration** course holders, via `Chip` / `ChipList`.
3. **Windows/boxes drawn on the visual calendar** over the conflicting time regions.

## References

- `Refinements.md` → *Planned Refinements → From Developer*
- Components: `src/lib/components/Chip.svelte`, `src/lib/components/ChipList.svelte`
- Surface: `src/routes/Schedule.svelte`, `src/routes/Configuration.svelte`, `src/routes/Settings.svelte`, `src/routes/+page.svelte`
- Calendar: `src/lib/components/Calendar.svelte`
- Model/storage: `src/lib/index.js`; colors: `src/lib/styles/colors.js`
- Suggested version: **v1.3** (repo branch is currently `v1.2.0`)

## Design Decisions (confirmed)

| # | Decision |
|---|----------|
| 1 | **Conflict rule** — two meetings conflict if they share at least one day **and** the time distance between them is **`< minGap`** (default **10 minutes**). Equal to `minGap` = no conflict. Online courses (no fixed time) never conflict. A course never conflicts with itself (main meeting vs. its own extra meeting). |
| 2 | **Chips** — only on the **main course holder** cards (both Schedule & Configuration). Label = course code only, e.g. `CSCE 1030`. Chip color `septenary` (red), optional `warning` icon. |
| 3 | **Calendar box** — drawn per conflicting **pair × shared day**. For a true overlap the box covers the intersection `[max(startA, startB), min(endA, endB)]`. For a near-miss (no overlap, gap `< minGap`) the box covers the *gap* padded **5 minutes on each side**: `[min(endA, endB) − 5min, max(startA, startB) + 5min]`. |
| 4 | **Visibility** — conflict **detection always runs on all courses**; the calendar **box renders only when both courses are toggled visible** (`eventVisibility`). Chips ignore visibility. |
| 5 | **Setting** — persisted like `use24Hour` (base64 localStorage), number input (minutes, `min="0"`), default **10**. |
| 6 | **Deliverable** — this guide as a markdown file in the repo. |

## Conflict Detection Semantics

- Times are stored as HHMM integers (e.g. `930` = 9:30) with `meetingTime = [start, end]`.
- Each course contributes **slots**: its main meeting plus every `extraMeetings` entry. Course.`online` courses contribute no slots.
- Two slots **share a day** when `daysOfWeek` overlaps at any index.
- Time distance in minutes between two intervals:

  ```
  dist = max(0, timeToMinutes(A[start]) - timeToMinutes(B[end]),
                timeToMinutes(B[start]) - timeToMinutes(A[end]))
  ```

  `dist === 0` means they overlap. A conflict is flagged when `dist < minGapMinutes`.
- Conflicts are aggregated at the **course level**: if any slot pair between course A and course B conflicts, A and B conflict. Self-pairs are excluded.

## Step 1 — Model & helpers (`src/lib/index.js`)

Add the following exports:

- `timeToMinutes(t)` — converts an HHMM int to minutes since midnight.

  ```js
  export function timeToMinutes(t) {
      return Math.floor(t / 100) * 60 + (t % 100)
  }
  ```

- `findCourseConflicts(cEvents, minGapMinutes)` — returns:

  ```js
  {
      byCourse: number[][],          // byCourse[i] = sorted unique course indexes in conflict with course i
      boxes: [{ a, b, day, start, end }]  // a != b, day = day index, start/end = HHMM box region
  }
  ```

  Algorithm:
  1. Build the slot list per course (skip `online` courses): `{ courseIndex, meetingTime, daysOfWeek }` for the main meeting and for each extra meeting.
  2. For every slot pair where `courseIndex` differs, if `daysOfWeek` overlaps and `dist < minGapMinutes`, record the pair.
      - True overlap (`max(startA, startB) < min(endA, endB)`): box region is the intersection `[max(startA, startB), min(endA, endB)]`.
      - Near-miss otherwise: box region is `[min(endA, endB) − 5min, max(startA, startB) + 5min]`, where the 5 minute padding is applied in minutes (`start − 5`, `end + 5`, converted back to HHMM).
      - Push one `{a, b, day, start, end}` box entry **per shared day**.
  3. Aggregate unique conflicting course indexes into `byCourse`.

- `saveConflictGapSetting(value)` / `loadConflictGapSetting()` — mirror the `save24HourSetting` / `load24HourSetting` pattern (base64-encoded localStorage). `loadConflictGapSetting()` returns `10` when missing/invalid (guard against `NaN`).

## Step 2 — Setting (Settings.svelte + +page.svelte)

**`src/routes/Settings.svelte`**

- Add a new `.surface-1` card titled *"Course Conflict Settings"* containing a label *"Minimum conflict gap (minutes):"* and a number input bound to `conflictGap` with `min="0"`.
- Remove the stray unused `import Chip from "../lib/components/Chip.svelte";` at line 2 (leftover from an earlier chip test).

**`src/routes/+page.svelte`**

- Add `let conflictGap = $state(10)`.
- Load it in `onMount` via `loadConflictGapSetting()`.
- Persist it in a `$effect` via `saveConflictGapSetting(conflictGap)` (same pattern as `use24Hour`).
- Pass it to children:
  - `<Settings bind:conflictGap={conflictGap} />`
  - `<Schedule conflictGap={conflictGap} ... />`
  - `<Configuration conflictGap={conflictGap} ... />`

## Step 3 — Schedule viewer (`src/routes/Schedule.svelte`)

- Add a `conflictGap = 10` prop.
- Import `ChipList` and `findCourseConflicts`.
- Compute `let conflicts = $derived(findCourseConflicts(cEvents, conflictGap))`.
- Inside the main course holder (after the `Days`/`Online Class` line), render the chip list only when the course has conflicts:

  ```svelte
  {#if conflicts.byCourse[i]?.length > 0}
      <ChipList chipArr={conflicts.byCourse[i].map(j => ({
          text: `${cEvents[j].coursePrefix} ${cEvents[j].courseCode}`,
          color: 'septenary',
          iconName: 'warning'
      }))} />
  {/if}
  ```

  Optional: render a quiet success-colored *"No Conflicts"* chip otherwise.
- Pass `minGapMinutes={conflictGap}` through to `<Calendar>`.

## Step 4 — Configuration (`src/routes/Configuration.svelte`)

- Add a `conflictGap = 10` prop.
- Import `ChipList` and `findCourseConflicts`.
- Compute `let conflicts = $derived(findCourseConflicts(cEvents, conflictGap))`.
- Place the same `ChipList` block inside the main course holder (after the `Days` line), keyed off `conflicts.byCourse[i]`.

## Step 5 — Calendar box rendering (`src/lib/components/Calendar.svelte`)

- New props: `minGapMinutes = 10` (alongside the existing `eventVisibility`).
- Compute `let conflicts = $derived(findCourseConflicts(calendarEvents, minGapMinutes))`.
- Add a `renderConflicts()` pass and call it from `renderCalendar()` **after** `renderEvents()` so boxes overlay the event blocks.
- Reuse the geometry math from `renderEvents` (header point, legend point, divider spacing, `hourSpacing`):

  ```
  pixelsY(hhmm) = ((hhmm / 100) - timeScale[0]) * hourSpacing
  x = legendPoint + (vertDividerSpacing * day) + 1
  width = vertDividerSpacing
  height = ((end - start) / 100) * hourSpacing
  5-minute padding = (5 / 60) * hourSpacing
  ```

- For each box, skip unless `eventVisibility[box.a]` **and** `eventVisibility[box.b]` are truthy.
- Draw with `context.fillStyle = '${colors.error}bf'` (semi-transparent error color, matching the existing `bf` alpha convention); optionally follow with a `strokeRect` using full `colors.error`.

## Step 6 — Wrap-up

- `Refinements.md`: move the item out of *Planned Refinements* into *Completed Refinements by Version → v1.3*.
- Bump the version in `package.json` (and in Credits if versions are surfaced there).

## Verification Checklist

- [ ] Two overlapping courses → red chip on each card **and** a box over the intersection on shared days.
- [ ] 9:55 → 10:00 adjacency with a 10-minute gap → **no** conflict. Same adjacency with gap set to 5 → conflict + padded box `[9:50, 10:05]`.
- [ ] Extra-meeting vs. main-meeting conflict between two courses → course-level chip on both cards, box on the shared day.
- [ ] Toggling a course off → its chips remain, but its calendar conflict boxes disappear.
- [ ] Online courses are never flagged (and never appear as conflicting chips).
- [ ] A course's main meeting vs. its own extra meeting does **not** self-conflict.
- [ ] Setting persists across a reload; a missing/invalid stored value falls back to 10.
- [ ] Editing a course in Configuration immediately updates chips and calendar boxes (reactive derivation).
- [ ] `npm run build` passes (no test suite exists; build is the only verification step).