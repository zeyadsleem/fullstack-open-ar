---
part: 8
letter: c
title: "Chapter 3: React and GraphQL"
mainImage: /images/part-8.svg
lang: en
---
We will next implement a React app that uses the GraphQL server we created.

The current code of the server can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>, branch&nbsp;<em>part8-3</em>.

In theory, we could use GraphQL with HTTP POST requests. The following shows an example of this with Postman:

![postman showing localhost:4000 graphql with allPersons query](/images/mooc/8cb04b83e47f.webp)

The communication works by sending HTTP POST requests to&nbsp;<a href="http://localhost:4000/graphql" target="_blank" rel="noreferrer noopener">http://localhost:4000/graphql</a>. The query itself is a string sent as the value of the key&nbsp;<em>query</em>.

We could take care of the communication between the React app and GraphQL by using Axios. However, most of the time, it is not very sensible to do so. It is a better idea to use a higher-order library capable of abstracting the unnecessary details of the communication.

At the moment, there are two good options:&nbsp;<a href="https://facebook.github.io/relay/" target="_blank" rel="noreferrer noopener">Relay</a>&nbsp;by Facebook and&nbsp;<a href="https://www.apollographql.com/docs/react/" target="_blank" rel="noreferrer noopener">Apollo Client</a>, which is the client side of the same library we used in the previous section. Apollo is absolutely the most popular of the two, and we will use it in this section as well.

## Apollo client

Let's create a new React app and install the necessary dependencies for&nbsp;<a href="https://www.apollographql.com/docs/react/get-started/" target="_blank" rel="noreferrer noopener">Apollo client</a>.

```bash
npm install @apollo/client graphql
```

Replace the default contents of the file&nbsp;<em>main.jsx</em>&nbsp;with the following program skeleton:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

client.query({ query }).then((response) =&gt; {
  console.log(response.data)
})

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;,
)
```

The beginning of the code creates a new&nbsp;<a href="https://www.apollographql.com/docs/react/get-started#step-3-initialize-apolloclient" target="_blank" rel="noreferrer noopener">client</a>&nbsp;object, which is then used to send a query to the server:

```
client.query({ query }).then((response) =&gt; {
  console.log(response.data)
})
```

The server's response is printed to the console:

![devtools shows allPersons array with 3 people](/images/mooc/e1d6c9ca3a7c.webp)

A&nbsp;<code>gql</code>&nbsp;tag is added before the template literal that forms the query, imported from the @apollo/client package:

```js
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client' // HIGHLIGHT LINE

// ...

const query = gql` // HIGHLIGHT LINE
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

Thanks to the tag, VS Code’s GraphQL extension and other tooling recognize the definition as GraphQL, enabling features like syntax highlighting in the editor. On the server side, we achieved the same by adding a type-indicating comment before the template literal, because the @apollo/server library used on the server does not include a corresponding&nbsp;<code>gql</code>&nbsp;tag.

The application can communicate with a GraphQL server using the&nbsp;<code>client</code>&nbsp;object. The client can be made accessible for all components of the application by wrapping the&nbsp;<em>App</em>&nbsp;component with&nbsp;<a href="https://www.apollographql.com/docs/react/get-started#step-4-connect-your-client-to-react" target="_blank" rel="noreferrer noopener">ApolloProvider</a>.

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react' // HIGHLIGHT LINE

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

// ...

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;ApolloProvider client={client}&gt; // HIGHLIGHT LINE
      &lt;App /&gt;
    &lt;/ApolloProvider&gt; // HIGHLIGHT LINE
  &lt;/StrictMode&gt;,
)
```

## Making queries

We are ready to implement the main view of the application, which shows a list of person's name and phone number.

Apollo Client offers a few alternatives for making&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/" target="_blank" rel="noreferrer noopener">queries</a>. Currently, the use of the hook function&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#usequery" target="_blank" rel="noreferrer noopener">useQuery</a>&nbsp;is the dominant practice.

