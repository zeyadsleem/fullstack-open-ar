---
part: 8
letter: b
title: "Chapter 2: GraphQL server"
mainImage: /images/part-8.svg
lang: en
---
REST, familiar to us from the previous parts of the course, has long been the most prevalent way to implement the interfaces servers offer for browsers, and in general the integration between different applications on the web.

In recent years,&nbsp;<a href="http://graphql.org/" target="_blank" rel="noreferrer noopener">GraphQL</a>, developed by Facebook, has become popular for communication between web applications and servers.

The GraphQL philosophy is very different from REST. REST is&nbsp;<em>resource-based</em>. Every resource, for example a&nbsp;<em>user</em>, has its own address which identifies it, for example&nbsp;<em>/users/10</em>. All operations done to the resource are done with HTTP requests to its URL. The action depends on the HTTP method used.

The resource-basedness of REST works well in most situations. However, it can be a bit awkward sometimes.

Let's consider the following example: our bloglist application contains some kind of social media functionality, and we would like to show a list of all the blogs that were added by users who have commented on any of the blogs of the users we follow.

If the server implemented a REST API, we would probably have to do multiple HTTP requests from the browser before we had all the data we wanted. The requests would also return a lot of unnecessary data, and the code on the browser would probably be quite complicated.

If this was an often-used functionality, there could be a REST endpoint for it. If there were a lot of these kinds of scenarios however, it would become very laborious to implement REST endpoints for all of them.

A GraphQL server is well-suited for these kinds of situations.

The main principle of GraphQL is that the code on the browser forms a&nbsp;<em>query</em>&nbsp;describing the data wanted, and sends it to the API with an HTTP POST request. Unlike REST, all GraphQL queries are sent to the same address, and their type is POST.

The data described in the above scenario could be fetched with (roughly) the following query:

```
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```

The content of the&nbsp;<code>FetchBlogsQuery</code>&nbsp;can be roughly interpreted as: find a user named&nbsp;<code>"mluukkai"</code>&nbsp;and for each of his&nbsp;<code>followedUsers</code>, find all their&nbsp;<code>blogs</code>, and for each blog, all its&nbsp;<code>comments</code>, and for each&nbsp;<code>user</code>&nbsp;who wrote each comment, find their&nbsp;<code>blogs</code>, and return the&nbsp;<code>title</code>&nbsp;of each of them.

The server's response would be about the following JSON object:

```json
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

The application logic stays simple, and the code on the browser gets exactly the data it needs with a single query.

## Schemas and queries

We will get to know the basics of GraphQL by implementing a GraphQL version of the phonebook application from parts 2 and 3.

In the heart of all GraphQL applications is a&nbsp;<a href="https://graphql.org/learn/schema/" target="_blank" rel="noreferrer noopener">schema</a>, which describes the data sent between the client and the server. The initial schema for our phonebook is as follows:

```
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

The schema describes two&nbsp;<a href="https://graphql.org/learn/schema/#type-system" target="_blank" rel="noreferrer noopener">types</a>. The first type,&nbsp;<em>Person</em>, determines that persons have five fields. Four of the fields are type&nbsp;<em>String</em>, which is one of the&nbsp;<a href="https://graphql.org/learn/schema/#scalar-types" target="_blank" rel="noreferrer noopener">scalar types</a>&nbsp;of GraphQL. All of the String fields, except&nbsp;<em>phone</em>, must be given a value. This is marked by the exclamation mark on the schema. The type of the field&nbsp;<em>id</em>&nbsp;is&nbsp;<em>ID</em>.&nbsp;<em>ID</em>&nbsp;fields are strings, but GraphQL ensures they are unique.

The second type is a&nbsp;<a href="https://graphql.org/learn/queries/" target="_blank" rel="noreferrer noopener">Query</a>. Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API.

The phonebook describes three different queries.&nbsp;<code>personCount</code>&nbsp;returns an integer,&nbsp;<code>allPersons</code>&nbsp;returns a list of&nbsp;<em>Person</em>&nbsp;objects and&nbsp;<em>findPerson</em>&nbsp;is given a string parameter and it returns a&nbsp;<em>Person</em>&nbsp;object.

