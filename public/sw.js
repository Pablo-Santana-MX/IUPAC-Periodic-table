/**
 * Tabla Periódica Actualizada - Service Worker Oficial (v2.0.0)
 * Estrategia de Caché de Producción:
 * - Pre-cacheo de recursos críticos (index.html, style.css, app.js, manifest.json, iconos)
 * - Navegación: Network-First con fallback a Caché para funcionamiento 100% offline
 * - Recursos estáticos y librerías CDN: Stale-While-Revalidate / Cache-First
 */

const CACHE_NAME = 'tabla-periodica-actualizada-v7';

// Recursos esenciales para disponibilidad offline inmediata
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// CDNs externos que también se almacenan en caché dinámico
const CACHEABLE_DOMAINS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.tailwindcss.com'
];

// Evento de Instalación: Pre-cacheo de archivos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-cacheando recursos para Tabla Periódica Actualizada...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Advertencia al pre-cachear:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Evento de Activación: Limpieza de versiones obsoletas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento de Intercepción de Peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar peticiones que no sean GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Navegación HTML: Network-First con fallback a Caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match('./index.html').then((cached) => {
            return cached || caches.match(request);
          });
        })
    );
    return;
  }

  // 2. CDNs y fuentes externas: Stale-While-Revalidate
  const isCdn = CACHEABLE_DOMAINS.some((domain) => url.hostname.includes(domain));
  if (isCdn) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Recursos locales: Cache-First con fallback a Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
