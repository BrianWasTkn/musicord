import { ConnectOptions } from 'mongoose';

export interface ConfigInterface {
  dev?: boolean;
  prefix: string | string[];
  token: string;
  mongo: {
    uri: string;
    options?: ConnectOptions;
  };
}

export const lavaConfig = {
  dev: Boolean(process.env.DEV),
  prefix: ['lava', ';;', '>'],
  token: process.env.TOKEN,
  mongo: {
    uri: process.env.MONGO,
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
};
