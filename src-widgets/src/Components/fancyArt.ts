/*
 * The artwork of the fancyswitch widgets, as SVG markup.
 *
 * The vis-1 widget set drew its switches with PNG sprites (`widgets/fancyswitch/img/fancyswitch-*.png`): one
 * 213x46 image per style, holding the "on" state in the left 105 px and the "off" state in the right 105 px. The
 * React widgets draw the same styles here instead, so they stay sharp at any size and the labels become settings
 * instead of baked-in pixels.
 *
 * Everything is returned as markup strings rather than JSX, because the same builders produce three things:
 *
 * 1. the inline SVG of the vis-2 widgets (`SliderSwitch` / `RockerSwitch` wrap the string),
 * 2. the palette previews in `public/img/`,
 * 3. the sprites the **vis-1** widget set still loads - `makeAssets.mjs` writes them with the geometry the old
 *    PNGs had, so the CSS of `widgets/fancyswitch.html` keeps working unchanged.
 *
 * The colours are the ones measured in the original PNGs; the 1 px brushed texture of the light style and the
 * blur of the cyan glow are the only things drawn differently, because they do not survive scaling.
 */

/** Width of one switch, the size the vis-1 widget had */
export const WIDTH = 105;
/** Height of one switch */
export const HEIGHT = 46;

export type SkinName = 'light' | 'dark';
export type Side = 'left' | 'right';

interface SliderSkin {
    /** frame around both halves, top -> bottom */
    frame: [string, string];
    frameStroke: string;
    /** the recessed half that shows the label */
    slot: [string, string];
    slotStroke: string;
    /** the raised half */
    knob: [string, string];
    knobStroke: string;
    knobHighlight: string;
    /** a label that is not lit */
    label: string;
    /** the label of the active state */
    labelActive: string;
    /** cyan glow under the lit label, as in the dark styles */
    glow: boolean;
}

interface RockerSkin {
    /** the raised half of the rocker */
    raised: [string, string];
    /** the half that is pressed down */
    pressed: [string, string];
    stroke: string;
    groove: string;
    label: string;
    labelActive: string;
    glow: boolean;
}

export const SLIDER_SKINS: Record<SkinName, SliderSkin> = {
    light: {
        frame: ['#efefef', '#cdcdcd'],
        frameStroke: '#a2a2a2',
        // a good bit darker than the knob - in the PNG the difference was a brushed texture that does not scale
        slot: ['#c6c6c6', '#aeaeae'],
        slotStroke: '#949494',
        knob: ['#fbfbfb', '#dddddd'],
        knobStroke: '#a8a8a8',
        knobHighlight: '#ffffff',
        label: '#6e6e6e',
        labelActive: '#3a3a3a',
        glow: false,
    },
    dark: {
        frame: ['#3f3f3f', '#1b1b1b'],
        frameStroke: '#0d0d0d',
        slot: ['#101010', '#202020'],
        slotStroke: '#000000',
        knob: ['#6e6e6e', '#434343'],
        knobStroke: '#161616',
        knobHighlight: '#8f8f8f',
        label: '#5c5c5c',
        labelActive: '#00ccff',
        glow: true,
    },
};

export const ROCKER_SKINS: Record<SkinName, RockerSkin> = {
    light: {
        raised: ['#dedede', '#9a9a9a'],
        pressed: ['#bdbdbd', '#8a8a8a'],
        stroke: '#5b5c5c',
        groove: '#6a6a6a',
        label: '#5f5f5f',
        // the PNG lit the light rocker with `#6fffff`, which is barely readable on grey - a darker cyan
        labelActive: '#00a8c8',
        glow: true,
    },
    dark: {
        raised: ['#767676', '#414141'],
        pressed: ['#4f4f4f', '#333333'],
        stroke: '#0e0f0f',
        groove: '#111111',
        label: '#1e1e1e',
        labelActive: '#00ccff',
        glow: true,
    },
};

