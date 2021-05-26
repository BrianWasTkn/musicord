
/**
 * The built properties.
*/
interface BuiltProperties {
	type: Function,
	required: boolean;
	default: any;
}

/**
 * Schema property builder, just to make things easy.
 * @param {Function} type the constructor for validation purposes
 * @param {any} defaultValue the default value if none was specified during modelling
 * @param {boolean} [required] if this property should require a value when modelling
 * @returns {BuiltProperties}
*/
export function Build(type: Function, defaultValue: any, required = false): BuiltProperties {
	return { type, required, default: defaultValue };
}