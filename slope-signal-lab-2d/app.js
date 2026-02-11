(function () {
  const NS = "http://www.w3.org/2000/svg";

  const statusEl = document.getElementById("status");
  const hudOverlay = document.getElementById("hudOverlay");
  const unlockBtn = document.getElementById("unlockBtn");
  const hudRadial = document.getElementById("hudRadial");

  const ring2 = document.getElementById("wheelRing2"); // difficulty
  const ring3 = document.getElementById("wheelRing3"); // active options (old ring4 content)
  const ring4 = document.getElementById("wheelRing4"); // unused

  const sendBtn = document.getElementById("sendBtn");
  const sendIcon = document.getElementById("sendIcon");
  const sendLabel = document.getElementById("sendLabel");

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
    hazard: ["❄️ Icy", "Jerry Swarm", "Boarder Bogeys"]
  };

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
    if (cfg.signal) label.dataset.signal = cfg.signal;
    label.textContent = cfg.label;

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
        rIn: 78,
        rOut: 166,
        center: s.center,
        span: 40,
        signal: s.signal,
        label: s.label,
        sectorClass: "signal-sector",
        labelClass: "signal-label"
      });
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
        rIn: 188,
        rOut: 296,
        center: center + offs[i],
        span: 42,
        value: v,
        label: v,
        arcText: true,
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
      sendLabel.innerHTML = selectedDifficulty ? "" : '<span class="line-stack">CHOOSE<br>YOUR<br>LINE</span><span class="line-bolt">⚡</span>';
      return;
    }
    sendIcon.src = groupIcons[group];
    sendIcon.alt = `${group} icon`;
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

  async function runSendHudAnimation() {
    if (hudRadial.classList.contains("sending") || hudSendAnim) return;
    hudSendAnim = true;

    hudRadial.classList.add("sending");
    hudOverlay.classList.add("signal-out");
    sendBtn.classList.add("press");
    await wait(130);
    sendBtn.classList.remove("press");

    hudRadial.classList.add("menu-collapse");
    await wait(220);

    sendBtn.classList.add("travel");
    await wait(480);

    sendBtn.classList.add("beacon-fast");
    await wait(760);

    sendBtn.classList.remove("beacon-fast", "travel");
    hudRadial.classList.remove("menu-collapse", "sending");
    hudOverlay.classList.remove("signal-out");
    hudSendAnim = null;
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

  function resetSelections() {
    state.slope = null;
    state.crowd = null;
    state.wind = null;
    state.hazard = null;

    sequenceIndex = 0;
    activeGroup = sequence[sequenceIndex];

    setCenterDisplay(activeGroup);
    swapOptionsToGroup(activeGroup);
    updateSendState();
  }

  function updateSendState() {
    if (canSend()) {
      sendBtn.disabled = false;
      sendLabel.textContent = "SEND IT";
      sendIcon.style.display = "none";
      return;
    }
    sendBtn.disabled = true;
    sendLabel.innerHTML = selectedDifficulty ? "" : '<span class="line-stack">CHOOSE<br>YOUR<br>LINE</span><span class="line-bolt">⚡</span>';
    if (activeGroup) sendIcon.style.display = "block";
  }

  function animateTrail(signalKey) {
    if (anim) cancelAnimationFrame(anim);
    resetTrails();
    clearSignal();

    const path = trails[signalKey];
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
        setTimeout(clearSignal, 420);
      }
    }

    anim = requestAnimationFrame(frame);
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

    sendBtn.addEventListener("click", () => {
      if (!unlocked) {
        statusEl.textContent = "Unlock location first.";
        return;
      }
      if (!canSend() || !selectedDifficulty) {
        statusEl.textContent = "Complete all picks first.";
        return;
      }
      runSendHudAnimation();
      animateTrail(selectedDifficulty);
    });

    unlockBtn.addEventListener("click", () => {
      unlocked = true;
      unlockBtn.style.display = "none";
      hudRadial.classList.add("unlocked");
      setCenterDisplay(null);
      statusEl.textContent = "HUD unlocked. Pick trail difficulty on ring 2.";
      updateSendState();
    });
  }

  buildWheel();
  bindEvents();
  sendBtn.disabled = true;
  setCenterDisplay(null);
  resetTrails();
})();
