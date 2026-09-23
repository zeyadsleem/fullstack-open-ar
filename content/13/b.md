---
part: 13
letter: b
title: "استخدام قواعد البيانات العلائقية مع Sequelize"
mainImage: /images/part-13.svg
lang: ar
---
تأكد من أنك قرأت <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-1" data-type="link" data-id="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases/chapter-1">الفصل الأول: البدء</a>!

### إيجابيات قواعد البيانات المستندية وسلبياتها

استخدمنا MongoDB في جميع أقسام الدورة السابقة. Mongo قاعدة بيانات مستندية، ومن أبرز خصائصها أنها بلا مخطط (schemaless)، أي أن قاعدة البيانات لا تملك سوى إدراك محدود جداً لنوع البيانات المخزّنة في مجموعاتها. لا يوجد مخطط قاعدة البيانات إلا في شيفرة البرنامج، وهي التي تفسّر البيانات بطريقة معيّنة، مثلاً بتحديد أن بعض الحقول مراجع إلى كائنات في مجموعة أخرى.

في التطبيق المثال في <a href="/part3/saving_data_to_mongo_db#mongo-db" data-type="link" data-id="https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db">الجزء 3</a> والجزء 4، تخزّن قاعدة البيانات <em>ملاحظات</em> و<em>مستخدمين</em>.

تبدو المجموعة التي تخزّن <em>الملاحظات</em> كما يلي:

```
<code>[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2026-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2026-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]</code>
```

يبدو المستخدمون المحفوظون في مجموعة <em>users</em> كما يلي:

```
<code>[<br>  {<br>    "_id": "600c0e410d10256466883a6a",<br>    "username": "mluukkai",<br>    "name": "Matti Luukkainen",<br>    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",<br>    "__v": 9,<br>    notes: [<br>      "600c0edde86c7264ace9bb78",<br>      "600c0e410d10256466898a6c"<br>    ]<br>  },<br>]</code>
```

تعرف MongoDB أنواع حقول الكيانات المخزّنة، لكن ليست لديها معلومات عن المجموعة التي تشير إليها معرّفات سجلات المستخدم. كذلك لا يهم MongoDB ما الحقول التي تملكها الكائنات المخزّنة في المجموعات. تترك MongoDB الأمر بالكامل للمبرمج ليضمن تخزين المعلومات الصحيحة في قاعدة البيانات.

لغياب المخطط إيجابيات وسلبيات. من الإيجابيات المرونة التي يوفّرها: بما أنه لا حاجة إلى تعريف مخطط على مستوى قاعدة البيانات، يمكن أن يكون تطوير التطبيقات أسرع وأسهل في حالات معيّنة، كما أن تعريف المخطط وتعديله لا يتطلبان جهداً يُذكر على أي حال. أما مشكلات غياب المخطط فتتعلق بقابلية الخطأ: فكل شيء متروك للمبرمج. لا تملك قاعدة البيانات نفسها أي وسيلة للتحقق مما إذا كانت البيانات فيها <em>متسقة</em>، أي ما إذا كانت جميع الحقول الإلزامية لها قيم، وما إذا كانت حقول نوع المرجع تشير إلى أنواع موجودة وصحيحة من الكائنات، إلخ.

تعتمد قواعد البيانات العلائقية التي يتركّز عليها هذا الجزء اعتماداً كبيراً على وجود مخطط، وإيجابيات قواعد البيانات ذات المخطط وسلبياتها تكاد تكون عكس تلك الخاصة بقواعد البيانات بلا مخطط.

سبب استخدام الأجزاء السابقة من الدورة لـMongoDB هو تحديداً غياب المخطط فيها، مما جعل استخدامها أسهل بعض الشيء لمن ليسوا على دراية كبيرة بقواعد البيانات العلائقية. بالنسبة لمعظم حالات الاستخدام في هذه الدورة، كنت سأختار بنفسي قاعدة بيانات علائقية.

### قاعدة بيانات التطبيق

