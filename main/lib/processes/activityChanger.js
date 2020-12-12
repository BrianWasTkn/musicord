exports.run = async ctx => {
	ctx.on('ready', async () => {
		const msg = `${ctx.user.tag} is now ready.`;
		const channel = ctx.channels.cache.get('695614620781641778')
		await channel.send({ embed: {
			title: 'Logged In',
			color: 'GREEN',
			thumbnail: ctx.user.avatarURL(),
			description: `**${ctx.user.tag}** logged in.`,
			timestamp: Date.now()
		}});
		ctx.utils.log('Musicord', 'main', `${ctx.user.tag} is now ready.`);
	});
}