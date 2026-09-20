/* ============================================================
   CENSUS AI PANEL — shared right-side drawer for every Census
   Observatory page. Ported verbatim from CensusObservatory.html's
   inline version so the "Census AI" sidebar item opens the same
   canned-reply assistant on Interpret / Population / Labour Force /
   Real Estate / Observe / Benchmark / Forecast.

   A page opts in by (1) loading this script and (2) pointing its
   "Census AI" sidebar button at onclick="openObsSidebarAI(this)".
   The panel markup is injected into .obs-ai-split at load if the
   page doesn't already carry its own #bayaan-ai-panel (so
   CensusObservatory.html, which does, is left untouched).
   ============================================================ */
(function () {
  "use strict";

  var PANEL_HTML =
    '<aside id="bayaan-ai-panel" class="ai-panel" role="complementary" aria-label="Bayaan AI Panel">' +
      '<div class="bai-header">' +
        '<div class="bai-header-left">' +
          '<img class="bai-icon-wrap" src="assets/ai-chat-thumb.svg" alt="Bayaan AI" width="38" height="38" />' +
          '<div><div class="bai-header-title">Bayaan AI</div></div>' +
        '</div>' +
        '<div class="bai-header-right">' +
          '<button class="bai-close-btn" type="button" onclick="closeBayaanAIPanel()" title="Close AI Panel"><i class="ti ti-x"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="bai-context-strip">' +
        '<span class="bai-ctx-label">Analysing</span>' +
        '<span class="bai-ctx-pill" id="bai-context-pill"><i class="ti ti-sparkles"></i><span id="bai-context-name">Census Observatory</span></span>' +
        '<span class="bai-ctx-dot"></span>' +
        '<span class="bai-ctx-dot-label">Generating</span>' +
      '</div>' +
      '<div class="bai-messages" id="bai-messages-container"></div>' +
      '<div class="bai-input-area">' +
        '<div class="bai-input-row">' +
          '<textarea class="bai-input" id="bai-user-input" placeholder="Ask about Census data…" rows="2" onkeydown="baiHandleKeydown(event)"></textarea>' +
          '<button class="bai-send-btn" type="button" onclick="baiSendFollowup()" title="Send"><i class="ti ti-send"></i></button>' +
        '</div>' +
      '</div>' +
    '</aside>';

  /* style.css renders #bayaan-ai-panel as an in-flow split column for
     #screen-cpi-obs, which stretches to the full scroll height and pushes
     the composer well below the fold. Every Census page wants the same
     floating drawer CensusObservatory.html uses: fixed under the 67px
     topnav with its own viewport-height box. Colours/width stay with the
     shared rules — only the geometry changes. */
  function injectStyle() {
    if (document.getElementById("census-ai-panel-style")) return;
    var css =
      "#screen-cpi-obs .obs-ai-split > #bayaan-ai-panel{" +
      "position:fixed;top:67px;right:0;height:calc(100vh - 67px);align-self:auto;z-index:200;}";
    var s = document.createElement("style");
    s.id = "census-ai-panel-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function mountPanel() {
    if (document.getElementById("bayaan-ai-panel")) return;
    var split = document.querySelector("#screen-cpi-obs .obs-ai-split");
    if (!split) return;
    split.insertAdjacentHTML("beforeend", PANEL_HTML);
    /* Reflect the current page in the "Analysing" pill — use the title's
       own text node so an inline "AI" pill inside the <h1> isn't swept in. */
    var nameEl = document.getElementById("bai-context-name");
    var title = document.querySelector("#screen-cpi-obs .topic-title");
    if (nameEl && title) {
      var t =
        (title.childNodes[0] && title.childNodes[0].nodeValue
          ? title.childNodes[0].nodeValue
          : title.textContent
        ).trim();
      if (t) nameEl.textContent = /^census/i.test(t) ? t : "Census · " + t;
    }
  }

  var censusAiHistory = [];

  window.openObsSidebarAI = function openObsSidebarAI(/* el */) {
    /* Census AI is an overlay trigger, not a nav destination — leave the
       other sidebar items' active/current-page state untouched. */
    mountPanel();
    var panel = document.getElementById("bayaan-ai-panel");
    var container = document.getElementById("bai-messages-container");
    if (!panel || !container) return;

    censusAiHistory = [];
    container.innerHTML = "";
    panel.classList.add("open");

    var typingEl = censusAiTypingIndicator();
    container.appendChild(typingEl);
    censusAiScrollToBottom();

    setTimeout(function () {
      typingEl.remove();
      censusAiAppendReply(
        "Abu Dhabi's 2025 Census shows population at 3.79M (+3.4% YoY), with continued Emirati/non-Emirati composition shifts and a rising median age. Ask me about specific emirates, nationality mix, age structure, or what's changed since the last release.",
        ["What changed this quarter?", "Break down by nationality", "Compare to GCC peers"]
      );
    }, 1000);
  };

  window.closeBayaanAIPanel = function closeBayaanAIPanel() {
    var panel = document.getElementById("bayaan-ai-panel");
    if (panel) panel.classList.remove("open");
  };

  window.baiHandleKeydown = function baiHandleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      baiSendFollowup();
    }
  };

  window.baiSendFollowup = function baiSendFollowup() {
    var inp = document.getElementById("bai-user-input");
    if (!inp) return;
    var text = inp.value.trim();
    if (!text) return;
    inp.value = "";
    censusAiAppendUserMessage(text);
    censusAiGenerateReply(text);
  };

  function censusAiAppendUserMessage(text) {
    var container = document.getElementById("bai-messages-container");
    if (!container) return;
    var el = document.createElement("div");
    el.className = "bai-msg";
    el.innerHTML =
      '<div style="display:flex;justify-content:flex-end">' +
        '<div style="max-width:82%;background:#EFF6FF;border:1px solid #DBEAFE;border-radius:10px 10px 2px 10px;padding:10px 14px;font-size:13px;color:#0F172A;line-height:1.55;">' +
          censusAiEscapeHTML(text) +
        "</div>" +
      "</div>";
    container.appendChild(el);
    censusAiScrollToBottom();
    censusAiHistory.push({ role: "user", text: text });
  }

  function censusAiGenerateReply(question) {
    var container = document.getElementById("bai-messages-container");
    if (!container) return;
    var typingEl = censusAiTypingIndicator();
    container.appendChild(typingEl);
    censusAiScrollToBottom();

    setTimeout(function () {
      typingEl.remove();
      var q = question.toLowerCase();
      var text, followups;
      if (q.indexOf("nationality") > -1 || q.indexOf("emirati") > -1 || q.indexOf("breakdown") > -1) {
        text = "Emiratis make up 19.1% of Abu Dhabi's population, with the remaining 80.9% non-Emirati — led by South Asian (41%) and other Arab (18%) nationality groups. The Emirati share has held broadly flat over the last three census cycles.";
        followups = ["Show age structure by nationality", "Which emirate has the highest Emirati share?", "How has this changed since 2011?"];
      } else if (q.indexOf("gcc") > -1 || q.indexOf("compare") > -1 || q.indexOf("peer") > -1) {
        text = "Against GCC peers, Abu Dhabi's population growth rate (+3.4% YoY) tracks close to Dubai's but ahead of Riyadh and Doha on the latest available comparable releases. Non-national share remains among the highest in the region, consistent with the broader GCC labour-migration pattern.";
        followups = ["View GCC comparison chart", "What drives Dubai's growth?", "Show historical trend"];
      } else if (q.indexOf("age") > -1 || q.indexOf("median") > -1) {
        text = "The median age in Abu Dhabi has risen to 32.4 years, up from 31.6 in the prior release, reflecting a maturing non-Emirati resident base alongside a still-young Emirati population pyramid.";
        followups = ["Compare Emirati vs non-Emirati age pyramid", "What's the youth dependency ratio?", "Show working-age population share"];
      } else if (q.indexOf("change") > -1 || q.indexOf("quarter") > -1 || q.indexOf("latest") > -1) {
        text = "Since the last release, total population grew +3.4% YoY to 3.79M, median age ticked up to 32.4 years, and Abu Dhabi City retained its position as the largest population centre. Al Dhafra recorded the fastest relative growth among the three regions.";
        followups = ["Break down by nationality", "Which region grew fastest?", "What should policymakers watch?"];
      } else {
        text =
          'Bayaan AI is cross-referencing your question — <em>"' +
          censusAiEscapeHTML(question) +
          '"</em> — against the 2025 Census dataset. This indicator warrants continued monitoring; would you like a structured summary or a comparison against related metrics?';
        followups = ["Generate summary report", "Compare related metrics", "Break down by nationality"];
      }
      censusAiAppendReply(text, followups);
    }, 900 + Math.random() * 500);
  }

  function censusAiAppendReply(text, followups) {
    var container = document.getElementById("bai-messages-container");
    if (!container) return;
    var el = document.createElement("div");
    el.className = "bai-msg bai-msg-ai";
    var followupHTML =
      followups && followups.length
        ? '<div class="bai-followup-section" style="margin-top:10px">' +
          '<div class="bai-followup-label">Ask a follow-up</div>' +
          '<div class="bai-chips-wrap">' +
          followups
            .map(function (f) {
              return (
                '<button class="bai-followup-chip" onclick="censusAiHandleChip(this)"><i class="ti ti-arrow-narrow-right"></i>' +
                f +
                "</button>"
              );
            })
            .join("") +
          "</div></div>"
        : "";
    el.innerHTML =
      '<div class="bai-role-row">' +
        '<img class="bai-ai-avatar" src="assets/ai-chat-thumb.svg" alt="Bayaan AI" width="24" height="24" />' +
        '<span class="bai-role-name">Bayaan AI</span>' +
        '<span class="bai-role-time">' +
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
        "</span>" +
      "</div>" +
      '<p class="bai-msg-text">' + text + "</p>" +
      followupHTML;
    container.appendChild(el);
    censusAiScrollToBottom();
    censusAiHistory.push({ role: "assistant", text: text });
  }

  window.censusAiHandleChip = function censusAiHandleChip(btn) {
    var question = btn.textContent.trim();
    var section = btn.closest(".bai-followup-section");
    if (section) section.remove();
    censusAiAppendUserMessage(question);
    censusAiGenerateReply(question);
  };

  function censusAiTypingIndicator() {
    var el = document.createElement("div");
    el.className = "bai-msg bai-msg-ai";
    el.innerHTML =
      '<div class="bai-role-row">' +
        '<img class="bai-ai-avatar" src="assets/ai-chat-thumb.svg" alt="Bayaan AI" width="24" height="24" />' +
        '<span class="bai-role-name">Bayaan AI</span>' +
      "</div>" +
      '<div class="bai-typing">' +
        '<div class="bai-typing-dot"></div>' +
        '<div class="bai-typing-dot"></div>' +
        '<div class="bai-typing-dot"></div>' +
      "</div>";
    return el;
  }

  function censusAiScrollToBottom() {
    var c = document.getElementById("bai-messages-container");
    if (c) c.scrollTop = c.scrollHeight;
  }

  function censusAiEscapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function init() {
    injectStyle();
    mountPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
