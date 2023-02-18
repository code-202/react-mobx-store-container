"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const lodash_1 = require("lodash");
class StoreContainer {
    stores;
    factories;
    _initializeData = {};
    constructor() {
        (0, mobx_1.makeObservable)(this, {
            stores: mobx_1.observable,
            factories: mobx_1.observable,
            keys: mobx_1.computed,
            addStore: mobx_1.action,
            addFactory: mobx_1.action,
        });
        this.stores = {};
        this.factories = [];
    }
    addStore(key, store) {
        if (!(0, lodash_1.has)(this.stores, key)) {
            this.stores[key] = store;
            if (typeof store.deserialize === 'function' && this._initializeData[key]) {
                store.deserialize(this._initializeData[key]);
            }
        }
        if (typeof store.initialization === 'function') {
            store.initialization();
        }
    }
    has(key) {
        return this.keys.indexOf(key) >= 0;
    }
    get(key) {
        return this._get(key, []);
    }
    _get(key, parents) {
        if (this.ready(key)) {
            return this.stores[key];
        }
        const factory = this.getFactory(key);
        if (factory === undefined) {
            return undefined;
        }
        const dependencies = [];
        for (const dependency of factory.dependencies) {
            if (dependency === factory.key) {
                throw new Error('auto dependence ' + factory.key + ' => ' + dependency);
            }
            if (parents.indexOf(dependency) >= 0) {
                throw new Error('cirular dependencies ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency);
            }
            const d = this._get(dependency, parents.concat([factory.key]));
            if (d === undefined) {
                throw new Error('no dependency with key : ' + dependency);
            }
            dependencies.push(d);
        }
        const store = factory.create(...dependencies);
        this.addStore(factory.key, store);
        return store;
    }
    ready(key) {
        return (0, lodash_1.has)(this.stores, key);
    }
    get keys() {
        const keys = Object.keys(this.stores);
        for (const factory of this.factories) {
            if (keys.indexOf(factory.key) < 0) {
                keys.push(factory.key);
            }
        }
        return keys;
    }
    addFactories(factories) {
        for (const factory of factories) {
            this.addFactory(factory);
        }
        return this;
    }
    addFactory(factory) {
        if (!this.hasFactory(factory.key)) {
            this.factories.push(factory);
        }
        return this;
    }
    hasFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return true;
            }
        }
        return false;
    }
    getFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return factory;
            }
        }
    }
    serialize() {
        const s = {};
        for (const key in this.stores) {
            const store = this.stores[key];
            if (typeof store.serialize === 'function') {
                s[key] = store.serialize();
            }
        }
        return s;
    }
    deserialize(data) {
        this._initializeData = data;
        for (const key in this.stores) {
            const store = this.stores[key];
            if (typeof store.deserialize === 'function' && data[key]) {
                store.deserialize(data[key]);
            }
        }
    }
}
exports.default = StoreContainer;
