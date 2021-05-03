import { Collection, MessageEmbed, MessageOptions } from 'discord.js';
import { HandlerPlus, HandlerPlusOptions, Item } from '..';
import { Document } from 'mongoose';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';
import config from 'config/index';

export class ItemHandler<Mod extends Item = Item> extends HandlerPlus<Mod> {
	private intIsRunning: boolean;
	private saleInterval: number;
	private ticked: boolean;
	public sale: Handlers.Item.SaleData;

	constructor(
		client: Lava,
		{
			directory = './src/items',
			classToHandle = Item,
			automateCategories = true,
		}: HandlerPlusOptions
	) {
		super(client, {
			directory,
			classToHandle,
			automateCategories,
		});

		this.prepare();
	}

	prepare(): this['client'] {
		return this.client.once('ready', () => {
			const { sleep } = this.client.util;
			const { interval } = config.item.discount;
			const { discount, item, lastSale } = this.getSale();
			this.sale = { discount, lastSale, id: item.id };
			this.saleInterval = interval;
			this.intIsRunning = false;
			this.ticked = false;
			const left = 60 - new Date().getMinutes();
			return this.tick(Boolean(left));
		});
	}

	tick(first: boolean): NodeJS.Timeout {
		let catchup = first;
		let now = new Date();

		if (!this.ticked) {
			this.client.util.console.log(this.constructor.name, `Next Sale in ${60 - now.getSeconds()} Seconds.`)
		}

		return setTimeout(async () => {
			// The 60-second tick
			now = new Date();

			// Immediate sale if catching up (let's say, bot login)
			if (catchup) {
				const { discount, item, lastSale } = this.getSale();
				this.sale = { discount, lastSale, id: item.id };
				catchup = false;
			}

			// Tick
			if (now.getSeconds() === 0) {
				if (!this.ticked) this.ticked = true;
			}

			// Roll Interval (only once)
			if (!this.intIsRunning && now.getMinutes() === 0 && this.ticked) {
				this.intIsRunning = true;
				this.runSaleInterval.call(this);
			}

			return this.tick(false);
		}, (60 - now.getSeconds()) * 1e3 - now.getMilliseconds());
	}

	getSale() {
		const { randomNumber, randomInArray } = this.client.util;
		const { min, max } = config.item.discount, discount = randomNumber(min, max);
		const item = randomInArray([...this.modules.values()].filter(m => !m.premium));

		return { discount, item, lastSale: Date.now() };
	}

	runSaleInterval(): NodeJS.Timeout {
		return setTimeout(() => {
			const { discount, item, lastSale } = this.getSale();
			this.sale = { discount, lastSale, id: item.id };
			return this.runSaleInterval();
		}, this.saleInterval);
	}
}
