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


/* Union and Intersection types */
{
  type Cat = { name: string, purs: boolean; };
  type Dog = { name: string, barks: boolean; };

  type CatOrDog = Cat | Dog;
  type CatAndDog = Cat & Dog;

  const c: CatOrDog = { name: "a", purs: true }; // sum type: can contain Cat's and Dog's properties, or Cat's properties, or Dog's properties.
  const d: CatAndDog = { name: "a", barks: true, purs: true }; // product type: must contain Cat's and Dog's properties.
}

/* Arrays */
{
  const a = [1, 2, 3]; // inferred as `number[]`
  const b = ['1', '2', '3']; // inferred as `string[]`
  const c = [1, 'b']; // inferred as `(string|number)[]`
  // a.push('2'); // type error!

  const d: number[] = [1, 2, 3];
  const d2: Array<number> = [1, 2, 3]; // alternative syntax

  const e = []; // `e` is inferred as `any[]`
  e.push(1);
  e.push('1');
  e; // `e` is now inferred as `(string | number)[]`. The final type is set once `e` leaves the scope it was defined in.
}

/* Tuples
   They are a subtype of Array.
   They are a special way to type arrays that have fixed lengths, where the values at each index have specific, known types.
   Unlike other types, tuples must be explicitly type when declared.
 */
{
  const a: [number] = [1];

  // A tuple of firstName, lastName, birthYear
  const me: [string, string, number] = ['Benjamin', 'Thomas', 1981];
  // const me2: [string, string, number] = ['Benjamin', 'Thomas', '1981']; // type error!

  // An array of tuples, where the tuple can maybe contain a second number
  const trainFares: [number, number?][] = [
    [3.75],
    [8.25, 7.70],
    [10.50],
  ];

  // Not quite equivalent syntax (undefined can be inserted above, not here).
  const trainFares2: ([number] | [number, number])[] = [
    [3.75],
    [8.25, 7.70],
    [10.50],
  ];

  // A heterogeneous list, with a "rest" parameter.
  const b: [number, number, ...string[]] = [1, 2, 'a', 'b', 'c'];

}

/* Read-only arrays
   They must be explicitly typed
*/
{
  const a: readonly number[] = [1, 2, 3];
  const b: readonly number[] = a.concat(4); // Must be explicitly typed, again.
  const c = a[0];
  // a[0] = 9; // type error!

  // Alternative syntax, arrays.
  type A = readonly string[];
  type B = ReadonlyArray<string>;
  type C = Readonly<string[]>;
  type C2 = Readonly<Array<string>>;

  // Alternative syntax, tuples
  type D = readonly [number, string];
  type E = Readonly<[number, string]>;
}

/* null, undefined, void and never */
(function () {

  // null may represent the absence of value
  function a(x: number): number | null {
    if (x < 10) {
      return x;
    }
    return null;
  }

  // undefined may represent a value not yet defined
  function b(): undefined {
    return undefined;
  }

  // void means the function returns nothing, or throws an exception.
  function c(): void {
    console.log('c was called...');
  }

  // never means the function never returns
  // never is known as a "bottom type", the subtype of every other type.
  function d(): never {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log("I'm running forever...");
    }
  }

}());

/* Enums */
(function () {
  // A number is automatically assigned at compile time.
  enum Language {
    English,
    Spanish,
    Russian,
  }

  // Same thing, but set the numbers explicitly.
  enum Lang {
    English = 0,
    Spanish = 1,
    Russian = 2,
  }

  // Syntax to access the enum values
  const eng = Lang.English;
  const span = Lang['Spanish'];

  // A later enum declaration can be "merged" with the previous one.
  // NOTE: this requires explicit value assignment
  enum Lang {
    French = 3
  }

  const fr = Lang.French;

  // The type of the values may differ
  enum Color {
    Red = 'red',
    Green = 0x00FF00,
  }

  const red: Color = Color.Red;
  const green: Color = Color.Green;

  const red2 = Color[0]; // unsafe!
  const wat = Color[99]; // will be `undefined` at runtime

  // When the enum is declared with `const`, the array access syntax is not available.
  const enum Commands {
    Start,
    Stop,
  }
  // const start = Commands[0]; // compiler error

  function doStuff(c: Commands) {
    console.log({ c });

  }

  doStuff(Commands.Start);
  doStuff(1);
  doStuff(99); // no compile error!

  // Because of this, it's better to favor the use of string-valued enums

  const enum Cmd {
    Start = 'Start',
    Stop = 'Stop',
  }

  function doWork(c: Cmd) {
    console.log({ c });
  }
  doWork(Cmd.Start);
  // doWork('Stop'); // compile error!
}());

// EXERCISES
{
  // 1. For each of these values, what type will TypeScript infer
  let a = 1042; // number
  let b = 'apples and oranges'; // string
  const c = 'pineapples'; // "pineapples"
  let d = [true, true, false]; // boolean[]
  let e = { type: 'ficus' }; // {type:string}
  let f = [1, false]; // (number | boolean)[]
  const g = [3]; // number[]
  let h = null; // any

  // 2. Why does each of these throw the error it does?
  /*
  a. typed literal is not matched
  b. cannot push a string to a number[]
  c. cannot use `never` to assign a variable
  d. type must be "refined" with `typeof` before usage.
  */
}