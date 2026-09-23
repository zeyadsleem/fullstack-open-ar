---
part: 10
letter: d
title: "Communicating with server"
mainImage: /images/part-10.svg
lang: en
---
So far we have implemented features to our application without any actual server communication. For example, the reviewed repositories list we have implemented uses mock data and the sign in form doesn't send the user's credentials to any authentication endpoint. In this section, we will learn how to communicate with a server using HTTP requests, how to use Apollo Client in a React Native application, and how to store data in the user's device.

Soon we will learn how to communicate with a server in our application. Before we get to that, we need a server to communicate with. For this purpose, we have a completed server implementation in the&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api" target="_blank" rel="noreferrer noopener">rate-repository-api</a>&nbsp;repository. The rate-repository-api server fulfills all our application's API needs during this part. It uses&nbsp;<a href="https://www.sqlite.org/index.html" target="_blank" rel="noreferrer noopener">SQLite</a>&nbsp;database which doesn't need any setup and provides an Apollo GraphQL API along with a few REST API endpoints.

Before heading further into the material, set up the rate-repository-api server by following the setup instructions in the repository's&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md" target="_blank" rel="noreferrer noopener">README</a>. Note that if you are using an emulator for development it is recommended to run the server and the emulator&nbsp;<em>on the same computer</em>. This eases network requests considerably.

## HTTP requests

React Native provides&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noreferrer noopener">Fetch API</a>&nbsp;for making HTTP requests in our applications. React Native also supports the good old&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" target="_blank" rel="noreferrer noopener">XMLHttpRequest API</a>&nbsp;which makes it possible to use third-party libraries such as&nbsp;<a href="https://github.com/axios/axios" target="_blank" rel="noreferrer noopener">Axios</a>. These APIs are the same as the ones in the browser environment and they are globally available without the need for an import.

People who have used both Fetch API and XMLHttpRequest API most likely agree that the Fetch API is easier to use and more modern. However, this doesn't mean that XMLHttpRequest API doesn't have its uses. For the sake of simplicity, we will only be using the Fetch API in our examples.

Sending HTTP requests using the Fetch API can be done using the&nbsp;<code>fetch</code>&nbsp;function. The first argument of the function is the URL of the resource:

```
fetch('https://my-api.com/get-end-point');
```

The default request method is&nbsp;<em>GET</em>. The second argument of the&nbsp;<code>fetch</code>&nbsp;function is an options object, which you can use for example to specify a different request method, request headers, or request body:

```
fetch('https://my-api.com/post-end-point', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'firstValue',
    secondParam: 'secondValue',
  }),
});
```

Note that these URLs are made up and won't (most likely) send a response to your requests. In comparison to Axios, the Fetch API operates on a bit lower level. For example, there isn't any request or response body serialization and parsing. This means that you have to for example set the&nbsp;<em>Content-Type</em>&nbsp;header by yourself and use&nbsp;<code>JSON.stringify</code>&nbsp;method to serialize the request body.

The&nbsp;<code>fetch</code>&nbsp;function returns a promise which resolves a&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noreferrer noopener">Response</a>&nbsp;object. Note that error status codes such as 400 and 500&nbsp;<em>are not rejected</em>&nbsp;like for example in Axios. In case of a JSON formatted response we can parse the response body using the&nbsp;<code>Response.json</code>&nbsp;method:

```js
const fetchMovies = async () =&gt; {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();

  return json;
};
```

For a more detailed introduction to the Fetch API, read the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank" rel="noreferrer noopener">Using Fetch</a>&nbsp;article in the MDN web docs.

Next, let's try the Fetch API in practice. The rate-repository-api server provides an endpoint for returning a paginated list of reviewed repositories. Once the server is running, you should be able to access the endpoint at&nbsp;<a href="http://localhost:5000/api/repositories" target="_blank" rel="noreferrer noopener">http://localhost:5000/api/repositories</a>&nbsp;(unless you have changed the port). The data is paginated in a common&nbsp;<a href="https://graphql.org/learn/pagination/" target="_blank" rel="noreferrer noopener">cursor based pagination format</a>. The actual repository data is behind the&nbsp;<em>node</em>&nbsp;key in the&nbsp;<em>edges</em>&nbsp;array.

