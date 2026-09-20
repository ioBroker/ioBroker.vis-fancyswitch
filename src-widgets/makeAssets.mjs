/*
 * Writes every SVG of the repository from `src/Components/fancyArt.ts`.
 *
 * The widget set had nine PNGs: six sprites for the switch styles, the iButton sprite, the adapter icon and the
 * overview of the README. They are all drawings, so they are generated here instead - one source for the vis-1
 * sprites, the palette previews of vis-2, the documentation and the icon, and nothing that goes blurry when a
 * widget is resized.
 *
 * Run with `npm run assets` in the root, or `node makeAssets.mjs` in this folder.
 *
 * `fancyArt.ts` is TypeScript, so it is bundled for node first - the same trick `checkWidgets.mjs` uses.
 */
import { build } from 'vite';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const TMP = path.join(HERE, '.assets');

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

await build({
    configFile: false,
    logLevel: 'error',
    build: {
        lib: {
            entry: path.join(HERE, 'src', 'Components', 'fancyArt.ts'),
            formats: ['cjs'],
            fileName: () => 'fancyArt.cjs',
        },
        outDir: TMP,
        emptyOutDir: false,
        minify: false,
    },
});

const art = await import(pathToFileURL(path.join(TMP, 'fancyArt.cjs')).href);
const { VARIANTS, switchSvg, switchSprite, iButtonSprite, iButtonSvg, toggleSvg, WIDTH, HEIGHT } = art.default || art;

