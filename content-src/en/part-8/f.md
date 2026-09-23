---
part: 8
letter: f
title: "Chapter 6: Fragments and subscriptions"
mainImage: /images/part-8.svg
lang: en
---
We are approaching the end of this part. Let's finish by having a look at a few more details about GraphQL.

## Fragments

It is pretty common in GraphQL that multiple queries return similar results. For example, the query for the details of a person

```
query {
  findPerson(name: "Pekka Mikkola") {
    name
    phone
    address{
      street
      city
    }
  }
}
```

and the query for all persons

```
query {
  allPersons {
    name
    phone
    address{
      street
      city
    }
  }
}
```

both return persons. When choosing the fields to return, both queries have to define exactly the same fields.

Such situations can be simplified by using&nbsp;<a href="https://graphql.org/learn/queries/#fragments" target="_blank" rel="noreferrer noopener">fragments</a>. A fragment that selects all of a person’s details looks like this:

```
fragment PersonDetails on Person {
  name
  phone
  address {
    street
    city
  }
}
```

With the fragment, we can do the queries in a compact form:

```
query {
  allPersons {
    ...PersonDetails // HIGHLIGHT LINE
  }
}

query {
  findPerson(name: "Pekka Mikkola") {
    ...PersonDetails // HIGHLIGHT LINE
  }
}
```

The fragments&nbsp;<em><strong>are not</strong></em>&nbsp;defined in the GraphQL schema, but in the client. The fragments must be declared when the client uses them for queries.

In principle, we could declare the fragment with each query like so:

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

However, it is much more sensible to define the fragment once and store it in a variable. Let’s add the fragment definition to the beginning of the&nbsp;<em>queries.js</em>&nbsp;file:

```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

The fragment can now be embedded into all queries and mutations that need it using the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals" target="_blank" rel="noreferrer noopener">dollar curly braces</a>&nbsp;operation:

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

So the template literal in the&nbsp;<code>PERSON_DETAILS</code>&nbsp;variable is now inserted as part of the&nbsp;<code>FIND_PERSON</code>&nbsp;template literal. In practice, the end result is exactly the same as in the earlier example, where the fragment was defined directly alongside the query.

## Subscriptions

Along with query and mutation types, GraphQL offers a third operation type:&nbsp;<a href="https://www.apollographql.com/docs/react/data/subscriptions/" target="_blank" rel="noreferrer noopener">subscriptions</a>. With subscriptions, clients can&nbsp;<em>subscribe</em>&nbsp;to updates about changes in the server.

Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way. With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server. When changes occur on the server, it sends a notification to all of its&nbsp;<em>subscribers</em>.

Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser. So, under the hood, Apollo uses&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noreferrer noopener">WebSockets</a>&nbsp;for server subscriber communication.

## expressMiddleware

Starting from version 3.0, Apollo Server no longer provides direct support for subscriptions. We therefore need to make a number of changes to the backend code in order to get subscriptions working.

So far, we have started the application with the easy-to-use function&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/standalone/#startstandaloneserver" target="_blank" rel="noreferrer noopener">startStandaloneServer</a>, thanks to which the application has not had to be configured that much:

```js
const { startStandaloneServer } = require('@apollo/server/standalone')

// ...

const startServer = (port) =&gt; {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) =&gt; {
      // ...
    },
  }).then(({ url }) =&gt; {
    console.log(`Server ready at ${url}`)
  })
}
```

Unfortunately, startStandaloneServer does not allow adding subscriptions to the application, so let's switch to the more robust&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/express-middleware/" target="_blank" rel="noreferrer noopener">expressMiddleware</a>&nbsp;function. As the name of the function already suggests, it is an Express middleware, which means that Express must also be configured for the application, with the GraphQL server acting as middleware.

Let’s install Express and the Apollo Server integration package:

```bash
npm install express cors @as-integrations/express5
```

and change the&nbsp;<em>server.js</em>&nbsp;file to the following form:

```js
const { ApolloServer } = require('@apollo/server')
// BEGIN HIGHLIGHT
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
// END HIGHLIGHT
const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) =&gt; {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}

// BEGIN HIGHLIGHT
const startServer = async (port) =&gt; {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) =&gt; {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    }),
  )

  httpServer.listen(port, () =&gt;
    console.log(`Server is now running on http://localhost:${port}`),
  )
}
// END HIGHLIGHT

