---
part: 6
letter: d
title: "Chapter 4: React Query, Context API"
mainImage: /images/part-6.svg
lang: en
---
At the end of this part, we will look at a few more different ways to manage the state of an application.

Let's continue with the note application. We will focus on communication with the server. Let's start the application from scratch. The first version is as follows:

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return (
    &lt;div>
      &lt;h2>Notes app&lt;/h2>
      &lt;form onSubmit={addNote}>
        &lt;input name="note" />
        &lt;button type="submit">add&lt;/button>
      &lt;/form>
      {notes.map((note) => (
        &lt;li key={note.id}>
          {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
          &lt;button onClick={() => toggleImportance(note.id)}>
            {note.important ? 'make not important' : 'make important'}
          &lt;/button>
        &lt;/li>
      ))}
    &lt;/div>
  )
}

export default App
```

The initial code is on GitHub in this&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-0" target="_blank" rel="noopener">repository</a>, in the branch&nbsp;<em>part6-0</em>.

### Managing data on the server with the TanStack Query library

We shall now use the&nbsp;<a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">TanStack Query</a>&nbsp;library to store and manage data retrieved from the server.

Install the library with the command

```bash
npm install @tanstack/react-query
```

A few additions to the file&nbsp;<em>main.jsx</em>&nbsp;are needed to pass the library functions to the entire application:

```js
import { createRoot } from 'react-dom/client'
// BEGIN HIGHLIGHT
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// END HIGHLIGHT

import App from './App.jsx'

// BEGIN HIGHLIGHT
const queryClient = new QueryClient()
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  // BEGIN HIGHLIGHT
  &lt;QueryClientProvider client={queryClient}>
    &lt;App />
  &lt;/QueryClientProvider>
  // END HIGHLIGHT
)
```

Let's use&nbsp;<a href="https://github.com/typicode/json-server" target="_blank" rel="noopener">JSON Server</a>&nbsp;as in the previous parts to simulate the backend. JSON Server is preconfigured in the example project, and the project root contains a file&nbsp;<em>db.json</em>&nbsp;that by default has two notes. You can start the server with:

```bash
npm run server
```

We can now retrieve the notes in the&nbsp;<em>App</em>&nbsp;component. The code expands as follows:

```js

// BEGIN HIGHLIGHT
import { useQuery } from '@tanstack/react-query'
// END HIGHLIGHT

const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  // BEGIN HIGHLIGHT
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return await response.json()
    }
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isPending) {
    return &lt;div>loading data...&lt;/div>
  }

  const notes = result.data
  // END HIGHLIGHT

  return (
    // ...
  )
}
```

Fetching data from the server is done, as in the previous chapter, using the Fetch API's&nbsp;<em>fetch</em>&nbsp;function. However, the function call is now wrapped into a&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/queries" target="_blank" rel="noopener">query</a>&nbsp;formed by the&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">useQuery</a>&nbsp;function. The call to&nbsp;<em>useQuery</em>&nbsp;takes as its parameter an object with the fields&nbsp;<em>queryKey</em>&nbsp;and&nbsp;<em>queryFn</em>. The value of the&nbsp;<em>queryKey</em>&nbsp;field is an array containing the string&nbsp;<em>notes</em>. It acts as the&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/query-keys" target="_blank" rel="noopener">key</a>&nbsp;for the defined query, i.e. the list of notes.

The return value of the <em>useQuery</em> function is an object that indicates the status of the query. The output to the console illustrates the situation:

![صورة توضيحية](/images/mooc/6ad2aaf134fc.webp)

As we see, the first time the component is rendered, the query is still in pending state, i.e., the associated HTTP request is pending. At this stage, only the following is rendered:

```
&lt;div&gt;loading data...&lt;/div&gt;
```

However, the HTTP request is completed so quickly that it is impossible to to see the text. When the request is completed, the component is rendered again. The query is in the state <em>success</em> on the second rendering, and the field <em>data</em> of the query object contains the data returned by the request, i.e., the list of notes that is rendered on the screen.

So the application retrieves data from the server and renders it on the screen without using the React hooks&nbsp;<em>useState</em>&nbsp;and&nbsp;<em>useEffect</em>&nbsp;used in chapters 2-5 at all. The data on the server is now entirely under the administration of the TanStack Query library, and the application does not need the state defined with React's&nbsp;<em>useState</em>&nbsp;hook at all!

Let's move the function making the actual HTTP request to its own file&nbsp;<em>src/requests.js</em>

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () =&gt; {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
```

