const e=9,r="d",s="d.md",n="كتابة تطبيق Express بالأنواع",a="typing_an_express_app",p="/images/part-9.svg",t=[{depth:3,id:"تهيئة-المشروع",text:"تهيئة المشروع"},{depth:3,id:"ليكن-هناك-شيفرة",text:"ليكن هناك شيفرة"},{depth:3,id:"كلمات-قليلة-عن-تشغيل-typescript-مع-nodejs",text:"كلمات قليلة عن تشغيل TypeScript مع Node.js"},{depth:3,id:"تنفيذ-الوظائف",text:"تنفيذ الوظائف"},{depth:3,id:"تعريف-الأنواع",text:"تعريف الأنواع"},{depth:3,id:"الأنواع-المساعدة-utility-types",text:"الأنواع المساعدة (Utility Types)"},{depth:3,id:"كتابة-أنواع-الطلب-والاستجابة",text:"كتابة أنواع الطلب والاستجابة"},{depth:3,id:"منع-نتيجة-undefined-غير-المقصودة",text:"منع نتيجة undefined غير المقصودة"},{depth:3,id:"إضافة-مذكرة-جديدة",text:"إضافة مذكرة جديدة"},{depth:3,id:"التحقق-من-صحة-الطلبات",text:"التحقق من صحة الطلبات"},{depth:3,id:"حراس-الأنواع",text:"حرّاس الأنواع"},{depth:3,id:"كائن-as-const",text:"كائن as const"},{depth:3,id:"تحليل-جسم-الطلب-في-الوسيط",text:"تحليل جسم الطلب في الوسيط"}],l=`<p>بعد أن صار لدينا فهم أساسي لكيفية عمل TypeScript وكيفية إنشاء مشاريع صغيرة به، حان الوقت لنبدأ بإنشاء شيء مفيد. سننشئ الآن مشروعاً جديداً يقدّم حالات استخدام أكثر واقعية بعض الشيء.</p>
<p>هناك تغيير جوهري عن الجزء السابق وهو أننا <em>لن نستخدم ts-node بعد الآن</em>. فهي أداة عملية تساعدك على البدء، لكن على المدى الطويل يُستحسن استخدام مترجم TypeScript الرسمي الذي يأتي مع حزمة npm ‏<em>typescript</em>. يولّد المترجم الرسمي ملفات JavaScript من ملفات .ts ويحزمها، بحيث لا تحتوي <em>نسخة الإنتاج</em> المبنية على أي شيفرة TypeScript بعد الآن. هذه هي النتيجة التي نصبو إليها بالضبط، لأن TypeScript نفسه غير قابل للتنفيذ في المتصفحات أو Node.</p>
<h3 id="تهيئة-المشروع">تهيئة المشروع</h3>
<p>سننشئ مشروعاً من أجل Ilari، الذي يحب <a href="https://www.youtube.com/watch?v=4CY_s_FxCa0" data-type="link" data-id="https://www.youtube.com/watch?v=4CY_s_FxCa0">قيادة الطائرات الصغيرة</a> لكنه يجد صعوبة في إدارة سجل رحلاته الجوية. هو مبرمج بنفسه، لذا لا يحتاج بالضرورة إلى واجهة مستخدم، لكنه يرغب في استخدام برنامج مخصّص يعمل عبر طلبات HTTP مع إبقاء إمكانية إضافة واجهة مستخدم قائمة على الويب إلى التطبيق لاحقاً.</p>
<p>لنبدأ بإنشاء أول مشروع حقيقي لنا: <em>مذكرات رحلات Ilari الجوية</em>. كالمعتاد، نفّذ <em>npm init</em> وثبّت حزمة <em>typescript</em> كاعتمادية تطوير.</p>
<pre><code class="language-bash"> npm install typescript --save-dev
</code></pre>
<p>لنجرِ أيضاً التعديلات المطلوبة في <em>package.json</em>:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">// ..</span>
  <span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;module&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;tsc&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;tsc&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ..</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يمكننا الآن تهيئة إعدادات tsconfig.json بتشغيل:</p>
<pre><code class="language-bash"> npm run tsc -- --init
</code></pre>
<blockquote>
<p><strong>لاحظ</strong> الشرطتين الإضافيتين <em>--</em> قبل الوسيط الفعلي! تُفسَّر الوسائط قبل <em>--</em> على أنها خاصة بأمر <em>npm</em>، أما التي بعدها فتكون مخصصة للأمر الذي يُشغَّل عبر السكربت (أي <em>tsc</em> في هذه الحالة).</p>
</blockquote>
<p>يحتوي ملف <em>tsconfig.json</em> الذي أنشأناه للتو على قائمة طويلة بكل إعداد متاح لنا. غير أن معظمها معلّق. قد تساعدك دراسة هذا الملف في العثور على بعض خيارات الإعداد التي قد تحتاجها. ولا بأس إطلاقاً في إبقاء الأسطر المعلّقة، في حال احتجتها يوماً ما.</p>
<p>في الوقت الحالي، نريد تفعيل ما يلي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;compilerOptions&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;target&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;esnext&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;noEmit&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;module&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;nodenext&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;esModuleInterop&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;allowImportingTsExtensions&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;strict&quot;</span> <span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;noUnusedLocals&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;noUnusedParameters&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;noImplicitReturns&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;noFallthroughCasesInSwitch&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>لنتناول كل إعداد على حدة:</p>
<p>يضبط <em>target: &quot;esnext&quot;</em> أن يُترجم TypeScript إلى أحدث ميزات JavaScript. ستستخدم الشيفرة المترجمة صيغة JavaScript الأحدث. ولأننا نستخدم Node الإصدار 24، فنحن في الواقع لا نترجم الشيفرة، لذا لا يهم الهدف كثيراً.</p>
<p>أما <em>noEmit: true</em> فمألوف لدينا، فهو يخبر المترجم بالقيام بفحص الأنواع فقط دون توليد الشيفرة المترجمة.</p>
<p>يخبر <em>module: &quot;nodenext&quot;</em> TypeScript باستخدام آلية حلّ الوحدات الأصلية في Node.js لوحدات ESM (وحدات ES). عملياً، يعني هذا أنه يمكننا استخدام صيغة <em>import</em> في استيراد الوحدات.</p>
<p>يتيح <em>esModuleInterop: true</em> التوافق بين أنماط استيراد وحدات CommonJS وES modules في TypeScript.</p>
<p>بدونه، يتطلب استيراد وحدة CommonJS كتابة <code>import * as express from 'express';</code></p>
<p>ومعه، يمكنك استخدام <code>import express from 'express';</code></p>
<p>يتيح <em>allowImportingTsExtensions: true</em> استيراد ملفات TypeScript مباشرةً، وهذا ضروري عندما نشغّل الشيفرة بـNode.js</p>
<p><em>strict : true</em> هو اختصار لعدة خيارات منفصلة:</p>
<ul>
<li>noImplicitAny</li>
<li>noImplicitThis</li>
<li>alwaysStrict</li>
<li>strictBindCallApply</li>
<li>strictNullChecks</li>
<li>strictFunctionTypes</li>
<li>strictPropertyInitialization</li>
</ul>
<p>إنها توجّه أسلوب كتابتنا للشيفرة نحو استخدام ميزات TypeScript بصرامة أكبر. وربما أهمها بالنسبة لنا هو <a href="https://www.staging-typescript.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a> المألوف سابقاً. فهو يمنع ضبط النوع <em>any</em> ضمنياً، وهو ما قد يحدث مثلاً إذا لم تحدّد أنواع معاملات دالة. يمكن العثور على تفاصيل بقية الإعدادات في <a href="https://www.staging-typescript.org/tsconfig#strict" target="_blank" rel="noreferrer noopener">توثيق tsconfig</a>. ويوصي التوثيق الرسمي باستخدام <em>strict</em>.</p>
<ul>
<li><em>noUnusedLocals</em> يمنع وجود متغيرات محلية غير مستخدمة، و<em>noUnusedParameters</em> يرمي خطأً إذا احتوت دالة على معاملات غير مستخدمة.</li>
<li><em>noImplicitReturns</em> يفحص كل مسارات الشيفرة في الدالة للتأكد من أنها تُرجع قيمة.</li>
<li><em>noFallthroughCasesInSwitch</em> يضمن أن كل حالة في <em>switch case</em> تنتهي إما بعبارة <em>return</em> أو <em>break</em>.</li>
<li><em>esModuleInterop</em> يتيح التشغيل البيني بين CommonJS وES Modules</li>
</ul>
<p>انظر المزيد في <a href="https://www.staging-typescript.org/tsconfig#esModuleInterop" target="_blank" rel="noreferrer noopener">التوثيق</a>.</p>
<p>بعد أن ضبطنا إعداداتنا، يمكننا المتابعة بتثبيت <em>express</em> وبالطبع أيضاً <em>@types/express</em>. ولأن هذا مشروع حقيقي يُقصد به أن ينمو مع الوقت، سنستخدم ESlint منذ البداية:</p>
<pre><code class="language-bash">npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express
</code></pre>
<p>الآن يجب أن يبدو ملف <em>package.json</em> لدينا هكذا:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;flights&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;version&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;1.0.0&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;description&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;main&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;index.js&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;tsc&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;tsc&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;author&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;license&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;ISC&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;devDependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;@eslint/js&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^10.0.1&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;@stylistic/eslint-plugin&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^5.10.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;@types/express&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^5.0.6&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;eslint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^10.1.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;typescript&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^6.0.2&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;typescript-eslint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^8.57.2&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;dependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;express&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^5.2.1&quot;</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>ننشئ أيضاً ملف <em>eslint.config.mjs</em> بالمحتوى التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> eslint <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eslint/js&#x27;</span>;
<span class="hljs-keyword">import</span> tseslint <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;typescript-eslint&#x27;</span>;
<span class="hljs-keyword">import</span> stylistic <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@stylistic/eslint-plugin&#x27;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> tseslint.<span class="hljs-title function_">config</span>({
  <span class="hljs-attr">files</span>: [<span class="hljs-string">&#x27;**/*.ts&#x27;</span>],
  <span class="hljs-attr">extends</span>: [
    eslint.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>,
    ...tseslint.<span class="hljs-property">configs</span>.<span class="hljs-property">recommendedTypeChecked</span>,
  ],
  <span class="hljs-attr">languageOptions</span>: {
    <span class="hljs-attr">parserOptions</span>: {
      <span class="hljs-attr">projectService</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-attr">tsconfigRootDir</span>: <span class="hljs-keyword">import</span>.<span class="hljs-property">meta</span>.<span class="hljs-property">dirname</span>,
    },
  },
  <span class="hljs-attr">plugins</span>: {
    <span class="hljs-string">&#x27;@stylistic&#x27;</span>: stylistic,
  },
  <span class="hljs-attr">rules</span>: {
    <span class="hljs-string">&#x27;@stylistic/semi&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/no-unsafe-assignment&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/no-explicit-any&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/explicit-function-return-type&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/explicit-module-boundary-types&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/restrict-template-expressions&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/restrict-plus-operands&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>,
    <span class="hljs-string">&#x27;@typescript-eslint/no-unused-vars&#x27;</span>: [
      <span class="hljs-string">&#x27;error&#x27;</span>,
      { <span class="hljs-attr">argsIgnorePattern</span>: <span class="hljs-string">&#x27;^_&#x27;</span> },
    ],
  },
});

</code></pre>
<p>الآن نحتاج فقط إلى تهيئة بيئة التطوير لدينا، ونكون جاهزين لبدء كتابة شيفرة جدّية.</p>
<p>سنختار الخيار نفسه كما في السابق، ونشغّل <em>tsc</em> و<em>node --watch</em> بالتوازي. لنثبّت أولاً <a href="https://www.npmjs.com/package/concurrently">concurrently</a>:</p>
<pre><code class="language-bash">npm install --save-dev concurrently
</code></pre>
<p>نعرّف أخيراً بضعة سكربتات npm إضافية، وها نحن جاهزون للبدء:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;tsc&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;tsc&quot;</span><span class="hljs-punctuation">,</span>
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;concurrently \\&quot;tsc --watch\\&quot; \\&quot;node --watch index.ts\\&quot;&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;start&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node index.ts&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;lint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;eslint .&quot;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ...</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>عرّفنا أيضاً السكربت <code>npm start</code> لتشغيل نسخة الإنتاج من التطبيق.</p>
<p>كما ترى، هناك الكثير من الأمور التي يجب المرور بها قبل البدء بالبرمجة الفعلية. عندما تعمل على مشروع حقيقي، فإن التحضير المتأني يدعم عملية تطويرك. خذ الوقت اللازم لإنشاء إعداد جيد لك ولفريقك، حتى يسير كل شيء بسلاسة على المدى الطويل.</p>
<h3 id="ليكن-هناك-شيفرة">ليكن هناك شيفرة</h3>
<p>الآن يمكننا أخيراً البدء بالبرمجة! كالعادة، نبدأ بإنشاء نقطة نهاية ping، فقط للتأكد من أن كل شيء يعمل.</p>
<p>محتوى ملف <em>index.ts</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;
<span class="hljs-keyword">const</span> app = <span class="hljs-title function_">express</span>();
app.<span class="hljs-title function_">use</span>(express.<span class="hljs-title function_">json</span>());

<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = <span class="hljs-number">3000</span>;

app.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/ping&#x27;</span>, (_req, res) =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;someone pinged here&#x27;</span>);
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">&#x27;pong&#x27;</span>);
});

app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>, () =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server running on port <span class="hljs-subst">\${PORT}</span>\`</span>);
});
</code></pre>
<p>الآن، إذا شغّلنا التطبيق بـ<code>npm run dev</code> أو <code>npm start</code> يمكننا التحقق من أن طلباً إلى <a href="http://localhost:3000/ping" target="_blank" rel="noreferrer noopener">http://localhost:3000/ping</a> يعطي الاستجابة <em>pong</em>، أي أن إعدادنا سليم!</p>
<p><img src="/images/mooc/8a21d6787f76.webp" alt="صورة توضيحية"></p>
<p>الآن لدينا خط أنابيب (pipeline) أدنى عامل لتطوير مشروعنا. بمساعدة المترجم وESLint نضمن الحفاظ على جودة شيفرة جيدة. بهذه القاعدة، يمكننا البدء بإنشاء تطبيق يمكننا لاحقاً نشره في بيئة إنتاج.</p>
<h3 id="كلمات-قليلة-عن-تشغيل-typescript-مع-nodejs">كلمات قليلة عن تشغيل TypeScript مع Node.js</h3>
<p>كما ذُكر، يعمل دعم TypeScript المدمج في Node عبر <em>إزالة الأنواع</em>، فهو ببساطة يحذف تعليقات الأنواع (type annotations) ويشغّل JavaScript المتبقية. هذا سريع وكافٍ لمعظم شيفرة TypeScript. غير أن بعض ميزات TypeScript تتجاوز مجرد تعليقات الأنواع وتتطلب تحويلاً فعلياً للشيفرة لتعمل بشكل صحيح في وقت التشغيل.</p>
<p>تتيح راية <em>--experimental-transform-types</em> لـNode.js التعامل مع هذه الميزات. ومن أبرزها <a href="https://www.typescriptlang.org/docs/handbook/enums.html">Enums</a>. تُترجم TypeScript enums إلى كائنات JavaScript حقيقية. بدون التحويل، ستزيل Node صيغة enum وتترك شيفرة غير صالحة.</p>
<p>بدون هذه الراية، سيؤدي استخدام enum في شيفرتك إلى خطأ في وقت التشغيل، حتى وإن لم يبلّغ مدقّق أنواع TypeScript عن أي مشاكل.</p>
<p>رغم عدم استخدامنا أياً من هذه الميزات الآن، لنضف الراية إلى السكربتات:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>&lt;br&gt;  <span class="hljs-comment">// ... &lt;br&gt;  &quot;scripts&quot;: {&lt;br&gt;    &quot;tsc&quot;: &quot;tsc&quot;,&lt;br&gt;     // BEGIN HIGHLIGHT&lt;br&gt;    &quot;dev&quot;: &quot;concurrently \\&quot;tsc --watch\\&quot; \\&quot;node --watch --experimental-transform-types index.ts\\&quot;&quot;,&lt;br&gt;    &quot;start&quot;: &quot;node --experimental-transform-types index.ts&quot;,&lt;br&gt;     // END HIGHLIGHT&lt;br&gt;    &quot;lint&quot;: &quot;eslint .&quot;&lt;br&gt;  },&lt;br&gt;  // ...&lt;br&gt;}</span>
</code></pre>
<p>لاحظ أن الراية موسومة بـ<em>تجريبية</em>، أي أن سلوكها قد يتغير في إصدارات Node المستقبلية. ومع نضوج دعم TypeScript الأصلي في Node، يُتوقع أن تصبح ميزات مثل تحويل enum جزءاً من السلوك الافتراضي في النهاية.</p>
<p>ستحصل على تحذير بشأن الطابع التجريبي:</p>
<pre><code>(node:80296) ExperimentalWarning: Transform Types is an experimental feature and might change at any time&lt;br&gt;(Use \`node --trace-warnings ...\` to show where the warning was created)
</code></pre>
<p>يمكن إسكات التحذير بإضافة الراية <code>--disable-warning=ExperimentalWarning</code>.</p>
<div class="tasks">
<p><strong>9. الواجهة الخلفية لـPatientor، الخطوة 1</strong></p>
</div>
<div class="tasks">
<p><strong>10. الواجهة الخلفية لـPatientor، الخطوة 2</strong></p>
</div>
<h3 id="تنفيذ-الوظائف">تنفيذ الوظائف</h3>
<p>أخيراً، نحن جاهزون لبدء كتابة بعض الشيفرة.</p>
<p>لنبدأ من الأساسيات. يريد Ilari أن يكون قادراً على تتبّع تجاربه في رحلاته الجوية.</p>
<p>يريد أن يكون قادراً على حفظ <em>مدخلات المذكرات</em>، التي تحتوي على:</p>
<ul>
<li>تاريخ المدخلة</li>
<li>حالة الطقس (sunny أو windy أو cloudy أو rainy أو stormy)</li>
<li>مدى الرؤية (great أو good أو ok أو poor)</li>
<li>نص حر يصف التجربة</li>
</ul>
<p>حصلنا على بعض البيانات النموذجية التي سنستخدمها كقاعدة نبني عليها. البيانات محفوظة بصيغة JSON ويمكن العثور عليها <a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">هنا</a>.</p>
<p>تبدو البيانات كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">[</span>
  <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">1</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;date&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;2026-01-01&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;weather&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;rainy&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;visibility&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;poor&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;comment&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Pretty scary flight, I&#x27;m glad I&#x27;m alive&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">2</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;date&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;2026-04-01&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;weather&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;sunny&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;visibility&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;good&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;comment&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Everything went better than expected, I&#x27;m learning much&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ...</span>
<span class="hljs-punctuation">]</span>
</code></pre>
<p>لنبدأ بإنشاء نقطة نهاية تُرجع جميع مدخلات مذكرات الرحلات.</p>
<p>أولاً، علينا اتخاذ بعض القرارات حول كيفية تنظيم شيفرتنا المصدرية. من الأفضل وضع جميع الشيفرة المصدرية تحت دليل <em>src</em>، حتى لا تختلط مع ملفات الإعداد. سننقل <em>index.ts</em> إلى هناك ونجري التعديلات اللازمة على سكربتات npm.</p>
<p>سنضع جميع <a href="/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">الموجّهات</a> (routers) والوحدات المسؤولة عن معالجة مجموعة موارد محددة مثل <em>diaries</em>، تحت دليل <em>src/routes</em>. هذا مختلف قليلاً عما فعلناه في <a href="/part4" target="_blank" rel="noreferrer noopener">الجزء 4</a>، حيث استخدمنا دليل <em>src/controllers</em>.</p>
<p>الموجّه الذي يتولى جميع نقاط نهاية المذكرات موجود في <em>src/routes/diaries.ts</em> ويبدو هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;

<span class="hljs-keyword">const</span> router = express.<span class="hljs-title class_">Router</span>();

router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/&#x27;</span>, (_req, res) =&amp;gt; {
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">&#x27;Fetching all diaries!&#x27;</span>);
});

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, (_req, res) =&amp;gt; {
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">&#x27;Saving a diary!&#x27;</span>);
});

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> router;
</code></pre>
<p>سنوجّه جميع الطلبات ذات البادئة <em>/api/diaries</em> إلى ذلك الموجّه تحديداً في <em>index.ts</em></p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;
<span class="hljs-keyword">import</span> diaryRouter <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./routes/diaries.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">const</span> app = <span class="hljs-title function_">express</span>();
app.<span class="hljs-title function_">use</span>(express.<span class="hljs-title function_">json</span>());

<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = <span class="hljs-number">3000</span>;

app.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/ping&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">_req, res</span>) =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;someone pinged here&#x27;</span>);
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">&#x27;pong&#x27;</span>);
});

app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/diaries&#x27;</span>, diaryRouter); <span class="hljs-comment">// HIGHLIGHT LINE</span>

app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>, <span class="hljs-function">() =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server running on port <span class="hljs-subst">\${PORT}</span>\`</span>);
});
</code></pre>
<p>والآن، إذا أرسلنا طلب HTTP GET إلى <a href="http://localhost:3000/api/diaries" target="_blank" rel="noreferrer noopener">http://localhost:3000/api/diaries</a>، ينبغي أن نرى الرسالة: <em>Fetching all diaries!</em></p>
<p>بعد ذلك، علينا البدء بتقديم البيانات الأولية (الموجودة <a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">هنا</a>) من التطبيق. سنجلب البيانات ونحفظها في <em>data/entries.json</em>.</p>
<p>لن نكتب شيفرة عمليات معالجة البيانات الفعلية في الموجّه. سننشئ بدلاً من ذلك <em>خدمة</em> (service) تتولى معالجة البيانات. من الممارسات الشائعة جداً فصل «منطق الأعمال» عن شيفرة الموجّه في وحدات تُسمى غالباً <em>خدمات</em>. اسم service أصله من <a href="https://en.wikipedia.org/wiki/Domain-driven_design" target="_blank" rel="noreferrer noopener">التصميم المدفوع بالمجال</a> وشاع استخدامه عبر إطار عمل <a href="https://spring.io/" target="_blank" rel="noreferrer noopener">Spring</a>.</p>
<p>لننشئ دليل <em>src/services</em> ونضع فيه ملف <em>diaryService.ts</em>. يحتوي الملف على دالتين لجلب مدخلات المذكرات وحفظها:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaryData <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.json&#x27;</span>;

<span class="hljs-keyword">const</span> getEntries = () =&amp;gt; {
  <span class="hljs-keyword">return</span> diaryData;
};

<span class="hljs-keyword">const</span> addDiary = () =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  addDiary
};
</code></pre>
<p>لكن هناك شيء غير صحيح:</p>
<p><img src="/images/mooc/35e3e4a798db.webp" alt="صورة توضيحية"></p>
<p>لحسن الحظ، هناك حل سهل، فقط غيّر الاستيراد كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaryData <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.json&#x27;</span> <span class="hljs-keyword">with</span> { <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;json&quot;</span> };
</code></pre>
<p>هذا مطلوب لأنه إذا كنت تستورد شيئاً غير الشيفرة، يحتاج Node.js إلى معرفة نوع الملف الذي تستورده. بدون هذه الإشارة، يرى ملف <em>.json</em> ولا يعرف ما إذا كان عليه التعامل معه كشيفرة أو كبيانات، فيرمي خطأً.</p>
<p>لنضمن الآن عمل الوظائف من الطرف إلى الطرف، ولنربط الموجّه بالخدمة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;&lt;br&gt;<span class="hljs-keyword">import</span> diaryService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../services/diaryService.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE&lt;br&gt;&lt;br&gt;const router = express.Router();&lt;br&gt;&lt;br&gt;router.get(&#x27;/&#x27;, (_req, res) =&gt; {&lt;br&gt;  // BEGIN HIGHLIGHT&lt;br&gt;  const data = diaryService.getEntries()&lt;br&gt;  res.send(data);&lt;br&gt;  // END HIGHLIGHT&lt;br&gt;});&lt;br&gt;&lt;br&gt;router.post(&#x27;/&#x27;, (_req, res) =&gt; {&lt;br&gt;  res.send(&quot;add a new diary&quot;);&lt;br&gt;});&lt;br&gt;&lt;br&gt;export default router;</span>
</code></pre>
<p>وبالفعل، نرى المذكرات في نقطة النهاية:</p>
<p><img src="/images/mooc/ca4ce04c0f96.webp" alt="صورة توضيحية"></p>
<h3 id="تعريف-الأنواع">تعريف الأنواع</h3>
<p>رأينا سابقاً كيف يستطيع المترجم تحديد نوع متغير من القيمة المُسندة إليه. وبالمثل، يمكن للمترجم تفسير مجموعات بيانات كبيرة مكوّنة من كائنات ومصفوفات:</p>
<p><img src="/images/mooc/0f5ba8636b7a.webp" alt="صورة توضيحية"></p>
<p>نتيجة لذلك، يحذّرنا المترجم إذا حاولنا فعل شيء مثير للشك ببيانات JSON التي نتعامل معها. مثلاً، إذا كنا نتعامل مع مصفوفة تحتوي كائنات من نوع معيّن، وحاولنا إضافة كائن لا يملك كل الحقول التي تملكها الكائنات الأخرى، أو به تعارضات في الأنواع (مثلاً، عدد حيث ينبغي أن يكون نصاً)، يستطيع المترجم أن يعطينا تحذيراً.</p>
<p>رغم أن المترجم جيد جداً في التأكد من عدم قيامنا بأي شيء غير مرغوب، إلا أنه أكثر أماناً أن نعرّف أنواع البيانات بأنفسنا.</p>
<p>حالياً، لدينا تطبيق Express بلغة TypeScript عامل بشكل أساسي، لكن لا تكاد توجد <em>أنواع</em> فعلية في الشيفرة. ولأننا نعرف نوع البيانات التي ينبغي قبولها في حقلَي <em>weather</em> و<em>visibility</em>، فلا سبب يمنعنا من تضمين أنواعهما في الشيفرة.</p>
<p>لننشئ ملفاً لأنواعنا، <em>types.ts</em>، نعرّف فيه جميع أنواعنا لهذا المشروع.</p>
<p>أولاً، لنكتب أنواع قيم <em>Weather</em> و<em>Visibility</em> باستخدام <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" target="_blank" rel="noreferrer noopener">نوع اتحادي</a> (union type) من النصوص المسموح بها:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">Weather</span> = <span class="hljs-string">&#x27;sunny&#x27;</span> | <span class="hljs-string">&#x27;rainy&#x27;</span> | <span class="hljs-string">&#x27;cloudy&#x27;</span> | <span class="hljs-string">&#x27;windy&#x27;</span> | <span class="hljs-string">&#x27;stormy&#x27;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">Visibility</span> = <span class="hljs-string">&#x27;great&#x27;</span> | <span class="hljs-string">&#x27;good&#x27;</span> | <span class="hljs-string">&#x27;ok&#x27;</span> | <span class="hljs-string">&#x27;poor&#x27;</span>;
</code></pre>
<p>ومن هناك، يمكننا المتابعة بإنشاء نوع DiaryEntry، الذي سيكون <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">واجهة</a> (interface):</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> <span class="hljs-title class_">DiaryEntry</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">date</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">weather</span>: <span class="hljs-title class_">Weather</span>;
  <span class="hljs-attr">visibility</span>: <span class="hljs-title class_">Visibility</span>;
  <span class="hljs-attr">comment</span>: <span class="hljs-built_in">string</span>;
}
</code></pre>
<p>يمكننا الآن محاولة كتابة نوع JSON المستورد:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaryData <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.json&#x27;</span> <span class="hljs-keyword">with</span> { <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;json&quot;</span> };
<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">const</span> <span class="hljs-attr">diaries</span>: <span class="hljs-title class_">DiaryEntry</span>[] = diaryData; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> getEntries = (): <span class="hljs-title class_">DiaryEntry</span>[]  =&gt; {
  <span class="hljs-keyword">return</span> diaries;
};
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">addDiary</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  addDiary
};
</code></pre>
<p>لكن بما أن قيم JSON معلنة مسبقاً، فإن إسناد نوع لمجموعة البيانات يؤدي إلى خطأ:</p>
<p><img src="/images/mooc/91423407b18a.webp" alt="صورة توضيحية"></p>
<p>تكشف نهاية رسالة الخطأ عن المشكلة: حقول <em>weather</em> غير متوافقة. في <em>DiaryEntry</em> حدّدنا أن نوعه <em>Weather</em>، لكن مترجم TypeScript استنتج أن نوعه <em>string</em>.</p>
<p>يمكننا إصلاح المشكلة بإجراء <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noreferrer noopener">تأكيد نوع</a> (type assertion). وكما <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3#bc2e1861-1334-4a2c-a678-03f486621ce7" target="_blank" rel="noreferrer noopener">ذكرنا</a> سابقاً، ينبغي ألا يُجرى تأكيد النوع إلا إذا كنا واثقين من معرفتنا بما نفعل!</p>
<p>إذا أكّدنا نوع المتغير <em>diaryData</em> ليكون <em>DiaryEntry</em> بالكلمة المفتاحية <em>as</em>، فينبغي أن يعمل كل شيء:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaryData <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.json&#x27;</span> <span class="hljs-keyword">with</span> { <span class="hljs-attr">type</span>: <span class="hljs-string">&quot;json&quot;</span> };
<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-attr">diaries</span>: <span class="hljs-title class_">DiaryEntry</span>[] = diaryData <span class="hljs-keyword">as</span> <span class="hljs-title class_">DiaryEntry</span>[]; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">const</span> getEntries = (): <span class="hljs-title class_">DiaryEntry</span>[]  =&gt; {
  <span class="hljs-keyword">return</span> diaries;
};

<span class="hljs-keyword">const</span> <span class="hljs-title function_">addDiary</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  addDiary
};
</code></pre>
<p>ينبغي ألا نستخدم تأكيد النوع أبداً إلا إذا لم يكن هناك طريقة أخرى للمتابعة، إذ يبقى هناك دائماً خطر تأكيد نوع غير مناسب لكائن والتسبب في خطأ تشغيل سيئ. وبينما يثق المترجم بأنك تعرف ما تفعل عند استخدام <em>as</em>، فإننا بهذا لا نستفيد من كامل قوة TypeScript بل نعتمد على المبرمج في تأمين الشيفرة.</p>
<p>في حالتنا، يمكننا تغيير طريقة تصدير بياناتنا بحيث نكتب نوعها داخل ملف البيانات. ولأننا لا نستطيع استخدام الأنواع في ملف JSON، ينبغي تحويل ملف JSON إلى ملف ts باسم <em>entries.ts</em>، يصدّر البيانات المكتوبة النوع هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> type { <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../src/types.ts&quot;</span>;
<span class="hljs-keyword">const</span> <span class="hljs-attr">diaryEntries</span>: <span class="hljs-title class_">DiaryEntry</span>[] = [
  {
      <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
      <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-01-01&quot;</span>,
      <span class="hljs-string">&quot;weather&quot;</span>: <span class="hljs-string">&quot;rainy&quot;</span>,
      <span class="hljs-string">&quot;visibility&quot;</span>: <span class="hljs-string">&quot;poor&quot;</span>,
      <span class="hljs-string">&quot;comment&quot;</span>: <span class="hljs-string">&quot;Pretty scary flight, I&#x27;m glad I&#x27;m alive&quot;</span>
  },
  <span class="hljs-comment">// ...</span>
];

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> diaryEntries;
</code></pre>
<p>الآن، عندما نستورد المصفوفة، يفسّرها المترجم بشكل صحيح:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaries <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>;

<span class="hljs-keyword">const</span> getEntries = (): <span class="hljs-title class_">DiaryEntry</span>[] =&gt; {
  <span class="hljs-keyword">return</span> diaries;
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">addDiary</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  addDiary
};
</code></pre>
<p>لاحظ أنه إذا أردنا أن نكون قادرين على حفظ مدخلات دون حقل معيّن، مثل <em>comment</em>، يمكننا ضبط نوع الحقل <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties" target="_blank" rel="noreferrer noopener">اختيارياً</a> بإضافة <em>?</em> إلى تعريف النوع:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> <span class="hljs-title class_">DiaryEntry</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">date</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">weather</span>: <span class="hljs-title class_">Weather</span>;
  <span class="hljs-attr">visibility</span>: <span class="hljs-title class_">Visibility</span>;
  <span class="hljs-attr">comment</span>?: <span class="hljs-built_in">string</span>;
}
</code></pre>
<blockquote>
<p><strong>import type</strong></p>
<p>عند استيراد نوع لا يكفي أن تكتب فحسب</p>
<p>import { DiaryEntry } from '../types.ts';</p>
<p>بل يجب بدلاً من ذلك إجراء <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export">استيراد الأنواع فقط</a></p>
<p>import type { DiaryEntry } from '../types.ts';</p>
<p>عند تشغيل ملفات TypeScript مباشرةً بـNode.js، تُزال معلومات أنواع TypeScript في وقت التشغيل. يعني هذا أنه إذا استوردت شيئاً موجوداً كنوع فقط، مثل interface أو type alias، ولم تضع عليه <em>import type,</em> بشكل صريح، فقد يحاول وقت التشغيل حلّه كقيمة JavaScript حقيقية ويفشل.</p>
<p>استخدام <em>import type</em> يخبر كلاً من مترجم TypeScript وتحويل وقت التشغيل بأن هذا الاستيراد موجود لأغراض فحص الأنواع فقط ويجب محوه بالكامل قبل التنفيذ.</p>
<p>لحسن الحظ، هناك قاعدة ESLint هي <a href="https://typescript-eslint.io/rules/consistent-type-imports/">consistent-type-imports</a> تساعدنا على عدم نسيان استخدام import type. لنفعّل القاعدة في <em>.esling.config.mjs</em>:</p>
<p>rules: {<br>    // ...<br>    &quot;@typescript-eslint/consistent-type-imports&quot;: &quot;error&quot;,<br>  },</p>
<p>الآن يُنبَّهنا عند أي سهو!</p>
</blockquote>
<h3 id="الأنواع-المساعدة-utility-types">الأنواع المساعدة (Utility Types)</h3>
<p>أحياناً، قد نرغب في استخدام تعديل معيّن على نوع ما. تخيّل مثلاً صفحة لعرض بعض البيانات، بعضها حساس وبعضها غير حساس. قد نريد التأكد من عدم استخدام أو عرض أي بيانات حساسة. يمكننا <em>اختيار</em> حقول النوع المسموح باستخدامها لفرض ذلك. ويمكننا فعل هذا باستخدام النوع المساعد <a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a>.</p>
<p>في مشروعنا، ينبغي أن نأخذ في الحسبان أن Ilari قد يرغب في إنشاء قائمة بجميع مدخلات مذكراته <em>باستثناء</em> حقل التعليق، لأنه خلال رحلة مخيفة جداً قد ينتهي به الأمر بكتابة شيء لا يرغب بالضرورة في إظهاره لأي شخص آخر.</p>
<p>يتيح لنا النوع المساعد <a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a> اختيار حقول نوع موجود نريد استخدامها. يمكن استخدام Pick إما لبناء نوع جديد تماماً أو لإخبار دالة بما ينبغي أن تُرجعه في وقت التشغيل. الأنواع المساعدة نوع خاص من الأنواع، لكن يمكن استخدامها تماماً كالأنواع العادية.</p>
<p>في حالتنا، لإنشاء نسخة «خاضعة للرقابة» من <em>DiaryEntry</em> للعرض العام، يمكننا استخدام <em>Pick</em> في تعريف الدالة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> getNonSensitiveEntries =
  (): <span class="hljs-title class_">Pick</span>&amp;lt;<span class="hljs-title class_">DiaryEntry</span>, <span class="hljs-string">&#x27;id&#x27;</span> | <span class="hljs-string">&#x27;date&#x27;</span> | <span class="hljs-string">&#x27;weather&#x27;</span> | <span class="hljs-string">&#x27;visibility&#x27;</span>&amp;gt;[] =&amp;gt; {
    <span class="hljs-comment">// ...</span>
  }
</code></pre>
<p>وسيتوقع المترجم من الدالة أن تُرجع مصفوفة قيم من نوع <em>DiaryEntry</em> المعدّل، تشمل الحقول الأربعة المختارة فقط.</p>
<p>في هذه الحالة، نريد استبعاد حقل واحد فقط، لذا سيكون من الأفضل استخدام النوع المساعد <a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a> الذي يمكننا استخدامه لتحديد الحقول المراد استبعادها:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> getNonSensitiveEntries = (): <span class="hljs-title class_">Omit</span>&amp;lt;<span class="hljs-title class_">DiaryEntry</span>, <span class="hljs-string">&#x27;comment&#x27;</span>&amp;gt;[] =&amp;gt; {
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>لتحسين القراءة، ينبغي بالتأكيد تعريف <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">اسم نوع مستعار</a> (type alias) <em>NonSensitiveDiaryEntry</em> في ملف <em>types.ts</em>:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">NonSensitiveDiaryEntry</span> = <span class="hljs-title class_">Omit</span>&amp;lt;<span class="hljs-title class_">DiaryEntry</span>, <span class="hljs-string">&#x27;comment&#x27;</span>&amp;gt;;
</code></pre>
<p>تتغير الشيفرة هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaries <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.ts&#x27;</span>;
<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NonSensitiveDiaryEntry</span>, <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">const</span> getEntries = (): <span class="hljs-title class_">DiaryEntry</span>[] =&gt; {
  <span class="hljs-keyword">return</span> diaries;
};

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> getNonSensitiveEntries = (): <span class="hljs-title class_">NonSensitiveDiaryEntry</span>[] =&gt; {
  <span class="hljs-keyword">return</span> diaries;
};
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">addDiary</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  addDiary,
  getNonSensitiveEntries <span class="hljs-comment">// HIGHLIGHT LINE</span>
};
</code></pre>
<p>هناك أمر مقلق في تطبيقنا. في <em>getNonSensitiveEntries</em>، نُعيد مدخلات المذكرات كاملة، و<em>لا يظهر أي خطأ</em> رغم كتابة الأنواع!</p>
<p>يحدث هذا لأن <a href="http://www.typescriptlang.org/docs/handbook/type-compatibility.html" target="_blank" rel="noreferrer noopener">TypeScript يفحص فقط</a> ما إذا كانت لدينا جميع الحقول المطلوبة أم لا، لكنه لا يمنع الحقول الزائدة. في حالتنا، يعني هذا أنه <em>غير ممنوع</em> إرجاع كائن من نوع <em>DiaryEntry[]</em>، لكن لو حاولنا الوصول إلى حقل <em>comment</em> لما أمكننا ذلك لأننا سنصل إلى حقل لا يعرفه TypeScript حتى وإن كان موجوداً.</p>
<p>للأسف، قد يؤدي هذا إلى سلوك غير مرغوب إذا لم تكن مدركاً لما تفعله؛ فالوضع سليم بقدر ما يهم TypeScript، لكنك على الأرجح تسمح باستخدام غير مرغوب. لو أعدنا الآن جميع مدخلات المذكرات من دالة <em>getNonSensitiveEntries</em> إلى الواجهة الأمامية، فسنكون <em>نسرّب الحقول غير المرغوبة إلى المتصفح الطالب</em> - حتى وإن بدت أنواعنا تشير إلى غير ذلك!</p>
<p>ولأن TypeScript لا يعدّل البيانات الفعلية بل نوعها فقط، علينا استبعاد الحقول بأنفسنا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> diaries <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../../data/entries.ts&#x27;</span>

<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NonSensitiveDiaryEntry</span>, <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>

<span class="hljs-keyword">const</span> getEntries = () : <span class="hljs-title class_">DiaryEntry</span>[] =&gt; {
  <span class="hljs-keyword">return</span> diaries
}

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> getNonSensitiveEntries = (): <span class="hljs-title class_">NonSensitiveDiaryEntry</span>[] =&gt; {
  <span class="hljs-keyword">return</span> diaries.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">{ id, date, weather, visibility }</span>) =&gt;</span> ({
    id,
    date,
    weather,
    visibility,
  }));
};
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">addDiary</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
</code></pre>
<p>تشمل الأنواع المساعدة العديد من الأدوات العملية، ومن الجدير بلا شك أن تستغرق بعض الوقت في دراسة <a href="https://www.typescriptlang.org/docs/handbook/utility-types.html" target="_blank" rel="noreferrer noopener">التوثيق</a>.</p>
<p>لنغيّر الآن المسار بحيث يُرجع بيانات المذكرات غير الحساسة فقط:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;
<span class="hljs-keyword">import</span> diaryService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../services/diaryService.ts&#x27;</span>;
<span class="hljs-keyword">const</span> router = express.<span class="hljs-title class_">Router</span>();

router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">_req, res</span>) =&gt;</span> {
  res.<span class="hljs-title function_">send</span>(diaryService.<span class="hljs-title function_">getNonSensitiveEntries</span>()); <span class="hljs-comment">// HIGHLIGHT LINE</span>
});

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">_req, res</span>) =&gt;</span> {
  res.<span class="hljs-title function_">send</span>(<span class="hljs-string">&#x27;Saving a diary!&#x27;</span>);
});

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> router;
</code></pre>
<p>الاستجابة هي ما نتوقعه بالضبط:</p>
<p><img src="/images/mooc/2f2af9471d6d.webp" alt="صورة توضيحية"></p>
<h3 id="كتابة-أنواع-الطلب-والاستجابة">كتابة أنواع الطلب والاستجابة</h3>
<p>حتى الآن لم نناقش أي شيء عن أنواع معاملات معالج المسار.</p>
<p>إذا مرّرنا المؤشر مثلاً فوق المعامل <em>res</em>، نلاحظ أن نوعه هو:</p>
<pre><code>Response&amp;lt;any, Record&amp;lt;string, any&amp;gt;, number&amp;gt;
</code></pre>
<p>يبدو غريباً بعض الشيء. النوع <em>Response</em> هو <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">نوع عام</a> (generic type) له ثلاثة <em>معاملات نوع</em>. إذا فتحنا تعريف النوع (بالنقر بزر الفأرة الأيمن واختيار <em>Go to Type Definition</em> في VS Code) نرى ما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> interface <span class="hljs-title class_">Response</span>&amp;lt;
    <span class="hljs-title class_">ResBody</span> = any,
    <span class="hljs-title class_">LocalsObj</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">Record</span>&amp;lt;string, any&amp;gt; = <span class="hljs-title class_">Record</span>&amp;lt;string, any&amp;gt;,
    <span class="hljs-title class_">StatusCode</span> <span class="hljs-keyword">extends</span> number = number,
&amp;gt; <span class="hljs-keyword">extends</span> http.<span class="hljs-property">ServerResponse</span>, <span class="hljs-title class_">Express</span>.<span class="hljs-property">Response</span> {
</code></pre>
<p>معامل النوع الأول هو الأكثر إثارة للاهتمام بالنسبة لنا، فهو يقابل <em>جسم الاستجابة</em> (response body) وقيمته الافتراضية <em>any</em>. ولهذا يقبل مترجم TypeScript أي نوع من الاستجابات ولا نحصل على أي مساعدة لجعل الاستجابة صحيحة.</p>
<p>يمكننا، بل وينبغي لنا على الأرجح، إعطاء نوع مناسب كمتغير النوع. في حالتنا، هو مصفوفة من مدخلات المذكرات:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express, { type <span class="hljs-title class_">Response</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NonSensitiveDiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../types.ts&quot;</span>;
<span class="hljs-comment">// ...</span>

router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">_req, res: Response&amp;lt;NonSensitiveDiaryEntry[]&gt;</span>) =&gt;</span> { <span class="hljs-comment">// HIGHLIGHT LINE</span>
  res.<span class="hljs-title function_">send</span>(diaryService.<span class="hljs-title function_">getNonSensitiveEntries</span>());
});

<span class="hljs-comment">// ...</span>
</code></pre>
<p>إذا حاولنا الآن الاستجابة بنوع بيانات خاطئ، نحصل على خطأ نوع</p>
<p><img src="/images/mooc/6a230c446155.webp" alt="صورة توضيحية"></p>
<p>وبالمثل، فإن معامل الطلب من النوع <em>Request</em> وهو أيضاً نوع عام. سنلقي نظرة أقرب عليه لاحقاً.</p>
<div class="tasks">
<p><strong>11. الواجهة الخلفية لـPatientor، الخطوة 3</strong></p>
</div>
<div class="tasks">
<p><strong>12. الواجهة الخلفية لـPatientor، الخطوة 4</strong></p>
</div>
<h3 id="منع-نتيجة-undefined-غير-المقصودة">منع نتيجة undefined غير المقصودة</h3>
<p>لنوسّع الواجهة الخلفية لدعم جلب مدخلة واحدة محددة بطلب HTTP GET إلى المسار <em>api/diaries/:id</em>.</p>
<p>يحتاج DiaryService إلى توسعة بدالة <em>findById</em>:</p>
<pre><code class="language-ts"><span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> findById = (<span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>): <span class="hljs-function"><span class="hljs-params">DiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> entry = diaries.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">d</span> =&gt;</span> d.<span class="hljs-property">id</span> === id);
  <span class="hljs-keyword">return</span> entry;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById <span class="hljs-comment">// HIGHLIGHT LINE</span>
}
</code></pre>
<p>لكن تظهر مرة أخرى مشكلة جديدة:</p>
<p><img src="/images/mooc/99a625c21be0.webp" alt="صورة توضيحية"></p>
<p>المشكلة هي أنه لا يوجد ضمان بإمكانية العثور على مدخلة بالمعرّف المحدد. من الجيد أن يُنبَّهنا إلى هذه المشكلة المحتملة في مرحلة الترجمة أصلاً. بدون TypeScript لن يُحذَّرنا من هذه المشكلة، وفي أسوأ الأحوال كنا سننتهي بإرجاع كائن <em>undefined</em> بدلاً من إخبار المستخدم بأن المدخلة المحددة غير موجودة.</p>
<p>أولاً وقبل كل شيء، في حالات كهذه، علينا أن نقرر ما ينبغي أن تكون عليه <em>قيمة الإرجاع</em> إذا لم يُعثر على الكائن، وكيف ينبغي التعامل مع الحالة. تُرجع دالة <em>find</em> في المصفوفة القيمة <em>undefined</em> إذا لم يُعثر على الكائن، وهذا مناسب. يمكننا حل مشكلتنا بكتابة نوع قيمة الإرجاع كما يلي:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> findById = (<span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>): <span class="hljs-title class_">DiaryEntry</span> | <span class="hljs-function"><span class="hljs-params">undefined</span> =&gt;</span> {  <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-keyword">const</span> entry = diaries.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">d</span> =&gt;</span> d.<span class="hljs-property">id</span> === id);
  <span class="hljs-keyword">return</span> entry;
}
</code></pre>
<p>معالج المسار هو التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;
<span class="hljs-keyword">import</span> diaryService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../services/diaryService.ts&#x27;</span>

router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =&gt;</span> {
  <span class="hljs-keyword">const</span> diary = diaryService.<span class="hljs-title function_">findById</span>(<span class="hljs-title class_">Number</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>));

  <span class="hljs-keyword">if</span> (diary) {
    res.<span class="hljs-title function_">send</span>(diary);
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">sendStatus</span>(<span class="hljs-number">404</span>);
  }
});

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> router;
</code></pre>
<h3 id="إضافة-مذكرة-جديدة">إضافة مذكرة جديدة</h3>
<p>لنبدأ ببناء نقطة نهاية HTTP POST لإضافة مدخلات مذكرات رحلات جديدة. ينبغي أن تكون المدخلات الجديدة من النوع نفسه الذي للبيانات الموجودة.</p>
<p>تبدو شيفرة معالجة الاستجابة كما يلي:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =&gt;</span> {&lt;br&gt;  <span class="hljs-keyword">const</span> { date, weather, visibility, comment } = req.<span class="hljs-property">body</span>;&lt;br&gt;  <span class="hljs-keyword">const</span> addedEntry = diaryService.<span class="hljs-title function_">addDiary</span>({    &lt;br&gt;    date,&lt;br&gt;    weather,&lt;br&gt;    visibility,&lt;br&gt;    comment,&lt;br&gt;  });  &lt;br&gt;  res.<span class="hljs-title function_">json</span>(addedEntry);&lt;br&gt;})
</code></pre>
<p>إذن، تفكّك الشيفرة المعاملات من جسم الطلب (request body) وتضعها في كائن يُعطى كمعامل للدالة <em>addDiary</em> في <em>diaryService</em>.</p>
<p>لكن انتظر، ما نوع هذا الكائن؟ إنه ليس بالضبط <em>DiaryEntry</em>، لأنه ما زال يفتقد حقل <em>id</em>. قد يكون من المفيد إنشاء نوع جديد <em>NewDiaryEntry</em> لمدخلة لم تُحفظ بعد. لننشئه في <em>types.ts</em> باستخدام نوع <em>DiaryEntry</em> الموجود والنوع المساعد <a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a>:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">NewDiaryEntry</span> = <span class="hljs-title class_">Omit</span>&amp;lt;<span class="hljs-title class_">DiaryEntry</span>, <span class="hljs-string">&#x27;id&#x27;</span>&amp;gt;;
</code></pre>
<p>الآن يمكننا استخدام النوع الجديد في <em>diaryService</em>، وتفكيك كائن المدخلة الجديدة عند إنشاء مدخلة ليتم حفظها:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NewDiaryEntry</span>, <span class="hljs-title class_">NonSensitiveDiaryEntry</span>, <span class="hljs-title class_">DiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types&#x27;</span>;

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> addDiary = ( <span class="hljs-attr">entry</span>: <span class="hljs-title class_">NewDiaryEntry</span> ): <span class="hljs-function"><span class="hljs-params">DiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> newDiaryEntry = {
    <span class="hljs-attr">id</span>: <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">max</span>(...diaries.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">d</span> =&gt;</span> d.<span class="hljs-property">id</span>)) + <span class="hljs-number">1</span>,
    ...entry
  };

  diaries.<span class="hljs-title function_">push</span>(newDiaryEntry);
  <span class="hljs-keyword">return</span> newDiaryEntry;
};
</code></pre>
<p>هناك الكثير من الأحمر في محررنا:</p>
<p><img src="/images/mooc/ce8d357c45df.webp" alt="صورة توضيحية"></p>
<p>السبب هو قاعدة ESlint ‏<a href="https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md" target="_blank" rel="noreferrer noopener">@typescript-eslint/no-unsafe-assignment</a> التي تمنعنا من إسناد حقول جسم الطلب إلى متغيرات.</p>
<p>في الوقت الحالي، لنتجاهل قاعدة ESlint من الملف كله بإضافة السطر التالي كأول سطر في الملف:</p>
<pre><code>/* eslint-disable @typescript-eslint/no-unsafe-assignment */
</code></pre>
<p>لتحليل البيانات الواردة، يجب أن يكون وسيط <em>json</em> مهيأً:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;
<span class="hljs-keyword">import</span> diaryRouter <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./routes/diaries.ts&#x27;</span>;
<span class="hljs-keyword">const</span> app = <span class="hljs-title function_">express</span>();
app.<span class="hljs-title function_">use</span>(express.<span class="hljs-title function_">json</span>());
<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = <span class="hljs-number">3000</span>;

app.<span class="hljs-title function_">use</span>(<span class="hljs-string">&#x27;/api/diaries&#x27;</span>, diaryRouter);

app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>, <span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server running on port <span class="hljs-subst">\${PORT}</span>\`</span>);
});
</code></pre>
<p>الآن التطبيق جاهز لاستقبال طلبات HTTP POST لمدخلات مذكرات جديدة من النوع الصحيح!</p>
<h3 id="التحقق-من-صحة-الطلبات">التحقق من صحة الطلبات</h3>
<p>هناك الكثير من الأمور التي قد تسوء عندما نقبل بيانات من مصادر خارجية. نادراً ما تعمل التطبيقات بالكامل بمفردها، ونحن مضطرون للتعايش مع حقيقة أن البيانات من مصادر خارج نظامنا لا يمكن الوثوق بها تماماً. عندما نستقبل بيانات من مصدر خارجي، لا سبيل لأن تكون مكتوبة النوع أصلاً عندما تصل إلينا. علينا اتخاذ قرارات حول كيفية التعامل مع عدم اليقين المصاحب لذلك.</p>
<p>قاعدة ESlint المعطّلة كانت تشير إلى أن الإسناد التالي محفوف بالمخاطر:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> newDiaryEntry = diaryService.<span class="hljs-title function_">addDiary</span>({
  date,
  weather,
  visibility,
  comment,
});
</code></pre>
<p>نودّ الحصول على ضمان بأن الكائن في طلب POST من النوع الصحيح. لنعرّف الآن دالة <em>parseNewDiaryEntry</em> تستقبل جسم الطلب كمعامل وتُرجع كائن <em>NewDiaryEntry</em> مكتوب النوع بشكل صحيح. ستُعرَّف الدالة في ملف <em>utils.ts</em>.</p>
<p>يستخدم تعريف المسار الدالة كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> parseNewDiaryEntry <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../utils.ts&#x27;</span>;
<span class="hljs-comment">// ...</span>

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =&gt;</span> {
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> newDiaryEntry = <span class="hljs-title function_">parseNewDiaryEntry</span>(req.<span class="hljs-property">body</span>); <span class="hljs-comment">// HIGHLIGHT LINE</span>
    <span class="hljs-keyword">const</span> addedEntry = diaryService.<span class="hljs-title function_">addDiary</span>(newDiaryEntry);   <span class="hljs-comment">// HIGHLIGHT LINE</span>
    res.<span class="hljs-title function_">json</span>(addedEntry);
  } <span class="hljs-keyword">catch</span> (<span class="hljs-attr">error</span>: unknown) {
    <span class="hljs-keyword">let</span> errorMessage = <span class="hljs-string">&#x27;Something went wrong.&#x27;</span>;
    <span class="hljs-keyword">if</span> (error <span class="hljs-keyword">instanceof</span> <span class="hljs-title class_">Error</span>) {
      errorMessage += <span class="hljs-string">&#x27; Error: &#x27;</span> + error.<span class="hljs-property">message</span>;
    }
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>(errorMessage);
  }
})
</code></pre>
<p>يمكننا الآن أيضاً إزالة السطر الأول الذي يتجاهل قاعدة ESLint ‏<em>no-unsafe-assignment</em>.</p>
<p>وبما أننا نكتب الآن شيفرة آمنة ونحاول ضمان حصولنا بالضبط على البيانات التي نريدها من الطلبات، ينبغي أن نبدأ بتحليل والتحقق من صحة كل حقل نتوقع استقباله.</p>
<p>يبدو هيكل دالة <em>parseNewDiaryEntry</em> كالتالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NewDiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./types.ts&#x27;</span>;

<span class="hljs-keyword">const</span> parseNewDiaryEntry = (object): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
    <span class="hljs-comment">// ...</span>
  };

  <span class="hljs-keyword">return</span> newEntry;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> parseNewDiaryEntry;
</code></pre>
<p>ينبغي أن تحلل الدالة كل حقل وأن تتأكد من أن قيمة الإرجاع من النوع <em>NewDiaryEntry</em> بالضبط. يعني هذا أنه يجب علينا فحص كل حقل على حدة.</p>
<p>مرة أخرى، لدينا مشكلة نوع: ما نوع المعامل <em>object</em>؟ بما أن <em>object</em> هو جسم طلب، فقد كتبه Express بالنوع <em>any</em>. ولأن فكرة هذه الدالة هي تحويل حقول مجهولة النوع إلى حقول بالنوع الصحيح والتحقق مما إذا كانت معرّفة كما هو متوقع، فقد تكون هذه هي الحالة النادرة التي <em>نريد فيها السماح بالنوع <strong>any</strong></em>.</p>
<p>لكن إذا كتبنا نوع الكائن كـ<em>any</em>، تشتكي ESLint من ذلك:</p>
<p><img src="/images/mooc/1f1eac7a30f8.webp" alt="صورة توضيحية"></p>
<p>يمكننا تجاهل قاعدة ESlint لكن الفكرة الأفضل هي اتباع إحدى النصائح التي يعرضها المحرر في <em>Quick Fix</em> وضبط نوع المعامل على <em>unknown</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> type { <span class="hljs-title class_">NewDiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./types.ts&#x27;</span>;

<span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
    <span class="hljs-comment">// ...</span>
  }

  <span class="hljs-keyword">return</span> newEntry;
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> parseNewDiaryEntry;
</code></pre>
<p><a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown" target="_blank" rel="noreferrer noopener">unknown</a> هو النوع الأمثل لحالتنا هذه من التحقق من صحة المدخلات، لأننا لا نحتاج بعد إلى تعريف نوع يطابق <em>any</em>، بل يمكننا أولاً التحقق من النوع ثم تأكيد أنه النوع المتوقع. باستخدام <em>unknown</em> لا نحتاج أيضاً للقلق بشأن قاعدة ESlint ‏<em>@typescript-eslint/no-explicit-any</em>، لأننا لا نستخدم <em>any</em>. غير أننا قد نحتاج مع ذلك إلى استخدام <em>any</em> في بعض الحالات التي لا نكون فيها بعد متأكدين من النوع ونحتاج إلى الوصول إلى خصائص كائن من نوع <em>any</em> للتحقق من قيم الخصائص نفسها أو فحص أنواعها.</p>
<blockquote>
<p>ملاحظة جانبية من المحرّر</p>
<p><em>إذا كنت مثلي وتكره أن تبقى شيفرتك في حالة معطوبة لفترة طويلة بسبب أنواع غير مكتملة، يمكنك البدء بـ«تزييف» الدالة:</em></p>
<p>const parseNewDiaryEntry = (object: unknown): NewDiaryEntry =&gt; {</p>
<p>console.log(object); // الآن لم يعد object غير مستخدم
const newEntry: NewDiaryEntry = {
weather: 'cloudy', // زيِّف قيمة الإرجاع
visibility: 'great',
date: '2026-1-1',
comment: 'fake news'
};</p>
<p>return newEntry;
};</p>
<p><em>إذن، قبل أن تصبح البيانات والأنواع الحقيقية جاهزة للاستخدام، أُعيد هنا شيئاً من النوع الصحيح بالتأكيد. تبقى الشيفرة في حالة تشغيلية طوال الوقت ويبقى ضغط دمي في مستوياته الطبيعية.</em></p>
</blockquote>
<h3 id="حراس-الأنواع">حرّاس الأنواع</h3>
<p>لنبدأ بإنشاء المحلّلات لكل حقل من حقول المعامل <em>object: unknown</em>.</p>
<p>للتحقق من صحة حقل <em>comment</em>، علينا فحص وجوده والتأكد من أنه من النوع <em>string</em>.</p>
<p>ينبغي أن تبدو الدالة هكذا تقريباً:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> parseComment = (<span class="hljs-attr">comment</span>: <span class="hljs-built_in">unknown</span>): <span class="hljs-built_in">string</span> =&amp;gt; {
  <span class="hljs-keyword">if</span> (!comment || !<span class="hljs-title function_">isString</span>(comment)) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing comment&#x27;</span>);
  }

  <span class="hljs-keyword">return</span> comment;
};
</code></pre>
<p>تستقبل الدالة معاملاً من نوع <em>unknown</em> وتُرجعه بالنوع <em>string</em> إذا كان موجوداً وبالنوع الصحيح.</p>
<p>تبدو دالة التحقق من النص كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> isString = (<span class="hljs-attr">text</span>: unknown): text is string =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">typeof</span> text === <span class="hljs-string">&#x27;string&#x27;</span> || text <span class="hljs-keyword">instanceof</span> <span class="hljs-title class_">String</span>;
};
</code></pre>
<p>الدالة هي ما يُسمى <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" target="_blank" rel="noreferrer noopener">حارس نوع</a> (type guard). يعني ذلك أنها دالة تُرجع قيمة منطقية <em>و</em> لديها <em>مُحمَّل نوع</em> (type predicate) كنوع إرجاع. في حالتنا، مُحمَّل النوع هو:</p>
<pre><code>text is string
</code></pre>
<p>الصيغة العامة لمُحمَّل النوع هي <em>parameterName is Type</em> حيث <em>parameterName</em> هو اسم معامل الدالة و<em>Type</em> هو النوع المستهدف.</p>
<p>إذا أعادت دالة حارس النوع القيمة true، يعرف مترجم TypeScript أن المتغير المفحوص من النوع المعرَّف في مُحمَّل النوع.</p>
<p>قبل استدعاء حارس النوع، لا يكون النوع الفعلي للمتغير <em>comment</em> معروفاً:</p>
<p><img src="/images/mooc/83b148edd27a.webp" alt="صورة توضيحية"></p>
<p>لكن بعد الاستدعاء، إذا استمرت الشيفرة بعد الاستثناء (أي أن حارس النوع أعاد true)، يعرف المترجم أن <em>comment</em> من النوع <em>string</em></p>
<p><img src="/images/mooc/2cd1b17a0381.webp" alt="صورة توضيحية"></p>
<p>استخدام حارس نوع يُرجع مُحمَّل نوع هو إحدى طرق القيام بـ<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">تضييق النوع</a> (type narrowing)، أي إعطاء متغير نوع أكثر صرامة أو دقة. وكما سنرى قريباً، هناك أيضاً أنواع أخرى من <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">حرّاس الأنواع</a> متاحة.</p>
<blockquote>
<p>ملاحظة جانبية: اختبار ما إذا كان شيء ما نصاً</p>
<p><em>لماذا لدينا شرطان في حارس نوع النص؟</em></p>
<p>const isString = (text: unknown): text is string =&gt; {
return typeof text === 'string' || text instanceof String;}</p>
<p><em>ألا يكفي كتابة الحارس هكذا؟</em></p>
<p>const isString = (text: unknown): text is string =&gt; {
return typeof text === 'string';
}</p>
<p><em>على الأرجح، الصيغة الأبسط كافية لجميع الأغراض العملية. لكن إذا أردنا التأكد، فثمة حاجة إلى الشرطين معاً. هناك طريقتان مختلفتان لإنشاء نص في JavaScript، إحداهما كنوع أولي (primitive) والأخرى ككائن، وكلتاهما تعمل بشكل مختلف قليلاً عند مقارنتهما بالمعاملين <strong>typeof</strong> و<strong>instanceof</strong>:</em></p>
<p>const a = &quot;I'm a string primitive&quot;;
const b = new String(&quot;I'm a String Object&quot;);
typeof a; --&gt; returns 'string'
typeof b; --&gt; returns 'object'
a instanceof String; --&gt; returns false
b instanceof String; --&gt; returns true</p>
<p><em>غير أنه من غير المرجح أن ينشئ أحد نصاً بدالة إنشاء (constructor). على الأرجح ستكون النسخة الأبسط من حارس النوع كافية تماماً.</em></p>
</blockquote>
<p>بعد ذلك، لننظر في حقل <em>date</em>. تحليل كائن التاريخ والتحقق من صحته مشابه جداً لما فعلناه مع التعليقات. وبما أن TypeScript لا يعرف نوعاً للتاريخ، علينا التعامل معه كنص <em>string</em>. ينبغي مع ذلك أن نستخدم تحققاً على مستوى JavaScript لفحص ما إذا كانت صيغة التاريخ مقبولة.</p>
<p>سنضيف الدالتين التاليتين:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> isDate = (<span class="hljs-attr">date</span>: <span class="hljs-built_in">string</span>): <span class="hljs-built_in">boolean</span> =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">Boolean</span>(<span class="hljs-title class_">Date</span>.<span class="hljs-title function_">parse</span>(date));
};

<span class="hljs-keyword">const</span> parseDate = (<span class="hljs-attr">date</span>: <span class="hljs-built_in">unknown</span>): <span class="hljs-built_in">string</span> =&amp;gt; {
  <span class="hljs-keyword">if</span> (!date || !<span class="hljs-title function_">isString</span>(date) || !<span class="hljs-title function_">isDate</span>(date)) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing date: &#x27;</span> + date);
  }
  <span class="hljs-keyword">return</span> date;
};
</code></pre>
<p>الشيفرة ليست شيئاً مميزاً. الأمر الوحيد هو أننا لا نستطيع استخدام حارس نوع مبني على مُحمَّل نوع هنا، لأن التاريخ في هذه الحالة يُعتبر مجرد <em>string</em>. لاحظ أنه رغم أن دالة <em>parseDate</em> تقبل المتغير <em>date</em> بوصفه <em>unknown</em>، فبعد فحص نوعه بـ<em>isString</em>، يعرف مترجم TypeScript أن نوعه <em>string</em>، ولهذا يمكننا إعطاء المتغير لدالة <em>isDate</em> التي تتطلب نصاً دون أي مشاكل.</p>
<p>أخيراً، نحن جاهزون للانتقال إلى النوعين الأخيرين، <em>Weather</em> و<em>Visibility</em>.</p>
<p>نريد أن يعمل التحقق والتحليل كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> parseWeather = (<span class="hljs-attr">weather</span>: unknown): <span class="hljs-title class_">Weather</span> =&amp;gt; {
  <span class="hljs-keyword">if</span> (!weather || !<span class="hljs-title function_">isString</span>(weather) || !<span class="hljs-title function_">isWeather</span>(weather)) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing weather: &#x27;</span> + weather);
  }
  <span class="hljs-keyword">return</span> weather;
};
</code></pre>
<p>السؤال هو: كيف يمكننا التحقق من أن النص بصيغة محددة؟ إحدى الطرق الممكنة لكتابة حارس النوع هي هذه:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> isWeather = (<span class="hljs-attr">str</span>: <span class="hljs-built_in">string</span>): str is <span class="hljs-title class_">Weather</span> =&amp;gt; {
  <span class="hljs-keyword">return</span> [<span class="hljs-string">&#x27;sunny&#x27;</span>, <span class="hljs-string">&#x27;rainy&#x27;</span>, <span class="hljs-string">&#x27;cloudy&#x27;</span>, <span class="hljs-string">&#x27;stormy&#x27;</span>].<span class="hljs-title function_">includes</span>(str);
};
</code></pre>
<p>سيعمل هذا بشكل جيد، لكن المشكلة أن قائمة القيم الممكنة لـWeather لا تبقى بالضرورة متزامنة مع تعريفات الأنواع إذا عُدّل النوع. هذا بالتأكيد ليس جيداً، لأننا نريد مصدراً واحداً فقط لجميع أنواع الطقس الممكنة.</p>
<h3 id="كائن-as-const">كائن as const</h3>
<p>في حالتنا، سيكون الحل الأفضل هو تحسين نوع Weather نفسه. بدلاً من اسم نوع مستعار، يمكننا استخدام <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions">كائن const</a>، وهو يتيح لنا استخدام القيم الفعلية في شيفرتنا في وقت التشغيل، وليس في مرحلة الترجمة فقط.</p>
<p>لنُعِد تعريف النوع Weather كما يلي:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title class_">Weather</span> = {
  <span class="hljs-title class_">Sunny</span>: <span class="hljs-string">&#x27;sunny&#x27;</span>,
  <span class="hljs-title class_">Rainy</span>: <span class="hljs-string">&#x27;rainy&#x27;</span>,
  <span class="hljs-title class_">Cloudy</span>: <span class="hljs-string">&#x27;cloudy&#x27;</span>,
  <span class="hljs-title class_">Stormy</span>: <span class="hljs-string">&#x27;stormy&#x27;</span>,
  <span class="hljs-title class_">Windy</span>: <span class="hljs-string">&#x27;windy&#x27;</span>,
} <span class="hljs-keyword">as</span> <span class="hljs-keyword">const</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">Weather</span> = <span class="hljs-keyword">typeof</span> <span class="hljs-title class_">Weather</span>[keyof <span class="hljs-keyword">typeof</span> <span class="hljs-title class_">Weather</span>];
</code></pre>
<p>لاحظ أننا نعرّف كائناً ثابتاً (const object) ونوعاً بالاسم نفسه. يتيح TypeScript ذلك لأنهما يعيشان في مساحتَي أسماء منفصلتين. النوع مشتق مباشرةً من قيم الكائن، لذا يبقيان متزامنين تلقائياً دائماً.</p>
<p>الآن يمكننا التحقق من أن نصاً ما هو إحدى القيم المقبولة، ويمكن كتابة حارس النوع هكذا:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> isWeather = (<span class="hljs-attr">param</span>: <span class="hljs-built_in">string</span>): param is <span class="hljs-title class_">Weather</span> =&amp;gt; {
  <span class="hljs-keyword">return</span> (<span class="hljs-title class_">Object</span>.<span class="hljs-title function_">values</span>(<span class="hljs-title class_">Weather</span>) <span class="hljs-keyword">as</span> <span class="hljs-built_in">string</span>[]).<span class="hljs-title function_">includes</span>(param);
};
</code></pre>
<p>لا يوجد شيء مفاجئ في المحلّل:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> parseWeather = (<span class="hljs-attr">weather</span>: unknown): <span class="hljs-function"><span class="hljs-params">Weather</span> =&gt;</span> {&lt;br&gt;  <span class="hljs-keyword">if</span> (!weather || !<span class="hljs-title function_">isString</span>(weather) || !<span class="hljs-title function_">isWeather</span>(weather)) {&lt;br&gt;    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing weather: &#x27;</span> + weather);&lt;br&gt;  }&lt;br&gt;  <span class="hljs-keyword">return</span> weather;&lt;br&gt;};
</code></pre>
<p>ما زلنا بحاجة إلى إعطاء المعاملة نفسها للنوع Visibility. يبدو <em>كائن const</em> كما يلي:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title class_">Visibility</span> = {
  <span class="hljs-title class_">Great</span>: <span class="hljs-string">&#x27;great&#x27;</span>,
  <span class="hljs-title class_">Good</span>: <span class="hljs-string">&#x27;good&#x27;</span>,
  <span class="hljs-title class_">Ok</span>: <span class="hljs-string">&#x27;ok&#x27;</span>,
  <span class="hljs-title class_">Poor</span>: <span class="hljs-string">&#x27;poor&#x27;</span>,
} <span class="hljs-keyword">as</span> <span class="hljs-keyword">const</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">Visibility</span> = <span class="hljs-keyword">typeof</span> <span class="hljs-title class_">Visibility</span>[keyof <span class="hljs-keyword">typeof</span> <span class="hljs-title class_">Visibility</span>];
</code></pre>
<p>حارس النوع والمحلّل أدناه:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> isVisibility = (<span class="hljs-attr">param</span>: <span class="hljs-built_in">string</span>): param is <span class="hljs-title class_">Visibility</span> =&amp;gt; {
  <span class="hljs-keyword">return</span> (<span class="hljs-title class_">Object</span>.<span class="hljs-title function_">values</span>(<span class="hljs-title class_">Visibility</span>) <span class="hljs-keyword">as</span> <span class="hljs-built_in">string</span>[]).<span class="hljs-title function_">includes</span>(param);
};

<span class="hljs-keyword">const</span> parseVisibility = (<span class="hljs-attr">visibility</span>: <span class="hljs-built_in">unknown</span>): <span class="hljs-title class_">Visibility</span> =&amp;gt; {
  <span class="hljs-keyword">if</span> (!visibility || !<span class="hljs-title function_">isString</span>(visibility) || !<span class="hljs-title function_">isVisibility</span>(visibility)) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing visibility: &#x27;</span> + visibility);
  }
  <span class="hljs-keyword">return</span> visibility;
};
</code></pre>
<hr>
<p>تُستخدم كائنات <em>as const</em> عادةً عندما تكون هناك مجموعة قيم محددة سلفاً لا يُتوقع أن تتغير مستقبلاً. وهي تقدّم طريقة رائعة للتحقق من القيم الواردة مع بقائها كائنات JavaScript عادية، مما يجعلها أكثر مرونة في بعض الحالات من <a href="https://www.typescriptlang.org/docs/handbook/enums.html">enums</a>، التي كانت سابقاً خياراً شائعاً لتعريف غرض مشابه.</p>
<blockquote>
<p><strong>ما هو في الحقيقة النوع Visibility وكائن Visibility</strong></p>
<p>عندما عرّفنا</p>
<p>export const Visibility = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof Visibility[keyof typeof Visibility];<br></p>
<p>عرّفنا شيئين متميزين، <em>كائن const المسمى Visibility</em> و<em>النوع Visibility</em>، ومن المثير للاهتمام أن TypeScript يتيح تعايشهما رغم حمل الاسم نفسه.</p>
<p>إذا مرّرنا المؤشر فوق النوع Visibility، نرى ما هو في الحقيقة:</p>
<p>إذن هو ببساطة يُختزل إلى اتحاد أربع قيم نصية حرفية. يمكن استخدامه مثلاً كما يلي:</p>
<p>const x: Visibility = &quot;great&quot;;<br>const y: Visibility = Visibility.Ok;</p>
<p>في المثال الأخير، نستخدم كائن const المسمى Visibility ونسند قيمته Ok (أي النص <em>ok</em>) إلى y.</p>
<p>يمكننا أيضاً استخدام أسماء مختلفة لكائن const والنوع:</p>
<p>export const VisibilityValues = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof VisibilityValues[keyof typeof VisibilityValues];</p>
<p>عندها يصبح الحارس</p>
<p>import { VisibilityValues, type Visibility, ... } from './types.ts';<br><br>const isVisibility = (param: string): param is Visibility =&gt; {<br>  return (Object.values(VisibilityValues) as string[]).includes(param);<br>};</p>
<p>في هذه الحالة، سنحتاج أيضاً إلى استيراد كليهما على حدة الآن. وبعد أن فهمنا ما يجري، سنلتزم باستخدام الاسم نفسه لكليهما لأنه يجعل الشيفرة أقل إسهاباً قليلاً.</p>
<p>لكن لا يزال هناك سؤال واحد. ما هو بحق العالم</p>
<p>typeof Visibility[keyof typeof Visibility]</p>
<p>لنفككه خطوة بخطوة. يعطيك <em>typeof Visibility</em> نوع الكائن نفسه:</p>
<p>{
readonly Great: 'great',
readonly Good: 'good',
readonly Ok: 'ok',
readonly Poor: 'poor',
}</p>
<p>يستخرج <em>keyof</em> جميع مفاتيح ذلك النوع كاتحاد:</p>
<p>'Great' | 'Good' | 'Ok' | 'Poor'</p>
<p>الطبقة الأخيرة، الفهرسة في <em>typeof Visibility</em> باستخدام تلك المفاتيح، تبحث عن <em>أنواع القيم</em> لكل مفتاح من الكائن <em>Visibility</em>، منتجةً اتحاداً لجميع أنواع القيم (وهي في حالتنا مجرد نصوص حرفية):</p>
<p>'great' | 'good' | 'ok' | 'poor'</p>
</blockquote>
<p>أخيراً، يمكننا إنهاء دالة parseNewDiaryEntry التي تتولى التحقق من صحة حقول جسم POST وتحليلها. غير أن هناك أمراً آخر يجب الاعتناء به. إذا حاولنا الوصول إلى حقول المعامل <em>object</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
    <span class="hljs-attr">comment</span>: <span class="hljs-title function_">parseComment</span>(object.<span class="hljs-property">comment</span>),
    <span class="hljs-attr">date</span>: <span class="hljs-title function_">parseDate</span>(object.<span class="hljs-property">date</span>),
    <span class="hljs-attr">weather</span>: <span class="hljs-title function_">parseWeather</span>(object.<span class="hljs-property">weather</span>),
    <span class="hljs-attr">visibility</span>: <span class="hljs-title function_">parseVisibility</span>(object.<span class="hljs-property">visibility</span>)
  };

  <span class="hljs-keyword">return</span> newEntry;
};
</code></pre>
<p>لا تجتاز الشيفرة فحص الأنواع:</p>
<p><img src="/images/mooc/0ccf77e2393b.webp" alt="صورة توضيحية"></p>
<p>السبب هو أن نوع <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noreferrer noopener">unknown</a> لا يسمح بأي عمليات، لذا لا يمكن الوصول إلى الحقول:</p>
<p>يمكننا إصلاح المشكلة مرة أخرى بتضييق النوع. لدينا الآن حارسا نوع، أولهما يفحص وجود كائن المعامل وأنه من النوع <em>object</em>. بعد ذلك، يستخدم حارس النوع الثاني المعامل <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a> للتأكد من أن الكائن يملك جميع الحقول المطلوبة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">if</span> ( !object || <span class="hljs-keyword">typeof</span> object !== <span class="hljs-string">&#x27;object&#x27;</span> ) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing data&#x27;</span>);
  }

  <span class="hljs-keyword">if</span> (<span class="hljs-string">&#x27;comment&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;date&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;weather&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;visibility&#x27;</span> <span class="hljs-keyword">in</span> object)  {
    <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
      <span class="hljs-attr">weather</span>: <span class="hljs-title function_">parseWeather</span>(object.<span class="hljs-property">weather</span>),
      <span class="hljs-attr">visibility</span>: <span class="hljs-title function_">parseVisibility</span>(object.<span class="hljs-property">visibility</span>),
      <span class="hljs-attr">date</span>: <span class="hljs-title function_">parseDate</span>(object.<span class="hljs-property">date</span>),
      <span class="hljs-attr">comment</span>: <span class="hljs-title function_">parseComment</span>(object.<span class="hljs-property">comment</span>)
    };

    <span class="hljs-keyword">return</span> newEntry;
  }

  <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect data: some fields are missing&#x27;</span>);
};
</code></pre>
<p>إذا لم يُقيَّم الحارس إلى true، يُرمى استثناء.</p>
<p>استخدام المعامل <em>in</em> يضمن فعلياً وجود الحقول في الكائن. وبسبب ذلك، لم تعد فحوصات الوجود في المحلّلات ضرورية:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> parseVisibility = (<span class="hljs-attr">visibility</span>: unknown): <span class="hljs-function"><span class="hljs-params">Visibility</span> =&gt;</span> {
  <span class="hljs-comment">// أُزيل فحص !visibility</span>
  <span class="hljs-keyword">if</span> (!<span class="hljs-title function_">isString</span>(visibility) || !<span class="hljs-title function_">isVisibility</span>(visibility)) { <span class="hljs-comment">// HIGHLIGHT LINE</span>
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect visibility: &#x27;</span> + visibility);
  }
  <span class="hljs-keyword">return</span> visibility;
};
</code></pre>
<p>إذا كان حقل ما، مثل <em>comment</em>، اختيارياً، ينبغي أن يأخذ تضييق النوع ذلك في الحسبان، ولم يكن ممكناً استخدام المعامل <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a> تماماً كما فعلنا هنا، لأن اختبار <em>in</em> يتطلب وجود الحقل.</p>
<p>إذا حاولنا الآن إنشاء مدخلة مذكرة جديدة بحقول غير صالحة أو ناقصة، نحصل على رسالة خطأ مناسبة:</p>
<p><img src="/images/mooc/1de244de9cca.webp" alt="صورة توضيحية"></p>
<p>يمكن العثور على الشيفرة المصدرية للتطبيق على <a href="https://github.com/fullstack-hy2020/flightdiary/tree/part1" target="_blank" rel="noreferrer noopener">GitHub</a>.</p>
<div class="tasks">
<p><strong>13. الواجهة الخلفية لـPatientor، الخطوة 5</strong></p>
</div>
<div class="tasks">
<p><strong>14. الواجهة الخلفية لـPatientor، الخطوة 6</strong></p>
</div>
<h4 id="استخدام-مكتبات-التحقق-من-المخططات">استخدام مكتبات التحقق من المخططات</h4>
<p>كتابة مدقّق لجسم الطلب قد تكون عبئاً كبيراً. لحسن الحظ، توجد عدة <em>مكتبات للتحقق من المخططات</em> (schema validator libraries) يمكنها المساعدة. لنلقِ الآن نظرة على <a href="https://zod.dev/" target="_blank" rel="noreferrer noopener">Zod</a> التي تعمل بشكل جيد جداً مع TypeScript.</p>
<p>لنبدأ:</p>
<pre><code class="language-bash">npm install zod
</code></pre>
<p>إن محلّلات الحقول ذات القيم الأولية مثل</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> isString = (<span class="hljs-attr">text</span>: <span class="hljs-built_in">unknown</span>): text is <span class="hljs-built_in">string</span> =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">typeof</span> text === <span class="hljs-string">&#x27;string&#x27;</span> || text <span class="hljs-keyword">instanceof</span> <span class="hljs-title class_">String</span>;
};

<span class="hljs-keyword">const</span> parseComment = (<span class="hljs-attr">comment</span>: <span class="hljs-built_in">unknown</span>): <span class="hljs-built_in">string</span> =&amp;gt; {
  <span class="hljs-keyword">if</span> (!<span class="hljs-title function_">isString</span>(comment)) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect comment&#x27;</span>);
  }

  <span class="hljs-keyword">return</span> comment;
};
</code></pre>
<p>يسهل استبدالها كما يلي:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> { z } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;zod&#x27;</span>;

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> parseComment = (<span class="hljs-attr">comment</span>: <span class="hljs-built_in">unknown</span>): <span class="hljs-function"><span class="hljs-params">string</span> =&gt;</span> {
  <span class="hljs-keyword">return</span> z.<span class="hljs-title function_">string</span>().<span class="hljs-title function_">parse</span>(comment);
};
</code></pre>
<p>أولاً تُستخدم دالة <a href="https://zod.dev/?id=strings" target="_blank" rel="noreferrer noopener">string</a> في Zod لتعريف النوع المطلوب (أو <em>المخطط</em> بمصطلحات Zod). بعد ذلك يُحلَّل المتغير (وهو من النوع <em>unknown</em>) بالدالة <a href="https://zod.dev/?id=parse" target="_blank" rel="noreferrer noopener">parse</a> التي تُرجع القيمة بالنوع المطلوب أو ترمي استثناءً.</p>
<p>لا نحتاج فعلياً إلى الدالة المساعدة <em>parseComment</em> بعد الآن، ويمكننا استخدام محلّل Zod مباشرةً:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">if</span> ( !object || <span class="hljs-keyword">typeof</span> object !== <span class="hljs-string">&#x27;object&#x27;</span> ) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing data&#x27;</span>);
  }

  <span class="hljs-keyword">if</span> (<span class="hljs-string">&#x27;comment&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;date&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;weather&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;visibility&#x27;</span> <span class="hljs-keyword">in</span> object)  {
    <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
      <span class="hljs-attr">weather</span>: <span class="hljs-title function_">parseWeather</span>(object.<span class="hljs-property">weather</span>),
      <span class="hljs-attr">visibility</span>: <span class="hljs-title function_">parseVisibility</span>(object.<span class="hljs-property">visibility</span>),
      <span class="hljs-attr">date</span>: <span class="hljs-title function_">parseDate</span>(object.<span class="hljs-property">date</span>),
      <span class="hljs-attr">comment</span>: z.<span class="hljs-title function_">string</span>().<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">comment</span>)     <span class="hljs-comment">// HIGHLIGHT LINE</span>
    };

    <span class="hljs-keyword">return</span> newEntry;
  }

  <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect data: some fields are missing&#x27;</span>);
};
</code></pre>
<p>لدى Zod مجموعة من عمليات التحقق الخاصة بالنصوص، مثلاً واحدة تتحقق مما إذا كان النص <a href="https://zod.dev/?id=dates" target="_blank" rel="noreferrer noopener">تاريخاً</a> صالحاً، لذا نتخلص أيضاً من محلّل حقل التاريخ:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">if</span> ( !object || <span class="hljs-keyword">typeof</span> object !== <span class="hljs-string">&#x27;object&#x27;</span> ) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing data&#x27;</span>);
  }

  <span class="hljs-keyword">if</span> (<span class="hljs-string">&#x27;comment&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;date&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;weather&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;visibility&#x27;</span> <span class="hljs-keyword">in</span> object)  {
    <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
      <span class="hljs-attr">weather</span>: <span class="hljs-title function_">parseWeather</span>(object.<span class="hljs-property">weather</span>),
      <span class="hljs-attr">visibility</span>: <span class="hljs-title function_">parseVisibility</span>(object.<span class="hljs-property">visibility</span>),
      <span class="hljs-attr">date</span>: z.<span class="hljs-property">iso</span>.<span class="hljs-title function_">date</span>().<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">date</span>),      <span class="hljs-comment">// HIGHLIGHT LINE</span>
      <span class="hljs-attr">comment</span>: z.<span class="hljs-title function_">string</span>().<span class="hljs-title function_">optional</span>().<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">comment</span>)    <span class="hljs-comment">// HIGHLIGHT LINE</span>
    };

    <span class="hljs-keyword">return</span> newEntry;
  }

  <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect data: some fields are missing&#x27;</span>);
};
</code></pre>
<p>قرّرنا أيضاً جعل حقل التعليق <a href="https://zod.dev/?id=optional" target="_blank" rel="noreferrer noopener">اختيارياً</a>.</p>
<p>مدقّق Zod الخاص بـ<a href="https://zod.dev/api?id=enums" target="_blank" rel="noreferrer noopener">enums</a> يناسب حالة تكون فيها المدخلات الممكنة مجموعة ثابتة من النصوص، وهذه هي الحالة مع weather وvisibility.</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">if</span> ( !object || <span class="hljs-keyword">typeof</span> object !== <span class="hljs-string">&#x27;object&#x27;</span> ) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect or missing data&#x27;</span>);
  }

  <span class="hljs-keyword">if</span> (<span class="hljs-string">&#x27;comment&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;date&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;weather&#x27;</span> <span class="hljs-keyword">in</span> object &amp;amp;&amp;amp; <span class="hljs-string">&#x27;visibility&#x27;</span> <span class="hljs-keyword">in</span> object)  {
    <span class="hljs-keyword">const</span> <span class="hljs-attr">newEntry</span>: <span class="hljs-title class_">NewDiaryEntry</span> = {
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      <span class="hljs-attr">weather</span>: z.<span class="hljs-title function_">enum</span>(<span class="hljs-title class_">Weather</span>).<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">weather</span>),
      <span class="hljs-attr">visibility</span>: z.<span class="hljs-title function_">enum</span>(<span class="hljs-title class_">Visibility</span>).<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">visibility</span>),
<span class="hljs-comment">// END HIGHLIGHT</span>
      <span class="hljs-attr">date</span>: z.<span class="hljs-property">iso</span>.<span class="hljs-title function_">date</span>().<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">date</span>),
      <span class="hljs-attr">comment</span>: z.<span class="hljs-title function_">string</span>().<span class="hljs-title function_">parse</span>(object.<span class="hljs-property">comment</span>)
    };

  <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Incorrect data: some fields are missing&#x27;</span>);
};
</code></pre>
<p>حتى الآن استخدمنا Zod فقط لتحليل نوع أو مخطط الحقول الفردية، لكن يمكننا المضي خطوة أبعد وتعريف <em>مدخلة المذكرة الجديدة</em> كاملةً كمخطط <a href="https://zod.dev/?id=objects" target="_blank" rel="noreferrer noopener">كائن</a> في Zod:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">NewEntrySchema</span> = z.<span class="hljs-title function_">object</span>({
  <span class="hljs-attr">weather</span>: z.<span class="hljs-title function_">enum</span>(<span class="hljs-title class_">Weather</span>),
  <span class="hljs-attr">visibility</span>: z.<span class="hljs-title function_">enum</span>(<span class="hljs-title class_">Visibility</span>),
  <span class="hljs-attr">date</span>: z.<span class="hljs-property">iso</span>.<span class="hljs-title function_">date</span>(),
  <span class="hljs-attr">comment</span>: z.<span class="hljs-title function_">string</span>().<span class="hljs-title function_">optional</span>()
});
</code></pre>
<p>الآن يكفي استدعاء <em>parse</em> على المخطط المعرَّف:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">NewEntrySchema</span>.<span class="hljs-title function_">parse</span>(object);
};
</code></pre>
<p>بمساعدة <a href="https://zod.dev/basics?id=handling-errors" target="_blank" rel="noreferrer noopener">التوثيق</a> يمكننا أيضاً تحسين معالجة الأخطاء:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { z } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;zod&#x27;</span>;

<span class="hljs-comment">//</span>

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =&gt;</span> {
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> newDiaryEntry = <span class="hljs-title function_">parseNewDiaryEntry</span>(req.<span class="hljs-property">body</span>);
    <span class="hljs-keyword">const</span> addedEntry = diaryService.<span class="hljs-title function_">addDiary</span>(newDiaryEntry);
    res.<span class="hljs-title function_">json</span>(addedEntry);
  } <span class="hljs-keyword">catch</span> (<span class="hljs-attr">error</span>: unknown) {
   <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-keyword">if</span> (error <span class="hljs-keyword">instanceof</span> z.<span class="hljs-property">ZodError</span>) {
      res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">issues</span> });
    } <span class="hljs-keyword">else</span> {
      res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;unknown error&#x27;</span> });
    }
   <span class="hljs-comment">// END HIGHLIGHT</span>
  }
});
</code></pre>
<p>تبدو الاستجابة في حالة الخطأ جيدة جداً:</p>
<p><img src="/images/mooc/2039abaa78c4.webp" alt="صورة توضيحية"></p>
<p>يمكننا تطوير حلنا بضع خطوات أخرى. تبدو تعريفات أنواعنا حالياً هكذا:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> <span class="hljs-title class_">DiaryEntry</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">date</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">weather</span>: <span class="hljs-title class_">Weather</span>;
  <span class="hljs-attr">visibility</span>: <span class="hljs-title class_">Visibility</span>;
  <span class="hljs-attr">comment</span>?: <span class="hljs-built_in">string</span>;
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">NewDiaryEntry</span> = <span class="hljs-title class_">Omit</span>&amp;lt;<span class="hljs-title class_">DiaryEntry</span>, <span class="hljs-string">&#x27;id&#x27;</span>&amp;gt;;
</code></pre>
<p>إذن، إلى جانب النوع <em>NewDiaryEntry</em> لدينا أيضاً مخطط Zod باسم <em>NewEntrySchema</em> يعرّف شكل المدخلة الجديدة. يمكننا استخدام المخطط لـ<a href="https://zod.dev/?id=type-inference" target="_blank" rel="noreferrer noopener">استنتاج</a> النوع:</p>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> { z } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;zod&#x27;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">NewEntrySchema</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./utils.ts&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> <span class="hljs-title class_">DiaryEntry</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">date</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">weather</span>: <span class="hljs-title class_">Weather</span>;
  <span class="hljs-attr">visibility</span>: <span class="hljs-title class_">Visibility</span>;
  <span class="hljs-attr">comment</span>?: <span class="hljs-built_in">string</span>;
}

<span class="hljs-comment">// استنتاج النوع من المخطط</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">NewDiaryEntry</span> = z.<span class="hljs-property">infer</span>&amp;lt;<span class="hljs-keyword">typeof</span> <span class="hljs-title class_">NewEntrySchema</span>&gt;;
</code></pre>
<p>يمكننا المضي في هذا أبعد قليلاً وتعريف <em>DiaryEntry</em> انطلاقاً من <em>NewDiaryEntry</em>:</p>
<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">type</span> <span class="hljs-title class_">NewDiaryEntry</span> = z.<span class="hljs-property">infer</span>&amp;lt;<span class="hljs-keyword">typeof</span> <span class="hljs-title class_">NewEntrySchema</span>&gt;;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> <span class="hljs-title class_">DiaryEntry</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">NewDiaryEntry</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">number</span>;
}
</code></pre>
<p>يزيل هذا كل التكرار في تعريفات الأنواع والمخططات. يبدو الأمر رجعياً بعض الشيء، لكن للأسف العكس غير ممكن: لا يمكننا تعريف مخطط Zod انطلاقاً من تعريفات أنواع TypeScript، لذا أصبح مخطط Zod الآن المصدر الوحيد لنوعنا. وبما أن المخطط هو أيضاً أساس النوع، سننقل تعريف المخطط إلى ملف <em>types.ts</em>.</p>
<p>يمكن العثور على الحالة الحالية للشيفرة المصدرية في فرع part2 من مستودع GitHub ‏<a href="https://github.com/fullstack-hy2020/flightdiary/tree/part2" target="_blank" rel="noreferrer noopener">هذا</a>.</p>
<h3 id="تحليل-جسم-الطلب-في-الوسيط">تحليل جسم الطلب في الوسيط</h3>
<p>يمكننا الآن التخلص من هذه الدالة كلياً</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> parseNewDiaryEntry = (<span class="hljs-attr">object</span>: unknown): <span class="hljs-function"><span class="hljs-params">NewDiaryEntry</span> =&gt;</span> {
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">NewEntrySchema</span>.<span class="hljs-title function_">parse</span>(object);
};
</code></pre>
<p>واستدعاء محلّل Zod مباشرةً في معالج المسار:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">NewEntrySchema</span>, type <span class="hljs-title class_">NonSensitiveDiaryEntry</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../types.ts&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-function">(<span class="hljs-params">req, res</span>) =&gt;</span> {  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> newDiaryEntry = <span class="hljs-title class_">NewEntrySchema</span>.<span class="hljs-title function_">parse</span>(req.<span class="hljs-property">body</span>); <span class="hljs-comment">// HIGHLIGHT LINE</span>
    <span class="hljs-keyword">const</span> addedEntry = diaryService.<span class="hljs-title function_">addDiary</span>(newDiaryEntry);
    res.<span class="hljs-title function_">json</span>(addedEntry);

  } <span class="hljs-keyword">catch</span> (<span class="hljs-attr">error</span>: unknown) {
    <span class="hljs-keyword">if</span> (error <span class="hljs-keyword">instanceof</span> z.<span class="hljs-property">ZodError</span>) {
      res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">issues</span> });
    } <span class="hljs-keyword">else</span> {
      res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;unknown error&#x27;</span> });
    }
  }
});
</code></pre>
<p>يمكننا المضي قدماً خطوة إضافية. فبدلاً من استدعاء دالة تحليل جسم الطلب صراحةً في معالج المسار، يمكن أيضاً إجراء التحقق من صحة المدخلات في دالة وسيط.</p>
<p>أضفنا أيضاً تعريفات الأنواع إلى معاملات معالج المسار، وسنستخدم الأنواع أيضاً في دالة الوسيط <em>newDiaryParser</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> express, { type <span class="hljs-title class_">Request</span>, type <span class="hljs-title class_">Response</span>, type <span class="hljs-title class_">NextFunction</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;express&#x27;</span>;

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">newDiaryParser</span> = (<span class="hljs-params">req: Request, _res: Response, next: NextFunction</span>) =&gt; {
  <span class="hljs-keyword">try</span> {
    <span class="hljs-title class_">NewEntrySchema</span>.<span class="hljs-title function_">parse</span>(req.<span class="hljs-property">body</span>);
    <span class="hljs-title function_">next</span>();
  } <span class="hljs-keyword">catch</span> (<span class="hljs-attr">error</span>: unknown) {
    <span class="hljs-title function_">next</span>(error);
  }
};
</code></pre>
<p>يستدعي الوسيط فقط محلّل المخطط على جسم الطلب. وإذا رمى التحليل استثناءً، يُمرَّر إلى وسيط معالجة الأخطاء.</p>
<p>إذن، بعد أن يجتاز الطلب هذا الوسيط، <em>يُعرف أن جسم الطلب مدخلة مذكرة جديدة سليمة</em>. يمكننا إخبار مترجم TypeScript بهذه الحقيقة بإعطاء معامل نوع لـ<em>Request</em>:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, newDiaryParser, <span class="hljs-function">(<span class="hljs-params">req: Request&amp;lt;unknown, unknown, NewDiaryEntry&gt;, res: Response&amp;lt;DiaryEntry&gt;</span>) =&gt;</span> {
  <span class="hljs-keyword">const</span> addedEntry = diaryService.<span class="hljs-title function_">addDiary</span>(req.<span class="hljs-property">body</span>);
  res.<span class="hljs-title function_">json</span>(addedEntry);
});
</code></pre>
<p>بفضل الوسيط، أصبح جسم الطلب معروف النوع الصحيح ويمكن إعطاؤه مباشرةً كمعامل للدالة <em>diaryService.addDiary</em>.</p>
<p>تبدو صيغة <em>Request&lt;unknown, unknown, NewDiaryEntry&gt;</em> غريبة بعض الشيء. النوع <em>Request</em> هو <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">نوع عام</a> له عدة معاملات نوع. معامل النوع الثالث يمثّل جسم الطلب، ولكي نعطيه القيمة <em>NewDiaryEntry</em> علينا إعطاء <em>قيمة ما</em> للمعاملين الأولين. نقرر تعريفهما كـ<em>unknown</em> لأننا لا نحتاجهما الآن.</p>
<p>وبما أن الأخطاء المحتملة في التحقق تُعالج الآن في وسيط معالجة الأخطاء، نحتاج إلى تعريف وسيط يتعامل مع أخطاء Zod بشكل صحيح:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">errorMiddleware</span> = (<span class="hljs-params">error: unknown, _req: Request, res: Response, next: NextFunction</span>) =&gt; {
  <span class="hljs-keyword">if</span> (error <span class="hljs-keyword">instanceof</span> z.<span class="hljs-property">ZodError</span>) {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">400</span>).<span class="hljs-title function_">send</span>({ <span class="hljs-attr">error</span>: error.<span class="hljs-property">issues</span> });
  } <span class="hljs-keyword">else</span> {
    <span class="hljs-title function_">next</span>(error);
  }
};

router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, newDiaryParser, <span class="hljs-function">(<span class="hljs-params">req: Request&amp;lt;unknown, unknown, NewDiaryEntry&gt;, res: Response&amp;lt;DiaryEntry&gt;</span>) =&gt;</span> {
  <span class="hljs-comment">// ...</span>
});

router.<span class="hljs-title function_">use</span>(errorMiddleware); <span class="hljs-comment">// HIGHLIGHT LINE</span>
</code></pre>
<p>يمكن العثور على النسخة النهائية من الشيفرة المصدرية في فرع part3 من مستودع GitHub ‏<a href="https://github.com/fullstack-hy2020/flightdiary/tree/part3" target="_blank" rel="noreferrer noopener">هذا</a>.</p>
<div class="tasks">
<p><strong>15. الواجهة الخلفية لـPatientor، الخطوة 7</strong></p>
</div>
<div class="tasks">
<p><strong>16. فحص</strong></p>
</div>
`,c={part:9,letter:"d",file:s,title:n,slug:a,mainImage:p,headings:t,html:l};export{c as default,s as file,t as headings,l as html,r as letter,p as mainImage,e as part,a as slug,n as title};
