---
part: 9
letter: e
title: "React with types"
mainImage: /images/part-9.svg
lang: en
---
Before we start delving into how you can use TypeScript with React, we should first have a look at what we want to achieve. When everything works as it should, TypeScript will help us catch the following errors:
- Trying to pass an extra/unwanted prop to a component
- Forgetting to pass a required prop to a component
- Passing a prop with the wrong type to a component

If we make any of these errors, TypeScript can help us catch them in our editor right away. If we do not use TypeScript, we have to catch these errors later during testing. We might be forced to do some tedious debugging to find the cause of the errors.

That's enough reasoning for now. Let's start getting our hands dirty!

### Vite with TypeScript

We can use&nbsp;<a href="https://vitejs.dev/" target="_blank" rel="noreferrer noopener">Vite</a>&nbsp;to create a TypeScript app specifying a template&nbsp;<em>react-ts</em>&nbsp;in the initialization script. So to create a TypeScript app, run the following command:

```bash
npm create vite@latest my-app-name -- --template react-ts
```

After running the command, you should have a complete basic React app that uses TypeScript. You can start the app by running <code>npm run dev</code> in the application's root.

If you take a look at the files and folders, you'll notice that the app is not that different from one using pure JavaScript. The only differences are that the <em>.jsx</em> files are now <em>.tsx</em> files, they contain some type annotations, and the root directory contains a <em>tsconfig.app.json</em> file.

Now, let's take a look at the <em>tsconfig.app.json</em> file that has been created for us:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

```

The <em>compilerOptions</em> now include the key <em>lib</em> with <em>DOM</em>, which adds type definitions for browser environment APIs such as <em>document</em>. Most of the other configs are more or less obvious or already familiar to us.

In our previous project, we used ESLint to help us enforce a coding style, and we'll do the same with this app. We do not need to install any dependencies, since Vite has taken care of that already.

When we look at the <em>main.tsx</em> file that Vite has generated, it looks familiar, but there is a small but remarkable difference; there is an exclamation mark after the statement <em>document.getElementById('root')</em>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;React.StrictMode&gt;
    &lt;App /&gt;
  &lt;/React.StrictMode&gt;,
)
```

The reason for this is that the statement might return value null but the&nbsp;<em>ReactDOM.createRoot</em>&nbsp;does not accept null as parameter. With the&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-" target="_blank" rel="noreferrer noopener">! operator</a>, it is possible to assert to the TypeScript compiler that the value is not null.

Earlier in this part, we <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3">warned</a> about the dangers of type assertions, but in our case, the assertion is ok since we are sure that the file <em>index.html</em> indeed has this particular id and the function is always returning an HTMLElement.

### React components with TypeScript

Let us consider the following JavaScript React example:

```js
import ReactDOM from 'react-dom/client'

const Welcome = props => {
  return &lt;h1>Hello, {props.name}&lt;/h1>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  &lt;Welcome name="Sarah" />
)
```

In this example, we have a component called <em>Welcome</em> to which we pass a <em>name</em> as a prop. It then renders the name to the screen. We know that the <em>name</em> should be a string. In React, there is no way to ensure that the component is used correctly.

> In older React versions, it was possible to define expected types for component props and receive warnings about type mismatches using the <a href="https://www.npmjs.com/package/prop-types" target="_blank" rel="noreferrer noopener">prop-types</a> feature, but support for this has been removed in React 19.

With TypeScript, we can define the types with the help of TypeScript, just like we define types for a regular function, as React components are nothing but mere functions. We will use an interface for the parameter types (i.e., props) and <em>JSX.Element</em> as the return type for any React component:

```ts
import ReactDOM from 'react-dom/client'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element =&gt; {
  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;Welcome name="Sarah" /&gt;
)
```

We defined a new type,&nbsp;<em>WelcomeProps</em>, and passed it to the function's parameter types.

```js
const Welcome = (props: WelcomeProps): JSX.Element =&gt; {
```

You could write the same thing using a more verbose syntax:

```ts
const Welcome = ({ name }: { name: string }): JSX.Element =&gt; (
  &lt;h1&gt;Hello, {name}&lt;/h1&gt;
);
```

Now our editor knows that the&nbsp;<em>name</em>&nbsp;prop is a string.

There is actually no need to define the return type of a React component since the TypeScript compiler infers the type automatically, so we can just write:

```ts
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {  // HIGHLIGHT LINE
   return &lt;h1>Hello, {props.name}&lt;/h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;Welcome name="Sarah" />
)
```

<div class="tasks">

**17. Course, step1**

</div>

### Deeper type usage

