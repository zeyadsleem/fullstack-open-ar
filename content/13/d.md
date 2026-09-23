---
part: 13
letter: d
title: "الترحيلات وعلاقات متعدد إلى متعدد"
mainImage: /images/part-13.svg
lang: ar
---
### الترحيلات

لنواصل توسيع الواجهة الخلفية. نريد تنفيذ دعم للمستخدمين ذوي <em>صلاحية المشرف</em> لتعيين مستخدمين آخرين في حالة غير نشطة، ومنعهم من تسجيل الدخول وإنشاء ملاحظات جديدة. ولتنفيذ ذلك، نحتاج إلى إضافة معلومات ذات قيمة منطقية إلى جدول المستخدمين في قاعدة البيانات تشير إلى ما إذا كان المستخدم مشرفاً وما إذا كان حساب المستخدم غير نشط.

كان بإمكاننا المضي كما في السابق، أي تغيير النموذج الذي يعرّف الجدول والاعتماد على Sequelize لمزامنة تغييرات المخطط مع قاعدة البيانات. ويظهر ذلك في هذه الأسطر من الملف <em>models/index.js</em>

```js
const Note = require('./note')
const User = require('./user')

Note.belongsTo(User)
User.hasMany(Note)

// إجراء تغييرات المخطط الممكنة
const syncModels = async () => {
  User.sync({ alter: true })
  Note.sync({ alter: true })
}

syncModels()

module.exports = {
  Note, User
}
```

لكن هذا الأسلوب لا معنى له على المدى الطويل. لنحذف الأسطر التي تقوم بالمزامنة وننتقل إلى استخدام طريقة أكثر متانة بكثير، وهي <a href="https://sequelize.org/master/manual/migrations.html" target="_blank" rel="noreferrer noopener">الترحيلات (migrations)</a> التي توفّرها Sequelize (وكذلك مكتبات أخرى كثيرة).

عملياً، الترحيل هو ملف JavaScript واحد يصف تغييراً يجب إجراؤه على قاعدة البيانات. ويُنشأ ملف ترحيل منفصل لكل تغيير فردي أو لمجموعة تغييرات تُجرى دفعة واحدة. وتتتبّع Sequelize أي الترحيلات نُفّذت، أي تغييرات الترحيل التي زُوّمت مع مخطط قاعدة البيانات. ومع إنشاء ترحيلات جديدة، تبقى Sequelize على اطلاع بأي تغييرات المخطط ما زالت بحاجة إلى إجرائها. وبهذه الطريقة تُجرى التغييرات بطريقة مضبوطة، مع تخزين شيفرة البرنامج في نظام إدارة الإصدارات.

