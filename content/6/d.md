---
part: 6
letter: d
title: "الفصل 4: React Query وContext API"
mainImage: /images/part-6.svg
lang: ar
---
في نهاية هذا الجزء، سنتناول بضع طرق أخرى مختلفة لإدارة حالة التطبيق.

لنواصل مع تطبيق الملاحظات. سنركّز على التواصل مع الخادم. لنبدأ التطبيق من الصفر. النسخة الأولى كما يلي:

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return (
    &lt;div>
      &lt;h2>Notes app&lt;/h2>
      &lt;form onSubmit={addNote}>
        &lt;input name="note" />
        &lt;button type="submit">add&lt;/button>
      &lt;/form>
      {notes.map((note) => (
        &lt;li key={note.id}>
          {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
          &lt;button onClick={() => toggleImportance(note.id)}>
            {note.important ? 'make not important' : 'make important'}
          &lt;/button>
        &lt;/li>
      ))}
    &lt;/div>
  )
}

export default App
```

الشيفرة الأولية موجودة على GitHub في هذا&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-0" target="_blank" rel="noopener">المستودع</a>، في الفرع&nbsp;<em>part6-0</em>.

### إدارة البيانات على الخادم باستخدام مكتبة TanStack Query

سنستخدم الآن مكتبة&nbsp;<a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">TanStack Query</a>&nbsp;لتخزين البيانات المسترجَعة من الخادم وإدارتها.

ثبّت المكتبة بالأمر

```bash
npm install @tanstack/react-query
```

نحتاج إلى بضع إضافات في الملف&nbsp;<em>main.jsx</em>&nbsp;لتمرير دوال المكتبة إلى التطبيق بأكمله:

```js
import { createRoot } from 'react-dom/client'
// BEGIN HIGHLIGHT
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// END HIGHLIGHT

import App from './App.jsx'

// BEGIN HIGHLIGHT
const queryClient = new QueryClient()
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  // BEGIN HIGHLIGHT
  &lt;QueryClientProvider client={queryClient}>
    &lt;App />
  &lt;/QueryClientProvider>
  // END HIGHLIGHT
)
```

لنستخدم&nbsp;<a href="https://github.com/typicode/json-server" target="_blank" rel="noopener">JSON Server</a>&nbsp;كما في الأجزاء السابقة لمحاكاة الواجهة الخلفية. JSON Server مهيّأ مسبقاً في المشروع المثال، ويحتوي جذر المشروع على ملف&nbsp;<em>db.json</em>&nbsp;يضم افتراضياً ملاحظتين. يمكنك تشغيل الخادم بالأمر:

```bash
npm run server
```

يمكننا الآن استرجاع الملاحظات في مكوّن&nbsp;<em>App</em>. تتوسّع الشيفرة كما يلي:

```js

// BEGIN HIGHLIGHT
import { useQuery } from '@tanstack/react-query'
// END HIGHLIGHT

const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  // BEGIN HIGHLIGHT
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return await response.json()
    }
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isPending) {
    return &lt;div>loading data...&lt;/div>
  }

  const notes = result.data
  // END HIGHLIGHT

  return (
    // ...
  )
}
```

يتم جلب البيانات من الخادم، كما في الفصل السابق، باستخدام دالة&nbsp;<em>fetch</em>&nbsp;من Fetch API. غير أن استدعاء الدالة أصبح الآن ملفوفاً داخل&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/queries" target="_blank" rel="noopener">استعلام</a>&nbsp;يكوّنه خطاف&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">useQuery</a>. يتلقّى استدعاء&nbsp;<em>useQuery</em>&nbsp;كمعامل كائناً فيه الحقلان&nbsp;<em>queryKey</em>&nbsp;و&nbsp;<em>queryFn</em>. قيمة الحقل&nbsp;<em>queryKey</em>&nbsp;هي مصفوفة تحتوي على النص&nbsp;<em>notes</em>، وهي تعمل بمنزلة&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/query-keys" target="_blank" rel="noopener">مفتاح</a>&nbsp;للاستعلام المعرَّف، أي قائمة الملاحظات.

القيمة المُعادة من دالة&nbsp;<em>useQuery</em>&nbsp;هي كائن يبيّن حالة الاستعلام. ويوضّح الخرج في وحدة التحكم الوضع:

![صورة توضيحية](/images/mooc/6ad2aaf134fc.webp)

كما نرى، عند عرض المكوّن لأول مرة يظل الاستعلام في حالة الانتظار (pending)، أي أن طلب HTTP المرتبط لا يزال معلّقاً. في هذه المرحلة، لا يُعرض سوى ما يلي:

```
&lt;div&gt;loading data...&lt;/div&gt;
```

غير أن طلب HTTP يكتمل بسرعة كبيرة بحيث يستحيل رؤية النص. وعند اكتمال الطلب يُعرض المكوّن مرة أخرى. ويكون الاستعلام في الحالة&nbsp;<em>success</em>&nbsp;عند العرض الثاني، ويحتوي الحقل&nbsp;<em>data</em>&nbsp;من كائن الاستعلام على البيانات التي أعادها الطلب، أي قائمة الملاحظات المعروضة على الشاشة.

إذن يسترجع التطبيق البيانات من الخادم ويعرضها على الشاشة دون استخدام خطافات React&nbsp;<em>useState</em>&nbsp;و&nbsp;<em>useEffect</em>&nbsp;المستخدمة في الفصول 2-5 على الإطلاق. أصبحت البيانات الموجودة على الخادم الآن بالكامل تحت إدارة مكتبة TanStack Query، ولم يعد التطبيق بحاجة إلى الحالة المعرَّفة بخطاف&nbsp;<em>useState</em>&nbsp;في React إطلاقاً!

لننقل الدالة التي تُجري طلب HTTP الفعلي إلى ملفها الخاص&nbsp;<em>src/requests.js</em>

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () =&gt; {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
```

