import { 
	MessageAttachment,
	MessageOptions, 
	MessageTarget,
	APIMessage, 
	Intents, 
	Client, 
} from 'discord.js';
import { 
	ApplicationCommandOptionType,
	APIInteraction, 
	APIApplication,
} from 'discord-api-types';

const bot = new Client({ intents: Intents.ALL });
const gid = '691416705917779999';

async function create(i: APIInteraction, c: any, opts?: MessageOptions) {
	const channel = bot.channels.resolve(i.channel_id);
	const { data, files } = await APIMessage
		.create(channel as MessageTarget, c)
		.resolveData()
		.resolveFiles();

	return { ...data, files };
}

async function reply(i: APIInteraction, r: string | MessageOptions) {
	const data = typeof r === 'object' 
		? (await create(i, r))
		: { content: r };

	// @ts-ignore
	bot.api.interactions(i.id, i.token).callback.post({
		data: {
			type: 4,
			data
		}
	});
}

async function get(g: string) {
	// @ts-ignore
	const app = bot.api.applications(bot.user.id);
	if (g) app.guilds(g);
	return app;
}

bot.on('ready', async () => {
	console.log(`${bot.user.tag} online.`);
	// @ts-ignore
	const cmds = await get(gid).commands.get();
	
})

// @ts-ignore
bot.ws.on('INTERACTION_CREATE', (interaction: APIInteraction) => {
	const { name, options } = interaction.data;
	const command = name.toLowerCase();
	const args: { 
		[arg: string]: ApplicationCommandOptionType 
	} = {};

	if (options) {
		for (const opt of options) {
			const { name, type } = opt;
			args[name] = type;
		}
	}

	if (command === 'ping') {
		reply(interaction, 'pong');
	}
});

bot.login(process.env.TOKEN);