---
part: 11
letter: d
title: "Deployment"
mainImage: /images/part-11.svg
lang: en
---
Having written a nice application it's time to think about how we're going to deploy it to the use of real users.

In&nbsp;<a href="https://fullstackopen.com/en/part3/deploying_app_to_internet" target="_blank" rel="noreferrer noopener">part 3</a>&nbsp;of this course, we did this by simply running a single command from terminal to get the code up and running the servers of the cloud provider&nbsp;<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a>&nbsp;or&nbsp;<a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>.

It is pretty simple to release software in Fly.io and Render at least compared to many other types of hosting setups but it still contains risks: nothing prevents us from accidentally releasing broken code to production.

Next, we're going to look at the principles of making a deployment safely and some of the principles of deploying software on both a small and large scale.

### Anything that can go wrong...

We'd like to define some rules about how our deployment process should work but before that, we have to look at some constraints of reality.

One phrasing of Murphy's Law holds that: "Anything that can go wrong will go wrong."

It's important to remember this when we plan out our deployment system. Some of the things we'll need to consider could include:
- What if my computer crashes or hangs during deployment?
- I'm connected to the server and deploying over the internet, what happens if my internet connection dies?
- What happens if any specific instruction in my deployment script/system fails?
- What happens if, for whatever reason, my software doesn't work as expected on the server I'm deploying to? Can I roll back to a previous version?
- What happens if a user does an HTTP request to our software just before we do deployment (we didn't have time to send a response to the user)?

These are just a small selection of what can go wrong during a deployment, or rather, things that we should plan for. Regardless of what happens, our deployment system should&nbsp;<strong>never</strong>&nbsp;leave our software in a broken state. We should also always know (or be easily able to find out) what state a deployment is in.

Another important rule to remember when it comes to deployments (and CI in general) is: "Silent failures are&nbsp;<strong>very</strong>&nbsp;bad!"

This doesn't mean that failures need to be shown to the users of the software, it means we need to be aware if anything goes wrong. If we are aware of a problem, we can fix it. If the deployment system doesn't give any errors but fails, we may end up in a state where we believe we have fixed a critical bug but the deployment failed, leaving the bug in our production environment and us unaware of the situation.

### What does a good deployment system do?

Defining definitive rules or requirements for a deployment system is difficult, let's try anyway:
- Our deployment system should be able to fail gracefully at <strong>any</strong> step of the deployment.
- Our deployment system should <strong>never</strong> leave our software in a broken state.
- Our deployment system should let us know when a failure has happened. It's more important to notify about failure than about success.
- Our deployment system should allow us to roll back to a previous deployment
- Our deployment system should handle the situation where a user makes an HTTP request just before/during a deployment.
- Our deployment system should make sure that the software we are deploying meets the requirements we have set for this (e.g. don't deploy if tests haven't been run).

Let's define some things we&nbsp;<strong>want</strong>&nbsp;in this hypothetical deployment system too:
- We would like it to be fast
- We'd like to have no downtime during the deployment (this is distinct from the requirement we have for handling user requests just before/during the deployment).

Next we will have two sets of exercises for automating the deployment with GitHub Actions, one for <a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a>, another one for <a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. The process of deployment is always specific to the particular cloud provider, so you can also do both the exercise sets if you want to see the differences on how these services work with respect to deployments.

### Has the app been deployed?

Since we are not making any real changes to the app, it might be a bit hard to see if the app deployment really works. Let us create a dummy endpoint in the app that makes it possible to do some code changes and to ensure that the deployed version has really changed:

```
app.get('/version', (req, res) =&gt; {
  res.send('1') // change this string to ensure a new version deployed
})
```

Note that this endpoint works only in product build, if you start app with <code>npm start</code> the Express app is not used at all, so the endpoint does not exist!

### Exercises 10.-12. (Fly.io)

If you rather want to use other hosting options, there is an alternative set of exercises for&nbsp;<a href="https://fullstackopen.com/en/part11/deployment#exercises-11-10-11-12-render" target="_blank" rel="noreferrer noopener">Render</a>.

#### 10. Deploying your application to Fly.io

Setup your application in&nbsp;<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a>&nbsp;hosting service like the one we did in&nbsp;<a href="https://fullstackopen.com/en/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">part 3</a>.

In contrast to part 3, in this part we&nbsp;<em>do not deploy the code</em>&nbsp;to Fly.io ourselves (with the command&nbsp;<em>flyctl deploy</em>), we let the GitHub Actions workflow do that for us.

Before going to the automated deployment, we shall ensure in this exercise that the app can be deployed manually.

So, create a new app in Fly.io. After that generate a Fly.io API token with the command

```
fly tokens create deploy
```

You'll need the token soon for your deployment workflow so save it somewhere (but do not commit that to GitHub)!

As said, before setting up the deployment pipeline in the next exercise we will now ensure that a manual deployment with the command&nbsp;<em>flyctl deploy</em>&nbsp;works.

A couple of changes are needed.

The configuration file&nbsp;<em>fly.toml</em>&nbsp;should be modified to include the following:

```
app = 'fs-pdex'
primary_region = 'arn'

[build]

// BEGIN HIGHLIGHT
[env]
  PORT="5001"

[processes]
  app = "node app.js"
// END HIGHLIGHT

[http_service]
// BEGIN HIGHLIGHT
  internal_port = 5001 # ensure that this is same as above!
// END HIGHLIGHT
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpus = 1
  memory_mb = 1024
```

In <a href="https://fly.io/docs/reference/configuration/#the-processes-section" target="_blank" rel="noreferrer noopener">processes</a> we define the command that starts the application. Without this change, Fly.io just starts the React dev server and that causes it to shut down since the app itself does not start up. We will also set up the PORT to be passed to the app as an environment variable.

Deployment should now work&nbsp;<em>if</em>&nbsp;the production build exists in the local machine, that is, the command&nbsp;<em>npm build</em>&nbsp;is run.

Before moving to the next exercise, make sure that the manual deployment with the command&nbsp;<em>flyctl deploy</em>&nbsp;works!

#### 11. Automatic deployments to Fly.io

Extend the workflow with a step to deploy your application to Fly.io by following the advice given here. Check the most recent version of the <em>setup-flyctl</em> action from <a href="https://github.com/superfly/flyctl-actions" data-type="link" data-id="https://github.com/superfly/flyctl-actions">here</a>.

Note that the GitHub Action should create the production build (with&nbsp;<em>npm run build</em>) before the deployment step!

You need the authorization token that you just created for the deployment. The proper way to pass it's value to GitHub Actions is to use <em>Repository secrets</em>:

![صورة توضيحية](/images/mooc/c07c2407946e.webp)

Now the workflow can access the token value as follows:

```
${{secrets.FLY_API_TOKEN}}
```

If all goes well, your workflow log should look like this:

![صورة توضيحية](/images/mooc/0dadf65c45e0.webp)

<strong>Remember</strong>&nbsp;that it is always essential to keep an eye on what is happening in server logs when playing around with product deployments, so use&nbsp;<code>flyctl logs</code>&nbsp;early and use it often. No, use it all the time!

#### 12. Health check in Fly.io

Let us assume that we accidentally break the app by staring it to a wrong port:

const start = async () =&gt; {

```js
const start = async () => {<br>  await app.listen(PORT+1) // HIGHLIGHT LINE<br>  console.log(`server started on port ${PORT}`)<br>}
```

Our tests do not notice this breaking change (since the e2e-tests are run in development mode), and the app will be deployed in a non-functional state. How could we prevent this?

Fortunately, Fly.io has several configuration options that ensure a new application version is deployed to users only if it is in a <em>healthy state</em>.

One way to prevent broken deployments is to use an HTTP-level check defined in the <a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank" rel="noreferrer noopener">http_service.http_checks</a> section of the <em>fly.toml </em>configuration file. This type of check can be used to ensure that the app is in a functional state.

Add a simple endpoint for doing an application health check to the backend. You may, e.g., copy this code:

```
app.get('/health', (req, res) =&gt; {
  res.send('ok')
})
```

Configure <span style="margin: 0px; padding: 0px;">an <a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank">HTTP check</a> to ensure deployment health by making an</span> HTTP request to the defined health check endpoint.

You also need to set the <a href="https://fly.io/docs/reference/configuration/#picking-a-deployment-strategy" target="_blank" rel="noreferrer noopener">deployment strategy</a> (in the file <em>fly.toml</em>) of the app to be <em>canary</em>. This strategy ensures that only an app with a healthy state gets deployed.

Ensure that GitHub Actions notices if a deployment breaks your application:

![صورة توضيحية](/images/mooc/49e19711139f.webp)

You may simulate this e.g. as follows:

```
app.get('/health', (req, res) => {
  // BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
```

### Exercises 10.-12. (Render)

If you rather want to use other hosting options, there is an alternative set of exercises for <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration/chapter-4" target="_blank" rel="noreferrer noopener">Fly.io</a>.

#### 10. Deploying your application to Render

Set up your application in <a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. The setup is now not quite as straightforward as in <a href="https://fullstackopen.com/en/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">part 3</a>. You have to carefully think about what should go to these settings:

![صورة توضيحية](/images/mooc/f65d5bf2b1d9.webp)

If you need to run several commands in the build or start command, you may use a simple shell script for that.

Create eg. a file&nbsp;<em>build_step.sh</em>&nbsp;with the following content:

```
<strong>#!/bin/bash</strong>

echo "Build script"

# add the commands here
```

Give it execution permissions (Google or see e.g.&nbsp;<a href="https://www.guru99.com/file-permissions.html" target="_blank" rel="noreferrer noopener">this</a>&nbsp;to find out how) and ensure that you can run it from the command line:

```
$ ./build_step.sh
Build script
```

Other option is to use a&nbsp;<a href="https://docs.render.com/deploys#deploy-steps" target="_blank" rel="noreferrer noopener">Pre deploy command</a>, with that you may run one additional command before the deployment starts.

You also need to open the <em>Advanced settings</em> and turn the auto-deploy off since we want to control the deployment in the GitHub Actions:

![صورة توضيحية](/images/mooc/0b7fd8c8d040.webp)

Ensure now that you get the app up and running. Use the&nbsp;<em>Manual deploy</em>.

Most likely things will fail at the start, so remember to keep the&nbsp;<em>Logs</em>&nbsp;open all the time.

#### 11. Automatic deployments to Render

The next step is to automate the deployment.

There are some ready-made third-party Actions for Render deployment, but a more reliable option is to use <a href="https://render.com/docs/deploy-hooks" target="_blank" rel="noreferrer noopener">Render Deploy Hook</a>, which is a private URL to trigger the deployment. You can get it from your app settings:

![صورة توضيحية](/images/mooc/da8aade4bf23.webp)

DON'T USE the plain URL in your pipeline. Instead, create a GitHub secret for it:

![صورة توضيحية](/images/mooc/a6ec91c00fda.webp)

Then you can use them like this:

```
- name: Trigger deployment
  run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

The deployment takes some time. See the events tab of the Render dashboard to see when the new deployment is ready:

![صورة توضيحية](/images/mooc/71f026faeae0.webp)

#### 12. Health check in Render

All tests pass and the new version of the app gets automatically deployed to Render so everything seems to be in order. But does the app really work? Besides the checks done in the deployment pipeline, it is extremely beneficial to have also some "application level" health checks ensuring that the app for real is in a functional state.

The <a href="https://docs.render.com/deploys#zero-downtime-deploys" target="_blank" rel="noreferrer noopener">zero downtime deploys</a> in Render should ensure that your app stays functional all the time!

Add a simple endpoint for doing an application health check to the backend. You may e.g. copy this code:

```
app.get('/health', (req, res) =&gt; {
  res.send('ok')
})
```

Commit the code and push it to GitHub. Ensure that you can access the health check endpoint of your app.

Configure now a&nbsp;<em>Health Check Path</em>&nbsp;to your app. The configuration is done in the settings tab of the Render dashboard.

Make a change in your code, push it to GitHub, and ensure that the deployment succeeds.

Note that you can see the log of deployment by clicking the most recent deployment in the events tab.

When you have set up the health check, simulate a broken deployment by changing the code as follows:

```
app.get('/health', (req, res) => {
// BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
```

Push the code to GitHub and ensure that a broken version does not get deployed and the previous version of the app keeps running.

Before moving on, fix your deployment and ensure that the application works again as intended.

It might be a good idea to change the Render deployment policy to <em>override</em>, as described <a href="https://render.com/docs/deploys#managing-deploys" data-type="link" data-id="https://render.com/docs/deploys#managing-deploys">here</a>. Otherwise, the new deployment has to wait up to 15 minutes until Render cancels the current, broken deployment.

<div class="tasks">

**10. Deploying your application to cloud provider**

</div>

<div class="tasks">

**11. Automatic cloud deployments**

</div>

<div class="tasks">

**12. Health check**

</div>
