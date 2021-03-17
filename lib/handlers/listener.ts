import { 
	ListenerHandler as _ListenerHandler,
	Listener as _Listener,
	AkairoHandlerOptions,
	ListenerOptions,
	Category
} from 'discord-akairo'
import { Collection } from 'discord.js'
import { Lava } from '@lib/Lava'

export class Listener extends _Listener {
	client: Lava;
	constructor(id: string, options: ListenerOptions) {
		super(id, options);
	}
}

export class ListenerHandler<ListenerModule extends Listener> extends _ListenerHandler {
	categories: Collection<string, Category<string, ListenerModule>>;
	modules: Collection<string, ListenerModule>;
	client: Lava;
	constructor(client: Lava, {
		classToHandle = Listener,
		directory = './src/emitters',
	}: AkairoHandlerOptions) {
		super(client, {
			classToHandle,
			directory
		});
	}
}