const e=3,o="b",s="part3b.md",a="نشر التطبيق على الإنترنت",n="deploying_app_to_internet",p="/images/part-3.svg",l=[{depth:3,id:"سياسة-الأصل-نفسه-وcors",text:"سياسة الأصل نفسه وCORS"},{depth:3,id:"نقل-التطبيق-إلى-الإنترنت",text:"نقل التطبيق إلى الإنترنت"},{depth:3,id:"بناء-الواجهة-الأمامية-للإنتاج",text:"بناء الواجهة الأمامية للإنتاج"},{depth:3,id:"تقديم-الملفات-الثابتة-من-الواجهة-الخلفية",text:"تقديم الملفات الثابتة من الواجهة الخلفية"},{depth:3,id:"نقل-التطبيق-كاملا-إلى-الإنترنت",text:"نقل التطبيق كاملاً إلى الإنترنت"},{depth:3,id:"تبسيط-نشر-الواجهة-الأمامية",text:"تبسيط نشر الواجهة الأمامية"},{depth:3,id:"الوكيل",text:"الوكيل"},{depth:3,id:"تمارين-39-311",text:"تمارين 3.9.-3.11"}],t=`<div class="content">
<p>لنربط الآن الواجهة الأمامية التي أنشأناها في <a href="/part2">الجزء 2</a> بالواجهة الخلفية Express التي بنيناها في الجزء 3أ.</p>
<p>في الجزء 2، كانت الواجهة الأمامية تجلب الملاحظات من json-server على العنوان http://localhost:3001/notes. الواجهة الخلفية Express التي بنيناها في هذا الجزء لها بنية URL مختلفة قليلاً — الملاحظات الآن على العنوان http://localhost:3001/api/notes. لنغيّر الخاصية <strong>baseUrl</strong> في تطبيق الملاحظات في الواجهة الأمامية في الملف <i>src/services/notes.js</i> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>
<span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;http://localhost:3001/api/notes&#x27;</span> <span class="hljs-comment">//highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">getAll</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> request = axios.<span class="hljs-title function_">get</span>(baseUrl)
  <span class="hljs-keyword">return</span> request.<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> response.<span class="hljs-property">data</span>)
}

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> { getAll, create, update }
</code></pre>
<p>الآن طلب GET من الواجهة الأمامية إلى <a href="http://localhost:3001/api/notes">http://localhost:3001/api/notes</a> لا يعمل لسبب ما:</p>
<p><img src="/images/content/3/3ae.webp" alt="طلب GET يُظهر خطأً في أدوات التطوير"></p>
<p>ما الذي يجري هنا؟ يمكننا الوصول إلى الواجهة الخلفية من المتصفح ومن postman دون أي مشاكل.</p>
<h3 id="سياسة-الأصل-نفسه-وcors">سياسة الأصل نفسه وCORS</h3>
<p>تكمن المشكلة في شيء يُسمى <em>سياسة الأصل نفسه</em> (same origin policy). يُعرَّف أصل عنوان URL بمزيج من البروتوكول (ويُسمى أيضاً المخطط scheme) واسم المضيف والمنفذ.</p>
<pre><code class="language-text">http://example.com:80/index.html
  
protocol: http
host: example.com
port: 80
</code></pre>
<p>عندما تزور موقعاً إلكترونياً (مثل <a href="http://example.com">http://example.com</a>)، يُرسل المتصفح طلباً إلى الخادم الذي يُستضاف عليه الموقع (example.com). الاستجابة التي يرسلها الخادم هي ملف HTML قد يحتوي على مرجع واحد أو أكثر إلى أصول أو موارد خارجية مستضافة إما على الخادم نفسه الذي يُستضاف عليه <i>example.com</i> أو على موقع آخر. عندما يرى المتصفح مرجعاً أو مراجع إلى عنوان URL في HTML المصدر، يُرسل طلباً. إذا أُرسل الطلب باستخدام عنوان URL نفسه الذي جُلب منه HTML المصدر، فسيعالج المتصفح الاستجابة دون أي مشاكل. أما إذا جُلب المورد باستخدام عنوان URL لا يشارك الأصل نفسه (المخطط، المضيف، المنفذ) مع HTML المصدر، فسيتعين على المتصفح فحص ترويسة الاستجابة <em>Access-Control-Allow-origin</em>. وإذا احتوت على <em>*</em> أو على عنوان URL الخاص بـ HTML المصدر، فسيعالج المتصفح الاستجابة، وإلا فسيرفض معالجتها ويرمي خطأً.</p>
<p>إن <strong>سياسة الأصل نفسه</strong> آلية أمنية ينفّذها المتصفحات لمنع اختطاف الجلسات (session hijacking) وغيرها من الثغرات الأمنية.</p>
<p>لتمكين الطلبات المشروعة عبر الأصول (الطلبات إلى عناوين URL التي لا تشارك الأصل نفسه)، ابتكرت W3C آلية تُسمى <strong>CORS</strong> (مشاركة الموارد عبر الأصول، Cross-Origin Resource Sharing). وفقاً لـ<a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing">ويكيبيديا</a>:</p>
<blockquote>
<p><i>مشاركة الموارد عبر الأصول (CORS) آلية تسمح بطلب موارد مقيّدة (مثل الخطوط) في صفحة ويب من نطاق آخر خارج النطاق الذي قُدّم منه المورد الأول. ويمكن لصفحة الويب أن تضمّن بحرية صوراً وأوراق أنماط وسكربتات وإطارات iframe وفيديوهات من أصول مختلفة. بعض الطلبات «عبر النطاقات»، وبخاصة طلبات Ajax، محظورة افتراضياً بموجب سياسة الأمان للأصل نفسه.</i></p>
</blockquote>
<p>المشكلة أن شيفرة JavaScript لتطبيق يعمل في المتصفح يمكنها افتراضياً التواصل فقط مع خادم في <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy">الأصل نفسه</a>. ولأن خادمنا على localhost في المنفذ 3001، بينما الواجهة الأمامية على localhost في المنفذ 5173، فليس لهما الأصل نفسه.</p>
<p>ضع في اعتبارك أن <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy">سياسة الأصل نفسه</a> وCORS ليستا خاصتين بـ React أو Node. إنهما مبدآن عامان يتعلقان بالتشغيل الآمن لتطبيقات الويب.</p>
<p>يمكننا السماح بالطلبات من <i>أصول</i> أخرى باستخدام الوسيط <a href="https://github.com/expressjs/cors">cors</a> الخاص بـ Node.</p>
<p>في مستودع الواجهة الخلفية لديك، ثبّت <i>cors</i> بالأمر</p>
<pre><code class="language-bash">npm install cors
</code></pre>
<p>خُذ الوسيط لاستخدامه واسمح بالطلبات من جميع الأصول:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> cors = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;cors&#x27;</span>)

app.<span class="hljs-title function_">use</span>(<span class="hljs-title function_">cors</span>())
</code></pre>
<p><strong>ملاحظة:</strong> عند تمكين cors، ينبغي أن تفكر في كيفية إعداده. في حالة تطبيقنا، وبما أنه لا يُتوقع أن تكون الواجهة الخلفية مرئية للعامة في بيئة الإنتاج، فقد يكون من المنطقي أكثر تمكين cors من أصل محدد فقط (مثل الواجهة الأمامية).</p>
<p>الآن تعمل معظم ميزات الواجهة الأمامية! لم تُنفَّذ بعد في الواجهة الخلفية وظيفة تغيير أهمية الملاحظات، لذا بطبيعة الحال لا تعمل بعد في الواجهة الأمامية. سنصلح ذلك لاحقاً.</p>
<p>يمكنك قراءة المزيد عن CORS من <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">صفحة Mozilla</a>.</p>
<p>يبدو إعداد تطبيقنا الآن كما يلي:</p>
<p><img src="/images/content/3/100_25.webp" alt="مخطط تطبيق React والمتصفح"></p>
<p>يجلب تطبيق React العامل في المتصفح الآن البيانات من خادم node/express العامل على localhost:3001.</p>
<h3 id="نقل-التطبيق-إلى-الإنترنت">نقل التطبيق إلى الإنترنت</h3>
<p>الآن بعد أن أصبحت المنظومة كاملة جاهزة، لننقل تطبيقنا إلى الإنترنت.</p>
<p>هناك عدد متزايد باستمرار من الخدمات التي يمكن استخدامها لاستضافة تطبيق على الإنترنت. تتولى الخدمات الصديقة للمطورين مثل PaaS (أي المنصة كخدمة، Platform as a Service) أمر تثبيت بيئة التنفيذ (مثل Node.js)، ويمكنها أيضاً توفير خدمات متنوعة مثل قواعد البيانات.</p>
<p>على مدى عقد من الزمن، هيمنت <a href="http://heroku.com">Heroku</a> على مشهد PaaS. لسوء الحظ انتهت الطبقة المجانية من Heroku في 27 نوفمبر 2022. هذا مؤسف جداً لكثير من المطورين، وخاصة الطلاب. لا يزال Heroku خياراً قابلاً للتطبيق جداً إذا كنت مستعداً لإنفاق بعض المال. لديهم أيضاً <a href="https://www.heroku.com/students">برنامج للطلاب</a> يوفر بعض الأرصدة المجانية.</p>
<p>نقدّم الآن خدمتين: <a href="https://fly.io/">Fly.io</a> و<a href="https://render.com/">Render</a>. توفّر Fly.io مرونة أكبر كخدمة، لكنها أصبحت مؤخراً مدفوعة أيضاً. توفّر Render بعض وقت الحوسبة المجاني، لذا إذا أردت إكمال الدورة دون تكاليف، فاختر Render. قد يكون إعداد Render أسهل أيضاً في بعض الحالات، لأن Render لا يتطلب أي عمليات تثبيت على جهازك.</p>
<p>هناك أيضاً بعض خيارات الاستضافة المجانية الأخرى التي تعمل جيداً مع هذه الدورة، على الأقل لجميع الأجزاء عدا الجزء 11 (CI/CD) الذي قد يحتوي على تمرين صعب بالنسبة للمنصات الأخرى.</p>
<p>استخدم بعض المشاركين في الدورة الخدمات التالية أيضاً:</p>
<ul>
<li><a href="https://replit.com">Replit</a></li>
<li><a href="https://railway.app">Railway</a></li>
<li><a href="https://codesandbox.io">CodeSandBox</a></li>
</ul>
<p>إذا كنت تعرف خدمات مجانية وسهلة الاستخدام لاستضافة NodeJS، فأخبرنا!</p>
<p>بالنسبة لكل من Fly.io وRender، علينا تغيير تعريف المنفذ الذي يستخدمه تطبيقنا في أسفل ملف <i>index.js</i> في الواجهة الخلفية كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = process.<span class="hljs-property">env</span>.<span class="hljs-property">PORT</span> || <span class="hljs-number">3001</span>  <span class="hljs-comment">// highlight-line</span>
app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>, <span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server running on port <span class="hljs-subst">\${PORT}</span>\`</span>)
})
</code></pre>
<p>نستخدم الآن المنفذ المعرّف في <a href="https://en.wikipedia.org/wiki/Environment_variable">متغير البيئة</a> <em>PORT</em> أو المنفذ 3001 إذا كان متغير البيئة <em>PORT</em> غير معرّف. من الممكن إعداد منفذ التطبيق بناءً على متغير البيئة في كل من Fly.io وRender.</p>
<h4 id="flyio">Fly.io</h4>
<p><i>لاحظ أنك قد تحتاج إلى تقديم رقم بطاقتك الائتمانية إلى Fly.io!</i></p>
<p>إذا قررت استخدام <a href="https://fly.io/">Fly.io</a> فابدأ بتثبيت برنامج flyctl التنفيذي باتباع <a href="https://fly.io/docs/hands-on/install-flyctl/">هذا الدليل</a>. بعد ذلك، ينبغي أن <a href="https://fly.io/docs/hands-on/sign-up/">تنشئ حساب Fly.io</a>.</p>
<p>ابدأ بـ<a href="https://fly.io/docs/hands-on/sign-in/">المصادقة</a> عبر سطر الأوامر بالأمر</p>
<pre><code class="language-bash">fly auth login
</code></pre>
<p>لاحظ أنه إذا لم يعمل الأمر <em>fly</em> على جهازك، يمكنك تجربة الصيغة الأطول <em>flyctl</em>. مثلاً على MacOS، تعمل كلتا صيغتَي الأمر.</p>
<p><i>إذا لم تنجح في تشغيل flyctl على جهازك، يمكنك تجربة Render (انظر القسم التالي)، فهو لا يتطلب تثبيت أي شيء على جهازك.</i></p>
<p>تتم تهيئة تطبيق بتشغيل الأمر التالي في المجلد الجذر للتطبيق</p>
<pre><code class="language-bash">fly launch --no-deploy
</code></pre>
<p>أعطِ التطبيق اسماً أو دع Fly.io تولّد واحداً تلقائياً. اختر منطقة سيُشغَّل فيها التطبيق. لا تُنشئ قاعدة بيانات Postgres للتطبيق ولا تُنشئ قاعدة بيانات Upstash Redis، لأنها غير مطلوبة.</p>
<p>يُنشئ Fly.io ملف <i>fly.toml</i> في جذر تطبيقك حيث يمكننا إعداده. لتشغيل التطبيق، قد <i>نحتاج</i> إلى إضافة صغيرة إلى الإعدادات:</p>
<pre><code class="language-bash">[build]

[<span class="hljs-built_in">env</span>]
  PORT = <span class="hljs-string">&quot;3001&quot;</span> <span class="hljs-comment"># أضف هذا</span>

[http_service]
  internal_port = 3001 <span class="hljs-comment"># تأكد من أن هذا مطابق لـ PORT</span>
  force_https = <span class="hljs-literal">true</span>
  auto_stop_machines = <span class="hljs-literal">true</span>
  auto_start_machines = <span class="hljs-literal">true</span>
  min_machines_running = 0
  processes = [<span class="hljs-string">&quot;app&quot;</span>]
</code></pre>
<p>لقد عرّفنا الآن في القسم [env] أن متغير البيئة PORT سيحصل على المنفذ الصحيح (المعرّف في القسم [http_service]) الذي ينبغي أن ينشئ التطبيق الخادم عليه.</p>
<p>أصبحنا الآن جاهزين لنشر التطبيق على خوادم Fly.io. يتم ذلك بالأمر التالي:</p>
<pre><code class="language-bash">fly deploy
</code></pre>
<p>إذا سار كل شيء على ما يرام، ينبغي أن يكون التطبيق الآن يعمل. يمكنك فتحه في المتصفح بالأمر</p>
<pre><code class="language-bash">fly apps open
</code></pre>
<p>من الأوامر المهمة بشكل خاص <em>fly logs</em>. يمكن استخدام هذا الأمر لعرض سجلات الخادم. من الأفضل إبقاء السجلات ظاهرة دائماً!</p>
<p><strong>ملاحظة:</strong> قد تُنشئ Fly آلتين (machines) لتطبيقك، وإذا حدث ذلك فستكون حالة البيانات في تطبيقك غير متسقة بين الطلبات، أي سيكون لديك آلتان لكل منهما متغير notes الخاص بها، فقد ترسل POST إلى آلة ثم يذهب طلب GET التالي إلى آلة أخرى. يمكنك التحقق من عدد الآلات باستخدام الأمر &quot;$ fly scale show&quot;، وإذا كان COUNT أكبر من 1 فيمكنك فرضه ليكون 1 بالأمر &quot;$ fly scale count 1&quot;. يمكن أيضاً التحقق من عدد الآلات على لوحة التحكم.</p>
<p><strong>ملاحظة:</strong> في بعض الحالات (السبب غير معروف حتى الآن) تسبّب تشغيل أوامر Fly.io، وخاصة على Windows WSL (النظام الفرعي لنظام Windows الخاص بـ Linux)، في مشاكل. إذا تعطّل الأمر التالي دون استجابة</p>
<pre><code class="language-bash">flyctl ping -o personal
</code></pre>
<p>فلن يتمكن حاسوبك لسبب ما من الاتصال بـ Fly.io. إذا حدث لك هذا، <a href="https://github.com/fullstack-hy2020/misc/blob/master/fly_io_problem.md">هذا الرابط</a> يصف طريقة ممكنة للمتابعة.</p>
<p>إذا كان ناتج الأمر أدناه بهذا الشكل:</p>
<pre><code class="language-bash">$ flyctl ping -o personal
35 bytes from fdaa:0:8a3d::3 (gateway), <span class="hljs-built_in">seq</span>=0 <span class="hljs-keyword">time</span>=65.1ms
35 bytes from fdaa:0:8a3d::3 (gateway), <span class="hljs-built_in">seq</span>=1 <span class="hljs-keyword">time</span>=28.5ms
35 bytes from fdaa:0:8a3d::3 (gateway), <span class="hljs-built_in">seq</span>=2 <span class="hljs-keyword">time</span>=29.3ms
...
</code></pre>
<p>فلا توجد مشاكل في الاتصال!</p>
<p>كلما أجريت تغييرات على التطبيق، يمكنك نقل الإصدار الجديد إلى الإنتاج بالأمر</p>
<pre><code class="language-bash">fly deploy
</code></pre>
<h4 id="render">Render</h4>
<p><i>لاحظ أنك قد تحتاج إلى تقديم رقم بطاقتك الائتمانية إلى Render!</i></p>
<p>يفترض ما يلي أن <a href="https://dashboard.render.com/">تسجيل الدخول</a> قد تم بحساب GitHub.</p>
<p>بعد تسجيل الدخول، لننشئ &quot;خدمة ويب&quot; جديدة:</p>
<p><img src="/images/content/3/r1.webp" alt="صورة تُظهر خيار إنشاء خدمة ويب جديدة"></p>
<p>ثم يُربط مستودع التطبيق بـ Render:</p>
<p><img src="/images/content/3/r2.webp" alt="صورة تُظهر مستودع التطبيق على Render."></p>
<p>يبدو أن الربط يتطلب أن يكون مستودع التطبيق عاماً.</p>
<p>بعد ذلك سنحدد الإعدادات الأساسية. إذا لم يكن التطبيق في جذر المستودع، فيجب إعطاء <i>المجلد الجذر</i> قيمة مناسبة:</p>
<p><img src="/images/content/3/r3.webp" alt="صورة تُظهر حقل المجلد الجذر كخيار اختياري"></p>
<p>بعد ذلك، يبدأ التطبيق في Render. تخبرنا لوحة التحكم بحالة التطبيق وعنوان URL الذي يعمل عليه التطبيق:</p>
<p><img src="/images/content/3/r4.webp" alt="يُظهر الركن الأيسر العلوي من الصورة حالة التطبيق وعنوان URL الخاص به"></p>
<p>وفقاً لـ<a href="https://render.com/docs/deploys">التوثيق</a>، ينبغي أن يعيد كل commit إلى GitHub نشر التطبيق. لسبب ما لا يعمل هذا دائماً.</p>
<p>لحسن الحظ، من الممكن أيضاً إعادة نشر التطبيق يدوياً:</p>
<p><img src="/images/content/3/r5.webp" alt="قائمة مع إبراز خيار نشر أحدث commit"></p>
<p>كما يمكن رؤية سجلات التطبيق في لوحة التحكم:</p>
<p><img src="/images/content/3/r7.webp" alt="صورة مع إبراز تبويب السجلات في الركن الأيسر. وعلى اليمين سجلات التطبيق"></p>
<p>نلاحظ الآن من السجلات أن التطبيق بدأ على المنفذ 10000. تحصل شيفرة التطبيق على المنفذ الصحيح عبر متغير البيئة PORT، لذا من الضروري أن يكون ملف <i>index.js</i> قد حُدِّث في الواجهة الخلفية كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = process.<span class="hljs-property">env</span>.<span class="hljs-property">PORT</span> || <span class="hljs-number">3001</span>  <span class="hljs-comment">// highlight-line</span>
app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>, <span class="hljs-function">() =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server running on port <span class="hljs-subst">\${PORT}</span>\`</span>)
})
</code></pre>
<h3 id="بناء-الواجهة-الأمامية-للإنتاج">بناء الواجهة الأمامية للإنتاج</h3>
<p>حتى الآن كنا نشغّل شيفرة React في <i>وضع التطوير</i>. في وضع التطوير يُهيَّأ التطبيق لإعطاء رسائل خطأ واضحة، وعرض تغييرات الشيفرة في المتصفح فوراً، وما إلى ذلك.</p>
<p>عند نشر التطبيق، يجب إنشاء <a href="https://vitejs.dev/guide/build.html">بناء للإنتاج</a> أو نسخة من التطبيق مُحسَّنة للإنتاج.</p>
<p>يمكن إنشاء بناء للإنتاج للتطبيقات المنشأة بـ Vite بالأمر <a href="https://vitejs.dev/guide/build.html">npm run build</a>.</p>
<p>لننفّذ هذا الأمر من <i>جذر مشروع الملاحظات في الواجهة الأمامية</i> الذي طوّرناه في <a href="/part2">الجزء 2</a>.</p>
<p>يُنشئ هذا مجلداً يُسمى <i>dist</i> يحتوي على ملف HTML الوحيد لتطبيقنا (<i>index.html</i>) والمجلد <i>assets</i>. ستُولَّد نسخة <a href="https://en.wikipedia.org/wiki/Minification_(programming)">مُصغَّرة</a> من شيفرة JavaScript لتطبيقنا في مجلد <i>dist</i>. ورغم أن شيفرة التطبيق موزعة على عدة ملفات، فستُصغَّر كل شيفرة JavaScript في ملف واحد. وستُصغَّر أيضاً كل الشيفرة من جميع اعتماديات التطبيق في هذا الملف الواحد.</p>
<p>الشيفرة المُصغَّرة ليست مقروءة كثيراً. تبدو بداية الشيفرة كما يلي:</p>
<pre><code class="language-js">!<span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>){<span class="hljs-keyword">function</span> <span class="hljs-title function_">r</span>(<span class="hljs-params">r</span>){<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> n,f,i=r[<span class="hljs-number">0</span>],l=r[<span class="hljs-number">1</span>],a=r[<span class="hljs-number">2</span>],c=<span class="hljs-number">0</span>,s=[];c&lt;i.<span class="hljs-property">length</span>;c++)f=i[c],o[f]&amp;&amp;s.<span class="hljs-title function_">push</span>(o[f][<span class="hljs-number">0</span>]),o[f]=<span class="hljs-number">0</span>;<span class="hljs-keyword">for</span>(n <span class="hljs-keyword">in</span> l)<span class="hljs-title class_">Object</span>.<span class="hljs-property"><span class="hljs-keyword">prototype</span></span>.<span class="hljs-property">hasOwnProperty</span>.<span class="hljs-title function_">call</span>(l,n)&amp;&amp;(e[n]=l[n]);<span class="hljs-keyword">for</span>(p&amp;&amp;<span class="hljs-title function_">p</span>(r);s.<span class="hljs-property">length</span>;)s.<span class="hljs-title function_">shift</span>()();<span class="hljs-keyword">return</span> u.<span class="hljs-property">push</span>.<span class="hljs-title function_">apply</span>(u,a||[]),<span class="hljs-title function_">t</span>()}<span class="hljs-keyword">function</span> <span class="hljs-title function_">t</span>(<span class="hljs-params"></span>){<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> e,r=<span class="hljs-number">0</span>;r&lt;u.<span class="hljs-property">length</span>;r++){<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> t=u[r],n=!<span class="hljs-number">0</span>,i=<span class="hljs-number">1</span>;i&lt;t.<span class="hljs-property">length</span>;i++){<span class="hljs-keyword">var</span> l=t[i];<span class="hljs-number">0</span>!==o[l]&amp;&amp;(n=!<span class="hljs-number">1</span>)}n&amp;&amp;(u.<span class="hljs-title function_">splice</span>(r--,<span class="hljs-number">1</span>),e=<span class="hljs-title function_">f</span>(f.<span class="hljs-property">s</span>=t[<span class="hljs-number">0</span>]))}<span class="hljs-keyword">return</span> e}<span class="hljs-keyword">var</span> n={},o={<span class="hljs-number">2</span>:<span class="hljs-number">0</span>},u=[];<span class="hljs-keyword">function</span> <span class="hljs-title function_">f</span>(<span class="hljs-params">r</span>){<span class="hljs-keyword">if</span>(n[r])<span class="hljs-keyword">return</span> n[r].<span class="hljs-property">exports</span>;<span class="hljs-keyword">var</span> t=n[r]={<span class="hljs-attr">i</span>:r,<span class="hljs-attr">l</span>:!<span class="hljs-number">1</span>,<span class="hljs-attr">exports</span>:{}};<span class="hljs-keyword">return</span> e[r].<span class="hljs-title function_">call</span>(t.<span class="hljs-property">exports</span>,t,t.<span class="hljs-property">exports</span>,f),t.<span class="hljs-property">l</span>=!<span class="hljs-number">0</span>,t.<span class="hljs-property">exports</span>}f.<span class="hljs-property">m</span>=e,f.<span class="hljs-property">c</span>=n,f.<span class="hljs-property">d</span>=<span class="hljs-keyword">function</span>(<span class="hljs-params">e,r,t</span>){f.<span class="hljs-title function_">o</span>(e,r)||<span class="hljs-title class_">Object</span>.<span class="hljs-title function_">defineProperty</span>(e,r,{<span class="hljs-attr">enumerable</span>:!<span class="hljs-number">0</span>,<span class="hljs-attr">get</span>:t})},f.<span class="hljs-property">r</span>=<span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>){<span class="hljs-string">&quot;undefined&quot;</span>!==<span class="hljs-keyword">typeof</span> <span class="hljs-title class_">Symbol</span>&amp;&amp;<span class="hljs-title class_">Symbol</span>.<span class="hljs-property">toStringTag</span>&amp;&amp;<span class="hljs-title class_">Object</span>.<span class="hljs-title function_">defineProperty</span>(e,<span class="hljs-title class_">Symbol</span>.<span class="hljs-property">toStringTag</span>,{<span class="hljs-attr">value</span>:<span class="hljs-string">&quot;Module&quot;</span>})
</code></pre>
<h3 id="تقديم-الملفات-الثابتة-من-الواجهة-الخلفية">تقديم الملفات الثابتة من الواجهة الخلفية</h3>
<p>أحد خيارات نشر الواجهة الأمامية هو نسخ بناء الإنتاج (مجلد <i>dist</i>) إلى جذر مجلد الواجهة الخلفية وإعداد الواجهة الخلفية لعرض <i>الصفحة الرئيسية</i> للواجهة الأمامية (ملف <i>dist/index.html</i>) كصفحتها الرئيسية.</p>
<p>نبدأ بنسخ بناء الإنتاج للواجهة الأمامية إلى جذر الواجهة الخلفية. على حاسوب Mac أو Linux، يمكن إجراء النسخ من مجلد الواجهة الأمامية بالأمر</p>
<pre><code class="language-bash"><span class="hljs-built_in">cp</span> -r dist ../backend
</code></pre>
<p>إذا كنت تستخدم حاسوباً يعمل بـ Windows، فيمكنك استخدام الأمر <a href="https://www.windows-commandline.com/windows-copy-command-syntax-examples/">copy</a> أو <a href="https://www.windows-commandline.com/xcopy-command-syntax-examples/">xcopy</a> بدلاً من ذلك. وإلا فانسخ والصق ببساطة.</p>
<p>ينبغي أن يبدو مجلد الواجهة الخلفية الآن كما يلي:</p>
<p><img src="/images/content/3/27v.webp" alt="لقطة شاشة bash لأمر ls تُظهر مجلد dist"></p>
<p>لجعل Express يعرض <i>المحتوى الثابت</i>، أي صفحة <i>index.html</i> وJavaScript وغيرها مما يجلبه، نحتاج إلى وسيط مدمج في Express يُسمى <a href="http://expressjs.com/en/starter/static-files.html">static</a>.</p>
<p>عندما نضيف ما يلي بين تعريفات الوسطاء</p>
<pre><code class="language-js">app.<span class="hljs-title function_">use</span>(express.<span class="hljs-title function_">static</span>(<span class="hljs-string">&#x27;dist&#x27;</span>))
</code></pre>
<p>فكلما تلقى Express طلب HTTP GET سيتحقق أولاً مما إذا كان مجلد <i>dist</i> يحتوي على ملف يقابل عنوان الطلب. وإذا وُجد ملف مطابق، فسيعيده Express.</p>
<p>الآن ستعرض طلبات HTTP GET إلى العنوان <i>www.serversaddress.com/index.html</i> أو <i>www.serversaddress.com</i> الواجهة الأمامية React. أما طلبات GET إلى العنوان <i>www.serversaddress.com/api/notes</i> فستتولاها شيفرة الواجهة الخلفية.</p>
<p>نظراً لحالتنا، حيث تقع الواجهة الأمامية والواجهة الخلفية على العنوان نفسه، يمكننا تعريف <em>baseUrl</em> كعنوان URL <a href="https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2">نسبي</a>. هذا يعني أنه يمكننا حذف الجزء الذي يعرّف الخادم.</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>
<span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;/api/notes&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">getAll</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> request = axios.<span class="hljs-title function_">get</span>(baseUrl)
  <span class="hljs-keyword">return</span> request.<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> response.<span class="hljs-property">data</span>)
}

<span class="hljs-comment">// ...</span>
</code></pre>
<p>بعد التغيير، علينا إنشاء بناء إنتاج جديد للواجهة الأمامية ونسخه إلى جذر مجلد الواجهة الخلفية.</p>
<p>يمكن الآن استخدام التطبيق من عنوان <i>الواجهة الخلفية</i> <a href="http://localhost:3001">http://localhost:3001</a>:</p>
<p><img src="/images/content/3/28new.webp" alt="تطبيق الملاحظات على localhost:3001"></p>
<p>يعمل تطبيقنا الآن تماماً مثل التطبيق المثالي <a href="/part0/fundamentals_of_web_apps#single-page-app">أحادي الصفحة</a> الذي درسناها في الجزء 0.</p>
<p>عندما نستخدم المتصفح للانتقال إلى العنوان <a href="http://localhost:3001">http://localhost:3001</a>، يعيد الخادم ملف <i>index.html</i> من مجلد <i>dist</i>. محتوى الملف كما يلي:</p>
<pre><code class="language-html"><span class="hljs-meta">&lt;!doctype <span class="hljs-keyword">html</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">html</span> <span class="hljs-attr">lang</span>=<span class="hljs-string">&quot;en&quot;</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">meta</span> <span class="hljs-attr">charset</span>=<span class="hljs-string">&quot;UTF-8&quot;</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">link</span> <span class="hljs-attr">rel</span>=<span class="hljs-string">&quot;icon&quot;</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;image/svg+xml&quot;</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/vite.svg&quot;</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">meta</span> <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;viewport&quot;</span> <span class="hljs-attr">content</span>=<span class="hljs-string">&quot;width=device-width, initial-scale=1.0&quot;</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">title</span>&gt;</span>Vite + React<span class="hljs-tag">&lt;/<span class="hljs-name">title</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;module&quot;</span> <span class="hljs-attr">crossorigin</span> <span class="hljs-attr">src</span>=<span class="hljs-string">&quot;/assets/index-5f6faa37.js&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">link</span> <span class="hljs-attr">rel</span>=<span class="hljs-string">&quot;stylesheet&quot;</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/assets/index-198af077.css&quot;</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">head</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">id</span>=<span class="hljs-string">&quot;root&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    
  <span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">html</span>&gt;</span>

</code></pre>
<p>يحتوي الملف على تعليمات لجلب ورقة أنماط CSS تعرّف أنماط التطبيق، وعلى وسم <i>script</i> واحد يوجّه المتصفح لجلب شيفرة JavaScript الخاصة بالتطبيق - أي تطبيق React الفعلي.</p>
<p>تجلب شيفرة React الملاحظات من عنوان الخادم <a href="http://localhost:3001/api/notes">http://localhost:3001/api/notes</a> وتعرضها على الشاشة. يمكن رؤية التواصل بين الخادم والمتصفح في تبويب <i>Network</i> في وحدة تحكم المطور:</p>
<p><img src="/images/content/3/29new.webp" alt="تبويب Network لتطبيق الملاحظات على الواجهة الخلفية"></p>
<p>يبدو الإعداد الجاهز لنشر المنتج كما يلي:</p>
<p><img src="/images/content/3/101.webp" alt="مخطط تطبيق React الجاهز للنشر"></p>
<p>على عكس تشغيل التطبيق في بيئة التطوير، أصبح كل شيء الآن في الواجهة الخلفية node/express نفسها التي تعمل على localhost:3001. عندما ينتقل المتصفح إلى الصفحة، يُعرض ملف <i>index.html</i>. ويؤدي ذلك إلى جلب المتصفح لنسخة الإنتاج من تطبيق React. وبمجرد أن يبدأ بالعمل، يجلب بيانات json من العنوان localhost:3001/api/notes.</p>
<h3 id="نقل-التطبيق-كاملا-إلى-الإنترنت">نقل التطبيق كاملاً إلى الإنترنت</h3>
<p>بعد التأكد من أن نسخة الإنتاج من التطبيق تعمل محلياً، أصبحنا جاهزين لنقل التطبيق كاملاً إلى خدمة الاستضافة المختارة.</p>
<p><strong>في حالة Fly.io</strong> يتم النشر الجديد بالأمر</p>
<pre><code class="language-bash">fly deploy
</code></pre>
<p><strong>ملاحظة:</strong> يسرد ملف <em>.dockerignore</em> في مجلد مشروعك الملفات التي لا تُرفع أثناء النشر. قد يكون مجلد dist مضمنًا افتراضياً. إذا كان الأمر كذلك، فأزل الإشارة إليه من ملف .dockerignore، لضمان نشر تطبيقك بشكل صحيح.</p>
<p><strong>في حالة Render</strong>، اعمل commit للتغييرات، وادفع الشيفرة إلى GitHub مرة أخرى. تأكد من أن مجلد <i>dist</i> غير متجاهَل من git في الواجهة الخلفية. قد <i>يكفي</i> الدفع إلى GitHub. وإذا لم يعمل النشر التلقائي، فاختر &quot;النشر اليدوي&quot; من لوحة تحكم Render.</p>
<p>يعمل التطبيق بشكل مثالي، باستثناء أننا لم نضف بعد وظيفة تغيير أهمية الملاحظة إلى الواجهة الخلفية.</p>
<p><img src="/images/content/3/30new.webp" alt="لقطة شاشة لتطبيق الملاحظات"></p>
<p><i><strong>ملاحظة:</strong> تغيير الأهمية لا يعمل بعد لأن الواجهة الخلفية لا تملك تنفيذاً له حتى الآن.</i></p>
<p>يحفظ تطبيقنا الملاحظات في متغير. إذا انهار التطبيق أو أُعيد تشغيله، فستختفي كل البيانات.</p>
<p>يحتاج التطبيق إلى قاعدة بيانات. قبل أن نقدّم واحدة، لنستعرض بضعة أمور.</p>
<p>يبدو الإعداد الآن كما يلي:</p>
<p><img src="/images/content/3/102.webp" alt="مخطط تطبيق React على fly.io"></p>
<p>تقيم الواجهة الخلفية node/express الآن على خادم Fly.io/Render. عند الوصول إلى العنوان الجذر، يُحمّل المتصفح تطبيق React وينفّذه، فيجلب بيانات json من خادم Fly.io/Render.</p>
<h3 id="تبسيط-نشر-الواجهة-الأمامية">تبسيط نشر الواجهة الأمامية</h3>
<p>لإنشاء بناء إنتاج جديد للواجهة الأمامية دون عمل يدوي إضافي، لنضف بعض سكربتات npm إلى ملف <i>package.json</i> في مستودع الواجهة الخلفية.</p>
<h4 id="سكربت-flyio">سكربت Fly.io</h4>
<p>تبدو السكربتات كما يلي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-comment">// ...</span>
    <span class="hljs-attr">&quot;build:ui&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;rm -rf dist &amp;&amp; cd ../notes-frontend/ &amp;&amp; npm run build &amp;&amp; cp -r dist ../notes-backend&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;deploy&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;fly deploy&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;deploy:full&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;npm run build:ui &amp;&amp; npm run deploy&quot;</span><span class="hljs-punctuation">,</span>    
    <span class="hljs-attr">&quot;logs:prod&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;fly logs&quot;</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يبني السكربت <em>npm run build:ui</em> الواجهة الأمامية وينسخ نسخة الإنتاج إلى مستودع الواجهة الخلفية. ويطلق السكربت <em>npm run deploy</em> الواجهة الخلفية الحالية إلى Fly.io.</p>
<p>يجمع <em>npm run deploy:full</em> هذين السكربتين، أي <em>npm run build:ui</em> و_npm run deploy_.</p>
<p>يوجد أيضاً سكربت <em>npm run logs:prod</em> لعرض سجلات Fly.io.</p>
<p>لاحظ أن مسارات المجلدات في السكربت <i>build:ui</i> تعتمد على موقع مجلدَي الواجهة الأمامية والواجهة الخلفية في نظام الملفات.</p>
<h5>ملاحظة لمستخدمي Windows</h5>
<p>لاحظ أن أوامر الصدفة (shell) القياسية في <code>build:ui</code> لا تعمل أصلاً في Windows. يعمل Powershell في Windows بشكل مختلف، وفي هذه الحالة يمكن كتابة السكربت كما يلي</p>
<pre><code class="language-json"><span class="hljs-attr">&quot;build:ui&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;@powershell Remove-Item -Recurse -Force dist &amp;&amp; cd ../frontend &amp;&amp; npm run build &amp;&amp; @powershell Copy-Item dist -Recurse ../backend&quot;</span><span class="hljs-punctuation">,</span>
</code></pre>
<p>إذا لم يعمل السكربت على Windows، فتأكد من أنك تستخدم Powershell وليس Command Prompt. وإذا كنت قد ثبّت Git Bash أو طرفية أخرى شبيهة بـ Linux، فقد تتمكن من تشغيل أوامر شبيهة بأوامر Linux على Windows أيضاً.</p>
<h4 id="render">Render</h4>
<p>ملاحظة: عندما تحاول نشر واجهتك الخلفية على Render، تأكد من أن لديك مستودعاً منفصلاً للواجهة الخلفية وانشر مستودع GitHub هذا عبر Render؛ فمحاولة النشر عبر مستودع Fullstackopen الخاص بك كثيراً ما تُطلق الخطأ &quot;ERR path ....package.json&quot;.</p>
<p>في حالة Render، تبدو السكربتات كما يلي</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-comment">//...</span>
    <span class="hljs-attr">&quot;build:ui&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;rm -rf dist &amp;&amp; cd ../frontend &amp;&amp; npm run build &amp;&amp; cp -r dist ../backend&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;deploy:full&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;npm run build:ui &amp;&amp; git add . &amp;&amp; git commit -m uibuild &amp;&amp; git push&quot;</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يبني السكربت <em>npm run build:ui</em> الواجهة الأمامية وينسخ نسخة الإنتاج إلى مستودع الواجهة الخلفية. ويحتوي <em>npm run deploy:full</em> أيضاً على أوامر <i>git</i> اللازمة لتحديث مستودع الواجهة الخلفية.</p>
<p>لاحظ أن مسارات المجلدات في السكربت <i>build:ui</i> تعتمد على موقع مجلدَي الواجهة الأمامية والواجهة الخلفية في نظام الملفات.</p>
<blockquote>
<p><strong>ملاحظة</strong>  على Windows، تُنفَّذ سكربتات npm في cmd.exe كصدفة افتراضية، وهي لا تدعم أوامر bash. لكي تعمل أوامر bash أعلاه، يمكنك تغيير الصدفة الافتراضية إلى Bash (في التثبيت الافتراضي لـ Git for Windows) كما يلي:</p>
</blockquote>
<pre><code class="language-md">npm config set script-shell &quot;C:\\\\Program Files\\\\git\\\\bin\\\\bash.exe&quot;
</code></pre>
<p>خيار آخر هو استخدام <a href="https://www.npmjs.com/package/shx">shx</a>.</p>
<h3 id="الوكيل">الوكيل</h3>
<p>أدّت التغييرات في الواجهة الأمامية إلى توقف عملها في وضع التطوير (عند التشغيل بالأمر <em>npm run dev</em>)، إذ لا يعمل الاتصال بالواجهة الخلفية.</p>
<p><img src="/images/content/3/32new.webp" alt="أدوات مطوري Network تُظهر خطأ 404 عند جلب الملاحظات"></p>
<p>يعود هذا إلى تغيير عنوان الواجهة الخلفية إلى عنوان URL نسبي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;/api/notes&#x27;</span>
</code></pre>
<p>لأن الواجهة الأمامية في وضع التطوير على العنوان <i>localhost:5173</i>، تذهب الطلبات إلى الواجهة الخلفية إلى العنوان الخاطئ <i>localhost:5173/api/notes</i>. بينما الواجهة الخلفية على <i>localhost:3001</i>.</p>
<p>إذا أُنشئ المشروع بـ Vite، فحل هذه المشكلة سهل. يكفي إضافة التعريف التالي إلى ملف <i>vite.config.js</i> في مجلد الواجهة الأمامية.</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;vite&#x27;</span>
<span class="hljs-keyword">import</span> react <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@vitejs/plugin-react&#x27;</span>

<span class="hljs-comment">// https://vitejs.dev/config/</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">defineConfig</span>({
  <span class="hljs-attr">plugins</span>: [<span class="hljs-title function_">react</span>()],
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-attr">server</span>: {
    <span class="hljs-attr">proxy</span>: {
      <span class="hljs-string">&#x27;/api&#x27;</span>: {
        <span class="hljs-attr">target</span>: <span class="hljs-string">&#x27;http://localhost:3001&#x27;</span>,
        <span class="hljs-attr">changeOrigin</span>: <span class="hljs-literal">true</span>,
      },
    }
  },
  <span class="hljs-comment">// highlight-end</span>
})

</code></pre>
<p>بعد إعادة التشغيل، ستعمل بيئة تطوير React <a href="https://vitejs.dev/config/server-options.html#server-proxy">كوكيل</a>. إذا أرسلت شيفرة React طلب HTTP إلى مسار يبدأ بـ <i>http://localhost:5173/api</i>، فسيُمرَّر الطلب إلى الخادم على <i>http://localhost:3001</i>. أما الطلبات إلى مسارات أخرى فسيتولاها خادم التطوير بشكل طبيعي.</p>
<p>الآن تعمل الواجهة الأمامية بشكل صحيح أيضاً. فهي تعمل في وضع التطوير ووضع الإنتاج مع الخادم. وبما أن جميع الطلبات من منظور الواجهة الأمامية تُرسَل إلى http://localhost:5173، وهو الأصل الوحيد، فلم تعد هناك حاجة إلى وسيط cors في الواجهة الخلفية. لذلك يمكننا إزالة الإشارات إلى مكتبة cors من ملف <i>index.js</i> في الواجهة الخلفية وإزالة <i>cors</i> من اعتماديات المشروع:</p>
<pre><code class="language-bash">npm remove cors
</code></pre>
<p>لقد نجحنا الآن في نشر التطبيق كاملاً على الإنترنت. هناك طرق أخرى عديدة لتنفيذ النشر. مثلاً، قد يكون نشر شيفرة الواجهة الأمامية كتطبيق خاص بها منطقياً في بعض الحالات، لأنه يسهّل تنفيذ <a href="https://martinfowler.com/bliki/DeploymentPipeline.html">خط أنابيب نشر</a> آلي. يشير خط أنابيب النشر إلى طريقة آلية ومنضبطة لنقل الشيفرة من جهاز المطور عبر اختبارات ومراحل ضبط جودة متنوعة إلى بيئة الإنتاج. يُغطّى هذا الموضوع في <a href="/part11">الجزء 11</a> من الدورة.</p>
<p>يمكن العثور على شيفرة الواجهة الخلفية الحالية على <a href="https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3">Github</a>، في الفرع <i>part3-3</i>. أما التغييرات في شيفرة الواجهة الأمامية فهي في الفرع <i>part3-1</i> من <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part3-1">مستودع الواجهة الأمامية</a>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-39-311">تمارين 3.9.-3.11</h3>
<p>لا تتطلب التمارين التالية سطوراً كثيرة من الشيفرة. لكنها قد تكون صعبة، لأنه يجب أن تفهم بدقة ما يحدث وأين، ويجب أن تكون الإعدادات مضبوطة تماماً.</p>
<h4 id="39-الواجهة-الخلفية-لدليل-الهاتف-الخطوة-9">3.9: الواجهة الخلفية لدليل الهاتف، الخطوة 9</h4>
<p>اجعل الواجهة الخلفية تعمل مع واجهة دليل الهاتف الأمامية من تمارين الجزء السابق. لا تنفّذ بعد وظيفة إجراء تغييرات على أرقام الهاتف، فهي ستُنفَّذ في التمرين 3.17.</p>
<p>سيتعين عليك على الأرجح إجراء بعض التغييرات الصغيرة على الواجهة الأمامية، على الأقل في عناوين URL الخاصة بالواجهة الخلفية. تذكّر أن تبقي وحدة تحكم المطور مفتوحة في متصفحك. إذا فشلت بعض طلبات HTTP، فينبغي أن تتحقق من تبويب <i>Network</i> لمعرفة ما يجري. راقب أيضاً وحدة تحكم الواجهة الخلفية. وإذا لم تكن قد حللت التمرين السابق، فمن المفيد طباعة بيانات الطلب أو <i>request.body</i> في وحدة التحكم داخل معالج الحدث المسؤول عن طلبات POST.</p>
<h4 id="310-الواجهة-الخلفية-لدليل-الهاتف-الخطوة-10">3.10: الواجهة الخلفية لدليل الهاتف، الخطوة 10</h4>
<p>انشر الواجهة الخلفية على الإنترنت، مثلاً على Fly.io أو Render. إذا كنت تستخدم Fly.io فينبغي تشغيل الأوامر في المجلد الجذر للواجهة الخلفية (أي في المجلد نفسه الذي يوجد فيه ملف package.json الخاص بالواجهة الخلفية).</p>
<p><strong>نصيحة احترافية:</strong> عندما تنشر تطبيقك على الإنترنت، من المفيد على الأقل في البداية أن تراقب سجلات التطبيق <strong>في جميع الأوقات</strong>.</p>
<p>اختبر الواجهة الخلفية المنشورة باستخدام متصفح وPostman أو عميل REST في VS Code للتأكد من أنها تعمل.</p>
<p>أنشئ ملف README.md في جذر مستودعك، وأضف إليه رابطاً إلى تطبيقك على الإنترنت.</p>
<h4 id="311-دليل-الهاتف-الكامل">3.11: دليل الهاتف الكامل</h4>
<p>ولّد بناء إنتاج لواجهتك الأمامية، وأضفه إلى تطبيق الإنترنت بالطريقة المقدَّمة في هذا الجزء.</p>
<p>تأكد أيضاً من أن الواجهة الأمامية لا تزال تعمل محلياً (في وضع التطوير عند التشغيل بالأمر <em>npm run dev</em>).</p>
<p>إذا كنت تستخدم Render، فتأكد من أن مجلد <i>dist</i> غير متجاهَل من git في الواجهة الخلفية.</p>
<p><strong>ملاحظة:</strong> يجب ألا تنشر الواجهة الأمامية مباشرة في أي مرحلة من هذا الجزء. يُنشر مستودع الواجهة الخلفية فقط طوال هذا الجزء. يُضاف بناء إنتاج الواجهة الأمامية إلى مستودع الواجهة الخلفية، وتقدّمه الواجهة الخلفية كما هو موصوف في قسم <a href="/part3/deploying_app_to_internet#serving-static-files-from-the-backend">تقديم الملفات الثابتة من الواجهة الخلفية</a>.</p>
</div>
`,c={part:3,letter:"b",file:s,title:a,slug:n,mainImage:p,headings:l,html:t};export{c as default,s as file,l as headings,t as html,o as letter,p as mainImage,e as part,n as slug,a as title};
