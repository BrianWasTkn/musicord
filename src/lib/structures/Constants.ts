/**
 * Color Constant
 */
export const Colors: Lava.Colors = {
    get red() { return 0xf44336 },
    get orange() { return 0xFF9800 },
    get yellow() { return 0xFFEB3B},
    get green() { return 0x4CAF50 },
    get blue() { return 0x2196F3 },
    get indigo() { return 0x3F51B5 },
    get violet() { return 0x9C27B0 }
}

for (const color of Object.keys(Colors)) {
    require('discord.js').Constants.Colors[color.toUpperCase()] = Colors[color];
}