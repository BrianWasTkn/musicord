import Command from '../../classes/Command'

export default class Fight extends Command {
	constructor(client) {
		super(client, {
			name: 'fight',
			aliases: ['battle'],
			description: 'Fight someone, win, and earn points!',
			usage: '<@user>',
			cooldown: 5000
		}, {
			category: 'Crib',
			user_permissions: [],
			client_permissions: [],
			music_checks: [],
			args_required: true,
			exclusive: ['691416705917779999']
		});
	}

	randomNum(min = 5, max = 20) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	async execute({ Bot, msg, args }) {
		/* Resolve */
		let enemy = msg.mentions.members.first();
		let author = msg.author;

		/* Scenarios */
		if (!enemy) {
			return msg.channel.send('You.cannot.fight.air.okay?');
		}
		if (enemy.id === author.id) {
			return msg.channel.send('Dumbness, you can\'t fight yourself.');
		}
		if (enemy.bot) {
			return msg.channel.send('Imagine fighting with bots, could\'nt be me.');
		}

		/* Details */
		author.armor = enemy.armor = 0;
		author.crits = enemy.crits = 0;
		author.hp = enemy.hp = 100;
		/* Turns */
		let turn = author;
		let oppturn = enemy;
		/* Select Turn */
		if (Math.random() * 0.5) {
			oppturn = [turn, turn = oppturn][0]; 
		}

		/* Turn() */
		const performTurn = (attacker, opponent, retry) => {
			/* ask whoever's turn */
			msg.channel.send(`${turn.mention}, **\`fight\`**, **\`defend\`**, or **\`end\`**?`);
			
			/* await msg */
			let m = await msg.channel.awaitMessages(u => u.id === turn.id, {
				max: 1,
				time: 3e4
			});

			/* none */
			if (!m.first()) {
				return msg.channel.send(`**${turn.tag}** didn't replied in time, **${opponent.username}** wins!`);
			}
			/* discord.message */
			m = m.first();

			if (m.content.toLowerCase() === 'fight') {
				/* Damages */
				let bigPunch = Math.random() >= 0.8;
				let damage = this.randomNum(7, bigPunch ? 50 : 25);
				/* Maths */
				opponent.hp -= (damage - opponent.armor) < 0 ? 5 : damage - opponent.armor;
				/* Crits */
				attacker.crits = bigPunch ? attacker.crits++ : attacker.crits;
				/* Return */
				return damage;
			} else if (m.content.toLowerCase() === 'defend') {
				/* Crits */
				let crit = Math.random() >= 0.8;
				let defense = this.randomNum(7, crit ? 50 : 25);
				/* Maths */
				if (attacker.armor < 100) {
					/* Set */
					attacker.armor += defense;
					msg.channel.send(`**${attacker.username}** increased their defense to **${attacker.armor}**!`);
				} else {
					msg.channel.send('damn, stop being greedy, you already have full health!');
				}
				return false;
			} else if (m.content.toLowerCase() === 'end') {
				await msg.channel.send(`**${attacker.username}** ended the game lol imagine being that weak.`);
			} else {
				await msg.channel.send(`${attacker.mention} bro, why are you saying alien words?`);
				if (!retry) {
					return await performTurn(attacker, opponent, true);
				}
			}
		}

		/* Play() */
		const play = async () => {
			const damage = await performTurn(turn, oppturn);
			/* Unknown */
			if (damage === undefined) return;
			/* Damage */
			if (!damage) {
				oppturn = [turn, turn = oppturn][0];
				return await play();
			}
			/* Message */
			await msg.channel.send([
				`**${turn.username}** landed a hit on **${oppturn.username}** dealing **\`${damage}\`HP**!`,
				`**${oppturn.username}** is left with **\`${oppturn.hp}\`** health left.`
			].join('\n'));
			/* Play or End? */
			if (turn.hp > 0 && oppturn.hp > 0) {
				oppturn = [turn, turn = oppturn][0];
				return await play();
			} else {
				/* Define winners */
				const loser = turn.hp > 0 ? oppturn : turn;
				const winner = loser === turn ? oppturn : turn;
				loser.hp = 0;
				/* Message */
				await msg.channel.send(`**${winner.username}** literally ate **${loser.username}** alive, winning with **${winner.hp}HP** left!`)
			}
		}

		/* Play */
		await play();
	}
}