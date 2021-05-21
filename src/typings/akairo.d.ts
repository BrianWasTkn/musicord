/**
 * Modified akairo typings to match our custom modfuckeries. 
 * @author BrianWasTaken
*/

import { 
	AbstractModuleOptions, 
	AbstractHandlerOptions, 
	ClientConnectOptions,
	AbstractHandler, 
	CommandHandler,
	CommandQueue,
	ItemEffects,
	LavaClient, 
	ClientUtil, 
	EmbedPlus, 
	Inhibitor,
	Connect,
	Console,
	Context,
	Logger,
} from 'src/library';
import { MessageOptions, Collection, Message } from 'discord.js';
import { EventEmitter } from 'events';

declare module 'discord-akairo' {
	type ArgumentTypeCaster = (message: Message, args: string) => PromiseUnion<any>;

	interface AkairoClient {
		connect(options: ClientConnectOptions): Promise<string>;
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
		console: Console;
		util: ClientUtil<this>;
		db: Connector;
	}
	interface ClientUtil<Client> {
		client: Client;
	}

	interface InhibitorHandlerOptions extends AkairoHandlerOptions {
		useNames: boolean;
	}
	interface InhibitorHandler extends AkairoHandler {
		add: () => Inhibitor;
		client: LavaClient;
		useNames: boolean;
	}

	interface ListenerHandlerOptions extends AkairoHandlerOptions {
		useNames?: boolean;
	}
	interface ListenerHandler extends AkairoHandler {
		client: LavaClient;
		useNames: boolean;
	}

	interface CommandHandlerOptions extends AkairoHandlerOptions {
		useNames: boolean;
	}
	interface CommandHandler {
		client: LavaClient;
		useNames: boolean;
		commandQueue: CommandQueue;

		runPostTypeInhibitors(message: Context, command: Command): Promise<boolean>;
		runPermissionChecks(message: Context, command: Command): Promise<boolean>;
		checkCooldowns(message: Context, command: Command): Promise<boolean>;
		runCommand(message: Context, command: Command, args: any): Promise<void>;
	}
	interface TypeResolver {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		types: Collection<string, ArgumentTypeCaster>;
		addBuiltInTypes(): void;
		addType(name: string, fn: ArgumentTypeCaster): this;
		addTypes(types: { [x: string]: ArgumentTypeCaster }): this;
		type(name: string): ArgumentTypeCaster;
	}

	interface ListenerOptions extends AbstractModuleOptions {
		name?: string;
	}
	interface Listener extends AkairoModule {
		handler: ListenerHandler;
		client: LavaClient;
		name: string;
	}

	interface InhibitorOptions extends AbstractModuleOptions {
		name?: string;
	}
	interface Inhibitor extends AkairoModule {
		handler: InhibitorHandler;
		client: LavaClient;
		name: string;
	}

	interface ParsedComponentData {
		command?: Command;
	}
	interface CommandDescription {
		examples: string[];
		short: string;
		long: string;
	}
	interface CommandOptions extends AbstractModuleOptions {
		description?: CommandDescription;
		name?: string;
	}
	interface Command extends AkairoModule {
		description: CommandDescription;
		client: LavaClient;
		name: string;
		exec(message: Message, args?: any): PromiseUnion<MessageOptions>;
	}
}