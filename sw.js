const C='kivun-vatzeva-v4';
const A=["./","index.html","style.css","app.js","manifest.json","icon.svg","icon-192.png","icon-512.png","audio/colors/ahmar.mp3","audio/colors/azraq.mp3","audio/colors/akhdar.mp3","audio/colors/asfar.mp3","audio/colors/abyad.mp3","audio/colors/aswad.mp3","audio/colors/burtuqali.mp3","audio/colors/banafsaji.mp3","audio/directions/yamin.mp3","audio/directions/yasar.mp3","audio/directions/foq.mp3","audio/directions/taht.mp3","audio/directions/quddam.mp3","audio/directions/wara.mp3","audio/compass/shamal.mp3","audio/compass/shamal-sharq.mp3","audio/compass/sharq.mp3","audio/compass/janub-sharq.mp3","audio/compass/janub.mp3","audio/compass/janub-gharb.mp3","audio/compass/gharb.mp3","audio/compass/shamal-gharb.mp3"];

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