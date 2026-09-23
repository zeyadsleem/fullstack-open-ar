---
part: 9
letter: c
title: "First steps with TypeScript"
mainImage: /images/part-9.svg
lang: en
---
After the brief introduction to the main principles of TypeScript, we are now ready to start our journey toward becoming FullStack TypeScript developers. Rather than giving you a thorough introduction to all aspects of TypeScript, we will focus in this part on the most common issues that arise when developing an Express backend or a React frontend with TypeScript. In addition to language features, we will also have a strong emphasis on tooling.

### Setting things up

Since version 22.6 that was released in August 2024, Node.js has been capable of running TypeScript code. Node doesn't actually understand TypeScript, it just deletes the type annotations and runs the remaining JavaScript.

Node.js doesn’t perform type checking, so you only get a small subset of TypeScript’s benefits out of the box. To unlock the full TypeScript experience, type checking, compilation, and richer tooling, we'll also need to install the <a href="https://www.npmjs.com/package/typescript" data-type="link" data-id="https://www.npmjs.com/package/typescript">TypeScript</a> npm package, which provides the compiler (tsc) and language services.

As we recall from <a href="https://fullstackopen.com/en/part3" target="_blank" rel="noreferrer noopener">part 3</a>, an npm project is set by running the command <code>npm init</code> in an empty directory. Then we can install the dependency by running

```bash
npm install --save-dev typescript
```

Let us also set up <em>scripts</em> within the file <em>package.json</em>:

