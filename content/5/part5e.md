---
mainImage: /images/part-5.svg
part: 5
letter: e
lang: ar
---

<div class="content">

واجهة مستخدم تطبيقنا بسيطة إلى حد كبير حالياً:

![](../../images/5/u1.webp)

نريد تغيير ذلك. لنبدأ ببنية التنقّل في التطبيق.

من الشائع جداً أن تحتوي تطبيقات الويب على شريط تنقّل يتيح للمستخدمين التبديل بين عروض مختلفة داخل التطبيق. يمكن أن يتضمّن تطبيق تدوين الملاحظات لدينا صفحة رئيسية:

![](../../images/5/u6.webp)

وصفحة منفصلة لعرض الملاحظات:

![](../../images/5/u7.webp)

وكذلك صفحة لإنشاء الملاحظات:

![](../../images/5/u8.webp)

في [تطبيق ويب من الطراز القديم](/part0/fundamentals_of_web_apps#traditional-web-applications)، كان التبديل بين الصفحات التي يعرضها التطبيق يتضمّن إرسال المتصفح طلب HTTP GET جديد إلى الخادم، ثم عرض شيفرة HTML التي يعيدها الخادم، والتي تقابل العرض الجديد.

أما في تطبيقات الصفحة الواحدة، فأنت في الواقع على الصفحة نفسها طوال الوقت، وشيفرة JavaScript المنفَّذة في المتصفح تخلق وهم «صفحات» مختلفة. وإذا أُجريت طلبات HTTP عند تغيير العرض، فهي تُستخدم فقط لجلب بيانات بصيغة JSON قد تكون مطلوبة لعرض العرض الجديد.

سيكون من السهل تنفيذ تطبيق يحتوي على شريط تنقّل وعروض متعددة باستخدام React، مثلاً بأن تجعل حالة التطبيق <i>page</i> تتذكّر الصفحة التي يوجد فيها المستخدم، وتعرض العرض الصحيح بناءً على ذلك:


```js
const App = () => {
  const [page, setPage] = useState('home')

 const  toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }

  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')} >
          home
        </a>
        <a href="" onClick={toPage('notes')}>
          notes
        </a>
        <a href="" onClick={toPage('users')} >
          users
        </a>
      </div>

      {content()}
    </div>
  )
}
```

لكن هذه الطريقة ليست مثالية: يبقى عنوان URL للموقع كما هو حتى عندما تكون في عرض مختلف. ينبغي أن يكون لكل عرض عنوان URL خاص به، حتى يتمكّن المستخدمون مثلاً من حفظ الصفحات في المفضلة. علاوة على ذلك، لا يعمل زر الرجوع في المتصفح بشكل منطقي إذا لم تكن للصفحات عناوين خاصة بها؛ أي أن النقر على زر الرجوع لا ينقلك إلى العرض الذي شاهدته سابقاً في التطبيق بل إلى مكان آخر تماماً.

### React Router

لحسن الحظ، تقدّم مكتبة [React Router](https://reactrouter.com/) حلاً ممتازاً لإدارة التنقّل في تطبيق React.

ثبّت React Router:

```bash
npm install react-router-dom
```

أنشئ مكوّناً جديداً يعمل كصفحة رئيسية للتطبيق

```js
const Home = () => {
  return (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  )
}

export default Home
```

سنستخرج العرض الرئيسي السابق للتطبيق (الذي كان في المكوّن <i>App</i>) إلى مكوّن خاص به، لكن سننقل إدارة حالة الملاحظات خارج المكوّن:

```js
// قائمة الملاحظات تُمرَّر كمعامل
const NoteList = ({ notes }) => { // highlight-line
  // المحتوى مطابق تقريباً لما في مكوّن App
  // أُزيلت الإشارة إلى NoteForm
}
```

يتغيّر المكوّن <i>App</i> الآن كما يلي


```js
import { useState, useEffect } from 'react'
import noteService from './services/notes'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import NoteList from './components/NoteList'
import Home from './components/Home'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const padding = {
    padding: 5
  }

  return (
    // highlight-start
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>
        // highlight-end  

    // highlight-start
      <Routes>
        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Router>
    // highlight-end
  )
}

export default App
```

يُفعَّل التوجيه، أي العرض الشرطي للمكوّنات بناءً على <i>URL</i> المتصفح، بوضع المكوّنات كأبناء لمكوّن [Router](https://reactrouter.com/api/declarative-routers/Router)، أي داخل وسوم <i>Router</i>.

أولاً، يُعرَّف شريط تنقّل التطبيق باستخدام مكوّنات [Link](https://reactrouter.com/api/components/Link). تحدّد السمة <i>to</i> كيفية تغيّر عنوان URL في المتصفح عند النقر على الرابط:

```js
<div>
  <Link style={padding} to="/">home</Link>
  <Link style={padding} to="/notes">notes</Link>
  <Link style={padding} to="/create">new note</Link>
</div>
```

بعد ذلك، يُعرَّف توجيه التطبيق باستخدام مكوّن [Routes](https://reactrouter.com/api/components/Routes). وداخل المكوّن، نستخدم [Route](https://reactrouter.com/api/components/Route) لتعريف مجموعة من القواعد والمكوّنات القابلة للعرض المقابلة لها:

```js
<Routes>
  <Route path="/notes" element={
    <NoteList notes={notes} />
  } />
  <Route path="/create" element={
    <NoteForm createNote={addNote}/>
  } />
  <Route path="/" element={<Home />} />
</Routes>
```

إذا كنت في عنوان URL الجذري للتطبيق، يُعرض المكوّن <i>Home</i>:

![](../../images/5/u2.webp)

عند النقر على «notes» في شريط التنقّل، يتغيّر العنوان في شريط عنوان المتصفح إلى <i>notes</i>، ويُعرض المكوّن <i>NoteList</i>:

![](../../images/5/u3.webp)

وبالمثل، عند النقر على «new note»، يصبح عنوان URL هو <i>create</i>، ويُعرض المكوّن <i>NoteForm</i>.

في صفحة ويب عادية، يؤدي تغيير العنوان في شريط عنوان المتصفح إلى إعادة تحميل الصفحة. لكن عند استخدام React Router، لا يحدث ذلك؛ بل يُدار التوجيه بالكامل عبر JavaScript في الواجهة الأمامية.

مكوّن Router الذي نستخدمه هو [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router):

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from 'react-router-dom'
```

وفقاً [للتوثيق](https://reactrouter.com/en/main/router-components/browser-router)

> <i>BrowserRouter</i> هو <i>Router</i> يستخدم واجهة history في HTML5 (pushState وreplaceState وحدث popstate) لإبقاء واجهة المستخدم متزامنة مع عنوان URL.

يستخدم <i>BrowserRouter</i> [واجهة History في HTML5](https://css-tricks.com/using-the-html5-history-api/) للسماح باستخدام عنوان URL في شريط عنوان المتصفح في «التوجيه» الداخلي ضمن تطبيق React، بمعنى أنه حتى إذا تغيّر عنوان URL في شريط العنوان، فإن محتوى الصفحة يُعالَج عبر JavaScript فقط، ولا يحمّل المتصفح محتوى جديداً من الخادم. ومع ذلك، فإن سلوك المتصفح فيما يتعلق بوظيفتي الرجوع والتقدّم والحفظ في المفضلة يبقى بديهياً — فهو يعمل تماماً كما في المواقع التقليدية.

شيفرة التطبيق الحالية متاحة بالكامل على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10)، في الفرع <i>part5-10</i>.

### مسار بمعامل

لننقل تفاصيل ملاحظة واحدة إلى عرض خاص بها، يمكن الوصول إليه بالنقر على اسم الملاحظة:

![](../../images/5/u4.webp)


نُفِّذت قابلية النقر على الاسم في المكوّن <i>NoteList</i> كما يلي:

```js
import { Link } from 'react-router-dom' // highlight-line

const NoteList = ({ notes }) => {
  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link> // highlight-line
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoteList
```

إذن، يُستخدم [Link](https://reactrouter.com/api/components/Link) مرة أخرى. مثلاً، النقر على اسم ملاحظة معرّفها <i>id</i> هو 12345 يؤدي إلى تحديث عنوان URL في المتصفح إلى <i>notes/12345</i>.

يُعرَّف عنوان URL ذو المعامل في التوجيه داخل المكوّن <i>App</i> كما يلي:

```js
<Router>
  // ...

  <Routes>
    // highlight-start
    <Route path="/notes/:id" element={
      <Note notes={notes} toggleImportanceOf={toggleImportanceOf} />
     } />
    // highlight-end
    <Route path="/notes" element={<Notes notes={notes} />} />   
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />      
  </Routes>
</Router>
```

المسار الذي يعرض واجهة ملاحظة واحدة يُعرَّف بأسلوب «Express» عبر وسم معامل المسار بالترميز <i>:id</i> كما يلي:

```js
<Route path="/notes/:id" element={<Note notes={notes} ... />} />
```

عندما ينتقل المتصفح إلى عنوان URL الفريد لملاحظة، مثل <i>/notes/12345</i>، يُعرض المكوّن <i>Note</i>، الذي اضطررنا الآن إلى تعديله قليلاً:

```js
import { useParams } from 'react-router-dom' // highlight-line

const Note = ({ notes, toggleImportance }) => {
  // highlight-start
  const id = useParams().id
  const note = notes.find(n => n.id === id)
  // highlight-end

  const label = note.important ? 'make not important' : 'make important'

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={() => toggleImportance(id)}>{label}</button>
    </li>
  )
}

export default Note
```

خلافاً لما كان عليه الحال سابقاً، يتلقّى المكوّن <i>Note</i> الآن <i>كل الملاحظات</i> عبر prop المسمّى <i>notes</i>، ويمكنه الوصول إلى الجزء الفريد من عنوان URL، وتحديداً <i>id</i> الملاحظة المراد عرضها، باستخدام دالة React Router المسماة [useParams](https://reactrouter.com/api/hooks/useParams).

### useNavigate

تدعم الواجهة الخلفية بالفعل حذف الملاحظات. لتنفيذ ذلك، لنضف زراً إلى صفحة الملاحظة الفردية في التطبيق:

![](../../images/5/u5.webp)

لنضف معالجاً إلى المكوّن <i>App</i> ينفّذ الحذف، ونمرّره إلى المكوّن <i>Note</i>:

```js
const App = () => {

  // highlight-start
  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
  }
  // highlight-end

  return (
      // ...

      <Routes>
        <Route path="/notes/:id" element={
          <Note 
            notes={notes}
            toggleImportanceOf={toggleImportanceOf}
            deleteNote={deleteNote} // highlight-line
          />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Router>
  )
}  
```

يتغيّر المكوّن <i>Note</i> كما يلي:

```js
import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ notes, toggleImportanceOf, deleteNote }) => { // highlight-line
  const id = useParams().id
  const navigate = useNavigate()  // highlight-line
  const note = notes.find(n => n.id === id)

  const label = note.important ? 'make not important' : 'make important'

// highlight-start
  const handleDelete = () => {
    if (window.confirm(`Delete note "${note.content}"?`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }
  // highlight-end

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={() => toggleImportanceOf(id)}>{label}</button>
      <button onClick={handleDelete}>delete</button>  // highlight-line
    </li>
  )
}

export default Note
```

عند حذف ملاحظة، يُعاد توجيه المستخدم إلى الصفحة التي تسرد كل الملاحظات. ويتم ذلك باستدعاء الدالة التي يعيدها [useNavigate](https://reactrouter.com/api/components/Navigate) من React Router مع عنوان URL المطلوب: <i>navigate('/notes')</i>.

الدالتان [useParams](https://reactrouter.com/api/hooks/useParams) و[useNavigate](https://reactrouter.com/api/components/Navigate) من مكتبة React Router هما دالتا خطاف، تماماً مثل useState وuseEffect اللتين استخدمناهما مرات عديدة. وكما نتذكّر من الجزء 1، هناك [قواعد](/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks) معيّنة مرتبطة باستخدام دوال الخطافات.

لنعدّل أيضاً المكوّن <i>NoteForm</i> بحيث يُوجَّه المستخدم، بعد إضافة ملاحظة جديدة، إلى الصفحة التي تحتوي على كل الملاحظات:

```js
import { useState } from 'react' 
import { useNavigate } from 'react-router-dom' // highlight-line

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate() // highlight-line

  const addNote = event => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    navigate('/notes') // highlight-line
    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          placeholder="write note content here"
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

### إعادة النظر في المسار بمعامل

هناك مشكلة مزعجة قليلاً في التطبيق. يتلقّى المكوّن _Note_ <i>كل الملاحظات</i> كـ props، رغم أنه لا يعرض سوى الملاحظة التي يطابق <i>id</i> الخاص بها الجزء ذا المعامل من عنوان URL:

```js
const Note = ({ notes, toggleImportance }) => { 
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

هل يمكن تعديل التطبيق بحيث يتلقّى _Note_ الملاحظة المراد عرضها فقط كـ prop:

```js
import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ note, id, toggleImportanceOf, deleteNote }) => {  // highlight-line
  const id = useParams().id
  const navigate = useNavigate()

  // ...

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={() => toggleImportanceOf(id)}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

export default Note
```

إحدى الطرق هي تحديد <i>id</i> الملاحظة المراد عرضها داخل المكوّن باستخدام دالة الخطاف [useMatch](https://reactrouter.com/api/hooks/useMatch) من React Router.

لا يمكن استخدام خطاف <i>useMatch</i> في المكوّن نفسه الذي يعرّف الجزء القابل للتوجيه من التطبيق. لننقل مكوّن <i>Router</i> خارج <i>App</i>:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router> // highlight-line
)
```

يصبح المكوّن <i>App</i>:

```js
import {
  // ...
  useMatch  // highlight-line
} from 'react-router-dom'

const App = () => {
  // ...

 // highlight-start
  const match = useMatch('/notes/:id')

  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null
  // highlight-end

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note} // highlight-line
            toggleImportanceOf={toggleImportanceOf}
            deleteNote={deleteNote}
          />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <em>Note app, Department of Computer Science 2026</em>
      </div>
    </div>
  )
}    
```

في كل مرة يُعرض فيها المكوّن <i>App</i> (وهو ما يحدث عملياً كلما تغيّر عنوان URL في شريط عنوان المتصفح) يُنفَّذ الأمر التالي

```js
const match = useMatch('/notes/:id')
```

إذا كان عنوان URL بالصيغة _/notes/:id_، أي يقابل عنوان URL لملاحظة واحدة، تُسنَد إلى المتغيّر <i>match</i> قيمة كائن يمكن استخدامه لتحديد الجزء ذي المعامل من المسار، أي <i>id</i> الملاحظة. وهذا يتيح لنا استرجاع الملاحظة المراد عرضها:

```js
const note = match 
  ? notes.find(note => note.id === match.params.id)
  : null
```


لا يزال هناك خطأ صغير في تطبيقنا. إذا أُعيد تحميل المتصفح في صفحة ملاحظة واحدة، يحدث خطأ:

![](../../images/5/u5.webp)

تنشأ المشكلة لأن الصفحة يُحاول عرضها قبل جلب الملاحظات من الواجهة الخلفية. يمكننا حل هذه المشكلة بالعرض الشرطي:

```js
const Note = ({ note, toggleImportanceOf, deleteNote }) => {
  const id = useParams().id
  const navigate = useNavigate()

// highlight-start
  if(!note) {
    return null
  }
  // highlight-end

  return (
    //...
  )
}
```

في التطبيق ميزة مزعجة أخرى: منطق تسجيل الدخول لا يزال كله في الصفحة التي تسرد الملاحظات. ومع ذلك، سنترك الوظيفة في هذه الحالة غير المكتملة نوعاً ما في الوقت الحالي.

شيفرة التطبيق الحالية متاحة بالكامل على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11)، في الفرع <i>part5-11</i>.

</div>

<div class="tasks">

### تمارين 5.24–5.28.

#### 5.24: مدوّنات موجّهة، الخطوة 1

أضف React Router إلى تطبيق المدوّنات بحيث يتيح لك النقر على الروابط في شريط التنقّل التحكّم في العرض المعروض.

في جذر التطبيق، أي المسار _/_، تُعرض قائمة بكل المدوّنات:

![](../../images/5/l1.webp)

يتيح المسار _/login_ للمستخدمين تسجيل الدخول

![](../../images/5/l2.webp)

إذا كان المستخدم مسجّلاً، يظهر زر تسجيل الخروج في شريط التنقّل:

![](../../images/5/l3.webp)

بعد تسجيل الدخول والخروج، ينبغي توجيه المستخدم إلى الصفحة التي تسرد كل المدوّنات.

في هذه المرحلة، لا تحتاج إلى القلق بشأن إنشاء المدوّنات بعد.

#### 5.25: مدوّنات موجّهة، الخطوة 2

نفّذ عرضاً في التطبيق يعرض معلومات تدوينة واحدة:

![](../../images/5/l5.webp)

ينتقل المستخدمون إلى عرض التدوينة الواحدة من قائمة المدوّنات:

![](../../images/5/l4.webp)

تأكد من أن ميزة «الإعجاب» بالمدوّنات لا تزال تعمل! وعدّل الوظيفة أيضاً بحيث لا يستطيع إلا المستخدمون المسجّلون «الإعجاب» بتدوينة.

#### 5.26: مدوّنات موجّهة، الخطوة 3

أنشئ عرضاً جديداً لإنشاء تدوينة جديدة، يمكن للمستخدمين المسجّلين الوصول إليه عبر شريط التنقّل:

![](../../images/5/l6.webp)

ينبغي أن تؤدي إضافة تدوينة جديدة وحذف تدوينة موجودة إلى إعادة توجيه المستخدم إلى عرض كل المدوّنات

#### 5.27: مدوّنات موجّهة، الخطوة 4

أصبحت سهولة استخدام التطبيق ومظهره أفضل من قبل. لسوء الحظ، تعطّلت بعض الاختبارات.

عدّل الآن اختبارات عرض التدوينة الواحدة المكتوبة بـ Vitest كما يلي
- تُعرض معلومات التدوينة وعدد الإعجابات للمستخدمين غير المسجّلين، ولا تُعرض الأزرار
- يُعرض للمستخدمين المسجّلين الذين ليسوا منشئي التدوينة زر الإعجاب فقط
- يُعرض لمنشئ التدوينة أيضاً زر الحذف

#### 5.28: مدوّنات موجّهة، الخطوة 5

التالي هو إصلاح الاختبارات الشاملة من الطرف إلى الطرف المكتوبة بـ Playwright. الاختبارات التي كتبناها سابقاً معطّلة تماماً، وسنضطر إلى إجراء تغييرات كبيرة عليها.

أنشئ اختبارات للسيناريوهات التالية:
- ينجح تسجيل الدخول مع الجمع الصحيح لاسم المستخدم/كلمة المرور
- يفشل تسجيل الدخول إذا كان اسم المستخدم/كلمة المرور غير صحيحين
- يمكن للمستخدم المسجّل إنشاء تدوينة
- يمكن للمستخدم المسجّل الإعجاب بالمدوّنات
- يمكن للمستخدم المسجّل حذف تدوينة

إذن، لا يتم اختبار ترتيب المدوّنات حسب الإعجابات في الوقت الحالي.

</div>

<div class="content">

### مكتبات الواجهات

اطّلعنا في الجزء 2 على طريقتين لإضافة الأنماط: ملف [CSS واحد](/part2/adding_styles_to_react_app) من الطراز القديم و[الأنماط المضمّنة](/part2/adding_styles_to_react_app#inline-styles). في هذا القسم، سنطّلع على بضع طرق أخرى.

من الطرق المتّبعة لتعريف أنماط التطبيق استخدام «إطار عمل للواجهات»، أو بعبارة أخرى مكتبة أنماط للواجهات.

أول إطار عمل للواجهات حقّق شعبية واسعة كان [Bootstrap](https://getbootstrap.com/)، الذي طوّرته Twitter. وخلال السنوات القليلة الماضية، ظهرت أطر عمل الواجهات بكثرة كالفطر بعد المطر. والاختيار واسع جداً لدرجة أنه لا يستحق حتى محاولة إعداد قائمة شاملة هنا.

تتضمّن كثير من أطر عمل الواجهات سمات معرّفة مسبقاً لتطبيقات الويب، إضافة إلى «مكوّنات» مثل الأزرار والقوائم والجداول. وقد وُضع مصطلح «مكوّن» بين علامتَي اقتباس أعلاه لأنه لا يشير تماماً إلى الشيء نفسه الذي يشير إليه مكوّن React. في أغلب الأحيان، تُستخدم أطر عمل الواجهات بتضمين أوراق أنماط CSS وشيفرة JavaScript الخاصة بالإطار في التطبيق.

كُيِّفت كثير من أطر عمل الواجهات إلى نسخ متوافقة مع React، حيث حُوّلت «المكوّنات» التي يعرّفها إطار العمل إلى مكوّنات React. مثلاً، هناك نسختان من Bootstrap لـ React، وأشهرهما [React-Bootstrap](https://react-bootstrap.github.io/).

بدلاً من Bootstrap، لنطّلع الآن على ما هو ربما أشهر إطار عمل للواجهات حالياً: مكتبة React المسماة [MaterialUI](https://mui.com/)، التي تطبّق لغة التصميم [Material Design](https://material.io/) من Google.

لنثبّت المكتبة:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

عند استخدام MaterialUI، يُعرض عادةً محتوى التطبيق كله داخل مكوّن [Container](https://material-ui.com/components/container/):

```js
import { Container } from '@mui/material'

const App = () => {
  // ...
  return (
    <Container>
      // ...
    </Container>
  )
}
```

#### الجدول

لنبدأ بالمكوّن <i>NoteList</i> ونعرض قائمة الملاحظات كـ[جدول](https://mui.com/material-ui/react-table/#simple-table)، يعرض أيضاً المستخدم الذي أنشأ كل ملاحظة:

```js
import { useState, useEffect } from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

//...

const NoteList = ({ notes }) => {

  // ...

  return (
    <div>
      // ...
      <h2>Notes</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map(note => (
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>
                    {note.content}
                  </Link>
                </TableCell>
                <TableCell>
                  {note.user.name}
                </TableCell>
                <TableCell>
                  {note.important ? 'yes': ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}

export default NoteList
```

يبدو الجدول كما يلي:

![](../../images/5/u10.webp)


#### النموذج

بعد ذلك، لنحسّن عرض إنشاء ملاحظة جديدة <i>NoteForm</i> باستخدام مكوّني [TextField](https://mui.com/components/text-fields/) و[Button](https://mui.com/api/button/):

```js 
import { TextField, Button } from '@mui/material'

// ...

const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <TextField
          label="note content"
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NoteForm

```

النتيجة أنيقة:

![](../../images/5/u11.webp)

#### الإشعارات


لنحسّن مكوّن الإشعارات في التطبيق باستخدام مكوّن [Alert](https://mui.com/components/alert/) من MaterialUI:

```js
import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={notification.type}>
      {notification.text}
    </Alert>
  )
}

export default Notification
```

انقل مكوّن الإشعارات وإدارة حالته إلى المكوّن <i>App</i>:

```js
const App = () => {
  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null) // highlight-line

  // ...

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNotification({ text: `Note '${returnedNote.content}' added!`, type: 'success' }) // highlight-line
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  return (
    <Container>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>

      <Notification notification={notification} /> // highlight-line

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportanceOf={toggleImportanceOf}
            deleteNote={deleteNote}
          />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes} setNotification={setNotification} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Container>
  )
}
```

يتميّز Alert بتصميم أنيق:

![](../../images/5/u12.webp)

#### قائمة التنقّل

تُنفَّذ قائمة التنقّل باستخدام مكوّن [AppBar](https://mui.com/components/app-bar/).

إذا طبّقنا المثال من التوثيق مباشرة

```js
<AppBar position="static">
  <Toolbar>
    <Button color="inherit"><Link to="/">home</Link></Button>
    <Button color="inherit"><Link to="/notes">notes</Link></Button>
    <Button color="inherit"><Link to="/create">new note</Link></Button>
  </Toolbar>
</AppBar>
```

يوفر هذا حلاً يعمل بالفعل، لكن مظهره ليس الأفضل ممكناً:

![](../../images/5/u15.webp)

بتصفّح [التوثيق](https://mui.com/material-ui/guides/composition/# routing-libraries)، ستجد طريقة أفضل: [خاصية component](https://mui.com/material-ui/guides/composition/#component-prop)، التي تتيح لك تغيير طريقة عرض العنصر الجذري لمكوّن MaterialUI.

بتعريف

```js
<Button color="inherit" component={Link} to="/">
  home
</Button>
```

يُعرض مكوّن <i>Button</i> بحيث يكون مكوّنه الجذري هو مكوّن <i>Link</i> من مكتبة <i>react-router-dom</i>، ويُمرَّر إليه prop المسمّى <i>to</i> الذي يحدّد المسار.

الشيفرة الكاملة لشريط التنقّل كما يلي

```js
<AppBar position="static">
  <Toolbar>
    <Button color="inherit" component={Link} to="/">home</Button>
    <Button color="inherit" component={Link} to="/notes">notes</Button>
    <Button color="inherit" component={Link} to="/create">new note</Button>
  </Toolbar>
</AppBar>
```

وتبدو النتيجة تماماً كما نريد:

![](../../images/5/u16.webp)

لكننا نلاحظ أن مؤشّر التحويم باهت جداً عند تحريك الفأرة فوق شريط التنقّل. لنصلح ذلك بتعريف لون خلفية أفضل قليلاً لهذه الحالات:

```js
const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

return (
  <Container>
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/" sx={style}>
          home
        </Button>
        <Button color="inherit" component={Link} to="/notes" sx={style}>
          notes
        </Button>
        <Button color="inherit" component={Link} to="/create" sx={style}>
          new note
        </Button>
      </Toolbar>
    </AppBar>

    // ...
)
```

نحن راضون أخيراً:

![](../../images/5/u17.webp)

شيفرة التطبيق الحالية متاحة بالكامل على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-12)، في الفرع <i>part5-12</i>.


### مكوّنات styled-components

إضافة إلى ما رأيناه سابقاً، هناك [طرق أخرى](https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b) لتطبيق الأنماط على تطبيق React.

تقدّم مكتبة [styled-components](https://www.styled-components.com/)، التي تستفيد من صيغة [القوالب النصية الموسومة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (tagged template literal) في ES6، مقاربة مثيرة للاهتمام لتعريف الأنماط.

لنقم [بتثبيت](https://styled-components.com/docs/basics#installation) styled-components ونستخدمها لإجراء بعض التغييرات الأسلوبية على تطبيق تدوين الملاحظات (النسخة قبل تثبيت MaterialUI). أولاً، لننشئ تعريفَي نمط للمكوّنين اللذين سنستخدمهما:

```js
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
  width: 300px;  
`
```

تُنشئ الشيفرة نسخاً منسّقة من عنصرَي HTML هما <i>button</i> و<i>input</i>، وتُسنِدها إلى المتغيّرين <i>Button</i> و<i>Input</i>.

صيغة تعريف الأنماط مثيرة للاهتمام فعلاً، إذ توضع تعريفات CSS داخل علامات الاقتباس الخلفية (backticks). هذه هي صيغة [القوالب النصية الموسومة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) في ES6.

تعمل المكوّنات المعرّفة مثل عنصرَي <i>button</i> و<i>input</i> العاديين، وتُستخدم في التطبيق بالطريقة المعتادة:


```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <Input> // highlight-line
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          placeholder="write note content here"
        />
        <Button type="submit">save</Button> // highlight-line
      </form>
    </div>
  )
}
```

يبدو النموذج الآن كما يلي:

![](../../images/5/u20.webp)

لنعرّف المكوّنات التالية لإضافة الأنماط، وكلها نسخ محسّنة من عناصر <i>div</i>:

```js
const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`
```

يمكن الآن استخدام المكوّنات الجديدة في التطبيق:

```js
const App = () => {
  // ...

  return (
    <Page> // highlight-line
      <Navigation> // highlight-line
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </Navigation> // highlight-line

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportanceOf={toggleImportanceOf}
            deleteNote={deleteNote}
          />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>
// highlight-start
      <Footer>
         Note app, Department of Computer Science, University of Helsinki 2026
      </Footer>
    </Page>
    // highlight-end
  )
}
```

النتيجة النهائية كما يلي:

![](../../images/5/u21.webp)

اكتسبت styled-components شعبية متزايدة باطراد في الآونة الأخيرة، ويبدو حالياً أن كثيرين يعتبرونها أفضل طريقة لتعريف الأنماط لتطبيقات React.

</div>

<div class="tasks">

### تمارين 5.29–5.31

بعد ذلك، حسّن أنماط تطبيق المدوّنات باستخدام MaterialUI أو styled-components.

#### 5.29: مدوّنات منسّقة، الخطوة 1

أضف أنماطاً إلى نماذج التطبيق.

قد يبدو حلك شيئاً كهذا. نموذج تسجيل الدخول:

![](../../images/5/l10.webp)

إنشاء تدوينة جديدة:

![](../../images/5/l11.webp)

#### 5.30: مدوّنات منسّقة، الخطوة 2

نسّق الآن شريط تنقّل التطبيق والمكوّن الذي يعرض الإشعارات. قد تبدو النتيجة شيئاً كهذا:

![](../../images/5/l12.webp)

#### 5.31: مدوّنات منسّقة، الخطوة 3

خصّص مظهر مكوّن عرض التدوينة الواحدة كما تراه مناسباً. إليك مثالاً:

![](../../images/5/l14.webp)

كان هذا آخر تمرين في القسم، وحان وقت دفع الشيفرة إلى GitHub وتعليم التمارين المنجزة في [نظام تسليم التمارين](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
