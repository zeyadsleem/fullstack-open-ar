---
part: 7
letter: d
title: "مواضيع متنوعة"
mainImage: /images/part-7.svg
lang: ar
---
### مكوّنات الصف

خلال المقرر، استخدمنا فقط مكوّنات React المعرَّفة كدوال JavaScript. لم يكن ذلك ممكناً بدون وظيفة <a href="https://reactjs.org/docs/hooks-intro.html" target="_blank" rel="noopener">الخطافات (hooks)</a> التي جاءت مع الإصدار 16.8 من React، والذي صدر في 6 فبراير 2019. قبل ذلك، عند تعريف مكوّن يستخدم الحالة، كان على المرء تعريفه باستخدام صيغة <a href="https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class" target="_blank" rel="noopener">الصف (Class)</a> في JavaScript.

من المفيد أن تكون على دراية بمكوّنات الصف (Class Components) ولو إلى حد ما، لأن العالم لا يزال يحتوي على الكثير من شيفرة React القديمة، التي لن تُعاد كتابتها بالكامل على الأرجح باستخدام الصيغة المحدَّثة.

لنتعرّف على الميزات الرئيسية لمكوّنات الصف من خلال إنتاج تطبيق الطرائف المألوف جداً مرة أخرى. نخزّن الطرائف في الملف&nbsp;<em>db.json</em>&nbsp;باستخدام&nbsp;<em>json-server</em>. محتوى الملف مأخوذ من&nbsp;<a href="https://github.com/fullstack-hy/misc/blob/master/anecdotes.json" target="_blank" rel="noopener">هنا</a>.

النسخة الأولية من مكوّن الصف تبدو هكذا

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
      &lt;/div&gt;
    )
  }
}

export default App
```

أصبح للمكوّن الآن <a href="https://react.dev/reference/react/Component#constructor" target="_blank" rel="noopener">مُنشئ (constructor)</a>، لا يحدث فيه شيء في الوقت الحالي، ويحتوي على الدالة&nbsp;<a href="https://react.dev/reference/react/Component#render" target="_blank" rel="noopener">render</a>. وكما قد يتوقّع المرء، يحدّد render كيف وماذا يُعرض على الشاشة.

لنعرّف حالة لقائمة الطرائف والطريفة المعروضة حالياً. وعلى عكس استخدام خطاف&nbsp;<a href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">useState</a>&nbsp;، تحتوي مكوّنات الصف على حالة واحدة فقط. فإذا كانت الحالة مكوّنة من عدة «أجزاء»، فينبغي تخزينها كخصائص للحالة. تُهيَّأ الحالة في المُنشئ:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // BEGIN HIGHLIGHT
    this.state = {
      anecdotes: [],
      current: 0
    }
    // END HIGHLIGHT
  }

  render() {
  // BEGIN HIGHLIGHT
    if (this.state.anecdotes.length === 0) {
      return &lt;div&gt;no anecdotes...&lt;/div&gt;
    }
  // END HIGHLIGHT

    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
        // BEGIN HIGHLIGHT
        &lt;div&gt;
          {this.state.anecdotes[this.state.current].content}
        &lt;/div&gt;
        &lt;button&gt;next&lt;/button&gt;
        // END HIGHLIGHT
      &lt;/div&gt;
    )
  }
}
```

حالة المكوّن موجودة في متغير النسخة <em>this.state</em>. الحالة كائن له خاصيتان. <em>this.state.anecdotes</em> هي قائمة الطرائف و<em>this.state.current</em> هو فهرس الطريفة المعروضة حالياً.

> قد تتساءل عمّا تشير إليه <em>this</em> في الشيفرة. في JavaScript، تعتمد قيمة <em>this</em> على كيفية استدعاء الدالة. وداخل دالة صف كهذه، تشير إلى نسخة المكوّن، ما يتيح الوصول إلى حالة النسخة ودوالها. اقرأ المزيد <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this">هنا</a>.

في المكوّنات الدالية، المكان الصحيح لجلب البيانات من الخادم هو داخل&nbsp;<a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">خطاف التأثير (effect hook)</a>، الذي يُنفَّذ عند عرض المكوّن أو بوتيرة أقل عند الحاجة، مثلاً فقط مع العرض الأول.

تقدّم <a href="https://react.dev/reference/react/Component#adding-lifecycle-methods-to-a-class-component" target="_blank" rel="noopener">دوال دورة الحياة (lifecycle methods)</a>&nbsp;في مكوّنات الصف وظيفة مماثلة. والمكان الصحيح لبدء جلب البيانات من الخادم هو داخل دالة دورة الحياة&nbsp;<a href="https://react.dev/reference/react/Component#componentdidmount" target="_blank" rel="noopener">componentDidMount</a>، التي تُنفَّذ مرة واحدة مباشرة بعد أول عرض للمكوّن:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // BEGIN HIGHLIGHT
  componentDidMount = () =&gt; {
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      this.setState({ anecdotes: response.data })
    })
  }
  // END HIGHLIGHT

  // ...
}
```

تحدّث الدالة الرديفة لطلب HTTP حالة المكوّن باستخدام الدالة&nbsp;<a href="https://react.dev/reference/react/Component#setstate" target="_blank" rel="noopener">setState</a>. ولا تلمس الدالة إلا المفاتيح المعرَّفة في الكائن الممرَّر إليها كمعامل. وتبقى قيمة المفتاح&nbsp;<em>current</em>&nbsp;دون تغيير.

استدعاء الدالة setState يؤدي دائماً إلى إعادة عرض مكوّن الصف، أي استدعاء الدالة&nbsp;<em>render</em>.

سننهي المكوّن بإمكانية تغيير الطريفة المعروضة. فيما يلي شيفرة المكوّن بأكمله مع تمييز الإضافة:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () =&gt; {
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      this.setState({ anecdotes: response.data })
    })
  }

  // BEGIN HIGHLIGHT
  handleClick = () =&gt; {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // END HIGHLIGHT

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return &lt;div&gt;no anecdotes...&lt;/div&gt;
    }

    return (
      &lt;div&gt;
        &lt;h1&gt;anecdote of the day&lt;/h1&gt;
        &lt;div&gt;{this.state.anecdotes[this.state.current].content}&lt;/div&gt;
        // BEGIN HIGHLIGHT
        &lt;button onClick={this.handleClick}&gt;next&lt;/button&gt;
        // END HIGHLIGHT
      &lt;/div&gt;
    )
  }
}
```

