---
part: 13
letter: b
title: "Using relational databases with Sequelize"
mainImage: /images/part-13.svg
lang: en
---
Make sure that you have read <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-1" data-type="link" data-id="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-1">the chapter 1 getting started</a>!

### Pros and cons of document databases

We have used MongoDB in all the previous sections of the course. Mongo is a document database, and one of its most characteristic features is that it is schemaless, i.e., the database has only a very limited awareness of what kind of data is stored in its collections. The schema of the database exists only in the program code, which interprets the data in a specific way, e.g., by identifying that some of the fields are references to objects in another collection.

In the example application of <a href="https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db" data-type="link" data-id="https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db">parts 3</a> and 4, the database stores <em>notes</em> and <em>users</em>.

The collection storing the <em>notes</em>  looks like the following:

```
<code>[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2026-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2026-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]</code>
```

Users saved in the <em>users</em> collection looks like the following:

```
<code>[<br>  {<br>    "_id": "600c0e410d10256466883a6a",<br>    "username": "mluukkai",<br>    "name": "Matti Luukkainen",<br>    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",<br>    "__v": 9,<br>    notes: [<br>      "600c0edde86c7264ace9bb78",<br>      "600c0e410d10256466898a6c"<br>    ]<br>  },<br>]</code>
```

MongoDB does know the types of the fields of the stored entities, but it has no information about which collection of entities the user record ids are referring to. MongoDB also does not care what fields the objects stored in collections have. MongoDB leaves it entirely up to the programmer to ensure that the correct information is stored in the database.

There are both advantages and disadvantages to schemalessness. One advantage is the flexibility it offers: since there is no need to define a schema at the database level, application development can be faster and easier in certain cases, and defining and modifying the schema requires little effort in any case. The problems with schemalessness are related to error susceptibility: everything is left to the programmer. The database itself has no way of checking whether the data in it is <em>consistent</em>, i.e., whether all mandatory fields have values, whether the reference type fields refer to existing and correct types of objects, etc.

The relational databases that are the focus of this part rely heavily on the existence of a schema, and the advantages and disadvantages of schematic databases are almost the opposite of those of non-schematic databases.

The reason why the previous parts of the course used MongoDB is precisely because of its lack of schema, which has made it somewhat easier to use for those who are not very familiar with relational databases. For most of the use cases in this course, I would have chosen a relational database myself.

### Application database

In the theory material of this section, we will be building a Postgres-enabled version of the backend of the notes-storage application, which was built in sections 3 and 4.

For our application, we need a relational database. There are many options, but we will be using the currently most popular Open Source solution <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer noopener">PostgreSQL</a>. You can install Postgres (as the database is often called) on your machine, if you wish to do so, but that is not necessary.

Perhaps the easiest option is to use a cloud-hosted Postgres. There are plenty of options, and at least one, <a href="https://aiven.io/">aiven.io</a>, that can be used free of charge for hobby projects.

Another option is to apply the lessons learned in <a href="https://fullstackopen.com/en/part12" target="_blank" rel="noreferrer noopener">part 12</a> of the course and use Postgres locally with Docker. After the Postgres instructions for cloud services, we also provide brief instructions on how to easily set up Postgres with Docker.

#### A hosted solution: Aiven

At the time of writing (9th February 2026) <a href="https://aiven.io/" data-type="link" data-id="https://aiven.io/">Aiven</a> provides a free tier that suits well for the purposes of this course. Go to <a href="https://aiven.io/">aiven.io</a> and sign up. After creating the database, check what the connection url is:

![صورة توضيحية](/images/mooc/d6c141cdea4c.webp)

#### Docker

This instruction assumes that you've mastered the basics of Docker to the extent taught by e.g. <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers">part 12</a>.

Start Postgres&nbsp;<a href="https://hub.docker.com/_/postgres" target="_blank" rel="noreferrer noopener">Docker image</a>&nbsp;with the command