Unfortunately, if we´re using external device, we can't access the server directly in our application by using the <em><a href="http://localhost:5000/api/repositories" target="_blank" rel="noreferrer noopener">http://localhost:5000/api/repositories</a></em> URL. To make a request to this endpoint in our application we need to access the server using its IP address in its local network. To find out what it is, open the Expo development tools by running <code>npm start</code>. In the console you should be able to see an URL starting with <em>exp://</em> below the QR code, after the "Metro waiting on" text:

![metro console output with highlight over exp://<ip> url](/images/mooc/306b11b5055e.webp)

Copy the IP address between the&nbsp;<em>exp://</em>&nbsp;and&nbsp;<em>:</em>, which is in this example&nbsp;<em>192.168.1.33</em>. Construct an URL in format&nbsp;<em>http://&lt;IP_ADDRESS&gt;:5000/api/repositories</em>&nbsp;and open it in the browser. You should see the same response as you did with the&nbsp;<em>localhost</em>&nbsp;URL.

Now that we know the end point's URL let's use the actual server-provided data in our reviewed repositories list. We are currently using mock data stored in the&nbsp;<code>repositories</code>&nbsp;variable. Remove the&nbsp;<code>repositories</code>&nbsp;variable and replace the usage of the mock data with this piece of code in the&nbsp;<em>RepositoryList.jsx</em>&nbsp;file in the&nbsp;<em>components</em>&nbsp;directory:

```js
import { useState, useEffect } from 'react';  // HIGHLIGHT LINE
// ...

const RepositoryList = () =&gt; {
  // BEGIN HIGHLIGHT
  const [repositories, setRepositories] = useState();

  const fetchRepositories = async () =&gt; {
    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    console.log(json);

    setRepositories(json);
  };

  useEffect(() =&gt; {
    fetchRepositories();
  }, []);

  // Get the nodes from the edges array
  const repositoryNodes = repositories
    ? repositories.edges.map(edge =&gt; edge.node)
    : [];
  // END HIGHLIGHT

  return (
    &lt;FlatList
      data={repositoryNodes}  // HIGHLIGHT LINE
      // Other props
    /&gt;
  );
};

export default RepositoryList;
```

We are using React's&nbsp;<code>useState</code>&nbsp;hook to maintain the repository list state and the&nbsp;<code>useEffect</code>&nbsp;hook to call the&nbsp;<code>fetchRepositories</code>&nbsp;function when the&nbsp;<code>RepositoryList</code>&nbsp;component is mounted. We extract the actual repositories into the&nbsp;<code>repositoryNodes</code>&nbsp;variable and replace the previously used&nbsp;<code>repositories</code>&nbsp;variable in the&nbsp;<code>FlatList</code>&nbsp;component's&nbsp;<code>data</code>&nbsp;prop with it. Now you should be able to see actual server-provided data in the reviewed repositories list.

It is usually a good idea to log the server's response during the development phase to be able to inspect it as we did in the <code>fetchRepositories</code> function. You should be able to see this log message in the Expo CLI console or in Expo development tools if you navigate to your device's logs as we learned in the <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native/chapter-2#debugging" target="_blank" rel="noreferrer noopener">Debugging</a> section. If you are using the Expo's mobile app for development and the network request is failing, make sure that the computer you are using to run the server and your phone are <em>connected to the same Wi-Fi network</em>. If that's not possible either use an emulator in the same computer as the server is running in or <a href="https://fullstackopen.com/en/part10/introduction_to_react_native#using-your-own-phone-with-expo-go" target="_blank" rel="noreferrer noopener">use the tunnel option</a>.

The current data fetching code in the&nbsp;<code>RepositoryList</code>&nbsp;component could do with some refactoring. For instance, the component is aware of the network request's details such as the end point's URL. In addition, the data fetching code has lots of reuse potential. Let's refactor the component's code by extracting the data fetching code into its own hook. Create a directory&nbsp;<em>hooks</em>&nbsp;in the&nbsp;<em>src</em>&nbsp;directory and in that&nbsp;<em>hooks</em>&nbsp;directory create a file&nbsp;<em>useRepositories.js</em>&nbsp;with the following content:

```js
import { useState, useEffect } from 'react';

const useRepositories = () =&gt; {
  const [repositories, setRepositories] = useState();
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () =&gt; {
    setLoading(true);

    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    setLoading(false);
    setRepositories(json);
  };

  useEffect(() =&gt; {
    fetchRepositories();
  }, []);

  return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;
```

Now that we have a clean abstraction for fetching the reviewed repositories, let's use the&nbsp;<code>useRepositories</code>&nbsp;hook in the&nbsp;<code>RepositoryList</code>&nbsp;component:

```js
// ...
import useRepositories from '../hooks/useRepositories'; // HIGHLIGHT LINE

const RepositoryList = () =&gt; {
  const { repositories } = useRepositories(); // HIGHLIGHT LINE

  const repositoryNodes = repositories
    ? repositories.edges.map(edge =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // Other props
    /&gt;
  );
};

export default RepositoryList;
```

That's it, now the&nbsp;<code>RepositoryList</code>&nbsp;component is no longer aware of the way the repositories are acquired. Maybe in the future, we will acquire them through a GraphQL API instead of a REST API. We will see what happens.

## GraphQL and Apollo client

In&nbsp;<a href="https://fullstackopen.com/en/part8" target="_blank" rel="noreferrer noopener">part 8</a>&nbsp;we learned about GraphQL and how to send GraphQL queries to an Apollo Server using the&nbsp;<a href="https://www.apollographql.com/docs/react/" target="_blank" rel="noreferrer noopener">Apollo Client</a>&nbsp;in React applications. The good news is that we can use the Apollo Client in a React Native application exactly as we would with a React web application.

As mentioned earlier, the rate-repository-api server provides a GraphQL API which is implemented with Apollo Server. Once the server is running, you can access the <a href="https://www.apollographql.com/docs/graphos/platform/sandbox" target="_blank" rel="noreferrer noopener">Apollo Sandbox</a> at <a href="http://localhost:4000/" target="_blank" rel="noreferrer noopener">http://localhost:4000</a>. Apollo Sandbox is a tool for making GraphQL queries and inspecting the GraphQL APIs schema and documentation. If you need to send a query in your application <em>always</em> test it with the Apollo Sandbox first before implementing it in the code. It is much easier to debug possible problems in the query in the Apollo Sandbox than in the application. If you are uncertain what the available queries are or how to use them, you can see the documentation next to the operations editor:

![Apollo Sandbox](/images/mooc/1bf23e6ced47.webp)

In our React Native application, we will be using the same&nbsp;<a href="https://www.npmjs.com/package/@apollo/client" target="_blank" rel="noreferrer noopener">@apollo/client</a>&nbsp;library as in part 8. Let's get started by installing the library along with the&nbsp;<a href="https://www.npmjs.com/package/graphql" target="_blank" rel="noreferrer noopener">graphql</a>&nbsp;library which is required as a peer dependency:

```bash
npm install @apollo/client graphql
```

Let's create a utility function for creating the Apollo Client with the required configuration. Create a&nbsp;<em>utils</em>&nbsp;directory in the&nbsp;<em>src</em>&nbsp;directory and in that&nbsp;<em>utils</em>&nbsp;directory create a file&nbsp;<em>apolloClient.js</em>. In that file configure the Apollo Client to connect to the Apollo Server:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://192.168.1.100:4000/graphql',
});

