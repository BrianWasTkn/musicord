"use strict";
/**
 * Base class for Lava
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lava = void 0;
const eris_1 = require("eris");
const Command_1 = require("./structures/Command");
const fs_1 = require("fs");
const path_1 = require("path");
class Lava {
    constructor(config) {
        this.bot = new eris_1.Client(config.token);
        this.cmds = new eris_1.Collection(Command_1.Command);
        this.config = config;
        this._patch();
    }
    _patch() {
        const patchCommands = this._patchCommands.bind(this);
        const patchListeners = this._patchEvents.bind(this);
        patchCommands(path_1.join(__dirname, '..', 'commands'));
        patchListeners(path_1.join(__dirname, '..', 'services'));
    }
    _patchCommands(commandsDir) {
        for (const path of fs_1.readdirSync(commandsDir)) {
            const group = require(path_1.join(__dirname, path)).default;
            for (const command of group.commands) {
                this.cmds.set(command.config.name, command);
            }
        }
        return this;
    }
    _patchEvents(eventsDir) {
        for (const listener of fs_1.readdirSync(eventsDir)) {
            const event = require(path_1.join(__dirname, '..', 'events', listener)).default;
            this.bot.on(event.id, event.run.bind(this));
        }
        return this;
    }
}
exports.Lava = Lava;
