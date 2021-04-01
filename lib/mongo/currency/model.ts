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
  quest: {
    target: {
      required: false,
      default: 0,
      type: Number
    },
    count: {
      required: false,
      default: 0,
      type: Number,
    },
    id: {
      required: false,
      type: String
    }
  },

  /* Cooldowns */
  cooldowns: [
    {
      id: {
        type: String,
        required: false,
      },
      expire: {
        type: Number,
        required: false,
      },
      uses: {
        type: Number,
        required: false,
        default: 0
      }
    }
  ]
});

export default model<Document<CurrencyProfile>>('currency', CurrencySchema);
