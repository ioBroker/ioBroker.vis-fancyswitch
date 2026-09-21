# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`iobroker.vis-fancyswitch` is a **widget set for ioBroker.vis and vis-2**, not a running adapter.
`io-package.json` declares `"mode": "none"`, `"onlyWWW": true`, `"type": "visualization-widgets"` — there is
**no Node.js runtime code**. Everything ships in `widgets/` and runs in the browser inside vis.

Every widget exists **twice**, with the same widget ids and the same attribute names:

|            | vis (vis-1)                                                   | vis-2                                            |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------ |
| source     | `widgets/fancyswitch.html` + `widgets/fancyswitch/` (by hand) | `src-widgets/src/*.tsx`                          |
| technique  | EJS templates, jQuery, jQuery UI, `jquery.ibutton`            | React + TypeScript, no third-party UI libs       |
| shipped as | the same files                                                | `widgets/vis-2-widgets-fancyswitch/` (generated) |

vis-2 loads both and **a React widget replaces the EJS widget of the same id**. That is the whole migration
mechanism, and it only works while three things hold:

1. `getWidgetInfo().id` equals the vis-1 `<script id="tplFancy…">`.
2. `getWidgetInfo().visSet` is `'fancyswitch'`.
3. Every attribute name of the vis-1 template still exists — widget data is stored per attribute name, so a
   renamed field silently drops the user's setting.

`npm run check-widgets` enforces all three.

## Commands

```bash
npm run build          # sync version into the vis-1 set, then npm i + tsc + vite build + copy to widgets/
npm run tsc            # type-check src-widgets only
npm run check-widgets  # validate the widget declarations against the vis-1 templates
npm run assets         # rewrite every SVG of the repository (see below)
npm run preview        # vite dev server with a stub of vis-2 - shows all widgets without an ioBroker
npm run lint           # eslint with @iobroker/eslint-config
npm test               # mocha --exit -> test/testPackageFiles.js (package/io-package validation)
npm run npm            # install in root and src-widgets
npm run release-patch  # release-script; runs lint before the check and build before the commit
```

`npm run build` must not be replaced by a plain vite build: `tasks.js` deletes **only**
`widgets/vis-2-widgets-fancyswitch` and `src-widgets/build`, never the whole `widgets/` folder — the vis-1 set
lives there and is maintained by hand.

### Version bumps

The version lives in `package.json`, `io-package.json` (both handled by `release-script`) plus the header
comment and the `version:` field of `vis.binds.fancyswitch` in `widgets/fancyswitch.html`. `tasks.js` rewrites
the latter two by regex from `package.json` on every build (`node tasks --version` does only that), so keep
those literals in a shape the regexes still match.

## Every image is generated (`src-widgets/src/Components/fancyArt.ts`)

The widget set used to ship nine PNGs. There are none left: `fancyArt.ts` builds the artwork as SVG **markup
strings**, and `src-widgets/makeAssets.mjs` (`npm run assets`) writes every static file from it:

- `widgets/fancyswitch/img/fancyswitch-{1..6}.svg` — the 213×46 sprites the **vis-1** templates load. The "on"
  state must stay at x=0 and the "off" state at x=108, because the vis-1 stylesheet flips between them with
  `background-position: left | right`.
- `widgets/fancyswitch/img/ibutton-slider-default.svg` — the 800×135 five-band sprite of
  `widgets/fancyswitch/css/jquery.ibutton.css`. Its band offsets (0, −27, −54, −81, −108) are hard-coded in that
  stylesheet.
- `src-widgets/public/img/prev_*.svg` — the previews of the vis-2 palette, referenced by `visPrev`.
- `docs/img/*.svg`, `img/widgets.svg` — the pictures of the documentation and of the README.
- `admin/fancyswitch.svg` — the adapter icon.

`makeAssets.mjs` bundles `fancyArt.ts` for node with vite first, the same trick `checkWidgets.mjs` uses.
**Re-run `npm run assets` after touching `fancyArt.ts`**, otherwise the generated files drift from the source.

Only sprites 2–4 are flat sliders (`SLIDER_SKIN`): one strip with a label slot on each side of the knob that
slides by one half behind the frame, so one label hides under the frame while the other comes out.

Sprites 1, 5 and 6 — `tplFancySwitch1` included — are **rockers** (`ROCKER_SKINS`): one key hinged in the middle
and seen from above. The pressed half lies flat; the other half stands up, so its top edge rises, a wedge of its
front face and its end face show and it casts a shadow, and its label is lifted and turned by 5°. Keep that 3D
look — the flat two-rectangle version was wrong. `rockerHalf()` draws one half as the left one with a `raise`
from 0 (flat) to 1 (standing); the right half is its mirror image (labels excluded). `tilt` (−1 left pressed … 1
right pressed, `rockerTilt()`) sets both halves, so every position in between can be drawn; 0 is the V-shaped
middle where both halves stand up half way.

The colours were measured in the original PNGs, which are still in git
(`git show e56f479^:widgets/fancyswitch/img/fancyswitch-1.png`). Two deviations are deliberate and commented: the
1 px brushed texture of the light switch became a plain gradient, and the light rocker lights its key with a
darker cyan than the unreadable `#6fffff` of the PNG.