The&nbsp;<em>App</em>&nbsp;component is now slightly simplified:

```js
import { useQuery } from '@tanstack/react-query'
// BEGIN HIGHLIGHT
import { getNotes } from './requests'
// END HIGHLIGHT

const App = () => {
  // ...

  const result = useQuery({
    queryKey: ['notes'],
    // BEGIN HIGHLIGHT
    queryFn: getNotes
    // END HIGHLIGHT
  })

  // ...
}
```

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-1" target="_blank" rel="noopener">GitHub</a>&nbsp;in the branch&nbsp;<em>part6-1</em>.

### Synchronizing data to the server using TanStack Query

Data is already successfully retrieved from the server. Next, we will make sure that the added and modified data is stored on the server. Let's start by adding new notes.

Let's make a function&nbsp;<em>createNote</em>&nbsp;to the file&nbsp;<em>requests.js</em>&nbsp;for saving new notes:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

// BEGIN HIGHLIGHT
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
// END HIGHLIGHT
```

The&nbsp;<em>App</em>&nbsp;component will change as follows

```js
// BEGIN HIGHLIGHT
import { useQuery, useMutation } from '@tanstack/react-query'
import { getNotes, createNote } from './requests'
// END HIGHLIGHT

const App = () => {
  // BEGIN HIGHLIGHT
  const newNoteMutation = useMutation({
    mutationFn: createNote,
  })
  // END HIGHLIGHT

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    // BEGIN HIGHLIGHT
    newNoteMutation.mutate({ content, important: true })
    // END HIGHLIGHT
  }

  //

}
```

To create a new note, a&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/mutations" target="_blank" rel="noopener">mutation</a>&nbsp;is defined using the function&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useMutation" target="_blank" rel="noopener">useMutation</a>:

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
})
```

The parameter is the function we added to the file&nbsp;<em>requests.js</em>, which uses Fetch API to send a new note to the server.

The event handler&nbsp;<em>addNote</em>&nbsp;performs the mutation by calling the mutation object's function&nbsp;<em>mutate</em>&nbsp;and passing the new note as an argument:

```
newNoteMutation.mutate({ content, important: true })
```

Our solution is good. Except it doesn't work. The new note is saved on the server, but it is not updated on the screen.

In order to render a new note as well, we need to tell TanStack Query that the old result of the query whose key is the string&nbsp;<em>notes</em>&nbsp;should be&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations" target="_blank" rel="noopener">invalidated</a>.

Fortunately, invalidation is easy, it can be done by defining the appropriate&nbsp;<em>onSuccess</em>&nbsp;callback function to the mutation:

```js
// BEGIN HIGHLIGHT
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// END HIGHLIGHT
import { getNotes, createNote } from './requests'

const App = () => {
  // BEGIN HIGHLIGHT
  const queryClient = useQueryClient()
  // END HIGHLIGHT

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // BEGIN HIGHLIGHT
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
    // END HIGHLIGHT
  })

  // ...
}
```

Now that the mutation has been successfully executed, a function call is made to

```
queryClient.invalidateQueries({ queryKey: ['notes'] })
```

This in turn causes TanStack Query to automatically update a query with the key&nbsp;<em>notes</em>, i.e. fetch the notes from the server. As a result, the application renders the up-to-date state on the server, i.e. the added note is also rendered.

