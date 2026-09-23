---
part: 12
letter: d
title: "Chapter 4: Basics of Container Orchestration"
mainImage: /images/part-12.svg
lang: en
---
We have now a basic understanding of Docker and can use it to easily set up eg. a database for our app. Let us now move our focus to the frontend.

### React in container

Let's create and containerize a React application next. We start with the usual steps:

```
$ npm create vite@latest hello-front -- --template react
$ cd hello-front
$ npm install
```

The next step is to turn the JavaScript code and CSS, into production-ready static files. Vite already has&nbsp;<em>build</em>&nbsp;as an npm script so let's use that:

```
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

Great! The final step is figuring out a way to use a server to serve the static files. As you may know, we could use <a href="https://expressjs.com/en/starter/static-files.html" target="_blank" rel="noreferrer noopener">express.static</a> with the Express server to serve the static files. I'll leave that as an exercise for you to do at home. Instead, we are going ahead and start writing our Dockerfile:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

That looks about right. Let's build it and see if we are on the right track. Our goal is to have the build succeed without errors. Then we will use bash to check inside of the container to see if the files are there.

```
$ docker build . -t hello-front
 => [4/5] RUN npm ci
 => [5/5] RUN npm run
 ...
 => => naming to docker.io/library/hello-front

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
Dockerfile  dist	      index.html    package-lock.json  public  vite.config.js
README.md   eslint.config.js  node_modules  package.json       src

root@98fa9483ee85:/usr/src/app# ls dist
  assets	index.html  vite.svg
```

A valid option for serving static files now that we already have Node in the container is&nbsp;<a href="https://www.npmjs.com/package/serve" target="_blank" rel="noreferrer noopener">serve</a>. Let's try installing serve and serving the static files while we are inside the container.

```
root@98fa9483ee85:/usr/src/app# npm install -g serve

  added 89 packages in 2s

root@98fa9483ee85:/usr/src/app# serve -n dist

   ┌────────────────────────────────────────┐
   │                                        │
   │   Serving!                             │
   │                                        │
   │   - Local:    http://localhost:3000    │
   │   - Network:  http://172.17.0.2:3000   │
   │                                        │
   └────────────────────────────────────────┘
```

Great! Let's ctrl+c to exit out and then add those to our Dockerfile.

The installation of serve turns into a RUN in the Dockerfile. This way the dependency is installed during the build process. The command to serve the&nbsp;<em>dist</em>&nbsp;directory will become the command to start the container:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

// BEGIN HIGHLIGHT
RUN npm install -g serve
CMD ["serve", "-n", "dist"]
// END HIGHLIGHT
```

When we now build the image with <code>docker build . -t hello-front</code> and run it with <code>docker run -p 5001:3000 hello-front</code>, the app will be available in <a href="http://localhost:5001/" target="_blank" rel="noreferrer noopener">http://localhost:5001</a>.

### Using multiple stages

While serve is a&nbsp;<em>valid</em>&nbsp;option, we can do better. A good goal is to create Docker images so that they do not contain anything irrelevant. With a minimal number of dependencies, images are less likely to break or become vulnerable over time.

<a href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noreferrer noopener">Multi-stage builds</a>&nbsp;are designed to split the build process into many separate stages, where it is possible to limit what parts of the image files are moved between the stages. That opens possibilities for limiting the size of the image since not all the by-products of the build are necessary for the resulting image. Smaller images are faster to upload and download and they help reduce the number of vulnerabilities that your software may have.

With multi-stage builds, a tried and true solution like&nbsp;<a href="https://en.wikipedia.org/wiki/Nginx" target="_blank" rel="noreferrer noopener">Nginx</a>&nbsp;can be used to serve static files without a lot of headaches. The Docker Hub&nbsp;<a href="https://hub.docker.com/_/nginx" target="_blank" rel="noreferrer noopener">page for Nginx</a>&nbsp;tells us the required info to open the ports and "Hosting some simple static content".

Let's use the previous Dockerfile but change the FROM to include the name of the stage:

```
# The first FROM is now a stage called build-stage
FROM node:24 AS build-stage // HIGHLIGHT LINE
WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.29-alpine // HIGHLIGHT LINE

# COPY the directory dist from the build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html // HIGHLIGHT LINE
```