أولاً، أنشئ ترحيلاً ينقل قاعدة البيانات إلى حالتها الحالية. شيفرة الترحيل كما يلي:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    })
    await queryInterface.createTable('notes', {
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
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

يعرّف ملف الترحيل&nbsp;<a href="https://sequelize.org/master/manual/migrations.html#migration-skeleton" target="_blank" rel="noreferrer noopener">الدالتين</a>&nbsp;<em>up</em>&nbsp;و&nbsp;<em>down</em>، والأولى منهما تحدد كيف ينبغي تعديل قاعدة البيانات عند تنفيذ الترحيل. أما الدالة&nbsp;<em>down</em>&nbsp;فتبيّن كيفية التراجع عن الترحيل إذا دعت الحاجة إلى ذلك.

يحتوي الترحيل لدينا على عمليتين: الأولى تنشئ جدول <em>users</em>، والثانية تنشئ جدول <em>notes</em> الذي يحتوي على مفتاح أجنبي إلى جدول <em>users</em> يشير إلى منشئ الملاحظة. وتُعرَّف التغييرات في المخطط باستدعاء دوال الكائن <a href="https://sequelize.org/master/manual/query-interface.html" target="_blank" rel="noreferrer noopener">queryInterface</a>.

عند تعريف الترحيلات، من الضروري أن تتذكر أنه خلافاً للنماذج، تُكتب أسماء الأعمدة والجداول مثل <em>user_id</em> بصيغة snake case.

إذن في الترحيلات تُكتب أسماء الجداول والأعمدة تماماً كما تظهر في قاعدة البيانات، بينما تستخدم النماذج اصطلاح التسمية الافتراضي camelCase الخاص بـSequelize.

احفظ شيفرة الترحيل في الملف <em>migrations/20260211_00_initialize_notes_and_users.js</em>. ويجب أن تكون أسماء ملفات الترحيل مرتبة أبجدياً بحيث يسبق التغيير الأقدم دائماً التغيير الأحدث أبجدياً. ومن الطرق الجيدة لتحقيق هذا الترتيب أن يبدأ اسم ملف الترحيل بالتاريخ ورقم التسلسل.

كان بإمكاننا تشغيل الترحيلات من سطر الأوامر باستخدام&nbsp;<a href="https://github.com/sequelize/cli" target="_blank" rel="noreferrer noopener">أداة سطر أوامر Sequelize</a>. غير أننا نختار تنفيذ الترحيلات يدوياً من شيفرة البرنامج باستخدام&nbsp;<a href="https://github.com/sequelize/umzug" target="_blank" rel="noreferrer noopener">مكتبة Umzug</a>. لنثبّت المكتبة

```bash
npm install umzug
```

لنغيّر الملف <em>util/db.js</em> الذي يتعامل مع الاتصال بقاعدة البيانات كما يلي:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }
```

تُنفَّذ الآن دالة&nbsp;<em>runMigrations</em>&nbsp;التي تجري الترحيلات في كل مرة يفتح فيها التطبيق اتصالاً بقاعدة البيانات عند بدء تشغيله. وتتتبّع Sequelize أي الترحيلات أُكملت بالفعل، لذا إذا لم تكن هناك ترحيلات جديدة، فإن تنفيذ دالة&nbsp;<em>runMigrations</em>&nbsp;لا يفعل شيئاً.

لنبدأ الآن من صفحة بيضاء ونحذف جميع جداول قاعدة البيانات الموجودة من التطبيق:

```
username =&gt; drop table notes;
username =&gt; drop table users;
username =&gt; \d
Did not find any relations.
```

لنشغّل التطبيق. وستُطبع رسالة عن حالة الترحيلات في السجل

```sql
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20260211_00_initialize_notes_and_users.js' ] }
database connected
```

وإذا أعدنا تشغيل التطبيق، يُظهر السجل أيضاً أن الترحيل لم يُعَد.

يبدو مخطط قاعدة بيانات التطبيق الآن كما يلي

```
defaultdb=> \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
```

إذن أنشأت Sequelize جدولاً باسم&nbsp;<em>migrations</em>&nbsp;يتيح لها تتبّع الترحيلات التي نُفّذت. ومحتويات الجدول كما يلي:

```
<code>defaultdb=> select * from migrations;
                   name
-------------------------------------------
  20260211_00_initialize_notes_and_users.j<span style="font-family: inherit; text-align: initial;">s</span></code>
```

لننشئ بعض المستخدمين في قاعدة البيانات، وكذلك مجموعة من الملاحظات، وبعد ذلك نكون مستعدين لتوسيع التطبيق.

الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step6" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step6</em>.

### مستخدم مشرف وتعطيل المستخدمين

إذن نريد إضافة حقلين منطقيين إلى جدول&nbsp;<em>users</em>
- يشير الحقل&nbsp;<em>admin</em>&nbsp;إلى ما إذا كان المستخدم مشرفاً
- ويشير الحقل&nbsp;<em>disabled</em>&nbsp;إلى ما إذا كان حساب المستخدم قد عُطّل.

لننشئ الترحيل الذي يعدّل قاعدة البيانات في الملف <em>migrations/20260211_02_admin_and_disabled_to_users.js</em>:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

أجرِ التغييرات المقابلة على النموذج المقابل لجدول&nbsp;<em>users</em>:

```
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
```

وعند تنفيذ الترحيل الجديد عند إعادة تشغيل الشيفرة، يتغيّر المخطط كما هو مطلوب:

```
username-&gt; \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          |
 disabled | boolean                |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

لنوسّع الآن المتحكمات كما يلي. نمنع تسجيل الدخول إذا كانت قيمة الحقل&nbsp;<em>disabled</em>&nbsp;في المستخدم مضبوطة على&nbsp;<em>true</em>:

```js
router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user &amp;&amp; passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

لنعطّل المستخدم&nbsp;<em>jakousa</em>&nbsp;باستخدام معرّفه:

```sql
username => update users set disabled=true where id=4;
UPDATE 1
username => select * from users;
 id | username |              name               | admin | disabled
----+----------+---------------------------------+-------+----------
  2 | mluukkai | Matti Luukkainen                | f     | f
  4 | jakousa  | Jami Kousa (The Docker Captain) | f     | t
  3 | ousa     | Outi Savolainen                 | t     | f
```

وتأكد من أن تسجيل الدخول لم يعد ممكناً

![صورة توضيحية](/images/mooc/97c0efb30c73.webp)

لننشئ مساراً (في الملف controllers/users.js) يتيح للمشرف تغيير حالة حساب مستخدم:

```js
const isAdmin = async (req, res, next) =&gt; {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) =&gt; {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

يُستخدم وسيطان هنا؛ الوسيط الأول المسمى&nbsp;<em>tokenExtractor</em>&nbsp;هو نفسه المستخدم في مسار إنشاء الملاحظات، أي أنه يضع الرمز المفكوك الترميز في حقل&nbsp;<em>decodedToken</em>&nbsp;من كائن الطلب. أما الوسيط الثاني&nbsp;<em>isAdmin</em>&nbsp;فيتحقق مما إذا كان المستخدم مشرفاً، وإن لم يكن كذلك تُضبط حالة الطلب على 401 وتُعاد رسالة خطأ مناسبة.

لاحظ كيف يُسلسَل&nbsp;<em>وسيطان</em>&nbsp;إلى المسار، وكلاهما يُنفَّذ قبل معالج المسار الفعلي. ومن الممكن تسلسل أي عدد من الوسطاء إلى الطلب.

نُقل الوسيط <em>tokenExtractor</em> الآن إلى الملف <em>util/middleware.js</em> لأنه يُستخدم من مواقع متعددة:

```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const tokenExtractor = (req, res, next) =&gt; {
  const authorization = req.get('authorization')
  if (authorization &amp;&amp; authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

وربما من الجيد أيضاً نقل الوسيط <em>isAdmin</em> إلى الملف نفسه.

يمكن للمشرف الآن إعادة تمكين المستخدم&nbsp;<em>jakousa</em>&nbsp;بتوجيه طلب PUT إلى&nbsp;<em>/api/users/jakousa</em>&nbsp;مرفقاً بالبيانات التالية:

```json
{
    "disabled": false
}
```

كما أشرنا في&nbsp;<a href="/part4/token_authentication#problems-of-token-based-authentication" target="_blank" rel="noreferrer noopener">نهاية الجزء الرابع</a>، فإن طريقة تنفيذنا لتعطيل المستخدمين هنا إشكالية. إذ لا يُتحقق مما إذا كان المستخدم معطّلاً إلا عند&nbsp;<em>تسجيل الدخول</em>؛ فإذا كان لدى المستخدم رمز مميز في وقت تعطيله، فقد يواصل استخدام الرمز نفسه، لأنه لم تُحدَّد مدة صلاحية للرمز ولا يُتحقق من حالة تعطيل المستخدم عند إنشاء الملاحظات.

قبل أن نمضي قدماً، لننشئ سكربت npm للتطبيق يتيح لنا التراجع عن الترحيل السابق. فليس كل شيء يسير على ما يرام من المحاولة الأولى عند تطوير الترحيلات.

لنعدّل الملف&nbsp;<em>util/db.js</em>&nbsp;كما يلي:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
```

لننشئ ملفاً هو&nbsp;<em>util/rollback.js</em>&nbsp;يتيح لسكربت npm تنفيذ دالة التراجع عن الترحيل المحددة:

```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

والسكربت في الملف <em>package.json</em>:

```json
{
  "scripts": {
    "dev": "node --watch index.js",
    "migration:down": "node util/rollback.js"
  },
}
```

إذن يمكننا الآن التراجع عن الترحيل السابق بتنفيذ&nbsp;<em>npm run migration:down</em>&nbsp;من سطر الأوامر.

تُنفَّذ الترحيلات حالياً تلقائياً عند بدء تشغيل البرنامج. وفي مرحلة تطوير البرنامج، قد يكون من الأنسب أحياناً تعطيل التنفيذ التلقائي للترحيلات وإجراء الترحيلات يدوياً من سطر الأوامر.

الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step7" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step7</em>.

<div class="tasks">

**18. إعداد الترحيلات**

</div>

<div class="tasks">

**19. تذكّر السنة**

</div>

### علاقات متعدد إلى متعدد

سنواصل توسيع التطبيق بحيث يمكن إضافة كل مستخدم إلى واحد أو أكثر من&nbsp;<em>الفرق</em>.

بما أن عدداً اعتباطياً من المستخدمين يمكنهم الانضمام إلى فريق واحد، ويمكن لمستخدم واحد الانضمام إلى عدد اعتباطي من الفرق، فإننا نتعامل مع علاقة <a href="https://sequelize.org/master/manual/assocs.html#many-to-many-relationships" target="_blank" rel="noreferrer noopener">متعدد إلى متعدد</a>، وهي تُنفَّذ تقليدياً في قواعد البيانات العلائقية باستخدام <em>جدول ربط</em>.

لننشئ الآن الشيفرة اللازمة لجدول الفرق وكذلك جدول الربط. الترحيل (المحفوظ في الملف <em>20260211_03_add_teams_and_memberships.js</em>) كما يلي:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
    await queryInterface.createTable('memberships', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('memberships')
    await queryInterface.dropTable('teams')
  },
}
```

تحتوي النماذج على الشيفرة نفسها تقريباً الموجودة في الترحيل. نموذج الفريق في&nbsp;<em>models/team.js</em>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

نموذج جدول الربط في <em>models/membership.js</em>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

إذن أعطينا جدول الربط اسماً يصفه جيداً، وهو&nbsp;<em>membership</em>. ولا يوجد دائماً اسم مناسب لجدول الربط، وفي هذه الحالة يمكن أن يكون اسم جدول الربط مزيجاً من أسماء الجداول المربوطة، فمثلاً قد يناسب <em>user_teams</em> حالتنا.

نضيف إضافة صغيرة إلى الملف&nbsp;<em>models/index.js</em>&nbsp;لربط الفرق والمستخدمين على مستوى الشيفرة باستخدام دالة&nbsp;<a href="https://sequelize.org/docs/v6/core-concepts/assocs/#implementation-2" target="_blank" rel="noreferrer noopener">belongsToMany</a>.

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

module.exports = {
  Note, User, Team, Membership
}
```

لاحظ الفرق بين ترحيل جدول الربط والنموذج عند تعريف حقول المفاتيح الأجنبية. أثناء الترحيل، تُعرَّف الحقول بصيغة snake case:

```
await queryInterface.createTable('memberships', {
  // ...
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  }
})
```

وفي النموذج، تُعرَّف الحقول نفسها بصيغة camel case:

```
Membership.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
  // ...
})
```

لننشئ الآن فريقين من طرفية psql، وكذلك بعض العضويات:

```sql
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

