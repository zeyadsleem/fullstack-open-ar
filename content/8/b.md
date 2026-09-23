---
part: 8
letter: b
title: "الفصل 2: خادم GraphQL"
mainImage: /images/part-8.svg
lang: ar
---
كان REST، المألوف لنا من الأجزاء السابقة من المقرر، منذ زمن طويل الطريقة الأكثر انتشاراً لتنفيذ الواجهات التي تقدمها الخوادم للمتصفحات، وبشكل عام للتكامل بين التطبيقات المختلفة على الويب.

في السنوات الأخيرة، أصبح&nbsp;<a href="http://graphql.org/" target="_blank" rel="noreferrer noopener">GraphQL</a>، الذي طوّرته Facebook، شائعاً في التواصل بين تطبيقات الويب والخوادم.

فلسفة GraphQL مختلفة جداً عن REST. فـ REST <em>قائمة على الموارد</em>. لكل مورد، مثلاً <em>مستخدم</em>، عنوانه الخاص الذي يعرّفه، مثلاً <em>/users/10</em>. وتُنفَّذ جميع العمليات على المورد عبر طلبات HTTP إلى عنوان URL الخاص به. ويعتمد الإجراء على طريقة HTTP المستخدمة.

إن اعتماد REST على الموارد يعمل جيداً في معظم الحالات. لكنه قد يكون مرهقاً بعض الشيء أحياناً.

لننظر في المثال التالي: يحتوي تطبيق قائمة المدونات لدينا على نوع من وظائف التواصل الاجتماعي، ونرغب في عرض قائمة بكل المدونات التي أضافها مستخدمون علّقوا على أي من مدونات المستخدمين الذين نتابعهم.

لو كان الخادم ينفّذ REST API، لكان علينا على الأرجح تنفيذ عدة طلبات HTTP من المتصفح قبل الحصول على كل البيانات التي نريدها. كما أن الطلبات ستعيد الكثير من البيانات غير الضرورية، وستكون الشيفرة في المتصفح معقدة إلى حدٍّ كبير على الأرجح.

لو كانت هذه وظيفة كثيرة الاستخدام، لأمكن تخصيص نقطة نهاية REST لها. لكن لو كثرت هذه السيناريوهات، لأصبح تنفيذ نقاط نهاية REST لها جميعاً مرهقاً للغاية.

خادم GraphQL مناسب تماماً لهذه الأنواع من الحالات.

المبدأ الأساسي في GraphQL هو أن الشيفرة في المتصفح تُكوّن&nbsp;<em>استعلاماً</em>&nbsp;يصف البيانات المطلوبة، وترسله إلى الـ API عبر طلب HTTP من نوع POST. وخلافاً لـ REST، تُرسل جميع استعلامات GraphQL إلى العنوان نفسه، ويكون نوعها POST.

يمكن جلب البيانات الموصوفة في السيناريو أعلاه باستعلام (تقريبي) كالتالي:

```
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```

يمكن تفسير محتوى&nbsp;<code>FetchBlogsQuery</code>&nbsp;تقريباً كالتالي: ابحث عن مستخدم اسمه&nbsp;<code>"mluukkai"</code>، ولكل من&nbsp;<code>followedUsers</code>&nbsp;لديه، ابحث عن كل&nbsp;<code>blogs</code>&nbsp;الخاصة به، ولكل مدونة، كل&nbsp;<code>comments</code>&nbsp;الخاصة بها، ولكل&nbsp;<code>user</code>&nbsp;كتب كل تعليق، ابحث عن&nbsp;<code>blogs</code>&nbsp;الخاصة به، وأعِد&nbsp;<code>title</code>&nbsp;لكل منها.

ستكون استجابة الخادم كائن JSON كالتالي تقريباً:

```json
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

يبقى منطق التطبيق بسيطاً، وتحصل الشيفرة في المتصفح على البيانات التي تحتاجها بالضبط باستعلام واحد.

## المخططات والاستعلامات

سنتعرف على أساسيات GraphQL بتنفيذ نسخة GraphQL من تطبيق دليل الهاتف من الجزأين 2 و3.

في قلب كل تطبيقات GraphQL يوجد&nbsp;<a href="https://graphql.org/learn/schema/" target="_blank" rel="noreferrer noopener">مخطط</a>، يصف البيانات المرسلة بين العميل والخادم. المخطط الأولي لدليل الهاتف لدينا كالتالي:

```
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

