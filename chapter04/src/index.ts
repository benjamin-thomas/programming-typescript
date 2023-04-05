/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

/*
  yarn run lint
  clear && yarn run dev
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
  // Default params - may not appear last
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