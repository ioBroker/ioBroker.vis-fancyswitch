import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import FancySwitchBase, { switchAttrs, type FancySwitchRxData } from './Components/FancySwitchBase';
import { VARIANTS, type SwitchVariant } from './Components/fancyArt';
import { isTrue } from './utils';

interface WippeRxData extends FancySwitchRxData {
    lightStyle: boolean;
}

/**
 * `tplFancyDarkAnAusWippe` - "Wippe dunkel Aus/Ein", the rocker.
 *
 * `lightStyle` is the one attribute that only this widget had: it switched the sprite from the dark rocker to
 * the light one, here it picks the other skin.
 */
export default class FancyDarkAnAusWippe extends FancySwitchBase<WippeRxData> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancyDarkAnAusWippe',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Wippe dunkel Aus/Ein',
            visWidgetLabel: 'rocker',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_rocker',
            visAttrs: switchAttrs(VARIANTS.fancyswitch5, [
                { name: 'lightStyle', label: 'lightStyle', type: 'checkbox' },
            ]),
            visDefaultStyle: { width: 105, height: 46, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_rocker.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancyDarkAnAusWippe.getWidgetInfo();
    }

    getVariant(): SwitchVariant {
        return isTrue(this.state.rxData.lightStyle) ? VARIANTS.fancyswitch6 : VARIANTS.fancyswitch5;
    }
}
