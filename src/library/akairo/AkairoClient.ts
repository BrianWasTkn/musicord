/**
 * Hey girl welcome to my crib owo
 * @author BrianWasTaken
*/

import { Connector, Logger, CurrencyEndpoint, SpawnEndpoint, Imgen } from '..';
import { ClientUtil, CommandHandler, ListenerHandler, ItemHandler } from '.';
import { ClientOptions, MessageOptions, TextChannel } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
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
	public console = Logger.createInstance();
	public memer = new Imgen('https://dankmemer.services');
	public util = new ClientUtil(this);
	public db = new Connector(this);

	public listenerHandler: ListenerHandler;
	public commandHandler: CommandHandler;
	public itemHandler: ItemHandler;

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
		const db = await MongoDB.connect(auth.mongo, options.mongo);
		this.console.log('Client', `Mongoose v${db.version}`);
		return super.login(auth.discord);
	}
}