/** One of the seven looks the widget set offers. The five switch styles map 1:1 onto the vis-1 PNG sprites. */
export interface SwitchVariant {
    kind: 'slider' | 'rocker';
    skin: SkinName;
    /** background behind the switch - only `tplFancySwitch2` sat on a dark panel */
    panel: string | null;
    /** text of the left half */
    labelLeft: string;
    /** text of the right half */
    labelRight: string;
    /** the half that stands for "on" */
    onSide: Side;
    /**
     * Where the raised knob sits. The light style puts it on the active half like a pressed button, the dark
     * slider styles push it to the other half so the label of the current state becomes visible.
     */
    knobOnActive: boolean;
}

export const VARIANTS: Record<string, SwitchVariant> = {
    // tplFancySwitch1 - "Switch light Off/On"
    fancyswitch1: {
        kind: 'slider',
        skin: 'light',
        panel: null,
        labelLeft: 'OFF',
        labelRight: 'ON',
        onSide: 'right',
        knobOnActive: true,
    },
    // tplFancySwitch2 - "Slider dark Off/On"
    fancyswitch2: {
        kind: 'slider',
        skin: 'dark',
        panel: '#303030',
        labelLeft: 'OFF',
        labelRight: 'ON',
        onSide: 'right',
        knobOnActive: false,
    },
    // tplFancyDarkAnAus - "Schieber dunkel Ein/Aus"
    fancyswitch3: {
        kind: 'slider',
        skin: 'dark',
        panel: null,
        labelLeft: 'EIN',
        labelRight: 'AUS',
        onSide: 'left',
        knobOnActive: false,
    },
    // tplFancyDarkAnAusRev - "Schieber dunkel Aus/Ein"
    fancyswitch4: {
        kind: 'slider',
        skin: 'dark',
        panel: null,
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
        knobOnActive: false,
    },
    // tplFancyDarkAnAusWippe - "Wippe dunkel Aus/Ein"
    fancyswitch5: {
        kind: 'rocker',
        skin: 'dark',
        panel: null,
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
        knobOnActive: false,
    },
    // tplFancyDarkAnAusWippe with `lightStyle` - the light rocker
    fancyswitch6: {
        kind: 'rocker',
        skin: 'light',
        panel: null,
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
        knobOnActive: false,
    },
};

const FONT = 'Arial, Helvetica, sans-serif';

const esc = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Vertical two stop gradient, the shape every surface of the original sprites had */
function vertical(id: string, from: string, to: string): string {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
}

function label(text: string, cx: number, y: number, color: string, glow: boolean, filter: string): string {
    if (!text) {
        return '';
    }
    const common = `x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="bold" letter-spacing="0.5"`;
    // The cyan labels of the dark styles sit in a lit recess - a blurred copy underneath is that halo
    const halo = glow
        ? `<text ${common} fill="${color}" opacity="0.55" filter="url(#${filter})">${esc(text)}</text>`
        : '';
    return `${halo}<text ${common} fill="${color}">${esc(text)}</text>`;
}

export interface SwitchOptions {
    variant: SwitchVariant;
    on: boolean;
    /** overrides `variant.labelLeft` */
    labelLeft?: string;
    /** overrides `variant.labelRight` */
    labelRight?: string;
    /** prefix of every gradient/filter id, so several switches on one page do not share their definitions */
    id: string;
}

/**
 * The four slider styles: a frame with two halves, one of them the raised knob, the other the recessed slot
 * that carries the label.
 */
