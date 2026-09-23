---
part: 6
letter: c
title: "Chapter 3: Complex state, fetch, testing"
mainImage: /images/part-6.svg
lang: en
---
Let's continue extending the Zustand version of the notes application.

To make development easier, we'll change the initial state so that it already contains a few notes:

```js
// BEGIN HIGHLIGHT
const initialNotes = [
    {
      id: 1,
      content: 'Zustand is less complex than Redux',
      important: true,
    }, {
      id: 2,
      content: 'React app benefits from custom hooks',
      important: false,
    }, {
      id: 3,
      content: 'Remember to sleep well',
      important: true,
    }
  ]
// END HIGHLIGHT

const useNoteStore = create((set) => ({
  notes: initialNotes,
  // ...
}
```

### More complex state

Let's implement filtering of the notes displayed in the application, allowing the visible notes to be restricted. The filter is implemented using <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio" target="_blank" rel="noopener">radio buttons</a>:

![صورة توضيحية](/images/mooc/1522797f18a8.webp)

The question arises of how best to handle the filter's state management. There are essentially two options: create a separate Zustand store for the filter, or add it to the existing store. Both solutions are justifiable. The <a href="https://tkdodo.eu/blog/working-with-zustand#keep-the-scope-of-your-store-small" target="_blank" rel="noopener">best practices</a> found online recommend keeping completely <em>unrelated things in separate stores</em>. However, the list of notes and filtering are closely enough related that we will place both in the same store:

```js
const useNoteStore = create((set) => ({
  notes: initialNotes,
  // BEGIN HIGHLIGHT
  filter: 'all',
  // END HIGHLIGHT
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    ),
    toggleImportance: id => set(
      state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    ),
  // BEGIN HIGHLIGHT
    setFilter: value => set(() => ({ filter: value }))
  // END HIGHLIGHT
  }
}))

export const useNotes = () => useNoteStore((state) => state.notes)
// BEGIN HIGHLIGHT
export const useFilter = () => useNoteStore((state) => state.filter)
// END HIGHLIGHT
export const useNoteActions = () => useNoteStore((state) => state.actions)
```

The component that sets the filter value:

```js
import { useNoteActions } from './store'

const VisibilityFilter = () =&gt; {
  const { setFilter } = useNoteActions()

  return (
    &lt;div&gt;
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('all')}
        defaultChecked
      /&gt;
      all
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('important')}
      /&gt;
      important
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('nonimportant')}
      /&gt;
      not important
    &lt;/div&gt;
  )
}

export default VisibilityFilter
```

The&nbsp;<em>App</em>&nbsp;component renders the filter:

```js
const App = () => (
  &lt;div>
    &lt;NoteForm />
  // BEGIN HIGHLIGHT
    &lt;VisibilityFilter />
  // END HIGHLIGHT
    &lt;NoteList />
  &lt;/div>
)
```

The filtering of the displayed notes could be handled in the&nbsp;<em>NoteList</em>&nbsp;component, for example as follows:

```js
import { useNotes, useFilter } from './store'
import Note from './Note'

const NoteList = () => {
  const notes = useNotes()

  // BEGIN HIGHLIGHT
  const filter = useFilter()

  const notesToShow = notes.filter(note => {
    if (filter === 'important') return note.important
    if (filter === 'nonimportant') return !note.important
    return true
  })
  // END HIGHLIGHT

  return (
    &lt;ul>
      // BEGIN HIGHLIGHT
      {notesToShow.map(note => (
      // END HIGHLIGHT
        &lt;Note key={note.id} note={note} />
      ))}
    &lt;/ul>
  )
}
```

A more elegant solution is to include the filtering logic directly in the store's <em>useNotes</em> function:

```js
import { create } from 'zustand'

const useNoteStore = create((set) => ({
  // ...
}))

// BEGIN HIGHLIGHT
export const useNotes = () => {
  const notes = useNoteStore((state) => state.notes)
  const filter = useNoteStore((state) => state.filter)

  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)

  return notes
}
// END HIGHLIGHT
```

The function&nbsp;<em>useNotes</em>&nbsp;thus always returns a list of notes filtered in the desired way. The consumer of the function, the&nbsp;<em>NoteList</em>&nbsp;component, doesn't even need to be aware of the filter's existence:

