---
part: 6
letter: b
title: "Chapter 2: Flux-architecture and Zustand"
mainImage: /images/part-6.svg
lang: en
---
We have followed React's recommended practice for managing application state by defining the state needed by multiple components and the functions that handle it in the&nbsp;<a href="https://reactjs.org/docs/lifting-state-up.html" target="_blank" rel="noopener">top-level</a>&nbsp;components of the component hierarchy. Most of the state and the functions handling it have typically been defined directly in the root component and passed via props to the components that need them. This works up to a point, but as the application grows, state management becomes challenging.

### Flux architecture

Facebook developed the <a href="https://facebookarchive.github.io/flux/docs/in-depth-overview" target="_blank" rel="noopener">Flux</a> architecture in the early days of React's history to ease state management problems. In Flux, the management of application state is separated entirely into external <em>stores</em> outside of React components. The state in the store is not changed directly but through specific <em>actions</em> that are created for that purpose.

When an action is dispatched and it changes the store's state, the views are re-rendered:

![صورة توضيحية](/images/mooc/c6580b86efb4.webp)

If the use of the application (e.g., pressing a button) causes a need to change the state, the change is made through an action. This in turn causes the view to be re-rendered:

![صورة توضيحية](/images/mooc/9ff17e8407bf.webp)

Flux thus provides a standard way for how and where the application state is kept and for making changes to it.

### Redux

<a href="https://redux.js.org/" target="_blank" rel="noopener">Redux</a>, which follows the Flux architecture, was the dominant state management solution for React applications for nearly a decade. In this course, Redux was also used until spring 2026. Redux has always been plagued by complexity and a large amount of boilerplate code. The situation improved significantly with the introduction of Redux Toolkit, but despite this, the community continued to develop alternative state management solutions, such as <a href="https://mobx.js.org/README.html">MobX</a>, <a href="https://recoiljs.org/">Recoil</a>, and <a href="https://www.npmjs.com/package/jotai" target="_blank" rel="noopener">Jotai</a>. Their popularity has varied.

The most interesting, and without a doubt the most popular of the new arrivals is <a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>, and it is also our choice for a state management solution. Zustand appears to have already caught up with Redux in popularity:

![صورة توضيحية](/images/mooc/a388491aa9a6.webp)

### Zustand

Let's get familiar with Zustand by once again implementing a counter application:

![صورة توضيحية](/images/mooc/46faac4f212d.webp)

We'll create a new Vite application and install <em>Zustand</em>:

```bash
npm install zustand
```

The first version, where only the counter increment works, is as follows:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
}))

const App = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)
  const increment = useCounterStore(state =&gt; state.increment)

  return (
    &lt;div&gt;
      &lt;div&gt;{counter}&lt;/div&gt;
      &lt;div&gt;
        &lt;button onClick={increment}&gt;plus&lt;/button&gt;
        &lt;button&gt;minus&lt;/button&gt;
        &lt;button&gt;zero&lt;/button&gt;
      &lt;/div&gt;

    &lt;/div&gt;
  )
}
```

The application starts by creating the&nbsp;<em>store</em>, i.e., the global state, using Zustand's&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create" target="_blank" rel="noopener">create</a>&nbsp;function:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
}))
```

The function receives as a parameter a&nbsp;<em>function</em>&nbsp;that returns the state to be defined for the application. The parameter is thus the following:

```
set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
})
```

The state thus has&nbsp;<em>counter</em>&nbsp;defined with a value of zero, and&nbsp;<em>increment</em>&nbsp;which is a function.

The application's components can access the values and functions defined in the state through the&nbsp;<em>useCounterStore</em>&nbsp;function defined using Zustand's&nbsp;<em>create</em>. The&nbsp;<em>App</em>&nbsp;component uses&nbsp;<em>selectors</em>&nbsp;to retrieve the&nbsp;<em>counter</em>&nbsp;value and the&nbsp;<em>increment</em>&nbsp;function from the state:

