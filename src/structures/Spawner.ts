import { 
	Collection, Snowflake, Message, Guild, GuildMember,
	CollectorFilter, MessageEmbed, MessageCollector
} from 'discord.js'
import { 
	SpawnVisuals, SpawnConfig, 
	LavaSpawner, LavaClient 
} from 'discord-akairo'

export class Spawner implements LavaSpawner {
	public queue: Collection<Snowflake, any>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public answered: Collection<Snowflake, GuildMember>;
	public client: LavaClient;
	public constructor(
		client: LavaClient, 
		config: SpawnConfig,
		spawn: SpawnVisuals
	) {
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
		 * The Spawn Answerees
		 * @type {Collection<Snowflake, GuildMember>}
	  */
	  this.answered = new Collection();

		/**
		 * The Discord Client
		 * @type {LavaClient}
		*/
		this.client = client;
	}

	public checkSpawn(channel: any): boolean {
		const { categories, blChannels } = this.client.config.spawn;

		if (this.client.queue.has(channel.id)) return false;
		if (!categories.includes(channel.parentID)) return false;
		if (blChannels.includes(channel.id)) return false;
		return true;
	}

	public runCooldown(channel: any): NodeJS.Timeout {
		const rateLimit: number = this.config.cooldown || this.client.config.spawn.rateLimit;
		return this.client.setTimeout(() => {
			this.client.queue.delete(channel.id);
		}, rateLimit * 60 * 1000);
	}

	public async run({ channel, guild }: Message): Promise<MessageEmbed> {
		const check = this.checkSpawn(channel);
		if (!check) return;

		this.client.queue.set(channel.id, channel);
		const event: Message = await this.spawnMessage(channel);
		const results: MessageEmbed = await this.collectMessages(event, channel, guild);
		this.runCooldown(channel);
		return results;
	}

	public async spawnMessage(channel: any): Promise<Message> {
		const { emoji, type, title, description } = this.spawn;
		const event: Message = await channel.send(`**${emoji} \`${type} EVENT WOO HOO!\`**\n**${title}**\n${description}`);
		return event;
	}

	public async collectMessages(event: Message, channel: any, guild: Guild): Promise<any> {
		return new Promise(async resolve => {
			// Destruct
			const { entries, timeout, rewards } = this.config;
			const { strings, emoji, title } = this.spawn;
			const string: string = this.client.util.random('arr', strings);

			// Collectors
			await channel.send(`Type \`${string}\``);
			const filter: CollectorFilter = (m: Message): boolean => {
				let contentMatch = m.content.toLocaleLowerCase() === string.toLocaleLowerCase();
				return contentMatch && !this.answered.has(m.author.id);
			};
			const collector: MessageCollector = await event.channel.createMessageCollector(filter, {
				max: entries, time: timeout
			});

			// Handle Collect
			collector.on('collect', async ({ 
				author, member, id, channel, react 
			}: Message) => {
				this.answered.set(author.id, member);
				if (collector.collected.first().id === id) {
					await channel.send(`\`${author.username}\` got it first!`);
				} else {
					await react(emoji);
				}
			});

			// Handle End
			collector.on('end', async (collected: Collection<Snowflake, Message>) => {
				await event.edit(`${event.content}\n\n**<:memerRed:729863510716317776> \`This event has expired.\`**`);
				if (!collected.size) return resolve({ color: 'RED', description: '**<:memerRed:729863510716317776> No one got the event.**' });

				const { min, max } = rewards;
				const verbs: string[] = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
				const verb: string = this.client.util.random('arr', verbs);
				const promises: Promise<any>[] = [];
				const results: string[] = [];

				// Loop through
				collected.array().forEach((m: Message): void => {
					const coins: number = this.client.util.random('num', [min / 1000, max / 1000]) * 1000;
					results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
					promises.push(m.author.send([
						`**${emoji} Congratulations!**`,
						`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
						`Please gather **5 __unpaid__ payouts** first and send the overall total with a screenshot in our payouts channel.`
					].join('\n')).catch(() => {}));
				});

				// Stuff
				await Promise.all(promises);
				const payouts: any = guild.channels.cache.get('791659327148261406') || collector.channel;
				await payouts.send({ embed: {
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'RANDOM',
					footer: { text: `From: ${channel.name}` }
				}}).catch(() => {});

				// Resolve the resulting embed
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