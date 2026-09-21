/*
 * The development page: `npm run preview` in the root, then http://localhost:4173.
 *
 * All seven widgets against the stub of `VisRxWidget`, no ioBroker needed. The state values live here, not in
 * the widgets, so a click on one widget moves every widget that is bound to the same object id - the same round
 * trip as in vis-2.
 *
 * The two text fields in the header override the labels of every widget; left empty, each widget keeps its own.
 */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { withDefaults } from './stub';

const widgets = await import('./widgets');

const OID = 'preview.0.switch';

interface Row {
    title: string;
    Widget: any;
    data?: Record<string, any>;
    width?: number;
    height?: number;
}

const ROWS: Row[] = [
    { title: 'tplFancySwitch1 - Switch light', Widget: widgets.FancySwitch1 },
    { title: 'tplFancySwitch2 - Slider dark', Widget: widgets.FancySwitch2 },
    { title: 'tplFancyDarkAnAus - Schieber dunkel Ein/Aus', Widget: widgets.FancyDarkAnAus },
    { title: 'tplFancyDarkAnAusRev - Schieber dunkel Aus/Ein', Widget: widgets.FancyDarkAnAusRev },
    { title: 'tplFancyDarkAnAusWippe - Wippe', Widget: widgets.FancyDarkAnAusWippe },
    {
        title: 'tplFancyDarkAnAusWippe - Wippe, light style',
        Widget: widgets.FancyDarkAnAusWippe,
        data: { lightStyle: true },
    },
    {
        title: 'tplFancySwitch1 - own labels, 210x92',
        Widget: widgets.FancySwitch1,
        data: { text_false: 'AUS', text_true: 'AN' },
        width: 210,
        height: 92,
    },
    { title: 'tplFancyGivaIButton', Widget: widgets.FancyGivaIButton, width: 89, height: 27 },
    {
        title: 'tplFancyGivaIButton - own labels, drag',
        Widget: widgets.FancyGivaIButton,
        data: { labelOn: 'AN', labelOff: 'AUS', enableDrag: true },
        width: 140,
        height: 27,
    },
    { title: 'tplFancyToggleswitch', Widget: widgets.FancyToggleswitch, width: 160, height: 30 },
];

/** The attributes that carry the two labels - the iButton names them differently */
function labelData(Widget: any, textFalse: string, textTrue: string): Record<string, string> {
    const iButton = Widget === widgets.FancyGivaIButton;
    const data: Record<string, string> = {};
    if (textFalse) {
        data[iButton ? 'labelOff' : 'text_false'] = textFalse;
    }
    if (textTrue) {
        data[iButton ? 'labelOn' : 'text_true'] = textTrue;
    }
    return data;
}

function Preview(): React.JSX.Element {
    const [values, setValues] = useState<Record<string, any>>({ [`${OID}.val`]: false });
    const [dark, setDark] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [textFalse, setTextFalse] = useState('');
    const [textTrue, setTextTrue] = useState('');

    const context = {
        themeType: dark ? 'dark' : 'light',
        setValue: (id: string, value: any) => setValues(old => ({ ...old, [`${id}.val`]: value })),
    };
    const on = values[`${OID}.val`];

    return (
        <div
            style={{
                minHeight: '100vh',
                padding: 24,
                fontFamily: 'Arial, Helvetica, sans-serif',
                background: dark ? '#1c1d20' : '#f3f3f3',
                color: dark ? '#e6e8ea' : '#222222',
            }}
        >
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
                <strong>fancyswitch</strong>
                <label>
                    <input
                        type="checkbox"
                        checked={dark}
                        onChange={e => setDark(e.target.checked)}
                    />{' '}
                    dark view
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={editMode}
                        onChange={e => setEditMode(e.target.checked)}
                    />{' '}
                    edit mode
                </label>
                <button onClick={() => context.setValue(OID, !on)}>{`${OID} = ${String(on)}`}</button>
                <label>
                    Text aus{' '}
                    <input
                        value={textFalse}
                        placeholder="default"
                        style={{ width: 70 }}
                        onChange={e => setTextFalse(e.target.value)}
                    />
                </label>
                <label>
                    Text an{' '}
                    <input
                        value={textTrue}
                        placeholder="default"
                        style={{ width: 70 }}
                        onChange={e => setTextTrue(e.target.value)}
                    />
                </label>
                <button
                    onClick={() => {
                        setTextFalse('0');
                        setTextTrue('I');
                    }}
                >
                    0 / I
                </button>
                <button
                    onClick={() => {
                        setTextFalse('');
                        setTextTrue('');
                    }}
                >
                    default
                </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {ROWS.map((row, i) => (
                    <div
                        key={i}
                        style={{ width: 260 }}
                    >
                        <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 6, height: 26 }}>{row.title}</div>
                        <div
                            style={{
                                position: 'relative',
                                width: row.width ?? 105,
                                height: row.height ?? 46,
                            }}
                        >
                            <row.Widget
                                context={context}
                                rxData={withDefaults(row.Widget, {
                                    oid: OID,
                                    ...(row.data || {}),
                                    ...labelData(row.Widget, textFalse, textTrue),
                                })}
                                values={values}
                                editMode={editMode}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')!).render(<Preview />);