Again, exclamation marks are used to mark which return values and parameters are&nbsp;<em>Non-Null</em>.&nbsp;<code>personCount</code>&nbsp;will, for sure, return an integer. The query&nbsp;<code>findPerson</code>&nbsp;must be given a string as a parameter. The query returns a&nbsp;<em>Person</em>-object or&nbsp;<em>null</em>.&nbsp;<code>allPersons</code>&nbsp;returns a list of&nbsp;<em>Person</em>&nbsp;objects, and the list does not contain any&nbsp;<em>null</em>&nbsp;values.

So the schema describes what queries the client can send to the server, what kind of parameters the queries can have, and what kind of data the queries return.

The simplest of the queries,&nbsp;<code>personCount</code>, looks as follows:

```
query {
  personCount
}
```

Assuming our application has saved the information of three people, the response would look like this:

```json
{
  "data": {
    "personCount": 3
  }
}
```

The query fetching the information of all of the people,&nbsp;<code>allPersons</code>, is a bit more complicated. Because the query returns a list of&nbsp;<em>Person</em>&nbsp;objects, the query must describe&nbsp;<em>which&nbsp;<a href="https://graphql.org/learn/queries/#fields" target="_blank" rel="noreferrer noopener">fields</a></em>&nbsp;of the objects the query returns:

```
query {
  allPersons {
    name
    phone
  }
}
```

The response could look like this:

```json
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

A query can be made to return any field described in the schema. For example, the following would also be possible:

```
query {
  allPersons{
    name
    city
    street
  }
}
```

The last example shows a query which requires a parameter, and returns the details of one person.

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
    id
  }
}
```

So, first, the parameter is described in round brackets, and then the fields of the return value object are listed in curly brackets.

The response is like this:

```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

The return value was marked as nullable, so if we search for the details of an unknown

```
query {
  findPerson(name: "Joe Biden") {
    phone
  }
}
```

the return value is&nbsp;<em>null</em>.

```json
{
  "data": {
    "findPerson": null
  }
}
```

As you can see, there is a direct link between a GraphQL query and the returned JSON object. One can think that the query describes what kind of data it wants as a response. The difference to REST queries is stark. With REST, the URL and the type of the request have nothing to do with the form of the returned data.

GraphQL query describes only the data moving between a server and the client. On the server, the data can be organized and saved any way we like.

Despite its name, GraphQL does not actually have anything to do with databases. It does not care how the data is saved. The data a GraphQL API uses can be saved into a relational database, document database, or to other servers which a GraphQL server can access with for example REST.

## Apollo Server

Let's implement a GraphQL server with today's leading library:&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/" target="_blank" rel="noreferrer noopener">Apollo Server</a>.

Create a new npm project with&nbsp;<code>npm init</code>&nbsp;and install the required dependencies.

```bash
npm install @apollo/server graphql
```

Also create a&nbsp;<code>index.js</code>&nbsp;file in your project's root directory.

The initial code is as follows:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) =&gt; {
  console.log(`Server ready at ${url}`)
})
```

The heart of the code is an&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/apollo-server/" target="_blank" rel="noreferrer noopener">ApolloServer</a>, which is given two parameters:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

The first parameter,&nbsp;<code>typeDefs</code>, contains the GraphQL schema.

The second parameter is an object, which contains the&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/resolvers/" target="_blank" rel="noreferrer noopener">resolvers</a>&nbsp;of the server. These are the code, which defines&nbsp;<em>how</em>&nbsp;GraphQL queries are responded to.

The code of the resolvers is the following:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  }
}
```

As you can see, the resolvers correspond to the queries described in the schema.

```
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

So there is a field under&nbsp;<em>Query</em>&nbsp;for every query described in the schema.

The query

```
query {
  personCount
}
```

Has the resolver

```
() =&gt; persons.length
```

So the response to the query is the length of the array&nbsp;<code>persons</code>.

The query which fetches all persons

```
query {
  allPersons {
    name
  }
}
```

has a resolver which returns&nbsp;<em>all</em>&nbsp;objects from the&nbsp;<code>persons</code>&nbsp;array.

```
() =&gt; persons
```

## Apollo Studio Explorer

Let's add the following scripts to&nbsp;<em>package.json</em>&nbsp;to run the application:

```json
{
  //...
  "scripts": {
    "start": "node index.js", // HIGHLIGHT LINE
    "dev": "node --watch index.js", // HIGHLIGHT LINE
    // ...
  }
}
```

