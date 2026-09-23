---
part: 14
letter: c
title: "Databases, Migrations, and Relations"
mainImage: /images/part-14.svg
lang: en
---
### Deployment to Vercel

In earlier parts of Full Stack Open, we deployed the backend to&nbsp;<a href="https://render.com/">Render</a>&nbsp;or&nbsp;<a href="https://fly.io/">Fly.io</a>. With Next.js, the most natural deployment target is&nbsp;<a href="https://vercel.com/">Vercel</a>, the company that created and maintains Next.js. Vercel's platform is built specifically around Next.js, so features like Server Components, Server Actions, static rendering, and revalidation work out of the box without any extra configuration.

To deploy, first push your Notes App code to a GitHub repository. Then:
- Go to <a href="https://vercel.com/">vercel.com</a> and sign up (or log in) with your GitHub account
- Click <em>Add New...</em> and then <em>Project</em>
- Select the GitHub repository containing your Next.js app (note that it might take time until your repository becomes visible)
- Vercel automatically detects that it is a Next.js project and configures the build settings. Just click <em>Deploy</em>

That is it. After a short build, Vercel gives you a public URL (something like&nbsp;<em><a href="https://notes-app-yourname.vercel.app/">https://notes-app-yourname.vercel.app</a></em>) where your app is live:

![صورة توضيحية](/images/mooc/5681d9fdef75.webp)

Every time you push new commits to the main branch, Vercel automatically rebuilds and redeploys the app. If you push to a different branch or open a pull request, Vercel creates a&nbsp;<em>preview deployment</em>&nbsp;with its own unique URL, so you can test changes before merging.

Our app seems to work, until we try to create new notes. Something strange seems to be going on. A newly created note might appear briefly, then vanish on the next page load. Or it might not appear at all.

The reason is that on Vercel, Server Components and Server Actions run as&nbsp;<a href="https://en.wikipedia.org/wiki/Serverless_computing">serverless functions</a>. Each request may be handled by a different function instance, and these instances do not share memory. They can be spun up or shut down at any time. Our current approach of storing notes in an in-memory JavaScript array is fundamentally broken in this environment. When a Server Action adds a note to the array, that change only exists in the memory of one particular instance. The next request might be handled by a completely different instance that has a fresh copy of the original hardcoded array. Even if the same instance happens to handle both requests, it will eventually be shut down after some idle time, and all in-memory data is lost.

During development with&nbsp;<em>npm run dev</em>, everything runs in a single long-lived Node.js process, so the in-memory array works perfectly. This is yet another gap between development and production to be aware of.

The solution is to store data in an external database that all serverless function instances can access. Let us do that next.

### Creating a database

In the earlier parts of Full Stack Open, we used MongoDB as the database. In&nbsp;<a href="https://fullstackopen.com/en/part13">part 13</a>&nbsp;we switched to a relational database, PostgreSQL. Relational databases are our choice also now.

Vercel offers a managed PostgreSQL database called&nbsp;<a href="https://vercel.com/docs/storage/vercel-postgres">Vercel Postgres</a>, powered by&nbsp;<a href="https://neon.tech/">Neon</a>. It is a serverless PostgreSQL database that integrates seamlessly with Vercel deployments, making it an excellent fit for our Next.js application.

To create a database, go to your Vercel dashboard and follow these steps:
- Open the project you deployed earlier
- Navigate to the <em>Storage</em> tab
- Click <em>Create Database</em>
- Select <em>Postgres (Neon)</em> and click <em>Continue</em>
- Select a region close to your deployment, and click <em>Create</em>
- Give the database a name (e.g. <em>notes-db</em>), and click <em>Create</em>

After creation, Vercel automatically adds the connection environment variables to your project. You can see them under&nbsp;<em>Settings &gt; Environment Variables</em>. The most important one is&nbsp;<em>DATABASE_URL</em>, which contains the full connection string to your PostgreSQL database.

To use the same database locally during development, copy the connection string from the Vercel dashboard and create a&nbsp;<em>.env.local</em>&nbsp;file in the root of your project:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

```

Replace the value with the actual connection string from your Vercel dashboard. Next.js automatically loads&nbsp;<em>.env.local</em>&nbsp;during development, so no extra configuration is needed.

<strong>Important:</strong>&nbsp;add&nbsp;<em>.env.local</em>&nbsp;to your&nbsp;<em>.gitignore</em>&nbsp;file so that the database credentials are never committed to version control:

```
echo ".env.local" >> .gitignore
```

### Database access with Drizzle ORM

In <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">Full stack relational databases</a> we used <a href="https://sequelize.org/">Sequelize</a> as the ORM (Object-Relational Mapping) library for accessing the PostgreSQL database. This time we will use <a href="https://orm.drizzle.team/">Drizzle ORM</a>, which has become one of the most popular choices in the Next.js ecosystem.

Why Drizzle instead of Sequelize? Drizzle is designed with TypeScript as a first-class citizen. The database schema is defined in TypeScript, and Drizzle generates fully typed query results automatically. This means that if your schema says a note has&nbsp;<em>content</em>&nbsp;(string) and&nbsp;<em>important</em>&nbsp;(boolean), every query result is typed accordingly, and the compiler catches mistakes before you even run the code. Drizzle also produces SQL that is very close to what you would write by hand, making it easy to understand what is happening under the hood. Finally, Drizzle has excellent support for serverless environments like Vercel, where connections need to be managed carefully.

Let us set up Drizzle for our project. First, install the required packages:

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

The package&nbsp;<a href="https://www.npmjs.com/package/drizzle-orm">drizzle-orm</a>&nbsp;is the ORM itself. The package&nbsp;<a href="https://www.npmjs.com/package/@neondatabase/serverless">@neondatabase/serverless</a>&nbsp;is the PostgreSQL driver optimized for serverless environments like Vercel, where the database runs on Neon. The package&nbsp;<a href="https://www.npmjs.com/package/drizzle-kit">drizzle-kit</a>&nbsp;is a CLI tool for managing database migrations.

Next, we define the database schema. We create a file&nbsp;<em>db/schema.ts</em>&nbsp;that looks following:

```ts
import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core"

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
})
```

This defines a table called&nbsp;<em>notes</em>&nbsp;with three columns:
- <em>id</em> that has type <a href="https://orm.drizzle.team/docs/column-types/pg#serial">serial</a> which means it is an auto-incrementing integer, and it is marked as the <a href="https://orm.drizzle.team/docs/indexes-constraints#primary-key">primary key</a> of the table
- <em>content</em> that has type <a href="https://orm.drizzle.team/docs/column-types/pg#text">text</a> which corresponds to the SQL <em>TEXT</em> type, and it is marked as <a href="https://orm.drizzle.team/docs/column-types/pg#not-null">not null</a> meaning every note must have content
- <em>important</em> that has type <a href="https://orm.drizzle.team/docs/column-types/pg#boolean">boolean</a> which stores <em>true</em> or <em>false</em>, it is also not null and has a <a href="https://orm.drizzle.team/docs/column-types/pg#default-value">default value</a> of <em>false</em>

Notice how the schema is just TypeScript. There is no separate syntax to learn!

Next we create the database connection in the file&nbsp;<em>db/index.ts</em>:

```js
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema })
```

The&nbsp;<em>drizzle</em>&nbsp;function from&nbsp;<a href="https://orm.drizzle.team/docs/get-started/neon-new">drizzle-orm/neon-http</a>&nbsp;creates a serverless-friendly database connection using the connection string from our environment variable. The&nbsp;<em>neon-http</em>&nbsp;driver is optimized for serverless environments: it communicates with the Neon database over HTTP, so there is no persistent connection to manage. The exported result&nbsp;<em>db</em>&nbsp;is a typed query builder that we can use throughout our application.

Finally, we need a Drizzle configuration file for the migration tooling that we create to file&nbsp;<em>drizzle.config.ts</em>&nbsp;in the project root:

```js
import { defineConfig } from "drizzle-kit"

