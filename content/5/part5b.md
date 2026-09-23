---
mainImage: /images/part-5.svg
part: 5
letter: b
lang: ar
---

<div class="content">

كُتب هذا القسم باستخدام React 19، وبعض ميزات React المقدَّمة في هذا الفصل لا تعمل مع الإصدارات الأقدم من React. كُتبت الأجزاء السابقة من الدورة باستخدام الإصدار 18 من React، لذا تأكد من أن مشروعك يضم الآن الإصدار 19 من React مثبَّتاً.

يمكنك فحص ملف <i>package.json</i> للتحقق من أن الإصدار 19 من مكتبتَي <i>react</i> و<i>react-dom</i> قيد الاستخدام:

```json
{
  // ...
  "dependencies": {
    "axios": "^1.9.0",
    "react": "^19.1.0", // highlight-line
    "react-dom": "^19.1.0" // highlight-line
  },
  // ...
}
```

شغّل أيضاً الأمر _npm install_ الذي يثبّت الاعتماديات وفقاً لملف <i>package.json</i>. هذا ضروري إذا كنت مثلاً قد نسختَ مستودع المثال في مرحلة سابقة من الدورة، حين كان إصدار أقدم من React لا يزال قيد الاستخدام.

### عرض نموذج تسجيل الدخول عند الحاجة فقط

لنعدّل التطبيق بحيث لا يُعرض نموذج تسجيل الدخول افتراضياً:

![متصفح يعرض زر تسجيل الدخول افتراضياً](../../images/5/10e.webp)

يظهر نموذج تسجيل الدخول عندما يضغط المستخدم على زر <i>login</i>:

![مستخدم في شاشة تسجيل الدخول على وشك الضغط على cancel](../../images/5/11e.webp)

يمكن للمستخدم إغلاق نموذج تسجيل الدخول بالنقر على زر <i>cancel</i>.

لنبدأ باستخراج نموذج تسجيل الدخول إلى مكوّن خاص به:

```js
const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

تُعرَّف الحالة وجميع الدوال المرتبطة بها خارج المكوّن وتُمرَّر إلى المكوّن عبر props.

لاحظ أن props تُسند إلى متغيرات عبر <i>التفكيك</i>، ما يعني أنه بدلاً من كتابة:

```js
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

حيث تُسنَد الخصائص مباشرةً إلى متغيراتها الخاصة بدلاً من الوصول إلى خصائص كائن _props_ عبر ما يشبه _props.handleSubmit_.

إحدى الطرق السريعة لتنفيذ هذه الوظيفة هي تغيير الدالة _loginForm_ في مكوّن <i>App</i> هكذا:

```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false) // highlight-line

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

تحتوي حالة مكوّن <i>App</i> الآن على القيمة المنطقية <i>loginVisible</i> التي تحدد ما إذا كان ينبغي عرض نموذج تسجيل الدخول للمستخدم أم لا.

تُبدَّل قيمة _loginVisible_ بزرين. ومعالجات أحداث كلا الزرين معرَّفة مباشرة في المكوّن:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

تُحدَّد رؤية المكوّن بإعطاء المكوّن قاعدة نمط [مضمّنة](/part2/adding_styles_to_react_app#inline-styles)، حيث تكون قيمة خاصية [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) هي <i>none</i> إذا لم نرد عرض المكوّن:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // زر
</div>

<div style={showWhenVisible}>
  // زر
</div>
```

نستخدم مرة أخرى المعامل الثلاثي «علامة الاستفهام». إذا كانت _loginVisible_ تساوي <i>true</i>، فستكون قاعدة CSS للمكوّن:

```css
display: 'none';
```

وإذا كانت _loginVisible_ تساوي <i>false</i>، فلن تتلقى <i>display</i> أي قيمة متعلقة برؤية المكوّن.

### أبناء المكوّن، المعروف أيضاً بـ props.children

يمكن اعتبار الشيفرة المتعلقة بإدارة رؤية نموذج تسجيل الدخول كياناً منطقياً قائماً بذاته، ولهذا السبب سيكون من الجيد استخراجها من مكوّن <i>App</i> إلى مكوّن منفصل.

هدفنا هو تنفيذ مكوّن <i>Togglable</i> جديد يمكن استخدامه بالطريقة التالية:

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

