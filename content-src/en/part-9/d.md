---
part: 9
letter: d
title: "Typing an Express app"
mainImage: /images/part-9.svg
lang: en
---
Now that we have a basic understanding of how TypeScript works and how to create small projects with it, it's time to start creating something useful. We are now going to create a new project that will introduce use cases that are a little more realistic.

One major change from the previous part is that <em>we're not going to use ts-node anymore</em>. It is a handy tool that helps you get started, but in the long run, it is advisable to use the official TypeScript compiler that comes with the <em>typescript</em> npm package. The official compiler generates and packages JavaScript files from the .ts files so that the built <em>production version</em> won't contain any TypeScript code anymore. This is the exact outcome we are aiming for since TypeScript itself is not executable by browsers or Node.

### Setting up the project

We will create a project for Ilari, who loves <a href="https://www.youtube.com/watch?v=4CY_s_FxCa0" data-type="link" data-id="https://www.youtube.com/watch?v=4CY_s_FxCa0">flying small planes</a> but has a difficult time managing his flight history. He is a coder himself, so he doesn't necessarily need a user interface, but he'd like to use some custom software with HTTP requests and retain the possibility of later adding a web-based user interface to the application.

Let's start by creating our first real project:&nbsp;<em>Ilari's flight diaries</em>. As usual, run&nbsp;<em>npm init</em>&nbsp;and install the&nbsp;<em>typescript</em>&nbsp;package as a dev dependency.

```bash
 npm install typescript --save-dev
```

Let us also do the required modifications in <em>package.json</em>:

```json
{
  // ..
  "type": "module", // HIGHLIGHT LINE
  "scripts": {
    "tsc": "tsc"
  },
  // ..
}
```

We can now initialize our tsconfig.json settings by running:

```bash
 npm run tsc -- --init
```

> <strong>Note</strong> the extra <em>--</em> before the actual argument! Arguments before <em>--</em> are interpreted as being for the <em>npm</em> command, while the ones after that are meant for the command that is run through the script (i.e. <em>tsc</em> in this case).

The <em>tsconfig.json</em> file we just created contains a lengthy list of every configuration available to us. However, most of them are commented out. Studying this file can help you find some configuration options you might need. It is also completely okay to keep the commented lines, in case you might need them someday.

At the moment, we want the following to be active:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "strict" : true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Let's go through each configuration:

The <em>target: "esnext"</em> configures that TypeScript should compile to the latest JavaScript features. The compiled code will use cutting-edge JavaScript syntax. Because we use Node version 24, we are actually not compiling the code, so the target does not matter much.

The <em>noEmit: true</em> is already familiar to us, it tells compiler just to do the type checking without generating the compiled code.

<em>module: "nodenext"</em>  tells TypeScript to use Node.js's native module resolution for ESM (ES Modules). In practice, this means that we can use the <em>import</em> syntax on module imports.

<em>esModuleInterop: true</em> enables compatibility between CommonJS and ES module import styles in TypeScript.

Without it, importing a CommonJS module requires <code>import * as express from 'express';</code>

With it, you can use <code>import express from 'express';</code>

<em>allowImportingTsExtensions: true</em> makes it possible to import directly TypeScript files, this is necessary when we run code with Node.js

<em>strict : true </em>is a shorthand for multiple separate options:
- noImplicitAny
- noImplicitThis
- alwaysStrict
- strictBindCallApply
- strictNullChecks
- strictFunctionTypes
- strictPropertyInitialization

They guide our coding style to use the TypeScript features more strictly. For us, perhaps the most important is the already-familiar&nbsp;<a href="https://www.staging-typescript.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>. It prevents implicitly setting type&nbsp;<em>any</em>, which can for example happen if you don't type the parameters of a function. Details about the rest of the configurations can be found in the&nbsp;<a href="https://www.staging-typescript.org/tsconfig#strict" target="_blank" rel="noreferrer noopener">tsconfig documentation</a>. Using&nbsp;<em>strict</em>&nbsp;is suggested by the official documentation.
- <em>noUnusedLocals</em> prevents having unused local variables, and <em>noUnusedParameters</em> throws an error if a function has unused parameters.
- <em>noImplicitReturns</em> checks all code paths in a function to ensure they return a value.
- <em>noFallthroughCasesInSwitch</em> ensures that, in a <em>switch case</em>, each case ends either with a <em>return</em> or a <em>break</em> statement.
- <em>esModuleInterop</em> allows interoperability between CommonJS and ES Modules

See more in the&nbsp;<a href="https://www.staging-typescript.org/tsconfig#esModuleInterop" target="_blank" rel="noreferrer noopener">documentation</a>.

Now that we have set our configuration, we can continue by installing&nbsp;<em>express</em>&nbsp;and, of course, also&nbsp;<em>@types/express</em>. Also, since this is a real project, which is intended to be grown over time, we will use ESlint from the very beginning:

```bash
npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express
```

Now our&nbsp;<em>package.json</em>&nbsp;should look like this:

```json
{
  "name": "flights",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "tsc": "tsc"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@stylistic/eslint-plugin": "^5.10.0",
    "@types/express": "^5.0.6",
    "eslint": "^10.1.0",
    "typescript": "^6.0.2",
    "typescript-eslint": "^8.57.2"
  },
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

We also create a&nbsp;<em>eslint.config.mjs</em>&nbsp;file with the following content:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
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
      { argsIgnorePattern: '^_' },
    ],
  },
});

```

Now we just need to set up our development environment, and we are ready to start writing some serious code.

We will opt for the same option as previously, and run <em>tsc</em> and <em>node --watch</em> concurrently. Let us first install <a href="https://www.npmjs.com/package/concurrently">concurrently</a>:

```bash
npm install --save-dev concurrently
```

We finally define a few more npm scripts, and voilà, we are ready to begin:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
// BEGIN HIGHLIGHT
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
    "start": "node index.ts",
    "lint": "eslint ."