import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

This tells Drizzle Kit where to find the schema, where to output migration files, and how to connect to the database.

We also need to install two more package:

```bash
npm install --save-dev dotenv postgres
```

The&nbsp;<em>dotenv</em>&nbsp;package is needed because Drizzle Kit CLI commands run as plain Node.js scripts, outside of the Next.js runtime. Next.js automatically loads&nbsp;<em>.env.local</em>&nbsp;for your application code, but Drizzle Kit does not benefit from that. By importing&nbsp;<em>dotenv</em>&nbsp;and calling&nbsp;<em>dotenv.config({ path: ".env.local" })</em>&nbsp;at the top of&nbsp;<em>drizzle.config.ts</em>, we make the&nbsp;<em>DATABASE_URL</em>&nbsp;variable available to Drizzle Kit when it connects to the database to run migrations or open Drizzle Studio.

Our application uses the&nbsp;<em>@neondatabase/serverless</em>&nbsp;driver, which communicates with the database over HTTP. However, Drizzle Kit's CLI commands need a more traditional connection to the database. Without the&nbsp;<em>postgres</em>&nbsp;package installed, Drizzle Kit commands will print warnings about some missing dependencies.

Now we can generate the migration and apply it to the database:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The first command reads the schema and generates SQL migration files in the&nbsp;<em>drizzle</em>&nbsp;directory. The second command applies those migrations to the database, creating the&nbsp;<em>notes</em>&nbsp;table.