Let us also implement the change in the importance of notes. A function for updating notes is added to the file&nbsp;<em>requests.js</em>:

```js
export const updateNote = async (updatedNote) =&gt; {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}
```

Updating the note is also done by mutation. The&nbsp;<em>App</em>&nbsp;component expands as follows:

```js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// BEGIN HIGHLIGHT
import { getNotes, createNote, updateNote } from './requests'
// END HIGHLIGHT

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  // BEGIN HIGHLIGHT
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
  // END HIGHLIGHT

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    // BEGIN HIGHLIGHT
    updateNoteMutation.mutate({...note, important: !note.important })
    // END HIGHLIGHT
  }

  // ...
}
```

So again, the mutation we created invalidates the notes query so that the updated note is rendered correctly. Using mutations is easy, the function&nbsp;<em>mutate</em>&nbsp;receives a note as a parameter, the importance of which has been changed to the negation of the old value.

The current code for the application is on&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-2" target="_blank" rel="noopener">GitHub</a>&nbsp;in the branch&nbsp;<em>part6-2</em>.

### Optimizing the performance

The application works well, and the code is relatively simple. The ease of making changes to the list of notes is particularly surprising. For example, when we change the importance of a note, invalidating the query&nbsp;<em>notes</em>&nbsp;is enough for the application data to be updated:

```js
const updateNoteMutation = useMutation({
  mutationFn: updateNote,
  onSuccess: () =&gt; {
    queryClient.invalidateQueries({ queryKey: ['notes'] })  }
})
```

The consequence of this, of course, is that after the PUT request that causes the note change, the application makes a new GET request to retrieve the query data from the server:

![صورة توضيحية](/images/mooc/89ca92bbd4ce.webp)

If the amount of data retrieved by the application is not large, it doesn't really matter. After all, from a browser-side functionality point of view, making an extra HTTP GET request doesn't really matter, but in some situations it might put a strain on the server.

If necessary, it is also possible to optimize performance&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses" target="_blank" rel="noopener">by manually updating</a>&nbsp;the query state maintained by TanStack Query.

The change for the mutation adding a new note is as follows:

```js
const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // BEGIN HIGHLIGHT
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    // END HIGHLIGHT
    }
  })

  // ...
}
```

That is, in the&nbsp;<em>onSuccess</em>&nbsp;callback, the&nbsp;<em>queryClient</em>&nbsp;object first reads the existing&nbsp;<em>notes</em>&nbsp;state of the query and updates it by adding a new note, which is obtained as a parameter of the callback function. The value of the parameter is the value returned by the function&nbsp;<em>createNote</em>, defined in the file&nbsp;<em>requests.js</em>&nbsp;as follows:

```js
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  // BEGIN HIGHLIGHT
  return await response.json()
  // END HIGHLIGHT
}
```

It would be relatively easy to make a similar change to a mutation that changes the importance of the note, but we leave it as an optional exercise.

Finally, note an interesting detail. TanStack Query refetches all notes when we switch to another browser tab and then return to the application's tab. This can be observed in the Network tab of the Developer Console:

![صورة توضيحية](/images/mooc/28ae0e462fe2.webp)

What is going on? By reading the&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">documentation</a>, we notice that the default functionality of TanStack Query's queries is that the queries (whose status is&nbsp;<em>stale</em>) are updated when&nbsp;<em>window focus</em>&nbsp;changes. If we want, we can turn off the functionality by creating a query as follows:

```js
const App = () => {
  // ...
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    // BEGIN HIGHLIGHT
    refetchOnWindowFocus: false
    // END HIGHLIGHT
  })

  // ...
}
```

If you put a console.log statement to the code, you can see from browser console how often TanStack Query causes the application to be re-rendered. The rule of thumb is that rerendering happens at least whenever there is a need for it, i.e. when the state of the query changes. You can read more about it e.g.&nbsp;<a href="https://tkdodo.eu/blog/react-query-render-optimizations" target="_blank" rel="noopener">here</a>.

