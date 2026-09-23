---
part: 14
letter: c
title: "قواعد البيانات والترحيلات والعلاقات"
mainImage: /images/part-14.svg
lang: ar
---
### النشر إلى Vercel

في أجزاء سابقة من Full Stack Open، نشرنا الواجهة الخلفية على&nbsp;<a href="https://render.com/">Render</a>&nbsp;أو&nbsp;<a href="https://fly.io/">Fly.io</a>. ومع Next.js، يكون هدف النشر الأكثر طبيعية هو&nbsp;<a href="https://vercel.com/">Vercel</a>، الشركة التي أنشأت Next.js وتواصل صيانته. فمنصّة Vercel مبنية خصيصاً حول Next.js، لذا تعمل ميزات مثل مكوّنات الخادم (Server Components) وإجراءات الخادم (Server Actions) والعرض الثابت وإعادة التحقق مباشرةً دون أي إعداد إضافي.

لنشر التطبيق، ادفع أولاً شيفرة تطبيق الملاحظات إلى مستودع GitHub. ثم:
- اذهب إلى <a href="https://vercel.com/">vercel.com</a> وسجّل حساباً جديداً (أو سجّل الدخول) باستخدام حسابك على GitHub
- اضغط <em>Add New...</em> ثم <em>Project</em>
- اختر مستودع GitHub الذي يحتوي على تطبيق Next.js (لاحظ أنه قد يستغرق بعض الوقت حتى يظهر مستودعك)
- يكتشف Vercel تلقائياً أنه مشروع Next.js ويهيّئ إعدادات البناء. ما عليك سوى الضغط على <em>Deploy</em>

