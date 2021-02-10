"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Util extends discord_akairo_1.ClientUtil {
    constructor(client) {
        super(client);
        this.client = client;
        this.heists = new discord_js_1.Collection();
    }
    /**
     * Divides the items of an array into arrays
     * @param array An array with usually many items
     * @param size The number of items per array in return
     */
    paginateArray(array, size) {
        let result = [];
        let j = 0;
        for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
            result.push(array.slice(j, j + (size || 5)));
            j = j + (size || 5);
        }
        return result;
    }
    /**
     * Returns a random item from an array
     * @param array An array of anything
     */
    randomInArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    /**
     * Generates a random number
     * @param min The minimum number possible
     * @param max The maximum number possible
     */
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * Generates a random decimal color resolvable
     */
    randomColor() {
        return Math.random() * 0xffffff;
    }
    /**
     * Logs something into the console
     * @param struct The constructor name
     * @param type Either `main` or `error`
     * @param _ The message to be displayed
     * @param err An error object
     */
    log(struct, type, _, err) {
        const stamp = moment_1.default().format('HH:mm:ss');
        switch (type) {
            case 'main':
                console.log(chalk_1.default.whiteBright(`[${stamp}]`), chalk_1.default.cyanBright(struct), chalk_1.default.whiteBright('=>'), chalk_1.default.yellowBright(_));
                break;
            case 'error':
                console.log(chalk_1.default.whiteBright(`[${stamp}]`), chalk_1.default.redBright(struct), chalk_1.default.whiteBright('=>'), chalk_1.default.redBright(_), err);
                break;
            default:
                this.log(struct, 'main', _);
                break;
        }
    }
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(ms);
            }, ms);
        });
    }
}
exports.default = Util;