يصف المخطط&nbsp;<a href="https://graphql.org/learn/schema/#type-system" target="_blank" rel="noreferrer noopener">نوعين</a>. النوع الأول،&nbsp;<em>Person</em>، يحدد أن للأشخاص خمسة حقول. أربعة من الحقول من النوع&nbsp;<em>String</em>، وهو أحد&nbsp;<a href="https://graphql.org/learn/schema/#scalar-types" target="_blank" rel="noreferrer noopener">الأنواع القياسية</a>&nbsp;في GraphQL. يجب إعطاء قيمة لجميع حقول String، باستثناء&nbsp;<em>phone</em>. ويُشار إلى ذلك بعلامة التعجب في المخطط. نوع الحقل&nbsp;<em>id</em>&nbsp;هو&nbsp;<em>ID</em>. حقول&nbsp;<em>ID</em>&nbsp;نصوص، لكن GraphQL يضمن أنها فريدة.

النوع الثاني هو&nbsp;<a href="https://graphql.org/learn/queries/" target="_blank" rel="noreferrer noopener">Query</a>. عملياً، يصف كل مخطط GraphQL نوع Query، الذي يحدد أنواع الاستعلامات التي يمكن إجراؤها على الـ API.

يصف دليل الهاتف ثلاثة استعلامات مختلفة. يعيد&nbsp;<code>personCount</code>&nbsp;عدداً صحيحاً، ويعيد&nbsp;<code>allPersons</code>&nbsp;قائمة من كائنات&nbsp;<em>Person</em>، ويُعطى&nbsp;<em>findPerson</em>&nbsp;معاملاً نصياً ويعيد كائن&nbsp;<em>Person</em>.

مرة أخرى، تُستخدم علامات التعجب لتحديد القيم المُعادة والمعاملات التي هي&nbsp;<em>غير قابلة للقيمة الفارغة (Non-Null)</em>. سيعيد&nbsp;<code>personCount</code>&nbsp;عدداً صحيحاً بالتأكيد. ويجب إعطاء الاستعلام&nbsp;<code>findPerson</code>&nbsp;نصاً كمعامل. ويعيد الاستعلام كائن <em>Person</em> أو&nbsp;<em>null</em>. ويعيد&nbsp;<code>allPersons</code>&nbsp;قائمة من كائنات&nbsp;<em>Person</em>، ولا تحتوي القائمة على أي قيم&nbsp;<em>null</em>.

إذن يصف المخطط الاستعلامات التي يمكن للعميل إرسالها إلى الخادم، وأنواع المعاملات التي يمكن أن تمتلكها الاستعلامات، وأنواع البيانات التي تعيدها الاستعلامات.

أبسط الاستعلامات،&nbsp;<code>personCount</code>، يبدو كالتالي:

```
query {
  personCount
}
```

بافتراض أن تطبيقنا حفظ معلومات ثلاثة أشخاص، ستبدو الاستجابة كالتالي:

```json
{
  "data": {
    "personCount": 3
  }
}
```

الاستعلام الذي يجلب معلومات جميع الأشخاص،&nbsp;<code>allPersons</code>، أكثر تعقيداً قليلاً. ولأن الاستعلام يعيد قائمة من كائنات&nbsp;<em>Person</em>، يجب أن يصف الاستعلام&nbsp;<em>أي&nbsp;<a href="https://graphql.org/learn/queries/#fields" target="_blank" rel="noreferrer noopener">حقول</a></em>&nbsp;من الكائنات سيعيدها:

```
query {
  allPersons {
    name
    phone
  }
}
```

قد تبدو الاستجابة كالتالي:

```json
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

يمكن جعل الاستعلام يعيد أي حقل موصوف في المخطط. على سبيل المثال، ما يلي ممكن أيضاً:

```
query {
  allPersons{
    name
    city
    street
  }
}
```

يوضح المثال الأخير استعلاماً يتطلب معاملاً، ويعيد تفاصيل شخص واحد.

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
    id
  }
}
```

إذن، أولاً يُوصف المعامل بين قوسين دائريين، ثم تُدرج حقول كائن القيمة المُعادة بين قوسين معقوفين.

