import { ModulePlus, ItemHandler } from '..';
import { Context } from 'lib/extensions';

/**
 * Represents an Item.
 * @absract @extends {ModulePlus}
*/
export abstract class Item extends ModulePlus {
	public handler: ItemHandler<this>;
	public showInventory: boolean;
	public moddedPrice: number;
	public showInShop: boolean;
	public sellable: boolean;
	public premium: boolean;
	public buyable: boolean;
	public checks: Handlers.Item.CheckState;
	public usable: boolean;
	public emoji: string;
	public info: Handlers.Item.Info;
	public tier: number;
	public cost: number;

	constructor(id: string, opt: Partial<Constructors.Modules.Item>) {
		super(id, { category: opt.category, name: opt.name });

		this.info = opt.info;
		this.tier = Number(opt.tier);
		this.cost = Number(opt.cost);
		this.buyable = Boolean(opt.buyable);
		this.sellable = Boolean(opt.sellable);
		this.premium = Boolean(opt.premium);
		this.usable = Boolean(opt.usable);
		this.emoji = opt.emoji as string;
		this.moddedPrice = opt.premium
			? opt.cost * 1000e6 // to sort in shop
			: opt.cost;
		this.showInShop = opt.showInShop;
		this.showInventory = opt.showInventory;
		this.checks = [].concat(opt.checks || []);
	}

	public findInv(inventory: Currency.InventorySlot[], item: this | Item = this) {
		return inventory.find((i) => i.id === item.id);
	}

	public use(msg: Context, times?: number): PromiseUnion<Handlers.Item.UseReturn> {
		return { content: 'This item perhaps, is a work in progress :)' };
	}
}

export default Item;