```
<code>docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres</code>
```

A psql console connection to the database can be opened using the&nbsp;<em>docker exec</em>&nbsp;command. First you need to find out the id of the container:

```
<code>$ docker ps<br>CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                    NAMES<br>ff3f49eadf27   postgres   "docker-entrypoint.s…"   31 minutes ago   Up 31 minutes   0.0.0.0:5432->5432/tcp   great_raman<br>docker exec -it ff3f49eadf27 psql -U postgres postgres<br>psql (15.2 (Debian 15.2-1.pgdg110+1))<br>Type "help" for help.<br><br>postgres=#</code>
```

Defined in this way, the data stored in the database is persisted only as long as the container exists. The data can be preserved by defining a volume for the data. You can look at <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers/chapter-3#066334ce-29a6-4ea8-a66b-035846920009">Part 12 </a>for details. See more <a href="https://github.com/docker-library/docs/blob/master/postgres/README.md#pgdata" target="_blank" rel="noreferrer noopener">here</a>.

#### Accessing the database

Particularly when using a relational database, it is essential to access the database directly as well. There are many ways to do this. One possibility is to use the Postgres <a href="https://www.postgresql.org/docs/current/app-psql.html" target="_blank" rel="noreferrer noopener">psql</a> command-line tool. If you do not have psql installed or are not using the Docker installation, <a href="https://www.pgadmin.org/download/" data-type="link" data-id="https://www.pgadmin.org/download/">download</a> and install pgAdmin, which is a graphical Postgres client.

#### Opening a connection with psql

If you have the psql installed at your host machine, the connection is opened with command

```
<code>psql postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb?sslmode=require</code>
```

If you have Docker installed, you can open the connection to Aiven database as follows

```
<code>docker run -it --rm postgres psql "postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb?sslmode=require"</code>
```

Remember that you find the database connection url from Aiven console.

If you have the Dockerized database, see above how to access it with the command <code>docker exec</code>.

#### Opening a connection with pgAdmin

Start by creating a <em>server</em>:

![صورة توضيحية](/images/mooc/387a5134d08c.webp)

Fill the form with the information that you find from the Aiven console. Once the server is set up and connection established, the database console is opened as follows:

![صورة توضيحية](/images/mooc/cd9bc10bdfd2.webp)

If all goes well, you are set:

![صورة توضيحية](/images/mooc/10c64e56f72a.webp)

#### When connection is opened

When the console is opened, let's try the main psql command <code>\d</code>, which tells you the contents of the database:

```
<code>psql (17.4 (Debian 17.4-1.pgdg120+2), server 17.7)<br>SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)<br>Type "help" for help.<br><br>defaultdb=> \d<br>Did not find any relations.<br>defaultdb=></code>
```

As you might guess, there is currently nothing in the database.

Let's create a table for notes:

```
<code>CREATE TABLE notes (<br>    id SERIAL PRIMARY KEY,<br>    content text NOT NULL,<br>    important boolean,<br>    date time<br>);</code>
```

A few points: column <em>id</em> is defined as a <em>primary key</em>, which means that the value in the column must be unique for each row in the table, and the value must not be empty. The type for this column is defined as <a href="https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL" target="_blank" rel="noreferrer noopener">SERIAL</a>, which is not the actual type but an abbreviation for an integer column to which Postgres automatically assigns a unique, increasing value when creating rows. The column named <em>content</em> with type text is defined in such a way that it must be assigned a value.

Let's look at the situation from the console. First, the <code>\d</code> command, which tells us what tables are in the database:

```
defaultdb=> \d
            List of relations
 Schema |     Name     |   Type   |  Owner
--------+--------------+----------+----------
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
(2 rows)
```

In addition to the&nbsp;<em>notes</em>&nbsp;table, Postgres created a subtable called&nbsp;<em>notes_id_seq</em>, which keeps track of what value is assigned to the&nbsp;<em>id</em>&nbsp;column when creating the next note.

