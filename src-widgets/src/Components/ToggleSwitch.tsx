import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    labelOn: string;
    labelOff: string;
    /** width of the track in px, the `width` attribute of the vis-1 widget */
    width: number;
    /** fills the track between the handle and the "on" end, the `highlight_switch` attribute */
    highlight: boolean;
    readOnly?: boolean;
    onChange: (checked: boolean) => void;
}

/** Height of the track, `0.8em` of the jQuery UI slider at the font size the widget used */
const TRACK_HEIGHT = 11;
/** Size of the handle, `1.2em` of the jQuery UI slider */
const HANDLE = 17;

/**
 * The Taitem toggle switch of `tplFancyToggleswitch`: two labels with a small slider between them.
 *
 * The original was a jQuery UI slider driving a hidden `<select>`, and it only looked right with the jQuery UI
 * theme loaded. Here it is drawn with the colours of the vis-2 theme instead, so it fits both the light and the
 * dark one - the geometry (track width, handle size, the filled range towards "on") is the one of the original.
 */
export default function ToggleSwitch(props: ToggleSwitchProps): React.JSX.Element {
    const value = props.checked ? 1 : 0;
    const set = (checked: boolean): void => {
        if (!props.readOnly && checked !== props.checked) {
            props.onChange(checked);
        }
    };

    return (
        <div className={`fancy-toggle${props.readOnly ? ' fancy-toggle-readonly' : ''}`}>
            <label
                className={`fancy-toggle-label${props.checked ? '' : ' fancy-toggle-active'}`}
                onClick={() => set(false)}
            >
                {props.labelOff}
            </label>
            <div
                className="fancy-toggle-track"
                style={{ width: props.width, height: TRACK_HEIGHT }}
                onClick={() => set(!props.checked)}
                role="switch"
                aria-checked={props.checked}
            >
                {/*
                 * The filled part of the track. jQuery UI was configured with `range: "max"`, which fills from
                 * the handle to the *right* end and therefore painted the track blue while the switch was off -
                 * here it grows towards "on" instead.
                 */}
                {props.highlight ? (
                    <div
                        className="fancy-toggle-range"
                        style={{ left: 0, width: `${value * 100}%` }}
                    />
                ) : null}
                <div
                    className="fancy-toggle-handle"
                    style={{
                        width: HANDLE,
                        height: HANDLE,
                        top: (TRACK_HEIGHT - HANDLE) / 2,
                        left: `${value * 100}%`,
                        transform: `translateX(-${value * 100}%)`,
                    }}
                />
            </div>
            <label
                className={`fancy-toggle-label${props.checked ? ' fancy-toggle-active' : ''}`}
                onClick={() => set(true)}
            >
                {props.labelOn}
            </label>
        </div>
    );
}
