const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'help',
	aliases: ['h'],
	description: 'Some commands stuff'
}, async ({ ctx, msg }) => {
	await msg.channel.send([
		`**${ctx.user.username} Commands**`,
		`Hey you, yes you. Here are all my commands:\n`,
		`\`${ctx.cmds.map(c => c.props.name).join('`, `')}\``
	].join('\n'));
});