```js
import { useNotes } from './store'
import Note from './Note'

const NoteList = () =&gt; {
  // component gets always the properly filtered set of notes
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

The solution is elegant!

> A possible alternative solution
>
> An alternative would be to implement filtering directly inside the selector function, so that both the notes and the filter are read in a single <em>useNoteStore</em> call:
>
> export const useNotes = () => useNoteStore(({ notes, filter }) => {
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
>
>   return notes
})
>
> This approach does not work, however, as it leads to an infinite re-rendering loop when the filter is changed.
>
> The reason is as follows: Zustand compares the selector's return value using the&nbsp;<em>===</em>&nbsp;operator. Since&nbsp;<em>notes.filter(...)</em>&nbsp;creates a new array on every render, React always interprets it as a new state and triggers another render, which again creates a new array, and so on.
>
> The fix is to add&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/hooks/use-shallow" target="_blank" rel="noopener">useShallow</a>, which replaces the&nbsp;<em>===</em>&nbsp;comparison with a shallow comparison: it compares the array elements one by one. If the content has not changed, it returns the old array reference instead of a new one, so React sees the state as stable and does not re-render.
>
> import { useShallow } from 'zustand/react/shallow'
>
> //...
>
> export const useNotes = () => useNoteStore(useShallow(({ notes, filter }) => {
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
>
>   return notes
}))
>
> The solution works, but it is slightly harder to understand. In the course material we use the earlier-presented version with two separate&nbsp;<em>useNoteStore</em>&nbsp;calls.

The current code of the application is available in its entirety on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-3" target="_blank" rel="noopener">GitHub</a>, in the branch&nbsp;<em>part6-3</em>.

<div class="tasks">

**7. Anecdotes, step5**

</div>

### Data to the server

Let's extend the application so that notes are stored in a backend. We'll use the&nbsp;<a href="https://fullstackopen.com/en/part2/getting_data_from_server" target="_blank" rel="noopener">JSON Server</a>&nbsp;familiar from Part 2.

Save the initial state of the database to the file&nbsp;<em>db.json</em>&nbsp;at the root of the project:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "Zustand is less complex than Redux",
      "important": true
    },
    {
      "id": 2,
      "content": "React app benefits from custom hooks",
      "important": false
    },
    {
      "id": 3,
      "content": "Remember to sleep well",
      "important": true
    }
  ]
}
```

Install JSON Server:

```bash
npm install json-server --save-dev
```

and add the following line to the&nbsp;<em>scripts</em>&nbsp;section of&nbsp;<em>package.json</em>:

```
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

Start JSON Server with the command&nbsp;<em>npm run server</em>.

### Fetch API

In software development, one often has to consider whether to implement a certain feature using an external library or to take advantage of the native solutions provided by the environment. Both approaches have their own advantages and challenges.

In earlier parts of this course we have used the&nbsp;<a href="https://axios-http.com/docs/intro" target="_blank" rel="noopener">Axios</a>&nbsp;library for making HTTP requests. Let's now get familiar with an alternative way to make HTTP requests using the native&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener">Fetch API</a>.

It is typical that an external library like&nbsp;<em>Axios</em>&nbsp;is implemented using other external libraries. For example, if you install Axios in a project with the command&nbsp;<em>npm install axios</em>, the console output is:

```
$ npm install axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

So the command would install not only the Axios library but over 20 other npm packages that Axios requires to work.

The&nbsp;<em>Fetch API</em>&nbsp;offers a similar way to make HTTP requests as Axios, but using the Fetch API does not require installing external libraries. Application maintenance becomes easier when there are fewer libraries to update, and security also improves since the potential attack surface of the application is reduced. Application security and maintenance are touched upon in&nbsp;<a href="https://fullstackopen.com/en/part7/class_components_miscellaneous#security-in-react-and-node-applications" target="_blank" rel="noopener">Part 7</a>&nbsp;of the course.

Making requests is done in practice by using the&nbsp;<em>fetch()</em>&nbsp;function. The syntax used has some differences compared to Axios. We'll also soon notice that Axios took care of some things for us and made our lives easier. We'll use the Fetch API now, however, because it is a widely-used native solution that every Full Stack developer should be familiar with.

### Fetching data from the server

Let's create a function that fetches data from the backend in the file&nbsp;<em>src/services/notes.js</em>:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () =&gt; {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}

export default { getAll }
```

Let's look more closely at the implementation of the&nbsp;<em>getAll</em>&nbsp;function. The notes are now fetched from the backend by calling the&nbsp;<em>fetch()</em>&nbsp;function, which has been given the backend URL as an argument. The request type is not separately specified, so&nbsp;<em>fetch</em>&nbsp;performs the default action, which is a GET request.

When the response has arrived, we check whether the request succeeded by looking at the&nbsp;<em>response.ok</em>&nbsp;field and throw an error if necessary:

```
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

