import { LavaClient, Listener } from 'discord-akairo'

export default class Discord extends Listener {
	public client: LavaClient;
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public async exec(): Promise<void> {
		return this.client.util.log('Discord', 'main', `${this.client.user.tag} has flown within Discord.`);
	}
}