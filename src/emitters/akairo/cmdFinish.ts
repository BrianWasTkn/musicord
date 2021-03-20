import { Message, Collection, MessageEmbed, MessageOptions } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency'
import { InventorySlot } from '@lib/interface/handlers/item'
import { Listener } from '@lib/handlers';
import { Document } from 'mongoose'
import { Effects } from '@lib/utility/effects'
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'command',
      event: 'commandFinished',
    });
  }

  async exec(
    msg: Message,
    command: Command,
    args: any[],
    returned: MessageOptions | Promise<MessageOptions>
  ): Promise<void | Message | Message[]> {
    const { util, db } = this.client;
    if (!returned) return;

    util.cmdQueue.set(msg.author.id, false);
    await msg.channel.send(returned as MessageOptions);

    // Currency
    if (command.category.id === 'Currency') {
      const { updateItems } = this.client.db.currency;
      const { effects } = this.client.util;
      const data = await updateItems(msg.author.id);

      // Bank Space
      const blI = ['bal', 'buy', 'dep', 'with', 'shop', 'inv', 'multi'];
      const isWl = blI.some(c => command.id === c || command.aliases.includes(c));
      if (isWl) {
        const gain = Math.round(55 * (util.randomNumber(10, 100) / 2) + 55);
        data.space += gain;
        await data.save();
      }
    }
  }
}
