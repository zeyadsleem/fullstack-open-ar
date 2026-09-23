---
part: 10
letter: c
title: "React Native basics"
mainImage: /images/part-10.svg
lang: en
---
Now that we have set up our development environment we can get into React Native basics and get started with the development of our application. In this section, we will learn how to build user interfaces with React Native's core components, how to add style properties to these core components, how to transition between views, and how to manage the form's state efficiently.

## Core components

In the previous parts, we have learned that we can use React to define components as functions, which receive props as an argument and returns a tree of React elements. This tree is usually represented with JSX syntax. In the browser environment, we have used the&nbsp;<a href="https://react.dev/reference/react-dom" target="_blank" rel="noreferrer noopener">ReactDOM</a>&nbsp;library to turn these components into a DOM tree that can be rendered by a browser. Here is a concrete example of a very simple component:

```js
const HelloWorld = props =&gt; {
  return &lt;div&gt;Hello world!&lt;/div&gt;;
};
```

The <code>HelloWorld</code> component returns a single <em>div</em> element which is created using the JSX syntax. We might remember that this JSX syntax is compiled into <code>React.createElement</code> method calls, such as this:

```
React.createElement('div', null, 'Hello world!');
```

This line of code creates a <em>div</em> element without any props and with a single child element which is a string <em>"Hello world"</em>. When we render this component into a root DOM element using the <code>render</code> method the <em>div</em> element will be rendered as the corresponding DOM element.

As we can see, React is not bound to a certain environment, such as the browser environment. Instead, there are libraries such as ReactDOM that can render&nbsp;<em>a set of predefined components</em>, such as DOM elements, in a specific environment. In React Native these predefined components are called&nbsp;<em>core components</em>.

<a href="https://reactnative.dev/docs/intro-react-native-components" target="_blank" rel="noreferrer noopener">Core components</a>&nbsp;are a set of components provided by React Native, which behind the scenes utilize the platform's native components. Let's implement the previous example using React Native:

```js
import { Text } from 'react-native'; // HIGHLIGHT LINE

const HelloWorld = props => {
  return &lt;Text>Hello world!&lt;/Text>; // HIGHLIGHT LINE
};
```

So we import the <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> component from React Native and replace the <code>div</code> element with a <code>Text</code> element. Many familiar DOM elements have their React Native "counterparts". Here are some examples picked from React Native's <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">Core Components documentation</a>:
- <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> component is <em>the only</em> React Native component that can have textual children. It is similar to for example the <code>&lt;strong></code> and the <code>&lt;h1></code> elements.
- <a href="https://reactnative.dev/docs/view" target="_blank" rel="noreferrer noopener">View</a> component is the basic user interface building block similar to the <code>&lt;div></code> element.
- <a href="https://reactnative.dev/docs/textinput" target="_blank" rel="noreferrer noopener">TextInput</a> component is a text field component similar to the <code>&lt;input></code> element.
- <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> component is for capturing different press events. It is similar to for example the <code>&lt;button></code> element.

There are a few notable differences between core components and DOM elements. The first difference is that the <code>Text</code> component is <em>the only</em> React Native component that can have textual children. This means that you can't, for example, replace the <code>Text</code> component with the <code>View</code> component in the previous example.

The second notable difference is related to the event handlers. While working with the DOM elements we are used to adding event handlers such as <code>onClick</code> to basically any element such as <code>&lt;div></code> and <code>&lt;button></code>. In React Native we have to carefully read the <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">API documentation</a> to know what event handlers (as well as other props) a component accepts. For example, the <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> component provides props for listening to different kinds of press events. We can for example use the component's <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">onPress</a> prop for listening to press events:

```js
import { Text, Pressable, Alert } from 'react-native';

const PressableText = props =&gt; {
  return (
    &lt;Pressable
      onPress={() =&gt; Alert.alert('You pressed the text!')}
    &gt;
      &lt;Text&gt;You can press me&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
};
```

