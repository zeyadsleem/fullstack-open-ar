---
part: 10
letter: b
title: "Introduction to React Native"
mainImage: /images/part-10.svg
lang: en
---
Traditionally, developing native iOS and Android applications has required the developer to use platform-specific programming languages and development environments. For iOS development, this means using Objective C or Swift and for Android development using JVM-based languages such as Java, Scala or Kotlin. Releasing an application for both these platforms technically requires developing two separate applications with different programming languages. This requires lots of development resources.

One of the popular approaches to unify the platform-specific development has been to utilize the browser as the rendering engine.&nbsp;<a href="https://cordova.apache.org/" target="_blank" rel="noreferrer noopener">Cordova</a>&nbsp;is one of the most popular platforms for building cross-platform applications. It allows for developing multi-platform applications using standard web technologies - HTML5, CSS3, and JavaScript. However, Cordova applications are running within an embedded browser window in the user's device. That is why these applications can not achieve the performance nor the look-and-feel of native applications that utilize actual native user interface components.

<a href="https://reactnative.dev/" target="_blank" rel="noreferrer noopener">React Native</a>&nbsp;is a framework for developing native Android and iOS applications using JavaScript and React. It provides a set of cross-platform components that behind the scenes utilize the platform's native components. Using React Native allows us to bring all the familiar features of React such as JSX, components, props, state, and hooks into native application development. On top of that, we can utilize many familiar libraries in the React ecosystem such as&nbsp;<a href="https://react-redux.js.org/" target="_blank" rel="noreferrer noopener">React Redux</a>,&nbsp;<a href="https://www.apollographql.com/docs/react" target="_blank" rel="noreferrer noopener">Apollo</a>,&nbsp;<a href="https://reactrouter.com/en/main" target="_blank" rel="noreferrer noopener">React Router</a>&nbsp;and many more.

The speed of development and gentle learning curve for developers familiar with React is one of the most important benefits of React Native. Here's a motivational quote from Coinbase's article&nbsp;<a href="https://benbronsteiny.wordpress.com/2020/02/27/onboarding-thousands-of-users-with-react-native/" target="_blank" rel="noreferrer noopener">Onboarding thousands of users with React Native</a>&nbsp;on the benefits of React Native:

> <em>If we were to reduce the benefits of React Native to a single word, it would be “velocity”. On average, our team was able to onboard engineers in less time, share more code (which we expect will lead to future productivity boosts), and ultimately deliver features faster than if we had taken a purely native approach.</em>

## About this part

During this part, we will be developing an application for rating <a href="https://github.com/" target="_blank" rel="noreferrer noopener">GitHub</a> repositories. Our application will have features such as, sorting and filtering reviewed repositories, registering a user, logging in and creating a review for a repository. The backend for the application will be provided for us so that we can solely focus on the React Native development.

This part is structured based on the idea that you develop your application as you progress in the material. So <em>do not</em> wait until the exercises to start the development. Instead, develop your application at the same pace as the material progresses.

The final version of our application will look something like this:

![Application preview](/images/mooc/a76d099ec121.webp)

## Initializing the application

To get started with our application we need to set up our development environment. We have learned from previous parts that there are useful tools for setting up React applications quickly such as Vite. Luckily React Native has these kinds of tools as well.

For the development of our application, we will be using <a href="https://docs.expo.dev/versions/latest/" target="_blank" rel="noreferrer noopener">Expo</a>. Expo is a platform that eases the setup, development, building, and deployment of React Native applications. Expo has a <a href="https://docs.expo.dev/faq/#limitations" target="_blank" rel="noreferrer noopener">few limitations</a> when compared to plain React Native CLI. However, these limitations do not affect the application implemented in the material.

Let's get started with Expo by initializing our project with <em>create-expo-app</em>:

```bash
npx create-expo-app rate-repository-app --template blank@sdk-55
```

> Note, that the <code>@sdk-55</code> sets the project's <em>Expo SDK version to 5</em>5. You should use this exact version while following this material.

Next, let's navigate to the created&nbsp;<em>rate-repository-app</em>&nbsp;directory with the terminal and install a few dependencies we'll be needing soon:

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

Now that our application has been initialized, open the created <em>rate-repository-app</em> directory with an editor such as <a href="https://code.visualstudio.com/" target="_blank" rel="noreferrer noopener">Visual Studio Code</a>. The structure should be more or less the following:

![Project structure](/images/mooc/92af0d24c1cc.webp)

