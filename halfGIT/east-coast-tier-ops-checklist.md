# East Coast Tier Ops Checklist (45-Minute Morning Run)

## Tiering

### Tier 1 (Daily Full Update)
- Killington
- Stowe
- Sugarbush
- Stratton
- Mount Snow
- Okemo
- Jay Peak
- Smugglers' Notch
- Sunday River
- Sugarloaf
- Loon
- Whiteface
- Hunter
- Windham
- Gore Mountain
- Mont Tremblant
- Camelback
- Blue Mountain

### Tier 2 (Daily Lite or Every Other Day Full)
- Pico
- Mad River Glen
- Burke
- Cannon
- Wildcat
- Waterville Valley
- Bretton Woods
- Belleayre
- Jiminy Peak
- Wachusett
- Saddleback
- Mont-Sainte-Anne
- Le Massif
- Mont Sutton

### Tier 3 (2-3x/Week, Weekend-Focused)
- Jack Frost
- Big Boulder
- Shawnee
- Bear Creek
- Elk Mountain
- Montage Mountain
- Mohawk Mountain

---

## 45-Minute Morning Workflow

### 0:00-0:05 - Open + Triage
- Open `admin.html` and select today's priority resorts.
- Check for storms/temp swings/wind events that need fast manual overrides.

### 0:05-0:30 - Tier 1 Full Pass (18 resorts)
For each Tier 1 resort:
- Set `Current Conditions`.
- Update `Trails Open/Closed` and `Lifts Open/Total` (if needed).
- Update `24h`, `48h`, `7d` snowfall if manual source differs from defaults.
- Adjust `Icecoast Rating` only when needed.
- Adjust `Après` and `Family` only if you intentionally re-rate.

Target pace: ~75 seconds per resort average.

### 0:30-0:40 - Tier 2 Lite Pass
- Quick scan all Tier 2 for obvious mismatches.
- Apply updates only where major changes happened.
- Flag any resort for deep update tomorrow if needed.

### 0:40-0:43 - Tier 3 Exceptions
- Update only if material change or if it's a peak traffic day.

### 0:43-0:45 - Export + Deploy
- Click `Refresh Output` then `Download manual-data.js`.
- Replace `main/files/v2/manual-data.js`.
- Commit and deploy.
- Spot-check 3 cards (one Tier 1, one Tier 2, one Tier 3) on mobile.

---

## Cadence Rules
- Tier 1: every morning.
- Tier 2: lite daily, deep update every other day.
- Tier 3: 2-3x/week or conditions-driven.

## Quality Rules
- If uncertain, keep prior value and add on next pass.
- Never leave a field blank if yesterday's value is still directionally valid.
- Keep voice consistent: low ratings should still be ski-positive.

## Expansion Rule
- Do not add new regions until this runbook stays under 60 minutes for 14 consecutive days.