هذا كل شيء. بعد بناء قصير، يمنحك Vercel رابطاً عاماً (شيء مثل&nbsp;<em><a href="https://notes-app-yourname.vercel.app/">https://notes-app-yourname.vercel.app</a></em>) يكون تطبيقك متاحاً عليه:

![صورة توضيحية](/images/mooc/5681d9fdef75.webp)

في كل مرة تدفع فيها commits جديدة إلى الفرع الرئيسي، يعيد Vercel بناء التطبيق ونشره تلقائياً. وإذا دفعت إلى فرع مختلف أو فتحت طلب سحب، ينشئ Vercel&nbsp;<em>نشراً تجريبياً (preview deployment)</em>&nbsp;برابط فريد خاص به، حتى تتمكن من اختبار التغييرات قبل دمجها.

يبدو تطبيقنا يعمل، إلى أن نحاول إنشاء ملاحظات جديدة. وهناك شيء غريب يحدث. قد تظهر الملاحظة المُنشأة حديثاً لفترة وجيزة ثم تختفي عند إعادة تحميل الصفحة. أو قد لا تظهر إطلاقاً.

والسبب أن مكوّنات الخادم وإجراءات الخادم تعمل على Vercel كـ&nbsp;<a href="https://en.wikipedia.org/wiki/Serverless_computing">دوال بلا خادم (serverless functions)</a>. وقد يتولّى معالجة كل طلب نسخة مختلفة من الدالة، وهذه النسخ لا تتشارك الذاكرة. ويمكن تشغيلها أو إيقافها في أي وقت. وطريقتنا الحالية في تخزين الملاحظات داخل مصفوفة JavaScript في الذاكرة معطوبة جوهرياً في هذه البيئة. فعندما تضيف إجراءات الخادم ملاحظة إلى المصفوفة، يوجد هذا التغيير في ذاكرة نسخة واحدة بعينها فقط. وقد يتولّى معالجة الطلب التالي نسخة مختلفة تماماً تملك نسخة جديدة من المصفوفة الأصلية المكتوبة في الشيفرة. وحتى لو تصادف أن تولّت النسخة نفسها معالجة الطلبين، فسيُوقف تشغيلها في النهاية بعد فترة خمول، وتُفقد كل البيانات الموجودة في الذاكرة.

أثناء التطوير باستخدام&nbsp;<em>npm run dev</em>، يعمل كل شيء في عملية Node.js واحدة طويلة العمر، لذا تعمل المصفوفة الموجودة في الذاكرة بشكل مثالي. وهذه فجوة أخرى بين التطوير والإنتاج ينبغي أن تكون على دراية بها.

الحل هو تخزين البيانات في قاعدة بيانات خارجية تستطيع جميع نسخ الدوال بلا خادم الوصول إليها. لنفعل ذلك تالياً.

### إنشاء قاعدة بيانات

في أجزاء سابقة من Full Stack Open، استخدمنا MongoDB قاعدةً للبيانات. وفي&nbsp;<a href="/part13">الجزء 13</a>&nbsp;انتقلنا إلى قاعدة بيانات علائقية هي PostgreSQL. وقواعد البيانات العلائقية هي اختيارنا الآن أيضاً.

يوفّر Vercel قاعدة بيانات PostgreSQL مُدارة تُسمّى&nbsp;<a href="https://vercel.com/docs/storage/vercel-postgres">Vercel Postgres</a>، وتعمل بقوة&nbsp;<a href="https://neon.tech/">Neon</a>. إنها قاعدة بيانات PostgreSQL بلا خادم تتكامل بسلاسة مع عمليات النشر على Vercel، ما يجعلها مناسبة تماماً لتطبيق Next.js لدينا.

لإنشاء قاعدة بيانات، انتقل إلى لوحة تحكم Vercel واتبع هذه الخطوات:
- افتح المشروع الذي نشرته سابقاً
- انتقل إلى تبويب <em>Storage</em>
- اضغط <em>Create Database</em>
- اختر <em>Postgres (Neon)</em> واضغط <em>Continue</em>
- اختر منطقة قريبة من مكان النشر، ثم اضغط <em>Create</em>
- أعطِ قاعدة البيانات اسماً (مثل <em>notes-db</em>)، واضغط <em>Create</em>

بعد الإنشاء، يضيف Vercel تلقائياً متغيرات البيئة الخاصة بالاتصال إلى مشروعك. يمكنك رؤيتها ضمن&nbsp;<em>Settings &gt; Environment Variables</em>. وأهمها&nbsp;<em>DATABASE_URL</em>&nbsp;الذي يحتوي على نص الاتصال الكامل بقاعدة بيانات PostgreSQL لديك.

لاستخدام قاعدة البيانات نفسها محلياً أثناء التطوير، انسخ نص الاتصال من لوحة تحكم Vercel وأنشئ ملف&nbsp;<em>.env.local</em>&nbsp;في جذر مشروعك:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

```

استبدل القيمة بنص الاتصال الفعلي من لوحة تحكم Vercel. يحمّل Next.js ملف&nbsp;<em>.env.local</em>&nbsp;تلقائياً أثناء التطوير، لذا لا حاجة إلى أي إعداد إضافي.

<strong>مهم:</strong>&nbsp;أضف&nbsp;<em>.env.local</em>&nbsp;إلى ملف&nbsp;<em>.gitignore</em>&nbsp;حتى لا تُحفظ بيانات اعتماد قاعدة البيانات أبداً في نظام التحكم بالإصدارات:

```
echo ".env.local" >> .gitignore
```

### الوصول إلى قاعدة البيانات باستخدام Drizzle ORM

في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">Full Stack Open: قواعد البيانات العلائقية</a> استخدمنا <a href="https://sequelize.org/">Sequelize</a> مكتبةً للـ ORM (الربط الكائني-العلائقي) للوصول إلى قاعدة بيانات PostgreSQL. وسنستخدم هذه المرة <a href="https://orm.drizzle.team/">Drizzle ORM</a>، الذي أصبح من أكثر الخيارات شيوعاً في منظومة Next.js.

لماذا Drizzle بدلاً من Sequelize؟ صُمّم Drizzle بحيث يكون TypeScript مواطناً من الدرجة الأولى. فمخطط قاعدة البيانات يُعرَّف بـTypeScript، ويولّد Drizzle نتائج استعلامات منوّعة بالكامل تلقائياً. وهذا يعني أنه إذا قال مخططك إن للملاحظة&nbsp;<em>content</em>&nbsp;(نص) و&nbsp;<em>important</em>&nbsp;(قيمة منطقية)، فستكون كل نتيجة استعلام منوّعة وفقاً لذلك، ويلتقط المترجم الأخطاء قبل أن تشغّل الشيفرة أصلاً. كما ينتج Drizzle استعلامات SQL قريبة جداً مما كنت ستكتبه يدوياً، ما يسهّل فهم ما يحدث في الخلفية. وأخيراً، يوفّر Drizzle دعماً ممتازاً للبيئات بلا خادم مثل Vercel، حيث يجب إدارة الاتصالات بعناية.

لنهيّئ Drizzle لمشروعنا. أولاً، ثبّت الحزم المطلوبة:

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

الحزمة&nbsp;<a href="https://www.npmjs.com/package/drizzle-orm">drizzle-orm</a>&nbsp;هي الـ ORM نفسه. والحزمة&nbsp;<a href="https://www.npmjs.com/package/@neondatabase/serverless">@neondatabase/serverless</a>&nbsp;هي مشغّل PostgreSQL المُحسَّن للبيئات بلا خادم مثل Vercel، حيث تعمل قاعدة البيانات على Neon. والحزمة&nbsp;<a href="https://www.npmjs.com/package/drizzle-kit">drizzle-kit</a>&nbsp;أداة سطر أوامر لإدارة ترحيلات قاعدة البيانات.

بعد ذلك، نعرّف مخطط قاعدة البيانات. ننشئ ملفاً باسم&nbsp;<em>db/schema.ts</em>&nbsp;بالشكل التالي:

```ts
import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core"

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
})
```

يعرّف هذا جدولاً يُسمّى&nbsp;<em>notes</em>&nbsp;بثلاثة أعمدة:
- <em>id</em>&nbsp;من النوع&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#serial">serial</a>&nbsp;أي أنه عدد صحيح يزداد تلقائياً، وهو مُعلَّم باعتباره&nbsp;<a href="https://orm.drizzle.team/docs/indexes-constraints#primary-key">المفتاح الرئيسي</a>&nbsp;للجدول
- <em>content</em>&nbsp;من النوع&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#text">text</a>&nbsp;الذي يقابل نوع&nbsp;<em>TEXT</em>&nbsp;في SQL، وهو مُعلَّم بـ&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#not-null">not null</a>&nbsp;أي أنه يجب أن يكون لكل ملاحظة محتوى
- <em>important</em>&nbsp;من النوع&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#boolean">boolean</a>&nbsp;الذي يخزّن&nbsp;<em>true</em>&nbsp;أو&nbsp;<em>false</em>، وهو أيضاً not null وله&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#default-value">قيمة افتراضية</a>&nbsp;هي&nbsp;<em>false</em>

لاحظ كيف أن المخطط ليس سوى TypeScript. لا توجد صيغة منفصلة لتتعلمها!

بعد ذلك ننشئ اتصال قاعدة البيانات في الملف&nbsp;<em>db/index.ts</em>:

```js
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema })
```

دالة&nbsp;<em>drizzle</em>&nbsp;من&nbsp;<a href="https://orm.drizzle.team/docs/get-started/neon-new">drizzle-orm/neon-http</a>&nbsp;تنشئ اتصالاً بقاعدة البيانات مناسباً للبيئات بلا خادم باستخدام نص الاتصال من متغير البيئة لدينا. ومشغّل&nbsp;<em>neon-http</em>&nbsp;مُحسَّن للبيئات بلا خادم: فهو يتواصل مع قاعدة بيانات Neon عبر HTTP، لذا لا يوجد اتصال دائم يجب إدارته. والنتيجة المُصدَّرة&nbsp;<em>db</em>&nbsp;هي مُنشئ استعلامات منوّع يمكننا استخدامه في كل أنحاء تطبيقنا.

وأخيراً، نحتاج إلى ملف إعدادات Drizzle لأدوات الترحيل، ننشئه في الملف&nbsp;<em>drizzle.config.ts</em>&nbsp;في جذر المشروع:

```js
import { defineConfig } from "drizzle-kit"

