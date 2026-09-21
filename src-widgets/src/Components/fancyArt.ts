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
 * 1. the inline SVG of the vis-2 widgets (`FancySwitchArt` wraps the string),
 * 2. the palette previews in `public/img/`,
 * 3. the sprites the **vis-1** widget set still loads - `makeAssets.mjs` writes them with the geometry the old
 *    PNGs had, so the CSS of `widgets/fancyswitch.html` keeps working unchanged.
 *
 * There are two kinds of switches. The **sliders** (sprites 2-4) are flat: a knob that covers one half of a slot.
 * The **rockers** (sprites 1, 5 and 6) are one key hinged in its middle and seen from above: the half of the
 * current state is pressed down, the other half stands up - its outer end lifts towards the viewer, shows its
 * end face and a wedge of its front face, and casts a shadow.
 *
 * The colours are the ones measured in the original PNGs; the 1 px brushed texture of the light switch and the
 * blur of the cyan glow are the only things drawn differently, because they do not survive scaling.
 */

/** Width of one switch, the size the vis-1 widget had */
export const WIDTH = 105;
/** Height of one switch */
export const HEIGHT = 46;

export type Side = 'left' | 'right';
export type RockerSkinName = 'white' | 'light' | 'dark';

const otherSide = (side: Side): Side => (side === 'left' ? 'right' : 'left');

interface SliderSkin {
    /** frame around both halves, top -> bottom */
    frame: [string, string];
    frameStroke: string;
    /** the recessed half that shows the label */
    slot: [string, string];
    slotStroke: string;
    /** the raised knob */
    knob: [string, string];
    knobStroke: string;
    knobHighlight: string;
    /** a label that is not lit */
    label: string;
    /** the label of the "on" state while it is visible */
    labelActive: string;
}

/** All three slider styles are dark */
export const SLIDER_SKIN: SliderSkin = {
    frame: ['#3f3f3f', '#1b1b1b'],
    frameStroke: '#0d0d0d',
    slot: ['#101010', '#202020'],
    slotStroke: '#000000',
    knob: ['#6e6e6e', '#434343'],
    knobStroke: '#161616',
    knobHighlight: '#8f8f8f',
    label: '#5c5c5c',
    labelActive: '#00ccff',
};

interface RockerSkin {
    /** top face of the pressed half, top -> bottom */
    pressed: [string, string];
    /** top face of the raised half, top -> bottom - it faces the light, so it is the brighter one */
    raised: [string, string];
    /** how much the raised face darkens towards the hinge, as the opacity of black laid over it */
    tilt: number;
    /** the end face the raised half shows at its outer end, top -> bottom */
    end: [string, string];
    /** the front face under the raised half, from its lifted edge down to the bottom line */
    front: [string, string];
    /** the strip of front face the pressed half shows along the bottom */
    lip: [string, string];
    stroke: string;
    /** the edges that catch the light */
    highlight: string;
    /** opacity of the highlight line along the top of the pressed half */
    highlightOpacity: number;
    /** opacity of the shadow the raised end casts */
    shadow: number;
    label: string;
    /** the label of the "on" half while it is pressed */
    labelActive: string;
    /** the "on" half lights up: glowing label, tinted outline */
    glow: boolean;
    /** outline of the lit half */
    glowStroke: string;
}

