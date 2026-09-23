const e=3,r="d",s="part3d.md",n="التحقق من الصحة وESLint",a="validation_and_es_lint",p="/images/part-3.svg",l=[{depth:3,id:"نشر-الواجهة-الخلفية-لقاعدة-البيانات-إلى-الإنتاج",text:"نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج"},{depth:3,id:"تمارين-319-321",text:"تمارين 3.19.-3.21."},{depth:3,id:"lint",text:"Lint"},{depth:3,id:"تنسيق-ملف-الإعداد",text:"تنسيق ملف الإعداد"},{depth:3,id:"تشغيل-أداة-lint",text:"تشغيل أداة lint"},{depth:3,id:"إضافة-المزيد-من-قواعد-الأسلوب",text:"إضافة المزيد من قواعد الأسلوب"},{depth:3,id:"تمرين-322",text:"تمرين 3.22."}],t=`<div class="content">
<p>عادةً ما تكون هناك قيود نريد تطبيقها على البيانات المخزّنة في قاعدة بيانات تطبيقنا. لا ينبغي أن يقبل تطبيقنا ملاحظات تمتلك خاصية <i>content</i> مفقودة أو فارغة. يُتحقق من صلاحية الملاحظة في معالج المسار:</p>
<pre><code class="language-js">app.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/api/notes&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">request, response</span>) =&gt;</span> {
  <span class="hljs-keyword">const</span> body = request.<span class="hljs-property">body</span>
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">if</span> (!body.<span class="hljs-property">content</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;content missing&#x27;</span> })
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>
})
</code></pre>
<p>إذا لم تمتلك الملاحظة خاصية <i>content</i>، نستجيب للطلب برمز الحالة <i>400 bad request</i>.</p>
<p>من الطرق الأذكى للتحقق من صيغة البيانات قبل تخزينها في قاعدة البيانات استخدام وظيفة <a href="https://mongoosejs.com/docs/validation.html">التحقق</a> المتاحة في Mongoose.</p>
<p>يمكننا تعريف قواعد تحقق محددة لكل حقل في المخطط:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> noteSchema = <span class="hljs-keyword">new</span> mongoose.<span class="hljs-title class_">Schema</span>({
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-attr">content</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">minLength</span>: <span class="hljs-number">5</span>,
    <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-comment">// highlight-end</span>
  <span class="hljs-attr">important</span>: <span class="hljs-title class_">Boolean</span>
})
</code></pre>
<p>أصبح حقل <i>content</i> الآن مطلوباً أن يكون طوله خمسة أحرف على الأقل، وقد ضُبط كحقل مطلوب، أي أنه لا يمكن أن يكون مفقوداً. لم نضف أي قيود على حقل <i>important</i>، لذا لم يتغير تعريفه في المخطط.</p>
<p>المتحققان <i>minLength</i> و<i>required</i> <a href="https://mongoosejs.com/docs/validation.html#built-in-validators">مدمجان</a> وتوفرهما Mongoose. تتيح لنا وظيفة <a href="https://mongoosejs.com/docs/validation.html#custom-validators">المتحقق المخصص</a> في Mongoose إنشاء متحققين جدد إذا لم يغطِّ أي من المتحققين المدمجين احتياجاتنا.</p>
<p>إذا حاولنا تخزين كائن في قاعدة البيانات يخالف أحد القيود، فسترمي العملية استثناءً. لنغيّر معالج إنشاء ملاحظة جديدة بحيث يمرّر أي استثناءات محتملة إلى الوسيط معالج الأخطاء:</p>
<pre><code class="language-js">app.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/api/notes&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">request, response, next</span>) =&gt;</span> { <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> body = request.<span class="hljs-property">body</span>

  <span class="hljs-keyword">const</span> note = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Note</span>({
    <span class="hljs-attr">content</span>: body.<span class="hljs-property">content</span>,
    <span class="hljs-attr">important</span>: body.<span class="hljs-property">important</span> || <span class="hljs-literal">false</span>,
  })

  note.<span class="hljs-title function_">save</span>()
    .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">savedNote</span> =&gt;</span> {
      response.<span class="hljs-title function_">json</span>(savedNote)
    })
    .<span class="hljs-title function_">catch</span>(<span class="hljs-function"><span class="hljs-params">error</span> =&gt;</span> <span class="hljs-title function_">next</span>(error)) <span class="hljs-comment">// highlight-line</span>
})
</code></pre>
<p>لنوسّع معالج الأخطاء ليتعامل مع أخطاء التحقق هذه:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">errorHandler</span> = (<span class="hljs-params">error, request, response, next</span>) =&gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error.<span class="hljs-property">message</span>)

  <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;CastError&#x27;</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;malformatted id&#x27;</span> })
  } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (error.<span class="hljs-property">name</span> === <span class="hljs-string">&#x27;ValidationError&#x27;</span>) { <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">message</span> }) <span class="hljs-comment">// highlight-line</span>
  }

  <span class="hljs-title function_">next</span>(error)
}
</code></pre>
<p>عندما يفشل التحقق من كائن، نعيد رسالة الخطأ الافتراضية التالية من Mongoose:</p>
<p><img src="/images/content/3/50.webp" alt="postman يعرض رسالة خطأ"></p>
<h3 id="نشر-الواجهة-الخلفية-لقاعدة-البيانات-إلى-الإنتاج">نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج</h3>
<p>ينبغي أن يعمل التطبيق كما هو تقريباً على Fly.io/Render. لا نحتاج إلى توليد بناء إنتاجي جديد للواجهة الأمامية لأن التغييرات حتى الآن كانت على واجهتنا الخلفية فقط.</p>
<p>لن تُستخدم متغيرات البيئة المعرّفة في dotenv إلا عندما لا تكون الواجهة الخلفية في <i>وضع الإنتاج</i>، أي Fly.io أو Render.</p>
<p>في الإنتاج، علينا ضبط رابط قاعدة البيانات في الخدمة التي تستضيف تطبيقنا.</p>
<p>في Fly.io يتم ذلك بالأمر <em>fly secrets set</em>:</p>
<pre><code class="language-bash">fly secrets <span class="hljs-built_in">set</span> MONGODB_URI=<span class="hljs-string">&#x27;mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&amp;w=majority&#x27;</span>
</code></pre>
<p>أثناء تطوير التطبيق، من المرجح جداً أن يفشل شيء ما. مثلاً، عندما نشرت تطبيقي لأول مرة مع قاعدة البيانات، لم تظهر أي ملاحظة على الإطلاق:</p>
<p><img src="/images/content/3/fly-problem1.webp" alt="متصفح لا تظهر فيه أي ملاحظات"></p>
<p>كشف تبويب الشبكة في وحدة تحكم المتصفح أن جلب الملاحظات لم ينجح، فقد بقي الطلب مدة طويلة في حالة <em>pending</em> حتى فشل برمز الحالة 502.</p>
<p>يجب أن تبقى وحدة تحكم المتصفح مفتوحة <i>طوال الوقت!</i></p>
<p>من الضروري أيضاً متابعة سجلات الخادم باستمرار. أصبحت المشكلة واضحة عندما فُتحت السجلات بالأمر <em>fly logs</em>:</p>
<p><img src="/images/content/3/fly-problem3.webp" alt="سجل خادم fly.io يظهر الاتصال بـ undefined"></p>
<p>كان رابط قاعدة البيانات <em>undefined</em>، لذا نُسي الأمر <em>fly secrets set MONGODB_URI</em>.</p>
<p>ستحتاج أيضاً إلى إدراج عنوان IP لتطبيق fly.io في القائمة البيضاء لدى MongoDB Atlas. إذا لم تفعل ذلك سترفض MongoDB الاتصال.</p>
<p>للأسف، لا يوفر fly.io عنوان IPv4 مخصصاً لتطبيقك، لذا ستحتاج إلى السماح لجميع عناوين IP في MongoDB Atlas.</p>
<p>عند استخدام Render، يُعطى رابط قاعدة البيانات عبر تعريف متغير البيئة المناسب في لوحة التحكم:</p>
<p><img src="/images/content/3/render-env.webp" alt="لوحة تحكم Render تعرض متغير البيئة MONGODB_URI"></p>
<p>تعرض لوحة تحكم Render سجلات الخادم:</p>
<p><img src="/images/content/3/r7.webp" alt="لوحة تحكم Render مع سهم يشير إلى خادم يعمل على المنفذ 10000"></p>
<p>يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-6</i> من <a href="https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6">مستودع GitHub هذا</a>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-319-321">تمارين 3.19.-3.21.</h3>
<h4 id="319-قاعدة-بيانات-دليل-الهاتف-الخطوة-7">3.19*: قاعدة بيانات دليل الهاتف، الخطوة 7</h4>
<p>وسّع التحقق بحيث يجب أن يكون الاسم المخزّن في قاعدة البيانات طوله ثلاثة أحرف على الأقل.</p>
<p>وسّع الواجهة الأمامية بحيث تعرض شكلاً من أشكال رسالة الخطأ عند حدوث خطأ تحقق. يمكن تنفيذ معالجة الأخطاء بإضافة كتلة <em>catch</em> كما هو موضح أدناه:</p>
<pre><code class="language-js">personService
    .<span class="hljs-title function_">create</span>({ ... })
    .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">createdPerson</span> =&gt;</span> {
      <span class="hljs-comment">// ...</span>
    })
    .<span class="hljs-title function_">catch</span>(<span class="hljs-function"><span class="hljs-params">error</span> =&gt;</span> {
      <span class="hljs-comment">// هذه هي طريقة الوصول إلى رسالة الخطأ</span>
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(error.<span class="hljs-property">response</span>.<span class="hljs-property">data</span>.<span class="hljs-property">error</span>)
    })
</code></pre>
<p>يمكنك عرض رسالة الخطأ الافتراضية التي تعيدها Mongoose، حتى وإن لم تكن مقروءة كما ينبغي:</p>
<p><img src="/images/content/3/56e.webp" alt="لقطة شاشة لدليل الهاتف تظهر فشل التحقق من شخص"></p>
<p><strong>ملاحظة:</strong> في عمليات التحديث، تكون أدوات التحقق في mongoose معطّلة افتراضياً. <a href="https://mongoosejs.com/docs/validation.html">اقرأ الوثائق</a> لمعرفة كيفية تفعيلها.</p>
<h4 id="320-قاعدة-بيانات-دليل-الهاتف-الخطوة-8">3.20*: قاعدة بيانات دليل الهاتف، الخطوة 8</h4>
<p>أضف تحققاً إلى تطبيق دليل الهاتف لديك، يضمن أن أرقام الهاتف بالصيغة الصحيحة. يجب أن يكون رقم الهاتف:</p>
<ul>
<li>طوله 8 أو أكثر</li>
<li>مكوّناً من جزأين يفصل بينهما شرطة -، الجزء الأول يحتوي على رقمين أو ثلاثة أرقام والجزء الثاني يتكون أيضاً من أرقام
<ul>
<li>مثلاً 09-1234556 و040-22334455 أرقام هاتف صحيحة</li>
<li>مثلاً 1234556 و1-22334455 و10-22-334455 غير صحيحة</li>
</ul>
</li>
</ul>
<p>استخدم <a href="https://mongoosejs.com/docs/validation.html#custom-validators">متحققاً مخصصاً</a> لتنفيذ الجزء الثاني من التحقق.</p>
<p>إذا حاول طلب HTTP POST إضافة شخص برقم هاتف غير صحيح، فينبغي أن يستجيب الخادم برمز حالة ورسالة خطأ مناسبتين.</p>
<h4 id="321-نشر-الواجهة-الخلفية-لقاعدة-البيانات-إلى-الإنتاج">3.21 نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج</h4>
<p>أنشئ نسخة &quot;full stack&quot; جديدة من التطبيق عبر إنشاء بناء إنتاجي جديد للواجهة الأمامية، ونسخه إلى مجلد الواجهة الخلفية. تحقق من أن كل شيء يعمل محلياً باستخدام التطبيق بالكامل من العنوان <a href="http://localhost:3001/">http://localhost:3001/</a>.</p>
<p>ادفع أحدث نسخة إلى Fly.io/Render وتحقق من أن كل شيء يعمل هناك أيضاً.</p>
<p><strong>ملاحظة:</strong> لن تنشر الواجهة الأمامية مباشرة في أي مرحلة من هذا الجزء. لا يُنشر سوى مستودع الواجهة الخلفية طوال هذا الجزء بأكمله. يُضاف البناء الإنتاجي للواجهة الأمامية إلى مستودع الواجهة الخلفية، وتقدّمه الواجهة الخلفية كما هو موضح في قسم <a href="/part3/deploying_app_to_internet#serving-static-files-from-the-backend">تقديم الملفات الثابتة من الواجهة الخلفية</a>.</p>
</div>
<div class="content">
<h3 id="lint">Lint</h3>
<p>قبل أن ننتقل إلى الجزء التالي، سنلقي نظرة على أداة مهمة تُسمى <a href="https://en.wikipedia.org/wiki/Lint_(software)">lint</a>. تقول ويكيبيديا ما يلي عن lint:</p>
<blockquote>
<p><i>بشكل عام، lint أو linter هي أي أداة تكتشف الأخطاء في لغات البرمجة وتشير إليها، بما في ذلك الأخطاء الأسلوبية. يُطلق مصطلح السلوك الشبيه بـ lint أحياناً على عملية الإشارة إلى الاستخدام المشبوه للغة. وعموماً تُجري الأدوات الشبيهة بـ lint تحليلاً ساكناً للشيفرة المصدرية.</i></p>
</blockquote>
<p>في اللغات المُصرَّفة ذات الأنواع الساكنة مثل Java، يمكن لبيئات التطوير المتكاملة مثل NetBeans الإشارة إلى الأخطاء في الشيفرة، حتى تلك التي تتجاوز مجرد أخطاء التصريف. ويمكن استخدام أدوات إضافية لإجراء <a href="https://en.wikipedia.org/wiki/Static_program_analysis">التحليل الساكن</a> مثل <a href="https://checkstyle.sourceforge.io">checkstyle</a>، لتوسيع قدرات بيئة التطوير بحيث تشير أيضاً إلى المشكلات المتعلقة بالأسلوب، مثل الإزاحة.</p>
<p>في عالم JavaScript، الأداة الرائدة حالياً للتحليل الساكن (المعروف أيضاً بـ &quot;linting&quot;) هي <a href="https://eslint.org/">ESLint</a>.</p>
<p>لنضف ESLint كـ <i>اعتمادية تطوير</i> للواجهة الخلفية. اعتماديات التطوير هي أدوات لا تلزم إلا أثناء تطوير التطبيق. على سبيل المثال، الأدوات المتعلقة بالاختبار هي من هذه الاعتماديات. عندما يعمل التطبيق في وضع الإنتاج، لا تكون اعتماديات التطوير مطلوبة.</p>
<p>ثبّت ESLint كاعتمادية تطوير للواجهة الخلفية بالأمر:</p>
<pre><code class="language-bash">npm install eslint @eslint/js --save-dev
</code></pre>
<p>سيتغير محتوى ملف package.json كما يلي:</p>
<pre><code class="language-js">{
  <span class="hljs-comment">//...</span>
  <span class="hljs-string">&quot;dependencies&quot;</span>: {
    <span class="hljs-string">&quot;dotenv&quot;</span>: <span class="hljs-string">&quot;^16.4.7&quot;</span>,
    <span class="hljs-string">&quot;express&quot;</span>: <span class="hljs-string">&quot;^5.1.0&quot;</span>,
    <span class="hljs-string">&quot;mongoose&quot;</span>: <span class="hljs-string">&quot;^8.11.0&quot;</span>
  },
  <span class="hljs-string">&quot;devDependencies&quot;</span>: { <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-string">&quot;@eslint/js&quot;</span>: <span class="hljs-string">&quot;^9.22.0&quot;</span>, <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-string">&quot;eslint&quot;</span>: <span class="hljs-string">&quot;^9.22.0&quot;</span> <span class="hljs-comment">// highlight-line</span>
  }
}
</code></pre>
<p>أضاف الأمر قسم <i>devDependencies</i> إلى الملف وضمّن الحزمتين <i>eslint</i> و<i>@eslint/js</i>، وثبّت المكتبات المطلوبة في مجلد <i>node_modules</i>.</p>
<p>بعد ذلك يمكننا تهيئة إعداد افتراضي لـ ESLint بالأمر:</p>
<pre><code class="language-bash">npx eslint --init
</code></pre>
<p>سنجيب عن جميع الأسئلة:</p>
<p><img src="/images/content/3/lint1.webp" alt="مخرجات الطرفية من تهيئة ESLint"></p>
<p>سيُحفظ الإعداد في الملف المُنشأ <em>eslint.config.mjs</em>.</p>
<h3 id="تنسيق-ملف-الإعداد">تنسيق ملف الإعداد</h3>
<p>لنُعد تنسيق ملف الإعداد <em>eslint.config.mjs</em> من شكله الحالي إلى ما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> globals <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;globals&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  {
    <span class="hljs-attr">files</span>: [<span class="hljs-string">&#x27;**/*.js&#x27;</span>],
    <span class="hljs-attr">languageOptions</span>: {
      <span class="hljs-attr">sourceType</span>: <span class="hljs-string">&#x27;commonjs&#x27;</span>,
      <span class="hljs-attr">globals</span>: { ...globals.<span class="hljs-property">node</span> },
      <span class="hljs-attr">ecmaVersion</span>: <span class="hljs-string">&#x27;latest&#x27;</span>,
    },
  },
]
</code></pre>
<p>حتى الآن، يعرّف ملف إعداد ESLint لدينا خيار <em>files</em> بالقيمة <em>[&quot;**/*.js&quot;]</em>، ما يخبر ESLint بالنظر في جميع ملفات JavaScript في مجلد مشروعنا. تحدد خاصية <em>languageOptions</em> خيارات متعلقة بميزات اللغة التي ينبغي أن يتوقعها ESLint، وقد عرّفنا فيها خيار <em>sourceType</em> بالقيمة &quot;commonjs&quot;. يشير هذا إلى أن شيفرة JavaScript في مشروعنا تستخدم نظام وحدات CommonJS، ما يسمح لـ ESLint بتحليل الشيفرة وفقاً لذلك.</p>
<p>تحدد خاصية <em>globals</em> المتغيرات العامة المعرّفة مسبقاً. يخبر عامل النشر (spread operator) المطبّق هنا ESLint بتضمين جميع المتغيرات العامة المعرّفة في إعدادات <em>globals.node</em> مثل <em>process</em>. وفي حالة شيفرة المتصفح نعرّف هنا <em>globals.browser</em> للسماح بالمتغيرات العامة الخاصة بالمتصفح مثل <em>window</em> و_document_.</p>
<p>أخيراً، خُصّصت خاصية <em>ecmaVersion</em> بالقيمة &quot;latest&quot;. يضبط هذا إصدار ECMAScript على أحدث إصدار متاح، ما يعني أن ESLint سيفهم أحدث صيغ وميزات JavaScript ويفحصها بشكل صحيح.</p>
<p>نريد الاستفادة من <a href="https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations">إعدادات ESLint الموصى بها</a> إلى جانب إعداداتنا الخاصة. تزوّدنا حزمة <em>@eslint/js</em> التي ثبّتناها سابقاً بإعدادات معرّفة مسبقاً لـ ESLint. سنستوردها ونفعّلها في ملف الإعداد:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> globals <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;globals&#x27;</span>
<span class="hljs-keyword">import</span> js <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eslint/js&#x27;</span> <span class="hljs-comment">// highlight-line</span>
<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  js.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>, <span class="hljs-comment">// highlight-line</span>
  {
    <span class="hljs-comment">// ...</span>
  },
]
</code></pre>
<p>أضفنا <em>js.configs.recommended</em> إلى أعلى مصفوفة الإعداد، وهذا يضمن تطبيق إعدادات ESLint الموصى بها أولاً قبل خياراتنا المخصصة.</p>
<p>لنواصل بناء ملف الإعداد. ثبّت <a href="https://eslint.style/packages/js">إضافة</a> تعرّف مجموعة من القواعد المتعلقة بأسلوب الشيفرة:</p>
<pre><code class="language-bash">npm install --save-dev @stylistic/eslint-plugin
</code></pre>
<p>استورد الإضافة وفعّلها، وأضف قواعد أسلوب الشيفرة الأربع هذه:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> globals <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;globals&#x27;</span>
<span class="hljs-keyword">import</span> js <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eslint/js&#x27;</span>
<span class="hljs-keyword">import</span> stylisticJs <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@stylistic/eslint-plugin&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  {
    <span class="hljs-comment">// ...</span>
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-attr">plugins</span>: { 
      <span class="hljs-string">&#x27;@stylistic/js&#x27;</span>: stylisticJs,
    },
    <span class="hljs-attr">rules</span>: { 
      <span class="hljs-string">&#x27;@stylistic/js/indent&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-number">2</span>],
      <span class="hljs-string">&#x27;@stylistic/js/linebreak-style&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;unix&#x27;</span>],
      <span class="hljs-string">&#x27;@stylistic/js/quotes&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;single&#x27;</span>],
      <span class="hljs-string">&#x27;@stylistic/js/semi&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;never&#x27;</span>],
    }, 
    <span class="hljs-comment">// highlight-end</span>
  },
]
</code></pre>
<p>توفر خاصية <a href="https://eslint.org/docs/latest/use/configure/plugins">plugins</a> طريقة لتوسيع وظائف ESLint عبر إضافة قواعد وإعدادات وقدرات أخرى مخصصة غير متاحة في مكتبة ESLint الأساسية. ثبّتنا وفعّلنا <em>@stylistic/eslint-plugin</em>، الذي يضيف قواعد أسلوبية لـ JavaScript إلى ESLint. بالإضافة إلى ذلك، أُضيفت قواعد للإزاحة وفواصل الأسطر والعلامات التنصيصية والفواصل المنقوطة. جميع هذه القواعد الأربع معرّفة في <a href="https://eslint.style/packages/js">إضافة أنماط ESLint</a>.</p>
<p><strong>ملاحظة لمستخدمي Windows:</strong> ضُبط نمط فواصل الأسطر على <em>unix</em> في قواعد الأسلوب. يُوصى باستخدام فواصل أسطر بنمط Unix (<em>\\n</em>) بغض النظر عن نظام التشغيل لديك، لأنها متوافقة مع معظم أنظمة التشغيل الحديثة وتسهّل التعاون عندما يعمل عدة أشخاص على الملفات نفسها. إذا كنت تستخدم فواصل أسطر بنمط Windows، فسينتج ESLint الأخطاء التالية: <i>Expected linebreaks to be 'LF' but found 'CRLF'</i>. في هذه الحالة، اضبط Visual Studio Code لاستخدام فواصل أسطر بنمط Unix باتباع <a href="https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix">هذا الدليل</a>.</p>
<h3 id="تشغيل-أداة-lint">تشغيل أداة lint</h3>
<p>يمكن فحص ملف مثل <em>index.js</em> والتحقق منه بالأمر التالي:</p>
<pre><code class="language-bash">npx eslint index.js
</code></pre>
<p>يُوصى بإنشاء <em>سكربت npm</em> منفصل لعملية lint:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;start&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node index.js&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node --watch index.js&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;test&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;echo \\&quot;Error: no test specified\\&quot; &amp;&amp; exit 1&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;lint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;eslint .&quot;</span> <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-comment">// ...</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ...</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>الآن سيفحص الأمر <em>npm run lint</em> كل ملف في المشروع.</p>
<p>تُفحص أيضاً الملفات الموجودة في مجلد <em>dist</em> عند تشغيل الأمر. لا نريد أن يحدث هذا، ويمكننا تحقيق ذلك بإضافة كائن يحمل خاصية <a href="https://eslint.org/docs/latest/use/configure/ignore">ignores</a> التي تحدد مصفوفة بالمجلدات والملفات التي نريد تجاهلها.</p>
<pre><code class="language-js"><span class="hljs-comment">// ...</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  js.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>,
  {
    <span class="hljs-attr">files</span>: [<span class="hljs-string">&#x27;**/*.js&#x27;</span>],
    <span class="hljs-comment">// ...</span>
  },
  <span class="hljs-comment">// highlight-start</span>
  { 
    <span class="hljs-attr">ignores</span>: [<span class="hljs-string">&#x27;dist/**&#x27;</span>], 
  },
  <span class="hljs-comment">// highlight-end</span>
]
</code></pre>
<p>يؤدي هذا إلى عدم فحص مجلد <em>dist</em> بأكمله بواسطة ESLint.</p>
<p>لدى lint الكثير لتقوله عن شيفرتنا:</p>
<p><img src="/images/content/3/53ea.webp" alt="مخرجات الطرفية لأخطاء ESLint"></p>
<p>بديل أفضل من تنفيذ أداة lint من سطر الأوامر هو ضبط <em>eslint-plugin</em> في المحرر، يعمل على تشغيل أداة lint باستمرار. باستخدام الإضافة سترى الأخطاء في شيفرتك فوراً. يمكنك العثور على مزيد من المعلومات عن إضافة ESLint لـ Visual Studio <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint">هنا</a>.</p>
<p>ستضع إضافة ESLint لـ VS Code خطاً أحمر تحت مخالفات الأسلوب:</p>
<p><img src="/images/content/3/54a.webp" alt="لقطة شاشة لإضافة ESLint في vscode تظهر الأخطاء"></p>
<p>هذا يجعل اكتشاف الأخطاء وإصلاحها فوراً أمراً سهلاً.</p>
<h3 id="إضافة-المزيد-من-قواعد-الأسلوب">إضافة المزيد من قواعد الأسلوب</h3>
<p>لدى ESLint مجموعة واسعة من <a href="https://eslint.org/docs/rules/">القواعد</a> يسهل الأخذ بها عبر تعديل ملف <em>eslint.config.mjs</em>.</p>
<p>لنضف قاعدة <a href="https://eslint.org/docs/rules/eqeqeq">eqeqeq</a> التي تحذرنا إذا فُحصت المساواة بأي شيء غير المعامل الثلاثي يساوي. تُضاف القاعدة تحت حقل rules في ملف الإعداد.</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">rules</span>: {
    <span class="hljs-comment">// ...</span>
   <span class="hljs-attr">eqeqeq</span>: <span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-comment">// highlight-line</span>
  },
  <span class="hljs-comment">// ...</span>
]
</code></pre>
<p>وبينما نحن في هذا السياق، لنجرِ بعض التغييرات الأخرى على القواعد.</p>
<p>لنمنع <a href="https://eslint.style/rules/no-trailing-spaces">المسافات الزائدة</a> غير الضرورية في نهايات الأسطر، ونطلب أن <a href="https://eslint.style/rules/object-curly-spacing">تكون هناك دائماً مسافة قبل الأقواس المعقوفة وبعدها</a>، ونطالب أيضاً باستخدام متسق للمسافات البيضاء في معاملات دوال السهم.</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">rules</span>: {
    <span class="hljs-comment">// ...</span>
    <span class="hljs-attr">eqeqeq</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;no-trailing-spaces&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
    <span class="hljs-string">&#x27;object-curly-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;always&#x27;</span>],
    <span class="hljs-string">&#x27;arrow-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, { <span class="hljs-attr">before</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">after</span>: <span class="hljs-literal">true</span> }],
    <span class="hljs-comment">// highlight-end</span>
  },
]
</code></pre>
<p>يأخذ إعدادنا الافتراضي مجموعة من القواعد المعرّفة مسبقاً من:</p>
<pre><code class="language-js"><span class="hljs-comment">// ...</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  js.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>,
  <span class="hljs-comment">// ...</span>
]
</code></pre>
<p>يتضمن هذا قاعدة تحذر بشأن أوامر <em>console.log</em> التي لا نريد استخدامها. يمكن تعطيل قاعدة بتعريف &quot;قيمتها&quot; على أنها 0 أو <em>off</em> في ملف الإعداد. لنفعل هذا بقاعدة <em>no-console</em> في الوقت الحالي.</p>
<pre><code class="language-js">[
  {
    <span class="hljs-comment">// ...</span>
    <span class="hljs-attr">rules</span>: {
      <span class="hljs-comment">// ...</span>
      <span class="hljs-attr">eqeqeq</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;no-trailing-spaces&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;object-curly-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;always&#x27;</span>],
      <span class="hljs-string">&#x27;arrow-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, { <span class="hljs-attr">before</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">after</span>: <span class="hljs-literal">true</span> }],
      <span class="hljs-string">&#x27;no-console&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>, <span class="hljs-comment">// highlight-line</span>
    },
  },
]
</code></pre>
<p>سيسمح لنا تعطيل قاعدة no-console باستخدام عبارات console.log دون أن يشير إليها ESLint كمشكلات. يمكن أن يكون هذا مفيداً بشكل خاص أثناء التطوير عندما تحتاج إلى تصحيح أخطاء شيفرتك. إليك ملف الإعداد الكامل مع جميع التغييرات التي أجريناها حتى الآن:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> globals <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;globals&#x27;</span>
<span class="hljs-keyword">import</span> js <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eslint/js&#x27;</span>
<span class="hljs-keyword">import</span> stylisticJs <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@stylistic/eslint-plugin&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  js.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>,
  {
    <span class="hljs-attr">files</span>: [<span class="hljs-string">&#x27;**/*.js&#x27;</span>],
    <span class="hljs-attr">languageOptions</span>: {
      <span class="hljs-attr">sourceType</span>: <span class="hljs-string">&#x27;commonjs&#x27;</span>,
      <span class="hljs-attr">globals</span>: { ...globals.<span class="hljs-property">node</span> },
      <span class="hljs-attr">ecmaVersion</span>: <span class="hljs-string">&#x27;latest&#x27;</span>,
    },
    <span class="hljs-attr">plugins</span>: {
      <span class="hljs-string">&#x27;@stylistic/js&#x27;</span>: stylisticJs,
    },
    <span class="hljs-attr">rules</span>: {
      <span class="hljs-string">&#x27;@stylistic/js/indent&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-number">2</span>],
      <span class="hljs-string">&#x27;@stylistic/js/linebreak-style&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;unix&#x27;</span>],
      <span class="hljs-string">&#x27;@stylistic/js/quotes&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;single&#x27;</span>],
      <span class="hljs-string">&#x27;@stylistic/js/semi&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;never&#x27;</span>],
      <span class="hljs-attr">eqeqeq</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;no-trailing-spaces&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;object-curly-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;always&#x27;</span>],
      <span class="hljs-string">&#x27;arrow-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, { <span class="hljs-attr">before</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">after</span>: <span class="hljs-literal">true</span> }],
      <span class="hljs-string">&#x27;no-console&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>,
    },
  },
  {
    <span class="hljs-attr">ignores</span>: [<span class="hljs-string">&#x27;dist/**&#x27;</span>],
  },
]
</code></pre>
<p><strong>ملاحظة</strong> عندما تجري تغييرات على ملف <em>eslint.config.mjs</em>، يُوصى بتشغيل أداة lint من سطر الأوامر. سيتحقق هذا من أن ملف الإعداد منسّق بشكل صحيح:</p>
<p><img src="/images/content/3/lint2.webp" alt="مخرجات الطرفية من npm run lint"></p>
<p>إذا كان هناك خطأ ما في ملف إعدادك، فقد تتصرف إضافة lint بشكل غير منتظم تماماً.</p>
<p>تعرّف كثير من الشركات معايير للبرمجة تُفرض في جميع أنحاء المؤسسة عبر ملف إعداد ESLint. لا يُوصى بإعادة اختراع العجلة مراراً وتكراراً، وقد تكون فكرة جيدة تبنّي إعداد جاهز من مشروع شخص آخر في مشروعك. اعتمدت مشاريع كثيرة مؤخراً <a href="https://github.com/airbnb/javascript">دليل أسلوب JavaScript</a> من Airbnb بالأخذ بإعداد <a href="https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb">ESLint</a> الخاص بـ Airbnb.</p>
<p>يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-7</i> من <a href="https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7">مستودع GitHub هذا</a>.</p>
</div>
<div class="tasks">
<h3 id="تمرين-322">تمرين 3.22.</h3>
<h4 id="322-إعداد-lint">3.22: إعداد Lint</h4>
<p>أضف ESLint إلى تطبيقك وأصلح جميع التحذيرات.</p>
<p>كان هذا آخر تمرين في هذا الجزء من المقرر. حان الوقت لدفع شيفرتك إلى GitHub وتسجيل جميع تمارينك المنجزة في <a href="https://studies.cs.helsinki.fi/stats/courses/fullstackopen">نظام تسليم التمارين</a>.</p>
</div>
`,c={part:3,letter:"d",file:s,title:n,slug:a,mainImage:p,headings:l,html:t};export{c as default,s as file,l as headings,t as html,r as letter,p as mainImage,e as part,a as slug,n as title};
