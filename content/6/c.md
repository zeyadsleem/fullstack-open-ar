---
part: 6
letter: c
title: "الفصل 3: الحالة المعقدة والجلب والاختبار"
mainImage: /images/part-6.svg
lang: ar
---
لنواصل توسيع نسخة Zustand من تطبيق الملاحظات.

لتسهيل التطوير، سنغيّر الحالة الأولية بحيث تحتوي مسبقاً على بضع ملاحظات:

```js
// BEGIN HIGHLIGHT
const initialNotes = [
    {
      id: 1,
      content: 'Zustand is less complex than Redux',
      important: true,
    }, {
      id: 2,
      content: 'React app benefits from custom hooks',
      important: false,
    }, {
      id: 3,
      content: 'Remember to sleep well',
      important: true,
    }
  ]
// END HIGHLIGHT

const useNoteStore = create((set) => ({
  notes: initialNotes,
  // ...
}
```

### حالة أكثر تعقيداً

لننفّذ ترشيح الملاحظات المعروضة في التطبيق، بما يتيح تقييد الملاحظات الظاهرة. يُنفَّذ الترشيح باستخدام <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio" target="_blank" rel="noopener">أزرار الراديو (radio buttons)</a>:

![صورة توضيحية](/images/mooc/1522797f18a8.webp)

يبرز السؤال حول أفضل طريقة للتعامل مع إدارة حالة المرشّح. يوجد أساساً خياران: إنشاء store منفصل في Zustand للمرشّح، أو إضافته إلى الـ store الحالي. وكلا الحلّين مبرَّر. توصي <a href="https://tkdodo.eu/blog/working-with-zustand#keep-the-scope-of-your-store-small" target="_blank" rel="noopener">أفضل الممارسات</a> الموجودة على الإنترنت بإبقاء <em>الأشياء غير المترابطة في stores منفصلة</em> تماماً. ومع ذلك، فإن قائمة الملاحظات والترشيح مرتبطان ارتباطاً وثيقاً بما يكفي لوضع كليهما في الـ store نفسه:

```js
const useNoteStore = create((set) => ({
  notes: initialNotes,
  // BEGIN HIGHLIGHT
  filter: 'all',
  // END HIGHLIGHT
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    ),
    toggleImportance: id => set(
      state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    ),
  // BEGIN HIGHLIGHT
    setFilter: value => set(() => ({ filter: value }))
  // END HIGHLIGHT
  }
}))

export const useNotes = () => useNoteStore((state) => state.notes)
// BEGIN HIGHLIGHT
export const useFilter = () => useNoteStore((state) => state.filter)
// END HIGHLIGHT
export const useNoteActions = () => useNoteStore((state) => state.actions)
```

المكوّن الذي يضبط قيمة المرشّح:

```js
import { useNoteActions } from './store'

const VisibilityFilter = () =&gt; {
  const { setFilter } = useNoteActions()

  return (
    &lt;div&gt;
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('all')}
        defaultChecked
      /&gt;
      all
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('important')}
      /&gt;
      important
      &lt;input
        type="radio"
        name="filter"
        onChange={() =&gt; setFilter('nonimportant')}
      /&gt;
      not important
    &lt;/div&gt;
  )
}

export default VisibilityFilter
```

يعرض مكوّن&nbsp;<em>App</em>&nbsp;المرشّح:

```js
const App = () => (
  &lt;div>
    &lt;NoteForm />
  // BEGIN HIGHLIGHT
    &lt;VisibilityFilter />
  // END HIGHLIGHT
    &lt;NoteList />
  &lt;/div>
)
```

يمكن التعامل مع ترشيح الملاحظات المعروضة في مكوّن&nbsp;<em>NoteList</em>&nbsp;على النحو التالي مثلاً:

```js
import { useNotes, useFilter } from './store'
import Note from './Note'

const NoteList = () => {
  const notes = useNotes()

  // BEGIN HIGHLIGHT
  const filter = useFilter()

  const notesToShow = notes.filter(note => {
    if (filter === 'important') return note.important
    if (filter === 'nonimportant') return !note.important
    return true
  })
  // END HIGHLIGHT

  return (
    &lt;ul>
      // BEGIN HIGHLIGHT
      {notesToShow.map(note => (
      // END HIGHLIGHT
        &lt;Note key={note.id} note={note} />
      ))}
    &lt;/ul>
  )
}
```

الحل الأكثر أناقة هو تضمين منطق الترشيح مباشرةً في دالة <em>useNotes</em> الخاصة بالـ store:

```js
import { create } from 'zustand'

const useNoteStore = create((set) => ({
  // ...
}))

// BEGIN HIGHLIGHT
export const useNotes = () => {
  const notes = useNoteStore((state) => state.notes)
  const filter = useNoteStore((state) => state.filter)

  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)

  return notes
}
// END HIGHLIGHT
```

وهكذا تُعيد دالة&nbsp;<em>useNotes</em>&nbsp;دائماً قائمة ملاحظات مرشَّحة بالطريقة المطلوبة. بل إن مستخدِم الدالة، وهو مكوّن&nbsp;<em>NoteList</em>، لا يحتاج حتى إلى معرفة أن المرشّح موجود:

```js
import { useNotes } from './store'
import Note from './Note'

const NoteList = () =&gt; {
  // يحصل المكوّن دائماً على مجموعة الملاحظات المرشَّحة بشكل صحيح
  const notes = useNotes()

  return (
    &lt;ul&gt;
      {notes.map(note =&gt; (
        &lt;Note key={note.id} note={note} /&gt;
      ))}
    &lt;/ul&gt;
  )
}
```

الحل أنيق!

