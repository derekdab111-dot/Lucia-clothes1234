/* engine.js — SVG mannequin engine: body profiles, garment shapes, fabrics, hair, accessories, draw(). */
const M='transform="matrix(-1 0 0 1 300 0)"',DK='rgba(0,0,0,.3)';
const F=f=>f&&f[0]=='@'?`url(#${f.slice(1)})`:f;
const sym=(d,f,s=DK,w=.8,k=0,sh=1)=>{const o=d.replace(/Z\s*$/,''),g=(x,a)=>`<path d="${x}" ${a}/><path d="${x}" ${a} ${M}/>`;let r='';
    if(f!='none')r+=g(d,`fill="${f}" stroke="${f}" stroke-width=".7" stroke-linejoin="round"`)+(sh?g(d,'fill="url(#lit)"')+g(d,'fill="url(#litV)"'):'');
    if(s!='none')r+=g(k?d:o,`fill="none" stroke="${s}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`);return`<g>${r}</g>`};
        const SP=s=>Object.fromEntries(s.trim().split(/\s*;\s*/).map(r=>{const a=r.split('|');return[a[0],a.slice(1)]}));
const pat=(id,bg,a,b,z=6)=>`<pattern id="${id}" width="${z}" height="${z}" patternUnits="userSpaceOnUse"><rect width="${z}" height="${z}" fill="${bg}"/><circle cx="${z/4}" cy="${z/4}" r="1.1" fill="${a}"/><circle cx="${z*.75}" cy="${z*.75}" r="1.1" fill="${b}"/></pattern>`;
const str=(id,a,b)=>`<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="9" height="9" fill="${a}"/><rect width="4" height="9" fill="${b}"/></pattern>`;
const PATS=pat('sqR','#c4122c','#ff9aa8','#7a0a1a')+pat('sqS','#aeb4c4','#fff','#6a7088')+pat('sqG','#c9a02e','#fff3b0','#7a5a10')+pat('leo','#c98a3c','#2a1608','#6a3a10',9)+pat('msh','#17171d','#555560','#2a2a33',4)+str('zeb','#f4f4f4','#111')+str('tig','#e8861a','#1a1008')+'<pattern id="pld" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e8dcc8"/><rect width="4" height="10" fill="#c81e28cc"/><rect width="10" height="4" fill="#c81e28cc"/></pattern>';
const itp=(a,y)=>{if(y<=a[0][0])return a[0][1];for(let i=1;i<a.length;i++)if(y<=a[i][0]){const t=(y-a[i-1][0])/(a[i][0]-a[i-1][0]);return a[i-1][1]+(a[i][1]-a[i-1][1])*(1-Math.cos(t*Math.PI))/2}return a[a.length-1][1]};
const HW=[[112,35],[145,32],[178,25],[205,20.5],[235,33],[262,43],[292,38]],AO=[[110,113],[150,107],[205,96],[250,91],[300,87]],AI=[[135,129],[205,110],[300,98]],LO=[[262,107],[300,103],[345,107],[410,122],[445,121],[472,115],[505,120],[548,130]],LI=[[292,149],[330,147.5],[410,146.5],[470,144],[548,143]];
        const BD={bust:0,waist:0,hips:0,thighs:0,shoulders:0,arms:0,calves:0,tone:0,abdomen:0,head:0},gs=(y,c,w)=>Math.exp(-(((y-c)/w)**2)),
    adj=y=>BD.bust*1.6*gs(y,150,20)+BD.waist*1.6*gs(y,205,16)+BD.hips*1.9*gs(y,262,22)+BD.shoulders*1.4*gs(y,114,10)+BD.abdomen*1.5*gs(y,232,14),
    tx=(y,e=0)=>150-itp(HW,y)-adj(y)-e,ao=(y,e=0)=>itp(AO,y)-e-BD.shoulders*1.4*gs(y,125,28)-BD.arms*.8*gs(y,200,70),ai=(y,e=0)=>itp(AI,y)+e-BD.shoulders*1.4*gs(y,125,28)+BD.arms*.8*gs(y,200,70),
    lo=(y,e=0)=>itp(LO,y)-e-(y<290?BD.hips*1.9*gs(y,262,22):0)-BD.thighs*2.2*gs(y,330,50)-BD.calves*1.2*gs(y,455,25),li=(y,e=0)=>itp(LI,y)+e;