### useNotes custom hook

Our solution is fairly good, but somewhat bothersome is the fact that many TanStack Query implementation details have been placed directly inside the React component. Let's extract these into their own custom hook function:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from '../requests'

export const useNotes = () =&gt; {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) =&gt; {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () =&gt; {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  return {
    notes: result.data,
    isPending: result.isPending,
    addNote: (content) =&gt; newNoteMutation.mutate({ content, important: true }),
    toggleImportance: (note) =&gt; updateNoteMutation.mutate({
      ...note, important: !note.important
    }),
  }
}
```

The hook function encapsulates all TanStack Query related code: the query for fetching notes and both mutations for creating and updating notes. These implementation details are hidden from the hook's user, as the function returns a simple object containing
- <em>notes</em>: the list of notes
- <em>isPending</em>: whether the data is still loading
- <em>addNote</em>: a function for adding a new note with just a content string
- <em>toggleImportance</em>: a function for toggling the importance of a note

The&nbsp;<em>App</em>&nbsp;component is simplified considerably:

```js
import { useNotes } from './hooks/useNotes'

const App = () =&gt; {
  const { notes, isPending, addNote: addNoteToServer, toggleImportance } = useNotes()

  const addNote = async (event) =&gt; {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    addNoteToServer(content)
  }

  if (isPending) {
    return &lt;div&gt;loading data...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      &lt;h2&gt;Notes app&lt;/h2&gt;
      &lt;form onSubmit={addNote}&gt;
        &lt;input name="note" /&gt;
        &lt;button type="submit"&gt;add&lt;/button&gt;
      &lt;/form&gt;
      {notes.map((note) =&gt; (
        &lt;li key={note.id}&gt;
          {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
          &lt;button onClick={() =&gt; toggleImportance(note)}&gt;
            {note.important ? 'make not important' : 'make important'}
          &lt;/button&gt;
        &lt;/li&gt;
      ))}
    &lt;/div&gt;
  )
}
```

The code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-3" target="_blank" rel="noopener">GitHub</a>&nbsp;in the branch&nbsp;<em>part6-3</em>.

TanStack Query is a versatile library that, based on what we have already seen, simplifies the application. Does TanStack Query make more complex state management solutions such as Zustand unnecessary? No. TanStack Query can partially replace the state of the application in some cases, but as the&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state" target="_blank" rel="noopener">documentation</a>&nbsp;states
- TanStack Query is a <em>server-state library</em>, responsible for managing asynchronous operations between your server and client
- Zustand, etc. are <em>client-state libraries</em> that can be used to store asynchronous data, albeit inefficiently when compared to a tool like TanStack Query

So TanStack Query is a library that maintains the&nbsp;<em>server state</em>&nbsp;in the frontend, i.e. acts as a cache for what is stored on the server. TanStack Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.

Most React applications need not only a way to temporarily store the served data, but also some solution for how the rest of the frontend state (e.g. the state of forms or notifications) is handled.

<div class="tasks">

**19. Query Anecdotes, step1**

</div>

<div class="tasks">

**20. Query Anecdotes, step2**

</div>

<div class="tasks">

**21. Query Anecdotes, step3**

</div>

<div class="tasks">

**22. Query Anecdotes, step4**

</div>

<div class="tasks">

**23. Query Anecdotes, checkup**

</div>

### Context API

Let's return to the good old counter application. The application is defined as follows:

```js
import { useState } from 'react'
import Display from './components/Display'
import Controls from './components/Controls'

const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;Display counter={counter} /&gt;
      &lt;Controls counter={counter} setCounter={setCounter} /&gt;
    &lt;/div&gt;
  )
}
```

The&nbsp;<em>App</em>&nbsp;component defines the application state and passes it to the&nbsp;<em>Display</em>&nbsp;component, which renders the counter value:

```js
const Display = ({ counter }) =&gt; {

  return (
    &lt;div&gt;{counter}&lt;/div&gt;
  )
}
```

and to the&nbsp;<em>Controls</em>&nbsp;component, which renders the buttons:

```js
const Controls = ({ counter, setCounter }) =&gt; {
  const increment = () =&gt; setCounter(counter + 1)
  const decrement = () =&gt; setCounter(counter - 1)
  const zero = () =&gt; setCounter(0)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

The application grows:

![صورة توضيحية](/images/mooc/1d93cd0e222b.webp)

The role of the&nbsp;<em>App</em>&nbsp;component changes: it still holds the application state, but it no longer renders the components using the counter state directly:

```js
const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;Navbar /&gt;
      &lt;Panel counter={counter} setCounter={setCounter} /&gt;
      &lt;Footer /&gt;
    &lt;/div&gt;
  )
}
```

The new&nbsp;<em>Panel</em>&nbsp;component is responsible for rendering the components that display the counter and the buttons:

```js
import Display from './Display'
import Controls from './Controls'

const Panel = ({ counter, setCounter }) =&gt; {
  return (
    &lt;div&gt;
      &lt;Display counter={counter} /&gt;
      &lt;Controls counter={counter} setCounter={setCounter} /&gt;
    &lt;/div&gt;
  )
}
```

The component hierarchy of the application is as follows:

```
App (state)
 ├── Panel
 │    ├── Display
 │    └── Controls
 └── Footer
```

The application state is still in the <em>App</em> component. To allow <em>Display</em> and <em>Controls</em> to access the counter state, the state and its update function must be passed as props through the <em>Panel</em> component, even though <em>Panel</em> itself doesn't need them. This kind of situation arises easily when using state created with the <em>useState</em> hook. This phenomenon is called <a href="https://kentcdodds.com/blog/prop-drilling" target="_blank" rel="noopener">prop drilling</a>.

React's built-in <a href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">Context API</a> offers one solution to this problem. A React context is a kind of global state for the application, allowing any component to be given direct access to it.

Let's now create a context in the application that stores the counter state management.

A context is created using React's <a href="https://react.dev/reference/react/createContext" target="_blank" rel="noopener">createContext</a> function. Let's create the context in a file <em>src/CounterContext.jsx</em>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

The&nbsp;<em>App</em>&nbsp;component can now&nbsp;<em>provide</em>&nbsp;the context to its child components as follows:

```js
import CounterContext from './components/CounterContext'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    // BEGIN HIGHLIGHT
    &lt;CounterContext.Provider value={{counter, setCounter}}>
      &lt;Panel />
      &lt;Footer />
    &lt;/CounterContext.Provider>
    // END HIGHLIGHT
  )
}
```

Providing the context is done by wrapping the child components inside the&nbsp;<em>CounterContext.Provider</em>&nbsp;component and setting an appropriate value for the context.

The context value is now an object with the attributes&nbsp;<em>counter</em>&nbsp;and&nbsp;<em>setCounter</em>, i.e. the counter state and the function that updates it.

Note that the&nbsp;<em>Panel</em>&nbsp;component no longer receives any counter-related props, so it simplifies to:

```js
const Panel = () =&gt; {
  return (
    &lt;div&gt;
      &lt;Display /&gt;
      &lt;Controls /&gt;
    &lt;/div&gt;
  )
}
```

Other components can now access the context using the&nbsp;<a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a>&nbsp;hook. The&nbsp;<em>Display</em>&nbsp;component changes as follows:

```js
// BEGIN HIGHLIGHT
import { useContext } from 'react'
import CounterContext from './CounterContext'

const Display = () => {
  const { counter } = useContext(CounterContext)
  // END HIGHLIGHT

  return &lt;div>{counter}&lt;/div>
}
```

The&nbsp;<em>Display</em>&nbsp;component no longer needs any props. It gets the counter value by calling the&nbsp;<em>useContext</em>&nbsp;hook with the&nbsp;<em>CounterContext</em>&nbsp;object as its parameter.

Similarly, the&nbsp;<em>Controls</em>&nbsp;component changes to:

```js
// BEGIN HIGHLIGHT
import { useContext } from 'react'
import CounterContext from './CounterContext'

const Controls = () => {
  const { counter, setCounter } = useContext(CounterContext)
  // END HIGHLIGHT

  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

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

The components now have access to the content set by the context provider, the counter state and its update function.

The components extract the attributes they need using JavaScript's destructuring syntax:

```js
const { counter } = useContext(CounterContext)
```

### Defining the counter context in its own file

Our application still has the unpleasant feature that the counter state management functionality is defined inside the&nbsp;<em>App</em>&nbsp;component. Let's move all counter-related code to the file&nbsp;<em>CounterContext.jsx</em>:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

// BEGIN HIGHLIGHT
export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

  return (
    &lt;CounterContext.Provider value={{ counter, setCounter }}>
      {props.children}
    &lt;/CounterContext.Provider>
  )
}
// END HIGHLIGHT
```

The file now exports both the&nbsp;<em>CounterContext</em>&nbsp;object and the&nbsp;<em>CounterContextProvider</em>&nbsp;component, which is essentially a context provider whose value contains the counter and its update function.

Let's use the context provider directly in the file&nbsp;<em>main.jsx</em>:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
// BEGIN HIGHLIGHT
import { CounterContextProvider } from './CounterContext'
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  // BEGIN HIGHLIGHT
  &lt;CounterContextProvider>
    &lt;App />
  &lt;/CounterContextProvider>
  // END HIGHLIGHT
)
```

Now the context that defines the counter value and functionality is available to&nbsp;<em>all</em>&nbsp;components in the application.

The&nbsp;<em>App</em>&nbsp;component simplifies to:

```js
import Panel from './components/Panel'
import Footer from './components/Footer'