```json
{
  // ...
  "type": "module",      // HIGHLIGHT LINE
  "scripts": {
   "tsc": "tsc --noEmit" // HIGHLIGHT LINE
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

We can now use the script to typecheck a TypeScript file:

```bash
npm run tsc file.ts
```

The --noEmit option tells the TypeScript compiler not to generate JavaScript output. It runs type checking only, without generating compiled file.

Note that we have defined <em>"type": "module"</em> that tells Node.js to treat files in this package as ES modules (ESM) rather than CommonJS modules, meaning that we can use the <em>import/export </em>syntax instead of <em>require</em>, that is the preferred way in TypeScript.

Let us add a configuration file&nbsp;<em>tsconfig.json</em>&nbsp;to the project with the following content:

```json
{
  "compilerOptions":{
    "noImplicitAny": false,
    "noEmit": true
  }
}
```

The <em>tsconfig.json</em> file is used to define how the TypeScript compiler should interpret the code, how strictly the compiler should work, which files to watch or ignore, and <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html" target="_blank" rel="noreferrer noopener">much more</a>. For now, we will just disable the compiler option <a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>, so it is not required to type for all variables used. We also defined <a href="https://www.typescriptlang.org/tsconfig/#noEmit">"noEmit": true</a> since we are only going to use the TypeScript compiler for checking.

We can now drop the parameter <em>--noEmit</em> from the npm script:

```json
{<br>  // ...<br>  "scripts": {<br>   "tsc": "tsc" // HIGHLIGHT LINE<br>  },<br>  // ...<br>}
```

> A note about the coding style
>
> JavaScript is a quite relaxed language in itself, and things can often be done in multiple different ways. For example, we have named vs anonymous functions, using const and let or var, and the optional use of <em>semicolons</em>. This part of the course differs from the rest by using semicolons. It is not a TypeScript-specific pattern but a general coding style decision taken when creating any kind of JavaScript project. Whether to use them or not is usually in the hands of the programmer, but since it is expected to adapt one's coding habits to the existing codebase, you are expected to use semicolons and adjust to the coding style in the exercises for this part. This part has some other coding style differences compared to the rest of the course as well, e.g. in the directory naming conventions.

Let's start by creating a simple Multiplier to the file <em>multiplier.ts</em>. It looks exactly as it would in JavaScript.

```js
const multiplicator = (a, b, printText) =&gt; {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

As you can see, this is still ordinary basic JavaScript with no additional TS features. When we use the TypeScript compiler to do the type checking with the command <code>npm run tsc multiplier.ts</code> there are no complaints. So we know that the code is typesafe, and we can confidently run it with the command <code>node multiplier.ts</code>.

To speed things up, let’s create a script that first performs type checking and then runs the code if the checks pass.

```json
{
  // ..
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc &amp;&amp; <span style="background-color: rgba(30, 30, 30, 0.2); font-family: inherit; text-align: initial;">node multiplier.ts</span>" // HIGHLIGHT LINE
  },
  // ..
}
```

So now just <code>npm run multiply</code> typecheck and run the code.

What happens if we end up passing the wrong <em>types</em> of arguments to the multiplicator function?

Let's try it out!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

Now when we run the code, the output is:&nbsp;<em>Multiplied a string and 4, the result is: NaN</em>.

Wouldn't it be nice if the language itself could prevent us from ending up in situations like this? This is where we see the first benefits of TypeScript. Let's add types to the parameters and see where it takes us.

TypeScript natively supports multiple types including&nbsp;<em>number</em>,&nbsp;<em>string</em>&nbsp;and&nbsp;<em>Array</em>. See the comprehensive list&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" target="_blank" rel="noreferrer noopener">here</a>. More complex custom types can also be created.

The first two parameters of our function are of type number and the last one is of type string, both types are&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean" target="_blank" rel="noreferrer noopener">primitives</a>:

```ts
const multiplicator = (a: number, b: number, printText: string) => { // HIGHLIGHT LINE
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

Now the code is no longer valid TypeScript. When we try to run the code, we notice that it does not compile:

![صورة توضيحية](/images/mooc/e09f293805d1.webp)

One of the best things about TypeScript's editor support is that you don't necessarily need to even run the code to see the issues. VSCode is so efficient that it informs you immediately when you are trying to use an incorrect type:

![صورة توضيحية](/images/mooc/e11f787a659d.webp)

### Creating your first own types

Let's expand our multiplicator into a slightly more versatile calculator that also supports addition and division. The calculator should accept three arguments: two numbers and the operation, either&nbsp;<em>multiply</em>,&nbsp;<em>add</em>&nbsp;or&nbsp;<em>divide</em>, which tells it what to do with the numbers.

In JavaScript, the code would require additional validation to make sure the last argument is indeed a string. TypeScript offers a way to define specific types for inputs, which describe exactly what type of input is acceptable. On top of that, TypeScript can also show the info on the accepted values already at the editor level.

We can create a&nbsp;<em>type</em>&nbsp;using the TypeScript native keyword&nbsp;<em>type</em>. Let's describe our type&nbsp;<em>Operation</em>:

```ts
type Operation = 'multiply' | 'add' | 'divide';
```

Now the <em>Operation</em> type accepts only three kinds of values; exactly the three strings we wanted. Using the OR operator | we can define a variable to accept multiple values by creating a union type. In this case, we used exact strings (that, in technical terms, are called string literal types), but with unions, you could also make the compiler accept, for example, both string and number: <em>string | number</em>.

The&nbsp;<em>type</em>&nbsp;keyword defines a new name for a type:&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">a type alias</a>. Since the defined type is a union of three possible values, it is handy to give it an alias that has a representative name.

Let's look at our calculator now:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) =&gt; {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can\'t divide by 0!';
    return a / b;
  }
}
```

Now, when we hover on top of the <em>Operation</em> type in the calculator function, we can immediately see suggestions on what to do with it:

![صورة توضيحية](/images/mooc/09fe4d4fe943.webp)

And if we try to use a value that is not within the <em>Operation</em> type, we get the familiar red warning signal and extra info from our editor:

![صورة توضيحية](/images/mooc/f8c733f3b516.webp)

This is already pretty nice, but one thing we haven't touched yet is typing the return value of a function. Usually, you want to know what a function returns, and it would be nice to have a guarantee that it returns what it says it does. Let's add a return value&nbsp;<em>number</em>&nbsp;to the calculator function:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => { // HIGHLIGHT LINE
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'this cannot be done';
    return a / b;
  }
}
```

The compiler complains straight away because, in one case, the function returns a string. There are a couple of ways to fix this:

We could extend the return type to allow string values, like so:

```ts
const calculator = (a: number, b: number, op: Operation): number | string =&gt;  {
  // ...
}
```

Or we could create a return type, which includes both possible types, much like our Operation type:

```ts
type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result =&gt;  {
  // ...
}
```

But now the question is if it's&nbsp;<em>really</em>&nbsp;okay for the function to return a string?

When your code can end up in a situation where something is divided by 0, something has probably gone terribly wrong, and an error should be thrown and handled where the function was called. When you are deciding to return values you weren't originally expecting, the warnings you see from TypeScript prevent you from making rushed decisions and help you to keep your code working as expected.

One more thing to consider is that even though we have defined types for our parameters, the generated JavaScript used at runtime does not contain the type checks. So if, for example, the <em>Operation</em> parameter's value comes from an external interface, there is no definite guarantee that it will be one of the allowed values. Therefore, it's still better to include error handling and be prepared for the unexpected to happen. In this case, when there are multiple possible accepted values and all unexpected ones should result in an error, the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch" data-type="link" data-id="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">switch...case</a> statement suits us better than if...else in our code.

The code of our calculator should look something like this:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) : number => {   // HIGHLIGHT LINE
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can\'t divide by 0!'); // HIGHLIGHT LINE
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!'); // HIGHLIGHT LINE
  }
}

try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### Type narrowing

The default type of the catch block parameter&nbsp;<em>error</em>&nbsp;is&nbsp;<em>unknown</em>. The&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noreferrer noopener">unknown</a>&nbsp;is a kind of top type that was introduced in TypeScript version 3 to be the type-safe counterpart of&nbsp;<em>any</em>. Anything is assignable to&nbsp;<em>unknown</em>, but&nbsp;<em>unknown</em>&nbsp;isn’t assignable to anything but itself and&nbsp;<em>any</em>&nbsp;without a type assertion or a control flow-based type narrowing. Likewise, no operations are permitted on an&nbsp;<em>unknown</em>&nbsp;without first asserting or narrowing it to a more specific type.

Both the possible causes of exception (wrong operator or division by zero) will throw an&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank" rel="noreferrer noopener">Error</a>&nbsp;object with an error message, that our program prints to the user.

If our code would be JavaScript, we could print the error message by just referring to the field&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message" target="_blank" rel="noreferrer noopener">message</a>&nbsp;of the object&nbsp;<em>error</em>&nbsp;as follows:

```
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error) {
  console.log('Something went wrong: ' + error.message); // HIGHLIGHT LINE
}
```

Since the default type of the&nbsp;<em>error</em>&nbsp;object in TypeScript is&nbsp;<em>unknown</em>, we have to&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">narrow</a>&nbsp;the type to access the field:

```js
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  // here we can not use error.message
// BEGIN HIGHLIGHT
  if (error instanceof Error) {
   // the type is narrowed and we can refer to error.message
// END HIGHLIGHT
    errorMessage += error.message;
}
  // here we can not use error.message // HIGHLIGHT LINE

  console.log(errorMessage);
}
```

Here, the narrowing was done with the instanceof type guard, which is just one of the many ways to narrow a type. We shall see many others later in this part.

### Accessing command line arguments

The programs we have written are alright, but it sure would be better if we could use command-line arguments instead of always having to change the code to calculate different things.

Let's try it out, as we would in a regular Node application, by accessing <em>process.argv</em>. However, something is not right:

![صورة توضيحية](/images/mooc/b48ba06e9482.webp)

The error message gives us a hint how to fix the problem:

```bash
npm install --save-dev @types/node
```

When the package <em>@types/node</em> is installed, the compiler does not complain about the variable process. Note that there is no need to require the types in the code, the installation of the package is enough!

### About @types/{npm_package}

We just installed the npm package <em>@types/node </em>to get rid of a typing error. What actually is this package?

TypeScript expects types for all code you use, including external libraries, so it can provide IntelliSense, editor support, and compile-time checks. Many libraries don’t include their own types. When that happens, the community-maintained typings from&nbsp;<a href="https://github.com/DefinitelyTyped/DefinitelyTyped">DefinitelyTyped</a>&nbsp;are published on npm under the @types organization.

Install @types packages only if the library doesn’t already ship types. You can check the package’s documentation or package.json for a types field. Install these packages as&nbsp;<em>devDependencies</em>, since they’re only needed during development and build, and keep their versions aligned with the library to avoid mismatches.

For example,&nbsp;<em>@types/express</em>&nbsp;adds types for Request, Response, Router, and middleware, improving safety and ergonomics when building routes. Similarly, you can install types for other libraries that lack built-in types, such as&nbsp;<em>@types/react</em>,&nbsp;<em>@types/lodash,</em>&nbsp;or&nbsp;<em>@types/mongoose</em>.

Behind these packages is the&nbsp;<a href="https://github.com/DefinitelyTyped/DefinitelyTyped">DefinitelyTyped</a>&nbsp;project, an active community that maintains and updates typings for a vast number of npm libraries. In most cases, you can rely on these instead of writing your own. The takeaway: prefer built-in types when available; otherwise, install the relevant @types packages as devDependencies and keep them in sync with your library versions.

### Improving the project

We can get the <em>multiplier</em> to work with command-line parameters as follows:

```ts
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

