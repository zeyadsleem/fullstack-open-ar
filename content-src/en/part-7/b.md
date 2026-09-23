---
part: 7
letter: b
title: "More about React hooks"
mainImage: /images/part-7.svg
lang: en
---
The exercises in this part of the course differ a bit from the ones before. As usual, there are some exercises related to the theory of this chapter. The other chapters of this part do not have separate exercises.

In addition, this part contains a larger exercise series that extends the BlogList application built in parts 4 and 5. Those exercises are found <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5" target="_blank" rel="noopener">https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5</a>.

### React Hooks

React offers 18 different&nbsp;<a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener">built-in hooks</a>, of which the most popular ones are the&nbsp;<a href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">useState</a>&nbsp;and&nbsp;<a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">useEffect</a>&nbsp;hooks that we have already been using extensively.

In <a href="https://fullstackopen.com/en/part5/props_children_and_component_refs#references-to-components-with-ref" target="_blank" rel="noopener">part 5</a> we used <a href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">useRef</a> and <a href="https://react.dev/reference/react/useImperativeHandle" target="_blank" rel="noopener">useImperativeHandle</a>, which allowed a component to provide access to its functions to other components. In <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">part 6</a> we used <a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a> to implement a global state.

Within the last couple of years, hooks have become the standard way for libraries to expose their APIs. Throughout this course we have already seen several examples of this:&nbsp;<a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>&nbsp;provides&nbsp;<em>useStore</em>&nbsp;for accessing global state,&nbsp;<a href="https://reactrouter.com/" target="_blank" rel="noopener">React Router</a>&nbsp;exposes&nbsp;<em>useNavigate</em>&nbsp;and&nbsp;<em>useParams</em>&nbsp;for programmatic navigation and URL parameter access, and&nbsp;<a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">React Query</a>&nbsp;offers&nbsp;<em>useQuery</em>&nbsp;and&nbsp;<em>useMutation</em>&nbsp;for server state management.

As mentioned in <a href="https://fullstackopen.com//en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">part 1</a>, hooks are not normal functions, and when using these we have to adhere to certain <a href="https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks" target="_blank" rel="noopener">rules or limitations</a>. Let's recap the rules for using hooks, copied verbatim from the official React documentation:

<strong>Don’t call Hooks inside loops, conditions, or nested functions.</strong>&nbsp;Instead, always use Hooks at the top level of your React function.

<strong>You can only call Hooks while React is rendering a function component:</strong>
- Call them at the top level in the body of a function component.
- Call them at the top level in the body of a custom Hook.

There's an existing <a href="https://www.npmjs.com/package/eslint-plugin-react-hooks" target="_blank" rel="noopener">ESlint plugin</a> that can be used to verify that the application uses hooks correctly:

![صورة توضيحية](/images/mooc/6a88cc6b0ef7.webp)

Beyond the hooks we have already used, React provides several more built-in hooks that are worth knowing. In this section we look at two of them,&nbsp;<em>useMemo</em>&nbsp;and&nbsp;<em>useCallback</em>&nbsp;which are both concerned with performance optimisation. After that we move on to custom hooks, which let you package any combination of hooks into a reusable function of your own.

### useMemo

Every time a React component re-renders, the entire function body runs again. For most components this is fine, but occasionally a component performs an expensive computation, such as filtering a large list, sorting data, or deriving a complex value, and re-running it on every render wastes time.

<a href="https://react.dev/reference/react/useMemo" target="_blank" rel="noopener">useMemo</a> lets you cache the result of a calculation between renders. It accepts a function that performs the computation and a dependency array. React only re-runs the function when one of the dependencies changes, otherwise it returns the previously cached result.

Consider a component that renders a large list of items filtered by a search term:

