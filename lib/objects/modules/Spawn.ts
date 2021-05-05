import { ModulePlus, SpawnHandler } from '..';
import { Collection, GuildMember } from 'discord.js';

/**
 * Represents a Spawn. 
 * @absract @extends {ModulePlus}
*/
export abstract class Spawn extends ModulePlus {
	public handler: SpawnHandler<this>;
	public answered: Collection<string, boolean>;
	public config: Partial<Handlers.Spawn.Config>;
	public spawn: Handlers.Spawn.Visual;

	public constructor(id: string, opts: Partial<Constructors.Modules.Spawn>) {
		super(id, { category: opts.visual.type, name: opts.visual.title });
		this.answered = new Collection();
		this.config = opts.config;
		this.spawn = opts.visual;
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