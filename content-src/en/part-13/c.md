---
part: 13
letter: c
title: "Join tables and queries"
mainImage: /images/part-13.svg
lang: en
---
### Structure of the application

So far, we have written all the code in the same file. Now let's structure the application a little better. Let's create the following directory structure and files:

```
index.js
util
  config.js
  db.js
models
  index.js
  note.js
controllers
  notes.js
```

The contents of the files are as follows. The file&nbsp;<em>utils/config.js</em>&nbsp;takes care of handling the environment variables:

```
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

The role of the file&nbsp;<em>index.js</em>&nbsp;is to configure and launch the application:

```js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async () =&gt; {
  await connectToDatabase()
  app.listen(PORT, () =&gt; {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

Starting the application is slightly different from what we have seen before, because we want to make sure that the database connection is established successfully before the actual startup.

The file&nbsp;<em>util/db.js</em>&nbsp;contains the code to initialize the database:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

The notes in the model corresponding to the table to be stored are saved in the file&nbsp;<em>models/note.js</em>

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

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

module.exports = Note
```

The file&nbsp;<em>models/index.js</em>&nbsp;is almost useless at this point, as there is only one model in the application. When we start adding other models to the application, the file will become more useful because it will eliminate the need to import files defining individual models in the rest of the application.

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

The route handling associated with notes can be found in the file&nbsp;<em>controllers/notes.js</em>:

```js
const router = require('express').Router()<br><br>const { Note } = require('../models')<br><br>router.get('/', async (req, res) => {<br>  const notes = await Note.findAll()<br>  res.json(notes)<br>})<br><br>router.post('/', async (req, res) => {<br>  try {<br>    const note = await Note.create({... req.body, date: new Date()})<br>    res.json(note)<br>  } catch(error) {<br>    return res.status(400).json({ error })<br>  }<br>})<br><br>router.get('/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})<br><br>router.delete('/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    await note.destroy()<br>  }<br>  res.status(204).end()<br>})<br><br>router.put('/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    note.important = req.body.important<br>    await note.save()<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})<br><br>module.exports = router
```

The structure of the application is good now. However, we note that the route handlers that handle a single note contain a bit of repetitive code, as all of them begin with the line that searches for the note to be handled:

```js
const note = await Note.findByPk(req.params.id)
```

Let's refactor this into our own&nbsp;<em>middleware</em>&nbsp;and implement it in the route handlers:

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  if (!req.note) {
    return res.status(404).end()
  }
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  res.json(req.note)
})

router.put('/:id', noteFinder, async (req, res) => {
  req.note.important = req.body.important
  await req.note.save()
  res.json(req.note)
})

router.delete('/:id', noteFinder, async (req, res) => {
  await req.note.destroy()
  res.status(204).end()
})
```

The route handlers now receive <em>three</em> parameters: the first being a string defining the route, and the second being the middleware noteFinder we defined earlier, which retrieves the note from the database and places it in the note field of the req object. A small amount of copy-paste is eliminated, and we are satisfied!

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step2" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step2</em>.

<div class="tasks">

**5. Better structure**

</div>

<div class="tasks">

**6. Moar likes**

</div>

<div class="tasks">

**7. Clean error handling**

</div>

### User management

Next, we will add a table users to the database, which will store the application users. In addition, we will add the ability to create users and token-based login, as we implemented in <a href="https://fullstackopen.com/en/part4/token_authentication" target="_blank" rel="noreferrer noopener">part 4</a>. For simplicity's sake, we are now implementing this so that all users have the same password <em>secret</em>.

The model defining users in the file&nbsp;<em>models/user.js</em>&nbsp;is straightforward

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User
```

The username field is set to be unique. The username could have basically been used as the primary key of the table. However, we decided to create the primary key as a separate field with an integer value <em>id</em>.

The file&nbsp;<em>models/index.js</em>&nbsp;expands slightly:

```js
const Note = require('./note')
const User = require('./user')

Note.sync()
User.sync()

module.exports = {
  Note, User
}
```

The route handlers in the <em>controllers/users.js</em> file that take care of creating a new user and displaying all users do not contain anything dramatic

```js
const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) =&gt; {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) =&gt; {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) =&gt; {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

The router handler that handles the login (file&nbsp;<em>controllers/login.js</em>) is as follows:

```js
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) =&gt; {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user &amp;&amp; passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
```

The POST request will be accompanied by a username and a password. First, the object corresponding to the username is retrieved from the database using the&nbsp;<em>User</em>&nbsp;model with the&nbsp;<a href="https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-" target="_blank" rel="noreferrer noopener">findOne</a>&nbsp;method:

```js
const user = await User.findOne({
  where: {
    username: body.username
  }
})
```

From the console, we can see that the SQL statement corresponds to the method call

```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User". "username" = 'mluukkai';
```

If the user is found and the password is correct (i.e.&nbsp;<em>secret</em>&nbsp;for all the users), A&nbsp;<em>jsonwebtoken</em>&nbsp;containing the user's information is returned in the response. To do this, we install the dependency

```bash
npm install jsonwebtoken
```

The file&nbsp;<em>index.js</em>&nbsp;expands slightly

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step3" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step3</em>.

### Join between the tables

Users can now be added to the application and users can log in, but this in itself is not a very useful feature yet. We would like to add the features that only a logged-in user can add notes, and that each note is associated with the user who created it. To do this, we need to add a&nbsp;<em>foreign key</em>&nbsp;to the&nbsp;<em>notes</em>&nbsp;table.

When using Sequelize, a foreign key can be defined by modifying the&nbsp;<em>models/index.js</em>&nbsp;file as follows

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note, User
}
```

So this is how we <a href="https://sequelize.org/master/manual/assocs.html#one-to-many-relationships" target="_blank" rel="noreferrer noopener">define</a> that there is a <em>one-to-many</em> relationship between the <em>users</em> and <em>notes</em>. We also changed the options of the <em>sync</em> calls so that the tables in the database match changes made to the model definitions. The database schema looks like the following:

```
defaultdb=> \d notes
                                      Table "public.notes"
  Column   |           Type           | Collation | Nullable |              Default
-----------+--------------------------+-----------+----------+-----------------------------------
 id        | integer                  |           | not null | nextval('notes_id_seq'::regclass)
 content   | text                     |           | not null |
 important | boolean                  |           |          |
 date      | timestamp with time zone |           |          |
 user_id   | integer                  |           |          |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL

defaultdb=> \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
    "users_username_key1" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL

```

The foreign key&nbsp;<em>user_id</em>&nbsp;has been created in the&nbsp;<em>notes</em>&nbsp;table, which refers to rows of the&nbsp;<em>users</em>&nbsp;table.

At this point it seems that we did everything right and the foreign key was successfully created. However if this code would be executed with a fresh new database we would run into two issues.

```
Note.sync({ alter: true })<br>User.sync({ alter: true })
```

Looking at the two sync calls they are called in the wrong order. <em>Note</em> is dependent on <em>User</em> with the foreign key. Switching them around might seem like enough but now we have created an unpredictable situation. As sync is asynchronous the two calls might run in a strange order. So the calls need to be awaited. We'll need to place them inside an async function as commonJS doesn't allow top level awaits.

```js
// ./models/index.js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

const syncModels = async () => {
  await User.sync({ alter: true })
  await Note.sync({ alter: true })
}

module.exports = {
  Note, User, syncModels
}
```

Let's add <em>syncModels</em> to the ./index.js module so that the schema is synced after we've confirmed a database connection, but before the server starts accepting requests.

```js
// ./index.js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { syncModels } = require('./models')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async () => {
  await connectToDatabase()
  await syncModels()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

<div class="note">

We had to place the await Model.sync() calls into a function due to commonJS not allowing them but even for ES Modules it would be advisable to do so. Placing the await calls on top level means that they run immediately on import. For this code it would mean the calls again run before the connectToDatabase() function runs. This isn't an issue if the database is running but if it isn't then the sync() call causes a cryptic error instead of the clear one that the connectToDatabase() function produces.

</div>

Now let's make every insertion of a new note be associated to a user. Before we do the proper implementation (where we associate the note with the logged-in user's token), let's hard code the note to be attached to the first user found in the database:

```js
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne()
    const note = await Note.create({...req.body, date: new Date(), userId: user.id})
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

Pay attention to how there is now a <em>user_id</em> column in the notes in the database. The corresponding object in each database row is referred to by Sequelize's naming convention, in camel case <em>userId</em>.

Making a join query is very easy. Let's change the route that returns all users so that each user's notes are also shown:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note
    }
  })
  res.json(users)
})
```

So the join query is done using the&nbsp;<a href="https://sequelize.org/master/manual/assocs.html#eager-loading-example" target="_blank" rel="noreferrer noopener">include</a>&nbsp;option as a query parameter.

The SQL statement generated from the query is seen on the console:

```sql
SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";
```

The end result is as you might expect

![صورة توضيحية](/images/mooc/02a1bedd9b95.webp)

### Proper insertion of notes

Let's change the note insertion by making it work the same as in <a href="https://fullstackopen.com/en/part4" target="_blank" rel="noreferrer noopener">part 4</a>, i.e., the creation of a note can only succeed if the creation request is accompanied by a valid token from login. The note is then stored in the list of notes created by the user identified by the token:

```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

//...

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization &amp;&amp; authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({...req.body, userId: user.id, date: new Date()})
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

The token is retrieved from the request headers, decoded and placed in the&nbsp;<em>req</em>&nbsp;object by the&nbsp;<em>tokenExtractor</em>&nbsp;middleware. When creating a note, a&nbsp;<em>date</em>&nbsp;field is also given indicating the time it was created.

### Fine-tuning

Our backend currently works almost the same way as the Part 4 version of the same application, except for error handling. Before we make a few extensions to the backend, let's change the routes for retrieving all notes and all users slightly.

We will add to each note information about the user who added it:

```js
router.get('/', async (req, res) =&gt; {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})
```

We have also <a href="https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries" target="_blank" rel="noreferrer noopener">restricted</a> the values of which fields we want. For each note, we return all fields except <em>userId</em> and we include the <em>name</em> of the nested user associated with the note.

Let's make a similar change to the route that retrieves all users, removing the unnecessary field&nbsp;<em>userId</em>&nbsp;from the notes associated with the user:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})
```

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy/part13-notes/tree/part13-4" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step4</em>.