```js
const App = () => {
  // using selector to pick right part of the store state
// BEGIN HIGHLIGHT
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)
// END HIGHLIGHT

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;div>{counter}&lt;/div>
// END HIGHLIGHT
      &lt;div>
// BEGIN HIGHLIGHT
        &lt;button onClick={increment}>plus&lt;/button>
// END HIGHLIGHT
        &lt;button>minus&lt;/button>
        &lt;button>zero&lt;/button>
      &lt;/div>

    &lt;/div>
  )
}
```

The code stores counter value of the store into a variable as follows:

```js
const counter = useCounterStore(state =&gt; state.counter)
```

A selector function&nbsp;<em>state =&gt; state.counter</em>&nbsp;is used, which determines what is returned from the store's contents. In the same way, the function stored in the store is retrieved into the variable&nbsp;<em>increment</em>.

The state function&nbsp;<em>increment</em>, which was defined as follows, is given as the click handler for the "plus" button:

```js
const useCounterStore = create(set => ({
  counter: 0,
// BEGIN HIGHLIGHT
  increment: () => set(state => ({ counter: state.counter + 1 })),
// END HIGHLIGHT
}))
```

Let's look at the function definition separately:

```
() =&gt; set(state =&gt; ({ counter: state.counter + 1 }))
```

This is a function that calls the&nbsp;<a href="https://zustand.docs.pmnd.rs/learn/guides/updating-state" target="_blank" rel="noopener">set</a>&nbsp;function giving another function as a parameter. This function passed as a parameter defines how the state changes:

```
state =&gt; ({ counter: state.counter + 1 })
```

which is shorthand for:

```js
state =&gt; {
  return { counter: state.counter + 1 }
}
```

The function returns a new state, which it computes based on the old state that it can access using the parameter&nbsp;<em>state</em>. So if the old state is, for example:

```js
{
  counter: 1,
  increment: // function definition
}
```

the new state becomes:

```js
{
  counter: 2,
  increment: // function definition
}
```

The state always also contains the state-changing function&nbsp;<em>increment</em>.

The state transition function

```
state =&gt; ({ counter: state.counter + 1 })
```

only affects the&nbsp;<em>counter</em>&nbsp;value in the state.

Nothing would prevent changing the function in the state within the state transition function; for example, if we defined it as follows:

```js
state =&gt; {
  return {
    counter: state.counter + 1 ,
    increment: console.log('increment broken')
  }
}
```

the increment button would only work the first time; after that, pressing the button would only print to the console.

When the new state is set as:

```
state =&gt; ({ counter: state.counter + 1 })
```

only the value of the&nbsp;<em>counter</em>&nbsp;key in the state is updated; the new state is obtained by merging the old state with the value returned by the state-changing function. This is why the following state transition function:

```
state =&gt; ({})
```

does not affect the state at all.

Let's complete the application for the remaining buttons as well:

```js
const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
  decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
  zero: () =&gt; set(() =&gt; ({ counter: 0 })),
}))

const App = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)
  const increment = useCounterStore(state =&gt; state.increment)
  const decrement = useCounterStore(state =&gt; state.decrement)
  const zero = useCounterStore(state =&gt; state.zero)

  return (
    &lt;div&gt;
      &lt;div&gt;{counter}&lt;/div&gt;
      &lt;div&gt;
        &lt;button onClick={increment}&gt;plus&lt;/button&gt;
        &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
        &lt;button onClick={zero}&gt;zero&lt;/button&gt;
      &lt;/div&gt;

    &lt;/div&gt;
  )
}
```

> Where do set and state come from?
>
> Where does&nbsp;<em>set</em>&nbsp;come from? It is a helper function provided by Zustand's&nbsp;<em>create</em>&nbsp;function, used to update the state.&nbsp;<em>create</em>&nbsp;calls the parameter function it receives and automatically passes&nbsp;<em>set</em>&nbsp;to it. You don't need to call or import it yourself; Zustand takes care of that.
>
> Where does&nbsp;<em>state</em>&nbsp;come from? When a function is given as a parameter to&nbsp;<em>set</em>&nbsp;(instead of a new state object directly), Zustand calls that function with the store's current state as its argument. This way, state-updating functions can access the old state to compute the new one.

