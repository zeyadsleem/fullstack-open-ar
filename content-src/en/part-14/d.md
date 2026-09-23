---
part: 14
letter: d
title: "Authentication and more"
mainImage: /images/part-14.svg
lang: en
---
### Logging in

To add authentication to our Next.js app we use&nbsp;<a href="https://authjs.dev/">NextAuth.js</a>, the most popular authentication library for Next.js. NextAuth handles the entire authentication flow: sessions, callbacks, and provider integrations. We also need&nbsp;<a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a>&nbsp;to securely hash and compare passwords.

We start by installing the required packages:

```bash
npm install next-auth@beta bcryptjs &amp;&amp; npm install -D @types/bcryptjs
```

#### Schema change

Just like in the previous parts of the course, we need to store a hashed password for each user. The&nbsp;<em>users</em>&nbsp;table gets a new column:

```js
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""), // HIGHLIGHT LINE
})
```

The column is called&nbsp;<em>passwordHash</em>&nbsp;in TypeScript and maps to&nbsp;<em>password_hash</em>&nbsp;in the database. We store only the hash, never the plaintext password. The default value of an empty string lets us add the column to a table that already has rows without violating the not-null constraint.

As usual we then generate and apply the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

#### NextAuth configuration

The heart of the setup is the NextAuth configuration file&nbsp;<em>auth.ts</em>:

```js
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "../db"
import { users } from "../db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username as string),
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )

        if (!isValid) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
```

NextAuth supports many different&nbsp;<a href="https://authjs.dev/getting-started/providers">authentication providers</a>&nbsp;such as Google, GitHub, and Facebook. Here we use the&nbsp;<a href="https://authjs.dev/getting-started/authentication/credentials">Credentials provider</a>, which lets users log in with a username and password.

The&nbsp;<em>authorize</em>&nbsp;function is the core of the Credentials provider. It receives the values the user typed into the login form as&nbsp;<em>credentials</em>. It then looks up the user in the database by username, and uses&nbsp;<a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.compare</a>&nbsp;to check whether the submitted password matches the stored hash. If authentication succeeds, the function returns a user object that NextAuth will use to build the session. If it fails for any reason, it returns&nbsp;<em>null</em>, which causes NextAuth to reject the login attempt.

When authentication succeeds,&nbsp;<em>authorize</em>&nbsp;returns a plain object that NextAuth encodes into the JWT session token:

```
{
  id: String(user.id),
  name: user.name,
  email: user.username,
}
```

NextAuth's built-in session type has three fields:&nbsp;<em>id</em>,&nbsp;<em>name</em>, and&nbsp;<em>email</em>. We do not have an email address in our schema, so we reuse the&nbsp;<em>email</em>&nbsp;field to store the username instead. This is a deliberate workaround: NextAuth does not offer a built-in&nbsp;<em>username</em>&nbsp;field, and rather than extending the session type with custom TypeScript declarations, we reuse an existing field that serves the same purpose of uniquely identifying the user. The consequence is that wherever we later read the session on the server with&nbsp;<em>auth()</em>, we retrieve the username from&nbsp;<em>session.user.email</em>.

The&nbsp;<em>pages: { signIn: "/login" }</em>&nbsp;option tells NextAuth to use our own login page at&nbsp;<em>/login</em>&nbsp;instead of the built-in NextAuth sign-in page. Whenever NextAuth needs to redirect an unauthenticated user to log in, it will send them to&nbsp;<em>/login</em>. Without this option, NextAuth would redirect to its default page at&nbsp;<em>/api/auth/signin</em>, which is functional but unstyled and separate from the rest of the app.

The&nbsp;<em>session: { strategy: "jwt" }</em>&nbsp;option tells NextAuth to store session data in a signed&nbsp;<a href="https://jwt.io/">JSON Web Token</a>&nbsp;in a cookie, rather than in a server-side session store. This works well in serverless environments like Vercel where there is no shared memory between function instances.

#### What actually is the session

After a successful login, NextAuth creates a session and stores it as a signed JWT in an HTTP-only cookie in the browser. The cookie is sent automatically with every subsequent request. On the server, NextAuth verifies the signature and reads the token to know who the user is, without touching a database.

The token contains whatever the&nbsp;<em>authorize</em>&nbsp;function returned: in our case&nbsp;<em>id</em>,&nbsp;<em>name</em>, and&nbsp;<em>email</em>&nbsp;(which we used to store the username). These values are available through&nbsp;<em>useSession</em>&nbsp;on the client and through&nbsp;<em>auth()</em>&nbsp;on the server. Because the token is signed, it cannot be tampered with without the server detecting it.

#### Auth API route

NextAuth requires an&nbsp;<a href="https://authjs.dev/getting-started/installation#configure-your-next-js-application">API route</a>&nbsp;that handles all authentication requests (sign in, sign out, session checks). We create the file&nbsp;<em>app/api/auth/[...nextauth]/route.ts</em>:

```js
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

The [...nextauth] part is a Next.js&nbsp;<a href="https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment">catch-all route segment</a>&nbsp;that matches any path under&nbsp;<em>/api/auth/</em>, for example&nbsp;<em>/api/auth/signin</em>,&nbsp;<em>/api/auth/signout</em>, and&nbsp;<em>/api/auth/session</em>. NextAuth intercepts all of these and handles them automatically.

For now, NextAuth works here as a black box: we hand it our configuration and it takes care of all the authentication endpoints behind the scenes. The&nbsp;<em>[...nextauth]</em>&nbsp;directory name and the concept of API routes in Next.js are new to us. We will return to API routes later in the material.

#### Session provider and layout

Some parts of our UI need to have access to the session on the client side. The navigation bar is the clearest example: it could eg. show the logged-in user's name and a logout button when a session exists, and a login link when there is none. This kind of conditional rendering requires the session to be available in the browser, not just on the server.

NextAuth's client-side hooks like&nbsp;<em>useSession</em>&nbsp;share session data through React context, which requires a provider component to sit above any component that uses it. NextAuth ships its own&nbsp;<a href="https://authjs.dev/getting-started/session-management/get-session#client-side">SessionProvider</a>&nbsp;for exactly this purpose. Because it uses React context it must be a Client Component, and since we cannot place a Client Component directly in the root layout, we create a thin wrapper&nbsp;<em>app/components/SessionProvider.tsx</em>:

```js
"use client"

