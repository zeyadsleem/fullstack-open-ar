---
part: 8
letter: d
title: "Chapter 4: Database and user administration"
mainImage: /images/part-8.svg
lang: en
---
In this chapter, we’ll start using a database to store data and extend the application with user management. First, however, we’ll refactor the backend code. The current code for the phonebook backend can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;in the&nbsp;<em>part8-3</em>&nbsp;branch.

## Refactoring the backend

So far, we’ve written all the code in the&nbsp;<em>index.js</em>&nbsp;file. As the application grows, this is no longer sensible: as the file gets longer, its readability and comprehensibility suffer. It’s also good programming practice to separate different responsibilities of the application into their own modules.

Let’s now refactor the backend by splitting it into multiple files.

We’ll start by extracting the application’s GraphQL schema into a file called&nbsp;<em>schema.js</em>:

```js
const typeDefs = /* GraphQL */ `
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`

module.exports = typeDefs
```

Next, we’ll move the code responsible for the resolvers into its own module,&nbsp;<em>resolvers.js</em>:

```js
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
]

const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: (root, args) =&gt; {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) =&gt;
        args.phone === 'YES' ? person.phone : !person.phone
      return persons.filter(byPhone)
    },
    findPerson: (root, args) =&gt; persons.find((p) =&gt; p.name === args.name),
  },
  Person: {
    address: ({ street, city }) =&gt; {
      return {
        street,
        city,
      }
    },
  },
  Mutation: {
    addPerson: (root, args) =&gt; {
      if (persons.find((p) =&gt; p.name === args.name)) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
    editNumber: (root, args) =&gt; {
      const person = persons.find((p) =&gt; p.name === args.name)
      if (!person) {
        return null
      }

      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map((p) =&gt; (p.name === args.name ? updatedPerson : p))
      return updatedPerson
    },
  },
}

module.exports = resolvers
```

For simplicity, the&nbsp;<em>persons</em>&nbsp;array that holds the people’s data is now placed in the same file as the resolvers. The array will soon be removed when we switch to using a database for storing data.