ثم تُضاف معلومات فرق المستخدمين إلى المسار الخاص بجلب جميع المستخدمين

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
      }
    ]
  })
  res.json(users)
})
```

سيلاحظ الأكثر انتباهاً أن الاستعلام المطبوع في الطرفية يجمع الآن ثلاثة جداول.

الحل جيد جداً، لكن فيه عيب واحد. فالنتيجة تتضمن أيضاً خصائص صف جدول الربط، مع أننا لا نريدها:

![صورة توضيحية](/images/mooc/b99243067a92.webp)

بقراءة التوثيق بعناية، يمكنك إيجاد&nbsp;<a href="https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table" target="_blank" rel="noreferrer noopener">حل</a>:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.json(users)
})
```

الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step8" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع<em> step8</em>.
### ملاحظة عن خصائص كائنات نماذج Sequelize

تضمّن تعريف نماذجنا الأسطر التالية من بين أسطر أخرى:

```
User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

تتيح هذه الأسطر لـSequelize إجراء استعلامات تجلب، مثلاً، جميع ملاحظات المستخدمين أو جميع أعضاء فريق.

وبفضل هذه التعريفات، يمكننا أيضاً الوصول مباشرة في الشيفرة إلى ملاحظات المستخدم مثلاً. فمثلاً، تبحث الشيفرة التالية عن المستخدم ذي المعرّف 1 وتطبع الملاحظات المرتبطة بذلك المستخدم:

```js
const user = await User.findByPk(1, {
  include: {
    model: Note
  }
})

