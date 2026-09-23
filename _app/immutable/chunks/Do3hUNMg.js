const l=7,c="b",s="b.md",n="المزيد عن خطافات React",a="more_about_react_hooks",e="/images/part-7.svg",t=[{depth:3,id:"خطافات-react",text:"خطافات React"},{depth:3,id:"usememo",text:"useMemo"},{depth:3,id:"reactmemo",text:"React.memo"},{depth:3,id:"usecallback",text:"useCallback"},{depth:3,id:"الخطافات-المخصصة",text:"الخطافات المخصصة"},{depth:3,id:"خصائص-النشر",text:"خصائص النشر"},{depth:3,id:"المزيد-عن-الخطافات",text:"المزيد عن الخطافات"}],p=`<p>تختلف التمارين في هذا الجزء من المقرر قليلاً عن التمارين السابقة. وكالعادة، هناك بعض التمارين المتعلقة بنظرية هذا الفصل. أما الفصول الأخرى في هذا الجزء فليس لها تمارين منفصلة.</p>
<p>بالإضافة إلى ذلك، يحتوي هذا الجزء على سلسلة تمارين أكبر توسّع تطبيق BlogList الذي بنيته في الجزأين 4 و5. وتجد تلك التمارين على الرابط <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5" target="_blank" rel="noopener">https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-extension/chapter-5</a>.</p>
<h3 id="خطافات-react">خطافات React</h3>
<p>يوفّر React 18 <a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener">خطافاً مدمجاً</a> مختلفاً، وأشهرها الخطافان <a href="https://react.dev/reference/react/useState" target="_blank" rel="noopener">useState</a> و <a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noopener">useEffect</a> اللذان استخدمناهما باستفاضة حتى الآن.</p>
<p>في <a href="/part5/props_children_and_component_refs#references-to-components-with-ref" target="_blank" rel="noopener">الجزء 5</a> استخدمنا <a href="https://react.dev/reference/react/useRef" target="_blank" rel="noopener">useRef</a> و<a href="https://react.dev/reference/react/useImperativeHandle" target="_blank" rel="noopener">useImperativeHandle</a>، ما أتاح لمكوّن أن يوفّر الوصول إلى دواله لمكوّنات أخرى. وفي <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">الجزء 6</a> استخدمنا <a href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener">useContext</a> لتنفيذ حالة عامة.</p>
<p>خلال السنوات القليلة الماضية، أصبحت الخطافات الطريقة القياسية التي تكشف بها المكتبات عن واجهات API الخاصة بها. وقد رأينا أمثلة عدة على ذلك في هذا المقرر: <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener">Zustand</a> توفّر <em>useStore</em> للوصول إلى الحالة العامة، و<a href="https://reactrouter.com/" target="_blank" rel="noopener">React Router</a> يكشف عن <em>useNavigate</em> و <em>useParams</em> للتنقّل برمجياً والوصول إلى معاملات URL، و<a href="https://tanstack.com/query/latest" target="_blank" rel="noopener">React Query</a> توفّر <em>useQuery</em> و <em>useMutation</em> لإدارة حالة الخادم.</p>
<p>وكما ذُكر في <a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">الجزء 1</a>، ليست الخطافات دوالاً عادية، وعند استخدامها يجب أن نلتزم بـ<a href="https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks" target="_blank" rel="noopener">قواعد أو قيود</a> معينة. لنستعرض قواعد استخدام الخطافات، منقولة حرفياً من وثائق React الرسمية:</p>
<p><strong>لا تستدعِ الخطافات داخل الحلقات أو الشروط أو الدوال المتداخلة.</strong> بدلاً من ذلك، استخدم الخطافات دائماً في المستوى الأعلى من دالة React الخاصة بك.</p>
<p><strong>يمكنك استدعاء الخطافات فقط بينما يعرض React مكوّناً دالّياً:</strong></p>
<ul>
<li>استدعِها في المستوى الأعلى داخل جسم المكوّن الدالّي.</li>
<li>استدعِها في المستوى الأعلى داخل جسم خطاف مخصص.</li>
</ul>
<p>هناك <a href="https://www.npmjs.com/package/eslint-plugin-react-hooks" target="_blank" rel="noopener">إضافة ESlint</a> جاهزة يمكن استخدامها للتحقق من أن التطبيق يستخدم الخطافات بشكل صحيح:</p>
<p><img src="/images/mooc/6a88cc6b0ef7.webp" alt="صورة توضيحية"></p>
<p>إلى جانب الخطافات التي استخدمناها بالفعل، يوفّر React عدة خطافات مدمجة أخرى يجدر معرفتها. في هذا القسم ننظر في اثنين منها، <em>useMemo</em> و <em>useCallback</em> وكلاهما معنيّ بتحسين الأداء. بعد ذلك ننتقل إلى الخطافات المخصصة، التي تتيح لك تجميع أي توليفة من الخطافات في دالة خاصة بك قابلة لإعادة الاستخدام.</p>
<h3 id="usememo">useMemo</h3>
<p>في كل مرة يُعاد فيها عرض مكوّن React، يُنفَّذ جسم الدالة بالكامل من جديد. هذا مقبول في معظم المكوّنات، لكن أحياناً يجري المكوّن عملية حسابية مكلفة، مثل تصفية قائمة كبيرة أو ترتيب بيانات أو اشتقاق قيمة معقدة، فتؤدي إعادة تنفيذها في كل عرض إلى إهدار الوقت.</p>
<p><a href="https://react.dev/reference/react/useMemo" target="_blank" rel="noopener">useMemo</a> يتيح لك تخزين نتيجة حساب ما مؤقتاً بين عمليات العرض. وهو يقبل دالة تنفّذ الحساب ومصفوفة اعتماديات. ولا يعيد React تنفيذ الدالة إلا عندما تتغيّر إحدى الاعتماديات، وإلا فإنه يعيد النتيجة المخزّنة سابقاً.</p>
<p>لننظر إلى مكوّن يعرض قائمة كبيرة من العناصر مصفّاة حسب عبارة بحث:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> expensiveCalculation = () =&amp;gt; {
  <span class="hljs-keyword">let</span> sum = <span class="hljs-number">0</span>
  <span class="hljs-keyword">for</span> (<span class="hljs-keyword">let</span> i = <span class="hljs-number">0</span>; i &amp;lt; <span class="hljs-number">100000</span>; i++) sum += i
  <span class="hljs-keyword">return</span> sum
}

<span class="hljs-keyword">const</span> <span class="hljs-variable constant_">ITEMS</span> = <span class="hljs-title class_">Array</span>.<span class="hljs-title function_">from</span>({ <span class="hljs-attr">length</span>: <span class="hljs-number">10000</span> }, (_, i) =&amp;gt; <span class="hljs-string">\`item <span class="hljs-subst">\${i + <span class="hljs-number">1</span>}</span>\`</span>)

<span class="hljs-keyword">const</span> <span class="hljs-title class_">FilteredList</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [filter, setFilter] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [darkMode, setDarkMode] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>)

  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;filtering...&#x27;</span>)
  <span class="hljs-keyword">const</span> filtered = <span class="hljs-variable constant_">ITEMS</span>.<span class="hljs-title function_">filter</span>(item =&amp;gt; {
    <span class="hljs-title function_">expensiveCalculation</span>()
    <span class="hljs-keyword">return</span> item.<span class="hljs-title function_">includes</span>(filter)
  })

  <span class="hljs-keyword">return</span> (
    &amp;lt;div style={{ <span class="hljs-attr">background</span>: darkMode ? <span class="hljs-string">&#x27;#333&#x27;</span> : <span class="hljs-string">&#x27;#fff&#x27;</span> }}&amp;gt;
      &amp;lt;input
        value={filter}
        onChange={e =&amp;gt; <span class="hljs-title function_">setFilter</span>(e.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)}
        placeholder=<span class="hljs-string">&quot;filter items&quot;</span>
      /&amp;gt;
      &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">setDarkMode</span>(!darkMode)}&amp;gt;toggle dark mode&amp;lt;/button&amp;gt;
      &amp;lt;ul&amp;gt;
        {filtered.<span class="hljs-title function_">map</span>(item =&amp;gt; &amp;lt;li key={item}&amp;gt;{item}&amp;lt;/li&amp;gt;)}
      &amp;lt;/ul&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">FilteredList</span>
</code></pre>
<p>أصبحت تصفية القائمة الآن تستغرق وقتاً، ويعود ذلك جزئياً إلى الإبطاء المصطنع الذي أضفناه.</p>
<p>تكمن مشكلة هذا المكوّن في أن النقر على زر الوضع الداكن يؤدي إلى إعادة تصفية العناصر الـ10000 كلها رغم أن نص التصفية لم يتغيّر.</p>
<p>يمكننا إصلاح ذلك باستخدام <em>useMemo</em>:</p>
<pre><code class="language-js"><span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">import</span> { useState, useMemo } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">FilteredList</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [filter, setFilter] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [darkMode, setDarkMode] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>)

  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> filtered = <span class="hljs-title function_">useMemo</span>(() =&amp;gt; {
  <span class="hljs-comment">// END HIGHLIGHT</span>
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;filtering...&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-variable constant_">ITEMS</span>.<span class="hljs-title function_">filter</span>(item =&amp;gt; {
      <span class="hljs-title function_">expensiveCalculation</span>()
      <span class="hljs-keyword">return</span> item.<span class="hljs-title function_">includes</span>(filter)
    })
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  }, [filter])
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> (
    &amp;lt;div style={{ <span class="hljs-attr">background</span>: darkMode ? <span class="hljs-string">&#x27;#333&#x27;</span> : <span class="hljs-string">&#x27;#fff&#x27;</span> }}&amp;gt;
      <span class="hljs-comment">//...</span>
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>باستخدام <em>useMemo</em>، لا تُنفَّذ التصفية المكلفة إلا عندما تتغيّر <em>filter</em>. أما تبديل الوضع الداكن فلا يحدّث سوى لون الخلفية، وتُعاد القائمة المصفّاة المخزّنة مؤقتاً فوراً.</p>
<p>تعمل مصفوفة الاعتماديات تماماً كما في <em>useEffect</em>: يقارن React كل قيمة بالقيمة من العرض السابق. فإذا كانت جميع القيم مطابقة، أعيد استخدام القيمة المخزّنة. وإذا اختلف أي منها، أعيد تنفيذ الدالة ووُضعت النتيجة مؤقتاً للعرض التالي.</p>
<p>يمكن استخدام <em>useMemo</em> أيضاً لتخزين الكائنات والمصفوفات الممرَّرة كـ props مؤقتاً، ما يمنع عمليات إعادة العرض غير الضرورية للمكوّنات الابنة التي تعتمد على تساوي المراجع. على سبيل المثال:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [filter, setFilter] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-comment">// بدون useMemo، يكون &#x27;options&#x27; كائناً جديداً في كل عرض حتى لو لم يتغيّر filter</span>
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> options = <span class="hljs-title function_">useMemo</span>(() =&amp;gt; ({ <span class="hljs-attr">caseSensitive</span>: <span class="hljs-literal">false</span>, filter }), [filter])
  <span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">SearchResults</span> options={options} /&amp;gt;
}
</code></pre>
<p><em>useMemo</em> تحسين للأداء، ولا ينبغي اللجوء إليه افتراضياً. فـ<a href="https://wiki.c2.com/?PrematureOptimization" target="_blank" rel="noopener">التخزين المؤقت المبكر</a> يضيف تعقيداً بلا فائدة عندما يكون الحساب سريعاً. قِس أولاً، ولا تُضف <em>useMemo</em> إلا بعد أن تتأكد من أن حساباً معيناً يمثل عنق زجاجة.</p>
<h3 id="reactmemo">React.memo</h3>
<p>بينما تخزّن <em>useMemo</em> نتيجة حساب داخل مكوّن، تأخذ <a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a> مقاربة مختلفة: فهي تخزّن الخرج المعروض لمكوّن كامل. و<em>React.memo</em> ليست خطافاً بل مكوّن عالي الرتبة (higher-order component)، ونغطيها هنا لأنها تكمّل <em>useMemo</em> جيداً. فعندما يُغلَّف مكوّن بـ<em>React.memo</em>، يتخطى React إعادة عرضه إذا لم تتغيّر props الخاصة به منذ العرض الأخير.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">MyComponent</span> = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">memo</span>(({ value }) =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;rendered&#x27;</span>)
  <span class="hljs-keyword">return</span> &amp;lt;div&amp;gt;{value}&amp;lt;/div&amp;gt;
})
</code></pre>
<p>بدون <em>React.memo</em>، يُعاد عرض <em>MyComponent</em> في كل مرة يُعرض فيها المكوّن الأب، حتى لو كانت <em>value</em> هي نفسها. ومعها، يقارن React بين props القديمة والجديدة باستخدام التساوي السطحي (shallow equality)، ولا يعيد العرض إلا عندما يتغيّر شيء فعلاً.</p>
<p>لاحظ أن <em>React.memo</em> تفحص props فقط. فإذا كان المكوّن يستخدم قيمة سياق (context) أو حالته الخاصة، فسيظل يُعاد عرضه عند تغيّرها.</p>
<p>تتناغم <em>React.memo</em> طبيعياً مع <em>useMemo</em> التي تمنع إعادة تنفيذ الحسابات المكلفة، بينما تمنع <em>React.memo</em> المكوّن نفسه من إعادة العرض.</p>
<p>إذا كان مكوّن مخزّن مؤقتاً يتلقى مرجع دالة أو كائن جديداً في كل عرض، تبطل فائدة التخزين المؤقت، وهنا يأتي دور <em>useCallback</em>.</p>
<h3 id="usecallback">useCallback</h3>
<p>الدوال المعرّفة داخل مكوّن تُعاد إنشاؤها ككائنات جديدة في كل عرض. هذا غير ضار عادةً، لكنه يصبح مشكلة في حالتين محددتين:</p>
<ul>
<li>مكوّن ابن مغلَّف بـ<a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React.memo</a> يتلقى الدالة كـ prop. ولأن الدالة كائن جديد في كل مرة، يرى المكوّن الابن دائماً prop متغيّراً فيُعاد عرضه على أي حال، فتبطل فائدة التخزين المؤقت.</li>
<li>دالة مُدرجة كاعتمادية في <em>useEffect</em> أو <em>useMemo</em>. فإعادة إنشاء الدالة في كل عرض تعني أن التأثير أو القيمة المخزّنة يُعاد تنفيذه في كل عرض.</li>
</ul>
<p><a href="https://react.dev/reference/react/useCallback" target="_blank" rel="noopener">useCallback</a> تحل هذه المشكلة بتخزين الدالة نفسها مؤقتاً بين عمليات العرض، فتعيد كائن الدالة نفسه ما دامت اعتمادياتها لم تتغيّر. وهي تقبل دالة ومصفوفة اعتماديات، بمبنى مطابق لـ <em>useMemo</em>.</p>
<p>إليك مثالاً ملموساً. لدينا مكوّن <em>NoteList</em> مكلف في العرض، لذا نغلّفه بـ<em>React.memo</em>:</p>
<pre><code class="language-js"><span class="hljs-comment">// تجعل React.memo هذا المكوّن يتخطى إعادة العرض إذا لم تتغيّر props الخاصة به</span>
<span class="hljs-keyword">const</span> <span class="hljs-title class_">NoteList</span> = <span class="hljs-title function_">memo</span>(({ onDelete, notes }) =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;NoteList rendered&#x27;</span>)
  <span class="hljs-keyword">return</span> (
    &amp;lt;ul&amp;gt;
      {notes.<span class="hljs-title function_">map</span>(note =&amp;gt; (
        &amp;lt;li key={note.<span class="hljs-property">id</span>}&amp;gt;
          {note.<span class="hljs-property">content</span>}
          &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">onDelete</span>(note.<span class="hljs-property">id</span>)}&amp;gt;<span class="hljs-keyword">delete</span>&amp;lt;/button&amp;gt;
        &amp;lt;/li&amp;gt;
      ))}
    &amp;lt;/ul&amp;gt;
  )
})

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([
    { <span class="hljs-attr">id</span>: <span class="hljs-number">1</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Learn React&#x27;</span> },
    { <span class="hljs-attr">id</span>: <span class="hljs-number">2</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Learn hooks&#x27;</span> },
    { <span class="hljs-attr">id</span>: <span class="hljs-number">3</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Learn useMemo&#x27;</span> },
    { <span class="hljs-attr">id</span>: <span class="hljs-number">4</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Learn useCallback&#x27;</span> },
    { <span class="hljs-attr">id</span>: <span class="hljs-number">5</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Build something cool&#x27;</span> },
  ])
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-keyword">const</span> handleDelete = (id) =&amp;gt; {
    <span class="hljs-title function_">setNotes</span>(notes =&amp;gt; notes.<span class="hljs-title function_">filter</span>(note =&amp;gt; note.<span class="hljs-property">id</span> !== id))
  }

  <span class="hljs-keyword">const</span> handleAdd = () =&amp;gt; {
    <span class="hljs-title function_">setNotes</span>(notes =&amp;gt; [...notes, { <span class="hljs-attr">id</span>: <span class="hljs-title class_">Date</span>.<span class="hljs-title function_">now</span>(), <span class="hljs-attr">content</span>: newNote }])
    <span class="hljs-title function_">setNewNote</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  }

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;input value={newNote} onChange={e =&amp;gt; <span class="hljs-title function_">setNewNote</span>(e.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)} /&amp;gt;
      &amp;lt;button onClick={handleAdd}&amp;gt;add&amp;lt;/button&amp;gt;
      &amp;lt;<span class="hljs-title class_">NoteList</span> notes={notes} onDelete={handleDelete} /&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>المشكلة هنا أن <em>handleDelete</em> معرّفة كدالة عادية داخل <em>App</em>. ففي كل مرة يُعاد فيها عرض <em>App</em> (وهو ما يحدث مع كل ضغطة مفتاح في حقل إدخال الملاحظة)، يُنشأ كائن دالة جديد تماماً ويُمرَّر إلى <em>NoteList</em> كـ prop باسم <em>onDelete</em>.</p>
<p>من منظور <em>React.memo</em>، تغيّر الـ prop، لذا يُعاد عرض <em>NoteList</em> رغم أن القائمة نفسها لم تتغيّر:</p>
<p><img src="/images/mooc/ed3c70d1bf25.webp" alt="صورة توضيحية"></p>
<p>يمكننا إصلاح ذلك باستخدام <em>useCallback</em>، التي تعيد كائن الدالة نفسه بين عمليات العرض ما دامت اعتمادياتها لم تتغيّر:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState, useCallback, memo } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> [notes, setNotes] = <span class="hljs-title function_">useState</span>([])
  <span class="hljs-keyword">const</span> [newNote, setNewNote] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> handleDelete = <span class="hljs-title function_">useCallback</span>(<span class="hljs-function">(<span class="hljs-params">id</span>) =&gt;</span> {
    <span class="hljs-title function_">setNotes</span>(<span class="hljs-function"><span class="hljs-params">notes</span> =&gt;</span> notes.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">note</span> =&gt;</span> note.<span class="hljs-property">id</span> !== id))
  }, []) <span class="hljs-comment">// لا اعتماديات خارجية: لا تحتاج هذه الدالة إلى التغيّر أبداً</span>
<span class="hljs-comment">// END HIGHLIGHT</span>

  <span class="hljs-comment">// ...</span>
  <span class="hljs-keyword">return</span> (
    <span class="hljs-comment">// ...</span>
  )
}
</code></pre>
<p>الآن أصبحت <em>handleDelete</em> مستقرة: يعيد React كائن الدالة نفسه تماماً في كل عرض، فلا ترى <em>React.memo</em> أي تغيّر في prop الـ<em>onDelete</em> وتتخطى إعادة عرض <em>NoteList</em> بالكامل.</p>
<p>مثل <em>useMemo</em>، لا تلجأ إلى <em>useCallback</em> إلا عند وجود مشكلة ملموسة، مثل إعادة عرض مكوّن ابن مخزّن مؤقتاً بلا داعٍ أو تنفيذ <em>useEffect</em> أكثر من اللازم بسبب اعتمادية دالة. فإضافتها في كل مكان تجعل الشيفرة أصعب في القراءة دون تحقيق أي مكسب في الأداء.</p>
<h3 id="الخطافات-المخصصة">الخطافات المخصصة</h3>
<p>يتيح React إمكانية إنشاء خطافات <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">مخصصة</a>. ووفقاً للوثائق، فإن الغرض الأساسي من الخطافات المخصصة هو تسهيل إعادة استخدام المنطق المستخدم في المكوّنات:</p>
<blockquote>
<p><em>يتيح لك بناء خطافاتك الخاصة استخلاص منطق المكوّن في دوال قابلة لإعادة الاستخدام.</em></p>
</blockquote>
<p>الخطافات المخصصة دوال JavaScript عادية يمكنها استخدام أي خطافات أخرى، شرط أن تلتزم بـ<a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">قواعد الخطافات</a>. إضافة إلى ذلك، يجب أن يبدأ اسم الخطاف المخصص بكلمة <em>use</em>.</p>
<p>الفكرة الجوهرية هي أن أي منطق ذي حالة تجد نفسك تكرّره بين المكوّنات هو مرشّح للاستخلاص في خطاف مخصص. فكل استدعاء للخطاف نفسه ينشئ قطعة حالة مستقلة. وهذا ما يميّز الخطاف المخصص عن دالة مساعدة عادية.</p>
<p>نفّذنا بالفعل عدة خطافات مخصصة في الجزء 6. فقد أُنشئ الخطافان <em>useNotes</em> و<em>useNoteActions</em> في فصل <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-2" target="_blank" rel="noopener">Zustand</a>، وعُرّف <em>useCounter</em> في فصل <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management/chapter-4" target="_blank" rel="noopener">React Query وContext</a>.</p>
<h4 id="خطاف-العداد">خطاف العدّاد</h4>
<p>نفّذنا تطبيق عدّاد في <a href="/part1/component_state_event_handlers#event-handling" target="_blank" rel="noopener">الجزء 1</a> يمكن زيادة قيمته أو إنقاصها أو إعادة تعيينها. وشيفرة التطبيق كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [counter, setCounter] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;div&amp;gt;{counter}&amp;lt;/div&amp;gt;
      &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter + <span class="hljs-number">1</span>)}&amp;gt;
        plus
      &amp;lt;/button&amp;gt;
      &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">setCounter</span>(counter - <span class="hljs-number">1</span>)}&amp;gt;
        minus
      &amp;lt;/button&amp;gt;
      &amp;lt;button onClick={() =&amp;gt; <span class="hljs-title function_">setCounter</span>(<span class="hljs-number">0</span>)}&amp;gt;
        zero
      &amp;lt;/button&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>لنستخلص منطق العدّاد في خطاف مخصص. وشيفرة الخطاف كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> useCounter = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [value, setValue] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>)

  <span class="hljs-keyword">const</span> increase = () =&amp;gt; {
    <span class="hljs-title function_">setValue</span>(value + <span class="hljs-number">1</span>)
  }

  <span class="hljs-keyword">const</span> decrease = () =&amp;gt; {
    <span class="hljs-title function_">setValue</span>(value - <span class="hljs-number">1</span>)
  }

  <span class="hljs-keyword">const</span> zero = () =&amp;gt; {
    <span class="hljs-title function_">setValue</span>(<span class="hljs-number">0</span>)
  }

  <span class="hljs-keyword">return</span> {
    value,
    increase,
    decrease,
    zero
  }
}
</code></pre>
<p>يستخدم خطافنا المخصص خطاف <em>useState</em> داخلياً لإنشاء حالته. ويعيد الخطاف كائناً تشمل خصائصه قيمة العدّاد إضافة إلى دوال للتحكم في القيمة.</p>
<p>يمكن لمكوّنات React استخدام الخطاف كما هو موضح أدناه:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> counter = <span class="hljs-title function_">useCounter</span>()

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;div&amp;gt;{counter.<span class="hljs-property">value</span>}&amp;lt;/div&amp;gt;
      &amp;lt;button onClick={counter.<span class="hljs-property">increase</span>}&amp;gt;
        plus
      &amp;lt;/button&amp;gt;
      &amp;lt;button onClick={counter.<span class="hljs-property">decrease</span>}&amp;gt;
        minus
      &amp;lt;/button&amp;gt;
      &amp;lt;button onClick={counter.<span class="hljs-property">zero</span>}&amp;gt;
        zero
      &amp;lt;/button&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>بهذه الطريقة يمكننا نقل حالة مكوّن <em>App</em> والتحكم فيها بالكامل إلى خطاف <em>useCounter</em>. فإدارة حالة العدّاد ومنطقه أصبحت الآن مسؤولية الخطاف المخصص.</p>
<p>ويمكن <em>إعادة استخدام</em> الخطاف نفسه في التطبيق الذي كان يتتبع عدد النقرات على الزرين الأيسر والأيمن:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> left = <span class="hljs-title function_">useCounter</span>()
  <span class="hljs-keyword">const</span> right = <span class="hljs-title function_">useCounter</span>()

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      {left.<span class="hljs-property">value</span>}
      &amp;lt;button onClick={left.<span class="hljs-property">increase</span>}&amp;gt;
        left
      &amp;lt;/button&amp;gt;
      &amp;lt;button onClick={right.<span class="hljs-property">increase</span>}&amp;gt;
        right
      &amp;lt;/button&amp;gt;
      {right.<span class="hljs-property">value</span>}
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>ينشئ التطبيق <em>عدّادين</em> منفصلين تماماً. يُسند الأول إلى المتغير <em>left</em> والآخر إلى المتغير <em>right</em>. وكل استدعاء لـ<em>useCounter</em> ينشئ قطعة الحالة المستقلة الخاصة به.</p>
<h4 id="الخطافات-المخصصة-وإعادة-عرض-المكونات">الخطافات المخصصة وإعادة عرض المكوّنات</h4>
<p>يطرح السؤال التالي نفسه هنا: متى يُعاد فعلاً عرض مكوّن يستخدم خطافاً مخصصاً؟</p>
<p>الجواب بسيط متى فهمت ما هو الخطاف المخصص حقاً. فالخطاف المخصص ليس كياناً منفصلاً من منظور المكوّن، بل هو مجرد قطعة من منطق المكوّن نفسه نُقلت إلى دالة منفصلة. وهذا يعني أن كل الحالة والتأثيرات المعرّفة داخل الخطاف تنتمي إلى المكوّن الذي يستدعي الخطاف، لا إلى الخطاف نفسه.</p>
<p>وبالتالي، فإن قواعد إعادة العرض هي نفسها تماماً كما مع الخطافات المدمجة. فيُعاد عرض المكوّن عندما تتغيّر حالة تُدار داخل الخطاف، أو تتغيّر قيمة سياق يشترك فيها الخطاف، أو يتسبب أي خطاف يستدعيه الخطاف المخصص داخلياً في إعادة عرض.</p>
<p>في المقابل، لا تتسبب أشياء مثل إعادة إسناد متغيرات عادية داخل الخطاف، أو تغيّر المعاملات الممرَّرة إلى الخطاف من تلقاء نفسها، في إعادة عرض.</p>
<p>غير أن المعاملات تستحق نظرة أدق. فتمرير قيمة جديدة إلى خطاف لا يجدول إعادة عرض بحد ذاته، لكن إذا استخدم الخطاف ذلك المعامل كاعتمادية في <em>useEffect</em> أو <em>useMemo</em>، فإن تغيّر المعامل سيؤدي إلى إعادة تنفيذ التأثير أو القيمة المخزّنة، وإذا استدعى ذلك بدوره دالة تعيين حالة، فسيُعاد عرض المكوّن.</p>
<p>طريقة مفيدة للتفكير في الأمر: تخيّل أنك نسخت كل الشيفرة الموجودة داخل خطافك المخصص ولصقتها مباشرة في المكوّن. سيكون سلوك إعادة العرض مطابقاً. فالخطاف مجرد طريقة لتنظيم تلك الشيفرة، وليس حداً يعامله React معاملة خاصة.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">useCounter</span> = (<span class="hljs-params"></span>) =&gt; {
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">const</span> [count, setCount] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>) <span class="hljs-comment">// هذه الحالة تنتمي إلى المكوّن المستدعي</span>
<span class="hljs-comment">// END HIGHLIGHT</span>
  <span class="hljs-keyword">return</span> {
    count,
    <span class="hljs-attr">increment</span>: <span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">setCount</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c + <span class="hljs-number">1</span>)
  }
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">MyComponent</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> { count, increment } = <span class="hljs-title function_">useCounter</span>()
<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-comment">// يُعاد العرض كلما حُدّثت حالة count داخل الخطاف</span>
<span class="hljs-comment">// END HIGHLIGHT</span>
}
</code></pre>
<h4 id="خطاف-حقل-النموذج">خطاف حقل النموذج</h4>
<p>التعامل مع النماذج في React صعب بعض الشيء. يعرض التطبيق التالي على المستخدم نموذجاً يطلب منه إدخال اسمه وتاريخ ميلاده وطوله:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [name, setName] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [born, setBorn] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)
  <span class="hljs-keyword">const</span> [height, setHeight] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;form&amp;gt;
        <span class="hljs-attr">name</span>:
        &amp;lt;input
          type=<span class="hljs-string">&#x27;text&#x27;</span>
          value={name}
          onChange={(event) =&amp;gt; <span class="hljs-title function_">setName</span>(event.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)}
        /&amp;gt;
        &amp;lt;br/&amp;gt;
        <span class="hljs-attr">birthdate</span>:
        &amp;lt;input
          type=<span class="hljs-string">&#x27;date&#x27;</span>
          value={born}
          onChange={(event) =&amp;gt; <span class="hljs-title function_">setBorn</span>(event.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)}
        /&amp;gt;
        &amp;lt;br /&amp;gt;
        <span class="hljs-attr">height</span>:
        &amp;lt;input
          type=<span class="hljs-string">&#x27;number&#x27;</span>
          value={height}
          onChange={(event) =&amp;gt; <span class="hljs-title function_">setHeight</span>(event.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)}
        /&amp;gt;
      &amp;lt;/form&amp;gt;
      &amp;lt;div&amp;gt;
        {name} {born} {height}
      &amp;lt;/div&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>لكل حقل في النموذج حالته الخاصة. ولإبقاء حالة النموذج متزامنة مع البيانات التي يوفرها المستخدم، علينا تسجيل معالج <em>onChange</em> مناسب لكل عنصر من عناصر <em>input</em>. والنمط متطابق في كل حقل، ولا يختلف سوى اسم متغير الحالة. وهذا بالضبط نوع التكرار الذي صُممت الخطافات المخصصة للتخلص منه.</p>
<p>لنعرّف خطافنا المخصص <em>useField</em> الذي يبسّط إدارة حالة النموذج:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> useField = (type) =&amp;gt; {
  <span class="hljs-keyword">const</span> [value, setValue] = <span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-keyword">const</span> onChange = (event) =&amp;gt; {
    <span class="hljs-title function_">setValue</span>(event.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)
  }

  <span class="hljs-keyword">return</span> {
    type,
    value,
    onChange
  }
}
</code></pre>
<p>تستقبل دالة الخطاف نوع حقل الإدخال كمعامل. وهي تعيد جميع السمات التي يحتاجها عنصر <em>input</em>: نوعه وقيمته ومعالج onChange.</p>
<p>ويمكن استخدام الخطاف بالطريقة التالية:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> name = <span class="hljs-title function_">useField</span>(<span class="hljs-string">&#x27;text&#x27;</span>)
  <span class="hljs-comment">// ...</span>

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;form&amp;gt;
        &amp;lt;input
          type={name.<span class="hljs-property">type</span>}
          value={name.<span class="hljs-property">value</span>}
          onChange={name.<span class="hljs-property">onChange</span>}
        /&amp;gt;
        <span class="hljs-comment">// ...</span>
      &amp;lt;/form&amp;gt;
<span class="hljs-comment">// ...</span>
      &amp;lt;div&amp;gt;
        <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
        {name.<span class="hljs-property">value</span>} {born} {height}
        <span class="hljs-comment">// END HIGHLIGHT</span>
      &amp;lt;/div&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<h3 id="خصائص-النشر">خصائص النشر</h3>
<p>يمكننا تبسيط الأمور أكثر قليلاً. فلأن كائن <em>name</em> يحتوي بالضبط على جميع الخصائص التي يتوقع عنصر <em>input</em> استقبالها كـ props، يمكننا تمرير الـ props إلى العنصر باستخدام <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener">صيغة النشر</a> بالطريقة التالية:</p>
<pre><code>&amp;lt;input {...name} /&amp;gt;
</code></pre>
<p>وكما يوضح <a href="https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax" target="_blank" rel="noopener">المثال</a> في وثائق React، فإن الطريقتين التاليتين لتمرير props إلى مكوّن تعطيان النتيجة نفسها تماماً:</p>
<pre><code class="language-js">&amp;lt;<span class="hljs-title class_">Greeting</span> firstName=<span class="hljs-string">&#x27;Arto&#x27;</span> lastName=<span class="hljs-string">&#x27;Hellas&#x27;</span> /&amp;gt;

<span class="hljs-keyword">const</span> person = {
  <span class="hljs-attr">firstName</span>: <span class="hljs-string">&#x27;Arto&#x27;</span>,
  <span class="hljs-attr">lastName</span>: <span class="hljs-string">&#x27;Hellas&#x27;</span>
}

&amp;lt;<span class="hljs-title class_">Greeting</span> {...person} /&amp;gt;
</code></pre>
<p>فيصبح التطبيق مبسّطاً بالشكل التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> name = <span class="hljs-title function_">useField</span>(<span class="hljs-string">&#x27;text&#x27;</span>)
  <span class="hljs-keyword">const</span> born = <span class="hljs-title function_">useField</span>(<span class="hljs-string">&#x27;date&#x27;</span>)
  <span class="hljs-keyword">const</span> height = <span class="hljs-title function_">useField</span>(<span class="hljs-string">&#x27;number&#x27;</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;form&amp;gt;
        <span class="hljs-attr">name</span>:
        &amp;lt;input  {...name} /&amp;gt;
        &amp;lt;br/&amp;gt;
        <span class="hljs-attr">birthdate</span>:
        &amp;lt;input {...born} /&amp;gt;
        &amp;lt;br /&amp;gt;
        <span class="hljs-attr">height</span>:
        &amp;lt;input {...height} /&amp;gt;
      &amp;lt;/form&amp;gt;
      &amp;lt;div&amp;gt;
        {name.<span class="hljs-property">value</span>} {born.<span class="hljs-property">value</span>} {height.<span class="hljs-property">value</span>}
      &amp;lt;/div&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>يصبح التعامل مع النماذج أبسط بكثير عندما تُغلَّف التفاصيل الدقيقة المزعجة المتعلقة بمزامنة حالة النموذج داخل خطافنا المخصص.</p>
<h4 id="حفظ-الحالة-باستمرار-باستخدام-خطاف-مخصص">حفظ الحالة باستمرار باستخدام خطاف مخصص</h4>
<p>يمكن للخطافات المخصصة أن تجمع عدة خطافات مدمجة لتغليف سلوك أكثر تعقيداً. ومن الميزات الشائعة الحاجة إلى حفظ الحالة في <em>localStorage</em> لتظل باقية بعد تحديث الصفحة. وهذا خطاف <em>useLocalStorage</em> يلفّ <em>useState</em> ويبقي القيمة متزامنة مع localStorage:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>

<span class="hljs-keyword">const</span> useLocalStorage = (key, initialValue) =&amp;gt; {
  <span class="hljs-keyword">const</span> [storedValue, setStoredValue] = <span class="hljs-title function_">useState</span>(() =&amp;gt; {
    <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> item = <span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">getItem</span>(key)
      <span class="hljs-keyword">return</span> item ? <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">parse</span>(item) : initialValue
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-keyword">return</span> initialValue
    }
  })

  <span class="hljs-keyword">const</span> setValue = (value) =&amp;gt; {
    <span class="hljs-keyword">try</span> {
      <span class="hljs-title function_">setStoredValue</span>(value)
      <span class="hljs-variable language_">window</span>.<span class="hljs-property">localStorage</span>.<span class="hljs-title function_">setItem</span>(key, <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(value))
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error)
    }
  }

  <span class="hljs-keyword">return</span> [storedValue, setValue]
}
</code></pre>
<p>يقبل الخطاف مفتاح تخزين وقيمة أولية. وفي العرض الأول يقرأ من localStorage، ويرجع إلى <em>initialValue</em> إذا لم يكن هناك شيء مخزّن بعد. ودالة التعيين المعادة تحدّث حالة React وlocalStorage في الوقت نفسه.</p>
<p>ويبدو المكوّن الذي يستخدمه تماماً كالمكوّن الذي يستخدم <em>useState</em> العادي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> [name, setName] = <span class="hljs-title function_">useLocalStorage</span>(<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)

  <span class="hljs-keyword">return</span> (
    &amp;lt;div&amp;gt;
      &amp;lt;input value={name} onChange={e =&amp;gt; <span class="hljs-title function_">setName</span>(e.<span class="hljs-property">target</span>.<span class="hljs-property">value</span>)} /&amp;gt;
      &amp;lt;p&amp;gt;<span class="hljs-title class_">Hello</span>, {name}! (your name is stored <span class="hljs-keyword">in</span> <span class="hljs-variable language_">localStorage</span>)&amp;lt;/p&amp;gt;
    &amp;lt;/div&amp;gt;
  )
}
</code></pre>
<p>لا يعرف المكوّن شيئاً عن تورّط localStorage. فهذا الشأن مخفي بالكامل داخل الخطاف.</p>
<h3 id="المزيد-عن-الخطافات">المزيد عن الخطافات</h3>
<p>الخطافات المخصصة ليست مجرد أداة لإعادة استخدام الشيفرة، بل توفر أيضاً طريقة أفضل لتقسيمها إلى أجزاء معيارية أصغر.</p>
<p>بدأ الإنترنت يمتلئ بمزيد من المواد المفيدة المتعلقة بالخطافات. والمصادر التالية تستحق الاطلاع:</p>
<ul>
<li><a href="https://github.com/rehooks/awesome-react-hooks" target="_blank" rel="noopener">موارد رائعة عن خطافات React</a></li>
<li><a href="https://usehooks.com/" target="_blank" rel="noopener">وصفات سهلة الفهم لخطافات React من Gabe Ragland</a></li>
</ul>
<div class="tasks">
<p><strong>1. خطاف useField</strong></p>
</div>
<div class="tasks">
<p><strong>2. useField مع إعادة التعيين</strong></p>
</div>
<div class="tasks">
<p><strong>3. إصلاح مشكلة النشر 1</strong></p>
</div>
<div class="tasks">
<p><strong>4. useAnecdotes الخطوة 1</strong></p>
</div>
<div class="tasks">
<p><strong>5. useAnecdotes الخطوة 2</strong></p>
</div>
<div class="tasks">
<p><strong>6. useAnecdotes الخطوة 3</strong></p>
</div>
<div class="tasks">
<p><strong>7. مراجعة anecdotes</strong></p>
</div>
`,o={part:7,letter:"b",file:s,title:n,slug:a,mainImage:e,headings:t,html:p};export{o as default,s as file,t as headings,p as html,c as letter,e as mainImage,l as part,a as slug,n as title};
