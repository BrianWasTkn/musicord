import { MessageOptions, TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessagePlus } from '@lib/extensions/message';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';
import { Lava } from '@lib/Lava';

/**
 * Database functions for the command context.
*/
class ContextDatabase {
	private db: Document & CurrencyProfile;
	public ctx: Context;
	constructor(ctx: Context) {
		this.ctx = ctx;
		this.db = null;
	}

	async init(id: string = this.ctx.msg.author.id): Promise<this> {
		const { fetch } = this.ctx.client.db.currency;
		this.db = await fetch(id);
		return this;
	}

	addPocket(amount: number): this {
		if (!this.db) this._reportError();
		this.db.pocket += amount;
		return this;
	}

	removePocket(amount: number): this {
		if (!this.db) this._reportError();
		this.db.pocket -= amount;
		return this;
	}

	calcSpace(offset: number = 55, boost: number = 1, limit: number = 1000e6) {
		const randomNumber = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1) + a);
		const calc = (boosty: number) => Math.round(offset * (boosty / 2) + offset);
		this.db.space = Math.min(calc(boost), limit);
		return this;
	}

	save(): Promise<Document & CurrencyProfile> {
		if (!this.db) this._reportError();
		return this.db.save();
	}

	_reportError() {
		throw new Error(`[${this.toString()}] property "db" hasn't been instantiated.`);
	}

	toString() {
		return `[${this.constructor.name}]`;
	}
}

/**
 * Represents a command context.
*/
export class Context {
	channel: TextChannel | DMChannel | NewsChannel;
	client: Lava;
	args: any;
	msg: MessagePlus;
	cmd: Command;
	db: ContextDatabase;

	constructor(args: {
		client: Lava,
		args: any,
		msg: MessagePlus,
		cmd: Command,
	}) {
		this.channel = args.msg.channel;
		this.client = args.client;
		this.args = args.args;
		this.msg = args.msg;
		this.cmd = args.cmd;
		this.db = new ContextDatabase(this);
	}

	edit(msg: MessagePlus, args: MessageOptions): Promise<MessagePlus> {
		return msg.edit(args) as Promise<MessagePlus>;
	}

	send(args: MessageOptions): Promise<MessagePlus> {
		return this.channel.send.call(this.channel, args);
	}
}