للمقارنة، إليك التطبيق نفسه كمكوّن دالي:

```js
const App = () =&gt; {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =&gt;{
    axios.get('http://localhost:3001/anecdotes').then(response =&gt; {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () =&gt; {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return &lt;div&gt;no anecdotes...&lt;/div&gt;
  }

  return (
    &lt;div&gt;
      &lt;h1&gt;anecdote of the day&lt;/h1&gt;
      &lt;div&gt;{anecdotes[current].content}&lt;/div&gt;
      &lt;button onClick={handleClick}&gt;next&lt;/button&gt;
    &lt;/div&gt;
  )
}
```

في حالة مثالنا، كانت الاختلافات طفيفة. وأكبر فرق بين المكوّنات الدالية ومكوّنات الصف هو أساساً أن حالة مكوّن الصف كائن واحد، وأن الحالة تُحدَّث باستخدام الدالة&nbsp;<em>setState</em>، بينما في المكوّنات الدالية يمكن أن تتكوّن الحالة من عدة متغيرات مختلفة، ولكل منها دالة تحديث خاصة بها.

في عام 2026، أصبحت مكوّنات الصف إلى حد كبير أثراً تاريخياً. فكل تطوير React الحديث يستخدم المكوّنات الدالية مع الخطافات، ولا يوجد سبب عقلاني للجوء إلى مكوّن صف عند كتابة شيفرة جديدة. وحتى توثيق React نفسه يتعامل مع مكوّنات الصف كواجهة برمجية قديمة.

### حدّ الأخطاء

رغم أن مكوّنات الصف أصبحت شبه مهجورة، هناك حالة واحدة لا يزال لا يمكنك تجنّبها فيها:&nbsp;<a href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary" target="_blank" rel="noopener">حدود الأخطاء (error boundaries)</a>. حدّ الأخطاء مكوّن يلتقط أخطاء JavaScript في أي مكان في شجرة مكوّناته الفرعية ويعرض واجهة بديلة بدلاً من انهيار التطبيق بأكمله. وحتى عام 2026، لم يقدّم React بعد بديلاً قائماً على الخطافات لهذا، لذا لا تزال حدود الأخطاء تُنفَّذ كمكوّنات صف.

يبدو حدّ الأخطاء هكذا:

```js
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        &lt;div&gt;
          &lt;h2&gt;Something went wrong.&lt;/h2&gt;
          &lt;p&gt;{this.state.error.message}&lt;/p&gt;
          &lt;button onClick={() =&gt; this.setState({ hasError: false, error: null })}&gt;
            try again
          &lt;/button&gt;
        &lt;/div&gt;
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

دالتا دورة الحياة الأساسيتان هما&nbsp;<em>getDerivedStateFromError</em>، التي تحدّث الحالة كي يعرض العرض التالي الواجهة البديلة، و<em>componentDidCatch</em>، وهي مكان جيد لتسجيل الخطأ لدى خدمة الإبلاغ عن الأخطاء.

يمكنك لفّ أي جزء من شجرة مكوّناتك بحدّ أخطاء لحصر الأعطال في تلك الشجرة الفرعية:

```js
const App = () =&gt; {
  return (
    &lt;div&gt;
      &lt;ErrorBoundary&gt;
        &lt;Notes /&gt;
      &lt;/ErrorBoundary&gt;
      &lt;ErrorBoundary&gt;
        &lt;Persons /&gt;
      &lt;/ErrorBoundary&gt;
    &lt;/div&gt;
  )
}
```

إذا أطلقت <em>Notes</em>&nbsp;خطأً، يُعرض البديل في ذلك القسم فقط. وتستمر <em>Persons</em>&nbsp;في العمل بشكل طبيعي.

ولأن هذه هي حالة الاستخدام الوحيدة المتبقية لمكوّنات الصف، تستخدم مشاريع كثيرة مكتبة&nbsp;<a href="https://github.com/bvaughn/react-error-boundary" target="_blank" rel="noopener">react-error-boundary</a>&nbsp;التي تغلّف الآلية القائمة على الصفوف خلف واجهة برمجية مريحة لمكوّن دالي، فلا تضطر أبداً إلى كتابة مكوّن صف بنفسك.

### الواجهة الأمامية والواجهة الخلفية في المستودع نفسه

خلال المقرر، أنشأنا الواجهة الأمامية والواجهة الخلفية كمستودعين منفصلين. غير أننا أجرينا النشر <a href="/part3/deploying_app_to_internet#serving-static-files-from-the-backend" target="_blank" rel="noopener">بنسخ</a> شيفرة الواجهة الأمامية المجمَّعة إلى مستودع الواجهة الخلفية. وكان من الممكن أن يكون النهج الأفضل هو نشر شيفرة الواجهة الأمامية بشكل منفصل.

في كثير من الأحيان يُوضع التطبيق بأكمله في مستودع واحد. ومن الطرق الشائعة والنظيفة لفعل ذلك باستخدام مجموعة تقنيات حديثة إبقاء واجهة Vite الأمامية في مجلد <em>client</em> والواجهة الخلفية Express في مجلد <em>server</em>، ولكل منهما <em>package.json</em> خاص به. ويحصل جذر المستودع على <em>package.json</em> ثالث يعمل كغلاف مريح فيه سكربتات لتشغيل الاثنين معاً.

التخطيط الأدنى لمثل هذا&nbsp;<a href="https://github.com/fullstack-hy2020/monorepo" target="_blank" rel="noopener">المستودع</a>&nbsp;يبدو هكذا:

```
app/
  package.json        (root, scripts only)
  client/
    package.json      (Vite + React)
    vite.config.js
    src/
      App.jsx
  server/
    package.json      (Express)
    index.js
```

خادم Express في <em>server/index.js</em>&nbsp;يقدّم الـ API، وفي الإنتاج يقدّم أيضاً الواجهة الأمامية المبنية من مجلد <em>client/dist</em>:

```js
const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

app.get('/api/ping', (req, res) =&gt; {
  res.json({ message: 'pong', time: new Date().toISOString() })
})

