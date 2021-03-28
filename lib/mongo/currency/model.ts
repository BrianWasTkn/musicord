/**
 * User Profile Model
 * Author: brian
 */

import { Document, Schema, model } from 'mongoose';
import { CurrencyProfile } from '@lib/interface/mongo/currency';

const CurrencySchema = new Schema({
  /* Basic Info */
  userID: {
    type: String,
    required: true,
  },
  pocket: {
    type: Number,
    required: false,
    default: 100000,
  },
  multi: {
    type: Number,
    required: false,
    default: 5,
  },
  vault: {
    type: Number,
    required: false,
    default: 0,
  },
  space: {
    type: Number,
    required: false,
    default: 0,
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

  /* Marriage */
  marriage: {
    since: { 
      required: false, 
      default: 0,
      type: Number, 
    },
    id: { 
      required: false, 
      type: String, 
    }
  },

  /* Quests */
  quests: [
    {
      count: Number,
      done: Boolean,
      id: String,
    }
  ]
});

export default model<Document<CurrencyProfile>>('currency', CurrencySchema);
