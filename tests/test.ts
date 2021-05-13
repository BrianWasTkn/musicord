import TagEngine from './tagscript';

const tag = new TagEngine();
tag.parse('{length;abcdefghijklm}').then(console.log);