## Installing dependencies in Expo project

In the earlier parts of the course, we have mainly installed libraries as project dependencies using the <code>npm install</code> command. However, when installing Expo and React Native libraries, it is recommended to use the <code>npx expo install</code> command instead. This allows the Expo CLI to choose a version of the library that matches the project and its SDK version.

We will soon need the&nbsp;<em>expo-constants</em>&nbsp;library, which provides the application with environment information such as the correct status bar height. Install the library with the command:

```bash
npx expo install expo-constants
```

If you’re not sure whether a library contains Expo or React Native specific native code, you can always install it using <code>npx expo install</code> command. If Expo doesn’t recognize the package, it will fall back to installing it using the normal <code>npm install</code> command.

## Structuring our project

Now that we have a basic understanding of the core components, let's start to give our project some structure. Create a&nbsp;<em>src</em>&nbsp;directory in the root directory of your project and in the&nbsp;<em>src</em>&nbsp;directory create a&nbsp;<em>components</em>&nbsp;directory.

In the&nbsp;<em>components</em>&nbsp;directory create a file&nbsp;<em>Main.jsx</em>&nbsp;with the following content:

```js
import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
  },
});

const Main = () =&gt; {
  return (
    &lt;View style={styles.container}&gt;
      &lt;Text&gt;Rate Repository Application&lt;/Text&gt;
    &lt;/View&gt;
  );
};

export default Main;
```

Next, let's use the <code>Main</code> component in the <code>App</code> component in the <em>App.js</em> file which is located in our project's root directory. Replace the current content of the file with this:

```js
import Main from './src/components/Main';

const App = () =&gt; {
  return &lt;Main /&gt;;
};

export default App;
```

## Manually reloading the application

As we have seen, Expo will automatically reload the application when we make changes to the code. However, there might be times when automatic reload isn't working and the application has to be reloaded manually. In Expo CLI, you can press <code>r</code> to reload; this usually triggers a reload.

This can also be achieved through the in-app developer menu. You can access the developer menu by shaking your device or by selecting "Shake Gesture" inside the Hardware menu in the iOS Simulator. You can also use the <code>⌘D</code> keyboard shortcut when your app is running in the iOS Simulator, or <code>⌘M</code> when running in an Android emulator on Mac OS and <code>Ctrl+M</code> on Windows and Linux.

Once the developer menu is open, simply press "Reload" to reload the application. After the application has been reloaded, automatic reloads should work without the need for a manual reload.

<div class="tasks">

**3. The reviewed repositories list**

</div>

## Style

Now that we have a basic understanding of how core components work and we can use them to build a simple user interface it is time to add some styles. In <a href="https://fullstackopen.com/en/part2/adding_styles_to_react_app" target="_blank" rel="noreferrer noopener">part 2</a> we learned that in the browser environment we can define React component's style properties using CSS. We had the option to either define these styles inline using the <code>style</code> prop or in a CSS file with a suitable selector.

There are many similarities in the way style properties are attached to React Native's core components and the way they are attached to DOM elements. In React Native most of the core components accept a prop called <code>style</code>. The <code>style</code> prop accepts an object with style properties and their values. These style properties are in most cases the same as in CSS, however, property names are in <em>camelCase</em>. This means that CSS properties such as <code>padding-top</code> and <code>font-size</code> are written as <code>paddingTop</code> and <code>fontSize</code>. Here is a simple example of how to use the <code>style</code> prop:

```js
import { Text, View } from 'react-native';

const BigBlueText = () =&gt; {
  return (
    &lt;View style={{ padding: 20 }}&gt;
      &lt;Text style={{ color: 'blue', fontSize: 24, fontWeight: '700' }}&gt;
        Big blue text
      &lt;/Text&gt;
    &lt;/View&gt;
  );
};
```