When Apollo server is run in development mode the page&nbsp;<a href="http://localhost:4000/" target="_blank" rel="noreferrer noopener">http://localhost:4000</a>&nbsp;takes us to&nbsp;<a href="https://www.apollographql.com/docs/graphos/platform/explorer" target="_blank" rel="noreferrer noopener">GraphOS Studio Explorer</a>. This is very useful for a developer, and can be used to make queries to the server.

Let's try it out:

![apollo studio Example Query with response allPersons](/images/mooc/b2e49557f381.webp)

At the left side Explorer shows the API-documentation that it has automatically generated based on the schema.

## Schema syntax highlighting in VS Code

The schema in our code is defined using template literal syntax:

```js
const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`
```

The schema contains structural information, but in the code editor the whole content appears in the same color and automatic formatting tools like Prettier cannot format its contents. We can enable GraphQL schema syntax highlighting and, for example, autocompletion in VS Code by installing the&nbsp;<a href="https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql" target="_blank" rel="noreferrer noopener">GraphQL: Language Feature Support</a>&nbsp;extension.

We need to somehow indicate to the extension that <code>typeDefs</code> contains GraphQL. There are several ways to do this. We'll do it now by adding the type-indicating comment <code>/* GraphQL */</code> before the template literal string:

![VS Code uses syntax highlighting for the GraphQL schema when the comment /* GraphQL */ is added before the template literal string](/images/mooc/9c034d4fcf41.webp)

Now the syntax highlighting works. The comment helps the installed extension recognize the string as GraphQL and provide intelligent editor features, but it does not affect the application's runtime. Prettier can now also format the schema.

### Parameters of a resolver

The query fetching a single person

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
  }
}
```

has a resolver which differs from the previous ones because it is given&nbsp;<em>two parameters</em>:

```
(root, args) =&gt; persons.find(p =&gt; p.name === args.name)
```

The second parameter,&nbsp;<code>args</code>, contains the parameters of the query. The resolver then returns from the array&nbsp;<code>persons</code>&nbsp;the person whose name is the same as the value of&nbsp;<em>args.name</em>. The resolver does not need the first parameter&nbsp;<code>root</code>.

In fact, all resolver functions are given&nbsp;<a href="https://www.graphql-tools.com/docs/resolvers#resolver-function-signature" target="_blank" rel="noreferrer noopener">four parameters</a>. With JavaScript, the parameters don't have to be defined if they are not needed. We will be using the first and the third parameter of a resolver later in this part.

## The default resolver

When we do a query, for example

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
  }
}
```

the server knows to send back exactly the fields required by the query. How does that happen?

A GraphQL server must define resolvers for&nbsp;<em>each</em>&nbsp;field of each type in the schema. We have so far only defined resolvers for fields of the type&nbsp;<em>Query</em>, so for each query of the application.

Because we did not define resolvers for the fields of the type&nbsp;<em>Person</em>, Apollo has defined&nbsp;<a href="https://www.graphql-tools.com/docs/resolvers/#default-resolver" target="_blank" rel="noreferrer noopener">default resolvers</a>&nbsp;for them. They work like the one shown below:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt; persons.find(p =&gt; p.name === args.name)
  },
  // BEGIN HIGHLIGHT
  Person: {
    name: (root) =&gt; root.name,
    phone: (root) =&gt; root.phone,
    street: (root) =&gt; root.street,
    city: (root) =&gt; root.city,
    id: (root) =&gt; root.id
  }
  // END HIGHLIGHT
}
```

The default resolver returns the value of the corresponding field of the object. The object itself can be accessed through the first parameter of the resolver,&nbsp;<code>root</code>.

If the functionality of the default resolver is enough, you don't need to define your own. It is also possible to define resolvers for only some fields of a type, and let the default resolvers handle the rest.

We could for example define that the address of all persons is&nbsp;<em>Manhattan New York</em>&nbsp;by hard-coding the following to the resolvers of the street and city fields of the type&nbsp;<em>Person</em>:

```
Person: {
  street: (root) =&gt; "Manhattan",
  city: (root) =&gt; "New York"
}
```

## Object within an object

Let's modify the schema a bit

