---
part: 10
letter: e
title: "Testing and extending our application"
mainImage: /images/part-10.svg
lang: en
---
Now that we have established a good foundation for our project, it is time to start expanding it. In this section you can put to use all the React Native knowledge you have gained so far. Along with expanding our application we will cover some new areas, such as testing, and additional resources.

## Testing React Native applications

To start testing code of any kind, the first thing we need is a testing framework, which we can use to run a set of test cases and inspect their results. For testing a JavaScript application,&nbsp;<a href="https://jestjs.io/" target="_blank" rel="noreferrer noopener">Jest</a>&nbsp;is a popular candidate for such testing framework. For testing an Expo based React Native application with Jest, Expo provides a set of Jest configuration in a form of&nbsp;<a href="https://github.com/expo/expo/tree/master/packages/jest-expo" target="_blank" rel="noreferrer noopener">jest-expo</a>&nbsp;preset. Let's get started by installing the packages:

```bash
npx expo install jest-expo jest @types/jest --dev
```

To use the jest-expo preset in Jest, we need to add the following&nbsp;<a href="https://docs.expo.dev/develop/unit-testing/#additional-configuration-for-using-transformignorepatterns" target="_blank" rel="noreferrer noopener">Jest configuration</a>&nbsp;to the&nbsp;<em>package.json</em>&nbsp;file along with the&nbsp;<em>test</em>&nbsp;script:

```json
{
  // ...
  "scripts": {
    // other scripts...
    "test": "jest" // HIGHLIGHT LINE
  },
  // BEGIN HIGHLIGHT
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-router-native)"
    ]
  }
  // END HIGHLIGHT
  // ...
}
```

We also need a bit of configuration so that VS Code can suggest appropriate matchers for the&nbsp;<code>expect</code>&nbsp;keyword, for example. This can be done by creating a&nbsp;<em>jsconfig.json</em>&nbsp;file in the root of the project with the following content:

```json
{
  "compilerOptions": {
    "checkJs": false,
    "types": ["jest"]
  }
}
```

In order to use ESLint in the Jest's test files, we also need the&nbsp;<a href="https://www.npmjs.com/package/eslint-plugin-jest" target="_blank" rel="noreferrer noopener">eslint-plugin-jest</a>&nbsp;plugin for ESLint. Let's install it:

```bash
npm install eslint-plugin-jest --save-dev
```

To use the eslint-plugin-jest plugin, we need to enable it in the&nbsp;<em>eslint.config.js</em>&nbsp;file:

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginJest = require('eslint-plugin-jest'); // HIGHLIGHT LINE

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // BEGIN HIGHLIGHT
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    ...pluginJest.configs['flat/recommended'],
  },
  // END HIGHLIGHT
]);
```

To see that the setup is working, create a directory&nbsp;<em>__tests__</em>&nbsp;in the&nbsp;<em>src</em>&nbsp;directory and in the created directory create a file&nbsp;<em>example.test.js</em>. In that file, add this simple test:

```
describe('Example', () =&gt; {
  it('works', () =&gt; {
    expect(1).toBe(1);
  });
});
```

Now, let's run our example test by running&nbsp;<code>npm test</code>. The command's output should indicate that the test located in the&nbsp;<em>src/__tests__/example.test.js</em>&nbsp;file is passed.

## Organizing tests

Organizing test files in a single&nbsp;<em>__tests__</em>&nbsp;directory is one approach in organizing the tests. When choosing this approach, it is recommended to put the test files in their corresponding subdirectories just like the code itself. This means that for example tests related to components are in the&nbsp;<em>components</em>&nbsp;directory, tests related to utilities are in the&nbsp;<em>utils</em>&nbsp;directory, and so on. This will result in the following structure:

```
src/
  __tests__/
    components/
      AppBar.js
      RepositoryList.js
      ...
    utils/
      authStorage.js
      ...
    ...
```

Another approach is to organize the tests near the implementation. This means that for example, the test file containing tests for the&nbsp;<code>AppBar</code>&nbsp;component is in the same directory as the component's code. This will result in the following structure:

```
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
    ...
  ...
