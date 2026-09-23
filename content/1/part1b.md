---
mainImage: /images/part-1.svg
part: 1
letter: b
lang: ar
---

<div class="content">

خلال الدورة، لدينا هدف وحاجة إلى تعلّم قدر كافٍ من JavaScript إلى جانب تطوير الويب.

تطوّرت JavaScript بسرعة في السنوات القليلة الماضية، ونستخدم في هذه الدورة ميزات من الإصدارات الأحدث. الاسم الرسمي لمعيار JavaScript هو [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). في هذه اللحظة، أحدث إصدار هو الصادر في يونيو 2025 باسم [ECMAScript®2025](https://www.ecma-international.org/ecma-262/)، المعروف أيضًا باسم ES16.

لا تدعم المتصفحات بعد جميع أحدث ميزات JavaScript. ولهذه الحقيقة، كثير من الشيفرة التي تعمل في المتصفحات قد <i>حُوِّلت</i> من إصدار أحدث من JavaScript إلى إصدار أقدم وأكثر توافقًا.

اليوم، الطريقة الأكثر شيوعًا لإجراء هذا التحويل هي استخدام [Babel](https://babeljs.io/). يُضبط التحويل تلقائيًا في تطبيقات React المُنشأة باستخدام Vite. سنلقي نظرة أقرب على إعدادات التحويل في [الجزء 7](/part7) من هذه الدورة.

[Node.js](https://nodejs.org/en/) هي بيئة تشغيل لـ JavaScript مبنية على محرّك [Chrome V8](https://developers.google.com/v8/) من Google وتعمل عمليًا في أي مكان - من الخوادم إلى الهواتف المحمولة. لنتدرّب على كتابة بعض JavaScript باستخدام Node. الإصدارات الأحدث من Node تفهم بالفعل أحدث إصدارات JavaScript، لذا لا تحتاج الشيفرة إلى تحويل.

تُكتب الشيفرة في ملفات تنتهي بـ <i>.js</i> وتُشغَّل بإصدار الأمر <em>node name\_of\_file.js</em>

من الممكن أيضًا كتابة شيفرة JavaScript في وحدة تحكم Node.js، التي تُفتح بكتابة _node_ في سطر الأوامر، وكذلك في وحدة تحكم أدوات المطوّر في المتصفح. [تتعامل أحدث إصدارات Chrome مع ميزات JavaScript الجديدة بشكل جيد](https://compat-table.github.io/compat-table/es2016plus/) دون تحويل الشيفرة. بدلًا من ذلك، يمكنك استخدام أداة مثل [JS Bin](https://jsbin.com/?js,console).

تشبه JavaScript Java إلى حد ما، في الاسم والصياغة معًا. لكن عندما يتعلق الأمر بالآلية الجوهرية للغة، فهما لا يمكن أن تكونا أكثر اختلافًا. وإذا كنت قادمًا من خلفية في Java، فقد يبدو سلوك JavaScript غريبًا بعض الشيء، خاصة إذا لم تبذل جهدًا للبحث في ميزاتها.

في بعض الأوساط، كان من الشائع أيضًا محاولة "محاكاة" ميزات Java وأنماط التصميم الخاصة بها في JavaScript. لا نوصي بذلك لأن اللغتين ومنظومتيهما البيئيتين مختلفتان اختلافًا جذريًا في نهاية المطاف.

### المتغيرات

في JavaScript هناك بضع طرق لتعريف المتغيرات:

```js
const x = 1
let y = 5

console.log(x, y)   // تُطبع 1 5
y += 10
console.log(x, y)   // تُطبع 1 15
y = 'sometext'
console.log(x, y)   // تُطبع 1 sometext
x = 4               // يسبّب خطأً
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) لا تعرّف متغيرًا بل <i>ثابتًا</i> لا يمكن تغيير قيمته بعد ذلك. في المقابل، [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) تعرّف متغيرًا عاديًا.

في المثال أعلاه، نرى أيضًا أن نوع بيانات المتغير يمكن أن يتغير أثناء التنفيذ. في البداية، تخزّن _y_ عددًا صحيحًا؛ وفي النهاية، تخزّن نصًا.

من الممكن أيضًا تعريف المتغيرات في JavaScript باستخدام الكلمة المفتاحية [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). لفترة طويلة، كانت var الطريقة الوحيدة لتعريف المتغيرات. وقد أُضيفت الكلمتان المفتاحيتان const و let في عام 2015 مع إصدار ES6. في حالات معينة، تعمل var بطريقة مختلفة مقارنة بتعريفات المتغيرات في معظم اللغات - راجع [متغيرات JavaScript - هل ينبغي أن تستخدم let أم var أم const؟ على Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) أو [الكلمة المفتاحية: var مقابل let على JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) لمزيد من المعلومات. خلال هذه الدورة، لا يُنصح باستخدام var وعليك الالتزام باستخدام const و let!
يمكنك العثور على المزيد حول هذا الموضوع على YouTube - مثل [var و let و const - ميزات ES6 في JavaScript](https://youtu.be/sjyJBL5fkp8)

### المصفوفات

[المصفوفة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) وبعض الأمثلة على استخدامها:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // تُطبع 4
console.log(t[1])     // تُطبع -1

t.forEach(value => {
  console.log(value)  // تُطبع الأعداد 1، -1، 3، 5، كل واحد في سطر منفصل
})                    
```

الملاحظ في هذا المثال أنه على الرغم من أن المتغير المُعرَّف بـ const لا يمكن إعادة إسناده إلى قيمة أخرى، فإن محتويات الكائن الذي يشير إليه يمكن تعديلها. والسبب أن تعريف const يضمن ثبات المرجع نفسه، لا البيانات التي يشير إليها. تخيّل الأمر كتغيير الأثاث داخل منزل، بينما يبقى عنوان المنزل كما هو.

إحدى طرق المرور على عناصر المصفوفة هي استخدام _forEach_ كما في المثال. تستقبل _forEach_ <i>دالة</i> معرّفة بصياغة السهم كوسيط.

```js
value => {
  console.log(value)
}
```

تستدعي forEach الدالة <i>لكل عنصر من عناصر المصفوفة</i>، وتمرّر دائمًا العنصر المفرد كوسيط. ويمكن للدالة بوصفها وسيطًا لـ forEach أن تستقبل أيضًا [وسائط أخرى](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

في المثال السابق، أُضيف عنصر جديد إلى المصفوفة باستخدام الدالة [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). عند استخدام React، كثيرًا ما تُستخدم تقنيات من البرمجة الوظيفية. ومن خصائص نمط البرمجة الوظيفية استخدام بنى بيانات [غير قابلة للتغيير](https://en.wikipedia.org/wiki/Immutable_object). في شيفرة React، يُفضَّل استخدام الدالة [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)، التي تنشئ مصفوفة جديدة مع العنصر المُضاف. وهذا يضمن بقاء المصفوفة الأصلية دون تغيير.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)  // ينشئ مصفوفة جديدة

console.log(t)  // تُطبع [1, -1, 3]
console.log(t2) // تُطبع [1, -1, 3, 5]
```

استدعاء الدالة _t.concat(5)_ لا يضيف عنصرًا جديدًا إلى المصفوفة القديمة، بل يعيد مصفوفة جديدة تحتوي، إلى جانب عناصر المصفوفة القديمة، على العنصر الجديد أيضًا.

هناك الكثير من الدوال المفيدة المعرّفة للمصفوفات. لنلقِ نظرة على مثال قصير لاستخدام الدالة [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // تُطبع [2, 4, 6]
```

بناءً على المصفوفة القديمة، تنشئ map <i>مصفوفة جديدة</i> تُستخدم الدالة المعطاة كوسيط لإنشاء عناصرها. في حالة هذا المثال، تُضرب القيمة الأصلية في اثنين.

يمكن لـ map أيضًا تحويل المصفوفة إلى شيء مختلف تمامًا:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// تُطبع [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

هنا تُحوَّل مصفوفة مليئة بقيم صحيحة إلى مصفوفة تحتوي نصوص HTML باستخدام الدالة map. في [الجزء 2](/part2) من هذه الدورة، سنرى أن map تُستخدم كثيرًا في React.

يمكن إسناد العناصر المفردة في المصفوفة إلى متغيرات بسهولة بمساعدة [إسناد التفكيك](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // تُطبع 1 2
console.log(rest)          // تُطبع [3, 4, 5]
```

في الأعلى، يُسند إلى المتغير _first_ أول عدد صحيح في المصفوفة، ويُسند إلى المتغير _second_ ثاني عدد صحيح في المصفوفة. أما المتغير _rest_ في "يجمع" الأعداد الصحيحة المتبقية في مصفوفة خاصة به.

### الكائنات

هناك بضع طرق مختلفة لتعريف الكائنات في JavaScript. ومن الطرق الشائعة جدًا استخدام [الكائنات الحرفية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals) (object literals)، وذلك بسرد خصائصها داخل أقواس معقوصة:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```

يمكن أن تكون قيم الخصائص من أي نوع، مثل الأعداد الصحيحة والنصوص والمصفوفات والكائنات...

يُشار إلى خصائص الكائن باستخدام صيغة "النقطة"، أو باستخدام الأقواس:

```js
console.log(object1.name)         // تُطبع Arto Hellas
const fieldName = 'age'
console.log(object1[fieldName])    // تُطبع 35
```

يمكنك أيضًا إضافة خصائص إلى كائن أثناء العمل باستخدام صيغة النقطة أو الأقواس:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

الإضافة الأخيرة يجب أن تتم باستخدام الأقواس، لأنه عند استخدام صيغة النقطة، فإن <i>secret number</i> ليس اسم خاصية صالحًا بسبب المسافة.

بطبيعة الحال، يمكن أن تحتوي الكائنات في JavaScript على دوال أيضًا. ومع ذلك، خلال هذه الدورة، لا نحتاج إلى تعريف أي كائنات لها دوال خاصة بها. ولهذا تُناقش فقط بإيجاز خلال الدورة.

يمكن أيضًا تعريف الكائنات باستخدام ما يُسمى دوال المُنشئ، وهو ما ينتج آلية تشبه آليات لغات برمجة أخرى كثيرة، مثل أصناف Java. ورغم هذا التشابه، لا تحتوي JavaScript على أصناف بالمعنى نفسه الموجود في لغات البرمجة كائنية التوجه. غير أنه أُضيفت <i>صياغة الأصناف</i> بدءًا من الإصدار ES6، وهي تساعد في بعض الحالات على تنظيم الأصناف كائنية التوجه.

### الدوال

أصبحنا بالفعل على دراية بتعريف دوال السهم. والعملية الكاملة، دون اختصار، لتعريف دالة سهم هي كما يلي:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

وتُستدعى الدالة كما هو متوقع:

```js
const result = sum(1, 5)
console.log(result)
```

إذا كان هناك وسيط واحد فقط، يمكننا حذف الأقواس من التعريف:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

إذا كانت الدالة تحتوي على تعبير واحد فقط فلا حاجة إلى الأقواس المعقوصة. في هذه الحالة، تعيد الدالة فقط نتيجة تعبيرها الوحيد. الآن، إذا أزلنا الطباعة في وحدة التحكم، يمكننا تقصير تعريف الدالة أكثر:

```js
const square = p => p * p
```

هذه الصيغة عملية بشكل خاص عند التعامل مع المصفوفات - مثل استخدام الدالة map:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared أصبحت الآن [1, 4, 9]
```

أُضيفت ميزة دوال السهم إلى JavaScript في عام 2015، مع الإصدار [ES6](https://rse.github.io/es6-features/). قبل ذلك، كانت الطريقة الوحيدة لتعريف الدوال هي استخدام الكلمة المفتاحية _function_.

هناك طريقتان للإشارة إلى الدالة؛ إحداهما إعطاء اسم في [إعلان دالة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function).

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result أصبحت الآن 12
```

الطريقة الأخرى لتعريف الدالة هي استخدام [تعبير دالة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). في هذه الحالة، لا حاجة لإعطاء الدالة اسمًا، ويمكن أن يوجد التعريف بين بقية الشيفرة:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result أصبحت الآن 3.5
```

خلال هذه الدورة، سنعرّف جميع الدوال باستخدام صياغة السهم.

</div>

<div class="tasks">

  <h3>تمارين 1.3.-1.5.</h3>

<i>نواصل بناء التطبيق الذي بدأنا العمل عليه في التمارين السابقة. يمكنك كتابة الشيفرة في المشروع نفسه لأننا مهتمون فقط بالحالة النهائية للتطبيق المُسلَّم.</i>

**نصيحة احترافية:** قد تصادف مشكلات تتعلق ببنية الـ <i>props</i> التي تستقبلها المكوّنات. ومن الطرق الجيدة لتوضيح الأمور طباعة الـ props في وحدة التحكم، كما يلي مثلًا:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

وإذا واجهت رسالة خطأ، و<i>سوف</i> تواجهها

> <i>Objects are not valid as a React child</i>

فتذكّر ما قيل [هنا](/part1/introduction_to_react#do-not-render-objects).

  <h4>1.3: معلومات الدورة، الخطوة 3</h4>

لنمضِ قدمًا إلى استخدام الكائنات في تطبيقنا. عدّل تعريفات المتغيرات في مكوّن <i>App</i> كما يلي، وأعد هيكلة التطبيق أيضًا بحيث يظل يعمل:

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: معلومات الدورة، الخطوة 4</h4>

ضع الكائنات في مصفوفة. عدّل تعريفات المتغيرات في <i>App</i> إلى الصيغة التالية وعدّل بقية أجزاء التطبيق وفقًا لذلك:

```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**ملاحظة** في هذه المرحلة <i>يمكنك افتراض وجود ثلاثة عناصر دائمًا</i>، لذا لا حاجة للمرور على المصفوفات باستخدام الحلقات. سنعود إلى موضوع عرض المكوّنات بناءً على عناصر المصفوفات باستكشاف أكثر شمولًا في [الجزء التالي من الدورة](/part2).

ومع ذلك، لا تمرّر كائنات مختلفة كـ props منفصلة من مكوّن <i>App</i> إلى المكوّنين <i>Content</i> و<i>Total</i>. بل مرّرها مباشرة كمصفوفة:

```js
const App = () => {
  // تعريفات const

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: معلومات الدورة، الخطوة 5</h4>

لنمضِ بالتغييرات خطوة أخرى. حوّل الدورة وأجزاءها إلى كائن JavaScript واحد. وأصلح كل ما يتعطل.

```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### دوال الكائنات و "this"

لأن هذه الدورة تستخدم إصدارًا من React يحتوي على خطافات React، لا نحتاج إلى تعريف كائنات لها دوال. **محتويات هذا الفصل ليست ذات صلة بالدورة** لكنها بالتأكيد مفيدة معرفتها من نواحٍ كثيرة. وعلى وجه الخصوص، عند استخدام إصدارات أقدم من React يجب فهم موضوعات هذا الفصل.

تختلف دوال السهم والدوال المعرّفة بالكلمة المفتاحية _function_ اختلافًا جوهريًا في سلوكها فيما يتعلق بالكلمة المفتاحية [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)، التي تشير إلى الكائن نفسه.

يمكننا إسناد دوال إلى كائن بتعريف خصائص هي دوال:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

arto.greet()  // تُطبع "hello, my name is Arto Hellas"
```

يمكن إسناد الدوال إلى الكائنات حتى بعد إنشاء الكائن:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // تُطبع 35
arto.growOlder()
console.log(arto.age)   // تُطبع 36
```

لنعدّل الكائن قليلًا:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4)        // تُطبع 5

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // تُطبع 25
```

الآن أصبح للكائن الدالة _doAddition_ التي تحسب مجموع الأعداد المعطاة له كوسائط. وتُستدعى الدالة بالطريقة المعتادة، باستخدام الكائن <em>arto.doAddition(1, 4)</em> أو بتخزين <i>مرجع للدالة</i> في متغير واستدعاء الدالة عبر المتغير: <em>referenceToAddition(10, 15)</em>.

إذا حاولنا فعل الشيء نفسه مع الدالة _greet_ فإننا نصطدم بمشكلة:

```js
arto.greet()       // تُطبع "hello, my name is Arto Hellas"

const referenceToGreet = arto.greet
referenceToGreet() // تُطبع "hello, my name is undefined"
```

عند استدعاء الدالة عبر مرجع، تفقد الدالة معرفتها بما كان عليه _this_ الأصلي. وخلافًا للغات أخرى، تُعرَّف قيمة [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) في JavaScript بناءً على <i>كيفية استدعاء الدالة</i>. وعند استدعاء الدالة عبر مرجع، تصبح قيمة _this_ ما يُسمى [الكائن العام](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)، وغالبًا ما تكون النتيجة النهائية غير ما قصده مطوّر البرمجيات أصلًا.

فقدان تتبّع _this_ عند كتابة شيفرة JavaScript يطرح بضع مشكلات محتملة. كثيرًا ما تنشأ حالات يحتاج فيها React أو Node (أو بشكل أدق محرّك JavaScript في متصفح الويب) إلى استدعاء دالة ما في كائن عرّفه المطوّر. ومع ذلك، في هذه الدورة نتجنب هذه المشكلات باستخدام JavaScript "بلا this".

من الحالات المؤدية إلى "اختفاء" _this_ أننا نضبط مؤقتًا لاستدعاء الدالة _greet_ على الكائن _arto_، باستخدام الدالة [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

كما ذُكر، تُعرَّف قيمة _this_ في JavaScript بناءً على كيفية استدعاء الدالة. وعندما تستدعي <em>setTimeout</em> الدالة، فإن محرّك JavaScript هو من يستدعي الدالة فعليًا، وعند تلك اللحظة تشير _this_ إلى الكائن العام.

هناك آليات عدة يمكن بها الحفاظ على _this_ الأصلي. إحداها استخدام دالة تُسمى [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

استدعاء <em>arto.greet.bind(arto)</em> ينشئ دالة جديدة ترتبط فيها _this_ بالإشارة إلى Arto، بغض النظر عن مكان وكيفية استدعاء الدالة.

باستخدام [دوال السهم](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) يمكن حل بعض المشكلات المتعلقة بـ _this_. غير أنه لا ينبغي استخدامها دوالًا للكائنات لأن _this_ عندئذ لا تعمل إطلاقًا. سنعود لاحقًا إلى سلوك _this_ فيما يتعلق بدوال السهم.

إذا أردت فهمًا أفضل لكيفية عمل _this_ في JavaScript، فالإنترنت مليء بالمواد حول الموضوع، مثل سلسلة المقاطع المصوّرة [فهم الكلمة المفتاحية this في JavaScript بعمق](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) من [egghead.io](https://egghead.io) التي نوصي بها بشدة!

### الأصناف

كما ذُكر سابقًا، لا توجد آلية أصناف في JavaScript مثل الموجودة في لغات البرمجة كائنية التوجه. غير أن هناك ميزات تجعل "محاكاة" [الأصناف](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) كائنية التوجه ممكنة.

لنلقِ نظرة سريعة على <i>صياغة الأصناف</i> التي أُدخلت إلى JavaScript مع ES6، والتي تبسّط كثيرًا تعريف الأصناف (أو الأشياء الشبيهة بالأصناف) في JavaScript.

في المثال التالي نعرّف "صنفًا" يُسمى Person وكائنين من نوع Person:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 33)
adam.greet()

const janja = new Person('Janja Garnbret', 27)
janja.greet()
```

فيما يتعلق بالصياغة، تشبه أصناف JavaScript والنسخ المُنشأة منها كثيرًا طريقة عمل الأصناف والكائنات في Java. وسلوكها أيضًا شبيه جدًا بكائنات Java. لكنها في جوهرها تبقى كائنات JavaScript عادية مبنية على [الوراثة النموذجية](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). ويظل نوع أي نسخة من هذه الأصناف هو _Object_، لأن JavaScript تعرّف جوهريًا مجموعة محدودة فقط من الأنواع: [Boolean و Null و Undefined و Number و String و Symbol و BigInt و Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

كان إدخال صياغة الأصناف إضافة مثيرة للجدل. اطّلع على [غير رائع: أصناف ES6](https://github.com/petsel/not-awesome-es6-classes) أو [هل "Class" في ES6 هي "الجزء السيئ" الجديد؟ على Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) لمزيد من التفاصيل.

تُستخدم صياغة أصناف ES6 كثيرًا في React "القديم" وكذلك في Node.js، لذا فإن فهمها مفيد حتى في هذه الدورة. ومع ذلك، بما أننا نستخدم ميزة [الخطافات](https://react.dev/reference/react/hooks) الجديدة في React طوال هذه الدورة، فليس لدينا استخدام ملموس لصياغة الأصناف في JavaScript.

### مواد JavaScript

توجد على الإنترنت أدلة جيدة وأدلة سيئة لـ JavaScript. ومعظم الروابط في هذه الصفحة المتعلقة بميزات JavaScript تشير إلى [دليل JavaScript من Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

نوصي بشدة بقراءة [نظرة عامة على لغة JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview) على موقع Mozilla فورًا.

إذا أردت التعرّف على JavaScript بعمق، فهناك سلسلة كتب مجانية رائعة على الإنترنت تُسمى [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

ومن الموارد الرائعة الأخرى لتعلّم JavaScript موقع [javascript.info](https://javascript.info).
  
الكتاب المجاني والجذاب جدًا [Eloquent JavaScript](https://eloquentjavascript.net) ينقلك من الأساسيات إلى أمور مثيرة بسرعة. وهو مزيج من مشاريع نظرية وتمارين، ويغطي نظرية البرمجة العامة وكذلك لغة JavaScript.

[Namaste 🙏 JavaScript](https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP) هو درس تعليمي مجاني آخر رائع ومُوصى به بشدة لتعلّم JavaScript من أجل فهم كيفية عمل JS تحت الغطاء. Namaste JavaScript دورة JavaScript معمّقة خالصة نُشرت مجانًا على YouTube. وستغطي المفاهيم الجوهرية لـ JavaScript بالتفصيل وكل ما يتعلق بكيفية عمل JS خلف الكواليس داخل محرّك JavaScript.

لدى [egghead.io](https://egghead.io) الكثير من المقاطع المصوّرة عالية الجودة عن JavaScript وReact وموضوعات أخرى مثيرة للاهتمام. وللأسف، بعض المواد خلف جدار دفع.

</div>
