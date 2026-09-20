import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import FancySwitchBase, { switchAttrs } from './Components/FancySwitchBase';
import { VARIANTS, type SwitchVariant } from './Components/fancyArt';

/** `tplFancySwitch1` - "Switch light Off/On" */
export default class FancySwitch1 extends FancySwitchBase {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplFancySwitch1',
            visSet: 'fancyswitch',
            visSetLabel: 'set_label',
            visName: 'Switch light Off/On',
            visWidgetLabel: 'switch_light',
            // what the widget does, in the tooltip of the palette under the preview
            visHelp: 'help_switch_light',
            visAttrs: switchAttrs(VARIANTS.fancyswitch1),
            visDefaultStyle: { width: 105, height: 46, position: 'absolute' },
            visPrev: 'widgets/vis-2-widgets-fancyswitch/img/prev_switch1.svg',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return FancySwitch1.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    getVariant(): SwitchVariant {
        return VARIANTS.fancyswitch1;
    }
}