// تقديم الواجهة الأمامية المبنية بـ Vite في الإنتاج
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) =&gt; {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () =&gt; console.log(`server running on port ${PORT}`))
```

> ماذا عن /*splat
>
> كتابة <em>app.get('/*splat', handler)</em> تُنشئ مساراً شاملاً يطابق أي مسار (مثل <em>/</em>، و<em>/about</em>، و<em>/foo/bar</em>).
>
> يهم هذا المسار تطبيق React يستخدم موجّهاً (مثل React Router): فعندما يعيد المستخدم تحميل صفحة أو يفتح رابطاً مثل <em>/notes</em> أو <em>/notes/5</em> مباشرةً، يذهب ذلك الطلب إلى الخادم أولاً وليس إلى React. وبدون هذا المسار الشامل، سيعيد Express استجابة 404 لعدم وجود مسار كهذا. وبإرسال <em>index.html</em> لكل مسار غير مطابق بدلاً من ذلك، يُحمَّل React ويتولّى موجّهه الأمر، فيعرض الصفحة الصحيحة من جهة العميل.

أثناء التطوير، يعمل خادم Vite التطويري على منفذه الخاص ويحتاج إلى تمرير طلبات الـ API إلى Express. ويُضبط ذلك في <em>client/vite.config.js</em>:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

مع وجود الوسيط (proxy)، يُمرَّر أي جلب من الواجهة الأمامية إلى <em>/api/ping</em>&nbsp;تلقائياً إلى خادم Express أثناء التطوير، فلا تضطر أبداً إلى ترميز عنوان الواجهة الخلفية بشكل ثابت.

يربط ملف <em>package.json</em>&nbsp;الجذري كل شيء معاً بسكربتين:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

هناك بضعة أمور مثيرة للاهتمام هنا.

يستخدم سكربت <em>dev</em>&nbsp;<a href="https://github.com/open-cli-tools/concurrently" target="_blank" rel="noopener">concurrently</a>، وهي أداة مساعدة صغيرة تشغّل عدة أوامر في الوقت نفسه وتدمج مخرجاتها في تدفق واحد في الطرفية. وبدونها سيكون عليك فتح طرفيتين منفصلتين، واحدة للواجهة الخلفية وواحدة للواجهة الأمامية.

تخبر راية <em>--prefix</em>&nbsp;npm أي مجلد فرعي يجب اعتباره مجلد العمل لذلك الأمر، لذا فإن <em>npm run dev --prefix server</em>&nbsp;مكافئ لـ <em>cd server &amp;&amp; npm run dev</em>.

تشغيل <em>npm run dev</em>&nbsp;من الجذر يبدأ بالتالي كلاً من خادم Vite التطويري وExpress بالتوازي بأمر واحد. وفي هذا النمط، تقدّم Vite الواجهة الأمامية مع استبدال الوحدات الساخن: فعند تعديل مكوّن React، يتحدّث المتصفح فوراً دون إعادة تحميل كاملة للصفحة. ويعمل خادم Express بشكل منفصل، ويحوّل وسيط Vite طلبات <em>/api</em>&nbsp;إليه.

تشغيل <em>npm run build</em>&nbsp;يجمّع الواجهة الأمامية في مجلد <em>client/dist</em>. وبعد ذلك، يضبط <em>npm start</em>&nbsp;القيمة <em>NODE_ENV=production</em>&nbsp;ويبدأ Express، الذي يلتقط الملفات الثابتة من <em>client/dist</em>&nbsp;ويقدّم الـ API والواجهة الأمامية معاً من منفذ واحد. هذا هو الإعداد الذي ستستخدمه عند النشر على خادم.

ولأن لكل جزء من المشروع ملف <em>package.json</em>&nbsp;خاصاً به، عليك أن تكون صريحاً بشأن أيها تستهدف عند تثبيت حزم جديدة. وتعمل الراية <em>--prefix</em>&nbsp;نفسها مع <em>npm install</em>&nbsp;أيضاً:

```bash
npm install axios --prefix client     # إضافة إلى الواجهة الأمامية
npm install mongoose --prefix server  # إضافة إلى الواجهة الخلفية
```

بدلاً من ذلك، يمكنك ببساطة تنفيذ <em>cd</em>&nbsp;إلى المجلد وتشغيل <em>npm install</em>&nbsp;من هناك كما تفعل عادةً.

### تنظيم الشيفرة في تطبيق React

في معظم التطبيقات خلال هذا المقرر، اتّبعنا اصطلاح وضع المكوّنات في مجلد <em>components</em>، والخطافات في <em>hooks</em>، وشيفرة التواصل مع الخادم في <em>services</em>. وبالنسبة لتطبيق BlogList قد يبدو ذلك هكذا:

```
src/
  App.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

هذا التجميع المسطّح القائم على النوع يعمل جيداً مع التطبيقات الصغيرة.

وعندما يستخدم التطبيق التوجيه، من الشائع إضافة مجلد <em>pages</em>&nbsp;(يُسمى أحياناً <em>views</em>) لمكوّنات المسارات العلوية، مع إبقاء مكوّنات واجهة المستخدم القابلة لإعادة الاستخدام في <em>components</em>. ويُستخدم هذا الاصطلاح في أطر مثل&nbsp;<a href="https://nextjs.org/docs/pages/building-your-application/routing" target="_blank" rel="noopener">Next.js</a>&nbsp;وهو موصوف في&nbsp;<a href="https://legacy.reactjs.org/docs/faq-structure.html" target="_blank" rel="noopener">الأسئلة الشائعة في React حول بنية الملفات</a>:

```
src/
  App.jsx
  pages/
    HomePage.jsx
    BlogPage.jsx
    UserPage.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

مع نمو قاعدة الشيفرة أكثر، قد يظل التغيير في ميزة واحدة يلامس ملفات موزّعة في كل مجلد، وقد يصبح التنقّل في كلٍّ من <em>components</em>&nbsp;و<em>pages</em>&nbsp;صعباً.

ومن الاستجابات الشائعة لذلك تجميع الملفات حسب <em>الميزة</em>&nbsp;بدلاً من ذلك. وتُقعّد منهجية&nbsp;<a href="https://feature-sliced.design/" target="_blank" rel="noopener">Feature-Sliced Design</a>&nbsp;هذا النهج، ومشروع&nbsp;<a href="https://github.com/alan2207/bulletproof-react" target="_blank" rel="noopener">bulletproof-react</a>&nbsp;مثال مرجعي على نطاق واسع لتطبيقه عملياً:

```
src/
  App.jsx
  features/
    blogs/
      Blog.jsx
      BlogList.jsx
      blogService.js
      blogStore.js
    users/
      UserList.jsx
      userService.js
    notifications/
      Notification.jsx
      notificationStore.js
  hooks/
    useField.js