module.exports = startServer
```

The GraphQL server in the&nbsp;<code>server</code>&nbsp;variable is now connected to listen to the root of the server, i.e. to the&nbsp;<code>/</code>&nbsp;route, using the&nbsp;<code>expressMiddleware</code>&nbsp;object. Information about the logged-in user is set in the context using the function we defined earlier. Since it is an Express server, the middlewares express-json and cors are also needed so that the data included in the requests is correctly parsed and so that CORS problems do not appear.

The GraphQL server must be started before the Express application can begin listening on the specified port, so the&nbsp;<code>startServer</code>&nbsp;function has been made an&nbsp;<em>async function</em>&nbsp;in order to be able to wait for the GraphQL server to start:

```
await server.start()
```

Following the recommendations in the documentation,&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server" target="_blank" rel="noreferrer noopener">ApolloServerPluginDrainHttpServer</a>&nbsp;has been added to the GraphQL server configuration:

```js
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // HIGHLIGHT LINE
  })
```

This plugin ensures that the server is shut down cleanly when the server process is stopped. For example, it makes it possible to finish processing in-flight requests and close client connections so that they don’t get left hanging.

The backend code can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6" target="_blank" rel="noreferrer noopener">GitHub</a>, branch&nbsp;<em>part8-6</em>.

## Subscriptions on the server

Let's implement subscriptions for subscribing for notifications about new persons added.

The schema changes like so:

```
type Subscription {
  personAdded: Person!
}
```

So when a new person is added, all of its details are sent to all subscribers.

First, we have to install packages for adding subscriptions to GraphQL and a Node.js WebSocket library:

```bash
npm install graphql-ws ws @graphql-tools/schema
```

The file&nbsp;<em>server.js</em>&nbsp;is changed to:

```js
// BEGIN HIGHLIGHT
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
// END HIGHLIGHT

// ...

const startServer = async (port) =&gt; {
  const app = express()
  const httpServer = http.createServer(app)

  // BEGIN HIGHLIGHT
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  // END HIGHLIGHT

  const server = new ApolloServer({
    // BEGIN HIGHLIGHT
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          }
        },
      },
    ],
    // END HIGHLIGHT
  })

  await server.start()

  // ...
}
```

When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noreferrer noopener">WebSockets</a>.

The configuration above creates, alongside the HTTP request listener, a service that listens for WebSockets and binds it to the server’s GraphQL schema. The second part of the setup registers a function that closes the WebSocket connection when the server is shut down. If you’re interested in the configurations in more detail, Apollo’s&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;explains fairly precisely what each line of code does.

Unlike with HTTP, when using WebSockets the server can also take the initiative in sending data. Therefore, WebSockets are well suited for GraphQL subscriptions, where the server must be able to notify all clients that have made a particular subscription when the corresponding event (e.g. creating a person) occurs.

The subscription&nbsp;<code>personAdded</code>&nbsp;needs a resolver. The&nbsp;<code>addPerson</code>&nbsp;resolver also has to be modified so that it sends a notification to subscribers.

Let’s first install a library that provides&nbsp;<a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank" rel="noreferrer noopener">publish–subscribe</a>&nbsp;functionality:

```bash
npm install graphql-subscriptions
```

The changes to the&nbsp;<em>resolvers.js</em>&nbsp;file are as follows:

```js
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions') // HIGHLIGHT LINE
const jwt = require('jsonwebtoken')

const Person = require('./models/person')
const User = require('./models/user')

