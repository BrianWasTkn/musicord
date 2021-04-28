import { MessageOptions, Collection } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Effects } from 'lib/utility/effects';
import config from 'config/index' ;

// blackjack.dankmemer.lol but a bit modified
export default class Currency extends Command {
  constructor() {
    super('blackjack', {
      aliases: ['blackjack', 'bj'],
      channel: 'guild',
      description: 'Play a game of cards.',
      cooldown: 5e3,
      category: 'Currency',
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ amount: number }>
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      db: { currency: DB },
    } = ctx.client;

    // Core
    const { maxWin, minBet, maxBet, maxPocket } = config.currency;
    const userEntry = await ctx.db.fetch();
    const data = userEntry.data;
    const multi = DB.utils.calcMulti(ctx, data).total;

    // Args
    const { amount: bet } = ctx.args;
    const args = ((bet: number) => {
      let state = false;
      switch (true) {
        case data.pocket <= 0:
          return { state, m: "You don't have coins to play!" };
        case data.pocket >= maxPocket: 
          return { state, m: `You're too rich (${maxPocket.toLocaleString()}) to play!` };
        case bet > data.pocket:
          return { state, m: `You only have **${data.pocket}** coins don't lie to me hoe.` };
        case !bet:
          return { state, m: 'You need something to play!' };
        case bet < 1 || !Number.isInteger(Number(bet)):
          return { state, m: 'It has to be a real number greater than 0 yeah?' };
        case bet < minBet:
          return { state, m: `You can't play lower than **${minBet}** coins sorry` };
        case bet > maxBet:
          return { state, m: `You can't play higher than **${maxBet.toLocaleString()}** coins sorry` };
        default:
          return { state: true, m: null };
      }
    })(bet);
    if (!args.state) {
      return { content: args.m, replyTo: ctx.id };
    }

    // Item Effects
    let extraWngs: number = 0;
    for (const it of ['thicm', 'trophy']) {
      const userEf = effects.get(ctx.author.id);
      if (!userEf) {
        const col = new Collection<string, Effects>().set(it, new Effects());
        effects.set(ctx.author.id, col);
      }
      if (effects.get(ctx.author.id).has(it)) {
        extraWngs += effects.get(ctx.author.id).get(it).blackjackWinnings;
      }
    }

    const faces = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ];
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

    let winnings = 0;
    let stood = false;
    let first = true;

    let cards = {
      bot: [deal(), deal()],
      user: [deal(), deal()],
    };

    while (addCards('user') === 21 || addCards('bot') === 21) {
      cards = {
        bot: [deal(), deal()],
        user: [deal(), deal()],
      };
    }