```

كل ما يتعلق بالمدونات يعيش معاً، لذا فإن إضافة ميزة أو تغييرها يعني العمل في مكان واحد بدلاً من عدة أماكن. ولا توجد طريقة صحيحة وحيدة لتنظيم مشروع أكبر، ويعتمد الخيار الصحيح على حجم التطبيق وطبيعته.

### التغييرات على الخادم

التطبيقات التي نبنيها خلال هذا المقرر تجلب البيانات من الخادم عند تحميل الصفحة وبعد إجراءات المستخدم، لكنها لا تملك أي وسيلة لمعرفة التغييرات التي يجريها مستخدمون آخرون. فإذا أضاف مستخدم زميل تدوينة جديدة، فإن واجهتنا الأمامية ببساطة لا تعلم بذلك حتى تُحدَّث الصفحة. فكيف يمكننا إبقاء واجهة المستخدم متزامنة مع خادم يتغير باستقلالية؟

أبسط نهج هو&nbsp;<a href="https://en.wikipedia.org/wiki/Polling_(computer_science)" target="_blank" rel="noopener">الاستقصاء الدوري (polling)</a>: تسأل الواجهة الأمامية الخادم مراراً وتكراراً عن بيانات حديثة بفاصل زمني ثابت، مثلاً باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval" target="_blank" rel="noopener">setInterval</a>. والاستقصاء الدوري سهل التنفيذ لكنه مضيِّع، لأن معظم الطلبات لا تعيد شيئاً جديداً.

البديل الأنظف هو&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener">WebSockets</a>، التي تفتح اتصالاً ثنائي الاتجاه دائم بين المتصفح والخادم. ويمكن للخادم حينئذٍ دفع التحديثات إلى العملاء المتصلين لحظة حدوث تغيير، دون أن يضطر العميل إلى السؤال. وقد صارت WebSockets مدعومة الآن في جميع المتصفحات الحديثة.

قد يكون العمل مباشرة مع WebSocket API مرهقاً. وتغلّفه مكتبة&nbsp;<a href="https://socket.io/" target="_blank" rel="noopener">Socket.io</a>&nbsp;بواجهة برمجية أعلى مستوى وتضيف إعادة الاتصال التلقائي ووسائل راحة أخرى.

في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql" target="_blank" rel="noopener">الجزء 8</a> ننظر في GraphQL، الذي يتضمن آلية اشتراكات (subscriptions) تتيح للخادم إعلام العملاء بتغييرات البيانات بطريقة منظمة.

### أمن تطبيقات React/node

حتى الآن خلال المقرر، لم نتطرق كثيراً إلى أمن المعلومات. وليس لدينا وقت كبير لذلك الآن أيضاً، لكن لحسن الحظ، لدى جامعة هلسنكي مقرر مفتوح عبر الإنترنت بعنوان <a href="https://cybersecuritybase.mooc.fi/module-2.1" target="_blank" rel="noopener">تأمين البرمجيات (Securing Software)</a> لهذا الموضوع المهم.

مع ذلك، سنلقي نظرة على بعض الأمور الخاصة بهذا المقرر.

ينشر مشروع أمن تطبيقات الويب المفتوحة، المعروف اختصاراً بـ&nbsp;<a href="https://www.owasp.org/" target="_blank" rel="noopener">OWASP</a>، قائمة سنوية بأكثر مخاطر الأمن شيوعاً في تطبيقات الويب. ويمكن العثور على أحدث قائمة&nbsp;<a href="https://owasp.org/Top10/" target="_blank" rel="noopener">هنا</a>. وتظهر المخاطر نفسها من سنة إلى أخرى.

في صدارة القائمة نجد&nbsp;<em>الحقن (injection)</em>، ويعني أن نصاً مثلاً يُرسَل باستخدام نموذج في تطبيق يُفسَّر بشكل مختلف تماماً عمّا قصده مطوّر البرمجيات. وأشهر أنواع الحقن هو على الأرجح&nbsp;<a href="https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work" target="_blank" rel="noopener">حقن SQL</a>.

على سبيل المثال، تخيّل أن استعلام SQL التالي يُنفَّذ في تطبيق قابل للاستغلال:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

الآن لنفترض أن مستخدماً خبيثاً اسمه&nbsp;<em>Arto Hellas</em>&nbsp;عرّف اسمه على النحو التالي

```
Arto Hell-as'; DROP TABLE Users; --
```

بحيث يحتوي الاسم على علامة اقتباس مفردة&nbsp;<code>'</code>، وهي حرف البداية والنهاية لنص SQL. ونتيجة لذلك، ستُنفَّذ عمليتا SQL، والثانية منهما ستدمّر جدول قاعدة البيانات <em>Users</em>:

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```

يُمنع حقن SQL باستخدام&nbsp;<a href="https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f" target="_blank" rel="noopener">الاستعلامات المُعاملة (parameterized queries)</a>. فمعها لا يُخلط إدخال المستخدم مع استعلام SQL، بل تُدرج قاعدة البيانات نفسها قيم الإدخال عند العناصر النائبة في الاستعلام (عادةً&nbsp;<code>?</code>):

```
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

هجمات الحقن ممكنة أيضاً في قواعد بيانات NoSQL. غير أن Mongoose يمنعها عبر <a href="https://zanon.io/posts/nosql-injection-in-mongodb" target="_blank" rel="noopener">تنقية</a> الاستعلامات. ويمكن العثور على المزيد حول الموضوع مثلاً <a href="https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html" target="_blank" rel="noopener">هنا</a>.

<em>البرمجة عبر المواقع (Cross-site scripting - XSS)</em>&nbsp;هجوم يمكن فيه حقن شيفرة JavaScript خبيثة في تطبيق ويب شرعي. ثم تُنفَّذ الشيفرة الخبيثة في متصفح الضحية. وإذا حاولنا حقن ما يلي مثلاً في تطبيق الملاحظات:

```
&lt;script&gt;
  alert('Evil XSS attack')
