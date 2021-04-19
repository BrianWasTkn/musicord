import { Quest } from '@lib/handlers/quest';

export default class Easy extends Quest {
  constructor() {
    super(
      'fuck',
      {
        target: 10,
        diff: 'Easy',
        info: 'Sell 10 of one item type.',
        name: 'Fuck It',
      },
      {
        coins: 1e4,
        item: [5, 'thicm'],
      }
    );
  }
}
