---
mainImage: /images/part-3.svg
part: 3
letter: c
lang: ar
---

<div class="content">

قبل أن ننتقل إلى الموضوع الرئيسي وهو حفظ البيانات في قاعدة بيانات، سنلقي نظرة على بضع طرق مختلفة لتصحيح أخطاء تطبيقات Node.

### تصحيح أخطاء تطبيقات Node

تصحيح أخطاء تطبيقات Node أصعب قليلاً من تصحيح أخطاء JavaScript التي تعمل في متصفحك. الطباعة إلى الطرفية طريقة مجرَّبة وموثوقة، ويستحق فعلها دائماً. يعتقد بعض الناس أنه ينبغي استخدام طرق أكثر تطوراً بدلاً منها، لكنني لا أوافق. حتى نخبة مطوّري المصادر المفتوحة في العالم [يستخدمون](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) هذه [الطريقة](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).

#### Visual Studio Code

قد يكون مصحّح أخطاء Visual Studio Code مفيداً في بعض الحالات. يمكنك تشغيل التطبيق في وضع تصحيح الأخطاء هكذا (في هذه الصورة والصور القليلة التالية، تحتوي الملاحظات على حقل _date_ أُزيل من الإصدار الحالي من التطبيق):

![لقطة شاشة توضح كيفية تشغيل مصحّح الأخطاء في vscode](../../images/3/35x.webp)

لاحظ أنه لا ينبغي أن يكون التطبيق قيد التشغيل في طرفية أخرى، وإلا فسيكون المنفذ قيد الاستخدام بالفعل.