```js
import { useState } from 'react'

const expensiveCalculation = () =&gt; {
  let sum = 0
  for (let i = 0; i &lt; 100000; i++) sum += i
  return sum
}

const ITEMS = Array.from({ length: 10000 }, (_, i) =&gt; `item ${i + 1}`)

const FilteredList = () =&gt; {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  console.log('filtering...')
  const filtered = ITEMS.filter(item =&gt; {
    expensiveCalculation()
    return item.includes(filter)
  })

  return (
    &lt;div style={{ background: darkMode ? '#333' : '#fff' }}&gt;
      &lt;input
        value={filter}
        onChange={e =&gt; setFilter(e.target.value)}
        placeholder="filter items"
      /&gt;
      &lt;button onClick={() =&gt; setDarkMode(!darkMode)}&gt;toggle dark mode&lt;/button&gt;
      &lt;ul&gt;
        {filtered.map(item =&gt; &lt;li key={item}&gt;{item}&lt;/li&gt;)}
      &lt;/ul&gt;
    &lt;/div&gt;
  )
}

export default FilteredList
```

The filtering of the list now takes time, partly thanks to our artificial slowdown.

The problem of the component is that clicking the dark mode button would re-filter all 10000 items even though the filter text has not changed.

We can fix this with&nbsp;<em>useMemo</em>:

```js
// BEGIN HIGHLIGHT
import { useState, useMemo } from 'react'
// END HIGHLIGHT

const FilteredList = () =&gt; {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  // BEGIN HIGHLIGHT
  const filtered = useMemo(() =&gt; {
  // END HIGHLIGHT
    console.log('filtering...')
    return ITEMS.filter(item =&gt; {
      expensiveCalculation()
      return item.includes(filter)
    })
  // BEGIN HIGHLIGHT
  }, [filter])
  // END HIGHLIGHT

  return (
    &lt;div style={{ background: darkMode ? '#333' : '#fff' }}&gt;
      //...
    &lt;/div&gt;
  )
}
```

With&nbsp;<em>useMemo</em>, the expensive filtering only runs when&nbsp;<em>filter</em>&nbsp;changes. Toggling dark mode only updates the background color, and the cached filtered list is returned immediately.

The dependency array works exactly like the one in&nbsp;<em>useEffect</em>: React compares each value to the previous render. If all values are identical, the memo is reused. If any value differs, the function is re-run and the result is cached for the next render.

<em>useMemo</em>&nbsp;can also be used to memoize objects and arrays passed as props, preventing unnecessary re-renders of child components that use reference equality. For example:

```js
const App = () =&gt; {
  const [filter, setFilter] = useState('')

  // Without useMemo, 'options' is a new object on every render even if filter hasn't changed
  // BEGIN HIGHLIGHT
  const options = useMemo(() =&gt; ({ caseSensitive: false, filter }), [filter])
  // END HIGHLIGHT

  return &lt;SearchResults options={options} /&gt;
}
```

<em>useMemo</em>&nbsp;is a performance optimisation, you should not reach for it by default.&nbsp;<a href="https://wiki.c2.com/?PrematureOptimization" target="_blank" rel="noopener">Premature memoisation</a>&nbsp;adds complexity without benefit when the computation is fast. Measure first, and only add&nbsp;<em>useMemo</em>&nbsp;when you have confirmed that a particular calculation is a bottleneck.

### React.memo

While&nbsp;<em>useMemo</em>&nbsp;caches the result of a calculation inside a component,&nbsp;<a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a>&nbsp;takes a different angle: it caches the rendered output of an entire component.&nbsp;<em>React.memo</em>&nbsp;is not a hook but a higher-order component, and we cover it here because it complements&nbsp;<em>useMemo</em>&nbsp;well. When a component is wrapped in&nbsp;<em>React.memo</em>, React skips re-rendering it if its props have not changed since the last render.

```js
const MyComponent = React.memo(({ value }) =&gt; {
  console.log('rendered')
  return &lt;div&gt;{value}&lt;/div&gt;
})
```