// END HIGHLIGHT
  },
  // ...
}
```

We have also defined the script <code>npm start</code> for running the production version of the app.

As you can see, there is a lot of stuff to go through before beginning the actual coding. When you are working on a real project, careful preparations support your development process. Take the time needed to create a good setup for yourself and your team, so that everything runs smoothly in the long run.

### Let there be code

Now we can finally start coding! As always, we start by creating a ping endpoint, just to make sure everything is working.

The contents of the&nbsp;<em>index.ts</em>&nbsp;file:

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) =&gt; {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () =&gt; {
  console.log(`Server running on port ${PORT}`);
});
```

Now, if we run the app with <code>npm run dev</code> or <code>npm start</code>we can verify that a request to <a href="http://localhost:3000/ping" target="_blank" rel="noreferrer noopener">http://localhost:3000/ping</a> gives the response <em>pong</em>, so our configuration is set!

![صورة توضيحية](/images/mooc/8a21d6787f76.webp)

Now we have a minimal working pipeline for developing our project. With the help of our compiler and ESLint, we ensure that good code quality is maintained. With this base, we can start creating an app that we could, later on, deploy into a production environment.

### A few words on running TypeScript with Node.js

As mentioned, Node's built-in TypeScript support works by <em>stripping types,</em> it simply removes type annotations and runs the remaining JavaScript. This is fast and sufficient for most TypeScript code. However, certain TypeScript features go beyond mere type annotations and require actual code transformation to work correctly at runtime.

The <em>--experimental-transform-types</em> flag enables Node.js to handle these features. Most notably, this includes <a href="https://www.typescriptlang.org/docs/handbook/enums.html">Enums</a>. TypeScript enums compile down to real JavaScript objects. Without transformation, Node would strip the enum syntax and leave behind invalid code.

Without this flag, using an enum in your code would cause a runtime error, even though your TypeScript type-checker reports no issues.

Despite not using any of these features for now, let us add the flag to the scripts:

```json
{<br>  // ... <br>  "scripts": {<br>    "tsc": "tsc",<br>     // BEGIN HIGHLIGHT<br>    "dev": "concurrently \"tsc --watch\" \"node --watch --experimental-transform-types index.ts\"",<br>    "start": "node --experimental-transform-types index.ts",<br>     // END HIGHLIGHT<br>    "lint": "eslint ."<br>  },<br>  // ...<br>}
```

Note that the flag is marked <em>experimental</em>, meaning its behaviour could change in future Node versions. As Node's native TypeScript support matures, features like enum transformation are expected to become part of the default behaviour eventually.

You will get a warning about the experimentality:

```
(node:80296) ExperimentalWarning: Transform Types is an experimental feature and might change at any time<br>(Use `node --trace-warnings ...` to show where the warning was created)
```

The warning could be silenced by adding the flag <code>--disable-warning=ExperimentalWarning</code>.

<div class="tasks">

**9. Patientor backend, step1**

</div>

<div class="tasks">

**10. Patientor backend, step2**

</div>

### Implementing the functionality

Finally, we are ready to start writing some code.

Let's start from the basics. Ilari wants to be able to keep track of his experiences on his flight journeys.

He wants to be able to save&nbsp;<em>diary entries</em>, which contain:
- The date of the entry
- Weather conditions (sunny, windy, cloudy, rainy or stormy)
- Visibility (great, good, ok or poor)
- Free text detailing the experience

We have obtained some sample data, which we will use as a base to build on. The data is saved in JSON format and can be found&nbsp;<a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">here</a>.

The data looks like the following:

```json
[
  {
    "id": 1,
    "date": "2026-01-01",
    "weather": "rainy",
    "visibility": "poor",
    "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  {
    "id": 2,
    "date": "2026-04-01",
    "weather": "sunny",
    "visibility": "good",
    "comment": "Everything went better than expected, I'm learning much"
  },
  // ...
]
```

Let's start by creating an endpoint that returns all flight diary entries.

First, we need to make some decisions on how to structure our source code. It is better to place all source code under&nbsp;<em>src</em>&nbsp;directory, so source code is not mixed with configuration files. We will move&nbsp;<em>index.ts</em>&nbsp;there and make the necessary changes to the npm scripts.

We will place all&nbsp;<a href="https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">routers</a>&nbsp;and modules which are responsible for handling a set of specific resources such as&nbsp;<em>diaries</em>, under the directory&nbsp;<em>src/routes</em>. This is a bit different than what we did in&nbsp;<a href="https://fullstackopen.com/en/part4" target="_blank" rel="noreferrer noopener">part 4</a>, where we used the directory&nbsp;<em>src/controllers</em>.

The router taking care of all diary endpoints is in&nbsp;<em>src/routes/diaries.ts</em>&nbsp;and looks like this:

```js
import express from 'express';

const router = express.Router();

router.get('/', (_req, res) =&gt; {
  res.send('Fetching all diaries!');
});

router.post('/', (_req, res) =&gt; {
  res.send('Saving a diary!');
});

export default router;
```

We'll route all requests to prefix&nbsp;<em>/api/diaries</em>&nbsp;to that specific router in&nbsp;<em>index.ts</em>

```js
import express from 'express';
import diaryRouter from './routes/diaries.ts'; // HIGHLIGHT LINE
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter); // HIGHLIGHT LINE

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

And now, if we make an HTTP GET request to&nbsp;<a href="http://localhost:3000/api/diaries" target="_blank" rel="noreferrer noopener">http://localhost:3000/api/diaries</a>, we should see the message:&nbsp;<em>Fetching all diaries!</em>

Next, we need to start serving the seed data (found&nbsp;<a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">here</a>) from the app. We will fetch the data and save it to&nbsp;<em>data/entries.json</em>.

We won't be writing the code for the actual data manipulations in the router. We will create a&nbsp;<em>service</em>&nbsp;that takes care of the data manipulation instead. It is quite a common practice to separate the "business logic" from the router code into modules, which are quite often called&nbsp;<em>services</em>. The name service originates from&nbsp;<a href="https://en.wikipedia.org/wiki/Domain-driven_design" target="_blank" rel="noreferrer noopener">Domain-driven design</a>&nbsp;and was made popular by the&nbsp;<a href="https://spring.io/" target="_blank" rel="noreferrer noopener">Spring</a>&nbsp;framework.

Let's create a&nbsp;<em>src/services</em>&nbsp;directory and place the&nbsp;<em>diaryService.ts</em>&nbsp;file in it. The file contains two functions for fetching and saving diary entries:

```js
import diaryData from '../../data/entries.json';