> حل بديل ممكن
>
> يتمثل البديل في تنفيذ الترشيح مباشرةً داخل دالة المحدِّد (selector)، بحيث تُقرأ كل من الملاحظات والمرشّح في استدعاء واحد لـ <em>useNoteStore</em>:
>
> export const useNotes = () => useNoteStore(({ notes, filter }) => {
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
>
>   return notes
})
>
> لكن هذا الأسلوب لا يعمل، لأنه يؤدي إلى حلقة إعادة عرض لا نهائية عند تغيير المرشّح.
>
> والسبب كما يلي: يقارن Zustand القيمة المُعادة من المحدِّد باستخدام المعامل&nbsp;<em>===</em>. ولأن&nbsp;<em>notes.filter(...)</em>&nbsp;تُنشئ مصفوفة جديدة في كل عرض، يفسّرها React دائماً على أنها حالة جديدة ويُطلق عرضاً آخر، يُنشئ بدوره مصفوفة جديدة، وهكذا دواليك.
>
> الحل هو إضافة&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/hooks/use-shallow" target="_blank" rel="noopener">useShallow</a>، التي تستبدل مقارنة&nbsp;<em>===</em>&nbsp;بمقارنة سطحية: فهي تقارن عناصر المصفوفة واحداً واحداً. وإذا لم يتغير المحتوى، تُعيد مرجع المصفوفة القديمة بدلاً من مصفوفة جديدة، فيرى React أن الحالة مستقرة ولا يعيد العرض.
>
> import { useShallow } from 'zustand/react/shallow'
>
> //...
>
> export const useNotes = () => useNoteStore(useShallow(({ notes, filter }) => {
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
>
>   return notes
}))
>
> الحل يعمل، لكنه أصعب قليلاً في الفهم. نستخدم في مادة المقرر النسخة المعروضة سابقاً باستدعاءين منفصلين لـ&nbsp;<em>useNoteStore</em>.

الشيفرة الحالية للتطبيق متاحة كاملة على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-3" target="_blank" rel="noopener">GitHub</a>، في الفرع&nbsp;<em>part6-3</em>.

<div class="tasks">

**7. anecdotes، الخطوة 5**

</div>

### البيانات إلى الخادم

لنوسّع التطبيق بحيث تُخزَّن الملاحظات في الواجهة الخلفية. سنستخدم&nbsp;<a href="/part2/getting_data_from_server" target="_blank" rel="noopener">JSON Server</a>&nbsp;المألوف من الجزء الثاني.

احفظ الحالة الأولية لقاعدة البيانات في ملف&nbsp;<em>db.json</em>&nbsp;في جذر المشروع:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "Zustand is less complex than Redux",
      "important": true
    },
    {
      "id": 2,
      "content": "React app benefits from custom hooks",
      "important": false
    },
    {
      "id": 3,
      "content": "Remember to sleep well",
      "important": true
    }
  ]
}
```

ثبّت JSON Server:

```bash
npm install json-server --save-dev
```

وأضف السطر التالي إلى قسم&nbsp;<em>scripts</em>&nbsp;في&nbsp;<em>package.json</em>:

```
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

شغّل JSON Server بالأمر&nbsp;<em>npm run server</em>.

### Fetch API

في تطوير البرمجيات، غالباً ما يتعين عليك التفكير فيما إذا كانت ميزة معينة تُنفَّذ باستخدام مكتبة خارجية أم بالاستفادة من الحلول الأصلية التي توفرها البيئة. ولكل من الأسلوبين مزاياه وتحدياته.

استخدمنا في أجزاء سابقة من هذا المقرر مكتبة&nbsp;<a href="https://axios-http.com/docs/intro" target="_blank" rel="noopener">Axios</a>&nbsp;لإجراء طلبات HTTP. لنألف الآن طريقة بديلة لإجراء طلبات HTTP باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener">Fetch API</a>&nbsp;الأصلية.

من المعتاد أن تكون مكتبة خارجية مثل&nbsp;<em>Axios</em>&nbsp;مبنية باستخدام مكتبات خارجية أخرى. فمثلاً، إذا ثبّتت Axios في مشروع بالأمر&nbsp;<em>npm install axios</em>، يكون ناتج الطرفية:

```
$ npm install axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

إذن لن يثبّت الأمر مكتبة Axios فقط، بل أكثر من 20 حزمة npm أخرى تحتاجها Axios لتعمل.

توفّر&nbsp;<em>Fetch API</em>&nbsp;طريقة مشابهة لإجراء طلبات HTTP كما في Axios، لكن استخدام Fetch API لا يتطلب تثبيت مكتبات خارجية. وتصبح صيانة التطبيق أسهل عندما تكون المكتبات الواجب تحديثها أقل، كما يتحسن الأمان لأن سطح الهجوم المحتمل للتطبيق يقل. يُتناول أمان التطبيقات وصيانتها في&nbsp;<a href="/part7#security-in-react-and-node-applications" target="_blank" rel="noopener">الجزء السابع</a>&nbsp;من المقرر.

تُجرى الطلبات عملياً باستخدام دالة&nbsp;<em>fetch()</em>. ولهذه الصيغة بعض الاختلافات مقارنةً بـ Axios. وسنلاحظ قريباً أن Axios اعتنى ببعض الأمور نيابةً عنا ويسّر حياتنا. غير أننا سنستخدم Fetch API الآن لأنه حل أصلي واسع الاستخدام ينبغي أن يكون كل مطوّر Full Stack على دراية به.

### جلب البيانات من الخادم

لننشئ دالة تجلب البيانات من الواجهة الخلفية في ملف&nbsp;<em>src/services/notes.js</em>:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () =&gt; {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}

export default { getAll }
```

