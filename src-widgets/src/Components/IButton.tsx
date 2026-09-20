import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Height of the bar, the height the sprite of the vis-1 widget had */
const HEIGHT = 27;
/** Width of the handle when it is not resized, from `.ibutton-handle` of `jquery.ibutton.css` */
const DEFAULT_HANDLE = 33;
/** A press shorter than this counts as a click even when the pointer moved, as in the original plug-in */
const CLICK_OFFSET = 120;

export type ResizeMode = 'auto' | 'true' | 'false';

interface IButtonProps {
    checked: boolean;
    labelOn: string;
    labelOff: string;
    resizeHandle: ResizeMode;
    resizeContainer: ResizeMode;
    enableDrag: boolean;
    enableFx: boolean;
    /** duration of the animation in ms */
    duration: number;
    readOnly?: boolean;
    onChange: (checked: boolean) => void;
}

/**
 * The Giva Labs iButton of `tplFancyGivaIButton`, rebuilt without jQuery and without the PNG sprite.
 *
 * The geometry is the one of the original plug-in, because the widget looks wrong as soon as it changes: the
 * handle is as wide as the *shorter* of the two labels, the bar as wide as the longer label plus the handle
 * plus 20 px, and the travel of the handle is `width - handle - 6`. The "on" label grows with the handle so the
 * blue surface always ends underneath it.
 */
export default function IButton(props: IButtonProps): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const onSpanRef = useRef<HTMLSpanElement>(null);
    const offSpanRef = useRef<HTMLSpanElement>(null);

    /** Widths of the two label spans; they are what the original measured to size everything else */
    const [spans, setSpans] = useState({ on: 0, off: 0 });
    /** Width of the bar as it is really rendered - needed for the travel of the handle */
    const [width, setWidth] = useState(0);
    /** 0..1 while the handle is being dragged, `null` otherwise */
    const [dragPercent, setDragPercent] = useState<number | null>(null);

    const defaultLabels = props.labelOn === 'ON' && props.labelOff === 'OFF';
    const resizeHandle = props.resizeHandle === 'auto' ? !defaultLabels : props.resizeHandle === 'true';
    const resizeContainer = props.resizeContainer === 'auto' ? !defaultLabels : props.resizeContainer === 'true';

    useLayoutEffect(() => {
        const on = onSpanRef.current?.getBoundingClientRect().width || 0;
        const off = offSpanRef.current?.getBoundingClientRect().width || 0;
        setSpans(old => (Math.abs(old.on - on) < 0.5 && Math.abs(old.off - off) < 0.5 ? old : { on, off }));
    }, [props.labelOn, props.labelOff]);

    // The bar either sizes itself from the labels or fills the widget - in both cases its real width is read back
    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return undefined;
        }
        const update = (): void => setWidth(element.getBoundingClientRect().width);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const handleWidth = resizeHandle && spans.on && spans.off ? Math.min(spans.on, spans.off) : DEFAULT_HANDLE;
    const containerWidth =
        resizeContainer && spans.on && spans.off ? Math.max(spans.on, spans.off) + handleWidth + 20 : undefined;

    /** How far the handle can travel */
    const travel = Math.max(0, width - handleWidth - 6);
    const percent = dragPercent ?? (props.checked ? 1 : 0);
    const x = percent * travel;

    const drag = useRef<{ offset: number; time: number; moved: boolean } | null>(null);

    const onPointerUp = useCallback(
        (event: PointerEvent): void => {
            const start = drag.current;
            drag.current = null;
            setDragPercent(null);
            if (!start) {
                return;
            }
            if (!start.moved || Date.now() - start.time < CLICK_OFFSET) {
                props.onChange(!props.checked);
                return;
            }
            const checked = (event.clientX - start.offset) / (travel || 1) >= 0.5;
            if (checked !== props.checked) {
                props.onChange(checked);
            }
        },
        [props, travel],
    );

    const onPointerMove = useCallback(
        (event: PointerEvent): void => {
            const start = drag.current;
            if (!start || !props.enableDrag) {
                return;
            }
            start.moved = true;
            setDragPercent(Math.min(1, Math.max(0, (event.clientX - start.offset) / (travel || 1))));
        },
        [props.enableDrag, travel],
    );

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    const onPointerDown = (event: React.PointerEvent): void => {
        if (props.readOnly) {
            return;
        }
        event.preventDefault();
        drag.current = { offset: event.clientX - x, time: Date.now(), moved: false };
    };

    // While dragging the handle has to follow the pointer immediately, so the transition is only for the snap
    const transition = props.enableFx && dragPercent === null ? `${props.duration}ms ease-in-out` : 'none';

    return (
        <div
            ref={containerRef}
            className={`fancy-ibutton${dragPercent !== null ? ' fancy-ibutton-dragging' : ''}${props.readOnly ? ' fancy-ibutton-readonly' : ''}`}
            style={{ width: containerWidth ?? '100%', height: HEIGHT }}
            onPointerDown={onPointerDown}
            role="switch"
            aria-checked={props.checked}
        >
            <div
                className="fancy-ibutton-label fancy-ibutton-on"
                style={{ width: x + 4, transition: `width ${transition}` }}
            >
                <span
                    ref={onSpanRef}
                    style={{ marginLeft: x - travel, transition: `margin-left ${transition}` }}
                >
                    <label>{props.labelOn}</label>
                </span>
            </div>
            <div className="fancy-ibutton-label fancy-ibutton-off">
                <span
                    ref={offSpanRef}
                    style={{ marginRight: -x, transition: `margin-right ${transition}` }}
                >
                    <label>{props.labelOff}</label>
                </span>
            </div>
            <div className="fancy-ibutton-pad fancy-ibutton-pad-left" />
            <div className="fancy-ibutton-pad fancy-ibutton-pad-right" />
            <div
                className="fancy-ibutton-handle"
                style={{ width: handleWidth, left: x, transition: `left ${transition}` }}
            />
        </div>
    );
}
