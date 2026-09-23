---
part: 14
letter: d
title: "المصادقة والمزيد"
mainImage: /images/part-14.svg
lang: ar
---
### تسجيل الدخول

لإضافة المصادقة إلى تطبيق Next.js لدينا نستخدم&nbsp;<a href="https://authjs.dev/">NextAuth.js</a>، وهي أشهر مكتبة مصادقة لـNext.js. تتولى NextAuth مجرى المصادقة بأكمله: الجلسات (sessions) وعمليات الاستدعاء (callbacks) وتكاملات المزوّدين. نحتاج أيضاً إلى&nbsp;<a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a>&nbsp;لتجزئة كلمات المرور ومقارنتها بشكل آمن.

نبدأ بتثبيت الحزم المطلوبة:

```bash
npm install next-auth@beta bcryptjs &amp;&amp; npm install -D @types/bcryptjs
```

#### تغيير المخطط

كما في الأجزاء السابقة من الدورة، نحتاج إلى تخزين كلمة مرور مُجزَّأة لكل مستخدم. يكتسب جدول&nbsp;<em>users</em>&nbsp;عموداً جديداً:

```js
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""), // HIGHLIGHT LINE
})
```

يُسمى العمود&nbsp;<em>passwordHash</em>&nbsp;في TypeScript ويُقابل&nbsp;<em>password_hash</em>&nbsp;في قاعدة البيانات. نخزّن التجزئة فقط، ولا نخزّن كلمة المرور النصية الصريحة أبداً. القيمة الافتراضية المتمثلة في نص فارغ تتيح لنا إضافة العمود إلى جدول يحتوي بالفعل على صفوف دون خرق قيد not-null.

وكالعادة نولّد الترحيل ثم نطبّقه:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

#### إعدادات NextAuth

قلب الإعداد هو ملف إعدادات NextAuth&nbsp;<em>auth.ts</em>:

```js
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "../db"
import { users } from "../db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username as string),
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )

        if (!isValid) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
```

تدعم NextAuth العديد من&nbsp;<a href="https://authjs.dev/getting-started/providers">مزوّدي المصادقة</a>&nbsp;المختلفين مثل Google وGitHub وFacebook. هنا نستخدم&nbsp;<a href="https://authjs.dev/getting-started/authentication/credentials">مزوّد بيانات الاعتماد (Credentials provider)</a>، الذي يتيح للمستخدمين تسجيل الدخول باسم مستخدم وكلمة مرور.

تُعدّ دالة&nbsp;<em>authorize</em>&nbsp;جوهر مزوّد بيانات الاعتماد. تستقبل القيم التي كتبها المستخدم في نموذج تسجيل الدخول بوصفها&nbsp;<em>credentials</em>. ثم تبحث عن المستخدم في قاعدة البيانات باسم المستخدم، وتستخدم&nbsp;<a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.compare</a>&nbsp;للتحقق مما إذا كانت كلمة المرور المُرسلة تطابق التجزئة المخزّنة. إذا نجحت المصادقة، تُعيد الدالة كائن مستخدم ستستخدمه NextAuth لبناء الجلسة. وإذا فشلت لأي سبب، تُعيد&nbsp;<em>null</em>، ما يجعل NextAuth يرفض محاولة تسجيل الدخول.

عند نجاح المصادقة، تُعيد&nbsp;<em>authorize</em>&nbsp;كائناً عادياً تشفّره NextAuth في رمز جلسة JWT:

```
{
  id: String(user.id),
  name: user.name,
  email: user.username,
}
```

يحتوي نوع الجلسة المدمج في NextAuth على ثلاثة حقول:&nbsp;<em>id</em>&nbsp;و&nbsp;<em>name</em>&nbsp;و&nbsp;<em>email</em>. ليس لدينا بريد إلكتروني في مخططنا، لذا نعيد استخدام حقل&nbsp;<em>email</em>&nbsp;لتخزين اسم المستخدم بدلاً منه. هذا حلّ التفافي متعمّد: فلا تقدّم NextAuth حقل&nbsp;<em>username</em>&nbsp;مدمجاً، وبدلاً من توسيع نوع الجلسة بتعريفات TypeScript مخصّصة، نعيد استخدام حقل موجود يؤدي الغرض نفسه المتمثل في تحديد هوية المستخدم بشكل فريد. والنتيجة أننا حيثما قرأنا الجلسة لاحقاً على الخادم باستخدام&nbsp;<em>auth()</em>، نستخرج اسم المستخدم من&nbsp;<em>session.user.email</em>.

يخبر خيار&nbsp;<em>pages: { signIn: "/login" }</em>&nbsp;‏NextAuth باستخدام صفحة تسجيل الدخول الخاصة بنا على&nbsp;<em>/login</em>&nbsp;بدلاً من صفحة تسجيل الدخول المدمجة في NextAuth. وكلما احتاجت NextAuth إلى توجيه مستخدم غير مُصادَق إليه لتسجيل الدخول، أرسلته إلى&nbsp;<em>/login</em>. وبدون هذا الخيار، كانت NextAuth ستوجّهه إلى صفحتها الافتراضية على&nbsp;<em>/api/auth/signin</em>، وهي صالحة للعمل لكنها بلا تنسيق ومنفصلة عن بقية التطبيق.

يخبر خيار&nbsp;<em>session: { strategy: "jwt" }</em>&nbsp;‏NextAuth بتخزين بيانات الجلسة في&nbsp;<a href="https://jwt.io/">JSON Web Token</a>&nbsp;موقّع داخل ملف تعريف ارتباط (cookie)، بدلاً من مخزن جلسات على الخادم. وهذا يعمل جيداً في البيئات الخادمية بلا خوادم مثل Vercel حيث لا توجد ذاكرة مشتركة بين نسخ الدوال.

#### ما هي الجلسة في الحقيقة

بعد تسجيل دخول ناجح، تنشئ NextAuth جلسة وتخزّنها كـJWT موقّع في ملف تعريف ارتباط HTTP-only في المتصفح. ويُرسَل ملف تعريف الارتباط تلقائياً مع كل طلب لاحق. وعلى الخادم، تتحقق NextAuth من التوقيع وتقرأ الرمز لتعرف من هو المستخدم، دون لمس قاعدة البيانات.

يحتوي الرمز على ما أرجعته دالة&nbsp;<em>authorize</em>&nbsp;مهما كان: في حالتنا&nbsp;<em>id</em>&nbsp;و&nbsp;<em>name</em>&nbsp;و&nbsp;<em>email</em>&nbsp;(الذي استخدمناه لتخزين اسم المستخدم). هذه القيم متاحة عبر&nbsp;<em>useSession</em>&nbsp;على العميل وعبر&nbsp;<em>auth()</em>&nbsp;على الخادم. ولأن الرمز موقّع، فلا يمكن العبث به دون أن يكتشف الخادم ذلك.

#### مسار API للمصادقة

تتطلب NextAuth&nbsp;<a href="https://authjs.dev/getting-started/installation#configure-your-next-js-application">مسار API</a>&nbsp;يتولى جميع طلبات المصادقة (تسجيل الدخول، تسجيل الخروج، فحوصات الجلسة). ننشئ الملف&nbsp;<em>app/api/auth/[...nextauth]/route.ts</em>:

```js
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

جزء [...nextauth] هو&nbsp;<a href="https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment">مقطع مسار شامل (catch-all route segment)</a>&nbsp;في Next.js يطابق أي مسار تحت&nbsp;<em>/api/auth/</em>، مثل&nbsp;<em>/api/auth/signin</em>&nbsp;و&nbsp;<em>/api/auth/signout</em>&nbsp;و&nbsp;<em>/api/auth/session</em>. تعترض NextAuth كل هذه المسارات وتتولى التعامل معها تلقائياً.

في الوقت الحالي، تعمل NextAuth هنا كصندوق أسود: نسلّمها إعداداتنا فتتولى كل نقاط نهاية المصادقة خلف الكواليس. اسم المجلد&nbsp;<em>[...nextauth]</em>&nbsp;ومفهوم مسارات API في Next.js جديدان علينا. سنعود إلى مسارات API لاحقاً في المادة.

#### مزوّد الجلسة والتخطيط

تحتاج بعض أجزاء واجهتنا إلى الوصول إلى الجلسة من جهة العميل. وشريط التنقل أوضح مثال على ذلك: إذ يمكنه مثلاً عرض اسم المستخدم المسجّل وزر تسجيل خروج عند وجود جلسة، ورابط تسجيل دخول عند عدم وجودها. يتطلب هذا النوع من العرض الشرطي أن تكون الجلسة متاحة في المتصفح، لا على الخادم فقط.

تشارك الخطافات الخاصة بالعميل في NextAuth مثل&nbsp;<em>useSession</em>&nbsp;بيانات الجلسة عبر سياق React (React context)، وهذا يتطلب وجود مكوّن مزوّد فوق أي مكوّن يستخدمه. وتوفّر NextAuth مزوّدها الخاص&nbsp;<a href="https://authjs.dev/getting-started/session-management/get-session#client-side">SessionProvider</a>&nbsp;لهذا الغرض تحديداً. ولأنه يستخدم سياق React فيجب أن يكون مكوّن عميل، وبما أننا لا نستطيع وضع مكوّن عميل مباشرة في التخطيط الجذري، ننشئ غلافاً رفيعاً&nbsp;<em>app/components/SessionProvider.tsx</em>:

```js
"use client"