const E=(f,a,b,e=0,s=6)=>{const r=[];for(let y=a;y<b;y+=s)r.push([f(y,e),y]);r.push([f(b,e),b]);return r};
const Pt=a=>a.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L');
const AH=(x0,y0,x1,y1)=>{const r=[];for(let i=0;i<=8;i++){const t=i/8;r.push([x0+(x1-x0)*(1-Math.cos(t*Math.PI/2)),y0+(y1-y0)*t])}return r};
const mm=s=>s+s.replace(/\/>/g,` ${M}/>`);
const Lt=(c,k)=>'#'+[1,3,5].map(i=>Math.round(parseInt(c.substr(i,2),16)*(1-k)+255*k).toString(16).padStart(2,'0')).join('');
const GRAD='<linearGradient id="skH"><stop offset="0" style="stop-color:var(--s1)"/><stop offset=".5" style="stop-color:var(--s2)"/><stop offset="1" style="stop-color:var(--s3)"/></linearGradient>'+
    '<linearGradient id="lit"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".25" stop-color="#000" stop-opacity=".1"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient>'+
    '<linearGradient id="litV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>'+
    '<filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>'+
    '<filter id="ds" x="-15%" y="-8%" width="130%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.9 .45" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gg"/><feDropShadow in="SourceGraphic" dx="0" dy="1.4" stdDeviation="1.6" flood-color="#000" flood-opacity=".5" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="gg"/></feMerge></filter>'+
    '<filter id="vol" x="-5%" y="-3%" width="110%" height="106%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b"/><feDiffuseLighting in="b" surfaceScale="6" diffuseConstant="1.15" lighting-color="#fff" result="df"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting><feComposite in="SourceGraphic" in2="df" operator="arithmetic" k1="1.12" k2="0" k3="0" k4="0" result="lit"/><feSpecularLighting in="b" surfaceScale="5" specularConstant=".5" specularExponent="26" lighting-color="#fff" result="sp"><fePointLight x="70" y="110" z="170"/></feSpecularLighting><feComposite in="sp" in2="SourceAlpha" operator="in" result="sc"/><feComposite in="lit" in2="sc" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0"/></filter>'+
    '<radialGradient id="fl"><stop offset="0" stop-color="#6a45a8" stop-opacity=".75"/><stop offset="1" stop-color="#0f0a18" stop-opacity="0"/></radialGradient>',SKG='url(#skH)',SL='rgba(0,0,0,.2)';
const FT=(bx,xo,xi,e)=>` C${xo-2} 556,${bx-9-e} 562,${bx-8-e} 573C${bx-7-e} ${581+e},${bx+10+e} ${583+e},${bx+13+e} 574C${bx+14+e} 565,${xi-1} 555,${xi} 546`;
        const TP={crop:[116,141,134,142,190],cami:[122,142,139,150,214],bra:[124,141,132,150,168],bust:[126,0,0,132,200],vest:[112,141,134,140,236],dress:[124,142,136,148,340,20],swim:[122,142,136,148,300,0]};
const BP={sh:[352,2,0],mini:[338,2,18],pants:[548,2,0],tight:[548,.8,0],bike:[376,.8,0],sar:[402,2,28],cargo:[552,6,0]};
const SY={ankle:[506,2],knee:[420,3],high:[524,1.5],sneak:[544,1],slide:[546,1],heel:[546,1]};
function topP(t){const[nd,si,so,ay,hm,fl]=TP[t],e=1.6;let p=[[150,nd]];
    if(si){for(let i=1;i<=6;i++){const u=i/6;p.push([150+(si-150)*u,nd+(105-nd)*Math.pow(u,1.6)])}p.push([so,105]);p=p.concat(AH(so,105,tx(ay,e),ay))}else p.push([tx(ay,e),ay]);
    p=p.concat(E(tx,ay+6,Math.min(hm,262),e,6));
    if(t=='swim')p.push([134,284],[150,298]);
    else{if(hm>262){const x=tx(262,e);for(let y=268;y<=hm;y+=8)p.push([x-fl*(y-262)/(hm-262),y])}p.push([150,hm+(t=='dress'?3:0)])}
    return'M'+Pt(p)+'Z'}
