import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/index';
import { Setting } from '.';

export class SettingHandler extends AbstractHandler<Setting> {
	/**
	 * Construct this setting handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}