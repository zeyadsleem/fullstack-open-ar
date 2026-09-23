---
part: 12
letter: a
title: "Chapter 1: Getting started"
mainImage: /images/part-12.svg
lang: en
---
In this part, we will learn how to package code into standard units of software called containers. These containers can help us develop software faster and easier than before. Along the way, we will also explore a completely new viewpoint for web development, outside of the now-familiar Node.js backend and React frontend.

We will utilize containers to create immutable execution environments for our Node.js and React projects. Containers also make it easy to include multiple services in our projects. With their flexibility, we will explore and experiment with many different and popular tools by utilizing containers.

### Prerequisites

In this part, the focus of our attention will not be on the JavaScript code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub, and your tasks will include configuring them.

You will need basic knowledge of Node, Express, and React. Only the core parts, 1 through 5, are required to be completed before this part.

### Enrollment

You do not need to enroll to study in the course. You can enroll only after you have completed the course, see the&nbsp;<em>Getting ECTS credits and the certificate</em>&nbsp;below.

### Help with exercises or course practicalities

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our Full stack open Discord channel:&nbsp;<a href="https://study.cs.helsinki.fi/discord/join/fullstack">https://study.cs.helsinki.fi/discord/join/fullstack,</a>

<em><strong>All</strong>&nbsp;inappropriate, degrading, or discriminatory comments on the channel are prohibited and will lead to action taken against the commenter.</em>

### Submitting exercises

This course part contains 24 exercises, and all of them must be completed in order to receive a grade.

The exercises are to be submitted to <em>a single GitHub repository,</em> which will include all of the source code and the configurations that you do during this part. If you are using a private repository, add the GitHub user <em>mluukkai</em> as a collaborator.

Copy all the content of <a href="https://github.com/fullstack-hy2020/fs-containers">https://github.com/fullstack-hy2020/fs-containers</a> to your submission repository.

<strong>You should not alter the directory structure,</strong> so there should be four directories in the root of your submission repository
- <em>answers</em> that will contain answers to non coding related exercises
- <em>todo-app</em> that contains the application and it's configurations that is developed during the part
- <em>todo-tests</em> contains some tests for your app
- .github contains the GitHub Action definitions that runs the tests in GitHub

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

The course certificate is available also at the course front page.

### Improvements and feedback to the course material

We welcome contributions to the course material from students and other members of the DevOps community! If you notice any mistakes, typos, or errors in the material, please consider submitting a correction or clarification request by pressing the&nbsp;<em>Give feedback&nbsp;</em>button, which gives you two choices

![صورة توضيحية](/images/mooc/104c96525578.webp)

In case of e.g., typos, it is preferable to select the&nbsp;<em>Improve Material</em>&nbsp;that makes the material "editable", and you may send the improvement suggestions for approval.

### Using LLM:s

Large language models have proven highly useful in software development, and coding agents have taken AI capabilities to a new level. They can even make completing this course feel effortless. The question is whether that’s wise. Effective AI use still requires a solid grasp of the fundamentals. That’s why I recommend using agents in moderation—mainly for explanations and debugging—so you learn deeply rather than outsource the work.

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

This part has been created by <a href="https://github.com/jakousa">Jami Kousa</a> in collaboration with the Helsinki-based Services Foundation team at Unity. The Services Foundation team works on providing platforms for other teams at Unity to succeed in their mission of building great services for their customers. The team is passionate about improving Unity’s developer experience and works on tools like the Unity Dashboard, the Unity Editor, and <a href="https://unity.com/">Unity.com</a>.

This material is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en" data-type="link" data-id="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en">Creative Commons BY-NC-SA 4.0</a> -licence, so you can freely use and distribute the material, as long as the original creators are credited. If you make changes to the material and you want to distribute the altered version, it must be licensed under the same license. Usage of the material for commercial use is prohibited without permission.

<div class="tasks">

**0. Warmup**

</div>
