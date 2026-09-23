---
mainImage: /images/part-4.svg
part: 4
letter: a
lang: ar
---

<div class="content">

لنواصل عملنا على الواجهة الخلفية لتطبيق الملاحظات الذي بدأناه في [الجزء 3](/part3).

### بنية المشروع

**ملاحظة**: كُتبت مادة هذا المقرر باستخدام الإصدار v22.3.0 من Node.js. تأكد من أن إصدار Node لديك حديث على الأقل بقدر الإصدار المستخدم في المادة (يمكنك التحقق من الإصدار بتشغيل _node -v_ في سطر الأوامر).

قبل أن ننتقل إلى موضوع الاختبار، سنعدّل بنية مشروعنا ليلتزم بأفضل ممارسات Node.js.

بعد إجراء التغييرات على بنية مجلدات مشروعنا، سننتهي بالبنية التالية:

```bash
├── controllers
│   └── notes.js
├── dist
│   └── ...
├── models
│   └── note.js
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
├── app.js
├── index.js
├── package-lock.json
├── package.json
```

حتى الآن كنا نستخدم <i>console.log</i> و<i>console.error</i> لطباعة معلومات مختلفة من الشيفرة.
لكن هذه ليست طريقة جيدة جداً لفعل الأشياء.
لنفصل كل الطباعة إلى وحدة التحكم في وحدتها الخاصة <i>utils/logger.js</i>:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }
```

يحتوي المسجِّل على دالتين، __info__ لطباعة رسائل السجل العادية، و__error__ لجميع رسائل الأخطاء.

استخراج التسجيل إلى وحدته الخاصة فكرة جيدة من عدة نواحٍ. لو أردنا البدء بكتابة السجلات في ملف أو إرسالها إلى خدمة تسجيل خارجية مثل [graylog](https://www.graylog.org/) أو [papertrail](https://papertrailapp.com) لما كان علينا سوى إجراء التغييرات في مكان واحد.

نُقلت معالجة متغيرات البيئة إلى ملف منفصل <i>utils/config.js</i>:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }
```

يمكن لأجزاء التطبيق الأخرى الوصول إلى متغيرات البيئة باستيراد وحدة الإعدادات:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

نُقلت معالجات المسارات أيضاً إلى وحدة مخصصة. يُشار عادةً إلى معالجات أحداث المسارات باسم <i>controllers</i>، ولهذا السبب أنشأنا مجلد <i>controllers</i> جديداً. جميع المسارات المتعلقة بالملاحظات موجودة الآن في وحدة <i>notes.js</i> داخل مجلد <i>controllers</i>.

محتويات وحدة <i>notes.js</i> هي التالية:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

هذا نسخ ولصق شبه حرفي لملف <i>index.js</i> السابق لدينا.