// BEGIN HIGHLIGHT
// command line arguments start from process.argv[2]
const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])

multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
// END HIGHLIGHT
```

And we can run it with:

```bash
npm run multiply 5 2
```

If the program is run with parameters that are not of the right type, e.g.

```bash
npm run multiply 5 lol
```

it "works" but gives us the answer:

```
Multiplied 5 and NaN, the result is: NaN
```

The reason for this is, that&nbsp;<em>Number('lol')</em>&nbsp;returns&nbsp;<em>NaN</em>, which is actually of type&nbsp;<em>number</em>, so TypeScript has no power to rescue us from this kind of situation.

To prevent this kind of behavior, we have to validate the data given to us from the command line.

The improved version of the multiplicator looks like this:

```ts
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length &lt; 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) &amp;&amp; !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is:`);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
```

When we now run the program:

```bash
npm run multiply 1 lol
```

we get a proper error message:

```
Something bad happened. Error: Provided values were not numbers!
```

There is quite a lot going on in the code. The most important addition is the function&nbsp;<em>parseArguments</em>&nbsp;which ensures that the parameters given to&nbsp;<em>multiplicator</em>&nbsp;are of the right type. If not, an exception is thrown with a descriptive error message.

The definition of the function has a couple of interesting things:

```ts
const parseArguments = (args: string[]): MultiplyValues =&gt; {
  // ...
}
```

