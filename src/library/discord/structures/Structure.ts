import { LavaClient } from 'lava/akairo';
import { Base } from 'discord.js';

export interface StructureOptions {
	/**
	 * The client - hint: typing this shit is actually getting very annoying.
	 */
	client: LavaClient;
	/**
	 * The id of this structure - which I hate so bad.
	 */
	id?: string;
}

export declare interface Structure extends Base {
	/**
	 * The client instance.
	 * @readonly
	 */
	readonly client: LavaClient;
}

export class Structure extends Base {
	/**
	 * The id for this struct.
	 */
	public id?: string;
	/**
	 * Construct a basic structure.
	 */
	public constructor(options: StructureOptions) {
		super(options.client);
		if ('id' in options) {
			this.id = options.id;
		}
	}
}