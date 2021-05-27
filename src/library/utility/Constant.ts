/**
 * Literally all important things i don't wanna type as always :rolling_eyes:
 * @author BrianWasTaken
*/

/**
 * Colors for discord.js
*/
const Colors: { [color: string]: number } = {
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

/**
 * Gambling and other currency limits
*/
const Currency = {
	MAX_SAFE_POCKET: 2e6,
	MAX_SAFE_SPACE: 100e6,
	MAX_INVENTORY: 1000,
	MAX_PRESTIGE: 1000,
	MAX_POCKET: 2000000,
	MAX_LEVEL: 1000,
	MAX_MULTI: 75,
	MAX_WIN: 165001,
	MAX_BET: 75000,
	MIN_BET: 10,
	PRESTIGE: {
		POCKET: 250000,
		LEVEL: 25
	},
};

/**
 * Gamble messages. 
*/
const GambleMessages = {
	NO_ARGS: 'You need something to {do}!',
	TOO_RICH: 'You are too rich to {do}!',
	NO_COINS: 'You have no coins to {do} RIP',
	BET_IS_NAN: 'It should be a positive number yeah?',
	BET_IS_LOWER: `C'mon, you're not {do}ing lower than **${Currency.MIN_BET.toLocaleString()}** yeah?`,
	BET_IS_HIGHER: `You can't {do} higher than **${Currency.MAX_BET.toLocaleString()}** coins >:(`,
	BET_HIGHER_POCKET: `You only have **{pocket}** lol don't try and lie to me hoe`,
};

/**
 * Item messages.
*/
const ItemMessages = {
	BUY_MSG: (premium = false) => `Successfully purchased **{amount} {emoji} {item}** and paid **:${premium ? 'key' : 'coin'}: {paid}** ${premium ? 'keys' : 'coins'}.`,
	SELL_MSG: (premium = false) => `Successfully sold **{amount} {emoji} {item}** and got **:${premium ? 'key' : 'coin'}: {got}** ${premium ? 'keys' : 'coins'}.`,

	// Buy Command
	AMOUNT_CAP: `R u really going to buy more than ${Currency.MAX_INVENTORY.toLocaleString()} of these?`,
	NEED_TO_BUY: 'You need something to buy!',
	BROKE_TO_BUY: "You don't have enough coins to buy this item!",
	NOT_BUYABLE: "You can't buy this item :thinking:",
	NOT_BUYABLE_BULK: "You don't have enough coins to buy this item for bulk!",
	AMOUNT_BELOW_ONE: 'Your buy amount has to be a real number greater than 0',
	INVENTORY_IS_FULL: `You already have more than ${Currency.MAX_INVENTORY.toLocaleString()} of this item!`,

	// Sell Command
	NEED_TO_SELL: 'You need something to sell!',
	NOT_SELLABLE: "You can't sell this item :thinking:",
	SELLING_NONE: "You should sell something greater than 0",
	CANT_FOOL_ME: (that: number) => `Hey you only have ${that} of these!`,
}

export { Colors, Currency, GambleMessages, ItemMessages };