Firstly, the parameter&nbsp;<em>args</em>&nbsp;is an&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" target="_blank" rel="noreferrer noopener">array</a>&nbsp;of strings.

The return value of the function has the type&nbsp;<em>MultiplyValues</em>, which is defined as follows:

```ts
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

The definition utilizes TypeScript's&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">Interface</a>&nbsp;keyword, which is one way to define the "shape" an object should have. In our case, it is quite obvious that the return value should be an object with the two properties&nbsp;<em>value1</em>&nbsp;and&nbsp;<em>value2</em>, which should both be of type number.

#### The alternative array syntax

Note that there is also an alternative syntax for&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" target="_blank" rel="noreferrer noopener">arrays</a>&nbsp;in TypeScript. Instead of writing

```ts
let values: number[];
```

we could use the "generics syntax" and write

```js
let values: Array&lt;number&gt;;
```

In this course we shall mostly be following the convention enforced by the Eslint rule&nbsp;<a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">array-simple</a>&nbsp;that suggests writing the simple arrays with the [] syntax and using the &lt;&gt; syntax for the more complex ones, see&nbsp;<a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">here</a>&nbsp;for examples.

<div class="tasks">

**1. Body mass index**

</div>

<div class="tasks">

**2. Exercise calculator**

</div>

<div class="tasks">

**3. Command line**

</div>

### Adding Express to the mix

Right now, we are in a pretty good place. Our project is set up, and we have two executable calculators in it. However, since we aim to learn Full Stack development, it is time to start working with some HTTP requests.

Before that, let us expand a bit our configuration in the file <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">tsconfig.json</a>, which so far has only one tsconfig rule <a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>. Change the file to have the following content:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
// BEGIN HIGHLIGHT
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true
// END HIGHLIGHT
  }
}
```

