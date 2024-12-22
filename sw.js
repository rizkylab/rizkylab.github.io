const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "blog.rizkylab.com", // Menambahkan domain blog Anda sendiri
  "cdnjs.cloudflare.com", // Untuk CDN jika digunakan
  "fonts.googleapis.com", // Google Fonts
  "fonts.gstatic.com", // Google Fonts Assets
  "pagead2.googlesyndication.com", // Untuk iklan Google Ads jika digunakan
  "www.googletagmanager.com" // Untuk Google Tag Manager
];

// Event 'install' untuk meng-cache file statis
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing Service Worker...');
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      return cache.addAll([
        '/', // Cache halaman utama
        '/index.html'
      ]);
    })
  );
});

// Event 'fetch' untuk menangani permintaan jaringan
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (HOSTNAME_WHITELIST.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('dynamic-v1').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Fallback jika offline
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html'); // Cache halaman offline
        }
      })
    );
  }
});

// Event 'activate' untuk membersihkan cache lama
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating Service Worker...');
  const cacheWhitelist = ['static-v1', 'dynamic-v1'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
