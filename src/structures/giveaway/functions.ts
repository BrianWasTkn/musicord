import Lava from 'discord-akairo'
import { GiveawayData } from 'discord-giveaways'
import Giveaway from './model'

import { Document, Model, model } from 'mongoose'

interface GiveawayDocument {
	giveaways: GiveawayData[];
}

const dbGiveaway = (client: Lava.Client) => ({
	fetch: async (): Promise<GiveawayData[]> => {
		const db: Document<GiveawayDocument>[] = await Giveaway.find({});
		return db.map(g => g.);
	},
	push: async (data: GiveawayData): Promise<any> => {}
});

export default dbGiveaway;