لكن هناك بعض التغييرات المهمة. في بداية الملف تماماً ننشئ كائن [موجّه](http://expressjs.com/en/api.html#router) (router) جديداً:

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

تصدّر الوحدة الموجّه ليكون متاحاً لجميع مستهلكي الوحدة.

تُعرَّف جميع المسارات الآن لكائن الموجّه، على غرار ما كان يُفعل سابقاً مع الكائن الذي يمثل التطبيق بأكمله.

تجدر الإشارة إلى أن المسارات في معالجات المسارات قد اختُصرت. في النسخة السابقة، كان لدينا:

```js
app.delete('/api/notes/:id', (request, response, next) => {
```

وفي النسخة الحالية، لدينا:

```js
notesRouter.delete('/:id', (request, response, next) => {
```

إذن ما هي كائنات الموجّه هذه بالضبط؟ يقدم دليل Express التفسير التالي:

> <i>كائن الموجّه هو نسخة معزولة من الوسيط والمسارات. يمكنك التفكير فيه كـ«تطبيق مصغّر»، قادر فقط على أداء وظائف الوسيط والتوجيه. كل تطبيق Express لديه موجّه تطبيق مدمج.</i>

الموجّه في الواقع <i>وسيط</i> (middleware)، يمكن استخدامه لتعريف «المسارات المرتبطة» في مكان واحد، ويوضع عادةً في وحدته الخاصة.

ملف <i>app.js</i> الذي ينشئ التطبيق الفعلي يستخدم الموجّه كما هو موضح أدناه:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

يُستخدم الموجّه الذي عرّفناه سابقاً <i>إذا</i> بدأ عنوان URL للطلب بـ <i>/api/notes</i>. لهذا السبب، يجب أن يعرّف كائن notesRouter الأجزاء النسبية من المسارات فقط، أي المسار الفارغ <i>/</i> أو المعامل <i>/:id</i> فقط.

أُنشئ ملف يعرّف التطبيق، <i>app.js</i>، في جذر المستودع:

```js
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

يستخدم الملف وسائط مختلفة، وأحدها <i>notesRouter</i> المرتبط بالمسار <i>/api/notes</i>.

نُقل الوسيط المخصص لدينا إلى وحدة جديدة <i>utils/middleware.js</i>:

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

أُسندت مسؤولية إنشاء الاتصال بقاعدة البيانات إلى وحدة <i>app.js</i>. ملف <i>note.js</i> داخل مجلد <i>models</i> يعرّف فقط مخطط Mongoose للملاحظات.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

تُبسَّط محتويات ملف <i>index.js</i> المستخدم لتشغيل التطبيق كما يلي:

```js
const app = require('./app') // تطبيق Express الفعلي
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

يستورد ملف <i>index.js</i> التطبيق الفعلي فقط من ملف <i>app.js</i> ثم يشغّل التطبيق. تُستخدم دالة _info_ في وحدة المسجِّل للطباعة في وحدة التحكم التي تخبر بأن التطبيق يعمل.

الآن أصبح تطبيق Express والشيفرة التي تعتني بخادم الويب منفصلين عن بعضهما باتباع [أفضل](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) الممارسات. إحدى مزايا هذه الطريقة أن التطبيق يمكن اختباره الآن على مستوى استدعاءات HTTP API دون إجراء استدعاءات فعلياً عبر HTTP على الشبكة، وهذا يجعل تنفيذ الاختبارات أسرع.

باختصار، تبدو بنية المجلدات هكذا بعد إجراء التغييرات:

```bash
├── controllers
│   └── notes.js
├── dist
│   └── ...
├── models
│   └── note.js
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
├── app.js
├── index.js
├── package-lock.json
├── package.json
```

بالنسبة للتطبيقات الأصغر، لا تهم البنية كثيراً. عندما يبدأ التطبيق بالنمو في الحجم، سيتعين عليك إنشاء نوع من البنية وفصل مسؤوليات التطبيق المختلفة في وحدات منفصلة. سيجعل هذا تطوير التطبيق أسهل بكثير.

لا توجد بنية مجلدات صارمة أو اصطلاح تسمية ملفات مطلوب لتطبيقات Express. في المقابل، يتطلب Ruby on Rails بنية محددة. بنيتنا الحالية تتبع ببساطة بعض أفضل الممارسات التي قد تصادفها على الإنترنت.

يمكنك العثور على شيفرة تطبيقنا الحالي كاملة في فرع <i>part4-1</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).

إذا استنسخت المشروع لنفسك، شغّل الأمر _npm install_ قبل تشغيل التطبيق بـ _npm run dev_.

### ملاحظة عن التصدير

استخدمنا نوعين مختلفين من التصدير في هذا الجزء. أولاً، مثلاً، يقوم ملف <i>utils/logger.js</i> بالتصدير كما يلي:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error } // highlight-line
```

يصدّر الملف <i>كائناً</i> له حقلان، وكلاهما دالتان. يمكن استخدام الدالتين بطريقتين مختلفتين. الخيار الأول هو طلب الكائن بأكمله والإشارة إلى الدوال عبر الكائن باستخدام الترميز النقطي:

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```

