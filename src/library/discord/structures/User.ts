import { User, Structures } from 'discord.js';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

export declare interface UserPlus extends User {
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export class UserPlus extends User implements Structure {
	get animatedAvatar() {
		return this.avatarURL({ dynamic: true });
	}
}

Structures.extend('User', () => UserPlus);