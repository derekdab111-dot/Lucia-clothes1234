/* app.js — App state and UI: selects, history (undo/redo), saved looks, share link, PNG export, shortcuts. */
function populateSelect(id, data) {
    const sel = document.getElementById(id);
    sel.innerHTML = '';
    for (const [key, label] of Object.entries(data)) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = label;
        sel.appendChild(opt);
    }
}

function calcCombos() {
    const cv = Object.keys(tops).filter(k => ['dress','jump'].includes((SPEC.top[k]||[])[0])).length, total = ((Object.keys(tops).length - cv) * Object.keys(bottoms).length + cv) * Object.keys(outers).length * Object.keys(shoes).length * Object.keys(accessories).length * Object.keys(hairs).length;
    document.getElementById('comboCount').textContent = total.toLocaleString();
}

function updateMannequin() {
    const m = {top:[tops,'sumTop'], bottom:[bottoms,'sumBottom'], outer:[outers,'sumOuter'], shoes:[shoes,'sumShoes'], accessories:[accessories,'sumAcc'], hair:[hairs,'sumHair']};
    for (const k in m) document.getElementById(m[k][1]).textContent = m[k][0][document.getElementById(k).value];
    if (['dress','jump'].includes((SPEC.top[document.getElementById('top').value]||[])[0])) document.getElementById('sumBottom').textContent += ' (covered)';
    draw(); save(); pushHist(); if(window.cashRefresh)cashRefresh();
}
const IDS = ['top','bottom','outer','shoes','accessories','hair','hcolor','skin'];
const DEF = {top:'white-crop',bottom:'denim-dark',outer:'leather-biker',shoes:'ankle-black',accessories:'gold-hoops',hair:'messy-high-bun',hcolor:'default',skin:'lucia'};
function save() { try { localStorage.setItem('luciaLook', JSON.stringify(Object.fromEntries(IDS.map(i => [i, document.getElementById(i).value])))); } catch (e) {} }
function load(o) { if (!o) return; IDS.forEach(i => { const s = document.getElementById(i); if ([...s.options].some(x => x.value === o[i])) s.value = o[i]; }); }
function resetLook() { load(DEF); updateMannequin(); }
function step(id, d) { const s = document.getElementById(id); s.selectedIndex = (s.selectedIndex + d + s.options.length) % s.options.length; updateMannequin(); }
const HC={default:'Style default','#28201b':'Lucia dark brown','#1a100c':'Natural black','#3a2216':'Dark brown','#6a3d22':'Chestnut','#7a2e1c':'Auburn','#c9a25a':'Honey blonde'};
const SKN={lucia:'Lucia (reference photo)',caramel:'Caramel (default)',fair:'Fair',tan:'Tan',brown:'Brown',deep:'Deep'};
const isCover=()=>['dress','jump'].includes((SPEC.top[$('top').value]||[])[0]);
const esc=s=>String(s).replace(/[<>&"']/g,''),LOCK=new Set();
let hist=[],hi=-1,busy=false,SAVED=[];
try{SAVED=JSON.parse(localStorage.getItem('luciaSaved'));if(!Array.isArray(SAVED))SAVED=[]}catch(e){SAVED=[]}

function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1700)}
function copyText(t,msg){const ok=()=>toast(msg||'Copied!'),fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let r=false;try{r=document.execCommand('copy')}catch(e){}a.remove();toast(r?msg||'Copied!':'Copy failed')};
    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,fb);else fb()}
function copyLook(){copyText(IDS.slice(0,6).map(i=>{const s=$(i);return s.options[s.selectedIndex].text}).join(' | '),'Look copied!')}

const snap=()=>IDS.map(i=>$(i).value).join('~'),unsnap=s=>{const p=s.split('~'),o={};IDS.forEach((i,n)=>o[i]=p[n]);return o};
function hbtn(){$('bUndo').disabled=hi<1;$('bRedo').disabled=hi>=hist.length-1}
function pushHist(){if(busy)return;const s=snap();if(hist[hi]===s)return;hist=hist.slice(0,hi+1);hist.push(s);if(hist.length>60)hist.shift();hi=hist.length-1;hbtn()}
function jump(d){const n=hi+d;if(n<0||n>=hist.length)return;hi=n;busy=true;load(unsnap(hist[hi]));updateMannequin();busy=false;hbtn()}
const undo=()=>jump(-1),redo=()=>jump(1);