&lt;/script&gt;
```

لا تُنفَّذ الشيفرة، بل تُعرض فقط كنص على الصفحة:

![صورة توضيحية](/images/mooc/fd536001df05.webp)

لأن React&nbsp;<a href="https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks" target="_blank" rel="noopener">يعتني بتنقية البيانات في المتغيرات</a>. وقد كانت بعض إصدارات React&nbsp;<a href="https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1" target="_blank" rel="noopener">عرضة</a>&nbsp;لهجمات XSS. وقد رُقّعت الثغرات الأمنية بالطبع، لكن لا ضمان لعدم وجود المزيد منها.

يجب أن يبقى المرء يقظاً عند استخدام المكتبات؛ فإذا وُجدت تحديثات أمنية لتلك المكتبات، فمن المستحسن تحديثها في تطبيقاته. وتوجد التحديثات الأمنية لـ Express في&nbsp;<a href="https://expressjs.com/en/advanced/security-updates.html" target="_blank" rel="noopener">توثيق المكتبة</a>&nbsp;وللـ Node في&nbsp;<a href="https://nodejs.org/en/blog/vulnerability/" target="_blank" rel="noopener">هذه المدونة</a>.

يمكنك التحقق من مدى حداثة اعتمادياتك باستخدام الأمر

```bash
npm outdated --depth 0
```

المشروع الذي عمره سنة والمستخدم في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">الجزء 9</a> من هذا المقرر لديه بالفعل عدد لا بأس به من الاعتماديات القديمة:

![صورة توضيحية](/images/mooc/2c1de14c3b41.webp)

يمكن تحديث الاعتماديات بتحرير الملف&nbsp;<em>package.json</em>. وأفضل طريقة لفعل ذلك استخدام أداة تسمى&nbsp;<em>npm-check-updates</em>. ويمكن تثبيتها عالمياً بتنفيذ الأمر:

```bash
npm install -g npm-check-updates
```

باستخدام هذه الأداة، يُفحص مدى حداثة الاعتماديات بالطريقة التالية:

```
$ npm-check-updates
Checking ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run ncu -u to upgrade package.json
```

يُحدَّث الملف <em>package.json</em>&nbsp;بتنفيذ الأمر <em>ncu -u</em>.

```
$ ncu -u
Upgrading ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run npm install to install new versions.
```

ثم يحين وقت تحديث الاعتماديات بتنفيذ الأمر <em>npm install</em>. غير أن الإصدارات القديمة من الاعتماديات ليست بالضرورة خطراً أمنياً.

يمكن استخدام أمر npm&nbsp;<a href="https://docs.npmjs.com/cli/audit" target="_blank" rel="noopener">audit</a>&nbsp;للفحص الأمني للاعتماديات. فهو يقارن أرقام إصدارات الاعتماديات في تطبيقك بقائمة أرقام إصدارات الاعتماديات التي تحتوي على تهديدات أمنية معروفة في قاعدة بيانات مركزية للأخطاء.

وعند تشغيل <em>npm audit</em>&nbsp;على المشروع نفسه، يطبع قائمة طويلة من الشكاوى والإصلاحات المقترحة. وفيما يلي جزء من التقرير:

```bash
$ patientor npm audit

... many lines removed ...

url-parse  &lt;1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

بعد سنة واحدة فقط، أصبحت الشيفرة مليئة بتهديدات أمنية صغيرة. ولحسن الحظ، لا يوجد سوى تهديدين حرجين. لنشغّل <em>npm audit fix</em>&nbsp;كما يقترح التقرير:

```
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

يتبقى 62 تهديداً لأن <em>audit fix</em>&nbsp;لا يحدّث افتراضياً الاعتماديات إذا زاد رقم إصدارها <em>الرئيسي (major)</em>. وتحديث هذه الاعتماديات قد يؤدي إلى انهيار التطبيق بأكمله.

مصدر العلّة الحرجة هي مكتبة <a href="https://github.com/immerjs/immer" target="_blank" rel="noopener">immer</a>

```
immer  &lt;9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

تشغيل <em>npm audit fix --force</em>&nbsp;سيُرقّي إصدار المكتبة لكنه سيرقّي أيضاً المكتبة <em>react-scripts</em>&nbsp;وقد يُعطّل ذلك بيئة التطوير. لذا سنترك ترقيات المكتبات لوقت لاحق...

يمكن لمشروع Node/React حديث أن يعتمد بسهولة، مباشرةً وبشكل متعدٍّ (transitively)، على مئات أو حتى آلاف الحزم المنشورة من أشخاص لم يقابلهم المطوّر قط. وهذا بالضبط ما يجعل <a href="https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html">هجمات سلسلة التوريد ممكنة</a>: فبدلاً من مهاجمة تطبيق مباشرةً، يخترق المهاجم إحدى الاعتماديات التي يعتمد عليها، ثم تُسحب الشيفرة الخبيثة إلى كل مشروع يثبّت تلك الاعتمادية.

هناك عدة طرق شائعة لحدوث ذلك:
- يُختطف حساب أحد المشرفين على npm (مثلاً عبر بريد تصيّد أو رمز وصول مسرَّب غير محمي) وتُنشر نسخة خبيثة من حزمة موثوقة في الأصل
- يُعدَّل سكربت <em>postinstall</em> لحزمة أو الشيفرة نفسها ليسرق بهدوء متغيرات البيئة أو الرموز أو مفاتيح SSH أثناء <em>npm install</em>
- تُنشر حزمة خبيثة باسم يشبه عن قرب اسماً شائعاً، أملاً في أن يخطئ المطوّر في كتابة أمر فيثبّتها بالخطأ
- يعتمد مشروع على اعتمادية غير مُصانة يُنقل ملكيتها إلى مشرف جديد خبيث.

وبما أن شيفرة الاعتمادية المخترَقة تعمل بنفس صلاحيات بقية التطبيق (وغالباً، أثناء التثبيت، بصلاحيات جهاز المطوّر نفسه أو خط أنابيب CI)، فقد تكون العواقب وخيمة: سرقة بيانات الاعتماد، أو بناء نسخ إنتاجية بباب خلفي، أو تسريب بيانات المستخدمين.