On top of the property names, you might have noticed another difference in the example. In CSS numerical property values commonly have a unit such as <em>px</em>, <em>%</em>, <em>em</em> or <em>rem</em>. In React Native all dimension-related property values such as <code>width</code>, <code>height</code>, <code>padding</code>, and <code>margin</code> as well as font sizes are <em>unitless</em>. These unitless numeric values represent <em>density-independent pixels</em>. In case you are wondering what are the available style properties for certain core components, check the <a href="https://github.com/vhpoet/react-native-styling-cheat-sheet" target="_blank" rel="noreferrer noopener">React Native Styling Cheat Sheet</a>.

In general, defining styles directly in the <code>style</code> prop is not considered such a great idea, because it makes components bloated and unclear. Instead, we should define styles outside the component's render function using the <a href="https://reactnative.dev/docs/stylesheet#create" target="_blank" rel="noreferrer noopener">StyleSheet.create</a> method. The <code>StyleSheet.create</code> method accepts a single argument which is an object consisting of named style objects and it creates a StyleSheet style reference from the given object. Here is an example of how to refactor the previous example using the <code>StyleSheet.create</code> method:

```js
import { Text, View, StyleSheet } from 'react-native'; // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: '700',
  },
});
// END HIGHLIGHT

const BigBlueText = () => {
  return (
    &lt;View style={styles.container}> // HIGHLIGHT LINE
      &lt;Text style={styles.text}> // HIGHLIGHT LINE
        Big blue text
      &lt;/Text>
    &lt;/View>
  );
};
```

We create two named style objects, <code>styles.container</code> and <code>styles.text</code>. Inside the component, we can access specific style objects the same way we would access any key in a plain object.

In addition to an object, the <code>style</code> prop also accepts an array of objects. In the case of an array, the objects are merged from left to right so that latter-style properties take precedence. This works recursively, so we can have for example an array containing an array of styles and so forth. If an array contains values that evaluate to false, such as <code>null</code> or <code>undefined</code>, these values are ignored. This makes it easy to define <em>conditional styles</em> for example, based on the value of a prop. Here is an example of conditional styles:

```js
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 14,
  },
  blueText: {
    color: 'blue',
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const FancyText = ({ isBlue, isBig, children }) =&gt; {
  const textStyles = [
    styles.text,
    isBlue &amp;&amp; styles.blueText,
    isBig &amp;&amp; styles.bigText,
  ];

  return &lt;Text style={textStyles}&gt;{children}&lt;/Text&gt;;
};

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

Props are now defined without an explicit value:

```
&lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
```

In JSX, providing a prop without a value is special syntax that means the same as ={true}. The following lines are therefore equivalent:

```
&lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
&lt;FancyText isBlue={true}&gt;Blue text&lt;/FancyText&gt;
```

In the example, we use the <code>&amp;&amp;</code> operator with the expression <code>condition &amp;&amp; exprIfTrue</code>:

```js
    const textStyles = [
    styles.text,
    isBlue &amp;&amp; styles.blueText, // HIGHLIGHT LINE
    isBig &amp;&amp; styles.bigText,
  ];
