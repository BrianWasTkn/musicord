/**
 * "AsyncQueue" from discord.js but modified.
 * Awaits for another command to finish before running another command.
 * @author BrianWasTaken
*/

interface QueueData {
	promise: Promise<void>;
	resolve: Function;
}

type Queues = {
	[id: string]: QueueData[];
}

export class CommandQueue {
	public queues: Queues = {};

	public wait(id: string) {
		if (!this.queues[id] || this.queues[id].length < 1) this.queues[id] = [];
		const next = this.queues[id].length ? this.queues[id][this.queues[id].length - 1].promise : Promise.resolve();
		let resolve; const promise = new Promise<void>(res => { resolve = res });
		this.queues[id].push({ promise, resolve });
		return next;
	}

	public next(id: string) {
		const next = this.queues[id].shift();
		if (typeof next !== 'undefined') next.resolve();
		if (this.queues[id].length < 1) delete this.queues[id];
	}
}