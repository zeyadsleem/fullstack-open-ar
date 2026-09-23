---
mainImage: /images/part-2.svg
part: 2
letter: d
lang: ar
---

<div class="content">

عند إنشاء الملاحظات في تطبيقنا، سنرغب بطبيعة الحال في تخزينها في خادم خلفي ما. تدّعي حزمة [json-server](https://github.com/typicode/json-server) في توثيقها أنها ما يُسمى واجهة REST أو RESTful API:

> <i>احصل على واجهة REST وهمية كاملة دون كتابة أي شيفرة في أقل من 30 ثانية (بجد)</i>

لا يطابق json-server تماماً الوصف الوارد في [التعريف](https://en.wikipedia.org/wiki/Representational_state_transfer) الأكاديمي لواجهة REST API، لكن هذا ينطبق أيضاً على معظم الواجهات الأخرى التي تدّعي أنها RESTful.

سنلقي نظرة أقرب على REST في [الجزء التالي](/part3) من الدورة. لكن من المهم أن نتعرّف في هذه المرحلة على بعض [الأعراف](https://en.wikipedia.org/wiki/REST#Applied_to_web_services) التي يستخدمها json-server وواجهات REST API عموماً. وسننظر تحديداً في الاستخدام التقليدي لـ[المسارات](https://github.com/typicode/json-server#routes)، أي عناوين URL وأنواع طلبات HTTP، في REST.

### REST

في مصطلحات REST، نشير إلى كائنات البيانات الفردية، مثل الملاحظات في تطبيقنا، باسم <i>الموارد</i>. ولكل مورد عنوان فريد مرتبط به — عنوان URL الخاص به. ووفقاً لعُرف عام يستخدمه json-server، يمكننا تحديد موقع ملاحظة فردية عند عنوان المورد <i>notes/3</i>، حيث 3 هو معرّف المورد. أما عنوان <i>notes</i> فيشير إلى مجموعة موارد تحتوي على جميع الملاحظات.

تُجلب الموارد من الخادم عبر طلبات HTTP GET. فمثلاً، طلب HTTP GET إلى عنوان <i>notes/3</i> سيعيد الملاحظة ذات المعرّف رقم 3. وطلب HTTP GET إلى عنوان <i>notes</i> سيعيد قائمة بجميع الملاحظات.

ويتم إنشاء مورد جديد لتخزين ملاحظة عبر إرسال طلب HTTP POST إلى عنوان <i>notes</i> وفقاً لعُرف REST الذي يلتزم به json-server. وتُرسَل بيانات مورد الملاحظة الجديد في <i>جسم</i> الطلب.

يتطلب json-server إرسال جميع البيانات بصيغة JSON. ويعني هذا عملياً أن تكون البيانات نصاً منسّقاً بشكل صحيح، وأن يحتوي الطلب على ترويسة الطلب <i>Content-Type</i> بالقيمة <i>application/json</i>.

### إرسال البيانات إلى الخادم

لنُجرِ التغييرات التالية على معالج الحدث المسؤول عن إنشاء ملاحظة جديدة:

```js
const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
  }

// highlight-start
  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
// highlight-end
}
```

ننشئ كائناً جديداً للملاحظة لكننا نحذف خاصية <i>id</i> لأن من الأفضل أن نترك للخادم توليد المعرّفات لمواردنا.

يُرسَل الكائن إلى الخادم باستخدام طريقة <em>post</em> في axios. ويسجّل معالج الحدث المُسجَّل الاستجابةَ العائدة من الخادم في وحدة التحكم.

عندما نحاول إنشاء ملاحظة جديدة، يظهر الناتج التالي في وحدة التحكم:

![ناتج بيانات JSON في وحدة التحكم](../../images/2/20new.webp)

يُخزَّن مورد الملاحظة المنشأ حديثاً في قيمة خاصية <i>data</i> في كائن _response_.

غالباً ما يكون من المفيد فحص طلبات HTTP في تبويب <i>Network</i> ضمن أدوات مطوّري Chrome، وقد استُخدم هذا بكثافة في بداية [الجزء 0](/part0/fundamentals_of_web_apps#http-get).

يمكننا استخدام أداة الفحص للتأكد من أن الترويسات المرسَلة في طلب POST هي ما توقعناه:

![ترويسات أدوات المطوّر تُظهر 201 created لـ localhost:3001/notes](../../images/2/21new1.webp)

ولأن البيانات التي أرسلناها في طلب POST كانت كائن JavaScript، عرف axios تلقائياً أنه يجب ضبط القيمة المناسبة <i>application/json</i> لترويسة <i>Content-Type</i>.

ويمكن استخدام تبويب <i>payload</i> للتحقق من بيانات الطلب:

![تبويب payload في أدوات المطوّر يُظهر الحقلين content و important المذكورين أعلاه](../../images/2/21new2.webp)

كما أن تبويب <i>response</i> مفيد أيضاً، فهو يُظهر البيانات التي استجاب بها الخادم:

![تبويب response في أدوات المطوّر يُظهر المحتوى نفسه الموجود في payload لكن مع حقل id أيضاً](../../images/2/21new3.webp)

لم تُعرَض الملاحظة الجديدة على الشاشة بعد. والسبب أننا لم نحدّث حالة مكوّن <i>App</i> عند إنشائها. لنصلح هذا:

```js
const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      // highlight-start
      setNotes(notes.concat(response.data))
      setNewNote('')
      // highlight-end
    })
}
```

تُضاف الملاحظة الجديدة التي أعادها الخادم الخلفي إلى قائمة الملاحظات في حالة تطبيقنا بالطريقة المعتادة باستخدام الدالة <em>setNotes</em> ثم إعادة ضبط نموذج إنشاء الملاحظة. ومن [التفاصيل المهمة](/part1/a_more_complex_state_debugging_react_apps#handling-arrays) التي ينبغي تذكّرها أن طريقة <em>concat</em> لا تغيّر الحالة الأصلية للمكوّن، بل تنشئ نسخة جديدة من القائمة.

بمجرد أن تبدأ البيانات التي يعيدها الخادم بالتأثير على سلوك تطبيقات الويب لدينا، نواجه فوراً مجموعة جديدة كاملة من التحديات الناشئة عن أمور مثل لاتزامن التواصل (asynchronicity). ويستلزم ذلك استراتيجيات جديدة لتصحيح الأخطاء، كما يصبح التسجيل في وحدة التحكم ووسائل تصحيح الأخطاء الأخرى أكثر أهمية. ويجب أيضاً أن نطوّر فهماً كافياً لمبادئ كل من بيئة تشغيل JavaScript ومكوّنات React. فلن يكفي التخمين.

من المفيد فحص حالة الخادم الخلفي، مثلاً عبر المتصفح:

![ناتج بيانات JSON من الواجهة الخلفية](../../images/2/22.webp)

وهذا يجعل من الممكن التحقق من أن جميع البيانات التي قصدنا إرسالها قد استقبلها الخادم فعلاً.

في الجزء التالي من الدورة، سنتعلم تنفيذ منطقنا الخاص في الواجهة الخلفية. وسنلقي حينها نظرة أقرب على أدوات مثل [Postman](https://www.postman.com/downloads/) التي تساعدنا في تصحيح أخطاء تطبيقات الخادم. غير أن فحص حالة json-server عبر المتصفح كافٍ لاحتياجاتنا الحالية.

يمكن العثور على شيفرة الحالة الحالية لتطبيقنا في الفرع <i>part2-5</i> على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-5).

### تغيير أهمية الملاحظات

لنضف زراً إلى كل ملاحظة يمكن استخدامه لتبديل أهميتها.

نُجري التغييرات التالية على مكوّن <i>Note</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

نضيف زراً إلى المكوّن ونسند إليه معالج الحدث وهو الدالة <em>toggleImportance</em> الممرَّرة في props الخاصة بالمكوّن.

يعرّف مكوّن <i>App</i> نسخة أولية من دالة معالج الحدث <em>toggleImportanceOf</em> ويمرّرها إلى كل مكوّن <i>Note</i>:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  // highlight-start
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }
  // highlight-end

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} // highlight-line
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```

لاحظ كيف تتلقى كل ملاحظة دالة معالج حدث <i>فريدة</i> خاصة بها بما أن <i>id</i> كل ملاحظة فريد.

فمثلاً، إذا كانت <i>note.id</i> تساوي 3، فستكون دالة معالج الحدث التي تعيدها _toggleImportance(note.id)_ كالتالي:

```js
() => { console.log('importance of 3 needs to be toggled') }
```

تذكير قصير هنا. النص الذي يطبعه معالج الحدث معرَّف بأسلوب شبيه بـJava عبر جمع النصوص:

```js
console.log('importance of ' + id + ' needs to be toggled')
```

يمكن استخدام صياغة [سلاسل القوالب](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) المضافة في ES6 لكتابة نصوص مشابهة بطريقة أجمل بكثير:

```js
console.log(`importance of ${id} needs to be toggled`)
```

يمكننا الآن استخدام صياغة «علامة الدولار بين قوسين» لإضافة أجزاء إلى النص تُقيّم تعبيرات JavaScript، مثل قيمة متغير. لاحظ أننا نستخدم علامات الاقتباس الخلفية (backticks) في سلاسل القوالب بدلاً من علامات الاقتباس المستخدمة في نصوص JavaScript العادية.

يمكن تعديل الملاحظات الفردية المخزّنة في خادم json-server بطريقتين مختلفتين عبر إرسال طلبات HTTP إلى عنوان URL الفريد للملاحظة. فيمكننا إما <i>استبدال</i> الملاحظة بأكملها بطلب HTTP PUT، أو تغيير بعض خصائص الملاحظة فقط بطلب HTTP PATCH.

الشكل النهائي لدالة معالج الحدث هو كالتالي:

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note))
  })
}
```

تحتوي كل سطر تقريباً من الشيفرة في جسم الدالة على تفاصيل مهمة. يعرّف السطر الأول عنوان URL الفريد لكل مورد ملاحظة بناءً على معرّفه.

تُستخدم [طريقة find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) في المصفوفة للعثور على الملاحظة التي نريد تعديلها، ثم نسندها إلى المتغير _note_.

بعد ذلك، ننشئ <i>كائناً جديداً</i> نسخة طبق الأصل من الملاحظة القديمة، باستثناء خاصية important التي تُقلب قيمتها (من true إلى false أو من false إلى true).

قد تبدو الشيفرة الخاصة بإنشاء الكائن الجديد التي تستخدم صياغة [نشر الكائن](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) غريبة بعض الشيء في البداية:

```js
const changedNote = { ...note, important: !note.important }
```

عملياً، ينشئ <em>{ ...note }</em> كائناً جديداً يحتوي على نسخ من جميع خصائص كائن _note_. وعندما نضيف خصائص داخل الأقواس المعقوصة بعد كائن النشر، مثل <em>{ ...note, important: true }</em>، فستكون قيمة خاصية _important_ في الكائن الجديد هي _true_. وفي مثالنا، تحصل خاصية <em>important</em> على نفي قيمتها السابقة في الكائن الأصلي.

هناك بضع نقاط جديرة بالذكر. لماذا أنشأنا نسخة من كائن الملاحظة الذي أردنا تعديله مع أن الشيفرة التالية تبدو عاملة أيضاً؟

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

هذا غير مُوصى به لأن المتغير <em>note</em> مرجع إلى عنصر في مصفوفة <em>notes</em> الموجودة في حالة المكوّن، وكما نتذكر يجب [ألا نغيّر الحالة مباشرة أبداً](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) في React.

يجدر بالذكر أيضاً أن الكائن الجديد _changedNote_ هو مجرد ما يُسمى [نسخة سطحية](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy)، أي أن قيم الكائن الجديد هي نفس قيم الكائن القديم. ولو كانت قيم الكائن القديم كائنات بحد ذاتها، لكانت القيم المنسوخة في الكائن الجديد تشير إلى الكائنات نفسها التي كانت في الكائن القديم.

ثم تُرسَل الملاحظة الجديدة بطلب PUT إلى الواجهة الخلفية حيث ستحل محل الكائن القديم.

تضبط دالة الاستدعاء الراجعة حالة <em>notes</em> للمكوّن إلى مصفوفة جديدة تحتوي على جميع العناصر من مصفوفة <em>notes</em> السابقة، باستثناء الملاحظة القديمة التي تُستبدل بالنسخة المحدَّثة منها التي يعيدها الخادم:

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id === id ? response.data : note))
})
```

ويتحقق هذا بطريقة <em>map</em>:

```js
notes.map(note => note.id === id ? response.data : note)
```

تنشئ طريقة map مصفوفة جديدة بتحويل كل عنصر من المصفوفة القديمة إلى عنصر في المصفوفة الجديدة. وفي مثالنا، تُنشأ المصفوفة الجديدة شرطياً بحيث إذا كانت <em>note.id === id</em> صحيحة، يُضاف كائن الملاحظة الذي أعاده الخادم إلى المصفوفة. وإذا كان الشرط خاطئاً، فحينها ننسخ العنصر ببساطة من المصفوفة القديمة إلى المصفوفة الجديدة بدلاً من ذلك.

قد تبدو حيلة <em>map</em> هذه غريبة بعض الشيء في البداية، لكن يجدر قضاء بعض الوقت في استيعابها. وسنستخدم هذه الطريقة مرات عديدة طوال الدورة.

### فصل التواصل مع الواجهة الخلفية في وحدة منفصلة

أصبح مكوّن <i>App</i> متضخماً بعض الشيء بعد إضافة الشيفرة الخاصة بالتواصل مع الخادم الخلفي. ووفقاً لروح [مبدأ المسؤولية الواحدة](https://en.wikipedia.org/wiki/Single_responsibility_principle)، نرى من الحكمة فصل هذا التواصل في [وحدة](/part2/rendering_a_collection_modules#refactoring-modules) خاصة به.

لننشئ مجلداً <i>src/services</i> ونضف فيه ملفاً باسم <i>notes.js</i>:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

تعيد الوحدة كائناً له ثلاث دوال (<i>getAll</i> و<i>create</i> و<i>update</i>) كخصائص تتعامل مع الملاحظات. وتعيد الدوال مباشرةً الـpromises التي تعيدها طرق axios.

يستخدم مكوّن <i>App</i> العبارة <em>import</em> للوصول إلى الوحدة:

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

يمكن استخدام دوال الوحدة مباشرةً عبر المتغير المستورد _noteService_ كما يلي:

```js
const App = () => {
  // ...

  useEffect(() => {
    // highlight-start
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
    // highlight-end
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // highlight-start
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
    // highlight-end
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

// highlight-start
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
// highlight-end
  }

  // ...
}

export default App
```

يمكننا أن نخطو بتنفيذنا خطوة إضافية. عندما يستخدم مكوّن <i>App</i> الدوال، فإنه يتلقى كائناً يحتوي على كامل استجابة طلب HTTP:

```js
noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })
```

لا يستخدم مكوّن <i>App</i> سوى خاصية <i>response.data</i> من كائن الاستجابة.

سيكون استخدام الوحدة أجمل بكثير إذا حصلنا على بيانات الاستجابة فقط بدلاً من استجابة HTTP كاملة. وسيبدو استخدام الوحدة حينها كالتالي:

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

يمكننا تحقيق ذلك بتغيير الشيفرة في الوحدة كما يلي (تحتوي الشيفرة الحالية على بعض النسخ واللصق، لكننا سنتحمل ذلك في الوقت الحالي):

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

لم نعد نعيد الـpromise الذي يعيده axios مباشرةً. بل نسند الـpromise إلى المتغير <em>request</em> ونستدعي طريقته <em>then</em>:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```