import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

يخبر هذا Drizzle Kit بمكان وجود المخطط، وأين يُخرج ملفات الترحيل، وكيف يتصل بقاعدة البيانات.

نحتاج أيضاً إلى تثبيت حزمتين إضافيتين:

```bash
npm install --save-dev dotenv postgres
```

نحتاج إلى حزمة&nbsp;<em>dotenv</em>&nbsp;لأن أوامر Drizzle Kit CLI تعمل كسكربتات Node.js عادية خارج بيئة تشغيل Next.js. فـNext.js يحمّل ملف&nbsp;<em>.env.local</em>&nbsp;تلقائياً لشيفرة تطبيقك، لكن Drizzle Kit لا يستفيد من ذلك. وباستيراد&nbsp;<em>dotenv</em>&nbsp;واستدعاء&nbsp;<em>dotenv.config({ path: ".env.local" })</em>&nbsp;في أعلى&nbsp;<em>drizzle.config.ts</em>، نجعل المتغير&nbsp;<em>DATABASE_URL</em>&nbsp;متاحاً لـDrizzle Kit عند اتصاله بقاعدة البيانات لتشغيل الترحيلات أو فتح Drizzle Studio.

يستخدم تطبيقنا مشغّل&nbsp;<em>@neondatabase/serverless</em>&nbsp;الذي يتواصل مع قاعدة البيانات عبر HTTP. غير أن أوامر Drizzle Kit CLI تحتاج إلى اتصال أكثر تقليدية بقاعدة البيانات. وبدون تثبيت حزمة&nbsp;<em>postgres</em>&nbsp;ستطبع أوامر Drizzle Kit تحذيرات عن بعض الاعتماديات الناقصة.

الآن يمكننا توليد الترحيل وتطبيقه على قاعدة البيانات:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

يقرأ الأمر الأول المخطط ويولّد ملفات ترحيل SQL في مجلد&nbsp;<em>drizzle</em>. ويطبّق الأمر الثاني تلك الترحيلات على قاعدة البيانات، فينشئ جدول&nbsp;<em>notes</em>.

قد تتساءل ما هي الترحيلات. لقد غُطّي هذا الموضوع في&nbsp;<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-4">Full Stack Open: قواعد البيانات العلائقية</a>، وسنعود إليه قريباً، فلا تقلق بعد!

يمكننا التحقق من إنشاء الجدول بتنفيذ:

```bash
npx drizzle-kit studio
```

يفتح هذا&nbsp;<a href="https://orm.drizzle.team/drizzle-studio/overview">Drizzle Studio</a>، وهو متصفح مرئي لقاعدة البيانات على العنوان&nbsp;<a href="https://local.drizzle.studio/">https://local.drizzle.studio</a>&nbsp;حيث يمكننا رؤية جدول&nbsp;<em>notes</em>&nbsp;وأعمدته.

لنضف أيضاً بضع ملاحظات إلى قاعدة البيانات:

![صورة توضيحية](/images/mooc/ac51472b7ac7.webp)

الآن نحن مستعدون لتغيير التطبيق ليستخدم قاعدة البيانات. لنبدأ بقائمة الملاحظات.

نغيّر&nbsp;<em>app/services/notes.ts</em>&nbsp;على النحو التالي:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { notes } from "../../db/schema"

export const getNotes = async () => {
  return db.query.notes.findMany()
}

<em>// ...</em>
```

تستخدم الدالة&nbsp;<em>getNotes</em>&nbsp;<a href="https://orm.drizzle.team/docs/rqb">واجهة الاستعلامات العلائقية</a>&nbsp;في Drizzle عبر&nbsp;<em>db.query</em>. ويقرأ الاستدعاء&nbsp;<em>db.query.notes.findMany()</em>&nbsp;كل الصفوف من جدول&nbsp;<em>notes</em>. وهو يقابل استعلام SQL التالي:

```sql
SELECT id, content, important FROM notes;
```

لاحظ أن الدالة أصبحت&nbsp;<em>async</em>&nbsp;لأن استعلام قاعدة البيانات يعيد promise. ويستنتج Drizzle نوع الإرجاع تلقائياً من المخطط، لذا يعرف TypeScript أن النتيجة مصفوفة من الكائنات فيها&nbsp;<em>id</em>&nbsp;(عدد) و&nbsp;<em>content</em>&nbsp;(نص) و&nbsp;<em>important</em>&nbsp;(قيمة منطقية).

يجب تعديل&nbsp;<em>app/notes/page.tsx</em>&nbsp;ليأخذ في الحسبان أن الدالة أصبحت async:

```ts
import Link from "next/link"
import { getNotes } from "../services/notes"