Do not worry yet too much about the <em>compilerOptions</em>, they will be under closer inspection later on.

If you want, you can find explanations for each of the configurations from the TypeScript documentation, from the really handy <a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noreferrer noopener">tsconfig page</a>, or from the tsconfig <a href="http://json.schemastore.org/tsconfig" target="_blank" rel="noreferrer noopener">schema definition</a>.

Let us start the coding by installing Express:

```bash
npm install express
```

and then add the&nbsp;<em>start</em>&nbsp;script to package.json:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc  &amp;&amp; node multiplier.ts",
    "start": "tsc &amp;&amp; node index.ts"  // HIGHLIGHT LINE
  },
  // ..
}
```

Now we can create the file&nbsp;<em>index.ts</em>, and write the HTTP GET&nbsp;<em>ping</em>&nbsp;endpoint to it:

```js
const express = require('express');
const app = express();

app.get('/ping', (req, res) =&gt; {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () =&gt; {
  console.log(`Server running on port ${PORT}`);
});
```

Everything else seems to be ok but, as you'd expect, the <em>req</em> and <em>res</em> parameters of <em>app.get</em> need typing.

If you look carefully, VSCode is also complaining about the importing of Express. You can see a short yellow line of dots under <em>require</em>. Let's hover over the problem:

![صورة توضيحية](/images/mooc/545769391140.webp)

The complaint is that the&nbsp;<em>'require' call may be converted to an import</em>. Let us follow the advice and write the import as follows:

```js
import express from 'express';
```

> VSCode offers you the possibility to fix the issues automatically by clicking the <em>Quick Fix...</em> button. Keep your eyes open for these helpers/quick fixes; listening to your editor usually makes your code better and easier to read. The automatic fixes for issues can be a major time saver as well.

Import syntax is the way to go with TypeScript so we shall from this point on stick to it!

Now we run into another problem: the compiler complains about the import statement. Once again, the editor is our best friend when trying to find out what the issue is:

![صورة توضيحية](/images/mooc/88ec93b02966.webp)

The reason for the error is that we haven't installed types for <em>Express</em>. Let's do what the suggestion says and run:

```bash
npm install --save-dev @types/express
```

There should not be any errors remaining. Note that you may need to reopen the file in the editor to get VS Code in sync.

There is one more problem with the code:

![صورة توضيحية](/images/mooc/2eebb4d3ea9a.webp)

This is because we banned unused parameters in our&nbsp;<em>tsconfig.json</em>:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // HIGHLIGHT LINE
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true
  }
}
```

This configuration might create problems if you have library-wide predefined functions that require declaring a variable even if it's not used at all, as is the case here. Fortunately, this issue has already been solved on the configuration level. Once again, hovering over the issue gives us a solution. This time, we can just click the quick fix button:

![صورة توضيحية](/images/mooc/6ad212819a1c.webp)

If it is absolutely impossible to get rid of an unused variable, you can prefix it with an underscore to inform the compiler you have thought about it and there is nothing you can do.

Let's rename the <em>req</em> variable to <em>_req</em>.

Finally, we are ready to start the application. It seems to work fine:

![صورة توضيحية](/images/mooc/3f2bf36fca3b.webp)

To streamline development, we should enable auto-reloading. You’ve already used <em>node --watch </em>in this course,

We could try the following:

```json
{
  // ...
  "scripts": {
      // ...
      "dev": "tsc &amp;&amp; node --watch index.ts",
  },
  // ...
}
```

However, this does not quite work. The typecheck is done only at the beginning. One solution would be to run the type checking and Node in watch mode concurrently. This is easy with the npm package <a href="https://www.npmjs.com/package/concurrently">concurrently</a>. Let us install it:

```bash
npm install --save-dev concurrently
```

Add a script to&nbsp;<em>package.json</em>:

```
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc &amp;&amp; node multiplier.ts",
    "calculate": "tsc &amp;&amp; node calculator.ts",
// BEGIN HIGHLIGHT
    "start": "node index.ts",
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\""
// END HIGHLIGHT
  },
```

The <code>npm start</code> is now simplified, it is assumed that the type checking is done <em>before</em> running the code.

And now, by running <code>npm run dev,</code> we have a working, auto-reloading development environment for our project! There is, however, one thing to note. If a type error is introduced into the program, the type checker notices it, but the app keeps running, so you need to keep an eye on what happens in the console:

![صورة توضيحية](/images/mooc/5f8c905a4b47.webp)

There are also setups that would stop the program from running in case of a type error. We prefer a more lightweight approach.

The current trend is pretty much to rely on the editor for type checking while writing code, and run <code>tsc --noEmit</code> in a <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration">continuous integration </a>pipeline or as a Git <a href="https://pre-commit.com/" data-type="link" data-id="https://pre-commit.com/">pre-commit</a> hook. This keeps the dev loop lightweight.  <code>node --watch src/index.ts</code> just runs your code on save, while the editor surfaces type errors in real time. Type safety is still enforced, just at the moments that matter rather than blocking every run.

<div class="tasks">

**4. Express**

</div>

<div class="tasks">

**5. WebBmi**

</div>

### The horrors of&nbsp;<em>any</em>

Now that we have our first endpoints completed, you might notice that we have used barely any TypeScript in these small examples. When examining the code a bit closer, we can see a few dangers lurking there.

Let's add the HTTP POST endpoint&nbsp;<em>calculate</em>&nbsp;to our app:

```js
import { calculator } from './calculator.ts';

app.use(express.json());

// ...

app.post('/calculate', (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  return res.send({ result });
});
```

To get this working, we must add an&nbsp;<em>export</em>&nbsp;to the function&nbsp;<em>calculator</em>:

```ts
export const calculator = (a: number, b: number, op: Operation) : number =&gt; {
```

When you hover over the <em>calculate</em> function, you can see the typing of the <em>calculator</em> even though the code itself does not contain any typing:

![صورة توضيحية](/images/mooc/bb9e398fffda.webp)

But if you hover over the values parsed from the request, an issue arises:

![صورة توضيحية](/images/mooc/a75fc1a7f6ca.webp)

All of the variables have the type&nbsp;<em>any</em>. It is not all that surprising, as no one has given them a type yet. There are a couple of ways to fix this, but first, we have to consider why this is accepted and where the type&nbsp;<em>any</em>&nbsp;came from.

In TypeScript, every untyped variable whose type cannot be inferred implicitly becomes of type&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any" target="_blank" rel="noreferrer noopener">any</a>. Any is a kind of "wild card" type, which stands for&nbsp;<em>whatever</em>&nbsp;type. Things become implicitly any type quite often when one forgets to type functions.

We can also explicitly type things&nbsp;<em>any</em>. The only difference between the implicit and explicit any type is how the code looks; the compiler does not care about the difference.

Programmers however see the code differently when&nbsp;<em>any</em>&nbsp;is explicitly enforced than when it is implicitly inferred. Implicit&nbsp;<em>any</em>&nbsp;typings are usually considered problematic since it is quite often due to the coder forgetting to assign types (or being too lazy to do it), and it also means that the full power of TypeScript is not properly exploited.

This is why the configuration rule&nbsp;<a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>&nbsp;exists on the compiler level, and it is highly recommended to keep it on at all times. In the rare occasions when you truly cannot know what the type of a variable is, you should explicitly state that in the code:

```js
const a : any = /* no clue what the type will be! */.
```

We already have <em>noImplicitAny: true</em> configured in our example, so why does the compiler not complain about the implicit <em>any</em> types? The reason is that the <em>body</em> field of an Express <a href="https://expressjs.com/en/5x/api.html#req" target="_blank" rel="noreferrer noopener">Request</a> object is explicitly typed <em>any</em>. The same is true for the <em>request.query</em> field that Express uses for the query parameters.

> <strong>A note on importing</strong>
>
> If you looked closely to the code, you propably noticed that the import uses the full filename including the extension:
>
> import { calculator } from './calculator.ts';
>
> This is because Node.js needs to distinguish between the <em>.ts</em> source file and a potential compiled <em>.js</em> file of the same name, despite we will in our case not even have the <em>.js</em> files.

What if we would like to restrict developers from using the&nbsp;<em>any</em>&nbsp;type? Fortunately, we have methods other than&nbsp;<em>tsconfig.json</em>&nbsp;to enforce a coding style. What we can do is use&nbsp;<em>ESlint</em>&nbsp;to manage our code. Let's install ESlint and its TypeScript extensions:

```bash
npm install --save-dev eslint @eslint/js typescript-eslint
```

> <strong>NOTE:</strong> at the time of writing this (28.3.2026), the most recent <a href="https://www.npmjs.com/package/typescript-eslint">typescript-eslint</a> version (5.57.2) is not compatible with TypeScript 6, which was released 23.3.2026. Due to this, the command <code>npm install</code> fails. Until a new version is released, you must run the command in the form  <code>npm install --legacy-peer-deps</code>

We will configure ESlint to&nbsp;<a href="https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-explicit-any.mdx" target="_blank" rel="noreferrer noopener">disallow explicit any</a>. Write the following rules to&nbsp;<em>eslint.config.mjs</em>:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});

