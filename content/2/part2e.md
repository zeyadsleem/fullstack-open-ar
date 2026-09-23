---
mainImage: /images/part-2.svg
part: 2
letter: e
lang: ar
---

<div class="content">

مظهر تطبيق Notes الحالي لدينا متواضع تماماً. في [التمرين 0.2](/part0/fundamentals_of_web_apps#exercises-0-1-0-6)، كان المطلوب الاطلاع على [درس CSS](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics) من Mozilla.

لنلقِ نظرة على كيفية إضافة أنماط إلى تطبيق React. هناك عدة طرق مختلفة لفعل ذلك، وسنلقي نظرة على الطرق الأخرى لاحقاً. أولاً، سنضيف CSS إلى تطبيقنا بالطريقة القديمة؛ في ملف واحد دون استخدام [معالج CSS مسبق](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (رغم أن هذا ليس صحيحاً تماماً كما سنتعلم لاحقاً).

لنضف ملفاً جديداً <i>index.css</i> تحت مجلد <i>src</i> ثم نضيفه إلى التطبيق باستيراده في الملف <i>main.jsx</i>:

```js
import './index.css'
```

لنضف قاعدة CSS التالية إلى الملف <i>index.css</i>:

```css
h1 {
  color: green;
}
```

تتكوّن قواعد CSS من <i>محدّدات</i> و<i>تعريفات</i>. يحدّد المحدّد العناصر التي يجب تطبيق القاعدة عليها. المحدّد أعلاه هو <i>h1</i>، وسيطابق جميع وسوم العناوين <i>h1</i> في تطبيقنا.

يعيّن التعريف خاصية _color_ على القيمة <i>green</i>.

يمكن أن تحتوي قاعدة CSS واحدة على عدد غير محدود من الخصائص. لنعدّل القاعدة السابقة لجعل النص مائلاً، بتعريف نمط الخط كـ<i>italic</i>:

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

هناك طرق عديدة لمطابقة العناصر باستخدام [أنواع مختلفة من محدّدات CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

لو أردنا، على سبيل المثال، استهداف كل واحدة من الملاحظات بأنماطنا، لأمكننا استخدام المحدّد <i>li</i>، لأن جميع الملاحظات ملفوفة داخل وسوم <i>li</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

لنضف القاعدة التالية إلى ورقة الأنماط لدينا (بما أن معرفتي بتصميم الويب الأنيق تقترب من الصفر، فالأنماط لا معنى لها تقريباً):

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

استخدام أنواع العناصر لتعريف قواعد CSS مشكِل بعض الشيء. إذا احتوى تطبيقنا على وسوم <i>li</i> أخرى، فستُطبَّق عليها قاعدة النمط نفسها أيضاً.

إذا أردنا تطبيق نمطنا على الملاحظات تحديداً، فمن الأفضل استخدام [محدّدات الأصناف](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

في HTML العادي، تُعرَّف الأصناف كقيمة للخاصية <i>class</i>:

```html
<li class="note">some text...</li>
```

في React علينا استخدام خاصية [className](https://react.dev/learn#adding-styles) بدلاً من خاصية class. مع أخذ ذلك في الاعتبار، لنُجرِ التغييرات التالية على مكوّن <i>Note</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

تُعرَّف محدّدات الأصناف بالصيغة _.classname_:

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

إذا أضفت الآن عناصر <i>li</i> أخرى إلى التطبيق، فلن تتأثر بقاعدة النمط أعلاه.

### رسالة خطأ محسّنة

نفّذنا سابقاً رسالة الخطأ التي كانت تُعرض عندما يحاول المستخدم تبديل أهمية ملاحظة محذوفة باستخدام الدالة <em>alert</em>. لننفّذ رسالة الخطأ كمكوّن React خاص بها في الملف <i>src/components/Notification.jsx</i>.

المكوّن بسيط جداً:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default Notification
```

إذا كانت قيمة prop <em>message</em> هي <em>null</em>، فلا يُعرض شيء على الشاشة، وفي الحالات الأخرى تُعرض الرسالة داخل عنصر div.

لنضف قطعة حالة جديدة تُسمى <i>errorMessage</i> إلى مكوّن <i>App</i>. لنهيّئها برسالة خطأ ما حتى نتمكن من اختبار مكوّننا فوراً:

```js
import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification' // highlight-line

const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

ثم لنضف قاعدة نمط تناسب رسالة خطأ:

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

الآن أصبحنا مستعدين لإضافة المنطق الخاص بعرض رسالة الخطأ. لنغيّر الدالة <em>toggleImportanceOf</em> على النحو التالي:

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

عند حدوث الخطأ نضيف رسالة خطأ وصفية إلى حالة <em>errorMessage</em>. وفي الوقت نفسه نبدأ مؤقتاً يعيّن حالة <em>errorMessage</em> إلى <em>null</em> بعد خمس ثوانٍ.

تبدو النتيجة هكذا:

![لقطة شاشة من التطبيق لرسالة خطأ الإزالة من الخادم](../../images/2/26e.webp)

يمكن العثور على شيفرة الحالة الحالية لتطبيقنا في الفرع <i>part2-7</i> على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-7).

### الأنماط المضمّنة

يتيح React أيضاً كتابة الأنماط مباشرة في الشيفرة بما يُسمى [الأنماط المضمّنة](https://react-cn.github.io/react/tips/inline-styles.html).

الفكرة وراء تعريف الأنماط المضمّنة بسيطة للغاية. يمكن تزويد أي مكوّن أو عنصر React بمجموعة من خصائص CSS ككائن JavaScript عبر خاصية [style](https://react.dev/reference/react-dom/components/common#applying-css-styles).

تُعرَّف قواعد CSS في JavaScript بشكل مختلف قليلاً عمّا هي عليه في ملفات CSS العادية. لنفترض أننا أردنا إعطاء بعض العناصر اللون الأخضر وخطاً مائلاً. في CSS سيبدو الأمر هكذا:

```css
{
  color: green;
  font-style: italic;
}
```

لكن ككائن نمط مضمّن في React سيبدو هكذا:

```js
{
  color: 'green',
  fontStyle: 'italic'
}
```

تُعرَّف كل خاصية CSS كخاصية منفصلة في كائن JavaScript. ويمكن ببساطة تعريف القيم الرقمية للبكسلات كأعداد صحيحة. ومن أبرز الفروق مقارنة بـCSS العادي أن خصائص CSS الموصولة بشرطات (kebab case) تُكتب بصيغة camelCase.

لنضف مكوّن تذييل، <i>Footer</i>، إلى تطبيقنا ونعرّف له أنماطاً مضمّنة. يُعرَّف المكوّن في الملف _components/Footer.jsx_ ويُستخدم في الملف _App.jsx_ كما يلي:

```js
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic'
  }

  return (
    <div style={footerStyle}>
      <br />
      <p>
        Note app, Department of Computer Science, University of Helsinki 2025
      </p>
    </div>
  )
}

export default Footer
```

```js
import { useState, useEffect } from 'react'
import Footer from './components/Footer' // highlight-line
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer /> // highlight-line
    </div>
  )
}
```

تأتي الأنماط المضمّنة بقيود معينة. فعلى سبيل المثال، لا يمكن استخدام ما يُسمى [الحالات الزائفة](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) (pseudo-classes) بشكل مباشر.

تتعارض الأنماط المضمّنة وبعض الطرق الأخرى لإضافة الأنماط إلى مكوّنات React تماماً مع الأعراف القديمة. فتقليدياً، كان يُعتبر من أفضل الممارسات الفصل التام بين CSS والمحتوى (HTML) والوظائف (JavaScript). ووفقاً لهذه المدرسة الأقدم في التفكير، كان الهدف كتابة CSS وHTML وJavaScript في ملفاتها المنفصلة.

فلسفة React في الواقع هي النقيض التام لهذا. ولأن فصل CSS وHTML وJavaScript في ملفات منفصلة لم يبدُ قابلاً للتوسع جيداً في التطبيقات الأكبر، يبني React تقسيم التطبيق على أساس كياناته الوظيفية المنطقية.

الوحدات البنيوية التي تتكوّن منها الكيانات الوظيفية للتطبيق هي مكوّنات React. يعرّف مكوّن React الـHTML اللازم لهيكلة المحتوى، ودوال JavaScript اللازمة لتحديد الوظائف، وكذلك أنماط المكوّن؛ كل ذلك في مكان واحد. والهدف من ذلك إنشاء مكوّنات فردية مستقلة وقابلة لإعادة الاستخدام قدر الإمكان.

يمكن العثور على شيفرة النسخة النهائية لتطبيقنا في الفرع <i>part2-8</i> على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-8).

</div>

<div class="tasks">

<h3>تمارين 2.16.-2.17.</h3>

<h4>2.16: دليل الهاتف الخطوة 11</h4>

استخدم مثال [رسالة الخطأ المحسّنة](/part2/adding_styles_to_react_app#improved-error-message) من الجزء 2 كدليل لعرض إشعار يستمر بضع ثوانٍ بعد تنفيذ عملية ناجحة (إضافة شخص أو تغيير رقم):

![لقطة شاشة لإضافة ناجحة باللون الأخضر](../../images/2/27e.webp)

<h4>2.17*: دليل الهاتف الخطوة 12</h4>

افتح تطبيقك في متصفحين. **إذا حذفت شخصاً في المتصفح 1** قبل فترة وجيزة من محاولة <i>تغيير رقم هاتف الشخص</i> في المتصفح 2، فستحصل على رسائل الخطأ التالية:

![رسالة خطأ 404 not found عند التغيير من متصفحات متعددة](../../images/2/29b.webp)

أصلح المشكلة وفقاً للمثال المعروض في [الوعود والأخطاء](/part2/altering_data_in_server#promises-and-errors) في الجزء 2. عدّل المثال بحيث تُعرض للمستخدم رسالة عندما لا تنجح العملية. يجب أن تبدو الرسائل المعروضة للأحداث الناجحة وغير الناجحة مختلفة:

![رسالة الخطأ تُعرض على الشاشة بدلاً من وحدة التحكم](../../images/2/28e.webp)

**ملاحظة** أنه حتى لو تعاملت مع الاستثناء، فستظل رسالة الخطأ الأولى "404" تُطبع في وحدة التحكم. لكن يجب ألا ترى "Uncaught (in promise) Error".

</div>

<div class="content">

### بضع ملاحظات مهمة

في نهاية هذا الجزء هناك بضعة تمارين أكثر تحدياً. في هذه المرحلة، يمكنك تخطي التمارين إذا كانت مرهقة أكثر من اللازم، وسنعود إلى الموضوعات نفسها لاحقاً. وتستحق المادة القراءة في كل الأحوال.

فعلنا شيئاً واحداً في تطبيقنا يخفي مصدراً نموذجياً جداً للأخطاء.

عيّنّا الحالة _notes_ بقيمة أولية هي مصفوفة فارغة:

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

هذه قيمة أولية طبيعية جداً لأن الملاحظات مجموعة، أي أن هناك ملاحظات كثيرة ستخزّنها الحالة.

لو كانت الحالة تخزّن "شيئاً واحداً" فقط، لكانت القيمة الأولية الأنسب هي _null_ للدلالة على أنه <i>لا يوجد شيء</i> في الحالة في البداية. لنرَ ما يحدث إذا استخدمنا هذه القيمة الأولية:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

ينهار التطبيق:

![خطأ نوعي في وحدة التحكم: لا يمكن قراءة خصائص null عبر map من App](../../images/2/31a.webp)

تعطي رسالة الخطأ سبب الخطأ وموقعه. الشيفرة التي تسبّبت في المشكلات هي التالية:

```js
  // تحصل notesToShow على قيمة notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // ...

  {notesToShow.map(note =>  // highlight-line
    <Note key={note.id} note={note} />
  )}
```

رسالة الخطأ هي

```bash
Cannot read properties of null (reading 'map')
```

يُسند إلى المتغير _notesToShow_ أولاً قيمة الحالة _notes_ ثم تحاول الشيفرة استدعاء الدالة _map_ على كائن غير موجود، أي على _null_.

ما السبب في ذلك؟

يستخدم خطاف التأثير الدالة _setNotes_ لتعيين _notes_ إلى الملاحظات التي تعيدها الواجهة الخلفية:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

لكن المشكلة أن التأثير لا يُنفَّذ إلا <i>بعد العرض الأول</i>.
ولأن قيمة _notes_ الأولية هي null:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

ففي العرض الأول تُنفَّذ الشيفرة التالية:

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

وهذا يفجّر التطبيق لأننا لا نستطيع استدعاء الدالة _map_ على القيمة _null_.

عندما نعيّن _notes_ لتكون في البداية مصفوفة فارغة، لا يحدث خطأ لأنه يُسمح باستدعاء _map_ على مصفوفة فارغة.

إذن، فقد "أخفت" تهيئة الحالة المشكلة الناتجة عن أن البيانات لم تُجلب بعد من الواجهة الخلفية.

طريقة أخرى للتحايل على المشكلة هي استخدام <i>العرض الشرطي</i> وإرجاع null إذا لم تكن حالة المكوّن مهيّأة بشكل صحيح:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line
  // ... 

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // لا تعرض أي شيء إذا كانت notes ما زالت null
  // highlight-start
  if (!notes) { 
    return null 
  }
  // highlight-end

  // ...
} 
```

إذن في العرض الأول لا يُعرض شيء. وعندما تصل الملاحظات من الواجهة الخلفية، استخدم التأثير الدالة _setNotes_ لتعيين قيمة الحالة _notes_. وهذا يؤدي إلى إعادة عرض المكوّن، وفي العرض الثاني تُعرض الملاحظات على الشاشة.

الطريقة القائمة على العرض الشرطي مناسبة في الحالات التي يستحيل فيها تعريف الحالة بحيث يكون العرض الأول ممكناً.

الأمر الآخر الذي ما زلنا بحاجة إلى إلقاء نظرة أدق عليه هو المعامل الثاني لـuseEffect:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  
      })
  }, []) // highlight-line
```

يُستخدم المعامل الثاني لـ<em>useEffect</em> [لتحديد عدد مرات تنفيذ التأثير](https://react.dev/reference/react/useEffect#parameters). والمبدأ هو أن التأثير يُنفَّذ دائماً بعد العرض الأول للمكوّن <i>و</i>عندما تتغيّر قيمة المعامل الثاني.

إذا كان المعامل الثاني مصفوفة فارغة <em>[]</em>، فلن يتغيّر محتواها أبداً ولن يُنفَّذ التأثير إلا بعد العرض الأول للمكوّن. وهذا بالضبط ما نريده عندما نهيّئ حالة التطبيق من الخادم.

ومع ذلك، هناك حالات نريد فيها تنفيذ التأثير في أوقات أخرى، مثل عندما تتغيّر حالة المكوّن بطريقة معينة.

تأمّل التطبيق البسيط التالي للاستعلام عن أسعار صرف العملات من [واجهة أسعار الصرف](https://www.exchangerate-api.com/):

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // تخطَّ إذا لم تكن العملة معرّفة
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>
    </div>
  )
}

export default App
```

تحتوي واجهة مستخدم التطبيق على نموذج يُكتب في حقل إدخاله اسم العملة المطلوبة. وإذا كانت العملة موجودة، يعرض التطبيق أسعار صرفها مقابل العملات الأخرى:

![المتصفح يعرض أسعار صرف العملات مع كتابة eur ووحدة التحكم تقول fetching exchange rates](../../images/2/32new.webp)

يعيّن التطبيق اسم العملة المُدخَل في النموذج إلى الحالة _currency_ في لحظة الضغط على الزر.

وعندما تحصل _currency_ على قيمة جديدة، يجلب التطبيق أسعار صرفها من الـAPI في دالة التأثير:

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // تخطَّ إذا لم تكن العملة معرّفة
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency]) // highlight-line
  // ...
}
```

أصبح لخطاف useEffect الآن _[currency]_ كمعامل ثانٍ. لذلك تُنفَّذ دالة التأثير بعد العرض الأول، و<i>دائماً</i> عندما تتغيّر مصفوفة الاعتماديات _[currency]_ بوصفها معامله الثاني. أي أنه عندما تحصل الحالة _currency_ على قيمة جديدة، يتغيّر محتوى مصفوفة الاعتماديات وتُنفَّذ دالة التأثير.

من الطبيعي اختيار _null_ كقيمة أولية للمتغير _currency_، لأن _currency_ يمثل عنصراً واحداً. وتشير القيمة الأولية _null_ إلى أنه لا يوجد شيء في الحالة بعد، كما يسهل التحقق بجملة if بسيطة مما إذا كانت قيمة قد أُسندت إلى المتغير. وللتأثير الشرط التالي

```js
if (currency) { 
  // تُجلب أسعار الصرف
}
```

وهو ما يمنع طلب أسعار الصرف مباشرة بعد العرض الأول عندما لا يزال المتغير _currency_ يحمل القيمة الأولية، أي قيمة _null_.

فإذا كتب المستخدم مثلاً <i>eur</i> في حقل البحث، يستخدم التطبيق Axios لتنفيذ طلب HTTP GET إلى العنوان <https://open.er-api.com/v6/latest/eur> ويخزّن الاستجابة في حالة _rates_.

وعندما يُدخل المستخدم بعد ذلك قيمة أخرى في حقل البحث، مثلاً <i>usd</i>، تُنفَّذ دالة التأثير مرة أخرى وتُطلب أسعار صرف العملة الجديدة من الـAPI.

قد تبدو الطريقة المعروضة هنا لتنفيذ طلبات API غريبة بعض الشيء.
كان يمكن بناء هذا التطبيق تحديداً دون استخدام useEffect إطلاقاً، بتنفيذ طلبات API مباشرة في دالة معالج إرسال النموذج:

```js
  const onSearch = (event) => {
    event.preventDefault()
    axios
      .get(`https://open.er-api.com/v6/latest/${value}`)
      .then(response => {
        setRates(response.data.rates)
      })
  }
```

ومع ذلك، هناك حالات لا تنجح فيها تلك التقنية. فعلى سبيل المثال، <i>قد</i> تصادف إحدى هذه الحالات في التمرين 2.20 حيث قد يوفّر استخدام useEffect حلاً. لاحظ أن هذا يعتمد إلى حد كبير على النهج الذي اخترته، فمثلاً لا يستخدم الحل النموذجي هذه الحيلة.

</div>

<div class="tasks">

<h3>تمارين 2.18.-2.20.</h3>

<h4>2.18* بيانات الدول، الخطوة 1</h4>

على [https://studies.cs.helsinki.fi/restcountries/](https://studies.cs.helsinki.fi/restcountries/) يمكنك العثور على خدمة تقدّم الكثير من المعلومات المتعلقة بمختلف الدول بصيغة تُسمى قابلة للقراءة آلياً عبر REST API. اصنع تطبيقاً يتيح لك عرض معلومات من دول مختلفة.

واجهة المستخدم بسيطة جداً. تُعثر على الدولة المطلوب عرضها بكتابة استعلام بحث في حقل البحث.

إذا كانت هناك دول كثيرة جداً (أكثر من 10) تطابق الاستعلام، فيُطلب من المستخدم جعل استعلامه أكثر تحديداً:

![لقطة شاشة: نتائج مطابقة كثيرة جداً](../../images/2/19b1.webp)

إذا كانت هناك عشر دول أو أقل، ولكن أكثر من واحدة، فتُعرض جميع الدول المطابقة للاستعلام:

![لقطة شاشة للدول المطابقة في قائمة](../../images/2/19b2.webp)

وعندما تكون هناك دولة واحدة فقط مطابقة للاستعلام، تُعرض البيانات الأساسية للدولة (مثل العاصمة والمساحة) وعلمها واللغات المتحدث بها:

![لقطة شاشة للعلم والخصائص الإضافية](../../images/2/19c3.webp)

**ملاحظة**: يكفي أن يعمل تطبيقك مع معظم الدول. قد يكون دعم بعض الدول، مثل <i>السودان</i>، صعباً لأن اسم الدولة جزء من اسم دولة أخرى، <i>جنوب السودان</i>. لا تحتاج إلى القلق بشأن هذه الحالات الحدّية.

<h4>2.19*: بيانات الدول، الخطوة 2</h4>

**لا يزال هناك الكثير لفعله في هذا الجزء، فلا تعلق في هذا التمرين!**

حسّن التطبيق من التمرين السابق بحيث تكون هناك، عندما تُعرض أسماء عدة دول على الصفحة، أزرار بجانب اسم كل دولة تُظهر عند الضغط عليها الواجهة الخاصة بتلك الدولة:

![إضافة أزرار عرض لكل دولة](../../images/2/19b4.webp)

في هذا التمرين أيضاً، يكفي أن يعمل تطبيقك مع معظم الدول. ويمكن تجاهل الدول التي يظهر اسمها داخل اسم دولة أخرى، مثل <i>السودان</i>.

<h4>2.20*: بيانات الدول، الخطوة 3</h4>

أضف إلى الواجهة التي تعرض بيانات دولة واحدة تقرير الطقس الخاص بعاصمة تلك الدولة. هناك عشرات مزوّدي بيانات الطقس. أحد الـAPIs المقترحة هو [https://openweathermap.org](https://openweathermap.org). لاحظ أنه قد يستغرق الأمر بضع دقائق حتى يصبح مفتاح API المُولَّد صالحاً.

![إضافة تقرير الطقس](../../images/2/19x.webp)

إذا استخدمت Open weather map، ف[هنا](https://openweathermap.org/weather-conditions#Icon-list) وصف لكيفية الحصول على أيقونات الطقس.

**ملاحظة:** في بعض المتصفحات (مثل Firefox) قد يرسل الـAPI المختار استجابة خطأ تشير إلى أن تشفير HTTPS غير مدعوم، رغم أن رابط الطلب يبدأ بـ_http://_. يمكن إصلاح هذه المشكلة بإكمال التمرين باستخدام Chrome.

**ملاحظة:** تحتاج إلى مفتاح api-key لاستخدام أي خدمة طقس تقريباً. لا تحفظ مفتاح api-key في نظام التحكم بالإصدارات! ولا تكتبه مباشرة في شيفرتك المصدرية. بدلاً من ذلك استخدم [متغير بيئة](https://vitejs.dev/guide/env-and-mode.html) لحفظ المفتاح في هذا التمرين. في التطبيقات الواقعية، يُعتبر إرسال هذه المفاتيح مباشرة من المتصفح غير آمن، لأن أي شخص يستطيع فتح وحدة تحكم المطوّر سيتمكن من اعتراض مفاتيحك! سنركز على تنفيذ واجهة خلفية منفصلة في الجزء التالي من الدورة.

بافتراض أن مفتاح api-key هو <i>54l41n3n4v41m34rv0</i>، فعند بدء التطبيق هكذا:

```bash
export VITE_SOME_KEY=54l41n3n4v41m34rv0 && npm run dev // لنظام Linux/macOS Bash
($env:VITE_SOME_KEY="54l41n3n4v41m34rv0") -and (npm run dev) // لنظام Windows PowerShell
set "VITE_SOME_KEY=54l41n3n4v41m34rv0" && npm run dev // لنظام Windows cmd.exe
```

يمكنك الوصول إلى قيمة المفتاح من الكائن _import.meta.env_:

```js
const api_key = import.meta.env.VITE_SOME_KEY
// المتغير api_key يحمل الآن القيمة المعيّنة عند بدء التشغيل
```

**ملاحظة:** لمنع تسريب متغيرات البيئة إلى العميل عن طريق الخطأ، لا يُعرَض لـVite إلا المتغيرات المسبوقة بـVITE_.

وتذكّر أيضاً أنه إذا أجريت تغييرات على متغيرات البيئة، فستحتاج إلى إعادة تشغيل خادم التطوير حتى تسري التغييرات.

كان هذا آخر تمرين في هذا الجزء من الدورة. حان وقت رفع شيفرتك إلى GitHub وتعليم جميع تمارينك المنجزة في [نظام تسليم التمارين](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
