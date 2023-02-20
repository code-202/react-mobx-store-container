import StoreFactory from './store-factory';
interface StoreContainerData {
    [key: string]: any;
}
type StoreContainerInitiator = () => void;
export default class StoreContainer {
    stores: StoreContainerData;
    factories: StoreFactory[];
    private initiators;
    protected _initializeData: StoreContainerData;
    constructor();
    addStore(key: string, store: any): void;
    has(key: string): boolean;
    get(key: string): any;
    protected _get(key: string, parents: string[]): any;
    ready(key: string): boolean;
    get keys(): string[];
    addFactories(factories: StoreFactory[]): this;
    addFactory(factory: StoreFactory): this;
    hasFactory(key: string): boolean;
    getFactory(key: string): StoreFactory | undefined;
    onInit(callback: StoreContainerInitiator): void;
    init(): void;
    serialize(): StoreContainerData;
    deserialize(data: StoreContainerData): void;
}
export {};
