import React from 'react';

import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';

import Generic from './Generic';
import IButton, { type ResizeMode } from './Components/IButton';
import { isTrue, toNumber } from './utils';
import './styles.css';

interface GivaIButtonRxData {
    oid: string;
    labelOn: string;
    labelOff: string;
    resizeHandle: ResizeMode;
    resizeContainer: ResizeMode;
    enableDrag: boolean;
    enableFx: boolean;
    duration: string;
    test: boolean;
    readOnly: boolean;
}

/**
 * `tplFancyGivaIButton` - the Giva Labs iButton.
 *
 * The vis-1 widget was a checkbox handled by `vis.binds.basic.checkbox`, so it writes the booleans `true` and
 * `false`; a value is read as "on" when it is positive, `true` or the text `true`.
 */
export default class FancyGivaIButton extends Generic<GivaIButtonRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancyGivaIButton',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Giva Labs iButton',
            visWidgetLabel: 'ibutton',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_ibutton',
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
                        { name: 'labelOn', label: 'labelOn', default: 'ON' },
                        { name: 'labelOff', label: 'labelOff', default: 'OFF' },
                        {
                            name: 'resizeHandle',
                            label: 'resizeHandle',
                            tooltip: 'resizeHandle_tooltip',
                            type: 'select',
                            options: ['auto', 'true', 'false'],
                            default: 'auto',
                        },
                        {
                            name: 'resizeContainer',
                            label: 'resizeContainer',
                            tooltip: 'resizeContainer_tooltip',
                            type: 'select',
                            options: ['auto', 'true', 'false'],
                            default: 'auto',
                        },
                        { name: 'enableDrag', label: 'enableDrag', type: 'checkbox' },
                        { name: 'enableFx', label: 'enableFx', type: 'checkbox', default: true },
                        {
                            name: 'duration',
                            label: 'duration',
                            type: 'slider',
                            min: 0,
                            max: 5000,
                            step: 100,
                            default: 200,
                        },
                    ],
                },
            ],
            visDefaultStyle: { width: 89, height: 27, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_ibutton.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancyGivaIButton.getWidgetInfo();
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
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <IButton
                    checked={this.isChecked()}
                    labelOn={data.labelOn || 'ON'}
                    labelOff={data.labelOff || 'OFF'}
                    resizeHandle={data.resizeHandle || 'auto'}
                    resizeContainer={data.resizeContainer || 'auto'}
                    enableDrag={isTrue(data.enableDrag)}
                    enableFx={isTrue(data.enableFx)}
                    duration={toNumber(data.duration, 200)}
                    readOnly={this.state.editMode || isTrue(data.readOnly) || !data.oid}
                    onChange={checked => this.props.context.setValue(data.oid, checked)}
                />
            </div>
        );
    }
}
