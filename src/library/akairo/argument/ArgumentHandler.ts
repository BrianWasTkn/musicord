import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/index';
import { Argument } from '.';

export class ArgumentHandler extends AbstractHandler<Argument> {
	/**
	 * Construct an argument handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}