بعض الطرق العملية لتقليل الخطر:
- أبقِ عدد الاعتماديات صغيراً قدر المعقول؛ فكل حزمة مضافة هي سطح هجوم إضافي.
- التزم بملف القفل (<em>package-lock.json</em>) واستخدم <em>npm ci</em> بدلاً من <em>npm install</em> في بيئات CI/الإنتاج، بحيث تُستخدم إصدارات الاعتماديات التي سبق التحقق منها بالضبط مع بصمات تكاملها.
- شغّل <em>npm audit</em> (أو ما يكافئه) بانتظام، ودع أدوات مثل <a href="https://docs.github.com/en/code-security/dependabot">Dependabot</a> أو <a href="https://docs.renovatebot.com">Renovate</a> تفتح طلبات سحب تلقائياً عند إصدار نسخ جديدة.
- كن حذراً بشكل خاص عند إضافة اعتمادية جديدة تماماً: تحقق من مدى نشاط صيانتها، وكم مشروع آخر يعتمد عليها، وما إذا كان اسم الحزمة هو المقصود بالضبط.
- فكّر في تعطيل تنفيذ سكربتات التثبيت للاعتماديات التي لا تثق بها تماماً، مثلاً عبر <em>npm install --ignore-scripts</em>.
- تجنّب تثبيت إصدار حزمة لحظة نشره. فمعظم الإصدارات الخبيثة تُكتشف وتُسحب خلال الساعات أو الأيام الأولى، لذا تُصفّي مهلة قصيرة نسبة كبيرة منها. وبدءاً من إصدار npm 11.10.0، يمكن فرض ذلك عبر إعداد <a href="https://docs.npmjs.com/cli/v11/using-npm/config/#min-release-age">min-release-age</a> في <em>.npmrc</em> (يُعطى بالأيام)، الذي يجعل npm يتجاهل أي إصدار ليس قديماً بما يكفي.

لا تجعل أي من هذه الخطوات التطبيق محصّناً ضد هجمات سلسلة التوريد، لكنها معاً تقلّص بشكل كبير النافذة التي يمكن فيها لاعتمادية مخترَقة إحداث الضرر قبل ملاحظتها.

من التهديدات المذكورة في قائمة OWASP <em>المصادقة المعطوبة (Broken Authentication)</em>&nbsp;وما يتصل بها <em>التحكم المعطوب في الوصول (Broken Access Control)</em>. والمصادقة القائمة على الرموز التي كنا نستخدمها متينة إلى حد كبير إذا كان التطبيق يُستخدم عبر بروتوكول HTTPS المشفّر للحركة. وعند تنفيذ التحكم في الوصول، ينبغي للمرء مثلاً أن يتذكر عدم التحقق من هوية المستخدم في المتصفح فحسب بل على الخادم أيضاً. ومن سوء الأمن منع بعض الإجراءات فقط بإخفاء خيارات التنفيذ في شيفرة المتصفح.

على موقع MDN التابع لـ Mozilla، يوجد <a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security" target="_blank" rel="noopener">دليل أمن المواقع</a>&nbsp;جيد جداً، يتناول هذا الموضوع المهم جداً:

![صورة توضيحية](/images/mooc/c9144f9afa62.webp)

يتضمن توثيق Express قسماً عن الأمن:&nbsp;<a href="https://expressjs.com/en/advanced/best-practice-security.html" target="_blank" rel="noopener">أفضل ممارسات الإنتاج: الأمن</a>، وهو جدير بالقراءة. ويُوصى أيضاً بإضافة مكتبة تسمى&nbsp;<a href="https://helmetjs.github.io/" target="_blank" rel="noopener">Helmet</a>&nbsp;إلى الواجهة الخلفية. وهي تتضمن مجموعة من الوسائط (middleware) التي تُزيل بعض الثغرات الأمنية في تطبيقات Express.

استخدام <a href="https://github.com/nodesecurity/eslint-plugin-security" target="_blank" rel="noopener">إضافة الأمن</a>&nbsp;في ESlint جدير بالعمل به أيضاً.

### الاتجاهات الحالية

أخيراً، لنلقِ نظرة على بعض تقنيات الغد (أو، في الواقع، تقنيات اليوم بالفعل)، والاتجاهات التي يتجه إليها تطوير الويب.

#### النسخ المُنمَّطة من JavaScript

قد تؤدي <a href="https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing" target="_blank" rel="noopener">الكتابة الديناميكية (dynamic typing)</a>&nbsp;في JavaScript إلى أخطاء خفية لا تُكتشف إلا وقت التشغيل. وكان المقرر يغطي <a href="https://legacy.reactjs.org/docs/typechecking-with-proptypes.html" target="_blank" rel="noopener">PropTypes</a>&nbsp;كطريقة لإضافة فحوصات أنواع وقت التشغيل إلى props المكوّن، لكن PropTypes خرجت إلى حد كبير من الاستخدام مع تحرّك المنظومة نحو <a href="https://en.wikipedia.org/wiki/Type_system#Static_type_checking" target="_blank" rel="noopener">الفحص الساكن للأنواع (static type checking)</a>.

<a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>، المطوَّر من Microsoft، أصبح المعيار الفعلي لـ JavaScript المُنمَّط. فهو يلتقط أخطاء الأنواع وقت الترجمة بدلاً من وقت التشغيل، ويوفر أدوات تحرير ممتازة، ويُستخدم الآن في غالبية مشاريع React الجديدة. ويُغطى TypeScript في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">الجزء 9</a>.

#### العرض من الخادم ومكوّنات الخادم في React

لا يجب أن تعمل مكوّنات React في المتصفح. فيمكن أيضاً عرضها على&nbsp;<a href="https://react.dev/reference/react-dom/server" target="_blank" rel="noopener">الخادم</a>، الذي يرسل HTML جاهزاً إلى العميل بدلاً من صفحة فارغة يجب على JavaScript أن يملأها. وهذا <em>العرض من الخادم (server-side rendering)</em>&nbsp;(SSR) يحسّن زمن التحميل المُدرَك ويهم لتحسين محركات البحث (SEO)، لأن زواحف محركات البحث ترى محتوى معروضاً بالكامل دون الحاجة إلى تنفيذ JavaScript.

