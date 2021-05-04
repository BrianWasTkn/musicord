import { Context } from 'lib/extensions';

export type TypeFunction = (this: ArgumentType, ctx: Context, args: string) => any;

export declare interface ArgumentType {
	fn: TypeFunction;
	id: string;
}

export class ArgumentType {
	constructor(args: { id: string, fn: TypeFunction }) {
		this.fn = args.fn.bind(this);
		this.id = args.id;
	}
}