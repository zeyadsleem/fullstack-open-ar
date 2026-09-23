const l=6,c="d",s="d.md",n="React Query وContext API",a="react_query_context_api",t="/images/part-6.svg",p=[{depth:3,id:"إدارة-البيانات-على-الخادم-باستخدام-مكتبة-tanstack-query",text:"إدارة البيانات على الخادم باستخدام مكتبة TanStack Query"},{depth:3,id:"مزامنة-البيانات-مع-الخادم-باستخدام-tanstack-query",text:"مزامنة البيانات مع الخادم باستخدام TanStack Query"},{depth:3,id:"تحسين-الأداء",text:"تحسين الأداء"},{depth:3,id:"الخطاف-المخصص-usenotes",text:"الخطاف المخصّص useNotes"},{depth:3,id:"context-api",text:"Context API"},{depth:3,id:"تعريف-سياق-العداد-في-ملفه-الخاص",text:"تعريف سياق العدّاد في ملفه الخاص"},{depth:3,id:"أي-حل-لإدارة-الحالة-ينبغي-اختياره",text:"أي حل لإدارة الحالة ينبغي اختياره؟"}],e=`<p>في نهاية هذا الجزء، سنتناول بضع طرق أخرى مختلفة لإدارة حالة التطبيق.</p>
<p>لنواصل مع تطبيق الملاحظات. سنركّز على التواصل مع الخادم. لنبدأ التطبيق من الصفر. النسخة الأولى كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> content = event.<span class="hljs-property">target</span>.<span class="hljs-property">note</span>.<span class="hljs-property">value</span>
    event.<span class="hljs-property">target</span>.<span class="hljs-title function_">reset</span>()
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(content)
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleImportance</span> = (<span class="hljs-params">note</span>) =&gt; {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;toggle importance of&#x27;</span>, note.<span class="hljs-property">id</span>)
  }

  <span class="hljs-keyword">const</span> notes = []

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;h2&gt;<span class="hljs-title class_">Notes</span> app&amp;lt;/h2&gt;
      &amp;lt;form onSubmit={addNote}&gt;
        &amp;lt;input name=<span class="hljs-string">&quot;note&quot;</span> /&gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&gt;add&amp;lt;/button&gt;
      &amp;lt;/form&gt;
      {notes.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">note</span>) =&gt;</span> (
        &amp;lt;li key={note.<span class="hljs-property">id</span>}&gt;
          {note.<span class="hljs-property">important</span> ? &amp;lt;strong&gt;{note.<span class="hljs-property">content</span>}&amp;lt;/strong&gt; : note.<span class="hljs-property">content</span>}
          &amp;lt;button onClick={<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">toggleImportance</span>(note.<span class="hljs-property">id</span>)}&gt;
            {note.<span class="hljs-property">important</span> ? <span class="hljs-string">&#x27;make not important&#x27;</span> : <span class="hljs-string">&#x27;make important&#x27;</span>}
          &amp;lt;/button&gt;
        &amp;lt;/li&gt;
      ))}
    &amp;lt;/div&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>
</code></pre>
<p>الشيفرة الأولية موجودة على GitHub في هذا <a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-0" target="_blank" rel="noopener">المستودع</a>، في الفرع <em>part6-0</em>.</p>
<h3 id="إدارة-البيانات-على-الخادم-باستخدام-مكتبة-tanstack-query">إدارة البيانات على الخادم باستخدام مكتبة TanStack Query</h3>
<p>سنستخدم الآن مكتبة <a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">TanStack Query</a> لتخزين البيانات المسترجَعة من الخادم وإدارتها.</p>
<p>ثبّت المكتبة بالأمر</p>
<pre><code class="language-bash">npm install @tanstack/react-query
</code></pre>
<p>نحتاج إلى بضع إضافات في الملف <em>main.jsx</em> لتمرير دوال المكتبة إلى التطبيق بأكمله:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { createRoot } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">QueryClient</span>, <span class="hljs-title class_">QueryClientProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App.jsx&#x27;</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> queryClient = <span class="hljs-keyword">new</span> <span class="hljs-title class_">QueryClient</span>()
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>)).<span class="hljs-title function_">render</span>(
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  &amp;lt;<span class="hljs-title class_">QueryClientProvider</span> client={queryClient}&gt;
    &amp;lt;<span class="hljs-title class_">App</span> /&gt;
  &amp;lt;/<span class="hljs-title class_">QueryClientProvider</span>&gt;
  <span class="hljs-comment">// END HIGHLIGHT</span>
)
</code></pre>
<p>لنستخدم <a href="https://github.com/typicode/json-server" target="_blank" rel="noopener">JSON Server</a> كما في الأجزاء السابقة لمحاكاة الواجهة الخلفية. JSON Server مهيّأ مسبقاً في المشروع المثال، ويحتوي جذر المشروع على ملف <em>db.json</em> يضم افتراضياً ملاحظتين. يمكنك تشغيل الخادم بالأمر:</p>
<pre><code class="language-bash">npm run server
</code></pre>
<p>يمكننا الآن استرجاع الملاحظات في مكوّن <em>App</em>. تتوسّع الشيفرة كما يلي:</p>
<pre><code class="language-js">
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useQuery } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> content = event.<span class="hljs-property">target</span>.<span class="hljs-property">note</span>.<span class="hljs-property">value</span>
    event.<span class="hljs-property">target</span>.<span class="hljs-title function_">reset</span>()
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(content)
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleImportance</span> = (<span class="hljs-params">note</span>) =&gt; {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;toggle importance of&#x27;</span>, note.<span class="hljs-property">id</span>)
  }

  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>({
    <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>],
    <span class="hljs-attr">queryFn</span>: <span class="hljs-title function_">async</span> () =&gt; {
      <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>)
      <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to fetch notes&#x27;</span>)
      }
      <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
    }
  })

  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">parse</span>(<span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(result)))

  <span class="hljs-keyword">if</span> (result.<span class="hljs-property">isPending</span>) {
    <span class="hljs-keyword">return</span> &amp;lt;div&gt;loading data...&amp;lt;/div&gt;
  }

  <span class="hljs-keyword">const</span> notes = result.<span class="hljs-property">data</span>
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// ...</span>
  )
}
</code></pre>
<p>يتم جلب البيانات من الخادم، كما في الفصل السابق، باستخدام دالة <em>fetch</em> من Fetch API. غير أن استدعاء الدالة أصبح الآن ملفوفاً داخل <a href="https://tanstack.com/query/latest/docs/react/guides/queries" target="_blank" rel="noopener">استعلام</a> يكوّنه خطاف <a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">useQuery</a>. يتلقّى استدعاء <em>useQuery</em> كمعامل كائناً فيه الحقلان <em>queryKey</em> و <em>queryFn</em>. قيمة الحقل <em>queryKey</em> هي مصفوفة تحتوي على النص <em>notes</em>، وهي تعمل بمنزلة <a href="https://tanstack.com/query/latest/docs/react/guides/query-keys" target="_blank" rel="noopener">مفتاح</a> للاستعلام المعرَّف، أي قائمة الملاحظات.</p>
<p>القيمة المُعادة من دالة <em>useQuery</em> هي كائن يبيّن حالة الاستعلام. ويوضّح الخرج في وحدة التحكم الوضع:</p>
<p><img src="/images/mooc/6ad2aaf134fc.webp" alt="صورة توضيحية"></p>
<p>كما نرى، عند عرض المكوّن لأول مرة يظل الاستعلام في حالة الانتظار (pending)، أي أن طلب HTTP المرتبط لا يزال معلّقاً. في هذه المرحلة، لا يُعرض سوى ما يلي:</p>
<pre><code>&amp;lt;div&amp;gt;loading data...&amp;lt;/div&amp;gt;
</code></pre>
<p>غير أن طلب HTTP يكتمل بسرعة كبيرة بحيث يستحيل رؤية النص. وعند اكتمال الطلب يُعرض المكوّن مرة أخرى. ويكون الاستعلام في الحالة <em>success</em> عند العرض الثاني، ويحتوي الحقل <em>data</em> من كائن الاستعلام على البيانات التي أعادها الطلب، أي قائمة الملاحظات المعروضة على الشاشة.</p>
<p>إذن يسترجع التطبيق البيانات من الخادم ويعرضها على الشاشة دون استخدام خطافات React <em>useState</em> و <em>useEffect</em> المستخدمة في الفصول 2-5 على الإطلاق. أصبحت البيانات الموجودة على الخادم الآن بالكامل تحت إدارة مكتبة TanStack Query، ولم يعد التطبيق بحاجة إلى الحالة المعرَّفة بخطاف <em>useState</em> في React إطلاقاً!</p>
<p>لننقل الدالة التي تُجري طلب HTTP الفعلي إلى ملفها الخاص <em>src/requests.js</em></p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> getNotes = <span class="hljs-title function_">async</span> () =&amp;gt; {
  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(baseUrl)
  <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to fetch notes&#x27;</span>)
  }
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
}
</code></pre>
<p>أصبح مكوّن <em>App</em> الآن مبسّطاً قليلاً:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useQuery } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { getNotes } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./requests&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>({
    <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>],
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">queryFn</span>: getNotes
    <span class="hljs-comment">// END HIGHLIGHT</span>
  })

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>شيفرة التطبيق الحالية موجودة على <a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-1" target="_blank" rel="noopener">GitHub</a> في الفرع <em>part6-1</em>.</p>
<h3 id="مزامنة-البيانات-مع-الخادم-باستخدام-tanstack-query">مزامنة البيانات مع الخادم باستخدام TanStack Query</h3>
<p>لقد نجحنا بالفعل في استرجاع البيانات من الخادم. بعد ذلك، سنحرص على تخزين البيانات المُضافة والمعدَّلة على الخادم. لنبدأ بإضافة ملاحظات جديدة.</p>
<p>لنضف دالة <em>createNote</em> إلى الملف <em>requests.js</em> لحفظ الملاحظات الجديدة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> baseUrl = <span class="hljs-string">&#x27;http://localhost:3001/notes&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">getNotes</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(baseUrl)
  <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to fetch notes&#x27;</span>)
  }
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
}

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">newNote</span>) =&gt; {
  <span class="hljs-keyword">const</span> options = {
    <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
    <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
    <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(newNote)
  }

  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(baseUrl, options)

  <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to create note&#x27;</span>)
  }

  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
}
<span class="hljs-comment">// END HIGHLIGHT</span>
</code></pre>
<p>سيتغيّر مكوّن <em>App</em> كما يلي</p>
<pre><code class="language-js"><span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useQuery, useMutation } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-keyword">import</span> { getNotes, createNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./requests&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: createNote,
  })
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> content = event.<span class="hljs-property">target</span>.<span class="hljs-property">note</span>.<span class="hljs-property">value</span>
    event.<span class="hljs-property">target</span>.<span class="hljs-title function_">reset</span>()
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    newNoteMutation.<span class="hljs-title function_">mutate</span>({ content, <span class="hljs-attr">important</span>: <span class="hljs-literal">true</span> })
    <span class="hljs-comment">// END HIGHLIGHT</span>
  }

  <span class="hljs-comment">//</span>

}
</code></pre>
<p>لإنشاء ملاحظة جديدة، نعرّف <a href="https://tanstack.com/query/latest/docs/react/guides/mutations" target="_blank" rel="noopener">mutation</a> باستخدام الدالة <a href="https://tanstack.com/query/latest/docs/react/reference/useMutation" target="_blank" rel="noopener">useMutation</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
  <span class="hljs-attr">mutationFn</span>: createNote,
})
</code></pre>
<p>المعامل هو الدالة التي أضفناها إلى الملف <em>requests.js</em> والتي تستخدم Fetch API لإرسال ملاحظة جديدة إلى الخادم.</p>
<p>ينفّذ معالج الحدث <em>addNote</em> الـ mutation باستدعاء الدالة <em>mutate</em> التابعة لكائن الـ mutation وتمرير الملاحظة الجديدة كوسيط:</p>
<pre><code>newNoteMutation.mutate({ content, important: true })
</code></pre>
<p>حلّنا جيد، إلا أنه لا يعمل. تُحفظ الملاحظة الجديدة على الخادم، لكنها لا تظهر محدَّثة على الشاشة.</p>
<p>لكي نعرض الملاحظة الجديدة أيضاً، علينا إخبار TanStack Query بأن النتيجة القديمة للاستعلام الذي مفتاحه النص <em>notes</em> ينبغي <a href="https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations" target="_blank" rel="noopener">إبطالها</a>.</p>
<p>لحسن الحظ، الإبطال سهل، ويمكن تنفيذه بتعريف دالة الاستدعاء <em>onSuccess</em> المناسبة للـ mutation:</p>
<pre><code class="language-js"><span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useQuery, useMutation, useQueryClient } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { getNotes, createNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./requests&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> queryClient = <span class="hljs-title function_">useQueryClient</span>()
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: createNote,
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">onSuccess</span>: <span class="hljs-function">() =&gt;</span> {
      queryClient.<span class="hljs-title function_">invalidateQueries</span>({ <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>] })
    },
    <span class="hljs-comment">// END HIGHLIGHT</span>
  })

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>الآن، بعد تنفيذ الـ mutation بنجاح، يُستدعى ما يلي</p>
<pre><code>queryClient.invalidateQueries({ queryKey: ['notes'] })
</code></pre>
<p>وهذا بدوره يجعل TanStack Query يحدّث تلقائياً الاستعلام ذا المفتاح <em>notes</em>، أي يجلب الملاحظات من الخادم. ونتيجة لذلك، يعرض التطبيق الحالة الأحدث على الخادم، أي تُعرض الملاحظة المضافة أيضاً.</p>
<p>لننفّذ أيضاً تغيير أهمية الملاحظات. تُضاف دالة لتحديث الملاحظات إلى الملف <em>requests.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> updateNote = <span class="hljs-title function_">async</span> (updatedNote) =&amp;gt; {
  <span class="hljs-keyword">const</span> options = {
    <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;PUT&#x27;</span>,
    <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
    <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(updatedNote)
  }

  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">\`<span class="hljs-subst">\${baseUrl}</span>/<span class="hljs-subst">\${updatedNote.id}</span>\`</span>, options)

  <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to update note&#x27;</span>)
  }

  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
}
</code></pre>
<p>يتم تحديث الملاحظة أيضاً عبر mutation. يتوسّع مكوّن <em>App</em> كما يلي:</p>
<pre><code class="language-js">
<span class="hljs-keyword">import</span> { useQuery, useMutation, useQueryClient } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { getNotes, createNote, updateNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./requests&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> queryClient = <span class="hljs-title function_">useQueryClient</span>()

  <span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: createNote,
    <span class="hljs-attr">onSuccess</span>: <span class="hljs-function">() =&gt;</span> {
      queryClient.<span class="hljs-title function_">invalidateQueries</span>({ <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>] })
    }
  })

  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> updateNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: updateNote,
    <span class="hljs-attr">onSuccess</span>: <span class="hljs-function">() =&gt;</span> {
      queryClient.<span class="hljs-title function_">invalidateQueries</span>({ <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>] })
    }
  })
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">addNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">event</span>) =&gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> content = event.<span class="hljs-property">target</span>.<span class="hljs-property">note</span>.<span class="hljs-property">value</span>
    event.<span class="hljs-property">target</span>.<span class="hljs-title function_">reset</span>()
    newNoteMutation.<span class="hljs-title function_">mutate</span>({ content, <span class="hljs-attr">important</span>: <span class="hljs-literal">true</span> })
  }

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">toggleImportance</span> = (<span class="hljs-params">note</span>) =&gt; {
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    updateNoteMutation.<span class="hljs-title function_">mutate</span>({...note, <span class="hljs-attr">important</span>: !note.<span class="hljs-property">important</span> })
    <span class="hljs-comment">// END HIGHLIGHT</span>
  }

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>إذن مرة أخرى، يُبطل الـ mutation الذي أنشأناه استعلام notes كي تُعرض الملاحظة المحدَّثة بشكل صحيح. استخدام الـ mutations سهل؛ إذ تتلقّى الدالة <em>mutate</em> ملاحظة كمعامل، وقد غُيّرت أهميتها إلى نقيض القيمة القديمة.</p>
<p>شيفرة التطبيق الحالية موجودة على <a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-2" target="_blank" rel="noopener">GitHub</a> في الفرع <em>part6-2</em>.</p>
<h3 id="تحسين-الأداء">تحسين الأداء</h3>
<p>يعمل التطبيق جيداً، والشيفرة بسيطة نسبياً. والملفت بشكل خاص سهولة إجراء تغييرات على قائمة الملاحظات. فمثلاً، عند تغيير أهمية ملاحظة، يكفي إبطال الاستعلام <em>notes</em> لتُحدَّث بيانات التطبيق:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> updateNoteMutation = <span class="hljs-title function_">useMutation</span>({
  <span class="hljs-attr">mutationFn</span>: updateNote,
  <span class="hljs-attr">onSuccess</span>: () =&amp;gt; {
    queryClient.<span class="hljs-title function_">invalidateQueries</span>({ <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>] })  }
})
</code></pre>
<p>نتيجة ذلك، بالطبع، أنه بعد طلب PUT الذي يسبّب تغيير الملاحظة، يُجري التطبيق طلب GET جديداً لاسترجاع بيانات الاستعلام من الخادم:</p>
<p><img src="/images/mooc/89ca92bbd4ce.webp" alt="صورة توضيحية"></p>
<p>إذا لم تكن كمية البيانات التي يسترجعها التطبيق كبيرة، فلا يهم ذلك حقاً. فمن وجهة نظر وظائف جهة المتصفح، لا يهم حقاً إجراء طلب HTTP GET إضافي، لكنه قد يشكّل عبئاً على الخادم في بعض الحالات.</p>
<p>وعند الحاجة، يمكن أيضاً تحسين الأداء <a href="https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses" target="_blank" rel="noopener">بتحديث حالة الاستعلام</a> التي يديرها TanStack Query يدوياً.</p>
<p>التغيير الخاص بالـ mutation الذي يضيف ملاحظة جديدة كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> queryClient = <span class="hljs-title function_">useQueryClient</span>()

  <span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: createNote,
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">onSuccess</span>: <span class="hljs-function">(<span class="hljs-params">newNote</span>) =&gt;</span> {
      <span class="hljs-keyword">const</span> notes = queryClient.<span class="hljs-title function_">getQueryData</span>([<span class="hljs-string">&#x27;notes&#x27;</span>])
      queryClient.<span class="hljs-title function_">setQueryData</span>([<span class="hljs-string">&#x27;notes&#x27;</span>], notes.<span class="hljs-title function_">concat</span>(newNote))
    <span class="hljs-comment">// END HIGHLIGHT</span>
    }
  })

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>أي أن كائن <em>queryClient</em> يقرأ أولاً في دالة الاستدعاء <em>onSuccess</em> حالة <em>notes</em> الحالية للاستعلام ويحدّثها بإضافة ملاحظة جديدة تُستلم كمعامل لدالة الاستدعاء. وقيمة المعامل هي القيمة التي تعيدها الدالة <em>createNote</em> المعرَّفة في الملف <em>requests.js</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">createNote</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">newNote</span>) =&gt; {
  <span class="hljs-keyword">const</span> options = {
    <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
    <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
    <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(newNote)
  }

  <span class="hljs-keyword">const</span> response = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(baseUrl, options)

  <span class="hljs-keyword">if</span> (!response.<span class="hljs-property">ok</span>) {
    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(<span class="hljs-string">&#x27;Failed to create note&#x27;</span>)
  }

  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> response.<span class="hljs-title function_">json</span>()
  <span class="hljs-comment">// END HIGHLIGHT</span>
}
</code></pre>
<p>سيكون من السهل نسبياً إجراء تغيير مماثل على الـ mutation الذي يغيّر أهمية الملاحظة، لكننا نتركه كتمرين اختياري.</p>
<p>أخيراً، لاحظ تفصيلاً مثيراً للاهتمام. يعيد TanStack Query جلب كل الملاحظات عندما ننتقل إلى تبويب آخر في المتصفح ثم نعود إلى تبويب التطبيق. ويمكن ملاحظة ذلك في تبويب Network في وحدة تحكم المطوّر:</p>
<p><img src="/images/mooc/28ae0e462fe2.webp" alt="صورة توضيحية"></p>
<p>ما الذي يحدث؟ بقراءة <a href="https://tanstack.com/query/latest/docs/react/reference/useQuery" target="_blank" rel="noopener">التوثيق</a>، نلاحظ أن السلوك الافتراضي لاستعلامات TanStack Query هو تحديث الاستعلامات (التي تكون حالتها <em>stale</em>) عند تغيّر <em>window focus</em>. وإذا أردنا، يمكننا تعطيل هذه الوظيفة بإنشاء استعلام كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>({
    <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>],
    <span class="hljs-attr">queryFn</span>: getNotes,
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    <span class="hljs-attr">refetchOnWindowFocus</span>: <span class="hljs-literal">false</span>
    <span class="hljs-comment">// END HIGHLIGHT</span>
  })

  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>إذا أضفت عبارة console.log إلى الشيفرة، يمكنك أن ترى من وحدة تحكم المتصفح كم مرة يجعل TanStack Query التطبيق يُعاد عرضه. والقاعدة العامة أن إعادة العرض تحدث على الأقل كلما دعت الحاجة إليها، أي عند تغيّر حالة الاستعلام. يمكنك القراءة أكثر عن ذلك مثلاً <a href="https://tkdodo.eu/blog/react-query-render-optimizations" target="_blank" rel="noopener">هنا</a>.</p>
<h3 id="الخطاف-المخصص-usenotes">الخطاف المخصّص useNotes</h3>
<p>حلّنا جيد إلى حد بعيد، لكن ما يزعج بعض الشيء هو أن كثيراً من تفاصيل تنفيذ TanStack Query وُضعت مباشرة داخل مكوّن React. لنستخرجها إلى دالة خطاف مخصّص خاصة بها:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useQuery, useMutation, useQueryClient } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@tanstack/react-query&#x27;</span>
<span class="hljs-keyword">import</span> { getNotes, createNote, updateNote } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../requests&#x27;</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> useNotes = () =&amp;gt; {
  <span class="hljs-keyword">const</span> queryClient = <span class="hljs-title function_">useQueryClient</span>()

  <span class="hljs-keyword">const</span> result = <span class="hljs-title function_">useQuery</span>({
    <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>],
    <span class="hljs-attr">queryFn</span>: getNotes,
    <span class="hljs-attr">refetchOnWindowFocus</span>: <span class="hljs-literal">false</span>
  })

  <span class="hljs-keyword">const</span> newNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: createNote,
    <span class="hljs-attr">onSuccess</span>: (newNote) =&amp;gt; {
      <span class="hljs-keyword">const</span> notes = queryClient.<span class="hljs-title function_">getQueryData</span>([<span class="hljs-string">&#x27;notes&#x27;</span>])
      queryClient.<span class="hljs-title function_">setQueryData</span>([<span class="hljs-string">&#x27;notes&#x27;</span>], notes.<span class="hljs-title function_">concat</span>(newNote))
    }
  })

  <span class="hljs-keyword">const</span> updateNoteMutation = <span class="hljs-title function_">useMutation</span>({
    <span class="hljs-attr">mutationFn</span>: updateNote,
    <span class="hljs-attr">onSuccess</span>: () =&amp;gt; {
      queryClient.<span class="hljs-title function_">invalidateQueries</span>({ <span class="hljs-attr">queryKey</span>: [<span class="hljs-string">&#x27;notes&#x27;</span>] })
    }
  })

  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">notes</span>: result.<span class="hljs-property">data</span>,
    <span class="hljs-attr">isPending</span>: result.<span class="hljs-property">isPending</span>,
    <span class="hljs-attr">addNote</span>: (content) =&amp;gt; newNoteMutation.<span class="hljs-title function_">mutate</span>({ content, <span class="hljs-attr">important</span>: <span class="hljs-literal">true</span> }),
    <span class="hljs-attr">toggleImportance</span>: (note) =&amp;gt; updateNoteMutation.<span class="hljs-title function_">mutate</span>({
      ...note, <span class="hljs-attr">important</span>: !note.<span class="hljs-property">important</span>
    }),
  }
}
</code></pre>
<p>تغلّف دالة الخطاف كل الشيفرة المتعلقة بـ TanStack Query: الاستعلام الخاص بجلب الملاحظات وكلا الـ mutations الخاصة بإنشاء الملاحظات وتحديثها. وتُخفى تفاصيل التنفيذ هذه عن مستخدم الخطاف، إذ تعيد الدالة كائناً بسيطاً يحتوي على</p>
<ul>
<li><em>notes</em>: قائمة الملاحظات</li>
<li><em>isPending</em>: ما إذا كانت البيانات لا تزال قيد التحميل</li>
<li><em>addNote</em>: دالة لإضافة ملاحظة جديدة بنص المحتوى فقط</li>
<li><em>toggleImportance</em>: دالة لتبديل أهمية الملاحظة</li>
</ul>
<p>يُبسَّط مكوّن <em>App</em> بشكل كبير:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useNotes } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./hooks/useNotes&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> { notes, isPending, <span class="hljs-attr">addNote</span>: addNoteToServer, toggleImportance } = <span class="hljs-title function_">useNotes</span>()

  <span class="hljs-keyword">const</span> addNote = <span class="hljs-title function_">async</span> (event) =&amp;gt; {
    event.<span class="hljs-title function_">preventDefault</span>()
    <span class="hljs-keyword">const</span> content = event.<span class="hljs-property">target</span>.<span class="hljs-property">note</span>.<span class="hljs-property">value</span>
    event.<span class="hljs-property">target</span>.<span class="hljs-title function_">reset</span>()
    <span class="hljs-title function_">addNoteToServer</span>(content)
  }

  <span class="hljs-keyword">if</span> (isPending) {
    <span class="hljs-keyword">return</span> &amp;lt;div&amp;gt;loading data...&amp;lt;/div&amp;gt;
  }

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;h2&amp;gt;<span class="hljs-title class_">Notes</span> app&amp;lt;/h2&amp;gt;
      &amp;lt;form onSubmit={addNote}&amp;gt;
        &amp;lt;input name=<span class="hljs-string">&quot;note&quot;</span> /&amp;gt;
        &amp;lt;button type=<span class="hljs-string">&quot;submit&quot;</span>&amp;gt;add&amp;lt;/button&amp;gt;
      &amp;lt;/form&amp;gt;
      {notes.<span class="hljs-title function_">map</span>((note) =&amp;gt; (
        &amp;lt;li key={note.<span class="hljs-property">id</span>}&amp;gt;
          {note.<span class="hljs-property">important</span> ? &amp;lt;strong&amp;gt;{note.<span class="hljs-property">content</span>}&amp;lt;/strong&amp;gt; : note.<span class="hljs-property">content</span>}
          &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">toggleImportance</span>(note)}&amp;gt;
            {note.<span class="hljs-property">important</span> ? <span class="hljs-string">&#x27;make not important&#x27;</span> : <span class="hljs-string">&#x27;make important&#x27;</span>}
          &amp;lt;/button&amp;gt;
        &amp;lt;/li&amp;gt;
      ))}
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>شيفرة التطبيق موجودة على <a href="https://github.com/fullstack-hy2020/query-notes/tree/part6-3" target="_blank" rel="noopener">GitHub</a> في الفرع <em>part6-3</em>.</p>
<p>TanStack Query مكتبة متعددة الاستخدامات، وهي بناءً على ما رأيناه بالفعل تبسّط التطبيق. فهل تجعل TanStack Query حلول إدارة الحالة الأكثر تعقيداً مثل Zustand غير ضرورية؟ لا. يمكن لـ TanStack Query أن تحلّ محل حالة التطبيق جزئياً في بعض الحالات، لكن كما يذكر <a href="https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state" target="_blank" rel="noopener">التوثيق</a></p>
<ul>
<li>TanStack Query هي <em>مكتبة حالة الخادم</em> (server-state library)، مسؤولة عن إدارة العمليات غير المتزامنة بين خادمك وعميلك</li>
<li>أما Zustand وغيرها فهي <em>مكتبات حالة العميل</em> (client-state libraries) التي يمكن استخدامها لتخزين البيانات غير المتزامنة، وإن كان ذلك بكفاءة أقل مقارنة بأداة مثل TanStack Query</li>
</ul>
<p>إذن TanStack Query مكتبة تحافظ على <em>حالة الخادم</em> في الواجهة الأمامية، أي تعمل كذاكرة مؤقتة لما هو مخزَّن على الخادم. تبسّط TanStack Query معالجة البيانات الموجودة على الخادم، ويمكنها في بعض الحالات إلغاء الحاجة إلى حفظ بيانات الخادم في حالة الواجهة الأمامية.</p>
<p>تحتاج معظم تطبيقات React ليس فقط إلى طريقة لتخزين البيانات المُقدَّمة مؤقتاً، بل أيضاً إلى حل لكيفية التعامل مع بقية حالة الواجهة الأمامية (مثل حالة النماذج أو الإشعارات).</p>
<div class="tasks">
<p><strong>19. استعلام anecdotes، الخطوة 1</strong></p>
</div>
<div class="tasks">
<p><strong>20. استعلام anecdotes، الخطوة 2</strong></p>
</div>
<div class="tasks">
<p><strong>21. استعلام anecdotes، الخطوة 3</strong></p>
</div>
<div class="tasks">
<p><strong>22. استعلام anecdotes، الخطوة 4</strong></p>
</div>
<div class="tasks">
<p><strong>23. استعلام anecdotes، مراجعة</strong></p>
</div>
<h3 id="context-api">Context API</h3>
<p>لنعد إلى تطبيق العدّاد القديم الجيد. يُعرَّف التطبيق كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Display</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Display&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Controls</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Controls&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;<span class="hljs-title class_">Display</span> counter={counter} /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Controls</span> counter={counter} setCounter={setCounter} /&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>يعرّف مكوّن <em>App</em> حالة التطبيق ويمرّرها إلى مكوّن <em>Display</em> الذي يعرض قيمة العدّاد:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Display</span> = ({ counter }) =&amp;gt; {

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;{counter}&amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>وإلى مكوّن <em>Controls</em> الذي يعرض الأزرار:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Controls</span> = ({ counter, setCounter }) =&amp;gt; {
  <span class="hljs-keyword">const</span> increment = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter + <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> decrement = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter - <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> zero = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;button onClick={increment}&amp;gt;plus&amp;lt;/button&amp;gt;
      &amp;lt;button onClick={decrement}&amp;gt;minus&amp;lt;/button&amp;gt;
      &amp;lt;button onClick={zero}&amp;gt;zero&amp;lt;/button&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>ينمو التطبيق:</p>
<p><img src="/images/mooc/1d93cd0e222b.webp" alt="صورة توضيحية"></p>
<p>يتغيّر دور مكوّن <em>App</em>: فهو لا يزال يحتفظ بحالة التطبيق، لكنه لم يعد يعرض المكوّنات التي تستخدم حالة العدّاد مباشرة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;<span class="hljs-title class_">Navbar</span> /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Panel</span> counter={counter} setCounter={setCounter} /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Footer</span> /&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>المكوّن الجديد <em>Panel</em> مسؤول عن عرض المكوّنات التي تعرض العدّاد والأزرار:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Display</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Display&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Controls</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Controls&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Panel</span> = ({ counter, setCounter }) =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;<span class="hljs-title class_">Display</span> counter={counter} /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Controls</span> counter={counter} setCounter={setCounter} /&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>التسلسل الهرمي لمكوّنات التطبيق كما يلي:</p>
<pre><code>App (state)
 ├── Panel
 │    ├── Display
 │    └── Controls
 └── Footer
</code></pre>
<p>لا تزال حالة التطبيق في مكوّن <em>App</em>. ولتمكين <em>Display</em> و <em>Controls</em> من الوصول إلى حالة العدّاد، يجب تمرير الحالة ودالة تحديثها كـ props عبر مكوّن <em>Panel</em>، رغم أن <em>Panel</em> نفسه لا يحتاجهما. وينشأ هذا النوع من الحالات بسهولة عند استخدام حالة أُنشئت بخطاف <em>useState</em>. وتُسمّى هذه الظاهرة <a href="https://kentcdodds.com/blog/prop-drilling" target="_blank" rel="noopener">prop drilling</a>.</p>
<p>تقدّم واجهة <a href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener">Context API</a> المدمجة في React حلاً واحداً لهذه المشكلة. وسياق React (context) هو نوع من الحالة العامة للتطبيق، يتيح منح أي مكوّن وصولاً مباشراً إليه.</p>
<p>لننشئ الآن سياقاً في التطبيق يخزّن إدارة حالة العدّاد.</p>
<p>يُنشأ السياق باستخدام دالة <a href="https://react.dev/reference/react/createContext" target="_blank" rel="noopener">createContext</a> في React. لننشئ السياق في ملف <em>src/CounterContext.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { createContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">CounterContext</span> = <span class="hljs-title function_">createContext</span>()

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">CounterContext</span>
</code></pre>
<p>يمكن لمكوّن <em>App</em> الآن أن <em>يوفّر</em> السياق لمكوّناته الفرعية كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    &amp;lt;<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span> value={{counter, setCounter}}&gt;
      &amp;lt;<span class="hljs-title class_">Panel</span> /&gt;
      &amp;lt;<span class="hljs-title class_">Footer</span> /&gt;
    &amp;lt;/<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span>&gt;
    <span class="hljs-comment">// END HIGHLIGHT</span>
  )
}
</code></pre>
<p>يتم توفير السياق بلفّ المكوّنات الفرعية داخل مكوّن <em>CounterContext.Provider</em> وتعيين قيمة مناسبة للسياق.</p>
<p>قيمة السياق الآن كائن له الخاصيتان <em>counter</em> و <em>setCounter</em>، أي حالة العدّاد والدالة التي تحدّثها.</p>
<p>لاحظ أن مكوّن <em>Panel</em> لم يعد يتلقّى أي props متعلقة بالعدّاد، لذا يُبسَّط إلى:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Panel</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;<span class="hljs-title class_">Display</span> /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Controls</span> /&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>يمكن للمكوّنات الأخرى الآن الوصول إلى السياق باستخدام خطاف <a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a>. يتغيّر مكوّن <em>Display</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Display</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> { counter } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> &amp;lt;div&gt;{counter}&amp;lt;/div&gt;
}
</code></pre>
<p>لم يعد مكوّن <em>Display</em> بحاجة إلى أي props. فهو يحصل على قيمة العدّاد باستدعاء خطاف <em>useContext</em> مع كائن <em>CounterContext</em> كمعامل له.</p>
<p>وبالمثل، يتغيّر مكوّن <em>Controls</em> إلى:</p>
<pre><code class="language-js"><span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Controls</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> { counter, setCounter } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">increment</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(counter + <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">decrement</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(counter - <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">zero</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;button onClick={increment}&gt;plus&amp;lt;/button&gt;
      &amp;lt;button onClick={decrement}&gt;minus&amp;lt;/button&gt;
      &amp;lt;button onClick={zero}&gt;zero&amp;lt;/button&gt;
    &amp;lt;/div&gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Controls</span>
</code></pre>
<p>أصبحت المكوّنات الآن قادرة على الوصول إلى المحتوى الذي يعيّنه مزوّد السياق، أي حالة العدّاد ودالة تحديثها.</p>
<p>تستخرج المكوّنات الخصائص التي تحتاجها باستخدام صيغة التفكيك (destructuring) في JavaScript:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { counter } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
</code></pre>
<h3 id="تعريف-سياق-العداد-في-ملفه-الخاص">تعريف سياق العدّاد في ملفه الخاص</h3>
<p>لا يزال في تطبيقنا ما هو غير مستحب: إذ إن وظيفة إدارة حالة العدّاد معرَّفة داخل مكوّن <em>App</em>. لننقل كل الشيفرة المتعلقة بالعدّاد إلى الملف <em>CounterContext.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { createContext, useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">CounterContext</span> = <span class="hljs-title function_">createContext</span>()

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">CounterContext</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">CounterContextProvider</span> = (<span class="hljs-params">props</span>) =&gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span> value={{ counter, setCounter }}&gt;
      {props.<span class="hljs-property">children</span>}
    &amp;lt;/<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span>&gt;
  )
}
<span class="hljs-comment">// END HIGHLIGHT</span>
</code></pre>
<p>يصدّر الملف الآن كلاً من كائن <em>CounterContext</em> ومكوّن <em>CounterContextProvider</em>، وهو أساساً مزوّد سياق تحتوي قيمته على العدّاد ودالة تحديثه.</p>
<p>لنستخدم مزوّد السياق مباشرة في الملف <em>main.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">StrictMode</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> { createRoot } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App&#x27;</span>
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">CounterContextProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./CounterContext&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>)).<span class="hljs-title function_">render</span>(
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  &amp;lt;<span class="hljs-title class_">CounterContextProvider</span>&gt;
    &amp;lt;<span class="hljs-title class_">App</span> /&gt;
  &amp;lt;/<span class="hljs-title class_">CounterContextProvider</span>&gt;
  <span class="hljs-comment">// END HIGHLIGHT</span>
)
</code></pre>
<p>أصبح السياق الذي يعرّف قيمة العدّاد ووظائفه متاحاً الآن <em>لجميع</em> مكوّنات التطبيق.</p>
<p>يُبسَّط مكوّن <em>App</em> إلى:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Panel</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Panel&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">Footer</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./components/Footer&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;<span class="hljs-title class_">Navbar</span> /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Panel</span> /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Footer</span> /&amp;gt;
  &amp;lt;/div&amp;gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>
</code></pre>
<p>لا يزال السياق يُستخدم بالطريقة نفسها، ولا حاجة إلى أي تغييرات في المكوّنات الأخرى. فمثلاً، يبقى <em>Controls</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Controls</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> { counter, setCounter } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-keyword">const</span> increment = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter + <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> decrement = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter - <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> zero = () =&amp;gt; <span class="hljs-title function_">setCounter</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;button onClick={increment}&amp;gt;plus&amp;lt;/button&amp;gt;
      &amp;lt;button onClick={decrement}&amp;gt;minus&amp;lt;/button&amp;gt;
      &amp;lt;button onClick={zero}&amp;gt;zero&amp;lt;/button&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>الحل جيد تماماً. أصبحت حالة التطبيق بأكملها، أي قيمة العدّاد، معزولة الآن في ملف <em>CounterContext</em>. وتصل المكوّنات إلى الجزء الذي تحتاجه بالضبط من السياق باستخدام خطاف <em>useContext</em> وصيغة التفكيك في JavaScript.</p>
<p>لنجرِ تحسيناً صغيراً واحداً ونعرّف أيضاً دوال تحديث العدّاد <em>increment</em> و <em>decrement</em> و <em>zero</em> في السياق:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { createContext, useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">CounterContext</span> = <span class="hljs-title function_">createContext</span>()

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">CounterContext</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-title function_">CounterContextProvider</span> = (<span class="hljs-params">props</span>) =&gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">increment</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(counter + <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">decrement</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(counter - <span class="hljs-number">1</span>)
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">zero</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setCounter</span>(<span class="hljs-number">0</span>)
<span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    &amp;lt;<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span> value={{ counter, increment, decrement, zero }}&gt;
    <span class="hljs-comment">// END HIGHLIGHT</span>
      {props.<span class="hljs-property">children</span>}
    &amp;lt;/<span class="hljs-title class_">CounterContext</span>.<span class="hljs-property">Provider</span>&gt;
  )
}
</code></pre>
<p>الآن يمكننا استخدام الدوال المستحصل عليها من السياق مباشرة كمعالجات أحداث للأزرار:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Controls</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> { increment, decrement, zero } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&gt;
      &amp;lt;button onClick={increment}&gt;plus&amp;lt;/button&gt;
      &amp;lt;button onClick={decrement}&gt;minus&amp;lt;/button&gt;
      &amp;lt;button onClick={zero}&gt;zero&amp;lt;/button&gt;
    &amp;lt;/div&gt;
  )
}
</code></pre>
<p>لا يزال هناك مجال لتحسين آخر. إذا نظرنا إلى طريقة استخدام سياق العدّاد، نلاحظ أن الشيفرة المتكررة (boilerplate) نفسها تظهر في كلا المكوّنين اللذين يستهلكانه:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Display</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> { counter } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Controls</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> { increment, decrement, zero } = <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)
  <span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>يمكننا أن نخطو بالحل خطوة إضافية بإنشاء خطاف مخصّص يعيد السياق مباشرة. لنضفه إلى الملف <em>hooks/useCounter.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useContext } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-keyword">import</span> <span class="hljs-title class_">CounterContext</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../CounterContext&#x27;</span>

<span class="hljs-keyword">const</span> useCounter = () =&amp;gt; <span class="hljs-title function_">useContext</span>(<span class="hljs-title class_">CounterContext</span>)

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> useCounter
</code></pre>
<p>أصبح استخدام السياق الآن أبسط بخطوة:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> useCounter <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../hooks/useCounter&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Display</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> { counter } = <span class="hljs-title function_">useCounter</span>()
  <span class="hljs-comment">// ...</span>
}

<span class="hljs-keyword">import</span> useCounter <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../hooks/useCounter&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Controls</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> { increment, decrement, zero } = <span class="hljs-title function_">useCounter</span>()
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>نحن راضون عن الحل. فهو يعزل كل إدارة الحالة بالكامل داخل السياق. والمكوّنات التي تستخدم الحالة لا تعرف شيئاً عن كيفية تنفيذها. وبفضل الخطاف المخصّص، فهي لا تدرك حتى أن الحل قائم على Context API.</p>
<p>شيفرة التطبيق موجودة في مستودع GitHub <a href="https://github.com/fullstack-hy2020/context-counter" target="_blank" rel="noopener">https://github.com/fullstack-hy2020/context-counter</a>.</p>
<div class="tasks">
<p><strong>24. استعلام anecdotes، الخطوة 5</strong></p>
</div>
<div class="tasks">
<p><strong>25. استعلام anecdotes، الخطوة 6</strong></p>
</div>
<div class="tasks">
<p><strong>26. استعلام anecdotes، الخطوة 7</strong></p>
</div>
<div class="tasks">
<p><strong>27. استعلام anecdotes، الفحص النهائي</strong></p>
</div>
<div class="tasks">
<p><strong>28. مستودع GitHub الخاص بك</strong></p>
</div>
<h3 id="أي-حل-لإدارة-الحالة-ينبغي-اختياره">أي حل لإدارة الحالة ينبغي اختياره؟</h3>
<p>في الفصول 1-5، كانت كل إدارة الحالة في التطبيق تُعالج باستخدام خطاف <em>useState</em> في React. وقد تطلّبت الاستدعاءات غير المتزامنة إلى الواجهة الخلفية استخدام خطاف <em>useEffect</em> في بعض الحالات. ومن حيث المبدأ، لا حاجة إلى أي شيء آخر.</p>
<p>ثمة مشكلة دقيقة في الحلول القائمة على الحالة المُنشأة بخطاف <em>useState</em> وهي أنه إذا احتاجت مكوّنات متعددة إلى جزء من حالة التطبيق، وجب تمرير الحالة والدوال الخاصة بالتعامل معها عبر props إلى كل المكوّنات التي تتعامل مع تلك الحالة. وأحياناً يجب تمرير props عبر مكوّنات متعددة، وقد لا تكون المكوّنات الواقعة في الطريق مهتمة بالحالة بأي شكل. وتُسمّى هذه الظاهرة غير المستحبة بعض الشيء <em>prop drilling</em>.</p>
<p>على مرّ السنوات، طُوّرت عدة حلول بديلة لإدارة الحالة في تطبيقات React، يمكن استخدامها لتخفيف المواقف الإشكالية مثل prop drilling. ومع ذلك، لم يكن أي حل «نهائياً» — فلكل حل مزاياه وعيوبه، وتُطوَّر حلول جديدة طوال الوقت.</p>
<p>قد يربك هذا الوضع المبتدئ وحتى مطوّر ويب متمرس. فأي حل ينبغي استخدامه؟</p>
<p>بالنسبة لتطبيق بسيط، يُعدّ <em>useState</em> نقطة بداية جيدة بالتأكيد. وإذا كان التطبيق يتواصل مع خادم، فيمكن التعامل مع التواصل بالطريقة نفسها كما في الفصول 1-5، باستخدام حالة التطبيق الخاصة. غير أنه أصبح من الشائع حديثاً نقل التواصل وإدارة الحالة المرتبطة به، جزئياً على الأقل، إلى نطاق سيطرة TanStack Query (أو مكتبة أخرى مشابهة). وإذا كنت قلقاً بشأن useState وprop drilling الذي يستتبعه، فقد يكون استخدام السياق خياراً جيداً. وهناك أيضاً حالات قد يكون من المنطقي فيها التعامل مع جزء من الحالة بـ useState وجزء آخر بالسياقات.</p>
<p>لفترة طويلة، كان Redux أشهر حلول إدارة الحالة وأكثرها شمولاً، وهو طريقة لتنفيذ ما يُسمّى معمارية <a href="https://facebookarchive.github.io/flux/" target="_blank" rel="noopener">Flux</a>. غير أن Redux معروف بتعقيده وكثرة الشيفرة المتكررة فيه، وقد كان ذلك دافعاً لظهور حلول إدارة حالة أحدث. في هذه المادة التعليمية، حلّت مكتبة <a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener">Zustand</a> محل Redux، وهي تقدّم وظائف مكافئة بواجهة برمجية أبسط بكثير. وأصبح Zustand خياراً شائعاً خصوصاً عندما تحتاج إلى أكثر مما يقدّمه useState، لكن جهاز Redux الكامل يبدو مبالغاً فيه. وقد أصبح بعض النقد الموجّه إلى جمود Redux قديماً بفضل <a href="https://redux-toolkit.js.org/" target="_blank" rel="noopener">Redux Toolkit</a>، ولا يزال Redux مستخدماً على نطاق واسع، خاصة في المشاريع الأكبر.</p>
<p>لا يلزم استخدام Zustand ولا Redux في التطبيق بأكمله. فقد يكون من المنطقي، مثلاً، إدارة حالة النموذج خارجهما، خصوصاً في الحالات التي لا تؤثر فيها حالة النموذج على بقية التطبيق. كما أن استخدام Zustand أو Redux مع TanStack Query في التطبيق نفسه ممكن تماماً.</p>
<p>مسألة أي حل لإدارة الحالة ينبغي استخدامه ليست مباشرة إطلاقاً. فمن المستحيل إعطاء إجابة صحيحة واحدة، ومن المرجّح أيضاً أن يتبيّن أن الحل المختار دون المستوى الأمثل مع نمو التطبيق، مما يستلزم تغيير المقاربة حتى لو كان التطبيق قد دخل الإنتاج بالفعل.</p>
`,o={part:6,letter:"d",file:s,title:n,slug:a,mainImage:t,headings:p,html:e};export{o as default,s as file,p as headings,e as html,c as letter,t as mainImage,l as part,a as slug,n as title};
