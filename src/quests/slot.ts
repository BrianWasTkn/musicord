import { Quest } from 'lib/handlers/quest';

export default class Extreme extends Quest {
  constructor() {
    super(
      'slot',
      {
        target: 2e3,
        diff: 'Extreme',
        info: 'Win 2,000 jackpots on slots!',
        name: 'Slot It',
      },
      {
        coins: 1e6,
        item: [5, 'donut'],
      }
    );
  }
}
