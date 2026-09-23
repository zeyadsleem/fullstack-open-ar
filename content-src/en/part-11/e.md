---
part: 11
letter: e
title: "Keeping green"
mainImage: /images/part-11.svg
lang: en
---
## Keeping green

Your main branch of the code should always remain&nbsp;<em>green</em>. Being green means that all the steps of your build pipeline should complete successfully: the project should build successfully, tests should run without errors, and the linter shouldn't have anything to complain about, etc.

Why is this important? You will likely deploy your code to production specifically from your main branch. Any failures in the main branch would mean that new features cannot be deployed to production until the issue is sorted out. Sometimes you will discover a nasty bug in production that was not caught by the CI/CD pipeline. In these cases, you want to be able to roll the production environment back to a previous commit in a safe manner.

How do you keep your main branch green then? Avoid committing any changes directly to the main branch. Instead, commit your code on a branch based on the freshest possible version of the main branch. Once you think the branch is ready to be merged into the main you create a GitHub Pull Request (also referred to as&nbsp;PR).

### Working with Pull Requests

Pull requests are a core part of the collaboration process when working on any software project with at least two contributors. When making changes to a project you checkout a new branch locally, make and commit your changes, push the branch to the remote repository (in our case to GitHub) and create a pull request for someone to review your changes before those can be merged into the main branch.

There are several reasons why using pull requests and getting your code reviewed by at least one other person is always a good idea.
- Even a seasoned developer can often overlook some issues in their code: we all know of the tunnel vision effect.
- A reviewer can have a different perspective and offer a different point of view.
- After reading through your changes, at least one other developer will be familiar with the changes you've made.
- Using PRs allows you to automatically run all tasks in your CI pipeline before the code gets to the main branch. GitHub Actions provides a trigger for pull requests.

You can even configure your GitHub repository in such a way that pull requests cannot be merged until they are approved.

To open a new pull request, open your branch in GitHub and click on the green "Compare &amp; pull request" button at the top. You will be presented with a form where you can fill in the pull request description.

![صورة توضيحية](/images/mooc/79523300f5b6.webp)

GitHub's pull request interface presents a description and the discussion interface. At the bottom, it displays all the CI checks (in our case each of our Github Actions) that are configured to run for each PR and the statuses of these checks. A green board is what you aim for! You can click on Details of each check to view details and run logs.

All the workflows we looked at so far were triggered by commits to the main branch. To make the workflow run for each pull request we would have to update the trigger part of the workflow. We use the "pull_request" trigger for branch "main" (our main branch) and limit the trigger to events "opened" and "synchronize". Basically, this means, that the workflow will run when a PR into the main branch is opened or updated.

So let us change events that&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">trigger</a>&nbsp;of the workflow as follows:

```
on:
  push:
    branches:
      - main
// BEGIN HIGHLIGHT
  pull_request:
    branches: [main]
    types: [opened, synchronize]
// END HIGHLIGHT
```

We shall soon make it impossible to push the code directly to the main branch, but in the meantime, let us still run the workflow also for all the possible direct pushes to the main branch.

<div class="tasks">

**13. Pull request**

</div>

<div class="tasks">

**14. Run deployment step only for the main branch**

</div>

### Versioning

The most important purpose of versioning is to uniquely identify the software we're running and the code associated with it.

The ordering of versions is also an important piece of information. For example, if the current release has broken critical functionality and we need to identify the&nbsp;<em>previous version</em>&nbsp;of the software so that we can roll back the release back to a stable state.

#### Semantic Versioning and Hash Versioning

How an application is versioned is sometimes called a versioning strategy. We'll look at and compare two such strategies.

The first one is <a href="https://semver.org/" target="_blank" rel="noreferrer noopener">semantic versioning</a>, where a version is in the form <em>{major}.{minor}.{patch}</em>. For example, if the version is <em>1.2.3</em>, it has <em>1</em> as the major version, <em>2</em> is the minor version, and <em>3</em> is the patch version.

In general, changes that fix the functionality without changing how the application works from the outside are <em>patch</em> changes, changes that make small changes to functionality (as viewed from the outside) are <em>minor</em> changes, and changes that completely change the application (or major functionality changes) are <em>major</em> changes. The definitions of each of these terms can vary from project to project.

