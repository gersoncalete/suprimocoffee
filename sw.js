// Suprimo Coffee - Service Worker for PWA capabilities
// This provides basic caching and offline functionality

const CACHE_NAME = 'suprimo-coffee-v1';
const STATIC_CACHE = 'suprimo-static-v1';
const DYNAMIC_CACHE = 'suprimo-dynamic-v1';

// Resources to cache on install
const STATIC_ASSETS = [
    '/',
    '/index-production.html',
    '/store-production.html',
    '/styles-optimized.css',
    '/store-styles.css',
    '/design-tokens.css',
    // Add your images here
    '/reference images/The-Goat-1.jpeg',
    '/reference images/majestic-1.jpeg',
    '/reference images/goat-250.jpeg',
    '/reference images/MAGESTIC-250.jpeg',
    // Fonts will be cached dynamically
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('Service Worker: Error caching static assets', error);
            })
    );
    
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Claim all clients
    self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-HTTP requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }
                
                // Fetch from network and cache the response
                return fetch(event.request)
                    .then(fetchResponse => {
                        // Check if response is valid
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        
                        // Clone the response as it can only be used once
                        const responseToCache = fetchResponse.clone();
                        
                        // Cache the fetched response
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                // Only cache same-origin requests and specific external resources
                                if (event.request.url.startsWith(self.location.origin) || 
                                    event.request.url.includes('fonts.googleapis.com') ||
                                    event.request.url.includes('fonts.gstatic.com')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                        
                        return fetchResponse;
                    })
                    .catch(error => {
                        console.log('Service Worker: Network request failed', event.request.url, error);
                        
                        // Return offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index-production.html');
                        }
                        
                        // Return empty response for other requests
                        return new Response('', { status: 200 });
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'cart-sync') {
        console.log('Service Worker: Syncing cart data');
        event.waitUntil(syncCartData());
    }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: data.url
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// Helper function to sync cart data (for future implementation)
async function syncCartData() {
    try {
        // This would sync offline cart actions when back online
        // Implementation depends on your backend API
        console.log('Service Worker: Cart sync would happen here');
    } catch (error) {
        console.error('Service Worker: Cart sync failed', error);
    }
}

// Helper function to handle cache size limits
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        // Delete oldest items
        await cache.delete(keys[0]);
        await limitCacheSize(cacheName, maxItems);
    }
}

// Clean up dynamic cache periodically
setInterval(() => {
    limitCacheSize(DYNAMIC_CACHE, 50);
}, 60000); // Every minute