```

In this example, the component's code is in the&nbsp;<em>index.jsx</em>&nbsp;file and the test in the&nbsp;<em>AppBar.test.jsx</em>&nbsp;file. Note that in order for Jest to find your test files you either have to put them into a&nbsp;<em>__tests__</em>&nbsp;directory, use the&nbsp;<em>.test</em>&nbsp;or&nbsp;<em>.spec</em>&nbsp;suffix, or&nbsp;<a href="https://jestjs.io/docs/en/configuration#testmatch-arraystring" target="_blank" rel="noreferrer noopener">manually configure</a>&nbsp;the global patterns.

## Testing components

Now that we have managed to set up Jest and run a very simple test, it is time to find out how to test components. As we know, testing components requires a way to serialize a component's render output and simulate firing different kind of events, such as pressing a button. For these purposes, there is the&nbsp;<a href="https://testing-library.com/docs/intro" target="_blank" rel="noreferrer noopener">Testing Library</a>&nbsp;family, which provides libraries for testing user interface components in different platforms. All of these libraries share similar API for testing user interface components in a user-centric way.

In&nbsp;<a href="https://fullstackopen.com/en/part5/testing_react_apps" target="_blank" rel="noreferrer noopener">part 5</a>&nbsp;we got familiar with one of these libraries, the&nbsp;<a href="https://testing-library.com/docs/react-testing-library/intro" target="_blank" rel="noreferrer noopener">React Testing Library</a>. Unfortunately, this library is only suitable for testing React web applications. Luckily, there exists a React Native counterpart for this library, which is the&nbsp;<a href="https://callstack.github.io/react-native-testing-library/" target="_blank" rel="noreferrer noopener">React Native Testing Library</a>. This is the library we will be using while testing our React Native application's components. The good news is, that these libraries share a very similar API, so there aren't too many new concepts to learn. Let's install&nbsp;<em>@testing-library/react-native</em>&nbsp;library to our project:

```bash
npx expo install @testing-library/react-native --dev
```

> <strong>NB:</strong>&nbsp;If the installation fails due to peer dependency issues, try installing the react-test-renderer library explicitly with&nbsp;<code>--legacy-peer-deps</code>&nbsp;flag:
>
> <code>npm install --save-dev --legacy-peer-deps --save-exact react-test-renderer@19.2.0 @testing-library/react-native</code>
>
> Make sure that the react-test-renderer version matches the project's React version in the&nbsp;<code>npm install</code>&nbsp;command above. You can check the React version by running&nbsp;<code>npm list react --depth=0</code>.

The main concepts of the React Native Testing Library are the&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api/queries" target="_blank" rel="noreferrer noopener">queries</a>&nbsp;and&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/events/fire-event" target="_blank" rel="noreferrer noopener">firing events</a>. Queries are used to extract a set of nodes from the component that is rendered using the&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/render" target="_blank" rel="noreferrer noopener">render</a>&nbsp;function. Queries are useful in tests where we expect for example some text, such as the name of a repository, to be present in the rendered component. Here's an example how to use the&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/queries/#by-text" target="_blank" rel="noreferrer noopener">ByText</a>&nbsp;query to check if the component's&nbsp;<code>Text</code>&nbsp;element has the correct textual content:

```js
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const Greeting = ({ name }) =&gt; {
  return (
    &lt;View&gt;
      &lt;Text&gt;Hello {name}!&lt;/Text&gt;
    &lt;/View&gt;
  );
};