أصبح مكوّن&nbsp;<em>App</em>&nbsp;الآن مبسّطاً قليلاً:

```js
import { useQuery } from '@tanstack/react-query'
// BEGIN HIGHLIGHT
import { getNotes } from './requests'
// END HIGHLIGHT

const App = () => {
  // ...

  const result = useQuery({
    queryKey: ['notes'],
    // BEGIN HIGHLIGHT
    queryFn: getNotes
    // END HIGHLIGHT
  })

  // ...
}
```

شيفرة التطبيق الحالية موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-1" target="_blank" rel="noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part6-1</em>.

### مزامنة البيانات مع الخادم باستخدام TanStack Query

لقد نجحنا بالفعل في استرجاع البيانات من الخادم. بعد ذلك، سنحرص على تخزين البيانات المُضافة والمعدَّلة على الخادم. لنبدأ بإضافة ملاحظات جديدة.

لنضف دالة&nbsp;<em>createNote</em>&nbsp;إلى الملف&nbsp;<em>requests.js</em>&nbsp;لحفظ الملاحظات الجديدة:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

// BEGIN HIGHLIGHT
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
// END HIGHLIGHT
```

سيتغيّر مكوّن&nbsp;<em>App</em>&nbsp;كما يلي

```js
// BEGIN HIGHLIGHT
import { useQuery, useMutation } from '@tanstack/react-query'
import { getNotes, createNote } from './requests'
// END HIGHLIGHT

const App = () => {
  // BEGIN HIGHLIGHT
  const newNoteMutation = useMutation({
    mutationFn: createNote,
  })
  // END HIGHLIGHT

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    // BEGIN HIGHLIGHT
    newNoteMutation.mutate({ content, important: true })
    // END HIGHLIGHT
  }

  //

}
```

لإنشاء ملاحظة جديدة، نعرّف&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/mutations" target="_blank" rel="noopener">mutation</a>&nbsp;باستخدام الدالة&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useMutation" target="_blank" rel="noopener">useMutation</a>:

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
})
```

المعامل هو الدالة التي أضفناها إلى الملف&nbsp;<em>requests.js</em>&nbsp;والتي تستخدم Fetch API لإرسال ملاحظة جديدة إلى الخادم.

ينفّذ معالج الحدث&nbsp;<em>addNote</em>&nbsp;الـ mutation باستدعاء الدالة&nbsp;<em>mutate</em>&nbsp;التابعة لكائن الـ mutation وتمرير الملاحظة الجديدة كوسيط:

```
newNoteMutation.mutate({ content, important: true })
```

حلّنا جيد، إلا أنه لا يعمل. تُحفظ الملاحظة الجديدة على الخادم، لكنها لا تظهر محدَّثة على الشاشة.

لكي نعرض الملاحظة الجديدة أيضاً، علينا إخبار TanStack Query بأن النتيجة القديمة للاستعلام الذي مفتاحه النص&nbsp;<em>notes</em>&nbsp;ينبغي&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations" target="_blank" rel="noopener">إبطالها</a>.

لحسن الحظ، الإبطال سهل، ويمكن تنفيذه بتعريف دالة الاستدعاء&nbsp;<em>onSuccess</em>&nbsp;المناسبة للـ mutation:

```js
// BEGIN HIGHLIGHT
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// END HIGHLIGHT
import { getNotes, createNote } from './requests'

const App = () => {
  // BEGIN HIGHLIGHT
  const queryClient = useQueryClient()
  // END HIGHLIGHT

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // BEGIN HIGHLIGHT
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
    // END HIGHLIGHT
  })

  // ...
}
```

الآن، بعد تنفيذ الـ mutation بنجاح، يُستدعى ما يلي

```
queryClient.invalidateQueries({ queryKey: ['notes'] })
```

وهذا بدوره يجعل TanStack Query يحدّث تلقائياً الاستعلام ذا المفتاح&nbsp;<em>notes</em>، أي يجلب الملاحظات من الخادم. ونتيجة لذلك، يعرض التطبيق الحالة الأحدث على الخادم، أي تُعرض الملاحظة المضافة أيضاً.

لننفّذ أيضاً تغيير أهمية الملاحظات. تُضاف دالة لتحديث الملاحظات إلى الملف&nbsp;<em>requests.js</em>:

```js
export const updateNote = async (updatedNote) =&gt; {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}
```

يتم تحديث الملاحظة أيضاً عبر mutation. يتوسّع مكوّن&nbsp;<em>App</em>&nbsp;كما يلي:

```js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// BEGIN HIGHLIGHT
import { getNotes, createNote, updateNote } from './requests'
// END HIGHLIGHT

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  // BEGIN HIGHLIGHT
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
  // END HIGHLIGHT

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    // BEGIN HIGHLIGHT
    updateNoteMutation.mutate({...note, important: !note.important })
    // END HIGHLIGHT
  }

  // ...
}
```

إذن مرة أخرى، يُبطل الـ mutation الذي أنشأناه استعلام notes كي تُعرض الملاحظة المحدَّثة بشكل صحيح. استخدام الـ mutations سهل؛ إذ تتلقّى الدالة&nbsp;<em>mutate</em>&nbsp;ملاحظة كمعامل، وقد غُيّرت أهميتها إلى نقيض القيمة القديمة.

شيفرة التطبيق الحالية موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-2" target="_blank" rel="noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part6-2</em>.

### تحسين الأداء

يعمل التطبيق جيداً، والشيفرة بسيطة نسبياً. والملفت بشكل خاص سهولة إجراء تغييرات على قائمة الملاحظات. فمثلاً، عند تغيير أهمية ملاحظة، يكفي إبطال الاستعلام&nbsp;<em>notes</em>&nbsp;لتُحدَّث بيانات التطبيق:

```js
const updateNoteMutation = useMutation({
  mutationFn: updateNote,
  onSuccess: () =&gt; {
    queryClient.invalidateQueries({ queryKey: ['notes'] })  }
})
```

نتيجة ذلك، بالطبع، أنه بعد طلب PUT الذي يسبّب تغيير الملاحظة، يُجري التطبيق طلب GET جديداً لاسترجاع بيانات الاستعلام من الخادم:

![صورة توضيحية](/images/mooc/89ca92bbd4ce.webp)

إذا لم تكن كمية البيانات التي يسترجعها التطبيق كبيرة، فلا يهم ذلك حقاً. فمن وجهة نظر وظائف جهة المتصفح، لا يهم حقاً إجراء طلب HTTP GET إضافي، لكنه قد يشكّل عبئاً على الخادم في بعض الحالات.

وعند الحاجة، يمكن أيضاً تحسين الأداء&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses" target="_blank" rel="noopener">بتحديث حالة الاستعلام</a>&nbsp;التي يديرها TanStack Query يدوياً.

التغيير الخاص بالـ mutation الذي يضيف ملاحظة جديدة كما يلي:

```js
const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // BEGIN HIGHLIGHT
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    // END HIGHLIGHT
    }
  })

  // ...
}
```

أي أن كائن&nbsp;<em>queryClient</em>&nbsp;يقرأ أولاً في دالة الاستدعاء&nbsp;<em>onSuccess</em>&nbsp;حالة&nbsp;<em>notes</em>&nbsp;الحالية للاستعلام ويحدّثها بإضافة ملاحظة جديدة تُستلم كمعامل لدالة الاستدعاء. وقيمة المعامل هي القيمة التي تعيدها الدالة&nbsp;<em>createNote</em>&nbsp;المعرَّفة في الملف&nbsp;<em>requests.js</em>&nbsp;كما يلي:

```js
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  // BEGIN HIGHLIGHT
  return await response.json()
  // END HIGHLIGHT
}
```

سيكون من السهل نسبياً إجراء تغيير مماثل على الـ mutation الذي يغيّر أهمية الملاحظة، لكننا نتركه كتمرين اختياري.