في المادة النظرية لهذا القسم، سنبني نسخة تدعم Postgres من الواجهة الخلفية لتطبيق تخزين الملاحظات الذي بُني في القسمين 3 و4.

نحتاج في تطبيقنا إلى قاعدة بيانات علائقية. هناك خيارات كثيرة، لكننا سنستخدم الحل مفتوح المصدر الأكثر شعبية حالياً <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer noopener">PostgreSQL</a>. يمكنك تثبيت Postgres (كما تُسمى قاعدة البيانات غالباً) على جهازك إن أردت ذلك، لكنه ليس ضرورياً.

ربما يكون الخيار الأسهل استخدام Postgres مستضاف في السحابة. هناك خيارات وفيرة، وعلى الأقل أحدها، <a href="https://aiven.io/">aiven.io</a>، يمكن استخدامه مجاناً للمشاريع الجانبية.

خيار آخر هو تطبيق ما تعلمته في <a href="/part12" target="_blank" rel="noreferrer noopener">الجزء 12</a> من الدورة واستخدام Postgres محلياً مع Docker. بعد تعليمات Postgres الخاصة بخدمات السحابة، نقدّم أيضاً تعليمات موجزة حول كيفية إعداد Postgres بسهولة مع Docker.

#### حل مستضاف: Aiven

في وقت كتابة هذا النص (9 فبراير 2026) توفّر <a href="https://aiven.io/" data-type="link" data-id="https://aiven.io/">Aiven</a> طبقة مجانية تناسب أغراض هذه الدورة جيداً. اذهب إلى <a href="https://aiven.io/">aiven.io</a> وسجّل. بعد إنشاء قاعدة البيانات، تحقق مما هو رابط الاتصال:

![صورة توضيحية](/images/mooc/d6c141cdea4c.webp)

#### Docker

تفترض هذه التعليمات أنك أتقنت أساسيات Docker بالقدر الذي يعلّمه مثلاً <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers">الجزء 12</a>.

شغّل <a href="https://hub.docker.com/_/postgres" target="_blank" rel="noreferrer noopener">صورة Docker</a>&nbsp;الخاصة بـPostgres بالأمر

```
<code>docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres</code>
```

يمكن فتح اتصال طرفية psql بقاعدة البيانات باستخدام أمر&nbsp;<em>docker exec</em>. أولاً عليك معرفة معرّف الحاوية:

```
<code>$ docker ps<br>CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                    NAMES<br>ff3f49eadf27   postgres   "docker-entrypoint.s…"   31 minutes ago   Up 31 minutes   0.0.0.0:5432->5432/tcp   great_raman<br>docker exec -it ff3f49eadf27 psql -U postgres postgres<br>psql (15.2 (Debian 15.2-1.pgdg110+1))<br>Type "help" for help.<br><br>postgres=#</code>
```

بالتعريف بهذه الطريقة، لا تبقى البيانات المخزّنة في قاعدة البيانات محفوظة إلا طالما وُجدت الحاوية. يمكن الحفاظ على البيانات بتعريف حجم (volume) للبيانات. يمكنك الاطلاع على <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers/chapter-3#066334ce-29a6-4ea8-a66b-035846920009">الجزء 12 </a>للتفاصيل. انظر المزيد <a href="https://github.com/docker-library/docs/blob/master/postgres/README.md#pgdata" target="_blank" rel="noreferrer noopener">هنا</a>.

#### الوصول إلى قاعدة البيانات

لا سيّما عند استخدام قاعدة بيانات علائقية، من الضروري الوصول إلى قاعدة البيانات مباشرة أيضاً. هناك طرق كثيرة لفعل ذلك. أحد الاحتمالات استخدام أداة سطر الأوامر <a href="https://www.postgresql.org/docs/current/app-psql.html" target="_blank" rel="noreferrer noopener">psql</a> الخاصة بـPostgres. إذا لم يكن psql مثبتاً لديك أو لم تكن تستخدم تثبيت Docker، <a href="https://www.pgadmin.org/download/" data-type="link" data-id="https://www.pgadmin.org/download/">نزّل</a> وثبّت pgAdmin، وهو عميل Postgres رسومي.

