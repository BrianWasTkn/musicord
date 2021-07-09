import { Endpoint, SpawnEntry } from 'lava/mongo';
import { UserPlus } from 'lava/discord';

export interface SpawnEndpointEvents {
	/** Emitted on profile creation. */
	create: [entry: SpawnEntry, user: UserPlus];
	/** Emitted when some rich dude paid the poor dude. */
	spawnPayment: [entry: SpawnEntry, user: UserPlus, args: { author: UserPlus; amount: number; }];
	/** Emitted when the poor duded tries to join an event but they're capped already. */
	spawnCapped: [entry: SpawnEntry, user: UserPlus, args: { author: UserPlus; }];
}

export class SpawnEndpoint extends Endpoint<SpawnProfile> {
	/** 
	 * Listen for currency events. 
	 */
	public on: <K extends keyof SpawnEndpointEvents>(event: K, listener: (...args: SpawnEndpointEvents[K]) => Awaited<void>) => this;

	/**
	 * Fetch some bank robber from the db.
	 */
	public fetch(_id: string): Promise<SpawnEntry> {
		return this.model.findOne({ _id }).then(async doc => {
			return doc ?? await (new this.model({ _id })).save();
		}).then(doc => new SpawnEntry(this, doc));
	}
}