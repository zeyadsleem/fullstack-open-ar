---
part: 12
letter: c
title: "Chapter 3: Building and configuring environments"
mainImage: /images/part-12.svg
lang: en
---
In the previous section, we used two different base images: ubuntu and node, and did some manual work to get a simple "Hello, World!" running. The tools and commands we learned during that process will be helpful. In this section, we will learn how to build images and configure environments for our applications. We will start with a regular Express/Node.js backend and build on top of that with other services, including a MongoDB database.

### Dockerfile

Instead of modifying a container by copying files inside, we can create a new image that contains the "Hello, World!" application. The tool for this is the <a href="https://docs.docker.com/build/concepts/dockerfile/" data-type="link" data-id="https://docs.docker.com/build/concepts/dockerfile/">Dockerfile.</a> A Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile for the "Hello, World!" application.

Let us now create a directory and a file called <em>Dockerfile</em> inside that directory. Let's also put an <em>index.js</em> containing <em>console.log('Hello, World!')</em> next to the Dockerfile. The directory structure looks like this:

```
├── index.js
└── Dockerfile
```

Inside the Dockerfile we will tell the image three things:
- Use the <a href="https://hub.docker.com/_/node">node:24</a> as the base for our image
- Include the index.js file inside the image, so we don't need to manually copy it into the container
- When we run a container from the image, use Node to execute the index.js file.

The wishes above will translate into a basic Dockerfile. The best location to place this file is usually at the root of the project.

The resulting&nbsp;<em>Dockerfile</em>&nbsp;looks like this:

```
FROM node:24

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD ["node", "index.js"]
```

<a href="https://docs.docker.com/reference/dockerfile/#from" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#from">FROM</a> instruction tells Docker that the base for the image is node:24. <a href="https://docs.docker.com/reference/dockerfile/#copy" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#copy">COPY</a> instruction copies the file <em>index.js</em> from the host machine to the file with the same name in the image. The <a href="https://docs.docker.com/reference/dockerfile/#cmd" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#cmd">CMD</a> instruction specifies the default command that runs when you start a container with <code>docker run</code>. We are using the <a href="https://docs.docker.com/reference/dockerfile/#exec-form" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#exec-form">exec</a> form <code>CMD ["node", "index.js"]</code> that runs the <em>node</em> executable with <em>index.js</em> as its argument.

The <a href="https://docs.docker.com/reference/dockerfile/#workdir" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#workdir">WORKDIR</a> instruction was slipped in to ensure we don't interfere with the contents of the image. It will guarantee all of the following commands will have <em>/usr/src/app</em> set as the working directory. If the directory doesn't exist in the base image, it will be automatically created.

> If we do not specify a WORKDIR, we risk overwriting important files by accident. If you check the root (<em>/</em>) of the node:24 image with <code>docker run node:24 ls</code> you can notice all of the directories and files that are already included in the image.

Now we can use the command <code>docker build</code> to build an image based on the Dockerfile. Let's spice up the command with one additional flag: <code>-t</code> that will help us name the image:

```
$ docker build -t fs-hello-world .
[+] Building 3.9s (8/8) FINISHED
...
```

So the result is

> Docker please build with tag (you may think of the tag as the name of the resulting image) <em>fs-hello-world</em> the Dockerfile in this directory.

You can point to any Dockerfile, but in our case, a simple dot will mean the Dockerfile is in <em>this</em> directory. That is why the command ends with a dot. After the build is finished, you can run it with <code>docker run fs-hello-world</code>:

```
$ docker run fs-hello-world
Hello, World
```

As images are just files, they can be moved around, downloaded and deleted. You can list the images you have locally with <code>docker image ls</code>, delete them with <code>docker image rm</code>. See what other commands you have available with <code>docker image --help</code>.

One more thing: it was mentioned that the default command defined by the CMD in the Dockerfile, can be overwritten if needed. We could, e.g., open a bash session to the container and observe its content:

```
$ docker run -it fs-hello-world bash
root@2932e32dbc09:/usr/src/app# ls
index.js
root@2932e32dbc09:/usr/src/app#
```

### More meaningful image

Moving an Express server to a container should be as simple as moving the "Hello, World!" application inside a container. The only difference is that there are more files. Thankfully&nbsp;<em>COPY</em>&nbsp;instruction can handle all that. Let's delete the index.js and create a new Express server. Lets use&nbsp;<a href="https://expressjs.com/en/starter/generator.html" target="_blank" rel="noreferrer noopener">express-generator</a>&nbsp;to create a basic Express application skeleton.

```
$ npx express-generator
  ...

  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.

```
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

Great, so now we can navigate to <a href="http://localhost:3000/" target="_blank" rel="noreferrer noopener">http://localhost:3000</a> and the app is running there:

![صورة توضيحية](/images/mooc/7b576695c8d1.webp)

Containerizing that should be relatively easy based on the previous example.
- Use node as base
- Set working directory so we don't interfere with the contents of the base image
- Copy ALL of the files in this directory to the image
- Start with DEBUG=playground:* npm start

The <a href="https://docs.docker.com/reference/dockerfile/#shell-and-exec-form" target="_blank" rel="noreferrer noopener">exec form</a> of the CMD instruction expects arguments in the format ["executable", "param1", "param2", ...], meaning the first element must be an executable command. In our case, the command begins by setting an environment variable, which doesn’t satisfy this requirement. The correct approach is to set the environment variable using the  <a href="https://docs.docker.com/reference/dockerfile/#env" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#env">ENV</a> instruction instead.

Let us place the following Dockerfile at the root of the project:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

ENV DEBUG=playground:*

CMD ["npm", "start"]
```

Now we can build the image from the Dockerfile and run it:

```bash
docker build -t express-server .
docker run -p 3123:3000 express-server
```

The <code>-p</code> flag in the run command will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format is <code>-p host-port:application-port</code>.

The application is now running! Let's test it by sending a GET request to&nbsp;<a href="http://localhost:3123/" target="_blank" rel="noreferrer noopener">http://localhost:3123/</a>.

> If yours doesn't work, skip to the next section. There is an explanation why it may not work even if you followed the steps correctly.

Shutting down the app is a headache at the moment. Use another terminal and <code>docker kill</code>command to kill the application. The command <code>docker kill</code> will send a kill signal (SIGKILL) to the application to force it to shut down. It needs the name or the id of the container as an argument.

Note that when using the id as the argument, the beginning of the id is enough for Docker to know which container we mean.

```
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123-&gt;3000/tcp, :::3123-&gt;3000/tcp   infallible_booth

$ docker kill 48
  48
```

In the future, let's use the same port on both sides of <code>-p</code>. Just so we don't have to remember which one we happened to choose.

#### Fixing potential issues we created by copy-pasting

There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped an important step.

When we ran <code>npm install</code> on our machine, in some cases, the Node package manager may install operating system specific dependencies during the install step. We may accidentally move non-functional parts to the image with the COPY instruction. This can easily happen if we copy the <em>node_modules</em> directory into the image.

This is a critical thing to keep in mind when we build our images. It's best to do most things, such as running <code>npm install</code> during the build process <em>inside the container</em>, rather than doing those prior to building. The easy rule of thumb is to only copy files that you would push to GitHub. Build artifacts or dependencies should not be copied since those can be installed during the build process.

We can use a <em>.dockerignore</em> file to solve the problem. The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. The file should be placed next to the Dockerfile. Here is a possible content of a <em>.dockerignore</em>

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

In our case, the .dockerignore isn't the only thing required. We also need to install the dependencies during the build step. The <em>Dockerfile</em> changes to:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

// BEGIN HIGHLIGHT
RUN npm install

ENV DEBUG=express:*

CMD ["npm", "start"]
// END HIGHLIGHT
```

The <code>npm install</code> can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the <a href="https://docs.npmjs.com/cli/v9/commands/npm-ci" data-type="link" data-id="https://docs.npmjs.com/cli/v9/commands/npm-ci">ci</a> command.