In the previous exercise, we had three parts of a course, and all parts had the same attributes&nbsp;<em>name</em>&nbsp;and&nbsp;<em>exerciseCount</em>. But what if we need additional attributes for a specific part? How would this look, codewise? Let's consider the following example:

```js
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

In the above example, we have added some additional attributes to each course part. Each part has the&nbsp;<em>name</em>&nbsp;and&nbsp;<em>exerciseCount</em>&nbsp;attributes, but the first, third and fourth also have an attribute called&nbsp;<em>description</em>. The second and fourth parts also have some distinct additional attributes.

Let's imagine that our application just keeps on growing, and we need to pass the different course parts around in our code. On top of that, there are also additional attributes and course parts added to the mix. How can we know that our code is capable of handling all the different types of data correctly, and we are not for example forgetting to render a new course part on some page? This is where TypeScript comes in handy!

Let's start by defining types for our different course parts. We notice that the first and third have the same set of attributes. The second and fourth are a bit different so we have three different kinds of course part elements.

So let us define a type for each of the different kind of course parts:

```ts
interface CoursePartBasic {
  name: string;
  exerciseCount: number;
  description: string;
  kind: "basic"
}

interface CoursePartGroup {
  name: string;
  exerciseCount: number;
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground {
  name: string;
  exerciseCount: number;
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

Besides the attributes that are found in the various course parts, we have now introduced an additional attribute called&nbsp;<em>kind</em>&nbsp;that has a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" target="_blank" rel="noreferrer noopener">literal</a>&nbsp;type, it is a "hard coded" string, distinct for each course part. We shall soon see where the attribute kind is used!

Next, we will create a type&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" target="_blank" rel="noreferrer noopener">union</a>&nbsp;of all these types. We can then use it to define a type for our array, which should accept any of these course part types:

```ts
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

Now we can set the type for our&nbsp;<em>courseParts</em>&nbsp;variable:

```js
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"    // HIGHLIGHT LINE
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"    // HIGHLIGHT LINE
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"    // HIGHLIGHT LINE
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"    // HIGHLIGHT LINE
    },
  ]

  // ...
}
```

Note that we have now added the attribute&nbsp;<em>kind</em>&nbsp;with a proper value to each element of the array.

Our editor will automatically warn us if we use the wrong type for an attribute, use an extra attribute, or forget to set an expected attribute. If we e.g. try to add the following to the array

```
{
  name: "TypeScript in frontend",
  exerciseCount: 10,
  kind: "basic",
},
```

We will immediately see an error in the editor:

![description missing in warning](/images/mooc/5bb7273a18a5.webp)

Since our new entry has the attribute&nbsp;<em>kind</em>&nbsp;with value&nbsp;<em>"basic"</em>, TypeScript knows that the entry does not only have the type&nbsp;<em>CoursePart</em>&nbsp;but it is actually meant to be a&nbsp;<em>CoursePartBasic</em>. So here the attribute&nbsp;<em>kind</em>&nbsp;"narrows" the type of the entry from a more general to a more specific type that has a certain set of attributes. We shall soon see this style of type narrowing in action in the code!

But we're not satisfied yet! There is still a lot of duplication in our types, and we want to avoid that. We start by identifying the attributes all course parts have in common, and defining a base type that contains them. Then we will&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types" target="_blank" rel="noreferrer noopener">extend</a>&nbsp;that base type to create our kind-specific types:

```ts
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

### More type narrowing

How should we now use these types in our components?

If we try to access the objects in the array <em>courseParts: CoursePart[],</em> we notice that it is possible to only access the attributes that are common to all the types in the union:

![The editor allows only accessing the common attributes](/images/mooc/ee69c47fc4d6.webp)

And indeed, the TypeScript&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;says this:

> <em>TypeScript will only allow an operation (or attribute access) if it is valid for every member of the union.</em>

The documentation also mentions the following:

> <em>The solution is to narrow the union with code... Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.</em>

So once again the&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">type narrowing</a>&nbsp;is the rescue!

One handy way to narrow these kinds of types in TypeScript is to use <em>switch case</em> expressions. Once TypeScript has inferred that a variable is of union type and that each type in the union contains a certain literal attribute (in our case <em>kind</em>), we can use that as a type identifier. We can then build a switch case around that attribute and TypeScript will know which attributes are available within each case block:

