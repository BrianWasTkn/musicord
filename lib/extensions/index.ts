import { ExtendMember } from './Member';
import { ExtendContext } from './Context';
import { ExtendGuild } from './Guild';
import { ExtendUser } from './User';

[ExtendMember, ExtendContext, ExtendGuild, ExtendUser]
.forEach((Extend: Function) => Extend());

export * from './Context';
export * from './Member';
export * from './Guild';
export * from './User';
