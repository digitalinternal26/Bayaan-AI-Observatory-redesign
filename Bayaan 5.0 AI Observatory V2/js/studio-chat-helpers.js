/**
 * Shared studio chat helpers — matches index.html dashboard / KPI builder chat.
 */
(function (global) {
  var scriptEl = document.currentScript;
  var BAI_AVATAR_SRC = scriptEl
    ? new URL("../assets/ai-chat-thumb.svg", scriptEl.src).href
    : "./assets/ai-chat-thumb.svg";

  function baiAvatarEl(className = "msg-av ai", size = 28) {
    const img = document.createElement("img");
    img.className = className;
    img.src = BAI_AVATAR_SRC;
    img.alt = "Bayaan AI";
    img.width = size;
    img.height = size;
    return img;
  }

  function baiAvatarHtml(className = "msg-av ai", size = 28) {
    return `<img class="${className}" src="${BAI_AVATAR_SRC}" alt="Bayaan AI" width="${size}" height="${size}" />`;
  }

  function mkAiWrap() {
    const el = document.createElement("div");
    el.className = "msg ai";
    const body = document.createElement("div");
    body.className = "msg-body";
    return { el, av: baiAvatarEl(), body };
  }

  function normalizeBubbleHtml(html) {
    return (html || "").replace(/\bmsg-bubble\b/g, "bubble");
  }

  function appendUserMsg(container, text) {
    const wrap = document.createElement("div");
    wrap.className = "msg user";
    const body = document.createElement("div");
    body.className = "msg-body";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    body.appendChild(bubble);
    wrap.appendChild(body);
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
  }

  function appendAiMsg(container, html) {
    const { el, av, body } = mkAiWrap();
    body.innerHTML = normalizeBubbleHtml(html);
    el.appendChild(av);
    el.appendChild(body);
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    return el;
  }

  function showTypingIndicator(container, cb, delay) {
    const el = document.createElement("div");
    el.className = "msg ai";
    el.innerHTML = `${baiAvatarHtml()}<div class="typing-wrap"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    setTimeout(
      () => {
        el.remove();
        cb();
      },
      delay ?? 700 + Math.random() * 400,
    );
  }

  global.StudioChat = {
    BAI_AVATAR_SRC,
    baiAvatarEl,
    baiAvatarHtml,
    mkAiWrap,
    normalizeBubbleHtml,
    appendUserMsg,
    appendAiMsg,
    showTypingIndicator,
  };
})(typeof window !== "undefined" ? window : globalThis);