user.notes.forEach(note =&gt; {
  console.log(note.content)
})
```

وهكذا يُرفق تعريف&nbsp;<em>User.hasMany(Note)</em>&nbsp;خاصية&nbsp;<em>notes</em>&nbsp;بكائن&nbsp;<em>user</em>، ما يتيح الوصول إلى الملاحظات التي أنشأها المستخدم. وبالمثل، يُرفق تعريف&nbsp;<em>User.belongsToMany(Team, { through: Membership }))</em>&nbsp;خاصية&nbsp;<em>teams</em>&nbsp;بكائن&nbsp;<em>user</em>، ويمكن استخدامها أيضاً في الشيفرة:

```js
const user = await User.findByPk(1, {
  include: {
    model: Team
  }
})

user.teams.forEach(team => {
  console.log(team.name)
})
```

لنفترض أننا نريد إعادة كائن JSON من مسار مستخدم واحد يحتوي على اسم المستخدم واسم الدخول وعدد الملاحظات المنشأة. يمكننا أن نجرّب ما يلي:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    user.note_count = user.notes.length
    delete user.notes
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

إذن حاولنا إضافة الحقل&nbsp;<em>noteCount</em>&nbsp;إلى الكائن الذي تعيده Sequelize وحذف الحقل&nbsp;<em>notes</em>&nbsp;منه. غير أن هذا الأسلوب لا يعمل لأن الكائنات التي تعيدها Sequelize ليست كائنات عادية يمكننا إضافة حقول جديدة إليها كما نشاء.

الحل الأفضل هو إنشاء كائن جديد تماماً استناداً إلى البيانات المجلوبة من قاعدة البيانات:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    res.json({
      username: user.username,
      name: user.name,
      note_count: user.notes.length
    })
  } else {
    res.status(404).end()
  }
})
```