function generateOutfit(){updateMannequin();const k=id=>$(id).value,P=[];
    if(k('outer')!=='none')P.push(outers[k('outer')]);
    P.push(tops[k('top')]);
    if(!isCover()&&k('bottom')!=='none')P.push(bottoms[k('bottom')]);
    if(k('shoes')!=='none')P.push(shoes[k('shoes')]);
    if(k('accessories')!=='none')P.push(accessories[k('accessories')]);
    P.push('Hair: '+hairs[k('hair')]);
    const t=k('top'),o=k('outer'),s=k('shoes'),has=(x,...a)=>a.some(w=>x.includes(w)),
    name=has(t,'prison')?'Day One Out':has(t,'bikini','swim')?'Poolside Leonida':has(t,'sequin','dress','halter')?'Neon Nightlife':has(s,'tiger')?'Tiger Stripe Statement':has(o,'leather','biker','moto')?'Moto Queen':has(o,'leopard','fur')?'Stock 305 Flex':has(t,'baddie','hoodie')?'Street BADDIE':has(t,'sports','eris','alpha')?'Gym Fighter':'Custom Lucia Look';
    $('outfitName').textContent=name;$('pieceList').innerHTML=P.map(p=>`<li>${p}</li>`).join('');
    $('styleNote').textContent=styleNotes[Math.floor(Math.random()*styleNotes.length)];$('result').classList.add('active')}

function randomizeAll(){const R=n=>Math.floor(Math.random()*n);
    ['top','bottom','outer','shoes','accessories','hair'].forEach(id=>{if(!LOCK.has(id)){const s=$(id);s.selectedIndex=R(s.options.length)}});
    if(!LOCK.has('hcolor')&&Math.random()<.3){const s=$('hcolor');s.selectedIndex=R(s.options.length)}
    if(!LOCK.has('bottom')){const b=$('bottom');if(isCover())b.value='none';else if(b.value==='none')b.selectedIndex=1+R(b.options.length-1)}
    generateOutfit()}

function renderSaved(){$('saved').innerHTML=SAVED.length?SAVED.map((x,i)=>`<span class="chip"><button type="button" onclick="loadSaved(${i})">${esc(x.n)}</button><button type="button" class="x" aria-label="Delete ${esc(x.n)}" onclick="delSaved(${i})">×</button></span>`).join(''):'<span class="hint">No saved looks yet. Build one and hit Save Look.</span>'}
function persist(){try{localStorage.setItem('luciaSaved',JSON.stringify(SAVED))}catch(e){toast('Storage unavailable')}renderSaved();if(window.cashRefresh)cashRefresh()}
function saveLook(){if(SAVED.length>=12)return toast('Slots full, delete one first');generateOutfit();SAVED.push({n:$('outfitName').textContent+' #'+(Date.now()%1000),s:snap()});persist();toast('Look saved')}
function loadSaved(i){if(SAVED[i]){load(unsnap(SAVED[i].s));updateMannequin()}}
function delSaved(i){SAVED.splice(i,1);persist()}

function shareLook(){const u=location.href.split('#')[0]+'#look='+encodeURIComponent(snap());try{history.replaceState(null,'',u)}catch(e){}copyText(u,'Link copied!')}
function savePNG(){const svg=$('mq'),cs=getComputedStyle(svg),img=new Image(),
    x=new XMLSerializer().serializeToString(svg).replace('<svg ','<svg width="900" height="1800" ').replace(/var\(--(s\d)\)/g,(m,n)=>cs.getPropertyValue('--'+n).trim());
    img.onload=()=>{const c=document.createElement('canvas');c.width=900;c.height=1800;const g=c.getContext('2d'),r=g.createRadialGradient(450,700,60,450,900,1100);r.addColorStop(0,'#33264d');r.addColorStop(1,'#0f0a18');g.fillStyle=r;g.fillRect(0,0,900,1800);g.drawImage(img,0,0,900,1800);
        c.toBlob(b=>{if(!b)return toast('PNG export failed');const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lucia-look.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)})};
    img.onerror=()=>toast('PNG export failed');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x)}

window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#look=(.+)$/);if(m)try{load(unsnap(decodeURIComponent(m[1])));updateMannequin()}catch(e){}});
document.addEventListener('keydown',e=>{const t=e.target,tag=t&&t.tagName,k=e.key.toLowerCase(),m=e.ctrlKey||e.metaKey;
    if(tag==='INPUT'||tag==='TEXTAREA')return;
    if(m&&k==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if(m&&k==='y'){e.preventDefault();redo()}
    else if(!m&&!e.altKey&&tag!=='SELECT'&&tag!=='BUTTON'){if(k==='r')randomizeAll();else if(k==='s')saveLook();else if(k==='0')resetLook()}});
