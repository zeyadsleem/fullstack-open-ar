---
part: 11
letter: c
title: "Getting started with GitHub Actions"
mainImage: /images/part-11.svg
lang: en
---
Before we start playing with GitHub Actions, let's have a look at what they are and how do they work.

GitHub Actions operate on&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">workflows</a>. A workflow is a series of&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">jobs</a>&nbsp;that run when a specific&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events" target="_blank" rel="noreferrer noopener">event</a>&nbsp;triggers them. Each job contains its own set of instructions that tell GitHub Actions what to do.

A typical execution of a workflow looks like this:
- Triggering event happens (for example, there is a push to the main branch).
- The workflow with that trigger is executed.
- Cleanup

### Basic needs

In general, to have CI operate on a repository, we need a few things:
- A repository (obviously)
- Some definition of what the CI needs to do: This can be in the form of a specific file inside the repository or it can be defined in the CI system
- The CI needs to be aware that the repository (and the configuration file within it) exist
- The CI needs to be able to access the repository
- The CI needs permissions to perform the actions it is supposed to be able to do: For example, if the CI needs to be able to deploy to a production environment, it needs <em>credentials</em> for that environment.

That's the traditional model at least, we'll see in a minute how GitHub Actions short-circuit some of these steps or rather make it such that you don't have to worry about them!

GitHub Actions have a great advantage over self-hosted solutions: the repository is hosted with the CI provider. In other words, GitHub provides both the repository and the CI platform. This means that if we've enabled actions for a repository, GitHub is already aware of the fact that we have workflows defined and what those definitions look like.

<div class="tasks">

**2. The example project**

</div>

### Getting started with workflows

The core component of creating CI/CD pipelines with GitHub Actions is something called a&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">Workflow</a>. Workflows are process flows that you can set up in your repository to run automated tasks such as building, testing, linting, releasing, and deploying to name a few! The hierarchy of a workflow looks as follows:

Workflow
- Job
- Job

Each workflow must specify at least one&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">Job</a>, which contains a set of&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps" target="_blank" rel="noreferrer noopener">Steps</a>&nbsp;to perform individual tasks. The jobs will be run in parallel and the steps in each job will be executed sequentially.

Steps can vary from running a custom command to using pre-defined actions, thus the name GitHub Actions. You can create&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/creating-actions" target="_blank" rel="noreferrer noopener">customized actions</a>&nbsp;or use any actions published by the community, which are plenty, but let's get back to that later!

For GitHub to recognize your workflows, they must be specified in <em>.github/workflows</em> folder in your repository. Each Workflow is its own separate file, which needs to be configured using the <a href="https://yaml.org/" data-type="link" data-id="https://yaml.org/">YAML</a> data-serialization language.

YAML is a recursive acronym for "YAML Ain't Markup Language". As the name might hint, its goal is to be human-readable, and it is commonly used for configuration files.

Notice that indentations are important in YAML. You can learn more about the syntax&nbsp;<a href="https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html" target="_blank" rel="noreferrer noopener">here</a>.

A basic workflow contains three elements in a YAML document. These three elements are:
- name: Yep, you guessed it, the name of the workflow
- (on) triggers: The events that trigger the workflow to be executed
- jobs: The separate jobs that the workflow will execute (a basic workflow might contain only one job).

A simple workflow definition looks like this:

