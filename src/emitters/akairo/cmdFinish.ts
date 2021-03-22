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
    await msg.channel.send(returned as MessageOptions);

    // Currency
    if (command.category.id === 'Currency') {
      const { add, updateItems } = this.client.db.currency;
      const { effects } = this.client.util;
      const data = await updateItems(msg.author.id);
      const eff = new Effects();

      // Bank Space
      const blI = ['bal', 'buy', 'dep', 'with', 'shop', 'inv', 'multi'];
      const isWl = blI.some(c => command.id === c || command.aliases.includes(c));
      if (isWl) {
        const gain = Math.round(55 * (util.randomNumber(10, 100) / 2) + 55);
        await add(msg.author.id, 'space', gain);
      }

      // Item Effects (a bunch of crappy loops)
      const h = this.client.handlers.item;
      const items = [...h.modules.values()];
      for (const item of items) {
        const inv = data.items.find(i => i.id === item.id);
        if (inv.expire > Date.now()) {
          if (item.id === 'brian') eff.setWinnings(0.5).setSlotOdds(0.5);
          if (item.id === 'thicc') eff.setWinnings(0.5);
          if (item.id === 'crazy') eff.setSlotOdds(0.1);
          const temp = new Collection<string, Effects>();
          temp.set(item.id, new Effects());
          if (!effects.has(msg.author.id)) effects.set(msg.author.id, temp);
          effects.get(msg.author.id).set(item.id, eff);
        } else {
          const useref = effects.get(msg.author.id) ;
          if (!useref || useref.has(item.id)) {
            const meh = new Collection<string, Effects>();
            meh.set(item.id, new Effects());
            effects.set(msg.author.id, meh)
          }
        }
      }
    }
  }
}
