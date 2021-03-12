export interface SpawnGuildConfig {
	enabled: boolean;
	bl_chans: string[];
	bl_roles: string[];
	cooldown: number; // minutes
	multiplier: number;
	timed_chan: string;
	interval: number; // (for times_chans) hours
}