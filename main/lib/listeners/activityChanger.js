exports.run = async ctx => {
	ctx.on('ready', async () => {
		const msg = `${ctx.user.tag} is now ready.`;
		await ctx.channels.cache.get('695614620781641778').send(msg)
		console.log(msg);
	});
}