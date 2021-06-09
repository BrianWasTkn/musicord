import { SpawnEntry } from '.';
import { Endpoint } from 'lava/mongo';

export class SpawnEndpoint extends Endpoint<SpawnProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(doc => {
			return doc ?? new this.model({ _id }).save();
		}).then(doc => new SpawnEntry(this.client, doc));
	}
}