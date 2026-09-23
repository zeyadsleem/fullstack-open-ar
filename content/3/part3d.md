---
mainImage: /images/part-3.svg
part: 3
letter: d
lang: ar
---

<div class="content">

عادةً ما تكون هناك قيود نريد تطبيقها على البيانات المخزّنة في قاعدة بيانات تطبيقنا. لا ينبغي أن يقبل تطبيقنا ملاحظات تمتلك خاصية <i>content</i> مفقودة أو فارغة. يُتحقق من صلاحية الملاحظة في معالج المسار:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

إذا لم تمتلك الملاحظة خاصية <i>content</i>، نستجيب للطلب برمز الحالة <i>400 bad request</i>.

من الطرق الأذكى للتحقق من صيغة البيانات قبل تخزينها في قاعدة البيانات استخدام وظيفة [التحقق](https://mongoosejs.com/docs/validation.html) المتاحة في Mongoose.

يمكننا تعريف قواعد تحقق محددة لكل حقل في المخطط:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

أصبح حقل <i>content</i> الآن مطلوباً أن يكون طوله خمسة أحرف على الأقل، وقد ضُبط كحقل مطلوب، أي أنه لا يمكن أن يكون مفقوداً. لم نضف أي قيود على حقل <i>important</i>، لذا لم يتغير تعريفه في المخطط.

المتحققان <i>minLength</i> و<i>required</i> [مدمجان](https://mongoosejs.com/docs/validation.html#built-in-validators) وتوفرهما Mongoose. تتيح لنا وظيفة [المتحقق المخصص](https://mongoosejs.com/docs/validation.html#custom-validators) في Mongoose إنشاء متحققين جدد إذا لم يغطِّ أي من المتحققين المدمجين احتياجاتنا.

إذا حاولنا تخزين كائن في قاعدة البيانات يخالف أحد القيود، فسترمي العملية استثناءً. لنغيّر معالج إنشاء ملاحظة جديدة بحيث يمرّر أي استثناءات محتملة إلى الوسيط معالج الأخطاء:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```

لنوسّع معالج الأخطاء ليتعامل مع أخطاء التحقق هذه:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

عندما يفشل التحقق من كائن، نعيد رسالة الخطأ الافتراضية التالية من Mongoose:

![postman يعرض رسالة خطأ](../../images/3/50.webp)

### نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج

ينبغي أن يعمل التطبيق كما هو تقريباً على Fly.io/Render. لا نحتاج إلى توليد بناء إنتاجي جديد للواجهة الأمامية لأن التغييرات حتى الآن كانت على واجهتنا الخلفية فقط.

لن تُستخدم متغيرات البيئة المعرّفة في dotenv إلا عندما لا تكون الواجهة الخلفية في <i>وضع الإنتاج</i>، أي Fly.io أو Render.

في الإنتاج، علينا ضبط رابط قاعدة البيانات في الخدمة التي تستضيف تطبيقنا.

في Fly.io يتم ذلك بالأمر _fly secrets set_:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

أثناء تطوير التطبيق، من المرجح جداً أن يفشل شيء ما. مثلاً، عندما نشرت تطبيقي لأول مرة مع قاعدة البيانات، لم تظهر أي ملاحظة على الإطلاق:

![متصفح لا تظهر فيه أي ملاحظات](../../images/3/fly-problem1.webp)

كشف تبويب الشبكة في وحدة تحكم المتصفح أن جلب الملاحظات لم ينجح، فقد بقي الطلب مدة طويلة في حالة _pending_ حتى فشل برمز الحالة 502.

يجب أن تبقى وحدة تحكم المتصفح مفتوحة <i>طوال الوقت!</i>

من الضروري أيضاً متابعة سجلات الخادم باستمرار. أصبحت المشكلة واضحة عندما فُتحت السجلات بالأمر _fly logs_:

![سجل خادم fly.io يظهر الاتصال بـ undefined](../../images/3/fly-problem3.webp)

كان رابط قاعدة البيانات _undefined_، لذا نُسي الأمر *fly secrets set MONGODB\_URI*.

ستحتاج أيضاً إلى إدراج عنوان IP لتطبيق fly.io في القائمة البيضاء لدى MongoDB Atlas. إذا لم تفعل ذلك سترفض MongoDB الاتصال.

للأسف، لا يوفر fly.io عنوان IPv4 مخصصاً لتطبيقك، لذا ستحتاج إلى السماح لجميع عناوين IP في MongoDB Atlas.

عند استخدام Render، يُعطى رابط قاعدة البيانات عبر تعريف متغير البيئة المناسب في لوحة التحكم:

![لوحة تحكم Render تعرض متغير البيئة MONGODB_URI](../../images/3/render-env.webp)

تعرض لوحة تحكم Render سجلات الخادم:

![لوحة تحكم Render مع سهم يشير إلى خادم يعمل على المنفذ 10000](../../images/3/r7.webp)

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-6</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).

</div>

<div class="tasks">

### تمارين 3.19.-3.21.

#### 3.19*: قاعدة بيانات دليل الهاتف، الخطوة 7

وسّع التحقق بحيث يجب أن يكون الاسم المخزّن في قاعدة البيانات طوله ثلاثة أحرف على الأقل.

وسّع الواجهة الأمامية بحيث تعرض شكلاً من أشكال رسالة الخطأ عند حدوث خطأ تحقق. يمكن تنفيذ معالجة الأخطاء بإضافة كتلة <em>catch</em> كما هو موضح أدناه:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // هذه هي طريقة الوصول إلى رسالة الخطأ
      console.log(error.response.data.error)
    })
```

يمكنك عرض رسالة الخطأ الافتراضية التي تعيدها Mongoose، حتى وإن لم تكن مقروءة كما ينبغي:

![لقطة شاشة لدليل الهاتف تظهر فشل التحقق من شخص](../../images/3/56e.webp)

**ملاحظة:** في عمليات التحديث، تكون أدوات التحقق في mongoose معطّلة افتراضياً. [اقرأ الوثائق](https://mongoosejs.com/docs/validation.html) لمعرفة كيفية تفعيلها.

#### 3.20*: قاعدة بيانات دليل الهاتف، الخطوة 8

أضف تحققاً إلى تطبيق دليل الهاتف لديك، يضمن أن أرقام الهاتف بالصيغة الصحيحة. يجب أن يكون رقم الهاتف:

- طوله 8 أو أكثر
- مكوّناً من جزأين يفصل بينهما شرطة -، الجزء الأول يحتوي على رقمين أو ثلاثة أرقام والجزء الثاني يتكون أيضاً من أرقام
    - مثلاً 09-1234556 و040-22334455 أرقام هاتف صحيحة
    - مثلاً 1234556 و1-22334455 و10-22-334455 غير صحيحة

استخدم [متحققاً مخصصاً](https://mongoosejs.com/docs/validation.html#custom-validators) لتنفيذ الجزء الثاني من التحقق.

إذا حاول طلب HTTP POST إضافة شخص برقم هاتف غير صحيح، فينبغي أن يستجيب الخادم برمز حالة ورسالة خطأ مناسبتين.

#### 3.21 نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج

أنشئ نسخة "full stack" جديدة من التطبيق عبر إنشاء بناء إنتاجي جديد للواجهة الأمامية، ونسخه إلى مجلد الواجهة الخلفية. تحقق من أن كل شيء يعمل محلياً باستخدام التطبيق بالكامل من العنوان <http://localhost:3001/>.

ادفع أحدث نسخة إلى Fly.io/Render وتحقق من أن كل شيء يعمل هناك أيضاً.

**ملاحظة:** لن تنشر الواجهة الأمامية مباشرة في أي مرحلة من هذا الجزء. لا يُنشر سوى مستودع الواجهة الخلفية طوال هذا الجزء بأكمله. يُضاف البناء الإنتاجي للواجهة الأمامية إلى مستودع الواجهة الخلفية، وتقدّمه الواجهة الخلفية كما هو موضح في قسم [تقديم الملفات الثابتة من الواجهة الخلفية](/part3/deploying_app_to_internet#serving-static-files-from-the-backend).

</div>

<div class="content">

### Lint

قبل أن ننتقل إلى الجزء التالي، سنلقي نظرة على أداة مهمة تُسمى [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). تقول ويكيبيديا ما يلي عن lint:

> <i>بشكل عام، lint أو linter هي أي أداة تكتشف الأخطاء في لغات البرمجة وتشير إليها، بما في ذلك الأخطاء الأسلوبية. يُطلق مصطلح السلوك الشبيه بـ lint أحياناً على عملية الإشارة إلى الاستخدام المشبوه للغة. وعموماً تُجري الأدوات الشبيهة بـ lint تحليلاً ساكناً للشيفرة المصدرية.</i>

في اللغات المُصرَّفة ذات الأنواع الساكنة مثل Java، يمكن لبيئات التطوير المتكاملة مثل NetBeans الإشارة إلى الأخطاء في الشيفرة، حتى تلك التي تتجاوز مجرد أخطاء التصريف. ويمكن استخدام أدوات إضافية لإجراء [التحليل الساكن](https://en.wikipedia.org/wiki/Static_program_analysis) مثل [checkstyle](https://checkstyle.sourceforge.io)، لتوسيع قدرات بيئة التطوير بحيث تشير أيضاً إلى المشكلات المتعلقة بالأسلوب، مثل الإزاحة.

في عالم JavaScript، الأداة الرائدة حالياً للتحليل الساكن (المعروف أيضاً بـ "linting") هي [ESLint](https://eslint.org/).

لنضف ESLint كـ <i>اعتمادية تطوير</i> للواجهة الخلفية. اعتماديات التطوير هي أدوات لا تلزم إلا أثناء تطوير التطبيق. على سبيل المثال، الأدوات المتعلقة بالاختبار هي من هذه الاعتماديات. عندما يعمل التطبيق في وضع الإنتاج، لا تكون اعتماديات التطوير مطلوبة.

ثبّت ESLint كاعتمادية تطوير للواجهة الخلفية بالأمر:

```bash
npm install eslint @eslint/js --save-dev
```

سيتغير محتوى ملف package.json كما يلي:

```js
{
  //...
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "mongoose": "^8.11.0"
  },
  "devDependencies": { // highlight-line
    "@eslint/js": "^9.22.0", // highlight-line
    "eslint": "^9.22.0" // highlight-line
  }
}
```

أضاف الأمر قسم <i>devDependencies</i> إلى الملف وضمّن الحزمتين <i>eslint</i> و<i>@eslint/js</i>، وثبّت المكتبات المطلوبة في مجلد <i>node_modules</i>.

بعد ذلك يمكننا تهيئة إعداد افتراضي لـ ESLint بالأمر:

```bash
npx eslint --init
```

سنجيب عن جميع الأسئلة:

![مخرجات الطرفية من تهيئة ESLint](../../images/3/lint1.webp)

سيُحفظ الإعداد في الملف المُنشأ _eslint.config.mjs_.

### تنسيق ملف الإعداد

لنُعد تنسيق ملف الإعداد _eslint.config.mjs_ من شكله الحالي إلى ما يلي:

```js
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
]
```

حتى الآن، يعرّف ملف إعداد ESLint لدينا خيار _files_ بالقيمة _["\*\*/\*.js"]_، ما يخبر ESLint بالنظر في جميع ملفات JavaScript في مجلد مشروعنا. تحدد خاصية _languageOptions_ خيارات متعلقة بميزات اللغة التي ينبغي أن يتوقعها ESLint، وقد عرّفنا فيها خيار _sourceType_ بالقيمة "commonjs". يشير هذا إلى أن شيفرة JavaScript في مشروعنا تستخدم نظام وحدات CommonJS، ما يسمح لـ ESLint بتحليل الشيفرة وفقاً لذلك.  

تحدد خاصية _globals_ المتغيرات العامة المعرّفة مسبقاً. يخبر عامل النشر (spread operator) المطبّق هنا ESLint بتضمين جميع المتغيرات العامة المعرّفة في إعدادات _globals.node_ مثل _process_. وفي حالة شيفرة المتصفح نعرّف هنا _globals.browser_ للسماح بالمتغيرات العامة الخاصة بالمتصفح مثل _window_ و_document_.

أخيراً، خُصّصت خاصية _ecmaVersion_ بالقيمة "latest". يضبط هذا إصدار ECMAScript على أحدث إصدار متاح، ما يعني أن ESLint سيفهم أحدث صيغ وميزات JavaScript ويفحصها بشكل صحيح.

نريد الاستفادة من [إعدادات ESLint الموصى بها](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations) إلى جانب إعداداتنا الخاصة. تزوّدنا حزمة _@eslint/js_ التي ثبّتناها سابقاً بإعدادات معرّفة مسبقاً لـ ESLint. سنستوردها ونفعّلها في ملف الإعداد:

```js
import globals from 'globals'
import js from '@eslint/js' // highlight-line
// ...

export default [
  js.configs.recommended, // highlight-line
  {
    // ...
  },
]
```

أضفنا _js.configs.recommended_ إلى أعلى مصفوفة الإعداد، وهذا يضمن تطبيق إعدادات ESLint الموصى بها أولاً قبل خياراتنا المخصصة.

لنواصل بناء ملف الإعداد. ثبّت [إضافة](https://eslint.style/packages/js) تعرّف مجموعة من القواعد المتعلقة بأسلوب الشيفرة:

```bash
npm install --save-dev @stylistic/eslint-plugin
```

استورد الإضافة وفعّلها، وأضف قواعد أسلوب الشيفرة الأربع هذه:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin' // highlight-line

export default [
  {
    // ...
    // highlight-start
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
    // highlight-end
  },
]
```

توفر خاصية [plugins](https://eslint.org/docs/latest/use/configure/plugins) طريقة لتوسيع وظائف ESLint عبر إضافة قواعد وإعدادات وقدرات أخرى مخصصة غير متاحة في مكتبة ESLint الأساسية. ثبّتنا وفعّلنا _@stylistic/eslint-plugin_، الذي يضيف قواعد أسلوبية لـ JavaScript إلى ESLint. بالإضافة إلى ذلك، أُضيفت قواعد للإزاحة وفواصل الأسطر والعلامات التنصيصية والفواصل المنقوطة. جميع هذه القواعد الأربع معرّفة في [إضافة أنماط ESLint](https://eslint.style/packages/js).

**ملاحظة لمستخدمي Windows:** ضُبط نمط فواصل الأسطر على _unix_ في قواعد الأسلوب. يُوصى باستخدام فواصل أسطر بنمط Unix (_\n_) بغض النظر عن نظام التشغيل لديك، لأنها متوافقة مع معظم أنظمة التشغيل الحديثة وتسهّل التعاون عندما يعمل عدة أشخاص على الملفات نفسها. إذا كنت تستخدم فواصل أسطر بنمط Windows، فسينتج ESLint الأخطاء التالية: <i>Expected linebreaks to be 'LF' but found 'CRLF'</i>. في هذه الحالة، اضبط Visual Studio Code لاستخدام فواصل أسطر بنمط Unix باتباع [هذا الدليل](https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix).

### تشغيل أداة lint

يمكن فحص ملف مثل _index.js_ والتحقق منه بالأمر التالي:

```bash
npx eslint index.js
```

يُوصى بإنشاء _سكربت npm_ منفصل لعملية lint:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint ." // highlight-line
    // ...
  },
  // ...
}
```

الآن سيفحص الأمر _npm run lint_ كل ملف في المشروع.

تُفحص أيضاً الملفات الموجودة في مجلد <em>dist</em> عند تشغيل الأمر. لا نريد أن يحدث هذا، ويمكننا تحقيق ذلك بإضافة كائن يحمل خاصية [ignores](https://eslint.org/docs/latest/use/configure/ignore) التي تحدد مصفوفة بالمجلدات والملفات التي نريد تجاهلها.

```js
// ...
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },
  // highlight-start
  { 
    ignores: ['dist/**'], 
  },
  // highlight-end
]
```

يؤدي هذا إلى عدم فحص مجلد <em>dist</em> بأكمله بواسطة ESLint.

لدى lint الكثير لتقوله عن شيفرتنا:

![مخرجات الطرفية لأخطاء ESLint](../../images/3/53ea.webp)

بديل أفضل من تنفيذ أداة lint من سطر الأوامر هو ضبط _eslint-plugin_ في المحرر، يعمل على تشغيل أداة lint باستمرار. باستخدام الإضافة سترى الأخطاء في شيفرتك فوراً. يمكنك العثور على مزيد من المعلومات عن إضافة ESLint لـ Visual Studio [هنا](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

ستضع إضافة ESLint لـ VS Code خطاً أحمر تحت مخالفات الأسلوب:

![لقطة شاشة لإضافة ESLint في vscode تظهر الأخطاء](../../images/3/54a.webp)

هذا يجعل اكتشاف الأخطاء وإصلاحها فوراً أمراً سهلاً.

### إضافة المزيد من قواعد الأسلوب

لدى ESLint مجموعة واسعة من [القواعد](https://eslint.org/docs/rules/) يسهل الأخذ بها عبر تعديل ملف _eslint.config.mjs_.

لنضف قاعدة [eqeqeq](https://eslint.org/docs/rules/eqeqeq) التي تحذرنا إذا فُحصت المساواة بأي شيء غير المعامل الثلاثي يساوي. تُضاف القاعدة تحت حقل rules في ملف الإعداد.

```js
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error', // highlight-line
  },
  // ...
]
```

وبينما نحن في هذا السياق، لنجرِ بعض التغييرات الأخرى على القواعد.

لنمنع [المسافات الزائدة](https://eslint.style/rules/no-trailing-spaces) غير الضرورية في نهايات الأسطر، ونطلب أن [تكون هناك دائماً مسافة قبل الأقواس المعقوفة وبعدها](https://eslint.style/rules/object-curly-spacing)، ونطالب أيضاً باستخدام متسق للمسافات البيضاء في معاملات دوال السهم.

```js
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    // highlight-start
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    // highlight-end
  },
]
```

يأخذ إعدادنا الافتراضي مجموعة من القواعد المعرّفة مسبقاً من:

```js
// ...

export default [
  js.configs.recommended,
  // ...
]
```

يتضمن هذا قاعدة تحذر بشأن أوامر <em>console.log</em> التي لا نريد استخدامها. يمكن تعطيل قاعدة بتعريف "قيمتها" على أنها 0 أو _off_ في ملف الإعداد. لنفعل هذا بقاعدة _no-console_ في الوقت الحالي.

```js
[
  {
    // ...
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off', // highlight-line
    },
  },
]
```

سيسمح لنا تعطيل قاعدة no-console باستخدام عبارات console.log دون أن يشير إليها ESLint كمشكلات. يمكن أن يكون هذا مفيداً بشكل خاص أثناء التطوير عندما تحتاج إلى تصحيح أخطاء شيفرتك. إليك ملف الإعداد الكامل مع جميع التغييرات التي أجريناها حتى الآن:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

**ملاحظة** عندما تجري تغييرات على ملف _eslint.config.mjs_، يُوصى بتشغيل أداة lint من سطر الأوامر. سيتحقق هذا من أن ملف الإعداد منسّق بشكل صحيح:

![مخرجات الطرفية من npm run lint](../../images/3/lint2.webp)

إذا كان هناك خطأ ما في ملف إعدادك، فقد تتصرف إضافة lint بشكل غير منتظم تماماً.

تعرّف كثير من الشركات معايير للبرمجة تُفرض في جميع أنحاء المؤسسة عبر ملف إعداد ESLint. لا يُوصى بإعادة اختراع العجلة مراراً وتكراراً، وقد تكون فكرة جيدة تبنّي إعداد جاهز من مشروع شخص آخر في مشروعك. اعتمدت مشاريع كثيرة مؤخراً [دليل أسلوب JavaScript](https://github.com/airbnb/javascript) من Airbnb بالأخذ بإعداد [ESLint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) الخاص بـ Airbnb.

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-7</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).

</div>

<div class="tasks">

### تمرين 3.22.

#### 3.22: إعداد Lint

أضف ESLint إلى تطبيقك وأصلح جميع التحذيرات.

كان هذا آخر تمرين في هذا الجزء من المقرر. حان الوقت لدفع شيفرتك إلى GitHub وتسجيل جميع تمارينك المنجزة في [نظام تسليم التمارين](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
