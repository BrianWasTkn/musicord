import { PresenceData, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class ClientListener extends Listener<Lava> {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec(): Promise<void> {
    const { channels, util, user: bot } = this.client;
    const activities: PresenceData['activities'] = [
      { name: 'Memers Crib', type: 'COMPETING' },
    ];

    const channel = await channels.fetch('789692296094285825');
    const e = await channels.fetch('821719437316718624');
    const embed = util.embed({
      color: 'ORANGE',
      title: 'Logged in',
      description: `**${bot.tag}** logged in.`,
      timestamp: Date.now(),
      footer: {
        text: bot.tag,
        icon_url: bot.avatarURL(),
      },
    });

    (channel as TextChannel).send({ embed, content: '<@605419747361947649>' });
    (e as TextChannel).send({ embed });

    await bot.setPresence({ activities });
    const msg = `${bot.tag} has flown within Discord.`;
    return util.console({ msg, type: 'def', klass: 'Lava' });
  }
}
