/**
 * Command Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandlerOptions, AbstractHandler, AbstractModuleOptions, LavaClient } from 'lava/akairo';
import { ListenerHandler as OldListenerHandler, Category } from 'discord-akairo';
import { Collection } from 'discord.js';
import { Listener } from '.';

export declare interface ListenerHandler extends OldListenerHandler {
  /**
   * All categories this listener handler hold.
   */
  categories: Collection<string, Category<string, Listener>>;
  /**
   * All listeners this handler hold.
   */
  modules: Collection<string, Listener>;
  /**
   * The client instance for this handler.
   */
  client: LavaClient;
  /**
   * Add a listener.
   */
  add: (filename: string) => Listener;
  /**
   * Find a category of commands.
   */
  findCategory: (name: string) => Category<string, Listener>;
  /**
   * Load a listener based from the file path or a class.
   */
  load: (thing: string | Function, isReload?: boolean) => Listener;
  /**
   * Reload a listener.
   */
  reload: (id: string) => Listener;
  /**
   * Remove a listener.
   */
  remove: (id: string) => Listener;
}

export class ListenerHandler extends OldListenerHandler implements AbstractHandler<Listener> {
	/**
   * Construct a listener handler.
   */
  public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}