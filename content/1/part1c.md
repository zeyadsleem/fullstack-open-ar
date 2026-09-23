---
mainImage: /images/part-1.svg
part: 1
letter: c
lang: ar
---

<div class="content">

لنعد إلى العمل مع React.

نبدأ بمثال جديد:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### دوال مساعدة في المكوّن

لنوسّع مكوّن <i>Hello</i> لدينا بحيث يخمّن سنة ميلاد الشخص الذي نحيّيه:

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

منطق تخمين سنة الميلاد مُغلَّف داخل دالة خاصة به، تُستدعى عند عرض المكوّن.

لا حاجة لتمرير عمر الشخص صراحةً كوسيط إلى هذه الدالة، لأن الدالة يمكنها الوصول مباشرةً إلى كل الـ props الممرَّرة إلى المكوّن.

إذا تأملنا الشيفرة الحالية، نلاحظ أن الدالة المساعدة معرَّفة داخل دالة أخرى تحدّد سلوك المكوّن. في برمجة Java، قد يكون تعريف دالة داخل دالة أخرى معقّداً وغير شائع. أما في JavaScript، فتعريف الدوال داخل الدوال ممارسة شائعة وفعّالة.

### التفكيك (destructuring)

قبل أن نمضي قدماً، سنلقي نظرة على ميزة صغيرة لكن مفيدة من لغة JavaScript أُضيفت في مواصفة ES6، وتتيح لنا [تفكيك](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) القيم من الكائنات والمصفوفات عند الإسناد.

في شيفرتنا السابقة، كان علينا الإشارة إلى البيانات الممرَّرة إلى مكوّننا بصيغة _props.name_ و_props.age_. ومن بين هذين التعبيرين، اضطررنا لتكرار _props.age_ مرتين في شيفرتنا.

بما أن <i>props</i> كائن

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

يمكننا تبسيط مكوّننا بإسناد قيم الخصائص مباشرةً إلى متغيرين هما _name_ و_age_ يمكننا بعدها استخدامهما في شيفرتنا:

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age // highlight-line

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

لاحظ أننا استخدمنا أيضاً الصيغة الأكثر إيجازاً لدوال السهم عند تعريف دالة _bornYear_. وكما ذُكر سابقاً، إذا كانت دالة السهم تتكوّن من تعبير واحد، فلا حاجة لكتابة جسم الدالة داخل أقواس معقوفة. في هذه الصيغة الأكثر إيجازاً، تُعيد الدالة ببساطة نتيجة التعبير الواحد.

وللتذكير، فإن تعريفي الدالة الموضحين أدناه متكافئان:

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

يجعل التفكيك إسناد المتغيرات أسهل، إذ يمكننا استخدامه لاستخراج قيم خصائص الكائن وجمعها في متغيرات منفصلة:

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

عندما يحتوي الكائن الذي نفكّكه على القيم

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

فإن التعبير <em>const { name, age } = props</em> يُسند القيمة 'Arto Hellas' إلى _name_ و35 إلى _age_.

يمكننا أن نخطو بالتفكيك خطوة إضافية:

```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

الـ props الممرَّرة إلى المكوّن تُفكَّك الآن مباشرةً إلى المتغيرين _name_ و_age_.

وهذا يعني أنه بدلاً من إسناد كائن الـ props كاملاً إلى متغير يُسمى <i>props</i> ثم إسناد خصائصه إلى المتغيرين _name_ و_age_

```js
const Hello = (props) => {
  const { name, age } = props
```

نُسند قيم الخصائص مباشرةً إلى المتغيرات عبر تفكيك كائن الـ props الممرَّر إلى دالة المكوّن كوسيط:

```js
const Hello = ({ name, age }) => {
```

### إعادة عرض الصفحة

حتى هذه اللحظة، كانت تطبيقاتنا ساكنة — يبقى مظهرها دون تغيير بعد العرض الأولي. لكن ماذا لو أردنا إنشاء عدّاد تزداد قيمته بمرور الوقت أو عند النقر على زر؟

لنبدأ بما يلي. يصبح الملف <i>App.jsx</i>:

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

ويصبح الملف <i>main.jsx</i>:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

يُمنح مكوّن App قيمة العدّاد عبر الـ prop المسمى _counter_. ويعرض هذا المكوّن القيمة على الشاشة. ماذا يحدث عندما تتغير قيمة _counter_؟ حتى لو أضفنا ما يلي

```js
counter += 1
```

فلن يُعاد عرض المكوّن. يمكننا جعل المكوّن يُعاد عرضه باستدعاء الدالة _render_ مرة ثانية، مثلاً بالطريقة التالية:

```js
let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

لُفّ أمر إعادة العرض داخل الدالة _refresh_ لتقليل كمية الشيفرة المنسوخة.

الآن <i>يُعرض المكوّن ثلاث مرات</i>، أولاً بالقيمة 1 ثم 2 وأخيراً 3. لكن القيمتين 1 و2 تُعرضان على الشاشة لمدة قصيرة جداً بحيث لا يمكن ملاحظتهما.

يمكننا تنفيذ وظيفة أكثر تشويقاً بقليل عبر إعادة العرض وزيادة العدّاد كل ثانية باستخدام [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

تكرار استدعاء الدالة _render_ ليس الطريقة الموصى بها لإعادة عرض المكوّنات. سنقدّم لاحقاً طريقة أفضل لتحقيق هذا الأثر.

### مكوّن ذو حالة

كانت جميع مكوّناتنا حتى الآن بسيطة بمعنى أنها لم تكن تحتوي على أي حالة يمكن أن تتغير خلال دورة حياة المكوّن.

لنضف الآن حالة إلى مكوّن <i>App</i> في تطبيقنا بمساعدة [خطاف الحالة](https://react.dev/learn/state-a-components-memory) في React.

سنغيّر التطبيق كما يلي. يعود الملف <i>main.jsx</i> إلى:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ويتغير الملف <i>App.jsx</i> إلى ما يلي:

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```

في السطر الأول، يستورد الملف الدالة _useState_:

```js
import { useState } from 'react'
```

يبدأ جسم الدالة الذي يعرّف المكوّن باستدعاء الدالة:

```js
const [ counter, setCounter ] = useState(0)
```

يضيف استدعاء الدالة <i>حالة</i> إلى المكوّن ويعرضه مهيَّأً بالقيمة صفر. وتُعيد الدالة مصفوفة تحتوي على عنصرين. نُسند العنصرين إلى المتغيرين _counter_ و_setCounter_ باستخدام صيغة إسناد التفكيك التي عرضناها سابقاً.

يُسند إلى المتغير _counter_ القيمة الأولية لـ<i>الحالة</i>، وهي صفر. ويُسند إلى المتغير _setCounter_ دالة ستُستخدم لـ<i>تعديل الحالة</i>.

يستدعي التطبيق الدالة [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) ويمرّر إليها وسيطين: دالة لزيادة حالة العدّاد ومهلة زمنية مقدارها ثانية واحدة:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

تُستدعى الدالة الممرَّرة كوسيط أول إلى الدالة _setTimeout_ بعد ثانية واحدة من استدعاء الدالة _setTimeout_

```js
() => setCounter(counter + 1)
```

عند استدعاء الدالة المعدِّلة للحالة _setCounter_، <i>يُعيد React عرض المكوّن</i>، ما يعني إعادة تنفيذ جسم دالة المكوّن:

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

في المرة الثانية التي تُنفَّذ فيها دالة المكوّن، تستدعي الدالة _useState_ وتُعيد القيمة الجديدة للحالة: 1. كما أن إعادة تنفيذ جسم الدالة تجري استدعاءً جديداً للدالة _setTimeout_، التي تنفّذ المهلة الزمنية مقدارها ثانية وتزيد حالة _counter_ مرة أخرى. ولأن قيمة المتغير _counter_ هي 1، فإن زيادتها بمقدار 1 تكافئ فعلياً تعبيراً يضبط قيمة _counter_ على 2.

```js
() => setCounter(2)
```

وفي الوقت نفسه، تُعرض على الشاشة القيمة القديمة للمتغير _counter_ — «1».

في كل مرة تعدّل فيها _setCounter_ الحالة، تتسبب في إعادة عرض المكوّن. وستزداد قيمة الحالة مرة أخرى بعد ثانية واحدة، وسيستمر هذا التكرار طالما بقي التطبيق قيد التشغيل.

إذا لم يُعرض المكوّن عندما تظن أنه ينبغي أن يُعرض، أو إذا عُرض في «الوقت الخطأ»، يمكنك تصحيح أخطاء التطبيق بطبع قيم متغيرات المكوّن في وحدة التحكم. وإذا أضفنا الإضافات التالية إلى شيفرتنا:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

يصبح من السهل متابعة وتتبّع الاستدعاءات التي تجريها دالة العرض الخاصة بمكوّن <i>App</i>:

![لقطة شاشة لسجل العرض في أدوات المطوّر](../../images/1/4e.webp)

هل كانت وحدة تحكم المتصفح مفتوحة؟ إن لم تكن كذلك، فعِدنا بأن هذه آخر مرة نحتاج فيها إلى تذكيرك بذلك.

### معالجة الأحداث

سبق أن ذكرنا <i>معالجات الأحداث</i> التي تُسجَّل لتُستدعى عند وقوع أحداث معينة عدة مرات في [الجزء 0](/part0). ويمكن أن يؤدي تفاعل المستخدم مع العناصر المختلفة لصفحة ويب إلى إطلاق مجموعة من الأحداث المتنوعة.

لنغيّر التطبيق بحيث تحدث زيادة العدّاد عند نقر المستخدم على زر، وهو أمر يُنفَّذ بعنصر [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).

تدعم عناصر الزر ما يُسمى [أحداث الفأرة](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)، وأكثرها شيوعاً هو الحدث [click](https://developer.mozilla.org/en-US/docs/Web/Events/click). ويمكن إطلاق حدث النقر على زر أيضاً بلوحة المفاتيح أو شاشة اللمس رغم الاسم <i>حدث الفأرة</i>.

في React، تجري [تسجيل دالة معالج حدث](https://react.dev/learn/responding-to-events) للحدث <i>click</i> هكذا:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

نضبط قيمة خاصية <i>onClick</i> للزر على مرجع إلى الدالة _handleClick_ المعرَّفة في الشيفرة.

الآن كل نقرة على زر <i>plus</i> تؤدي إلى استدعاء الدالة _handleClick_، ما يعني أن كل حدث نقر سيطبع رسالة <i>clicked</i> في وحدة تحكم المتصفح.

يمكن أيضاً تعريف دالة معالج الحدث مباشرةً في إسناد قيمة الخاصية onClick:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

بتغيير معالج الحدث إلى الصيغة التالية

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

نحقّق السلوك المطلوب، أي تزداد قيمة _counter_ بمقدار واحد <i>و</i>يُعاد عرض المكوّن.

لنضف أيضاً زراً لإعادة تعيين العدّاد:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

تطبيقنا جاهز الآن!

### معالج الحدث دالة

نعرّف معالجات الأحداث لأزرارنا حيث نصرّح بخصائص <i>onClick</i> الخاصة بها:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

ماذا لو حاولنا تعريف معالجات الأحداث بصيغة أبسط؟

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

سيؤدي هذا إلى تعطيل تطبيقنا بالكامل:

![لقطة شاشة لخطأ إعادة العرض](../../images/1/5c.webp)

ما الذي يحدث؟ يُفترض أن يكون معالج الحدث إما <i>دالة</i> أو <i>مرجعاً إلى دالة</i>، وعندما نكتب:

```js
<button onClick={setCounter(counter + 1)}>
```

فإن معالج الحدث هو في الواقع <i>استدعاء دالة</i>. هذا مقبول في كثير من الحالات، لكنه ليس مقبولاً في هذه الحالة تحديداً. في البداية، قيمة المتغير <i>counter</i> هي 0. وعندما يعرض React المكوّن للمرة الأولى، ينفّذ استدعاء الدالة <em>setCounter(0+1)</em> ويغيّر قيمة حالة المكوّن إلى 1.
سيؤدي هذا إلى إعادة عرض المكوّن، وسينفّذ React استدعاء الدالة setCounter مرة أخرى، وستتغير الحالة مؤديةً إلى إعادة عرض أخرى...

لنعرّف معالجات الأحداث كما فعلنا سابقاً:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

الآن أصبحت خاصية الزر التي تحدّد ما يحدث عند النقر على الزر — <i>onClick</i> — تحمل القيمة _() => setCounter(counter + 1)_.
ولا تُستدعى الدالة setCounter إلا عندما ينقر المستخدم على الزر.

عادةً ليس من الجيد تعريف معالجات الأحداث داخل قوالب JSX.
لكن الأمر مقبول هنا لأن معالجات الأحداث لدينا بسيطة جداً.

لنفصل معالجات الأحداث في دوال منفصلة على أي حال:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

هنا، عُرّفت معالجات الأحداث بشكل صحيح. قيمة خاصية <i>onClick</i> هي متغير يحتوي على مرجع إلى دالة:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### تمرير الحالة إلى المكوّنات الابنة

يُستحسن كتابة مكوّنات React صغيرة وقابلة لإعادة الاستخدام في أنحاء التطبيق وحتى في مشاريع أخرى. لنُعد هيكلة تطبيقنا بحيث يتكوّن من ثلاثة مكوّنات أصغر: مكوّن لعرض العدّاد ومكوّنان للأزرار.

لننفّذ أولاً مكوّن <i>Display</i> المسؤول عن عرض قيمة العدّاد.

من أفضل الممارسات في React [رفع الحالة لأعلى](https://react.dev/learn/sharing-state-between-components) في التسلسل الهرمي للمكوّنات. تقول التوثيقات:

> <i>غالباً ما تحتاج عدة مكوّنات إلى عكس البيانات المتغيرة نفسها. نوصي برفع الحالة المشتركة إلى أقرب سلف مشترك لها.</i>

فلنضع إذن حالة التطبيق في مكوّن <i>App</i> ونمرّرها إلى مكوّن <i>Display</i> عبر <i>props</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

استخدام المكوّن مباشر، إذ نحتاج فقط لتمرير حالة _counter_ إليه:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

كل شيء ما زال يعمل. عند النقر على الأزرار وإعادة عرض <i>App</i>، يُعاد أيضاً عرض جميع أبنائه بما في ذلك مكوّن <i>Display</i>.

لننشئ الآن مكوّن <i>Button</i> لأزرار تطبيقنا. علينا تمرير معالج الحدث وكذلك نص الزر عبر props المكوّن:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

أصبح مكوّن <i>App</i> لدينا الآن هكذا:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

وبما أنه أصبح لدينا مكوّن <i>Button</i> سهل إعادة الاستخدام، نفّذنا أيضاً وظيفة جديدة في تطبيقنا بإضافة زر يمكن استخدامه لإنقاص العدّاد.

يُمرَّر معالج الحدث إلى مكوّن <i>Button</i> عبر الـ prop المسمى _onClick_. عند إنشاء مكوّناتك الخاصة، يمكنك نظرياً اختيار اسم الـ prop بحرية. غير أن اختيارنا لاسم معالج الحدث لم يكن اعتباطياً بالكامل.

يقترح [الدرس التعليمي](https://react.dev/learn/tutorial-tic-tac-toe) الرسمي من React نفسه:
«في React، من المعتاد استخدام أسماء من نمط _onSomething_ للـ props التي تستقبل دوال تتعامل مع الأحداث، و_handleSomething_ لتعريفات الدوال الفعلية التي تعالج تلك الأحداث».

### التغييرات في الحالة تسبب إعادة العرض

لنستعرض مرة أخرى المبادئ الأساسية لعمل التطبيق.

عند بدء التطبيق، تُنفَّذ الشيفرة الموجودة في _App_. تستخدم هذه الشيفرة الخطاف [useState](https://react.dev/reference/react/useState) لإنشاء حالة التطبيق، مع ضبط قيمة أولية للمتغير _counter_.
يحتوي هذا المكوّن على مكوّن _Display_ — الذي يعرض قيمة العدّاد، 0 — وثلاثة مكوّنات _Button_. ولجميع الأزرار معالجات أحداث تُستخدم لتغيير حالة العدّاد.

عند النقر على أحد الأزرار، يُنفَّذ معالج الحدث. يغيّر معالج الحدث حالة مكوّن _App_ باستخدام الدالة _setCounter_.
**استدعاء دالة تغيّر الحالة يتسبب في إعادة عرض المكوّن.**

لذا، إذا نقر المستخدم على زر <i>plus</i>، يغيّر معالج حدث الزر قيمة _counter_ إلى 1، ويُعاد عرض مكوّن _App_.
ويؤدي هذا إلى إعادة عرض مكوّناته الفرعية _Display_ و_Button_ أيضاً.
يستقبل _Display_ القيمة الجديدة للعدّاد، 1، كـ props. وتستقبل مكوّنات _Button_ معالجات أحداث يمكن استخدامها لتغيير حالة العدّاد.

وللتأكد من فهم كيفية عمل البرنامج، لنضف إليه بعض عبارات _console.log_

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter) // highlight-line

  const increaseByOne = () => {
    console.log('increasing, value before', counter) // highlight-line
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 
    console.log('decreasing, value before', counter) // highlight-line
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter) // highlight-line
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
} 
```

لنرَ الآن ما يُطبع في وحدة التحكم عند الضغط على الأزرار plus وzero وminus:

![متصفح يعرض وحدة التحكم مع إبراز قيم العرض](../../images/1/31.webp)

لا تحاول أبداً تخمين ما تفعله شيفرتك. من الأفضل استخدام _console.log_ و<i>رؤية ما تفعله بعينيك</i>.

### إعادة هيكلة المكوّنات

المكوّن الذي يعرض قيمة العدّاد هو كما يلي:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

يستخدم المكوّن فقط الحقل _counter_ من <i>props</i> الخاصة به.
وهذا يعني أنه يمكننا تبسيط المكوّن باستخدام [التفكيك](/part1/component_state_event_handlers#destructuring)، هكذا:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

تحتوي الدالة التي تعرّف المكوّن على عبارة return فقط، لذا يمكننا تعريف الدالة باستخدام الصيغة الأكثر إيجازاً لدوال السهم:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

يمكننا تبسيط مكوّن Button أيضاً.

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

يمكننا استخدام التفكيك للحصول على الحقول المطلوبة فقط من <i>props</i>، واستخدام الصيغة الأكثر إيجازاً لدوال السهم:

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

تنجح هذه الطريقة لأن المكوّن يحتوي على عبارة return واحدة فقط، ما يجعل استخدام صيغة دالة السهم المختصرة ممكناً.

</div>
