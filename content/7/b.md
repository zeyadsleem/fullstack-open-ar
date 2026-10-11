---
part: 7
letter: b
title: "المزيد عن خطافات React"
mainImage: /images/part-7.svg
lang: ar
---
تختلف التمارين في هذا الجزء من المقرر قليلاً عن التمارين السابقة. وكالعادة، هناك بعض التمارين المتعلقة بنظرية هذا الفصل. أما الفصول الأخرى في هذا الجزء فليس لها تمارين منفصلة.

بالإضافة إلى ذلك، يحتوي هذا الجزء على سلسلة تمارين أكبر توسّع تطبيق BlogList الذي بنيته في الجزأين 4 و5. وتجد تلك التمارين على الرابط <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5" target="_blank" rel="noopener">https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5</a>.

### خطافات React

يوفّر React 18 <a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener">خطافاً مدمجاً</a>&nbsp;مختلفاً، وأشهرها الخطافان&nbsp;<a href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">useState</a>&nbsp;و&nbsp;<a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">useEffect</a>&nbsp;اللذان استخدمناهما باستفاضة حتى الآن.

في <a href="/part5/props_children_and_component_refs#references-to-components-with-ref" target="_blank" rel="noopener">الجزء 5</a> استخدمنا <a href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">useRef</a> و<a href="https://react.dev/reference/react/useImperativeHandle" target="_blank" rel="noopener">useImperativeHandle</a>، ما أتاح لمكوّن أن يوفّر الوصول إلى دواله لمكوّنات أخرى. وفي <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">الجزء 6</a> استخدمنا <a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a> لتنفيذ حالة عامة.

خلال السنوات القليلة الماضية، أصبحت الخطافات الطريقة القياسية التي تكشف بها المكتبات عن واجهات API الخاصة بها. وقد رأينا أمثلة عدة على ذلك في هذا المقرر:&nbsp;<a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>&nbsp;توفّر&nbsp;<em>useStore</em>&nbsp;للوصول إلى الحالة العامة، و<a href="https://reactrouter.com/" target="_blank" rel="noopener">React Router</a>&nbsp;يكشف عن&nbsp;<em>useNavigate</em>&nbsp;و&nbsp;<em>useParams</em>&nbsp;للتنقّل برمجياً والوصول إلى معاملات URL، و<a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">React Query</a>&nbsp;توفّر&nbsp;<em>useQuery</em>&nbsp;و&nbsp;<em>useMutation</em>&nbsp;لإدارة حالة الخادم.

وكما ذُكر في <a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">الجزء 1</a>، ليست الخطافات دوالاً عادية، وعند استخدامها يجب أن نلتزم بـ<a href="https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks" target="_blank" rel="noopener">قواعد أو قيود</a> معينة. لنستعرض قواعد استخدام الخطافات، منقولة حرفياً من وثائق React الرسمية:

<strong>لا تستدعِ الخطافات داخل الحلقات أو الشروط أو الدوال المتداخلة.</strong>&nbsp;بدلاً من ذلك، استخدم الخطافات دائماً في المستوى الأعلى من دالة React الخاصة بك.

<strong>يمكنك استدعاء الخطافات فقط بينما يعرض React مكوّناً دالّياً:</strong>
- استدعِها في المستوى الأعلى داخل جسم المكوّن الدالّي.
- استدعِها في المستوى الأعلى داخل جسم خطاف مخصص.

هناك <a href="https://www.npmjs.com/package/eslint-plugin-react-hooks" target="_blank" rel="noopener">إضافة ESlint</a> جاهزة يمكن استخدامها للتحقق من أن التطبيق يستخدم الخطافات بشكل صحيح:

![صورة توضيحية](/images/mooc/6a88cc6b0ef7.webp)

إلى جانب الخطافات التي استخدمناها بالفعل، يوفّر React عدة خطافات مدمجة أخرى يجدر معرفتها. في هذا القسم ننظر في اثنين منها،&nbsp;<em>useMemo</em>&nbsp;و&nbsp;<em>useCallback</em>&nbsp;وكلاهما معنيّ بتحسين الأداء. بعد ذلك ننتقل إلى الخطافات المخصصة، التي تتيح لك تجميع أي توليفة من الخطافات في دالة خاصة بك قابلة لإعادة الاستخدام.

