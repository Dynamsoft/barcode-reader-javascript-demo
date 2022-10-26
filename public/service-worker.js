// Files to cache
const cacheKey = 'dbrjs-demo-' + Date.now().toString().substring(7);
const appShellFiles = [
  'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr.js',
  'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr-9.3.1.full.wasm',
  'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr-9.3.1.full.wasm.js',
  'https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr-9.3.1.browser.worker.js',
  'https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/dcp.js',
  'https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/dcp-1.1.0.wasm',
  'https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/dcp-1.1.0.wasm.js',
  'https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/dcp-1.1.0.browser.worker.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheKey).then(function(cache) {
      return cache.addAll(appShellFiles)
    }).then(function() {
      return self.skipWaiting();
    })
  )
})

self.addEventListener('activate', function(e) {
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(name => {
      if (name !== cacheKey) {
        var deletePromise = caches.delete(name);
        return deletePromise;
      } else {
        return Promise.resolve();
      }
    }));
  });

  e.waitUntil(
    Promise.all([cacheDeletePromises]).then(() => {
      return self.clients.claim();
    })
  )
})

/* self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      console.log(e.request);
      if (response) {
        return response
      }
      return fetch(e.request.url);
    })
  )
}) */