#### فتح اتصال باستخدام psql

إذا كان psql مثبتاً على جهازك المضيف، يُفتح الاتصال بالأمر

```
<code>psql postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb?sslmode=require</code>
```

إذا كان Docker مثبتاً لديك، يمكنك فتح الاتصال بقاعدة بيانات Aiven كما يلي

```
<code>docker run -it --rm postgres psql "postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb?sslmode=require"</code>
```

تذكّر أنك تجد رابط اتصال قاعدة البيانات في لوحة تحكم Aiven.

إذا كانت قاعدة البيانات لديك داخل Docker، انظر أعلاه كيفية الوصول إليها بالأمر <code>docker exec</code>.

#### فتح اتصال باستخدام pgAdmin

ابدأ بإنشاء <em>خادم</em>:

![صورة توضيحية](/images/mooc/387a5134d08c.webp)

املأ النموذج بالمعلومات التي تجدها في لوحة تحكم Aiven. بعد إعداد الخادم وإنشاء الاتصال، تُفتح طرفية قاعدة البيانات كما يلي:

![صورة توضيحية](/images/mooc/cd9bc10bdfd2.webp)

إذا سار كل شيء على ما يرام، فأنت جاهز:

![صورة توضيحية](/images/mooc/10c64e56f72a.webp)

#### عند فتح الاتصال

عند فتح الطرفية، لنجرّب أمر psql الرئيسي <code>\d</code>، الذي يخبرك بمحتويات قاعدة البيانات:

```
<code>psql (17.4 (Debian 17.4-1.pgdg120+2), server 17.7)<br>SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)<br>Type "help" for help.<br><br>defaultdb=> \d<br>Did not find any relations.<br>defaultdb=></code>
```

كما قد تتوقع، لا يوجد شيء حالياً في قاعدة البيانات.

لننشئ جدولاً للملاحظات:

```
<code>CREATE TABLE notes (<br>    id SERIAL PRIMARY KEY,<br>    content text NOT NULL,<br>    important boolean,<br>    date time<br>);</code>
```

بضع نقاط: العمود <em>id</em> معرّف بأنه <em>مفتاح أساسي</em>، ما يعني أن القيمة في العمود يجب أن تكون فريدة لكل صف في الجدول، ويجب ألا تكون القيمة فارغة. نوع هذا العمود معرّف بأنه <a href="https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL" target="_blank" rel="noreferrer noopener">SERIAL</a>، وهو ليس النوع الفعلي بل اختصار لعمود عدد صحيح يُسند إليه Postgres تلقائياً قيمة فريدة متزايدة عند إنشاء الصفوف. العمود المسمى <em>content</em> من النوع text معرّف بطريقة تجعل إسناد قيمة إليه إلزامياً.

لننظر إلى الحالة من الطرفية. أولاً الأمر <code>\d</code>، الذي يخبرنا ما الجداول الموجودة في قاعدة البيانات:

```
defaultdb=> \d
            List of relations
 Schema |     Name     |   Type   |  Owner
--------+--------------+----------+----------
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
(2 rows)
```

إضافة إلى جدول&nbsp;<em>notes</em>، أنشأ Postgres جدولاً فرعياً يُسمى&nbsp;<em>notes_id_seq</em>، يتتبّع القيمة المُسندة إلى عمود&nbsp;<em>id</em>&nbsp;عند إنشاء الملاحظة التالية.

بالأمر <code>\d notes</code>، يمكننا رؤية كيفية تعريف جدول <em>notes</em>:

```
defaultdb=> \d notes;
                                 Table "public.notes"
 Column    |          Type          | Collation | Nullable |             Default
-----------+------------------------+-----------+----------+-----------------------------------
 id        | integer                |           | not null | nextval('notes_id_seq'::regclass)
 content   | text                   |           | not null |
 important | boolean                |           |          |
 date      | time without time zone |           |          |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
```

