---
part: 13
letter: d
title: "Migrations, many-to-many relationships"
mainImage: /images/part-13.svg
lang: en
---
### Migrations

Let's continue expanding the backend. We want to implement support for users with <em>admin status</em> to set other users to inactive status, preventing them from logging in and creating new notes. To implement this, we need to add boolean-valued information to the user database table indicating whether the user is an admin and whether the user account is inactive.

We could proceed as before, i.e., change the model that defines the table and rely on Sequelize to synchronize the schema changes to the database. This is specified by these lines in the file <em>models/index.js</em>

```js
const Note = require('./note')
const User = require('./user')

Note.belongsTo(User)
User.hasMany(Note)

// make the possible schema changes
const syncModels = async () => {
  User.sync({ alter: true })
  Note.sync({ alter: true })
}

syncModels()

module.exports = {
  Note, User
}
```

However, this approach does not make sense in the long run. Let's remove the lines that do the synchronization and move to using a much more robust way, <a href="https://sequelize.org/master/manual/migrations.html" target="_blank" rel="noreferrer noopener">migrations</a> provided by Sequelize (and many other libraries).

In practice, a migration is a single JavaScript file that describes a change to be made to a database. A separate migration file is created for each individual change or for multiple changes made at once. Sequelize keeps track of which migrations have been performed, i.e., which migration changes have been synchronized with the database schema. As new migrations are created, Sequelize stays up to date on which changes to the schema still need to be made. This way, changes are made in a controlled manner, with program code stored in version control.