لنلقِ نظرة أدق على تنفيذ دالة&nbsp;<em>getAll</em>. تُجلب الملاحظات الآن من الواجهة الخلفية باستدعاء دالة&nbsp;<em>fetch()</em>&nbsp;التي أُعطي لها عنوان URL الخاص بالواجهة الخلفية كوسيط. ولم يُحدَّد نوع الطلب بشكل منفصل، لذا تنفّذ&nbsp;<em>fetch</em>&nbsp;الإجراء الافتراضي، وهو طلب GET.

عند وصول الاستجابة، نتحقق مما إذا كان الطلب قد نجح بالنظر إلى حقل&nbsp;<em>response.ok</em>&nbsp;ونرفع خطأً عند الحاجة:

```
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

تأخذ السمة&nbsp;<em>response.ok</em>&nbsp;القيمة&nbsp;<em>true</em>&nbsp;إذا نجح الطلب، أي إذا كان رمز حالة الاستجابة ضمن النطاق 200-299. أما لجميع رموز الحالة الأخرى، مثل 404 أو 500، فتأخذ القيمة&nbsp;<em>false</em>.

لاحظ أن&nbsp;<em>fetch</em>&nbsp;لا ترفع خطأً تلقائياً حتى إذا كان رمز حالة الاستجابة، مثلاً، 404. يجب تنفيذ معالجة الأخطاء يدوياً، كما فعلنا الآن.

إذا نجح الطلب، تُحوَّل البيانات الواردة في الاستجابة إلى صيغة JSON:

```js
const data = await response.json()
```

لا تحوّل&nbsp;<em>fetch</em>&nbsp;تلقائياً البيانات التي قد تصحب الاستجابة إلى صيغة JSON؛ بل يجب إجراء التحويل يدوياً. ويجدر بالذكر أيضاً أن&nbsp;<em>response.json()</em>&nbsp;دالة غير متزامنة، لذا يجب استخدام الكلمة المفتاحية&nbsp;<em>await</em>&nbsp;معها.

لنبسّط الشيفرة قليلاً بإعادة البيانات التي تُعيدها دالة&nbsp;<em>response.json()</em>&nbsp;مباشرةً:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  // BEGIN HIGHLIGHT
  return await response.json()
  // END HIGHLIGHT
}
```

لنضف إلى الـ store دالة يمكن استخدامها لتهيئة الحالة بملاحظات مجلوبة من الخادم:

```js
const useNoteStore = create((set) => ({
  // BEGIN HIGHLIGHT
  notes: [],
  // END HIGHLIGHT
  filter: '',
  actions: {
    // ...
    setFilter: value => set(() => ({ filter: value })),
  // BEGIN HIGHLIGHT
    initialize: notes => set(() => ({ notes }))
  // END HIGHLIGHT
  }
}))
```

لننفّذ تهيئة الملاحظات في مكوّن <em>App</em>. وكما جرت العادة عند جلب البيانات من الخادم، نستخدم خطاف <em>useEffect</em>:

```js
const App = () => {
  const { initialize } = useNoteActions()

 // BEGIN HIGHLIGHT
  useEffect(() => {
    noteService.getAll().then(notes => initialize(notes))
  }, [initialize])
 // END HIGHLIGHT

  return (
    &lt;div>
      &lt;NoteForm />
      &lt;VisibilityFilter />
      &lt;NoteList />
    &lt;/div>
  )
}
```

وهكذا تُجلب الملاحظات من الخادم باستخدام دالة&nbsp;<em>getAll()</em>&nbsp;التي عرّفناها، ثم تُخزَّن باستخدام دالة&nbsp;<em>initialize</em>&nbsp;التابعة للـ store. وتُنفَّذ هذه الإجراءات في خطاف&nbsp;<em>useEffect</em>، ما يعني أنها تُنفَّذ أثناء العرض الأول لمكوّن App.

لنلقِ نظرة أدق على تفصيل صغير واحد. لقد أضفنا دالة&nbsp;<em>initialize</em>&nbsp;إلى مصفوفة اعتماديات خطاف&nbsp;<em>useEffect</em>. وإذا حاولنا استخدام مصفوفة اعتماديات فارغة، يعطينا ESLint التحذير التالي:&nbsp;<em>React Hook useEffect has a missing dependency: 'initialize'</em>. فما الذي يحدث؟

ستعمل الشيفرة منطقياً بالطريقة نفسها تماماً حتى لو استخدمنا مصفوفة اعتماديات فارغة، لأن&nbsp;<em>initialize</em>&nbsp;تشير إلى الدالة نفسها طوال تنفيذ البرنامج. ومع ذلك، من ممارسات البرمجة الجيدة إضافة جميع المتغيرات والدوال المستخدمة في خطاف&nbsp;<em>useEffect</em>&nbsp;والمعرَّفة داخل المكوّن إلى الاعتماديات. فهذا يساعد على تجنب أخطاء غير متوقعة.

### إرسال البيانات إلى الخادم

لننفّذ بعد ذلك وظيفة إرسال ملاحظة جديدة إلى الخادم. وفي الوقت نفسه يمكننا التدرّب على كيفية إجراء طلب POST باستخدام دالة&nbsp;<em>fetch()</em>.

لنوسّع شيفرة التواصل مع الخادم في&nbsp;<em>src/services/notes.js</em>&nbsp;كما يلي:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

// BEGIN HIGHLIGHT
const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
// END HIGHLIGHT

// BEGIN HIGHLIGHT
export default { getAll, createNew }
// END HIGHLIGHT
```

لنلقِ نظرة أدق على تنفيذ دالة&nbsp;<em>createNew</em>. يحدّد الوسيط الأول لدالة&nbsp;<em>fetch()</em>&nbsp;عنوان URL الذي يُوجَّه إليه الطلب. أما الوسيط الثاني فهو كائن يحدّد التفاصيل الأخرى للطلب، مثل نوع الطلب والترويسات والبيانات المُرسَلة مع الطلب. ويمكننا زيادة توضيح الشيفرة بتخزين الكائن الذي يحدّد تفاصيل الطلب في متغير مساعد منفصل&nbsp;<em>options</em>:

```js
const createNew = async (content) => {
  // BEGIN HIGHLIGHT
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }

  const response = await fetch(baseUrl, options)
  // END HIGHLIGHT

  const response = await fetch(baseUrl, options)
  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
