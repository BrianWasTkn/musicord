function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.run = async ctx => {
	ctx.on('ready', async () => {
		let { 
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
			setTimeout(async () => {
				if (active) await roll();
				else return;
			}, interval * 1000);
		}

		/* A func to roll winners */
		const roll = async () => {
			const members = guild.roles.cache.get(role.id).members;
			const winner = members.filter(m => !m.bot).random();

			let won = randomNumber(min, max);
			let raw = won;
			let odds = Math.random();

			if (odds > 0.9) {
				multi = randomNumber(90, 100);
			} else if (odds > 0.7) {
				multi = randomNumber(70, 90);
			} else if (odds > 0.5) {
				multi = randomNumber(50, 70);
			} else if (odds > 0.3) {
				multi = randomNumber(30, 50);
			} else if (odds > 0.1) {
				multi = randomNumber(10, 30);
			} else {
				multi = randomNumber(1, 10);
			}

			won += Math.floor(won * (multi / 100));
			if (won > (limit * 1000)) won = (limit * 1000 + 1) / 1000;
			won *= 1000; raw *= 1000;

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
				description: `**${winner.user.tag}** walked away with **${won.toLocaleString()}** coins with a **${multi}%** multiplier!`,
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

			/* Return */
			return await runInterval();
		}

		/* Run */
		await roll();
		await runInterval();
	});
}