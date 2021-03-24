import { MessageOptions, Collection } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects'

// blackjack.dankmemer.lol
export default class Currency extends Command {
  constructor() {
    super('blackjack', {
      aliases: ['blackjack', 'bj'],
      channel: 'guild',
      description: 'Play a game of cards.',
      cooldown: 5e3,
      args: [{
        id: 'amount',
        type: 'gambleAmount'
      }]
    });
  }

  async exec(msg: MessagePlus, args: { amount: number }): Promise<string | MessageOptions> {
     const {
      util,
      util: { effects },
      config: { currency },
      db: { currency: DB },
    } = this.client;

    // Core
    const { maxWin, maxMulti, maxBet, maxPocket } = currency;
    const data = await msg.author.fetchDB();
    let { total: multi } = await DB.utils.calcMulti(this.client, msg);
    const { amount: bet } = args;
    if (multi >= maxMulti) multi = maxMulti as number;
    if (!bet) return;

    // Item Effects
    let extraWngs: number = 0;
    for (const it of ['thicm']) {
      if (!effects.has(msg.author.id)) effects.set(msg.author.id, new Collection<string, Effects>().set(it, new Effects()));
      if (effects.get(msg.author.id).has(it)) {
        extraWngs += effects.get(msg.author.id).get(it).bjWinnings
      }
    }

    const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];

    let winnings = 0;
    let stood = false;
    let first = true;

    let cards = {
      bot: [deal(), deal()],
      user: [deal(), deal()],
    };

    while(addCards('user') === 21 || addCards('bot') === 21) {
      cards = {
        bot: [deal(), deal()],
        user: [deal(), deal()],
      };
    }

    function deal() {
      let cards = { face: util.randomInArray(faces), suit: util.randomInArray(suits) };
      return cards;
    }

    function getRespectiveIcon(suit: string) {
      switch (suit) {
        case 'spades':
          return '♠';
        case 'hearts':
          return '♥';
        case 'diamonds':
          return '♦';
        case 'clubs':
          return '♣';
      }
    }

    function getValue(card: { face: string, suit: string }) {
      return { value: values[faces.indexOf(card.face)], card };
    }

    function addCards(type: 'bot' | 'user') {
      const aceCount = cards[type].filter((card) => card.face === 'A').length;
      let baseSum = cards[type].reduce((p, c) => p + getValue(c).value, 0);
      for (let i = 0; i < aceCount; i++) {
        baseSum += baseSum + 10 <= 21 ? 10 : 0;
      }
      return baseSum;
    }

    function score () {
      if (addCards('user') > 21) { // User busted
        return { result: false, emoji: 'nope', message: 'You lose! Busted!' };
      } else if (addCards('bot') > 21) { // Bot busted
        return { result: true, emoji: 'ok', message: 'You win! Your opponent busted!' };
      } else if (addCards('user') === 21) { // User has exactly 21
        return { result: true, emoji: 'ok', message: 'You win! You have 21!' };
      } else if (addCards('bot') === 21) { // Bot has exactly 21
        return { result: false, emoji: 'nope', message: 'You lose! Your opponent reached 21 before you!' };
      } else if (addCards('bot') === addCards('user') && stood) { // Tie
        return { result: null, emoji: 'empty', message: 'You tied with your opponent!' };
      } else if (addCards('user') <= 21 && cards.user.length === 5) { // User took more than 5 cards without going over 21
        return { result: true, emoji: 'ok', message: 'You win! You took 5 cards without going over 21.' };
      } else if (addCards('bot') <= 21 && cards.bot.length === 5) { // Bot took more than 5 cards without going over 21
        return { result: false, emoji: 'nope', message: 'You lose! Your opponent took 5 cards without going above 21.' };
      } else if (addCards('bot') > addCards('user') && stood) {
        // If the bot has a score of 17 or more and the user has less than the bot, and the user is also stood
        return { result: false, emoji: 'nope', message: `You lose! You have ${addCards('user')}, Dealer has ${addCards('bot')}.` };
      } else if (addCards('user') > addCards('bot') && stood) {
        // If the user has a higher score than the bot and they are
        return { result: true, emoji: 'nope', message: `You win! You have ${addCards('user')}, Dealer has ${addCards('bot')}.` };
      } else {
        return addCards('user'); // else
      }
    }