function slP(t){const tee=t=='tee',len=tee?162:298,hm=tee?196:t=='jump'?262:190;
    let p=[[150,tee?116:112],[142,106],[131,103]].concat(E(ao,108,len,2.4,8),E(ai,138,len,2.4,8).reverse(),E(tx,144,hm,1.8,6));
    if(t=='jump')p=p.concat(E(lo,268,546,1.8,6),E(li,292,546,1.8,6).reverse(),[[150,296]]);else p.push([150,hm]);return'M'+Pt(p)+'Z'}
function botP(t){const[hm,e,fl]=BP[t];let p=[[150,213]].concat(E(tx,213,262,e,6));
    if(fl){const x=tx(262,e);for(let y=268;y<=hm;y+=8)p.push([x-fl*(y-262)/(hm-262),y]);p.push([150,hm+3])}
    else p=p.concat(E(lo,268,hm,e,6),E(li,292,hm,e,6).reverse(),[[150,296]]);return'M'+Pt(p)+'Z'}
function outP(t){const e=3.5;let p;
    if(t=='vs'||t=='vt')p=[[147,108],[132,103]].concat(AH(132,103,tx(150,e),150),E(tx,156,238,e,6),[[147,240]]);
    else{p=[[147,110],[130,103]].concat(E(ao,107,302,e,8),E(ai,148,302,e,8).reverse(),E(tx,150,t=='coat'?262:238,e,6));
        if(t=='coat'){const x=tx(262,e);for(let y=268;y<=332;y+=8)p.push([x-14*(y-262)/70,y]);p.push([147,336])}else p.push([147,240])}
    return'M'+Pt(p)+'Z'}
function shoeP(e,ya){return'M'+Pt(E(lo,ya,546,e,6))+FT(lo(546),lo(546,e),li(546,e),e)+'L'+Pt(E(li,ya,546,e,6).reverse())+'Z'}
        