![vs code showing now more attributes when type is narrowed in the cases of

  courseParts.forEach(part => {
    switch (part.kind) {
      case "basic":
        console.log(part.name, part.description, part.exerciseCount);
        break;
      case "group":
        console.log(part.name, part.exerciseCount, part.groupProjectCount);
        break;
      case "background":
        console.log(part.name, part.description, part.backgroundMaterial);
        break;](/images/mooc/d9d3b619180d.webp)

In the above example, TypeScript knows that a&nbsp;<em>part</em>&nbsp;has the type&nbsp;<em>CoursePart</em>&nbsp;and it can then infer that&nbsp;<em>part</em>&nbsp;is of either type&nbsp;<em>CoursePartBasic</em>,&nbsp;<em>CoursePartGroup</em>&nbsp;or&nbsp;<em>CoursePartBackground</em>&nbsp;based on the value of the attribute&nbsp;<em>kind</em>.

The specific technique of type narrowing where a union type is narrowed based on literal attribute value is called&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions" target="_blank" rel="noreferrer noopener">discriminated union</a>.

Note that the narrowing can naturally be also done with&nbsp;<em>if</em>&nbsp;clause. We could eg. do the following:

```
  courseParts.forEach(part =&gt; {
    if (part.kind === 'background') {
      console.log('see the following:', part.backgroundMaterial)
    }

    // can not refer to part.backgroundMaterial here!
  });
```

What about adding new types? If we were to add a new course part, wouldn't it be nice to know if we had already implemented handling that type in our code? In the example above, a new type would go to the&nbsp;<em>default</em>&nbsp;block and nothing would get printed for a new type. Sometimes this is wholly acceptable. For instance, if you wanted to handle only specific (but not all) cases of a type union, having a default is fine. Nonetheless, it is recommended to handle all variations separately in most cases.

With TypeScript, we can use a method called&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking" target="_blank" rel="noreferrer noopener">exhaustive type checking</a>. Its basic principle is that if we encounter an unexpected value, we call a function that accepts a value with the type&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type" target="_blank" rel="noreferrer noopener">never</a>&nbsp;and also has the return type&nbsp;<em>never</em>.

A straightforward version of the function could look like this:

```js
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never =&gt; {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

If we now were to replace the contents of our&nbsp;<em>default</em>&nbsp;block to:

```js
default:
  return assertNever(part);
```

and remove the case that handles the type <em>CoursePartBackground</em>, we would see the following error:

![error is shown if switch cases are not exhaustive](/images/mooc/f79e544ebda4.webp)

The error message says that

```
'CoursePartBackground' is not assignable to parameter of type 'never'.
```

which tells us that we are using a variable somewhere where it should never be used. This tells us that something needs to be fixed.

<div class="tasks">

**18. Course, part2**

</div>

### React app with state

So far, we have only looked at an application that keeps all the data in a typed variable but does not have any state. Let us once more go back to the good old <em>note app</em> and build a typed version of it.

We start with the following code:

```js
import { useState } from 'react';

const App = () =&gt; {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  return null
}
```

When we hover over the&nbsp;<em>useState</em>&nbsp;calls in the editor, we notice a couple of interesting things.

The type of the first call&nbsp;<em>useState('')</em>&nbsp;looks like the following:

```ts
useState&lt;string&gt;(initialState: string | (() =&gt; string)):
  [string, React.Dispatch&lt;React.SetStateAction&lt;string&gt;&gt;]
```

The type is somewhat challenging to decipher. It has the following "form":

```
functionName(parameters): return_value
```

So we notice that TypeScript compiler has inferred that the initial state is either a string or a function that returns a string:

```ts
initialState: string | (() =&gt; string))
```

The type of the returned array is the following:

```
[string, React.Dispatch&lt;React.SetStateAction&lt;string&gt;&gt;]
```

So the first element, assigned to&nbsp;<em>newNote</em>&nbsp;is a string and the second element that we assigned&nbsp;<em>setNewNote</em>&nbsp;has a slightly more complex type. We notice that there is a string mentioned there, so we know that it must be the type of a function that sets a valued data. See&nbsp;<a href="https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/" target="_blank" rel="noreferrer noopener">here</a>&nbsp;if you want to learn more about the types of useState function.

From all this we see that TypeScript has indeed&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content" target="_blank" rel="noreferrer noopener">inferred</a>&nbsp;the type of the first useState correctly, a state with type string is created.

When we look at the second useState that has the initial value&nbsp;<em>[]</em>&nbsp;, the type looks quite different

```
useState&lt;never[]&gt;(initialState: never[] | (() =&gt; never[])):
  [never[], React.Dispatch&lt;React.SetStateAction&lt;never[]&gt;&gt;]
```

TypeScript can just infer that the state has type&nbsp;<em>never[]</em>, it is an array but it has no clue what the elements stored to the array are, so we clearly need to help the compiler and provide the type explicitly.

One of the best sources for information about typing React is the&nbsp;<a href="https://react-typescript-cheatsheet.netlify.app/" target="_blank" rel="noreferrer noopener">React TypeScript Cheatsheet</a>. The Cheatsheet chapter about&nbsp;<a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate" target="_blank" rel="noreferrer noopener">useState</a>&nbsp;hook instructs us to use a&nbsp;<em>type parameter</em>&nbsp;in situations where the compiler can not infer the type.

Let us now define a type for notes:

```ts
interface Note {
  id: string,
  content: string
}
```

The solution is now simple:

```js
const [notes, setNotes] = useState&lt;Note[]&gt;([]);
```

And indeed, the type is set correctly:

```
useState&lt;Note[]&gt;(initialState: Note[] | (() =&gt; Note[])):
  [Note[], React.Dispatch&lt;React.SetStateAction&lt;Note[]&gt;&gt;]
```

So in technical terms useState is&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" target="_blank" rel="noreferrer noopener">a generic function</a>, where the type has to be specified as a&nbsp;<em>type parameter</em>&nbsp;in those cases when the compiler can not infer the type.

Rendering the notes is now easy. Let us just add some data to the state so that we can see that the code works:

```ts
interface Note {
  id: string,
  content: string
}

import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([
    { id: '1', content: 'testing' } // HIGHLIGHT LINE
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    &lt;div>
      &lt;ul>
// BEGIN HIGHLIGHT
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
// END HIGHLIGHT
      &lt;/ul>
    &lt;/div>
  )
}
```

The next task is to add a form that makes it possible to create new notes:

```js
const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([
    { id: 1, content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;form>
        &lt;input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
         />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
// END HIGHLIGHT
      &lt;ul>
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
      &lt;/ul>
    &lt;/div>
  )
}
```

It just works, there are no complaints about types! When we hover over the <em>event.target.value</em>, we see that it is indeed a string, just what is expected for the parameter of <em>setNewNote</em>:

![VS Code shows that event.target.value is a string](/images/mooc/6ae292f825ba.webp)

So we still need the event handler for adding the new note. Let us try the following:

```js
const App = () => {
  // ...

  const noteCreation = (event) => {
    event.preventDefault()
    // ...
  };

  return (
    &lt;div>
      &lt;form onSubmit={noteCreation}> // HIGHLIGHT LINE
        &lt;input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
      // ...
    &lt;/div>
  )
}
```

It does not quite work, there is an ESLint error complaining about implicit any:

![VS Code showing an error that the event has type any](/images/mooc/fa387bd9e00c.webp)

TypeScript compiler now has no clue what the type of the parameter is, this is why the type is the infamous implicit any that we want to <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3" target="_blank" rel="noreferrer noopener">avoid</a> at all costs. The React TypeScript cheatsheet comes to the rescue again. The chapter about <a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" target="_blank" rel="noreferrer noopener">forms and events</a> reveals that the right type of event handler is <em>React.SyntheticEvent</em>.

The code becomes

```ts
interface Note {
  id: string,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([]);
  const [newNote, setNewNote] = useState('');

// BEGIN HIGHLIGHT
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const noteToAdd = {
      content: newNote,
      id: String(notes.length + 1)
    }
    setNotes(notes.concat(noteToAdd));
    setNewNote('')
  };
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;form onSubmit={noteCreation}>
        &lt;input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
      &lt;ul>
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
      &lt;/ul>
    &lt;/div>
  )
}
```

And that's it, our app is ready and perfectly typed!

### Communicating with the server

Let us modify the app so that the notes are saved in a JSON server backend in url&nbsp;<a href="http://localhost:3001/notes" target="_blank" rel="noreferrer noopener">http://localhost:3001/notes</a>

As usual, we shall use Axios and the useEffect hook to fetch the initial state from the server.

Let us try the following:

```js
import axios from 'axios';

// ...

const App = () => {
  // ...
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
  // ...
}
```

When we hover over the <em>response.data</em> we see that it has the type <em>any</em>

![We see that response has type any](/images/mooc/b341c307a568.webp)

To set the data to the state with function&nbsp;<em>setNotes</em>&nbsp;we must type it properly.

With a little&nbsp;<a href="https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps" target="_blank" rel="noreferrer noopener">help from the internet</a>, we find a clever trick:

```
  useEffect(() => {
    axios.get&lt;Note[]>('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
```

When we hover over the response.data we see that it has the correct type:

![suddently the response.data has type Note[]](/images/mooc/6aebedc988f2.webp)

We can now set the data in the state&nbsp;<em>notes</em>&nbsp;to get the code working:

```
  useEffect(() => {
    axios.get&lt;Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data)
    })
  }, [])
```

So just like with&nbsp;<em>useState</em>, we gave a type parameter to&nbsp;<em>axios.get</em>&nbsp;to instruct it on how the typing should be done. Just like&nbsp;<em>useState</em>,&nbsp;<em>axios.get</em>&nbsp;is also a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" target="_blank" rel="noreferrer noopener">generic function</a>. Unlike some generic functions, the type parameter of&nbsp;<em>axios.get</em>&nbsp;has a default value of&nbsp;<em>any</em>&nbsp;so, if the function is used without defining the type parameter, the type of the response data will be any.

The code works, the compiler and ESLint are happy and remain quiet. However, giving a type parameter to <em>axios.get</em> is a potentially dangerous thing to do. The <em>response body could contain data in an arbitrary form</em>, and when giving a type parameter, we are essentially just telling the TypeScript compiler to trust us that the data has type <em>Note[]</em>.

So our code is essentially as safe as it would be if a&nbsp;<a href="https://fullstackopen.com/en/part9/first_steps_with_type_script#type-assertion" target="_blank" rel="noreferrer noopener">type assertion</a>&nbsp;would be used (not good):

```
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      // response.body is of type any
      setNotes(response.data as Note[])
    })
  }, [])
