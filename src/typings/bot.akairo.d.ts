/**
 * Modified akairo typings to match our custom modfuckeries. 
 * @author BrianWasTaken
*/

import { 
	AbstractModuleOptions, 
	AbstractHandlerOptions, 
	ClientConnectOptions,
	CurrencyEndpoint,
	AbstractHandler, 
	CommandHandler,
	SpawnEndpoint,
	CommandQueue,
	ItemEffects,
	ItemHandler,
	LavaClient, 
	ClientUtil, 
	EmbedPlus, 
	Inhibitor,
	Endpoint,
	Connect,
	Context,
	Logger,
} from 'src/library';
import { 
	MessageOptions, 
	Constructable,
	Collection, 
	Message, 
} from 'discord.js';
import { 
	EventEmitter 
} from 'events';
import {
	Document
} from 'mongoose';

interface ClientDB {
	currency: CurrencyEndpoint;
	spawn: SpawnEndpoint;
}

declare module 'discord-akairo' {
	type ArgumentTypeCaster = (message: Message, args: string) => PromiseUnion<any>;

	// Client
	interface AkairoClient {
		connect(options: ClientConnectOptions): Promise<string>;
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
		itemHandler: ItemHandler;
		console: Logger;
		util: ClientUtil<this>;
		db: ClientDB;
	}
	interface ClientUtil<Client> {
		client: Client;
	}

	// Inhibitor
	interface InhibitorHandlerOptions extends AkairoHandlerOptions {
		useNames: boolean;
	}
	interface InhibitorHandler extends AkairoHandler {
		add: () => Inhibitor;
		client: LavaClient;
		useNames: boolean;
	}

	// Listener
	interface ListenerHandlerOptions extends AkairoHandlerOptions {
		useNames?: boolean;
	}
	interface ListenerHandler extends AkairoHandler {
		client: LavaClient;
		useNames: boolean;
	}

	// Command
	interface CommanddHandlerOptions extends AkairoHandlerOptions {
		useNames: boolean;
	}
	interface CommanddHandler {
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

	// Listener
	interface ListenerOptions extends AbstractModuleOptions {
		name?: string;
	}
	interface Listener extends AkairoModule {
		handler: ListenerHandler;
		client: LavaClient;
		name: string;
	}

	// Inhibitor
	interface InhibitorOptions extends AbstractModuleOptions {
		name?: string;
	}
	interface Inhibitor extends AkairoModule {
		handler: InhibitorHandler;
		client: LavaClient;
		name: string;
	}

	// Command
	interface ParseddComponentData {
		command?: Command;
	}
	interface CommanddDescription {
		examples: string[];
		short: string;
		long: string;
	}
	interface CommanddOptions extends AbstractModuleOptions {
		description?: CommandDescription;
		name?: string;
	}
	interface Commandd extends AkairoModule {
		description: CommandDescription;
		client: LavaClient;
		name: string;
		exec(message: Message, args?: any): PromiseUnion<MessageOptions>;
	}
}