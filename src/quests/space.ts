import { Quest } from '@lib/handlers/quest';

export default class Hard extends Quest {
  constructor() {
    super(
      'space',
      {
        target: 100e6,
        diff: 'Hard',
        info: 'Reach 100,000,000 bank space.',
        name: 'Space It',
      },
      {
        coins: 3e5,
        item: [100, 'thicm'],
      }
    );
  }
}
