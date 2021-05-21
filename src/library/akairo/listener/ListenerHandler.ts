/**
 * Command Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandlerOptions, AbstractHandler, AbstractModuleOptions, LavaClient } from '..';
import { ListenerHandler as OldListenerHandler, Category } from 'discord-akairo';
import { Collection } from 'discord.js';
import { Listener } from '.';

/**
 * Command Handler
 * @extends {OldCommandHandler}
 * @implements {AbstractHandler}
*/
export class ListenerHandler extends OldListenerHandler implements AbstractHandler<Listener> {
	public categories: Collection<string, Category<string, Listener>>;
	public useNames: boolean;
	public modules: Collection<string, Listener>;
	public client: LavaClient;

	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
		this.useNames = options.useNames;
	}
	
	public add: (filename: string) => Listener;
    public findCategory: (name: string) => Category<string, Listener>;
    public load: (thing: string | Function, isReload?: boolean) => Listener;
    public loadAll: (directory?: string, filter?: import('discord-akairo').LoadPredicate) => this;
    public reload: (id: string) => Listener;
    public reloadAll: () => this;
    public remove: (id: string) => Listener;
    public removeAll: () => this;
}