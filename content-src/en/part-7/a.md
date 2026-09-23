---
part: 7
letter: a
title: "Getting started"
mainImage: /images/part-7.svg
lang: en
---
The seventh part of the course covers several topics. We begin by looking at how to define custom hook functions. After that, we explore how bundling works in React applications: we get acquainted with esbuild as a low-level bundler and look at how Vite can be configured for different scenarios. Toward the end of the part, we briefly cover class components and other React development topics such as code organization and error boundaries. We will also recap all that we have learned in the course so far by extending the Blog application with some new features.

### Prerequisites

This part will rely on many concepts covered in the previous parts of the course. It is assumed that you have finished parts 0 to 6 before starting this part.

### Enrollment

You do not need to enroll to study in the course. You can enroll only after you have completed the course, see the&nbsp;<em>Getting ECTS credits and the certificate</em>&nbsp;below.

### Help with exercises or course practicalities

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our Full stack open Discord channel:&nbsp;<a href="https://study.cs.helsinki.fi/discord/join/fullstack">https://study.cs.helsinki.fi/discord/join/fullstack</a>

<em><strong>All</strong>&nbsp;inappropriate, degrading, or discriminatory comments on the channel are prohibited and will lead to action taken against the commenter.</em>

### Submitting exercises

This course part contains 22 exercises, and all of them must be completed in order to receive a grade.

The exercises are to be submitted to&nbsp;<em>a single GitHub repository,</em>&nbsp;which will include all of the source code that you write during this part. If you are using a private repository, add the GitHub user&nbsp;<em>mluukkai</em>&nbsp;as a collaborator.

The exercises are to be submitted to&nbsp;<em>a single GitHub repository,</em>&nbsp;which will include all of the source code and the configurations that you do during this part. If you are using a private repository, add the GitHub user&nbsp;<em>mluukkai</em>&nbsp;as a collaborator.

Copy all the content of <a href="https://github.com/fullstack-hy2020/fs-extension">https://github.com/fullstack-hy2020/fs-extension</a> to your submission repository.

<strong>You should not alter the directory structure</strong>&nbsp;or delete anything from there. Each exercise must be located in the exact right directory!

<strong>Your exercises are reviewed after you submit the last exercise, and if everything is more or less ok, you will be graded, and the certificate and university credits will be available to you.</strong>

> Remember not to cheat in exercises! If, for example, multiple students are submitting the same code, the issue is handled according to the&nbsp;<a href="https://studies.helsinki.fi/instructions/article/what-cheating-and-plagiarism" rel="noopener" target="_blank">policy on plagiarism(opens in a new tab)</a>&nbsp;of the University of Helsinki.

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

The course certificate is also available at the course front page.

### Improvements and feedback to the course material

We welcome contributions to the course material from students and other members of the DevOps community! If you notice any mistakes, typos, or errors in the material, please consider submitting a correction or clarification request by pressing the&nbsp;<em>Give feedback&nbsp;</em>button, which gives you two choices

![صورة توضيحية](/images/mooc/104c96525578.webp)

In case of e.g., typos, it is preferable to select the&nbsp;<em>Improve Material</em>&nbsp;that makes the material "editable", and you may send the improvement suggestions for approval.

### Using LLM:s

Large language models have become powerful tools in software development, and coding agents push those capabilities even further. They can make a course like this feel almost effortless, but relying on them too heavily comes at a cost. To use AI effectively, you still need a solid command of the fundamentals. That’s why I suggest using agents in moderation, especially for explanations and debugging, so you build real understanding rather than outsourcing the learning.

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

Bottom line: let AI be your explainer, reviewer, and debugging partner, not your substitute for thinking and practice.

### About the material

The material of this part is developed by&nbsp;<a href="https://github.com/mluukkai">Matti Luukkainen</a>.

This material is licensed under&nbsp;<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en">Creative Commons BY-NC-SA 4.0</a>&nbsp;licence, so you can freely use and distribute the material, as long as the original creators are credited. If you make changes to the material and you want to distribute the altered version, it must be licensed under the same license. Usage of the material for commercial use is prohibited without permission.

<div class="tasks">

**0. Warmup**

</div>
