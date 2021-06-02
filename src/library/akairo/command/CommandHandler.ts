/**
 * Command Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandler, AbstractHandlerOptions, AbstractModuleOptions, LavaClient, InhibitorHandler, ListenerHandler } from '..';
import { CommandHandler as OldCommandHandler, CommandHandlerOptions, Category, Constants } from 'discord-akairo';
import { Context, CommandQueue } from '../..';
import { Collection } from 'discord.js';
import { Command } from '.';

const { CommandHandlerEvents, BuiltInReasons } = Constants;

export declare interface CommandHandler extends OldCommandHandler {
		/**
		 * All categories this command handler hold.
		 */
		categories: Collection<string, Category<string, Command>>;
		/**
		 * All commands this handler hold.
		 */
		modules: Collection<string, Command>;
		/**
		 * The client instance for this handler.
		 */
		client: LavaClient;
		/**
		 * Add a command.
		 */
		add: (filename: string) => Command;
		/**
		 * Find a category of commands.
		 */
		findCategory: (name: string) => Category<string, Command>;
		/**
		 * Load a command based from the file path or a class.
		 */
		load: (thing: string | Function, isReload?: boolean) => Command;
		/**
		 * Reload a command.
		 */
		reload: (id: string) => Command;
		/**
		 * Remove a command.
		 */
		remove: (id: string) => Command;
}

export class CommandHandler extends OldCommandHandler implements AbstractHandler<Command> {
		/**
		 * Prevent running multiple commands at once.
		 */
		public commandQueue = new CommandQueue();

		/**
		 * Run all post type inhibitors.
		 */
		public async runPostTypeInhibitors(context: Context, command: Command): Promise<boolean> {
				if (command.ownerOnly) {
					const isOwner = this.client.isOwner(context.author);
			if (!isOwner) {
				this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.OWNER);
				return true;
						}
				}

				if (command.channel === 'guild' && !context.guild) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.GUILD);
			return true;
		}

		if (command.channel === 'dm' && context.guild) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.DM);
			return true;
		}

		if (await this.runPermissionChecks(context, command)) {
			return true;
		}

		const reason = this.inhibitorHandler ? await this.inhibitorHandler.test('post', context, command) : null;
		if (reason != null) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, reason);
			return true;
		}

		if (await this.checkCooldowns(context, command)) {
			return true;
		}

		return false;
		}

		/**
		 * Run cooldowns.
		 */
		public async checkCooldowns(context: Context, command: Command): Promise<boolean> {
				const ignorer = command.ignoreCooldown || this.ignoreCooldown;
				const isIgnored = Array.isArray(ignorer)
						? ignorer.includes(context.author.id)
						: typeof ignorer === 'function'
								? ignorer(context, command)
								: context.author.id === ignorer;
	
			if (isIgnored) return false;

				const time = command.cooldown ?? this.defaultCooldown;
				if (!time) return false;

				const entry = await context.lava.fetch(context.author.id);
				const expire = context.createdTimestamp + time;

				let cooldown: LavaCooldowns = entry.cooldowns.get(command.id);
				if (!cooldown) {
						entry.data.cooldowns.push({ id: command.id, expire });
						cooldown = (await entry.data.save()).cooldowns.find(c => c.id === command.id);
				}

				const diff = (cooldown as LavaCooldowns).expire - context.createdTimestamp;
				if (diff > 0) {
						this.emit(CommandHandlerEvents.COOLDOWN, context, command, diff);
						return true;
				}

				return false;
		}

		/**
		 * Run a command.
		 */
		public async runCommand(context: Context, command: Command, args: any) {
			await this.commandQueue.wait(context.author.id);
			if (command.typing) {
				context.channel.startTyping();
			}

			try {
				context.args = args;
				this.emit(CommandHandlerEvents.COMMAND_STARTED, context, command, args);
				try {
					const returned = await command.exec(context);
					if (returned) await context.channel.send(returned);
					this.emit(CommandHandlerEvents.COMMAND_FINISHED, context, command, args);
				} catch(error) {
					this.emit('commandError', context, command, args, error);
				} finally {
						this.commandQueue.next(context.author.id);
					}
			} finally {
				if (command.typing) {
					context.channel.stopTyping();
				}
			}
		}
}