import { SessionProvider } from "next-auth/react"

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return &lt;SessionProvider>{children}&lt;/SessionProvider>
}
```

We then update&nbsp;<em>layout.tsx</em>&nbsp;to wrap the app inside&nbsp;<em>AuthSessionProvider</em>, giving every Client Component in the tree access to the session via&nbsp;<em>useSession</em>:

```js
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;AuthSessionProvider> // HIGHLIGHT LINE
          &lt;NavBar />
          {children}
        &lt;/AuthSessionProvider> // HIGHLIGHT LINE
      &lt;/body>
    &lt;/html>
  )
}
```

#### Navigation bar

The navigation bar needs to render differently depending on whether a user is logged in. Because the logout button calls&nbsp;<em>signOut()</em>&nbsp;in an&nbsp;<em>onClick</em>&nbsp;handler, the component must be a Client Component. It gets hold to the session via the&nbsp;<a href="https://authjs.dev/getting-started/session-management/get-session#client-side">useSession</a>&nbsp;hook, which pulls the value from the React context provided by&nbsp;<em>SessionProvider</em>. We place the component in&nbsp;<em>app/components/NavBar.tsx</em>:

```js
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav>
      &lt;Link href="/">home&lt;/Link>
      {" | "}
      &lt;Link href="/notes">notes&lt;/Link>
      {" | "}
      &lt;Link href="/users">users&lt;/Link>
      {" | "}
      // BEGIN HIGHLIGHT
      {session ? (
        &lt;>
          &lt;Link href="/notes/new">create new&lt;/Link>
          {" | "}
          &lt;em>{session.user?.name} logged in&lt;/em>{" "}
          &lt;button onClick={() => signOut()}>logout&lt;/button>
        &lt;/>
      ) : (
        &lt;Link href="/login">login&lt;/Link>
      )}
      // END HIGHLIGHT
    &lt;/nav>
  )
}
```

When a session exists, the navbar shows the logged-in user's name, a link to create a new note, and a logout button that calls&nbsp;<a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-out">signOut</a>. When there is no session, it shows a login link instead.

#### Login page

The login page lives at&nbsp;<em>app/login/page.tsx</em>. It is a Client Component because it handles form submission and manages local state for error messages:

```js
"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SubmitEvent&lt;HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid username or password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    &lt;div>
      &lt;h2>Login&lt;/h2>
      {error &amp;&amp; &lt;p style={{ color: "red" }}>{error}&lt;/p>}
      &lt;form onSubmit={handleSubmit}>
        &lt;div>
          &lt;label>
            Username
            &lt;input type="text" name="username" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Password
            &lt;input type="password" name="password" required />
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Login&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}
```

The form calls&nbsp;<a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-in">signIn</a>&nbsp;from&nbsp;<em>next-auth/react</em>&nbsp;with&nbsp;<em>redirect: false</em>, which means NextAuth will return the result as an object instead of automatically redirecting the browser. If authentication fails,&nbsp;<em>result.error</em>&nbsp;will be set and we display an error message. If it succeeds, we use the Next.js router to navigate to the home page and call&nbsp;<em>router.refresh()</em>&nbsp;to force the Server Components in the tree to re-render with the new session.

#### Reading the session on the server

For Server Components and Server Actions we cannot use&nbsp;<em>useSession</em>, since hooks only run in the browser. Instead Auth.js provides the&nbsp;<a href="https://authjs.dev/reference/nextjs#auth">auth</a>&nbsp;function, which reads the session from the request headers on the server side. We wrap this in a helper function&nbsp;<em>app/services/session.ts</em>:

```js
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users } from "../../db/schema"

export const getCurrentUser = async () => {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  return db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })
}
```

Recall that in the&nbsp;<em>authorize</em>&nbsp;function of&nbsp;<em>auth.ts</em>&nbsp;we stored the username in the&nbsp;<em>email</em>&nbsp;field of the returned user object. The&nbsp;<em>getCurrentUser</em>&nbsp;function retrieves that value from the session and fetches the full user record from the database.

#### Protecting the create note action

Now that authentication is in place, we can protect the&nbsp;<em>createNote</em>&nbsp;Server Action so that only logged-in users can create notes:

```js
export const createNote = async (formData: FormData) => {
  const session = await auth() // HIGHLIGHT LINE
  if (!session) { // HIGHLIGHT LINE
    redirect("/login") // HIGHLIGHT LINE
  } // HIGHLIGHT LINE

  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

If there is no active session, the user is redirected to the login page before any note is created.

We can also replace the random-user hack in&nbsp;<em>addNote</em>&nbsp;with a proper call to&nbsp;<em>getCurrentUser</em>:

```ts
import { getCurrentUser } from "./session"

export const addNote = async (content: string, important: boolean) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  await db.insert(notes).values({ content, important, userId: user.id })
}
```

#### Environment variables

NextAuth requires a secret key to sign the JWT session tokens. You can generate one eg. as follows:

```
echo "$(openssl rand -base64 32)"
```

Copy the output into&nbsp;<em>.env.local</em>&nbsp;manually:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-generated-secret-here
```

On Vercel, add&nbsp;<em>AUTH_SECRET</em>&nbsp;and&nbsp;<em>AUTH_URL</em>&nbsp;under&nbsp;<em>Settings &gt; Environment Variables</em>. The value of&nbsp;<em>AUTH_URL</em>&nbsp;is the public URL of your deployed app, for example&nbsp;<em><a href="https://your-app.vercel.app/">https://your-app.vercel.app</a></em>.

#### Setting passwords for existing users

After adding the&nbsp;<em>passwordHash</em>&nbsp;column, existing users in the database have an empty string as their password hash, which means they cannot log in yet. We need a way to set real passwords for them. Rather than doing this manually through Drizzle Studio, we can write a small utility script&nbsp;<em>set-password.ts</em>&nbsp;in the project root:

```ts
import { config } from "dotenv"
config({ path: ".env.local" })
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

async function setPassword(username: string, password: string) {
  const { db } = await import("./db")
  const { users } = await import("./db/schema")
  const hash = await bcrypt.hash(password, 10)
  await db
    .update(users)
    .set({ passwordHash: hash })
    .where(eq(users.username, username))
  console.log(`Password set for user: ${username}`)
}

const username = process.argv[2]
const password = process.argv[3]

if (!username || !password) {
  console.log("Usage: npx tsx set-password.ts &lt;username> &lt;password>")
  process.exit(1)
}

setPassword(username, password).then(() => process.exit(0))
```

The script reads a username and a plain-text password from the command-line arguments. It hashes the password with&nbsp;<a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.hash</a>&nbsp;using a cost factor of 10, then updates the matching user row in the database. The cost factor controls how computationally expensive the hash is to compute: higher values are slower to brute-force but also slower to verify on login. 10 is the commonly recommended default.

Run the script with&nbsp;<a href="https://tsx.is/">tsx</a>, which executes TypeScript files directly without a separate compilation step:

```bash
npx tsx set-password.ts mluukkai secretpassword
```

This script is naturally only a development utility.

### Authentication flow revisited

There are several moving parts in the authentication setup, so it is worth stepping back and tracing how they connect.

<strong>Login.</strong> The user fills in the login form on <em>/login</em>. The form's <em>onSubmit</em> handler calls <em>signIn("credentials", { redirect: false, ... }), which</em> is a function provided by NextAuth. Under the hood, NextAuth's <em>signIn</em> makes a <em>POST</em> request to the catch-all API route at <em>/api/auth/callback/credentials</em>. The route handler is defined in <em>app/api/auth/[...nextauth]/route.ts</em>, where <em>handlers</em> exported from <em>auth.ts</em> registers the GET and POST handlers for Next.js.

When the POST arrives, NextAuth's internal logic takes over and calls the <em>authorize</em> function from <em>auth.ts</em>. That function looks up the user in the database by username and uses <em>bcrypt.compare </em>to verify the password against the stored hash. If the credentials are valid, <em>authorize </em>returns a user object with <em>id</em>, <em>name</em>, and <em>email</em> (where we store the username). NextAuth takes that object, encodes it into a JWT signed with <em>AUTH_SECRET</em>, and sets it as an HTTP-only cookie in the response. An HTTP-only cookie cannot be read by JavaScript in the browser, only sent automatically with each subsequent request, which protects the token from XSS attacks. The login page then uses <em>router.push("/")</em> to navigate the user to the home page.

<strong>Client-side session.</strong> On the next render, the browser sends the cookie with every request. <em>AuthSessionProvider</em> (which wraps the whole app in the root layout) reads the cookie, verifies the JWT, and makes the session data available through React context. Any Client Component that calls <em>useSession()</em> receives the session from that context without any additional network request.

<strong>Server-side session.</strong> When a Server Component or Server Action needs to know who is logged in, it calls <em>auth().</em> NextAuth reads the signed JWT from the incoming request headers and returns the decoded session. The helper <em>getCurrentUser</em> wraps this call and additionally fetches the full user record from the database so that the rest of the application code gets a proper user object.

<strong>Protected actions.</strong> Server Actions that require authentication call <em>auth()</em> at the top and redirect to <em>/login</em> if the session is missing. Only after confirming a valid session is any database write performed.

The sequence diagram below shows the login and a subsequent protected note creation:

![صورة توضيحية](/images/mooc/0dd3e58ae8fd.webp)

### User registration

Now that we have authentication in place, let us implement a proper registration flow so that new users can create their own accounts instead of being added manually through Drizzle Studio.

We need a Server Action that hashes the password and inserts the new user into the database. Let us add it to a new file&nbsp;<em>app/actions/users.ts</em>:

```js
"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../db"
import { users } from "../../db/schema"

export const registerUser = async (formData: FormData) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}
```

The action reads&nbsp;<em>username</em>,&nbsp;<em>name</em>, and&nbsp;<em>password</em>&nbsp;from the form data, hashes the password with&nbsp;<em>bcrypt.hash</em>, inserts the new user, and redirects to the login page.

Since the action is a plain Server Action that always redirects on success, the registration page can be a simple Server Component with the form pointing directly at the action:

```js
import Link from "next/link"
import { registerUser } from "../actions/users"

