const p=10,c="c",s="c.md",a="أساسيات React Native",n="react_native_basics",e="/images/part-10.svg",l=[{depth:2,id:"المكونات-الأساسية",text:"المكوّنات الأساسية"},{depth:2,id:"تثبيت-الاعتماديات-في-مشروع-expo",text:"تثبيت الاعتماديات في مشروع Expo"},{depth:2,id:"هيكلة-مشروعنا",text:"هيكلة مشروعنا"},{depth:2,id:"إعادة-تحميل-التطبيق-يدويا",text:"إعادة تحميل التطبيق يدوياً"},{depth:2,id:"الأنماط",text:"الأنماط"},{depth:2,id:"واجهة-مستخدم-متسقة-باستخدام-الثيم",text:"واجهة مستخدم متسقة باستخدام الثيم"},{depth:2,id:"استخدام-flexbox-للتخطيط",text:"استخدام flexbox للتخطيط"},{depth:2,id:"نمط-شريط-الحالة",text:"نمط شريط الحالة"},{depth:2,id:"التوجيه",text:"التوجيه"},{depth:2,id:"إدارة-حالة-النموذج",text:"إدارة حالة النموذج"},{depth:2,id:"التحقق-من-صحة-النموذج",text:"التحقق من صحة النموذج"},{depth:2,id:"الشيفرة-الخاصة-بالمنصة",text:"الشيفرة الخاصة بالمنصة"}],t=`<p>الآن بعد أن أعددنا بيئة التطوير لدينا، يمكننا الخوض في أساسيات React Native والبدء بتطوير تطبيقنا. في هذا القسم، سنتعلم كيفية بناء واجهات المستخدم باستخدام المكوّنات الأساسية في React Native، وكيفية إضافة خصائص الأنماط إلى هذه المكوّنات الأساسية، وكيفية الانتقال بين العروض، وكيفية إدارة حالة النموذج بكفاءة.</p>
<h2 id="المكونات-الأساسية">المكوّنات الأساسية</h2>
<p>تعلمنا في الأجزاء السابقة أنه يمكننا استخدام React لتعريف المكوّنات كدوال، تستقبل props كوسيط وتُعيد شجرة من عناصر React. وتُمثَّل هذه الشجرة عادةً بصيغة JSX. وفي بيئة المتصفح، استخدمنا مكتبة <a href="https://react.dev/reference/react-dom" target="_blank" rel="noreferrer noopener">ReactDOM</a> لتحويل هذه المكوّنات إلى شجرة DOM يمكن للمتصفح عرضها. وإليك مثالاً ملموساً على مكوّن بسيط جداً:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">HelloWorld</span> = props =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;div&amp;gt;<span class="hljs-title class_">Hello</span> world!&amp;lt;/div&amp;gt;;
};
</code></pre>
<p>يعيد مكوّن <code>HelloWorld</code> عنصر <em>div</em> وحيداً أُنشئ باستخدام صيغة JSX. وقد نتذكر أن صيغة JSX هذه تُصرَّف إلى استدعاءات للدالة <code>React.createElement</code>، مثل هذا:</p>
<pre><code>React.createElement('div', null, 'Hello world!');
</code></pre>
<p>ينشئ هذا السطر من الشيفرة عنصر <em>div</em> دون أي props ومع عنصر ابن وحيد هو نص <em>&quot;Hello world&quot;</em>. وعندما نعرض هذا المكوّن في عنصر DOM جذري باستخدام الدالة <code>render</code>، سيُعرض عنصر <em>div</em> كعنصر DOM المقابل له.</p>
<p>وكما نرى، فإن React غير مرتبطة ببيئة معينة مثل بيئة المتصفح. وبدلاً من ذلك، هناك مكتبات مثل ReactDOM يمكنها عرض <em>مجموعة من المكوّنات المعرّفة مسبقاً</em>، مثل عناصر DOM، في بيئة محددة. وفي React Native تُسمّى هذه المكوّنات المعرّفة مسبقاً <em>المكوّنات الأساسية</em>.</p>
<p><a href="https://reactnative.dev/docs/intro-react-native-components" target="_blank" rel="noreferrer noopener">المكوّنات الأساسية</a> هي مجموعة من المكوّنات التي يوفّرها React Native، والتي تستخدم خلف الكواليس المكوّنات الأصلية للمنصة. لنُنفّذ المثال السابق باستخدام React Native:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">HelloWorld</span> = props =&gt; {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">Text</span>&gt;<span class="hljs-title class_">Hello</span> world!&amp;lt;<span class="hljs-regexp">/Text&gt;; /</span>/ <span class="hljs-variable constant_">HIGHLIGHT</span> <span class="hljs-variable constant_">LINE</span>
};
</code></pre>
<p>إذن نستورد مكوّن <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> من React Native ونستبدل عنصر <code>div</code> بعنصر <code>Text</code>. ولكثير من عناصر DOM المألوفة نظيراتها في React Native. وإليك بعض الأمثلة المختارة من <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">وثائق المكوّنات الأساسية</a> في React Native:</p>
<ul>
<li>مكوّن <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> هو <em>المكوّن الوحيد</em> في React Native الذي يمكن أن يحتوي على أبناء نصية. وهو مشابه مثلاً لعنصري <code>&lt;strong&gt;</code> و<code>&lt;h1&gt;</code>.</li>
<li>مكوّن <a href="https://reactnative.dev/docs/view" target="_blank" rel="noreferrer noopener">View</a> هو لبنة بناء واجهة المستخدم الأساسية المشابهة لعنصر <code>&lt;div&gt;</code>.</li>
<li>مكوّن <a href="https://reactnative.dev/docs/textinput" target="_blank" rel="noreferrer noopener">TextInput</a> هو مكوّن حقل نصي مشابه لعنصر <code>&lt;input&gt;</code>.</li>
<li>مكوّن <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> مخصّص لالتقاط أحداث الضغط المختلفة. وهو مشابه مثلاً لعنصر <code>&lt;button&gt;</code>.</li>
</ul>
<p>هناك بعض الفروق الجديرة بالملاحظة بين المكوّنات الأساسية وعناصر DOM. الفرق الأول أن مكوّن <code>Text</code> هو <em>المكوّن الوحيد</em> في React Native الذي يمكن أن يحتوي على أبناء نصية. وهذا يعني أنه لا يمكنك، مثلاً، استبدال مكوّن <code>Text</code> بمكوّن <code>View</code> في المثال السابق.</p>
<p>الفرق الثاني الجدير بالملاحظة يتعلق بمعالجات الأحداث. فعند العمل مع عناصر DOM اعتدنا إضافة معالجات أحداث مثل <code>onClick</code> إلى أي عنصر تقريباً مثل <code>&lt;div&gt;</code> و<code>&lt;button&gt;</code>. أما في React Native فعلينا قراءة <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">وثائق API</a> بعناية لمعرفة معالجات الأحداث (وكذلك props الأخرى) التي يقبلها المكوّن. فعلى سبيل المثال، يوفّر مكوّن <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> خصائص للاستماع إلى أنواع مختلفة من أحداث الضغط. ويمكننا مثلاً استخدام خاصية <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">onPress</a> في المكوّن للاستماع إلى أحداث الضغط:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">Pressable</span>, <span class="hljs-title class_">Alert</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">PressableText</span> = props =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">Pressable</span>
      onPress={() =&amp;gt; <span class="hljs-title class_">Alert</span>.<span class="hljs-title function_">alert</span>(<span class="hljs-string">&#x27;You pressed the text!&#x27;</span>)}
    &amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">You</span> can press me&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
    &amp;lt;/<span class="hljs-title class_">Pressable</span>&amp;gt;
  );
};
</code></pre>
<h2 id="تثبيت-الاعتماديات-في-مشروع-expo">تثبيت الاعتماديات في مشروع Expo</h2>
<p>في الأجزاء السابقة من المقرر، ثبّتنا المكتبات أساساً كاعتماديات للمشروع باستخدام الأمر <code>npm install</code>. غير أنه عند تثبيت مكتبات Expo وReact Native، يُوصى باستخدام الأمر <code>npx expo install</code> بدلاً من ذلك. فهذا يتيح لواجهة سطر أوامر Expo اختيار إصدار من المكتبة يتوافق مع المشروع وإصدار SDK الخاص به.</p>
<p>سنحتاج قريباً إلى مكتبة <em>expo-constants</em> التي تزوّد التطبيق بمعلومات البيئة مثل ارتفاع شريط الحالة الصحيح. ثبّت المكتبة بالأمر:</p>
<pre><code class="language-bash">npx expo install expo-constants
</code></pre>
<p>وإذا لم تكن متأكداً مما إذا كانت المكتبة تحتوي على شيفرة أصلية خاصة بـ Expo أو React Native، فيمكنك دائماً تثبيتها باستخدام الأمر <code>npx expo install</code>. وإذا لم يتعرّف Expo على الحزمة، فسيعود إلى تثبيتها باستخدام الأمر العادي <code>npm install</code>.</p>
<h2 id="هيكلة-مشروعنا">هيكلة مشروعنا</h2>
<p>الآن بعد أن اكتسبنا فهماً أساسياً للمكوّنات الأساسية، لنبدأ بإعطاء مشروعنا بعض الهيكلة. أنشئ مجلد <em>src</em> في المجلد الجذري لمشروعك، وأنشئ داخل مجلد <em>src</em> مجلد <em>components</em>.</p>
<p>وفي مجلد <em>components</em> أنشئ ملف <em>Main.jsx</em> بالمحتوى التالي:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Constants</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;expo-constants&#x27;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">StyleSheet</span>, <span class="hljs-title class_">View</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">container</span>: {
    <span class="hljs-attr">marginTop</span>: <span class="hljs-title class_">Constants</span>.<span class="hljs-property">statusBarHeight</span>,
    <span class="hljs-attr">flex</span>: <span class="hljs-number">1</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Main</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">container</span>}&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">Rate</span> <span class="hljs-title class_">Repository</span> <span class="hljs-title class_">Application</span>&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
  );
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Main</span>;
</code></pre>
<p>بعد ذلك، لنستخدم مكوّن <code>Main</code> في مكوّن <code>App</code> داخل ملف <em>App.js</em> الموجود في المجلد الجذري لمشروعنا. استبدل المحتوى الحالي للملف بهذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Main</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./src/components/Main&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">App</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">Main</span> /&amp;gt;;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>;
</code></pre>
<h2 id="إعادة-تحميل-التطبيق-يدويا">إعادة تحميل التطبيق يدوياً</h2>
<p>كما رأينا، سيعيد Expo تحميل التطبيق تلقائياً عند إجراء تغييرات على الشيفرة. غير أنه قد تكون هناك أوقات لا تعمل فيها إعادة التحميل التلقائي، فيلزم إعادة تحميل التطبيق يدوياً. وفي واجهة سطر أوامر Expo، يمكنك الضغط على <code>r</code> لإعادة التحميل؛ وهذا يفعّل إعادة التحميل عادةً.</p>
<p>ويمكن تحقيق ذلك أيضاً عبر قائمة المطوّر داخل التطبيق. ويمكنك الوصول إلى قائمة المطوّر بهزّ جهازك أو باختيار &quot;Shake Gesture&quot; داخل قائمة Hardware في محاكي iOS. ويمكنك أيضاً استخدام اختصار لوحة المفاتيح <code>⌘D</code> عندما يعمل تطبيقك في محاكي iOS، أو <code>⌘M</code> عند التشغيل في محاكي Android على نظام Mac OS، و<code>Ctrl+M</code> على Windows وLinux.</p>
<p>وبمجرد فتح قائمة المطوّر، اضغط ببساطة &quot;Reload&quot; لإعادة تحميل التطبيق. وبعد إعادة تحميل التطبيق، ينبغي أن تعمل عمليات إعادة التحميل التلقائية دون الحاجة إلى إعادة تحميل يدوية.</p>
<div class="tasks">
<p><strong>3. قائمة المستودعات المُقيَّمة</strong></p>
</div>
<h2 id="الأنماط">الأنماط</h2>
<p>الآن بعد أن أصبح لدينا فهم أساسي لكيفية عمل المكوّنات الأساسية ويمكننا استخدامها لبناء واجهة مستخدم بسيطة، حان وقت إضافة بعض الأنماط. في <a href="/part2/adding_styles_to_react_app" target="_blank" rel="noreferrer noopener">الجزء 2</a> تعلمنا أنه في بيئة المتصفح يمكننا تعريف خصائص أنماط مكوّنات React باستخدام CSS. وكان لدينا خيار تعريف هذه الأنماط مضمّنة باستخدام خاصية <code>style</code> أو في ملف CSS بمحدّد مناسب.</p>
<p>هناك أوجه تشابه كثيرة في طريقة إرفاق خصائص الأنماط بالمكوّنات الأساسية في React Native وطريقة إرفاقها بعناصر DOM. ففي React Native تقبل معظم المكوّنات الأساسية خاصية تُسمّى <code>style</code>. وتقبل خاصية <code>style</code> كائناً يحوي خصائص الأنماط وقيمها. وهذه الخصائص هي في معظم الحالات نفسها كما في CSS، غير أن أسماء الخصائص تُكتب بصيغة <em>camelCase</em>. وهذا يعني أن خصائص CSS مثل <code>padding-top</code> و<code>font-size</code> تُكتب <code>paddingTop</code> و<code>fontSize</code>. وإليك مثالاً بسيطاً على كيفية استخدام خاصية <code>style</code>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">View</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">BigBlueText</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span> style={{ <span class="hljs-attr">padding</span>: <span class="hljs-number">20</span> }}&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span> style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;blue&#x27;</span>, <span class="hljs-attr">fontSize</span>: <span class="hljs-number">24</span>, <span class="hljs-attr">fontWeight</span>: <span class="hljs-string">&#x27;700&#x27;</span> }}&amp;gt;
        <span class="hljs-title class_">Big</span> blue text
      &amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
  );
};
</code></pre>
<p>إضافةً إلى أسماء الخصائص، ربما لاحظت فرقاً آخر في المثال. ففي CSS تكون القيم الرقمية للخصائص عادةً مصحوبة بوحدة مثل <em>px</em> أو <em>%</em> أو <em>em</em> أو <em>rem</em>. أما في React Native فجميع قيم الخصائص المتعلقة بالأبعاد مثل <code>width</code> و<code>height</code> و<code>padding</code> و<code>margin</code> وكذلك أحجام الخطوط تكون <em>دون وحدة</em>. وتمثّل هذه القيم الرقمية بلا وحدة <em>بكسلات مستقلة عن الكثافة</em>. وإذا كنت تتساءل عن خصائص الأنماط المتاحة لمكوّنات أساسية معينة، فراجع <a href="https://github.com/vhpoet/react-native-styling-cheat-sheet" target="_blank" rel="noreferrer noopener">ورقة أنماط React Native المرجعية</a>.</p>
<p>بشكل عام، لا يُعدّ تعريف الأنماط مباشرة في خاصية <code>style</code> فكرة جيدة، لأنه يجعل المكوّنات متضخمة وغير واضحة. وبدلاً من ذلك، ينبغي تعريف الأنماط خارج دالة عرض المكوّن باستخدام الدالة <a href="https://reactnative.dev/docs/stylesheet#create" target="_blank" rel="noreferrer noopener">StyleSheet.create</a>. وتقبل الدالة <code>StyleSheet.create</code> وسيطاً وحيداً هو كائن يتألف من كائنات أنماط مُسمّاة، وهي تُنشئ مرجع نمط StyleSheet من الكائن المعطى. وإليك مثالاً على كيفية إعادة هيكلة المثال السابق باستخدام الدالة <code>StyleSheet.create</code>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">View</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">container</span>: {
    <span class="hljs-attr">padding</span>: <span class="hljs-number">20</span>,
  },
  <span class="hljs-attr">text</span>: {
    <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;blue&#x27;</span>,
    <span class="hljs-attr">fontSize</span>: <span class="hljs-number">24</span>,
    <span class="hljs-attr">fontWeight</span>: <span class="hljs-string">&#x27;700&#x27;</span>,
  },
});
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">BigBlueText</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">container</span>}&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
      &amp;lt;<span class="hljs-title class_">Text</span> style={styles.<span class="hljs-property">text</span>}&gt; <span class="hljs-comment">// HIGHLIGHT LINE</span>
        <span class="hljs-title class_">Big</span> blue text
      &amp;lt;/<span class="hljs-title class_">Text</span>&gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&gt;
  );
};
</code></pre>
<p>أنشأنا كائني نمط مُسمّيين، <code>styles.container</code> و<code>styles.text</code>. ويمكننا داخل المكوّن الوصول إلى كائنات أنماط محددة بالطريقة نفسها التي نصل بها إلى أي مفتاح في كائن عادي.</p>
<p>إضافةً إلى كائن، تقبل خاصية <code>style</code> أيضاً مصفوفة من الكائنات. وفي حالة المصفوفة، تُدمج الكائنات من اليسار إلى اليمين بحيث تكون أولوية خصائص الأنماط اللاحقة أعلى. ويعمل هذا بشكل تعاودي، فيمكن أن تكون لدينا مثلاً مصفوفة تحتوي على مصفوفة من الأنماط وهكذا. وإذا احتوت المصفوفة على قيم تُقيَّم إلى false، مثل <code>null</code> أو <code>undefined</code>، فتُتجاهل هذه القيم. وهذا يسهّل تعريف <em>أنماط شرطية</em> مثلاً بناءً على قيمة prop. وإليك مثالاً على الأنماط الشرطية:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">text</span>: {
    <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;grey&#x27;</span>,
    <span class="hljs-attr">fontSize</span>: <span class="hljs-number">14</span>,
  },
  <span class="hljs-attr">blueText</span>: {
    <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;blue&#x27;</span>,
  },
  <span class="hljs-attr">bigText</span>: {
    <span class="hljs-attr">fontSize</span>: <span class="hljs-number">24</span>,
    <span class="hljs-attr">fontWeight</span>: <span class="hljs-string">&#x27;700&#x27;</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">FancyText</span> = ({ isBlue, isBig, children }) =&amp;gt; {
  <span class="hljs-keyword">const</span> textStyles = [
    styles.<span class="hljs-property">text</span>,
    isBlue &amp;amp;&amp;amp; styles.<span class="hljs-property">blueText</span>,
    isBig &amp;amp;&amp;amp; styles.<span class="hljs-property">bigText</span>,
  ];

  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">Text</span> style={textStyles}&amp;gt;{children}&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;;
};

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Main</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;&amp;gt;
      &amp;lt;<span class="hljs-title class_">FancyText</span>&amp;gt;<span class="hljs-title class_">Simple</span> text&amp;lt;/<span class="hljs-title class_">FancyText</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">FancyText</span> isBlue&amp;gt;<span class="hljs-title class_">Blue</span> text&amp;lt;/<span class="hljs-title class_">FancyText</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">FancyText</span> isBig&amp;gt;<span class="hljs-title class_">Big</span> text&amp;lt;/<span class="hljs-title class_">FancyText</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">FancyText</span> isBig isBlue&amp;gt;
        <span class="hljs-title class_">Big</span> blue text
      &amp;lt;/<span class="hljs-title class_">FancyText</span>&amp;gt;
    &amp;lt;/&amp;gt;
  );
};
</code></pre>
<p>تُعرَّف props الآن دون قيمة صريحة:</p>
<pre><code>&amp;lt;FancyText isBlue&amp;gt;Blue text&amp;lt;/FancyText&amp;gt;
</code></pre>
<p>في JSX، تزويد prop بدون قيمة هو صيغة خاصة تعني نفس معنى ={true}. ولذلك فإن السطرين التاليين متكافئان:</p>
<pre><code>&amp;lt;FancyText isBlue&amp;gt;Blue text&amp;lt;/FancyText&amp;gt;
&amp;lt;FancyText isBlue={true}&amp;gt;Blue text&amp;lt;/FancyText&amp;gt;
</code></pre>
<p>في المثال، نستخدم المعامل <code>&amp;&amp;</code> مع التعبير <code>condition &amp;&amp; exprIfTrue</code>:</p>
<pre><code class="language-js">    <span class="hljs-keyword">const</span> textStyles = [
    styles.<span class="hljs-property">text</span>,
    isBlue &amp;amp;&amp;amp; styles.<span class="hljs-property">blueText</span>, <span class="hljs-comment">// HIGHLIGHT LINE</span>
    isBig &amp;amp;&amp;amp; styles.<span class="hljs-property">bigText</span>,
  ];
</code></pre>
<p>فمثلاً، في السطر المميّز، يعطي التعبير <code>styles.blueText</code> إذا قُيّمت الشرط <code>isBlue</code> إلى true، وإلا فإنه يعطي <code>condition</code>، وهي في تلك الحالة قيمة تُقيَّم إلى false. وهذا اختصار عملي وواسع الانتشار للغاية.</p>
<p>وخيار آخر هو استخدام <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator" target="_blank" rel="noreferrer noopener">المعامل الشرطي</a> هكذا:</p>
<pre><code>condition ? exprIfTrue : exprIfFalse
</code></pre>
<h2 id="واجهة-مستخدم-متسقة-باستخدام-الثيم">واجهة مستخدم متسقة باستخدام الثيم</h2>
<p>لنبقَ مع مفهوم الأنماط لكن من منظور أوسع قليلاً. معظمنا استخدم عدداً كبيراً من التطبيقات المختلفة وقد نتفق على أن إحدى السمات التي تصنع واجهة مستخدم جيدة هي <em>الاتساق</em>. وهذا يعني أن مظهر مكوّنات واجهة المستخدم مثل حجم الخط وعائلة الخط واللون يتبع نمطاً متسقاً. ولتحقيق ذلك علينا بطريقة ما <em>تحديد قيم خصائص الأنماط المختلفة كمعاملات</em>. وتُعرف هذه الطريقة عادةً بـ <em>الثيم</em> (theming).</p>
<p>قد يكون مستخدمو مكتبات واجهات المستخدم الشائعة مثل <a href="https://getbootstrap.com/docs/4.4/getting-started/theming/" target="_blank" rel="noreferrer noopener">Bootstrap</a> و<a href="https://material-ui.com/customization/theming/" target="_blank" rel="noreferrer noopener">Material UI</a> على دراية كبيرة بالثيم أصلاً. ومع أن تطبيقات الثيم تختلف، فإن الفكرة الرئيسية هي دائماً استخدام متغيرات مثل <code>colors.primary</code> بدلاً من <a href="https://en.wikipedia.org/wiki/Magic_number_(programming)" target="_blank" rel="noreferrer noopener">&quot;الأرقام السحرية&quot;</a> مثل <code>#0366d6</code> عند تعريف الأنماط. وهذا يؤدي إلى زيادة الاتساق والمرونة.</p>
<p>لنرَ كيف يمكن أن يعمل الثيم عملياً في تطبيقنا. سنستخدم الكثير من النصوص بتنويعات مختلفة، مثل أحجام وألوان خطوط مختلفة. ولأن React Native لا يدعم الأنماط العامة، ينبغي أن ننشئ مكوّن <code>Text</code> خاصاً بنا للحفاظ على اتساق المحتوى النصي. لنبدأ بإضافة كائن إعداد الثيم التالي في ملف <em>theme.js</em> في مجلد <em>src</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> theme = {
  <span class="hljs-attr">colors</span>: {
    <span class="hljs-attr">textPrimary</span>: <span class="hljs-string">&#x27;#24292e&#x27;</span>,
    <span class="hljs-attr">textSecondary</span>: <span class="hljs-string">&#x27;#586069&#x27;</span>,
    <span class="hljs-attr">primary</span>: <span class="hljs-string">&#x27;#0366d6&#x27;</span>,
  },
  <span class="hljs-attr">fontSizes</span>: {
    <span class="hljs-attr">body</span>: <span class="hljs-number">14</span>,
    <span class="hljs-attr">subheading</span>: <span class="hljs-number">16</span>,
  },
  <span class="hljs-attr">fonts</span>: {
    <span class="hljs-attr">main</span>: <span class="hljs-string">&#x27;System&#x27;</span>,
  },
  <span class="hljs-attr">fontWeights</span>: {
    <span class="hljs-attr">normal</span>: <span class="hljs-string">&#x27;400&#x27;</span>,
    <span class="hljs-attr">bold</span>: <span class="hljs-string">&#x27;700&#x27;</span>,
  },
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> theme;
</code></pre>
<p>بعد ذلك، ينبغي إنشاء مكوّن <code>Text</code> الفعلي الذي يستخدم إعداد الثيم هذا. أنشئ ملف <em>Text.jsx</em> في مجلد <em>components</em> حيث لدينا بالفعل بقية مكوّناتنا. وأضف المحتوى التالي إلى ملف <em>Text.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span> <span class="hljs-keyword">as</span> <span class="hljs-title class_">NativeText</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">import</span> theme <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../theme&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">text</span>: {
    <span class="hljs-attr">color</span>: theme.<span class="hljs-property">colors</span>.<span class="hljs-property">textPrimary</span>,
    <span class="hljs-attr">fontSize</span>: theme.<span class="hljs-property">fontSizes</span>.<span class="hljs-property">body</span>,
    <span class="hljs-attr">fontFamily</span>: theme.<span class="hljs-property">fonts</span>.<span class="hljs-property">main</span>,
    <span class="hljs-attr">fontWeight</span>: theme.<span class="hljs-property">fontWeights</span>.<span class="hljs-property">normal</span>,
  },
  <span class="hljs-attr">colorTextSecondary</span>: {
    <span class="hljs-attr">color</span>: theme.<span class="hljs-property">colors</span>.<span class="hljs-property">textSecondary</span>,
  },
  <span class="hljs-attr">colorPrimary</span>: {
    <span class="hljs-attr">color</span>: theme.<span class="hljs-property">colors</span>.<span class="hljs-property">primary</span>,
  },
  <span class="hljs-attr">fontSizeSubheading</span>: {
    <span class="hljs-attr">fontSize</span>: theme.<span class="hljs-property">fontSizes</span>.<span class="hljs-property">subheading</span>,
  },
  <span class="hljs-attr">fontWeightBold</span>: {
    <span class="hljs-attr">fontWeight</span>: theme.<span class="hljs-property">fontWeights</span>.<span class="hljs-property">bold</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Text</span> = ({ color, fontSize, fontWeight, style, ...props }) =&amp;gt; {
  <span class="hljs-keyword">const</span> textStyle = [
    styles.<span class="hljs-property">text</span>,
    color === <span class="hljs-string">&#x27;textSecondary&#x27;</span> &amp;amp;&amp;amp; styles.<span class="hljs-property">colorTextSecondary</span>,
    color === <span class="hljs-string">&#x27;primary&#x27;</span> &amp;amp;&amp;amp; styles.<span class="hljs-property">colorPrimary</span>,
    fontSize === <span class="hljs-string">&#x27;subheading&#x27;</span> &amp;amp;&amp;amp; styles.<span class="hljs-property">fontSizeSubheading</span>,
    fontWeight === <span class="hljs-string">&#x27;bold&#x27;</span> &amp;amp;&amp;amp; styles.<span class="hljs-property">fontWeightBold</span>,
    style,
  ];

  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">NativeText</span> style={textStyle} {...props} /&amp;gt;;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Text</span>;
</code></pre>
<p>الآن نفّذنا مكوّن النص لدينا. ولهذا المكوّن متغيّرات متسقة من الألوان وأحجام الخطوط وأوزان الخطوط يمكننا استخدامها في أي مكان في تطبيقنا. ويمكننا الحصول على تنويعات نصية مختلفة باستخدام props مختلفة هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Text</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Text&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Main</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">Simple</span> text&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span> style={{ <span class="hljs-attr">paddingBottom</span>: <span class="hljs-number">10</span> }}&amp;gt;<span class="hljs-title class_">Text</span> <span class="hljs-keyword">with</span> custom style&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span> fontWeight=<span class="hljs-string">&quot;bold&quot;</span> fontSize=<span class="hljs-string">&quot;subheading&quot;</span>&amp;gt;
        <span class="hljs-title class_">Bold</span> subheading
      &amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">Text</span> color=<span class="hljs-string">&quot;textSecondary&quot;</span>&amp;gt;<span class="hljs-title class_">Text</span> <span class="hljs-keyword">with</span> secondary color&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
    &amp;lt;/&amp;gt;
  );
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Main</span>;
</code></pre>
<p>لا تتردد في توسيع هذا المكوّن أو تعديله إن رغبت في ذلك. وقد تكون فكرة جيدة أيضاً إنشاء مكوّنات نصية قابلة لإعادة الاستخدام مثل <code>Subheading</code> تستخدم مكوّن <code>Text</code>. كذلك واصل توسيع إعداد الثيم وتعديله مع تقدّم تطبيقك.</p>
<h2 id="استخدام-flexbox-للتخطيط">استخدام flexbox للتخطيط</h2>
<p>المفهوم الأخير الذي سنتناوله فيما يتعلق بالأنماط هو تنفيذ التخطيطات باستخدام <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" target="_blank" rel="noreferrer noopener">flexbox</a>. ويعرف من هم أكثر إلماماً بـCSS أن flexbox لا يتعلق بـReact Native فقط، فله حالات استخدام كثيرة في تطوير الويب أيضاً. ومن يعرف كيف يعمل flexbox في تطوير الويب لن يتعلم كثيراً من هذا القسم على الأرجح. ومع ذلك، لنتعلم أساسيات flexbox أو نراجعها.</p>
<p>flexbox هو كيان تخطيط يتألف من جزأين منفصلين: <em>حاوية flex</em> وداخلها مجموعة من <em>عناصر flex</em>. ولحاوية flex مجموعة من الخصائص التي تتحكم في انسياب عناصرها. ولكي يصبح مكوّن حاوية flex يجب أن تكون خاصية النمط <code>display</code> فيه مضبوطة على <code>flex</code>، وهي القيمة الافتراضية للخاصية <code>display</code>. وإليك مثالاً على حاوية flex:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">View</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">flexContainer</span>: {
    <span class="hljs-attr">flexDirection</span>: <span class="hljs-string">&#x27;row&#x27;</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">FlexboxExample</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">flexContainer</span>}&amp;gt;{<span class="hljs-comment">/* ... */</span>}&amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;;
};
</code></pre>
<p>ربما تكون أهم خصائص حاوية flex هي التالية:</p>
<ul>
<li>تتحكم خاصية <a href="https://css-tricks.com/almanac/properties/f/flex-direction/" target="_blank" rel="noreferrer noopener">flexDirection</a> في الاتجاه الذي تُرتَّب فيه عناصر flex داخل الحاوية. والقيم الممكنة لهذه الخاصية هي <code>row</code> و<code>row-reverse</code> و<code>column</code> (القيمة الافتراضية) و<code>column-reverse</code>. واتجاه flex <code>row</code> سيرتّب عناصر flex من اليسار إلى اليمين، بينما <code>column</code> من الأعلى إلى الأسفل. واتجاهات <code>*-reverse</code> تعكس ببساطة ترتيب عناصر flex.</li>
<li>تتحكم خاصية <a href="https://css-tricks.com/almanac/properties/j/justify-content/" target="_blank" rel="noreferrer noopener">justifyContent</a> في محاذاة عناصر flex على طول المحور الرئيسي (المحدَّد بخاصية <code>flexDirection</code>). والقيم الممكنة لهذه الخاصية هي <code>flex-start</code> (القيمة الافتراضية) و<code>flex-end</code> و<code>center</code> و<code>space-between</code> و<code>space-around</code> و<code>space-evenly</code>.</li>
<li>تفعل خاصية <a href="https://css-tricks.com/almanac/properties/a/align-items/" target="_blank" rel="noreferrer noopener">alignItems</a> الشيء نفسه الذي تفعله <code>justifyContent</code> لكن على المحور المقابل. والقيم الممكنة لهذه الخاصية هي <code>flex-start</code> و<code>flex-end</code> و<code>center</code> و<code>baseline</code> و<code>stretch</code> (القيمة الافتراضية).</li>
</ul>
<p>لننتقل إلى عناصر flex. وكما ذُكر، يمكن أن تحتوي حاوية flex على عنصر flex واحد أو عدة عناصر. ولعناصر flex خصائص تتحكم في كيفية تصرفها بالنسبة إلى عناصر flex الأخرى في الحاوية نفسها. ولكي تجعل مكوّناً ما عنصر flex، كل ما عليك فعله هو جعله ابناً مباشراً لحاوية flex:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">View</span>, <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">flexContainer</span>: {
    <span class="hljs-attr">display</span>: <span class="hljs-string">&#x27;flex&#x27;</span>,
  },
  <span class="hljs-attr">flexItemA</span>: {
    <span class="hljs-attr">flexGrow</span>: <span class="hljs-number">0</span>,
    <span class="hljs-attr">backgroundColor</span>: <span class="hljs-string">&#x27;green&#x27;</span>,
  },
  <span class="hljs-attr">flexItemB</span>: {
    <span class="hljs-attr">flexGrow</span>: <span class="hljs-number">1</span>,
    <span class="hljs-attr">backgroundColor</span>: <span class="hljs-string">&#x27;blue&#x27;</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">FlexboxExample</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">flexContainer</span>}&amp;gt;
      &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">flexItemA</span>}&amp;gt;
        &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">Flex</span> item A&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">flexItemB</span>}&amp;gt;
        &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">Flex</span> item B&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
  );
};
</code></pre>
<p>من أكثر خصائص عناصر flex استخداماً خاصية <a href="https://css-tricks.com/almanac/properties/f/flex-grow/" target="_blank" rel="noreferrer noopener">flexGrow</a>. وهي تقبل قيمة بلا وحدة تحدّد قدرة عنصر flex على التمدد عند الحاجة. وإذا كانت قيمة <code>flexGrow</code> لجميع عناصر flex تساوي 1، فسيتقاسمون كل المساحة المتاحة بالتساوي. وإذا كانت قيمة <code>flexGrow</code> لعنصر flex تساوي 0، فسيستخدم فقط المساحة التي يتطلبها محتواه ويترك بقية المساحة لعناصر flex الأخرى.</p>
<p>هنا يمكنك أن تجد كيفية تبسيط التخطيطات باستخدام Flexbox gap: <a href="https://reactnative.dev/blog/2023/01/12/version-071#simplifying-layouts-with-flexbox-gap" target="_blank" rel="noreferrer noopener">Flexbox gap</a>.</p>
<p>بعد ذلك، اقرأ مقال <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noreferrer noopener">دليل شامل إلى Flexbox</a> الذي يتضمن أمثلة بصرية شاملة عن flexbox. ومن الجيد أيضاً التجربة مع خصائص flexbox في <a href="https://flexbox.tech/" target="_blank" rel="noreferrer noopener">Flexbox Playground</a> لترى كيف تؤثر خصائص flexbox المختلفة في التخطيط. وتذكّر أنه في React Native تكون أسماء الخصائص هي نفسها كما في CSS باستثناء تسمية <em>camelCase</em>. أما <em>قيم الخصائص</em> مثل <code>flex-start</code> و<code>space-between</code> فهي متطابقة تماماً.</p>
<p><strong>ملاحظة:</strong> هناك بعض الفروق بين React Native وCSS فيما يخص flexbox. وأهم فرق أن القيمة الافتراضية لخاصية <code>flexDirection</code> في React Native هي <code>column</code>. ومن الجدير بالذكر أيضاً أن اختصار <code>flex</code> لا يقبل قيماً متعددة في React Native. ويمكن قراءة المزيد عن تنفيذ flexbox في React Native في <a href="https://reactnative.dev/docs/flexbox" target="_blank" rel="noreferrer noopener">الوثائق</a>.</p>
<div class="tasks">
<p><strong>4. شريط التطبيق</strong></p>
</div>
<div class="tasks">
<p><strong>5. قائمة المستودعات المُقيَّمة المصقولة</strong></p>
</div>
<h2 id="نمط-شريط-الحالة">نمط شريط الحالة</h2>
<p>اخترنا لون خلفية داكناً لمكوّن <em>AppBar</em>. والمشكلة الآن أن أيقونات شريط الحالة — مثل الساعة وحالة البطارية — لا تبرز جيداً:</p>
<p><img src="/images/mooc/73241e589990.webp" alt="شريط حالة بنمط داكن"></p>
<p>ثبّتنا مكتبة <em>expo-status-bar</em> بالفعل عند إعداد Expo سابقاً. والمشكلة سهلة الإصلاح بإضافة مكوّن <code>StatusBar</code> إلى ملف <em>App.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">StatusBar</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;expo-status-bar&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">Main</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./src/components/Main&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
  <span class="hljs-keyword">return</span> (
    &amp;lt;&gt;
      &amp;lt;<span class="hljs-title class_">StatusBar</span> style=<span class="hljs-string">&quot;light&quot;</span> /&gt;
      &amp;lt;<span class="hljs-title class_">Main</span> /&gt;
    &amp;lt;/&gt;
  );
  <span class="hljs-comment">// END HIGHLIGHT</span>
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>;
</code></pre>
<p>يخبر مكوّن <code>StatusBar</code> نظام التشغيل بكيفية عرض شريط الحالة. وبضبط نمطه على <em>light</em>، تصبح أيقونات شريط الحالة أسهل رؤية على خلفية داكنة:</p>
<p><img src="/images/mooc/7b66a9770608.webp" alt="شريط حالة بنمط فاتح"></p>
<h2 id="التوجيه">التوجيه</h2>
<p>عندما نبدأ بتوسيع تطبيقنا سنحتاج إلى طريقة للانتقال بين عروض مختلفة مثل عرض المستودعات وعرض تسجيل الدخول. في <a href="/part5/react_router_ui_frameworks" target="_blank" rel="noreferrer noopener">الجزء 5</a> تعرّفنا على مكتبة <a href="https://reactrouter.com/" target="_blank" rel="noreferrer noopener">React router</a> وتعلمنا كيفية استخدامها لتنفيذ التوجيه في تطبيق ويب.</p>
<p>التوجيه في تطبيق React Native يختلف قليلاً عن التوجيه في تطبيق ويب. والفرق الرئيسي أننا لا نستطيع الإشارة إلى الصفحات بعناوين URL نكتبها في شريط عنوان المتصفح، ولا التنقل ذهاباً وإياباً عبر سجل المستخدم باستخدام <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API" target="_blank" rel="noreferrer noopener">history API</a> في المتصفح. غير أن هذه مجرد مسألة تتعلق بواجهة الموجّه التي نستخدمها.</p>
<p>مع React Native يمكننا استخدام نواة React router كاملة، بما في ذلك الخطافات والمكوّنات. والفرق الوحيد عن بيئة المتصفح أن علينا استبدال <code>BrowserRouter</code> بـ<a href="https://reactrouter.com/en/6.4.5/router-components/native-router" target="_blank" rel="noreferrer noopener">NativeRouter</a> المتوافق مع React Native، الذي توفّره مكتبة <a href="https://www.npmjs.com/package/react-router-native" target="_blank" rel="noreferrer noopener">react-router-native</a>. لنبدأ بتثبيت مكتبة <em>react-router-native</em>:</p>
<pre><code class="language-bash">npm install react-router-native
</code></pre>
<p>بعد ذلك، افتح ملف <em>App.js</em> وأضف مكوّن <code>NativeRouter</code> إلى مكوّن <code>App</code>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">StatusBar</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;expo-status-bar&#x27;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">NativeRouter</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-native&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">Main</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./src/components/Main&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title function_">App</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;&gt;
      &amp;lt;<span class="hljs-title class_">StatusBar</span> style=<span class="hljs-string">&quot;auto&quot;</span> /&gt;
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      &amp;lt;<span class="hljs-title class_">NativeRouter</span>&gt;
        &amp;lt;<span class="hljs-title class_">Main</span> /&gt;
      &amp;lt;/<span class="hljs-title class_">NativeRouter</span>&gt;
      <span class="hljs-comment">// END HIGHLIGHT</span>
    &amp;lt;/&gt;
  );
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">App</span>;
</code></pre>
<p>وبعد أن أصبح الموجّه جاهزاً، لنضف مسارنا الأول إلى مكوّن Main في ملف <em>Main.jsx</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">StyleSheet</span>, <span class="hljs-title class_">View</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Route</span>, <span class="hljs-title class_">Routes</span>, <span class="hljs-title class_">Navigate</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-router-native&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-keyword">import</span> <span class="hljs-title class_">RepositoryList</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./RepositoryList&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">AppBar</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./AppBar&#x27;</span>;
<span class="hljs-keyword">import</span> theme <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;../theme&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">container</span>: {
    <span class="hljs-attr">backgroundColor</span>: theme.<span class="hljs-property">colors</span>.<span class="hljs-property">mainBackground</span>,
    <span class="hljs-attr">flex</span>: <span class="hljs-number">1</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title function_">Main</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span> style={styles.<span class="hljs-property">container</span>}&gt;
      &amp;lt;<span class="hljs-title class_">AppBar</span> /&gt;
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      &amp;lt;<span class="hljs-title class_">Routes</span>&gt;
        &amp;lt;<span class="hljs-title class_">Route</span> path=<span class="hljs-string">&quot;/&quot;</span> element={&amp;lt;<span class="hljs-title class_">RepositoryList</span> /&gt;} /&gt;
        &amp;lt;<span class="hljs-title class_">Route</span> path=<span class="hljs-string">&quot;*&quot;</span> element={&amp;lt;<span class="hljs-title class_">Navigate</span> to=<span class="hljs-string">&quot;/&quot;</span> replace /&gt;} /&gt;
      &amp;lt;/<span class="hljs-title class_">Routes</span>&gt;
      <span class="hljs-comment">// END HIGHLIGHT</span>
    &amp;lt;/<span class="hljs-title class_">View</span>&gt;
  );
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Main</span>;
</code></pre>
<p>وهذا كل شيء! آخر <code>Route</code> داخل <code>Routes</code> مخصص لالتقاط المسارات التي لا تطابق أي مسار معرّف سابقاً. وفي هذه الحالة، نريد الانتقال إلى العرض الرئيسي.</p>
<div class="tasks">
<p><strong>6. عرض تسجيل الدخول</strong></p>
</div>
<div class="tasks">
<p><strong>7. شريط التطبيق القابل للتمرير</strong></p>
</div>
<h2 id="إدارة-حالة-النموذج">إدارة حالة النموذج</h2>
<p>الآن بعد أن أصبح لدينا عنصر نائب لعرض تسجيل الدخول، ستكون الخطوة التالية تنفيذ نموذج تسجيل الدخول. وقبل أن نصل إلى ذلك، لنتحدث عن النماذج من منظور أوسع.</p>
<p>يعتمد تنفيذ النماذج اعتماداً كبيراً على إدارة الحالة. وقد يؤدي استخدام خطاف <code>useState</code> في React لإدارة الحالة الغرض في النماذج الصغيرة. غير أنه سيجعل إدارة الحالة للنماذج الأكثر تعقيداً مرهقة بسرعة. ولحسن الحظ هناك مكتبات جيدة كثيرة في منظومة React تسهّل إدارة حالة النماذج. ومن هذه المكتبات <a href="https://formik.org/" target="_blank" rel="noreferrer noopener">Formik</a>.</p>
<p>المفهومان الرئيسيان في Formik هما <em>السياق</em> (context) و <em>الحقل</em> (field). غير أن أسهل طريقة لتنفيذ إرسال نموذج بسيط هي استخدام useFormik(). فهو خطاف مخصص في React يعيد كل حالة Formik والدوال المساعدة مباشرة.</p>
<p>هناك بعض القيود المتعلقة باستخدام UseFormik(). اقرأ هذا لتتعرّف على <a href="https://formik.org/docs/api/useFormik" target="_blank" rel="noreferrer noopener">useFormik()</a>.</p>
<p>لنثبّت Formik أولاً:</p>
<pre><code class="language-bash">npm install formik
</code></pre>
<p>لنرَ كيف تعمل إدارة الحالة مع Formik بإنشاء نموذج لحساب <a href="https://en.wikipedia.org/wiki/Body_mass_index" target="_blank" rel="noreferrer noopener">مؤشر كتلة الجسم</a>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">TextInput</span>, <span class="hljs-title class_">Pressable</span>, <span class="hljs-title class_">View</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;
<span class="hljs-keyword">import</span> { useFormik } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;formik&#x27;</span>;

<span class="hljs-keyword">const</span> initialValues = {
  <span class="hljs-attr">mass</span>: <span class="hljs-string">&#x27;&#x27;</span>,
  <span class="hljs-attr">height</span>: <span class="hljs-string">&#x27;&#x27;</span>,
};

<span class="hljs-keyword">const</span> getBodyMassIndex = (mass, height) =&amp;gt; {
  <span class="hljs-keyword">return</span> <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">round</span>(mass / <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">pow</span>(height, <span class="hljs-number">2</span>));
};

<span class="hljs-keyword">const</span> <span class="hljs-title class_">BodyMassIndexForm</span> = ({ onSubmit }) =&amp;gt; {
  <span class="hljs-keyword">const</span> formik = <span class="hljs-title function_">useFormik</span>({
    initialValues,
    onSubmit,
  });

  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span>&amp;gt;
      &amp;lt;<span class="hljs-title class_">TextInput</span>
        placeholder=<span class="hljs-string">&quot;Weight (kg)&quot;</span>
        value={formik.<span class="hljs-property">values</span>.<span class="hljs-property">mass</span>}
        onChangeText={formik.<span class="hljs-title function_">handleChange</span>(<span class="hljs-string">&#x27;mass&#x27;</span>)}
      /&amp;gt;
      &amp;lt;<span class="hljs-title class_">TextInput</span>
        placeholder=<span class="hljs-string">&quot;Height (m)&quot;</span>
        value={formik.<span class="hljs-property">values</span>.<span class="hljs-property">height</span>}
        onChangeText={formik.<span class="hljs-title function_">handleChange</span>(<span class="hljs-string">&#x27;height&#x27;</span>)}
      /&amp;gt;
      &amp;lt;<span class="hljs-title class_">Pressable</span> onPress={formik.<span class="hljs-property">handleSubmit</span>}&amp;gt;
        &amp;lt;<span class="hljs-title class_">Text</span>&amp;gt;<span class="hljs-title class_">Calculate</span>&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;
      &amp;lt;/<span class="hljs-title class_">Pressable</span>&amp;gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&amp;gt;
  );
};

<span class="hljs-keyword">const</span> <span class="hljs-title class_">BodyMassIndexCalculator</span> = () =&amp;gt; {
  <span class="hljs-keyword">const</span> onSubmit = values =&amp;gt; {
    <span class="hljs-keyword">const</span> mass = <span class="hljs-built_in">parseFloat</span>(values.<span class="hljs-property">mass</span>);
    <span class="hljs-keyword">const</span> height = <span class="hljs-built_in">parseFloat</span>(values.<span class="hljs-property">height</span>);

    <span class="hljs-keyword">if</span> (!<span class="hljs-built_in">isNaN</span>(mass) &amp;amp;&amp;amp; !<span class="hljs-built_in">isNaN</span>(height) &amp;amp;&amp;amp; height !== <span class="hljs-number">0</span>) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Your body mass index is: <span class="hljs-subst">\${getBodyMassIndex(mass, height)}</span>\`</span>);
    }
  };

  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">BodyMassIndexForm</span> onSubmit={onSubmit} /&amp;gt;;
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">BodyMassIndexCalculator</span>;
</code></pre>
<p>هذا المثال ليس جزءاً من تطبيقنا، لذا لا تحتاج إلى إضافة هذه الشيفرة إلى التطبيق. لكن يمكنك تجربته مثلاً في <a href="https://snack.expo.io/" target="_blank" rel="noreferrer noopener">Expo Snack</a>. وExpo Snack محرّر عبر الإنترنت لـReact Native، مشابه لـ<a href="https://jsfiddle.net/" target="_blank" rel="noreferrer noopener">JSFiddle</a> و<a href="https://codepen.io/" target="_blank" rel="noreferrer noopener">CodePen</a>. وهو منصة مفيدة لتجربة الشيفرة بسرعة. لاحظ أنك تحتاج أيضاً إلى إضافة Formik كاعتمادية في Expo Snack. ويمكنك فعل ذلك بإضافة الاعتمادية مباشرة إلى ملف <em>package.json</em>، مثلاً السطر: <code>&quot;formik&quot;: &quot;^2.4.9&quot;</code>.</p>
<p>يمكنك مشاركة Expo Snacks مع الآخرين باستخدام رابط أو بتضمينها كـ <em>Snack Player</em> على موقع ويب. وربما صادفت Snack Players مثلاً في هذه المادة وفي وثائق React Native.</p>
<div class="tasks">
<p><strong>8. نموذج تسجيل الدخول</strong></p>
</div>
<h2 id="التحقق-من-صحة-النموذج">التحقق من صحة النموذج</h2>
<p>يوفّر Formik طريقتين للتحقق من صحة النموذج: دالة تحقق أو مخطط تحقق. ودالة التحقق هي دالة تُمرَّر إلى مكوّن <code>Formik</code> كقيمة لخاصية <a href="https://formik.org/docs/guides/validation#validate" target="_blank" rel="noreferrer noopener">validate</a>. وهي تستقبل قيم النموذج كوسيط وتعيد كائناً يحوي رسائل خطأ محتملة خاصة بكل حقل.</p>
<p>والطريقة الثانية هي مخطط التحقق الذي يُمرَّر إلى مكوّن <code>Formik</code> كقيمة لخاصية <a href="https://formik.org/docs/guides/validation#validationschema" target="_blank" rel="noreferrer noopener">validationSchema</a>. ويمكن إنشاء مخطط التحقق هذا باستخدام مكتبة تحقق تُسمّى <a href="https://github.com/jquense/yup" target="_blank" rel="noreferrer noopener">Yup</a>. لنبدأ بتثبيت Yup:</p>
<pre><code class="language-bash">npm install yup
</code></pre>
<p>بعد ذلك، كمثال، لننشئ مخطط تحقق لنموذج مؤشر كتلة الجسم الذي نفّذناه سابقاً. نريد التحقق من أن الحقلين <code>mass</code> و<code>height</code> موجودان وأنهما رقميان. كذلك ينبغي أن تكون قيمة <code>mass</code> أكبر من أو تساوي 1، وقيمة <code>height</code> أكبر من أو تساوي 0.5. وإليك كيفية تعريف المخطط:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> * <span class="hljs-keyword">as</span> yup <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;yup&#x27;</span>; <span class="hljs-comment">// HIGHLIGHT LINE</span>

<span class="hljs-comment">// ...</span>

<span class="hljs-comment">// BEGIN HIGHLIGHT</span>
<span class="hljs-keyword">const</span> validationSchema = yup.<span class="hljs-title function_">object</span>().<span class="hljs-title function_">shape</span>({
  <span class="hljs-attr">mass</span>: yup
    .<span class="hljs-title function_">number</span>()
    .<span class="hljs-title function_">min</span>(<span class="hljs-number">1</span>, <span class="hljs-string">&#x27;Weight must be greater or equal to 1&#x27;</span>)
    .<span class="hljs-title function_">required</span>(<span class="hljs-string">&#x27;Weight is required&#x27;</span>),
  <span class="hljs-attr">height</span>: yup
    .<span class="hljs-title function_">number</span>()
    .<span class="hljs-title function_">min</span>(<span class="hljs-number">0.5</span>, <span class="hljs-string">&#x27;Height must be greater or equal to 0.5&#x27;</span>)
    .<span class="hljs-title function_">required</span>(<span class="hljs-string">&#x27;Height is required&#x27;</span>),
});
<span class="hljs-comment">// END HIGHLIGHT</span>

<span class="hljs-keyword">const</span> <span class="hljs-title function_">BodyMassIndexForm</span> = (<span class="hljs-params">{ onSubmit }</span>) =&gt; {
  <span class="hljs-keyword">const</span> formik = <span class="hljs-title function_">useFormik</span>({
    initialValues,
    <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
    validationSchema,
    <span class="hljs-comment">// END HIGHLIGHT</span>
    onSubmit,
  });

  <span class="hljs-keyword">return</span> (
    &amp;lt;<span class="hljs-title class_">View</span>&gt;
      &amp;lt;<span class="hljs-title class_">TextInput</span>
        placeholder=<span class="hljs-string">&quot;Weight (kg)&quot;</span>
        value={formik.<span class="hljs-property">values</span>.<span class="hljs-property">mass</span>}
        onChangeText={formik.<span class="hljs-title function_">handleChange</span>(<span class="hljs-string">&#x27;mass&#x27;</span>)}
        onBlur={formik.<span class="hljs-title function_">handleBlur</span>(<span class="hljs-string">&#x27;mass&#x27;</span>)} <span class="hljs-comment">// HIGHLIGHT LINE</span>
      /&gt;
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      {formik.<span class="hljs-property">touched</span>.<span class="hljs-property">mass</span> &amp;amp;&amp;amp; formik.<span class="hljs-property">errors</span>.<span class="hljs-property">mass</span> &amp;amp;&amp;amp; (
        &amp;lt;<span class="hljs-title class_">Text</span> style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;red&#x27;</span> }}&gt;{formik.<span class="hljs-property">errors</span>.<span class="hljs-property">mass</span>}&amp;lt;/<span class="hljs-title class_">Text</span>&gt;
      )}
      <span class="hljs-comment">// END HIGHLIGHT</span>
      &amp;lt;<span class="hljs-title class_">TextInput</span>
        placeholder=<span class="hljs-string">&quot;Height (m)&quot;</span>
        value={formik.<span class="hljs-property">values</span>.<span class="hljs-property">height</span>}
        onChangeText={formik.<span class="hljs-title function_">handleChange</span>(<span class="hljs-string">&#x27;height&#x27;</span>)}
        onBlur={formik.<span class="hljs-title function_">handleBlur</span>(<span class="hljs-string">&#x27;height&#x27;</span>)} <span class="hljs-comment">// HIGHLIGHT LINE</span>
      /&gt;
      <span class="hljs-comment">// BEGIN HIGHLIGHT</span>
      {formik.<span class="hljs-property">touched</span>.<span class="hljs-property">height</span> &amp;amp;&amp;amp; formik.<span class="hljs-property">errors</span>.<span class="hljs-property">height</span> &amp;amp;&amp;amp; (
        &amp;lt;<span class="hljs-title class_">Text</span> style={{ <span class="hljs-attr">color</span>: <span class="hljs-string">&#x27;red&#x27;</span> }}&gt;{formik.<span class="hljs-property">errors</span>.<span class="hljs-property">height</span>}&amp;lt;/<span class="hljs-title class_">Text</span>&gt;
      )}
      <span class="hljs-comment">// END HIGHLIGHT</span>
      &amp;lt;<span class="hljs-title class_">Pressable</span> onPress={formik.<span class="hljs-property">handleSubmit</span>}&gt;
        &amp;lt;<span class="hljs-title class_">Text</span>&gt;<span class="hljs-title class_">Calculate</span>&amp;lt;/<span class="hljs-title class_">Text</span>&gt;
      &amp;lt;/<span class="hljs-title class_">Pressable</span>&gt;
    &amp;lt;/<span class="hljs-title class_">View</span>&gt;
  );
};

<span class="hljs-keyword">const</span> <span class="hljs-title function_">BodyMassIndexCalculator</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// ...</span>
}
</code></pre>
<p>كن على علم بأنك تحتاج إلى تضمين مكوّنات Text هذه داخل View الذي يعيده النموذج لعرض أخطاء التحقق:</p>
<pre><code> {formik.touched.mass &amp;amp;&amp;amp; formik.errors.mass &amp;amp;&amp;amp; (
  &amp;lt;Text style={{ color: 'red' }}&amp;gt;{formik.errors.mass}&amp;lt;/Text&amp;gt;
 )}
</code></pre>
<pre><code> {formik.touched.height &amp;amp;&amp;amp; formik.errors.height &amp;amp;&amp;amp; (
  &amp;lt;Text style={{ color: 'red' }}&amp;gt;{formik.errors.height}&amp;lt;/Text&amp;gt;
 )}
</code></pre>
<p>يُجرى التحقق افتراضياً في كل مرة تتغير فيها قيمة حقل وعند استدعاء الدالة <code>handleSubmit</code>. وإذا فشل التحقق، فلا تُستدعى الدالة المُمرَّرة لخاصية <code>onSubmit</code> في مكوّن <code>Formik</code>.</p>
<div class="tasks">
<p><strong>9. التحقق من صحة نموذج تسجيل الدخول</strong></p>
</div>
<h2 id="الشيفرة-الخاصة-بالمنصة">الشيفرة الخاصة بالمنصة</h2>
<p>من المزايا الكبيرة في React Native أننا لا نحتاج إلى القلق بشأن ما إذا كان التطبيق يعمل على جهاز Android أو iOS. غير أنه قد تكون هناك حالات نحتاج فيها إلى تنفيذ <em>شيفرة خاصة بالمنصة</em>. ومثل هذه الحالات قد تكون مثلاً استخدام تنفيذ مختلف لمكوّن على منصة مختلفة.</p>
<p>يمكننا الوصول إلى منصة المستخدم عبر الثابت <code>Platform.OS</code>:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Platform</span>, <span class="hljs-title class_">Text</span>, <span class="hljs-title class_">StyleSheet</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-native&#x27;</span>;

<span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">text</span>: {
    <span class="hljs-attr">color</span>: <span class="hljs-title class_">Platform</span>.<span class="hljs-property">OS</span> === <span class="hljs-string">&#x27;android&#x27;</span> ? <span class="hljs-string">&#x27;green&#x27;</span> : <span class="hljs-string">&#x27;blue&#x27;</span>,
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title class_">WhatIsMyPlatform</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">Text</span> style={styles.<span class="hljs-property">text</span>}&amp;gt;<span class="hljs-title class_">Your</span> platform <span class="hljs-attr">is</span>: {<span class="hljs-title class_">Platform</span>.<span class="hljs-property">OS</span>}&amp;lt;/<span class="hljs-title class_">Text</span>&amp;gt;;
};
</code></pre>
<p>القيم الممكنة لثوابت <code>Platform.OS</code> هي <code>android</code> و<code>ios</code>. وهناك طريقة مفيدة أخرى لتعريف فروع شيفرة خاصة بالمنصة هي استخدام الدالة <code>Platform.select</code>. فعند تمرير كائن تكون مفاتيحه واحداً من <code>ios</code> أو <code>android</code> أو <code>native</code> أو <code>default</code>، تعيد الدالة <code>Platform.select</code> القيمة الأنسب للمنصة التي يعمل عليها المستخدم حالياً. ويمكننا إعادة كتابة المتغير <code>styles</code> في المثال السابق باستخدام الدالة <code>Platform.select</code> هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> styles = <span class="hljs-title class_">StyleSheet</span>.<span class="hljs-title function_">create</span>({
  <span class="hljs-attr">text</span>: {
    <span class="hljs-attr">color</span>: <span class="hljs-title class_">Platform</span>.<span class="hljs-title function_">select</span>({
      <span class="hljs-attr">android</span>: <span class="hljs-string">&#x27;green&#x27;</span>,
      <span class="hljs-attr">ios</span>: <span class="hljs-string">&#x27;blue&#x27;</span>,
      <span class="hljs-attr">default</span>: <span class="hljs-string">&#x27;black&#x27;</span>,
    }),
  },
});
</code></pre>
<p>يمكننا حتى استخدام الدالة <code>Platform.select</code> لاستدعاء مكوّن خاص بمنصة عبر <code>require</code>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">MyComponent</span> = <span class="hljs-title class_">Platform</span>.<span class="hljs-title function_">select</span>({
  <span class="hljs-attr">ios</span>: () =&amp;gt; <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./MyIOSComponent&#x27;</span>),
  <span class="hljs-attr">android</span>: () =&amp;gt; <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./MyAndroidComponent&#x27;</span>),
})();

&amp;lt;<span class="hljs-title class_">MyComponent</span> /&amp;gt;;
</code></pre>
<p>غير أن هناك طريقة أكثر تطوراً لتنفيذ واستيراد مكوّنات خاصة بالمنصة (أو أي قطعة شيفرة أخرى) وهي استخدام امتدادي الملفين <em>.ios.jsx</em> و <em>.android.jsx</em>. لاحظ أن الامتداد <em>.jsx</em> يمكن أن يكون أيضاً امتداداً آخر يتعرّف عليه المُجمِّع، مثل <em>.js</em>. فيمكن أن تكون لدينا مثلاً الملفان <em>Button.ios.jsx</em> و <em>Button.android.jsx</em> اللذان يمكننا استيرادهما هكذا:</p>
<pre><code class="language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Button</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./Button&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title class_">PlatformSpecificButton</span> = () =&amp;gt; {
  <span class="hljs-keyword">return</span> &amp;lt;<span class="hljs-title class_">Button</span> /&amp;gt;;
};
</code></pre>
<p>الآن، ستحتوي حزمة Android للتطبيق على المكوّن المعرّف في <em>Button.android.jsx</em>، بينما تحتوي حزمة iOS على المكوّن المعرّف في ملف <em>Button.ios.jsx</em>.</p>
<div class="tasks">
<p><strong>10. خط خاص بالمنصة</strong></p>
</div>
`,r={part:10,letter:"c",file:s,title:a,slug:n,mainImage:e,headings:l,html:t};export{r as default,s as file,l as headings,t as html,c as letter,e as mainImage,p as part,n as slug,a as title};