أخيراً، لاحظ تفصيلاً مثيراً للاهتمام. يعيد TanStack Query جلب كل الملاحظات عندما ننتقل إلى تبويب آخر في المتصفح ثم نعود إلى تبويب التطبيق. ويمكن ملاحظة ذلك في تبويب Network في وحدة تحكم المطوّر:

![صورة توضيحية](/images/mooc/28ae0e462fe2.webp)

ما الذي يحدث؟ بقراءة&nbsp;<a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">التوثيق</a>، نلاحظ أن السلوك الافتراضي لاستعلامات TanStack Query هو تحديث الاستعلامات (التي تكون حالتها&nbsp;<em>stale</em>) عند تغيّر&nbsp;<em>window focus</em>. وإذا أردنا، يمكننا تعطيل هذه الوظيفة بإنشاء استعلام كما يلي:

```js
const App = () => {
  // ...
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    // BEGIN HIGHLIGHT
    refetchOnWindowFocus: false
    // END HIGHLIGHT
  })

  // ...
}
```

إذا أضفت عبارة console.log إلى الشيفرة، يمكنك أن ترى من وحدة تحكم المتصفح كم مرة يجعل TanStack Query التطبيق يُعاد عرضه. والقاعدة العامة أن إعادة العرض تحدث على الأقل كلما دعت الحاجة إليها، أي عند تغيّر حالة الاستعلام. يمكنك القراءة أكثر عن ذلك مثلاً&nbsp;<a href="https://tkdodo.eu/blog/react-query-render-optimizations" target="_blank" rel="noopener">هنا</a>.

### الخطاف المخصّص useNotes

حلّنا جيد إلى حد بعيد، لكن ما يزعج بعض الشيء هو أن كثيراً من تفاصيل تنفيذ TanStack Query وُضعت مباشرة داخل مكوّن React. لنستخرجها إلى دالة خطاف مخصّص خاصة بها:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from '../requests'