You might wonder what the migrations are. The topic was covered in the&nbsp;<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-4">Full stack open: Relational databases</a>, and we will soon get back to it, so do not worry yet!

We can verify that the table was created by running:

```bash
npx drizzle-kit studio
```

This opens&nbsp;<a href="https://orm.drizzle.team/drizzle-studio/overview">Drizzle Studio</a>, a visual database browser to address&nbsp;<a href="https://local.drizzle.studio/">https://local.drizzle.studio</a>&nbsp;where we can see our&nbsp;<em>notes</em>&nbsp;table and its columns.

Let us also add couple of notes to the database:

![صورة توضيحية](/images/mooc/ac51472b7ac7.webp)

Now we are ready to change the app to use the database. Let us start with the list of notes.

We change&nbsp;<em>app/services/notes.ts</em>&nbsp;as follows:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { notes } from "../../db/schema"

export const getNotes = async () => {
  return db.query.notes.findMany()
}

<em>// ...</em>
```

The function&nbsp;<em>getNotes</em>&nbsp;uses Drizzle's&nbsp;<a href="https://orm.drizzle.team/docs/rqb">relational queries API</a>&nbsp;through&nbsp;<em>db.query</em>. The call&nbsp;<em>db.query.notes.findMany()</em>&nbsp;reads all rows from the&nbsp;<em>notes</em>&nbsp;table. It corresponds to the SQL query:

```sql
SELECT id, content, important FROM notes;
```

Notice that the function is now&nbsp;<em>async</em>&nbsp;since the database query returns a promise. The return type is automatically inferred by Drizzle from the schema, so TypeScript knows the result is an array of objects with&nbsp;<em>id</em>&nbsp;(number),&nbsp;<em>content</em>&nbsp;(string), and&nbsp;<em>important</em>&nbsp;(boolean).

The&nbsp;<em>app/notes/page.tsx</em>&nbsp;needs to be adjusted to take account that the function is now async:

```ts
import Link from "next/link"
import { getNotes } from "../services/notes"