__ملاحظة__ قد يحتوي إصدار أحدث من Visual Studio Code على _Run_ بدلاً من _Debug_. علاوة على ذلك، قد تحتاج إلى ضبط ملف _launch.json_ لبدء تصحيح الأخطاء. يمكن فعل ذلك باختيار _Add Configuration..._ من القائمة المنسدلة، الموجودة بجوار زر التشغيل الأخضر وفوق قائمة _VARIABLES_، ثم اختيار _Run "npm start" in a debug terminal_. للحصول على تعليمات إعداد أكثر تفصيلاً، زُر [توثيق تصحيح الأخطاء](https://code.visualstudio.com/docs/editor/debugging) في Visual Studio Code.

أدناه ترى لقطة شاشة توقّف فيها تنفيذ الشيفرة في منتصف حفظ ملاحظة جديدة:

![لقطة شاشة vscode للتنفيذ عند نقطة توقف](../../images/3/36x.webp)

توقّف التنفيذ عند <i>نقطة التوقف</i> في السطر 69. في وحدة التحكم، يمكنك رؤية قيمة المتغير <i>note</i>. وفي النافذة العلوية اليسرى، يمكنك رؤية أمور أخرى تتعلق بحالة التطبيق.

يمكن استخدام الأسهم في الأعلى للتحكم في سير مصحّح الأخطاء.

لسبب ما، لا أستخدم مصحّح أخطاء Visual Studio Code كثيراً.

#### أدوات مطوّري Chrome

يمكن تصحيح الأخطاء أيضاً باستخدام وحدة تحكم مطوّري Chrome عبر تشغيل تطبيقك بالأمر:

```bash
node --inspect index.js
```

يمكنك الوصول إلى مصحّح الأخطاء بالنقر على الأيقونة الخضراء - شعار node - التي تظهر في وحدة تحكم مطوّري Chrome:

![أدوات المطوّر مع أيقونة شعار node الخضراء](../../images/3/37.webp)

يعمل عرض تصحيح الأخطاء بالطريقة نفسها التي كان عليها مع تطبيقات React. يمكن استخدام تبويب <i>Sources</i> لضبط نقاط التوقف حيث سيُوقَف تنفيذ الشيفرة.

![تبويب sources في أدوات المطوّر مع نقطة توقف ومراقبة المتغيرات](../../images/3/38eb.webp)

ستظهر جميع رسائل <i>console.log</i> الخاصة بالتطبيق في تبويب <i>Console</i> في مصحّح الأخطاء. يمكنك أيضاً فحص قيم المتغيرات وتنفيذ شيفرة JavaScript الخاصة بك.

![تبويب console في أدوات المطوّر يعرض كائن note مكتوباً](../../images/3/39ea.webp)

#### شكّ في كل شيء

قد يبدو تصحيح أخطاء تطبيقات Full Stack صعباً في البداية. قريباً سيكون لتطبيقنا قاعدة بيانات إضافة إلى الواجهة الأمامية والواجهة الخلفية، وستكون هناك مجالات كثيرة محتملة للأخطاء في التطبيق.

عندما «لا يعمل» التطبيق، علينا أولاً أن نكتشف أين تحدث المشكلة فعلاً. من الشائع جداً أن تكون المشكلة في مكان لم تتوقعه، وقد يستغرق العثور على مصدر المشكلة دقائق أو ساعات أو حتى أياماً.

المفتاح هو أن تكون منهجياً. وبما أن المشكلة قد توجد في أي مكان، <i>عليك أن تشك في كل شيء</i>، وأن تستبعد جميع الاحتمالات واحداً واحداً. سيساعدك التسجيل في الطرفية وPostman ومصحّحات الأخطاء والخبرة.

عندما تظهر الأخطاء، فإن <i>أسوأ الاستراتيجيات الممكنة جميعها</i> هي مواصلة كتابة الشيفرة. فذلك يضمن أن شيفرتك ستصاب قريباً بأخطاء أكثر، وأن تصحيحها سيكون أصعب. مبدأ [Jidoka](https://leanscape.io/principles-of-lean-13-jidoka/) (توقف وأصلح) من أنظمة إنتاج تويوتا فعّال جداً في هذه الحالة أيضاً.

### MongoDB

لحفظ ملاحظاتنا المحفوظة إلى أجل غير مسمى، نحتاج إلى قاعدة بيانات. تستخدم معظم المقررات التي تُدرَّس في جامعة هلسنكي قواعد بيانات علائقية. في معظم أجزاء هذه الدورة، سنستخدم [MongoDB](https://www.mongodb.com/) وهي [قاعدة بيانات وثائقية](https://en.wikipedia.org/wiki/Document-oriented_database).

سبب استخدام Mongo كقاعدة بيانات هو تعقيدها الأقل مقارنة بقاعدة بيانات علائقية. يعرض [الجزء 13](/part13) من الدورة كيفية بناء واجهات خلفية بـ Node.js تستخدم قاعدة بيانات علائقية.

تختلف قواعد البيانات الوثائقية عن قواعد البيانات العلائقية في طريقة تنظيمها للبيانات وكذلك في لغات الاستعلام التي تدعمها. تُصنَّف قواعد البيانات الوثائقية عادةً ضمن المصطلح الشامل [NoSQL](https://en.wikipedia.org/wiki/NoSQL).

يمكنك قراءة المزيد عن قواعد البيانات الوثائقية وNoSQL في مادة مقرر مقدمة في قواعد البيانات [الأسبوع 7](https://tikape-s18.mooc.fi/part7/). للأسف، المادة متاحة حالياً بالفنلندية فقط.

اقرأ الآن الفصلين عن [المجموعات](https://www.mongodb.com/docs/manual/core/databases-and-collections/) و[الوثائق](https://www.mongodb.com/docs/manual/core/document/) من دليل MongoDB للحصول على فكرة أساسية عن كيفية تخزين قاعدة بيانات وثائقية للبيانات.

بطبيعة الحال، يمكنك تثبيت MongoDB وتشغيلها على حاسوبك. غير أن الإنترنت مليء أيضاً بخدمات قواعد بيانات Mongo التي يمكنك استخدامها. مزوّد MongoDB المفضّل لدينا في هذه الدورة سيكون [MongoDB Atlas](https://www.mongodb.com/atlas/database).

بعد إنشاء حسابك وتسجيل الدخول إليه، لننشئ عنقوداً جديداً باستخدام الزر الظاهر في الصفحة الرئيسية. من العرض الذي يُفتح، اختر الخطة المجانية، وحدّد مزوّد السحابة ومركز البيانات، ثم أنشئ العنقود:

![mongodb اختيار shared وAWS والمنطقة](../../images/3/mongo2.webp)

المزوّد المختار هو <i>AWS</i> والمنطقة هي <i>Stockholm (eu-north-1)</i>. لاحظ أنك إذا اخترت شيئاً آخر، فسيكون نص اتصال قاعدة بياناتك مختلفاً قليلاً عن هذا المثال. انتظر حتى يصبح العنقود جاهزاً، وهو ما سيستغرق بضع دقائق.

**ملاحظة** لا تتابع قبل أن يصبح العنقود جاهزاً.

لنستخدم تبويب <i>security</i> لإنشاء بيانات اعتماد مستخدم لقاعدة البيانات. يرجى الانتباه إلى أن هذه ليست بيانات الاعتماد نفسها التي تستخدمها لتسجيل الدخول إلى MongoDB Atlas. ستُستخدم هذه ليتصل تطبيقك بقاعدة البيانات.

![البداية السريعة لأمان mongodb](../../images/3/mongo3.webp)

بعد ذلك، علينا تحديد عناوين IP المسموح لها بالوصول إلى قاعدة البيانات. للتبسيط، سنسمح بالوصول من جميع عناوين IP:

![mongodb الوصول إلى الشبكة/إضافة قائمة عناوين IP](../../images/3/mongo4.webp)

ملاحظة: إذا كانت القائمة المنبثقة مختلفة لديك، فوفقاً لتوثيق MongoDB، فإن إضافة 0.0.0.0 كعنوان IP تتيح الوصول من أي مكان أيضاً.

أخيراً، أصبحنا مستعدين للاتصال بقاعدة بياناتنا. لفعل ذلك، نحتاج إلى نص اتصال قاعدة البيانات، ويمكن إيجاده باختيار <i>Connect</i> ثم <i>Drivers</i> من العرض، ضمن قسم <i>Connect to your application</i>:

![mongodb نشر قاعدة البيانات والاتصال](../../images/3/mongo5.webp)

يعرض العرض <i>MongoDB URI</i>، وهو عنوان قاعدة البيانات الذي سنمرّره إلى مكتبة عميل MongoDB التي سنضيفها إلى تطبيقنا:

![mongodb الاتصال بالتطبيق](../../images/3/mongo6new.webp)

يبدو العنوان هكذا:

```js
mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

أصبحنا الآن مستعدين لاستخدام قاعدة البيانات.

كان يمكننا استخدام قاعدة البيانات مباشرة من شيفرة JavaScript لدينا عبر مكتبة [مشغّل MongoDB Node.js الرسمي](https://mongodb.github.io/node-mongodb-native/)، لكن استخدامها مرهق نوعاً ما. سنستخدم بدلاً منها مكتبة [Mongoose](http://mongoosejs.com/index.html) التي تقدّم API بمستوى أعلى.

يمكن وصف Mongoose بأنها <i>مُخطِّط كائنات إلى وثائق</i> (object document mapper - ODM)، وحفظ كائنات JavaScript كوثائق Mongo مباشر مع هذه المكتبة.

لنثبّت Mongoose في الواجهة الخلفية لمشروع الملاحظات:

```bash
npm install mongoose
```

لن نضف بعد أي شيفرة تتعامل مع Mongo إلى الواجهة الخلفية. بدلاً من ذلك، لننشئ تطبيقاً تدريبياً بإنشاء ملف جديد هو <i>mongo.js</i> في جذر تطبيق الملاحظات الخلفي:

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

**ملاحظة:** حسب المنطقة التي اخترتها عند بناء عنقودك، قد يختلف <i>MongoDB URI</i> عن المثال أعلاه. ينبغي أن تتحقق من URI الصحيح الذي وُلِّد من MongoDB Atlas وتستخدمه.

يُنشأ الاتصال بقاعدة البيانات بالأمر:

```js
mongoose.connect(url, { family: 4 })
```

تأخذ الدالة عنوان URL لقاعدة البيانات كمعامل أول، وكائناً يعرّف الإعدادات المطلوبة كمعامل ثانٍ. يدعم MongoDB Atlas عناوين IPv4 فقط، لذا نحدّد بالكائن _{ family: 4 }_ أن الاتصال ينبغي أن يستخدم IPv4 دائماً.

يفترض التطبيق التدريبي أنه سيُمرَّر إليه كلمة المرور من بيانات الاعتماد التي أنشأناها في MongoDB Atlas، كمعامل من سطر الأوامر. يمكننا الوصول إلى معامل سطر الأوامر هكذا:

```js
const password = process.argv[2]
```

عندما تُشغَّل الشيفرة بالأمر <i>node mongo.js yourPassword</i>، ستضيف Mongo وثيقة جديدة إلى قاعدة البيانات.

**ملاحظة:** يرجى الانتباه إلى أن كلمة المرور هي كلمة المرور المُنشأة لمستخدم قاعدة البيانات، وليست كلمة مرور MongoDB Atlas الخاصة بك. كذلك، إذا أنشأت كلمة مرور تحتوي أحرفاً خاصة، فستحتاج إلى [ترميز كلمة المرور تلك بصيغة URL](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

يمكننا عرض الحالة الحالية لقاعدة البيانات من MongoDB Atlas عبر <i>Browse collections</i>، في تبويب Database.

![زر browse collections في قواعد بيانات mongodb](../../images/3/mongo7.webp)

كما يوضح العرض، أُضيفت <i>الوثيقة</i> المطابقة للملاحظة إلى مجموعة <i>notes</i> في قاعدة البيانات <i>myFirstDatabase</i>.

![تبويب collections في mongodb مع قاعدة myFirstDatabase ومجموعة notes](../../images/3/mongo8new.webp)

لنحذف قاعدة البيانات الافتراضية <i>test</i> ونغيّر اسم قاعدة البيانات المشار إليها في نص الاتصال إلى <i>noteApp</i> بدلاً منها، بتعديل URI:

```js
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
```

لنشغّل شيفرتنا مرة أخرى:

![تبويب collections في mongodb مع noteApp وnotes](../../images/3/mongo9.webp)

تُخزَّن البيانات الآن في قاعدة البيانات الصحيحة. يقدّم العرض أيضاً وظيفة <i>create database</i>، التي يمكن استخدامها لإنشاء قواعد بيانات جديدة من الموقع. إنشاء قاعدة بيانات بهذه الطريقة ليس ضرورياً، لأن MongoDB Atlas ينشئ تلقائياً قاعدة بيانات جديدة عندما يحاول تطبيق الاتصال بقاعدة بيانات غير موجودة بعد.

### المخطط

بعد إنشاء الاتصال بقاعدة البيانات، نعرّف [المخطط](https://mongoosejs.com/docs/guide.html#schemas) لملاحظة و[الطراز](https://mongoosejs.com/docs/models.html) (model) المطابق:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

أولاً، نعرّف [مخطط](https://mongoosejs.com/docs/guide.html#schemas) الملاحظة الذي يُخزَّن في المتغير _noteSchema_. يخبر المخطط Mongoose كيف ينبغي تخزين كائنات الملاحظات في قاعدة البيانات.

في تعريف طراز _Note_، المعامل الأول <i>"Note"</i> هو الاسم المفرد للطراز. سيكون اسم المجموعة هو الجمع بحروف صغيرة <i>notes</i>، لأن [عُرف Mongoose](https://mongoosejs.com/docs/models.html#compiling) هو تسمية المجموعات تلقائياً بصيغة الجمع (مثل <i>notes</i>) عندما يشير إليها المخطط بصيغة المفرد (مثل <i>Note</i>).

قواعد البيانات الوثائقية مثل Mongo <i>بلا مخطط</i>، أي أن قاعدة البيانات نفسها لا تهتم ببنية البيانات المخزّنة فيها. من الممكن تخزين وثائق بحقول مختلفة تماماً في المجموعة نفسها.

الفكرة وراء Mongoose هي أن البيانات المخزّنة في قاعدة البيانات تُمنَح <i>مخططاً على مستوى التطبيق</i> يعرّف شكل الوثائق المخزّنة في أي مجموعة معينة.

### إنشاء الكائنات وحفظها

بعد ذلك، ينشئ التطبيق كائن ملاحظة جديداً بمساعدة [طراز](https://mongoosejs.com/docs/models.html) <i>Note</i>:

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

الطرازات <i>دوال بانية</i> تنشئ كائنات JavaScript جديدة بناءً على المعاملات المقدَّمة. وبما أن الكائنات تُنشأ بالدالة البانية للطراز، فإنها تملك جميع خصائص الطراز، ومنها دوال حفظ الكائن في قاعدة البيانات.

يتم حفظ الكائن في قاعدة البيانات بالدالة المسماة على نحو مناسب _save_، التي يمكن تزويدها بمعالج حدث عبر الدالة _then_:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

عندما يُحفظ الكائن في قاعدة البيانات، يُستدعى معالج الحدث المزوَّد إلى _then_. يغلق معالج الحدث اتصال قاعدة البيانات بالأمر <code>mongoose.connection.close()</code>. وإذا لم يُغلق الاتصال، يبقى الاتصال مفتوحاً حتى ينتهي البرنامج.

توجد نتيجة عملية الحفظ في المعامل _result_ الخاص بمعالج الحدث. النتيجة ليست مثيرة للاهتمام كثيراً عندما نخزّن كائناً واحداً في قاعدة البيانات. يمكنك طباعة الكائن في الطرفية إذا أردت إلقاء نظرة أدق عليه أثناء تنفيذ تطبيقك أو أثناء تصحيح الأخطاء.

لنحفظ أيضاً بضع ملاحظات إضافية بتعديل البيانات في الشيفرة وتنفيذ البرنامج مرة أخرى.

**ملاحظة:** للأسف، توثيق Mongoose ليس متسقاً كثيراً، إذ تستخدم أجزاء منه دوال راجعة في أمثلتها وأجزاء أخرى أساليب مغايرة، لذا لا يُنصح بنسخ الشيفرة منه ولصقها مباشرة. كما لا يُنصح بخلط الوعود (promises) بالدوال الراجعة القديمة في الشيفرة نفسها.

### جلب الكائنات من قاعدة البيانات

لنعلّق شيفرة توليد الملاحظات الجديدة ونستبدلها بما يلي:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

عند تنفيذ الشيفرة، يطبع البرنامج جميع الملاحظات المخزّنة في قاعدة البيانات:

![مخرجات node mongo.js تعرض الملاحظات بصيغة JSON](../../images/3/70new.webp)

تُسترجَع الكائنات من قاعدة البيانات بالدالة [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) الخاصة بطراز _Note_. معامل الدالة كائن يعبّر عن شروط البحث. وبما أن المعامل كائن فارغ<code>{}</code>، نحصل على جميع الملاحظات المخزّنة في مجموعة _notes_.

تتبع شروط البحث [صيغة](https://www.mongodb.com/docs/manual/tutorial/query-documents/) استعلام البحث في Mongo.

يمكننا قصر بحثنا على الملاحظات المهمة فقط هكذا:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### تمرين 3.12.

#### 3.12: قاعدة بيانات من سطر الأوامر

أنشئ قاعدة بيانات MongoDB سحابية لتطبيق دليل الهاتف باستخدام MongoDB Atlas.

أنشئ ملف <i>mongo.js</i> في مجلد المشروع، يمكن استخدامه لإضافة مدخلات إلى دليل الهاتف، ولعرض جميع المدخلات الموجودة فيه.

**ملاحظة:** لا تضمّن كلمة المرور في الملف الذي تُجري commit عليه وترفعه إلى GitHub!

ينبغي أن يعمل التطبيق كما يلي. تستخدم البرنامج بتمرير ثلاثة معاملات من سطر الأوامر (الأول هو كلمة المرور)، مثلاً:

```bash
node mongo.js yourpassword Anna 040-1234556
```

ونتيجة لذلك، سيطبع التطبيق:

```bash
added Anna number 040-1234556 to phonebook
```

سيُحفظ المدخل الجديد في دليل الهاتف في قاعدة البيانات. لاحظ أنه إذا كان الاسم يحتوي محارف مسافة بيضاء، فيجب وضعه بين علامتي اقتباس:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

إذا كانت كلمة المرور هي المعامل الوحيد الممنوح للبرنامج، أي أنه يُستدعى هكذا:

```bash
node mongo.js yourpassword
```

فسيُفترض بالبرنامج أن يعرض جميع مدخلات دليل الهاتف:

```
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
```

يمكنك الحصول على معاملات سطر الأوامر من المتغير [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv).

**ملاحظة: لا تغلق الاتصال في المكان الخطأ**. فمثلاً، الشيفرة التالية لن تعمل:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

في الشيفرة أعلاه، سيُنفَّذ الأمر <i>mongoose.connection.close()</i> فوراً بعد بدء عملية <i>Person.find</i>. وهذا يعني أن اتصال قاعدة البيانات سيُغلق فوراً، ولن يصل التنفيذ أبداً إلى النقطة التي تنتهي فيها عملية <i>Person.find</i> وتُستدعى فيها الدالة <i>callback</i>.

المكان الصحيح لإغلاق اتصال قاعدة البيانات هو نهاية الدالة الراجعة:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**ملاحظة:** إذا عرّفت طرازاً باسم <i>Person</i>، فستسمّي mongoose المجموعة المرتبطة به تلقائياً <i>people</i>.

</div>

<div class="content">

### ربط الواجهة الخلفية بقاعدة بيانات

أصبح لدينا الآن ما يكفي من المعرفة لنبدأ استخدام Mongo في الواجهة الخلفية لتطبيق الملاحظات.

لنبدأ سريعاً بنسخ تعريفات Mongoose ولصقها في ملف <i>index.js</i>:

```js
const mongoose = require('mongoose')

// لا تحفظ كلمة المرور الخاصة بك في GITHUB!!
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

لنغيّر معالج جلب جميع الملاحظات إلى الشكل التالي:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

لنشغّل الواجهة الخلفية بالأمر <code>node --watch index.js yourpassword</code> حتى نتحقق في المتصفح من أن الواجهة الخلفية تعرض بشكل صحيح جميع الملاحظات المحفوظة في قاعدة البيانات:

![api/notes في المتصفح يعرض الملاحظات بصيغة JSON](../../images/3/44ea.webp)

يعمل التطبيق على نحو شبه مثالي. تفترض الواجهة الأمامية أن لكل كائن معرّفاً فريداً في الحقل <i>id</i>. كذلك لا نريد إعادة حقل الإصدار <i>\_\_v</i> الخاص بـ mongo إلى الواجهة الأمامية.

إحدى طرق تنسيق الكائنات التي تعيدها Mongoose هي [تعديل](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) الدالة _toJSON_ الخاصة بالمخطط، وهي تُستخدم على جميع نسخ الطرازات المُنتَجة بذلك المخطط. يمكن إجراء التعديل كما يلي:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

رغم أن خاصية <i>\_id</i> في كائنات Mongoose تبدو كنص، فهي في الحقيقة كائن. الدالة _toJSON_ التي عرّفناها تحوّلها إلى نص من باب الاحتياط فقط. ولو لم نجري هذا التغيير، لسبّب لنا ضرراً أكبر في المستقبل بمجرد أن نبدأ كتابة الاختبارات.

لا حاجة إلى أي تغييرات في المعالج:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

تستخدم الشيفرة تلقائياً الدالة _toJSON_ المعرَّفة عند تنسيق الملاحظات في الاستجابة.

### نقل إعدادات قاعدة البيانات إلى وحدة خاصة بها

قبل أن نعيد هيكلة بقية الواجهة الخلفية لتستخدم قاعدة البيانات، لنستخرج الشيفرة الخاصة بـ Mongoose إلى وحدة خاصة بها.

لننشئ مجلداً جديداً للوحدة باسم <i>models</i>، ونضف ملفاً باسم <i>note.js</i>:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

هناك بعض التغييرات في الشيفرة مقارنةً بالسابق. أصبح عنوان URL لاتصال قاعدة البيانات يُمرَّر إلى التطبيق عبر متغير البيئة MONGODB_URI، إذ ليس من الجيد تضمينه مباشرة في الشيفرة:

```js
const url = process.env.MONGODB_URI
```

هناك طرق كثيرة لتعريف قيمة متغير بيئة. على سبيل المثال، يمكننا تعريفه عند تشغيل التطبيق كما يلي:

```bash
MONGODB_URI="your_connection_string_here" npm run dev
```

سنتعلّم قريباً طريقة أكثر تطوراً لتعريف متغيرات البيئة.

تغيّرت طريقة إنشاء الاتصال قليلاً:

```js
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

أصبحت الدالة المسؤولة عن إنشاء الاتصال تُمنَح دالتين للتعامل مع محاولة اتصال ناجحة وأخرى فاشلة. كلتا الدالتين تسجّلان فقط رسالة في الطرفية عن حالة النجاح:

![مخرجات node عند اسم مستخدم أو كلمة مرور خاطئين](../../images/3/45e.webp)


يختلف تعريف [وحدات](https://nodejs.org/docs/latest-v18.x/api/modules.html) Node قليلاً عن طريقة تعريف [وحدات ES6](/part2/rendering_a_collection_modules#refactoring-modules) في الجزء 2.

تُعرَّف الواجهة العامة للوحدة بإسناد قيمة إلى المتغير _module.exports_. سنسند القيمة لتكون طراز <i>Note</i>. أما الأمور الأخرى المعرَّفة داخل الوحدة، مثل المتغيرين _mongoose_ و_url_، فلن تكون متاحة أو مرئية لمستخدمي الوحدة.

تحدث استيراد الوحدة بإضافة السطر التالي إلى <i>index.js</i>:

```js
const Note = require('./models/note')
```

بهذه الطريقة سيُسنَد المتغير _Note_ إلى الكائن نفسه الذي تعرّفه الوحدة.

### تعريف متغيرات البيئة باستخدام مكتبة dotenv

طريقة أكثر تطوراً لتعريف متغيرات البيئة هي استخدام مكتبة [dotenv](https://github.com/motdotla/dotenv#readme). يمكنك تثبيت المكتبة بالأمر:

```bash
npm install dotenv
```

لاستخدام المكتبة، ننشئ ملف <i>.env</i> في جذر المشروع. تُعرَّف متغيرات البيئة داخل الملف، وقد يبدو هكذا:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
```

أضفنا أيضاً منفذ الخادم المضمَّن في الشيفرة إلى متغير البيئة <em>PORT</em>.

**ينبغي استثناء ملف <i>.env</i> من git فوراً لأننا لا نريد نشر أي معلومات سرية علناً على الإنترنت!**

![ملف .gitignore في vscode مع إضافة سطر .env](../../images/3/45ae.webp)

يمكن أخذ متغيرات البيئة المعرَّفة في ملف <i>.env</i> في الاستخدام بالتعليم <em>require('dotenv').config()</em>، ويمكنك الإشارة إليها في شيفرتك كما تشير إلى متغيرات البيئة العادية، بصيغة <em>process.env.MONGODB_URI</em>.

لنحمّل متغيرات البيئة في بداية ملف index.js لتكون متاحة في التطبيق كله. لنغيّر ملف <i>index.js</i> بالطريقة التالية:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const Note = require('./models/note') // highlight-line

const app = express()
// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

من المهم أن يُستورَد <i>dotenv</i> قبل استيراد طراز <i>note</i>. هذا يضمن أن متغيرات البيئة من ملف <i>.env</i> متاحة عالمياً قبل استيراد الشيفرة من الوحدات الأخرى.

#### ملاحظة مهمة حول تعريف متغيرات البيئة في Fly.io وRender

**مستخدمو Fly.io:** بما أن GitHub لا يُستخدم مع Fly.io، فإن ملف .env يصل أيضاً إلى خوادم Fly.io عند نشر التطبيق. وبسبب ذلك، ستكون متغيرات البيئة المعرَّفة في الملف متاحة هناك.

غير أن [خياراً أفضل](https://community.fly.io/t/clarification-on-environment-variables/6309) هو منع نسخ ملف .env إلى Fly.io بإنشاء ملف _.dockerignore_ في جذر المشروع بالمحتوى التالي

```bash
.env
```

وضبط قيمة متغير البيئة من سطر الأوامر بالأمر:

```bash
fly secrets set MONGODB_URI="mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0"
```

**مستخدمو Render:** عند استخدام Render، يُعطى عنوان url لقاعدة البيانات بتعريف متغير البيئة المناسب في لوحة التحكم:

![المتصفح يعرض متغيرات بيئة render](../../images/3/render-env.webp)

اضبط عنوان URL الذي يبدأ بـ <i>mongodb+srv://...</i> فقط في حقل _value_.

### استخدام قاعدة البيانات في معالجات المسارات

بعد ذلك، لنغيّر بقية وظائف الواجهة الخلفية لتستخدم قاعدة البيانات.

يتم إنشاء ملاحظة جديدة هكذا:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

تُنشأ كائنات الملاحظات بالدالة البانية _Note_. تُرسَل الاستجابة داخل الدالة الراجعة لعملية _save_. وهذا يضمن ألا تُرسَل الاستجابة إلا إذا نجحت العملية. سنناقش معالجة الأخطاء بعد قليل.

المعامل _savedNote_ في الدالة الراجعة هو الملاحظة الجديدة المنشأة والمحفوظة. البيانات المُعاد إرسالها في الاستجابة هي النسخة المنسَّقة التي تُنشأ تلقائياً بالدالة _toJSON_:

```js
response.json(savedNote)
```

باستخدام دالة [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) في Mongoose، يصبح جلب ملاحظة فردية كما يلي:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### التحقق من تكامل الواجهة الأمامية والخلفية

عندما تتوسّع الواجهة الخلفية، من الجيد اختبار الواجهة الخلفية أولاً بـ **المتصفح أو Postman أو عميل REST في VS Code**. بعد ذلك، لنجرّب إنشاء ملاحظة جديدة بعد أخذ قاعدة البيانات في الاستخدام:

![عميل REST في VS Code يرسل طلب post](../../images/3/46new.webp)

فقط بعد التحقق من أن كل شيء يعمل في الواجهة الخلفية، من الجيد اختبار أن الواجهة الأمامية تعمل مع الواجهة الخلفية. فاختبار الأمور حصراً عبر الواجهة الأمامية غير فعّال إطلاقاً.

من الجيد على الأرجح دمج الواجهة الأمامية والخلفية وظيفة واحدة في كل مرة. أولاً، يمكننا تنفيذ جلب جميع الملاحظات من قاعدة البيانات واختباره عبر نقطة نهاية الواجهة الخلفية في المتصفح. بعد ذلك، يمكننا التحقق من أن الواجهة الأمامية تعمل مع الواجهة الخلفية الجديدة. وبمجرد أن يبدو كل شيء يعمل، ننتقل إلى الميزة التالية.

بمجرد إدخال قاعدة بيانات إلى المعادلة، من المفيد فحص الحالة المحفوظة في قاعدة البيانات، مثلاً من لوحة التحكم في MongoDB Atlas. وفي كثير من الأحيان تكون برامج Node المساعدة الصغيرة مثل برنامج <i>mongo.js</i> الذي كتبناه سابقاً مفيدة جداً أثناء التطوير.

يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-4</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

### قسم مطوّر full stack الحقيقي

حان وقت التمارين مرة أخرى. ازداد تعقيد تطبيقنا الآن خطوة أخرى، إذ أصبح لدينا قاعدة بيانات إضافة إلى الواجهة الأمامية والخلفية. وهناك بالفعل مصادر كثيرة جداً محتملة للأخطاء.

لذا ينبغي أن نوسّع قسمنا مرة أخرى:

تطوير full stack <i>صعب للغاية</i>، ولهذا سأستخدم كل الوسائل الممكنة لتسهيله

- سأبقي وحدة تحكم مطوّري المتصفح مفتوحة طوال الوقت
- سأستخدم تبويب network في أدوات مطوّري المتصفح للتأكد من أن الواجهة الأمامية والخلفية تتواصلان كما أتوقع
- سأراقب باستمرار حالة الخادم للتأكد من أن البيانات التي ترسلها الواجهة الأمامية إليه تُحفظ هناك كما أتوقع
- <i>سأراقب قاعدة البيانات؛ هل تُحفظ البيانات في الحالة المتوقعة</i>
- سأتقدم بخطوات صغيرة
- سأكتب الكثير من عبارات _console.log_ للتأكد من فهمي لكيفية تصرف الشيفرة وللمساعدة في تحديد المشاكل
- إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل أبدأ بحذف الشيفرة حتى تعمل أو أعود ببساطة إلى حالة كان فيها كل شيء يعمل
- عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في أي مكان آخر، سأصوغ أسئلتي بشكل صحيح، انظر [هنا](/part0/general_info#how-to-get-help-in-discord) لكيفية طلب المساعدة

</div>

<div class="tasks">

### التمارين 3.13.-3.14.

التمارين التالية مباشرة إلى حد كبير، لكن إذا توقفت واجهتك الأمامية عن العمل مع الواجهة الخلفية، فقد يكون العثور على الأخطاء وإصلاحها ممتعاً للغاية.

#### 3.13: قاعدة بيانات دليل الهاتف، الخطوة 1

غيّر جلب جميع مدخلات دليل الهاتف بحيث تُجلَب البيانات <i>من قاعدة البيانات</i>.

تحقق من أن الواجهة الأمامية تعمل بعد إجراء التغييرات.

في التمارين التالية، اكتب جميع الشيفرة الخاصة بـ Mongoose في وحدة خاصة بها، تماماً كما فعلنا في فصل [إعدادات قاعدة البيانات في وحدة خاصة بها](/part3/saving_data_to_mongo_db#moving-db-configuration-to-its-own-module).

#### 3.14: قاعدة بيانات دليل الهاتف، الخطوة 2

غيّر الواجهة الخلفية بحيث تُحفظ الأرقام الجديدة <i>في قاعدة البيانات</i>. تحقق من أن واجهتك الأمامية لا تزال تعمل بعد التغييرات.

في هذه المرحلة، يمكنك تجاهل ما إذا كان هناك بالفعل شخص في قاعدة البيانات بالاسم نفسه للشخص الذي تضيفه.

</div>

<div class="content">

### معالجة الأخطاء

إذا حاولنا زيارة عنوان URL لملاحظة بمعرّف غير موجود، مثل <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> حيث <i>5c41c90e84d891c15dfa3431</i> ليس معرّفاً مخزّناً في قاعدة البيانات، فستكون الاستجابة _null_.

لنغيّر هذا السلوك بحيث إذا لم توجد ملاحظة بالمعرّف المحدد، سيستجيب الخادم للطلب برمز حالة HTTP 404 not found. بالإضافة إلى ذلك، لننفّذ كتلة <em>catch</em> بسيطة للتعامل مع الحالات التي يُرفَض فيها الوعد الذي تعيده دالة <em>findById</em>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

إذا لم يوجد كائن مطابق في قاعدة البيانات، ستكون قيمة _note_ هي _null_ وستُنفَّذ كتلة _else_. وينتج عن ذلك استجابة برمز الحالة <i>404 not found</i>. أما إذا رُفض الوعد الذي تعيده دالة <em>findById</em>، فستحمل الاستجابة رمز الحالة <i>500 internal server error</i>. وتعرض الطرفية معلومات أكثر تفصيلاً عن الخطأ.

إضافة إلى حالة الملاحظة غير الموجودة، هناك حالة خطأ أخرى تحتاج إلى معالجة. في هذه الحالة، نحاول جلب ملاحظة بنوع _id_ خاطئ، أي _id_ لا يطابق صيغة معرّف Mongo.

إذا أرسلنا الطلب التالي، فسنحصل على رسالة الخطأ المعروضة أدناه:

```
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

عند إعطاء معرّف مشوّه كمعامل، ستطلق دالة <em>findById</em> خطأً يؤدي إلى رفض الوعد المُعاد. وسيؤدي ذلك إلى استدعاء الدالة الراجعة المعرَّفة في كتلة <em>catch</em>.

لنجرِ بعض التعديلات الصغيرة على الاستجابة في كتلة <em>catch</em>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

إذا كانت صيغة المعرّف غير صحيحة، فسننتهي في معالج الأخطاء المعرَّف في كتلة _catch_. ورمز الحالة المناسب لهذه الحالة هو [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request) لأن الحالة تطابق الوصف تماماً:

> <i>يشير رمز الحالة 400 (Bad Request) إلى أن الخادم لا يستطيع أو لا يريد معالجة الطلب بسبب أمر يُعتبر خطأ من العميل (مثل صيغة طلب مشوّهة، أو تأطير رسالة طلب غير صالح، أو توجيه طلب خادع).</i>

أضفنا أيضاً بعض البيانات إلى الاستجابة لإلقاء الضوء على سبب الخطأ.

عند التعامل مع الوعود (Promises)، من الجيد دائماً تقريباً إضافة معالجة للأخطاء والاستثناءات. وإلا ستجد نفسك تتعامل مع أخطاء غريبة.

ليس فكرة سيئة أبداً طباعة الكائن الذي سبّب الاستثناء في الطرفية داخل معالج الأخطاء:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

قد يكون سبب استدعاء معالج الأخطاء أمراً مختلفاً تماماً عما توقعته. وإذا سجّلت الخطأ في الطرفية، فقد تنقذ نفسك من جلسات تصحيح أخطاء طويلة ومحبطة. علاوة على ذلك، تدعم معظم الخدمات الحديثة التي تنشر تطبيقك عليها شكلاً من أشكال نظام التسجيل يمكنك استخدامه للتحقق من هذه السجلات. وكما ذُكر، فإن Fly.io واحدة منها.

في كل مرة تعمل فيها على مشروع له واجهة خلفية، <i>من الضروري أن تراقب مخرجات الطرفية للواجهة الخلفية</i>. وإذا كنت تعمل على شاشة صغيرة، فيكفي أن ترى شريحة صغيرة من المخرجات في الخلفية. فستلفت أي رسائل خطأ انتباهك حتى عندما تكون الطرفية بعيدة في الخلفية:

![لقطة شاشة مثال تعرض شريحة صغيرة من المخرجات](../../images/3/15b.webp)

### نقل معالجة الأخطاء إلى وسيط

كتبنا شيفرة معالج الأخطاء بين بقية شيفرتنا. قد يكون هذا حلاً معقولاً في بعض الأحيان، لكن هناك حالات يكون فيها من الأفضل تنفيذ كل معالجة الأخطاء في مكان واحد. ويمكن أن يكون هذا مفيداً بشكل خاص إذا أردنا لاحقاً إبلاغ نظام خارجي لتتبّع الأخطاء مثل [Sentry](https://sentry.io/welcome/) ببيانات متعلقة بالأخطاء.

لنغيّر معالج المسار <i>/api/notes/:id</i> بحيث يمرّر الخطأ إلى الأمام بالدالة <em>next</em>. تُمرَّر الدالة next إلى المعالج كمعامل ثالث:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

يُمنَح الخطأ المُمرَّر إلى الأمام للدالة <em>next</em> كمعامل. وإذا استُدعيت <em>next</em> دون معامل، فسينتقل التنفيذ ببساطة إلى المسار أو الوسيط التالي. أما إذا استُدعيت الدالة <em>next</em> بمعامل، فسيستمر التنفيذ إلى <i>وسيط معالج الأخطاء</i>.

[معالجات الأخطاء](https://expressjs.com/en/guide/error-handling.html) في Express وسيطات تُعرَّف بدالة تقبل <i>أربعة معاملات</i>. ويبدو معالج الأخطاء لدينا هكذا:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// يجب أن يكون هذا آخر وسيط يُحمَّل، كما ينبغي تسجيل جميع المسارات قبله!
app.use(errorHandler)
```

يتحقق معالج الأخطاء مما إذا كان الخطأ استثناء <i>CastError</i>، وفي هذه الحالة نعرف أن الخطأ سبّبه معرّف كائن غير صالح في Mongo. في هذه الحالة، سيرسل معالج الأخطاء استجابة إلى المتصفح بكائن الاستجابة المُمرَّر كمعامل. وفي جميع حالات الأخطاء الأخرى، يمرّر الوسيط الخطأ إلى معالج الأخطاء الافتراضي في Express.

لاحظ أن وسيط معالجة الأخطاء يجب أن يكون آخر وسيط يُحمَّل، كما ينبغي تسجيل جميع المسارات قبل معالج الأخطاء!

### ترتيب تحميل الوسيطات

ترتيب تنفيذ الوسيطات هو نفسه ترتيب تحميلها في Express بالدالة _app.use_. لهذا السبب، من المهم توخّي الحذر عند تعريف الوسيطات.

الترتيب الصحيح هو التالي:

```js
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// معالج الطلبات ذات نقطة النهاية غير المعروفة
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// معالج الطلبات التي تؤدي إلى أخطاء
app.use(errorHandler)
```

ينبغي أن يكون وسيط محلل json من أوائل الوسيطات المحمَّلة في Express. لو كان الترتيب كالتالي:

```js
app.use(requestLogger) // قيمة request.body غير معرّفة!

app.post('/api/notes', (request, response) => {
  // قيمة request.body غير معرّفة!
  const body = request.body
  // ...
})

app.use(express.json())
```

فلن تكون بيانات JSON المُرسَلة مع طلبات HTTP متاحة لوسيط المسجّل أو لمعالج مسار POST، لأن _request.body_ ستكون _undefined_ في تلك المرحلة.

من المهم أيضاً ألا يُحمَّل الوسيط الخاص بالتعامل مع المسارات غير المدعومة إلا بعد تعريف جميع نقاط النهاية، وقبل معالج الأخطاء مباشرة. فمثلاً، سيؤدي ترتيب التحميل التالي إلى مشكلة:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// معالج الطلبات ذات نقطة النهاية غير المعروفة
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

الآن أصبحت معالجة نقاط النهاية غير المعروفة مرتَّبة <i>قبل معالج طلبات HTTP</i>. وبما أن معالج نقطة النهاية غير المعروفة يستجيب لجميع الطلبات بـ <i>404 unknown endpoint</i>، فلن يُستدعى أي مسار أو وسيط بعد إرسال الاستجابة من وسيط نقطة النهاية غير المعروفة. والاستثناء الوحيد لذلك هو معالج الأخطاء الذي يجب أن يأتي في النهاية تماماً، بعد معالج نقاط النهاية غير المعروفة.

### عمليات أخرى

لنضف بعض الوظائف الناقصة إلى تطبيقنا، ومنها حذف ملاحظة فردية وتحديثها.

أسهل طريقة لحذف ملاحظة من قاعدة البيانات هي الدالة [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()):

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

في كلتا حالتي حذف مورد بنجاح، تستجيب الواجهة الخلفية برمز الحالة <i>204 no content</i>. والحالتان المختلفتان هما حذف ملاحظة موجودة، وحذف ملاحظة غير موجودة في قاعدة البيانات. ويمكن استخدام المعامل الراجع _result_ للتحقق مما إذا كان المورد قد حُذف فعلاً، ويمكننا استخدام تلك المعلومة لإعادة رموز حالة مختلفة للحالتين إذا رأينا ذلك ضرورياً. ويُمرَّر أي استثناء يحدث إلى معالج الأخطاء.


لننفّذ وظيفة تحديث ملاحظة واحدة، بما يسمح بتغيير أهمية الملاحظة. يتم تحديث الملاحظة كما يلي:

```js
app.put('/api/notes/:id', (request, response, next) => {
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
```

تُجلَب الملاحظة المراد تحديثها أولاً من قاعدة البيانات باستخدام الدالة _findById_. وإذا لم يوجد كائن في قاعدة البيانات بالمعرّف المحدد، فستكون قيمة المتغير _note_ هي _null_، ويستجيب الاستعلام برمز الحالة <i>404 Not Found</i>.

وإذا وُجد كائن بالمعرّف المحدد، يُحدَّث حقلا _content_ و_important_ بالبيانات المقدَّمة في الطلب، وتُحفظ الملاحظة المعدَّلة في قاعدة البيانات باستخدام الدالة _save()_. ويستجيب طلب HTTP بإرسال الملاحظة المحدَّثة في الاستجابة.

من النقاط الجديرة بالملاحظة أن الشيفرة تحتوي الآن على وعود متداخلة، أي أن داخل الدالة _.then_ الخارجية تُعرَّف [سلسلة وعود](https://javascript.info/promise-chaining) أخرى:

```js
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      // highlight-start
      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
      // highlight-end
```

عادةً لا يُنصح بهذا لأنه قد يجعل الشيفرة صعبة القراءة. غير أن الحل يعمل في هذه الحالة لأنه يضمن ألا تُنفَّذ كتلة _.then_ التي تلي الدالة _save()_ إلا إذا وُجدت ملاحظة بالمعرّف المحدد في قاعدة البيانات واستُدعيت الدالة _save()_. وفي الجزء الرابع من الدورة، سنستكشف صيغة async/await التي تقدّم طريقة أسهل وأوضح للتعامل مع مثل هذه الحالات.

تقدّم Mongoose أيضاً الدالة [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate())، التي يمكن استخدامها لإيجاد وثيقة بـ <i>id</i> الخاص بها وتحديثها باستدعاء دالة واحد. غير أن هذا الأسلوب لا يلبي احتياجاتنا تماماً، لأننا نعرّف لاحقاً في هذا الجزء متطلبات معينة للبيانات المخزّنة في قاعدة البيانات، و<i>findByIdAndUpdate</i> لا يدعم تحققات Mongoose من الصحة دعماً كاملاً. كما يشير [توثيق](https://mongoosejs.com/docs/documents.html#updating-using-queries) Mongoose إلى أن الدالة <i>save()</i> هي الخيار الصحيح عموماً لتحديث وثيقة، لأنها توفّر تحققاً كاملاً.

بعد اختبار الواجهة الخلفية مباشرة بـ Postman أو عميل REST في VS Code، يمكننا التحقق من أنها تبدو تعمل. ويبدو أن الواجهة الأمامية تعمل أيضاً مع الواجهة الخلفية التي تستخدم قاعدة البيانات.

يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part3-5</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### التمارين 3.15.-3.18.

#### 3.15: قاعدة بيانات دليل الهاتف، الخطوة 3

غيّر الواجهة الخلفية بحيث ينعكس حذف مدخلات دليل الهاتف في قاعدة البيانات.

تحقق من أن الواجهة الأمامية لا تزال تعمل بعد إجراء التغييرات.

#### 3.16: قاعدة بيانات دليل الهاتف، الخطوة 4

انقل معالجة الأخطاء في التطبيق إلى وسيط معالج أخطاء جديد.

#### 3.17*: قاعدة بيانات دليل الهاتف، الخطوة 5

إذا حاول المستخدم إنشاء مدخل جديد في دليل الهاتف لشخص اسمه موجود بالفعل في دليل الهاتف، فستحاول الواجهة الأمامية تحديث رقم هاتف المدخل الموجود بإرسال طلب HTTP PUT إلى العنوان الفريد للمدخل.

عدّل الواجهة الخلفية لدعم هذا الطلب.

تحقق من أن الواجهة الأمامية تعمل بعد إجراء تغييراتك.

#### 3.18*: قاعدة بيانات دليل الهاتف، الخطوة 6

حدّث أيضاً معالجة مساري HTTP GET <i>api/persons/:id</i> و<i>info</i> لتستخدم قاعدة البيانات، وتحقق من أنها تعمل مباشرة مع المتصفح أو Postman أو عميل REST في VS Code.

ينبغي أن يبدو فحص مدخل فردي في دليل الهاتف من المتصفح هكذا:

![لقطة شاشة للمتصفح تعرض شخصاً واحداً عبر api/persons/their_id](../../images/3/49.webp)

</div>