### useMemo

في كل مرة يُعاد فيها عرض مكوّن React، يُنفَّذ جسم الدالة بالكامل من جديد. هذا مقبول في معظم المكوّنات، لكن أحياناً يجري المكوّن عملية حسابية مكلفة، مثل تصفية قائمة كبيرة أو ترتيب بيانات أو اشتقاق قيمة معقدة، فتؤدي إعادة تنفيذها في كل عرض إلى إهدار الوقت.

<a href="https://react.dev/reference/react/useMemo" target="_blank" rel="noopener">useMemo</a> يتيح لك تخزين نتيجة حساب ما مؤقتاً بين عمليات العرض. وهو يقبل دالة تنفّذ الحساب ومصفوفة اعتماديات. ولا يعيد React تنفيذ الدالة إلا عندما تتغيّر إحدى الاعتماديات، وإلا فإنه يعيد النتيجة المخزّنة سابقاً.

لننظر إلى مكوّن يعرض قائمة كبيرة من العناصر مصفّاة حسب عبارة بحث:

```js
import { useState } from 'react'

const expensiveCalculation = () => {
  let sum = 0
  for (let i = 0; i < 100000; i++) sum += i
  return sum
}

const ITEMS = Array.from({ length: 10000 }, (_, i) => `item ${i + 1}`)

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  console.log('filtering...')
  const filtered = ITEMS.filter(item => {
    expensiveCalculation()
    return item.includes(filter)
  })

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="filter items"
      />
      <button onClick={() => setDarkMode(!darkMode)}>toggle dark mode</button>
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default FilteredList

```

أصبحت تصفية القائمة الآن تستغرق وقتاً، ويعود ذلك جزئياً إلى الإبطاء المصطنع الذي أضفناه.

تكمن مشكلة هذا المكوّن في أن النقر على زر الوضع الداكن يؤدي إلى إعادة تصفية العناصر الـ10000 كلها رغم أن نص التصفية لم يتغيّر.

يمكننا إصلاح ذلك باستخدام&nbsp;<em>useMemo</em>:

```js

import { useState, useMemo } from 'react'


const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)


  const filtered = useMemo(() => {

    console.log('filtering...')
    return ITEMS.filter(item => {
      expensiveCalculation()
      return item.includes(filter)
    })

  }, [filter])


  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      //...
    </div>
  )
}

```

باستخدام&nbsp;<em>useMemo</em>، لا تُنفَّذ التصفية المكلفة إلا عندما تتغيّر&nbsp;<em>filter</em>. أما تبديل الوضع الداكن فلا يحدّث سوى لون الخلفية، وتُعاد القائمة المصفّاة المخزّنة مؤقتاً فوراً.

تعمل مصفوفة الاعتماديات تماماً كما في&nbsp;<em>useEffect</em>: يقارن React كل قيمة بالقيمة من العرض السابق. فإذا كانت جميع القيم مطابقة، أعيد استخدام القيمة المخزّنة. وإذا اختلف أي منها، أعيد تنفيذ الدالة ووُضعت النتيجة مؤقتاً للعرض التالي.

يمكن استخدام&nbsp;<em>useMemo</em>&nbsp;أيضاً لتخزين الكائنات والمصفوفات الممرَّرة كـ props مؤقتاً، ما يمنع عمليات إعادة العرض غير الضرورية للمكوّنات الابنة التي تعتمد على تساوي المراجع. على سبيل المثال:

```js
const App = () => {
  const [filter, setFilter] = useState('')

  // بدون useMemo، يكون 'options' كائناً جديداً في كل عرض حتى لو لم يتغيّر filter

  const options = useMemo(() => ({ caseSensitive: false, filter }), [filter])


  return <SearchResults options={options} />
}

```

<em>useMemo</em>&nbsp;تحسين للأداء، ولا ينبغي اللجوء إليه افتراضياً. فـ<a href="https://wiki.c2.com/?PrematureOptimization" target="_blank" rel="noopener">التخزين المؤقت المبكر</a>&nbsp;يضيف تعقيداً بلا فائدة عندما يكون الحساب سريعاً. قِس أولاً، ولا تُضف&nbsp;<em>useMemo</em>&nbsp;إلا بعد أن تتأكد من أن حساباً معيناً يمثل عنق زجاجة.

