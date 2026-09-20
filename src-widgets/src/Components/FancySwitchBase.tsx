import React from 'react';

import type {
    RxRenderWidgetProps,
    RxWidgetInfoAttributesField,
    RxWidgetInfoGroup,
    VisRxWidgetState,
} from '@iobroker/types-vis-2';

import Generic from '../Generic';
import FancySwitchArt from './FancySwitchArt';
import type { Side, SwitchVariant } from './fancyArt';
import { isOn, isTrue, normalizeConfigured, toNumber, type StateValue } from '../utils';
import '../styles.css';

/** The attributes all five switch styles share; `lightStyle` of the rocker is added by that widget */
export interface FancySwitchRxData {
    oid: string;
    invert: boolean;
    valFalse: string;
    valTrue: string;
    autoOff: string;
    text_false: string;
    text_true: string;
    readOnly: boolean;
}

/**
 * The groups of the vis-2 editor.
 *
 * `oid`, `invert`, `valFalse`, `valTrue` and `autoOff` carry the names of the vis-1 template, so a project made
 * with vis keeps every setting. `text_false` / `text_true` are new: the labels used to be part of the PNG.
 */
export function switchAttrs(variant: SwitchVariant, extra: RxWidgetInfoAttributesField[] = []): RxWidgetInfoGroup[] {
    const [leftLabel, rightLabel] =
        variant.onSide === 'left' ? ['text_true', 'text_false'] : ['text_false', 'text_true'];

    return [
        {
            name: 'common',
            fields: [
                { name: 'oid', type: 'id', label: 'oid' },
                { name: 'valFalse', label: 'valFalse', default: '0' },
                { name: 'valTrue', label: 'valTrue', default: '1' },
                { name: 'invert', label: 'invert', type: 'checkbox' },
                {
                    name: 'autoOff',
                    label: 'autoOff',
                    tooltip: 'autoOff_tooltip',
                    type: 'slider',
                    min: 0,
                    max: 5000,
                    step: 100,
                    default: 0,
                },
                { name: 'readOnly', label: 'readOnly', type: 'checkbox' },
            ],
        },
        {
            name: 'style',
            label: 'group_style',
            fields: [
                {
                    name: leftLabel,
                    label: 'labelLeft',
                    tooltip: 'label_tooltip',
                    default: variant.labelLeft,
                },
                {
                    name: rightLabel,
                    label: 'labelRight',
                    tooltip: 'label_tooltip',
                    default: variant.labelRight,
                },
                ...extra,
            ],
        },
    ];
}

/**
 * The shared implementation of `tplFancySwitch1`, `tplFancySwitch2`, `tplFancyDarkAnAus`,
 * `tplFancyDarkAnAusRev` and `tplFancyDarkAnAusWippe` - the counterpart of `vis.binds.fancyswitch.fancyswitch`.
 *
 * Subclasses only pick the look by overriding `getVariant()`.
 */
export default abstract class FancySwitchBase<RxData extends FancySwitchRxData = FancySwitchRxData> extends Generic<
    RxData,
    VisRxWidgetState
> {
    private autoOffTimer: ReturnType<typeof setTimeout> | null = null;

    /** Which of the five looks this widget draws */
    abstract getVariant(): SwitchVariant;

    componentWillUnmount(): void {
        super.componentWillUnmount();
        if (this.autoOffTimer) {
            clearTimeout(this.autoOffTimer);
            this.autoOffTimer = null;
        }
    }

    private getTrueValue(): StateValue {
        return normalizeConfigured(this.state.rxData.valTrue, 1);
    }

    private getFalseValue(): StateValue {
        return normalizeConfigured(this.state.rxData.valFalse, 0);
    }

    /** The state the switch shows - the raw value evaluated with the vis-1 rules, then inverted if configured */
    protected isOn(): boolean {
        const data = this.state.rxData;
        const on = isOn(
            data.oid ? this.state.values[`${data.oid}.val`] : undefined,
            this.getTrueValue(),
            this.getFalseValue(),
        );
        return isTrue(data.invert) ? !on : on;
    }

    /**
     * A click on one half.
     *
     * The user clicks the half that carries the label of the state they want to see, so with `invert` the
     * written value is the other one. `autoOff` then writes the opposite value again after the given delay.
     */
    protected onClickSide = (side: Side): void => {
        const data = this.state.rxData;
        if (!data.oid || this.state.editMode) {
            return;
        }

        const wantOn = side === this.getVariant().onSide;
        const write = isTrue(data.invert) ? !wantOn : wantOn;
        this.props.context.setValue(data.oid, write ? this.getTrueValue() : this.getFalseValue());

        if (this.autoOffTimer) {
            clearTimeout(this.autoOffTimer);
            this.autoOffTimer = null;
        }
        const autoOff = toNumber(data.autoOff);
        if (autoOff) {
            this.autoOffTimer = setTimeout(() => {
                this.autoOffTimer = null;
                this.props.context.setValue(data.oid, write ? this.getFalseValue() : this.getTrueValue());
            }, autoOff);
        }
    };

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const data = this.state.rxData;
        const variant = this.getVariant();
        const [leftLabel, rightLabel] =
            variant.onSide === 'left' ? [data.text_true, data.text_false] : [data.text_false, data.text_true];

        return (
            <div className={this.getRootClass()}>
                <FancySwitchArt
                    variant={variant}
                    on={this.isOn()}
                    labelLeft={leftLabel}
                    labelRight={rightLabel}
                    readOnly={this.state.editMode || isTrue(data.readOnly) || !data.oid}
                    onClickSide={this.onClickSide}
                />
            </div>
        );
    }
}