Without&nbsp;<em>React.memo</em>,&nbsp;<em>MyComponent</em>&nbsp;re-renders every time its parent renders, even if&nbsp;<em>value</em>&nbsp;is the same. With it, React compares the old and new props using shallow equality, and only re-renders when something has actually changed.

Note that&nbsp;<em>React.memo</em>&nbsp;only checks props. If the component uses a context value or its own state, it will still re-render when those change.

<em>React.memo</em>&nbsp;pairs naturally with&nbsp;<em>useMemo</em>&nbsp;that prevents expensive calculations from re-running, while&nbsp;<em>React.memo</em>&nbsp;prevents the component itself from re-rendering.

If a memoised component receives a new function or object reference on every render, the memoisation is defeated, which is where&nbsp;<em>useCallback</em>&nbsp;comes in.

### useCallback

Functions defined inside a component are recreated as new objects on every render. This is normally harmless, but it becomes a problem in two specific situations:
- A child component wrapped in <a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a> receives the function as a prop. Because the function is a new object each time, the child always sees a changed prop and re-renders anyway, defeating the purpose of memoisation.
- A function is listed as a dependency of <em>useEffect</em> or <em>useMemo</em>. A newly created function on every render means the effect or memo re-runs on every render.

<a href="https://react.dev/reference/react/useCallback" target="_blank" rel="noopener">useCallback</a>&nbsp;solves this by caching the function itself between renders, returning the same function object as long as its dependencies have not changed. It accepts a function and a dependency array, identical in structure to&nbsp;<em>useMemo</em>.

Here is a concrete example. We have a&nbsp;<em>NoteList</em>&nbsp;component that is expensive to render, so we wrap it in&nbsp;<em>React.memo</em>:

```js
// React.memo makes this component skip re-rendering if its props haven't changed
const NoteList = memo(({ onDelete, notes }) =&gt; {
  console.log('NoteList rendered')
  return (
    &lt;ul&gt;
      {notes.map(note =&gt; (
        &lt;li key={note.id}&gt;
          {note.content}
          &lt;button onClick={() =&gt; onDelete(note.id)}&gt;delete&lt;/button&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  )
})

const App = () =&gt; {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  const handleDelete = (id) =&gt; {
    setNotes(notes =&gt; notes.filter(note =&gt; note.id !== id))
  }

  const handleAdd = () =&gt; {
    setNotes(notes =&gt; [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }

  return (
    &lt;div&gt;
      &lt;input value={newNote} onChange={e =&gt; setNewNote(e.target.value)} /&gt;
      &lt;button onClick={handleAdd}&gt;add&lt;/button&gt;
      &lt;NoteList notes={notes} onDelete={handleDelete} /&gt;
    &lt;/div&gt;
  )
}
```

The problem here is that&nbsp;<em>handleDelete</em>&nbsp;is defined as a plain function inside&nbsp;<em>App</em>. Every time&nbsp;<em>App</em>&nbsp;re-renders (which happens on each keystroke into the note input), a brand new function object is created and passed to&nbsp;<em>NoteList</em>&nbsp;as the&nbsp;<em>onDelete</em>&nbsp;prop.

From <em>React.memo</em>'s perspective, the prop has changed, so <em>NoteList</em> re-renders even though the list itself is unchanged:

![صورة توضيحية](/images/mooc/ed3c70d1bf25.webp)

We can fix this with&nbsp;<em>useCallback</em>, which returns the same function object between renders as long as its dependencies have not changed:

```js
import { useState, useCallback, memo } from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

// BEGIN HIGHLIGHT
  const handleDelete = useCallback((id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }, []) // no external dependencies: this function never needs to change
// END HIGHLIGHT

  // ...
  return (
    // ...
  )
}
```

