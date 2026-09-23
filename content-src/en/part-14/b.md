---
part: 14
letter: b
title: "From single page apps to server side rendering"
mainImage: /images/part-14.svg
lang: en
---
### Next.js notes

The best way to get a grasp of Next.js is to get our hands dirty. Once more, it's the notes app that we'll be building.

A Next.js app is created with the&nbsp;<a href="https://nextjs.org/docs/app/getting-started/installation#create-with-the-cli">create-next-app</a>&nbsp;tool. Let us now set up our app by running

```bash
npx create-next-app@latest notes-app

? Would you like to use the recommended Next.js defaults?
❯   Yes, use recommended defaults
```

We decided to go with the recommended default settings.

The app directory structure looks like the following:

```
├── AGENTS.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── README.md
└── tsconfig.json
```

Many things here should feel familiar. We might guess that&nbsp;<em>next.config.ts</em>&nbsp;contains the Next.js configurations. Interestingly also&nbsp;<em>AGENTS.md</em>&nbsp;and&nbsp;<em>CLAUDE.md</em>&nbsp;are generated for coding agents. The AGENTS.md gives a warning to agents that may rely on older learning data:

```
&lt;!-- BEGIN:nextjs-agent-rules -->
<em># This is NOT the Next.js you know</em>

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
&lt;!-- END:nextjs-agent-rules -->
```

The most important directory is&nbsp;<em>app</em>&nbsp;that will contain most of the application code.

Let us get to the code. We will start with some cleanups. Firstly change the content of the file&nbsp;<em>layout.tsx</em>&nbsp;to this:

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>{children}&lt;/body>
    &lt;/html>
  )
}
```

Next, we change the content&nbsp;<em>page.tsx</em>&nbsp;to be the following:

```js
const Home = () => {
  return &lt;div>hello next.js&lt;/div>
}
export default Home
```

Now we can start the app

```bash
npm run dev
```

And we have a bare bones Next.js app working:

![صورة توضيحية](/images/mooc/c4920f4bbfa2.webp)

We shall make this the home page of our app, so let us put more content on it.

```js
const Home = () => {
  return (
    &lt;div>
      &lt;div>
        &lt;h2>notes app&lt;/h2>
        An example app for{" "}
        &lt;a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">
          Full Stack Open Next.js
        &lt;/a>
      &lt;/div>
      &lt;div>
        See{" "}
        &lt;a href="https://github.com/fullstack-hy2020/nextjs-notes">
          https://github.com/fullstack-hy2020/nextjs-notes
        &lt;/a>{" "}
        for the source code
      &lt;/div>
    &lt;/div>
  )
}
export default Home
```

The homepage of our app looks like a normal React component. However, it is not. In Next.js, components inside the&nbsp;<em>app</em>&nbsp;directory are&nbsp;<a href="https://react.dev/reference/rsc/server-components">React Server Components</a>&nbsp;by default. Unlike the traditional React components we have been writing so far, Server Components are rendered on the server, not in the browser.

Let us verify this with the good old&nbsp;<em>console.log</em>:

```js
const Home = () => {
  console.log('hello next.js')
  return (
    <em>// ...</em>
  )
}
export default Home
```

When we navigate to&nbsp;<a href="http://localhost:3000/">http://localhost:3000</a>, the&nbsp;<em>console.log</em>&nbsp;output appears in the terminal where the server is running:

![صورة توضيحية](/images/mooc/4a8a9a536e3f.webp)

Interestingly, in development mode the output also appears in the browser console. This is a Next.js development feature that helps with debugging: the server forwards console output to the browser DevTools so you can see it in one place. However, this does not mean the component ran in the browser. The component still executed on the server, and Next.js simply mirrored the console output to the client for convenience. In production, server-side console output stays on the server only.

### App router

We would like to show the list of notes in the url&nbsp;<a href="http://localhost:3000/notes">http://localhost:3000/notes</a>. In React this would be done with&nbsp;<a href="https://fullstackopen.com/en/part5/react_router_ui_frameworks">React Router</a>.

In Next.js things are even simpler thanks to the&nbsp;<a href="https://nextjs.org/docs/app">App router</a>&nbsp;that implements a&nbsp;<em>file system based routing</em>&nbsp;where the directories and files inside the directory&nbsp;<em>app</em>&nbsp;define the routing structure of the app.

We already had the file&nbsp;<em>app/page.tsx</em>, that is the file&nbsp;<em>page.tsx</em>&nbsp;directly under the&nbsp;<em>app</em>&nbsp;directory. This file defines the&nbsp;<a href="https://react.dev/reference/rsc/server-components">React Server Component</a>&nbsp;defining the content of the route /. Let us borrow an image from Next.js documentation that depicts this relationship:

![صورة توضيحية](/images/mooc/c9196c4e4541.webp)

We already briefly touched the file&nbsp;<em>app/layout.tsx</em>:

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>{children}&lt;/body>
    &lt;/html>
  )
}
```