We might spot some familiar files and directories such as&nbsp;<em>package.json</em>&nbsp;and&nbsp;<em>node_modules</em>. On top of those, the most relevant files are the&nbsp;<em>app.json</em>&nbsp;file which contains Expo-related configuration and&nbsp;<em>App.js</em>&nbsp;which is the root component of our application.&nbsp;<em>Do not</em>&nbsp;rename or move the&nbsp;<em>App.js</em>&nbsp;file because by default Expo imports it to&nbsp;<a href="https://docs.expo.dev/versions/latest/sdk/expo/#registerrootcomponentcomponent" target="_blank" rel="noreferrer noopener">register the root component</a>.

Let's look at the&nbsp;<em>scripts</em>&nbsp;section of the&nbsp;<em>package.json</em>&nbsp;file which has the following scripts:

```json
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  // ...
}
```

Let us now run the script <code>npm start</code>

![Metro bundler console output](/images/mooc/19d5da9ef95b.webp)

> <em>If the script fails with error</em>&nbsp;<em>the problem is most likely your Node version. In case of problems, switch to version&nbsp;22.</em>

The command starts the Expo development server (<a href="https://docs.expo.dev/more/expo-cli/" target="_blank" rel="noreferrer noopener">Expo CLI</a>). The server uses&nbsp;<a href="https://metrobundler.dev/" target="_blank" rel="noreferrer noopener">Metro bundler</a>, which bundles JavaScript and serves it to the app. The command-line interface has a useful set of commands for viewing the application logs and starting the application in an emulator or on a physical device (e.g. with Expo Go). We will get to emulators and Expo Go soon, but first, let's open our application in the browser.

Expo command-line interface suggests a few ways to open our application. Let's press the "w" key in the terminal window to open the application in a browser. We should soon see the text defined in the <em>App.js</em> file in a browser window. Open the <em>App.js</em> file with an editor and make a small change to the text in the <code>Text</code> component. After saving the file, the changes should usually appear automatically thanks to Fast Refresh.

## Setting up the virtual devices

We have had the first glance of our application using the Expo's browser view. Although the browser view is quite usable, it is still a quite poor simulation of the native environment. Let's have a look at the alternatives we have regarding the development environment.

Android and iOS devices such as tablets and phones can be emulated in computers using specific&nbsp;<em>emulators</em>. This is very useful for developing native applications. macOS users can use both Android and iOS emulators with their computers. Users of other operating systems, such as Linux and Windows, have to settle for Android emulators. Next, depending on your operating system follow one of these instructions on setting up an emulator:
- <a href="https://docs.expo.dev/workflow/android-studio-emulator/#set-up-android-studio" target="_blank" rel="noreferrer noopener">Set up the Android emulator with Android Studio</a> (any operating system)
- <a href="https://docs.expo.dev/workflow/ios-simulator/" target="_blank" rel="noreferrer noopener">Set up the iOS simulator with Xcode</a> (macOS operating system)

When you have finished setting up the emulator, start it so that you can see the virtual device on your screen. Then start the Expo CLI as we did before, by running <kbd><code>npm start</code></kbd>. Depending on the emulator you are running either press the corresponding key for the "open Android" or "open iOS simulator". After pressing the key, Expo should connect to the emulator and you should eventually see the application in your emulator. Be patient, this might take a while.

## Using your own phone with Expo Go

In addition to emulators, there is one extremely useful way to develop React Native applications with Expo: the Expo Go app. With Expo Go, you can preview your application using your actual mobile device, which provides a bit more concrete development experience compared to emulators.

The major version of Expo Go should match the version of the Expo SDK being used, which in this case is 55. Some versions of Expo Go may also support projects that use a slightly older SDK version, but this is not guaranteed. Note that the Expo Go version available in app stores may not be the same as the SDK version used in this course.

Let us install Expo Go:
- On Android phones, it is possible to install any Expo Go version from <a href="https://expo.dev/go" data-type="link" data-id="https://expo.dev/go">Expo’s website</a>.
- Unfortunately, iOS users must use the version available in the App Store, which may not be compatible with the course material. If you want, you can use an SDK version in the course that matches the Expo Go version available in the App Store. However, note that not all parts of the course material are necessarily compatible with other SDK versions. (Expo Go version 55 should be released to the App Store very soon.)

In case you installed Expo Go from app store, it’s recommended to disable automatic updates for the app in the app store, as updates may break compatibility. For the easiest setup, keep your mobile device on the same local network (e.g. the same Wi-Fi) as your development machine.

