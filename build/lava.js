"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Client_1 = require("./lib/structures/Client");
const config_1 = __importDefault(require("./config"));
const lava = new Client_1.Client(config_1.default);
lava.build();
