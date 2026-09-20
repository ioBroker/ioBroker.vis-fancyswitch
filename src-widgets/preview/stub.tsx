/*
 * Stub of the vis-2 runtime.
 *
 * Importing this module puts `window.visRxWidget` in place. The widgets extend it, so they may only be imported
 * afterwards - the page loads them with a dynamic `import()` after this module.
 */
import React from 'react';

class VisRxWidgetStub extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            rxData: props.rxData || {},
            rxStyle: props.rxStyle || {},
            values: props.values || {},
            editMode: !!props.editMode,
            visible: true,
        };
    }

    /** The values live in the page, not in the widget - this is what feeds them in on every change */
    static getDerivedStateFromProps(props: any, state: any): any {
        if (props.values !== state.values || props.rxData !== state.rxData || !!props.editMode !== state.editMode) {
            return { values: props.values, rxData: props.rxData, editMode: !!props.editMode };
        }
        return null;
    }

    static getI18nPrefix(): string {
        return '';
    }

    static t(key: string, ...args: string[]): string {
        let word = key;
        for (const arg of args) {
            word = word.replace('%s', arg);
        }
        return word;
    }

    componentDidMount(): void {}

    componentWillUnmount(): void {}

    componentDidUpdate(_prevProps: any, _prevState: any): void {}

    renderWidgetBody(_props: any): any {
        return null;
    }

    render(): React.ReactNode {
        return (this as any).renderWidgetBody({ widget: {}, style: {}, className: '', overlayClassNames: [] });
    }
}

(window as any).visRxWidget = VisRxWidgetStub;

/** Fills in the defaults of `getWidgetInfo()`, the way the vis editor does when a widget is created */
export function withDefaults(Widget: any, data: Record<string, any>): Record<string, any> {
    const info = Widget.getWidgetInfo();
    const result: Record<string, any> = {};
    for (const group of info.visAttrs) {
        for (const field of group.fields) {
            if (field.default !== undefined) {
                result[field.name] = field.default;
            }
        }
    }
    return { ...result, ...data };
}
