/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

/*
    Workflow #1:
        yarn start

    Workflow #2: (editor provides eslint feedback)
        Pane #1:
        yarn tsc --watch

        Pane #2:
        echo ./dist/index.js | entr -c node /_
*/

{
    // Return type is inferred. I can make it non-optional via a eslint rule.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function add(a: number, b: number) {
        return a + b;
    }

    function mul(a: number, b: number): number {
        return a * b;
    }
}

{
    // There are 5 ways to declare a function

    // Named function
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function greet1(name: string) {
        return 'hello ' + name;
    }

    console.log({ greet1: greet1("Benjamin") });

    // Function expression
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const greet2 = function (name: string) {
        return 'hello ' + name;
    };
    console.log({ greet2: greet2("Benjamin") });

    // Arrow function expression
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const greet3 = (name: string) => {
        return 'hello ' + name;
    };
    console.log({ greet3: greet3("Benjamin") });

    // Shorthand arrow function expression
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const greet4 = (name: string) => 'hello ' + name;
    console.log({ greet4: greet4("Benjamin") });

    // Function constructor - not safe!
    const greet5 = new Function('name', 'return "hello " + name');
    console.log({ greet5: greet5("Benjamin") });
    console.log({ greet5_not_safe_not_sound: greet5(1) });
}

{
    // Optional parameters - must appear last
    function log(message: string, userId?: string): void {
        const time = new Date().toLocaleTimeString();
        console.log(time, message, userId || 'Not signed in');
    }

    log('Page loaded');
    log('User signed in', 'da763be');
}

{
    // Default params - must appear last too
    function log(message: string, userId = 'Not signed in'): void {
        const time = new Date().toLocaleTimeString();
        console.log(time, message, userId);
    }

    log('Page loaded');
    log('User signed in', 'da763be');
}

{
    type Context = {
        appId?: string,
        userId?: string,
    };

    function log(message: string, ctx: Context = { userId: 'Not signed in' }): void {
        const time = new Date().toLocaleTimeString();
        console.log(time, message, ctx.userId);
    }

    log('Page loaded');
    log('User signed in', { userId: 'da763be' });
}

{
    // Rest parameters

    // One can pass an array of numbers
    function sum1(numbers: number[]): number {
        return numbers
            .reduce((total, n) => total + n, 0);
    }

    console.log({ sum1: sum1([1, 2, 3]) });


    // Or make the function accept a variadic ("rest") parameter as such:
    // NOTE: a function may accept only one rest parameter. It must appear last.
    function sum2(...numbers: number[]): number {
        return numbers
            .reduce((total, n) => total + n, 0);
    }

    console.log({ sum2: sum2(1, 2, 3) });
}

