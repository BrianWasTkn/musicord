/**
 * Schema key builder.
 * Author: brian
 */

export function Type(type: Function, required: boolean, def: any) {
  return { type, required, default: def };
}

export default Type;
