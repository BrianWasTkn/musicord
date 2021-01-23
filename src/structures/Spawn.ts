import discord from 'discord.js'
import Lava from 'discord-akairo'

class Spawner {
	public client: Lava.Client;
	public constructor(client: Lava.Client) {
		this.client = client;
	}
}