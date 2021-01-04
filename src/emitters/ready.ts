import { Listener } from 'discord-akairo'

export default class Discord extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	async exec(): Promise<void> {
		console.log(`${this.client.user.tag} logged in.`);
	}
}