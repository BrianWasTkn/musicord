import { LavaClient, LavaListener, Listener } from 'discord-akairo'
import chalk from 'chalk'
import moment from 'moment'

export default class Discord extends Listener implements LavaListener {
	public client: LavaClient;
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public async exec(): Promise<void> {
		return this.client.utils.log('Discord', 'main', `${this.client.user.tag} has flown within Discord.`);
	}
}