import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'

export default class Currency extends Command implements LavaCommand {
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
    let data = await this.client.db.currency.fetch({ userID: user.id });
    const { pocket, vault, space, multi } = data;
    let bet = args.amount;

    if (!bet) {
      return _.reply('You need something to gamble.');
    }

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
    if (bet < 1) {
      return _.reply('It\'s gotta be a real number yeah?')
    }
    if (pocket <= 0) {
      return _.reply('You have no coins lol');
    }
    if (bet > pocket) {
      return _.reply(`You only have **${pocket.toLocaleString()}** coins lol don't try me.`);
    }
    if (pocket > maxPocket) {
      return _.reply('You are too rich to gamble lmfaooo');
    }

    // Dice Rolls
    const userD = this.client.util.random('num', [1, 12]);
    const botD = this.client.util.random('num', [1, 12]);
    // Win
    let won;
    if (userD > botD) {
      let winnings = Math.random() + 0.4;
      won = Math.round(bet * winnings);
      won = won + Math.round(won * (multi / 100));
      if (won > maxWin) won = maxWin;
      data = await this.client.db.currency.add({ 
        userID: user.id, amount: won, type: 'pocket'
      });
      let percentWon = Math.round(won / bet * 100);
      return channel.send({ embed: {
        author: { name: `${user.username}'s winning gambling game` },
        color: 'GREEN',
        description: [
          `You won **${won.toLocaleString()}** coins.`,
          `**Multiplier** ${multi}% | **Percent of bet won** ${percentWon}%\n`,
          `You now have **${data.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { text: 'winner winner' }
      }});
    }

    // Ties
    if (userD === botD) {
      let lost = Math.round(bet / 4);
      data = await this.client.db.currency.deduct({ 
        userID: user.id, amount: lost, type: 'pocket'
      });
      return channel.send({ embed: {
        author: { name: `${user.username}'s tie gambling game` },
        color: 'YELLOW',
        description: [
          `You lost **${lost.toLocaleString()}** coins.\n`,
          `You now have **${data.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { text: 'you tied' }
      }});
    }

    // Lose 
    if (userD < botD) {
      data = await this.client.db.currency.deduct({ 
        userID: user.id, amount: bet, type: 'pocket'
      });
      return channel.send({ embed: {
        author: { name: `${user.username}'s losing gambling game` },
        color: 'RED',
        description: [
          `You lost **${bet.toLocaleString()}** coins.\n`,
          `You now have **${data.pocket.toLocaleString()}** coins.`
        ].join('\n'),
        fields: [
          { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
          { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
        ],
        footer: { text: 'lol imagine losing to a dice game' }
      }});
    }
  }
}