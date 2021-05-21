/**
 * Spawn Functions
 * Author: brian
 */

import type { Snowflake, User } from 'discord.js';
import type { Model, Document } from 'mongoose';
import type { Lava } from 'lib/Lava';

import Spawn from './model';

export default class SpawnEndpoint<Profile extends SpawnDocument> {
	model: Model<Document<SpawnDocument>>;
	bot: Lava;

	constructor(client: Lava) {
		this.model = Spawn;
		this.bot = client;
	}

	fetch = async (userID: Snowflake): Promise<Profile> => {
		const data = ((await this.model.findOne({ userID })) ||
		new this.model({ userID })) as Profile;

		return data.save() as Promise<Profile>;
	};
}