With the command <code>\d notes</code>, we can see how the <em>notes</em> table is defined:

```
defaultdb=> \d notes;
                                 Table "public.notes"
 Column    |          Type          | Collation | Nullable |             Default
-----------+------------------------+-----------+----------+-----------------------------------
 id        | integer                |           | not null | nextval('notes_id_seq'::regclass)
 content   | text                   |           | not null |
 important | boolean                |           |          |
 date      | time without time zone |           |          |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
```

We can see that the column <em>id</em> has a <em>default value</em>, which is obtained by calling Postgres' internal function <code>nextval</code>.

Let's add some content to the table:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

And let's see what the created content looks like:

```
defaultdb=> select * from notes;
 id |               content               | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t         |
  2 | MongoDB is webscale                 | f         |
(2 rows)
```

If we try to store data in the database that does not comply with the schema, it will not work. The value of a mandatory column cannot be missing:

```
defaultdb=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

The column value cannot be of the wrong type:

```
defaultdb=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

Columns that don't exist in the schema are not accepted either:

```
defaultdb=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

Next it's time to move on to accessing the database from the application.

### Node application using a relational database

Let's start the application as usual with the&nbsp;<em>npm init</em>&nbsp;and install&nbsp;<em>nodemon</em>&nbsp;as a development dependency and also the following runtime dependencies:

```bash
npm install express dotenv pg sequelize
```

Of these, the latter&nbsp;<a href="https://sequelize.org/master/" target="_blank" rel="noreferrer noopener">sequelize</a>&nbsp;is the library through which we use Postgres. Sequelize is a so-called&nbsp;<a href="https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping" target="_blank" rel="noreferrer noopener">Object relational mapping</a>&nbsp;(ORM) library that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to Mongoose that we used with MongoDB.

Let's test that we can connect to the database. Create the file <em>index.js</em> and add the following content:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

The database <em>connect string</em>, that contains the database address and the credentials must be defined in the file <em>.env</em>

If you use Aiven, the contents of the file <em>.env</em> should be something like the following:

```
$ cat .env
<code>postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb</code>
```

Note that you must remove the <code>?sslmode=require</code> from the connect string!

If you use Docker, the connect string is:

```
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

Once the connect string has been set up in the file&nbsp;<em>.env</em>&nbsp;we can test for a connection:

```
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

If and when the connection works, we can then run the first query. Let's modify the program as follows:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

Executing the application should print as follows:

```
Executing (default): SELECT * FROM notes
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

Even though Sequelize is an ORM library, which means there is little need to write SQL yourself when using it, we just used&nbsp;<a href="https://sequelize.org/master/manual/raw-queries.html" target="_blank" rel="noreferrer noopener">direct SQL</a>&nbsp;with the sequelize method&nbsp;<a href="https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query" target="_blank" rel="noreferrer noopener">query</a>.

The application seems to be working, and the notes are printed to the console. However, let's now switch to using Sequelize instead of SQL, as it is intended to be used.

### Model

When using Sequelize, each table in the database is represented by a&nbsp;<a href="https://sequelize.org/master/manual/model-basics.html" target="_blank" rel="noreferrer noopener">model</a>, which is effectively its own JavaScript class. Let's now define the model&nbsp;<em>Note</em>&nbsp;corresponding to the table&nbsp;<em>notes</em>&nbsp;for the application by changing the code to the following format:

```js
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

A few comments on the code: There is nothing very surprising about the <em>Note</em> definition of the model; each column has a type defined, as well as other properties, if necessary, such as whether it is the table's primary key. The second parameter in the model definition contains the <em>sequelize</em> attribute as well as other configuration information. We also defined that the table does not have to use the timestamps columns (<em>created_at</em> and <em>updated_at</em>).

We also defined <em>underscored: true</em>, which means that table names are derived from model names as plural <a href="https://en.wikipedia.org/wiki/Snake_case" target="_blank" rel="noreferrer noopener">snake case</a> versions. Practically, this means that, if the name of the model, as in our case, is "Note", then the name of the corresponding table is its plural version written with a lower-case first letter, i.e., notes. If, on the other hand, the name of the model would be "two-part", e.g., <em>StudyGroup</em>, then the name of the table would be <em>study_groups</em>. Sequelize automatically infers table names, but also allows explicitly defining them.

The same naming policy applies to columns as well. If we had defined that a note is associated with&nbsp;<em>creationYear</em>, i.e. information about the year it was created, we would define it in the model as follows:

```
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

The name of the corresponding column in the database would be&nbsp;<em>creation_year</em>. In code, reference to the column is always in the same format as in the model, i.e. in "camel case" format.

We have also defined <em>modelName: 'note'</em>, the default "model name" would be capitalized <em>Note</em>. However we want to have a lowercase initial, it will make a few things a bit more convenient going forward.

The database operation is easy to do using the <a href="https://sequelize.org/master/manual/model-querying-basics.html" target="_blank" rel="noreferrer noopener">query interface</a> provided by models. The method <a href="https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll" target="_blank" rel="noreferrer noopener">findAll</a> works exactly as it is assumed by its name to work:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})
```

The console tells you that the method call&nbsp;<em>Note.findAll()</em>&nbsp;causes the following query:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

Next, let's implement an endpoint for creating new notes:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create({...req.body, date: new Date()})
  res.json(note)
})
```

Creating a new note is done by calling the model's&nbsp;<em>Note</em>&nbsp;method&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries" target="_blank" rel="noreferrer noopener">create</a>&nbsp;and passing as a parameter an object that defines the values of the columns.

Instead of the&nbsp;<em>create</em>&nbsp;method, it&nbsp;<a href="https://sequelize.org/master/manual/model-instances.html#creating-an-instance" target="_blank" rel="noreferrer noopener">is also possible</a>&nbsp;to save to a database using the&nbsp;<a href="https://sequelize.org/api/v6/class/src/model.js~model#static-method-build" target="_blank" rel="noreferrer noopener">build</a>&nbsp;method first to create a Model-object from the desired data, and then calling the&nbsp;<a href="https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save" target="_blank" rel="noreferrer noopener">save</a>&nbsp;method on it:

```js
const note = Note.build(req.body)
await note.save()
```

Calling the&nbsp;<em>build</em>&nbsp;method does not save the object in the database yet, so it is still possible to edit the object before the actual save event:

```js
const note = Note.build(req.body)
note.important = true
await note.save()
```

For the use case of the example code, the&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries" target="_blank" rel="noreferrer noopener">create</a>&nbsp;method is better suited, so let's stick to that.

If the object being created is not valid, there is an error message as a result. For example, when trying to create a note without content, the operation fails, and the console reveals the reason to be&nbsp;<em>SequelizeValidationError: notNull Violation Note.content cannot be null</em>:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Let's add some simple error handling when adding a new note:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create({...req.body, date: new Date()})
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<div class="tasks">

**1. Repository and the Database**

</div>

<div class="tasks">

**2. Console connection**

</div>

<div class="tasks">

**3. Connecting from app**

</div>

### Creating database tables automatically

Our application now has one drawback: it assumes that a database with exactly the right schema exists, i.e., that the table <em>notes</em> has been created with the appropriate <code>create table</code> command.

Since the program code is stored in GitHub, it would be sensible to also store the commands that create the database in connection with the program code, so that the database schema is definitely the same as what the program code expects. Sequelize is actually able to generate the schema automatically from the model definitions using the model method <a href="https://sequelize.org/master/manual/model-basics.html#model-synchronization" target="_blank" rel="noreferrer noopener">sync</a>.

Let's now destroy the table <em>notes</em> from the console by entering the following command:

```
<code>drop table notes;</code>
```