What is the role of this file? The layout is a shared UI wrapper that is rendered around every page within its scope. In this case, the root layout wraps the entire application and provides the&nbsp;<code>&lt;html&gt;</code>&nbsp;and&nbsp;<code>&lt;body&gt;</code>&nbsp;tags. The&nbsp;<code>children</code>&nbsp;prop receives the content of the current page (i.e., the component exported from&nbsp;<em>page.tsx</em>). Layouts persist across navigations and do not re-render, making them ideal for shared elements like navigation bars and footers.

The relationship between the layout and the rendered route is illustrated here:

![صورة توضيحية](/images/mooc/59633e27a3df.webp)

So the root layout is obviously the right place to implement a navigation bar for our app. Let us now do that:

```js
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;nav>
          &lt;Link href="/">home&lt;/Link>
          {" | "}
          &lt;Link href="/notes">notes&lt;/Link>
          {" | "}
          &lt;Link href="/notes/new">create new&lt;/Link>
        &lt;/nav>
        {children}
      &lt;/body>
    &lt;/html>
  )
}
```

The navbar uses the component&nbsp;<a href="https://nextjs.org/docs/app/api-reference/components/link">Link</a>&nbsp;for the links. The behavior of the component is quite obvious: it provides a client side routing just as its counterpart in React Router.

Now the app looks as following

![صورة توضيحية](/images/mooc/7322439fb781.webp)

The links obviously do not work at this point.

### Page for notes

Next we shall create the view&nbsp;<em>/notes</em>&nbsp;that renders the set of notes. Following the convention of Next.js App router, we will create the directory&nbsp;<em>app/notes</em>&nbsp;and inside it the file&nbsp;<em>page.tsx</em>&nbsp;with following content:

```js
const notes = [
  { id: 1, content: "next.js utilizes React Server Components", important: true },
  { id: 2, content: "next.js is built on top of React", important: true },
  {
    id: 3,
    content: "next.js supports both static and dynamic rendering",
    important: false,
  },
]

const Notes = () => {
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.content} {note.important &amp;&amp; &lt;strong>(important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

There is nothing surprising in the component. We can now navigate to the new view:

![صورة توضيحية](/images/mooc/bf10f7608d71.webp)

We shall eventually save the notes to a database. To prepare for the transition, let us refactor those to the file&nbsp;<em>app/services/notes.ts</em>:

```ts
const notes = [
  { id: 1, content: "next.js utilizes React Server Components", important: true },
  { id: 2, content: "next.js is built on top of React", important: true },
  {
    id: 3,
    content: "next.js supports both static and dynamic rendering",
    important: false,
  },
]

let nextId = 4

export const getNotes = () => {
  return notes
}

export const addNote = (content: string, important: boolean) => {
  notes.push({ id: nextId++, content, important })
}
```

The service export now the function&nbsp;<em>getNotes</em>&nbsp;with the obvious behavior.

To anticipate the next feature, we also added function&nbsp;<em>addNote</em>&nbsp;to the service.

In earlier parts of Full Stack Open, we separated backend API calls into a <em>services</em> directory. Here we follow the same principle: the <em>app/services</em> directory holds modules responsible for data access. Right now <em>getNotes</em> simply returns a hardcoded array, but later we can swap in a database query without touching the page component at all.

The&nbsp;<em>app/notes/page.tsx</em>&nbsp;becomes now:

```js
import { getNotes } from "../services/notes" // HIGHLIGHT LINE

