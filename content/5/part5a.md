---
mainImage: /images/part-5.svg
part: 5
letter: a
lang: ar
---

<div class="content">

ركّزنا في الجزأين الماضيين بشكل أساسي على الواجهة الخلفية. الواجهة الأمامية التي طوّرناها في [الجزء 2](/part2) لا تدعم بعد إدارة المستخدمين التي نفّذناها في الواجهة الخلفية في الجزء 4.

في الوقت الحالي تعرض الواجهة الأمامية الملاحظات الموجودة وتتيح للمستخدمين تغيير حالة الملاحظة من مهمة إلى غير مهمة والعكس. ولم يعد بالإمكان إضافة ملاحظات جديدة بسبب التغييرات التي أُجريت على الواجهة الخلفية في الجزء 4: إذ تتوقع الواجهة الخلفية الآن إرسال رمز (token) يتحقق من هوية المستخدم مع الملاحظة الجديدة.

سننفّذ الآن جزءاً من وظائف إدارة المستخدمين المطلوبة في الواجهة الأمامية. لنبدأ بتسجيل دخول المستخدم. سنفترض طوال هذا الجزء أنه لن تتم إضافة مستخدمين جدد من الواجهة الأمامية.

### إضافة نموذج تسجيل دخول

أُضيف الآن نموذج تسجيل دخول إلى أعلى الصفحة:

![متصفح يعرض تسجيل دخول المستخدم لتطبيق الملاحظات](../../images/5/1new.webp)

أصبحت شيفرة مكوّن <i>App</i> الآن كما يلي:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // highlight-start
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-end

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // ...

// highlight-start
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }
  // highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      
      // highlight-start
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    // highlight-end

      // ...
    </div>
  )
}

export default App
```

يمكن العثور على شيفرة التطبيق الحالية على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-1)، في الفرع <i>part5-1</i>. إذا استنسخت المستودع، لا تنسَ تشغيل _npm install_ قبل محاولة تشغيل الواجهة الأمامية.

لن تعرض الواجهة الأمامية أي ملاحظات إذا لم تكن متصلة بالواجهة الخلفية. يمكنك تشغيل الواجهة الخلفية بالأمر _npm run dev_ في مجلدها من الجزء 4. سيشغّل هذا الواجهة الخلفية على المنفذ 3001. وبينما هي قيد التشغيل، يمكنك في نافذة طرفية منفصلة تشغيل الواجهة الأمامية بالأمر _npm run dev_، وحينها يمكنك رؤية الملاحظات المحفوظة في قاعدة بيانات MongoDB من الجزء 4.

ضع هذا في اعتبارك من الآن فصاعداً.

يُعالَج نموذج تسجيل الدخول بالطريقة نفسها التي عالجنا بها النماذج في
[الجزء 2](/part2/forms). تحتوي حالة التطبيق على حقلي <i>username</i> و<i>password</i> لتخزين بيانات النموذج. لحقول النموذج معالجات أحداث تزامن التغييرات في الحقل مع حالة مكوّن <i>App</i>. معالجات الأحداث بسيطة: يُمرَّر إليها كائن كوسيط، فتستخرج منه الحقل <i>target</i> وتحفظ قيمته في الحالة.

```js
({ target }) => setUsername(target.value)
```

لم تُنفَّذ بعد الدالة _handleLogin_ المسؤولة عن معالجة البيانات في النموذج.

### إضافة منطق إلى نموذج تسجيل الدخول

يتم تسجيل الدخول بإرسال طلب HTTP POST إلى عنوان الخادم <i>api/login</i>. لنفصل الشيفرة المسؤولة عن هذا الطلب في وحدتها الخاصة، في الملف <i>services/login.js</i>.

سنستخدم صيغة <i>async/await</i> بدلاً من الوعود (promises) في طلب HTTP:

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

يمكن تنفيذ دالة معالجة تسجيل الدخول كما يلي:

```js
import loginService from './services/login' // highlight-line

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-start
  const [user, setUser] = useState(null)
