import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
	    super('love', {
			rewards: { coins: 2e6, item: [2000, 'brian'] },
			target: [1, 'marry', 'marrySomeone'],
			difficulty: 'Easy',
			info: 'Marry someone with using a Donut Ring!',
			name: 'Love It',
	    });
	}
}