function sliderBody(options: SwitchOptions): string {
    const { variant, on, id } = options;
    const skin = SLIDER_SKINS[variant.skin];
    const labelLeft = options.labelLeft ?? variant.labelLeft;
    const labelRight = options.labelRight ?? variant.labelRight;

    const activeSide: Side = on ? variant.onSide : variant.onSide === 'left' ? 'right' : 'left';
    const knobSide: Side = variant.knobOnActive ? activeSide : activeSide === 'left' ? 'right' : 'left';

    const half = (side: Side): { x: number; cx: number } =>
        side === 'left' ? { x: 5.5, cx: 28.5 } : { x: 53.5, cx: 76.5 };
    const knob = half(knobSide);
    const slot = half(knobSide === 'left' ? 'right' : 'left');

    const defs = [
        vertical(`${id}f`, skin.frame[0], skin.frame[1]),
        vertical(`${id}s`, skin.slot[0], skin.slot[1]),
        vertical(`${id}k`, skin.knob[0], skin.knob[1]),
        skin.glow
            ? `<filter id="${id}g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`
            : '',
    ].join('');

    /** the label of a half, only drawn when the knob does not cover it - unless the style keeps both visible */
    const texts: string[] = [];
    const drawLabel = (side: Side, text: string): void => {
        const covered = side === knobSide;
        if (covered && !variant.knobOnActive) {
            return;
        }
        const isActive = side === activeSide;
        const lit = isActive && side === variant.onSide;
        const color = variant.knobOnActive ? skin.labelActive : lit ? skin.labelActive : skin.label;
        texts.push(label(text, half(side).cx, 28.4, color, lit && skin.glow, `${id}g`));
    };
    drawLabel('left', labelLeft);
    drawLabel('right', labelRight);

    return `<defs>${defs}</defs>
${variant.panel ? `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${variant.panel}"/>` : ''}
<rect x="2.5" y="5.5" width="100" height="35" rx="6" fill="url(#${id}f)" stroke="${skin.frameStroke}"/>
<rect x="${slot.x}" y="8.5" width="46" height="29" rx="4" fill="url(#${id}s)" stroke="${skin.slotStroke}" stroke-opacity="0.85"/>
<rect x="${knob.x}" y="8.5" width="46" height="29" rx="4" fill="url(#${id}k)" stroke="${skin.knobStroke}"/>
<path d="M${knob.x + 2} 10.5h42" stroke="${skin.knobHighlight}" stroke-opacity="0.8" stroke-linecap="round"/>
${texts.join('\n')}`;
}

/**
 * The two rocker styles: two halves that both stay visible, separated by a groove. The active half is pressed
 * down, and the half that stands for "on" lights up while it is active.
 */
function rockerBody(options: SwitchOptions): string {
    const { variant, on, id } = options;
    const skin = ROCKER_SKINS[variant.skin];
    const labelLeft = options.labelLeft ?? variant.labelLeft;
    const labelRight = options.labelRight ?? variant.labelRight;

    const activeSide: Side = on ? variant.onSide : variant.onSide === 'left' ? 'right' : 'left';

    const defs = [
        vertical(`${id}r`, skin.raised[0], skin.raised[1]),
        vertical(`${id}p`, skin.pressed[0], skin.pressed[1]),
        skin.glow
            ? `<filter id="${id}g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`
            : '',
    ].join('');

    const halves = (['left', 'right'] as Side[]).map(side => {
        const pressed = side === activeSide;
        const x = side === 'left' ? 3.5 : 53.5;
        const cx = side === 'left' ? 28 : 77;
        const text = side === 'left' ? labelLeft : labelRight;
        const lit = pressed && side === variant.onSide;
        const color = lit ? skin.labelActive : skin.label;
        // the pressed half sits 1.5 px lower and loses its top highlight - that is the whole tilt of the rocker
        const y = pressed ? 7 : 5.5;
        const height = pressed ? 31.5 : 33;
        return `<rect x="${x}" y="${y}" width="48" height="${height}" rx="5" fill="url(#${id}${pressed ? 'p' : 'r'})" stroke="${skin.stroke}"/>
${pressed ? '' : `<path d="M${x + 3} ${y + 2}h42" stroke="#ffffff" stroke-opacity="0.35" stroke-linecap="round"/>`}
${label(text, cx, pressed ? 28.9 : 27.4, color, lit && skin.glow, `${id}g`)}`;
    });

    return `<defs>${defs}</defs>
${variant.panel ? `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${variant.panel}"/>` : ''}
<rect x="50.5" y="5.5" width="4" height="33" rx="1.5" fill="${skin.groove}"/>
${halves.join('\n')}`;
}

/** The content of an `<svg viewBox="0 0 105 46">` for one state of one style */
export function switchBody(options: SwitchOptions): string {
    return options.variant.kind === 'rocker' ? rockerBody(options) : sliderBody(options);
}

/** A standalone `<svg>` document with one state of one style, used for the palette previews */
export function switchSvg(options: SwitchOptions): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">\n${switchBody(options)}\n</svg>\n`;
}