const Notes = async ({ // HIGHLIGHT LINE
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const allNotes = await getNotes() // HIGHLIGHT LINE
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

  return (
    <em>// ...</em>
  )
}
```

Now the notes page fetches its data from the database:

![صورة توضيحية](/images/mooc/77cdc608c534.webp)

Let us now change the rest of the functions in&nbsp;<em>app/services/notes.ts</em>&nbsp;to use the database:

```ts
export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({
    where: eq(notes.id, id),
  })
}
```

The function&nbsp;<em>getNoteById</em>&nbsp;uses the&nbsp;<a href="https://orm.drizzle.team/docs/rqb#find-first">findFirst</a>&nbsp;method. It returns the first matching row, or&nbsp;<em>undefined</em>&nbsp;if no row matches. The&nbsp;<em>where</em>&nbsp;clause uses the&nbsp;<a href="https://orm.drizzle.team/docs/operators#eq">eq</a>&nbsp;helper from&nbsp;<em>drizzle-orm</em>&nbsp;to create an equality condition. The corresponding SQL is:

```sql
SELECT id, content, important FROM notes WHERE id = 1;
```

Creation of a new note becomes:

```ts
export const addNote = async (content: string, important: boolean) => {
  await db.insert(notes).values({ content, important })
}
```

The function&nbsp;<em>addNote</em>&nbsp;uses Drizzle's&nbsp;<a href="https://orm.drizzle.team/docs/insert">insert</a>&nbsp;query builder. The call&nbsp;<em>db.insert(notes).values(...)</em>&nbsp;inserts a new row into the&nbsp;<em>notes</em>&nbsp;table. The corresponding SQL is:

```sql
INSERT INTO notes (content, important) VALUES ('some content', true);
```

We do not need to provide&nbsp;<em>id</em>&nbsp;because the column is defined as&nbsp;<em>serial</em>, so the database generates it automatically.

```ts
export const toggleImportance = async (id: number) => {
  const note = await getNoteById(id)
  if (note) {
    await db
      .update(notes)
      .set({ important: !note.important })
      .where(eq(notes.id, id))
  }
}
```

The function&nbsp;<em>toggleImportance</em>&nbsp;first fetches the note to read its current&nbsp;<em>important</em>&nbsp;value, then uses Drizzle's&nbsp;<a href="https://orm.drizzle.team/docs/update">update</a>&nbsp;query builder to flip it. The call&nbsp;<em>db.update(notes).set(...).where(...)</em>&nbsp;updates matching rows. The corresponding SQL is:

```sql
UPDATE notes SET important = NOT important WHERE id = 1;
```

Since all the functions in&nbsp;<em>services/notes.ts</em>&nbsp;are now async, we need to do corresponding changes to couple of files. The&nbsp;<em>app/notes/[id]</em>&nbsp;needs an&nbsp;<em>await</em>

```ts
const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = await getNoteById(Number(id)) // HIGHLIGHT LINE

  <em>// ...</em>
}
```

Also the server actions need the same treatment:

```js
export const createNote = async (formData: FormData) => { // HIGHLIGHT LINE
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  await addNote(content, important) // HIGHLIGHT LINE

  revalidatePath("/notes")
  redirect("/notes")
}

export const toggleNoteImportance = async (formData: FormData) => { // HIGHLIGHT LINE
  const id = Number(formData.get("id"))
  await toggleImportance(id) // HIGHLIGHT LINE
  revalidatePath(`/notes/${id}`)
  revalidatePath("/notes")
}
```

There is one more thing to note before we go on. The component&nbsp;<em>Notes</em>&nbsp;always fetches all notes from the database, and the possible filtering of important notes is done in JavaScript after the query:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  // BEGIN HIGHLIGHT
  const allNotes = await getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes
  // END HIGHLIGHT

  return (
    <em>// ...</em>
  )
}
```

For a small dataset this is perfectly fine, but with a large number of notes it would be more efficient to let the database do the filtering by adding a&nbsp;<em>WHERE</em>&nbsp;clause to the SQL query. We can modify&nbsp;<em>getNotes</em>&nbsp;to accept a parameter that controls the filtering:

```ts
export const getNotes = async (importantOnly: boolean) => {
  if (importantOnly) {
    return db.query.notes.findMany({
      where: eq(notes.important, true),
    })
  }

  return db.query.notes.findMany()
}
```

When&nbsp;<em>importantOnly</em>&nbsp;is&nbsp;<em>true</em>, the query is done with a&nbsp;<em>where(eq(notes.important, true))</em>&nbsp;clause, which corresponds to the SQL:

```sql
SELECT id, content, important FROM notes WHERE important = true;
```

When&nbsp;<em>importantOnly</em>&nbsp;is&nbsp;<em>false</em>, the function returns all notes without any filtering, just as before.

