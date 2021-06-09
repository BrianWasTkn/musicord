import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/index';
import { Donation } from '.';
import { Message } from 'discord.js';

export class DonationHandler extends AbstractHandler<Donation> {
	/**
	 * Construct a dono handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}