export const useNotes = () =&gt; {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) =&gt; {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () =&gt; {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  return {
    notes: result.data,
    isPending: result.isPending,
    addNote: (content) =&gt; newNoteMutation.mutate({ content, important: true }),
    toggleImportance: (note) =&gt; updateNoteMutation.mutate({
      ...note, important: !note.important
    }),
  }
}
```

تغلّف دالة الخطاف كل الشيفرة المتعلقة بـ TanStack Query: الاستعلام الخاص بجلب الملاحظات وكلا الـ mutations الخاصة بإنشاء الملاحظات وتحديثها. وتُخفى تفاصيل التنفيذ هذه عن مستخدم الخطاف، إذ تعيد الدالة كائناً بسيطاً يحتوي على
- <em>notes</em>: قائمة الملاحظات
- <em>isPending</em>: ما إذا كانت البيانات لا تزال قيد التحميل
- <em>addNote</em>: دالة لإضافة ملاحظة جديدة بنص المحتوى فقط
- <em>toggleImportance</em>: دالة لتبديل أهمية الملاحظة

يُبسَّط مكوّن&nbsp;<em>App</em>&nbsp;بشكل كبير:

```js
import { useNotes } from './hooks/useNotes'

const App = () =&gt; {
  const { notes, isPending, addNote: addNoteToServer, toggleImportance } = useNotes()

  const addNote = async (event) =&gt; {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    addNoteToServer(content)
  }

  if (isPending) {
    return &lt;div&gt;loading data...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      &lt;h2&gt;Notes app&lt;/h2&gt;
      &lt;form onSubmit={addNote}&gt;
        &lt;input name="note" /&gt;
        &lt;button type="submit"&gt;add&lt;/button&gt;
      &lt;/form&gt;
      {notes.map((note) =&gt; (
        &lt;li key={note.id}&gt;
          {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
          &lt;button onClick={() =&gt; toggleImportance(note)}&gt;
            {note.important ? 'make not important' : 'make important'}
          &lt;/button&gt;
        &lt;/li&gt;
      ))}
    &lt;/div&gt;
  )
}
```

شيفرة التطبيق موجودة على&nbsp;<a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-3" target="_blank" rel="noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part6-3</em>.

TanStack Query مكتبة متعددة الاستخدامات، وهي بناءً على ما رأيناه بالفعل تبسّط التطبيق. فهل تجعل TanStack Query حلول إدارة الحالة الأكثر تعقيداً مثل Zustand غير ضرورية؟ لا. يمكن لـ TanStack Query أن تحلّ محل حالة التطبيق جزئياً في بعض الحالات، لكن كما يذكر&nbsp;<a href="https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state" target="_blank" rel="noopener">التوثيق</a>
- TanStack Query هي&nbsp;<em>مكتبة حالة الخادم</em> (server-state library)، مسؤولة عن إدارة العمليات غير المتزامنة بين خادمك وعميلك
- أما Zustand وغيرها فهي&nbsp;<em>مكتبات حالة العميل</em> (client-state libraries) التي يمكن استخدامها لتخزين البيانات غير المتزامنة، وإن كان ذلك بكفاءة أقل مقارنة بأداة مثل TanStack Query

إذن TanStack Query مكتبة تحافظ على&nbsp;<em>حالة الخادم</em>&nbsp;في الواجهة الأمامية، أي تعمل كذاكرة مؤقتة لما هو مخزَّن على الخادم. تبسّط TanStack Query معالجة البيانات الموجودة على الخادم، ويمكنها في بعض الحالات إلغاء الحاجة إلى حفظ بيانات الخادم في حالة الواجهة الأمامية.

تحتاج معظم تطبيقات React ليس فقط إلى طريقة لتخزين البيانات المُقدَّمة مؤقتاً، بل أيضاً إلى حل لكيفية التعامل مع بقية حالة الواجهة الأمامية (مثل حالة النماذج أو الإشعارات).

<div class="tasks">

**19. استعلام anecdotes، الخطوة 1**

</div>

<div class="tasks">

**20. استعلام anecdotes، الخطوة 2**

</div>

<div class="tasks">

**21. استعلام anecdotes، الخطوة 3**

</div>

<div class="tasks">

**22. استعلام anecdotes، الخطوة 4**

</div>

<div class="tasks">

**23. استعلام anecdotes، مراجعة**

</div>

### Context API

لنعد إلى تطبيق العدّاد القديم الجيد. يُعرَّف التطبيق كما يلي:

```js
import { useState } from 'react'
import Display from './components/Display'
import Controls from './components/Controls'

const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;Display counter={counter} /&gt;
      &lt;Controls counter={counter} setCounter={setCounter} /&gt;
    &lt;/div&gt;
  )
}
```

يعرّف مكوّن&nbsp;<em>App</em>&nbsp;حالة التطبيق ويمرّرها إلى مكوّن&nbsp;<em>Display</em>&nbsp;الذي يعرض قيمة العدّاد:

```js
const Display = ({ counter }) =&gt; {

  return (
    &lt;div&gt;{counter}&lt;/div&gt;
  )
}
```

وإلى مكوّن&nbsp;<em>Controls</em>&nbsp;الذي يعرض الأزرار:

```js
const Controls = ({ counter, setCounter }) =&gt; {
  const increment = () =&gt; setCounter(counter + 1)
  const decrement = () =&gt; setCounter(counter - 1)
  const zero = () =&gt; setCounter(0)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

ينمو التطبيق:

![صورة توضيحية](/images/mooc/1d93cd0e222b.webp)

يتغيّر دور مكوّن&nbsp;<em>App</em>: فهو لا يزال يحتفظ بحالة التطبيق، لكنه لم يعد يعرض المكوّنات التي تستخدم حالة العدّاد مباشرة:

```js
const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;Navbar /&gt;
      &lt;Panel counter={counter} setCounter={setCounter} /&gt;
      &lt;Footer /&gt;
    &lt;/div&gt;
  )
}
```

المكوّن الجديد&nbsp;<em>Panel</em>&nbsp;مسؤول عن عرض المكوّنات التي تعرض العدّاد والأزرار:

```js
import Display from './Display'
import Controls from './Controls'

const Panel = ({ counter, setCounter }) =&gt; {
  return (
    &lt;div&gt;
      &lt;Display counter={counter} /&gt;
      &lt;Controls counter={counter} setCounter={setCounter} /&gt;
    &lt;/div&gt;
  )
}
```

التسلسل الهرمي لمكوّنات التطبيق كما يلي:

```
App (state)
 ├── Panel
 │    ├── Display
 │    └── Controls
 └── Footer
```

لا تزال حالة التطبيق في مكوّن&nbsp;<em>App</em>. ولتمكين&nbsp;<em>Display</em>&nbsp;و&nbsp;<em>Controls</em>&nbsp;من الوصول إلى حالة العدّاد، يجب تمرير الحالة ودالة تحديثها كـ props عبر مكوّن&nbsp;<em>Panel</em>، رغم أن&nbsp;<em>Panel</em>&nbsp;نفسه لا يحتاجهما. وينشأ هذا النوع من الحالات بسهولة عند استخدام حالة أُنشئت بخطاف&nbsp;<em>useState</em>. وتُسمّى هذه الظاهرة&nbsp;<a href="https://kentcdodds.com/blog/prop-drilling" target="_blank" rel="noopener">prop drilling</a>.

تقدّم واجهة&nbsp;<a href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">Context API</a>&nbsp;المدمجة في React حلاً واحداً لهذه المشكلة. وسياق React (context) هو نوع من الحالة العامة للتطبيق، يتيح منح أي مكوّن وصولاً مباشراً إليه.

لننشئ الآن سياقاً في التطبيق يخزّن إدارة حالة العدّاد.

يُنشأ السياق باستخدام دالة&nbsp;<a href="https://react.dev/reference/react/createContext" target="_blank" rel="noopener">createContext</a>&nbsp;في React. لننشئ السياق في ملف&nbsp;<em>src/CounterContext.jsx</em>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

يمكن لمكوّن&nbsp;<em>App</em>&nbsp;الآن أن&nbsp;<em>يوفّر</em>&nbsp;السياق لمكوّناته الفرعية كما يلي:

```js
import CounterContext from './components/CounterContext'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    // BEGIN HIGHLIGHT
    &lt;CounterContext.Provider value={{counter, setCounter}}>
      &lt;Panel />
      &lt;Footer />
    &lt;/CounterContext.Provider>
    // END HIGHLIGHT
  )
}
```

يتم توفير السياق بلفّ المكوّنات الفرعية داخل مكوّن&nbsp;<em>CounterContext.Provider</em>&nbsp;وتعيين قيمة مناسبة للسياق.

قيمة السياق الآن كائن له الخاصيتان&nbsp;<em>counter</em>&nbsp;و&nbsp;<em>setCounter</em>، أي حالة العدّاد والدالة التي تحدّثها.

لاحظ أن مكوّن&nbsp;<em>Panel</em>&nbsp;لم يعد يتلقّى أي props متعلقة بالعدّاد، لذا يُبسَّط إلى:

```js
const Panel = () =&gt; {
  return (
    &lt;div&gt;
      &lt;Display /&gt;
      &lt;Controls /&gt;
    &lt;/div&gt;
  )
}
```

يمكن للمكوّنات الأخرى الآن الوصول إلى السياق باستخدام خطاف&nbsp;<a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a>. يتغيّر مكوّن&nbsp;<em>Display</em>&nbsp;كما يلي:

```js
// BEGIN HIGHLIGHT
import { useContext } from 'react'
import CounterContext from './CounterContext'

const Display = () => {
  const { counter } = useContext(CounterContext)
  // END HIGHLIGHT

  return &lt;div>{counter}&lt;/div>
}
```

لم يعد مكوّن&nbsp;<em>Display</em>&nbsp;بحاجة إلى أي props. فهو يحصل على قيمة العدّاد باستدعاء خطاف&nbsp;<em>useContext</em>&nbsp;مع كائن&nbsp;<em>CounterContext</em>&nbsp;كمعامل له.

وبالمثل، يتغيّر مكوّن&nbsp;<em>Controls</em>&nbsp;إلى:

```js
// BEGIN HIGHLIGHT
import { useContext } from 'react'
import CounterContext from './CounterContext'

const Controls = () => {
  const { counter, setCounter } = useContext(CounterContext)
  // END HIGHLIGHT

  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}

export default Controls
```

أصبحت المكوّنات الآن قادرة على الوصول إلى المحتوى الذي يعيّنه مزوّد السياق، أي حالة العدّاد ودالة تحديثها.

تستخرج المكوّنات الخصائص التي تحتاجها باستخدام صيغة التفكيك (destructuring) في JavaScript:

```js
const { counter } = useContext(CounterContext)
```

### تعريف سياق العدّاد في ملفه الخاص

لا يزال في تطبيقنا ما هو غير مستحب: إذ إن وظيفة إدارة حالة العدّاد معرَّفة داخل مكوّن&nbsp;<em>App</em>. لننقل كل الشيفرة المتعلقة بالعدّاد إلى الملف&nbsp;<em>CounterContext.jsx</em>:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

// BEGIN HIGHLIGHT
export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

  return (
    &lt;CounterContext.Provider value={{ counter, setCounter }}>
      {props.children}
    &lt;/CounterContext.Provider>
  )
}
// END HIGHLIGHT
```

يصدّر الملف الآن كلاً من كائن&nbsp;<em>CounterContext</em>&nbsp;ومكوّن&nbsp;<em>CounterContextProvider</em>، وهو أساساً مزوّد سياق تحتوي قيمته على العدّاد ودالة تحديثه.

لنستخدم مزوّد السياق مباشرة في الملف&nbsp;<em>main.jsx</em>:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
// BEGIN HIGHLIGHT
import { CounterContextProvider } from './CounterContext'
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  // BEGIN HIGHLIGHT
  &lt;CounterContextProvider>
    &lt;App />
  &lt;/CounterContextProvider>
  // END HIGHLIGHT
)
```