```

For example, in the highlighted line, the expression yields <code>styles.blueText</code> if the condition <code>isBlue</code> evaluates to true, otherwise it will yield <code>condition</code>, which in that case is a value that evaluates to false. This is an extremely widely used and handy shorthand.

Another option would be to use the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator" target="_blank" rel="noreferrer noopener">conditional operator</a>&nbsp;like this:

```
condition ? exprIfTrue : exprIfFalse
```

## Consistent user interface with theming

Let's stick with the concept of styling but with a bit wider perspective. Most of us have used a multitude of different applications and might agree that one trait that makes a good user interface is&nbsp;<em>consistency</em>. This means that the appearance of user interface components such as their font size, font family and color follows a consistent pattern. To achieve this we have to somehow&nbsp;<em>parametrize</em>&nbsp;the values of different style properties. This method is commonly known as&nbsp;<em>theming</em>.

Users of popular user interface libraries such as <a href="https://getbootstrap.com/docs/4.4/getting-started/theming/" target="_blank" rel="noreferrer noopener">Bootstrap</a> and <a href="https://material-ui.com/customization/theming/" target="_blank" rel="noreferrer noopener">Material UI</a> might already be quite familiar with theming. Even though the theming implementations differ, the main idea is always to use variables such as <code>colors.primary</code> instead of <a href="https://en.wikipedia.org/wiki/Magic_number_(programming)" target="_blank" rel="noreferrer noopener">"magic numbers"</a> such as <code>#0366d6</code> when defining styles. This leads to increased consistency and flexibility.

Let's see how theming could work in practice in our application. We will be using a lot of text with different variations, such as different font sizes and colors. Because React Native does not support global styles, we should create our own <code>Text</code> component to keep the textual content consistent. Let's get started by adding the following theme configuration object in a <em>theme.js</em> file in the <em>src</em> directory:

```js
const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
```

Next, we should create the actual <code>Text</code> component which uses this theme configuration. Create a <em>Text.jsx</em> file in the <em>components</em> directory where we already have our other components. Add the following content to the <em>Text.jsx</em> file:

```js
import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) =&gt; {
  const textStyle = [
    styles.text,
    color === 'textSecondary' &amp;&amp; styles.colorTextSecondary,
    color === 'primary' &amp;&amp; styles.colorPrimary,
    fontSize === 'subheading' &amp;&amp; styles.fontSizeSubheading,
    fontWeight === 'bold' &amp;&amp; styles.fontWeightBold,
    style,
  ];

  return &lt;NativeText style={textStyle} {...props} /&gt;;
};

export default Text;
```

Now we have implemented our text component. This text component has consistent color, font size and font weight variants that we can use anywhere in our application. We can get different text variations using different props like this:

```js
import Text from './Text';

const Main = () =&gt; {
  return (
    &lt;&gt;
      &lt;Text&gt;Simple text&lt;/Text&gt;
      &lt;Text style={{ paddingBottom: 10 }}&gt;Text with custom style&lt;/Text&gt;
      &lt;Text fontWeight="bold" fontSize="subheading"&gt;
        Bold subheading
      &lt;/Text&gt;
      &lt;Text color="textSecondary"&gt;Text with secondary color&lt;/Text&gt;
    &lt;/&gt;
  );
};

export default Main;
```

Feel free to extend or modify this component if you feel like it. It might also be a good idea to create reusable text components such as <code>Subheading</code> which use the <code>Text</code> component. Also, keep on extending and modifying the theme configuration as your application progresses.

## Using flexbox for layout

The last concept we will cover related to styling is implementing layouts with&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" target="_blank" rel="noreferrer noopener">flexbox</a>. Those who are more familiar with CSS know that flexbox is not related only to React Native, it has many use cases in web development as well. Those who know how flexbox works in web development won't probably learn that much from this section. Nevertheless, let's learn or revise the basics of flexbox.

Flexbox is a layout entity consisting of two separate components: a <em>flex container</em> and inside it a set of <em>flex items</em>. A Flex container has a set of properties that control the flow of its items. To make a component a flex container it must have the style property <code>display</code> set as <code>flex</code> which is the default value for the <code>display</code> property. Here is an example of a flex container:

```js
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
});

