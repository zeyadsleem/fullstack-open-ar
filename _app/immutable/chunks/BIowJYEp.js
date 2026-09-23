const e=5,c="a",s="part5a.md",a="تسجيل الدخول في الواجهة الأمامية",n="login_in_frontend",l="/images/part-5.svg",p=[{depth:3,id:"إضافة-نموذج-تسجيل-دخول",text:"إضافة نموذج تسجيل دخول"},{depth:3,id:"إضافة-منطق-إلى-نموذج-تسجيل-الدخول",text:"إضافة منطق إلى نموذج تسجيل الدخول"},{depth:3,id:"العرض-الشرطي-لنموذج-تسجيل-الدخول",text:"العرض الشرطي لنموذج تسجيل الدخول"},{depth:3,id:"ملاحظة-حول-استخدام-عنصر-label",text:"ملاحظة حول استخدام عنصر label"},{depth:3,id:"إنشاء-ملاحظات-جديدة",text:"إنشاء ملاحظات جديدة"},{depth:3,id:"حفظ-الرمز-في-التخزين-المحلي-للمتصفح",text:"حفظ الرمز في التخزين المحلي للمتصفح"},{depth:3,id:"تمارين-51-54",text:"تمارين 5.1.-5.4."},{depth:3,id:"ملاحظة-حول-استخدام-التخزين-المحلي",text:"ملاحظة حول استخدام التخزين المحلي"}],t=`<div class="content">
<p>ركّزنا في الجزأين الماضيين بشكل أساسي على الواجهة الخلفية. الواجهة الأمامية التي طوّرناها في <a href="/part2">الجزء 2</a> لا تدعم بعد إدارة المستخدمين التي نفّذناها في الواجهة الخلفية في الجزء 4.</p>
<p>في الوقت الحالي تعرض الواجهة الأمامية الملاحظات الموجودة وتتيح للمستخدمين تغيير حالة الملاحظة من مهمة إلى غير مهمة والعكس. ولم يعد بالإمكان إضافة ملاحظات جديدة بسبب التغييرات التي أُجريت على الواجهة الخلفية في الجزء 4: إذ تتوقع الواجهة الخلفية الآن إرسال رمز (token) يتحقق من هوية المستخدم مع الملاحظة الجديدة.</p>
<p>سننفّذ الآن جزءاً من وظائف إدارة المستخدمين المطلوبة في الواجهة الأمامية. لنبدأ بتسجيل دخول المستخدم. سنفترض طوال هذا الجزء أنه لن تتم إضافة مستخدمين جدد من الواجهة الأمامية.</p>
<h3 id="إضافة-نموذج-تسجيل-دخول">إضافة نموذج تسجيل دخول</h3>
<p>أُضيف الآن نموذج تسجيل دخول إلى أعلى الصفحة:</p>
<p><img src="/images/content/5/1new.webp" alt="متصفح يعرض تسجيل دخول المستخدم لتطبيق الملاحظات"></p>
<p>أصبحت شيفرة مكوّن <i>App</i> الآن كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([]) 
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [showAll, setShowAll] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>)
  <span class="hljs-keyword">const</span> [errorMessage, setErrorMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> [username, setUsername] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>) 
  <span class="hljs-keyword">const</span> [password, setPassword] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>) 
<span class="hljs-comment">// highlight-end</span>

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService
      .<span class="hljs-title function_">getAll</span>().<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(initialNotes)
      })
  }, [])

  <span class="hljs-comment">// ...</span>

<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleLogin</span> = (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;logging in with&#x27;</span>, username, password)
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">message</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>
      
      // highlight-start
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Login<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{handleLogin}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">label</span>&gt;</span>
            username
            <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
              <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;text&quot;</span>
              <span class="hljs-attr">value</span>=<span class="hljs-string">{username}</span>
              <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
            /&gt;
          <span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">label</span>&gt;</span>
            password
            <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
              <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;password&quot;</span>
              <span class="hljs-attr">value</span>=<span class="hljs-string">{password}</span>
              <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setPassword(target.value)}
            /&gt;
          <span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>login<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    // highlight-end

      // ...
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>
</code></pre>
<p>يمكن العثور على شيفرة التطبيق الحالية على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-1">GitHub</a>، في الفرع <i>part5-1</i>. إذا استنسخت المستودع، لا تنسَ تشغيل <em>npm install</em> قبل محاولة تشغيل الواجهة الأمامية.</p>
<p>لن تعرض الواجهة الأمامية أي ملاحظات إذا لم تكن متصلة بالواجهة الخلفية. يمكنك تشغيل الواجهة الخلفية بالأمر <em>npm run dev</em> في مجلدها من الجزء 4. سيشغّل هذا الواجهة الخلفية على المنفذ 3001. وبينما هي قيد التشغيل، يمكنك في نافذة طرفية منفصلة تشغيل الواجهة الأمامية بالأمر <em>npm run dev</em>، وحينها يمكنك رؤية الملاحظات المحفوظة في قاعدة بيانات MongoDB من الجزء 4.</p>
<p>ضع هذا في اعتبارك من الآن فصاعداً.</p>
<p>يُعالَج نموذج تسجيل الدخول بالطريقة نفسها التي عالجنا بها النماذج في
<a href="/part2/forms">الجزء 2</a>. تحتوي حالة التطبيق على حقلي <i>username</i> و<i>password</i> لتخزين بيانات النموذج. لحقول النموذج معالجات أحداث تزامن التغييرات في الحقل مع حالة مكوّن <i>App</i>. معالجات الأحداث بسيطة: يُمرَّر إليها كائن كوسيط، فتستخرج منه الحقل <i>target</i> وتحفظ قيمته في الحالة.</p>
<pre><code class="language-js">({ target }) =&gt; <span class="hljs-title function_">setUsername</span>(target.<span class="hljs-property">value</span>)
</code></pre>
<p>لم تُنفَّذ بعد الدالة <em>handleLogin</em> المسؤولة عن معالجة البيانات في النموذج.</p>
<h3 id="إضافة-منطق-إلى-نموذج-تسجيل-الدخول">إضافة منطق إلى نموذج تسجيل الدخول</h3>
<p>يتم تسجيل الدخول بإرسال طلب HTTP POST إلى عنوان الخادم <i>api/login</i>. لنفصل الشيفرة المسؤولة عن هذا الطلب في وحدتها الخاصة، في الملف <i>services/login.js</i>.</p>
<p>سنستخدم صيغة <i>async/await</i> بدلاً من الوعود (promises) في طلب HTTP:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>
<span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;/api/login&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">login</span> = <span class="hljs-keyword">async</span> credentials =&gt; {
  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">post</span>(baseUrl, credentials)
  <span class="hljs-keyword">return</span> response.<span class="hljs-property">data</span>
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> { login }
</code></pre>
<p>يمكن تنفيذ دالة معالجة تسجيل الدخول كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> loginService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./services/login&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> [username, setUsername] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>) 
  <span class="hljs-keyword">const</span> [password, setPassword] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>) 
<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> [user, setUser] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
<span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleLogin</span> = <span class="hljs-keyword">async</span> event =&gt; { <span class="hljs-comment">// highlight-line</span>
    event.<span class="hljs-title function_">preventDefault</span>()
    
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> loginService.<span class="hljs-title function_">login</span>({ username, password })
      <span class="hljs-title function_">setUser</span>(user)
      <span class="hljs-title function_">setUsername</span>(<span class="hljs-string">&#x27;&#x27;</span>)
      <span class="hljs-title function_">setPassword</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    } <span class="hljs-keyword">catch</span> {
      <span class="hljs-title function_">setErrorMessage</span>(<span class="hljs-string">&#x27;wrong credentials&#x27;</span>)
      <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
        <span class="hljs-title function_">setErrorMessage</span>(<span class="hljs-literal">null</span>)
      }, <span class="hljs-number">5000</span>)
    }
    <span class="hljs-comment">// highlight-end</span>
  }

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>إذا نجح تسجيل الدخول، تُفرَّغ حقول النموذج <i>و</i>تُحفظ استجابة الخادم (بما فيها <i>الرمز</i> وتفاصيل المستخدم) في الحقل <i>user</i> من حالة التطبيق.</p>
<p>وإذا فشل تسجيل الدخول أو نتج عن تشغيل الدالة <em>loginService.login</em> خطأ، يُخطَر المستخدم بذلك.</p>
<h3 id="العرض-الشرطي-لنموذج-تسجيل-الدخول">العرض الشرطي لنموذج تسجيل الدخول</h3>
<p>لا يُخطَر المستخدم بأي شكل من الأشكال عند نجاح تسجيل الدخول. لنعدّل التطبيق بحيث يعرض نموذج تسجيل الدخول فقط <i>إذا لم يكن المستخدم مسجّلاً للدخول</i>، أي عندما <em>user === null</em>. ويُعرض نموذج إضافة ملاحظات جديدة فقط إذا كان <i>المستخدم مسجّلاً للدخول</i>، أي عندما تحتوي حالة <i>user</i> على تفاصيل المستخدم.</p>
<p>لنضف دالتين مساعدتين إلى مكوّن <i>App</i> لتوليد النموذجين:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">loginForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{handleLogin}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span>&gt;</span>
          username
          <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;text&quot;</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{username}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span>&gt;</span>
          password
          <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;password&quot;</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{password}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setPassword(target.value)}
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>login<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  )

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">noteForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{newNote}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{handleNoteChange}</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>save<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  )

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// ...</span>
  )
}
</code></pre>
<p>ونعرضهما شرطياً:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">loginForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="hljs-comment">// ...</span>
  )

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">noteForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="hljs-comment">// ...</span>
  )

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">message</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>

      {!user &amp;&amp; loginForm()} // highlight-line
      {user &amp;&amp; noteForm()} // highlight-line

      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShowAll(!showAll)}&gt;
          show {showAll ? &#x27;important&#x27; : &#x27;all&#x27;}
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>
        {notesToShow.map(note =&gt; (
          <span class="hljs-tag">&lt;<span class="hljs-name">Note</span>
            <span class="hljs-attr">key</span>=<span class="hljs-string">{note.id}</span>
            <span class="hljs-attr">note</span>=<span class="hljs-string">{note}</span>
            <span class="hljs-attr">toggleImportance</span>=<span class="hljs-string">{()</span> =&gt;</span> toggleImportanceOf(note.id)}
          /&gt;
        ))}
      <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Footer</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>استُخدمت <a href="https://react.dev/learn/conditional-rendering#logical-and-operator-">حيلة React</a> التي تبدو غريبة قليلاً لكنها شائعة الاستخدام لعرض النموذجين شرطياً:</p>
<pre><code class="language-js">{!user &amp;&amp; <span class="hljs-title function_">loginForm</span>()}
</code></pre>
<p>إذا قُيّم التعبير الأول إلى false أو كان <a href="https://developer.mozilla.org/en-US/docs/Glossary/Falsy">falsy</a> (قيمة كاذبة)، فلن يُنفَّذ التعبير الثاني (توليد النموذج) إطلاقاً.</p>
<p>لنجرِ تعديلاً آخر. إذا كان المستخدم مسجّلاً للدخول، يُعرض اسمه على الشاشة:</p>
<pre><code class="language-js"><span class="hljs-keyword">return</span> (
  &lt;div&gt;
    &lt;h1&gt;Notes&lt;/h1&gt;
    &lt;Notification message={errorMessage} /&gt;

    {!user &amp;&amp; loginForm()}
    // highlight-start
    {user &amp;&amp; (
      &lt;div&gt;
        &lt;p&gt;{user.name} logged in&lt;/p&gt;
        {noteForm()}
      &lt;/div&gt;
    )}
    // highlight-end

    &lt;div&gt;
      &lt;button onClick={() =&gt; setShowAll(!showAll)}&gt;
    // ...
</code></pre>
<p>الحل ليس مثالياً، لكننا سنتركه على حاله الآن.</p>
<p>مكوّننا الرئيسي <i>App</i> كبير جداً في الوقت الحالي. والتغييرات التي أجريناها الآن إشارة واضحة إلى أنه ينبغي إعادة هيكلة النماذج إلى مكوّنات خاصة بها. لكننا سنترك ذلك لتمرين اختياري.</p>
<p>يمكن العثور على شيفرة التطبيق الحالية على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-2">GitHub</a>، في الفرع <i>part5-2</i>.</p>
<h3 id="ملاحظة-حول-استخدام-عنصر-label">ملاحظة حول استخدام عنصر label</h3>
<p>استخدمنا عنصر <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label">label</a> لحقول <i>input</i> في نموذج تسجيل الدخول. ويوضع حقل <i>input</i> الخاص باسم المستخدم داخل عنصر <i>label</i> المقابل:</p>
<pre><code class="language-js">&lt;div&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">label</span>&gt;</span>
    username
    <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
      <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;text&quot;</span>
      <span class="hljs-attr">value</span>=<span class="hljs-string">{username}</span>
      <span class="hljs-attr">onChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
    /&gt;
  <span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span></span>
&lt;/div&gt;
<span class="hljs-comment">// ...</span>
</code></pre>
<p>لماذا نفّذنا النموذج بهذه الطريقة؟ بصرياً، يمكن تحقيق النتيجة نفسها بشيفرة أبسط، دون عنصر <i>label</i> منفصل:</p>
<pre><code class="language-js">&lt;div&gt;
  username
  &lt;input
    type=<span class="hljs-string">&quot;text&quot;</span>
    value={username}
    onChange={<span class="hljs-function">(<span class="hljs-params">{ target }</span>) =&gt;</span> <span class="hljs-title function_">setUsername</span>(target.<span class="hljs-property">value</span>)}
  /&gt;
&lt;/div&gt;
<span class="hljs-comment">// ...</span>
</code></pre>
<p>يُستخدم عنصر <i>label</i> في النماذج لوصف حقول <i>input</i> وتسميتها. فهو يوفّر وصفاً لحقل الإدخال، ويساعد المستخدم على فهم المعلومات التي ينبغي إدخالها في كل حقل. ويرتبط هذا الوصف برمجياً بحقل الإدخال المقابل، ما يحسّن إمكانية الوصول في النموذج.</p>
<p>بهذه الطريقة، يمكن لقارئات الشاشة قراءة اسم الحقل للمستخدم عند تحديد حقل الإدخال، كما يؤدي النقر على نص الـ label إلى تركيز المؤشر تلقائياً على حقل الإدخال الصحيح. ويُنصح دائماً باستخدام عنصر <i>label</i> مع حقول <i>input</i>، حتى لو أمكن تحقيق النتيجة البصرية نفسها بدونه.</p>
<p>هناك <a href="https://react.dev/reference/react-dom/components/input#providing-a-label-for-an-input">طرق عدة</a> لربط <i>label</i> معيّن بعنصر <i>input</i>. أسهل طريقة هي وضع عنصر <i>input</i> داخل عنصر <i>label</i> المقابل، كما هو موضّح في هذه المادة. وهذا يربط <i>label</i> تلقائياً بحقل الإدخال الصحيح دون الحاجة إلى أي إعداد إضافي.</p>
<h3 id="إنشاء-ملاحظات-جديدة">إنشاء ملاحظات جديدة</h3>
<p>يُحفظ الرمز المُعاد عند نجاح تسجيل الدخول في حالة التطبيق - في الحقل <i>token</i> الخاص بـ<i>user</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">handleLogin</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
  event.<span class="hljs-title function_">preventDefault</span>()
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> loginService.<span class="hljs-title function_">login</span>({
      username, password,
    })

    <span class="hljs-title function_">setUser</span>(user) <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-title function_">setUsername</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setPassword</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  } <span class="hljs-keyword">catch</span> (exception) {
    <span class="hljs-comment">// ...</span>
  }
}
</code></pre>
<p>لنصلح إنشاء ملاحظات جديدة ليعمل مع الواجهة الخلفية. يعني هذا إضافة رمز المستخدم المسجّل للدخول إلى ترويسة Authorization في طلب HTTP.</p>
<p>تتغير وحدة <i>noteService</i> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>
<span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;/api/notes&#x27;</span>

<span class="hljs-keyword">let</span> token = <span class="hljs-literal">null</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-comment">// highlight-start</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">setToken</span> = newToken =&gt; {
  token = <span class="hljs-string">\`Bearer <span class="hljs-subst">\${newToken}</span>\`</span>
}
<span class="hljs-comment">// highlight-end</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">getAll</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> request = axios.<span class="hljs-title function_">get</span>(baseUrl)
  <span class="hljs-keyword">return</span> request.<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> response.<span class="hljs-property">data</span>)
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">create</span> = <span class="hljs-keyword">async</span> newObject =&gt; {
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> config = {
    <span class="hljs-attr">headers</span>: { <span class="hljs-title class_">Authorization</span>: token }
  }
<span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">post</span>(baseUrl, newObject, config) <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">return</span> response.<span class="hljs-property">data</span>
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">update</span> = (<span class="hljs-params">id, newObject</span>) =&gt; {
  <span class="hljs-keyword">const</span> request = axios.<span class="hljs-title function_">put</span>(<span class="hljs-string">\`<span class="hljs-subst">\${ baseUrl }</span>/<span class="hljs-subst">\${id}</span>\`</span>, newObject)
  <span class="hljs-keyword">return</span> request.<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> response.<span class="hljs-property">data</span>)
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> { getAll, create, update, setToken } <span class="hljs-comment">// highlight-line</span>
</code></pre>
<p>تحتوي وحدة noteService على متغير خاص باسم <em>token</em>. ويمكن تغيير قيمته بالدالة <em>setToken</em> التي تصدّرها الوحدة. أما <em>create</em>، بصيغة async/await الآن، فتضع الرمز في ترويسة <i>Authorization</i>. وتُمرَّر الترويسة إلى axios كوسيط ثالث في دالة <i>post</i>.</p>
<p>يجب تغيير معالج الحدث المسؤول عن تسجيل الدخول ليستدعي الدالة <code>noteService.setToken(user.token)</code> عند نجاح تسجيل الدخول:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">handleLogin</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
  event.<span class="hljs-title function_">preventDefault</span>()

  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> loginService.<span class="hljs-title function_">login</span>({ username, password })
    noteService.<span class="hljs-title function_">setToken</span>(user.<span class="hljs-property">token</span>) <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-title function_">setUser</span>(user)
    <span class="hljs-title function_">setUsername</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-title function_">setPassword</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  } <span class="hljs-keyword">catch</span> {
    <span class="hljs-comment">// ...</span>
  }
}
</code></pre>
<p>والآن أصبحت إضافة ملاحظات جديدة تعمل من جديد!</p>
<h3 id="حفظ-الرمز-في-التخزين-المحلي-للمتصفح">حفظ الرمز في التخزين المحلي للمتصفح</h3>
<p>في تطبيقنا عيب صغير: إذا حُدِّث المتصفح (مثلاً بالضغط على F5)، تختفي معلومات تسجيل دخول المستخدم.</p>
<p>تُحل هذه المشكلة بسهولة بحفظ تفاصيل تسجيل الدخول في <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage">التخزين المحلي</a>. التخزين المحلي قاعدة بيانات <a href="https://en.wikipedia.org/wiki/Key-value_database">مفتاح-قيمة</a> في المتصفح.</p>
<p>استخدامه سهل جداً. تُحفظ <i>قيمة</i> تقابل <i>مفتاحاً</i> معيناً في قاعدة البيانات بالدالة <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem">setItem</a>. مثلاً:</p>
<pre><code class="language-js"><span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">setItem</span>(<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;juha tauriainen&#x27;</span>)
</code></pre>
<p>يحفظ النص المُمرَّر كوسيط ثانٍ كقيمة للمفتاح <i>name</i>.</p>
<p>ويمكن إيجاد قيمة مفتاح بالدالة <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem">getItem</a>:</p>
<pre><code class="language-js"><span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">getItem</span>(<span class="hljs-string">&#x27;name&#x27;</span>)
</code></pre>
<p>بينما تحذف <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem">removeItem</a> مفتاحاً.</p>
<p>تبقى القيم في التخزين المحلي محفوظة حتى عند إعادة عرض الصفحة. والتخزين خاص بـ<a href="https://developer.mozilla.org/en-US/docs/Glossary/Origin">الأصل (origin)</a> لذا لكل تطبيق ويب تخزينه الخاص.</p>
<p>لنوسّع تطبيقنا بحيث يحفظ تفاصيل المستخدم المسجّل للدخول في التخزين المحلي.</p>
<p>القيم المحفوظة في التخزين هي <a href="https://docs.w3cub.com/dom/domstring">DOMstrings</a>، لذا لا يمكننا حفظ كائن JavaScript كما هو. يجب أولاً تحويل الكائن إلى JSON بالدالة <em>JSON.stringify</em>. وبالمقابل، عند قراءة كائن JSON من التخزين المحلي، يجب تحويله مرة أخرى إلى JavaScript بالدالة <em>JSON.parse</em>.</p>
<p>التغييرات على دالة تسجيل الدخول كما يلي:</p>
<pre><code class="language-js">  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleLogin</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> loginService.<span class="hljs-title function_">login</span>({ username, password })

      <span class="hljs-comment">// highlight-start</span>
      <span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">setItem</span>(
        <span class="hljs-string">&#x27;loggedNoteappUser&#x27;</span>, <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(user)
      ) 
      <span class="hljs-comment">// highlight-end</span>
      noteService.<span class="hljs-title function_">setToken</span>(user.<span class="hljs-property">token</span>)
      <span class="hljs-title function_">setUser</span>(user)
      <span class="hljs-title function_">setUsername</span>(<span class="hljs-string">&#x27;&#x27;</span>)
      <span class="hljs-title function_">setPassword</span>(<span class="hljs-string">&#x27;&#x27;</span>)
    } <span class="hljs-keyword">catch</span> (exception) {
      <span class="hljs-comment">// ...</span>
    }
  }
</code></pre>
<p>تُحفظ الآن تفاصيل المستخدم المسجّل للدخول في التخزين المحلي، ويمكن عرضها في وحدة التحكم (بكتابة <em>window.localStorage</em> فيها):</p>
<p><img src="/images/content/5/3e.webp" alt="متصفح يعرض بيانات المستخدم في وحدة التحكم المحفوظة في التخزين المحلي"></p>
<p>يمكنك أيضاً فحص التخزين المحلي باستخدام أدوات المطور. في Chrome، انتقل إلى تبويب <i>Application</i> واختر <i>Local Storage</i> (تفاصيل أكثر <a href="https://developer.chrome.com/docs/devtools/storage/localstorage">هنا</a>). وفي Firefox انتقل إلى تبويب <i>Storage</i> واختر <i>Local Storage</i> (التفاصيل <a href="https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html">هنا</a>).</p>
<p>ما زال علينا تعديل تطبيقنا بحيث يتحقق عند دخول الصفحة مما إذا كانت تفاصيل مستخدم مسجّل للدخول موجودة بالفعل في التخزين المحلي. وإذا كانت موجودة، تُحفظ التفاصيل في حالة التطبيق وفي <i>noteService</i>.</p>
<p>الطريقة الصحيحة لفعل ذلك هي باستخدام <a href="https://react.dev/reference/react/useEffect">خطاف تأثير (effect hook)</a>: وهي آلية صادفناها أول مرة في <a href="/part2/getting_data_from_server#effect-hooks">الجزء 2</a>، واستخدمناها لجلب الملاحظات من الخادم.</p>
<p>يمكن أن يكون لدينا عدة خطافات تأثير، لذا لننشئ خطافاً ثانياً للتعامل مع التحميل الأول للصفحة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([])
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [showAll, setShowAll] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>)
  <span class="hljs-keyword">const</span> [errorMessage, setErrorMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)
  <span class="hljs-keyword">const</span> [username, setUsername] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [password, setPassword] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [user, setUser] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService.<span class="hljs-title function_">getAll</span>().<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
      <span class="hljs-title function_">setNotes</span>(initialNotes)
    })
  }, [])
  
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-keyword">const</span> loggedUserJSON = <span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">getItem</span>(<span class="hljs-string">&#x27;loggedNoteappUser&#x27;</span>)
    <span class="hljs-keyword">if</span> (loggedUserJSON) {
      <span class="hljs-keyword">const</span> user = <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">parse</span>(loggedUserJSON)
      <span class="hljs-title function_">setUser</span>(user)
      noteService.<span class="hljs-title function_">setToken</span>(user.<span class="hljs-property">token</span>)
    }
  }, [])
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>تضمن المصفوفة الفارغة كوسيط للخطاف أن يُنفَّذ الخطاف فقط عند عرض المكوّن <a href="https://react.dev/reference/react/useEffect#parameters">للمرة الأولى</a>.</p>
<p>الآن يبقى المستخدم مسجّلاً للدخول إلى التطبيق إلى الأبد. ربما ينبغي لنا إضافة وظيفة <i>تسجيل الخروج</i> التي تزيل تفاصيل تسجيل الدخول من التخزين المحلي. لكننا سنتركها كتمرين.</p>
<p>يمكن تسجيل خروج المستخدم باستخدام وحدة التحكم، وهذا يكفي الآن.
يمكنك تسجيل الخروج بالأمر:</p>
<pre><code class="language-js"><span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">removeItem</span>(<span class="hljs-string">&#x27;loggedNoteappUser&#x27;</span>)
</code></pre>
<p>أو بالأمر الذي يفرّغ <i>localstorage</i> بالكامل:</p>
<pre><code class="language-js"><span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">clear</span>()
</code></pre>
<p>يمكن العثور على شيفرة التطبيق الحالية على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-3">GitHub</a>، في الفرع <i>part5-3</i>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-51-54">تمارين 5.1.-5.4.</h3>
<p>سننشئ الآن واجهة أمامية للواجهة الخلفية لقائمة المدونات التي أنشأناها في الجزء الماضي. يمكنك استخدام <a href="https://github.com/fullstack-hy2020/bloglist-frontend">هذا التطبيق</a> من GitHub كأساس لحلك. وتحتاج إلى ربط واجهتك الخلفية بوسيط (proxy) كما هو موضّح في <a href="/part3/deploying_app_to_internet#proxy">الجزء 3</a>.</p>
<p>يكفي إرسال حلك النهائي. يمكنك عمل commit بعد كل تمرين، لكن ذلك ليس ضرورياً.</p>
<p>تُراجع التمارين الأولى كل ما تعلمناه عن React حتى الآن. وقد تكون صعبة، خاصة إذا كانت واجهتك الخلفية غير مكتملة.
وقد يكون من الأفضل استخدام الواجهة الخلفية التي وضعناها كحل للجزء 4.</p>
<p>أثناء حل التمارين، تذكّر كل طرق تصحيح الأخطاء التي تحدثنا عنها، وخاصة مراقبة وحدة التحكم.</p>
<p><strong>تحذير:</strong> إذا لاحظت أنك تخلط بين أوامر <em>async/await</em> و_then_، فمن المؤكد بنسبة 99.9% أنك تفعل شيئاً خاطئاً. استخدم أحدهما فقط، ولا تستخدم كليهما أبداً.</p>
<h4 id="51-واجهة-قائمة-المدونات-الأمامية-الخطوة-1">5.1: واجهة قائمة المدونات الأمامية، الخطوة 1</h4>
<p>استنسخ التطبيق من <a href="https://github.com/fullstack-hy2020/bloglist-frontend">GitHub</a> بالأمر:</p>
<pre><code class="language-bash">git <span class="hljs-built_in">clone</span> https://github.com/fullstack-hy2020/bloglist-frontend
</code></pre>
<p><i>أزل إعدادات git من التطبيق المستنسخ</i></p>
<pre><code class="language-bash"><span class="hljs-built_in">cd</span> bloglist-frontend   // انتقل إلى المستودع المستنسخ
<span class="hljs-built_in">rm</span> -rf .git
</code></pre>
<p>يُشغَّل التطبيق بالطريقة المعتادة، لكن عليك تثبيت اعتمادياته أولاً:</p>
<pre><code class="language-bash">npm install
npm run dev
</code></pre>
<p>نفّذ وظيفة تسجيل الدخول في الواجهة الأمامية. يُحفظ الرمز المُعاد عند نجاح تسجيل الدخول في حالة التطبيق <i>user</i>.</p>
<p>إذا لم يكن المستخدم مسجّلاً للدخول، فلا يظهر <i>سوى</i> نموذج تسجيل الدخول.</p>
<p><img src="/images/content/5/4e.webp" alt="متصفح يعرض نموذج تسجيل الدخول فقط"></p>
<p>وإذا كان المستخدم مسجّلاً للدخول، يُعرض اسم المستخدم وقائمة المدونات.</p>
<p><img src="/images/content/5/5e.webp" alt="متصفح يعرض المدونات ومن هو مسجّل للدخول"></p>
<p>لا حاجة بعد إلى حفظ تفاصيل المستخدم المسجّل للدخول في التخزين المحلي.</p>
<p><strong>ملاحظة</strong> يمكنك تنفيذ العرض الشرطي لنموذج تسجيل الدخول هكذا مثلاً:</p>
<pre><code class="language-js">  <span class="hljs-keyword">if</span> (user === <span class="hljs-literal">null</span>) {
    <span class="hljs-keyword">return</span> (
      <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Log in to application<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">form</span>&gt;</span>
          //...
        <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
    )
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>blogs<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>
      {blogs.map(blog =&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Blog</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{blog.id}</span> <span class="hljs-attr">blog</span>=<span class="hljs-string">{blog}</span> /&gt;</span>
      )}
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<h4 id="52-واجهة-قائمة-المدونات-الأمامية-الخطوة-2">5.2: واجهة قائمة المدونات الأمامية، الخطوة 2</h4>
<p>اجعل تسجيل الدخول «دائماً» باستخدام التخزين المحلي. ونفّذ أيضاً طريقة لتسجيل الخروج.</p>
<p><img src="/images/content/5/6e.webp" alt="متصفح يعرض زر تسجيل الخروج بعد تسجيل الدخول"></p>
<p>تأكد من أن المتصفح لا يتذكر تفاصيل المستخدم بعد تسجيل الخروج.</p>
<h4 id="53-واجهة-قائمة-المدونات-الأمامية-الخطوة-3">5.3: واجهة قائمة المدونات الأمامية، الخطوة 3</h4>
<p>وسّع تطبيقك ليتمكن المستخدم المسجّل للدخول من إضافة مدونات جديدة:</p>
<p><img src="/images/content/5/7e.webp" alt="متصفح يعرض نموذج مدونة جديدة"></p>
<h4 id="54-واجهة-قائمة-المدونات-الأمامية-الخطوة-4">5.4: واجهة قائمة المدونات الأمامية، الخطوة 4</h4>
<p>نفّذ إشعارات تُخبر المستخدم بالعمليات الناجحة وغير الناجحة في أعلى الصفحة. مثلاً، عند إضافة مدونة جديدة يمكن عرض الإشعار التالي:</p>
<p><img src="/images/content/5/8e.webp" alt="متصفح يعرض إشعار عملية ناجحة"></p>
<p>ويمكن أن يعرض تسجيل الدخول الفاشل الإشعار التالي:</p>
<p><img src="/images/content/5/9e.webp" alt="متصفح يعرض إشعار محاولة تسجيل دخول فاشلة"></p>
<p>يجب أن تبقى الإشعارات ظاهرة لثوانٍ قليلة. وليس إلزامياً إضافة ألوان.</p>
</div>
<div class="content">
<h3 id="ملاحظة-حول-استخدام-التخزين-المحلي">ملاحظة حول استخدام التخزين المحلي</h3>
<p>في <a href="/part4/token_authentication#problems-of-token-based-authentication">نهاية</a> الجزء الماضي، ذكرنا أن التحدي في المصادقة القائمة على الرموز هو كيفية التعامل مع الحالة التي يلزم فيها إلغاء وصول حامل الرمز إلى الـ API.</p>
<p>هناك حلان لهذه المشكلة. الأول هو تحديد مدة صلاحية الرمز. وهذا يجبر المستخدم على إعادة تسجيل الدخول إلى التطبيق بعد انتهاء صلاحية الرمز. والنهج الآخر هو حفظ معلومات صلاحية كل رمز في قاعدة بيانات الواجهة الخلفية. ويُسمى هذا الحل غالباً <i>جلسة من جهة الخادم</i> (server-side session).</p>
<p>ومهما كانت طريقة التحقق من صلاحية الرموز وضمانها، فقد ينطوي حفظ الرمز في التخزين المحلي على خطر أمني إذا كان في التطبيق ثغرة أمنية تسمح بهجمات <a href="https://owasp.org/www-community/attacks/xss/">البرمجة عبر المواقع (XSS)</a>. وتكون هجمة XSS ممكنة إذا سمح التطبيق للمستخدم بحقن شيفرة JavaScript عشوائية (مثلاً باستخدام نموذج) ينفّذها التطبيق بعد ذلك. وعند استخدام React بحكمة لا ينبغي أن يكون ذلك ممكناً لأن <a href="https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks">React ينقّي</a> كل النص الذي يعرضه، أي أنه لا ينفّذ المحتوى المعروض كشيفرة JavaScript.</p>
<p>وإذا أراد المرء أن يلعب بأمان، فأفضل خيار هو عدم تخزين الرمز في التخزين المحلي. وقد يكون هذا خياراً في الحالات التي قد يكون فيها تسريب الرمز ذا عواقب كارثية.</p>
<p>وقد اقتُرح حفظ هوية المستخدم المسجّل للدخول في <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies">ملفات تعريف ارتباط httpOnly</a>، بحيث لا تستطيع شيفرة JavaScript الوصول إلى الرمز إطلاقاً. وعيب هذا الحل أنه يجعل تنفيذ تطبيقات الصفحة الواحدة (SPA) أكثر تعقيداً بعض الشيء. إذ سيحتاج المرء على الأقل إلى تنفيذ صفحة منفصلة لتسجيل الدخول.</p>
<p>لكن من الجيد ملاحظة أن حتى استخدام ملفات تعريف ارتباط httpOnly لا يضمن أي شيء. بل اقتُرح أن ملفات تعريف ارتباط httpOnly <a href="https://academind.com/tutorials/localstorage-vs-cookies-xss/">ليست أكثر أماناً</a> من استخدام التخزين المحلي.</p>
<p>لذا، ومهما كان الحل المستخدم، فإن أهم شيء هو <a href="https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html">تقليل خطر</a> هجمات XSS إلى الحد الأدنى.</p>
</div>
`,o={part:5,letter:"a",file:s,title:a,slug:n,mainImage:l,headings:p,html:t};export{o as default,s as file,p as headings,t as html,c as letter,l as mainImage,e as part,n as slug,a as title};
