/**
 * Responder to build message content and embeds using chainable methods. 
 * @author BrianWasTaken
*/

import { Context } from 'lib/extensions';
import { Embed } from '.';
import { 
	MessageEmbedOptions,
	MessageOptions,
	MessageEmbed, 
	TextChannel, 
	NewsChannel, 
	APIMessage,
	DMChannel, 
	Base, 
} from 'discord.js';

export class Responder {
	private channel: TextChannel | DMChannel | NewsChannel;
	private context: Context;
	public props: {
		options?: MessageOptions;
		content?: string;
		embed?: MessageEmbed;
	};
	public constructor(ctx: Context) {
		this.channel = ctx.channel;
		this.context = ctx;
		this.props = Object.create(null);
	}

	public embed(data: MessageEmbed | MessageEmbedOptions): this {
		if (!(data instanceof MessageEmbed)) {
			data = new MessageEmbed(data);
		}

		this.props.embed = data as MessageEmbed;
		return this;
	}

	public content(content: string): this {
		if (typeof content !== 'string') {
			throw new TypeError(`[${this}] Argument "content" must be type of string.`);
		}

		this.props.content = content;
		return this;
	}

	public inject(options: MessageOptions): this {
		if (options.constructor === Object) {
			this.props.options = options;
			return this;
		}

		throw new TypeError(`[${this}] Argument "options" must be an object of MessageOptions.`);
	}

	public send(reply = false, failIfNotExists = false) {
		if (!this.props || (!this.props.content && !this.props.embed)) {
			throw new TypeError(`[${this}] Cannot send empty message.`);
		}

		if (reply && this.props.options) {
			this.props.options.reply = {
				messageReference: this.context,
				failIfNotExists,
			};
		}

		return this.channel.send.call(this.channel, this.props.content !== null || this.props.content !== undefined ? this.props.content : undefined, this.props.options);
	}

	toString() {
		return this.constructor.name;
	}
}

export default Responder;