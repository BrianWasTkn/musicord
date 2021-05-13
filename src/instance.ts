import { Lava } from 'lib/Lava';

export default (...args: ConstructorParameters<typeof Lava>) => new Lava(...args);