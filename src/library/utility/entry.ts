/**
 * SPOILER: User Entry for v3
*/

import { UserPlus } from 'lib/extensions';
import { Base } from 'discord.js';

export class UserEntry extends Base {
	public data: CurrencyProfile;
	public user: UserPlus;
	public constructor(user: UserPlus, data: CurrencyProfile) {
		super(user.client);
		this.user = user;
		this.data = data;
	}

	get props() {
		return {
			pocket: this.data.pocket,
			vault: this.data.vault,
			space: this.data.space
		};
	}

	save() {
		return this.data.save();
	}

	addPocket(amount: number) {
		this.data.pocket = Math.trunc(this.data.pocket + amount);
		return this;
	}
}