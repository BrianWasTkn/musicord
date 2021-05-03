import { MessageEmbedOptions, MessageEmbed } from 'discord.js';

type EmbedConstruct = [(MessageEmbed | MessageEmbedOptions)?];

export class Embed extends MessageEmbed {
	constructor(...data: EmbedConstruct) {
		super(...data);
	}

	setAuthor(name: any, icon: string = null, url: string = null) {
		return super.setAuthor(name, icon, url);
	}

	setTitle(title: string, url?: string) {
		if (url) super.setURL(url);
		return super.setTitle(title);
	}

	setFooter(timestamp: boolean, text: any, icon?: string) {
		if (timestamp) super.setTimestamp(Date.now());
		return super.setFooter(text, icon);
	}
}

export default Embed;