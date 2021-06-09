import { AbstractModule, AbstractModuleOptions } from 'lava/akairo';
import { DonationHandler } from '.';
import { Context } from 'lava/index';

export abstract class Donation extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: DonationHandler;
}