### إعادة النظر في علاقات متعدد إلى متعدد

لنُنشئ علاقة أخرى متعدد إلى متعدد في التطبيق. كل ملاحظة مرتبطة بالمستخدم الذي أنشأها عبر مفتاح أجنبي. وقد تقرر الآن أن يدعم التطبيق أيضاً إمكانية ربط الملاحظة بمستخدمين آخرين، وأن يرتبط المستخدم بعدد اعتباطي من الملاحظات التي أنشأها مستخدمون آخرون. والفكرة أن هذه الملاحظات هي التي&nbsp;<em>علّمها</em>&nbsp;المستخدم لنفسه.

لنُنشئ جدول ربط باسم&nbsp;<em>user_notes</em>&nbsp;لهذه الحالة. والترحيل، المحفوظ في الملف <em>20260211_04_add_user_notes.js</em>، مباشر وبسيط:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('user_notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'notes', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('user_notes')
  },
}
```

كما لا يوجد شيء خاص في النموذج:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserNotes extends Model {}

UserNotes.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'notes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_notes'
})

module.exports = UserNotes
```

أما الملف&nbsp;<em>models/index.js</em>&nbsp;فيأتي بتغيير طفيف عما رأيناه سابقاً:

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes')

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })

module.exports = {
  Note, User, Team, Membership, UserNotes
}
```

مرة أخرى، تُستخدم&nbsp;<em>belongsToMany</em>&nbsp;لربط المستخدم بملاحظاته. ويتم الربط عبر جدول الربط المقابل للنموذج UserNotes. غير أننا هذه المرة نعطي&nbsp;<em>اسماً مستعاراً</em>&nbsp;للخاصية المتكوّنة باستخدام الكلمة المفتاحية as. فالاسم الافتراضي&nbsp;<em>user.notes</em>&nbsp;كان سيتداخل مع معناه السابق، أي الملاحظات التي أنشأها المستخدم.

نوسّع مسار المستخدم الفردي ليعيد فرق المستخدم وملاحظاته الخاصة والملاحظات الأخرى التي علّمها المستخدم:

```js
router.get('/:id', async (req, res) =&gt; {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

وفي سياق include، يجب الآن استخدام الاسم المستعار&nbsp;<em>marked_notes</em>&nbsp;الذي عرّفناه للتو بالخاصية&nbsp;<em>as</em>.

لاختبار الميزة، لننشئ بعض بيانات الاختبار في قاعدة البيانات:

```sql
insert into user_notes (user_id, note_id) values (3, 1);
insert into user_notes (user_id, note_id) values (3, 3);
```

تبدو النتيجة النهائية جيدة:

![صورة توضيحية](/images/mooc/8fe5b762dfd2.webp)

ماذا لو أردنا تضمين معلومات عن كاتب الملاحظة في الملاحظات التي علّمها المستخدم أيضاً؟ يمكن فعل ذلك بإضافة&nbsp;<em>include</em>&nbsp;إلى الملاحظات المعلَّمة:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

وأخيراً نحصل على ما نريد:

![صورة توضيحية](/images/mooc/09d7a4b213c2.webp)

الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step9" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step9</em>.

<div class="tasks">

**20. قائمة القراءة**

</div>

<div class="tasks">

**21. توسيع قائمة القراءة**

</div>

<div class="tasks">

**22. مسك الدفاتر**

</div>

<div class="tasks">

**23. مسك دفاتر أفضل**

</div>

<div class="tasks">

**24. مزيد من التحكم**

</div>

### ملاحظات ختامية

تطبيقنا الآن في حالة مقبولة على الأقل. غير أننا قبل أن نختتم هذا القسم، سنتناول بضع نقاط أخرى.

#### الجلب المتلهف مقابل الجلب الكسول

عندما نُجري استعلامات باستخدام الخاصية&nbsp;<em>include</em>:

```
User.findOne({
  include: {
    model: note
  }
})
```

يتسبب هذا في <a href="https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations" target="_blank" rel="noreferrer noopener">جلب متلهف (eager)</a>، أي أن جميع صفوف الجداول المرتبطة بالمستخدم عبر استعلام الربط، وفي المثال الملاحظات التي أنشأها المستخدم، تُجلب من قاعدة البيانات في الوقت نفسه. وهذا غالباً ما نريده، لكن هناك أيضاً حالات تريد فيها إجراء&nbsp;<em>جلب كسول (lazy)</em>، أي البحث عن الفرق المرتبطة بالمستخدم فقط عند الحاجة إليها.

لنعدّل الآن مسار المستخدم الفردي بحيث يجلب فرق المستخدم فقط إذا كان معامل الاستعلام&nbsp;<em>teams</em>&nbsp;مضبوطاً في الطلب:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
    ]
  })

  if (!user) {
    return res.status(404).end()
  }

  let teams = undefined
  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: []
    })
  }
  res.json({ ...user.toJSON(), teams })
})
```

إذن الآن، لا يجلب استعلام&nbsp;<em>User.findByPk</em>&nbsp;الفرق، بل تُجلب عند الحاجة بواسطة دالة&nbsp;<em>user</em>&nbsp;المسماة&nbsp;<em>getTeams</em>&nbsp;التي تولّدها Sequelize تلقائياً لكائن النموذج. وتُولَّد تلقائياً دوال مشابهة تبدأ بـ&nbsp;<em>get</em>&nbsp;وغيرها من الدوال المفيدة&nbsp;<a href="https://sequelize.org/master/manual/assocs.html#special-methodsmixins-added-to-instances" target="_blank" rel="noreferrer noopener">عند تعريف ارتباطات الجداول</a>&nbsp;على مستوى Sequelize.

#### ميزات النماذج

هناك بعض الحالات التي لا نريد فيها، افتراضياً، التعامل مع جميع صفوف جدول معين. ومن هذه الحالات ألا نريد عادةً عرض المستخدمين الذين <em>عُطّلوا</em> في تطبيقنا. وفي مثل هذه الحالة، يمكننا تعريف <a href="https://sequelize.org/master/manual/scopes.html" target="_blank" rel="noreferrer noopener">النطاق (scope)</a> الافتراضي للنموذج كما يلي:

```js
class User extends Model {}

