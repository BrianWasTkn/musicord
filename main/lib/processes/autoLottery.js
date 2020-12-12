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
				if (active) {
					await roll();
					await runInterval();
				} else {
					return;
				}
			}, interval * 60 * 60 * 1000 );
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
			if (won > limit) won = (limit * 1000 + 1) / 1000;
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
			let emoji = guild.emojis.cache.get('717347901587587153');
			await channel.send([
				`<${emoji.animated ? 'a:' : ''}:${emoji.name}:${emoji.id}> **__Auto Lottery:tm:__**`,
				`\n<@${winner.nickname ? '!' : ''}${winner.user.id}> walked away with **${won.toLocaleString()} (${raw.toLocaleString()} original)** coins.`,
				`\n\n**Multiplier:** ${multi}% | **Times Won:** ${winnerObj.length}`,
				`\n**Biggest Winning so far:** ${winnerObj.sort((p, c) => p.coins - c.coins).reverse()[0].coins.toLocaleString()}`
			].join(' '));
		}

		/* Run */
		await roll();
		await runInterval();
	});
}