### A note on the model definitions

The most observant among you may have noticed that, despite adding the <em>user_id</em> column, we did not make any changes to the model defining the notes, but we can add the user to the note objects:

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

The reason for this is that we specified in the file <em>models/index.js</em> that there is a one-to-many relationship between users and notes:

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

Sequelize automatically creates a Note attribute <em>userId</em> in the model, which can be used to access the <em>user_id</em> column in the database.

Keep in mind, that we could also create a note as follows using the&nbsp;<a href="https://sequelize.org/api/v6/class/src/model.js~model#static-method-build" target="_blank" rel="noreferrer noopener">build</a>&nbsp;method:

```js
const user = await User.findByPk(req.decodedToken.id)

// create a note without saving it yet
const note = Note.build({ ...req.body, date: new Date() })
 // put the user id in the userId property of the created note
note.userId = user.id
// store the note object in the database
await note.save()
```

This is how we explicitly see that&nbsp;<em>userId</em>&nbsp;is an attribute of the notes object.

We could define the model as follows to get the same result:

```
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
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

However, this is not necessary.

Definition at the model level, that is the code

```
User.hasMany(Note)
Note.belongsTo(User)
```

is needed, otherwise Sequelize will not be able to join tables at the code level.

<div class="tasks">

**8. Let there be users**

</div>

<div class="tasks">

**9. Better errors**

</div>

<div class="tasks">

**10. Blog ownership**

</div>

<div class="tasks">

**11. Control the destruction**

</div>

<div class="tasks">

**12. User of blogs and blogs of users**

</div>

### More queries

So far our application has been very simple in terms of queries, queries have searched for either a single row based on the primary key using the method <a href="https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk" target="_blank" rel="noreferrer noopener">findByPk</a> or they have searched for all rows in the table using the method <a href="https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll" target="_blank" rel="noreferrer noopener">findAll</a>. These are sufficient for the frontend of the application made in Part 5, but let's expand the backend so that we can also practice making slightly more complex queries.

Let's first implement the possibility to retrieve only important or non-important notes. Let's implement this using the&nbsp;<a href="http://expressjs.com/en/5x/api.html#req.query" target="_blank" rel="noreferrer noopener">query-parameter</a>&nbsp;important:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important: req.query.important === "true"
    }
  })
  res.json(notes)
})
```