```
name: Hello World!

on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

There is one job named <em>hello_world_job</em>, it will be run in a virtual environment with Ubuntu 24.04. The job has just one step named "Say hello", which will run the <code>echo "Hello World!"</code> command in the shell.

So you may ask, when does GitHub trigger a workflow to be started? There are plenty of&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">options</a>&nbsp;to choose from, but generally speaking, you can configure a workflow to start once:
- An <em>event on GitHub</em> occurs such as when someone pushes a commit to a repository or when an issue or pull request is created
- A <em>scheduled event</em>, that is specified using the <a href="https://en.wikipedia.org/wiki/Cron" target="_blank" rel="noreferrer noopener">cron</a>-syntax, happens
- An <em>external event</em> occurs, for example, a command is performed in an external application such as <a href="https://slack.com/" target="_blank" rel="noreferrer noopener">Slack</a> or <a href="https://discord.com/" target="_blank" rel="noreferrer noopener">Discord</a> messaging app

To learn more about which events can be used to trigger workflows, please refer to GitHub Action's&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">documentation</a>.

<div class="tasks">

**3. Hello world!**

</div>

<div class="tasks">

**4. Date and directory contents**

</div>

### Setting up lint, test and build steps

After completing the first exercises, you should have a simple but pretty useless workflow set up. Let's make our workflow do something useful.

Let's implement a GitHub Action that will lint the code. If the checks don't pass, GitHub Actions will show a red status.

At the start, the workflow that we will save to file <em>pipeline.yml</em> looks like this:

```
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
```

Before we can run a command to lint the code, we have to perform a couple of actions to set up the environment of the job.

#### Setting up the environment

Setting up the environment is an important task while configuring a pipeline. We're going to use an <em>ubuntu-latest</em> virtual environment because this is the same as the version of Ubuntu (namely 24.04) we're going to be running in production.

It is important to replicate the same environment in CI as in production as closely as possible to avoid situations where the same code works differently in CI and in production, which would effectively defeat the purpose of using CI.

Next, we list the steps in the "build" job that the CI would need to perform. As we noticed in the last exercise, by default the virtual environment does not have any code in it, so we need to&nbsp;<em>checkout the code</em>&nbsp;from the repository.

This is an easy step:

```
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
// BEGIN HIGHLIGHT
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v6
// END HIGHLIGHT
```

The&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses" target="_blank" rel="noreferrer noopener">uses</a>&nbsp;keyword tells the workflow to run a specific&nbsp;<em>action</em>. An action is a reusable piece of code, like a function. Actions can be defined in your repository in a separate file or you can use the ones available in public repositories.

Here we're using a public action <a href="https://github.com/actions/checkout" target="_blank" rel="noreferrer noopener">actions/checkout</a>, and we specify a version (@v6) to avoid potential breaking changes if the action gets updated. The <em>checkout</em> action does what the name implies: it checks out the project source code from Git.

Secondly, as the application is written in JavaScript, Node.js must be set up to be able to utilize the commands that are specified in <em>package.json</em>. To set up Node.js, <a href="https://github.com/actions/setup-node" target="_blank" rel="noreferrer noopener">actions/setup-node</a> action can be used. Node version 24 is selected because it is the version the application is using in the production environment.

```
# name and trigger not shown anymore...

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
// BEGIN HIGHLIGHT
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
// END HIGHLIGHT
```

As we can see, the&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith" target="_blank" rel="noreferrer noopener">with</a>&nbsp;keyword is used to give a "parameter" to the action. Here the parameter specifies the version of Node.js we want to use.

Lastly, the dependencies of the application must be installed. Just like on your own machine, we execute <code>npm install</code>. The steps in the job should now look like this:

```
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
// BEGIN HIGHLIGHT
      - name: Install dependencies
        run: npm install
// END HIGHLIGHT
```

Now the environment should be completely ready for the job to run important tasks.

#### Lint

After the environment has been set up, we can run all the scripts from package.json like we would on our own machine. To lint the code, all you have to do is add a step to run the <code>npm run eslint</code> command.

```
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
      - name: Install dependencies
        run: npm install
// BEGIN HIGHLIGHT
      - name: Check style
        run: npm run eslint
// END HIGHLIGHT
```

Note that the&nbsp;<em>name</em>&nbsp;of a step is optional, if you define a step as follows

```
- run: npm run eslint
```

the command that is run is used as the default name.

<div class="tasks">

**5. Linting workflow**

</div>

<div class="tasks">

**6. Fix the code**

</div>

<div class="tasks">

**7. Building and testing**

</div>

<div class="tasks">

**8. Back to green**

</div>

<div class="tasks">

**9. Simple end-to-end tests**

</div>
