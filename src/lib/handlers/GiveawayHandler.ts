import { EventEmitter } from 'events'
import { Collection } from 'discord.js'

/**
 * events:
 * * giveawayRoll - results
 * * giveawayReroll - reroll
 * * giveawayEnd - gEnd
 * * giveawayBlock - req not met/blacklisted
 * * giveawayReact - react
 * * giveawayError - an error occured
 */

/**
 * props:
 * 
 * client: Akairo.Client
 * giveaways: Lava.Giveaway;
 * * loop through all guilds
 * * check if any gaws exist
 * * if so, push it in this.giveaways[];
 * * then setTimeout intervals in order not to lose giveaways
 * 
 * options: Lava.GiveawayOptions
 * ready: boolean;
 */

class GiveawayHandler extends EventEmitter {
	public giveaways: Akairo.GiveawayHandler["giveaways"];
	public constructor(
		public client: Akairo.Client,
		public options: any,
		init: boolean = true
	) { super();
		
		this.client = client;
		this.giveaways = new Collection();
		// if (init) this._patch(); // save this for later
	}

	public async _patch(): Promise<GiveawayHandler> {
		// <GiveawayHandler>.giveaways
		const giveaways = await this.client.db.giveaways.fetchAll();
		for (const giveaway of giveaways) {
			const guild = await this.client.guilds.fetch(giveaway._id);
			this.giveaways.set(guild.id, [giveaway]);
			// this.interval()
		}

		return this;
	}

	public genEmbed() {}
	public genEndEmbed() {}
	public genRerollEmbed() {}
	public genNoWinnersEmbed() {}
}

export default GiveawayHandler;