The attribute&nbsp;<em>response.ok</em>&nbsp;gets the value&nbsp;<em>true</em>&nbsp;if the request succeeded, i.e., if the response status code is in the range 200-299. For all other status codes, such as 404 or 500, it gets the value&nbsp;<em>false</em>.

Note that&nbsp;<em>fetch</em>&nbsp;does not automatically throw an error even if the response status code is, for example, 404. Error handling must be implemented manually, as we have done now.

If the request succeeded, the data contained in the response is converted to JSON format:

```js
const data = await response.json()
```

<em>fetch</em>&nbsp;does not automatically convert the data that may accompany the response to JSON format; the conversion must be done manually. It is also worth noting that&nbsp;<em>response.json()</em>&nbsp;is an asynchronous function, so the&nbsp;<em>await</em>&nbsp;keyword must be used with it.

Let's simplify the code a bit by returning the data returned by the&nbsp;<em>response.json()</em>&nbsp;function directly:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  // BEGIN HIGHLIGHT
  return await response.json()
  // END HIGHLIGHT
}
```

Let's add a function to the store that can be used to initialize the state with notes fetched from the server:

```js
const useNoteStore = create((set) => ({
  // BEGIN HIGHLIGHT
  notes: [],
  // END HIGHLIGHT
  filter: '',
  actions: {
    // ...
    setFilter: value => set(() => ({ filter: value })),
  // BEGIN HIGHLIGHT
    initialize: notes => set(() => ({ notes }))
  // END HIGHLIGHT
  }
}))
```

Let's implement the initialization of notes in the <em>App</em> component. As usual when fetching data from a server, we use the <em>useEffect</em> hook:

```js
const App = () => {
  const { initialize } = useNoteActions()

 // BEGIN HIGHLIGHT
  useEffect(() => {
    noteService.getAll().then(notes => initialize(notes))
  }, [initialize])
 // END HIGHLIGHT

  return (
    &lt;div>
      &lt;NoteForm />
      &lt;VisibilityFilter />
      &lt;NoteList />
    &lt;/div>
  )
}
```

The notes are thus fetched from the server using the&nbsp;<em>getAll()</em>&nbsp;function we defined and then stored using the store's&nbsp;<em>initialize</em>&nbsp;function. These actions are done in the&nbsp;<em>useEffect</em>&nbsp;hook, meaning they are executed during the first render of the App component.

Let's look more closely at one small detail. We have added the&nbsp;<em>initialize</em>&nbsp;function to the dependency array of the&nbsp;<em>useEffect</em>&nbsp;hook. If we try to use an empty dependency array, ESLint gives the following warning:&nbsp;<em>React Hook useEffect has a missing dependency: 'initialize'</em>. What is going on?

The code would work logically exactly the same even if we used an empty dependency array, because&nbsp;<em>initialize</em>&nbsp;refers to the same function throughout the program's execution. However, it is good programming practice to add all variables and functions used by the&nbsp;<em>useEffect</em>&nbsp;hook that are defined inside the component to the dependencies. This helps avoid unexpected bugs.

### Sending data to the server

Let's next implement the functionality for sending a new note to the server. At the same time we can practice how to make a POST request using the&nbsp;<em>fetch()</em>&nbsp;function.

Let's extend the server communication code in&nbsp;<em>src/services/notes.js</em>&nbsp;as follows:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

// BEGIN HIGHLIGHT
const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
// END HIGHLIGHT

// BEGIN HIGHLIGHT
export default { getAll, createNew }
// END HIGHLIGHT
```

Let's look more closely at the implementation of the&nbsp;<em>createNew</em>&nbsp;function. The first parameter of the&nbsp;<em>fetch()</em>&nbsp;function specifies the URL to which the request is made. The second parameter is an object that defines the other details of the request, such as the request type, headers and the data sent with the request. We can further clarify the code by storing the object defining the request details in a separate&nbsp;<em>options</em>&nbsp;helper variable:

```js
const createNew = async (content) => {
  // BEGIN HIGHLIGHT
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }

  const response = await fetch(baseUrl, options)
  // END HIGHLIGHT

  const response = await fetch(baseUrl, options)
  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
```

