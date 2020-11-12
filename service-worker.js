/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/favicon.png",
    "revision": "3b3109c37fe1d23e07ae2890862c621a"
  },
  {
    "url": "images/icon-144.png",
    "revision": "8caa72b941fc97f1b636e88379fe329d"
  },
  {
    "url": "images/icon-192.png",
    "revision": "903a848f8ebb57f07e2cf1c21425502a"
  },
  {
    "url": "images/icon-256.png",
    "revision": "28cc3710c2381963648a7435bca9713d"
  },
  {
    "url": "images/icon-512.png",
    "revision": "1490c3b55af9253baba49eb5b821bae9"
  },
  {
    "url": "images/icon-72.png",
    "revision": "0cf5e2bfc187c54a6f40d62acdb04767"
  },
  {
    "url": "images/icon-96.png",
    "revision": "bf085eef60f602eca7790cdfe8a726c0"
  },
  {
    "url": "index.html",
    "revision": "a2da71683b66e9c10fc06e3553a0314c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.CacheFirst({ "cacheName":"googleapis", plugins: [new workbox.expiration.Plugin({ maxEntries: 30, purgeOnQuotaError: false })] }), 'GET');

workbox.googleAnalytics.initialize({});
