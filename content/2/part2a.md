---
mainImage: /images/part-2.svg
part: 2
letter: a
lang: ar
---

<div class="content">

قبل بدء جزء جديد، لنستعرض سريعاً بعض المواضيع التي ثبت أنها صعبة في العام الماضي.

### console.log

***ما الفرق بين مبرمج JavaScript خبير ومبرمج مبتدئ؟ الخبير يستخدم console.log أكثر منه بـ10 إلى 100 مرة.***

ومن المفارقات أن هذا يبدو صحيحاً حتى مع أن المبرمج المبتدئ يحتاج إلى <i>console.log</i> (أو أي طريقة أخرى لتصحيح الأخطاء) أكثر من المبرمج الخبير.

عندما لا يعمل شيء ما، لا تكتفِ بالتخمين في سبب المشكلة. بل استخدم التسجيل أو أي طريقة أخرى لتصحيح الأخطاء.

**ملاحظة** كما شُرح في الجزء الأول، عندما تستخدم الأمر _console.log_ لتصحيح الأخطاء، لا تدمج الأشياء «على طريقة Java» بعلامة الجمع. فبدلاً من كتابة:

```js
console.log('props value is ' + props)
```

افصل بين الأشياء المراد طباعتها بفاصلة:

```js
console.log('props value is', props)
```

إذا دمجت كائناً مع نص وسجّلته في وحدة التحكم (كما في مثالنا الأول)، فستكون النتيجة عديمة الفائدة تماماً:

```js
props value is [object Object]
```

وعلى العكس، عندما تمرّر الكائنات كوسائط منفصلة تفصل بينها فواصل إلى _console.log_، كما في مثالنا الثاني أعلاه، يُطبع محتوى الكائن في وحدة تحكم المطوّر كنصوص مفيدة.
وإذا لزم الأمر، اقرأ المزيد عن [تصحيح أخطاء تطبيقات React](/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications).

### نصيحة احترافية: مقتطفات Visual Studio Code

مع Visual Studio Code، من السهل إنشاء «مقتطفات» (snippets)، أي اختصارات لتوليد أجزاء الشيفرة الشائعة الاستخدام بسرعة، تماماً كما تعمل 'sout' في Netbeans.

