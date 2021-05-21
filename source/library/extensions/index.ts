import Member from './GuildMember';
import Message from './Context';
import Guild from './Guild';
import User from './DiscordUser';

[Member, Message, Guild, User].forEach((Extend: Function) => Extend());

export { ContextDatabase, Context } from './Context';
export { MemberPlus } from './GuildMember';
export { GuildPlus } from './Guild';
export { UserPlus } from './DiscordUser';