import { SessionProvider } from "next-auth/react"

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return &lt;SessionProvider>{children}&lt;/SessionProvider>
}
```

ثم نحدّث&nbsp;<em>layout.tsx</em>&nbsp;لنلفّ التطبيق داخل&nbsp;<em>AuthSessionProvider</em>، مما يمنح كل مكوّن عميل في الشجرة وصولاً إلى الجلسة عبر&nbsp;<em>useSession</em>:

```js
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;AuthSessionProvider> // HIGHLIGHT LINE
          &lt;NavBar />
          {children}
        &lt;/AuthSessionProvider> // HIGHLIGHT LINE
      &lt;/body>
    &lt;/html>
  )
}
```

#### شريط التنقل

يحتاج شريط التنقل إلى العرض بشكل مختلف وفقاً لما إذا كان المستخدم مسجّلاً. ولأن زر تسجيل الخروج يستدعي&nbsp;<em>signOut()</em>&nbsp;داخل معالج&nbsp;<em>onClick</em>، فيجب أن يكون المكوّن مكوّن عميل. ويحصل على الجلسة عبر خطاف&nbsp;<a href="https://authjs.dev/getting-started/session-management/get-session#client-side">useSession</a>، الذي يسحب القيمة من سياق React الذي يوفّره&nbsp;<em>SessionProvider</em>. نضع المكوّن في&nbsp;<em>app/components/NavBar.tsx</em>:

```js
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav>
      &lt;Link href="/">home&lt;/Link>
      {" | "}
      &lt;Link href="/notes">notes&lt;/Link>
      {" | "}
      &lt;Link href="/users">users&lt;/Link>
      {" | "}
      // BEGIN HIGHLIGHT
      {session ? (
        &lt;>
          &lt;Link href="/notes/new">create new&lt;/Link>
          {" | "}
          &lt;em>{session.user?.name} logged in&lt;/em>{" "}
          &lt;button onClick={() => signOut()}>logout&lt;/button>
        &lt;/>
      ) : (
        &lt;Link href="/login">login&lt;/Link>
      )}
      // END HIGHLIGHT
    &lt;/nav>
  )
}
```

عند وجود جلسة، يعرض شريط التنقل اسم المستخدم المسجّل، ورابطاً لإنشاء ملاحظة جديدة، وزر تسجيل خروج يستدعي&nbsp;<a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-out">signOut</a>. وعند عدم وجود جلسة، يعرض رابط تسجيل دخول بدلاً من ذلك.

#### صفحة تسجيل الدخول

تقع صفحة تسجيل الدخول في&nbsp;<em>app/login/page.tsx</em>. وهي مكوّن عميل لأنها تتولى إرسال النموذج وتدير حالة محلية لرسائل الخطأ:

```js
"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SubmitEvent&lt;HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid username or password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    &lt;div>
      &lt;h2>Login&lt;/h2>
      {error &amp;&amp; &lt;p style={{ color: "red" }}>{error}&lt;/p>}
      &lt;form onSubmit={handleSubmit}>
        &lt;div>
          &lt;label>
            Username
            &lt;input type="text" name="username" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Password
            &lt;input type="password" name="password" required />
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Login&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}
```

يستدعي النموذج&nbsp;<a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-in">signIn</a>&nbsp;من&nbsp;<em>next-auth/react</em>&nbsp;مع&nbsp;<em>redirect: false</em>، ما يعني أن NextAuth ستُعيد النتيجة ككائن بدلاً من إعادة توجيه المتصفح تلقائياً. وإذا فشلت المصادقة، فستُضبط قيمة&nbsp;<em>result.error</em>&nbsp;ونعرض رسالة خطأ. وإذا نجحت، نستخدم موجّه Next.js للانتقال إلى الصفحة الرئيسية ونستدعي&nbsp;<em>router.refresh()</em>&nbsp;لإجبار مكوّنات الخادم في الشجرة على إعادة العرض بالجلسة الجديدة.

#### قراءة الجلسة على الخادم

بالنسبة إلى مكوّنات الخادم وإجراءات الخادم لا يمكننا استخدام&nbsp;<em>useSession</em>، لأن الخطافات تعمل في المتصفح فقط. وبدلاً من ذلك توفّر Auth.js دالة&nbsp;<a href="https://authjs.dev/reference/nextjs#auth">auth</a>، التي تقرأ الجلسة من ترويسات الطلب من جهة الخادم. نلفّ هذا في دالة مساعدة&nbsp;<em>app/services/session.ts</em>:

```js
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users } from "../../db/schema"

export const getCurrentUser = async () => {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  return db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })
}
```

تذكّر أننا في دالة&nbsp;<em>authorize</em>&nbsp;في&nbsp;<em>auth.ts</em>&nbsp;خزّنّا اسم المستخدم في حقل&nbsp;<em>email</em>&nbsp;لكائن المستخدم المُعاد. وتستخرج دالة&nbsp;<em>getCurrentUser</em>&nbsp;تلك القيمة من الجلسة وتجلب سجل المستخدم الكامل من قاعدة البيانات.

#### حماية إجراء إنشاء الملاحظة

الآن وقد أصبحت المصادقة جاهزة، يمكننا حماية إجراء الخادم&nbsp;<em>createNote</em>&nbsp;بحيث لا يتمكن سوى المستخدمين المسجّلين من إنشاء الملاحظات:

```js
export const createNote = async (formData: FormData) => {
  const session = await auth() // HIGHLIGHT LINE
  if (!session) { // HIGHLIGHT LINE
    redirect("/login") // HIGHLIGHT LINE
  } // HIGHLIGHT LINE

  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

إذا لم تكن هناك جلسة نشطة، يُوجَّه المستخدم إلى صفحة تسجيل الدخول قبل إنشاء أي ملاحظة.

يمكننا أيضاً استبدال الحلّ الالتفافي العشوائي للمستخدم في&nbsp;<em>addNote</em>&nbsp;باستدعاء سليم لـ&nbsp;<em>getCurrentUser</em>:

```ts
import { getCurrentUser } from "./session"

export const addNote = async (content: string, important: boolean) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  await db.insert(notes).values({ content, important, userId: user.id })
}
```

#### متغيرات البيئة

تتطلب NextAuth مفتاحاً سرياً لتوقيع رموز جلسة JWT. يمكنك توليد واحد مثلاً كما يلي:

```
echo "$(openssl rand -base64 32)"
```

انسخ الناتج يدوياً إلى&nbsp;<em>.env.local</em>:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-generated-secret-here
```

على Vercel، أضف&nbsp;<em>AUTH_SECRET</em>&nbsp;و&nbsp;<em>AUTH_URL</em>&nbsp;تحت&nbsp;<em>Settings &gt; Environment Variables</em>. وقيمة&nbsp;<em>AUTH_URL</em>&nbsp;هي الرابط العام لتطبيقك المنشور، مثلاً&nbsp;<em><a href="https://your-app.vercel.app/">https://your-app.vercel.app</a></em>.

#### تعيين كلمات المرور للمستخدمين الحاليين

بعد إضافة عمود&nbsp;<em>passwordHash</em>، أصبح لدى المستخدمين الحاليين في قاعدة البيانات نص فارغ كتجزئة لكلمة المرور، ما يعني أنهم لا يستطيعون تسجيل الدخول بعد. نحتاج إلى طريقة لتعيين كلمات مرور حقيقية لهم. وبدلاً من القيام بذلك يدوياً عبر Drizzle Studio، يمكننا كتابة نص أداة صغير&nbsp;<em>set-password.ts</em>&nbsp;في جذر المشروع:

```ts
import { config } from "dotenv"
config({ path: ".env.local" })
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

async function setPassword(username: string, password: string) {
  const { db } = await import("./db")
  const { users } = await import("./db/schema")
  const hash = await bcrypt.hash(password, 10)
  await db
    .update(users)
    .set({ passwordHash: hash })
    .where(eq(users.username, username))
  console.log(`Password set for user: ${username}`)
}

const username = process.argv[2]
const password = process.argv[3]

if (!username || !password) {
  console.log("Usage: npx tsx set-password.ts &lt;username> &lt;password>")
  process.exit(1)
}

setPassword(username, password).then(() => process.exit(0))
```

يقرأ النص اسم مستخدم وكلمة مرور نصية صريحة من وسائط سطر الأوامر. ويجزّئ كلمة المرور باستخدام&nbsp;<a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.hash</a>&nbsp;بمعامل كلفة قدره 10، ثم يحدّث صف المستخدم المطابق في قاعدة البيانات. يتحكم معامل الكلفة في مقدار الكلفة الحسابية لحساب التجزئة: فالقيم الأعلى أبطأ في الكسر بالقوة الغاشمة لكنها أبطأ أيضاً في التحقق عند تسجيل الدخول. والقيمة 10 هي الافتراضية الموصى بها عادةً.

شغّل النص باستخدام&nbsp;<a href="https://tsx.is/">tsx</a>، الذي ينفّذ ملفات TypeScript مباشرة دون خطوة تجميع منفصلة:

```bash
npx tsx set-password.ts mluukkai secretpassword
```

هذا النص بطبيعة الحال أداة تطويرية فقط.

### مراجعة مجرى المصادقة

توجد عدة أجزاء متحركة في إعداد المصادقة، لذا يجدر بنا التوقف قليلاً وتتبّع كيفية ارتباطها ببعضها.

<strong>تسجيل الدخول.</strong> يملأ المستخدم نموذج تسجيل الدخول على <em>/login</em>. ويستدعي معالج <em>onSubmit</em> في النموذج <em>signIn("credentials", { redirect: false, ... })، وهي</em> دالة توفّرها NextAuth. وتقوم <em>signIn</em> في NextAuth خلف الكواليس بإرسال طلب <em>POST</em> إلى مسار API الشامل عند <em>/api/auth/callback/credentials</em>. ومعالج المسار معرّف في <em>app/api/auth/[...nextauth]/route.ts</em>، حيث تسجّل <em>handlers</em> المصدَّرة من <em>auth.ts</em> معالجَي GET وPOST لدى Next.js.

عند وصول POST، يتولى منطق NextAuth الداخلي الأمر ويستدعي دالة <em>authorize</em> من <em>auth.ts</em>. تبحث تلك الدالة عن المستخدم في قاعدة البيانات باسم المستخدم وتستخدم <em>bcrypt.compare </em>للتحقق من كلمة المرور مقابل التجزئة المخزّنة. وإذا كانت بيانات الاعتماد صحيحة، تُعيد <em>authorize </em>كائن مستخدم يحتوي على <em>id</em> و<em>name</em> و<em>email</em> (حيث نخزّن اسم المستخدم). تأخذ NextAuth ذلك الكائن وتشفّره في JWT موقّع بـ<em>AUTH_SECRET</em>، وتضبطه كملف تعريف ارتباط HTTP-only في الاستجابة. لا يمكن لـJavaScript في المتصفح قراءة ملف تعريف ارتباط HTTP-only، بل يُرسَل تلقائياً مع كل طلب لاحق، ما يحمي الرمز من هجمات XSS. ثم تستخدم صفحة تسجيل الدخول <em>router.push("/")</em> لتوجيه المستخدم إلى الصفحة الرئيسية.

<strong>الجلسة من جهة العميل.</strong> في العرض التالي، يرسل المتصفح ملف تعريف الارتباط مع كل طلب. يقرأ <em>AuthSessionProvider</em> (الذي يلفّ التطبيق كله في التخطيط الجذري) ملف تعريف الارتباط، ويتحقق من JWT، ويجعل بيانات الجلسة متاحة عبر سياق React. وأي مكوّن عميل يستدعي <em>useSession()</em> يستقبل الجلسة من ذلك السياق دون أي طلب شبكة إضافي.

<strong>الجلسة من جهة الخادم.</strong> عندما يحتاج مكوّن خادم أو إجراء خادم إلى معرفة من هو المسجّل، يستدعي <em>auth().</em> تقرأ NextAuth JWT الموقّع من ترويسات الطلب الواردة وتُعيد الجلسة المفكوكة. وتلفّ الدالة المساعدة <em>getCurrentUser</em> هذا الاستدعاء وتجلب إضافةً إلى ذلك سجل المستخدم الكامل من قاعدة البيانات بحيث تحصل بقية شيفرة التطبيق على كائن مستخدم سليم.

<strong>الإجراءات المحمية.</strong> تستدعي إجراءات الخادم التي تتطلب مصادقة الدالة <em>auth()</em> في بدايتها وتوجّه إلى <em>/login</em> إذا كانت الجلسة مفقودة. ولا تُنفَّذ أي كتابة في قاعدة البيانات إلا بعد التأكد من وجود جلسة صالحة.

يوضح مخطط التتابع أدناه عملية تسجيل الدخول وإنشاء ملاحظة محمية لاحقاً:

![صورة توضيحية](/images/mooc/0dd3e58ae8fd.webp)

### تسجيل المستخدمين

الآن وقد أصبحت المصادقة جاهزة، لننفّذ مجرى تسجيل سليماً بحيث يستطيع المستخدمون الجدد إنشاء حساباتهم بأنفسهم بدلاً من إضافتهم يدوياً عبر Drizzle Studio.

نحتاج إلى إجراء خادم يجزّئ كلمة المرور ويُدرج المستخدم الجديد في قاعدة البيانات. لنضفه إلى ملف جديد&nbsp;<em>app/actions/users.ts</em>:

```js
"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../db"
import { users } from "../../db/schema"

export const registerUser = async (formData: FormData) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}
```

يقرأ الإجراء&nbsp;<em>username</em>&nbsp;و&nbsp;<em>name</em>&nbsp;و&nbsp;<em>password</em>&nbsp;من بيانات النموذج، ويجزّئ كلمة المرور بـ<em>bcrypt.hash</em>، ويُدرج المستخدم الجديد، ويوجّه إلى صفحة تسجيل الدخول.

بما أن الإجراء إجراء خادم عادي يوجّه دائماً عند النجاح، يمكن أن تكون صفحة التسجيل مكوّن خادم بسيطاً مع نموذج يشير مباشرة إلى الإجراء:

```js
import Link from "next/link"
import { registerUser } from "../actions/users"

