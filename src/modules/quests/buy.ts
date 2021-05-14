import { Quest } from 'lib/objects';

export default class Difficult extends Quest {
    constructor() {
        super('buy',{
            rewards: { coins: 5e5, item: [5000, 'crazy'], },
            target: [1e4, 'buy', 'buyItem'],
            difficulty: 'Difficult',
            info: 'Buy 10,000 pieces of any item type.',
            name: 'Buy It',
        });
    }
}