The&nbsp;<code>\d</code>&nbsp;command reveals that the table has been lost from the database:

```
<code>postgres=# \d<br>Did not find any relations.</code>
```

The application no longer works.

Let's add the following command to the application immediately after the model&nbsp;<em>Note</em>&nbsp;is defined:

```
<code>Note.sync()</code>
```

When the application starts, the following is printed on the console:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

That is, when the application starts, the command&nbsp;<em>CREATE TABLE IF NOT EXISTS "notes"...</em>&nbsp;is executed which creates the table&nbsp;<em>notes</em>&nbsp;if it does not already exist.

### Other operations

Let's complete the application with a few more operations.

Searching for a single note is possible with the method&nbsp;<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk" target="_blank" rel="noreferrer noopener">findByPk</a>, because it is retrieved based on the id of the primary key:

```js
<code>app.get('/api/notes/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})</code>
```

Retrieving a single note causes the following SQL command:

```
<code>Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';</code>
```

If no note is found, the operation returns&nbsp;<em>null</em>, and in this case the relevant status code is given.

Modifying the note is done as follows. Only the modification of the&nbsp;<em>important</em>&nbsp;field is supported, since the application's frontend does not need anything else:

```js
<code>app.put('/api/notes/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    note.important = req.body.important<br>    await note.save()<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})</code>
```

The object corresponding to the database row is retrieved from the database using the&nbsp;<em>findByPk</em>&nbsp;method, the object is modified and the result is saved by calling the&nbsp;<em>save</em>&nbsp;method of the object corresponding to the database row.

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step1" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step1</em>.

### Printing the objects returned by Sequelize to the console

The JavaScript programmer's most important tool (besides AI agents) is <em>console.log</em>, whose aggressive use gets even the worst bugs under control. Let's add console printing to the single note path:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note)
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

We can see that the end result is not exactly what we expected:

```
note {
  dataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2026-02-03T15:00:24.582Z,
  },
  _previousDataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2026-02-03T15:00:24.582Z,
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'content', 'important', 'date' ]
  },
  isNewRecord: false
}
```

In addition to the note information, all sorts of other things are printed on the console. We can get the desired result by calling the model-object method <a href="https://sequelize.org/api/v6/class/src/model.js~model#instance-method-toJSON" target="_blank" rel="noreferrer noopener">toJSON</a>:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON())
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Now the result is exactly what we want:

```
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2026-02-09T13:52:58.693Z }
```

In the case of a collection of objects, the method toJSON does not work directly, the method must be called separately for each object in the collection:

```js
app.get('/api/notes', async (req, res) =&gt; {
  const notes = await Note.findAll()

  console.log(notes.map(n=&gt;n.toJSON()))
  res.json(notes)
})
```

The print looks like the following:

```
[ { id: 1,
    content: 'MongoDB is webscale',
    important: false,
    date: 2026-02-09T13:52:58.693Z },
  { id: 2,
    content: 'Relational databases rule the world',
    important: true,
    date: 2026-02-09T13:53:10.710Z } ]
```

However, perhaps a better solution is to turn the collection into JSON for printing by using the method&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify" target="_blank" rel="noreferrer noopener">JSON.stringify</a>:

```js
app.get('/api/notes', async (req, res) =&gt; {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes))
  res.json(notes)
})
```

This way is better especially if the objects in the collection contain other objects. It is also often useful to format the objects on the screen in a slightly more reader-friendly format. This can be done with the following command:

```
console.log(JSON.stringify(notes, null, 2))
```

The print looks like the following:

```json
[
  {
    "id": 1,
    "content": "MongoDB is webscale",
    "important": false,
    "date": "2026-02-09T13:52:58.693Z"
  },
  {
    "id": 2,
    "content": "Relational databases rule the world",
    "important": true,
    "date": "2026-02-09T13:53:10.710Z"
  }
]
```

<div class="tasks">

**4. Web service is born**

</div>