```
  // BEGIN HIGHLIGHT
type Address {
  street: String!
  city: String!
}
  // END HIGHLIGHT

type Person {
  name: String!
  phone: String
  address: Address!   // HIGHLIGHT LINE
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

so a person now has a field with the type&nbsp;<em>Address</em>, which contains the street and the city.

Because the objects saved in the array do not have an&nbsp;<em>address</em>&nbsp;field, the default resolver is not sufficient. Let's add a resolver for the&nbsp;<em>address</em>&nbsp;field of&nbsp;<em>Person</em>&nbsp;type:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  },
  // BEGIN HIGHLIGHT
  Person: {
    address: (root) =&gt; {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
  // END HIGHLIGHT
}
```

So every time a&nbsp;<em>Person</em>&nbsp;object is returned, the fields&nbsp;<em>name</em>,&nbsp;<em>phone</em>&nbsp;and&nbsp;<em>id</em>&nbsp;are returned using their default resolvers, but the field&nbsp;<em>address</em>&nbsp;is formed by using a self-defined resolver. The parameter&nbsp;<code>root</code>&nbsp;of the resolver function is the person-object, so the street and the city of the address can be taken from its fields.

The queries requiring the address change into

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    address {
      city
      street
    }
  }
}
```

and the response is now a person object, which&nbsp;<em>contains</em>&nbsp;an address object.

```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address":  {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```

We still save the persons in the server the same way we did before.

```js
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ...
]
```

The person-objects saved in the server are not exactly the same as the GraphQL type&nbsp;<em>Person</em>&nbsp;objects described in the schema.

Contrary to the&nbsp;<em>Person</em>&nbsp;type, the&nbsp;<em>Address</em>&nbsp;type does not have an&nbsp;<em>id</em>&nbsp;field, because they are not saved into their own separate data structure in the server.

Let's modify the resolver for the&nbsp;<code>address</code>&nbsp;field so that it destructures the needed fields from the parameter it receives:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt; persons.find((p) =&gt; p.name === args.name),
  },
  Person: {
    address: ({ street, city }) =&gt; { // HIGHLIGHT LINE
      return {
        street, // HIGHLIGHT LINE
        city, // HIGHLIGHT LINE
      }
    },
  },
}
```

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-1" target="_blank" rel="noreferrer noopener">Github</a>, branch&nbsp;<em>part8-1</em>.

## Mutations

Let's add a functionality for adding new persons to the phonebook. In GraphQL, all operations which cause a change are done with&nbsp;<a href="https://graphql.org/learn/mutations" target="_blank" rel="noreferrer noopener">mutations</a>. Mutations are described in the schema as the keys of type&nbsp;<em>Mutation</em>.

The schema for a mutation for adding a new person looks as follows:

```
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```

The Mutation is given the details of the person as parameters. The parameter&nbsp;<em>phone</em>&nbsp;is the only one which is nullable. The Mutation also has a return value. The return value is type&nbsp;<em>Person</em>, the idea being that the details of the added person are returned if the operation is successful and if not, null. Value for the field&nbsp;<em>id</em>&nbsp;is not given as a parameter. Generating an id is better left for the server.

Mutations also require a resolver:

```js
const { v1: uuid } = require('uuid') // HIGHLIGHT LINE

// ...