    function deal() {
      return {
        face: util.randomInArray(faces),
        suit: util.randomInArray(suits),
      };
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

    function getValue(card: { face: string; suit: string }) {
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

    function score() {
      if (addCards('user') > 21) {
        // User busted
        return { result: false, emoji: 'nope', message: 'You lose! Busted!' };
      } else if (addCards('bot') > 21) {
        // Bot busted
        return {
          result: true,
          emoji: 'ok',
          message: 'You win! Your opponent busted!',
        };
      } else if (addCards('user') === 21) {
        // User has exactly 21
        return { result: true, emoji: 'ok', message: 'You win! You have 21!' };
      } else if (addCards('bot') === 21) {
        // Bot has exactly 21
        return {
          result: false,
          emoji: 'nope',
          message: 'You lose! Your opponent reached 21 before you!',
        };
      } else if (addCards('bot') === addCards('user') && stood) {
        // Tie
        return {
          result: null,
          emoji: 'empty',
          message: 'You tied with your opponent!',
        };
      } else if (addCards('user') <= 21 && cards.user.length === 5) {
        // User took more than 5 cards without going over 21
        return {
          result: true,
          emoji: 'ok',
          message: 'You win! You took 5 cards without going over 21.',
        };
      } else if (addCards('bot') <= 21 && cards.bot.length === 5) {
        // Bot took more than 5 cards without going over 21
        return {
          result: false,
          emoji: 'nope',
          message:
            'You lose! Your opponent took 5 cards without going above 21.',
        };
      } else if (addCards('bot') > addCards('user') && stood) {
        // If the bot has a score of 17 or more and the user has less than the bot, and the user is also stood
        return {
          result: false,
          emoji: 'nope',
          message: `You lose! You have ${addCards(
            'user'
          )}, Dealer has ${addCards('bot')}.`,
        };
      } else if (addCards('user') > addCards('bot') && stood) {
        // If the user has a higher score than the bot and they are
        return {
          result: true,
          emoji: 'nope',
          message: `You win! You have ${addCards(
            'user'
          )}, Dealer has ${addCards('bot')}.`,
        };
      } else {
        return addCards('user'); // else
      }
    }

    const gambed = async (final?: boolean) => {
      const status = score() as {
        result: boolean;
        emoji: string;
        message: string;
      };
      let state: string = '';
      let desc = '';
      if (status.constructor === Object) {
        const { data: coinCheck } = await ctx.db.fetch(); // ugh don't really know else how to do this thanks to reversal
        if (bet > coinCheck.pocket) {
          await userEntry.addCd().removePocket(bet).calcSpace().updateItems().updateStats('lost', bet).updateStats('loses').save();
          return {
            content: `What the hell man, you don't have the coins to cover this bet anymore??? I'm keeping your bet since you tried to SCAM ME.`,
            replyTo: ctx.id,
          };
        }
        let finalMsg = '';
        // Win
        if (status.result) {
          winnings = Math.ceil(bet * (Math.random() + (0.4 + extraWngs))); // "Base Multi"
          winnings = Math.min(maxPocket, winnings + Math.ceil(winnings * (multi / 100))); // This brings in the user's secret multi (lava multi)
          const { pocket } = await userEntry.addCd().addPocket(winnings).updateItems().updateStats('won', winnings).updateStats('wins').calcSpace().save();
          ctx.client.handlers.quest.emit('gambleWin', { cmd: this, ctx });
          finalMsg += `\nYou won **${winnings.toLocaleString()}**. You now have ${pocket.toLocaleString()}.`;
          state = extraWngs ? 'powered' : 'winning';
        } else {
          // Tie
          if (status.result === null) {
            finalMsg += `\nYour wallet hasn't changed! You have **${data.pocket.toLocaleString()}** still.`;
            state = 'tie';
          } else {
            // Loss
            const { pocket } = await userEntry.addCd().removePocket(bet).updateItems().updateStats('lost', bet).updateStats('loses').calcSpace().save();
            ctx.client.handlers.quest.emit('gambleLose', { cmd: this, ctx });
            finalMsg += `\nYou lost **${Number(bet).toLocaleString()}**. You now have ${pocket.toLocaleString()}.`;
            state = 'losing';
          }
        }
        final = true;
        desc = `**${status.message}** ${finalMsg}`;
      }
      const satisfied = final;
      await ctx.send({
        content: !final
          ? `${
              first ? 'What do you want to do?\n' : ''
            }Type \`h\` to **hit**, type \`s\` to **stand**, or type \`e\` to **end** the game.`
          : '',
        embed: {
          author: {
            name: `${ctx.author.username}'s${
              state ? ` ${state} ` : ' '
            }blackjack game`,
            icon_url: ctx.author.avatarURL({ dynamic: true }),
          },
          color: final
            ? status.result === null
              ? 'YELLOW'
              : winnings
              ? extraWngs
                ? 'BLUE'
                : 'GREEN'
              : 'RED'
            : 2533018,
          description: desc,
          fields: [
            {
              name: ctx.author.username,
              value: `Cards - **${cards.user
                .map(
                  (card) =>
                    `[\`${getRespectiveIcon(card.suit)} ${
                      card.face
                    }\`](https://google.com)`
                )
                .join('  ')}**\nTotal - \`${addCards('user')}\``,
              inline: true,
            },
            {
              // Always show the first card, all other cards are unknown until stood or final is called
              name: ctx.client.user.username,
              value: `Cards - **${cards.bot
                .slice(0, satisfied ? cards.bot.length : 2)
                .map((card, i) =>
                  !i || satisfied
                    ? `[\`${getRespectiveIcon(card.suit)} ${
                        card.face
                      }\`](https://google.com)`
                    : '`?`'
                )
                .join('  ')}**\nTotal - \`${
                satisfied ? addCards('bot') : ' ? '
              }\``,
              inline: true,
            },
          ],
          footer: {
            text: !final
              ? 'K, Q, J = 10  |  A = 1 or 11'
              : `Percent Won: ${Math.round((winnings / bet) * 100)}%${extraWngs && state === 'winning' ? ` (${Math.round(((winnings / bet) * 100) - (extraWngs * 100))} original)` : ''}`,
          },
        },
      });
      first = false;
      if (final) return;
      const choice = (await ctx.awaitMessage()).first();
      if (!choice) {
        // No bank space for you bitch
        await userEntry.addCd().removePocket(bet).updateItems().updateStats('lost', bet).updateStats('loses').save();
        return {
          content:
            "You ended the game since you didn't respond. The dealer is keeping your money to deal with your bullcrap.",
          replyTo: ctx.id,
        };
      }
      switch (choice.content.toLowerCase().slice(0, 1)) {
        case 'h':
          cards.user.push(deal());
          return gambed();
        case 's':
          stood = true;
          return dealersTurn(stood);
        case 'e':
          // You too, no space for you :P
          await userEntry.addCd().updateItems().removePocket(bet).updateStats('lost', bet).updateStats('loses').save();
          return {
            content:
              'You ended the game. The dealer is keeping your money to deal with your bullcrap.',
            replyTo: ctx.id,
          };
        default:
          // You too, no space for you :P
          await userEntry.addCd().updateItems().removePocket(bet).updateStats('lost', bet).updateStats('loses').save();
          return {
            content:
              'Ur an idiot you need to give a valid response. You lost your entire bet.',
            replyTo: ctx.id,
          };
      }
    };

    const dealersTurn = (end?: boolean) => {
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
          return dealersTurn(cards.bot.length < 5 && addCards('bot') < 17);
        }
      }
      return gambed();
    };

    return gambed();
  }
}