const written = [];
function write(relative, content) {
    const file = path.join(ROOT, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
    written.push(relative);
}

/* -------------------------------------------------------------- the sprites the vis-1 widget set loads */

for (const [name, variant] of Object.entries(VARIANTS)) {
    // `fancyswitch1` -> `fancyswitch-1.svg`, the file name the vis-1 templates ask for
    write(`widgets/fancyswitch/img/${name.replace(/(\d)$/, '-$1')}.svg`, switchSprite(variant));
}
write('widgets/fancyswitch/img/ibutton-slider-default.svg', iButtonSprite());

/* ------------------------------------------------------------------- the previews of the vis-2 palette */

const PREVIEWS = {
    prev_switch1: () => switchSvg({ variant: VARIANTS.fancyswitch1, on: true, id: 'p' }),
    prev_switch2: () => switchSvg({ variant: VARIANTS.fancyswitch2, on: true, id: 'p' }),
    prev_dark_an_aus: () => switchSvg({ variant: VARIANTS.fancyswitch3, on: true, id: 'p' }),
    prev_dark_aus_an: () => switchSvg({ variant: VARIANTS.fancyswitch4, on: true, id: 'p' }),
    prev_rocker: () => switchSvg({ variant: VARIANTS.fancyswitch5, on: true, id: 'p' }),
    prev_ibutton: () => iButtonSvg({ on: true }),
    prev_toggleswitch: () => toggleSvg({ on: true }),
};
for (const [name, make] of Object.entries(PREVIEWS)) {
    write(`src-widgets/public/img/${name}.svg`, make());
}

/* ------------------------------------------------------------- the images of the README and of docs/ */

/** Puts several SVG documents next to each other, with a caption over every column */
function board(rows, options = {}) {
    const { gap = 18, padding = 16, captionHeight = 18, background = 'transparent', color = '#555555' } = options;
    const parts = [];
    let y = padding;
    let maxWidth = 0;

    for (const row of rows) {
        let x = padding;
        let rowHeight = 0;
        for (const cell of row) {
            const width = Number(/width="(\d+(?:\.\d+)?)"/.exec(cell.svg)[1]);
            const height = Number(/height="(\d+(?:\.\d+)?)"/.exec(cell.svg)[1]);
            const inner = cell.svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
            if (cell.caption) {
                parts.push(
                    `<text x="${x}" y="${y + 12}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="${color}">${cell.caption}</text>`,
                );
            }
            const top = y + (cell.caption ? captionHeight : 0);
            parts.push(`<g transform="translate(${x} ${top})">${inner}</g>`);
            x += width + gap;
            rowHeight = Math.max(rowHeight, height + (cell.caption ? captionHeight : 0));
            maxWidth = Math.max(maxWidth, x - gap + padding);
        }
        y += rowHeight + gap;
    }

    const height = y - gap + padding;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${height}" viewBox="0 0 ${maxWidth} ${height}">
${background === 'transparent' ? '' : `<rect x="0" y="0" width="${maxWidth}" height="${height}" fill="${background}"/>`}
${parts.join('\n')}
</svg>
`;
}

/** The two states of one style next to each other - what every chapter of the documentation shows */
function states(variant, id = 's') {
    return [
        { caption: 'OFF', svg: switchSvg({ variant, on: false, id: `${id}a` }) },
        { caption: 'ON', svg: switchSvg({ variant, on: true, id: `${id}b` }) },
    ];
}

const DOCS = {
    switch1: () => board([states(VARIANTS.fancyswitch1)]),
    switch2: () => board([states(VARIANTS.fancyswitch2)]),
    dark_an_aus: () => board([states(VARIANTS.fancyswitch3)]),
    dark_aus_an: () => board([states(VARIANTS.fancyswitch4)]),
    rocker: () => board([states(VARIANTS.fancyswitch5, 'd'), states(VARIANTS.fancyswitch6, 'l')]),
    ibutton: () =>
        board([
            [
                { caption: 'OFF', svg: iButtonSvg({ on: false, id: 'ia' }) },
                { caption: 'ON', svg: iButtonSvg({ on: true, id: 'ib' }) },
            ],
        ]),
    toggleswitch: () =>
        board([
            [
                { caption: 'OFF', svg: toggleSvg({ on: false, id: 'ta' }) },
                { caption: 'ON', svg: toggleSvg({ on: true, id: 'tb' }) },
            ],
        ]),
};
for (const [name, make] of Object.entries(DOCS)) {
    write(`docs/img/${name}.svg`, make());
}

/** All seven widgets at once - the picture of the README and the first one of the documentation */
const overview = board(
    [
        [
            { caption: 'Switch light', svg: switchSvg({ variant: VARIANTS.fancyswitch1, on: true, id: 'o1' }) },
            { caption: 'Slider dark', svg: switchSvg({ variant: VARIANTS.fancyswitch2, on: true, id: 'o2' }) },
            {
                caption: 'Slider dark ON/OFF',
                svg: switchSvg({ variant: VARIANTS.fancyswitch3, on: true, id: 'o3' }),
            },
        ],
        [
            {
                caption: 'Slider dark OFF/ON',
                svg: switchSvg({ variant: VARIANTS.fancyswitch4, on: true, id: 'o4' }),
            },
            { caption: 'Rocker', svg: switchSvg({ variant: VARIANTS.fancyswitch5, on: true, id: 'o5' }) },
            {
                caption: 'Rocker, light style',
                svg: switchSvg({ variant: VARIANTS.fancyswitch6, on: true, id: 'o6' }),
            },
        ],
        [
            { caption: 'Giva Labs iButton', svg: iButtonSvg({ on: true, id: 'o7' }) },
            { caption: 'Toggle switch', svg: toggleSvg({ on: true, id: 'o8' }) },
        ],
    ],
    { background: '#f7f7f7' },
);
write('img/widgets.svg', overview);
write('docs/img/overview.svg', overview);

/* ------------------------------------------------------------------------------ the adapter icon */

write(
    'admin/fancyswitch.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <title>fancyswitch</title>
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4a4a"/><stop offset="1" stop-color="#151515"/>
    </linearGradient>
    <linearGradient id="knob" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7d7d7d"/><stop offset="1" stop-color="#434343"/>
    </linearGradient>
    <linearGradient id="slot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0c0c"/><stop offset="1" stop-color="#202020"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
  </defs>

  <rect x="4" y="30" width="120" height="68" rx="14" fill="url(#frame)" stroke="#000000"/>
  <rect x="11" y="37" width="54" height="54" rx="9" fill="url(#slot)" stroke="#000000" stroke-opacity="0.8"/>
  <rect x="67" y="37" width="50" height="54" rx="9" fill="url(#knob)" stroke="#1b1b1b"/>
  <path d="M73 42h38" stroke="#9a9a9a" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/>

  <!-- the lit label of the "on" state, the look the dark styles have -->
  <g font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="bold" text-anchor="middle">
    <text x="38" y="74" fill="#00ccff" opacity="0.55" filter="url(#glow)">ON</text>
    <text x="38" y="74" fill="#00ccff">ON</text>
  </g>
</svg>
`,
);

rmSync(TMP, { recursive: true, force: true });
console.log(`${written.length} SVG files written:\n  ${written.join('\n  ')}`);
console.log(`\n(switch artwork is ${WIDTH}x${HEIGHT})`);