const App = () =&gt; {

  return (
    &lt;div&gt;
      &lt;Navbar /&gt;
      &lt;Panel /&gt;
      &lt;Footer /&gt;
  &lt;/div&gt;
  )
}

export default App
```

The context is still used in the same way, and no changes are needed to the other components. For example,&nbsp;<em>Controls</em>&nbsp;remains:

```js
const Controls = () =&gt; {
  const { counter, setCounter } = useContext(CounterContext)
  const increment = () =&gt; setCounter(counter + 1)
  const decrement = () =&gt; setCounter(counter - 1)
  const zero = () =&gt; setCounter(0)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

The solution is quite good. The entire application state, that is, the counter value, is now isolated in the&nbsp;<em>CounterContext</em>&nbsp;file. Components access exactly the part of the context they need using the&nbsp;<em>useContext</em>&nbsp;hook and JavaScript's destructuring syntax.

Let's make one small improvement and also define the counter update functions&nbsp;<em>increment</em>,&nbsp;<em>decrement</em>, and&nbsp;<em>zero</em>&nbsp;in the context:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

// BEGIN HIGHLIGHT
  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)
// END HIGHLIGHT

  return (
    // BEGIN HIGHLIGHT
    &lt;CounterContext.Provider value={{ counter, increment, decrement, zero }}>
    // END HIGHLIGHT
      {props.children}
    &lt;/CounterContext.Provider>
  )
}
```

Now we can use the functions obtained from the context directly as button event handlers:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Controls = () => {
  // BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useContext(CounterContext)
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

There is still room for one more improvement. If we look at how the counter context is used, we notice that the same boilerplate appears in both components that consume it:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Display = () => {
  // BEGIN HIGHLIGHT
  const { counter } = useContext(CounterContext)
  // END HIGHLIGHT
  // ...
}
```

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Controls = () => {
  // BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useContext(CounterContext)
  // END HIGHLIGHT
  // ...
}
```

We can take the solution one step further by creating a custom hook that returns the context directly. Let's add it to the file&nbsp;<em>hooks/useCounter.js</em>:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const useCounter = () =&gt; useContext(CounterContext)

export default useCounter
```