نرى أن العمود <em>id</em> له <em>قيمة افتراضية</em> تُحصل عليها باستدعاء دالة Postgres الداخلية <code>nextval</code>.

لنضف بعض المحتوى إلى الجدول:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

ولنرَ كيف يبدو المحتوى المُنشأ:

```
defaultdb=> select * from notes;
 id |               content               | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t         |
  2 | MongoDB is webscale                 | f         |
(2 rows)
```

إذا حاولنا تخزين بيانات في قاعدة البيانات لا تتوافق مع المخطط، فلن ينجح ذلك. لا يمكن أن تكون قيمة عمود إلزامي مفقودة:

```
defaultdb=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

لا يمكن أن تكون قيمة العمود من النوع الخاطئ:

```
defaultdb=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

الأعمدة غير الموجودة في المخطط لا تُقبل أيضاً:

```
defaultdb=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

الآن حان وقت الانتقال إلى الوصول إلى قاعدة البيانات من التطبيق.

### تطبيق Node.js يستخدم قاعدة بيانات علائقية

لنبدأ التطبيق كالمعتاد بـ&nbsp;<em>npm init</em>&nbsp;ونثبّت&nbsp;<em>nodemon</em>&nbsp;كاعتمادية تطوير وكذلك الاعتماديات التشغيلية التالية:

```bash
npm install express dotenv pg sequelize
```

من بين هذه، الأخيرة&nbsp;<a href="https://sequelize.org/master/" target="_blank" rel="noreferrer noopener">sequelize</a>&nbsp;هي المكتبة التي نستخدم بها Postgres. Sequelize هي مكتبة&nbsp;<a href="https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping" target="_blank" rel="noreferrer noopener">ربط الكائنات بالعلاقات</a>&nbsp;(ORM) تتيح لك تخزين كائنات JavaScript في قاعدة بيانات علائقية دون استخدام لغة SQL نفسها، على غرار Mongoose الذي استخدمناه مع MongoDB.

لنجرّب أننا نستطيع الاتصال بقاعدة البيانات. أنشئ الملف <em>index.js</em> وأضف المحتوى التالي:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

يجب تعريف <em>سلسلة الاتصال</em> بقاعدة البيانات، التي تحتوي على عنوان قاعدة البيانات وبيانات الاعتماد، في الملف <em>.env</em>

إذا كنت تستخدم Aiven، ينبغي أن يكون محتوى الملف <em>.env</em> شيئاً مثل ما يلي:

```
$ cat .env
<code>postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb</code>
```

لاحظ أنه يجب عليك إزالة <code>?sslmode=require</code> من سلسلة الاتصال!

إذا كنت تستخدم Docker، فسلسلة الاتصال هي:

```
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

بعد إعداد سلسلة الاتصال في الملف&nbsp;<em>.env</em>&nbsp;يمكننا اختبار الاتصال:

```
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

إذا نجح الاتصال، يمكننا بعد ذلك تشغيل أول استعلام. لنعدّل البرنامج كما يلي:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

ينبغي أن يطبع تنفيذ التطبيق ما يلي:

```
Executing (default): SELECT * FROM notes
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

مع أن Sequelize مكتبة ORM، أي أنه لا حاجة تُذكر إلى كتابة SQL بنفسك عند استخدامها، إلا أننا استخدمنا للتو&nbsp;<a href="https://sequelize.org/master/manual/raw-queries.html" target="_blank" rel="noreferrer noopener">SQL مباشراً</a>&nbsp;مع دالة sequelize المسماة&nbsp;<a href="https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query" target="_blank" rel="noreferrer noopener">query</a>.

يبدو أن التطبيق يعمل، وتُطبع الملاحظات إلى الطرفية. لكن لننتقل الآن إلى استخدام Sequelize بدلاً من SQL، كما يُقصد به أن يُستخدم.

### النموذج