Differences between ci and install:
- install may update the package-lock.json
- install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.
- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files

So in short:&nbsp;<em>ci</em>&nbsp;creates reliable builds, while&nbsp;<em>install</em>&nbsp;is the one to use when you want to install new dependencies.

As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use&nbsp;<em>ci</em>:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

// BEGIN HIGHLIGHT
RUN npm ci

ENV DEBUG=express:*

CMD ["npm", "start"]
// END HIGHLIGHT
```

Even better, we can use <code>npm ci --omit=dev</code> to not waste time installing development dependencies.

> As you noticed in the above comparison, <code>npm ci</code> deletes the node_modules folder, so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.

Now the Dockerfile should work again. Try it with <code>docker build -t express-server . &amp;&amp; docker run -p 3123:3000 express-server</code>

> Note that we are here chaining two bash commands with &amp;&amp;. We could get (nearly) the same effect by running both commands separately. When chaining commands with &amp;&amp; if one command fails, the next ones in the chain will not be executed.

### Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:
- Try to create as <strong>secure</strong> of an image as possible
- Try to create as <strong>small</strong> of an image as possible

Smaller images are more secure by having less attack surface area, and also move faster in deployment pipelines.

Snyk has a great list of the 10 best practices for Node/Express containerization. Read those from <a href="https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/" target="_blank" rel="noreferrer noopener">here</a>.

One significant issue remaining is that the application runs as root rather than a less-privileged user. Let’s make a final change to the Dockerfile and use the instruction <a href="https://docs.docker.com/reference/dockerfile/#user" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#user">USER</a> to set the user to a non-root.

```
FROM node:24

WORKDIR /usr/src/app

COPY --chown=node:node . . // HIGHLIGHT LINE

RUN npm ci

ENV DEBUG=playground:*

USER node // HIGHLIGHT LINE

CMD ["npm", "start"]
```

<div class="tasks">

**5. Containerizing a Node application**

</div>

### Using Docker compose

In the previous section, we created an Express server, knowing that it will run in port 3123, and used the commands <code>docker build -t express-server . &amp;&amp; docker run -p 3123:3000 express-server</code> to run it. This already looks like something you would need to put into a script to remember. Fortunately, Docker offers us a better solution.

<a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer noopener">Docker compose</a>&nbsp;is another fantastic tool, which can help us to manage containers. Let's start using compose as we learn more about containers as it will help us save some time with the configuration.

Now we can turn the previous spell into a yaml file. The best part about yaml files is that you can save these to a Git repository!

We will now create the file <em>docker-compose.yml</em> and place it at the root of the project, next to the Dockerfile. This time, we will use the same port for the host and the container. The file content is:

```
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

The meaning of each line is explained as a comment. If you want to see the full specification see the&nbsp;<a href="https://docs.docker.com/compose/compose-file/" target="_blank" rel="noreferrer noopener">documentation</a>.

Now we can use <code>docker compose up</code> to build and run the application. If we want to rebuild the images, we can use <code>docker compose up --build</code>.

You can also run the application in the background with <code>docker compose up -d</code> (<code>-d</code> for detached) and close it with <code>docker compose down</code>.

> <em>Note that some older Docker versions (especially in Windows) do not support the command&nbsp;docker compose. One way to circumvent this problem is to&nbsp;<a href="https://docs.docker.com/compose/install/" target="_blank" rel="noreferrer noopener">install</a>&nbsp;the stand alone command&nbsp;docker-compose&nbsp;that works mostly similarly to&nbsp;docker compose. However, the preferable fix is to update the Docker to a more recent version.</em>

Creating files like <em>docker-compose.yml</em> that <em>declare</em> what you want instead of script files that you need to run in a specific order or a specific number of times, is often a great practice.

<div class="tasks">

**6. Docker compose**

</div>

### Utilizing containers in development