Now the backend can retrieve important notes with a request to&nbsp;<a href="http://localhost:3001/api/notes?important=true" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?important=true</a>&nbsp;and non-important notes with a request to&nbsp;<a href="http://localhost:3001/api/notes?important=false" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?important=false</a>

The SQL query generated by Sequelize contains a WHERE clause that filters rows that would normally be returned:

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true;
```

Unfortunately, this implementation will not work if the request is not interested in whether the note is important or not, i.e. if the request is made to&nbsp;<a href="http://localhost:3001/api/notes" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes</a>. The correction can be done in several ways. One, but perhaps not the best way to do the correction would be as follows:

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let important = { [Op.in]: [true, false] }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important
    }
  })

  res.json(notes)
})
```

The&nbsp;<em>important</em>&nbsp;object now stores the query condition. The default query is

```
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

i.e. the&nbsp;<em>important</em>&nbsp;column can be&nbsp;<em>true</em>&nbsp;or&nbsp;<em>false</em>, using one of the many Sequelize operators&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#operators" target="_blank" rel="noreferrer noopener">Op.in</a>. If the query parameter&nbsp;<em>req.query.important</em>&nbsp;is specified, the query changes to one of the two forms

```
where: {
  important: true
}
```

or

```
where: {
  important: false
}
```

depending on the value of the query parameter.

The database might now contain some note rows that do not have the value for the column&nbsp;<em>important</em>&nbsp;set. After the above changes, these notes can not be found with the queries. Let us set the missing values in the psql console and change the schema so that the column does not allow a null value:

```
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  // ...
)
```

The functionality can be further expanded by allowing the user to specify a required keyword when retrieving notes, e.g. a request to&nbsp;<a href="http://localhost:3001/api/notes?search=database" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?search=database</a>&nbsp;will return all notes mentioning&nbsp;<em>database</em>&nbsp;or a request to&nbsp;<a href="http://localhost:3001/api/notes?search=javascript&amp;important=true" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?search=javascript&amp;important=true</a>&nbsp;will return all notes marked as important and mentioning&nbsp;<em>javascript</em>. The implementation is as follows

```js
router.get('/', async (req, res) => {
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important,
      content: {
        [Op.substring]: req.query.search ? req.query.search : ''
      }
    }
  })

  res.json(notes)
})
```

Sequelize's&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#operators" target="_blank" rel="noreferrer noopener">Op.substring</a>&nbsp;generates the query we want using the LIKE keyword in SQL. For example, if we make a query to&nbsp;<a href="http://localhost:3001/api/notes?search=database&amp;important=true" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?search=database&amp;important=true</a>&nbsp;we will see that the SQL query it generates is exactly as we expect.

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

There is still a beautiful flaw in our application that we see if we make a request to&nbsp;<a href="http://localhost:3001/api/notes" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes</a>, i.e. we want all the notes, our implementation will cause an unnecessary WHERE in the query, which may (depending on the implementation of the database engine) unnecessarily affect the query efficiency:

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" IN (true, false) AND "note". "content" LIKE '%%';
```

Let's optimize the code so that the WHERE conditions are used only if necessary:

```js
router.get('/', async (req, res) =&gt; {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === "true"
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })

  res.json(notes)
})
```

If the request has search conditions e.g.&nbsp;<a href="http://localhost:3001/api/notes?search=database&amp;important=true" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes?search=database&amp;important=true</a>, a query containing WHERE is formed

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

If the request has no search conditions&nbsp;<a href="http://localhost:3001/api/notes" target="_blank" rel="noreferrer noopener">http://localhost:3001/api/notes</a>, then the query does not have an unnecessary WHERE

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id";
```

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step5" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step5</em>.

<div class="tasks">

**13. Search**

</div>

<div class="tasks">

**14. Better search**

</div>

<div class="tasks">

**15. Ordering**

</div>

<div class="tasks">

**16. Authors**

</div>

<div class="tasks">

**17. Checkup**

</div>