أصبح السياق الذي يعرّف قيمة العدّاد ووظائفه متاحاً الآن&nbsp;<em>لجميع</em>&nbsp;مكوّنات التطبيق.

يُبسَّط مكوّن&nbsp;<em>App</em>&nbsp;إلى:

```js
import Panel from './components/Panel'
import Footer from './components/Footer'

const App = () =&gt; {

  return (
    &lt;div&gt;
      &lt;Navbar /&gt;
      &lt;Panel /&gt;
      &lt;Footer /&gt;
  &lt;/div&gt;
  )
}

export default App
```

لا يزال السياق يُستخدم بالطريقة نفسها، ولا حاجة إلى أي تغييرات في المكوّنات الأخرى. فمثلاً، يبقى&nbsp;<em>Controls</em>:

```js
const Controls = () =&gt; {
  const { counter, setCounter } = useContext(CounterContext)
  const increment = () =&gt; setCounter(counter + 1)
  const decrement = () =&gt; setCounter(counter - 1)
  const zero = () =&gt; setCounter(0)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

الحل جيد تماماً. أصبحت حالة التطبيق بأكملها، أي قيمة العدّاد، معزولة الآن في ملف&nbsp;<em>CounterContext</em>. وتصل المكوّنات إلى الجزء الذي تحتاجه بالضبط من السياق باستخدام خطاف&nbsp;<em>useContext</em>&nbsp;وصيغة التفكيك في JavaScript.

لنجرِ تحسيناً صغيراً واحداً ونعرّف أيضاً دوال تحديث العدّاد&nbsp;<em>increment</em>&nbsp;و&nbsp;<em>decrement</em>&nbsp;و&nbsp;<em>zero</em>&nbsp;في السياق:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

// BEGIN HIGHLIGHT
  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)
// END HIGHLIGHT

  return (
    // BEGIN HIGHLIGHT
    &lt;CounterContext.Provider value={{ counter, increment, decrement, zero }}>
    // END HIGHLIGHT
      {props.children}
    &lt;/CounterContext.Provider>
  )
}
```