const SPEC={
top:SP(`white-crop|crop|#f4f4f4;black-crop|crop|#1a1a1a;grey-crop|crop|#9a9aa5;pink-crop-ls|ls|#ff2d95;coral-crop|ls|#ff7a6b;teal-crop|crop|#1fc8c0;black-leather-bustier|bust|#16161a|#888;red-sequin-dress|dress|@sqR;gold-sequin-cami|cami|@sqG;silver-sequin|dress|@sqS;black-mesh-dress|dress|@msh;pink-halter|dress|#ff4da6;leopard-bikini|bik|@leo;orange-bikini|bik|#ff8a1f;black-bikini|bik|#111;baddie-hoodie|hd|#9a9aa5;grey-zip-hoodie|hd|#8a8a94;black-hoodie|hd|#1a1a1a;varsity-top|tee|#e8e0f5;zebra-mock|ls|@zeb;sports-bra-grey|bra|#9a9aa5;sports-bra-black|bra|#1a1a1a;eris-tank|crop|#3a3a48|#00f0ff;white-tee-knot|tee|#f4f4f4;mauve-tee|tee|#a87cae;red-crop-tee|tee|#d82b3a;black-cami|cami|#1a1a1a;pink-cami|cami|#ff8fc0;brown-cami|cami|#7a5236;tie-front-tan|bik|#c9a27a;lace-purple|ls|#7a3fa0;mesh-black|ls|@msh;off-shoulder|tee|#9aa0a8;hi-vis|vest|#e8ff2a|#d0d0d0;prison-orange|jump|#ff7a00;leather-crop|crop|#16161a;denim-vest|vest|#7fa3c9;satin-magenta|crop|#e0208a;plaid-tied|tee|@pld;stock305-tee|tee|#f4f4f4|#ff2d95;souvenir-tee|tee|#27c7c2;formal-halter|dress|#111|#c8c8d0;vice-pastel-crop|crop|#9ff0d4;swim-red|swim|#d82b3a;goodtime-jersey|tee|@msh|#ff2d95;alpha-bra|bra|#2a2a38|#00f0ff;thrift-flannel|tee|@pld`),
bottom:SP(`none|-;denim-dark|sh|#2c3f66;denim-light|sh|#8fb1d6;denim-black|sh|#1c1c22;denim-mini|mini|#1c1c22;rust-mini|mini|#b4562a;suede-mini|mini|#a8482a;leather-mini|mini|#14141a;sequin-mini|mini|@sqR;black-leggings|tight|#15151b;camo-skinny|tight|#4a3f9a;cargo-olive|cargo|#5f6b3a;cargo-black|cargo|#1c1c22;jeans-light|tight|#7fa0c9;jeans-dark|tight|#1f2c4a;jeans-ripped|tight|#5f82b0;track-pants|pants|#14141a|#fff;bike-shorts|bike|#15151b;leopard-sarong|sar|@leo;prison-pants|pants|#ff7a00;cargo-mini|mini|#5f6b3a;pleated-mini|mini|#15151b;satin-shorts|sh|#9b6fd0;yoga-black|tight|#15151b;pastel-shorts|sh|#9ff0d4;formal-slacks|pants|#15151b;mom-jeans|pants|#6f93c0;alpha-shorts|sh|#2a2a38|#00f0ff;cover-sarong|sar|#f4f4f4`),
outer:SP(`none|-;leather-biker|jk|#14141a|#c0c0c8;leather-brown|jk|#6a3d22;suede-rust|jk|#b4562a;leopard-fur|coat|@leo;varsity-pink|jk|#15151b|#ff4da6;varsity-classic|jk|#15151b|#f4f4f4;denim-black|jk|#1c1c22|#7a7a88;denim-light|jk|#8fb1d6;bomber-black|jk|#101015|#333;bomber-magenta|jk|#e0208a|#fff;track-olive|jk|#5f6b3a|#fff;hoodie-open|hj|#8a8a94;blazer-oxblood|jk|#5a1020|#222;moto-brown|jk|#5a3320|#bbb;fur-lime|coat|#b6ff2a;windbreaker|jk|#2af0b0|#ff2d95;vest-tactical|vt|#1a1a20|#555;vest-denim|vs|#7fa3c9;goodtime-bomber|jk|#101015|#00f0ff;linen-blazer|jk|#9ff0d4|#fff;trench-black|coat|#15151b|#555`),
shoes:SP(`none|-;tiger-boots|knee|@tig;black-heels|heel|#111;gold-heels|heel|#d8b24a;white-high|high|#f4f4f4|#ccc;black-high|high|#111|#f4f4f4;graffiti-high|high|#f4f4f4|#ff2d95;ankle-black|ankle|#111;ankle-brown|ankle|#6a3d22;combat|ankle|#111|#555;sandals-gold|sand|#d8b24a;sandals-strappy|sand|#d8b24a;slides|slide|#111;running|sneak|#f4f4f4|#00f0ff;platform|ankle|#111|#555;knee-black|knee|#111;mule|heel|#111;platform-white|sneak|#f4f4f4|#ff2d95;jelly|sand|#cfeeee;cowboy-white|ankle|#f4f4f4|#c8a060;espadrille|heel|#d8b86a`),
acc:SP(`gold-hoops|hoopP|#e6bd4a;small-hoops|hoop|#e6bd4a;silver-hoops|hoop|#d8d8e0;thin-glasses|glr|#e6bd4a|#cfe9ff44;blue-glasses|glr|#1a2a6a|#cfe9ff33;aviators-gold|gla|#e6bd4a|#281e0aaa;aviators-dark|gla|#222|#0a0a0acc;cat-eye-green|glc|#222|#28c878aa;cat-eye-glitter|glc|#2a6ad8|#468cffaa;wraparounds|glc|#111|#141414dd;bandana-red|band|#c4202e;bandana-black|band|#16161a;layered-gold|ch|#e6bd4a;layered-silver|ch|#d8d8e0;pendant-red|pd|#e6bd4a|#d82b3a;pendant-simple|pd|#e6bd4a;bracelet-gold|br|#e6bd4a;watch-sport|wt|#111;none|-;cap-black|cap|#16161a|#ff2d95;bucket-white|bkt|#f4f4f4;choker|chk|#16161a;pearl|prl|#f4efe6`),
hair:SP(`blunt-bob|bob|#1a100c;braided-cornrows|corn|#1a100c|250;design-buzz|buzzd|#1a100c;half-up-ponytail|hup|#2a1810|215;high-slicked-ponytail|pony|#1a100c|30;layered-shag|shag|#2a1810;long-waves|wave|#1a100c|250;messy-high-bun|mbun|#28201b;patterned-cornrows|pcorn|#1a100c|250;sleek-high-bun|bun|#1a100c|11;curly-afro|afro|#1a100c|1.12;wolf-cut|wolf|#2a1810`)};
const CAP='M150 25C131 25 121 40 123 64L129 61C130 52 138 46 150 45Z';
const ring=(rx,ry,r,n,a0,a1,cy=52)=>{let s='';for(let i=0;i<n;i++){const a=(a0+(a1-a0)*i/(n-1))*Math.PI/180;s+=`<circle cx="${(150+rx*Math.cos(a)).toFixed(1)}" cy="${(cy-ry*Math.sin(a)).toFixed(1)}" r="${r.toFixed(1)}"/>`}return s};
const st=(d,c,w,da='')=>`<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${da}"><path d="${d}"/><path d="${d}" ${M}/></g>`;
const strands=(n,y1)=>{let d='';for(let i=0;i<n;i++){const u=i/(n-1),xs=126+u*18,xe=108+u*16,ye=y1-(i%2)*16;d+=`M${xs.toFixed(1)} 44C${(xs-14).toFixed(1)} 70,${(xe-3).toFixed(1)} ${(ye*.55).toFixed(0)},${xe.toFixed(1)} ${ye}`}return d};
const shn=(d,c)=>`<g opacity=".4">${sym(d,'none',Lt(c,.5),1.2)}</g>`;
const BNG='<path d="M124 62C122 34 178 34 176 62C170 52 160 49 150 52C140 49 130 52 124 62Z" fill="%"/>';
const WAV=(c,p)=>sym(`M150 26C122 26 106 56 108 100C110 150 126 176 112 ${p-30}C106 ${p} 126 ${p+8} 140 ${p-6}L150 ${p-6}Z`,c)+shn(`M128 46C116 90 124 ${p/2|0} 122 ${p-46}`,c);
const BK=(c,d)=>sym(d,c)+shn(d.replace(/L[^]*$/,''),c);
const CO=(c,p,pt)=>['',sym(CAP,c)+st('M144 28C146 38 142 48 134 58M150 27C151 36 150 44 148 50',Lt(c,.35),1.2)+(pt?st('M146 28L141 36L146 42L140 50M138 30L132 36L136 44',Lt(c,.4),1.1):'')+st(strands(4,p),c,8,'7 2')];
const HR={bob:c=>[sym('M150 26C128 26 116 54 116 92C116 112 117 128 120 134L150 134Z',c),sym(CAP,c)],
    corn:(c,p)=>CO(c,p,0),pcorn:(c,p)=>CO(c,p,1),
    buzzd:c=>['',`<path d="M125 60C122 32 178 32 175 60C170 46 130 46 125 60Z" fill="${c}" opacity=".9"/>`+sym('M127 58C124 50 128 44 126 38M132 52C129 46 133 42 131 36','none','#d9a077',1.4)],
    hup:(c,p)=>[WAV(c,p)+`<path d="M150 32C170 6 200 30 198 84C192 62 178 46 158 42Z" fill="${c}"/>`,sym(CAP,c)+st('M127 60C124 80 128 96 124 112',c,4)],
    pony:(c,p)=>[`<path d="M150 34C178 2 214 36 ${206+p/4} ${110+p}C196 ${78+p/2} 176 54 156 46Z" fill="${c}"/>`,sym(CAP,c)],
    shag:c=>[BK(c,'M150 26C126 26 114 52 114 92C114 122 112 150 106 176L116 166L122 180L131 168L139 180L150 170Z'),sym(CAP,c)+BNG.replace('%',c)],
    wave:(c,p)=>[WAV(c,p),sym(CAP,c)],
    mbun:c=>[`<g fill="${c}"><circle cx="150" cy="20" r="14"/><circle cx="141" cy="25" r="9"/><circle cx="160" cy="26" r="9"/></g>`,sym(CAP,c)+st('M129 52C126 62 128 70 126 78',c,2.4)+st('M127 60C120 66 127 71 121 78C117 85 125 88 120 96',c,1.8)+st('M131 52C126 59 132 64 127 72C124 77 129 80 125 86',c,1.5)+st('M141 14C147 8 156 9 161 15',c,2)],
    bun:(c,p)=>[`<circle cx="150" cy="22" r="${p}" fill="${c}"/>`,sym(CAP,c)],
    afro:(c,p)=>[`<g fill="${c}">${ring(40*p,42*p,17*p,14,-20,200)}${ring(26*p,28*p,18*p,8,0,180,48)}<circle cx="150" cy="40" r="${28*p}"/></g>`,sym(CAP,c)],
    wolf:c=>[BK(c,'M150 24C120 24 104 54 108 96C110 130 108 160 102 204L114 190L120 208L130 192L140 210L150 196Z'),sym(CAP,c)+BNG.replace('%',c)+st('M126 50C122 62 124 74 120 86',c,3)]};
