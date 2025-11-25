// ignore this part when uploading to github(the whole file)
const dbrVersion = "11.2.4000";
const dbrCdn = `https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader@${dbrVersion}/dist/`;

const dbrFilesShouldCache = [
  `${dbrCdn}dbr.bundle.worker.js`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle-ml-simd.js`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle-ml-simd.wasm`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle.js`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle.wasm`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle-ml-simd-pthread.js`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle-ml-simd-pthread.wasm`,
  `${dbrCdn}dynamsoft-barcode-reader-bundle-ml-simd-pthread.worker.js`,
  `${dbrCdn}models/OneDDeblur.data`,
  `${dbrCdn}models/OneDLocalization.data`,
  `${dbrCdn}models/DataMatrixQRCodeLocalization.data`,
  `${dbrCdn}models/Code128Decoder.data`,
  `${dbrCdn}models/EAN13Decoder.data`,
  `${dbrCdn}parser-resources/AAMVA_DL_ID_WITH_MAG_STRIPE.dcpres`,
  `${dbrCdn}parser-resources/AAMVA_DL_ID.dcpres`,
  `${dbrCdn}parser-resources/AAMVA_Map.txt`,
  `${dbrCdn}parser-resources/GS1_AI_Map.txt`,
  `${dbrCdn}parser-resources/GS1_AI.txt`,
  `${dbrCdn}parser-resources/MRTD_Map.txt`,
  `${dbrCdn}parser-resources/MRTD_TD1_ID.dcpres`,
  `${dbrCdn}parser-resources/MRTD_TD2_FRENCH_ID.dcpres`,
  `${dbrCdn}parser-resources/MRTD_TD2_ID.dcpres`,
  `${dbrCdn}parser-resources/MRTD_TD2_VISA.dcpres`,
  `${dbrCdn}parser-resources/MRTD_TD3_PASSPORT.dcpres`,
  `${dbrCdn}parser-resources/MRTD_TD3_VISA.dcpres`,
  `${dbrCdn}parser-resources/SOUTH_AFRICA_DL_Map.txt`,
  `${dbrCdn}parser-resources/SOUTH_AFRICA_DL.dcpres`,
  `${dbrCdn}parser-resources/VIN_Map.txt`,
  `${dbrCdn}parser-resources/VIN.dcpres`,
  `${dbrCdn}templates/DBR-PresetTemplates.json`,
  `${dbrCdn}ui/barcode-scanner.ui.xml`,
  `${dbrCdn}ui/dce.ui.xml`,
  `${dbrCdn}ui/dls.license.dialog.html`,
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", async (e) => {
  await self.clients.claim();

  const keys = await caches.keys();
  for (let key of keys) {
    if (key !== dbrCdn) {
      caches.delete(key);
    }
  }
});

// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#service_worker_navigation_preload
self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  ev.respondWith(
    (async () => {
      let bInCacheList = false;
      let storeName = null;
      if (dbrFilesShouldCache.includes(req.url)) {
        bInCacheList = true;
        storeName = dbrCdn;
      }

      if (bInCacheList) {
        const responseFromCache = await caches.match(req);
        if (responseFromCache) {
          return responseFromCache;
        }

        const responseFromNetwork = await fetch(req);
        (await caches.open(storeName)).put(req, responseFromNetwork.clone());

        return responseFromNetwork;
      } else {
        // not in cache list
        return fetch(req);
      }
    })()
  );
});
