import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
	    super('love', {
			rewards: { coins: 20e6, item: [200, 'brian'] },
			target: [1, 'marry', 'marrySomeone'],
			difficulty: 'Easy',
			info: 'Marry someone with using a Donut Ring!',
			name: 'Love It',
	    });
	}
}
