import { GuildMember, MessageOptions } from 'discord.js';
import { Context, UserPlus } from 'lib/extensions';
import { Command } from 'lib/objects';

interface UserPlusPlus extends UserPlus {
  hp: number;
  armor: number;
  crits: number;
}

export default class Fun extends Command {
  constructor() {
    super('fight', {
      aliases: ['fight'],
      channel: 'guild',
      description: 'Start a fight battle against somebody.',
      category: 'Fun',
      args: [
        {
          id: 'enemy',
          type: 'user',
          default: null,
        },
      ],
    });
  }

  async exec(ctx: Context<{ enemy: UserPlusPlus }>): Promise<MessageOptions> {
    const { randomNumber } = this.client.util;
    const { enemy } = ctx.args;
    const author = ctx.author as UserPlusPlus;

    // arg shits
    if (!enemy) {
      return { replyTo: ctx.id, content: "Lol imagine fighting with air, couldn't be me." };
    }
    if (enemy.id === author.id) {
      return { replyTo: ctx.id, content: 'Bruh are you fucking kidding me? Imagine fighting yourself. Type `pls selfharm` to continue.' };
    }
    if (enemy.bot) {
      return { replyTo: ctx.id, content: "Please don't pester bots, they'll start invading us sige ka." };
    }

    // Prepare
    author.hp = enemy.hp = 100;
    author.armor = enemy.armor = 0;
    author.crits = enemy.crits = 0;
    let turn = author, oppturn = enemy;
    oppturn = (Math.random() > 0.5 
      ? [turn, (turn = oppturn)]
      : [oppturn, turn]
    )[0];

    // Thing
    const performTurn = async (
      attacker: UserPlusPlus,
      opponent: UserPlusPlus,
      retry?: boolean
    ) => {
      const cmds = ['slap', 'def', 'end'];
      await ctx.channel.send(`${turn.toString()}, \`${cmds.join('`, `')}\``);
      const filter = (m) => m.author.id === turn.id;
      const prompt = (
        await ctx.channel.awaitMessages(filter, { max: 1, time: 3e4 })
      ).first();

      if (prompt.content.toLowerCase() === cmds[0]) {
        const bigPunch = Math.random() >= 0.5;
        const damage = randomNumber(1, bigPunch ? 35 : 65);

        opponent.hp -= damage - opponent.armor < 0 
          ? damage : damage - opponent.armor;
        if (bigPunch) attacker.crits++;
        return damage;
      } else if (prompt.content.toLowerCase() === cmds[1]) {
        const crit = Math.random() >= 0.65;
        const def = randomNumber(7, 45) + (crit ? 7 : 0);

        if (attacker.armor <= 100) {
          attacker.armor += def;
          await ctx.channel.send(
            `**${attacker.username}** increased their defense to **${attacker.armor}** by **${def}**!`
          );
          return false;
        } else {
          await ctx.channel.send(
            `${attacker.toString()} damn stop being greedy, you already have max armor!`
          );
          return false;
        }
      } else if (prompt.content.toLowerCase() === cmds[2]) {
        await ctx.channel.send(
          `**${attacker.username}** nobber ended the game.`
        );
      } else {
        await ctx.channel.send(
          `${attacker.toString()}, why are you not following my instructions bro?`
        );
        if (!retry) return await performTurn(attacker, opponent, true);
        else
          await ctx.channel.send(
            'The game ended due to multiple invalid responses.'
          );
      }
    };

    // Another thing
    const play = async (): Promise<string> => {
      const damage = await performTurn(turn, oppturn);
      if (damage === undefined) return;
      if (!damage) {
        oppturn = [turn, (turn = oppturn)][0];
        return await play();
      }

      await ctx.channel.send(
        [
          `**${turn.username}** landed a hit on **${oppturn.username}** dealing **${damage}HP**!`,
          `**${oppturn.username}** is left with **\`${
            oppturn.hp < 1 ? 0 : oppturn.hp
          }\`** health left.`,
        ].join('\n')
      );

      if (turn.hp > 0 && oppturn.hp > 0) {
        oppturn = [turn, (turn = oppturn)][0];
        return await play();
      } else {
        const loser = turn.hp > 0 ? oppturn : turn;
        const winner = loser === turn ? oppturn : turn;
        loser.hp = 0;
        return [
          `**${winner.username}** literally memed **${loser.username}**!`,
          `winning with **${winner.crits}** crits and **${
            winner.hp < 1 ? 0 : winner.hp
          }HP** left!`,
        ].join(' ');
      }
    };

    return { content: await play(), replyTo: ctx.id };
  }
}
