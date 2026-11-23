# Lucia Outfit Lab

A fan-made **GTA 6** outfit builder for Lucia Caminos. Dress a live SVG mannequin, save and share looks, and keep track of your in-game cash and inventory. It is a static site: no build step, no dependencies, no backend.

> Not affiliated with Rockstar Games or Take-Two Interactive. See [Disclaimer](#disclaimer).

## Features

- **Live mannequin**: layered SVG with shading, fabric textures, parallax tilt and a "Body & Curves" editor (shoulders, waist, hips, muscle tone and more).
- **Hundreds of pieces**: tops, bottoms, outerwear, footwear, accessories, hair styles and colours, skin tones.
- **Quality of life**: undo/redo, lock a category while randomizing, 12 save slots, share link, PNG export, searchable catalog (click a piece to wear it), one-tap official-look presets.
- **Cash Hub**: wallet, bank and vaults, score log, spending log, outfit price tracker and a grind planner.
- **Inventory**: items, quantities, value, storage location, hot/stolen flag, CSV copy.
- **Mobile friendly**: sticky mannequin preview while you scroll the controls, 44px touch targets, no iOS focus-zoom, safe-area support.
- **Installable and offline**: works as a PWA (Add to Home Screen) via a small service worker.

Everything is stored in your own browser (`localStorage`). Nothing is sent anywhere. The only network request is the Google Fonts stylesheet.

## Run it

Just open `index.html`. Or serve the folder (needed for the offline/installable features):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder to a repository.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Pick your default branch and the `/ (root)` folder, then save.

The site appears at `https://<your-user>.github.io/<repo>/`. All paths are relative, so it works from a sub-path with no changes.

## Project structure

```
index.html              page markup
css/styles.css          theme and components
css/responsive.css      phone / tablet / touch rules (loaded last)
js/data.js              catalogs (labels) and the $ helper
js/engine.js            SVG engine: body profiles, garments, fabrics, hair, draw()
js/body.js              Body & Curves sliders and presets
js/inventory.js         inventory tracker
js/app.js               UI state: selects, history, saved looks, share, PNG export
js/cash.js              Cash Hub
js/catalog.js           official-look presets + searchable catalog
js/main.js              start-up and service-worker registration
images/                 gallery screenshots (+ small .webp versions for phones)
icons/                  favicon and app icons
manifest.webmanifest    PWA manifest
sw.js                   service worker (network-first, cache fallback)
```

The scripts are plain classic scripts that share one global scope and load **in the order listed** in `index.html`. There is no bundler or module system.

## Adding a clothing piece

A piece needs two entries:

1. **Label**: add `"my-key": "Display name"` to the matching object in `js/data.js` (`tops`, `bottoms`, `outers`, `shoes`, `accessories`, `hairs`).
2. **Drawing recipe**: add a row to the matching list in `SPEC` in `js/engine.js`. The format is `key|shape|fill|accent` (accent is optional), rows separated by `;`.

| Category | Shapes |
| --- | --- |
| `top` | `crop` `cami` `bra` `bust` `vest` `dress` `swim` `bik` `ls` `hd` `jump` `tee` |
| `bottom` | `sh` `mini` `pants` `tight` `bike` `sar` `cargo` |
| `outer` | `jk` `coat` `hj` `vs` `vt` |
| `shoes` | `ankle` `knee` `high` `sneak` `slide` `heel` `sand` |

`fill` is a hex colour, or `@name` for a pattern (for example `@leo`, `@zeb`, `@sqR`). Example: `teal-crop|crop|#1fc8c0`.

## Browser storage keys

`luciaLook`, `luciaSaved`, `luciaBody`, `luciaBodyP`, `luciaCash`, `luciaInv`. Clear them in your browser's site data to reset the app. The Cash Hub also has Backup / Restore buttons.

## Disclaimer

This is an unofficial fan project. *Grand Theft Auto*, *Lucia Caminos* and all related names and artwork are the property of Rockstar Games / Take-Two Interactive. The screenshots in `images/` are included for reference only; remove or replace them with your own images if you publish this repository and are asked to. The gallery hides any image that fails to load, so the app works without them.

## License

The source code is released under the [MIT License](LICENSE). The MIT license does **not** cover Rockstar's names, characters or screenshots.