const resolvers = {
  Query: {
    // ...
  },
  Person: {
    // ...
  },
  // BEGIN HIGHLIGHT
  Mutation: {
    addPerson: (root, args) =&gt; {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
  // END HIGHLIGHT
}

// ...
```

The mutation adds the object given to it as a parameter&nbsp;<code>args</code>&nbsp;to the array&nbsp;<code>persons</code>, and returns the object it added to the array.

The&nbsp;<em>id</em>&nbsp;field is given a unique value using the&nbsp;<a href="https://github.com/kelektiv/node-uuid#readme" target="_blank" rel="noreferrer noopener">uuid</a>&nbsp;library.

A new person can be added with the following mutation

```
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address {
      city
      street
    }
    id
  }
}
```

Note that the person is saved to the&nbsp;<code>persons</code>&nbsp;array as

```
{
  name: "Pekka Mikkola",
  phone: "045-2374321",
  street: "Vilppulantie 25",
  city: "Helsinki",
  id: "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
}
```

But the response to the mutation is

```json
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```

So the resolver of the&nbsp;<em>address</em>&nbsp;field of the&nbsp;<em>Person</em>&nbsp;type formats the response object to the right form.

## Error handling

If we try to create a new person, but the parameters do not correspond with the schema description, the server gives an error message:

![apollo showing error with addPerson GRAPHQL VALIDATION FAILED](/images/mooc/c723d58c5859.webp)

So some of the error handling can be automatically done with GraphQL&nbsp;<a href="https://graphql.org/learn/validation/" target="_blank" rel="noreferrer noopener">validation</a>.

However, GraphQL cannot handle everything automatically. For example, stricter rules for data sent to a Mutation have to be added manually. An error could be handled by throwing&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a>&nbsp;with a proper&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#built-in-error-codes" target="_blank" rel="noreferrer noopener">error code</a>.

Let's prevent adding the same name to the phonebook multiple times:

```js
const { GraphQLError } = require('graphql') // HIGHLIGHT LINE

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) =&gt; {
      // BEGIN HIGHLIGHT
      if (persons.find(p =&gt; p.name === args.name)) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      // END HIGHLIGHT

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

So if the name to be added already exists in the phonebook, throw&nbsp;<code>GraphQLError</code>&nbsp;error.

![apollo showing error BAD_USER_INPUT](/images/mooc/ec6b0ba55a28.webp)

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-2" target="_blank" rel="noreferrer noopener">GitHub</a>, branch&nbsp;<em>part8-2</em>.

## Enum

Let's add a possibility to filter the query returning all persons with the parameter&nbsp;<em>phone</em>&nbsp;so that it returns only persons with a phone number

```
query {
  allPersons(phone: YES) {
    name
    phone
  }
}
```

or persons without a phone number

```
query {
  allPersons(phone: NO) {
    name
  }
}
```

The schema changes like so:

```
// BEGIN HIGHLIGHT
enum YesNo {
  YES
  NO
}
// END HIGHLIGHT

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]! // HIGHLIGHT LINE
  findPerson(name: String!): Person
}
```

The type&nbsp;<em>YesNo</em>&nbsp;is a GraphQL&nbsp;<a href="https://graphql.org/learn/schema/#enumeration-types" target="_blank" rel="noreferrer noopener">enum</a>, or an enumerable, with two possible values:&nbsp;<em>YES</em>&nbsp;or&nbsp;<em>NO</em>. In the query&nbsp;<code>allPersons</code>, the parameter&nbsp;<code>phone</code>&nbsp;has the type&nbsp;<em>YesNo</em>, but is nullable.

The resolver changes like so:

```js
Query: {
  personCount: () =&gt; persons.length,
  // BEGIN HIGHLIGHT
  allPersons: (root, args) =&gt; {
    if (!args.phone) {
      return persons
    }

    const byPhone = (person) =&gt;
      args.phone === 'YES' ? person.phone : !person.phone

    return persons.filter(byPhone)
  },
  // END HIGHLIGHT
  findPerson: (root, args) =&gt;
    persons.find(p =&gt; p.name === args.name)
},
```

## Changing a phone number

Let's add a mutation for changing the phone number of a person. The schema of this mutation looks as follows:

```
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  // BEGIN HIGHLIGHT
  editNumber(
    name: String!
    phone: String!
  ): Person
  // END HIGHLIGHT
}
```

and is done by a resolver:

```js
Mutation: {
  // ...
  editNumber: (root, args) =&gt; {
    const person = persons.find(p =&gt; p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p =&gt; p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }
}
```

The mutation finds the person to be updated by the field&nbsp;<em>name</em>.

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">Github</a>, branch&nbsp;<em>part8-3</em>.

## More on queries

With GraphQL, it is possible to combine multiple fields of type&nbsp;<em>Query</em>, or "separate queries" into one query. For example, the following query returns both the amount of persons in the phonebook and their names:

```
query {
  personCount
  allPersons {
    name
  }
}
```

The response looks as follows:

```json
{
  "data": {
    "personCount": 3,
    "allPersons": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      },
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

Combined query can also use the same query multiple times. You must however give the queries alternative names like so:

```
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

The response looks like:

```json
{
  "data": {
    "havePhone": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      }
    ],
    "phoneless": [
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

In some cases, it might be beneficial to name the queries. This is the case especially when the queries or mutations have&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">parameters</a>. We will get into parameters soon.

<div class="tasks">

**1. The number of books and authors**

</div>

<div class="tasks">

**2. All books**

</div>

<div class="tasks">

**3. All authors**

</div>

<div class="tasks">

**4. Books of an author**

</div>

<div class="tasks">

**5. Books by genre**

</div>

<div class="tasks">

**6. Adding a book**

</div>

<div class="tasks">

**7. Updating the birth year of an author**

</div>
