import { LavaClient } from 'discord-akairo'

export default class Shop {
	public client: LavaClient;
	public constructor(client: LavaClient) {
		this.client = client;
	}
}