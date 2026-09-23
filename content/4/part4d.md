---
mainImage: /images/part-4.svg
part: 4
letter: d
lang: ar
---

<div class="content">

يجب أن يتمكن المستخدمون من تسجيل الدخول إلى تطبيقنا، وعندما يسجّل المستخدم الدخول، يجب أن تُرفق معلوماته تلقائياً بأي ملاحظات جديدة ينشئها.

سننفّذ الآن دعماً لـ[المصادقة القائمة على الرموز](https://www.okta.com/identity-101/what-is-token-based-authentication/) في الواجهة الخلفية.

تُوضَّح مبادئ المصادقة القائمة على الرموز في مخطط التتابع التالي:

![مخطط تتابع للمصادقة القائمة على الرموز](../../images/4/16new.webp)

- يبدأ المستخدم بتسجيل الدخول باستخدام نموذج تسجيل دخول منفَّذ بـ React
    - سنضيف نموذج تسجيل الدخول إلى الواجهة الأمامية في [الجزء 5](/part5)
- يؤدي هذا إلى أن ترسل شيفرة React اسم المستخدم وكلمة المرور إلى عنوان الخادم <i>/api/login</i> في طلب HTTP POST.
- إذا كان اسم المستخدم وكلمة المرور صحيحين، يولّد الخادم <i>رمزاً</i> (token) يعرّف بطريقة ما المستخدم المسجَّل الدخول.
    - يُوقَّع الرمز رقمياً، ما يجعل تزويره مستحيلاً (بالوسائل التشفيرية)
- تستجيب الواجهة الخلفية برمز حالة يشير إلى نجاح العملية، وتعيد الرمز مع الاستجابة.
- يحفظ المتصفح الرمز، مثلاً في حالة تطبيق React.
- عندما ينشئ المستخدم ملاحظة جديدة (أو يجري عملية أخرى تتطلب التحقق من الهوية)، ترسل شيفرة React الرمز إلى الخادم مع الطلب.
- يستخدم الخادم الرمز للتحقق من هوية المستخدم

لننفّذ أولاً وظيفة تسجيل الدخول. ثبّت مكتبة [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) التي تتيح لنا توليد [رموز JSON للويب](https://jwt.io/).

```bash
npm install jsonwebtoken
```

تذهب شيفرة وظيفة تسجيل الدخول إلى الملف <i>controllers/login.js</i>.

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

تبدأ الشيفرة بالبحث عن المستخدم في قاعدة البيانات بواسطة <i>username</i> المرفق بالطلب.

```js
const user = await User.findOne({ username })
```

ثم تتحقق من <i>password</i> المرفقة هي أيضاً بالطلب.

```js
const passwordCorrect = user === null
  ? false
  : await bcrypt.compare(password, user.passwordHash)
```

ولأن كلمات المرور نفسها لا تُحفظ في قاعدة البيانات، بل <i>تجزئات</i> (hashes) محسوبة منها، تُستخدم الدالة _bcrypt.compare_ للتحقق من صحة كلمة المرور:

```js
await bcrypt.compare(password, user.passwordHash)
```

إذا لم يُعثر على المستخدم، أو كانت كلمة المرور غير صحيحة، تُستجاب الطلب برمز الحالة [401 unauthorized](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). ويُشرح سبب الفشل في جسم الاستجابة.

```js
if (!(user && passwordCorrect)) {
  return response.status(401).json({
    error: 'invalid username or password'
  })
}
```

إذا كانت كلمة المرور صحيحة، يُنشأ رمز بالدالة _jwt.sign_. يحتوي الرمز على اسم المستخدم ومعرّف المستخدم بصيغة موقَّعة رقمياً.

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

وُقِّع الرمز رقمياً باستخدام نص من متغير البيئة <i>SECRET</i> بوصفه <i>السر</i>.
يضمن التوقيع الرقمي أن الأطراف التي تعرف السر فقط هي القادرة على توليد رمز صالح.
ويجب ضبط قيمة متغير البيئة في ملف <i>.env</i>.

تُستجاب الطلب الناجح برمز الحالة <i>200 OK</i>. ويُعاد الرمز المولَّد واسم مستخدم المستخدم في جسم الاستجابة.

```js
response
  .status(200)
  .send({ token, username: user.username, name: user.name })
```

يبقى الآن أن تُضاف شيفرة تسجيل الدخول إلى التطبيق بإدراج الموجّه الجديد في <i>app.js</i>.

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

لنجرّب تسجيل الدخول باستخدام عميل REST في VS Code:

![طلب REST من VS Code مع اسم المستخدم وكلمة المرور](../../images/4/17e.webp)

لا يعمل. تُطبع الرسالة التالية في الطرفية:

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

يفشل الأمر _jwt.sign(userForToken, process.env.SECRET)_. نسينا ضبط قيمة لمتغير البيئة <i>SECRET</i>. ويمكن أن يكون أي نص. وعندما نضبط القيمة في ملف <i>.env</i> (ونعيد تشغيل الخادم)، يعمل تسجيل الدخول.

يعيد تسجيل الدخول الناجح تفاصيل المستخدم والرمز:

![استجابة REST من VS Code تعرض التفاصيل والرمز](../../images/4/18ea.webp)

يعيد اسم المستخدم أو كلمة المرور الخاطئة رسالة خطأ ورمز الحالة المناسب:

![استجابة REST من VS Code لبيانات تسجيل دخول غير صحيحة](../../images/4/19ea.webp)

### قصر إنشاء الملاحظات الجديدة على المستخدمين المسجَّلين الدخول

لنغيّر إنشاء الملاحظات الجديدة بحيث لا يصبح ممكناً إلا إذا كان طلب POST مرفقاً برمز صالح. وعندها تُحفظ الملاحظة في قائمة ملاحظات المستخدم الذي يعرّفه الرمز.

توجد طرق عديدة لإرسال الرمز من المتصفح إلى الخادم. سنستخدم ترويسة [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). وتخبر الترويسة أيضاً عن [مخطط المصادقة](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) المستخدم. وقد يكون هذا ضرورياً إذا قدّم الخادم طرقاً متعددة للمصادقة.
تحديد المخطط يخبر الخادم بكيفية تفسير بيانات الاعتماد المرفقة.

مخطط <i>Bearer</i> مناسب لاحتياجاتنا.

عملياً، هذا يعني أنه إذا كان الرمز، على سبيل المثال، النص <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>، فستكون قيمة ترويسة Authorization:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
```

سيتغيّر إنشاء الملاحظات الجديدة على النحو التالي (<i>controllers/notes.js</i>):

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
//highlight-start
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})
```

تعزل الدالة المساعدة _getTokenFrom_ الرمز من ترويسة <i>authorization</i>. ويُتحقق من صلاحية الرمز بالدالة _jwt.verify_. كما تفك هذه الدالة ترميز الرمز، أي تعيد الكائن الذي بُني عليه الرمز.

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

إذا كان الرمز مفقوداً أو غير صالح، يُطلق الاستثناء <i>JsonWebTokenError</i>. نحتاج إلى توسيع وسيط معالجة الأخطاء ليتعامل مع هذه الحالة تحديداً:

```js
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') { // highlight-line
    return response.status(401).json({ error: 'token invalid' }) // highlight-line
  }

  next(error)
}
```

يحتوي الكائن المفكوك من الرمز على الحقلين <i>username</i> و<i>id</i>، وهما يخبران الخادم بمن أجرى الطلب.

إذا لم يحتوي الكائن المفكوك من الرمز على هوية المستخدم (_decodedToken.id_ غير معرَّف)، يُعاد رمز حالة الخطأ [401 unauthorized](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized) ويُشرح سبب الفشل في جسم الاستجابة.

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}
```

وعندما تُحدَّد هوية مُجري الطلب، يستمر التنفيذ كما كان سابقاً.

يمكن الآن إنشاء ملاحظة جديدة باستخدام Postman إذا أُعطيت ترويسة <i>authorization</i> القيمة الصحيحة، أي النص <i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>، حيث القيمة الثانية هي الرمز الذي أعادته عملية <i>login</i>.

يبدو هذا باستخدام Postman كما يلي:

![إضافة رمز bearer في Postman](../../images/4/20new.webp)

ومع عميل REST في Visual Studio Code

![مثال إضافة رمز bearer في VS Code](../../images/4/21new.webp)

يمكن العثور على شيفرة التطبيق الحالية في [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9)، في الفرع <i>part4-9</i>.

إذا كان للتطبيق واجهات متعددة تتطلب التحقق من الهوية، فينبغي فصل التحقق من JWT في وسيط خاص به. ويمكن أيضاً استخدام مكتبة جاهزة مثل [express-jwt](https://www.npmjs.com/package/express-jwt).

### مشكلات المصادقة القائمة على الرموز

المصادقة بالرموز سهلة التنفيذ نسبياً، لكنها تنطوي على مشكلة واحدة. فبمجرد أن يحصل مستخدم الـ API، مثل تطبيق React، على رمز، تثق الـ API ثقة عمياء بحامل الرمز. فماذا لو لزم سحب صلاحيات الوصول من حامل الرمز؟

يوجد حلان للمشكلة. الأسهل هو تحديد مدة صلاحية للرمز:

```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // تنتهي صلاحية الرمز بعد 60*60 ثانية، أي بعد ساعة واحدة
  // highlight-start
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  // highlight-end

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

بمجرد انتهاء صلاحية الرمز، يحتاج تطبيق العميل إلى الحصول على رمز جديد. ويحدث هذا عادةً بإجبار المستخدم على إعادة تسجيل الدخول إلى التطبيق.

ينبغي توسيع وسيط معالجة الأخطاء ليعطي خطأ مناسباً في حالة انتهاء صلاحية الرمز:

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  // highlight-start  
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  // highlight-end

  next(error)
}
```

كلما قصرت مدة الانتهاء، كان الحل أكثر أماناً. فإذا وقع الرمز في أيدٍ غير أمينة أو لزم سحب وصول المستخدم إلى النظام، فلا يكون الرمز قابلاً للاستخدام إلا لمدة محدودة. غير أن مدة الانتهاء القصيرة قد تكون مصدر إزعاج للمستخدم، لأنها تتطلب منه تسجيل الدخول بتكرار أكبر.

الحل الآخر هو حفظ معلومات عن كل رمز في قاعدة بيانات الواجهة الخلفية، والتحقق عند كل طلب API مما إذا كانت صلاحيات الوصول المقابلة للرموز ما تزال صالحة. وبهذا المخطط يمكن سحب صلاحيات الوصول في أي وقت. وغالباً ما يُسمى هذا النوع من الحلول <i>جلسة من جهة الخادم</i>.

الجانب السلبي للجلسات من جهة الخادم هو تعقيد الواجهة الخلفية المتزايد، فضلاً عن تأثيرها على الأداء، إذ يجب التحقق من صلاحية الرمز في قاعدة البيانات عند كل طلب API. والوصول إلى قاعدة البيانات أبطأ بكثير مقارنةً بالتحقق من صلاحية الرمز نفسه. ولهذا من الشائع جداً حفظ الجلسة المقابلة لرمز ما في <i>قاعدة بيانات مفتاح-قيمة</i> مثل [Redis](https://redis.io/)، وهي محدودة الوظائف مقارنةً بـ MongoDB مثلاً أو بقاعدة بيانات علائقية، لكنها سريعة للغاية في بعض سيناريوهات الاستخدام.

عند استخدام الجلسات من جهة الخادم، غالباً ما يكون الرمز مجرد نص عشوائي لا يتضمن أي معلومات عن المستخدم، خلافاً لما هو شائع عند استخدام رموز JWT. فعند كل طلب API، يجلب الخادم المعلومات ذات الصلة بهوية المستخدم من قاعدة البيانات. ومن الشائع أيضاً أنه بدلاً من استخدام ترويسة Authorization، تُستخدم <i>ملفات تعريف الارتباط</i> (cookies) كآلية لنقل الرمز بين العميل والخادم.

### ملاحظات ختامية

جرت تغييرات كثيرة على الشيفرة تسببت في مشكلة نمطية في مشروع برمجي سريع الوتيرة: تعطّل معظم الاختبارات. ولأن هذا الجزء من الدورة مكدّس بالفعل بالمعلومات الجديدة، سنترك إصلاح الاختبارات لتمرين غير إلزامي.

يجب دائماً استخدام أسماء المستخدمين وكلمات المرور والتطبيقات التي تعتمد المصادقة بالرموز عبر [HTTPS](https://en.wikipedia.org/wiki/HTTPS). ويمكننا استخدام خادم [HTTPS](https://nodejs.org/docs/latest-v18.x/api/https.html) من Node في تطبيقنا بدلاً من خادم [HTTP](https://nodejs.org/docs/latest-v18.x/api/http.html) (وهو يتطلب إعدادات أكثر). وفي المقابل، النسخة الإنتاجية من تطبيقنا موجودة على Fly.io، لذا يبقى تطبيقنا آمناً: فـ Fly.io يوجّه كل حركة المرور بين المتصفح وخادم Fly.io عبر HTTPS.

سننفّذ تسجيل الدخول في الواجهة الأمامية في [الجزء التالي](/part5).

</div>

<div class="tasks">

### تمارين 4.15.-4.23.

في التمارين التالية، ستُنفَّذ أساسيات إدارة المستخدمين في تطبيق قائمة المدونات. وأسلم طريقة هي اتباع مادة الدورة من فصل [إدارة المستخدمين](/part4/user_administration) في الجزء 4 إلى فصل [المصادقة بالرموز](/part4/token_authentication). ويمكنك طبعاً استخدام إبداعك أيضاً.

**تحذير آخر:** إذا لاحظت أنك تخلط بين async/await واستدعاءات _then_، فمن المؤكد بنسبة 99% أنك ترتكب خطأً ما. استخدم أحد الأسلوبين فقط، ولا تجمعهما أبداً.

#### 4.15: توسيع قائمة المدونات، الخطوة 3

نفّذ طريقة لإنشاء مستخدمين جدد بإجراء طلب HTTP POST إلى العنوان <i>api/users</i>. وللمستخدمين <i>username و password و name</i>.

لا تحفظ كلمات المرور في قاعدة البيانات كنص صريح، بل استخدم مكتبة <i>bcrypt</i> كما فعلنا في فصل [إنشاء المستخدمين](/part4/user_administration#creating-users) من الجزء 4.

**ملاحظة** واجه بعض مستخدمي Windows مشكلات مع <i>bcrypt</i>. إذا صادفت مشكلات، فأزل المكتبة بالأمر

```bash
npm uninstall bcrypt 
```

وثبّت [bcryptjs](https://www.npmjs.com/package/bcryptjs) بدلاً منها.

نفّذ طريقة لعرض تفاصيل جميع المستخدمين بإجراء طلب HTTP مناسب.

يمكن أن تبدو قائمة المستخدمين، على سبيل المثال، كما يلي:

![واجهة المتصفح api/users تعرض بيانات JSON لمستخدمين اثنين](../../images/4/22.webp)

#### 4.16*: توسيع قائمة المدونات، الخطوة 4

أضف ميزة تفرض القيود التالية على إنشاء المستخدمين الجدد: يجب إعطاء اسم المستخدم وكلمة المرور معاً، ويجب أن يتكوّن كل منهما من 3 أحرف على الأقل. ويجب أن يكون اسم المستخدم فريداً.

يجب أن تستجيب العملية برمز حالة مناسب ورسالة خطأ من نوع ما إذا أُنشئ مستخدم غير صالح.

**ملاحظة** لا تختبر قيود كلمة المرور بتحققات Mongoose. فهذه ليست فكرة جيدة لأن كلمة المرور التي تستقبلها الواجهة الخلفية وتجزئة كلمة المرور المحفوظة في قاعدة البيانات ليسا الشيء نفسه. ينبغي التحقق من طول كلمة المرور في المتحكم كما فعلنا في [الجزء 3](/part3/validation_and_es_lint) قبل استخدام تحقق Mongoose.

كما **نفّذ اختبارات** تضمن عدم إنشاء مستخدمين غير صالحين، وأن عملية إضافة مستخدم غير صالحة تعيد رمز حالة ورسالة خطأ مناسبين.

**ملاحظة** إذا قررت تعريف الاختبارات في ملفات متعددة، فينبغي أن تعلم أن كل ملف اختبار يُنفَّذ افتراضياً في عملية خاصة به (انظر _نموذج تنفيذ الاختبارات_ في [التوثيق](https://nodejs.org/api/test.html#test-runner-execution-model)). ونتيجة ذلك أن ملفات الاختبار المختلفة تُنفَّذ في الوقت نفسه. ولأن الاختبارات تتشارك قاعدة البيانات نفسها، فقد يسبب التنفيذ المتزامن مشكلات، يمكن تجنّبها بتنفيذ الاختبارات بالخيار _--test-concurrency=1_، أي تعريفها لتُنفَّذ تسلسلياً.

#### 4.17: توسيع قائمة المدونات، الخطوة 5

وسّع المدونات بحيث تحتوي كل مدونة على معلومات عن منشئ المدونة.

عدّل إضافة المدونات الجديدة بحيث يُعيَّن <i>أي</i> مستخدم من قاعدة البيانات منشئاً للمدونة عند إنشائها (مثلاً أول مستخدم يُعثر عليه). نفّذ هذا وفق فصل [populate](/part4/user_administration#populate) من الجزء 4.
ولا يهم حتى الآن أي مستخدم يُعيَّن منشئاً. وستكتمل الوظيفة في التمرين 4.19.

عدّل عرض جميع المدونات بحيث تُعرض معلومات المستخدم المنشئ مع المدونة:

![api/blogs يدمج معلومات المستخدم المنشئ في بيانات JSON](../../images/4/23e.webp)

كما يعرض عرض جميع المستخدمين المدونات التي أنشأها كل مستخدم:

![api/users يدمج المدونات في بيانات JSON](../../images/4/24e.webp)

#### 4.18: توسيع قائمة المدونات، الخطوة 6

نفّذ المصادقة القائمة على الرموز وفق فصل [المصادقة بالرموز](/part4/token_authentication) من الجزء 4.

#### 4.19: توسيع قائمة المدونات، الخطوة 7

عدّل إضافة المدونات الجديدة بحيث لا تصبح ممكنة إلا إذا أُرسل رمز صالح مع طلب HTTP POST. ويُعيَّن المستخدم الذي يعرّفه الرمز منشئاً للمدونة.

#### 4.20*: توسيع قائمة المدونات، الخطوة 8

[هذا المثال](/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users) من الجزء 4 يعرض أخذ الرمز من الترويسة بالدالة المساعدة _getTokenFrom_ في <i>controllers/blogs.js</i>.

إذا استخدمت الحل نفسه، فأعد هيكلة أخذ الرمز إلى [وسيط](/part3/node_js_and_express#middleware). وينبغي أن يأخذ الوسيط الرمز من ترويسة <i>Authorization</i> ويسنده إلى الحقل <i>token</i> في كائن <i>request</i>.

بعبارة أخرى، إذا سجّلت هذا الوسيط في الملف <i>app.js</i> قبل جميع المسارات

```js
app.use(middleware.tokenExtractor)
```

يمكن للمسارات الوصول إلى الرمز عبر _request.token_:

```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