const FlexboxExample = () =&gt; {
  return &lt;View style={styles.flexContainer}&gt;{/* ... */}&lt;/View&gt;;
};
```

Perhaps the most important properties of a flex container are the following:
- <a href="https://css-tricks.com/almanac/properties/f/flex-direction/" target="_blank" rel="noreferrer noopener">flexDirection</a> property controls the direction in which the flex items are laid out within the container. Possible values for this property are <code>row</code>, <code>row-reverse</code>, <code>column</code> (default value) and <code>column-reverse</code>. Flex direction <code>row</code> will lay out the flex items from left to right, whereas <code>column</code> from top to bottom. <code>*-reverse</code> directions will just reverse the order of the flex items.
- <a href="https://css-tricks.com/almanac/properties/j/justify-content/" target="_blank" rel="noreferrer noopener">justifyContent</a> property controls the alignment of flex items along the main axis (defined by the <code>flexDirection</code> property). Possible values for this property are <code>flex-start</code> (default value), <code>flex-end</code>, <code>center</code>, <code>space-between</code>, <code>space-around</code> and <code>space-evenly</code>.
- <a href="https://css-tricks.com/almanac/properties/a/align-items/" target="_blank" rel="noreferrer noopener">alignItems</a> property does the same as <code>justifyContent</code> but for the opposite axis. Possible values for this property are <code>flex-start</code>, <code>flex-end</code>, <code>center</code>, <code>baseline</code> and <code>stretch</code> (default value).

Let's move on to flex items. As mentioned, a flex container can contain one or many flex items. Flex items have properties that control how they behave in respect of other flex items in the same flex container. To make a component a flex item all you have to do is to set it as an immediate child of a flex container:

```js
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: 'green',
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
});

const FlexboxExample = () =&gt; {
  return (
    &lt;View style={styles.flexContainer}&gt;
      &lt;View style={styles.flexItemA}&gt;
        &lt;Text&gt;Flex item A&lt;/Text&gt;
      &lt;/View&gt;
      &lt;View style={styles.flexItemB}&gt;
        &lt;Text&gt;Flex item B&lt;/Text&gt;
      &lt;/View&gt;
    &lt;/View&gt;
  );
};
```

One of the most commonly used properties of flex items is the <a href="https://css-tricks.com/almanac/properties/f/flex-grow/" target="_blank" rel="noreferrer noopener">flexGrow</a> property. It accepts a unitless value which defines the ability for a flex item to grow if necessary. If all flex items have a <code>flexGrow</code> of 1, they will share all the available space evenly. If a flex item has a <code>flexGrow</code> of 0, it will only use the space its content requires and leave the rest of the space for other flex items.

Here you can find how to simplify layouts with Flexbox gap:&nbsp;<a href="https://reactnative.dev/blog/2023/01/12/version-071#simplifying-layouts-with-flexbox-gap" target="_blank" rel="noreferrer noopener">Flexbox gap</a>.

Next, read the article <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noreferrer noopener">A Complete Guide to Flexbox</a> which has comprehensive visual examples of flexbox. It is also a good idea to play around with the flexbox properties in the <a href="https://flexbox.tech/" target="_blank" rel="noreferrer noopener">Flexbox Playground</a> to see how different flexbox properties affect the layout. Remember that in React Native the property names are the same as the ones in CSS except for the <em>camelCase</em> naming. However, the <em>property values</em> such as <code>flex-start</code> and <code>space-between</code> are exactly the same.

<strong>NB:</strong> React Native and CSS has some differences regarding the flexbox. The most important difference is that in React Native the default value for the <code>flexDirection</code> property is <code>column</code>. It is also worth noting that the <code>flex</code> shorthand doesn't accept multiple values in React Native. More on React Native's flexbox implementation can be read in the <a href="https://reactnative.dev/docs/flexbox" target="_blank" rel="noreferrer noopener">documentation</a>.

<div class="tasks">

**4. The app bar**

</div>

<div class="tasks">

**5. Polished reviewed repositories list**

</div>

## Status bar style

We chose a dark background color for the&nbsp;<em>AppBar</em>&nbsp;component. The problem now is that the status bar icons—such as the clock and battery status—don’t stand out very well:

![Status bar with dark style](/images/mooc/73241e589990.webp)

We already installed the <em>expo-status-bar</em> library when configuring Expo earlier. The problem is easy to fix by adding the <code>StatusBar</code> component to the <em>App.js</em> file:

```js
import { StatusBar } from 'expo-status-bar'; // HIGHLIGHT LINE