Let's look more closely at the&nbsp;<em>options</em>&nbsp;object:
- <em>method</em> defines the request type, which in this case is <em>POST</em>
- <em>headers</em> defines the request headers. We attach the header <em>'Content-Type': 'application/json'</em> to the request so that the server knows that the data included with the request is in JSON format, and can handle the request correctly
- <em>body</em> contains the data to be sent with the request. The field cannot directly contain a JavaScript object, it must first be converted to a JSON string by calling <em>JSON.stringify()</em>

As with the GET request, we also check the response status code here for errors:

```
if (!response.ok) {
  throw new Error('Failed to create note')
}
```

If the request succeeds,&nbsp;<em>JSON Server</em>&nbsp;returns the just-created note, for which it has also generated a unique&nbsp;<em>id</em>. The data contained in the response must still be converted to JSON format using the&nbsp;<em>response.json()</em>&nbsp;function:

```js
return await response.json()
```

Let's then change our application's&nbsp;<em>NoteForm</em>&nbsp;component so that a new note is sent to the backend. The component's&nbsp;<em>addNote</em>&nbsp;function changes slightly:

```js
import { useNoteActions } from './store'
import noteService from './services/notes'

const NoteForm = () => {
  const { add } = useNoteActions()

  const addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    // BEGIN HIGHLIGHT
    const newNote = await noteService.createNew(content)
    // END HIGHLIGHT
    add(newNote)
    e.target.reset()
  }

  return (
    &lt;form onSubmit={addNote}>
      &lt;input name="note" />
      &lt;button type="submit">add&lt;/button>
    &lt;/form>
  )
}

export default NoteForm
```

When a new note is created in the backend by calling the function&nbsp;<em>createNew()</em>, we get back an object describing the note, for which the backend has generated an&nbsp;<em>id</em>.

The current code of the application is available in its entirety on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-4" target="_blank" rel="noopener">GitHub</a>, in the branch&nbsp;<em>part6-4</em>.

### Async actions

Our approach is fairly good, but in one sense unfortunate, in that the communication with the server happens inside the code of the functions that define the components. It would be better if the communication could be abstracted away from the components, so that they only need to call an appropriate function that the store provides.

We want&nbsp;<em>App</em>&nbsp;to initialize the application state as follows:

```js
const App = () => {
  // BEGIN HIGHLIGHT
  const { initialize } = useNoteActions()
  // END HIGHLIGHT
  useEffect(() => {
    // BEGIN HIGHLIGHT
    initialize()
    // END HIGHLIGHT
  }, [initialize])

  return (
    &lt;div>
      &lt;NoteForm />
      &lt;VisibilityFilter />
      &lt;NoteList />
    &lt;/div>
  )
}
```

<em>NoteForm</em>&nbsp;in turn creates a new note like this:

```js
const NoteForm = () => {
  // BEGIN HIGHLIGHT
  const { add } = useNoteActions()
  // END HIGHLIGHT

  const addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    // BEGIN HIGHLIGHT
    await add(content)
    // END HIGHLIGHT
    e.target.reset()
  }

  return (
    &lt;form onSubmit={addNote}>
      &lt;input name="note" />
      &lt;button type="submit">add&lt;/button>
    &lt;/form>
  )
}
```

The change to&nbsp;<em>store.js</em>&nbsp;is as follows:

```js
import { create } from 'zustand'
// BEGIN HIGHLIGHT
import noteService from './services/notes'

// END HIGHLIGHT
const useNoteStore = create((set) => ({
  notes: [],
  filter: '',
  actions: {
    // BEGIN HIGHLIGHT
    add: async (content) => {
    // END HIGHLIGHT
      // BEGIN HIGHLIGHT
      const newNote = await noteService.createNew(content)
      // END HIGHLIGHT
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    // BEGIN HIGHLIGHT
    initialize: async () => {
    // END HIGHLIGHT
      // BEGIN HIGHLIGHT
      const notes = await noteService.getAll()
      // END HIGHLIGHT
      set(() => ({ notes }))
    },
    // ...
  }
}))
```

The functions <em>add</em> and <em>initialize</em> have thus been changed into asynchronous functions, which first call the appropriate <em>noteService</em> function, and then update the state.

The solution is elegant, state management and communication with the server are entirely separated outside of React components.

Let's finalize the application by synchronizing the importance toggle change to the server.

<em>noteService.js</em>&nbsp;is extended as follows:

```js
const update = async (id, note) =&gt; {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}

export default { getAll, createNew, update }
```

