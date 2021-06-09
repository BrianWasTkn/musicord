import { LavaClient, Structure } from 'lava/index';

export class GiveawayDonation extends Structure {
	/**
	 * Amount of their donos.
	 */
	public amount: string;
	/**
	 * Times they donated.
	 */
	public times: number;
	/**
	 * Constructor for this donation.
	 */
	public constructor(client: LavaClient, data: CribDonation) {
		super({ client, id: data.id });
		/** @type {string} */
		this.amount = data.amount;
		/** @type {number} */
		this.times = data.count;
	}

	/**
	 * The donation module.
	 */
	get module() {
		return this.client.handlers.donation.modules.get(this.id);
	}
}