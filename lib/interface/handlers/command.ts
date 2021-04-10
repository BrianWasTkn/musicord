import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions';
import { 
	CommandHandlerOptions as AkairoHandlerOptions,
	CommandOptions as AkairoCommandOptions
} from 'discord-akairo';

export type ExamplePredicate = 
	(msg: MessagePlus) => string | string[];

export type CommandReturn = 
	void | string | MessageOptions;


export interface CommandHandlerOptions extends AkairoHandlerOptions {
	commandTyping?: boolean;
}

export interface CommandOptions extends AkairoCommandOptions {
  manualCooldown?: boolean;
	examples?: string | string[] | ExamplePredicate;
}