export default function RegisterPage() {
  return (
    &lt;div>
      &lt;h2>Register&lt;/h2>
      &lt;form action={registerUser}>
        &lt;div>
          &lt;label>
            Username
            &lt;input type="text" name="username" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Name
            &lt;input type="text" name="name" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Password
            &lt;input type="password" name="password" required />
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Register&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}
```

Finally, add a link to the registration page in&nbsp;<em>NavBar.tsx</em>&nbsp;so that unauthenticated users can find it:

```js
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav>
      &lt;Link href="/">home&lt;/Link>
      {" | "}
      &lt;Link href="/notes">notes&lt;/Link>
      {" | "}
      &lt;Link href="/users">users&lt;/Link>
      {" | "}
      {session ? (
        &lt;>
          &lt;Link href="/notes/new">create new&lt;/Link>
          {" | "}
          &lt;em>{session.user?.name} logged in&lt;/em>{" "}
          &lt;button onClick={() => signOut()}>logout&lt;/button>
        &lt;/>
      ) : (
        &lt;>
          &lt;Link href="/login">login&lt;/Link>
          {" | "}
          &lt;Link href="/register">register&lt;/Link> // HIGHLIGHT LINE
        &lt;/>
      )}
    &lt;/nav>
  )
}
```

Now new users can register through the form, and there is no longer any need to set passwords manually with the&nbsp;<em>set-password.ts</em>&nbsp;script.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part8.

#### The @ path alias

You may have noticed that the import looked like this:

```js
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

The <em>@/</em> prefix is a path alias that maps to the root of your project. Instead of writing a relative path like <em>../../../auth</em>, you can always write <em>@/auth</em> regardless of how deeply nested the importing file is. This makes imports easier to read and refactor.

The alias is defined in&nbsp;<em>tsconfig.json</em>&nbsp;under&nbsp;<em>compilerOptions</em>:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

New Next.js projects created with&nbsp;<em>create-next-app</em>&nbsp;include this configuration by default. If your project does not have it, add the&nbsp;<em>paths</em>&nbsp;entry above and restart the TypeScript language server. Then you can clean up all the relative import chains across the codebase.

For example, in the file&nbsp;<em>app/actions/users.ts</em>&nbsp;instead of:

```js
import { db } from "../../db"
import { users } from "../../db/schema"
```

you can write:

```js
import { db } from "@/db"
import { users } from "@/db/schema"
```

Both resolve to the same files, but the <em>@/</em> versions are always unambiguous and do not break when you move a file to a different directory.

<div class="tasks">

**11. Login**

</div>

<div class="tasks">

**12. Registration**

</div>

### Error handling

Let us add some input validation to the note creation form. We want to enforce a minimum length of 10 characters for the note content.

#### Client-side validation

The simplest approach is to use the browser's built-in HTML validation. Adding <em>minLength={10}</em> to the input element prevents the form from being submitted at all if the content is too short:

```js
import { createNote } from "../../actions/notes"

const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={createNote}>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required minLength={10} /> // HIGHLIGHT LINE
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
```

This is fast and requires no extra code, but it only works in the browser. A user could bypass it entirely by sending an HTTP request directly to the Server Action endpoint. So client-side validation should always be backed up by server-side validation too.

The simplest server-side approach is to check the content in the Server Action and throw an error if it is invalid:

```js
export const createNote = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  // BEGIN HIGHLIGHT
  if (!content || content.length &lt; 10) {
    throw new Error("Note content must be at least 10 characters long")
  }
  // END HIGHLIGHT
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

Throwing an error from a Server Action causes Next.js to render the nearest&nbsp;<a href="https://nextjs.org/docs/app/getting-started/error-handling">error boundary</a>. This is suitable for unexpected failures, but for user-facing validation errors it is a poor experience: the user sees an error page instead of a helpful message next to the form.

#### Returning validation errors with useActionState

A better pattern for form validation is to return the error from the Server Action instead of throwing it, and then display the message inline in the form. React 19 provides the&nbsp;<a href="https://react.dev/reference/react/useActionState">useActionState</a>&nbsp;hook for exactly this purpose.

The Server Action needs to change its signature. Instead of taking only <em>formData</em>, it now also receives <em>prevState</em> as its first argument. This is the previous state returned by the action (or the initial value on the first render). The action doesn't actually use prevState here, it just needs to accept it so the signature matches what useActionState expects.

On a validation failure, it returns a new state object with an error message. On success, it still calls <em>redirect</em> as before:

```ts
export const createNote = async (
  prevState: { error: string }, // HIGHLIGHT LINE
  formData: FormData,
) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  if (!content || content.length &lt; 10) {
    return { error: "Note content must be at least 10 characters long" } // HIGHLIGHT LINE
  }
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

