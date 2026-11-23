/* body.js — Body & Curves sliders and presets (shoulders, waist, hips, muscle tone…). */
/* ---- v8: body customization + 3D ---- */
const BP5=[['bust','Bust'],['waist','Waist'],['hips','Hips'],['thighs','Thighs'],['shoulders','Shoulders'],['arms','Arms'],['calves','Calves'],['tone','Muscle tone'],['abdomen','Abdomen'],['head','Head size']],
BPRE={Slim:[-2,-2,-1,-2,-1,-1,0,0],Athletic:[0,-2,1,2,1,1,1,3],Curvy:[3,-3,4,3,0,0,1,0],Lucia:[1,0,2,4,1,1,1,4]};
function setHead(){HT='translate(150 90) scale('+(1.18+BD.head*.02).toFixed(3)+') translate(-150 -90)';['Lhb','Lhf'].forEach(i=>$(i).setAttribute('transform',HT))}
function applyBody(){setHead();$('Lbody').innerHTML=body();for(const k in LAST)delete LAST[k];try{localStorage.setItem('luciaBody',JSON.stringify(BD))}catch(e){}updateMannequin()}
function initBody(){try{Object.assign(BD,JSON.parse(localStorage.getItem('luciaBody'))||{})}catch(e){}
    for(const k in BD)BD[k]=Math.max(-7,Math.min(7,+BD[k]||0));setHead();
    const d=document.createElement('div');d.className='bodyui';
    d.innerHTML='<h3>Body &amp; Curves</h3>'+BP5.map(([k,l])=>`<div class="ap"><span>${l}</span><input type="range" min="-7" max="7" step=".25" id="bd_${k}" aria-label="${l}"><input type="number" class="bn" min="-7" max="7" step=".25" id="bn_${k}" aria-label="${l} value"></div>`).join('')+
        '<div class="btn-row" style="margin-top:10px">'+Object.keys(BPRE).map(n=>`<button type="button" class="tb" data-bp="${n}">${n}</button>`).join('')+'<button type="button" class="tb" data-bp="reset">Reset body</button><button type="button" class="tb" data-bp="rand">Randomize</button><button type="button" class="tb" data-bp="copy">Copy code</button><button type="button" class="tb" data-bp="paste">Paste code</button><button type="button" class="tb" data-bp="save">Save preset</button></div><div class="btn-row" id="bcust"></div><small class="hint">Type exact values, or double-click a label to zero it.</small>';
    document.querySelector('.controls').after(d);
    const sync=()=>BP5.forEach(([k])=>{$('bd_'+k).value=BD[k];$('bn_'+k).value=BD[k]}),
        CP=()=>{try{return JSON.parse(localStorage.getItem('luciaBodyP'))||{}}catch(e){return{}}},scp=c=>{try{localStorage.setItem('luciaBodyP',JSON.stringify(c))}catch(e){toast('Storage unavailable')}},
        rc=()=>{$('bcust').innerHTML=Object.keys(CP()).map(n=>`<span class="cp"><button type="button" class="tb" data-cp="${esc(n)}">${esc(n)}</button><button type="button" class="tb" data-cd="${esc(n)}" aria-label="Delete ${esc(n)}">×</button></span>`).join('')};sync();rc();
    d.oninput=e=>{const t=e.target.id||'',k=t.slice(3);if(/^b[dn]_/.test(t)&&k in BD){BD[k]=Math.max(-7,Math.min(7,+e.target.value||0));(t[1]=='d'?$('bn_'+k):$('bd_'+k)).value=BD[k];applyBody()}};
    d.ondblclick=e=>{const i=e.target.closest('.ap')&&e.target.closest('.ap').querySelector('input[type=range]');if(i){BD[i.id.slice(3)]=0;sync();applyBody()}};
    d.onclick=e=>{const T=e.target.dataset;if(T.cp){const c=CP()[T.cp];if(c){BP5.forEach(([k])=>BD[k]=Math.max(-7,Math.min(7,+c[k]||0)));sync();applyBody()}return}
        if(T.cd){const c=CP();delete c[T.cd];scp(c);rc();return}
        const n=T.bp;if(!n)return;
        if(n==='copy')return copyText('LUCIABODY:'+JSON.stringify(BD),'Body code copied');
        if(n==='save'){const nm=(prompt('Name this body preset')||'').trim().slice(0,24);if(nm){const c=CP();c[nm]=Object.assign({},BD);scp(c);rc();toast('Saved '+nm)}return}
        if(n==='paste'){const t=prompt('Paste a body code');if(!t)return;try{const o=JSON.parse(t.replace(/^\s*LUCIABODY:/,''));BP5.forEach(([k])=>BD[k]=Math.max(-7,Math.min(7,+o[k]||0)));sync();applyBody()}catch(x){toast('Not a valid body code')}return}
        if(n==='rand'){BP5.forEach(([k])=>BD[k]=Math.round((Math.random()*6-3)*4)/4);sync();applyBody();return}
        const v=BPRE[n]||[0,0,0,0,0];BP5.forEach(([k],i)=>BD[k]=v[i]||0);
        if(n==='Lucia'){$('hair').value='messy-high-bun';$('skin').value='lucia'}sync();applyBody()};
    $('Lbody').innerHTML=body();
}