### Using the state from different components

Let's refactor the application so that the store definition is moved to its own file&nbsp;<em>store.js</em>, and the view is split into multiple components, each defined in their own files.

The contents of&nbsp;<em>store.js</em>&nbsp;are straightforward:

```js
export const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
  decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
  zero: () =&gt; set(() =&gt; ({ counter: 0 })),
}))
```

The&nbsp;<em>App</em>&nbsp;component is simplified as follows:

```js
import Display from './Display'
import Controls from './Controls'

const App = () =&gt; {
  return (
    &lt;div&gt;
      &lt;Display /&gt;
      &lt;Controls /&gt;
    &lt;/div&gt;
  )
}

export default App
```

What is noteworthy here is that the&nbsp;<em>App</em>&nbsp;component no longer passes state to its child components. In fact, the component does not touch the state in any way, the store definition has been fully separated outside the component.

The component that renders the counter value is simple:

```js
import { useCounterStore } from './store'

const Display = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)

  return (
    &lt;div&gt;{counter}&lt;/div&gt;
  )
}

export default Display
```

The component accesses the counter value via the&nbsp;<em>useCounterStore</em>&nbsp;function that defines the store. This is convenient in many ways, for example, there is no need to pass the state to the component through props.

The component that defines the buttons looks like this:

```js
import { useCounterStore } from './store'

const Controls = () =&gt; {
  const increment = useCounterStore(state =&gt; state.increment)
  const decrement = useCounterStore(state =&gt; state.decrement)
  const zero = useCounterStore(state =&gt; state.zero)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}

export default Controls
```

The&nbsp;<em>useCounterStore</em>&nbsp;function takes a selector function as its parameter, which determines which part of the state to use. For example:

```js
  const increment = useCounterStore(state =&gt; state.increment)
```

Here, the selector function <em>state => state.increment</em> picks the value of the <em>increment</em> key from the state, the function that increments the counter, and stores it in the variable <em>increment</em>.

We could also access the entire state as follows:

```js
  const state = useCounterStore()
  // does the same as useCounterStore(state =&gt; state), i.e., selects the entire state
```

We could then refer to the counter value and the functions using dot notation, i.e.,&nbsp;<em>state.counter</em>&nbsp;and&nbsp;<em>state.increment</em>.

A natural question arises: would it be possible to use multiple parts of the state via destructuring:

```js
import { useCounterStore } from './store'

const Controls = () => {
// BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useCounterStore()
// END HIGHLIGHT
  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}

export default Controls
```

The solution works, but it has a significant drawback. Destructuring causes the&nbsp;<em>Controls</em>&nbsp;component to be re-rendered every time the counter value changes, even though the component only displays the buttons and not the value itself.

<em>The best practice in Zustand is therefore to select from the state only those parts that are needed in the given component.</em> A component re-renders only when the part of the state it has selected changes. When instead writing:

```js
const increment = useCounterStore(state => state.increment)
const decrement = useCounterStore(state => state.decrement)
const zero = useCounterStore(state => state.zero)
```

the component no longer reacts to changes in the counter value because it has not selected it from the state.

### Reorganizing the state

We can achieve quite a neat solution by reorganizing the state as follows:

```js
export const useCounterStore = create(set =&gt; ({
  counter: 0,
  actions: {
    increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
    decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
    zero: () =&gt; set(() =&gt; ({ counter: 0 })),
  }
}))
```

The state-changing functions are now grouped under their own key&nbsp;<em>actions</em>, and they can be selected as a whole and destructured:

```js
const Controls = () => {
  const { increment, decrement, zero } = useCounterStore(state => state.actions)

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}
```

Now no re-rendering occurs, since only the functions have been selected from the state, and they remain the same for the entire lifetime of the store.