const pubsub = new PubSub() // HIGHLIGHT LINE

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) =&gt; {
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          })
        }

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
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      pubsub.publish('PERSON_ADDED', { personAdded: person })  // HIGHLIGHT LINE

      return person
    },
    // ...
  },
  // BEGIN HIGHLIGHT
  Subscription: {
    personAdded: {
      subscribe: () =&gt; pubsub.asyncIterableIterator('PERSON_ADDED')
    },
  },
  // END HIGHLIGHT
}
```

With subscriptions, communication follows the publish–subscribe pattern using the&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class" target="_blank" rel="noreferrer noopener">PubSub</a>&nbsp;object.

There are only a few lines of code added, but quite a lot is happening under the hood. The resolver of the&nbsp;<code>personAdded</code>&nbsp;subscription registers and saves info about all the clients that do the subscription. The clients are saved to an&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events" target="_blank" rel="noreferrer noopener">"iterator object"</a>&nbsp;called&nbsp;<em>PERSON_ADDED</em>&nbsp;thanks to the following code:

```
Subscription: {
  personAdded: {
    subscribe: () =&gt; pubsub.asyncIterableIterator('PERSON_ADDED')
  },
},
```

The iterator name is an arbitrary string, but to follow the convention, it is the subscription name written in capital letters.

Adding a new person&nbsp;<em>publishes</em>&nbsp;a notification about the operation to all subscribers with PubSub's method&nbsp;<code>publish</code>:

```
pubsub.publish('PERSON_ADDED', { personAdded: person })
```

Execution of this line sends a WebSocket message about the added person to all the clients registered in the iterator&nbsp;<em>PERSON_ADDED</em>.

It's possible to test the subscriptions with the Apollo Explorer like this:

![apollo explorer showing subscriptions tab and response](/images/mooc/d8fad9340390.webp)

So the subscription is

```
subscription Subscription {
  personAdded {
    phone
    name
  }
}
```

When the blue button&nbsp;<em>PersonAdded</em>&nbsp;is pressed, Explorer starts to wait for a new person to be added. On addition, the info of the added person appears on the right side of the Explorer.

Implementing subscriptions involves a lot of different configuration. For the few exercises in this course, you’ll do fine without worrying about all the details. However, if you are implementing subscriptions in an application intended for real-world use, you should definitely read Apollo’s&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions" target="_blank" rel="noreferrer noopener">documentation on subscriptions</a>.

The backend code can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7" target="_blank" rel="noreferrer noopener">GitHub</a>, branch&nbsp;<em>part8-7</em>.

## Subscriptions on the client

In order to use subscriptions in our React application, we have to do some changes, especially to its&nbsp;<a href="https://www.apollographql.com/docs/react/data/subscriptions/" target="_blank" rel="noreferrer noopener">configuration</a>.

Let’s add the&nbsp;<em>graphql-ws</em>&nbsp;library as a frontend dependency. It enables&nbsp;<em>WebSocket</em>&nbsp;connections for GraphQL subscriptions:

```bash
npm install graphql-ws
```

The configuration in&nbsp;<em>main.jsx</em>&nbsp;has to be modified like so:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  ApolloLink, // HIGHLIGHT LINE
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
// BEGIN HIGHLIGHT
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
// END HIGHLIGHT

const authLink = new SetContextLink(({ headers }) =&gt; {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// BEGIN HIGHLIGHT
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
// END HIGHLIGHT

// BEGIN HIGHLIGHT
const splitLink = ApolloLink.split(
  ({ query }) =&gt; {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &amp;&amp;
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)
// END HIGHLIGHT

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink, // HIGHLIGHT LINE
})

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;ApolloProvider client={client}&gt;
      &lt;App /&gt;
    &lt;/ApolloProvider&gt;
  &lt;/StrictMode&gt;,
)
```

The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server:

```js
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
```

Let’s then modify the application so that it subscribes to information about new people from the server. Add the code that defines the subscription to the&nbsp;<em>queries.js</em>&nbsp;file:

```js
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

Subscriptions are created using the&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription" target="_blank" rel="noreferrer noopener">useSubscription</a>&nbsp;hook function. Let’s create a subscription in the&nbsp;<em>App</em>&nbsp;component:

```js
import {
  useApolloClient,
  useQuery,
  useSubscription, // HIGHLIGHT LINE
} from '@apollo/client/react'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries' // HIGHLIGHT LINE

const App = () =&gt; {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  // BEGIN HIGHLIGHT
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) =&gt; {
      console.log(data)
    },
  })
  // END HIGHLIGHT

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  // ...
}
```

When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the client’s console:

![dev tools showing data personAdded Object with Mainroad](/images/mooc/297ad348db44.webp)

When a new person is added to the list, the server sends the details to the client, and the callback function defined as the value of the&nbsp;<em>useSubscription</em>&nbsp;hook’s&nbsp;<code>onData</code>&nbsp;attribute is called, with the person added on the server passed to it as a parameter.

We can show the user a notification when a new person is added as follows:

```js
const App = () =&gt; {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) =&gt; {
      const addedPerson = data.data.personAdded // HIGHLIGHT LINE
      notify(`${addedPerson.name} added`) // HIGHLIGHT LINE
    }
  })

  // ...
}
```

Now, for example, a person added via Apollo Studio Explorer is rendered immediately in the application view.

However, there is a small problem with the solution. When a new person is added through the application’s form, the added person ends up in the cache twice, because both the&nbsp;<code>useSubscription</code>&nbsp;hook and the&nbsp;<code>PersonForm</code>&nbsp;component add the new person to the cache. As a result, the added person is rendered on the screen twice.

One possible solution would be to update the cache only in the&nbsp;<em>useSubscription</em>&nbsp;hook. However, this is not recommended. As a good practice, the user should see the changes they make in the application immediately. The cache update performed by the subscription may happen with a delay and cannot be fully relied upon. Therefore, we will stick with a solution where the cache is updated both in the&nbsp;<code>useSubscription</code>&nbsp;hook and in the&nbsp;<code>PersonForm</code>&nbsp;component.

Let’s solve the problem by ensuring that a person is added to the cache only if they haven’t already been added there. At the same time, we’ll extract the cache update operation into its own helper function in the&nbsp;<em>utils/apolloCache.js</em>&nbsp;file:

```js
import { ALL_PERSONS } from '../queries'

