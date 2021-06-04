import { LavaClient, Structure } from 'lava/index';

export class Donation extends Structure {
	/**
	 * Amount of their donos.
	 */
	public roleID: string;
	/**
	 * Times they donated.
	 */
	public expiresAt: number;
	/**
	 * Constructor for this donation.
	 */
	public constructor(client: LavaClient, data: CribBoost) {
		super({ client, id: data.id });
		/** @type {string} */
		this.roleID = data.amount;
		/** @type {number} */
		this.expiresAt = data.count;
	}
}