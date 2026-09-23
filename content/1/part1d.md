---
mainImage: /images/part-1.svg
part: 1
letter: d
lang: ar
---

<div class="content">

### الحالة المعقّدة

في مثالنا السابق، كانت حالة التطبيق بسيطة لأنها تألفت من عدد صحيح واحد. فماذا لو احتاج تطبيقنا إلى حالة أكثر تعقيداً؟

في معظم الحالات، أسهل وأفضل طريقة لتحقيق ذلك هي استخدام الدالة _useState_ عدة مرات لإنشاء «أجزاء» منفصلة من الحالة.

في الشيفرة التالية ننشئ جزأين من الحالة للتطبيق باسم _left_ و_right_، وكلاهما يأخذ القيمة الأولية 0:

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

يصل المكوّن إلى الدالتين _setLeft_ و_setRight_ اللتين يمكنه استخدامهما لتحديث جزأي الحالة.

يمكن أن تكون حالة المكوّن أو أي جزء منها من أي نوع. ويمكننا تنفيذ الوظيفة نفسها بحفظ عدد نقرات الزرين <i>left</i> و<i>right</i> في كائن واحد:

```js
{
  left: 0,
  right: 0
}
```

في هذه الحالة، سيبدو التطبيق هكذا:

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

الآن أصبح للمكوّن جزء واحد فقط من الحالة، وعلى معالجات الأحداث أن تتولى تغيير <i>حالة التطبيق بأكملها</i>.

يبدو معالج الحدث فوضوياً بعض الشيء. فعند النقر على الزر الأيسر تُستدعى الدالة التالية:

```js
const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

ويُعيَّن الكائن التالي كحالة جديدة للتطبيق:

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

أصبحت القيمة الجديدة للخاصية <i>left</i> مساوية الآن لقيمة <i>left + 1</i> من الحالة السابقة، وقيمة الخاصية <i>right</i> مساوية لقيمة الخاصية <i>right</i> من الحالة السابقة.

يمكننا تعريف كائن الحالة الجديد بشكل أنظف قليلاً باستخدام صيغة [نشر الكائن](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (object spread) التي أُضيفت إلى مواصفات اللغة في صيف 2018:

```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

قد تبدو الصيغة غريبة بعض الشيء في البداية. عملياً، تُنشئ <em>{ ...clicks }</em> كائناً جديداً يحتوي على نسخ من جميع خصائص كائن _clicks_. وعندما نحدد خاصية معينة — مثل <i>right</i> في <em>{ ...clicks, right: 1 }</em> — تصبح قيمة الخاصية _right_ في الكائن الجديد 1.

في المثال أعلاه، هذا:

```js
{ ...clicks, right: clicks.right + 1 }
```

ينشئ نسخة من كائن _clicks_ تكون فيها قيمة الخاصية _right_ مزيدَة بواحد.

ليس من الضروري إسناد الكائن إلى متغير في معالجات الأحداث، ويمكننا تبسيط الدالتين إلى الشكل التالي:

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

قد يتساءل بعض القراء لماذا لم نحدّث الحالة مباشرة هكذا:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