Now&nbsp;<em>handleDelete</em>&nbsp;is stable: React returns the exact same function object on every render, so&nbsp;<em>React.memo</em>&nbsp;sees no change in the&nbsp;<em>onDelete</em>&nbsp;prop and skips the re-render of&nbsp;<em>NoteList</em>&nbsp;entirely.

Like&nbsp;<em>useMemo</em>, reach for&nbsp;<em>useCallback</em>&nbsp;only when you have a concrete problem, such as a memoised child re-rendering unnecessarily or a&nbsp;<em>useEffect</em>&nbsp;running too often because of a function dependency. Adding it everywhere makes code harder to read without delivering a performance benefit.

### Custom hooks

React offers the option to create <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">custom</a> hooks. According to the documentation, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components:

> <em>Building your own Hooks lets you extract component logic into reusable functions.</em>

Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the <a href="https://fullstackopen.com//en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">rules of hooks</a>. Additionally, the name of custom hooks must start with the word <em>use</em>.

The key insight is that any stateful logic you find yourself duplicating across components is a candidate for extraction into a custom hook. Each call to the same hook creates an independent piece of state. This is what distinguishes a custom hook from a plain utility function.

We have already implemented several custom hooks in part 6. The hooks <em>useNotes</em> and <em>useNoteActions</em> were created in the <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-2" target="_blank" rel="noopener">Zustand</a> chapter, and <em>useCounter</em> was defined in the <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">React Query and Context</a> chapter.

#### Counter hook

We implemented a counter application in <a href="https://fullstackopen.com//en/part1/component_state_event_handlers#event-handling" target="_blank" rel="noopener">part 1</a> that can have its value incremented, decremented, or reset. The code of the application is as follows:

```js
import { useState } from 'react'

const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;div&gt;{counter}&lt;/div&gt;
      &lt;button onClick={() =&gt; setCounter(counter + 1)}&gt;
        plus
      &lt;/button&gt;
      &lt;button onClick={() =&gt; setCounter(counter - 1)}&gt;
        minus
      &lt;/button&gt;
      &lt;button onClick={() =&gt; setCounter(0)}&gt;
        zero
      &lt;/button&gt;
    &lt;/div&gt;
  )
}
```

Let's extract the counter logic into a custom hook. The code for the hook is as follows:

```js
const useCounter = () =&gt; {
  const [value, setValue] = useState(0)

  const increase = () =&gt; {
    setValue(value + 1)
  }

  const decrease = () =&gt; {
    setValue(value - 1)
  }

  const zero = () =&gt; {
    setValue(0)
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}
```

Our custom hook uses the&nbsp;<em>useState</em>&nbsp;hook internally to create its state. The hook returns an object, the properties of which include the value of the counter as well as functions for manipulating the value.

React components can use the hook as shown below:

```js
const App = () =&gt; {
  const counter = useCounter()

  return (
    &lt;div&gt;
      &lt;div&gt;{counter.value}&lt;/div&gt;
      &lt;button onClick={counter.increase}&gt;
        plus
      &lt;/button&gt;
      &lt;button onClick={counter.decrease}&gt;
        minus
      &lt;/button&gt;
      &lt;button onClick={counter.zero}&gt;
        zero
      &lt;/button&gt;
    &lt;/div&gt;
  )
}
```

By doing this we can extract the state of the&nbsp;<em>App</em>&nbsp;component and its manipulation entirely into the&nbsp;<em>useCounter</em>&nbsp;hook. Managing the counter state and logic is now the responsibility of the custom hook.

The same hook could be&nbsp;<em>reused</em>&nbsp;in the application that was keeping track of the number of clicks made to the left and right buttons:

```js
const App = () =&gt; {
  const left = useCounter()
  const right = useCounter()

  return (
    &lt;div&gt;
      {left.value}
      &lt;button onClick={left.increase}&gt;
        left
      &lt;/button&gt;
      &lt;button onClick={right.increase}&gt;
        right
      &lt;/button&gt;
      {right.value}
    &lt;/div&gt;
  )
}
```