Next, if the Expo development tools are not already running, start them by running <code>npm start</code>. You should be able to see a QR code at the beginning of the command output. Open the app by scanning the QR code in Expo Go. Expo Go should start building the JavaScript bundle and after it is finished you should be able to see your application. Now, every time you want to reopen your application in Expo Go, you should be able to access the application without scanning the QR code by pressing it in the <em>Recently opened</em> list in the <em>Projects</em> view.

If your phone can’t connect to the development server, you can try starting Expo CLI with command:

```bash
npx expo start --tunnel
```

In this mode, your devices don’t need to be on the same local network—the traffic is routed over the internet instead. This can help work around various firewall and network configuration issues. However, Expo Go may run more slowly because the code and bundles are now fetched through the tunnel.

<div class="tasks">

**1. initializing the application**

</div>

## ESLint

Now that we are somewhat familiar with the development environment let's enhance our development experience even further by configuring a linter. We will be using&nbsp;<a href="https://eslint.org/" target="_blank" rel="noreferrer noopener">ESLint</a>&nbsp;which is already familiar to us from the previous parts. Let's set up ESLint with the command:

```bash
npx expo lint
```

The command will install the necessary dependencies and create an <em>eslint.config.js</em> file in the project root. It also adds automatically <code>lint</code> script to the <em>package.json</em> file:

```
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"  }, // HIGHLIGHT LINE
```

The&nbsp;<em>eslint.config.js</em>&nbsp;looks like follows:

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);
```

The file is short, but it includes the most important ESLint rules for a React Native project. <em>eslint-config-expo/flat</em> is an all-in-one preset that automatically provides ESLint's base rules, React rules, React Native Rules and Expo-specific best practices.

After the initial setup, you can lint your code by running:

```bash
npm run lint
```

You can also integrate ESLint with your editor. In Visual Studio Code, you can do that by going to the extensions section and checking that the ESLint extension is installed and enabled:

![Visual Studio Code ESLint extensions](/images/mooc/cdc3b63d08c5.webp)

The provided ESLint configuration is only a starting point. Feel free to edit it and add your own rules if you feel like it.

<div class="tasks">

**2. Setting up the ESLint**

</div>

## Debugging

When our application doesn't work as intended, we should immediately start&nbsp;<em>debugging</em>&nbsp;it. In practice, this means that we'll need to reproduce the erroneous behavior and monitor the code execution to find out which part of the code behaves incorrectly. During the course, we have already done a bunch of debugging by logging messages, inspecting network traffic, and using specific development tools, such as&nbsp;<em>React Developer Tools</em>. In general, debugging isn't that different in React Native, we'll just need the right tools for the job.

The good old console.log messages appear in the Expo CLI command line:

![Console log messages appear in Expo CLI command line](/images/mooc/7a9506957f8d.webp)

That might actually be enough in most cases, but sometimes we need more.

React Native provides an <a href="https://docs.expo.dev/debugging/tools/#developer-menu" target="_blank" rel="noreferrer noopener"><strong>in-app developer menu</strong></a> which offers several debugging options and lets you do things like reload the app. You can toggle the <em>Element Inspector</em>, which shows an overlay for inspecting UI elements and their layout. Another useful option is the <em>Performance Monitor</em>, an in-app overlay that shows basic performance metrics such as FPS and JS/UI thread activity.

<a href="https://reactnative.dev/docs/react-native-devtools" target="_blank" rel="noreferrer noopener"><strong>React Native DevTools</strong></a>&nbsp;is a powerful tool for debugging your app. It offers a similar set of debugging features as the Chrome's DevTools, and it also includes the same features as&nbsp;<em>React DevTools</em>, which we have previously used as a Chrome browser extension.

When the app is running in an emulator or on your phone via Expo Go, you can open React Native DevTools from Expo CLI by pressing <code>j</code>. DevTools will open in a browser window:

![React Native DevTools view](/images/mooc/2e287cba0a24.webp)

You can use the DevTools to inspect the component's state and props as well as <em>change</em> them. Try finding the <code>Text</code> component rendered by the <code>App</code> component using the DevTools. You can either use the search or go through the component tree. Once you have found the <code>Text</code><em> </em>component in the tree, click it, and change the value of the <code>children</code> prop. The change should be automatically visible in the application's preview.

You can read more about the different React Native debugging options in Expo’s <a href="https://docs.expo.dev/debugging/tools/" target="_blank" rel="noreferrer noopener">debugging documentation</a>.
