import { Quest } from 'lib/objects';

export default class Difficult extends Quest {
    constructor() {
        super('buy', {
            rewards: { coins: 10e6, item: [100, 'crazy'], },
            target: [1e4, 'buy', 'buyItem'],
            difficulty: 'Difficult',
            info: 'Buy 1000 pieces of any item type.',
            name: 'Buy It',
        });
    }
}
