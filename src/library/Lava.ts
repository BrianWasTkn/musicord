import { Collection, ClientEvents, ClientOptions, Message } from 'discord.js';
import { ConnectOptions } from 'mongoose';
import { EventEmitter } from 'events';
import { Util } from './utility/util';
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
	InhibitorHandler, Inhibitor,
	LotteryHandler, ModulePlus,
	ListenerHandler, Listener,
	CommandHandler, Command,
	SpawnHandler, Spawn,
	QuestHandler, Quest,
	ItemHandler, Item,
	ArgHandler, Arg,
} from './objects';

// def imports
import CurrencyFunc from './mongo/currency/functions';
import SpawnerFunc from './mongo/spawns/functions';
import mongoose from 'mongoose';

// ext structures
import { Context } from './extensions';
import './extensions';

interface ClientEventsPlus extends ClientEvents {
	messageUpdate: [om: Context, nm: Context];
	messageDelete: [message: Context];
	moduleLoad: [module: ModulePlus];
	dbConnect: [db: typeof mongoose];
	message: [message: Context];
}

interface DB {
	currency: CurrencyFunc<CurrencyProfile>;
	spawns: SpawnerFunc<SpawnDocument>;
}

interface Handlers {
	inhibitor: InhibitorHandler<Inhibitor>;
	listener: ListenerHandler<Listener<Lava>>;
	argument: ArgHandler<Arg>;
	command: CommandHandler<Command>;
	lottery: LotteryHandler;
	spawn: SpawnHandler<Spawn>;
	quest: QuestHandler<Quest>;
	item: ItemHandler<Item>;
}

export interface HandlerConstructor {
	inhibitor: Constructors.Handlers.Inhibitor;
	listener: Constructors.Handlers.Listener;
	argument: Constructors.Handlers.Argument;
	command: Constructors.Handlers.Command;
	spawn: Constructors.Handlers.Spawn;
	quest: Constructors.Handlers.Quest;
	item: Constructors.Handlers.Item;
}

interface MongoData {
	options?: ConnectOptions;
	uri: string;
}

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
			inhibitor: new InhibitorHandler<Inhibitor>(this, handlers.inhibitor),
			listener: new ListenerHandler<Listener<this>>(this, handlers.listener),
			argument: new ArgHandler<Arg>(this, handlers.argument),
			command: new CommandHandler<Command>(this, handlers.command),
			spawn: new SpawnHandler<Spawn>(this, handlers.spawn),
			quest: new QuestHandler<Quest>(this, handlers.quest),
			item: new ItemHandler<Item>(this, handlers.item),
			lottery: new LotteryHandler(this),
		};
	}

	public setMongoPath(uri: string, options: ConnectOptions = {}) {
		this.mongoPath = { uri, options };
		return this;
	}

	public addTypes() {
		for (const arg of this.handlers.argument.modules.values()) {
			this.handlers.command.resolver.addType(arg.id, arg.exec.bind(arg) as (
				(m: Message, p: string) => any)
			);
		}

		return this;
	}

	public loadAll() {
		const { listener, inhibitor, argument, lottery, command, spawn, quest, item } = this.handlers;
		command.useListenerHandler(listener).useInhibitorHandler(inhibitor);
		listener.setEmitters({ listener, lottery, command, spawn, quest, item });
		
		const onLoad = (mod: ModulePlus) => this.emit('moduleLoad', mod);
		[listener, inhibitor, argument, command, spawn, quest, item]
		.forEach(h => h.on('load', onLoad as ((m: AkairoModule) => boolean)).loadAll());

		return this;
	}

	public async connectDB(): Promise<boolean | void> {
		try {
			const { uri, options } = this.mongoPath;
			const db = await mongoose.connect(uri, options);
			return this.emit('dbConnect', db);
		} catch (err) {
			console.error(err.message);
			throw err;
		}
	}

	public async start(token: string = process.env.TOKEN): Promise<string> {
		await this.connectDB();
		return super.login(token);
	}
}