First, create a migration that brings the database to its current state. The migration code is as follows:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
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
    })
    await queryInterface.createTable('notes', {
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
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

The migration file&nbsp;<a href="https://sequelize.org/master/manual/migrations.html#migration-skeleton" target="_blank" rel="noreferrer noopener">defines</a>&nbsp;the functions&nbsp;<em>up</em>&nbsp;and&nbsp;<em>down</em>, the first of which defines how the database should be modified when the migration is performed. The function&nbsp;<em>down</em>&nbsp;tells you how to undo the migration if there is a need to do so.

Our migration contains two operations: the first creates a <em>users</em> table, the second creates a <em>notes</em> table, which has a foreign key to the <em>users</em> table referencing the creator of the note. Changes in the schema are defined by calling the <a href="https://sequelize.org/master/manual/query-interface.html" target="_blank" rel="noreferrer noopener">queryInterface</a> object methods.

When defining migrations, it is essential to remember that, unlike models, column and table names such as <em>user_id</em> are written in snake case form.

So in migrations, the names of the tables and columns are written exactly as they appear in the database, while models use Sequelize's default camelCase naming convention.

Save the migration code in the file <em>migrations/20260211_00_initialize_notes_and_users.js</em>. The names of migration files must be in alphabetical order so that the earlier change always precedes the newer change in the alphabet. A good way to achieve this order is to start the name of the migration file with the date and sequence number.

We could run the migrations from the command line using the&nbsp;<a href="https://github.com/sequelize/cli" target="_blank" rel="noreferrer noopener">Sequelize command line tool</a>. However, we choose to perform the migrations manually from the program code using the&nbsp;<a href="https://github.com/sequelize/umzug" target="_blank" rel="noreferrer noopener">Umzug</a>&nbsp;library. Let's install the library

```bash
npm install umzug
```

Let's change the file <em>util/db.js</em> that handles the database connection as follows:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }
```

The&nbsp;<em>runMigrations</em>&nbsp;function that performs migrations is now executed every time the application opens a database connection when it starts. Sequelize keeps track of which migrations have already been completed, so if there are no new migrations, running the&nbsp;<em>runMigrations</em>&nbsp;function does nothing.

Now let's start with a clean slate and remove all existing database tables from the application:

```
username =&gt; drop table notes;
username =&gt; drop table users;
username =&gt; \d
Did not find any relations.
```

Let's start up the application. A message about the migrations status is printed on the log

```sql
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20260211_00_initialize_notes_and_users.js' ] }
database connected
```

If we restart the application, the log also shows that the migration was not repeated.

The database schema of the application now looks like this

```
defaultdb=> \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
```

So Sequelize has created a&nbsp;<em>migrations</em>&nbsp;table that allows it to keep track of the migrations that have been performed. The contents of the table look as follows:

```
<code>defaultdb=> select * from migrations;
                   name
-------------------------------------------
  20260211_00_initialize_notes_and_users.j<span style="font-family: inherit; text-align: initial;">s</span></code>
```

Let's create a few users in the database, as well as a set of notes, and after that we are ready to expand the application.

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step6" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step6</em>.

### Admin user and user disabling

So we want to add two boolean fields to the&nbsp;<em>users</em>&nbsp;table
- <em>admin</em> indicates whether the user is an admin
- <em>disabled</em> indicates whether the user account has been disabled.

Let's create the migration that modifies the database in the file <em>migrations/20260211_02_admin_and_disabled_to_users.js</em>:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

Make corresponding changes to the model corresponding to the&nbsp;<em>users</em>&nbsp;table:

```
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
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
```

When the new migration is performed when the code restarts, the schema is changed as desired:

```
username-&gt; \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          |
 disabled | boolean                |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

Now let's expand the controllers as follows. We prevent logging in if the user field&nbsp;<em>disabled</em>&nbsp;is set to&nbsp;<em>true</em>:

```js
router.post('/', async (request, response) => {
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

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
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
```

Let's disable the user&nbsp;<em>jakousa</em>&nbsp;using his ID:

```sql
username => update users set disabled=true where id=4;
UPDATE 1
username => select * from users;
 id | username |              name               | admin | disabled
----+----------+---------------------------------+-------+----------
  2 | mluukkai | Matti Luukkainen                | f     | f
  4 | jakousa  | Jami Kousa (The Docker Captain) | f     | t
  3 | ousa     | Outi Savolainen                 | t     | f
```

And make sure that logging in is no longer possible

![صورة توضيحية](/images/mooc/97c0efb30c73.webp)

Let's create a route (to file controllers/users.js) that will allow an admin to change the status of a user's account:

```js
const isAdmin = async (req, res, next) =&gt; {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) =&gt; {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

There are two middleware used, the first called&nbsp;<em>tokenExtractor</em>&nbsp;is the same as the one used by the note-creation route, i.e. it places the decoded token in the&nbsp;<em>decodedToken</em>&nbsp;field of the request-object. The second middleware&nbsp;<em>isAdmin</em>&nbsp;checks whether the user is an admin and if not, the request status is set to 401 and an appropriate error message is returned.

Note how&nbsp;<em>two middleware</em>&nbsp;are chained to the route, both of which are executed before the actual route handler. It is possible to chain an arbitrary number of middleware to a request.

The middleware <em>tokenExtractor</em> is now moved to <em>util/middleware.js</em> as it is used from multiple locations:

```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const tokenExtractor = (req, res, next) =&gt; {
  const authorization = req.get('authorization')
  if (authorization &amp;&amp; authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

Perhaps it is a good idea to move also the <em>isAdmin</em> middleware to the same file.

An admin can now re-enable the user&nbsp;<em>jakousa</em>&nbsp;by making a PUT request to&nbsp;<em>/api/users/jakousa</em>, where the request comes with the following data:

```json
{
    "disabled": false
}
```

As noted in&nbsp;<a href="https://fullstackopen.com/en/part4/token_authentication#problems-of-token-based-authentication" target="_blank" rel="noreferrer noopener">the end of Part 4</a>, the way we implement disabling users here is problematic. Whether or not the user is disabled is only checked at&nbsp;<em>login</em>, if the user has a token at the time the user is disabled, the user may continue to use the same token, since no lifetime has been set for the token and the disabled status of the user is not checked when creating notes.

Before we proceed, let's make an npm script for the application, which allows us to undo the previous migration. After all, not everything always goes right the first time when developing migrations.

Let's modify the file&nbsp;<em>util/db.js</em>&nbsp;as follows:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
```

Let's create a file&nbsp;<em>util/rollback.js</em>, which will allow the npm script to execute the specified migration rollback function:

```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

and the script to the file <em>package.json</em>:

```json
{
  "scripts": {
    "dev": "node --watch index.js",
    "migration:down": "node util/rollback.js"
  },
}
```

So we can now undo the previous migration by running&nbsp;<em>npm run migration:down</em>&nbsp;from the command line.

Migrations are currently executed automatically when the program is started. In the development phase of the program, it might sometimes be more appropriate to disable the automatic execution of migrations and make migrations manually from the command line.

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step7" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step7</em>.

<div class="tasks">

**18. Set up migrations**

</div>

<div class="tasks">

**19. Remember the year**

</div>

### Many-to-many relationships

We will continue to expand the application so that each user can be added to one or more&nbsp;<em>teams</em>.

Since an arbitrary number of users can join one team, and one user can join an arbitrary number of teams, we are dealing with a <a href="https://sequelize.org/master/manual/assocs.html#many-to-many-relationships" target="_blank" rel="noreferrer noopener">many-to-many</a> relationship, which is traditionally implemented in relational databases using a <em>join table</em>.

Let's now create the code needed for the teams table as well as the join table. The migration (saved in file <em>20260211_03_add_teams_and_memberships.js</em>) is as follows:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
    await queryInterface.createTable('memberships', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('memberships')
    await queryInterface.dropTable('teams')
  },
}
```

The models contain almost the same code as the migration. The team model in&nbsp;<em>models/team.js</em>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

The model for the join table in <em>models/membership.js</em>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

So we have given the join table a name that describes it well, <em>membership</em>. There is not always a relevant name for a join table, in which case the name of the join table can be a combination of the names of the tables that are joined, e.g., <em>user_teams</em> could fit our situation.

We make a small addition to the&nbsp;<em>models/index.js</em>&nbsp;file to connect teams and users at the code level using the&nbsp;<a href="https://sequelize.org/docs/v6/core-concepts/assocs/#implementation-2" target="_blank" rel="noreferrer noopener">belongsToMany</a>&nbsp;method.

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

module.exports = {
  Note, User, Team, Membership
}
```

Note the difference between the migration of the join table and the model when defining foreign key fields. During the migration, fields are defined in snake case form:

```
await queryInterface.createTable('memberships', {
  // ...
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  }
})
```

in the model, the same fields are defined in camel case:

```
Membership.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
  // ...
})
```

Now let's create a couple of teams from the psql console, as well as a few memberships:

```sql
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

Information about users' teams is then added to route for retrieving all users

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
      }
    ]
  })
  res.json(users)
})
```

The most observant will notice that the query printed to the console now combines three tables.

The solution is quite good, but there is one flaw. The result also includes the attributes of the join table row, even though we do not want them:

![صورة توضيحية](/images/mooc/b99243067a92.webp)

By carefully reading the documentation, you can find a&nbsp;<a href="https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table" target="_blank" rel="noreferrer noopener">solution</a>:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.json(users)
})
```

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step8" target="_blank" rel="noreferrer noopener">GitHub</a>, branch<em> step8</em>.

### Note on the properties of Sequelize model objects

The definition of our models included the following lines, among others:

```
User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

These allow Sequelize to make queries that retrieve, for example, all the notes of users, or all members of a team.

Thanks to the definitions, we also have direct access to, for example, the user's notes in the code. For example, the following code would search for the user with id 1 and print the notes associated with that user:

```js
const user = await User.findByPk(1, {
  include: {
    model: Note
  }
})

user.notes.forEach(note =&gt; {
  console.log(note.content)
})
```

The&nbsp;<em>User.hasMany(Note)</em>&nbsp;definition therefore attaches a&nbsp;<em>notes</em>&nbsp;property to the&nbsp;<em>user</em>&nbsp;object, which gives access to the notes made by the user. The&nbsp;<em>User.belongsToMany(Team, { through: Membership }))</em>&nbsp;definition similarly attaches a&nbsp;<em>teams</em>&nbsp;property to the&nbsp;<em>user</em>&nbsp;object, which can also be used in the code:

```js
const user = await User.findByPk(1, {
  include: {
    model: Team
  }
})

user.teams.forEach(team => {
  console.log(team.name)
})
```

Suppose we would like to return a JSON object from the single user's route containing the user's name, username and number of notes created. We could try the following:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    user.note_count = user.notes.length
    delete user.notes
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

So, we tried to add the <em>noteCount</em> field on the object returned by Sequelize and remove the <em>notes</em> field from it. However, this approach does not work because the objects returned by Sequelize are not normal objects to which we can add new fields as we wish.

A better solution is to create a completely new object based on the data retrieved from the database:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    res.json({
      username: user.username,
      name: user.name,
      note_count: user.notes.length
    })
  } else {
    res.status(404).end()
  }
})
```

### Revisiting many-to-many relationships

Let's make another many-to-many relationship in the application. Each note is associated to the user who created it by a foreign key. It is now decided that the application also supports that the note can be associated with other users, and that a user can be associated with an arbitrary number of notes created by other users. The idea is that these notes are those that the user has&nbsp;<em>marked</em>&nbsp;for himself.

Let's make a join table <em>user_notes</em> for the situation. The migration, that is saved in file <em>20260211_04_add_user_notes.js</em> is straightforward:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('user_notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'notes', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('user_notes')
  },
}
```

