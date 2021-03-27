import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import Mongo, { Document } from 'mongoose';

export default class Currency extends Command {
  constructor() {
    super('rich', {
      aliases: ['rich', 'r'],
      channel: 'guild',
      description: "View top users locally or globally.",
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'isGlobal',
          type: 'boolean',
          flag: ['--global', '--top'],
          default: true
        },
      ],
    });
  }

  async exec(msg: MessagePlus, args: { 
  	isGlobal: boolean 
  }): Promise<MessageOptions> {

  	const model = Mongo.models['currency'];
  	const rich = (await model.find({}) as (Document & CurrencyProfile)[]);
  	const nice = rich
  	.filter(doc => args.isGlobal ? true : msg.guild.members.cache.has(doc.userID))
  	.sort((a, b) => b.pocket - a.pocket)
  	.map(async (doc, i) => {
			const u = await this.client.users.fetch(doc.userID);
			const isTop = i <= 3;

			return `${isTop ? ':fire:' : ':white_small_square:'} **${doc.pocket.toLocaleString()}** — ${u.tag}`;
		});

		return { embed: {
			title: `Richest Players — ${args.isGlobal ? 'Global' : msg.guild.name}`,
			color: 'GOLD',
			description: (await Promise.all(nice.slice(1, 10))).join('\n')
		}};
  }
}