## Architecture of the vis-2 widget set (`src-widgets/`)

Vite + `@module-federation/vite`, federation name `visFancySwitch`, remote entry `customWidgets.js`. The exposed
component names and the URL are repeated in `io-package.json` under `common.visWidgets.visFancySwitch` — adding a
widget means touching `vite.config.ts` (`exposes`) **and** that block **and** `checkWidgets.mjs`.

`moduleFederationShared(pack)` from `@iobroker/types-vis-2` filters the shared modules by the dependencies in
`src-widgets/package.json`. React and `react/jsx-runtime` must stay shared, otherwise vis-2's
`visWidgetSetCompatibility.ts` refuses to load the set. There is no MUI dependency on purpose: the widgets draw
their own look with `src/styles.css` and inline SVG.

`@swc/core` is pinned to `1.15.30` via `overrides` — `vite-plugin-top-level-await` fails on 1.16.

### Widget classes

Every widget extends `Generic` (`src/Generic.tsx`), which extends `window.visRxWidget` provided by the vis-2
runtime, and declares `getI18nPrefix() === 'vis_fancyswitch_'`. The JSON files under `src/i18n/` hold the keys
**without** the prefix and `src/translations.ts` adds it.

- `Components/FancySwitchBase.tsx` — the shared implementation of the five switch styles, the counterpart of the
  vis-1 `vis.binds.fancyswitch.fancyswitch`. Subclasses only override `getVariant()`; `switchAttrs()` builds
  their editor groups.
- `Components/FancySwitchArt.tsx` — wraps the markup of `fancyArt.ts` in a scaling `<svg>` and puts the two
  click zones on top. The sliders are a strip (slot | knob | slot) behind a clipped window; the widget asks for
  `animated` markup, which does **not** depend on the state, and sets `--fancy-slide` from `switchMotion()` on its
  `<g>`; `styles.css` transitions `.fancy-slide`. Keep that markup state-independent — if the string changes,
  React replaces the `innerHTML` and the strip jumps instead of sliding. A rocker changes its shape, which CSS
  cannot interpolate: `useTween()` moves its `tilt` over 300 ms and the markup is rebuilt for every frame. Both
  honour `prefers-reduced-motion`.
- `Components/IButton.tsx` — the Giva Labs iButton without jQuery. The geometry (handle = the _shorter_ label,
  bar = longer label + handle + 20, travel = width − handle − 6) is the one of the original plug-in; the look
  is CSS gradients in `styles.css`, not the sprite, because the handle has to follow the pointer.
- `Components/ToggleSwitch.tsx` — the Taitem toggle, drawn with the colours of the vis-2 theme instead of
  jQuery UI.

### Conventions that come from the vis-1 set

- **Attribute values arrive as strings.** `utils.ts` holds the coercions (`isTrue`, `toNumber`,
  `normalizeConfigured`, `isOn`); use them instead of comparing against `true`/`1` directly.
- **`isOn()` is the vis-1 rule**, with one documented exception: a boolean state is compared loosely against
  `valTrue`, because the original compared strictly and a `true` therefore never matched the default `'1'`.
- **Writes go through `this.props.context.setValue(oid, value)`.**
- Only `ToggleSwitch` follows the vis-2 theme (`Generic.getRootClass()` adds `fancy-rx-dark`). The switches and
  the iButton keep their colours in both themes — they are surfaces of the object itself, like a switch on a
  wall.

### `src-widgets/preview/` — the development page

`npm run preview` starts a vite dev server (port 4173) with a page that renders all widgets against a stub of
`VisRxWidget`. No ioBroker needed, and editing a widget hot-reloads it. The state values live in the page, so a
click on one widget moves every widget bound to the same object id. The text fields in the header override the
labels of all widgets (`text_false`/`text_true`, `labelOff`/`labelOn` for the iButton).

`preview/widgets.ts` exists because the widgets extend `window.visRxWidget`: `preview.tsx` puts the stub in
place first and then pulls that module in with a top-level `await import()`.

Not part of the widget set, excluded from lint, `dist/` is git-ignored. The config uses `strictPort: true` and
its own `cacheDir` — two vite servers sharing `node_modules/.vite` overwrite each other's optimized
dependencies and the page then loads blank without any error.

## The vis-1 widget set (`widgets/`)

Still shipped and still maintained by hand; only touch it for fixes that vis (vis-1) users need.

- `widgets/fancyswitch.html` — one `<script type="text/ejs" class="vis-tpl" id="tplFancy…">` per widget. The
  `data-vis-attrs` mini-DSL defines the editor fields (`;`-separated, `[default]`, `/type`). Attribute labels
  are translated through the `systemDictionary` at the top of the file.
- `widgets/fancyswitch/js/jquery.ibutton.min.js` and `js/jquery-ui.toggleSwitch.js` are vendored third-party
  copies (Giva Labs, Apache 2.0, and the Taitem toggle switch).
- `widgets/fancyswitch/css/jquery.ibutton*.css` reference the generated SVG sprite; both the readable and the
  minified file have to be changed together.

## Changelog

`README.md` carries the changelog; the release script moves the `### **WORK IN PROGRESS**` section into
`io-package.json` `common.news` with translations. Add entries as `- (author) description`.