```

لنلقِ نظرة أدق على كائن&nbsp;<em>options</em>:
- <em>method</em> يحدّد نوع الطلب، وهو في هذه الحالة <em>POST</em>
- <em>headers</em> يحدّد ترويسات الطلب. نُرفق بالطلب الترويسة <em>'Content-Type': 'application/json'</em> لكي يعرف الخادم أن البيانات المضمّنة مع الطلب بصيغة JSON، ويتمكن من التعامل مع الطلب بشكل صحيح
- <em>body</em> يحتوي على البيانات التي ستُرسَل مع الطلب. لا يمكن أن يحتوي الحقل على كائن JavaScript مباشرةً، بل يجب أولاً تحويله إلى نص JSON باستدعاء <em>JSON.stringify()</em>

وكما في طلب GET، نتحقق هنا أيضاً من رمز حالة الاستجابة بحثاً عن أخطاء:

```
if (!response.ok) {
  throw new Error('Failed to create note')
}
```

إذا نجح الطلب، يُعيد&nbsp;<em>JSON Server</em>&nbsp;الملاحظة التي أُنشئت للتو، وقد ولّد لها أيضاً&nbsp;<em>id</em>&nbsp;فريداً. ولا تزال البيانات الواردة في الاستجابة بحاجة إلى التحويل إلى صيغة JSON باستخدام دالة&nbsp;<em>response.json()</em>:

```js
return await response.json()
```

لنغيّر بعد ذلك مكوّن&nbsp;<em>NoteForm</em>&nbsp;في تطبيقنا بحيث تُرسَل الملاحظة الجديدة إلى الواجهة الخلفية. وتتغير دالة&nbsp;<em>addNote</em>&nbsp;في المكوّن قليلاً:

```js
import { useNoteActions } from './store'
import noteService from './services/notes'

const NoteForm = () => {
  const { add } = useNoteActions()

  const addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    // BEGIN HIGHLIGHT
    const newNote = await noteService.createNew(content)
    // END HIGHLIGHT
    add(newNote)
    e.target.reset()
  }

  return (
    &lt;form onSubmit={addNote}>
      &lt;input name="note" />
      &lt;button type="submit">add&lt;/button>
    &lt;/form>
  )
}

export default NoteForm
```

عند إنشاء ملاحظة جديدة في الواجهة الخلفية باستدعاء دالة&nbsp;<em>createNew()</em>، نحصل في المقابل على كائن يصف الملاحظة، وقد ولّدت الواجهة الخلفية له&nbsp;<em>id</em>.

الشيفرة الحالية للتطبيق متاحة كاملة على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-4" target="_blank" rel="noopener">GitHub</a>، في الفرع&nbsp;<em>part6-4</em>.

### الـ actions غير المتزامنة

مقاربتنا جيدة إلى حد كبير، لكنها مؤسفة من جهة واحدة، إذ يحدث التواصل مع الخادم داخل شيفرة الدوال التي تعرّف المكوّنات. وسيكون أفضل لو أمكن تجريد التواصل بعيداً عن المكوّنات، بحيث لا تحتاج إلا إلى استدعاء دالة مناسبة يوفّرها الـ store.

نريد أن يهيّئ&nbsp;<em>App</em>&nbsp;حالة التطبيق كما يلي:

```js
const App = () => {
  // BEGIN HIGHLIGHT
  const { initialize } = useNoteActions()
  // END HIGHLIGHT
  useEffect(() => {
    // BEGIN HIGHLIGHT
    initialize()
    // END HIGHLIGHT
  }, [initialize])

  return (
    &lt;div>
      &lt;NoteForm />
      &lt;VisibilityFilter />
      &lt;NoteList />
    &lt;/div>
  )
}
```

ويُنشئ&nbsp;<em>NoteForm</em>&nbsp;بدوره ملاحظة جديدة هكذا:

```js
const NoteForm = () => {
  // BEGIN HIGHLIGHT
  const { add } = useNoteActions()
  // END HIGHLIGHT

  const addNote = async (e) => {
    e.preventDefault()
    const content = e.target.note.value
    // BEGIN HIGHLIGHT
    await add(content)
    // END HIGHLIGHT
    e.target.reset()
  }

  return (
    &lt;form onSubmit={addNote}>
      &lt;input name="note" />
      &lt;button type="submit">add&lt;/button>
    &lt;/form>
  )
}
```

أما التغيير في&nbsp;<em>store.js</em>&nbsp;فهو كما يلي:

```js
import { create } from 'zustand'
// BEGIN HIGHLIGHT
import noteService from './services/notes'

