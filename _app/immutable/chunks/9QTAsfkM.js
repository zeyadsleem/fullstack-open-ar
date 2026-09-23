const l=8,o="b",s="b.md",n="خادم GraphQL",a="graphql_server",p="/images/part-8.svg",t=[{depth:2,id:"المخططات-والاستعلامات",text:"المخططات والاستعلامات"},{depth:2,id:"apollo-server",text:"Apollo Server"},{depth:2,id:"apollo-studio-explorer",text:"Apollo Studio Explorer"},{depth:2,id:"إبراز-صيغة-المخطط-في-vs-code",text:"إبراز صيغة المخطط في VS Code"},{depth:3,id:"معاملات-الـ-resolver",text:"معاملات الـ resolver"},{depth:2,id:"الـ-resolver-الافتراضي",text:"الـ resolver الافتراضي"},{depth:2,id:"كائن-داخل-كائن",text:"كائن داخل كائن"},{depth:2,id:"mutations",text:"Mutations"},{depth:2,id:"معالجة-الأخطاء",text:"معالجة الأخطاء"},{depth:2,id:"enum",text:"Enum"},{depth:2,id:"تغيير-رقم-هاتف",text:"تغيير رقم هاتف"},{depth:2,id:"المزيد-عن-الاستعلامات",text:"المزيد عن الاستعلامات"}],e=`<p>كان REST، المألوف لنا من الأجزاء السابقة من المقرر، منذ زمن طويل الطريقة الأكثر انتشاراً لتنفيذ الواجهات التي تقدمها الخوادم للمتصفحات، وبشكل عام للتكامل بين التطبيقات المختلفة على الويب.</p>
<p>في السنوات الأخيرة، أصبح <a href="http://graphql.org/" target="_blank" rel="noreferrer noopener">GraphQL</a>، الذي طوّرته Facebook، شائعاً في التواصل بين تطبيقات الويب والخوادم.</p>
<p>فلسفة GraphQL مختلفة جداً عن REST. فـ REST <em>قائمة على الموارد</em>. لكل مورد، مثلاً <em>مستخدم</em>، عنوانه الخاص الذي يعرّفه، مثلاً <em>/users/10</em>. وتُنفَّذ جميع العمليات على المورد عبر طلبات HTTP إلى عنوان URL الخاص به. ويعتمد الإجراء على طريقة HTTP المستخدمة.</p>
<p>إن اعتماد REST على الموارد يعمل جيداً في معظم الحالات. لكنه قد يكون مرهقاً بعض الشيء أحياناً.</p>
<p>لننظر في المثال التالي: يحتوي تطبيق قائمة المدونات لدينا على نوع من وظائف التواصل الاجتماعي، ونرغب في عرض قائمة بكل المدونات التي أضافها مستخدمون علّقوا على أي من مدونات المستخدمين الذين نتابعهم.</p>
<p>لو كان الخادم ينفّذ REST API، لكان علينا على الأرجح تنفيذ عدة طلبات HTTP من المتصفح قبل الحصول على كل البيانات التي نريدها. كما أن الطلبات ستعيد الكثير من البيانات غير الضرورية، وستكون الشيفرة في المتصفح معقدة إلى حدٍّ كبير على الأرجح.</p>
<p>لو كانت هذه وظيفة كثيرة الاستخدام، لأمكن تخصيص نقطة نهاية REST لها. لكن لو كثرت هذه السيناريوهات، لأصبح تنفيذ نقاط نهاية REST لها جميعاً مرهقاً للغاية.</p>
<p>خادم GraphQL مناسب تماماً لهذه الأنواع من الحالات.</p>
<p>المبدأ الأساسي في GraphQL هو أن الشيفرة في المتصفح تُكوّن <em>استعلاماً</em> يصف البيانات المطلوبة، وترسله إلى الـ API عبر طلب HTTP من نوع POST. وخلافاً لـ REST، تُرسل جميع استعلامات GraphQL إلى العنوان نفسه، ويكون نوعها POST.</p>
<p>يمكن جلب البيانات الموصوفة في السيناريو أعلاه باستعلام (تقريبي) كالتالي:</p>
<pre><code>query FetchBlogsQuery {
  user(username: &quot;mluukkai&quot;) {
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
</code></pre>
<p>يمكن تفسير محتوى <code>FetchBlogsQuery</code> تقريباً كالتالي: ابحث عن مستخدم اسمه <code>&quot;mluukkai&quot;</code>، ولكل من <code>followedUsers</code> لديه، ابحث عن كل <code>blogs</code> الخاصة به، ولكل مدونة، كل <code>comments</code> الخاصة بها، ولكل <code>user</code> كتب كل تعليق، ابحث عن <code>blogs</code> الخاصة به، وأعِد <code>title</code> لكل منها.</p>
<p>ستكون استجابة الخادم كائن JSON كالتالي تقريباً:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;followedUsers&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;blogs&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
          <span class="hljs-punctuation">{</span>
            <span class="hljs-attr">&quot;comments&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
              <span class="hljs-punctuation">{</span>
                <span class="hljs-attr">&quot;user&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
                  <span class="hljs-attr">&quot;blogs&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
                    <span class="hljs-punctuation">{</span>
                      <span class="hljs-attr">&quot;title&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Goto considered harmful&quot;</span>
                    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
                    <span class="hljs-punctuation">{</span>
                      <span class="hljs-attr">&quot;title&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;End to End Testing with Cypress is most enjoyable&quot;</span>
                    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
                    <span class="hljs-punctuation">{</span>
                      <span class="hljs-attr">&quot;title&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Navigating your transition to GraphQL&quot;</span>
                    <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
                    <span class="hljs-punctuation">{</span>
                      <span class="hljs-attr">&quot;title&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;From REST to GraphQL&quot;</span>
                    <span class="hljs-punctuation">}</span>
                  <span class="hljs-punctuation">]</span>
                <span class="hljs-punctuation">}</span>
              <span class="hljs-punctuation">}</span>
            <span class="hljs-punctuation">]</span>
          <span class="hljs-punctuation">}</span>
        <span class="hljs-punctuation">]</span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يبقى منطق التطبيق بسيطاً، وتحصل الشيفرة في المتصفح على البيانات التي تحتاجها بالضبط باستعلام واحد.</p>
<h2 id="المخططات-والاستعلامات">المخططات والاستعلامات</h2>
<p>سنتعرف على أساسيات GraphQL بتنفيذ نسخة GraphQL من تطبيق دليل الهاتف من الجزأين 2 و3.</p>
<p>في قلب كل تطبيقات GraphQL يوجد <a href="https://graphql.org/learn/schema/" target="_blank" rel="noreferrer noopener">مخطط</a>، يصف البيانات المرسلة بين العميل والخادم. المخطط الأولي لدليل الهاتف لدينا كالتالي:</p>
<pre><code>type Person {
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
</code></pre>
<p>يصف المخطط <a href="https://graphql.org/learn/schema/#type-system" target="_blank" rel="noreferrer noopener">نوعين</a>. النوع الأول، <em>Person</em>، يحدد أن للأشخاص خمسة حقول. أربعة من الحقول من النوع <em>String</em>، وهو أحد <a href="https://graphql.org/learn/schema/#scalar-types" target="_blank" rel="noreferrer noopener">الأنواع القياسية</a> في GraphQL. يجب إعطاء قيمة لجميع حقول String، باستثناء <em>phone</em>. ويُشار إلى ذلك بعلامة التعجب في المخطط. نوع الحقل <em>id</em> هو <em>ID</em>. حقول <em>ID</em> نصوص، لكن GraphQL يضمن أنها فريدة.</p>
<p>النوع الثاني هو <a href="https://graphql.org/learn/queries/" target="_blank" rel="noreferrer noopener">Query</a>. عملياً، يصف كل مخطط GraphQL نوع Query، الذي يحدد أنواع الاستعلامات التي يمكن إجراؤها على الـ API.</p>
<p>يصف دليل الهاتف ثلاثة استعلامات مختلفة. يعيد <code>personCount</code> عدداً صحيحاً، ويعيد <code>allPersons</code> قائمة من كائنات <em>Person</em>، ويُعطى <em>findPerson</em> معاملاً نصياً ويعيد كائن <em>Person</em>.</p>
<p>مرة أخرى، تُستخدم علامات التعجب لتحديد القيم المُعادة والمعاملات التي هي <em>غير قابلة للقيمة الفارغة (Non-Null)</em>. سيعيد <code>personCount</code> عدداً صحيحاً بالتأكيد. ويجب إعطاء الاستعلام <code>findPerson</code> نصاً كمعامل. ويعيد الاستعلام كائن <em>Person</em> أو <em>null</em>. ويعيد <code>allPersons</code> قائمة من كائنات <em>Person</em>، ولا تحتوي القائمة على أي قيم <em>null</em>.</p>
<p>إذن يصف المخطط الاستعلامات التي يمكن للعميل إرسالها إلى الخادم، وأنواع المعاملات التي يمكن أن تمتلكها الاستعلامات، وأنواع البيانات التي تعيدها الاستعلامات.</p>
<p>أبسط الاستعلامات، <code>personCount</code>، يبدو كالتالي:</p>
<pre><code>query {
  personCount
}
</code></pre>
<p>بافتراض أن تطبيقنا حفظ معلومات ثلاثة أشخاص، ستبدو الاستجابة كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;personCount&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">3</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>الاستعلام الذي يجلب معلومات جميع الأشخاص، <code>allPersons</code>، أكثر تعقيداً قليلاً. ولأن الاستعلام يعيد قائمة من كائنات <em>Person</em>، يجب أن يصف الاستعلام <em>أي <a href="https://graphql.org/learn/queries/#fields" target="_blank" rel="noreferrer noopener">حقول</a></em> من الكائنات سيعيدها:</p>
<pre><code>query {
  allPersons {
    name
    phone
  }
}
</code></pre>
<p>قد تبدو الاستجابة كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;allPersons&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Arto Hellas&quot;</span><span class="hljs-punctuation">,</span>
        <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;040-123543&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Matti Luukkainen&quot;</span><span class="hljs-punctuation">,</span>
        <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;040-432342&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Venla Ruuska&quot;</span><span class="hljs-punctuation">,</span>
        <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">null</span></span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يمكن جعل الاستعلام يعيد أي حقل موصوف في المخطط. على سبيل المثال، ما يلي ممكن أيضاً:</p>
<pre><code>query {
  allPersons{
    name
    city
    street
  }
}
</code></pre>
<p>يوضح المثال الأخير استعلاماً يتطلب معاملاً، ويعيد تفاصيل شخص واحد.</p>
<pre><code>query {
  findPerson(name: &quot;Arto Hellas&quot;) {
    phone
    city
    street
    id
  }
}
</code></pre>
<p>إذن، أولاً يُوصف المعامل بين قوسين دائريين، ثم تُدرج حقول كائن القيمة المُعادة بين قوسين معقوفين.</p>
<p>الاستجابة كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;findPerson&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;040-123543&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;city&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Espoo&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;street&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Tapiolankatu 5 A&quot;</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;3d594650-3436-11e9-bc57-8b80ba54c431&quot;</span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>تم تعليم القيمة المُعادة كقابلة للقيمة الفارغة (nullable)، لذا إذا بحثنا عن تفاصيل شخص غير معروف</p>
<pre><code>query {
  findPerson(name: &quot;Joe Biden&quot;) {
    phone
  }
}
</code></pre>
<p>فالقيمة المُعادة هي <em>null</em>.</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;findPerson&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">null</span></span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>كما ترى، هناك رابط مباشر بين استعلام GraphQL وكائن JSON المُعاد. ويمكن للمرء أن يفكر في أن الاستعلام يصف نوع البيانات التي يريدها كاستجابة. والفرق عن استعلامات REST صارخ. ففي REST، لا علاقة لعنوان URL ونوع الطلب بشكل البيانات المُعادة.</p>
<p>لا يصف استعلام GraphQL سوى البيانات المتنقلة بين الخادم والعميل. وعلى الخادم، يمكن تنظيم البيانات وحفظها بأي طريقة نريد.</p>
<p>على الرغم من اسمه، لا علاقة لـ GraphQL فعلياً بقواعد البيانات. فهو لا يهتم بكيفية حفظ البيانات. يمكن حفظ البيانات التي يستخدمها GraphQL API في قاعدة بيانات علائقية، أو قاعدة بيانات مستندية، أو في خوادم أخرى يمكن لخادم GraphQL الوصول إليها باستخدام REST مثلاً.</p>
<h2 id="apollo-server">Apollo Server</h2>
<p>لننفّذ خادم GraphQL باستخدام المكتبة الرائدة اليوم: <a href="https://www.apollographql.com/docs/apollo-server/" target="_blank" rel="noreferrer noopener">Apollo Server</a>.</p>
<p>أنشئ مشروع npm جديد باستخدام <code>npm init</code> وثبّت الاعتماديات المطلوبة.</p>
<pre><code class="language-bash">npm install @apollo/server graphql
</code></pre>
<p>أنشئ أيضاً ملف <code>index.js</code> في الدليل الجذري لمشروعك.</p>
<p>الشيفرة الأولية كالتالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">ApolloServer</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server&#x27;</span>)
<span class="hljs-keyword">const</span> { startStandaloneServer } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;@apollo/server/standalone&#x27;</span>)

<span class="hljs-keyword">let</span> persons = [
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&quot;Arto Hellas&quot;</span>,
    <span class="hljs-attr">phone</span>: <span class="hljs-string">&quot;040-123543&quot;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&quot;Tapiolankatu 5 A&quot;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&quot;Espoo&quot;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&quot;3d594650-3436-11e9-bc57-8b80ba54c431&quot;</span>
  },
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&quot;Matti Luukkainen&quot;</span>,
    <span class="hljs-attr">phone</span>: <span class="hljs-string">&quot;040-432342&quot;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&quot;Malminkaari 10 A&quot;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&quot;Helsinki&quot;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&#x27;3d599470-3436-11e9-bc57-8b80ba54c431&#x27;</span>
  },
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&quot;Venla Ruuska&quot;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&quot;Nallemäentie 22 C&quot;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&quot;Helsinki&quot;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&#x27;3d599471-3436-11e9-bc57-8b80ba54c431&#x27;</span>
  },
]

<span class="hljs-keyword">const</span> typeDefs = <span class="hljs-string">\`
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
\`</span>

<span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: () =&amp;gt; persons,
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt;
      persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
  }
}

<span class="hljs-keyword">const</span> server = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ApolloServer</span>({
  typeDefs,
  resolvers,
})

<span class="hljs-title function_">startStandaloneServer</span>(server, {
  <span class="hljs-attr">listen</span>: { <span class="hljs-attr">port</span>: <span class="hljs-number">4000</span> },
}).<span class="hljs-title function_">then</span>(({ url }) =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Server ready at <span class="hljs-subst">\${url}</span>\`</span>)
})
</code></pre>
<p>قلب الشيفرة هو <a href="https://www.apollographql.com/docs/apollo-server/api/apollo-server/" target="_blank" rel="noreferrer noopener">ApolloServer</a>، الذي يُعطى معاملين:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> server = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ApolloServer</span>({
  typeDefs,
  resolvers,
})
</code></pre>
<p>المعامل الأول، <code>typeDefs</code>، يحتوي على مخطط GraphQL.</p>
<p>المعامل الثاني كائن يحتوي على <a href="https://www.apollographql.com/docs/apollo-server/data/resolvers/" target="_blank" rel="noreferrer noopener">resolvers</a> الخاصة بالخادم. وهي الشيفرة التي تحدد <em>كيفية</em> الاستجابة لاستعلامات GraphQL.</p>
<p>شيفرة الـ resolvers كالتالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: () =&amp;gt; persons,
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt;
      persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
  }
}
</code></pre>
<p>كما ترى، تتوافق الـ resolvers مع الاستعلامات الموصوفة في المخطط.</p>
<pre><code>type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
</code></pre>
<p>إذن يوجد حقل تحت <em>Query</em> لكل استعلام موصوف في المخطط.</p>
<p>الاستعلام</p>
<pre><code>query {
  personCount
}
</code></pre>
<p>له الـ resolver</p>
<pre><code>() =&amp;gt; persons.length
</code></pre>
<p>إذن الاستجابة للاستعلام هي طول المصفوفة <code>persons</code>.</p>
<p>الاستعلام الذي يجلب جميع الأشخاص</p>
<pre><code>query {
  allPersons {
    name
  }
}
</code></pre>
<p>له resolver يعيد <em>جميع</em> الكائنات من المصفوفة <code>persons</code>.</p>
<pre><code>() =&amp;gt; persons
</code></pre>
<h2 id="apollo-studio-explorer">Apollo Studio Explorer</h2>
<p>لنضف السكربتات التالية إلى <em>package.json</em> لتشغيل التطبيق:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">//...</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;start&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node index.js&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node --watch index.js&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// HIGHLIGHT LINE</span>
    <span class="hljs-comment">// ...</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>عند تشغيل خادم Apollo في وضع التطوير، تأخذنا الصفحة <a href="http://localhost:4000/" target="_blank" rel="noreferrer noopener">http://localhost:4000</a> إلى <a href="https://www.apollographql.com/docs/graphos/platform/explorer" target="_blank" rel="noreferrer noopener">GraphOS Studio Explorer</a>. وهذا مفيد جداً للمطوّر، ويمكن استخدامه لإجراء استعلامات على الخادم.</p>
<p>لنجربه:</p>
<p><img src="/images/mooc/b2e49557f381.webp" alt="استعلام مثال في Apollo Studio مع استجابة allPersons"></p>
<p>على الجانب الأيسر، يعرض Explorer توثيق الـ API الذي أنشأه تلقائياً بناءً على المخطط.</p>
<h2 id="إبراز-صيغة-المخطط-في-vs-code">إبراز صيغة المخطط في VS Code</h2>
<p>يُعرَّف المخطط في شيفرتنا باستخدام صيغة القالب النصي (template literal):</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> typeDefs = <span class="hljs-string">\`
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
\`</span>
</code></pre>
<p>يحتوي المخطط على معلومات بنيوية، لكن في محرر الشيفرة يظهر المحتوى كله باللون نفسه، ولا تستطيع أدوات التنسيق التلقائي مثل Prettier تنسيق محتوياته. يمكننا تفعيل إبراز صيغة مخطط GraphQL، والإكمال التلقائي مثلاً، في VS Code بتثبيت إضافة <a href="https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql" target="_blank" rel="noreferrer noopener">GraphQL: Language Feature Support</a>.</p>
<p>نحتاج إلى إشارة ما للإضافة تدل على أن <code>typeDefs</code> يحتوي على GraphQL. وهناك عدة طرق للقيام بذلك. سنفعلها الآن بإضافة التعليق الدال على النوع <code>/* GraphQL */</code> قبل نص القالب:</p>
<p><img src="/images/mooc/9c034d4fcf41.webp" alt="يستخدم VS Code إبراز الصيغة لمخطط GraphQL عند إضافة التعليق /* GraphQL */ قبل نص القالب"></p>
<p>الآن يعمل إبراز الصيغة. يساعد التعليق الإضافة المثبَّتة على التعرف على النص كـ GraphQL وتقديم ميزات ذكية للمحرر، لكنه لا يؤثر على وقت تشغيل التطبيق. ويمكن لـ Prettier الآن تنسيق المخطط أيضاً.</p>
<h3 id="معاملات-الـ-resolver">معاملات الـ resolver</h3>
<p>الاستعلام الذي يجلب شخصاً واحداً</p>
<pre><code>query {
  findPerson(name: &quot;Arto Hellas&quot;) {
    phone
    city
    street
  }
}
</code></pre>
<p>له resolver يختلف عن السابق لأنه يُعطى <em>معاملين</em>:</p>
<pre><code>(root, args) =&amp;gt; persons.find(p =&amp;gt; p.name === args.name)
</code></pre>
<p>المعامل الثاني، <code>args</code>، يحتوي على معاملات الاستعلام. ثم يعيد الـ resolver من المصفوفة <code>persons</code> الشخص الذي يتطابق اسمه مع قيمة <em>args.name</em>. ولا يحتاج الـ resolver إلى المعامل الأول <code>root</code>.</p>
<p>في الواقع، تُعطى جميع دوال الـ resolver <a href="https://www.graphql-tools.com/docs/resolvers#resolver-function-signature" target="_blank" rel="noreferrer noopener">أربعة معاملات</a>. وفي JavaScript، لا يلزم تعريف المعاملات إذا لم تكن مطلوبة. وسنستخدم المعامل الأول والثالث للـ resolver لاحقاً في هذا الجزء.</p>
<h2 id="الـ-resolver-الافتراضي">الـ resolver الافتراضي</h2>
<p>عندما نجري استعلاماً، على سبيل المثال</p>
<pre><code>query {
  findPerson(name: &quot;Arto Hellas&quot;) {
    phone
    city
    street
  }
}
</code></pre>
<p>يعرف الخادم كيف يعيد بالضبط الحقول التي يتطلبها الاستعلام. كيف يحدث ذلك؟</p>
<p>يجب أن يعرّف خادم GraphQL resolvers لـ<em>كل</em> حقل من كل نوع في المخطط. وقد عرّفنا حتى الآن resolvers فقط لحقول النوع <em>Query</em>، أي لكل استعلام في التطبيق.</p>
<p>ولأننا لم نعرّف resolvers لحقول النوع <em>Person</em>، فقد عرّف Apollo <a href="https://www.graphql-tools.com/docs/resolvers/#default-resolver" target="_blank" rel="noreferrer noopener">resolvers افتراضية</a> لها. وهي تعمل مثل المبيّن أدناه:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: () =&amp;gt; persons,
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt; persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
  },
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-attr">name</span>: (root) =&amp;gt; root.<span class="hljs-property">name</span>,
    <span class="hljs-attr">phone</span>: (root) =&amp;gt; root.<span class="hljs-property">phone</span>,
    <span class="hljs-attr">street</span>: (root) =&amp;gt; root.<span class="hljs-property">street</span>,
    <span class="hljs-attr">city</span>: (root) =&amp;gt; root.<span class="hljs-property">city</span>,
    <span class="hljs-attr">id</span>: (root) =&amp;gt; root.<span class="hljs-property">id</span>
  }
  <span class="hljs-comment">// END HIGHLIGHT</span>
}
</code></pre>
<p>يعيد الـ resolver الافتراضي قيمة الحقل المقابل في الكائن. ويمكن الوصول إلى الكائن نفسه عبر المعامل الأول للـ resolver، <code>root</code>.</p>
<p>إذا كانت وظيفة الـ resolver الافتراضي كافية، فلا حاجة لتعريف resolver خاص بك. ويمكن أيضاً تعريف resolvers لبعض حقول النوع فقط، وترك الباقي للـ resolvers الافتراضية.</p>
<p>يمكننا مثلاً تعريف أن عنوان جميع الأشخاص هو <em>Manhattan New York</em> بكتابة ما يلي بشكل ثابت في resolvers حقلي street وcity من النوع <em>Person</em>:</p>
<pre><code>Person: {
  street: (root) =&amp;gt; &quot;Manhattan&quot;,
  city: (root) =&amp;gt; &quot;New York&quot;
}
</code></pre>
<h2 id="كائن-داخل-كائن">كائن داخل كائن</h2>
<p>لنعدّل المخطط قليلاً</p>
<pre><code>  // BEGIN HIGHLIGHT
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
</code></pre>
<p>فأصبح للشخص الآن حقل من النوع <em>Address</em>، يحتوي على الشارع والمدينة.</p>
<p>ولأن الكائنات المحفوظة في المصفوفة لا تحتوي على حقل <em>address</em>، لا يكفي الـ resolver الافتراضي. لنضف resolver لحقل <em>address</em> من النوع <em>Person</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: () =&amp;gt; persons,
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt;
      persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
  },
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-attr">address</span>: (root) =&amp;gt; {
      <span class="hljs-keyword">return</span> {
        <span class="hljs-attr">street</span>: root.<span class="hljs-property">street</span>,
        <span class="hljs-attr">city</span>: root.<span class="hljs-property">city</span>
      }
    }
  }
  <span class="hljs-comment">// END HIGHLIGHT</span>
}
</code></pre>
<p>إذن في كل مرة يُعاد كائن <em>Person</em>، تُعاد الحقول <em>name</em> و <em>phone</em> و <em>id</em> باستخدام resolvers الافتراضية، أما الحقل <em>address</em> فيُكوَّن باستخدام resolver معرَّف ذاتياً. المعامل <code>root</code> في دالة الـ resolver هو كائن الشخص، لذا يمكن أخذ الشارع والمدينة في العنوان من حقوله.</p>
<p>الاستعلامات التي تتطلب العنوان تصبح</p>
<pre><code>query {
  findPerson(name: &quot;Arto Hellas&quot;) {
    phone
    address {
      city
      street
    }
  }
}
</code></pre>
<p>والاستجابة الآن كائن شخص <em>يحتوي</em> على كائن عنوان.</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;findPerson&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;040-123543&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;address&quot;</span><span class="hljs-punctuation">:</span>  <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;city&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Espoo&quot;</span><span class="hljs-punctuation">,</span>
        <span class="hljs-attr">&quot;street&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Tapiolankatu 5 A&quot;</span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>ما زلنا نحفظ الأشخاص في الخادم بالطريقة نفسها التي فعلناها سابقاً.</p>
<pre><code class="language-js"><span class="hljs-keyword">let</span> persons = [
  {
    <span class="hljs-attr">name</span>: <span class="hljs-string">&quot;Arto Hellas&quot;</span>,
    <span class="hljs-attr">phone</span>: <span class="hljs-string">&quot;040-123543&quot;</span>,
    <span class="hljs-attr">street</span>: <span class="hljs-string">&quot;Tapiolankatu 5 A&quot;</span>,
    <span class="hljs-attr">city</span>: <span class="hljs-string">&quot;Espoo&quot;</span>,
    <span class="hljs-attr">id</span>: <span class="hljs-string">&quot;3d594650-3436-11e9-bc57-8b80ba54c431&quot;</span>
  },
  <span class="hljs-comment">// ...</span>
]
</code></pre>
<p>كائنات الأشخاص المحفوظة في الخادم ليست مطابقة تماماً لكائنات النوع <em>Person</em> الموصوفة في المخطط.</p>
<p>وخلافاً للنوع <em>Person</em>، لا يمتلك النوع <em>Address</em> حقلاً <em>id</em>، لأنها لا تُحفظ في بنية بيانات منفصلة خاصة بها في الخادم.</p>
<p>لنعدّل الـ resolver الخاص بحقل <code>address</code> بحيث يفكّك الحقول المطلوبة من المعامل الذي يستقبله:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
    <span class="hljs-attr">allPersons</span>: () =&amp;gt; persons,
    <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt; persons.<span class="hljs-title function_">find</span>((p) =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>),
  },
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-attr">address</span>: ({ street, city }) =&amp;gt; { <span class="hljs-comment">// HIGHLIGHT LINE</span>
      <span class="hljs-keyword">return</span> {
        street, <span class="hljs-comment">// HIGHLIGHT LINE</span>
        city, <span class="hljs-comment">// HIGHLIGHT LINE</span>
      }
    },
  },
}
</code></pre>
<p>يمكن العثور على الشيفرة الحالية للتطبيق على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-1" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع <em>part8-1</em>.</p>
<h2 id="mutations">Mutations</h2>
<p>لنضف وظيفة لإضافة أشخاص جدد إلى دليل الهاتف. في GraphQL، تُنفَّذ جميع العمليات التي تُحدث تغييراً عبر <a href="https://graphql.org/learn/mutations" target="_blank" rel="noreferrer noopener">mutations</a>. وتُوصف الـ mutations في المخطط كمفاتيح من النوع <em>Mutation</em>.</p>
<p>مخطط mutation لإضافة شخص جديد يبدو كالتالي:</p>
<pre><code>type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
</code></pre>
<p>تُعطى الـ Mutation تفاصيل الشخص كمعاملات. والمعامل <em>phone</em> هو الوحيد القابل للقيمة الفارغة. وللـ Mutation أيضاً قيمة مُعادة. القيمة المُعادة من النوع <em>Person</em>، والفكرة أن تُعاد تفاصيل الشخص المضاف إذا نجحت العملية، وإلا فـ null. ولا تُعطى قيمة للحقل <em>id</em> كمعامل. فمن الأفضل ترك توليد المعرّف للخادم.</p>
<p>تتطلب الـ mutations أيضاً resolver:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-attr">v1</span>: uuid } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;uuid&#x27;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-title class_">Query</span>: {
    <span class="hljs-comment">// ...</span>
  },
  <span class="hljs-title class_">Person</span>: {
    <span class="hljs-comment">// ...</span>
  },
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-title class_">Mutation</span>: {
    <span class="hljs-attr">addPerson</span>: (root, args) =&amp;gt; {
      <span class="hljs-keyword">const</span> person = { ...args, <span class="hljs-attr">id</span>: <span class="hljs-title function_">uuid</span>() }
      persons = persons.<span class="hljs-title function_">concat</span>(person)
      <span class="hljs-keyword">return</span> person
    }
  }
  <span class="hljs-comment">// END HIGHLIGHT</span>
}

<span class="hljs-comment">// ...</span>
</code></pre>
<p>تضيف الـ mutation الكائن المُعطى لها كمعامل <code>args</code> إلى المصفوفة <code>persons</code>، وتعيد الكائن الذي أضافته إلى المصفوفة.</p>
<p>يُعطى الحقل <em>id</em> قيمة فريدة باستخدام مكتبة <a href="https://github.com/kelektiv/node-uuid#readme" target="_blank" rel="noreferrer noopener">uuid</a>.</p>
<p>يمكن إضافة شخص جديد باستخدام الـ mutation التالية</p>
<pre><code>mutation {
  addPerson(
    name: &quot;Pekka Mikkola&quot;
    phone: &quot;045-2374321&quot;
    street: &quot;Vilppulantie 25&quot;
    city: &quot;Helsinki&quot;
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
</code></pre>
<p>لاحظ أن الشخص يُحفظ في المصفوفة <code>persons</code> بالشكل</p>
<pre><code>{
  name: &quot;Pekka Mikkola&quot;,
  phone: &quot;045-2374321&quot;,
  street: &quot;Vilppulantie 25&quot;,
  city: &quot;Helsinki&quot;,
  id: &quot;2b24e0b0-343c-11e9-8c2a-cb57c2bf804f&quot;
}
</code></pre>
<p>لكن الاستجابة للـ mutation هي</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;addPerson&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
      <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Pekka Mikkola&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;phone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;045-2374321&quot;</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;address&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;city&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Helsinki&quot;</span><span class="hljs-punctuation">,</span>
        <span class="hljs-attr">&quot;street&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Vilppulantie 25&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-attr">&quot;id&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;2b24e0b0-343c-11e9-8c2a-cb57c2bf804f&quot;</span>
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>إذن يقوم resolver الحقل <em>address</em> من النوع <em>Person</em> بتنسيق كائن الاستجابة إلى الشكل الصحيح.</p>
<h2 id="معالجة-الأخطاء">معالجة الأخطاء</h2>
<p>إذا حاولنا إنشاء شخص جديد، لكن المعاملات لا تتوافق مع وصف المخطط، يعطي الخادم رسالة خطأ:</p>
<p><img src="/images/mooc/c723d58c5859.webp" alt="يعرض Apollo خطأً مع addPerson GRAPHQL VALIDATION FAILED"></p>
<p>إذن يمكن تنفيذ بعض معالجة الأخطاء تلقائياً عبر <a href="https://graphql.org/learn/validation/" target="_blank" rel="noreferrer noopener">التحقق</a> في GraphQL.</p>
<p>لكن GraphQL لا يستطيع التعامل مع كل شيء تلقائياً. على سبيل المثال، يجب إضافة قواعد أكثر صرامة للبيانات المُرسلة إلى Mutation يدوياً. ويمكن التعامل مع خطأ برمي <a href="https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors" target="_blank" rel="noreferrer noopener">GraphQLError</a> مع <a href="https://www.apollographql.com/docs/apollo-server/data/errors/#built-in-error-codes" target="_blank" rel="noreferrer noopener">رمز خطأ</a> مناسب.</p>
<p>لنمنع إضافة الاسم نفسه إلى دليل الهاتف عدة مرات:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">GraphQLError</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;graphql&#x27;</span>) <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> resolvers = {
  <span class="hljs-comment">// ..</span>
  <span class="hljs-title class_">Mutation</span>: {
    <span class="hljs-attr">addPerson</span>: (root, args) =&amp;gt; {
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      <span class="hljs-keyword">if</span> (persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">GraphQLError</span>(<span class="hljs-string">\`Name must be unique: <span class="hljs-subst">\${args.name}</span>\`</span>, {
          <span class="hljs-attr">extensions</span>: {
            <span class="hljs-attr">code</span>: <span class="hljs-string">&#x27;BAD_USER_INPUT&#x27;</span>,
            <span class="hljs-attr">invalidArgs</span>: args.<span class="hljs-property">name</span>
          }
        })
      }
      <span class="hljs-comment">// END HIGHLIGHT</span>

      <span class="hljs-keyword">const</span> person = { ...args, <span class="hljs-attr">id</span>: <span class="hljs-title function_">uuid</span>() }
      persons = persons.<span class="hljs-title function_">concat</span>(person)
      <span class="hljs-keyword">return</span> person
    }
  }
}
</code></pre>
<p>إذن إذا كان الاسم المراد إضافته موجوداً بالفعل في دليل الهاتف، فارمِ خطأ <code>GraphQLError</code>.</p>
<p><img src="/images/mooc/ec6b0ba55a28.webp" alt="يعرض Apollo خطأ BAD_USER_INPUT"></p>
<p>يمكن العثور على الشيفرة الحالية للتطبيق على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-2" target="_blank" rel="noreferrer noopener">GitHub</a>، في الفرع <em>part8-2</em>.</p>
<h2 id="enum">Enum</h2>
<p>لنضف إمكانية ترشيح الاستعلام الذي يعيد جميع الأشخاص بالمعامل <em>phone</em> بحيث يعيد فقط الأشخاص الذين لديهم رقم هاتف</p>
<pre><code>query {
  allPersons(phone: YES) {
    name
    phone
  }
}
</code></pre>
<p>أو الأشخاص الذين ليس لديهم رقم هاتف</p>
<pre><code>query {
  allPersons(phone: NO) {
    name
  }
}
</code></pre>
<p>يتغير المخطط كالتالي:</p>
<pre><code>// BEGIN HIGHLIGHT
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
</code></pre>
<p>النوع <em>YesNo</em> هو <a href="https://graphql.org/learn/schema/#enumeration-types" target="_blank" rel="noreferrer noopener">enum</a> في GraphQL، أو نوع قابل للتعداد، بقيمتين محتملتين: <em>YES</em> أو <em>NO</em>. في الاستعلام <code>allPersons</code>، يمتلك المعامل <code>phone</code> النوع <em>YesNo</em>، لكنه قابل للقيمة الفارغة.</p>
<p>يتغير الـ resolver كالتالي:</p>
<pre><code class="language-js"><span class="hljs-title class_">Query</span>: {
  <span class="hljs-attr">personCount</span>: () =&amp;gt; persons.<span class="hljs-property">length</span>,
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-attr">allPersons</span>: (root, args) =&amp;gt; {
    <span class="hljs-keyword">if</span> (!args.<span class="hljs-property">phone</span>) {
      <span class="hljs-keyword">return</span> persons
    }

    <span class="hljs-keyword">const</span> byPhone = (person) =&amp;gt;
      args.<span class="hljs-property">phone</span> === <span class="hljs-string">&#x27;YES&#x27;</span> ? person.<span class="hljs-property">phone</span> : !person.<span class="hljs-property">phone</span>

    <span class="hljs-keyword">return</span> persons.<span class="hljs-title function_">filter</span>(byPhone)
  },
  <span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-attr">findPerson</span>: (root, args) =&amp;gt;
    persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
},
</code></pre>
<h2 id="تغيير-رقم-هاتف">تغيير رقم هاتف</h2>
<p>لنضف mutation لتغيير رقم هاتف شخص. مخطط هذه الـ mutation يبدو كالتالي:</p>
<pre><code>type Mutation {
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
</code></pre>
<p>وتُنفَّذ عبر resolver:</p>
<pre><code class="language-js"><span class="hljs-title class_">Mutation</span>: {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">editNumber</span>: (root, args) =&amp;gt; {
    <span class="hljs-keyword">const</span> person = persons.<span class="hljs-title function_">find</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span>)
    <span class="hljs-keyword">if</span> (!person) {
      <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
    }

    <span class="hljs-keyword">const</span> updatedPerson = { ...person, <span class="hljs-attr">phone</span>: args.<span class="hljs-property">phone</span> }
    persons = persons.<span class="hljs-title function_">map</span>(p =&amp;gt; p.<span class="hljs-property">name</span> === args.<span class="hljs-property">name</span> ? updatedPerson : p)
    <span class="hljs-keyword">return</span> updatedPerson
  }
}
</code></pre>
<p>تجد الـ mutation الشخص المراد تحديثه عبر الحقل <em>name</em>.</p>
<p>يمكن العثور على الشيفرة الحالية للتطبيق على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع <em>part8-3</em>.</p>
<h2 id="المزيد-عن-الاستعلامات">المزيد عن الاستعلامات</h2>
<p>مع GraphQL، يمكن دمج عدة حقول من النوع <em>Query</em>، أو «استعلامات منفصلة»، في استعلام واحد. على سبيل المثال، يعيد الاستعلام التالي كلاًّ من عدد الأشخاص في دليل الهاتف وأسمائهم:</p>
<pre><code>query {
  personCount
  allPersons {
    name
  }
}
</code></pre>
<p>تبدو الاستجابة كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;personCount&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-number">3</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;allPersons&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Arto Hellas&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Matti Luukkainen&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Venla Ruuska&quot;</span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>يمكن للاستعلام المدمج أيضاً استخدام الاستعلام نفسه عدة مرات. لكن يجب إعطاء الاستعلامات أسماء بديلة كالتالي:</p>
<pre><code>query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
</code></pre>
<p>تبدو الاستجابة كالتالي:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;data&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;havePhone&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Arto Hellas&quot;</span>
      <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Matti Luukkainen&quot;</span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;phoneless&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span>
      <span class="hljs-punctuation">{</span>
        <span class="hljs-attr">&quot;name&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;Venla Ruuska&quot;</span>
      <span class="hljs-punctuation">}</span>
    <span class="hljs-punctuation">]</span>
  <span class="hljs-punctuation">}</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>في بعض الحالات، قد يكون من المفيد تسمية الاستعلامات. ويحدث ذلك خاصة عندما تحتوي الاستعلامات أو الـ mutations على <a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">معاملات</a>. وسنتناول المعاملات قريباً.</p>
<div class="tasks">
<p><strong>1. عدد الكتب والمؤلفين</strong></p>
</div>
<div class="tasks">
<p><strong>2. كل الكتب</strong></p>
</div>
<div class="tasks">
<p><strong>3. كل المؤلفين</strong></p>
</div>
<div class="tasks">
<p><strong>4. كتب مؤلف</strong></p>
</div>
<div class="tasks">
<p><strong>5. الكتب حسب النوع الأدبي</strong></p>
</div>
<div class="tasks">
<p><strong>6. إضافة كتاب</strong></p>
</div>
<div class="tasks">
<p><strong>7. تحديث سنة ميلاد مؤلف</strong></p>
</div>
`,r={part:8,letter:"b",file:s,title:n,slug:a,mainImage:p,headings:t,html:e};export{r as default,s as file,t as headings,e as html,o as letter,p as mainImage,l as part,a as slug,n as title};
