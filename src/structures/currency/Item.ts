import { LavaClient } from 'discord-akairo'
import { Message } from 'discord.js'

interface Item {
	name: string;
	price: number;
	buyable: boolean;
	usable: boolean;
	sellable: boolean;
	description: string;
	sell_price: number;
	consume: (_: Message) => any;
}

export default class Item {
	public client: LavaClient;
	public constructor(
		client: LavaClient, 
		fn: Function,
		props: Item
	) {
		this.client = client;
		this.fn = fn;
		this.props = props;
	}

	private async checkInv(_: Message): boolean {

	}

	private async checkAmount(_: Message): boolean {
		
	}

	public async use(_: Message): void {
		const inv = await this.checkInv(_);
	}

}