التطور الأحدث والأهم هو <a href="https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components" target="_blank" rel="noopener">مكوّنات الخادم في React (React Server Components)</a>&nbsp;(RSC)، التي قُدّمت في React 18 وأصبحت الآن جزءاً أساسياً من معمارية React. يعمل مكوّن الخادم حصراً على الخادم ولا يُرسل أبداً إلى المتصفح كـ JavaScript. ويمكنه القراءة مباشرة من قاعدة بيانات أو نظام ملفات، وإبعاد الأسرار عن حزمة العميل، وبثّ مخرجاته إلى المتصفح. ويتلقى المتصفح هذه المكوّنات كبيانات معروضة، لا كشيفرة قابلة للتنفيذ. أما <em>مكوّنات العميل (Client Components)</em>، المعلَّمة بـ<em>'use client'، لا تزال تعمل في المتصفح وتتعامل مع التفاعل كما في السابق. وفي تطبيق RSC،</em> فمعظم المكوّنات هي مكوّنات خادم افتراضياً، وتُستخدم مكوّنات العميل فقط حيث يلزم تفاعل المستخدم.

<a href="https://nextjs.org/" target="_blank" rel="noopener">Next.js</a> أصبح الإطار المعياري لبناء تطبيقات React التي تتطلب سلوكاً من جهة الخادم. وموجّه App Router الخاص به (المقدَّم في Next.js 13) مبني حول مكوّنات الخادم في React ويوفر توجيهاً قائماً على الملفات، وتخطيطات متداخلة، وإجراءات خادم لتغيير البيانات، ودعماً مدمجاً للتوليد الساكن وإعادة التوليد الساكن التدريجي. وفي عام 2026، يُعدّ Next.js الخيار الأول لأي مشروع React يهم فيه SSR أو SEO أو القدرات كاملة الحزمة. ويغطي <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs"> 14</a> <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">الجزء 14</a> من المقرر Next.js.

#### معمارية الخدمات المصغّرة

خلال هذا المقرر، لم نلمس سوى سطح الجانب الخادمي. ففي تطبيقاتنا، كانت لدينا واجهة خلفية <em>أحادية (monolithic)</em>، أي تطبيق واحد يشكّل كلاً متكاملاً ويعمل على خادم واحد، ويقدّم بضع نقاط نهاية API فقط.

ومع نمو التطبيق، يبدأ نهج الواجهة الخلفية الأحادية يسبب مشكلات من حيث الأداء وقابلية الصيانة معاً.

<a href="https://martinfowler.com/articles/microservices.html" target="_blank" rel="noopener">معمارية الخدمات المصغّرة (microservice architecture)</a>&nbsp;(microservices) طريقة لتكوين الواجهة الخلفية لتطبيق من خدمات منفصلة ومستقلة كثيرة تتواصل مع بعضها عبر الشبكة. وغرض كل خدمة مصغّرة أن تتولى كلاً وظيفياً منطقياً بعينه. وفي معمارية الخدمات المصغّرة الخالصة، لا تستخدم الخدمات قاعدة بيانات مشتركة.

على سبيل المثال، يمكن أن يتكون تطبيق قائمة المدونات من خدمتين: واحدة تتعامل مع المستخدم وأخرى تتولى المدونات. وتكون مسؤولية خدمة المستخدم تسجيل المستخدم ومصادقته، بينما تتولى خدمة المدونات العمليات المتعلقة بالمدونات.

تُصوّر الصورة أدناه الفرق بين بنية تطبيق قائم على معمارية الخدمات المصغّرة وآخر قائم على بنية أحادية أكثر تقليدية:

![صورة توضيحية](/images/mooc/71c89f34e7a7.webp)

دور الواجهة الأمامية (المحاط بمربع في الصورة) لا يختلف كثيراً بين النموذجين. وغالباً ما توجد <a href="http://microservices.io/patterns/apigateway" target="_blank" rel="noopener">بوابة API (API gateway)</a>&nbsp;بين الخدمات المصغّرة والواجهة الأمامية، تمنح وهماً بواجهة برمجية أكثر تقليدية «كل شيء على الخادم نفسه». وتستخدم <a href="https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19" target="_blank" rel="noopener">Netflix</a>، بين آخرين، هذا النوع من النهج.

نشأت معماريات الخدمات المصغّرة وتطورت لتلبية احتياجات تطبيقات كبيرة على نطاق الإنترنت. وقد أرسى الاتجاه Amazon قبل ظهور مصطلح الخدمة المصغّرة بوقت طويل. وكانت نقطة البداية الحاسمة بريداً إلكترونياً أرسله الرئيس التنفيذي لـ Amazon جيف بيزوس إلى جميع الموظفين عام 2002:

> من الآن فصاعداً، ستكشف جميع الفرق عن بياناتها ووظائفها عبر واجهات الخدمة.
>
> يجب أن تتواصل الفرق مع بعضها عبر هذه الواجهات.
>
> لن يُسمح بأي شكل آخر من التواصل بين العمليات: لا ربط مباشر، ولا قراءات مباشرة لمخزن بيانات فريق آخر، ولا نموذج ذاكرة مشتركة، ولا أبواب خلفية على الإطلاق. التواصل الوحيد المسموح هو عبر استدعاءات واجهة الخدمة عبر الشبكة.
>
> لا يهم أي تقنية تستخدم.
>
> يجب تصميم جميع واجهات الخدمة، دون استثناء، من الأساس لتكون قابلة للتجسيد الخارجي. أي أنه يجب على الفريق التخطيط والتصميم ليكون قادراً على كشف الواجهة للمطورين في العالم الخارجي.
>
> لا استثناءات.
>
> من لا يفعل هذا سيُطرد. شكراً لكم؛ أتمنى لكم يوماً سعيداً!

في أيامنا هذه، من أكبر الرواد في استخدام الخدمات المصغّرة&nbsp;<a href="https://www.infoq.com/presentations/netflix-chaos-microservices" target="_blank" rel="noopener">Netflix</a>.

