import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/akairo';
import { Donation } from '.';
import { Message } from 'discord.js';

export class DonationHandler extends AbstractHandler<Donation> {
	/**
	 * Construct a donation handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}