```

Let us also set up a&nbsp;<em>lint</em>&nbsp;npm script to inspect the files by modifying the&nbsp;<em>package.json</em>&nbsp;file:

```json
{
  // ...
  "scripts": {
      "tsc": "tsc",
      "calculate": "tsc &amp;&amp; node calculator.ts",
      "multiply": "tsc &amp;&amp; node multiplier.ts",
      "start": "node index.ts",
      "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
      "lint": "eslint ."      // HIGHLIGHT LINE
      //  ...
  },
  // ...
}
```

Now lint will complain if we try to define a variable of type <em>any</em>:

![صورة توضيحية](/images/mooc/dc0e824278bf.webp)

typescript-eslint has a lot of TypeScript-specific ESLint rules, but you can also use all basic ESLint rules in TypeScript projects. For now, we should probably go mostly with the recommended settings, and we will modify the rules as we go along whenever we find something we want to change the behavior of.

On top of the recommended settings, we should try to get familiar with the coding style required in this part and&nbsp;<em>set the semicolon at the end of each line of code to be required</em>. For that, we should install and configure&nbsp;<a href="https://eslint.style/packages/default" target="_blank" rel="noreferrer noopener">@stylistic/eslint-plugin</a>:

```bash
npm install --save-dev @stylistic/eslint-plugin
```

Our final&nbsp;<em>eslint.config.mjs</em>&nbsp;looks as follows:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
});
```