### React.memo

بينما تخزّن&nbsp;<em>useMemo</em>&nbsp;نتيجة حساب داخل مكوّن، تأخذ&nbsp;<a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a>&nbsp;مقاربة مختلفة: فهي تخزّن الخرج المعروض لمكوّن كامل. و<em>React.memo</em>&nbsp;ليست خطافاً بل مكوّن عالي الرتبة (higher-order component)، ونغطيها هنا لأنها تكمّل&nbsp;<em>useMemo</em>&nbsp;جيداً. فعندما يُغلَّف مكوّن بـ<em>React.memo</em>، يتخطى React إعادة عرضه إذا لم تتغيّر props الخاصة به منذ العرض الأخير.

```js
const MyComponent = React.memo(({ value }) => {
  console.log('rendered')
  return <div>{value}</div>
})

```

بدون&nbsp;<em>React.memo</em>، يُعاد عرض&nbsp;<em>MyComponent</em>&nbsp;في كل مرة يُعرض فيها المكوّن الأب، حتى لو كانت&nbsp;<em>value</em>&nbsp;هي نفسها. ومعها، يقارن React بين props القديمة والجديدة باستخدام التساوي السطحي (shallow equality)، ولا يعيد العرض إلا عندما يتغيّر شيء فعلاً.

لاحظ أن&nbsp;<em>React.memo</em>&nbsp;تفحص props فقط. فإذا كان المكوّن يستخدم قيمة سياق (context) أو حالته الخاصة، فسيظل يُعاد عرضه عند تغيّرها.

تتناغم&nbsp;<em>React.memo</em>&nbsp;طبيعياً مع&nbsp;<em>useMemo</em>&nbsp;التي تمنع إعادة تنفيذ الحسابات المكلفة، بينما تمنع&nbsp;<em>React.memo</em>&nbsp;المكوّن نفسه من إعادة العرض.

إذا كان مكوّن مخزّن مؤقتاً يتلقى مرجع دالة أو كائن جديداً في كل عرض، تبطل فائدة التخزين المؤقت، وهنا يأتي دور&nbsp;<em>useCallback</em>.

### useCallback

الدوال المعرّفة داخل مكوّن تُعاد إنشاؤها ككائنات جديدة في كل عرض. هذا غير ضار عادةً، لكنه يصبح مشكلة في حالتين محددتين:
- مكوّن ابن مغلَّف بـ<a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a> يتلقى الدالة كـ prop. ولأن الدالة كائن جديد في كل مرة، يرى المكوّن الابن دائماً prop متغيّراً فيُعاد عرضه على أي حال، فتبطل فائدة التخزين المؤقت.
- دالة مُدرجة كاعتمادية في <em>useEffect</em> أو <em>useMemo</em>. فإعادة إنشاء الدالة في كل عرض تعني أن التأثير أو القيمة المخزّنة يُعاد تنفيذه في كل عرض.

<a href="https://react.dev/reference/react/useCallback" target="_blank" rel="noopener">useCallback</a>&nbsp;تحل هذه المشكلة بتخزين الدالة نفسها مؤقتاً بين عمليات العرض، فتعيد كائن الدالة نفسه ما دامت اعتمادياتها لم تتغيّر. وهي تقبل دالة ومصفوفة اعتماديات، بمبنى مطابق لـ&nbsp;<em>useMemo</em>.

إليك مثالاً ملموساً. لدينا مكوّن&nbsp;<em>NoteList</em>&nbsp;مكلف في العرض، لذا نغلّفه بـ<em>React.memo</em>:

```js
// تجعل React.memo هذا المكوّن يتخطى إعادة العرض إذا لم تتغيّر props الخاصة به
const NoteList = memo(({ onDelete, notes }) => {
  console.log('NoteList rendered')
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content}
          <button onClick={() => onDelete(note.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
})

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  const handleDelete = (id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }

  const handleAdd = () => {
    setNotes(notes => [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }

  return (
    <div>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  )
}

```

المشكلة هنا أن&nbsp;<em>handleDelete</em>&nbsp;معرّفة كدالة عادية داخل&nbsp;<em>App</em>. ففي كل مرة يُعاد فيها عرض&nbsp;<em>App</em>&nbsp;(وهو ما يحدث مع كل ضغطة مفتاح في حقل إدخال الملاحظة)، يُنشأ كائن دالة جديد تماماً ويُمرَّر إلى&nbsp;<em>NoteList</em>&nbsp;كـ prop باسم&nbsp;<em>onDelete</em>.