User.init({
  // تعريفات الحقول
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
})

module.exports = User
```

الآن أصبح الاستعلام الناتج عن استدعاء الدالة&nbsp;<em>User.findAll()</em>&nbsp;يتضمن شرط WHERE التالي:

```
WHERE "user". "disabled" = false;
```

وبالنسبة للنماذج، يمكن تعريف نطاقات أخرى أيضاً:

```js
User.init({
  // تعريفات الحقول
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    },
  }
})
```

تُستخدم النطاقات كما يلي:

```js
// جميع المشرفين
const adminUsers = await User.scope('admin').findAll()

// جميع المستخدمين غير النشطين
const disabledUsers = await User.scope('disabled').findAll()

// المستخدمون الذين يحتوي اسمهم على النص jami
const jamiUsers = await User.scope({ method: ['name', '%jami%'] }).findAll()
```

ومن الممكن أيضاً تسلسل النطاقات:

```js
// مشرفون يحتوي اسمهم على النص jami
const jamiUsers = await User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

بما أن نماذج Sequelize هي أصناف <a href="https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes" target="_blank" rel="noreferrer noopener">JavaScript</a> عادية، فمن الممكن إضافة دوال جديدة إليها.

وفيما يلي مثالان:

```js
const { Model, DataTypes, Op } = require('sequelize')

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {

  async numberOfNotes() {
    return (await this.getNotes()).length
  }

  static async withNotes(limit){
    return await User.findAll({
      attributes: {
        include: [[ sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count" ]]
      },
      include: [
        {
          model: Note,
          attributes: []
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
}

User.init({
  // ...
})

module.exports = User
```

