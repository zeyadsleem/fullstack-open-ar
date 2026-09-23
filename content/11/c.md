---
part: 11
letter: c
title: "البدء مع GitHub Actions"
mainImage: /images/part-11.svg
lang: ar
---
قبل أن نبدأ اللعب مع GitHub Actions، لنلقِ نظرة على ماهيتها وكيف تعمل.

تعمل GitHub Actions وفق <a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">أسيار العمل (workflows)</a>. سير العمل هو سلسلة من&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">المهام (jobs)</a>&nbsp;التي تُنفَّذ عندما يحفّزها&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events" target="_blank" rel="noreferrer noopener">حدث</a>&nbsp;معيّن. تحتوي كل مهمة على مجموعتها الخاصة من التعليمات التي تخبر GitHub Actions بما ينبغي فعله.

يبدو التنفيذ النموذجي لسير العمل هكذا:
- يقع الحدث المُحفِّز (على سبيل المثال، دفع (push) إلى الفرع main).
- يُنفَّذ سير العمل المرتبط بذلك المُحفِّز.
- التنظيف

### الاحتياجات الأساسية

بشكل عام، لكي تعمل CI على مستودع، نحتاج إلى بضعة أمور:
- مستودع (بديهي)
- تعريف لما تحتاج CI إلى فعله: يمكن أن يكون ذلك في صورة ملف معيّن داخل المستودع أو يمكن تعريفه في نظام CI نفسه
- أن تكون CI على علم بوجود المستودع (وملف الإعدادات داخله)
- أن تكون CI قادرة على الوصول إلى المستودع
- أن تملك CI الأذونات اللازمة لتنفيذ الإجراءات التي يُفترض أن تقوم بها: على سبيل المثال، إذا احتاجت CI إلى النشر في بيئة إنتاج، فإنها تحتاج إلى <em>بيانات اعتماد</em>&nbsp;لتلك البيئة.

هذا هو النموذج التقليدي على الأقل، وسنرى بعد قليل كيف تختصر GitHub Actions بعض هذه الخطوات، أو بالأحرى تجعلها بحيث لا داعي للقلق بشأنها!

لـGitHub Actions ميزة كبيرة على الحلول المستضافة ذاتياً: فالمستودع مستضاف لدى مزوّد CI. بعبارة أخرى، يوفّر GitHub كلاً من المستودع ومنصة CI. وهذا يعني أننا إذا فعّلنا Actions لمستودع، فإن GitHub يعلم مسبقاً بأن لدينا أسيار عمل معرّفة وكيف تبدو تلك التعريفات.

<div class="tasks">

**2. المشروع المثال**

</div>

### البدء مع سير العمل

المكوّن الجوهري لإنشاء خطوط أنابيب CI/CD باستخدام GitHub Actions هو ما يُسمى&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows" target="_blank" rel="noreferrer noopener">سير العمل (Workflow)</a>. أسيار العمل هي تدفقات عملية يمكنك إعدادها في مستودعك لتشغيل مهام آلية مثل البناء والاختبار وفحص الشيفرة وإصدار الإصدارات والنشر، على سبيل المثال لا الحصر! يبدو التسلسل الهرمي لسير العمل كما يلي:

سير العمل
- مهمة
- مهمة

يجب أن يحدد كل سير عمل&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs" target="_blank" rel="noreferrer noopener">مهمة (Job)</a> واحدة على الأقل، تحتوي على مجموعة من&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps" target="_blank" rel="noreferrer noopener">الخطوات (Steps)</a>&nbsp;لتنفيذ مهام فردية. تُشغَّل المهام بالتوازي، أما الخطوات في كل مهمة فتُنفَّذ بالتتابع.

تتنوع الخطوات بين تشغيل أمر مخصص واستخدام إجراءات معرّفة مسبقاً، ومن هنا جاء اسم GitHub Actions. يمكنك إنشاء&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/creating-actions" target="_blank" rel="noreferrer noopener">إجراءات مخصصة</a>&nbsp;أو استخدام أي إجراءات ينشرها المجتمع، وهي كثيرة، لكن لنعد إلى ذلك لاحقاً!

