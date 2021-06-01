import { LavaClient } from '../..';
import { Base } from 'discord.js';

export interface StructureOptions {
	client: LavaClient;
	id?: string;
}

export declare interface Structure extends Base {
	readonly client: LavaClient;
}

export class Structure extends Base {
	public readonly client: LavaClient;
	public id?: string;
	public constructor(options: StructureOptions) {
		super(options.client);
		if ('id' in options) {
			this.id = options.id;
		}
	}
}