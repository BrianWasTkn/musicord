/**
 * Color Constant
 */

import { currencyConfig } from '@config/currency';
const { maxBet, minBet, maxPocket } = currencyConfig;

export const COLORS = {
  RED: 0xf44336,
  ORANGE: 0xff9800,
  YELLOW: 0xffeb3b,
  GREEN: 0x4caf50,
  BLUE: 0x2196f3,
  INDIGO: 0x3f51b5,
  VIOLET: 0x9c27b0,

  PINK: 0xe91e63,
  DEEP_PURPLE: 0x673ab7,
  LIGHT_BLUE: 0x03a9f4,
  CYAN: 0x00bcd4,
  TEAL: 0x009688,
  LIGHT_GREEN: 0x8bc34a,
  LIME: 0xcddc39,
  AMBER: 0xffc107,
  DEEP_ORANGE: 0xff5722,
};

export const GAMBLE_MESSAGES = {
  NO_COINS: 'You have no coins to gamble :skull:',
  BET_IS_NAN: 'It should be a positive number yeah?',
  USER_IS_POOR: 'You have no coins to gamble rip :skull:',
  BET_IS_LOWER: `C'mon, you're not gambling lower than **${minBet.toLocaleString()}** yeah?`,
  BET_IS_HIGHER: `You can't gamble higher than **${maxBet.toLocaleString()}** coins >:(`,
  NEED_SOMETHING: 'You need something to gamble!',
  INVALID_AMOUNT: 'You actually need a number to gamble yeah?',
  TOO_RICH_TO_GAMBLE: 'You are too rich to {do}!',
  BET_HIGHER_THAN_POCKET: `You only have **{pocket}** lol don't try me`,
  POCKET_HIGHER_THAN_CAP: `You're too rich (${maxPocket.toLocaleString()}) to gamble!`,
};

export const ITEM_MESSAGES = {
  BUY: `Successfully purchased **{amount} {emoji} {item}** and paid \`{paid}\` coins.`,
  SELL: `Successfully sold **{amount} {emoji} {item}** and got \`{got}\` coins.`,
}

export default {
  GAMBLE_MESSAGES,
  ITEM_MESSAGES,
  COLORS,
};