الاستجابة كالتالي:

```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

تم تعليم القيمة المُعادة كقابلة للقيمة الفارغة (nullable)، لذا إذا بحثنا عن تفاصيل شخص غير معروف

```
query {
  findPerson(name: "Joe Biden") {
    phone
  }
}
```

فالقيمة المُعادة هي&nbsp;<em>null</em>.

```json
{
  "data": {
    "findPerson": null
  }
}
```

كما ترى، هناك رابط مباشر بين استعلام GraphQL وكائن JSON المُعاد. ويمكن للمرء أن يفكر في أن الاستعلام يصف نوع البيانات التي يريدها كاستجابة. والفرق عن استعلامات REST صارخ. ففي REST، لا علاقة لعنوان URL ونوع الطلب بشكل البيانات المُعادة.

لا يصف استعلام GraphQL سوى البيانات المتنقلة بين الخادم والعميل. وعلى الخادم، يمكن تنظيم البيانات وحفظها بأي طريقة نريد.

على الرغم من اسمه، لا علاقة لـ GraphQL فعلياً بقواعد البيانات. فهو لا يهتم بكيفية حفظ البيانات. يمكن حفظ البيانات التي يستخدمها GraphQL API في قاعدة بيانات علائقية، أو قاعدة بيانات مستندية، أو في خوادم أخرى يمكن لخادم GraphQL الوصول إليها باستخدام REST مثلاً.

## Apollo Server

لننفّذ خادم GraphQL باستخدام المكتبة الرائدة اليوم:&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/" target="_blank" rel="noreferrer noopener">Apollo Server</a>.

أنشئ مشروع npm جديد باستخدام&nbsp;<code>npm init</code>&nbsp;وثبّت الاعتماديات المطلوبة.

```bash
npm install @apollo/server graphql
```

أنشئ أيضاً ملف&nbsp;<code>index.js</code>&nbsp;في الدليل الجذري لمشروعك.

الشيفرة الأولية كالتالي:

```js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) =&gt; {
  console.log(`Server ready at ${url}`)
})
```

قلب الشيفرة هو&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/api/apollo-server/" target="_blank" rel="noreferrer noopener">ApolloServer</a>، الذي يُعطى معاملين:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

المعامل الأول،&nbsp;<code>typeDefs</code>، يحتوي على مخطط GraphQL.

المعامل الثاني كائن يحتوي على&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/resolvers/" target="_blank" rel="noreferrer noopener">resolvers</a>&nbsp;الخاصة بالخادم. وهي الشيفرة التي تحدد&nbsp;<em>كيفية</em>&nbsp;الاستجابة لاستعلامات GraphQL.

شيفرة الـ resolvers كالتالي:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  }
}
```

كما ترى، تتوافق الـ resolvers مع الاستعلامات الموصوفة في المخطط.

```
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

إذن يوجد حقل تحت&nbsp;<em>Query</em>&nbsp;لكل استعلام موصوف في المخطط.

الاستعلام

```
query {
  personCount
}
```

له الـ resolver

```
() =&gt; persons.length
```

إذن الاستجابة للاستعلام هي طول المصفوفة&nbsp;<code>persons</code>.

الاستعلام الذي يجلب جميع الأشخاص

```
query {
  allPersons {
    name
  }
}
```

له resolver يعيد&nbsp;<em>جميع</em>&nbsp;الكائنات من المصفوفة&nbsp;<code>persons</code>.

```
() =&gt; persons
```

## Apollo Studio Explorer

لنضف السكربتات التالية إلى&nbsp;<em>package.json</em>&nbsp;لتشغيل التطبيق:

```json
{
  //...
  "scripts": {
    "start": "node index.js", // HIGHLIGHT LINE
    "dev": "node --watch index.js", // HIGHLIGHT LINE
    // ...
  }
}
```

عند تشغيل خادم Apollo في وضع التطوير، تأخذنا الصفحة&nbsp;<a href="http://localhost:4000/" target="_blank" rel="noreferrer noopener">http://localhost:4000</a>&nbsp;إلى&nbsp;<a href="https://www.apollographql.com/docs/graphos/platform/explorer" target="_blank" rel="noreferrer noopener">GraphOS Studio Explorer</a>. وهذا مفيد جداً للمطوّر، ويمكن استخدامه لإجراء استعلامات على الخادم.

لنجربه:

![استعلام مثال في Apollo Studio مع استجابة allPersons](/images/mooc/b2e49557f381.webp)

على الجانب الأيسر، يعرض Explorer توثيق الـ API الذي أنشأه تلقائياً بناءً على المخطط.

## إبراز صيغة المخطط في VS Code

يُعرَّف المخطط في شيفرتنا باستخدام صيغة القالب النصي (template literal):

```js
const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`
```