function topSVG(t,f,a){f=F(f);
    if(t=='bik')return sym('M150 131L139 127L132 143C134 153 142 157 150 151Z',f,a||DK)+sym('M139 127L137 106M132 143L120 152','none',f,1.3);
    if(['ls','hd','jump','tee'].includes(t))return sym(slP(t),f,a||DK)+(t=='hd'?sym('M150 97C140 97 131 100 129 108C134 115 143 113 150 112Z',f):'');
    return sym(topP(t),f,a||DK)}
function outSVG(t,f,a){f=F(f);let s=sym(outP(t=='hj'?'jk':t),f,DK,1,1);
    if(t!='vs'&&t!='vt')s+=mm('<path d="M101 128Q96 170 95 202" stroke="#fff" stroke-opacity=".13" fill="none" stroke-width="3.5" stroke-linecap="round"/><path d="M94 200Q101 195 112 201M96 218Q102 214 109 219" stroke="#000" stroke-opacity=".28" fill="none"/><path d="M124 160Q128 190 122 232" stroke="#000" stroke-opacity=".18" fill="none"/>');
    if(t=='hj')s+=sym('M150 95C139 95 130 99 128 108C134 116 143 113 150 112Z',f);
    if(t=='vt')s+=sym('M127 176H141V198H127Z','none',a,1);return s}
