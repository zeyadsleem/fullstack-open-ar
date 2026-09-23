---
part: 14
letter: b
title: "من تطبيقات الصفحة الواحدة إلى العرض من الخادم"
mainImage: /images/part-14.svg
lang: ar
---
### ملاحظات Next.js

أفضل طريقة لاستيعاب Next.js هي أن نبدأ العمل عملياً. ومرة أخرى، تطبيق الملاحظات هو ما سنبنيه.

يُنشأ تطبيق Next.js باستخدام أداة&nbsp;<a href="https://nextjs.org/docs/app/getting-started/installation#create-with-the-cli">create-next-app</a>&nbsp;. لنُنشئ الآن تطبيقنا بتشغيل

```bash
npx create-next-app@latest notes-app

? Would you like to use the recommended Next.js defaults?
❯   Yes, use recommended defaults
```

قرّرنا المضي بالإعدادات الافتراضية الموصى بها.

يبدو هيكل مجلد التطبيق كما يلي:

```
├── AGENTS.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── README.md
└── tsconfig.json
```

ينبغي أن تبدو أشياء كثيرة هنا مألوفة. يمكننا تخمين أن&nbsp;<em>next.config.ts</em>&nbsp;يحتوي على إعدادات Next.js. ومن المثير للاهتمام أن الملفين&nbsp;<em>AGENTS.md</em>&nbsp;و&nbsp;<em>CLAUDE.md</em>&nbsp;يُنشآن أيضاً لوكلاء البرمجة. ويوجّه AGENTS.md تحذيراً إلى الوكلاء الذين قد يعتمدون على بيانات تعلّم أقدم:

```
&lt;!-- BEGIN:nextjs-agent-rules -->
<em># This is NOT the Next.js you know</em>

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
&lt;!-- END:nextjs-agent-rules -->
```

أهم مجلد هو&nbsp;<em>app</em>&nbsp;الذي سيحتوي على معظم شيفرة التطبيق.

لننتقل إلى الشيفرة. سنبدأ ببعض التنظيفات. أولاً غيّر محتوى الملف&nbsp;<em>layout.tsx</em>&nbsp;إلى ما يلي:

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>{children}&lt;/body>
    &lt;/html>
  )
}
```

بعد ذلك، نغيّر محتوى&nbsp;<em>page.tsx</em>&nbsp;ليصبح كما يلي:

```js
const Home = () => {
  return &lt;div>hello next.js&lt;/div>
}
export default Home
```

الآن يمكننا تشغيل التطبيق

```bash
npm run dev
```

وأصبح لدينا تطبيق Next.js بسيط يعمل:

![صورة توضيحية](/images/mooc/c4920f4bbfa2.webp)

سنجعل هذه الصفحة الرئيسية لتطبيقنا، لذا لنضع عليها مزيداً من المحتوى.

```js
const Home = () => {
  return (
    &lt;div>
      &lt;div>
        &lt;h2>notes app&lt;/h2>
        An example app for{" "}
        &lt;a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">
          Full Stack Open Next.js
        &lt;/a>
      &lt;/div>
      &lt;div>
        See{" "}
        &lt;a href="https://github.com/fullstack-hy2020/nextjs-notes">
          https://github.com/fullstack-hy2020/nextjs-notes
        &lt;/a>{" "}
        for the source code
      &lt;/div>
    &lt;/div>
  )
}
export default Home
```

تبدو الصفحة الرئيسية لتطبيقنا كمكوّن React عادي. لكنها ليست كذلك. في Next.js، تكون المكوّنات داخل مجلد&nbsp;<em>app</em>&nbsp;من نوع&nbsp;<a href="https://react.dev/reference/rsc/server-components">React Server Components</a>&nbsp;افتراضياً. وخلافاً لمكوّنات React التقليدية التي كنا نكتبها حتى الآن، تُعرض مكوّنات الخادم (Server Components) على الخادم وليس في المتصفح.

لنتحقق من ذلك باستخدام&nbsp;<em>console.log</em>&nbsp;القديم المعروف:

```js
const Home = () => {
  console.log('hello next.js')
  return (
    <em>// ...</em>
  )
}
export default Home
```

عندما ننتقل إلى&nbsp;<a href="http://localhost:3000/">http://localhost:3000</a>، يظهر ناتج&nbsp;<em>console.log</em>&nbsp;في الطرفية التي يعمل فيها الخادم:

![صورة توضيحية](/images/mooc/4a8a9a536e3f.webp)

ومن المثير للاهتمام أن الناتج يظهر أيضاً في وحدة تحكم المتصفح أثناء وضع التطوير. هذه ميزة تطويرية في Next.js تساعد في تصحيح الأخطاء: يمرّر الخادم ناتج وحدة التحكم إلى أدوات مطوّري المتصفح (DevTools) لتراه في مكان واحد. لكن هذا لا يعني أن المكوّن نُفّذ في المتصفح. فالمكوّن نُفّذ على الخادم، واكتفى Next.js بعكس ناتج وحدة التحكم إلى العميل للراحة. أما في الإنتاج، فيبقى ناتج وحدة التحكم من جهة الخادم على الخادم فقط.

### موجّه التطبيق (App router)

نريد عرض قائمة الملاحظات على الرابط&nbsp;<a href="http://localhost:3000/notes">http://localhost:3000/notes</a>. في React كان هذا سيتم باستخدام&nbsp;<a href="/part5/react_router_ui_frameworks">React Router</a>.

في Next.js الأمور أبسط بفضل&nbsp;<a href="https://nextjs.org/docs/app">موجّه التطبيق (App router)</a>&nbsp;الذي يطبّق&nbsp;<em>توجيهاً قائماً على نظام الملفات</em>&nbsp;حيث تحدد المجلدات والملفات داخل مجلد&nbsp;<em>app</em>&nbsp;بنية التوجيه في التطبيق.

كان لدينا بالفعل الملف&nbsp;<em>app/page.tsx</em>&nbsp;، وهو الملف&nbsp;<em>page.tsx</em>&nbsp;الموجود مباشرة تحت مجلد&nbsp;<em>app</em>&nbsp;. يعرّف هذا الملف&nbsp;<a href="https://react.dev/reference/rsc/server-components">مكوّن خادم React</a>&nbsp;الذي يحدد محتوى المسار /. لنستعر صورة من وثائق Next.js تصوّر هذه العلاقة:

![صورة توضيحية](/images/mooc/c9196c4e4541.webp)

تطرقنا سابقاً وبإيجاز إلى الملف&nbsp;<em>app/layout.tsx</em>&nbsp;:

```js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>{children}&lt;/body>
    &lt;/html>
  )
}
```

ما دور هذا الملف؟ التخطيط هو غلاف واجهة مشترك يُعرض حول كل صفحة ضمن نطاقه. في هذه الحالة، يغلّف التخطيط الجذري التطبيق بأكمله ويوفّر وسمي&nbsp;<code>&lt;html&gt;</code>&nbsp;و&nbsp;<code>&lt;body&gt;</code>&nbsp;. وتستقبل خاصية&nbsp;<code>children</code>&nbsp;محتوى الصفحة الحالية (أي المكوّن المصدَّر من&nbsp;<em>page.tsx</em>&nbsp;). تبقى التخطيطات ثابتة عبر التنقلات ولا يُعاد عرضها، ما يجعلها مثالية للعناصر المشتركة مثل أشرطة التنقل والتذييلات.

يوضّح ما يلي العلاقة بين التخطيط والمسار المعروض:

![صورة توضيحية](/images/mooc/59633e27a3df.webp)

إذاً من الواضح أن التخطيط الجذري هو المكان المناسب لتنفيذ شريط تنقل لتطبيقنا. لنفعل ذلك الآن:

```js
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;nav>
          &lt;Link href="/">home&lt;/Link>
          {" | "}
          &lt;Link href="/notes">notes&lt;/Link>
          {" | "}
          &lt;Link href="/notes/new">create new&lt;/Link>
        &lt;/nav>
        {children}
      &lt;/body>
    &lt;/html>
  )
}
```

يستخدم شريط التنقل المكوّن&nbsp;<a href="https://nextjs.org/docs/app/api-reference/components/link">Link</a>&nbsp;للروابط. وسلوك المكوّن واضح تماماً: فهو يوفّر توجيهاً من جهة العميل تماماً كما يفعل نظيره في React Router.

الآن يبدو التطبيق كما يلي

![صورة توضيحية](/images/mooc/7322439fb781.webp)

من الواضح أن الروابط لا تعمل في هذه المرحلة.

### صفحة الملاحظات

بعد ذلك سننشئ العرض&nbsp;<em>/notes</em>&nbsp;الذي يعرض مجموعة الملاحظات. ووفقاً لاصطلاح موجّه تطبيق Next.js، سننشئ المجلد&nbsp;<em>app/notes</em>&nbsp;وداخله الملف&nbsp;<em>page.tsx</em>&nbsp;بالمحتوى التالي:

```js
const notes = [
  { id: 1, content: "next.js utilizes React Server Components", important: true },
  { id: 2, content: "next.js is built on top of React", important: true },
  {
    id: 3,
    content: "next.js supports both static and dynamic rendering",
    important: false,
  },
]

const Notes = () => {
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.content} {note.important &amp;&amp; &lt;strong>(important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

لا شيء مفاجئ في المكوّن. يمكننا الآن الانتقال إلى العرض الجديد:

![صورة توضيحية](/images/mooc/bf10f7608d71.webp)

سنحفظ الملاحظات في النهاية في قاعدة بيانات. وللتحضير لهذا الانتقال، لنعيد تنظيمها في الملف&nbsp;<em>app/services/notes.ts</em>&nbsp;:

```ts
const notes = [
  { id: 1, content: "next.js utilizes React Server Components", important: true },
  { id: 2, content: "next.js is built on top of React", important: true },
  {
    id: 3,
    content: "next.js supports both static and dynamic rendering",
    important: false,
  },
]

let nextId = 4

export const getNotes = () => {
  return notes
}

export const addNote = (content: string, important: boolean) => {
  notes.push({ id: nextId++, content, important })
}
```

يصدّر الملف الآن الدالة&nbsp;<em>getNotes</em>&nbsp;بسلوك واضح.

وللاستعداد للميزة التالية، أضفنا أيضاً الدالة&nbsp;<em>addNote</em>&nbsp;إلى الملف.

في أجزاء سابقة من Full Stack Open، فصلنا استدعاءات الواجهة الخلفية إلى مجلد <em>services</em>. وهنا نتبع المبدأ نفسه: يضم مجلد <em>app/services</em> وحدات مسؤولة عن الوصول إلى البيانات. وفي الوقت الحالي تعيد <em>getNotes</em> ببساطة مصفوفة مكتوبة مباشرة في الشيفرة، لكن يمكننا لاحقاً استبدالها باستعلام قاعدة بيانات دون المساس بمكوّن الصفحة إطلاقاً.

أصبح&nbsp;<em>app/notes/page.tsx</em>&nbsp;الآن كما يلي:

```js
import { getNotes } from "../services/notes" // HIGHLIGHT LINE

const Notes = () => {
  const notes = getNotes() // HIGHLIGHT LINE
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.content} {note.important &amp;&amp; &lt;strong>(important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes

```

يجدر بنا التوقف للتفكير فيما يحدث هنا. جميع مكوّناتنا حتى الآن، الصفحة الرئيسية والتخطيط وصفحة الملاحظات، هي مكوّنات خادم React. وتُعرض بالكامل على الخادم. ويتلقى المتصفح HTML جاهزاً، ولا تُرسل أي شيفرة JavaScript خاصة بهذه المكوّنات إلى العميل إطلاقاً.

### إنشاء ملاحظات جديدة

الشيء التالي الذي سننفذه هو بالطبع إنشاء ملاحظات جديدة. لدينا بالفعل مسار&nbsp;<em>/notes/new</em>&nbsp;مهيأ، لذا لننشئ المكوّن&nbsp;<em>/notes/new/page.tsx</em>&nbsp;بالمحتوى التالي:

```js
const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

يبدو النموذج جيداً لكنه لا يفعل شيئاً. فكيف ننفّذ إرسال النموذج؟

في الأجزاء السابقة من Full Stack Open، كنا سنضيف معالج حدث <em>onSubmit</em> ونستخدم <em>useState</em> لإدارة حقول النموذج. ويتطلب هذا الأسلوب مكوّن عميل، لأن معالجات الأحداث والخطافات تعمل في المتصفح فقط.

غير أن Next.js يقدّم خياراً آخر:&nbsp;<a href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations">Server Actions</a>&nbsp;. و Server Action هي دالة تعمل على الخادم ولكن يمكن استدعاؤها مباشرة من نموذج في المتصفح.

لننشئ الآن المجلد&nbsp;<em>/app/actions</em>&nbsp;لإجراءات الخادم، والملف&nbsp;<em>/app/actions/notes.ts</em>&nbsp;للإجراءات. ومحتوى الملف كما يلي:

```js
"use server"

import { redirect } from "next/navigation"
import { addNote } from "../services/notes"

export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)
  redirect("/notes")
}
```

يأخذ الإجراء&nbsp;<em>createNote</em>&nbsp;المعامل&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData">formData</a>&nbsp;، ويستخدم الدالة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData/get">get</a>&nbsp;للوصول إلى قيم النموذج. ثم يستخدم الدالة&nbsp;<em>addNote</em>&nbsp;المعرّفة في&nbsp;<em>app/services/notes.ts</em>&nbsp;لحفظ الملاحظة المنشأة في قائمة الملاحظات. وأخيراً، يستدعي&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/redirect">redirect</a>&nbsp;لإعادة المستخدم إلى قائمة الملاحظات.

التوجيه&nbsp;<a href="https://nextjs.org/docs/app/api-reference/directives/use-server">"use server"</a>&nbsp;في أعلى الملف يضع علامة على جميع الدوال المصدَّرة باعتبارها Server Actions.

ويُمرَّر إجراء الخادم كخاصية <em>action</em> إلى <em>&lt;form></em>:

```js
import { createNote } from "./actions" // HIGHLIGHT LINE

const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={createNote}> // HIGHLIGHT LINE
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

عند إرسال النموذج، يرسل المتصفح بيانات النموذج إلى الخادم كطلب POST، ثم يُنفَّذ إجراء الخادم وتُحدَّث الصفحة. كل ذلك دون كتابة أي شيفرة JavaScript من جهة العميل. وهذا يعني أن مكوّن النموذج يمكن أن يبقى مكوّن خادم.

لكن كيف يعمل هذا فعلاً؟ عندما يصرّف Next.js التطبيق، يكتشف كل دالة موسومة بـ <em>"use server"</em> ويولّد نقطة نهاية HTTP فريدة لكل واحدة منها. ولا تضمّن خاصية <em>action={createNote}</em> دالة الخادم في حزمة العميل. بل يستبدل Next.js مرجع الدالة بمعرّف مخفي يشير إلى تلك النقطة. وعندما يرسل المستخدم النموذج، يجري المتصفح طلب POST قياسياً إلى النقطة المولّدة، ويرسل معه بيانات النموذج.

على جانب الخادم، يتلقى Next.js الطلب، ويبحث عن إجراء الخادم الصحيح عبر معرّفه، ويستدعيه مع كائن <em>FormData</em>. وبمجرد اكتمال الإجراء، وبعد استدعائه <em>redirect</em> في حالتنا، يرسل الخادم استجابة تخبر العميل بالانتقال إلى الرابط الجديد. ولا يحتاج المتصفح أبداً إلى معرفة أي شيء عن <em>addNote</em> أو مصفوفة الملاحظات، لأن كل هذا المنطق يبقى بالكامل على الخادم.

لنلقِ نظرة أخرى على نهاية إجراء الخادم:

```js
export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)
  redirect("/notes") // HIGHLIGHT LINE
}
```

إذاً يُستدعى الأمر&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/redirect">redirect</a>&nbsp;لإعادة المستخدم إلى العرض&nbsp;<em>notes</em>&nbsp;الذي يسرد الملاحظات. وكانت التطبيقات التقليدية المعروضة من جهة الخادم تلجأ في هذه الحالة إلى نمط&nbsp;<a href="https://en.wikipedia.org/wiki/Post/Redirect/Get">post-redirect-get</a>&nbsp;.

مع تطبيق Next.js، يختلف الأسلوب قليلاً. فبدلاً من أن ينفّذ المتصفح إعادة توجيه كاملة للصفحة وطلب GET، يستجيب الخادم بتعليمات داخلية تخبر موجّه Next.js من جهة العميل بالانتقال إلى&nbsp;<em>/notes</em>&nbsp;. ثم يجلب الموجّه محتوى الصفحة الجديدة فقط (حمولة مكوّن خادم React الخاص بصفحة الملاحظات) ويحدّث العرض دون إعادة تحميل كاملة للصفحة. لذا ما زلنا نحصل على دلالة «إعادة التوجيه بعد POST»، لكن الانتقال أسرع وأسلسب لأن Next.js يتعامل معه في الخفاء كتنقل من جهة العميل.

### العرض الثابت

يبدو أن تطبيقنا يعمل بشكل جيد أثناء التطوير. لكن إذا بنينا التطبيق للإنتاج وشغّلناه، سنلاحظ مشكلة.

لنبنِ التطبيق ونشغّله في وضع الإنتاج:

```bash
npm run build
npm start
```

يُظهر ناتج البناء شيئاً مثيراً للاهتمام:

```bash
npm run ▲ Next.js 16.2.3 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.2s
✓ Finished TypeScript in 4.8s
✓ Collecting page data using 7 workers in 451ms
✓ Generating static pages using 7 workers (6/6) in 263ms
✓ Finalizing page optimization in 19ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /notes
└ ○ /notes/new
```

لاحظ رمز&nbsp;<em>○</em>&nbsp;بجانب كل مسار. هذا يعني أن جميع صفحاتنا <strong>ثابتة</strong>، إذ&nbsp;<a href="https://nextjs.org/docs/app/getting-started/linking-and-navigating#server-rendering">عُرضت مسبقاً</a>&nbsp;وقت البناء إلى ملفات HTML. وعندما يطلب المستخدم&nbsp;<em>/notes</em>&nbsp;، يقدّم Next.js ملف HTML المبني مسبقاً فوراً دون تشغيل أي شيفرة من جهة الخادم.

هذا رائع من حيث الأداء، لكنه يخلق مشكلة: إذا أنشأنا ملاحظة جديدة باستخدام النموذج، يُنفَّذ إجراء الخادم ويضيف الملاحظة إلى بياناتنا. ثم يعيد <em>redirect("/notes")</em> المستخدم إلى قائمة الملاحظات. ولكن بما أن صفحة&nbsp;<em>/notes</em>&nbsp;عُرضت مسبقاً وقت البناء، <strong>يرى المستخدم النسخة القديمة المخزّنة مؤقتاً من الصفحة</strong>، ولا تظهر الملاحظة الجديدة.

أثناء التطوير (<em>npm run dev</em>)، لا تظهر هذه المشكلة. ففي وضع التطوير، يعرض Next.js كل صفحة من جديد عند كل طلب، لذا ترى أحدث البيانات دائماً. وهذه مزلة معروفة: الشيفرة التي تعمل بامتياز في بيئة التطوير قد تتعطل في الإنتاج.

الحل هو إخبار Next.js بأن الصفحة المخزّنة مؤقتاً أصبحت قديمة بعد أي تغيير في البيانات. ونفعل ذلك باستخدام&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/revalidatePath">revalidatePath</a>&nbsp;:

```js
"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache" // HIGHLIGHT LINE
import { addNote } from "../services/notes"

export const createNote = async (formData: FormData) => {
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  addNote(content, important)

  revalidatePath("/notes") // HIGHLIGHT LINE
  redirect("/notes")
}
```

يخبر الاستدعاء&nbsp;<em>revalidatePath("/notes")</em>&nbsp;Next.js بإبطال النسخة المخزّنة مؤقتاً من صفحة&nbsp;<em>/notes</em>&nbsp;. وفي المرة التالية التي يطلب فيها أحدهم ذلك المسار، سيعيد Next.js عرضه ببيانات حديثة بدلاً من تقديم النسخة القديمة من وقت البناء.

وكقاعدة عامة: كلما عدّل إجراء خادم بيانات تؤثر في صفحة ما، فاقترن التعديل باستدعاء <em>revalidatePath</em> لكل مسار يعرض تلك البيانات.

اختبر تطبيقك دائماً باستخدام&nbsp;<em>npm run build &amp;&amp; npm start</em>&nbsp;قبل النشر لاكتشاف مشكلات التخزين المؤقت مبكراً. وعلامات ناتج البناء (<em>○</em>&nbsp;للثابت، و<em>ƒ</em>&nbsp;للديناميكي) مؤشر مفيد على المسارات المخزّنة مؤقتاً!

الشيفرة الحالية للتطبيق موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part1.

<div class="tasks">

**1.  قائمة المدونات**

</div>

<div class="tasks">

**2. مدونة جديدة**

</div>

### صفحة ملاحظة

رغم أن الأمر مبالغ فيه على الأرجح، لنجعل بعد ذلك عرضاً مستقلاً لكل ملاحظة، بحيث تكون الملاحظة ذات المعرّف 10 في صفحة بالرابط notes/10. ولذلك نحتاج إلى&nbsp;<a href="https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment">مقطع مسار ديناميكي</a>&nbsp;. والطريقة التي نعرّفه بها في موجّه تطبيق Next.js مثيرة للاهتمام تماماً. ننشئ المجلد&nbsp;<em>/app/notes/[id]</em>&nbsp;والملف المعتاد&nbsp;<em>page.tsx</em>&nbsp;داخله:

```ts
import { notFound } from "next/navigation"
import { getNoteById } from "../../services/notes"

const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = getNoteById(Number(id))

  if (!note) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{note.content}&lt;/h2>
      &lt;p>{note.important ? "Important" : "Not important"}&lt;/p>
    &lt;/div>
  )
}

export default NotePage
```

عندما لا تُوجد الملاحظة، نستدعي&nbsp;<a href="https://nextjs.org/docs/app/api-reference/functions/not-found">notFound()</a>&nbsp;من&nbsp;<em>next/navigation</em>&nbsp;. ترمي هذه الدالة خطأً خاصاً يلتقطه Next.js ويعرض أقرب ملف&nbsp;<em>not-found.tsx</em>&nbsp;، أو صفحة 404 افتراضية إن لم يوجد أي منها. وهذه هي الطريقة الاصطلاحية للإشارة إلى مورد مفقود في موجّه تطبيق Next.js.

لاحظ كيف يستقبل المكوّن المعرّف المطابق للجزء الديناميكي من المسار كمعامل&nbsp;<em>params</em>&nbsp;. والمعامل هو promise، لذا يلزم&nbsp;<em>await</em>&nbsp;لفكّ بنيته، ولهذا يجب أن تكون الدالة المعرِّفة للمكوّن&nbsp;<em>async</em>&nbsp;.

وسّعنا أيضاً&nbsp;<em>app/service/notes</em>&nbsp;بدالة تعيد ملاحظة بناءً على معرّف:

```ts
export const getNoteById = (id: number) => {
  return notes.find((note) => note.id === id)
}
```

لنوسّع&nbsp;<em>app/notes/page.tsx</em>&nbsp;لتمكين الانتقال إلى الملاحظات الفردية:

```js
import Link from "next/link" // HIGHLIGHT LINE
import { getNotes } from "../services/notes"

const Notes = () => {
  const notes = getNotes()
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;ul>
        {notes.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link> // HIGHLIGHT LINE
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

### مزيد من الوظائف

لنجعل الآن من الممكن تغيير أهمية الملاحظة. يحتاج الملف&nbsp;<em>services/notes.ts</em>&nbsp;إلى دالة جديدة:

```ts
const notes = [
]

<em>// ...</em>

export const toggleImportance = (id: number) => {
  const note = notes.find((note) => note.id === id)
  if (note) {
    note.important = !note.important
  }
}
```

الآن، في actions/notes، يكون إجراء الخادم كما يلي ويفترض أنه يستقبل معرّف الملاحظة المبدَّلة كمعامل formData:

```js
export const toggleNoteImportance = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  toggleImportance(id)
  revalidatePath(`/notes/${id}`)
  revalidatePath("/notes")
}
```

بعد تبديل الأهمية، يحتاج الإجراء إلى إعادة التحقق من مسار الملاحظة نفسها ومن قائمة الملاحظات. وهذا يبقي جميع العروض متزامنة مع التغيير.

يتغيّر&nbsp;<em>app/notes/[id]/page.tsx</em>&nbsp;إلى:

```ts
import { notFound } from "next/navigation"
import { getNoteById } from "../../services/notes"
import { toggleNoteImportance } from "../../actions/notes" // HIGHLIGHT LINE