// END HIGHLIGHT
const useNoteStore = create((set) => ({
  notes: [],
  filter: '',
  actions: {
    // BEGIN HIGHLIGHT
    add: async (content) => {
    // END HIGHLIGHT
      // BEGIN HIGHLIGHT
      const newNote = await noteService.createNew(content)
      // END HIGHLIGHT
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    // BEGIN HIGHLIGHT
    initialize: async () => {
    // END HIGHLIGHT
      // BEGIN HIGHLIGHT
      const notes = await noteService.getAll()
      // END HIGHLIGHT
      set(() => ({ notes }))
    },
    // ...
  }
}))
```

وهكذا حُوّلت الدالتان <em>add</em> و<em>initialize</em> إلى دالتين غير متزامنتين، تستدعيان أولاً دالة&nbsp;<em>noteService</em>&nbsp;المناسبة، ثم تحدّثان الحالة.

الحل أنيق، إذ أصبحت إدارة الحالة والتواصل مع الخادم منفصلين تماماً خارج مكوّنات React.

لنُكمل التطبيق بمزامنة تغييرات تبديل الأهمية مع الخادم.

نوسّع&nbsp;<em>noteService.js</em>&nbsp;كما يلي:

```js
const update = async (id, note) =&gt; {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}

export default { getAll, createNew, update }
```

أما التغيير في دالة&nbsp;<em>toggleImportance</em>&nbsp;التابعة للـ store فهو كما يلي:

```js
const useNoteStore = create((set) => ({
  notes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newNote = await noteService.createNew(content)
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    // BEGIN HIGHLIGHT
    toggleImportance: async (id) => {
      const note = useNoteStore.getState().notes.find(n => n.id === id)
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    // END HIGHLIGHT
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const notes = await noteService.getAll()
      set(() => ({ notes }))
    }
  }
}))
```

ثمة تفصيل جدير بالملاحظة في الدالة الجديدة. تستقبل الدالة معرّف الملاحظة (id) كوسيط. لكن يجب إرسال الملاحظة المعدَّلة إلى الواجهة الخلفية. ويمكن العثور عليها باستدعاء دالة&nbsp;<em>getState</em>&nbsp;التابعة للـ store:

```js
const note = useNoteStore.getState().notes.find(n =&gt; n.id === id)
```

تحتوي stores الخاصة بـ Zustand أيضاً على عدد من&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">الدوال المساعدة</a>&nbsp;الأخرى، قد تكون مفيدة في بعض الحالات.

لنغيّر أيضاً تعريف الـ store بحيث نمرّر كذلك الوسيط <a href="https://zustand.docs.pmnd.rs/reference/apis/create#parameters">get</a> إلى الدالة المُعطاة لـ <em>create</em>، والذي يمكننا من خلاله الوصول إلى قيم الحالة عند الحاجة:

```js
// BEGIN HIGHLIGHT
const useNoteStore = create((set, get) => ({
// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    toggleImportance: async (id) => {
      // BEGIN HIGHLIGHT
      const note = get().notes.find(n => n.id === id)
      // END HIGHLIGHT
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    // ...
  }
}))
```

تُعيد دالة&nbsp;<em>get</em>&nbsp;الحالة الحالية للـ store. فمثلاً، يعطينا الاستدعاء&nbsp;<em>get().notes</em>&nbsp;ملاحظات الـ store الحالية. ودالة&nbsp;<em>get</em>&nbsp;مكافئة وظيفياً لاستدعاء&nbsp;<em>useNoteStore.getState()</em>، لكنها الطريقة الأكثر أصالة للإشارة إلى حالة الـ store من داخل دوال الـ store نفسها.

شيفرة التطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-5" target="_blank" rel="noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part6-5</em>.

<div class="tasks">

**8. anecdotes، الخطوة 6**

</div>

<div class="tasks">

**9. anecdotes، الخطوة 7**

</div>

<div class="tasks">

**10. anecdotes، الخطوة 8**

</div>

<div class="tasks">

**11. anecdotes، الخطوة 9**

</div>

<div class="tasks">

**12. anecdotes، الخطوة 10**

</div>

<div class="tasks">

**13. فحص anecdotes**

</div>

### الوسيطات

عند تطوير تطبيق، تصادفك غالباً حالات يصعب فيها فهم سبب سلوك التطبيق على نحو غير متوقع. فتتغير الحالة نتيجة استدعاء دالة action ما، لكن لا يتضح أي استدعاء غيّر ماذا وبأي ترتيب. ولا يساعد التسجيل التقليدي للدوال الفردية في وحدة التحكم إلا بحدود ضيقة.

يدعم Zustand ما يُسمى الوسيطات (middlewares)، ويمكن استخدامها لإضافة وظائف إلى stores بشكل شفاف، دون المساس بمنطق الـ store نفسه. وفكرة الوسيط بسيطة: فهو «يلتفّ» حول الـ store ويمكنه، مثلاً، تسجيل كل تغيير في الحالة تلقائياً.

وصيغة دوال الوسيط غامضة بعض الشيء. وفي ما يلي&nbsp;<em>logger</em>&nbsp;يطبع دائماً الحالة القديمة والجديدة للـ store كلما تغيرت الحالة:

```js
const logger = (config) =&gt; (set, get) =&gt; config(
  (...args) =&gt; {
    console.log('prev state', get());
    set(...args);
    console.log('next state', get());
  },
  get
);
```

يُفعَّل الوسيط بـ«التفاف» الدالة المُعطاة كوسيط لـ&nbsp;<em>create</em>&nbsp;في Zustand:

```js
// BEGIN HIGHLIGHT
const useNoteStore = create(logger((set, get) => ({
// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    // ...
  }
// BEGIN HIGHLIGHT
})))
// END HIGHLIGHT
```

الآن، كلما تغيرت حالة الـ store، يمكننا دائماً رؤية كيف تتغير الحالة في وحدة التحكم:

![صورة توضيحية](/images/mooc/37834b06ad73.webp)

عملياً، يعمل الوسيط الذي عرّفناه باستبدال الدالة الأصلية&nbsp;<em>set</em>&nbsp;بالدالة

```
  (...args) =&gt; {
    console.log('prev state', get());
    set(...args);
    console.log('next state', get());
  }
