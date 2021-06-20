import { Donation } from 'lava/index';

export default class extends Donation {
    constructor() {
        super('default', {
            name: 'Giveaway'
        });
    }
}