According to some&nbsp;<a href="https://tkdodo.eu/blog/working-with-zustand#only-export-custom-hooks" target="_blank" rel="noopener">best practices</a>, it is not advisable to export the function defining the entire state for use throughout the application. Instead, smaller views that expose only the necessary parts of the state should be created from it. Let's modify&nbsp;<em>store.js</em>&nbsp;as follows:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  actions: {
    increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
    decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
    zero: () =&gt; set(() =&gt; ({ counter: 0 })),
  }
}))

// the hook functions that are used elsewhere in app
export const useCounter = () =&gt; useCounterStore(state =&gt; state.counter)
export const useCounterControls = () =&gt; useCounterStore(state =&gt; state.actions)
```

Now, outside the module defining the state, the functions <em>useCounter</em>, which returns the counter value when called, and <em>useCounterControls</em>, which returns the functions that modify the counter value, are available. The usage changes slightly:

```js
// BEGIN HIGHLIGHT
import { useCounter } from './store'
// END HIGHLIGHT

const Display = () => {
// BEGIN HIGHLIGHT
  const counter = useCounter()
// END HIGHLIGHT

  return (
    &lt;div>{counter}&lt;/div>
  )
}
```

```js
// BEGIN HIGHLIGHT
import { useCounterControls } from './store'
// END HIGHLIGHT

