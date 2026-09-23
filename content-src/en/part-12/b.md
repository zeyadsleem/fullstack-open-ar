---
part: 12
letter: b
title: "Chapter 2: Introduction to Containers"
mainImage: /images/part-12.svg
lang: en
---
Software development spans the entire lifecycle—from envisioning and designing a solution, to implementing it, releasing it to users, and maintaining it over time. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle.

Containers encapsulate your application into a single package. This package will include the application and all of its dependencies. As a result, each container can run isolated from the other containers.

Containers isolate applications from the host system, limiting their access to files and system resources by default. Developers can explicitly grant access (for example, mounting specific directories or exposing devices) and define resource limits such as CPU, memory, network, and storage. This controlled isolation improves security, reproducibility, and portability across environments.

To be more specific, containers are a form of OS‑level virtualization. The closest comparison is a virtual machine (VM): VMs let you run multiple operating systems on a single physical host, each with its own full OS stack. Containers, by contrast, share the host’s operating system and run your application in an isolated user-space environment. Because containers don’t boot a separate OS, they have far less overhead than VMs and are typically used to run a single process or service efficiently.

As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And as they isolate the software running inside, it enables the software to run identically almost anywhere. As such, they are the go-to option in any cloud environment or application with more than a handful of users.

Cloud services like AWS, Google Cloud, and Microsoft Azure all support containers in multiple different forms. These include AWS Fargate and Google Cloud Run, both of which run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your own machine.

Containers are widely used in cloud environments and in local development. What are the benefits of using containers? Here are two common scenarios:

<em>Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require installing different versions of Node.</em>

You can probably use nvm, virtual machines, or dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere.

<em>Scenario 2: Your application runs on your machine. You need to move the application to a server.</em>

It is not uncommon that the application just does not run on the server despite it works just fine on your machine. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same execution environment both on your machine and on the server. It is not perfect: different hardware can be an issue, but you can limit the differences between environments.

Sometimes you may hear about the&nbsp;<em>"Works in my container"</em>&nbsp;issue. The phrase describes a situation in which the application works fine in a container running on your machine but breaks when the container is started on a server. The phrase is a play on the infamous&nbsp;<em>"Works on my machine"</em>&nbsp;issue, which containers are often promised to solve. The situation also is most likely a usage error.

### About this part

In this part, the focus of our attention will not be on the JavaScript code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to&nbsp;<em>a single GitHub repository</em>&nbsp;which will include all of the source code and the configurations that you do during this part.

You will need basic knowledge of Node, Express, and React. Only the core parts, 1 through 5, are required to be completed before this part.

> Warning
>
> Since we are stepping right outside of our comfort zone as JavaScript developers, this part may require you to take a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.
>
> If you have only ever used a graphical user interface and never touched e.g. Linux or terminal on Mac, or if you get stuck in the first exercises we recommend doing the Part 1 of "Computing tools for CS studies" first: <a href="https://tkt-lapio.github.io/en/" target="_blank" rel="noreferrer noopener">https://tkt-lapio.github.io/en/</a>. Skip the section for "SSH connection" and Exercise 11. Otherwise, it includes everything you are going to need to get started here!

<div class="tasks">

**1. Using a computer (without a graphical user interface)**

</div>

### Tools of the trade

The basic tools you are going to need vary between operating systems:
- <a href="https://docs.microsoft.com/en-us/windows/wsl/install-win10" target="_blank" rel="noreferrer noopener">WSL 2 terminal</a> on Windows
- Terminal on Mac
- Command Line on a Linux

### Installing everything required for this part

We will begin by installing the required software. The installation step will be one of the possible obstacles. As we are dealing with OS-level virtualization, the tools will require superuser access on the computer. They will have access to your operating systems kernel.

The material is built around&nbsp;<a href="https://www.docker.com/" target="_blank" rel="noreferrer noopener">Docker</a>, a set of products that we will use for containerization and the management of containers. Unfortunately, if you can not install Docker you probably can not complete this part.

As the install instructions depend on your operating system, you will have to find the correct install instructions from the link below. Note that they may have multiple different options for your operating system.
- <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noreferrer noopener">Get Docker</a>

Now that headache is hopefully over, let's make sure that our versions match. Yours may have a bit higher numbers than here:

```
$ docker -v
Docker version 28.0.1, build 068a01e
```

### Containers and images

There are two core concepts in this part:&nbsp;<em>container</em>&nbsp;and&nbsp;<em>image</em>. They are easy to confuse with one another.

