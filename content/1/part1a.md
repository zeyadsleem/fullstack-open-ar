---
mainImage: /images/part-1.svg
part: 1
letter: a
lang: ar
---

<div class="content">

سنبدأ الآن التعرّف على ما هو على الأرجح أهم موضوع في هذه الدورة، ألا وهو مكتبة [React](https://react.dev/). لنبدأ بإنشاء تطبيق React بسيط والتعرّف على المفاهيم الأساسية لـ React.

أسهل طريقة للبدء بفارق كبير هي استخدام أداة تُسمى [Vite](https://vitejs.dev/).

لننشئ تطبيقًا جديدًا باستخدام أداة <i>create-vite</i>:

```bash
npm create vite@latest
```

لنجب عن الأسئلة التي تعرضها الأداة كما يلي:

![عرض اختيارات أداة create-vite، حيث يُسمّى المشروع part1، وإطار العمل React، والصيغة JavaScript، وتُجاب جميع الأسئلة الأخرى بـ No](../../images/1/1-create-vite.webp)

لقد أنشأنا الآن تطبيقًا اسمه <i>part1</i>. كان بإمكان الأداة أيضًا تثبيت الاعتماديات المطلوبة وبدء التطبيق تلقائيًا لو أجبنا بـ "Yes" عن السؤال "Install with npm and start now?". لكننا سننفّذ هذه الخطوات يدويًا حتى نرى كيف تُنجَز.

بعد ذلك، لننتقل إلى مجلد التطبيق ونثبّت المكتبات المطلوبة:

```bash
cd part1
npm install
```

يُبدأ التطبيق كما يلي:

```bash
npm run dev
```

تقول وحدة التحكم إن التطبيق بدأ على منفذ localhost رقم 5173، أي العنوان <http://localhost:5173/>:

![لقطة شاشة لوحدة التحكم تشغّل vite على localhost 5173](../../images/1/1-vite1.webp)

يبدأ Vite التطبيق [افتراضيًا](https://vitejs.dev/config/server-options.html#server-port) على المنفذ 5173. وإذا لم يكن هذا المنفذ متاحًا، يستخدم Vite رقم المنفذ الحر التالي.

افتح المتصفح ومحرر نصوص لتتمكن من عرض الشيفرة وصفحة الويب في الوقت نفسه على الشاشة:

![لقطة شاشة لصفحة vite الأولية وبنية الملفات في vs code](../../images/1/1-vite4.webp)

تقع شيفرة التطبيق في مجلد <i>src</i>. لنبسّط الشيفرة الافتراضية بحيث يصبح محتوى الملف main.jsx كما يلي:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ويصبح الملف <i>App.jsx</i> كما يلي

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

يمكن حذف الملفين <i>App.css</i> و<i>index.css</i> والمجلد <i>assets</i> لأننا لا نحتاج إليها في تطبيقنا الآن.

### مكوّن

يعرّف الملف <i>App.jsx</i> الآن [مكوّن React](https://react.dev/learn/your-first-component) باسم <i>App</i>. والأمر الموجود في السطر الأخير من الملف <i>main.jsx</i>

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

يعرض محتواه داخل عنصر <i>div</i> المعرّف في الملف <i>index.html</i> والذي يحمل قيمة <i>id</i> تساوي 'root'.

افتراضيًا، لا يحتوي الملف <i>index.html</i> على أي ترميز HTML مرئي لنا في المتصفح:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>part1</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

يمكنك أن تجرّب إضافة بعض HTML إلى الملف هناك. لكن عند استخدام React، يُعرَّف عادةً كل المحتوى الذي يجب عرضه كمكوّنات React.

لنلقِ نظرة أقرب على الشيفرة التي تعرّف المكوّن:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

كما خمّنت على الأرجح، سيُعرض المكوّن كوسم <i>div</i> يحيط بوسم <i>p</i> يحتوي على النص <i>Hello world</i>.

تقنيًا، يُعرَّف المكوّن كدالة JavaScript. ما يلي دالة (لا تستقبل أي معاملات):

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

ثم تُسنَد الدالة إلى متغير ثابت <i>App</i>:

```js
const App = ...
```

توجد عدة طرق لتعريف الدوال في JavaScript. سنستخدم هنا [دوال السهم](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)، وهي موصوفة في نسخة من JavaScript تُعرف باسم [ECMAScript 6](https://262.ecma-international.org/6.0/index.html?_gl=1*xxe99l*_ga*MjA1MjAzOTEwMC4xNzc0MjU2OTkx*_ga_TDCK4DWEPP*czE3NzQyNTY5OTEkbzEkZzEkdDE3NzQyNTczNzUkajYwJGwwJGgw)، وتُسمى أيضًا ES6.

ولأن الدالة تتكوّن من تعبير واحد فقط، استخدمنا صيغة مختصرة تمثّل قطعة الشيفرة هذه:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

بعبارة أخرى، تُعيد الدالة قيمة التعبير.

يمكن أن تحتوي الدالة التي تعرّف المكوّن على أي نوع من شيفرة JavaScript. عدّل مكوّنك ليصبح كما يلي:

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

ولاحظ ما يحدث في وحدة تحكم المتصفح

![وحدة تحكم المتصفح تعرض console log مع سهم يشير إلى "Hello from component"](../../images/1/30.webp)

القاعدة الأولى في تطوير الويب من جهة الواجهة الأمامية:

> <i>أبقِ وحدة التحكم مفتوحة طوال الوقت</i>

لنكرّر هذا معًا: <i>أَعِدُ بإبقاء وحدة التحكم مفتوحة طوال الوقت</i> خلال هذه الدورة، وطوال بقية حياتي عندما أعمل في تطوير الويب.

من الممكن أيضًا عرض محتوى ديناميكي داخل المكوّن.

عدّل المكوّن كما يلي:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  console.log(now, a+b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

تُقيَّم أي شيفرة JavaScript داخل الأقواس المعقوفة، وتُدمج نتيجة هذا التقييم في المكان المحدد في HTML الذي ينتجه المكوّن.

لاحظ أنه يجب ألا تحذف السطر الموجود في أسفل المكوّن

```js
export default App
```

لا يظهر export في معظم أمثلة مادة الدورة. وبدون export، ينهار المكوّن والتطبيق بأكمله.

هل تذكرت وعدك بإبقاء وحدة التحكم مفتوحة؟ ما الذي طُبع هناك؟

### JSX

يبدو أن مكوّنات React تُعيد ترميز HTML. لكن الأمر ليس كذلك. فغالبًا ما يُكتب تخطيط مكوّنات React باستخدام [JSX](https://react.dev/learn/writing-markup-with-jsx). فرغم أن JSX يشبه HTML، فإننا نتعامل مع طريقة لكتابة JavaScript. ففي الخفاء، تُترجم JSX التي تُعيدها مكوّنات React إلى JavaScript.

بعد الترجمة، يبدو تطبيقنا هكذا:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

تتولى [Babel](https://babeljs.io/repl/) عملية الترجمة. والمشاريع المنشأة باستخدام *Vite* مهيأة للترجمة تلقائيًا. سنتعلم المزيد عن هذا الموضوع في [الجزء 7](/part7) من هذه الدورة.

من الممكن أيضًا كتابة React كـ "JavaScript خالص" دون استخدام JSX. لكن لن يفعل ذلك أي شخص يتمتع بعقل سليم.

عمليًا، يشبه JSX لغة HTML كثيرًا، مع فارق أنه يتيح لك تضمين محتوى ديناميكي بسهولة عبر كتابة شيفرة JavaScript المناسبة داخل الأقواس المعقوفة. وفكرة JSX شبيهة جدًا بالعديد من لغات القوالب، مثل Thymeleaf المستخدمة مع Java Spring، والتي تُستخدم على الخوادم.

JSX "شبيه بـ [XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)"، وهذا يعني أن كل وسم يحتاج إلى إغلاق. على سبيل المثال، السطر الجديد عنصر فارغ، ويمكن كتابته في HTML كما يلي:

```html
<br>
```

لكن عند كتابة JSX، يجب إغلاق الوسم:

```html
<br />
```

### مكوّنات متعددة

لنعدّل الملف <i>App.jsx</i> كما يلي:

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

عرّفنا مكوّنًا جديدًا <i>Hello</i> واستخدمناه داخل المكوّن <i>App</i>. وبطبيعة الحال، يمكن استخدام المكوّن عدة مرات:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

**ملاحظة**: يُحذف <em>export</em> في الأسفل في هذه <i>الأمثلة</i>، الآن وفي المستقبل. لكنه ما زال ضروريًا لتعمل الشيفرة

كتابة المكوّنات باستخدام React سهلة، وبدمج المكوّنات يمكن الحفاظ على قابلية صيانة تطبيق أكثر تعقيدًا إلى حد كبير. بل إن من الفلسفات الجوهرية في React تركيب التطبيقات من العديد من المكوّنات المتخصصة القابلة لإعادة الاستخدام.

وهناك عُرف قوي آخر هو فكرة <i>المكوّن الجذري</i> المسمى <i>App</i> في قمة شجرة مكوّنات التطبيق. ومع ذلك، كما سنتعلم في [الجزء 6](/part6)، هناك حالات لا يكون فيها المكوّن <i>App</i> هو الجذر تمامًا، بل يكون ملفوفًا داخل مكوّن مساعد مناسب.

### props: تمرير البيانات إلى المكوّنات

من الممكن تمرير البيانات إلى المكوّنات باستخدام ما يُسمى [props](https://react.dev/learn/passing-props-to-a-component).

لنعدّل المكوّن <i>Hello</i> كما يلي:

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

الآن أصبح للدالة التي تعرّف المكوّن معامل props. ويتلقى هذا المعامل كوسيط كائنًا يحتوي على حقول تقابل كل "props" يحددها مستخدم المكوّن.

وتُعرَّف الـ props كما يلي:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='George' /> // highlight-line
      <Hello name='Daisy' /> // highlight-line
    </div>
  )
}
```

يمكن أن يكون هناك عدد اعتباطي من الـ props، ويمكن أن تكون قيمها نصوصًا "مكتوبة مباشرة" أو نتائج تعبيرات JavaScript. وإذا حُصل على قيمة prop باستخدام JavaScript فيجب لفّها بأقواس معقوفة.

لنعدّل الشيفرة بحيث يستخدم المكوّن <i>Hello</i> خاصيتي props:

```js
const Hello = (props) => {
  console.log(props) // highlight-line
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // highlight-line
  const age = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} />     // highlight-line
    </div>
  )
}
```

الـ props التي يرسلها المكوّن <i>App</i> هي قيم المتغيرات، ونتيجة تقييم تعبير الجمع، ونص عادي.

كما يسجّل المكوّن <i>Hello</i> قيمة الكائن props في وحدة التحكم.

آمل حقًا أن تكون وحدة التحكم لديك مفتوحة. وإن لم تكن كذلك، فتذكّر ما وعدت به:

> <i>أَعِدُ بإبقاء وحدة التحكم مفتوحة طوال الوقت خلال هذه الدورة، وطوال بقية حياتي عندما أعمل في تطوير الويب</i>

تطوير البرمجيات صعب. ويصبح أصعب إذا لم يستخدم المرء كل الأدوات المتاحة الممكنة مثل وحدة تحكم الويب والطباعة التصحيحية باستخدام _console.log_. فالمحترفون يستخدمون كليهما <i>طوال الوقت</i>، ولا يوجد سبب واحد يمنع المبتدئ من تبنّي استخدام هذه الأساليب المساعدة الرائعة التي ستجعل حياته أسهل بكثير.

### رسالة خطأ محتملة

إذا كان مشروعك يستخدم إصدار React 18 أو أقدم، فقد تتلقى رسالة الخطأ التالية في هذه المرحلة:

![لقطة شاشة لـ vs code تعرض خطأ eslint: "name is missing in props validation"](../../images/1/1-vite5.webp)

إنه ليس خطأ فعليًا، بل تحذير تسببه أداة [ESLint](https://eslint.org/). يمكنك إسكات تحذير [react/prop-types](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) بإضافة السطر التالي إلى الملف <i>eslint.config.js</i>

```js
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 0, // highlight-line
    },
  },
]
```

سنتعرّف على ESLint بمزيد من التفصيل [في الجزء 3](/part3/validation_and_es_lint#lint).

### بعض الملاحظات

ضُبط React لتوليد رسائل خطأ واضحة تمامًا. ورغم ذلك، ينبغي لك، في البداية على الأقل، أن تتقدم بـ **خطوات صغيرة جدًا** وأن تتأكد من أن كل تغيير يعمل كما هو مطلوب.

**يجب أن تكون وحدة التحكم مفتوحة دائمًا**. إذا أبلغ المتصفح عن أخطاء، فليس من المستحسن مواصلة كتابة المزيد من الشيفرة أملًا في حدوث معجزة. بل ينبغي أن تحاول فهم سبب الخطأ، وأن تعود مثلًا إلى الحالة السابقة التي كانت تعمل:

![لقطة شاشة لخطأ prop غير معرّف](../../images/1/1-vite6.webp)

كما ذكرنا سابقًا، عند البرمجة باستخدام React، من الممكن بل ويستحق الأمر كتابة أوامر <em>console.log()</em> (التي تطبع في وحدة التحكم) داخل شيفرتك.

وتذكّر أيضًا أن **الحرف الأول من أسماء مكوّنات React يجب أن يكون كبيرًا**. إذا حاولت تعريف مكوّن كما يلي:

```js
const footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
```

واستخدمته هكذا

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

فلن تعرض الصفحة المحتوى المعرّف داخل مكوّن footer، وبدلًا من ذلك ينشئ React فقط عنصر [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) فارغًا، أي عنصر HTML المدمج بدلًا من عنصر React المخصص الذي يحمل الاسم نفسه. وإذا غيّرت الحرف الأول من اسم المكوّن إلى حرف كبير، فإن React ينشئ عنصر <i>div</i> معرّفًا في مكوّن Footer، ويُعرض على الصفحة.

لاحظ أن محتوى مكوّن React يحتاج (عادةً) إلى أن يحتوي على **عنصر جذر واحد**. فإذا حاولنا، على سبيل المثال، تعريف المكوّن <i>App</i> دون عنصر <i>div</i> الخارجي:

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name='Maya' age={26 + 10} />
    <Footer />
  )
}
```

فالنتيجة هي رسالة خطأ.

![لقطة شاشة لخطأ عناصر جذر متعددة](../../images/1/1-vite7.webp)

استخدام عنصر جذر ليس الخيار الوحيد الذي يعمل. فـ<i>مصفوفة</i> من المكوّنات حل صالح أيضًا:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

لكن عند تعريف المكوّن الجذري للتطبيق، فإن هذا ليس أمرًا حكيمًا بشكل خاص، ويجعل الشيفرة تبدو قبيحة بعض الشيء.

ولأن عنصر الجذر مطلوب، فإن لدينا عناصر div "إضافية" في شجرة DOM. ويمكن تجنّب ذلك باستخدام [fragments](https://react.dev/reference/react/Fragment)، أي بلفّ العناصر التي سيعيدها المكوّن بعنصر فارغ:

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

الآن تُترجم الشيفرة بنجاح، ولم يعد DOM الذي ينشئه React يحتوي على عنصر div الإضافي.

### لا تعرض الكائنات

تأمّل تطبيقًا يطبع أسماء أصدقائنا وأعمارهم على الشاشة:

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

لكن لا يظهر شيء على الشاشة. قضيت 15 دقيقة أحاول إيجاد مشكلة في الشيفرة، لكنني لم أستطع معرفة أين يمكن أن تكون المشكلة.

وأخيرًا أتذكر الوعد الذي قطعناه

> <i>أَعِدُ بإبقاء وحدة التحكم مفتوحة طوال الوقت خلال هذه الدورة، وطوال بقية حياتي عندما أعمل في تطوير الويب</i>

تصرخ وحدة التحكم بالأحمر:

![devtools تعرض خطأ مع إبراز حول "Objects are not valid as a React child"](../../images/1/34new.webp)

جوهر المشكلة هو <i>Objects are not valid as a React child</i>، أي أن التطبيق يحاول عرض <i>كائنات</i> ويفشل مرة أخرى.

تحاول الشيفرة عرض معلومات أحد الأصدقاء كما يلي

```js
<p>{friends[0]}</p>
```

وهذا يسبب مشكلة لأن العنصر المطلوب عرضه داخل الأقواس المعقوفة هو كائن.

```js
{ name: 'Peter', age: 4 }
```

في React، يجب أن تكون العناصر الفردية المعروضة داخل الأقواس المعقوفة قيمًا أولية، مثل الأعداد أو النصوص.

الإصلاح كما يلي

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

فالآن يُعرض اسم الصديق منفصلًا داخل الأقواس المعقوفة

```js
{friends[0].name}
```

والعمر

```js
{friends[0].age}
```

بعد تصحيح الخطأ، يجب أن تمسح رسائل الخطأ من وحدة التحكم بالضغط على 🚫 ثم تعيد تحميل محتوى الصفحة وتتأكد من عدم عرض أي رسائل خطأ.

ملاحظة إضافية صغيرة على ما سبق. يسمح React أيضًا بعرض المصفوفات <i>إذا</i> كانت المصفوفة تحتوي على قيم صالحة للعرض (مثل الأعداد أو النصوص). لذا سيعمل البرنامج التالي، وإن كانت النتيجة قد لا تكون ما نريد:

```js
const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

في هذا الجزء، لا يستحق الأمر حتى محاولة استخدام العرض المباشر للجداول، وسنعود إليه في الجزء التالي.

</div>

<div class="tasks">
  <h3>تمارين 1.1.-1.2.</h3>

تُسلَّم التمارين عبر GitHub، وبتعليم التمارين كمنجزة في تبويب «تسليماتي» (my submissions) في [تطبيق التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

تُسلَّم التمارين **جزءًا واحدًا في كل مرة**. وعندما تسلّم تمارين جزء من الدورة، لم يعد بإمكانك تسليم تمارين غير منجزة للجزء نفسه.

لاحظ أنه توجد في هذا الجزء [تمارين إضافية](/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14) إلى جانب تلك الموجودة أدناه. <i>لا تسلّم عملك</i> حتى تكمل كل التمارين التي تريد تسليمها للجزء.

يمكنك تسليم جميع تمارين هذه الدورة في المستودع نفسه، أو استخدام عدة مستودعات. وإذا سلّمت تمارين أجزاء مختلفة في المستودع نفسه، فيرجى استخدام نظام تسمية معقول للمجلدات.

من بنى الملفات العملية جدًا لمستودع التسليم ما يلي:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

انظر إلى [مستودع التسليم النموذجي](https://github.com/fullstack-hy2020/example-submission-repository) هذا!

لكل جزء من الدورة يوجد مجلد، يتفرّع بدوره إلى مجلدات تحتوي على سلسلة من التمارين، مثل "unicafe" للجزء 1.

تبني معظم تمارين الدورة تطبيقًا أكبر، مثل courseinfo وunicafe وanecdotes في هذا الجزء، شيئًا فشيئًا. ويكفي تسليم التطبيق المكتمل. ويمكنك إجراء commit بعد كل تمرين، لكن ذلك ليس إلزاميًا. فمثلًا يُبنى تطبيق معلومات الدورة في التمارين 1.1.-1.5. وما تحتاج إلى تسليمه هو النتيجة النهائية بعد 1.5 فقط!

لكل تطبيق ويب مخصص لسلسلة من التمارين، يُوصى بتسليم جميع الملفات المتعلقة بذلك التطبيق، باستثناء المجلد <i>node\_modules</i>.

  <h4>1.1: معلومات الدورة، الخطوة 1</h4>

<i>التطبيق الذي سنبدأ العمل عليه في هذا التمرين سيُطوَّر أكثر في بعض التمارين التالية. وفي هذه المجموعة وغيرها من مجموعات التمارين القادمة في هذه الدورة، يكفي تسليم الحالة النهائية للتطبيق فقط. وإذا رغبت، يمكنك أيضًا إنشاء commit لكل تمرين في السلسلة، لكن هذا اختياري تمامًا.</i>

استخدم Vite لتهيئة تطبيق جديد. عدّل <i>main.jsx</i> ليطابق ما يلي

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

و<i>App.jsx</i> ليطابق ما يلي

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

واحذف الملفين الإضافيين <i>App.css</i> و<i>index.css</i>، واحذف أيضًا المجلد <i>assets</i>.

لسوء الحظ، التطبيق كله في المكوّن نفسه. أعد هيكلة الشيفرة بحيث تتكوّن من ثلاثة مكوّنات جديدة: <i>Header</i> و<i>Content</i> و<i>Total</i>. تظل كل البيانات في المكوّن <i>App</i>، الذي يمرّر البيانات اللازمة إلى كل مكوّن باستخدام <i>props</i>. يتولى <i>Header</i> عرض اسم الدورة، ويعرض <i>Content</i> الأجزاء وعدد تمارينها، ويعرض <i>Total</i> العدد الإجمالي للتمارين.

عرّف المكوّنات الجديدة في الملف <i>App.jsx</i>.

سيكون جسم المكوّن <i>App</i> على النحو التالي تقريبًا:

```js
const App = () => {
  // تعريفات الثوابت

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**تحذير** لا تحاول برمجة كل المكوّنات في الوقت نفسه، لأن ذلك سيكسر التطبيق بأكمله على الأرجح. تقدّم بخطوات صغيرة، فاصنع أولًا مثلًا المكوّن <i>Header</i>، وفقط عندما يعمل بالتأكيد، يمكنك الانتقال إلى المكوّن التالي.

قد يبدو التقدّم الحذر بخطوات صغيرة بطيئًا، لكنه في الواقع <i>أسرع طريقة للتقدّم بفارق كبير</i>. وقد صرّح مطوّر البرمجيات الشهير Robert "Uncle Bob" Martin

> <i>"الطريقة الوحيدة للإسراع هي أن تسير جيدًا"</i>

أي أنه وفقًا لـ Martin، فإن التقدّم الحذر بخطوات صغيرة هو حتى الطريقة الوحيدة لتكون سريعًا.

<h4>1.2: معلومات الدورة، الخطوة 2</h4>

أعد هيكلة المكوّن <i>Content</i> بحيث لا يعرض بنفسه أي أسماء للأجزاء أو أعداد تمارينها. وبدلًا من ذلك، يعرض فقط ثلاثة مكوّنات <i>Part</i>، يعرض كل منها اسم جزء وعدد تمارينه.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

يمرّر تطبيقنا المعلومات بطريقة بدائية جدًا في الوقت الحالي، لأنه يعتمد على متغيرات فردية. وسنصلح ذلك في [الجزء 2](/part2)، لكن قبل ذلك، لننتقل إلى part1b لتعلّم JavaScript.

</div>
