const i=11,a="c",n="c.md",e="البدء مع GitHub Actions",t="getting_started_with_github_actions",o="/images/part-11.svg",s=[{depth:3,id:"الاحتياجات-الأساسية",text:"الاحتياجات الأساسية"},{depth:3,id:"البدء-مع-سير-العمل",text:"البدء مع سير العمل"},{depth:3,id:"إعداد-خطوات-الفحص-والاختبار-والبناء",text:"إعداد خطوات الفحص والاختبار والبناء"}],r=`<p>قبل أن نبدأ اللعب مع GitHub Actions، لنلقِ نظرة على ماهيتها وكيف تعمل.</p>
<p>تعمل GitHub Actions وفق <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">أسيار العمل (workflows)</a>. سير العمل هو سلسلة من <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">المهام (jobs)</a> التي تُنفَّذ عندما يحفّزها <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events" target="_blank" rel="noreferrer noopener">حدث</a> معيّن. تحتوي كل مهمة على مجموعتها الخاصة من التعليمات التي تخبر GitHub Actions بما ينبغي فعله.</p>
<p>يبدو التنفيذ النموذجي لسير العمل هكذا:</p>
<ul>
<li>يقع الحدث المُحفِّز (على سبيل المثال، دفع (push) إلى الفرع main).</li>
<li>يُنفَّذ سير العمل المرتبط بذلك المُحفِّز.</li>
<li>التنظيف</li>
</ul>
<h3 id="الاحتياجات-الأساسية">الاحتياجات الأساسية</h3>
<p>بشكل عام، لكي تعمل CI على مستودع، نحتاج إلى بضعة أمور:</p>
<ul>
<li>مستودع (بديهي)</li>
<li>تعريف لما تحتاج CI إلى فعله: يمكن أن يكون ذلك في صورة ملف معيّن داخل المستودع أو يمكن تعريفه في نظام CI نفسه</li>
<li>أن تكون CI على علم بوجود المستودع (وملف الإعدادات داخله)</li>
<li>أن تكون CI قادرة على الوصول إلى المستودع</li>
<li>أن تملك CI الأذونات اللازمة لتنفيذ الإجراءات التي يُفترض أن تقوم بها: على سبيل المثال، إذا احتاجت CI إلى النشر في بيئة إنتاج، فإنها تحتاج إلى <em>بيانات اعتماد</em> لتلك البيئة.</li>
</ul>
<p>هذا هو النموذج التقليدي على الأقل، وسنرى بعد قليل كيف تختصر GitHub Actions بعض هذه الخطوات، أو بالأحرى تجعلها بحيث لا داعي للقلق بشأنها!</p>
<p>لـGitHub Actions ميزة كبيرة على الحلول المستضافة ذاتياً: فالمستودع مستضاف لدى مزوّد CI. بعبارة أخرى، يوفّر GitHub كلاً من المستودع ومنصة CI. وهذا يعني أننا إذا فعّلنا Actions لمستودع، فإن GitHub يعلم مسبقاً بأن لدينا أسيار عمل معرّفة وكيف تبدو تلك التعريفات.</p>
<div class="tasks">
<p><strong>2. المشروع المثال</strong></p>
</div>
<h3 id="البدء-مع-سير-العمل">البدء مع سير العمل</h3>
<p>المكوّن الجوهري لإنشاء خطوط أنابيب CI/CD باستخدام GitHub Actions هو ما يُسمى <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">سير العمل (Workflow)</a>. أسيار العمل هي تدفقات عملية يمكنك إعدادها في مستودعك لتشغيل مهام آلية مثل البناء والاختبار وفحص الشيفرة وإصدار الإصدارات والنشر، على سبيل المثال لا الحصر! يبدو التسلسل الهرمي لسير العمل كما يلي:</p>
<p>سير العمل</p>
<ul>
<li>مهمة</li>
<li>مهمة</li>
</ul>
<p>يجب أن يحدد كل سير عمل <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">مهمة (Job)</a> واحدة على الأقل، تحتوي على مجموعة من <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps" target="_blank" rel="noreferrer noopener">الخطوات (Steps)</a> لتنفيذ مهام فردية. تُشغَّل المهام بالتوازي، أما الخطوات في كل مهمة فتُنفَّذ بالتتابع.</p>
<p>تتنوع الخطوات بين تشغيل أمر مخصص واستخدام إجراءات معرّفة مسبقاً، ومن هنا جاء اسم GitHub Actions. يمكنك إنشاء <a href="https://docs.github.com/en/free-pro-team@latest/actions/creating-actions" target="_blank" rel="noreferrer noopener">إجراءات مخصصة</a> أو استخدام أي إجراءات ينشرها المجتمع، وهي كثيرة، لكن لنعد إلى ذلك لاحقاً!</p>
<p>لكي يتعرف GitHub على أسيار عملك، يجب تحديدها في مجلد <em>.github/workflows</em> داخل مستودعك. كل سير عمل هو ملف منفصل بذاته، ويجب إعداده باستخدام لغة تسلسل البيانات <a href="https://yaml.org/" data-type="link" data-id="https://yaml.org/">YAML</a>.</p>
<p>YAML اختصار تكراري لعبارة &quot;YAML Ain't Markup Language&quot;. وكما يوحي الاسم، هدفها أن تكون مقروءة للبشر، وهي تُستخدم عادةً في ملفات الإعدادات.</p>
<p>لاحظ أن المسافات البادئة مهمة في YAML. يمكنك تعلم المزيد عن الصياغة <a href="https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html" target="_blank" rel="noreferrer noopener">هنا</a>.</p>
<p>يحتوي سير العمل الأساسي على ثلاثة عناصر في مستند YAML. هذه العناصر الثلاثة هي:</p>
<ul>
<li>name: أجل، لقد خمّنتها، اسم سير العمل</li>
<li>(on) triggers: الأحداث التي تحفّز تنفيذ سير العمل</li>
<li>jobs: المهام المنفصلة التي سينفذها سير العمل (قد يحتوي سير العمل الأساسي على مهمة واحدة فقط).</li>
</ul>
<p>يبدو تعريف سير العمل البسيط هكذا:</p>
<pre><code>name: Hello World!

on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: |
          echo &quot;Hello World!&quot;
</code></pre>
<p>توجد مهمة واحدة باسم <em>hello_world_job</em>، وستُشغَّل في بيئة افتراضية بنظام Ubuntu 24.04. للمهمة خطوة واحدة فقط باسم &quot;Say hello&quot;، وستنفّذ الأمر <code>echo &quot;Hello World!&quot;</code> في صدفة النظام.</p>
<p>قد تتساءل إذن: متى يحفّز GitHub بدء سير العمل؟ هناك الكثير من <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">الخيارات</a> للاختيار منها، لكن بشكل عام يمكنك إعداد سير العمل ليبدأ عند:</p>
<ul>
<li>وقوع <em>حدث على GitHub</em> مثل دفع (push) commit إلى مستودع أو إنشاء issue أو pull request</li>
<li>وقوع <em>حدث مجدول</em>، يُحدد باستخدام صياغة <a href="https://en.wikipedia.org/wiki/Cron" target="_blank" rel="noreferrer noopener">cron</a></li>
<li>وقوع <em>حدث خارجي</em>، على سبيل المثال تنفيذ أمر في تطبيق خارجي مثل تطبيق المراسلة <a href="https://slack.com/" target="_blank" rel="noreferrer noopener">Slack</a> أو <a href="https://discord.com/" target="_blank" rel="noreferrer noopener">Discord</a></li>
</ul>
<p>لمعرفة المزيد عن الأحداث التي يمكن استخدامها لتحفيز سير العمل، يُرجى الرجوع إلى <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">توثيق</a> GitHub Actions.</p>
<div class="tasks">
<p><strong>3. مرحباً بالعالم!</strong></p>
</div>
<div class="tasks">
<p><strong>4. التاريخ ومحتويات المجلد</strong></p>
</div>
<h3 id="إعداد-خطوات-الفحص-والاختبار-والبناء">إعداد خطوات الفحص والاختبار والبناء</h3>
<p>بعد إكمال التمارين الأولى، سيكون لديك سير عمل بسيط لكنه عديم الفائدة تقريباً. لنجعل سير العمل يقوم بشيء مفيد.</p>
<p>لنُنفّذ إجراءً (action) في GitHub Actions يقوم بفحص الشيفرة. إذا لم تنجح الفحوصات، سيعرض GitHub Actions حالة حمراء.</p>
<p>في البداية، يبدو سير العمل الذي سنحفظه في الملف <em>pipeline.yml</em> هكذا:</p>
<pre><code>name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
</code></pre>
<p>قبل أن نتمكن من تشغيل أمر لفحص الشيفرة، علينا تنفيذ بضعة إجراءات لتهيئة بيئة المهمة.</p>
<h4 id="تهيئة-البيئة">تهيئة البيئة</h4>
<p>تُعدّ تهيئة البيئة خطوة مهمة عند إعداد خط أنابيب. سنستخدم بيئة افتراضية <em>ubuntu-latest</em> لأنها مطابقة لإصدار Ubuntu (وهو 24.04) الذي سنشغّله في الإنتاج.</p>
<p>من المهم محاكاة البيئة نفسها في CI كما في الإنتاج بأقصى قدر ممكن من الدقة، لتجنّب حالات تعمل فيها الشيفرة نفسها بشكل مختلف في CI وفي الإنتاج، وهو ما يُبطل الغرض من استخدام CI فعلياً.</p>
<p>بعد ذلك، نُدرج الخطوات في مهمة &quot;build&quot; التي ستحتاج CI إلى تنفيذها. كما لاحظنا في التمرين الأخير، لا تحتوي البيئة الافتراضية افتراضياً على أي شيفرة، لذا نحتاج إلى <em>سحب الشيفرة</em> من المستودع.</p>
<p>هذه خطوة سهلة:</p>
<pre><code>name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
// BEGIN HIGHLIGHT
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v6
// END HIGHLIGHT
</code></pre>
<p>تُخبر الكلمة المفتاحية <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses" target="_blank" rel="noreferrer noopener">uses</a> سير العمل بتشغيل <em>إجراء</em> معيّن. والإجراء قطعة شيفرة قابلة لإعادة الاستخدام، مثل دالة. يمكن تعريف الإجراءات في مستودعك في ملف منفصل، أو يمكنك استخدام الإجراءات المتاحة في المستودعات العامة.</p>
<p>هنا نستخدم إجراءً عاماً هو <a href="https://github.com/actions/checkout" target="_blank" rel="noreferrer noopener">actions/checkout</a>، ونحدد إصداراً (@v6) لتجنّب التغييرات الكاسرة المحتملة إذا حُدِّث الإجراء. يفعل إجراء <em>checkout</em> ما يوحي به الاسم: فهو يسحب الشيفرة المصدرية للمشروع من Git.</p>
<p>ثانياً، بما أن التطبيق مكتوب بـJavaScript، يجب تهيئة Node.js لتتمكن من استخدام الأوامر المحددة في <em>package.json</em>. لتهيئة Node.js يمكن استخدام إجراء <a href="https://github.com/actions/setup-node" target="_blank" rel="noreferrer noopener">actions/setup-node</a>. اختير الإصدار 24 من Node لأنه الإصدار الذي يستخدمه التطبيق في بيئة الإنتاج.</p>
<pre><code># لم يعد يُعرض الاسم والمُحفِّز...

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
// BEGIN HIGHLIGHT
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
// END HIGHLIGHT
</code></pre>
<p>كما نرى، تُستخدم الكلمة المفتاحية <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith" target="_blank" rel="noreferrer noopener">with</a> لإعطاء &quot;معامل&quot; للإجراء. وهنا يحدد المعامل إصدار Node.js الذي نريد استخدامه.</p>
<p>أخيراً، يجب تثبيت اعتماديات التطبيق. وكما على جهازك الخاص، ننفّذ <code>npm install</code>. ينبغي أن تبدو الخطوات في المهمة الآن هكذا:</p>
<pre><code>jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
// BEGIN HIGHLIGHT
      - name: Install dependencies
        run: npm install
// END HIGHLIGHT
</code></pre>
<p>الآن ينبغي أن تكون البيئة جاهزة بالكامل كي تنفّذ المهمة مهامها المهمة.</p>
<h4 id="فحص-الشيفرة">فحص الشيفرة</h4>
<p>بعد تهيئة البيئة، يمكننا تشغيل جميع السكربتات من package.json كما نفعل على جهازنا الخاص. لفحص الشيفرة، كل ما عليك فعله هو إضافة خطوة لتشغيل الأمر <code>npm run eslint</code>.</p>
<pre><code>jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
      - name: Install dependencies
        run: npm install
// BEGIN HIGHLIGHT
      - name: Check style
        run: npm run eslint
// END HIGHLIGHT
</code></pre>
<p>لاحظ أن <em>name</em> الخطوة اختياري؛ فإذا عرّفت خطوة كما يلي</p>
<pre><code>- run: npm run eslint
</code></pre>
<p>يُستخدم الأمر الذي يُشغَّل كاسم افتراضي.</p>
<div class="tasks">
<p><strong>5. سير عمل فحص الشيفرة</strong></p>
</div>
<div class="tasks">
<p><strong>6. أصلح الشيفرة</strong></p>
</div>
<div class="tasks">
<p><strong>7. البناء والاختبار</strong></p>
</div>
<div class="tasks">
<p><strong>8. العودة إلى اللون الأخضر</strong></p>
</div>
<div class="tasks">
<p><strong>9. اختبارات من طرف إلى طرف بسيطة</strong></p>
</div>
`,p={part:11,letter:"c",file:n,title:e,slug:t,mainImage:o,headings:s,html:r};export{p as default,n as file,s as headings,r as html,a as letter,o as mainImage,i as part,t as slug,e as title};