تجد تعليمات إنشاء المقتطفات [هنا](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

كما تجد مقتطفات جاهزة ومفيدة كإضافات لـVS Code في [متجر الإضافات](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).

أهم مقتطف هو مقتطف الأمر <em>console.log()</em>، مثل <em>clog</em>. ويمكن إنشاؤه هكذا:

```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

تصحيح شيفرتك باستخدام _console.log()_ شائع إلى حد أن Visual Studio Code يضم هذا المقتطف مدمجاً. لاستخدامه، اكتب _log_ واضغط Tab للإكمال التلقائي. وتجد إضافات مقتطفات _console.log()_ الأكثر اكتمالاً في [متجر الإضافات](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).

### مصفوفات JavaScript

من الآن فصاعداً، سنستخدم باستمرار معاملات البرمجة الوظيفية في [مصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) JavaScript، مثل _find_ و_filter_ و_map_.

إذا كانت معالجة المصفوفات بالمعاملات الوظيفية تبدو غريبة عليك، فمن الجدير مشاهدة الأجزاء الثلاثة الأولى على الأقل من سلسلة فيديوهات يوتيوب [البرمجة الوظيفية في JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):

- [الدوال عالية الرتبة](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [أساسيات reduce](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### إعادة النظر في معالجات الأحداث

استناداً إلى دورة العام الماضي، ثبت أن التعامل مع الأحداث صعب.

من الجدير قراءة فصل المراجعة في نهاية الجزء السابق - [إعادة النظر في معالجات الأحداث](/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited) - إذا شعرت أن معرفتك بالموضوع تحتاج إلى بعض الصقل.

أثار تمرير معالجات الأحداث إلى المكوّنات الفرعية للمكوّن <i>App</i> بعض الأسئلة. وتجد مراجعة موجزة للموضوع [هنا](/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components).

### عرض المجموعات

الآن، سنبني الواجهة الأمامية، أو واجهة المستخدم (الجزء الذي يراه المستخدمون في متصفحهم)، باستخدام React، على غرار التطبيق المثال من [الجزء 0](/part0).

لنبدأ بما يلي (الملف <i>App.jsx</i>):

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App
```

يبدو الملف <i>main.jsx</i> هكذا:

```js
import ReactDOM from 'react-dom/client'
import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
```

تحتوي كل ملاحظة على محتواها النصي، وقيمة _منطقية_ لتحديد ما إذا كانت الملاحظة قد صُنّفت مهمة أم لا، وكذلك <i>id</i> فريد.

يعمل المثال أعلاه لأن هناك ثلاث ملاحظات بالضبط في المصفوفة.

تُعرض الملاحظة الواحدة بالوصول إلى الكائنات في المصفوفة بالرجوع إلى رقم فهرس مكتوب مباشرة في الشيفرة:

```js
<li>{notes[1].content}</li>
```

هذا ليس عملياً بالطبع. يمكننا تحسين ذلك بتوليد عناصر React من كائنات المصفوفة باستخدام الدالة [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
notes.map(note => <li>{note.content}</li>)
```

النتيجة مصفوفة من عناصر <i>li</i>.

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

ويمكن بعد ذلك وضعها داخل وسوم <i>ul</i>:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

ولأن الشيفرة التي تولّد وسوم <i>li</i> هي JavaScript، فيجب لفّها بأقواس معقوصة في قالب JSX تماماً مثل كل شيفرة JavaScript الأخرى.

<!-- لنجعل قائمة الشيفرة أوضح أكثر بتقسيم تعريف الدالة السهمية على عدة أسطر: -->
سنجعل الشيفرة أيضاً أكثر وضوحاً بتقسيم تعريف الدالة السهمية على عدة أسطر:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### خاصية key

رغم أن التطبيق يبدو يعمل، يظهر تحذير مزعج في وحدة التحكم:

![خطأ خاصية key الفريدة في وحدة التحكم](../../images/2/1a.webp)

كما تشير [صفحة React](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) المرتبطة في رسالة الخطأ؛ يجب أن تكون لكل عناصر القائمة، أي العناصر التي تولّدها الدالة _map_، قيمة مفتاح فريدة: خاصية تسمى <i>key</i>.

لنضف المفاتيح:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}> // highlight-line
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

وتختفي رسالة الخطأ.

يستخدم React خصائص key للكائنات في المصفوفة لتحديد كيفية تحديث العرض الذي يولّده مكوّن عندما يُعاد عرض المكوّن. المزيد عن هذا في [توثيق React](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key).

### Map

فهم كيفية عمل دالة المصفوفة [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) أمر بالغ الأهمية لبقية الدورة.

يحتوي التطبيق على مصفوفة تسمى _notes_:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
```

لنتوقف لحظة ونفحص كيف تعمل _map_.

إذا أُضيفت الشيفرة التالية، مثلاً، إلى نهاية الملف:

```js
const result = notes.map(note => note.id)
console.log(result)
```

ستُطبع <i>[1, 2, 3]</i> في وحدة التحكم.
تُنشئ _map_ دائماً مصفوفة جديدة، وقد أُنشئت عناصرها من عناصر المصفوفة الأصلية عبر <i>الربط</i>: باستخدام الدالة المعطاة كوسيط إلى الدالة _map_.

والدالة هي

```js
note => note.id
```

وهي دالة سهمية مكتوبة بالصيغة المختصرة. أما الصيغة الكاملة فتكون:

```js
(note) => {
  return note.id
}
```

تستقبل الدالة كائن note كوسيط و<i>تعيد</i> قيمة حقل <i>id</i> فيه.

وإذا غيّرنا الأمر إلى:

```js
const result = notes.map(note => note.content)
```

فستحصل على مصفوفة تحتوي على محتويات الملاحظات.

هذا قريب جداً بالفعل من شيفرة React التي استخدمناها:

```js
notes.map(note =>
  <li key={note.id}>
    {note.content}
  </li>
)
```

وهي تولّد وسم <i>li</i> يحتوي على محتوى الملاحظة من كل كائن note.

ولأن معامل الدالة الممرَّر إلى الدالة _map_ -

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp;- يُستخدم لإنشاء عناصر العرض، فيجب عرض قيمة المتغير داخل أقواس معقوصة. جرّب أن ترى ماذا يحدث إذا أزلت الأقواس.

سيسبب استخدام الأقواس المعقوصة بعض المتاعب في البداية، لكنك ستعتاد عليها قريباً بما يكفي. فالتغذية البصرية الراجعة من React فورية.

### نمط مضاد: فهارس المصفوفة كمفاتيح

كان يمكننا إخفاء رسالة الخطأ في وحدة التحكم باستخدام فهارس المصفوفة كمفاتيح. ويمكن الحصول على الفهارس بتمرير معامل ثانٍ إلى الدالة الراجعة الخاصة بالدالة _map_:

```js
notes.map((note, i) => ...)
```

عند الاستدعاء بهذه الطريقة، تُسند إلى _i_ قيمة فهرس الموضع الذي توجد فيه الملاحظة في المصفوفة.

وبذلك، إحدى طرق تعريف توليد الصفوف دون الحصول على أخطاء هي:

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

ومع ذلك، هذا **غير موصى به** وقد يخلق مشكلات غير مرغوبة حتى لو بدا أنه يعمل بشكل جيد تماماً.

اقرأ المزيد عن هذا في [هذا المقال](https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/).

### إعادة هيكلة الوحدات

لنرتب الشيفرة قليلاً. نحن مهتمون فقط بحقل _notes_ في props، فلنستخرجه مباشرة باستخدام [التفكيك](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

إذا نسيت ما معنى التفكيك وكيف يعمل، فراجع [القسم الخاص بالتفكيك](/part1/component_state_event_handlers#destructuring).

سنفصل عرض الملاحظة الواحدة إلى مكوّن خاص بها هو <i>Note</i>:

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

لاحظ أن خاصية <i>key</i> يجب الآن تعريفها للمكوّنات <i>Note</i>، وليس لوسوم <i>li</i> كما كان الحال سابقاً.

يمكن كتابة تطبيق React كاملاً في ملف واحد. ومع أن ذلك ليس عملياً بالطبع. فالممارسة الشائعة هي تعريف كل مكوّن في ملفه الخاص كـ<i>وحدة ES6</i>.

كنا نستخدم الوحدات طوال الوقت. فالأسطر الأولى من الملف <i>main.jsx</i>:

```js
import ReactDOM from "react-dom/client"
import App from "./App"
```

يستورد [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) وحدتين، ما يمكّنهما من الاستخدام في ذلك الملف. تُوضع الوحدة <i>react-dom/client</i> في المتغير _ReactDOM_، وتُوضع الوحدة التي تعرّف المكوّن الرئيسي للتطبيق في المتغير _App_

لننقل مكوّن <i>Note</i> إلى وحدته الخاصة.

في التطبيقات الأصغر، تُوضع المكوّنات عادةً في مجلد يسمى <i>components</i> داخل مجلد <i>src</i>. والعُرف أن يُسمى الملف على اسم المكوّن. وقد تكون البنية الممكنة لمجلدات مشروع يحتوي عدة مكوّنات كما يلي:

```shell
src/
├── main.jsx
├── App.jsx
└── components/           # مجلد للمكوّنات القابلة لإعادة الاستخدام
    ├── Footer.jsx        # ملف مسمّى على اسم المكوّن
    ├── Note.jsx
    └── Notification.jsx
```

الآن، سننشئ مجلداً يسمى <i>components</i> لتطبيقنا ونضع بداخله ملفاً اسمه <i>Note.jsx</i>. ومحتويات الملف كما يلي:

```js
const Note = ({ note }) => {
  return <li>{note.content}</li>
}

export default Note
```

يُصدّر [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) السطرُ الأخير من الوحدة المكوّنَ المعرَّف، أي المتغير <i>Note</i>.

الآن يمكن للملف الذي يستخدم المكوّن - <i>App.jsx</i> - أن [يستورد](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) الوحدة:

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

أصبح المكوّن الذي تُصدّره الوحدة متاحاً الآن للاستخدام عبر المتغير <i>Note</i>، كما كان في السابق.

لاحظ أنه عند استيراد مكوّناتنا الخاصة، يجب إعطاء موقعها <i>بالنسبة إلى الملف المستورِد</i>:

```js
'./components/Note'
```

النقطة - <i>.</i> - في البداية تشير إلى المجلد الحالي، فموقع الوحدة هو ملف يسمى <i>Note.jsx</i> في المجلد الفرعي <i>components</i> داخل المجلد الحالي. ويمكن حذف امتداد اسم الملف _.jsx_.

للوحدات استخدامات أخرى كثيرة غير تمكين فصل تعريفات المكوّنات في ملفاتها الخاصة. وسنعود إليها لاحقاً في هذه الدورة.

يمكن العثور على الشيفرة الحالية للتطبيق على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1).

لاحظ أن الفرع <i>main</i> في المستودع يحتوي على شيفرة نسخة لاحقة من التطبيق. أما الشيفرة الحالية فهي في الفرع [part2-1](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1):

![لقطة شاشة لفرع GitHub](../../images/2/2e.webp)

إذا استنسخت المشروع، فنفّذ الأمر _npm install_ قبل تشغيل التطبيق بـ_npm run dev_.

### عندما يتعطل التطبيق

في بداية مسيرتك البرمجية (وحتى بعد 30 عاماً من البرمجة مثلي أنا)، ما يحدث غالباً هو أن التطبيق يتعطل تماماً فحسب. ويزداد الأمر سوءاً مع اللغات ذات الأنماط الديناميكية، مثل JavaScript، حيث لا يتحقق المترجم من نوع البيانات. مثل متغيرات الدوال أو القيم المعادة.

يمكن أن يبدو «انفجار React»، مثلاً، هكذا:

![مثال على خطأ في React](../../images/2/3-vite.webp)

في هذه المواقف، أفضل مخرج لك هو الأمر <em>console.log</em>.

جزء الشيفرة المسبب للانفجار هو هذا:

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```

سنقترب من سبب التعطل بإضافة أوامر <em>console.log</em> إلى الشيفرة. ولأن أول ما يُعرض هو المكوّن <i>App</i>، فمن الجدير وضع أول <em>console.log</em> هناك:

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

لرؤية الطباعة في وحدة التحكم، علينا التمرير للأعلى فوق جدار الأخطاء الأحمر الطويل.

![الطباعة الأولى في وحدة التحكم](../../images/2/4b.webp)

عندما يتبين أن شيئاً ما يعمل، يحين وقت التسجيل أعمق. وإذا كان المكوّن معرَّفاً كعبارة واحدة أو دالة بلا return، فإن ذلك يجعل الطباعة في وحدة التحكم أصعب.

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

يجب تغيير المكوّن إلى صيغته الأطول لنتمكن من إضافة الطباعة:

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

غالباً ما يكون جذر المشكلة أن props متوقعة أن تكون من نوع مختلف، أو تُستدعى باسم مختلف عن اسمها الفعلي، فيفشل التفكيك نتيجة لذلك. وكثيراً ما تبدأ المشكلة بحل نفسها عند إزالة التفكيك ورؤية ما تحتويه <em>props</em>.

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

إذا لم تُحل المشكلة بعد، فللأسف لا يوجد الكثير لفعله سوى مواصلة البحث عن الأخطاء بنثر المزيد من عبارات _console.log_ في أنحاء شيفرتك.

أضفت هذا الفصل إلى المادة بعد أن انفجرت الإجابة النموذجية للسؤال التالي تماماً (بسبب كون props من نوع خاطئ)، واضطررت إلى تصحيح أخطائها باستخدام <em>console.log</em>.

### قسم مطوّر الويب

قبل التمارين، دعني أذكّرك بما وعدت به في نهاية الجزء السابق.

البرمجة صعبة، ولهذا سأستخدم كل الوسائل الممكنة لتسهيلها

- سأبقي وحدة تحكم مطوّر المتصفح مفتوحة طوال الوقت
- سأتقدم بخطوات صغيرة
- سأكتب الكثير من عبارات _console.log_ للتأكد من فهمي لكيفية تصرف الشيفرة وللمساعدة في تحديد المشكلات
- إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل سأبدأ بحذف الشيفرة حتى تعمل أو أعود إلى حالة كان فيها كل شيء يعمل
- عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في مكان آخر، سأصوغ أسئلتي بشكل صحيح، انظر [هنا](/part0/general_info#how-to-get-help-in-discord) لكيفية طلب المساعدة

</div>

<div class="tasks">

<h3>تمارين 2.1.-2.5.</h3>

تُسلَّم التمارين عبر GitHub، وبتعليم التمارين كمنجزة في [نظام التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

يمكنك تسليم كل التمارين في المستودع نفسه، أو استخدام عدة مستودعات مختلفة. وإذا سلّمت تمارين من أجزاء مختلفة في المستودع نفسه، فسمِّ مجلداتك تسمية جيدة.

تُسلَّم التمارين **جزءاً واحداً في كل مرة**. وعند تسليم تمارين جزء ما، لن تتمكن بعد ذلك من تسليم أي تمارين فائتة لذلك الجزء.

لاحظ أن هذا الجزء يحتوي تمارين أكثر من الأجزاء السابقة، لذا <i>لا تسلّم</i> حتى تنجز كل التمارين من هذا الجزء التي تريد تسليمها.

<h4>2.1: معلومات الدورة الخطوة 6</h4>

لنُكمل شيفرة عرض محتويات الدورة من التمارين 1.1 - 1.5. يمكنك البدء من شيفرة الإجابات النموذجية. ويمكن العثور على الإجابات النموذجية للجزء 1 بالذهاب إلى [نظام التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)، والنقر على <i>my submissions</i> في الأعلى، وفي الصف المقابل للجزء 1 تحت عمود <i>solutions</i> النقر على <i>show</i>. لرؤية حل تمرين <i>course info</i>، انقر على _App.jsx_ تحت <i>courseinfo</i>.

**لاحظ أنه إذا نسخت مشروعاً من مكان إلى آخر، فقد تحتاج إلى حذف مجلد <i>node\_modules</i> وتثبيت الاعتماديات مرة أخرى بالأمر _npm install_ قبل أن تتمكن من تشغيل التطبيق.**

بشكل عام، لا يُوصى بنسخ محتويات مشروع كاملة و/أو إضافة مجلد <i>node\_modules</i> إلى نظام التحكم بالإصدارات.

لنغيّر المكوّن <i>App</i> كما يلي:

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
```

عرّف مكوّناً مسؤولاً عن تنسيق دورة واحدة يسمى <i>Course</i>.

يمكن أن تكون بنية مكوّنات التطبيق، مثلاً، كما يلي:

```
App
  Course
    Header
    Content
      Part
      Part
      ...
```

وبذلك يحتوي المكوّن <i>Course</i> على المكوّنات المعرَّفة في الجزء السابق، وهي مسؤولة عن عرض اسم الدورة وأجزائها.

يمكن أن تبدو الصفحة المعروضة، مثلاً، كما يلي:

![لقطة شاشة لتطبيق Half Stack](../../images/teht/8e.webp)

لا تحتاج إلى مجموع التمارين بعد.

يجب أن يعمل التطبيق <i>بغض النظر عن عدد أجزاء الدورة</i>، لذا تأكد من أن التطبيق يعمل إذا أضفت أو حذفت أجزاء من دورة.

تأكد من أن وحدة التحكم لا تُظهر أي أخطاء!

<h4>2.2: معلومات الدورة الخطوة 7</h4>

اعرض أيضاً مجموع تمارين الدورة.

![ميزة إضافة مجموع التمارين](../../images/teht/9e.webp)

<h4>2.3*: معلومات الدورة الخطوة 8</h4>

إذا لم تكن قد فعلت ذلك بعد، فاحسب مجموع التمارين بدالة المصفوفة [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

**نصيحة احترافية:** عندما تبدو شيفرتك كما يلي:

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```
  
ولا تعمل، فمن الجدير استخدام <i>console.log</i>، وهو ما يتطلب كتابة الدالة السهمية بصيغتها الأطول:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```

**لا تعمل؟ :** استخدم محرك البحث للبحث عن كيفية استخدام _reduce_ مع **مصفوفة كائنات**.

<h4>2.4: معلومات الدورة الخطوة 9</h4>

لنوسّع تطبيقنا ليسمح بـ<i>عدد اعتباطي</i> من الدورات:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

يمكن أن يبدو التطبيق، مثلاً، هكذا:

![إضافة ميزة العدد الاعتباطي من الدورات](../../images/teht/10e.webp)

<h4>2.5: وحدة منفصلة الخطوة 10</h4>

عرّف المكوّن <i>Course</i> كوحدة منفصلة يستوردها المكوّن <i>App</i>. ويمكنك تضمين كل المكوّنات الفرعية للدورة في الوحدة نفسها.

</div>
