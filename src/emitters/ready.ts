import Lava from 'discord-akairo'

export default class Discord extends Lava.Listener {
	public client: Lava.Client;
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