When you are developing software, containerization can be used in various ways to improve your quality of life. By using containers, you can avoid configuring tools multiple times and, in many cases, skip installing them on your host machine entirely.

You can even containerize your entire development environment if that’s the direction you want to take, and we’ll come back to that idea later. For now, though, we’ll focus on running the Node application <em>inside</em> a container while keeping the rest of your workflow on the host.

The application we met in the previous exercises uses MongoDB. Let's explore&nbsp;<a href="https://hub.docker.com/" target="_blank" rel="noreferrer noopener">Docker Hub</a>&nbsp;to find a MongoDB image. Docker Hub is the default place where Docker pulls the images from, you can use other registries as well, but since we are already knee-deep in Docker it's a good choice. With a quick search, we can find&nbsp;<a href="https://hub.docker.com/_/mongo" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/mongo</a>

Create a new yaml called&nbsp;<em>todo-app/todo-backend/docker-compose.dev.yml</em>&nbsp;that looks like following:

```
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

The meaning of the two first environment variables defined above is explained on the Docker Hub page:

> <em>These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.</em>

The last environment variable&nbsp;<em>MONGO_INITDB_DATABASE</em>&nbsp;will tell MongoDB to create a database with that name.

You can use <code>-f</code> flag to specify a <em>file</em> to run the Docker Compose command, we have to use the flag now since we have more than one compose file. Let us now start the MongoDB:

```bash
docker compose -f docker-compose.dev.yml up -d
```

As said previously, currently we&nbsp;<strong>do not</strong>&nbsp;want to run the Node application inside a container. Developing while the application itself is inside a container is a challenge. We will explore that option later in this part.

Run the good old <code>npm install</code> first on your machine to set up the Node application. Then start the application with the relevant environment variable. You can modify the code to set them as the defaults or use the .env file. There is no harm in putting these keys on GitHub since they are only used in your local development environment. We'll just throw them in with the <code>npm run dev</code> to help you copy-paste.

```
MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

This won't be enough; we need to create a user to be authorized inside of the container. The url&nbsp;<a href="http://localhost:3000/todos" target="_blank" rel="noreferrer noopener">http://localhost:3000/todos</a>&nbsp;leads to an authentication error:

```
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
GET /todos 500 10015.695 ms - 519
MongooseError: Operation `todos.find()` buffering timed out after 10000ms
    at Timeout._onTimeout (/Users/mluukkai/opetus/2026-fs/osa12/tehtavat/todo-app/todo-backend/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:131:25)
    at listOnTimeout (node:internal/timers:605:17)
    at process.processTimers (node:internal/timers:541:7)
GET /todos 500 12.396 ms - 1808
MongoServerError: Command find requires authentication
    at Connection.sendCommand (/Users/mluukkai/opetus/2026-fs/osa12/tehtavat/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:320:27)
```

We could use the superadmin user to authenticate the database, so the following command would work

```
MONGO_URL=mongodb://root:example@localhost:3456/the_database?authSource=admin npm run dev
```

However, it is not good idea to use a superuser account for normal database access so we will opt for a more safe solution.

### Bind mount and initializing the database

In the MongoDB Docker Hub documentation, the section <a href="https://hub.docker.com/_/mongo/#initializing-a-fresh-instance">Initializing a fresh instance</a> shows how to provide JavaScript files that run when the Mongo container starts. This allows you to automate setup steps like creating users or initializing databases.

The exercise project has a file&nbsp;<em>todo-app/todo-backend/mongo/mongo-init.js</em>&nbsp;with contents:

```
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

This file will initialize the database with a user and a few todos. Next, we need to get it inside the container at startup.

We could create a new image FROM mongo and COPY the file inside, or we can use a&nbsp;<a href="https://docs.docker.com/storage/bind-mounts/" target="_blank" rel="noreferrer noopener">bind mount</a>&nbsp;to mount the file&nbsp;<em>mongo-init.js</em>&nbsp;to the container. Let's do the latter.

Bind mount is the act of binding a file (or directory) on the host machine to a file (or directory) in the container. A bind mount is done by adding a <code>-v</code> flag to the command <code>container run</code>. The syntax is <code>-v FILE-IN-HOST:FILE-IN-CONTAINER</code>.

Since we already learned about Docker Compose let's skip that. The bind mount is declared under key <em>volumes</em> in docker-compose.dev.yml. Otherwise, the format is the same, first host and then container:

```
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:       // HIGHLIGHT LINE
    - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js // HIGHLIGHT LINE