يحتوي المخطط على معلومات بنيوية، لكن في محرر الشيفرة يظهر المحتوى كله باللون نفسه، ولا تستطيع أدوات التنسيق التلقائي مثل Prettier تنسيق محتوياته. يمكننا تفعيل إبراز صيغة مخطط GraphQL، والإكمال التلقائي مثلاً، في VS Code بتثبيت إضافة&nbsp;<a href="https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql" target="_blank" rel="noreferrer noopener">GraphQL: Language Feature Support</a>.

نحتاج إلى إشارة ما للإضافة تدل على أن <code>typeDefs</code> يحتوي على GraphQL. وهناك عدة طرق للقيام بذلك. سنفعلها الآن بإضافة التعليق الدال على النوع <code>/* GraphQL */</code> قبل نص القالب:

![يستخدم VS Code إبراز الصيغة لمخطط GraphQL عند إضافة التعليق /* GraphQL */ قبل نص القالب](/images/mooc/9c034d4fcf41.webp)

الآن يعمل إبراز الصيغة. يساعد التعليق الإضافة المثبَّتة على التعرف على النص كـ GraphQL وتقديم ميزات ذكية للمحرر، لكنه لا يؤثر على وقت تشغيل التطبيق. ويمكن لـ Prettier الآن تنسيق المخطط أيضاً.

### معاملات الـ resolver

الاستعلام الذي يجلب شخصاً واحداً

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
  }
}
```

له resolver يختلف عن السابق لأنه يُعطى&nbsp;<em>معاملين</em>:

```
(root, args) =&gt; persons.find(p =&gt; p.name === args.name)
```

المعامل الثاني،&nbsp;<code>args</code>، يحتوي على معاملات الاستعلام. ثم يعيد الـ resolver من المصفوفة&nbsp;<code>persons</code>&nbsp;الشخص الذي يتطابق اسمه مع قيمة&nbsp;<em>args.name</em>. ولا يحتاج الـ resolver إلى المعامل الأول&nbsp;<code>root</code>.

في الواقع، تُعطى جميع دوال الـ resolver&nbsp;<a href="https://www.graphql-tools.com/docs/resolvers#resolver-function-signature" target="_blank" rel="noreferrer noopener">أربعة معاملات</a>. وفي JavaScript، لا يلزم تعريف المعاملات إذا لم تكن مطلوبة. وسنستخدم المعامل الأول والثالث للـ resolver لاحقاً في هذا الجزء.

## الـ resolver الافتراضي

عندما نجري استعلاماً، على سبيل المثال

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
  }
}
```

يعرف الخادم كيف يعيد بالضبط الحقول التي يتطلبها الاستعلام. كيف يحدث ذلك؟

يجب أن يعرّف خادم GraphQL resolvers لـ<em>كل</em>&nbsp;حقل من كل نوع في المخطط. وقد عرّفنا حتى الآن resolvers فقط لحقول النوع&nbsp;<em>Query</em>، أي لكل استعلام في التطبيق.

