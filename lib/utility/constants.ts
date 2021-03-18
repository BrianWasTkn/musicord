/**
 * Color Constant
 */

import { currencyConfig } from '@config/currency';
import type { Colors } from '@lib/interface/utility';

const { maxBet, minBet } = currencyConfig;

export const COLORS = {
  RED: 0xf44336,
  ORANGE: 0xff9800,
  YELLOW: 0xffeb3b,
  GREEN: 0x4caf50,
  BLUE: 0x2196f3,
  INDIGO: 0x3f51b5,
  VIOLET: 0x9c27b0,
};

export const ERROR_MESSAGES = {
  BET_IS_NAN: 'It should be a positive number yeah?',
  BET_IS_LOW: `Your bet shouldn't be lower than ${minBet} coins bruh`,
  USER_IS_POOR: 'You have no coins to gamble rip :skull:',
  BET_IS_HIGHER: `You're not allowed to gamble higher than ${maxBet} coins lmao`,
  INVALID_AMOUNT(type: 'slots' | 'gamble') {
    const meth = type === 'slots' ? 'slot' : 'gamble';
    return `You actually need a number to ${meth} yeah?`;
  },
  TOO_RICH_TO_GAMBLE(type: 'slots' | 'gamble') {
    const meth = type === 'slots' ? 'use the slot machine' : 'gamble';
    return `You are too rich to ${meth}!`;
  },
  BET_HIGHER_THAN_POCKET(pocket: number) {
    return `You only have **${pocket.toLocaleString()}** coins don't lie to me hoe.`;
  },
};

export default {
  ERROR_MESSAGES,
  COLORS,
};
