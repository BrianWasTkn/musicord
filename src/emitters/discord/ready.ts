import { Listener } from 'discord-akairo'
import { PresenceData } from 'discord.js'

export default class DiscordListener extends Listener {
	public client: Akairo.Client;
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public async exec(): Promise<void> {
		const activity: PresenceData["activity"] = { 
			name: 'discord.gg/memer', 
			type: 'STREAMING',
			url: 'https://twitch.tv/badboyhaloislive'
		};
		
		await this.client.user.setPresence({ activity });
		return this.client.util.log(
			'Discord', 'main', 
			`${this.client.user.tag} has flown within Discord.`
		);
	}
}