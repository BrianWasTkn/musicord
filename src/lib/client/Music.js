import distube from 'distube'

export class DisTube extends distube {
	constructor(playerOpts, customOpts) {
		super(playerOpts);

		for (const [k, v] of Object.entries(customOpts)) {
			Object.defineProperty(this, k, { value: v });
		}
	}
}