الخيار الآخر هو تفكيك الدوال إلى متغيراتها الخاصة في عبارة <i>require</i>:

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

قد تكون طريقة التصدير الثانية مفضلة إذا كان جزء صغير فقط من الدوال المصدَّرة يُستخدم في ملف.

لكن في بعض الحالات، يُصدَّر «شيء» واحد فقط. على سبيل المثال، يصدّر <i>controller/notes.js</i> «شيئاً» واحداً هكذا:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter // highlight-line
```

لأن «شيئاً» واحداً فقط يُصدَّر، يمكن استيراده واستخدامه فقط ككائن واحد:

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

الآن، يُسند «الشيء» المصدَّر (في هذه الحالة، كائن موجّه) إلى متغير _notesRouter_ ويُستخدم ككائن واحد.

#### إيجاد استخدامات صادراتك باستخدام VS Code

يمتلك VS Code ميزة عملية تتيح لك رؤية أين صُدِّرت وحداتك. يمكن أن يكون هذا مفيداً جداً لإعادة الهيكلة. على سبيل المثال، إذا قررت تقسيم دالة إلى دالتين منفصلتين، فقد تتعطل شيفرتك إذا لم تعدّل جميع الاستخدامات. يصعب ذلك إذا كنت لا تعرف أين توجد. لكن عليك تعريف صادراتك بطريقة معينة ليعمل هذا.

إذا نقرت بزر الفأرة الأيمن على متغير في الموضع الذي صُدِّر منه واخترت «Find All References»، فسيعرض لك كل مكان يُستورد فيه المتغير. لكن إذا أسندت كائناً مباشرةً إلى module.exports، فلن يعمل ذلك. الحل البديل هو إسناد الكائن الذي تريد تصديره إلى متغير مسمّى ثم تصدير المتغير المسمّى. لن يعمل أيضاً إذا فككت عند الاستيراد؛ عليك استيراد المتغير المسمّى ثم التفكيك، أو استخدام الترميز النقطي فقط لاستخدام الدوال الموجودة في المتغير المسمّى.

تأثير طبيعة VS Code على طريقة كتابتك للشيفرة ليس مثالياً على الأرجح، لذا عليك أن تقرر بنفسك إن كانت المقايضة تستحق العناء.

</div>

<div class="tasks">

### تمارين 4.1.-4.2.

**ملاحظة**: كُتبت مادة هذا المقرر باستخدام الإصدار v22.3.0 من Node.js. تأكد من أن إصدار Node لديك حديث على الأقل بقدر الإصدار المستخدم في المادة (يمكنك التحقق من الإصدار بتشغيل _node -v_ في سطر الأوامر).

في تمارين هذا الجزء، سنبني <i>تطبيق قائمة المدونات</i>، يتيح للمستخدمين حفظ معلومات عن مدونات مثيرة للاهتمام صادفوها على الإنترنت. لكل مدونة مدرجة سنحفظ المؤلف والعنوان وURL وعدد التصويتات الإيجابية (upvotes) من مستخدمي التطبيق.

#### 4.1 قائمة المدونات، الخطوة 1

لنتخيل موقفاً تستقبل فيه بريداً إلكترونياً يحتوي على جسم التطبيق والتعليمات التالية:

```js
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

حوّل التطبيق إلى مشروع <i>npm</i> فعّال. للحفاظ على إنتاجية تطويرك، اضبط التطبيق ليُنفَّذ بـ <i>node --watch</i>. يمكنك إنشاء قاعدة بيانات جديدة لتطبيقك باستخدام MongoDB Atlas، أو استخدام قاعدة البيانات نفسها من تمارين الجزء السابق.