For example, npm-libraries are following the semantic versioning. At the time of writing this text (14th March 2026), the most recent version of <a href="https://react.dev/versions" data-type="link" data-id="https://react.dev/versions">React is 19.2.0</a>, so the major version is 19, and the minor version is 2.

<em>Hash versioning</em>&nbsp;(also sometimes known as SHA versioning) is quite different. The version "number" in hash versioning is a hash (that looks like a random string) derived from the contents of the repository and the changes introduced in the commit that created the version. In Git, this is already done for you as the commit hash that is unique for any change set.

Hash versioning is almost always used in conjunction with automation. It's a pain (and error-prone) to copy 32 character long version numbers around to make sure that everything is correctly deployed.

#### But what does the version point to?

Determining what code belongs to a given version is important and the way this is achieved is again quite different between semantic and hash versioning. In hash versioning (at least in Git) it's as simple as looking up the commit based on the hash. This will let us know exactly what code is deployed with a specific version.

It's a little more complicated when using semantic versioning and there are several ways to approach the problem. These boil down to three possible approaches: something in the code itself, something in the repo or repo metadata, something completely outside the repo.

While we won't cover the last option on the list (since that's a rabbit hole all on its own), it's worth mentioning that this can be as simple as a spreadsheet that lists the Semantic Version and the commit it points to.

For the two repository based approaches, the approach with something in the code usually boils down to a version number in a file and the repo/metadata approach usually relies on&nbsp;<a href="https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag" target="_blank" rel="noreferrer noopener">tags</a>&nbsp;or (in the case of GitHub) releases. In the case of tags or releases, this is relatively simple, the tag or release points to a commit, the code in that commit is the code in the release.

#### Version order

In semantic versioning, even if we have version bumps of different types (major, minor, or patch) it's still quite easy to put the releases in order: 1.3.7 comes before 2.0.0 which itself comes before 2.1.5 which comes before 2.2.0. A list of releases (conveniently provided by a package manager or GitHub) is still needed to know what the last version is but it's easier to look at that list and discuss it: It's easier to say "We need to roll back to 3.2.4" than to try communicate a hash in person.

That's not to say that hashes are inconvenient: if you know which commit caused the particular problem, it's easy enough to look back through a Git history and get the hash of the previous commit. But if you have two hashes, say <em>d052aa41edfb4a7671c974c5901f4abe1c2db071</em> and <em>12c6f6738a18154cb1cef7cf0607a681f72eaff3</em>, you really can not say which came earlier in history. You need something more, such as the Git log that reveals the ordering.

#### Comparing the Two

We've already touched on some of the advantages and disadvantages of the two versioning methods discussed above but it's perhaps useful to address where they'd each likely be used.

Semantic Versioning works well when deploying services where the version number could be of significance or might actually be looked at. As an example, think of the JavaScript libraries that you're using. If you're using version 3.4.6 of a particular library, and there's an update available to 3.4.8, if the library uses semantic versioning, you could (hopefully) safely assume that you're ok to upgrade without breaking anything. If the version jumps to 4.0.1 then maybe it's not such a safe upgrade.

Hash versioning is very useful where most commits are being built into artifacts (e.g. runnable binaries or Docker images) that are themselves uploaded or stored. As an example, if your testing requires building your package into an artifact, uploading it to a server, and running tests against it, it would be convenient to have hash versioning as it would prevent accidents.

Imagine you're working on version 3.2.2 of your project. You find a failing test, fix it, and push a new commit. Since you're still on your feature branch, you <em>don’t</em> bump the version number yet. If your build system doesn’t include a commit hash in the artifact name, then every build you produce on that branch will generate an artifact with the same name. That creates a problem: if the artifact upload fails for some reason, the next test run might accidentally pick up an older artifact with the same name. That means your tests could run against outdated code, giving you misleading results.

When you include the commit hash in the artifact version, the artifact name changes every time you commit. So if the upload fails, the tests won’t find an artifact with the expected name, and the system will throw an error instead of silently using an old one. This makes failures obvious and prevents tests from running against stale builds.

Having an error trigger when something goes wrong is almost always preferable to having a problem silently ignored in CI.

#### Best of Both Worlds