```

التي تطبع، إضافةً إلى استدعاء&nbsp;<em>set</em>، الحالة القديمة والجديدة (المتاحة عبر دالة&nbsp;<em>get</em>) في وحدة التحكم. أما الوسيط الثاني فهو&nbsp;<em>get</em>&nbsp;القديمة دون تغيير.

يمتلك Zustand أيضاً وسيط&nbsp;<em>devtools</em>&nbsp;جاهزاً يدمج الـ store مع إضافة&nbsp;<a href="https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd" target="_blank" rel="noopener">Redux DevTools</a>&nbsp;في المتصفح. وتُعدّ Devtools أداة تطوير مفيدة للغاية، إذ تتيح لك تتبّع تغييرات الحالة بصرياً.

الإعداد بسيط:

```js
import { create } from 'zustand'
// BEGIN HIGHLIGHT
import { devtools } from 'zustand/middleware'
// END HIGHLIGHT
// BEGIN HIGHLIGHT

const useNoteStore = create(devtools((set, get) => ({

// END HIGHLIGHT
  notes: [],
  filter: '',
  actions: {
    // ...
  }
// BEGIN HIGHLIGHT
})))
// END HIGHLIGHT
```

عند تثبيت إضافة Redux DevTools في المتصفح، يمكن فحص حالة الـ store وتغييراتها في أدوات تطوير المتصفح:

![صورة توضيحية](/images/mooc/8e1caa33c0a1.webp)

### اختبار stores في Zustand

أخيراً، لننظر في اختبار stores الخاصة بـ Zustand باستخدام Vitest.

لنبدأ، للتبسيط، بـ store العدّاد:

```js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  actions: {
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
    zero: () => set(() => ({ counter: 0 })),
  }
}))

export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)

// BEGIN HIGHLIGHT
export default useCounterStore
// END HIGHLIGHT
```

أضفنا إلى التعريف تصديراً لأجل الاختبارات، يتيح للاختبار الوصول إلى الـ store.

لنثبّت Vitest:

```bash
npm install --save-dev vitest
```

لننفّذ الاختبار في ملف&nbsp;<em>store.test.js</em>:

```js
import { beforeEach, describe, expect, it } from 'vitest'
import useCounterStore from './store'

beforeEach(() =&gt; {
  useCounterStore.setState({ counter: 0 })
})

describe('counter store', () =&gt; {
  it('initial state is 0', () =&gt; {
    expect(useCounterStore.getState().counter).toBe(0)
  })

  it('increment increases counter by 1', () =&gt; {
    useCounterStore.getState().actions.increment()
    expect(useCounterStore.getState().counter).toBe(1)
  })

  it('decrement decreases counter by 1', () =&gt; {
    useCounterStore.getState().actions.decrement()
    expect(useCounterStore.getState().counter).toBe(-1)
  })

  it('zero resets counter to 0', () =&gt; {
    useCounterStore.getState().actions.increment()
    useCounterStore.getState().actions.increment()
    useCounterStore.getState().actions.zero()
    expect(useCounterStore.getState().counter).toBe(0)
  })
})
```

الاختبارات بسيطة إلى حد كبير، إذ تستفيد من دالة&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">getState</a>&nbsp;التابعة للـ store، ما يتيح لها قراءة حالة الـ store وتنفيذ دواله.

قبل كل اختبار، يُعاد ضبط الـ store إلى حالته الأولية في كتلة&nbsp;<em>beforeEach</em>&nbsp;باستخدام دالة&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create#returns" target="_blank" rel="noopener">setState</a>&nbsp;التابعة له.

إعادة ضبط الـ store إلى حالته الأولية بسيطة في حالتنا. لكن الأمر ليس كذلك دائماً بالضرورة. يصف&nbsp;<a href="https://zustand.docs.pmnd.rs/learn/guides/testing#vitest" target="_blank" rel="noopener">توثيق</a>&nbsp;Zustand طريقة لإنشاء نسخة من stores لأجل الاختبار تُعاد ضبطها تلقائياً إلى حالتها الأولية قبل كل اختبار. غير أن الطريقة معقّدة بما يكفي وغير ضرورية لنا، لذا سنتجاهلها الآن.

إذن تستخدم الاختبارات الـ store مباشرةً. وإذا نُفّذ منطق أكثر تعقيداً عبر خطافات مخصّصة لاستخدام الـ store، فقد يلزم كتابة اختبارات تستفيد أيضاً من الخطافات. وفي العدّاد، يحدث استخدام الـ store عبر الخطافين&nbsp;<em>useCounter</em>&nbsp;و&nbsp;<em>useCounterControls</em>:

```js
const useCounterStore = create(set => ({
  // ...
}))

// BEGIN HIGHLIGHT
export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)
// END HIGHLIGHT
```

في هذه الحالة لا تحتوي الخطافات على أي منطق، بل تكشف فقط وبشكل منفصل القيمة المخزنة في الـ store ودوال الـ store. لذا فإن أسلوب الاختبار الذي استخدمناه أعلاه جيد تماماً.

ومع ذلك، لنصنع نسخة أخرى من الاختبارات لأغراض التوضيح، يُستخدم فيها الـ store بالطريقة نفسها تماماً التي يستخدمه بها التطبيق.

إن&nbsp;<em>useCounter</em>&nbsp;و&nbsp;<em>useCounterControls</em>&nbsp;خطافان من React، لذا يتطلب اختبارهما&nbsp;<a href="https://github.com/testing-library/react-testing-library" target="_blank" rel="noopener">React Testing Library</a>&nbsp;ومكتبة&nbsp;<a href="https://github.com/jsdom/jsdom" target="_blank" rel="noopener">jsdom</a>:

```bash
npm install --save-dev @testing-library/react jsdom
```

لنضف إعداد بيئة الاختبار إلى&nbsp;<em>vite.config.js</em>:

```js
export default defineConfig({
  plugins: [react()],
  // BEGIN HIGHLIGHT
  test: {
    environment: 'jsdom',
  },
   // END HIGHLIGHT
})
```

والاختبارات كما يلي:

```js
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCounterStore, { useCounter, useCounterControls } from './store'