// highlight-end

  // ...

  const handleLogin = async event => { // highlight-line
    event.preventDefault()
    
    // highlight-start
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    // highlight-end
  }

  // ...
}
```

إذا نجح تسجيل الدخول، تُفرَّغ حقول النموذج <i>و</i>تُحفظ استجابة الخادم (بما فيها <i>الرمز</i> وتفاصيل المستخدم) في الحقل <i>user</i> من حالة التطبيق.

وإذا فشل تسجيل الدخول أو نتج عن تشغيل الدالة _loginService.login_ خطأ، يُخطَر المستخدم بذلك.

### العرض الشرطي لنموذج تسجيل الدخول

لا يُخطَر المستخدم بأي شكل من الأشكال عند نجاح تسجيل الدخول. لنعدّل التطبيق بحيث يعرض نموذج تسجيل الدخول فقط <i>إذا لم يكن المستخدم مسجّلاً للدخول</i>، أي عندما _user === null_. ويُعرض نموذج إضافة ملاحظات جديدة فقط إذا كان <i>المستخدم مسجّلاً للدخول</i>، أي عندما تحتوي حالة <i>user</i> على تفاصيل المستخدم.

لنضف دالتين مساعدتين إلى مكوّن <i>App</i> لتوليد النموذجين:

```js
const App = () => {
  // ...

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )

  return (
    // ...
  )
}
```

ونعرضهما شرطياً:

```js
const App = () => {
  // ...

  const loginForm = () => (
    // ...
  )

  const noteForm = () => (
    // ...
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()} // highlight-line
      {user && noteForm()} // highlight-line

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}
```

استُخدمت [حيلة React](https://react.dev/learn/conditional-rendering#logical-and-operator-) التي تبدو غريبة قليلاً لكنها شائعة الاستخدام لعرض النموذجين شرطياً:

```js
{!user && loginForm()}
```

إذا قُيّم التعبير الأول إلى false أو كان [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) (قيمة كاذبة)، فلن يُنفَّذ التعبير الثاني (توليد النموذج) إطلاقاً.

لنجرِ تعديلاً آخر. إذا كان المستخدم مسجّلاً للدخول، يُعرض اسمه على الشاشة:

```js
return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />

    {!user && loginForm()}
    // highlight-start
    {user && (
      <div>
        <p>{user.name} logged in</p>
        {noteForm()}
      </div>
    )}
    // highlight-end

    <div>
      <button onClick={() => setShowAll(!showAll)}>
    // ...
```

الحل ليس مثالياً، لكننا سنتركه على حاله الآن.

مكوّننا الرئيسي <i>App</i> كبير جداً في الوقت الحالي. والتغييرات التي أجريناها الآن إشارة واضحة إلى أنه ينبغي إعادة هيكلة النماذج إلى مكوّنات خاصة بها. لكننا سنترك ذلك لتمرين اختياري.

يمكن العثور على شيفرة التطبيق الحالية على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-2)، في الفرع <i>part5-2</i>.

### ملاحظة حول استخدام عنصر label

استخدمنا عنصر [label](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label) لحقول <i>input</i> في نموذج تسجيل الدخول. ويوضع حقل <i>input</i> الخاص باسم المستخدم داخل عنصر <i>label</i> المقابل:

```js
<div>
  <label>
    username
    <input
      type="text"
      value={username}
      onChange={({ target }) => setUsername(target.value)}
    />
  </label>
</div>
// ...
```

لماذا نفّذنا النموذج بهذه الطريقة؟ بصرياً، يمكن تحقيق النتيجة نفسها بشيفرة أبسط، دون عنصر <i>label</i> منفصل:

```js
<div>
  username
  <input
    type="text"
    value={username}
    onChange={({ target }) => setUsername(target.value)}
  />
</div>
// ...
```

يُستخدم عنصر <i>label</i> في النماذج لوصف حقول <i>input</i> وتسميتها. فهو يوفّر وصفاً لحقل الإدخال، ويساعد المستخدم على فهم المعلومات التي ينبغي إدخالها في كل حقل. ويرتبط هذا الوصف برمجياً بحقل الإدخال المقابل، ما يحسّن إمكانية الوصول في النموذج. 

بهذه الطريقة، يمكن لقارئات الشاشة قراءة اسم الحقل للمستخدم عند تحديد حقل الإدخال، كما يؤدي النقر على نص الـ label إلى تركيز المؤشر تلقائياً على حقل الإدخال الصحيح. ويُنصح دائماً باستخدام عنصر <i>label</i> مع حقول <i>input</i>، حتى لو أمكن تحقيق النتيجة البصرية نفسها بدونه.

هناك [طرق عدة](https://react.dev/reference/react-dom/components/input#providing-a-label-for-an-input) لربط <i>label</i> معيّن بعنصر <i>input</i>. أسهل طريقة هي وضع عنصر <i>input</i> داخل عنصر <i>label</i> المقابل، كما هو موضّح في هذه المادة. وهذا يربط <i>label</i> تلقائياً بحقل الإدخال الصحيح دون الحاجة إلى أي إعداد إضافي.

### إنشاء ملاحظات جديدة

يُحفظ الرمز المُعاد عند نجاح تسجيل الدخول في حالة التطبيق - في الحقل <i>token</i> الخاص بـ<i>user</i>:

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    setUser(user) // highlight-line
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```

