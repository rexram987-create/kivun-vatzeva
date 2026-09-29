const C='kivun-vatzeva-v3';
const A=['./','index.html','style.css','app.js','manifest.json','icon.svg','icon-192.png','icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(C).then(cache=>cache.addAll(A)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==C).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(C).then(cache=>cache.put(event.request,copy));
          return response;
        })
        .catch(()=>caches.match(event.request).then(r=>r||caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network=fetch(event.request).then(response=>{
        if(event.request.method==='GET'&&response.ok){
          const copy=response.clone();
          caches.open(C).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});