يبدو أن التطبيق يعمل. لكن <i>يُحرَّم في React تغيير الحالة مباشرة</i>، لأن [ذلك قد يؤدي إلى آثار جانبية غير متوقعة](https://stackoverflow.com/a/40309023). ويجب أن يتم تغيير الحالة دائماً بتعيينها إلى كائن جديد. وإذا لم تتغير خصائص كائن الحالة السابق، فيلزم ببساطة نسخها، ويتم ذلك بنسخ تلك الخصائص إلى كائن جديد وتعيينه كحالة جديدة.

تخزين كل الحالة في كائن حالة واحد خيار سيئ لهذا التطبيق تحديداً؛ فلا فائدة ظاهرة منه، والتطبيق الناتج أكثر تعقيداً بكثير. وفي هذه الحالة، يكون تخزين عدّادي النقر في جزأين منفصلين من الحالة خياراً أنسب بكثير.

وهناك حالات قد يكون فيها تخزين جزء من حالة التطبيق في بنية بيانات أكثر تعقيداً مفيداً. ويحتوي [توثيق React الرسمي](https://react.dev/learn/choosing-the-state-structure) على إرشادات مفيدة حول الموضوع.

### التعامل مع المصفوفات

لنضف إلى تطبيقنا جزءاً من الحالة يحتوي على مصفوفة _allClicks_ تتذكر كل نقرة حدثت في التطبيق.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end  

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end  

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

تُخزَّن كل نقرة في جزء منفصل من الحالة يسمى _allClicks_ يُهيَّأ كمصفوفة فارغة:

```js
const [allClicks, setAll] = useState([])
```

عند النقر على الزر <i>left</i>، نضيف الحرف <i>L</i> إلى مصفوفة _allClicks_:

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

يُعيَّن جزء الحالة المخزَّن في _allClicks_ الآن مصفوفة تحتوي على جميع عناصر مصفوفة الحالة السابقة إضافة إلى الحرف <i>L</i>. وتتم إضافة العنصر الجديد إلى المصفوفة بالدالة [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)، التي لا تغيّر المصفوفة القائمة بل تُعيد <i>نسخة جديدة منها</i> مع العنصر المضاف إليها.

وكما ذُكر سابقاً، يمكن أيضاً في JavaScript إضافة عناصر إلى مصفوفة بالدالة [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). ولو أضفنا العنصر بدفعه إلى مصفوفة _allClicks_ ثم حدّثنا الحالة، لبدا التطبيق وكأنه ما زال يعمل:

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

لكن __لا__ تفعل ذلك. فكما ذُكر سابقاً، يجب عدم تغيير حالة مكوّنات React مثل _allClicks_ مباشرة. وحتى لو بدا تغيير الحالة يعمل في بعض الحالات، فقد يؤدي إلى مشكلات يصعب جداً تصحيحها.

لنلقِ نظرة أقرب على كيفية عرض النقرات في الصفحة:

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

نستدعي الدالة [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) على مصفوفة _allClicks_، وهي تدمج جميع العناصر في نص واحد يفصل بينها النص المُمرَّر كمعامل للدالة، وهو في حالتنا مسافة فارغة.

### تحديث الحالة غير متزامن

لنوسّع التطبيق بحيث يتتبع العدد الإجمالي لضغطات الأزرار في الحالة _total_، التي تُحدَّث قيمتها دائماً عند ضغط الأزرار:

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0) // highlight-line

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
    setTotal(left + right)  // highlight-line
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
    setTotal(left + right)  // highlight-line
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>  // highlight-line
    </div>
  )
}
```

لا يعمل الحل تماماً:

![متصفح يعرض left 2 وright 1، وRLL total 2](../../images/1/33.webp)

العدد الإجمالي لضغطات الأزرار أقل دائماً بواحد من العدد الفعلي للضغطات، لسبب ما.

لنضف بضعة عبارات console.log إلى معالج الحدث:

```js
const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)  // highlight-line
    setLeft(left + 1)
    console.log('left after', left)  // highlight-line
    setTotal(left + right) 
  }

  // ...
}
```

تكشف وحدة التحكم المشكلة

![وحدة تحكم أدوات المطوّر تعرض left before 4 وleft after 4](../../images/1/32.webp)

رغم تعيين قيمة جديدة لـ _left_ باستدعاء _setLeft(left + 1)_، تبقى القيمة القديمة كما هي رغم التحديث. ونتيجة لذلك، تُنتج محاولة عدّ ضغطات الأزرار نتيجة أصغر من اللازم:

```js
setTotal(left + right) 
```

والسبب في ذلك أن تحديث الحالة في React يحدث [بشكل غير متزامن](https://react.dev/learn/queueing-a-series-of-state-updates)، أي ليس فوراً بل «في مرحلة ما» بعد انتهاء دالة المكوّن الحالية وقبل إعادة عرض المكوّن.

يمكننا إصلاح التطبيق كما يلي:

```js
const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  // ...
}
```

فأصبح عدد ضغطات الأزرار الآن مبنياً بالتأكيد على العدد الصحيح لضغطات الزر الأيسر.

يمكننا أيضاً التعامل مع التحديثات غير المتزامنة للزر الأيمن:

```js
const App = () => {
  // ...
  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    const updatedRight = right + 1;
    setRight(updatedRight);
    setTotal(left + updatedRight);
  };

  // ...
}
```


### العرض الشرطي

لنعدّل تطبيقنا بحيث يتولى مكوّن جديد باسم <i>History</i> عرض سجل النقرات:

```js
// highlight-start
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

الآن يعتمد سلوك المكوّن على ما إذا كانت أي أزرار قد نُقرت أم لا. فإن لم يكن، أي إذا كانت مصفوفة <em>allClicks</em> فارغة، يعرض المكوّن عنصر div يحتوي على بعض التعليمات بدلاً من ذلك:

```js
<div>the app is used by pressing the buttons</div>
```

وفي جميع الحالات الأخرى، يعرض المكوّن سجل النقرات:

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

يعرض مكوّن <i>History</i> عناصر React مختلفة تماماً حسب حالة التطبيق. ويسمى هذا <i>العرض الشرطي</i>.

