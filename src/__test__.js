import { formatToSecond, formatDuration } from './utils/duration.js';

const args = 'dejavu sia --skip'.split(' ');
const index = args.indexOf('--skip');
console.log(args.splice(index, 2))
console.log(args)