const createApolloClient = () =&gt; {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

The URL used to connect to the Apollo Server is otherwise the same as the one you used with the Fetch API except the port is&nbsp;<em>4000</em>&nbsp;and the path is&nbsp;<em>/graphql</em>. Lastly, we need to provide the Apollo Client using the&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/ApolloProvider" target="_blank" rel="noreferrer noopener">ApolloProvider</a>&nbsp;context. We will add it to the&nbsp;<code>App</code>&nbsp;component in the&nbsp;<em>App.js</em>&nbsp;file:

```js
import { ApolloProvider } from '@apollo/client/react';  // HIGHLIGHT LINE
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient'; // HIGHLIGHT LINE

const apolloClient = createApolloClient(); // HIGHLIGHT LINE

const App = () =&gt; {
  return (
    &lt;StatusBar style="light" /&gt;
    &lt;NativeRouter&gt;
      &lt;ApolloProvider client={apolloClient}&gt; // HIGHLIGHT LINE
        &lt;Main /&gt;
      &lt;/ApolloProvider&gt; // HIGHLIGHT LINE
    &lt;/NativeRouter&gt;
  );
};

export default App;
```

## Organizing GraphQL related code

It is up to you how to organize the GraphQL related code in your application. However, for the sake of a reference structure, let's have a look at one quite simple and efficient way to organize the GraphQL related code. In this structure, we define queries, mutations, fragments, and possibly other entities in their own files. These files are located in the same directory. Here is an example of the structure you can use to get started:

![GraphQL structure](/images/mooc/2acedef0ee2f.webp)

You can import the&nbsp;<code>gql</code>&nbsp;template literal tag used to define GraphQL queries from&nbsp;<em>@apollo/client</em>&nbsp;library. If we follow the structure suggested above, we could have a&nbsp;<em>queries.js</em>&nbsp;file in the&nbsp;<em>graphql</em>&nbsp;directory for our application's GraphQL queries. Each of the queries can be stored in a variable and exported like this:

```js
import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      ${/* ... */}
    }
  }
`;

// other queries...
```

We can import these variables and use them with the&nbsp;<code>useQuery</code>&nbsp;hook like this:

```js
import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () =&gt; {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

The same goes for organizing mutations. The only difference is that we define them in a different file,&nbsp;<em>mutations.js</em>. It is recommended to use&nbsp;<a href="https://www.apollographql.com/docs/react/data/fragments/" target="_blank" rel="noreferrer noopener">fragments</a>&nbsp;in queries to avoid retyping the same fields over and over again.

## Evolving the structure

Once our application grows larger there might be times when certain files grow too large to manage. For example, we have component&nbsp;<code>A</code>&nbsp;which renders the components&nbsp;<code>B</code>&nbsp;and&nbsp;<code>C</code>. All these components are defined in a file&nbsp;<em>A.jsx</em>&nbsp;in a&nbsp;<em>components</em>&nbsp;directory. We would like to extract components&nbsp;<code>B</code>&nbsp;and&nbsp;<code>C</code>&nbsp;into their own files&nbsp;<em>B.jsx</em>&nbsp;and&nbsp;<em>C.jsx</em>&nbsp;without major refactors. We have two options:
- Create files <em>B.jsx</em> and <em>C.jsx</em> in the <em>components</em> directory. This results in the following structure:

```
components/
  A.jsx
  B.jsx
  C.jsx
  ...
```
- Create a directory <em>A</em> in the <em>components</em> directory and create files <em>B.jsx</em> and <em>C.jsx</em> there. To avoid breaking components that import the <em>A.jsx</em> file, move the <em>A.jsx</em> file to the <em>A</em> directory and rename it to <em>index.jsx</em>. This results in the following structure:

```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
  ...
```

The first option is fairly decent, however, if components&nbsp;<code>B</code>&nbsp;and&nbsp;<code>C</code>&nbsp;are not reusable outside the component&nbsp;<code>A</code>, it is useless to bloat the&nbsp;<em>components</em>&nbsp;directory by adding them as separate files. The second option is quite modular and doesn't break any imports because importing a path such as&nbsp;<em>./A</em>&nbsp;will match both&nbsp;<em>A.jsx</em>&nbsp;and&nbsp;<em>A/index.jsx</em>.

## Exercise 10.11

### Exercise 10.11: fetching repositories with Apollo Client

<div class="tasks">

**11. Fetching repositories with Apollo Client**

</div>

## Environment variables

Every application will most likely run in more than one environment. Two obvious candidates for these environments are the development environment and the production environment. Out of these two, the development environment is the one we are running the application right now. Different environments usually have different dependencies, for example, the server we are developing locally might use a local database whereas the server that is deployed to the production environment uses the production database. To make the code environment independent we need to parameterize these dependencies. At the moment we are using one very environment dependant hardcoded value in our application: the URL of the server.

We have previously learned that we can provide running programs with environment variables. These variables can be defined in the command line or using environment configuration files such as <em>.env</em> files. Earlier in the course, we used the <em>dotenv</em> library to read <em>.env</em> files. Expo automatically reads the <em>.env</em> file defined in the project root, so the dotenv library is not needed. However, each environment variable must start with the <code>EXPO_PUBLIC_</code> prefix. You can read more in the <a href="https://docs.expo.dev/guides/environment-variables/" target="_blank" rel="noreferrer noopener">Expo documentation</a>.

Let's create a&nbsp;<em>.env</em>&nbsp;file in the project root with the following content:

```
EXPO_PUBLIC_ENV=test
```

Here, we define an environment variable named <code>EXPO_PUBLIC_ENV</code>. You may need to restart Expo development tools to apply the changes you have made to the <em>.env</em> file.

As usual, you can access the environment variable in the application using the syntax <code>process.env.EXPO_PUBLIC_ENV</code>. As a quick test, we can log the environment variable in the App component:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () =&gt; {
  console.log("env check:", process.env.EXPO_PUBLIC_ENV);  // HIGHLIGHT LINE

  return (
    // ...
  );
};

export default App;
```

You should now see 'env check: test' in the logs.

Note that it is <em>never</em> a good idea to put sensitive data into the application's configuration. The reason for this is that once a user has downloaded your application, they can, at least in theory, reverse engineer your application and figure out the sensitive data you have stored into the code. Environment variables used by Expo can be found in plain text in the compiled app, so do not include sensitive information, such as private keys, in <code>EXPO_PUBLIC_</code> variables.

<div class="tasks">

**12. Environment variables**

</div>

## Storing data in the user's device

There are times when we need to store some persisted pieces of data in the user's device. One such common scenario is storing the user's authentication token so that we can retrieve it even if the user closes and reopens our application. In web development, we have used the browser's&nbsp;<code>localStorage</code>&nbsp;object to achieve such functionality. React Native provides similar persistent storage, the&nbsp;<a href="https://github.com/react-native-async-storage/async-storage?tab=readme-ov-file#usage" target="_blank" rel="noreferrer noopener">AsyncStorage</a>.

We can use the&nbsp;<code>npx expo install</code>&nbsp;command to install the version of the&nbsp;<em>@react-native-async-storage/async-storage</em>&nbsp;package that is suitable for our Expo SDK version:

```bash
npx expo install @react-native-async-storage/async-storage
```

The API of the&nbsp;<code>AsyncStorage</code>&nbsp;is in many ways same as the&nbsp;<code>localStorage</code>&nbsp;API. They are both key-value storages with similar methods. The biggest difference between the two is that, as the name implies, the operations of&nbsp;<code>AsyncStorage</code>&nbsp;are&nbsp;<em>asynchronous</em>.

Because&nbsp;<code>AsyncStorage</code>&nbsp;operates with string keys in a global namespace it is a good idea to create a simple abstraction for its operations. This abstraction can be implemented for example using a&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes" target="_blank" rel="noreferrer noopener">class</a>. As an example, we could implement a shopping cart storage for storing the products user wants to buy:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

class ShoppingCartStorage {
  constructor(namespace = 'shoppingCart') {
    this.namespace = namespace;
  }

  async getProducts() {
    const rawProducts = await AsyncStorage.getItem(
      `${this.namespace}:products`,
    );

    return rawProducts ? JSON.parse(rawProducts) : [];
  }

  async addProduct(productId) {
    const currentProducts = await this.getProducts();
    const newProducts = [...currentProducts, productId];

    await AsyncStorage.setItem(
      `${this.namespace}:products`,
      JSON.stringify(newProducts),
    );
  }

  async clearProducts() {
    await AsyncStorage.removeItem(`${this.namespace}:products`);
  }
}

const doShopping = async () =&gt; {
  const shoppingCartA = new ShoppingCartStorage('shoppingCartA');
  const shoppingCartB = new ShoppingCartStorage('shoppingCartB');

  await shoppingCartA.addProduct('chips');
  await shoppingCartA.addProduct('soda');

  await shoppingCartB.addProduct('milk');

  const productsA = await shoppingCartA.getProducts();
  const productsB = await shoppingCartB.getProducts();

  console.log(productsA, productsB);

  await shoppingCartA.clearProducts();
  await shoppingCartB.clearProducts();
};

doShopping();
```

Because&nbsp;<code>AsyncStorage</code>&nbsp;keys are global, it is usually a good idea to add a&nbsp;<em>namespace</em>&nbsp;for the keys. In this context, the namespace is just a prefix we provide for the storage abstraction's keys. Using the namespace prevents the storage's keys from colliding with other&nbsp;<code>AsyncStorage</code>&nbsp;keys. In this example, the namespace is defined as the constructor's argument and we are using the&nbsp;<code>namespace:key</code>&nbsp;format for the keys.

We can add an item to the storage using the&nbsp;<code>AsyncStorage.setItem</code>&nbsp;method. The first argument of the method is the item's key and the second argument its value. The value&nbsp;<em>must be a string</em>, so we need to serialize non-string values as we did with the&nbsp;<code>JSON.stringify</code>&nbsp;method. The&nbsp;<code>AsyncStorage.getItem</code>&nbsp;method can be used to get an item from the storage. The argument of the method is the item's key, of which value will be resolved. The&nbsp;<code>AsyncStorage.removeItem</code>&nbsp;method can be used to remove the item with the provided key from the storage.

<strong>NB:</strong> <a href="https://docs.expo.dev/versions/latest/sdk/securestore/" target="_blank" rel="noreferrer noopener">SecureStore</a> is similar persisted storage as the <code>AsyncStorage</code> but it encrypts the stored data. This makes it more suitable for storing more sensitive data.

<div class="tasks">

**13. The sign in form mutation**

</div>

<div class="tasks">

**14. Storing the access token step1**

</div>

## Enhancing Apollo Client's requests

Now that we have implemented storage for storing the user's access token, it is time to start using it. Initialize the storage in the&nbsp;<code>App</code>&nbsp;component:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage'; // HIGHLIGHT LINE

const authStorage = new AuthStorage(); // HIGHLIGHT LINE
const apolloClient = createApolloClient(authStorage); // HIGHLIGHT LINE

const App = () =&gt; {
  return (
    &lt;&gt;
      &lt;StatusBar style="light" /&gt;
      &lt;NativeRouter&gt;
        &lt;ApolloProvider client={apolloClient}&gt;
          &lt;Main /&gt;
        &lt;/ApolloProvider&gt;
      &lt;/NativeRouter&gt;
    &lt;/&gt;
  );
};

export default App;
```

We also provided the storage instance for the&nbsp;<code>createApolloClient</code>&nbsp;function as an argument. This is because next, we will send the access token to Apollo Server in each request. The Apollo Server will expect that the access token is present in the&nbsp;<em>Authorization</em>&nbsp;header in the format&nbsp;<em>Bearer &lt;ACCESS_TOKEN&gt;</em>. We can enhance the Apollo Client's request by using the&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-context" target="_blank" rel="noreferrer noopener">setContextLink</a>&nbsp;function. Let's send the access token to the Apollo Server by modifying the&nbsp;<code>createApolloClient</code>&nbsp;function in the&nbsp;<em>apolloClient.js</em>&nbsp;file:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context'; // HIGHLIGHT LINE

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

// BEGIN HIGHLIGHT
const createApolloClient = (authStorage) =&gt; {
  const authLink = new SetContextLink(async ({ headers }) =&gt; {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);
      return {
        headers,
      };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
// END HIGHLIGHT

export default createApolloClient;
```

## Using React Context for dependency injection

The last piece of the sign-in puzzle is to integrate the storage to the&nbsp;<code>useSignIn</code>&nbsp;hook. To achieve this the hook must be able to access token storage instance we have initialized in the&nbsp;<code>App</code>&nbsp;component. React&nbsp;<a href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noreferrer noopener">Context</a>&nbsp;is just the tool we need for the job. Create a directory&nbsp;<em>contexts</em>&nbsp;in the&nbsp;<em>src</em>&nbsp;directory. In that directory create a file&nbsp;<em>AuthStorageContext.js</em>&nbsp;with the following content:

```js
import { createContext } from 'react';

const AuthStorageContext = createContext();

export default AuthStorageContext;
```

Now we can use the&nbsp;<code>AuthStorageContext.Provider</code>&nbsp;to provide the storage instance to the descendants of the context. Let's add it to the&nbsp;<code>App</code>&nbsp;component:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext'; // HIGHLIGHT LINE

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () =&gt; {
  return (
    &lt;&gt;
      &lt;StatusBar style="light" /&gt;
      &lt;NativeRouter&gt;
        &lt;ApolloProvider client={apolloClient}&gt;
          &lt;AuthStorageContext.Provider value={authStorage}&gt; // HIGHLIGHT LINE
            &lt;Main /&gt;
          &lt;/AuthStorageContext.Provider&gt; // HIGHLIGHT LINE
        &lt;/ApolloProvider&gt;
      &lt;/NativeRouter&gt;
    &lt;/&gt;
  );
};

export default App;
```

Accessing the storage instance in the&nbsp;<code>useSignIn</code>&nbsp;hook is now possible using the React's&nbsp;<a href="https://react.dev/reference/react/useContext" target="_blank" rel="noreferrer noopener">useContext</a>&nbsp;hook like this:

```js
// ...
import { useContext } from 'react'; // HIGHLIGHT LINE

import AuthStorageContext from '../contexts/AuthStorageContext';
const useSignIn = () =&gt; {
  const authStorage = useContext(AuthStorageContext);  // ...
};
```

Note that accessing a context's value using the&nbsp;<code>useContext</code>&nbsp;hook only works if the&nbsp;<code>useContext</code>&nbsp;hook is used in a component that is a&nbsp;<em>descendant</em>&nbsp;of the&nbsp;<a href="https://react.dev/reference/react/createContext#provider" target="_blank" rel="noreferrer noopener">Context.Provider</a>&nbsp;component.

Accessing the&nbsp;<code>AuthStorage</code>&nbsp;instance with&nbsp;<code>useContext(AuthStorageContext)</code>&nbsp;is quite verbose and reveals the details of the implementation. Let's improve this by implementing a&nbsp;<code>useAuthStorage</code>&nbsp;hook in a&nbsp;<em>useAuthStorage.js</em>&nbsp;file in the&nbsp;<em>hooks</em>&nbsp;directory:

```js
import { useContext } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () =&gt; {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;
```

The hook's implementation is quite simple but it improves the readability and maintainability of the hooks and components using it. We can use the hook to refactor the&nbsp;<code>useSignIn</code>&nbsp;hook like this:

```js
// ...
import useAuthStorage from '../hooks/useAuthStorage'; // HIGHLIGHT LINE

const useSignIn = () =&gt; {
  const authStorage = useAuthStorage();  // ...
};
```

The ability to provide data to component's descendants opens tons of use cases for React Context, as we already saw in the&nbsp;<a href="https://fullstackopen.com/en/part6/react_query_use_reducer_and_the_context" target="_blank" rel="noreferrer noopener">last chapter</a>&nbsp;of part 6.

To learn more about these use cases, read Kent C. Dodds' enlightening article <a href="https://kentcdodds.com/blog/how-to-use-react-context-effectively" target="_blank" rel="noreferrer noopener">How to use React Context effectively</a> to find out how to combine the <a href="https://react.dev/reference/react/useReducer" target="_blank" rel="noreferrer noopener">useReducer</a> hook with the context to implement state management. You might find a way to use this knowledge in the upcoming exercises.

<div class="tasks">

**15. Storing the access token step2**

</div>

<div class="tasks">

**16. Sign out**

</div>