function shoeSVG(t,f,a){f=F(f);const x0=lo(546,0),sl=(x,c,w)=>sym(`M${x-8} 573C${x-7} 581,${x+10} 583,${x+13} 574`,'none',c,w);
    if(t=='sand')return sym(`M${x0-3} 560L${x0+14} 556M${x0-6} 568L${x0+13} 566M${x0+4} 546L${x0+8} 574`,'none',f,2)+sl(x0,f,2.6);
    const[ya,e]=SY[t],y0=lo(546,e);return sym(shoeP(e,ya),f,DK,.8,1)+(a&&t!='heel'?sl(y0,a,3):'')+(t=='heel'?sym(`M${y0+3} 579L${y0+4} 598L${y0+7} 598L${y0+8} 579Z`,f,DK,.8,1):'')}
let HT='translate(150 90) scale(1.18) translate(-150 -90)',hd=s=>`<g transform="${HT}">${s}</g>`;
function accSVG(t,c,d){const pd=g=>`<path d="M138 106Q150 134 162 106" stroke="${c}" fill="none" stroke-width="1.4"/><circle cx="150" cy="129" r="4" fill="${g||c}"/>`,
    gl=q=>hd(sym(q,d,c,1.6,0,0)+sym('M147 59H150M131 56L125 54','none',c,1.4)),hp=(r,y)=>hd(`<g fill="none" stroke="${c}" stroke-width="2"><circle cx="127" cy="${y}" r="${r}"/><circle cx="173" cy="${y}" r="${r}"/></g>`);
    return{hoopP:hp(8,76)+pd(),hoop:hp(5,72),glr:gl('M131 53H147V64H131Z'),gla:gl('M131 53H147L145 66C140 70 133 68 131 53Z'),glc:gl('M131 56L147 53L146 64C140 67 133 65 131 56Z'),
    band:hd(`<path d="M126 50C140 42 160 42 174 50L174 56C160 50 140 50 126 56Z" fill="${c}"/><path d="M170 50L186 42L183 59Z" fill="${c}"/>`),
    ch:`<g fill="none" stroke="${c}" stroke-width="1.4"><path d="M137 106Q150 130 163 106"/><path d="M134 108Q150 146 166 108"/></g>`,pd:pd(d),
    br:sym('M85 297H98','none',c,3),wt:sym('M85 292H98V302H85Z',c,'#444'),
    cap:hd(`<path d="M126 52C126 24 174 24 174 52Z" fill="${c}"/><path d="M126 52H188L183 59H126Z" fill="${d||c}"/>`),
    bkt:hd(`<ellipse cx="150" cy="51" rx="31" ry="6" fill="${c}" stroke="${DK}"/><path d="M129 50C129 28 171 28 171 50Z" fill="${c}" stroke="${DK}"/>`),
    chk:`<path d="M139 104Q150 114 161 104" stroke="${c}" fill="none" stroke-width="3"/>`,prl:`<path d="M137 106Q150 132 163 106" stroke="${c}" fill="none" stroke-width="4" stroke-dasharray="0 5" stroke-linecap="round"/>`}[t]||''}
