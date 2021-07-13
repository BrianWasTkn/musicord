import { CribEntry, Endpoint, EndpointEvents } from 'lava/mongo';
import { UserPlus } from 'lava/discord';
import { Donation } from 'lava/akairo';

export interface CribEndpointEvents extends EndpointEvents<CribEntry> {
	/** Emitted when a dono is added.  */
	donoAdd: [entry: CribEntry, user: UserPlus, args: { author: UserPlus; amount: number; }];
	/** Emitted when a dono is removed. */
	donoRemove: [entry: CribEntry, user: UserPlus, args: { author: UserPlus; amount: number }];
}

export interface CribEndpoint extends Endpoint<CribProfile> {
	/** 
	 * Listen for crib events. 
	 */
	on: <K extends keyof CribEndpointEvents>(event: K, listener: (...args: CribEndpointEvents[K]) => Awaited<void>) => this;
	/**
	 * Emit crib events.
	 */
	emit: <K extends keyof CribEndpointEvents>(event: K, ...args: CribEndpointEvents[K]) => boolean;
}

export class CribEndpoint extends Endpoint<CribProfile> {
	/**
	 * Fetch smth form the db.
	 */
	public fetch(_id: string): Promise<CribEntry> {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const pushed = [this.updateDonos(doc)];
			return pushed.some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new CribEntry(this, doc));
	}

	/**
	 * Push all donos.
	 */
	public updateDonos(doc: CribProfile) {
		const updated: Donation[] = [];
		for (const mod of this.client.handlers.donation.modules.values()) {
			if (!doc.donations.find(i => i.id === mod.id)) {
				doc.donations.push({ id: mod.id, amount: 0, count: 0, donations: [] });
				updated.push(mod);
			}
		}

		return updated;
	}
}