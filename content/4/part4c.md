---
mainImage: /images/part-4.svg
part: 4
letter: c
lang: ar
---

<div class="content">

نريد إضافة مصادقة المستخدمين وتفويضهم إلى تطبيقنا. ينبغي تخزين المستخدمين في قاعدة البيانات وربط كل ملاحظة بالمستخدم الذي أنشأها. وينبغي ألا يُسمح بحذف الملاحظة أو تعديلها إلا للمستخدم الذي أنشأها.

لنبدأ بإضافة معلومات المستخدمين إلى قاعدة البيانات. توجد علاقة واحد إلى متعدد بين المستخدم (<i>User</i>) والملاحظات (<i>Note</i>):

![رسم يربط المستخدم بالملاحظات](https://yuml.me/a187045b.png)

لو كنا نعمل بقاعدة بيانات علائقية لكان التنفيذ مباشراً. فسيكون لكل مورد جدوله المستقل في قاعدة البيانات، وسيُخزَّن معرّف المستخدم الذي أنشأ الملاحظة في جدول الملاحظات كمفتاح خارجي.

أما عند العمل بقواعد البيانات المستندية فالوضع مختلف قليلاً، إذ توجد طرق عديدة ومتنوعة لنمذجة الحالة.

يحفظ الحل الحالي كل ملاحظة في <i>مجموعة الملاحظات</i> في قاعدة البيانات. وإذا لم نرغب في تغيير هذه المجموعة القائمة، فالخيار الطبيعي هو حفظ المستخدمين في مجموعتهم الخاصة، <i>users</i> مثلاً.

وكما هو الحال مع جميع قواعد البيانات المستندية، يمكننا استخدام معرّفات الكائنات في Mongo للإشارة إلى مستندات في مجموعات أخرى. وهذا يشبه استخدام المفاتيح الخارجية في قواعد البيانات العلائقية.

تقليدياً، لا تدعم قواعد البيانات المستندية مثل Mongo <i>استعلامات الربط</i> المتاحة في قواعد البيانات العلائقية، والمستخدمة لتجميع البيانات من جداول متعددة. غير أنه بدءاً من الإصدار 3.2. أصبح Mongo يدعم [استعلامات التجميع lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/). ولن نستعرض هذه الوظيفة في هذه الدورة.

إذا احتجنا وظيفة مشابهة لاستعلامات الربط، فسننفذها في شيفرة تطبيقنا عبر إجراء عدة استعلامات. وفي حالات معينة، يمكن لـ Mongoose أن يتولى ربط البيانات وتجميعها، ما يعطي مظهر استعلام ربط. لكن حتى في هذه الحالات، يُجري Mongoose عدة استعلامات إلى قاعدة البيانات في الخلفية.

### المراجع عبر المجموعات

لو كنا نستخدم قاعدة بيانات علائقية لاحتوت الملاحظة على <i>مفتاح مرجعي</i> إلى المستخدم الذي أنشأها. وفي قواعد البيانات المستندية يمكننا فعل الشيء نفسه.

لنفترض أن مجموعة <i>users</i> تحتوي على مستخدمين اثنين:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
]
```

تحتوي مجموعة <i>notes</i> على ثلاث ملاحظات، جميعها تحوي حقلاً <i>user</i> يشير إلى مستخدم في مجموعة <i>users</i>:

```js
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  },
]
```

لا تشترط قواعد البيانات المستندية تخزين المفتاح الخارجي في موارد الملاحظات، بل يمكن <i>أيضاً</i> تخزينه في مجموعة المستخدمين، أو في كلتيهما معاً:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },
]
```

ولأن المستخدم يمكن أن يملك ملاحظات كثيرة، تُخزَّن المعرّفات المرتبطة في مصفوفة داخل حقل <i>notes</i>.

تقدم قواعد البيانات المستندية أيضاً طريقة مختلفة جذرياً لتنظيم البيانات: فقد يكون من المفيد في بعض الحالات تضمين مصفوفة الملاحظات كاملة كجزء من المستندات في مجموعة المستخدمين:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

في هذا المخطط، ستكون الملاحظات متداخلة بإحكام تحت المستخدمين ولن تولّد قاعدة البيانات معرّفات لها.

لم يعد هيكل قاعدة البيانات ومخططها بديهياً كما كان الحال مع قواعد البيانات العلائقية. ويجب أن يدعم المخطط المختار حالات استخدام التطبيق بأفضل شكل ممكن. وهذا ليس قرار تصميم بسيطاً، إذ لا تكون جميع حالات استخدام التطبيق معروفة عند اتخاذ قرار التصميم.