const Notes = async ({ // HIGHLIGHT LINE
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const allNotes = await getNotes() // HIGHLIGHT LINE
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

  return (
    <em>// ...</em>
  )
}
```

الآن تجلب صفحة الملاحظات بياناتها من قاعدة البيانات:

![صورة توضيحية](/images/mooc/77cdc608c534.webp)

لنغيّر الآن بقية الدوال في&nbsp;<em>app/services/notes.ts</em>&nbsp;لتستخدم قاعدة البيانات:

```ts
export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({
    where: eq(notes.id, id),
  })
}
```

تستخدم الدالة&nbsp;<em>getNoteById</em>&nbsp;الطريقة&nbsp;<a href="https://orm.drizzle.team/docs/rqb#find-first">findFirst</a>. وهي تعيد أول صف مطابق، أو&nbsp;<em>undefined</em>&nbsp;إذا لم يطابق أي صف. وتستخدم جملة&nbsp;<em>where</em>&nbsp;المساعد&nbsp;<a href="https://orm.drizzle.team/docs/operators#eq">eq</a>&nbsp;من&nbsp;<em>drizzle-orm</em>&nbsp;لإنشاء شرط مساواة. و SQL المقابل هو:

```sql
SELECT id, content, important FROM notes WHERE id = 1;
```

ويصبح إنشاء ملاحظة جديدة:

```ts
export const addNote = async (content: string, important: boolean) => {
  await db.insert(notes).values({ content, important })
}
```

تستخدم الدالة&nbsp;<em>addNote</em>&nbsp;مُنشئ الاستعلامات&nbsp;<a href="https://orm.drizzle.team/docs/insert">insert</a>&nbsp;في Drizzle. ويدرج الاستدعاء&nbsp;<em>db.insert(notes).values(...)</em>&nbsp;صفاً جديداً في جدول&nbsp;<em>notes</em>. و SQL المقابل هو:

```sql
INSERT INTO notes (content, important) VALUES ('some content', true);
```

لا حاجة إلى تقديم&nbsp;<em>id</em>&nbsp;لأن العمود معرّف كـ&nbsp;<em>serial</em>، فتولّده قاعدة البيانات تلقائياً.

```ts
export const toggleImportance = async (id: number) => {
  const note = await getNoteById(id)
  if (note) {
    await db
      .update(notes)
      .set({ important: !note.important })
      .where(eq(notes.id, id))
  }
}
```

تجلب الدالة&nbsp;<em>toggleImportance</em>&nbsp;الملاحظة أولاً لقراءة قيمة&nbsp;<em>important</em>&nbsp;الحالية لها، ثم تستخدم مُنشئ الاستعلامات&nbsp;<a href="https://orm.drizzle.team/docs/update">update</a>&nbsp;في Drizzle لقلبها. ويحدّث الاستدعاء&nbsp;<em>db.update(notes).set(...).where(...)</em>&nbsp;الصفوف المطابقة. و SQL المقابل هو:

```sql
UPDATE notes SET important = NOT important WHERE id = 1;
```

بما أن كل الدوال في&nbsp;<em>services/notes.ts</em>&nbsp;أصبحت async، نحتاج إلى إجراء تغييرات مقابلة في بضعة ملفات. فـ&nbsp;<em>app/notes/[id]</em>&nbsp;يحتاج إلى&nbsp;<em>await</em>

```ts
const NotePage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const note = await getNoteById(Number(id)) // HIGHLIGHT LINE

  <em>// ...</em>
}
```

كما تحتاج إجراءات الخادم إلى المعالجة نفسها:

```js
export const createNote = async (formData: FormData) => { // HIGHLIGHT LINE
  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  await addNote(content, important) // HIGHLIGHT LINE

  revalidatePath("/notes")
  redirect("/notes")
}

export const toggleNoteImportance = async (formData: FormData) => { // HIGHLIGHT LINE
  const id = Number(formData.get("id"))
  await toggleImportance(id) // HIGHLIGHT LINE
  revalidatePath(`/notes/${id}`)
  revalidatePath("/notes")
}
```

هناك أمر آخر يجب ملاحظته قبل أن نكمل. يجلب المكوّن&nbsp;<em>Notes</em>&nbsp;دائماً كل الملاحظات من قاعدة البيانات، وتُجرى التصفية المحتملة للملاحظات المهمة في JavaScript بعد الاستعلام:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  // BEGIN HIGHLIGHT
  const allNotes = await getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes
  // END HIGHLIGHT

  return (
    <em>// ...</em>
  )
}
```

بالنسبة لمجموعة بيانات صغيرة، هذا مقبول تماماً، لكن مع عدد كبير من الملاحظات سيكون أكثر كفاءة أن ندع قاعدة البيانات تتولى التصفية بإضافة جملة&nbsp;<em>WHERE</em>&nbsp;إلى استعلام SQL. يمكننا تعديل&nbsp;<em>getNotes</em>&nbsp;ليقبل معاملاً يتحكم في التصفية:

```ts
export const getNotes = async (importantOnly: boolean) => {
  if (importantOnly) {
    return db.query.notes.findMany({
      where: eq(notes.important, true),
    })
  }

  return db.query.notes.findMany()
}
```

عندما تكون&nbsp;<em>importantOnly</em>&nbsp;قيمتها&nbsp;<em>true</em>، يُنفَّذ الاستعلام مع جملة&nbsp;<em>where(eq(notes.important, true))</em>&nbsp;التي تقابل SQL:

```sql
SELECT id, content, important FROM notes WHERE important = true;
```

وعندما تكون&nbsp;<em>importantOnly</em>&nbsp;قيمتها&nbsp;<em>false</em>، تعيد الدالة كل الملاحظات دون أي تصفية، كما كان الحال سابقاً.

يمرّر المكوّن&nbsp;<em>Notes</em>&nbsp;الآن راية&nbsp;<em>showImportant</em>&nbsp;مباشرةً إلى&nbsp;<em>getNotes</em>، وتُزال منطقية التصفية التي كانت تُجرى سابقاً في JavaScript:

```ts
const Notes = async ({
  searchParams,
}: {
  searchParams: Promise&lt;{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const notes = await getNotes(showImportant) // HIGHLIGHT LINE

  return (
    <em>// ....</em>
  )
}
```

هذا أنظف وأكثر كفاءة: فبدلاً من جلب كل الصفوف والتخلص من بعضها في JavaScript، ندع قاعدة البيانات تعيد الصفوف التي نحتاجها فقط.

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part5.

### الترحيلات

الشيء التالي الذي نريد إضافته إلى تطبيقنا هو إمكانية تسجيل المستخدمين الدخول. ولهذا نحتاج بطبيعة الحال إلى جدول جديد في قاعدة البيانات لحفظ المستخدمين. كما نحتاج إلى إجراء تغيير على جدول الملاحظات لأننا نريد ربط كل ملاحظة بمنشئها.

قبل أن نجري هذه التغييرات، لنلقِ نظرة أقرب على ترحيلات قاعدة البيانات، وهو مفهوم مررنا عليه سريعاً عند إعداد قاعدة البيانات لأول مرة.