Quite a few semicolons are missing, but those are easy to add. We also have to solve the ESLint issues concerning <em>any</em> type:

![صورة توضيحية](/images/mooc/ef9805eea404.webp)

We could and probably should disable some ESlint rules to get the data from the request body.

Disabling&nbsp;<em>@typescript-eslint/no-unsafe-assignment</em>&nbsp;for the destructuring assignment and calling the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number" target="_blank" rel="noreferrer noopener">Number</a>&nbsp;constructor to values is nearly enough:

```js
app.post('/calculate', (req, res) => {
  // BEGIN HIGHLIGHT
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;
// END HIGHLIGHT

  const result = calculator(Number(value1), Number(value2), op);   // HIGHLIGHT LINE
  return res.send({ result });
});
```

However this still leaves one problem to deal with, the last parameter in the function call is not safe:

![صورة توضيحية](/images/mooc/299688d2f185.webp)

We can just disable another ESlint rule to get rid of that:

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// BEGIN HIGHLIGHT
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// END HIGHLIGHT
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

We now have ESlint silenced but we are totally at the mercy of the user. We most definitively should do some validation to the post data and give a proper error message if the data is invalid:

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// BEGIN HIGHLIGHT
  if ( !value1 || isNaN(Number(value1)) ) {
     return res.status(400).send({ error: '...'});
  }
  // more validations here...
