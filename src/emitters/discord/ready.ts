import { PresenceData, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class ClientListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec(): Promise<void> {
    const { channels, handlers, util, users, user: bot } = this.client;
    const activity: PresenceData['activity'] = {
      name: 'lava help',
      type: 'STREAMING',
      url: 'https://twitch.tv/quackityhq',
    };

    const channel = await channels.fetch('789692296094285825');
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
    await bot.setPresence({ activity });
    const msg = `${bot.tag} has flown within Discord.`;
    return util.console({ msg, type: 'def', klass: 'Lava' });
  }
}
