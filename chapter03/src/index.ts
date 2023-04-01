/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */


/*
  ./node_modules/.bin/tsc && node ./dist/index.js
*/

/*
  ANY: avoid using this type.
  ===========================
*/
const a: any = 666;
const b: any = ['danger'];
const c = a + b;

console.log({ c });


/*
  UNKNOWN: favor this type over `any`.
  ====================================

  TypeScript won't let you use the `unknown` type until you refine it by checking what it is.
*/
const d: unknown = 30;
const e = d === 123; // inferred as `boolean`
console.log({ e });

// const f = d + 10; // 'd' is of type 'unknown'.ts(18046)
if (typeof d === 'number') {
    const f = d + 10; // `d` is "refined" to the `number` type
    console.log({ f });
}


/*
  BOOLEANS
  ========
*/
const g: boolean = true;
const h: true = true; // `true` is known as a type literal

const i = true; // inferred as `true`
let j = true; // inferred as `boolean`!


/*
  NUMBER
  ======
*/

let k = 1234; // inferred as `number`
const l = 1234; // inferred as `1234`!
// const m: 1 = 2; // type error!

/*
  BIGINT
  ======
*/

let m = 1234n; // requires targeting es2020. Inferred as `bigint`.
const n = 1234n; // inferred as `1234n`!


/*
  STRING
*/

let o = "hello"; // inferred as `string`
const p = "hello"; // inferred as `"hello"`!
// const q: "abc" = "def"; // type error!


/*
  SYMBOL

  NOTE: a "unique symbol" is always equal to itself.
*/
let q = Symbol("a"); // inferred as `symbol`
const r = Symbol("b"); // inferred as `typeof r`, a "unique symbol"
const s: symbol = Symbol("c");
const t: unique symbol = Symbol("d"); // `typeof t`. Cannot be initialized with `let`.


/*
  OBJECTS
*/

// `object` is as loose as any: it's just a JavaScript object!
let u: object = {
    x: 1
};

// const v = u.x; // cannot access `u.x`

const v = { x: 1 }; // inferred as `{x: number;}` (not `{x: 1;}`)
v.x++; // The object's properties are mutable
const w = v.x + 1; // inferred as number
const x: { a: number; } = { a: 2 }; // set type explicitly.

// Object literal syntax accepts a "shape"
let person: {
    firstName: string,
    lastName: string,
} = {
    firstName: "Benjamin",
    lastName: "Thomas",
};

class Person {
    constructor(
        public firstName: string,
        public lastName: string,
        public age: number,
    ) { }
}
person = new Person("Benjamin", "Thomas", 42); // "shape" re-initialized with new construct (a class).
person = { firstName: "Benjamin", lastName: "Thomas" }; // must be exact with object literals
// person = { firstName: "Benjamin", lastName: "Thomas", age: 42 }; // compile error

let withOptionalProp: {
    firstName: string,
    lastName: string,
    age?: number,
} = {
    firstName: "Benjamin",
    lastName: "Thomas",
};

class Person2 {
    constructor(
        public firstName: string,
        public lastName: string,
        public age?: number,
    ) { }
}
withOptionalProp = new Person2("Benjamin", "Thomas");
withOptionalProp = new Person2("Benjamin", "Thomas", 42);
withOptionalProp = { firstName: "Benjamin", lastName: "Thomas" };
withOptionalProp = { firstName: "Benjamin", lastName: "Thomas", age: 42 };

// Provide an explicit "index signature"
// NOTE: the key type must be `number` or `string`
const dict: {
    [key: number]: string;
} = {
    1: "hello",
    2: "world",
};

console.log({ v: dict[1] });

const withoutReadOnly: { a: number; } = { a: 1 };
const withReadOnly: { readonly a: number; } = { a: 1 };

withoutReadOnly.a++; // OK
// withReadOnly.a++; // compiler error

// Avoid empty object literal: it accepts anything but null/undefined.
// eslint-disable-next-line @typescript-eslint/ban-types
let empty: {} = {};
empty = { a: 1 };
empty = { what: "ever" }; // ts compiler still considers type to be `{}`
empty = 1; // !!

/*
  TYPE ALIASES
*/

type Age = number;

type Person3 = {
    name: string,
    age: Age,
};



// Aliases are never inferred so must be set explicitly.
const ageForJohn: Age = 42;
const driver: Person3 = {
    name: "John Doe",
    age: ageForJohn, // `age` would also accept a plain `number` value.
};

{
    // New scope can shadow previous type declarations
    type Person = {
        name: string,
        age: Age,
    };
    const p: Person = { name: "John Doe", age: 42 };

    console.log({ p });
}

if (ageForJohn === 42) {
    // New scope can shadow previous type declarations
    type Person = {
        name: string,
        age: Age,
    };
    const p: Person = { name: "John Doe2", age: 42 };

    console.log({ p });
}