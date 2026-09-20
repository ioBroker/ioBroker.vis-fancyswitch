import React, { useId, useMemo } from 'react';

import { HEIGHT, WIDTH, switchBody, type Side, type SwitchVariant } from './fancyArt';

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
 */
export default function FancySwitchArt(props: FancySwitchArtProps): React.JSX.Element {
    // `useId` contains colons, which have no business inside a `url(#...)` reference
    const id = `fs${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    const body = useMemo(
        () =>
            switchBody({
                variant: props.variant,
                on: props.on,
                labelLeft: props.labelLeft,
                labelRight: props.labelRight,
                id,
            }),
        [props.variant, props.on, props.labelLeft, props.labelRight, id],
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
            <g dangerouslySetInnerHTML={{ __html: body }} />
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