A&nbsp;<em>container</em>&nbsp;is a runtime instance of an&nbsp;<em>image</em>.

Both of the following statements are true:
- Images include all of the code, dependencies and instructions on how to run the application
- Containers package software into standardized units

It is no wonder they are easily mixed up.

To help with the confusion, almost everyone uses the word container to describe both. But you can never actually build a container or download one since containers only exist during runtime. Images, on the other hand, are&nbsp;<strong>immutable</strong>&nbsp;files. As a result of the immutability, you can not edit an image after you have created one. However, you can use existing images to create&nbsp;<em>a new image</em>&nbsp;by adding new layers on top of the existing ones.

Cooking metaphor:
- Image is pre-cooked, frozen treat.
- Container is the delicious treat.

<a href="https://www.docker.com/" target="_blank" rel="noreferrer noopener">Docker</a> is the most popular containerization technology and pioneered the standards most containerization technologies use today. In practice, Docker is a set of products that help us to manage images and containers. This set of products will enable us to leverage all of the benefits of containers. For example, the <em>Docker engine</em> takes an image, an immutable, read-only snapshot of a filesystem (a set of files and metadata), and runs it as a container.

For managing the Docker containers, there is also a tool called&nbsp;<a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer noopener">Docker Compose</a>&nbsp;that allows one to&nbsp;<strong>orchestrate</strong>&nbsp;(control) multiple containers at the same time. In this part we shall use Docker Compose to set up a complex local development environment. In the final version of the development environment that we will set up, even installing Node in our machine will not be required anymore.

There are several concepts we need to go over. But we will skip those for now and learn about Docker first!

Let us start with the command&nbsp;<em>docker container run</em>&nbsp;that is used to run images within a container. The command structure is the following:&nbsp;<em>container run&nbsp;IMAGE-NAME</em>&nbsp;that we will tell Docker to create a container from an image. A particularly nice feature of the command is that it can run a container even if the image to run is not downloaded on our device yet.

Let us run the command

```
$ docker container run hello-world
```

There will be a lot of output, but let's split it into multiple sections, which we can decipher together. The lines are numbered by me so that it is easier to follow the explanation. Your output will not have the numbers.

```
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

Because the image&nbsp;<em>hello-world</em>&nbsp;was not found on our machine, the command first downloaded it from a free registry called&nbsp;<a href="https://hub.docker.com/" target="_blank" rel="noreferrer noopener">Docker Hub</a>. You can see the Docker Hub page of the image with your browser here:&nbsp;<a href="https://hub.docker.com/_/hello-world" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/hello-world</a>

The first part of the message states that we did not have the image "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an URL. An image name is in the following format:
- <em>registry/organisation/image:tag</em>

In this case the three missing fields defaulted to:
- <em>index.docker.io/library/hello-world:latest</em>

The second row shows the organisation name, "library" where it will get the image. In the Docker Hub URL, the "library" is shortened to _.

The 3rd and 5th rows only show the status. But the 4th row may be interesting: each image has a unique digest based on the&nbsp;<em>layers</em>&nbsp;from which the image is built. In practice, each step or command that was used in building the image creates a unique layer. The digest is used by Docker to identify that an image is the same. This is done when you try to pull the same image again.

So the result of using the command was a pull and then output information about the&nbsp;<strong>image</strong>. After that, the status told us that a new version of&nbsp;<em>hello-world:latest</em>&nbsp;was indeed downloaded. You can try pulling the image with&nbsp;<em>docker image pull hello-world</em>&nbsp;and see what happens.

The following output was from the container itself. It also explains what happened when we ran&nbsp;<em>docker container run hello-world</em>.

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker container run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

The output contains a few new things for us to learn.&nbsp;<em>Docker daemon</em>&nbsp;is a background service that makes sure the containers are running, and we use the&nbsp;<em>Docker client</em>&nbsp;to interact with the daemon. We now have interacted with the first image and created a container from the image. During the execution of that container, we received the output.

<div class="tasks">

**2. Running your second container**

</div>

### Ubuntu image

The command you just used to run the Ubuntu container <code>docker container run -it ubuntu bash</code> contains a few additions to the previously run hello-world. Let's see the <code>--help</code> to get a better understanding. I'll cut some of the output so we can focus on the relevant parts.

```
$ docker container run --help

Usage:  docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
Run a command in a new container

Options:
  ...
  -i, --interactive                    Keep STDIN open even if not attached
  -t, --tty                            Allocate a pseudo-TTY
  ...
