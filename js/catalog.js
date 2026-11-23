/* catalog.js — Official-look presets and the searchable clothing catalog. */
const PRESETS=[{top:'white-crop',bottom:'jeans-dark',outer:'leather-biker',shoes:'ankle-black',accessories:'pendant-simple',hair:'long-waves'},{top:'red-sequin-dress',bottom:'none',outer:'none',shoes:'gold-heels',accessories:'gold-hoops',hair:'curly-afro'},{top:'leopard-bikini',bottom:'suede-mini',outer:'suede-rust',shoes:'tiger-boots',accessories:'thin-glasses',hair:'braided-cornrows'}];
function initPresets(){document.querySelectorAll('.outfit-card').forEach((c,i)=>{const P=PRESETS[i];if(!P)return;const b=document.createElement('button');b.type='button';b.className='btn-secondary try';b.textContent='Try this look';b.onclick=()=>{load(P);updateMannequin();generateOutfit();$('stage').scrollIntoView({block:'center',behavior:'smooth'})};c.append(b)})}

function buildDatabase() {
    const cats=[['Tops & Dresses',tops,'top'],['Bottoms',bottoms,'bottom'],['Outerwear',outers,'outer'],['Footwear',shoes,'shoes'],['Accessories',accessories,'accessories'],['Hair Styles',hairs,'hair']];
    $('dbGrid').innerHTML=cats.map(([t,d,id])=>`<div class="db-card"><h4>${t} (${Object.keys(d).length})</h4><ul>${Object.entries(d).map(([k,v])=>`<li tabindex="0" role="button" data-id="${id}" data-k="${k}">${v}</li>`).join('')}</ul></div>`).join('');
    const wear=e=>{const li=e.target.closest('li[data-k]');if(!li)return;$(li.dataset.id).value=li.dataset.k;updateMannequin();$('stage').scrollIntoView({block:'center',behavior:'smooth'})};
    $('dbGrid').onclick=wear;$('dbGrid').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();wear(e)}};
    $('dbFind').oninput=e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('#dbGrid li').forEach(l=>l.hidden=!!q&&!l.textContent.toLowerCase().includes(q))}
}