تقدم React أيضاً طرقاً أخرى كثيرة للقيام بـ[العرض الشرطي](https://react.dev/learn/conditional-rendering). وسنلقي نظرة أقرب على ذلك في [الجزء 2](/part2).

لنجرِ تعديلاً أخيراً على تطبيقنا بإعادة هيكلته لاستخدام مكوّن _Button_ الذي عرّفناه سابقاً:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button> // highlight-line

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### React القديمة

نستخدم في هذه الدورة [خطاف الحالة](https://react.dev/learn/state-a-components-memory) لإضافة الحالة إلى مكوّنات React، وهو جزء من الإصدارات الأحدث من React ومتاح ابتداءً من الإصدار [16.8.0](https://www.npmjs.com/package/react/v/16.8.0) فصاعداً. وقبل إضافة الخطافات، لم تكن هناك طريقة لإضافة الحالة إلى المكوّنات الدالية. وكان لا بد من تعريف المكوّنات التي تحتاج إلى حالة كمكوّنات [class](https://react.dev/reference/react/Component) باستخدام صيغة class في JavaScript.

اتخذنا في هذه الدورة قراراً جذرياً بعض الشيء باستخدام الخطافات حصراً من اليوم الأول، لضمان تعلمنا الصيغ الحالية والمستقبلية لـ React. ورغم أن المكوّنات الدالية هي مستقبل React، فإن تعلم صيغة class ما زال مهماً، إذ توجد مليارات الأسطر من شيفرة React القديمة التي قد ينتهي بك الأمر بصيانتها يوماً ما. وينطبق الأمر نفسه على توثيق React وأمثلتها التي قد تصادفها على الإنترنت.

وسنتعلم المزيد عن مكوّنات class في React لاحقاً في الدورة.

### تصحيح أخطاء تطبيقات React

يُقضى جزء كبير من وقت المطوّر النموذجي في تصحيح الأخطاء وقراءة الشيفرة القائمة. ومن وقت لآخر نكتب سطراً أو سطرين من شيفرة جديدة، لكننا نقضي جزءاً كبيراً من وقتنا في محاولة معرفة سبب خلل شيء ما أو كيفية عمل شيء ما. ولهذا السبب تُعدّ الممارسات والأدوات الجيدة لتصحيح الأخطاء بالغة الأهمية.

ولحسن حظنا، React مكتبة صديقة للمطوّرين للغاية عندما يتعلق الأمر بتصحيح الأخطاء.

وقبل أن نمضي قدماً، لنذكّر أنفسنا بإحدى أهم قواعد تطوير الويب.

<h4>القاعدة الأولى في تطوير الويب</h4>

> **أبقِ وحدة تحكم المطوّر في المتصفح مفتوحة في جميع الأوقات.**
>
> وينبغي أن يبقى تبويب <i>Console</i> على وجه الخصوص مفتوحاً دائماً، إلا لسبب محدد لاستعراض تبويب آخر.

أبقِ شيفرتك وصفحة الويب مفتوحتين معاً **في الوقت نفسه، طوال الوقت**.

وإذا فشلت شيفرتك في الترجمة وأضاء متصفحك كشجرة عيد الميلاد:

![لقطة شاشة لخطأ يشير إلى سطر الشيفرة الذي تولّد فيه](../../images/1/6x.webp)

فلا تكتب مزيداً من الشيفرة، بل جد المشكلة وأصلحها **فوراً**. فلم تأتِ لحظة في تاريخ البرمجة تعمل فيها شيفرة فشلت في الترجمة بأعجوبة بعد كتابة كميات كبيرة من الشيفرة الإضافية. وأشكّ كثيراً في أن تحدث مثل هذه الواقعة خلال هذه الدورة أيضاً.

يعدّ تصحيح الأخطاء بالطريقة القديمة القائمة على الطباعة فكرة جيدة دائماً. فإذا لم يكن المكوّن

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

يعمل كما هو مقصود، فمن المفيد البدء بطباعة متغيراته في وحدة التحكم. ولكي نفعل ذلك بفعالية، يجب تحويل دالتنا إلى الصيغة الأقل إيجازاً واستقبال كائن props كاملاً دون تفكيكه فوراً:

```js
const Button = (props) => { 
  console.log(props) // highlight-line
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
```

سيكشف هذا فوراً ما إذا كان أحد الخصائص مثلاً قد كُتب خطأً عند استخدام المكوّن.

**ملاحظة** عند استخدام _console.log_ لتصحيح الأخطاء، لا تجمع _الكائنات_ على طريقة Java باستخدام عامل الجمع:

```js
console.log('props value is ' + props)
```
  
فإن فعلت ذلك، ستحصل على رسالة سجل غير مفيدة تماماً:

```js
props value is [object Object]
```

بدلاً من ذلك، افصل بين الأشياء التي تريد تسجيلها في وحدة التحكم بفاصلة:

```js
console.log('props value is', props)
```

وبهذه الطريقة، ستكون جميع العناصر المفصولة متاحة في وحدة تحكم المتصفح لمزيد من الفحص.

ليس تسجيل المخرجات في وحدة التحكم بأي حال الطريقة الوحيدة لتصحيح أخطاء تطبيقاتنا. يمكنك إيقاف تنفيذ شيفرة تطبيقك في <i>مصحّح الأخطاء</i> (debugger) في وحدة تحكم مطوّري Chrome بكتابة الأمر [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) في أي مكان من شيفرتك.

سيتوقف التنفيذ بمجرد وصوله إلى نقطة يُنفَّذ فيها الأمر _debugger_:

![مصحّح الأخطاء متوقف في أدوات المطوّر](../../images/1/7a.webp)

وبالانتقال إلى تبويب <i>Console</i>، يسهل فحص الحالة الحالية للمتغيرات:

![لقطة شاشة لفحص وحدة التحكم](../../images/1/8a.webp)

وبمجرد اكتشاف سبب الخلل، يمكنك إزالة الأمر _debugger_ وتحديث الصفحة.

ويمكّننا مصحّح الأخطاء أيضاً من تنفيذ شيفرتنا سطراً بسطر باستخدام أدوات التحكم الموجودة على الجانب الأيمن من تبويب <i>Sources</i>.

يمكنك أيضاً الوصول إلى مصحّح الأخطاء دون الأمر _debugger_ بإضافة نقاط توقف في تبويب <i>Sources</i>. ويمكن فحص قيم متغيرات المكوّن في قسم _Scope_:

![مثال على نقطة توقف في أدوات المطوّر](../../images/1/9a.webp)

يوصى بشدة بإضافة امتداد [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) إلى Chrome. فهو يضيف تبويب _Components_ جديداً إلى أدوات المطوّر. ويمكن استخدام تبويب أدوات المطوّر الجديد لفحص عناصر React المختلفة في التطبيق مع حالتها وprops الخاصة بها:

![لقطة شاشة لامتداد React developer tools](../../images/1/10ea.webp)

تُعرَّف حالة مكوّن _App_ هكذا:

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

تعرض أدوات المطوّر حالة الخطافات بترتيب تعريفها:

![حالة الخطافات في أدوات مطوّري React](../../images/1/11ea.webp)

تحتوي <i>State</i> الأولى على قيمة حالة <i>left</i>، وتحتوي التالية على قيمة حالة <i>right</i>، وتحتوي الأخيرة على قيمة حالة <i>allClicks</i>.

يمكنك أيضاً التعلم عن تصحيح أخطاء JavaScript في Chrome، مثلاً، عبر [فيديو دليل Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript).

### قواعد الخطافات

هناك بعض القيود و[القواعد](https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks) التي علينا اتباعها لضمان استخدام تطبيقنا لدوال الحالة القائمة على الخطافات استخداماً صحيحاً.

يجب <i>عدم استدعاء</i> الدالة _useState_ (وكذلك الدالة _useEffect_ التي ستُقدَّم لاحقاً في الدورة) من داخل حلقة أو تعبير شرطي أو أي مكان ليس دالة تعرّف مكوّناً. ويجب الالتزام بذلك لضمان استدعاء الخطافات دائماً بالترتيب نفسه، وإلا فسيسلك التطبيق سلوكاً غير منتظم.

وخلاصة القول، لا يجوز استدعاء الخطافات إلا من داخل جسم دالة تعرّف مكوّن React:

```js
const App = () => {
  // هذه مقبولة
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // هذا لا يعمل!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // وهذا أيضاً غير جيد
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // وهذا أيضاً غير مسموح
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### إعادة النظر في معالجة الأحداث

أثبتت معالجة الأحداث أنها موضوع صعب في النسخ السابقة من هذه الدورة.

ولهذا السبب، سنعيد النظر في الموضوع.

لنفترض أننا نطوّر هذا التطبيق البسيط بالمكوّن <i>App</i> التالي:

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

نريد أن تؤدي النقر على الزر إلى إعادة ضبط الحالة المخزنة في المتغير _value_.

ولجعل الزر يتفاعل مع حدث النقر، علينا إضافة <i>معالج حدث</i> إليه.

يجب أن يكون معالج الحدث دائماً دالة أو مرجعاً إلى دالة. فلن يعمل الزر إذا عُيّن معالج الحدث إلى متغير من أي نوع آخر.

فلو عرّفنا معالج الحدث كنص:

```js
<button onClick="crap...">button</button>
```

لحذّرتنا React من ذلك في وحدة التحكم:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

ولن تنجح المحاولة التالية أيضاً:

```js
<button onClick={value + 1}>button</button>
```

فقد حاولنا تعيين معالج الحدث إلى _value + 1_، وهي تُعيد ببساطة نتيجة العملية. وستحذّرنا React بلطف من ذلك في وحدة التحكم:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

ولن تنجح هذه المحاولة أيضاً:

```js
<button onClick={value = 0}>button</button>
```

فمعالج الحدث ليس دالة بل إسناد إلى متغير، وستصدر React مرة أخرى تحذيراً في وحدة التحكم. وهذه المحاولة معيبة أيضاً من حيث إنه يجب ألا نغيّر الحالة مباشرة في React أبداً.

وماذا عن التالي:

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

تُطبع الرسالة في وحدة التحكم مرة واحدة عند عرض المكوّن، لكن لا يحدث شيء عند النقر على الزر. فلماذا لا يعمل هذا رغم أن معالج الحدث لدينا يحتوي على دالة _console.log_؟

المشكلة هنا أن معالج الحدث معرّف كـ<i>استدعاء دالة</i>، ما يعني أن معالج الحدث يُسند إليه القيمة المُعادة من الدالة، وهي في حالة _console.log_ تساوي <i>undefined</i>.

يُنفَّذ استدعاء الدالة _console.log_ عند عرض المكوّن، ولهذا السبب تُطبع مرة واحدة في وحدة التحكم.

والمحاولة التالية معيبة أيضاً:

```js
<button onClick={setValue(0)}>button</button>
```

حاولنا مرة أخرى تعيين استدعاء دالة كمعالج حدث. وهذا لا يعمل. كما تسبب هذه المحاولة تحديداً مشكلة أخرى. فعند عرض المكوّن تُنفَّذ الدالة _setValue(0)_، ما يؤدي بدوره إلى إعادة عرض المكوّن. وتستدعي إعادة العرض بدورها _setValue(0)_ مرة أخرى، ما ينتج عنه استدعاء ذاتي لا نهائي.

ويمكن تنفيذ استدعاء دالة معينة عند النقر على الزر هكذا:

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

أصبح معالج الحدث الآن دالة معرّفة بصيغة الدالة السهمية _() => console.log('clicked the button')_. وعند عرض المكوّن، لا تُستدعى أي دالة، ويُعيَّن فقط مرجع الدالة السهمية إلى معالج الحدث. ولا يحدث استدعاء الدالة إلا عند النقر على الزر.

يمكننا تنفيذ إعادة ضبط الحالة في تطبيقنا بالتقنية نفسها:

```js
<button onClick={() => setValue(0)}>button</button>
```

أصبح معالج الحدث الآن الدالة _() => setValue(0)_.

وليس تعريف معالجات الأحداث مباشرة في خاصية الزر بالضرورة أفضل فكرة ممكنة.

سترى غالباً معالجات الأحداث معرّفة في مكان منفصل. وفي النسخة التالية من تطبيقنا نعرّف دالة تُسند بعد ذلك إلى المتغير _handleClick_ في جسم دالة المكوّن:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

ويُمرَّر المتغير _handleClick_، الذي يشير إلى تعريف الدالة، إلى الزر كخاصية <i>onClick</i>:

```js
<button onClick={handleClick}>button</button>
```

وبالطبع، يمكن أن تتألف دالة معالج الحدث من أوامر متعددة. وفي هذه الحالات نستخدم صيغة الأقواس المعقوفة الأطول للدوال السهمية:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### دالة تُعيد دالة

هناك طريقة أخرى لتعريف معالج حدث، وهي استخدام <i>دالة تُعيد دالة</i>.

على الأرجح لن تحتاج إلى استخدام دوال تُعيد دوالاً في أي من تمارين هذه الدورة. وإذا بدا الموضوع مربكاً بشكل خاص، فيمكنك تخطي هذا القسم الآن والعودة إليه لاحقاً.

لنجرِ التغييرات التالية على شيفرتنا:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello world')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

تعمل الشيفرة بشكل صحيح رغم أنها تبدو معقدة.

أصبح معالج الحدث الآن معيَّناً إلى استدعاء دالة:

```js
<button onClick={hello()}>button</button>
```

قلنا سابقاً إن معالج الحدث لا يجوز أن يكون استدعاء دالة، بل يجب أن يكون تعريف دالة أو مرجعاً إلى دالة. فلماذا يعمل استدعاء الدالة في هذه الحالة إذن؟

عند عرض المكوّن، تُنفَّذ الدالة التالية:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

و<i>القيمة المُعادة</i> من الدالة هي دالة أخرى تُسند إلى المتغير _handler_.

وعندما تعرض React السطر:

```js
<button onClick={hello()}>button</button>
```

تُسند القيمة المُعادة من _hello()_ إلى خاصية onClick. وأساساً يتحول السطر إلى:

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

ولأن الدالة _hello_ تُعيد دالة، أصبح معالج الحدث الآن دالة.

وما الفائدة من هذا المفهوم؟

لنغيّر الشيفرة قليلاً:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end  

  return (
    <div>
      {value}
  // highlight-start      
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end      
    </div>
  )
}
```

أصبح في التطبيق الآن ثلاثة أزرار معالجات أحداثها معرّفة بالدالة _hello_ التي تقبل معاملاً.

الزر الأول معرّف هكذا

```js
<button onClick={hello('world')}>button</button>
```

يُنشأ معالج الحدث بـ<i>تنفيذ</i> استدعاء الدالة _hello('world')_. ويُعيد استدعاء الدالة الدالةَ:

```js
() => {
  console.log('hello', 'world')
}
```

والزر الثاني معرّف هكذا:

```js
<button onClick={hello('react')}>button</button>
```

ويُعيد استدعاء الدالة _hello('react')_ الذي ينشئ معالج الحدث:

```js
() => {
  console.log('hello', 'react')
}
```

ويحصل كلا الزرين على معالج الحدث المخصص له.

يمكن استخدام الدوال التي تُعيد دوالاً في تعريف وظائف عامة يمكن تخصيصها بالمعاملات. ويمكن التفكير في الدالة _hello_ التي تنشئ معالجات الأحداث كمصنع ينتج معالجات أحداث مخصصة لتحية المستخدمين.

تعريفنا الحالي مطوّل قليلاً:

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

لنحذف المتغيرات المساعدة ونُعِد الدالة المُنشأة مباشرة:

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

ولأن دالتنا _hello_ تتألف من أمر return واحد، يمكننا حذف الأقواس المعقوفة واستخدام الصيغة الأكثر إيجازاً للدوال السهمية:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

وأخيراً، لنكتب جميع الأسهم على السطر نفسه:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

يمكننا استخدام الحيلة نفسها لتعريف معالجات أحداث تعيّن حالة المكوّن إلى قيمة معينة. لنجرِ التغييرات التالية على شيفرتنا:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // اطبع القيمة الجديدة في وحدة التحكم
    setValue(newValue)
  }
  // highlight-end
  
  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

عند عرض المكوّن، يُنشأ زر <i>thousand</i>:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

يُعيَّن معالج الحدث إلى القيمة المُعادة من _setToValue(1000)_، وهي الدالة التالية:

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

وزر الزيادة معرّف كما يلي:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

يُنشأ معالج الحدث باستدعاء الدالة _setToValue(value + 1)_ الذي يتلقى كمعامل له القيمة الحالية لمتغير الحالة _value_ مزيدَة بواحد. فإذا كانت قيمة _value_ تساوي 10، يصبح معالج الحدث المُنشأ هو الدالة:

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

لا يُشترط استخدام دوال تُعيد دوالاً لتحقيق هذه الوظيفة. لنُعِد الدالة _setToValue_ المسؤولة عن تحديث الحالة إلى دالة عادية:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

يمكننا الآن تعريف معالج الحدث كدالة تستدعي الدالة _setToValue_ بمعامل مناسب. وسيكون معالج الحدث الخاص بإعادة ضبط حالة التطبيق:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

والاختيار بين الطريقتين المعروضتين لتعريف معالجات الأحداث مسألة ذوق في المقام الأول.

### تمرير معالجات الأحداث إلى المكوّنات الفرعية

لنستخرج الزر إلى مكوّن خاص به:

```js
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
```

يحصل المكوّن على دالة معالج الحدث من prop باسم _onClick_، وعلى نص الزر من prop باسم _text_. لنستخدم المكوّن الجديد:

```js
const App = (props) => {
  // ...
  return (
    <div>
      {value}
      <Button onClick={() => setToValue(1000)} text="thousand" /> // highlight-line
      <Button onClick={() => setToValue(0)} text="reset" /> // highlight-line
      <Button onClick={() => setToValue(value + 1)} text="increment" /> // highlight-line
    </div>
  )
}
```

استخدام مكوّن <i>Button</i> بسيط، وإن كان علينا التأكد من استخدام أسماء الخصائص الصحيحة عند تمرير props إلى المكوّن.

![لقطة شاشة لشيفرة استخدام أسماء الخصائص الصحيحة](../../images/1/12f.webp)

### لا تعرّف المكوّنات داخل المكوّنات

لنبدأ بعرض قيمة التطبيق في مكوّنه <i>Display</i>.

سنغيّر التطبيق بتعريف مكوّن جديد داخل مكوّن <i>App</i>.

```js
// هذا هو المكان الصحيح لتعريف مكوّن
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // لا تعرّف مكوّنات داخل مكوّن آخر
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} /> // highlight-line
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

ما زال التطبيق يبدو وكأنه يعمل، لكن **لا تنفّذ المكوّنات بهذه الطريقة!** لا تعرّف مكوّنات داخل مكوّنات أخرى أبداً. فهذه الطريقة لا تقدم أي فائدة ولا تؤدي إلا إلى مشكلات. ومن هذه المشكلات أن React ستعامل المكوّن المعرّف داخل مكوّن آخر كـ«مكوّن جديد» في كل عرض. وهذا يجعل تحسين المكوّن مستحيلاً على React.

لننقل بدلاً من ذلك دالة مكوّن <i>Display</i> إلى مكانها الصحيح، وهو خارج دالة مكوّن <i>App</i>:

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### قراءات مفيدة

الإنترنت مليء بالمواد المتعلقة بـ React. لكننا نستخدم النمط الجديد من React، الذي أصبحت أغلبية كبيرة من المواد الموجودة على الإنترنت قديمة بالنسبة إليه.

قد تجد الروابط التالية مفيدة:

- يستحق [توثيق React الرسمي](https://react.dev/learn) الاطلاع عليه في مرحلة ما، وإن كان معظمه لن يصبح ذا صلة إلا لاحقاً في الدورة. كما أن كل ما يتعلق بالمكوّنات القائمة على class لا يعنينا؛
- بعض الدورات على [Egghead.io](https://egghead.io) مثل [Start learning React](https://egghead.io/courses/start-learning-react) ذات جودة عالية، كما أن [Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react) المحدَّثة حديثاً جيدة نسبياً أيضاً؛ وتقدّم كلتا الدورتين مفاهيم ستُقدَّم أيضاً لاحقاً في هذه الدورة. **ملاحظة** تستخدم الأولى مكوّنات class، أما الأخيرة فتستخدم المكوّنات الدالية الجديدة.

### قسم مبرمج الويب

البرمجة صعبة. ولهذا سأستخدم، كمطوّر، كل الوسائل الممكنة لتسهيلها.

- سأبقي وحدة تحكم المطوّر في متصفحي مفتوحة في جميع الأوقات.
- سأتقدم بخطوات صغيرة، متأكداً من أن شيفرتي تعمل في كل خطوة.
- سأكتب عبارات _console.log_ كثيرة للتأكد من فهمي لكيفية تصرف الشيفرة وللمساعدة في تحديد المشكلات بدقة.
- إذا لم تعمل شيفرتي، فلن أكتب مزيداً من الشيفرة. بل سأبدأ بحذف الشيفرة حتى تعمل، أو سأعود إلى حالة كان فيها برنامجي يعمل.
- عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في أي مكان آخر، سأصوغ أسئلتي بشكل سليم. راجع [هذا القسم](/part0/general_info#how-to-get-help-in-discord) لتتعلم كيفية طلب المساعدة.

### استخدام نماذج اللغة الكبيرة

أثبتت نماذج اللغة الكبيرة مثل [ChatGPT](https://chat.openai.com/auth/login) و[Claude](https://claude.ai/) و[GitHub Copilot](https://github.com/features/copilot) أنها مفيدة جداً في تطوير البرمجيات.

أنا شخصياً أستخدم GitHub Copilot أساساً، وهو الآن [مدمج أصلاً في Visual Studio Code](https://code.visualstudio.com/docs/copilot/overview)
وكتذكير، إذا كنت طالباً جامعياً، فيمكنك الوصول إلى Copilot Pro مجاناً عبر [حزمة مطوّر الطلاب من GitHub](https://education.github.com/pack).

يفيد Copilot في مجموعة واسعة ومتنوعة من السيناريوهات. فيمكن مثلاً أن يُطلب من Copilot توليد شيفرة لملف مفتوح بوصف الوظيفة المطلوبة نصاً:

![إدخال copilot في vscode](../../images/1/gpt1.webp)

وإذا بدت الشيفرة جيدة، يضيفها Copilot إلى الملف:

![شيفرة أضافها copilot](../../images/1/gpt2.webp)

في حالة مثالنا، أنشأ Copilot زراً فقط، أما معالج الحدث _handleResetClick_ فغير معرّف.

ويمكن أيضاً توليد معالج حدث. فبكتابة السطر الأول من الدالة، يعرض Copilot الوظيفة المراد توليدها:

![اقتراح شيفرة من copilot](../../images/1/gpt3.webp)

وفي نافذة محادثة Copilot، يمكن طلب شرح لوظيفة منطقة الشيفرة المحددة:

![copilot يشرح كيفية عمل الشيفرة المحددة في نافذة المحادثة](../../images/1/gpt4.webp)

يفيد Copilot أيضاً في تصحيح الأخطاء. فإذا نسخت رسالة خطأ إلى محادثة Copilot، فستحصل على شرح للمشكلة واقتراح لإصلاحها:

![copilot يشرح الخطأ ويقترح إصلاحاً](../../images/1/gpt5.webp)

تتيح محادثة Copilot أيضاً إنشاء مجموعة أكبر من الوظائف. فالصورة أدناه مثلاً تُظهر Copilot وهو ينشئ مكوّن تسجيل دخول باستخدام خطاف _useState_.

![copilot ينشئ مكوّن تسجيل دخول عند الطلب](../../images/1/gpt6.webp)

تتفاوت فائدة Copilot ونماذج اللغة الأخرى في البرمجة. وأكبر مشكلة في نماذج اللغة هي [الهلوسة](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)). فنماذج اللغة الكبيرة تولّد أحياناً إجابات قد تبدو صحيحة لكنها خاطئة تماماً. وفي البرمجة، غالباً ما تُكتشف الأخطاء في الشيفرة المهلوسة بسرعة عندما تفشل الشيفرة في العمل. غير أن بعض الشيفرة التي يولّدها نموذج لغوي قد تعمل في البداية لكنها تحتوي مع ذلك على مشكلات خفية، مثل أخطاء منطقية أو ثغرات أمنية.

ومن المشكلات الأخرى في تطبيق نماذج اللغة على تطوير البرمجيات أن من الصعب على نماذج اللغة «فهم» المشاريع الأكبر. ومن أبرز قيود نماذج اللغة أنها غير قادرة على تنفيذ تغييرات عبر عدة ملفات. كما أن نماذج اللغة غير قادرة حالياً على تعميم الشيفرة. فمثلاً، إذا طلب المبرمج وظيفة جديدة يمكن تنفيذها بدوال أو مكوّنات قائمة (حتى بتعديلات طفيفة)، فقد يفشل نموذج اللغة في استخدامها. وهذا يدهور جودة قاعدة الشيفرة لأن نماذج اللغة تولّد دوالاً ومكوّنات مكررة. ولمزيد من المعلومات حول هذا، اقرأ [هذا المقال](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx).

وإذا اخترت استخدام نماذج اللغة أثناء البرمجة، فتذكر أن مخرجاتها مسؤوليتك.

يضع التطور السريع لنماذج اللغة طلاب البرمجة في موقف صعب. فهل يستحق الأمر، أو هل هو ضروري أصلاً، تعلم البرمجة بمستوى تفصيلي عندما يمكنك الحصول على كل شيء تقريباً جاهزاً من نماذج اللغة؟

وهنا يجدر تذكر الحكمة القديمة لـ[Brian Kerningham](https://en.wikipedia.org/wiki/Brian_Kernighan)، المؤلف المشارك لكتاب *The C Programming Language*:

![يعلم الجميع أن تصحيح الأخطاء أصعب بمرتين من كتابة البرنامج ابتداءً. فإذا كنت في غاية البراعة عند كتابته، فكيف ستصحح أخطاءه أبداً؟ ― Brian Kernighan](../../images/1/kerningham.webp)

وبعبارة أخرى، بما أن تصحيح الأخطاء أصعب بمرتين من البرمجة، فلا يستحق الأمر إنشاء شيفرة بالكاد تفهمها. فكيف يمكن أن يكون تصحيح الأخطاء ممكناً أصلاً عندما لا يفهم مطوّر البرمجيات الشيفرة التي يصححها لأنه أوكل البرمجة إلى نموذج لغوي؟

حتى الآن، ما زال تطوير نماذج اللغة والذكاء الاصطناعي في مرحلة لا تكون فيها مكتفية بذاتها، وتُترك أصعب المشكلات للبشر لحلها. ولهذا، يجب حتى على مطوّري البرمجيات المبتدئين تعلم البرمجة جيداً حقاً، احتياطاً. وقد يكون الأمر أن معرفة أعمق مطلوبة أكثر رغم تطور نماذج اللغة. فالذكاء الاصطناعي يقوم بالأمور السهلة، لكن الحاجة تبقى إلى إنسان لترتيب أكثر الفوضى تعقيداً التي يسببها الذكاء الاصطناعي. وGitHub Copilot منتج موفق التسمية جداً لأنه مساعد طيار؛ طيار ثانٍ يساعد الطيار الرئيسي في الطائرة. وما زال المبرمج هو الطيار الرئيسي، القبطان، والشخص الذي يتحمل المسؤولية في النهاية.

وطوال هذه الدورة، قد يكون من مصلحتك أن توقف Copilot افتراضياً ولا تعتمد عليه إلا في حالة طارئة حقيقية.

</div>

<div class="tasks">

<h3>تمارين 1.6.-1.14.</h3>

سلّم حلول تمارينك برفع شيفرتك أولاً إلى GitHub ثم تعليم التمارين المنجزة في تبويب «تسليماتي» (my submissions) في [تطبيق التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

تذكّر، سلّم **جميع** تمارين الجزء الواحد **في تسليم واحد**. وبمجرد تسليم حلولك لجزء ما، **لن تتمكن من تسليم مزيد من التمارين لذلك الجزء بعد الآن**.

<i>تعمل بعض التمارين على التطبيق نفسه. وفي هذه الحالات، يكفي تسليم النسخة النهائية من التطبيق فقط. ويمكنك إن أردت إنشاء commit بعد كل تمرين مكتمل، لكن ذلك ليس إلزامياً.</i>

وفي بعض الحالات قد تحتاج أيضاً إلى تنفيذ الأمر أدناه من جذر المشروع:

```bash
rm -rf node_modules/ && npm i
```

إذا واجهتك رسالة خطأ، و<i>عندما</i> تواجهك

> <i>Objects are not valid as a React child</i>

فتذكّر ما قيل [هنا](/part1/introduction_to_react#do-not-render-objects).

<h4> 1.6: unicafe الخطوة 1</h4>

مثل معظم الشركات، يجمع مطعم الطلاب في جامعة هلسنكي [Unicafe](https://www.unicafe.fi) ملاحظات عملائه. ومهمتك تنفيذ تطبيق ويب لجمع ملاحظات العملاء. وهناك ثلاثة خيارات فقط للملاحظات: <i>good</i> و<i>neutral</i> و<i>bad</i>.

يجب أن يعرض التطبيق العدد الإجمالي للملاحظات المجموعة لكل فئة. وقد يبدو تطبيقك النهائي هكذا:

![لقطة شاشة لخيارات الملاحظات](../../images/1/13e.webp)

لاحظ أن تطبيقك يحتاج إلى العمل خلال جلسة متصفح واحدة فقط. وبمجرد تحديث الصفحة، يُسمح للملاحظات المجموعة بالاختفاء.

يُستحسن استخدام البنية نفسها المستخدمة في المادة والتمرين السابق. وملف <i>main.jsx</i> كما يلي:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ويمكنك استخدام الشيفرة أدناه كنقطة انطلاق لملف <i>App.jsx</i>:

```js
import { useState } from 'react'

const App = () => {
  // احفظ نقرات كل زر في حالته الخاصة
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

<h4>1.7: unicafe الخطوة 2</h4>

وسّع تطبيقك بحيث يعرض مزيداً من الإحصاءات حول الملاحظات المجموعة: العدد الإجمالي للملاحظات المجموعة، ومتوسط التقييم (قيم الملاحظات هي: good 1، وneutral 0، وbad -1)، ونسبة الملاحظات الإيجابية.

![لقطة شاشة لمتوسط الملاحظات ونسبة الإيجابية](../../images/1/14e.webp)

<h4>1.8: unicafe الخطوة 3</h4>

أعد هيكلة تطبيقك بحيث يُستخرج عرض الإحصاءات إلى مكوّنه الخاص <i>Statistics</i>. وينبغي أن تبقى حالة التطبيق في المكوّن الجذر <i>App</i>.

تذكّر أنه لا ينبغي تعريف المكوّنات داخل مكوّنات أخرى:

```js
// مكان مناسب لتعريف مكوّن
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // لا تعرّف مكوّناً داخل مكوّن آخر
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe الخطوة 4</h4>

غيّر تطبيقك بحيث لا يعرض الإحصاءات إلا بعد جمع الملاحظات.

![لقطة شاشة لنص no feedback given](../../images/1/15e.webp)

<h4>1.10: unicafe الخطوة 5</h4>

لنواصل إعادة هيكلة التطبيق. استخرج المكوّنين التاليين:

- <i>Button</i> يتولى وظيفة كل زر من أزرار إرسال الملاحظات.

- <i>StatisticLine</i> لعرض إحصاءة واحدة، مثل متوسط التقييم.

للتوضيح: يعرض مكوّن <i>StatisticLine</i> دائماً إحصاءة واحدة، أي أن التطبيق يستخدم عدة مكوّنات لعرض جميع الإحصاءات:

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value={...} />
      <StatisticLine text="neutral" value={...} />
      <StatisticLine text="bad" value={...} />
      // ...
    </div>
  )
}

```

وينبغي أن تبقى حالة التطبيق في المكوّن الجذر <i>App</i>.

<h4>1.11*: unicafe الخطوة 6</h4>

اعرض الإحصاءات في [جدول](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) HTML، بحيث يبدو تطبيقك تقريباً هكذا:

![لقطة شاشة لجدول الإحصاءات](../../images/1/16e.webp)

تذكّر أن تبقي وحدة التحكم مفتوحة في جميع الأوقات. وإذا رأيت هذا التحذير في وحدة التحكم:

![تحذير في وحدة التحكم](../../images/1/17a.webp)

فنفّذ الإجراءات اللازمة لإخفاء التحذير. وحاول لصق رسالة الخطأ في محرك بحث إذا واجهت صعوبة.

<i>المصدر النموذجي لخطأ _Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist._ هو أحد امتدادات Chrome. جرّب الانتقال إلى _chrome://extensions/_ وتعطيلها واحداً واحداً وتحديث صفحة تطبيق React؛ وسيختفي الخطأ في النهاية.</i>

**تأكد من الآن فصاعداً من عدم رؤيتك أي تحذيرات في وحدة التحكم!**

<h4>1.12*: anecdotes الخطوة 1</h4>

عالم هندسة البرمجيات مليء بـ[الطرائف](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) التي تختصر حقائق خالدة من مجالنا في جمل قصيرة.

وسّع التطبيق التالي بإضافة زر يمكن النقر عليه لعرض طرفة <i>عشوائية</i> من مجال هندسة البرمجيات:

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

محتوى ملف <i>main.jsx</i> هو نفسه كما في التمارين السابقة.

اكتشف كيفية توليد أعداد عشوائية في JavaScript، مثلاً عبر محرك بحث أو على [Mozilla Developer Network](https://developer.mozilla.org). وتذكّر أنه يمكنك اختبار توليد الأعداد العشوائية مثلاً مباشرة في وحدة تحكم متصفحك.

وقد يبدو تطبيقك المكتمل شيئاً كهذا:

![طرفة عشوائية مع زر next](../../images/1/18a.webp)

<h4>1.13*: anecdotes الخطوة 2</h4>

وسّع تطبيقك بحيث يمكنك التصويت للطرفة المعروضة.

![تطبيق الطرائف مع إضافة زر التصويت](../../images/1/19a.webp)

**ملاحظة** خزّن أصوات كل طرفة في مصفوفة أو كائن في حالة المكوّن. وتذكّر أن الطريقة الصحيحة لتحديث الحالة المخزنة في بنى بيانات معقدة كالكائنات والمصفوفات هي إنشاء نسخة من الحالة.

يمكنك إنشاء نسخة من كائن هكذا:

```js
const votes = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...votes }
// زد قيمة الخاصية 2 بواحد
copy[2] += 1     
```

أو نسخة من مصفوفة هكذا:

```js
const votes = [1, 4, 6, 3]

const copy = [...votes]
// زد القيمة في الموضع 2 بواحد
copy[2] += 1     
```

قد يكون استخدام مصفوفة الخيار الأبسط في هذه الحالة. والبحث على الإنترنت سيوفر لك الكثير من التلميحات حول كيفية [إنشاء مصفوفة مملوءة بالأصفار بالطول المطلوب](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1.14*: anecdotes الخطوة 3</h4>

نفّذ الآن النسخة النهائية من التطبيق التي تعرض الطرفة الحاصلة على أكبر عدد من الأصوات:

![طرفة حاصلة على أكبر عدد من الأصوات](../../images/1/20a.webp)

وإذا تعادلت عدة طرائف على المركز الأول، فيكفي عرض واحدة منها فقط.

كان هذا آخر تمرين في هذا الجزء من الدورة، وقد حان وقت رفع شيفرتك إلى GitHub وتعليم جميع تمارينك المنجزة في تبويب «تسليماتي» (my submissions) في [تطبيق التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