```

The two options, or flags, <code>-it</code> make sure we can interact with the container. After the options, we defined that the image to run is ubuntu. Then we have the command <em>bash</em> to be executed inside the container when we start it.

You can try other commands that the Ubuntu image might be able to execute. As an example, try <code>docker container run --rm ubuntu ls -la</code>. The ls -la command will list all of the files in the default directory (that happens to be the root /), and the flag <code><em>--</em>rm</code> will remove the container after execution. Normally, containers are not deleted automatically.

Let's continue with our first Ubuntu container with the <strong>index.js</strong> file inside it. The container has stopped running since we exited it. We can list all of the containers with <code>container ls -a,</code> the <em>-a</em> (or --all) will list containers that have already been exited.

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

> <em>Editor's note: the command&nbsp;docker container ls&nbsp;has also a shorter form&nbsp;docker ps</em>, I prefer the shorter one.

We have two options when addressing a container. The identifier in the first column can be used to interact with the container almost always. Plus, most commands accept the container name as a more human-friendly method of working with them. The name of the container was automatically generated to be&nbsp;<strong>"hopeful_clarke"</strong>&nbsp;in my case.

The container has already exited, yet we can start it again with the start command that will accept the id or name of the container as a parameter: <code>start CONTAINER-ID-OR-CONTAINER-NAME</code>.

```
$ docker start hopeful_clarke
hopeful_clarke
```

The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag <code>--interactive</code> (that can also be written <code>-i</code>) so we can not interact with it.

The container is actually up and running as the command <code>container ls -a</code> shows, but we just can not communicate with it:

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

Note that we can also execute the command without the flag <code>-a</code> to see just those containers that are running:

```
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke
```

Let's kill it with the <code>kill CONTAINER-ID-OR-CONTAINER-NAME</code> command and try again.

```
$ docker kill hopeful_clarke
hopeful_clarke
```

<code>docker kill</code> sends a signal SIGKILL to the process, forcing it to exit, and that causes the container to stop. We can check its status with <code>container ls -a</code>:

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

Now let us start the container again, but this time in interactive mode:

```
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

Let's edit the file&nbsp;<em>index.js</em>&nbsp;and add in some JavaScript code to execute. We are just missing the tools to edit the file.&nbsp;<a href="https://www.nano-editor.org/" target="_blank" rel="noreferrer noopener">Nano</a>&nbsp;will be a good text editor for now. The install instructions were found from the first result of Google. We will omit using sudo since we are already root.

```
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

Now we have Nano installed and can start editing files!

<div class="tasks">

**3. Ubuntu 101**

</div>

<div class="tasks">

**4. Ubuntu 102**

</div>

### Other Docker commands

Now that we have Node installed in the container, we can execute JavaScript in the container! Let's create a new image from the container. The command

```
commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME
```

will create a new image that includes the changes we have made. You can use <code>container diff</code> to check for the changes between the original image and the container before doing so.

```
$ docker commit hopeful_clarke hello-node-world
```

You can list your images with <code>image ls</code>:

```
$ docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
```

You can now run the new image as follows:

```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

There are multiple ways to do the same. Let's try a better solution. We will clean the slate with <code>container rm</code> to remove the old container.

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

Create a file&nbsp;<em>index.js</em>&nbsp;to your current directory and write&nbsp;<em>console.log('Hello, World')</em>&nbsp;inside it. No need for containers yet.

Next, let's skip installing Node altogether. There are plenty of useful Docker images in Docker Hub ready for our use. Let's use the image&nbsp;<a href="https://hub.docker.com/_/node" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/node</a>, which has Node already installed. We only need to pick a version.

By the way, the <code>container run</code> accepts <code>--name</code> flag that we can use to give a name for the container.

```
$ docker container run -it --name hello-node node:24 bash
```

Let us create a directory for the code inside the container:

```
root@77d1023af893:/# mkdir /usr/src/app
```

While we are inside the container on this terminal, open another terminal and use the <code>container cp</code> command to copy file from your own machine to the container:

```
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

And now we can run <code>node /usr/src/app/index.js</code> in the container. We can commit this as another new image, but there is an even better solution. The next section will be all about building your images like a pro.

You will find more on Docker commands from the documentation <a href="https://docs.docker.com/">https://docs.docker.com/</a> Note also the awesome <em>Docker Cheat Sheet</em> in https://docker.how/ that contains lots of information in a nicely packed format.