Using the context is now one step simpler:

```js
import useCounter from '../hooks/useCounter'

const Display = () => {
  const { counter } = useCounter()
  // ...
}

import useCounter from '../hooks/useCounter'

const Controls = () => {
  const { increment, decrement, zero } = useCounter()
  // ...
}
```

We are satisfied with the solution. It isolates all state management entirely within the context. The components that use the state have no knowledge of how the state is implemented.  Thanks to the custom hook, they are not even really aware that the solution is based on the Context API.

The application code is in the GitHub repository <a href="https://github.com/fullstack-hy2020/context-counter" target="_blank" rel="noopener">https://github.com/fullstack-hy2020/context-counter</a>.

<div class="tasks">

**24. Query anecdotes, step5**

</div>

<div class="tasks">

**25. Query anecdotes, step6**

</div>

<div class="tasks">

**26. Query anecdotes, step7**

</div>

<div class="tasks">

**27. Query anecdotes, final check**

</div>

<div class="tasks">

**28. Your GitHub repository**

</div>

### Which state management solution to choose?

In chapters 1-5, all state management in the application was handled using React's&nbsp;<em>useState</em>&nbsp;hook. Asynchronous calls to the backend required the use of the&nbsp;<em>useEffect</em>&nbsp;hook in some situations. In principle, nothing else is needed.

