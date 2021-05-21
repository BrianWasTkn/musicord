/**
 * Listener v2
 * @author BrianWasTaken
*/

import { Listener as OldListener, ListenerOptions, Category } from 'discord-akairo';
import { Collection, MessageOptions } from 'discord.js';
import { AbstractModule, LavaClient } from '..';
import { ListenerHandler } from '.';
import { Context } from '../..';

/**
 * Listener
 * @extends {OldListener}
 * @implements {AbstractModule}
*/
export class Listener extends OldListener implements AbstractModule {
	public category: Category<string, this>;
	public handler: ListenerHandler;
	public client: LavaClient;
	public name: string;
	public constructor(id: string, options: ListenerOptions) {
		super(id, options);
		this.name = options.name;
	}
}