```

Since the TypeScript types do not even exist in runtime, our code does not give us any safety against situations where the request body contains data in the wrong form.

Giving a type parameter to <em>axios.get</em> might be ok if we are <em>absolutely sure</em> that the backend behaves correctly and always returns the data in the correct form. If we want to build a robust system we should prepare for surprises and parse the response data (similar to what we did <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4" target="_blank" rel="noreferrer noopener">in the previous section</a> for the requests to the backend).

Let us now wrap up our app by implementing the new note addition:

```js
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
// BEGIN HIGHLIGHT
    axios.post&lt;Note>('http://localhost:3001/notes', { content: newNote })
      .then(response => {
        setNotes(notes.concat(response.data))
      })
// END HIGHLIGHT
    setNewNote('')
  };
```

We are again giving&nbsp;<em>axios.post</em>&nbsp;a type parameter. We know that the server response is the added note, so the proper type parameter is&nbsp;<em>Note</em>.

Let us clean up the code a bit. For the type definitions, we create a file&nbsp;<em>types.ts</em>&nbsp;with the following content:

```ts
export interface Note {
  id: string,
  content: string
}

export type NewNote = Omit&lt;Note, 'id'&gt;
```

We have added a new type for a&nbsp;<em>new note</em>, one that does not yet have the&nbsp;<em>id</em>&nbsp;field assigned.

The code that communicates with the backend is also extracted to a module in the file&nbsp;<em>noteService.ts</em>

```js
import axios from 'axios'
import type { Note, NewNote } from './types'

