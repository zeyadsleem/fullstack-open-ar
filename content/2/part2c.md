---
mainImage: /images/part-2.svg
part: 2
letter: c
lang: ar
---

<div class="content">

حتى الآن كنا نعمل فقط على «الواجهة الأمامية»، أي وظائف جهة العميل (المتصفح). سنبدأ العمل على «الواجهة الخلفية»، أي وظائف جهة الخادم، في [الجزء الثالث](/part3) من هذه الدورة. ومع ذلك، سنخطو الآن خطوة في ذلك الاتجاه بالتعرّف على كيفية تواصل الشيفرة التي تُنفَّذ في المتصفح مع الواجهة الخلفية.

لنستخدم أداة مخصّصة للاستخدام أثناء تطوير البرمجيات تُدعى [JSON Server](https://github.com/typicode/json-server) لتؤدي دور الخادم لدينا.

أنشئ ملفاً باسم <i>db.json</i> في الدليل الجذر لمشروع <i>notes</i> السابق بالمحتوى التالي:

```json
{
  "notes": [
    {
      "id": "1",
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": "2",
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": "3",
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
```

يمكنك تشغيل JSON Server دون تثبيت منفصل بتنفيذ أمر _npx_ التالي في الدليل الجذر للتطبيق:

```js
npx json-server --port 3001 db.json
```

يبدأ JSON Server العمل على المنفذ 3000 افتراضياً، لكننا سنحدّد الآن منفذاً بديلاً هو 3001. لننتقل إلى العنوان <http://localhost:3001/notes> في المتصفح. يمكننا أن نرى أن JSON Server يقدّم الملاحظات التي كتبناها سابقاً في الملف بصيغة JSON:

![الملاحظات بصيغة JSON في المتصفح على localhost:3001/notes](../../images/2/14new.webp)

إذا لم يكن متصفحك يوفّر طريقة لتنسيق عرض بيانات JSON، فثبّت إضافة مناسبة، مثل [JSONView](https://chromewebstore.google.com/detail/gmegofmjomhknnokphhckolhcffdaihd)، لتسهيل حياتك.

من الآن فصاعداً، ستكون الفكرة هي حفظ الملاحظات في الخادم، ما يعني في هذه الحالة حفظها في json-server. تجلب شيفرة React الملاحظات من الخادم وتعرضها على الشاشة. وكلما أُضيفت ملاحظة جديدة إلى التطبيق، ترسلها شيفرة React أيضاً إلى الخادم لتبقى الملاحظة الجديدة محفوظة في «الذاكرة».

يخزّن json-server كل البيانات في ملف <i>db.json</i> الموجود على الخادم. في الواقع العملي، ستُخزَّن البيانات في نوع ما من قواعد البيانات. غير أن json-server أداة عملية تتيح استخدام وظائف جهة الخادم في مرحلة التطوير دون الحاجة إلى برمجة أي منها.

سنتعرّف على مبادئ تنفيذ وظائف جهة الخادم بمزيد من التفصيل في [الجزء 3](/part3) من هذه الدورة.

### المتصفح كبيئة تشغيل

مهمتنا الأولى هي جلب الملاحظات الموجودة مسبقاً إلى تطبيق React لدينا من العنوان <http://localhost:3001/notes>.

في [المشروع المثال](/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser) من الجزء 0، تعلّمنا بالفعل طريقة لجلب البيانات من خادم باستخدام JavaScript. كانت الشيفرة في المثال تجلب البيانات باستخدام [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)، المعروف أيضاً بطلب HTTP يُنفَّذ باستخدام كائن XHR. هذه تقنية طُرحت عام 1999، ويدعمها كل متصفح منذ زمن طويل.

لم يعد استخدام XHR موصى به، والمتصفحات تدعم على نطاق واسع الدالة [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) المبنية على ما يُسمى [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)، بدلاً من النموذج المدفوع بالأحداث الذي يستخدمه XHR.

وكتذكير من الجزء 0 (الذي ينبغي <i>تذكّر عدم استخدامه</i> دون سبب ملحّ)، كانت البيانات تُجلب باستخدام XHR بالطريقة التالية:

```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // عالج الاستجابة المحفوظة في المتغير data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

في البداية تماماً، نسجّل <i>معالج حدث</i> على كائن <em>xhttp</em> الذي يمثّل طلب HTTP، وسيستدعيه وقت تشغيل JavaScript كلما تغيّرت حالة كائن <em>xhttp</em>. وإذا كان تغيّر الحالة يعني أن استجابة الطلب قد وصلت، فتُعالَج البيانات وفقاً لذلك.

من الجدير بالملاحظة أن الشيفرة في معالج الحدث تُعرَّف قبل إرسال الطلب إلى الخادم. ورغم ذلك، ستُنفَّذ الشيفرة داخل معالج الحدث في نقطة زمنية لاحقة. لذا لا تُنفَّذ الشيفرة بشكل متزامن «من الأعلى إلى الأسفل»، بل تُنفَّذ <i>بشكل غير متزامن</i>. يستدعي JavaScript معالج الحدث المسجَّل للطلب في مرحلة ما.

الطريقة المتزامنة لتنفيذ الطلبات الشائعة في برمجة Java، على سبيل المثال، ستسير على النحو التالي (ملاحظة: هذه ليست شيفرة Java عاملة فعلاً):

```java
HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

في Java، تُنفَّذ الشيفرة سطراً بسطر وتتوقف لتنتظر طلب HTTP، أي تنتظر انتهاء الأمر _request.get(...)_. ثم تُخزَّن البيانات التي يعيدها الأمر، وهي الملاحظات في هذه الحالة، في متغير، ونبدأ في التعامل مع البيانات بالطريقة المطلوبة.

وفي المقابل، تتبع محرّكات JavaScript، أو بيئات التشغيل، [النموذج غير المتزامن](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). من حيث المبدأ، يتطلب ذلك تنفيذ جميع [عمليات الإدخال/الإخراج](https://en.wikipedia.org/wiki/Input/output) (مع بعض الاستثناءات) بشكل غير حاجب. وهذا يعني أن تنفيذ الشيفرة يستمر فوراً بعد استدعاء دالة إدخال/إخراج، دون انتظار عودتها.

وعندما تكتمل عملية غير متزامنة، أو بشكل أدق، في نقطة ما بعد اكتمالها، يستدعي محرّك JavaScript معالجات الأحداث المسجَّلة على العملية.

حالياً، محرّكات JavaScript <i>أحادية الخيط</i>، ما يعني أنها لا تستطيع تنفيذ الشيفرة على التوازي. ونتيجة لذلك، من الضروري عملياً استخدام نموذج غير حاجب لتنفيذ عمليات الإدخال/الإخراج. وإلا «يتجمّد» المتصفح أثناء جلب البيانات من خادم مثلاً.

من نتائج كون محرّكات JavaScript أحادية الخيط أنه إذا استغرق تنفيذ الشيفرة وقتاً طويلاً، يصبح المتصفح غير مستجيب طوال مدة التنفيذ. إذا أُضيفت الشيفرة التالية إلى بداية مكوّن <i>App</i>:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // highlight-start
  setTimeout(() => {
    console.log('loop..')
    let i = 0
    while (i < 99999999999) {
      i++
    }
    console.log('end')
  }, 5000)
  // highlight-end

  // ...
}
```

يعمل كل شيء بشكل طبيعي لمدة خمس ثوانٍ. وعندما تُنفَّذ الدالة المعرّفة كوسيط لـ<em>setTimeout</em>، تصبح صفحة المتصفح غير مستجيبة طوال مدة الحلقة الطويلة. تتجمّد الصفحة تماماً، أي لا يمكنك النقر على أزرارها أو استخدام أي وظيفة أخرى.

لكي يبقى المتصفح <i>مستجيباً</i>، أي قادراً على التفاعل باستمرار مع عمليات المستخدم بسرعة كافية، يجب أن يكون منطق الشيفرة بحيث لا تستغرق أي عملية حسابية واحدة وقتاً طويلاً جداً.

توجد على الإنترنت مواد إضافية كثيرة حول الموضوع. ومن أوضح العروض في هذا الموضوع الكلمة الرئيسية لـPhilip Roberts بعنوان [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

في متصفحات اليوم، يمكن تشغيل شيفرة متوازية بمساعدة ما يُسمى [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). غير أن حلقة الأحداث لنافذة متصفح واحدة لا يزال يتولاها [خيط واحد](https://medium.com/techtrument/multithreading-javascript-46156179cf9a) فقط.

### npm

لنعد إلى موضوع جلب البيانات من الخادم.

يمكننا استخدام الدالة [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) المبنية على promises والمذكورة سابقاً لجلب البيانات من الخادم. إن fetch أداة رائعة، فهي معيارية ومدعومة في جميع المتصفحات الحديثة (باستثناء IE).

ومع ذلك، سنستخدم مكتبة [axios](https://github.com/axios/axios) بدلاً منها للتواصل بين المتصفح والخادم. فهي تعمل مثل fetch لكن استخدامها أكثر متعة بعض الشيء. وهناك سبب وجيه آخر لاستخدام Axios هو أنه يساعدنا على التعرّف على إضافة مكتبات خارجية، أو <i>حزم npm</i>، إلى مشاريع React.

في أيامنا هذه، تُعرَّف جميع مشاريع JavaScript عملياً باستخدام مدير حزم node، المعروف اختصاراً بـ[npm](https://docs.npmjs.com/about-npm). والمشاريع المنشأة باستخدام Vite تتبع أيضاً صيغة npm. ومن المؤشرات الواضحة على أن مشروعاً يستخدم npm وجود ملف <i>package.json</i> في جذر المشروع:

```json
{
  "name": "part2-notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "vite": "^6.0.5"
  }
}
```

في هذه المرحلة، يهمّنا أكثر من غيره قسم <i>dependencies</i> لأنه يحدّد ما للمشروع من <i>اعتماديات</i>، أو مكتبات خارجية.

نريد الآن استخدام axios. نظرياً، يمكننا تعريف المكتبة مباشرة في ملف <i>package.json</i>، لكن الأفضل تثبيتها من سطر الأوامر.

```js
npm install axios
```

**ملاحظة: يجب دائماً تنفيذ أوامر _npm_ في الدليل الجذر للمشروع**، حيث يوجد ملف <i>package.json</i>.

أصبح axios الآن مُدرَجاً بين الاعتماديات الأخرى:

```json
{
  "name": "part2-notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.9", // highlight-line
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  // ...
}
```

إضافةً إلى إضافة axios إلى الاعتماديات، فإن أمر <em>npm install</em> <i>نزّل</i> أيضاً شيفرة المكتبة. وكما هو الحال مع الاعتماديات الأخرى، تجد الشيفرة في دليل <i>node\_modules</i> الموجود في الجذر. وكما لاحظت ربما، يحتوي <i>node\_modules</i> على قدر لا بأس به من الأشياء المثيرة للاهتمام.

لنُجرِ إضافة أخرى. ثبّت <i>json-server</i> كاعتمادية تطوير (تُستخدم أثناء التطوير فقط) بتنفيذ الأمر:

```js
npm install json-server --save-dev
```

وأجرِ إضافة صغيرة إلى قسم <i>scripts</i> في ملف <i>package.json</i>:

```json
{
  // ... 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server -p 3001 db.json" // highlight-line
  },
}
```

يمكننا الآن بسهولة، ودون تعريف وسائط، تشغيل json-server من الدليل الجذر للمشروع بالأمر:

```js
npm run server
```

سنتعرّف على أداة _npm_ أكثر في [الجزء الثالث من الدورة](/part3).

**ملاحظة** يجب إيقاف json-server الذي شُغّل سابقاً قبل تشغيل واحد جديد؛ وإلا ستقع في مشكلة:

![خطأ تعذّر الارتباط بالمنفذ 3001](../../images/2/15b.webp)

النص الأحمر في رسالة الخطأ يخبرنا بالمشكلة:

<i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i>

كما نرى، لا يستطيع التطبيق الارتباط بـ[المنفذ](https://en.wikipedia.org/wiki/Port_(computer_networking)). والسبب أن المنفذ 3001 مشغول بالفعل بـjson-server الذي شُغّل سابقاً.

استخدمنا الأمر _npm install_ مرتين، لكن مع اختلاف طفيف:

```js
npm install axios
npm install json-server --save-dev
```

هناك فرق دقيق في الوسائط. فـ<i>axios</i> تُثبَّت كاعتمادية تشغيل للتطبيق لأن تنفيذ البرنامج يتطلب وجود المكتبة. في المقابل، ثُبّت <i>json-server</i> كاعتمادية تطوير (_--save-dev_)، لأن البرنامج نفسه لا يحتاجها. فهي تُستخدم للمساعدة أثناء تطوير البرمجيات. وسنوضّح المزيد عن الاعتماديات المختلفة في الجزء التالي من الدورة.

### Axios و promises

نحن الآن جاهزون لاستخدام Axios. من الآن فصاعداً، نفترض أن json-server يعمل على المنفذ 3001.

ملاحظة: لتشغيل json-server وتطبيق React في الوقت نفسه، قد تحتاج إلى استخدام نافذتي طرفية. واحدة لإبقاء json-server يعمل، والأخرى لتشغيل تطبيق React.

يمكن إدخال المكتبة إلى الاستخدام بالطريقة نفسها التي تُستخدم بها المكتبات الأخرى، أي باستخدام عبارة <em>import</em> مناسبة.

أضف ما يلي إلى الملف <i>main.jsx</i>:

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

إذا فتحت <http://localhost:5173/> في المتصفح، فينبغي أن يُطبع هذا في وحدة التحكم

![promises مطبوعة في وحدة التحكم](../../images/2/16new.webp)

تعيد دالة _get_ في Axios [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

تقول الوثائق على موقع Mozilla ما يلي عن promises:

> <i>الـ promise كائن يمثّل الاكتمال أو الفشل النهائي لعملية غير متزامنة.</i>

بعبارة أخرى، الـ promise كائن يمثّل عملية غير متزامنة. ويمكن أن يكون للـ promise ثلاث حالات مميزة:

- الـ promise <i>قيد الانتظار</i> (pending): يعني أن العملية غير المتزامنة المقابلة للـ promise لم تنتهِ بعد وأن القيمة النهائية غير متاحة حتى الآن.
- الـ promise <i>مُنجَز</i> (fulfilled): يعني أن العملية اكتملت والقيمة النهائية متاحة، وهي عملية ناجحة عموماً.
- الـ promise <i>مرفوض</i> (rejected): يعني أن خطأ منع تحديد القيمة النهائية، وهو ما يمثّل عموماً عملية فاشلة.

هناك تفاصيل كثيرة تتعلق بـpromises، لكن فهم هذه الحالات الثلاث يكفينا الآن. وإذا أردت، يمكنك قراءة المزيد عن promises في [وثائق Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

الـ promise الأولى في مثالنا <i>مُنجَزة</i>، وتمثّل طلب _axios.get('http://localhost:3001/notes')_ ناجحاً. أما الثانية فهي <i>مرفوضة</i>، وتخبرنا وحدة التحكم بالسبب. يبدو أننا كنا نحاول تنفيذ طلب HTTP GET إلى عنوان غير موجود.

إذا أردنا، ومتى أردنا، الوصول إلى نتيجة العملية التي يمثّلها الـ promise، فيجب أن نسجّل معالج حدث على الـ promise. ويتحقق ذلك باستخدام الدالة <em>then</em>:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```

