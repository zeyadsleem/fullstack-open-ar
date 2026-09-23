---
part: 7
letter: c
title: "Vite internals and esbuild"
mainImage: /images/part-7.svg
lang: en
---
In the early days, React was somewhat famous for being very difficult to configure the tools required for application development. To make the situation easier <a href="https://github.com/facebookincubator/create-react-app" target="_blank" rel="noopener">Create React App</a> was developed, which eliminated configuration-related problems. <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a>, that is used throughout this course, has since replaced Create React App as the standard tool for new React applications.

Both Vite and Create React App use&nbsp;<em>bundlers</em>&nbsp;to do the actual work. In this section we will take a closer look at what bundlers actually do, how Vite works under the hood, and how to configure it for different scenarios. We will also briefly examine&nbsp;<a href="https://esbuild.github.io/" target="_blank" rel="noopener">esbuild</a>, a low-level bundler that Vite itself uses internally, understanding esbuild helps clarify what bundling fundamentally means.

> What about Webpack?
>
> Webpack was the dominant bundler for most of the 2010s and is still encountered in older and enterprise codebases. This course also covered Webpack until spring 2026.
>
> If you work on a legacy project, knowing that Webpack exists and uses the same core concepts (entry points, loaders/plugins, output) is useful. However, setting up a new project with Webpack in 2026 is not recommended. Its configuration is complex, and modern tools like Vite provide a dramatically better developer experience. We will not cover Webpack configuration in this course.

### Bundling

We have implemented our applications by dividing our code into separate modules that have been&nbsp;<em>imported</em>&nbsp;to places that require them. Even though ES6 modules are defined in the ECMAScript standard, not all execution environments handle module-based code automatically. Even modern browsers benefit from having dependencies pre-processed and optimized before delivery.

For this reason, code that is divided into modules is&nbsp;<em>bundled</em>&nbsp;for production, meaning that the source code files are transformed and combined into an optimized set of files that the browser can efficiently load. When we ran&nbsp;<em>npm run build</em>&nbsp;in earlier parts of this course, Vite performed this bundling. The output appears in the&nbsp;<em>dist</em>&nbsp;directory:

```
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

The&nbsp;<em>index.html</em>&nbsp;at the root loads the bundled JavaScript with a&nbsp;<em>script</em>&nbsp;tag:

```
&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" type="image/svg+xml" href="/vite.svg" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;Vite + React&lt;/title&gt;
    // BEGIN HIGHLIGHT
    &lt;script type="module" crossorigin src="/assets/index-e92ae01e.js"&gt;&lt;/script&gt;
    // END HIGHLIGHT
    // BEGIN HIGHLIGHT
    &lt;link rel="stylesheet" href="/assets/index-d526a0c5.css"&gt;
    // END HIGHLIGHT
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

The CSS is also bundled into a single file.

In practice, bundling starts from an entry point, that is typically&nbsp;<em>main.jsx</em>. Vite includes not only the code from the entry point but also everything it imports, recursively, until the full dependency graph has been resolved.

Since part of the imported files are packages like React, React-router, and Axios, the bundled JavaScript file will also contain the contents of each of these libraries.

> Before bundlers were available, the old approach was based on the fact that the index.html file loaded all of the separate JavaScript files of the application with the help of script tags. This resulted in decreased performance, since the loading of each separate file results in some overhead. For this reason, these days the preferred method is to bundle the code into a single file. Bundling also enables optimizations like minification and tree-shaking (removing unused code).

### How Vite works

Vite has two distinct operating modes that work quite differently.

<strong>Development mode</strong>&nbsp;(<em>npm run dev</em>) doesn't bundle your code at all. Instead, Vite starts a dev server that serves your source files as native ES modules, letting the browser resolve imports directly. This is why startup is nearly instant regardless of project size. One exception: third-party dependencies from node_modules are pre-bundled by esbuild before the server starts. This handles two problems: many npm packages are still in CommonJS format (which browsers can't consume natively), and some libraries consist of hundreds of tiny internal files that would otherwise trigger hundreds of separate requests. esbuild converts and consolidates them, caches the result on disk, and subsequent starts are near-instant.

<strong>Production mode</strong> (<em>npm run build</em>) uses <a href="https://rollupjs.org/" target="_blank" rel="noopener">Rollup</a> for bundling, with <a href="https://esbuild.github.io/" data-type="link" data-id="https://esbuild.github.io/">esbuild</a> still handling other tasks such as transpilation (JSX, TypeScript) and minification. Rollup was designed from the ground up for ES modules, which makes it exceptionally good at <em>tree-shaking</em> that is a technique that statically analyzes which exports from each module are actually used and removes the rest from the final bundle. For example, if you import only one utility function from a large library, tree-shaking ensures that the rest of that library's code is not included in the bundle. This can significantly reduce bundle size.