const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios
    .get&lt;Note[]>(baseUrl)
    .then(response => response.data)
}

const create = (object: NewNote) => {
  return axios
    .post&lt;Note>(baseUrl, object)
    .then(response => response.data)
}

export default { getAll, create }

```

The component&nbsp;<em>App</em>&nbsp;is now much cleaner:

```js
import { useState, useEffect } from 'react'
import type { Note } from './types'
import noteService from './noteService'

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    noteService.create({ content: newNote })
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
    setNewNote('')
  };

  return (
    // ...
  )
}

export default App

```

The app is now nicely typed and ready for further development!

The code of the typed notes can be found&nbsp;<a href="https://github.com/fullstack-hy2020/typed-notes" target="_blank" rel="noreferrer noopener">here</a>.

### A note about defining object types

We have used&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">interfaces</a>&nbsp;to define object types, e.g. diary entries, in the previous section

```ts
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

and in the course part of this section

```ts
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

We actually could have achieved the same effect by using a&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">type alias</a>

```ts
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

In most cases, you can use either&nbsp;<em>type</em>&nbsp;or&nbsp;<em>interface</em>, whichever syntax you prefer. However, there are a few things to keep in mind. For example, if you define multiple interfaces with the same name, they will result in a merged interface, whereas if you try to define multiple types with the same name, it will result in an error stating that a type with the same name is already declared.

TypeScript documentation&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces" target="_blank" rel="noreferrer noopener">recommends using interfaces</a>&nbsp;in most cases.

<div class="tasks">

**19. Flight diaries, step1**

</div>

<div class="tasks">

**20. Flight diaries, step2**

</div>

<div class="tasks">

**21. Flight diaries, step3**

</div>

<div class="tasks">

**22. Flight diaries, step4**

</div>
