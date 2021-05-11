import { Collection, MessageEmbed, MessageOptions } from 'discord.js';
import { HandlerPlus, Item } from '..';
import { AkairoError } from 'lib/utility/error';
import { Document } from 'mongoose';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';
import config from 'config/index';

const date = () => new Date();

export class ItemHandler<Mod extends Item = Item> extends HandlerPlus<Mod> {
	private intIsRunning: boolean;
	private ticked: boolean;
	public saleInterval: number;
	public nextSale: number;
	public sale: Handlers.Item.SaleData;
	public constructor(client: Lava, {
		directory,
		classToHandle = Item,
		extensions = ['.js', '.ts'],
		automateCategories,
		loadFilter,
	}: Constructors.Handlers.Item = {}) {
		if (!(
			classToHandle.prototype instanceof Item || classToHandle === Item)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE', 
				classToHandle.name, 
				Item.name
			);
		}
		
		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});

		this.client.once('ready', this.prepare);
	}

	protected prepare(): Promise<NodeJS.Timeout> {
		const { discount, item, lastSale } = this.getSale();
		const { interval } = config.item.discount;
		const { sleep } = this.client.util;

		this.sale = { discount, lastSale, id: item.id };
		this.nextSale = Date.now() + interval;
		this.saleInterval = interval;
		this.ticked = false;

		return sleep(interval).then(ms => setInterval(this.tick.bind(this), ms));
	}

	private tick(): this {
		const { discount, item, lastSale } = this.getSale();
		const { interval } = config.item.discount;

		this.sale = { discount, lastSale, id: item.id };
		this.nextSale += interval;
		return this;
	}

	public getSale() {
		const { randomNumber, randomInArray } = this.client.util;
		const { min, max } = config.item.discount, discount = randomNumber(min, max);
		const item = randomInArray([...this.modules.values()].filter(m => !m.premium));

		return { discount, item, lastSale: Date.now() };
	}
}