تحقق من إمكانية إضافة مدونات إلى القائمة باستخدام Postman أو عميل REST في VS Code، ومن أن التطبيق يعيد المدونات المضافة عند نقطة النهاية الصحيحة.

#### 4.2 قائمة المدونات، الخطوة 2

أعد هيكلة التطبيق إلى وحدات منفصلة كما هو موضح سابقاً في هذا الجزء من مادة المقرر.

**ملاحظة** أعد هيكلة تطبيقك بخطوات صغيرة وتحقق من أنه يعمل بعد كل تغيير تجريه. إذا حاولت أخذ «طريق مختصر» بإعادة هيكلة أشياء كثيرة دفعة واحدة، فسيدخل [قانون مورفي](https://en.wikipedia.org/wiki/Murphy%27s_law) حيز التنفيذ ويكاد يكون مؤكداً أن شيئاً ما سيتعطل في تطبيقك. سينتهي «الطريق المختصر» بمستغرق وقت أطول من التقدم ببطء وبمنهجية.

من أفضل الممارسات أن تعمل commit لشيفرتك كلما كانت في حالة مستقرة. يسهّل هذا الرجوع إلى حالة كان التطبيق فيها ما يزال يعمل.

إذا واجهت مشكلات مع كون <i>content.body</i> قيمته <i>undefined</i> بلا سبب ظاهر، فتأكد من أنك لم تنسَ إضافة <i>app.use(express.json())</i> قرب أعلى الملف.

</div>

<div class="content">

### اختبار تطبيقات Node

أهملنا تماماً مجالاً أساسياً من تطوير البرمجيات، ألا وهو الاختبار الآلي.

لنبدأ رحلتنا في الاختبار بالنظر إلى اختبارات الوحدة. منطق تطبيقنا بسيط جداً لدرجة أنه لا يوجد الكثير مما يستحق اختباره باختبارات الوحدة. لننشئ ملفاً جديداً <i>utils/for_testing.js</i> ونكتب دالتين بسيطتين يمكننا استخدامهما للتدرب على كتابة الاختبارات:

```js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

> تستخدم دالة _average_ طريقة [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) الخاصة بالمصفوفات. إذا لم تكن الطريقة مألوفة لك بعد، فهذا وقت مناسب لمشاهدة الفيديوهات الثلاثة الأولى من سلسلة [Functional JavaScript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) على YouTube.

يتوفر عدد كبير من مكتبات الاختبار، أو <i>مشغّلات الاختبار</i>، لـ JavaScript.
ملك مكتبات الاختبار القديم هو [Mocha](https://mochajs.org/)، الذي حلّ محله قبل بضع سنوات [Jest](https://jestjs.io/). ومن الوافدين الجدد إلى المكتبات [Vitest](https://vitest.dev/)، الذي يقدّم نفسه كجيل جديد من مكتبات الاختبار.

في الوقت الحاضر، لدى Node أيضاً مكتبة اختبار مدمجة [node:test](https://nodejs.org/docs/latest/api/test.html)، وهي مناسبة تماماً لاحتياجات المقرر.


لنعرّف <i>سكربت npm باسم _test_</i> لتنفيذ الاختبارات:

```js
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node --test", // highlight-line
    "lint": "eslint ."
  },
  // ...
}
```


لننشئ مجلداً منفصلاً لاختباراتنا باسم <i>tests</i> وننشئ ملفاً جديداً باسم <i>reverse.test.js</i> بالمحتويات التالية:

```js
const { test } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})
```

يُعرِّف الاختبار الكلمة المفتاحية _test_ والمكتبة [assert](https://nodejs.org/docs/latest/api/assert.html)، التي تستخدمها الاختبارات للتحقق من نتائج الدوال قيد الاختبار.

في السطر التالي، يستورد ملف الاختبار الدالة المطلوب اختبارها ويسندها إلى متغير اسمه _reverse_:

```js
const reverse = require('../utils/for_testing').reverse
```

تُعرَّف حالات الاختبار الفردية بدالة _test_. الوسيط الأول للدالة هو وصف الاختبار كنص. الوسيط الثاني هو <i>دالة</i> تعرّف الوظيفة الخاصة بحالة الاختبار. تبدو وظيفة حالة الاختبار الثانية هكذا:

```js
() => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
}
```

أولاً، ننفذ الشيفرة المطلوب اختبارها، أي نولّد عكس النص <i>react</i>. بعد ذلك، نتحقق من النتائج بالطريقة [strictEqual](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message) من مكتبة [assert](https://nodejs.org/docs/latest/api/assert.html).

كما هو متوقع، تنجح جميع الاختبارات:

![مخرجات الطرفية من npm test مع نجاح جميع الاختبارات](../../images/4/1new.webp)

في المقرر، نتبع الاصطلاح الذي تنتهي فيه أسماء ملفات الاختبار بـ <i>.test.js</i>، لأن مكتبة الاختبار <i>node:test</i> تنفذ تلقائياً ملفات الاختبار المسماة بهذه الطريقة.

لنُعطّل الاختبار:

```js
test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tkaer')
})
```

يؤدي تشغيل هذا الاختبار إلى رسالة الخطأ التالية:

![مخرجات الطرفية تُظهر فشلاً من npm test](../../images/4/2new.webp)

لنضف بعض الاختبارات لدالة average أيضاً. لننشئ ملفاً جديداً <i>tests/average.test.js</i> ونضف إليه المحتوى التالي:

```js
const { test, describe } = require('node:test')
const assert = require('node:assert')