من منظور <em>React.memo</em>، تغيّر الـ prop، لذا يُعاد عرض <em>NoteList</em> رغم أن القائمة نفسها لم تتغيّر:

![صورة توضيحية](/images/mooc/ed3c70d1bf25.webp)

يمكننا إصلاح ذلك باستخدام&nbsp;<em>useCallback</em>، التي تعيد كائن الدالة نفسه بين عمليات العرض ما دامت اعتمادياتها لم تتغيّر:

```js
import { useState, useCallback, memo } from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')


  const handleDelete = useCallback((id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }, []) // لا اعتماديات خارجية: لا تحتاج هذه الدالة إلى التغيّر أبداً


  // ...
  return (
    // ...
  )
}

```

الآن أصبحت&nbsp;<em>handleDelete</em>&nbsp;مستقرة: يعيد React كائن الدالة نفسه تماماً في كل عرض، فلا ترى&nbsp;<em>React.memo</em>&nbsp;أي تغيّر في prop الـ<em>onDelete</em>&nbsp;وتتخطى إعادة عرض&nbsp;<em>NoteList</em>&nbsp;بالكامل.

مثل&nbsp;<em>useMemo</em>، لا تلجأ إلى&nbsp;<em>useCallback</em>&nbsp;إلا عند وجود مشكلة ملموسة، مثل إعادة عرض مكوّن ابن مخزّن مؤقتاً بلا داعٍ أو تنفيذ&nbsp;<em>useEffect</em>&nbsp;أكثر من اللازم بسبب اعتمادية دالة. فإضافتها في كل مكان تجعل الشيفرة أصعب في القراءة دون تحقيق أي مكسب في الأداء.

### الخطافات المخصصة

يتيح React إمكانية إنشاء خطافات <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">مخصصة</a>. ووفقاً للوثائق، فإن الغرض الأساسي من الخطافات المخصصة هو تسهيل إعادة استخدام المنطق المستخدم في المكوّنات:

> <em>يتيح لك بناء خطافاتك الخاصة استخلاص منطق المكوّن في دوال قابلة لإعادة الاستخدام.</em>

الخطافات المخصصة دوال JavaScript عادية يمكنها استخدام أي خطافات أخرى، شرط أن تلتزم بـ<a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">قواعد الخطافات</a>. إضافة إلى ذلك، يجب أن يبدأ اسم الخطاف المخصص بكلمة <em>use</em>.

الفكرة الجوهرية هي أن أي منطق ذي حالة تجد نفسك تكرّره بين المكوّنات هو مرشّح للاستخلاص في خطاف مخصص. فكل استدعاء للخطاف نفسه ينشئ قطعة حالة مستقلة. وهذا ما يميّز الخطاف المخصص عن دالة مساعدة عادية.

نفّذنا بالفعل عدة خطافات مخصصة في الجزء 6. فقد أُنشئ الخطافان <em>useNotes</em> و<em>useNoteActions</em> في فصل <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-2" target="_blank" rel="noopener">Zustand</a>، وعُرّف <em>useCounter</em> في فصل <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">React Query وContext</a>.

#### خطاف العدّاد

نفّذنا تطبيق عدّاد في <a href="/part1/component_state_event_handlers#event-handling" target="_blank" rel="noopener">الجزء 1</a> يمكن زيادة قيمته أو إنقاصها أو إعادة تعيينها. وشيفرة التطبيق كما يلي:

```js
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}

```

لنستخلص منطق العدّاد في خطاف مخصص. وشيفرة الخطاف كما يلي:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}

```

يستخدم خطافنا المخصص خطاف&nbsp;<em>useState</em>&nbsp;داخلياً لإنشاء حالته. ويعيد الخطاف كائناً تشمل خصائصه قيمة العدّاد إضافة إلى دوال للتحكم في القيمة.

يمكن لمكوّنات React استخدام الخطاف كما هو موضح أدناه:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}

```

