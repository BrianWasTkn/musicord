import { ContextDatabase, Context } from 'lib/extensions';
import { SUCCESS, FAIL, FINE } from 'src/assets/arrays/bankrob.json';

export class Heist {
	status: 'fined' | 'died' | 'won';
	entry: ContextDatabase;
	ctx: Context;
	msg: string;
	constructor(ctx: Context, entry: ContextDatabase) {
		this.entry = entry;
		this.msg = null;
		this.ctx = ctx;
	}

	private randomMessage(m: string[]): string {
		return this.ctx.client.util.randomInArray(m);
	}

	fine(amount: number) {
		if (this.entry.data.pocket <= 0) return this.die(); 
		this.status = 'fined';
		this.msg = this.randomMessage(FINE)
		.replace(/{user}/g, this.ctx.author.username)
		.replace(/{fine}/g, amount.toLocaleString());

		this.entry.removePocket(amount);
		return this;
	}

	win(amount: number) {
		this.status = 'won';
		this.msg = this.randomMessage(SUCCESS)
		.replace(/{user}/g, this.ctx.author.username)
		.replace(/{got}/g, amount.toLocaleString());

		this.entry.addPocket(amount);
		return this;
	}

	die() {
		this.status = 'died';
		this.msg = this.randomMessage(FAIL)
		.replace(/{user}/g, this.ctx.author.username);

		// @TODO: die() method in ctxdb and do the life saving stuff
		this.entry.removePocket(this.entry.data.pocket);
		return this;
	}
}