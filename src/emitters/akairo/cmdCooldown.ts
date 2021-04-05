import { MessageEmbed } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'command',
      event: 'cooldown',
    });
  }

  async exec(
    msg: MessagePlus,
    command: Command,
    remaining: number
  ): Promise<MessagePlus> {
    const time = remaining <= 60e3 
      ? `${(remaining / 1e3).toFixed(1)} seconds` 
      : this.client.util.parseTime(remaining);
    const defCd = command.cooldown <= 60e3
      ? `${command.cooldown / 1e3} seconds`
      : this.client.util.parseTime(command.cooldown);
    
    return msg.channel.send({
      embed: {
        title: 'LOL calm down',
        color: 'INDIGO',
        description: `You're currently on cooldown for the \`${command.id}\` command.\nPlease wait **${time}** and try again.\nDefault cooldown for this command is **${defCd}**!`,
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user.avatarURL(),
        },
      },
    }) as Promise<MessagePlus>;
  }
}
