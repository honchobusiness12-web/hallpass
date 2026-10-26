/* Hall Pass offline support. The game page always comes fresh from the network (so updates show up right away);
   the saved copy is only used when there is no connection. */
const C='hallpass-v42';const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||q.headers.has('range'))return;const u=new URL(q.url);
  if(u.origin===location.origin){const page=q.mode==='navigate'||/\/$|\.html$/.test(u.pathname);
    if(page){e.respondWith(fetch(new Request(q.url,{cache:'no-store',credentials:'same-origin'})).then(r=>{if(r.ok&&!u.search){const cp=r.clone();caches.open(C).then(c=>c.put('index.html',cp))}return r})
        .catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));return}
    e.respondWith(fetch(q).then(r=>{if(r.ok&&!u.search){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r}).catch(()=>caches.match(q)));return}
  if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(caches.match(q).then(m=>m||fetch(q).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(q,cp));return r})))}});