function bodyBase(){const lg=`M${Pt([[150,262]].concat(E(lo,262,546,0,6)))}${FT(lo(546),lo(546),li(546),0)}L${Pt(E(li,292,546,0,6).reverse())}L150 296Z`,
    arm=`M${Pt([[126,105],[119,106],[114,109]].concat(E(ao,112,300,0,8),[[85,311],[86,325],[91,334],[97,328],[99,313]],E(ai,138,300,0,8).reverse()))}Z`,
    tor=`M${Pt([[150,104],[141,104],[128,106],[120,108]].concat(E(tx,112,292,0,6),[[150,294]]))}Z`,S=(d,f)=>sym(d,f,SL,.8,0,0);
    BODYD=[lg,tor,arm];return''+
    S(lg,SKG)+S(tor,SKG)+S(arm,SKG)+sym(topP('bra'),'#efe8e0')+sym(`M150 252L${Pt(E(tx,252,264,.6))}L128 290L150 300Z`,'#efe8e0')+
    mm('<ellipse cx="137" cy="145" rx="10" ry="8" fill="#fff" opacity=".13"/><path d="M144 107Q134 104 124 108" stroke="rgba(0,0,0,.2)" fill="none"/><path d="M149 178Q143 180 140 178M149 192Q142 194 139 192M149 205Q143 207 140 205" stroke="rgba(0,0,0,.13)" fill="none"/><path d="M130 410Q137 415 143 410" stroke="rgba(0,0,0,.15)" fill="none"/>')+
    '<path d="M150 172V214" stroke="rgba(0,0,0,.1)"/><ellipse cx="150" cy="226" rx="1.6" ry="2.4" fill="rgba(0,0,0,.25)"/>'+S('M150 80H144C144 94 143 100 136 108L150 112Z',SKG)+
    hd(mm('<ellipse cx="127" cy="62" rx="3" ry="6.5" fill="url(#skH)"/>')+S('M150 33C139 33 128 40 128 56C128 70 134 84 150 91Z',SKG)+
    mm('<path d="M133 58Q139 54 145 58Q139 61 133 58Z" fill="#fff"/><circle cx="139.5" cy="57.6" r="2.2" fill="#5a3820"/><path d="M132 58Q139 52.5 146 57" stroke="#1a0f0a" fill="none" stroke-width="1.2"/><path d="M132 51Q139 47 146 50" stroke="#120804" fill="none" stroke-width="3.3"/><ellipse cx="138" cy="70" rx="5" ry="3" fill="#e8735a" opacity=".16"/><path d="M147 70Q150 73 153 70" stroke="rgba(0,0,0,.3)" fill="none"/><circle cx="140.7" cy="56.8" r=".85" fill="#fff"/><path d="M149.2 62Q147.4 67 149.6 69.2" stroke="rgba(110,50,25,.4)" fill="none"/><path d="M133 62Q139 65 145 62" stroke="rgba(110,50,25,.18)" fill="none"/><ellipse cx="138" cy="48" rx="6" ry="2.2" fill="#fff" opacity=".1"/><path d="M132.5 58.5Q130.5 58 129.5 55.8" stroke="#120804" fill="none" stroke-width="1.3" stroke-linecap="round"/><path d="M132 55Q139 49 146 54" stroke="#5a2a1a" fill="none" stroke-width="2.2" opacity=".18"/><ellipse cx="133" cy="69" rx="3.2" ry="6" fill="#2b1004" opacity=".13"/><ellipse cx="137" cy="64" rx="4" ry="2" fill="#fff" opacity=".1"/><g fill="#8a4a28" opacity="0"><circle cx="135" cy="66" r=".55"/><circle cx="138.5" cy="68" r=".55"/><circle cx="142" cy="66.5" r=".55"/><circle cx="136" cy="69.5" r=".5"/><circle cx="141" cy="70.5" r=".5"/></g>')+
    '<path d="M142 79Q146 75.5 150 77Q154 75.5 158 79Q150 88 142 79Z" fill="#a8574a"/><path d="M146.5 80.6Q150 79.2 153.5 80.6" stroke="#fff" stroke-opacity=".35" fill="none"/>')}
