(function () {
  const NS = "http://www.w3.org/2000/svg";

  const statusEl = document.getElementById("status");
  const hudOverlay = document.getElementById("hudOverlay");
  const unlockBtn = document.getElementById("unlockBtn");
  const hudRadial = document.getElementById("hudRadial");

  const ring2 = document.getElementById("wheelRing2"); // difficulty
  const ring3 = document.getElementById("wheelRing3"); // active options (old ring4 content)
  const ring4 = document.getElementById("wheelRing4"); // unused
  const trailsGroup = document.getElementById("trails");
  const stageWrap = document.querySelector(".stage-wrap");

  const sendBtn = document.getElementById("sendBtn");
  const sendIcon = document.getElementById("sendIcon");
  const sendLabel = document.getElementById("sendLabel");
  const selectionLockline = document.getElementById("selectionLockline");

  const dot = document.getElementById("signal-dot");
  const ring = document.getElementById("signal-ring");

  const trails = {
    green: document.getElementById("trail-green"),
    blue: document.getElementById("trail-blue"),
    black: document.getElementById("trail-black"),
    double: document.getElementById("trail-double")
  };

  const styleMap = {
    green: { label: "Green Circle", color: "#2aaa62", duration: 5200 },
    blue: { label: "Blue Square", color: "#2f6df1", duration: 3800 },
    black: { label: "Black Diamond", color: "#2d3442", duration: 2800 },
    double: { label: "Double Black", color: "#0f1218", duration: 2000 }
  };

  // Keep trail overlay aligned with background image framing tweaks in CSS.
  const BG_EXTRA_HEIGHT_PX = 13;
  const BG_X_SHIFT_PX = -25;

  const sequence = ["wind", "crowd", "hazard", "slope"];
  const groupCenters = { wind: -90, crowd: 0, hazard: 90, slope: 180 };
  const groupIcons = {
    wind: "./assets/wind.png",
    crowd: "./assets/lift.png",
    hazard: "./assets/caution.png",
    slope: "./assets/slope.png"
  };

  const options = {
    wind: ["Calm", "Breezy", "Blasting"],
    crowd: ["Quiet", "Normal", "Packed"],
    slope: ["Sharpen Edges", "Good Laps", "Full Send"],
    hazard: ["Icy", "Jerry Swarm", "All Clear"]
  };

  const lockedPromptsByRegion = {
    vermont: ["DROP IN", "PICK YOUR LINE", "HUNT THE GOODS", "CALL YOUR SHOT", "TREE-LINE TIME"],
    poconos: ["DROP IN", "FAST LAPS", "NIGHT RIPS", "PARK OR CARVE", "CALL YOUR SHOT"],
    catskills: ["DROP IN", "HIT THE RIDGE", "FIND THE FLOW", "CALL YOUR SHOT", "WAX AND RIP"],
    adirondacks: ["DROP IN", "BIG MOUNTAIN MODE", "LONG FALL-LINE", "CALL YOUR SHOT", "HOLD YOUR EDGE"],
    white_mountains: ["DROP IN", "RIDE THE NOTCH", "WIND CHECK", "CALL YOUR SHOT", "HUNT THE GOODS"],
    maine: ["DROP IN", "STACK VERT", "GO DEEP", "CALL YOUR SHOT", "FIND THE GOODS"],
    quebec: ["DROP IN", "CHOISIS TA LIGNE", "FIND THE FLOW", "CALL YOUR SHOT", "TREE-LINE TIME"],
    default: ["DROP IN", "PICK YOUR LINE", "CALL YOUR SHOT", "FIND THE FLOW", "SEND A READ"]
  };

  const resortRegionMap = {
    // Poconos / PA
    "camelback": "poconos",
    "blue-mountain": "poconos",
    "jack-frost": "poconos",
    "big-boulder": "poconos",
    "shawnee": "poconos",
    "bear-creek": "poconos",
    "elk": "poconos",
    "montage": "poconos",

    // Catskills
    "hunter": "catskills",
    "windham": "catskills",
    "belleayre": "catskills",

    // Adirondacks
    "whiteface": "adirondacks",
    "gore-mountain": "adirondacks",

    // VT / Northern Greens
    "stratton": "vermont",
    "mount-snow": "vermont",
    "killington": "vermont",
    "okemo": "vermont",
    "pico": "vermont",
    "sugarbush": "vermont",
    "mad-river-glen": "vermont",
    "stowe": "vermont",
    "smugglers-notch": "vermont",
    "jay-peak": "vermont",
    "burke": "vermont",

    // NH / White Mountains
    "loon": "white_mountains",
    "brettonwoods": "white_mountains",
    "waterville": "white_mountains",
    "cannon": "white_mountains",
    "wildcat": "white_mountains",

    // Maine
    "sunday-river": "maine",
    "sugarloaf": "maine",
    "saddleback": "maine",

    // Quebec
    "tremblant": "quebec",
    "mont-sainte-anne": "quebec",
    "le-massif": "quebec",
    "mont-sutton": "quebec"
  };

  const resortPromptOverrides = {
    "jay-peak": ["TRAM LINE UP", "TREE RUNS CALLING", "DROP INTO THE GLADE", "FIND THE STASH"],
    "killington": ["STACK VERT", "BEAST MODE", "FIND THE FAST LINE", "CALL YOUR SHOT"],
    "mad-river-glen": ["SINGLE CHAIR ENERGY", "NATURAL SNOW HUNT", "PICK YOUR LINE", "DROP IN"],
    "sugarloaf": ["BIG MOUNTAIN MODE", "WIDE OPEN LAPS", "STACK VERT", "FIND THE FLOW"],
    "whiteface": ["HOLD YOUR EDGE", "HIGH PEAKS MODE", "LONG FALL-LINE", "CALL YOUR SHOT"],
    "mont-sutton": ["CHOISIS TA LIGNE", "GLADES ON DECK", "FIND THE FLOW", "CALL YOUR SHOT"]
  };

  function slugify(v) {
    return String(v || "")
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }

  const resortIdAliases = (() => {
    const keys = Object.keys(resortRegionMap);
    const map = new Map();
    keys.forEach((id) => {
      map.set(id, id);
      map.set(id.replace(/-/g, " "), id);
      map.set(id.replace(/-/g, ""), id);
    });
    // Common human/name aliases
    map.set("mt-snow", "mount-snow");
    map.set("mount-sutton", "mont-sutton");
    map.set("smuggs", "smugglers-notch");
    map.set("smugglers-notch", "smugglers-notch");
    map.set("bretton-woods", "brettonwoods");
    map.set("lemassif", "le-massif");
    map.set("mont-sainte-anne", "mont-sainte-anne");
    return map;
  })();

  function normalizeResortId(raw) {
    const s = slugify(raw);
    if (!s) return "";
    return resortIdAliases.get(s) || s;
  }

  function resolveResortId() {
    const q = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const pathTail = pathParts[pathParts.length - 1] || "";
    const bodyResort = document.body?.dataset?.resortId;
    const globalResort = window.SLOPE_SIGNAL_RESORT_ID || window.ICECOAST_RESORT_ID || window.currentResortId;
    const storedResort =
      localStorage.getItem("icecoastSelectedResortId")
      || localStorage.getItem("icecoast_active_resort")
      || localStorage.getItem("icecoast_resort_id");

    const candidates = [
      q.get("resortId"),
      q.get("resort"),
      hash.get("resortId"),
      hash.get("resort"),
      bodyResort,
      globalResort,
      storedResort,
      pathTail
    ];

    for (const candidate of candidates) {
      const id = normalizeResortId(candidate);
      if (id && resortRegionMap[id]) return id;
    }
    return "";
  }

  function detectPromptRegion() {
    const q = new URLSearchParams(window.location.search);
    const explicitRegion = slugify(q.get("region"));
    const explicitResort = resolveResortId();

    if (explicitResort && resortRegionMap[explicitResort]) return resortRegionMap[explicitResort];
    if (explicitRegion && lockedPromptsByRegion[explicitRegion]) return explicitRegion;

    const raw = `${explicitRegion} ${explicitResort}`.toLowerCase();
    if (!raw.trim()) return "default";
    if (raw.includes("pocono") || raw.includes("camelback") || raw.includes("blue") || raw.includes("shawnee")) return "poconos";
    if (raw.includes("catskill") || raw.includes("windham") || raw.includes("hunter") || raw.includes("belleayre")) return "catskills";
    if (raw.includes("adirondack") || raw.includes("whiteface") || raw.includes("gore")) return "adirondacks";
    if (raw.includes("white mountain") || raw.includes("new hampshire") || raw.includes("loon") || raw.includes("wildcat")) return "white_mountains";
    if (raw.includes("maine") || raw.includes("sugarloaf") || raw.includes("sunday river") || raw.includes("saddleback")) return "maine";
    if (raw.includes("quebec") || raw.includes("sutton") || raw.includes("tremblant") || raw.includes("massif")) return "quebec";
    if (raw.includes("vermont") || raw.includes("jay") || raw.includes("stowe") || raw.includes("killington")) return "vermont";
    return "default";
  }

  function detectPromptResort() {
    return resolveResortId();
  }

  const promptResort = detectPromptResort();
  const promptRegion = detectPromptRegion();
  const promptPool = resortPromptOverrides[promptResort] || lockedPromptsByRegion[promptRegion] || lockedPromptsByRegion.default;
  let promptCursor = Math.floor(Math.random() * promptPool.length);

  function nextLockedPrompt() {
    const msg = promptPool[promptCursor % promptPool.length];
    promptCursor += 1;
    return msg;
  }

  let unlocked = false;
  let selectedDifficulty = null;
  let sequenceIndex = -1;
  let activeGroup = "";

  let anim = null;
  let hudSendAnim = null;
  const FIXED_TRAIL_DURATION = 1150;

  const state = {
    wind: null,
    crowd: null,
    slope: null,
    hazard: null
  };

  const optionSectors = [];
  const optionLabels = [];
  const tierSectors = new Map();
  const tierLabels = new Map();
  let arcLabelIdCounter = 0;

  function applyTrailCompensation() {
    if (!trailsGroup || !stageWrap) return;
    const rect = stageWrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const viewW = 1536;
    const pxToViewX = viewW / rect.width;
    const yScale = (rect.height + BG_EXTRA_HEIGHT_PX) / rect.height;

    // Negative BG_X_SHIFT_PX in CSS means the image content appears shifted right.
    const txView = (-BG_X_SHIFT_PX) * pxToViewX;
    trailsGroup.setAttribute("transform", `translate(${txView.toFixed(3)} 0) scale(1 ${yScale.toFixed(5)})`);
  }

  function polar(cx, cy, r, aDeg) {
    const a = (aDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function sectorPath(cx, cy, rIn, rOut, aStart, aEnd) {
    const p1 = polar(cx, cy, rOut, aStart);
    const p2 = polar(cx, cy, rOut, aEnd);
    const p3 = polar(cx, cy, rIn, aEnd);
    const p4 = polar(cx, cy, rIn, aStart);
    const large = Math.abs(aEnd - aStart) > 180 ? 1 : 0;
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y}`,
      "Z"
    ].join(" ");
  }

  function addSector(group, cfg) {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("class", `wheel-sector${cfg.sectorClass ? ` ${cfg.sectorClass}` : ""}`);
    path.setAttribute("d", sectorPath(300, 300, cfg.rIn, cfg.rOut, cfg.center - cfg.span / 2, cfg.center + cfg.span / 2));
    path.dataset.group = group;
    if (cfg.value) path.dataset.value = cfg.value;
    if (cfg.signal) path.dataset.signal = cfg.signal;

    const label = document.createElementNS(NS, "text");
    label.setAttribute("class", `wheel-label${cfg.labelClass ? ` ${cfg.labelClass}` : ""}`);
    if (cfg.arcText && cfg.curveText) {
      const textRadius = (cfg.rIn + cfg.rOut) / 2;
      const textStart = cfg.center - cfg.span / 2 + 4;
      const textEnd = cfg.center + cfg.span / 2 - 4;
      const a = polar(300, 300, textRadius, textStart);
      const b = polar(300, 300, textRadius, textEnd);
      const guideId = `arc-guide-${arcLabelIdCounter++}`;
      const guide = document.createElementNS(NS, "path");
      guide.setAttribute("id", guideId);
      guide.setAttribute("class", "label-guide");
      guide.setAttribute("d", `M ${a.x} ${a.y} A ${textRadius} ${textRadius} 0 0 1 ${b.x} ${b.y}`);
      cfg.parent.appendChild(guide);

      const textPath = document.createElementNS(NS, "textPath");
      textPath.setAttribute("href", `#${guideId}`);
      textPath.setAttribute("startOffset", "50%");
      textPath.setAttribute("text-anchor", "middle");
      textPath.textContent = cfg.label;
      label.appendChild(textPath);
    } else {
      const lp = polar(300, 300, (cfg.rIn + cfg.rOut) / 2, cfg.center);
      label.setAttribute("x", lp.x);
      label.setAttribute("y", lp.y);
      if (cfg.arcText) {
        let rot = cfg.textMode === "radial" ? cfg.center : cfg.center + 90;
        let norm = ((rot % 360) + 360) % 360;
        if (norm > 90 && norm < 270) rot += 180;
        if (typeof cfg.rotateDelta === "number") rot += cfg.rotateDelta;
        label.setAttribute("transform", `rotate(${rot} ${lp.x} ${lp.y})`);
      }
      label.textContent = cfg.label;
    }
    if (cfg.signal) label.dataset.signal = cfg.signal;

    cfg.parent.appendChild(path);
    cfg.parent.appendChild(label);

    return { path, label };
  }

  function buildWheel() {
    const ring2Cfg = [
      { signal: "green", label: "●", center: -150 },
      { signal: "blue", label: "■", center: -108 },
      { signal: "black", label: "◆", center: -66 },
      { signal: "double", label: "◆◆", center: -24 }
    ];

    ring2Cfg.forEach((s) => {
      const it = addSector("tier", {
        parent: ring2,
        rIn: 106,
        rOut: 196,
        center: s.center,
        span: 40,
        signal: s.signal,
        label: s.label,
        sectorClass: "signal-sector",
        labelClass: "signal-label",
        arcText: true,
        textMode: "tangent"
      });
      if (s.signal === "double") {
        it.label.textContent = "◆ ◆";
      }
      it.path.dataset.signal = s.signal;
      tierSectors.set(s.signal, it.path);
      tierLabels.set(s.signal, it.label);
    });
  }

  function renderGroupOptions(group) {
    ring3.innerHTML = "";
    optionSectors.length = 0;
    optionLabels.length = 0;

    // All secondary selections are presented at 12 o'clock.
    const center = -90;
    const vals = options[group] || [];
    const offs = [-44, 0, 44];

    vals.forEach((v, i) => {
      const it = addSector(group, {
        parent: ring3,
        rIn: 210,
        rOut: 292,
        center: center + offs[i],
        span: 42,
        value: v,
        label: String(v).toUpperCase(),
        arcText: true,
        curveText: true,
        textMode: "tangent",
        sectorClass: "option-sector",
        labelClass: "option-label"
      });
      optionSectors.push(it.path);
      optionLabels.push(it.label);

      if (state[group] === v) {
        it.path.classList.add("active");
        it.label.classList.add("active");
      }
    });
  }

  function setCenterDisplay(group) {
    if (!group) {
      sendIcon.style.display = "none";
      sendIcon.classList.remove("icon-hazard");
      if (selectedDifficulty) {
        sendLabel.innerHTML = "";
      } else if (!sendLabel.innerHTML.trim()) {
        const msg = nextLockedPrompt();
        sendLabel.innerHTML = `<span class="line-stack">${msg}</span>`;
      }
      return;
    }
    sendIcon.src = groupIcons[group];
    sendIcon.alt = `${group} icon`;
    sendIcon.classList.toggle("icon-hazard", group === "hazard");
    sendIcon.style.display = "block";
    sendLabel.textContent = "";
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function swapOptionsToGroup(group) {
    ring3.classList.add("options-swap");
    await wait(90);
    renderGroupOptions(group);
    ring3.classList.remove("options-swap");
  }

  async function runSendHudAnimation(signalColor) {
    if (hudRadial.classList.contains("sending") || hudSendAnim) return;
    hudSendAnim = true;

    hudRadial.classList.add("sending");
    sendBtn.style.setProperty("--signal-color", signalColor || "#2f6df1");
    sendBtn.classList.remove("submit-slam");
    // restart animation reliably
    void sendBtn.offsetWidth;
    sendBtn.classList.add("submit-slam");
    await wait(620);
    hudSendAnim = null;
  }

  function finalizeSendHudAnimation() {
    sendBtn.classList.remove("submit-slam");
    sendBtn.style.removeProperty("--signal-color");
    hudRadial.classList.remove("sending");
  }

  function resetTrails() {
    Object.values(trails).forEach((path) => {
      path.classList.remove("trail-active");
      path.classList.add("trail-hidden");
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    });
  }

  function primeTrail(path) {
    const len = path.getTotalLength();
    path.classList.add("trail-active");
    path.classList.remove("trail-hidden");
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    return len;
  }

  function setSignalVisual(color) {
    dot.setAttribute("fill", color);
    ring.setAttribute("stroke", color);
  }

  function moveSignal(path, length, progress) {
    const drawLen = length * progress;
    path.style.strokeDashoffset = `${length - drawLen}`;
    const point = path.getPointAtLength(drawLen);
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);
    ring.setAttribute("cx", point.x);
    ring.setAttribute("cy", point.y);
    dot.setAttribute("opacity", "1");
    ring.setAttribute("opacity", String(0.35 + 0.25 * Math.sin(performance.now() * 0.012)));
    ring.setAttribute("r", String(22 + 6 * Math.sin(performance.now() * 0.012)));
  }

  function clearSignal() {
    dot.setAttribute("opacity", "0");
    ring.setAttribute("opacity", "0");
  }

  function canSend() {
    return !!state.wind && !!state.crowd && !!state.slope && !!state.hazard;
  }

  function renderSelectionLockline(animateGroup = "") {
    if (!selectionLockline) return;
    selectionLockline.innerHTML = "";
    const selectedGroups = sequence.filter((g) => !!state[g]);
    selectionLockline.classList.toggle("visible", selectedGroups.length > 0);
    if (!selectedGroups.length) return;

    selectedGroups.forEach((group, idx) => {
      const item = document.createElement("span");
      item.className = "lock-item";
      if (group === animateGroup) item.classList.add("pop");

      const icon = document.createElement("img");
      icon.src = groupIcons[group];
      icon.alt = `${group} locked`;
      icon.decoding = "async";
      item.appendChild(icon);
      selectionLockline.appendChild(item);

      if (idx < selectedGroups.length - 1) {
        const plus = document.createElement("span");
        plus.className = "lock-plus";
        plus.textContent = "+";
        selectionLockline.appendChild(plus);
      }
    });
  }

  function resetSelections() {
    state.slope = null;
    state.crowd = null;
    state.wind = null;
    state.hazard = null;

    sequenceIndex = 0;
    activeGroup = sequence[sequenceIndex];

    renderSelectionLockline();
    setCenterDisplay(activeGroup);
    swapOptionsToGroup(activeGroup);
    updateSendState();
  }

  function resetToLockedAfterSend() {
    state.slope = null;
    state.crowd = null;
    state.wind = null;
    state.hazard = null;
    selectedDifficulty = null;
    sequenceIndex = -1;
    activeGroup = "";

    tierSectors.forEach((p) => p.classList.remove("active"));
    tierLabels.forEach((l) => l.classList.remove("active"));
    ring3.innerHTML = "";
    renderSelectionLockline();
    sendIcon.style.display = "none";
    sendIcon.classList.remove("icon-hazard");
    const msg = nextLockedPrompt();
    sendLabel.innerHTML = `<span class="line-stack">${msg}</span>`;
    updateSendState();
  }

  function updateSendState() {
    if (hudRadial.classList.contains("sending") || sendBtn.classList.contains("sent")) {
      return;
    }
    if (canSend()) {
      const becameReady = !sendBtn.classList.contains("ready");
      sendBtn.disabled = false;
      sendLabel.textContent = "SEND IT!";
      sendIcon.style.display = "none";
      sendIcon.classList.remove("icon-hazard");
      sendBtn.classList.add("ready");
      if (becameReady && selectionLockline) {
        selectionLockline.classList.remove("slam");
        // restart animation cleanly
        void selectionLockline.offsetWidth;
        selectionLockline.classList.add("slam");
      }
      return;
    }
    sendBtn.disabled = true;
    if (selectedDifficulty) {
      sendLabel.innerHTML = "";
    } else if (!sendLabel.innerHTML.trim()) {
      const msg = nextLockedPrompt();
      sendLabel.innerHTML = `<span class="line-stack">${msg}</span>`;
    }
    if (activeGroup) sendIcon.style.display = "block";
    sendBtn.classList.remove("ready");
    if (selectionLockline) selectionLockline.classList.remove("slam");
  }

  function animateTrail(signalKey) {
    return new Promise((resolve) => {
    const path = trails[signalKey];
    if (!path) {
      const style = styleMap[signalKey];
      statusEl.textContent = `${style.label} sent: ${state.crowd} crowd • ${state.wind} wind • ${state.hazard} • ${state.slope}.`;
      resolve();
      return;
    }
    if (anim) cancelAnimationFrame(anim);
    resetTrails();
    clearSignal();

    const style = styleMap[signalKey];
    const len = primeTrail(path);
    setSignalVisual(style.color);
    const start = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - start) / FIXED_TRAIL_DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      moveSignal(path, len, eased);
      if (p < 1) {
        anim = requestAnimationFrame(frame);
      } else {
        statusEl.textContent = `${style.label} sent: ${state.crowd} crowd • ${state.wind} wind • ${state.hazard} • ${state.slope}.`;
        setTimeout(() => {
          clearSignal();
          resolve();
        }, 420);
      }
    }

    anim = requestAnimationFrame(frame);
    });
  }

  function bindEvents() {
    ring2.addEventListener("click", (e) => {
      const target = e.target.closest("path.wheel-sector");
      if (!target || !unlocked || !target.dataset.signal) return;

      selectedDifficulty = target.dataset.signal;
      tierSectors.forEach((p, key) => p.classList.toggle("active", key === selectedDifficulty));
      tierLabels.forEach((l, key) => l.classList.toggle("active", key === selectedDifficulty));

      resetSelections();
      statusEl.textContent = "Set WIND first.";
    });

    ring3.addEventListener("click", (e) => {
      const target = e.target.closest("path.wheel-sector");
      if (!target || !unlocked || !selectedDifficulty || !activeGroup) return;

      const group = target.dataset.group;
      const value = target.dataset.value;
      if (group !== activeGroup) return;

      state[group] = value;
      renderSelectionLockline(group);

      optionSectors.forEach((p) => p.classList.remove("active"));
      optionLabels.forEach((l) => l.classList.remove("active"));
      target.classList.add("active");
      const idx = optionSectors.indexOf(target);
      if (idx >= 0) optionLabels[idx].classList.add("active");

      sequenceIndex++;
      if (sequenceIndex < sequence.length) {
        activeGroup = sequence[sequenceIndex];
        setCenterDisplay(activeGroup);
        swapOptionsToGroup(activeGroup);
        statusEl.textContent = `Set ${activeGroup.toUpperCase()} next.`;
      } else {
        activeGroup = "";
        ring3.innerHTML = "";
        setCenterDisplay(null);
        updateSendState();
        statusEl.textContent = "Loadout locked. Hit SEND IT.";
      }

      updateSendState();
    });

    sendBtn.addEventListener("click", async () => {
      if (!unlocked) {
        statusEl.textContent = "Unlock location first.";
        return;
      }
      if (!canSend() || !selectedDifficulty) {
        statusEl.textContent = "Complete all picks first.";
        return;
      }
      sendBtn.classList.remove("ready");
      try {
        await runSendHudAnimation(styleMap[selectedDifficulty]?.color);
        await animateTrail(selectedDifficulty);
        sendBtn.classList.add("sent");
        sendIcon.style.display = "none";
        sendLabel.textContent = "SLOPE SIGNAL SENT";
        statusEl.textContent = "Slope Signal sent. Lock in another read when it changes.";
        await wait(950);
      } finally {
        sendBtn.classList.remove("sent");
        finalizeSendHudAnimation();
        resetToLockedAfterSend();
      }
    });

    unlockBtn.addEventListener("click", () => {
      unlocked = true;
      unlockBtn.style.display = "none";
      hudRadial.classList.add("unlocked");
      renderSelectionLockline();
      setCenterDisplay(null);
      statusEl.textContent = "HUD unlocked. Pick trail difficulty on ring 2.";
      updateSendState();
    });
  }

  buildWheel();
  bindEvents();
  applyTrailCompensation();
  window.addEventListener("resize", applyTrailCompensation);
  sendBtn.disabled = true;
  renderSelectionLockline();
  setCenterDisplay(null);
  resetTrails();
})();
