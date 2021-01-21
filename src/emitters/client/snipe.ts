import { Message, PartialMessage } from 'discord.js'
import Lava from 'discord-akairo'

export default class Discord extends Lava.Listener {
	public client: Lava.Client;
	public constructor() {
		super('snipe', {
			emitter: 'client',
			event: 'messageDelete'
		});
	}

	public async exec(message: Message | PartialMessage): Promise<any> {
		// TODO
	}
}