const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = getNoteById(Number(id))

  if (!note) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{note.content}&lt;/h2>
      &lt;p>{note.important ? "Important" : "Not important"}&lt;/p>
      // BEGIN HIGHLIGHT
      &lt;form action={toggleNoteImportance}>
        &lt;input type="hidden" name="id" value={note.id} />
        &lt;button type="submit">
          {note.important ? "Mark as not important" : "Mark as important"}
        &lt;/button>
      &lt;/form>
      // END HIGHLIGHT
    &lt;/div>
  )
}
```

التغيير مثير للاهتمام. فأصبح الزر الذي يبدّل الأهمية داخل وسمي form، وإجراء الخادم هو إجراء النموذج. ويحتاج إجراء الخادم إلى&nbsp;<em>id</em>&nbsp;الملاحظة، ولهذا يحتوي النموذج على حقل إدخال&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/hidden">مخفي</a>&nbsp;، يتيح تضمين بيانات لا يمكن لمستخدمي النموذج رؤيتها أو تعديلها.

ومرة أخرى يجب أن نتذكر أن السطرين الأخيرين من إجراء الخادم&nbsp;<em>toggleNoteImportance</em>&nbsp;حاسمين:

```js
export const toggleNoteImportance = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  toggleImportance(id)
  revalidatePath(`/notes/${id}`) // HIGHLIGHT LINE
  revalidatePath("/notes") // HIGHLIGHT LINE
}
```

كل شيء يعمل بدون هذين السطرين في وضع التطوير، ولكن عند تشغيل التطبيق في الإنتاج باستخدام&nbsp;<em>npm run build &amp;&amp; npm start</em>&nbsp;لا ينعكس تبديل الأهمية في الواجهة رغم تنفيذ الطلب في الواجهة الخلفية.

الشيفرة الحالية للتطبيق موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part2.

### عرض الملاحظات المهمة فقط، حل مكوّن العميل

بعد ذلك نقرر تنفيذ ميزة تتيح عرض الملاحظات المهمة فقط. في تطبيق React عادي سيكون هذا سهلاً، إذ يكفي إضافة حالة تتذكر ما ينبغي عرضه وتصفية الملاحظات للعرض وفقاً لذلك.

لذا لنبدأ بحل تقليدي على طريقة React يعتمد على حالة مُنشأة بخطاف React&nbsp;<em>useState</em>&nbsp;. وكما ذُكر في&nbsp;<a href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components">الوثائق</a>&nbsp;، لا تدعم مكوّنات خادم React الحالة، لذا ينبغي استخدام مكوّن عميل. ويُوسم المكوّن كمكوّن عميل باستخدام التوجيه&nbsp;<a href="https://react.dev/reference/rsc/use-client">"use client"</a>&nbsp;في بداية المكوّن:

```ts
"use client"

import Link from "next/link"
import { useState } from "react"

type Note = {
  id: number
  content: string
  important: boolean
}

