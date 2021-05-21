export default function Build(type: Function, defaultValue: any, required = false) {
	return { type, required, default: defaultValue };
}