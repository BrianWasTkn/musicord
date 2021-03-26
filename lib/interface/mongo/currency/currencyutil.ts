import { CurrencyProfile } from '.';
import { MessagePlus } from '@lib/extensions/message';
import { Document } from 'mongoose';
import { Lava } from '@lib/Lava';

export interface CurrencyUtil {
  calcMulti: (
    bot: Lava,
    msg: MessagePlus,
    db: Document & CurrencyProfile
  ) => { unlocked: string[]; total: number };
}