لكي يتعرف GitHub على أسيار عملك، يجب تحديدها في مجلد <em>.github/workflows</em> داخل مستودعك. كل سير عمل هو ملف منفصل بذاته، ويجب إعداده باستخدام لغة تسلسل البيانات <a href="https://yaml.org/" data-type="link" data-id="https://yaml.org/">YAML</a>.

YAML اختصار تكراري لعبارة "YAML Ain't Markup Language". وكما يوحي الاسم، هدفها أن تكون مقروءة للبشر، وهي تُستخدم عادةً في ملفات الإعدادات.

لاحظ أن المسافات البادئة مهمة في YAML. يمكنك تعلم المزيد عن الصياغة&nbsp;<a href="https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html" target="_blank" rel="noreferrer noopener">هنا</a>.

يحتوي سير العمل الأساسي على ثلاثة عناصر في مستند YAML. هذه العناصر الثلاثة هي:
- name: أجل، لقد خمّنتها، اسم سير العمل
- (on) triggers: الأحداث التي تحفّز تنفيذ سير العمل
- jobs: المهام المنفصلة التي سينفذها سير العمل (قد يحتوي سير العمل الأساسي على مهمة واحدة فقط).

يبدو تعريف سير العمل البسيط هكذا:

```
name: Hello World!

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
          echo "Hello World!"
```

توجد مهمة واحدة باسم <em>hello_world_job</em>، وستُشغَّل في بيئة افتراضية بنظام Ubuntu 24.04. للمهمة خطوة واحدة فقط باسم "Say hello"، وستنفّذ الأمر <code>echo "Hello World!"</code> في صدفة النظام.

قد تتساءل إذن: متى يحفّز GitHub بدء سير العمل؟ هناك الكثير من&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">الخيارات</a>&nbsp;للاختيار منها، لكن بشكل عام يمكنك إعداد سير العمل ليبدأ عند:
- وقوع <em>حدث على GitHub</em>&nbsp;مثل دفع (push) commit إلى مستودع أو إنشاء issue أو pull request
- وقوع <em>حدث مجدول</em>، يُحدد باستخدام صياغة&nbsp;<a href="https://en.wikipedia.org/wiki/Cron" target="_blank" rel="noreferrer noopener">cron</a>
- وقوع <em>حدث خارجي</em>، على سبيل المثال تنفيذ أمر في تطبيق خارجي مثل تطبيق المراسلة&nbsp;<a href="https://slack.com/" target="_blank" rel="noreferrer noopener">Slack</a>&nbsp;أو&nbsp;<a href="https://discord.com/" target="_blank" rel="noreferrer noopener">Discord</a>

لمعرفة المزيد عن الأحداث التي يمكن استخدامها لتحفيز سير العمل، يُرجى الرجوع إلى&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;GitHub Actions.

<div class="tasks">

**3. مرحباً بالعالم!**

</div>

<div class="tasks">

**4. التاريخ ومحتويات المجلد**

</div>

### إعداد خطوات الفحص والاختبار والبناء

بعد إكمال التمارين الأولى، سيكون لديك سير عمل بسيط لكنه عديم الفائدة تقريباً. لنجعل سير العمل يقوم بشيء مفيد.

لنُنفّذ إجراءً (action) في GitHub Actions يقوم بفحص الشيفرة. إذا لم تنجح الفحوصات، سيعرض GitHub Actions حالة حمراء.

في البداية، يبدو سير العمل الذي سنحفظه في الملف <em>pipeline.yml</em> هكذا:

```
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
```

قبل أن نتمكن من تشغيل أمر لفحص الشيفرة، علينا تنفيذ بضعة إجراءات لتهيئة بيئة المهمة.

#### تهيئة البيئة