beforeEach(() =&gt; {
  useCounterStore.setState({ counter: 0 })
})

describe('counter hooks', () =&gt; {
  it('useCounter returns initial value of 0', () =&gt; {
    const { result } = renderHook(() =&gt; useCounter())
    expect(result.current).toBe(0)
  })

  it('increment updates counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; controls.current.increment())

    expect(counter.current).toBe(1)
  })

  it('decrement updates counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; controls.current.decrement())

    expect(counter.current).toBe(-1)
  })

  it('zero resets counter', () =&gt; {
    const { result: counter } = renderHook(() =&gt; useCounter())
    const { result: controls } = renderHook(() =&gt; useCounterControls())

    act(() =&gt; {
      controls.current.increment()
      controls.current.increment()
      controls.current.zero()
    })

    expect(counter.current).toBe(0)
  })
})
```

ثمة أمور قليلة مثيرة للاهتمام في الاختبار. في بداية الاختبارات، تُعرَض الخطافات باستخدام دالة&nbsp;<a href="https://testing-library.com/docs/react-testing-library/api/#renderhook" target="_blank" rel="noopener">renderHook</a>:

```js
const { result: counter } = renderHook(() =&gt; useCounter())
const { result: controls } = renderHook(() =&gt; useCounterControls())
```

وبهذه الطريقة يصل الاختبار إلى القيم التي تُعيدها الخطافات، والمخزنة في المتغيرين&nbsp;<em>counter</em>&nbsp;و&nbsp;<em>controls</em>.

تُستدعى الخطافات بتغليف الاستدعاء داخل دالة&nbsp;<a href="https://testing-library.com/docs/react-testing-library/api/#act" target="_blank" rel="noopener">act</a>:

```
act(() =&gt; {
  controls.current.increment()
  controls.current.increment()
  controls.current.zero()
})
```

وأخيراً يأتي توقّع الاختبار:

```
expect(counter.current).toBe(0)
```

وكما نرى، للوصول إلى الخطاف نفسه لا نزال بحاجة إلى أخذ الحقل&nbsp;<em>current</em>&nbsp;من الكائن الذي تُعيده&nbsp;<em>renderHook</em>، وهو ما يقابل القيمة الحالية للخطاف.

> ما هي act؟
>
> <em>act</em>&nbsp;دالة مساعدة تضمن معالجة جميع تحديثات الحالة وآثارها الجانبية قبل أن تتابع شيفرة الاختبار.
>
> عندما يحدث تغيير في الحالة داخل مكوّن أو خطاف في React، لا يحدّث React الحالة فوراً بل يضع التحديثات في قائمة انتظار. وتجبر act هذه التحديثات المنتظرة على التنفيذ.
>
> بدون act، قد يتحقق اختبار من الحالة قبل أن يتيح لـ React الوقت لتحديثها، ما يؤدي إلى فشل الاختبار أو إعطاء نتائج غير صحيحة.
>
> تُغلّف React Testing Library كثيراً من دوالها (مثل fireEvent وuserEvent) داخل act تلقائياً، لكن عند اختبار الخطافات مباشرةً تكون الحاجة إليها مطلوبة عادةً.

يستخدم الاختبار عبر الخطافات مكتبة React Testing Library ويعرض الخطافات في سياق React حقيقي باستخدام jsdom. وهذا الأسلوب أبطأ بكثير من الاختبارات التي تستخدم الـ store مباشرةً، لذا إذا لم تحتوِ الخطافات على منطق معقّد، فقد يكفي إجراء الاختبارات باستخدام الـ store مباشرة.

الشيفرة التي تحتوي على اختبارات عدّاد Zustand متاحة على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-counter" target="_blank" rel="noopener">GitHub</a>.

### اختبار store الملاحظات

اختبار store تطبيق الملاحظات حالة أكثر تحدياً بعض الشيء، لأن الـ store يحتوي على دوال غير متزامنة تستدعي الخادم:

```js
import { create } from 'zustand'
import noteService from './services/notes'

