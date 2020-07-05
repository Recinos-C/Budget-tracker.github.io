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
    if (evt.request.method.includes("/api/")) {
        evt.respondeWith(
            caches.open(DATA_CAHCE_NAME).then(cache => {
                return fetch(evt.request)
        //   fixed error, extra "({})" was found causing bug
                    .then(response => {
            
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {

                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }

    // evt not responding, try matching, use includes to make sure your 
    // evts are catching requests being made and docked
    // make sure caches match, use activity guideline to doc
    evt.respondeWith(
     fetch(evt.request).catch(()=>{
         return caches.match(evt.request).then((response)=>{
            if (response){
                return response;
                // checks to use chached items to render "use accept" 
            }else if (evt.request.headers.get("accept").includes("text/html")){
                //  should render the html for items
                // when using indexdb for offline make sure req matches the stored items
                // if not produce and err on fail from the indexdb or db.js
                return caches.match("/")
            }
         })
     })
    )
})