ولأننا لم نعرّف resolvers لحقول النوع&nbsp;<em>Person</em>، فقد عرّف Apollo&nbsp;<a href="https://www.graphql-tools.com/docs/resolvers/#default-resolver" target="_blank" rel="noreferrer noopener">resolvers افتراضية</a>&nbsp;لها. وهي تعمل مثل المبيّن أدناه:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt; persons.find(p =&gt; p.name === args.name)
  },
  // BEGIN HIGHLIGHT
  Person: {
    name: (root) =&gt; root.name,
    phone: (root) =&gt; root.phone,
    street: (root) =&gt; root.street,
    city: (root) =&gt; root.city,
    id: (root) =&gt; root.id
  }
  // END HIGHLIGHT
}
```

يعيد الـ resolver الافتراضي قيمة الحقل المقابل في الكائن. ويمكن الوصول إلى الكائن نفسه عبر المعامل الأول للـ resolver،&nbsp;<code>root</code>.

إذا كانت وظيفة الـ resolver الافتراضي كافية، فلا حاجة لتعريف resolver خاص بك. ويمكن أيضاً تعريف resolvers لبعض حقول النوع فقط، وترك الباقي للـ resolvers الافتراضية.

يمكننا مثلاً تعريف أن عنوان جميع الأشخاص هو&nbsp;<em>Manhattan New York</em>&nbsp;بكتابة ما يلي بشكل ثابت في resolvers حقلي street وcity من النوع&nbsp;<em>Person</em>:

```
Person: {
  street: (root) =&gt; "Manhattan",
  city: (root) =&gt; "New York"
}
```

## كائن داخل كائن

لنعدّل المخطط قليلاً

```
  // BEGIN HIGHLIGHT
type Address {
  street: String!
  city: String!
}
  // END HIGHLIGHT

