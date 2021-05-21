import { HandlerPlus, Arg } from '..';
import { AkairoError } from 'lib/utility/error';
import { Lava } from 'lib/Lava';

export class ArgHandler<Mod extends Arg = Arg> extends HandlerPlus<Mod> {
	public constructor(client: Lava, {
		directory,
		classToHandle = Arg,
		extensions = ['.js', '.ts'],
		automateCategories,
		loadFilter,
	}: Constructors.Handlers.Argument = {}) {
		if (!(
			classToHandle.prototype instanceof Arg || classToHandle === Arg)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE', 
				classToHandle.name, 
				Arg.name
			);
		}

		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});
	}
}