const getEntries = () =&gt; {
  return diaryData;
};

const addDiary = () =&gt; {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

But something is not right:

![صورة توضيحية](/images/mooc/35e3e4a798db.webp)

Fortunately, there is an easy fix, just change the import as follows:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
```

This is needed since if you are importing something other than code, Node.js needs to know what kind of file you're importing. Without the hint, it sees a<em> .json</em> file and doesn't know whether to treat it as code or data, so it throws an error.

Let us now ensure the end-to-end functionality, and wire the router and the service together:

```js
import express from 'express';<br>import diaryService from '../services/diaryService.ts'; // HIGHLIGHT LINE<br><br>const router = express.Router();<br><br>router.get('/', (_req, res) => {<br>  // BEGIN HIGHLIGHT<br>  const data = diaryService.getEntries()<br>  res.send(data);<br>  // END HIGHLIGHT<br>});<br><br>router.post('/', (_req, res) => {<br>  res.send("add a new diary");<br>});<br><br>export default router;
```

And indeed, we see the diaries in the endpoint:

![صورة توضيحية](/images/mooc/ca4ce04c0f96.webp)

### Defining the types

Earlier, we saw how the compiler can determine a variable's type from the value it is assigned. Similarly, the compiler can interpret large data sets consisting of objects and arrays:

![صورة توضيحية](/images/mooc/0f5ba8636b7a.webp)

As a result, the compiler warns us if we try to do something suspicious with the JSON data we handle. For example, if we are handling an array containing objects of a specific type, and we try to add an object that does not have all the fields the other objects have, or has type conflicts (for example, a number where there should be a string), the compiler can give us a warning.

Even though the compiler is pretty good at making sure we don't do anything unwanted, it is safer to define the types for the data ourselves.

Currently, we have a basic working TypeScript Express app, but there are barely any actual&nbsp;<em>typings</em>&nbsp;in the code. Since we know what type of data should be accepted for the&nbsp;<em>weather</em>&nbsp;and&nbsp;<em>visibility</em>&nbsp;fields, there is no reason for us not to include their types in the code.

Let's create a file for our types,&nbsp;<em>types.ts</em>, where we'll define all our types for this project.

First, let's type the&nbsp;<em>Weather</em>&nbsp;and&nbsp;<em>Visibility</em>&nbsp;values using a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" target="_blank" rel="noreferrer noopener">union type</a>&nbsp;of the allowed strings:

```ts
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

And, from there, we can continue by creating a DiaryEntry type, which will be an&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">interface</a>:

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

We can now try to type our imported JSON:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
import type { DiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

const diaries: DiaryEntry[] = diaryData; // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const getEntries = (): DiaryEntry[]  => {
  return diaries;
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

But since the JSON already has its values declared, assigning a type for the data set results in an error:

![صورة توضيحية](/images/mooc/91423407b18a.webp)

The end of the error message reveals the problem: the&nbsp;<em>weather</em>&nbsp;fields are incompatible. In&nbsp;<em>DiaryEntry</em>, we specified that its type is&nbsp;<em>Weather</em>, but the TypeScript compiler had inferred its type to be&nbsp;<em>string</em>.

We could fix the problem by doing a <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noreferrer noopener">type assertion</a>. As we already <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3#bc2e1861-1334-4a2c-a678-03f486621ce7" target="_blank" rel="noreferrer noopener">mentioned</a> type assertions should be done only if we are certain we know what we are doing!

If we assert the type of the variable&nbsp;<em>diaryData</em>&nbsp;to be&nbsp;<em>DiaryEntry</em>&nbsp;with the keyword&nbsp;<em>as</em>, everything should work:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
import type { DiaryEntry } from '../types.ts';

const diaries: DiaryEntry[] = diaryData as DiaryEntry[]; // HIGHLIGHT LINE

const getEntries = (): DiaryEntry[]  => {
  return diaries;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

We should never use type assertion unless there is no other way to proceed, as there is always the danger we assert an unfit type to an object and cause a nasty runtime error. While the compiler trusts you to know what you are doing when using&nbsp;<em>as</em>, by doing this, we are not using the full power of TypeScript but relying on the coder to secure the code.

In our case, we could change how we export our data so we can type it within the data file. Since we cannot use typings in a JSON file, we should convert the JSON file to a ts file <em>entries.ts</em>, which exports the typed data like so:

```js
import type { DiaryEntry } from "../src/types.ts";
const diaryEntries: DiaryEntry[] = [
  {
      "id": 1,
      "date": "2026-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries;
```

Now, when we import the array, the compiler interprets it correctly:

```js
import diaries from '../../data/entries.ts'; // HIGHLIGHT LINE
import type { DiaryEntry } from '../types.ts';

const getEntries = (): DiaryEntry[] => {
  return diaries;
}

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  addDiary
};
```

Note that, if we want to be able to save entries without a certain field, e.g.&nbsp;<em>comment</em>, we could set the type of the field as&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties" target="_blank" rel="noreferrer noopener">optional</a>&nbsp;by adding&nbsp;<em>?</em>&nbsp;to the type declaration:

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

> <strong>import type</strong>
>
> When importing a type it is not enough to just do
>
> import { DiaryEntry } from '../types.ts';
>
> We must instead do a <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export">type only import</a>
>
> import type { DiaryEntry } from '../types.ts';
>
> When running TypeScript files directly with Node.js, TypeScript's type information is stripped at runtime. This means that if you import something that only exists as a type, like an interface or type alias, and you don't mark it explicitly with <em>import type,</em> the runtime may attempt to resolve it as a real JavaScript value and fail.
>
> Using <em>import type</em> tells both the TypeScript compiler and the runtime transform that this import exists purely for type-checking purposes and should be completely erased before execution.
>
> Fortunately, there is an ESLint rule <a href="https://typescript-eslint.io/rules/consistent-type-imports/">consistent-type-imports</a> that helps us not to forget using import type. Let us enable the rule in _.esling.config.mjs_:
>
> rules: {<br>    // ...<br>    "@typescript-eslint/consistent-type-imports": "error",<br>  },
>
> Now we are warned on omissions!

### Utility Types

Sometimes, we might want to use a specific modification of a type. For example, consider a page for listing some data, some of which is sensitive and some of which is non-sensitive. We might want to be sure that no sensitive data is used or displayed. We could&nbsp;<em>pick</em>&nbsp;the fields of a type we allow to be used to enforce this. We can do that by using the utility type&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a>.

In our project, we should consider that Ilari might want to create a listing of all his diary entries&nbsp;<em>excluding</em>&nbsp;the comment field since, during a very scary flight, he might end up writing something he wouldn't necessarily want to show to anyone else.

The&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a>&nbsp;utility type allows us to choose which fields of an existing type we want to use. Pick can be used to either construct a completely new type or to inform a function of what it should return on runtime. Utility types are a special kind of type, but they can be used just like regular types.

In our case, to create a "censored" version of the&nbsp;<em>DiaryEntry</em>&nbsp;for public displays, we can use&nbsp;<em>Pick</em>&nbsp;in the function declaration:

```js
const getNonSensitiveEntries =
  (): Pick&lt;DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'&gt;[] =&gt; {
    // ...
  }
```

and the compiler would expect the function to return an array of values of the modified&nbsp;<em>DiaryEntry</em>&nbsp;type, which includes only the four selected fields.

In this case, we want to exclude only one field, so it would be even better to use the&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a>&nbsp;utility type, which we can use to declare which fields to exclude:

```js
const getNonSensitiveEntries = (): Omit&lt;DiaryEntry, 'comment'&gt;[] =&gt; {
  // ...
}
```

To improve the readability, we should most definitively define a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">type alias</a>&nbsp;<em>NonSensitiveDiaryEntry</em>&nbsp;in the file&nbsp;<em>types.ts</em>:

```ts
export type NonSensitiveDiaryEntry = Omit&lt;DiaryEntry, 'comment'&gt;;
```

The code changes like this:

```js
import diaries from '../../data/entries.ts';
import type { NonSensitiveDiaryEntry, DiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

// BEGIN HIGHLIGHT
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries;
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary,
  getNonSensitiveEntries // HIGHLIGHT LINE
};
```

One thing in our application is a cause for concern. In&nbsp;<em>getNonSensitiveEntries</em>, we are returning the complete diary entries, and&nbsp;<em>no error is given</em>&nbsp;despite typing!

This happens because&nbsp;<a href="http://www.typescriptlang.org/docs/handbook/type-compatibility.html" target="_blank" rel="noreferrer noopener">TypeScript only checks</a>&nbsp;whether we have all of the required fields or not, but excess fields are not prohibited. In our case, this means that it is&nbsp;<em>not prohibited</em>&nbsp;to return an object of type&nbsp;<em>DiaryEntry[]</em>, but if we were to try to access the&nbsp;<em>comment</em>&nbsp;field, it would not be possible because we would be accessing a field that TypeScript is unaware of even though it exists.

Unfortunately, this can lead to unwanted behavior if you are not aware of what you are doing; the situation is valid as far as TypeScript is concerned, but you are most likely allowing a use that is not wanted. If we were now to return all of the diary entries from the&nbsp;<em>getNonSensitiveEntries</em>&nbsp;function to the frontend, we would be&nbsp;<em>leaking the unwanted fields to the requesting browser</em>&nbsp;- even though our types seem to imply otherwise!

Because TypeScript doesn't modify the actual data but only its type, we need to exclude the fields ourselves:

```js
import diaries from '../../data/entries.ts'

import type { NonSensitiveDiaryEntry, DiaryEntry } from '../types.ts'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// BEGIN HIGHLIGHT
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

Utility types include many handy tools, and it is undoubtedly worth it to take some time to study&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html" target="_blank" rel="noreferrer noopener">the documentation</a>.

Let us now change the route to return only the nonsensitive diary data:

```js
import express from 'express';
import diaryService from '../services/diaryService.ts';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries()); // HIGHLIGHT LINE
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;
```

The response is what we expect it to be:

![صورة توضيحية](/images/mooc/2f2af9471d6d.webp)

### Typing the request and response

So far we have not discussed anything about the types of the route handler parameters.

If we hover, for example, over the parameter <em>res</em>, we notice it has the following type:

```
Response&lt;any, Record&lt;string, any&gt;, number&gt;
```

It looks a bit weird. The type&nbsp;<em>Response</em>&nbsp;is a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">generic type</a>&nbsp;that has three&nbsp;<em>type parameters</em>. If we open the type definition (by right clicking and selecting&nbsp;<em>Go to Type Definition</em>&nbsp;in the VS code) we see the following:

```js
export interface Response&lt;
    ResBody = any,
    LocalsObj extends Record&lt;string, any&gt; = Record&lt;string, any&gt;,
    StatusCode extends number = number,
&gt; extends http.ServerResponse, Express.Response {
```

The first type parameter is the most interesting for us, it corresponds&nbsp;<em>the response body</em>&nbsp;and has a default value&nbsp;<em>any</em>. So that is why TypeScript compiler accepts any type of response and we get no help to get the response right.

We could and probably should give a proper type as the type variable. In our case, it is an array of diary entries:

```js
import express, { type Response } from 'express'; // HIGHLIGHT LINE
import type { NonSensitiveDiaryEntry } from "../types.ts";
// ...

router.get('/', (_req, res: Response&lt;NonSensitiveDiaryEntry[]>) => { // HIGHLIGHT LINE
  res.send(diaryService.getNonSensitiveEntries());
});

// ...
```

If we now try to respond with the wrong type of data, we get a type error

![صورة توضيحية](/images/mooc/6a230c446155.webp)

Similarly the request parameter has the type&nbsp;<em>Request</em>&nbsp;that is also a generic type. We shall have a closer look at it later on.

<div class="tasks">

**11. Patientor backend, step3**

</div>

<div class="tasks">

**12. Patientor backend, step4**

</div>

### Preventing an accidental undefined result

Let's extend the backend to support fetching one specific entry with an HTTP GET request to route&nbsp;<em>api/diaries/:id</em>.

The DiaryService needs to be extended with a&nbsp;<em>findById</em>&nbsp;function:

```ts
// ...

const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById // HIGHLIGHT LINE
}
```

But once again, a new problem emerges:

![صورة توضيحية](/images/mooc/99a625c21be0.webp)

The issue is that there is no guarantee that an entry with the specified id can be found. It is good that we are made aware of this potential problem already at the compile phase. Without TypeScript, we would not be warned about this problem, and in the worst-case scenario, we could have ended up returning an <em>undefined</em> object instead of informing the user about the specified entry not being found.

First of all, in cases like this, we need to decide what the&nbsp;<em>return value</em>&nbsp;should be if an object is not found, and how the case should be handled. The&nbsp;<em>find</em>&nbsp;method of an array returns&nbsp;<em>undefined</em>&nbsp;if the object is not found, and this is fine. We can solve our problem by typing the return value as follows:

```ts
const findById = (id: number): DiaryEntry | undefined => {  // HIGHLIGHT LINE
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

The route handler is the following:

```js
import express from 'express';
import diaryService from '../services/diaryService.ts'

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

// ...

export default router;
```

### Adding a new diary

Let's start building the HTTP POST endpoint for adding new flight diary entries. The new entries should have the same type as the existing data.

The code handling of the response looks as follows:

```js
router.post('/', (req, res) => {<br>  const { date, weather, visibility, comment } = req.body;<br>  const addedEntry = diaryService.addDiary({    <br>    date,<br>    weather,<br>    visibility,<br>    comment,<br>  });  <br>  res.json(addedEntry);<br>})
```

So the code just destructures the parameters from the request body, and puts those into an object that is given as a parameter to the function <em>addDiary</em> of the <em>diaryService</em>.

But wait, what is the type of this object? It is not exactly a&nbsp;<em>DiaryEntry</em>, since it is still missing the&nbsp;<em>id</em>&nbsp;field. It could be useful to create a new type,&nbsp;<em>NewDiaryEntry</em>, for an entry that hasn't been saved yet. Let's create that in&nbsp;<em>types.ts</em>&nbsp;using the existing&nbsp;<em>DiaryEntry</em>&nbsp;type and the&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a>&nbsp;utility type:

```ts
export type NewDiaryEntry = Omit&lt;DiaryEntry, 'id'&gt;;
```

Now we can use the new type in our <em>diaryService</em>, and destructure the new entry object when creating an entry to be saved:

```js
import type { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types';

// ...

const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

There is lots of red in our editor:

![صورة توضيحية](/images/mooc/ce8d357c45df.webp)

The cause is the ESlint rule&nbsp;<a href="https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md" target="_blank" rel="noreferrer noopener">@typescript-eslint/no-unsafe-assignment</a>&nbsp;that prevents us from assigning the fields of a request body to variables.

For the time being, let us just ignore the ESlint rule from the whole file by adding the following as the first line of the file:

```
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

To parse the incoming data we must have the&nbsp;<em>json</em>&nbsp;middleware configured:

```js
import express from 'express';
import diaryRouter from './routes/diaries.ts';
const app = express();
app.use(express.json());
const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Now the application is ready to receive HTTP POST requests for new diary entries of the correct type!

### Validating requests

There are plenty of things that can go wrong when we accept data from outside sources. Applications rarely work completely on their own, and we are forced to live with the fact that data from sources outside of our system cannot be fully trusted. When we receive data from an outside source, there is no way it can already be typed when we receive it. We need to make decisions on how to handle the uncertainty that comes with this.

The disabled ESlint rule was hinting to us that the following assignment is risky:

```js
const newDiaryEntry = diaryService.addDiary({
  date,
  weather,
  visibility,
  comment,
});
```

We would like to have the assurance that the object in a POST request has the correct type. Let us now define a function <em>parseNewDiaryEntry</em> that receives the request body as a parameter and returns a properly-typed <em>NewDiaryEntry</em> object. The function shall be defined in the file <em>utils.ts</em>.

The route definition uses the function as follows:

```js
import parseNewDiaryEntry from '../utils.ts';
// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body); // HIGHLIGHT LINE
    const addedEntry = diaryService.addDiary(newDiaryEntry);   // HIGHLIGHT LINE
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})
```

We can now also remove the first line that ignores the ESLint rule <em>no-unsafe-assignment</em>.

Since we are now writing secure code and trying to ensure that we are getting exactly the data we want from the requests, we should get started with parsing and validating each field we are expecting to receive.

The skeleton of the function <em>parseNewDiaryEntry</em> looks like the following:

```js
import type { NewDiaryEntry } from './types.ts';

const parseNewDiaryEntry = (object): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  };

  return newEntry;
};

