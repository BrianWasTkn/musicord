import { Donation } from 'lava/index';

export default class extends Donation {
    constructor() {
        super('grinder', {
            name: 'Grinders'
        });
    }
}