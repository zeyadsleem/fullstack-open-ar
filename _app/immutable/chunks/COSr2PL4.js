const e=14,o="d",s="d.md",a="المصادقة والمزيد",n="authentication_and_more",t="/images/part-14.svg",p=[{depth:3,id:"تسجيل-الدخول",text:"تسجيل الدخول"},{depth:3,id:"مراجعة-مجرى-المصادقة",text:"مراجعة مجرى المصادقة"},{depth:3,id:"تسجيل-المستخدمين",text:"تسجيل المستخدمين"},{depth:3,id:"معالجة-الأخطاء",text:"معالجة الأخطاء"},{depth:3,id:"تنسيق-التطبيق-بـtailwind-css",text:"تنسيق التطبيق بـTailwind CSS"},{depth:3,id:"التمارين",text:"التمارين"},{depth:3,id:"المزيد-عن-drizzle-واجهة-استعلامات-sql",text:"المزيد عن Drizzle: واجهة استعلامات SQL"},{depth:3,id:"مسارات-api",text:"مسارات API"},{depth:3,id:"التمارين",text:"التمارين"},{depth:3,id:"بعض-الأمور-المعلقة",text:"بعض الأمور المعلّقة"},{depth:3,id:"التمارين",text:"التمارين"}],l=`<h3 id="تسجيل-الدخول">تسجيل الدخول</h3>
<p>لإضافة المصادقة إلى تطبيق Next.js لدينا نستخدم <a href="https://authjs.dev/">NextAuth.js</a>، وهي أشهر مكتبة مصادقة لـNext.js. تتولى NextAuth مجرى المصادقة بأكمله: الجلسات (sessions) وعمليات الاستدعاء (callbacks) وتكاملات المزوّدين. نحتاج أيضاً إلى <a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a> لتجزئة كلمات المرور ومقارنتها بشكل آمن.</p>
<p>نبدأ بتثبيت الحزم المطلوبة:</p>
<pre><code class="language-bash">npm install next-auth@beta bcryptjs &amp;amp;&amp;amp; npm install -D @types/bcryptjs
</code></pre>
<h4 id="تغيير-المخطط">تغيير المخطط</h4>
<p>كما في الأجزاء السابقة من الدورة، نحتاج إلى تخزين كلمة مرور مُجزَّأة لكل مستخدم. يكتسب جدول <em>users</em> عموداً جديداً:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> users = <span class="hljs-title function_">pgTable</span>(<span class="hljs-string">&quot;users&quot;</span>, {
  <span class="hljs-attr">id</span>: <span class="hljs-title function_">serial</span>(<span class="hljs-string">&quot;id&quot;</span>).<span class="hljs-title function_">primaryKey</span>(),
  <span class="hljs-attr">username</span>: <span class="hljs-title function_">text</span>(<span class="hljs-string">&quot;username&quot;</span>).<span class="hljs-title function_">notNull</span>().<span class="hljs-title function_">unique</span>(),
  <span class="hljs-attr">name</span>: <span class="hljs-title function_">text</span>(<span class="hljs-string">&quot;name&quot;</span>).<span class="hljs-title function_">notNull</span>(),
  <span class="hljs-attr">passwordHash</span>: <span class="hljs-title function_">text</span>(<span class="hljs-string">&quot;password_hash&quot;</span>).<span class="hljs-title function_">notNull</span>().<span class="hljs-title function_">default</span>(<span class="hljs-string">&quot;&quot;</span>), <span class="hljs-comment">// HIGHLIGHT LINE</span>
})
</code></pre>
<p>يُسمى العمود <em>passwordHash</em> في TypeScript ويُقابل <em>password_hash</em> في قاعدة البيانات. نخزّن التجزئة فقط، ولا نخزّن كلمة المرور النصية الصريحة أبداً. القيمة الافتراضية المتمثلة في نص فارغ تتيح لنا إضافة العمود إلى جدول يحتوي بالفعل على صفوف دون خرق قيد not-null.</p>
<p>وكالعادة نولّد الترحيل ثم نطبّقه:</p>
<pre><code class="language-bash">npx drizzle-kit generate
npx drizzle-kit migrate
</code></pre>
<h4 id="إعدادات-nextauth">إعدادات NextAuth</h4>
<p>قلب الإعداد هو ملف إعدادات NextAuth <em>auth.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">NextAuth</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Credentials</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/providers/credentials&quot;</span>
<span class="hljs-keyword">import</span> { eq } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;drizzle-orm&quot;</span>
<span class="hljs-keyword">import</span> bcrypt <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;bcryptjs&quot;</span>
<span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../db&quot;</span>
<span class="hljs-keyword">import</span> { users } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../db/schema&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> { handlers, auth, signIn, signOut } = <span class="hljs-title class_">NextAuth</span>({
  <span class="hljs-attr">providers</span>: [
    <span class="hljs-title class_">Credentials</span>({
      <span class="hljs-attr">credentials</span>: {
        <span class="hljs-attr">username</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">&quot;Username&quot;</span>, <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;text&quot;</span> },
        <span class="hljs-attr">password</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">&quot;Password&quot;</span>, <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;password&quot;</span> },
      },
      <span class="hljs-keyword">async</span> <span class="hljs-title function_">authorize</span>(<span class="hljs-params">credentials</span>) {
        <span class="hljs-keyword">if</span> (!credentials?.<span class="hljs-property">username</span> || !credentials?.<span class="hljs-property">password</span>) {
          <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
        }

        <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> db.<span class="hljs-property">query</span>.<span class="hljs-property">users</span>.<span class="hljs-title function_">findFirst</span>({
          <span class="hljs-attr">where</span>: <span class="hljs-title function_">eq</span>(users.<span class="hljs-property">username</span>, credentials.<span class="hljs-property">username</span> <span class="hljs-keyword">as</span> string),
        })

        <span class="hljs-keyword">if</span> (!user || !user.<span class="hljs-property">passwordHash</span>) {
          <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
        }

        <span class="hljs-keyword">const</span> isValid = <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">compare</span>(
          credentials.<span class="hljs-property">password</span> <span class="hljs-keyword">as</span> string,
          user.<span class="hljs-property">passwordHash</span>,
        )

        <span class="hljs-keyword">if</span> (!isValid) {
          <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
        }

        <span class="hljs-keyword">return</span> {
          <span class="hljs-attr">id</span>: <span class="hljs-title class_">String</span>(user.<span class="hljs-property">id</span>),
          <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span>,
          <span class="hljs-attr">email</span>: user.<span class="hljs-property">username</span>,
        }
      },
    }),
  ],
  <span class="hljs-attr">pages</span>: {
    <span class="hljs-attr">signIn</span>: <span class="hljs-string">&quot;/login&quot;</span>,
  },
  <span class="hljs-attr">session</span>: {
    <span class="hljs-attr">strategy</span>: <span class="hljs-string">&quot;jwt&quot;</span>,
  },
})
</code></pre>
<p>تدعم NextAuth العديد من <a href="https://authjs.dev/getting-started/providers">مزوّدي المصادقة</a> المختلفين مثل Google وGitHub وFacebook. هنا نستخدم <a href="https://authjs.dev/getting-started/authentication/credentials">مزوّد بيانات الاعتماد (Credentials provider)</a>، الذي يتيح للمستخدمين تسجيل الدخول باسم مستخدم وكلمة مرور.</p>
<p>تُعدّ دالة <em>authorize</em> جوهر مزوّد بيانات الاعتماد. تستقبل القيم التي كتبها المستخدم في نموذج تسجيل الدخول بوصفها <em>credentials</em>. ثم تبحث عن المستخدم في قاعدة البيانات باسم المستخدم، وتستخدم <a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.compare</a> للتحقق مما إذا كانت كلمة المرور المُرسلة تطابق التجزئة المخزّنة. إذا نجحت المصادقة، تُعيد الدالة كائن مستخدم ستستخدمه NextAuth لبناء الجلسة. وإذا فشلت لأي سبب، تُعيد <em>null</em>، ما يجعل NextAuth يرفض محاولة تسجيل الدخول.</p>
<p>عند نجاح المصادقة، تُعيد <em>authorize</em> كائناً عادياً تشفّره NextAuth في رمز جلسة JWT:</p>
<pre><code>{
  id: String(user.id),
  name: user.name,
  email: user.username,
}
</code></pre>
<p>يحتوي نوع الجلسة المدمج في NextAuth على ثلاثة حقول: <em>id</em> و <em>name</em> و <em>email</em>. ليس لدينا بريد إلكتروني في مخططنا، لذا نعيد استخدام حقل <em>email</em> لتخزين اسم المستخدم بدلاً منه. هذا حلّ التفافي متعمّد: فلا تقدّم NextAuth حقل <em>username</em> مدمجاً، وبدلاً من توسيع نوع الجلسة بتعريفات TypeScript مخصّصة، نعيد استخدام حقل موجود يؤدي الغرض نفسه المتمثل في تحديد هوية المستخدم بشكل فريد. والنتيجة أننا حيثما قرأنا الجلسة لاحقاً على الخادم باستخدام <em>auth()</em>، نستخرج اسم المستخدم من <em>session.user.email</em>.</p>
<p>يخبر خيار <em>pages: { signIn: &quot;/login&quot; }</em> ‏NextAuth باستخدام صفحة تسجيل الدخول الخاصة بنا على <em>/login</em> بدلاً من صفحة تسجيل الدخول المدمجة في NextAuth. وكلما احتاجت NextAuth إلى توجيه مستخدم غير مُصادَق إليه لتسجيل الدخول، أرسلته إلى <em>/login</em>. وبدون هذا الخيار، كانت NextAuth ستوجّهه إلى صفحتها الافتراضية على <em>/api/auth/signin</em>، وهي صالحة للعمل لكنها بلا تنسيق ومنفصلة عن بقية التطبيق.</p>
<p>يخبر خيار <em>session: { strategy: &quot;jwt&quot; }</em> ‏NextAuth بتخزين بيانات الجلسة في <a href="https://jwt.io/">JSON Web Token</a> موقّع داخل ملف تعريف ارتباط (cookie)، بدلاً من مخزن جلسات على الخادم. وهذا يعمل جيداً في البيئات الخادمية بلا خوادم مثل Vercel حيث لا توجد ذاكرة مشتركة بين نسخ الدوال.</p>
<h4 id="ما-هي-الجلسة-في-الحقيقة">ما هي الجلسة في الحقيقة</h4>
<p>بعد تسجيل دخول ناجح، تنشئ NextAuth جلسة وتخزّنها كـJWT موقّع في ملف تعريف ارتباط HTTP-only في المتصفح. ويُرسَل ملف تعريف الارتباط تلقائياً مع كل طلب لاحق. وعلى الخادم، تتحقق NextAuth من التوقيع وتقرأ الرمز لتعرف من هو المستخدم، دون لمس قاعدة البيانات.</p>
<p>يحتوي الرمز على ما أرجعته دالة <em>authorize</em> مهما كان: في حالتنا <em>id</em> و <em>name</em> و <em>email</em> (الذي استخدمناه لتخزين اسم المستخدم). هذه القيم متاحة عبر <em>useSession</em> على العميل وعبر <em>auth()</em> على الخادم. ولأن الرمز موقّع، فلا يمكن العبث به دون أن يكتشف الخادم ذلك.</p>
<h4 id="مسار-api-للمصادقة">مسار API للمصادقة</h4>
<p>تتطلب NextAuth <a href="https://authjs.dev/getting-started/installation#configure-your-next-js-application">مسار API</a> يتولى جميع طلبات المصادقة (تسجيل الدخول، تسجيل الخروج، فحوصات الجلسة). ننشئ الملف <em>app/api/auth/[...nextauth]/route.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { handlers } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;@/auth&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> { <span class="hljs-variable constant_">GET</span>, <span class="hljs-variable constant_">POST</span> } = handlers
</code></pre>
<p>جزء [...nextauth] هو <a href="https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment">مقطع مسار شامل (catch-all route segment)</a> في Next.js يطابق أي مسار تحت <em>/api/auth/</em>، مثل <em>/api/auth/signin</em> و <em>/api/auth/signout</em> و <em>/api/auth/session</em>. تعترض NextAuth كل هذه المسارات وتتولى التعامل معها تلقائياً.</p>
<p>في الوقت الحالي، تعمل NextAuth هنا كصندوق أسود: نسلّمها إعداداتنا فتتولى كل نقاط نهاية المصادقة خلف الكواليس. اسم المجلد <em>[...nextauth]</em> ومفهوم مسارات API في Next.js جديدان علينا. سنعود إلى مسارات API لاحقاً في المادة.</p>
<h4 id="مزود-الجلسة-والتخطيط">مزوّد الجلسة والتخطيط</h4>
<p>تحتاج بعض أجزاء واجهتنا إلى الوصول إلى الجلسة من جهة العميل. وشريط التنقل أوضح مثال على ذلك: إذ يمكنه مثلاً عرض اسم المستخدم المسجّل وزر تسجيل خروج عند وجود جلسة، ورابط تسجيل دخول عند عدم وجودها. يتطلب هذا النوع من العرض الشرطي أن تكون الجلسة متاحة في المتصفح، لا على الخادم فقط.</p>
<p>تشارك الخطافات الخاصة بالعميل في NextAuth مثل <em>useSession</em> بيانات الجلسة عبر سياق React (React context)، وهذا يتطلب وجود مكوّن مزوّد فوق أي مكوّن يستخدمه. وتوفّر NextAuth مزوّدها الخاص <a href="https://authjs.dev/getting-started/session-management/get-session#client-side">SessionProvider</a> لهذا الغرض تحديداً. ولأنه يستخدم سياق React فيجب أن يكون مكوّن عميل، وبما أننا لا نستطيع وضع مكوّن عميل مباشرة في التخطيط الجذري، ننشئ غلافاً رفيعاً <em>app/components/SessionProvider.tsx</em>:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { <span class="hljs-title class_">SessionProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/react&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">AuthSessionProvider</span>(<span class="hljs-params">{
  children,
}: {
  children: React.ReactNode
}</span>) {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">SessionProvider</span>&gt;{children}&amp;lt;/<span class="hljs-title class_">SessionProvider</span>&gt;
}
</code></pre>
<p>ثم نحدّث <em>layout.tsx</em> لنلفّ التطبيق داخل <em>AuthSessionProvider</em>، مما يمنح كل مكوّن عميل في الشجرة وصولاً إلى الجلسة عبر <em>useSession</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">AuthSessionProvider</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/SessionProvider&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NavBar</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/NavBar&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">RootLayout</span>(<span class="hljs-params">{
  children,
}: {
  children: React.ReactNode
}</span>) {
  <span class="hljs-keyword">return</span> (
    &amp;lt;html lang=<span class="hljs-string">&quot;en&quot;</span>&gt;
      &amp;lt;body&gt;
        &amp;lt;<span class="hljs-title class_">AuthSessionProvider</span>&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
          &amp;lt;<span class="hljs-title class_">NavBar</span> /&gt;
          {children}
        &amp;lt;<span class="hljs-regexp">/AuthSessionProvider&gt; /</span>/ <span class="hljs-variable constant_">HIGHLIGHT</span> <span class="hljs-variable constant_">LINE</span>
      &amp;lt;/body&gt;
    &amp;lt;/html&gt;
  )
}
</code></pre>
<h4 id="شريط-التنقل">شريط التنقل</h4>
<p>يحتاج شريط التنقل إلى العرض بشكل مختلف وفقاً لما إذا كان المستخدم مسجّلاً. ولأن زر تسجيل الخروج يستدعي <em>signOut()</em> داخل معالج <em>onClick</em>، فيجب أن يكون المكوّن مكوّن عميل. ويحصل على الجلسة عبر خطاف <a href="https://authjs.dev/getting-started/session-management/get-session#client-side">useSession</a>، الذي يسحب القيمة من سياق React الذي يوفّره <em>SessionProvider</em>. نضع المكوّن في <em>app/components/NavBar.tsx</em>:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">Link</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/link&quot;</span>
<span class="hljs-keyword">import</span> { useSession, signOut } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/react&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">NavBar</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { <span class="hljs-attr">data</span>: session } = <span class="hljs-title function_">useSession</span>()

  <span class="hljs-keyword">return</span> (
    &amp;lt;nav&gt;
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/&quot;</span>&gt;home&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/notes&quot;</span>&gt;notes&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/users&quot;</span>&gt;users&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      {session ? (
        &amp;lt;&gt;
          &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/notes/new&quot;</span>&gt;create <span class="hljs-keyword">new</span>&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
          {<span class="hljs-string">&quot; | &quot;</span>}
          &amp;lt;em&gt;{session.<span class="hljs-property">user</span>?.<span class="hljs-property">name</span>} logged <span class="hljs-keyword">in</span>&amp;lt;/em&gt;{<span class="hljs-string">&quot; &quot;</span>}
          &amp;lt;button onClick={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">signOut</span>()}&gt;logout&amp;lt;/button&gt;
        &amp;lt;/&gt;
      ) : (
        &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/login&quot;</span>&gt;login&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      )}
      <span class="hljs-comment">// END HIGHLIGHT</span>
    &amp;lt;/nav&gt;
  )
}
</code></pre>
<p>عند وجود جلسة، يعرض شريط التنقل اسم المستخدم المسجّل، ورابطاً لإنشاء ملاحظة جديدة، وزر تسجيل خروج يستدعي <a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-out">signOut</a>. وعند عدم وجود جلسة، يعرض رابط تسجيل دخول بدلاً من ذلك.</p>
<h4 id="صفحة-تسجيل-الدخول">صفحة تسجيل الدخول</h4>
<p>تقع صفحة تسجيل الدخول في <em>app/login/page.tsx</em>. وهي مكوّن عميل لأنها تتولى إرسال النموذج وتدير حالة محلية لرسائل الخطأ:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { signIn } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/react&quot;</span>
<span class="hljs-keyword">import</span> { useRouter } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/navigation&quot;</span>
<span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">LoginPage</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> router = <span class="hljs-title function_">useRouter</span>()
  <span class="hljs-keyword">const</span> [error, setError] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&quot;&quot;</span>)

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleSubmit</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">e: React.SubmitEvent&amp;lt;HTMLFormElement&gt;</span>) =&gt; {
    e.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> formData = <span class="hljs-keyword">new</span> <span class="hljs-title class_">FormData</span>(e.<span class="hljs-property">currentTarget</span>)

    <span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> <span class="hljs-title function_">signIn</span>(<span class="hljs-string">&quot;credentials&quot;</span>, {
      <span class="hljs-attr">username</span>: formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;username&quot;</span>),
      <span class="hljs-attr">password</span>: formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;password&quot;</span>),
      <span class="hljs-attr">redirect</span>: <span class="hljs-literal">false</span>,
    })

    <span class="hljs-keyword">if</span> (result?.<span class="hljs-property">error</span>) {
      <span class="hljs-title function_">setError</span>(<span class="hljs-string">&quot;Invalid username or password&quot;</span>)
    } <span class="hljs-keyword">else</span> {
      router.<span class="hljs-title function_">push</span>(<span class="hljs-string">&quot;/&quot;</span>)
      router.<span class="hljs-title function_">refresh</span>()
    }
  }

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Login</span>&amp;lt;/h2&gt;
      {error &amp;amp;&amp;amp; &amp;lt;p style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&quot;red&quot;</span> }}&gt;{error}&amp;lt;/p&gt;}
      &amp;lt;form onSubmit={handleSubmit}&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Username</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;username&quot;</span> required /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Password</span>
            &amp;lt;input type=<span class="hljs-string">&quot;password&quot;</span> name=<span class="hljs-string">&quot;password&quot;</span> required /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;<span class="hljs-title class_">Login</span>&amp;lt;/button&gt;
      &amp;lt;/form&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>يستدعي النموذج <a href="https://authjs.dev/getting-started/session-management/custom-pages#sign-in">signIn</a> من <em>next-auth/react</em> مع <em>redirect: false</em>، ما يعني أن NextAuth ستُعيد النتيجة ككائن بدلاً من إعادة توجيه المتصفح تلقائياً. وإذا فشلت المصادقة، فستُضبط قيمة <em>result.error</em> ونعرض رسالة خطأ. وإذا نجحت، نستخدم موجّه Next.js للانتقال إلى الصفحة الرئيسية ونستدعي <em>router.refresh()</em> لإجبار مكوّنات الخادم في الشجرة على إعادة العرض بالجلسة الجديدة.</p>
<h4 id="قراءة-الجلسة-على-الخادم">قراءة الجلسة على الخادم</h4>
<p>بالنسبة إلى مكوّنات الخادم وإجراءات الخادم لا يمكننا استخدام <em>useSession</em>، لأن الخطافات تعمل في المتصفح فقط. وبدلاً من ذلك توفّر Auth.js دالة <a href="https://authjs.dev/reference/nextjs#auth">auth</a>، التي تقرأ الجلسة من ترويسات الطلب من جهة الخادم. نلفّ هذا في دالة مساعدة <em>app/services/session.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { auth } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;@/auth&quot;</span>
<span class="hljs-keyword">import</span> { eq } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;drizzle-orm&quot;</span>
<span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db&quot;</span>
<span class="hljs-keyword">import</span> { users } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db/schema&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">getCurrentUser</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">auth</span>()
  <span class="hljs-keyword">if</span> (!session?.<span class="hljs-property">user</span>?.<span class="hljs-property">email</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
  }

  <span class="hljs-keyword">return</span> db.<span class="hljs-property">query</span>.<span class="hljs-property">users</span>.<span class="hljs-title function_">findFirst</span>({
    <span class="hljs-attr">where</span>: <span class="hljs-title function_">eq</span>(users.<span class="hljs-property">username</span>, session.<span class="hljs-property">user</span>.<span class="hljs-property">email</span>),
  })
}
</code></pre>
<p>تذكّر أننا في دالة <em>authorize</em> في <em>auth.ts</em> خزّنّا اسم المستخدم في حقل <em>email</em> لكائن المستخدم المُعاد. وتستخرج دالة <em>getCurrentUser</em> تلك القيمة من الجلسة وتجلب سجل المستخدم الكامل من قاعدة البيانات.</p>
<h4 id="حماية-إجراء-إنشاء-الملاحظة">حماية إجراء إنشاء الملاحظة</h4>
<p>الآن وقد أصبحت المصادقة جاهزة، يمكننا حماية إجراء الخادم <em>createNote</em> بحيث لا يتمكن سوى المستخدمين المسجّلين من إنشاء الملاحظات:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">formData: FormData</span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">auth</span>() <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-keyword">if</span> (!session) { <span class="hljs-comment">// HIGHLIGHT LINE</span>
    <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/login&quot;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>
  } <span class="hljs-comment">// HIGHLIGHT LINE</span>

  <span class="hljs-keyword">const</span> content = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">as</span> string
  <span class="hljs-keyword">const</span> important = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;important&quot;</span>) === <span class="hljs-string">&quot;on&quot;</span>
  <span class="hljs-keyword">await</span> <span class="hljs-title function_">addNote</span>(content, important)

  <span class="hljs-title function_">revalidatePath</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
  <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
}
</code></pre>
<p>إذا لم تكن هناك جلسة نشطة، يُوجَّه المستخدم إلى صفحة تسجيل الدخول قبل إنشاء أي ملاحظة.</p>
<p>يمكننا أيضاً استبدال الحلّ الالتفافي العشوائي للمستخدم في <em>addNote</em> باستدعاء سليم لـ <em>getCurrentUser</em>:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> { getCurrentUser } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./session&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"><span class="hljs-attr">content</span>: <span class="hljs-built_in">string</span>, <span class="hljs-attr">important</span>: <span class="hljs-built_in">boolean</span></span>) =&gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getCurrentUser</span>()
  <span class="hljs-keyword">if</span> (!user) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&quot;Not logged in&quot;</span>)
  }

  <span class="hljs-keyword">await</span> db.<span class="hljs-title function_">insert</span>(notes).<span class="hljs-title function_">values</span>({ content, important, <span class="hljs-attr">userId</span>: user.<span class="hljs-property">id</span> })
}
</code></pre>
<h4 id="متغيرات-البيئة">متغيرات البيئة</h4>
<p>تتطلب NextAuth مفتاحاً سرياً لتوقيع رموز جلسة JWT. يمكنك توليد واحد مثلاً كما يلي:</p>
<pre><code>echo &quot;$(openssl rand -base64 32)&quot;
</code></pre>
<p>انسخ الناتج يدوياً إلى <em>.env.local</em>:</p>
<pre><code>DATABASE_URL=postgresql://...
AUTH_SECRET=your-generated-secret-here
</code></pre>
<p>على Vercel، أضف <em>AUTH_SECRET</em> و <em>AUTH_URL</em> تحت <em>Settings &gt; Environment Variables</em>. وقيمة <em>AUTH_URL</em> هي الرابط العام لتطبيقك المنشور، مثلاً <em><a href="https://your-app.vercel.app/">https://your-app.vercel.app</a></em>.</p>
<h4 id="تعيين-كلمات-المرور-للمستخدمين-الحاليين">تعيين كلمات المرور للمستخدمين الحاليين</h4>
<p>بعد إضافة عمود <em>passwordHash</em>، أصبح لدى المستخدمين الحاليين في قاعدة البيانات نص فارغ كتجزئة لكلمة المرور، ما يعني أنهم لا يستطيعون تسجيل الدخول بعد. نحتاج إلى طريقة لتعيين كلمات مرور حقيقية لهم. وبدلاً من القيام بذلك يدوياً عبر Drizzle Studio، يمكننا كتابة نص أداة صغير <em>set-password.ts</em> في جذر المشروع:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> { config } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;dotenv&quot;</span>
<span class="hljs-title function_">config</span>({ <span class="hljs-attr">path</span>: <span class="hljs-string">&quot;.env.local&quot;</span> })
<span class="hljs-keyword">import</span> bcrypt <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;bcryptjs&quot;</span>
<span class="hljs-keyword">import</span> { eq } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;drizzle-orm&quot;</span>

<span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">setPassword</span>(<span class="hljs-params"><span class="hljs-attr">username</span>: <span class="hljs-built_in">string</span>, <span class="hljs-attr">password</span>: <span class="hljs-built_in">string</span></span>) {
  <span class="hljs-keyword">const</span> { db } = <span class="hljs-keyword">await</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&quot;./db&quot;</span>)
  <span class="hljs-keyword">const</span> { users } = <span class="hljs-keyword">await</span> <span class="hljs-keyword">import</span>(<span class="hljs-string">&quot;./db/schema&quot;</span>)
  <span class="hljs-keyword">const</span> hash = <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">hash</span>(password, <span class="hljs-number">10</span>)
  <span class="hljs-keyword">await</span> db
    .<span class="hljs-title function_">update</span>(users)
    .<span class="hljs-title function_">set</span>({ <span class="hljs-attr">passwordHash</span>: hash })
    .<span class="hljs-title function_">where</span>(<span class="hljs-title function_">eq</span>(users.<span class="hljs-property">username</span>, username))
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Password set for user: <span class="hljs-subst">\${username}</span>\`</span>)
}

<span class="hljs-keyword">const</span> username = process.<span class="hljs-property">argv</span>[<span class="hljs-number">2</span>]
<span class="hljs-keyword">const</span> password = process.<span class="hljs-property">argv</span>[<span class="hljs-number">3</span>]

<span class="hljs-keyword">if</span> (!username || !password) {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;Usage: npx tsx set-password.ts &amp;lt;username&gt; &amp;lt;password&gt;&quot;</span>)
  process.<span class="hljs-title function_">exit</span>(<span class="hljs-number">1</span>)
}

<span class="hljs-title function_">setPassword</span>(username, password).<span class="hljs-title function_">then</span>(<span class="hljs-function">() =&gt;</span> process.<span class="hljs-title function_">exit</span>(<span class="hljs-number">0</span>))
</code></pre>
<p>يقرأ النص اسم مستخدم وكلمة مرور نصية صريحة من وسائط سطر الأوامر. ويجزّئ كلمة المرور باستخدام <a href="https://www.npmjs.com/package/bcryptjs#usage">bcrypt.hash</a> بمعامل كلفة قدره 10، ثم يحدّث صف المستخدم المطابق في قاعدة البيانات. يتحكم معامل الكلفة في مقدار الكلفة الحسابية لحساب التجزئة: فالقيم الأعلى أبطأ في الكسر بالقوة الغاشمة لكنها أبطأ أيضاً في التحقق عند تسجيل الدخول. والقيمة 10 هي الافتراضية الموصى بها عادةً.</p>
<p>شغّل النص باستخدام <a href="https://tsx.is/">tsx</a>، الذي ينفّذ ملفات TypeScript مباشرة دون خطوة تجميع منفصلة:</p>
<pre><code class="language-bash">npx tsx set-password.ts mluukkai secretpassword
</code></pre>
<p>هذا النص بطبيعة الحال أداة تطويرية فقط.</p>
<h3 id="مراجعة-مجرى-المصادقة">مراجعة مجرى المصادقة</h3>
<p>توجد عدة أجزاء متحركة في إعداد المصادقة، لذا يجدر بنا التوقف قليلاً وتتبّع كيفية ارتباطها ببعضها.</p>
<p><strong>تسجيل الدخول.</strong> يملأ المستخدم نموذج تسجيل الدخول على <em>/login</em>. ويستدعي معالج <em>onSubmit</em> في النموذج <em>signIn(&quot;credentials&quot;, { redirect: false, ... })، وهي</em> دالة توفّرها NextAuth. وتقوم <em>signIn</em> في NextAuth خلف الكواليس بإرسال طلب <em>POST</em> إلى مسار API الشامل عند <em>/api/auth/callback/credentials</em>. ومعالج المسار معرّف في <em>app/api/auth/[...nextauth]/route.ts</em>، حيث تسجّل <em>handlers</em> المصدَّرة من <em>auth.ts</em> معالجَي GET وPOST لدى Next.js.</p>
<p>عند وصول POST، يتولى منطق NextAuth الداخلي الأمر ويستدعي دالة <em>authorize</em> من <em>auth.ts</em>. تبحث تلك الدالة عن المستخدم في قاعدة البيانات باسم المستخدم وتستخدم <em>bcrypt.compare </em>للتحقق من كلمة المرور مقابل التجزئة المخزّنة. وإذا كانت بيانات الاعتماد صحيحة، تُعيد <em>authorize </em>كائن مستخدم يحتوي على <em>id</em> و<em>name</em> و<em>email</em> (حيث نخزّن اسم المستخدم). تأخذ NextAuth ذلك الكائن وتشفّره في JWT موقّع بـ<em>AUTH_SECRET</em>، وتضبطه كملف تعريف ارتباط HTTP-only في الاستجابة. لا يمكن لـJavaScript في المتصفح قراءة ملف تعريف ارتباط HTTP-only، بل يُرسَل تلقائياً مع كل طلب لاحق، ما يحمي الرمز من هجمات XSS. ثم تستخدم صفحة تسجيل الدخول <em>router.push(&quot;/&quot;)</em> لتوجيه المستخدم إلى الصفحة الرئيسية.</p>
<p><strong>الجلسة من جهة العميل.</strong> في العرض التالي، يرسل المتصفح ملف تعريف الارتباط مع كل طلب. يقرأ <em>AuthSessionProvider</em> (الذي يلفّ التطبيق كله في التخطيط الجذري) ملف تعريف الارتباط، ويتحقق من JWT، ويجعل بيانات الجلسة متاحة عبر سياق React. وأي مكوّن عميل يستدعي <em>useSession()</em> يستقبل الجلسة من ذلك السياق دون أي طلب شبكة إضافي.</p>
<p><strong>الجلسة من جهة الخادم.</strong> عندما يحتاج مكوّن خادم أو إجراء خادم إلى معرفة من هو المسجّل، يستدعي <em>auth().</em> تقرأ NextAuth JWT الموقّع من ترويسات الطلب الواردة وتُعيد الجلسة المفكوكة. وتلفّ الدالة المساعدة <em>getCurrentUser</em> هذا الاستدعاء وتجلب إضافةً إلى ذلك سجل المستخدم الكامل من قاعدة البيانات بحيث تحصل بقية شيفرة التطبيق على كائن مستخدم سليم.</p>
<p><strong>الإجراءات المحمية.</strong> تستدعي إجراءات الخادم التي تتطلب مصادقة الدالة <em>auth()</em> في بدايتها وتوجّه إلى <em>/login</em> إذا كانت الجلسة مفقودة. ولا تُنفَّذ أي كتابة في قاعدة البيانات إلا بعد التأكد من وجود جلسة صالحة.</p>
<p>يوضح مخطط التتابع أدناه عملية تسجيل الدخول وإنشاء ملاحظة محمية لاحقاً:</p>
<p><img src="/images/mooc/0dd3e58ae8fd.webp" alt="صورة توضيحية"></p>
<h3 id="تسجيل-المستخدمين">تسجيل المستخدمين</h3>
<p>الآن وقد أصبحت المصادقة جاهزة، لننفّذ مجرى تسجيل سليماً بحيث يستطيع المستخدمون الجدد إنشاء حساباتهم بأنفسهم بدلاً من إضافتهم يدوياً عبر Drizzle Studio.</p>
<p>نحتاج إلى إجراء خادم يجزّئ كلمة المرور ويُدرج المستخدم الجديد في قاعدة البيانات. لنضفه إلى ملف جديد <em>app/actions/users.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use server&quot;</span>

<span class="hljs-keyword">import</span> { redirect } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/navigation&quot;</span>
<span class="hljs-keyword">import</span> bcrypt <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;bcryptjs&quot;</span>
<span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db&quot;</span>
<span class="hljs-keyword">import</span> { users } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db/schema&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">registerUser</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">formData: FormData</span>) =&gt; {
  <span class="hljs-keyword">const</span> username = (formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;username&quot;</span>) <span class="hljs-keyword">as</span> string)?.<span class="hljs-title function_">trim</span>()
  <span class="hljs-keyword">const</span> name = (formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;name&quot;</span>) <span class="hljs-keyword">as</span> string)?.<span class="hljs-title function_">trim</span>()
  <span class="hljs-keyword">const</span> password = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;password&quot;</span>) <span class="hljs-keyword">as</span> string

  <span class="hljs-keyword">const</span> passwordHash = <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">hash</span>(password, <span class="hljs-number">10</span>)

  <span class="hljs-keyword">await</span> db.<span class="hljs-title function_">insert</span>(users).<span class="hljs-title function_">values</span>({ username, name, passwordHash })

  <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/login&quot;</span>)
}
</code></pre>
<p>يقرأ الإجراء <em>username</em> و <em>name</em> و <em>password</em> من بيانات النموذج، ويجزّئ كلمة المرور بـ<em>bcrypt.hash</em>، ويُدرج المستخدم الجديد، ويوجّه إلى صفحة تسجيل الدخول.</p>
<p>بما أن الإجراء إجراء خادم عادي يوجّه دائماً عند النجاح، يمكن أن تكون صفحة التسجيل مكوّن خادم بسيطاً مع نموذج يشير مباشرة إلى الإجراء:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Link</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/link&quot;</span>
<span class="hljs-keyword">import</span> { registerUser } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../actions/users&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">RegisterPage</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Register</span>&amp;lt;/h2&gt;
      &amp;lt;form action={registerUser}&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Username</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;username&quot;</span> required /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Name</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;name&quot;</span> required /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Password</span>
            &amp;lt;input type=<span class="hljs-string">&quot;password&quot;</span> name=<span class="hljs-string">&quot;password&quot;</span> required /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;<span class="hljs-title class_">Register</span>&amp;lt;/button&gt;
      &amp;lt;/form&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>أخيراً، أضف رابطاً إلى صفحة التسجيل في <em>NavBar.tsx</em> ليتمكن المستخدمون غير المُصادَقين من العثور عليها:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">Link</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/link&quot;</span>
<span class="hljs-keyword">import</span> { useSession, signOut } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/react&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">NavBar</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { <span class="hljs-attr">data</span>: session } = <span class="hljs-title function_">useSession</span>()

  <span class="hljs-keyword">return</span> (
    &amp;lt;nav&gt;
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/&quot;</span>&gt;home&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/notes&quot;</span>&gt;notes&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/users&quot;</span>&gt;users&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      {<span class="hljs-string">&quot; | &quot;</span>}
      {session ? (
        &amp;lt;&gt;
          &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/notes/new&quot;</span>&gt;create <span class="hljs-keyword">new</span>&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
          {<span class="hljs-string">&quot; | &quot;</span>}
          &amp;lt;em&gt;{session.<span class="hljs-property">user</span>?.<span class="hljs-property">name</span>} logged <span class="hljs-keyword">in</span>&amp;lt;/em&gt;{<span class="hljs-string">&quot; &quot;</span>}
          &amp;lt;button onClick={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">signOut</span>()}&gt;logout&amp;lt;/button&gt;
        &amp;lt;/&gt;
      ) : (
        &amp;lt;&gt;
          &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/login&quot;</span>&gt;login&amp;lt;/<span class="hljs-title class_">Link</span>&gt;
          {<span class="hljs-string">&quot; | &quot;</span>}
          &amp;lt;<span class="hljs-title class_">Link</span> href=<span class="hljs-string">&quot;/register&quot;</span>&gt;register&amp;lt;<span class="hljs-regexp">/Link&gt; /</span>/ <span class="hljs-variable constant_">HIGHLIGHT</span> <span class="hljs-variable constant_">LINE</span>
        &amp;lt;/&gt;
      )}
    &amp;lt;/nav&gt;
  )
}
</code></pre>
<p>الآن يمكن للمستخدمين الجدد التسجيل عبر النموذج، ولم تعد هناك حاجة لتعيين كلمات المرور يدوياً بنص <em>set-password.ts</em>.</p>
<p>الشيفرة الحالية للتطبيق موجودة في <a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a> في الفرع part8.</p>
<h4 id="الاسم-المستعار-للمسار">الاسم المستعار للمسار ‎@</h4>
<p>ربما لاحظت أن الاستيراد بدا هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { handlers } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;@/auth&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> { <span class="hljs-variable constant_">GET</span>, <span class="hljs-variable constant_">POST</span> } = handlers
</code></pre>
<p>البادئة <em>@/</em> هي اسم مستعار للمسار يُقابل جذر مشروعك. فبدلاً من كتابة مسار نسبي مثل <em>../../../auth</em>، يمكنك دائماً كتابة <em>@/auth</em> بغض النظر عن عمق تداخل الملف المستورِد. وهذا يجعل الاستيرادات أسهل قراءة وإعادة هيكلة.</p>
<p>الاسم المستعار معرّف في <em>tsconfig.json</em> تحت <em>compilerOptions</em>:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;compilerOptions&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;paths&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;@/*&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-string">&quot;./*&quot;</span><span class="hljs-punctuation">]</span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>تتضمن مشاريع Next.js الجديدة المنشأة بـ<em>create-next-app</em> هذا الإعداد افتراضياً. وإذا لم يكن مشروعك يحتويه، فأضف مدخل <em>paths</em> أعلاه وأعد تشغيل خادم لغة TypeScript. ثم يمكنك تنظيف كل سلاسل الاستيراد النسبي في أنحاء الشيفرة.</p>
<p>على سبيل المثال، في الملف <em>app/actions/users.ts</em> بدلاً من:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db&quot;</span>
<span class="hljs-keyword">import</span> { users } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db/schema&quot;</span>
</code></pre>
<p>يمكنك كتابة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;@/db&quot;</span>
<span class="hljs-keyword">import</span> { users } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;@/db/schema&quot;</span>
</code></pre>
<p>يشير كلاهما إلى الملفات نفسها، لكن نسخ <em>@/</em> لا لبس فيها دائماً ولا تتعطل عند نقل ملف إلى مجلد مختلف.</p>
<div class="tasks">
<p><strong>11. تسجيل الدخول</strong></p>
</div>
<div class="tasks">
<p><strong>12. التسجيل</strong></p>
</div>
<h3 id="معالجة-الأخطاء">معالجة الأخطاء</h3>
<p>لنضف بعض التحقق من المدخلات إلى نموذج إنشاء الملاحظة. نريد فرض حد أدنى لطول محتوى الملاحظة قدره 10 أحرف.</p>
<h4 id="التحقق-من-جهة-العميل">التحقق من جهة العميل</h4>
<p>أبسط نهج هو استخدام التحقق المدمج في HTML في المتصفح. إضافة <em>minLength={10}</em> إلى عنصر الإدخال تمنع إرسال النموذج أصلاً إذا كان المحتوى قصيراً جداً:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { createNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../actions/notes&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NewNote</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Create</span> a <span class="hljs-keyword">new</span> note&amp;lt;/h2&gt;
      &amp;lt;form action={createNote}&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Content</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;content&quot;</span> required minLength={<span class="hljs-number">10</span>} /&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            &amp;lt;input type=<span class="hljs-string">&quot;checkbox&quot;</span> name=<span class="hljs-string">&quot;important&quot;</span> /&gt;
            <span class="hljs-title class_">Important</span>
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;<span class="hljs-title class_">Create</span>&amp;lt;/button&gt;
      &amp;lt;/form&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>هذا سريع ولا يتطلب شيفرة إضافية، لكنه يعمل في المتصفح فقط. إذ يمكن للمستخدم تجاوزه تماماً بإرسال طلب HTTP مباشرة إلى نقطة نهاية إجراء الخادم. لذا ينبغي دائماً دعم التحقق من جهة العميل بتحقق من جهة الخادم أيضاً.</p>
<p>أبسط نهج من جهة الخادم هو فحص المحتوى في إجراء الخادم ورمي خطأ إذا كان غير صالح:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">formData: FormData</span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getServerSession</span>(authOptions)
  <span class="hljs-keyword">if</span> (!session) {
    <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/login&quot;</span>)
  }

  <span class="hljs-keyword">const</span> content = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">as</span> string
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">if</span> (!content || content.<span class="hljs-property">length</span> &amp;lt; <span class="hljs-number">10</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&quot;Note content must be at least 10 characters long&quot;</span>)
  }
  <span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> important = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;important&quot;</span>) === <span class="hljs-string">&quot;on&quot;</span>
  <span class="hljs-keyword">await</span> <span class="hljs-title function_">addNote</span>(content, important)

  <span class="hljs-title function_">revalidatePath</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
  <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
}
</code></pre>
<p>رمي خطأ من إجراء خادم يجعل Next.js يعرض أقرب <a href="https://nextjs.org/docs/app/getting-started/error-handling">حدود خطأ (error boundary)</a>. هذا مناسب للإخفاقات غير المتوقعة، لكنه بالنسبة إلى أخطاء التحقق الموجّهة للمستخدم تجربة سيئة: إذ يرى المستخدم صفحة خطأ بدلاً من رسالة مفيدة بجانب النموذج.</p>
<h4 id="إعادة-أخطاء-التحقق-باستخدام-useactionstate">إعادة أخطاء التحقق باستخدام useActionState</h4>
<p>نمط أفضل للتحقق من النماذج هو إعادة الخطأ من إجراء الخادم بدلاً من رميه، ثم عرض الرسالة داخل النموذج. ويوفّر React 19 خطاف <a href="https://react.dev/reference/react/useActionState">useActionState</a> لهذا الغرض تحديداً.</p>
<p>يحتاج إجراء الخادم إلى تغيير توقيعه. فبدلاً من استقبال <em>formData</em> فقط، يستقبل الآن أيضاً <em>prevState</em> كوسيطه الأول. هذه هي الحالة السابقة التي أرجعها الإجراء (أو القيمة الأولية في العرض الأول). ولا يستخدم الإجراء prevState فعلياً هنا، بل يحتاج فقط إلى قبوله حتى يطابق التوقيع ما يتوقعه useActionState.</p>
<p>عند فشل التحقق، يُعيد كائن حالة جديداً يحتوي على رسالة خطأ. وعند النجاح، يستدعي <em>redirect</em> كما كان من قبل:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">
  <span class="hljs-attr">prevState</span>: { error: <span class="hljs-built_in">string</span> }, <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-attr">formData</span>: <span class="hljs-title class_">FormData</span>,
</span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getServerSession</span>(authOptions)
  <span class="hljs-keyword">if</span> (!session) {
    <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/login&quot;</span>)
  }

  <span class="hljs-keyword">const</span> content = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">as</span> <span class="hljs-built_in">string</span>
  <span class="hljs-keyword">if</span> (!content || content.<span class="hljs-property">length</span> &amp;lt; <span class="hljs-number">10</span>) {
    <span class="hljs-keyword">return</span> { <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;Note content must be at least 10 characters long&quot;</span> } <span class="hljs-comment">// HIGHLIGHT LINE</span>
  }
  <span class="hljs-keyword">const</span> important = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;important&quot;</span>) === <span class="hljs-string">&quot;on&quot;</span>
  <span class="hljs-keyword">await</span> <span class="hljs-title function_">addNote</span>(content, important)

  <span class="hljs-title function_">revalidatePath</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
  <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
}
</code></pre>
<p>من جهة النموذج، يصبح المكوّن مكوّن عميل ليتمكن من استخدام خطاف <em>useActionState</em>. يأخذ الخطاف دالة الإجراء وقيمة حالة أولية، ويُعيد الحالة الحالية وإجراءً ملفوفاً لتمريره إلى النموذج:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">import</span> { useActionState } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react&quot;</span>
<span class="hljs-keyword">import</span> { createNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../actions/notes&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NewNote</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [state, formAction] = <span class="hljs-title function_">useActionState</span>(createNote, { <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;&quot;</span> }) <span class="hljs-comment">// HIGHLIGHT LINE</span>

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Create</span> a <span class="hljs-keyword">new</span> note&amp;lt;/h2&gt;
      &amp;lt;form action={formAction}&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Content</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;content&quot;</span> /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            &amp;lt;input type=<span class="hljs-string">&quot;checkbox&quot;</span> name=<span class="hljs-string">&quot;important&quot;</span> /&gt;
            <span class="hljs-title class_">Important</span>
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;<span class="hljs-title class_">Create</span>&amp;lt;/button&gt;
        {state.<span class="hljs-property">error</span> &amp;amp;&amp;amp; &amp;lt;p style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&quot;red&quot;</span> }}&gt;{state.<span class="hljs-property">error</span>}&amp;lt;<span class="hljs-regexp">/p&gt;} /</span>/ <span class="hljs-variable constant_">HIGHLIGHT</span> <span class="hljs-variable constant_">LINE</span>
      &amp;lt;/form&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>عندما يرسل المستخدم النموذج بمحتوى قصير جداً، يُعيد إجراء الخادم <em>{ error: &quot;...&quot; }</em>. ويخزّن <em>useActionState</em> ذلك بوصفه <em>state</em> الجديد، ويُعاد عرض المكوّن مع إظهار رسالة الخطأ أسفل زر الإرسال. ولا يحدث أي انتقال بين الصفحات. وعندما يكون المحتوى صالحاً، يستدعي الإجراء <em>redirect(&quot;/notes&quot;)</em> كما كان من قبل ويُوجَّه المستخدم إلى قائمة الملاحظات.</p>
<p>الشيفرة الحالية للتطبيق موجودة في <a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a> في الفرع part9.</p>
<div class="tasks">
<p><strong>13. التحققات في إنشاء المدونة</strong></p>
</div>
<h3></h3>
<div class="tasks">
<p><strong>14. نموذج إنشاء المدونة عند الخطأ</strong></p>
</div>
<div class="tasks">
<p><strong>15. التحققات في تسجيل المستخدم</strong></p>
</div>
<h4 id="مزيد-من-مكونات-الواجهة-الإشعار">مزيد من مكوّنات الواجهة: الإشعار</h4>
<p>لنضف نظام إشعارات لتقديم تغذية راجعة للمستخدم بعد إجراءات مثل إنشاء ملاحظة. نريد عرض رسالة قصيرة، مثلاً «تم إنشاء الملاحظة»، تختفي تلقائياً بعد بضع ثوانٍ. هذه حالة استخدام كلاسيكية لـ<a href="https://react.dev/learn/passing-data-deeply-with-context">سياق React</a>، الذي يتيح لنا مشاركة الحالة عبر شجرة المكوّنات دون تمرير props في كل مستوى. إذا لم يكن سياق React مألوفاً لديك، فألقِ نظرة على <a href="/part6/react_query_context_api">الجزء 6</a> من دورة Full Stack Open قبل المتابعة.</p>
<p>ننشئ ملفين: <em>app/components/NotificationContext.tsx</em> يحتوي على تعريف السياق والمزوّد، و<em>app/components/Notification.tsx</em> هو المكوّن الذي يعرض الرسالة المرئية.</p>
<p>يعرّف ملف السياق <em>NotificationContext.tsx</em> شكل حالة الإشعار ويكشف كلاً من غلاف <em>NotificationProvider</em> وخطاف <em>useNotification</em>:</p>
<pre><code class="language-ts"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { createContext, useContext, useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react&quot;</span>

<span class="hljs-keyword">type</span> <span class="hljs-title class_">NotificationType</span> = <span class="hljs-string">&quot;success&quot;</span> | <span class="hljs-string">&quot;error&quot;</span>

<span class="hljs-keyword">type</span> <span class="hljs-title class_">NotificationContextType</span> = {
  <span class="hljs-attr">message</span>: <span class="hljs-built_in">string</span>
  <span class="hljs-attr">type</span>: <span class="hljs-title class_">NotificationType</span>
  <span class="hljs-attr">showNotification</span>: <span class="hljs-function">(<span class="hljs-params"><span class="hljs-attr">message</span>: <span class="hljs-built_in">string</span>, <span class="hljs-attr">type</span>?: <span class="hljs-title class_">NotificationType</span></span>) =&gt;</span> <span class="hljs-built_in">void</span>
}

<span class="hljs-keyword">const</span> <span class="hljs-title class_">NotificationContext</span> = createContext&amp;lt;<span class="hljs-title class_">NotificationContextType</span>&gt;({
  <span class="hljs-attr">message</span>: <span class="hljs-string">&quot;&quot;</span>,
  <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;success&quot;</span>,
  <span class="hljs-attr">showNotification</span>: <span class="hljs-function">() =&gt;</span> {},
})

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">NotificationProvider</span> = (<span class="hljs-params">{
  children,
}: {
  children: React.ReactNode
}</span>) =&gt; {
  <span class="hljs-keyword">const</span> [message, setMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&quot;&quot;</span>)
  <span class="hljs-keyword">const</span> [<span class="hljs-keyword">type</span>, setType] = useState&amp;lt;<span class="hljs-title class_">NotificationType</span>&gt;(<span class="hljs-string">&quot;success&quot;</span>)

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">showNotification</span> = (<span class="hljs-params">
    <span class="hljs-attr">msg</span>: <span class="hljs-built_in">string</span>,
    <span class="hljs-attr">notifType</span>: <span class="hljs-title class_">NotificationType</span> = <span class="hljs-string">&quot;success&quot;</span>,
  </span>) =&gt; {
    <span class="hljs-title function_">setMessage</span>(msg)
    <span class="hljs-title function_">setType</span>(notifType)
    <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">setMessage</span>(<span class="hljs-string">&quot;&quot;</span>), <span class="hljs-number">5000</span>)
  }

  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">NotificationContext</span> value={{ message, <span class="hljs-keyword">type</span>, showNotification }}&gt;
      {children}
    &amp;lt;/<span class="hljs-title class_">NotificationContext</span>&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">useNotification</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">NotificationContext</span>)
</code></pre>
<p>يحتوي السياق على <em>message</em> و<em>type</em> كحالة. وتضبط دالة <em>showNotification</em> الرسالة وتجدول <a href="https://developer.mozilla.org/en-US/docs/Web/API/setTimeout">setTimeout</a> لمسحها بعد 5 ثوانٍ.</p>
<blockquote>
<p>تصف واجهة <em>NotificationContextType</em> شكل قيمة السياق: نص <em>message</em> الحالي، و<em>type</em> الذي يتحكم في لون الشريط، ودالة <em>showNotification</em>. وتمرير هذا النوع كوسيط عام (generic) إلى <em>createContext&lt;NotificationContextType&gt;(...) </em>يخبر TypeScript بدقة ما الشكل الذي يحمله السياق. والوسيط الثاني هو القيمة الافتراضية المستخدمة عندما يستدعي مكوّن useNotification خارج NotificationProvider. ولأننا نلفّ التطبيق كله دائماً في NotificationProvider، فلا تُستخدم هذه القيمة الافتراضية عملياً أبداً، لكن TypeScript يتطلبها، ويجب أن تطابق النوع المعلن.</p>
</blockquote>
<p>يقرأ مكوّن <em>Notification</em> من السياق ويعرض الرسالة:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { useNotification } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./NotificationContext&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">Notification</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { message, type } = <span class="hljs-title function_">useNotification</span>()

  <span class="hljs-keyword">if</span> (!message) <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>

  <span class="hljs-keyword">const</span> <span class="hljs-attr">style</span>: <span class="hljs-title class_">React</span>.<span class="hljs-property">CSSProperties</span> = {
    <span class="hljs-attr">padding</span>: <span class="hljs-string">&quot;10px 16px&quot;</span>,
    <span class="hljs-attr">marginBottom</span>: <span class="hljs-string">&quot;10px&quot;</span>,
    <span class="hljs-attr">borderRadius</span>: <span class="hljs-string">&quot;4px&quot;</span>,
    <span class="hljs-attr">color</span>: <span class="hljs-string">&quot;white&quot;</span>,
    <span class="hljs-attr">backgroundColor</span>: type === <span class="hljs-string">&quot;success&quot;</span> ? <span class="hljs-string">&quot;#16a34a&quot;</span> : <span class="hljs-string">&quot;#dc2626&quot;</span>,
  }

  <span class="hljs-keyword">return</span> &amp;lt;div style={style}&gt;{message}&amp;lt;/div&gt;
}
</code></pre>
<p>عندما تكون <em>message</em> فارغة يُعيد المكوّن <em>null</em> ولا يعرض شيئاً. وعندما تكون هناك رسالة، يعرض شريطاً ملوّناً: أخضر لـ<em>&quot;success&quot;</em> وأحمر لـ<em>&quot;error&quot;</em>.</p>
<p>لجعل الإشعار متاحاً في التطبيق كله نلفّ التخطيط بـ<em>NotificationProvider</em> ونضع <em>Notification</em> أسفل شريط التنقل مباشرةً، بحيث يظهر في أعلى كل صفحة. ويبدو <em>app/layout.tsx</em> المحدَّث هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">AuthSessionProvider</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/SessionProvider&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NavBar</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/NavBar&quot;</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">NotificationProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/NotificationContext&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Notification</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/Notification&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">RootLayout</span>(<span class="hljs-params">{
  children,
}: {
  children: React.ReactNode
}</span>) {
  <span class="hljs-keyword">return</span> (
    &amp;lt;html lang=<span class="hljs-string">&quot;en&quot;</span>&gt;
      &amp;lt;body&gt;
        &amp;lt;<span class="hljs-title class_">AuthSessionProvider</span>&gt;
          &amp;lt;<span class="hljs-title class_">NotificationProvider</span>&gt;
            &amp;lt;<span class="hljs-title class_">NavBar</span> /&gt;
            &amp;lt;<span class="hljs-title class_">Notification</span> /&gt;
            {children}
          &amp;lt;/<span class="hljs-title class_">NotificationProvider</span>&gt;
        &amp;lt;/<span class="hljs-title class_">AuthSessionProvider</span>&gt;
      &amp;lt;/body&gt;
    &amp;lt;/html&gt;
  )
}
</code></pre>
<p>يبقى <em>AuthSessionProvider</em> الغلاف الخارجي الأقصى لأن سياق <em>SessionProvider</em> في NextAuth يجب أن يكون أيضاً مكوّن عميل. ويقع <em>NotificationProvider</em> داخله، فيكون السياقان متاحين لجميع مكوّنات العميل في الشجرة.</p>
<h4 id="عرض-إشعار-بعد-إنشاء-الملاحظة">عرض إشعار بعد إنشاء الملاحظة</h4>
<p>يستدعي مجرى إنشاء الملاحظة الحالي <em>redirect(&quot;/notes&quot;)</em> داخل إجراء الخادم، ما يعني أنه لا يوجد مكان طبيعي لإطلاق إشعار من جهة العميل قبل حدوث الانتقال. نحتاج إلى تغيير النهج قليلاً: فبدلاً من التوجيه داخل الإجراء، نُعيد علامة <em>success</em> وندع مكوّن العميل يتولى الإشعار والتوجيه معاً.</p>
<p>يُعيد إجراء <em>createNote</em> المحدَّث في <em>app/actions/notes.ts</em> كائن حالة بدلاً من التوجيه عند النجاح:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">
  <span class="hljs-attr">prevState</span>: { error: <span class="hljs-built_in">string</span>; success?: <span class="hljs-built_in">boolean</span> },
  <span class="hljs-attr">formData</span>: <span class="hljs-title class_">FormData</span>,
</span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getServerSession</span>(authOptions)
  <span class="hljs-keyword">if</span> (!session) {
    <span class="hljs-title function_">redirect</span>(<span class="hljs-string">&quot;/login&quot;</span>)
  }

  <span class="hljs-keyword">const</span> content = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">as</span> <span class="hljs-built_in">string</span>
  <span class="hljs-keyword">if</span> (!content || content.<span class="hljs-property">length</span> &amp;lt; <span class="hljs-number">10</span>) {
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-keyword">return</span> {
      <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;Note content must be at least 10 characters long&quot;</span>,
      <span class="hljs-attr">success</span>: <span class="hljs-literal">false</span>,
    }
    <span class="hljs-comment">// END HIGHLIGHT</span>
  }
  <span class="hljs-keyword">const</span> important = formData.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;important&quot;</span>) === <span class="hljs-string">&quot;on&quot;</span>
  <span class="hljs-keyword">await</span> <span class="hljs-title function_">addNote</span>(content, important)

  <span class="hljs-title function_">revalidatePath</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
  <span class="hljs-keyword">return</span> { <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;&quot;</span>, <span class="hljs-attr">success</span>: <span class="hljs-literal">true</span> } <span class="hljs-comment">// HIGHLIGHT LINE</span>
}
</code></pre>
<p>عند فشل التحقق يُعيد الإجراء <em>{ error: &quot;...&quot;, success: false }</em>. وعند النجاح يستدعي <em>revalidatePath</em> لإبطال قائمة الملاحظات المخزّنة مؤقتاً ويُعيد <em>{ error: &quot;&quot;, success: true }</em>. ولم يعد التوجيه موجوداً في الإجراء.</p>
<p>يستخدم مكوّن <em>NewNote</em> الآن <em>useEffect</em> لمراقبة علامة <em>success</em> في حالة النموذج. وعندما تصبح <em>true</em>، يستدعي <em>showNotification</em> ثم ينتقل برمجياً باستخدام <em>router.push</em>:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { useActionState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react&quot;</span>
<span class="hljs-keyword">import</span> { useRouter } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/navigation&quot;</span>
<span class="hljs-keyword">import</span> { createNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../actions/notes&quot;</span>
<span class="hljs-keyword">import</span> { useNotification } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../components/NotificationContext&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NewNote</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [state, formAction] = <span class="hljs-title function_">useActionState</span>(createNote, {
    <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;&quot;</span>,
    <span class="hljs-attr">success</span>: <span class="hljs-literal">false</span>,
  })
  <span class="hljs-keyword">const</span> { showNotification } = <span class="hljs-title function_">useNotification</span>()
  <span class="hljs-keyword">const</span> router = <span class="hljs-title function_">useRouter</span>()

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-keyword">if</span> (state.<span class="hljs-property">success</span>) {
      <span class="hljs-title function_">showNotification</span>(<span class="hljs-string">&quot;note created&quot;</span>)
      router.<span class="hljs-title function_">push</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
    }
  }, [state, showNotification, router])
<span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Create</span> a <span class="hljs-keyword">new</span> note&amp;lt;/h2&gt;
      &amp;lt;form action={formAction}&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            <span class="hljs-title class_">Content</span>
            &amp;lt;input type=<span class="hljs-string">&quot;text&quot;</span> name=<span class="hljs-string">&quot;content&quot;</span> /&gt;
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;div&gt;
          &amp;lt;label&gt;
            &amp;lt;input type=<span class="hljs-string">&quot;checkbox&quot;</span> name=<span class="hljs-string">&quot;important&quot;</span> /&gt;
            <span class="hljs-title class_">Important</span>
          &amp;lt;/label&gt;
        &amp;lt;/div&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;<span class="hljs-title class_">Create</span>&amp;lt;/button&gt;
        {state.<span class="hljs-property">error</span> &amp;amp;&amp;amp; &amp;lt;p style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&quot;red&quot;</span> }}&gt;{state.<span class="hljs-property">error</span>}&amp;lt;/p&gt;}
      &amp;lt;/form&gt;
    &amp;lt;/div&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NewNote</span>
</code></pre>
<p>يعمل خطاف <a href="https://react.dev/reference/react/useEffect">useEffect</a> بعد كل عرض تتغير فيه <em>state</em>. وعندما تكون <em>state.success</em> بقيمة <em>true</em>، يُطلق الإشعار والانتقال. ولأن <em>showNotification</em> تخزّن الرسالة في السياق، فسيلتقطها مكوّن <em>Notification</em> المعروض في <em>layout.tsx</em> ويعرض الشريط الأخضر في صفحة <em>/notes</em> بعد التوجيه.</p>
<p>الشيفرة الحالية للتطبيق موجودة في <a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a> في الفرع part10.</p>
<h4 id="أين-نضع-المكونات">أين نضع المكوّنات</h4>
<p>أصبح في تطبيقنا الآن مكوّنات موزّعة على عدة مجلدات. ويجدر بنا التوقف لشرح الأعراف التي نتبعها.</p>
<p>مجلد <em>app/components/</em> مخصّص لمكوّنات الواجهة المشتركة المستخدمة في أكثر من مكان في التطبيق، أو التي تنتمي إلى التخطيط العام بدلاً من أي صفحة محدّدة. وتنتمي <em>NavBar</em> و<em>Notification</em> و<em>NotificationContext</em> كلها إلى هنا: فهي تُعرض من التخطيط الجذري وتستهلكها صفحات وإجراءات مختلفة كثيرة.</p>
<p>المكوّنات التي تنتمي إلى صفحة واحدة تعيش بجانب تلك الصفحة في مجلدها الخاص. على سبيل المثال، مكوّن <em>NoteList</em> الذي كان لدينا في فصل <a href="https://file+.vscode-resource.vscode-cdn.net/Users/mluukkai/opetus/2026-fs/osa14/materiaali/plan.md">عرض الملاحظات المهمة فقط، حل مكوّن العميل</a> لا يُعرض إلا في صفحة قائمة الملاحظات، لذا سيُوضع في <em>app/notes/</em> لا في <em>app/components/</em>. وهذا يبقي كل ميزة مكتفية بذاتها: يمكنك النظر إلى مجلد الصفحة ورؤية كل الأجزاء التي بُنيت منها فوراً.</p>
<p>كقاعدة عامة: إذا كان المكوّن يُستورد من أكثر من مسار، فانقله إلى <em>app/components/</em>. وإذا كان يُستخدم في مسار واحد فقط، فأبقِه في مجلد ذلك المسار.</p>
<h3 id="تنسيق-التطبيق-بـtailwind-css">تنسيق التطبيق بـTailwind CSS</h3>
<p>حتى الآن استخدمنا كائنات <em>style</em> المضمّنة في الحالات القليلة التي احتجنا فيها إلى أي تنسيق. أما التطبيق الحقيقي فيحتاج إلى نهج سليم لـCSS. والخيار السائد في منظومة Next.js هو <a href="https://tailwindcss.com/">Tailwind CSS</a>، إطار CSS قائم على الأدوات المساعدة (utility-first).</p>
<blockquote>
<p><strong>ملاحظة حول مكتبات المكوّنات:</strong> قد تتساءل لماذا لا نستخدم مكتبة مكوّنات مثل <a href="https://mui.com/">Material-UI</a> التي استخدمناها في أجزاء سابقة من الدورة. فرغم أنه يمكن استخدام هذه المكتبات مع Next.js، إلا أنها تتطلب إعدادات إضافية لتعمل بشكل صحيح مع مكوّنات الخادم والموجّه App Router. وتعتمد معظم مكتبات المكوّنات اعتماداً كبيراً على JavaScript في العميل وتحتاج إلى إعداد خاص للعرض من جهة الخادم والترطيب (hydration). ويتوافق نهج Tailwind القائم على الأدوات المساعدة بشكل أفضل مع معمارية Next.js التي تعطي الأولوية للخادم، ويعمل بسلاسة مع مكوّنات الخادم والعميل معاً دون إعداد إضافي.</p>
</blockquote>
<p>فكرة Tailwind مختلفة عن أطر CSS التقليدية مثل MaterialUI أو Bootstrap. فبدلاً من توفير مكوّنات جاهزة بتنسيقات ثابتة، يمنحك Tailwind مجموعة كبيرة من أصناف الأدوات المساعدة الصغيرة أحادية الغرض، مثل <a href="https://tailwindcss.com/docs/flex">flex</a> و <a href="https://tailwindcss.com/docs/padding">p-4</a> و <a href="https://tailwindcss.com/docs/text-color">text-gray-800</a> و <a href="https://tailwindcss.com/docs/border-radius">rounded</a>، تركّبها مباشرة في الترميز. فلا يوجد ملف CSS منفصل للصيانة ولا خطر لتسرّب تنسيقات مكوّن إلى آخر.</p>
<p>يمكن لمشاريع Next.js الجديدة المنشأة بـ<em>create-next-app</em> أن تتضمن Tailwind تلقائياً. وإذا كنت تضيفه إلى مشروع موجود، فاتبع <a href="https://tailwindcss.com/docs/guides/nextjs">دليل التثبيت</a> في وثائق Tailwind.</p>
<p>مع وجود Tailwind، يتم التنسيق بإضافة أسماء الأصناف إلى عناصر JSX. ويمكن إعطاء <em>body</em> في <em>app/layout.tsx</em> لون خلفية ولون نص:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-string">&quot;./globals.css&quot;</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">AuthSessionProvider</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/SessionProvider&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NavBar</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/NavBar&quot;</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">NotificationProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/NotificationContext&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Notification</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./components/Notification&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">RootLayout</span>(<span class="hljs-params">{
  children,
}: {
  children: React.ReactNode
}</span>) {
  <span class="hljs-keyword">return</span> (
    &amp;lt;html lang=<span class="hljs-string">&quot;en&quot;</span>&gt;
      &amp;lt;body className=<span class="hljs-string">&quot;min-h-screen bg-background text-foreground&quot;</span>&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
        &amp;lt;<span class="hljs-title class_">AuthSessionProvider</span>&gt;
          &amp;lt;<span class="hljs-title class_">NotificationProvider</span>&gt;
            &amp;lt;<span class="hljs-title class_">NavBar</span> /&gt;
            &amp;lt;<span class="hljs-title class_">Notification</span> /&gt;
            &amp;lt;main&gt;{children}&amp;lt;/main&gt;
          &amp;lt;/<span class="hljs-title class_">NotificationProvider</span>&gt;
        &amp;lt;/<span class="hljs-title class_">AuthSessionProvider</span>&gt;
      &amp;lt;/body&gt;
    &amp;lt;/html&gt;
  )
}
</code></pre>
<p>تضمن <a href="https://tailwindcss.com/docs/min-height">min-h-screen</a> أن يمتد body ليملأ ارتفاع نافذة العرض بالكامل، بينما يطبّق <a href="https://tailwindcss.com/docs/background-color">bg-background</a> و <a href="https://tailwindcss.com/docs/text-color">text-foreground</a> ألوان الخلفية والنص الافتراضية للسمة كخصائص CSS مخصّصة معرّفة في <em>globals.css</em>. والملف منشأ بواسطة <em>create-next-app</em> ويبدو هكذا:</p>
<pre><code class="language-js">@<span class="hljs-keyword">import</span> <span class="hljs-string">&quot;tailwindcss&quot;</span>;

:root {
  --<span class="hljs-attr">background</span>: #ffffff;
  --<span class="hljs-attr">foreground</span>: #<span class="hljs-number">171717</span>;
}

@theme inline {
  --color-<span class="hljs-attr">background</span>: <span class="hljs-title function_">var</span>(--background);
  --color-<span class="hljs-attr">foreground</span>: <span class="hljs-title function_">var</span>(--foreground);
  --font-<span class="hljs-attr">sans</span>: <span class="hljs-title function_">var</span>(--font-geist-sans);
  --font-<span class="hljs-attr">mono</span>: <span class="hljs-title function_">var</span>(--font-geist-mono);
}

@<span class="hljs-title function_">media</span> (prefers-color-<span class="hljs-attr">scheme</span>: dark) {
  :root {
    --<span class="hljs-attr">background</span>: #0a0a0a;
    --<span class="hljs-attr">foreground</span>: #ededed;
  }
}

body {
  <span class="hljs-attr">background</span>: <span class="hljs-title function_">var</span>(--background);
  <span class="hljs-attr">color</span>: <span class="hljs-title function_">var</span>(--foreground);
  font-<span class="hljs-attr">family</span>: <span class="hljs-title class_">Arial</span>, <span class="hljs-title class_">Helvetica</span>, sans-serif;
}
</code></pre>
<p>يحمّل سطر <em>@import &quot;tailwindcss&quot;</em> جميع أدوات Tailwind المساعدة. ومتغيرا CSS ‏<em>--background</em> و<em>--foreground</em> معرّفان في <em>:root</em> ويتحولان تلقائياً إلى قيم الوضع الداكن عندما يفضّل نظام تشغيل المستخدم مخطط ألوان داكناً. وتقوم كتلة <em>@theme inline</em> بتعيين هذين المتغيرين في لوحة ألوان Tailwind بحيث تُحلّ أصناف مثل <em>bg-background</em> و<em>text-foreground</em> إلى القيم الصحيحة.</p>
<p>تحصل صفحة قائمة الملاحظات على تخطيط مقيّد وموسّط مع تباعد بين عناصر القائمة:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Link</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/link&quot;</span>
<span class="hljs-keyword">import</span> { getNotes } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../services/notes&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Notes</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">{
  searchParams,
}: {
  searchParams: <span class="hljs-built_in">Promise</span>&amp;lt;{ important?: <span class="hljs-built_in">string</span> }&gt;
}</span>) =&gt; {
  <span class="hljs-keyword">const</span> { important } = <span class="hljs-keyword">await</span> searchParams
  <span class="hljs-keyword">const</span> showImportant = important === <span class="hljs-string">&quot;true&quot;</span>
  <span class="hljs-keyword">const</span> notes = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getNotes</span>(showImportant)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div className=<span class="hljs-string">&quot;max-w-2xl mx-auto p-6&quot;</span>&gt;
      &amp;lt;h2 className=<span class="hljs-string">&quot;text-2xl font-bold mb-4&quot;</span>&gt;<span class="hljs-title class_">Notes</span>&amp;lt;/h2&gt;
      &amp;lt;div className=<span class="hljs-string">&quot;mb-4&quot;</span>&gt;
        &amp;lt;<span class="hljs-title class_">Link</span>
          href={showImportant ? <span class="hljs-string">&quot;/notes&quot;</span> : <span class="hljs-string">&quot;/notes?important=true&quot;</span>}
          className=<span class="hljs-string">&quot;text-blue-600 hover:underline&quot;</span>
        &gt;
          {showImportant ? <span class="hljs-string">&quot;show all&quot;</span> : <span class="hljs-string">&quot;show important only&quot;</span>}
        &amp;lt;/<span class="hljs-title class_">Link</span>&gt;
      &amp;lt;/div&gt;
      &amp;lt;ul className=<span class="hljs-string">&quot;space-y-2&quot;</span>&gt;
        {notes.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">note</span>) =&gt;</span> (
          &amp;lt;li key={note.<span class="hljs-property">id</span>} className=<span class="hljs-string">&quot;border rounded p-3 hover:bg-gray-50&quot;</span>&gt;
            &amp;lt;<span class="hljs-title class_">Link</span>
              href={<span class="hljs-string">\`/notes/<span class="hljs-subst">\${note.id}</span>\`</span>}
              className=<span class="hljs-string">&quot;text-blue-600 hover:underline&quot;</span>
            &gt;
              {note.<span class="hljs-property">content</span>}
            &amp;lt;/<span class="hljs-title class_">Link</span>&gt;
            {note.<span class="hljs-property">important</span> &amp;amp;&amp;amp; (
              &amp;lt;strong className=<span class="hljs-string">&quot;ml-2 text-amber-600&quot;</span>&gt;(important)&amp;lt;/strong&gt;
            )}
          &amp;lt;/li&gt;
        ))}
      &amp;lt;/ul&gt;
    &amp;lt;/div&gt;
  )
}
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Notes</span>
</code></pre>
<p>تقيّد <a href="https://tailwindcss.com/docs/max-width"><em>max-w-2xl</em></a> عرض المحتوى، ويوسّطه <a href="https://tailwindcss.com/docs/margin"><em>mx-auto</em></a> بهوامش أفقية تلقائية، ويضيف <a href="https://tailwindcss.com/docs/padding"><em>p-6</em></a> حشوة داخلية. ويجعل <a href="https://tailwindcss.com/docs/font-size"><em>text-2xl</em></a> و <a href="https://tailwindcss.com/docs/font-weight"><em>font-bold</em></a> العنوان كبيراً وعريضاً، بينما يضيف <a href="https://tailwindcss.com/docs/margin"><em>mb-4</em></a> تباعداً أسفله. ويضيف <a href="https://tailwindcss.com/docs/space"><em>space-y-2</em></a> تباعداً عمودياً بين عناصر القائمة، ويمنح <a href="https://tailwindcss.com/docs/border-width"><em>border</em></a> ‏<a href="https://tailwindcss.com/docs/border-radius"><em>rounded</em></a> ‏<a href="https://tailwindcss.com/docs/padding"><em>p-3</em></a> ‏<a href="https://tailwindcss.com/docs/background-color"><em>hover:bg-gray-50</em></a> كل ملاحظة مظهر بطاقة ناعمة مع إبراز عند مرور المؤشر.</p>
<p>ويصبح شريط التنقل شريطاً أفقياً داكناً بروابط متباعدة:</p>
<pre><code class="language-sql">&quot;use client&quot;

import Link <span class="hljs-keyword">from</span> &quot;next/link&quot;
import { useSession, signOut } <span class="hljs-keyword">from</span> &quot;next-auth/react&quot;

const NavBar <span class="hljs-operator">=</span> () <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> {
  const { data: session } <span class="hljs-operator">=</span> useSession()

  <span class="hljs-keyword">return</span> (
    <span class="hljs-operator">&amp;</span>lt;nav className<span class="hljs-operator">=</span>&quot;bg-gray-800 text-white px-6 py-3 flex items-center gap-4&quot;<span class="hljs-operator">&gt;</span>
      <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
        home
      <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
      <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/notes&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
        notes
      <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
      <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/users&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
        users
      <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
      <span class="hljs-operator">&amp;</span>lt;div className<span class="hljs-operator">=</span>&quot;ml-auto flex items-center gap-4&quot;<span class="hljs-operator">&gt;</span>
        {session ? (
          <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">&gt;</span>
            <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/notes/new&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
              <span class="hljs-keyword">create</span> <span class="hljs-keyword">new</span>
            <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
            <span class="hljs-operator">&amp;</span>lt;em className<span class="hljs-operator">=</span>&quot;text-gray-300&quot;<span class="hljs-operator">&gt;</span>{session.user?.name} logged <span class="hljs-keyword">in</span><span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>em<span class="hljs-operator">&gt;</span>
            <span class="hljs-operator">&amp;</span>lt;button
              onClick<span class="hljs-operator">=</span>{() <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> signOut()}
              className<span class="hljs-operator">=</span>&quot;bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm&quot;
            <span class="hljs-operator">&gt;</span>
              logout
            <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>button<span class="hljs-operator">&gt;</span>
          <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span><span class="hljs-operator">&gt;</span>
        ) : (
          <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">&gt;</span>
            <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/login&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
              login
            <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
            <span class="hljs-operator">&amp;</span>lt;Link href<span class="hljs-operator">=</span>&quot;/register&quot; className<span class="hljs-operator">=</span>&quot;hover:text-gray-300&quot;<span class="hljs-operator">&gt;</span>
              register
            <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>Link<span class="hljs-operator">&gt;</span>
          <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span><span class="hljs-operator">&gt;</span>
        )}
      <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>div<span class="hljs-operator">&gt;</span>
    <span class="hljs-operator">&amp;</span>lt;<span class="hljs-operator">/</span>nav<span class="hljs-operator">&gt;</span>
  )
}

export <span class="hljs-keyword">default</span> NavBar
</code></pre>
<p>تُقرأ أسماء الأصناف تقريباً كنص عادي: <a href="https://tailwindcss.com/docs/background-color"><em>bg-gray-800</em></a> يضبط خلفية داكنة، و<a href="https://tailwindcss.com/docs/text-color"><em>text-white</em></a> يجعل النص أبيض، و<a href="https://tailwindcss.com/docs/padding"><em>px-6</em></a> و <a href="https://tailwindcss.com/docs/padding"><em>py-3</em></a> يضيفان حشوة أفقية وعمودية، ويضع <a href="https://tailwindcss.com/docs/flex"><em>flex</em></a> ‏<a href="https://tailwindcss.com/docs/align-items"><em>items-center</em></a> ‏<a href="https://tailwindcss.com/docs/gap"><em>gap-4</em></a> الأبناء في صف مع تباعد، ويدفع <a href="https://tailwindcss.com/docs/margin"><em>ml-auto</em></a> القسم المعتمد على الجلسة إلى الحافة اليمنى. وتحتوي <a href="https://tailwindcss.com/docs">وثائق</a> Tailwind على مرجع قابل للبحث لكل صنف من أصناف الأدوات المساعدة.</p>
<p>قد تلاحظ أن نص <em>className=&quot;hover:text-gray-300&quot;</em> نفسه يظهر على كل رابط تنقل. وعندما تتكرر تركيبة أصناف Tailwind مرات كثيرة، فقد تكون فكرة جيدة استخراج مكوّن مساعد صغير.</p>
<p>مكوّن <em>NavLink</em> محفوظ في <em>app/components/NavLink.tsx</em>:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Link</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/link&quot;</span>

<span class="hljs-keyword">interface</span> <span class="hljs-title class_">NavLinkProps</span> {
  <span class="hljs-attr">href</span>: <span class="hljs-built_in">string</span>
  <span class="hljs-attr">children</span>: <span class="hljs-title class_">React</span>.<span class="hljs-property">ReactNode</span>
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NavLink</span> = (<span class="hljs-params">{ href, children }: <span class="hljs-title class_">NavLinkProps</span></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">Link</span> href={href} className=<span class="hljs-string">&quot;hover:text-gray-300&quot;</span>&gt;
      {children}
    &amp;lt;/<span class="hljs-title class_">Link</span>&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NavLink</span>
</code></pre>
<p>مع وجود <em>NavLink</em>، يصبح كل عنصر تنقل في <em>NavBar</em> على شكل <em>&lt;NavLink href=&quot;...&quot;&gt;label&lt;/NavLink&gt;</em> بدلاً من <em>&lt;Link&gt;</em> مع <em>className</em> متكرر. ويحتفظ زر تسجيل الخروج المعتمد على الجلسة بتنسيقه المضمّن الخاص لأنه ذو معالجة بصرية مختلفة وغير متكرر في مكان آخر:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;use client&quot;</span>

<span class="hljs-keyword">import</span> { useSession, signOut } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth/react&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NavLink</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./NavLink&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">NavBar</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> { <span class="hljs-attr">data</span>: session } = <span class="hljs-title function_">useSession</span>()

  <span class="hljs-keyword">return</span> (
    &amp;lt;nav className=<span class="hljs-string">&quot;bg-gray-800 text-white px-6 py-3 flex items-center gap-4&quot;</span>&gt;
      &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/&quot;</span>&gt;home&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
      &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/notes&quot;</span>&gt;notes&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
      &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/users&quot;</span>&gt;users&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
      &amp;lt;div className=<span class="hljs-string">&quot;ml-auto flex items-center gap-4&quot;</span>&gt;
        {session ? (
          &amp;lt;&gt;
            &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/notes/new&quot;</span>&gt;create <span class="hljs-keyword">new</span>&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
            &amp;lt;em className=<span class="hljs-string">&quot;text-gray-300&quot;</span>&gt;{session.<span class="hljs-property">user</span>?.<span class="hljs-property">name</span>} logged <span class="hljs-keyword">in</span>&amp;lt;/em&gt;
            &amp;lt;button
              onClick={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">signOut</span>()}
              className=<span class="hljs-string">&quot;bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm&quot;</span>
            &gt;
              logout
            &amp;lt;/button&gt;
          &amp;lt;/&gt;
        ) : (
          &amp;lt;&gt;
            &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/login&quot;</span>&gt;login&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
            &amp;lt;<span class="hljs-title class_">NavLink</span> href=<span class="hljs-string">&quot;/register&quot;</span>&gt;register&amp;lt;/<span class="hljs-title class_">NavLink</span>&gt;
          &amp;lt;/&gt;
        )}
      &amp;lt;/div&gt;
    &amp;lt;/nav&gt;
  )
}
</code></pre>
<p>هناك نهج آخر لتحقيق الأمر نفسه وهو استخدام توجيه <a href="https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes">@layer components</a> في ملف CSS لديك. يتيح لك ذلك تعريف أصناف CSS مخصّصة تجمع عدة أدوات مساعدة من Tailwind، دون إنشاء مكوّن React منفصل. وكلا النهجين يعمل جيداً: فاستخراج مكوّن React يُبقي منطق التنسيق في المكان نفسه الذي توجد فيه بنية المكوّن، بينما يُبقي نهج طبقة CSS جميع تعريفات التنسيق معاً في ملف CSS واحد.</p>
<p>الشيفرة الحالية للتطبيق موجودة في <a href="https://github.com/fullstack-hy2020/nextjs-notes">GitHub</a> في الفرع part11.</p>
<h4 id="تعلم-tailwind-وتطبيقه">تعلّم Tailwind وتطبيقه</h4>
<p>أفضل طريقة للاعتياد على Tailwind هي استخدامه عملياً وإبقاء <a href="https://tailwindcss.com/docs">الوثائق</a> مفتوحة في علامة تبويب في المتصفح. فتحتوي الوثائق على شريط بحث يعثر على أي صنف من أصناف الأدوات المساعدة بالكلمة المفتاحية. اكتب &quot;padding&quot; فتحصل على القائمة الكاملة لأصناف <em>p-</em> و <em>px-</em> و <em>py-</em> و <em>pt-</em> وقيمها. واكتب &quot;flex&quot; فترى كل ما يتعلق بتخطيط flexbox. وبعد وقت قصير تصبح أكثر الأصناف شيوعاً راسخة في الذاكرة.</p>
<p>توجد أيضاً دروس فيديو جيدة على YouTube، مثلاً <a href="https://www.youtube.com/watch?v=6biMWgD6_JY">Master Tailwind in One Hour</a> و <a href="https://www.youtube.com/watch?v=bnfhmr1v028">Tailwind CSS in React Crash Course 2026</a>، وهما مقدّمتان سريعتان لكن شاملتان إلى المفاهيم والأدوات الأساسية في Tailwind.</p>
<p>يُعدّ <a href="https://play.tailwindcss.com/">Tailwind Playground</a> أداة ممتازة لتجربة أصناف Tailwind في المتصفح دون أي إعداد. يمكنك كتابة HTML بأصناف Tailwind ورؤية النتائج فوراً، ما يجعله مثالياً لتجربة تركيبات أو تعلّم كيفية عمل الأدوات المختلفة معاً.</p>
<p>بضع نصائح عملية:</p>
<ul>
<li>ابدأ بالتخطيط أولاً. اضبط الهياكل الخارجية باستخدام <em>flex</em> و <em>grid</em> و <em>max-w-</em> وأدوات التباعد قبل الاهتمام بالألوان أو الطباعة.</li>
<li>استخدم إضافة <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">Tailwind CSS IntelliSense</a> في VS Code. فهي تكمل أسماء الأصناف تلقائياً، وتُظهر CSS الكامن عند مرور المؤشر، وتبرز الأصناف غير المعروفة.</li>
<li>عندما تجد نفسك تكرّر المجموعة نفسها من الأصناف على عناصر كثيرة، فهذه إشارة إلى استخراج مكوّن صغير، كما فعلنا مع <em>NavLink</em>.</li>
<li>يُعدّ <a href="https://nerdcave.com/tailwind-cheat-sheet">Tailwind Cheat Sheet</a> مرجعاً سريعاً مفيداً يجمع كل الأصناف الشائعة في صفحة واحدة.</li>
</ul>
<p>بمجرد أن تعتاد على Tailwind للتخطيط والتباعد، سترغب على الأرجح في مكوّنات تفاعلية جاهزة مثل النوافذ الحوارية والقوائم المنسدلة ومنتقيات التاريخ. ويتطلب بناؤها من الصفر بـTailwind الخام جهداً كبيراً. وهنا يأتي دور <a href="https://ui.shadcn.com/">shadcn/ui</a>: فهو مجموعة من المكوّنات المصقولة وسهلة الوصول المبنية فوق Tailwind وأساسيات <a href="https://www.radix-ui.com/">Radix UI</a>. وخلافاً لمعظم مكتبات المكوّنات، لا تُوزَّع shadcn/ui كحزمة npm. بل تنسخ المكوّنات فرادى مباشرة إلى مشروعك بأمر CLI، فتعيش الشيفرة في مستودعك ويمكنك تعديلها بحرية. سنلقي نظرة على shadcn/ui بمزيد من التفصيل في القسم التالي.</p>
<h3 id="التمارين">التمارين</h3>
<div class="tasks">
<p><strong>16. إشعار منسّق باستخدام السياق</strong></p>
</div>
<div class="tasks">
<p><strong>17. مزيد من التنسيق</strong></p>
</div>
<h3 id="المزيد-عن-drizzle-واجهة-استعلامات-sql">المزيد عن Drizzle: واجهة استعلامات SQL</h3>
<p>استخدمنا في هذه المادة <a href="https://orm.drizzle.team/docs/rqb">واجهة الاستعلامات العلائقية</a> في Drizzle: استدعاءات مثل <em>db.query.notes.findMany()</em> و <em>db.query.users.findFirst({ with: { notes: true } })</em>. هذه الواجهة مريحة لأنها تتولى عمليات الربط (joins) تلقائياً استناداً إلى تعريفات العلاقات في <em>schema.ts</em> وتُعيد كائنات متداخلة ومحدّدة النوع.</p>
<p>توفّر Drizzle أيضاً <a href="https://orm.drizzle.team/docs/select">منشئ استعلامات SQL</a> الأدنى مستوى الذي يقابل صيغة SQL بشكل أكثر مباشرة. ويبدو الاستعلام نفسه الذي يجلب كل الملاحظات المهمة هكذا مع واجهة SQL:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { eq } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;drizzle-orm&quot;</span>
<span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db&quot;</span>
<span class="hljs-keyword">import</span> { notes } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db/schema&quot;</span>

<span class="hljs-keyword">const</span> importantNotes = <span class="hljs-keyword">await</span> db
  .<span class="hljs-title function_">select</span>()
  .<span class="hljs-title function_">from</span>(notes)
  .<span class="hljs-title function_">where</span>(<span class="hljs-title function_">eq</span>(notes.<span class="hljs-property">important</span>, <span class="hljs-literal">true</span>))
</code></pre>
<p>وجلب مستخدم مع ملاحظاته باستخدام ربط صريح:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { eq } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;drizzle-orm&quot;</span>
<span class="hljs-keyword">import</span> { db } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db&quot;</span>
<span class="hljs-keyword">import</span> { users, notes } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../db/schema&quot;</span>

<span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> db
  .<span class="hljs-title function_">select</span>()
  .<span class="hljs-title function_">from</span>(users)
  .<span class="hljs-title function_">leftJoin</span>(notes, <span class="hljs-title function_">eq</span>(notes.<span class="hljs-property">userId</span>, users.<span class="hljs-property">id</span>))
  .<span class="hljs-title function_">where</span>(<span class="hljs-title function_">eq</span>(users.<span class="hljs-property">id</span>, <span class="hljs-number">1</span>))
</code></pre>
<p>يمنحك هذا مصفوفة مسطّحة من الصفوف (صف لكل ملاحظة مربوطة)، ثم تجمّعها بنفسك، بخلاف الواجهة العلائقية التي تمنحك كائناً متداخلاً.</p>
<p>تكون واجهة SQL مفيدة عندما تحتاج إلى تحكم دقيق في شكل الاستعلام، أو تريد استخدام ميزات SQL لا تكشفها الواجهة العلائقية، أو تكتب شيئاً معقداً بما يكفي ليكون الربط الصريح أوضح. أما لعمليات CRUD اليومية، فالواجهة العلائقية أكثر ملاءمة. والواجهتان محدّدتا النوع بالكامل ويمكن مزجهما بحرية في المشروع نفسه.</p>
<h3 id="مسارات-api">مسارات API</h3>
<p>حتى الآن جلبنا البيانات وعدّلناها باستخدام مكوّنات الخادم وإجراءات الخادم. ويدعم Next.js أيضاً <a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">مسارات API</a> التقليدية، وتسمى أيضاً معالجات المسارات (Route Handlers)، والتي تتيح لك كشف نقاط نهاية HTTP تُعيد استجابات اعتباطية، عادةً JSON.</p>
<p>استخدمنا بالفعل مسار API واحداً دون أن نوليَه اهتماماً كبيراً: معالج NextAuth الشامل في <em>app/api/auth/[...nextauth]/route.ts</em>. يصدّر ذلك الملف دالة معالج لكل من GET وPOST وتعترض NextAuth تلقائياً كل طلب تحت <em>/api/auth/</em>. تعاملنا معه حينها كصندوق أسود، لكن الملف ليس سوى معالج مسار عادي في Next.js.</p>
<h4 id="كيف-تعمل-معالجات-المسارات">كيف تعمل معالجات المسارات</h4>
<p>معالج المسار هو ملف اسمه <em>route.ts</em> (أو <em>route.js</em>) داخل مجلد <em>app</em>. يصدّر دوال غير متزامنة مسمّاة تقابل طرق HTTP: <em>GET</em> و <em>POST</em> و <em>PUT</em> و <em>PATCH</em> و <em>DELETE</em> وهكذا.</p>
<p>لنضف إلى تطبيقنا نقطة نهاية بسيطة للقراءة فقط تُعيد قائمة الملاحظات بصيغة JSON. ننشئ الملف <em>app/api/notes/route.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">NextResponse</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/server&quot;</span>
<span class="hljs-keyword">import</span> { getNotes } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../services/notes&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">GET</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> notes = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getNotes</span>(<span class="hljs-literal">false</span>)
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">NextResponse</span>.<span class="hljs-title function_">json</span>(notes)
}
</code></pre>
<p>تؤدي زيارة <em>/api/notes</em> في المتصفح (أو بـ<em>curl</em>) الآن إلى إرجاع مصفوفة الملاحظات بصيغة JSON:</p>
<pre><code class="language-json"><span class="hljs-punctuation">[</span>
  <span class="hljs-punctuation">{</span> <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">1</span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;content&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;next.js utilizes React Server Components&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;important&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;userId&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">1</span> <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-punctuation">{</span> <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">2</span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;content&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;next.js is built on top of React&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;important&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span> <span class="hljs-attr">&quot;userId&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">1</span> <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">]</span>
</code></pre>
<p>قد تبدو نقطة النهاية التي تتيح إنشاء ملاحظة عبر POST هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">NextRequest</span>, <span class="hljs-title class_">NextResponse</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/server&quot;</span>
<span class="hljs-keyword">import</span> { getServerSession } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next-auth&quot;</span>
<span class="hljs-keyword">import</span> { authOptions } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../../lib/auth&quot;</span>
<span class="hljs-keyword">import</span> { addNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../services/notes&quot;</span>
<span class="hljs-keyword">import</span> { revalidatePath } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/cache&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">POST</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">req: NextRequest</span>) =&gt; {
  <span class="hljs-keyword">const</span> session = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getServerSession</span>(authOptions)
  <span class="hljs-keyword">if</span> (!session) {
    <span class="hljs-keyword">return</span> <span class="hljs-title class_">NextResponse</span>.<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;Unauthorized&quot;</span> }, { <span class="hljs-attr">status</span>: <span class="hljs-number">401</span> })
  }

  <span class="hljs-keyword">const</span> body = <span class="hljs-keyword">await</span> req.<span class="hljs-title function_">json</span>()
  <span class="hljs-keyword">const</span> { content, important = <span class="hljs-literal">false</span> } = body

  <span class="hljs-keyword">if</span> (!content || content.<span class="hljs-property">length</span> &amp;lt; <span class="hljs-number">10</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title class_">NextResponse</span>.<span class="hljs-title function_">json</span>(
      { <span class="hljs-attr">error</span>: <span class="hljs-string">&quot;Content must be at least 10 characters&quot;</span> },
      { <span class="hljs-attr">status</span>: <span class="hljs-number">400</span> },
    )
  }

  <span class="hljs-keyword">await</span> <span class="hljs-title function_">addNote</span>(content, important)
  <span class="hljs-title function_">revalidatePath</span>(<span class="hljs-string">&quot;/notes&quot;</span>)
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">NextResponse</span>.<span class="hljs-title function_">json</span>({ <span class="hljs-attr">success</span>: <span class="hljs-literal">true</span> }, { <span class="hljs-attr">status</span>: <span class="hljs-number">201</span> })
}
</code></pre>
<p>يقرأ معالج <em>POST</em> جسم الطلب بصيغة JSON باستخدام <em>req.json()</em>، ويتحقق من المحتوى، ويستدعي دالة الخدمة <em>addNote</em> نفسها التي يستخدمها إجراء الخادم. ويُفحص التحقق من المصادقة بـ<em>getServerSession</em>، وإذا لم توجد جلسة تُعاد استجابة HTTP 401.</p>
<h4 id="متى-نستخدم-مسارات-api-مقابل-إجراءات-الخادم">متى نستخدم مسارات API مقابل إجراءات الخادم</h4>
<p>يتداخل النهجان، لكن القاعدة العامة مباشرة.</p>
<p>استخدم <strong>إجراءات الخادم</strong> عندما يكون المستهلك واجهة Next.js الخاصة بك، مثل إرسال نموذج أو النقر على زر. فإجراءات الخادم مرتبطة بنموذج العرض في React، وتستفيد من التخزين المؤقت المدمج والتكامل مع إعادة التحقق، ولا تتطلب منك كتابة أي استدعاءات fetch في العميل.</p>
<p>استخدم <strong>مسارات API</strong> عندما تحتاج إلى نقطة نهاية HTTP يمكن لشيء خارج تطبيق Next.js استدعاؤها، مثلاً تطبيق جوال أو خطاف ويب (webhook) لخدمة طرف ثالث أو واجهة أمامية منفصلة. تتحدث مسارات API لغة HTTP العادية وتُعيد استجابات JSON قياسية، ما يجعل استهلاكها سهلاً من أي مكان.</p>
<p>في تطبيقنا تغطي إجراءات الخادم كل احتياجات الواجهة. أما مسارات <em>/api/auth/</em> فهي موجودة لأن NextAuth تتطلب نقاط نهاية HTTP قياسية للتعامل مع مجرى المصادقة، الذي يتضمن إعادة توجيهات المتصفح وضبط ملفات تعريف الارتباط وهي أمور لم يُصمَّم نموذج إجراءات الخادم لأجلها. ولهذا احتجنا إلى معالجات المسارات للمصادقة رغم أن بقية التطبيق يستخدم إجراءات الخادم.</p>
<h3 id="التمارين">التمارين</h3>
<div class="tasks">
<p><strong>18. صفحتي مع وصول برمز API</strong></p>
</div>
<div class="tasks">
<p><strong>19. صفحتي مع وصول برمز API</strong></p>
</div>
<div class="tasks">
<p><strong>20. قائمة القراءة</strong></p>
</div>
<div class="tasks">
<p><strong>21. قائمة قراءة أفضل</strong></p>
</div>
<h3 id="بعض-الأمور-المعلقة">بعض الأمور المعلّقة</h3>
<h4 id="suspense-والبث">Suspense والبث</h4>
<p>عندما يجلب مكوّن خادم بيانات، تنتظر الصفحة بأكملها البيانات قبل إرسال أي شيء إلى المتصفح. وبالنسبة إلى الاستعلامات البطيئة يعني هذا أن المستخدم يحدّق في شاشة فارغة. وتعالج حدود <a href="https://react.dev/reference/react/Suspense">Suspense</a> في React هذه المشكلة بأن تتيح لك بث أجزاء من الواجهة فور جهوزيتها.</p>
<p>أبسط طريقة لإضافة واجهة تحميل إلى مسار هي إنشاء ملف <a href="https://nextjs.org/docs/app/api-reference/file-conventions/loading">loading.tsx</a> في المجلد نفسه الذي يوجد فيه <em>page.tsx</em>. فيلفّ Next.js الصفحة تلقائياً في حدّ Suspense ويعرض مكوّن التحميل أثناء تجهيز الصفحة:</p>
<pre><code class="language-js">&lt;em&gt;<span class="hljs-comment">// app/notes/loading.tsx&lt;/em&gt;</span>
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Loading</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;p&amp;gt;<span class="hljs-title class_">Loading</span> notes...&amp;lt;/p&amp;gt;
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Loading</span>

</code></pre>
<p>الآن عندما ينتقل المستخدم إلى <em>/notes</em>، يرى فوراً &quot;Loading notes...&quot; بينما يجلب مكوّن الخادم البيانات. وبمجرد جهوز البيانات، يبثّ Next.js محتوى الصفحة الفعلي ويستبدل حالة التحميل.</p>
<p>لمزيد من التحكم الدقيق، يمكنك لفّ المكوّنات فرادى يدوياً في حدود <em>&lt;Suspense&gt; </em>. يكون هذا مفيداً عندما تحتوي صفحة على عدة أقسام مستقلة تجلب البيانات، وتريد لكل منها أن يُحمَّل بشكل مستقل بدلاً من انتظار الصفحة بأكملها:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Suspense</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NoteList</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./NoteList&quot;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Statistics</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./Statistics&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Notes</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Notes</span>&amp;lt;/h2&gt;
      &amp;lt;<span class="hljs-title class_">Suspense</span> fallback={&amp;lt;p&gt;<span class="hljs-title class_">Loading</span> notes...&amp;lt;/p&gt;}&gt;
        &amp;lt;<span class="hljs-title class_">NoteList</span> /&gt;
      &amp;lt;/<span class="hljs-title class_">Suspense</span>&gt;
      &amp;lt;<span class="hljs-title class_">Suspense</span> fallback={&amp;lt;p&gt;<span class="hljs-title class_">Loading</span> statistics...&amp;lt;/p&gt;}&gt;
        &amp;lt;<span class="hljs-title class_">Statistics</span> /&gt;
      &amp;lt;/<span class="hljs-title class_">Suspense</span>&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>يمكن أن يكون كل مكوّن ملفوف مكوّن خادم غير متزامن يجلب بياناته بنفسه. ويبثّ Next.js كل بديل (fallback) فوراً ويستبدله بالمحتوى الحقيقي بمجرد انتهاء ذلك المكوّن، فلا تعيق الأقسام البطيئة الأقسام السريعة.</p>
<h4 id="تحسين-الصور-باستخدام-nextimage">تحسين الصور باستخدام next/image</h4>
<p>في HTML العادي، كنت ستحمّل صورة بوسم <em>&lt;img&gt;</em>:</p>
<pre><code>&amp;lt;img src=&quot;/profile.jpg&quot; alt=&quot;User profile&quot; width=&quot;200&quot; height=&quot;200&quot; /&gt;
</code></pre>
<p>هذا يعمل، لكن المتصفحات تحمّل الصورة بالحجم الكامل بغض النظر عن حجم شاشة الجهاز، ولا يوجد تحسين تلقائي. ويوفّر Next.js مكوّن <a href="https://nextjs.org/docs/app/api-reference/components/image">Image</a> الذي يحسّن الصور تلقائياً من أجل الأداء:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/image&quot;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Profile</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;<span class="hljs-title class_">Image</span>
        src=<span class="hljs-string">&quot;/profile.jpg&quot;</span>
        alt=<span class="hljs-string">&quot;User profile&quot;</span>
        width={<span class="hljs-number">200</span>}
        height={<span class="hljs-number">200</span>}
      /&gt;
    &amp;lt;/div&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Profile</span>
</code></pre>
<p>يقدّم مكوّن Image عدة فوائد رئيسية:</p>
<ul>
<li><strong>تحسين الصيغة تلقائياً:</strong> يقدّم Next.js صيغاً حديثة مثل WebP وAVIF إلى المتصفحات التي تدعمها، مع الرجوع إلى الصيغة الأصلية للمتصفحات الأقدم.</li>
<li><strong>صور متجاوبة:</strong> يولّد المكوّن تلقائياً أحجاماً متعددة للصورة ويقدّم الحجم المناسب وفقاً لجهاز المستخدم.</li>
<li><strong>التحميل الكسول:</strong> لا تُحمَّل الصور خارج نافذة العرض حتى يقترب المستخدم من التمرير إليها، ما يقلّل زمن التحميل الأولي للصفحة.</li>
<li><strong>يمنع انزياح التخطيط:</strong> بفرض خاصيتي <code>width</code> و<code>height</code> الصريحتين (أو استخدام <code>fill</code>)، يحجز المتصفح المساحة قبل تحميل الصورة، مانعاً القفز المفاجئ للمحتوى.</li>
</ul>
<p>بالنسبة إلى الصور المخزّنة في مجلد <em>public</em>، يبدأ المسار بـ<em>/</em>:</p>
<pre><code>&amp;lt;Image src=&quot;/images/logo.png&quot; alt=&quot;Logo&quot; width={100} height={50} /&gt;
</code></pre>
<p>بالنسبة إلى الصور الخارجية المستضافة على نطاقات أخرى، تحتاج إلى ضبط النطاقات المسموح بها في <em>next.config.js</em>:</p>
<pre><code class="language-js">&lt;em&gt;<span class="hljs-comment">/** <span class="hljs-doctag">@type</span> {<span class="hljs-type">import(&#x27;next&#x27;).NextConfig</span>} */</span>&lt;/em&gt;
<span class="hljs-keyword">const</span> nextConfig = {
  <span class="hljs-attr">images</span>: {
    <span class="hljs-attr">remotePatterns</span>: [
      {
        <span class="hljs-attr">protocol</span>: <span class="hljs-string">&#x27;https&#x27;</span>,
        <span class="hljs-attr">hostname</span>: <span class="hljs-string">&#x27;example.com&#x27;</span>,
      },
    ],
  },
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = nextConfig
</code></pre>
<p>ثم يمكنك استخدام الرابط الخارجي:</p>
<pre><code>&amp;lt;Image
  src=&quot;https://example.com/photo.jpg&quot;
  alt=&quot;Photo&quot;
  width={400}
  height={300}
/&gt;
</code></pre>
<p>إذا كنت لا تعرف أبعاد الصورة مسبقاً (مثلاً الصور التي يرفعها المستخدمون)، فيمكنك استخدام خاصية <em>fill</em> لجعل الصورة تملأ حاويتها الأب:</p>
<pre><code>&amp;lt;div style={{ position: 'relative', width: '100%', height: '400px' }}&gt;
  &amp;lt;Image
    src=&quot;/dynamic-image.jpg&quot;
    alt=&quot;Dynamic content&quot;
    fill
    style={{ objectFit: 'cover' }}
  /&gt;
&amp;lt;/div&gt;
</code></pre>
<p>يجب أن تكون الحاوية الأب بـ<em>position: relative</em> أو <em>position: fixed</em> أو <em>position: absolute</em> حتى تعمل <em>fill</em> بشكل صحيح.</p>
<p>يُعدّ مكوّن Image أحد أهم تحسينات الأداء في Next.js. فاستخدامه بدلاً من وسوم <em>&lt;img&gt;</em> العادية يضمن توصيل صورك بكفاءة على جميع الأجهزة وظروف الشبكة.</p>
<h4 id="البيانات-الوصفية-وseo">البيانات الوصفية وSEO</h4>
<p>يمتلك Next.js <a href="https://nextjs.org/docs/app/getting-started/metadata-and-og-images">واجهة Metadata API</a> مدمجة لضبط عنوان الصفحة ووصفها وغيرها من وسوم <em>&lt;head&gt;</em> بطريقة تعمل بشكل صحيح مع مكوّنات الخادم والبث.</p>
<p>أبسط صورة لذلك هي تصدير <em>metadata</em> ثابت في ملف <em>page.tsx</em> أو <em>layout.tsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> type { <span class="hljs-title class_">Metadata</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">metadata</span>: <span class="hljs-title class_">Metadata</span> = {
  <span class="hljs-attr">title</span>: <span class="hljs-string">&quot;Notes app&quot;</span>,
  <span class="hljs-attr">description</span>: <span class="hljs-string">&quot;A simple notes application built with Next.js&quot;</span>,
}
</code></pre>
<p>يدمج Next.js البيانات الوصفية من التخطيط الجذري نزولاً عبر التخطيطات والصفحات المتداخلة، فيمكن لصفحة فرعية تجاوز الحقول التي تحتاجها فقط دون تكرار كل شيء.</p>
<p>بالنسبة إلى الصفحات الديناميكية التي يعتمد عنوانها على البيانات، تصدّر دالة <em>generateMetadata</em> بدلاً من ذلك:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">Metadata</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next&quot;</span>
<span class="hljs-keyword">import</span> { getNoteById } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../services/notes&quot;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> generateMetadata = <span class="hljs-title function_">async</span> ({
  params,
}: {
  <span class="hljs-attr">params</span>: <span class="hljs-title class_">Promise</span>&amp;lt;{ <span class="hljs-attr">id</span>: <span class="hljs-built_in">string</span> }&gt;
}): <span class="hljs-title class_">Promise</span>&amp;lt;<span class="hljs-title class_">Metadata</span>&gt; =&gt; {
  <span class="hljs-keyword">const</span> { id } = <span class="hljs-keyword">await</span> params
  <span class="hljs-keyword">const</span> note = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getNoteById</span>(<span class="hljs-title class_">Number</span>(id))
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">title</span>: note ? note.<span class="hljs-property">content</span>.<span class="hljs-title function_">slice</span>(<span class="hljs-number">0</span>, <span class="hljs-number">50</span>) : <span class="hljs-string">&quot;Note not found&quot;</span>,
  }
}
</code></pre>
<p>يعمل هذا على الخادم، ويظهر العنوان الناتج في وسم <em>&lt;title&gt;</em> في HTML، وهو أمر مهم لمحركات البحث ولعنوان علامة التبويب في المتصفح. وتتبع وسوم Open Graph الخاصة بالمشاركة الاجتماعية النمط نفسه باستخدام المفتاح <em>openGraph</em> داخل كائن البيانات الوصفية.</p>
<h3 id="التمارين">التمارين</h3>
<div class="tasks">
<p><strong>22. صفحة رئيسية ثابتة من markdown</strong></p>
</div>
<pre><code>.markdown h1 {
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
</code></pre>
<div class="tasks">
<p><strong>23. اللمسات الأخيرة</strong></p>
</div>
<div class="tasks">
<p><strong>24. الفحص الأخير</strong></p>
</div>
<div class="tasks">
<p><strong>25. مستودع GitHub الخاص بك</strong></p>
</div>
`,c={part:14,letter:"d",file:s,title:a,slug:n,mainImage:t,headings:p,html:l};export{c as default,s as file,p as headings,l as html,o as letter,t as mainImage,e as part,n as slug,a as title};