export default parseNewDiaryEntry;
```

The function should parse each field and make sure that the return value is exactly of type&nbsp;<em>NewDiaryEntry</em>. This means we should check each field separately.

Once again, we have a type issue: what is the type of the parameter&nbsp;<em>object</em>? Since the&nbsp;<em>object</em>&nbsp;is the body of a request, Express has typed it as&nbsp;<em>any</em>. Since the idea of this function is to map fields of unknown type to fields of the correct type and check whether they are defined as expected, this might be the rare case in which we&nbsp;<em>want to allow the&nbsp;<strong>any</strong>&nbsp;type</em>.

However, if we type the object as <em>any</em>, ESLint complains about that:

![صورة توضيحية](/images/mooc/1f1eac7a30f8.webp)

We could ignore the ESlint rule but a better idea is to follow one of the advices the editor gives in the&nbsp;<em>Quick Fix</em>&nbsp;and set the parameter type to&nbsp;<em>unknown</em>:

```js
import type { NewDiaryEntry } from './types.ts';

const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default parseNewDiaryEntry;
```

<a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown" target="_blank" rel="noreferrer noopener">unknown</a>&nbsp;is the ideal type for our kind of situation of input validation, since we don't yet need to define the type to match&nbsp;<em>any</em>&nbsp;type, but can first verify the type and then confirm that is the expected type. With the use of&nbsp;<em>unknown</em>, we also don't need to worry about the&nbsp;<em>@typescript-eslint/no-explicit-any</em>&nbsp;ESlint rule, since we are not using&nbsp;<em>any</em>. However, we might still need to use&nbsp;<em>any</em>&nbsp;in some cases in which we are not yet sure about the type and need to access the properties of an object of type&nbsp;<em>any</em>&nbsp;to validate or type-check the property values themselves.

> A sidenote from the editor
>
> <em>If you are like me and hate having a code in broken state for a long time due to incomplete typing, you could start by "faking" the function:</em>
>
> const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
>
>  console.log(object); // now object is no longer unused
 const newEntry: NewDiaryEntry = {
   weather: 'cloudy', // fake the return value
   visibility: 'great',
   date: '2026-1-1',
   comment: 'fake news'
 };
>
>  return newEntry;
};
>
> <em>So before the real data and types are ready to use, I am just returning here something that has for sure the right type. The code stays in an operational state all the time and my blood pressure remains at normal levels.</em>

### Type guards

Let us start creating the parsers for each of the fields of the parameter&nbsp;<em>object: unknown</em>.

To validate the&nbsp;<em>comment</em>&nbsp;field, we need to check that it exists and to ensure that it is of the type&nbsp;<em>string</em>.

The function should look something like this:

```ts
const parseComment = (comment: unknown): string =&gt; {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

The function gets a parameter of type&nbsp;<em>unknown</em>&nbsp;and returns it as the type&nbsp;<em>string</em>&nbsp;if it exists and is of the right type.

The string validation function looks like this:

```js
const isString = (text: unknown): text is string =&gt; {
  return typeof text === 'string' || text instanceof String;
};
```

The function is a so-called&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" target="_blank" rel="noreferrer noopener">type guard</a>. That means it is a function that returns a boolean&nbsp;<em>and</em>&nbsp;has a&nbsp;<em>type predicate</em>&nbsp;as the return type. In our case, the type predicate is:

```
text is string
```

The general form of a type predicate is&nbsp;<em>parameterName is Type</em>&nbsp;where the&nbsp;<em>parameterName</em>&nbsp;is the name of the function parameter and&nbsp;<em>Type</em>&nbsp;is the targeted type.

If the type guard function returns true, the TypeScript compiler knows that the tested variable has the type that was defined in the type predicate.

Before the type guard is called, the actual type of the variable <em>comment</em> is not known:

![صورة توضيحية](/images/mooc/83b148edd27a.webp)

But after the call, if the code proceeds past the exception (that is, the type guard returned true), then the compiler knows that the <em>comment</em> is of type <em>string</em>

![صورة توضيحية](/images/mooc/2cd1b17a0381.webp)

The use of a type guard that returns a type predicate is one way to do&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">type narrowing</a>, that is, to give a variable a more strict or accurate type. As we will soon see there are also other kinds of&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">type guards</a>&nbsp;available.

> Side note: testing if something is a string
>
> <em>Why do we have two conditions in the string type guard?</em>
>
> const isString = (text: unknown): text is string =&gt; {
 return typeof text === 'string' || text instanceof String;}
>
> <em>Would it not be enough to write the guard like this?</em>
>
> const isString = (text: unknown): text is string =&gt; {
 return typeof text === 'string';
}
>
> <em>Most likely, the simpler form is good enough for all practical purposes. However, if we want to be sure, both conditions are needed. There are two different ways to create string in JavaScript, one as a primitive and the other as an object, which both work a bit differently when compared to the&nbsp;<strong>typeof</strong>&nbsp;and&nbsp;<strong>instanceof</strong>&nbsp;operators:</em>
>
> const a = "I'm a string primitive";
const b = new String("I'm a String Object");
typeof a; --&gt; returns 'string'
typeof b; --&gt; returns 'object'
a instanceof String; --&gt; returns false
b instanceof String; --&gt; returns true
>
> <em>However, it is unlikely that anyone would create a string with a constructor function. Most likely the simpler version of the type guard would be just fine.</em>

Next, let's consider the&nbsp;<em>date</em>&nbsp;field. Parsing and validating the date object is pretty similar to what we did with comments. Since TypeScript doesn't know a type for a date, we need to treat it as a&nbsp;<em>string</em>. We should however still use JavaScript-level validation to check whether the date format is acceptable.

We will add the following functions:

```ts
const isDate = (date: string): boolean =&gt; {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string =&gt; {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

The code is nothing special. The only thing is that we can't use a type predicate based type guard here since a date in this case is only considered to be a&nbsp;<em>string</em>. Note that even though the&nbsp;<em>parseDate</em>&nbsp;function accepts the&nbsp;<em>date</em>&nbsp;variable as&nbsp;<em>unknown</em>, after we check its type with&nbsp;<em>isString</em>, TypeScript compiler knows its type is&nbsp;<em>string</em>, which is why we can give the variable to the&nbsp;<em>isDate</em>&nbsp;function requiring a string without any problems.

Finally, we are ready to move on to the last two types,&nbsp;<em>Weather</em>&nbsp;and&nbsp;<em>Visibility</em>.

We would like the validation and parsing to work as follows:

```js
const parseWeather = (weather: unknown): Weather =&gt; {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

The question is: how can we validate that the string is of a specific form? One possible way to write the type guard would be this:

```ts
const isWeather = (str: string): str is Weather =&gt; {
  return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
};
```

This would work just fine, but the problem is that the list of possible values for Weather does not necessarily stay in sync with the type definitions if the type is altered. This is most certainly not good, since we would like to have just one source for all possible weather types.

### as const object

In our case, a better solution would be to improve the actual Weather type. Instead of a type alias, we can use a <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions">const object</a>, which allows us to use the actual values in our code at runtime, not only in the compilation phase.

Let us redefine the type Weather as follows:

```ts
export const Weather = {
  Sunny: 'sunny',
  Rainy: 'rainy',
  Cloudy: 'cloudy',
  Stormy: 'stormy',
  Windy: 'windy',
} as const;

export type Weather = typeof Weather[keyof typeof Weather];
```

Note that we define both a const object and a type with the same name. TypeScript allows this because they live in separate namespaces. The type is derived directly from the object's values, so the two always stay in sync automatically.

Now we can check that a string is one of the accepted values, and the type guard can be written like this:

```ts
const isWeather = (param: string): param is Weather =&gt; {
  return (Object.values(Weather) as string[]).includes(param);
};
```

The parser has nothing surprising:

```js
const parseWeather = (weather: unknown): Weather => {<br>  if (!weather || !isString(weather) || !isWeather(weather)) {<br>    throw new Error('Incorrect or missing weather: ' + weather);<br>  }<br>  return weather;<br>};
```

We still need to give the same treatment to Visibility. The <em>const object </em>looks as follows:

```ts
export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor',
} as const;

export type Visibility = typeof Visibility[keyof typeof Visibility];
```

The type guard and the parser are below:

```ts
const isVisibility = (param: string): param is Visibility =&gt; {
  return (Object.values(Visibility) as string[]).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility =&gt; {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
    throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

---

<em>as const</em> objects are typically used when there is a set of predetermined values that are not expected to change in the future. They offer a great way to validate our incoming values while remaining plain JavaScript objects, which makes them more flexible in some situations than <a href="https://www.typescriptlang.org/docs/handbook/enums.html">enums</a>, which were earlier a popular choice to define a similar purpose.

> <strong>What are actually the type Visibility and the Visibility</strong>
>
> When we defined
>
> export const Visibility = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof Visibility[keyof typeof Visibility];<br>
>
> we defined two distinct thing, the <em>const object Visibility</em> and <em>type Visibility</em>, interestingly TypeScript allows both to coexist despite they have the same name.
>
> If we hover the type Visiblitity, we see what it actually is:
>
>
>
> So the it just resolves to the union of four literal string values. It can be used e.g. as follows:
>
> const x: Visibility = "great";<br>const y: Visibility = Visibility.Ok;
>
> In the latter example, we are using the const object Visibility and assigning its value Ok (that is, the string <em>ok</em>) to y.
>
> We could also use different names for the const object and the type:
>
> export const VisibilityValues = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof VisibilityValues[keyof typeof VisibilityValues];
>
> The the guard would be
>
> import { VisibilityValues, type Visibility, ... } from './types.ts';<br><br>const isVisibility = (param: string): param is Visibility => {<br>  return (Object.values(VisibilityValues) as string[]).includes(param);<br>};
>
> In this case, we would also need to separately import both now. As we now understand what is going on, we will stick to using the same name for both since it makes the code a bit less verbose.
>
> There is however one question still remaining. What in earth is
>
> typeof Visibility[keyof typeof Visibility]
>
> Let us break it down step by step. The <em>typeof Visibility </em>gives you the type of the object itself:
>
> {
  readonly Great: 'great',
  readonly Good: 'good',
  readonly Ok: 'ok',
  readonly Poor: 'poor',
}
>
> The <em>keyof</em> extracts all keys of that type as a union:
>
> 'Great' | 'Good' | 'Ok' | 'Poor'
>
> The last layer, index into <em>typeof Visibility</em> using those keys, this looks up the <em>value types</em> for each key from the object <em>Visibility</em>, producing a union of all value types (that in our case are just string literals):
>
> 'great' | 'good' | 'ok' | 'poor'

Finally, we can finalize the parseNewDiaryEntry function that takes care of validating and parsing the fields of the POST body. There is, however, one more thing to take care of. If we try to access the fields of the parameter <em>object</em> as follows:

```js
const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

The code does not pass the typecheck:

![صورة توضيحية](/images/mooc/0ccf77e2393b.webp)

This is because the <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noreferrer noopener">unknown</a> type does not allow any operations, so accessing the fields is not possible:

We can again fix the problem by type narrowing. We now have two type guards, the first checks that the parameter object exists and that it has the type <em>object</em>. After this, the second type guard uses the <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a> operator to ensure that the object has all the desired fields:

```js
const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

If the guard does not evaluate to true, an exception is thrown.

The use of the operator <em>in</em> actually guarantees that the fields indeed exist in the object. Because of that, the existence checks in the parsers are no longer needed:

```js
const parseVisibility = (visibility: unknown): Visibility => {
  // check !visibility removed
  if (!isString(visibility) || !isVisibility(visibility)) { // HIGHLIGHT LINE
      throw new Error('Incorrect visibility: ' + visibility);
  }
  return visibility;
};
```

If a field, e.g.&nbsp;<em>comment</em>&nbsp;would be optional, the type narrowing should take that into account, and the operator&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a>&nbsp;could not be used quite as we did here, since the&nbsp;<em>in</em>&nbsp;test requires the field to be present.

If we now try to create a new diary entry with invalid or missing fields, we are getting an appropriate error message:

![صورة توضيحية](/images/mooc/1de244de9cca.webp)

The source code of the application can be found on <a href="https://github.com/fullstack-hy2020/flightdiary/tree/part1" target="_blank" rel="noreferrer noopener">GitHub</a>.

<div class="tasks">

**13. Patientor backend, step5**

</div>

<div class="tasks">

**14. Patientor backend, step6**

</div>

#### Using schema validation libraries

Writing a validator to the request body can be a huge burden. Thankfully there exists several&nbsp;<em>schema validator libraries</em>&nbsp;that can help. Let us now have a look at&nbsp;<a href="https://zod.dev/" target="_blank" rel="noreferrer noopener">Zod</a>&nbsp;that works pretty well with TypeScript.

Let us get started:

```bash
npm install zod
```

Parsers of the primitive valued fields such as

```ts
const isString = (text: unknown): text is string =&gt; {
  return typeof text === 'string' || text instanceof String;
};

const parseComment = (comment: unknown): string =&gt; {
  if (!isString(comment)) {
    throw new Error('Incorrect comment');
  }

  return comment;
};
```

are easy to replace as follows:

```ts
import { z } from 'zod';

// ...

const parseComment = (comment: unknown): string => {
  return z.string().parse(comment);
};
```

First the&nbsp;<a href="https://zod.dev/?id=strings" target="_blank" rel="noreferrer noopener">string</a>&nbsp;method of Zod is used to define the required type (or&nbsp;<em>schema</em>&nbsp;in Zod terms). After that the value (which is of the type&nbsp;<em>unknown</em>) is parsed with the method&nbsp;<a href="https://zod.dev/?id=parse" target="_blank" rel="noreferrer noopener">parse</a>, which returns the value in the required type or throws an exception.

We do not actually need the helper function&nbsp;<em>parseComment</em>&nbsp;anymore and can use the Zod parser directly:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: z.string().parse(object.comment)     // HIGHLIGHT LINE
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

Zod has a bunch of string specific validations, eg. one that validates if a string is a valid&nbsp;<a href="https://zod.dev/?id=dates" target="_blank" rel="noreferrer noopener">date</a>, so we get also rid of the date field parser:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: z.iso.date().parse(object.date),      // HIGHLIGHT LINE
      comment: z.string().optional().parse(object.comment)    // HIGHLIGHT LINE
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

We have also decided to make the field comment <a href="https://zod.dev/?id=optional" target="_blank" rel="noreferrer noopener">optional</a>.

The Zod validator for <a href="https://zod.dev/api?id=enums" target="_blank" rel="noreferrer noopener">enums</a> suits to a case where possible inputs are a fixed set of strings, and that is the case with weather and the visibility.

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
// BEGIN HIGHLIGHT
      weather: z.enum(Weather).parse(object.weather),
      visibility: z.enum(Visibility).parse(object.visibility),
// END HIGHLIGHT
      date: z.iso.date().parse(object.date),
      comment: z.string().parse(object.comment)
    };

  throw new Error('Incorrect data: some fields are missing');
};
```

We have so far just used Zod to parse the type or schema of individual fields, but we can go one step further and define the whole&nbsp;<em>new diary entry</em>&nbsp;as a Zod&nbsp;<a href="https://zod.dev/?id=objects" target="_blank" rel="noreferrer noopener">object</a>&nbsp;schema:

```js
const NewEntrySchema = z.object({
  weather: z.enum(Weather),
  visibility: z.enum(Visibility),
  date: z.iso.date(),
  comment: z.string().optional()
});
```

Now it is just enough to call&nbsp;<em>parse</em>&nbsp;of the defined schema:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};
```

With the help from&nbsp;<a href="https://zod.dev/basics?id=handling-errors" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;we could also improve the error handling:

```js
import { z } from 'zod';

//

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
   // BEGIN HIGHLIGHT
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
   // END HIGHLIGHT
  }
});
```

The response in case of error looks pretty good:

![صورة توضيحية](/images/mooc/2039abaa78c4.webp)

We could develop our solution still some steps further. Our type definitions currently look like this:

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export type NewDiaryEntry = Omit&lt;DiaryEntry, 'id'&gt;;
```

