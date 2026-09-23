---
mainImage: /images/part-5.svg
part: 5
letter: c
lang: ar
---

<div class="content">

هناك طرق مختلفة عديدة لاختبار تطبيقات React. لنلقِ نظرة عليها فيما يلي.

استخدمت الدورة سابقاً مكتبة [Jest](http://jestjs.io/) التي طوّرتها Facebook لاختبار مكوّنات React. نحن الآن نستخدم الجيل الجديد من أدوات الاختبار من مطوّري Vite وتُسمى [Vitest](https://vitest.dev/). بصرف النظر عن الإعدادات، تقدّم المكتبتان واجهة برمجة واحدة نفسها، لذا لا يوجد عملياً أي فرق في شيفرة الاختبار.

لنبدأ بتثبيت Vitest ومكتبة [jsdom](https://github.com/jsdom/jsdom) التي تحاكي متصفح الويب:

```
npm install --save-dev vitest jsdom
```

بالإضافة إلى Vitest، نحتاج أيضاً إلى مكتبة اختبار أخرى تساعدنا على عرض المكوّنات لأغراض الاختبار. الخيار الأفضل حالياً لذلك هو [react-testing-library](https://github.com/testing-library/react-testing-library) الذي شهد نمواً سريعاً في الشعبية في الآونة الأخيرة. يجدر أيضاً توسيع القدرة التعبيرية للاختبارات بمكتبة [jest-dom](https://github.com/testing-library/jest-dom).

لنثبّت المكتبات بالأمر:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

قبل أن نتمكن من إجراء الاختبار الأول، نحتاج إلى بعض الإعدادات.

نضيف سكربتاً إلى ملف <i>package.json</i> لتشغيل الاختبارات:

```js
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

لننشئ ملف _testSetup.js_ في جذر المشروع بالمحتوى التالي

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

الآن، بعد كل اختبار، تُنفَّذ الدالة _cleanup_ لإعادة ضبط jsdom الذي يحاكي المتصفح.

وسّع ملف _vite.config.js_ كما يلي

```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})
```

مع _globals: true_، لا حاجة لاستيراد كلمات مفتاحية مثل _describe_ و _test_ و _expect_ في الاختبارات.

لنكتب أولاً اختبارات للمكوّن المسؤول عن عرض ملاحظة:

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

لاحظ أن عنصر <i>li</i> يحمل القيمة <i>note</i> للخاصية className الخاصة بـ [CSS](https://react.dev/learn#adding-styles)، والتي يمكن استخدامها للوصول إلى المكوّن في اختباراتنا.

### عرض المكوّن للاختبارات

سنكتب اختبارنا في الملف <i>src/components/Note.test.jsx</i>، الموجود في الدليل نفسه الذي يوجد فيه المكوّن نفسه.

يتحقق الاختبار الأول من أن المكوّن يعرض محتوى الملاحظة:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

بعد الإعداد الأولي، يعرض الاختبار المكوّن باستخدام دالة [render](https://testing-library.com/docs/react-testing-library/api#render) التي توفّرها react-testing-library:

```js
render(<Note note={note} />)
```

عادةً تُعرض مكوّنات React في [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). دالة render التي استخدمناها تعرض المكوّنات بصيغة مناسبة للاختبارات دون عرضها في DOM.

يمكننا استخدام الكائن [screen](https://testing-library.com/docs/queries/about#screen) للوصول إلى المكوّن المعروض. نستخدم دالة screen المسماة [getByText](https://testing-library.com/docs/queries/bytext) للبحث عن عنصر يحوي محتوى الملاحظة والتأكد من وجوده:

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

يُفحص وجود عنصر باستخدام أمر [expect](https://vitest.dev/api/expect.html#expect) الخاص بـ Vitest. يولّد expect تأكيداً (assertion) لوسيطه، ويمكن اختبار صحته باستخدام دوال شرطية مختلفة. استخدمنا الآن [toBeDefined](https://vitest.dev/api/expect.html#tobedefined) الذي يختبر ما إذا كان وسيط expect المسمى _element_ موجوداً.

شغّل الاختبار بالأمر _npm test_:

```js
$ npm test

> notes-frontend@0.0.0 test
> vitest run


 RUN  v3.2.3 /home/vejolkko/repot/fullstack-examples/notes-frontend

 ✓ src/components/Note.test.jsx (1 test) 19ms
   ✓ renders content 18ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:31:54
   Duration  874ms (transform 51ms, setup 169ms, collect 19ms, tests 19ms, environment 454ms, prepare 87ms)
```

يشتكي Eslint من الكلمتين المفتاحيتين _test_ و _expect_ في الاختبارات. يمكن حل المشكلة بإضافة الإعداد التالي إلى ملف <i>eslint.config.js</i>:

```js
// ...

export default [
  // ...
  // highlight-start
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
  // highlight-end
]
```

هكذا يُبلَّغ ESLint بأن كلمات Vitest المفتاحية متاحة عالمياً في ملفات الاختبار.

### موقع ملف الاختبار

في React يوجد (على الأقل) [اصطلاحان مختلفان](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) لموقع ملف الاختبار. أنشأنا ملفات اختبارنا وفق المعيار الحالي بوضعها في الدليل نفسه الذي يوجد فيه المكوّن المُختبَر.

الاصطلاح الآخر هو تخزين ملفات الاختبار "بشكل عادي" في دليل _test_ منفصل. أياً كان الاصطلاح الذي نختاره، يكاد يكون من المؤكد أنه خطأ في نظر أحدهم.

لا يعجبني تخزين الاختبارات وشيفرة التطبيق في الدليل نفسه. مع ذلك، سنتبع هذا النهج الآن، لأنه الممارسة الأكثر شيوعاً في المشاريع الصغيرة.

### البحث عن محتوى في مكوّن

تقدّم حزمة react-testing-library طرقاً مختلفة عديدة لفحص محتوى المكوّن المُختبَر. في الواقع، لا حاجة إلى _expect_ في اختبارنا على الإطلاق:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  expect(element).toBeDefined() // highlight-line
})
```

يفشل الاختبار إذا لم يجد _getByText_ العنصر الذي يبحث عنه.

يبحث الأمر _getByText_ افتراضياً عن عنصر يحتوي فقط على **النص المقدَّم كوسيط** ولا شيء غير ذلك. لنفترض أن مكوّناً يعرض نصاً في عنصر HTML كما يلي:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      Your awesome note: {note.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
```

دالة _getByText_ التي يستخدمها الاختبار <i>لا</i> تجد العنصر:

```js
test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(')

  expect(element).toBeDefined()
})
```

إذا أردنا البحث عن عنصر <i>يحتوي</i> على النص، يمكننا استخدام خيار إضافي:

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

أو يمكننا استخدام الدالة _findByText_:

```js
const element = await screen.findByText('Does not work anymore :(')
```

من المهم ملاحظة أن _findByText_، بخلاف دوال _ByText_ الأخرى، تُعيد promise!

هناك حالات تكون فيها صيغة أخرى من الدالة _queryByText_ مفيدة. تُعيد الدالة العنصر لكن <i>لا تُسبب استثناءً</i> إذا لم يُعثر عليه.

يمكننا مثلاً استخدام الدالة للتأكد من أن شيئاً ما <i>غير معروض</i> في المكوّن:

```js
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

توجد دوال أخرى أيضاً، مثل [getByTestId](https://testing-library.com/docs/queries/bytestid/)، التي تبحث عن العناصر بناءً على حقول id مُنشأة خصيصاً لأغراض الاختبار.

يمكننا أيضاً استخدام [محدّدات CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) للعثور على العناصر المعروضة باستخدام الدالة [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) الخاصة بالكائن [container](https://testing-library.com/docs/react-testing-library/api/#container-1) الذي هو أحد الحقول التي تُعيدها render:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />) // highlight-line

// highlight-start
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  // highlight-end
})
```

يُوصى مع ذلك بالبحث عن العناصر أساساً باستخدام دوال غير كائن <i>container</i> ومحدّدات CSS. فغالباً ما يمكن تغيير خصائص CSS دون التأثير على وظائف التطبيق، ولا يكون المستخدمون على دراية بها. الأفضل البحث عن العناصر بناءً على خصائص مرئية للمستخدم، مثلاً باستخدام الدالة _getByText_. بهذه الطريقة، تحاكي الاختبارات الطبيعة الفعلية للمكوّن وكيف سيجد المستخدم العنصر على الشاشة بشكل أفضل.

### تصحيح أخطاء الاختبارات

نصادف عادةً أنواعاً مختلفة عديدة من المشكلات عند كتابة اختباراتنا.

يمتلك الكائن _screen_ دالة [debug](https://testing-library.com/docs/dom-testing-library/api-debugging#screendebug) يمكن استخدامها لطباعة HTML الخاص بمكوّن في الطرفية. إذا غيّرنا الاختبار كما يلي:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug() // highlight-line

  // ...

})
```

يُطبع HTML في وحدة التحكم:

```js
console.log
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

من الممكن أيضاً استخدام الدالة نفسها لطباعة عنصر مرغوب في وحدة التحكم:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)  // highlight-line

  expect(element).toBeDefined()
})
```

الآن يُطبع HTML الخاص بالعنصر المرغوب:

```js
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### النقر على الأزرار في الاختبارات

بالإضافة إلى عرض المحتوى، يحرص مكوّن <i>Note</i> أيضاً على أنه عند الضغط على الزر المرتبط بالملاحظة، تُستدعى دالة معالج الحدث _toggleImportance_.

لنثبّت مكتبة [user-event](https://testing-library.com/docs/user-event/intro) التي تجعل محاكاة إدخال المستخدم أسهل قليلاً:

```bash
npm install --save-dev @testing-library/user-event
```

يمكن اختبار هذه الوظيفة هكذا:

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  
  const mockHandler = vi.fn()  // highlight-line

  render(
    <Note note={note} toggleImportance={mockHandler} />  // highlight-line
  )

  const user = userEvent.setup()  // highlight-line
  const button = screen.getByText('make not important')  // highlight-line
  await user.click(button)  // highlight-line

  expect(mockHandler.mock.calls).toHaveLength(1)  // highlight-line
})
```

هناك بضعة أمور مثيرة للاهتمام تتعلق بهذا الاختبار. معالج الحدث هو دالة [mock](https://vitest.dev/api/mock) مُعرَّفة بـ Vitest:

```js
const mockHandler = vi.fn()
```

تُبدأ [جلسة](https://testing-library.com/docs/user-event/setup/) للتفاعل مع المكوّن المعروض:

```js
const user = userEvent.setup()
```

يجد الاختبار الزر <i>بناءً على النص</i> من المكوّن المعروض وينقر العنصر:

```js
const button = screen.getByText('make not important')
await user.click(button)
```

يحدث النقر بالدالة [click](https://testing-library.com/docs/user-event/convenience/#click) الخاصة بمكتبة userEvent.

يستخدم توقع الاختبار [toHaveLength](https://vitest.dev/api/expect.html#tohavelength) للتحقق من أن <i>دالة mock</i> قد استُدعيت مرة واحدة بالضبط:

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

تُحفظ الاستدعاءات إلى دالة mock في المصفوفة [mock.calls](https://vitest.dev/api/mock#mock-calls) داخل كائن دالة mock.

تُستخدم [كائنات ودوال mock](https://en.wikipedia.org/wiki/Mock_object) عادةً كمكوّنات [stub](https://en.wikipedia.org/wiki/Method_stub) في الاختبار لاستبدال اعتماديات المكوّنات المُختبَرة. تتيح mocks إعادة استجابات ثابتة، والتحقق من عدد المرات التي تُستدعى فيها دوال mock وبأي معاملات.

في مثالنا، دالة mock خيار مثالي لأنه يمكن استخدامها بسهولة للتحقق من أن الدالة تُستدعى مرة واحدة بالضبط.

### اختبارات لمكوّن <i>Togglable</i>

لنكتب بضعة اختبارات لمكوّن <i>Togglable</i>. تظهر الاختبارات أدناه:

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeVisible()
  })
})
```

تُستدعى الدالة _beforeEach_ قبل كل اختبار، فتعرض مكوّن <i>Togglable</i>.

يتحقق الاختبار الأول من أن مكوّن <i>Togglable</i> يعرض مكوّنه الفرعي

```js
<div>
  togglable content
</div>
```

تستخدم الاختبارات المتبقية الدالة _toBeVisible_ للتحقق من أن المكوّن الفرعي لمكوّن <i>Togglable</i> غير مرئي في البداية، أي أن نمط عنصر <i>div</i> يحتوي على _{ display: 'none' }_. ويتحقق اختبار آخر من أنه عند الضغط على الزر يصبح المكوّن مرئياً، أي أن نمط إخفائه <i>لم يعد</i> مُسنَداً إلى المكوّن.

لنضف أيضاً اختباراً يمكن استخدامه للتحقق من أنه يمكن إخفاء المحتوى المرئي بالنقر على الزر الثاني في المكوّن:

```js
describe('<Togglable />', () => {

  // ...

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })
})
```

### اختبار النماذج

استخدمنا بالفعل دالة _click_ الخاصة بـ [user-event](https://testing-library.com/docs/user-event/intro) في اختباراتنا السابقة للنقر على الأزرار.

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

يمكننا أيضاً محاكاة إدخال النص باستخدام <i>userEvent</i>.

لنجرِ اختباراً لمكوّن <i>NoteForm</i>. شيفرة المكوّن كما يلي.

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = event => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

يعمل النموذج باستدعاء الدالة المستلمة كـ props المسماة _createNote_، مع تفاصيل الملاحظة الجديدة.

الاختبار كما يلي:

```js
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

تصل الاختبارات إلى حقل الإدخال باستخدام الدالة [getByRole](https://testing-library.com/docs/queries/byrole).

تُستخدم الدالة [type](https://testing-library.com/docs/user-event/utility#type) الخاصة بـ userEvent لكتابة نص في حقل الإدخال.

يضمن توقع الاختبار الأول أن إرسال النموذج يستدعي دالة _createNote_.
ويتحقق التوقع الثاني من أن معالج الحدث يُستدعى بالمعاملات الصحيحة - أي إن ملاحظة بالمحتوى الصحيح تُنشأ عند ملء النموذج.

يجدر بالذكر أن _console.log_ القديم الجيد يعمل كالمعتاد في الاختبارات. مثلاً، إذا أردت رؤية شكل الاستدعاءات المحفوظة بواسطة كائن mock، يمكنك فعل ما يلي

```js
test('<NoteForm /> updates parent state and calls onSubmit', async() => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls) // highlight-line
})
```

في منتصف تشغيل الاختبارات، يُطبع ما يلي في وحدة التحكم:

```
[ [ { content: 'testing a form...', important: true } ] ]
```

### حول العثور على العناصر

لنفترض أن النموذج يحتوي على حقلي إدخال

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

الآن النهج الذي يستخدمه اختبارنا للعثور على حقل الإدخال

```js
const input = screen.getByRole('textbox')
```

سيسبب خطأ:

![خطأ node يُظهر عنصرين مع textbox لأننا نستخدم getByRole](../../images/5/40.webp)

تقترح رسالة الخطأ استخدام <i>getAllByRole</i>. يمكن إصلاح الاختبار كما يلي:

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

تُعيد الدالة <i>getAllByRole</i> الآن مصفوفة، وحقل الإدخال الصحيح هو العنصر الأول في المصفوفة. لكن هذا النهج مريب قليلاً لأنه يعتمد على ترتيب حقول الإدخال.

إذا عُرّف <i>label</i> لحقل الإدخال، يمكن تحديد حقل الإدخال باستخدامه مع دالة getByLabelText. مثلاً، إذا أضفنا label إلى حقل الإدخال:

```js
  // ...
  <label> // highlight-line
    content // highlight-line
    <input
      value={newNote}
      onChange={event => setNewNote(event.target.value)}
    />
  </label> // highlight-line
  // ...
```

يمكن للاختبار تحديد حقل الإدخال كما يلي:

```js
test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByLabelText('content') // highlight-line
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

غالباً ما تحتوي حقول الإدخال على نص <i>placeholder</i> يلمّح للمستخدم إلى نوع الإدخال المتوقع. لنضف placeholder إلى نموذجنا:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          placeholder='write note content here' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

الآن العثور على حقل الإدخال الصحيح سهل باستخدام الدالة [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext):

```js
test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write note content here') // highlight-line 
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

أحياناً قد يكون العثور على العنصر الصحيح باستخدام الدوال الموصوفة أعلاه صعباً. في مثل هذه الحالات، البديل هو الدالة <i>querySelector</i> الخاصة بالكائن _container_، الذي تُعيده _render_، كما ذُكر [سابقاً في هذا الجزء](/part5/testing_react_apps#searching-for-content-in-a-component). يمكن استخدام أي محدّد CSS مع هذه الدالة للبحث عن العناصر في الاختبارات.

تأمّل مثلاً أننا سنعرّف _id_ فريداً لحقل الإدخال:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          id='note-input' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

يمكن الآن العثور على عنصر الإدخال في الاختبار كما يلي:

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

مع ذلك، سنلتزم بنهج استخدام _getByPlaceholderText_ في الاختبار.

### تغطية الاختبار

يمكننا معرفة [التغطية](https://vitest.dev/guide/coverage.html#coverage) لاختباراتنا بسهولة بتشغيلها بالأمر.

```js
npm test -- --coverage
```

في المرة الأولى التي تشغّل فيها الأمر، سيسألك Vitest إذا كنت تريد تثبيت المكتبة المطلوبة _@vitest/coverage-v8_. ثبّتها، ثم شغّل الأمر مجدداً:

![مخرجات الطرفية لتغطية الاختبار](../../images/5/18new.webp)

سيُنشأ تقرير HTML في دليل <i>coverage</i>.
سيخبرنا التقرير بأسطر الشيفرة غير المُختبَرة في كل مكوّن:

![تقرير HTML لتغطية الاختبار](../../images/5/19newer.webp)

لنضف الدليل <i>coverage/</i> إلى ملف <i>.gitignore</i> لاستبعاد محتوياته من التحكم بالإصدارات:

```js
//...

coverage/
```

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-8</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-8).

</div>

<div class="tasks">

### تمارين 5.13.-5.16.

#### 5.13: اختبارات قائمة المدونات، الخطوة 1

أنشئ اختباراً يتحقق من أن المكوّن الذي يعرض مدونة يعرض عنوان المدونة وكاتبها، لكنه لا يعرض رابطها ولا عدد الإعجابات افتراضياً.

أضف أصناف CSS إلى المكوّن للمساعدة في الاختبار حسب الحاجة.

#### 5.14: اختبارات قائمة المدونات، الخطوة 2

أنشئ اختباراً يتحقق من ظهور رابط المدونة وعدد الإعجابات عند النقر على الزر المتحكم في التفاصيل المعروضة.

#### 5.15: اختبارات قائمة المدونات، الخطوة 3

أنشئ اختباراً يضمن أنه إذا نُقر على زر <i>like</i> مرتين، فإن معالج الحدث الذي استقبله المكوّن كـ props يُستدعى مرتين.

#### 5.16: اختبارات قائمة المدونات، الخطوة 4

أنشئ اختباراً لنموذج المدونة الجديد. يجب أن يتحقق الاختبار من أن النموذج يستدعي معالج الحدث الذي استقبله كـ props بالتفاصيل الصحيحة عند إنشاء مدونة جديدة.

</div>

<div class="content">

### اختبارات تكامل الواجهة الأمامية

في الجزء السابق من مواد الدورة، كتبنا اختبارات تكامل للواجهة الخلفية تختبر منطقها وتربط قاعدة البيانات عبر API الذي توفره الواجهة الخلفية. عند كتابة هذه الاختبارات، اتخذنا قراراً واعياً بعدم كتابة اختبارات وحدة، لأن شيفرة تلك الواجهة الخلفية بسيطة إلى حد كبير، ومن المحتمل أن تحدث الأخطاء في تطبيقنا في سيناريوهات أكثر تعقيداً مما تصلح له اختبارات الوحدة.

حتى الآن كانت جميع اختباراتنا للواجهة الأمامية اختبارات وحدة تحققت من الأداء الصحيح للمكوّنات الفردية. اختبار الوحدة مفيد أحياناً، لكن حتى مجموعة شاملة من اختبارات الوحدة لا تكفي للتحقق من أن التطبيق يعمل ككل.

يمكننا أيضاً إنشاء اختبارات تكامل للواجهة الأمامية. يختبر اختبار التكامل تعاون مكوّنات متعددة. وهو أصعب بكثير من اختبار الوحدة، إذ سيتعين علينا مثلاً محاكاة بيانات من الخادم.
اخترنا التركيز على إنشاء اختبارات من طرف إلى طرف لاختبار التطبيق بأكمله. سنعمل على اختبارات من طرف إلى طرف في الفصل التالي من هذا الجزء.

### اختبار اللقطات

تقدّم Vitest بديلاً مختلفاً تماماً عن الاختبار "التقليدي" يُسمى اختبار [اللقطات (snapshot)](https://vitest.dev/guide/snapshot). الميزة المثيرة في اختبار اللقطات هي أن المطورين لا يحتاجون إلى تعريف أي اختبارات بأنفسهم، فاعتماد اختبار اللقطات بسيط بما يكفي.

المبدأ الأساسي هو مقارنة شيفرة HTML التي يعرّفها المكوّن بعد تغيّرها بشيفرة HTML التي كانت موجودة قبل تغيّرها.

إذا لاحظت اللقطة تغيّراً ما في HTML الذي يعرّفه المكوّن، فهو إما وظيفة جديدة أو "خطأ" ناتج عن غير قصد. تُخطر اختبارات اللقطات المطوّر إذا تغيّرت شيفرة HTML للمكوّن. وعلى المطوّر أن يخبر Vitest إن كان التغيير مرغوباً أم غير مرغوب. إذا كان التغيير في شيفرة HTML غير متوقع، فهو يشير بقوة إلى خطأ، ويمكن للمطوّر أن يصبح على دراية بهذه المشكلات المحتملة بسهولة بفضل اختبار اللقطات.

</div>
