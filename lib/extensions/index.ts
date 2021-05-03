import GuildMember from './Member';
import Message from './Context';
import Guild from './Guild';
import User from './User';

[GuildMember, Message, Guild, User]
.forEach((Base: Function) => Base());

export * from './Context';
export * from './Member';
export * from './Guild';
export * from './User';