الآن يمكننا استخدام الدوال المستحصل عليها من السياق مباشرة كمعالجات أحداث للأزرار:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Controls = () => {
  // BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useContext(CounterContext)
  // END HIGHLIGHT

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}
```

لا يزال هناك مجال لتحسين آخر. إذا نظرنا إلى طريقة استخدام سياق العدّاد، نلاحظ أن الشيفرة المتكررة (boilerplate) نفسها تظهر في كلا المكوّنين اللذين يستهلكانه:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Display = () => {
  // BEGIN HIGHLIGHT
  const { counter } = useContext(CounterContext)
  // END HIGHLIGHT
  // ...
}
```

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Controls = () => {
  // BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useContext(CounterContext)
  // END HIGHLIGHT
  // ...
}
```

يمكننا أن نخطو بالحل خطوة إضافية بإنشاء خطاف مخصّص يعيد السياق مباشرة. لنضفه إلى الملف&nbsp;<em>hooks/useCounter.js</em>:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const useCounter = () =&gt; useContext(CounterContext)

export default useCounter
```

أصبح استخدام السياق الآن أبسط بخطوة:

```js
import useCounter from '../hooks/useCounter'

const Display = () => {
  const { counter } = useCounter()
  // ...
}

import useCounter from '../hooks/useCounter'

const Controls = () => {
  const { increment, decrement, zero } = useCounter()
  // ...
}
```

نحن راضون عن الحل. فهو يعزل كل إدارة الحالة بالكامل داخل السياق. والمكوّنات التي تستخدم الحالة لا تعرف شيئاً عن كيفية تنفيذها. وبفضل الخطاف المخصّص، فهي لا تدرك حتى أن الحل قائم على Context API.

شيفرة التطبيق موجودة في مستودع GitHub&nbsp;<a href="https://github.com/fullstack-hy2020/context-counter" target="_blank" rel="noopener">https://github.com/fullstack-hy2020/context-counter</a>.

<div class="tasks">

**24. استعلام anecdotes، الخطوة 5**

</div>

<div class="tasks">

**25. استعلام anecdotes، الخطوة 6**

</div>

<div class="tasks">

**26. استعلام anecdotes، الخطوة 7**

</div>

<div class="tasks">

**27. استعلام anecdotes، الفحص النهائي**

</div>