The component&nbsp;<em>Notes</em>&nbsp;now passes the&nbsp;<em>showImportant</em>&nbsp;flag directly to&nbsp;<em>getNotes</em>, and the filtering logic that was previously done in JavaScript is removed:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const notes = await getNotes(showImportant) // HIGHLIGHT LINE

  return (
    <em>// ....</em>
  )
}
```

This is cleaner and more efficient: instead of fetching all rows and discarding some in JavaScript, we let the database return only the rows we need.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part5.

### Migrations

The next thing we want to add to our app is the possibility for users to log in. For that we naturally need a new database table to save the users. We also need to make a change to the notes table since we would like to associate each note to its creator.

Before we make these changes, let us take a closer look at database migrations, a concept we briefly touched when we first set up the database.

A&nbsp;<a href="https://orm.drizzle.team/docs/migrations">migration</a>&nbsp;is a version-controlled change to the database schema. Every time you add a table, remove a column, or change a data type, that change is captured as a migration. Migrations serve two purposes: they provide a repeatable way to apply schema changes to the database, and they keep a history of how the schema has evolved over time.

Without migrations, you would need to manually run SQL statements like&nbsp;<em>CREATE TABLE</em>&nbsp;or&nbsp;<em>ALTER TABLE</em>&nbsp;on every environment. This is error-prone and impossible to track in version control. With migrations, the schema changes live alongside your application code in the Git repository, and they can be applied automatically during deployment.

When we first set up Drizzle, we ran two commands:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The first command,&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-generate">drizzle-kit generate</a>&nbsp;compares the current TypeScript schema (in&nbsp;<em>db/schema.ts</em>) against the previously generated migrations and produces a new SQL migration file in the&nbsp;<em>drizzle</em>&nbsp;directory. If we look at that directory, we will find something like:

```
drizzle/
├── 0000_neat_captain_america.sql
└── meta/
    ├── _journal.json
    └── 0000_snapshot.json
```

The file&nbsp;<em>0000_neat_captain_america.sql</em>&nbsp;contains the actual SQL that was generated from our schema:

```sql
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"important" boolean DEFAULT false NOT NULL
);
```

The&nbsp;<em>meta</em>&nbsp;directory contains metadata that Drizzle Kit uses to track which migrations have been generated and what the schema looked like at each point.

The second command&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-migrate">drizzle-kit migrate</a>&nbsp;connects to the database and executes any migration files that have not yet been applied. Drizzle tracks which migrations have been run by storing their identifiers in a special table called __<em>drizzle_migrations</em>&nbsp;in the database. This way, running&nbsp;<em>drizzle-kit migrate</em>&nbsp;multiple times is safe: it only applies new migrations.

The workflow for a schema change is always the same:
- Modify your TypeScript schema in <em>app/db/schema.ts</em>
- Run <em>npx drizzle-kit generate</em> to create a new migration file
- Review the generated SQL to make sure it looks correct
- Run <em>npx drizzle-kit migrate</em> to apply the migration to your database

The third step is important. Always check what Drizzle generated before running it against your database. Drizzle does its best to infer the correct SQL, but especially with destructive changes (dropping columns, renaming tables), you should verify the output.

<div class="tasks">

**7. Deploy to Vercel**

</div>

<div class="tasks">

**8. DrizzleORM and a database**

</div>

### Users

Let us now put this into practice. We need to add a&nbsp;<em>users</em>&nbsp;table and modify the&nbsp;<em>notes</em>&nbsp;table to reference the user who created each note.

The&nbsp;<em>schema.ts</em>&nbsp;changes as follows. The new table&nbsp;<em>users</em>&nbsp;has three columns:

```js
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
})
```

The&nbsp;<em>username</em>&nbsp;column has an additional&nbsp;<a href="https://orm.drizzle.team/docs/indexes-constraints#unique">unique</a>&nbsp;constraint, which means no two users can have the same username. In SQL terms, Drizzle will generate a&nbsp;<em>UNIQUE</em>&nbsp;constraint on this column, and the database will reject any insert that would create a duplicate.

The&nbsp;<em>notes</em>&nbsp;table gets a new column&nbsp;<em>userId</em>&nbsp;that links each note to the user who created it:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  // BEGIN HIGHLIGHT
  userId: integer("user_id").references(() => users.id),
  // END HIGHLIGHT
})
```

The&nbsp;<em>userId</em>&nbsp;column has type&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#integer">integer</a>&nbsp;and uses the&nbsp;<a href="https://orm.drizzle.team/docs/indexes-constraints#foreign-key">references</a>&nbsp;method to create a&nbsp;<a href="https://en.wikipedia.org/wiki/Foreign_key">foreign key</a>&nbsp;constraint pointing to the&nbsp;<em>id</em>&nbsp;column of the&nbsp;<em>users</em>&nbsp;table. This tells the database that every value in&nbsp;<em>user_id</em>&nbsp;must correspond to an existing row in the&nbsp;<em>users</em>&nbsp;table. If someone tries to insert a note with a&nbsp;<em>user_id</em>&nbsp;that does not exist in&nbsp;<em>users</em>, the database will reject it. The foreign key also means that a user cannot be deleted if they still have notes referencing them.

