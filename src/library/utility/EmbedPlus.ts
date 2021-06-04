/**
 * Things I wanna fuck with embeds djs didn't do because they bad >:(
 * @author BrianWasTaken
*/

import { MessageEmbed } from 'discord.js';

export class EmbedPlus extends MessageEmbed {
	/**
	 * Set the title of an embed.
	 */
	public setTitle(title: string, url?: string) {
		if (typeof url !== 'undefined') super.setURL(url);
		return super.setTitle(title);
	}

	/**
	 * Set a footer of an embed.
	 */
	public setFooter(text: string, icon?: string, stamp?: Date) {
		if (stamp) super.setTimestamp(stamp);
		return super.setFooter(text, icon);
	}
}