بهذه الطريقة يمكننا نقل حالة مكوّن&nbsp;<em>App</em>&nbsp;والتحكم فيها بالكامل إلى خطاف&nbsp;<em>useCounter</em>. فإدارة حالة العدّاد ومنطقه أصبحت الآن مسؤولية الخطاف المخصص.

ويمكن&nbsp;<em>إعادة استخدام</em>&nbsp;الخطاف نفسه في التطبيق الذي كان يتتبع عدد النقرات على الزرين الأيسر والأيمن:

```js
const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}

```

ينشئ التطبيق&nbsp;<em>عدّادين</em>&nbsp;منفصلين تماماً. يُسند الأول إلى المتغير&nbsp;<em>left</em>&nbsp;والآخر إلى المتغير&nbsp;<em>right</em>. وكل استدعاء لـ<em>useCounter</em>&nbsp;ينشئ قطعة الحالة المستقلة الخاصة به.

#### الخطافات المخصصة وإعادة عرض المكوّنات

يطرح السؤال التالي نفسه هنا: متى يُعاد فعلاً عرض مكوّن يستخدم خطافاً مخصصاً؟

الجواب بسيط متى فهمت ما هو الخطاف المخصص حقاً. فالخطاف المخصص ليس كياناً منفصلاً من منظور المكوّن، بل هو مجرد قطعة من منطق المكوّن نفسه نُقلت إلى دالة منفصلة. وهذا يعني أن كل الحالة والتأثيرات المعرّفة داخل الخطاف تنتمي إلى المكوّن الذي يستدعي الخطاف، لا إلى الخطاف نفسه.

وبالتالي، فإن قواعد إعادة العرض هي نفسها تماماً كما مع الخطافات المدمجة. فيُعاد عرض المكوّن عندما تتغيّر حالة تُدار داخل الخطاف، أو تتغيّر قيمة سياق يشترك فيها الخطاف، أو يتسبب أي خطاف يستدعيه الخطاف المخصص داخلياً في إعادة عرض.

في المقابل، لا تتسبب أشياء مثل إعادة إسناد متغيرات عادية داخل الخطاف، أو تغيّر المعاملات الممرَّرة إلى الخطاف من تلقاء نفسها، في إعادة عرض.

غير أن المعاملات تستحق نظرة أدق. فتمرير قيمة جديدة إلى خطاف لا يجدول إعادة عرض بحد ذاته، لكن إذا استخدم الخطاف ذلك المعامل كاعتمادية في&nbsp;<em>useEffect</em>&nbsp;أو&nbsp;<em>useMemo</em>، فإن تغيّر المعامل سيؤدي إلى إعادة تنفيذ التأثير أو القيمة المخزّنة، وإذا استدعى ذلك بدوره دالة تعيين حالة، فسيُعاد عرض المكوّن.

طريقة مفيدة للتفكير في الأمر: تخيّل أنك نسخت كل الشيفرة الموجودة داخل خطافك المخصص ولصقتها مباشرة في المكوّن. سيكون سلوك إعادة العرض مطابقاً. فالخطاف مجرد طريقة لتنظيم تلك الشيفرة، وليس حداً يعامله React معاملة خاصة.

```js
const useCounter = () => {

  const [count, setCount] = useState(0) // هذه الحالة تنتمي إلى المكوّن المستدعي

  return {
    count,
    increment: () => setCount(c => c + 1)
  }
}

const MyComponent = () => {
  const { count, increment } = useCounter()

  // يُعاد العرض كلما حُدّثت حالة count داخل الخطاف

}

```

#### خطاف حقل النموذج

التعامل مع النماذج في React صعب بعض الشيء. يعرض التطبيق التالي على المستخدم نموذجاً يطلب منه إدخال اسمه وتاريخ ميلاده وطوله:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name:
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br/>
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br />
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height}
      </div>
    </div>
  )
}

```

لكل حقل في النموذج حالته الخاصة. ولإبقاء حالة النموذج متزامنة مع البيانات التي يوفرها المستخدم، علينا تسجيل معالج&nbsp;<em>onChange</em>&nbsp;مناسب لكل عنصر من عناصر&nbsp;<em>input</em>. والنمط متطابق في كل حقل، ولا يختلف سوى اسم متغير الحالة. وهذا بالضبط نوع التكرار الذي صُممت الخطافات المخصصة للتخلص منه.

لنعرّف خطافنا المخصص&nbsp;<em>useField</em>&nbsp;الذي يبسّط إدارة حالة النموذج:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

```