const mix=(c,t,k)=>'#'+[1,3,5].map(i=>Math.round(parseInt(c.substr(i,2),16)*(1-k)+parseInt(t.substr(i,2),16)*k).toString(16).padStart(2,'0')).join('');
const SKINS={lucia:'#c68e66',caramel:'#c98f60',fair:'#f0c9a4',tan:'#d9a574',brown:'#9a6540',deep:'#6b4128'};
function setSkin(k){const c=SKINS[k]||SKINS.caramel,s=$('mq').style;s.setProperty('--s1',mix(c,'#000000',.2));s.setProperty('--s2',mix(c,'#ffffff',.1));s.setProperty('--s3',c)}
function body(){const b=bodyBase(),P=BODYD,e=(x,y,rx,ry,c,o)=>mm(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}"/>`),
    sd=(x,y,rx,ry,o=.3)=>e(x,y,rx,ry,'#2b1004',Math.min(.6,o*1.5)),hl=(x,y,rx,ry,o=.17)=>e(x,y,rx,ry,'#fff',Math.min(.42,o*1.8));
    const tn=BD.tone>0?mm(`<g fill="none" stroke="#2b1004" stroke-opacity="${(BD.tone*.05).toFixed(2)}" stroke-linecap="round"><path d="M142 183Q146 185 149.5 184M142 195Q146 197 149.5 196M142 207Q146 209 149.5 208"/><path d="M131 188Q135 204 134 222"/><path d="M136 318Q132 345 136 372"/><path d="M120 320Q117 350 122 376"/></g>`)+sd(141,196,2,13,BD.tone*.04):'';
    return b+`<clipPath id="bc">${P.map(d=>`<path d="${d}"/><path d="${d}" ${M}/>`).join('')}</clipPath><g clip-path="url(#bc)"><g filter="url(#bl)">`+
    `<ellipse cx="150" cy="101" rx="16" ry="8" fill="#2b1004" opacity=".5"/>`+sd(136,164,13,4,.32)+sd(126,170,6,30,.3)+sd(129,210,5,22,.28)+sd(147,330,3.5,46,.35)+sd(147,425,3,62,.3)+sd(106,285,3.5,30,.22)+
    hl(118,114,10,5)+hl(138,148,8,9,.2)+hl(122,277,8,16,.15)+hl(131,350,7,36)+hl(133,423,5.5,7,.2)+hl(135,484,4.5,24,.15)+hl(101,175,3.5,28,.15)+hl(93,252,3,22,.13)+hl(131,150,8,8,.24)+hl(112,262,7,16,.2)+hl(112,312,6,26,.22)+hl(122,468,4.5,16,.22)+sd(133,205,4,18,.26)+sd(150,262,6,14,.2)+sd(150,296,3,12,.3)+sd(128,160,5,6,.18)+tn+
    `</g><g opacity=".3">${P.map(d=>sym(d,'none','#ffd3b0',2.4,0,0)).join('')}</g></g>`}
const LAST={};
function swap(id,key,s){const e=document.getElementById(id);e.innerHTML=s;if(LAST[id]!==key){LAST[id]=key;e.classList.remove('sw');void e.getBoundingClientRect();e.classList.add('sw')}}
function draw(){const v=i=>document.getElementById(i).value,g=(s,k)=>SPEC[s][k]||['-'],
    T=g('top',v('top')),B=g('bottom',v('bottom')),O=g('outer',v('outer')),S=g('shoes',v('shoes')),A=g('acc',v('accessories')),H=g('hair',v('hair')),cover=T[0]=='dress'||T[0]=='jump',
    hc=v('hcolor'),hh=(HR[H[0]]||HR.bob)(hc=='default'?'#28201b':hc,+H[2]||0);setSkin(v('skin'));
    swap('Lhb','h'+v('hair')+hc,hh[0]);swap('Lhf','h'+v('hair')+hc,hh[1]);
    swap('Lbo','b'+v('bottom')+cover,B[0]=='-'||cover?'':sym(botP(B[0]),F(B[1]),B[2]||DK));
    swap('Lsh','s'+v('shoes'),S[0]=='-'?'':shoeSVG(...S));swap('Lto','t'+v('top'),topSVG(...T));
    swap('Lou','o'+v('outer'),O[0]=='-'?'':outSVG(...O));swap('Lac','a'+v('accessories'),A[0]=='-'?'':accSVG(...A))}