يُطبع ما يلي في وحدة التحكم:

![بيانات كائن JSON مطبوعة في وحدة التحكم](../../images/2/17new.webp)

تستدعي بيئة تشغيل JavaScript الدالة الاستدعائية المسجَّلة بواسطة الدالة <em>then</em> وتزوّدها بكائن <em>response</em> كوسيط. يحتوي كائن <em>response</em> على كل البيانات الأساسية المتعلقة باستجابة طلب HTTP GET، والتي تشمل <i>data</i> المُعادة، و<i>رمز الحالة</i>، و<i>الترويسات</i> (headers).

تخزين كائن الـ promise في متغير غير ضروري عموماً، ومن الشائع بدلاً من ذلك ربط استدعاء الدالة <em>then</em> باستدعاء دالة axios بحيث يليه مباشرة:

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

تأخذ الدالة الاستدعائية الآن البيانات الموجودة داخل الاستجابة، وتخزّنها في متغير، وتطبع الملاحظات في وحدة التحكم.

هناك طريقة أوضح للقراءة لتنسيق استدعاءات الدوال <i>المتسلسلة</i>، وهي وضع كل استدعاء في سطر خاص به:

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

البيانات التي يعيدها الخادم نص عادي، أي مجرد نص طويل واحد. ومع ذلك تستطيع مكتبة axios تحليل البيانات إلى مصفوفة JavaScript، لأن الخادم حدّد أن صيغة البيانات هي <i>application/json; charset=utf-8</i> (انظر الصورة السابقة) باستخدام ترويسة <i>content-type</i>.

