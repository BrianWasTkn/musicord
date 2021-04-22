import { Quest } from 'lib/handlers/quest';

export default class Easy extends Quest {
  constructor() {
    super(
      'fish',
      {
        target: 100,
        diff: 'Easy',
        info: 'Fish 100 of any types.',
        name: 'Fish It',
      },
      {
        coins: 5e4,
        item: [50, 'computer'],
      }
    );
  }
}
