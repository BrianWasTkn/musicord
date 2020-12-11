exports.run = async ctx => {
	ctx.on('ready', async () => {
		console.log(`${ctx.user.tag} is now ready.`)
	});
}