الدالة الأولى&nbsp;<em>numberOfNotes</em>&nbsp;هي&nbsp;<em>دالة نسخة (instance method)</em>، أي أنها تُستدعى على نسخ النموذج:

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.numberOfNotes()
console.log(`Jami has created ${cnt} notes`)
```

وهكذا تشير الكلمة المفتاحية&nbsp;<em>this</em>&nbsp;داخل دالة النسخة إلى النسخة نفسها:

```js
async numberOfNotes() {
  return (await this.getNotes()).length
}
```

أما الدالة الثانية <em>withNotes</em> فتعيد المستخدمين الذين لديهم على الأقل العدد المحدد من الملاحظات. وهي <em>دالة صنف (class method)</em>، أي أنها تُستدعى مباشرة على النموذج:

```js
const users = await User.withNotes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### تكرار الشيفرة في النماذج والترحيلات

لاحظنا أن شيفرة النماذج والترحيلات متشابهة جداً. فمثلاً، نموذج الفرق

```js
class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

والترحيل يحتويان على الكثير من الشيفرة نفسها

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) =&gt; {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
  },
  down: async ({ context: queryInterface }) =&gt; {
    await queryInterface.dropTable('teams')
  },
}
```

ألا يمكننا تحسين الشيفرة بحيث يصدّر النموذج مثلاً الأجزاء المشتركة اللازمة للترحيل؟

المشكلة أن تعريف النموذج قد يتغير بمرور الوقت، فمثلاً قد يتغير حقل الاسم أو يتغير نوع بياناته. ويجب أن يكون بالإمكان تنفيذ الترحيلات بنجاح في أي وقت من البداية إلى النهاية، وإذا كانت الترحيلات تعتمد على أن يحتوي النموذج على محتوى معين، فقد لا يبقى ذلك صحيحاً بعد شهر أو سنة. لذلك، ورغم «النسخ واللصق»، ينبغي أن تكون شيفرة الترحيل منفصلة تماماً عن شيفرة النموذج.

ومن الحلول استخدام <a href="https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration" target="_blank" rel="noreferrer noopener">أداة سطر الأوامر</a> الخاصة بـSequelize، التي تولّد كلاً من النماذج وملفات الترحيل بناءً على أوامر تُعطى في سطر الأوامر. فمثلاً، سيُنشئ الأمر التالي نموذج&nbsp;<em>User</em>&nbsp;بخصائص&nbsp;<em>name</em>&nbsp;و&nbsp;<em>username</em>&nbsp;و&nbsp;<em>admin</em>، بالإضافة إلى الترحيل الذي يدير إنشاء جدول قاعدة البيانات:

```bash
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

ومن سطر الأوامر، يمكنك أيضاً تنفيذ عمليات التراجع، أي إلغاء الترحيلات. لكن توثيق سطر الأوامر ناقص للأسف، وقد قررنا في هذا المقرر إجراء النماذج والترحيلات يدوياً. وقد يكون هذا الحل حكيماً أو لا يكون.

<div class="tasks">

**25. الختام الكبير**

</div>

<div class="tasks">

**26. الفحص النهائي**

</div>

<div class="tasks">

**27. مستودع GitHub الخاص بك**

</div>
