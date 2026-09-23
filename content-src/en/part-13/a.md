---
part: 13
letter: a
title: "Getting started"
mainImage: /images/part-13.svg
lang: en
---
In the previous course parts, we used MongoDB for storing data, which is a so-called NoSQL database. NoSQL databases became very common just over 10 years ago, when the scaling of the internet started to produce problems for relational databases that utilized the older generation SQL query language.

Relational databases have since experienced a renaissance. Scalability issues have been partially resolved, and they have also adopted some features of NoSQL databases. In this section, we will look at NodeJS applications that use relational databases, with PostgreSQL, the number one open source database, as the database.

This course part introduces Node applications that use relational databases. In this part, we will build a Node backend that uses a relational database for the note-taking application familiar from sections 3-5.

### Prerequisites

To complete this part, you will need a reasonable knowledge of relational databases and SQL. There are many online courses on SQL databases, eg, <a href="https://sqlbolt.com/" target="_blank" rel="noreferrer noopener">SQLbolt</a> and <a href="https://www.khanacademy.org/computing/computer-programming/sql" target="_blank" rel="noreferrer noopener">Intro to SQL by Khan Academy</a>.

### Enrollment

You do not need to enroll to study in the course. You can enroll only after you have completed the course, see the <em>Getting ECTS credits and the certificate</em> below.

### Help with exercises or course practicalities

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our Full stack open Discord channel: <a href="https://study.cs.helsinki.fi/discord/join/fullstack" data-type="link" data-id="https://study.cs.helsinki.fi/discord/join/fullstack,">https://study.cs.helsinki.fi/discord/join/fullstack,</a>

<em><strong>All</strong>&nbsp;inappropriate, degrading, or discriminatory comments on the channel are prohibited and will lead to action taken against the commenter.</em>

### Submitting exercises

This course part contains 28 exercises, and all of them must be completed in order to receive a grade.

In the exercises of this course part, we will build a blog application backend similar to the exercises in <a href="https://fullstackopen.com/en/part4" target="_blank" rel="noreferrer noopener">part 4</a>. The backend we build should be compatible with the frontend in part 5, except for error handling. We will also add various features to the backend that the frontend in part 5 will not know how to use.

For the exercises, you should create a GitHub repository. If you are using a private repository, add the GitHub user <em>mluukkai</em> as a collaborator.

At the end of chapters 3 and 4, there are exercises where you are supposed to run automated tests that check the correctness of your solutions.

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

In case of e.g., typos, it is preferable to select the <em>Improve Material</em> that makes the material "editable", and you may send the improvement suggestions for approval.

### Using LLM:s

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

The material of this part is developed by <a href="https://github.com/mluukkai" data-type="link" data-id="https://github.com/mluukkai">Matti Luukkainen</a>. English translation is by <a href="https://github.com/aarnipavlidi">Aarni Pavlidi</a>.

This material is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noreferrer noopener">Creative Commons BY-NC-SA 3.0 -licence</a>, so you can freely use and distribute the material, as long as the original creators are credited. If you make changes to the material and you want to distribute the altered version, it must be licensed under the same license. Usage of the material for commercial use is prohibited without permission.

<div class="tasks">

**0. Warmup**

</div>
