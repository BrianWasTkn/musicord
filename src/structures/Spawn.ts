import { 
	Message, Guild, Collection, GuildMember, User, Snowflake,
	CollectorFilter, MessageEmbed, MessageCollector
} from 'discord.js'
import {
	Client, 
	SpawnConfig,
	SpawnVisuals,
	AkairoModule,
	Spawn as TypeSpawn
} from 'discord-akairo'
import Lava from 'discord-akairo'
import SpawnProfile from './spawns/model'

export default class Spawn extends AkairoModule implements TypeSpawn {
	public client: Client;
	public answered: Collection<Snowflake, User>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public constructor(
		client: Client,
		config: SpawnConfig,
		visuals: SpawnVisuals,
		cooldown: SpawnConfig["cooldown"]
	) {
		super(visuals.title, { 
			category: 'spawner' 
		});

		this.client = client;
		this.spawn = visuals;
		this.config = { ...config, cooldown};
		this.answered = new Collection();
	}
}