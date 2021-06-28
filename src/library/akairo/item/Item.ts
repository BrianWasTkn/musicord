/**
 * Base class for all items.
 * @author BrianWasTaken
 */

import { AbstractModuleOptions, AbstractModule } from 'lava/akairo';
import { Context, CurrencyEntry } from 'lava/index'; 
import { MessageOptions } from 'discord.js';
import { ItemHandler } from '.';

export interface ItemUpgrade extends Partial<Pick<ItemOptions, 'name' | 'price' | 'emoji' | 'sell' | 'premium' | 'shortInfo' | 'longInfo'>> {
	/**
	 * The level of this item.
	 * Note: It's automatic, no need to implement this.
	 */
	level?: number;
}

export interface ItemOptions extends AbstractModuleOptions {
	/** The name of this item */
	name: string;
	/** The price of this item for level 0 */
	price: number;
	/** The emoji of this item for level 0 */
	emoji: string;
	/** The sell rate of this item, fixed rate */
	sell: number;

	/** Wether this item shouldn't be on sale */
	sale: boolean;
	/** Wether this item should be in your inventory */
	inventory: boolean;
	/** Wether this item should be in shop */
	shop: boolean;
	/** Wether this item is buyable from the shop */
	buyable: boolean;
	/** Wether this item is tradeable using `lava gift` */
	giftable: boolean;
	/** Wether you can sell this item or not */
	sellable: boolean;
	/** Wether you're allowed to use this or not */
	usable: boolean;
	/** Wether to auto update user inventory if this item is new */
	push: boolean;
	/** The premium state of this item. Note that price will be divided by 1000. */
	premium?: boolean;
	/**
	 * Wether this item has been retired.
	 * config properties overriden by this option:
	 * * showInInventory = false
	 * * showInShop = false
	 * * buyable = false
	 * * giftable = false
	 * * usable = false
	 * * sellable = false
	 */
	retired?: boolean;

	/** The shop display info of this item */
	shortInfo?: string;
	/** The long description of this item */
	longInfo?: string;

	/** The upgrades of this item */
	upgrades: ItemUpgrade[];
}

export abstract class Item extends AbstractModule {
	/** The price of this item for level 0 */
	public price: number;
	/** The emoji of this item for level 0 */
	public emoji: string;
	/** The sell rate of this item, fixed rate */
	public sell: number;

	/** Wether this item shouldn't be on sale */
	public sale: boolean;
	/** Wether this item should be in your inventory */
	public inventory: boolean;
	/** Wether this item should be in shop */
	public shop: boolean;
	/** Wether this item is buyable from the shop */
	public buyable: boolean;
	/** Wether this item is tradeable using `lava gift` */
	public giftable: boolean;
	/** Wether you can sell this item or not */
	public sellable: boolean;
	/** Wether you're allowed to use this or not */
	public usable: boolean;
	/** Wether to auto update user inventory if this item is new */
	public push: boolean;
	/** The premium state of this item. Note that price will be divided by 1000. */
	public premium?: boolean;
	/**
	 * Wether this item has been retired.
	 * config properties overriden by this option:
	 * * showInInventory = false
	 * * showInShop = false
	 * * buyable = false
	 * * giftable = false
	 * * usable = false
	 * * sellable = false
	 */
	public retired?: boolean;

	/** The shop display info of this item */
	public shortInfo: string;
	/** The long description of this item */
	public longInfo: string;

	/** The upgrades of this item */
	public upgrades: ItemUpgrade[];

	/** The handler this item belongs to. */
	public handler: ItemHandler;

	/**
	 * The constructor for any item.
	 */
	public constructor(id: string, options: Partial<ItemOptions>) {
		super(id, { name: options.name, category: options.category });
		this.price = options.price;
		this.emoji = options.emoji;
		this.sell = options.sell;

		this.sale = options.sale;
		this.inventory = options.inventory;
		this.shop = options.shop;
		this.buyable = options.buyable;
		this.giftable = options.giftable;
		this.sellable = options.sellable;
		this.usable = options.usable;
		this.push = options.push;
		this.premium = options.premium ?? false;
		this.retired = options.retired ?? false;

		this.shortInfo = options.shortInfo;
		this.longInfo = options.longInfo;

		if (this.premium) {
			this.price /= 1000;
		}

		if (this.retired) {
			this.inventory = false;
			this.shop = false;
			this.buyable = false;
			this.giftable = false;
			this.usable = false;
			this.sellable = false;
		}

		/**
		 * The upgrades for this item.
		*/
		this.upgrades = [{
			emoji: this.emoji,
			level: 0,
			name: this.name,
			price: this.price,
			premium: false,
			sell: 0,
			longInfo: this.longInfo,
			shortInfo: this.shortInfo
		}, ...options.upgrades.map(
			(up: ItemUpgrade, i: number, arr) => this._assign(up, {
				emoji: this.emoji,
				level: i + 1,
				name: this.name,
				price: this.price,
				premium: i === arr.length - 1,
				sell: 0,
				longInfo: this.longInfo,
				shortInfo: this.shortInfo
			})
		)];
	}

	/**
	 * Assign the default properties of constructed items to default ones.
	 * @private
	 * @returns {object} the object
	 */
	private _assign<A>(o1: A, o2: Partial<A>): A {
		return Object.assign(o2, o1);
	}

	/**
	 * Main method to use items.
	*/
	public use(context: Context, entry: CurrencyEntry, times = 1): PromiseUnion<MessageOptions> {
		return { reply: { messageReference: context.id, failIfNotExists: false }, embed: {
			description: 'Used your item, now what?',
			title: `${this.emoji} ${this.name}`, color: 0xfafafa,
		}};
	}

	/**
	 * Simple method to buy this item from the shop.
	 */
	public buyItem(entry: CurrencyEntry, amount: number) {
		const { cost, sell } = this.sales(entry);
		const newPrice = Math.round(cost) * Math.trunc(amount);
		return (this.premium ? entry.remKeys(newPrice) : entry.removePocket(newPrice))
			.addItem(this.id, amount).save().then(this.upgrade);
	}

	/**
	 * Simple method to sell this item to the shop.
	 */
	public sellItem(entry: CurrencyEntry, amount: number) {
		const { cost, sell } = this.sales(entry);
		const newPrice = Math.round(cost * sell) * Math.trunc(amount);
		return (this.premium ? entry.addKeys(newPrice) : entry.addPocket(newPrice))
			.subItem(this.id, amount).save().then(this.upgrade);
	}

	/**
	 * Get the upgrade of this item.
	 */
	public get upgrade() {
		return (entry: CurrencyEntry) => {
			const { discount, item } = this.handler.sale;
			const { level } = entry.items.get(this.id);
			
			return this.upgrades[level];
		};
	}

	/**
	 * Get the sale of this item.
	 */
	public get sales() {
		const { discount, item } = this.handler.sale;
		const calc = (amount: number) => {
			return this.calcDiscount(amount, discount);
		};

		return (entry: CurrencyEntry) => {
			const { price, sell } = this.upgrade(entry);
			return item.id === this.id ? {
				sell: calc(price * sell),
				cost: calc(price),
				item: this,
			} : {};
		}
	}

	/**
	 * Calc discount for shit.
	 */
	public calcDiscount(amount: number, discount: number) {
		return amount - (amount * (discount / 100));
	}
}