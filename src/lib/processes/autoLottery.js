function randomNumber(min, max) {
	return Math.floor(Math.random() * (max + min + 1) + min);
}

export async function runDev() {}

export async function run() {
	this.on('ready', async () => {
		const { 
			active, winners, interval, lastRoll, multi,
			prize: { min, max, limit }, host: { guild, role, channel }
		} = this.crib.lottery(this);
		/* First interval to roll */
		const intervalCheck = setInterval(async () => {
			if (!active) return;
			else {
				if (new Date().getMinutes() === Number('00')) {
					await runInterval();
				} else return;
			}
		}, 500);

		/* The interval */
		const runInterval = async () => {
			await roll();
			const loop = async () => {
				setInterval(async () => {
					if (active) await roll();
					else return;
				}, interval * 60 * 60 * 1e3);
			}
			await loop();
		}

		const roll = async () => {
			const members = guild.roles.cache.get(role.id).members;
			const winner = members.filter(m => !m.bot).random();

			let won = randomNumber(min, max);
			won += Math.floor(won * (multi / 100)) * 1000;
			if (won > (limit * 1000)) won = limit * 1000;

			if (!winners.has(winner.id)) {
				winners.set(winner.id, [{
					coins: won,
					timestamp: Date.now()
				}]); 
			} else {
				winnerInCollection = winners.get(winner.id);
				winners.set(winner.id, [...winnerInCollection, {
					coins: won,
					timestamp: Date.now()
				}]);
			}

			winnerObj = winners.get(winner.id);
			await channel.send({ embed: {
				title: 'Lottery Winner',
				color: 'GOLD',
				description: `**${winner.tag}** walked away with **${coins.toLocaleString()}** coins!`,
				fields: [
					{ name: 'Winner ID', value: winner.id, inline: true },
					{ name: 'Times Won', value: `${winnerObj.length} time(s)`, inline: true },
					{ name: 'Biggest Winning', value: winnerObj.sort((p, c) => p.coins - c.coins).reverse()[0].coins.toLocaleString(), inline: true }
				],
				footer: {
					text: winner.id,
					iconURL: winner.avatarURL()
				}
			}});
		}
	});
}