عند استخدام Sequelize، يُمثّل كل جدول في قاعدة البيانات&nbsp;<a href="https://sequelize.org/master/manual/model-basics.html" target="_blank" rel="noreferrer noopener">نموذجاً</a>&nbsp;(model)، وهو في الواقع صنف JavaScript خاص به. لنعرّف الآن النموذج&nbsp;<em>Note</em>&nbsp;المقابل للجدول&nbsp;<em>notes</em>&nbsp;في التطبيق بتغيير الشيفرة إلى الصيغة التالية:

```js
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

بضع تعليقات على الشيفرة: لا شيء مفاجئ كثيراً في تعريف النموذج <em>Note</em>؛ فكل عمود له نوع معرّف، وكذلك خصائص أخرى عند الحاجة، مثل ما إذا كان المفتاح الأساسي للجدول. المعامل الثاني في تعريف النموذج يحتوي على خاصية <em>sequelize</em> وكذلك معلومات تهيئة أخرى. عرّفنا أيضاً أن الجدول لا يلزمه استخدام عمودي الطوابع الزمنية (<em>created_at</em> و<em>updated_at</em>).

عرّفنا أيضاً <em>underscored: true</em>، ما يعني أن أسماء الجداول تُشتق من أسماء النماذج بصيغة الجمع <a href="https://en.wikipedia.org/wiki/Snake_case" target="_blank" rel="noreferrer noopener">snake case</a>. عملياً، هذا يعني أنه إذا كان اسم النموذج، كما في حالتنا، هو "Note"، فإن اسم الجدول المقابل هو صيغته الجمعية مكتوبة بحرف أول صغير، أي notes. أما إذا كان اسم النموذج "مكوّناً من جزأين"، مثل <em>StudyGroup</em>، فسيكون اسم الجدول <em>study_groups</em>. يستنتج Sequelize أسماء الجداول تلقائياً، لكنه يتيح أيضاً تعريفها صراحةً.

تنطبق سياسة التسمية نفسها على الأعمدة أيضاً. لو كنا قد عرّفنا أن الملاحظة مرتبطة بـ&nbsp;<em>creationYear</em>، أي معلومات عن السنة التي أُنشئت فيها، لعرّفناه في النموذج كما يلي:

```
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

سيكون اسم العمود المقابل في قاعدة البيانات&nbsp;<em>creation_year</em>. وفي الشيفرة، تكون الإشارة إلى العمود دائماً بالصيغة نفسها كما في النموذج، أي بصيغة "camel case".

عرّفنا أيضاً <em>modelName: 'note'</em>؛ اسم النموذج الافتراضي سيكون <em>Note</em> بحرف كبير. لكننا نريد حرفاً أولياً صغيراً، وهذا سيجعل بعض الأمور أسهل قليلاً فيما بعد.

عملية قاعدة البيانات سهلة باستخدام <a href="https://sequelize.org/master/manual/model-querying-basics.html" target="_blank" rel="noreferrer noopener">واجهة الاستعلام</a> التي توفّرها النماذج. الدالة <a href="https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll" target="_blank" rel="noreferrer noopener">findAll</a> تعمل تماماً كما يُفترض بها أن تعمل بحسب اسمها:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})
```

تخبرك الطرفية أن استدعاء الدالة&nbsp;<em>Note.findAll()</em>&nbsp;يسبّب الاستعلام التالي:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

بعد ذلك، لننفّذ نقطة نهاية لإنشاء ملاحظات جديدة:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create({...req.body, date: new Date()})
  res.json(note)
})
```

يتم إنشاء ملاحظة جديدة باستدعاء دالة النموذج&nbsp;<em>Note</em>&nbsp;المسماة&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries" target="_blank" rel="noreferrer noopener">create</a>&nbsp;وتمرير كائن يحدد قيم الأعمدة كمعامل.

بدلاً من دالة&nbsp;<em>create</em>،&nbsp;<a href="https://sequelize.org/master/manual/model-instances.html#creating-an-instance" target="_blank" rel="noreferrer noopener">من الممكن أيضاً</a>&nbsp;الحفظ في قاعدة بيانات باستخدام دالة&nbsp;<a href="https://sequelize.org/api/v6/class/src/model.js~model#static-method-build" target="_blank" rel="noreferrer noopener">build</a>&nbsp;أولاً لإنشاء كائن Model من البيانات المطلوبة، ثم استدعاء دالة&nbsp;<a href="https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save" target="_blank" rel="noreferrer noopener">save</a>&nbsp;عليه:

