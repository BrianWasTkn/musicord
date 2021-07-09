import { Endpoint, UserEntry, CurrencyEntry } from 'lava/mongo';
import { Item, Command } from 'lava/akairo';
import { UserPlus } from 'lava/discord';

export interface CurrencyEndpointEvents {
	/** Emitted on profile creation. */
	create: [entry: CurrencyEntry, user: UserPlus];
	/** Emitted when a user dies.  */
	death: [entry: CurrencyEntry, user: UserPlus, args: { item: Item; amount: number; coins: number; }];
	/** Emitted when someone shares coins.  */
	coinShare: [entry: CurrencyEntry, user: UserPlus, args: { sharer: UserPlus; coins: number; }];
	/** Emitted when someone gifts items. */
	itemGift: [entry: CurrencyEntry, user: UserPlus, args: { gifter: UserPlus; amount: number }];
	/** Emitted when they leveld up. */
	levelUp: [entry: CurrencyEntry, user: UserPlus, /** args: { rewards: { multi?: number; coins?: number; keys?: number; items?: [number, string] } } */]
}

export class CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	/** 
	 * Listen for currency events. 
	 */
	public on: <K extends keyof CurrencyEndpointEvents>(event: K, listener: (...args: CurrencyEndpointEvents[K]) => Awaited<void>) => this;
	/**
	 * Emit currency events.
	 */
	public emit: <K extends keyof CurrencyEndpointEvents>(event: K, ...args: CurrencyEndpointEvents[K]) => boolean;

	/** 
	 * Fetch something from the db. 
	 */
	public fetch(_id: string): Promise<CurrencyEntry> {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const pushed = [this.updateItems(doc), this.updateGames(doc), this.updateTrade(doc)];
			return pushed.some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new CurrencyEntry(this, doc));
	}

	/**
	 * Update user inventory.
	 */
	public updateItems(doc: CurrencyProfile) {
		const updated: Item[] = [];
		for (const mod of this.client.handlers.item.modules.filter(i => i.push).values()) {
			if (!doc.items.find(i => i.id === mod.id)) {
				doc.items.push({ id: mod.id, amount: 0, uses: 0, expire: 0, level: 0, multi: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}

	/**
	 * Update gamble stats.
	 */
	public updateGames(doc: CurrencyProfile) {
		const updated: Command[] = [];
		for (const mod of ['blackjack', 'gamble', 'slots'].map(c => this.client.handlers.command.modules.get(c))) {
			if (!doc.gamble.find(g => g.id === mod.id)) {
				doc.gamble.push({ id: mod.id, wins: 0, loses: 0, won: 0, lost: 0, streak: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}

	/**
	 * Update trade stats.
	 */
	public updateTrade(doc: CurrencyProfile) {
		const updated: Command[] = [];
		for (const mod of ['give', 'gift'].map(c => this.client.handlers.command.modules.get(c))) {
			if (!doc.trade.find(t => t.id === mod.id)) {
				doc.trade.push({ id: mod.id, in: 0, out: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}