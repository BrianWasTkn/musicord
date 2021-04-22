import { Quest } from 'lib/handlers/quest';

export default class Easy extends Quest {
  constructor() {
    super(
      'love',
      {
        target: 1,
        diff: 'Easy',
        info: 'Marry someone with a ring!',
        name: 'Love It',
      },
      {
        coins: 2e6,
        item: [2, 'brian'],
      }
    );
  }
}
