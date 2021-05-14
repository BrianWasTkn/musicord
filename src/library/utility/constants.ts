/**
 * Constantfucks for pastas idfk anymore
 * @author BrianWasTakenAndTired
 */

import { currencyConfig } from 'config/currency';

const { maxInventory, maxPocket, maxBet, minBet } = currencyConfig;

export const COLORS: {
	[color: string]: number;
} = {
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

export const Currency = {
	MAX_SAFE_POCKET: 1000e6,
	MAX_SAFE_SPACE: 10000e6,
	MAX_INVENTORY: 100000,
	MAX_PRESTIGE: 1000,
	MAX_POCKET: 100e6,
	MAX_LEVEL: 1000,
	MAX_MULTI: 500,
	MAX_WIN: 3333333,
	MAX_BET: 5e5,
	MIN_BET: 50,
	PRESTIGE: {
		POCKET: 1000000,
		LEVEL: 30
	},
};

export const GAMBLE_MESSAGES = {
	NO_ARGS: 'You need something to {do}!',
	TOO_RICH: 'You are too rich to {do}!',
	NO_COINS: 'You have no coins to gamble RIP',
	BET_IS_NAN: 'It should be a positive number yeah?',
	BET_IS_LOWER: `C'mon, you're not gambling lower than **${Currency.MIN_BET.toLocaleString()}** yeah?`,
	BET_IS_HIGHER: `You can't gamble higher than **${Currency.MAX_BET.toLocaleString()}** coins >:(`,
	BET_HIGHER_POCKET: `You only have **{pocket}** lol don't try me`,
};

export const ITEM_MESSAGES = {
	BUY_MSG: (premium = false) => `Successfully purchased **{amount} {emoji} {item}** and paid **:${premium ? 'key' : 'coin'}: {paid}** ${premium ? 'keys' : 'coins'}.`,
	SELL_MSG: (premium = false) => `Successfully sold **{amount} {emoji} {item}** and got **:${premium ? 'key' : 'coin'}: {got}** ${premium ? 'keys' : 'coins'}.`,

	// Buy Command
	AMOUNT_CAP: `are you really going to buy more than ${maxInventory.toLocaleString()} of these?`,
	NEED_TO_BUY: 'you need something to buy, bro',
	BROKE_TO_BUY: "you're too broke to buy this item!",
	NOT_BUYABLE: 'this item is not available to be bought by normies like you',
	NOT_BUYABLE_BULK: "you don't have enough coins to buy this item on bulk!",
	AMOUNT_BELOW_ONE: 'it has to be a valid number greater than 0 smh',
	INVENTORY_IS_FULL: `you already have enough of this item (${maxInventory.toLocaleString()} cap) in your inventory!`,

	// Sell Command
	NEED_TO_SELL: 'you need something to sell.',
	NOT_SELLABLE: "you can't sell this item :skull:",
	SELLING_NONE: "imagine selling none, couldn't be me",
	CANT_FOOL_ME: "lmao you shouldn't sell to more than what you have",
};

export default { GAMBLE_MESSAGES, ITEM_MESSAGES, Currency, COLORS };