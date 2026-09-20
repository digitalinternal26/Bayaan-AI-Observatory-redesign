/* ============================================================
   CENSUS OBSERVATORY — EXECUTIVE BRIEF (shared init)
   Generic version of CensusObservatory.html's initCensusBriefSpeech(),
   scoped by element instead of hardcoded ids so the same function drives
   the Executive Brief on every Census page that has one (Interpret today;
   Population/Labour Force/Real Estate via this file). Pass the .cpi-hero
   element itself — everything else is found by class within it, so
   multiple briefs on one page never collide.
   ============================================================ */
function initCensusExecBrief(heroEl) {
  if (!heroEl) return;
  const button = heroEl.querySelector(".brief-listen");
  const controls = heroEl.querySelector(".brief-speech");
  const restartButton = heroEl.querySelector(".brief-audio-action--restart");
  const stopButton = heroEl.querySelector(".brief-audio-action--stop");
  const status = heroEl.querySelector(".brief-speech-status");
  const copyButton = heroEl.querySelector(".brief-copy-action");

  if (copyButton) {
    copyButton.addEventListener("click", () => {
      const sub = heroEl.querySelector(".cpi-hero-sub");
      const text = sub ? sub.textContent.trim() : "";
      navigator.clipboard?.writeText(text).then(
        () => window.censusComingSoon && censusComingSoon("Summary copied"),
        () => window.censusComingSoon && censusComingSoon("Copy")
      );
    });
  }

  if (!button || !controls) return;
  const label = button.querySelector(".brief-listen__text");
  if (!("speechSynthesis" in window)) {
    controls.hidden = true;
    return;
  }
  const synth = window.speechSynthesis;
  let utterance = null;
  let state = "idle";

  const setState = (next) => {
    state = next;
    button.dataset.state = next;
    controls.classList.toggle("is-active", next !== "idle");
    button.setAttribute("aria-pressed", String(next === "speaking"));
    button.setAttribute(
      "aria-label",
      next === "speaking" ? "Pause brief" : next === "paused" ? "Resume brief" : "Listen to the brief"
    );
    if (label) {
      label.textContent = next === "speaking" ? "Pause" : next === "paused" ? "Resume" : "Audio brief";
    }
    if (status) {
      status.textContent =
        next === "speaking" ? "Brief is playing" : next === "paused" ? "Brief paused" : "Brief stopped";
    }
  };

  const getBriefText = () => {
    // .cpi-hero-* for the Executive Brief; .aib-ttl/.aib-body for the plain
    // Overview card (census-interpret) that reuses this same control.
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
    const title = titleEl ? titleEl.textContent : "";
    const sub = subEl ? subEl.textContent : "";
    return `${title.trim()}. ${sub.trim()}`;
  };

  const start = () => {
    synth.cancel();
    utterance = new SpeechSynthesisUtterance(getBriefText());
    utterance.lang = "en-GB";
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onstart = () => setState("speaking");
    utterance.onend = () => setState("idle");
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted" && status) {
        status.textContent = "Unable to play the brief";
      }
      setState("idle");
    };
    synth.speak(utterance);
  };

  button.addEventListener("click", () => {
    if (typeof window.openVoiceBriefDockFromHero === "function" && window.openVoiceBriefDockFromHero(heroEl)) {
      return;
    }
    if (state === "speaking") {
      synth.pause();
      setState("paused");
    } else if (state === "paused") {
      synth.resume();
      setState("speaking");
    } else {
      start();
    }
  });

  if (restartButton) restartButton.addEventListener("click", start);
  if (stopButton) {
    stopButton.addEventListener("click", () => {
      synth.cancel();
      setState("idle");
    });
  }
  window.addEventListener("beforeunload", () => synth.cancel());
}
window.initCensusExecBrief = initCensusExecBrief;
