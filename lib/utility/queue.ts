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
}

type Queues = {
	[id: string]: QueueData[];
}

export class CommandQueue {
	queues: Queues = {};

	wait(id: string) {
		if (!this.queues[id] || this.queues[id].length < 1) this.queues[id] = [];
		const next = this.queues[id].length ? this.queues[id][this.queues[id].length - 1].promise : Promise.resolve();
		let resolve; const promise = new Promise(res => { resolve = res });
		this.queues[id].push({ promise, resolve });
		return next;
	}

	next(id: string) {
		const next = this.queues[id].shift();
		if (typeof next !== 'undefined') next.resolve();
	}
}

export default CommandQueue;