import GuildMember from './member';
import Message from './message';
import User from './user';

[GuildMember, Message, User]
.forEach(Base => Base());

export { MemberPlus } from './member';
export { UserPlus } from './user';
export { Context } from './message';