```

The result of the bind mount is that the file&nbsp;<em>mongo-init.js</em>&nbsp;in the mongo folder of the host machine is the same as the&nbsp;<em>mongo-init.js</em>&nbsp;file in the container's /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other. We don't need to make any changes during runtime. But this will be the key to software development in containers.

Run <code>docker compose -f docker-compose.dev.yml down --volumes</code> to ensure that nothing is left and start from a clean slate with <code>docker compose -f docker-compose.dev.yml up</code> to initialize the database.

If you see an error like this:

```
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

you may have a read permission problem. They are not uncommon when dealing with volumes. In the above case, you can use <code>chmod a+r mongo-init.js</code>, which will give everyone read access to that file. Be careful when using <em>chmod</em> since granting more privileges can be a security issue. Use the <em>chmod</em> only on the mongo-init.js on your computer.

Now starting the Express application with the correct environment variable should work:

```
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Let's check that the&nbsp;<a href="http://localhost:3000/todos" target="_blank" rel="noreferrer noopener">http://localhost:3000/todos</a>&nbsp;returns the two todos we inserted in the initialization. We can and&nbsp;<em>should</em>&nbsp;use Postman to test the basic functionality of the app, such as adding or deleting a todo.

### Still problems?

For some reason, the initialization of Mongo has caused problems for many.

If the app does not work and you still end up with the following error:

```
/Users/mluukkai/dev/fs-ci/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272
          callback(new MongoError(document));
                   ^
MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/dev/fs-ci/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272:20)
```

run these commands:

```bash
docker compose -f docker-compose.dev.yml down --volumes
docker image rm mongo
```

After these, try to start Mongo again.

If the problem persists, let us drop the idea of a volume altogether and copy the initialization script to a custom image. Create the following&nbsp;<em>Dockerfile</em>&nbsp;to the directory&nbsp;<em>todo-app/todo-backend/mongo</em>:

```
FROM mongo

COPY ./mongo-init.js /docker-entrypoint-initdb.d/
```

Build it to an image with the command:

```bash
docker build -t initialized-mongo .
```

Now change the&nbsp;<em>docker-compose.dev.yml</em>&nbsp;file to use the new image:

```
  mongo:
    image: initialized-mongo  // HIGHLIGHT LINE
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

Now the app should finally work.

### Persisting data with volumes

By default, database containers are not going to preserve our data. When you close the database container you&nbsp;<em>may or may not</em>&nbsp;be able to get the data back.

> Mongo is actually a rare case in which the container indeed does preserve the data. This happens, since the developers who made the Docker image for Mongo have defined a volume to be used. <a href="https://github.com/docker-library/mongo/blob/master/8.0/Dockerfile#L111" target="_blank" rel="noreferrer noopener">This line</a> in the Dockerfile will instruct Docker to preserve the data in a volume.

There are two distinct methods to store the data:
- Declaring a location in your filesystem (called <a href="https://docs.docker.com/storage/bind-mounts/" target="_blank" rel="noreferrer noopener">bind mount</a>)
- Letting Docker decide where to store the data (<a href="https://docs.docker.com/storage/volumes/" target="_blank" rel="noreferrer noopener">volume</a>)

The first choice is preferable in most cases whenever one&nbsp;<em>really</em>&nbsp;needs to avoid the data being deleted.

Let's see both in action with Docker compose. Let us start with&nbsp;<em>bind mount:</em>

```
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db // HIGHLIGHT LINE
```

