import { Quest } from 'lib/handlers/quest';

export default class Difficult extends Quest {
    constructor() {
        super('buy',{
            rewards: { coins: 5e5, item: [50, 'crazy'], },
            target: [1e4, 'buy', 'buyItem'],
            diff: 'Difficult',
            info: 'Buy 10000 pieces of any item type.',
            name: 'Buy It',
        });
    }
}
