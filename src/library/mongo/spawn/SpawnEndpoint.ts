import { SpawnEntry } from '.';
import { Endpoint } from 'lava/mongo';

export class SpawnEndpoint extends Endpoint<SpawnProfile> {
	public fetch(_id: string): Promise<SpawnEntry> {
		return this.model.findOne({ _id }).then(async doc => {
			return doc ?? await (new this.model({ _id })).save();
		}).then(doc => new SpawnEntry(this, doc));
	}
}