So besides the type&nbsp;<em>NewDiaryEntry</em>&nbsp;we have also the Zod schema&nbsp;<em>NewEntrySchema</em>&nbsp;that defines the shape of a new entry. We can use the schema to&nbsp;<a href="https://zod.dev/?id=type-inference" target="_blank" rel="noreferrer noopener">infer</a>&nbsp;the type:

```ts
import { z } from 'zod';
import { NewEntrySchema } from './utils.ts'

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

// infer the type from schema
export type NewDiaryEntry = z.infer&lt;typeof NewEntrySchema>;
```

We could take this even a bit further and define the&nbsp;<em>DiaryEntry</em>&nbsp;based on&nbsp;<em>NewDiaryEntry</em>:

```ts
export type NewDiaryEntry = z.infer&lt;typeof NewEntrySchema>;

export interface DiaryEntry extends NewDiaryEntry {
  id: number;
}
```

This removes all the duplication in the type and schema definitions. It feels a bit backward, but unfortunately, the opposite is not possible: we can not define the Zod schema based on TypeScript type definitions, so now the Zod schema is the single source of our type. Since the schema is also the basis of the type, we'll move the schema definition to the file <em>types.ts</em>.

The current state of the source code can be found in the part2 branch of <a href="https://github.com/fullstack-hy2020/flightdiary/tree/part2" target="_blank" rel="noreferrer noopener">this</a> GitHub repository.