لنصلح إنشاء ملاحظات جديدة ليعمل مع الواجهة الخلفية. يعني هذا إضافة رمز المستخدم المسجّل للدخول إلى ترويسة Authorization في طلب HTTP.

تتغير وحدة <i>noteService</i> كما يلي:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null // highlight-line

// highlight-start
const setToken = newToken => {
  token = `Bearer ${newToken}`
}
// highlight-end

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  // highlight-start
  const config = {
    headers: { Authorization: token }
  }
// highlight-end

  const response = await axios.post(baseUrl, newObject, config) // highlight-line
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken } // highlight-line
```

تحتوي وحدة noteService على متغير خاص باسم _token_. ويمكن تغيير قيمته بالدالة _setToken_ التي تصدّرها الوحدة. أما _create_، بصيغة async/await الآن، فتضع الرمز في ترويسة <i>Authorization</i>. وتُمرَّر الترويسة إلى axios كوسيط ثالث في دالة <i>post</i>.

يجب تغيير معالج الحدث المسؤول عن تسجيل الدخول ليستدعي الدالة <code>noteService.setToken(user.token)</code> عند نجاح تسجيل الدخول:

```js
const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({ username, password })
    noteService.setToken(user.token) // highlight-line
    setUser(user)
    setUsername('')
    setPassword('')
  } catch {
    // ...
  }
}
```

والآن أصبحت إضافة ملاحظات جديدة تعمل من جديد!

### حفظ الرمز في التخزين المحلي للمتصفح

في تطبيقنا عيب صغير: إذا حُدِّث المتصفح (مثلاً بالضغط على F5)، تختفي معلومات تسجيل دخول المستخدم.

تُحل هذه المشكلة بسهولة بحفظ تفاصيل تسجيل الدخول في [التخزين المحلي](https://developer.mozilla.org/en-US/docs/Web/API/Storage). التخزين المحلي قاعدة بيانات [مفتاح-قيمة](https://en.wikipedia.org/wiki/Key-value_database) في المتصفح.

استخدامه سهل جداً. تُحفظ <i>قيمة</i> تقابل <i>مفتاحاً</i> معيناً في قاعدة البيانات بالدالة [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). مثلاً:

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

يحفظ النص المُمرَّر كوسيط ثانٍ كقيمة للمفتاح <i>name</i>.

ويمكن إيجاد قيمة مفتاح بالدالة [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):

```js
window.localStorage.getItem('name')
```

بينما تحذف [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) مفتاحاً.

تبقى القيم في التخزين المحلي محفوظة حتى عند إعادة عرض الصفحة. والتخزين خاص بـ[الأصل (origin)](https://developer.mozilla.org/en-US/docs/Glossary/Origin) لذا لكل تطبيق ويب تخزينه الخاص.

لنوسّع تطبيقنا بحيث يحفظ تفاصيل المستخدم المسجّل للدخول في التخزين المحلي.

القيم المحفوظة في التخزين هي [DOMstrings](https://docs.w3cub.com/dom/domstring)، لذا لا يمكننا حفظ كائن JavaScript كما هو. يجب أولاً تحويل الكائن إلى JSON بالدالة _JSON.stringify_. وبالمقابل، عند قراءة كائن JSON من التخزين المحلي، يجب تحويله مرة أخرى إلى JavaScript بالدالة _JSON.parse_.

التغييرات على دالة تسجيل الدخول كما يلي:

```js
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      // highlight-start
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      // highlight-end
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // ...
    }
  }