const NoteList = ({ notes }: { notes: Note[] }) => {
  const [showImportant, setShowImportant] = useState(false)

  const notesToShow = showImportant
    ? notes.filter((note) => note.important)
    : notes

  return (
    &lt;div>
      &lt;button onClick={() => setShowImportant(!showImportant)}>
        {showImportant ? "Show all" : "Show important"}
      &lt;/button>
      &lt;ul>
        {notesToShow.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link>
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}

export default NoteList
```

منطق المكوّن مألوف جداً لدينا. فهو يستقبل قائمة الملاحظات كخاصية، وبناءً على حالته&nbsp;<em>showImportant</em>&nbsp;يعرض إما كل الملاحظات أو المهمة فقط. ويُستخدم زر للتحكم في قيمة&nbsp;<em>showImportant</em>&nbsp;.

أصبح مكوّن الخادم&nbsp;<em>app/notes/page.tsx</em>&nbsp;الآن يمرّر قائمة الملاحظات فقط إلى مكوّن العميل الذي يتولى العرض:

```js
import { getNotes } from "../services/notes"
import NoteList from "./NoteList"

const Notes = () => {
  const notes = getNotes()
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;NoteList notes={notes} />
    &lt;/div>
  )
}
export default Notes
```

![صورة توضيحية](/images/mooc/87c8aa3d6643.webp)

يعمل تطبيقنا الآن إلى حدٍّ ما كما لو كان تطبيق صفحة واحدة تقليدياً بـ React/Express، لكن ليس تماماً. لنستعرض الآن ما يحدث خلف الكواليس عندما ينتقل المستخدم إلى&nbsp;<em>/notes</em>&nbsp;ويضغط على&nbsp;<em>Show important</em>&nbsp;.

<strong>الخطوة 1: ينتقل المستخدم إلى /notes</strong>
- يطلب المتصفح <em>/notes</em> من الخادم
- يعرض الخادم <em>Notes</em>، وهو مكوّن خادم. فيستدعي <em>getNotes()</em>، ويحصل على المصفوفة، ويصادف <em>&lt;NoteList notes={notes} /></em>. وبما أن <em>NoteList</em> مكوّن عميل، لا يعرضه الخادم. بل يسلْسِل مصفوفة الملاحظات إلى <a href="https://nextjs.org/docs/app/glossary#rsc-payload">حمولة RSC</a> كخصائص لمكوّن العميل.
- يتلقى المتصفح HTML + حمولة RSC. ويعرض React المكوّن NoteList كمكوّن عميل. وتهيئ useState(false) قيمة <em>showImportant</em> إلى false.
- تُعرض كل الملاحظات لأن <em>showImportant</em> تساوي false

<strong>الخطوة 2: يضغط المستخدم على "Show important"</strong>
- يعمل معالج النقر في العميل. ويضبط <em>setShowImportant(!showImportant)</em> الحالة إلى true. ولا يُجرى أي طلب إلى الخادم.
- يعيد React عرض <em>NoteList</em> وقيمة <em>showImportant</em> الآن true
- تُعرض الملاحظات المهمة فقط

النقطة الأساسية أن الخطوة 2 تتم بالكامل في العميل. فقد أُرسلت بيانات الملاحظات من الخادم كخصائص خلال الخطوة 1. وتحدث التصفية في المتصفح باستخدام البيانات المجلوبة مسبقاً، دون الحاجة إلى أي رحلة إضافية إلى الخادم.

وعلى النقيض، تأمل كيف كانت الميزة نفسها ستعمل في تطبيق صفحة واحدة تقليدي بـ React/Express كما بنيناه في أجزاء سابقة من Full Stack Open. كان المتصفح سيحمّل أولاً حزمة تطبيق React الكاملة (JavaScript). ثم، لعرض الملاحظات، كان تطبيق React سيجري طلب HTTP GET إلى نقطة نهاية REST API (مثل&nbsp;<em>GET /api/notes</em>&nbsp;)، ويستقبل البيانات بصيغة JSON، ويخزّنها في حالة المكوّن، ويعرض القائمة. وكان التبديل بين «عرض الكل» و«عرض المهم» سيعمل بالطريقة نفسها، في العميل بالكامل، لأن البيانات موجودة أصلاً في الحالة.

يكمن الفرق الأساسي في طريقة وصول البيانات إلى المتصفح. في نموذج تطبيق الصفحة الواحدة، يحمّل المتصفح شيفرة التطبيق أولاً، ثم يجلب البيانات بشكل منفصل عبر استدعاء API. أما في نموذج Next.js، فيعرض الخادم مكوّنات الخادم ويرسل HTML الناتج وحمولة RSC معاً في استجابة واحدة. وتتضمن حمولة RSC الخصائص المسلسَلة لأي مكوّنات عميل، لذا يستقبل مكوّن العميل بياناته كخصائص وليس من استدعاء API. وهذا يعني أن المستخدم يرى المحتوى أسرع، ولا يوجد مؤشر تحميل أثناء انتظار استجابة API، ويُرسل قدر أقل من JavaScript إلى المتصفح.

> ذكرنا&nbsp;<a href="https://nextjs.org/docs/app/glossary#rsc-payload">حمولة RSC</a>&nbsp;مرتين حتى الآن. فما هي بالضبط؟ حمولة RSC هي صيغة بثّ مدمجة شبيهة بالصيغة الثنائية يستخدمها React لإرسال نتيجة المكوّنات المعروضة من الخادم إلى المتصفح. وهي ليست HTML ولا JSON. إنها صيغة تسلسل مخصّصة تحتوي على ثلاثة أشياء: الناتج المعروض لمكوّنات الخادم على هيئة شجرة مكوّنات افتراضية، وعناصر نائبة تحدد مواضع إدراج مكوّنات العميل، والخصائص المسلسَلة التي تحتاجها تلك المكوّنات. في حالتنا، تتضمن حمولة RSC ملف HTML المعروض لمكوّن الخادم <em>Notes</em>، وعلامة تقول «أدرج <em>NoteList</em> هنا»، ومصفوفة الملاحظات المسلسَلة كخصائص لـ <em>NoteList</em>. وعندما يتلقى المتصفح هذه الحمولة، يعرف React بالضبط أين يضع كل مكوّن عميل وما الخصائص التي يعطيها له، دون الحاجة إلى استدعاء API منفصل.

الشيفرة الحالية للتطبيق موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part3.

### عرض الملاحظات المهمة فقط، حل مكوّن الخادم

لنتراجع عن حلنا لتصفية الملاحظات المهمة ونرَ كيف ننفّذ حلاً يعتمد كلياً على استخدام مكوّنات الخادم.

الحل مختلف تماماً عن تلك التي رأيناها حتى الآن في المقرر. وهو كما يلي:

```ts
import Link from "next/link"
import { getNotes } from "../services/notes"

const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const allNotes = getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;div>
        &lt;Link href={showImportant ? "/notes" : "/notes?important=true"}>
          {showImportant ? "show all" : "show important only"}
        &lt;/Link>
      &lt;/div>
      &lt;ul>
        {notes.map((note) => (
          &lt;li key={note.id}>
            &lt;Link href={`/notes/${note.id}`}>{note.content}&lt;/Link>
            {note.important &amp;&amp; &lt;strong> (important)&lt;/strong>}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

هناك الكثير لاستيعابه. أولاً، أصبح مبدّل وضع العرض رابطاً:

```
&lt;Link href={showImportant ? "/notes" : "/notes?important=true"}&gt;
  {showImportant ? "show all" : "show important only"}
&lt;/Link&gt;

```

إذا ضغط المستخدم على الرابط (الذي يكون في البداية&nbsp;<em>show important only</em>&nbsp;)، لا تتغير قائمة الملاحظات المعروضة فحسب، بل ينعكس التغيير أيضاً في الرابط:

![صورة توضيحية](/images/mooc/0e4c4f5e2437.webp)

عندما يتغير الرابط، يُعاد عرض المكوّن. وهنا يحدث السحر. فيستقبل المكوّن معاملات الاستعلام كخاصية&nbsp;<a href="https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional">searchParams</a>&nbsp;، ويتحقق مما إذا كان المعامل&nbsp;<em>important</em>&nbsp;معرّفاً هناك:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  // BEGIN HIGHLIGHT
  const { important } = await searchParams
  const showImportant = important === "true"
// END HIGHLIGHT

  const allNotes = getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

```

إذاً تأخذ المتغيرة&nbsp;<em>showImportant</em>&nbsp;القيمة&nbsp;<em>true</em>&nbsp;إذا كان الرابط&nbsp;<em>"/notes?important=true"</em>&nbsp;، وهذا يؤدي إلى تصفية الملاحظات المعروضة لتقتصر على المهمة فقط.

وعندما يضغط المستخدم المبدّل مرة أخرى (الذي يحمل الآن النص "show all")، يتغير الرابط إلى&nbsp;<em>/notes</em>&nbsp;. ويُعرض المكوّن مجدداً، وهذه المرة لا يكون معامل الاستعلام&nbsp;<em>important</em>&nbsp;مضبوطاً، فلا تُجرى أي تصفية، وتُعرض كل الملاحظات.

إذاً تتحكم التصفية بالكامل عبر الرابط، وتُنفَّذ بالكامل على الخادم. لا JavaScript من جهة العميل، ولا&nbsp;<em>useState</em>&nbsp;، ولا حاجة إلى توجيه&nbsp;<em>"use client"</em>&nbsp;. وعندما ينقر المستخدم على الرابط، ينتقل Next.js إلى الرابط الجديد، ويعيد الخادم عرض المكوّن بمعاملات الاستعلام المحدّثة، ويرسل HTML حديثاً. ويعرض المتصفح النتيجة فحسب.

هذا الأسلوب هو النمط الاصطلاحي المفضّل في Next.js. وتوصي&nbsp;<a href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components">وثائق Next.js</a>&nbsp;بإبقاء المكوّنات مكوّنات خادم كلما أمكن، وعدم اللجوء إلى مكوّنات العميل إلا عندما تحتاج فعلاً إلى تفاعلية في المتصفح مثل تحديثات الواجهة الفورية دون أي تنقل، أو الرسوم المتحركة، أو الوصول إلى واجهات برمجية متاحة في المتصفح فقط.

لاستخدام حالة قائمة على الرابط (عبر معاملات الاستعلام) بدلاً من الحالة في العميل عدة مزايا. فحالة التصفية قابلة للمشاركة: يمكن للمستخدم نسخ الرابط&nbsp;<em>/notes?important=true</em>&nbsp;وإرساله إلى شخص آخر، وسيرى العرض المصفّى نفسه. كما أنها تعمل مع زرّي الرجوع والتقدم في المتصفح دون أي إعداد إضافي. ولأن المكوّن يبقى بالكامل مكوّن خادم، فلا تُرسل شيفرة JavaScript إضافية إلى المتصفح من أجل منطق التصفية.

لنستعرض مرة أخرى ما يحدث خلف الكواليس عندما ينتقل المستخدم إلى&nbsp;<em>/notes</em>&nbsp;ويضغط على&nbsp;<em>Show important</em>&nbsp;

<strong>الخطوة 1: ينتقل المستخدم إلى /notes</strong>
- يُعرض مكوّن الخادم Notes. وتُحلّ searchParams إلى {}، فلا يوجد معامل استعلام important.
- لذا تكون <em>showImportant</em> false، وتُعرض <em>allNotes</em> كلها.
- ويُعرض مكوّن <em>Link</em> مع href="/notes?important=true" والنص "show important only".

<strong>الخطوة 2: يضغط المستخدم على "show important only"</strong>
- يُعاد عرض مكوّن الخادم Notes على الخادم مع حلّ searchParams إلى <em>{ important: "true" }</em>.
- الآن تكون <em>showImportant</em> true، لذا تُصفّى <em>allNotes</em> لتُعرض الملاحظات المهمة فقط.
- ويُعرض مكوّن <em>Link</em> الآن مع href="/notes" والنص "show all".

الشيفرة الحالية للتطبيق موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part4.

<div class="tasks">

**3. صفحة المدونة**

</div>

<div class="tasks">

**4. زر الإعجاب**

</div>

<div class="tasks">

**5. العرض بالترتيب**

</div>

<div class="tasks">

**6. البحث**

</div>
