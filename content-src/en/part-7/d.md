---
part: 7
letter: d
title: "Miscellaneous"
mainImage: /images/part-7.svg
lang: en
---
### Class Components

During the course, we have only used React components defined as JavaScript functions. This was not possible without the <a href="https://reactjs.org/docs/hooks-intro.html" target="_blank" rel="noopener">hook</a> functionality that came with version 16.8 of React, which was released in 6th February 2019. Before, when defining a component that uses state, one had to define it using JavaScript's <a href="https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class" target="_blank" rel="noopener">Class</a> syntax.

It is beneficial to at least be familiar with Class Components to some extent, since the world still contains a lot of old React code, which will probably never be completely rewritten using the updated syntax.

Let's get to know the main features of Class Components by producing yet another very familiar anecdote application. We store the anecdotes in the file&nbsp;<em>db.json</em>&nbsp;using&nbsp;<em>json-server</em>. The contents of the file are taken from&nbsp;<a href="https://github.com/fullstack-hy/misc/blob/master/anecdotes.json" target="_blank" rel="noopener">here</a>.

The initial version of the Class Component looks like this

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
      &lt;/div&gt;
    )
  }
}

export default App
```

The component now has a&nbsp;<a href="https://react.dev/reference/react/Component#constructor" target="_blank" rel="noopener">constructor</a>, in which nothing happens at the moment, and contains the method&nbsp;<a href="https://react.dev/reference/react/Component#render" target="_blank" rel="noopener">render</a>. As one might guess, render defines how and what is rendered to the screen.

Let's define a state for the list of anecdotes and the currently-visible anecdote. In contrast to when using the&nbsp;<a href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">useState</a>&nbsp;hook, Class Components only contain one state. So if the state is made up of multiple "parts", they should be stored as properties of the state. The state is initialized in the constructor:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // BEGIN HIGHLIGHT
    this.state = {
      anecdotes: [],
      current: 0
    }
    // END HIGHLIGHT
  }

  render() {
  // BEGIN HIGHLIGHT
    if (this.state.anecdotes.length === 0) {
      return &lt;div&gt;no anecdotes...&lt;/div&gt;
    }
  // END HIGHLIGHT

    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
        // BEGIN HIGHLIGHT
        &lt;div&gt;
          {this.state.anecdotes[this.state.current].content}
        &lt;/div&gt;
        &lt;button&gt;next&lt;/button&gt;
        // END HIGHLIGHT
      &lt;/div&gt;
    )
  }
}
```

The component state is in the instance variable <em>this.state</em>. The state is an object having two properties. <em>this.state.anecdotes</em> is the list of anecdotes and <em>this.state.current</em> is the index of the currently shown anecdote.

> You may wonder what the <em>this</em> in the code refers to. In JavaScript, the value of <em>this</em> depends on how a function is called. Inside a class method like this one, it refers to the component instance, giving access to the instance's state and methods. Read more <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">here</a>.

In Functional components, the right place for fetching data from a server is inside an&nbsp;<a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">effect hook</a>, which is executed when a component renders or less frequently if necessary, e.g. only in combination with the first render.

The&nbsp;<a href="https://react.dev/reference/react/Component#adding-lifecycle-methods-to-a-class-component" target="_blank" rel="noopener">lifecycle methods</a>&nbsp;of Class Components offer corresponding functionality. The correct place to trigger the fetching of data from a server is inside the lifecycle method&nbsp;<a href="https://react.dev/reference/react/Component#componentdidmount" target="_blank" rel="noopener">componentDidMount</a>, which is executed once right after the first time a component renders:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // BEGIN HIGHLIGHT
  componentDidMount = () =&gt; {
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      this.setState({ anecdotes: response.data })
    })
  }
  // END HIGHLIGHT

  // ...
}
```

The callback function of the HTTP request updates the component state using the method&nbsp;<a href="https://react.dev/reference/react/Component#setstate" target="_blank" rel="noopener">setState</a>. The method only touches the keys that have been defined in the object passed to the method as an argument. The value for the key&nbsp;<em>current</em>&nbsp;remains unchanged.

Calling the method setState always triggers the rerender of the Class Component, i.e. calling the method&nbsp;<em>render</em>.

We'll finish off the component with the ability to change the shown anecdote. The following is the code for the entire component with the addition highlighted:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () =&gt; {
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      this.setState({ anecdotes: response.data })
    })
  }

  // BEGIN HIGHLIGHT
  handleClick = () =&gt; {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // END HIGHLIGHT

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return &lt;div&gt;no anecdotes...&lt;/div&gt;
    }

    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
        &lt;div&gt;{this.state.anecdotes[this.state.current].content}&lt;/div&gt;
        // BEGIN HIGHLIGHT
        &lt;button onClick={this.handleClick}&gt;next&lt;/button&gt;
        // END HIGHLIGHT
      &lt;/div&gt;
    )
  }
}
```

