import Member from './Member';
import Message from './Context';
import Guild from './Guild';
import User from './User';

[Member, Message, Guild, User].forEach((Extend: Function) => Extend());

export { ContextDatabase, Context } from './Context';
export { MemberPlus } from './Member';
export { GuildPlus } from './Guild';
export { UserPlus } from './User';