const Notes = () => {
  const notes = getNotes() // HIGHLIGHT LINE
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.content} {note.important &amp;&amp; &lt;strong>(important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes

```

It is worth pausing to reflect on what is happening here. All of our components so far, the home page, the layout, and the notes page, are React Server Components. They are rendered entirely on the server. The browser receives ready-made HTML, no JavaScript for these components is shipped to the client at all.

### Creating new notes

The next thing to implement is obviously the creation of new notes. We already have a route&nbsp;<em>/notes/new</em>&nbsp;setup, so let us create the component &nbsp;<em>/notes/new/page.tsx</em>&nbsp;with the following content:

```js
const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

Form looks fine but it does nothing. How should we implement the form submission?

In the earlier parts of Full Stack Open, we would have added an <em>onSubmit</em> event handler and used <em>useState</em> to manage the form fields. That approach requires a Client Component, since event handlers and hooks only work in the browser.

However, Next.js offers another option:&nbsp;<a href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations">Server Actions</a>. A Server Action is a function that runs on the server but can be called directly from a form in the browser.

Let us now create directory&nbsp;<em>/app/actions</em>&nbsp;for server actions, and the file&nbsp;<em>/app/actions/notes.ts</em>&nbsp;for the actions. Contents of the file is following:

```js
"use server"

import { redirect } from "next/navigation"
import { addNote } from "../services/notes"

export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)
  redirect("/notes")
}
```

The action&nbsp;<em>createNote</em>&nbsp;takes&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData">formData</a>&nbsp;as parameter, and uses the method&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData/get">get</a>&nbsp;to access the form values. It then uses the function&nbsp;<em>addNote</em>&nbsp;defined in&nbsp;<em>app/services/notes.ts</em>&nbsp;to save the created note to the list of notes. Finally, it calls&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/redirect">redirect</a>&nbsp;to navigate the user back to the notes list.

The&nbsp;<a href="https://nextjs.org/docs/app/api-reference/directives/use-server">"use server"</a>&nbsp;directive at the top of the file marks all exported functions as Server Actions.

The server action is passed as the <em>action</em> prop to the <em>&lt;form></em>:

```js
import { createNote } from "./actions" // HIGHLIGHT LINE

const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={createNote}> // HIGHLIGHT LINE
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

When the form is submitted, the browser sends the form data to the server as a POST request, the Server Action executes, and the page is updated. All without writing any client-side JavaScript. This means the form component can remain a Server Component.

But how does this actually work? When Next.js compiles the application, it detects every function marked with <em>"use server"</em> and generates a unique HTTP endpoint for each one. The <em>action={createNote}</em> prop does not embed the server function in the client bundle. Instead, Next.js replaces the function reference with a hidden identifier pointing to that endpoint. When the user submits the form, the browser makes a standard POST request to the generated endpoint, sending the form data along with it.

On the server side, Next.js receives the request, looks up the correct Server Action by its identifier, and calls it with the <em>FormData</em> object. Once the action completes and, in our case, calls <em>redirect</em>, the server sends back a response that tells the client to navigate to the new URL. The browser never needs to know anything about <em>addNote</em> or the notes array, as all of that logic stays entirely on the server.

Let us have yet another look at the end of the server action:

```js
export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)
  redirect("/notes") // HIGHLIGHT LINE
}
```

So the command&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/redirect">redirect</a>&nbsp;is called to take the user back to view&nbsp;<em>notes</em>&nbsp;that lists the notes. The traditional server side rendered apps would do a&nbsp;<a href="https://en.wikipedia.org/wiki/Post/Redirect/Get">post-redirect-get</a>&nbsp;in this case.

With a Next.js app, the approach differs a bit. Instead of the browser performing a full-page redirect and GET request, the server responds with an internal instruction that tells the Next.js client-side router to navigate to&nbsp;<em>/notes</em>. The router then fetches only the new page content (the React Server Component payload for the notes page) and updates the view without a full page reload. So we still get the "redirect after POST" semantics, but the transition is faster and smoother since Next.js handles it as a client-side navigation under the hood.

### Static rendering

Our app seems to work nicely during development. However, if we build the application for production and run it, we will notice a problem.

Let us build the app and start it in production mode:

```bash
npm run build
npm start
```

The build output shows something interesting:

```bash
npm run ▲ Next.js 16.2.3 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.2s
✓ Finished TypeScript in 4.8s
✓ Collecting page data using 7 workers in 451ms
✓ Generating static pages using 7 workers (6/6) in 263ms
✓ Finalizing page optimization in 19ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /notes
└ ○ /notes/new
```

Notice the&nbsp;<em>○</em>&nbsp;symbol next to every route. This means all our pages are&nbsp;<strong>static</strong>, they were&nbsp;<a href="https://nextjs.org/docs/app/getting-started/linking-and-navigating#server-rendering">pre-rendered</a>&nbsp;at build time into HTML files. When a user requests&nbsp;<em>/notes</em>, Next.js serves the pre-built HTML immediately without running any server-side code.

This is great for performance, but it creates a problem: if we create a new note using the form, the Server Action executes and adds the note to our data. The&nbsp;<em>redirect("/notes")</em>&nbsp;then takes the user back to the notes list. But since the&nbsp;<em>/notes</em>&nbsp;page was pre-rendered at build time,&nbsp;<strong>the user sees the old, cached version of the page</strong>, and the new note does not appear.

During development (<em>npm run dev</em>), this problem is invisible. In development mode, Next.js renders every page fresh on each request, so you always see the latest data. This is a well-known pitfall: code that works perfectly in dev can break in production.

The fix is to tell Next.js that the cached page is stale after a mutation. We do this with&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath">revalidatePath</a>:

```js
"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache" // HIGHLIGHT LINE
import { addNote } from "../services/notes"

