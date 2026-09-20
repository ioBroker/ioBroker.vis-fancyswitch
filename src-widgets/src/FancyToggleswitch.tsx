import React from 'react';

import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';

import Generic from './Generic';
import ToggleSwitch from './Components/ToggleSwitch';
import { isTrue, toNumber } from './utils';
import './styles.css';

interface ToggleswitchRxData {
    html_prepend: string;
    html_append: string;
    oid: string;
    text_true: string;
    text_false: string;
    highlight_switch: boolean;
    width: string;
    test: boolean;
    readOnly: boolean;
}

/**
 * `tplFancyToggleswitch` - the Taitem jQuery UI toggle switch.
 *
 * The vis-1 widget was a `<select>` with the options `0` and `1` handled by `vis.binds.basic.select`; the React
 * version writes the booleans `true` and `false` instead, which is what a "ctrl - Bool" state expects.
 */
export default class FancyToggleswitch extends Generic<ToggleswitchRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancyToggleswitch',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Taitem jqui Toggleswitch',
            visWidgetLabel: 'toggleswitch',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_toggleswitch',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        { name: 'oid', type: 'id', label: 'oid' },
                        { name: 'readOnly', label: 'readOnly', type: 'checkbox' },
                        {
                            name: 'test',
                            label: 'test',
                            tooltip: 'test_tooltip',
                            type: 'checkbox',
                        },
                    ],
                },
                {
                    name: 'style',
                    label: 'group_style',
                    fields: [
                        { name: 'text_false', label: 'text_false', default: 'OFF' },
                        { name: 'text_true', label: 'text_true', default: 'ON' },
                        { name: 'highlight_switch', label: 'highlight_switch', type: 'checkbox', default: true },
                        {
                            name: 'width',
                            label: 'width',
                            tooltip: 'width_tooltip',
                            type: 'slider',
                            min: 10,
                            max: 500,
                            step: 1,
                            default: 40,
                        },
                    ],
                },
                {
                    name: 'html',
                    label: 'group_html',
                    fields: [
                        { name: 'html_prepend', label: 'html_prepend', type: 'html' },
                        { name: 'html_append', label: 'html_append', type: 'html' },
                    ],
                },
            ],
            visDefaultStyle: { width: 140, height: 30, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_toggleswitch.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancyToggleswitch.getWidgetInfo();
    }

    private isChecked(): boolean {
        const data = this.state.rxData;
        if (this.state.editMode) {
            return isTrue(data.test);
        }
        const value = data.oid ? this.state.values[`${data.oid}.val`] : undefined;
        return parseFloat(value as string) > 0 || value === 'true' || value === true;
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const data = this.state.rxData;

        return (
            <div
                className={this.getRootClass()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {data.html_prepend ? <span dangerouslySetInnerHTML={{ __html: data.html_prepend }} /> : null}
                <ToggleSwitch
                    checked={this.isChecked()}
                    labelOn={data.text_true ?? 'ON'}
                    labelOff={data.text_false ?? 'OFF'}
                    width={toNumber(data.width, 40)}
                    highlight={isTrue(data.highlight_switch)}
                    readOnly={this.state.editMode || isTrue(data.readOnly) || !data.oid}
                    onChange={checked => this.props.context.setValue(data.oid, checked)}
                />
                {data.html_append ? <span dangerouslySetInnerHTML={{ __html: data.html_append }} /> : null}
            </div>
        );
    }
}
