import { Lava } from '../../../Lava'
import { Message } from 'discord.js'

export interface CurrencyUtil {
    calcMulti: (
        Lava: Lava,
        _: Message
    ) => Promise<{ unlocked: string[]; total: number }>
}