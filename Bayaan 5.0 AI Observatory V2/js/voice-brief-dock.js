/* Bayaan AI Voice Briefing Dock — shared with index Executive Brief.
   Injects the floating dock on standalone pages (AI Observatory, etc.)
   and exposes openVoiceBriefDock / openVoiceBriefDockFromHero. */
(function () {
  "use strict";

  if (window.__voiceBriefDockReady) return;

  const VOICE_BRIEF_CONTEXTS = {};

  const VOICE_DOCK_CONTROLS = {
    ai_speaking: {
      left: { icon: "ti-player-pause", label: "Pause" },
      right: { icon: "ti-refresh", label: "Reset" },
    },
    ai_responding: {
      left: { icon: "ti-player-pause", label: "Pause" },
      right: { icon: "ti-refresh", label: "Reset" },
    },
    user_speaking: {
      left: { icon: "ti-player-pause", label: "Pause" },
      right: { icon: "ti-x", label: "Cancel" },
    },
  };

  const voiceDock = {
    state: "closed",
    ctxKey: null,
    cardEl: null,
    paused: false,
    turnIndex: 0,
    pendingTurn: null,
    listeningTimer: null,
    userAutoTimer: null,
    processingTimer: null,
    waveSimTimer: null,
  };

  const vdSynth = window.speechSynthesis || null;
  let vdUtterance = null;
  let vdFallbackTimer = null;

  function ensureVoiceDockDom() {
    if (document.getElementById("voiceDock")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<div id="voiceDockOverlay" class="voice-dock-overlay"></div>' +
      '<div id="voiceDock" class="voice-dock" data-state="ai_speaking" role="dialog" aria-modal="false" aria-label="Bayaan AI voice briefing" hidden>' +
        '<div class="voice-dock-bar">' +
          '<div class="voice-dock-bar-inner">' +
            '<div class="voice-dock-left">' +
              '<span class="voice-dock-left-icon" aria-hidden="true">' +
                '<svg id="voiceDockContextIcon" width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<path d="M9 4L9 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
                  '<path d="M15 4L15 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
                  '<path d="M20 8L20 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
                  '<path d="M4 8L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
                "</svg>" +
              "</span>" +
              '<div class="voice-dock-left-text">' +
                '<span class="voice-dock-status" id="voiceDockStatusText" role="status" aria-live="polite">AI is speaking</span>' +
              "</div>" +
            "</div>" +
            '<div class="voice-dock-center" id="voiceDockCenter">' +
              '<div class="voice-dock-waveform" id="voiceDockWaveform" aria-hidden="true"></div>' +
              '<button type="button" class="voice-dock-mic" id="voiceDockMic" aria-label="Start speaking" title="Start speaking">' +
                '<span class="voice-dock-mic-ring" aria-hidden="true"></span>' +
                '<i class="ti ti-microphone voice-dock-mic-icon" aria-hidden="true"></i>' +
                '<svg class="voice-dock-stop-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                  '<path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />' +
                "</svg>" +
              "</button>" +
            "</div>" +
            '<div class="voice-dock-controls" id="voiceDockControls">' +
              '<button type="button" class="voice-dock-btn" id="voiceDockBtnLeft">' +
                '<i class="ti" id="voiceDockBtnLeftIcon" aria-hidden="true"></i>' +
                '<span id="voiceDockBtnLeftLabel"></span>' +
              "</button>" +
              '<button type="button" class="voice-dock-btn" id="voiceDockBtnRight">' +
                '<i class="ti" id="voiceDockBtnRightIcon" aria-hidden="true"></i>' +
                '<span id="voiceDockBtnRightLabel"></span>' +
              "</button>" +
            "</div>" +
            '<button type="button" class="voice-dock-close" id="voiceDockClose" aria-label="Close voice briefing" title="Close">' +
              '<i class="ti ti-x"></i>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</div>";
    document.body.appendChild(wrap);

    document.getElementById("voiceDockOverlay")?.addEventListener("click", closeVoiceDock);
    document.getElementById("voiceDockMic")?.addEventListener("click", voiceDockMicTap);
    document.getElementById("voiceDockBtnLeft")?.addEventListener("click", voiceDockLeftAction);
    document.getElementById("voiceDockBtnRight")?.addEventListener("click", voiceDockRightAction);
    document.getElementById("voiceDockClose")?.addEventListener("click", closeVoiceDock);
  }

  function registerVoiceBriefContext(ctxKey, ctx) {
    if (!ctxKey || !ctx) return;
    VOICE_BRIEF_CONTEXTS[ctxKey] = ctx;
  }

  function vdCapSlot(slot) {
    return slot.charAt(0).toUpperCase() + slot.slice(1);
  }

  function buildVoiceWaveBars() {
    const wrap = document.getElementById("voiceDockWaveform");
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = "1";
    const BAR_COUNT = 56;
    for (let i = 0; i < BAR_COUNT; i++) {
      const p = i / (BAR_COUNT - 1);
      const edge = Math.min(1, p / 0.08, (1 - p) / 0.08);
      const cluster =
        0.55 +
        0.28 * Math.sin(p * Math.PI * 2.6 + 0.4) +
        0.17 * Math.sin(p * Math.PI * 6.5 + 1.1);
      const jitter = 0.7 + Math.random() * 0.6;
      const amp = Math.max(0.05, Math.min(1, cluster * jitter * edge));
      const bar = document.createElement("span");
      bar.className = "voice-wave-bar";
      bar.style.setProperty("--i", i);
      bar.style.setProperty("--amp", amp.toFixed(3));
      wrap.appendChild(bar);
    }
  }

  function vdSetCardActive(cardEl) {
    if (voiceDock.cardEl && voiceDock.cardEl !== cardEl) {
      voiceDock.cardEl.classList.remove("card-ai-active");
    }
    voiceDock.cardEl = cardEl || null;
    if (cardEl) cardEl.classList.add("card-ai-active");
  }

  function vdClearCardActive() {
    if (voiceDock.cardEl) voiceDock.cardEl.classList.remove("card-ai-active");
    voiceDock.cardEl = null;
  }

  function vdEscHandler(e) {
    if (e.key === "Escape") closeVoiceDock();
  }

  function clearVoiceTimers() {
    if (voiceDock.listeningTimer) {
      clearTimeout(voiceDock.listeningTimer);
      voiceDock.listeningTimer = null;
    }
    if (voiceDock.userAutoTimer) {
      clearTimeout(voiceDock.userAutoTimer);
      voiceDock.userAutoTimer = null;
    }
    if (voiceDock.processingTimer) {
      clearTimeout(voiceDock.processingTimer);
      voiceDock.processingTimer = null;
    }
    stopVoiceWaveSim();
  }

  function vdSpeak(text, opts) {
    opts = opts || {};
    if (vdFallbackTimer) {
      clearTimeout(vdFallbackTimer);
      vdFallbackTimer = null;
    }
    if (!vdSynth) {
      if (opts.onStart) opts.onStart();
      const ms = Math.max(1400, text.length * 45);
      vdFallbackTimer = setTimeout(function () {
        vdFallbackTimer = null;
        if (opts.onEnd) opts.onEnd();
      }, ms);
      return;
    }
    vdSynth.cancel();
    vdUtterance = new SpeechSynthesisUtterance(text);
    vdUtterance.lang = "en-GB";
    vdUtterance.rate = 1;
    vdUtterance.pitch = 1;
    vdUtterance.onstart = function () {
      if (opts.onStart) opts.onStart();
    };
    vdUtterance.onend = function () {
      if (opts.onEnd) opts.onEnd();
    };
    vdUtterance.onerror = function (e) {
      if (e.error === "canceled" || e.error === "interrupted") return;
      if (opts.onEnd) opts.onEnd();
    };
    vdSynth.speak(vdUtterance);
  }

  function vdPauseSpeech() {
    if (vdFallbackTimer) return;
    if (vdSynth && vdSynth.speaking && !vdSynth.paused) vdSynth.pause();
  }

  function vdResumeSpeech() {
    if (vdSynth && vdSynth.paused) vdSynth.resume();
  }

  function vdStopSpeech() {
    if (vdSynth) vdSynth.cancel();
    if (vdFallbackTimer) {
      clearTimeout(vdFallbackTimer);
      vdFallbackTimer = null;
    }
  }

  function startVoiceWaveSim() {
    stopVoiceWaveSim();
    const bars = document.querySelectorAll("#voiceDockWaveform .voice-wave-bar");
    if (!bars.length) return;
    let t = 0;
    voiceDock.waveSimTimer = setInterval(function () {
      t += 1;
      const envelope = 0.3 + 0.5 * Math.abs(Math.sin(t / 6)) + Math.random() * 0.15;
      bars.forEach(function (bar) {
        const jitter = 0.3 + Math.random() * 0.7;
        const h = Math.max(0.08, Math.min(1, envelope * jitter));
        bar.style.transform = "scaleY(" + h.toFixed(2) + ")";
      });
    }, 90);
  }

  function stopVoiceWaveSim() {
    if (voiceDock.waveSimTimer) {
      clearInterval(voiceDock.waveSimTimer);
      voiceDock.waveSimTimer = null;
    }
    document.querySelectorAll("#voiceDockWaveform .voice-wave-bar").forEach(function (bar) {
      bar.style.removeProperty("transform");
    });
  }

  function setVoiceDockState(next) {
    voiceDock.state = next;
    voiceDock.paused = false;
    const dock = document.getElementById("voiceDock");
    if (dock) {
      dock.dataset.state = next;
      dock.classList.remove("is-wave-idle", "is-paused");
    }
    const labels = {
      ai_speaking: "AI is speaking",
      listening: "Listening…",
      user_speaking: "Hearing you…",
      processing: "Thinking…",
      ai_responding: "AI is speaking",
    };
    const statusText = document.getElementById("voiceDockStatusText");
    if (statusText) statusText.textContent = labels[next] || "";

    const micBtn = document.getElementById("voiceDockMic");
    if (micBtn) {
      const micLabels = {
        ai_speaking: "Stop speaking",
        ai_responding: "Stop speaking",
        listening: "Start speaking",
        user_speaking: "Done speaking",
        processing: "Start speaking",
      };
      const micLabel = micLabels[next] || "Start speaking";
      micBtn.setAttribute("aria-label", micLabel);
      micBtn.title = micLabel;
    }
  }

  function updateVoiceDockControls(state) {
    const row = document.getElementById("voiceDockControls");
    const cfg = VOICE_DOCK_CONTROLS[state];
    if (!row) return;
    if (!cfg) {
      row.hidden = true;
      return;
    }
    row.hidden = false;
    ["left", "right"].forEach(function (slot) {
      const icon = document.getElementById("voiceDockBtn" + vdCapSlot(slot) + "Icon");
      const label = document.getElementById("voiceDockBtn" + vdCapSlot(slot) + "Label");
      const btn = document.getElementById("voiceDockBtn" + vdCapSlot(slot));
      if (icon) icon.className = "ti " + cfg[slot].icon;
      if (label) label.textContent = cfg[slot].label;
      if (btn) btn.setAttribute("aria-label", cfg[slot].label);
    });
  }

  function voiceDockSetPausedVisual(paused) {
    const icon = document.getElementById("voiceDockBtnLeftIcon");
    const label = document.getElementById("voiceDockBtnLeftLabel");
    if (icon) icon.className = "ti " + (paused ? "ti-player-play" : "ti-player-pause");
    if (label) label.textContent = paused ? "Resume" : "Pause";
    document.getElementById("voiceDock")?.classList.toggle("is-paused", paused);
  }

  function speakIntro() {
    const ctx = VOICE_BRIEF_CONTEXTS[voiceDock.ctxKey];
    if (!ctx) return;
    vdSpeak(ctx.intro, {
      onEnd: function () {
        if (voiceDock.state === "ai_speaking") {
          document.getElementById("voiceDock")?.classList.add("is-wave-idle");
        }
      },
    });
  }

  function voiceDockTogglePause() {
    if (voiceDock.paused) {
      vdResumeSpeech();
      voiceDock.paused = false;
    } else {
      vdPauseSpeech();
      voiceDock.paused = true;
    }
    voiceDockSetPausedVisual(voiceDock.paused);
  }

  function voiceDockInterrupt() {
    vdStopSpeech();
    vdEnterListening();
  }

  function voiceDockReset() {
    vdStopSpeech();
    clearVoiceTimers();
    voiceDock.turnIndex = 0;
    setVoiceDockState("ai_speaking");
    updateVoiceDockControls("ai_speaking");
    speakIntro();
  }

  function vdEnterListening() {
    clearVoiceTimers();
    setVoiceDockState("listening");
    updateVoiceDockControls("listening");
    voiceDock.listeningTimer = setTimeout(function () {
      vdEnterUserSpeaking();
    }, 1800);
  }

  function vdEnterUserSpeaking() {
    clearVoiceTimers();
    setVoiceDockState("user_speaking");
    updateVoiceDockControls("user_speaking");
    startVoiceWaveSim();
    voiceDock.userAutoTimer = setTimeout(function () {
      voiceDockDone();
    }, 4500);
  }

  function voiceDockMicTap() {
    if (voiceDock.state === "ai_speaking" || voiceDock.state === "ai_responding") {
      voiceDockInterrupt();
    } else if (voiceDock.state === "listening") {
      vdEnterUserSpeaking();
    } else if (voiceDock.state === "user_speaking") {
      voiceDockDone();
    }
  }

  function voiceDockToggleCapturePause() {
    if (voiceDock.paused) {
      voiceDock.paused = false;
      startVoiceWaveSim();
      voiceDock.userAutoTimer = setTimeout(function () {
        voiceDockDone();
      }, 3000);
    } else {
      voiceDock.paused = true;
      stopVoiceWaveSim();
      if (voiceDock.userAutoTimer) {
        clearTimeout(voiceDock.userAutoTimer);
        voiceDock.userAutoTimer = null;
      }
    }
    voiceDockSetPausedVisual(voiceDock.paused);
  }

  function voiceDockDone() {
    clearVoiceTimers();
    vdEnterProcessing();
  }

  function voiceDockCancel() {
    clearVoiceTimers();
    vdEnterListening();
  }

  function vdEnterProcessing() {
    setVoiceDockState("processing");
    updateVoiceDockControls("processing");
    const ctx = VOICE_BRIEF_CONTEXTS[voiceDock.ctxKey];
    const turn = ctx && ctx.turns && ctx.turns.length ? ctx.turns[voiceDock.turnIndex % ctx.turns.length] : null;
    voiceDock.pendingTurn = turn;
    voiceDock.processingTimer = setTimeout(function () {
      vdEnterAiResponding();
    }, 1400);
  }

  function vdEnterAiResponding() {
    const turn = voiceDock.pendingTurn;
    voiceDock.turnIndex += 1;
    setVoiceDockState("ai_responding");
    updateVoiceDockControls("ai_responding");
    const text = turn
      ? turn.a
      : "I don't have additional detail on that in this briefing — would you like me to go over the summary again?";
    vdSpeak(text, {
      onEnd: function () {
        if (voiceDock.state === "ai_responding") {
          document.getElementById("voiceDock")?.classList.add("is-wave-idle");
        }
      },
    });
  }

  function voiceDockLeftAction() {
    if (voiceDock.state === "ai_speaking" || voiceDock.state === "ai_responding") {
      voiceDockTogglePause();
    } else if (voiceDock.state === "user_speaking") {
      voiceDockToggleCapturePause();
    }
  }

  function voiceDockRightAction() {
    if (voiceDock.state === "ai_speaking" || voiceDock.state === "ai_responding") {
      voiceDockReset();
    } else if (voiceDock.state === "user_speaking") {
      voiceDockCancel();
    }
  }

  function resolveCardEl(ctx) {
    if (ctx.anchorEl) return ctx.anchorEl;
    if (ctx.cardSelector) return document.querySelector(ctx.cardSelector);
    return null;
  }

  function openVoiceBriefDock(ctxKey) {
    ensureVoiceDockDom();
    const ctx = VOICE_BRIEF_CONTEXTS[ctxKey];
    if (!ctx) return;
    if (voiceDock.state !== "closed" && voiceDock.ctxKey === ctxKey) {
      closeVoiceDock();
      return;
    }
    if (voiceDock.state !== "closed") closeVoiceDock({ silent: true });

    voiceDock.ctxKey = ctxKey;
    voiceDock.turnIndex = 0;
    vdSetCardActive(resolveCardEl(ctx));
    buildVoiceWaveBars();

    const dock = document.getElementById("voiceDock");
    const overlay = document.getElementById("voiceDockOverlay");
    if (overlay) overlay.classList.add("open");
    if (dock) {
      dock.hidden = false;
      requestAnimationFrame(function () {
        dock.classList.add("open");
      });
    }
    document.addEventListener("keydown", vdEscHandler);

    setVoiceDockState("ai_speaking");
    updateVoiceDockControls("ai_speaking");
    speakIntro();
  }

  function closeVoiceDock(opts) {
    const silent = opts && opts.silent;
    vdStopSpeech();
    clearVoiceTimers();
    vdClearCardActive();
    const dock = document.getElementById("voiceDock");
    const overlay = document.getElementById("voiceDockOverlay");
    if (dock) dock.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    setTimeout(function () {
      if (dock && !dock.classList.contains("open")) dock.hidden = true;
    }, 360);
    document.removeEventListener("keydown", vdEscHandler);
    voiceDock.state = "closed";
    voiceDock.ctxKey = null;
    if (!silent) voiceDock.turnIndex = 0;
  }

  function getHeroBriefText(heroEl) {
    const titleEl =
      heroEl.querySelector(".cpi-hero-title") ||
      heroEl.querySelector(".aib-ttl") ||
      heroEl.querySelector(".aiobs-execbrief-title") ||
      heroEl.querySelector("h2");
    const subEl =
      heroEl.querySelector(".cpi-hero-sub") ||
      heroEl.querySelector(".aib-body") ||
      heroEl.querySelector(".aiobs-execbrief-sub") ||
      heroEl.querySelector("p");
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
    const sub = subEl ? subEl.textContent.replace(/\s+/g, " ").trim() : "";
    return { title: title, sub: sub, intro: [title, sub].filter(Boolean).join(". ") };
  }

  function openVoiceBriefDockFromHero(heroEl) {
    if (!heroEl) return false;
    const brief = getHeroBriefText(heroEl);
    if (!brief.intro) return false;

    let key = heroEl.dataset.voiceBriefKey;
    if (!key) {
      key = "aiobs-" + (heroEl.id || Math.random().toString(36).slice(2, 9));
      heroEl.dataset.voiceBriefKey = key;
    }

    registerVoiceBriefContext(key, {
      title: brief.title || "Section brief",
      icon: "ti-sparkles",
      intro: brief.intro,
      turns: [],
      anchorEl: heroEl.closest(".aiobs-panel, .aiobs-execbrief, section") || heroEl,
    });

    openVoiceBriefDock(key);
    return true;
  }

  window.registerVoiceBriefContext = registerVoiceBriefContext;
  window.openVoiceBriefDock = openVoiceBriefDock;
  window.closeVoiceDock = closeVoiceDock;
  window.openVoiceBriefDockFromHero = openVoiceBriefDockFromHero;
  window.voiceDockMicTap = voiceDockMicTap;
  window.voiceDockLeftAction = voiceDockLeftAction;
  window.voiceDockRightAction = voiceDockRightAction;
  window.__voiceBriefDockReady = true;

  document.addEventListener("DOMContentLoaded", ensureVoiceDockDom);
})();
