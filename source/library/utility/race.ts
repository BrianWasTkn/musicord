import { UserPlus, Context } from 'lib/extensions';

export class Race {
	public position: number;
	public emoji: string;
	public user: UserPlus;

	constructor(user: UserPlus) {
		this.position = 30;
		this.emoji = ':clown:';
		this.user = user;
	}

	private random(a: number, b: number) {
		return this.user.client.util.randomNumber(a, b);
	}

	advanceTo() {
		this.position -= this.random(1, 5);
		return this;
	}
}
export default Race;