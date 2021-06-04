import { LavaClient, Plugin, AbstractHandler } from '.';
import { Collection, Constructable } from 'discord.js';
import { AkairoHandler } from 'discord-akairo';

import EventEmitter from 'events';
import path from 'path';
import fs from 'fs';

interface AkairoManagerOptions {
	/**
	 * The directory where all plugins are stored.
	 */
	directory: string;
}

export class PluginManager extends EventEmitter {
	/**
	 * The client instance.
	 */
	public client: LavaClient;
	/**
	 * The directory.
	 */
	public directory: string;
	/**
	 * The collection of plugins.
	 */
	public plugins: CollectionFlake<Plugin>;

	/**
	 * Constructor for this plugin manager.
	 */
	public constructor(client: LavaClient, options: AkairoManagerOptions) {
		super();
		/** @type {LavaClient} */
		this.client = client;
		/** @type {string} */
		this.directory = options.directory;
		/** @type {Collection<string, Plugin>} */
		this.plugins = new Collection();
	}

	/**
	 * Walks in all folders on the given directory.
	 */
	readSync(dir: string) {
		return fs.statSync(dir).isDirectory()
			? [].concat(...fs.readdirSync(dir))
				.map(d => path.join(dir, d))
				.filter(Boolean)
			: undefined;
	}

	/**
	 * Register all plugins.
	 */
	register(dir = this.directory) {
		const plugins: Plugin[] = this.readSync(dir)
			.map(e => require(e)?.default)
			.filter(Boolean);

		for (const plugin of plugins) {
			if (plugin instanceof Plugin) {
				plugin.client = this.client;
				plugin.initHandler();
				this.plugins.set(plugin.name, plugin);
			}
		}

		return this.plugins;
	}

	/**
	 * Load all plugins.
	 */
	loadAll() {
		for (const plugin of Array.from(this.register().values())) {
			if (plugin.handler) this.emit('load', plugin.load());
		}

		return this;
	}
}