The change to the store's&nbsp;<em>toggleImportance</em>&nbsp;function is as follows:

```js
const useNoteStore = create((set) => ({
  notes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newNote = await noteService.createNew(content)
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    // BEGIN HIGHLIGHT
    toggleImportance: async (id) => {
      const note = useNoteStore.getState().notes.find(n => n.id === id)
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    // END HIGHLIGHT
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const notes = await noteService.getAll()
      set(() => ({ notes }))
    }
  }
}))
```

There is one noteworthy detail in the new function. The function receives the note's id as a parameter. However, the modified note must be sent to the backend. It can be found by calling the store's&nbsp;<em>getState</em>&nbsp;function:

```js
const note = useNoteStore.getState().notes.find(n =&gt; n.id === id)
```

Zustand stores also have a number of other&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">helper functions</a>, which may be useful in some situations.

Let's also change the store definition so that we also pass the parameter <a href="https://zustand.docs.pmnd.rs/reference/apis/create#parameters">get</a> to the function given to <em>create</em>, through which we can then access the state values when needed:

```js
// BEGIN HIGHLIGHT
const useNoteStore = create((set, get) => ({
// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    toggleImportance: async (id) => {
      // BEGIN HIGHLIGHT
      const note = get().notes.find(n => n.id === id)
      // END HIGHLIGHT
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    // ...
  }
}))
```

The function&nbsp;<em>get</em>&nbsp;returns the current state of the store. For example, the call&nbsp;<em>get().notes</em>&nbsp;gives the store's current notes. The function&nbsp;<em>get</em>&nbsp;is functionally equivalent to calling&nbsp;<em>useNoteStore.getState()</em>, but is the most idiomatic way to refer to the store's state from within the store's own functions.

The code of the application is on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-5" target="_blank" rel="noopener">GitHub</a>&nbsp;in the branch&nbsp;<em>part6-5</em>.

<div class="tasks">

**8. Anecdotes, step6**

</div>

<div class="tasks">

**9. Anecdotes, step7**

</div>

<div class="tasks">

**10. Anecdotes, step8**

</div>

<div class="tasks">

**11. Anecdotes, step9**

</div>

<div class="tasks">

**12. Anecdotes, step10**

</div>

<div class="tasks">

**13. Anecdotes checkup**

</div>

### Middlewares

When developing an application, one often encounters situations where it is hard to understand why the application behaves unexpectedly. The state changes as a result of some action function call, but it is unclear which call changed what and in which order. Traditional console logging of individual functions only helps to a limited extent.

Zustand supports so-called middlewares, which can be used to add functionality to stores transparently, without touching the store's own logic. The idea of middleware is simple: it "wraps" around the store and can, for example, automatically log every state change.

The form of middleware functions is somewhat cryptic. Below is a&nbsp;<em>logger</em>&nbsp;that always prints the store's old and new state whenever the state changes:

```js
const logger = (config) =&gt; (set, get) =&gt; config(
  (...args) =&gt; {
    console.log('prev state', get());
    set(...args);
    console.log('next state', get());
  },
  get
);
```

The middleware is activated by "wrapping" the function given to Zustand's&nbsp;<em>create</em>&nbsp;as its parameter:

```js
// BEGIN HIGHLIGHT
const useNoteStore = create(logger((set, get) => ({
// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    // ...
  }
// BEGIN HIGHLIGHT
})))
// END HIGHLIGHT
```

Now whenever the store's state changes, we can always see in the console how the state changes:

![صورة توضيحية](/images/mooc/37834b06ad73.webp)

In practice our defined middleware works by replacing the original function&nbsp;<em>set</em>&nbsp;with the function

```
  (...args) =&gt; {
    console.log('prev state', get());
    set(...args);
    console.log('next state', get());
  }
```

which in addition to calling&nbsp;<em>set</em>, also prints the old and new state (accessible via the&nbsp;<em>get</em>&nbsp;function) to the console. The second parameter is the old&nbsp;<em>get</em>&nbsp;unchanged.

Zustand also has a ready-made&nbsp;<em>devtools</em>&nbsp;middleware that integrates the store with the browser's&nbsp;<a href="https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd" target="_blank" rel="noopener">Redux DevTools</a>&nbsp;extension. Devtools is an extremely useful development tool, as it allows you to visually track state changes.

The setup is straightforward:

