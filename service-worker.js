
const STATIC_CACHE_NAME = 'traffic-analyzer-static-v2';
const DYNAMIC_CACHE_NAME = 'traffic-analyzer-dynamic-v2';

// Ресурсы, которые необходимо кэшировать при установке
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/icon-192.svg',
  '/icon-512.svg',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0',
  'https://aistudiocdn.com/@google/genai@^1.27.0'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если ресурс найден в кэше, возвращаем его
        if (response) {
          return response;
        }

        // В противном случае, делаем запрос к сети
        return fetch(event.request).then(
          networkResponse => {
            // Если запрос успешен, кэшируем его и возвращаем
            // Это полезно для динамических ресурсов, которые не были в первоначальном списке
            return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              // Не кэшируем запросы к Gemini API, так как они всегда должны быть свежими
              if (!event.request.url.includes('generativelanguage')) {
                 cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          }
        ).catch(error => {
            console.log('Service Worker: Fetch failed; returning offline page instead.', error);
            // Можно вернуть запасную оффлайн-страницу, если нужно
            // return caches.match('/offline.html');
        });
      }
    )
  );
});
