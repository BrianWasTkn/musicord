export const intoCallable = (f: FunctionUnion<any>) => (typeof f === 'function' ? f : () => f);
export const intoArray = (x: ArrayUnion<any>) => (Array.isArray(x) ? x : [x]);

export function flatMap(xs: any, f: ((...args: any[]) => any)) {
    const res = [];
    for (const x of xs) {
        res.push(...f(x));
    }

    return res;
}

export function isEventEmitter(value: import('events').EventEmitter) {
	return (
		value &&
		typeof value.on === 'function' &&
		typeof value.once === 'function'
	);
}

export function isPromise(value: PromiseUnion<any>) {
	return (
		value &&
		typeof value.then === 'function' &&
		typeof value.catch === 'function'
	);
}

export function deepAssign(o1: { [k: string]: any }, ...os: { [k: string]: any }[]) {
	for (const o of os) {
		for (const [k, v] of Object.entries(o)) {
			const vIsObject = v && typeof v === 'object';
			const o1kIsObject =
				Object.prototype.hasOwnProperty.call(o1, k) &&
				o1[k] &&
				typeof o1[k] === 'object';
			if (vIsObject && o1kIsObject) {
				deepAssign(o1[k], v);
			} else {
				o1[k] = v;
			}
		}
	}

	return o1;
}

export function prefixCompare(aKey: string | Function, bKey: string | Function) {
	if (aKey === '' && bKey === '') return 0;
	if (aKey === '') return 1;
	if (bKey === '') return -1;
	if (typeof aKey === 'function' && typeof bKey === 'function') return 0;
	if (typeof aKey === 'function') return 1;
	if (typeof bKey === 'function') return -1;
	return aKey.length === bKey.length
		? aKey.localeCompare(bKey)
		: bKey.length - aKey.length;
};

export default {
	intoCallable,
	intoArray,
	flatMap,
	isEventEmitter,
	isPromise,
	deepAssign,
	prefixCompare
};