describe('Greeting', () =&gt; {
  it('renders a greeting message based on the name prop', () =&gt; {
    render(&lt;Greeting name="Kalle" /&gt;);

    screen.debug();

    expect(screen.getByText('Hello Kalle!')).toBeDefined();
  });
});
```

Tests use the object&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/screen" target="_blank" rel="noreferrer noopener">screen</a>&nbsp;to do the queries to the rendered component.

We acquire the&nbsp;<code>Text</code>&nbsp;node containing certain text by using the&nbsp;<code>getByText</code>&nbsp;function. The Jest matcher&nbsp;<a href="https://jestjs.io/docs/expect#tobedefined" target="_blank" rel="noreferrer noopener">toBeDefined</a>&nbsp;is used to ensure that the query has found the element.

React Native Testing Library's documentation has some good hints on&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/guides/how-to-query" target="_blank" rel="noreferrer noopener">how to query different kinds of elements</a>. Another guide worth reading is Kent C. Dodds article&nbsp;<a href="https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change" target="_blank" rel="noreferrer noopener">Making your UI tests resilient to change</a>.

The object&nbsp;<code>screen</code>&nbsp;also has a helper method&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/screen#debug" target="_blank" rel="noreferrer noopener">debug</a>&nbsp;that prints the rendered React tree in a user-friendly format. Use it if you are unsure what the React tree rendered by the&nbsp;<code>render</code>&nbsp;function looks like.

For all available queries, check the React Native Testing Library's&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api/queries" target="_blank" rel="noreferrer noopener">documentation</a>. The full list of available React Native specific matchers can be found in the&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/jest-matchers" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;of the React Native Testing Library. Jest's&nbsp;<a href="https://jestjs.io/docs/en/expect" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;contains every universal Jest matcher.

The second very important React Native Testing Library concept is firing events. We can fire an event in a provided node by using the&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api#fireevent" target="_blank" rel="noreferrer noopener">fireEvent</a>&nbsp;object's methods. This is useful for example typing text into a text field or pressing a button. Here is an example of how to test submitting a simple form:

```js
import { useState } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';

const Form = ({ onSubmit }) =&gt; {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () =&gt; {
    onSubmit({ username, password });
  };

  return (
    &lt;View&gt;
      &lt;View&gt;
        &lt;TextInput
          value={username}
          onChangeText={(text) =&gt; setUsername(text)}
          placeholder="Username"
        /&gt;
      &lt;/View&gt;
      &lt;View&gt;
        &lt;TextInput
          value={password}
          onChangeText={(text) =&gt; setPassword(text)}
          placeholder="Password"
        /&gt;
      &lt;/View&gt;
      &lt;View&gt;
        &lt;Pressable onPress={handleSubmit}&gt;
          &lt;Text&gt;Submit&lt;/Text&gt;
        &lt;/Pressable&gt;
      &lt;/View&gt;
    &lt;/View&gt;
  );
};