export default function RegisterPage() {
  return (
    &lt;div>
      &lt;h2>Register&lt;/h2>
      &lt;form action={registerUser}>
        &lt;div>
          &lt;label>
            Username
            &lt;input type="text" name="username" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Name
            &lt;input type="text" name="name" required />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            Password
            &lt;input type="password" name="password" required />
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Register&lt;/button>
      &lt;/form>
    &lt;/div>
  )
}
```

أخيراً، أضف رابطاً إلى صفحة التسجيل في&nbsp;<em>NavBar.tsx</em>&nbsp;ليتمكن المستخدمون غير المُصادَقين من العثور عليها:

```js
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav>
      &lt;Link href="/">home&lt;/Link>
      {" | "}
      &lt;Link href="/notes">notes&lt;/Link>
      {" | "}
      &lt;Link href="/users">users&lt;/Link>
      {" | "}
      {session ? (
        &lt;>
          &lt;Link href="/notes/new">create new&lt;/Link>
          {" | "}
          &lt;em>{session.user?.name} logged in&lt;/em>{" "}
          &lt;button onClick={() => signOut()}>logout&lt;/button>
        &lt;/>
      ) : (
        &lt;>
          &lt;Link href="/login">login&lt;/Link>
          {" | "}
          &lt;Link href="/register">register&lt;/Link> // HIGHLIGHT LINE
        &lt;/>
      )}
    &lt;/nav>
  )
}
```

الآن يمكن للمستخدمين الجدد التسجيل عبر النموذج، ولم تعد هناك حاجة لتعيين كلمات المرور يدوياً بنص&nbsp;<em>set-password.ts</em>.

الشيفرة الحالية للتطبيق موجودة في&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part8.

#### الاسم المستعار للمسار ‎@

ربما لاحظت أن الاستيراد بدا هكذا:

```js
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

البادئة <em>@/</em> هي اسم مستعار للمسار يُقابل جذر مشروعك. فبدلاً من كتابة مسار نسبي مثل <em>../../../auth</em>، يمكنك دائماً كتابة <em>@/auth</em> بغض النظر عن عمق تداخل الملف المستورِد. وهذا يجعل الاستيرادات أسهل قراءة وإعادة هيكلة.

الاسم المستعار معرّف في&nbsp;<em>tsconfig.json</em>&nbsp;تحت&nbsp;<em>compilerOptions</em>:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

تتضمن مشاريع Next.js الجديدة المنشأة بـ<em>create-next-app</em>&nbsp;هذا الإعداد افتراضياً. وإذا لم يكن مشروعك يحتويه، فأضف مدخل&nbsp;<em>paths</em>&nbsp;أعلاه وأعد تشغيل خادم لغة TypeScript. ثم يمكنك تنظيف كل سلاسل الاستيراد النسبي في أنحاء الشيفرة.

على سبيل المثال، في الملف&nbsp;<em>app/actions/users.ts</em>&nbsp;بدلاً من:

```js
import { db } from "../../db"
import { users } from "../../db/schema"
```

يمكنك كتابة:

```js
import { db } from "@/db"
import { users } from "@/db/schema"
```

يشير كلاهما إلى الملفات نفسها، لكن نسخ <em>@/</em> لا لبس فيها دائماً ولا تتعطل عند نقل ملف إلى مجلد مختلف.
<div class="tasks">

**11. تسجيل الدخول**

</div>

<div class="tasks">

**12. التسجيل**

</div>

### معالجة الأخطاء

لنضف بعض التحقق من المدخلات إلى نموذج إنشاء الملاحظة. نريد فرض حد أدنى لطول محتوى الملاحظة قدره 10 أحرف.

#### التحقق من جهة العميل

أبسط نهج هو استخدام التحقق المدمج في HTML في المتصفح. إضافة <em>minLength={10}</em> إلى عنصر الإدخال تمنع إرسال النموذج أصلاً إذا كان المحتوى قصيراً جداً:

```js
import { createNote } from "../../actions/notes"

const NewNote = () => {
  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={createNote}>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" required minLength={10} /> // HIGHLIGHT LINE
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
```

هذا سريع ولا يتطلب شيفرة إضافية، لكنه يعمل في المتصفح فقط. إذ يمكن للمستخدم تجاوزه تماماً بإرسال طلب HTTP مباشرة إلى نقطة نهاية إجراء الخادم. لذا ينبغي دائماً دعم التحقق من جهة العميل بتحقق من جهة الخادم أيضاً.

أبسط نهج من جهة الخادم هو فحص المحتوى في إجراء الخادم ورمي خطأ إذا كان غير صالح:

```js
export const createNote = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  // BEGIN HIGHLIGHT
  if (!content || content.length &lt; 10) {
    throw new Error("Note content must be at least 10 characters long")
  }
  // END HIGHLIGHT
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

رمي خطأ من إجراء خادم يجعل Next.js يعرض أقرب&nbsp;<a href="https://nextjs.org/docs/app/getting-started/error-handling">حدود خطأ (error boundary)</a>. هذا مناسب للإخفاقات غير المتوقعة، لكنه بالنسبة إلى أخطاء التحقق الموجّهة للمستخدم تجربة سيئة: إذ يرى المستخدم صفحة خطأ بدلاً من رسالة مفيدة بجانب النموذج.

#### إعادة أخطاء التحقق باستخدام useActionState

نمط أفضل للتحقق من النماذج هو إعادة الخطأ من إجراء الخادم بدلاً من رميه، ثم عرض الرسالة داخل النموذج. ويوفّر React 19 خطاف&nbsp;<a href="https://react.dev/reference/react/useActionState">useActionState</a>&nbsp;لهذا الغرض تحديداً.

يحتاج إجراء الخادم إلى تغيير توقيعه. فبدلاً من استقبال <em>formData</em> فقط، يستقبل الآن أيضاً <em>prevState</em> كوسيطه الأول. هذه هي الحالة السابقة التي أرجعها الإجراء (أو القيمة الأولية في العرض الأول). ولا يستخدم الإجراء prevState فعلياً هنا، بل يحتاج فقط إلى قبوله حتى يطابق التوقيع ما يتوقعه useActionState.

عند فشل التحقق، يُعيد كائن حالة جديداً يحتوي على رسالة خطأ. وعند النجاح، يستدعي <em>redirect</em> كما كان من قبل:

```ts
export const createNote = async (
  prevState: { error: string }, // HIGHLIGHT LINE
  formData: FormData,
) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  if (!content || content.length &lt; 10) {
    return { error: "Note content must be at least 10 characters long" } // HIGHLIGHT LINE
  }
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
```

من جهة النموذج، يصبح المكوّن مكوّن عميل ليتمكن من استخدام خطاف <em>useActionState</em>. يأخذ الخطاف دالة الإجراء وقيمة حالة أولية، ويُعيد الحالة الحالية وإجراءً ملفوفاً لتمريره إلى النموذج:

```js
"use client" // HIGHLIGHT LINE

import { useActionState } from "react"
import { createNote } from "../../actions/notes"

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, { error: "" }) // HIGHLIGHT LINE

  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={formAction}> // HIGHLIGHT LINE
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
        {state.error &amp;&amp; &lt;p style={{ color: "red" }}>{state.error}&lt;/p>} // HIGHLIGHT LINE
      &lt;/form>
    &lt;/div>
  )
}
```

عندما يرسل المستخدم النموذج بمحتوى قصير جداً، يُعيد إجراء الخادم <em>{ error: "..." }</em>. ويخزّن <em>useActionState</em> ذلك بوصفه <em>state</em> الجديد، ويُعاد عرض المكوّن مع إظهار رسالة الخطأ أسفل زر الإرسال. ولا يحدث أي انتقال بين الصفحات. وعندما يكون المحتوى صالحاً، يستدعي الإجراء <em>redirect("/notes")</em> كما كان من قبل ويُوجَّه المستخدم إلى قائمة الملاحظات.

الشيفرة الحالية للتطبيق موجودة في&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part9.

<div class="tasks">

**13. التحققات في إنشاء المدونة**

</div>

###

<div class="tasks">

**14. نموذج إنشاء المدونة عند الخطأ**

</div>

<div class="tasks">

**15. التحققات في تسجيل المستخدم**

</div>

#### مزيد من مكوّنات الواجهة: الإشعار

لنضف نظام إشعارات لتقديم تغذية راجعة للمستخدم بعد إجراءات مثل إنشاء ملاحظة. نريد عرض رسالة قصيرة، مثلاً «تم إنشاء الملاحظة»، تختفي تلقائياً بعد بضع ثوانٍ. هذه حالة استخدام كلاسيكية لـ<a href="https://react.dev/learn/passing-data-deeply-with-context">سياق React</a>، الذي يتيح لنا مشاركة الحالة عبر شجرة المكوّنات دون تمرير props في كل مستوى. إذا لم يكن سياق React مألوفاً لديك، فألقِ نظرة على&nbsp;<a href="/part6/react_query_context_api">الجزء 6</a>&nbsp;من دورة Full Stack Open قبل المتابعة.

ننشئ ملفين:&nbsp;<em>app/components/NotificationContext.tsx</em>&nbsp;يحتوي على تعريف السياق والمزوّد، و<em>app/components/Notification.tsx</em>&nbsp;هو المكوّن الذي يعرض الرسالة المرئية.

يعرّف ملف السياق&nbsp;<em>NotificationContext.tsx</em>&nbsp;شكل حالة الإشعار ويكشف كلاً من غلاف&nbsp;<em>NotificationProvider</em>&nbsp;وخطاف&nbsp;<em>useNotification</em>:

```ts
"use client"

import { createContext, useContext, useState } from "react"

type NotificationType = "success" | "error"

type NotificationContextType = {
  message: string
  type: NotificationType
  showNotification: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext&lt;NotificationContextType>({
  message: "",
  type: "success",
  showNotification: () => {},
})

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [message, setMessage] = useState("")
  const [type, setType] = useState&lt;NotificationType>("success")

  const showNotification = (
    msg: string,
    notifType: NotificationType = "success",
  ) => {
    setMessage(msg)
    setType(notifType)
    setTimeout(() => setMessage(""), 5000)
  }

  return (
    &lt;NotificationContext value={{ message, type, showNotification }}>
      {children}
    &lt;/NotificationContext>
  )
}

export const useNotification = () => useContext(NotificationContext)
```

يحتوي السياق على <em>message</em> و<em>type</em> كحالة. وتضبط دالة <em>showNotification</em> الرسالة وتجدول&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/setTimeout">setTimeout</a>&nbsp;لمسحها بعد 5 ثوانٍ.

> تصف واجهة <em>NotificationContextType</em> شكل قيمة السياق: نص <em>message</em> الحالي، و<em>type</em> الذي يتحكم في لون الشريط، ودالة <em>showNotification</em>. وتمرير هذا النوع كوسيط عام (generic) إلى <em>createContext&lt;NotificationContextType>(...) </em>يخبر TypeScript بدقة ما الشكل الذي يحمله السياق. والوسيط الثاني هو القيمة الافتراضية المستخدمة عندما يستدعي مكوّن useNotification خارج NotificationProvider. ولأننا نلفّ التطبيق كله دائماً في NotificationProvider، فلا تُستخدم هذه القيمة الافتراضية عملياً أبداً، لكن TypeScript يتطلبها، ويجب أن تطابق النوع المعلن.

يقرأ مكوّن <em>Notification</em> من السياق ويعرض الرسالة:

```js
"use client"

import { useNotification } from "./NotificationContext"

export default function Notification() {
  const { message, type } = useNotification()

  if (!message) return null

  const style: React.CSSProperties = {
    padding: "10px 16px",
    marginBottom: "10px",
    borderRadius: "4px",
    color: "white",
    backgroundColor: type === "success" ? "#16a34a" : "#dc2626",
  }

  return &lt;div style={style}>{message}&lt;/div>
}
```

عندما تكون <em>message</em> فارغة يُعيد المكوّن <em>null</em> ولا يعرض شيئاً. وعندما تكون هناك رسالة، يعرض شريطاً ملوّناً: أخضر لـ<em>"success"</em>&nbsp;وأحمر لـ<em>"error"</em>.

لجعل الإشعار متاحاً في التطبيق كله نلفّ التخطيط بـ<em>NotificationProvider</em>&nbsp;ونضع <em>Notification</em> أسفل شريط التنقل مباشرةً، بحيث يظهر في أعلى كل صفحة. ويبدو <em>app/layout.tsx</em>&nbsp;المحدَّث هكذا:

```js
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"
import { NotificationProvider } from "./components/NotificationContext"
import Notification from "./components/Notification"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body>
        &lt;AuthSessionProvider>
          &lt;NotificationProvider>
            &lt;NavBar />
            &lt;Notification />
            {children}
          &lt;/NotificationProvider>
        &lt;/AuthSessionProvider>
      &lt;/body>
    &lt;/html>
  )
}
```

يبقى <em>AuthSessionProvider</em>&nbsp;الغلاف الخارجي الأقصى لأن سياق <em>SessionProvider</em>&nbsp;في NextAuth يجب أن يكون أيضاً مكوّن عميل. ويقع <em>NotificationProvider</em>&nbsp;داخله، فيكون السياقان متاحين لجميع مكوّنات العميل في الشجرة.

#### عرض إشعار بعد إنشاء الملاحظة

يستدعي مجرى إنشاء الملاحظة الحالي <em>redirect("/notes")</em>&nbsp;داخل إجراء الخادم، ما يعني أنه لا يوجد مكان طبيعي لإطلاق إشعار من جهة العميل قبل حدوث الانتقال. نحتاج إلى تغيير النهج قليلاً: فبدلاً من التوجيه داخل الإجراء، نُعيد علامة <em>success</em>&nbsp;وندع مكوّن العميل يتولى الإشعار والتوجيه معاً.

يُعيد إجراء <em>createNote</em>&nbsp;المحدَّث في <em>app/actions/notes.ts</em>&nbsp;كائن حالة بدلاً من التوجيه عند النجاح:

```ts
export const createNote = async (
  prevState: { error: string; success?: boolean },
  formData: FormData,
) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  if (!content || content.length &lt; 10) {
    // BEGIN HIGHLIGHT
    return {
      error: "Note content must be at least 10 characters long",
      success: false,
    }
    // END HIGHLIGHT
  }
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  return { error: "", success: true } // HIGHLIGHT LINE
}
```

عند فشل التحقق يُعيد الإجراء <em>{ error: "...", success: false }</em>. وعند النجاح يستدعي <em>revalidatePath</em>&nbsp;لإبطال قائمة الملاحظات المخزّنة مؤقتاً ويُعيد <em>{ error: "", success: true }</em>. ولم يعد التوجيه موجوداً في الإجراء.

يستخدم مكوّن <em>NewNote</em>&nbsp;الآن <em>useEffect</em>&nbsp;لمراقبة علامة <em>success</em>&nbsp;في حالة النموذج. وعندما تصبح <em>true</em>، يستدعي <em>showNotification</em>&nbsp;ثم ينتقل برمجياً باستخدام <em>router.push</em>:

```js
"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createNote } from "../../actions/notes"
import { useNotification } from "../../components/NotificationContext"

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, {
    error: "",
    success: false,
  })
  const { showNotification } = useNotification()
  const router = useRouter()

