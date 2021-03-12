import {
  MessageEmbedOptions,
  ColorResolvable,
  EmbedFieldData,
  MessageEmbed,
} from 'discord.js';

export class Embed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
  }

  setAuthor(name: any, icon?: string, url?: string) {
    return super.setAuthor(name, icon || null, url || null);
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
