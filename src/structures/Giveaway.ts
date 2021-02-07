import { 
	EventEmitter 
} from 'events'

class GiveawayHandler extends EventEmitter {
	public client: Akairo.Client;
	public giveaways: any[];
	public constructor(client: Akairo.Client) {
		super();
		
		this.client = client;
		this.giveaways = [];
	}
}

export default GiveawayHandler;