A subtle issue with solutions based on state created with the&nbsp;<em>useState</em>&nbsp;hook is that if some part of the application state is needed by multiple components, the state and the functions for manipulating it must be passed via props to all components that handle that state. Sometimes props need to be passed through multiple components, and the components along the way may not even be interested in the state in any way. This somewhat unpleasant phenomenon is called&nbsp;<em>prop drilling</em>.

Over the years, several alternative solutions have been developed for state management in React applications, which can be used to ease problematic situations such as prop drilling. However, no solution has been "final" — all have their own pros and cons, and new solutions are being developed all the time.

The situation may confuse a beginner and even an experienced web developer. Which solution should be used?

For a simple application,&nbsp;<em>useState</em>&nbsp;is certainly a good starting point. If the application communicates with a server, the communication can be handled in the same way as in chapters 1-5, using the application's own state. Recently, however, it has become more common to move the communication and associated state management at least partially under the control of TanStack Query (or some other similar library). If you are concerned about useState and the prop drilling it entails, using context may be a good option. There are also situations where it may make sense to handle some of the state with useState and some with contexts.

For a long time, the most popular and comprehensive state management solution has been Redux, which is a way to implement the so-called&nbsp;<a href="https://facebookarchive.github.io/flux/" target="_blank" rel="noopener">Flux</a>&nbsp;architecture. Redux is, however, known for its complexity and abundance of boilerplate code, which has been the motivation for newer state management solutions. In this course material, Redux has been replaced by the&nbsp;<a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>&nbsp;library, which provides equivalent functionality with a considerably simpler API. Zustand has become a popular choice especially when you need more than what useState offers, but the full Redux machinery feels excessive. Some of the criticism directed at Redux's rigidity has become outdated thanks to the&nbsp;<a href="https://redux-toolkit.js.org/" target="_blank" rel="noopener">Redux Toolkit</a>, and Redux is still widely used, especially in larger projects.

Neither Zustand nor Redux has to be used throughout the entire application. It may make sense, for example, to manage form state outside of them, especially in situations where the form state does not affect the rest of the application. Using Zustand or Redux together with TanStack Query in the same application is also perfectly possible.

The question of which state management solution to use is not at all straightforward. It is impossible to give a single correct answer, and it is also likely that the chosen solution may turn out to be suboptimal as the application grows, requiring the approach to be changed even if the application has already been put into production.