السطر الأخير في الدالة هو ببساطة تعبير أكثر إيجازاً عن الشيفرة نفسها كما هو موضح أدناه:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  // highlight-start
  return request.then(response => {
    return response.data
  })
  // highlight-end
}
```

تظل دالة <em>getAll</em> المعدَّلة تعيد promise، لأن طريقة <em>then</em> الخاصة بالـpromise [تعيد بدورها promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).

بعد تعريف معامل طريقة <em>then</em> ليعيد <i>response.data</i> مباشرةً، جعلنا دالة <em>getAll</em> تعمل كما أردنا. وعندما ينجح طلب HTTP، يعيد الـpromise البيانات المرسَلة في استجابة الواجهة الخلفية.

علينا تحديث مكوّن <i>App</i> ليعمل مع التغييرات التي أُجريت على وحدتنا. علينا إصلاح دوال الاستدعاء الراجعة المعطاة كمعاملات لطرق كائن <em>noteService</em> بحيث تستخدم بيانات الاستجابة المُعادة مباشرة:

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      // highlight-start      
      .then(initialNotes => {
        setNotes(initialNotes)
      // highlight-end
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      // highlight-end
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      // highlight-end
        setNewNote('')
      })
  }

  // ...
}
```

هذا كله معقّد بعض الشيء، ومحاولة شرحه قد تزيده صعوبة في الفهم فحسب. والإنترنت مليء بالمواد التي تناقش الموضوع، مثل [هذه المادة](https://javascript.info/promise-chaining).

يشرح كتاب «Async and performance» من سلسلة كتب [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) [الموضوع](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) جيداً، لكن الشرح يمتد على صفحات عديدة.

تحتل الـpromises مكانة محورية في تطوير JavaScript الحديث، ويوصى بشدة بتخصيص وقت معقول لفهمها.

### صياغة أنظف لتعريف الكائنات الحرفية

تصدّر الوحدة التي تعرّف الخدمات المتعلقة بالملاحظات حالياً كائناً له الخصائص <i>getAll</i> و<i>create</i> و<i>update</i> المسنَدة إلى دوال للتعامل مع الملاحظات.

كان تعريف الوحدة كالتالي:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

تصدّر الوحدة الكائن التالي الذي يبدو غريباً بعض الشيء:

```js
{ 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

التسميات إلى يسار النقطتين في تعريف الكائن هي <i>مفاتيح</i> الكائن، أما التسميات إلى يمينها فهي <i>متغيرات</i> معرَّفة داخل الوحدة.

بما أن أسماء المفاتيح والمتغيرات المسنَدة إليها متطابقة، يمكننا كتابة تعريف الكائن بصياغة أكثر إيجازاً:

```js
{ 
  getAll, 
  create, 
  update 
}
```

ونتيجة لذلك، يُبسَّط تعريف الوحدة إلى الشكل التالي:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update } // highlight-line
```

في تعريف الكائن بهذه الصياغة الأقصر، نستفيد من [ميزة جديدة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) أُدخلت إلى JavaScript عبر ES6، وتتيح طريقة أكثر إيجازاً قليلاً لتعريف الكائنات باستخدام المتغيرات.

لتوضيح هذه الميزة، لنفترض حالة لدينا فيها القيم التالية مسنَدة إلى متغيرات:

```js
const name = 'Leevi'
const age = 0
```

في الإصدارات الأقدم من JavaScript كان علينا تعريف الكائن هكذا:

```js
const person = {
  name: name,
  age: age
}
```

لكن بما أن حقول الخصائص وأسماء المتغيرات في الكائن متطابقة، يكفي ببساطة كتابة ما يلي في JavaScript ES6:

```js
const person = { name, age }
```

النتيجة متطابقة في كلا التعبيرين. فكلاهما ينشئ كائناً له خاصية <i>name</i> بالقيمة <i>Leevi</i> وخاصية <i>age</i> بالقيمة <i>0</i>.

### الـpromises والأخطاء

لو كان تطبيقنا يسمح للمستخدمين بحذف الملاحظات، فقد ننتهي إلى حالة يحاول فيها مستخدم تغيير أهمية ملاحظة حُذفت بالفعل من النظام.

لنحاكِ هذه الحالة بجعل دالة <em>getAll</em> في خدمة الملاحظات تعيد ملاحظة «مضمّنة في الشيفرة» (hardcoded) لا وجود لها فعلاً على الخادم الخلفي:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
```

عندما نحاول تغيير أهمية الملاحظة المضمّنة في الشيفرة، نرى رسالة الخطأ التالية في وحدة التحكم. تقول الرسالة إن الخادم الخلفي استجاب لطلب HTTP PUT برمز الحالة 404 <i>not found</i>.

![خطأ 404 not found في أدوات المطوّر](../../images/2/23e.webp)

ينبغي أن يكون التطبيق قادراً على التعامل مع هذه الأنواع من حالات الخطأ بلطف. فلن يستطيع المستخدمون معرفة أن خطأً قد وقع إلا إذا صادف أن وحدة التحكم مفتوحة لديهم. والطريقة الوحيدة التي يمكن بها رؤية الخطأ في التطبيق هي أن النقر على الزر لا يؤثر على أهمية الملاحظة.

ذكرنا [سابقاً](/part2/getting_data_from_server#axios-and-promises) أن الـpromise يمكن أن يكون في واحدة من ثلاث حالات مختلفة. وعندما يفشل طلب HTTP في axios، يصبح الـpromise المرتبط به <i>مرفوضاً</i>. ولا تتعامل شيفرتنا الحالية مع هذا الرفض بأي شكل.

تتم [معالجة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) رفض الـpromise بتزويد طريقة <em>then</em> بدالة استدعاء راجعة ثانية تُستدعى في الحالة التي يُرفض فيها الـpromise.

لكن الطريقة الأكثر شيوعاً لإضافة معالج للـpromises المرفوضة هي استخدام طريقة [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch).

عملياً، يُعرَّف معالج الأخطاء للـpromises المرفوضة هكذا:

```js
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```

إذا فشل الطلب، يُستدعى معالج الحدث المسجَّل بواسطة طريقة <em>catch</em>.

غالباً ما تُستخدم طريقة <em>catch</em> بوضعها في موضع أعمق داخل سلسلة الـpromises.

عند ربط عدة طرق _.then_ معاً، ننشئ في الواقع [سلسلة promises](https://javascript.info/promise-chaining):

```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
```

يمكن استخدام طريقة <em>catch</em> لتعريف دالة معالج في نهاية سلسلة promises، تُستدعى بمجرد أن يطرح أي promise في السلسلة خطأً ويصبح الـpromise <i>مرفوضاً</i>.

```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```

لنستفد من هذه الميزة. سنضع معالج الأخطاء الخاص بتطبيقنا في مكوّن <i>App</i>:

```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
    // highlight-start
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
    // highlight-end
}
```

تُعرض رسالة الخطأ للمستخدم عبر نافذة الحوار [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) القديمة الموثوقة، وتُستبعد الملاحظة المحذوفة من الحالة.

يتم إزالة ملاحظة محذوفة بالفعل من حالة التطبيق باستخدام طريقة [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) في المصفوفة، وهي تعيد مصفوفة جديدة تتضمن فقط العناصر التي تعيد الدالة الممرَّرة كمعامل القيمة true من أجلها:

```js
notes.filter(n => n.id !== id)
```

ربما ليست فكرة جيدة استخدام alert في تطبيقات React الأكثر جدية. وسنتعلم قريباً طريقة أكثر تقدماً لعرض الرسائل والإشعارات للمستخدمين. غير أن هناك حالات يمكن فيها لطريقة بسيطة ومجرَّبة مثل <em>alert</em> أن تعمل كنقطة انطلاق. ويمكن دائماً إضافة طريقة أكثر تقدماً لاحقاً، إذا توفر الوقت والطاقة لذلك.

يمكن العثور على شيفرة الحالة الحالية لتطبيقنا في الفرع <i>part2-6</i> على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-6).

### قسم مطوّر Full stack

حان وقت التمارين مجدداً. يزداد تعقيد تطبيقنا الآن لأنه بالإضافة إلى الاعتناء بمكوّنات React في الواجهة الأمامية فقط، لدينا أيضاً واجهة خلفية تحفظ بيانات التطبيق.

وللتعامل مع التعقيد المتزايد، ينبغي أن نوسّع قسم مطوّر الويب ليصبح <i>قسم مطوّر Full stack</i>، الذي يذكّرنا بالتحقق من أن التواصل بين الواجهة الأمامية والواجهة الخلفية يحدث كما هو متوقع.

وهذا هو القسم المحدَّث:

تطوير Full stack <i>صعب للغاية</i>، ولهذا سأستخدم كل الوسائل الممكنة لتسهيله

- سأبقي وحدة تحكم مطوّر المتصفح مفتوحة طوال الوقت
- <i>سأستخدم تبويب الشبكة في أدوات مطوّر المتصفح للتأكد من أن الواجهة الأمامية والواجهة الخلفية تتواصلان كما أتوقع</i>
- <i>سأراقب باستمرار حالة الخادم للتأكد من أن البيانات التي ترسلها الواجهة الأمامية إلى هناك تُحفظ فيه كما أتوقع</i>
- سأتقدم بخطوات صغيرة
- سأكتب الكثير من عبارات _console.log_ للتأكد من فهمي لكيفية تصرف الشيفرة وللمساعدة في تحديد المشكلات
- إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل سأبدأ بحذف الشيفرة حتى تعمل، أو أعود إلى حالة كان فيها كل شيء يعمل
- عندما أطلب المساعدة في قناة الدورة على Discord أو في مكان آخر، سأصيغ أسئلتي بشكل سليم، انظر [هنا](/part0/general_info#how-to-get-help-in-discord) لكيفية طلب المساعدة

</div>

<div class="tasks">

<h3>تمارين 2.12.-2.15.</h3>

<h4>2.12: دفتر الهاتف، الخطوة 7</h4>

لنعد إلى تطبيق دفتر الهاتف.

حالياً، لا تُحفظ الأرقام التي تُضاف إلى دفتر الهاتف في خادم خلفي. أصلح هذا الوضع.

<h4>2.13: دفتر الهاتف، الخطوة 8</h4>

افصل الشيفرة التي تتعامل مع التواصل مع الواجهة الخلفية في وحدة خاصة بها باتباع المثال المعروض سابقاً في هذا الجزء من مادة الدورة.

<h4>2.14: دفتر الهاتف، الخطوة 9</h4>

اجعل من الممكن للمستخدمين حذف المدخلات من دفتر الهاتف. ويمكن أن يتم الحذف عبر زر مخصص لكل شخص في قائمة دفتر الهاتف. ويمكنك تأكيد الإجراء من المستخدم باستخدام طريقة [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm):

![لقطة شاشة لميزة window.confirm في التمرين 2.17](../../images/2/24e.webp)

يمكن حذف المورد المرتبط بشخص في الواجهة الخلفية عبر إرسال طلب HTTP DELETE إلى عنوان URL الخاص بالمورد. فإذا كنا نحذف مثلاً شخصاً معرّفه <i>id</i> هو 2، فسيكون علينا إرسال طلب HTTP DELETE إلى العنوان <i>localhost:3001/persons/2</i>. ولا تُرسَل أي بيانات مع الطلب.

يمكنك إرسال طلب HTTP DELETE باستخدام مكتبة [axios](https://github.com/axios/axios) بالطريقة نفسها التي نرسل بها جميع الطلبات الأخرى.

**ملاحظة:** لا يمكنك استخدام الاسم <em>delete</em> لمتغير لأنه كلمة محجوزة في JavaScript. فمثلاً، ما يلي غير ممكن:

```js
// استخدم اسماً آخر للمتغير!
const delete = (id) => {
  // ...
}
```

<h4>2.15*: دفتر الهاتف، الخطوة 10</h4>

<i>لماذا توجد نجمة في التمرين؟ انظر [هنا](/part0/general_info#taking-the-course) للاطلاع على الشرح.</i>

غيّر الوظيفة بحيث إذا أُضيف رقم لمستخدم موجود بالفعل، فسيحل الرقم الجديد محل الرقم القديم. ويوصى باستخدام طريقة HTTP PUT لتحديث رقم الهاتف.

إذا كانت معلومات الشخص موجودة بالفعل في دفتر الهاتف، فيمكن للتطبيق أن يطلب من المستخدم تأكيد الإجراء:

![لقطة شاشة لتأكيد alert في التمرين 2.18](../../images/teht/16e.webp)

</div>
