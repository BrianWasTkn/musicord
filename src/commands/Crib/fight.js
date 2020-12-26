const { Command } = require('discord-akairo');

module.exports = class Crib extends Command {
	constructor() {
		super('fight', {
			aliases: ['fight', 'slap'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 5000,
			rateLimit: 1,
			args: [
				{ id: 'enemy', type: 'member' }
			]
		});
	}

	async exec(message, args) {
		const { member, channel } = message;
		const { enemy } = args;
		const author = member;

		if (!enemy) {
			return message.reply('Bro, you need to fight with someone...');
		}
		if (enemy.user.id === member.user.id) {
			return message.reply('Lol imaginr fighting yourself, rude.');
		}
		if (enemy.user.bot) {
			return message.reply('Please don\'t pester bots, they might take over us.');
		}

		author.hp = enemy.hp = 100;
		author.armor = enemy.armor = 0;
		author.crits = enemy.crits = 0;
		let turn = author;
		let oppturn = enemy;
		if (Math.random > 0.5) {
			oppturn = [turn, turn = oppturn][0];
		}

		const performTurn = async (attacker, opponent, retry) => {
			const cmds = ['slap', 'protecc', 'end'];
			await channel.send([
				`${turn.user.toString()},`,
				`**\`${[cmds[0], cmds[1]].join('`**, **`')}\`** or **\`${cmds[2]}\`**?`
			].join(' '));

			const filter = m => m.author.id === turn.user.id;
			let reply = await channel.awaitMessages(channel, filter, { 
				time: timeout, max: 1 
			});

			if (!reply.first()) {
				await channel.send(`**${turn.user.username}** didn't replied in time, **${oppturn.user.username}** wins!`);
				return;
			}

			// Actions
			reply = reply.first()
			if (reply.content.toLowerCase() === cmds[0]) {
				const bigPunch = Math.random() >= 0.65;
				const damage = this.client.util.random('num', { 
					min: 7, max: (bigPunch ? 65 : 40) 
				});

				opponent.hp -= (damage - opponent.armor) < 0 ? 5 : damage - opponent.armor;
				attacker.crits += bigPunch ? 1 : 0;
				return damage;
			} else if (reply.content.toLowerCase() === cmds[1]) {
				const crit = Math.random() >= 0.75;
				const defense = this.client.util.random('num', { 
					min: 7, max: (crit ? 55 : 30) 
				});

				if (attacker.armor < 100) {
					attacker.armor += defense;
					await channel.send([
						`**${attacker.user.username}** increased their defense`,
						`to **${attacker.armor}** by **${defense}**!`,
					].join(' '));
				} else {
					await channel.send(
						`${attacker.user.toString()}, stop being greedy, you already have max armor!`
					);
				}
			} else if (reply.content.toLowerCase() === cmds[2]) {
				await channel.send(`**${attacker.user.username}** ended the game, nobber.`);
			} else {
				await channel.send(`${attacker.user.toString()}, why are you not following my instructions bro?`);
				if (!retry) return await performTurn(attacker, opponent, true);
			}
		}

		const play = async () => {
			const damage = await performTurn(turn, oppturn);
			if (damage === undefined) return;
			if (!damage) {
				oppturn = [turn, turn = oppturn][0];
				return await play();
			}

			await channel.send([
			`**${turn.user.username}** landed a hit on **${oppturn.user.username}** dealing **${damage}HP**!`,
			`**${oppturn.user.username}** is left with **\`${oppturn.hp < 1 ? 0 : oppturn.hp}\`** health left.`
			].join('\n'));

			if (turn.hp > 0 && oppturn.hp > 0) {
				oppturn = [turn, turn = oppturn][0];
				return await play();
			} else {
				const loser = turn.hp > 0 ? oppturn : turn;
				const winner = loser === turn ? oppturn : turn;
				loser.hp = 0;
				return await channel.send([
					`**${winner.user.username}** literally ate **${loser.user.username}** alive,`, 
					`winning with **${winner.crits}** crits and **${winner.hp < 1 ? 0 : winner.hp}HP** left!`
				].join(' '));
			}
		}

		await play();
	}
}