ومن المفارقات أن قواعد البيانات بلا مخططات مثل Mongo تتطلب من المطورين اتخاذ قرارات تصميم أكثر جذرية بكثير بشأن تنظيم البيانات في بداية المشروع مقارنة بقواعد البيانات العلائقية ذات المخططات. وفي المتوسط، توفر قواعد البيانات العلائقية طريقة مناسبة إلى حد ما لتنظيم البيانات في كثير من التطبيقات.

### مخطط Mongoose للمستخدمين

في هذه الحالة، نقرر تخزين معرّفات الملاحظات التي أنشأها المستخدم في مستند المستخدم. لنعرّف النموذج الذي يمثل المستخدم في الملف <i>models/user.js</i>:

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // لا ينبغي كشف passwordHash
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

تُخزَّن معرّفات الملاحظات داخل مستند المستخدم كمصفوفة من معرّفات Mongo. والتعريف كالتالي:

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```

نوع الحقل هو <i>ObjectId</i>، أي أنه يشير إلى مستند آخر. ويحدد حقل <i>ref</i> اسم النموذج المشار إليه. ولا يعرف Mongo بطبيعته أن هذا حقل يشير إلى ملاحظات؛ فالصياغة مرتبطة بـ Mongoose ومحددة به وحده.

لنوسّع مخطط الملاحظة المعرّف في الملف <i>models/note.js</i> بحيث تحتوي الملاحظة على معلومات عن المستخدم الذي أنشأها:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // highlight-end
})
```

وعلى النقيض تماماً من أعراف قواعد البيانات العلائقية، <i>تُخزَّن المراجع الآن في كلا المستندين</i>: فالملاحظة تشير إلى المستخدم الذي أنشأها، ولدى المستخدم مصفوفة مراجع إلى جميع الملاحظات التي أنشأها.

### إنشاء المستخدمين

