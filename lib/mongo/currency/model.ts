/**
 * User Profile Model
 * Author: brian
 */

import { Document, Schema, model } from 'mongoose';
import { Type } from '../Type';

const CurrencySchema = new Schema({
  /* Basic Info */
  lastRan: Type(Number, true, Date.now()),
  lastCmd: Type(String, true, 'command'),
  userID: Type(String, true, '123'),
  pocket: Type(Number, false, 100000),
  banned: Type(Boolean, false, false),
  multi: Type(Number, false, 5),
  vault: Type(Number, false, 0),
  space: Type(Number, false, 0),
  bled: Type(Boolean, false, false),

  /* Stats */
  stats: {
    wins: Type(Number, false, 0),
    loses: Type(Number, false, 0),
    won: Type(Number, false, 0),
    lost: Type(Number, false, 0),
    xp: Type(Number, false, 1),
    prestige: Type(Number, false, 0),
  },

  /* Misc */
  misc: {
    beingHeisted: Type(Boolean, false, false)
  },
  
  /* Inventory */
  items: [
    {
      amount: Number,
      expire: Number,
      multi: Number,
      id: String,
      cd: Number,
    },
  ],

  /* Daily */
  daily: {
    streak: Type(Number, false, 0),
    time: Type(Number, false, 0),
  },

  /* Marriage */
  marriage: {
    since: Type(Number, false, 0),
    id: Type(String, false, 0),
  },

  /* Quests */
  quest: {
    target: Type(Number, false, 0),
    count: Type(Number, false, 0),
    id: Type(String, false, '123'),
  },

  /* Cooldowns */
  cooldowns: [
    {
      expire: Type(Number, false, 0),
      uses: Type(Number, false, 0),
      id: Type(String, false, 'help'),
    },
  ],
});

export default model<Document<CurrencyProfile>>('currency', CurrencySchema);
