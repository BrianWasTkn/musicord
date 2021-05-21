import { ModulePlus, ArgHandler } from '..';
import { Context } from 'lib/extensions';

/**
 * Represents a Command Agrument. 
 * @absract @extends {ModulePlus}
*/
export abstract class Arg extends ModulePlus {
	public handler: ArgHandler<this>;
	public constructor(id: string, opts: Partial<Constructors.Modules.Argument>) {
		super(id, { category: opts.category, name: opts.name });
	}

	public abstract exec(ctx: Context, args: string): any;
}

export default Arg;