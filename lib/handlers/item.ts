import {
	AkairoHandlerOptions,
	AkairoModuleOptions,
	AkairoHandler,
	AkairoModule,
	AkairoError,
} from 'discord-akairo'
import {
	Collection
} from 'discord.js'
import {
	Lava
} from '../Lava'
import {
	ItemOptions
} from '../interface/handlers/item'

export class ItemHandler extends AkairoHandler {
	modules: Collection<string, Item>;
	client: Lava;

	constructor(
		client: Lava,
		opt: { directory: string }
	) {
		super(client, {
			automateCategories: true,
			classToHandle: Item,
			directory: opt.directory,
			extensions: ['.js', '.ts']
		});
	}
}

export class Item extends AkairoModule {
	sellable: boolean;
	buyable: boolean;
	client: Lava;
	usable: boolean;
	info: string;
	cost: number;

	constructor(id: string, opt: ItemOptions) {
		const { category } = opt;
		super(id, { category });

		this.info = String(opt.info);
		this.cost = Number(opt.cost);
		this.buyable = opt.buyable;
		this.sellable = opt.sellable;
		this.usable = opt.usable;

	}

	async exec() {
		throw new AkairoError(`[Item] Method not implemented yet.`)
	}
}	