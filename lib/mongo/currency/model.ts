/**
 * User Profile Model
 * Author: brian
 */

import { Document, Schema, model } from 'mongoose';
import { CurrencyProfile } from '@lib/interface/mongo/currency';

const CurrencySchema = new Schema({
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
  items: [
    {
      amount: Number,
      expire: Number,
      multi: Number,
      id: String,
      cd: Number,
    },
  ],
});

export default model<Document<CurrencyProfile>>('currency', CurrencySchema);
