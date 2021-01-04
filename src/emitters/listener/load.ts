import { Listener } from 'discord-akairo'

export default class Akairo extends Listener {
	constructor() {
		super('load', {
			emitter: 'listenerHandler',
			event: 'load'
		});
	}

	async exec(handler, isReload): Promise<void> {
		this.client.util.log(
			handler.constructor.name, 'main', 
			`Emitter "${chalk.cyanBright(handler.id)}" loaded.`
		);
	}
}