Note how the column is named&nbsp;<em>userId</em>&nbsp;in TypeScript (camelCase) but maps to&nbsp;<em>user_id</em>&nbsp;in the database (snake_case). This is a common convention: TypeScript code uses camelCase while SQL uses snake_case, and Drizzle handles the mapping through the string argument passed to&nbsp;<em>integer("user_id")</em>.

Now we generate and apply the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

If we inspect the generated migration file, we will see something like:

```sql
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

ALTER TABLE "notes" ADD COLUMN "user_id" integer;<em>--> statement-breakpoint</em>
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
```

The migration creates the&nbsp;<em>users</em>&nbsp;table and adds the&nbsp;<em>user_id</em>&nbsp;column with its foreign key constraint to the existing&nbsp;<em>notes</em>&nbsp;table. Notice that Drizzle does not recreate the&nbsp;<em>notes</em>&nbsp;table from scratch. It compares the new schema against the previous migration snapshot and generates only the&nbsp;<em>ALTER TABLE</em>&nbsp;statements needed to bring the database in sync.

Let us create a user from drizzle studio, and associate that to the notes that already exists in the database:

![صورة توضيحية](/images/mooc/7cda3289ffb7.webp)

Now we can make a small change to our schema: we would like to alter that so that the foreign key user_id in the&nbsp;<em>notes</em>&nbsp;table is required to be not null:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id), // HIGHLIGHT LINE
})
```

Again, we generate the migration:

```bash
npx drizzle-kit generate
```

When inspecting the generated SQL in the migration , we see a single statement:

```sql
ALTER TABLE "notes" ALTER COLUMN "user_id" SET NOT NULL;
```

This is exactly what we expected: the column already exists, so Drizzle only needs to add the&nbsp;<em>NOT NULL</em>&nbsp;constraint. Since we already associated all existing notes with a user in Drizzle Studio, none of the rows have a null&nbsp;<em>user_id</em>, and the migration will succeed. If any notes still had a null&nbsp;<em>user_id</em>, the database would reject the&nbsp;<em>ALTER TABLE</em>&nbsp;with an error.

We can now apply the migration:

```bash
npx drizzle-kit migrate
```

### Users notes

Let us now implement two new pages, firstly one that lists the users of the app. It is pretty straightforward. The component&nbsp;<em>Users</em>&nbsp;should be in url&nbsp;<em>/users</em>&nbsp;so to follow the Next.js app router convention we put it in the file&nbsp;<em>app/users/page.tsx</em>:

```js
import Link from "next/link"
import { getUsers } from "../services/users"

