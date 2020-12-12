function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.run = async ctx => {
	ctx.on('ready', async () => {
		const { 
			active, winners, interval, lastRoll, multi,
			prize: { min, max, limit }, host: { guild, role, channel }
		} = ctx.config.cribConfig.lottery(ctx);
		/* First interval to roll */

		// const runCheck = setInterval(async () => {
		// 	if (!active) return;
		// 	else {
		// 		if (new Date().getMinutes() === Number('00')) {
		// 			await runInterval();
		// 		} else return;
		// 	}
		// }, 500);

		/* The interval */
		const runInterval = async () => {
			await roll();
			setTimeout(async () => {
				if (active) {
					await roll();
				} else {
					return;
				}
			}, interval * 1000);
		}

		/* A func to roll winners */
		const roll = async () => {
			const members = guild.roles.cache.get(role.id).members;
			const winner = members.filter(m => !m.bot).random();

			let won = randomNumber(min, max);
			let raw = won;
			won += Math.floor(won * (multi / 100));
			if (won > (limit * 1000)) won = (limit * 1000 + 1) / 1000;
			won *= 1000;
			raw *= 1000;

			if (!winners.has(winner.id)) {
				winners.set(winner.id, [{
					coins: won,
					timestamp: Date.now()
				}]); 
			} else {
				collectionWonOfWinners = winners.get(winner.id);
				winners.set(winner.id, [...collectionWonOfWinners, {
					coins: won,
					timestamp: Date.now()
				}]);
			}

			winnerObj = winners.get(winner.id);
			await channel.send({ embed: {
				title: 'Lottery Winner',
				color: 'GOLD',
				description: `**${winner.user.tag}** walked away with **${won.toLocaleString()}** coins!`,
				fields: [
					{ name: 'Winner ID', value: winner.id, inline: true },
					{ name: 'Times Won', value: `${winnerObj.length} time(s)`, inline: true },
					{ name: 'Biggest Winning', value: winnerObj.sort((p, c) => p.coins - c.coins).reverse()[0].coins.toLocaleString(), inline: true }
				],
				footer: {
					text: winner.id,
					iconURL: winner.user.avatarURL() || winner.avatarURL()
				}
			}});
		}

		/* Run */
		runInterval();
	});
}