<a href="https://orm.drizzle.team/docs/migrations">الترحيل</a>&nbsp;تغيير في مخطط قاعدة البيانات مُدار بنظام التحكم بالإصدارات. وفي كل مرة تضيف جدولاً أو تحذف عموداً أو تغيّر نوع بيانات، يُلتقط هذا التغيير كترحيل. وتخدم الترحيلات غرضين: فهي توفّر طريقة قابلة للتكرار لتطبيق تغييرات المخطط على قاعدة البيانات، وتحفظ سجلاً لكيفية تطور المخطط بمرور الوقت.

بدون الترحيلات، كنت ستحتاج إلى تنفيذ عبارات SQL يدوياً مثل&nbsp;<em>CREATE TABLE</em>&nbsp;أو&nbsp;<em>ALTER TABLE</em>&nbsp;في كل بيئة. وهذا عرضة للخطأ ويستحيل تتبعه في نظام التحكم بالإصدارات. أما مع الترحيلات، فتعيش تغييرات المخطط جنباً إلى جنب مع شيفرة تطبيقك في مستودع Git، ويمكن تطبيقها تلقائياً أثناء النشر.

عندما هيّأنا Drizzle لأول مرة، نفّذنا أمرين:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

الأمر الأول،&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-generate">drizzle-kit generate</a>، يقارن مخطط TypeScript الحالي (في&nbsp;<em>db/schema.ts</em>) بالترحيلات المولّدة سابقاً وينتج ملف ترحيل SQL جديداً في مجلد&nbsp;<em>drizzle</em>. وإذا نظرنا إلى ذلك المجلد، سنجد شيئاً مثل:

```
drizzle/
├── 0000_neat_captain_america.sql
└── meta/
    ├── _journal.json
    └── 0000_snapshot.json
```

يحتوي الملف&nbsp;<em>0000_neat_captain_america.sql</em>&nbsp;على SQL الفعلي الذي وُلّد من مخططنا:

```sql
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"important" boolean DEFAULT false NOT NULL
);
```

يحتوي مجلد&nbsp;<em>meta</em>&nbsp;على بيانات وصفية يستخدمها Drizzle Kit لتتبع الترحيلات التي وُلّدت وكيف كان شكل المخطط عند كل نقطة.

الأمر الثاني&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-migrate">drizzle-kit migrate</a>&nbsp;يتصل بقاعدة البيانات وينفّذ أي ملفات ترحيل لم تُطبَّق بعد. ويتتبع Drizzle الترحيلات التي نُفّذت بتخزين معرّفاتها في جدول خاص يُسمّى __<em>drizzle_migrations</em>&nbsp;في قاعدة البيانات. وبهذه الطريقة، يكون تنفيذ&nbsp;<em>drizzle-kit migrate</em>&nbsp;عدة مرات آمناً: فهو يطبّق الترحيلات الجديدة فقط.

سير العمل لتغيير المخطط هو دائماً نفسه:
- عدّل مخطط TypeScript في <em>app/db/schema.ts</em>
- نفّذ <em>npx drizzle-kit generate</em> لإنشاء ملف ترحيل جديد
- راجع SQL المولّد للتأكد من صحة مظهره
- نفّذ <em>npx drizzle-kit migrate</em> لتطبيق الترحيل على قاعدة بياناتك

الخطوة الثالثة مهمة. تحقق دائماً مما ولّده Drizzle قبل تنفيذه على قاعدة بياناتك. يبذل Drizzle قصارى جهده لاستنتاج SQL الصحيح، لكن خصوصاً مع التغييرات المدمّرة (حذف أعمدة، إعادة تسمية جداول)، ينبغي أن تتحقق من المخرجات.

<div class="tasks">

**7. النشر إلى Vercel**

</div>

<div class="tasks">

**8. DrizzleORM وقاعدة بيانات**

</div>

### المستخدمون

لنطبّق هذا عملياً الآن. نحتاج إلى إضافة جدول&nbsp;<em>users</em>&nbsp;وتعديل جدول&nbsp;<em>notes</em>&nbsp;ليشير إلى المستخدم الذي أنشأ كل ملاحظة.

يتغيّر&nbsp;<em>schema.ts</em>&nbsp;على النحو التالي. الجدول الجديد&nbsp;<em>users</em>&nbsp;له ثلاثة أعمدة:

```js
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
})
```

لعمود&nbsp;<em>username</em>&nbsp;قيد إضافي هو&nbsp;<a href="https://orm.drizzle.team/docs/indexes-constraints#unique">unique</a>، ما يعني أنه لا يمكن أن يكون لمستخدمين اثنين اسم المستخدم نفسه. وبمصطلحات SQL، سيولّد Drizzle قيد&nbsp;<em>UNIQUE</em>&nbsp;على هذا العمود، وسترفض قاعدة البيانات أي إدراج ينشئ تكراراً.

يكتسب جدول&nbsp;<em>notes</em>&nbsp;عموداً جديداً هو&nbsp;<em>userId</em>&nbsp;يربط كل ملاحظة بالمستخدم الذي أنشأها:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  // BEGIN HIGHLIGHT
  userId: integer("user_id").references(() => users.id),
  // END HIGHLIGHT
})
```

عمود&nbsp;<em>userId</em>&nbsp;من النوع&nbsp;<a href="https://orm.drizzle.team/docs/column-types/pg#integer">integer</a>&nbsp;ويستخدم الدالة&nbsp;<a href="https://orm.drizzle.team/docs/indexes-constraints#foreign-key">references</a>&nbsp;لإنشاء قيد&nbsp;<a href="https://en.wikipedia.org/wiki/Foreign_key">مفتاح أجنبي</a>&nbsp;يشير إلى عمود&nbsp;<em>id</em>&nbsp;في جدول&nbsp;<em>users</em>. ويخبر هذا قاعدة البيانات بأن كل قيمة في&nbsp;<em>user_id</em>&nbsp;يجب أن تقابل صفاً موجوداً في جدول&nbsp;<em>users</em>. وإذا حاول أحدهم إدراج ملاحظة بقيمة&nbsp;<em>user_id</em>&nbsp;غير موجودة في&nbsp;<em>users</em>، فسترفضها قاعدة البيانات. ويعني المفتاح الأجنبي أيضاً أنه لا يمكن حذف مستخدم لا تزال له ملاحظات تشير إليه.

لاحظ كيف أن العمود مُسمّى&nbsp;<em>userId</em>&nbsp;في TypeScript (camelCase) لكنه يقابل&nbsp;<em>user_id</em>&nbsp;في قاعدة البيانات (snake_case). وهذا اصطلاح شائع: تستخدم شيفرة TypeScript صيغة camelCase بينما يستخدم SQL صيغة snake_case، ويتولى Drizzle هذا الربط عبر وسيط النص الممرَّر إلى&nbsp;<em>integer("user_id")</em>.

الآن نولّد الترحيل ونطبّقه:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

إذا فحصنا ملف الترحيل المولّد، سنرى شيئاً مثل:

```sql
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

