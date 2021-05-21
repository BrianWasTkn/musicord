import { Document } from 'mongoose';

export abstract class UserEntry<Data extends Document> {
	public constructor(public data: Data) {
		this.data = data;
	}

	public save(): Promise<Data> {
		return this.data.save();
	}
}