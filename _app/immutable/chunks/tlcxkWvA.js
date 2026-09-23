const r=8,t="d",s="d.md",n="قاعدة البيانات وإدارة المستخدمين",a="database_and_user_administration",p="/images/part-8.svg",l=[{depth:2,id:"إعادة-هيكلة-الواجهة-الخلفية",text:"إعادة هيكلة الواجهة الخلفية"},{depth:2,id:"mongoose-وapollo",text:"Mongoose وApollo"},{depth:2,id:"التحقق-من-الصحة",text:"التحقق من الصحة"},{depth:3,id:"المستخدم-وتسجيل-الدخول",text:"المستخدم وتسجيل الدخول"},{depth:2,id:"قائمة-الأصدقاء",text:"قائمة الأصدقاء"}],e=`<p>في هذا الفصل، سنبدأ باستخدام قاعدة بيانات لتخزين البيانات ونوسّع التطبيق بإدارة المستخدمين. لكن أولاً، سنعيد هيكلة شيفرة الواجهة الخلفية. يمكن العثور على الشيفرة الحالية للواجهة الخلفية لتطبيق دليل الهاتف على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a> في الفرع <em>part8-3</em>.</p>
<h2 id="إعادة-هيكلة-الواجهة-الخلفية">إعادة هيكلة الواجهة الخلفية</h2>
<p>حتى الآن، كتبنا كل الشيفرة في ملف <em>index.js</em>. مع نمو التطبيق، لم يعد هذا منطقياً: فكلما طال الملف، ضعفت قابلية قراءته وفهمه. كما أن من ممارسات البرمجة الجيدة فصل مسؤوليات التطبيق المختلفة في وحدات خاصة بها.</p>
<p>لنُعِد الآن هيكلة الواجهة الخلفية بتقسيمها إلى عدة ملفات.</p>
<p>سنبدأ باستخراج مخطط GraphQL الخاص بالتطبيق إلى ملف يُسمّى <em>schema.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> typeDefs = <span class="hljs-comment">/* GraphQL */</span> <span class="hljs-string">\`
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
\`</span>

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = typeDefs
</code></pre>
<p>بعد ذلك، سننقل الشيفرة المسؤولة عن resolvers إلى وحدتها الخاصة <em>resolvers.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">GraphQLError</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;graphql&#x27;</span>)
<span class="hljs-keyword">const</span> { <span class="hljs-attr">v1</span>: uuid } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;uuid&#x27;</span>)

<span class="hljs-keyword">let</span> persons = [
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Arto Hellas&#x27;</span>,
    <span class="hljs-attr">phone</span>: <span class="hljs-string">&#x27;040-123543&#x27;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&#x27;Tapiolankatu 5 A&#x27;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&#x27;Espoo&#x27;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&#x27;3d594650-3436-11e9-bc57-8b80ba54c431&#x27;</span>,
  },
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Matti Luukkainen&#x27;</span>,
    <span class="hljs-attr">phone</span>: <span class="hljs-string">&#x27;040-432342&#x27;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&#x27;Malminkaari 10 A&#x27;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&#x27;Helsinki&#x27;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&#x27;3d599470-3436-11e9-bc57-8b80ba54c431&#x27;</span>,
  },
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Venla Ruuska&#x27;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&#x27;Nallemäentie 22 C&#x27;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&#x27;Helsinki&#x27;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&#x27;3d599471-3436-11e9-bc57-8b80ba54c431&#x27;</span>,
  },
]

<span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: (root, args) =&amp;gt; {
      <span class="hljs-keyword">if</span> (!args.<span class="hljs-property">phone</span>) {
        <span class="hljs-keyword">return</span> persons
      }
      <span class="hljs-keyword">const</span> byPhone = (person) =&amp;gt;
        args.<span class="hljs-property">phone</span> === <span class="hljs-string">&#x27;YES&#x27;</span> ? person.<span class="hljs-property">phone</span> : !person.<span class="hljs-property">phone</span>
      <span class="hljs-keyword">return</span> persons.<span class="hljs-title function_">filter</span>(byPhone)
    },
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt; persons.<span class="hljs-title function_">find</span>((p) =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>),
  },
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-attr">address</span>: ({ street, city }) =&amp;gt; {
      <span class="hljs-keyword">return</span> {
        street,
        city,
      }
    },
  },
  <span class="hljs-title class_">Mutation</span>: {
    <span class="hljs-attr">addPerson</span>: (root, args) =&amp;gt; {
      <span class="hljs-keyword">if</span> (persons.<span class="hljs-title function_">find</span>((p) =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Name must be unique: <span class="hljs-subst">\${args.name}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
          },
        })
      }

      <span class="hljs-keyword">const</span> person = { ...args, <span class="hljs-attr">id</span>: <span class="hljs-title function_">uuid</span>() }
      persons = persons.<span class="hljs-title function_">concat</span>(person)
      <span class="hljs-keyword">return</span> person
    },
    <span class="hljs-attr">editNumber</span>: (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> person = persons.<span class="hljs-title function_">find</span>((p) =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
      <span class="hljs-keyword">if</span> (!person) {
        <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
      }

      <span class="hljs-keyword">const</span> updatedPerson = { ...person, <span class="hljs-attr">phone</span>: args.<span class="hljs-property">phone</span> }
      persons = persons.<span class="hljs-title function_">map</span>((p) =&amp;gt; (p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span> ? updatedPerson : p))
      <span class="hljs-keyword">return</span> updatedPerson
    },
  },
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = resolvers
</code></pre>
<p>للتبسيط، وُضعت الآن مصفوفة <em>persons</em> التي تحمل بيانات الأشخاص في الملف نفسه مع الـ resolvers. وستُزال المصفوفة قريباً عندما ننتقل إلى استخدام قاعدة بيانات لتخزين البيانات.</p>
<p>أخيراً، سننقل أيضاً الشيفرة المسؤولة عن تشغيل خادم Apollo إلى ملفها الخاص <em>server.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">ApolloServer</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server&#x27;</span>)
<span class="hljs-keyword">const</span> { startStandaloneServer } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server/standalone&#x27;</span>)

<span class="hljs-keyword">const</span> resolvers = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./resolvers&#x27;</span>)
<span class="hljs-keyword">const</span> typeDefs = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./schema&#x27;</span>)

<span class="hljs-keyword">const</span> startServer = (port) =&amp;gt; {
  <span class="hljs-keyword">const</span> server = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ApolloServer</span>({
    typeDefs,
    resolvers,
  })

  <span class="hljs-title function_">startStandaloneServer</span>(server, {
    <span class="hljs-attr">listen</span>: { port },
  }).<span class="hljs-title function_">then</span>(({ url }) =&amp;gt; {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server ready at <span class="hljs-subst">\${url}</span>\`</span>)
  })
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = startServer
</code></pre>
<p>أصبح تشغيل خادم Apollo الآن يُعالَج داخل دالة <em>startServer</em> التي عرّفناها بأنفسنا. وهذا يتيح لنا تصدير الدالة وبدء الخادم من خارج الوحدة، من ملف <em>index.js</em>. وتأخذ الدالة كمعامل المنفذ الذي سيستمع عليه Apollo Server.</p>
<p>لنثبّت مكتبة <em>dotenv</em> حتى نتمكن من تعريف متغيرات البيئة في ملف <em>.env</em>:</p>
<pre><code class="language-bash">npm install dotenv
</code></pre>
<p>لم تبقَ سوى كمية صغيرة من الشيفرة في <em>index.js</em>. وبعد إعادة الهيكلة، يكون محتواها كما يلي:</p>
<pre><code class="language-js"><span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;dotenv&#x27;</span>).<span class="hljs-title function_">config</span>()

<span class="hljs-keyword">const</span> startServer = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./server&#x27;</span>)

<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = process.<span class="hljs-property">env</span>.<span class="hljs-property">PORT</span> || <span class="hljs-number">4000</span>

<span class="hljs-title function_">startServer</span>(<span class="hljs-variable constant_">PORT</span>)
</code></pre>
<p>تُقرأ متغيرات البيئة أولاً من ملف <em>.env</em> باستخدام مكتبة <em>dotenv</em>. ويُقرأ المنفذ المستخدم الآن من متغير بيئة، إن كان معرّفاً. وإذا لم يُعثر على متغير البيئة <em>PORT</em>، يُستخدم المنفذ الافتراضي 4000—وهو أيضاً المنفذ الذي تتوقع الواجهة الأمامية حالياً أن يعمل الخادم عليه. وأخيراً، يُبدأ Apollo Server باستدعاء الدالة startServer.</p>
<p>في الوقت الحالي، محتوى <em>index.js</em> مجرد هيكل أولي، لكنه سيتضمن المزيد مع نمو التطبيق. مثلاً، عندما ننتقل قريباً إلى استخدام قاعدة بيانات لتخزين البيانات، يجب إنشاء اتصال قاعدة البيانات قبل بدء الخادم.</p>
<p>أصبحت مسؤوليات التطبيق الآن مفصولة بوضوح:</p>
<ul>
<li>تعمل <em>index.js</em> كالبرنامج الرئيسي، ومسؤوليتها الوحيدة منطق بدء التشغيل. فهي تضمن بدء أجزاء التطبيق المختلفة بالترتيب الصحيح.</li>
<li>يُعرَّف مخطط GraphQL في وحدة <em>schema.js</em>. وهو يصف بنية الـ API—مثلاً، أي الاستعلامات والـ mutations ممكنة عبر الـ API وما أنواع الحقول التي تمتلكها الكائنات المختلفة.</li>
<li>يُعرَّف منطق التطبيق الفعلي في وحدة <em>resolvers.js</em>. ومسؤوليتها، مثلاً، تعريف ما يحدث فعلاً في مختلف الاستعلامات، ومن أين تُجلب البيانات، وكيف تُعالَج.</li>
<li>تُعرَّف الشيفرة المسؤولة عن إعداد Apollo Server وتشغيله في وحدة منفصلة، <em>server.js</em>.</li>
</ul>
<h2 id="mongoose-وapollo">Mongoose وApollo</h2>
<p>لنبدأ الآن باستخدام قاعدة بيانات MongoDB في تطبيقنا. سنقدّم قاعدة البيانات باتباع النهج المستخدم في الجزأين <a href="/part3/saving_data_to_mongo_db" target="_blank" rel="noreferrer noopener">3</a> و<a href="/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">4</a>.</p>
<p>ثبّت Mongoose:</p>
<pre><code class="language-bash">npm install mongoose
</code></pre>
<p>عرّف مخطط person في الملف <em>models/person.js</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> mongoose = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;mongoose&#x27;</span>)

<span class="hljs-keyword">const</span> schema = <span class="hljs-keyword">new</span> mongoose.<span class="hljs-title class_">Schema</span>({
  <span class="hljs-attr">name</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">minlength</span>: <span class="hljs-number">5</span>
  },
  <span class="hljs-attr">phone</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">minlength</span>: <span class="hljs-number">5</span>
  },
  <span class="hljs-attr">street</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">minlength</span>: <span class="hljs-number">5</span>
  },
  <span class="hljs-attr">city</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">minlength</span>: <span class="hljs-number">3</span>
  },
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = mongoose.<span class="hljs-title function_">model</span>(<span class="hljs-string">&#x27;Person&#x27;</span>, schema)
</code></pre>
<p>أدرجنا أيضاً بعض عمليات التحقق. إن <code>required: true</code>، الذي يضمن وجود قيمة، زائد فعلاً: فنحن نضمن بالفعل وجود الحقول عبر GraphQL. لكن من الجيد أيضاً إبقاء التحقق في قاعدة البيانات.</p>
<p>لننشئ وحدة منفصلة <em>db.js</em> للشيفرة التي تنشئ اتصال قاعدة البيانات:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> mongoose = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;mongoose&#x27;</span>)

<span class="hljs-keyword">const</span> connectToDatabase = <span class="hljs-title function_">async</span> (uri) =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;connecting to database URI:&#x27;</span>, uri)

  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">await</span> mongoose.<span class="hljs-title function_">connect</span>(uri)
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;connected to MongoDB&#x27;</span>)
  } <span class="hljs-keyword">catch</span> (error) {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;error connection to MongoDB:&#x27;</span>, error.<span class="hljs-property">message</span>)
    process.<span class="hljs-title function_">exit</span>(<span class="hljs-number">1</span>)
  }
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = connectToDatabase
</code></pre>
<p>تعرّف الوحدة الدالة <code>connectToDatabase</code>، التي تستقبل عنوان URI لقاعدة البيانات كمعامل وتتولى الاتصال بقاعدة البيانات.</p>
<p>لنستخدم الوحدة في ملف <em>index.js</em>:</p>
<pre><code class="language-js"><span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;dotenv&#x27;</span>).<span class="hljs-title function_">config</span>()

<span class="hljs-keyword">const</span> connectToDatabase = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./db&#x27;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">const</span> startServer = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./server&#x27;</span>)

<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">MONGODB_URI</span> = process.<span class="hljs-property">env</span>.<span class="hljs-property">MONGODB_URI</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>
<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">PORT</span> = process.<span class="hljs-property">env</span>.<span class="hljs-property">PORT</span> || <span class="hljs-number">4000</span>

<span class="hljs-keyword">const</span> main = <span class="hljs-title function_">async</span> () =&amp;gt; { <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-keyword">await</span> <span class="hljs-title function_">connectToDatabase</span>(<span class="hljs-variable constant_">MONGODB_URI</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>
  <span class="hljs-title function_">startServer</span>(<span class="hljs-variable constant_">PORT</span>)
}

<span class="hljs-title function_">main</span>()
</code></pre>
<p>لأن صيغة <em>async/await</em> لا يمكن استخدامها إلا داخل الدوال، نعرّف الآن دالة <em>main</em> بسيطة تتولى بدء التطبيق. وهذا يتيح لنا استدعاء الدالة التي تنشئ اتصال قاعدة البيانات باستخدام الكلمة المفتاحية <em>await</em>.</p>
<p>تُستخرج قيمة <code>MONGODB_URI</code> من متغير بيئة، لذا عليك إضافة قيمة مناسبة له في ملف <em>.env</em> بالطريقة نفسها كما في <a href="/part3/saving_data_to_mongo_db#defining-environment-variables-using-the-dotenv-library" target="_blank" rel="noreferrer noopener">الجزء 3</a>. يستدعي التطبيق أولاً الدالة التي تنشئ اتصال قاعدة البيانات، وبمجرد إنشاء اتصال قاعدة البيانات بنجاح، يبدأ خادم GraphQL.</p>
<p>سيتغيّر محتوى <em>resolvers.js</em>، المسؤول عن منطق التطبيق، شبه كلياً. ويمكننا جعل التطبيق يعمل إلى حد كبير بإجراء التغييرات التالية:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">GraphQLError</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;graphql&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Person</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./models/person&#x27;</span>)

<span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: <span class="hljs-title function_">async</span> () =&amp;gt; <span class="hljs-title class_">Person</span>.<span class="hljs-property">collection</span>.<span class="hljs-title function_">countDocuments</span>(),
    <span class="hljs-attr">allPersons</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
      <span class="hljs-comment">// الفلاتر مفقودة</span>
      <span class="hljs-keyword">return</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">find</span>({})
    },
    <span class="hljs-attr">findPerson</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> }),
  },
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-attr">address</span>: ({ street, city }) =&amp;gt; {
      <span class="hljs-keyword">return</span> {
        street,
        city,
      }
    },
  },
  <span class="hljs-title class_">Mutation</span>: {
    <span class="hljs-attr">addPerson</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> nameExists = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">exists</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

      <span class="hljs-keyword">if</span> (nameExists) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Name must be unique: <span class="hljs-subst">\${args.name}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
          },
        })
      }

      <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Person</span>({ ...args })
      <span class="hljs-keyword">return</span> person.<span class="hljs-title function_">save</span>()
    },
    <span class="hljs-attr">editNumber</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

      <span class="hljs-keyword">if</span> (!person) {
        <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
      }

      person.<span class="hljs-property">phone</span> = args.<span class="hljs-property">phone</span>
      <span class="hljs-keyword">return</span> person.<span class="hljs-title function_">save</span>()
    },
  },
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = resolvers
</code></pre>
<p>التغييرات مباشرة تماماً. لكن هناك بضعة أمور جديرة بالملاحظة. كما نتذكر، في Mongo يُسمّى حقل تعريف الكائن <em>_id</em> وكان علينا سابقاً تحويل اسم الحقل إلى <em>id</em> بأنفسنا. أما الآن فيستطيع GraphQL فعل ذلك تلقائياً.</p>
<p>أمر آخر جدير بالملاحظة هو أن دوال resolver تُعيد الآن <em>promise</em>، بينما كانت سابقاً تُعيد كائنات عادية. وعندما يُعيد resolver قيمة promise، يُرسل خادم Apollo <a href="https://www.apollographql.com/docs/apollo-server/data/resolvers#return-values" target="_blank" rel="noreferrer noopener">القيمة</a> التي يُحلّ إليها الـ promise.</p>
<p>مثلاً، إذا نُفّذت دالة resolver التالية،</p>
<pre><code class="language-js"><span class="hljs-attr">allPersons</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">find</span>({})
},
</code></pre>
<p>فإن خادم Apollo ينتظر حلّ الـ promise، ثم يُعيد النتيجة. إذاً يعمل Apollo تقريباً هكذا:</p>
<pre><code class="language-js"><span class="hljs-attr">allPersons</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
  <span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">find</span>({})
  <span class="hljs-keyword">return</span> result
}
</code></pre>
<p>لنكمل resolver الـ<code>allPersons</code> ليأخذ المعامل الاختياري <code>phone</code> في الحسبان:</p>
<pre><code class="language-js"><span class="hljs-title class_">Query</span>: {
  <span class="hljs-comment">// ..</span>
  <span class="hljs-attr">allPersons</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
    <span class="hljs-keyword">if</span> (!args.<span class="hljs-property">phone</span>) {
      <span class="hljs-keyword">return</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">find</span>({})
    }

    <span class="hljs-keyword">return</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">find</span>({ <span class="hljs-attr">phone</span>: { <span class="hljs-attr">$exists</span>: args.<span class="hljs-property">phone</span> === <span class="hljs-string">&#x27;YES&#x27;</span> } })
  },
},
</code></pre>
<p>إذاً إذا لم يُعطَ للاستعلام معامل <code>phone</code>، تُعاد جميع الأشخاص. وإذا كانت قيمة المعامل <em>YES</em>، تُعاد نتيجة الاستعلام</p>
<pre><code>Person.find({ phone: { $exists: true }})
</code></pre>
<p>أي الكائنات التي يمتلك فيها الحقل <code>phone</code> قيمة. وإذا كانت قيمة المعامل <em>NO</em>، يُعيد الاستعلام الكائنات التي لا يمتلك فيها الحقل <code>phone</code> أي قيمة:</p>
<pre><code>Person.find({ phone: { $exists: false }})
</code></pre>
<h2 id="التحقق-من-الصحة">التحقق من الصحة</h2>
<p>كما في GraphQL، يُتحقق الآن من المدخلات باستخدام عمليات التحقق المعرّفة في مخطط mongoose. ولمعالجة أخطاء التحقق المحتملة في المخطط، يجب إضافة كتلة <code>try/catch</code> لمعالجة الأخطاء إلى الدالة <code>save</code>. وعندما نصل إلى catch، نرمي استثناء <a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a> مع رمز الخطأ :</p>
<pre><code class="language-js"><span class="hljs-title class_">Mutation</span>: {
  <span class="hljs-attr">addPerson</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> nameExists = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">exists</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

      <span class="hljs-keyword">if</span> (nameExists) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Name must be unique: <span class="hljs-subst">\${args.name}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
          },
        })
      }

      <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Person</span>({ ...args })

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      <span class="hljs-keyword">try</span> {
        <span class="hljs-keyword">await</span> person.<span class="hljs-title function_">save</span>()
      } <span class="hljs-keyword">catch</span> (error) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Saving person failed: <span class="hljs-subst">\${error.message}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
            error
          }
        })
      }

      <span class="hljs-keyword">return</span> person
<span class="hljs-comment">// END HIGHLIGHT</span>
  },
    <span class="hljs-attr">editNumber</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

      <span class="hljs-keyword">if</span> (!person) {
        <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
      }

      person.<span class="hljs-property">phone</span> = args.<span class="hljs-property">phone</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      <span class="hljs-keyword">try</span> {
        <span class="hljs-keyword">await</span> person.<span class="hljs-title function_">save</span>()
      } <span class="hljs-keyword">catch</span> (error) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Saving number failed: <span class="hljs-subst">\${error.message}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
            error
          }
        })
      }

      <span class="hljs-keyword">return</span> person
<span class="hljs-comment">// END HIGHLIGHT</span>
    }
}
</code></pre>
<p>أضفنا أيضاً خطأ Mongoose والبيانات التي تسببت في الخطأ إلى كائن <em>extensions</em> الذي يُستخدم لإيصال مزيد من المعلومات عن سبب الخطأ إلى المستدعي. ويمكن للواجهة الأمامية عندها عرض هذه المعلومات للمستخدم، الذي يمكنه إعادة المحاولة بمدخلات أفضل.</p>
<p>يمكن العثور على شيفرة الواجهة الخلفية على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4" target="_blank" rel="noreferrer noopener">Github</a>، الفرع <em>part8-4</em>.</p>
<h3 id="المستخدم-وتسجيل-الدخول">المستخدم وتسجيل الدخول</h3>
<p>لنضف إدارة المستخدمين إلى تطبيقنا. للتبسيط، لنفترض أن جميع المستخدمين لديهم كلمة المرور نفسها وهي مضمّنة مباشرة في النظام. سيكون من المباشر حفظ كلمات مرور فردية لجميع المستخدمين باتباع المبادئ من <a href="/part4/user_administration" target="_blank" rel="noreferrer noopener">الجزء 4</a>، لكن لأن تركيزنا على GraphQL، سنتجاوز كل هذه المتاعب الإضافية هذه المرة.</p>
<p>لننشئ مخطط المستخدم في الملف <em>models/user.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> mongoose = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;mongoose&#x27;</span>)

<span class="hljs-keyword">const</span> schema = <span class="hljs-keyword">new</span> mongoose.<span class="hljs-title class_">Schema</span>({
  <span class="hljs-attr">username</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">String</span>,
    <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">minlength</span>: <span class="hljs-number">3</span>
  },
  <span class="hljs-attr">friends</span>: [
    {
      <span class="hljs-attr">type</span>: mongoose.<span class="hljs-property">Schema</span>.<span class="hljs-property">Types</span>.<span class="hljs-property">ObjectId</span>,
      <span class="hljs-attr">ref</span>: <span class="hljs-string">&#x27;Person&#x27;</span>
    }
  ],
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = mongoose.<span class="hljs-title function_">model</span>(<span class="hljs-string">&#x27;User&#x27;</span>, schema)
</code></pre>
<p>يرتبط كل مستخدم بمجموعة من الأشخاص الآخرين في النظام عبر حقل <code>friends</code>. والفكرة أنه عندما يضيف مستخدم، مثلاً <em>mluukkai</em>، شخصاً، مثلاً <em>Arto Hellas</em>، إلى القائمة، يُضاف الشخص إلى قائمة <code>friends</code> الخاصة به. وبهذه الطريقة، يمكن للمستخدمين المسجّلين دخولهم الحصول على عرض مخصّص خاص بهم في التطبيق.</p>
<p>تُعالَج عملية تسجيل الدخول وتحديد هوية المستخدم بالطريقة نفسها التي استخدمناها في <a href="/part4/token_authentication" target="_blank" rel="noreferrer noopener">الجزء 4</a> عندما استخدمنا REST، أي باستخدام الرموز (tokens).</p>
<p>لنوسّع مخطط GraphQL هكذا:</p>
<pre><code>type User {
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
</code></pre>
<p>يُعيد الاستعلام <code>me</code> المستخدم المسجّل دخوله حالياً. ويُنشأ المستخدمون الجدد عبر mutation الـ<code>createUser</code>، ويتم تسجيل الدخول عبر mutation الـ<code>login</code>.</p>
<p>لنثبّت مكتبة jsonwebtoken:</p>
<pre><code class="language-bash">npm install jsonwebtoken
</code></pre>
<p>تكون resolvers الـ mutations الجديدة كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> jwt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;jsonwebtoken&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./models/user&#x27;</span>)

<span class="hljs-title class_">Mutation</span>: {
  <span class="hljs-comment">// ..</span>
  <span class="hljs-attr">createUser</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
    <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">new</span> <span class="hljs-title class_">User</span>({ <span class="hljs-attr">username</span>: args.<span class="hljs-property">username</span> })

    <span class="hljs-keyword">return</span> user.<span class="hljs-title function_">save</span>()
      .<span class="hljs-title function_">catch</span>(error =&amp;gt; {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Creating the user failed: <span class="hljs-subst">\${error.message}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">username</span>,
            error
          }
        })
      })
  },
  <span class="hljs-attr">login</span>: <span class="hljs-title function_">async</span> (root, args) =&amp;gt; {
    <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">username</span>: args.<span class="hljs-property">username</span> })

    <span class="hljs-keyword">if</span> ( !user || args.<span class="hljs-property">password</span> !== <span class="hljs-string">&#x27;secret&#x27;</span> ) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">&#x27;wrong credentials&#x27;</span>, {
        <span class="hljs-attr">extensions</span>: {
          <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>
        }
      })
    }

    <span class="hljs-keyword">const</span> userForToken = {
      <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
      <span class="hljs-attr">id</span>: user.<span class="hljs-property">_id</span>,
    }

    <span class="hljs-keyword">return</span> { <span class="hljs-attr">value</span>: jwt.<span class="hljs-title function_">sign</span>(userForToken, process.<span class="hljs-property">env</span>.<span class="hljs-property">JWT_SECRET</span>) }
  },
},
</code></pre>
<p>mutation المستخدم الجديدة مباشرة. تتحقق mutation الـ login من صلاحية زوج اسم المستخدم/كلمة المرور. وإذا كان صالحاً بالفعل، تُعيد رمز jwt مألوفاً من <a href="/part4/token_authentication" target="_blank" rel="noreferrer noopener">الجزء 4</a>. لاحظ أنه يجب تعريف <code>JWT_SECRET</code> في ملف <em>.env</em>.</p>
<p>يتم الآن إنشاء المستخدم كما يلي:</p>
<pre><code>mutation {
  createUser (
    username: &quot;mluukkai&quot;
  ) {
    username
    id
  }
}
</code></pre>
<p>تبدو mutation تسجيل الدخول هكذا:</p>
<pre><code>mutation {
  login (
    username: &quot;mluukkai&quot;
    password: &quot;secret&quot;
  ) {
    value
  }
}
</code></pre>
<p>كما في الحالة السابقة مع REST، الفكرة الآن أن يضيف المستخدم المسجّل دخوله الرمز الذي يحصل عليه عند تسجيل الدخول إلى جميع طلباته. وكما في REST، يُضاف الرمز إلى استعلامات GraphQL باستخدام ترويسة <em>Authorization</em>.</p>
<p>في Apollo Explorer، تُضاف الترويسة إلى الاستعلام هكذا:</p>
<p><img src="/images/mooc/60f94bca66a8.webp" alt="يعرض Apollo Explorer الترويسات مع Authorization وBearer token"></p>
<p>في الواجهة الخلفية، الطريقة الأكثر ملاءمة لتمرير الرمز الذي يصل مع الطلب إلى الـ resolvers هي استخدام <a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a> الخاص بـ Apollo Server. وباستخدام context، يمكننا تنفيذ أمور مشتركة بين جميع الاستعلامات والـ mutations، مثلاً <a href="https://www.apollographql.com/blog/authorization-in-graphql/" target="_blank" rel="noreferrer noopener">تحديد هوية المستخدم</a> المرتبط بالطلب.</p>
<p>لنغيّر بدء تشغيل الواجهة الخلفية بحيث يتضمن الكائن المُمرَّر كمعامل ثانٍ إلى دالة <a href="https://www.apollographql.com/docs/apollo-server/api/standalone/" target="_blank" rel="noreferrer noopener">startStandaloneServer</a> حقل <a href="https://www.apollographql.com/docs/apollo-server/data/context/" target="_blank" rel="noreferrer noopener">context</a>، ولننشئ دالة مساعدة <code>getUserFromAuthHeader</code> للتحقق من صلاحية الرمز وإيجاد المستخدم في قاعدة البيانات:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">ApolloServer</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server&#x27;</span>)
<span class="hljs-keyword">const</span> { startStandaloneServer } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server/standalone&#x27;</span>)
<span class="hljs-keyword">const</span> jwt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;jsonwebtoken&#x27;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">const</span> resolvers = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./resolvers&#x27;</span>)
<span class="hljs-keyword">const</span> typeDefs = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./schema&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./models/user&#x27;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> getUserFromAuthHeader = <span class="hljs-title function_">async</span> (auth) =&amp;gt; {
  <span class="hljs-keyword">if</span> (!auth || !auth.<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;Bearer &#x27;</span>)) {
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
  }

  <span class="hljs-keyword">const</span> decodedToken = jwt.<span class="hljs-title function_">verify</span>(auth.<span class="hljs-title function_">substring</span>(<span class="hljs-number">7</span>), process.<span class="hljs-property">env</span>.<span class="hljs-property">JWT_SECRET</span>)
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findById</span>(decodedToken.<span class="hljs-property">id</span>).<span class="hljs-title function_">populate</span>(<span class="hljs-string">&#x27;friends&#x27;</span>)
}
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> startServer = (port) =&amp;gt; {
  <span class="hljs-keyword">const</span> server = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ApolloServer</span>({
    typeDefs,
    resolvers,
  })

  <span class="hljs-title function_">startStandaloneServer</span>(server, {
    <span class="hljs-attr">listen</span>: { port },
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">context</span>: <span class="hljs-title function_">async</span> ({ req }) =&amp;gt; {
      <span class="hljs-keyword">const</span> auth = req.<span class="hljs-property">headers</span>.<span class="hljs-property">authorization</span>
      <span class="hljs-keyword">const</span> currentUser = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getUserFromAuthHeader</span>(auth)
      <span class="hljs-keyword">return</span> { currentUser }
    },
    <span class="hljs-comment">// END HIGHLIGHT</span>
  }).<span class="hljs-title function_">then</span>(({ url }) =&amp;gt; {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server ready at <span class="hljs-subst">\${url}</span>\`</span>)
  })
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = startServer
</code></pre>
<p>إذاً تستخرج الشيفرة التي عرّفناها أولاً الرمز الموجود في ترويسة <code>Authorization</code> الخاصة بالطلب. وتفكّ دالة المساعدة <code>getUserFromAuthHeader</code> ترميز الرمز وتبحث عن المستخدم المقابل في قاعدة البيانات. وإذا لم يكن الرمز صالحاً أو تعذّر العثور على المستخدم، تُعيد الدالة <code>null</code>.</p>
<p>وأخيراً، يُضبط حقل context المسمّى <code>currentUser</code> على كائن المستخدم المقابل للطالب، أو على <code>null</code> إذا لم يُعثر على مستخدم:</p>
<pre><code class="language-js"><span class="hljs-attr">context</span>: <span class="hljs-title function_">async</span> ({ req }) =&amp;gt; {
  <span class="hljs-keyword">const</span> auth = req.<span class="hljs-property">headers</span>.<span class="hljs-property">authorization</span>
  <span class="hljs-keyword">const</span> currentUser = <span class="hljs-keyword">await</span> <span class="hljs-title function_">getUserFromAuthHeader</span>(auth)
  <span class="hljs-keyword">return</span> { currentUser } <span class="hljs-comment">// HIGHLIGHT LINE</span>
},
</code></pre>
<p>تُمرَّر قيمة context إلى الـ resolvers كـ <code>المعامل الثالث</code>. وresolver الخاص باستعلام <code>me</code> بسيط جداً: فهو يُعيد فقط المستخدم المسجّل دخوله حالياً، الذي يحصل عليه من معامل resolver المسمّى <code>context</code>، من الحقل <code>currentUser</code>:</p>
<pre><code class="language-js"><span class="hljs-title class_">Query</span>: {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">me</span>: (root, args, context) =&amp;gt; {
    <span class="hljs-keyword">return</span> context.<span class="hljs-property">currentUser</span>
  }
},
</code></pre>
<p>إذا كانت الترويسة تحتوي على رمز صالح، يُعيد الاستعلام تفاصيل المستخدم الذي يحدده الرمز.</p>
<p><img src="/images/mooc/646446e12fd0.webp" alt="يعرض Apollo Studio كائن استجابة الاستعلام"></p>
<h2 id="قائمة-الأصدقاء">قائمة الأصدقاء</h2>
<p>لنكمل الواجهة الخلفية للتطبيق بحيث تتطلب إضافة الأشخاص وتعديلهم تسجيل الدخول، وتُضاف الأشخاص المضافون تلقائياً إلى قائمة أصدقاء المستخدم.</p>
<p>لنزل أولاً من قاعدة البيانات كل الأشخاص غير الموجودين في قائمة أصدقاء أي مستخدم.</p>
<p>تتغيّر mutation الـ<code>addPerson</code> هكذا:</p>
<pre><code class="language-js"><span class="hljs-title class_">Mutation</span>: {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-attr">addPerson</span>: <span class="hljs-title function_">async</span> (root, args, context) =&amp;gt; {
    <span class="hljs-keyword">const</span> currentUser = context.<span class="hljs-property">currentUser</span>

    <span class="hljs-keyword">if</span> (!currentUser) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">&#x27;not authenticated&#x27;</span>, {
        <span class="hljs-attr">extensions</span>: {
          <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;UNAUTHENTICATED&#x27;</span>,
        }
      })
    }
    <span class="hljs-comment">// END HIGHLIGHT</span>

    <span class="hljs-keyword">const</span> nameExists = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">exists</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

    <span class="hljs-keyword">if</span> (nameExists) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Name must be unique: <span class="hljs-subst">\${args.name}</span>\`</span>, {
        <span class="hljs-attr">extensions</span>: {
          <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
          <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
        },
      })
    }

    <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Person</span>({ ...args })

    <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">await</span> person.<span class="hljs-title function_">save</span>()
      currentUser.<span class="hljs-property">friends</span> = currentUser.<span class="hljs-property">friends</span>.<span class="hljs-title function_">concat</span>(person) <span class="hljs-comment">// HIGHLIGHT LINE</span>
      <span class="hljs-keyword">await</span> currentUser.<span class="hljs-title function_">save</span>() <span class="hljs-comment">// HIGHLIGHT LINE</span>
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Saving person failed: <span class="hljs-subst">\${error.message}</span>\`</span>, {
        <span class="hljs-attr">extensions</span>: {
          <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
          <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
          error
        }
      })
    }

    <span class="hljs-keyword">return</span> person
  },
  <span class="hljs-comment">//...</span>
}
</code></pre>
<p>إذا تعذّر العثور على مستخدم مسجّل دخوله في context، يُرمى <code>GraphQLError</code> برسالة مناسبة. ويتم الآن إنشاء الأشخاص الجدد بصيغة <code>async/await</code> لأنه إذا نجحت العملية، يُضاف الشخص المنشأ إلى قائمة أصدقاء المستخدم.</p>
<p>لنضف أيضاً إمكانية إضافة شخص إلى قائمة أصدقائك. مخطط الـ mutation كما يلي:</p>
<pre><code>type Mutation {
  // ...
  addAsFriend(name: String!): User // HIGHLIGHT LINE
}
</code></pre>
<p>وresolver الخاص بالـ mutation:</p>
<pre><code class="language-js">  <span class="hljs-attr">addAsFriend</span>: <span class="hljs-title function_">async</span> (root, args, { currentUser }) =&amp;gt; {
    <span class="hljs-keyword">if</span> (!currentUser) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">&#x27;not authenticated&#x27;</span>, {
        <span class="hljs-attr">extensions</span>: { <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;UNAUTHENTICATED&#x27;</span> },
      })
    }

    <span class="hljs-keyword">const</span> nonFriendAlready = (person) =&amp;gt;
      !currentUser.<span class="hljs-property">friends</span>
        .<span class="hljs-title function_">map</span>((f) =&amp;gt; f.<span class="hljs-property">_id</span>.<span class="hljs-title function_">toString</span>())
        .<span class="hljs-title function_">includes</span>(person.<span class="hljs-property">_id</span>.<span class="hljs-title function_">toString</span>())

    <span class="hljs-keyword">const</span> person = <span class="hljs-keyword">await</span> <span class="hljs-title class_">Person</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">name</span>: args.<span class="hljs-property">name</span> })

    <span class="hljs-keyword">if</span> (!person) {
      <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">&quot;The name didn&#x27;t found&quot;</span>, {
        <span class="hljs-attr">extensions</span>: {
          <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
          <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>,
        },
      })
    }

    <span class="hljs-keyword">if</span> (<span class="hljs-title function_">nonFriendAlready</span>(person)) {
      currentUser.<span class="hljs-property">friends</span> = currentUser.<span class="hljs-property">friends</span>.<span class="hljs-title function_">concat</span>(person)
    }

    <span class="hljs-keyword">await</span> currentUser.<span class="hljs-title function_">save</span>()

    <span class="hljs-keyword">return</span> currentUser
  },
</code></pre>
<p>لاحظ كيف يستخرج resolver المستخدم المسجّل دخوله من context عبر <em>التفكيك</em>. فبدلاً من حفظ <code>currentUser</code> في متغير منفصل داخل دالة</p>
<pre><code class="language-js"><span class="hljs-attr">addAsFriend</span>: <span class="hljs-title function_">async</span> (root, args, context) =&amp;gt; {
  <span class="hljs-keyword">const</span> currentUser = context.<span class="hljs-property">currentUser</span>
</code></pre>
<p>يُستقبل مباشرة في تعريف معاملات الدالة:</p>
<pre><code>addAsFriend: async (root, args, { currentUser }) =&amp;gt; {
</code></pre>
<p>يُعيد الاستعلام التالي الآن قائمة أصدقاء المستخدم:</p>
<pre><code>query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
</code></pre>
<p>يمكن العثور على شيفرة الواجهة الخلفية على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a> الفرع <em>part8-5</em>.</p>
<div class="tasks">
<p><strong>13. قاعدة البيانات، الجزء 1</strong></p>
</div>
<div class="tasks">
<p><strong>14. قاعدة البيانات، الجزء 2</strong></p>
</div>
<div class="tasks">
<p><strong>15. قاعدة البيانات، الجزء 3</strong></p>
</div>
<div class="tasks">
<p><strong>16. المستخدم وتسجيل الدخول</strong></p>
</div>
<div class="tasks">
<p><strong>17. مراجعة</strong></p>
</div>
`,c={part:8,letter:"d",file:s,title:n,slug:a,mainImage:p,headings:l,html:e};export{c as default,s as file,l as headings,e as html,t as letter,p as mainImage,r as part,a as slug,n as title};
