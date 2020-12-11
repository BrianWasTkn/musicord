exports.run = async ctx => {
	ctx.on('ready', async () => {
		const msg = `${ctx.user.tag} is now ready.`;
		const channel = ctx.channels.cache.get('695614620781641778')
		await channel.send(msg);
		console.log(msg);
	});
}