يمكننا أخيراً البدء في استخدام البيانات المجلوبة من الخادم.

لنجرّب طلب الملاحظات من خادمنا المحلي وعرضها، بدايةً في مكوّن App. لاحظ أن هذا الأسلوب فيه مشكلات كثيرة، لأننا نعرض مكوّن <i>App</i> بأكمله فقط عندما ننجح في جلب استجابة:

```js
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

قد تكون هذه الطريقة مقبولة في بعض الظروف، لكنها إشكالية إلى حد ما. لننقل بدلاً من ذلك جلب البيانات إلى مكوّن <i>App</i>.

لكن ما ليس واضحاً مباشرة هو أين ينبغي وضع الأمر <em>axios.get</em> داخل المكوّن.

### خطافات التأثير

استخدمنا بالفعل [خطافات الحالة](https://react.dev/learn/state-a-components-memory) التي قُدّمت مع إصدار React [16.8.0](https://www.npmjs.com/package/react/v/16.8.0)، والتي توفّر الحالة لمكوّنات React المعرّفة كدوال - أي ما يُسمى <i>المكوّنات الدالّية</i>. كما قدّم الإصدار 16.8.0 [خطافات التأثير](https://react.dev/reference/react/hooks#effect-hooks) كميزة جديدة. ووفقاً للوثائق الرسمية:

> <i>تتيح التأثيرات للمكوّن الاتصال بالأنظمة الخارجية والمزامنة معها.</i>
> <i>ويشمل ذلك التعامل مع الشبكة، وDOM الخاص بالمتصفح، والرسوم المتحركة، والودجات المكتوبة باستخدام مكتبة واجهة مستخدم مختلفة، وأي شيفرة أخرى غير تابعة لـReact.</i>

وبذلك تكون خطافات التأثير هي الأداة الصحيحة تماماً لاستخدامها عند جلب البيانات من خادم.

لنُزِل جلب البيانات من <i>main.jsx</i>. وبما أننا سنسترد الملاحظات من الخادم، لم تعد هناك حاجة لتمرير البيانات كـprops إلى مكوّن <i>App</i>. لذا يمكن تبسيط <i>main.jsx</i> إلى:

```js
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

