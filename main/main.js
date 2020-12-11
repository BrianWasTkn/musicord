const { Client } = require('discord.js');

const ctx = new Client();

ctx.on('ready', () => {
	console.log(`${ctx.user.tag} is now ready.`);
}).on('message', async msg => {
	let prefix = '//'
	const { guild, channel } = msg;
	if (!msg.content.startsWith(prefix)) return;
	const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift();
	
	if (cmd === 'ping') {
		return channel.send(`here you go: \`${guild.shard.ping}ms\``);
	}
})

ctx.login('Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs');