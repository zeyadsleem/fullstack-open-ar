---
part: 14
letter: a
title: "Getting started"
mainImage: /images/part-14.svg
lang: en
---
In&nbsp;<a href="https://fullstackopen.com/en/part0/fundamentals_of_web_apps">part 0</a>&nbsp;of this course, we traced the history of web applications from traditional server-side rendering to single-page applications (SPAs). The rest of the course has focused on the SPA model: a React frontend running in the browser communicates with a separate Express backend over a REST or GraphQL API.

That architecture works well, but it has some drawbacks. The user receives an almost-empty HTML page and must wait for the JavaScript bundle to load and for API calls to complete before seeing any content. Search engines may struggle to index pages that are rendered entirely in the browser. And maintaining two separate codebases, one for the frontend and one for the backend, adds overhead.

Server-side rendering has come back into focus as a solution to these problems. The server produces ready-made HTML that the browser can display immediately, which improves perceived performance and makes pages easier to index. What is new is that this is no longer the old-fashioned approach of returning complete HTML from an Express route handler. The modern incarnation is built on&nbsp;<a href="https://react.dev/reference/rsc/server-components">React Server Components</a>, a new model that lets React components run on the server and stream HTML to the browser, while still allowing rich client-side interactivity where needed.

<a href="https://nextjs.org/">Next.js</a>&nbsp;is the leading framework for building React applications with server-side rendering. It provides a tightly integrated environment where the frontend and backend live in the same codebase. Routing, data fetching, form handling, authentication, and deployment are all covered by the framework, and the boundary between server and client code is managed by React itself rather than by a separate API layer.

In this part, we build a full stack application with Next.js from scratch. We start with routing and server components, move on to databases and authentication, and finish with styling and error handling. Along the way, we will see how many patterns from earlier parts of the course, such as services and form validation, translate into the Next.js world.

### Prerequisites

Parts 1-5 and 9 of Full Stack Open, and a basic familiarity with SQL as covered in <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">Full Stack Open: Relational databases</a>.

### Help with exercises or course practicalities

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our Full stack open Discord channel:&nbsp;<a href="https://study.cs.helsinki.fi/discord/join/fullstack">https://study.cs.helsinki.fi/discord/join/fullstack,</a>

<em><strong>All</strong>&nbsp;inappropriate, degrading, or discriminatory comments on the channel are prohibited and will lead to action taken against the commenter.</em>

### Submitting exercises

This part of the course contains 26 exercises, and all must be completed to receive a grade.

For the exercises, you should create a GitHub repository. If you are using a private repository, add the GitHub user&nbsp;<em>mluukkai</em>&nbsp;as a collaborator.

At the end of chapter 4, there is an exercise in which you are supposed to run automated tests to verify the correctness of your solutions.

<strong>Your exercises are reviewed after you submit the last exercise, and if everything is more or less ok, you will be graded, and the certificate and university credits will be available to you.</strong>

> Remember not to cheat in exercises! If, for example, multiple students are submitting the same code, the issue is handled according to the <a href="https://studies.helsinki.fi/instructions/article/what-cheating-and-plagiarism" target="_blank" rel="noreferrer noopener">policy on plagiarism</a> of the University of Helsinki.

### Locking a chapter

Once you have finished all exercises in a chapter, you must lock the chapter before continuing to the next one. Keep in mind that after locking a chapter, you won’t be able to submit any further exercises for it, so only lock it when everything is done.

![صورة توضيحية](/images/mooc/004e798d1e31.webp)

### Getting ECTS credits and the certificate

After you have completed the exercises and those are graded, you can get the ECTS credits as follows

#### University of Helsinki degree students and exchange students
1. Enroll directly through your Sisu account (Sisu: Structure of studies).
2. Complete all required exercises.

#### Others
1. Complete all required exercises.
2. Go to the course front page.
3. Scroll down until you see an element that says <em>Congratulations</em>!
4. Click the <em>REGISTER</em><em> </em> button.
5. Fill in the open university (University of Helsinki) enrolment form. Use the same email address that you used to complete the course.
6. The credits are usually registered in the University of Helsinki’s study register within two days of enrolment.

Registering the credits takes usually two days.

The course certificates are available also at the course front page.

### Improvements and feedback to the course material

We welcome contributions to the course material from students and other members of the Fullstack Open community! If you notice any mistakes, typos, or errors in the material, please consider submitting a correction or clarification request by pressing the&nbsp;<em>Give feedback&nbsp;</em>button, which gives you two choices

![صورة توضيحية](/images/mooc/104c96525578.webp)

In case of e.g. typos, it is preferable to select the&nbsp;<em>Improve Material</em>&nbsp;that makes the material "editable", and you may send the improvement suggestions for approval.

### Using LLMs

Large language models have become powerful tools in software development, and coding agents push those capabilities even further. They can make a course like this feel almost effortless—but relying on them too heavily comes at a cost. To use AI effectively, you still need a solid command of the fundamentals. That’s why I suggest using agents in moderation, especially for explanations and debugging, so you build real understanding rather than outsourcing the learning.

A practical, learning-first approach to using AI on this course:

Before using AI
- Try on your own first: write a solution or at least sketch your approach.
- Pinpoint the problem: identify the exact error message, unclear concept, or design trade-off you’re stuck on.

How to use AI wisely
- Explanations: ask for clear explanations of concepts or code (why something works, not just how).
- Debugging: share the error, the relevant code, and what you’ve already tried; ask for hypotheses and possible fixes.
- Peer review: request feedback on your solution, edge cases, complexity, and alternatives.
- Design support: ask to break the problem into parts, propose test cases, and define success metrics.

What to avoid
- Copying complete solutions without understanding them.
- Overly broad requests (“write the entire assignment”) that short-circuit your learning.
- Relying on a single answer without verification or tests.

Bottom line: let AI be your explainer, reviewer, and debugging partner—not your substitute for thinking and practice.

### About the material

The material of this part is developed by <a href="https://github.com/mluukkai">Matti Luukkainen</a>.

This material is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noreferrer noopener">Creative Commons BY-NC-SA 3.0 -licence</a>, so you can freely use and distribute the material, as long as the original creators are credited. If you make changes to the material and you want to distribute the altered version, it must be licensed under the same license. Usage of the material for commercial use is prohibited without permission.

<div class="tasks">

**0. Warm up**

</div>
