const e=8,o="e",s="e.md",a="تسجيل الدخول وتحديث الذاكرة المؤقتة",n="login_and_updating_the_cache",l="/images/part-8.svg",p=[{depth:2,id:"تسجيل-دخول-المستخدم",text:"تسجيل دخول المستخدم"},{depth:2,id:"إضافة-token-إلى-الترويسة",text:"إضافة token إلى الترويسة"},{depth:2,id:"إصلاح-التحققات",text:"إصلاح التحققات"},{depth:2,id:"تحديث-الذاكرة-المؤقتة-مرة-أخرى",text:"تحديث الذاكرة المؤقتة مرة أخرى"}],t=`<p>تعرض الواجهة الأمامية لتطبيقنا دليل الهاتف بشكل جيد مع الخادم المحدّث. لكن إذا أردنا إضافة أشخاص جدد، فعلينا إضافة وظيفة تسجيل الدخول إلى الواجهة الأمامية.</p>
<h2 id="تسجيل-دخول-المستخدم">تسجيل دخول المستخدم</h2>
<p>لنُعرّف أولاً الـ mutation الخاصة بتسجيل الدخول في الملف <em>src/queries.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-variable constant_">LOGIN</span> = gql\`<span class="language-graphql">
  <span class="hljs-keyword">mutation</span> login<span class="hljs-punctuation">(</span><span class="hljs-variable">$username</span>: String<span class="hljs-punctuation">!</span>, <span class="hljs-variable">$password</span>: String<span class="hljs-punctuation">!</span><span class="hljs-punctuation">)</span> <span class="hljs-punctuation">{</span>
    login<span class="hljs-punctuation">(</span><span class="hljs-symbol">username</span><span class="hljs-punctuation">:</span> <span class="hljs-variable">$username</span>, <span class="hljs-symbol">password</span><span class="hljs-punctuation">:</span> <span class="hljs-variable">$password</span>)  <span class="hljs-punctuation">{</span>
      value
    <span class="hljs-punctuation">}</span>
  <span class="hljs-punctuation">}</span>
\`</span>

</code></pre>
<p>لنُعرّف المكوّن <code>LoginForm</code> المسؤول عن تسجيل الدخول في الملف <em>src/components/LoginForm.jsx</em>. وهو يعمل بالطريقة نفسها تقريباً التي تعمل بها المكوّنات السابقة التي تتعامل مع الـ mutations. الأسطر المهمة مُبرَزة في الشيفرة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> { useMutation } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@apollo/client/react&#x27;</span>
<span class="hljs-keyword">import</span> { <span class="hljs-variable constant_">LOGIN</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../queries&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">LoginForm</span> = (<span class="hljs-params">{ setError, setToken }</span>) =&gt; {
  <span class="hljs-keyword">const</span> [username, setUsername] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [password, setPassword] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)


  <span class="hljs-keyword">const</span> [ login ] = <span class="hljs-title function_">useMutation</span>(<span class="hljs-variable constant_">LOGIN</span>, {
    <span class="hljs-attr">onCompleted</span>: <span class="hljs-function">(<span class="hljs-params">data</span>) =&gt;</span> {
      <span class="hljs-keyword">const</span> token = data.<span class="hljs-property">login</span>.<span class="hljs-property">value</span>
      <span class="hljs-title function_">setToken</span>(token)
      <span class="hljs-variable language_">localStorage</span>.<span class="hljs-title function_">setItem</span>(<span class="hljs-string">&#x27;phonebook-user-token&#x27;</span>, token)
    },
    <span class="hljs-attr">onError</span>: <span class="hljs-function">(<span class="hljs-params">error</span>) =&gt;</span> {
      <span class="hljs-title function_">setError</span>(error.<span class="hljs-property">message</span>)
    }
  })



  <span class="hljs-keyword">const</span> <span class="hljs-title function_">submit</span> = (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-title function_">login</span>({ <span class="hljs-attr">variables</span>: { username, password } })
  }


  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{submit}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          username <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{username}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          password <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">type</span>=<span class="hljs-string">&#x27;password&#x27;</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{password}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setPassword(target.value)}
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&#x27;submit&#x27;</span>&gt;</span>login<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">LoginForm</span>

</code></pre>
<p>يتلقّى المكوّن الدالتين <code>setError</code> و<code>setToken</code> كـ props، ويمكن استخدامهما لتغيير حالة التطبيق. ويُترك تعريف إدارة الحالة إلى المكوّن <code>App</code>.</p>
<p>بالنسبة إلى دالة <code>useMutation</code> التي تنفّذ تسجيل الدخول، تُعرَّف دالة استدعاء راجعة (callback) باسم <code>onCompleted</code>. وتُستدعى هذه الدالة عند تنفيذ الـ mutation بنجاح. وفي دالة الاستدعاء الراجعة، تُقرأ قيمة token من بيانات الاستجابة ثم تُخزَّن في حالة التطبيق وفي localStorage الخاص بالمتصفح.</p>
<p>لنستخدم الآن مكوّن <em>LoginForm</em> في ملف <em>App.jsx</em>. نضيف متغير <code>token</code> إلى حالة التطبيق لتخزين token بعد تسجيل دخول المستخدم. وإذا لم يكن <code>token</code> معرَّفاً، نعرض نموذج تسجيل الدخول فقط:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">LoginForm</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/LoginForm&#x27;</span>
<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [token, setToken] = <span class="hljs-title function_">useState</span>(<span class="hljs-variable language_">localStorage</span>.<span class="hljs-title function_">getItem</span>(<span class="hljs-string">&#x27;phonebook-user-token&#x27;</span>))
  <span class="hljs-keyword">const</span> [errorMessage, setErrorMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>(<span class="hljs-variable constant_">ALL_PERSONS</span>)

  <span class="hljs-keyword">if</span> (result.<span class="hljs-property">loading</span>) {
    <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>loading...<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">notify</span> = (<span class="hljs-params">message</span>) =&gt; {
    <span class="hljs-title function_">setErrorMessage</span>(message)
    <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
      <span class="hljs-title function_">setErrorMessage</span>(<span class="hljs-literal">null</span>)
    }, <span class="hljs-number">10000</span>)
  }


  <span class="hljs-keyword">if</span> (!token) {
    <span class="hljs-keyword">return</span> (
      <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Notify</span> <span class="hljs-attr">errorMessage</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Login<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">LoginForm</span>
          <span class="hljs-attr">setToken</span>=<span class="hljs-string">{setToken}</span>
          <span class="hljs-attr">setError</span>=<span class="hljs-string">{notify}</span>
        /&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
    )
  }


  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// ...</span>
  )
}

</code></pre>
<p>يُهيَّأ token الآن من قيمة token قد توجد في localStorage:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> [token, setToken] = <span class="hljs-title function_">useState</span>(<span class="hljs-variable language_">localStorage</span>.<span class="hljs-title function_">getItem</span>(<span class="hljs-string">&#x27;phonebook-user-token&#x27;</span>))

</code></pre>
<p>بهذه الطريقة، يُستعاد token أيضاً عند إعادة تحميل الصفحة، ويبقى المستخدم مسجّلاً الدخول. وإذا لم يحتوي localStorage على قيمة للمفتاح <em>phonebook-user-token</em>، فستكون قيمة token هي <code>null</code>.</p>
<p>نضيف أيضاً زراً يسمح للمستخدم المسجّل الدخول بتسجيل الخروج. في معالج النقر على الزر، نضبط <code>token</code> على <code>null</code>، ونحذف token من localStorage، ونعيد تعيين الذاكرة المؤقتة الخاصة بـ Apollo Client:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useApolloClient, useQuery } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@apollo/client/react&#x27;</span>
<span class="hljs-comment">//...</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [token, setToken] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
  <span class="hljs-keyword">const</span> [errorMessage, setErrorMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>(<span class="hljs-variable constant_">ALL_PERSONS</span>)
  <span class="hljs-keyword">const</span> client = <span class="hljs-title function_">useApolloClient</span>()

  <span class="hljs-keyword">if</span> (result.<span class="hljs-property">loading</span>)  {
    <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>loading...<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  }


  <span class="hljs-keyword">const</span> <span class="hljs-title function_">onLogout</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-title function_">setToken</span>(<span class="hljs-literal">null</span>)
    <span class="hljs-variable language_">localStorage</span>.<span class="hljs-title function_">clear</span>()
    client.<span class="hljs-title function_">resetStore</span>()
  }


  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Notify</span> <span class="hljs-attr">errorMessage</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{onLogout}</span>&gt;</span>logout<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Persons</span> <span class="hljs-attr">persons</span>=<span class="hljs-string">{result.data.allPersons}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">PersonForm</span> <span class="hljs-attr">setError</span>=<span class="hljs-string">{notify}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">PhoneForm</span> <span class="hljs-attr">setError</span>=<span class="hljs-string">{notify}</span> /&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  )
}

</code></pre>
<p>تتم إعادة تعيين الذاكرة المؤقتة باستخدام الدالة <a href="https://www.apollographql.com/docs/react/api/core/ApolloClient#resetstore" target="_blank" rel="noreferrer noopener">resetStore</a> في كائن Apollo <code>client</code>، ويمكن الوصول إلى client نفسه عبر الخطاف <a href="https://www.apollographql.com/docs/react/api/react/useApolloClient" target="_blank" rel="noreferrer noopener">useApolloClient</a>. ومسح الذاكرة المؤقتة <a href="https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout" target="_blank" rel="noreferrer noopener">مهم</a>، لأن بعض الاستعلامات قد تكون جلبت بيانات إلى الذاكرة المؤقتة لا يُسمح بالوصول إليها إلا لمستخدم مُصادَق عليه.</p>
<h2 id="إضافة-token-إلى-الترويسة">إضافة token إلى الترويسة</h2>
<p>بعد تغييرات الواجهة الخلفية، تتطلب إضافة أشخاص جدد إرسال token صالح للمستخدم مع الطلب. وهذا يتطلب تغييرات في تهيئة Apollo Client في ملف <em>main.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">StrictMode</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> { createRoot } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App.jsx&#x27;</span>

<span class="hljs-keyword">import</span> { <span class="hljs-title class_">ApolloClient</span>, <span class="hljs-title class_">HttpLink</span>, <span class="hljs-title class_">InMemoryCache</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@apollo/client&#x27;</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">ApolloProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@apollo/client/react&#x27;</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">SetContextLink</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@apollo/client/link/context&#x27;</span>


<span class="hljs-keyword">const</span> authLink  = <span class="hljs-keyword">new</span> <span class="hljs-title class_">SetContextLink</span>(<span class="hljs-function">(<span class="hljs-params">{ headers }</span>) =&gt;</span> {
  <span class="hljs-keyword">const</span> token = <span class="hljs-variable language_">localStorage</span>.<span class="hljs-title function_">getItem</span>(<span class="hljs-string">&#x27;phonebook-user-token&#x27;</span>)
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">headers</span>: {
      ...headers,
      <span class="hljs-attr">authorization</span>: token ? <span class="hljs-string">\`Bearer <span class="hljs-subst">\${token}</span>\`</span> : <span class="hljs-literal">null</span>,
    }
  }
})


<span class="hljs-keyword">const</span> httpLink = <span class="hljs-keyword">new</span> <span class="hljs-title class_">HttpLink</span>({ <span class="hljs-attr">uri</span>: <span class="hljs-string">&#x27;http://localhost:4000&#x27;</span> })


<span class="hljs-keyword">const</span> client = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ApolloClient</span>({
  <span class="hljs-attr">cache</span>: <span class="hljs-keyword">new</span> <span class="hljs-title class_">InMemoryCache</span>(),
  <span class="hljs-attr">link</span>: authLink.<span class="hljs-title function_">concat</span>(httpLink)
})


<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>)).<span class="hljs-title function_">render</span>(
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">StrictMode</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">ApolloProvider</span> <span class="hljs-attr">client</span>=<span class="hljs-string">{client}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">ApolloProvider</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">StrictMode</span>&gt;</span></span>,
)

</code></pre>
<p>كما في السابق، يُغلَّف عنوان URL الخاص بالخادم باستخدام مُنشئ <a href="https://www.apollographql.com/docs/react/api/link/apollo-link-http" target="_blank" rel="noreferrer noopener">HttpLink</a> لإنشاء كائن <code>httpLink</code> مناسب. لكن هذه المرة، يُعدَّل باستخدام <a href="https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview" target="_blank" rel="noreferrer noopener">context</a> المعرَّف بواسطة كائن <code>authLink</code> بحيث تُضبط ترويسة <em>authorization</em> لكل طلب لتصبح <a href="https://www.apollographql.com/docs/react/networking/authentication/#header" target="_blank" rel="noreferrer noopener">قيمة token</a> الذي قد يكون مخزَّناً في localStorage.</p>
<p>تعمل إضافة الأشخاص الجدد وتغيير الأرقام مرة أخرى.</p>
<h2 id="إصلاح-التحققات">إصلاح التحققات</h2>
<p>في التطبيق، ينبغي أن يكون ممكناً إضافة شخص دون رقم هاتف. لكن إذا حاولنا الآن إضافة شخص دون رقم هاتف، فلن ينجح الأمر:</p>
<p><img src="/images/mooc/2ad4ea9510aa.webp" alt="المتصفح يعرض فشل التحقق من صحة بيانات الشخص"></p>
<p>يفشل التحقق، لأن الواجهة الأمامية ترسل نصاً فارغاً كقيمة للحقل <code>phone</code>.</p>
<p>لنغيّر الدالة التي تنشئ أشخاصاً جدد بحيث تضبط <code>phone</code> على <code>undefined</code> إذا لم يُدخل المستخدم قيمة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">PersonForm</span> = (<span class="hljs-params">{ setError }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">submit</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()


    <span class="hljs-title function_">createPerson</span>({
      <span class="hljs-attr">variables</span>: {
        name,
        street,
        city,
        <span class="hljs-attr">phone</span>: phone.<span class="hljs-property">length</span> &gt; <span class="hljs-number">0</span> ? phone : <span class="hljs-literal">undefined</span>,
      },
    })


    <span class="hljs-title function_">setName</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setPhone</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setStreet</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setCity</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  }

  <span class="hljs-comment">// ...</span>
}

</code></pre>
<p>من منظور الواجهة الخلفية وقاعدة البيانات، لم تعد لسمة <em>phone</em> قيمة إذا ترك المستخدم الحقل فارغاً. وتعمل إضافة شخص دون رقم هاتف مرة أخرى.</p>
<p>هناك أيضاً مشكلة في وظيفة تغيير رقم الهاتف. فتحققات قاعدة البيانات تشترط أن يكون رقم الهاتف 5 محارف على الأقل، لكن إذا حاولنا تحديث رقم هاتف شخص موجود إلى رقم قصير جداً، فلا يبدو أن شيئاً يحدث. لا يُحدَّث رقم هاتف الشخص، لكن في المقابل لا تظهر رسالة خطأ أيضاً.</p>
<p>من تبويب <em>Network</em> في وحدة التحكم يمكننا أن نرى أن الطلب يُجاب برسالة خطأ:</p>
<p><img src="/images/mooc/d455f2772201.webp" alt="يعرض تبويب Network في وحدة التحكم رسالة الخطأ المُعادة في الاستجابة"></p>
<p>لنعدّل التطبيق بحيث تظهر أخطاء التحقق أيضاً عند تغيير رقم هاتف:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">PhoneForm</span> = (<span class="hljs-params">{ setError }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">submit</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()


    <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">await</span> <span class="hljs-title function_">changeNumber</span>({ <span class="hljs-attr">variables</span>: { name, phone } })
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-title function_">setError</span>(error.<span class="hljs-property">message</span>)
    }


    <span class="hljs-title function_">setName</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setPhone</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  }

  <span class="hljs-comment">// ...</span>
}

</code></pre>
<p>الطلب الذي يحدّث الرقم، <code>changeNumber</code>، يُنفَّذ الآن داخل كتلة <em>try</em>. وإذا فشلت تحققات قاعدة البيانات، ينتهي التنفيذ في كتلة <em>catch</em>، حيث تُضبط رسالة خطأ مناسبة في التطبيق باستخدام الدالة <code>setError</code>:</p>
<p><img src="/images/mooc/bb80cd39240f.webp" alt="يعرض التطبيق رسالة خطأ إذا كان رقم الهاتف أقصر من 5 محارف"></p>
<h2 id="تحديث-الذاكرة-المؤقتة-مرة-أخرى">تحديث الذاكرة المؤقتة مرة أخرى</h2>
<p>علينا <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql/chapter-3#updating-the-cache" target="_blank" rel="noreferrer noopener">تحديث</a> الذاكرة المؤقتة لعميل Apollo عند إنشاء أشخاص جدد. يمكننا تحديثها باستخدام خيار <code>refetchQueries</code> الخاص بالـ mutation لتحديد إعادة تنفيذ استعلام <code>ALL_PERSONS</code>.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">PersonForm</span> = (<span class="hljs-params">{ setError }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> [createPerson] = <span class="hljs-title function_">useMutation</span>(<span class="hljs-variable constant_">CREATE_PERSON</span>, {
    <span class="hljs-attr">onError</span>: <span class="hljs-function">(<span class="hljs-params">error</span>) =&gt;</span> <span class="hljs-title function_">setError</span>(error.<span class="hljs-property">message</span>),
    <span class="hljs-attr">refetchQueries</span>: [{ <span class="hljs-attr">query</span>: <span class="hljs-variable constant_">ALL_PERSONS</span> }],
  })

<span class="hljs-comment">// ...</span>
}

</code></pre>
<p>هذا الأسلوب جيد جداً، وعيبه أن الاستعلام يُعاد تنفيذه دائماً مع أي تحديثات.</p>
<p>من الممكن تحسين الحل بتحديث الذاكرة المؤقتة يدوياً. ويتم ذلك بتعريف دالة استدعاء راجعة <a href="https://www.apollographql.com/docs/react/data/mutations/#the-update-function" target="_blank" rel="noreferrer noopener">update</a> مناسبة للـ mutation بدلاً من استخدام السمة <code>refetchQueries</code>. ينفّذ Apollo دالة الاستدعاء الراجعة هذه بعد اكتمال الـ mutation:</p>
<pre><code class="language-sql">const PersonForm <span class="hljs-operator">=</span> ({ setError }) <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> {
  <span class="hljs-operator">/</span><span class="hljs-operator">/</span> ...

  const [createPerson] <span class="hljs-operator">=</span> useMutation(CREATE_PERSON, {
    onError: (error) <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> setError(error.message),

    <span class="hljs-keyword">update</span>: (cache, response) <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> {
        <span class="hljs-keyword">return</span> {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },

  })

  <span class="hljs-operator">/</span><span class="hljs-operator">/</span> ..
}

</code></pre>
<p>تُعطى دالة الاستدعاء الراجعة مرجعاً إلى الذاكرة المؤقتة والبيانات التي أعادتها الـ mutation كمعاملات. وفي حالتنا مثلاً، ستكون هذه البيانات هي الشخص المُنشأ.</p>
<p>وباستخدام الدالة <a href="https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment" target="_blank" rel="noreferrer noopener">updateQuery</a> تحدّث الشيفرة استعلام ALLPERSONS في الذاكرة المؤقتة بإضافة الشخص الجديد إلى البيانات المخزَّنة مؤقتاً.</p>
<p>في بعض الحالات، تكون دالة الاستدعاء الراجعة <code>update</code> هي الطريقة المعقولة الوحيدة لإبقاء الذاكرة المؤقتة محدَّثة.</p>
<p>عند الحاجة، يمكن تعطيل الذاكرة المؤقتة للتطبيق بأكمله أو <a href="https://www.apollographql.com/docs/react/api/react/hooks/#options" target="_blank" rel="noreferrer noopener">لاستعلامات منفردة</a> بضبط الحقل الذي يدير استخدام الذاكرة المؤقتة، <a href="https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy" target="_blank" rel="noreferrer noopener">fetchPolicy</a> على <code>no-cache</code>.</p>
<p>كن مجتهداً مع الذاكرة المؤقتة. فالبيانات القديمة فيها قد تسبب أخطاء يصعب العثور عليها. وكما نعلم، فإن إبقاء الذاكرة المؤقتة محدَّثة أمر صعب جداً. وحسب مثل شائع بين المبرمجين:</p>
<blockquote>
<p><em>هناك شيئان صعبان فقط في علوم الحاسوب: إبطال صلاحية الذاكرة المؤقتة وتسمية الأشياء.</em> اقرأ المزيد <a href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noreferrer noopener">هنا</a>.</p>
</blockquote>
<p>يمكن العثور على الشيفرة الحالية للتطبيق على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع <em>part8-5</em>.</p>
<div class="tasks">
<p><strong>18. سرد الكتب</strong></p>
</div>
<div class="tasks">
<p><strong>19. تسجيل الدخول</strong></p>
</div>
<div class="tasks">
<p><strong>20. الكتب حسب النوع، الجزء 1</strong></p>
</div>
<div class="tasks">
<p><strong>21. الكتب حسب النوع، الجزء 2</strong></p>
</div>
<div class="tasks">
<p><strong>22. الكتب حسب النوع باستخدام GraphQL</strong></p>
</div>
<div class="tasks">
<p><strong>23. الذاكرة المؤقتة المحدَّثة وتوصيات الكتب</strong></p>
</div>
<div class="tasks">
<p><strong>24. فحص</strong></p>
</div>
`,c={part:8,letter:"e",file:s,title:a,slug:n,mainImage:l,headings:p,html:t};export{c as default,s as file,p as headings,t as html,o as letter,l as mainImage,e as part,n as slug,a as title};
