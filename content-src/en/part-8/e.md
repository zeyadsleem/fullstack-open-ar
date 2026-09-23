---
part: 8
letter: e
title: "Chapter 5: Login and updating the cache"
mainImage: /images/part-8.svg
lang: en
---
The frontend of our application shows the phone directory just fine with the updated server. However, if we want to add new persons, we have to add login functionality to the frontend.

## User login

Let’s first define the mutation for logging in in the file&nbsp;<em>src/queries.js</em>:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

Let’s define the&nbsp;<code>LoginForm</code>&nbsp;component responsible for logging in in the file&nbsp;<em>src/components/LoginForm.jsx</em>. It works in much the same way as the earlier components that handle mutations. The interesting lines are highlighted in the code:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) =&gt; { // HIGHLIGHT LINE
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // BEGIN HIGHLIGHT
  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) =&gt; {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('phonebook-user-token', token)
    },
    onError: (error) =&gt; {
      setError(error.message)
    }
  })
  // END HIGHLIGHT

  // BEGIN HIGHLIGHT
  const submit = (event) =&gt; {
    event.preventDefault()
    login({ variables: { username, password } })
  }
  // END HIGHLIGHT

  return (
    &lt;div&gt;
      &lt;form onSubmit={submit}&gt;
        &lt;div&gt;
          username &lt;input
            value={username}
            onChange={({ target }) =&gt; setUsername(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          password &lt;input
            type='password'
            value={password}
            onChange={({ target }) =&gt; setPassword(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;button type='submit'&gt;login&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  )
}

export default LoginForm
```

The component receives the functions&nbsp;<code>setError</code>&nbsp;and&nbsp;<code>setToken</code>&nbsp;as props, which can be used to change the application state. Defining state management is left to the&nbsp;<code>App</code>&nbsp;component.

For the&nbsp;<code>useMutation</code>&nbsp;function that performs the login, an&nbsp;<code>onCompleted</code>&nbsp;callback function is defined. It is called when the mutation has been successfully executed. In the callback, the token value is read from the response data and then stored in the application state and in the browser’s localStorage.

Let’s now use the&nbsp;<em>LoginForm</em>&nbsp;component in the&nbsp;<em>App.jsx</em>&nbsp;file. We add a&nbsp;<code>token</code>&nbsp;variable to the application state to store the token once the user has logged in. If&nbsp;<code>token</code>&nbsp;is not defined, we render only the login form:

```js
import LoginForm from './components/LoginForm' // HIGHLIGHT LINE
// ...

const App = () =&gt; {
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token')) // HIGHLIGHT LINE
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  const notify = (message) =&gt; {
    setErrorMessage(message)
    setTimeout(() =&gt; {
      setErrorMessage(null)
    }, 10000)
  }

  // BEGIN HIGHLIGHT
  if (!token) {
    return (
      &lt;div&gt;
        &lt;Notify errorMessage={errorMessage} /&gt;
        &lt;h2&gt;Login&lt;/h2&gt;
        &lt;LoginForm
          setToken={setToken}
          setError={notify}
        /&gt;
      &lt;/div&gt;
    )
  }
  // END HIGHLIGHT

  return (
    // ...
  )
}
```

The token is now initialized from a token value that may be found in localStorage:

```js
const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
```

This way, the token is also restored when the page is reloaded, and the user stays logged in. If localStorage does not contain a value for the key&nbsp;<em>phonebook-user-token</em>, the token value will be&nbsp;<code>null</code>.

We also add a button that allows a logged-in user to log out. In the button’s click handler, we set&nbsp;<code>token</code>&nbsp;to&nbsp;<code>null</code>, remove the token from localStorage, and reset the Apollo Client cache:

```js
import { useApolloClient, useQuery } from '@apollo/client/react' // HIGHLIGHT LINE
//...

const App = () =&gt; {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient() // HIGHLIGHT LINE

  if (result.loading)  {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  // BEGIN HIGHLIGHT
  const onLogout = () =&gt; {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  // END HIGHLIGHT

  // ...

  return (
    &lt;&gt;
      &lt;Notify errorMessage={errorMessage} /&gt;
      &lt;button onClick={onLogout}&gt;logout&lt;/button&gt; // HIGHLIGHT LINE
      &lt;Persons persons={result.data.allPersons} /&gt;
      &lt;PersonForm setError={notify} /&gt;
      &lt;PhoneForm setError={notify} /&gt;
    &lt;/&gt;
  )
}
```

Resetting the cache is done using the Apollo&nbsp;<code>client</code>&nbsp;object’s&nbsp;<a href="https://www.apollographql.com/docs/react/api/core/ApolloClient#resetstore" target="_blank" rel="noreferrer noopener">resetStore</a>&nbsp;method, and the client itself can be accessed with the&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/useApolloClient" target="_blank" rel="noreferrer noopener">useApolloClient</a>&nbsp;hook. Clearing the cache is&nbsp;<a href="https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout" target="_blank" rel="noreferrer noopener">important</a>, because some queries may have fetched data into the cache that only an authenticated user is allowed to access.

## Adding a token to a header

After the backend changes, creating new persons requires that a valid user token is sent with the request. This requires changes to the Apollo Client configuration in the&nbsp;<em>main.jsx</em>&nbsp;file:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context' // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const authLink  = new SetContextLink(({ headers }) =&gt; {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
// END HIGHLIGHT

const httpLink = new HttpLink({ uri: 'http://localhost:4000' }) // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;ApolloProvider client={client}&gt;
      &lt;App /&gt;
    &lt;/ApolloProvider&gt;
  &lt;/StrictMode&gt;,
)
```

As before, the server URL is wrapped using the&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-http" target="_blank" rel="noreferrer noopener">HttpLink</a>&nbsp;constructor to create a suitable&nbsp;<code>httpLink</code>&nbsp;object. This time, however, it is modified using the&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview" target="_blank" rel="noreferrer noopener">context</a>&nbsp;defined by the&nbsp;<code>authLink</code>&nbsp;object so that, for each request, the&nbsp;<em>authorization</em>&nbsp;header is&nbsp;<a href="https://www.apollographql.com/docs/react/networking/authentication/#header" target="_blank" rel="noreferrer noopener">set</a>&nbsp;to the token that may be stored in localStorage.

Creating new persons and changing numbers works again.

## Fixing validations

In the application, it should be possible to add a person without a phone number. However, if we now try to add a person without a phone number, it doesn’t work:

![browser showing person validation failed](/images/mooc/2ad4ea9510aa.webp)

Validation fails, because frontend sends an empty string as the value of&nbsp;<code>phone</code>.

Let's change the function creating new persons so that it sets&nbsp;<code>phone</code>&nbsp;to&nbsp;<code>undefined</code>&nbsp;if user has not given a value:

```js
const PersonForm = ({ setError }) =&gt; {
  // ...
  const submit = async (event) =&gt; {
    event.preventDefault()

    // BEGIN HIGHLIGHT
    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length &gt; 0 ? phone : undefined,
      },
    })
    // END HIGHLIGHT

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  // ...
}
```

From the perspective of the backend and the database, the&nbsp;<em>phone</em>&nbsp;attribute now has no value if the user leaves the field empty. Adding a person without a phone number works again.

There is also an issue with the functionality for changing a phone number. The database validations require that the phone number must be at least 5 characters long, but if we try to update an existing person’s phone number to one that is too short, nothing seems to happen. The person’s phone number is not updated, but on the other hand no error message is shown either.

From the console’s <em>Network</em> tab we can see that the request is answered with an error message:

![The console’s Network tab shows the error message returned in the response](/images/mooc/d455f2772201.webp)

Let’s modify the application so that validation errors are also shown when changing a phone number:

```js
const PhoneForm = ({ setError }) =&gt; {
  // ...

  const submit = async (event) =&gt; {
    event.preventDefault()

    // BEGIN HIGHLIGHT
    try {
      await changeNumber({ variables: { name, phone } })
    } catch (error) {
      setError(error.message)
    }
    // END HIGHLIGHT

    setName('')
    setPhone('')
  }

  // ...
}
```

The request that updates the number, <code>changeNumber</code>, is now executed inside a <em>try</em> block. If the database validations fail, execution ends up in the <em>catch</em> block, where an appropriate error message is set in the application using the <code>setError</code> function:

![The application shows an error message if the phone number is shorter than 5 characters](/images/mooc/bb80cd39240f.webp)

## Updating cache, revisited

We have to <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql/chapter-3#updating-the-cache" target="_blank" rel="noreferrer noopener">update</a> the cache of the Apollo client on creating new persons. We can update it using the mutation's <code>refetchQueries</code> option to define that the <code>ALL_PERSONS</code> query is done again.

```js
const PersonForm = ({ setError }) =&gt; {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) =&gt; setError(error.message),
    refetchQueries: [{ query: ALL_PERSONS }], // HIGHLIGHT LINE
  })

// ...
}
```

This approach is pretty good, the drawback being that the query is always rerun with any updates.

It is possible to optimize the solution by updating the cache manually. This is done by defining an appropriate&nbsp;<a href="https://www.apollographql.com/docs/react/data/mutations/#the-update-function" target="_blank" rel="noreferrer noopener">update</a>&nbsp;callback for the mutation instead of using the&nbsp;<code>refetchQueries</code>&nbsp;attribute. Apollo executes this callback after the mutation completes:

```sql
const PersonForm = ({ setError }) =&gt; {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) =&gt; setError(error.message),
    // BEGIN HIGHLIGHT
    update: (cache, response) =&gt; {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) =&gt; {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
    // END HIGHLIGHT
  })

  // ..
}
```

The callback function is given a reference to the cache and the data returned by the mutation as parameters. For example, in our case, this would be the created person.

Using the function&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment" target="_blank" rel="noreferrer noopener">updateQuery</a>&nbsp;the code updates the query ALLPERSONS in the cache by adding the new person to the cached data.

In some situations, the only sensible way to keep the cache up to date is using the&nbsp;<code>update</code>&nbsp;callback.

When necessary, it is possible to disable cache for the whole application or&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#options" target="_blank" rel="noreferrer noopener">single queries</a>&nbsp;by setting the field managing the use of cache,&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy" target="_blank" rel="noreferrer noopener">fetchPolicy</a>&nbsp;as&nbsp;<code>no-cache</code>.

Be diligent with the cache. Old data in the cache can cause hard-to-find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb:

> <em>There are only two hard things in Computer Science: cache invalidation and naming things.</em>&nbsp;Read more&nbsp;<a href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noreferrer noopener">here</a>.

The current code of the application can be found on <a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a>, branch <em>part8-5</em>.

<div class="tasks">

**18. Listing books**

</div>

<div class="tasks">

**19. Log in**

</div>

<div class="tasks">

**20. Books by genre, part 1**

</div>

<div class="tasks">

**21. Books by genre, part 2**

</div>

<div class="tasks">

**22. Books by genre with GraphQL**

</div>

<div class="tasks">

**23. Up-to-date cache and book recommendations**

</div>

<div class="tasks">

**24. Checkup**

</div>
