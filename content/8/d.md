---
part: 8
letter: d
title: "الفصل 4: قاعدة البيانات وإدارة المستخدمين"
mainImage: /images/part-8.svg
lang: ar
---
في هذا الفصل، سنبدأ باستخدام قاعدة بيانات لتخزين البيانات ونوسّع التطبيق بإدارة المستخدمين. لكن أولاً، سنعيد هيكلة شيفرة الواجهة الخلفية. يمكن العثور على الشيفرة الحالية للواجهة الخلفية لتطبيق دليل الهاتف على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part8-3</em>.

## إعادة هيكلة الواجهة الخلفية

حتى الآن، كتبنا كل الشيفرة في ملف&nbsp;<em>index.js</em>. مع نمو التطبيق، لم يعد هذا منطقياً: فكلما طال الملف، ضعفت قابلية قراءته وفهمه. كما أن من ممارسات البرمجة الجيدة فصل مسؤوليات التطبيق المختلفة في وحدات خاصة بها.

لنُعِد الآن هيكلة الواجهة الخلفية بتقسيمها إلى عدة ملفات.

سنبدأ باستخراج مخطط GraphQL الخاص بالتطبيق إلى ملف يُسمّى&nbsp;<em>schema.js</em>:

```js
const typeDefs = /* GraphQL */ `
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`

module.exports = typeDefs
```

بعد ذلك، سننقل الشيفرة المسؤولة عن resolvers إلى وحدتها الخاصة&nbsp;<em>resolvers.js</em>:

```js
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
]

const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: (root, args) =&gt; {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) =&gt;
        args.phone === 'YES' ? person.phone : !person.phone
      return persons.filter(byPhone)
    },
    findPerson: (root, args) =&gt; persons.find((p) =&gt; p.name === args.name),
  },
  Person: {
    address: ({ street, city }) =&gt; {
      return {
        street,
        city,
      }
    },
  },
  Mutation: {
    addPerson: (root, args) =&gt; {
      if (persons.find((p) =&gt; p.name === args.name)) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
    editNumber: (root, args) =&gt; {
      const person = persons.find((p) =&gt; p.name === args.name)
      if (!person) {
        return null
      }

      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map((p) =&gt; (p.name === args.name ? updatedPerson : p))
      return updatedPerson
    },
  },
}

module.exports = resolvers
```

للتبسيط، وُضعت الآن مصفوفة&nbsp;<em>persons</em>&nbsp;التي تحمل بيانات الأشخاص في الملف نفسه مع الـ resolvers. وستُزال المصفوفة قريباً عندما ننتقل إلى استخدام قاعدة بيانات لتخزين البيانات.