const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})
```

يكشف الاختبار أن الدالة لا تعمل بشكل صحيح مع مصفوفة فارغة (السبب أن القسمة على صفر في JavaScript تنتج <i>NaN</i>):

![مخرجات الطرفية تُظهر فشل المصفوفة الفارغة](../../images/4/3new.webp)

إصلاح الدالة سهل جداً:

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```

إذا كان طول المصفوفة 0 فإننا نعيد 0، وفي جميع الحالات الأخرى نستخدم طريقة _reduce_ لحساب المتوسط.

هناك بعض الأمور التي تجدر ملاحظتها بشأن الاختبارات التي كتبناها للتو. عرّفنا كتلة <i>describe</i> حول الاختبارات التي أُعطي لها الاسم _average_:

```js
describe('average', () => {
  // الاختبارات
})
```

يمكن استخدام كتل describe لتجميع الاختبارات في مجموعات منطقية. يستخدم مخرج الاختبار أيضاً اسم كتلة describe:

![لقطة شاشة لـ npm test تُظهر كتل describe](../../images/4/4new.webp)

كما سنرى لاحقاً، تكون كتل <i>describe</i> ضرورية عندما نريد تنفيذ بعض عمليات الإعداد أو التفكيك المشتركة لمجموعة من الاختبارات.

أمر آخر جدير بالملاحظة أننا كتبنا الاختبارات بطريقة مختصرة جداً، دون إسناد مخرجات الدالة قيد الاختبار إلى متغير:

```js
test('of empty array is zero', () => {
  assert.strictEqual(average([]), 0)
})
```

</div>

<div class="tasks">

### تمارين 4.3.-4.7.

لننشئ مجموعة من الدوال المساعدة الأنسب للعمل مع أقسام describe في قائمة المدونات. أنشئ الدوال في ملف باسم <i>utils/list_helper.js</i>. اكتب اختباراتك في ملف اختبار باسم مناسب داخل مجلد <i>tests</i>.

#### 4.3: الدوال المساعدة واختبارات الوحدة، الخطوة 1

أولاً، عرّف دالة _dummy_ تستقبل مصفوفة من منشورات المدونات كوسيط وتعيد دائماً القيمة 1. يجب أن تكون محتويات ملف <i>list_helper.js</i> في هذه المرحلة كما يلي:

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