يتغيّر مكوّن <i>App</i> كما يلي:

```js
import { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

أضفنا أيضاً بعض الطبعات المفيدة التي توضّح تتابع التنفيذ.

يُطبع ما يلي في وحدة التحكم:

```
render 0 notes
effect
promise fulfilled
render 3 notes
```

أولاً، يُنفَّذ جسم الدالة التي تعرّف المكوّن ويُعرض المكوّن لأول مرة. في هذه المرحلة تُطبع <i>render 0 notes</i>، ما يعني أن البيانات لم تُجلب من الخادم بعد.

الدالة التالية، أو التأثير (effect) بمصطلح React:

```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

تُنفَّذ مباشرة بعد العرض. وينتج عن تنفيذ الدالة طباعة <i>effect</i> في وحدة التحكم، ويبدأ الأمر <em>axios.get</em> جلب البيانات من الخادم، كما يسجّل الدالة التالية كـ<i>معالج حدث</i> للعملية:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

وعندما تصل البيانات من الخادم، يستدعي وقت تشغيل JavaScript الدالة المسجَّلة كمعالج حدث، فتُطبع <i>promise fulfilled</i> في وحدة التحكم وتُخزَّن الملاحظات المستلمة من الخادم في الحالة باستخدام الدالة <em>setNotes(response.data)</em>.