// BEGIN HIGHLIGHT
  useEffect(() => {
    if (state.success) {
      showNotification("note created")
      router.push("/notes")
    }
  }, [state, showNotification, router])
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;h2>Create a new note&lt;/h2>
      &lt;form action={formAction}>
        &lt;div>
          &lt;label>
            Content
            &lt;input type="text" name="content" />
          &lt;/label>
        &lt;/div>
        &lt;div>
          &lt;label>
            &lt;input type="checkbox" name="important" />
            Important
          &lt;/label>
        &lt;/div>
        &lt;button type="submit">Create&lt;/button>
        {state.error &amp;&amp; &lt;p style={{ color: "red" }}>{state.error}&lt;/p>}
      &lt;/form>
    &lt;/div>
  )
}

export default NewNote
```

يعمل خطاف&nbsp;<a href="https://react.dev/reference/react/useEffect">useEffect</a>&nbsp;بعد كل عرض تتغير فيه <em>state</em>. وعندما تكون <em>state.success</em>&nbsp;بقيمة <em>true</em>، يُطلق الإشعار والانتقال. ولأن <em>showNotification</em>&nbsp;تخزّن الرسالة في السياق، فسيلتقطها مكوّن <em>Notification</em>&nbsp;المعروض في <em>layout.tsx</em>&nbsp;ويعرض الشريط الأخضر في صفحة <em>/notes</em>&nbsp;بعد التوجيه.

الشيفرة الحالية للتطبيق موجودة في&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part10.

#### أين نضع المكوّنات

أصبح في تطبيقنا الآن مكوّنات موزّعة على عدة مجلدات. ويجدر بنا التوقف لشرح الأعراف التي نتبعها.

مجلد <em>app/components/</em>&nbsp;مخصّص لمكوّنات الواجهة المشتركة المستخدمة في أكثر من مكان في التطبيق، أو التي تنتمي إلى التخطيط العام بدلاً من أي صفحة محدّدة. وتنتمي <em>NavBar</em>&nbsp;و<em>Notification</em>&nbsp;و<em>NotificationContext</em>&nbsp;كلها إلى هنا: فهي تُعرض من التخطيط الجذري وتستهلكها صفحات وإجراءات مختلفة كثيرة.

المكوّنات التي تنتمي إلى صفحة واحدة تعيش بجانب تلك الصفحة في مجلدها الخاص. على سبيل المثال، مكوّن <em>NoteList</em>&nbsp;الذي كان لدينا في فصل&nbsp;<a href="https://file+.vscode-resource.vscode-cdn.net/Users/mluukkai/opetus/2026-fs/osa14/materiaali/plan.md">عرض الملاحظات المهمة فقط، حل مكوّن العميل</a>&nbsp;لا يُعرض إلا في صفحة قائمة الملاحظات، لذا سيُوضع في <em>app/notes/</em>&nbsp;لا في <em>app/components/</em>. وهذا يبقي كل ميزة مكتفية بذاتها: يمكنك النظر إلى مجلد الصفحة ورؤية كل الأجزاء التي بُنيت منها فوراً.

كقاعدة عامة: إذا كان المكوّن يُستورد من أكثر من مسار، فانقله إلى <em>app/components/</em>. وإذا كان يُستخدم في مسار واحد فقط، فأبقِه في مجلد ذلك المسار.

### تنسيق التطبيق بـTailwind CSS

حتى الآن استخدمنا كائنات <em>style</em>&nbsp;المضمّنة في الحالات القليلة التي احتجنا فيها إلى أي تنسيق. أما التطبيق الحقيقي فيحتاج إلى نهج سليم لـCSS. والخيار السائد في منظومة Next.js هو&nbsp;<a href="https://tailwindcss.com/">Tailwind CSS</a>، إطار CSS قائم على الأدوات المساعدة (utility-first).

> <strong>ملاحظة حول مكتبات المكوّنات:</strong>&nbsp;قد تتساءل لماذا لا نستخدم مكتبة مكوّنات مثل&nbsp;<a href="https://mui.com/">Material-UI</a>&nbsp;التي استخدمناها في أجزاء سابقة من الدورة. فرغم أنه يمكن استخدام هذه المكتبات مع Next.js، إلا أنها تتطلب إعدادات إضافية لتعمل بشكل صحيح مع مكوّنات الخادم والموجّه App Router. وتعتمد معظم مكتبات المكوّنات اعتماداً كبيراً على JavaScript في العميل وتحتاج إلى إعداد خاص للعرض من جهة الخادم والترطيب (hydration). ويتوافق نهج Tailwind القائم على الأدوات المساعدة بشكل أفضل مع معمارية Next.js التي تعطي الأولوية للخادم، ويعمل بسلاسة مع مكوّنات الخادم والعميل معاً دون إعداد إضافي.

فكرة Tailwind مختلفة عن أطر CSS التقليدية مثل MaterialUI أو Bootstrap. فبدلاً من توفير مكوّنات جاهزة بتنسيقات ثابتة، يمنحك Tailwind مجموعة كبيرة من أصناف الأدوات المساعدة الصغيرة أحادية الغرض، مثل&nbsp;<a href="https://tailwindcss.com/docs/flex">flex</a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/padding">p-4</a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/text-color">text-gray-800</a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/border-radius">rounded</a>، تركّبها مباشرة في الترميز. فلا يوجد ملف CSS منفصل للصيانة ولا خطر لتسرّب تنسيقات مكوّن إلى آخر.

يمكن لمشاريع Next.js الجديدة المنشأة بـ<em>create-next-app</em>&nbsp;أن تتضمن Tailwind تلقائياً. وإذا كنت تضيفه إلى مشروع موجود، فاتبع&nbsp;<a href="https://tailwindcss.com/docs/guides/nextjs">دليل التثبيت</a>&nbsp;في وثائق Tailwind.

مع وجود Tailwind، يتم التنسيق بإضافة أسماء الأصناف إلى عناصر JSX. ويمكن إعطاء <em>body</em>&nbsp;في <em>app/layout.tsx</em>&nbsp;لون خلفية ولون نص:

```js
import "./globals.css" // HIGHLIGHT LINE
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"
import { NotificationProvider } from "./components/NotificationContext"
import Notification from "./components/Notification"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="en">
      &lt;body className="min-h-screen bg-background text-foreground"> // HIGHLIGHT LINE
        &lt;AuthSessionProvider>
          &lt;NotificationProvider>
            &lt;NavBar />
            &lt;Notification />
            &lt;main>{children}&lt;/main>
          &lt;/NotificationProvider>
        &lt;/AuthSessionProvider>
      &lt;/body>
    &lt;/html>
  )
}
```

تضمن <a href="https://tailwindcss.com/docs/min-height">min-h-screen</a>&nbsp;أن يمتد body ليملأ ارتفاع نافذة العرض بالكامل، بينما يطبّق <a href="https://tailwindcss.com/docs/background-color">bg-background</a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/text-color">text-foreground</a>&nbsp;ألوان الخلفية والنص الافتراضية للسمة كخصائص CSS مخصّصة معرّفة في <em>globals.css</em>. والملف منشأ بواسطة <em>create-next-app</em>&nbsp;ويبدو هكذا:

```js
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

يحمّل سطر <em>@import "tailwindcss"</em>&nbsp;جميع أدوات Tailwind المساعدة. ومتغيرا CSS ‏<em>--background</em>&nbsp;و<em>--foreground</em>&nbsp;معرّفان في <em>:root</em>&nbsp;ويتحولان تلقائياً إلى قيم الوضع الداكن عندما يفضّل نظام تشغيل المستخدم مخطط ألوان داكناً. وتقوم كتلة <em>@theme inline</em>&nbsp;بتعيين هذين المتغيرين في لوحة ألوان Tailwind بحيث تُحلّ أصناف مثل <em>bg-background</em>&nbsp;و<em>text-foreground</em>&nbsp;إلى القيم الصحيحة.

