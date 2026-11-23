/* main.js — Start-up: populate controls, restore saved/shared look, pointer parallax, service worker. */
document.addEventListener('DOMContentLoaded',()=>{
    [['top',tops],['bottom',bottoms],['outer',outers],['shoes',shoes],['accessories',accessories],['hair',hairs],['hcolor',HC],['skin',SKN]].forEach(([i,d])=>populateSelect(i,d));
    load(DEF);
    $('defs').innerHTML=PATS+GRAD;
    $('Lfl').innerHTML='<ellipse cx="150" cy="594" rx="104" ry="13" fill="url(#fl)"/><ellipse cx="150" cy="592" rx="84" ry="8" fill="#1d1430" stroke="#ff2d95" stroke-opacity=".55"/><ellipse cx="150" cy="592" rx="62" ry="5" fill="none" stroke="#00f0ff" stroke-opacity=".25"/><ellipse cx="150" cy="589" rx="44" ry="3.5" fill="#000" opacity=".55" filter="url(#bl)"/>';
    $('Lbody').innerHTML=body();
    const m=location.hash.match(/^#look=(.+)$/);let ok=false;
    if(m)try{load(unsnap(decodeURIComponent(m[1])));ok=true}catch(e){}
    if(!ok)try{load(JSON.parse(localStorage.getItem('luciaLook')))}catch(e){}
    IDS.forEach(id=>{const s=$(id),w=document.createElement('div'),lb=s.closest('.control-group').querySelector('label');w.className='nav';lb.htmlFor=id;s.before(w);
        const mk=(t,d)=>{const b=document.createElement('button');b.type='button';b.className='nv';b.textContent=t;b.setAttribute('aria-label',(d<0?'Previous ':'Next ')+id);b.onclick=()=>step(id,d);return b},
        lk=document.createElement('button');lk.type='button';lk.className='nv lk';lk.textContent='🔓';lk.title='Lock: keep this piece when randomizing';lk.setAttribute('aria-label','Lock '+id);lk.setAttribute('aria-pressed','false');
        lk.onclick=()=>{const on=!LOCK.has(id);on?LOCK.add(id):LOCK.delete(id);lk.textContent=on?'🔒':'🔓';lk.setAttribute('aria-pressed',on)};
        w.append(mk('‹',-1),s,mk('›',1),lk)});
    initBody();calcCombos();updateMannequin();buildDatabase();renderSaved();initCash();initInv();initPresets();hbtn();
    if(!matchMedia('(prefers-reduced-motion:reduce)').matches){const stg=$('stage'),mq=$('mq');let t=[0,0],c=[0,0],on=false;
        const tick=()=>{c[0]+=(t[0]-c[0])*.1;c[1]+=(t[1]-c[1])*.1;mq.style.setProperty('--px',c[0].toFixed(3));mq.style.setProperty('--py',c[1].toFixed(3));
            if(Math.abs(t[0]-c[0])+Math.abs(t[1]-c[1])>.002)requestAnimationFrame(tick);else on=false},go=()=>{if(!on){on=true;requestAnimationFrame(tick)}};
        stg.addEventListener('pointermove',e=>{const r=stg.getBoundingClientRect();t=[(e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1];go()});
        stg.addEventListener('pointerleave',()=>{t=[0,0];go()})}
});

/* Offline support + installable app (secure contexts only: HTTPS or localhost; ignored on file://) */
if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