### Parsing request body in middleware

We can now get rid of this method altogether

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};
```

and just call the Zod-parser directly in the route handler:

```js
import { NewEntrySchema, type NonSensitiveDiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

router.post('/', (req, res) => {  try {
    const newDiaryEntry = NewEntrySchema.parse(req.body); // HIGHLIGHT LINE
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});
```

We could go even one step further. Instead of explicitly calling the request body parsing method in the route handler, the input validation could also be performed in a middleware function.

We have also added the type definitions to the route handler parameters, and shall also use types in the middleware function&nbsp;<em>newDiaryParser</em>:

```js
import express, { type Request, type Response, type NextFunction } from 'express';

// ...

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
```

The middleware just calls the schema parser on the request body. If the parsing throws an exception, it is passed to the error handling middleware.

So after the request passes this middleware, it&nbsp;<em>is known that the request body is a proper new diary entry</em>. We can tell this fact to TypeScript compiler by giving a type parameter to the&nbsp;<em>Request</em>&nbsp;type:

```js
router.post('/', newDiaryParser, (req: Request&lt;unknown, unknown, NewDiaryEntry>, res: Response&lt;DiaryEntry>) => {
  const addedEntry = diaryService.addDiary(req.body);
  res.json(addedEntry);
});
```

Thanks to the middleware, the request body is now known to be of right type and it can be directly given as parameter to the function&nbsp;<em>diaryService.addDiary</em>.

The syntax of the&nbsp;<em>Request&lt;unknown, unknown, NewDiaryEntry&gt;</em>&nbsp;looks a bit odd. The&nbsp;<em>Request</em>&nbsp;is a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">generic type</a>&nbsp;with several type parameters. The third type parameter represents the request body, and in order to give it the value&nbsp;<em>NewDiaryEntry</em>&nbsp;we have to give&nbsp;<em>some</em>&nbsp;value to the two first parameters. We decide to define those&nbsp;<em>unknown</em>&nbsp;since we do not need those for now.

Since the possible errors in validation are now handled in the error handling middleware, we need to define one that handles the Zod errors properly:

```js
const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newDiaryParser, (req: Request&lt;unknown, unknown, NewDiaryEntry>, res: Response&lt;DiaryEntry>) => {
  // ...
});

router.use(errorMiddleware); // HIGHLIGHT LINE
```

The final version of the source code can be found in the part3 branch of <a href="https://github.com/fullstack-hy2020/flightdiary/tree/part3" target="_blank" rel="noreferrer noopener">this</a> GitHub repository.

<div class="tasks">

**15. Patientor backend, step7**

</div>

<div class="tasks">

**16. Checkup**

</div>
