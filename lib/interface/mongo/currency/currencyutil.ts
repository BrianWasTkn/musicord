import { CurrencyProfile } from '.';
import { Context } from '@lib/extensions/message';
import { Document } from 'mongoose';
import { Lava } from '@lib/Lava';

export interface CurrencyUtil {
  calcMulti: (
    bot: Lava,
    msg: Context,
    db: Document & CurrencyProfile
  ) => { unlocked: string[]; total: number; multis: number };
}
