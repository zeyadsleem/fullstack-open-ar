const e=5,c="e",s="part5e.md",a="React Router ومكتبات الواجهات",n="react_router_ui_frameworks",l="/images/part-5.svg",t=[{depth:3,id:"react-router",text:"React Router"},{depth:3,id:"مسار-بمعامل",text:"مسار بمعامل"},{depth:3,id:"usenavigate",text:"useNavigate"},{depth:3,id:"إعادة-النظر-في-المسار-بمعامل",text:"إعادة النظر في المسار بمعامل"},{depth:3,id:"تمارين-524528",text:"تمارين 5.24–5.28."},{depth:3,id:"مكتبات-الواجهات",text:"مكتبات الواجهات"},{depth:3,id:"مكونات-styled-components",text:"مكوّنات styled-components"},{depth:3,id:"تمارين-529531",text:"تمارين 5.29–5.31"}],p=`<div class="content">
<p>واجهة مستخدم تطبيقنا بسيطة إلى حد كبير حالياً:</p>
<p><img src="/images/content/5/u1.webp" alt=""></p>
<p>نريد تغيير ذلك. لنبدأ ببنية التنقّل في التطبيق.</p>
<p>من الشائع جداً أن تحتوي تطبيقات الويب على شريط تنقّل يتيح للمستخدمين التبديل بين عروض مختلفة داخل التطبيق. يمكن أن يتضمّن تطبيق تدوين الملاحظات لدينا صفحة رئيسية:</p>
<p><img src="/images/content/5/u6.webp" alt=""></p>
<p>وصفحة منفصلة لعرض الملاحظات:</p>
<p><img src="/images/content/5/u7.webp" alt=""></p>
<p>وكذلك صفحة لإنشاء الملاحظات:</p>
<p><img src="/images/content/5/u8.webp" alt=""></p>
<p>في <a href="/part0/fundamentals_of_web_apps#traditional-web-applications">تطبيق ويب من الطراز القديم</a>، كان التبديل بين الصفحات التي يعرضها التطبيق يتضمّن إرسال المتصفح طلب HTTP GET جديد إلى الخادم، ثم عرض شيفرة HTML التي يعيدها الخادم، والتي تقابل العرض الجديد.</p>
<p>أما في تطبيقات الصفحة الواحدة، فأنت في الواقع على الصفحة نفسها طوال الوقت، وشيفرة JavaScript المنفَّذة في المتصفح تخلق وهم «صفحات» مختلفة. وإذا أُجريت طلبات HTTP عند تغيير العرض، فهي تُستخدم فقط لجلب بيانات بصيغة JSON قد تكون مطلوبة لعرض العرض الجديد.</p>
<p>سيكون من السهل تنفيذ تطبيق يحتوي على شريط تنقّل وعروض متعددة باستخدام React، مثلاً بأن تجعل حالة التطبيق <i>page</i> تتذكّر الصفحة التي يوجد فيها المستخدم، وتعرض العرض الصحيح بناءً على ذلك:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [page, setPage] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;home&#x27;</span>)

 <span class="hljs-keyword">const</span>  <span class="hljs-title function_">toPage</span> = (<span class="hljs-params">page</span>) =&gt; <span class="hljs-function">(<span class="hljs-params">event</span>) =&gt;</span> {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-title function_">setPage</span>(page)
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">content</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-keyword">if</span> (page === <span class="hljs-string">&#x27;home&#x27;</span>) {
      <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Home</span> /&gt;</span></span>
    } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (page === <span class="hljs-string">&#x27;notes&#x27;</span>) {
      <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Notes</span> /&gt;</span></span>
    } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (page === <span class="hljs-string">&#x27;users&#x27;</span>) {
      <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Users</span> /&gt;</span></span>
    }
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toPage(</span>&#x27;<span class="hljs-attr">home</span>&#x27;)} &gt;</span>
          home
        <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toPage(</span>&#x27;<span class="hljs-attr">notes</span>&#x27;)}&gt;</span>
          notes
        <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{toPage(</span>&#x27;<span class="hljs-attr">users</span>&#x27;)} &gt;</span>
          users
        <span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

      {content()}
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>لكن هذه الطريقة ليست مثالية: يبقى عنوان URL للموقع كما هو حتى عندما تكون في عرض مختلف. ينبغي أن يكون لكل عرض عنوان URL خاص به، حتى يتمكّن المستخدمون مثلاً من حفظ الصفحات في المفضلة. علاوة على ذلك، لا يعمل زر الرجوع في المتصفح بشكل منطقي إذا لم تكن للصفحات عناوين خاصة بها؛ أي أن النقر على زر الرجوع لا ينقلك إلى العرض الذي شاهدته سابقاً في التطبيق بل إلى مكان آخر تماماً.</p>
<h3 id="react-router">React Router</h3>
<p>لحسن الحظ، تقدّم مكتبة <a href="https://reactrouter.com/">React Router</a> حلاً ممتازاً لإدارة التنقّل في تطبيق React.</p>
<p>ثبّت React Router:</p>
<pre><code class="language-bash">npm install react-router-dom
</code></pre>
<p>أنشئ مكوّناً جديداً يعمل كصفحة رئيسية للتطبيق</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Home</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Home</span>
</code></pre>
<p>سنستخرج العرض الرئيسي السابق للتطبيق (الذي كان في المكوّن <i>App</i>) إلى مكوّن خاص به، لكن سننقل إدارة حالة الملاحظات خارج المكوّن:</p>
<pre><code class="language-js"><span class="hljs-comment">// قائمة الملاحظات تُمرَّر كمعامل</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteList</span> = (<span class="hljs-params">{ notes }</span>) =&gt; { <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-comment">// المحتوى مطابق تقريباً لما في مكوّن App</span>
  <span class="hljs-comment">// أُزيلت الإشارة إلى NoteForm</span>
}
</code></pre>
<p>يتغيّر المكوّن <i>App</i> الآن كما يلي</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> noteService <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./services/notes&#x27;</span>

<span class="hljs-keyword">import</span> {
  <span class="hljs-title class_">BrowserRouter</span> <span class="hljs-keyword">as</span> <span class="hljs-title class_">Router</span>,
  <span class="hljs-title class_">Routes</span>, <span class="hljs-title class_">Route</span>, <span class="hljs-title class_">Link</span>
} <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NoteList</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/NoteList&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Home</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Home&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Footer</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Footer&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">NoteForm</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/NoteForm&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([])

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    noteService.<span class="hljs-title function_">getAll</span>().<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">initialNotes</span> =&gt;</span> {
      <span class="hljs-title function_">setNotes</span>(initialNotes)
    })
  }, [])

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = noteObject =&gt; {
    noteService.<span class="hljs-title function_">create</span>(noteObject).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">returnedNote</span> =&gt;</span> {
      <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">concat</span>(returnedNote))
    })
  }

  <span class="hljs-keyword">const</span> padding = {
    <span class="hljs-attr">padding</span>: <span class="hljs-number">5</span>
  }

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// highlight-start</span>
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Router</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        // highlight-end  

    // highlight-start
      <span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}/</span>&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Footer</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Router</span>&gt;</span></span>
    <span class="hljs-comment">// highlight-end</span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>
</code></pre>
<p>يُفعَّل التوجيه، أي العرض الشرطي للمكوّنات بناءً على <i>URL</i> المتصفح، بوضع المكوّنات كأبناء لمكوّن <a href="https://reactrouter.com/api/declarative-routers/Router">Router</a>، أي داخل وسوم <i>Router</i>.</p>
<p>أولاً، يُعرَّف شريط تنقّل التطبيق باستخدام مكوّنات <a href="https://reactrouter.com/api/components/Link">Link</a>. تحدّد السمة <i>to</i> كيفية تغيّر عنوان URL في المتصفح عند النقر على الرابط:</p>
<pre><code class="language-js">&lt;div&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span></span>
&lt;/div&gt;
</code></pre>
<p>بعد ذلك، يُعرَّف توجيه التطبيق باستخدام مكوّن <a href="https://reactrouter.com/api/components/Routes">Routes</a>. وداخل المكوّن، نستخدم <a href="https://reactrouter.com/api/components/Route">Route</a> لتعريف مجموعة من القواعد والمكوّنات القابلة للعرض المقابلة لها:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Routes</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
    &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>
  } /&gt;</span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
    &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}/</span>&gt;</span>
  } /&gt;</span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;</span>
&lt;/<span class="hljs-title class_">Routes</span>&gt;
</code></pre>
<p>إذا كنت في عنوان URL الجذري للتطبيق، يُعرض المكوّن <i>Home</i>:</p>
<p><img src="/images/content/5/u2.webp" alt=""></p>
<p>عند النقر على «notes» في شريط التنقّل، يتغيّر العنوان في شريط عنوان المتصفح إلى <i>notes</i>، ويُعرض المكوّن <i>NoteList</i>:</p>
<p><img src="/images/content/5/u3.webp" alt=""></p>
<p>وبالمثل، عند النقر على «new note»، يصبح عنوان URL هو <i>create</i>، ويُعرض المكوّن <i>NoteForm</i>.</p>
<p>في صفحة ويب عادية، يؤدي تغيير العنوان في شريط عنوان المتصفح إلى إعادة تحميل الصفحة. لكن عند استخدام React Router، لا يحدث ذلك؛ بل يُدار التوجيه بالكامل عبر JavaScript في الواجهة الأمامية.</p>
<p>مكوّن Router الذي نستخدمه هو <a href="https://reactrouter.com/en/main/router-components/browser-router">BrowserRouter</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> {
  <span class="hljs-title class_">BrowserRouter</span> <span class="hljs-keyword">as</span> <span class="hljs-title class_">Router</span>, <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-title class_">Routes</span>, <span class="hljs-title class_">Route</span>, <span class="hljs-title class_">Link</span>
} <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>
</code></pre>
<p>وفقاً <a href="https://reactrouter.com/en/main/router-components/browser-router">للتوثيق</a></p>
<blockquote>
<p><i>BrowserRouter</i> هو <i>Router</i> يستخدم واجهة history في HTML5 (pushState وreplaceState وحدث popstate) لإبقاء واجهة المستخدم متزامنة مع عنوان URL.</p>
</blockquote>
<p>يستخدم <i>BrowserRouter</i> <a href="https://css-tricks.com/using-the-html5-history-api/">واجهة History في HTML5</a> للسماح باستخدام عنوان URL في شريط عنوان المتصفح في «التوجيه» الداخلي ضمن تطبيق React، بمعنى أنه حتى إذا تغيّر عنوان URL في شريط العنوان، فإن محتوى الصفحة يُعالَج عبر JavaScript فقط، ولا يحمّل المتصفح محتوى جديداً من الخادم. ومع ذلك، فإن سلوك المتصفح فيما يتعلق بوظيفتي الرجوع والتقدّم والحفظ في المفضلة يبقى بديهياً — فهو يعمل تماماً كما في المواقع التقليدية.</p>
<p>شيفرة التطبيق الحالية متاحة بالكامل على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10">GitHub</a>، في الفرع <i>part5-10</i>.</p>
<h3 id="مسار-بمعامل">مسار بمعامل</h3>
<p>لننقل تفاصيل ملاحظة واحدة إلى عرض خاص بها، يمكن الوصول إليه بالنقر على اسم الملاحظة:</p>
<p><img src="/images/content/5/u4.webp" alt=""></p>
<p>نُفِّذت قابلية النقر على الاسم في المكوّن <i>NoteList</i> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Link</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteList</span> = (<span class="hljs-params">{ notes }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">message</span>=<span class="hljs-string">{errorMessage}</span> /&gt;</span>

      {!user &amp;&amp; loginForm()}

      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShowAll(!showAll)}&gt;
          show {showAll ? &#x27;important&#x27; : &#x27;all&#x27;}
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>
        {notesToShow.map(note =&gt; (
          <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{note.id}</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">{</span>\`/<span class="hljs-attr">notes</span>/\${<span class="hljs-attr">note.id</span>}\`}&gt;</span>{note.content}<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span> // highlight-line
          <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        ))}
      <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NoteList</span>
</code></pre>
<p>إذن، يُستخدم <a href="https://reactrouter.com/api/components/Link">Link</a> مرة أخرى. مثلاً، النقر على اسم ملاحظة معرّفها <i>id</i> هو 12345 يؤدي إلى تحديث عنوان URL في المتصفح إلى <i>notes/12345</i>.</p>
<p>يُعرَّف عنوان URL ذو المعامل في التوجيه داخل المكوّن <i>App</i> كما يلي:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Router</span>&gt;
  <span class="hljs-comment">// ...</span>

  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
    // highlight-start
    <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes/:id&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
      &lt;<span class="hljs-attr">Note</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> <span class="hljs-attr">toggleImportanceOf</span>=<span class="hljs-string">{toggleImportanceOf}</span> /&gt;</span>
     } /&gt;
    // highlight-end
    <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Notes</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>} /&gt;   
    <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/users&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{user</span> ? &lt;<span class="hljs-attr">Users</span> /&gt;</span> : <span class="hljs-tag">&lt;<span class="hljs-name">Navigate</span> <span class="hljs-attr">replace</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/login&quot;</span> /&gt;</span>} /&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/login&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Login</span> <span class="hljs-attr">onLogin</span>=<span class="hljs-string">{login}</span> /&gt;</span>} /&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;      
  <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span></span>
&lt;/<span class="hljs-title class_">Router</span>&gt;
</code></pre>
<p>المسار الذي يعرض واجهة ملاحظة واحدة يُعرَّف بأسلوب «Express» عبر وسم معامل المسار بالترميز <i>:id</i> كما يلي:</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Route</span> path=<span class="hljs-string">&quot;/notes/:id&quot;</span> element={<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Note</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> <span class="hljs-attr">...</span> /&gt;</span></span>} /&gt;
</code></pre>
<p>عندما ينتقل المتصفح إلى عنوان URL الفريد لملاحظة، مثل <i>/notes/12345</i>، يُعرض المكوّن <i>Note</i>، الذي اضطررنا الآن إلى تعديله قليلاً:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useParams } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ notes, toggleImportance }</span>) =&gt; {
  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> id = <span class="hljs-title function_">useParams</span>().<span class="hljs-property">id</span>
  <span class="hljs-keyword">const</span> note = notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> === id)
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">const</span> label = note.<span class="hljs-property">important</span> ? <span class="hljs-string">&#x27;make not important&#x27;</span> : <span class="hljs-string">&#x27;make important&#x27;</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;note&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">span</span>&gt;</span>{note.content}<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> toggleImportance(id)}&gt;{label}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Note</span>
</code></pre>
<p>خلافاً لما كان عليه الحال سابقاً، يتلقّى المكوّن <i>Note</i> الآن <i>كل الملاحظات</i> عبر prop المسمّى <i>notes</i>، ويمكنه الوصول إلى الجزء الفريد من عنوان URL، وتحديداً <i>id</i> الملاحظة المراد عرضها، باستخدام دالة React Router المسماة <a href="https://reactrouter.com/api/hooks/useParams">useParams</a>.</p>
<h3 id="usenavigate">useNavigate</h3>
<p>تدعم الواجهة الخلفية بالفعل حذف الملاحظات. لتنفيذ ذلك، لنضف زراً إلى صفحة الملاحظة الفردية في التطبيق:</p>
<p><img src="/images/content/5/u5.webp" alt=""></p>
<p>لنضف معالجاً إلى المكوّن <i>App</i> ينفّذ الحذف، ونمرّره إلى المكوّن <i>Note</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {

  <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">deleteNote</span> = (<span class="hljs-params">id</span>) =&gt; {
    noteService.<span class="hljs-title function_">remove</span>(id).<span class="hljs-title function_">then</span>(<span class="hljs-function">() =&gt;</span> {
      <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> !== id))
    })
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
      <span class="hljs-comment">// ...</span>

      <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes/:id&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">Note</span> 
            <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span>
            <span class="hljs-attr">toggleImportanceOf</span>=<span class="hljs-string">{toggleImportanceOf}</span>
            <span class="hljs-attr">deleteNote</span>=<span class="hljs-string">{deleteNote}</span> // <span class="hljs-attr">highlight-line</span>
          /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}/</span>&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span></span>

      <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Footer</span> /&gt;</span></span>
    &lt;/<span class="hljs-title class_">Router</span>&gt;
  )
}  
</code></pre>
<p>يتغيّر المكوّن <i>Note</i> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useParams, useNavigate } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ notes, toggleImportanceOf, deleteNote }</span>) =&gt; { <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> id = <span class="hljs-title function_">useParams</span>().<span class="hljs-property">id</span>
  <span class="hljs-keyword">const</span> navigate = <span class="hljs-title function_">useNavigate</span>()  <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> note = notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> === id)

  <span class="hljs-keyword">const</span> label = note.<span class="hljs-property">important</span> ? <span class="hljs-string">&#x27;make not important&#x27;</span> : <span class="hljs-string">&#x27;make important&#x27;</span>

<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleDelete</span> = (<span class="hljs-params"></span>) =&gt; {
    <span class="hljs-keyword">if</span> (<span class="hljs-variable language_">window</span>.<span class="hljs-title function_">confirm</span>(<span class="hljs-string">\`Delete note &quot;<span class="hljs-subst">\${note.content}</span>&quot;?\`</span>)) {
      <span class="hljs-title function_">deleteNote</span>(id)
      <span class="hljs-title function_">navigate</span>(<span class="hljs-string">&#x27;/notes&#x27;</span>)
    }
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;note&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">span</span>&gt;</span>{note.content}<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> toggleImportanceOf(id)}&gt;{label}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{handleDelete}</span>&gt;</span>delete<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>  // highlight-line
    <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Note</span>
</code></pre>
<p>عند حذف ملاحظة، يُعاد توجيه المستخدم إلى الصفحة التي تسرد كل الملاحظات. ويتم ذلك باستدعاء الدالة التي يعيدها <a href="https://reactrouter.com/api/components/Navigate">useNavigate</a> من React Router مع عنوان URL المطلوب: <i>navigate('/notes')</i>.</p>
<p>الدالتان <a href="https://reactrouter.com/api/hooks/useParams">useParams</a> و<a href="https://reactrouter.com/api/components/Navigate">useNavigate</a> من مكتبة React Router هما دالتا خطاف، تماماً مثل useState وuseEffect اللتين استخدمناهما مرات عديدة. وكما نتذكّر من الجزء 1، هناك <a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks">قواعد</a> معيّنة مرتبطة باستخدام دوال الخطافات.</p>
<p>لنعدّل أيضاً المكوّن <i>NoteForm</i> بحيث يُوجَّه المستخدم، بعد إضافة ملاحظة جديدة، إلى الصفحة التي تحتوي على كل الملاحظات:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span> 
<span class="hljs-keyword">import</span> { useNavigate } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span> <span class="hljs-comment">// highlight-line</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteForm</span> = (<span class="hljs-params">{ createNote }</span>) =&gt; {
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> navigate = <span class="hljs-title function_">useNavigate</span>() <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = event =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-title function_">createNote</span>({
      <span class="hljs-attr">content</span>: newNote,
      <span class="hljs-attr">important</span>: <span class="hljs-literal">true</span>
    })

    <span class="hljs-title function_">navigate</span>(<span class="hljs-string">&#x27;/notes&#x27;</span>) <span class="hljs-comment">// highlight-line</span>
    <span class="hljs-title function_">setNewNote</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Create a new note<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span>
          <span class="hljs-attr">value</span>=<span class="hljs-string">{newNote}</span>
          <span class="hljs-attr">onChange</span>=<span class="hljs-string">{event</span> =&gt;</span> setNewNote(event.target.value)}
          placeholder=&quot;write note content here&quot;
        /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>save<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<h3 id="إعادة-النظر-في-المسار-بمعامل">إعادة النظر في المسار بمعامل</h3>
<p>هناك مشكلة مزعجة قليلاً في التطبيق. يتلقّى المكوّن <em>Note</em> <i>كل الملاحظات</i> كـ props، رغم أنه لا يعرض سوى الملاحظة التي يطابق <i>id</i> الخاص بها الجزء ذا المعامل من عنوان URL:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ notes, toggleImportance }</span>) =&gt; { 
  <span class="hljs-keyword">const</span> id = <span class="hljs-title function_">useParams</span>().<span class="hljs-property">id</span>
  <span class="hljs-keyword">const</span> note = notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">n</span> =&gt;</span> n.<span class="hljs-property">id</span> === <span class="hljs-title class_">Number</span>(id))
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>هل يمكن تعديل التطبيق بحيث يتلقّى <em>Note</em> الملاحظة المراد عرضها فقط كـ prop:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useParams, useNavigate } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ note, id, toggleImportanceOf, deleteNote }</span>) =&gt; {  <span class="hljs-comment">// highlight-line</span>
  <span class="hljs-keyword">const</span> id = <span class="hljs-title function_">useParams</span>().<span class="hljs-property">id</span>
  <span class="hljs-keyword">const</span> navigate = <span class="hljs-title function_">useNavigate</span>()

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;note&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">span</span>&gt;</span>{note.content}<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> toggleImportanceOf(id)}&gt;{label}<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{handleDelete}</span>&gt;</span>delete<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Note</span>
</code></pre>
<p>إحدى الطرق هي تحديد <i>id</i> الملاحظة المراد عرضها داخل المكوّن باستخدام دالة الخطاف <a href="https://reactrouter.com/api/hooks/useMatch">useMatch</a> من React Router.</p>
<p>لا يمكن استخدام خطاف <i>useMatch</i> في المكوّن نفسه الذي يعرّف الجزء القابل للتوجيه من التطبيق. لننقل مكوّن <i>Router</i> خارج <i>App</i>:</p>
<pre><code class="language-js"><span class="hljs-title class_">ReactDOM</span>.<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>)).<span class="hljs-title function_">render</span>(
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Router</span>&gt;</span> // highlight-line
    <span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">Router</span>&gt;</span></span> <span class="hljs-comment">// highlight-line</span>
)
</code></pre>
<p>يصبح المكوّن <i>App</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> {
  <span class="hljs-comment">// ...</span>
  useMatch  <span class="hljs-comment">// highlight-line</span>
} <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-dom&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

 <span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">const</span> match = <span class="hljs-title function_">useMatch</span>(<span class="hljs-string">&#x27;/notes/:id&#x27;</span>)

  <span class="hljs-keyword">const</span> note = match
    ? notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> note.<span class="hljs-property">id</span> === match.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>)
    : <span class="hljs-literal">null</span>
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        // ...
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes/:id&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">Note</span>
            <span class="hljs-attr">note</span>=<span class="hljs-string">{note}</span> // <span class="hljs-attr">highlight-line</span>
            <span class="hljs-attr">toggleImportanceOf</span>=<span class="hljs-string">{toggleImportanceOf}</span>
            <span class="hljs-attr">deleteNote</span>=<span class="hljs-string">{deleteNote}</span>
          /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}/</span>&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">em</span>&gt;</span>Note app, Department of Computer Science 2026<span class="hljs-tag">&lt;/<span class="hljs-name">em</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}    
</code></pre>
<p>في كل مرة يُعرض فيها المكوّن <i>App</i> (وهو ما يحدث عملياً كلما تغيّر عنوان URL في شريط عنوان المتصفح) يُنفَّذ الأمر التالي</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> match = <span class="hljs-title function_">useMatch</span>(<span class="hljs-string">&#x27;/notes/:id&#x27;</span>)
</code></pre>
<p>إذا كان عنوان URL بالصيغة <em>/notes/:id</em>، أي يقابل عنوان URL لملاحظة واحدة، تُسنَد إلى المتغيّر <i>match</i> قيمة كائن يمكن استخدامه لتحديد الجزء ذي المعامل من المسار، أي <i>id</i> الملاحظة. وهذا يتيح لنا استرجاع الملاحظة المراد عرضها:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> note = match 
  ? notes.<span class="hljs-title function_">find</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> note.<span class="hljs-property">id</span> === match.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>)
  : <span class="hljs-literal">null</span>
</code></pre>
<p>لا يزال هناك خطأ صغير في تطبيقنا. إذا أُعيد تحميل المتصفح في صفحة ملاحظة واحدة، يحدث خطأ:</p>
<p><img src="/images/content/5/u5.webp" alt=""></p>
<p>تنشأ المشكلة لأن الصفحة يُحاول عرضها قبل جلب الملاحظات من الواجهة الخلفية. يمكننا حل هذه المشكلة بالعرض الشرطي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">Note</span> = (<span class="hljs-params">{ note, toggleImportanceOf, deleteNote }</span>) =&gt; {
  <span class="hljs-keyword">const</span> id = <span class="hljs-title function_">useParams</span>().<span class="hljs-property">id</span>
  <span class="hljs-keyword">const</span> navigate = <span class="hljs-title function_">useNavigate</span>()

<span class="hljs-comment">// highlight-start</span>
  <span class="hljs-keyword">if</span>(!note) {
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
  }
  <span class="hljs-comment">// highlight-end</span>

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">//...</span>
  )
}
</code></pre>
<p>في التطبيق ميزة مزعجة أخرى: منطق تسجيل الدخول لا يزال كله في الصفحة التي تسرد الملاحظات. ومع ذلك، سنترك الوظيفة في هذه الحالة غير المكتملة نوعاً ما في الوقت الحالي.</p>
<p>شيفرة التطبيق الحالية متاحة بالكامل على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11">GitHub</a>، في الفرع <i>part5-11</i>.</p>
</div>
<div class="tasks">
<h3 id="تمارين-524528">تمارين 5.24–5.28.</h3>
<h4 id="524-مدونات-موجهة-الخطوة-1">5.24: مدوّنات موجّهة، الخطوة 1</h4>
<p>أضف React Router إلى تطبيق المدوّنات بحيث يتيح لك النقر على الروابط في شريط التنقّل التحكّم في العرض المعروض.</p>
<p>في جذر التطبيق، أي المسار <em>/</em>، تُعرض قائمة بكل المدوّنات:</p>
<p><img src="/images/content/5/l1.webp" alt=""></p>
<p>يتيح المسار <em>/login</em> للمستخدمين تسجيل الدخول</p>
<p><img src="/images/content/5/l2.webp" alt=""></p>
<p>إذا كان المستخدم مسجّلاً، يظهر زر تسجيل الخروج في شريط التنقّل:</p>
<p><img src="/images/content/5/l3.webp" alt=""></p>
<p>بعد تسجيل الدخول والخروج، ينبغي توجيه المستخدم إلى الصفحة التي تسرد كل المدوّنات.</p>
<p>في هذه المرحلة، لا تحتاج إلى القلق بشأن إنشاء المدوّنات بعد.</p>
<h4 id="525-مدونات-موجهة-الخطوة-2">5.25: مدوّنات موجّهة، الخطوة 2</h4>
<p>نفّذ عرضاً في التطبيق يعرض معلومات تدوينة واحدة:</p>
<p><img src="/images/content/5/l5.webp" alt=""></p>
<p>ينتقل المستخدمون إلى عرض التدوينة الواحدة من قائمة المدوّنات:</p>
<p><img src="/images/content/5/l4.webp" alt=""></p>
<p>تأكد من أن ميزة «الإعجاب» بالمدوّنات لا تزال تعمل! وعدّل الوظيفة أيضاً بحيث لا يستطيع إلا المستخدمون المسجّلون «الإعجاب» بتدوينة.</p>
<h4 id="526-مدونات-موجهة-الخطوة-3">5.26: مدوّنات موجّهة، الخطوة 3</h4>
<p>أنشئ عرضاً جديداً لإنشاء تدوينة جديدة، يمكن للمستخدمين المسجّلين الوصول إليه عبر شريط التنقّل:</p>
<p><img src="/images/content/5/l6.webp" alt=""></p>
<p>ينبغي أن تؤدي إضافة تدوينة جديدة وحذف تدوينة موجودة إلى إعادة توجيه المستخدم إلى عرض كل المدوّنات</p>
<h4 id="527-مدونات-موجهة-الخطوة-4">5.27: مدوّنات موجّهة، الخطوة 4</h4>
<p>أصبحت سهولة استخدام التطبيق ومظهره أفضل من قبل. لسوء الحظ، تعطّلت بعض الاختبارات.</p>
<p>عدّل الآن اختبارات عرض التدوينة الواحدة المكتوبة بـ Vitest كما يلي</p>
<ul>
<li>تُعرض معلومات التدوينة وعدد الإعجابات للمستخدمين غير المسجّلين، ولا تُعرض الأزرار</li>
<li>يُعرض للمستخدمين المسجّلين الذين ليسوا منشئي التدوينة زر الإعجاب فقط</li>
<li>يُعرض لمنشئ التدوينة أيضاً زر الحذف</li>
</ul>
<h4 id="528-مدونات-موجهة-الخطوة-5">5.28: مدوّنات موجّهة، الخطوة 5</h4>
<p>التالي هو إصلاح الاختبارات الشاملة من الطرف إلى الطرف المكتوبة بـ Playwright. الاختبارات التي كتبناها سابقاً معطّلة تماماً، وسنضطر إلى إجراء تغييرات كبيرة عليها.</p>
<p>أنشئ اختبارات للسيناريوهات التالية:</p>
<ul>
<li>ينجح تسجيل الدخول مع الجمع الصحيح لاسم المستخدم/كلمة المرور</li>
<li>يفشل تسجيل الدخول إذا كان اسم المستخدم/كلمة المرور غير صحيحين</li>
<li>يمكن للمستخدم المسجّل إنشاء تدوينة</li>
<li>يمكن للمستخدم المسجّل الإعجاب بالمدوّنات</li>
<li>يمكن للمستخدم المسجّل حذف تدوينة</li>
</ul>
<p>إذن، لا يتم اختبار ترتيب المدوّنات حسب الإعجابات في الوقت الحالي.</p>
</div>
<div class="content">
<h3 id="مكتبات-الواجهات">مكتبات الواجهات</h3>
<p>اطّلعنا في الجزء 2 على طريقتين لإضافة الأنماط: ملف <a href="/part2/adding_styles_to_react_app">CSS واحد</a> من الطراز القديم و<a href="/part2/adding_styles_to_react_app#inline-styles">الأنماط المضمّنة</a>. في هذا القسم، سنطّلع على بضع طرق أخرى.</p>
<p>من الطرق المتّبعة لتعريف أنماط التطبيق استخدام «إطار عمل للواجهات»، أو بعبارة أخرى مكتبة أنماط للواجهات.</p>
<p>أول إطار عمل للواجهات حقّق شعبية واسعة كان <a href="https://getbootstrap.com/">Bootstrap</a>، الذي طوّرته Twitter. وخلال السنوات القليلة الماضية، ظهرت أطر عمل الواجهات بكثرة كالفطر بعد المطر. والاختيار واسع جداً لدرجة أنه لا يستحق حتى محاولة إعداد قائمة شاملة هنا.</p>
<p>تتضمّن كثير من أطر عمل الواجهات سمات معرّفة مسبقاً لتطبيقات الويب، إضافة إلى «مكوّنات» مثل الأزرار والقوائم والجداول. وقد وُضع مصطلح «مكوّن» بين علامتَي اقتباس أعلاه لأنه لا يشير تماماً إلى الشيء نفسه الذي يشير إليه مكوّن React. في أغلب الأحيان، تُستخدم أطر عمل الواجهات بتضمين أوراق أنماط CSS وشيفرة JavaScript الخاصة بالإطار في التطبيق.</p>
<p>كُيِّفت كثير من أطر عمل الواجهات إلى نسخ متوافقة مع React، حيث حُوّلت «المكوّنات» التي يعرّفها إطار العمل إلى مكوّنات React. مثلاً، هناك نسختان من Bootstrap لـ React، وأشهرهما <a href="https://react-bootstrap.github.io/">React-Bootstrap</a>.</p>
<p>بدلاً من Bootstrap، لنطّلع الآن على ما هو ربما أشهر إطار عمل للواجهات حالياً: مكتبة React المسماة <a href="https://mui.com/">MaterialUI</a>، التي تطبّق لغة التصميم <a href="https://material.io/">Material Design</a> من Google.</p>
<p>لنثبّت المكتبة:</p>
<pre><code class="language-bash">npm install @mui/material @emotion/react @emotion/styled
</code></pre>
<p>عند استخدام MaterialUI، يُعرض عادةً محتوى التطبيق كله داخل مكوّن <a href="https://material-ui.com/components/container/">Container</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Container</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@mui/material&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Container</span>&gt;</span>
      // ...
    <span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span></span>
  )
}
</code></pre>
<h4 id="الجدول">الجدول</h4>
<p>لنبدأ بالمكوّن <i>NoteList</i> ونعرض قائمة الملاحظات كـ<a href="https://mui.com/material-ui/react-table/#simple-table">جدول</a>، يعرض أيضاً المستخدم الذي أنشأ كل ملاحظة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Table</span>, <span class="hljs-title class_">TableBody</span>, <span class="hljs-title class_">TableCell</span>, <span class="hljs-title class_">TableContainer</span>, <span class="hljs-title class_">TableHead</span>, <span class="hljs-title class_">TableRow</span>, <span class="hljs-title class_">Paper</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@mui/material&#x27;</span>

<span class="hljs-comment">//...</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteList</span> = (<span class="hljs-params">{ notes }</span>) =&gt; {

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      // ...
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Notes<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">TableContainer</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Paper}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Table</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">TableHead</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">TableRow</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>content<span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>user<span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>important<span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">TableRow</span>&gt;</span>
          <span class="hljs-tag">&lt;/<span class="hljs-name">TableHead</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">TableBody</span>&gt;</span>
            {notes.map(note =&gt; (
              <span class="hljs-tag">&lt;<span class="hljs-name">TableRow</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{note.id}</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">{</span>\`/<span class="hljs-attr">notes</span>/\${<span class="hljs-attr">note.id</span>}\`}&gt;</span>
                    {note.content}
                  <span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>
                  {note.user.name}
                <span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">TableCell</span>&gt;</span>
                  {note.important ? &#x27;yes&#x27;: &#x27;&#x27;}
                <span class="hljs-tag">&lt;/<span class="hljs-name">TableCell</span>&gt;</span>
              <span class="hljs-tag">&lt;/<span class="hljs-name">TableRow</span>&gt;</span>
            ))}
          <span class="hljs-tag">&lt;/<span class="hljs-name">TableBody</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">Table</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">TableContainer</span>&gt;</span>

    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NoteList</span>
</code></pre>
<p>يبدو الجدول كما يلي:</p>
<p><img src="/images/content/5/u10.webp" alt=""></p>
<h4 id="النموذج">النموذج</h4>
<p>بعد ذلك، لنحسّن عرض إنشاء ملاحظة جديدة <i>NoteForm</i> باستخدام مكوّني <a href="https://mui.com/components/text-fields/">TextField</a> و<a href="https://mui.com/api/button/">Button</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">TextField</span>, <span class="hljs-title class_">Button</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@mui/material&#x27;</span>

<span class="hljs-comment">// ...</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteForm</span> = (<span class="hljs-params">{ createNote }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Create a new note<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">TextField</span>
          <span class="hljs-attr">label</span>=<span class="hljs-string">&quot;note content&quot;</span>
          <span class="hljs-attr">value</span>=<span class="hljs-string">{newNote}</span>
          <span class="hljs-attr">onChange</span>=<span class="hljs-string">{event</span> =&gt;</span> setNewNote(event.target.value)}
        /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;contained&quot;</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{{</span> <span class="hljs-attr">marginTop:</span> <span class="hljs-attr">10</span> }}&gt;</span>
            save
          <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">NoteForm</span>

</code></pre>
<p>النتيجة أنيقة:</p>
<p><img src="/images/content/5/u11.webp" alt=""></p>
<h4 id="الإشعارات">الإشعارات</h4>
<p>لنحسّن مكوّن الإشعارات في التطبيق باستخدام مكوّن <a href="https://mui.com/components/alert/">Alert</a> من MaterialUI:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Alert</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@mui/material&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Notification</span> = (<span class="hljs-params">{ notification }</span>) =&gt; {
  <span class="hljs-keyword">if</span> (notification === <span class="hljs-literal">null</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Alert</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{{</span> <span class="hljs-attr">marginTop:</span> <span class="hljs-attr">10</span>, <span class="hljs-attr">marginBottom:</span> <span class="hljs-attr">10</span> }} <span class="hljs-attr">severity</span>=<span class="hljs-string">{notification.type}</span>&gt;</span>
      {notification.text}
    <span class="hljs-tag">&lt;/<span class="hljs-name">Alert</span>&gt;</span></span>
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Notification</span>
</code></pre>
<p>انقل مكوّن الإشعارات وإدارة حالته إلى المكوّن <i>App</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([])
  <span class="hljs-keyword">const</span> [notification, setNotification] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>) <span class="hljs-comment">// highlight-line</span>

  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = noteObject =&gt; {
    noteService.<span class="hljs-title function_">create</span>(noteObject).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">returnedNote</span> =&gt;</span> {
      <span class="hljs-title function_">setNotes</span>(notes.<span class="hljs-title function_">concat</span>(returnedNote))
      <span class="hljs-title function_">setNotification</span>({ <span class="hljs-attr">text</span>: <span class="hljs-string">\`Note &#x27;<span class="hljs-subst">\${returnedNote.content}</span>&#x27; added!\`</span>, <span class="hljs-attr">type</span>: <span class="hljs-string">&#x27;success&#x27;</span> }) <span class="hljs-comment">// highlight-line</span>
      <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> {
        <span class="hljs-title function_">setNotification</span>(<span class="hljs-literal">null</span>)
      }, <span class="hljs-number">5000</span>)
    })
  }

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Container</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Notification</span> <span class="hljs-attr">notification</span>=<span class="hljs-string">{notification}</span> /&gt;</span> // highlight-line

      <span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes/:id&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">Note</span>
            <span class="hljs-attr">note</span>=<span class="hljs-string">{note}</span>
            <span class="hljs-attr">toggleImportanceOf</span>=<span class="hljs-string">{toggleImportanceOf}</span>
            <span class="hljs-attr">deleteNote</span>=<span class="hljs-string">{deleteNote}</span>
          /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> <span class="hljs-attr">setNotification</span>=<span class="hljs-string">{setNotification}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Footer</span> /&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span></span>
  )
}
</code></pre>
<p>يتميّز Alert بتصميم أنيق:</p>
<p><img src="/images/content/5/u12.webp" alt=""></p>
<h4 id="قائمة-التنقل">قائمة التنقّل</h4>
<p>تُنفَّذ قائمة التنقّل باستخدام مكوّن <a href="https://mui.com/components/app-bar/">AppBar</a>.</p>
<p>إذا طبّقنا المثال من التوثيق مباشرة</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">AppBar</span> position=<span class="hljs-string">&quot;static&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Toolbar</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">Toolbar</span>&gt;</span></span>
&lt;/<span class="hljs-title class_">AppBar</span>&gt;
</code></pre>
<p>يوفر هذا حلاً يعمل بالفعل، لكن مظهره ليس الأفضل ممكناً:</p>
<p><img src="/images/content/5/u15.webp" alt=""></p>
<p>بتصفّح [التوثيق](https://mui.com/material-ui/guides/composition/# routing-libraries)، ستجد طريقة أفضل: <a href="https://mui.com/material-ui/guides/composition/#component-prop">خاصية component</a>، التي تتيح لك تغيير طريقة عرض العنصر الجذري لمكوّن MaterialUI.</p>
<p>بتعريف</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">Button</span> color=<span class="hljs-string">&quot;inherit&quot;</span> component={<span class="hljs-title class_">Link</span>} to=<span class="hljs-string">&quot;/&quot;</span>&gt;
  home
&lt;/<span class="hljs-title class_">Button</span>&gt;
</code></pre>
<p>يُعرض مكوّن <i>Button</i> بحيث يكون مكوّنه الجذري هو مكوّن <i>Link</i> من مكتبة <i>react-router-dom</i>، ويُمرَّر إليه prop المسمّى <i>to</i> الذي يحدّد المسار.</p>
<p>الشيفرة الكاملة لشريط التنقّل كما يلي</p>
<pre><code class="language-js">&lt;<span class="hljs-title class_">AppBar</span> position=<span class="hljs-string">&quot;static&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Toolbar</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">Toolbar</span>&gt;</span></span>
&lt;/<span class="hljs-title class_">AppBar</span>&gt;
</code></pre>
<p>وتبدو النتيجة تماماً كما نريد:</p>
<p><img src="/images/content/5/u16.webp" alt=""></p>
<p>لكننا نلاحظ أن مؤشّر التحويم باهت جداً عند تحريك الفأرة فوق شريط التنقّل. لنصلح ذلك بتعريف لون خلفية أفضل قليلاً لهذه الحالات:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> style = { <span class="hljs-string">&#x27;&amp;:hover&#x27;</span>: { <span class="hljs-attr">bgcolor</span>: <span class="hljs-string">&#x27;rgba(255,255,255,0.3)&#x27;</span> } }

<span class="hljs-keyword">return</span> (
  &lt;<span class="hljs-title class_">Container</span>&gt;
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">AppBar</span> <span class="hljs-attr">position</span>=<span class="hljs-string">&quot;static&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Toolbar</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">sx</span>=<span class="hljs-string">{style}</span>&gt;</span>
          home
        <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">sx</span>=<span class="hljs-string">{style}</span>&gt;</span>
          notes
        <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">color</span>=<span class="hljs-string">&quot;inherit&quot;</span> <span class="hljs-attr">component</span>=<span class="hljs-string">{Link}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">sx</span>=<span class="hljs-string">{style}</span>&gt;</span>
          new note
        <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Toolbar</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">AppBar</span>&gt;</span></span>

    <span class="hljs-comment">// ...</span>
)
</code></pre>
<p>نحن راضون أخيراً:</p>
<p><img src="/images/content/5/u17.webp" alt=""></p>
<p>شيفرة التطبيق الحالية متاحة بالكامل على <a href="https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-12">GitHub</a>، في الفرع <i>part5-12</i>.</p>
<h3 id="مكونات-styled-components">مكوّنات styled-components</h3>
<p>إضافة إلى ما رأيناه سابقاً، هناك <a href="https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b">طرق أخرى</a> لتطبيق الأنماط على تطبيق React.</p>
<p>تقدّم مكتبة <a href="https://www.styled-components.com/">styled-components</a>، التي تستفيد من صيغة <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">القوالب النصية الموسومة</a> (tagged template literal) في ES6، مقاربة مثيرة للاهتمام لتعريف الأنماط.</p>
<p>لنقم <a href="https://styled-components.com/docs/basics#installation">بتثبيت</a> styled-components ونستخدمها لإجراء بعض التغييرات الأسلوبية على تطبيق تدوين الملاحظات (النسخة قبل تثبيت MaterialUI). أولاً، لننشئ تعريفَي نمط للمكوّنين اللذين سنستخدمهما:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> styled <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;styled-components&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Button</span> = styled.<span class="hljs-property">button</span><span class="hljs-string">\`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
\`</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Input</span> = styled.<span class="hljs-property">input</span><span class="hljs-string">\`
  margin: 0.25em;
  width: 300px;  
\`</span>
</code></pre>
<p>تُنشئ الشيفرة نسخاً منسّقة من عنصرَي HTML هما <i>button</i> و<i>input</i>، وتُسنِدها إلى المتغيّرين <i>Button</i> و<i>Input</i>.</p>
<p>صيغة تعريف الأنماط مثيرة للاهتمام فعلاً، إذ توضع تعريفات CSS داخل علامات الاقتباس الخلفية (backticks). هذه هي صيغة <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">القوالب النصية الموسومة</a> في ES6.</p>
<p>تعمل المكوّنات المعرّفة مثل عنصرَي <i>button</i> و<i>input</i> العاديين، وتُستخدم في التطبيق بالطريقة المعتادة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">NoteForm</span> = (<span class="hljs-params">{ createNote }</span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">h2</span>&gt;</span>Create a new note<span class="hljs-tag">&lt;/<span class="hljs-name">h2</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">form</span> <span class="hljs-attr">onSubmit</span>=<span class="hljs-string">{addNote}</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Input</span>&gt;</span> // highlight-line
          value={newNote}
          onChange={event =&gt; setNewNote(event.target.value)}
          placeholder=&quot;write note content here&quot;
        /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;submit&quot;</span>&gt;</span>save<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span> // highlight-line
      <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  )
}
</code></pre>
<p>يبدو النموذج الآن كما يلي:</p>
<p><img src="/images/content/5/u20.webp" alt=""></p>
<p>لنعرّف المكوّنات التالية لإضافة الأنماط، وكلها نسخ محسّنة من عناصر <i>div</i>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Page</span> = styled.<span class="hljs-property">div</span><span class="hljs-string">\`
  padding: 1em;
  background: papayawhip;
\`</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Navigation</span> = styled.<span class="hljs-property">div</span><span class="hljs-string">\`
  background: BurlyWood;
  padding: 1em;
\`</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Footer</span> = styled.<span class="hljs-property">div</span><span class="hljs-string">\`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
\`</span>
</code></pre>
<p>يمكن الآن استخدام المكوّنات الجديدة في التطبيق:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Page</span>&gt;</span> // highlight-line
      <span class="hljs-tag">&lt;<span class="hljs-name">Navigation</span>&gt;</span> // highlight-line
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/&quot;</span>&gt;</span>home<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/notes&quot;</span>&gt;</span>notes<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Link</span> <span class="hljs-attr">style</span>=<span class="hljs-string">{padding}</span> <span class="hljs-attr">to</span>=<span class="hljs-string">&quot;/create&quot;</span>&gt;</span>new note<span class="hljs-tag">&lt;/<span class="hljs-name">Link</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Navigation</span>&gt;</span> // highlight-line

      <span class="hljs-tag">&lt;<span class="hljs-name">Routes</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes/:id&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">Note</span>
            <span class="hljs-attr">note</span>=<span class="hljs-string">{note}</span>
            <span class="hljs-attr">toggleImportanceOf</span>=<span class="hljs-string">{toggleImportanceOf}</span>
            <span class="hljs-attr">deleteNote</span>=<span class="hljs-string">{deleteNote}</span>
          /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/notes&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteList</span> <span class="hljs-attr">notes</span>=<span class="hljs-string">{notes}</span> /&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/create&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>
          &lt;<span class="hljs-attr">NoteForm</span> <span class="hljs-attr">createNote</span>=<span class="hljs-string">{addNote}/</span>&gt;</span>
        } /&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Route</span> <span class="hljs-attr">path</span>=<span class="hljs-string">&quot;/&quot;</span> <span class="hljs-attr">element</span>=<span class="hljs-string">{</span>&lt;<span class="hljs-attr">Home</span> /&gt;</span>} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">Routes</span>&gt;</span>
// highlight-start
      <span class="hljs-tag">&lt;<span class="hljs-name">Footer</span>&gt;</span>
         Note app, Department of Computer Science, University of Helsinki 2026
      <span class="hljs-tag">&lt;/<span class="hljs-name">Footer</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Page</span>&gt;</span></span>
    <span class="hljs-comment">// highlight-end</span>
  )
}
</code></pre>
<p>النتيجة النهائية كما يلي:</p>
<p><img src="/images/content/5/u21.webp" alt=""></p>
<p>اكتسبت styled-components شعبية متزايدة باطراد في الآونة الأخيرة، ويبدو حالياً أن كثيرين يعتبرونها أفضل طريقة لتعريف الأنماط لتطبيقات React.</p>
</div>
<div class="tasks">
<h3 id="تمارين-529531">تمارين 5.29–5.31</h3>
<p>بعد ذلك، حسّن أنماط تطبيق المدوّنات باستخدام MaterialUI أو styled-components.</p>
<h4 id="529-مدونات-منسقة-الخطوة-1">5.29: مدوّنات منسّقة، الخطوة 1</h4>
<p>أضف أنماطاً إلى نماذج التطبيق.</p>
<p>قد يبدو حلك شيئاً كهذا. نموذج تسجيل الدخول:</p>
<p><img src="/images/content/5/l10.webp" alt=""></p>
<p>إنشاء تدوينة جديدة:</p>
<p><img src="/images/content/5/l11.webp" alt=""></p>
<h4 id="530-مدونات-منسقة-الخطوة-2">5.30: مدوّنات منسّقة، الخطوة 2</h4>
<p>نسّق الآن شريط تنقّل التطبيق والمكوّن الذي يعرض الإشعارات. قد تبدو النتيجة شيئاً كهذا:</p>
<p><img src="/images/content/5/l12.webp" alt=""></p>
<h4 id="531-مدونات-منسقة-الخطوة-3">5.31: مدوّنات منسّقة، الخطوة 3</h4>
<p>خصّص مظهر مكوّن عرض التدوينة الواحدة كما تراه مناسباً. إليك مثالاً:</p>
<p><img src="/images/content/5/l14.webp" alt=""></p>
<p>كان هذا آخر تمرين في القسم، وحان وقت دفع الشيفرة إلى GitHub وتعليم التمارين المنجزة في <a href="https://studies.cs.helsinki.fi/stats/courses/fullstackopen">نظام تسليم التمارين</a>.</p>
</div>
`,h={part:5,letter:"e",file:s,title:a,slug:n,mainImage:l,headings:t,html:p};export{h as default,s as file,t as headings,p as html,c as letter,l as mainImage,e as part,n as slug,a as title};
