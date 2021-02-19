import { Collection, User } from 'discord.js'
import { AkairoModule } from 'discord-akairo'

export default class Spawn extends AkairoModule implements Akairo.Spawn {
    public client: Akairo.Client
    public answered: Collection<User['id'], User>
    
    constructor(
        public config: Akairo.SpawnConfig,
        public spawn: Akairo.SpawnVisual,
        cooldown: Akairo.SpawnConfig['cooldown']
    ) {
        super(spawn.title, { category: 'spawner' })

        this.spawn = spawn
        this.config = { ...config, cooldown }
        this.answered = new Collection()
    }
}