We have also declared&nbsp;<em>another stage</em>, where only the relevant files of the first stage (the&nbsp;<em>dist</em>&nbsp;directory, that contains the static content) are copied.

After we build it again, the image is ready to serve the static content. The default port will be 80 for Nginx, so something like <code>-p 8000:80</code> will work, so the parameters of the <code>docker run</code> need to be changed a bit.

Multi-stage builds also include some internal optimizations that may affect your builds. As an example, multi-stage builds skip stages that are not used. If we wish to use a stage to replace a part of a build pipeline, like testing or notifications, we must pass&nbsp;<strong>some</strong>&nbsp;data to the following stages. In some cases this is justified: copy the code from the testing stage to the build stage. This ensures that you are building the tested code.

<div class="tasks">

**13. Todo application frontend**

</div>

<div class="tasks">

**14. Testing during the build process**

</div>

### Development in containers

Let's move the whole todo application development to a container. There are a few reasons why you would want to do that:
- To keep the environment similar between development and production to avoid bugs that appear only in the production environment
- To avoid differences between developers and their personal environments that lead to difficulties in application development
- To help new team members hop in by having them install container runtime - and requiring nothing else.

These all are great reasons. The tradeoff is that we may encounter some unconventional behavior when we aren't running the applications like we are used to. We will need to do at least two things to move the application to a container:
- Start the application in development mode
- Access the files with VS Code

Let's start with the frontend. Since the Dockerfile will be significantly different from the production Dockerfile, we'll create a new one called <em>dev.Dockerfile</em>.

<strong>Note</strong>&nbsp;we shall use the name&nbsp;<em>dev.Dockerfile</em>&nbsp;for development configurations and&nbsp;<em>Dockerfile</em>&nbsp;otherwise.

Starting Vite in development mode should be easy. Let's start with the following:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]
```

> Note the extra parameters&nbsp;<em>-- --host</em>&nbsp;in the&nbsp;<em>CMD</em>. Those are needed to expose the development server to be visible outside the Docker network. By default the development server is exposed only to localhost, and despite we access the frontend still using the localhost address, it is in reality attached to the Docker network.

During build the flag <code>-f</code> can be used to tell which file to use, it would otherwise default to Dockerfile, so the following command will build the image:

```bash
docker build -f ./dev.Dockerfile -t hello-front-dev .
```

Vite will be served in port 5173, so you can test that it works by running a container with that port published.

The second task, accessing the files with VSCode, is not yet taken care of. There are at least two ways of doing this:
- <a href="https://code.visualstudio.com/docs/remote/containers" target="_blank" rel="noreferrer noopener">The Visual Studio Code Remote - Containers extension</a>
- Volumes, the same thing we used to preserve data with the database

Let's go over the latter since that will work with other editors as well. Let's do a trial run with the flag <code>-v</code>. If that works, then we will move the configuration to a docker-compose file.

To use the <code>-v</code>, we will need to tell it the current directory. The command <code>pwd</code> should output the path to the current directory for us. Let's try this with <code>echo $(pwd)</code> in the command line. We can use that as the left side for <code>-v</code> to map the current directory to the inside of the container or we can use the full directory path.

```
$ docker run -p 5173:5173 -v "$(pwd):/usr/src/app/" hello-front-dev
&gt; todo-vite@0.0.0 dev
&gt; vite --host

  VITE v5.1.6  ready in 130 ms
```

Now we can edit the file&nbsp;<em>src/App.jsx</em>, and the changes should be hot-loaded to the browser!

If you have a MacBook M-series, the above command fails. In the error message, we notice the following:

```
Error: Cannot find module @rollup/rollup-linux-arm64-gnu
```

The problem is the library&nbsp;<a href="https://www.npmjs.com/package/rollup" target="_blank" rel="noreferrer noopener">rollup</a>&nbsp;that has its own version for all operating systems and processor architectures. Due to the volume mapping, the container is now using the&nbsp;<em>node_modules</em>&nbsp;from the host machine directory where the&nbsp;<em>@rollup/rollup-darwin-arm64</em>&nbsp;(the version suitable Mac M1/M2) is installed, so the right version of the library for the container&nbsp;<em>@rollup/rollup-linux-arm64-gnu</em>&nbsp;is not found.

There are several ways to fix the problem. Let's use the perhaps simplest one. Start the container with bash as the command, and run the&nbsp;<em>npm install</em>&nbsp;inside the container:

```
$ docker run -it -v "$(pwd):/usr/src/app/" hello-front-dev bash
root@b83e9040b91d:/usr/src/app# npm install
```

Now both versions of the library rollup are installed and the container works!

Next, let's move the config to the file&nbsp;<em>docker-compose.dev.yml</em>. This file should be at the root of the project as well:

```
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 5173:5173
    container_name: hello-front-dev # This will name the container hello-front-dev
