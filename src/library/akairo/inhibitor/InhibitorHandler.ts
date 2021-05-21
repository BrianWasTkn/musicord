/**
 * Inhibitor Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandlerOptions, AbstractHandler, AbstractModuleOptions, LavaClient } from '..';
import { InhibitorHandler as OldInhibitorHandler, Category } from 'discord-akairo';
import { Collection } from 'discord.js';
import { Inhibitor } from '.';

/**
 * Inhibitor Handler
 * @extends {OldInhibitorHandler}
 * @implements {AbstractHandler}
*/
export class InhibitorHandler extends OldInhibitorHandler implements AbstractHandler<Inhibitor> {
	public categories: Collection<string, Category<string, Inhibitor>>;
	public useNames: boolean;
	public modules: Collection<string, Inhibitor>;
	public client: LavaClient;
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
		this.useNames = options.useNames;
	}
}