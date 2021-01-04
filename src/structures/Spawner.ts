import { 
	Collection, Snowflake, Message, Guild, 
	CollectorFilter, MessageEmbed
} from 'discord.js'
import { 
	SpawnVisuals, SpawnConfig, 
	LavaSpawner, LavaClient 
} from 'discord-akairo'

export class Spawner implements LavaSpawner {
	public queue: Collection<Snowflake, any>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public client: LavaClient;
	public constructor(
		client: LavaClient, 
		config: SpawnConfig,
		spawn: SpawnVisuals
	) {
		/**
		 * The Queue
		 * @type {Collection<Snowflake, any>}
		*/
		this.queue = new Collection();

		/**
		 * The Spawn Info
		 * @type {SpawnVisuals}
		*/
		this.spawn = spawn;

		/**
		 * The Spawn Configuration
		 * @type {SpawnConfig}
		*/
		this.config = config;

		/**
		 * The Discord Client
		 * @type {LavaClient}
		*/
		this.client = client;
	}

	public checkSpawn(channel: any): boolean {
		const { categories, blChannels } = this.client.config.spawn;

		if (this.queue.has(channel.id)) return false;
		if (!categories.includes(channel.parentID)) return false;
		if (blChannels.includes(channel.id)) return false;
		return true;
	}

	public runCooldown(channel: any): void {
		const rateLimit: number = this.config.cooldown || this.client.config.spawn.rateLimit;
		this.client.setTimeout(() => {
			this.queue.delete(channel.id);
		}, rateLimit * 60 * 1000);
	}

	public async run(message: Message): Promise<MessageEmbed> {
		const { queue } = this;
		if (!(this.checkSpawn(message.channel))) return;

		queue.set(message.channel.id, message.channel);
		const event: Message = await this.spawnMessage(message.channel);
		const results: MessageEmbed = await this.collectMessages(event, message.channel, message.guild);
		this.runCooldown(message.channel);
		return results;
	}

	public async spawnMessage(channel: any): Promise<Message> {
		const { emoji, type, title, description } = this.spawn;
		const event: Message = await channel.send(`**${emoji} \`${type} EVENT WOO HOO!\`**\n**${title}**\n${description}`);
		return event;
	}

	public async collectMessages(event: Message, channel: any, guild: Guild): Promise<any> {
		return new Promise(async resolve => {
			const { entries, timeout, rewards } = this.config;
			const { strings, emoji, title } = this.spawn;
			const answered: Collection<string, boolean> = new Collection();
			const string: string = this.client.utils.random('arr', strings);

			await channel.send(`Type \`${string}\``);
			const filter: CollectorFilter = (m: Message) => {
				return m.content.toLowerCase() === string.toLowerCase()
				&& !answered.has(m.author.id);
			}, collector = event.channel.createMessageCollector(filter, {
				max: entries, time: timeout
			});

			collector.on('collect', async (msg: Message) => {
				answered.set(msg.author.id, true);
				if (collector.collected.first().id === msg.id) {
					msg.channel.send(`\`${msg.author.username}\` got it first!`);
				} else {
					msg.react(emoji);
				}
			});

			collector.on('end', async (collected: Collection<string, Message>) => {
				await event.edit([
					event.content + '\n',
					`**<:memerRed:729863510716317776> ` + `\`This event has expired.\`**`,
				].join('\n'));

				if (!collected.size) {
					return resolve({
						description: '**<:memerRed:729863510716317776> No one got the event.**',
						color: 'RED'
					});
				}

				const { min, max } = rewards;
				const coins: number = this.client.utils.random('num', [min / 1000, max / 1000]) * 1000;
				const verbs: string[] = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
				const verb: string = this.client.utils.random('arr', verbs);
				const promises: Promise<any>[] = []
				const results: string[] = [];

				collected.array().forEach((m: Message): void => {
					results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
					promises.push(m.author.send([
						`**${emoji} Congratulations!**`,
						`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
						`Please gather **5 __unpaid__ payouts** first and send the overall total with a screenshot in our payouts channel.`
					].join('\n')).catch(() => {}));
				});

				await Promise.all(promises);
				const payouts: any = guild.channels.cache.get('791659327148261406');
				await payouts.send({ embed: {
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'RANDOM',
					footer: { text: `From: ${channel.name}` }
				}}).catch(() => {});

				return resolve({
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'GOLD',
					footer: { text: `Check your direct messages.` }
				});
			});
		});
	}
}