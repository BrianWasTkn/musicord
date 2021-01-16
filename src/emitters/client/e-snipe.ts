import { Listener, LavaClient } from 'discord-akairo'
import { Message, PartialMessage } from 'discord.js'

export default class Discord extends Listener {
	public client: LavaClient;
	public constructor() {
		super('e-snipe', {
			emitter: 'client',
			event: 'messageUpdate'
		});
	}

	public async exec(message: Message | PartialMessage): Promise<any> {
		// TODO
	}
}