On the form side, the component becomes a Client Component so it can use the&nbsp;<em>useActionState</em>&nbsp;hook. The hook takes the action function and an initial state value, and returns the current state and a wrapped action to pass to the form:

```js
"use client" // HIGHLIGHT LINE

import { useActionState } from "react"
import { createNote } from "../../actions/notes"

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, { error: "" }) // HIGHLIGHT LINE

  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={formAction}> // HIGHLIGHT LINE
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
        {state.error &amp;&amp; &lt;p style={{ color: "red" }}>{state.error}&lt;/p>} // HIGHLIGHT LINE
      &lt;/form>
    &lt;/div>
  )
}
```

When the user submits the form with content that is too short, the Server Action returns&nbsp;<em>{ error: "..." }</em>.&nbsp;<em>useActionState</em>&nbsp;stores that as the new&nbsp;<em>state</em>, and the component re-renders showing the error message below the submit button. No page navigation happens. When the content is valid, the action calls&nbsp;<em>redirect("/notes")</em>&nbsp;as before and the user is sent to the notes list.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part9.

<div class="tasks">

**13. Validations in blog creation**

</div>

###

<div class="tasks">

**14. Blog creation form on error**

</div>

<div class="tasks">

**15. Validations in user registration**

</div>

#### More UI components: notification

Let us add a notification system to give the user feedback after actions like creating a note. We want to show a short message, for example "note created", that disappears automatically after a few seconds. This is a classic use case for&nbsp;<a href="https://react.dev/learn/passing-data-deeply-with-context">React Context</a>, which lets us share state across the component tree without passing props through every level. If React Context is not familiar to you, have a look at&nbsp;<a href="https://fullstackopen.com/en/part6/react_query_context_api">part 6</a>&nbsp;of the Full Stack Open course before continuing.

We create two files:&nbsp;<em>app/components/NotificationContext.tsx</em>&nbsp;holds the context definition and provider, and&nbsp;<em>app/components/Notification.tsx</em>&nbsp;is the component that renders the visible message.

The context file&nbsp;<em>NotificationContext.tsx</em>&nbsp;defines the shape of the notification state and exposes both the&nbsp;<em>NotificationProvider</em>&nbsp;wrapper and the&nbsp;<em>useNotification</em>&nbsp;hook:

```ts
"use client"

import { createContext, useContext, useState } from "react"

type NotificationType = "success" | "error"

type NotificationContextType = {
  message: string
  type: NotificationType
  showNotification: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext&lt;NotificationContextType>({
  message: "",
  type: "success",
  showNotification: () => {},
})

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [message, setMessage] = useState("")
  const [type, setType] = useState&lt;NotificationType>("success")

  const showNotification = (
    msg: string,
    notifType: NotificationType = "success",
  ) => {
    setMessage(msg)
    setType(notifType)
    setTimeout(() => setMessage(""), 5000)
  }

  return (
    &lt;NotificationContext value={{ message, type, showNotification }}>
      {children}
    &lt;/NotificationContext>
  )
}

export const useNotification = () => useContext(NotificationContext)
```

The context holds&nbsp;<em>message</em>&nbsp;and&nbsp;<em>type</em>&nbsp;as state. The&nbsp;<em>showNotification</em>&nbsp;function sets the message and schedules a&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/setTimeout">setTimeout</a>&nbsp;to clear it after 5 seconds.

> The <em>NotificationContextType</em> interface describes the shape of the context value: the current <em>message</em> string, the <em>type</em> that controls the colour of the banner, and the <em>showNotification</em> function. Passing this type as a generic parameter to <em>createContext&lt;NotificationContextType>(...) </em>tells TypeScript exactly what shape the context holds. The second argument is the default value used when a component calls useNotification outside of a NotificationProvider. Because we always wrap the entire app in NotificationProvider, this default is never used in practice, but TypeScript requires it, and it must match the declared type.

The&nbsp;<em>Notification</em>&nbsp;component reads from the context and renders the message:

```js
"use client"

import { useNotification } from "./NotificationContext"

export default function Notification() {
  const { message, type } = useNotification()

  if (!message) return null

  const style: React.CSSProperties = {
    padding: "10px 16px",
    marginBottom: "10px",
    borderRadius: "4px",
    color: "white",
    backgroundColor: type === "success" ? "#16a34a" : "#dc2626",
  }

  return &lt;div style={style}>{message}&lt;/div>
}
```

When&nbsp;<em>message</em>&nbsp;is empty the component returns&nbsp;<em>null</em>&nbsp;and renders nothing. When a message is set, it renders a coloured banner: green for&nbsp;<em>"success"</em>&nbsp;and red for&nbsp;<em>"error"</em>.

To make the notification available throughout the app we wrap the layout with&nbsp;<em>NotificationProvider</em>&nbsp;and place&nbsp;<em>Notification</em>&nbsp;just below the navigation bar, so it appears at the top of every page. The updated&nbsp;<em>app/layout.tsx</em>&nbsp;looks like this:

```js
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"
import { NotificationProvider } from "./components/NotificationContext"
import Notification from "./components/Notification"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;AuthSessionProvider>
          &lt;NotificationProvider>
            &lt;NavBar />
            &lt;Notification />
            {children}
          &lt;/NotificationProvider>
        &lt;/AuthSessionProvider>
      &lt;/body>
    &lt;/html>
  )
}
```

<em>AuthSessionProvider</em>&nbsp;remains the outermost wrapper because NextAuth's&nbsp;<em>SessionProvider</em>&nbsp;must also be a Client Component context.&nbsp;<em>NotificationProvider</em>&nbsp;sits inside it, so both contexts are available to all Client Components in the tree.

#### Showing a notification after note creation

The current note creation flow calls&nbsp;<em>redirect("/notes")</em>&nbsp;inside the Server Action, which means there is no natural place to trigger a client-side notification before the navigation happens. We need to change the approach slightly: instead of redirecting inside the action, we return a&nbsp;<em>success</em>&nbsp;flag and let the client component handle both the notification and the redirect.

The updated&nbsp;<em>createNote</em>&nbsp;action in&nbsp;<em>app/actions/notes.ts</em>&nbsp;returns a state object instead of redirecting on success:

```ts
export const createNote = async (
  prevState: { error: string; success?: boolean },
  formData: FormData,
) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  if (!content || content.length &lt; 10) {
    // BEGIN HIGHLIGHT
    return {
      error: "Note content must be at least 10 characters long",
      success: false,
    }
    // END HIGHLIGHT
  }
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  return { error: "", success: true } // HIGHLIGHT LINE
}
```

On a validation failure the action returns&nbsp;<em>{ error: "...", success: false }</em>. On success it calls&nbsp;<em>revalidatePath</em>&nbsp;to invalidate the cached notes list and returns&nbsp;<em>{ error: "", success: true }</em>. The redirect is no longer in the action.