The above will create a directory called&nbsp;<em>mongo_data</em>&nbsp;to your local filesystem and map it into the container as&nbsp;<em>/data/db</em>. This means the data in&nbsp;<em>/data/db</em>&nbsp;is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore.

A similar outcome can be achieved with a&nbsp;<em>named volume:</em>

```
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db // HIGHLIGHT LINE

volumes:   // HIGHLIGHT LINE
  mongo_data: // HIGHLIGHT LINE
```

Now the volume is created and managed by Docker. After starting the application (<code>docker compose -f docker-compose.dev.yml up</code>) you can list the volumes with <code>docker volume ls</code>, inspect one of them with <code>docker volume inspect</code> and even delete them with <code>docker volume rm</code>:

```
$ docker volume ls
DRIVER    VOLUME NAME
local     todo-backend_mongo_data
$ docker volume inspect todo-backend_mongo_data
[
    {
        "CreatedAt": "2026-03-01T11:48:30Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.config-hash": "04a085ca56ca9326ae3e24058b0dc2a710003ba3ca583a2e333b4d6c491cfb94",
            "com.docker.compose.project": "todo-backend",
            "com.docker.compose.version": "2.33.1",
            "com.docker.compose.volume": "mongo_data"
        },
        "Mountpoint": "/var/lib/docker/volumes/todo-backend_mongo_data/_data",
        "Name": "todo-backend_mongo_data",
        "Options": null,
        "Scope": "local"
    }
]
```

The named volume is still stored in your local filesystem but figuring out <em>where</em> may not be as trivial as with the previous option.

<div class="tasks">

**7. Little bit of MongoDB coding**

</div>

### Debugging issues in containers

> <em>When coding, you most likely end up in a situation where everything is broken.</em>
>
> - Matti Luukkainen

When developing with containers, we need to learn new tools for debugging, since we can not just "console.log" everything. When code has a bug, you may often be in a state where at least something works, so you can work forward from that. Configuration most often is in either of two states: 1. working or 2. broken. We will go over a few tools that can help when your application is in the latter state.

When developing software, you can safely progress step by step, all the time verifying that what you have coded behaves as expected. Often, this is not the case when doing configurations. The configuration you may be writing can be broken until the moment it is finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you need to take a moment and think about the various ways you could confirm something is working.

<em>Question Everything</em>&nbsp;is still applicable here. As said in&nbsp;<a href="https://fullstackopen.com/en/part3/saving_data_to_mongo_db" target="_blank" rel="noreferrer noopener">part 3</a>: The key is to be systematic. Since the problem can exist anywhere,&nbsp;<em>you must question everything</em>, and eliminate all possible sources of error one by one.

For myself, the most valuable method of debugging is stopping and thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple, alternate, solution or quick google search that will get me moving forward.

#### exec

The Docker command&nbsp;<a href="https://docs.docker.com/engine/reference/commandline/exec/" target="_blank" rel="noreferrer noopener">exec</a>&nbsp;is a heavy hitter. It can be used to jump right into a container when it's running.

Let's start a web server in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose&nbsp;<a href="https://www.nginx.com/" target="_blank" rel="noreferrer noopener">Nginx</a>&nbsp;which is, among other things, a server capable of serving static HTML files. It has a default index.html that we can replace.

```
$ docker container run -d nginx
```

Ok, now the questions are:
- Where should we go with our browser?
- Is it even running?

We know how to answer the latter: by listing the running containers.

```
$ docker container ls
CONTAINER ID   IMAGE   COMMAND  CREATED     STATUS    PORTS     NAMES
3f831a57b7cc   nginx   ...      3 sec ago   Up 2 sec  80/tcp    keen_darwin
```

Yes! We got the first question answered as well. It seems to listen on port 80, as seen on the output above.

Let's shut it down and restart with the <code>-p</code> flag to have our browser access it.