```

With this configuration, <code>docker compose -f docker-compose.dev.yml up</code> can run the application in development mode. You don't even need Node installed to develop it!

<strong>Note</strong>&nbsp;we shall use the name&nbsp;<em>docker-compose.dev.yml</em>&nbsp;for development environment compose files, and the default name&nbsp;<em>docker-compose.yml</em>&nbsp;otherwise.

Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency <strong>inside</strong> the container. So instead of doing e.g. <code>npm install axios</code>, you have to do it in the running container e.g. <code>docker exec hello-front-dev npm install axios</code>, or add it to the package.json and run <code>docker build</code> again.

<div class="tasks">

**15. Set up a frontend development environment**

</div>

### Communication between containers in a Docker network

The Docker Compose tool sets up a network between the containers and includes a DNS to easily connect two containers. Let's add a new service to the Docker Compose and we shall see how the network and DNS work.

<a href="https://www.busybox.net/" target="_blank" rel="noreferrer noopener">Busybox</a>&nbsp;is a small executable with multiple tools that you may need. It is called "The Swiss Army Knife of Embedded Linux", and we definitely can use it to our advantage.

BusyBox can help us debug our configurations, so if you get lost in the later exercises of this section, use it to find out what works and what doesn't. Let's use it to explore what was just mentioned: that containers exist inside a network and can easily connect to each other. Busybox can be added to the mix by changing <em>docker-compose.dev.yml</em> to:

```
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173
    container_name: hello-front-dev

  debug-helper:    // HIGHLIGHT LINE
    image: busybox // HIGHLIGHT LINE
```

The Busybox container won't have any process running inside so we can not <code>exec</code> in there. Because of that, the output of <code>docker compose up</code> will also look like this:

```
$ docker compose -f docker-compose.dev.yml up                                                                                    0.0s
Attaching to front-dev, debug-helper-1
debug-helper-1 exited with code 0
front-dev       |
front-dev       | > todo-vite@0.0.0 dev
front-dev       | > vite --host
front-dev       |
front-dev       |
front-dev       |   VITE v7.3.1  ready in 153 ms
```

This is expected as it's just a toolbox. Let's use it to send a request to hello-front-dev and see how the DNS works. While the hello-front-dev is running, we can do the request with&nbsp;<a href="https://en.wikipedia.org/wiki/Wget" target="_blank" rel="noreferrer noopener">wget</a>&nbsp;since it's a tool included in Busybox to send a request from the debug-helper to hello-front-dev.

With Docker Compose we can use <code>docker compose run SERVICE COMMAND</code> to run a service with a specific command. Command wget requires the flag <code>-O -</code> to output the response to the stdout:

```
$ docker compose -f docker-compose.dev.yml run debug-helper wget --header="Host: localhost" -O - http://app:5173

Connecting to app:5173 (192.168.240.3:5173)
writing to stdout
&lt;!doctype html>
&lt;html lang="en">
  &lt;head>
    &lt;script type="module">
      ...
```

The URL <a href="http://app:5173">http://app:5173</a> is the interesting part here. We simply said to connect to port 5173 of the service <em>app</em>. <em>app</em> is the name of the service specified in the <em>docker-compose.dev.yml</em> file:

```
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173 // HIGHLIGHT LINE
    container_name: hello-front-dev
```

The port used is the port from which the application is available in that container, also specified in the&nbsp;<em>docker-compose.dev.yml</em>. The port does not need to be published for other services in the same network to be able to connect to it. The "ports" in the docker-compose file are only for external access.

Let's change the port configuration in the&nbsp;<em>docker-compose.dev.yml</em>&nbsp;to emphasize this:

```
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 3210:5173  // HIGHLIGHT LINE
    container_name: hello-front-dev

  debug-helper:
    image: busybox
