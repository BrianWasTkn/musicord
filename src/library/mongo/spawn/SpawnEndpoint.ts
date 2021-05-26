import { SpawnEntry } from '.';
import { Endpoint } from '..';

export class SpawnEndpoint extends Endpoint<SpawnData> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(doc => {
			return doc ?? new this.model({ _id }).save();
		}).then(doc => new SpawnEntry(this.client, doc));
	}
}