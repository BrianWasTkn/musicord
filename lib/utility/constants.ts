/**
 * Color Constant
 */
export const Colors: Lava.Colors = {
	red: 0xf44336,
	orange: 0xff9800,
	yellow: 0xffeb3b,
	green: 0x4caf50,
	blue: 0x2196f3,
	indigo: 0x3f51b5,
	violet: 0x9c27b0,
}

for (const color of Object.keys(Colors)) {
	require('discord.js').Constants.Colors[color.toUpperCase()] = Colors[color]
}