For comparison, here is the same application as a Functional component:

```js
const App = () =&gt; {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =&gt;{
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () =&gt; {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return &lt;div&gt;no anecdotes...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      &lt;h1&gt;anecdote of the day&lt;/h1&gt;
      &lt;div&gt;{anecdotes[current].content}&lt;/div&gt;
      &lt;button onClick={handleClick}&gt;next&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

In the case of our example, the differences were minor. The biggest difference between Functional components and Class components is mainly that the state of a Class component is a single object, and that the state is updated using the method&nbsp;<em>setState</em>, while in Functional components the state can consist of multiple different variables, with all of them having their own update function.

In 2026, Class Components are largely a historical artifact. All modern React development uses Functional components with hooks, and there is no rational reason to reach for a Class component when writing new code. The React documentation itself treats Class components as a legacy API.

### Error boundary

Even though Class Components are largely obsolete, there is one situation where you still cannot avoid them:&nbsp;<a href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary" target="_blank" rel="noopener">error boundaries</a>. An error boundary is a component that catches JavaScript errors anywhere in its child component tree and displays a fallback UI instead of crashing the whole application. As of 2026, React has not yet introduced a hook-based alternative for this, so error boundaries must still be implemented as Class components.

An error boundary looks like this:

```js
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        &lt;div&gt;
          &lt;h2&gt;Something went wrong.&lt;/h2&gt;
          &lt;p&gt;{this.state.error.message}&lt;/p&gt;
          &lt;button onClick={() =&gt; this.setState({ hasError: false, error: null })}&gt;
            try again
          &lt;/button&gt;
        &lt;/div&gt;
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

The two key lifecycle methods are&nbsp;<em>getDerivedStateFromError</em>, which updates state so the next render shows the fallback UI, and&nbsp;<em>componentDidCatch</em>, which is a good place to log the error to an error reporting service.

You can wrap any part of your component tree with an error boundary to contain failures to that subtree:

```js
const App = () =&gt; {
  return (
    &lt;div&gt;
      &lt;ErrorBoundary&gt;
        &lt;Notes /&gt;
      &lt;/ErrorBoundary&gt;
      &lt;ErrorBoundary&gt;
        &lt;Persons /&gt;
      &lt;/ErrorBoundary&gt;
    &lt;/div&gt;
  )
}
```

If&nbsp;<em>Notes</em>&nbsp;throws an error, only that section shows the fallback.&nbsp;<em>Persons</em>&nbsp;continues to work normally.

Because this is the one remaining use case for Class components, many projects use the&nbsp;<a href="https://github.com/bvaughn/react-error-boundary" target="_blank" rel="noopener">react-error-boundary</a>&nbsp;library, which wraps the class-based machinery behind a convenient Functional component API so you never have to write a Class component yourself.

### Frontend and backend in the same repository

During the course, we created the frontend and backend as separate repositories. However, we did the deployment <a href="https://fullstackopen.com//en/part3/deploying_app_to_internet#serving-static-files-from-the-backend" target="_blank" rel="noopener">copying</a> the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately.

Quite often the entire application is put into a single repository. A common and clean way to do this with a modern stack is to keep the Vite frontend in a <em>client</em> directory and the Express backend in a <em>server</em> directory, each with their own <em>package.json</em>. The root of the repository gets a third <em>package.json</em> that acts as a convenience wrapper with scripts to run both together.