import Main from './src/components/Main';

const App = () => {
  // BEGIN HIGHLIGHT
  return (
    &lt;>
      &lt;StatusBar style="light" />
      &lt;Main />
    &lt;/>
  );
  // END HIGHLIGHT
};

export default App;
```

The <code>StatusBar</code> component tells the operating system how to render the status bar. By setting its style to <em>light</em>, the status bar icons become easier to see against a dark background:

![Status bar with light style](/images/mooc/7b66a9770608.webp)

## Routing

When we start to expand our application we will need a way to transition between different views such as the repositories view and the sign-in view. In <a href="https://fullstackopen.com/en/part5/react_router_ui_frameworks" target="_blank" rel="noreferrer noopener">part 5</a> we got familiar with <a href="https://reactrouter.com/" target="_blank" rel="noreferrer noopener">React router</a> library and learned how to use it to implement routing in a web application.

Routing in a React Native application is a bit different from routing in a web application. The main difference is that we can't reference pages with URLs, which we type into the browser's address bar, and can't navigate back and forth through the user's history using the browser's&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API" target="_blank" rel="noreferrer noopener">history API</a>. However, this is just a matter of the router interface we are using.

With React Native we can use the entire React router's core, including the hooks and components. The only difference to the browser environment is that we must replace the <code>BrowserRouter</code> with React Native compatible <a href="https://reactrouter.com/en/6.4.5/router-components/native-router" target="_blank" rel="noreferrer noopener">NativeRouter</a>, provided by the <a href="https://www.npmjs.com/package/react-router-native" target="_blank" rel="noreferrer noopener">react-router-native</a> library. Let's get started by installing the <em>react-router-native</em> library:

```bash
npm install react-router-native
```

Next, open the <em>App.js</em> file and add the <code>NativeRouter</code> component to the <code>App</code> component:

```js
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native'; // HIGHLIGHT LINE

import Main from './src/components/Main';

const App = () => {
  return (
    &lt;>
      &lt;StatusBar style="auto" />
      // BEGIN HIGHLIGHT
      &lt;NativeRouter>
        &lt;Main />
      &lt;/NativeRouter>
      // END HIGHLIGHT
    &lt;/>
  );
};

export default App;
```

Once the router is in place, let's add our first route to the&nbsp;Main component in the&nbsp;<em>Main.jsx</em>&nbsp;file:

```js
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native'; // HIGHLIGHT LINE

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flex: 1,
  },
});

const Main = () => {
  return (
    &lt;View style={styles.container}>
      &lt;AppBar />
      // BEGIN HIGHLIGHT
      &lt;Routes>
        &lt;Route path="/" element={&lt;RepositoryList />} />
        &lt;Route path="*" element={&lt;Navigate to="/" replace />} />
      &lt;/Routes>
      // END HIGHLIGHT
    &lt;/View>
  );
};

export default Main;
```

That's it! The last <code>Route</code> inside the <code>Routes</code> is for catching paths that don't match any previously defined path. In this case, we want to navigate to the home view.

<div class="tasks">

**6. The sign-in view**

</div>

<div class="tasks">

**7. Scrollable app bar**

</div>

## Form state management

Now that we have a placeholder for the sign-in view the next step would be to implement the sign-in form. Before we get to that let's talk about forms from a wider perspective.

Implementation of forms relies heavily on state management. Using React's <code>useState</code> hook for state management might get the job done for smaller forms. However, it will quickly make state management for more complex forms quite tedious. Luckily there are many good libraries in the React ecosystem that ease the state management of forms. One of these libraries is <a href="https://formik.org/" target="_blank" rel="noreferrer noopener">Formik</a>.

The main concepts of Formik are the&nbsp;<em>context</em>&nbsp;and the&nbsp;<em>field</em>. However, the easiest way to do a simple form submit is by using useFormik(). It is a custom React hook that will return all Formik state and helpers directly.

There are some restrictions concerning the use of UseFormik(). Read this to become familiar with <a href="https://formik.org/docs/api/useFormik" target="_blank" rel="noreferrer noopener">useFormik()</a>.

Let's first install Formik:

```bash
npm install formik
```

Let's see how the state management with Formik works by creating a form for calculating the&nbsp;<a href="https://en.wikipedia.org/wiki/Body_mass_index" target="_blank" rel="noreferrer noopener">body mass index</a>:

```js
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) =&gt; {
  return Math.round(mass / Math.pow(height, 2));
};

