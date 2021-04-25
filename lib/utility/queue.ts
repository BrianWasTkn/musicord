/**
 * "AsyncQueue" from discord.js but modified.
 * @description Command Queue to prevent running multiple commands at once.
 * @licence MIT
 * @author BrianWasTaken
*/

import { Command } from 'lib/handlers/command';
import { Context } from 'lib/extensions';

interface QueueData {
	resolve: Function;
	promise: {
		promise: Promise<any>;
		ctx: Context;
		cmd: Command;
	}
}

export class CommandQueue {
	queues: QueueData[] = [];

	wait(args: { ctx: Context, cmd: Command }) {
		const next = this.queues.length ? this.queues[this.queues.length - 1].promise : Promise.resolve();
		let resolve; const promise = new Promise(res => { resolve = res });
		this.queues.push({ promise: { promise, ...args }, resolve });
		return next;
	}

	next() {
		const next = this.queues.shift();
		if (typeof next !== 'undefined') next.resolve(next.promise.cmd.exec(next.promise.ctx));
	}
}

export default CommandQueue;