```

تُحفظ الآن تفاصيل المستخدم المسجّل للدخول في التخزين المحلي، ويمكن عرضها في وحدة التحكم (بكتابة _window.localStorage_ فيها):

![متصفح يعرض بيانات المستخدم في وحدة التحكم المحفوظة في التخزين المحلي](../../images/5/3e.webp)

يمكنك أيضاً فحص التخزين المحلي باستخدام أدوات المطور. في Chrome، انتقل إلى تبويب <i>Application</i> واختر <i>Local Storage</i> (تفاصيل أكثر [هنا](https://developer.chrome.com/docs/devtools/storage/localstorage)). وفي Firefox انتقل إلى تبويب <i>Storage</i> واختر <i>Local Storage</i> (التفاصيل [هنا](https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html)).

ما زال علينا تعديل تطبيقنا بحيث يتحقق عند دخول الصفحة مما إذا كانت تفاصيل مستخدم مسجّل للدخول موجودة بالفعل في التخزين المحلي. وإذا كانت موجودة، تُحفظ التفاصيل في حالة التطبيق وفي <i>noteService</i>.

الطريقة الصحيحة لفعل ذلك هي باستخدام [خطاف تأثير (effect hook)](https://react.dev/reference/react/useEffect): وهي آلية صادفناها أول مرة في [الجزء 2](/part2/getting_data_from_server#effect-hooks)، واستخدمناها لجلب الملاحظات من الخادم.

يمكن أن يكون لدينا عدة خطافات تأثير، لذا لننشئ خطافاً ثانياً للتعامل مع التحميل الأول للصفحة:

```js
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  
  // highlight-start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // highlight-end

  // ...
}
```

تضمن المصفوفة الفارغة كوسيط للخطاف أن يُنفَّذ الخطاف فقط عند عرض المكوّن [للمرة الأولى](https://react.dev/reference/react/useEffect#parameters).

الآن يبقى المستخدم مسجّلاً للدخول إلى التطبيق إلى الأبد. ربما ينبغي لنا إضافة وظيفة <i>تسجيل الخروج</i> التي تزيل تفاصيل تسجيل الدخول من التخزين المحلي. لكننا سنتركها كتمرين.

يمكن تسجيل خروج المستخدم باستخدام وحدة التحكم، وهذا يكفي الآن.
يمكنك تسجيل الخروج بالأمر:

```js
window.localStorage.removeItem('loggedNoteappUser')
```

أو بالأمر الذي يفرّغ <i>localstorage</i> بالكامل:

```js
window.localStorage.clear()
```

يمكن العثور على شيفرة التطبيق الحالية على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-3)، في الفرع <i>part5-3</i>.

</div>

<div class="tasks">

### تمارين 5.1.-5.4.

سننشئ الآن واجهة أمامية للواجهة الخلفية لقائمة المدونات التي أنشأناها في الجزء الماضي. يمكنك استخدام [هذا التطبيق](https://github.com/fullstack-hy2020/bloglist-frontend) من GitHub كأساس لحلك. وتحتاج إلى ربط واجهتك الخلفية بوسيط (proxy) كما هو موضّح في [الجزء 3](/part3/deploying_app_to_internet#proxy).

يكفي إرسال حلك النهائي. يمكنك عمل commit بعد كل تمرين، لكن ذلك ليس ضرورياً.

تُراجع التمارين الأولى كل ما تعلمناه عن React حتى الآن. وقد تكون صعبة، خاصة إذا كانت واجهتك الخلفية غير مكتملة.
وقد يكون من الأفضل استخدام الواجهة الخلفية التي وضعناها كحل للجزء 4.

أثناء حل التمارين، تذكّر كل طرق تصحيح الأخطاء التي تحدثنا عنها، وخاصة مراقبة وحدة التحكم.

**تحذير:** إذا لاحظت أنك تخلط بين أوامر _async/await_ و_then_، فمن المؤكد بنسبة 99.9% أنك تفعل شيئاً خاطئاً. استخدم أحدهما فقط، ولا تستخدم كليهما أبداً.

#### 5.1: واجهة قائمة المدونات الأمامية، الخطوة 1

استنسخ التطبيق من [GitHub](https://github.com/fullstack-hy2020/bloglist-frontend) بالأمر:

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

<i>أزل إعدادات git من التطبيق المستنسخ</i>

```bash
cd bloglist-frontend   // انتقل إلى المستودع المستنسخ
rm -rf .git
```

يُشغَّل التطبيق بالطريقة المعتادة، لكن عليك تثبيت اعتمادياته أولاً:

```bash
npm install
npm run dev
```

نفّذ وظيفة تسجيل الدخول في الواجهة الأمامية. يُحفظ الرمز المُعاد عند نجاح تسجيل الدخول في حالة التطبيق <i>user</i>.

إذا لم يكن المستخدم مسجّلاً للدخول، فلا يظهر <i>سوى</i> نموذج تسجيل الدخول.

![متصفح يعرض نموذج تسجيل الدخول فقط](../../images/5/4e.webp)

وإذا كان المستخدم مسجّلاً للدخول، يُعرض اسم المستخدم وقائمة المدونات.

![متصفح يعرض المدونات ومن هو مسجّل للدخول](../../images/5/5e.webp)

لا حاجة بعد إلى حفظ تفاصيل المستخدم المسجّل للدخول في التخزين المحلي.

**ملاحظة** يمكنك تنفيذ العرض الشرطي لنموذج تسجيل الدخول هكذا مثلاً:

```js
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form>
          //...
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}
```

#### 5.2: واجهة قائمة المدونات الأمامية، الخطوة 2

اجعل تسجيل الدخول «دائماً» باستخدام التخزين المحلي. ونفّذ أيضاً طريقة لتسجيل الخروج.

![متصفح يعرض زر تسجيل الخروج بعد تسجيل الدخول](../../images/5/6e.webp)

تأكد من أن المتصفح لا يتذكر تفاصيل المستخدم بعد تسجيل الخروج.

#### 5.3: واجهة قائمة المدونات الأمامية، الخطوة 3

وسّع تطبيقك ليتمكن المستخدم المسجّل للدخول من إضافة مدونات جديدة:

![متصفح يعرض نموذج مدونة جديدة](../../images/5/7e.webp)

#### 5.4: واجهة قائمة المدونات الأمامية، الخطوة 4

نفّذ إشعارات تُخبر المستخدم بالعمليات الناجحة وغير الناجحة في أعلى الصفحة. مثلاً، عند إضافة مدونة جديدة يمكن عرض الإشعار التالي:

![متصفح يعرض إشعار عملية ناجحة](../../images/5/8e.webp)

ويمكن أن يعرض تسجيل الدخول الفاشل الإشعار التالي:

![متصفح يعرض إشعار محاولة تسجيل دخول فاشلة](../../images/5/9e.webp)

يجب أن تبقى الإشعارات ظاهرة لثوانٍ قليلة. وليس إلزامياً إضافة ألوان.

</div>

<div class="content">

### ملاحظة حول استخدام التخزين المحلي

في [نهاية](/part4/token_authentication#problems-of-token-based-authentication) الجزء الماضي، ذكرنا أن التحدي في المصادقة القائمة على الرموز هو كيفية التعامل مع الحالة التي يلزم فيها إلغاء وصول حامل الرمز إلى الـ API.

هناك حلان لهذه المشكلة. الأول هو تحديد مدة صلاحية الرمز. وهذا يجبر المستخدم على إعادة تسجيل الدخول إلى التطبيق بعد انتهاء صلاحية الرمز. والنهج الآخر هو حفظ معلومات صلاحية كل رمز في قاعدة بيانات الواجهة الخلفية. ويُسمى هذا الحل غالباً <i>جلسة من جهة الخادم</i> (server-side session).

ومهما كانت طريقة التحقق من صلاحية الرموز وضمانها، فقد ينطوي حفظ الرمز في التخزين المحلي على خطر أمني إذا كان في التطبيق ثغرة أمنية تسمح بهجمات [البرمجة عبر المواقع (XSS)](https://owasp.org/www-community/attacks/xss/). وتكون هجمة XSS ممكنة إذا سمح التطبيق للمستخدم بحقن شيفرة JavaScript عشوائية (مثلاً باستخدام نموذج) ينفّذها التطبيق بعد ذلك. وعند استخدام React بحكمة لا ينبغي أن يكون ذلك ممكناً لأن [React ينقّي](https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks) كل النص الذي يعرضه، أي أنه لا ينفّذ المحتوى المعروض كشيفرة JavaScript.

وإذا أراد المرء أن يلعب بأمان، فأفضل خيار هو عدم تخزين الرمز في التخزين المحلي. وقد يكون هذا خياراً في الحالات التي قد يكون فيها تسريب الرمز ذا عواقب كارثية.

وقد اقتُرح حفظ هوية المستخدم المسجّل للدخول في [ملفات تعريف ارتباط httpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)، بحيث لا تستطيع شيفرة JavaScript الوصول إلى الرمز إطلاقاً. وعيب هذا الحل أنه يجعل تنفيذ تطبيقات الصفحة الواحدة (SPA) أكثر تعقيداً بعض الشيء. إذ سيحتاج المرء على الأقل إلى تنفيذ صفحة منفصلة لتسجيل الدخول.

لكن من الجيد ملاحظة أن حتى استخدام ملفات تعريف ارتباط httpOnly لا يضمن أي شيء. بل اقتُرح أن ملفات تعريف ارتباط httpOnly [ليست أكثر أماناً](https://academind.com/tutorials/localstorage-vs-cookies-xss/) من استخدام التخزين المحلي.

لذا، ومهما كان الحل المستخدم، فإن أهم شيء هو [تقليل خطر](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) هجمات XSS إلى الحد الأدنى.

</div>