The&nbsp;<em>NewNote</em>&nbsp;component now uses&nbsp;<em>useEffect</em>&nbsp;to watch for the&nbsp;<em>success</em>&nbsp;flag in the form state. When it becomes&nbsp;<em>true</em>, it calls&nbsp;<em>showNotification</em>&nbsp;and then navigates programmatically with&nbsp;<em>router.push</em>:

```js
"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createNote } from "../../actions/notes"
import { useNotification } from "../../components/NotificationContext"

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, {
    error: "",
    success: false,
  })
  const { showNotification } = useNotification()
  const router = useRouter()

// BEGIN HIGHLIGHT
  useEffect(() => {
    if (state.success) {
      showNotification("note created")
      router.push("/notes")
    }
  }, [state, showNotification, router])
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={formAction}>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
        {state.error &amp;&amp; &lt;p style={{ color: "red" }}>{state.error}&lt;/p>}
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

The&nbsp;<a href="https://react.dev/reference/react/useEffect">useEffect</a>&nbsp;hook runs after every render where&nbsp;<em>state</em>&nbsp;changes. When&nbsp;<em>state.success</em>&nbsp;is&nbsp;<em>true</em>, it triggers the notification and the navigation. Because&nbsp;<em>showNotification</em>&nbsp;stores the message in context, the&nbsp;<em>Notification</em>&nbsp;component rendered in&nbsp;<em>layout.tsx</em>&nbsp;will pick it up and display the green banner on the&nbsp;<em>/notes</em>&nbsp;page after the redirect.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part10.

#### Where to put components

Our application now has components spread across several directories. It is worth pausing to explain the conventions we follow.

The&nbsp;<em>app/components/</em>&nbsp;directory is for shared UI components that are used in more than one place in the app, or that belong to the global layout rather than to any specific page.&nbsp;<em>NavBar</em>,&nbsp;<em>Notification</em>, and&nbsp;<em>NotificationContext</em>&nbsp;all fit here: they are rendered from the root layout and consumed by many different pages and actions.

Components that belong to a single page live alongside that page in its own directory. For example, the&nbsp;<em>NoteList</em>&nbsp;component that we had in chapter&nbsp;<a href="https://file+.vscode-resource.vscode-cdn.net/Users/mluukkai/opetus/2026-fs/osa14/materiaali/plan.md">Showing important notes only, client component solution</a>&nbsp;is only ever rendered on the notes listing page, so it would go in&nbsp;<em>app/notes/</em>, not in&nbsp;<em>app/components/</em>. This keeps each feature self-contained: you can look at a page's folder and immediately see all the pieces it is built from.

As a rule of thumb: if a component is imported from more than one route, move it to&nbsp;<em>app/components/</em>. If it is used by exactly one route, keep it in that route's folder.

### Styling the app with Tailwind CSS

So far we have used inline&nbsp;<em>style</em>&nbsp;objects for the handful of cases where we needed any styling. For a real application we need a proper approach to CSS. The dominant choice in the Next.js ecosystem is&nbsp;<a href="https://tailwindcss.com/">Tailwind CSS</a>, a utility-first CSS framework.

> <strong>Note on component libraries:</strong>&nbsp;You might wonder why we are not using a component library like&nbsp;<a href="https://mui.com/">Material-UI</a>&nbsp;that we have used in earlier parts of the course. While these libraries can be used with Next.js, they require additional configuration to work properly with Server Components and the App Router. Most component libraries rely heavily on client-side JavaScript and need special setup for server-side rendering and hydration. Tailwind's utility-first approach aligns better with Next.js's server-first architecture and works seamlessly with both Server and Client Components without extra configuration.

The idea behind Tailwind is different from traditional CSS frameworks like MaterialUI or Bootstrap. Instead of providing pre-built components with fixed styles, Tailwind gives you a large set of small, single-purpose utility classes, such as&nbsp;<a href="https://tailwindcss.com/docs/flex">flex</a>,&nbsp;<a href="https://tailwindcss.com/docs/padding">p-4</a>,&nbsp;<a href="https://tailwindcss.com/docs/text-color">text-gray-800</a>, and&nbsp;<a href="https://tailwindcss.com/docs/border-radius">rounded</a>, that you compose directly in the markup. There is no separate CSS file to maintain and no risk of one component's styles leaking into another.

New Next.js projects created with&nbsp;<em>create-next-app</em>&nbsp;can include Tailwind automatically. If you are adding it to an existing project, follow the&nbsp;<a href="https://tailwindcss.com/docs/guides/nextjs">installation guide</a>&nbsp;in the Tailwind documentation.

With Tailwind in place, styling is done by adding class names to JSX elements. The&nbsp;<em>body</em>&nbsp;in&nbsp;<em>app/layout.tsx</em>&nbsp;can be given a background and text colour:

```js
import "./globals.css" // HIGHLIGHT LINE
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"
import { NotificationProvider } from "./components/NotificationContext"
import Notification from "./components/Notification"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body className="min-h-screen bg-background text-foreground"> // HIGHLIGHT LINE
        &lt;AuthSessionProvider>
          &lt;NotificationProvider>
            &lt;NavBar />
            &lt;Notification />
            &lt;main>{children}&lt;/main>
          &lt;/NotificationProvider>
        &lt;/AuthSessionProvider>
      &lt;/body>
    &lt;/html>
  )
}
```

<a href="https://tailwindcss.com/docs/min-height">min-h-screen</a>&nbsp;ensures the body stretches to fill the full viewport height, while&nbsp;<a href="https://tailwindcss.com/docs/background-color">bg-background</a>&nbsp;and&nbsp;<a href="https://tailwindcss.com/docs/text-color">text-foreground</a>&nbsp;apply the theme's default background and text colours as CSS custom properties defined in&nbsp;<em>globals.css</em>. The file is created by&nbsp;<em>create-next-app</em>&nbsp;and looks like this:

```js
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

The <em>@import "tailwindcss"</em> line loads all of Tailwind's utilities. The <em>--background</em> and <em>--foreground</em> CSS variables are defined in <em>:root</em> and automatically switch to dark-mode values when the user's operating system prefers a dark colour scheme. The <em>@theme inline</em> block maps those variables into Tailwind's colour palette so that classes like <em>bg-background</em> and <em>text-foreground</em> resolve to the correct values.

