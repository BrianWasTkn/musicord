import { AbstractModule, AbstractModuleOptions, Context } from 'lava/index';
import { DonationHandler } from '.';

export abstract class Donation extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: DonationHandler;
}