describe('Form', () =&gt; {
  it('calls function provided by onSubmit prop after pressing the submit button', () =&gt; {
    const onSubmit = jest.fn();
    render(&lt;Form onSubmit={onSubmit} /&gt;);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // onSubmit.mock.calls[0][0] contains the first argument of the first call
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

In this test, we want to test that after filling the form's fields using the&nbsp;<code>fireEvent.changeText</code>&nbsp;method and pressing the submit button using the&nbsp;<code>fireEvent.press</code>&nbsp;method, the&nbsp;<code>onSubmit</code>&nbsp;callback function is called correctly. To inspect whether the&nbsp;<code>onSubmit</code>&nbsp;function is called and with which arguments, we can use a&nbsp;<a href="https://jestjs.io/docs/en/mock-function-api" target="_blank" rel="noreferrer noopener">mock function</a>. Mock functions are functions with preprogrammed behavior such as a specific return value. In addition, we can create expectations for the mock functions such as "expect the mock function to have been called once". The full list of available expectations can be found in the Jest's&nbsp;<a href="https://jestjs.io/docs/en/expect" target="_blank" rel="noreferrer noopener">expect documentation</a>.

Before heading further into the world of testing React Native applications, play around with these examples by adding a test file in the&nbsp;<em>__tests__</em>&nbsp;directory we created earlier.

## Handling dependencies in tests

Components in the previous examples are quite easy to test because they are more or less&nbsp;<em>pure</em>. Pure components don't depend on&nbsp;<em>side effects</em>&nbsp;such as network requests or using some native API such as the AsyncStorage. The&nbsp;<code>Form</code>&nbsp;component is much less pure than the&nbsp;<code>Greeting</code>&nbsp;component because its state changes can be counted as a side effect. Nevertheless, testing it isn't too difficult.

Next, let's have a look at a strategy for testing components with side effects. Let's pick the&nbsp;<code>RepositoryList</code>&nbsp;component from our application as an example. At the moment the component has one side effect, which is a GraphQL query for fetching the reviewed repositories. The current implementation of the&nbsp;<code>RepositoryList</code>&nbsp;component looks something like this:

```js
const RepositoryList = () =&gt; {
  const { repositories } = useRepositories();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

The only side effect is the use of the&nbsp;<code>useRepositories</code>&nbsp;hook, which sends a GraphQL query. There are a few ways to test this component. One way is to mock the Apollo Client's responses as instructed in the Apollo Client's&nbsp;<a href="https://www.apollographql.com/docs/react/development-testing/testing/" target="_blank" rel="noreferrer noopener">documentation</a>. A more simple way is to assume that the&nbsp;<code>useRepositories</code>&nbsp;hook works as intended (preferably through testing it) and extract the components "pure" code into another component, such as the&nbsp;<code>RepositoryListContainer</code>&nbsp;component:

```js
export const RepositoryListContainer = ({ repositories }) =&gt; {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
    /&gt;
  );
};

const RepositoryList = () =&gt; {
  const { repositories } = useRepositories();

  return &lt;RepositoryListContainer repositories={repositories} /&gt;;
};

export default RepositoryList;
```

Now, the <code>RepositoryList</code> component contains only the side effects and its implementation is quite simple. We can test the <code>RepositoryListContainer</code> component by providing it with paginated repository data through the <code>repositories</code> prop and checking that the rendered content has the correct information.

<div class="tasks">

**17. Testing the reviewed repositories list**

</div>

<div class="tasks">

**18. Testing the sign in form**

</div>

## Extending our application

It is time to put everything we have learned so far to good use and start extending our application. Our application still lacks a few important features such as reviewing a repository and registering a user. The upcoming exercises will focus on these essential features.

<div class="tasks">

**19. The single repository view**

</div>

<div class="tasks">

**20. Repository's review list**

</div>

<div class="tasks">

**21. The review form**

</div>

<div class="tasks">

**22. The sign up form**

</div>

<div class="tasks">

**23. Sorting the reviewed repositories list**

</div>

<div class="tasks">

**24. Filtering the reviewed repositories list**

</div>

####

<div class="tasks">

**25. The user's reviews view**

</div>

####

<div class="tasks">

**26. Review actions**

</div>

## Cursor-based pagination

When an API returns an ordered list of items from some collection, it usually returns a subset of the whole set of items to reduce the required bandwidth and to decrease the memory usage of the client applications. The desired subset of items can be parameterized so that the client can request for example the first twenty items on the list after some index. This technique is commonly referred to as&nbsp;<em>pagination</em>. When items can be requested after a certain item defined by a&nbsp;<em>cursor</em>, we are talking about&nbsp;<em>cursor-based pagination</em>.

So cursor is just a serialized presentation of an item in an ordered list. Let's have a look at the paginated repositories returned by the&nbsp;<code>repositories</code>&nbsp;query using the following query:

```
{
  repositories(first: 2) {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

The&nbsp;<code>first</code>&nbsp;argument tells the API to return only the first two repositories. Here's an example of a result of the query:

```json
{
  "data": {
    "repositories": {
      "totalCount": 10,
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js",
            "createdAt": "2020-05-15T11:59:57.557Z"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        },
        {
          "node": {
            "id": "zeit.swr",
            "fullName": "zeit/swr",
            "createdAt": "2020-05-15T11:58:53.867Z"
          },
          "cursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10="
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "startCursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd",
        "hasNextPage": true
      }
    }
  }
}
```

The format of the result object and the arguments are based on the&nbsp;<a href="https://relay.dev/graphql/connections.htm" target="_blank" rel="noreferrer noopener">Relay's GraphQL Cursor Connections Specification</a>, which has become a quite common pagination specification and has been widely adopted for example in the&nbsp;<a href="https://docs.github.com/en/graphql" target="_blank" rel="noreferrer noopener">GitHub's GraphQL API</a>. In the result object, we have the&nbsp;<code>edges</code>&nbsp;array containing items with&nbsp;<code>node</code>&nbsp;and&nbsp;<code>cursor</code>&nbsp;attributes. As we know, the&nbsp;<code>node</code>&nbsp;contains the repository itself. The&nbsp;<code>cursor</code>&nbsp;on the other hand is a Base64 encoded representation of the node. In this case, it contains the repository's id and date of repository's creation as a timestamp. This is the information we need to point to the item when they are ordered by the creation time of the repository. The&nbsp;<code>pageInfo</code>&nbsp;contains information such as the cursor of the first and the last item in the array.

Let's say that we want to get the next set of items&nbsp;<em>after</em>&nbsp;the last item of the current set, which is the "zeit/swr" repository. We can set the&nbsp;<code>after</code>&nbsp;argument of the query as the value of the&nbsp;<code>endCursor</code>&nbsp;like this:

```
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

Now that we have the next two items and we can keep on doing this until the&nbsp;<code>hasNextPage</code>&nbsp;has the value&nbsp;<code>false</code>, meaning that we have reached the end of the list. To dig deeper into cursor-based pagination, read Shopify's article&nbsp;<a href="https://shopify.engineering/pagination-relative-cursors" target="_blank" rel="noreferrer noopener">Pagination with Relative Cursors</a>. It provides great details on the implementation itself and the benefits over the traditional index-based pagination.

## Infinite scrolling

Vertically scrollable lists in mobile and desktop applications are commonly implemented using a technique called&nbsp;<em>infinite scrolling</em>. The principle of infinite scrolling is quite simple:
- Fetch the initial set of items
- When the user reaches the last item, fetch the next set of items after the last item

The second step is repeated until the user gets tired of scrolling or some scrolling limit is exceeded. The name "infinite scrolling" refers to the way the list seems to be infinite - the user can just keep on scrolling and new items keep on appearing on the list.

Let's have a look at how this works in practice using the Apollo Client's&nbsp;<code>useQuery</code>&nbsp;hook. Apollo Client has a great&nbsp;<a href="https://www.apollographql.com/docs/react/pagination/cursor-based/" target="_blank" rel="noreferrer noopener">documentation</a>&nbsp;on implementing the cursor-based pagination. Let's implement infinite scrolling for the reviewed repositories list as an example.

First, we need to know when the user has reached the end of the list. Luckily, the&nbsp;<code>FlatList</code>&nbsp;component has a prop&nbsp;<a href="https://reactnative.dev/docs/virtualizedlist#onendreached" target="_blank" rel="noreferrer noopener">onEndReached</a>, which will call the provided function once the user has scrolled to the last item on the list. You can change how early the&nbsp;<code>onEndReached</code>&nbsp;callback is called using the&nbsp;<a href="https://reactnative.dev/docs/virtualizedlist#onendreachedthreshold" target="_blank" rel="noreferrer noopener">onEndReachedThreshold</a>&nbsp;prop. Alter the&nbsp;<code>RepositoryList</code>&nbsp;component's&nbsp;<code>FlatList</code>&nbsp;component so that it logs a message to the console once the end of the list is reached:

```js
export const RepositoryListContainer = ({
  repositories,
  onEndReached, // HIGHLIGHT LINE
  /* ... */,
}) =&gt; {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
      // BEGIN HIGHLIGHT
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      // END HIGHLIGHT
    /&gt;
  );
};

const RepositoryList = () =&gt; {
  // ...

  const { repositories } = useRepositories(/* ... */);

  return (
    &lt;RepositoryListContainer
      repositories={repositories}
      onEndReached={() =&gt; console.log('End of the list reached');} // HIGHLIGHT LINE
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

Try scrolling to the end of the reviewed repositories list and you should see the message in the logs.

Next, we need to fetch more repositories once the end of the list is reached. This can be achieved using the&nbsp;<a href="https://www.apollographql.com/docs/react/pagination/core-api/#the-fetchmore-function" target="_blank" rel="noreferrer noopener">fetchMore</a>&nbsp;function provided by the&nbsp;<code>useQuery</code>&nbsp;hook. To describe to Apollo Client how to merge the existing repositories in the cache with the next set of repositories, we can use a&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/" target="_blank" rel="noreferrer noopener">field policy</a>. In general, field policies can be used to customize the cache behavior during read and write operations with&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function" target="_blank" rel="noreferrer noopener">read</a>&nbsp;and&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function" target="_blank" rel="noreferrer noopener">merge</a>&nbsp;functions.

Let's add a field policy for the&nbsp;<code>repositories</code>&nbsp;query in the&nbsp;<em>apolloClient.js</em>&nbsp;file:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities'; // HIGHLIGHT LINE

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

// BEGIN HIGHLIGHT
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
  },
});
// END HIGHLIGHT

const createApolloClient = authStorage =&gt; {
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
    cache, // HIGHLIGHT LINE
  });
};

export default createApolloClient;
```

As mentioned earlier, the format of the pagination's result object and the arguments are based on the Relay's pagination specification. Luckily, Apollo Client provides a predefined field policy,&nbsp;<code>relayStylePagination</code>, which can be used in this case.

Next, let's alter the&nbsp;<code>useRepositories</code>&nbsp;hook so that it returns a decorated&nbsp;<code>fetchMore</code>&nbsp;function, which calls the actual&nbsp;<code>fetchMore</code>&nbsp;function with appropriate arguments so that we can fetch the next set of repositories:

```js
const useRepositories = (variables) =&gt; {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {  // HIGHLIGHT LINE
    variables,
    // ...
  });

  // BEGIN HIGHLIGHT
  const handleFetchMore = () =&gt; {
    const canFetchMore = !loading &amp;&amp; data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };
  // END HIGHLIGHT

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,  // HIGHLIGHT LINE
    loading,
    ...result,
  };
};
```

Make sure you have the&nbsp;<code>pageInfo</code>&nbsp;and the&nbsp;<code>cursor</code>&nbsp;fields in your&nbsp;<code>repositories</code>&nbsp;query as described in the pagination examples. You will also need to include the&nbsp;<code>after</code>&nbsp;and&nbsp;<code>first</code>&nbsp;arguments for the query.

The&nbsp;<code>handleFetchMore</code>&nbsp;function will call the Apollo Client's&nbsp;<code>fetchMore</code>&nbsp;function if there are more items to fetch, which is determined by the&nbsp;<code>hasNextPage</code>&nbsp;property. We also want to prevent fetching more items if fetching is already in process. In this case,&nbsp;<code>loading</code>&nbsp;will be&nbsp;<code>true</code>. In the&nbsp;<code>fetchMore</code>&nbsp;function we are providing the query with an&nbsp;<code>after</code>&nbsp;variable, which receives the latest&nbsp;<code>endCursor</code>&nbsp;value.

The last step is to pass the&nbsp;<code>fetchMore</code>&nbsp;function as the value of the&nbsp;<code>onEndReached</code>&nbsp;prop:

```js
const RepositoryList = () =&gt; {
  // ...

  const { repositories, fetchMore } = useRepositories({  // HIGHLIGHT LINE
    first: 5, // HIGHLIGHT LINE
    // ...
  });

  return (
    &lt;RepositoryListContainer
      repositories={repositories}
      onEndReached={fetchMore}  // HIGHLIGHT LINE
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

Use a relatively small <code>first</code> argument value such as 5 while trying out the infinite scrolling. This way you don't need to review too many repositories. If the list contains so few repositories that the end of the list is already close or visible, <code>fetchMore</code> may be called immediately when the view is loaded or it may not fire until the user scrolls. If this causes problems during testing, you can get around this issue by increasing the value of <code>first</code> argument. Once you are confident that the infinite scrolling is working, feel free to use a larger value for the <code>first</code> argument.

<div class="tasks">

**27. OPTIONAL: Infinite scrolling for the repository's reviews list**

</div>

## Sharing the application with a QR code

So far, we have only developed the application locally on our own machine and tested it on our own phone or emulator. But what if we wanted to let other people test the application as well, so that someone else could try it on their own phone?

Expo provides a ready-made solution for this.&nbsp;<a href="https://expo.dev/services" target="_blank" rel="noreferrer noopener">Expo Application Services</a>&nbsp;(EAS) is Expo's cloud service that provides tools for building, updating, and distributing applications.&nbsp;<a href="https://docs.expo.dev/eas-update/introduction/" target="_blank" rel="noreferrer noopener">EAS Update</a>&nbsp;is a free service that allows you to publish your application to Expo's servers. A unique QR code is generated for each published version, and with it anyone can open the application with their Expo Go app.

Let's now deploy the final version of the application to Expo's servers. You will need an Expo account to use the service. If you do not have one, create an account at&nbsp;<a href="https://expo.dev/signup" target="_blank" rel="noreferrer noopener">https://expo.dev/signup</a>.

Log in to your Expo account from the command line:

```bash
npx eas-cli@latest login
```

Next, configure the repository as an EAS project:

```bash
npx eas-cli@latest update:configure
```

The&nbsp;<code>update:configure</code>&nbsp;command connects the project to Expo's EAS service and adds the required configuration to the&nbsp;<em>app.json</em>&nbsp;file.

The initial setup is now complete. However, one detail still needs attention. In order to work, the application needs the&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api" target="_blank" rel="noreferrer noopener">Rate Repository API</a>, which acts as the application's backend and database. Because it is a completely separate application from the React Native frontend, it would normally need to be deployed somewhere separately.

For the final exercises of this part, the course provides a pre-deployed Rate Repository API at <a href="https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi" target="_blank" rel="noopener">https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi</a>. This is the same Rate Repository API that we have used locally in previous exercises. The API functionality is the same as before, and the database has been seeded with a few users and repositories according to the instructions in the Rate Repository API <a href="https://github.com/fullstack-hy2020/rate-repository-api?tab=readme-ov-file#-getting-started" target="_blank" rel="noreferrer noopener">README</a>.

The API is now running in production mode, meaning that the environment variable NODE_ENV is set to production. This has some practical consequences. For example, Apollo Sandbox does not automatically know the API schema. The database used by the Rate Repository API is also reset regularly without prior warning, so during local development you should still use a locally running Rate Repository API.

Create an environment variable named&nbsp;<code>EXPO_PUBLIC_APOLLO_URI</code>&nbsp;for the EAS project and set its value to the URL of the pre-deployed Rate Repository API with the following command:

```bash
npx eas-cli@latest env:create --name EXPO_PUBLIC_APOLLO_URI --value https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi/ --environment preview --visibility plaintext
```
- The environment variable is created in an environment named <code>preview</code>, which is intended specifically for this kind of application testing.
- The visibility of the environment variable is set to <code>plaintext</code>, because the value is not particularly secret.

We are now ready to deploy the application to Expo's servers. The deployment is done with the following command:

```bash
npx eas-cli@latest update --branch main --environment preview --message "The first deploy"
```
- EAS Update makes it possible to group updates into different branches. In our case, the <code>--branch</code> option specifies that the update is published to a branch named <code>main</code>.
- Thanks to the <code>--environment</code> option, our application gets access to the <code>preview</code> environment and the <code>EXPO_PUBLIC_APOLLO_URI</code> environment variable that we defined earlier.
- The <code>--message</code> option sets an arbitrary message for the update so that it can be distinguished from other updates.

When the update has been published, the command line will finally print a link to the EAS Dashboard page for the deployment. The dashboard includes a&nbsp;<em>Preview</em>&nbsp;button that shows a QR code leading to the application. When the QR code is scanned with the Expo Go app, the application should open on the phone and work with the external Rate Repository API. In other words, the repository list should load, it should be possible to create new users in the application and sign in with existing credentials, and so on.

If you want to make changes to the application, it is enough to run the latest&nbsp;<code>npx eas-cli@latest update</code>&nbsp;command again to publish a new update. Note that each published update gets its own unique QR code.

Using EAS Update makes it easier to demonstrate the progress of application development to others, because there is no need to share source code, build installation packages, or publish anything to an app store. The deployment process stays simple while still allowing the application to be tested on real devices.

<div class="tasks">

**28. Publishing the app via EAS Publish**

</div>

## Additional resources

As we are getting closer to the end of this part, let's take a moment to look at some additional React Native related resources.&nbsp;<a href="https://github.com/jondot/awesome-react-native" target="_blank" rel="noreferrer noopener">Awesome React Native</a>&nbsp;is an extremely encompassing curated list of React Native resources such as libraries, tutorials, and articles. Because the list is exhaustively long, let's have a closer look at few of its highlights

### React Native Paper

> Paper is a collection of customizable and production-ready components for React Native, following Google’s Material Design guidelines.

<a href="https://callstack.github.io/react-native-paper/" target="_blank" rel="noreferrer noopener">React Native Paper</a>&nbsp;is for React Native what&nbsp;<a href="https://material-ui.com/" target="_blank" rel="noreferrer noopener">Material-UI</a>&nbsp;is for React web applications. It offers a wide range of high-quality UI components, support for&nbsp;<a href="https://callstack.github.io/react-native-paper/docs/guides/theming/" target="_blank" rel="noreferrer noopener">custom themes</a>&nbsp;and a fairly simple&nbsp;<a href="https://callstack.github.io/react-native-paper/docs/guides/getting-started" target="_blank" rel="noreferrer noopener">setup</a>&nbsp;for Expo based React Native applications.

### Styled-components

> Utilising tagged template literals and the power of CSS, styled-components allows you to write actual CSS code to style your components. It also removes the mapping between components and styles – using components as a low-level styling construct could not be easier!

<a href="https://styled-components.com/" target="_blank" rel="noreferrer noopener">Styled-components</a>&nbsp;is a library for styling React components using&nbsp;<a href="https://en.wikipedia.org/wiki/CSS-in-JS" target="_blank" rel="noreferrer noopener">CSS-in-JS</a>&nbsp;technique. In React Native we are already used to defining component's styles as a JavaScript object, so CSS-in-JS is not so uncharted territory. However, the approach of styled-components is quite different from using the&nbsp;<code>StyleSheet.create</code>&nbsp;method and the&nbsp;<code>style</code>&nbsp;prop.

In styled-components components' styles are defined with the component using a feature called&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates" target="_blank" rel="noreferrer noopener">tagged template literal</a>&nbsp;or a plain JavaScript object. Styled-components makes it possible to define new style properties for component based on its props&nbsp;<em>at runtime</em>. This brings many possibilities, such as seamlessly switching between a light and a dark theme. It also has a full&nbsp;<a href="https://styled-components.com/docs/advanced#theming" target="_blank" rel="noreferrer noopener">theming support</a>. Here is an example of creating a&nbsp;<code>Text</code>&nbsp;component with style variations based on props:

```js
import styled from 'styled-components/native';
import { css } from 'styled-components';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =&gt;
    isBlue &amp;&amp;
    css`
      color: blue;
    `}

  ${({ isBig }) =&gt;
    isBig &amp;&amp;
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Main = () =&gt; {
  return (
    &lt;&gt;
      &lt;FancyText&gt;Simple text&lt;/FancyText&gt;
      &lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
      &lt;FancyText isBig&gt;Big text&lt;/FancyText&gt;
      &lt;FancyText isBig isBlue&gt;
        Big blue text
      &lt;/FancyText&gt;
    &lt;/&gt;
  );
};
```

Because styled-components processes the style definitions, it is possible to use CSS-like snake case syntax with the property names and units in property values. However, units don't have any effect because property values are internally unitless. For more information on styled-components, head out to the&nbsp;<a href="https://styled-components.com/docs" target="_blank" rel="noreferrer noopener">documentation</a>.

### React-spring

> react-spring is a spring-physics based animation library that should cover most of your UI related animation needs. It gives you tools flexible enough to confidently cast your ideas into moving interfaces.

<a href="https://www.react-spring.dev/" target="_blank" rel="noreferrer noopener">React-spring</a>&nbsp;is a library that provides a clean&nbsp;<a href="https://www.react-spring.dev/docs/getting-started" target="_blank" rel="noreferrer noopener">API</a>&nbsp;for animating React Native components.

### React Navigation

> Routing and navigation for your React Native apps

<a href="https://reactnavigation.org/" target="_blank" rel="noreferrer noopener">React Navigation</a> is a routing library for React Native. It shares some similarities with the React Router library we have been using during this and earlier parts. However, unlike React Router, React Navigation offers more native features such as native gestures and animations to transition between views.

## Closing words

That's it, our application is ready. Good job! We have learned many new concepts during our journey such as setting up our React Native application using Expo, using React Native's core components and adding style to them, communicating with the server, and testing React Native applications.

The final piece of the puzzle would be to deploy the application to the Apple App Store and Google Play Store. This is entirely <em>optional</em>. In case you decide to try it, you first need to create either iOS or Android builds by following Expo's <a href="https://docs.expo.dev/build/setup/" target="_blank" rel="noreferrer noopener">documentation</a>. Then you can upload these builds to either Apple App Store or Google Play Store. Expo has <a href="https://docs.expo.dev/submit/introduction/" target="_blank" rel="noreferrer noopener">documentation</a> for this as well.

<div class="tasks">

**29. Your GitHub repository**

</div>