تستقبل دالة الخطاف نوع حقل الإدخال كمعامل. وهي تعيد جميع السمات التي يحتاجها عنصر&nbsp;<em>input</em>: نوعه وقيمته ومعالج onChange.

ويمكن استخدام الخطاف بالطريقة التالية:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange}
        />
        // ...
      </form>
// ...
      <div>

        {name.value} {born} {height}

      </div>
    </div>
  )
}

```

### خصائص النشر

يمكننا تبسيط الأمور أكثر قليلاً. فلأن كائن&nbsp;<em>name</em>&nbsp;يحتوي بالضبط على جميع الخصائص التي يتوقع عنصر&nbsp;<em>input</em>&nbsp;استقبالها كـ props، يمكننا تمرير الـ props إلى العنصر باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener">صيغة النشر</a>&nbsp;بالطريقة التالية:

```
<input {...name} />

```

وكما يوضح&nbsp;<a href="https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax" target="_blank" rel="noopener">المثال</a>&nbsp;في وثائق React، فإن الطريقتين التاليتين لتمرير props إلى مكوّن تعطيان النتيجة نفسها تماماً:

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />

```

فيصبح التطبيق مبسّطاً بالشكل التالي:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name:
        <input  {...name} />
        <br/>
        birthdate:
        <input {...born} />
        <br />
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}

```

يصبح التعامل مع النماذج أبسط بكثير عندما تُغلَّف التفاصيل الدقيقة المزعجة المتعلقة بمزامنة حالة النموذج داخل خطافنا المخصص.

#### حفظ الحالة باستمرار باستخدام خطاف مخصص

يمكن للخطافات المخصصة أن تجمع عدة خطافات مدمجة لتغليف سلوك أكثر تعقيداً. ومن الميزات الشائعة الحاجة إلى حفظ الحالة في&nbsp;<em>localStorage</em>&nbsp;لتظل باقية بعد تحديث الصفحة. وهذا خطاف&nbsp;<em>useLocalStorage</em>&nbsp;يلفّ&nbsp;<em>useState</em>&nbsp;ويبقي القيمة متزامنة مع localStorage:

```js
import { useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

```

يقبل الخطاف مفتاح تخزين وقيمة أولية. وفي العرض الأول يقرأ من localStorage، ويرجع إلى&nbsp;<em>initialValue</em>&nbsp;إذا لم يكن هناك شيء مخزّن بعد. ودالة التعيين المعادة تحدّث حالة React وlocalStorage في الوقت نفسه.

ويبدو المكوّن الذي يستخدمه تماماً كالمكوّن الذي يستخدم&nbsp;<em>useState</em>&nbsp;العادي:

```js
const App = () => {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Hello, {name}! (your name is stored in localStorage)</p>
    </div>
  )
}

```

لا يعرف المكوّن شيئاً عن تورّط localStorage. فهذا الشأن مخفي بالكامل داخل الخطاف.

### المزيد عن الخطافات

الخطافات المخصصة ليست مجرد أداة لإعادة استخدام الشيفرة، بل توفر أيضاً طريقة أفضل لتقسيمها إلى أجزاء معيارية أصغر.

بدأ الإنترنت يمتلئ بمزيد من المواد المفيدة المتعلقة بالخطافات. والمصادر التالية تستحق الاطلاع:
- <a href="https://github.com/rehooks/awesome-react-hooks" target="_blank" rel="noopener">موارد رائعة عن خطافات React</a>
- <a href="https://usehooks.com/" target="_blank" rel="noopener">وصفات سهلة الفهم لخطافات React من Gabe Ragland</a>

<div class="tasks">

**1. خطاف useField**

</div>

<div class="tasks">

**2. useField مع إعادة التعيين**

</div>

<div class="tasks">

**3. إصلاح مشكلة النشر 1**

</div>

<div class="tasks">

**4. useAnecdotes الخطوة 1**

</div>

<div class="tasks">

**5. useAnecdotes الخطوة 2**

</div>

<div class="tasks">

**6. useAnecdotes الخطوة 3**

</div>

<div class="tasks">

**7. مراجعة anecdotes**

</div>