ALTER TABLE "notes" ADD COLUMN "user_id" integer;<em>--> statement-breakpoint</em>
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
```

ينشئ الترحيل جدول&nbsp;<em>users</em>&nbsp;ويضيف عمود&nbsp;<em>user_id</em>&nbsp;مع قيد المفتاح الأجنبي الخاص به إلى جدول&nbsp;<em>notes</em>&nbsp;الموجود. لاحظ أن Drizzle لا يعيد إنشاء جدول&nbsp;<em>notes</em>&nbsp;من الصفر. بل يقارن المخطط الجديد بلقطة الترحيل السابقة ويولّد فقط عبارات&nbsp;<em>ALTER TABLE</em>&nbsp;اللازمة لجعل قاعدة البيانات متوافقة.

لننشئ مستخدماً من Drizzle Studio، ونربطه بالملاحظات الموجودة أصلاً في قاعدة البيانات:

![صورة توضيحية](/images/mooc/7cda3289ffb7.webp)

الآن يمكننا إجراء تغيير صغير على مخططنا: نريد تعديله بحيث يصبح المفتاح الأجنبي user_id في جدول&nbsp;<em>notes</em>&nbsp;مطلوباً وألا يقبل القيمة الفارغة:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id), // HIGHLIGHT LINE
})
```

مرة أخرى، نولّد الترحيل:

```bash
npx drizzle-kit generate
```

عند فحص SQL المولّد في الترحيل، نرى عبارة واحدة:

```sql
ALTER TABLE "notes" ALTER COLUMN "user_id" SET NOT NULL;
```

هذا بالضبط ما توقعناه: العمود موجود بالفعل، لذا يحتاج Drizzle فقط إلى إضافة قيد&nbsp;<em>NOT NULL</em>. وبما أننا ربطنا بالفعل كل الملاحظات الموجودة بمستخدم في Drizzle Studio، فلا يوجد أي صف بقيمة&nbsp;<em>user_id</em>&nbsp;فارغة، وسينجح الترحيل. ولو كانت أي ملاحظات لا تزال بقيمة&nbsp;<em>user_id</em>&nbsp;فارغة، لرفضت قاعدة البيانات عبارة&nbsp;<em>ALTER TABLE</em>&nbsp;بخطأ.

يمكننا الآن تطبيق الترحيل:

```bash
npx drizzle-kit migrate
```

### ملاحظات المستخدمين

لننفّذ الآن صفحتين جديدتين، الأولى تعرض قائمة مستخدمي التطبيق. وهي مباشرة إلى حد بعيد. يجب أن يكون المكوّن&nbsp;<em>Users</em>&nbsp;على المسار&nbsp;<em>/users</em>، ولإتباع اصطلاح موجّه التطبيقات في Next.js نضعه في الملف&nbsp;<em>app/users/page.tsx</em>:

```js
import Link from "next/link"
import { getUsers } from "../services/users"

const Users = async () => {
  const users = await getUsers()

  return (
    &lt;div>
      &lt;h2>Users&lt;/h2>
      &lt;ul>
        {users.map((user) => (
          &lt;li key={user.id}>
            &lt;Link href={`/users/${user.id}`}>{user.name}&lt;/Link>
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

اسم المستخدم رابط إلى صفحة المستخدم الفردية التي سننفّذها قريباً.

الدالة&nbsp;<em>getUsers</em>&nbsp;في الملف&nbsp;<em>services/users.ts</em>&nbsp;مباشرة وبسيطة:

```js
import { db } from "../../db"
import { users } from "../../db/schema"

export const getUsers = async () => {
  return db.query.users.findMany()
}
```

يُضاف الرابط إلى صفحة المستخدمين أيضاً إلى&nbsp;<em>app/layout.tsx</em>. والنتيجة النهائية تبدو هكذا:

![صورة توضيحية](/images/mooc/d9d61fc7ecff.webp)

وبعد ذلك صفحة المستخدم الفردي. نريد أن نعرض فيها أيضاً الملاحظات المرتبطة بذلك المستخدم.

باتّباع اصطلاحات موجّه التطبيقات في Next.js، يُنفَّذ المكوّن&nbsp;<em>UserPage</em>&nbsp;في الملف&nbsp;<em>app/users/[id]/page.tsx</em>

```ts
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserById } from "../../services/users"

