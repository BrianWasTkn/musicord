/**
 * User Profile Model
 * Author: brian
 */

import { Document, Schema, model } from 'mongoose';
import { CurrencyProfile } from '@lib/interface/mongo/currency';

const CurrencySchema = new Schema({
  /* Basic Info */
  lastRan: { type: Number, required: true, default: Date.now() },
  lastCmd: { type: String, required: true, default: 'command' },
  userID: { type: String, required: true, default: '123456' },
  pocket: { type: Number, required: false, default: 100000 },
  banned: { type: Boolean, required: false, default: false },
  multi: { type: Number, required: false, default: 5 },
  vault: { type: Number, required: false, default: 0 },
  space: { type: Number, required: false, default: 0 },
  bled: { type: Boolean, required: false, default: false },
  /* Inventory */
  items: [{ 
    amount: Number, 
    expire: Number, 
    multi: Number,
    id: String,
    cd: Number,
  }],
  /* Marriage */
  marriage: {
    since: { required: false, default: 0, type: Number },
    id: { required: false, type: String, default: '123'}
  },
  /* Quests */
  quest: {
    target: { required: false, default: 0, type: Number },
    count: { required: false, default: 0, type: Number },
    id: { required: false, type: String }
  },
  /* Cooldowns */
  cooldowns: [{
    expire: { type: Number, required: false, default: 0 },
    uses: { type: Number, required: false, default: 0 },
    id: { type: String, required: false },
  }]
});

export default model<Document<CurrencyProfile>>('currency', CurrencySchema);
