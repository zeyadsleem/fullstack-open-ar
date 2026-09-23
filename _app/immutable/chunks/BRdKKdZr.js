const e=2,c="e",s="part2e.md",n="إضافة الأنماط إلى تطبيق React",a="adding_styles_to_react_app",p="/images/part-2.svg",l=[{depth:3,id:"رسالة-خطأ-محسنة",text:"رسالة خطأ محسّنة"},{depth:3,id:"الأنماط-المضمنة",text:"الأنماط المضمّنة"},{depth:3,id:"تمارين-216-217",text:"تمارين 2.16.-2.17."},{depth:3,id:"بضع-ملاحظات-مهمة",text:"بضع ملاحظات مهمة"},{depth:3,id:"تمارين-218-220",text:"تمارين 2.18.-2.20."}],t=`<div class="content">
<p>مظهر تطبيق Notes الحالي لدينا متواضع تماماً. في <a href="/part0/fundamentals_of_web_apps#exercises-0-1-0-6">التمرين 0.2</a>، كان المطلوب الاطلاع على <a href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics">درس CSS</a> من Mozilla.</p>
<p>لنلقِ نظرة على كيفية إضافة أنماط إلى تطبيق React. هناك عدة طرق مختلفة لفعل ذلك، وسنلقي نظرة على الطرق الأخرى لاحقاً. أولاً، سنضيف CSS إلى تطبيقنا بالطريقة القديمة؛ في ملف واحد دون استخدام <a href="https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor">معالج CSS مسبق</a> (رغم أن هذا ليس صحيحاً تماماً كما سنتعلم لاحقاً).</p>
<p>لنضف ملفاً جديداً <i>index.css</i> تحت مجلد <i>src</i> ثم نضيفه إلى التطبيق باستيراده في الملف <i>main.jsx</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-string">&#x27;./index.css&#x27;</span>
</code></pre>
<p>لنضف قاعدة CSS التالية إلى الملف <i>index.css</i>:</p>
<pre><code class="language-css"><span class="hljs-selector-tag">h1</span> {
  <span class="hljs-attribute">color</span>: green;
}
</code></pre>
<p>تتكوّن قواعد CSS من <i>محدّدات</i> و<i>تعريفات</i>. يحدّد المحدّد العناصر التي يجب تطبيق القاعدة عليها. المحدّد أعلاه هو <i>h1</i>، وسيطابق جميع وسوم العناوين <i>h1</i> في تطبيقنا.</p>
<p>يعيّن التعريف خاصية <em>color</em> على القيمة <i>green</i>.</p>
<p>يمكن أن تحتوي قاعدة CSS واحدة على عدد غير محدود من الخصائص. لنعدّل القاعدة السابقة لجعل النص مائلاً، بتعريف نمط الخط كـ<i>italic</i>:</p>
<pre><code class="language-css"><span class="hljs-selector-tag">h1</span> {
  <span class="hljs-attribute">color</span>: green;
  <span class="hljs-attribute">font-style</span>: italic;  // highlight-<span class="hljs-selector-tag">line</span>
}
</code></pre>
<p>هناك طرق عديدة لمطابقة العناصر باستخدام <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors">أنواع مختلفة من محدّدات CSS</a>.</p>
<p>لو أردنا، على سبيل المثال، استهداف كل واحدة من الملاحظات بأنماطنا، لأمكننا استخدام المحدّد <i>li</i>، لأن جميع الملاحظات ملفوفة داخل وسوم <i>li</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ note, toggleImportance }</span>) =&gt; {
  <span class="hljs-keyword">const</span> label = note.<span class="hljs-property">important</span> 
    ? <span class="hljs-string">&#x27;make not important&#x27;</span> 
    : <span class="hljs-string">&#x27;make important&#x27;</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>
      {note.content} 
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleImportance}</span>&gt;</span>{label}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span></span>
  )
}
</code></pre>
<p>لنضف القاعدة التالية إلى ورقة الأنماط لدينا (بما أن معرفتي بتصميم الويب الأنيق تقترب من الصفر، فالأنماط لا معنى لها تقريباً):</p>
<pre><code class="language-css"><span class="hljs-selector-tag">li</span> {
  <span class="hljs-attribute">color</span>: grey;
  <span class="hljs-attribute">padding-top</span>: <span class="hljs-number">3px</span>;
  <span class="hljs-attribute">font-size</span>: <span class="hljs-number">15px</span>;
}
</code></pre>
<p>استخدام أنواع العناصر لتعريف قواعد CSS مشكِل بعض الشيء. إذا احتوى تطبيقنا على وسوم <i>li</i> أخرى، فستُطبَّق عليها قاعدة النمط نفسها أيضاً.</p>
<p>إذا أردنا تطبيق نمطنا على الملاحظات تحديداً، فمن الأفضل استخدام <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors">محدّدات الأصناف</a>.</p>
<p>في HTML العادي، تُعرَّف الأصناف كقيمة للخاصية <i>class</i>:</p>
<pre><code class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;note&quot;</span>&gt;</span>some text...<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
</code></pre>
<p>في React علينا استخدام خاصية <a href="https://react.dev/learn#adding-styles">className</a> بدلاً من خاصية class. مع أخذ ذلك في الاعتبار، لنُجرِ التغييرات التالية على مكوّن <i>Note</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ note, toggleImportance }</span>) =&gt; {
  <span class="hljs-keyword">const</span> label = note.<span class="hljs-property">important</span> 
    ? <span class="hljs-string">&#x27;make not important&#x27;</span> 
    : <span class="hljs-string">&#x27;make important&#x27;</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&#x27;note&#x27;</span>&gt;</span> // highlight-line
      {note.content} 
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toggleImportance}</span>&gt;</span>{label}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span></span>
  )
}
</code></pre>
<p>تُعرَّف محدّدات الأصناف بالصيغة <em>.classname</em>:</p>
<pre><code class="language-css"><span class="hljs-selector-class">.note</span> {
  <span class="hljs-attribute">color</span>: grey;
  <span class="hljs-attribute">padding-top</span>: <span class="hljs-number">5px</span>;
  <span class="hljs-attribute">font-size</span>: <span class="hljs-number">15px</span>;
}
</code></pre>
<p>إذا أضفت الآن عناصر <i>li</i> أخرى إلى التطبيق، فلن تتأثر بقاعدة النمط أعلاه.</p>
<h3 id="رسالة-خطأ-محسنة">رسالة خطأ محسّنة</h3>
<p>نفّذنا سابقاً رسالة الخطأ التي كانت تُعرض عندما يحاول المستخدم تبديل أهمية ملاحظة محذوفة باستخدام الدالة <em>alert</em>. لننفّذ رسالة الخطأ كمكوّن React خاص بها في الملف <i>src/components/Notification.jsx</i>.</p>
<p>المكوّن بسيط جداً:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Notification</span> = (<span class="hljs-params">{ message }</span>) =&gt; {
  <span class="hljs-keyword">if</span> (message === <span class="hljs-literal">null</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;error&quot;</span>&gt;</span>
      {message}
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Notification</span>
</code></pre>
<p>إذا كانت قيمة prop <em>message</em> هي <em>null</em>، فلا يُعرض شيء على الشاشة، وفي الحالات الأخرى تُعرض الرسالة داخل عنصر div.</p>
<p>لنضف قطعة حالة جديدة تُسمى <i>errorMessage</i> إلى مكوّن <i>App</i>. لنهيّئها برسالة خطأ ما حتى نتمكن من اختبار مكوّننا فوراً:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Note</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Note&#x27;</span>
<span class="hljs-keyword">import</span> noteService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./services/notes&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Notification</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Notification&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([]) 
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [showAll, setShowAll] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>)
  <span class="hljs-keyword">const</span> [errorMessage, setErrorMessage] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;some error happened...&#x27;</span>) <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">message</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span> // highlight-line
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShowAll(!showAll)}&gt;
          show {showAll ? &#x27;important&#x27; : &#x27;all&#x27; }
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>      
      // ...
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>ثم لنضف قاعدة نمط تناسب رسالة خطأ:</p>
<pre><code class="language-css"><span class="hljs-selector-class">.error</span> {
  <span class="hljs-attribute">color</span>: red;
  <span class="hljs-attribute">background</span>: lightgrey;
  <span class="hljs-attribute">font-size</span>: <span class="hljs-number">20px</span>;
  <span class="hljs-attribute">border-style</span>: solid;
  <span class="hljs-attribute">border-radius</span>: <span class="hljs-number">5px</span>;
  <span class="hljs-attribute">padding</span>: <span class="hljs-number">10px</span>;
  <span class="hljs-attribute">margin-bottom</span>: <span class="hljs-number">10px</span>;
}
</code></pre>
<p>الآن أصبحنا مستعدين لإضافة المنطق الخاص بعرض رسالة الخطأ. لنغيّر الدالة <em>toggleImportanceOf</em> على النحو التالي:</p>
<pre><code class="language-js">  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleImportanceOf</span> = id =&gt; {
    <span class="hljs-keyword">const</span> note = notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> === id)
    <span class="hljs-keyword">const</span> changedNote = { ...note, <span class="hljs-attr">important</span>: !note.<span class="hljs-property">important</span> }

    noteService
      .<span class="hljs-title function_">update</span>(id, changedNote).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">returnedNote</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> note.<span class="hljs-property">id</span> !== id ? note : returnedNote))
      })
      .<span class="hljs-title function_">catch</span>(<span class="hljs-function"><span class="hljs-params">error</span> =&gt;</span> {
        <span class="hljs-comment">// highlight-start</span>
        <span class="hljs-title function_">setErrorMessage</span>(
          <span class="hljs-string">\`Note &#x27;<span class="hljs-subst">\${note.content}</span>&#x27; was already removed from server\`</span>
        )
        <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
          <span class="hljs-title function_">setErrorMessage</span>(<span class="hljs-literal">null</span>)
        }, <span class="hljs-number">5000</span>)
        <span class="hljs-comment">// highlight-end</span>
        <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> !== id))
      })
  }
</code></pre>
<p>عند حدوث الخطأ نضيف رسالة خطأ وصفية إلى حالة <em>errorMessage</em>. وفي الوقت نفسه نبدأ مؤقتاً يعيّن حالة <em>errorMessage</em> إلى <em>null</em> بعد خمس ثوانٍ.</p>
<p>تبدو النتيجة هكذا:</p>
<p><img src="/images/content/2/26e.webp" alt="لقطة شاشة من التطبيق لرسالة خطأ الإزالة من الخادم"></p>
<p>يمكن العثور على شيفرة الحالة الحالية لتطبيقنا في الفرع <i>part2-7</i> على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-7">GitHub</a>.</p>
<h3 id="الأنماط-المضمنة">الأنماط المضمّنة</h3>
<p>يتيح React أيضاً كتابة الأنماط مباشرة في الشيفرة بما يُسمى <a href="https://react-cn.github.io/react/tips/inline-styles.html">الأنماط المضمّنة</a>.</p>
<p>الفكرة وراء تعريف الأنماط المضمّنة بسيطة للغاية. يمكن تزويد أي مكوّن أو عنصر React بمجموعة من خصائص CSS ككائن JavaScript عبر خاصية <a href="https://react.dev/reference/react-dom/components/common#applying-css-styles">style</a>.</p>
<p>تُعرَّف قواعد CSS في JavaScript بشكل مختلف قليلاً عمّا هي عليه في ملفات CSS العادية. لنفترض أننا أردنا إعطاء بعض العناصر اللون الأخضر وخطاً مائلاً. في CSS سيبدو الأمر هكذا:</p>
<pre><code class="language-css">{
  <span class="hljs-attribute">color</span>: green;
  <span class="hljs-attribute">font-style</span>: italic;
}
</code></pre>
<p>لكن ككائن نمط مضمّن في React سيبدو هكذا:</p>
<pre><code class="language-js">{
  <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;green&#x27;</span>,
  <span class="hljs-attr">fontStyle</span>: <span class="hljs-string">&#x27;italic&#x27;</span>
}
</code></pre>
<p>تُعرَّف كل خاصية CSS كخاصية منفصلة في كائن JavaScript. ويمكن ببساطة تعريف القيم الرقمية للبكسلات كأعداد صحيحة. ومن أبرز الفروق مقارنة بـCSS العادي أن خصائص CSS الموصولة بشرطات (kebab case) تُكتب بصيغة camelCase.</p>
<p>لنضف مكوّن تذييل، <i>Footer</i>، إلى تطبيقنا ونعرّف له أنماطاً مضمّنة. يُعرَّف المكوّن في الملف <em>components/Footer.jsx</em> ويُستخدم في الملف <em>App.jsx</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Footer</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> footerStyle = {
    <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;green&#x27;</span>,
    <span class="hljs-attr">fontStyle</span>: <span class="hljs-string">&#x27;italic&#x27;</span>
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{footerStyle}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">br</span> /&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>
        Note app, Department of Computer Science, University of Helsinki 2025
      <span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Footer</span>
</code></pre>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Footer</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Footer&#x27;</span> <span class="hljs-comment">// highlight-line</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Note</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Note&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Notification</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Notification&#x27;</span>
<span class="hljs-keyword">import</span> noteService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./services/notes&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">message</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>

      // ...  

      <span class="hljs-tag">&lt;<span class="hljs-name">Footer</span> /&gt;</span> // highlight-line
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>تأتي الأنماط المضمّنة بقيود معينة. فعلى سبيل المثال، لا يمكن استخدام ما يُسمى <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">الحالات الزائفة</a> (pseudo-classes) بشكل مباشر.</p>
<p>تتعارض الأنماط المضمّنة وبعض الطرق الأخرى لإضافة الأنماط إلى مكوّنات React تماماً مع الأعراف القديمة. فتقليدياً، كان يُعتبر من أفضل الممارسات الفصل التام بين CSS والمحتوى (HTML) والوظائف (JavaScript). ووفقاً لهذه المدرسة الأقدم في التفكير، كان الهدف كتابة CSS وHTML وJavaScript في ملفاتها المنفصلة.</p>
<p>فلسفة React في الواقع هي النقيض التام لهذا. ولأن فصل CSS وHTML وJavaScript في ملفات منفصلة لم يبدُ قابلاً للتوسع جيداً في التطبيقات الأكبر، يبني React تقسيم التطبيق على أساس كياناته الوظيفية المنطقية.</p>
<p>الوحدات البنيوية التي تتكوّن منها الكيانات الوظيفية للتطبيق هي مكوّنات React. يعرّف مكوّن React الـHTML اللازم لهيكلة المحتوى، ودوال JavaScript اللازمة لتحديد الوظائف، وكذلك أنماط المكوّن؛ كل ذلك في مكان واحد. والهدف من ذلك إنشاء مكوّنات فردية مستقلة وقابلة لإعادة الاستخدام قدر الإمكان.</p>
<p>يمكن العثور على شيفرة النسخة النهائية لتطبيقنا في الفرع <i>part2-8</i> على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-8">GitHub</a>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-216-217">تمارين 2.16.-2.17.</h3>
<h4 id="216-دليل-الهاتف-الخطوة-11">2.16: دليل الهاتف الخطوة 11</h4>
<p>استخدم مثال <a href="/part2/adding_styles_to_react_app#improved-error-message">رسالة الخطأ المحسّنة</a> من الجزء 2 كدليل لعرض إشعار يستمر بضع ثوانٍ بعد تنفيذ عملية ناجحة (إضافة شخص أو تغيير رقم):</p>
<p><img src="/images/content/2/27e.webp" alt="لقطة شاشة لإضافة ناجحة باللون الأخضر"></p>
<h4 id="217-دليل-الهاتف-الخطوة-12">2.17*: دليل الهاتف الخطوة 12</h4>
<p>افتح تطبيقك في متصفحين. <strong>إذا حذفت شخصاً في المتصفح 1</strong> قبل فترة وجيزة من محاولة <i>تغيير رقم هاتف الشخص</i> في المتصفح 2، فستحصل على رسائل الخطأ التالية:</p>
<p><img src="/images/content/2/29b.webp" alt="رسالة خطأ 404 not found عند التغيير من متصفحات متعددة"></p>
<p>أصلح المشكلة وفقاً للمثال المعروض في <a href="/part2/altering_data_in_server#promises-and-errors">الوعود والأخطاء</a> في الجزء 2. عدّل المثال بحيث تُعرض للمستخدم رسالة عندما لا تنجح العملية. يجب أن تبدو الرسائل المعروضة للأحداث الناجحة وغير الناجحة مختلفة:</p>
<p><img src="/images/content/2/28e.webp" alt="رسالة الخطأ تُعرض على الشاشة بدلاً من وحدة التحكم"></p>
<p><strong>ملاحظة</strong> أنه حتى لو تعاملت مع الاستثناء، فستظل رسالة الخطأ الأولى &quot;404&quot; تُطبع في وحدة التحكم. لكن يجب ألا ترى &quot;Uncaught (in promise) Error&quot;.</p>
</div>
<div class="content">
<h3 id="بضع-ملاحظات-مهمة">بضع ملاحظات مهمة</h3>
<p>في نهاية هذا الجزء هناك بضعة تمارين أكثر تحدياً. في هذه المرحلة، يمكنك تخطي التمارين إذا كانت مرهقة أكثر من اللازم، وسنعود إلى الموضوعات نفسها لاحقاً. وتستحق المادة القراءة في كل الأحوال.</p>
<p>فعلنا شيئاً واحداً في تطبيقنا يخفي مصدراً نموذجياً جداً للأخطاء.</p>
<p>عيّنّا الحالة <em>notes</em> بقيمة أولية هي مصفوفة فارغة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([])

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>هذه قيمة أولية طبيعية جداً لأن الملاحظات مجموعة، أي أن هناك ملاحظات كثيرة ستخزّنها الحالة.</p>
<p>لو كانت الحالة تخزّن &quot;شيئاً واحداً&quot; فقط، لكانت القيمة الأولية الأنسب هي <em>null</em> للدلالة على أنه <i>لا يوجد شيء</i> في الحالة في البداية. لنرَ ما يحدث إذا استخدمنا هذه القيمة الأولية:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>) <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>ينهار التطبيق:</p>
<p><img src="/images/content/2/31a.webp" alt="خطأ نوعي في وحدة التحكم: لا يمكن قراءة خصائص null عبر map من App"></p>
<p>تعطي رسالة الخطأ سبب الخطأ وموقعه. الشيفرة التي تسبّبت في المشكلات هي التالية:</p>
<pre><code class="language-js">  <span class="hljs-comment">// تحصل notesToShow على قيمة notes</span>
  <span class="hljs-keyword">const</span> notesToShow = showAll
    ? notes
    : notes.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> note.<span class="hljs-property">important</span>)

  <span class="hljs-comment">// ...</span>

  {notesToShow.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span>  <span class="hljs-comment">// highlight-line</span>
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Note</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{note.id}</span> <span class="hljs-attr">note</span>=<span class="hljs-string">{note}</span> /&gt;</span></span>
  )}
</code></pre>
<p>رسالة الخطأ هي</p>
<pre><code class="language-bash">Cannot <span class="hljs-built_in">read</span> properties of null (reading <span class="hljs-string">&#x27;map&#x27;</span>)
</code></pre>
<p>يُسند إلى المتغير <em>notesToShow</em> أولاً قيمة الحالة <em>notes</em> ثم تحاول الشيفرة استدعاء الدالة <em>map</em> على كائن غير موجود، أي على <em>null</em>.</p>
<p>ما السبب في ذلك؟</p>
<p>يستخدم خطاف التأثير الدالة <em>setNotes</em> لتعيين <em>notes</em> إلى الملاحظات التي تعيدها الواجهة الخلفية:</p>
<pre><code class="language-js">  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService
      .<span class="hljs-title function_">getAll</span>()
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(initialNotes)  <span class="hljs-comment">// highlight-line</span>
      })
  }, [])
</code></pre>
<p>لكن المشكلة أن التأثير لا يُنفَّذ إلا <i>بعد العرض الأول</i>.
ولأن قيمة <em>notes</em> الأولية هي null:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>) <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-comment">// ...</span>
</code></pre>
<p>ففي العرض الأول تُنفَّذ الشيفرة التالية:</p>
<pre><code class="language-js">notesToShow = notes

<span class="hljs-comment">// ...</span>

notesToShow.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> ...)
</code></pre>
<p>وهذا يفجّر التطبيق لأننا لا نستطيع استدعاء الدالة <em>map</em> على القيمة <em>null</em>.</p>
<p>عندما نعيّن <em>notes</em> لتكون في البداية مصفوفة فارغة، لا يحدث خطأ لأنه يُسمح باستدعاء <em>map</em> على مصفوفة فارغة.</p>
<p>إذن، فقد &quot;أخفت&quot; تهيئة الحالة المشكلة الناتجة عن أن البيانات لم تُجلب بعد من الواجهة الخلفية.</p>
<p>طريقة أخرى للتحايل على المشكلة هي استخدام <i>العرض الشرطي</i> وإرجاع null إذا لم تكن حالة المكوّن مهيّأة بشكل صحيح:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>) <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-comment">// ... </span>

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService
      .<span class="hljs-title function_">getAll</span>()
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(initialNotes)
      })
  }, [])

  <span class="hljs-comment">// لا تعرض أي شيء إذا كانت notes ما زالت null</span>
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">if</span> (!notes) { 
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span> 
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-comment">// ...</span>
} 
</code></pre>
<p>إذن في العرض الأول لا يُعرض شيء. وعندما تصل الملاحظات من الواجهة الخلفية، استخدم التأثير الدالة <em>setNotes</em> لتعيين قيمة الحالة <em>notes</em>. وهذا يؤدي إلى إعادة عرض المكوّن، وفي العرض الثاني تُعرض الملاحظات على الشاشة.</p>
<p>الطريقة القائمة على العرض الشرطي مناسبة في الحالات التي يستحيل فيها تعريف الحالة بحيث يكون العرض الأول ممكناً.</p>
<p>الأمر الآخر الذي ما زلنا بحاجة إلى إلقاء نظرة أدق عليه هو المعامل الثاني لـuseEffect:</p>
<pre><code class="language-js">  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService
      .<span class="hljs-title function_">getAll</span>()
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
        <span class="hljs-title function_">setNotes</span>(initialNotes)  
      })
  }, []) <span class="hljs-comment">// highlight-line</span>
</code></pre>
<p>يُستخدم المعامل الثاني لـ<em>useEffect</em> <a href="https://react.dev/reference/react/useEffect#parameters">لتحديد عدد مرات تنفيذ التأثير</a>. والمبدأ هو أن التأثير يُنفَّذ دائماً بعد العرض الأول للمكوّن <i>و</i>عندما تتغيّر قيمة المعامل الثاني.</p>
<p>إذا كان المعامل الثاني مصفوفة فارغة <em>[]</em>، فلن يتغيّر محتواها أبداً ولن يُنفَّذ التأثير إلا بعد العرض الأول للمكوّن. وهذا بالضبط ما نريده عندما نهيّئ حالة التطبيق من الخادم.</p>
<p>ومع ذلك، هناك حالات نريد فيها تنفيذ التأثير في أوقات أخرى، مثل عندما تتغيّر حالة المكوّن بطريقة معينة.</p>
<p>تأمّل التطبيق البسيط التالي للاستعلام عن أسعار صرف العملات من <a href="https://www.exchangerate-api.com/">واجهة أسعار الصرف</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [value, setValue] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [rates, setRates] = <span class="hljs-title function_">useState</span>({})
  <span class="hljs-keyword">const</span> [currency, setCurrency] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect run, currency is now&#x27;</span>, currency)

    <span class="hljs-comment">// تخطَّ إذا لم تكن العملة معرّفة</span>
    <span class="hljs-keyword">if</span> (currency) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;fetching exchange rates...&#x27;</span>)
      axios
        .<span class="hljs-title function_">get</span>(<span class="hljs-string">\`https://open.er-api.com/v6/latest/<span class="hljs-subst">\${currency}</span>\`</span>)
        .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
          <span class="hljs-title function_">setRates</span>(response.<span class="hljs-property">data</span>.<span class="hljs-property">rates</span>)
        })
    }
  }, [currency])

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleChange</span> = (<span class="hljs-params">event</span>) =&gt; {
    <span class="hljs-title function_">setValue</span>(event.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">onSearch</span> = (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-title function_">setCurrency</span>(value)
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{onSearch}</span>&gt;</span>
        currency: <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">value</span>=<span class="hljs-string">{value}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{handleChange}</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>exchange rate<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">pre</span>&gt;</span>
        {JSON.stringify(rates, null, 2)}
      <span class="hljs-tag">&lt;/<span class="hljs-name">pre</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>
</code></pre>
<p>تحتوي واجهة مستخدم التطبيق على نموذج يُكتب في حقل إدخاله اسم العملة المطلوبة. وإذا كانت العملة موجودة، يعرض التطبيق أسعار صرفها مقابل العملات الأخرى:</p>
<p><img src="/images/content/2/32new.webp" alt="المتصفح يعرض أسعار صرف العملات مع كتابة eur ووحدة التحكم تقول fetching exchange rates"></p>
<p>يعيّن التطبيق اسم العملة المُدخَل في النموذج إلى الحالة <em>currency</em> في لحظة الضغط على الزر.</p>
<p>وعندما تحصل <em>currency</em> على قيمة جديدة، يجلب التطبيق أسعار صرفها من الـAPI في دالة التأثير:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> [currency, setCurrency] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>)

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;effect run, currency is now&#x27;</span>, currency)

    <span class="hljs-comment">// تخطَّ إذا لم تكن العملة معرّفة</span>
    <span class="hljs-keyword">if</span> (currency) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;fetching exchange rates...&#x27;</span>)
      axios
        .<span class="hljs-title function_">get</span>(<span class="hljs-string">\`https://open.er-api.com/v6/latest/<span class="hljs-subst">\${currency}</span>\`</span>)
        .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
          <span class="hljs-title function_">setRates</span>(response.<span class="hljs-property">data</span>.<span class="hljs-property">rates</span>)
        })
    }
  }, [currency]) <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>أصبح لخطاف useEffect الآن <em>[currency]</em> كمعامل ثانٍ. لذلك تُنفَّذ دالة التأثير بعد العرض الأول، و<i>دائماً</i> عندما تتغيّر مصفوفة الاعتماديات <em>[currency]</em> بوصفها معامله الثاني. أي أنه عندما تحصل الحالة <em>currency</em> على قيمة جديدة، يتغيّر محتوى مصفوفة الاعتماديات وتُنفَّذ دالة التأثير.</p>
<p>من الطبيعي اختيار <em>null</em> كقيمة أولية للمتغير <em>currency</em>، لأن <em>currency</em> يمثل عنصراً واحداً. وتشير القيمة الأولية <em>null</em> إلى أنه لا يوجد شيء في الحالة بعد، كما يسهل التحقق بجملة if بسيطة مما إذا كانت قيمة قد أُسندت إلى المتغير. وللتأثير الشرط التالي</p>
<pre><code class="language-js"><span class="hljs-keyword">if</span> (currency) { 
  <span class="hljs-comment">// تُجلب أسعار الصرف</span>
}
</code></pre>
<p>وهو ما يمنع طلب أسعار الصرف مباشرة بعد العرض الأول عندما لا يزال المتغير <em>currency</em> يحمل القيمة الأولية، أي قيمة <em>null</em>.</p>
<p>فإذا كتب المستخدم مثلاً <i>eur</i> في حقل البحث، يستخدم التطبيق Axios لتنفيذ طلب HTTP GET إلى العنوان <a href="https://open.er-api.com/v6/latest/eur">https://open.er-api.com/v6/latest/eur</a> ويخزّن الاستجابة في حالة <em>rates</em>.</p>
<p>وعندما يُدخل المستخدم بعد ذلك قيمة أخرى في حقل البحث، مثلاً <i>usd</i>، تُنفَّذ دالة التأثير مرة أخرى وتُطلب أسعار صرف العملة الجديدة من الـAPI.</p>
<p>قد تبدو الطريقة المعروضة هنا لتنفيذ طلبات API غريبة بعض الشيء.
كان يمكن بناء هذا التطبيق تحديداً دون استخدام useEffect إطلاقاً، بتنفيذ طلبات API مباشرة في دالة معالج إرسال النموذج:</p>
<pre><code class="language-js">  <span class="hljs-keyword">const</span> <span class="hljs-title function_">onSearch</span> = (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    axios
      .<span class="hljs-title function_">get</span>(<span class="hljs-string">\`https://open.er-api.com/v6/latest/<span class="hljs-subst">\${value}</span>\`</span>)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">response</span> =&gt;</span> {
        <span class="hljs-title function_">setRates</span>(response.<span class="hljs-property">data</span>.<span class="hljs-property">rates</span>)
      })
  }
</code></pre>
<p>ومع ذلك، هناك حالات لا تنجح فيها تلك التقنية. فعلى سبيل المثال، <i>قد</i> تصادف إحدى هذه الحالات في التمرين 2.20 حيث قد يوفّر استخدام useEffect حلاً. لاحظ أن هذا يعتمد إلى حد كبير على النهج الذي اخترته، فمثلاً لا يستخدم الحل النموذجي هذه الحيلة.</p>
</div>
<div class="tasks">
<h3 id="تمارين-218-220">تمارين 2.18.-2.20.</h3>
<h4 id="218-بيانات-الدول-الخطوة-1">2.18* بيانات الدول، الخطوة 1</h4>
<p>على <a href="https://studies.cs.helsinki.fi/restcountries/">https://studies.cs.helsinki.fi/restcountries/</a> يمكنك العثور على خدمة تقدّم الكثير من المعلومات المتعلقة بمختلف الدول بصيغة تُسمى قابلة للقراءة آلياً عبر REST API. اصنع تطبيقاً يتيح لك عرض معلومات من دول مختلفة.</p>
<p>واجهة المستخدم بسيطة جداً. تُعثر على الدولة المطلوب عرضها بكتابة استعلام بحث في حقل البحث.</p>
<p>إذا كانت هناك دول كثيرة جداً (أكثر من 10) تطابق الاستعلام، فيُطلب من المستخدم جعل استعلامه أكثر تحديداً:</p>
<p><img src="/images/content/2/19b1.webp" alt="لقطة شاشة: نتائج مطابقة كثيرة جداً"></p>
<p>إذا كانت هناك عشر دول أو أقل، ولكن أكثر من واحدة، فتُعرض جميع الدول المطابقة للاستعلام:</p>
<p><img src="/images/content/2/19b2.webp" alt="لقطة شاشة للدول المطابقة في قائمة"></p>
<p>وعندما تكون هناك دولة واحدة فقط مطابقة للاستعلام، تُعرض البيانات الأساسية للدولة (مثل العاصمة والمساحة) وعلمها واللغات المتحدث بها:</p>
<p><img src="/images/content/2/19c3.webp" alt="لقطة شاشة للعلم والخصائص الإضافية"></p>
<p><strong>ملاحظة</strong>: يكفي أن يعمل تطبيقك مع معظم الدول. قد يكون دعم بعض الدول، مثل <i>السودان</i>، صعباً لأن اسم الدولة جزء من اسم دولة أخرى، <i>جنوب السودان</i>. لا تحتاج إلى القلق بشأن هذه الحالات الحدّية.</p>
<h4 id="219-بيانات-الدول-الخطوة-2">2.19*: بيانات الدول، الخطوة 2</h4>
<p><strong>لا يزال هناك الكثير لفعله في هذا الجزء، فلا تعلق في هذا التمرين!</strong></p>
<p>حسّن التطبيق من التمرين السابق بحيث تكون هناك، عندما تُعرض أسماء عدة دول على الصفحة، أزرار بجانب اسم كل دولة تُظهر عند الضغط عليها الواجهة الخاصة بتلك الدولة:</p>
<p><img src="/images/content/2/19b4.webp" alt="إضافة أزرار عرض لكل دولة"></p>
<p>في هذا التمرين أيضاً، يكفي أن يعمل تطبيقك مع معظم الدول. ويمكن تجاهل الدول التي يظهر اسمها داخل اسم دولة أخرى، مثل <i>السودان</i>.</p>
<h4 id="220-بيانات-الدول-الخطوة-3">2.20*: بيانات الدول، الخطوة 3</h4>
<p>أضف إلى الواجهة التي تعرض بيانات دولة واحدة تقرير الطقس الخاص بعاصمة تلك الدولة. هناك عشرات مزوّدي بيانات الطقس. أحد الـAPIs المقترحة هو <a href="https://openweathermap.org">https://openweathermap.org</a>. لاحظ أنه قد يستغرق الأمر بضع دقائق حتى يصبح مفتاح API المُولَّد صالحاً.</p>
<p><img src="/images/content/2/19x.webp" alt="إضافة تقرير الطقس"></p>
<p>إذا استخدمت Open weather map، ف<a href="https://openweathermap.org/weather-conditions#Icon-list">هنا</a> وصف لكيفية الحصول على أيقونات الطقس.</p>
<p><strong>ملاحظة:</strong> في بعض المتصفحات (مثل Firefox) قد يرسل الـAPI المختار استجابة خطأ تشير إلى أن تشفير HTTPS غير مدعوم، رغم أن رابط الطلب يبدأ بـ_http://_. يمكن إصلاح هذه المشكلة بإكمال التمرين باستخدام Chrome.</p>
<p><strong>ملاحظة:</strong> تحتاج إلى مفتاح api-key لاستخدام أي خدمة طقس تقريباً. لا تحفظ مفتاح api-key في نظام التحكم بالإصدارات! ولا تكتبه مباشرة في شيفرتك المصدرية. بدلاً من ذلك استخدم <a href="https://vitejs.dev/guide/env-and-mode.html">متغير بيئة</a> لحفظ المفتاح في هذا التمرين. في التطبيقات الواقعية، يُعتبر إرسال هذه المفاتيح مباشرة من المتصفح غير آمن، لأن أي شخص يستطيع فتح وحدة تحكم المطوّر سيتمكن من اعتراض مفاتيحك! سنركز على تنفيذ واجهة خلفية منفصلة في الجزء التالي من الدورة.</p>
<p>بافتراض أن مفتاح api-key هو <i>54l41n3n4v41m34rv0</i>، فعند بدء التطبيق هكذا:</p>
<pre><code class="language-bash"><span class="hljs-built_in">export</span> VITE_SOME_KEY=54l41n3n4v41m34rv0 &amp;&amp; npm run dev // لنظام Linux/macOS Bash
(<span class="hljs-variable">$env</span>:VITE_SOME_KEY=<span class="hljs-string">&quot;54l41n3n4v41m34rv0&quot;</span>) -and (npm run dev) // لنظام Windows PowerShell
<span class="hljs-built_in">set</span> <span class="hljs-string">&quot;VITE_SOME_KEY=54l41n3n4v41m34rv0&quot;</span> &amp;&amp; npm run dev // لنظام Windows cmd.exe
</code></pre>
<p>يمكنك الوصول إلى قيمة المفتاح من الكائن <em>import.meta.env</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> api_key = <span class="hljs-keyword">import</span>.<span class="hljs-property">meta</span>.<span class="hljs-property">env</span>.<span class="hljs-property">VITE_SOME_KEY</span>
<span class="hljs-comment">// المتغير api_key يحمل الآن القيمة المعيّنة عند بدء التشغيل</span>
</code></pre>
<p><strong>ملاحظة:</strong> لمنع تسريب متغيرات البيئة إلى العميل عن طريق الخطأ، لا يُعرَض لـVite إلا المتغيرات المسبوقة بـVITE_.</p>
<p>وتذكّر أيضاً أنه إذا أجريت تغييرات على متغيرات البيئة، فستحتاج إلى إعادة تشغيل خادم التطوير حتى تسري التغييرات.</p>
<p>كان هذا آخر تمرين في هذا الجزء من الدورة. حان وقت رفع شيفرتك إلى GitHub وتعليم جميع تمارينك المنجزة في <a href="https://studies.cs.helsinki.fi/stats/courses/fullstackopen">نظام تسليم التمارين</a>.</p>
</div>
`,o={part:2,letter:"e",file:s,title:n,slug:a,mainImage:p,headings:l,html:t};export{o as default,s as file,l as headings,t as html,c as letter,p as mainImage,e as part,a as slug,n as title};
