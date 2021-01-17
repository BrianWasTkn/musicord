import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: LavaClient;
  public constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      cooldown: 3000,
      args: [{ 
        id: 'amount', match: 'content'
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { minBet, maxBet, maxWin, maxPocket } = this.client.config.gamble;
    const { channel, member: { user } } = _;
    const data = await this.client.db.currency
      .fetch(user.id);
    const { pocket, vault, space, multi } = data;
    let bet = args.amount;

    if (!bet) {
      return _.reply('You need something to gamble.');
    }

    // Arg Checks
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = pocket;
      } else if (bet === 'half') {
        bet = Math.round(pocket / 2);
      } else if (bet === 'max') {
        bet = pocket > maxBet ? maxBet : pocket;
      } else {
        return _.reply('You need a real number');
      }
    }

    // Other Arg checking
    bet = Number(bet);
    if (pocket <= 0) {
      return _.reply('You have no coins lol');
    }
    if (bet > maxBet) {
      return _.reply(`You cannot gamble higher than **${maxBet.toLocaleString()}** coins bruh.`)
    }
    if (bet < minBet) {
      return _.reply(`You cannot gamble lower than **${minBet.toLocaleString()}** coins bruh.`)
    }
    if (bet > pocket) {
      return _.reply(`You only have **${pocket.toLocaleString()}** coins lol don't try me.`);
    }
    if (pocket > maxPocket) {
      return _.reply('You are too rich to gamble lmfaooo');
    }
    if (bet < 1) {
      return _.reply('It\'s gotta be a real number yeah?')
    }

    // Dice Rolls 
    const userD = this.client.util.random('num', [1, 12]),
      botD = this.client.util.random('num', [1, 12]);

    // Win
    let won;
    if (userD > botD) {
      let winnings = Math.random() + 0.4;
      won = Math.round(bet * winnings);
      won = won + Math.round(won * (multi / 100));
      if (won > maxWin) won = maxWin;
      const db = await this.client.db.currency.addPocket(user.id, won);
      const percentWon = Math.round(won / bet * 100);
      return channel.send({ embed: {
        author: { 
          name: `${user.username}'s winning gambling game`,
          iconURL: user.avatarURL({ dynamic: true }) },
        color: 'GREEN',
        description: [
          `**Winner! You won __${percentWon}%__ of your bet.**`,
          `You won **${won.toLocaleString()}** coins.\n`,
          `You now have **${db.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { 
          text: `Multiplier: ${multi}%`,
          iconURL: this.client.user.avatarURL() }
      }});
    }

    // Ties
    if (userD === botD) {
      const lost = Math.round(bet / 4);
      const db = await this.client.db.currency.removePocket(user.id, lost);
      return channel.send({ embed: {
        author: { 
          name: `${user.username}'s tie gambling game`,
          iconURL: user.avatarURL({ dynamic: true }) },
        color: 'YELLOW',
        description: [
          `**We tied! Our dice are on equal sides.**`,
          `You lost **${bet.toLocaleString()}** coins.\n`,
          `You now have **${db.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { 
          text: `Multiplier: ${multi}%`,
          iconURL: this.client.user.avatarURL() }
      }});
    }

    // Lose 
    if (userD < botD) {
      const db = await this.client.db.currency.removePocket(user.id, bet);
      return channel.send({ embed: {
        author: { 
          name: `${user.username}'s losing gambling game`,
          iconURL: user.avatarURL({ dynamic: true }) },
        color: 'RED',
        description: [
          `**You Lost! My dice is higher than yours.**`,
          `You lost **${bet.toLocaleString()}** coins.\n`,
          `You now have **${db.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { 
          text: `Multiplier: ${multi}%`,
          iconURL: this.client.user.avatarURL() }
      }});
    }
  }
}