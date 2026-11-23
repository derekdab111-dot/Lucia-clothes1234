/* data.js — Catalogs and shared helpers: clothing/hair/accessory lists, style notes. */
const $=id=>document.getElementById(id);
let BODYD;
const tops = {
    "white-crop":"White ribbed crop tank","black-crop":"Black fitted crop tank","grey-crop":"Heather grey crop tank",
    "pink-crop-ls":"Hot pink long-sleeve crop","coral-crop":"Coral long-sleeve crop top","teal-crop":"Turquoise sleeveless crop",
    "black-leather-bustier":"Black leather zip bustier","red-sequin-dress":"Red sequin plunging mini dress",
    "gold-sequin-cami":"Gold sequin spaghetti cami","silver-sequin":"Silver sequin mini dress","black-mesh-dress":"Black mesh cocktail dress",
    "pink-halter":"Hot pink halter mini dress","leopard-bikini":"Leopard print bikini top","orange-bikini":"Bright orange two-piece bikini",
    "black-bikini":"Black classic bikini","baddie-hoodie":"Grey BADDIE cropped hoodie","grey-zip-hoodie":"Grey zip-up cropped hoodie",
    "black-hoodie":"Black cropped hoodie","varsity-top":"Printed crop under varsity","zebra-mock":"Zebra-stripe cropped mock neck",
    "sports-bra-grey":"Heather grey racerback sports bra","sports-bra-black":"Black sports bra","eris-tank":"Eris brand athletic tank",
    "white-tee-knot":"White graphic tee knotted at waist","mauve-tee":"Mauve graphic tee knotted","red-crop-tee":"Red cropped graphic tee",
    "black-cami":"Black spaghetti strap cami","pink-cami":"Pink thin-strap camisole","brown-cami":"Brown soft cami top",
    "tie-front-tan":"Tan tie-front bikini top","lace-purple":"Purple lace top","mesh-black":"Black mesh long-sleeve top",
    "off-shoulder":"Off-shoulder faded tee","hi-vis":"High-visibility work vest","prison-orange":"Orange prison jumpsuit top",
    "leather-crop":"Black leather crop top","denim-vest":"Light denim vest","satin-magenta":"Magenta satin crop",
    "plaid-tied":"Red/cream plaid shirt tied at waist","stock305-tee":"Stock 305 logo tee (cropped)","souvenir-tee":"Leonida souvenir tee (knotted)","formal-halter":"Black satin formal halter dress","vice-pastel-crop":"Pastel mint cropped tank","swim-red":"Red one-piece swimsuit","goodtime-jersey":"Goodtime Gear mesh jersey crop","alpha-bra":"Alpha Sports compression bra","thrift-flannel":"Thrift-store flannel (tied)"
};
const bottoms = {
    "none":"— (dress / jumpsuit)","denim-dark":"Dark-wash cuffed denim shorts","denim-light":"Light-wash frayed cutoffs",
    "denim-black":"Black denim shorts","denim-mini":"Black frayed denim mini skirt","rust-mini":"Rust corduroy mini skirt",
    "suede-mini":"Rust suede mini skirt","leather-mini":"Black leather mini skirt","sequin-mini":"Matching sequin mini skirt",
    "black-leggings":"Black riding leggings","camo-skinny":"Blue-purple camo skinny pants","cargo-olive":"Olive baggy cargo pants",
    "cargo-black":"Black cargo pants","jeans-light":"Light-wash skinny jeans","jeans-dark":"Dark skinny jeans",
    "jeans-ripped":"Ripped mid-wash jeans","track-pants":"Black track pants with stripe","bike-shorts":"Black bike shorts",
    "leopard-sarong":"Leopard print wrap sarong","prison-pants":"Orange prison trousers","cargo-mini":"Cargo mini skirt",
    "pleated-mini":"Black pleated mini skirt","satin-shorts":"Satin sleep shorts","pastel-shorts":"Pastel mint shorts","yoga-black":"Black high-waist yoga pants","formal-slacks":"Black tailored trousers","mom-jeans":"Thrift high-waist mom jeans","alpha-shorts":"Alpha Sports running shorts","cover-sarong":"White beach sarong"
};
const outers = {
    "none":"None","leather-biker":"Black leather biker jacket","leather-brown":"Distressed brown leather jacket",
    "suede-rust":"Rust suede cropped jacket","leopard-fur":"Leopard faux-fur coat","varsity-pink":"Black varsity jacket (pink trim)",
    "varsity-classic":"Classic black/white varsity","denim-black":"Black denim jacket with patches","denim-light":"Light wash denim trucker",
    "bomber-black":"Black satin bomber","bomber-magenta":"Magenta embroidered bomber","track-olive":"Olive track jacket",
    "hoodie-open":"Open oversized hoodie","blazer-oxblood":"Deep oxblood cropped blazer","moto-brown":"Brown moto jacket",
    "fur-lime":"Lime faux-fur coat","windbreaker":"Neon windbreaker","vest-tactical":"Black tactical plate carrier","vest-denim":"Denim vest","goodtime-bomber":"Goodtime Gear satin bomber","linen-blazer":"Pastel linen blazer (Vice City)","trench-black":"Black belted trench"
};
const shoes = {
    "none":"Barefoot / not visible","tiger-boots":"Tiger-stripe knee-high stiletto boots","gold-heels":"Gold strappy high heels",
    "black-heels":"Black pointed heels","white-high":"White high-top sneakers","black-high":"Black high-top sneakers",
    "graffiti-high":"White graffiti-panel high-tops","ankle-black":"Black ankle boots","ankle-brown":"Brown ankle boots",
    "combat":"Black combat boots","sandals-gold":"Gold flat sandals","sandals-strappy":"Strappy gold sandals",
    "slides":"Black slides","running":"White running sneakers","platform":"Black platform boots","knee-black":"Black knee-high boots","mule":"Black heeled mules","platform-white":"White platform sneakers","jelly":"Clear jelly sandals","cowboy-white":"White cowboy boots","espadrille":"Espadrille wedges"
};
const accessories = {
    "gold-hoops":"Large gold hoop earrings + pendant","small-hoops":"Small gold hoop earrings","silver-hoops":"Silver hoop earrings",
    "thin-glasses":"Thin gold rectangular glasses","blue-glasses":"Chunky navy square glasses","aviators-gold":"Gold aviator sunglasses",
    "aviators-dark":"Dark aviator sunglasses","cat-eye-green":"Green-lens cat-eye shades","cat-eye-glitter":"Blue glitter cat-eye sunglasses",
    "wraparounds":"Cat-eye wraparound shades","bandana-red":"Red paisley bandana","bandana-black":"Black paisley bandana",
    "layered-gold":"Layered gold chains","layered-silver":"Layered silver chains","pendant-red":"Gold necklace with red gem",
    "pendant-simple":"Simple gold pendant","bracelet-gold":"Thin gold bracelet","watch-sport":"Black sport watch","none":"Minimal / none","cap-black":"Black snapback cap","bucket-white":"White bucket hat","choker":"Black choker","pearl":"Pearl necklace"
};
const hairs = {
    "blunt-bob":"Blunt Bob","braided-cornrows":"Braided Cornrows","design-buzz":"Design Buzz Cut (Ultimate Edition)","half-up-ponytail":"Half-Up Ponytail",
    "high-slicked-ponytail":"High Slicked Ponytail (Sara's Salon, Ultimate)","layered-shag":"Layered Shag with Bangs","long-waves":"Long Voluminous Waves",
    "messy-high-bun":"Messy High Bun","patterned-cornrows":"Patterned Cornrows (Ultimate Edition)","sleek-high-bun":"Sleek High Bun",
    "curly-afro":"Voluminous Curly Afro (Vintage Vice City Pack)","wolf-cut":"Wolf Cut"
};
const styleNotes = [
    "Classic Vice City nightlife energy — perfect for clubs and high-stakes nights.",
    "Street-ready and practical. Easy to move in during getaways.",
    "Ultimate Edition statement pieces. Police will remember this one.",
    "Casual Leonida heat. Blends into beach and daytime crowds.",
    "Full Bonnie & Clyde energy. Strong couple look with Jason.",
    "Gym-to-street transition. Shows her fighter background.",
    "Bold Florida-core. Prints and confidence define this era.",
    "Low-key but dangerous. Harder for the cops to describe.",
    "High fashion Leonida. Ferruccio Tucci / Nola vibes.",
    "Stock 305 elevated streetwear. Pure elevated drip."
];
