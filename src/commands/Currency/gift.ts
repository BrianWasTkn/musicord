import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('gift', {
      aliases: ['gift', 'gi'],
      channel: 'guild',
      description: 'Gift items to others.',
      category: 'Currency',
      cooldown: 5e3,
    });
  }
}
