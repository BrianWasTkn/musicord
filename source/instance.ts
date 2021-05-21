import { Lava } from 'lib/Lava';

export default (...args: ConstructorParameters<typeof Lava>) => {
	return new Lava(...args);
};