```

With&nbsp;<em>docker compose up</em>&nbsp;the application is available in&nbsp;<a href="http://localhost:3210/" target="_blank" rel="noreferrer noopener">http://localhost:3210</a>&nbsp;at the&nbsp;<em>host machine</em>, but the command

```bash
docker compose -f docker-compose.dev.yml run debug-helper wget --header="Host: localhost" -O - http://app:5173
```

works still since the port is still 5173 within the docker network.

The below image illustrates what happens. The command <code>docker compose run</code> asks debug-helper to send the request within the network. While the browser in the host machine sends the request from outside of the network.

![صورة توضيحية](/images/mooc/8913aee7153c.webp)

Now that you know how easy it is to find other services in the <em>docker-compose.yml</em> and we have nothing to debug we can remove the debug-helper and revert the ports to 5173:5173 in our compose file.

### On accessing the Vite Dev Server

You may wonder why the above command contains <code>header="Host: localhost"</code>. The reason is that by <a href="https://vite.dev/config/server-options.html#server-allowedhosts" data-type="link" data-id="https://vite.dev/config/server-options.html#server-allowedhosts">default</a> Vite Dev Server is only allowed to respond if the host is <em>localhost</em>. Now the host name inside the Docker network is <em>app</em>, and if we do not set the Host header, we will get<em> HTTP/1.1 403 Forbidden</em> as response. We can allow more host names by editing the file <em>vite.config.js</em>:

```js
import { defineConfig } from 'vite'<br>import react from '@vitejs/plugin-react'<br><br>export default defineConfig({<br>  plugins: [react()],<br>  server: {<br>    allowedHosts: ['app', 'localhost'],<br>  }<br>})
```

Now we do not need the Host header and the following works:

```bash
docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173
```

<div class="tasks">

**16. Run todo-backend in a development container**

</div>

### Communications between containers in a more ambitious environment

Next, we will configure a&nbsp;<a href="https://en.wikipedia.org/wiki/Reverse_proxy" target="_blank" rel="noreferrer noopener">reverse proxy</a>&nbsp;to our docker-compose.dev.yml. According to wikipedia

> <em>A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself.</em>

So in our case, the reverse proxy will be the single point of entry to our application, and the final goal will be to set both the React frontend and the Express backend behind the reverse proxy.

There are multiple different options for a reverse proxy implementation, such as Traefik, Caddy, Nginx, and Apache (ordered by initial release from newer to older).

Our pick is&nbsp;<a href="https://hub.docker.com/_/nginx" target="_blank" rel="noreferrer noopener">Nginx</a>.

Let us now put the&nbsp;<em>hello-frontend</em>&nbsp;behind the reverse proxy.

Let us now create a file <em>nginx.dev.conf</em> in the project root and take the following template as a starting point. We will need to do minor edits to have our application running:

```
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot reload to work
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      # Requests are directed to http://localhost:5173
      proxy_pass http://localhost:5173;
    }
  }
}
```

<strong>Note</strong>&nbsp;we are using the familiar naming convention also for Nginx,&nbsp;<em>nginx.dev.conf</em>&nbsp;for development configurations, and the default name&nbsp;<em>nginx.conf</em>&nbsp;otherwise.

Next, create an Nginx service in the <em>docker-compose.dev.yml</em> file. Add a volume as instructed in the Docker Hub page where the right side is <em>:/etc/nginx/nginx.conf:ro</em>, the final <em>ro</em> declares that the volume will be <em>read-only</em>:

```
services:
  app:
    # ...
  nginx:
    image: nginx:1.29
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app # wait for the frontend container to be started
```

with that added, we can run <code>docker compose -f docker-compose.dev.yml up</code> and see what happens.

```
$ docker container ls
CONTAINER ID   IMAGE            COMMAND  PORTS                   NAMES
a02ae58f3e8d   nginx:1.29.1     ...      0.0.0.0:8080->80/tcp    reverse-proxy
5ee0284566b4   hello-front-dev  ...      0.0.0.0:5173->5173/tcp  hello-front-dev
```

Connecting to&nbsp;<a href="http://localhost:8080/" target="_blank" rel="noreferrer noopener">http://localhost:8080</a>&nbsp;will lead to a familiar-looking page with 502 status.

This is because directing requests to&nbsp;<a href="http://localhost:5173/" target="_blank" rel="noreferrer noopener">http://localhost:5173</a>&nbsp;leads to nowhere as the Nginx container does not have an application running in port 5173. By definition, localhost refers to the current computer used to access it. Since the localhost is unique for each container, it always points to the container itself.

Let's test this by going inside the Nginx container and using curl to send a request to the application itself. In our usage curl is similar to wget, but won't need any flags.

```
$ docker exec -it reverse-proxy bash