```js
const note = Note.build(req.body)
await note.save()
```

استدعاء دالة&nbsp;<em>build</em>&nbsp;لا يحفظ الكائن في قاعدة البيانات بعد، لذا يظل ممكناً تعديل الكائن قبل حدث الحفظ الفعلي:

```js
const note = Note.build(req.body)
note.important = true
await note.save()
```

لحالة استخدام الشيفرة المثال، دالة&nbsp;<a href="https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries" target="_blank" rel="noreferrer noopener">create</a>&nbsp;أنسب، لذا لنلتزم بها.

إذا كان الكائن المُنشأ غير صالح، تنتج رسالة خطأ. مثلاً عند محاولة إنشاء ملاحظة دون محتوى، تفشل العملية وتكشف الطرفية أن السبب هو&nbsp;<em>SequelizeValidationError: notNull Violation Note.content cannot be null</em>:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

لنضف معالجة أخطاء بسيطة عند إضافة ملاحظة جديدة:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create({...req.body, date: new Date()})
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<div class="tasks">

**1. المستودع وقاعدة البيانات**

</div>

<div class="tasks">

**2. الاتصال عبر الطرفية**

</div>

<div class="tasks">

**3. الاتصال من التطبيق**

</div>

### إنشاء جداول قاعدة البيانات تلقائياً

تطبيقنا الآن فيه عيب واحد: يفترض وجود قاعدة بيانات بمخطط صحيح تماماً، أي أن جدول <em>notes</em> أُنشئ بأمر <code>create table</code> المناسب.

بما أن شيفرة البرنامج مخزّنة في GitHub، سيكون من المنطقي تخزين الأوامر التي تنشئ قاعدة البيانات أيضاً إلى جانب شيفرة البرنامج، حتى يكون مخطط قاعدة البيانات بالتأكيد مطابقاً لما تتوقعه شيفرة البرنامج. Sequelize قادر فعلاً على توليد المخطط تلقائياً من تعريفات النماذج باستخدام دالة النموذج <a href="https://sequelize.org/master/manual/model-basics.html#model-synchronization" target="_blank" rel="noreferrer noopener">sync</a>.

لندمّر الآن جدول <em>notes</em> من الطرفية بإدخال الأمر التالي:

```
<code>drop table notes;</code>
```

يكشف الأمر&nbsp;<code>\d</code>&nbsp;أن الجدول فُقد من قاعدة البيانات:

```
<code>postgres=# \d<br>Did not find any relations.</code>
```

لم يعد التطبيق يعمل.

لنضف الأمر التالي إلى التطبيق مباشرة بعد تعريف النموذج&nbsp;<em>Note</em>:

```
<code>Note.sync()</code>
```

عند بدء التطبيق، يُطبع ما يلي على الطرفية:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

أي أنه عند بدء التطبيق يُنفّذ الأمر&nbsp;<em>CREATE TABLE IF NOT EXISTS "notes"...</em>&nbsp;الذي ينشئ الجدول&nbsp;<em>notes</em>&nbsp;إن لم يكن موجوداً بالفعل.

### عمليات أخرى

لنكمل التطبيق ببضع عمليات أخرى.

البحث عن ملاحظة واحدة ممكن بدالة&nbsp;<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk" target="_blank" rel="noreferrer noopener">findByPk</a>، لأنها تُجلب بناءً على معرّف المفتاح الأساسي:

```js
<code>app.get('/api/notes/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})</code>
```

جلب ملاحظة واحدة يسبّب أمر SQL التالي:

```
<code>Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';</code>
```

إذا لم تُوجد أي ملاحظة، تعيد العملية&nbsp;<em>null</em>، وفي هذه الحالة يُعطى رمز الحالة المناسب.