```
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

> <em><strong>Editor's note:</strong> when doing development, it is <strong>essential</strong> to constantly follow the container logs. I'm usually not running containers in a detached mode (that is with <code>-d</code>) since it requires a bit of an extra effort to open the logs.</em>
>
> <em>When I'm 100% sure that everything works... no, when I'm 200% sure, then I might relax a bit and start the containers in detached mode. Until everything again falls apart and it is time to open the logs again.</em>

Let's look at the app by going to <a href="http://localhost:8080/" target="_blank" rel="noreferrer noopener">http://localhost:8080</a>. It seems that it is showing the wrong message! Let's hop right into the container and fix this. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags <code>-it</code> will ensure that we can interact with the container:

```
$ docker container ls
CONTAINER ID   IMAGE     COMMAND  PORTS                  NAMES
7edcb36aff08   nginx     ...      0.0.0.0:8080-&gt;80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

Now that we are in, we need to find the faulty file and replace it. Quick Google tells us that file itself is&nbsp;<em>/usr/share/nginx/html/index.html</em>.

Let's move to the directory and delete the file

```
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

Now, if we go to&nbsp;<a href="http://localhost:8080/" target="_blank" rel="noreferrer noopener">http://localhost:8080/</a>&nbsp;we know that we deleted the correct file. The page shows 404. Let's replace it with one containing the correct contents:

```
root@7edcb36aff08:/# echo "Hello, exec!" &gt; index.html
```

Refresh the page, and our message is displayed! Now we know how exec can be used to interact with the containers. Remember that all of the changes are lost when the container is deleted. To preserve the changes, you must use&nbsp;<code>commit</code >&nbsp;just as we did in&nbsp;<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers/chapter-2" target="_blank" rel="noreferrer noopener">previous section</a>.

<div class="tasks">

**8. Mongo CLI**

</div>

### Redis

<a href="https://redis.io/" target="_blank" rel="noreferrer noopener">Redis</a> is a <a href="https://redis.com/nosql/key-value-databases/" target="_blank" rel="noreferrer noopener">key-value</a> storage, meaning it stores data as simple pairs: a <strong>key</strong> and the <strong>value</strong> associated with it. Unlike document‑oriented databases such as MongoDB, Redis does not organize data into collections or tables. Instead, it holds individual pieces of data that you retrieve directly by referencing their keys.

By default, Redis works&nbsp;<em>in-memory</em>, which means that it does not store data persistently.

An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch and save until it's no longer valid. After the cache becomes invalid, you would then fetch the data again and store it in the cache.

Redis has nothing to do with containers. But since we are already able to add&nbsp;<em>any</em>&nbsp;3rd party service to your applications, why not learn about a new one?

<div class="tasks">

**9. Set up Redis for the project**

</div>

<div class="tasks">

**10. Get Set Ready!**

</div>

<div class="tasks">

**11. Redis CLI**

</div>

### Persisting data with Redis

In the previous section, it was mentioned that&nbsp;<em>by default</em>&nbsp;Redis does not persist the data. However, the persistence is easy to toggle on. We only need to start the Redis with a different command, as instructed by the&nbsp;<a href="https://hub.docker.com/_/redis" target="_blank" rel="noreferrer noopener">Docker hub page</a>:

```
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

The data will now be persisted to the directory&nbsp;<em>redis_data</em>&nbsp;of the host machine. Remember to add the directory to .gitignore!

#### Other functionality of Redis

In addition to the GET, SET and DEL operations on keys and values, Redis can do also quite a lot more. It can for example automatically expire keys, which is a very useful feature when Redis is used as a cache.

Redis can also be used to implement the so-called&nbsp;<a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank" rel="noreferrer noopener">publish-subscribe</a>&nbsp;(or PubSub) pattern which is an asynchronous communication mechanism for distributed software. In this scenario, Redis works as a&nbsp;<em>message broker</em>&nbsp;between two or more services. Some of the services are&nbsp;<em>publishing</em>&nbsp;messages by sending those to Redis, which on arrival of a message, informs the parties that have&nbsp;<em>subscribed</em>&nbsp;to those messages.

<div class="tasks">

**12. Persisting data in Redis**

</div>
