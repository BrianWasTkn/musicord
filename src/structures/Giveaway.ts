import { 
	EventEmitter 
} from 'events'
import { Collection, Guild, Message } from 'discord.js'

class GiveawayHandler extends EventEmitter implements Akairo.GiveawayHandler {
	public client: Akairo.Client;
	public giveaways: Akairo.GiveawayHandler["giveaways"];
	public constructor(client: Akairo.Client) {
		super();
		
		this.client = client;
		this.giveaways = new Collection();
	}
}

export default GiveawayHandler;