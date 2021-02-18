/**
 * Color Constant
 */
export const Colors: Lava.Colors = {
    get red() {
        return 0xf44336
    },
    get orange() {
        return 0xff9800
    },
    get yellow() {
        return 0xffeb3b
    },
    get green() {
        return 0x4caf50
    },
    get blue() {
        return 0x2196f3
    },
    get indigo() {
        return 0x3f51b5
    },
    get violet() {
        return 0x9c27b0
    },
}

for (const color of Object.keys(Colors)) {
    require('discord.js').Constants.Colors[color.toUpperCase()] = Colors[color]
}
