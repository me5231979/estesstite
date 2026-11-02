/* Google Analytics 4 (gtag.js).
 *
 * Paste the Measurement ID from GA (Admin > Data streams > your web stream)
 * into MEASUREMENT_ID below. While it is the placeholder, this file does nothing.
 *
 * Kept as an external file so the pages' Content-Security-Policy needs no
 * inline-script hash. Privacy defaults: Google signals and ad personalization
 * are off, and nothing loads on local previews, ?review links, or for visitors
 * whose browser sends Global Privacy Control or Do Not Track.
 */
(function () {
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';

  if (!/^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID) || MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '' || /\.local$/.test(host)) return;
  if (/[?&]review\b/.test(location.search)) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('set', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  gtag('config', MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);
})();