```js
import { create } from 'zustand'
// BEGIN HIGHLIGHT
import { devtools } from 'zustand/middleware'
// END HIGHLIGHT
// BEGIN HIGHLIGHT

const useNoteStore = create(devtools((set, get) => ({

// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    // ...
  }
// BEGIN HIGHLIGHT
})))
// END HIGHLIGHT
```

When the Redux DevTools extension is installed in the browser, the state of the store and its changes can be inspected in the browser's developer tools:

![صورة توضيحية](/images/mooc/8e1caa33c0a1.webp)

### Testing Zustand stores

Finally, let's look at testing Zustand stores with Vitest.

For simplicity, let's start with the counter store:

```js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  actions: {
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
    zero: () => set(() => ({ counter: 0 })),
  }
}))

export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)

// BEGIN HIGHLIGHT
export default useCounterStore
// END HIGHLIGHT
```

We added an export to the definition for the tests, through which the test can access the store.

Let's install Vitest:

```bash
npm install --save-dev vitest
```

Let's implement the test in the file&nbsp;<em>store.test.js</em>:

```js
import { beforeEach, describe, expect, it } from 'vitest'
import useCounterStore from './store'

beforeEach(() =&gt; {
  useCounterStore.setState({ counter: 0 })
})

describe('counter store', () =&gt; {
  it('initial state is 0', () =&gt; {
    expect(useCounterStore.getState().counter).toBe(0)
  })

  it('increment increases counter by 1', () =&gt; {
    useCounterStore.getState().actions.increment()
    expect(useCounterStore.getState().counter).toBe(1)
  })

  it('decrement decreases counter by 1', () =&gt; {
    useCounterStore.getState().actions.decrement()
    expect(useCounterStore.getState().counter).toBe(-1)
  })

  it('zero resets counter to 0', () =&gt; {
    useCounterStore.getState().actions.increment()
    useCounterStore.getState().actions.increment()
    useCounterStore.getState().actions.zero()
    expect(useCounterStore.getState().counter).toBe(0)
  })
})
```

The tests are quite straightforward, utilizing the store's&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">getState</a>&nbsp;function, which allows them to read the store's state and execute the store's functions.

Before each test, the store is reset to its initial state in the&nbsp;<em>beforeEach</em>&nbsp;block using the store's&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">setState</a>&nbsp;function.

Resetting the store to its initial state is simple in our case. This is not always necessarily so. Zustand's&nbsp;<a href="https://zustand.docs.pmnd.rs/learn/guides/testing#vitest" target="_blank" rel="noopener">documentation</a>&nbsp;describes a way to create a version of stores for testing that is automatically reset to its initial state before each test. The method is, however, complex enough and unnecessary for us that we will skip it for now.

The tests thus use the store directly. If more complex logic has been implemented through custom hooks for using the store, it may be necessary to write tests that also utilize the hooks. In the counter, store usage happens through the hooks&nbsp;<em>useCounter</em>&nbsp;and&nbsp;<em>useCounterControls</em>:

```js
const useCounterStore = create(set => ({
  // ...
}))

// BEGIN HIGHLIGHT
export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)
// END HIGHLIGHT
```

In this case the hooks do not contain any logic, they just separately expose the value stored in the store and the store's functions. The testing approach we used above is therefore perfectly fine.

Let's however make another version of the tests for example purposes, where the store is used in exactly the same way as the application uses it.

<em>useCounter</em>&nbsp;and&nbsp;<em>useCounterControls</em>&nbsp;are React hooks, so testing them requires&nbsp;<a href="https://github.com/testing-library/react-testing-library" target="_blank" rel="noopener">React Testing Library</a>&nbsp;and the&nbsp;<a href="https://github.com/jsdom/jsdom" target="_blank" rel="noopener">jsdom</a>&nbsp;library:

```bash
npm install --save-dev @testing-library/react jsdom
```

Let's add the testing environment configuration to&nbsp;<em>vite.config.js</em>:

```js
export default defineConfig({
  plugins: [react()],
  // BEGIN HIGHLIGHT
  test: {
    environment: 'jsdom',
  },
   // END HIGHLIGHT
})
```

The tests are as follows:

```js
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCounterStore, { useCounter, useCounterControls } from './store'

beforeEach(() =&gt; {
  useCounterStore.setState({ counter: 0 })
})

describe('counter hooks', () =&gt; {
  it('useCounter returns initial value of 0', () =&gt; {
    const { result } = renderHook(() =&gt; useCounter())
    expect(result.current).toBe(0)
  })

  it('increment updates counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; controls.current.increment())

    expect(counter.current).toBe(1)
  })

  it('decrement updates counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; controls.current.decrement())

    expect(counter.current).toBe(-1)
  })

  it('zero resets counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; {
      controls.current.increment()
      controls.current.increment()
      controls.current.zero()
    })

    expect(counter.current).toBe(0)
  })
})
```

There are a few interesting things in the test. At the start of the tests, the hooks are rendered using the&nbsp;<a href="https://testing-library.com/docs/react-testing-library/api/#renderhook" target="_blank" rel="noopener">renderHook</a>&nbsp;function:

```js
const { result: counter } = renderHook(() =&gt; useCounter())
const { result: controls } = renderHook(() =&gt; useCounterControls())
```

This way the test gets access to the values returned by the hooks, which are stored in the variables&nbsp;<em>counter</em>&nbsp;and&nbsp;<em>controls</em>.

The hooks are called by wrapping the call inside the&nbsp;<a href="https://testing-library.com/docs/react-testing-library/api/#act" target="_blank" rel="noopener">act</a>&nbsp;function:

```
act(() =&gt; {
  controls.current.increment()
  controls.current.increment()
  controls.current.zero()
})
```

Finally, the test expectation occurs:

```
expect(counter.current).toBe(0)
```

As we can see, to access the hook itself we still need to take the&nbsp;<em>current</em>&nbsp;field from the object returned by&nbsp;<em>renderHook</em>, which corresponds to the hook's current value.

> What is act?
>
> <em>act</em>&nbsp;is a helper function that ensures all state updates and their side effects have been processed before the test code continues.
>
> When a state change occurs in a React component or hook, React does not update the state immediately but queues the updates. act forces these queued updates to be executed.
>
> Without act, a test might check the state before React has had time to update it, causing the test to fail or give incorrect results.
>
> React Testing Library wraps many of its functions (such as fireEvent, userEvent) in act automatically, but when testing hooks directly it is usually needed.

Testing via hooks uses React Testing Library and renders the hooks in a real React context using jsdom. This approach is considerably slower than tests that use the store directly, so if the hooks do not contain complex logic, it may be sufficient to run the tests using the store directly.

The code containing the Zustand counter tests is available on&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-counter" target="_blank" rel="noopener">GitHub</a>.

### Testing the notes store

Testing the store of the note application is a somewhat more challenging case, since the store contains asynchronous functions that call the server:

```js
import { create } from 'zustand'
import noteService from './services/notes'

const useNoteStore = create(set => ({
  notes: [],
  filter: '',
  actions: {
    add: async (content) => {
      // BEGIN HIGHLIGHT
      const newNote = await noteService.createNew(content)
      // END HIGHLIGHT
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    toggleImportance: async (id) => {
      const note = useNoteStore.getState().notes.find(n => n.id === id)
      // BEGIN HIGHLIGHT
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
       // END HIGHLIGHT
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      // BEGIN HIGHLIGHT
      const notes = await noteService.getAll()
      // END HIGHLIGHT
      set(() => ({ notes }))
    }
  }
}))

export const useNotes = () => {
  const notes = useNoteStore((state) => state.notes)
  const filter = useNoteStore((state) => state.filter)

  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
  return notes
}

export const useFilter = () => useNoteStore((state) => state.filter)
export const useNoteActions = () => useNoteStore((state) => state.actions)
```

This time&nbsp;<em>useNotes</em>&nbsp;also contains a significant amount of logic, so testing should probably be done via hooks with React Testing Library.

Let's install the required libraries:

```bash
npm install --save-dev vitest @testing-library/react jsdom
```

Let's add the testing environment configuration to&nbsp;<em>vite.config.js</em>:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BEGIN HIGHLIGHT
  test: {
    environment: 'jsdom',
  },
   // END HIGHLIGHT
})
```

The first part of the tests is as follows:

```sql
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/notes', () =&gt; ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

import noteService from './services/notes'
import useNoteStore, { useNotes, useFilter, useNoteActions } from './store'