تحصل صفحة قائمة الملاحظات على تخطيط مقيّد وموسّط مع تباعد بين عناصر القائمة:

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
  const notes = await getNotes(showImportant)

  return (
    &lt;div className="max-w-2xl mx-auto p-6">
      &lt;h2 className="text-2xl font-bold mb-4">Notes&lt;/h2>
      &lt;div className="mb-4">
        &lt;Link
          href={showImportant ? "/notes" : "/notes?important=true"}
          className="text-blue-600 hover:underline"
        >
          {showImportant ? "show all" : "show important only"}
        &lt;/Link>
      &lt;/div>
      &lt;ul className="space-y-2">
        {notes.map((note) => (
          &lt;li key={note.id} className="border rounded p-3 hover:bg-gray-50">
            &lt;Link
              href={`/notes/${note.id}`}
              className="text-blue-600 hover:underline"
            >
              {note.content}
            &lt;/Link>
            {note.important &amp;&amp; (
              &lt;strong className="ml-2 text-amber-600">(important)&lt;/strong>
            )}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
export default Notes
```

تقيّد <a href="https://tailwindcss.com/docs/max-width"><em>max-w-2xl</em></a>&nbsp;عرض المحتوى، ويوسّطه <a href="https://tailwindcss.com/docs/margin"><em>mx-auto</em></a>&nbsp;بهوامش أفقية تلقائية، ويضيف <a href="https://tailwindcss.com/docs/padding"><em>p-6</em></a>&nbsp;حشوة داخلية. ويجعل <a href="https://tailwindcss.com/docs/font-size"><em>text-2xl</em></a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/font-weight"><em>font-bold</em></a>&nbsp;العنوان كبيراً وعريضاً، بينما يضيف <a href="https://tailwindcss.com/docs/margin"><em>mb-4</em></a>&nbsp;تباعداً أسفله. ويضيف <a href="https://tailwindcss.com/docs/space"><em>space-y-2</em></a>&nbsp;تباعداً عمودياً بين عناصر القائمة، ويمنح <a href="https://tailwindcss.com/docs/border-width"><em>border</em></a>&nbsp;‏<a href="https://tailwindcss.com/docs/border-radius"><em>rounded</em></a>&nbsp;‏<a href="https://tailwindcss.com/docs/padding"><em>p-3</em></a>&nbsp;‏<a href="https://tailwindcss.com/docs/background-color"><em>hover:bg-gray-50</em></a>&nbsp;كل ملاحظة مظهر بطاقة ناعمة مع إبراز عند مرور المؤشر.

ويصبح شريط التنقل شريطاً أفقياً داكناً بروابط متباعدة:

```sql
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

const NavBar = () => {
  const { data: session } = useSession()

  return (
    &lt;nav className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4">
      &lt;Link href="/" className="hover:text-gray-300">
        home
      &lt;/Link>
      &lt;Link href="/notes" className="hover:text-gray-300">
        notes
      &lt;/Link>
      &lt;Link href="/users" className="hover:text-gray-300">
        users
      &lt;/Link>
      &lt;div className="ml-auto flex items-center gap-4">
        {session ? (
          &lt;>
            &lt;Link href="/notes/new" className="hover:text-gray-300">
              create new
            &lt;/Link>
            &lt;em className="text-gray-300">{session.user?.name} logged in&lt;/em>
            &lt;button
              onClick={() => signOut()}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              logout
            &lt;/button>
          &lt;/>
        ) : (
          &lt;>
            &lt;Link href="/login" className="hover:text-gray-300">
              login
            &lt;/Link>
            &lt;Link href="/register" className="hover:text-gray-300">
              register
            &lt;/Link>
          &lt;/>
        )}
      &lt;/div>
    &lt;/nav>
  )
}

export default NavBar
```

تُقرأ أسماء الأصناف تقريباً كنص عادي: <a href="https://tailwindcss.com/docs/background-color"><em>bg-gray-800</em></a>&nbsp;يضبط خلفية داكنة، و<a href="https://tailwindcss.com/docs/text-color"><em>text-white</em></a>&nbsp;يجعل النص أبيض، و<a href="https://tailwindcss.com/docs/padding"><em>px-6</em></a>&nbsp;و&nbsp;<a href="https://tailwindcss.com/docs/padding"><em>py-3</em></a>&nbsp;يضيفان حشوة أفقية وعمودية، ويضع <a href="https://tailwindcss.com/docs/flex"><em>flex</em></a>&nbsp;‏<a href="https://tailwindcss.com/docs/align-items"><em>items-center</em></a>&nbsp;‏<a href="https://tailwindcss.com/docs/gap"><em>gap-4</em></a>&nbsp;الأبناء في صف مع تباعد، ويدفع <a href="https://tailwindcss.com/docs/margin"><em>ml-auto</em></a>&nbsp;القسم المعتمد على الجلسة إلى الحافة اليمنى. وتحتوي <a href="https://tailwindcss.com/docs">وثائق</a> Tailwind على مرجع قابل للبحث لكل صنف من أصناف الأدوات المساعدة.

قد تلاحظ أن نص <em>className="hover:text-gray-300"</em>&nbsp;نفسه يظهر على كل رابط تنقل. وعندما تتكرر تركيبة أصناف Tailwind مرات كثيرة، فقد تكون فكرة جيدة استخراج مكوّن مساعد صغير.

مكوّن <em>NavLink</em>&nbsp;محفوظ في <em>app/components/NavLink.tsx</em>:

```ts
import Link from "next/link"

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    &lt;Link href={href} className="hover:text-gray-300">
      {children}
    &lt;/Link>
  )
}

export default NavLink
```

مع وجود <em>NavLink</em>، يصبح كل عنصر تنقل في <em>NavBar</em>&nbsp;على شكل <em>&lt;NavLink href="...">label&lt;/NavLink></em>&nbsp;بدلاً من <em>&lt;Link></em>&nbsp;مع <em>className</em>&nbsp;متكرر. ويحتفظ زر تسجيل الخروج المعتمد على الجلسة بتنسيقه المضمّن الخاص لأنه ذو معالجة بصرية مختلفة وغير متكرر في مكان آخر:

```js
"use client"

import { useSession, signOut } from "next-auth/react"
import NavLink from "./NavLink"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    &lt;nav className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4">
      &lt;NavLink href="/">home&lt;/NavLink>
      &lt;NavLink href="/notes">notes&lt;/NavLink>
      &lt;NavLink href="/users">users&lt;/NavLink>
      &lt;div className="ml-auto flex items-center gap-4">
        {session ? (
          &lt;>
            &lt;NavLink href="/notes/new">create new&lt;/NavLink>
            &lt;em className="text-gray-300">{session.user?.name} logged in&lt;/em>
            &lt;button
              onClick={() => signOut()}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              logout
            &lt;/button>
          &lt;/>
        ) : (
          &lt;>
            &lt;NavLink href="/login">login&lt;/NavLink>
            &lt;NavLink href="/register">register&lt;/NavLink>
          &lt;/>
        )}
      &lt;/div>
    &lt;/nav>
  )
}
```

هناك نهج آخر لتحقيق الأمر نفسه وهو استخدام توجيه&nbsp;<a href="https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes">@layer components</a>&nbsp;في ملف CSS لديك. يتيح لك ذلك تعريف أصناف CSS مخصّصة تجمع عدة أدوات مساعدة من Tailwind، دون إنشاء مكوّن React منفصل. وكلا النهجين يعمل جيداً: فاستخراج مكوّن React يُبقي منطق التنسيق في المكان نفسه الذي توجد فيه بنية المكوّن، بينما يُبقي نهج طبقة CSS جميع تعريفات التنسيق معاً في ملف CSS واحد.

الشيفرة الحالية للتطبيق موجودة في&nbsp;<a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a>&nbsp;في الفرع part11.

#### تعلّم Tailwind وتطبيقه

أفضل طريقة للاعتياد على Tailwind هي استخدامه عملياً وإبقاء&nbsp;<a href="https://tailwindcss.com/docs">الوثائق</a>&nbsp;مفتوحة في علامة تبويب في المتصفح. فتحتوي الوثائق على شريط بحث يعثر على أي صنف من أصناف الأدوات المساعدة بالكلمة المفتاحية. اكتب "padding" فتحصل على القائمة الكاملة لأصناف <em>p-</em>&nbsp;و&nbsp;<em>px-</em>&nbsp;و&nbsp;<em>py-</em>&nbsp;و&nbsp;<em>pt-</em>&nbsp;وقيمها. واكتب "flex" فترى كل ما يتعلق بتخطيط flexbox. وبعد وقت قصير تصبح أكثر الأصناف شيوعاً راسخة في الذاكرة.

توجد أيضاً دروس فيديو جيدة على YouTube، مثلاً&nbsp;<a href="https://www.youtube.com/watch?v=6biMWgD6_JY">Master Tailwind in One Hour</a>&nbsp;و&nbsp;<a href="https://www.youtube.com/watch?v=bnfhmr1v028">Tailwind CSS in React Crash Course 2026</a>، وهما مقدّمتان سريعتان لكن شاملتان إلى المفاهيم والأدوات الأساسية في Tailwind.

يُعدّ <a href="https://play.tailwindcss.com/">Tailwind Playground</a>&nbsp;أداة ممتازة لتجربة أصناف Tailwind في المتصفح دون أي إعداد. يمكنك كتابة HTML بأصناف Tailwind ورؤية النتائج فوراً، ما يجعله مثالياً لتجربة تركيبات أو تعلّم كيفية عمل الأدوات المختلفة معاً.

بضع نصائح عملية:
- ابدأ بالتخطيط أولاً. اضبط الهياكل الخارجية باستخدام <em>flex</em>&nbsp;و&nbsp;<em>grid</em>&nbsp;و&nbsp;<em>max-w-</em>&nbsp;وأدوات التباعد قبل الاهتمام بالألوان أو الطباعة.
- استخدم إضافة&nbsp;<a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">Tailwind CSS IntelliSense</a>&nbsp;في VS Code. فهي تكمل أسماء الأصناف تلقائياً، وتُظهر CSS الكامن عند مرور المؤشر، وتبرز الأصناف غير المعروفة.
- عندما تجد نفسك تكرّر المجموعة نفسها من الأصناف على عناصر كثيرة، فهذه إشارة إلى استخراج مكوّن صغير، كما فعلنا مع <em>NavLink</em>.
- يُعدّ <a href="https://nerdcave.com/tailwind-cheat-sheet">Tailwind Cheat Sheet</a>&nbsp;مرجعاً سريعاً مفيداً يجمع كل الأصناف الشائعة في صفحة واحدة.

بمجرد أن تعتاد على Tailwind للتخطيط والتباعد، سترغب على الأرجح في مكوّنات تفاعلية جاهزة مثل النوافذ الحوارية والقوائم المنسدلة ومنتقيات التاريخ. ويتطلب بناؤها من الصفر بـTailwind الخام جهداً كبيراً. وهنا يأتي دور&nbsp;<a href="https://ui.shadcn.com/">shadcn/ui</a>: فهو مجموعة من المكوّنات المصقولة وسهلة الوصول المبنية فوق Tailwind وأساسيات&nbsp;<a href="https://www.radix-ui.com/">Radix UI</a>. وخلافاً لمعظم مكتبات المكوّنات، لا تُوزَّع shadcn/ui كحزمة npm. بل تنسخ المكوّنات فرادى مباشرة إلى مشروعك بأمر CLI، فتعيش الشيفرة في مستودعك ويمكنك تعديلها بحرية. سنلقي نظرة على shadcn/ui بمزيد من التفصيل في القسم التالي.
### التمارين

<div class="tasks">

**16. إشعار منسّق باستخدام السياق**

</div>

<div class="tasks">

**17. مزيد من التنسيق**

</div>

### المزيد عن Drizzle: واجهة استعلامات SQL

استخدمنا في هذه المادة&nbsp;<a href="https://orm.drizzle.team/docs/rqb">واجهة الاستعلامات العلائقية</a>&nbsp;في Drizzle: استدعاءات مثل <em>db.query.notes.findMany()</em>&nbsp;و&nbsp;<em>db.query.users.findFirst({ with: { notes: true } })</em>. هذه الواجهة مريحة لأنها تتولى عمليات الربط (joins) تلقائياً استناداً إلى تعريفات العلاقات في <em>schema.ts</em>&nbsp;وتُعيد كائنات متداخلة ومحدّدة النوع.

توفّر Drizzle أيضاً&nbsp;<a href="https://orm.drizzle.team/docs/select">منشئ استعلامات SQL</a>&nbsp;الأدنى مستوى الذي يقابل صيغة SQL بشكل أكثر مباشرة. ويبدو الاستعلام نفسه الذي يجلب كل الملاحظات المهمة هكذا مع واجهة SQL:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { notes } from "../../db/schema"

const importantNotes = await db
  .select()
  .from(notes)
  .where(eq(notes.important, true))
```