/**
 * The 213x46 sprite the **vis-1** widget set loads: the "on" state at x=0, the "off" state at x=108. The
 * stylesheet flips between them with `background-position: left | right`, so the two offsets must not move.
 */
export function switchSprite(variant: SwitchVariant): string {
    const on = switchBody({ variant, on: true, id: 'a' });
    const off = switchBody({ variant, on: false, id: 'b' });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="213" height="${HEIGHT}" viewBox="0 0 213 ${HEIGHT}">
<g>${on}</g>
<g transform="translate(108 0)">${off}</g>
</svg>
`;
}

/** Geometry of the iButton, the defaults of `jquery.ibutton.css` */
export const IBUTTON = {
    width: 89,
    height: 27,
    handle: 33,
    get travel(): number {
        return this.width - this.handle - 6;
    },
};

/**
 * The iButton as a standalone `<svg>`, for the palette preview and the documentation.
 *
 * The widget itself draws the same look with the CSS gradients of `styles.css`, because its handle has to
 * follow the pointer; the geometry here is the one `IButton.tsx` uses.
 */
export function iButtonSvg(options: { on: boolean; labelOn?: string; labelOff?: string; id?: string }): string {
    const { width, height, handle, travel } = IBUTTON;
    const id = options.id || 'ib';
    const x = options.on ? travel : 0;
    const labelStyle = `font-family="'Helvetica Neue', Arial, Helvetica, sans-serif" font-size="17" font-weight="bold"`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
${vertical(`${id}on`, '#3061a8', '#8bbaf6')}
${vertical(`${id}off`, '#adadad', '#fdfdfd')}
${vertical(`${id}h`, '#e3e3e3', '#fcfcfc')}
<clipPath id="${id}c"><rect x="0" y="0" width="${width}" height="${height}" rx="3"/></clipPath>
</defs>
<g clip-path="url(#${id}c)">
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#${id}off)"/>
  <rect x="0" y="0" width="${x + 4}" height="${height}" fill="url(#${id}on)"/>
  <text x="${width - 8 + x}" y="19" text-anchor="end" ${labelStyle} fill="#7c7c7c">${esc(options.labelOff ?? 'OFF')}</text>
  <text x="${8 + x - travel}" y="19" ${labelStyle} fill="#ffffff">${esc(options.labelOn ?? 'ON')}</text>
  <rect x="${x + 0.5}" y="0.5" width="${handle - 1}" height="${height - 1}" rx="2.5" fill="url(#${id}h)" stroke="#a4a4a4"/>
</g>
</svg>
`;
}

/** Geometry of the toggle switch: the two labels, the track between them and its handle */
export const TOGGLE = { height: 30, track: 40, trackHeight: 11, knob: 17 };

