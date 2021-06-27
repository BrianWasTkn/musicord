import { AbstractModule, AbstractModuleOptions, } from 'lava/akairo';
import { ArgumentHandler } from '.';
import { Context } from 'lava/discord';

export abstract class Argument extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: ArgumentHandler;

	/**
	 * Method to run this argument.
	 */
	public exec(ctx: Context, args: string): PromiseUnion<any>;
	public exec(ctx: Context, args: string): PromiseUnion<any> {
		return null;
	}
}