import Manager from '../classes/Manager.js'
import { readdirSync } from 'fs'
import { join } from 'path'

export default class PlayerManager extends Manager {
	constructor(client) {
		super(client);
		this.run(client);
	}

	async run(client) {
		const emitters = readdirSync(join(__dirname, '..', 'emitters', 'distube'));
		for (const file of emitters) {
			const event = new (require(`../emitters/distube/${file}`))(client);
			this.distube.on(file.split('.')[0], async (...args) => {
				try {
					await event.run({
						Bot: client,
						...args
					});
				} catch(error) {
					super.log('PlayerManager@run_event', error);
				}
			});
		}
	}
}