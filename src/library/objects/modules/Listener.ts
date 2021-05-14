import { ModulePlus, ModulePlusOptions, ListenerHandler, HandlerPlus } from '..';
import { AkairoClient, AkairoHandler } from 'discord-akairo';
import { EventEmitter } from 'events';
import { AkairoError } from 'lib/utility';
import { Lava } from 'lib/Lava';

/**
 * Represents a Listener. 
 * @absract @extends {ModulePlus}
*/
export abstract class Listener<Emitter extends EventEmitter = Lava> extends ModulePlus {
	public handler: ListenerHandler<this>;
	public emitter: string | EventEmitter;
	public event: string;
	public type: string;
	public constructor(id: string, {
		category,
		emitter,
		event,
		name,
		type = 'on'
	}: Partial<Constructors.Modules.Listener> = {}) {
		super(id, { category, name });
		this.emitter = emitter;
		this.event = event;
		this.type = type;
	}

	public exec(...args: any[]): PromiseUnion<any>;
	public exec(...args: any[]): PromiseUnion<any> {
		throw new AkairoError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
	}
}

export default Listener;