أخيراً، سننقل أيضاً الشيفرة المسؤولة عن تشغيل خادم Apollo إلى ملفها الخاص&nbsp;<em>server.js</em>:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = (port) =&gt; {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
  }).then(({ url }) =&gt; {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
```

أصبح تشغيل خادم Apollo الآن يُعالَج داخل دالة&nbsp;<em>startServer</em>&nbsp;التي عرّفناها بأنفسنا. وهذا يتيح لنا تصدير الدالة وبدء الخادم من خارج الوحدة، من ملف&nbsp;<em>index.js</em>. وتأخذ الدالة كمعامل المنفذ الذي سيستمع عليه Apollo Server.

لنثبّت مكتبة&nbsp;<em>dotenv</em>&nbsp;حتى نتمكن من تعريف متغيرات البيئة في ملف&nbsp;<em>.env</em>:

```bash
npm install dotenv
```

لم تبقَ سوى كمية صغيرة من الشيفرة في&nbsp;<em>index.js</em>. وبعد إعادة الهيكلة، يكون محتواها كما يلي:

```js
require('dotenv').config()

const startServer = require('./server')

const PORT = process.env.PORT || 4000

startServer(PORT)
```

تُقرأ متغيرات البيئة أولاً من ملف&nbsp;<em>.env</em>&nbsp;باستخدام مكتبة&nbsp;<em>dotenv</em>. ويُقرأ المنفذ المستخدم الآن من متغير بيئة، إن كان معرّفاً. وإذا لم يُعثر على متغير البيئة&nbsp;<em>PORT</em>، يُستخدم المنفذ الافتراضي 4000—وهو أيضاً المنفذ الذي تتوقع الواجهة الأمامية حالياً أن يعمل الخادم عليه. وأخيراً، يُبدأ Apollo Server باستدعاء الدالة startServer.

في الوقت الحالي، محتوى&nbsp;<em>index.js</em>&nbsp;مجرد هيكل أولي، لكنه سيتضمن المزيد مع نمو التطبيق. مثلاً، عندما ننتقل قريباً إلى استخدام قاعدة بيانات لتخزين البيانات، يجب إنشاء اتصال قاعدة البيانات قبل بدء الخادم.

أصبحت مسؤوليات التطبيق الآن مفصولة بوضوح:
- تعمل <em>index.js</em> كالبرنامج الرئيسي، ومسؤوليتها الوحيدة منطق بدء التشغيل. فهي تضمن بدء أجزاء التطبيق المختلفة بالترتيب الصحيح.
- يُعرَّف مخطط GraphQL في وحدة <em>schema.js</em>. وهو يصف بنية الـ API—مثلاً، أي الاستعلامات والـ mutations ممكنة عبر الـ API وما أنواع الحقول التي تمتلكها الكائنات المختلفة.
- يُعرَّف منطق التطبيق الفعلي في وحدة <em>resolvers.js</em>. ومسؤوليتها، مثلاً، تعريف ما يحدث فعلاً في مختلف الاستعلامات، ومن أين تُجلب البيانات، وكيف تُعالَج.
- تُعرَّف الشيفرة المسؤولة عن إعداد Apollo Server وتشغيله في وحدة منفصلة، <em>server.js</em>.

## Mongoose وApollo

لنبدأ الآن باستخدام قاعدة بيانات MongoDB في تطبيقنا. سنقدّم قاعدة البيانات باتباع النهج المستخدم في الجزأين <a href="/part3/saving_data_to_mongo_db" target="_blank" rel="noreferrer noopener">3</a> و<a href="/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">4</a>.

ثبّت Mongoose:

```bash
npm install mongoose
```

عرّف مخطط person في الملف&nbsp;<em>models/person.js</em>&nbsp;كما يلي:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

أدرجنا أيضاً بعض عمليات التحقق. إن <code>required: true</code>، الذي يضمن وجود قيمة، زائد فعلاً: فنحن نضمن بالفعل وجود الحقول عبر GraphQL. لكن من الجيد أيضاً إبقاء التحقق في قاعدة البيانات.

لننشئ وحدة منفصلة&nbsp;<em>db.js</em>&nbsp;للشيفرة التي تنشئ اتصال قاعدة البيانات:

```js
const mongoose = require('mongoose')

const connectToDatabase = async (uri) =&gt; {
  console.log('connecting to database URI:', uri)

  try {
    await mongoose.connect(uri)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connection to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectToDatabase
```

تعرّف الوحدة الدالة&nbsp;<code>connectToDatabase</code>، التي تستقبل عنوان URI لقاعدة البيانات كمعامل وتتولى الاتصال بقاعدة البيانات.

لنستخدم الوحدة في ملف&nbsp;<em>index.js</em>:

```js
require('dotenv').config()

const connectToDatabase = require('./db') // HIGHLIGHT LINE
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI // HIGHLIGHT LINE
const PORT = process.env.PORT || 4000

const main = async () =&gt; { // HIGHLIGHT LINE
  await connectToDatabase(MONGODB_URI) // HIGHLIGHT LINE
  startServer(PORT)
}

main()
```

لأن صيغة&nbsp;<em>async/await</em>&nbsp;لا يمكن استخدامها إلا داخل الدوال، نعرّف الآن دالة&nbsp;<em>main</em>&nbsp;بسيطة تتولى بدء التطبيق. وهذا يتيح لنا استدعاء الدالة التي تنشئ اتصال قاعدة البيانات باستخدام الكلمة المفتاحية&nbsp;<em>await</em>.

تُستخرج قيمة <code>MONGODB_URI</code> من متغير بيئة، لذا عليك إضافة قيمة مناسبة له في ملف <em>.env</em> بالطريقة نفسها كما في <a href="/part3/saving_data_to_mongo_db#defining-environment-variables-using-the-dotenv-library" target="_blank" rel="noreferrer noopener">الجزء 3</a>. يستدعي التطبيق أولاً الدالة التي تنشئ اتصال قاعدة البيانات، وبمجرد إنشاء اتصال قاعدة البيانات بنجاح، يبدأ خادم GraphQL.

سيتغيّر محتوى&nbsp;<em>resolvers.js</em>، المسؤول عن منطق التطبيق، شبه كلياً. ويمكننا جعل التطبيق يعمل إلى حد كبير بإجراء التغييرات التالية:

```js
const { GraphQLError } = require('graphql')
const Person = require('./models/person')

const resolvers = {
  Query: {
    personCount: async () =&gt; Person.collection.countDocuments(),
    allPersons: async (root, args) =&gt; {
      // الفلاتر مفقودة
      return Person.find({})
    },
    findPerson: async (root, args) =&gt; Person.findOne({ name: args.name }),
  },
  Person: {
    address: ({ street, city }) =&gt; {
      return {
        street,
        city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) =&gt; {
      const nameExists = await Person.exists({ name: args.name })

      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) =&gt; {
      const person = await Person.findOne({ name: args.name })

      if (!person) {
        return null
      }

      person.phone = args.phone
      return person.save()
    },
  },
}

module.exports = resolvers
```

التغييرات مباشرة تماماً. لكن هناك بضعة أمور جديرة بالملاحظة. كما نتذكر، في Mongo يُسمّى حقل تعريف الكائن&nbsp;<em>_id</em>&nbsp;وكان علينا سابقاً تحويل اسم الحقل إلى&nbsp;<em>id</em>&nbsp;بأنفسنا. أما الآن فيستطيع GraphQL فعل ذلك تلقائياً.

أمر آخر جدير بالملاحظة هو أن دوال resolver تُعيد الآن&nbsp;<em>promise</em>، بينما كانت سابقاً تُعيد كائنات عادية. وعندما يُعيد resolver قيمة promise، يُرسل خادم Apollo&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/resolvers#return-values" target="_blank" rel="noreferrer noopener">القيمة</a>&nbsp;التي يُحلّ إليها الـ promise.

مثلاً، إذا نُفّذت دالة resolver التالية،

```js
allPersons: async (root, args) =&gt; {
  return Person.find({})
},
```

فإن خادم Apollo ينتظر حلّ الـ promise، ثم يُعيد النتيجة. إذاً يعمل Apollo تقريباً هكذا:

```js
allPersons: async (root, args) =&gt; {
  const result = await Person.find({})
  return result
}
```

لنكمل resolver الـ<code>allPersons</code> ليأخذ المعامل الاختياري&nbsp;<code>phone</code>&nbsp;في الحسبان:

```js
Query: {
  // ..
  allPersons: async (root, args) =&gt; {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
  },
},
```

إذاً إذا لم يُعطَ للاستعلام معامل&nbsp;<code>phone</code>، تُعاد جميع الأشخاص. وإذا كانت قيمة المعامل&nbsp;<em>YES</em>، تُعاد نتيجة الاستعلام

```
Person.find({ phone: { $exists: true }})
```

أي الكائنات التي يمتلك فيها الحقل&nbsp;<code>phone</code>&nbsp;قيمة. وإذا كانت قيمة المعامل&nbsp;<em>NO</em>، يُعيد الاستعلام الكائنات التي لا يمتلك فيها الحقل&nbsp;<code>phone</code>&nbsp;أي قيمة:

```
Person.find({ phone: { $exists: false }})
```

## التحقق من الصحة

كما في GraphQL، يُتحقق الآن من المدخلات باستخدام عمليات التحقق المعرّفة في مخطط mongoose. ولمعالجة أخطاء التحقق المحتملة في المخطط، يجب إضافة كتلة <code>try/catch</code> لمعالجة الأخطاء إلى الدالة <code>save</code>. وعندما نصل إلى catch، نرمي استثناء&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a>&nbsp;مع رمز الخطأ :

```js
Mutation: {
  addPerson: async (root, args) =&gt; {
      const nameExists = await Person.exists({ name: args.name })

      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = new Person({ ...args })

// BEGIN HIGHLIGHT
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
// END HIGHLIGHT
  },
    editNumber: async (root, args) =&gt; {
      const person = await Person.findOne({ name: args.name })

      if (!person) {
        return null
      }

      person.phone = args.phone

// BEGIN HIGHLIGHT
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(`Saving number failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
// END HIGHLIGHT
    }
}
```

أضفنا أيضاً خطأ Mongoose والبيانات التي تسببت في الخطأ إلى كائن&nbsp;<em>extensions</em>&nbsp;الذي يُستخدم لإيصال مزيد من المعلومات عن سبب الخطأ إلى المستدعي. ويمكن للواجهة الأمامية عندها عرض هذه المعلومات للمستخدم، الذي يمكنه إعادة المحاولة بمدخلات أفضل.

يمكن العثور على شيفرة الواجهة الخلفية على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4" target="_blank" rel="noreferrer noopener">Github</a>، الفرع&nbsp;<em>part8-4</em>.

### المستخدم وتسجيل الدخول

لنضف إدارة المستخدمين إلى تطبيقنا. للتبسيط، لنفترض أن جميع المستخدمين لديهم كلمة المرور نفسها وهي مضمّنة مباشرة في النظام. سيكون من المباشر حفظ كلمات مرور فردية لجميع المستخدمين باتباع المبادئ من <a href="/part4/user_administration" target="_blank" rel="noreferrer noopener">الجزء 4</a>، لكن لأن تركيزنا على GraphQL، سنتجاوز كل هذه المتاعب الإضافية هذه المرة.

لننشئ مخطط المستخدم في الملف&nbsp;<em>models/user.js</em>:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

يرتبط كل مستخدم بمجموعة من الأشخاص الآخرين في النظام عبر حقل&nbsp;<code>friends</code>. والفكرة أنه عندما يضيف مستخدم، مثلاً&nbsp;<em>mluukkai</em>، شخصاً، مثلاً&nbsp;<em>Arto Hellas</em>، إلى القائمة، يُضاف الشخص إلى قائمة&nbsp;<code>friends</code>&nbsp;الخاصة به. وبهذه الطريقة، يمكن للمستخدمين المسجّلين دخولهم الحصول على عرض مخصّص خاص بهم في التطبيق.

تُعالَج عملية تسجيل الدخول وتحديد هوية المستخدم بالطريقة نفسها التي استخدمناها في <a href="/part4/token_authentication" target="_blank" rel="noreferrer noopener">الجزء 4</a> عندما استخدمنا REST، أي باستخدام الرموز (tokens).

لنوسّع مخطط GraphQL هكذا:

```
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(username: String!): User
  login(username: String!, password: String!): Token
}
```

يُعيد الاستعلام&nbsp;<code>me</code>&nbsp;المستخدم المسجّل دخوله حالياً. ويُنشأ المستخدمون الجدد عبر mutation الـ<code>createUser</code>، ويتم تسجيل الدخول عبر mutation الـ<code>login</code>.

لنثبّت مكتبة jsonwebtoken:

```bash
npm install jsonwebtoken
```

تكون resolvers الـ mutations الجديدة كما يلي:

```js
const jwt = require('jsonwebtoken')
const User = require('./models/user')

Mutation: {
  // ..
  createUser: async (root, args) =&gt; {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error =&gt; {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
  login: async (root, args) =&gt; {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

mutation المستخدم الجديدة مباشرة. تتحقق mutation الـ login من صلاحية زوج اسم المستخدم/كلمة المرور. وإذا كان صالحاً بالفعل، تُعيد رمز jwt مألوفاً من <a href="/part4/token_authentication" target="_blank" rel="noreferrer noopener">الجزء 4</a>. لاحظ أنه يجب تعريف <code>JWT_SECRET</code> في ملف <em>.env</em>.

يتم الآن إنشاء المستخدم كما يلي:

```
mutation {
  createUser (
    username: "mluukkai"
  ) {
    username
    id
  }
}
```

تبدو mutation تسجيل الدخول هكذا:

```
mutation {
  login (
    username: "mluukkai"
    password: "secret"
  ) {
    value
  }
}
```

كما في الحالة السابقة مع REST، الفكرة الآن أن يضيف المستخدم المسجّل دخوله الرمز الذي يحصل عليه عند تسجيل الدخول إلى جميع طلباته. وكما في REST، يُضاف الرمز إلى استعلامات GraphQL باستخدام ترويسة&nbsp;<em>Authorization</em>.

في Apollo Explorer، تُضاف الترويسة إلى الاستعلام هكذا:

![يعرض Apollo Explorer الترويسات مع Authorization وBearer token](/images/mooc/60f94bca66a8.webp)

في الواجهة الخلفية، الطريقة الأكثر ملاءمة لتمرير الرمز الذي يصل مع الطلب إلى الـ resolvers هي استخدام <a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a>&nbsp;الخاص بـ Apollo Server. وباستخدام context، يمكننا تنفيذ أمور مشتركة بين جميع الاستعلامات والـ mutations، مثلاً&nbsp;<a href="https://www.apollographql.com/blog/authorization-in-graphql/" target="_blank" rel="noreferrer noopener">تحديد هوية المستخدم</a>&nbsp;المرتبط بالطلب.

لنغيّر بدء تشغيل الواجهة الخلفية بحيث يتضمن الكائن المُمرَّر كمعامل ثانٍ إلى دالة&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/standalone/" target="_blank" rel="noreferrer noopener">startStandaloneServer</a>&nbsp;حقل&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a>، ولننشئ دالة مساعدة&nbsp;<code>getUserFromAuthHeader</code>&nbsp;للتحقق من صلاحية الرمز وإيجاد المستخدم في قاعدة البيانات:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken') // HIGHLIGHT LINE

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user') // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const getUserFromAuthHeader = async (auth) =&gt; {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}
// END HIGHLIGHT

const startServer = (port) =&gt; {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    // BEGIN HIGHLIGHT
    context: async ({ req }) =&gt; {
      const auth = req.headers.authorization
      const currentUser = await getUserFromAuthHeader(auth)
      return { currentUser }
    },
    // END HIGHLIGHT
  }).then(({ url }) =&gt; {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
```

إذاً تستخرج الشيفرة التي عرّفناها أولاً الرمز الموجود في ترويسة&nbsp;<code>Authorization</code>&nbsp;الخاصة بالطلب. وتفكّ دالة المساعدة&nbsp;<code>getUserFromAuthHeader</code>&nbsp;ترميز الرمز وتبحث عن المستخدم المقابل في قاعدة البيانات. وإذا لم يكن الرمز صالحاً أو تعذّر العثور على المستخدم، تُعيد الدالة&nbsp;<code>null</code>.

وأخيراً، يُضبط حقل context المسمّى&nbsp;<code>currentUser</code>&nbsp;على كائن المستخدم المقابل للطالب، أو على&nbsp;<code>null</code>&nbsp;إذا لم يُعثر على مستخدم:

```js
context: async ({ req }) =&gt; {
  const auth = req.headers.authorization
  const currentUser = await getUserFromAuthHeader(auth)
  return { currentUser } // HIGHLIGHT LINE
},
```

تُمرَّر قيمة context إلى الـ resolvers كـ&nbsp;<code>المعامل الثالث</code>. وresolver الخاص باستعلام&nbsp;<code>me</code>&nbsp;بسيط جداً: فهو يُعيد فقط المستخدم المسجّل دخوله حالياً، الذي يحصل عليه من معامل resolver المسمّى&nbsp;<code>context</code>، من الحقل&nbsp;<code>currentUser</code>:

```js
Query: {
  // ...
  me: (root, args, context) =&gt; {
    return context.currentUser
  }
},
```

إذا كانت الترويسة تحتوي على رمز صالح، يُعيد الاستعلام تفاصيل المستخدم الذي يحدده الرمز.

![يعرض Apollo Studio كائن استجابة الاستعلام](/images/mooc/646446e12fd0.webp)

## قائمة الأصدقاء

لنكمل الواجهة الخلفية للتطبيق بحيث تتطلب إضافة الأشخاص وتعديلهم تسجيل الدخول، وتُضاف الأشخاص المضافون تلقائياً إلى قائمة أصدقاء المستخدم.

لنزل أولاً من قاعدة البيانات كل الأشخاص غير الموجودين في قائمة أصدقاء أي مستخدم.

تتغيّر mutation الـ<code>addPerson</code>&nbsp;هكذا:

```js
Mutation: {
  // BEGIN HIGHLIGHT
  addPerson: async (root, args, context) =&gt; {
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
        }
      })
    }
    // END HIGHLIGHT

    const nameExists = await Person.exists({ name: args.name })

    if (nameExists) {
      throw new GraphQLError(`Name must be unique: ${args.name}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        },
      })
    }

    const person = new Person({ ...args })

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person) // HIGHLIGHT LINE
      await currentUser.save() // HIGHLIGHT LINE
    } catch (error) {
      throw new GraphQLError(`Saving person failed: ${error.message}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }

    return person
  },
  //...
}
```

إذا تعذّر العثور على مستخدم مسجّل دخوله في context، يُرمى&nbsp;<code>GraphQLError</code>&nbsp;برسالة مناسبة. ويتم الآن إنشاء الأشخاص الجدد بصيغة&nbsp;<code>async/await</code>&nbsp;لأنه إذا نجحت العملية، يُضاف الشخص المنشأ إلى قائمة أصدقاء المستخدم.

لنضف أيضاً إمكانية إضافة شخص إلى قائمة أصدقائك. مخطط الـ mutation كما يلي:

```
type Mutation {
  // ...
  addAsFriend(name: String!): User // HIGHLIGHT LINE
}
```

وresolver الخاص بالـ mutation:

```js
  addAsFriend: async (root, args, { currentUser }) =&gt; {
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }

    const nonFriendAlready = (person) =&gt;
      !currentUser.friends
        .map((f) =&gt; f._id.toString())
        .includes(person._id.toString())

    const person = await Person.findOne({ name: args.name })

    if (!person) {
      throw new GraphQLError("The name didn't found", {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        },
      })
    }

    if (nonFriendAlready(person)) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

لاحظ كيف يستخرج resolver المستخدم المسجّل دخوله من context عبر&nbsp;<em>التفكيك</em>. فبدلاً من حفظ&nbsp;<code>currentUser</code>&nbsp;في متغير منفصل داخل دالة

```js
addAsFriend: async (root, args, context) =&gt; {
  const currentUser = context.currentUser
```

يُستقبل مباشرة في تعريف معاملات الدالة:

```
addAsFriend: async (root, args, { currentUser }) =&gt; {
```

يُعيد الاستعلام التالي الآن قائمة أصدقاء المستخدم:

```
query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
```

يمكن العثور على شيفرة الواجهة الخلفية على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a>&nbsp;الفرع&nbsp;<em>part8-5</em>.

<div class="tasks">

**13. قاعدة البيانات، الجزء 1**

</div>

<div class="tasks">

**14. قاعدة البيانات، الجزء 2**

</div>

<div class="tasks">

**15. قاعدة البيانات، الجزء 3**

</div>

<div class="tasks">

**16. المستخدم وتسجيل الدخول**

</div>

<div class="tasks">

**17. مراجعة**

</div>