تعديل الملاحظة يتم كما يلي. يُدعم فقط تعديل حقل&nbsp;<em>important</em>، لأن الواجهة الأمامية للتطبيق لا تحتاج شيئاً آخر:

```js
<code>app.put('/api/notes/:id', async (req, res) => {<br>  const note = await Note.findByPk(req.params.id)<br>  if (note) {<br>    note.important = req.body.important<br>    await note.save()<br>    res.json(note)<br>  } else {<br>    res.status(404).end()<br>  }<br>})</code>
```

يُجلب الكائن المقابل لصف قاعدة البيانات من قاعدة البيانات بدالة&nbsp;<em>findByPk</em>، ويُعدَّل الكائن وتُحفظ النتيجة باستدعاء دالة&nbsp;<em>save</em>&nbsp;على الكائن المقابل لصف قاعدة البيانات.

الشيفرة الحالية للتطبيق موجودة بكاملها على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step1" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step1</em>.

### طباعة الكائنات التي يعيدها Sequelize إلى الطرفية

أهم أداة لدى مبرمج JavaScript (إلى جانب وكلاء الذكاء الاصطناعي) هي <em>console.log</em>، التي يجعل استخدامها المكثّف حتى أسوأ الأخطاء تحت السيطرة. لنضف طباعة إلى الطرفية في مسار الملاحظة الواحدة:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note)
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

نرى أن النتيجة النهائية ليست تماماً ما توقعناه:

```
note {
  dataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2026-02-03T15:00:24.582Z,
  },
  _previousDataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2026-02-03T15:00:24.582Z,
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'content', 'important', 'date' ]
  },
  isNewRecord: false
}
```

إضافة إلى معلومات الملاحظة، تُطبع على الطرفية أمور أخرى من كل نوع. يمكننا الحصول على النتيجة المطلوبة باستدعاء دالة الكائن النموذجي <a href="https://sequelize.org/api/v6/class/src/model.js~model#instance-method-toJSON" target="_blank" rel="noreferrer noopener">toJSON</a>:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON())
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

الآن النتيجة هي بالضبط ما نريد:

```
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2026-02-09T13:52:58.693Z }
```

في حالة مجموعة من الكائنات، لا تعمل دالة toJSON مباشرةً، بل يجب استدعاؤها منفصلة لكل كائن في المجموعة:

```js
app.get('/api/notes', async (req, res) =&gt; {
  const notes = await Note.findAll()

  console.log(notes.map(n=&gt;n.toJSON()))
  res.json(notes)
})
```

تبدو الطباعة كما يلي:

```
[ { id: 1,
    content: 'MongoDB is webscale',
    important: false,
    date: 2026-02-09T13:52:58.693Z },
  { id: 2,
    content: 'Relational databases rule the world',
    important: true,
    date: 2026-02-09T13:53:10.710Z } ]
```

لكن ربما الحل الأفضل هو تحويل المجموعة إلى JSON للطباعة باستخدام الدالة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify" target="_blank" rel="noreferrer noopener">JSON.stringify</a>:

```js
app.get('/api/notes', async (req, res) =&gt; {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes))
  res.json(notes)
})
```

هذه الطريقة أفضل خاصةً إذا كانت الكائنات في المجموعة تحتوي كائنات أخرى. وكثيراً ما يكون مفيداً أيضاً تنسيق الكائنات على الشاشة بصيغة أسهل قراءةً بعض الشيء. يمكن فعل ذلك بالأمر التالي:

```
console.log(JSON.stringify(notes, null, 2))
```

تبدو الطباعة كما يلي:

```json
[
  {
    "id": 1,
    "content": "MongoDB is webscale",
    "important": false,
    "date": "2026-02-09T13:52:58.693Z"
  },
  {
    "id": 2,
    "content": "Relational databases rule the world",
    "important": true,
    "date": "2026-02-09T13:53:10.710Z"
  }
]
```

<div class="tasks">

**4. وُلدت خدمة الويب**

</div>
