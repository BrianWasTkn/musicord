/**
 * Things I wanna implement on embeds djs didn't do soo.
 * @author BrianWasTaken
*/

import { MessageEmbed } from 'discord.js';

export class Embed extends MessageEmbed {
	public constructor(...data: ConstructorParameters<typeof MessageEmbed>) {
		super(...data);
	}

	public setAuthor(name: any, icon: string = null, url: string = null) {
		return super.setAuthor(name, icon, url);
	}

	public setTitle(title: string, url?: string) {
		if (url) super.setURL(url);
		return super.setTitle(title);
	}

	public setFooter(timestamp: boolean, text: any, icon?: string) {
		if (timestamp) super.setTimestamp(Date.now());
		return super.setFooter(text, icon);
	}
}

export default Embed;