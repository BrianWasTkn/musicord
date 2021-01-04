import { Listener } from 'discord-akairo'
import chalk from 'chalk'
import moment from 'moment'

export default class Discord extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	public async exec(): Promise<void> {
		const stamp = moment().format('HH:mm:ss');
		console.log(
			chalk.whiteBright(`[${stamp}]`),
			chalk.cyanBright('Discord'),
			chalk.whiteBright('=>'), chalk.yellowBright(
				`${this.client.user.tag} logged in.`
			)
		)
	}
}