وكما هو الحال دائماً، يؤدي استدعاء دالة تحديث الحالة إلى إعادة عرض المكوّن. ونتيجة لذلك، تُطبع <i>render 3 notes</i> في وحدة التحكم، وتُعرض الملاحظات المجلوبة من الخادم على الشاشة.

أخيراً، لنلقِ نظرة على تعريف خطاف التأثير كاملاً:

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

لنعد كتابة الشيفرة بطريقة مختلفة قليلاً.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

الآن يمكننا أن نرى بوضوح أكبر أن الدالة [useEffect](https://react.dev/reference/react/useEffect) تأخذ <i>وسيطين</i>. الأول دالة، وهي <i>التأثير</i> نفسه. ووفقاً للوثائق:

> <i>افتراضياً، تعمل التأثيرات بعد كل عرض مكتمل، لكن يمكنك اختيار تشغيلها فقط عندما تتغيّر قيم معينة.</i>

إذن، افتراضياً، يعمل التأثير <i>دائماً</i> بعد عرض المكوّن. لكننا في حالتنا نريد فقط تنفيذ التأثير مع العرض الأول.

يُستخدم الوسيط الثاني لـ<em>useEffect</em> في [تحديد عدد مرات تشغيل التأثير](https://react.dev/reference/react/useEffect#parameters). وإذا كان الوسيط الثاني مصفوفة فارغة <em>[]</em>، فلا يعمل التأثير إلا مع العرض الأول للمكوّن.

هناك حالات استخدام ممكنة كثيرة لخطاف التأثير غير جلب البيانات من الخادم. غير أن هذا الاستخدام يكفينا في الوقت الحالي.

عُد بذاكرتك إلى تتابع الأحداث الذي ناقشناه للتو. أي أجزاء الشيفرة تُنفَّذ؟ وبأي ترتيب؟ وكم مرة؟ إن فهم ترتيب الأحداث أمر بالغ الأهمية!

لاحظ أنه كان يمكننا أيضاً كتابة شيفرة دالة التأثير بهذه الطريقة:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

يُسنَد مرجع إلى دالة معالج حدث إلى المتغير <em>eventHandler</em>. ويُخزَّن الـ promise الذي تعيده دالة <em>get</em> في Axios في المتغير <em>promise</em>. ويحدث تسجيل الدالة الاستدعائية بتمرير المتغير <em>eventHandler</em>، الذي يشير إلى دالة معالج الحدث، كوسيط إلى الدالة <em>then</em> الخاصة بالـ promise. وليس من الضروري عادةً إسناد الدوال والـ promises إلى متغيرات، ويكفي تمثيل أكثر إحكاماً كما هو موضح أدناه.

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

لا تزال لدينا مشكلة في تطبيقنا. فعند إضافة ملاحظات جديدة، لا تُخزَّن في الخادم.

تجد شيفرة التطبيق كما وُصفت حتى الآن كاملةً على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-4)، في الفرع <i>part2-4</i>.

### بيئة التشغيل أثناء التطوير

أصبح إعداد التطبيق بأكمله يزداد تعقيداً باطراد. لنستعرض ما يحدث وأين. تصف الصورة التالية تكوين التطبيق

![مخطط تكوين تطبيق React](../../images/2/18e.webp)

تُنفَّذ شيفرة JavaScript التي يتكوّن منها تطبيق React لدينا في المتصفح. ويحصل المتصفح على JavaScript من <i>خادم تطوير React</i>، وهو التطبيق الذي يعمل بعد تنفيذ الأمر <em>npm run dev</em>. ويحوّل خادم التطوير JavaScript إلى صيغة يفهمها المتصفح. ومن بين أمور أخرى، يدمج JavaScript من ملفات مختلفة في ملف واحد. وسنناقش خادم التطوير بمزيد من التفصيل في الجزء 7 من الدورة.

يجلب تطبيق React العامل في المتصفح البيانات بصيغة JSON من <i>json-server</i> العامل على المنفذ 3001 على الجهاز. والخادم الذي نستعلم منه عن البيانات - <i>json-server</i> - يحصل على بياناته من ملف <i>db.json</i>.

في هذه المرحلة من التطوير، تصادف أن جميع أجزاء التطبيق موجودة على جهاز مطوّر البرمجيات، المعروف أيضاً بـlocalhost. ويتغيّر الوضع عندما يُنشر التطبيق على الإنترنت. وسنفعل ذلك في الجزء 3.

</div>

<div class="tasks">

<h3>التمرين 2.11.</h3>

<h4>2.11: دفتر الهاتف الخطوة 6</h4>

نواصل تطوير دفتر الهاتف. خزّن الحالة الأولية للتطبيق في ملف <i>db.json</i>، الذي ينبغي وضعه في جذر المشروع.

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
}
```

شغّل json-server على المنفذ 3001 وتأكد من أن الخادم يعيد قائمة الأشخاص بالانتقال إلى العنوان <http://localhost:3001/persons> في المتصفح.

إذا ظهرت لك رسالة الخطأ التالية:

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

فهذا يعني أن المنفذ 3001 مستخدم بالفعل من تطبيق آخر، مثل json-server يعمل بالفعل. أغلق التطبيق الآخر، أو غيّر المنفذ إذا لم ينجح ذلك.

عدّل التطبيق بحيث تُجلب الحالة الأولية للبيانات من الخادم باستخدام مكتبة <i>axios</i>. أكمل الجلب باستخدام [خطاف تأثير](https://react.dev/reference/react/useEffect).

</div>