export const ROCKER_SKINS: Record<RockerSkinName, RockerSkin> = {
    // sprite 1, the bright switch of tplFancySwitch1 - it has no light, both labels stay grey
    white: {
        pressed: ['#ececec', '#d4d4d4'],
        raised: ['#e3e3e3', '#cbcbcb'],
        tilt: 0.04,
        end: ['#bdbdbd', '#999999'],
        front: ['#9c9c9c', '#303030'],
        lip: ['#7c7c7c', '#626262'],
        stroke: '#9a9a9a',
        highlight: '#ffffff',
        highlightOpacity: 0.6,
        shadow: 0.5,
        label: '#5c5c5c',
        labelActive: '#5c5c5c',
        glow: false,
        glowStroke: '#9a9a9a',
    },
    // sprite 6, tplFancyDarkAnAusWippe with `lightStyle`
    light: {
        pressed: ['#bfbfbf', '#959595'],
        raised: ['#c8c8c8', '#a1a1a1'],
        tilt: 0.1,
        end: ['#8f8f8f', '#858585'],
        front: ['#858585', '#5a5a5a'],
        lip: ['#5c5c5c', '#666666'],
        stroke: '#5b5c5c',
        highlight: '#f4f4f4',
        highlightOpacity: 0.7,
        shadow: 0.45,
        label: '#6e6e6e',
        // the PNG lit the light rocker with `#6fffff`, which is barely readable on grey - a darker cyan
        labelActive: '#00a8c8',
        glow: true,
        glowStroke: '#5f98a6',
    },
    // sprite 5, tplFancyDarkAnAusWippe
    dark: {
        pressed: ['#5e5e5e', '#3d3d3d'],
        raised: ['#646464', '#464646'],
        tilt: 0.15,
        end: ['#3a3a3a', '#303030'],
        front: ['#2a2a2a', '#141414'],
        lip: ['#0d0d0d', '#151515'],
        stroke: '#0e0f0f',
        highlight: '#8c8c8c',
        highlightOpacity: 0.35,
        shadow: 0.6,
        label: '#262626',
        labelActive: '#00ccff',
        glow: true,
        glowStroke: '#11505e',
    },
};

interface VariantBase {
    /** text of the left half */
    labelLeft: string;
    /** text of the right half */
    labelRight: string;
    /** the half that stands for "on" */
    onSide: Side;
}

/** A knob that slides over a slot and covers the label of the other state */
export interface SliderVariant extends VariantBase {
    kind: 'slider';
    /** background behind the switch - only `tplFancySwitch2` sat on a dark panel */
    panel: string | null;
}

/** A key hinged in its middle; the half of the current state is pressed down */
export interface RockerVariant extends VariantBase {
    kind: 'rocker';
    skin: RockerSkinName;
}

/** One of the six looks of the switch styles, each one a vis-1 PNG sprite */
export type SwitchVariant = SliderVariant | RockerVariant;

export const VARIANTS: Record<string, SwitchVariant> = {
    // tplFancySwitch1 - "Switch light Off/On"
    fancyswitch1: {
        kind: 'rocker',
        skin: 'white',
        labelLeft: 'OFF',
        labelRight: 'ON',
        onSide: 'right',
    },
    // tplFancySwitch2 - "Slider dark Off/On"
    fancyswitch2: {
        kind: 'slider',
        panel: '#303030',
        labelLeft: 'OFF',
        labelRight: 'ON',
        onSide: 'right',
    },
    // tplFancyDarkAnAus - "Schieber dunkel Ein/Aus"
    fancyswitch3: {
        kind: 'slider',
        panel: null,
        labelLeft: 'EIN',
        labelRight: 'AUS',
        onSide: 'left',
    },
    // tplFancyDarkAnAusRev - "Schieber dunkel Aus/Ein"
    fancyswitch4: {
        kind: 'slider',
        panel: null,
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
    },
    // tplFancyDarkAnAusWippe - "Wippe dunkel Aus/Ein"
    fancyswitch5: {
        kind: 'rocker',
        skin: 'dark',
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
    },
    // tplFancyDarkAnAusWippe with `lightStyle` - the light rocker
    fancyswitch6: {
        kind: 'rocker',
        skin: 'light',
        labelLeft: 'AUS',
        labelRight: 'EIN',
        onSide: 'right',
    },
};

const FONT = 'Arial, Helvetica, sans-serif';

const esc = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Vertical two stop gradient, the shape every surface of the original sprites had */
function vertical(id: string, from: string, to: string): string {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
}

/** The blur under a lit label */
const glowFilter = (id: string): string =>
    `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`;

