import { Item, ItemOptions, ItemUpgrade, Context, CurrencyEntry, ItemEffects } from 'lava/index';

export interface PowerUpItemOptions extends Pick<ItemOptions, 'name' | 'price' | 'emoji' | 'shortInfo' | 'longInfo'>  {
	/**
	 * The type of check this item should be checked from for expiration.
	 * * inventory - it's presence in user inventory
	 * * time - it's expiration date
	 */
	checks: PowerUpItemCheck;
	/**
	 * The duration of this item.
	 */
	duration?: number;
	/**
	 * The upgrades of this powerup.
	 */
	upgrades: PowerUpItemUpgrades[];
}

export interface PowerUpItemUpgrades extends Partial<ItemUpgrade> {
	/**
	 * The duration of this item for this level.
	 */
	duration?: number;
}

type PowerUpItemCheck = 'inventory' | 'time';

export abstract class PowerUpItem extends Item {
	/**
	 * The type of check this item should be checked from for expiration.
	 * * inventory - it's presence in user inventory
	 * * time - it's expiration date
	 */
	public checks: PowerUpItemCheck;
	/**
	 * The duration of this item.
	 */
	public duration: (level: number) => number;

	/**
	 * Construct this powershit.
	 */
	public constructor(id: string, options: PowerUpItemOptions) {
		super(id, {
			name: options.name,
			emoji: options.emoji,
			price: options.price,
			shortInfo: options.shortInfo,
			longInfo: options.longInfo,
			upgrades: options.upgrades?.map(up => ({ sell: 0.33, ...up })) ?? [],
			sell: 0.33,
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
			category: 'Power-Up'
		});

		this.duration = (level: number) => options.duration ?? 0;
		this.checks = options.checks;
	}

	public abstract effect(effects: ItemEffects, entry?: CurrencyEntry): ItemEffects;

	public getDuration(entry: CurrencyEntry) {
		return this.duration(entry.items.get(this.id).level);
	}
}