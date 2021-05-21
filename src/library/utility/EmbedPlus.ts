/**
 * Things I wanna fuck with embeds djs didn't do because they bad >:(
 * @author BrianWasTaken
*/

import { MessageEmbed, StringResolvable } from 'discord.js';

export class EmbedPlus extends MessageEmbed {
	public setTitle(title: StringResolvable, url?: string) {
		if (typeof url !== 'undefined') super.setURL(url);
		return super.setTitle(title);
	}

	public setFooter(text: StringResolvable, icon?: string, stamp?: Date) {
		if (stamp) super.setTimestamp(stamp);
		return super.setFooter(text, icon);
	}
}