import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import FancySwitchBase, { switchAttrs } from './Components/FancySwitchBase';
import { VARIANTS, type SwitchVariant } from './Components/fancyArt';

/** `tplFancyDarkAnAus` - "Schieber dunkel Ein/Aus" */
export default class FancyDarkAnAus extends FancySwitchBase {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancyDarkAnAus',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Schieber dunkel Ein/Aus',
            visWidgetLabel: 'slider_dark_on_off',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_slider_dark_on_off',
            visAttrs: switchAttrs(VARIANTS.fancyswitch3),
            visDefaultStyle: { width: 105, height: 46, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_dark_an_aus.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancyDarkAnAus.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    getVariant(): SwitchVariant {
        return VARIANTS.fancyswitch3;
    }
}