const useNoteStore = create(set => ({
  notes: [],
  filter: '',
  actions: {
    add: async (content) => {
      // BEGIN HIGHLIGHT
      const newNote = await noteService.createNew(content)
      // END HIGHLIGHT
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    toggleImportance: async (id) => {
      const note = useNoteStore.getState().notes.find(n => n.id === id)
      // BEGIN HIGHLIGHT
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
       // END HIGHLIGHT
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      // BEGIN HIGHLIGHT
      const notes = await noteService.getAll()
      // END HIGHLIGHT
      set(() => ({ notes }))
    }
  }
}))

export const useNotes = () => {
  const notes = useNoteStore((state) => state.notes)
  const filter = useNoteStore((state) => state.filter)

  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
  return notes
}

export const useFilter = () => useNoteStore((state) => state.filter)
export const useNoteActions = () => useNoteStore((state) => state.actions)
```

هذه المرة تحتوي&nbsp;<em>useNotes</em>&nbsp;أيضاً على قدر كبير من المنطق، لذا يُحتمل أن يكون الاختبار عبر الخطافات باستخدام React Testing Library هو الأنسب.

لنثبّت المكتبات المطلوبة:

```bash
npm install --save-dev vitest @testing-library/react jsdom
```

لنضف إعداد بيئة الاختبار إلى&nbsp;<em>vite.config.js</em>:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BEGIN HIGHLIGHT
  test: {
    environment: 'jsdom',
  },
   // END HIGHLIGHT
})
```

الجزء الأول من الاختبارات كما يلي:

```sql
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/notes', () =&gt; ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

import noteService from './services/notes'
import useNoteStore, { useNotes, useFilter, useNoteActions } from './store'

beforeEach(() =&gt; {
  useNoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useNoteActions', () =&gt; {
  it('initialize loads notes from service', async () =&gt; {
    const mockNotes = [{ id: 1, content: 'Test', important: false }]
    noteService.getAll.mockResolvedValue(mockNotes)

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.initialize()
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current).toEqual(mockNotes)
  })

  it('add appends a new note', async () =&gt; {
    const newNote = { id: 2, content: 'New note', important: false }
    noteService.createNew.mockResolvedValue(newNote)

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.add('New note')
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current).toContainEqual(newNote)
  })

  it('toggleImportance flips important flag', async () =&gt; {
    const note = { id: 1, content: 'Test', important: false }
    useNoteStore.setState({ notes: [note] })
    noteService.update.mockResolvedValue({ ...note, important: true })

    const { result } = renderHook(() =&gt; useNoteActions())

    await act(async () =&gt; {
      await result.current.toggleImportance(1)
    })

    const { result: notesResult } = renderHook(() =&gt; useNotes())
    expect(notesResult.current[0].important).toBe(true)
  })
})
```

ثمة الكثير مما يحتاج إلى استيعاب في هذه الاختبارات. تنشئ الاختبارات، باستخدام Vitest، نسخة&nbsp;<a href="https://vitest.dev/guide/mocking" target="_blank" rel="noopener">mock</a>&nbsp;من&nbsp;<em>noteService</em>&nbsp;المسؤولة عن التواصل مع الخادم:

```sql
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./services/notes', () =&gt; ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))
```

تستبدل&nbsp;<a href="https://vitest.dev/api/vi.html#vi-mock" target="_blank" rel="noopener">vi.mock</a>&nbsp;الـ&nbsp;<em>noteService</em>&nbsp;في وحدة&nbsp;<em>./services/notes</em>&nbsp;بنسختها الخاصة، حيث تُستبدل جميع الدوال بدوال mock تُعيدها&nbsp;<a href="https://vitest.dev/api/vi.html#vi-fn" target="_blank" rel="noopener">vi.fn</a>.

قبل كل اختبار، يُعاد ضبط الـ store إلى حالته الأولية وتُفرَّغ دوال mock:

```
beforeEach(() =&gt; {
  useNoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})
```

في بداية كل اختبار، يُخبَر&nbsp;<em>noteService</em>&nbsp;المُستبدَل، عبر دالة&nbsp;<a href="https://vitest.dev/api/mock.html#mockresolvedvalue" target="_blank" rel="noopener">mockResolvedValue</a>، بكيفية تصرفه في سياق الاختبار:

```js
it('initialize loads notes from service', async () => {
  // BEGIN HIGHLIGHT
  const mockNotes = [{ id: 1, content: 'Test', important: false }]
  noteService.getAll.mockResolvedValue(mockNotes)
  // END HIGHLIGHT

  const { result } = renderHook(() => useNoteActions())

  await act(async () => {
    await result.current.initialize()
  })

  const { result: notesResult } = renderHook(() => useNotes())
  expect(notesResult.current).toEqual(mockNotes)
})
```

أولاً، يحدّد الاختبار أنه عند استدعاء دالة&nbsp;<em>noteService.getAll</em>، تُعاد إلى الـ store الملاحظات الموجودة في مصفوفة&nbsp;<em>mockNotes</em>.

والشيء الذي يجري اختباره هو استدعاء دالة&nbsp;<em>initialize</em>:

```
await act(async () =&gt; {
  await result.current.initialize()
})
```

ولأن هذه دالة غير متزامنة، يجب انتظار اكتمال الاستدعاء بالكلمة المفتاحية&nbsp;<em>await</em>.

وأخيراً، يتحقق الاختبار من أن حالة الـ store تحتوي على القائمة نفسها من الملاحظات التي أعادتها&nbsp;<em>noteService.getAll</em>&nbsp;المُستبدَلة:

```js
const { result: notesResult } = renderHook(() =&gt; useNotes())
expect(notesResult.current).toEqual(mockNotes)
```

تتبع الاختبارات الأخرى النمط نفسه: أولاً يُحدَّد ما تُعيده دالة&nbsp;<em>noteService</em>&nbsp;التي يستدعيها الـ store، ثم يُشغَّل الاختبار الفعلي.

ويتحقق الجزء الثاني من الاختبارات من أن الترشيح يعمل بشكل صحيح:

```js
describe('useNotes filtering', () =&gt; {
  const notes = [
    { id: 1, content: 'A', important: true },
    { id: 2, content: 'B', important: false },
  ]

  beforeEach(() =&gt; {
    useNoteStore.setState({ notes })
  })

  it('returns all notes with no filter', () =&gt; {
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toHaveLength(2)
  })

  it('filters important notes', () =&gt; {
    useNoteStore.setState({ notes, filter: 'important' })
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toEqual([notes[0]])
  })

  it('filters nonimportant notes', () =&gt; {
    useNoteStore.setState({ notes, filter: 'nonimportant' })
    const { result } = renderHook(() =&gt; useNotes())
    expect(result.current).toEqual([notes[1]])
  })
})
```

تُهيَّأ الحالة بملاحظتين، إحداهما مهمة والأخرى غير مهمة. وتتحقق حالات الاختبار الثلاث من أن&nbsp;<em>useNotes</em>&nbsp;تُعيد الملاحظات الصحيحة لجميع قيم المرشّح.

شيفرة التطبيق النهائية على <a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-6" target="_blank" rel="noopener">GitHub</a> في الفرع <em>part6-6</em>.

####

<div class="tasks">

**14. anecdotes، الخطوة 11**

</div>

<div class="tasks">

**15. anecdotes، الخطوة 12**

</div>

<div class="tasks">

**16. anecdotes، الخطوة 13**

</div>

<div class="tasks">

**17. anecdotes، الخطوة 14**

</div>

<div class="tasks">

**18. anecdotes، الفحص النهائي**

</div>