ظل استخدام الخدمات المصغّرة يكتسب ضجة مطردة ليكون نوعاً من&nbsp;<a href="https://en.wikipedia.org/wiki/No_Silver_Bullet" target="_blank" rel="noopener">الرصاصة الفضية (silver bullet)</a>&nbsp;في يومنا هذا، حيث يُقدَّم حلاً لكل نوع من المشكلات تقريباً. غير أن هناك تحديات عدة عند تطبيق معمارية الخدمات المصغّرة، وقد يكون من المنطقي <a href="https://martinfowler.com/bliki/MonolithFirst.html" target="_blank" rel="noopener">البدء بالبنية الأحادية (monolith first)</a>&nbsp;بإنشاء واجهة خلفية تقليدية شاملة أولاً. أو ربما <a href="https://martinfowler.com/articles/dont-start-monolith.html" target="_blank" rel="noopener">لا</a>. فهناك آراء مختلفة كثيرة في الموضوع. وكلا الرابطين يقودان إلى موقع مارتن فاولر؛ وكما نرى، حتى الحكماء ليسوا متأكدين تماماً أيّ الطرق الصحيحة أصح.

للأسف، لا يمكننا الغوص أعمق في هذا الموضوع المهم خلال هذا المقرر. فحتى نظرة عابرة على الموضوع تتطلب 5 أسابيع إضافية على الأقل.

#### بلا خادم (Serverless)

بعد إصدار خدمة&nbsp;<a href="https://aws.amazon.com/lambda/" target="_blank" rel="noopener">lambda</a>&nbsp;من Amazon في نهاية 2014، بدأ اتجاه جديد يظهر في تطوير تطبيقات الويب:&nbsp;<a href="https://serverless.com/" target="_blank" rel="noopener">serverless</a>.

الأمر الرئيسي في lambda، وكذلك <a href="https://cloud.google.com/functions/" target="_blank" rel="noopener">Cloud functions</a>&nbsp;من Google اليوم و<a href="https://azure.microsoft.com/en-us/services/functions/" target="_blank" rel="noopener">وظائف مشابهة في Azure</a>، أنه يمكّن من&nbsp;<em>تنفيذ دوال فردية</em>&nbsp;في السحابة. وقبل ذلك، كانت أصغر وحدة قابلة للتنفيذ في السحابة <em>عملية (process)</em>&nbsp;واحدة، مثلاً بيئة تشغيل تشغّل واجهة خلفية Node.

مثلاً، باستخدام <a href="https://aws.amazon.com/api-gateway/" target="_blank" rel="noopener">بوابة API</a>&nbsp;من Amazon يمكن إنشاء تطبيقات بلا خادم حيث تحصل الطلبات إلى واجهة HTTP API المعرَّفة على استجابات مباشرة من دوال سحابية. وعادةً تعمل الدوال بالفعل باستخدام بيانات مخزنة في قواعد بيانات خدمة السحابة.

لا يتعلق Serverless بعدم وجود خادم في التطبيقات، بل بكيفية تعريف الخادم. فيمكن لمطوّري البرمجيات نقل جهودهم البرمجية إلى مستوى أعلى من التجريد إذ لم تعد هناك حاجة لتعريف توجيه طلبات HTTP وعلاقات قواعد البيانات وغير ذلك برمجياً، لأن البنية التحتية السحابية توفر كل هذا. كما أن الدوال السحابية تناسب إنشاء نظام جيد التوسع، فمثلاً يمكن لـ Lambda من Amazon تنفيذ عدد هائل من الدوال السحابية في الثانية. ويحدث كل هذا تلقائياً عبر البنية التحتية ولا حاجة إلى بدء خوادم جديدة وغير ذلك.

### مكتبات مفيدة وقراءات إضافية

أنتج مجتمع مطوّري JavaScript تنوّعاً كبيراً من المكتبات المفيدة. وقبل كتابة شيء من الصفر، يجدر دائماً التحقق مما إذا كان هناك حل جيد الصيانة موجود بالفعل.

يمكنك الاستفادة من معرفتك بـ React عند تطوير تطبيقات الهواتف المحمولة باستخدام <a href="https://reactnative.dev/" target="_blank" rel="noopener">React Native</a>، وهو موضوع <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native" target="_blank" rel="noopener">الجزء 10</a> من المقرر.

ويستمر المقرر نفسه بعد الجزء 7: يغطي <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql" target="_blank" rel="noopener">الجزء 8</a> GraphQL، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript" target="_blank" rel="noopener">الجزء 9</a> TypeScript، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native" target="_blank" rel="noopener">الجزء 10</a> React Native، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration" target="_blank" rel="noopener">الجزء 11</a> CI/CD، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers" target="_blank" rel="noopener">الجزء 12</a> الحاويات، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">الجزء 13</a> استخدام قواعد بيانات SQL، و<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs">الجزء 14</a> Next.js. ومحتويات المقرر الكاملة مدرجة في <a href="/#course-contents" target="_blank" rel="noopener">صفحة المقرر</a>.

المصادر الخارجية التالية أماكن جيدة للتعمق في أنماط React وجودة الشيفرة والمنظومة الأوسع:
- <a href="https://www.patterns.dev/" target="_blank" rel="noopener">Patterns.dev</a> يغطي أنماط React وJavaScript الحديثة بعمق. ولمجموعة منتقاة من التقنيات الخاصة بـ React، يُعدّ <a href="https://vasanthk.gitbooks.io/react-bits/" target="_blank" rel="noopener">React bits</a> رفيقاً مفيداً.
- <a href="https://overreacted.io/" target="_blank" rel="noopener">Overreacted</a> مدونة دان أبراموف، أحد أعضاء فريق React الأساسي الأصليين. وتتناول المقالات قرارات تصميم React ونماذجه الذهنية بعمق، وتستحق القراءة حتى وهي بعد سنوات.
- <a href="https://kentcdodds.com/blog" target="_blank" rel="noopener">Kent C. Dodds</a> يكتب بإسهاب عن أفضل ممارسات React والاختبار وتصميم المكوّنات. وقد شكّلت مقالاته عن فلسفة الاختبار على وجه الخصوص طريقة تفكير المجتمع في اختبارات الواجهة الأمامية.
- <a href="https://alexkondov.com/tao-of-react/" target="_blank" rel="noopener">Tao of React</a> دليل قصير ذو رأي واضح لبنية تطبيقات React يغطي المكوّنات والحالة وprops وتخطيط المشروع بطريقة عملية.
- <a href="https://www.reactiflux.com/" target="_blank" rel="noopener">Reactiflux</a> مجتمع كبير لمطوّري React على Discord، ومكان جيد لطرح الأسئلة بعد انتهاء المقرر. وتحتفظ مكتبات مفتوحة المصدر كثيرة بقنواتها الخاصة هناك.
