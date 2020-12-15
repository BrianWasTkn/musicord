const Command = require('../../lib/command/Command.js');

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = new Command({
	name: 'fight',
	aliases: ['f'],
	description: 'Fight with someone'
}, async ({ msg, args }) => {
	/* Resolve */
	let enemy = msg.mentions.members.first();
	let author = msg.member;

	/* Scenarios */
	if (!enemy) {
		return msg.channel.send('You cannot fight air okay?');
	}
	if (enemy.user.id === author.user.id) {
		return msg.channel.send('Dumbness, you can\'t fight yourself.');
	}
	if (enemy.user.bot) {
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
	if (Math.random() > 0.5) {
		oppturn = [turn, turn = oppturn][0]; 
	}

	/* Turn() */
	const performTurn = async (attacker, opponent, retry) => {
		/* ask whoever's turn */
		msg.channel.send(`<@${turn.user.id}>, **\`fight\`**, **\`defend\`**, or **\`end\`**?`);
		
		/* await msg */
		let filter = m => (m.member.user.id === turn.user.id) && (['fight', 'defend', 'end'].some(f => m.content.toLowerCase() === f));
		let m = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 3e4
		});

		/* none */
		if (!m.first()) {
			return msg.channel.send(`**${turn.user.tag}** didn't replied in time, **${opponent.user.username}** wins!`);
		}
		/* discord.message */
		m = m.first();

		if (m.content.toLowerCase() === 'fight') {
			/* Damages */
			let bigPunch = Math.random() >= 0.8;
			let damage = randomNum(7, bigPunch ? 50 : 25);
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
				msg.channel.send(`**${attacker.user.username}** increased their defense to **${attacker.user.armor}**!`);
			} else {
				msg.channel.send('damn, stop being greedy, you already have full health!');
			}
			return false;
		} else if (m.content.toLowerCase() === 'end') {
			await msg.channel.send(`**${attacker.user.username}** ended the game lol imagine being that weak.`);
		} else {
			await msg.channel.send(`<@${attacker.user.id}> bro, why are you saying alien words?`);
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
			`**${turn.user.username}** landed a hit on **${oppturn.user.username}** dealing **\`${damage}\`HP**!`,
			`**${oppturn.user.username}** is left with **\`${oppturn.hp}\`** health left.`
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
			await msg.channel.send(`**${winner.user.username}** literally ate **${loser.user.username}** alive, winning with **${winner.hp}HP** left!`)
		}
	}

	/* Play */
	await play();
});