// END HIGHLIGHT

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

We shall see later in this part some techniques on how the&nbsp;<em>any</em>&nbsp;typed data (eg. the input an app receives from the user) can be&nbsp;<em>narrowed</em>&nbsp;to a more specific type (such as number). With a proper narrowing of types, there is no more need to silence the ESlint rules.

> <strong>Warning</strong>
>
> Quite often VS code loses track of what is really happening in the code and it shows type or style related warnings despite the code having been fixed. If this happens (to me it has happened quite often), close and open the file that is giving you trouble or just restart the editor. It is also good to doublecheck that everything really works by running the compiler and the ESlint from the command line with commands:
>
> npm run tsc
npm run lint
>
> When run in command line you get the "real result" for sure. So, never trust the editor too much!

### Type assertion

Using a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noreferrer noopener">type assertion</a>&nbsp;is another "dirty trick" that can be done to keep TypeScript compiler and Eslint quiet. Let us export the type Operation in&nbsp;<em>calculator.ts</em>:

```ts
export type Operation = 'multiply' | 'add' | 'divide';
```

Now we can import the type and use the type assertion&nbsp;<em>as</em>&nbsp;to tell the TypeScript compiler what type a variable has:

```js
import { calculator, type Operation } from './calculator'; // HIGHLIGHT LINE
// ...

app.post('/calculate', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  if ( !value1 || isNaN(Number(value1)) ) {
     return res.status(400).send({ error: '...'});
  }

  const operation = op as Operation;  // HIGHLIGHT LINE
  const result = calculator(Number(value1), Number(value2), operation);  // HIGHLIGHT LINE
  return res.send({ result });
});
```

> Note that we imported the type Operation with using the <em>type</em> keyword:
>
> import { calculator, type Operation } from './calculator';
>
> This is required because we're running the code directly with Node.js, which strips TypeScript types at runtime, so any type-only imports must be explicitly marked as such.

The defined constant <em>operation</em> now has the type Operation, and the compiler is perfectly happy, no quieting of the Eslint rule is needed on the following function call. The new variable is actually not needed, the type assertion can be done when an argument is passed to the function:

```js
app.post('/calculate', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // validate the data here

  const result = calculator(Number(value1), Number(value2), op as Operation); // HIGHLIGHT LINE

  return res.send({ result });
});
```

Using a type assertion (or quieting an ESLint rule) is always a bit risky. It leaves the TypeScript compiler off the hook, the compiler just trusts that we, as developers, know what we are doing. If the asserted type <em>does not</em> have the right kind of value, the result will be a runtime error, so one must be pretty careful when validating the data if a type assertion is used.

In the next chapter, we shall have a look at&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">type narrowing</a>&nbsp;which will provide a much more safe way of giving a stricter type for data that is coming from an external source.

<div class="tasks">

**6. Eslint**

</div>

<div class="tasks">

**7. WebExercises**

</div>

<div class="tasks">

**8. Checkup**

</div>
