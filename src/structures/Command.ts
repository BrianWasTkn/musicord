/**
 * Base class for Commands
 * Made by: BrianWasTkn
 */

import { CommandFunction, CommandConfigInterface } from '../types/interfaces/CommandInterfaces'

export class Command {
    public id: string;
    public constructor(
        public config: CommandConfigInterface, 
        public fn: CommandFunction
    ) { 
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
    public get props() {
        return Object.assign(this.config, {
            cooldown: 3000,
            userPerms: ['sendMessages'],
            botPerms: ['viewChannel']
        });
    }
}