وجلب مستخدم مع ملاحظاته باستخدام ربط صريح:

```js
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users, notes } from "../../db/schema"

const result = await db
  .select()
  .from(users)
  .leftJoin(notes, eq(notes.userId, users.id))
  .where(eq(users.id, 1))
```

يمنحك هذا مصفوفة مسطّحة من الصفوف (صف لكل ملاحظة مربوطة)، ثم تجمّعها بنفسك، بخلاف الواجهة العلائقية التي تمنحك كائناً متداخلاً.

تكون واجهة SQL مفيدة عندما تحتاج إلى تحكم دقيق في شكل الاستعلام، أو تريد استخدام ميزات SQL لا تكشفها الواجهة العلائقية، أو تكتب شيئاً معقداً بما يكفي ليكون الربط الصريح أوضح. أما لعمليات CRUD اليومية، فالواجهة العلائقية أكثر ملاءمة. والواجهتان محدّدتا النوع بالكامل ويمكن مزجهما بحرية في المشروع نفسه.

### مسارات API

حتى الآن جلبنا البيانات وعدّلناها باستخدام مكوّنات الخادم وإجراءات الخادم. ويدعم Next.js أيضاً&nbsp;<a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">مسارات API</a>&nbsp;التقليدية، وتسمى أيضاً معالجات المسارات (Route Handlers)، والتي تتيح لك كشف نقاط نهاية HTTP تُعيد استجابات اعتباطية، عادةً JSON.

استخدمنا بالفعل مسار API واحداً دون أن نوليَه اهتماماً كبيراً: معالج NextAuth الشامل في <em>app/api/auth/[...nextauth]/route.ts</em>. يصدّر ذلك الملف دالة معالج لكل من GET وPOST وتعترض NextAuth تلقائياً كل طلب تحت <em>/api/auth/</em>. تعاملنا معه حينها كصندوق أسود، لكن الملف ليس سوى معالج مسار عادي في Next.js.

#### كيف تعمل معالجات المسارات

معالج المسار هو ملف اسمه <em>route.ts</em>&nbsp;(أو <em>route.js</em>) داخل مجلد <em>app</em>. يصدّر دوال غير متزامنة مسمّاة تقابل طرق HTTP: <em>GET</em>&nbsp;و&nbsp;<em>POST</em>&nbsp;و&nbsp;<em>PUT</em>&nbsp;و&nbsp;<em>PATCH</em>&nbsp;و&nbsp;<em>DELETE</em>&nbsp;وهكذا.

لنضف إلى تطبيقنا نقطة نهاية بسيطة للقراءة فقط تُعيد قائمة الملاحظات بصيغة JSON. ننشئ الملف <em>app/api/notes/route.ts</em>:

```js
import { NextResponse } from "next/server"
import { getNotes } from "../../services/notes"

export const GET = async () => {
  const notes = await getNotes(false)
  return NextResponse.json(notes)
}
```

تؤدي زيارة <em>/api/notes</em>&nbsp;في المتصفح (أو بـ<em>curl</em>) الآن إلى إرجاع مصفوفة الملاحظات بصيغة JSON:

```json
[
  { "id": 1, "content": "next.js utilizes React Server Components", "important": true, "userId": 1 },
  { "id": 2, "content": "next.js is built on top of React", "important": true, "userId": 1 }
]
```

قد تبدو نقطة النهاية التي تتيح إنشاء ملاحظة عبر POST هكذا:

```js
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { addNote } from "../../services/notes"
import { revalidatePath } from "next/cache"

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { content, important = false } = body

  if (!content || content.length &lt; 10) {
    return NextResponse.json(
      { error: "Content must be at least 10 characters" },
      { status: 400 },
    )
  }

  await addNote(content, important)
  revalidatePath("/notes")
  return NextResponse.json({ success: true }, { status: 201 })
}
```

يقرأ معالج <em>POST</em>&nbsp;جسم الطلب بصيغة JSON باستخدام <em>req.json()</em>، ويتحقق من المحتوى، ويستدعي دالة الخدمة <em>addNote</em>&nbsp;نفسها التي يستخدمها إجراء الخادم. ويُفحص التحقق من المصادقة بـ<em>getServerSession</em>، وإذا لم توجد جلسة تُعاد استجابة HTTP 401.

#### متى نستخدم مسارات API مقابل إجراءات الخادم

يتداخل النهجان، لكن القاعدة العامة مباشرة.

استخدم <strong>إجراءات الخادم</strong>&nbsp;عندما يكون المستهلك واجهة Next.js الخاصة بك، مثل إرسال نموذج أو النقر على زر. فإجراءات الخادم مرتبطة بنموذج العرض في React، وتستفيد من التخزين المؤقت المدمج والتكامل مع إعادة التحقق، ولا تتطلب منك كتابة أي استدعاءات fetch في العميل.

استخدم <strong>مسارات API</strong>&nbsp;عندما تحتاج إلى نقطة نهاية HTTP يمكن لشيء خارج تطبيق Next.js استدعاؤها، مثلاً تطبيق جوال أو خطاف ويب (webhook) لخدمة طرف ثالث أو واجهة أمامية منفصلة. تتحدث مسارات API لغة HTTP العادية وتُعيد استجابات JSON قياسية، ما يجعل استهلاكها سهلاً من أي مكان.

في تطبيقنا تغطي إجراءات الخادم كل احتياجات الواجهة. أما مسارات <em>/api/auth/</em>&nbsp;فهي موجودة لأن NextAuth تتطلب نقاط نهاية HTTP قياسية للتعامل مع مجرى المصادقة، الذي يتضمن إعادة توجيهات المتصفح وضبط ملفات تعريف الارتباط وهي أمور لم يُصمَّم نموذج إجراءات الخادم لأجلها. ولهذا احتجنا إلى معالجات المسارات للمصادقة رغم أن بقية التطبيق يستخدم إجراءات الخادم.

### التمارين

<div class="tasks">

**18. صفحتي مع وصول برمز API**

</div>

<div class="tasks">

**19. صفحتي مع وصول برمز API**

</div>

<div class="tasks">

**20. قائمة القراءة**