Also, there is nothing special about the model:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserNotes extends Model {}

UserNotes.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'notes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_notes'
})

module.exports = UserNotes
```

The file&nbsp;<em>models/index.js</em>, on the other hand, comes with a slight change to what we saw before:

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes')

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })

module.exports = {
  Note, User, Team, Membership, UserNotes
}
```

Once again, <em>belongsToMany</em> is used to link the user to the user's notes. The link is done via the join table that corresponds to the model UserNotes. However, this time we give an <em>alias name</em> for the attribute formed using the keyword as. The default name <em>user.notes</em> would overlap with its previous meaning, i.e., notes created by the user.

We extend the route for an individual user to return the user's teams, their own notes, and other notes marked by the user:

```js
router.get('/:id', async (req, res) =&gt; {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

In the context of the include, we must now use the alias name&nbsp;<em>marked_notes</em>&nbsp;which we have just defined with the&nbsp;<em>as</em>&nbsp;attribute.

In order to test the feature, let's create some test data in the database:

```sql
insert into user_notes (user_id, note_id) values (3, 1);
insert into user_notes (user_id, note_id) values (3, 3);
```

The end result looks good:

![صورة توضيحية](/images/mooc/8fe5b762dfd2.webp)

What if we wanted to include information about the author of the note in the notes marked by the user as well? This can be done by adding an&nbsp;<em>include</em>&nbsp;to the marked notes:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

Finally we get what we want:

![صورة توضيحية](/images/mooc/09d7a4b213c2.webp)

The current code for the application is in its entirety on <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step9" target="_blank" rel="noreferrer noopener">GitHub</a>, branch <em>step9</em>.

<div class="tasks">

**20. Reading list**

</div>

<div class="tasks">

**21. Expanding the reading list**

</div>

<div class="tasks">

**22. Bookkeeping**

</div>

<div class="tasks">

**23. Better bookkeeping**

</div>

<div class="tasks">

**24. More control**

</div>

### Concluding remarks

Our application is now in at least acceptable condition. However, before concluding this section, we will examine a few more points.

#### Eager vs lazy fetch

When we make queries using the&nbsp;<em>include</em>&nbsp;attribute:

```
User.findOne({
  include: {
    model: note
  }
})
```

This causes an <a href="https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations" target="_blank" rel="noreferrer noopener">eager fetch</a>, i.e., all the rows of the tables attached to the user by the join query, in the example, the notes made by the user are fetched from the database at the same time. This is often what we want, but there are also situations where you want to do a <em>lazy fetch</em>, that is, search for user-related teams only if they are needed.

Let's now modify the route for an individual user so that it fetches the user's teams only if the query parameter&nbsp;<em>teams</em>&nbsp;is set in the request:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
    ]
  })

  if (!user) {
    return res.status(404).end()
  }

  let teams = undefined
  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: []
    })
  }
  res.json({ ...user.toJSON(), teams })
})
```

