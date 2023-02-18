import * as React from 'react';
import StoreContainer from './store-container';
import StoreFactory from './store-factory';
interface Props extends React.PropsWithChildren {
    names: (string | StoreFactory | (() => string) | (() => StoreFactory))[];
    container?: StoreContainer;
    factories?: {
        [id: string]: {
            (...dependencies: any[]): any;
        };
    };
    dependencies?: {
        [id: string]: string[];
    };
}
interface State {
}
declare class DynamicProvider extends React.Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
declare const _default: typeof DynamicProvider & import("mobx-react").IWrappedComponent<Props>;
export default _default;
