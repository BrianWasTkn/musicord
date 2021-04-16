import { MessageOptions, TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Lava } from '@lib/Lava';

export class Context {
	channel: TextChannel | DMChannel | NewsChannel;
	client: Lava;
	msg: MessagePlus;
	cmd: Command;

	constructor(args: {
		client: Lava,
		msg: MessagePlus,
		cmd: Command,
	}) {
		this.channel = args.msg.channel;
		this.client = args.client;
		this.msg = args.msg;
		this.cmd = args.cmd;
	}

	send(args: MessageOptions): Promise<MessagePlus> {
		return this.msg.channel.send.call(this.channel, args);
	}
}