type Person {
  name: String!
  phone: String
  address: Address!   // HIGHLIGHT LINE
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

فأصبح للشخص الآن حقل من النوع&nbsp;<em>Address</em>، يحتوي على الشارع والمدينة.

ولأن الكائنات المحفوظة في المصفوفة لا تحتوي على حقل&nbsp;<em>address</em>، لا يكفي الـ resolver الافتراضي. لنضف resolver لحقل&nbsp;<em>address</em>&nbsp;من النوع&nbsp;<em>Person</em>:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt;
      persons.find(p =&gt; p.name === args.name)
  },
  // BEGIN HIGHLIGHT
  Person: {
    address: (root) =&gt; {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
  // END HIGHLIGHT
}
```

إذن في كل مرة يُعاد كائن&nbsp;<em>Person</em>، تُعاد الحقول&nbsp;<em>name</em>&nbsp;و&nbsp;<em>phone</em>&nbsp;و&nbsp;<em>id</em>&nbsp;باستخدام resolvers الافتراضية، أما الحقل&nbsp;<em>address</em>&nbsp;فيُكوَّن باستخدام resolver معرَّف ذاتياً. المعامل&nbsp;<code>root</code>&nbsp;في دالة الـ resolver هو كائن الشخص، لذا يمكن أخذ الشارع والمدينة في العنوان من حقوله.

الاستعلامات التي تتطلب العنوان تصبح

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    address {
      city
      street
    }
  }
}
```

والاستجابة الآن كائن شخص <em>يحتوي</em>&nbsp;على كائن عنوان.

```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address":  {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```

ما زلنا نحفظ الأشخاص في الخادم بالطريقة نفسها التي فعلناها سابقاً.

```js
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ...
]
```

كائنات الأشخاص المحفوظة في الخادم ليست مطابقة تماماً لكائنات النوع&nbsp;<em>Person</em>&nbsp;الموصوفة في المخطط.

وخلافاً للنوع&nbsp;<em>Person</em>، لا يمتلك النوع&nbsp;<em>Address</em>&nbsp;حقلاً&nbsp;<em>id</em>، لأنها لا تُحفظ في بنية بيانات منفصلة خاصة بها في الخادم.

لنعدّل الـ resolver الخاص بحقل&nbsp;<code>address</code>&nbsp;بحيث يفكّك الحقول المطلوبة من المعامل الذي يستقبله:

```js
const resolvers = {
  Query: {
    personCount: () =&gt; persons.length,
    allPersons: () =&gt; persons,
    findPerson: (root, args) =&gt; persons.find((p) =&gt; p.name === args.name),
  },
  Person: {
    address: ({ street, city }) =&gt; { // HIGHLIGHT LINE
      return {
        street, // HIGHLIGHT LINE
        city, // HIGHLIGHT LINE
      }
    },
  },
}
```

يمكن العثور على الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-1" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع&nbsp;<em>part8-1</em>.

## Mutations

لنضف وظيفة لإضافة أشخاص جدد إلى دليل الهاتف. في GraphQL، تُنفَّذ جميع العمليات التي تُحدث تغييراً عبر&nbsp;<a href="https://graphql.org/learn/mutations" target="_blank" rel="noreferrer noopener">mutations</a>. وتُوصف الـ mutations في المخطط كمفاتيح من النوع&nbsp;<em>Mutation</em>.

مخطط mutation لإضافة شخص جديد يبدو كالتالي:

```
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```

تُعطى الـ Mutation تفاصيل الشخص كمعاملات. والمعامل&nbsp;<em>phone</em>&nbsp;هو الوحيد القابل للقيمة الفارغة. وللـ Mutation أيضاً قيمة مُعادة. القيمة المُعادة من النوع&nbsp;<em>Person</em>، والفكرة أن تُعاد تفاصيل الشخص المضاف إذا نجحت العملية، وإلا فـ null. ولا تُعطى قيمة للحقل&nbsp;<em>id</em>&nbsp;كمعامل. فمن الأفضل ترك توليد المعرّف للخادم.

تتطلب الـ mutations أيضاً resolver:

```js
const { v1: uuid } = require('uuid') // HIGHLIGHT LINE

// ...

const resolvers = {
  Query: {
    // ...
  },
  Person: {
    // ...
  },
  // BEGIN HIGHLIGHT
  Mutation: {
    addPerson: (root, args) =&gt; {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
  // END HIGHLIGHT
}

// ...
```

تضيف الـ mutation الكائن المُعطى لها كمعامل&nbsp;<code>args</code>&nbsp;إلى المصفوفة&nbsp;<code>persons</code>، وتعيد الكائن الذي أضافته إلى المصفوفة.

يُعطى الحقل&nbsp;<em>id</em>&nbsp;قيمة فريدة باستخدام مكتبة&nbsp;<a href="https://github.com/kelektiv/node-uuid#readme" target="_blank" rel="noreferrer noopener">uuid</a>.

يمكن إضافة شخص جديد باستخدام الـ mutation التالية

```
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address {
      city
      street
    }
    id
  }
}
```

لاحظ أن الشخص يُحفظ في المصفوفة&nbsp;<code>persons</code>&nbsp;بالشكل

```
{
  name: "Pekka Mikkola",
  phone: "045-2374321",
  street: "Vilppulantie 25",
  city: "Helsinki",
  id: "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
}
```

لكن الاستجابة للـ mutation هي

```json
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```

إذن يقوم resolver الحقل&nbsp;<em>address</em>&nbsp;من النوع&nbsp;<em>Person</em>&nbsp;بتنسيق كائن الاستجابة إلى الشكل الصحيح.

## معالجة الأخطاء

إذا حاولنا إنشاء شخص جديد، لكن المعاملات لا تتوافق مع وصف المخطط، يعطي الخادم رسالة خطأ:

![يعرض Apollo خطأً مع addPerson GRAPHQL VALIDATION FAILED](/images/mooc/c723d58c5859.webp)

إذن يمكن تنفيذ بعض معالجة الأخطاء تلقائياً عبر&nbsp;<a href="https://graphql.org/learn/validation/" target="_blank" rel="noreferrer noopener">التحقق</a>&nbsp;في GraphQL.

لكن GraphQL لا يستطيع التعامل مع كل شيء تلقائياً. على سبيل المثال، يجب إضافة قواعد أكثر صرامة للبيانات المُرسلة إلى Mutation يدوياً. ويمكن التعامل مع خطأ برمي&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a>&nbsp;مع&nbsp;<a href="https://www.apollographql.com/docs/apollo-server/data/errors/#built-in-error-codes" target="_blank" rel="noreferrer noopener">رمز خطأ</a>&nbsp;مناسب.

لنمنع إضافة الاسم نفسه إلى دليل الهاتف عدة مرات:

```js
const { GraphQLError } = require('graphql') // HIGHLIGHT LINE

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) =&gt; {
      // BEGIN HIGHLIGHT
      if (persons.find(p =&gt; p.name === args.name)) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      // END HIGHLIGHT

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

إذن إذا كان الاسم المراد إضافته موجوداً بالفعل في دليل الهاتف، فارمِ خطأ&nbsp;<code>GraphQLError</code>.

![يعرض Apollo خطأ BAD_USER_INPUT](/images/mooc/ec6b0ba55a28.webp)

يمكن العثور على الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-2" target="_blank" rel="noreferrer noopener">GitHub</a>، في الفرع&nbsp;<em>part8-2</em>.

## Enum

لنضف إمكانية ترشيح الاستعلام الذي يعيد جميع الأشخاص بالمعامل&nbsp;<em>phone</em>&nbsp;بحيث يعيد فقط الأشخاص الذين لديهم رقم هاتف

```
query {
  allPersons(phone: YES) {
    name
    phone
  }
}
```

أو الأشخاص الذين ليس لديهم رقم هاتف

```
query {
  allPersons(phone: NO) {
    name
  }
}
```

يتغير المخطط كالتالي:

```
// BEGIN HIGHLIGHT
enum YesNo {
  YES
  NO
}
// END HIGHLIGHT

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]! // HIGHLIGHT LINE
  findPerson(name: String!): Person
}
```

النوع&nbsp;<em>YesNo</em>&nbsp;هو&nbsp;<a href="https://graphql.org/learn/schema/#enumeration-types" target="_blank" rel="noreferrer noopener">enum</a>&nbsp;في GraphQL، أو نوع قابل للتعداد، بقيمتين محتملتين:&nbsp;<em>YES</em>&nbsp;أو&nbsp;<em>NO</em>. في الاستعلام&nbsp;<code>allPersons</code>، يمتلك المعامل&nbsp;<code>phone</code>&nbsp;النوع&nbsp;<em>YesNo</em>، لكنه قابل للقيمة الفارغة.

يتغير الـ resolver كالتالي:

```js
Query: {
  personCount: () =&gt; persons.length,
  // BEGIN HIGHLIGHT
  allPersons: (root, args) =&gt; {
    if (!args.phone) {
      return persons
    }

    const byPhone = (person) =&gt;
      args.phone === 'YES' ? person.phone : !person.phone

    return persons.filter(byPhone)
  },
  // END HIGHLIGHT
  findPerson: (root, args) =&gt;
    persons.find(p =&gt; p.name === args.name)
},
```

## تغيير رقم هاتف

لنضف mutation لتغيير رقم هاتف شخص. مخطط هذه الـ mutation يبدو كالتالي:

```
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  // BEGIN HIGHLIGHT
  editNumber(
    name: String!
    phone: String!
  ): Person
  // END HIGHLIGHT
}
```

وتُنفَّذ عبر resolver:

```js
Mutation: {
  // ...
  editNumber: (root, args) =&gt; {
    const person = persons.find(p =&gt; p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p =&gt; p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }
}
```

تجد الـ mutation الشخص المراد تحديثه عبر الحقل&nbsp;<em>name</em>.

يمكن العثور على الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع&nbsp;<em>part8-3</em>.

## المزيد عن الاستعلامات

مع GraphQL، يمكن دمج عدة حقول من النوع&nbsp;<em>Query</em>، أو «استعلامات منفصلة»، في استعلام واحد. على سبيل المثال، يعيد الاستعلام التالي كلاًّ من عدد الأشخاص في دليل الهاتف وأسمائهم:

```
query {
  personCount
  allPersons {
    name
  }
}
```

تبدو الاستجابة كالتالي:

```json
{
  "data": {
    "personCount": 3,
    "allPersons": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      },
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

يمكن للاستعلام المدمج أيضاً استخدام الاستعلام نفسه عدة مرات. لكن يجب إعطاء الاستعلامات أسماء بديلة كالتالي:

```
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

تبدو الاستجابة كالتالي:

```json
{
  "data": {
    "havePhone": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      }
    ],
    "phoneless": [
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

في بعض الحالات، قد يكون من المفيد تسمية الاستعلامات. ويحدث ذلك خاصة عندما تحتوي الاستعلامات أو الـ mutations على&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">معاملات</a>. وسنتناول المعاملات قريباً.

<div class="tasks">

**1. عدد الكتب والمؤلفين**

</div>

<div class="tasks">

**2. كل الكتب**

</div>

<div class="tasks">

**3. كل المؤلفين**

</div>

<div class="tasks">

**4. كتب مؤلف**

</div>

<div class="tasks">

**5. الكتب حسب النوع الأدبي**

</div>

<div class="tasks">

**6. إضافة كتاب**

</div>

<div class="tasks">

**7. تحديث سنة ميلاد مؤلف**

</div>
