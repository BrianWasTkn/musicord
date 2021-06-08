import { AbstractModule, AbstractModuleOptions, Context } from 'lava/index';
import { SettingHandler } from '.';

export abstract class Setting extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: SettingHandler;
}