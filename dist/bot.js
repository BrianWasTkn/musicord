"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Lava_1 = require("./Lava");
const config_1 = __importDefault(require("./config"));
new Lava_1.Lava(config_1.default);