const Users = async () => {
  const users = await getUsers()

  return (
    &lt;div>
      &lt;h2>Users&lt;/h2>
      &lt;ul>
        {users.map((user) => (
          &lt;li key={user.id}>
            &lt;Link href={`/users/${user.id}`}>{user.name}&lt;/Link>
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

The name of the user is a link to the individual user page that we shall implement soon.

The function&nbsp;<em>getUsers</em>, in the file&nbsp;<em>services/users.ts</em>&nbsp;is straight forward:

```js
import { db } from "../../db"
import { users } from "../../db/schema"

export const getUsers = async () => {
  return db.query.users.findMany()
}
```

The link to the users page is also added to the&nbsp;<em>app/layout.tsx</em>. The end result looks like this:

![صورة توضيحية](/images/mooc/d9d61fc7ecff.webp)

And next the page of a individual user. We want to list there also the notes that are associated for that user.

Following the Next.js app router conventions, the component&nbsp;<em>UserPage</em>&nbsp;is implemented in file&nbsp;<em>app/users/[id]/page.tsx</em>

```ts
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserById } from "../../services/users"

const UserPage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const user = await getUserById(Number(id))

  if (!user) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{user.name}&lt;/h2>
      &lt;p>Username: {user.username}&lt;/p>
      &lt;h3>Notes&lt;/h3>
      &lt;ul>
        {user.notes.map((note) => (
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

The functions&nbsp;<em>services/users.ts</em>&nbsp;look like the following:

```ts
export const getUserById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export const getNotesByUserId = async (userId: number) => {
  return db.query.notes.findMany({
    where: eq(notes.userId, userId),
  })
}
```

The user page looks like this:

![صورة توضيحية](/images/mooc/9c4da15279ca.webp)

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part6.

### Join queries

A question arises: the current&nbsp;<em>UserPage</em>&nbsp;implementation makes two separate database queries, one to fetch the user and another to fetch their notes. Could we do just one query that joins the user with the corresponding notes?

In SQL, this is typically done with a&nbsp;<em>JOIN</em>:

```sql
SELECT users.*, notes.* FROM users
LEFT JOIN notes ON notes.user_id = users.id
WHERE users.id = 1;
```

Drizzle offers a feature called&nbsp;<a href="https://orm.drizzle.team/docs/relations">relations</a>&nbsp;that lets us define the relationships between tables at the application level. These relation definitions are not stored in the database, they do not generate any SQL constraints or migrations. They exist purely to tell Drizzle how the tables are connected, so that Drizzle's&nbsp;<a href="https://orm.drizzle.team/docs/rqb">relational query API</a>&nbsp;can automatically join related data for us.

The&nbsp;<em>schema.ts</em>&nbsp;changes to

```js
import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
    <em>// ...</em>
})

export const notes = pgTable("notes", {
  <em>// ...</em>
})

// BEGIN HIGHLIGHT
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}))
// END HIGHLIGHT
```

The&nbsp;<a href="https://orm.drizzle.team/docs/relations">relations</a>&nbsp;function from&nbsp;<em>drizzle-orm</em>&nbsp;is used to declare how tables relate to each other. The first argument is the table, and the second is a callback that receives helper functions (<em>many</em>,&nbsp;<em>one</em>) and returns an object describing the related tables.

The&nbsp;<em>usersRelations</em>&nbsp;definition says that a user can have&nbsp;<a href="https://orm.drizzle.team/docs/relations#one-to-many">many</a>&nbsp;notes.

The&nbsp;<em>notesRelations</em>&nbsp;definition says that a note belongs to&nbsp;<a href="https://orm.drizzle.team/docs/relations#one-to-one">one</a>&nbsp;user. The&nbsp;<em>fields</em>&nbsp;and&nbsp;<em>references</em>&nbsp;properties tell Drizzle which columns form the link:&nbsp;<em>notes.userId</em>&nbsp;in the notes table points to&nbsp;<em>users.id</em>&nbsp;in the users table.

Note that the&nbsp;<em>fields</em>&nbsp;and&nbsp;<em>references</em>&nbsp;properties are always required on the side that holds the foreign key column, in our case the&nbsp;<em>notes</em>&nbsp;side, since&nbsp;<em>user_id</em>&nbsp;lives in the notes table.

It is important to understand that these relation definitions are separate from the&nbsp;<em>references</em>&nbsp;foreign key we defined earlier in the&nbsp;<em>pgTable</em>&nbsp;call. The foreign key constraint is enforced by the database, while the&nbsp;<em>relations</em>&nbsp;definitions are used only by Drizzle's query API to know how to join data. You need both: the foreign key for data integrity, and the relations for convenient querying.

Now the&nbsp;<em>services/users.ts</em>&nbsp;changes to

```ts
export const getUserWithNotes = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { notes: true },
  })
}
```

The key addition to what we have previously seen is&nbsp;<a href="https://orm.drizzle.team/docs/rqb#include-relations">with: { notes: true }</a>, which tells Drizzle to also fetch all related notes for that user in the same operation.

Under the hood, Drizzle translates this into an efficient query that joins the users and notes tables. The result is a single user object with a&nbsp;<em>notes</em>&nbsp;array attached to it, something like:

```
{
  id: 1,
  username: "mluukkai",
  name: "Matti Luukkainen",
  notes: [
    { id: 1, content: "next.js utilizes React Server Components", important: true, userId: 1 },
    { id: 2, content: "next.js is built on top of React", important: true, userId: 1 },
  ]
}
```

This replaces the two separate functions&nbsp;<em>getUserById</em>&nbsp;and&nbsp;<em>getNotesByUserId</em>&nbsp;with a single function that gets everything in one go.

This is the only function needed in&nbsp;<em>UserPage</em>

```ts
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserWithNotes } from "../../services/users"

