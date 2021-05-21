import { Listener } from 'src/library';

export default class Client extends Listener {
	public constructor() {
		super('ready', {
			category: 'Client',
			emitter: 'client',
			event: 'ready',
			name: 'Ready',
		});
	}

	public async exec() {
		await this.client.user.setPresence({
			status: 'online', 
			activities: [{ 
				name: 'lava help', 
				type: 'LISTENING' 
			}],
		});

		return this.client.console.log('Client', `${this.client.user.tag} started flowing.`);
	}
}