const BodyMassIndexForm = ({ onSubmit }) =&gt; {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    &lt;View&gt;
      &lt;TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
      /&gt;
      &lt;TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
      /&gt;
      &lt;Pressable onPress={formik.handleSubmit}&gt;
        &lt;Text&gt;Calculate&lt;/Text&gt;
      &lt;/Pressable&gt;
    &lt;/View&gt;
  );
};

const BodyMassIndexCalculator = () =&gt; {
  const onSubmit = values =&gt; {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) &amp;&amp; !isNaN(height) &amp;&amp; height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return &lt;BodyMassIndexForm onSubmit={onSubmit} /&gt;;
};

export default BodyMassIndexCalculator;
```

This example is not part of our application, so you don't need to add this code to the application. You can however try it out for example in <a href="https://snack.expo.io/" target="_blank" rel="noreferrer noopener">Expo Snack</a>. Expo Snack is an online editor for React Native, similar to <a href="https://jsfiddle.net/" target="_blank" rel="noreferrer noopener">JSFiddle</a> and <a href="https://codepen.io/" target="_blank" rel="noreferrer noopener">CodePen</a>. It is a useful platform for quickly trying out code. Note that you also need to add Formik as a dependency in Expo Snack. You can do this by adding the dependency directly to the <em>package.json</em> file, for example the line: <code>"formik": "^2.4.9"</code>.

You can share Expo Snacks with others using a link or embedding them as a&nbsp;<em>Snack Player</em>&nbsp;on a website. You might have bumped into Snack Players for example in this material and React Native documentation.

<div class="tasks">

**8. The sign-in form**

</div>

## Form validation

Formik offers two approaches to form validation: a validation function or a validation schema. A validation function is a function provided for the <code>Formik</code> component as the value of the <a href="https://formik.org/docs/guides/validation#validate" target="_blank" rel="noreferrer noopener">validate</a> prop. It receives the form's values as an argument and returns an object containing possible field-specific error messages.

The second approach is the validation schema which is provided for the <code>Formik</code> component as the value of the <a href="https://formik.org/docs/guides/validation#validationschema" target="_blank" rel="noreferrer noopener">validationSchema</a> prop. This validation schema can be created with a validation library called <a href="https://github.com/jquense/yup" target="_blank" rel="noreferrer noopener">Yup</a>. Let's get started by installing Yup:

```bash
npm install yup
```

Next, as an example, let's create a validation schema for the body mass index form we implemented earlier. We want to validate that both <code>mass</code> and <code>height</code> fields are present and they are numeric. Also, the value of <code>mass</code> should be greater or equal to 1 and the value of <code>height</code> should be greater or equal to 0.5. Here is how we define the schema:

```js
import * as yup from 'yup'; // HIGHLIGHT LINE

// ...

// BEGIN HIGHLIGHT
const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or equal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});
// END HIGHLIGHT

const BodyMassIndexForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    // BEGIN HIGHLIGHT
    validationSchema,
    // END HIGHLIGHT
    onSubmit,
  });

  return (
    &lt;View>
      &lt;TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
        onBlur={formik.handleBlur('mass')} // HIGHLIGHT LINE
      />
      // BEGIN HIGHLIGHT
      {formik.touched.mass &amp;&amp; formik.errors.mass &amp;&amp; (
        &lt;Text style={{ color: 'red' }}>{formik.errors.mass}&lt;/Text>
      )}
      // END HIGHLIGHT
      &lt;TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
        onBlur={formik.handleBlur('height')} // HIGHLIGHT LINE
      />
      // BEGIN HIGHLIGHT
      {formik.touched.height &amp;&amp; formik.errors.height &amp;&amp; (
        &lt;Text style={{ color: 'red' }}>{formik.errors.height}&lt;/Text>
      )}
      // END HIGHLIGHT
      &lt;Pressable onPress={formik.handleSubmit}>
        &lt;Text>Calculate&lt;/Text>
      &lt;/Pressable>
    &lt;/View>
  );
};

const BodyMassIndexCalculator = () => {
  // ...
}
```

Be aware that you need to include these Text components within the View returned by the form to display the validation errors:

```
 {formik.touched.mass &amp;&amp; formik.errors.mass &amp;&amp; (
  &lt;Text style={{ color: 'red' }}&gt;{formik.errors.mass}&lt;/Text&gt;
 )}
```

```
 {formik.touched.height &amp;&amp; formik.errors.height &amp;&amp; (
  &lt;Text style={{ color: 'red' }}&gt;{formik.errors.height}&lt;/Text&gt;
 )}
```

The validation is performed by default every time a field's value changes and when the <code>handleSubmit</code> function is called. If the validation fails, the function provided for the <code>onSubmit</code> prop of the <code>Formik</code> component is not called.

<div class="tasks">

**9. Validating the sign-in form**

</div>

## Platform-specific code

A big benefit of React Native is that we don't need to worry about whether the application is run on an Android or iOS device. However, there might be cases where we need to execute&nbsp;<em>platform-specific code</em>. Such cases could be for example using a different implementation of a component on a different platform.

We can access the user's platform through the <code>Platform.OS</code> constant:

```js
import { Platform, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === 'android' ? 'green' : 'blue',
  },
});

const WhatIsMyPlatform = () =&gt; {
  return &lt;Text style={styles.text}&gt;Your platform is: {Platform.OS}&lt;/Text&gt;;
};
```

Possible values for the <code>Platform.OS</code> constants are <code>android</code> and <code>ios</code>. Another useful way to define platform-specific code branches is to use the <code>Platform.select</code> method. Given an object where keys are one of <code>ios</code>, <code>android</code>, <code>native</code> and <code>default</code>, the <code>Platform.select</code> method returns the most fitting value for the platform the user is currently running on. We can rewrite the <code>styles</code> variable in the previous example using the <code>Platform.select</code> method like this:

```js
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
});
```

We can even use the <code>Platform.select</code> method to require a platform-specific component:

```js
const MyComponent = Platform.select({
  ios: () =&gt; require('./MyIOSComponent'),
  android: () =&gt; require('./MyAndroidComponent'),
})();

&lt;MyComponent /&gt;;
```

However, a more sophisticated method for implementing and importing platform-specific components (or any other piece of code) is to use the&nbsp;<em>.ios.jsx</em>&nbsp;and&nbsp;<em>.android.jsx</em>&nbsp;file extensions. Note that the&nbsp;<em>.jsx</em>&nbsp;extension could also be another extension recognized by the bundler, such as&nbsp;<em>.js</em>. We can for example have files&nbsp;<em>Button.ios.jsx</em>&nbsp;and&nbsp;<em>Button.android.jsx</em>&nbsp;which we can import like this:

```js
import Button from './Button';

const PlatformSpecificButton = () =&gt; {
  return &lt;Button /&gt;;
};
```

Now, the Android bundle of the application will have the component defined in the&nbsp;<em>Button.android.jsx</em>&nbsp;whereas the iOS bundle the one defined in the&nbsp;<em>Button.ios.jsx</em>&nbsp;file.

<div class="tasks">

**10. A platform-specific font**

</div>
