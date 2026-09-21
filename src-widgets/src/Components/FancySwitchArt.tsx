import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import { HEIGHT, WIDTH, rockerTilt, switchBody, switchMotion, type Side, type SwitchVariant } from './fancyArt';

/** How long a switch takes to change over - the same as the transition of the sliders in `styles.css` */
const DURATION = 300;

const reducedMotion = (): boolean =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * A number that follows `target` with an ease-in-out over `DURATION` ms instead of jumping to it. A new target
 * while it is still moving starts the next move from where it is. With "reduce motion" set in the system it jumps.
 */
function useTween(target: number): number {
    const [value, setValue] = useState(target);
    const current = useRef(target);
    const instant = reducedMotion();

    useEffect(() => {
        const from = current.current;
        const start = performance.now();
        let frame = 0;
        const step = (now: number): void => {
            const k = instant ? 1 : Math.min(1, (now - start) / DURATION);
            const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
            current.current = k < 1 ? from + (target - from) * eased : target;
            setValue(current.current);
            if (k < 1) {
                frame = requestAnimationFrame(step);
            }
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, instant]);

    return instant ? target : value;
}

interface FancySwitchArtProps {
    variant: SwitchVariant;
    on: boolean;
    /** overrides the text of the left half */
    labelLeft?: string;
    /** overrides the text of the right half */
    labelRight?: string;
    readOnly?: boolean;
    /** Which half was clicked - the vis-1 widget had one radio button per half, not a toggle */
    onClickSide?: (side: Side) => void;
}

/**
 * One of the five switch styles, drawn as SVG.
 *
 * The vis-1 widget was a fixed 105x46 `<fieldset>` with a PNG sprite as its background; here the same drawing
 * scales into whatever box the user gave the widget, keeping its aspect ratio.
 *
 * The switches move instead of jumping from one state to the other:
 *
 * - The sliders are drawn `animated`: their markup does not change with the state, only the CSS custom
 *   properties of `switchMotion()` on the wrapping `<g>` do. React therefore keeps the DOM, and the transition in
 *   `styles.css` slides the strip.
 * - A rocker changes its shape, which CSS cannot interpolate. Its `tilt` follows the state with `useTween()` and
 *   the key is drawn again for every frame, passing through the middle position.
 */
export default function FancySwitchArt(props: FancySwitchArtProps): React.JSX.Element {
    // `useId` contains colons, which have no business inside a `url(#...)` reference
    const id = `fs${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    const tilt = useTween(props.variant.kind === 'rocker' ? rockerTilt(props.variant, props.on) : 0);

    const body = useMemo(
        () =>
            switchBody({
                variant: props.variant,
                on: props.on,
                labelLeft: props.labelLeft,
                labelRight: props.labelRight,
                id,
                animated: true,
                tilt,
            }),
        [props.variant, props.on, props.labelLeft, props.labelRight, id, tilt],
    );

    const click = (side: Side): void => {
        if (!props.readOnly) {
            props.onClickSide?.(side);
        }
    };

    return (
        <svg
            className="fancy-switch-art"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="100%"
            style={{ cursor: props.readOnly ? 'default' : 'pointer' }}
            role={props.readOnly ? undefined : 'switch'}
            aria-checked={props.on}
        >
            {/* The artwork itself is built by `fancyArt`, the single source of the vis-1 sprites, the palette
                previews and this widget - the labels it puts in are escaped there. */}
            <g
                style={switchMotion(props.variant, props.on)}
                dangerouslySetInnerHTML={{ __html: body }}
            />
            {!props.readOnly && (
                <>
                    <rect
                        x="0"
                        y="0"
                        width={WIDTH / 2}
                        height={HEIGHT}
                        fill="transparent"
                        onClick={() => click('left')}
                    />
                    <rect
                        x={WIDTH / 2}
                        y="0"
                        width={WIDTH / 2}
                        height={HEIGHT}
                        fill="transparent"
                        onClick={() => click('right')}
                    />
                </>
            )}
        </svg>
    );
}