The division of labor, esbuild for speed, Rollup for bundle quality, is central to Vite's design.

> You might wonder why Vite doesn't just use esbuild for production bundling too, given how fast it is. The reason is that esbuild's bundling output, while correct, produces less optimized results for advanced scenarios: it has limited support for code splitting, does not produce the same level of chunk optimization, and its plugin ecosystem for bundle-level transformations is still maturing. Rollup's output is more predictable and better tuned for the complex dependency graphs that real applications produce. Vite's authors&nbsp;<a href="https://vitejs.dev/guide/why.html#why-not-bundle-with-esbuild" target="_blank" rel="noopener">have stated</a>&nbsp;that they intend to switch to esbuild for production bundling once its capabilities close this gap.

### Understanding esbuild

To understand what bundling fundamentally involves, it is useful to work with&nbsp;<a href="https://esbuild.github.io/" target="_blank" rel="noopener">esbuild</a>&nbsp;directly, without the abstraction layer that Vite adds on top. Let us build a minimal React environment from scratch.

Next, we'll create a simple React app with the following directory structure:

```
├── dist
│   └── index.html
├── src
│   ├── main.jsx
│   └── App.jsx
└── package.json
```

We start by installing React and react-dom:

```bash
npm install react react-dom
```

We also need to install esbuild:

```bash
npm install --save-dev esbuild
```

At the start we add two scripts to the&nbsp;<em>package.json</em>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  },
  // ...
}
```

For the app we need the file&nbsp;<em>dist/index.html</em>&nbsp;that loads the JavaScript bundle:

```
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;esbuild app&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
    &lt;script src="./main.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

The entry point&nbsp;<em>src/main.jsx</em>&nbsp;is the typical one:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(&lt;App /&gt;)
```

The simple application component&nbsp;<em>src/App.jsx</em>&nbsp;is as follows:

```js
import React, { useState } from 'react'

const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;p&gt;count: {counter}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCounter(counter + 1)}&gt;increment&lt;/ button&gt;
    &lt;/div&gt;
  )
}

export default App
```

Now we can bundle the app:

```bash
npm run build
```

The output is a single&nbsp;<em>dist/main.js</em>&nbsp;that contains your application code along with the React library bundled together.

We can now run the bundled app with <em>npm run serve</em>. This uses the <a href="https://www.npmjs.com/package/serve" target="_blank" rel="noopener">serve</a> package to start a local static file server for the <em>dist</em> directory, making the application available at <em><a href="http://localhost:3000/" target="_blank" rel="noopener">http://localhost:3000</a></em>:

![صورة توضيحية](/images/mooc/2ccdf0013182.webp)

esbuild also supports&nbsp;<a href="https://en.wikipedia.org/wiki/Minification_(programming)" target="_blank" rel="noopener">minification</a>&nbsp;through command-line flags. Minification removes whitespace and comments, shortens variable names, and applies other size optimizations. The bundle will be notably large because it includes the full React library. Minification reduces its size significantly.

Let us now enable minification:

```json
{
  "scripts": {
    // BEGIN HIGHLIGHT
    "build": "esbuild src/main.jsx --bundle --minify --outfile=dist/main.js --jsx=automatic",
    // END HIGHLIGHT
    "serve": "npx serve dist"
  }
}
```

Minification brings the bundle size down from around 1.1 MB to around 190 KB, a substantial reduction.

Minification has a catch: if the application throws a runtime error, the browser's developer tools will point to a line in the minified <em>main.js</em>, which is all but impossible to read:

![صورة توضيحية](/images/mooc/c2c230177d6f.webp)

The solution is a&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Glossary/Source_map" target="_blank" rel="noopener">source map</a>: a companion file (<em>dist/main.js.map</em>) that records how every line of the minified bundle corresponds to the original source. With it enabled, a stack trace points to the exact line in&nbsp;<em>App.jsx</em>&nbsp;or&nbsp;<em>main.jsx</em>&nbsp;instead of somewhere inside an unreadable wall of minified code.

We can enable source maps by adding the&nbsp;<em>--sourcemap</em>&nbsp;flag:

```json
{
  "scripts": {
    // BEGIN HIGHLIGHT
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    // END HIGHLIGHT
    "serve": "npx serve dist"
  }
}
```

Now the error makes sense:

![صورة توضيحية](/images/mooc/2443fab4a586.webp)

Note that source maps are invaluable during development and debugging, but you may want to leave them out of a public production build. Because a source map contains your original source code, anyone who opens the browser's developer tools can read your unminified application logic. If that is a concern, simply omit the&nbsp;<em>--sourcemap</em>&nbsp;flag from the production build command.

### Transpilation

Alongside bundling, esbuild performs another essential task:&nbsp;<em>transpilation</em>. Transpilation means converting source code written in one form of JavaScript into another form, typically from modern or extended syntax into plain JavaScript that browsers can execute.

Browsers understand standard JavaScript, but JSX is not valid JavaScript, no browser can parse it directly. When we write:

```js
const element = &lt;App /&gt;
```

it must be transpiled into something the browser can run:

```js
const element = React.createElement(App, null)
```

This is why transpilation is a required step for any React project, not an optional optimization. esbuild performs it automatically during bundling. With the&nbsp;<em>--jsx=automatic</em>&nbsp;flag, esbuild handles JSX without any external tool. In the old Webpack-based workflow you had to install and configure&nbsp;<a href="https://babeljs.io/" target="_blank" rel="noopener">Babel</a>&nbsp;and related packages to transpile the JSX for the browser. With esbuild, files ending in&nbsp;<em>.jsx</em>&nbsp;are transpiled out of the box.

### Development environment

So far, every change requires running&nbsp;<em>npm run build</em>&nbsp;and manually refreshing the browser, a slow loop that quickly becomes tedious. esbuild's built-in&nbsp;<a href="https://esbuild.github.io/api/#serve" target="_blank" rel="noopener">development server</a>&nbsp;solves this. Add a&nbsp;<em>dev</em>&nbsp;script to&nbsp;<em>package.json</em>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    // BEGIN HIGHLIGHT
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch"
    // END HIGHLIGHT
  }
}
```

