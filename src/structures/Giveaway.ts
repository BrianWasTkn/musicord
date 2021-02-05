import { 
	Manager,
	ManagerOptions,
	GiveawayData,
	GiveawaysManager
} from 'discord-giveaways'
import { 
	Client 
} from 'discord-akairo'
import model from './giveaway/model'

export class GiveawayHandler extends GiveawaysManager implements Manager {
	public client: Client;
	public options: ManagerOptions;
	public constructor(
		client: Client, 
		options: ManagerOptions
	) { super(client, options); }

	public async getAllGiveaways(): Promise<GiveawayData[]> {
		const giveaways = await db.get('giveaways');
		return giveaways;
	}

	public async saveGiveaway(messageID: string, data: GiveawayData): Promise<boolean> {
		await db.push('giveaways', data);
		return true;
	}

	public async editGiveaway(messageID: string, data: GiveawayData): Promise<boolean> {
		const giveaways = await db.get('giveaways');
		const newGaw = giveaways.filter((g: GiveawayData) => {
			return g.messageID !== messageID;
		});

		newGaw.push(data);
		await db.set('giveaways', newGaw);
		return true;
	}

	public async deleteGiveaway(id: string): Promise<any> {
		const giveaways = await db.get('giveaways');
		const newGaw = giveaways.filter((g: GiveawayData) => {
			return g.messageID !== id;
		});

		await db.set('giveaways', newGaw);
		return true;
	} 
}