/* cash.js — Cash Hub: wallet, bank, vaults, score log, spending log, plans. */
const METH=[
    ['Story missions','Biggest, steadiest payouts. Heist windfalls land mid-story.',3,1,2,'Always'],
    ['Store stick-ups','Fast pocket cash from almost any shop. Heat climbs if it goes loud.',2,3,4,'Early'],
    ['Steal & sell cars','Guides put flips around a couple thousand. High resale isn’t always the best early target.',2,2,3,'Early'],
    ['Rob other criminals','Hit dealers and crews instead of civilians for cash plus product.',3,3,3,'Early'],
    ['Illegal ops & gang hideouts','Steal narcotics and sell to buyers (some cap daily sales). Unlocks with drug selling.',4,4,4,'After drug selling'],
    ['Underwater treasure','Dive wrecks for loot. Slow, safe and steady.',2,1,1,'Early'],
    ['Races & paid activities','Repeatable side events to run between heists.',2,1,2,'Early'],
    ['Jewelry stores & pawn shops','Big scores, big heat. Save them for when you’re ready.',4,5,4,'Mid-game'],
    ['Bank robberies','Highest reported payouts (one guide cites $135K+) and the most heat.',5,5,5,'Later in story']];
function initCash(){let d={};try{d=JSON.parse(localStorage.getItem('luciaCash'))||{}}catch(e){}
    d.t=d.t||{};d.p=d.p||{};d.b=+d.b||0;d.ap=+d.ap||0;d.bl=Array.isArray(d.bl)?d.bl:[];d.log=Array.isArray(d.log)?d.log:[];d.mode=d.mode||'bal';d.vaults=Array.isArray(d.vaults)?d.vaults.filter(v=>v&&v.n).slice(0,12):[];
    const sv=()=>{try{localStorage.setItem('luciaCash',JSON.stringify(d))}catch(e){}},
    $$=n=>'$'+Math.round(+n||0).toLocaleString(),dots=n=>'●'.repeat(n)+'○'.repeat(5-n),
    SLOT=[['top',tops],['bottom',bottoms],['outer',outers],['shoes',shoes],['accessories',accessories]],
    pieces=()=>SLOT.map(([id,dt])=>{const v=$(id).value;return v==='none'||(id==='bottom'&&isCover())?null:{k:id+':'+v,n:dt[v]}}).filter(Boolean),
    tot=()=>pieces().reduce((a,q)=>a+(+d.p[q.k]||0),0),
    stat=i=>{const L=d.log.filter(x=>x.m===i);return{n:L.length,sum:L.reduce((a,x)=>a+x.a,0)}},
    SC={safe:m=>m[2]-m[3]*3,bal:m=>m[2]+m[4]-m[3],fast:m=>m[2]*2+m[4]};
    const vs=()=>d.vaults.reduce((a,v)=>a+(+v.s||0),0),fixV=()=>{let ex=vs()-(+d.b||0);for(let i=d.vaults.length-1;i>=0&&ex>0;i--){const t=Math.min(ex,d.vaults[i].s);d.vaults[i].s-=t;ex-=t}};
    function vaultsUI(){$('vaults').innerHTML=d.vaults.map((v,i)=>{const p=v.t?Math.min(100,v.s/v.t*100):0;return`<div class="vl"><b>${esc(v.n)}</b> <small class="hint">${$$(v.s)} / ${$$(v.t)} · ${Math.floor(p)}%</small><div class="bar"><i style="width:${p}%"></i></div><div class="hrow invf"><input type="number" min="1" placeholder="$" aria-label="Vault amount"><button type="button" class="tb" data-va="${i}">Add</button><button type="button" class="tb" data-vt="${i}">Take</button><button type="button" class="tb" data-vd="${i}" aria-label="Delete vault">✕</button></div></div>`}).join('')+(d.vaults.length?`<small class="hint">Free in bank: ${$$((+d.b||0)-vs())} · vault money stays banked.</small>`:'')}
    function money(){const w=(+d.w||0)+(+d.b||0),g=+d.g||0,gap=g-w;$('bar').style.width=(g?Math.min(100,w/g*100):0)+'%';
        $('gap').textContent=g?(gap>0?`Need ${$$(gap)} more · ${Math.floor(w/g*100)}% there`:'Goal reached ✓ Go shopping'):'Set a goal, or price your outfit below';return gap}
    function hubX(){const L=d.log,E=L.filter(x=>x.a>0),sum=E.reduce((a,x)=>a+x.a,0),sp=-L.filter(x=>x.a<0).reduce((a,x)=>a+x.a,0),avg=E.length?sum/E.length:0,by={};E.forEach(x=>by[x.m]=(by[x.m]||0)+x.a);
        const bm=Object.keys(by).sort((a,b)=>by[b]-by[a])[0],wk=E.filter(x=>Date.now()-x.t<6048e5).reduce((a,x)=>a+x.a,0),w=(+d.w||0)+(+d.b||0),gap=(+d.g||0)-w,
        cost=s=>{const o=unsnap(s),cv=['dress','jump'].includes((SPEC.top[o.top]||[])[0]);return SLOT.reduce((a,[id])=>a+((o[id]==='none'||(id==='bottom'&&cv))?0:(+d.p[id+':'+o[id]]||0)),0)},
        t0=new Date().setHours(0,0,0,0),days=[...Array(7)].map((_,i)=>{const st=t0-(6-i)*864e5;return{l:'SMTWTFS'[new Date(st).getDay()],v:E.filter(x=>x.t>=st&&x.t<st+864e5).reduce((a,x)=>a+x.a,0)}}),mx=Math.max(1,...days.map(x=>x.v)),
        chart=`<svg class="ch" viewBox="0 0 210 72" role="img" aria-label="Earnings, last 7 days">`+days.map((x,i)=>{const h=x.v?Math.max(2,x.v/mx*42):0;return`<rect x="${i*30+4}" y="${52-h}" width="22" height="${h}" rx="3"/><text x="${i*30+15}" y="64">${x.l}</text>${x.v?`<text x="${i*30+15}" y="${49-h}">${x.v>=1e3?Math.round(x.v/100)/10+'k':x.v}</text>`:''}`}).join('')+'</svg>',
        rows=[...L.map(x=>({t:x.t,k:x.a<0?'spend':'earn',n:esc(x.note||(x.m<0?'Outfit purchase':(METH[x.m]||['Score'])[0])),a:x.a})),...d.bl.map(x=>({t:x.t,k:'bank',n:{dep:'Deposit',wd:'Withdrawal',auto:'Auto-banked'}[x.k]||'Transfer',a:x.k==='wd'?-x.a:x.a}))].sort((a,b)=>b.t-a.t),
        f=d.lf||'all',shown=rows.filter(r=>f==='all'||r.k===f).slice(0,12);hubX.rows=rows;
        $('hubX').innerHTML=`<h3>📊 Money stats</h3><div class="bank-grid"><div><span class="l">Earned</span><b>${$$(sum)}</b></div><div><span class="l">Spent</span><b>${$$(sp)}</b></div><div><span class="l">Last 7 days</span><b>${$$(wk)}</b></div></div>${chart}<p class="ms">${E.length?`Avg score ${$$(avg)} · best source: ${bm>=0&&METH[bm]?METH[bm][0]:'—'}`+(gap>0&&avg?` · ~${Math.ceil(gap/avg)} more scores to hit your goal`:''):'Log a few scores to see trends.'}</p>
        <h3 style="margin-top:14px">🧾 Ledger <select id="lf" aria-label="Filter ledger">${[['all','All'],['earn','Income'],['spend','Spending'],['bank','Bank']].map(([v,n])=>`<option value="${v}"${v===f?' selected':''}>${n}</option>`).join('')}</select> <button type="button" class="tb" id="csv">Copy CSV</button></h3>
        <ul id="ledger">${shown.length?shown.map(r=>`<li><b class="${r.a<0?'neg':'pos'}">${r.a<0?'−':'+'}${$$(Math.abs(r.a))}</b> ${r.n} <small class="hint">${new Date(r.t).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</small></li>`).join(''):'<li class="hint">Nothing here yet.</li>'}</ul>
        <h3 style="margin-top:14px">🛍 Wishlist (saved looks)</h3>`+
        (SAVED.length?SAVED.map(x=>{const c=cost(x.s);return`<div class="pr"><span>${esc(x.n)}</span><b class="${c&&w>=c?'pos':''}">${c?$$(c)+(w>=c?' ✓ affordable':' · need '+$$(c-w)):'no prices yet'}</b></div>`}).join(''):'<p class="ms">Save looks to compare their price with your money.</p>')}
    $('hubX').onchange=e=>{if(e.target.id==='lf'){d.lf=e.target.value;sv();hubX()}};
    $('hubX').onclick=e=>{if(e.target.id==='csv')copyText(['Date,Type,Label,Amount'].concat((hubX.rows||[]).map(r=>[new Date(r.t).toISOString(),r.k,r.n,r.a].join(','))).join('\\n'),'Ledger copied as CSV')};
    function render(){fixV();setTimeout(hubX,0);
        $('priceRows').innerHTML=pieces().map(q=>`<label class="pr"><span>${q.n}</span><input type="number" min="0" data-k="${q.k}" value="${d.p[q.k]||''}" placeholder="$ tag"></label>`).join('');
        $('priceTotal').textContent='Outfit total: '+$$(tot());const gap=money();
        document.querySelectorAll('#mode button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===d.mode));
        $('plan').innerHTML=(+d.g&&gap<=0)?'<li>You can afford this look. Hit a store.</li>':METH.map((m,i)=>[m,i]).sort((a,b)=>SC[d.mode](b[0])-SC[d.mode](a[0])).slice(0,3).map(([m,i])=>{const t=stat(i);
            return`<li><b>${m[0]}</b>${t.n&&gap>0?` · about ${Math.ceil(gap/(t.sum/t.n))} runs at your ${$$(t.sum/t.n)} average`:' · log a score for an estimate'}</li>`}).join('');
        $('methods').innerHTML=METH.map((m,i)=>{const t=stat(i);return`<article class="mc"><label class="mt" title="Tick when you’ve tried it"><input type="checkbox" data-i="${i}" ${d.t[i]?'checked':''}><b>${m[0]}</b><em>${m[5]}</em></label><p>${m[1]}</p><div class="mm"><span title="Payout">💰 ${dots(m[2])}</span><span title="Heat">🔥 ${dots(m[3])}</span><span title="Speed">⚡ ${dots(m[4])}</span></div><div class="ms">${t.n?`${t.n} run${t.n>1?'s':''} · ${$$(t.sum)} total · ${$$(t.sum/t.n)} avg`:'No runs logged yet'}</div><button type="button" class="tb" data-log="${i}">+ Log score</button></article>`}).join('');
        $('log').innerHTML=d.log.length?d.log.slice(0,8).map(x=>`<li><b class="${x.a<0?'neg':'pos'}">${x.a<0?'−':'+'}${$$(Math.abs(x.a))}</b> ${esc(x.note||(x.m<0?'Outfit purchase':(METH[x.m]||['Score'])[0]))} <small class="hint">${new Date(x.t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></li>`).join(''):'<li class="hint">Nothing logged yet. Log a score after each job.</li>';
        $('earned').textContent='· earned '+$$(d.log.reduce((a,x)=>a+(x.a>0?x.a:0),0));bank()}
    const nn=v=>Math.max(0,Math.round(+v||0));
    function bank(){const w=+d.w||0,b=+d.b||0;if(document.activeElement!==$('bankIn'))$('bankIn').value=b||'';$('atRisk').textContent=$$(w);$('net').textContent=$$(w+b);$('ap').value=d.ap;$('apv').textContent=d.ap+'%';vaultsUI();{const rk=$('riskWarn');rk.className='ms'+(w>=2000&&w>=(w+b)/2?' warn':'');rk.textContent=w>=2000&&w>=(w+b)/2?`⚠ ${$$(w)} is on you and could be lost. Deposit before a risky job.`:(w?'Cash on hand is a small share of your money.':'')}
        $('bankLog').innerHTML=d.bl.length?d.bl.slice(0,6).map(x=>`<li><b class="${x.k==='wd'?'neg':'pos'}">${x.k==='wd'?'−':'+'}${$$(x.a)}</b> ${{dep:'Deposit',wd:'Withdrawal',auto:'Auto-banked'}[x.k]||'Transfer'} <small class="hint">${new Date(x.t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></li>`).join(''):'<li class="hint">No bank activity yet. Bank your cash before a risky job.</li>'}
    const mv=(k,a)=>{a=Math.round(a);if(!(a>0))return toast('Enter an amount');const w=+d.w||0,b=+d.b||0;
        if(k==='dep'){if(a>w)return toast('Only '+$$(w)+' cash on hand');d.w=w-a;d.b=b+a}else{if(a>b-vs())return toast('Only '+$$(b-vs())+' free in the bank (the rest is in vaults)');d.w=w+a;d.b=b-a}
        d.bl.unshift({k,a,t:Date.now()});$('wallet').value=d.w||'';$('ba').value='';sv();render();toast((k==='dep'?'Deposited ':'Withdrew ')+$$(a))};
    $('lm').innerHTML=METH.map((m,i)=>`<option value="${i}">${m[0]}</option>`).join('');
    $('wallet').value=d.w||'';$('goal').value=d.g||'';
    $('wallet').oninput=e=>{d.w=nn(e.target.value);sv();render()};$('goal').oninput=e=>{d.g=nn(e.target.value);sv();render()};
    $('dep').onclick=()=>mv('dep',+$('ba').value);$('wd').onclick=()=>mv('wd',+$('ba').value);$('depAll').onclick=()=>mv('dep',+d.w||0);$('wdAll').onclick=()=>mv('wd',(+d.b||0)-vs());$('bq').onclick=e=>{const q=+e.target.dataset.p;if(q)$('ba').value=Math.floor((+d.w||0)*q/100)};
    $('bankIn').oninput=e=>{d.b=nn(e.target.value);sv();render()};$('ap').oninput=e=>{d.ap=+e.target.value;sv();$('apv').textContent=d.ap+'%'};
    $('priceRows').oninput=e=>{const k=e.target.dataset.k;if(!k)return;d.p[k]=e.target.value;sv();$('priceTotal').textContent='Outfit total: '+$$(tot());money()};
    $('goalFit').onclick=()=>{d.g=tot();$('goal').value=d.g||'';sv();render()};
    $('buy').onclick=()=>{const t=tot(),w=+d.w||0,b=+d.b||0;if(!t)return toast('Add price tags first');if(w+b<t)return toast('Short by '+$$(t-w-b));const fc=Math.min(w,t),fb=t-fc;d.log.unshift({m:-1,a:-t,dw:-fc,db:-fb,t:Date.now()});d.w=w-fc;d.b=b-fb;$('wallet').value=d.w||'';sv();render();toast('Outfit bought'+(fb?' · '+$$(fb)+' from bank':''))};
    $('mode').onclick=e=>{const m=e.target.dataset.m;if(m){d.mode=m;sv();render()}};
    $('quick').onclick=e=>{const n=+e.target.dataset.n;if(n)$('la').value=(+$('la').value||0)+n};
    $('lb').onclick=()=>{const a=Math.round(+$('la').value);if(!(a>0))return toast('Enter an amount');const bk=Math.round(a*d.ap/100);d.log.unshift({m:+$('lm').value,a,dw:a-bk,db:bk,t:Date.now()});d.w=(+d.w||0)+a-bk;d.b=(+d.b||0)+bk;if(bk)d.bl.unshift({k:'auto',a:bk,t:Date.now()});$('wallet').value=d.w||'';$('la').value='';sv();render();toast('+'+$$(a)+' logged'+(bk?' · '+$$(bk)+' banked':''))};
    $('la').onkeydown=e=>{if(e.key==='Enter')$('lb').click()};
    $('undoLog').onclick=()=>{const x=d.log.shift();if(!x)return;const dw=x.dw??x.a,db=x.db||0;d.w=Math.max(0,(+d.w||0)-dw);d.b=Math.max(0,(+d.b||0)-db);if(db>0&&d.bl[0]&&d.bl[0].k==='auto')d.bl.shift();$('wallet').value=d.w||'';sv();render()};
    $('clearLog').onclick=()=>{if(d.log.length&&confirm('Clear the score log? Cash on hand stays as is.')){d.log=[];sv();render()}};
    $('methods').onchange=e=>{const i=e.target.dataset.i;if(i!=null){d.t[i]=e.target.checked;sv()}};
    $('methods').onclick=e=>{const i=e.target.dataset.log;if(i!=null){$('lm').value=i;$('la').focus()}};
    $('backup').onclick=()=>copyText(JSON.stringify({cash:d,looks:SAVED,inv:window.invGet?invGet():[]}),'Backup copied');
    $('restore').onclick=()=>{const t=prompt('Paste your backup text');if(!t)return;try{const o=JSON.parse(t);if(!o||typeof o!=='object')throw 0;Object.assign(d,o.cash||{});if(Array.isArray(o.looks)){SAVED=o.looks.slice(0,12);persist()}if(Array.isArray(o.inv)&&window.invSet)invSet(o.inv);sv();location.reload()}catch(e){toast('Invalid backup')}};
    $('vadd').onclick=()=>{const n=$('vn').value.trim(),t=nn($('vt').value);if(!n||!t)return toast('Name and target needed');d.vaults.push({n:n.slice(0,24),t,s:0});$('vn').value=$('vt').value='';sv();render()};
    $('vaults').onclick=e=>{const D=e.target.dataset,i=D.va??D.vt??D.vd;if(i==null)return;const v=d.vaults[+i];if(!v)return;
        if(D.vd!=null){if(confirm('Delete vault '+v.n+'? The money stays in the bank.')){d.vaults.splice(+i,1);sv();render()}return}
        const a=nn(e.target.parentNode.querySelector('input').value),free=(+d.b||0)-vs();if(!a)return toast('Enter an amount');
        if(D.va!=null){if(a>free)return toast('Only '+$$(free)+' free in the bank');v.s+=a}else{if(a>v.s)return toast('Only '+$$(v.s)+' in this vault');v.s-=a}sv();render()};
    $('sb').onclick=()=>{const a=nn($('sa').value),n=$('sn').value.trim()||'Spending',w=+d.w||0,b=+d.b||0,src=$('ss').value;if(!a)return toast('Enter an amount');
        if(src==='w'){if(a>w)return toast('Only '+$$(w)+' cash on hand');d.w=w-a}else{if(a>b-vs())return toast('Only '+$$(b-vs())+' free in the bank');d.b=b-a}
        d.log.unshift({m:-2,a:-a,dw:src==='w'?-a:0,db:src==='b'?-a:0,t:Date.now(),note:n.slice(0,30)});$('wallet').value=d.w||'';$('sa').value=$('sn').value='';sv();render();toast('Logged '+$$(a)+' on '+n)};
    window.cashApi={nw:()=>(+d.w||0)+(+d.b||0),sell:(a,note)=>{d.w=(+d.w||0)+a;d.log.unshift({m:-3,a,dw:a,db:0,t:Date.now(),note});$('wallet').value=d.w||'';sv();render()}};
    window.cashRefresh=render;render()}