export const addPersonToCache = (cache, personToAdd) =&gt; {
  cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) =&gt; {
    const personExists = allPersons.some(
      (person) =&gt; person.id === personToAdd.id,
    )

    if (personExists) {
      return { allPersons }
    }

    return {
      allPersons: allPersons.concat(personToAdd),
    }
  })
}
```

The helper function&nbsp;<code>addPersonToCache</code>&nbsp;updates the cache using the familiar&nbsp;<code>cache.updateQuery</code>&nbsp;method. In the cache update logic, we first check whether the person has already been added to the cache. We look for the person to be added among the people currently in the cache using JavaScript array’s&nbsp;<code>some</code>&nbsp;method:

```js
  const personExists = allPersons.some(
    (person) =&gt; person.id === personToAdd.id,
  )
```

<code>some</code>&nbsp;is a method that searches a collection for an element that matches the given condition. It returns a boolean indicating whether a matching element was found. In our case, the method returns&nbsp;<code>True</code>&nbsp;if the cache already contains a person with that&nbsp;<em>id</em>, and otherwise it returns&nbsp;<code>False</code>.

If the person is already in the cache, we return the cache contents as-is and do not add the person again. Otherwise, we return the cache contents with the new person appended using the&nbsp;<code>concat</code>&nbsp;method:

```js
  if (personExists) {
    return { allPersons }
  }

  return {
    allPersons: allPersons.concat(personToAdd),
  }
```

Let’s modify the&nbsp;<code>useSubscription</code>&nbsp;hook in the&nbsp;<code>App</code>&nbsp;component so that it updates the cache using the&nbsp;<code>addPersonToCache</code>&nbsp;helper function we created:

```js
import { addPersonToCache } from './utils/apolloCache' // HIGHLIGHT LINE

const App = () =&gt; {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) =&gt; {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson) // HIGHLIGHT LINE
    },
  })

  // ...
}
```

and we will also use the function when updating the cache in connection with adding a new person:

```sql
import { addPersonToCache } from '../utils/apolloCache' // HIGHLIGHT LINE

const PersonForm = ({ setError }) =&gt; {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) =&gt; setError(error.message),
    update: (cache, response) =&gt; {
      // BEGIN HIGHLIGHT
      const addedPerson = response.data.addPerson
      addPersonToCache(cache, addedPerson)
      // END HIGHLIGHT
    },
  })

  // ...
}
```

Now the cache update works correctly in all situations, meaning that a new person is added to the cache only if they haven’t already been added there.

The final code of the client can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6" target="_blank" rel="noreferrer noopener">GitHub</a>, branch&nbsp;<em>part8-6</em>.

## n+1 problem

Let's add some things to the backend. Let's modify the schema so that a&nbsp;<em>Person</em>&nbsp;type has a&nbsp;<code>friendOf</code>&nbsp;field, which tells whose friends list the person is on.

```
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]! // HIGHLIGHT LINE
  id: ID!
}
```

The application should support the following query:

```
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

Because&nbsp;<code>friendOf</code>&nbsp;is not a field of&nbsp;<em>Person</em>&nbsp;objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list:

```js
Person: {
  address: ({ street, city }) =&gt; {
    return {
      street,
      city,
    }
  },
  // BEGIN HIGHLIGHT
  friendOf: async (root) =&gt; {
    return []
  }
  // END HIGHLIGHT
},
```

The parameter <code>root</code> is the person object for which a friends list is being created, so we search from all <code>User</code> objects the ones which have <code>root._id</code> in their friends list:

```bash
  Person: {
    // ...
    friendOf: async (root) =&gt; {
      const friends = await User.find({
        friends: {
          $in: [root._id]
        }
      })

      return friends
    }
  },
```

Now the application works.

We can immediately do even more complicated queries. It is possible for example to find the friends of all users:

