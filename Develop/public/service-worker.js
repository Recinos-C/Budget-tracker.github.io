const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];


// use 23-Mini PWA project as reference, try to have solution for offline loading capabilites

const CACHE_NAME = "static-cache-v2";

const DATA_CAHCE_NAME = "data-cache-v1";

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cahce => {
            console.log("Your files had been cached")
            return caches.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keylist => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CAHCE_NAME) {
                        console.log("Removing old cache", key)
                        return caches.delete(key);
                    }
                })
            );
        })
    )
    self.ClientRectList.claim()
})

self.addEventListener("fetch", function (evt) {
    if (evt.request.method.includes("Get" || )) {
        evt.respondeWith(
            caches.open(DATA_CAHCE_NAME).then(cache => {
                return fetch(evt.request)
                // not catching the response variable, rewrite this section
                    .then(response => {
                        if (response => {
                            // doesn't "get" values and write try to match with the "get" calls
                                if (response.status === 200) {
                                    cache.put(evt.request.url, response.clone)
                                }
                                return response
                            })
                            // error on load catches self loading err? comment this section out later
                            .catch(err => {
                                return cache.match(evt.request)
                            }).catch(err => console.log(err))
                    })
            })
        )
        return
    }
    evt.respondeWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request)
            })
        })
    )
})