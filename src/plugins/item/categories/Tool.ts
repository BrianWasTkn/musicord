import { Item, ItemOptions, ItemUpgrade, Context, CurrencyEntry, ItemEffects } from 'lava/index';

export interface ToolItemOptions extends Pick<ItemOptions, 'name' | 'price' | 'emoji' | 'shortInfo' | 'longInfo'>  {
	/**
	 * The type of check this item should be checked from for expiration.
	 * * inventory - it's presence in user inventory
	 * * time - it's expiration date
	 */
	checks?: PowerUpItemCheck;
	/**
	 * The item upgrades of this tool.
	 */
	upgrades?: ItemUpgrade[];
}

type PowerUpItemCheck = 'inventory' | 'time';

export abstract class ToolItem extends Item {
	/**
	 * The type of check this item should be checked from for expiration.
	 * * inventory - it's presence in user inventory
	 * * time - it's expiration date
	 */
	public checks: PowerUpItemCheck;

	/**
	 * Construct a tool item.
	 */
	public constructor(id: string, options: ToolItemOptions) {
		super(id, {
			name: options.name,
			emoji: options.emoji,
			price: options.price,
			shortInfo: options.shortInfo,
			longInfo: options.longInfo,
			upgrades: options.upgrades,
			sell: 0.66,
			sale: true,
			inventory: true,
			shop: true,
			buyable: true,
			giftable: true,
			sellable: true,
			usable: true,
			push: true,
			premium: false,
			retired: false,
			category: 'Tool'
		});
	}
}