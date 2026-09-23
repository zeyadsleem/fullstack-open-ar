const e=5,c="b",s="part5b.md",a="props.children ومراجع المكوّنات",n="props_children_and_component_refs",l="/images/part-5.svg",p=[{depth:3,id:"عرض-نموذج-تسجيل-الدخول-عند-الحاجة-فقط",text:"عرض نموذج تسجيل الدخول عند الحاجة فقط"},{depth:3,id:"أبناء-المكون-المعروف-أيضا-بـ-propschildren",text:"أبناء المكوّن، المعروف أيضاً بـ props.children"},{depth:3,id:"حالة-النماذج",text:"حالة النماذج"},{depth:3,id:"الإشارة-إلى-المكونات-باستخدام-ref",text:"الإشارة إلى المكوّنات باستخدام ref"},{depth:3,id:"ملاحظة-حول-المكونات",text:"ملاحظة حول المكوّنات"},{depth:3,id:"قسم-مطور-full-stack-المحدث",text:"قسم مطوّر full stack المحدَّث"},{depth:3,id:"تمارين-55-511",text:"تمارين 5.5.-5.11."},{depth:3,id:"eslint",text:"ESlint"},{depth:3,id:"تمرين-512",text:"تمرين 5.12."}],t=`<div class="content">
<p>كُتب هذا القسم باستخدام React 19، وبعض ميزات React المقدَّمة في هذا الفصل لا تعمل مع الإصدارات الأقدم من React. كُتبت الأجزاء السابقة من الدورة باستخدام الإصدار 18 من React، لذا تأكد من أن مشروعك يضم الآن الإصدار 19 من React مثبَّتاً.</p>
<p>يمكنك فحص ملف <i>package.json</i> للتحقق من أن الإصدار 19 من مكتبتَي <i>react</i> و<i>react-dom</i> قيد الاستخدام:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">&quot;dependencies&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;axios&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^1.9.0&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;react&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^19.1.0&quot;</span><span class="hljs-punctuation">,</span> <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-attr">&quot;react-dom&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;^19.1.0&quot;</span> <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
  <span class="hljs-comment">// ...</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>شغّل أيضاً الأمر <em>npm install</em> الذي يثبّت الاعتماديات وفقاً لملف <i>package.json</i>. هذا ضروري إذا كنت مثلاً قد نسختَ مستودع المثال في مرحلة سابقة من الدورة، حين كان إصدار أقدم من React لا يزال قيد الاستخدام.</p>
<h3 id="عرض-نموذج-تسجيل-الدخول-عند-الحاجة-فقط">عرض نموذج تسجيل الدخول عند الحاجة فقط</h3>
<p>لنعدّل التطبيق بحيث لا يُعرض نموذج تسجيل الدخول افتراضياً:</p>
<p><img src="/images/content/5/10e.webp" alt="متصفح يعرض زر تسجيل الدخول افتراضياً"></p>
<p>يظهر نموذج تسجيل الدخول عندما يضغط المستخدم على زر <i>login</i>:</p>
<p><img src="/images/content/5/11e.webp" alt="مستخدم في شاشة تسجيل الدخول على وشك الضغط على cancel"></p>
<p>يمكن للمستخدم إغلاق نموذج تسجيل الدخول بالنقر على زر <i>cancel</i>.</p>
<p>لنبدأ باستخراج نموذج تسجيل الدخول إلى مكوّن خاص به:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">LoginForm</span> = (<span class="hljs-params">{
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }</span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Login<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{handleSubmit}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          username
          <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{username}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{handleUsernameChange}</span>
          /&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          password
          <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;password&quot;</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{password}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{handlePasswordChange}</span>
          /&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>login<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">LoginForm</span>
</code></pre>
<p>تُعرَّف الحالة وجميع الدوال المرتبطة بها خارج المكوّن وتُمرَّر إلى المكوّن عبر props.</p>
<p>لاحظ أن props تُسند إلى متغيرات عبر <i>التفكيك</i>، ما يعني أنه بدلاً من كتابة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">LoginForm</span> = (<span class="hljs-params">props</span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Login<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{props.handleSubmit}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          username
          <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
            <span class="hljs-attr">value</span>=<span class="hljs-string">{props.username}</span>
            <span class="hljs-attr">onChange</span>=<span class="hljs-string">{props.handleChange}</span>
            <span class="hljs-attr">name</span>=<span class="hljs-string">&quot;username&quot;</span>
          /&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        // ...
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>login<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>حيث تُسنَد الخصائص مباشرةً إلى متغيراتها الخاصة بدلاً من الوصول إلى خصائص كائن <em>props</em> عبر ما يشبه <em>props.handleSubmit</em>.</p>
<p>إحدى الطرق السريعة لتنفيذ هذه الوظيفة هي تغيير الدالة <em>loginForm</em> في مكوّن <i>App</i> هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [loginVisible, setLoginVisible] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>) <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">loginForm</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-keyword">const</span> hideWhenVisible = { <span class="hljs-attr">display</span>: loginVisible ? <span class="hljs-string">&#x27;none&#x27;</span> : <span class="hljs-string">&#x27;&#x27;</span> }
    <span class="hljs-keyword">const</span> showWhenVisible = { <span class="hljs-attr">display</span>: loginVisible ? <span class="hljs-string">&#x27;&#x27;</span> : <span class="hljs-string">&#x27;none&#x27;</span> }

    <span class="hljs-keyword">return</span> (
      <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{hideWhenVisible}</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setLoginVisible(true)}&gt;log in<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{showWhenVisible}</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">LoginForm</span>
            <span class="hljs-attr">username</span>=<span class="hljs-string">{username}</span>
            <span class="hljs-attr">password</span>=<span class="hljs-string">{password}</span>
            <span class="hljs-attr">handleUsernameChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
            handlePasswordChange={({ target }) =&gt; setPassword(target.value)}
            handleSubmit={handleLogin}
          /&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setLoginVisible(false)}&gt;cancel<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
    )
  }

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>تحتوي حالة مكوّن <i>App</i> الآن على القيمة المنطقية <i>loginVisible</i> التي تحدد ما إذا كان ينبغي عرض نموذج تسجيل الدخول للمستخدم أم لا.</p>
<p>تُبدَّل قيمة <em>loginVisible</em> بزرين. ومعالجات أحداث كلا الزرين معرَّفة مباشرة في المكوّن:</p>
<pre><code class="language-js">&lt;button onClick={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">setLoginVisible</span>(<span class="hljs-literal">true</span>)}&gt;log <span class="hljs-keyword">in</span>&lt;/button&gt;

<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setLoginVisible(false)}&gt;cancel<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></span>
</code></pre>
<p>تُحدَّد رؤية المكوّن بإعطاء المكوّن قاعدة نمط <a href="/part2/adding_styles_to_react_app#inline-styles">مضمّنة</a>، حيث تكون قيمة خاصية <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/display">display</a> هي <i>none</i> إذا لم نرد عرض المكوّن:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> hideWhenVisible = { <span class="hljs-attr">display</span>: loginVisible ? <span class="hljs-string">&#x27;none&#x27;</span> : <span class="hljs-string">&#x27;&#x27;</span> }
<span class="hljs-keyword">const</span> showWhenVisible = { <span class="hljs-attr">display</span>: loginVisible ? <span class="hljs-string">&#x27;&#x27;</span> : <span class="hljs-string">&#x27;none&#x27;</span> }

&lt;div style={hideWhenVisible}&gt;
  <span class="hljs-comment">// زر</span>
&lt;/div&gt;

<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{showWhenVisible}</span>&gt;</span>
  // زر
<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
</code></pre>
<p>نستخدم مرة أخرى المعامل الثلاثي «علامة الاستفهام». إذا كانت <em>loginVisible</em> تساوي <i>true</i>، فستكون قاعدة CSS للمكوّن:</p>
<pre><code class="language-css"><span class="hljs-attribute">display</span>: <span class="hljs-string">&#x27;none&#x27;</span>;
</code></pre>
<p>وإذا كانت <em>loginVisible</em> تساوي <i>false</i>، فلن تتلقى <i>display</i> أي قيمة متعلقة برؤية المكوّن.</p>
<h3 id="أبناء-المكون-المعروف-أيضا-بـ-propschildren">أبناء المكوّن، المعروف أيضاً بـ props.children</h3>
<p>يمكن اعتبار الشيفرة المتعلقة بإدارة رؤية نموذج تسجيل الدخول كياناً منطقياً قائماً بذاته، ولهذا السبب سيكون من الجيد استخراجها من مكوّن <i>App</i> إلى مكوّن منفصل.</p>
<p>هدفنا هو تنفيذ مكوّن <i>Togglable</i> جديد يمكن استخدامه بالطريقة التالية:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Togglable</span> buttonLabel=<span class="hljs-string">&#x27;login&#x27;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">LoginForm</span>
    <span class="hljs-attr">username</span>=<span class="hljs-string">{username}</span>
    <span class="hljs-attr">password</span>=<span class="hljs-string">{password}</span>
    <span class="hljs-attr">handleUsernameChange</span>=<span class="hljs-string">{({</span> <span class="hljs-attr">target</span> }) =&gt;</span> setUsername(target.value)}
    handlePasswordChange={({ target }) =&gt; setPassword(target.value)}
    handleSubmit={handleLogin}
  /&gt;</span>
&lt;/<span class="hljs-title class_">Togglable</span>&gt;
</code></pre>
<p>تختلف طريقة استخدام المكوّن قليلاً عن مكوّناتنا السابقة. فللمكوّن وسمَا فتح وإغلاق يحيطان بمكوّن <i>LoginForm</i>. في مصطلحات React، يُعدّ <i>LoginForm</i> مكوّناً ابناً لـ <i>Togglable</i>.</p>
<p>يمكننا إضافة أي عناصر React نريدها بين وسمَي فتح وإغلاق <i>Togglable</i>، مثل هذا على سبيل المثال:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Togglable</span> buttonLabel=<span class="hljs-string">&quot;reveal&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>this line is at start hidden<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>also this is hidden<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>
&lt;/<span class="hljs-title class_">Togglable</span>&gt;
</code></pre>
<p>شيفرة مكوّن <i>Togglable</i> موضحة أدناه:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Togglable</span> = (<span class="hljs-params">props</span>) =&gt; {
  <span class="hljs-keyword">const</span> [visible, setVisible] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>)

  <span class="hljs-keyword">const</span> hideWhenVisible = { <span class="hljs-attr">display</span>: visible ? <span class="hljs-string">&#x27;none&#x27;</span> : <span class="hljs-string">&#x27;&#x27;</span> }
  <span class="hljs-keyword">const</span> showWhenVisible = { <span class="hljs-attr">display</span>: visible ? <span class="hljs-string">&#x27;&#x27;</span> : <span class="hljs-string">&#x27;none&#x27;</span> }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleVisibility</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-title function_">setVisible</span>(!visible)
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{hideWhenVisible}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleVisibility}</span>&gt;</span>{props.buttonLabel}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{showWhenVisible}</span>&gt;</span>
        {props.children}
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleVisibility}</span>&gt;</span>cancel<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Togglable</span>
</code></pre>
<p>الجزء الجديد والمثير للاهتمام في الشيفرة هو <a href="https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children">props.children</a> الذي يُستخدم للإشارة إلى المكوّنات الأبناء للمكوّن. المكوّنات الأبناء هي عناصر React التي نعرّفها بين وسمَي فتح وإغلاق المكوّن.</p>
<p>هذه المرة يُعرض الأبناء في الشيفرة المستخدمة لعرض المكوّن نفسه:</p>
<pre><code class="language-js">&lt;div style={showWhenVisible}&gt;
  {props.<span class="hljs-property">children</span>}
  &lt;button onClick={toggleVisibility}&gt;cancel&lt;/button&gt;
&lt;/div&gt;
</code></pre>
<p>على عكس props «العادية» التي رأيناها سابقاً، تُضيف React خاصية <i>children</i> تلقائياً وهي موجودة دائماً. وإذا عُرّف مكوّن بوسم إغلاق ذاتي <em>/&gt;</em> كهذا:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Note</span>
  key={note.<span class="hljs-property">id</span>}
  note={note}
  toggleImportance={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">toggleImportanceOf</span>(note.<span class="hljs-property">id</span>)}
/&gt;
</code></pre>
<p>فإن <i>props.children</i> عندئذٍ مصفوفة فارغة.</p>
<p>مكوّن <i>Togglable</i> قابل لإعادة الاستخدام، ويمكننا استخدامه لإضافة وظيفة تبديل الرؤية المشابهة إلى النموذج المستخدم لإنشاء ملاحظات جديدة.</p>
<p>قبل أن نفعل ذلك، لنستخرج نموذج إنشاء الملاحظات إلى مكوّن:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteForm</span> = (<span class="hljs-params">{ onSubmit, handleChange, value}</span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Create a new note<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{onSubmit}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
          <span class="hljs-attr">value</span>=<span class="hljs-string">{value}</span>
          <span class="hljs-attr">onChange</span>=<span class="hljs-string">{handleChange}</span>
        /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>save<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>بعد ذلك، لنعرّف مكوّن النموذج داخل مكوّن <i>Togglable</i>:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Togglable</span> buttonLabel=<span class="hljs-string">&quot;new note&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">NoteForm</span>
    <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>
    <span class="hljs-attr">value</span>=<span class="hljs-string">{newNote}</span>
    <span class="hljs-attr">handleChange</span>=<span class="hljs-string">{handleNoteChange}</span>
  /&gt;</span></span>
&lt;/<span class="hljs-title class_">Togglable</span>&gt;
</code></pre>
<p>يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-4</i> من <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-4">مستودع GitHub هذا</a>.</p>
<h3 id="حالة-النماذج">حالة النماذج</h3>
<p>توجد حالة التطبيق حالياً في مكوّن <em>App</em>.</p>
<p>تقول توثيقات React ما <a href="https://react.dev/learn/sharing-state-between-components">يلي</a> حول مكان وضع الحالة:</p>
<p><i>أحياناً تريد أن تتغير حالة مكوّنين معاً دائماً. لفعل ذلك، أزل الحالة من كليهما، وانقلها إلى أقرب سلف مشترك بينهما، ثم مرّرها إليهما عبر props. يُعرف هذا برفع الحالة لأعلى، وهو من أكثر الأمور شيوعاً التي ستفعلها أثناء كتابة شيفرة React.</i></p>
<p>إذا فكرنا في حالة النماذج، ومثلاً محتوى ملاحظة جديدة قبل إنشائها، فلن يحتاج مكوّن <em>App</em> إليها في أي شيء.
ويمكننا ببساطة نقل حالة النماذج إلى المكوّنات المقابلة.</p>
<p>يتغير مكوّن إنشاء ملاحظة جديدة هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteForm</span> = (<span class="hljs-params">{ createNote }</span>) =&gt; {
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-title function_">createNote</span>({
      <span class="hljs-attr">content</span>: newNote,
      <span class="hljs-attr">important</span>: <span class="hljs-literal">true</span>
    })

    <span class="hljs-title function_">setNewNote</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Create a new note<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
          <span class="hljs-attr">value</span>=<span class="hljs-string">{newNote}</span>
          <span class="hljs-attr">onChange</span>=<span class="hljs-string">{event</span> =&gt;</span> setNewNote(event.target.value)}
        /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>save<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NoteForm</span>
</code></pre>
<p><strong>ملاحظة</strong> في الوقت نفسه، غيّرنا سلوك التطبيق بحيث تصبح الملاحظات الجديدة مهمة افتراضياً، أي أن الحقل <i>important</i> يحصل على القيمة <i>true</i>.</p>
<p>نُقل متغير الحالة <i>newNote</i> ومعالج الأحداث المسؤول عن تغييره من مكوّن <em>App</em> إلى المكوّن المسؤول عن نموذج الملاحظة.</p>
<p>لم تبقَ سوى خاصية واحدة هي الدالة <em>createNote</em> التي يستدعيها النموذج عند إنشاء ملاحظة جديدة.</p>
<p>أصبح مكوّن <em>App</em> أبسط الآن بعد أن تخلصنا من حالة <i>newNote</i> ومعالج أحداثها.
تستقبل الدالة <em>addNote</em> الخاصة بإنشاء ملاحظات جديدة ملاحظة جديدة كوسيط، وهي الخاصية الوحيدة التي نرسلها إلى النموذج:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = (<span class="hljs-params">noteObject</span>) =&gt; { <span class="hljs-comment">// highlight-line</span>
    noteService
      .<span class="hljs-title function_">create</span>(noteObject)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">returnedNote</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">concat</span>(returnedNote))
      })
  }
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">noteForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Togglable</span> <span class="hljs-attr">buttonLabel</span>=<span class="hljs-string">&#x27;new note&#x27;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Togglable</span>&gt;</span></span>
  )

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>يمكننا فعل الشيء نفسه مع نموذج تسجيل الدخول، لكننا سنترك ذلك لتمرين اختياري.</p>
<p>يمكن إيجاد شيفرة التطبيق على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-5">GitHub</a>، في الفرع <i>part5-5</i>.</p>
<h3 id="الإشارة-إلى-المكونات-باستخدام-ref">الإشارة إلى المكوّنات باستخدام ref</h3>
<p>تنفيذنا الحالي جيد تماماً، لكن فيه جانب واحد يمكن تحسينه.</p>
<p>بعد إنشاء ملاحظة جديدة، سيكون من المنطقي إخفاء نموذج الملاحظة الجديدة. حالياً يبقى النموذج ظاهراً. وهناك مشكلة بسيطة في إخفائه، إذ تُتحكَّم الرؤية بمتغير الحالة <i>visible</i> داخل مكوّن <i>Togglable</i>.</p>
<p>أحد الحلول لذلك سيكون نقل التحكم في حالة مكوّن Togglable إلى خارج المكوّن. لكننا لن نفعل ذلك الآن، لأننا نريد أن يكون المكوّن مسؤولاً عن حالته الخاصة. لذا علينا إيجاد حل آخر، وإيجاد آلية لتغيير حالة المكوّن من الخارج.</p>
<p>هناك عدة طرق مختلفة لتنفيذ الوصول إلى دوال المكوّن من خارجه، لكن لنستخدم آلية <a href="https://react.dev/learn/referencing-values-with-refs">ref</a> في React التي توفر مرجعاً إلى المكوّن.</p>
<p>لنجرِ التغييرات التالية على مكوّن <i>App</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect, useRef } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> noteFormRef = <span class="hljs-title function_">useRef</span>() <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">noteForm</span> = (<span class="hljs-params"></span>) =&gt; (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Togglable</span> <span class="hljs-attr">buttonLabel</span>=<span class="hljs-string">&#x27;new note&#x27;</span> <span class="hljs-attr">ref</span>=<span class="hljs-string">{noteFormRef}</span>&gt;</span>  // highlight-line
      <span class="hljs-tag">&lt;<span class="hljs-name">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Togglable</span>&gt;</span></span>
  )

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>يُستخدم خطاف <a href="https://react.dev/reference/react/useRef">useRef</a> لإنشاء مرجع <i>noteFormRef</i> الذي يُسند إلى مكوّن <i>Togglable</i> المحتوي على نموذج إنشاء الملاحظة. يعمل المتغير <i>noteFormRef</i> كمرجع إلى المكوّن. ويضمن هذا الخطاف بقاء المرجع (ref) نفسه طوال عمليات إعادة عرض المكوّن.</p>
<p>نجري أيضاً التغييرات التالية على مكوّن <i>Togglable</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useImperativeHandle } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Togglable</span> = (<span class="hljs-params">props</span>) =&gt; { <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> [visible, setVisible] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>)

  <span class="hljs-keyword">const</span> hideWhenVisible = { <span class="hljs-attr">display</span>: visible ? <span class="hljs-string">&#x27;none&#x27;</span> : <span class="hljs-string">&#x27;&#x27;</span> }
  <span class="hljs-keyword">const</span> showWhenVisible = { <span class="hljs-attr">display</span>: visible ? <span class="hljs-string">&#x27;&#x27;</span> : <span class="hljs-string">&#x27;none&#x27;</span> }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleVisibility</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-title function_">setVisible</span>(!visible)
  }

<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-title function_">useImperativeHandle</span>(props.<span class="hljs-property">ref</span>, <span class="hljs-function">() =&gt;</span> {
    <span class="hljs-keyword">return</span> { toggleVisibility }
  })
<span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{hideWhenVisible}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleVisibility}</span>&gt;</span>{props.buttonLabel}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{showWhenVisible}</span>&gt;</span>
        {props.children}
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleVisibility}</span>&gt;</span>cancel<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Togglable</span>
</code></pre>
<p>يستخدم المكوّن خطاف <a href="https://react.dev/reference/react/useImperativeHandle">useImperativeHandle</a> لجعل دالته <i>toggleVisibility</i> متاحة خارج المكوّن.</p>
<p>يمكننا الآن إخفاء النموذج باستدعاء <i>noteFormRef.current.toggleVisibility()</i> بعد إنشاء ملاحظة جديدة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = (<span class="hljs-params">noteObject</span>) =&gt; {
    noteFormRef.<span class="hljs-property">current</span>.<span class="hljs-title function_">toggleVisibility</span>() <span class="hljs-comment">// highlight-line</span>
    noteService
      .<span class="hljs-title function_">create</span>(noteObject)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">returnedNote</span> =&gt;</span> {     
        <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">concat</span>(returnedNote))
      })
  }
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>وخلاصة القول، إن دالة <a href="https://react.dev/reference/react/useImperativeHandle">useImperativeHandle</a> هي خطاف في React يُستخدم لتعريف دوال في مكوّن يمكن استدعاؤها من خارج المكوّن.</p>
<p>هذه الحيلة تنجح في تغيير حالة مكوّن، لكنها تبدو غير مستحسنة قليلاً. كان يمكننا تحقيق الوظيفة نفسها بشيفرة أنظف قليلاً باستخدام مكوّنات الأصناف (class components) من «React القديم». سنلقي نظرة على مكوّنات الأصناف هذه خلال الجزء السابع من مادة الدورة. وحتى الآن، هذه هي الحالة الوحيدة التي يؤدي فيها استخدام خطافات React إلى شيفرة ليست أنظف مما هو الحال مع مكوّنات الأصناف.</p>
<p>هناك أيضاً <a href="https://react.dev/learn/manipulating-the-dom-with-refs">حالات استخدام أخرى</a> للمراجع غير الوصول إلى مكوّنات React.</p>
<p>يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-6</i> من <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-6">مستودع GitHub هذا</a>.</p>
<h3 id="ملاحظة-حول-المكونات">ملاحظة حول المكوّنات</h3>
<p>عندما نعرّف مكوّناً في React:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Togglable</span> = (<span class="hljs-params"></span>) =&gt; ...
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>ونستخدمه هكذا:</p>
<pre><code class="language-js">&lt;div&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Togglable</span> <span class="hljs-attr">buttonLabel</span>=<span class="hljs-string">&quot;1&quot;</span> <span class="hljs-attr">ref</span>=<span class="hljs-string">{togglable1}</span>&gt;</span>
    first
  <span class="hljs-tag">&lt;/<span class="hljs-name">Togglable</span>&gt;</span></span>

  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Togglable</span> <span class="hljs-attr">buttonLabel</span>=<span class="hljs-string">&quot;2&quot;</span> <span class="hljs-attr">ref</span>=<span class="hljs-string">{togglable2}</span>&gt;</span>
    second
  <span class="hljs-tag">&lt;/<span class="hljs-name">Togglable</span>&gt;</span></span>

  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Togglable</span> <span class="hljs-attr">buttonLabel</span>=<span class="hljs-string">&quot;3&quot;</span> <span class="hljs-attr">ref</span>=<span class="hljs-string">{togglable3}</span>&gt;</span>
    third
  <span class="hljs-tag">&lt;/<span class="hljs-name">Togglable</span>&gt;</span></span>
&lt;/div&gt;
</code></pre>
<p>ننشئ <i>ثلاث نسخ منفصلة من المكوّن</i>، ولكل منها حالتها المنفصلة:</p>
<p><img src="/images/content/5/12e.webp" alt="متصفح يعرض ثلاثة مكوّنات Togglable"></p>
<p>تُستخدم خاصية <i>ref</i> لإسناد مرجع إلى كل من المكوّنات في المتغيرات <i>togglable1</i> و<i>togglable2</i> و<i>togglable3</i>.</p>
<h3 id="قسم-مطور-full-stack-المحدث">قسم مطوّر full stack المحدَّث</h3>
<p>يزداد عدد الأجزاء المتحركة. وفي الوقت نفسه، يزداد احتمال الوقوع في موقف نبحث فيه عن خطأ في المكان الخطأ. لذا نحتاج إلى أن نكون أكثر منهجية.</p>
<p>لذا ينبغي أن نوسّع قسمنا مرة أخرى:</p>
<p>تطوير full stack <i>صعب للغاية</i>، ولهذا سأستخدم كل الوسائل الممكنة لتسهيله</p>
<ul>
<li>سأبقي وحدة تحكم مطوّري المتصفح مفتوحة طوال الوقت</li>
<li>سأستخدم تبويب network في أدوات مطوّري المتصفح للتأكد من أن الواجهة الأمامية والخلفية تتواصلان كما أتوقع</li>
<li>سأراقب باستمرار حالة الخادم للتأكد من أن البيانات التي ترسلها الواجهة الأمامية إليه تُحفظ هناك كما أتوقع</li>
<li>سأراقب قاعدة البيانات: هل تحفظ الواجهة الخلفية البيانات فيها بالصيغة الصحيحة</li>
<li>سأتقدم بخطوات صغيرة</li>
<li><i>عندما أشك في وجود خطأ في الواجهة الأمامية، سأتأكد من أن الواجهة الخلفية تعمل كما هو متوقع</i></li>
<li><i>عندما أشك في وجود خطأ في الواجهة الخلفية، سأتأكد من أن الواجهة الأمامية تعمل كما هو متوقع</i></li>
<li>سأكتب الكثير من عبارات <em>console.log</em> للتأكد من فهمي لكيفية تصرف الشيفرة والاختبارات وللمساعدة في تحديد المشكلات</li>
<li>إذا لم تعمل شيفرتي، لن أكتب المزيد من الشيفرة. بل سأبدأ بحذفها حتى تعمل أو أعود ببساطة إلى حالة كان فيها كل شيء ما زال يعمل</li>
<li>إذا لم ينجح اختبار، سأتأكد من أن الوظيفة المُختبَرة تعمل بشكل صحيح في التطبيق</li>
<li>عندما أطلب المساعدة في قناة Discord الخاصة بالدورة أو في أي مكان آخر، أصوغ أسئلتي بشكل صحيح، انظر <a href="/part0/general_info#how-to-get-help-in-discord">هنا</a> لكيفية طلب المساعدة</li>
</ul>
</div>
<div class="tasks">
<h3 id="تمارين-55-511">تمارين 5.5.-5.11.</h3>
<h4 id="55-واجهة-قائمة-المدونات-الأمامية-الخطوة-5">5.5 واجهة قائمة المدونات الأمامية، الخطوة 5</h4>
<p>غيّر نموذج إنشاء منشورات المدونات بحيث لا يُعرض إلا عند الحاجة. استخدم وظيفة مشابهة لما عُرض <a href="/part5/props_children_and_component_refs#displaying-the-login-form-only-when-appropriate">سابقاً في هذا الجزء من مادة الدورة</a>. وإذا رغبت في ذلك، يمكنك استخدام مكوّن <i>Togglable</i> المعرَّف في الجزء 5.</p>
<p>افتراضياً لا يكون النموذج ظاهراً</p>
<p><img src="/images/content/5/13ae.webp" alt="متصفح يعرض زر ملاحظة جديدة دون نموذج"></p>
<p>يتمدد عند النقر على زر <i>create new blog</i></p>
<p><img src="/images/content/5/13be.webp" alt="متصفح يعرض النموذج مع create new"></p>
<p>يُخفى النموذج مرة أخرى بعد إنشاء مدونة جديدة أو الضغط على زر <i>cancel</i>.</p>
<h4 id="56-واجهة-قائمة-المدونات-الأمامية-الخطوة-6">5.6 واجهة قائمة المدونات الأمامية، الخطوة 6</h4>
<p>افصل نموذج إنشاء مدونة جديدة إلى مكوّن خاص به (إن لم تكن قد فعلت ذلك بالفعل)، وانقل كل الحالات المطلوبة لإنشاء مدونة جديدة إلى هذا المكوّن.</p>
<p>يجب أن يعمل المكوّن مثل مكوّن <i>NoteForm</i> من <a href="/part5/props_children_and_component_refs#state-of-the-forms">مادة</a> هذا الجزء.</p>
<h4 id="57-واجهة-قائمة-المدونات-الأمامية-الخطوة-7">5.7 واجهة قائمة المدونات الأمامية، الخطوة 7</h4>
<p>لنضف زراً إلى كل مدونة يتحكم في عرض جميع تفاصيل المدونة أو عدم عرضها.</p>
<p>تُفتح التفاصيل الكاملة للمدونة عند النقر على الزر.</p>
<p><img src="/images/content/5/13ea.webp" alt="متصفح يعرض التفاصيل الكاملة لمدونة، بينما تملك بقية المدونات أزرار view فقط"></p>
<p>وتُخفى التفاصيل عند النقر على الزر مرة أخرى.</p>
<p>في هذه المرحلة، لا يحتاج زر <i>like</i> إلى فعل أي شيء.</p>
<p>يحتوي التطبيق الظاهر في الصورة على قليل من CSS الإضافي لتحسين مظهره.</p>
<p>من السهل إضافة أنماط إلى التطبيق كما هو موضح في الجزء 2 باستخدام الأنماط <a href="/part2/adding_styles_to_react_app#inline-styles">المضمّنة</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Blog</span> = (<span class="hljs-params">{ blog }</span>) =&gt; {
  <span class="hljs-keyword">const</span> blogStyle = {
    <span class="hljs-attr">paddingTop</span>: <span class="hljs-number">10</span>,
    <span class="hljs-attr">paddingLeft</span>: <span class="hljs-number">2</span>,
    <span class="hljs-attr">border</span>: <span class="hljs-string">&#x27;solid&#x27;</span>,
    <span class="hljs-attr">borderWidth</span>: <span class="hljs-number">1</span>,
    <span class="hljs-attr">marginBottom</span>: <span class="hljs-number">5</span>
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{blogStyle}</span>&gt;</span> // highlight-line
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        {blog.title} {blog.author}
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      // ...
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
)}
</code></pre>
<p><strong>ملاحظة:</strong> رغم أن الوظيفة المنفَّذة في هذا الجزء تكاد تكون مطابقة للوظيفة التي يوفرها مكوّن <i>Togglable</i>، فلا يمكن استخدامه مباشرةً لتحقيق السلوك المطلوب. سيكون الحل الأسهل هو إضافة حالة إلى مكوّن المدونة تتحكم في عرض التفاصيل أو عدم عرضها.</p>
<h4 id="58-واجهة-قائمة-المدونات-الأمامية-الخطوة-8">5.8: واجهة قائمة المدونات الأمامية، الخطوة 8</h4>
<p>نفّذ وظيفة زر الإعجاب. تُزاد الإعجابات بإرسال طلب HTTP من نوع <em>PUT</em> إلى العنوان الفريد لمنشور المدونة في الواجهة الخلفية.</p>
<p>بما أن عملية الواجهة الخلفية تستبدل منشور المدونة بأكمله، فسيتعين عليك إرسال جميع حقوله في جسم الطلب. إذا أردت إضافة إعجاب إلى منشور المدونة التالي:</p>
<pre><code class="language-js">{
  <span class="hljs-attr">_id</span>: <span class="hljs-string">&quot;5a43fde2cbd20b12a2c34e91&quot;</span>,
  <span class="hljs-attr">user</span>: {
    <span class="hljs-attr">_id</span>: <span class="hljs-string">&quot;5a43e6b6c37f3d065eaaa581&quot;</span>,
    <span class="hljs-attr">username</span>: <span class="hljs-string">&quot;mluukkai&quot;</span>,
    <span class="hljs-attr">name</span>: <span class="hljs-string">&quot;Matti Luukkainen&quot;</span>
  },
  <span class="hljs-attr">likes</span>: <span class="hljs-number">0</span>,
  <span class="hljs-attr">author</span>: <span class="hljs-string">&quot;Joel Spolsky&quot;</span>,
  <span class="hljs-attr">title</span>: <span class="hljs-string">&quot;The Joel Test: 12 Steps to Better Code&quot;</span>,
  <span class="hljs-attr">url</span>: <span class="hljs-string">&quot;https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/&quot;</span>
},
</code></pre>
<p>فسيتعين عليك إرسال طلب HTTP PUT إلى العنوان <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> ببيانات الطلب التالية:</p>
<pre><code class="language-js">{
  <span class="hljs-attr">user</span>: <span class="hljs-string">&quot;5a43e6b6c37f3d065eaaa581&quot;</span>,
  <span class="hljs-attr">likes</span>: <span class="hljs-number">1</span>,
  <span class="hljs-attr">author</span>: <span class="hljs-string">&quot;Joel Spolsky&quot;</span>,
  <span class="hljs-attr">title</span>: <span class="hljs-string">&quot;The Joel Test: 12 Steps to Better Code&quot;</span>,
  <span class="hljs-attr">url</span>: <span class="hljs-string">&quot;https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/&quot;</span>
}
</code></pre>
<p>يجب تحديث الواجهة الخلفية أيضاً للتعامل مع مرجع المستخدم.</p>
<h4 id="59-واجهة-قائمة-المدونات-الأمامية-الخطوة-9">5.9: واجهة قائمة المدونات الأمامية، الخطوة 9</h4>
<p>نلاحظ أن هناك خطباً ما. عندما يُعجَب بمدونة في التطبيق، لا يظهر اسم المستخدم الذي أضاف المدونة في تفاصيلها:</p>
<p><img src="/images/content/5/59put.webp" alt="متصفح يعرض اسماً مفقوداً أسفل زر الإعجاب"></p>
<p>عند إعادة تحميل المتصفح، تظهر معلومات الشخص. هذا غير مقبول؛ اكتشف أين تكمن المشكلة وأجرِ التصحيح اللازم.</p>
<p>بالطبع، من الممكن أن تكون قد أنجزت كل شيء بشكل صحيح بالفعل ولا تظهر المشكلة في شيفرتك. في هذه الحالة، يمكنك المتابعة.</p>
<h4 id="510-واجهة-قائمة-المدونات-الأمامية-الخطوة-10">5.10: واجهة قائمة المدونات الأمامية، الخطوة 10</h4>
<p>عدّل التطبيق ليرتب منشورات المدونات حسب عدد <i>likes</i>. يمكن إجراء الترتيب باستخدام دالة <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">sort</a> الخاصة بالمصفوفات.</p>
<h4 id="511-واجهة-قائمة-المدونات-الأمامية-الخطوة-11">5.11: واجهة قائمة المدونات الأمامية، الخطوة 11</h4>
<p>أضف زراً جديداً لحذف منشورات المدونات. ونفّذ أيضاً منطق حذف منشورات المدونات في الواجهة الأمامية.</p>
<p>قد يبدو تطبيقك شيئاً كهذا:</p>
<p><img src="/images/content/5/14ea.webp" alt="متصفح يعرض تأكيد حذف مدونة"></p>
<p>يسهل تنفيذ نافذة تأكيد حذف منشور مدونة باستخدام دالة <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm">window.confirm</a>.</p>
<p>أظهر زر حذف منشور المدونة فقط إذا كان المستخدم هو من أضاف المنشور.</p>
</div>
<div class="content">
<h3 id="eslint">ESlint</h3>
<p>في الجزء 3 أعددنا أداة نمط الشيفرة <a href="/part3/validation_and_es_lint#lint">ESlint</a> للواجهة الخلفية. لنستخدم ESlint في الواجهة الأمامية أيضاً.</p>
<p>ثبّت Vite أداة ESlint في المشروع افتراضياً، لذا كل ما يتبقى لنا هو تعريف الإعداد الذي نريده في ملف <i>eslint.config.js</i>.</p>
<p>لننشئ ملف <i>eslint.config.js</i> بالمحتوى التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> js <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@eslint/js&#x27;</span>
<span class="hljs-keyword">import</span> globals <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;globals&#x27;</span>
<span class="hljs-keyword">import</span> reactHooks <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;eslint-plugin-react-hooks&#x27;</span>
<span class="hljs-keyword">import</span> reactRefresh <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;eslint-plugin-react-refresh&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> [
  { <span class="hljs-attr">ignores</span>: [<span class="hljs-string">&#x27;dist&#x27;</span>] },
  {
    <span class="hljs-attr">files</span>: [<span class="hljs-string">&#x27;**/*.{js,jsx}&#x27;</span>],
    <span class="hljs-attr">languageOptions</span>: {
      <span class="hljs-attr">ecmaVersion</span>: <span class="hljs-number">2020</span>,
      <span class="hljs-attr">globals</span>: globals.<span class="hljs-property">browser</span>,
      <span class="hljs-attr">parserOptions</span>: {
        <span class="hljs-attr">ecmaVersion</span>: <span class="hljs-string">&#x27;latest&#x27;</span>,
        <span class="hljs-attr">ecmaFeatures</span>: { <span class="hljs-attr">jsx</span>: <span class="hljs-literal">true</span> },
        <span class="hljs-attr">sourceType</span>: <span class="hljs-string">&#x27;module&#x27;</span>
      }
    },
    <span class="hljs-attr">plugins</span>: {
      <span class="hljs-string">&#x27;react-hooks&#x27;</span>: reactHooks,
      <span class="hljs-string">&#x27;react-refresh&#x27;</span>: reactRefresh
    },
    <span class="hljs-attr">rules</span>: {
      ...js.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>.<span class="hljs-property">rules</span>,
      ...reactHooks.<span class="hljs-property">configs</span>.<span class="hljs-property">recommended</span>.<span class="hljs-property">rules</span>,
      <span class="hljs-string">&#x27;no-unused-vars&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, { <span class="hljs-attr">varsIgnorePattern</span>: <span class="hljs-string">&#x27;^[A-Z_]&#x27;</span> }],
      <span class="hljs-string">&#x27;react-refresh/only-export-components&#x27;</span>: [
        <span class="hljs-string">&#x27;warn&#x27;</span>,
        { <span class="hljs-attr">allowConstantExport</span>: <span class="hljs-literal">true</span> }
      <span class="hljs-comment">// highlight-start</span>
      ],
      <span class="hljs-attr">indent</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-number">2</span>],
      <span class="hljs-string">&#x27;linebreak-style&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;unix&#x27;</span>],
      <span class="hljs-attr">quotes</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;single&#x27;</span>],
      <span class="hljs-attr">semi</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;never&#x27;</span>],
      <span class="hljs-attr">eqeqeq</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;no-trailing-spaces&#x27;</span>: <span class="hljs-string">&#x27;error&#x27;</span>,
      <span class="hljs-string">&#x27;object-curly-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, <span class="hljs-string">&#x27;always&#x27;</span>],
      <span class="hljs-string">&#x27;arrow-spacing&#x27;</span>: [<span class="hljs-string">&#x27;error&#x27;</span>, { <span class="hljs-attr">before</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">after</span>: <span class="hljs-literal">true</span> }],
      <span class="hljs-string">&#x27;no-console&#x27;</span>: <span class="hljs-string">&#x27;off&#x27;</span>
      <span class="hljs-comment">//highlight-end</span>
    }
  }
]
</code></pre>
<p>ملاحظة: إذا كنت تستخدم Visual Studio Code مع إضافة ESLint، فقد تحتاج إلى إضافة إعداد مساحة عمل لكي يعمل. وإذا ظهرت لك رسالة <i>Failed to load plugin react: Cannot find module 'eslint-plugin-react'</i> فستكون هناك حاجة إلى إعداد إضافي. وقد تساعد إضافة السطر التالي إلى settings.json:</p>
<pre><code class="language-js"><span class="hljs-string">&quot;eslint.workingDirectories&quot;</span>: [{ <span class="hljs-string">&quot;mode&quot;</span>: <span class="hljs-string">&quot;auto&quot;</span> }]
</code></pre>
<p>انظر <a href="https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807">هنا</a> لمزيد من المعلومات.</p>
<p>كما اعتدنا، يمكنك تشغيل أداة lint إما من سطر الأوامر بالأمر</p>
<pre><code class="language-bash">npm run lint
</code></pre>
<p>أو باستخدام إضافة Eslint في محرّرك.</p>
<p>يمكنك إيجاد شيفرة تطبيقنا الحالي كاملةً في فرع <i>part5-7</i> من <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-7">مستودع GitHub هذا</a>.</p>
</div>
<div class="tasks">
<h3 id="تمرين-512">تمرين 5.12.</h3>
<h4 id="512-واجهة-قائمة-المدونات-الأمامية-الخطوة-12">5.12: واجهة قائمة المدونات الأمامية، الخطوة 12</h4>
<p>أضف ESlint إلى المشروع. وعرّف الإعداد كما يحلو لك. وأصلح جميع أخطاء أداة lint.</p>
<p>ثبّت Vite أداة ESlint في المشروع افتراضياً، لذا كل ما يتبقى عليك فعله هو تعريف الإعداد الذي تريده في ملف <i>eslint.config.js</i>.</p>
</div>
`,i={part:5,letter:"b",file:s,title:a,slug:n,mainImage:l,headings:p,html:t};export{i as default,s as file,p as headings,t as html,c as letter,l as mainImage,e as part,n as slug,a as title};