function label(
    text: string,
    cx: number,
    y: number,
    color: string,
    glow: boolean,
    filter: string,
    fontSize = 15,
    transform = '',
): string {
    if (!text) {
        return '';
    }
    const common = `x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${fontSize}" font-weight="bold" letter-spacing="0.5"`;
    // The cyan labels of the dark styles sit in a lit recess - a blurred copy underneath is that halo
    const halo = glow
        ? `<text ${common} fill="${color}" opacity="0.55" filter="url(#${filter})">${esc(text)}</text>`
        : '';
    const body = `${halo}<text ${common} fill="${color}">${esc(text)}</text>`;
    return transform ? `<g transform="${transform}">${body}</g>` : body;
}

type Point = [x: number, y: number, radius?: number];

/**
 * A path through `points`. A corner with a radius is cut off by that radius along both of its edges and bent
 * back with a quadratic curve - the rounded corners of a key that is not a rectangle any more.
 */
function roundedPath(points: Point[], closed: boolean): string {
    const n = (v: number): number => Math.round(v * 100) / 100;
    const toward = (from: Point, to: Point, distance: number): [number, number] => {
        const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
        const k = Math.min(distance, length / 2) / length;
        return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
    };

    let d = '';
    points.forEach((point, i) => {
        const [x, y, radius] = point;
        const first = i === 0;
        const last = i === points.length - 1;
        if (!radius || (!closed && (first || last))) {
            d += `${first ? 'M' : 'L'}${n(x)} ${n(y)}`;
            return;
        }
        const previous = points[(i - 1 + points.length) % points.length];
        const next = points[(i + 1) % points.length];
        const [ax, ay] = toward(point, previous, radius);
        const [bx, by] = toward(point, next, radius);
        d += `${first ? 'M' : 'L'}${n(ax)} ${n(ay)}Q${n(x)} ${n(y)} ${n(bx)} ${n(by)}`;
    });
    return closed ? `${d}Z` : d;
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
    /**
     * For the widget: the moving parts take their position from the CSS custom properties `switchMotion()`
     * returns instead of from `on`. The markup then stays the same when the state changes, and a CSS transition
     * animates the move. The static files (sprites, previews) leave it off and get a fixed position.
     */
    animated?: boolean;
    /**
     * Rockers only: draws the key in this position instead of the one of `on` - from -1 (left half pressed) to 1
     * (right half pressed), see `rockerTilt()`. The widget animates the key by drawing the frames in between.
     */
    tilt?: number;
}

/** The slider: one slot (`SLIDER.slot` wide) per label and the knob between them, `SLIDER.step` apart */
const SLIDER = { x: 5.5, y: 8.5, slot: 46, height: 29, step: 48 };

/** How far the strip of a slider is pushed: 0 shows the left label, `-step` the right one */
function sliderOffset(variant: SliderVariant, on: boolean): number {
    const shownSide: Side = on ? variant.onSide : otherSide(variant.onSide);
    return shownSide === 'left' ? 0 : -SLIDER.step;
}

/**
 * The CSS custom properties that put the moving parts of an `animated` switch into the position of `on`. Only
 * the sliders move this way; a rocker changes its shape and is drawn frame by frame with `tilt` instead.
 */
export function switchMotion(variant: SwitchVariant, on: boolean): Record<string, string> {
    return variant.kind === 'slider' ? { '--fancy-slide': `${sliderOffset(variant, on)}px` } : {};
}

/**
 * The three slider styles: a frame with a window, and behind it a strip of three parts - the slot with the left
 * label, the raised knob, the slot with the right label. The strip slides by one half, so the knob covers the
 * middle of the window and one label disappears under the frame while the other one comes out.
 *
 * The "on" label is always lit; when it is visible, the switch is on.
 */