So now, the&nbsp;<em>User.findByPk</em>&nbsp;query does not retrieve teams, but they are retrieved if necessary by the&nbsp;<em>user</em>&nbsp;method&nbsp;<em>getTeams</em>, which is automatically generated by Sequelize for the model object. Similar&nbsp;<em>get</em>- and a few other useful methods&nbsp;<a href="https://sequelize.org/master/manual/assocs.html#special-methodsmixins-added-to-instances" target="_blank" rel="noreferrer noopener">are automatically generated</a>&nbsp;when defining associations for tables at the Sequelize level.

#### Features of models

There are some situations where, by default, we do not want to handle all the rows of a particular table. One such case could be that we don't normally want to display users that have been <em>disabled</em> in our application. In such a situation, we could define the default <a href="https://sequelize.org/master/manual/scopes.html" target="_blank" rel="noreferrer noopener">scope</a> for the model like this:

```js
class User extends Model {}

User.init({
  // field definitions
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
})

module.exports = User
```

Now the query caused by the function call&nbsp;<em>User.findAll()</em>&nbsp;has the following WHERE condition:

```
WHERE "user". "disabled" = false;
```

For models, it is possible to define other scopes as well:

```js
User.init({
  // field definitions
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    },
  }
})
```

Scopes are used as follows:

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = await User.scope({ method: ['name', '%jami%'] }).findAll()
```

It is also possible to chain scopes:

```js
// admins with the string jami in their name
const jamiUsers = await User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

Since Sequelize models are normal <a href="https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes" target="_blank" rel="noreferrer noopener">JavaScript classes</a>, it is possible to add new methods to them.

Here are two examples:

```js
const { Model, DataTypes, Op } = require('sequelize')

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {

  async numberOfNotes() {
    return (await this.getNotes()).length
  }

  static async withNotes(limit){
    return await User.findAll({
      attributes: {
        include: [[ sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count" ]]
      },
      include: [
        {
          model: Note,
          attributes: []
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
}

User.init({
  // ...
})

module.exports = User
```

The first of the methods&nbsp;<em>numberOfNotes</em>&nbsp;is an&nbsp;<em>instance method</em>, meaning that it can be called on instances of the model:

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.numberOfNotes()
console.log(`Jami has created ${cnt} notes`)
```

Within the instance method, the keyword&nbsp;<em>this</em>&nbsp;therefore refers to the instance itself:

```js
async numberOfNotes() {
  return (await this.getNotes()).length
}
```

The second method <em>withNotes</em> returns users with at least the specified number of notes. It is a <em>class method</em>, meaning that it is called directly on the model:

```js
const users = await User.withNotes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Code duplication in models and migrations

We have noticed that the code for models and migrations is very similar. For example, the model of teams

```js
class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

and migration contain much of the same code

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('teams')
  },
}
```

Couldn't we optimize the code so that, for example, the model exports the shared parts needed for the migration?

The problem is that the definition of the model may change over time, for example, the name field may change, or its data type may change. Migrations must be able to be performed successfully at any time from start to end, and if the migrations are relying on the model to have certain content, it may no longer be true in a month or a year's time. Therefore, despite the "copy paste", the migration code should be completely separate from the model code.

One solution would be to use Sequelize's&nbsp;<a href="https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration" target="_blank" rel="noreferrer noopener">command line tool</a>, which generates both models and migration files based on commands given at the command line. For example, the following command would create a&nbsp;<em>User</em>&nbsp;model with&nbsp;<em>name</em>,&nbsp;<em>username</em>, and&nbsp;<em>admin</em>&nbsp;as attributes, as well as the migration that manages the creation of the database table:

```bash
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

From the command line, you can also run rollbacks, i.e. undo migrations. The command line documentation is unfortunately incomplete and in this course we decided to do both models and migrations manually. The solution may or may not have been a wise one.

<div class="tasks">

**25. Grande finale**

</div>

<div class="tasks">

**26. The final check**

</div>

<div class="tasks">

**27. Your GitHub repository**

</div>