Finally, we’ll also move the code responsible for starting the Apollo server into its own file,&nbsp;<em>server.js</em>:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = (port) =&gt; {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
  }).then(({ url }) =&gt; {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
```

Starting the Apollo server is now handled inside the&nbsp;<em>startServer</em>&nbsp;function we defined ourselves. This lets us export the function and start the server from outside the module, from the&nbsp;<em>index.js</em>&nbsp;file. The function takes as a parameter the port that Apollo Server will listen on.

Let’s install the&nbsp;<em>dotenv</em>&nbsp;library so that we can define environment variables in a&nbsp;<em>.env</em>&nbsp;file:

```bash
npm install dotenv
```

Only a small amount of code remains in&nbsp;<em>index.js</em>. After the refactor, its contents are as follows:

```js
require('dotenv').config()

const startServer = require('./server')

const PORT = process.env.PORT || 4000

startServer(PORT)
```

Environment variables are first read from the&nbsp;<em>.env</em>&nbsp;file using the&nbsp;<em>dotenv</em>&nbsp;library. The port to use is now read from an environment variable, if one is set. If the&nbsp;<em>PORT</em>&nbsp;environment variable is not found, the default port 4000 is used—which is also the port the frontend currently expects the server to be running on. Finally, Apollo Server is started by calling the function startServer.

For now, the contents of&nbsp;<em>index.js</em>&nbsp;are just a stub, but as the application grows it will include more. For example, when we soon switch to using a database for storing data, the database connection must be created before starting the server.

The responsibilities of the application are now clearly separated:
- <em>index.js</em> acts as the main program, whose only responsibility is the startup logic. It ensures that different parts of the application are started in the correct order.
- The GraphQL schema is defined in the <em>schema.js</em> module. It describes the structure of the API—for example, which queries and mutations are possible through the API and what kinds of fields different objects have.
- The actual application logic is defined in the <em>resolvers.js</em> module. Its responsibility is, for example, to define what actually happens for different queries, where the data is fetched from, and how it is processed.
- The code responsible for configuring and starting Apollo Server is defined in a separate module, <em>server.js</em>.

## Mongoose and Apollo

Let’s now start using a MongoDB database in our application. We’ll introduce the database by following the approach used in parts <a href="https://fullstackopen.com/en/part3/saving_data_to_mongo_db" target="_blank" rel="noreferrer noopener">3</a> and <a href="https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">4</a>.

Install Mongoose:

```bash
npm install mongoose
```

Define the person schema in the file&nbsp;<em>models/person.js</em>&nbsp;as follows:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

We also included a few validations.&nbsp;<code>required: true</code>, which makes sure that a value exists, is actually redundant: we already ensure that the fields exist with GraphQL. However, it is good to also keep validation in the database.

Let’s create a separate module&nbsp;<em>db.js</em>&nbsp;for the code that establishes the database connection:

```js
const mongoose = require('mongoose')

const connectToDatabase = async (uri) =&gt; {
  console.log('connecting to database URI:', uri)

  try {
    await mongoose.connect(uri)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connection to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectToDatabase
```

The module defines the function&nbsp;<code>connectToDatabase</code>, which receives the database URI as a parameter and takes care of connecting to the database.

Let’s use the module in the file&nbsp;<em>index.js</em>:

```js
require('dotenv').config()

const connectToDatabase = require('./db') // HIGHLIGHT LINE
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI // HIGHLIGHT LINE
const PORT = process.env.PORT || 4000

const main = async () =&gt; { // HIGHLIGHT LINE
  await connectToDatabase(MONGODB_URI) // HIGHLIGHT LINE
  startServer(PORT)
}

main()
```

Because the&nbsp;<em>async/await</em>&nbsp;syntax can only be used inside functions, we now define a simple&nbsp;<em>main</em>&nbsp;function that handles starting the application. This allows us to call the function that creates the database connection using the&nbsp;<em>await</em>&nbsp;keyword.

The value of <code>MONGODB_URI</code> is obtained from an environment variable, so you need to add an appropriate value for it to the <em>.env</em> file in the same way as in <a href="https://fullstackopen.com/en/part3/saving_data_to_mongo_db#defining-environment-variables-using-the-dotenv-library" target="_blank" rel="noreferrer noopener">part 3</a>. The application first calls the function that creates the database connection, and once the database connection has been successfully established, it starts the GraphQL server.

The contents of&nbsp;<em>resolvers.js</em>, which is responsible for the application logic, will change almost completely. We can get the application to work largely by making the following changes:

```js
const { GraphQLError } = require('graphql')
const Person = require('./models/person')

const resolvers = {
  Query: {
    personCount: async () =&gt; Person.collection.countDocuments(),
    allPersons: async (root, args) =&gt; {
      // filters missing
      return Person.find({})
    },
    findPerson: async (root, args) =&gt; Person.findOne({ name: args.name }),
  },
  Person: {
    address: ({ street, city }) =&gt; {
      return {
        street,
        city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) =&gt; {
      const nameExists = await Person.exists({ name: args.name })

      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) =&gt; {
      const person = await Person.findOne({ name: args.name })

      if (!person) {
        return null
      }

      person.phone = args.phone
      return person.save()
    },
  },
}

module.exports = resolvers
```

The changes are pretty straightforward. However, there are a few noteworthy things. As we remember, in Mongo, the identifying field of an object is called&nbsp;<em>_id</em>&nbsp;and we previously had to parse the name of the field to&nbsp;<em>id</em>&nbsp;ourselves. Now GraphQL can do this automatically.

Another noteworthy thing is that the resolver functions now return a&nbsp;<em>promise</em>, when they previously returned normal objects. When a resolver returns a promise, Apollo server&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/resolvers#return-values" target="_blank" rel="noreferrer noopener">sends back</a>&nbsp;the value which the promise resolves to.

For example, if the following resolver function is executed,

```js
allPersons: async (root, args) =&gt; {
  return Person.find({})
},
```

Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:

```js
allPersons: async (root, args) =&gt; {
  const result = await Person.find({})
  return result
}
```

Let's complete the&nbsp;<code>allPersons</code>&nbsp;resolver so it takes the optional parameter&nbsp;<code>phone</code>&nbsp;into account:

```js
Query: {
  // ..
  allPersons: async (root, args) =&gt; {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
  },
},
```

So if the query has not been given a parameter&nbsp;<code>phone</code>, all persons are returned. If the parameter has the value&nbsp;<em>YES</em>, the result of the query

```
Person.find({ phone: { $exists: true }})
```

is returned, so the objects in which the field&nbsp;<code>phone</code>&nbsp;has a value. If the parameter has the value&nbsp;<em>NO</em>, the query returns the objects in which the&nbsp;<code>phone</code>&nbsp;field has no value:

```
Person.find({ phone: { $exists: false }})
```

## Validation

As well as in GraphQL, the input is now validated using the validations defined in the mongoose schema. For handling possible validation errors in the schema, we must add an error-handling&nbsp;<code>try/catch</code>&nbsp;block to the&nbsp;<code>save</code>&nbsp;method. When we end up in the catch, we throw an exception&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a>&nbsp;with error code :

```js
Mutation: {
  addPerson: async (root, args) =&gt; {
      const nameExists = await Person.exists({ name: args.name })

      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = new Person({ ...args })

// BEGIN HIGHLIGHT
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
// END HIGHLIGHT
  },
    editNumber: async (root, args) =&gt; {
      const person = await Person.findOne({ name: args.name })

      if (!person) {
        return null
      }

      person.phone = args.phone

// BEGIN HIGHLIGHT
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(`Saving number failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
// END HIGHLIGHT
    }
}
```

We have also added the Mongoose error and the data that caused the error to the&nbsp;<em>extensions</em>&nbsp;object that is used to convey more info about the cause of the error to the caller. The frontend can then display this information to the user, who can try the operation again with a better input.

The code of the backend can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4" target="_blank" rel="noreferrer noopener">Github</a>, branch&nbsp;<em>part8-4</em>.

### User and log in

Let's add user management to our application. For simplicity's sake, let's assume that all users have the same password which is hardcoded to the system. It would be straightforward to save individual passwords for all users following the principles from <a href="https://fullstackopen.com/en/part4/user_administration" target="_blank" rel="noreferrer noopener">part 4</a>, but because our focus is on GraphQL, we will leave out all that extra hassle this time.

Let’s create the user schema in the file&nbsp;<em>models/user.js</em>:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

Every user is connected to a bunch of other persons in the system through the&nbsp;<code>friends</code>&nbsp;field. The idea is that when a user, e.g.&nbsp;<em>mluukkai</em>, adds a person, e.g.&nbsp;<em>Arto Hellas</em>, to the list, the person is added to their&nbsp;<code>friends</code>&nbsp;list. This way, logged-in users can have their own personalized view in the application.

Logging in and identifying the user are handled the same way we used in <a href="https://fullstackopen.com/en/part4/token_authentication" target="_blank" rel="noreferrer noopener">part 4</a> when we used REST, by using tokens.

Let's extend the GraphQL schema like so:

```
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(username: String!): User
  login(username: String!, password: String!): Token
}
```

The query&nbsp;<code>me</code>&nbsp;returns the currently logged-in user. New users are created with the&nbsp;<code>createUser</code>&nbsp;mutation, and logging in happens with the&nbsp;<code>login</code>&nbsp;mutation.

Let’s install the jsonwebtoken library:

```bash
npm install jsonwebtoken
```

The resolvers of the new mutations are as follows:

```js
const jwt = require('jsonwebtoken')
const User = require('./models/user')

Mutation: {
  // ..
  createUser: async (root, args) =&gt; {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error =&gt; {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
  login: async (root, args) =&gt; {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

The new user mutation is straightforward. The login mutation checks if the username/password pair is valid. And if it is indeed valid, it returns a jwt token familiar from <a href="https://fullstackopen.com/en/part4/token_authentication" target="_blank" rel="noreferrer noopener">part 4</a>. Note that the <code>JWT_SECRET</code> must be defined in the <em>.env</em> file.

User creation is done now as follows:

```
mutation {
  createUser (
    username: "mluukkai"
  ) {
    username
    id
  }
}
```

The mutation for logging in looks like this:

```
mutation {
  login (
    username: "mluukkai"
    password: "secret"
  ) {
    value
  }
}
```

Just like in the previous case with REST, the idea now is that a logged-in user adds a token they receive upon login to all of their requests. And just like with REST, the token is added to GraphQL queries using the&nbsp;<em>Authorization</em>&nbsp;header.

In the Apollo Explorer, the header is added to a query like so:

![apollo explorer highlighting headers with authorization and bearer token](/images/mooc/60f94bca66a8.webp)

On the backend, the most convenient way to pass the token that arrives with the request to the resolvers is to use Apollo Server’s&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a>. With the context, we can perform things that are common to all queries and mutations, for example&nbsp;<a href="https://www.apollographql.com/blog/authorization-in-graphql/" target="_blank" rel="noreferrer noopener">identifying the user</a>&nbsp;associated with the request.

Let’s change the backend startup so that the object passed as the second parameter to the&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/standalone/" target="_blank" rel="noreferrer noopener">startStandaloneServer</a>&nbsp;function includes a&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a>&nbsp;field, and let’s create a helper function&nbsp;<code>getUserFromAuthHeader</code>&nbsp;to verify the validity of the token and to find the user from the database:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken') // HIGHLIGHT LINE

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user') // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const getUserFromAuthHeader = async (auth) =&gt; {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}
// END HIGHLIGHT

const startServer = (port) =&gt; {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    // BEGIN HIGHLIGHT
    context: async ({ req }) =&gt; {
      const auth = req.headers.authorization
      const currentUser = await getUserFromAuthHeader(auth)
      return { currentUser }
    },
    // END HIGHLIGHT
  }).then(({ url }) =&gt; {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
```

So the code we defined first extracts the token contained in the request’s&nbsp;<code>Authorization</code>&nbsp;header. The helper function&nbsp;<code>getUserFromAuthHeader</code>&nbsp;decodes the token and looks up the corresponding user from the database. If the token is not valid or the user cannot be found, the function returns&nbsp;<code>null</code>.

Finally, the context field&nbsp;<code>currentUser</code>&nbsp;is set to the user object corresponding to the requester, or to&nbsp;<code>null</code>&nbsp;if no user was found:

```js
context: async ({ req }) =&gt; {
  const auth = req.headers.authorization
  const currentUser = await getUserFromAuthHeader(auth)
  return { currentUser } // HIGHLIGHT LINE
},
```

The context value is passed to resolvers as the&nbsp;<code>third parameter</code>. The resolver for the&nbsp;<code>me</code>&nbsp;query is very simple: it only returns the currently logged-in user, which it gets from the resolver parameter&nbsp;<code>context</code>, from the field&nbsp;<code>currentUser</code>:

```js
Query: {
  // ...
  me: (root, args, context) =&gt; {
    return context.currentUser
  }
},
```

If the header contains a valid token, the query returns the details of the user identified by the token.

![apollo studio showing query response object](/images/mooc/646446e12fd0.webp)

## Friends list

Let's complete the application's backend so that adding and editing persons requires logging in, and added persons are automatically added to the friends list of the user.

Let's first remove all persons not in anyone's friends list from the database.

<code>addPerson</code>&nbsp;mutation changes like so:

```js
Mutation: {
  // BEGIN HIGHLIGHT
  addPerson: async (root, args, context) =&gt; {
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
        }
      })
    }
    // END HIGHLIGHT

    const nameExists = await Person.exists({ name: args.name })

    if (nameExists) {
      throw new GraphQLError(`Name must be unique: ${args.name}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        },
      })
    }

    const person = new Person({ ...args })

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person) // HIGHLIGHT LINE
      await currentUser.save() // HIGHLIGHT LINE
    } catch (error) {
      throw new GraphQLError(`Saving person failed: ${error.message}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }

    return person
  },
  //...
}
```

If a logged-in user cannot be found from the context, an&nbsp;<code>GraphQLError</code>&nbsp;with a proper message is thrown. Creating new persons is now done with&nbsp;<code>async/await</code>&nbsp;syntax, because if the operation is successful, the created person is added to the friends list of the user.

Let’s also add the ability to add a person to your own friends list. The mutation schema is as follows:

```
type Mutation {
  // ...
  addAsFriend(name: String!): User // HIGHLIGHT LINE
}
```

And the mutation's resolver:

```js
  addAsFriend: async (root, args, { currentUser }) =&gt; {
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }

    const nonFriendAlready = (person) =&gt;
      !currentUser.friends
        .map((f) =&gt; f._id.toString())
        .includes(person._id.toString())

    const person = await Person.findOne({ name: args.name })

    if (!person) {
      throw new GraphQLError("The name didn't found", {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        },
      })
    }

    if (nonFriendAlready(person)) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

Note how the resolver&nbsp;<em>destructures</em>&nbsp;the logged-in user from the context. So instead of saving&nbsp;<code>currentUser</code>&nbsp;to a separate variable in a function

```js
addAsFriend: async (root, args, context) =&gt; {
  const currentUser = context.currentUser
```

it is received straight in the parameter definition of the function:

```
addAsFriend: async (root, args, { currentUser }) =&gt; {
```

The following query now returns the user's friends list:

```
query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
```

The code of the backend can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a>&nbsp;branch&nbsp;<em>part8-5</em>.

<div class="tasks">

**13. Database, part 1**

</div>

<div class="tasks">

**14. Database, part 2**

</div>

<div class="tasks">

**15. Database, part 3**

</div>

<div class="tasks">

**16. User and logging in**

</div>

<div class="tasks">

**17. Checkup**

</div>
