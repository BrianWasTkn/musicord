import { Message, GuildChannel } from 'discord.js'

export const utils: Lava.CurrencyUtil = {
    /**
     * calc the multi of user
     * @param Lava an extended instance of akairo client
     * @param msg a discord msg obj
     * @returns {Promise<number>}
     */
    calcMulti: async (
        Lava: Akairo.Client,
        msg: Message
    ): Promise<{ unlocked: string[]; total: number }> => {
        const channel = msg.channel as GuildChannel
        const db = await Lava.db.currency.fetch(msg.member.user.id)
        let total = 0
        total += db.multi
        let unlocked = []
        if (msg.guild.id === '691416705917779999') {
            unlocked.push(`${msg.guild.name} - \`10%\``)
            total += 10
        }
        if (msg.member.nickname.toLowerCase().includes('taken')) {
            unlocked.push(`Taken Cult - \`5%\``)
            total += 5
        }
        if (channel.name.includes('lava')) {
            unlocked.push(`#lava - \`2.5%\``)
            total += 2.5
        }
        if (msg.guild.emojis.cache.size >= 250) {
            total += 2.5
            unlocked.push(`250 Emojis - \`2.5%\``)
            if (msg.guild.emojis.cache.size >= 100) {
                total += 1
                unlocked.push(`100 Emojis - \`1%\``)
            }
        }
        return { total, unlocked }
    },
}
