import { Collection, ClientEvents, ClientOptions } from 'discord.js';
import { ConnectOptions } from 'mongoose';
import { SpawnDocument } from './interface/mongo/spawns';
import { EventEmitter } from 'events';
import { Util } from './utility/util';
import { join } from 'path';
import { 
	CommandHandlerOptions,
	AkairoHandlerOptions,
	ArgumentTypeCaster,
	AkairoOptions,
	AkairoHandler, 
	AkairoClient, 
	AkairoModule, 
} from 'discord-akairo';
import {
  ListenerHandler, Listener,
  CommandHandler, Command,
  SpawnHandler, Spawn,
  QuestHandler, Quest,
  ItemHandler, Item,
  LotteryHandler,
} from './handlers';

// def imports
import CurrencyFunc from './mongo/currency/functions';
import SpawnerFunc from './mongo/spawns/functions';
import mongoose from 'mongoose';

// ext structures
import './extensions';

interface ClientEventsPlus extends ClientEvents {
	moduleLoad: [module: AkairoModule];
	dbConnect: [db: typeof mongoose];
}

interface DB {
	currency: CurrencyFunc<CurrencyProfile>;
	spawns: SpawnerFunc<SpawnDocument>;
}

interface Handlers {
	listener: ListenerHandler<Listener<Lava>>;
	command: CommandHandler<Command>;
	lottery: LotteryHandler;
	spawn: SpawnHandler<Spawn>;
	quest: QuestHandler<Quest>;
	item: ItemHandler<Item>;
}

interface HandlerConstructor {
	listener: AkairoHandlerOptions;
	command: CommandHandlerOptions;
	spawn: AkairoHandlerOptions;
	quest: AkairoHandlerOptions;
	item: AkairoHandlerOptions;
}

interface MongoData {
  options?: ConnectOptions;
  uri: string;
}

type HandlerOptions = AkairoHandlerOptions | CommandHandlerOptions; 

export class Lava extends AkairoClient {
	mongoPath: MongoData;
	handlers: Handlers;
	util: Util = new Util(this);
	db: DB = {
		currency: new CurrencyFunc<CurrencyProfile>(this),
		spawns: new SpawnerFunc<SpawnDocument>(this),
	};

	// Event Types
	on: <K extends keyof ClientEventsPlus>(
		event: K, 
		listener: (...args: ClientEventsPlus[K]) => void
	) => this;
	once: <K extends keyof ClientEventsPlus>(
		event: K, 
		listener: (...args: ClientEventsPlus[K]) => void
	) => this;
	emit: <K extends keyof ClientEventsPlus>(
		event: K, 
		...args: ClientEventsPlus[K]
	) => boolean;

	constructor(
		akairoOptions: AkairoOptions, 
		clientOptions: ClientOptions,
		handlers: HandlerConstructor,
	) {
		super({ ...akairoOptions, ...clientOptions });
		this.handlers = {
		  listener: new ListenerHandler<Listener<this>>(this, handlers.listener),
		  command: new CommandHandler<Command>(this, handlers.command),
		  spawn: new SpawnHandler<Spawn>(this, handlers.spawn),
		  quest: new QuestHandler<Quest>(this, handlers.quest),
		  item: new ItemHandler<Item>(this, handlers.item),
		  lottery: new LotteryHandler(this),
		};
	}

	setMongoPath(uri: string, options: ConnectOptions = {}) {
		this.mongoPath = { uri, options };
		return this;
	}

	addTypes(args: { type: string, fn: ArgumentTypeCaster }[]) {
		for (const { type, fn } of args) {
		  this.handlers.command.resolver.addType(type, fn);
		}

		return this;
	}

	loadModules() {
		for (const handler of Object.values(this.handlers)) {
			handler.on('load', mod => this.emit('moduleLoad', mod));
		}

		const { listener, command, spawn, quest, item } = this.handlers;
		command.useListenerHandler(listener);
		listener.setEmitters({ listener, command, spawn, quest, item });
		for (const handler of [listener, command, spawn, quest, item]) {
			handler.loadAll();
		}

		return this;
	}

	async connectDB(): Promise<boolean | void> {
		try {
			const { uri, options } = this.mongoPath;
			const db = await mongoose.connect(uri, options);
			return this.emit('dbConnect', db);
		} catch (err) {
			console.error(err.message);
			throw err;
		}
	}

	async start(token: string = process.env.TOKEN): Promise<string> {
		await this.connectDB();
		return super.login(token);
	}
}