The application creates&nbsp;<em>two</em>&nbsp;completely separate counters. The first one is assigned to the variable&nbsp;<em>left</em>&nbsp;and the other to the variable&nbsp;<em>right</em>. Each call to&nbsp;<em>useCounter</em>&nbsp;creates its own independent piece of state.

#### Custom hooks and component re-rendering

A natural question at this point is: when does a component that uses a custom hook actually re-render?

The answer is straightforward once you understand what a custom hook really is. A custom hook is not a separate entity from the component's perspective. It is just a piece of the component's own logic that has been moved into a separate function. This means that all the state and effects defined inside the hook belong to the component that calls the hook, not to the hook itself.

As a consequence, the re-rendering rules are exactly the same as with built-in hooks. The component re-renders when state managed inside the hook changes, when a context value the hook subscribes to changes, or when any hook the custom hook internally calls causes a re-render.

On the other hand, things like plain variables being reassigned inside the hook, or the arguments passed to the hook changing on their own do not cause a re-render.

Arguments deserve a closer look though. Passing a new value to a hook does not by itself schedule a re-render, but if the hook uses that argument as a dependency in a&nbsp;<em>useEffect</em>&nbsp;or&nbsp;<em>useMemo</em>, then a change in the argument will trigger the effect or memo to re-run, and if that in turn calls a state setter, the component will re-render.

A helpful way to think about it: imagine copy-pasting all the code from inside your custom hook directly into the component. The re-rendering behaviour would be identical. The hook is just a way to organise that code, not a boundary that React treats specially.

```js
const useCounter = () => {
// BEGIN HIGHLIGHT
  const [count, setCount] = useState(0) // this state belongs to the calling component
// END HIGHLIGHT
  return {
    count,
    increment: () => setCount(c => c + 1)
  }
}

const MyComponent = () => {
  const { count, increment } = useCounter()
// BEGIN HIGHLIGHT
  // re-renders whenever the count state inside the hook is updated
// END HIGHLIGHT
}
```

#### Form field hook

Dealing with forms in React is somewhat tricky. The following application presents the user with a form that requires them to input their name, birthday, and height:

```js
const App = () =&gt; {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    &lt;div&gt;
      &lt;form&gt;
        name:
        &lt;input
          type='text'
          value={name}
          onChange={(event) =&gt; setName(event.target.value)}
        /&gt;
        &lt;br/&gt;
        birthdate:
        &lt;input
          type='date'
          value={born}
          onChange={(event) =&gt; setBorn(event.target.value)}
        /&gt;
        &lt;br /&gt;
        height:
        &lt;input
          type='number'
          value={height}
          onChange={(event) =&gt; setHeight(event.target.value)}
        /&gt;
      &lt;/form&gt;
      &lt;div&gt;
        {name} {born} {height}
      &lt;/div&gt;
    &lt;/div&gt;
  )
}
```

Every field of the form has its own state. To keep the state of the form synchronized with the data provided by the user, we have to register an appropriate&nbsp;<em>onChange</em>&nbsp;handler for each of the&nbsp;<em>input</em>&nbsp;elements. The pattern is identical for every field, only the state variable name differs. This is exactly the kind of repetition that custom hooks are designed to eliminate.

Let's define our own custom&nbsp;<em>useField</em>&nbsp;hook that simplifies the state management of the form:

```js
const useField = (type) =&gt; {
  const [value, setValue] = useState('')

  const onChange = (event) =&gt; {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

The hook function receives the type of the input field as a parameter. It returns all of the attributes required by the&nbsp;<em>input</em>: its type, value and the onChange handler.

The hook can be used in the following way:

```js
const App = () =&gt; {
  const name = useField('text')
  // ...

  return (
    &lt;div&gt;
      &lt;form&gt;
        &lt;input
          type={name.type}
          value={name.value}
          onChange={name.onChange}
        /&gt;
        // ...
      &lt;/form&gt;
// ...
      &lt;div&gt;
        // BEGIN HIGHLIGHT
        {name.value} {born} {height}
        // END HIGHLIGHT
      &lt;/div&gt;
    &lt;/div&gt;
  )
}
```

### Spread attributes

We could simplify things a bit further. Since the&nbsp;<em>name</em>&nbsp;object has exactly all of the attributes that the&nbsp;<em>input</em>&nbsp;element expects to receive as props, we can pass the props to the element using the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener">spread syntax</a>&nbsp;in the following way:

```
&lt;input {...name} /&gt;
```

As the&nbsp;<a href="https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax" target="_blank" rel="noopener">example</a>&nbsp;in the React documentation states, the following two ways of passing props to a component achieve the exact same result:

```js
&lt;Greeting firstName='Arto' lastName='Hellas' /&gt;

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

&lt;Greeting {...person} /&gt;
```

The application gets simplified into the following format:

```js
const App = () =&gt; {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    &lt;div&gt;
      &lt;form&gt;
        name:
        &lt;input  {...name} /&gt;
        &lt;br/&gt;
        birthdate:
        &lt;input {...born} /&gt;
        &lt;br /&gt;
        height:
        &lt;input {...height} /&gt;
      &lt;/form&gt;
      &lt;div&gt;
        {name.value} {born.value} {height.value}
      &lt;/div&gt;
    &lt;/div&gt;
  )
}
```

Dealing with forms is greatly simplified when the unpleasant nitty-gritty details related to synchronizing the state of the form are encapsulated inside our custom hook.

#### Persisting state with a custom hook

Custom hooks can combine several built-in hooks to encapsulate more complex behaviour. A commonly needed feature is persisting state to&nbsp;<em>localStorage</em>&nbsp;so that it survives a page refresh. Here is a&nbsp;<em>useLocalStorage</em>&nbsp;hook that wraps&nbsp;<em>useState</em>&nbsp;and keeps the value in sync with localStorage:

```js
import { useState } from 'react'

const useLocalStorage = (key, initialValue) =&gt; {
  const [storedValue, setStoredValue] = useState(() =&gt; {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) =&gt; {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

The hook accepts a storage key and an initial value. On the first render it reads from localStorage, falling back to&nbsp;<em>initialValue</em>&nbsp;if nothing is stored yet. The returned setter updates both React state and localStorage at the same time.

A component using it looks exactly like one using plain&nbsp;<em>useState</em>:

```js
const App = () =&gt; {
  const [name, setName] = useLocalStorage('name', '')

  return (
    &lt;div&gt;
      &lt;input value={name} onChange={e =&gt; setName(e.target.value)} /&gt;
      &lt;p&gt;Hello, {name}! (your name is stored in localStorage)&lt;/p&gt;
    &lt;/div&gt;
  )
}
```

The component has no idea that localStorage is involved. That concern is entirely hidden inside the hook.

### More about hooks

Custom hooks are not only a tool for reusing code, they also provide a better way for dividing it into smaller modular parts.

The internet is starting to fill up with more and more helpful material related to hooks. The following sources are worth checking out:
- <a href="https://github.com/rehooks/awesome-react-hooks" target="_blank" rel="noopener">Awesome React Hooks Resources</a>
- <a href="https://usehooks.com/" target="_blank" rel="noopener">Easy to understand React Hook recipes by Gabe Ragland</a>

<div class="tasks">

**1. useField hook**

</div>

<div class="tasks">

**2. useField with reset**

</div>

<div class="tasks">

**3. Fixing the spread issue1**

</div>

<div class="tasks">

**4. useAnecdotes, step1**

</div>

<div class="tasks">

**5. useAnecdotes, step2**

</div>

<div class="tasks">

**6. useAnecdotes, step3**

</div>

<div class="tasks">

**7. Anecdotes checkup**

</div>