const Controls = () => {
// BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useCounterControls()
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}
```

When using the state this way, there is no longer a need to use selector functions, as their use is hidden inside the definition of the new helper functions.

The more observant have noticed that the Zustand-related functions are named starting with the word <em>use</em>. The reason for this is that the function returned by Zustand's <em>create</em> function, in our example <em>useCounterStore</em>, is a React <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">custom hook</a> function. Our own helper functions <em>useCounter</em> and <em>useCounterControls</em> are also essentially custom hooks because they hide the use of the custom hook <em>useCounterStore</em> inside them.

Custom hooks come with a set of rules, for example, their names are expected to always start with&nbsp;<em>use</em>. The&nbsp;<a href="https://react.dev/warnings/invalid-hook-call-warning" target="_blank" rel="noopener">rules of hooks</a>&nbsp;covered in&nbsp;<a href="http://localhost:8000/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">Part 1</a>&nbsp;also apply to custom hooks!

#### Custom hooks with a more complex state

Assume that we would also like to count how many times the counter state has changed. We could extend the store as follows:

```js
const useCounterStore = create(set => ({<br>  counter: 0,<br> // BEGIN HIGHLIGHT<br>  changes: 0,<br> // END HIGHLIGHT<br>  actions: {<br>    increment: () => set(state => ({ <br>      counter: state.counter + 1, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>    decrement: () => set(state => ({ <br>      counter: state.counter - 1, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>    zero: () => set(state => ({ <br>      counter: 0, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>  }  <br>}))
```

We could then try to write the hook for accessing the values as follows:

```js
export const useValues = () => useCounterStore(state => ({ <br>   counter: state.counter,<br>   changes: state.changes<br>})
```

This does not work, since the selector function returns a <em>new object on every render</em>, even when the underlying values haven't changed. Zustand compares the previous and new selector results with a reference equality check (<code>===</code>) so a fresh object is always seen as "changed." This triggers a re-render, which calls the selector again, which returns another new object, and so on, an infinite render loop.

The fix is to wrap the selector with <a href="https://zustand.docs.pmnd.rs/reference/hooks/use-shallow"><code>useShallow</code></a>,which tells Zustand to compare the fields of the returned object with a shallow equality check instead of comparing object references:

```js
import { useShallow } from "zustand/react/shallow"<br><br>export const useValues = () => useCounterStore(state => { <br>  useShallow((state) => ({<br>    counter: state.counter,<br>    changes: state.changes,<br>  })),<br>)
```

Now Zustand only triggers a re-render when <em>counter</em> or <em>changes</em> actually have a new value, not just when a new object is created.

<div class="tasks">

**1. Unicafe revisited**

</div>

<div class="tasks">

**2. Running tests**

</div>

### Zustand notes

Our goal is to make a Zustand-based version of the good old notes application.

The first version of the application is the following. The&nbsp;<em>App</em>&nbsp;component:

```js
import { useNotes } from './store'

const App = () =&gt; {
  const notes = useNotes()

  return (
    &lt;div&gt;
      &lt;ul&gt;
        {notes.map(note =&gt; (
          &lt;li key={note.id}&gt;
            {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  )
}
export default App
```

Store is initially defined as follows:

```js
import { create } from 'zustand'

const useNoteStore = create(set =&gt; ({
  notes: [
    {
      id: 1,
      content: 'Zustand is less complex than Redux',
      important: true,
    },
  ],
}))

export const useNotes = () =&gt; useNoteStore(state =&gt; state.notes)
```

For now, the application does not have the functionality to add new notes, and the store does not yet support it. The state has been initialized with one note already added so that we can verify the application can successfully render the state.

### Pure functions and immutable objects

The first attempt at an action that adds a note is the following:

```js
note =&gt; set(
          state =&gt; {
            state.notes.push(note)
            return state
          }
        )
```

The function receives a note as a parameter and returns a state where the new note has been added to the old state <em>state</em>.

Our attempt is, however, not a proper one. Zustand's <a href="https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging" target="_blank" rel="noopener">documentation</a> states <em>Like with React's useState, we need to update state immutably</em>. As we know, <em>state.notes.push</em> modifies (i.e., mutates) the state object, so the solution must be changed.

The proper way is to use, for example, the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat" target="_blank" rel="noopener">Array.concat</a>&nbsp;function, which does not modify the existing state but creates a new copy of it with the new note added:

```js
note =&gt; set(
          state =&gt; {
            return { notes: state.notes.concat(note) }
          }
        )
```

The store definition now looks as follows:

```js
import { create } from 'zustand'

const useNoteStore = create(set =&gt; ({
  notes: [],
  actions: {
    add: note =&gt; set(
      state =&gt; ({ notes: state.notes.concat(note) })
    )
  }
}))

export const useNotes = () =&gt; useNoteStore(state =&gt; state.notes)
export const useNoteActions = () =&gt; useNoteStore(state =&gt; state.actions)
```

> Array spread syntax
>
> Another commonly seen way to do the same thing is to use the array&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener">spread</a>&nbsp;syntax:
>
> state =&gt; ({ notes: [...state.notes, note] })
>
> Here, an array is formed by spreading each element of the&nbsp;<em>state.notes</em>&nbsp;array using spread syntax, and then appending the new note at the end. It is a matter of preference whether to use spread or the&nbsp;<em>concat</em>&nbsp;function.

Technically speaking, state created with Zustand is&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Glossary/Immutable" target="_blank" rel="noopener">immutable</a>, and the action functions that modify the state must be&nbsp;<a href="https://en.wikipedia.org/wiki/Pure_function" target="_blank" rel="noopener">pure functions</a>.

Pure functions are those that&nbsp;<em>produce no side effects</em>&nbsp;and always return the same result when called with the same parameters.

### Uncontrolled form

Let's add the ability to create new notes to the application:

```js
import { useNotes, useNoteActions } from './store'

const App = () => {
  const notes = useNotes()

  // BEGIN HIGHLIGHT
  const { add } = useNoteActions()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
// END HIGHLIGHT

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;form onSubmit={addNote}>
        &lt;input name="note" />
        &lt;button type="submit">add&lt;/button>
      &lt;/form>
// END HIGHLIGHT
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

The implementation is fairly straightforward. What is noteworthy about adding a new note is that, unlike our previous React-implemented forms, we have <em>not</em> bound the form field's value to the state of the <em>App</em> component. React calls such forms <a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components" target="_blank" rel="noopener">uncontrolled</a>.

> Uncontrolled forms have certain limitations. They do not allow, for example, providing validation messages on the fly, disabling the submit button based on content, and so on. However, they are suitable for our use case this time. You can read more about the topic&nbsp;<a href="https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/" target="_blank" rel="noopener">here</a>&nbsp;if you wish.

The form is very simple:

```
&lt;form onSubmit={addNote}&gt;
  &lt;input name="note" /&gt;
  &lt;button type="submit"&gt;add&lt;/button&gt;
&lt;/form&gt;
```

What is noteworthy about the form is that the input field has a name. This allows the handler function to access the field's value.

The addition handler is also straightforward:

```js
  const addNote = (e) =&gt; {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
```

The content is retrieved from the form's text field using&nbsp;<em>e.target.note.value</em>&nbsp;into a variable, which is used as a parameter in the call to the note-adding function&nbsp;<em>add</em>.

The last line,&nbsp;<em>e.target.reset()</em>, clears the form.

The current code of the application is available in its entirety on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-1" target="_blank" rel="noopener">GitHub</a>, in the branch&nbsp;<em>part6-1</em>.

### More components and functionality

Let's split the application into more components. We'll separate the creation of a new note, the list of notes, and the display of a single note into their own components.

The&nbsp;<em>App</em>&nbsp;component after the change is simple:

```js
const App = () =&gt; (
  &lt;div&gt;
    &lt;NoteForm /&gt;
    &lt;NoteList /&gt;
  &lt;/div&gt;
)
```

Note creation, i.e.,&nbsp;<em>NoteForm</em>, doesn't contain anything dramatic, so the code is not shown here.

The component responsible for listing notes,&nbsp;<em>NoteList</em>, looks like the following:

```js
import { useNotes } from './store'
import Note from './Note'

const NoteList = () =&gt; {
  const notes = useNotes()

  return (
    &lt;ul&gt;
      {notes.map(note =&gt; (
        &lt;Note key={note.id} note={note} /&gt;
      ))}
    &lt;/ul&gt;
  )
}
```

The component fetches the list of notes from the store and creates a corresponding&nbsp;<em>Note</em>&nbsp;component for each, passing the note's data as props:

```js
const Note = ({ note }) =&gt; (
  &lt;li&gt;
    {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
  &lt;/li&gt;
)
```

Let's also add the ability to toggle the importance of a note. The component after the change is the following:

```js
import { useNoteActions } from './store'

const Note = ({ note }) => {
// BEGIN HIGHLIGHT
  const { toggleImportance } = useNoteActions()
// END HIGHLIGHT

  return (
    &lt;li>
      {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
// BEGIN HIGHLIGHT
      &lt;button onClick={() => toggleImportance(note.id)}>
        {note.important ? 'make not important' : 'make important'}
      &lt;/button>
// END HIGHLIGHT
   &lt;/li>
  )
}
```

The component destructures the importance-toggling function from the return value of&nbsp;<em>useNoteActions</em>, and calls it when the toggle button is clicked.

The implementation of the importance-toggling function looks like the following:

```js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [],
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    ),
// BEGIN HIGHLIGHT
    toggleImportance: id => set(
      state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    )
// END HIGHLIGHT
  }
}))
```

The function receives the id of the note to be modified as a parameter. The new state is formed from the old state using the&nbsp;<em>map</em>&nbsp;function such that all old notes are included, except for the note to be modified, for which a version is created where its importance is toggled:

```
{ ...note, important: !note.important }
```

The current code of the application is available in its entirety on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-2" target="_blank" rel="noopener">GitHub</a>, in the branch&nbsp;<em>part6-2</em>.

<div class="tasks">

**3. Anecdotes, step1**

</div>

<div class="tasks">

**4. Anecdotes, step2**

</div>

<div class="tasks">

**5. Anecdotes, step3**

</div>

<div class="tasks">

**6. Anecdotes, step4**

</div>

After completing the exercises, the application should look like this:

![صورة توضيحية](/images/mooc/e232f973b851.webp)
