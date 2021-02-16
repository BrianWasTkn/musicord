import { Client, Message, Constants, GuildTextableChannel } from 'eris'

export interface CommandFunctionParameters {
    Lava?: Client
    msg?: Message<GuildTextableChannel>
    args?: string[]
}

export interface CommandFunction {
    (ctx: CommandFunctionParameters): any | Promise<any>;
}

export interface CommandConfigInterface {
    name?: string
    triggers?: string[]
    description?: string | undefined
    cooldown?: number
    userPerms?: (keyof Constants["Permissions"])[]
    botPerms?: (keyof Constants["Permissions"])[]
}