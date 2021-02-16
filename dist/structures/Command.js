"use strict";
/**
 * Base class for Commands
 * Made by: BrianWasTkn
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(config, fn) {
        this.config = config;
        this.fn = fn;
        /**
         * Command ID (for collection purposes)
         * @type {CommandConfigInterface["name"]}
         */
        this.id = config.name;
        /**
         * Command Config
         * @type {CommandConfigInterface}
        */
        this.config = config;
        /**
         * Command Function
         * @type {CommandFunction}
         */
        this.fn = fn;
    }
    /**
     * Command props
     */
    get props() {
        return Object.assign(this.config, {
            cooldown: 3000,
            userPerms: ['sendMessages'],
            botPerms: ['viewChannel']
        });
    }
}
exports.Command = Command;
