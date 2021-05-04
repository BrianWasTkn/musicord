import Member from './Member';
import Message from './Context';
import Guild from './Serber';
import User from './User';

[Member, Message, Guild, User].forEach((Extend: Function) => Extend());

export { ContextDatabase, Context } from './Context';
export { MemberPlus } from './Member';
export { GuildPlus } from './Serber';
export { UserPlus } from './User';