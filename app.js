const data={colors:[['אדום','أحمر','אַחְמַר','#ef4444'],['כחול','أزرق','אַזְרַק','#3b82f6'],['ירוק','أخضر','אַחְ׳דַר','#22c55e'],['צהוב','أصفر','אַסְפַר','#facc15'],['לבן','أبيض','אַבְּיַד','#fff'],['שחור','أسود','אַסְוַד','#111827'],['כתום','برتقالي','בֻּרְתֻקַאלִי','#f97316'],['סגול','بنفسجي','בַּנַפְסַגִ׳י','#a855f7']],directions:[['ימין','يمين','יַמִין','→'],['שמאל','يسار','יַסַאר','←'],['למעלה','فوق','פוֹק','↑'],['למטה','تحت','תַחְת','↓'],['קדימה','قدّام','קֻדַּאם','↟'],['אחורה','ورا','וַרַא','↡']],compass:[['צפון','شمال','שַמַאל','↑'],['צפון־מזרח','شمال شرق','שַמַאל שַרְק','↗'],['מזרח','شرق','שַרְק','→'],['דרום־מזרח','جنوب شرق','גַ׳נוּבּ שַרְק','↘'],['דרום','جنوب','גַ׳נוּבּ','↓'],['דרום־מערב','جنوب غرب','גַ׳נוּבּ עַ׳רְבּ','↙'],['מערב','غرب','עַ׳רְבּ','←'],['צפון־מערב','شمال غرب','שַמַאל עַ׳רְבּ','↖']]};const c=document.querySelector('#content');const audioFiles={
'أحمر':'audio/colors/ahmar.mp3','أزرق':'audio/colors/azraq.mp3','أخضر':'audio/colors/akhdar.mp3','أصفر':'audio/colors/asfar.mp3','أبيض':'audio/colors/abyad.mp3','أسود':'audio/colors/aswad.mp3','برتقالي':'audio/colors/burtuqali.mp3','بنفسجي':'audio/colors/banafsaji.mp3',
'يمين':'audio/directions/yamin.mp3','يسار':'audio/directions/yasar.mp3','فوق':'audio/directions/foq.mp3','تحت':'audio/directions/taht.mp3','قدّام':'audio/directions/quddam.mp3','ورا':'audio/directions/wara.mp3',
'شمال':'audio/compass/shamal.mp3','شمال شرق':'audio/compass/shamal-sharq.mp3','شرق':'audio/compass/sharq.mp3','جنوب شرق':'audio/compass/janub-sharq.mp3','جنوب':'audio/compass/janub.mp3','جنوب غرب':'audio/compass/janub-gharb.mp3','غرب':'audio/compass/gharb.mp3','شمال غرب':'audio/compass/shamal-gharb.mp3'};
let currentAudio=null;
function fallbackSpeak(t){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='ar';u.rate=.8;speechSynthesis.speak(u)}
function speak(t){
  speechSynthesis.cancel();
  if(currentAudio){currentAudio.pause();currentAudio.currentTime=0}
  const src=audioFiles[t];
  if(!src){fallbackSpeak(t);return}
  const audio=new Audio(src);
  currentAudio=audio;
  let fellBack=false;
  audio.addEventListener('error',()=>{if(!fellBack){fellBack=true;fallbackSpeak(t)}},{once:true});
  audio.play().catch(()=>{if(!fellBack){fellBack=true;fallbackSpeak(t)}});
}function card(x,type){let art=type==='colors'?'<div class="swatch" style="background:'+x[3]+'"></div>':'<div class="arrow">'+x[3]+'</div>';return '<article class="card"><div class="pic">'+art+'</div><div class="he">'+x[0]+'</div><div class="arabic" lang="ar" dir="rtl">'+x[1]+'</div><div class="trans">'+x[2]+'</div><button class="speak" aria-label="השמעה" data-speak="'+x[1]+'">🔊</button></article>'}function show(type){let compass=type==='compass'?'<div class="compass"><svg viewBox="0 0 200 200" aria-label="מצפן"><circle cx="100" cy="100" r="88" fill="#0f172a" stroke="#64748b" stroke-width="2"/><path d="M100 18 116 100 100 182 84 100Z" fill="#60a5fa"/><circle cx="100" cy="100" r="7" fill="white"/><text x="100" y="14" text-anchor="middle">شمال</text><text x="186" y="104" text-anchor="middle">شرق</text><text x="100" y="198" text-anchor="middle">جنوب</text><text x="14" y="104" text-anchor="middle">غرب</text></svg></div>':'';c.innerHTML=compass+'<div class="grid">'+data[type].map(x=>card(x,type)).join('')+'</div>'}document.querySelector('nav').onclick=e=>{let b=e.target.closest('button');if(b)show(b.dataset.page)};c.onclick=e=>{let b=e.target.closest('[data-speak]');if(b)speak(b.dataset.speak)};show('colors');if('serviceWorker' in navigator){
  let refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(refreshing)return;
    refreshing=true;
    location.reload();
  });
  navigator.serviceWorker.register('sw.js').then(reg=>{
    reg.update();
  });
};let deferredPrompt=null;const installBtn=document.querySelector('#installBtn');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});installBtn.addEventListener('click',async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}else{alert('Chrome עדיין לא הציע התקנה אוטומטית. פתח את תפריט Chrome ובחר הוספה למסך הבית או התקנת אפליקציה.')}});window.addEventListener('appinstalled',()=>{installBtn.textContent='היישומון מותקן';installBtn.disabled=true;deferredPrompt=null});