const UserPage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const user = await getUserById(Number(id))

  if (!user) {
    notFound()
  }

  return (
    &lt;div>
      &lt;h2>{user.name}&lt;/h2>
      &lt;p>Username: {user.username}&lt;/p>
      &lt;h3>Notes&lt;/h3>
      &lt;ul>
        {user.notes.map((note) => (
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

تبدو الدوال في&nbsp;<em>services/users.ts</em>&nbsp;كما يلي:

```ts
export const getUserById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export const getNotesByUserId = async (userId: number) => {
  return db.query.notes.findMany({
    where: eq(notes.userId, userId),
  })
}
```

تبدو صفحة المستخدم هكذا:

![صورة توضيحية](/images/mooc/9c4da15279ca.webp)

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part6.

### استعلامات الربط

يبرز سؤال: تنفيذ&nbsp;<em>UserPage</em>&nbsp;الحالي يجري استعلامين منفصلين على قاعدة البيانات، أحدهما لجلب المستخدم والآخر لجلب ملاحظاته. فهل يمكننا إجراء استعلام واحد فقط يربط المستخدم بالملاحظات المقابلة؟

في SQL، يُفعل هذا عادةً باستخدام&nbsp;<em>JOIN</em>:

```sql
SELECT users.*, notes.* FROM users
LEFT JOIN notes ON notes.user_id = users.id
WHERE users.id = 1;
```

يقدّم Drizzle ميزة تُسمّى&nbsp;<a href="https://orm.drizzle.team/docs/relations">العلاقات (relations)</a>&nbsp;تتيح لنا تعريف العلاقات بين الجداول على مستوى التطبيق. ولا تُخزَّن تعريفات العلاقات هذه في قاعدة البيانات، ولا تولّد أي قيود SQL أو ترحيلات. بل توجد فقط لتخبر Drizzle كيف تتصل الجداول ببعضها، حتى تستطيع&nbsp;<a href="https://orm.drizzle.team/docs/rqb">واجهة الاستعلامات العلائقية</a>&nbsp;في Drizzle ربط البيانات المرتبطة تلقائياً نيابةً عنا.

يتغيّر&nbsp;<em>schema.ts</em>&nbsp;إلى

```js
import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
    <em>// ...</em>
})

export const notes = pgTable("notes", {
  <em>// ...</em>
})

// BEGIN HIGHLIGHT
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}))
// END HIGHLIGHT
```

تُستخدم دالة&nbsp;<a href="https://orm.drizzle.team/docs/relations">relations</a>&nbsp;من&nbsp;<em>drizzle-orm</em>&nbsp;للإعلان عن كيفية ارتباط الجداول ببعضها. والوسيط الأول هو الجدول، والثاني دالة رد نداء تستقبل دوال مساعدة (<em>many</em>&nbsp;و&nbsp;<em>one</em>) وتعيد كائناً يصف الجداول المرتبطة.

يقول تعريف&nbsp;<em>usersRelations</em>&nbsp;إن المستخدم يمكن أن تكون له&nbsp;<a href="https://orm.drizzle.team/docs/relations#one-to-many">ملاحظات كثيرة (many)</a>.

ويقول تعريف&nbsp;<em>notesRelations</em>&nbsp;إن الملاحظة تنتمي إلى&nbsp;<a href="https://orm.drizzle.team/docs/relations#one-to-one">مستخدم واحد (one)</a>. وتخبر خاصيتا&nbsp;<em>fields</em>&nbsp;و&nbsp;<em>references</em>&nbsp;Drizzle بالأعمدة التي تشكّل الرابط:&nbsp;<em>notes.userId</em>&nbsp;في جدول الملاحظات يشير إلى&nbsp;<em>users.id</em>&nbsp;في جدول المستخدمين.

لاحظ أن خاصيتي&nbsp;<em>fields</em>&nbsp;و&nbsp;<em>references</em>&nbsp;مطلوبتان دائماً في الجهة التي تحمل عمود المفتاح الأجنبي، وهي في حالتنا جهة&nbsp;<em>notes</em>، لأن&nbsp;<em>user_id</em>&nbsp;يقع في جدول الملاحظات.

من المهم أن تفهم أن تعريفات العلاقات هذه منفصلة عن المفتاح الأجنبي&nbsp;<em>references</em>&nbsp;الذي عرّفناه سابقاً في استدعاء&nbsp;<em>pgTable</em>. فقيد المفتاح الأجنبي تفرضه قاعدة البيانات، بينما تُستخدم تعريفات&nbsp;<em>relations</em>&nbsp;فقط في واجهة الاستعلامات في Drizzle لمعرفة كيفية ربط البيانات. تحتاج إلى كليهما: المفتاح الأجنبي لسلامة البيانات، والعلاقات للاستعلام المريح.

الآن يتغيّر&nbsp;<em>services/users.ts</em>&nbsp;إلى

```ts
export const getUserWithNotes = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { notes: true },
  })
}
```

الإضافة الجوهرية إلى ما رأيناه سابقاً هي&nbsp;<a href="https://orm.drizzle.team/docs/rqb#include-relations">with: { notes: true }</a>&nbsp;التي تخبر Drizzle بأن يجلب أيضاً كل الملاحظات المرتبطة بذلك المستخدم في العملية نفسها.

في الخلفية، يترجم Drizzle هذا إلى استعلام فعّال يربط جدولي users وnotes. والنتيجة كائن مستخدم واحد مرفقة به مصفوفة&nbsp;<em>notes</em>، شيء مثل:

```
{
  id: 1,
  username: "mluukkai",
  name: "Matti Luukkainen",
  notes: [
    { id: 1, content: "next.js utilizes React Server Components", important: true, userId: 1 },
    { id: 2, content: "next.js is built on top of React", important: true, userId: 1 },
  ]
}
```

يحل هذا محل الدالتين المنفصلتين&nbsp;<em>getUserById</em>&nbsp;و&nbsp;<em>getNotesByUserId</em>&nbsp;بدالة واحدة تجلب كل شيء دفعة واحدة.

هذه هي الدالة الوحيدة اللازمة في&nbsp;<em>UserPage</em>

```ts
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserWithNotes } from "../../services/users"

const UserPage = async ({ params }: { params: Promise&lt;{ id: string }> }) => {
  const { id } = await params
  const user = await getUserWithNotes(Number(id))  // HIGHLIGHT LINE

  return (
    &lt;div>
      &lt;h2>{user.name}&lt;/h2>
      &lt;p>Username: {user.username}&lt;/p>
      &lt;h3>Notes&lt;/h3>
      &lt;ul>
        {user.notes.map((note) => ( // HIGHLIGHT LINE
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

أصبح المكوّن أبسط الآن: فبدلاً من استدعاء دالتين ودمج النتيجتين يدوياً، يستدعي&nbsp;<em>getUserWithNotes</em>&nbsp;مرة واحدة ويحصل على كائن مستخدم يحتوي أصلاً على مصفوفة الملاحظات. و&nbsp;<em>user.notes.map(...)</em>&nbsp;يمر على الملاحظات المضمّنة مباشرةً، دون حاجة إلى استعلام منفصل.

توجد الآن مشكلة صغيرة في إنشاء ملاحظات جديدة. فمخططنا يتطلب أن يكون لكل ملاحظة&nbsp;<em>user_id</em>&nbsp;يشير إلى منشئها:

```ts
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  userId: integer("user_id")
    .notNull() // HIGHLIGHT LINE
    .references(() => users.id),
})
```

بما أن التطبيق لا يدعم تسجيل دخول المستخدمين بعد، لا يمكننا معرفة من ينشئ الملاحظة. وكحل مؤقت، لنربط كل ملاحظة جديدة بمستخدم عشوائي من قاعدة البيانات. نغيّر دالة&nbsp;<em>addNote</em>&nbsp;في&nbsp;<em>services/notes.ts</em>:

```ts
export const addNote = async (content: string, important: boolean) => {
  const user = await db.query.users.findFirst({
    orderBy: sql`RANDOM()`,
  })

  await db.insert(notes).values({ content, important, userId: user.id })
}
```

تستخدم الدالة&nbsp;<em>findFirst</em>&nbsp;مع&nbsp;<em>orderBy: sql`RANDOM()`</em>&nbsp;لاختيار مستخدم عشوائي من قاعدة البيانات. ويتيح لنا وسم القالب&nbsp;<a href="https://orm.drizzle.team/docs/sql">sql</a>&nbsp;من&nbsp;<em>drizzle-orm</em>&nbsp;كتابة أجزاء SQL خام عندما لا يملك Drizzle دالة مساعدة مدمجة لشيء ما. ثم تُدرج الملاحظة بمعرّف ذلك المستخدم&nbsp;<em>id</em>&nbsp;كرقم&nbsp;<em>userId</em>. وسنستبدل هذا الحل المؤقت بمصادقة مستخدمين مناسبة قريباً.

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part7.

#### مسجّل الاستعلامات

عندما يتصرف شيء ما بشكل غير متوقع، يفيد رؤية SQL الفعلي الذي يرسله Drizzle إلى قاعدة البيانات. يمكنك تفعيل التسجيل بتمرير خيار&nbsp;<em>logger</em>&nbsp;عند إنشاء الاتصال في&nbsp;<em>db/index.ts</em>:

```js
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: true, // HIGHLIGHT LINE
})

