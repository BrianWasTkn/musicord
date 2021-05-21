/**
 * Hey girl welcome to my crib owo
 * @author BrianWasTaken
*/

import { ClientOptions, MessageOptions, TextChannel } from 'discord.js';
import { Connect, Logger } from '..';
import { AkairoClient } from 'discord-akairo';
import { ClientUtil } from '.';

import MongoDB from 'mongoose';

export interface ClientConnectOptions {
	auth: {
		discord: string;
		mongo: string;
	};
	options: {
		mongo: MongoDB.ConnectOptions,
	}
}

export class LavaClient extends AkairoClient {
	public console = Logger.createInstance();
	public util = new ClientUtil(this);
	public db = Connect(this);

	public async connect({
		auth = {
			discord: process.env.DISCORD_TOKEN,
			mongo: process.env.MONGO_URI,
		},
		options = {
			mongo: {}
		}
	}: ClientConnectOptions) {
		await MongoDB.connect(auth.mongo, options.mongo);
		return super.login(auth.discord);
	}
}