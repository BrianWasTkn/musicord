import { Item, ItemOptions, ItemAssets, ItemConfig, ItemUpgrade, Context, CurrencyEntry, ItemEffects, Inventory } from 'lava/index';

export type PowerItemAssets = Omit<ItemAssets, 'sellRate'>;

export interface PowerItemConfig extends Pick<ItemConfig, 'premium' | 'push' | 'retired'> {
	/** The default duration of this power-up. */
	duration?: number;
}

export interface PowerItemUpgrades extends Partial<ItemUpgrade> {
	/** The new duration of this item for this level. */
	duration?: number;
}

export interface PowerItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this item. */ 
	assets: PowerItemAssets;
	/** The config for this power-up. */
	config?: PowerItemConfig;
	/** The upgrades of this power-up. */
	upgrades: PowerItemUpgrades[];
}

export abstract class PowerUpItem extends Item {
	/** The duration of this power-up. */
	public duration: number;

	/**
	 * Construct this powershit.
	 */
	public constructor(id: string, options: PowerItemOptions) {
		const { assets, config, upgrades } = options;
		super(id, {
			assets: {
				sellRate: 0.2,
				category: 'Power-Up',
				...assets
			},
			config: {
				premium: false,
				buyable: true,
				sellable: true,
				usable: true,
				giftable: true,
				shop: true,
				sale: true,
				inventory: true,
				...config
			},
			upgrades: options.upgrades?.map(up => ({ 
				sell: 0.2, 
				...up 
			})) ?? [],
		});

		this.duration = config.duration ?? 0;
	}

	public effect(effects: ItemEffects, entry?: CurrencyEntry): ItemEffects {
		return effects;
	}

	public getUpgrade(thisInv: Inventory) {
		return super.getUpgrade(thisInv) as ReturnType<Item['getUpgrade']> & PowerItemUpgrades;
	}

	public getDuration(entry: CurrencyEntry) {
		return this.getUpgrade(entry.items.get(this.id)).duration;
	}
}