root@374f9e62bfa8:\# curl http://localhost:80
  &lt;html&gt;
  &lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
  ...
```

To help us, Docker Compose has set up a network when we ran <code>docker compose up</code>. It has also added all of the containers mentioned in the <em>docker-compose.dev.yml</em> to the network. A DNS makes sure we can find the other containers in the network. The containers are each given two names: the service name and the container name and both can be used to communicate with a container.

Since we are inside the container, we can also test the DNS! Let's curl the service name (app) in port 5173

```
root@374f9e62bfa8:\# curl http://app:5173
&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;script type="module" src="/@vite/client"&gt;&lt;/script&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" type="image/svg+xml" href="/vite.svg" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;Vite + React&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
    &lt;script type="module" src="/src/main.jsx"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

That is it! Let's replace the proxy_pass address in nginx.dev.conf with that one.

One more thing: we added an option&nbsp;<a href="https://docs.docker.com/compose/compose-file/05-services/#depends_on" target="_blank" rel="noreferrer noopener">depends_on</a>&nbsp;to the configuration that ensures that the&nbsp;<em>nginx</em>&nbsp;container is not started before the frontend container&nbsp;<em>app</em>&nbsp;is started:

```
services:
  app:
    # ...
  nginx:
    image: nginx:1.29
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:      // HIGHLIGHT LINE
      - app // HIGHLIGHT LINE
```

If we do not enforce the starting order with&nbsp;<em>depends_on</em>&nbsp;there a risk that Nginx fails on startup since it tries to resolve all DNS names that are referred in the config file:

```
events { }

http {
  server {
    listen 80;

    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      proxy_pass http://app:5173;    // HIGHLIGHT LINE
    }
  }
}
```

Note that&nbsp;<em>depends_on</em>&nbsp;does not guarantee that the service in the depended container is ready for action, it just ensures that the container has been started (and the corresponding entry is added to DNS). If a service needs to wait for another service to become ready before the startup,&nbsp;<a href="https://docs.docker.com/compose/startup-order/" target="_blank" rel="noreferrer noopener">other solutions</a>&nbsp;should be used.

<div class="tasks">

**17. Set up an Nginx reverse proxy server in front of todo-frontend**

</div>

<div class="tasks">

**18. Configure the Nginx server to be in front of todo-backend**

</div>

<div class="tasks">

**19. Connect the services, todo-frontend with todo-backend**

</div>

### Tools for Production

Containers are fun tools to use in development, but the best use case for them is in the production environment. There are many more powerful tools than Docker Compose to run containers in production.

Heavyweight container orchestration tools like&nbsp;<a href="https://kubernetes.io/" target="_blank" rel="noreferrer noopener">Kubernetes</a>&nbsp;allow us to manage containers on a completely new level. These tools hide away the physical machines and allow us, the developers, to worry less about the infrastructure.

If you are interested in learning more in-depth about containers come to the&nbsp;<a href="https://devopswithdocker.com/" target="_blank" rel="noreferrer noopener">DevOps with Docker</a>&nbsp;course and you can find more about Kubernetes in the advanced 5 credit&nbsp;<a href="https://devopswithkubernetes.com/" target="_blank" rel="noreferrer noopener">DevOps with Kubernetes</a>&nbsp;course. You should now have the skills to complete both of them!

###

<div class="tasks">

**20. Containerized production env**

</div>

<div class="tasks">

**21. The smoke test**

</div>

<div class="tasks">

**22. My containerized dev env**

</div>

<div class="tasks">

**23. My containerized prod env**

</div>

<div class="tasks">

**24. Your GitHub repository**

</div>
