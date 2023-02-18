"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicProvider = exports.StoreContainer = void 0;
const store_container_1 = __importDefault(require("./store-container"));
exports.StoreContainer = store_container_1.default;
const dynamic_provider_1 = __importDefault(require("./dynamic-provider"));
exports.DynamicProvider = dynamic_provider_1.default;