The notes listing page gets a constrained, centred layout with spacing between list items:

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
  const notes = await getNotes(showImportant)

  return (
    &lt;div className="max-w-2xl mx-auto p-6">
      &lt;h2 className="text-2xl font-bold mb-4">Notes&lt;/h2>
      &lt;div className="mb-4">
        &lt;Link
          href={showImportant ? "/notes" : "/notes?important=true"}
          className="text-blue-600 hover:underline"
        >
          {showImportant ? "show all" : "show important only"}
        &lt;/Link>
      &lt;/div>
      &lt;ul className="space-y-2">
        {notes.map((note) => (
          &lt;li key={note.id} className="border rounded p-3 hover:bg-gray-50">
            &lt;Link
              href={`/notes/${note.id}`}
              className="text-blue-600 hover:underline"
            >
              {note.content}
            &lt;/Link>
            {note.important &amp;&amp; (
              &lt;strong className="ml-2 text-amber-600">(important)&lt;/strong>
            )}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

<a href="https://tailwindcss.com/docs/max-width"><em>max-w-2xl</em></a>&nbsp;constrains the content width,&nbsp;<a href="https://tailwindcss.com/docs/margin"><em>mx-auto</em></a>&nbsp;centres it with automatic horizontal margins, and&nbsp;<a href="https://tailwindcss.com/docs/padding"><em>p-6</em></a>&nbsp;adds inner spacing.&nbsp;<a href="https://tailwindcss.com/docs/font-size"><em>text-2xl</em></a>&nbsp;and&nbsp;<a href="https://tailwindcss.com/docs/font-weight"><em>font-bold</em></a>&nbsp;make the heading large and bold, while&nbsp;<a href="https://tailwindcss.com/docs/margin"><em>mb-4</em></a>&nbsp;adds spacing below it.&nbsp;<a href="https://tailwindcss.com/docs/space"><em>space-y-2</em></a>&nbsp;adds vertical spacing between list items, and&nbsp;<a href="https://tailwindcss.com/docs/border-width"><em>border</em></a>&nbsp;<a href="https://tailwindcss.com/docs/border-radius"><em>rounded</em></a>&nbsp;<a href="https://tailwindcss.com/docs/padding"><em>p-3</em></a>&nbsp;<a href="https://tailwindcss.com/docs/background-color"><em>hover:bg-gray-50</em></a>&nbsp;gives each note a soft card appearance with a hover highlight.

And the navigation bar becomes a dark horizontal bar with links spaced apart:

```sql
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

const NavBar = () => {
  const { data: session } = useSession()

  return (
    &lt;nav className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4">
      &lt;Link href="/" className="hover:text-gray-300">
        home
      &lt;/Link>
      &lt;Link href="/notes" className="hover:text-gray-300">
        notes
      &lt;/Link>
      &lt;Link href="/users" className="hover:text-gray-300">
        users
      &lt;/Link>
      &lt;div className="ml-auto flex items-center gap-4">
        {session ? (
          &lt;>
            &lt;Link href="/notes/new" className="hover:text-gray-300">
              create new
            &lt;/Link>
            &lt;em className="text-gray-300">{session.user?.name} logged in&lt;/em>
            &lt;button
              onClick={() => signOut()}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              logout
            &lt;/button>
          &lt;/>
        ) : (
          &lt;>
            &lt;Link href="/login" className="hover:text-gray-300">
              login
            &lt;/Link>
            &lt;Link href="/register" className="hover:text-gray-300">
              register
            &lt;/Link>
          &lt;/>
        )}
      &lt;/div>
    &lt;/nav>
  )
}

export default NavBar
```

The class names read almost like prose:&nbsp;<a href="https://tailwindcss.com/docs/background-color"><em>bg-gray-800</em></a>&nbsp;sets a dark background,&nbsp;<a href="https://tailwindcss.com/docs/text-color"><em>text-white</em></a>&nbsp;makes the text white,&nbsp;<a href="https://tailwindcss.com/docs/padding"><em>px-6</em></a>&nbsp;and&nbsp;<a href="https://tailwindcss.com/docs/padding"><em>py-3</em></a>&nbsp;add horizontal and vertical padding,&nbsp;<a href="https://tailwindcss.com/docs/flex"><em>flex</em></a>&nbsp;<a href="https://tailwindcss.com/docs/align-items"><em>items-center</em></a>&nbsp;<a href="https://tailwindcss.com/docs/gap"><em>gap-4</em></a>&nbsp;lays the children out in a row with spacing, and&nbsp;<a href="https://tailwindcss.com/docs/margin"><em>ml-auto</em></a>&nbsp;pushes the session-dependent section to the right edge. Tailwind's&nbsp;<a href="https://tailwindcss.com/docs">documentation</a>&nbsp;has a searchable reference for every utility class.

You may notice that the same&nbsp;<em>className="hover:text-gray-300"</em>&nbsp;string appears on every navigation link. When a Tailwind class combination is repeated many times, extracting a small helper component might be a good idea.

The&nbsp;<em>NavLink</em>&nbsp;component is saved in&nbsp;<em>app/components/NavLink.tsx</em>:

```ts
import Link from "next/link"

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    &lt;Link href={href} className="hover:text-gray-300">
      {children}
    &lt;/Link>
  )
}

export default NavLink
```

With <em>NavLink</em> in place, each navigation item in <em>NavBar</em> becomes <em>&lt;NavLink href="...">label&lt;/NavLink></em> instead of a <em>&lt;Link></em> with a repeated <em>className</em>. The session-dependent logout button keeps its own inline styling because it has a different visual treatment and is not repeated elsewhere:

```js
"use client"

import { useSession, signOut } from "next-auth/react"
import NavLink from "./NavLink"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4">
      &lt;NavLink href="/">home&lt;/NavLink>
      &lt;NavLink href="/notes">notes&lt;/NavLink>
      &lt;NavLink href="/users">users&lt;/NavLink>
      &lt;div className="ml-auto flex items-center gap-4">
        {session ? (
          &lt;>
            &lt;NavLink href="/notes/new">create new&lt;/NavLink>
            &lt;em className="text-gray-300">{session.user?.name} logged in&lt;/em>
            &lt;button
              onClick={() => signOut()}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              logout
            &lt;/button>
          &lt;/>
        ) : (
          &lt;>
            &lt;NavLink href="/login">login&lt;/NavLink>
            &lt;NavLink href="/register">register&lt;/NavLink>
          &lt;/>
        )}
      &lt;/div>
    &lt;/nav>
  )
}
```

Another approach to achieve the same is to use Tailwind's&nbsp;<a href="https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes">@layer components</a>&nbsp;directive in your CSS file. This lets you define custom CSS classes that combine multiple Tailwind utilities, without creating a separate React component. Both approaches work well: extracting a React component keeps the styling logic in the same place as the component structure, while the CSS layer approach keeps all styling definitions together in one CSS file.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part11.

#### Learning and applying Tailwind

The best way to get comfortable with Tailwind is to use it hands-on and keep the&nbsp;<a href="https://tailwindcss.com/docs">documentation</a>&nbsp;open in a browser tab. The docs have a search bar that finds any utility class by keyword. Type "padding" and you get the full list of&nbsp;<em>p-</em>,&nbsp;<em>px-</em>,&nbsp;<em>py-</em>,&nbsp;<em>pt-</em>&nbsp;classes and their values. Type "flex" and you see everything related to flexbox layout. After a short time the most common classes become muscle memory.

There are also good video tutorials on YouTube, for example&nbsp;<a href="https://www.youtube.com/watch?v=6biMWgD6_JY">Master Tailwind in One Hour</a>&nbsp;and&nbsp;<a href="https://www.youtube.com/watch?v=bnfhmr1v028">Tailwind CSS in React Crash Course 2026</a>, which provide quick but comprehensive introductions to Tailwind's core concepts and utilities.

The&nbsp;<a href="https://play.tailwindcss.com/">Tailwind Playground</a>&nbsp;is an excellent tool for experimenting with Tailwind classes in the browser without any setup. You can write HTML with Tailwind classes and see the results instantly, making it perfect for testing out combinations or learning how different utilities work together.

A few practical tips:
- Start with layout first. Get the outer shells right with <em>flex</em>, <em>grid</em>, <em>max-w-</em>, and spacing utilities before worrying about colours or typography.
- Use the <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">Tailwind CSS IntelliSense</a> VS Code extension. It autocompletes class names, shows the underlying CSS on hover, and highlights unknown classes.
- When you find yourself repeating the same set of classes on many elements, that is a signal to extract a small component, as we did with <em>NavLink</em>.
- The <a href="https://nerdcave.com/tailwind-cheat-sheet">Tailwind Cheat Sheet</a> is a useful quick reference that fits all the common classes on one page.

Once you are comfortable with Tailwind for layout and spacing, you will likely want ready-made interactive components such as dialogs, dropdowns, and date pickers. Building those from scratch with raw Tailwind takes significant effort. This is where&nbsp;<a href="https://ui.shadcn.com/">shadcn/ui</a>&nbsp;comes in: it is a collection of accessible, polished components built on top of Tailwind and&nbsp;<a href="https://www.radix-ui.com/">Radix UI</a>&nbsp;primitives. Unlike most component libraries, shadcn/ui does not ship as an npm package. Instead, you copy individual components directly into your project with a CLI command, so the code lives in your repository and you can modify it freely. We will look at shadcn/ui in more detail in the next section.

### Exercises

<div class="tasks">

**16. Styled notification with context**

</div>

<div class="tasks">

**17. More styling**

</div>

### More about Drizzle: SQL query API

Throughout this material we have used Drizzle's&nbsp;<a href="https://orm.drizzle.team/docs/rqb">relational query API</a>: calls like&nbsp;<em>db.query.notes.findMany()</em>&nbsp;and&nbsp;<em>db.query.users.findFirst({ with: { notes: true } })</em>. This API is convenient because it handles joins automatically based on the relation definitions in&nbsp;<em>schema.ts</em>&nbsp;and returns typed, nested objects.

Drizzle also offers a lower-level&nbsp;<a href="https://orm.drizzle.team/docs/select">SQL query builder</a>&nbsp;that maps more directly to SQL syntax. The same query that fetches all important notes looks like this with the SQL API:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { notes } from "../../db/schema"

const importantNotes = await db
  .select()
  .from(notes)
  .where(eq(notes.important, true))
```

And fetching a user together with their notes using an explicit join:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users, notes } from "../../db/schema"

const result = await db
  .select()
  .from(users)
  .leftJoin(notes, eq(notes.userId, users.id))
  .where(eq(users.id, 1))
```

This gives you a flat array of rows (one per joined note), which you then aggregate yourself, unlike the relational API which gives you a nested object.

The SQL API is useful when you need precise control over the query shape, want to use SQL features that the relational API does not expose, or are writing something complex enough that the explicit join is clearer. For everyday CRUD operations, the relational API is more convenient. Both APIs are fully typed and can be mixed freely in the same project.

### API routes

So far we have fetched and mutated data using Server Components and Server Actions. Next.js also supports traditional&nbsp;<a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">API routes</a>, also called Route Handlers, which let you expose HTTP endpoints that return arbitrary responses, typically JSON.

We have already used one API route without paying much attention to it: the NextAuth catch-all handler at&nbsp;<em>app/api/auth/[...nextauth]/route.ts</em>. That file exports a handler function for both GET and POST and NextAuth intercepts every request under&nbsp;<em>/api/auth/</em>&nbsp;automatically. We treated it as a black box at the time, but the file is just a regular Next.js Route Handler.

#### How Route Handlers work

A Route Handler is a file named&nbsp;<em>route.ts</em>&nbsp;(or&nbsp;<em>route.js</em>) inside the&nbsp;<em>app</em>&nbsp;directory. It exports named async functions corresponding to HTTP methods:&nbsp;<em>GET</em>,&nbsp;<em>POST</em>,&nbsp;<em>PUT</em>,&nbsp;<em>PATCH</em>,&nbsp;<em>DELETE</em>, and so on.

Let us add a simple read-only endpoint to our app that returns the list of notes as JSON. We create the file&nbsp;<em>app/api/notes/route.ts</em>:

```js
import { NextResponse } from "next/server"
import { getNotes } from "../../services/notes"

export const GET = async () => {
  const notes = await getNotes(false)
  return NextResponse.json(notes)
}
```

Visiting&nbsp;<em>/api/notes</em>&nbsp;in the browser (or with&nbsp;<em>curl</em>) now returns the notes array as JSON:

```json
[
  { "id": 1, "content": "next.js utilizes React Server Components", "important": true, "userId": 1 },
  { "id": 2, "content": "next.js is built on top of React", "important": true, "userId": 1 }
]
```

An endpoint that allows creating a note via POST could look like this:

```js
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { addNote } from "../../services/notes"
import { revalidatePath } from "next/cache"

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { content, important = false } = body

  if (!content || content.length &lt; 10) {
    return NextResponse.json(
      { error: "Content must be at least 10 characters" },
      { status: 400 },
    )
  }

  await addNote(content, important)
  revalidatePath("/notes")
  return NextResponse.json({ success: true }, { status: 201 })
}
```

The&nbsp;<em>POST</em>&nbsp;handler reads the request body as JSON with&nbsp;<em>req.json()</em>, validates the content, and calls the same&nbsp;<em>addNote</em>&nbsp;service function that the Server Action uses. Authentication is checked with&nbsp;<em>getServerSession</em>, and if there is no session an HTTP 401 is returned.

#### When to use API routes vs. Server Actions

The two approaches overlap, but the rule of thumb is straightforward.

Use&nbsp;<strong>Server Actions</strong>&nbsp;when the consumer is your own Next.js UI, such as a form submission or a button click. Server Actions are tied to the React rendering model, benefit from built-in caching and revalidation integration, and do not require you to write any fetch calls on the client.

Use&nbsp;<strong>API routes</strong>&nbsp;when you need an HTTP endpoint that can be called by something outside your Next.js app, for example a mobile app, a third-party service webhook, or a separate frontend. API routes speak plain HTTP and return standard JSON responses, which makes them easy to consume from anywhere.

In our application the Server Actions cover all the UI needs. The&nbsp;<em>/api/auth/</em>&nbsp;routes are there because NextAuth requires standard HTTP endpoints to handle the authentication flow, which involves browser redirects and cookie setting that the Server Action model is not designed for. That is the reason we needed Route Handlers for authentication even though the rest of the app uses Server Actions.

### Exercises

<div class="tasks">

**18. My page with API token access**

</div>

<div class="tasks">

**19. My page with API token access**

</div>

<div class="tasks">

**20. Reading list**

</div>

<div class="tasks">

**21. Better reading list**

</div>

### Some loose ends

#### Suspense and streaming

When a Server Component fetches data, the entire page waits for the data before anything is sent to the browser. For slow queries this means the user stares at a blank screen. React's&nbsp;<a href="https://react.dev/reference/react/Suspense">Suspense</a>&nbsp;boundary solves this by letting you stream parts of the UI as they become ready.

The simplest way to add loading UI to a route is to create a&nbsp;<a href="https://nextjs.org/docs/app/api-reference/file-conventions/loading">loading.tsx</a>&nbsp;file in the same directory as&nbsp;<em>page.tsx</em>. Next.js automatically wraps the page in a Suspense boundary and shows the loading component while the page is being prepared:

```js
<em>// app/notes/loading.tsx</em>
const Loading = () =&gt; {
  return &lt;p&gt;Loading notes...&lt;/p&gt;
}

export default Loading

```

Now when the user navigates to&nbsp;<em>/notes</em>, they immediately see "Loading notes..." while the Server Component fetches data. Once the data is ready, Next.js streams the actual page content and replaces the loading state.

For more fine-grained control, you can manually wrap individual components in <em>&lt;Suspense> </em>boundaries. This is useful when a page has several independent data-fetching sections, and you want each to load independently rather than waiting for the entire page:

```js
import { Suspense } from "react"
import NoteList from "./NoteList"
import Statistics from "./Statistics"

const Notes = () => {
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;Suspense fallback={&lt;p>Loading notes...&lt;/p>}>
        &lt;NoteList />
      &lt;/Suspense>
      &lt;Suspense fallback={&lt;p>Loading statistics...&lt;/p>}>
        &lt;Statistics />
      &lt;/Suspense>
    &lt;/div>
  )
}
```

Each wrapped component can be an async Server Component that fetches its own data. Next.js streams each fallback immediately and replaces it with the real content as soon as that component finishes, so slow sections do not block fast ones.

#### Optimizing images with next/image

In regular HTML, you would load an image with an <em>&lt;img></em> tag:

```
&lt;img src="/profile.jpg" alt="User profile" width="200" height="200" />
```

This works, but browsers load the full-size image regardless of the device screen size, and there is no automatic optimization. Next.js provides the&nbsp;<a href="https://nextjs.org/docs/app/api-reference/components/image">Image</a>&nbsp;component that automatically optimizes images for performance:

```js
import Image from "next/image"

const Profile = () => {
  return (
    &lt;div>
      &lt;Image
        src="/profile.jpg"
        alt="User profile"
        width={200}
        height={200}
      />
    &lt;/div>
  )
}

export default Profile
```

The Image component offers several key benefits:
- <strong>Automatic format optimization:</strong> Next.js serves modern formats like WebP and AVIF to browsers that support them, falling back to the original format for older browsers.
- <strong>Responsive images:</strong> The component automatically generates multiple sizes of the image and serves the appropriate one based on the user's device.
- <strong>Lazy loading:</strong> Images outside the viewport are not loaded until the user scrolls near them, reducing initial page load time.
- <strong>Prevents layout shift:</strong> By requiring explicit <code>width</code> and <code>height</code> props (or using <code>fill</code>), the browser reserves space before the image loads, preventing content from jumping around.

For images stored in the <em>public</em> folder, the path starts with <em>/</em>:

```
&lt;Image src="/images/logo.png" alt="Logo" width={100} height={50} />
```

For external images hosted on other domains, you need to configure the allowed domains in&nbsp;<em>next.config.js</em>:

```js
<em>/** @type {import('next').NextConfig} */</em>
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig
```

Then you can use the external URL:

```
&lt;Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
/>
```

If you do not know the image dimensions ahead of time (for example, user-uploaded images), you can use the <em>fill</em> prop to make the image fill its parent container:

```
&lt;div style={{ position: 'relative', width: '100%', height: '400px' }}>
  &lt;Image
    src="/dynamic-image.jpg"
    alt="Dynamic content"
    fill
    style={{ objectFit: 'cover' }}
  />
&lt;/div>
```

The parent container must have <em>position: relative</em>, <em>position: fixed</em>, or <em>position: absolute</em> for <em>fill</em> to work correctly.

The Image component is one of the most important performance optimizations in Next.js. Using it instead of plain <em>&lt;img></em> tags ensures your images are delivered efficiently across all devices and network conditions.

#### Metadata and SEO

Next.js has a built-in <a href="https://nextjs.org/docs/app/getting-started/metadata-and-og-images">Metadata API</a> for setting the page title, description, and other <em>&lt;head></em> tags in a way that works correctly with Server Components and streaming.

The simplest form is a static&nbsp;<em>metadata</em>&nbsp;export in a&nbsp;<em>page.tsx</em>&nbsp;or&nbsp;<em>layout.tsx</em>&nbsp;file:

```js
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notes app",
  description: "A simple notes application built with Next.js",
}
```

Next.js merges metadata from the root layout down through nested layouts and pages, so a child page can override just the fields it needs without repeating everything.

For dynamic pages where the title depends on data, you export a&nbsp;<em>generateMetadata</em>&nbsp;function instead:

```ts
import type { Metadata } from "next"
import { getNoteById } from "../../services/notes"

export const generateMetadata = async ({
  params,
}: {
  params: Promise&lt;{ id: string }>
}): Promise&lt;Metadata> => {
  const { id } = await params
  const note = await getNoteById(Number(id))
  return {
    title: note ? note.content.slice(0, 50) : "Note not found",
  }
}
```

This runs on the server, and the resolved title appears in the HTML <em>&lt;title></em> tag, which is important for search engines and for the browser tab label. Open Graph tags for social sharing follow the same pattern using the <em>openGraph</em> key inside the metadata object.

### Exercises

<div class="tasks">

**22. Static homepage from markdown**

</div>

```
.markdown h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1.5rem 0 1rem;
}

.markdown h2 {
  font-size: 1.875rem;
  font-weight: bold;
  margin: 2rem 0 0.75rem;
}

.markdown h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
}

.markdown p {
  margin: 1rem 0;
  line-height: 1.7;
}

.markdown a {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown a:hover {
  color: #2563eb;
}

.markdown ul {
  margin: 1rem 0;
  padding-left: 2rem;
  line-height: 1.7;
  list-style-type: disc;
}

.markdown ol {
  margin: 1rem 0;
  padding-left: 2rem;
  line-height: 1.7;
  list-style-type: decimal;
}

.markdown li {
  margin: 0.5rem 0;
}

.markdown hr {
  margin: 2rem 0;
  opacity: 0.2;
}
```

<div class="tasks">

**23. Finishing touches**

</div>

<div class="tasks">

**24. The final check**

</div>

<div class="tasks">

**25. Your GitHub repository**

</div>
