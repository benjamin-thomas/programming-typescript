// ./node_modules/.bin/tsc && node ./dist/index.js

console.log("Hello, TypeScript!");

const a = 1 + 2;
const b = a + 3;

const c = {
    apple: a,
    banana: b,
};

const d = c.apple * 4;

console.log({ d });