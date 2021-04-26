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
	promise: Promise<any>;
	args: {
		ctx: Context;
		cmd: Command;
	}
}

export class CommandQueue {
	queues: { [id: string]: QueueData[] } = {};

	wait(args: QueueData['args'], id: string) {
		const next = this.queues[id].length ? this.queues[id][this.queues[id].length - 1].promise.promise : Promise.resolve();
		let resolve; const promise = new Promise(res => { resolve = res });
		this.queues[id].push({ promise, resolve, args });
		return next;
	}

	next(id: string) {
		const next = this.queues[id].shift();
		if (typeof next !== 'undefined') next.resolve();
	}
}

export default CommandQueue;