const UserPage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const user = await getUserWithNotes(Number(id))  // HIGHLIGHT LINE

  return (
    &lt;div>
      &lt;h2>{user.name}&lt;/h2>
      &lt;p>Username: {user.username}&lt;/p>
      &lt;h3>Notes&lt;/h3>
      &lt;ul>
        {user.notes.map((note) => ( // HIGHLIGHT LINE
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

The component is now simpler: instead of calling two functions and manually combining the results, it calls&nbsp;<em>getUserWithNotes</em>&nbsp;once and gets a user object that already contains the notes array. The&nbsp;<em>user.notes.map(...)</em>&nbsp;iterates directly over the embedded notes, no separate query needed.

There is now a small problem with creating new notes. Our schema requires every note to have a&nbsp;<em>user_id</em>&nbsp;referencing its creator:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  userId: integer("user_id")
    .notNull() // HIGHLIGHT LINE
    .references(() => users.id),
})
```

Since the app does not support user login yet, we cannot know who is creating the note. As a temporary workaround, let us assign each new note to a random user from the database. We change the&nbsp;<em>addNote</em>&nbsp;function in&nbsp;<em>services/notes.ts</em>:

```ts
export const addNote = async (content: string, important: boolean) => {
  const user = await db.query.users.findFirst({
    orderBy: sql`RANDOM()`,
  })

  await db.insert(notes).values({ content, important, userId: user.id })
}
```

The function uses&nbsp;<em>findFirst</em>&nbsp;with&nbsp;<em>orderBy: sql`RANDOM()`</em>&nbsp;to pick a random user from the database. The&nbsp;<a href="https://orm.drizzle.team/docs/sql">sql</a>&nbsp;template tag from&nbsp;<em>drizzle-orm</em>&nbsp;lets us write raw SQL fragments when Drizzle does not have a built-in helper for something. The note is then inserted with that user's&nbsp;<em>id</em>&nbsp;as the&nbsp;<em>userId</em>. We will replace this hack with proper user authentication soon.

The current code for the application is in&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;in the branch part7.

#### Query logger

When something behaves unexpectedly, it is useful to see the exact SQL that Drizzle sends to the database. You can enable logging by passing a&nbsp;<em>logger</em>&nbsp;option when creating the connection in&nbsp;<em>db/index.ts</em>:

```js
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: true, // HIGHLIGHT LINE
})

```

With&nbsp;<em>logger: true</em>, Drizzle prints every SQL statement and its parameters to the console as your app handles requests. For example, fetching notes will produce output like:

```
Query: select "id", "content", "important", "user_id" from "notes" where "notes"."important" = $1 -- params: [true]

```

This makes it easy to catch issues such as accidentally fetching all rows instead of filtering, running more queries than expected, or passing the wrong parameter. Remember to turn logging off in production to avoid cluttering your logs.

### Word of warning about migrations

Migrations can be tricky, especially during development when the schema is changing frequently. It is common to end up in a situation where the migration state gets out of sync with the actual database, for example if you manually modify the database, edit a migration file after it has been applied, or generate a migration and then change the schema again before applying it.

When things go wrong, you will typically see errors like "relation already exists" or "column does not exist" when running&nbsp;<em>drizzle-kit migrate</em>. This happens because Drizzle's migration tracker thinks the database is in one state, but the actual database is in another.

During development, when the database does not contain any important data, the simplest recovery strategy is to start fresh. You can do this in two steps:

First, remove Drizzle's migration tracking from the database and drop all the tables you have created:

```sql
DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

You can run these SQL statements in Drizzle Studio or directly in the Neon console on the Vercel dashboard.

Second, remove the local migration history so that Drizzle Kit forgets all previously generated migrations:

```bash
npx drizzle-kit drop
```

The command&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-drop">drizzle-kit drop</a>&nbsp;lets you select which migration entries to remove from the local journal. After dropping them, you can regenerate and reapply everything cleanly:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

This gives you a fresh start: the migration files are regenerated from the current schema, and the database tables are created from scratch.

This "nuclear option" is perfectly fine during development. In production, however, you should never drop tables or delete migration history, since that means losing real user data. In a production environment, the correct approach is to always move forward: write a new migration that fixes the problem, rather than trying to undo previous ones. But for our purposes during the course, starting fresh is the fastest way to get unstuck.

<div class="tasks">

**9. Users**

</div>

<div class="tasks">

**10. User page**

</div>
