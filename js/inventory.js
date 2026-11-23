/* inventory.js — Inventory tracker (items, quantities, hot/stolen flag, CSV copy). */
function initInv(){let inv=[];try{inv=JSON.parse(localStorage.getItem('luciaInv'));if(!Array.isArray(inv))inv=[]}catch(e){inv=[]}
    const fix=a=>a.filter(x=>x&&typeof x.n=='string'&&typeof x.c=='string').slice(0,500).map(x=>({id:String(x.id||Date.now()+Math.random()),c:x.c.toLowerCase(),n:x.n,q:Math.max(1,Math.round(+x.q||1)),v:Math.max(0,Math.round(+x.v||0)),l:String(x.l||''),h:!!x.h}));inv=fix(inv);
    const CATS=[['drugs','💊'],['stolen items','🕶️'],['cars','🚗'],['gold','🪙'],['diamonds','💎'],['watches','⌚'],['jewelry','📿'],['weapons','🔫'],['art','🖼️'],['other','📦']],ic=c=>(CATS.find(x=>x[0]===c)||[0,'📦'])[1],
    $$=n=>'$'+Math.round(+n||0).toLocaleString(),sv=()=>{try{localStorage.setItem('luciaInv',JSON.stringify(inv))}catch(e){toast('Storage unavailable')}},nn=v=>Math.max(0,Math.round(+v||0));
    window.invGet=()=>inv;window.invSet=a=>{inv=fix(Array.isArray(a)?a:[]);sv()};
    $('catlist').innerHTML=CATS.map(x=>`<option value="${x[0]}">`).join('');
    function render(){const fc=$('ifc').value,q=$('isr').value.toLowerCase(),cats=[...new Set(inv.map(x=>x.c))].sort();$('ifc').innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option value="${esc(c)}"${c===fc?' selected':''}>${esc(c)}</option>`).join('');
        const L=inv.filter(x=>(!fc||x.c===fc)&&(!q||(x.n+' '+x.l+' '+x.c).toLowerCase().includes(q))).sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n)),tv=inv.reduce((a,x)=>a+x.q*x.v,0),hv=inv.filter(x=>x.h).reduce((a,x)=>a+x.q*x.v,0),by={};inv.forEach(x=>by[x.c]=(by[x.c]||0)+x.q*x.v);
        $('isum').innerHTML=`<div class="bank-grid"><div><span class="l">Inventory value</span><b>${$$(tv)}</b></div><div><span class="l">Items</span><b>${inv.reduce((a,x)=>a+x.q,0)}</b></div><div><span class="l">Hot 🔥 value</span><b class="${hv?'warn':''}">${$$(hv)}</b></div></div><p class="ms">${Object.keys(by).sort((a,b)=>by[b]-by[a]).map(c=>`${ic(c)} ${esc(c)} ${$$(by[c])}`).join(' · ')||'Nothing stored yet. Add drugs, cars, gold, anything.'}${window.cashApi?` · Net worth with inventory ${$$(cashApi.nw()+tv)}`:''}</p>`;
        $('ilist').innerHTML=L.length?L.map(x=>`<li data-id="${esc(x.id)}">${ic(x.c)} <b>${esc(x.n)}</b> <small class="hint">${esc(x.c)}${x.l?' · '+esc(x.l):''}</small>${x.h?' <em class="warn">🔥 hot</em>':''}<span class="iq"><button type="button" class="tb" data-a="-" aria-label="Less">−</button> ×${x.q} <button type="button" class="tb" data-a="+" aria-label="More">+</button></span> ${$$(x.v)} ea · <b>${$$(x.q*x.v)}</b> <button type="button" class="tb" data-a="val">Value</button><button type="button" class="tb" data-a="sell">Sell</button><button type="button" class="tb" data-a="del" aria-label="Delete">✕</button></li>`).join(''):'<li class="hint">No items match.</li>'}
    $('iadd').onclick=()=>{const n=$('in').value.trim(),c=($('ic').value.trim()||'other').slice(0,24).toLowerCase();if(!n)return toast('Name the item');inv.push({id:Date.now()+Math.random().toString(36).slice(2,6),c,n:n.slice(0,40),q:Math.max(1,nn($('iq').value)||1),v:nn($('iv').value),l:$('il').value.trim().slice(0,24),h:$('ih').checked});['in','iv','il'].forEach(i=>$(i).value='');$('iq').value=1;$('ih').checked=false;sv();render();toast('Added '+n)};
    $('in').onkeydown=e=>{if(e.key==='Enter')$('iadd').click()};
    $('ilist').onclick=e=>{const a=e.target.dataset.a,li=e.target.closest('li');if(!a||!li)return;const x=inv.find(i=>i.id===li.dataset.id);if(!x)return;
        if(a==='+')x.q++;else if(a==='-'){x.q--;if(x.q<1)inv=inv.filter(i=>i!==x)}
        else if(a==='del'){if(!confirm('Delete '+x.n+'?'))return;inv=inv.filter(i=>i!==x)}
        else if(a==='val'){const v=prompt('Value each ($)',x.v);if(v===null)return;x.v=nn(v)}
        else if(a==='sell'){const q=Math.min(x.q,nn(prompt('Sell how many? (max '+x.q+')',1)));if(!q)return;const p=nn(prompt('Price each ($)',x.v));if(window.cashApi&&q*p>0)cashApi.sell(q*p,'Sold '+q+'× '+x.n);x.q-=q;if(x.q<1)inv=inv.filter(i=>i!==x);toast('Sold '+q+' for '+$$(q*p))}
        sv();render()};
    ['ifc','isr'].forEach(i=>$(i).oninput=render);
    $('icsv').onclick=()=>copyText(['Category,Item,Qty,Value each,Location,Hot'].concat(inv.map(x=>[x.c,x.n,x.q,x.v,x.l,x.h?'yes':'no'].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','))).join('\n'),'Inventory copied as CSV');
    render()}