Running&nbsp;<em>npm run dev</em>&nbsp;does two things at once. Firstly&nbsp;<a href="https://esbuild.github.io/api/#watch" target="_blank" rel="noopener">--watch</a>&nbsp;tells esbuild to watch all imported source files for changes and rebuild the bundle automatically whenever any of them is saved. Secondly&nbsp;<a href="https://esbuild.github.io/api/#serve" target="_blank" rel="noopener">--servedir</a>&nbsp;starts a lightweight HTTP server that serves the contents of the&nbsp;<em>dist</em>&nbsp;directory, your&nbsp;<em>index.html</em>&nbsp;and the freshly built&nbsp;<em>main.js</em>&nbsp;at&nbsp;<em><a href="http://localhost:8000/" target="_blank" rel="noopener">http://localhost:8000</a></em>.

The&nbsp;<em>--servedir</em>&nbsp;flag is what makes both pieces work together: without it, esbuild would only rebuild in watch mode but not serve anything. With it, the server always delivers the latest bundle so you only need to refresh the browser after saving a file.

Note that unlike Vite's dev server, esbuild does not support hot module replacement. Changes to your source code require a manual browser refresh to take effect.

The clarity of esbuild's interface illustrates what a bundler fundamentally does: it takes an entry point, follows all imports, and produces an optimized output. Vite builds on top of this foundation and adds the developer experience layer, a dev server, hot module replacement, and sensible defaults for React projects.

Now that we have a clearer picture of what bundling and transpilation fundamentally involve, let us return to Vite and look at how it can be configured.

### Vite configuration

For most React projects, Vite works without any configuration at all. However, when you do need to customize behavior, you edit&nbsp;<em>vite.config.js</em>&nbsp;(or&nbsp;<em>vite.config.ts</em>).

A minimal Vite configuration for a React project looks like this:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

The&nbsp;<em>@vitejs/plugin-react</em>&nbsp;plugin enables JSX transformation, fast refresh (hot module replacement that preserves component state), and other React-specific features.

#### Development server configuration

You can configure the development server's port and other settings under the&nbsp;<em>server</em>&nbsp;key:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,        // open browser automatically
  },
})
```

#### Proxying API requests

When developing locally, your React app typically runs on one port (e.g., 3000) while your backend runs on another (e.g., 3001). The browser's same-origin policy would normally block requests between them. Vite's proxy setting solves this without requiring CORS configuration on the backend:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

With this configuration, any request your React app makes to&nbsp;<em>/api/notes</em>&nbsp;is automatically forwarded to&nbsp;<em><a href="http://localhost:3001/api/notes" target="_blank" rel="noopener">http://localhost:3001/api/notes</a></em>&nbsp;by Vite's dev server. Your frontend code never needs to include&nbsp;<em>localhost:3001</em>&nbsp;in its URLs during development.

#### Environment variables

Vite has built-in support for environment variables using&nbsp;<em>.env</em>&nbsp;files. This is the modern replacement for manually injecting constants into the bundle.

Create a&nbsp;<em>.env</em>&nbsp;file in the project root:

```
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

And a&nbsp;<em>.env.production</em>&nbsp;file for production values:

```
VITE_BACKEND_URL=https://myapp.fly.dev/api/notes
```

<strong>Important:</strong>&nbsp;all environment variables exposed to the browser must be prefixed with&nbsp;<em>VITE_</em>. Variables without this prefix remain server-side only and are not included in the bundle. This is a deliberate security measure to prevent accidentally leaking secrets.

