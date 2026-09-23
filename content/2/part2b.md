---
mainImage: /images/part-2.svg
part: 2
letter: b
lang: ar
---

<div class="content">

لنواصل توسيع تطبيقنا بالسماح للمستخدمين بإضافة ملاحظات جديدة. يمكنك العثور على شيفرة تطبيقنا الحالي [هنا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1).

### حفظ الملاحظات في حالة المكوّن

لكي تتحدّث صفحتنا عند إضافة ملاحظات جديدة، من الأفضل تخزين الملاحظات في حالة المكوّن <i>App</i>. لنستورد الدالة [useState](https://react.dev/reference/react/useState) ونستخدمها لتعريف قطعة حالة تُهيَّأ بمصفوفة الملاحظات الأولية الممرَّرة في props.

```js
import { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

يستخدم المكوّن الدالة <em>useState</em> لتهيئة قطعة الحالة المخزَّنة في <em>notes</em> بمصفوفة الملاحظات الممرَّرة في props:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```

يمكننا أيضاً استخدام React Developer Tools لنرى أن هذا يحدث فعلاً:

![المتصفح يعرض نافذة React developer tools](../../images/2/30.webp)

إذا أردنا البدء بقائمة ملاحظات فارغة، فسنضبط القيمة الأولية كمصفوفة فارغة، ولأن props لن تُستخدم، يمكننا حذف الوسيط <em>props</em> من تعريف الدالة:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```

لنبقَ على القيمة الأولية الممرَّرة في props في الوقت الحالي.

بعد ذلك، لنضف إلى المكوّن [نموذج](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) HTML يُستخدم لإضافة ملاحظات جديدة.

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start 
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end   

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start 
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
      // highlight-end   
    </div>
  )
}
```

أضفنا الدالة _addNote_ كمعالج أحداث إلى عنصر النموذج، وستُستدعى عند إرسال النموذج بالنقر على زر الإرسال.

نستخدم الطريقة التي ناقشناها في [الجزء 1](/part1/component_state_event_handlers#event-handling) لتعريف معالج الأحداث:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

الوسيط <em>event</em> هو [الحدث](https://react.dev/learn/responding-to-events) الذي يُطلق استدعاء دالة معالج الأحداث:

يستدعي معالج الأحداث فوراً الدالة <em>event.preventDefault()</em>، التي تمنع الإجراء الافتراضي لإرسال النموذج. وكان الإجراء الافتراضي سيؤدي، [من بين أمور أخرى](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)، إلى إعادة تحميل الصفحة.

يُسجَّل هدف الحدث المخزَّن في _event.target_ في وحدة التحكم:

![زر نُقر مع كائن النموذج في وحدة التحكم](../../images/2/6e.webp)

الهدف في هذه الحالة هو النموذج الذي عرّفناه في مكوّننا.

كيف نصل إلى البيانات الموجودة في عنصر <i>input</i> الخاص بالنموذج؟

### المكوّن المتحكَّم به

هناك طرق عديدة لتحقيق ذلك؛ أول طريقة سنلقي عليها نظرة هي استخدام ما يسمى [المكوّنات المتحكَّم بها](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) (controlled components).

لنضف قطعة حالة جديدة تسمى <em>newNote</em> لتخزين إدخال المستخدم **و**لنضبطها كخاصية <i>value</i> لعنصر <i>input</i>:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

يظهر النص البديل المخزَّن كقيمة أولية للحالة <em>newNote</em> في عنصر <i>input</i>، لكن نص الإدخال لا يمكن تحريره. وتعرض وحدة التحكم تحذيراً يعطينا فكرة عما قد يكون الخطأ:

![خطأ في وحدة التحكم عن تمرير قيمة إلى خاصية دون onchange](../../images/2/7e.webp)

بما أننا أسندنا قطعة من حالة المكوّن <i>App</i> كخاصية <i>value</i> لعنصر الإدخال، فإن المكوّن <i>App</i> الآن [يتحكم](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) في سلوك عنصر الإدخال.

لتمكين تحرير عنصر الإدخال، علينا تسجيل <i>معالج أحداث</i> يزامن التغييرات التي تطرأ على الإدخال مع حالة المكوّن:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

سجّلنا الآن معالج أحداث على الخاصية <i>onChange</i> لعنصر <i>input</i> في النموذج:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

يُستدعى معالج الأحداث في كل مرة <i>يحدث فيها تغيير في عنصر الإدخال</i>. وتستقبل دالة معالج الأحداث كائن الحدث كوسيط <em>event</em> لها:

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

تشير خاصية <em>target</em> في كائن الحدث الآن إلى عنصر <i>input</i> المتحكَّم به، ويعبّر <em>event.target.value</em> عن قيمة الإدخال في ذلك العنصر.

لاحظ أننا لم نحتج إلى استدعاء الدالة _event.preventDefault()_ كما فعلنا في معالج الأحداث <i>onSubmit</i>. ذلك لأن أي إجراء افتراضي لا يحدث عند تغيير الإدخال، بخلاف إرسال النموذج.

يمكنك المتابعة في وحدة التحكم لترى كيف يُستدعى معالج الأحداث:

![استدعاءات متعددة في وحدة التحكم مع كتابة نص](../../images/2/8e.webp)

هل تذكّرت تثبيت [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)، أليس كذلك؟ جيد. يمكنك مشاهدة كيفية تغيّر الحالة مباشرةً من تبويب React Devtools:

![تغييرات الحالة في React devtools تُظهر الكتابة أيضاً](../../images/2/9ea.webp)

الآن تعكس حالة <em>newNote</em> في المكوّن <i>App</i> القيمة الحالية للإدخال، ما يعني أننا نستطيع إكمال الدالة <em>addNote</em> لإنشاء ملاحظات جديدة:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: String(notes.length + 1),
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

أولاً، ننشئ كائناً جديداً للملاحظة يسمى <em>noteObject</em> يستقبل محتواه من الحالة <em>newNote</em> في المكوّن. ويُولَّد المعرّف الفريد <i>id</i> بناءً على العدد الإجمالي للملاحظات. هذه الطريقة تصلح لتطبيقنا لأن الملاحظات لا تُحذف أبداً. وبمساعدة الدالة <em>Math.random()</em>، يكون لملاحظتنا احتمال 50% أن تُعلَّم كمهمة.

تُضاف الملاحظة الجديدة إلى قائمة الملاحظات باستخدام دالة المصفوفة [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)، التي قدّمناها في [الجزء 1](/part1/java_script#arrays):

```js
setNotes(notes.concat(noteObject))
```

لا تعدّل الدالة مصفوفة <em>notes</em> الأصلية، بل تنشئ <i>نسخة جديدة من المصفوفة مع إضافة العنصر الجديد إلى نهايتها</i>. هذا مهم لأننا يجب أن [لا نعدّل الحالة مباشرة أبداً](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) في React!

يعيد معالج الأحداث أيضاً ضبط قيمة عنصر الإدخال المتحكَّم به باستدعاء الدالة <em>setNewNote</em> الخاصة بالحالة <em>newNote</em>:

```js
setNewNote('')
```

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في الفرع <i>part2-2</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-2).

### تصفية العناصر المعروضة

لنضف بعض الوظائف الجديدة إلى تطبيقنا تتيح لنا عرض الملاحظات المهمة فقط.

لنضف قطعة حالة إلى المكوّن <i>App</i> تتبّع الملاحظات التي ينبغي عرضها:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

لنغيّر المكوّن بحيث يخزّن قائمة بكل الملاحظات المعروضة في المتغير <em>notesToShow</em>. وتعتمد عناصر القائمة على حالة المكوّن:

```js
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

تعريف المتغير <em>notesToShow</em> مختصر جداً:

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

يستخدم التعريف [المعامل الشرطي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) الموجود أيضاً في كثير من لغات البرمجة الأخرى.

يعمل المعامل كما يلي. إذا كان لدينا:

```js
const result = condition ? val1 : val2
```

فستُضبط قيمة المتغير <em>result</em> على قيمة <em>val1</em> إذا كانت <em>condition</em> صحيحة. وإذا كانت <em>condition</em> خاطئة، فستُضبط قيمة المتغير <em>result</em> على قيمة <em>val2</em>.

إذا كانت قيمة <em>showAll</em> خاطئة، فسيُسند إلى المتغير <em>notesToShow</em> نص بقائمة تحتوي فقط على الملاحظات التي تكون خاصية <em>important</em> فيها مضبوطة على true. وتُنجز التصفية بمساعدة دالة المصفوفة [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):

```js
notes.filter(note => note.important === true)
```

معامل المقارنة زائد عن الحاجة، لأن قيمة <em>note.important</em> هي إما <i>true</i> أو <i>false</i>، ما يعني أنه يمكننا ببساطة كتابة:

```js
notes.filter(note => note.important)
```

أظهرنا معامل المقارنة أولاً للتأكيد على تفصيل مهم: في JavaScript لا يعمل <em>val1 == val2</em> دائماً كما هو متوقع. لذلك من الأكثر أماناً عند إجراء المقارنات استخدام <em>val1 === val2</em> حصراً. يمكنك القراءة أكثر عن الموضوع [هنا](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

يمكنك تجربة وظيفة التصفية بتغيير القيمة الأولية للحالة <em>showAll</em>.

بعد ذلك، لنضف وظيفة تتيح للمستخدمين تبديل الحالة <em>showAll</em> للتطبيق من واجهة المستخدم.

التغييرات ذات الصلة معروضة أدناه:

```js
import { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
// highlight-start      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
// highlight-end            
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...    
    </div>
  )
}
```

تتحكم الملاحظات المعروضة (الكل مقابل المهمة) بزر. ومعالج الأحداث الخاص بالزر بسيط لدرجة أنه عُرّف مباشرة في خاصية عنصر الزر. يبدّل معالج الأحداث قيمة _showAll_ من true إلى false والعكس:

```js
() => setShowAll(!showAll)
```

يعتمد نص الزر على قيمة الحالة <em>showAll</em>:

```js
show {showAll ? 'important' : 'all'}
```

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في الفرع <i>part2-3</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-3).
</div>

<div class="tasks">

<h3>تمارين 2.6.-2.10.</h3>

في التمرين الأول، سنبدأ العمل على تطبيق سيُطوَّر أكثر في التمارين اللاحقة. في مجموعات التمارين المترابطة، يكفي إعادة النسخة النهائية من تطبيقك. ويمكنك أيضاً عمل commit منفصل بعد إنهاء كل جزء من مجموعة التمارين، لكن ذلك غير مطلوب.

<h4>2.6: دفتر الهاتف الخطوة 1</h4>

لننشئ دفتر هاتف بسيطاً. <i>**في هذا الجزء، سنضيف أسماءً فقط إلى دفتر الهاتف.**</i>

لنبدأ بتنفيذ إضافة شخص إلى دفتر الهاتف.

يمكنك استخدام الشيفرة أدناه كنقطة انطلاق للمكوّن <i>App</i> في تطبيقك:

```js
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
```

الحالة <em>newName</em> مخصصة للتحكم بعنصر الإدخال في النموذج.

أحياناً يكون من المفيد عرض الحالة والمتغيرات الأخرى كنص لأغراض تصحيح الأخطاء. يمكنك مؤقتاً إضافة العنصر التالي إلى المكوّن المعروض:

```html
<div>debug: {newName}</div>
```

من المهم أيضاً الاستفادة جيداً مما تعلمناه في فصل [تصحيح أخطاء تطبيقات React](/part1/a_more_complex_state_debugging_react_apps) من الجزء الأول. إن إضافة [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) <i>مفيدة للغاية</i> لتتبع التغييرات التي تطرأ على حالة التطبيق.

بعد إنهاء هذا التمرين، ينبغي أن يبدو تطبيقك شيئاً مثل هذا:

![لقطة شاشة للتمرين 2.6 مكتملاً](../../images/2/10e.webp)

لاحظ استخدام إضافة React developer tools في الصورة أعلاه!

**ملاحظة:**

- يمكنك استخدام اسم الشخص كقيمة لخاصية <i>key</i>
- تذكّر منع الإجراء الافتراضي لإرسال نماذج HTML!

<h4>2.7: دفتر الهاتف الخطوة 2</h4>

امنع المستخدم من إضافة أسماء موجودة مسبقاً في دفتر الهاتف. تمتلك مصفوفات JavaScript دوال [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) عديدة مناسبة لإنجاز هذه المهمة. ضع في اعتبارك [كيفية عمل مساواة الكائنات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) في JavaScript.

أصدر تحذيراً بالأمر [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) عند محاولة كهذه:

![تنبيه في المتصفح: المستخدم موجود مسبقاً في دفتر الهاتف](../../images/2/11e.webp)

**تلميح:** عندما تشكّل نصوصاً تحتوي قيماً من متغيرات، يُوصى باستخدام [نص قالب](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (template string):

```js
`${newName} is already added to phonebook`
```

إذا كان المتغير <em>newName</em> يحمل القيمة <i>Arto Hellas</i>، فسيعيد تعبير نص القالب النص

```js
`Arto Hellas is already added to phonebook`
```

ويمكن فعل الشيء نفسه على طريقة Java أكثر باستخدام معامل الجمع:

```js
newName + ' is already added to phonebook'
```

استخدام نصوص القوالب هو الخيار الأكثر أصالةً وعلامة على مبرمج JavaScript حقيقي.

<h4>2.8: دفتر الهاتف الخطوة 3</h4>

وسّع تطبيقك بالسماح للمستخدمين بإضافة أرقام هواتف إلى دفتر الهاتف. ستحتاج إلى إضافة عنصر <i>input</i> ثانٍ إلى النموذج (مع معالج أحداث خاص به):

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

عند هذه النقطة، قد يبدو التطبيق شيئاً مثل هذا. تعرض الصورة أيضاً حالة التطبيق بمساعدة [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):

![لقطة شاشة نموذجية للتمرين 2.8](../../images/2/12e.webp)

<h4>2.9*: دفتر الهاتف الخطوة 4</h4>

نفّذ حقل بحث يمكن استخدامه لتصفية قائمة الأشخاص بالاسم:

![حقل بحث التمرين 2.9](../../images/2/13e.webp)

يمكنك تنفيذ حقل البحث كعنصر <i>input</i> يوضع خارج نموذج HTML. منطق التصفية الظاهر في الصورة <i>غير حساس لحالة الأحرف</i>، أي أن مصطلح البحث <i>arto</i> يعيد أيضاً نتائج تحتوي على Arto بحرف A كبير.

**ملاحظة:** عند العمل على وظيفة جديدة، غالباً ما يكون من المفيد «تثبيت» بعض البيانات الوهمية مباشرة في تطبيقك، مثل

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // ...
}
```

يوفر عليك هذا عناء إدخال البيانات يدوياً في تطبيقك لتجربة وظيفتك الجديدة.

<h4>2.10: دفتر الهاتف الخطوة 5</h4>

إذا نفّذت تطبيقك في مكوّن واحد، فأعد هيكلته باستخراج أجزاء مناسبة إلى مكوّنات جديدة. أبقِ حالة التطبيق وكل معالجات الأحداث في المكوّن الجذري <i>App</i>.

يكفي استخراج <i>**ثلاثة**</i> مكوّنات من التطبيق. ومن المرشحين الجيدين كمكوّنات منفصلة، مثلاً، مرشّح البحث، ونموذج إضافة أشخاص جدد إلى دفتر الهاتف، ومكوّن يعرض كل الأشخاص من دفتر الهاتف، ومكوّن يعرض تفاصيل شخص واحد.

قد يبدو المكوّن الجذري للتطبيق مشابهاً لهذا بعد إعادة الهيكلة. المكوّن الجذري المعاد هيكلته أدناه يعرض العناوين فقط ويترك للمكوّنات المستخرجة الاهتمام بالباقي.

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

**ملاحظة**: قد تواجه مشكلات في هذا التمرين إذا عرّفت مكوّناتك «في المكان الخاطئ». والآن وقت مناسب لمراجعة فصل [لا تعرّف مكوّناً داخل مكوّن آخر](/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components) من الجزء السابق.

</div>
