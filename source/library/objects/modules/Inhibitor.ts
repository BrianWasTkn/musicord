import { InhibitorHandler, ModulePlus, Command } from '..';
import { AkairoError } from 'lib/utility';
import { Context } from 'lib/extensions';

type InhibitorType = 'all' | 'pre' | 'post';

/**
 * Represents an inhibitor. 
 * @abstract @extends {ModulePlus}
*/
export abstract class Inhibitor extends ModulePlus {
	public handler: InhibitorHandler<this>;
	public priority: number;
	public reason: string;
	public type: string;
	public constructor(id: string, opts: Constructors.Modules.Inhibitor) {
		super(id, { category: opts.category, name: opts.name });
		this.priority = opts.priority;
		this.reason = opts.reason;
		this.type = opts.type;
	}

	public exec(msg: Context, cmd?: Command): PromiseUnion<boolean>;
	public exec(msg: Context, cmd?: Command): PromiseUnion<boolean> {
		throw new AkairoError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
	}
}

export default Inhibitor;