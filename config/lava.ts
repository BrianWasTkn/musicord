export interface ConfigInterface {
  dev?: boolean;
  prefix: string | string[];
  token: string;
  mongo: string;
}

export const lavaConfig = {
  dev: Boolean(process.env.DEV),
  prefix: ['lava', ';;'],
  token: process.env.TOKEN,
  mongo: process.env.MONGO,
};