```
query {
  allPersons {
    name
    friendOf {
      username
    }
  }
}
```

However, the application now has one problem: an unreasonably large number of database queries are being made. Let’s add console logging to the parts of the resolvers that perform database queries:

```js
allPersons: async (root, args) =&gt; {
  console.log('Person.find') // HIGHLIGHT LINE
  if (!args.phone) {
    return Person.find({})
  }

  return Person.find({ phone: { $exists: args.phone === 'YES' } })
}
```

```bash
friendOf: async (root) =&gt; {
  console.log('User.find') // HIGHLIGHT LINE
  const friends = await User.find({
    friends: {
      $in: [root._id],
    },
  })

  return friends
}
```

We notice that if there are five people in the database, the previously mentioned&nbsp;<code>allPersons</code>&nbsp;query causes the following database queries:

```
Person.find
User.find
User.find
User.find
User.find
User.find
```

So even though we primarily do one query for all persons, every person causes one more query in their resolver.

This is a manifestation of the famous&nbsp;<a href="https://www.google.com/search?q=n%2B1+problem" target="_blank" rel="noreferrer noopener">n+1 problem</a>, which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.

The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries.

In our situation, the easiest solution would be to save whose friends list they are on each&nbsp;<code>Person</code>&nbsp;object:

```js
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
  // BEGIN HIGHLIGHT
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // END HIGHLIGHT
})
```

Then we could do a "join query", or populate the&nbsp;<code>friendOf</code>&nbsp;fields of persons when we fetch the&nbsp;<code>Person</code>&nbsp;objects:

```js
Query: {
  allPersons: (root, args) =&gt; {
    console.log('Person.find')
    if (!args.phone) {
      return Person.find({}).populate('friendOf') // HIGHLIGHT LINE
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
      .populate('friendOf') // HIGHLIGHT LINE
  },
  // ...
}
```

After the change, we would not need a separate resolver for the&nbsp;<code>friendOf</code>&nbsp;field.

The allPersons query&nbsp;<em>does not cause</em>&nbsp;an n+1 problem, if we only fetch the name and the phone number:

```
query {
  allPersons {
    name
    phone
  }
}
```

If we modify&nbsp;<code>allPersons</code>&nbsp;to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments" target="_blank" rel="noreferrer noopener">fourth parameter</a>&nbsp;of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it.

<a href="https://en.wikiquote.org/wiki/Donald_Knuth" target="_blank" rel="noreferrer noopener">In the words of Donald Knuth</a>:

> <em>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time:&nbsp;<strong>premature optimization is the root of all evil.</strong></em>

GraphQL Foundation's&nbsp;<a href="https://github.com/graphql/dataloader" target="_blank" rel="noreferrer noopener">DataLoader</a>&nbsp;library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server&nbsp;<a href="https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching" target="_blank" rel="noreferrer noopener">here</a>&nbsp;and&nbsp;<a href="http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/" target="_blank" rel="noreferrer noopener">here</a>.

## Epilogue

The application we built in this part is not structured in the most optimal way. We did a bit of cleanup by moving the schema and resolvers into their own files, but there is still plenty of room for improvement. Examples of better ways to structure GraphQL applications can be found online, for example for the server&nbsp;<a href="https://www.apollographql.com/blog/modularizing-your-graphql-schema-code" target="_blank" rel="noreferrer noopener">here</a>&nbsp;and for the client&nbsp;<a href="https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8" target="_blank" rel="noreferrer noopener">here</a>.

GraphQL is already quite an old technology: it has been in internal use at Facebook since 2012, so it can be said to be battle tested. Facebook released GraphQL in 2015, and it has since become established. Even the “death” of REST was predicted&nbsp;<a href="https://www.radiofreerabbit.com/podcast/52-is-2018-the-year-graphql-kills-rest" target="_blank" rel="noreferrer noopener">here</a>&nbsp;before the 2020s, but that has not happened. REST is still widely used and still works excellently in many cases, and GraphQL is unlikely to ever replace REST. However, GraphQL has become an alternative way to build APIs, and it is definitely worth getting familiar with.

<div class="tasks">

**25. OPTIONAL: Subscriptions - server**

</div>

<div class="tasks">

**26. OPTIONAL: Subscriptions - client, part 1**

</div>

<div class="tasks">

**27. OPTIONAL: Subscriptions - client, part 2**

</div>

<div class="tasks">

**28. OPTIONAL: n+1**

</div>

<div class="tasks">

**29. Your GitHub repository**

</div>