تُعدّ تهيئة البيئة خطوة مهمة عند إعداد خط أنابيب. سنستخدم بيئة افتراضية <em>ubuntu-latest</em> لأنها مطابقة لإصدار Ubuntu (وهو 24.04) الذي سنشغّله في الإنتاج.

من المهم محاكاة البيئة نفسها في CI كما في الإنتاج بأقصى قدر ممكن من الدقة، لتجنّب حالات تعمل فيها الشيفرة نفسها بشكل مختلف في CI وفي الإنتاج، وهو ما يُبطل الغرض من استخدام CI فعلياً.

بعد ذلك، نُدرج الخطوات في مهمة "build" التي ستحتاج CI إلى تنفيذها. كما لاحظنا في التمرين الأخير، لا تحتوي البيئة الافتراضية افتراضياً على أي شيفرة، لذا نحتاج إلى&nbsp;<em>سحب الشيفرة</em>&nbsp;من المستودع.

هذه خطوة سهلة:

```
name: Deployment pipeline

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
```

تُخبر الكلمة المفتاحية&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses" target="_blank" rel="noreferrer noopener">uses</a>&nbsp;سير العمل بتشغيل&nbsp;<em>إجراء</em> معيّن. والإجراء قطعة شيفرة قابلة لإعادة الاستخدام، مثل دالة. يمكن تعريف الإجراءات في مستودعك في ملف منفصل، أو يمكنك استخدام الإجراءات المتاحة في المستودعات العامة.

هنا نستخدم إجراءً عاماً هو <a href="https://github.com/actions/checkout" target="_blank" rel="noreferrer noopener">actions/checkout</a>، ونحدد إصداراً (@v6) لتجنّب التغييرات الكاسرة المحتملة إذا حُدِّث الإجراء. يفعل إجراء <em>checkout</em> ما يوحي به الاسم: فهو يسحب الشيفرة المصدرية للمشروع من Git.

ثانياً، بما أن التطبيق مكتوب بـJavaScript، يجب تهيئة Node.js لتتمكن من استخدام الأوامر المحددة في <em>package.json</em>. لتهيئة Node.js يمكن استخدام إجراء <a href="https://github.com/actions/setup-node" target="_blank" rel="noreferrer noopener">actions/setup-node</a>. اختير الإصدار 24 من Node لأنه الإصدار الذي يستخدمه التطبيق في بيئة الإنتاج.

```
# لم يعد يُعرض الاسم والمُحفِّز...

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
```

كما نرى، تُستخدم الكلمة المفتاحية&nbsp;<a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith" target="_blank" rel="noreferrer noopener">with</a>&nbsp;لإعطاء "معامل" للإجراء. وهنا يحدد المعامل إصدار Node.js الذي نريد استخدامه.

أخيراً، يجب تثبيت اعتماديات التطبيق. وكما على جهازك الخاص، ننفّذ <code>npm install</code>. ينبغي أن تبدو الخطوات في المهمة الآن هكذا:

```
jobs:
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
```

الآن ينبغي أن تكون البيئة جاهزة بالكامل كي تنفّذ المهمة مهامها المهمة.

#### فحص الشيفرة

بعد تهيئة البيئة، يمكننا تشغيل جميع السكربتات من package.json كما نفعل على جهازنا الخاص. لفحص الشيفرة، كل ما عليك فعله هو إضافة خطوة لتشغيل الأمر <code>npm run eslint</code>.

```
jobs:
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
```

لاحظ أن&nbsp;<em>name</em>&nbsp;الخطوة اختياري؛ فإذا عرّفت خطوة كما يلي

```
- run: npm run eslint
```

يُستخدم الأمر الذي يُشغَّل كاسم افتراضي.

<div class="tasks">

**5. سير عمل فحص الشيفرة**

</div>

<div class="tasks">

**6. أصلح الشيفرة**

</div>

<div class="tasks">

**7. البناء والاختبار**

</div>

<div class="tasks">

**8. العودة إلى اللون الأخضر**

</div>

<div class="tasks">

**9. اختبارات من طرف إلى طرف بسيطة**

</div>
