const e=2,o="c",s="part2c.md",n="جلب البيانات من الخادم",a="getting_data_from_server",p="/images/part-2.svg",t=[{depth:3,id:"المتصفح-كبيئة-تشغيل",text:"المتصفح كبيئة تشغيل"},{depth:3,id:"npm",text:"npm"},{depth:3,id:"axios-و-promises",text:"Axios و promises"},{depth:3,id:"خطافات-التأثير",text:"خطافات التأثير"},{depth:3,id:"بيئة-التشغيل-أثناء-التطوير",text:"بيئة التشغيل أثناء التطوير"},{depth:3,id:"التمرين-211",text:"التمرين 2.11."}],l=`<div class="content">
<p>حتى الآن كنا نعمل فقط على «الواجهة الأمامية»، أي وظائف جهة العميل (المتصفح). سنبدأ العمل على «الواجهة الخلفية»، أي وظائف جهة الخادم، في <a href="/part3">الجزء الثالث</a> من هذه الدورة. ومع ذلك، سنخطو الآن خطوة في ذلك الاتجاه بالتعرّف على كيفية تواصل الشيفرة التي تُنفَّذ في المتصفح مع الواجهة الخلفية.</p>
<p>لنستخدم أداة مخصّصة للاستخدام أثناء تطوير البرمجيات تُدعى <a href="https://github.com/typicode/json-server">JSON Server</a> لتؤدي دور الخادم لدينا.</p>
<p>أنشئ ملفاً باسم <i>db.json</i> في الدليل الجذر لمشروع <i>notes</i> السابق بالمحتوى التالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;notes&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
    <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;1&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;content&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;HTML is easy&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;important&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span>
    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
    <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;2&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;content&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Browser can execute only JavaScript&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;important&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">false</span></span>
    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
    <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;3&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;content&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;GET and POST are the most important methods of HTTP protocol&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;important&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">]</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يمكنك تشغيل JSON Server دون تثبيت منفصل بتنفيذ أمر <em>npx</em> التالي في الدليل الجذر للتطبيق:</p>
<pre><code class="language-js">npx json-server --port <span class="hljs-number">3001</span> db.<span class="hljs-property">json</span>
</code></pre>
<p>يبدأ JSON Server العمل على المنفذ 3000 افتراضياً، لكننا سنحدّد الآن منفذاً بديلاً هو 3001. لننتقل إلى العنوان <a href="http://localhost:3001/notes">http://localhost:3001/notes</a> في المتصفح. يمكننا أن نرى أن JSON Server يقدّم الملاحظات التي كتبناها سابقاً في الملف بصيغة JSON:</p>
<p><img src="/images/content/2/14new.webp" alt="الملاحظات بصيغة JSON في المتصفح على localhost:3001/notes"></p>
<p>إذا لم يكن متصفحك يوفّر طريقة لتنسيق عرض بيانات JSON، فثبّت إضافة مناسبة، مثل <a href="https://chromewebstore.google.com/detail/gmegofmjomhknnokphhckolhcffdaihd">JSONView</a>، لتسهيل حياتك.</p>
<p>من الآن فصاعداً، ستكون الفكرة هي حفظ الملاحظات في الخادم، ما يعني في هذه الحالة حفظها في json-server. تجلب شيفرة React الملاحظات من الخادم وتعرضها على الشاشة. وكلما أُضيفت ملاحظة جديدة إلى التطبيق، ترسلها شيفرة React أيضاً إلى الخادم لتبقى الملاحظة الجديدة محفوظة في «الذاكرة».</p>
<p>يخزّن json-server كل البيانات في ملف <i>db.json</i> الموجود على الخادم. في الواقع العملي، ستُخزَّن البيانات في نوع ما من قواعد البيانات. غير أن json-server أداة عملية تتيح استخدام وظائف جهة الخادم في مرحلة التطوير دون الحاجة إلى برمجة أي منها.</p>
<p>سنتعرّف على مبادئ تنفيذ وظائف جهة الخادم بمزيد من التفصيل في <a href="/part3">الجزء 3</a> من هذه الدورة.</p>
<h3 id="المتصفح-كبيئة-تشغيل">المتصفح كبيئة تشغيل</h3>
<p>مهمتنا الأولى هي جلب الملاحظات الموجودة مسبقاً إلى تطبيق React لدينا من العنوان <a href="http://localhost:3001/notes">http://localhost:3001/notes</a>.</p>
<p>في <a href="/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser">المشروع المثال</a> من الجزء 0، تعلّمنا بالفعل طريقة لجلب البيانات من خادم باستخدام JavaScript. كانت الشيفرة في المثال تجلب البيانات باستخدام <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a>، المعروف أيضاً بطلب HTTP يُنفَّذ باستخدام كائن XHR. هذه تقنية طُرحت عام 1999، ويدعمها كل متصفح منذ زمن طويل.</p>
<p>لم يعد استخدام XHR موصى به، والمتصفحات تدعم على نطاق واسع الدالة <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch">fetch</a> المبنية على ما يُسمى <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">promises</a>، بدلاً من النموذج المدفوع بالأحداث الذي يستخدمه XHR.</p>
<p>وكتذكير من الجزء 0 (الذي ينبغي <i>تذكّر عدم استخدامه</i> دون سبب ملحّ)، كانت البيانات تُجلب باستخدام XHR بالطريقة التالية:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> xhttp = <span class="hljs-keyword">new</span> <span class="hljs-title class_">XMLHttpRequest</span>()

xhttp.<span class="hljs-property">onreadystatechange</span> = <span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">if</span> (<span class="hljs-variable language_">this</span>.<span class="hljs-property">readyState</span> == <span class="hljs-number">4</span> &amp;&amp; <span class="hljs-variable language_">this</span>.<span class="hljs-property">status</span> == <span class="hljs-number">200</span>) {
    <span class="hljs-keyword">const</span> data = <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">parse</span>(<span class="hljs-variable language_">this</span>.<span class="hljs-property">responseText</span>)
    <span class="hljs-comment">// عالج الاستجابة المحفوظة في المتغير data</span>
  }
}

xhttp.<span class="hljs-title function_">open</span>(<span class="hljs-string">&#x27;GET&#x27;</span>, <span class="hljs-string">&#x27;/data.json&#x27;</span>, <span class="hljs-literal">true</span>)
xhttp.<span class="hljs-title function_">send</span>()
</code></pre>
<p>في البداية تماماً، نسجّل <i>معالج حدث</i> على كائن <em>xhttp</em> الذي يمثّل طلب HTTP، وسيستدعيه وقت تشغيل JavaScript كلما تغيّرت حالة كائن <em>xhttp</em>. وإذا كان تغيّر الحالة يعني أن استجابة الطلب قد وصلت، فتُعالَج البيانات وفقاً لذلك.</p>
<p>من الجدير بالملاحظة أن الشيفرة في معالج الحدث تُعرَّف قبل إرسال الطلب إلى الخادم. ورغم ذلك، ستُنفَّذ الشيفرة داخل معالج الحدث في نقطة زمنية لاحقة. لذا لا تُنفَّذ الشيفرة بشكل متزامن «من الأعلى إلى الأسفل»، بل تُنفَّذ <i>بشكل غير متزامن</i>. يستدعي JavaScript معالج الحدث المسجَّل للطلب في مرحلة ما.</p>
<p>الطريقة المتزامنة لتنفيذ الطلبات الشائعة في برمجة Java، على سبيل المثال، ستسير على النحو التالي (ملاحظة: هذه ليست شيفرة Java عاملة فعلاً):</p>
<pre><code class="language-java"><span class="hljs-type">HTTPRequest</span> <span class="hljs-variable">request</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">HTTPRequest</span>();

<span class="hljs-type">String</span> <span class="hljs-variable">url</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;https://studies.cs.helsinki.fi/exampleapp/data.json&quot;</span>;
<span class="hljs-type">List</span>&lt;Note&gt; <span class="hljs-variable">notes</span> <span class="hljs-operator">=</span> request.get(url);

notes.forEach(m =&gt; {
  System.out.println(m.content);
});
</code></pre>
<p>في Java، تُنفَّذ الشيفرة سطراً بسطر وتتوقف لتنتظر طلب HTTP، أي تنتظر انتهاء الأمر <em>request.get(...)</em>. ثم تُخزَّن البيانات التي يعيدها الأمر، وهي الملاحظات في هذه الحالة، في متغير، ونبدأ في التعامل مع البيانات بالطريقة المطلوبة.</p>
<p>وفي المقابل، تتبع محرّكات JavaScript، أو بيئات التشغيل، <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop">النموذج غير المتزامن</a>. من حيث المبدأ، يتطلب ذلك تنفيذ جميع <a href="https://en.wikipedia.org/wiki/Input/output">عمليات الإدخال/الإخراج</a> (مع بعض الاستثناءات) بشكل غير حاجب. وهذا يعني أن تنفيذ الشيفرة يستمر فوراً بعد استدعاء دالة إدخال/إخراج، دون انتظار عودتها.</p>
<p>وعندما تكتمل عملية غير متزامنة، أو بشكل أدق، في نقطة ما بعد اكتمالها، يستدعي محرّك JavaScript معالجات الأحداث المسجَّلة على العملية.</p>
<p>حالياً، محرّكات JavaScript <i>أحادية الخيط</i>، ما يعني أنها لا تستطيع تنفيذ الشيفرة على التوازي. ونتيجة لذلك، من الضروري عملياً استخدام نموذج غير حاجب لتنفيذ عمليات الإدخال/الإخراج. وإلا «يتجمّد» المتصفح أثناء جلب البيانات من خادم مثلاً.</p>
<p>من نتائج كون محرّكات JavaScript أحادية الخيط أنه إذا استغرق تنفيذ الشيفرة وقتاً طويلاً، يصبح المتصفح غير مستجيب طوال مدة التنفيذ. إذا أُضيفت الشيفرة التالية إلى بداية مكوّن <i>App</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params">props</span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>(props.<span class="hljs-property">notes</span>)
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [showAll, setShowAll] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>)

  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;loop..&#x27;</span>)
    <span class="hljs-keyword">let</span> i = <span class="hljs-number">0</span>
    <span class="hljs-keyword">while</span> (i &lt; <span class="hljs-number">99999999999</span>) {
      i++
    }
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;end&#x27;</span>)
  }, <span class="hljs-number">5000</span>)
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>يعمل كل شيء بشكل طبيعي لمدة خمس ثوانٍ. وعندما تُنفَّذ الدالة المعرّفة كوسيط لـ<em>setTimeout</em>، تصبح صفحة المتصفح غير مستجيبة طوال مدة الحلقة الطويلة. تتجمّد الصفحة تماماً، أي لا يمكنك النقر على أزرارها أو استخدام أي وظيفة أخرى.</p>
<p>لكي يبقى المتصفح <i>مستجيباً</i>، أي قادراً على التفاعل باستمرار مع عمليات المستخدم بسرعة كافية، يجب أن يكون منطق الشيفرة بحيث لا تستغرق أي عملية حسابية واحدة وقتاً طويلاً جداً.</p>
<p>توجد على الإنترنت مواد إضافية كثيرة حول الموضوع. ومن أوضح العروض في هذا الموضوع الكلمة الرئيسية لـPhilip Roberts بعنوان <a href="https://www.youtube.com/watch?v=8aGhZQkoFbQ">What the heck is the event loop anyway?</a></p>
<p>في متصفحات اليوم، يمكن تشغيل شيفرة متوازية بمساعدة ما يُسمى <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">web workers</a>. غير أن حلقة الأحداث لنافذة متصفح واحدة لا يزال يتولاها <a href="https://medium.com/techtrument/multithreading-javascript-46156179cf9a">خيط واحد</a> فقط.</p>
<h3 id="npm">npm</h3>
<p>لنعد إلى موضوع جلب البيانات من الخادم.</p>
<p>يمكننا استخدام الدالة <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch">fetch</a> المبنية على promises والمذكورة سابقاً لجلب البيانات من الخادم. إن fetch أداة رائعة، فهي معيارية ومدعومة في جميع المتصفحات الحديثة (باستثناء IE).</p>
<p>ومع ذلك، سنستخدم مكتبة <a href="https://github.com/axios/axios">axios</a> بدلاً منها للتواصل بين المتصفح والخادم. فهي تعمل مثل fetch لكن استخدامها أكثر متعة بعض الشيء. وهناك سبب وجيه آخر لاستخدام Axios هو أنه يساعدنا على التعرّف على إضافة مكتبات خارجية، أو <i>حزم npm</i>، إلى مشاريع React.</p>
<p>في أيامنا هذه، تُعرَّف جميع مشاريع JavaScript عملياً باستخدام مدير حزم node، المعروف اختصاراً بـ<a href="https://docs.npmjs.com/about-npm">npm</a>. والمشاريع المنشأة باستخدام Vite تتبع أيضاً صيغة npm. ومن المؤشرات الواضحة على أن مشروعاً يستخدم npm وجود ملف <i>package.json</i> في جذر المشروع:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;part2-notes-frontend&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;private&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;version&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;0.0.0&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;module&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;build&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite build&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;lint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;eslint .&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;preview&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite preview&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;dependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.1&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;react-dom&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.1&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;devDependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;@eslint/js&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^9.17.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;@types/react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.18&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;@types/react-dom&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.5&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;@vitejs/plugin-react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^4.3.4&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;eslint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^9.17.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;eslint-plugin-react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^7.37.2&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;eslint-plugin-react-hooks&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^5.0.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;eslint-plugin-react-refresh&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^0.4.16&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;globals&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^15.14.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;vite&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^6.0.5&quot;</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>في هذه المرحلة، يهمّنا أكثر من غيره قسم <i>dependencies</i> لأنه يحدّد ما للمشروع من <i>اعتماديات</i>، أو مكتبات خارجية.</p>
<p>نريد الآن استخدام axios. نظرياً، يمكننا تعريف المكتبة مباشرة في ملف <i>package.json</i>، لكن الأفضل تثبيتها من سطر الأوامر.</p>
<pre><code class="language-js">npm install axios
</code></pre>
<p><strong>ملاحظة: يجب دائماً تنفيذ أوامر <em>npm</em> في الدليل الجذر للمشروع</strong>، حيث يوجد ملف <i>package.json</i>.</p>
<p>أصبح axios الآن مُدرَجاً بين الاعتماديات الأخرى:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;part2-notes-frontend&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;private&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">true</span></span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;version&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;0.0.0&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;type&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;module&quot;</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;build&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite build&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;lint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;eslint .&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;preview&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite preview&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-attr">&quot;dependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;axios&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^1.7.9&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-attr">&quot;react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.1&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;react-dom&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^18.3.1&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ...</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>إضافةً إلى إضافة axios إلى الاعتماديات، فإن أمر <em>npm install</em> <i>نزّل</i> أيضاً شيفرة المكتبة. وكما هو الحال مع الاعتماديات الأخرى، تجد الشيفرة في دليل <i>node_modules</i> الموجود في الجذر. وكما لاحظت ربما، يحتوي <i>node_modules</i> على قدر لا بأس به من الأشياء المثيرة للاهتمام.</p>
<p>لنُجرِ إضافة أخرى. ثبّت <i>json-server</i> كاعتمادية تطوير (تُستخدم أثناء التطوير فقط) بتنفيذ الأمر:</p>
<pre><code class="language-js">npm install json-server --save-dev
</code></pre>
<p>وأجرِ إضافة صغيرة إلى قسم <i>scripts</i> في ملف <i>package.json</i>:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">// ... </span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;build&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite build&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;lint&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;eslint .&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;preview&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;vite preview&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;server&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;json-server -p 3001 db.json&quot;</span> <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يمكننا الآن بسهولة، ودون تعريف وسائط، تشغيل json-server من الدليل الجذر للمشروع بالأمر:</p>
<pre><code class="language-js">npm run server
</code></pre>
<p>سنتعرّف على أداة <em>npm</em> أكثر في <a href="/part3">الجزء الثالث من الدورة</a>.</p>
<p><strong>ملاحظة</strong> يجب إيقاف json-server الذي شُغّل سابقاً قبل تشغيل واحد جديد؛ وإلا ستقع في مشكلة:</p>
<p><img src="/images/content/2/15b.webp" alt="خطأ تعذّر الارتباط بالمنفذ 3001"></p>
<p>النص الأحمر في رسالة الخطأ يخبرنا بالمشكلة:</p>
<p><i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i></p>
<p>كما نرى، لا يستطيع التطبيق الارتباط بـ<a href="https://en.wikipedia.org/wiki/Port_(computer_networking)">المنفذ</a>. والسبب أن المنفذ 3001 مشغول بالفعل بـjson-server الذي شُغّل سابقاً.</p>
<p>استخدمنا الأمر <em>npm install</em> مرتين، لكن مع اختلاف طفيف:</p>
<pre><code class="language-js">npm install axios
npm install json-server --save-dev
</code></pre>
<p>هناك فرق دقيق في الوسائط. فـ<i>axios</i> تُثبَّت كاعتمادية تشغيل للتطبيق لأن تنفيذ البرنامج يتطلب وجود المكتبة. في المقابل، ثُبّت <i>json-server</i> كاعتمادية تطوير (<em>--save-dev</em>)، لأن البرنامج نفسه لا يحتاجها. فهي تُستخدم للمساعدة أثناء تطوير البرمجيات. وسنوضّح المزيد عن الاعتماديات المختلفة في الجزء التالي من الدورة.</p>
<h3 id="axios-و-promises">Axios و promises</h3>
<p>نحن الآن جاهزون لاستخدام Axios. من الآن فصاعداً، نفترض أن json-server يعمل على المنفذ 3001.</p>
<p>ملاحظة: لتشغيل json-server وتطبيق React في الوقت نفسه، قد تحتاج إلى استخدام نافذتي طرفية. واحدة لإبقاء json-server يعمل، والأخرى لتشغيل تطبيق React.</p>
<p>يمكن إدخال المكتبة إلى الاستخدام بالطريقة نفسها التي تُستخدم بها المكتبات الأخرى، أي باستخدام عبارة <em>import</em> مناسبة.</p>
<p>أضف ما يلي إلى الملف <i>main.jsx</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>

<span class="hljs-keyword">const</span> promise = axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(promise)

<span class="hljs-keyword">const</span> promise2 = axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/foobar&#x27;</span>)
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(promise2)
</code></pre>
<p>إذا فتحت <a href="http://localhost:5173/">http://localhost:5173/</a> في المتصفح، فينبغي أن يُطبع هذا في وحدة التحكم</p>
<p><img src="/images/content/2/16new.webp" alt="promises مطبوعة في وحدة التحكم"></p>
<p>تعيد دالة <em>get</em> في Axios <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">promise</a>.</p>
<p>تقول الوثائق على موقع Mozilla ما يلي عن promises:</p>
<blockquote>
<p><i>الـ promise كائن يمثّل الاكتمال أو الفشل النهائي لعملية غير متزامنة.</i></p>
</blockquote>
<p>بعبارة أخرى، الـ promise كائن يمثّل عملية غير متزامنة. ويمكن أن يكون للـ promise ثلاث حالات مميزة:</p>
<ul>
<li>الـ promise <i>قيد الانتظار</i> (pending): يعني أن العملية غير المتزامنة المقابلة للـ promise لم تنتهِ بعد وأن القيمة النهائية غير متاحة حتى الآن.</li>
<li>الـ promise <i>مُنجَز</i> (fulfilled): يعني أن العملية اكتملت والقيمة النهائية متاحة، وهي عملية ناجحة عموماً.</li>
<li>الـ promise <i>مرفوض</i> (rejected): يعني أن خطأ منع تحديد القيمة النهائية، وهو ما يمثّل عموماً عملية فاشلة.</li>
</ul>
<p>هناك تفاصيل كثيرة تتعلق بـpromises، لكن فهم هذه الحالات الثلاث يكفينا الآن. وإذا أردت، يمكنك قراءة المزيد عن promises في <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">وثائق Mozilla</a>.</p>
<p>الـ promise الأولى في مثالنا <i>مُنجَزة</i>، وتمثّل طلب <em>axios.get('http://localhost:3001/notes')</em> ناجحاً. أما الثانية فهي <i>مرفوضة</i>، وتخبرنا وحدة التحكم بالسبب. يبدو أننا كنا نحاول تنفيذ طلب HTTP GET إلى عنوان غير موجود.</p>
<p>إذا أردنا، ومتى أردنا، الوصول إلى نتيجة العملية التي يمثّلها الـ promise، فيجب أن نسجّل معالج حدث على الـ promise. ويتحقق ذلك باستخدام الدالة <em>then</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> promise = axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)

promise.<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(response)
})
</code></pre>
<p>يُطبع ما يلي في وحدة التحكم:</p>
<p><img src="/images/content/2/17new.webp" alt="بيانات كائن JSON مطبوعة في وحدة التحكم"></p>
<p>تستدعي بيئة تشغيل JavaScript الدالة الاستدعائية المسجَّلة بواسطة الدالة <em>then</em> وتزوّدها بكائن <em>response</em> كوسيط. يحتوي كائن <em>response</em> على كل البيانات الأساسية المتعلقة باستجابة طلب HTTP GET، والتي تشمل <i>data</i> المُعادة، و<i>رمز الحالة</i>، و<i>الترويسات</i> (headers).</p>
<p>تخزين كائن الـ promise في متغير غير ضروري عموماً، ومن الشائع بدلاً من ذلك ربط استدعاء الدالة <em>then</em> باستدعاء دالة axios بحيث يليه مباشرة:</p>
<pre><code class="language-js">axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> notes = response.<span class="hljs-property">data</span>
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(notes)
})
</code></pre>
<p>تأخذ الدالة الاستدعائية الآن البيانات الموجودة داخل الاستجابة، وتخزّنها في متغير، وتطبع الملاحظات في وحدة التحكم.</p>
<p>هناك طريقة أوضح للقراءة لتنسيق استدعاءات الدوال <i>المتسلسلة</i>، وهي وضع كل استدعاء في سطر خاص به:</p>
<pre><code class="language-js">axios
  .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
  .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
    <span class="hljs-keyword">const</span> notes = response.<span class="hljs-property">data</span>
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(notes)
  })
</code></pre>
<p>البيانات التي يعيدها الخادم نص عادي، أي مجرد نص طويل واحد. ومع ذلك تستطيع مكتبة axios تحليل البيانات إلى مصفوفة JavaScript، لأن الخادم حدّد أن صيغة البيانات هي <i>application/json; charset=utf-8</i> (انظر الصورة السابقة) باستخدام ترويسة <i>content-type</i>.</p>
<p>يمكننا أخيراً البدء في استخدام البيانات المجلوبة من الخادم.</p>
<p>لنجرّب طلب الملاحظات من خادمنا المحلي وعرضها، بدايةً في مكوّن App. لاحظ أن هذا الأسلوب فيه مشكلات كثيرة، لأننا نعرض مكوّن <i>App</i> بأكمله فقط عندما ننجح في جلب استجابة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">ReactDOM</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>
<span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App&#x27;</span>

axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
  <span class="hljs-keyword">const</span> notes = response.<span class="hljs-property">data</span>
  <span class="hljs-title class_">ReactDOM</span>.<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>)).<span class="hljs-title function_">render</span>(<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">App</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span></span>)
})
</code></pre>
<p>قد تكون هذه الطريقة مقبولة في بعض الظروف، لكنها إشكالية إلى حد ما. لننقل بدلاً من ذلك جلب البيانات إلى مكوّن <i>App</i>.</p>
<p>لكن ما ليس واضحاً مباشرة هو أين ينبغي وضع الأمر <em>axios.get</em> داخل المكوّن.</p>
<h3 id="خطافات-التأثير">خطافات التأثير</h3>
<p>استخدمنا بالفعل <a href="https://react.dev/learn/state-a-components-memory">خطافات الحالة</a> التي قُدّمت مع إصدار React <a href="https://www.npmjs.com/package/react/v/16.8.0">16.8.0</a>، والتي توفّر الحالة لمكوّنات React المعرّفة كدوال - أي ما يُسمى <i>المكوّنات الدالّية</i>. كما قدّم الإصدار 16.8.0 <a href="https://react.dev/reference/react/hooks#effect-hooks">خطافات التأثير</a> كميزة جديدة. ووفقاً للوثائق الرسمية:</p>
<blockquote>
<p><i>تتيح التأثيرات للمكوّن الاتصال بالأنظمة الخارجية والمزامنة معها.</i>
<i>ويشمل ذلك التعامل مع الشبكة، وDOM الخاص بالمتصفح، والرسوم المتحركة، والودجات المكتوبة باستخدام مكتبة واجهة مستخدم مختلفة، وأي شيفرة أخرى غير تابعة لـReact.</i></p>
</blockquote>
<p>وبذلك تكون خطافات التأثير هي الأداة الصحيحة تماماً لاستخدامها عند جلب البيانات من خادم.</p>
<p>لنُزِل جلب البيانات من <i>main.jsx</i>. وبما أننا سنسترد الملاحظات من الخادم، لم تعد هناك حاجة لتمرير البيانات كـprops إلى مكوّن <i>App</i>. لذا يمكن تبسيط <i>main.jsx</i> إلى:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">ReactDOM</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;react-dom/client&quot;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;./App&quot;</span>;

<span class="hljs-title class_">ReactDOM</span>.<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&quot;root&quot;</span>)).<span class="hljs-title function_">render</span>(<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span></span>);
</code></pre>
<p>يتغيّر مكوّن <i>App</i> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span> <span class="hljs-comment">// highlight-line</span>
<span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span> <span class="hljs-comment">// highlight-line</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Note</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Note&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; { <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([]) <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [showAll, setShowAll] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>)

<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)
    axios
      .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
        <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
        <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
      })
  }, [])

  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;render&#x27;</span>, notes.<span class="hljs-property">length</span>, <span class="hljs-string">&#x27;notes&#x27;</span>)
<span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>أضفنا أيضاً بعض الطبعات المفيدة التي توضّح تتابع التنفيذ.</p>
<p>يُطبع ما يلي في وحدة التحكم:</p>
<pre><code>render 0 notes
effect
promise fulfilled
render 3 notes
</code></pre>
<p>أولاً، يُنفَّذ جسم الدالة التي تعرّف المكوّن ويُعرض المكوّن لأول مرة. في هذه المرحلة تُطبع <i>render 0 notes</i>، ما يعني أن البيانات لم تُجلب من الخادم بعد.</p>
<p>الدالة التالية، أو التأثير (effect) بمصطلح React:</p>
<pre><code class="language-js">() =&gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)
  axios
    .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
    .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
      <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
    })
}
</code></pre>
<p>تُنفَّذ مباشرة بعد العرض. وينتج عن تنفيذ الدالة طباعة <i>effect</i> في وحدة التحكم، ويبدأ الأمر <em>axios.get</em> جلب البيانات من الخادم، كما يسجّل الدالة التالية كـ<i>معالج حدث</i> للعملية:</p>
<pre><code class="language-js">response =&gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
  <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
})
</code></pre>
<p>وعندما تصل البيانات من الخادم، يستدعي وقت تشغيل JavaScript الدالة المسجَّلة كمعالج حدث، فتُطبع <i>promise fulfilled</i> في وحدة التحكم وتُخزَّن الملاحظات المستلمة من الخادم في الحالة باستخدام الدالة <em>setNotes(response.data)</em>.</p>
<p>وكما هو الحال دائماً، يؤدي استدعاء دالة تحديث الحالة إلى إعادة عرض المكوّن. ونتيجة لذلك، تُطبع <i>render 3 notes</i> في وحدة التحكم، وتُعرض الملاحظات المجلوبة من الخادم على الشاشة.</p>
<p>أخيراً، لنلقِ نظرة على تعريف خطاف التأثير كاملاً:</p>
<pre><code class="language-js"><span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)
  axios
    .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
      <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
    })
}, [])
</code></pre>
<p>لنعد كتابة الشيفرة بطريقة مختلفة قليلاً.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">hook</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)
  axios
    .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
    .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
      <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
    })
}

<span class="hljs-title function_">useEffect</span>(hook, [])
</code></pre>
<p>الآن يمكننا أن نرى بوضوح أكبر أن الدالة <a href="https://react.dev/reference/react/useEffect">useEffect</a> تأخذ <i>وسيطين</i>. الأول دالة، وهي <i>التأثير</i> نفسه. ووفقاً للوثائق:</p>
<blockquote>
<p><i>افتراضياً، تعمل التأثيرات بعد كل عرض مكتمل، لكن يمكنك اختيار تشغيلها فقط عندما تتغيّر قيم معينة.</i></p>
</blockquote>
<p>إذن، افتراضياً، يعمل التأثير <i>دائماً</i> بعد عرض المكوّن. لكننا في حالتنا نريد فقط تنفيذ التأثير مع العرض الأول.</p>
<p>يُستخدم الوسيط الثاني لـ<em>useEffect</em> في <a href="https://react.dev/reference/react/useEffect#parameters">تحديد عدد مرات تشغيل التأثير</a>. وإذا كان الوسيط الثاني مصفوفة فارغة <em>[]</em>، فلا يعمل التأثير إلا مع العرض الأول للمكوّن.</p>
<p>هناك حالات استخدام ممكنة كثيرة لخطاف التأثير غير جلب البيانات من الخادم. غير أن هذا الاستخدام يكفينا في الوقت الحالي.</p>
<p>عُد بذاكرتك إلى تتابع الأحداث الذي ناقشناه للتو. أي أجزاء الشيفرة تُنفَّذ؟ وبأي ترتيب؟ وكم مرة؟ إن فهم ترتيب الأحداث أمر بالغ الأهمية!</p>
<p>لاحظ أنه كان يمكننا أيضاً كتابة شيفرة دالة التأثير بهذه الطريقة:</p>
<pre><code class="language-js"><span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">eventHandler</span> = response =&gt; {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
    <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
  }

  <span class="hljs-keyword">const</span> promise = axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
  promise.<span class="hljs-title function_">then</span>(eventHandler)
}, [])
</code></pre>
<p>يُسنَد مرجع إلى دالة معالج حدث إلى المتغير <em>eventHandler</em>. ويُخزَّن الـ promise الذي تعيده دالة <em>get</em> في Axios في المتغير <em>promise</em>. ويحدث تسجيل الدالة الاستدعائية بتمرير المتغير <em>eventHandler</em>، الذي يشير إلى دالة معالج الحدث، كوسيط إلى الدالة <em>then</em> الخاصة بالـ promise. وليس من الضروري عادةً إسناد الدوال والـ promises إلى متغيرات، ويكفي تمثيل أكثر إحكاماً كما هو موضح أدناه.</p>
<pre><code class="language-js"><span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect&#x27;</span>)
  axios
    .<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
    .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;promise fulfilled&#x27;</span>)
      <span class="hljs-title function_">setNotes</span>(response.<span class="hljs-property">data</span>)
    })
}, [])
</code></pre>
<p>لا تزال لدينا مشكلة في تطبيقنا. فعند إضافة ملاحظات جديدة، لا تُخزَّن في الخادم.</p>
<p>تجد شيفرة التطبيق كما وُصفت حتى الآن كاملةً على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-4">GitHub</a>، في الفرع <i>part2-4</i>.</p>
<h3 id="بيئة-التشغيل-أثناء-التطوير">بيئة التشغيل أثناء التطوير</h3>
<p>أصبح إعداد التطبيق بأكمله يزداد تعقيداً باطراد. لنستعرض ما يحدث وأين. تصف الصورة التالية تكوين التطبيق</p>
<p><img src="/images/content/2/18e.webp" alt="مخطط تكوين تطبيق React"></p>
<p>تُنفَّذ شيفرة JavaScript التي يتكوّن منها تطبيق React لدينا في المتصفح. ويحصل المتصفح على JavaScript من <i>خادم تطوير React</i>، وهو التطبيق الذي يعمل بعد تنفيذ الأمر <em>npm run dev</em>. ويحوّل خادم التطوير JavaScript إلى صيغة يفهمها المتصفح. ومن بين أمور أخرى، يدمج JavaScript من ملفات مختلفة في ملف واحد. وسنناقش خادم التطوير بمزيد من التفصيل في الجزء 7 من الدورة.</p>
<p>يجلب تطبيق React العامل في المتصفح البيانات بصيغة JSON من <i>json-server</i> العامل على المنفذ 3001 على الجهاز. والخادم الذي نستعلم منه عن البيانات - <i>json-server</i> - يحصل على بياناته من ملف <i>db.json</i>.</p>
<p>في هذه المرحلة من التطوير، تصادف أن جميع أجزاء التطبيق موجودة على جهاز مطوّر البرمجيات، المعروف أيضاً بـlocalhost. ويتغيّر الوضع عندما يُنشر التطبيق على الإنترنت. وسنفعل ذلك في الجزء 3.</p>
</div>
<div class="tasks">
<h3 id="التمرين-211">التمرين 2.11.</h3>
<h4 id="211-دفتر-الهاتف-الخطوة-6">2.11: دفتر الهاتف الخطوة 6</h4>
<p>نواصل تطوير دفتر الهاتف. خزّن الحالة الأولية للتطبيق في ملف <i>db.json</i>، الذي ينبغي وضعه في جذر المشروع.</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;persons&quot;</span><span class="hljs-punctuation">:</span><span class="hljs-punctuation">[</span>
    <span class="hljs-punctuation">{</span> 
      <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Arto Hellas&quot;</span><span class="hljs-punctuation">,</span> 
      <span class="hljs-attr">&quot;number&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;040-123456&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;1&quot;</span>
    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
    <span class="hljs-punctuation">{</span> 
      <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Ada Lovelace&quot;</span><span class="hljs-punctuation">,</span> 
      <span class="hljs-attr">&quot;number&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;39-44-5323523&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;2&quot;</span>
    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
    <span class="hljs-punctuation">{</span> 
      <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Dan Abramov&quot;</span><span class="hljs-punctuation">,</span> 
      <span class="hljs-attr">&quot;number&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;12-43-234345&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;3&quot;</span>
    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
    <span class="hljs-punctuation">{</span> 
      <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Mary Poppendieck&quot;</span><span class="hljs-punctuation">,</span> 
      <span class="hljs-attr">&quot;number&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;39-23-6423122&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;4&quot;</span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">]</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>شغّل json-server على المنفذ 3001 وتأكد من أن الخادم يعيد قائمة الأشخاص بالانتقال إلى العنوان <a href="http://localhost:3001/persons">http://localhost:3001/persons</a> في المتصفح.</p>
<p>إذا ظهرت لك رسالة الخطأ التالية:</p>
<pre><code class="language-js">events.<span class="hljs-property">js</span>:<span class="hljs-number">182</span>
      <span class="hljs-keyword">throw</span> er; <span class="hljs-comment">// Unhandled &#x27;error&#x27; event</span>
      ^

<span class="hljs-title class_">Error</span>: listen <span class="hljs-variable constant_">EADDRINUSE</span> <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span>:<span class="hljs-number">3001</span>
    at <span class="hljs-title class_">Object</span>.<span class="hljs-property">_errnoException</span> (util.<span class="hljs-property">js</span>:<span class="hljs-number">1019</span>:<span class="hljs-number">11</span>)
    at <span class="hljs-title function_">_exceptionWithHostPort</span> (util.<span class="hljs-property">js</span>:<span class="hljs-number">1041</span>:<span class="hljs-number">20</span>)
</code></pre>
<p>فهذا يعني أن المنفذ 3001 مستخدم بالفعل من تطبيق آخر، مثل json-server يعمل بالفعل. أغلق التطبيق الآخر، أو غيّر المنفذ إذا لم ينجح ذلك.</p>
<p>عدّل التطبيق بحيث تُجلب الحالة الأولية للبيانات من الخادم باستخدام مكتبة <i>axios</i>. أكمل الجلب باستخدام <a href="https://react.dev/reference/react/useEffect">خطاف تأثير</a>.</p>
</div>
`,c={part:2,letter:"c",file:s,title:n,slug:a,mainImage:p,headings:t,html:l};export{c as default,s as file,t as headings,l as html,o as letter,p as mainImage,e as part,a as slug,n as title};