<div class="tasks">

**28. مستودع GitHub الخاص بك**

</div>

### أي حل لإدارة الحالة ينبغي اختياره؟

في الفصول 1-5، كانت كل إدارة الحالة في التطبيق تُعالج باستخدام خطاف&nbsp;<em>useState</em>&nbsp;في React. وقد تطلّبت الاستدعاءات غير المتزامنة إلى الواجهة الخلفية استخدام خطاف&nbsp;<em>useEffect</em>&nbsp;في بعض الحالات. ومن حيث المبدأ، لا حاجة إلى أي شيء آخر.

ثمة مشكلة دقيقة في الحلول القائمة على الحالة المُنشأة بخطاف&nbsp;<em>useState</em>&nbsp;وهي أنه إذا احتاجت مكوّنات متعددة إلى جزء من حالة التطبيق، وجب تمرير الحالة والدوال الخاصة بالتعامل معها عبر props إلى كل المكوّنات التي تتعامل مع تلك الحالة. وأحياناً يجب تمرير props عبر مكوّنات متعددة، وقد لا تكون المكوّنات الواقعة في الطريق مهتمة بالحالة بأي شكل. وتُسمّى هذه الظاهرة غير المستحبة بعض الشيء&nbsp;<em>prop drilling</em>.

على مرّ السنوات، طُوّرت عدة حلول بديلة لإدارة الحالة في تطبيقات React، يمكن استخدامها لتخفيف المواقف الإشكالية مثل prop drilling. ومع ذلك، لم يكن أي حل «نهائياً» — فلكل حل مزاياه وعيوبه، وتُطوَّر حلول جديدة طوال الوقت.

قد يربك هذا الوضع المبتدئ وحتى مطوّر ويب متمرس. فأي حل ينبغي استخدامه؟

بالنسبة لتطبيق بسيط، يُعدّ&nbsp;<em>useState</em>&nbsp;نقطة بداية جيدة بالتأكيد. وإذا كان التطبيق يتواصل مع خادم، فيمكن التعامل مع التواصل بالطريقة نفسها كما في الفصول 1-5، باستخدام حالة التطبيق الخاصة. غير أنه أصبح من الشائع حديثاً نقل التواصل وإدارة الحالة المرتبطة به، جزئياً على الأقل، إلى نطاق سيطرة TanStack Query (أو مكتبة أخرى مشابهة). وإذا كنت قلقاً بشأن useState وprop drilling الذي يستتبعه، فقد يكون استخدام السياق خياراً جيداً. وهناك أيضاً حالات قد يكون من المنطقي فيها التعامل مع جزء من الحالة بـ useState وجزء آخر بالسياقات.

لفترة طويلة، كان Redux أشهر حلول إدارة الحالة وأكثرها شمولاً، وهو طريقة لتنفيذ ما يُسمّى معمارية&nbsp;<a href="https://facebookarchive.github.io/flux/" target="_blank" rel="noopener">Flux</a>. غير أن Redux معروف بتعقيده وكثرة الشيفرة المتكررة فيه، وقد كان ذلك دافعاً لظهور حلول إدارة حالة أحدث. في هذه المادة التعليمية، حلّت مكتبة&nbsp;<a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>&nbsp;محل Redux، وهي تقدّم وظائف مكافئة بواجهة برمجية أبسط بكثير. وأصبح Zustand خياراً شائعاً خصوصاً عندما تحتاج إلى أكثر مما يقدّمه useState، لكن جهاز Redux الكامل يبدو مبالغاً فيه. وقد أصبح بعض النقد الموجّه إلى جمود Redux قديماً بفضل&nbsp;<a href="https://redux-toolkit.js.org/" target="_blank" rel="noopener">Redux Toolkit</a>، ولا يزال Redux مستخدماً على نطاق واسع، خاصة في المشاريع الأكبر.

لا يلزم استخدام Zustand ولا Redux في التطبيق بأكمله. فقد يكون من المنطقي، مثلاً، إدارة حالة النموذج خارجهما، خصوصاً في الحالات التي لا تؤثر فيها حالة النموذج على بقية التطبيق. كما أن استخدام Zustand أو Redux مع TanStack Query في التطبيق نفسه ممكن تماماً.

مسألة أي حل لإدارة الحالة ينبغي استخدامه ليست مباشرة إطلاقاً. فمن المستحيل إعطاء إجابة صحيحة واحدة، ومن المرجّح أيضاً أن يتبيّن أن الحل المختار دون المستوى الأمثل مع نمو التطبيق، مما يستلزم تغيير المقاربة حتى لو كان التطبيق قد دخل الإنتاج بالفعل.
