import { LavaClient } from '..';
import { Base } from 'discord.js';

export interface StructureOptions {
	client: LavaClient;
	id: string;
}

export declare interface Structure extends Base {
	client: LavaClient;
}

export class Structure extends Base {
	public id: string;
	public constructor(options: StructureOptions) {
		super(options.client);
		this.id = options.id;
	}
}