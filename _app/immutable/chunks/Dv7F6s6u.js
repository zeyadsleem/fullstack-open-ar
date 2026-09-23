const t=4,r="d",s="part4d.md",n="المصادقة بالرموز",a="token_authentication",p="/images/part-4.svg",e=[{depth:3,id:"قصر-إنشاء-الملاحظات-الجديدة-على-المستخدمين-المسجلين-الدخول",text:"قصر إنشاء الملاحظات الجديدة على المستخدمين المسجَّلين الدخول"},{depth:3,id:"مشكلات-المصادقة-القائمة-على-الرموز",text:"مشكلات المصادقة القائمة على الرموز"},{depth:3,id:"ملاحظات-ختامية",text:"ملاحظات ختامية"},{depth:3,id:"تمارين-415-423",text:"تمارين 4.15.-4.23."}],l=`<div class="content">
<p>يجب أن يتمكن المستخدمون من تسجيل الدخول إلى تطبيقنا، وعندما يسجّل المستخدم الدخول، يجب أن تُرفق معلوماته تلقائياً بأي ملاحظات جديدة ينشئها.</p>
<p>سننفّذ الآن دعماً لـ<a href="https://www.okta.com/identity-101/what-is-token-based-authentication/">المصادقة القائمة على الرموز</a> في الواجهة الخلفية.</p>
<p>تُوضَّح مبادئ المصادقة القائمة على الرموز في مخطط التتابع التالي:</p>
<p><img src="/images/content/4/16new.webp" alt="مخطط تتابع للمصادقة القائمة على الرموز"></p>
<ul>
<li>يبدأ المستخدم بتسجيل الدخول باستخدام نموذج تسجيل دخول منفَّذ بـ React
<ul>
<li>سنضيف نموذج تسجيل الدخول إلى الواجهة الأمامية في <a href="/part5">الجزء 5</a></li>
</ul>
</li>
<li>يؤدي هذا إلى أن ترسل شيفرة React اسم المستخدم وكلمة المرور إلى عنوان الخادم <i>/api/login</i> في طلب HTTP POST.</li>
<li>إذا كان اسم المستخدم وكلمة المرور صحيحين، يولّد الخادم <i>رمزاً</i> (token) يعرّف بطريقة ما المستخدم المسجَّل الدخول.
<ul>
<li>يُوقَّع الرمز رقمياً، ما يجعل تزويره مستحيلاً (بالوسائل التشفيرية)</li>
</ul>
</li>
<li>تستجيب الواجهة الخلفية برمز حالة يشير إلى نجاح العملية، وتعيد الرمز مع الاستجابة.</li>
<li>يحفظ المتصفح الرمز، مثلاً في حالة تطبيق React.</li>
<li>عندما ينشئ المستخدم ملاحظة جديدة (أو يجري عملية أخرى تتطلب التحقق من الهوية)، ترسل شيفرة React الرمز إلى الخادم مع الطلب.</li>
<li>يستخدم الخادم الرمز للتحقق من هوية المستخدم</li>
</ul>
<p>لننفّذ أولاً وظيفة تسجيل الدخول. ثبّت مكتبة <a href="https://github.com/auth0/node-jsonwebtoken">jsonwebtoken</a> التي تتيح لنا توليد <a href="https://jwt.io/">رموز JSON للويب</a>.</p>
<pre><code class="language-bash">npm install jsonwebtoken
</code></pre>
<p>تذهب شيفرة وظيفة تسجيل الدخول إلى الملف <i>controllers/login.js</i>.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> jwt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;jsonwebtoken&#x27;</span>)
<span class="hljs-keyword">const</span> bcrypt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;bcrypt&#x27;</span>)
<span class="hljs-keyword">const</span> loginRouter = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;express&#x27;</span>).<span class="hljs-title class_">Router</span>()
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;../models/user&#x27;</span>)

loginRouter.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-keyword">const</span> { username, password } = request.<span class="hljs-property">body</span>

  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({ username })
  <span class="hljs-keyword">const</span> passwordCorrect = user === <span class="hljs-literal">null</span>
    ? <span class="hljs-literal">false</span>
    : <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">compare</span>(password, user.<span class="hljs-property">passwordHash</span>)

  <span class="hljs-keyword">if</span> (!(user &amp;&amp; passwordCorrect)) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;invalid username or password&#x27;</span>
    })
  }

  <span class="hljs-keyword">const</span> userForToken = {
    <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
    <span class="hljs-attr">id</span>: user.<span class="hljs-property">_id</span>,
  }

  <span class="hljs-keyword">const</span> token = jwt.<span class="hljs-title function_">sign</span>(userForToken, process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>)

  response
    .<span class="hljs-title function_">status</span>(<span class="hljs-number">200</span>)
    .<span class="hljs-title function_">send</span>({ token, <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>, <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span> })
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = loginRouter
</code></pre>
<p>تبدأ الشيفرة بالبحث عن المستخدم في قاعدة البيانات بواسطة <i>username</i> المرفق بالطلب.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({ username })
</code></pre>
<p>ثم تتحقق من <i>password</i> المرفقة هي أيضاً بالطلب.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> passwordCorrect = user === <span class="hljs-literal">null</span>
  ? <span class="hljs-literal">false</span>
  : <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">compare</span>(password, user.<span class="hljs-property">passwordHash</span>)
</code></pre>
<p>ولأن كلمات المرور نفسها لا تُحفظ في قاعدة البيانات، بل <i>تجزئات</i> (hashes) محسوبة منها، تُستخدم الدالة <em>bcrypt.compare</em> للتحقق من صحة كلمة المرور:</p>
<pre><code class="language-js"><span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">compare</span>(password, user.<span class="hljs-property">passwordHash</span>)
</code></pre>
<p>إذا لم يُعثر على المستخدم، أو كانت كلمة المرور غير صحيحة، تُستجاب الطلب برمز الحالة <a href="https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized">401 unauthorized</a>. ويُشرح سبب الفشل في جسم الاستجابة.</p>
<pre><code class="language-js"><span class="hljs-keyword">if</span> (!(user &amp;&amp; passwordCorrect)) {
  <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
    <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;invalid username or password&#x27;</span>
  })
}
</code></pre>
<p>إذا كانت كلمة المرور صحيحة، يُنشأ رمز بالدالة <em>jwt.sign</em>. يحتوي الرمز على اسم المستخدم ومعرّف المستخدم بصيغة موقَّعة رقمياً.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> userForToken = {
  <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
  <span class="hljs-attr">id</span>: user.<span class="hljs-property">_id</span>,
}

<span class="hljs-keyword">const</span> token = jwt.<span class="hljs-title function_">sign</span>(userForToken, process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>)
</code></pre>
<p>وُقِّع الرمز رقمياً باستخدام نص من متغير البيئة <i>SECRET</i> بوصفه <i>السر</i>.
يضمن التوقيع الرقمي أن الأطراف التي تعرف السر فقط هي القادرة على توليد رمز صالح.
ويجب ضبط قيمة متغير البيئة في ملف <i>.env</i>.</p>
<p>تُستجاب الطلب الناجح برمز الحالة <i>200 OK</i>. ويُعاد الرمز المولَّد واسم مستخدم المستخدم في جسم الاستجابة.</p>
<pre><code class="language-js">response
  .<span class="hljs-title function_">status</span>(<span class="hljs-number">200</span>)
  .<span class="hljs-title function_">send</span>({ token, <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>, <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span> })
</code></pre>
<p>يبقى الآن أن تُضاف شيفرة تسجيل الدخول إلى التطبيق بإدراج الموجّه الجديد في <i>app.js</i>.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> loginRouter = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./controllers/login&#x27;</span>)

<span class="hljs-comment">//...</span>

app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/login&#x27;</span>, loginRouter)
</code></pre>
<p>لنجرّب تسجيل الدخول باستخدام عميل REST في VS Code:</p>
<p><img src="/images/content/4/17e.webp" alt="طلب REST من VS Code مع اسم المستخدم وكلمة المرور"></p>
<p>لا يعمل. تُطبع الرسالة التالية في الطرفية:</p>
<pre><code class="language-bash">(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async <span class="hljs-keyword">function</span> without a catch block, or by rejecting a promise <span class="hljs-built_in">which</span> was not handled with .catch(). (rejection <span class="hljs-built_in">id</span>: 2)
</code></pre>
<p>يفشل الأمر <em>jwt.sign(userForToken, process.env.SECRET)</em>. نسينا ضبط قيمة لمتغير البيئة <i>SECRET</i>. ويمكن أن يكون أي نص. وعندما نضبط القيمة في ملف <i>.env</i> (ونعيد تشغيل الخادم)، يعمل تسجيل الدخول.</p>
<p>يعيد تسجيل الدخول الناجح تفاصيل المستخدم والرمز:</p>
<p><img src="/images/content/4/18ea.webp" alt="استجابة REST من VS Code تعرض التفاصيل والرمز"></p>
<p>يعيد اسم المستخدم أو كلمة المرور الخاطئة رسالة خطأ ورمز الحالة المناسب:</p>
<p><img src="/images/content/4/19ea.webp" alt="استجابة REST من VS Code لبيانات تسجيل دخول غير صحيحة"></p>
<h3 id="قصر-إنشاء-الملاحظات-الجديدة-على-المستخدمين-المسجلين-الدخول">قصر إنشاء الملاحظات الجديدة على المستخدمين المسجَّلين الدخول</h3>
<p>لنغيّر إنشاء الملاحظات الجديدة بحيث لا يصبح ممكناً إلا إذا كان طلب POST مرفقاً برمز صالح. وعندها تُحفظ الملاحظة في قائمة ملاحظات المستخدم الذي يعرّفه الرمز.</p>
<p>توجد طرق عديدة لإرسال الرمز من المتصفح إلى الخادم. سنستخدم ترويسة <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization">Authorization</a>. وتخبر الترويسة أيضاً عن <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes">مخطط المصادقة</a> المستخدم. وقد يكون هذا ضرورياً إذا قدّم الخادم طرقاً متعددة للمصادقة.
تحديد المخطط يخبر الخادم بكيفية تفسير بيانات الاعتماد المرفقة.</p>
<p>مخطط <i>Bearer</i> مناسب لاحتياجاتنا.</p>
<p>عملياً، هذا يعني أنه إذا كان الرمز، على سبيل المثال، النص <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>، فستكون قيمة ترويسة Authorization:</p>
<pre><code>Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</code></pre>
<p>سيتغيّر إنشاء الملاحظات الجديدة على النحو التالي (<i>controllers/notes.js</i>):</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> jwt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;jsonwebtoken&#x27;</span>) <span class="hljs-comment">//highlight-line</span>

<span class="hljs-comment">// ...</span>
  <span class="hljs-comment">//highlight-start</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">getTokenFrom</span> = request =&gt; {
  <span class="hljs-keyword">const</span> authorization = request.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;authorization&#x27;</span>)
  <span class="hljs-keyword">if</span> (authorization &amp;&amp; authorization.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;Bearer &#x27;</span>)) {
    <span class="hljs-keyword">return</span> authorization.<span class="hljs-title function_">replace</span>(<span class="hljs-string">&#x27;Bearer &#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
  }
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
}
  <span class="hljs-comment">//highlight-end</span>

notesRouter.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-keyword">const</span> body = request.<span class="hljs-property">body</span>
<span class="hljs-comment">//highlight-start</span>
  <span class="hljs-keyword">const</span> decodedToken = jwt.<span class="hljs-title function_">verify</span>(<span class="hljs-title function_">getTokenFrom</span>(request), process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>)
  <span class="hljs-keyword">if</span> (!decodedToken.<span class="hljs-property">id</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token invalid&#x27;</span> })
  }

  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findById</span>(decodedToken.<span class="hljs-property">id</span>)
<span class="hljs-comment">//highlight-end</span>

  <span class="hljs-keyword">if</span> (!user) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;UserId missing or not valid&#x27;</span> })
  }

  <span class="hljs-keyword">const</span> note = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Note</span>({
    <span class="hljs-attr">content</span>: body.<span class="hljs-property">content</span>,
    <span class="hljs-attr">important</span>: body.<span class="hljs-property">important</span> || <span class="hljs-literal">false</span>,
    <span class="hljs-attr">user</span>: user.<span class="hljs-property">_id</span>
  })

  <span class="hljs-keyword">const</span> savedNote = <span class="hljs-keyword">await</span> note.<span class="hljs-title function_">save</span>()
  user.<span class="hljs-property">notes</span> = user.<span class="hljs-property">notes</span>.<span class="hljs-title function_">concat</span>(savedNote.<span class="hljs-property">_id</span>)
  <span class="hljs-keyword">await</span> user.<span class="hljs-title function_">save</span>()

  response.<span class="hljs-title function_">status</span>(<span class="hljs-number">201</span>).<span class="hljs-title function_">json</span>(savedNote)
})
</code></pre>
<p>تعزل الدالة المساعدة <em>getTokenFrom</em> الرمز من ترويسة <i>authorization</i>. ويُتحقق من صلاحية الرمز بالدالة <em>jwt.verify</em>. كما تفك هذه الدالة ترميز الرمز، أي تعيد الكائن الذي بُني عليه الرمز.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> decodedToken = jwt.<span class="hljs-title function_">verify</span>(token, process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>)
</code></pre>
<p>إذا كان الرمز مفقوداً أو غير صالح، يُطلق الاستثناء <i>JsonWebTokenError</i>. نحتاج إلى توسيع وسيط معالجة الأخطاء ليتعامل مع هذه الحالة تحديداً:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">errorHandler</span> = (<span class="hljs-params">error, request, response, next</span>) =&gt; {
  <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;CastError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;malformatted id&#x27;</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;ValidationError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">message</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;MongoServerError&#x27;</span> &amp;&amp; error.<span class="hljs-property">message</span>.<span class="hljs-title function_">includes</span>(<span class="hljs-string">&#x27;E11000 duplicate key error&#x27;</span>)) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;expected \`username\` to be unique&#x27;</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> ===  <span class="hljs-string">&#x27;JsonWebTokenError&#x27;</span>) { <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token invalid&#x27;</span> }) <span class="hljs-comment">// highlight-line</span>
  }

  <span class="hljs-title function_">next</span>(error)
}
</code></pre>
<p>يحتوي الكائن المفكوك من الرمز على الحقلين <i>username</i> و<i>id</i>، وهما يخبران الخادم بمن أجرى الطلب.</p>
<p>إذا لم يحتوي الكائن المفكوك من الرمز على هوية المستخدم (<em>decodedToken.id</em> غير معرَّف)، يُعاد رمز حالة الخطأ <a href="https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized">401 unauthorized</a> ويُشرح سبب الفشل في جسم الاستجابة.</p>
<pre><code class="language-js"><span class="hljs-keyword">if</span> (!decodedToken.<span class="hljs-property">id</span>) {
  <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
    <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token invalid&#x27;</span>
  })
}
</code></pre>
<p>وعندما تُحدَّد هوية مُجري الطلب، يستمر التنفيذ كما كان سابقاً.</p>
<p>يمكن الآن إنشاء ملاحظة جديدة باستخدام Postman إذا أُعطيت ترويسة <i>authorization</i> القيمة الصحيحة، أي النص <i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>، حيث القيمة الثانية هي الرمز الذي أعادته عملية <i>login</i>.</p>
<p>يبدو هذا باستخدام Postman كما يلي:</p>
<p><img src="/images/content/4/20new.webp" alt="إضافة رمز bearer في Postman"></p>
<p>ومع عميل REST في Visual Studio Code</p>
<p><img src="/images/content/4/21new.webp" alt="مثال إضافة رمز bearer في VS Code"></p>
<p>يمكن العثور على شيفرة التطبيق الحالية في <a href="https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9">GitHub</a>، في الفرع <i>part4-9</i>.</p>
<p>إذا كان للتطبيق واجهات متعددة تتطلب التحقق من الهوية، فينبغي فصل التحقق من JWT في وسيط خاص به. ويمكن أيضاً استخدام مكتبة جاهزة مثل <a href="https://www.npmjs.com/package/express-jwt">express-jwt</a>.</p>
<h3 id="مشكلات-المصادقة-القائمة-على-الرموز">مشكلات المصادقة القائمة على الرموز</h3>
<p>المصادقة بالرموز سهلة التنفيذ نسبياً، لكنها تنطوي على مشكلة واحدة. فبمجرد أن يحصل مستخدم الـ API، مثل تطبيق React، على رمز، تثق الـ API ثقة عمياء بحامل الرمز. فماذا لو لزم سحب صلاحيات الوصول من حامل الرمز؟</p>
<p>يوجد حلان للمشكلة. الأسهل هو تحديد مدة صلاحية للرمز:</p>
<pre><code class="language-js">loginRouter.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-keyword">const</span> { username, password } = request.<span class="hljs-property">body</span>

  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({ username })
  <span class="hljs-keyword">const</span> passwordCorrect = user === <span class="hljs-literal">null</span>
    ? <span class="hljs-literal">false</span>
    : <span class="hljs-keyword">await</span> bcrypt.<span class="hljs-title function_">compare</span>(password, user.<span class="hljs-property">passwordHash</span>)

  <span class="hljs-keyword">if</span> (!(user &amp;&amp; passwordCorrect)) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;invalid username or password&#x27;</span>
    })
  }

  <span class="hljs-keyword">const</span> userForToken = {
    <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
    <span class="hljs-attr">id</span>: user.<span class="hljs-property">_id</span>,
  }

  <span class="hljs-comment">// تنتهي صلاحية الرمز بعد 60*60 ثانية، أي بعد ساعة واحدة</span>
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> token = jwt.<span class="hljs-title function_">sign</span>(
    userForToken, 
    process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>,
    { <span class="hljs-attr">expiresIn</span>: <span class="hljs-number">60</span>*<span class="hljs-number">60</span> }
  )
  <span class="hljs-comment">// highlight-end</span>

  response
    .<span class="hljs-title function_">status</span>(<span class="hljs-number">200</span>)
    .<span class="hljs-title function_">send</span>({ token, <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>, <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span> })
})
</code></pre>
<p>بمجرد انتهاء صلاحية الرمز، يحتاج تطبيق العميل إلى الحصول على رمز جديد. ويحدث هذا عادةً بإجبار المستخدم على إعادة تسجيل الدخول إلى التطبيق.</p>
<p>ينبغي توسيع وسيط معالجة الأخطاء ليعطي خطأ مناسباً في حالة انتهاء صلاحية الرمز:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">errorHandler</span> = (<span class="hljs-params">error, request, response, next</span>) =&gt; {
  logger.<span class="hljs-title function_">error</span>(error.<span class="hljs-property">message</span>)

  <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;CastError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;malformatted id&#x27;</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;ValidationError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">message</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;MongoServerError&#x27;</span> &amp;&amp; error.<span class="hljs-property">message</span>.<span class="hljs-title function_">includes</span>(<span class="hljs-string">&#x27;E11000 duplicate key error&#x27;</span>)) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;expected \`username\` to be unique&#x27;</span>
    })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;JsonWebTokenError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;invalid token&#x27;</span>
    })
  <span class="hljs-comment">// highlight-start  </span>
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;TokenExpiredError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token expired&#x27;</span>
    })
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-title function_">next</span>(error)
}
</code></pre>
<p>كلما قصرت مدة الانتهاء، كان الحل أكثر أماناً. فإذا وقع الرمز في أيدٍ غير أمينة أو لزم سحب وصول المستخدم إلى النظام، فلا يكون الرمز قابلاً للاستخدام إلا لمدة محدودة. غير أن مدة الانتهاء القصيرة قد تكون مصدر إزعاج للمستخدم، لأنها تتطلب منه تسجيل الدخول بتكرار أكبر.</p>
<p>الحل الآخر هو حفظ معلومات عن كل رمز في قاعدة بيانات الواجهة الخلفية، والتحقق عند كل طلب API مما إذا كانت صلاحيات الوصول المقابلة للرموز ما تزال صالحة. وبهذا المخطط يمكن سحب صلاحيات الوصول في أي وقت. وغالباً ما يُسمى هذا النوع من الحلول <i>جلسة من جهة الخادم</i>.</p>
<p>الجانب السلبي للجلسات من جهة الخادم هو تعقيد الواجهة الخلفية المتزايد، فضلاً عن تأثيرها على الأداء، إذ يجب التحقق من صلاحية الرمز في قاعدة البيانات عند كل طلب API. والوصول إلى قاعدة البيانات أبطأ بكثير مقارنةً بالتحقق من صلاحية الرمز نفسه. ولهذا من الشائع جداً حفظ الجلسة المقابلة لرمز ما في <i>قاعدة بيانات مفتاح-قيمة</i> مثل <a href="https://redis.io/">Redis</a>، وهي محدودة الوظائف مقارنةً بـ MongoDB مثلاً أو بقاعدة بيانات علائقية، لكنها سريعة للغاية في بعض سيناريوهات الاستخدام.</p>
<p>عند استخدام الجلسات من جهة الخادم، غالباً ما يكون الرمز مجرد نص عشوائي لا يتضمن أي معلومات عن المستخدم، خلافاً لما هو شائع عند استخدام رموز JWT. فعند كل طلب API، يجلب الخادم المعلومات ذات الصلة بهوية المستخدم من قاعدة البيانات. ومن الشائع أيضاً أنه بدلاً من استخدام ترويسة Authorization، تُستخدم <i>ملفات تعريف الارتباط</i> (cookies) كآلية لنقل الرمز بين العميل والخادم.</p>
<h3 id="ملاحظات-ختامية">ملاحظات ختامية</h3>
<p>جرت تغييرات كثيرة على الشيفرة تسببت في مشكلة نمطية في مشروع برمجي سريع الوتيرة: تعطّل معظم الاختبارات. ولأن هذا الجزء من الدورة مكدّس بالفعل بالمعلومات الجديدة، سنترك إصلاح الاختبارات لتمرين غير إلزامي.</p>
<p>يجب دائماً استخدام أسماء المستخدمين وكلمات المرور والتطبيقات التي تعتمد المصادقة بالرموز عبر <a href="https://en.wikipedia.org/wiki/HTTPS">HTTPS</a>. ويمكننا استخدام خادم <a href="https://nodejs.org/docs/latest-v18.x/api/https.html">HTTPS</a> من Node في تطبيقنا بدلاً من خادم <a href="https://nodejs.org/docs/latest-v18.x/api/http.html">HTTP</a> (وهو يتطلب إعدادات أكثر). وفي المقابل، النسخة الإنتاجية من تطبيقنا موجودة على Fly.io، لذا يبقى تطبيقنا آمناً: فـ Fly.io يوجّه كل حركة المرور بين المتصفح وخادم Fly.io عبر HTTPS.</p>
<p>سننفّذ تسجيل الدخول في الواجهة الأمامية في <a href="/part5">الجزء التالي</a>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-415-423">تمارين 4.15.-4.23.</h3>
<p>في التمارين التالية، ستُنفَّذ أساسيات إدارة المستخدمين في تطبيق قائمة المدونات. وأسلم طريقة هي اتباع مادة الدورة من فصل <a href="/part4/user_administration">إدارة المستخدمين</a> في الجزء 4 إلى فصل <a href="/part4/token_authentication">المصادقة بالرموز</a>. ويمكنك طبعاً استخدام إبداعك أيضاً.</p>
<p><strong>تحذير آخر:</strong> إذا لاحظت أنك تخلط بين async/await واستدعاءات <em>then</em>، فمن المؤكد بنسبة 99% أنك ترتكب خطأً ما. استخدم أحد الأسلوبين فقط، ولا تجمعهما أبداً.</p>
<h4 id="415-توسيع-قائمة-المدونات-الخطوة-3">4.15: توسيع قائمة المدونات، الخطوة 3</h4>
<p>نفّذ طريقة لإنشاء مستخدمين جدد بإجراء طلب HTTP POST إلى العنوان <i>api/users</i>. وللمستخدمين <i>username و password و name</i>.</p>
<p>لا تحفظ كلمات المرور في قاعدة البيانات كنص صريح، بل استخدم مكتبة <i>bcrypt</i> كما فعلنا في فصل <a href="/part4/user_administration#creating-users">إنشاء المستخدمين</a> من الجزء 4.</p>
<p><strong>ملاحظة</strong> واجه بعض مستخدمي Windows مشكلات مع <i>bcrypt</i>. إذا صادفت مشكلات، فأزل المكتبة بالأمر</p>
<pre><code class="language-bash">npm uninstall bcrypt 
</code></pre>
<p>وثبّت <a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a> بدلاً منها.</p>
<p>نفّذ طريقة لعرض تفاصيل جميع المستخدمين بإجراء طلب HTTP مناسب.</p>
<p>يمكن أن تبدو قائمة المستخدمين، على سبيل المثال، كما يلي:</p>
<p><img src="/images/content/4/22.webp" alt="واجهة المتصفح api/users تعرض بيانات JSON لمستخدمين اثنين"></p>
<h4 id="416-توسيع-قائمة-المدونات-الخطوة-4">4.16*: توسيع قائمة المدونات، الخطوة 4</h4>
<p>أضف ميزة تفرض القيود التالية على إنشاء المستخدمين الجدد: يجب إعطاء اسم المستخدم وكلمة المرور معاً، ويجب أن يتكوّن كل منهما من 3 أحرف على الأقل. ويجب أن يكون اسم المستخدم فريداً.</p>
<p>يجب أن تستجيب العملية برمز حالة مناسب ورسالة خطأ من نوع ما إذا أُنشئ مستخدم غير صالح.</p>
<p><strong>ملاحظة</strong> لا تختبر قيود كلمة المرور بتحققات Mongoose. فهذه ليست فكرة جيدة لأن كلمة المرور التي تستقبلها الواجهة الخلفية وتجزئة كلمة المرور المحفوظة في قاعدة البيانات ليسا الشيء نفسه. ينبغي التحقق من طول كلمة المرور في المتحكم كما فعلنا في <a href="/part3/validation_and_es_lint">الجزء 3</a> قبل استخدام تحقق Mongoose.</p>
<p>كما <strong>نفّذ اختبارات</strong> تضمن عدم إنشاء مستخدمين غير صالحين، وأن عملية إضافة مستخدم غير صالحة تعيد رمز حالة ورسالة خطأ مناسبين.</p>
<p><strong>ملاحظة</strong> إذا قررت تعريف الاختبارات في ملفات متعددة، فينبغي أن تعلم أن كل ملف اختبار يُنفَّذ افتراضياً في عملية خاصة به (انظر <em>نموذج تنفيذ الاختبارات</em> في <a href="https://nodejs.org/api/test.html#test-runner-execution-model">التوثيق</a>). ونتيجة ذلك أن ملفات الاختبار المختلفة تُنفَّذ في الوقت نفسه. ولأن الاختبارات تتشارك قاعدة البيانات نفسها، فقد يسبب التنفيذ المتزامن مشكلات، يمكن تجنّبها بتنفيذ الاختبارات بالخيار <em>--test-concurrency=1</em>، أي تعريفها لتُنفَّذ تسلسلياً.</p>
<h4 id="417-توسيع-قائمة-المدونات-الخطوة-5">4.17: توسيع قائمة المدونات، الخطوة 5</h4>
<p>وسّع المدونات بحيث تحتوي كل مدونة على معلومات عن منشئ المدونة.</p>
<p>عدّل إضافة المدونات الجديدة بحيث يُعيَّن <i>أي</i> مستخدم من قاعدة البيانات منشئاً للمدونة عند إنشائها (مثلاً أول مستخدم يُعثر عليه). نفّذ هذا وفق فصل <a href="/part4/user_administration#populate">populate</a> من الجزء 4.
ولا يهم حتى الآن أي مستخدم يُعيَّن منشئاً. وستكتمل الوظيفة في التمرين 4.19.</p>
<p>عدّل عرض جميع المدونات بحيث تُعرض معلومات المستخدم المنشئ مع المدونة:</p>
<p><img src="/images/content/4/23e.webp" alt="api/blogs يدمج معلومات المستخدم المنشئ في بيانات JSON"></p>
<p>كما يعرض عرض جميع المستخدمين المدونات التي أنشأها كل مستخدم:</p>
<p><img src="/images/content/4/24e.webp" alt="api/users يدمج المدونات في بيانات JSON"></p>
<h4 id="418-توسيع-قائمة-المدونات-الخطوة-6">4.18: توسيع قائمة المدونات، الخطوة 6</h4>
<p>نفّذ المصادقة القائمة على الرموز وفق فصل <a href="/part4/token_authentication">المصادقة بالرموز</a> من الجزء 4.</p>
<h4 id="419-توسيع-قائمة-المدونات-الخطوة-7">4.19: توسيع قائمة المدونات، الخطوة 7</h4>
<p>عدّل إضافة المدونات الجديدة بحيث لا تصبح ممكنة إلا إذا أُرسل رمز صالح مع طلب HTTP POST. ويُعيَّن المستخدم الذي يعرّفه الرمز منشئاً للمدونة.</p>
<h4 id="420-توسيع-قائمة-المدونات-الخطوة-8">4.20*: توسيع قائمة المدونات، الخطوة 8</h4>
<p><a href="/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users">هذا المثال</a> من الجزء 4 يعرض أخذ الرمز من الترويسة بالدالة المساعدة <em>getTokenFrom</em> في <i>controllers/blogs.js</i>.</p>
<p>إذا استخدمت الحل نفسه، فأعد هيكلة أخذ الرمز إلى <a href="/part3/node_js_and_express#middleware">وسيط</a>. وينبغي أن يأخذ الوسيط الرمز من ترويسة <i>Authorization</i> ويسنده إلى الحقل <i>token</i> في كائن <i>request</i>.</p>
<p>بعبارة أخرى، إذا سجّلت هذا الوسيط في الملف <i>app.js</i> قبل جميع المسارات</p>
<pre><code class="language-js">app.<span class="hljs-title function_">use</span>(middleware.<span class="hljs-property">tokenExtractor</span>)
</code></pre>
<p>يمكن للمسارات الوصول إلى الرمز عبر <em>request.token</em>:</p>
<pre><code class="language-js">blogsRouter.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-comment">// ..</span>
  <span class="hljs-keyword">const</span> decodedToken = jwt.<span class="hljs-title function_">verify</span>(request.<span class="hljs-property">token</span>, process.<span class="hljs-property">env</span>.<span class="hljs-property">SECRET</span>)
  <span class="hljs-comment">// ..</span>
})
</code></pre>
<p>تذكّر أن <a href="/part3/node_js_and_express#middleware">دالة الوسيط</a> العادية دالة بثلاثة معاملات، تستدعي في النهاية المعامل الأخير <i>next</i> لنقل التحكم إلى الوسيط التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">tokenExtractor</span> = (<span class="hljs-params">request, response, next</span>) =&gt; {
  <span class="hljs-comment">// شيفرة تستخرج الرمز</span>

  <span class="hljs-title function_">next</span>()
}
</code></pre>
<h4 id="421-توسيع-قائمة-المدونات-الخطوة-9">4.21*: توسيع قائمة المدونات، الخطوة 9</h4>
<p>غيّر عملية حذف المدونة بحيث لا يمكن حذف المدونة إلا للمستخدم الذي أضافها. لذا لا يصبح حذف المدونة ممكناً إلا إذا كان الرمز المُرسَل مع الطلب هو نفسه رمز منشئ المدونة.</p>
<p>إذا جرت محاولة حذف مدونة دون رمز أو بمستخدم غير صالح، فينبغي أن تعيد العملية رمز حالة مناسباً.</p>
<p>لاحظ أنه إذا جلبت مدونة من قاعدة البيانات،</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> blog = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Blog</span>.<span class="hljs-title function_">findById</span>(...)
</code></pre>
<p>فإن الحقل <i>blog.user</i> لا يحتوي نصاً، بل كائناً. لذا إذا أردت مقارنة معرّف الكائن المجلوب من قاعدة البيانات بمعرّف نصي، فلن تنجح عملية مقارنة عادية. ويجب أولاً تحويل المعرّف المجلوب من قاعدة البيانات إلى نص.</p>
<pre><code class="language-js"><span class="hljs-keyword">if</span> ( blog.<span class="hljs-property">user</span>.<span class="hljs-title function_">toString</span>() === userid.<span class="hljs-title function_">toString</span>() ) ...
</code></pre>
<h4 id="422-توسيع-قائمة-المدونات-الخطوة-10">4.22*: توسيع قائمة المدونات، الخطوة 10</h4>
<p>يحتاج كل من إنشاء مدونة جديدة وحذف مدونة إلى معرفة هوية المستخدم الذي يجري العملية. والوسيط <em>tokenExtractor</em> الذي أنشأناه في التمرين 4.20 يساعد، لكن ما يزال على كل من معالجي عمليتي <i>post</i> و<i>delete</i> معرفة من هو المستخدم الحامل لرمز معين.</p>
<p>أنشئ الآن وسيطاً جديداً باسم userExtractor يحدد المستخدم المرتبط بالطلب ويرفقه بكائن الطلب. وبعد تسجيل الوسيط، ينبغي أن يتمكن معالجا post و delete من الوصول إلى المستخدم مباشرةً بالرجوع إلى request.user:</p>
<pre><code class="language-js">blogsRouter.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, userExtractor, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-comment">// احصل على المستخدم من كائن الطلب</span>
  <span class="hljs-keyword">const</span> user = request.<span class="hljs-property">user</span>
  <span class="hljs-comment">// ..</span>
})

blogsRouter.<span class="hljs-title function_">delete</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, userExtractor, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-comment">// احصل على المستخدم من كائن الطلب</span>
  <span class="hljs-keyword">const</span> user = request.<span class="hljs-property">user</span>
  <span class="hljs-comment">// ..</span>
})
</code></pre>
<p>لاحظ أن وسيط userExtractor سُجِّل في هذه الحالة مع مسارات فردية، لذا لا يُنفَّذ إلا في حالات معينة. فبدلاً من استخدام <em>userExtractor</em> مع جميع المسارات،</p>
<pre><code class="language-js"><span class="hljs-comment">// استخدم الوسيط في جميع المسارات</span>
app.<span class="hljs-title function_">use</span>(middleware.<span class="hljs-property">userExtractor</span>) <span class="hljs-comment">// highlight-line</span>

app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/blogs&#x27;</span>, blogsRouter)  
app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/users&#x27;</span>, usersRouter)
app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/login&#x27;</span>, loginRouter)
</code></pre>
<p>يمكننا تسجيله بحيث لا يُنفَّذ إلا مع مسارات <i>/api/blogs</i>:</p>
<pre><code class="language-js"><span class="hljs-comment">// استخدم الوسيط فقط في مسارات /api/blogs</span>
app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/blogs&#x27;</span>, middleware.<span class="hljs-property">userExtractor</span>, blogsRouter) <span class="hljs-comment">// highlight-line</span>
app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/users&#x27;</span>, usersRouter)
app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/login&#x27;</span>, loginRouter)
</code></pre>
<p>ويُفعل هذا بربط دوال وسيط متعددة كمعاملات للدالة <i>use</i>. وبالطريقة نفسها، يمكن أيضاً تسجيل الوسيط لمسارات فردية فقط:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, userExtractor, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-comment">// ...</span>
})
</code></pre>
<p>تأكد من أن جلب جميع المدونات بطلب GET ما يزال يعمل دون رمز.</p>
<h4 id="423-توسيع-قائمة-المدونات-الخطوة-11">4.23*: توسيع قائمة المدونات، الخطوة 11</h4>
<p>بعد إضافة المصادقة القائمة على الرموز تعطّلت اختبارات إضافة مدونة جديدة. أصلحها. واكتب أيضاً اختباراً جديداً يضمن فشل إضافة مدونة برمز الحالة المناسب <i>401 Unauthorized</i> إذا لم يُقدَّم رمز.</p>
<p>من المرجح أن يكون <a href="https://github.com/visionmedia/supertest/issues/398">هذا</a> مفيداً عند إجراء الإصلاح.</p>
<p>هذا هو التمرين الأخير في هذا الجزء من الدورة، وقد حان وقت دفع شيفرتك إلى GitHub وتعليم جميع تمارينك المنجزة في <a href="https://studies.cs.helsinki.fi/stats/courses/fullstackopen">نظام إرسال التمارين</a>.</p>
</div>
`,o={part:4,letter:"d",file:s,title:n,slug:a,mainImage:p,headings:e,html:l};export{o as default,s as file,e as headings,l as html,r as letter,p as mainImage,t as part,a as slug,n as title};
