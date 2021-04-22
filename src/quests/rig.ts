import { Quest } from 'lib/handlers/quest';

export default class Medium extends Quest {
  constructor() {
    super(
      'rig',
      {
        target: 100,
        diff: 'Medium',
        info: 'Win 100 jackpots on slots.',
        name: 'Rig It',
      },
      {
        coins: 100e3,
        item: [100, 'xplo'],
      }
    );
  }
}
