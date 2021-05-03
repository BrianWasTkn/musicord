import { ModulePlus, SpawnHandler } from '..';
import { Collection, GuildMember } from 'discord.js';

export abstract class Spawn extends ModulePlus {
	public handler: SpawnHandler<this>;
	public answered: Collection<string, boolean>;
	public config: Partial<Handlers.Spawn.Config>;
	public spawn: Handlers.Spawn.Visual;

	public constructor(id: string, spawn: Handlers.Spawn.Visual, config: Partial<Handlers.Spawn.Config>) {
		super(id, { category: spawn.type });
		this.answered = new Collection();
		this.config = config;
		this.spawn = spawn;
	}

	public cd = (): { [id: string]: number } => ({
		'693324853440282654': 1, // Booster
		'768858996659453963': 3, // Donator
		'794834783582421032': 5, // Mastery
		'693380605760634910': 10, // Amari
	});

	public getCooldown(m: GuildMember, cds: { [role: string]: number }) {
		for (const [r, cd] of Object.entries(cds)) {
			if (m.roles.cache.has(r)) return cd;
		}
	}
}

export default Spawn;