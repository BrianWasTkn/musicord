import { Message, Collection, MessageEmbed, MessageOptions } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency'
import { InventorySlot } from '@lib/interface/handlers/item'
import { Listener } from '@lib/handlers';
import { Document } from 'mongoose'
import { Effects } from '@lib/utility/effects'
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

async function updateActiveItem(msg: Message, slot: InventorySlot, val: number, data: Document & CurrencyProfile, key: keyof Effects) {
  const { effects } = (msg.client as Lava).util;
  const eff = new Effects();

  if (slot.expire > Date.now() && slot.active) {
    const t = new Collection<string, Effects>();
    eff[key as string] = val;
    const userEf = effects.get(msg.author.id);
    if (!userEf) effects.set(msg.author.id, new Collection());
    effects.get(msg.author.id).set(slot.id, eff);
  } else {
    const useref = effects.get(msg.author.id);
    if (!useref) {
      const meh = new Collection<string, Effects>();
      meh.set(slot.id, new Effects())
      effects.set(msg.author.id, meh);
    }

    if (slot.active) {
      slot.active = false;
      await data.save();
    }
  }
}

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
    await msg.channel.send(returned as MessageOptions);

    // Currency
    if (command.category.id === 'Currency') {
      const { updateItems } = this.client.db.currency;
      const { effects } = this.client.util;
      const data = await updateItems(msg.author.id);
      const eff = new Effects();

      // Bank Space
      const blI = ['bal', 'buy', 'dep', 'with', 'shop', 'inv', 'multi'];
      const isWl = blI.some(c => command.id === c || command.aliases.includes(c));
      if (isWl) {
        const gain = Math.round(55 * (util.randomNumber(10, 100) / 2) + 55);
        data.space += gain;
        await data.save();
      }

      // Item Effects
      const find = (itm: string) => (i: InventorySlot) => i.id === itm;
      const crazy = data.items.find(find('crazy'));
      await updateActiveItem(msg, crazy, 0.1, data, 'slots');

      const thicc = data.items.find(find('thicc'));
      await updateActiveItem(msg, thicc, 0.5, data, 'winnings');

      const heart = data.items.find(find('heart'));
      await updateActiveItem(msg, heart, 0.5, data, 'winnings');
      await updateActiveItem(msg, heart, 0.2, data, 'slots');
    }
  }
}
