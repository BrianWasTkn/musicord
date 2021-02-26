import { AkairoHandler } from 'discord-akairo';
import { Message } from 'discord.js';
import path from 'path';

const dir = path.join(__dirname, 'shop');
const files: string[] = AkairoHandler.readdirRecursive(dir);
export default files.map(
  (f: string): ShopItem => {
    return require(path.join(dir, f));
  }
);

interface ShopItem {
  info: { [i: string]: string };
  cost: number;
  buyable: boolean;
  usable: boolean;
  sellable: boolean;
  fn: (_: Message) => Promise<Message>;
}