A minimal layout of such a&nbsp;<a href="https://github.com/fullstack-hy2020/monorepo" target="_blank" rel="noopener">repository</a>&nbsp;looks like this:

```
app/
  package.json        (root, scripts only)
  client/
    package.json      (Vite + React)
    vite.config.js
    src/
      App.jsx
  server/
    package.json      (Express)
    index.js
```

The Express server in&nbsp;<em>server/index.js</em>&nbsp;serves the API and, in production, also serves the built frontend from the&nbsp;<em>client/dist</em>&nbsp;directory:

```js
const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

app.get('/api/ping', (req, res) =&gt; {
  res.json({ message: 'pong', time: new Date().toISOString() })
})

// serve the built Vite frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) =&gt; {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () =&gt; console.log(`server running on port ${PORT}`))
```

> What about the /*splat
>
> Writing <em>app.get('/*splat', handler)</em> creates a catch-all route that matches any path (e.g. <em>/</em>, <em>/about</em>, <em>/foo/bar</em>).
>
> This route matters for a React app using a router (e.g. React Router): when a user reloads or directly opens a URL like <em>/notes</em> or <em>/notes/5</em> that request goes to the server first, not React. Without this catch-all, Express would return a 404 since no such route exists. By sending <em>index.html</em> for every unmatched path instead, React loads and its router takes over, rendering the correct page client-side.

During development, the Vite dev server runs on its own port and needs to forward API requests to Express. This is configured in&nbsp;<em>client/vite.config.js</em>:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

With the proxy in place, a frontend fetch to&nbsp;<em>/api/ping</em>&nbsp;is automatically forwarded to the Express server during development, so you never have to hard-code the backend URL.

The root&nbsp;<em>package.json</em>&nbsp;ties everything together with a couple of scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

There are couple things interesting here.

The&nbsp;<em>dev</em>&nbsp;script uses&nbsp;<a href="https://github.com/open-cli-tools/concurrently" target="_blank" rel="noopener">concurrently</a>, a small utility that runs multiple commands at the same time and merges their output into a single terminal stream. Without it you would have to open two separate terminals, one for the backend and one for the frontend.

The&nbsp;<em>--prefix</em>&nbsp;flag tells npm which subdirectory to treat as the working directory for that command, so&nbsp;<em>npm run dev --prefix server</em>&nbsp;is equivalent to&nbsp;<em>cd server &amp;&amp; npm run dev</em>.

Running&nbsp;<em>npm run dev</em>&nbsp;from the root therefore starts both the Vite dev server and Express in parallel with a single command. In this mode, Vite serves the frontend with hot module replacement: when you edit a React component, the browser updates instantly without a full page reload. The Express server runs separately and the Vite proxy forwards&nbsp;<em>/api</em>&nbsp;requests to it.

Running&nbsp;<em>npm run build</em>&nbsp;compiles the frontend into the&nbsp;<em>client/dist</em>&nbsp;directory. After that,&nbsp;<em>npm start</em>&nbsp;sets&nbsp;<em>NODE_ENV=production</em>&nbsp;and starts Express, which picks up the static files from&nbsp;<em>client/dist</em>&nbsp;and serves both the API and the frontend from a single port. This is the setup you would use when deploying to a server.

Because each part of the project has its own&nbsp;<em>package.json</em>, you need to be explicit about which one you are targeting when installing new packages. The same&nbsp;<em>--prefix</em>&nbsp;flag works for&nbsp;<em>npm install</em>&nbsp;as well:

```bash
npm install axios --prefix client     # add to the frontend
npm install mongoose --prefix server  # add to the backend
```

Alternatively, you can simply&nbsp;<em>cd</em>&nbsp;into the directory and run&nbsp;<em>npm install</em>&nbsp;from there as you normally would.

### Organization of code in React application

In most applications during this course, we followed the convention of placing components in a&nbsp;<em>components</em>&nbsp;directory, hooks in&nbsp;<em>hooks</em>, and server communication code in&nbsp;<em>services</em>. For the BlogList app that might look like this:

```
src/
  App.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

This flat, type-based grouping works well for small applications.

When the app uses routing, it is common to add a&nbsp;<em>pages</em>&nbsp;directory (sometimes called&nbsp;<em>views</em>) for the top-level route components, keeping reusable UI components in&nbsp;<em>components</em>. This convention is used by frameworks such as&nbsp;<a href="https://nextjs.org/docs/pages/building-your-application/routing" target="_blank" rel="noopener">Next.js</a>&nbsp;and is described in the&nbsp;<a href="https://legacy.reactjs.org/docs/faq-structure.html" target="_blank" rel="noopener">React FAQ on file structure</a>:

```
src/
  App.jsx
  pages/
    HomePage.jsx
    BlogPage.jsx
    UserPage.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

As the codebase grows further, however, a change to a single feature may still touch files scattered across every directory, and both&nbsp;<em>components</em>&nbsp;and&nbsp;<em>pages</em>&nbsp;can become hard to navigate.

A common response to this is to group files by&nbsp;<em>feature</em>&nbsp;instead. The&nbsp;<a href="https://feature-sliced.design/" target="_blank" rel="noopener">Feature-Sliced Design</a>&nbsp;methodology formalises this approach, and the&nbsp;<a href="https://github.com/alan2207/bulletproof-react" target="_blank" rel="noopener">bulletproof-react</a>&nbsp;project is a widely-referenced example of applying it in practice:

```
src/
  App.jsx
  features/
    blogs/
      Blog.jsx
      BlogList.jsx
      blogService.js
      blogStore.js
    users/
      UserList.jsx
      userService.js
    notifications/
      Notification.jsx
      notificationStore.js
  hooks/
    useField.js
```

Everything related to blogs lives together, so adding or changing a feature means working in one place rather than several. There is no single correct way to organize a larger project, and the right choice depends on the size and nature of the application.

### Changes on the server

The applications we build during this course fetch data from the server when the page loads and after user actions, but they have no way of learning about changes made by other users. If a fellow user adds a new blog post, our frontend simply does not know about it until the page is refreshed. How can we keep the UI in sync with a server that changes independently?

The simplest approach is&nbsp;<a href="https://en.wikipedia.org/wiki/Polling_(computer_science)" target="_blank" rel="noopener">polling</a>: the frontend repeatedly asks the server for fresh data at a fixed interval, for example using&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval" target="_blank" rel="noopener">setInterval</a>. Polling is easy to implement but wasteful, because most requests return nothing new.

A cleaner alternative is&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener">WebSockets</a>, which open a persistent two-way connection between the browser and the server. The server can then push updates to connected clients the moment something changes, without the client having to ask. WebSockets are now supported by all modern browsers.

Working directly with the WebSocket API can be cumbersome. The&nbsp;<a href="https://socket.io/" target="_blank" rel="noopener">Socket.io</a>&nbsp;library wraps it with a higher-level API and adds automatic reconnection and other conveniences.

In <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql" target="_blank" rel="noopener">part 8</a> we look at GraphQL, which includes a subscription mechanism that lets the server notify clients about data changes in a structured way.

### React/node-application security

So far during the course, we have not touched on information security much. We do not have much time for this now either, but fortunately, the University of Helsinki has an open online course <a href="https://cybersecuritybase.mooc.fi/module-2.1" target="_blank" rel="noopener">Securing Software</a> for this important topic.

We will, however, take a look at some things specific to this course.

The Open Web Application Security Project, otherwise known as&nbsp;<a href="https://www.owasp.org/" target="_blank" rel="noopener">OWASP</a>, publishes an annual list of the most common security risks in Web applications. The most recent list can be found&nbsp;<a href="https://owasp.org/Top10/" target="_blank" rel="noopener">here</a>. The same risks can be found from one year to another.

At the top of the list, we find&nbsp;<em>injection</em>, which means that e.g. text sent using a form in an application is interpreted completely differently than the software developer had intended. The most famous type of injection is probably&nbsp;<a href="https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work" target="_blank" rel="noopener">SQL injection</a>.

For example, imagine that the following SQL query is executed in a vulnerable application:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

Now let's assume that a malicious user&nbsp;<em>Arto Hellas</em>&nbsp;would define their name as

```
Arto Hell-as'; DROP TABLE Users; --
```

so that the name would contain a single quote&nbsp;<code>'</code>, which is the beginning and end character of a SQL string. As a result of this, two SQL operations would be executed, the second of which would destroy the database table&nbsp;<em>Users</em>:

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```

SQL injections are prevented using&nbsp;<a href="https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f" target="_blank" rel="noopener">parameterized queries</a>. With them, user input isn't mixed with the SQL query, but the database itself inserts the input values at placeholders in the query (usually&nbsp;<code>?</code>):

```
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

Injection attacks are also possible in NoSQL databases. However, Mongoose prevents them by <a href="https://zanon.io/posts/nosql-injection-in-mongodb" target="_blank" rel="noopener">sanitizing</a> the queries. More on the topic can be found e.g. <a href="https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html" target="_blank" rel="noopener">here</a>.

<em>Cross-site scripting (XSS)</em>&nbsp;is an attack where it is possible to inject malicious JavaScript code into a legitimate web application. The malicious code would then be executed in the browser of the victim. If we try to inject the following into e.g. the notes application:

```
&lt;script&gt;
  alert('Evil XSS attack')
&lt;/script&gt;
```

the code is not executed, but is only rendered as 'text' on the page:

![صورة توضيحية](/images/mooc/fd536001df05.webp)

since React&nbsp;<a href="https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks" target="_blank" rel="noopener">takes care of sanitizing data in variables</a>. Some versions of React&nbsp;<a href="https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1" target="_blank" rel="noopener">have been vulnerable</a>&nbsp;to XSS attacks. The security holes have of course been patched, but there is no guarantee that there couldn't be any more.

One needs to remain vigilant when using libraries; if there are security updates to those libraries, it is advisable to update those libraries in one's applications. Security updates for Express are found in the&nbsp;<a href="https://expressjs.com/en/advanced/security-updates.html" target="_blank" rel="noopener">library's documentation</a>&nbsp;and the ones for Node are found in&nbsp;<a href="https://nodejs.org/en/blog/vulnerability/" target="_blank" rel="noopener">this blog</a>.

You can check how up-to-date your dependencies are using the command

```bash
npm outdated --depth 0
```

The one-year-old project that is used in <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">part 9</a> of this course already has quite a few outdated dependencies:

![صورة توضيحية](/images/mooc/2c1de14c3b41.webp)

The dependencies can be brought up to date by updating the file&nbsp;<em>package.json</em>. The best way to do that is by using a tool called&nbsp;<em>npm-check-updates</em>. It can be installed globally by running the command:

```bash
npm install -g npm-check-updates
```

Using this tool, the up-to-dateness of dependencies is checked in the following way:

```
$ npm-check-updates
Checking ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run ncu -u to upgrade package.json
```

The file&nbsp;<em>package.json</em>&nbsp;is brought up to date by running the command&nbsp;<em>ncu -u</em>.

```
$ ncu -u
Upgrading ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run npm install to install new versions.
```

Then it is time to update the dependencies by running the command&nbsp;<em>npm install</em>. However, old versions of the dependencies are not necessarily a security risk.

The npm&nbsp;<a href="https://docs.npmjs.com/cli/audit" target="_blank" rel="noopener">audit</a>&nbsp;command can be used to check the security of dependencies. It compares the version numbers of the dependencies in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.

Running&nbsp;<em>npm audit</em>&nbsp;on the same project, it prints a long list of complaints and suggested fixes. Below is a part of the report:

```bash
$ patientor npm audit

... many lines removed ...

url-parse  &lt;1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

After only one year, the code is full of small security threats. Luckily, there are only 2 critical threats. Let's run&nbsp;<em>npm audit fix</em>&nbsp;as the report suggests:

```
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

62 threats remain because, by default,&nbsp;<em>audit fix</em>&nbsp;does not update dependencies if their&nbsp;<em>major</em>&nbsp;version number has increased. Updating these dependencies could lead to the whole application breaking down.

The source for the critical bug is the library&nbsp;<a href="https://github.com/immerjs/immer" target="_blank" rel="noopener">immer</a>

```
immer  &lt;9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

Running&nbsp;<em>npm audit fix --force</em>&nbsp;would upgrade the library version but would also upgrade the library&nbsp;<em>react-scripts</em>&nbsp;and that would potentially break down the development environment. So we will leave the library upgrades for later...

A modern Node/React project can easily depend, directly and transitively, on hundreds or even thousands of packages published by people the developer has never met. This is exactly what makes <a href="https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html">supply chain attacks possible</a>: instead of attacking an application directly, an attacker compromises one of the dependencies it relies on, and the malicious code then gets pulled into every project that installs that dependency.

There are several common ways this happens:
- A maintainer's npm account gets hijacked (e.g. through a phishing email or a leaked, unprotected access token) and a malicious version of an otherwise trustworthy package is published
- a package's <em>postinstall</em> script or the code itself is modified to quietly steal environment variables, tokens or SSH keys during <em>npm install</em>
- A malicious package is published under a name that closely resembles a popular one, hoping developers will misspell a command and install it by mistake
- A project relies on an unmaintained dependency whose ownership is transferred to a new, malicious maintainer.

Since the code of a compromised dependency runs with the same privileges as the rest of the application (and, during installation, often with the privileges of the developer's own machine or CI pipeline), the consequences can be severe: stolen credentials, backdoored production builds, or exfiltrated user data.

A few practical ways to reduce the risk:
- Keep the number of dependencies as small as reasonable; every added package is an added attack surface.
- Commit the lock file (<em>package-lock.json</em>) and use <em>npm ci</em> instead of <em>npm install</em> in CI/production environments, so that the exact previously verified dependency versions and their integrity hashes are used.
- Run <em>npm audit</em> (or an equivalent) regularly, and let tools such as <a href="https://docs.github.com/en/code-security/dependabot">Dependabot</a> or <a href="https://docs.renovatebot.com">Renovate</a> open pull requests automatically when new versions are released.
- Be extra careful when adding a brand-new dependency: check how actively it is maintained, how many other projects depend on it, and whether the package name is exactly the one intended.
- Consider disabling the execution of install scripts for dependencies you don't fully trust, e.g. with <em>npm install --ignore-scripts</em>.
- Avoid installing a package version the moment it is published. Most malicious releases are caught and unpublished within the first hours or days, so a short delay filters out a large share of them. Starting from npm version 11.10.0, this can be enforced with the <a href="https://docs.npmjs.com/cli/v11/using-npm/config/#min-release-age">min-release-age</a> <em>.npmrc</em> setting (given in days), which makes npm ignore any version that isn't old enough yet.

None of these steps make an application immune to supply chain attacks, but together they significantly shrink the window in which a compromised dependency can do damage before it is noticed.

One of the threats mentioned in the list from OWASP is&nbsp;<em>Broken Authentication</em>&nbsp;and the related&nbsp;<em>Broken Access Control</em>. The token-based authentication we have been using is fairly robust if the application is being used on the traffic-encrypting HTTPS protocol. When implementing access control, one should e.g. remember to not only check a user's identity in the browser but also on the server. Bad security would be to prevent some actions to be taken only by hiding the execution options in the code of the browser.

On Mozilla's MDN, there is a very good <a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security" target="_blank" rel="noopener">Website security guide</a>, which brings up this very important topic:

![صورة توضيحية](/images/mooc/c9144f9afa62.webp)

The documentation for Express includes a section on security:&nbsp;<a href="https://expressjs.com/en/advanced/best-practice-security.html" target="_blank" rel="noopener">Production Best Practices: Security</a>, which is worth a read. It is also recommended to add a library called&nbsp;<a href="https://helmetjs.github.io/" target="_blank" rel="noopener">Helmet</a>&nbsp;to the backend. It includes a set of middleware that eliminates some security vulnerabilities in Express applications.

Using the ESlint&nbsp;<a href="https://github.com/nodesecurity/eslint-plugin-security" target="_blank" rel="noopener">security-plugin</a>&nbsp;is also worth doing.

### Current trends

Finally, let's take a look at some technology of tomorrow (or, actually, already today), and the directions in which Web development is heading.

#### Typed versions of JavaScript

The <a href="https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing" target="_blank" rel="noopener">dynamic typing</a> of JavaScript can lead to subtle bugs that are only discovered at runtime. The course used to cover <a href="https://legacy.reactjs.org/docs/typechecking-with-proptypes.html" target="_blank" rel="noopener">PropTypes</a> as a way to add runtime type checks to component props, but PropTypes have largely fallen out of use as the ecosystem has moved toward <a href="https://en.wikipedia.org/wiki/Type_system#Static_type_checking" target="_blank" rel="noopener">static type checking</a>.

<a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>, developed by Microsoft, has become the de facto standard for typed JavaScript. It catches type errors at compile time rather than at runtime, provides excellent editor tooling, and is now used by the majority of new React projects. TypeScript is covered in <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">part 9</a>.

#### Server-side rendering and React Server Components

React components do not have to run in the browser. They can also be rendered on the&nbsp;<a href="https://react.dev/reference/react-dom/server" target="_blank" rel="noopener">server</a>, which sends ready-made HTML to the client instead of a blank page that JavaScript must fill in. This&nbsp;<em>server-side rendering</em>&nbsp;(SSR) improves perceived load time and is important for Search Engine Optimization (SEO), since search engine crawlers see fully rendered content without having to execute JavaScript.

The more recent and significant development is <a href="https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components" target="_blank" rel="noopener">React Server Components</a> (RSC), introduced in React 18 and now a core part of the React architecture. A Server Component runs exclusively on the server and is never sent to the browser as JavaScript. It can read directly from a database or file system, keep secrets out of the client bundle, and stream its output to the browser. The browser receives these components as rendered data, not as executable code. <em>Client Components</em>, annotated with<em>'use client', still run in the browser and handle interactivity as before. In an RSC application,</em> most components are Server Components by default, with Client Components used only where user interaction is needed.

<a href="https://nextjs.org/" target="_blank" rel="noopener">Next.js</a> has become the standard framework for building React applications that require server-side behaviour. Its App Router (introduced in Next.js 13) is built around React Server Components and provides file-based routing, nested layouts, server actions for mutating data, and built-in support for static generation and incremental static regeneration. In 2026, Next.js is the first choice for any React project where SSR, SEO, or full-stack capabilities matter. <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs"> 14</a> <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">Part 14</a> of the course covers Next.js.

#### Microservice architecture

During this course, we have only scratched the surface of the server end of things. In our applications, we had a&nbsp;<em>monolithic</em>&nbsp;backend, meaning one application making up a whole and running on a single server, serving only a few API endpoints.

As the application grows, the monolithic backend approach starts turning problematic both in terms of performance and maintainability.

A&nbsp;<a href="https://martinfowler.com/articles/microservices.html" target="_blank" rel="noopener">microservice architecture</a>&nbsp;(microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice's purpose is to take care of a particular logical functional whole. In a pure microservice architecture, the services do not use a shared database.

For example, the bloglist application could consist of two services: one handling the user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs.

The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure:

![صورة توضيحية](/images/mooc/71c89f34e7a7.webp)

The role of the frontend (enclosed by a square in the picture) does not differ much between the two models. There is often a so-called&nbsp;<a href="http://microservices.io/patterns/apigateway" target="_blank" rel="noopener">API gateway</a>&nbsp;between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server" API.&nbsp;<a href="https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19" target="_blank" rel="noopener">Netflix</a>, among others, uses this type of approach.

Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos:

> All teams will henceforth expose their data and functionality through service interfaces.
>
> Teams must communicate with each other through these interfaces.
>
> There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.
>
> It doesn’t matter what technology you use.
>
> All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.
>
> No exceptions.
>
> Anyone who doesn’t do this will be fired. Thank you; have a nice day!

Nowadays, one of the biggest forerunners in the use of microservices is&nbsp;<a href="https://www.infoq.com/presentations/netflix-chaos-microservices" target="_blank" rel="noopener">Netflix</a>.

The use of microservices has steadily been gaining hype to be kind of a&nbsp;<a href="https://en.wikipedia.org/wiki/No_Silver_Bullet" target="_blank" rel="noopener">silver bullet</a>&nbsp;of today, which is being offered as a solution to almost every kind of problem. However, there are several challenges when it comes to applying a microservice architecture, and it might make sense to go&nbsp;<a href="https://martinfowler.com/bliki/MonolithFirst.html" target="_blank" rel="noopener">monolith first</a>&nbsp;by initially making a traditional all-encompassing backend. Or maybe&nbsp;<a href="https://martinfowler.com/articles/dont-start-monolith.html" target="_blank" rel="noopener">not</a>. There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right.

Unfortunately, we cannot dive deeper into this important topic during this course. Even a cursory look at the topic would require at least 5 more weeks.

#### Serverless

After the release of Amazon's&nbsp;<a href="https://aws.amazon.com/lambda/" target="_blank" rel="noopener">lambda</a>&nbsp;service at the end of 2014, a new trend started to emerge in web application development:&nbsp;<a href="https://serverless.com/" target="_blank" rel="noopener">serverless</a>.

The main thing about lambda, and nowadays also Google's&nbsp;<a href="https://cloud.google.com/functions/" target="_blank" rel="noopener">Cloud functions</a>&nbsp;as well as&nbsp;<a href="https://azure.microsoft.com/en-us/services/functions/" target="_blank" rel="noopener">similar functionality in Azure</a>, is that it enables&nbsp;<em>the execution of individual functions</em>&nbsp;in the cloud. Before, the smallest executable unit in the cloud was a single&nbsp;<em>process</em>, e.g. a runtime environment running a Node backend.

E.g. Using Amazon's&nbsp;<a href="https://aws.amazon.com/api-gateway/" target="_blank" rel="noopener">API gateway</a>&nbsp;it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually, the functions already operate using stored data in the databases of the cloud service.

Serverless is not about there not being a server in applications, but about how the server is defined. Software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating a well-scaling system, e.g. Amazon's Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc.

### Useful libraries and further reading

The JavaScript developer community has produced a large variety of useful libraries. Before writing something from scratch it is always worth checking whether a well-maintained solution already exists.

You can take advantage of your React know-how when developing mobile applications using <a href="https://reactnative.dev/" target="_blank" rel="noopener">React Native</a>, which is the topic of <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native" target="_blank" rel="noopener">part 10</a> of the course.

The course itself continues beyond part 7: <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql" target="_blank" rel="noopener">part 8</a> covers GraphQL, <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">part 9</a> TypeScript, <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native" target="_blank" rel="noopener">part 10</a> React Native, <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration" target="_blank" rel="noopener">part 11</a> CI/CD, <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers" target="_blank" rel="noopener">part 12</a> containers, <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">part 13</a> use of SQL databases and <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">part 14</a> Next.js. The full course contents are listed on the <a href="https://fullstackopen.com/en/#course-contents" target="_blank" rel="noopener">course page</a>.

The following external resources are good places to go deeper on React patterns, code quality, and the broader ecosystem:
- <a href="https://www.patterns.dev/" target="_blank" rel="noopener">Patterns.dev</a> covers modern React and JavaScript patterns in depth. For a curated collection of React-specific techniques, <a href="https://vasanthk.gitbooks.io/react-bits/" target="_blank" rel="noopener">React bits</a> is a useful companion.
- <a href="https://overreacted.io/" target="_blank" rel="noopener">Overreacted</a> is the blog of Dan Abramov, one of the original React core team members. The articles go deep into React's design decisions and mental models, and are worth reading even when they are a few years old.
- <a href="https://kentcdodds.com/blog" target="_blank" rel="noopener">Kent C. Dodds</a> writes extensively about React best practices, testing, and component design. His posts on testing philosophy in particular have shaped how the community thinks about frontend tests.
- <a href="https://alexkondov.com/tao-of-react/" target="_blank" rel="noopener">Tao of React</a> is a short, opinionated guide to structuring React applications that covers components, state, props, and project layout in a pragmatic way.
- <a href="https://www.reactiflux.com/" target="_blank" rel="noopener">Reactiflux</a> is a large React developer community on Discord, and a good place to ask questions after the course ends. Many open-source libraries maintain their own channels there.
