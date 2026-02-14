# East Coast Daily Punch Card (One Page)

## 45-Minute Target
- [ ] Start timer (45:00)
- [ ] Open `admin.html`
- [ ] Focus order: Tier 1 -> Tier 2 -> Tier 3 exceptions -> Export/Deploy

## Time Blocks

### 0:00-0:05 Setup
- [ ] Review overnight weather/wind/snow shifts
- [ ] Identify any obvious high-impact resorts first

### 0:05-0:30 Tier 1 Full (18)
- [ ] Killington
- [ ] Stowe
- [ ] Sugarbush
- [ ] Stratton
- [ ] Mount Snow
- [ ] Okemo
- [ ] Jay Peak
- [ ] Smugglers' Notch
- [ ] Sunday River
- [ ] Sugarloaf
- [ ] Loon
- [ ] Whiteface
- [ ] Hunter
- [ ] Windham
- [ ] Gore Mountain
- [ ] Mont Tremblant
- [ ] Camelback
- [ ] Blue Mountain

Per-resort fields:
- [ ] Current Conditions
- [ ] Trails Open/Closed
- [ ] Lifts Open/Total (if needed)
- [ ] 24h / 48h / 7d snow (if changed)
- [ ] Icecoast Rating (only if needed)

### 0:30-0:40 Tier 2 Lite
- [ ] Pico
- [ ] Mad River Glen
- [ ] Burke
- [ ] Cannon
- [ ] Wildcat
- [ ] Waterville Valley
- [ ] Bretton Woods
- [ ] Belleayre
- [ ] Jiminy Peak
- [ ] Wachusett
- [ ] Saddleback
- [ ] Mont-Sainte-Anne
- [ ] Le Massif
- [ ] Mont Sutton

Rule: update only obvious changes; defer deep pass to next day.

### 0:40-0:43 Tier 3 Exceptions Only
- [ ] Jack Frost
- [ ] Big Boulder
- [ ] Shawnee
- [ ] Bear Creek
- [ ] Elk Mountain
- [ ] Montage Mountain
- [ ] Mohawk Mountain

Rule: touch only if material change / weekend surge.

### 0:43-0:45 Ship
- [ ] Refresh output
- [ ] Download `manual-data.js`
- [ ] Replace `main/files/v2/manual-data.js`
- [ ] Commit + deploy
- [ ] Spot-check 3 cards (Tier 1 / Tier 2 / Tier 3)

---

## Fast Quality Guardrails
- [ ] No blank critical fields where yesterday is still usable
- [ ] Low-rating copy stays ski-positive
- [ ] Send It card still stable on mobile
- [ ] Drive Time block not blank

## Weekly Checks (Fri)
- [ ] Deep pass for all Tier 2
- [ ] Refresh Tier 3 before weekend
- [ ] Confirm Windham pass status stays non-Ikon