/** The Taitem toggle switch as a standalone `<svg>`, for the palette preview and the documentation */
export function toggleSvg(options: {
    on: boolean;
    labelOn?: string;
    labelOff?: string;
    dark?: boolean;
    id?: string;
}): string {
    const id = options.id || 'tg';
    const labelOff = options.labelOff ?? 'OFF';
    const labelOn = options.labelOn ?? 'ON';
    const { height, track, trackHeight, knob } = TOGGLE;
    // 13 px bold Arial is about 7.3 px per upper case character - enough to lay out a preview
    const textWidth = (text: string): number => Math.max(14, text.length * 7.6 + 6);
    const trackX = textWidth(labelOff) + 6;
    const width = trackX + track + 6 + textWidth(labelOn);
    const cy = height / 2;
    const x = options.on ? trackX + track - knob : trackX;
    const color = options.dark ? '#c8cace' : '#333333';
    const active = options.dark ? '#ffffff' : '#1a1a1a';
    const font = `font-family="Arial, Helvetica, sans-serif" font-size="13"`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
${vertical(`${id}r`, '#6fa8dc', '#3d8bfd')}
${vertical(`${id}k`, '#ffffff', '#e4e4e4')}
</defs>
<text x="${textWidth(labelOff) / 2}" y="${cy + 4.5}" text-anchor="middle" ${font} fill="${options.on ? color : active}" font-weight="${options.on ? 'normal' : 'bold'}">${esc(labelOff)}</text>
<rect x="${trackX}" y="${cy - trackHeight / 2}" width="${track}" height="${trackHeight}" rx="4" fill="${options.dark ? '#2f3237' : '#f0f0f0'}" stroke="${options.dark ? '#4a4e55' : '#d3d3d3'}"/>
${options.on ? `<rect x="${trackX}" y="${cy - trackHeight / 2}" width="${track}" height="${trackHeight}" rx="4" fill="url(#${id}r)"/>` : ''}
<rect x="${x + 0.5}" y="${cy - knob / 2 + 0.5}" width="${knob - 1}" height="${knob - 1}" rx="3" fill="url(#${id}k)" stroke="#b8b8b8"/>
<text x="${trackX + track + 6 + textWidth(labelOn) / 2}" y="${cy + 4.5}" text-anchor="middle" ${font} fill="${options.on ? active : color}" font-weight="${options.on ? 'bold' : 'normal'}">${esc(labelOn)}</text>
</svg>
`;
}

/*
 * The sprite of the Giva Labs iButton (`widgets/fancyswitch/css/jquery.ibutton.css`).
 *
 * 800x135, five bands of 27 px that the stylesheet addresses by `background-position`:
 *   0     label background - blue for the left (on) half, grey for the right (off) half
 *   -27   the same, disabled
 *   -54   the handle
 *   -81   the handle, disabled
 *   -108  the handle while it is dragged
 * The vis-2 widget draws the same look with CSS gradients, this is only for vis-1.
 */
export function iButtonSprite(): string {
    const band = (y: number, id: string, from: string, to: string, mid?: [string, string]): string => {
        // the bands have a hard highlight break in their middle, the glossy look of the original sprite
        const middle = mid
            ? `<stop offset="0.5" stop-color="${mid[0]}"/><stop offset="0.52" stop-color="${mid[1]}"/>`
            : '';
        return `<linearGradient id="${id}" x1="0" y1="${y}" x2="0" y2="${y + 27}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${from}"/>${middle}<stop offset="1" stop-color="${to}"/></linearGradient>`;
    };

    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="135" viewBox="0 0 800 135">
<defs>
${band(0, 'on', '#3061a8', '#8bbaf6', ['#5c95e5', '#6aa2e9'])}
${band(0, 'off', '#adadad', '#fdfdfd', ['#e6e6e6', '#efefef'])}
${band(27, 'onD', '#acc0dc', '#d1e3fb', ['#bed5f5', '#c3daf6'])}
${band(27, 'offD', '#dedede', '#fefefe', ['#f5f5f5', '#f9f9f9'])}
${band(54, 'handle', '#ebeaea', '#fcfcfc')}
${band(81, 'handleD', '#f7f7f7', '#fefefe')}
${band(108, 'handleA', '#d5d4d4', '#e6e6e6')}
</defs>
<rect x="0" y="0" width="800" height="27" rx="3" fill="url(#off)"/>
<path d="M3 0h397v27H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z" fill="url(#on)"/>
<rect x="0" y="27" width="800" height="27" rx="3" fill="url(#offD)"/>
<path d="M3 27h397v27H3a3 3 0 0 1-3-3V30a3 3 0 0 1 3-3z" fill="url(#onD)"/>
<rect x="0.5" y="54.5" width="799" height="26" rx="2.5" fill="url(#handle)" stroke="#a4a4a4"/>
<rect x="0.5" y="81.5" width="799" height="26" rx="2.5" fill="url(#handleD)" stroke="#dbdbdb"/>
<rect x="0.5" y="108.5" width="799" height="26" rx="2.5" fill="url(#handleA)" stroke="#8e8e8e"/>
</svg>
`;
}