beforeEach(() =&gt; {
  useNoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useNoteActions', () =&gt; {
  it('initialize loads notes from service', async () =&gt; {
    const mockNotes = [{ id: 1, content: 'Test', important: false }]
    noteService.getAll.mockResolvedValue(mockNotes)

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.initialize()
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current).toEqual(mockNotes)
  })

  it('add appends a new note', async () =&gt; {
    const newNote = { id: 2, content: 'New note', important: false }
    noteService.createNew.mockResolvedValue(newNote)

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.add('New note')
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current).toContainEqual(newNote)
  })

  it('toggleImportance flips important flag', async () =&gt; {
    const note = { id: 1, content: 'Test', important: false }
    useNoteStore.setState({ notes: [note] })
    noteService.update.mockResolvedValue({ ...note, important: true })

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.toggleImportance(1)
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current[0].important).toBe(true)
  })
})
```

There is a lot to digest in the tests. The tests create, using Vitest, a&nbsp;<a href="https://vitest.dev/guide/mocking" target="_blank" rel="noopener">mock</a>&nbsp;version of the&nbsp;<em>noteService</em>&nbsp;responsible for communicating with the server:

```sql
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./services/notes', () =&gt; ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))
```

<a href="https://vitest.dev/api/vi.html#vi-mock" target="_blank" rel="noopener">vi.mock</a>&nbsp;replaces the&nbsp;<em>noteService</em>&nbsp;in the&nbsp;<em>./services/notes</em>&nbsp;module with its own version, where all functions are replaced with mock functions returned by&nbsp;<a href="https://vitest.dev/api/vi.html#vi-fn" target="_blank" rel="noopener">vi.fn</a>.

Before each test, the store is reset to its initial state and the mock functions are cleared:

```
beforeEach(() =&gt; {
  useNoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})
```

At the start of each test, the mocked&nbsp;<em>noteService</em>&nbsp;is told via the&nbsp;<a href="https://vitest.dev/api/mock.html#mockresolvedvalue" target="_blank" rel="noopener">mockResolvedValue</a>&nbsp;function how it should behave in the context of the test:

```js
it('initialize loads notes from service', async () => {
  // BEGIN HIGHLIGHT
  const mockNotes = [{ id: 1, content: 'Test', important: false }]
  noteService.getAll.mockResolvedValue(mockNotes)
  // END HIGHLIGHT

  const { result } = renderHook(() => useNoteActions())

  await act(async () => {
    await result.current.initialize()
  })

  const { result: notesResult } = renderHook(() => useNotes())
  expect(notesResult.current).toEqual(mockNotes)
})
```

First, the test defines that when the&nbsp;<em>noteService.getAll</em>&nbsp;function is called, the notes in the&nbsp;<em>mockNotes</em>&nbsp;array are returned to the store.

The thing being tested is the call to the&nbsp;<em>initialize</em>&nbsp;function:

```
await act(async () =&gt; {
  await result.current.initialize()
})
```

Since this is an asynchronous function, the completion of the call must be awaited with the&nbsp;<em>await</em>&nbsp;keyword.

Finally, the test verifies that the store's state contains the same list of notes that the mocked&nbsp;<em>noteService.getAll</em>&nbsp;returned:

```js
const { result: notesResult } = renderHook(() =&gt; useNotes())
expect(notesResult.current).toEqual(mockNotes)
```

The other tests follow the same pattern: first, what the store's called&nbsp;<em>noteService</em>&nbsp;function returns is defined, and then the actual test is run.

The second part of the tests verifies that filtering works correctly:

```js
describe('useNotes filtering', () =&gt; {
  const notes = [
    { id: 1, content: 'A', important: true },
    { id: 2, content: 'B', important: false },
  ]

  beforeEach(() =&gt; {
    useNoteStore.setState({ notes })
  })

  it('returns all notes with no filter', () =&gt; {
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toHaveLength(2)
  })

  it('filters important notes', () =&gt; {
    useNoteStore.setState({ notes, filter: 'important' })
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toEqual([notes[0]])
  })

  it('filters nonimportant notes', () =&gt; {
    useNoteStore.setState({ notes, filter: 'nonimportant' })
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toEqual([notes[1]])
  })
})
```

The state is initialized with two notes, one of which is important and the other is not. The three test cases verify that&nbsp;<em>useNotes</em>&nbsp;returns the correct notes for all filter values.

The application's final code is on <a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-6" target="_blank" rel="noopener">GitHub</a> in the branch <em>part6-6</em>.

####

<div class="tasks">

**14. Anecdotes, step11**

</div>

<div class="tasks">

**15. Anecdotes, step12**

</div>

<div class="tasks">

**16. Anecdotes, step13**

</div>

<div class="tasks">

**17. Anecdotes, step14**

</div>

<div class="tasks">

**18. Anecdotes, final check**

</div>