تحقق من أن إعداد الاختبار لديك يعمل بالاختبار التالي:

```js
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
```

#### 4.4: الدوال المساعدة واختبارات الوحدة، الخطوة 2

عرّف دالة جديدة _totalLikes_ تستقبل قائمة من منشورات المدونات كوسيط. تعيد الدالة المجموع الكلي لـ <i>likes</i> في جميع منشورات المدونات.

اكتب اختبارات مناسبة للدالة. يُوصى بوضع الاختبارات داخل كتلة <i>describe</i> ليُجمَّع مخرج تقرير الاختبار بشكل مرتب:

![نجاح npm test من أجل list_helper_test](../../images/4/5.webp)

يمكن تعريف مدخلات الاختبار للدالة هكذا:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})
```

إذا كان تعريف قائمة مدخلات اختبار خاصة بك من المدونات جهداً كبيراً، يمكنك استخدام القائمة الجاهزة [هنا](https://github.com/fullstack-hy2020/misc/blob/master/blogs_for_test.md).

لا بد أن تواجه مشكلات أثناء كتابة الاختبارات. تذكّر الأمور التي تعلمناها عن [تصحيح الأخطاء](/part3/saving_data_to_mongo_db#debugging-node-applications) في الجزء 3. يمكنك طباعة الأشياء إلى وحدة التحكم بـ _console.log_ حتى أثناء تنفيذ الاختبارات.

#### 4.5*: الدوال المساعدة واختبارات الوحدة، الخطوة 3

عرّف دالة جديدة _favoriteBlog_ تستقبل قائمة مدونات كوسيط. تعيد الدالة المدونة الأكثر إعجابات. إذا كانت هناك مدونات مفضلة متعددة، يكفي أن تعيد الدالة أياً منها.

**ملاحظة** عندما تقارن كائنات، فالأرجح أن الطريقة [deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message) هي ما تريد استخدامه، لأنها تضمن أن الكائنات لها الخصائص نفسها. للاطلاع على الفروق بين دوال وحدة assert المختلفة، يمكنك الرجوع إلى [إجابة Stack Overflow هذه](https://stackoverflow.com/a/73937068/15291501).

اكتب اختبارات هذا التمرين داخل كتلة <i>describe</i> جديدة. افعل الشيء نفسه في التمارين المتبقية أيضاً.

#### 4.6*: الدوال المساعدة واختبارات الوحدة، الخطوة 4

هذا التمرين والتمرين التالي أكثر تحدياً قليلاً. إكمال هذين التمرينين ليس مطلوباً للتقدم في مادة المقرر، لذا قد تكون فكرة جيدة العودة إليهما بعد الانتهاء من تصفح مادة هذا الجزء بالكامل.

يمكن إكمال هذا التمرين دون استخدام مكتبات إضافية. لكن هذا التمرين فرصة رائعة لتعلم كيفية استخدام مكتبة [Lodash](https://lodash.com/).

عرّف دالة باسم _mostBlogs_ تستقبل مصفوفة مدونات كوسيط. تعيد الدالة <i>المؤلف</i> الذي لديه أكبر عدد من المدونات. تحتوي القيمة المعادة أيضاً على عدد المدونات التي يملكها المؤلف الأعلى:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

إذا كان هناك العديد من كبار المدونين، فيكفي إعادة أي واحد منهم.

#### 4.7*: الدوال المساعدة واختبارات الوحدة، الخطوة 5

عرّف دالة باسم _mostLikes_ تستقبل مصفوفة مدونات كوسيط لها. تعيد الدالة المؤلف الذي نالت منشوراته أكبر عدد من الإعجابات. تحتوي القيمة المعادة أيضاً على العدد الإجمالي للإعجابات التي تلقاها المؤلف:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

إذا كان هناك العديد من كبار المدونين، فيكفي إظهار أي واحد منهم.

</div>