export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)

  revalidatePath("/notes") // HIGHLIGHT LINE
  redirect("/notes")
}
```

The call&nbsp;<em>revalidatePath("/notes")</em>&nbsp;tells Next.js to invalidate the cached version of the&nbsp;<em>/notes</em>&nbsp;page. The next time someone requests that route, Next.js will re-render it with fresh data instead of serving the stale build-time version.

As a rule of thumb: whenever a Server Action modifies data that affects a page, pair the mutation with a&nbsp;<em>revalidatePath</em>&nbsp;call for every route that displays that data.

Always test your app with&nbsp;<em>npm run build &amp;&amp; npm start</em>&nbsp;before deploying to catch caching issues early. The build output markers (<em>○</em>&nbsp;for static,&nbsp;<em>ƒ</em>&nbsp;for dynamic) are a helpful indicator of which routes are cached!

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part1.

<div class="tasks">

**1.  Blog list**

</div>

<div class="tasks">

**2. New blog**

</div>

### Page of a note

Even though it is probably overkill, let us next make a individual view for each note, so that the note with id 10 would be in page with url notes/10. For that we need a&nbsp;<a href="https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment">dynamic route segment</a>. The way we define that in Next.js App router is quite interesting. We create a directory&nbsp;<em>/app/notes/[id]</em>&nbsp;and the usual file&nbsp;<em>page.tsx</em>&nbsp;inside it:

```ts
import { notFound } from "next/navigation"
import { getNoteById } from "../../services/notes"

const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = getNoteById(Number(id))

  if (!note) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{note.content}&lt;/h2>
      &lt;p>{note.important ? "Important" : "Not important"}&lt;/p>
    &lt;/div>
  )
}