</div>

<div class="tasks">

**21. قائمة قراءة أفضل**

</div>

### بعض الأمور المعلّقة

#### Suspense والبث

عندما يجلب مكوّن خادم بيانات، تنتظر الصفحة بأكملها البيانات قبل إرسال أي شيء إلى المتصفح. وبالنسبة إلى الاستعلامات البطيئة يعني هذا أن المستخدم يحدّق في شاشة فارغة. وتعالج حدود&nbsp;<a href="https://react.dev/reference/react/Suspense">Suspense</a>&nbsp;في React هذه المشكلة بأن تتيح لك بث أجزاء من الواجهة فور جهوزيتها.

أبسط طريقة لإضافة واجهة تحميل إلى مسار هي إنشاء ملف&nbsp;<a href="https://nextjs.org/docs/app/api-reference/file-conventions/loading">loading.tsx</a>&nbsp;في المجلد نفسه الذي يوجد فيه <em>page.tsx</em>. فيلفّ Next.js الصفحة تلقائياً في حدّ Suspense ويعرض مكوّن التحميل أثناء تجهيز الصفحة:

```js
<em>// app/notes/loading.tsx</em>
const Loading = () =&gt; {
  return &lt;p&gt;Loading notes...&lt;/p&gt;
}

export default Loading

```

الآن عندما ينتقل المستخدم إلى <em>/notes</em>، يرى فوراً "Loading notes..." بينما يجلب مكوّن الخادم البيانات. وبمجرد جهوز البيانات، يبثّ Next.js محتوى الصفحة الفعلي ويستبدل حالة التحميل.

لمزيد من التحكم الدقيق، يمكنك لفّ المكوّنات فرادى يدوياً في حدود <em>&lt;Suspense> </em>. يكون هذا مفيداً عندما تحتوي صفحة على عدة أقسام مستقلة تجلب البيانات، وتريد لكل منها أن يُحمَّل بشكل مستقل بدلاً من انتظار الصفحة بأكملها:

```js
import { Suspense } from "react"
import NoteList from "./NoteList"
import Statistics from "./Statistics"

const Notes = () => {
  return (
    &lt;div>
      &lt;h2>Notes&lt;/h2>
      &lt;Suspense fallback={&lt;p>Loading notes...&lt;/p>}>
        &lt;NoteList />
      &lt;/Suspense>
      &lt;Suspense fallback={&lt;p>Loading statistics...&lt;/p>}>
        &lt;Statistics />
      &lt;/Suspense>
    &lt;/div>
  )
}
```

يمكن أن يكون كل مكوّن ملفوف مكوّن خادم غير متزامن يجلب بياناته بنفسه. ويبثّ Next.js كل بديل (fallback) فوراً ويستبدله بالمحتوى الحقيقي بمجرد انتهاء ذلك المكوّن، فلا تعيق الأقسام البطيئة الأقسام السريعة.

#### تحسين الصور باستخدام next/image

في HTML العادي، كنت ستحمّل صورة بوسم <em>&lt;img></em>:

```
&lt;img src="/profile.jpg" alt="User profile" width="200" height="200" />
```

هذا يعمل، لكن المتصفحات تحمّل الصورة بالحجم الكامل بغض النظر عن حجم شاشة الجهاز، ولا يوجد تحسين تلقائي. ويوفّر Next.js مكوّن&nbsp;<a href="https://nextjs.org/docs/app/api-reference/components/image">Image</a>&nbsp;الذي يحسّن الصور تلقائياً من أجل الأداء:

```js
import Image from "next/image"

const Profile = () => {
  return (
    &lt;div>
      &lt;Image
        src="/profile.jpg"
        alt="User profile"
        width={200}
        height={200}
      />
    &lt;/div>
  )
}

export default Profile
```

يقدّم مكوّن Image عدة فوائد رئيسية:
- <strong>تحسين الصيغة تلقائياً:</strong>&nbsp;يقدّم Next.js صيغاً حديثة مثل WebP وAVIF إلى المتصفحات التي تدعمها، مع الرجوع إلى الصيغة الأصلية للمتصفحات الأقدم.
- <strong>صور متجاوبة:</strong>&nbsp;يولّد المكوّن تلقائياً أحجاماً متعددة للصورة ويقدّم الحجم المناسب وفقاً لجهاز المستخدم.
- <strong>التحميل الكسول:</strong>&nbsp;لا تُحمَّل الصور خارج نافذة العرض حتى يقترب المستخدم من التمرير إليها، ما يقلّل زمن التحميل الأولي للصفحة.
- <strong>يمنع انزياح التخطيط:</strong>&nbsp;بفرض خاصيتي <code>width</code>&nbsp;و<code>height</code>&nbsp;الصريحتين (أو استخدام <code>fill</code>)، يحجز المتصفح المساحة قبل تحميل الصورة، مانعاً القفز المفاجئ للمحتوى.

بالنسبة إلى الصور المخزّنة في مجلد <em>public</em>، يبدأ المسار بـ<em>/</em>:

```
&lt;Image src="/images/logo.png" alt="Logo" width={100} height={50} />
```

بالنسبة إلى الصور الخارجية المستضافة على نطاقات أخرى، تحتاج إلى ضبط النطاقات المسموح بها في <em>next.config.js</em>:

```js
<em>/** @type {import('next').NextConfig} */</em>
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig
```

ثم يمكنك استخدام الرابط الخارجي:

```
&lt;Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
/>
```

إذا كنت لا تعرف أبعاد الصورة مسبقاً (مثلاً الصور التي يرفعها المستخدمون)، فيمكنك استخدام خاصية <em>fill</em>&nbsp;لجعل الصورة تملأ حاويتها الأب:

```
&lt;div style={{ position: 'relative', width: '100%', height: '400px' }}>
  &lt;Image
    src="/dynamic-image.jpg"
    alt="Dynamic content"
    fill
    style={{ objectFit: 'cover' }}
  />
&lt;/div>
```

يجب أن تكون الحاوية الأب بـ<em>position: relative</em>&nbsp;أو <em>position: fixed</em>&nbsp;أو <em>position: absolute</em>&nbsp;حتى تعمل <em>fill</em>&nbsp;بشكل صحيح.

يُعدّ مكوّن Image أحد أهم تحسينات الأداء في Next.js. فاستخدامه بدلاً من وسوم <em>&lt;img></em>&nbsp;العادية يضمن توصيل صورك بكفاءة على جميع الأجهزة وظروف الشبكة.

#### البيانات الوصفية وSEO

يمتلك Next.js&nbsp;<a href="https://nextjs.org/docs/app/getting-started/metadata-and-og-images">واجهة Metadata API</a>&nbsp;مدمجة لضبط عنوان الصفحة ووصفها وغيرها من وسوم <em>&lt;head></em>&nbsp;بطريقة تعمل بشكل صحيح مع مكوّنات الخادم والبث.

أبسط صورة لذلك هي تصدير <em>metadata</em>&nbsp;ثابت في ملف <em>page.tsx</em>&nbsp;أو <em>layout.tsx</em>:

```js
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notes app",
  description: "A simple notes application built with Next.js",
}
```

يدمج Next.js البيانات الوصفية من التخطيط الجذري نزولاً عبر التخطيطات والصفحات المتداخلة، فيمكن لصفحة فرعية تجاوز الحقول التي تحتاجها فقط دون تكرار كل شيء.

بالنسبة إلى الصفحات الديناميكية التي يعتمد عنوانها على البيانات، تصدّر دالة <em>generateMetadata</em>&nbsp;بدلاً من ذلك:

```ts
import type { Metadata } from "next"
import { getNoteById } from "../../services/notes"

export const generateMetadata = async ({
  params,
}: {
  params: Promise&lt;{ id: string }>
}): Promise&lt;Metadata> => {
  const { id } = await params
  const note = await getNoteById(Number(id))
  return {
    title: note ? note.content.slice(0, 50) : "Note not found",
  }
}
```

يعمل هذا على الخادم، ويظهر العنوان الناتج في وسم <em>&lt;title></em>&nbsp;في HTML، وهو أمر مهم لمحركات البحث ولعنوان علامة التبويب في المتصفح. وتتبع وسوم Open Graph الخاصة بالمشاركة الاجتماعية النمط نفسه باستخدام المفتاح <em>openGraph</em>&nbsp;داخل كائن البيانات الوصفية.

### التمارين

<div class="tasks">

**22. صفحة رئيسية ثابتة من markdown**

</div>

```
.markdown h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1.5rem 0 1rem;
}

.markdown h2 {
  font-size: 1.875rem;
  font-weight: bold;
  margin: 2rem 0 0.75rem;
}

.markdown h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
}

.markdown p {
  margin: 1rem 0;
  line-height: 1.7;
}

.markdown a {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown a:hover {
  color: #2563eb;
}

.markdown ul {
  margin: 1rem 0;
  padding-left: 2rem;
  line-height: 1.7;
  list-style-type: disc;
}

.markdown ol {
  margin: 1rem 0;
  padding-left: 2rem;
  line-height: 1.7;
  list-style-type: decimal;
}

.markdown li {
  margin: 0.5rem 0;
}

.markdown hr {
  margin: 2rem 0;
  opacity: 0.2;
}
```

<div class="tasks">

**23. اللمسات الأخيرة**

</div>

<div class="tasks">

**24. الفحص الأخير**

</div>

<div class="tasks">

**25. مستودع GitHub الخاص بك**

</div>
