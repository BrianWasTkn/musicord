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
import type { Lava } from '@lib/Lava';

type MessageChannel = DMChannel | TextChannel | NewsChannel;

class LavaMessage extends Message {
  client: Lava;
  db: Lava['db'];

  constructor(client: Lava, data: object, channel: MessageChannel) {
    super(client, data, channel);
    this.db = client.db;
  }

  embed(embed: MessageEmbed): Promise<Message> {
    return this.channel.send({ embed });
  }

  msgReply(
    content: StringResolvable | APIMessage,
    options: MessageOptions | MessageAdditions,
    mention: boolean = true,
    delTout?: number
  ): Promise<this> {
    // @ts-ignore
    return (
      // @ts-ignore
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
        .then(async (m: object) => {
          // @ts-ignore
          let msg: Message = this.client.actions.MessageCreate.handle(m)
            .message;
          if (delTout) msg = await msg.delete({ timeout: delTout });
          return msg;
        })
        .catch(() => {
          return this.channel.send(content);
        })
    );
  }
}

Structures.extend<'Message', typeof LavaMessage>('Message', () => LavaMessage);
