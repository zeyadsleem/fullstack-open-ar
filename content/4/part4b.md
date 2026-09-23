---
mainImage: /images/part-4.svg
part: 4
letter: b
lang: ar
---

<div class="content">

سنبدأ الآن بكتابة اختبارات للواجهة الخلفية. بما أن الواجهة الخلفية لا تحتوي على منطق معقّد، فلا معنى لكتابة [اختبارات الوحدة](https://en.wikipedia.org/wiki/Unit_testing) لها. الشيء الوحيد المحتمل الذي يمكننا اختباره كوحدة هو دالة _toJSON_ المستخدمة في تنسيق الملاحظات.

في بعض الحالات، قد يكون من المفيد تنفيذ بعض اختبارات الواجهة الخلفية عبر محاكاة قاعدة البيانات بدلاً من استخدام قاعدة بيانات حقيقية. إحدى المكتبات التي يمكن استخدامها لهذا الغرض هي [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

بما أن الواجهة الخلفية لتطبيقنا ما تزال بسيطة نسبياً، سنقرر اختبار التطبيق بأكمله عبر واجهة REST الخاصة به، بحيث تُشمَل قاعدة البيانات أيضاً. هذا النوع من الاختبار، حيث تُختبر عدة مكوّنات من النظام كمجموعة واحدة، يُسمى [اختبار التكامل](https://en.wikipedia.org/wiki/Integration_testing).

### بيئة الاختبار

في أحد الفصول السابقة من مادة الدورة، ذكرنا أنه عندما يعمل خادم الواجهة الخلفية لديك في Fly.io أو Render، فإنه يكون في وضع <i>الإنتاج</i>.

الاصطلاح المتبع في Node هو تعريف وضع تنفيذ التطبيق عبر متغير البيئة <i>NODE\_ENV</i>. في تطبيقنا الحالي، لا نحمّل متغيرات البيئة المعرّفة في ملف <i>.env</i> إلا إذا كان التطبيق <i>ليس</i> في وضع الإنتاج.

من الممارسات الشائعة تعريف أوضاع منفصلة للتطوير والاختبار.

بعد ذلك، لنغيّر السكربتات في ملف <i>package.json</i> لتطبيق الملاحظات، بحيث عندما تُشغَّل الاختبارات تحصل <i>NODE\_ENV</i> على القيمة <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js", // highlight-line
    "dev": "NODE_ENV=development node --watch index.js", // highlight-line
    "test": "NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  }
  // ...
}
```

حدّدنا وضع التطبيق ليكون <i>development</i> في سكربت _npm run dev_. وحدّدنا أيضاً أن الأمر الافتراضي _npm start_ سيعرّف الوضع بأنه <i>production</i>.

هناك مشكلة صغيرة في الطريقة التي حدّدنا بها وضع التطبيق في سكربتاتنا: فهي لن تعمل على Windows. يمكننا تصحيح ذلك بتثبيت حزمة [cross-env](https://www.npmjs.com/package/cross-env) كاعتمادية للمشروع باستخدام الأمر:

```bash
npm install cross-env
```

يمكننا بعد ذلك تحقيق التوافق عبر المنصات باستخدام مكتبة cross-env في سكربتات npm المعرّفة في <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js", // highlight-line
    "dev": "cross-env NODE_ENV=development node --watch index.js", // highlight-line
    "test": "cross-env  NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  },
  // ...
}
```


الآن يمكننا تعديل طريقة عمل تطبيقنا في الأوضاع المختلفة. وكمثال على ذلك، يمكننا تعريف التطبيق ليستخدم قاعدة بيانات اختبار منفصلة عندما يشغّل الاختبارات.

يمكننا إنشاء قاعدة بيانات الاختبار المنفصلة لدينا في MongoDB Atlas. هذا ليس حلاً مثالياً في الحالات التي يطوّر فيها أشخاص كثيرون التطبيق نفسه. فتنفيذ الاختبارات على وجه الخصوص يتطلب عادةً نسخة قاعدة بيانات واحدة لا تستخدمها اختبارات تعمل في الوقت نفسه.

سيكون من الأفضل تشغيل اختباراتنا باستخدام قاعدة بيانات مثبّتة وتعمل على جهاز المطوّر المحلي. الحل الأمثل هو أن يستخدم كل تنفيذ للاختبارات قاعدة بيانات منفصلة. تحقيق ذلك «بسيط نسبياً» عبر [تشغيل Mongo في الذاكرة](https://docs.mongodb.com/manual/core/inmemory/) أو باستخدام حاويات [Docker](https://www.docker.com). لن نعقّد الأمور، وسنواصل بدلاً من ذلك استخدام قاعدة بيانات MongoDB Atlas.

لنجرِ بعض التغييرات على الوحدة التي تعرّف إعدادات التطبيق في _utils/config.js_:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

يحتوي ملف <i>.env</i> على <i>متغيرات منفصلة</i> لعناوين قاعدتي بيانات التطوير والاختبار:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0
// highlight-end
```

تشبه الوحدة _config_ التي نفّذناها قليلاً حزمة [node-config](https://github.com/lorenwest/node-config). كتابة تنفيذنا الخاص مبرَّرة لأن تطبيقنا بسيط، وأيضاً لأنها تعلّمنا دروساً قيّمة.

هذه هي التغييرات الوحيدة التي نحتاج إلى إجرائها على شيفرة تطبيقنا.

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part4-2</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

### supertest

لنستخدم حزمة [supertest](https://github.com/visionmedia/supertest) لمساعدتنا في كتابة اختباراتنا لاختبار واجهة API.

سنثبّت الحزمة كاعتمادية تطوير:

```bash
npm install --save-dev supertest
```

لنكتب اختبارنا الأول في ملف <i>tests/note_api.test.js</i>:

```js
const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
```

يستورد الاختبار تطبيق Express من الوحدة <i>app.js</i> ويلفّه بدالة <i>supertest</i> في كائن يُسمى [superagent](https://github.com/visionmedia/superagent). يُسنَد هذا الكائن إلى المتغير <i>api</i>، ويمكن للاختبارات استخدامه لإرسال طلبات HTTP إلى الواجهة الخلفية.

يرسل اختبارنا طلب HTTP GET إلى عنوان <i>api/notes</i> ويتحقق من أن الطلب يُجاب عليه برمز الحالة 200. كما يتحقق الاختبار من أن ترويسة <i>Content-Type</i> مضبوطة على <i>application/json</i>، ما يشير إلى أن البيانات بالصيغة المطلوبة.

فحص قيمة الترويسة يستخدم صيغة تبدو غريبة بعض الشيء:

```js
.expect('Content-Type', /application\/json/)
```

القيمة المطلوبة معرّفة الآن كـ [تعبير نمطي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) أو regex اختصاراً. يبدأ التعبير النمطي بشرطة مائلة / وينتهي بها، وبما أن النص المطلوب <i>application/json</i> يحتوي أيضاً على الشرطة المائلة نفسها، فقد سُبقت بعلامة \ حتى لا تُفسَّر كمحرف إنهاء للتعبير النمطي.

من حيث المبدأ، كان يمكن أيضاً تعريف الاختبار كنص

```js
.expect('Content-Type', 'application/json')
```

لكن المشكلة هنا هي أنه عند استخدام نص، يجب أن تكون قيمة الترويسة مطابقة تماماً. أما مع التعبير النمطي الذي عرّفناه، فمن المقبول أن <i>تحتوي</i> الترويسة على النص المذكور. القيمة الفعلية للترويسة هي <i>application/json; charset=utf-8</i>، أي أنها تحتوي أيضاً على معلومات حول ترميز المحارف. لكن اختبارنا لا يهمه ذلك، ولذا من الأفضل تعريف الاختبار كتعبير نمطي بدلاً من نص مطابق تماماً.

يحتوي الاختبار على بعض التفاصيل التي سنستكشفها [بعد قليل](/part4/testing_the_backend#async-await). تُسبق دالة السهم التي تعرّف الاختبار بالكلمة المفتاحية <i>async</i>، ويُسبق استدعاء الدالة على الكائن <i>api</i> بالكلمة المفتاحية <i>await</i>. سنكتب بضعة اختبارات ثم نلقي نظرة أقرب على سحر async/await هذا. لا تشغل نفسك بهما الآن، فقط كن مطمئناً إلى أن الاختبارات المثال تعمل بشكل صحيح. ترتبط صيغة async/await بكون إرسال طلب إلى API عملية <i>غير متزامنة</i>. يمكن استخدام صيغة async/await لكتابة شيفرة غير متزامنة بمظهر الشيفرة المتزامنة.

بعد انتهاء تشغيل جميع الاختبارات (يوجد حالياً اختبار واحد فقط) علينا إغلاق اتصال قاعدة البيانات الذي يستخدمه Mongoose. من دون ذلك لن ينتهِ برنامج الاختبار. يمكن تحقيق ذلك بسهولة باستخدام الدالة [after](https://nodejs.org/api/test.html#afterfn-options):

```js
after(async () => {
  await mongoose.connection.close()
})
```

تفصيل صغير لكن مهم: في [بداية](/part4/structure_of_backend_application_introduction_to_testing#project-structure) هذا الجزء استخرجنا تطبيق Express إلى ملف <i>app.js</i>، وتغيّر دور ملف <i>index.js</i> ليصبح تشغيل التطبيق على المنفذ المحدّد عبر _app.listen_:

```js
const app = require('./app') // تطبيق Express الفعلي
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

تستخدم الاختبارات فقط تطبيق Express المعرّف في ملف <i>app.js</i>، وهو لا يستمع إلى أي منافذ:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

تقول وثائق supertest ما يلي:

> <i>إذا لم يكن الخادم يستمع بالفعل للاتصالات، فسيُربَط لك بمنفذ مؤقت، لذا لا حاجة لتتبّع المنافذ.</i>

بعبارة أخرى، يحرص supertest على تشغيل التطبيق قيد الاختبار على المنفذ الذي يستخدمه داخلياً. هذا أحد أسباب اختيارنا supertest بدلاً من شيء مثل axios، إذ لا نحتاج إلى تشغيل نسخة أخرى من الخادم بشكل منفصل قبل بدء الاختبار. والسبب الآخر هو أن supertest يوفر دوال مثل <code>expect()</code>، ما يسهّل الاختبار.

لنضف ملاحظتين إلى قاعدة بيانات الاختبار باستخدام برنامج _mongo.js_ (وهنا يجب أن نتذكر التبديل إلى عنوان قاعدة البيانات الصحيح).

لنكتب بضعة اختبارات إضافية:

```js
const assert = require('node:assert')
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

// ...
```

يخزّن كلا الاختبارين استجابة الطلب في المتغير _response_، وعلى عكس الاختبار السابق الذي استخدم الدوال التي يوفرها _supertest_ للتحقق من رمز الحالة والترويسات، نفحص هذه المرة بيانات الاستجابة المخزّنة في خاصية <i>response.body</i>. تتحقق اختباراتنا من صيغة بيانات الاستجابة ومحتواها باستخدام الدالة [strictEqual](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message) من مكتبة assert.

يمكننا تبسيط الاختبار الثاني قليلاً، واستخدام [assert](https://nodejs.org/docs/latest/api/assert.html#assertokvalue-message) نفسها للتحقق من أن الملاحظة ضمن الملاحظات المُعادة:

```js
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})
```


بدأت فائدة استخدام صيغة async/await تتضح. عادةً سنضطر إلى استخدام دوال الاستدعاء المرتد للوصول إلى البيانات التي تعيدها الوعود (promises)، لكن مع الصيغة الجديدة أصبحت الأمور أكثر راحة بكثير:

```js
const response = await api.get('/api/notes')

// لا يصل التنفيذ إلى هنا إلا بعد اكتمال طلب HTTP
// تُحفظ نتيجة طلب HTTP في المتغير response
assert.strictEqual(response.body.length, 2)
```

يعيق الوسيط الذي يطبع معلومات عن طلبات HTTP مخرجات تنفيذ الاختبارات. لنعدّل logger بحيث لا يطبع إلى الطرفية في وضع الاختبار:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### تهيئة قاعدة البيانات قبل الاختبارات

حالياً، تعاني اختباراتنا من مشكلة أن نجاحها يعتمد على حالة قاعدة البيانات. تنجح الاختبارات إذا صادف أن قاعدة بيانات الاختبار تحتوي على ملاحظتين، إحداهما محتواها <i>'HTML is easy'</i>. لجعلها أكثر متانة، علينا إعادة ضبط قاعدة البيانات وتوليد بيانات الاختبار اللازمة بطريقة مضبوطة قبل تشغيل الاختبارات.

تستخدم اختباراتنا بالفعل الدالة [after](https://nodejs.org/api/test.html#afterfn-options) لإغلاق الاتصال بقاعدة البيانات بعد انتهاء تنفيذ الاختبارات. توفر مكتبة node:test دوال أخرى كثيرة يمكن استخدامها لتنفيذ عمليات مرة واحدة قبل تشغيل أي اختبار أو في كل مرة قبل تشغيل اختبار.

لنهيّئ قاعدة البيانات <i>قبل كل اختبار</i> باستخدام الدالة [beforeEach](https://nodejs.org/api/test.html#beforeeachfn-options):

```js

const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test') // highlight-line
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note') // highlight-line

const api = supertest(app)

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end

// ...
```

تُفرَّغ قاعدة البيانات في البداية، وبعد ذلك نحفظ الملاحظتين المخزّنتين في المصفوفة _initialNotes_ في قاعدة البيانات. بهذا نضمن أن تكون قاعدة البيانات في الحالة نفسها قبل تشغيل كل اختبار.

لنعدّل الاختبار الذي يتحقق من عدد الملاحظات كما يلي:

```js
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length) // highlight-line
})

// ...

```

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part4-3</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### تشغيل الاختبارات واحداً واحداً

ينفّذ الأمر _npm test_ جميع اختبارات التطبيق. عندما نكتب اختبارات، من الحكمة عادةً تنفيذ اختبار واحد أو اثنين فقط.

توجد بضع طرق مختلفة لتحقيق ذلك، إحداها دالة [only](https://nodejs.org/api/test.html#testonlyname-options-fn). بهذه الدالة يمكننا تعريف الاختبارات التي ينبغي تنفيذها في الشيفرة:

```js
test.only('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})
```

عند تشغيل الاختبارات مع الخيار _--test-only_، أي بالأمر:

```
npm test -- --test-only
```

تُنفَّذ فقط الاختبارات المعلَّمة بـ _only_.

خطر _only_ هو أن ينسى المرء إزالتها من الشيفرة.

خيار آخر هو تحديد الاختبارات التي يجب تشغيلها كوسائط للأمر <i>npm test</i>.

الأمر التالي يشغّل فقط الاختبارات الموجودة في ملف <i>tests/note_api.test.js</i>:

```js
npm test -- tests/note_api.test.js
```

يمكن استخدام الخيار [--test-name-pattern](https://nodejs.org/api/test.html#filtering-tests-by-name) لتشغيل اختبارات باسم محدد:

```js
npm test -- --test-name-pattern="a specific note is within the returned notes"
```

يمكن أن تشير الوسيطة المقدَّمة إلى اسم الاختبار أو كتلة describe. ويمكن أن تحتوي أيضاً على جزء من الاسم فقط. الأمر التالي سيشغّل جميع الاختبارات التي يحتوي اسمها على <i>notes</i>:

```js
npm run test -- --test-name-pattern="notes"
```

### async/await

قبل أن نكتب المزيد من الاختبارات، لنلقِ نظرة على الكلمتين المفتاحيتين _async_ و_await_.

صيغة async/await التي قُدِّمت في ES7 تجعل من الممكن استخدام <i>الدوال غير المتزامنة التي تعيد وعداً</i> بطريقة تجعل الشيفرة تبدو متزامنة.

وكمثال، يبدو جلب الملاحظات من قاعدة البيانات باستخدام الوعود هكذا:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

تعيد الدالة _Note.find()_ وعداً، ويمكننا الوصول إلى نتيجة العملية بتسجيل دالة استدعاء مرتد عبر الدالة _then_.

تُكتب كل الشيفرة التي نريد تنفيذها بعد انتهاء العملية في دالة الاستدعاء المرتد. لو أردنا إجراء عدة استدعاءات دوال غير متزامنة بالتتابع، لصارت الحالة مؤلمة بسرعة. سيتعين إجراء الاستدعاءات غير المتزامنة داخل دالة الاستدعاء المرتد. وهذا على الأرجح سيؤدي إلى شيفرة معقّدة وقد يولّد ما يُسمى [جحيم الاستدعاءات المرتدة](https://stackoverflow.com/a/25098230).

عبر [تسلسل الوعود](https://javascript.info/promise-chaining) يمكننا إبقاء الحالة تحت السيطرة نوعاً ما، وتجنّب جحيم الاستدعاءات المرتدة بإنشاء سلسلة نظيفة إلى حد كبير من استدعاءات الدالة _then_. رأينا بعضاً منها خلال الدورة. ولتوضيح ذلك، يمكنك الاطلاع على مثال مصطنع لدالة تجلب جميع الملاحظات ثم تحذف الأولى:

```js
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // مزيد من الشيفرة هنا
  })
```

سلسلة then جيدة، لكن يمكننا فعل أفضل. قدّمت [دوال المولّد](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) التي أُضيفت في ES6 [طريقة ذكية](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) لكتابة شيفرة غير متزامنة بطريقة «تبدو متزامنة». لكن الصيغة ثقيلة بعض الشيء وغير مستخدمة على نطاق واسع.

تأتي الكلمتان المفتاحيتان _async_ و_await_ المقدَّمتان في ES7 بالوظيفة نفسها التي تقدمها دوال المولّد، لكن بطريقة مفهومة وأنظف نحوياً بين يدي جميع أبناء عالم JavaScript.

يمكننا جلب جميع الملاحظات في قاعدة البيانات باستخدام المعامل [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) هكذا:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

تبدو الشيفرة تماماً كالشيفرة المتزامنة. يتوقف تنفيذ الشيفرة عند <em>const notes = await Note.find({})</em> وينتظر حتى يتحقق الوعد <i>fulfilled</i> المرتبط به، ثم يواصل تنفيذه إلى السطر التالي. وعندما يستمر التنفيذ، تُسنَد نتيجة العملية التي أعادت وعداً إلى المتغير _notes_.

المثال المعقّد قليلاً المعروض أعلاه يمكن تنفيذه باستخدام await هكذا:

```js
const notes = await Note.find({})
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

بفضل الصيغة الجديدة، أصبحت الشيفرة أبسط بكثير من سلسلة then السابقة.

هناك بعض التفاصيل المهمة التي يجب الانتباه إليها عند استخدام صيغة async/await. لاستخدام المعامل await مع العمليات غير المتزامنة، يجب أن تعيد وعداً. وهذا ليس مشكلة بحد ذاته، إذ يسهل تغليف الدوال غير المتزامنة العادية التي تستخدم دوال الاستدعاء المرتد بالوعود.

لا يمكن استخدام الكلمة المفتاحية await في أي مكان في شيفرة JavaScript. استخدام await ممكن فقط داخل دالة [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

هذا يعني أنه لكي تعمل الأمثلة السابقة، يجب أن تستخدم دوال async. لاحظ السطر الأول في تعريف دالة السهم:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].deleteOne()
  console.log('the first note is removed')
}

main() // highlight-line
```

تعلن الشيفرة أن الدالة المُسنَدة إلى _main_ غير متزامنة. بعد ذلك، تستدعي الشيفرة الدالة بـ <code>main()</code>.

### async/await في الواجهة الخلفية

لنبدأ بتغيير الواجهة الخلفية إلى async وawait. لنبدأ بالمسار المسؤول عن جلب جميع الملاحظات.

بما أن جميع العمليات غير المتزامنة تُنفَّذ حالياً داخل دالة، يكفي تغيير دوال معالجة المسارات إلى دوال async. المسار الخاص بجلب جميع الملاحظات

```js
notesRouter.get('/', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})
```

يتغيّر إلى ما يلي:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

يمكننا التحقق من نجاح إعادة الهيكلة باختبار نقطة النهاية عبر المتصفح وتشغيل الاختبارات التي كتبناها سابقاً.

### إعادة هيكلة المسار المسؤول عن إضافة ملاحظة

عند إعادة هيكلة الشيفرة، يوجد دائماً خطر [الانحدار](https://en.wikipedia.org/wiki/Regression_testing)، أي أن الوظائف الموجودة قد تتعطل. لنعِد هيكلة العمليات المتبقية بكتابة اختبار لكل مسار من مسارات API أولاً.

لنبدأ بعملية إضافة ملاحظة جديدة. لنكتب اختباراً يضيف ملاحظة جديدة ويتحقق من أن عدد الملاحظات التي تعيدها API يزداد وأن الملاحظة المضافة حديثاً موجودة في القائمة.

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  assert.strictEqual(response.body.length, initialNotes.length + 1)

  assert(contents.includes('async/await simplifies making async calls'))
})
```

يفشل الاختبار لأننا أعدنا بالخطأ رمز الحالة <i>200 OK</i> عند إنشاء ملاحظة جديدة. لنغيّر ذلك إلى رمز الحالة <i>201 CREATED</i>:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

لنكتب أيضاً اختباراً يتحقق من أن ملاحظة بلا محتوى لن تُحفظ في قاعدة البيانات.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length)
})
```

يتحقق كلا الاختبارين من الحالة المخزّنة في قاعدة البيانات بعد عملية الحفظ، عبر جلب جميع ملاحظات التطبيق.

```js
const response = await api.get('/api/notes')
```

ستتكرر خطوات التحقق نفسها في اختبارات أخرى لاحقاً، ومن الجيد استخراج هذه الخطوات في دوال مساعدة. لنضف الدالة إلى ملف جديد باسم <i>tests/test_helper.js</i> يقع في المجلد نفسه الذي يقع فيه ملف الاختبار.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

تعرّف الوحدة الدالة _notesInDb_ التي يمكن استخدامها للتحقق من الملاحظات المخزّنة في قاعدة البيانات. كما توجد في الوحدة المصفوفة _initialNotes_ التي تحتوي على الحالة الأولية لقاعدة البيانات. ونعرّف أيضاً مسبقاً الدالة _nonExistingId_ التي يمكن استخدامها لإنشاء معرّف كائن في قاعدة البيانات لا ينتمي إلى أي كائن ملاحظة فيها.

يمكن لاختباراتنا الآن استخدام الوحدة المساعدة وتُعدَّل هكذا:

```js
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper') // highlight-line
const Note = require('../models/note')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length) // highlight-line
})

after(async () => {
  await mongoose.connection.close()
})
```

تعمل الشيفرة التي تستخدم الوعود وتنجح الاختبارات. نحن جاهزون لإعادة هيكلة شيفرتنا لاستخدام صيغة async/await.

المسار المسؤول عن إضافة ملاحظة جديدة

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch((error) => next(error))
})
```

يتغيّر كما يلي:

```js
notesRouter.post('/', async (request, response) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // highlight-start
  const savedNote = await note.save()
  response.status(201).json(savedNote)
  // highlight-end
})
```

تحتاج إلى إضافة الكلمة المفتاحية _async_ في بداية المعالج لتمكين استخدام صيغة _async/await_. تصبح الشيفرة أبسط بكثير.

والجدير بالذكر أن الأخطاء المحتملة لم تعد بحاجة إلى تمريرها بشكل منفصل للمعالجة. في الشيفرة التي تستخدم الوعود، كان الخطأ المحتمل يُمرَّر إلى الوسيط المسؤول عن معالجة الأخطاء هكذا:

```js
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error)) // highlight-line
```

عند استخدام صيغة _async/await_، سيستدعي Express [تلقائياً](https://expressjs.com/en/guide/error-handling.html) الوسيط المسؤول عن معالجة الأخطاء إذا رمى عبارة await خطأً أو رُفض الوعد المنتظر. هذا يجعل الشيفرة النهائية أنظف.

**ملاحظة:** هذه الميزة متاحة بدءاً من الإصدار 5 من Express. إذا ثبّتت Express كاعتمادية قبل 31 مارس 2025، فقد تكون ما زلت تستخدم الإصدار 4. يمكنك التحقق من إصدار Express في مشروعك من ملف _package.json_. إذا كان لديك إصدار أقدم، حدّثه إلى الإصدار 5 بالأمر التالي:

 ```bash
 npm install express@5 
 ```

### إعادة هيكلة المسار المسؤول عن جلب ملاحظة واحدة

بعد ذلك، لنكتب اختباراً لعرض تفاصيل ملاحظة واحدة. تُبرز الشيفرة عملية API الفعلية التي تُنفَّذ:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  assert.deepStrictEqual(resultNote.body, noteToView)
})
```

أولاً، يجلب الاختبار ملاحظة واحدة من قاعدة البيانات. ثم يتحقق من إمكانية استرجاع تلك الملاحظة المحددة عبر API. وأخيراً، يتحقق من أن محتوى الملاحظة المجلوبة كما هو متوقع.

هناك نقطة جديرة بالملاحظة في الاختبار. فبدلاً من الدالة [strictEqual](https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message) المستخدمة سابقاً، تُستخدم الدالة [deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message):

```js
assert.deepStrictEqual(resultNote.body, noteToView)
```

السبب هو أن _strictEqual_ تستخدم الدالة [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) لمقارنة التشابه، أي أنها تقارن ما إذا كان الكائنان نفسيهما. في حالتنا، نريد التحقق من أن محتويات الكائنات، أي قيم حقولها، متماثلة. ولهذا الغرض تصلح _deepStrictEqual_.

تنجح الاختبارات ويمكننا بأمان إعادة هيكلة المسار المُختبَر لاستخدام async/await:

```js
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

### إعادة هيكلة المسار المسؤول عن حذف ملاحظة

لنضف أيضاً اختباراً للمسار الذي يتعامل مع حذف ملاحظة:

```js
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const ids = notesAtEnd.map(n => n.id)
  assert(!ids.includes(noteToDelete.id))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})
```

بُني الاختبار بشكل مشابه للاختبار الذي يتحقق من عرض ملاحظة واحدة. أولاً، تُجلب ملاحظة واحدة من قاعدة البيانات، ثم يُختبَر حذفها عبر API. وأخيراً، يُتحقق من أن الملاحظة لم تعد موجودة في قاعدة البيانات وأن العدد الإجمالي للملاحظات انخفض بمقدار واحد.

ما زالت الاختبارات تنجح، لذا يمكننا المضي بأمان في إعادة هيكلة المسار:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part4-4</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### تحسين دالة beforeEach

لنعُد إلى كتابة اختباراتنا ونلقِ نظرة أقرب على الدالة _beforeEach_ التي تهيّئ الاختبارات:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

تحفظ الدالة أول ملاحظتين من المصفوفة _helper.initialNotes_ في قاعدة البيانات بعمليتين منفصلتين. الحل مقبول، لكن توجد طريقة أفضل لحفظ عدة كائنات في قاعدة البيانات:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

نحفظ الملاحظات المخزّنة في المصفوفة في قاعدة البيانات داخل حلقة _forEach_. لكن الاختبارات لا تبدو تعمل تماماً، لذا أضفنا بعض سجلات الطرفية لمساعدتنا في إيجاد المشكلة.

تعرض الطرفية المخرجات التالية:

```
cleared
done
entered test
saved
saved
```

رغم استخدامنا صيغة async/await، لا يعمل حلّنا كما توقعنا. يبدأ تنفيذ الاختبار قبل تهيئة قاعدة البيانات!

المشكلة هي أن كل تكرار في حلقة _forEach_ يولّد عمليته غير المتزامنة الخاصة، ولا تنتظر الدالة _beforeEach_ اكتمالها. بعبارة أخرى، أوامر await داخل حلقة _forEach_ ليست جزءاً من الدالة _beforeEach_ بل تقع في دوال منفصلة لا تنتظرها _beforeEach_. إضافة إلى ذلك، [تتوقع الدالة _forEach_ دالة متزامنة كوسيط لها](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description)، لذا لا تعمل بنية _async/await_ بشكل صحيح داخلها.

وبما أن تنفيذ الاختبارات يبدأ فور انتهاء تنفيذ _beforeEach_، فإن تنفيذ الاختبارات يبدأ قبل تهيئة حالة قاعدة البيانات.

إحدى طرق إصلاح ذلك هي انتظار انتهاء تنفيذ جميع العمليات غير المتزامنة باستخدام الدالة [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

الحل متقدّم نوعاً ما رغم مظهره المتراص. يُسنَد المتغير _noteObjects_ إلى مصفوفة من كائنات Mongoose المُنشأة بالباني _Note_ لكل ملاحظة من ملاحظات المصفوفة _helper.initialNotes_. وينشئ السطر التالي من الشيفرة مصفوفة جديدة <i>تتكوّن من وعود</i>، تُنشأ باستدعاء الدالة _save_ لكل عنصر في المصفوفة _noteObjects_. بعبارة أخرى، إنها مصفوفة وعود لحفظ كل عنصر في قاعدة البيانات.

يمكن استخدام الدالة [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) لتحويل مصفوفة وعود إلى وعد واحد يتحقق <i>fulfilled</i> بمجرد أن يُحَلّ كل وعد في المصفوفة الممرَّرة إليها كوسيطة. ينتظر السطر الأخير من الشيفرة <em>await Promise.all(promiseArray)</em> حتى ينتهي كل وعد لحفظ ملاحظة، أي أن قاعدة البيانات قد هُيّئت.

> لا يزال من الممكن الوصول إلى القيم المُعادة لكل وعد في المصفوفة عند استخدام الدالة Promise.all. فإذا انتظرنا حلّ الوعود بصيغة _await_ <em>const results = await Promise.all(promiseArray)</em>، ستعيد العملية مصفوفة تحتوي على القيم المحلولة لكل وعد في _promiseArray_، وتظهر بالترتيب نفسه الذي تظهر به الوعود في المصفوفة.

ينتظر `Promise.all` الوعود التي يتلقاها حتى تُحسم جميعها في الوقت نفسه. وإذا احتاجت العمليات إلى الحدوث بترتيب معين، فسيكون ذلك مشكلة. في حالات كهذه، يمكن تنفيذ العمليات في [حلقة for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) باستخدام المعامل `await`، ما يضمن اكتمال كل عملية قبل بدء التالية.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of helper.initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})
```

قد تؤدي الطبيعة غير المتزامنة لـ JavaScript إلى سلوك مفاجئ، ولهذا السبب من المهم الانتباه جيداً عند استخدام صيغة async/await. فرغم أن الصيغة تسهّل التعامل مع الوعود، فإنه ما زال ضرورياً فهم كيفية عمل الوعود!

لكن توجد طريقة أبسط لتنفيذ الدالة _beforeEach_. أسهل طريقة للتعامل مع الحالة هي استخدام دالة Mongoose المدمجة _insertMany_:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes) // highlight-line
})
```

يمكن العثور على شيفرة تطبيقنا على [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5)، فرع <i>part4-5</i>.

### قسم مطوّر full stack الحقيقي

تضيف كتابة الاختبارات طبقة أخرى من التحدي إلى البرمجة. علينا تحديث قسم مطوّر full stack لتذكيرك بأن المنهجية أساسية أيضاً عند تطوير الاختبارات.

لذا ينبغي أن نوسّع قسمنا مرة أخرى:

تطوير full stack <i>صعب للغاية</i>، ولهذا سأستخدم كل الوسائل الممكنة لتسهيله

- سأبقي طرفية مطوّر المتصفح مفتوحة طوال الوقت
- سأستخدم تبويب الشبكة في أدوات مطوّر المتصفح للتأكد من أن الواجهة الأمامية والواجهة الخلفية تتواصلان كما أتوقع
- سأراقب باستمرار حالة الخادم للتأكد من أن البيانات التي ترسلها الواجهة الأمامية إليه تُحفظ كما أتوقع
- سأراقب قاعدة البيانات: هل تحفظ الواجهة الخلفية البيانات فيها بالصيغة الصحيحة
- سأتقدم بخطوات صغيرة
- <i>سأكتب الكثير من عبارات _console.log_ للتأكد من فهمي كيفية تصرف الشيفرة والاختبارات وللمساعدة في تحديد المشكلات</i>
- إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل سأبدأ بحذف الشيفرة حتى تعمل أو أعود ببساطة إلى حالة كان فيها كل شيء ما زال يعمل
- <i>إذا لم ينجح اختبار، أتأكد من أن الوظيفة المُختبَرة تعمل بالتأكيد في التطبيق</i>
- عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في مكان آخر، أصوغ أسئلتي بشكل صحيح، انظر [كيفية طلب المساعدة](/part0/general_info#how-to-get-help-in-discord)

</div>

<div class="tasks">

### تمارين 4.8.-4.12.

**تحذير:** إذا وجدت نفسك تستخدم async/await ودوال <i>then</i> في الشيفرة نفسها، فمن شبه المؤكد أنك تفعل شيئاً خاطئاً. استخدم أحدهما دون الآخر ولا تخلط بينهما.

#### 4.8: اختبارات قائمة المدونات، الخطوة 1

استخدم مكتبة SuperTest لكتابة اختبار يرسل طلب HTTP GET إلى عنوان <i>/api/blogs</i>. تحقق من أن تطبيق قائمة المدونات يعيد العدد الصحيح من منشورات المدونات بصيغة JSON.

بعد الانتهاء من الاختبار، أعد هيكلة معالج المسار ليستخدم صيغة async/await بدلاً من الوعود.

لاحظ أنه سيتعين عليك إجراء تغييرات مشابهة على الشيفرة كتلك التي أُجريت [في المادة](/part4/testing_the_backend#test-environment)، مثل تعريف بيئة الاختبار حتى تتمكن من كتابة اختبارات تستخدم قواعد بيانات منفصلة.

**ملاحظة:** عندما تكتب اختباراتك **<i>من الأفضل ألا تنفّذها كلها</i>**، نفّذ فقط التي تعمل عليها. اقرأ المزيد عن هذا [هنا](/part4/testing_the_backend#running-tests-one-by-one).

#### 4.9: اختبارات قائمة المدونات، الخطوة 2

اكتب اختباراً يتحقق من أن خاصية المعرّف الفريد لمنشورات المدونات اسمها <i>id</i>، إذ تسمّي قاعدة البيانات الخاصية <i>_id</i> افتراضياً.

أجرِ التغييرات المطلوبة على الشيفرة حتى ينجح الاختبار. الدالة [toJSON](/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) التي نوقشت في الجزء 3 مكان مناسب لتعريف الوسيط <i>id</i>.

#### 4.10: اختبارات قائمة المدونات، الخطوة 3

اكتب اختباراً يتحقق من أن إرسال طلب HTTP POST إلى عنوان <i>/api/blogs</i> ينشئ بنجاح منشور مدونة جديداً. على الأقل، تحقق من أن العدد الإجمالي للمدونات في النظام يزداد بمقدار واحد. ويمكنك أيضاً التحقق من أن محتوى منشور المدونة يُحفظ بشكل صحيح في قاعدة البيانات.

بعد الانتهاء من الاختبار، أعد هيكلة العملية لتستخدم async/await بدلاً من الوعود.

#### 4.11*: اختبارات قائمة المدونات، الخطوة 4

اكتب اختباراً يتحقق من أنه إذا كانت خاصية <i>likes</i> مفقودة من الطلب، فستكون قيمتها الافتراضية 0. لا تختبر الخصائص الأخرى للمدونات المُنشأة بعد.

أجرِ التغييرات المطلوبة على الشيفرة حتى ينجح الاختبار.

#### 4.12*: اختبارات قائمة المدونات، الخطوة 5

اكتب اختبارات متعلقة بإنشاء مدونات جديدة عبر نقطة النهاية <i>/api/blogs</i>، تتحقق من أنه إذا كانت خاصيتا <i>title</i> أو <i>url</i> مفقودتين من بيانات الطلب، تستجيب الواجهة الخلفية للطلب برمز الحالة <i>400 Bad Request</i>.

أجرِ التغييرات المطلوبة على الشيفرة حتى ينجح الاختبار.

</div>

<div class="content">

### إعادة هيكلة الاختبارات

تغطية اختباراتنا ناقصة حالياً. بعض الطلبات مثل <i>GET /api/notes/:id</i> و<i>DELETE /api/notes/:id</i> لا تُختبر عندما يُرسَل الطلب بمعرّف غير صالح. كما يمكن تحسين تجميع الاختبارات وتنظيمها، إذ توجد جميع الاختبارات على «المستوى الأعلى» نفسه في ملف الاختبار. ستتحسن قابلية قراءة الاختبار إذا جمّعنا الاختبارات المرتبطة في كتل <i>describe</i>.

فيما يلي مثال على ملف الاختبار بعد إجراء بعض التحسينات الصغيرة:

```js
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/notes/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      const ids = notesAtEnd.map(n => n.id)
      assert(!ids.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
```

تُجمَّع مخرجات الاختبار في الطرفية وفقاً لكتل <i>describe</i>:

![مخرجات node:test تُظهر كتل describe المجمّعة](../../images/4/7new.webp)

ما زال هناك مجال للتحسين، لكن حان وقت المضي قدماً.

هذه الطريقة في اختبار API، عبر إرسال طلبات HTTP وفحص قاعدة البيانات باستخدام Mongoose، ليست بأي حال الطريقة الوحيدة ولا الأفضل لإجراء اختبارات تكامل على مستوى API لتطبيقات الخوادم. لا توجد طريقة مثلى شاملة لكتابة الاختبارات، فكل شيء يعتمد على التطبيق قيد الاختبار والموارد المتاحة.

يمكنك العثور على شيفرة تطبيقنا الحالي كاملةً في فرع <i>part4-6</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### تمارين 4.13.-4.14.

#### 4.13 توسيع قائمة المدونات، الخطوة 1

نفّذ وظيفة حذف مورد منشور مدونة واحد.

استخدم صيغة async/await. اتبع اصطلاحات [RESTful](/part3/node_js_and_express#rest) عند تعريف واجهة HTTP API.

نفّذ اختبارات للوظيفة.

#### 4.14 توسيع قائمة المدونات، الخطوة 2

نفّذ وظيفة تحديث معلومات منشور مدونة فردي.

استخدم async/await.

يحتاج التطبيق غالباً إلى تحديث عدد <i>likes</i> لمنشور مدونة. يمكنك تنفيذ هذه الوظيفة بالطريقة نفسها التي نفّذنا بها تحديث الملاحظات في [الجزء 3](/part3/saving_data_to_mongo_db#other-operations).

نفّذ اختبارات للوظيفة.

</div>
