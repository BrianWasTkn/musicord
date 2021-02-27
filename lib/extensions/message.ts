import {
  StringResolvable,
  MessageAdditions,
  MessageOptions,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  APIMessage,
  Structures,
  DMChannel,
  Message,
} from 'discord.js';
import { Lava } from '@lib/Lava';

type MessageChannel = DMChannel | TextChannel | NewsChannel;

class LavaMessage extends Message {
  client: Lava;

  constructor(client: Lava, data: object, channel: MessageChannel) {
    super(client, data, channel);
  }

  embed(embed: MessageEmbed): Promise<Message> {
    return this.channel.send({ embed });
  }

  msgReply(
    content: StringResolvable | APIMessage,
    options: MessageOptions | MessageAdditions,
    mention: boolean = true
  ): Promise<this> {
    // @ts-ignore
    return (
      this.client.api
        // @ts-ignore
        .channels(this.channel.id)
        .messages.post({
          data: {
            content,
            message_reference: {
              message_id: this.id,
            },
            allowed_mentions: {
              ...this.client.options.allowedMentions,
              replied_user: mention,
            },
          },
        })
        .then((m: object) => {
          // @ts-ignore
          return this.client.actions.MessageCreate.handle(m).message;
        })
        .catch(() => {
          return this.channel.send(content);
        })
    );
  }
}

Structures.extend('Message', () => LavaMessage);