function sliderBody(options: SwitchOptions, variant: SliderVariant): string {
    const { on, id } = options;
    const skin = SLIDER_SKIN;
    const labelLeft = options.labelLeft ?? variant.labelLeft;
    const labelRight = options.labelRight ?? variant.labelRight;
    const { x, y, slot, height, step } = SLIDER;

    const offset = sliderOffset(variant, on);
    // CSS lengths in `px` are user units inside an SVG, so the variable moves the strip in the drawing's units
    const position = options.animated
        ? 'class="fancy-slide" style="transform: translateX(var(--fancy-slide, 0px))"'
        : offset
          ? `transform="translate(${offset} 0)"`
          : '';

    const labelSlot = (left: number, text: string, lit: boolean): string =>
        `<rect x="${left}" y="${y}" width="${slot}" height="${height}" rx="4" fill="url(#${id}s)" stroke="${skin.slotStroke}" stroke-opacity="0.85"/>
${label(text, left + slot / 2, 28.4, lit ? skin.labelActive : skin.label, lit, `${id}g`)}`;

    return `<defs>${vertical(`${id}f`, skin.frame[0], skin.frame[1])}${vertical(`${id}s`, skin.slot[0], skin.slot[1])}${vertical(`${id}k`, skin.knob[0], skin.knob[1])}${glowFilter(`${id}g`)}<clipPath id="${id}w"><rect x="4.5" y="6" width="96" height="34" rx="4"/></clipPath></defs>
${variant.panel ? `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${variant.panel}"/>` : ''}
<rect x="2.5" y="5.5" width="100" height="35" rx="6" fill="url(#${id}f)" stroke="${skin.frameStroke}"/>
<g clip-path="url(#${id}w)"><g ${position}>
${labelSlot(x, labelLeft, variant.onSide === 'left')}
<rect x="${x + step}" y="${y}" width="${slot}" height="${height}" rx="4" fill="url(#${id}k)" stroke="${skin.knobStroke}"/>
<path d="M${x + step + 2} ${y + 2}h42" stroke="${skin.knobHighlight}" stroke-opacity="0.8" stroke-linecap="round"/>
${labelSlot(x + 2 * step, labelRight, variant.onSide === 'right')}
</g></g>`;
}

/**
 * Where the rocker is drawn, measured in the PNGs. The outlines run on half pixels, so the 1:1 sprite of vis-1
 * stays crisp. Every half is drawn as the **left** one; the right half is its mirror image.
 */
const ROCKER = {
    left: 4.5,
    right: 100.5,
    top: 3.5,
    bottom: 35.5,
    /** the hinge, in the middle of the body */
    pivot: 52.5,
    radius: 3,
    /** the outer end of a half that stands up: the ridge between its end face and its top face */
    ridge: 8.5,
    /** ... and of a half that lies flat - there the "ridge" only cuts off the top corner */
    ridgeFlat: 6.5,
    /** how far the top edge of the outer end comes up */
    lift: 2,
    /** the front edge of the top face at the outer end of a standing half, and at the hinge */
    frontEnd: 29.5,
    frontPivot: 33.5,
    /** the labels: baseline and distance from the middle of the half, flat and standing, and the turn */
    baseline: 25,
    raisedBaseline: 22.5,
    labelOut: 3.5,
    raisedLabelOut: 1,
    tiltAngle: 5,
    fontSize: 14,
};

/** Rounds a coordinate, so the markup of an animation frame does not carry 15 decimals */
const round = (v: number): number => Math.round(v * 100) / 100;

/** Linear interpolation from `a` (at 0) to `b` (at 1) */
const mix = (a: number, b: number, k: number): number => round(a + (b - a) * k);

/**
 * Where the key of a rocker stands for a state: -1 with the left half pressed down, 1 with the right one. The
 * widget animates between the two; 0 is the middle, where both halves stand up a little.
 */
export function rockerTilt(variant: SwitchVariant, on: boolean): number {
    const pressedSide: Side = on ? variant.onSide : otherSide(variant.onSide);
    return pressedSide === 'left' ? -1 : 1;
}

/**
 * One half of a rocker, drawn as the left one. `raise` is 0 when it lies flat and 1 when it stands up fully;
 * everything in between is interpolated, so the key can move through all positions. `lit` (0..1) is how much the
 * outline of the "on" half glows.
 */
function rockerHalf(skin: RockerSkin, id: string, raise: number, lit: number): string {
    const { left, top, bottom, pivot, radius, lift, frontEnd, frontPivot } = ROCKER;
    // one half pixel past the hinge, so no seam of the background shows between the halves
    const hinge = pivot + 0.5;
    const ridge = mix(ROCKER.ridgeFlat, ROCKER.ridge, raise);
    const topY = mix(top, top - lift, raise);
    const frontY = mix(frontPivot, frontEnd, raise);
    // the faces that only a standing half shows come in quickly, the flat look fades out with the same pace
    const shown = round(Math.min(1, raise * 3));

    const hingeTop: Point = [hinge, top];
    const endTop: Point = [ridge, topY, 1];
    const cornerTop: Point = [left, mix(top + 2, top + 1, raise), 1.5];
    const cornerBottom: Point = [left, bottom, radius];
    const hingeBottom: Point = [hinge, bottom];
    const endFront: Point = [ridge, frontY];
    const endBottom: Point = [left, round(frontY + raise)];
    const hingeFront: Point = [hinge, frontPivot];
    const outline = roundedPath([hingeTop, endTop, cornerTop, cornerBottom, hingeBottom], false);
    const silhouette = roundedPath([hingeTop, endTop, cornerTop, cornerBottom, hingeBottom], true);
    const topFace = roundedPath([hingeTop, endTop, endFront, hingeFront], true);

    const parts: string[] = [];
    if (raise > 0) {
        const shadow = `M${left + 1} ${bottom}L${pivot - 6} ${bottom}L${left + 4} ${mix(bottom, bottom + 6.5, raise)}L${left + 1} ${mix(bottom, bottom + 5, raise)}Z`;
        parts.push(
            `<path d="${shadow}" fill="#000000" opacity="${round(skin.shadow * raise)}" filter="url(#${id}s)"/>`,
        );
    }
    parts.push(`<path d="${silhouette}" fill="url(#${id}p)"/>`);
    if (raise > 0) {
        parts.push(`<path d="${silhouette}" fill="url(#${id}r)" opacity="${round(raise)}"/>`);
        parts.push(`<path d="${topFace}" fill="url(#${id}t)" opacity="${round(raise)}"/>`);
    }
    parts.push(
        `<path d="${roundedPath([hingeFront, [left, frontPivot], [left, bottom, radius], hingeBottom], true)}" fill="url(#${id}l)"/>`,
    );
    if (raise > 0) {
        parts.push(
            `<path d="${roundedPath([hingeFront, endFront, endBottom, cornerBottom, hingeBottom], true)}" fill="url(#${id}f)" opacity="${shown}"/>`,
            `<path d="${roundedPath([endTop, cornerTop, endBottom, endFront], true)}" fill="url(#${id}e)" opacity="${shown}"/>`,
            `<path d="M${ridge} ${round(topY + 1)}V${frontY}" stroke="${skin.highlight}" stroke-opacity="${round(0.6 * shown)}"/>`,
        );
    }
    if (raise < 1) {
        parts.push(
            `<path d="M${hinge} ${top + 2}H${left + 2.5}" stroke="${skin.highlight}" stroke-opacity="${round(skin.highlightOpacity * (1 - shown))}"/>`,
        );
    }
    parts.push(`<path d="${outline}" fill="none" stroke="${skin.stroke}"/>`);
    if (lit > 0) {
        parts.push(`<path d="${outline}" fill="none" stroke="${skin.glowStroke}" stroke-opacity="${round(lit)}"/>`);
    }
    if (raise > 0) {
        parts.push(
            `<path d="M${hinge} ${top}L${ridge} ${topY}" stroke="url(#${id}h)" stroke-opacity="${round(raise)}"/>`,
        );
    }
    return parts.join('\n');
}

/**
 * The two rocker styles and the light switch: one key hinged in its middle, seen from above.
 *
 * The half of the current state is pressed down and lies flat. The other half stands up: its outer end comes
 * towards the viewer, so its top edge rises a little, its front edge rises more and uncovers a wedge of the front
 * face, the end face becomes visible and a shadow falls below it. Its label is lifted and turned with it.
 *
 * On the way from one state to the other the key passes the middle, where both halves stand up half way - the
 * V a rocker has at rest. The "on" half glows only while it is pressed down more than half.
 */
function rockerBody(options: SwitchOptions, variant: RockerVariant): string {
    const { id } = options;
    const skin = ROCKER_SKINS[variant.skin];
    const labelLeft = options.labelLeft ?? variant.labelLeft;
    const labelRight = options.labelRight ?? variant.labelRight;
    const { left, right, bottom, pivot, ridge, frontEnd, frontPivot } = ROCKER;

    const tilt = Math.max(-1, Math.min(1, options.tilt ?? rockerTilt(variant, options.on)));
    const raise = (side: Side): number => round(side === 'left' ? (1 + tilt) / 2 : (1 - tilt) / 2);
    const lit = (side: Side): number =>
        skin.glow && side === variant.onSide ? round(Math.max(0, 1 - 2 * raise(side))) : 0;

    const defs = [
        vertical(`${id}p`, skin.pressed[0], skin.pressed[1]),
        vertical(`${id}r`, skin.raised[0], skin.raised[1]),
        vertical(`${id}e`, skin.end[0], skin.end[1]),
        // the front face and the lip in user space, so the bottom line has the same colour along the whole key
        `<linearGradient id="${id}f" x1="0" y1="${frontEnd}" x2="0" y2="${bottom}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${skin.front[0]}"/><stop offset="1" stop-color="${skin.front[1]}"/></linearGradient>`,
        `<linearGradient id="${id}l" x1="0" y1="${frontPivot}" x2="0" y2="${bottom}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${skin.lip[0]}"/><stop offset="1" stop-color="${skin.lip[1]}"/></linearGradient>`,
        // the raised face turns away from the light towards the hinge
        `<linearGradient id="${id}t" x1="${ridge}" y1="0" x2="${pivot}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-opacity="0"/><stop offset="1" stop-opacity="${skin.tilt}"/></linearGradient>`,
        // the top edge of the raised half: lit at the outer end, the plain outline at the hinge
        `<linearGradient id="${id}h" x1="${ridge}" y1="0" x2="${pivot - 8}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${skin.highlight}"/><stop offset="1" stop-color="${skin.stroke}"/></linearGradient>`,
        `<filter id="${id}s" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter>`,
        skin.glow ? glowFilter(`${id}g`) : '',
    ].join('');

    // both halves are drawn as the left one; the higher one goes last, its lifted edge overlaps the hinge
    const halves = (['left', 'right'] as Side[])
        .sort((a, b) => raise(a) - raise(b))
        .map(side => {
            const half = rockerHalf(skin, id, raise(side), lit(side));
            return side === 'left' ? half : `<g transform="matrix(-1 0 0 1 ${WIDTH} 0)">${half}</g>`;
        });

    const labels = (['left', 'right'] as Side[]).map(side => {
        const text = side === 'left' ? labelLeft : labelRight;
        const up = raise(side);
        const glow = lit(side);
        const outward = side === 'left' ? -1 : 1;
        const center = side === 'left' ? (left + pivot) / 2 : (pivot + right) / 2;
        // a standing half carries its label higher and turned with it
        const cx = round(center + outward * mix(ROCKER.labelOut, ROCKER.raisedLabelOut, up));
        const y = mix(ROCKER.baseline, ROCKER.raisedBaseline, up);
        const angle = round(-outward * ROCKER.tiltAngle * up);
        const turn = angle ? `rotate(${angle} ${cx} ${round(y - 5)})` : '';
        const plain = glow < 1 ? label(text, cx, y, skin.label, false, `${id}g`, ROCKER.fontSize, turn) : '';
        if (!glow) {
            return plain;
        }
        const lighted = label(text, cx, y, skin.labelActive, true, `${id}g`, ROCKER.fontSize, turn);
        return glow < 1 ? `${plain}<g opacity="${glow}">${lighted}</g>` : lighted;
    });

    return `<defs>${defs}</defs>
${halves.join('\n')}
${labels.join('\n')}`;
}

/** The content of an `<svg viewBox="0 0 105 46">` for one state of one style */
export function switchBody(options: SwitchOptions): string {
    const { variant } = options;
    return variant.kind === 'rocker' ? rockerBody(options, variant) : sliderBody(options, variant);
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