{
    // Call, apply and bind: three other ways to call a function.
    function add(a: number, b: number): number {
        return a + b;
    }

    console.log({ normal: add(1, 2) });

    // `apply` binds a value to `this` within your function.
    // In this example, we bind `this` to `null`.
    // `apply` will then "spread" the second arg.
    console.log({ apply: add.apply(null, [1, 2]) });

    // `call` does the same thing as `apply` but applies its arguments in order instead of spreading.
    console.log({ call: add.call(null, 1, 2) });

    // `bind` also "binds" a `this` argument, but does not execute the function.
    // Instead, it returns a new function.
    console.log({ bind: add.bind(null, 1, 2)() });

    // `this` gotcha : START
    const x = {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        a() {
            return this;
        }
    };
    console.log({ "x.a": x.a() }); // `this` is `x`
    const a = x.a;
    a(); // `this` is now `undefined`!
    console.log({ a: a() });
    // `this` gotcha : END


    // TypeScript enforces declaring `this`'s type
    // This prevents runtime errors (i.e. forgetting to bind `this` by passing no parameter).
    // `this` is a reserved word when used as part of a function signature.
    function fancyDate(this: Date): string {
        return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`;
    }

    console.log({ fancyDate: fancyDate.call(new Date) });
}

{
    // Generators
    // Generate lazy lists

    function* fibGen(): IterableIterator<number> {
        let a = 0;
        let b = 1;
        while (true) {
            yield a; // next was called, the result is sent to the consumer, then execution gets paused.
            [a, b] = [b, a + b];
        }
    }

    const fib = fibGen();
    const fib0: IteratorResult<number> = fib.next();
    console.log({ fib: fib0 });
    console.log({ fib: fib.next() });
    console.log({ fib: fib.next() });
    console.log({ fib: fib.next() });
    console.log({ fib: fib.next() });
    console.log({ fib: fib.next() });
}

{
    // Iterators
    // They are the flip side of generators: they consume those values
    // The book is not very clear on this subject
    const numbers = {
        *[Symbol.iterator](): IterableIterator<number> {
            for (let n = 0; n < 10; n++) {
                yield n;
            }
        }
    };

    console.log('Consuming the iterator via a for loop...');
    for (const n of numbers) {
        console.log({ n });
    }

    console.log('Consuming the iterator via the spread operator');
    const allNums = [...numbers];
    console.log({ allNums });

    console.log('Destructure the iterator');
    const [a, b, ...rest] = numbers;
    console.log({ a, b, rest });
}

{
    // Call signatures

    // Normal
    function add(a: number, b: number): number {
        return a + b;
    }

    console.log({ add: add(1, 2) });

    // Capture the function into a variable.
    // eslint-disable-next-line @typescript-eslint/ban-types
    const f: Function = function add(a: number, b: number): number {
        return a + b;
    };
    // No type safety!
    console.log({ f: f(1, 2, "wat") }); // bad arg is ignored, in this case.

    // This is TypeScript's syntax for a function's type, or "call signature" (or "type signature")
    // The parameter names `a` and `b` just serve as documentation.
    const g: (a: number, b: number) => number =
        function add(a2: number, b2: number): number {
            return a2 + b2;
        };
    console.log({ g: g(1, 2) });

    // Remove redundant type annotations on the right
    const h: (a: number, b: number) => number =
        function (a2, b2) {
            return a2 + b2;
        };
    console.log({ h: h(1, 2) });

    // Remove even more redundant constructs
    const i = (a: number, b: number): number => a + b;
    console.log({ i: i(1, 2) });
}

// We can "pull-out" the call signatures into a type
type Log = (message: string, userId?: string) => void;
const log: Log = (message, userId = 'Not signed in') => {
    const time = new Date().toISOString();
    console.log(time, message, userId);
};
log('\x1b[1;33mPurchasing item 123\x1b[0m', 'user99');
log('other');

/*
    CONTEXTUAL TYPING
 */

// Similar to the prior example, we can define a function as such
function times(f: (index: number) => void, n: number): void {
    for (let i = 0; i < n; i++) {
        f(i);
    }
}

// And not having to specify the type of `f`
times(n => console.log(n), 4);

// If we don't declare `f` inline though, it be inferred as `any`
// function f(n) {
//     console.log(n); // <-- any!
// }
// times(f, 3);

/*
    OVERLOADED FUNCTION TYPES
 */

// Shorthand call signature
type Log2 = (message: string, userId?: string) => void;
const log2: Log2 = (message, userId = 'Not signed in') => {
    const time = new Date().toISOString();
    console.log(time, message, userId);
};
log2('\x1b[1;33mUsing shorthand call signature syntax\x1b[0m');

// Full call signature
type Log3 = { (message: string, userId?: string): void; };
const log3: Log3 = (message, userId = 'Not signed in') => {
    const time = new Date().toISOString();
    console.log(time, message, userId);
};
log3('\x1b[1;34mUsing full call signature syntax\x1b[0m');

/*
    Usually, the shorthand syntax is preferred.
    For more complicated cases, such as overloading the function, the full call signature syntax is necessary.
 */

type Reservation = string;
type Reserve = {
    (from: Date, to: Date, destination: string): Reservation;
    (from: Date, destination: string): Reservation;
};

// That is ugly!
// Anyhow, when using the "overloading" syntax above, type inference breaks.
const reserve: Reserve = (from: Date, toOrDestination: Date | string, destination?: string) => {
    // Oh no, I don't like that! (--> see exercises below, final implementation is much more reasonable)
    if (toOrDestination instanceof Date && destination !== undefined) {
        return "one-way!";
    } else {
        return "return-flight here";
    }
};

type Add = {
    (a: number, b: number): number;
    (a: string, b: string): number;
};

// I don't see how that could ever be a good idea!
const add: Add = (a: number | string, b: number | string): number => {
    const a2 = typeof a === 'string' ? parseInt(a) : a;
    const b2 = typeof b === 'string' ? parseInt(b) : b;
    return a2 + b2;
};
console.log('1 + 2 =', add(1, 2));
console.log('"1" + "2" =', add("1", "2"));

// Won't compile!
// const add2: Add = (a: number, b: number) => {
//     return a + b;
// }
//
// const add2: Add = (a: string, b: string) => {
//     return 0;
// }

// Won't compile either!
// function add2(a: number, b: number): Add {
//     return a + b;
// }
//
// function add2(a: string, b: string): Add {
//     return 0;
// }

// Overall, I don't like this feature at all.

/*
    POLYMORPHISM
 */

// Sometimes, we don't know an argument's expected (concrete) type

// It looks like this used to compile...
/*
type Filter = {
    (array: number[], f: (item: number) => boolean): number[]
    (array: string[], f: (item: string) => boolean): string[]
}

const filter: Filter = (array, f) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (f(item)) result.push(item);
    }
    return result;
}
 */

// Anyhow, let's deal with generics.
type Filter = {
    <T>(array: T[], f: (item: T) => boolean): T[];
};
type Filter2 = <T>(array: T[], f: (item: T) => boolean) => T[];

const filter: Filter2 = (array, f) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (f(item)) result.push(item);
    }
    return result;
};

console.log("Filtering evens:", filter([1, 2, 3], item => item % 2 === 0));
console.log("Filtering non blank:", filter(["a", "", " ", "c"], item => item.trim() !== ""));

const names = [
    { firstName: 'John' },
    { firstName: 'Mary' },
    { firstName: 'Joe' },
];

console.log("Names starting with 'J'", filter(names, _ => _.firstName.startsWith('J')));
console.log("Names starting with 'J'", filter(names, n => n.firstName.startsWith('J')));

/*
    WHEN GENERICS ARE BOUND
 */

// If the generic type parameter is declared too early...
type Filter3<T> = (array: T[], f: (item: T) => boolean) => T[];

// ...this forces the caller to declare the corresponding concrete type too early too.
// As a result, this function isn't generic anymore
const filter3: Filter3<number> = (array, f) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (f(item)) result.push(item);
    }
    return result;
};

// Another way to define generic parameters
const filter4 = <T>(array: T[], f: (item: T) => boolean): T[] => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (f(item)) result.push(item);
    }
    return result;
};

function filter5<T>(array: T[], f: (item: T) => boolean): T[] {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (f(item)) result.push(item);
    }
    return result;
}

function map<T, U>(array: T[], f: (item: T) => U): U[] {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        result.push(f(item));
    }
    return result;
}

console.log("Map (* 2) -> string:", map([1, 2, 3], n => (n * 2).toString()));
console.log("Map (* 2) -> string:", map<number, string>([1, 2, 3], n => (n * 2).toString()));

/*
    GENERIC TYPE ALIASES
 */

type MyEvent<T> = {
    target: T;
    type: string;
};

type ButtonEvent = MyEvent<HTMLButtonElement>;



// Commenting out, Node does not know `document`!
// When you use a generic type like `MyEvent`, you have to explicitly bind its type
// parameters when you use the type; they won't be inferred for you.
// const myEvent: MyEvent<HTMLButtonElement | null> = {
//     target: document.querySelector('#myButton'),
//     type: 'click',
// };

type TimedEvent<T> = {
    event: MyEvent<T>; // refers to the outer `T`
    from: Date;
    to: Date;
};

// You can use a generic type alias in a function's signature too.
function triggerEvent<T>(event: MyEvent<T>/* refers to the outer `T` */): void {
    console.log('triggered:', event);
}

// Commenting out, Node does not know `document`!
// triggerEvent({ // `T` is `Element | null`
//     target: document.querySelector('#myBtn'),
//     type: 'mouseover'
// });

/*
    BOUNDED POLYMORPHISM
*/

// Sometimes, saying we want a thing of type `T` is not enough!
// Sometimes, we want a thing of type `U` that should *at least* be of type `T`.

// Example: we want to implement a binary tree, consisting of:
//          - Regular TreeNodes
//          - LeafNodes which are TreeNodes that don't have children
//          - InnerNodes which are TreeNodes that do have children

type TreeNode = {
    value: string;
};

type LeafNode = TreeNode & {
    isLeaf: true;
};

type InnerNode = TreeNode & {
    // One child or 2 children
    children: [TreeNode] | [TreeNode, TreeNode];
};

const a: TreeNode = { value: 'a' };
const b: LeafNode = { value: 'b', isLeaf: true };
const c: InnerNode = { value: 'c', children: [b] };

// What we want:
const a1: TreeNode = mapNode(a, s => s.toUpperCase());
const b1: LeafNode = mapNode(b, s => s.toUpperCase());
const c1: InnerNode = mapNode(c, s => s.toUpperCase());


// `T` has an "upper bound" of `TreeNode`.
// `T` can be either a `TreeNode`, or a subtype of `TreeNode`
// Thusly, this limits what `T` can be passed in. For instance `T` may not be a number!
// And so, it must have a `.value` property!
function mapNode<T extends TreeNode>(node: T, f: (value: string) => string): T {
    // node.value = f(node.value);
    // return node;
    return {
        ...node,
        value: f(node.value),
    };
}

type A = number | Date;

const an: A = 1;
const ad: A = new Date();

type B = { a: number; } & { b: Date; };
const intersect: B = { a: 1, b: new Date() };

// We can also enforce multiple type constraints via `&`

type HasSides = { numberOfSides: number; };
type SidesHaveLength = { sideLength: number; };

// `MyShape` only exists within this definition of the generic type
function logPerimeter<MyShape extends HasSides & SidesHaveLength>(s: MyShape): MyShape {
    console.log(s.numberOfSides * s.sideLength);
    return s;
}

const shape = logPerimeter({ numberOfSides: 4, sideLength: 8 });

type Square = HasSides & SidesHaveLength;
const sq: Square = { numberOfSides: 4, sideLength: 3 };

// Very confusing examples from the author... Why would log return a shape?? Anyhow let's continue...
const sq2: Square = logPerimeter(sq);

// Reimplement JavaScript's `call` function
function call<T extends unknown[], R>(
    f: (...args: T) => R,
    ...args: T
): R {
    return f(...args);
}
function fill(length: number, value: string): string[] {
    return Array.from({ length }, () => value);
}

// Now **THAT** is crazy! It's type-safe!!
call(fill, 10, 'a');

/*
    Here is the breakdown of how that works:

    - call is a variadic function that has 2 parameters: T and R
        - T is a subtype of unknown[]
        - in other words T is an array or tuple of any type
    - call's first parameter is the variadic function f.
        - who's args of type T will be identical to...
    - ...the remaining args for call
    - the type R returned from f will be the return type of call
*/

/*
    GENERIC TYPE DEFAULTS
*/

// We can specify a "default" generic type
type MyEvent2<T = HTMLElement> = {
    target: T;
    type: string;
};

// before
// const myEvent1: MyEvent<HTMLElement> = { target: document.body, type: 'click' };
// after
// const myEvent2: MyEvent2 = { target: document.body, type: 'click' };

// We can also make T a subtype of HTMLElement
// Unfortunately, the book is not quite clear how that could be used (I can't constraint
// the event to HTMLInputElement for instance)
type MyEvent3<T extends HTMLElement = HTMLElement> = {
    target: T;
    type: string;
};
// const myEvent3: MyEvent3 = { target: document.body, type: 'click' };

/*
    TYPE-DRIVEN DEVELOPMENT
*/

/*
    EXERCISES

    1. TS can infer a function params' types + its return value
    2. Instead of JS' `arguments` object, use ...rest params and make the fn variadic
    3. Overload `reserve` with a 3rd option: no start date. See implementation below.
    4. Skip. I'll have to play more with the type system before tackling this
    5. Implement `is`, a small typesafe assertion library. See below.
*/

// Optional param must come last!
type Reserve3 = {
    (dest: string, from: Date): number;
    (dest: string): number;
};
const reserve3: Reserve3 = (_dest: string, _from?: Date) => {
    return 0;
};

type Reservation2 = string;
type Reserve2 = {
    (destination: string): Reservation2;
    (destination: string, from: Date): Reservation2;
    (destination: string, from: Date, to: Date): Reservation2;
};

// I initially highly disliked the author's suggestion for function overloading
// I find this implementation to be much more reasonable however (kinda)
const reserve2: Reserve2 = (dest: string, dep?: Date, ret?: Date) => {
    if (dep && ret) { // having to check that `dep` is not undefined is kinda unfortunate
        return `Return flight ticket booked for ${dest.toUpperCase()} (${dep.toDateString()} => ${ret.toDateString()})`;
    } else if (dep) {
        return `One way ticket booked for ${dest.toUpperCase()} (${dep.toDateString()})`;
    } else {
        return `Immediate departure for: ${dest.toUpperCase()}`;
    }
};

const tomorrow = new Date(Date.now() + 60_000 * 60 * 24);
const nextWeek = new Date(Date.now() + 60_000 * 60 * 24 * 7);
console.log(reserve2('Paris'));
console.log(reserve2('London', tomorrow));
console.log(reserve2('Rome', tomorrow, nextWeek));

// Assertion lib `is`

function is<T>(...args: T[]): boolean {
    for (let i = 1; i < args.length; i++) {
        const prev = args[i - 1];
        const curr = args[i];
        if (curr !== prev) return false;
    }
    return true;
}

console.log('Both strings are not equal, should return false =>',
    is('A', 'B')
);
console.log('Both strings are equal, should return true =>',
    is('A', 'A')
);

console.log('Both bools are not equal, should return false =>',
    is(true, false)
);
console.log('Both bools are equal, should return true =>',
    is(true, true),
    is(false, false)
);

console.log('Both numbers are equal, should return true =>',
    is(42, 42)
);
console.log('Both numbers are not equal, should return false =>',
    is(42, 1)
);

// Should not compile => OK
// is(10, 'foo');

// Should handle variadic args
// NOTE: the author suggests feeding in arrays, but we haven't learned about array equality yet so I'll use numbers instead.
console.log('All numbers are equal, should return true =>',
    is(1, 1, 1),
    is(2, 2, 2),
);
console.log('All numbers are not equal, should return false =>',
    is(1, 1, 2),
    is(2, 1, 1),
);