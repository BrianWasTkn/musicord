import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Spawn extends Command {
  constructor() {
    super('sdm', {
      aliases: ['sdm', 'sdms'],
      channel: 'guild',
      description: "Toggle DM notifications whenever you finish a spawn event.",
      category: 'Spawn',
      cooldown: 5e3
    });
  }

  async exec(ctx: Context): Promise<MessageOptions> {
  	const status = (bool: boolean) => bool ? 'ON' : 'OFF';
    const { fetch } = this.client.db.spawns;
    const data = await fetch(ctx.author.id);
    data.allowDM = !data.allowDM;
    await data.save();

    return { 
    	content: `Spawn Notifications are now \`${status(data.allowDM)}\``,
    	replyTo: ctx.id, 
    };
  }
}
