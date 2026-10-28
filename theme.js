/* BD Premium Property Care: dark / light mode.
   - A visitor's own choice (the toggle) is saved and applies on every page.
   - With no saved choice, daytime = light, night = dark (approximate sunrise/sunset for Cork). */
(function () {
  var d = document.documentElement, K = 'bdTheme';
  function get() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(K, v); } catch (e) {} }
  function isDaytime() {
    var n = new Date(), rad = Math.PI / 180;
    var doy = Math.floor((n - Date.UTC(n.getUTCFullYear(), 0, 0)) / 864e5);
    var g = 2 * Math.PI / 365 * (doy - 1 + (n.getUTCHours() - 12) / 24);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var lat = 51.9 * rad, lng = -8.47;
    var c = Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec);
    if (c > 1) return false; if (c < -1) return true;
    var ha = Math.acos(c) / rad;
    var rise = 720 - 4 * (lng + ha) - eq, set_ = 720 - 4 * (lng - ha) - eq;
    var m = n.getUTCHours() * 60 + n.getUTCMinutes();
    return m >= rise && m < set_;
  }
  function isLight() { return d.getAttribute('data-theme') === 'light'; }
  function sync() {
    var l = isLight(), all = document.querySelectorAll('.bd-theme-toggle');
    for (var n = 0; n < all.length; n++) {
      all[n].setAttribute('aria-checked', String(l));
      all[n].setAttribute('aria-label', l ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }
  var saved = get();
  if (saved === 'light' || (saved !== 'dark' && isDaytime())) d.setAttribute('data-theme', 'light');
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.bd-theme-toggle') : null;
    if (!b) return;
    if (isLight()) { d.removeAttribute('data-theme'); set('dark'); }
    else { d.setAttribute('data-theme', 'light'); set('light'); }
    sync();
  });
  document.addEventListener('DOMContentLoaded', sync);
})();

/* Back-to-top button: appears after scrolling down, scrolls smoothly to the top. */
(function () {
  function init() {
    if (document.getElementById('bd-top')) return;
    var b = document.createElement('button');
    b.id = 'bd-top'; b.type = 'button'; b.setAttribute('aria-label', 'Back to top'); b.title = 'Back to top';
    b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(b);
    function update() { b.classList.toggle('bd-top-show', (window.pageYOffset || document.documentElement.scrollTop) > 400); }
    window.addEventListener('scroll', update, { passive: true });
    b.addEventListener('click', function () {
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    });
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
