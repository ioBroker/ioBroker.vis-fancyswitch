import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import FancySwitchBase, { switchAttrs } from './Components/FancySwitchBase';
import { VARIANTS, type SwitchVariant } from './Components/fancyArt';

/** `tplFancyDarkAnAusRev` - "Schieber dunkel Aus/Ein" */
export default class FancyDarkAnAusRev extends FancySwitchBase {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancyDarkAnAusRev',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Schieber dunkel Aus/Ein',
            visWidgetLabel: 'slider_dark_off_on',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_slider_dark_off_on',
            visAttrs: switchAttrs(VARIANTS.fancyswitch4),
            visDefaultStyle: { width: 105, height: 46, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_dark_aus_an.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancyDarkAnAusRev.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    getVariant(): SwitchVariant {
        return VARIANTS.fancyswitch4;
    }
}