```

مع&nbsp;<em>logger: true</em>، يطبع Drizzle كل عبارة SQL ومعاملاتها إلى الطرفية أثناء معالجة تطبيقك للطلبات. مثلاً، جلب الملاحظات ينتج مخرجات مثل:

```
Query: select "id", "content", "important", "user_id" from "notes" where "notes"."important" = $1 -- params: [true]

```

يسهّل هذا اكتشاف مشكلات مثل جلب كل الصفوف سهواً بدلاً من التصفية، أو تنفيذ استعلامات أكثر من المتوقع، أو تمرير معامل خاطئ. تذكّر أن توقف التسجيل في الإنتاج لتجنب إثقال سجلاتك.

### تحذير بشأن الترحيلات

قد تكون الترحيلات خادعة، خصوصاً أثناء التطوير حين يتغير المخطط بشكل متكرر. ومن الشائع أن ينتهي بك الأمر إلى حالة تصبح فيها حالة الترحيل غير متزامنة مع قاعدة البيانات الفعلية، مثلاً إذا عدّلت قاعدة البيانات يدوياً، أو حرّرت ملف ترحيل بعد تطبيقه، أو ولّدت ترحيلاً ثم غيّرت المخطط مرة أخرى قبل تطبيقه.

وعندما تسوء الأمور، سترى عادةً أخطاء مثل "relation already exists" أو "column does not exist" عند تنفيذ&nbsp;<em>drizzle-kit migrate</em>. ويحدث هذا لأن متتبع الترحيلات في Drizzle يظن أن قاعدة البيانات في حالة معينة، بينما قاعدة البيانات الفعلية في حالة أخرى.

أثناء التطوير، وحين لا تحتوي قاعدة البيانات على أي بيانات مهمة، فإن أبسط استراتيجية للتعافي هي البدء من جديد. ويمكنك فعل ذلك في خطوتين:

أولاً، أزل تتبع ترحيلات Drizzle من قاعدة البيانات وأسقط كل الجداول التي أنشأتها:

```sql
DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

يمكنك تنفيذ عبارات SQL هذه في Drizzle Studio أو مباشرةً في طرفية Neon على لوحة تحكم Vercel.

ثانياً، أزل سجل الترحيلات المحلي حتى ينسى Drizzle Kit كل الترحيلات المولّدة سابقاً:

```bash
npx drizzle-kit drop
```

يتيح لك الأمر&nbsp;<a href="https://orm.drizzle.team/docs/drizzle-kit-drop">drizzle-kit drop</a>&nbsp;اختيار إدخالات الترحيل التي تريد إزالتها من السجل المحلي. وبعد إسقاطها، يمكنك إعادة توليد كل شيء وتطبيقه من جديد بشكل نظيف:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

يمنحك هذا بداية جديدة: فملفات الترحيل تُولَّد مجدداً من المخطط الحالي، وجداول قاعدة البيانات تُنشأ من الصفر.

خيار "الحل الجذري" هذا مقبول تماماً أثناء التطوير. أما في الإنتاج فلا ينبغي أبداً إسقاط الجداول أو حذف سجل الترحيلات، لأن ذلك يعني فقدان بيانات مستخدمين حقيقية. وفي بيئة الإنتاج، النهج الصحيح هو التقدم دائماً إلى الأمام: اكتب ترحيلاً جديداً يصلح المشكلة بدلاً من محاولة التراجع عن الترحيلات السابقة. لكن لأغراضنا في هذه الدورة، البدء من جديد هو أسرع طريقة للخروج من المأزق.

<div class="tasks">

**9. المستخدمون**

</div>

<div class="tasks">

**10. صفحة المستخدم**

</div>
