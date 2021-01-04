import { Listener } from 'discord-akairo'

export default class Akairo extends Listener {
	constructor() {
		super('load', {
			emitter: 'commandHandler',
			event: 'load'
		});
	}

	async exec(command, isReload): Promise<void> {
		this.client.util.log(
			command.constructor.name, 'main', 
			`Command "${chalk.cyanBright(command.id)}" loaded.`
		);
	}
}