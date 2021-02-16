/**
 * Base class for Lava
 */

import { Client, Collection } from 'eris'
import { Command } from './structures/Command'

import { ConfigInterface } from './types/interfaces/ConfigInterfaces'

import { readdirSync } from 'fs'
import { join } from 'path'

export class Lava {
    public readonly config: ConfigInterface;
    public bot: Client;
    public cmds: Collection<Command>;
    public constructor(config: ConfigInterface) {
        this.bot = new Client(config.token as string);
        this.cmds = new Collection<Command>(Command);
        this.config = config;

        this._patch();
    }

    private _patch(): void {
        const patchCommands = this._patchCommands.bind(this);
        const patchListeners = this._patchEvents.bind(this);
        
        patchCommands(join(__dirname, '..', 'commands'));
        patchListeners(join(__dirname, '..', 'events'));
    }

    private _patchCommands(this: Lava, commandsDir: string): Lava {
        for (const path of readdirSync(commandsDir)) {
            const group = require(join(__dirname, path)).default;
            for (const command of group.commands) {
                this.cmds.set(command.config.name, command);
            }
        }

        return this;
    }

    private _patchEvents(this: Lava, eventsDir: string): Lava {
        for (const listener of readdirSync(eventsDir)) {
            const event = require(join(__dirname, '..', 'events', listener)).default;
            this.bot.on(event.id, event.run.bind(this));
        }

        return this;
    }
}