    const gambed = async (final?) => {
      const status = score() as { result: boolean, emoji: string, message: string };
      let state: string = '';
      let desc = '';
      if (status.constructor === Object) {
        const coinCheck = await DB.fetch(msg.author.id); // ugh don't really know else how to do this thanks to reversal
        if (bet > coinCheck.pocket) {
          await DB.remove(msg.author.id, 'pocket', bet);
          return { content: `What the hell man, you don't have the coins to cover this bet anymore??? I'm keeping your bet since you tried to SCAM ME.`, reply: true };
        }
        let finalMsg = '';
        // Win
        if (status.result) {
          winnings = Math.ceil(bet * (Math.random() + (0.4 + extraWngs))); // "Base Multi"
          winnings = Math.min(maxPocket as number, winnings + Math.ceil(winnings * (multi / 100))); // This brings in the user's secret multi (pls multi)
          finalMsg += `\nYou won **${winnings.toLocaleString()}**. You now have ${(data.pocket + winnings).toLocaleString()}.`;
          await msg.author.dbAdd('pocket', winnings);
          await msg.calcSpace();
          state = extraWngs ? 'thicc' : 'winning';
        } else {
          // Tie
          if (status.result === null) {
            finalMsg += `\nYour wallet hasn't changed! You have **${data.pocket.toLocaleString()}** still.`;
            state = 'tie';
          } else {
            // Loss
            finalMsg += `\nYou lost **${Number(bet).toLocaleString()}**. You now have ${(data.pocket - bet).toLocaleString()}.`;
            await msg.author.dbRemove('pocket', bet);
            await msg.calcSpace();
            state = 'losing';
          }
        }
        final = true;
        desc = `**${status.message}** ${finalMsg}`;
      }
      const satisfied = final;
      msg.channel.send({ content: !final ? `${first ? 'What do you want to do?\n' : ''}Type \`h\` to **hit**, type \`s\` to **stand**, or type \`e\` to **end** the game.` : '',
        embed: {
          author:
            {
              name: `${msg.author.username}'s ${state} blackjack game`,
              icon_url: msg.author.avatarURL({ dynamic: true })
            },
          color: final ? status.result === null ? 'YELLOW' : (winnings ? (extraWngs ? 'BLUE' : 'GREEN') : 'RED') : 2533018,
          description: desc,
          fields: [
            {
              name: msg.author.username,
              value: `Cards - **${cards.user.map(card => `[\`${getRespectiveIcon(card.suit)} ${card.face}\`](https://google.com)`).join('  ')}**\nTotal - \`${addCards('user')}\``,
              inline: true
            },
            { // Always show the first card, all other cards are unknown until stood or final is called
              name: msg.client.user.username,
              value: `Cards - **${cards.bot.slice(0, satisfied ? cards.bot.length : 2).map((card, i) => (!i || satisfied) ? `[\`${getRespectiveIcon(card.suit)} ${card.face}\`](https://google.com)` : '`?`').join('  ')}**\nTotal - \`${
                satisfied ? addCards('bot') : ' ? '}\``,
              inline: true
            }
          ],
          footer: { text: !final ? 'K, Q, J = 10  |  A = 1 or 11' : `Percent Won: ${Math.round((winnings / bet) * 100)}%` }
        }
      });
      first = false;
      if (final) return;
      const choice = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 3e4 })).first();
      if (!choice) {
        await DB.remove(msg.author.id, 'pocket', bet)
        return { content: 'You ended the game since you didn\'t respond. The dealer is keeping your money to deal with your bullcrap.', reply: true };
      }
      switch (choice.content.toLowerCase().slice(0, 1)) {
        case 'h':
          cards.user.push(deal());
          return gambed();
        case 's':
          stood = true;
          return dealersTurn(stood);
        case 'e':
          await DB.remove(msg.author.id, 'pocket', bet);
          return { content: 'You ended the game. The dealer is keeping your money to deal with your bullcrap.', replyTo: msg.id };
        default:
          await DB.remove(msg.author.id, 'pocket', bet);
          return { content: 'Ur an idiot you need to give a valid response. You lost your entire bet.', replyTo: msg.id };
      }
    }

    const dealersTurn = (end?) => {
      if (addCards('user') > 21) {
        return gambed();
      }
      const thoughts = [];
      if (cards.bot.length < 5) {
        if (addCards('bot') <= 16) {
          thoughts.push('Drawing.');
          cards.bot.push(deal());
        } else {
          thoughts.push('Standing.');
        }
        if (end) {
          return dealersTurn();
        }
      }
      return gambed();
    }

    return gambed();
  }
}
