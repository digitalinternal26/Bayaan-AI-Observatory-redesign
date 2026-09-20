/**
 * Bayaan app footer — markup: components/bayaan-products-footer.html
 * Styles: css/components/bayaan-footer.css
 */
(function () {
  const FOOTER_URL = "components/bayaan-products-footer.html";
  const FOOTER_FALLBACK = `<footer class="bayaan-products-footer" role="contentinfo">
  <div class="bayaan-products-footer__inner">
    <div class="bayaan-products-footer__grid">
      <div class="bayaan-products-footer__brand">
        <img
          class="bayaan-products-footer__brand-logo bayaan-products-footer__brand-logo--light"
          src="assets/bayaan-logo.svg"
          alt="Bayaan"
          width="119"
          height="45"
        />
        <img
          class="bayaan-products-footer__brand-logo bayaan-products-footer__brand-logo--dark"
          src="assets/bayaan-logo-white.svg"
          alt="Bayaan"
          width="119"
          height="45"
        />
      </div>

      <div class="bayaan-products-footer__col">
        <h2 class="bayaan-products-footer__col-title">Bayaan</h2>
        <ul class="bayaan-products-footer__links">
          <li><a href="#">Glossary</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </div>

      <div class="bayaan-products-footer__col">
        <h2 class="bayaan-products-footer__col-title">Support</h2>
        <ul class="bayaan-products-footer__links">
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Support</a></li>
          <li><a href="#">Guides</a></li>
        </ul>
      </div>

      <div class="bayaan-products-footer__col">
        <h2 class="bayaan-products-footer__col-title">Location</h2>
        <div class="bayaan-products-footer__location">
          <p>
            Headquarter - DGE, Twofour 54<br />
            Building, Building 6 - Abu Dhabi
          </p>
        </div>
      </div>

      <div class="bayaan-products-footer__col">
        <h2 class="bayaan-products-footer__col-title">Contact</h2>
        <div class="bayaan-products-footer__location">
          <p class="bayaan-products-footer__location-item">
            <img class="bayaan-products-footer__location-icon" src="images/e-mail-icon-filled.svg" alt="" width="13" height="9" />
            <a href="mailto:info@scad.gov.ae">Info@scad.gov.ae</a>
          </p>
          <p class="bayaan-products-footer__location-item">
            <img class="bayaan-products-footer__location-icon" src="images/phone-icon-filled.svg" alt="" width="10" height="10" />
            <a href="tel:800555">800 555</a>
          </p>
          <p class="bayaan-products-footer__location-item">
            <img class="bayaan-products-footer__location-icon" src="images/post-icon-filled.svg" alt="" width="17" height="9" />
            <span>PO. Box 6036</span>
          </p>
        </div>
      </div>

      <div class="bayaan-products-footer__partners" aria-label="Partner organisations">
        <img
          class="bayaan-products-footer__partner-logo bayaan-products-footer__partner-logo--scad"
          src="images/scad-center-logo.svg"
          alt="Statistics Centre Abu Dhabi"
          width="150"
          height="65"
        />
      </div>
    </div>

    <div class="bayaan-products-footer__bar">
      <p class="bayaan-products-footer__copy">
        Copyright &copy; 2026 Statistics Center Abu Dhabi. All Rights Reserved.
      </p>
      <ul class="bayaan-products-footer__legal">
        <li><a href="#">Raise a Complaint</a></li>
        <li><a href="#">Terms and conditions</a></li>
        <li><a href="#">User Agreement</a></li>
        <li><a href="#">Privacy policy</a></li>
      </ul>
    </div>
  </div>
</footer>`;

  let cachedMarkup = null;

  function assetBase() {
    const configured = document.documentElement.dataset.bayaanAssetBase;
    if (configured) return configured.endsWith("/") ? configured : configured + "/";
    return /\/lmo\//.test(location.pathname) ? "../" : "";
  }

  function withAssetBase(html) {
    const base = assetBase();
    return base ? html.replace(/src="(images|assets)\//g, 'src="' + base + '$1/') : html;
  }

  async function loadMarkup() {
    if (cachedMarkup) return cachedMarkup;

    const tpl = document.getElementById("bayaan-footer-tpl");
    if (tpl) {
      cachedMarkup = withAssetBase(tpl.innerHTML.trim());
      return cachedMarkup;
    }

    const base = assetBase();
    if (location.protocol !== "file:") {
      try {
        const res = await fetch(base + FOOTER_URL, { cache: "no-cache" });
        if (res.ok) {
          cachedMarkup = withAssetBase(await res.text());
          return cachedMarkup;
        }
      } catch (_) {}
    }

    cachedMarkup = withAssetBase(FOOTER_FALLBACK);
    return cachedMarkup;
  }

  async function initBayaanFooter() {
    const mounts = document.querySelectorAll("[data-bayaan-footer]:not([data-footer-loaded])");
    if (!mounts.length) return;

    const markup = await loadMarkup();
    mounts.forEach(function (mount) {
      const wrap = document.createElement("div");
      wrap.innerHTML = markup;
      const footer = wrap.querySelector("footer") || wrap.firstElementChild;
      if (!footer) return;
      footer.dataset.footerLoaded = "1";
      mount.replaceWith(footer);
    });
  }

  window.initBayaanFooter = initBayaanFooter;
})();