export default NotePage
```

When the note is not found, we call&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/not-found">notFound()</a>&nbsp;from&nbsp;<em>next/navigation</em>. This function throws a special error that Next.js catches and renders the nearest&nbsp;<em>not-found.tsx</em>&nbsp;file, or a default 404 page if none exists. It is the idiomatic way to signal a missing resource in Next.js App Router.

Note how the component gets the id matching the dynamic part of the route as a parameter&nbsp;<em>params</em>. The parameter is a promise, so to destructure it,&nbsp;<em>await</em>&nbsp;is needed, and that is why the function defining the component needs to be&nbsp;<em>async</em>.

We have also extended the&nbsp;<em>app/service/notes</em>&nbsp;with a function that returns a note based on an id:

```ts
export const getNoteById = (id: number) => {
  return notes.find((note) => note.id === id)
}
```

Let us extend the&nbsp;<em>app/notes/page.tsx</em>&nbsp;to enable navigation to the individual notes:

```js
import Link from "next/link" // HIGHLIGHT LINE
import { getNotes } from "../services/notes"

const Notes = () => {
  const notes = getNotes()
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link> // HIGHLIGHT LINE
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

### More functionality

Let us now make it possible to change the importance of a note. The file&nbsp;<em>services/notes.ts</em>&nbsp;needs a new function:

```ts
const notes = [
]

<em>// ...</em>

export const toggleImportance = (id: number) => {
  const note = notes.find((note) => note.id === id)
  if (note) {
    note.important = !note.important
  }
}
```

Now, at actions/notes, the server action is as follows and assumes that it gets the id of the toggled note as a formData parameter:

```js
export const toggleNoteImportance = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  toggleImportance(id)
  revalidatePath(`/notes/${id}`)
  revalidatePath("/notes")
}
```

After toggling the importance, the action needs to revalidate both the path of the note itself, and the list of notes. This keeps all the views in sync with the change.

The&nbsp;<em>app/notes/[id]/page.tsx</em>&nbsp;changes to:

```ts
import { notFound } from "next/navigation"
import { getNoteById } from "../../services/notes"
import { toggleNoteImportance } from "../../actions/notes" // HIGHLIGHT LINE

const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = getNoteById(Number(id))

  if (!note) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{note.content}&lt;/h2>
      &lt;p>{note.important ? "Important" : "Not important"}&lt;/p>
      // BEGIN HIGHLIGHT
      &lt;form action={toggleNoteImportance}>
        &lt;input type="hidden" name="id" value={note.id} />
        &lt;button type="submit">
          {note.important ? "Mark as not important" : "Mark as important"}
        &lt;/button>
      &lt;/form>
      // END HIGHLIGHT
    &lt;/div>
  )
}
```

The change is an interesting one. The button that toggles the importance is now within form tags, and the server action is the action of the form. The server action needs the&nbsp;<em>id</em>&nbsp;of the note, and for that the form has a&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/hidden">hidden</a>&nbsp;input field, that makes it possible to include data that cannot be seen or modified by users of the form.

Again one needs to remember that the two last lines of the server action&nbsp;<em>toggleNoteImportance</em>&nbsp;are crucial:

```js
export const toggleNoteImportance = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  toggleImportance(id)
  revalidatePath(`/notes/${id}`) // HIGHLIGHT LINE
  revalidatePath("/notes") // HIGHLIGHT LINE
}
```

Everything works without these in development mode but when running the app in production with&nbsp;<em>npm run build &amp;&amp; npm start</em>&nbsp;the toggling of importance is not reflected in ui despite the request is executed in backend.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part2.

### Showing important notes only, client component solution

Next we decide to implement a feature that makes it possible to show only the important notes. With normal React app this would be easy, just add a state that remembers what should be shown and filter the notes to show accordingly.

So let us first do a traditional React like solution that relies on state created with React&nbsp;<em>useState</em>&nbsp;hook. As mentioned in&nbsp;<a href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components">documentation</a>, the React Server Components do not support state, so a Client Component should be used. The component is marked as a client component using the directive&nbsp;<a href="https://react.dev/reference/rsc/use-client">"use client"</a>&nbsp;at the start of the component:

```ts
"use client"

import Link from "next/link"
import { useState } from "react"

type Note = {
  id: number
  content: string
  important: boolean
}

const NoteList = ({ notes }: { notes: Note[] }) => {
  const [showImportant, setShowImportant] = useState(false)

  const notesToShow = showImportant
    ? notes.filter((note) => note.important)
    : notes

  return (
    &lt;div>
      &lt;button onClick={() => setShowImportant(!showImportant)}>
        {showImportant ? "Show all" : "Show important"}
      &lt;/button>
      &lt;ul>
        {notesToShow.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link>
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}

export default NoteList
```

The component logic is very familiar to us. It gets the list of notes as a prop, and based on its state&nbsp;<em>showImportant</em>&nbsp;it either renders all notes or just important ones. A button is used to control the value of&nbsp;<em>showImportant</em>.

The server component&nbsp;<em>app/notes/page.tsx</em>&nbsp;now just passes the list of notes to the client component that takes care of the rendering:

```js
import { getNotes } from "../services/notes"
import NoteList from "./NoteList"

const Notes = () => {
  const notes = getNotes()
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;NoteList notes={notes} />
    &lt;/div>
  )
}
export default Notes
```

![صورة توضيحية](/images/mooc/87c8aa3d6643.webp)

Our app works now a bit like it would be a traditional React/express SPA, but not quite. Let us now go through what happens under the hood when user navigates to&nbsp;<em>/notes</em>&nbsp;and presses&nbsp;<em>Show important</em>.

<strong>Step 1: User goes to /notes</strong>
- The browser requests <em>/notes</em> from the server
- Server renders <em>Notes</em>, which is a Server Component. It calls <em>getNotes()</em>, gets the array, and encounters <em>&lt;NoteList notes={notes} /></em>. Since <em>NoteList</em> is a Client Component, the server does not render it. Instead, it serializes the notes array into the <a href="https://nextjs.org/docs/app/glossary#rsc-payload">RSC payload</a> as props for the client component.
- The browser receives the HTML + RSC payload. React renders NoteList as a client component. useState(false) initializes <em>showImportant</em> to false.
- All notes are displayed since <em>showImportant</em> is false

<strong>Step 2: user presses "Show important"</strong>
- Click handler runs on the client. <em>setShowImportant(!showImportant)</em> sets state to true. No server request is made.
- React re-renders <em>NoteList</em> with <em>showImportant</em> now true
- Only important notes are displayed

Key point is that the Step 2 is entirely client-side. The notes data was already sent from the server as props during step 1. The filtering happens in the browser using the pre-fetched data, no additional server roundtrip needed.

In contrast, consider how the same feature would work in a traditional React/Express SPA as built in earlier parts of Full Stack Open. The browser would first load the full React application bundle (JavaScript). Then, to display the notes, the React app would make an HTTP GET request to a REST API endpoint (e.g.&nbsp;<em>GET /api/notes</em>), receive the data as JSON, store it in component state, and render the list. Toggling between "show all" and "show important" would work the same way, purely in the client, since the data is already in state.

The key difference is in how the data gets to the browser. In the SPA model, the browser downloads the application code first, then fetches data separately via an API call. In the Next.js model, the server renders the Server Components and sends both the resulting HTML and the RSC payload in a single response. The RSC payload includes the serialized props for any Client Components, so the client component receives its data as props, not from an API call. This means the user sees content faster, there is no loading spinner while waiting for an API response, and less JavaScript needs to be shipped to the browser.

> We have mentioned the&nbsp;<a href="https://nextjs.org/docs/app/glossary#rsc-payload">RSC payload</a>&nbsp;a couple of times now. What exactly is it? The RSC payload is a compact, binary-like streaming format that React uses to send the result of server-rendered components to the browser. It is not HTML and not JSON. It is a custom serialization format that contains three things: the rendered output of Server Components as a virtual component tree, placeholders marking where Client Components should be inserted, and the serialized props that those Client Components need. In our case, the RSC payload includes the rendered HTML of the&nbsp;<em>Notes</em>&nbsp;Server Component, a marker saying "insert&nbsp;<em>NoteList</em>&nbsp;here," and the serialized notes array as the props for&nbsp;<em>NoteList</em>. When the browser receives this payload, React knows exactly where to place each Client Component and what props to give it, without needing a separate API call.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part3.

### Showing important notes only, server component solution

Let us rollback our solution for the filtering of important notes and see how to do a solution that in entirely based on the use of Server components.

The solution is quite different to the ones we have so far seen on the course. It looks as follows:

```ts
import Link from "next/link"
import { getNotes } from "../services/notes"

const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const allNotes = getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;div>
        &lt;Link href={showImportant ? "/notes" : "/notes?important=true"}>
          {showImportant ? "show all" : "show important only"}
        &lt;/Link>
      &lt;/div>
      &lt;ul>
        {notes.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link>
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

There is quite much to digest. Firstly, the toggle of the view mode is now a link:

```
&lt;Link href={showImportant ? "/notes" : "/notes?important=true"}&gt;
  {showImportant ? "show all" : "show important only"}
&lt;/Link&gt;

```

If user presses the link (that is initially&nbsp;<em>show important only</em>), not only the list of rendered notes is changed, but the change is also reflected in the url:

![صورة توضيحية](/images/mooc/0e4c4f5e2437.webp)

When the url changes, the component gets rendered again. And this is where the trick happens. The component gets the query parameters as the prop&nbsp;<a href="https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional">searchParams</a>, and it checks if the parameter&nbsp;<em>important</em>&nbsp;is defined there:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  // BEGIN HIGHLIGHT
  const { important } = await searchParams
  const showImportant = important === "true"
// END HIGHLIGHT

  const allNotes = getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

```

So the variable&nbsp;<em>showImportant</em>&nbsp;gets value&nbsp;<em>true</em>&nbsp;if the url is&nbsp;<em>"/notes?important=true"</em>, and that causes the shown notes to be filtered to just those that are important.

When user presses the toggle again (now it has the text "show all"), the url changes to&nbsp;<em>/notes</em>. The component is again rendered, and this time the query parameter&nbsp;<em>important</em>&nbsp;is not set, and no filtering is done, and all the notes are shown.

So the filtering is controlled entirely through the URL, and it is executed entirely on the server. No client-side JavaScript, no&nbsp;<em>useState</em>, no&nbsp;<em>"use client"</em>&nbsp;directive needed. When the user clicks the link, Next.js navigates to the new URL, the server re-renders the component with the updated query parameters, and sends back fresh HTML. The browser simply displays the result.

This approach is the idiomatic and preferred style in Next.js. The&nbsp;<a href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components">Next.js documentation</a>&nbsp;recommends keeping components as Server Components whenever possible and only reaching for Client Components when you truly need browser-side interactivity such as real-time UI updates without any navigation, animations, or access to browser-only APIs.

Using URL-based state (via search params) instead of client-side state has several advantages. The filter state is shareable: a user can copy the URL&nbsp;<em>/notes?important=true</em>&nbsp;and send it to someone else, and they will see the same filtered view. It also works with the browser's back and forward buttons out of the box. And since the entire component stays a Server Component, no extra JavaScript is shipped to the browser for the filtering logic.

Let us once more go through what happens under the hood when user navigates to&nbsp;<em>/notes</em>&nbsp;and presses&nbsp;<em>Show important</em>

<strong>Step 1: User goes to /notes</strong>
- The Notes server component renders. searchParams resolves to {}, so no important query param exists.
- So <em>showImportant</em> is false, and <em>allNotes</em> are rendered.
- The <em>Link</em> component renders with href="/notes?important=true" and text "show important only".

<strong>Step 2: User presses "show important only"</strong>
- The Notes server component re-renders on the server with searchParams resolving to <em>{ important: "true" }</em>.
- Now <em>showImportant</em> is true, so <em>allNotes</em> is filtered to only important notes that are rendered.
- The <em>Link</em> component now renders with href="/notes" and text "show all".

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part4.

<div class="tasks">

**3. Blog page**

</div>

<div class="tasks">

**4. Like button**

</div>

<div class="tasks">

**5. Rendered in order**

</div>

<div class="tasks">

**6. Search**

</div>
