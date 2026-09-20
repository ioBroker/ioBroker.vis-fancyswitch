import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import FancySwitchBase, { switchAttrs } from './Components/FancySwitchBase';
import { VARIANTS, type SwitchVariant } from './Components/fancyArt';

/** `tplFancySwitch2` - "Slider dark Off/On" */
export default class FancySwitch2 extends FancySwitchBase {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancySwitch2',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Slider dark Off/On',
            visWidgetLabel: 'slider_dark',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_slider_dark',
            visAttrs: switchAttrs(VARIANTS.fancyswitch2),
            visDefaultStyle: { width: 105, height: 46, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_switch2.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancySwitch2.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    getVariant(): SwitchVariant {
        return VARIANTS.fancyswitch2;
    }
}