تختلف طريقة استخدام المكوّن قليلاً عن مكوّناتنا السابقة. فللمكوّن وسمَا فتح وإغلاق يحيطان بمكوّن <i>LoginForm</i>. في مصطلحات React، يُعدّ <i>LoginForm</i> مكوّناً ابناً لـ <i>Togglable</i>.

يمكننا إضافة أي عناصر React نريدها بين وسمَي فتح وإغلاق <i>Togglable</i>، مثل هذا على سبيل المثال:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

شيفرة مكوّن <i>Togglable</i> موضحة أدناه:

```js
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

الجزء الجديد والمثير للاهتمام في الشيفرة هو [props.children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) الذي يُستخدم للإشارة إلى المكوّنات الأبناء للمكوّن. المكوّنات الأبناء هي عناصر React التي نعرّفها بين وسمَي فتح وإغلاق المكوّن.

هذه المرة يُعرض الأبناء في الشيفرة المستخدمة لعرض المكوّن نفسه:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

على عكس props «العادية» التي رأيناها سابقاً، تُضيف React خاصية <i>children</i> تلقائياً وهي موجودة دائماً. وإذا عُرّف مكوّن بوسم إغلاق ذاتي _/>_ كهذا:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

فإن <i>props.children</i> عندئذٍ مصفوفة فارغة.

مكوّن <i>Togglable</i> قابل لإعادة الاستخدام، ويمكننا استخدامه لإضافة وظيفة تبديل الرؤية المشابهة إلى النموذج المستخدم لإنشاء ملاحظات جديدة.

قبل أن نفعل ذلك، لنستخرج نموذج إنشاء الملاحظات إلى مكوّن:

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

بعد ذلك، لنعرّف مكوّن النموذج داخل مكوّن <i>Togglable</i>:

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-4</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-4).

### حالة النماذج

توجد حالة التطبيق حالياً في مكوّن _App_.

تقول توثيقات React ما [يلي](https://react.dev/learn/sharing-state-between-components) حول مكان وضع الحالة:

<i>أحياناً تريد أن تتغير حالة مكوّنين معاً دائماً. لفعل ذلك، أزل الحالة من كليهما، وانقلها إلى أقرب سلف مشترك بينهما، ثم مرّرها إليهما عبر props. يُعرف هذا برفع الحالة لأعلى، وهو من أكثر الأمور شيوعاً التي ستفعلها أثناء كتابة شيفرة React.</i>

إذا فكرنا في حالة النماذج، ومثلاً محتوى ملاحظة جديدة قبل إنشائها، فلن يحتاج مكوّن _App_ إليها في أي شيء.
ويمكننا ببساطة نقل حالة النماذج إلى المكوّنات المقابلة.

يتغير مكوّن إنشاء ملاحظة جديدة هكذا:

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
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

**ملاحظة** في الوقت نفسه، غيّرنا سلوك التطبيق بحيث تصبح الملاحظات الجديدة مهمة افتراضياً، أي أن الحقل <i>important</i> يحصل على القيمة <i>true</i>.

نُقل متغير الحالة <i>newNote</i> ومعالج الأحداث المسؤول عن تغييره من مكوّن _App_ إلى المكوّن المسؤول عن نموذج الملاحظة.

لم تبقَ سوى خاصية واحدة هي الدالة _createNote_ التي يستدعيها النموذج عند إنشاء ملاحظة جديدة.

أصبح مكوّن _App_ أبسط الآن بعد أن تخلصنا من حالة <i>newNote</i> ومعالج أحداثها.
تستقبل الدالة _addNote_ الخاصة بإنشاء ملاحظات جديدة ملاحظة جديدة كوسيط، وهي الخاصية الوحيدة التي نرسلها إلى النموذج:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => { // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

يمكننا فعل الشيء نفسه مع نموذج تسجيل الدخول، لكننا سنترك ذلك لتمرين اختياري.

يمكن إيجاد شيفرة التطبيق على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-5)، في الفرع <i>part5-5</i>.

### الإشارة إلى المكوّنات باستخدام ref

تنفيذنا الحالي جيد تماماً، لكن فيه جانب واحد يمكن تحسينه.

بعد إنشاء ملاحظة جديدة، سيكون من المنطقي إخفاء نموذج الملاحظة الجديدة. حالياً يبقى النموذج ظاهراً. وهناك مشكلة بسيطة في إخفائه، إذ تُتحكَّم الرؤية بمتغير الحالة <i>visible</i> داخل مكوّن <i>Togglable</i>.

أحد الحلول لذلك سيكون نقل التحكم في حالة مكوّن Togglable إلى خارج المكوّن. لكننا لن نفعل ذلك الآن، لأننا نريد أن يكون المكوّن مسؤولاً عن حالته الخاصة. لذا علينا إيجاد حل آخر، وإيجاد آلية لتغيير حالة المكوّن من الخارج.

هناك عدة طرق مختلفة لتنفيذ الوصول إلى دوال المكوّن من خارجه، لكن لنستخدم آلية [ref](https://react.dev/learn/referencing-values-with-refs) في React التي توفر مرجعاً إلى المكوّن.

لنجرِ التغييرات التالية على مكوّن <i>App</i>:

```js
import { useState, useEffect, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

يُستخدم خطاف [useRef](https://react.dev/reference/react/useRef) لإنشاء مرجع <i>noteFormRef</i> الذي يُسند إلى مكوّن <i>Togglable</i> المحتوي على نموذج إنشاء الملاحظة. يعمل المتغير <i>noteFormRef</i> كمرجع إلى المكوّن. ويضمن هذا الخطاف بقاء المرجع (ref) نفسه طوال عمليات إعادة عرض المكوّن.

نجري أيضاً التغييرات التالية على مكوّن <i>Togglable</i>:

```js
import { useState, useImperativeHandle } from 'react' // highlight-line

const Togglable = (props) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })
// highlight-end

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

يستخدم المكوّن خطاف [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) لجعل دالته <i>toggleVisibility</i> متاحة خارج المكوّن.

يمكننا الآن إخفاء النموذج باستدعاء <i>noteFormRef.current.toggleVisibility()</i> بعد إنشاء ملاحظة جديدة:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

وخلاصة القول، إن دالة [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) هي خطاف في React يُستخدم لتعريف دوال في مكوّن يمكن استدعاؤها من خارج المكوّن.

هذه الحيلة تنجح في تغيير حالة مكوّن، لكنها تبدو غير مستحسنة قليلاً. كان يمكننا تحقيق الوظيفة نفسها بشيفرة أنظف قليلاً باستخدام مكوّنات الأصناف (class components) من «React القديم». سنلقي نظرة على مكوّنات الأصناف هذه خلال الجزء السابع من مادة الدورة. وحتى الآن، هذه هي الحالة الوحيدة التي يؤدي فيها استخدام خطافات React إلى شيفرة ليست أنظف مما هو الحال مع مكوّنات الأصناف.

هناك أيضاً [حالات استخدام أخرى](https://react.dev/learn/manipulating-the-dom-with-refs) للمراجع غير الوصول إلى مكوّنات React.

يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-6</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-6).

### ملاحظة حول المكوّنات

عندما نعرّف مكوّناً في React:

```js
const Togglable = () => ...
  // ...
}
```

ونستخدمه هكذا:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

ننشئ <i>ثلاث نسخ منفصلة من المكوّن</i>، ولكل منها حالتها المنفصلة:

![متصفح يعرض ثلاثة مكوّنات Togglable](../../images/5/12e.webp)

تُستخدم خاصية <i>ref</i> لإسناد مرجع إلى كل من المكوّنات في المتغيرات <i>togglable1</i> و<i>togglable2</i> و<i>togglable3</i>.

### قسم مطوّر full stack المحدَّث

يزداد عدد الأجزاء المتحركة. وفي الوقت نفسه، يزداد احتمال الوقوع في موقف نبحث فيه عن خطأ في المكان الخطأ. لذا نحتاج إلى أن نكون أكثر منهجية.

لذا ينبغي أن نوسّع قسمنا مرة أخرى:

تطوير full stack <i>صعب للغاية</i>، ولهذا سأستخدم كل الوسائل الممكنة لتسهيله

- سأبقي وحدة تحكم مطوّري المتصفح مفتوحة طوال الوقت
- سأستخدم تبويب network في أدوات مطوّري المتصفح للتأكد من أن الواجهة الأمامية والخلفية تتواصلان كما أتوقع
- سأراقب باستمرار حالة الخادم للتأكد من أن البيانات التي ترسلها الواجهة الأمامية إليه تُحفظ هناك كما أتوقع
- سأراقب قاعدة البيانات: هل تحفظ الواجهة الخلفية البيانات فيها بالصيغة الصحيحة
- سأتقدم بخطوات صغيرة
- <i>عندما أشك في وجود خطأ في الواجهة الأمامية، سأتأكد من أن الواجهة الخلفية تعمل كما هو متوقع</i>
- <i>عندما أشك في وجود خطأ في الواجهة الخلفية، سأتأكد من أن الواجهة الأمامية تعمل كما هو متوقع</i>
- سأكتب الكثير من عبارات _console.log_ للتأكد من فهمي لكيفية تصرف الشيفرة والاختبارات وللمساعدة في تحديد المشكلات
- إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل سأبدأ بحذفها حتى تعمل أو أعود ببساطة إلى حالة كان فيها كل شيء ما زال يعمل
- إذا لم ينجح اختبار، سأتأكد من أن الوظيفة المُختبَرة تعمل بشكل صحيح في التطبيق
- عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في أي مكان آخر، أصوغ أسئلتي بشكل صحيح، انظر [هنا](/part0/general_info#how-to-get-help-in-discord) لكيفية طلب المساعدة

</div>

<div class="tasks">

### تمارين 5.5.-5.11.

#### 5.5 واجهة قائمة المدونات الأمامية، الخطوة 5

غيّر نموذج إنشاء منشورات المدونات بحيث لا يُعرض إلا عند الحاجة. استخدم وظيفة مشابهة لما عُرض [سابقاً في هذا الجزء من مادة الدورة](/part5/props_children_and_component_refs#displaying-the-login-form-only-when-appropriate). وإذا رغبت في ذلك، يمكنك استخدام مكوّن <i>Togglable</i> المعرَّف في الجزء 5.

افتراضياً لا يكون النموذج ظاهراً

![متصفح يعرض زر ملاحظة جديدة دون نموذج](../../images/5/13ae.webp)

يتمدد عند النقر على زر <i>create new blog</i>

![متصفح يعرض النموذج مع create new](../../images/5/13be.webp)

يُخفى النموذج مرة أخرى بعد إنشاء مدونة جديدة أو الضغط على زر <i>cancel</i>.

#### 5.6 واجهة قائمة المدونات الأمامية، الخطوة 6

افصل نموذج إنشاء مدونة جديدة إلى مكوّن خاص به (إن لم تكن قد فعلت ذلك بالفعل)، وانقل كل الحالات المطلوبة لإنشاء مدونة جديدة إلى هذا المكوّن.

يجب أن يعمل المكوّن مثل مكوّن <i>NoteForm</i> من [مادة](/part5/props_children_and_component_refs#state-of-the-forms) هذا الجزء.

#### 5.7 واجهة قائمة المدونات الأمامية، الخطوة 7

لنضف زراً إلى كل مدونة يتحكم في عرض جميع تفاصيل المدونة أو عدم عرضها.

تُفتح التفاصيل الكاملة للمدونة عند النقر على الزر.

![متصفح يعرض التفاصيل الكاملة لمدونة، بينما تملك بقية المدونات أزرار view فقط](../../images/5/13ea.webp)

وتُخفى التفاصيل عند النقر على الزر مرة أخرى.

في هذه المرحلة، لا يحتاج زر <i>like</i> إلى فعل أي شيء.

يحتوي التطبيق الظاهر في الصورة على قليل من CSS الإضافي لتحسين مظهره.

من السهل إضافة أنماط إلى التطبيق كما هو موضح في الجزء 2 باستخدام الأنماط [المضمّنة](/part2/adding_styles_to_react_app#inline-styles):

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}> // highlight-line
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**ملاحظة:** رغم أن الوظيفة المنفَّذة في هذا الجزء تكاد تكون مطابقة للوظيفة التي يوفرها مكوّن <i>Togglable</i>، فلا يمكن استخدامه مباشرةً لتحقيق السلوك المطلوب. سيكون الحل الأسهل هو إضافة حالة إلى مكوّن المدونة تتحكم في عرض التفاصيل أو عدم عرضها.

#### 5.8: واجهة قائمة المدونات الأمامية، الخطوة 8

نفّذ وظيفة زر الإعجاب. تُزاد الإعجابات بإرسال طلب HTTP من نوع _PUT_ إلى العنوان الفريد لمنشور المدونة في الواجهة الخلفية.

بما أن عملية الواجهة الخلفية تستبدل منشور المدونة بأكمله، فسيتعين عليك إرسال جميع حقوله في جسم الطلب. إذا أردت إضافة إعجاب إلى منشور المدونة التالي:

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

فسيتعين عليك إرسال طلب HTTP PUT إلى العنوان <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> ببيانات الطلب التالية:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

يجب تحديث الواجهة الخلفية أيضاً للتعامل مع مرجع المستخدم.

#### 5.9: واجهة قائمة المدونات الأمامية، الخطوة 9

نلاحظ أن هناك خطباً ما. عندما يُعجَب بمدونة في التطبيق، لا يظهر اسم المستخدم الذي أضاف المدونة في تفاصيلها:

![متصفح يعرض اسماً مفقوداً أسفل زر الإعجاب](../../images/5/59put.webp)

عند إعادة تحميل المتصفح، تظهر معلومات الشخص. هذا غير مقبول؛ اكتشف أين تكمن المشكلة وأجرِ التصحيح اللازم.

بالطبع، من الممكن أن تكون قد أنجزت كل شيء بشكل صحيح بالفعل ولا تظهر المشكلة في شيفرتك. في هذه الحالة، يمكنك المتابعة.

#### 5.10: واجهة قائمة المدونات الأمامية، الخطوة 10

عدّل التطبيق ليرتب منشورات المدونات حسب عدد <i>likes</i>. يمكن إجراء الترتيب باستخدام دالة [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) الخاصة بالمصفوفات.

#### 5.11: واجهة قائمة المدونات الأمامية، الخطوة 11

أضف زراً جديداً لحذف منشورات المدونات. ونفّذ أيضاً منطق حذف منشورات المدونات في الواجهة الأمامية.

قد يبدو تطبيقك شيئاً كهذا:

![متصفح يعرض تأكيد حذف مدونة](../../images/5/14ea.webp)

يسهل تنفيذ نافذة تأكيد حذف منشور مدونة باستخدام دالة [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm).

أظهر زر حذف منشور المدونة فقط إذا كان المستخدم هو من أضاف المنشور.

</div>

<div class="content">

### ESlint

في الجزء 3 أعددنا أداة نمط الشيفرة [ESlint](/part3/validation_and_es_lint#lint) للواجهة الخلفية. لنستخدم ESlint في الواجهة الأمامية أيضاً.

ثبّت Vite أداة ESlint في المشروع افتراضياً، لذا كل ما يتبقى لنا هو تعريف الإعداد الذي نريده في ملف <i>eslint.config.js</i>.

لننشئ ملف <i>eslint.config.js</i> بالمحتوى التالي:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      // highlight-start
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
      //highlight-end
    }
  }
]
```

ملاحظة: إذا كنت تستخدم Visual Studio Code مع إضافة ESLint، فقد تحتاج إلى إضافة إعداد مساحة عمل لكي يعمل. وإذا ظهرت لك رسالة <i>Failed to load plugin react: Cannot find module 'eslint-plugin-react'</i> فستكون هناك حاجة إلى إعداد إضافي. وقد تساعد إضافة السطر التالي إلى settings.json:

```js
"eslint.workingDirectories": [{ "mode": "auto" }]
```

انظر [هنا](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807) لمزيد من المعلومات.

كما اعتدنا، يمكنك تشغيل أداة lint إما من سطر الأوامر بالأمر

```bash
npm run lint
```

أو باستخدام إضافة Eslint في محرّرك.

يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-7</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-7).

</div>

<div class="tasks">

### تمرين 5.12.

#### 5.12: واجهة قائمة المدونات الأمامية، الخطوة 12

أضف ESlint إلى المشروع. وعرّف الإعداد كما يحلو لك. وأصلح جميع أخطاء أداة lint.

ثبّت Vite أداة ESlint في المشروع افتراضياً، لذا كل ما يتبقى عليك فعله هو تعريف الإعداد الذي تريده في ملف <i>eslint.config.js</i>.

</div>
