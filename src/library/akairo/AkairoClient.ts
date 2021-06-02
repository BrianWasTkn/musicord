/**
 * Hey girl welcome to my crib owo
 * @author BrianWasTaken
*/

import { ClientUtil, CommandHandler, ListenerHandler, ItemHandler, PluginManager } from '.';
import { Connector, Logger, CurrencyEndpoint, SpawnEndpoint, Imgen } from '..';
import { ClientOptions, MessageOptions, TextChannel } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
import { join } from 'path';
import MongoDB from 'mongoose';

import '../discord/structures';

export interface ClientConnectOptions {
	auth?: {
		discord: string;
		mongo: string;
	};
	options?: {
		mongo: MongoDB.ConnectOptions,
	}
}

export class LavaClient extends AkairoClient {
	/**
	 * Our fancy logger.
	 */
	public console = Logger.createInstance();
	/**
	 * Dank Memer imgen.
	 */
	public memer = new Imgen('https://dankmemer.services');
	/**
	 * Akairo client utils.
	 */
	public util = new ClientUtil(this);
	/**
	 * The db adapter.
	 */
	public db = new Connector(this);
	/**
	 * Our plugins.
	 */
	public plugins = new PluginManager(this, {
		directory: join(__dirname, '..', '..', 'plugins')
	});
	/**
	 * Connect our bot to stuff we could connect to.
	 */
	public async connect({
		auth = {
			discord: process.env.DISCORD_TOKEN,
			mongo: process.env.MONGO_URI,
		},
		options = {
			mongo: {
				useUnifiedTopology: true,
				useNewUrlParser: true
			}
		}
	}: ClientConnectOptions = {}) {
		try {
			const db = await MongoDB.connect(auth.mongo, options.mongo);
			this.console.log('Client', `Mongoose v${db.version}`);
			try {
				return super.login(auth.discord);
			} catch(e) {
				this.console.error('Client', e, true);
			}
		} catch(e) {
			this.console.error('Mongo', e, true);
		}
	}
}