import { Client, Listener } from 'discord-akairo'

export default class DiscordListeners extends Listener {
	public client: Client;
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public exec(): void {
		return this.client.util.log('Discord', 'main', `${this.client.user.tag} has flown within Discord.`);
	}
}