import { Context } from 'lib/extensions/message';

type TypeFunction = (ctx: Context, args: string) => any;

export declare interface ArgumentType {
	fn: TypeFunction;
	id: string;
}

export class ArgumentType {
	constructor(id: string, fn: TypeFunction) {
		this.fn = null;
		this.id = null;
	}
}