Access the variable in your application code via&nbsp;<em>import.meta.env</em>:

```js
const App = () =&gt; {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    &lt;div&gt;
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    &lt;/div&gt;
  )
}
```

Vite automatically selects the correct&nbsp;<em>.env</em>&nbsp;file based on the mode:
- <em>npm run dev</em> uses <em>.env</em> and <em>.env.development</em>
- <em>npm run build</em> uses <em>.env</em> and <em>.env.production</em>

Add&nbsp;<em>.env.production</em>&nbsp;to&nbsp;<em>.gitignore</em>&nbsp;if it contains sensitive values, and use&nbsp;<em>.env.example</em>&nbsp;to document what variables are required.

#### Transpilation

Vite handles code transpilation automatically. During development, esbuild transpiles your TypeScript and JSX on demand. It is fast enough to do this per-file without a noticeable delay. During production builds, Rollup handles the bundling while esbuild handles transpilation.

The default transpilation target in Vite is modern browsers that support native ES modules (Chrome 87+, Firefox 78+, Safari 14+, Edge 88+). If you need to support older browsers, you can configure the target explicitly and add the&nbsp;<em>@vitejs/plugin-legacy</em>&nbsp;plugin:

```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

The legacy plugin automatically generates a separate bundle for older browsers using Babel.

#### CSS

Vite handles CSS without any configuration. Simply import a CSS file from your JavaScript:

```js
import './index.css'
```

Vite will process it and include it in the build. In production, CSS is extracted into a separate file. During development, it is injected via&nbsp;<em>&lt;style&gt;</em>&nbsp;tags with hot reload support.

Vite also natively supports&nbsp;<a href="https://github.com/css-modules/css-modules" target="_blank" rel="noopener">CSS Modules</a>&nbsp;for scoped styles. Any file ending in&nbsp;<em>.module.css</em>&nbsp;is treated as a CSS Module:

```js
import styles from './App.module.css'

const App = () =&gt; (
  &lt;div className={styles.container}&gt;
    hello vite
  &lt;/div&gt;
)
```

CSS preprocessors like&nbsp;<a href="https://sass-lang.com/" target="_blank" rel="noopener">Sass</a>&nbsp;can be added by simply installing the preprocessor, no plugin or configuration needed:

```bash
npm install --save-dev sass
```

After that,&nbsp;<em>.scss</em>&nbsp;files work automatically.

#### Minification

When running&nbsp;<em>npm run build</em>, Vite minifies the output. Minification removes whitespace and comments, shortens variable names, and applies other size optimizations. The result is a much smaller file that loads faster in the browser.

Vite uses esbuild for JavaScript minification and a built-in CSS minifier for stylesheets.

#### Source maps

Source maps allow browser developer tools to map errors and breakpoints back to your original source code rather than the minified bundle. Without them, a stack trace pointing to line 1 of&nbsp;<em>main.js</em>&nbsp;is nearly useless for debugging.

In development, Vite generates source maps automatically. For production builds, you can enable them explicitly:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

Note that production source maps increase build time and expose your source code to anyone who looks at the network tab. In many cases it is better to upload source maps to an error monitoring service (such as Sentry) and keep them off the public server.

#### Plugins

Vite's functionality is extended through&nbsp;<a href="https://vite.dev/plugins/" target="_blank" rel="noopener">plugins</a>. The plugin ecosystem has grown rapidly and covers most common needs. Some widely used plugins include:
- <em>@vitejs/plugin-react</em> — React support (JSX, fast refresh)
- <em>@vitejs/plugin-legacy</em> — legacy browser support
- <em>vite-plugin-svgr</em> — import SVG files as React components
- <em>rollup-plugin-visualizer</em> — bundle size analysis

Plugins are specified in the&nbsp;<em>plugins</em>&nbsp;array in&nbsp;<em>vite.config.js</em>. They follow the same interface as Rollup plugins, so many Rollup plugins also work with Vite.

#### Polyfills

A <em>polyfill</em> is code that implements a feature for browsers that do not natively support it. Transpilation alone is not sufficient for features that are syntactically valid but unimplemented. For example, an older browser might parse <em>Promise</em> correctly but have no implementation of it.

With Vite, polyfills are handled by the plugin&nbsp;<em>@vitejs/plugin-legacy</em>, which automatically includes the necessary polyfills based on your browser targets. If you need a specific polyfill without the legacy plugin, you can install it directly and import it at the top of your entry file.

You can check browser support for specific APIs at&nbsp;<a href="https://caniuse.com/" target="_blank" rel="noopener">https://caniuse.com</a>&nbsp;or&nbsp;<a href="https://developer.mozilla.org/" target="_blank" rel="noopener">Mozilla's MDN documentation</a>.
