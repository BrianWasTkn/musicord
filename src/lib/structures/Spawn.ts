import { 
	Collection, User
} from 'discord.js'
import {
	AkairoModule
} from 'discord-akairo'

export default class Spawn extends AkairoModule implements Akairo.Spawn {
	public answered: Collection<User["id"], User>;
	public constructor(
		public client: Akairo.Client,
		public config: Akairo.SpawnConfig,
		public spawn: Akairo.SpawnVisual,
		cooldown: Akairo.SpawnConfig["cooldown"]
	) {
		super(spawn.title, { 
			category: 'spawner' 
		});

		this.client = client;
		this.spawn = spawn;
		this.config = { ...config, cooldown};
		this.answered = new Collection();
	}
}