تذكّر أن [دالة الوسيط](/part3/node_js_and_express#middleware) العادية دالة بثلاثة معاملات، تستدعي في النهاية المعامل الأخير <i>next</i> لنقل التحكم إلى الوسيط التالي:

```js
const tokenExtractor = (request, response, next) => {
  // شيفرة تستخرج الرمز

  next()
}
```

#### 4.21*: توسيع قائمة المدونات، الخطوة 9

غيّر عملية حذف المدونة بحيث لا يمكن حذف المدونة إلا للمستخدم الذي أضافها. لذا لا يصبح حذف المدونة ممكناً إلا إذا كان الرمز المُرسَل مع الطلب هو نفسه رمز منشئ المدونة.

إذا جرت محاولة حذف مدونة دون رمز أو بمستخدم غير صالح، فينبغي أن تعيد العملية رمز حالة مناسباً.

لاحظ أنه إذا جلبت مدونة من قاعدة البيانات،

```js
const blog = await Blog.findById(...)
```

فإن الحقل <i>blog.user</i> لا يحتوي نصاً، بل كائناً. لذا إذا أردت مقارنة معرّف الكائن المجلوب من قاعدة البيانات بمعرّف نصي، فلن تنجح عملية مقارنة عادية. ويجب أولاً تحويل المعرّف المجلوب من قاعدة البيانات إلى نص.

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*: توسيع قائمة المدونات، الخطوة 10

يحتاج كل من إنشاء مدونة جديدة وحذف مدونة إلى معرفة هوية المستخدم الذي يجري العملية. والوسيط _tokenExtractor_ الذي أنشأناه في التمرين 4.20 يساعد، لكن ما يزال على كل من معالجي عمليتي <i>post</i> و<i>delete</i> معرفة من هو المستخدم الحامل لرمز معين.

أنشئ الآن وسيطاً جديداً باسم userExtractor يحدد المستخدم المرتبط بالطلب ويرفقه بكائن الطلب. وبعد تسجيل الوسيط، ينبغي أن يتمكن معالجا post و delete من الوصول إلى المستخدم مباشرةً بالرجوع إلى request.user:

```js
blogsRouter.post('/', userExtractor, async (request, response) => {
  // احصل على المستخدم من كائن الطلب
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // احصل على المستخدم من كائن الطلب
  const user = request.user
  // ..
})
```

لاحظ أن وسيط userExtractor سُجِّل في هذه الحالة مع مسارات فردية، لذا لا يُنفَّذ إلا في حالات معينة. فبدلاً من استخدام _userExtractor_ مع جميع المسارات،

```js
// استخدم الوسيط في جميع المسارات
app.use(middleware.userExtractor) // highlight-line

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

يمكننا تسجيله بحيث لا يُنفَّذ إلا مع مسارات <i>/api/blogs</i>:

```js
// استخدم الوسيط فقط في مسارات /api/blogs
app.use('/api/blogs', middleware.userExtractor, blogsRouter) // highlight-line
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

ويُفعل هذا بربط دوال وسيط متعددة كمعاملات للدالة <i>use</i>. وبالطريقة نفسها، يمكن أيضاً تسجيل الوسيط لمسارات فردية فقط:

```js
router.post('/', userExtractor, async (request, response) => {
  // ...
})
```

تأكد من أن جلب جميع المدونات بطلب GET ما يزال يعمل دون رمز.

#### 4.23*: توسيع قائمة المدونات، الخطوة 11

بعد إضافة المصادقة القائمة على الرموز تعطّلت اختبارات إضافة مدونة جديدة. أصلحها. واكتب أيضاً اختباراً جديداً يضمن فشل إضافة مدونة برمز الحالة المناسب <i>401 Unauthorized</i> إذا لم يُقدَّم رمز.

من المرجح أن يكون [هذا](https://github.com/visionmedia/supertest/issues/398) مفيداً عند إجراء الإصلاح.

هذا هو التمرين الأخير في هذا الجزء من الدورة، وقد حان وقت دفع شيفرتك إلى GitHub وتعليم جميع تمارينك المنجزة في [نظام إرسال التمارين](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