لننفذ مساراً لإنشاء مستخدمين جدد. لدى المستخدم <i>username</i> فريد، و<i>name</i>، وشيء يُسمى <i>passwordHash</i>. وتجزئة كلمة المرور هي ناتج [دالة تجزئة أحادية الاتجاه](https://en.wikipedia.org/wiki/Cryptographic_hash_function) تُطبَّق على كلمة مرور المستخدم. وليس من الحكمة أبداً تخزين كلمات المرور نصاً صريحاً غير مشفَّرة في قاعدة البيانات!

لنثبّت حزمة [bcrypt](https://github.com/kelektiv/node.bcrypt.js) لتوليد تجزئات كلمات المرور:

```bash
npm install bcrypt
```

يتم إنشاء المستخدمين الجدد وفقاً لأعراف REST التي ناقشناها في [الجزء 3](/part3/node_js_and_express#rest)، عبر إجراء طلب HTTP POST إلى مسار <i>users</i>.

لنعرّف <i>موجّهاً</i> منفصلاً للتعامل مع المستخدمين في ملف جديد <i>controllers/users.js</i>. ولنأخذ الموجّه إلى الاستخدام في تطبيقنا في الملف <i>app.js</i>، بحيث يتعامل مع الطلبات الموجهة إلى عنوان <i>/api/users</i>:

```js
// ...
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users') // highlight-line

// ...

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter) // highlight-line

// ...
```

محتويات الملف <i>controllers/users.js</i> الذي يعرّف الموجّه كالتالي:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
```

كلمة المرور المرسلة في الطلب <i>لا</i> تُخزَّن في قاعدة البيانات. بل نخزّن <i>تجزئة</i> كلمة المرور المولَّدة بالدالة _bcrypt.hash_.

أساسيات [تخزين كلمات المرور](https://bytebytego.com/guides/how-to-store-passwords-in-the-database/) خارج نطاق هذه المادة. ولن نناقش معنى الرقم السحري 10 المُسنَد إلى متغير [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds)، لكن يمكنك قراءة المزيد عنه في المادة المرتبطة.

لا تحتوي شيفرتنا الحالية على أي معالجة أخطاء أو تحقق من المدخلات للتأكد من أن اسم المستخدم وكلمة المرور بالصيغة المطلوبة.

يمكن، بل ينبغي، اختبار الميزة الجديدة يدوياً في البداية بأداة مثل Postman. غير أن الاختبار اليدوي سيصبح سريعاً مرهقاً للغاية، خصوصاً بعد تنفيذ وظيفة تفرض أن تكون أسماء المستخدمين فريدة.

كتابة اختبارات آلية تتطلب جهداً أقل بكثير، وستجعل تطوير تطبيقنا أسهل بكثير.

يمكن أن تبدو اختباراتنا الأولية هكذا:

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})
```

تستخدم الاختبارات دالة المساعدة <i>usersInDb()</i> التي نفذناها في الملف <i>tests/test_helper.js</i>. وتُستخدم الدالة لمساعدتنا في التحقق من حالة قاعدة البيانات بعد إنشاء مستخدم:

```js
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```

تضيف كتلة <i>beforeEach</i> مستخدماً باسم المستخدم <i>root</i> إلى قاعدة البيانات. ويمكننا كتابة اختبار جديد يتحقق من أنه لا يمكن إنشاء مستخدم جديد بنفس اسم المستخدم:

```js
describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
```

من الواضح أن حالة الاختبار لن تنجح في هذه المرحلة. نحن في جوهر الأمر نمارس [التطوير المدفوع بالاختبارات (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)، حيث تُكتب اختبارات الوظيفة الجديدة قبل تنفيذ الوظيفة.

لا توفر تحققات Mongoose طريقة مباشرة للتحقق من فرادة قيمة حقل ما. غير أنه يمكن تحقيق الفرادة عبر تعريف [فهرس فرادة](https://mongoosejs.com/docs/schematypes.html) لحقل ما. ويتم التعريف كالتالي:

```js
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  // highlight-start
  username: {
    type: String,
    required: true,
    unique: true // هذا يضمن فرادة اسم المستخدم
  },
  // highlight-end
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

// ...
```

غير أننا نريد توخي الحذر عند استخدام فهرس الفرادة. فإذا كانت هناك مستندات في قاعدة البيانات تخالف شرط الفرادة بالفعل، فلن يُنشأ أي فهرس. لذا عند إضافة فهرس فرادة، تأكد من أن قاعدة البيانات في حالة سليمة! لقد أضاف الاختبار أعلاه المستخدم ذا اسم المستخدم _root_ إلى قاعدة البيانات مرتين، ويجب إزالتهما ليتشكّل الفهرس وتعمل الشيفرة.

لا تكتشف تحققات Mongoose انتهاك الفهرس، وبدلاً من _ValidationError_ تُعيد خطأً من النوع _MongoServerError_. ولذلك نحتاج إلى توسيع معالج الأخطاء لتلك الحالة:

```js
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
// highlight-start
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  // highlight-end

  next(error)
}
```

بعد هذه التغييرات، ستنجح الاختبارات.

يمكننا أيضاً تنفيذ تحققات أخرى عند إنشاء المستخدم. يمكننا التحقق من أن اسم المستخدم طويل بما يكفي، أو أن اسم المستخدم يتكون من محارف مسموح بها فقط، أو أن كلمة المرور قوية بما يكفي. وتنفيذ هذه الوظائف متروك كتمرين اختياري.

وقبل أن نمضي قدماً، لنضف تنفيذاً أولياً لمعالج مسار يعيد جميع المستخدمين في قاعدة البيانات:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
```

لإنشاء مستخدمين جدد في بيئة إنتاج أو تطوير، يمكنك إرسال طلب POST إلى ```/api/users/``` عبر Postman أو REST Client بالصيغة التالية:

```js
{
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
}
```

تبدو القائمة هكذا:

![واجهة المتصفح api/users تعرض بيانات JSON مع مصفوفة notes](../../images/4/9.webp)

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في فرع <i>part4-7</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7).

### إنشاء ملاحظة جديدة

يجب تحديث شيفرة إنشاء ملاحظة جديدة بحيث تُسنَد الملاحظة إلى المستخدم الذي أنشأها.

لنوسّع تنفيذنا الحالي في <i>controllers/notes.js</i> بحيث تُرسَل معلومات المستخدم الذي أنشأ الملاحظة في حقل <i>userId</i> من جسم الطلب:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user') //highlight-line

//...

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)// highlight-line

  // highlight-start
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  // highlight-end

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id //highlight-line
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //highlight-line
  await user.save()  //highlight-line

  response.status(201).json(savedNote)
})

// ...
```

يُستعلَم أولاً من قاعدة البيانات عن مستخدم باستخدام <i>userId</i> المقدم في الطلب. وإذا لم يُعثر على المستخدم، تُرسَل الاستجابة برمز حالة 400 (<i>Bad Request</i>) ورسالة خطأ: <i>"userId missing or not valid"</i>.

ويجدر بالذكر أن كائن <i>user</i> يتغير أيضاً. فـ<i>id</i> الملاحظة يُخزَّن في حقل <i>notes</i> من كائن <i>user</i>:

```js
const user = await User.findById(body.userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

لنجرب إنشاء ملاحظة جديدة

![Postman ينشئ ملاحظة جديدة](../../images/4/10e.webp)

يبدو أن العملية تعمل. لنضف ملاحظة أخرى ثم نزُر المسار الخاص بجلب جميع المستخدمين:

![api/users يعيد JSON يحتوي المستخدمين ومصفوفة ملاحظاتهم](../../images/4/11e.webp)

نرى أن المستخدم لديه ملاحظتان.

وبالمثل، يمكن رؤية معرّفات المستخدمين الذين أنشأوا الملاحظات عند زيارة المسار الخاص بجلب جميع الملاحظات:

![api/notes يعرض معرّفات المستخدمين في JSON](../../images/4/12e.webp)

بسبب التغييرات التي أجريناها، لم تعد الاختبارات تنجح، لكننا نترك إصلاح الاختبارات كتمرين اختياري. كما لم تُراعَ التغييرات التي أجريناها في الواجهة الأمامية، لذا لم تعد وظيفة إنشاء الملاحظات تعمل. وسنصلح الواجهة الأمامية في الجزء 5 من الدورة.

### populate

نريد أن يعمل API لدينا بطريقة تجعل كائنات المستخدمين، عند إجراء طلب HTTP GET إلى مسار <i>/api/users</i>، تحتوي أيضاً على محتويات ملاحظات المستخدم لا على معرّفها فقط. وفي قاعدة بيانات علائقية، ستُنفَّذ هذه الوظيفة بـ<i>استعلام ربط</i>.

وكما ذُكر سابقاً، لا تدعم قواعد البيانات المستندية استعلامات الربط بين المجموعات دعماً صحيحاً، لكن مكتبة Mongoose يمكنها إجراء بعض هذه الروابط نيابة عنا. ويُنجز Mongoose الربط عبر إجراء استعلامات متعددة، وهذا مختلف عن استعلامات الربط في قواعد البيانات العلائقية التي تكون <i>معاملاتية</i>، بمعنى أن حالة قاعدة البيانات لا تتغير خلال الفترة التي يُجرى فيها الاستعلام. أما مع استعلامات الربط في Mongoose فلا شيء يضمن أن الحالة بين المجموعات المربوطة متسقة، بمعنى أننا إذا أجرينا استعلاماً يربط مجموعتي المستخدمين والملاحظات، فقد تتغير حالة المجموعات أثناء الاستعلام.

يتم الربط في Mongoose بدالة [populate](http://mongoosejs.com/docs/populate.html). لنحدّث أولاً المسار الذي يعيد جميع المستخدمين في الملف <i>controllers/users.js</i>:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User  // highlight-line
    .find({}).populate('notes') // highlight-line

  response.json(users)
})
```

تُسلسَل دالة [populate](http://mongoosejs.com/docs/populate.html) بعد دالة <i>find</i> التي تُجري الاستعلام الأولي. وتحدد الوسيطة المعطاة لدالة populate أن <i>المعرّفات</i> التي تشير إلى كائنات <i>note</i> في حقل <i>notes</i> من مستند <i>user</i> ستُستبدَل بمستندات <i>note</i> المشار إليها. يستعلم Mongoose أولاً من مجموعة <i>users</i> عن قائمة المستخدمين، ثم يستعلم من المجموعة المقابلة لكائن النموذج المحدد بخاصية <i>ref</i> في مخطط المستخدمين عن بيانات ذات معرّف الكائن المعطى.

النتيجة هي تقريباً بالضبط ما أردناه:

![بيانات JSON تعرض الملاحظات المملوءة وبيانات المستخدمين مع تكرار](../../images/4/13new.webp)

يمكننا استخدام دالة populate لاختيار الحقول التي نريد تضمينها من المستندات. فبالإضافة إلى الحقل <i>id</i>، لم تعد تهمنا الآن سوى <i>content</i> و<i>important</i>.

ويتم اختيار الحقول باستخدام [صياغة](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-_id-field-only) Mongo:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})
```

النتيجة الآن هي بالضبط ما نريد:

![بيانات مدمجة لا تعرض أي تكرار](../../images/4/14new.webp)

لنضف أيضاً تعبئة مناسبة لمعلومات المستخدم في الملاحظات في الملف <i>controllers/notes.js</i>:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})
```

الآن تُضاف معلومات المستخدم إلى حقل <i>user</i> في كائنات الملاحظات.

![ملاحظات JSON أصبحت تحتوي معلومات المستخدم أيضاً](../../images/4/15new.webp)

من المهم أن نفهم أن قاعدة البيانات لا تعرف أن المعرّفات المخزنة في حقل <i>user</i> من مجموعة الملاحظات تشير إلى مستندات في مجموعة المستخدمين.

تستند وظيفة دالة <i>populate</i> في Mongoose إلى أننا عرّفنا «أنواعاً» للمراجع في مخطط Mongoose بخيار <i>ref</i>:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في فرع <i>part4-8</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8).

</div>