When you look at the two approaches, it becomes clear that semantic versioning is ideal for official software releases, while hash‑based versioning (or artifact naming) works best during development. These two systems don’t actually conflict—they serve different purposes.

At its core, versioning is simply a way to label a specific commit. You might decide, “This commit will be version 3.5.5,” and tag it accordingly. That doesn’t stop you from also referring to the same commit by its hash.

However, there <em>is</em> a subtle challenge. We emphasized earlier that you must always know exactly what code you’re working with—especially to ensure that the code you release has been tested. Using two parallel naming schemes can make that harder unless the process is well‑designed.

In a typical setup, development builds use hash‑based artifact names. This allows every build, lint, and test run to be tied directly to a specific commit. Developers don’t need to think about this; the CI system handles it automatically. When code is merged into the main branch, CI runs the full build and test pipeline again and then assigns a semantic version number. It tags the commit with that version.

In this workflow, the released software is always tested because the CI system tests the exact code it tags. From the outside, it’s perfectly reasonable to say the project uses semantic versioning and ignore the hash‑based naming used internally. The only version that matters to users—the released one—is the semantic version.

<div class="tasks">

**15. Adding versioning**

</div>

<div class="tasks">

**16. Skipping a commit for tagging and deployment**

</div>

### A note about using third-party actions

When using a third-party action, such as github-tag-action it might be a good idea to specify the used version with a hash instead of using a version number. The reason for this is that the version number, which is implemented with a Git tag, can in principle be moved. So today's version 1.75.0 might be a different code than the one that is at next week's version 1.75.0!

However, the code in a commit with a particular hash does not change in any circumstances, so if we want to be 100% sure about the code we use, it is safest to use the hash.

Version <a href="https://github.com/anothrNick/github-tag-action/releases/tag/1.75.0" target="_blank" rel="noreferrer noopener">1.75.0</a> of the action corresponds to a commit with hash <em>4ed44965e0db8dab2b466a16da04aec3cc312fd8</em>, so we might want to change our configuration as follows:

```
    - name: Bump version and push tag
      uses: anothrNick/github-tag-action@4ed44965e0db8dab2b466a16da04aec3cc312fd8
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

When we use actions provided by GitHub we trust them not to mess with version tags and to thoroughly test their code.

In the case of third-party actions, the code might end up being buggy or even malicious. Even when the author of the open-source code does not have the intention of doing something bad, they might end up leaving their credentials on a post-it note in a cafe, and then who knows what might happen.

By pointing to the hash of a specific commit, we can be sure that the code we use when running the workflow will not change because changing the underlying commit and its contents would also change the hash.

### Keep the main branch protected

GitHub allows you to set up protected branches. It is a good idea to protect your most important branch that should never be broken: the main. In repository settings, you can choose between several levels of protection. We will not go over all of the protection options, you can learn more about them in the GitHub <a href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" data-type="link" data-id="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches">documentation</a>. Requiring pull request approval when merging into the main branch is one of the options we mentioned earlier.

From the CI point of view, the most important protection is requiring status checks to pass before a PR can be merged into the main branch. This means that if you have set up GitHub Actions to run, e.g., linting and testing tasks, then until all the lint errors are fixed and all the tests pass, the PR cannot be merged.

![صورة توضيحية](/images/mooc/44fd4a650264.webp)

To set up protection for your main branch, navigate to the repository "Settings" from the top menu inside the repository. In the left-side menu, select "Branches". Click "Add branch ruleset". Select the default branch as branch target criteria (that is, the main if not set otherwise). Remember also to set the enforcement status as active!

At least "Require status checks to pass before merging" is necessary for you to fully utilize the power of GitHub Actions. Also, requiring "Require branches to be up to date before merging" is a good idea. Then you just need to add the required checks:

![صورة توضيحية](/images/mooc/ea1f060d5d5b.webp)

Note that the <em>checks</em> equal to the names of the jobs in your workflow, so mine is defined as follows:

```
jobs:<br>  deployment_pipeline: // HIGHLIGHT LINE<br>    runs-on: ubuntu-latest<br>    steps:<br>      - uses: actions/checkout@v6<br>    # ....
```

<div class="tasks">

**17. Adding protection to your main branch**

</div>
