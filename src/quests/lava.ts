import { Quest } from 'lib/handlers/quest';

export default class Extreme extends Quest {
  constructor() {
    super(
      'lava',
      {
        target: 5e3,
        diff: 'Extreme',
        info: 'Win 5,000 games of blackjack.',
        name: 'Lava Randomness',
      },
      {
        coins: 500e6,
        item: [25e3, 'porsche'],
      }
    );
  }
}