The query is made by the&nbsp;<em>App</em>&nbsp;component, the code of which is as follows:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

const App = () =&gt; {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      {result.data.allPersons.map(p =&gt; p.name).join(', ')}
    &lt;/div&gt;
  )
}

export default App
```

When called,&nbsp;<code>useQuery</code>&nbsp;makes the query it receives as a parameter. It returns an object with multiple&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#result" target="_blank" rel="noreferrer noopener">fields</a>. The field&nbsp;<em>loading</em>&nbsp;is true if the query has not received a response yet. Then the following code gets rendered:

```js
if (result.loading) {
  return &lt;div&gt;loading...&lt;/div&gt;
}
```

When a response is received, the result of the&nbsp;<em>allPersons</em>&nbsp;query can be found in the data field, and we can render the list of names to the screen.

```
&lt;div&gt;
  {result.data.allPersons.map(p =&gt; p.name).join(', ')}
&lt;/div&gt;
```

Separate the display of persons into its own component in the file&nbsp;<em>src/components/Persons.jsx</em>:

```js
const Persons = ({ persons }) =&gt; {
  return (
    &lt;div&gt;
      &lt;h2&gt;Persons&lt;/h2&gt;
      {persons.map(p =&gt;
        &lt;div key={p.id}&gt;
          {p.name} {p.phone}
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  )
}

export default Persons
```

The&nbsp;<code>App</code>&nbsp;component still makes the query, and passes the result to the new component to be rendered:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Persons from './components/Persons' // HIGHLIGHT LINE

// ...

const App = () =&gt; {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  return &lt;Persons persons={result.data.allPersons} /&gt; // HIGHLIGHT LINE
}
```

## Named queries and variables

Let's implement functionality for viewing the address details of a person. The&nbsp;<em>findPerson</em>&nbsp;query is well-suited for this.

The queries we did in the last chapter had the parameter hardcoded into the query:

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

When we do queries programmatically, we must be able to give them parameters dynamically.

GraphQL&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">variables</a>&nbsp;are well-suited for this. To be able to use variables, we must also name our queries.

A good format for the query is this:

```
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone
    address {
      street
      city
    }
  }
}
```

The name of the query is&nbsp;<em>findPersonByName</em>, and it is given a string&nbsp;<em>$nameToSearch</em>&nbsp;as a parameter.

It is also possible to do queries with parameters with the Apollo Explorer. The parameters are given in&nbsp;<em>Variables</em>:

![apollostudio findPersonByName highlighting nameToSearch Arto Hellas](/images/mooc/cb57470830d9.webp)

The&nbsp;<code>useQuery</code>&nbsp;hook is well-suited for situations where the query is done when the component is rendered. However, we now want to make the query only when a user wants to see the details of a specific person, so the query is done only&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually" target="_blank" rel="noreferrer noopener">as required</a>.

One possibility for this kind of situations is the hook function&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/useLazyQuery" target="_blank" rel="noreferrer noopener">useLazyQuery</a>&nbsp;that would make it possible to define a query which is executed&nbsp;<em>when</em>&nbsp;the user wants to see the detailed information of a person.

However, in our case we can stick to&nbsp;<code>useQuery</code>&nbsp;and use the option&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries#skipoptional" target="_blank" rel="noreferrer noopener">skip</a>, which makes it possible to do the query only if a set condition is true.

After the changes, the file&nbsp;<em>Persons.jsx</em>&nbsp;looks as follows:

```js
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Person = ({ person, onClose }) =&gt; {
  return (
    &lt;div&gt;
      &lt;h2&gt;{person.name}&lt;/h2&gt;
      &lt;div&gt;
        {person.address.street} {person.address.city}
      &lt;/div&gt;
      &lt;div&gt;{person.phone}&lt;/div&gt;
      &lt;button onClick={onClose}&gt;close&lt;/button&gt;
    &lt;/div&gt;
  )
}

const Persons = ({ persons }) =&gt; {
  // BEGIN HIGHLIGHT
  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })
  // END HIGHLIGHT

  // BEGIN HIGHLIGHT
  if (nameToSearch &amp;&amp; result.data) {
    return (
      &lt;Person
        person={result.data.findPerson}
        onClose={() =&gt; setNameToSearch(null)}
      /&gt;
    )
  }
  // END HIGHLIGHT

  return (
    &lt;div&gt;
      &lt;h2&gt;Persons&lt;/h2&gt;
      {persons.map((p) =&gt; (
        &lt;div key={p.id}&gt;
          {p.name} {p.phone}
          &lt;button onClick={() =&gt; setNameToSearch(p.name)}&gt; // HIGHLIGHT LINE
            show address // HIGHLIGHT LINE
          &lt;/button&gt; // HIGHLIGHT LINE
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  )
}

export default Persons
```

The code has changed quite a lot, and all of the changes are not completely apparent.

When the button&nbsp;<em>show address</em>&nbsp;of a person is pressed, the name of the person is set to state&nbsp;<em>nameToSearch</em>:

```
&lt;button onClick={() =&gt; setNameToSearch(p.name)}&gt;
  show address
&lt;/button&gt;
```

This causes the component to re-render itself. On render the query&nbsp;<em>FIND_PERSON</em>&nbsp;that fetches the detailed information of a user is executed if the variable&nbsp;<em>nameToSearch</em>&nbsp;has a value:

```js
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch, // HIGHLIGHT LINE
})
```

When the user is not interested in seeing the detailed info of any person, the state variable&nbsp;<em>nameToSearch</em>&nbsp;is null and the query is not executed.

If the state&nbsp;<em>nameToSearch</em>&nbsp;has a value and the query result is ready, the component&nbsp;<em>Person</em>&nbsp;renders the detailed info of a person:

```js
if (nameToSearch &amp;&amp; result.data) {
  return (
    &lt;Person
      person={result.data.findPerson}
      onClose={() =&gt; setNameToSearch(null)}
    /&gt;
  )
}
```

A single-person view looks like this:

![browser showing single-person](/images/mooc/e0c37be995e1.webp)

When a user wants to return to the person list, the&nbsp;<code>nameToSearch</code>&nbsp;state is set to&nbsp;<code>null</code>.

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;branch&nbsp;<em>part8-1</em>.

### Cache

When we do multiple queries, for example with the address details of Arto Hellas, we notice something interesting: the query to the backend is done only the first time around. After this, despite the same query being done again by the code, the query is not sent to the backend.

![browser showing dev tools response with network tab and graphql](/images/mooc/0fc3b52f0877.webp)

Apollo client saves the responses of queries to <a href="https://www.apollographql.com/docs/react/caching/overview/" target="_blank" rel="noreferrer noopener">cache</a>. To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.

![apollo dev tools showing root_query allPersons](/images/mooc/bf7ef641cb8f.webp)

Cache shows the detailed info of Arto Hellas after the query <em>findPerson</em>:

![apollo dev tools showing first person with information](/images/mooc/dec90af18c4d.webp)

## Doing mutations

Let's implement functionality for adding new persons.

In the previous chapter, we hardcoded the parameters for mutations. Now, we need a version of the addPerson mutation which uses&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">variables</a>:

```bash
const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`
```

The hook function&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#usemutation" target="_blank" rel="noreferrer noopener">useMutation</a>&nbsp;provides the functionality for making mutations.

Create a new component&nbsp;<em>PersonForm</em>&nbsp;for adding a new person to the application. The contents of the file&nbsp;<em>src/components/PersonForm.jsx</em>&nbsp;are as follows:

```bash
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const PersonForm = () =&gt; {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON) // HIGHLIGHT LINE

  const submit = (event) =&gt; {
    event.preventDefault()

    // BEGIN HIGHLIGHT
    createPerson({ variables: { name, phone, street, city } })
    // END HIGHLIGHT

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    &lt;div&gt;
      &lt;h2&gt;create new&lt;/h2&gt;
      &lt;form onSubmit={submit}&gt;
        &lt;div&gt;
          name &lt;input value={name}
            onChange={({ target }) =&gt; setName(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          phone &lt;input value={phone}
            onChange={({ target }) =&gt; setPhone(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          street &lt;input value={street}
            onChange={({ target }) =&gt; setStreet(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          city &lt;input value={city}
            onChange={({ target }) =&gt; setCity(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;button type='submit'&gt;add!&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  )
}

export default PersonForm
```

The code of the form is straightforward and the interesting lines have been highlighted. We can define mutation functions using the&nbsp;<code>useMutation</code>&nbsp;hook. The hook returns an&nbsp;<em>array</em>, the first element of which contains the function to cause the mutation.

```js
const [createPerson] = useMutation(CREATE_PERSON)
```

The query variables receive values when the query is made:

```
createPerson({ variables: { name, phone, street, city } })
```

Enable the&nbsp;<em>PersonForm</em>&nbsp;component in the file&nbsp;<em>App.jsx</em>:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import PersonForm from './components/PersonForm' // HIGHLIGHT LINE
import Persons from './components/Persons'

// ...

const App = () =&gt; {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  // BEGIN HIGHLIGHT
  return (
    &lt;div&gt;
      &lt;Persons persons={result.data.allPersons} /&gt;
      &lt;PersonForm /&gt;
    &lt;/div&gt;
  )
  // END HIGHLIGHT
}

export default App
```

New persons are added just fine, but the screen is not updated. This is because Apollo Client cannot automatically update the cache of an application, so it still contains the state from before the mutation. We could update the screen by reloading the page, as the cache is emptied when the page is reloaded. However, there must be a better way to do this.

## Updating the cache

There are a few different solutions for this. One way is to make the query for all persons&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/#polling" target="_blank" rel="noreferrer noopener">poll</a>&nbsp;the server, or make the query repeatedly.

The change is small. Let's set the query to poll every two seconds:

```js
const App = () =&gt; {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 // HIGHLIGHT LINE
  })

  if (result.loading)  {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      &lt;Persons persons = {result.data.allPersons}/&gt;
      &lt;PersonForm /&gt;
    &lt;/div&gt;
  )
}

export default App
```

The solution is simple, and every time a user adds a new person, it appears immediately on the screens of all users.

The downside of polling is, of course, the unnecessary network traffic it causes. In addition, the page may start to flicker, since the component is re-rendered with each query update and&nbsp;<code>result.loading</code>&nbsp;is true for a brief moment—so a&nbsp;<em>loading...</em>&nbsp;text flashes on the screen for an instant.

Another easy way to keep the cache in sync is to use the&nbsp;<code>useMutation</code>&nbsp;hook's&nbsp;<a href="https://www.apollographql.com/docs/react/data/refetching/" target="_blank" rel="noreferrer noopener">refetchQueries</a>&nbsp;parameter to define that the query fetching all persons is done again whenever a new person is created.

```js
// ...

// BEGIN HIGHLIGHT
const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`
// END HIGHLIGHT

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  // BEGIN HIGHLIGHT
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
  })
  // END HIGHLIGHT

  // ...
}
```

The pros and cons of this solution are almost opposite of the previous one. There is no extra web traffic because queries are not done just in case. However, if one user now updates the state of the server, the changes do not show to other users immediately.

If you want to do multiple queries, you can pass multiple objects inside refetchQueries. This will allow you to update different parts of your app at the same time. Here is an example:

```js
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [
    { query: ALL_PERSONS },
    { query: OTHER_QUERY },
    { query: ANOTHER_QUERY },
  ], // pass as many queries as you need
})
```

There are other ways to update the cache. More about those later in this part.

At the moment, queries and components are defined in the same place in our code. Let's separate the query definitions into their own file&nbsp;<em>src/queries.js</em>:

```bash
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`
```

Each component then imports the queries it needs:

```js
import { ALL_PERSONS } from './queries'

const App = () =&gt; {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;branch&nbsp;<em>part8-2</em>.

## Handling mutation errors

If we try to create an invalid person, for example by using a name that already exists in the application, nothing happens. The person is not added to the application, but we also do not receive any error message.

Earlier, we defined a check on the server that prevents adding another person with the same name and throws an error in such a situation. However, the error is not yet handled in the frontend. Using the&nbsp;<code>onError</code>&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#params-2" target="_blank" rel="noreferrer noopener">option</a>&nbsp;of the&nbsp;<code>useMutation</code>&nbsp;hook, it is possible to register an error handler function for mutations.

Let’s register an error handler for the mutation. The&nbsp;<em>PersonForm</em>&nbsp;component receives a&nbsp;<code>setError</code>&nbsp;function as a prop, which is used to set a message indicating the error:

```js
const PersonForm = ({ setError }) =&gt; { // HIGHLIGHT LINE
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    onError: (error) =&gt; setError(error.message), // HIGHLIGHT LINE
  })

  // ...
}
```

Create a separate component for the notification in the file&nbsp;<em>src/components/Notify.jsx</em>:

```js
const Notify = ({ errorMessage }) =&gt; {
  if (!errorMessage) {
    return null
  }
  return (
    &lt;div style={{ color: 'red' }}&gt;
      {errorMessage}
    &lt;/div&gt;
  )
}

export default Notify
```

The component receives a possible error message as a prop. If an error message is set, it is rendered on the screen.

Render the&nbsp;<em>Notify</em>&nbsp;component that displays the error message in the file&nbsp;<em>App.jsx</em>:

```js
import Notify from './components/Notify' // HIGHLIGHT LINE

// ...

const App = () =&gt; {
  const [errorMessage, setErrorMessage] = useState(null) // HIGHLIGHT LINE

  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

// BEGIN HIGHLIGHT
  const notify = (message) =&gt; {
    setErrorMessage(message)
    setTimeout(() =&gt; {
      setErrorMessage(null)
    }, 10000)
  }
  // END HIGHLIGHT

  return (
    &lt;div&gt;
      &lt;Notify errorMessage={errorMessage} /&gt;  // HIGHLIGHT LINE
      &lt;Persons persons = {result.data.allPersons} /&gt;
      &lt;PersonForm setError={notify} /&gt;  // HIGHLIGHT LINE
    &lt;/div&gt;
  )
}
```

Now the user is informed about an error with a simple notification.

![browser showing in red name must be unique](/images/mooc/56e165c88d0f.webp)

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;branch&nbsp;<em>part8-3</em>.

## Updating a phone number

Let's add the possibility to change the phone numbers of persons to our application. The solution is almost identical to the one we used for adding new persons.

The mutation again requires the use of variables. Add the following query to the file&nbsp;<em>queries.js</em>:

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

Create a new component&nbsp;<em>PhoneForm</em>&nbsp;in the file&nbsp;<em>src/components/PhoneForm.jsx</em>&nbsp;for updating a phone number. The component adds a form to the application where you can enter a new phone number for a selected person. The interesting parts of the code are highlighted:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_NUMBER } from '../queries'

const PhoneForm = () =&gt; {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

// BEGIN HIGHLIGHT
  const [ changeNumber ] = useMutation(EDIT_NUMBER)
// END HIGHLIGHT

  const submit = (event) =&gt; {
    event.preventDefault()

// BEGIN HIGHLIGHT
    changeNumber({ variables: { name, phone } })
    // END HIGHLIGHT

    setName('')
    setPhone('')
  }

  return (
    &lt;div&gt;
      &lt;h2&gt;change number&lt;/h2&gt;

      &lt;form onSubmit={submit}&gt;
        &lt;div&gt;
          name &lt;input
            value={name}
            onChange={({ target }) =&gt; setName(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          phone &lt;input
            value={phone}
            onChange={({ target }) =&gt; setPhone(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;button type='submit'&gt;change number&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  )
}

export default PhoneForm
```

The&nbsp;<em>PhoneForm</em>&nbsp;component is straightforward: it asks for the person's name and a new phone number via a form. When the form is submitted, it calls the&nbsp;<code>changeNumber</code>&nbsp;function that handles the update, created with the&nbsp;<code>useMutation</code>&nbsp;hook.

Enable the new component in the file&nbsp;<em>App.jsx</em>:

```js
import PhoneForm from './components/PhoneForm' // HIGHLIGHT LINE

const App = () =&gt; {
  // ...

  return (
    &lt;div&gt;
      &lt;Notify errorMessage={errorMessage} /&gt;
      &lt;Persons persons={result.data.allPersons} /&gt;
      &lt;PersonForm setError={notify} /&gt;
      &lt;PhoneForm setError={notify} /&gt; // HIGHLIGHT LINE
    &lt;/div&gt;
  )
}
```

It looks bleak, but it works:

![browser showing main page with name and phone having information in the input](/images/mooc/842b2800e5a8.webp)

Surprisingly, when a person's number is changed, the new number automatically appears on the list of persons rendered by the&nbsp;<em>Persons</em>&nbsp;component. This happens because each person has an identifying field of type&nbsp;<em>ID</em>, so the person's details saved to the cache update automatically when they are changed with the mutation.

Our application still has one small flaw. If we try to change the phone number for a name which does not exist, nothing seems to happen. This happens because if a person with the given name cannot be found, the mutation response is&nbsp;<em>null</em>:

![dev tools showing network with localhost and response with editNumber being null](/images/mooc/c12257e022e7.webp)

Since this isn’t considered an error state from GraphQL’s point of view, registering an&nbsp;<code>onError</code>&nbsp;error handler wouldn’t be useful in this situation. However, we can add an&nbsp;<code>onCompleted</code>&nbsp;callback to the&nbsp;<code>useMutation</code>&nbsp;hook, where we can generate a potential error message:

```js
const PhoneForm = ({ setError }) =&gt; { // HIGHLIGHT LINE
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // BEGIN HIGHLIGHT
  const [changeNumber] = useMutation(EDIT_NUMBER, {
    onCompleted: (data) =&gt; {
      if (!data.editNumber) {
        setError('person not found')
      }
    }
  })
  // END HIGHLIGHT

  // ...
}
```

The&nbsp;<code>onCompleted</code>&nbsp;callback function is always executed when the mutation has been successfully completed. If the person wasn’t found—that is, if the query result&nbsp;<code>data.editNumber</code>&nbsp;is&nbsp;<code>null</code>—the component uses the&nbsp;<code>setError</code>&nbsp;callback function it received via props to set an appropriate error message.

The current code of the application can be found on&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;branch&nbsp;<em>part8-4</em>.

## Apollo Client and the applications state

In our example, management of the applications state has mostly become the responsibility of Apollo Client. This is quite a typical solution for GraphQL applications. Our example uses the state of the React components only to manage the state of a form and to show error notifications. As a result, it could be that there are no justifiable reasons to use Redux to manage application state when using GraphQL.

When necessary, Apollo enables saving the application's local state to&nbsp;<a href="https://www.apollographql.com/docs/react/local-state/local-state-management/" target="_blank" rel="noreferrer noopener">Apollo cache</a>.

<div class="tasks">

**8. Authors view**

</div>

<div class="tasks">

**9. Books view**

</div>

<div class="tasks">

**10. Adding a book**

</div>

<div class="tasks">

**11. Authors birth year**

</div>

<div class="tasks">

**12. Authors birth year advanced**

</div>
