import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions';
import {
  CommandHandlerOptions as AkairoHandlerOptions,
  CommandOptions as AkairoCommandOptions,
} from 'discord-akairo';

export type ExamplePredicate = (ctx: Context) => string | string[];

export type CommandReturn = void | string | MessageOptions;

export interface CommandHandlerOptions extends AkairoHandlerOptions {
  commandTyping?: boolean;
}

export interface CommandOptions extends AkairoCommandOptions {
  manualCooldown?: boolean;
  examples?: string | string[] | ExamplePredicate;
}
