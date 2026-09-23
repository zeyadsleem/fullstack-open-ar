const t=13,c="d",s="d.md",a="الترحيلات وعلاقات متعدد إلى متعدد",n="migrations_many_to_many_relationships",l="/images/part-13.svg",p=[{depth:3,id:"الترحيلات",text:"الترحيلات"},{depth:3,id:"مستخدم-مشرف-وتعطيل-المستخدمين",text:"مستخدم مشرف وتعطيل المستخدمين"},{depth:3,id:"علاقات-متعدد-إلى-متعدد",text:"علاقات متعدد إلى متعدد"},{depth:3,id:"ملاحظة-عن-خصائص-كائنات-نماذج-sequelize",text:"ملاحظة عن خصائص كائنات نماذج Sequelize"},{depth:3,id:"إعادة-النظر-في-علاقات-متعدد-إلى-متعدد",text:"إعادة النظر في علاقات متعدد إلى متعدد"},{depth:3,id:"ملاحظات-ختامية",text:"ملاحظات ختامية"}],e=`<h3 id="الترحيلات">الترحيلات</h3>
<p>لنواصل توسيع الواجهة الخلفية. نريد تنفيذ دعم للمستخدمين ذوي <em>صلاحية المشرف</em> لتعيين مستخدمين آخرين في حالة غير نشطة، ومنعهم من تسجيل الدخول وإنشاء ملاحظات جديدة. ولتنفيذ ذلك، نحتاج إلى إضافة معلومات ذات قيمة منطقية إلى جدول المستخدمين في قاعدة البيانات تشير إلى ما إذا كان المستخدم مشرفاً وما إذا كان حساب المستخدم غير نشط.</p>
<p>كان بإمكاننا المضي كما في السابق، أي تغيير النموذج الذي يعرّف الجدول والاعتماد على Sequelize لمزامنة تغييرات المخطط مع قاعدة البيانات. ويظهر ذلك في هذه الأسطر من الملف <em>models/index.js</em></p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Note</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./note&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./user&#x27;</span>)

<span class="hljs-title class_">Note</span>.<span class="hljs-title function_">belongsTo</span>(<span class="hljs-title class_">User</span>)
<span class="hljs-title class_">User</span>.<span class="hljs-title function_">hasMany</span>(<span class="hljs-title class_">Note</span>)

<span class="hljs-comment">// إجراء تغييرات المخطط الممكنة</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">syncModels</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-title class_">User</span>.<span class="hljs-title function_">sync</span>({ <span class="hljs-attr">alter</span>: <span class="hljs-literal">true</span> })
  <span class="hljs-title class_">Note</span>.<span class="hljs-title function_">sync</span>({ <span class="hljs-attr">alter</span>: <span class="hljs-literal">true</span> })
}

<span class="hljs-title function_">syncModels</span>()

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-title class_">Note</span>, <span class="hljs-title class_">User</span>
}
</code></pre>
<p>لكن هذا الأسلوب لا معنى له على المدى الطويل. لنحذف الأسطر التي تقوم بالمزامنة وننتقل إلى استخدام طريقة أكثر متانة بكثير، وهي <a href="https://sequelize.org/master/manual/migrations.html" target="_blank" rel="noreferrer noopener">الترحيلات (migrations)</a> التي توفّرها Sequelize (وكذلك مكتبات أخرى كثيرة).</p>
<p>عملياً، الترحيل هو ملف JavaScript واحد يصف تغييراً يجب إجراؤه على قاعدة البيانات. ويُنشأ ملف ترحيل منفصل لكل تغيير فردي أو لمجموعة تغييرات تُجرى دفعة واحدة. وتتتبّع Sequelize أي الترحيلات نُفّذت، أي تغييرات الترحيل التي زُوّمت مع مخطط قاعدة البيانات. ومع إنشاء ترحيلات جديدة، تبقى Sequelize على اطلاع بأي تغييرات المخطط ما زالت بحاجة إلى إجرائها. وبهذه الطريقة تُجرى التغييرات بطريقة مضبوطة، مع تخزين شيفرة البرنامج في نظام إدارة الإصدارات.</p>
<p>أولاً، أنشئ ترحيلاً ينقل قاعدة البيانات إلى حالتها الحالية. شيفرة الترحيل كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">up</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;users&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">username</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">STRING</span>,
        <span class="hljs-attr">unique</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>
      },
      <span class="hljs-attr">name</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">STRING</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>
      },
    })
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;notes&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">content</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">TEXT</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>
      },
      <span class="hljs-attr">important</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">BOOLEAN</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>
      },
      <span class="hljs-attr">date</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">DATE</span>
      },
      <span class="hljs-attr">user_id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
      }
    })
  },
  <span class="hljs-attr">down</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;notes&#x27;</span>)
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;users&#x27;</span>)
  },
}
</code></pre>
<p>يعرّف ملف الترحيل <a href="https://sequelize.org/master/manual/migrations.html#migration-skeleton" target="_blank" rel="noreferrer noopener">الدالتين</a> <em>up</em> و <em>down</em>، والأولى منهما تحدد كيف ينبغي تعديل قاعدة البيانات عند تنفيذ الترحيل. أما الدالة <em>down</em> فتبيّن كيفية التراجع عن الترحيل إذا دعت الحاجة إلى ذلك.</p>
<p>يحتوي الترحيل لدينا على عمليتين: الأولى تنشئ جدول <em>users</em>، والثانية تنشئ جدول <em>notes</em> الذي يحتوي على مفتاح أجنبي إلى جدول <em>users</em> يشير إلى منشئ الملاحظة. وتُعرَّف التغييرات في المخطط باستدعاء دوال الكائن <a href="https://sequelize.org/master/manual/query-interface.html" target="_blank" rel="noreferrer noopener">queryInterface</a>.</p>
<p>عند تعريف الترحيلات، من الضروري أن تتذكر أنه خلافاً للنماذج، تُكتب أسماء الأعمدة والجداول مثل <em>user_id</em> بصيغة snake case.</p>
<p>إذن في الترحيلات تُكتب أسماء الجداول والأعمدة تماماً كما تظهر في قاعدة البيانات، بينما تستخدم النماذج اصطلاح التسمية الافتراضي camelCase الخاص بـSequelize.</p>
<p>احفظ شيفرة الترحيل في الملف <em>migrations/20260211_00_initialize_notes_and_users.js</em>. ويجب أن تكون أسماء ملفات الترحيل مرتبة أبجدياً بحيث يسبق التغيير الأقدم دائماً التغيير الأحدث أبجدياً. ومن الطرق الجيدة لتحقيق هذا الترتيب أن يبدأ اسم ملف الترحيل بالتاريخ ورقم التسلسل.</p>
<p>كان بإمكاننا تشغيل الترحيلات من سطر الأوامر باستخدام <a href="https://github.com/sequelize/cli" target="_blank" rel="noreferrer noopener">أداة سطر أوامر Sequelize</a>. غير أننا نختار تنفيذ الترحيلات يدوياً من شيفرة البرنامج باستخدام <a href="https://github.com/sequelize/umzug" target="_blank" rel="noreferrer noopener">مكتبة Umzug</a>. لنثبّت المكتبة</p>
<pre><code class="language-bash">npm install umzug
</code></pre>
<p>لنغيّر الملف <em>util/db.js</em> الذي يتعامل مع الاتصال بقاعدة البيانات كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Sequelize</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)
<span class="hljs-keyword">const</span> { <span class="hljs-variable constant_">DATABASE_URL</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./config&#x27;</span>)

<span class="hljs-keyword">const</span> { <span class="hljs-title class_">Umzug</span>, <span class="hljs-title class_">SequelizeStorage</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;umzug&#x27;</span>)

<span class="hljs-keyword">const</span> sequelize = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Sequelize</span>(<span class="hljs-variable constant_">DATABASE_URL</span>, {
  <span class="hljs-attr">dialectOptions</span>: {
    <span class="hljs-attr">ssl</span>: {
      <span class="hljs-attr">require</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-attr">rejectUnauthorized</span>: <span class="hljs-literal">false</span>
    }
  },
})

<span class="hljs-keyword">const</span> <span class="hljs-title function_">runMigrations</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> migrator = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Umzug</span>({
    <span class="hljs-attr">migrations</span>: {
      <span class="hljs-attr">glob</span>: <span class="hljs-string">&#x27;migrations/*.js&#x27;</span>,
    },
    <span class="hljs-attr">storage</span>: <span class="hljs-keyword">new</span> <span class="hljs-title class_">SequelizeStorage</span>({ sequelize, <span class="hljs-attr">tableName</span>: <span class="hljs-string">&#x27;migrations&#x27;</span> }),
    <span class="hljs-attr">context</span>: sequelize.<span class="hljs-title function_">getQueryInterface</span>(),
    <span class="hljs-attr">logger</span>: <span class="hljs-variable language_">console</span>,
  })

  <span class="hljs-keyword">const</span> migrations = <span class="hljs-keyword">await</span> migrator.<span class="hljs-title function_">up</span>()
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Migrations up to date&#x27;</span>, {
    <span class="hljs-attr">files</span>: migrations.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">mig</span>) =&gt;</span> mig.<span class="hljs-property">name</span>),
  })
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">connectToDatabase</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">await</span> sequelize.<span class="hljs-title function_">authenticate</span>()
    <span class="hljs-keyword">await</span> <span class="hljs-title function_">runMigrations</span>()
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;connected to the database&#x27;</span>)
  } <span class="hljs-keyword">catch</span> (err) {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;failed to connect to the database&#x27;</span>)
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(err)
    <span class="hljs-keyword">return</span> process.<span class="hljs-title function_">exit</span>(<span class="hljs-number">1</span>)
  }
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = { connectToDatabase, sequelize }
</code></pre>
<p>تُنفَّذ الآن دالة <em>runMigrations</em> التي تجري الترحيلات في كل مرة يفتح فيها التطبيق اتصالاً بقاعدة البيانات عند بدء تشغيله. وتتتبّع Sequelize أي الترحيلات أُكملت بالفعل، لذا إذا لم تكن هناك ترحيلات جديدة، فإن تنفيذ دالة <em>runMigrations</em> لا يفعل شيئاً.</p>
<p>لنبدأ الآن من صفحة بيضاء ونحذف جميع جداول قاعدة البيانات الموجودة من التطبيق:</p>
<pre><code>username =&amp;gt; drop table notes;
username =&amp;gt; drop table users;
username =&amp;gt; \\d
Did not find any relations.
</code></pre>
<p>لنشغّل التطبيق. وستُطبع رسالة عن حالة الترحيلات في السجل</p>
<pre><code class="language-sql"><span class="hljs-keyword">INSERT INTO</span> &quot;migrations&quot; (&quot;name&quot;) <span class="hljs-keyword">VALUES</span> ($<span class="hljs-number">1</span>) RETURNING &quot;name&quot;;
Migrations up <span class="hljs-keyword">to</span> <span class="hljs-type">date</span> { files: [ <span class="hljs-string">&#x27;20260211_00_initialize_notes_and_users.js&#x27;</span> ] }
database connected
</code></pre>
<p>وإذا أعدنا تشغيل التطبيق، يُظهر السجل أيضاً أن الترحيل لم يُعَد.</p>
<p>يبدو مخطط قاعدة بيانات التطبيق الآن كما يلي</p>
<pre><code>defaultdb=&gt; \\d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
</code></pre>
<p>إذن أنشأت Sequelize جدولاً باسم <em>migrations</em> يتيح لها تتبّع الترحيلات التي نُفّذت. ومحتويات الجدول كما يلي:</p>
<pre><code>&lt;code&gt;defaultdb=&gt; select * from migrations;
                   name
-------------------------------------------
  20260211_00_initialize_notes_and_users.j&lt;span style=&quot;font-family: inherit; text-align: initial;&quot;&gt;s&lt;/span&gt;&lt;/code&gt;
</code></pre>
<p>لننشئ بعض المستخدمين في قاعدة البيانات، وكذلك مجموعة من الملاحظات، وبعد ذلك نكون مستعدين لتوسيع التطبيق.</p>
<p>الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step6" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step6</em>.</p>
<h3 id="مستخدم-مشرف-وتعطيل-المستخدمين">مستخدم مشرف وتعطيل المستخدمين</h3>
<p>إذن نريد إضافة حقلين منطقيين إلى جدول <em>users</em></p>
<ul>
<li>يشير الحقل <em>admin</em> إلى ما إذا كان المستخدم مشرفاً</li>
<li>ويشير الحقل <em>disabled</em> إلى ما إذا كان حساب المستخدم قد عُطّل.</li>
</ul>
<p>لننشئ الترحيل الذي يعدّل قاعدة البيانات في الملف <em>migrations/20260211_02_admin_and_disabled_to_users.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">up</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">addColumn</span>(<span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-string">&#x27;admin&#x27;</span>, {
      <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">BOOLEAN</span>,
      <span class="hljs-attr">defaultValue</span>: <span class="hljs-literal">false</span>
    })
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">addColumn</span>(<span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-string">&#x27;disabled&#x27;</span>, {
      <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">BOOLEAN</span>,
      <span class="hljs-attr">defaultValue</span>: <span class="hljs-literal">false</span>
    })
  },
  <span class="hljs-attr">down</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">removeColumn</span>(<span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-string">&#x27;admin&#x27;</span>)
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">removeColumn</span>(<span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-string">&#x27;disabled&#x27;</span>)
  },
}
</code></pre>
<p>أجرِ التغييرات المقابلة على النموذج المقابل لجدول <em>users</em>:</p>
<pre><code>User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
</code></pre>
<p>وعند تنفيذ الترحيل الجديد عند إعادة تشغيل الشيفرة، يتغيّر المخطط كما هو مطلوب:</p>
<pre><code>username-&amp;gt; \\d users
                                     Table &quot;public.users&quot;
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          |
 disabled | boolean                |           |          |
Indexes:
    &quot;users_pkey&quot; PRIMARY KEY, btree (id)
    &quot;users_username_key&quot; UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE &quot;notes&quot; CONSTRAINT &quot;notes_user_id_fkey&quot; FOREIGN KEY (user_id) REFERENCES users(id)
</code></pre>
<p>لنوسّع الآن المتحكمات كما يلي. نمنع تسجيل الدخول إذا كانت قيمة الحقل <em>disabled</em> في المستخدم مضبوطة على <em>true</em>:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">post</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (request, response) =&gt; {
  <span class="hljs-keyword">const</span> body = request.<span class="hljs-property">body</span>

  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({
    <span class="hljs-attr">where</span>: {
      <span class="hljs-attr">username</span>: body.<span class="hljs-property">username</span>
    }
  })

  <span class="hljs-keyword">const</span> passwordCorrect = body.<span class="hljs-property">password</span> === <span class="hljs-string">&#x27;secret&#x27;</span>

  <span class="hljs-keyword">if</span> (!(user &amp;amp;&amp;amp; passwordCorrect)) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;invalid username or password&#x27;</span>
    })
  }

  <span class="hljs-keyword">if</span> (user.<span class="hljs-property">disabled</span>) {
    <span class="hljs-keyword">return</span> response.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;account disabled, please contact admin&#x27;</span>
    })
  }

  <span class="hljs-keyword">const</span> userForToken = {
    <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
    <span class="hljs-attr">id</span>: user.<span class="hljs-property">id</span>,
  }

  <span class="hljs-keyword">const</span> token = jwt.<span class="hljs-title function_">sign</span>(userForToken, <span class="hljs-variable constant_">SECRET</span>)

  response
    .<span class="hljs-title function_">status</span>(<span class="hljs-number">200</span>)
    .<span class="hljs-title function_">send</span>({ token, <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>, <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span> })
})
</code></pre>
<p>لنعطّل المستخدم <em>jakousa</em> باستخدام معرّفه:</p>
<pre><code class="language-sql">username <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">update</span> users <span class="hljs-keyword">set</span> disabled<span class="hljs-operator">=</span><span class="hljs-literal">true</span> <span class="hljs-keyword">where</span> id<span class="hljs-operator">=</span><span class="hljs-number">4</span>;
<span class="hljs-keyword">UPDATE</span> <span class="hljs-number">1</span>
username <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">select</span> <span class="hljs-operator">*</span> <span class="hljs-keyword">from</span> users;
 id <span class="hljs-operator">|</span> username <span class="hljs-operator">|</span>              name               <span class="hljs-operator">|</span> admin <span class="hljs-operator">|</span> disabled
<span class="hljs-comment">----+----------+---------------------------------+-------+----------</span>
  <span class="hljs-number">2</span> <span class="hljs-operator">|</span> mluukkai <span class="hljs-operator">|</span> Matti Luukkainen                <span class="hljs-operator">|</span> f     <span class="hljs-operator">|</span> f
  <span class="hljs-number">4</span> <span class="hljs-operator">|</span> jakousa  <span class="hljs-operator">|</span> Jami Kousa (The Docker Captain) <span class="hljs-operator">|</span> f     <span class="hljs-operator">|</span> t
  <span class="hljs-number">3</span> <span class="hljs-operator">|</span> ousa     <span class="hljs-operator">|</span> Outi Savolainen                 <span class="hljs-operator">|</span> t     <span class="hljs-operator">|</span> f
</code></pre>
<p>وتأكد من أن تسجيل الدخول لم يعد ممكناً</p>
<p><img src="/images/mooc/97c0efb30c73.webp" alt="صورة توضيحية"></p>
<p>لننشئ مساراً (في الملف controllers/users.js) يتيح للمشرف تغيير حالة حساب مستخدم:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> isAdmin = <span class="hljs-title function_">async</span> (req, res, next) =&amp;gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">decodedToken</span>.<span class="hljs-property">id</span>)
  <span class="hljs-keyword">if</span> (!user.<span class="hljs-property">admin</span>) {
    <span class="hljs-keyword">return</span> res.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;operation not allowed&#x27;</span> })
  }
  <span class="hljs-title function_">next</span>()
}

router.<span class="hljs-title function_">put</span>(<span class="hljs-string">&#x27;/:username&#x27;</span>, tokenExtractor, isAdmin, <span class="hljs-title function_">async</span> (req, res) =&amp;gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({
    <span class="hljs-attr">where</span>: {
      <span class="hljs-attr">username</span>: req.<span class="hljs-property">params</span>.<span class="hljs-property">username</span>
    }
  })

  <span class="hljs-keyword">if</span> (user) {
    user.<span class="hljs-property">disabled</span> = req.<span class="hljs-property">body</span>.<span class="hljs-property">disabled</span>
    <span class="hljs-keyword">await</span> user.<span class="hljs-title function_">save</span>()
    res.<span class="hljs-title function_">json</span>(user)
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }
})
</code></pre>
<p>يُستخدم وسيطان هنا؛ الوسيط الأول المسمى <em>tokenExtractor</em> هو نفسه المستخدم في مسار إنشاء الملاحظات، أي أنه يضع الرمز المفكوك الترميز في حقل <em>decodedToken</em> من كائن الطلب. أما الوسيط الثاني <em>isAdmin</em> فيتحقق مما إذا كان المستخدم مشرفاً، وإن لم يكن كذلك تُضبط حالة الطلب على 401 وتُعاد رسالة خطأ مناسبة.</p>
<p>لاحظ كيف يُسلسَل <em>وسيطان</em> إلى المسار، وكلاهما يُنفَّذ قبل معالج المسار الفعلي. ومن الممكن تسلسل أي عدد من الوسطاء إلى الطلب.</p>
<p>نُقل الوسيط <em>tokenExtractor</em> الآن إلى الملف <em>util/middleware.js</em> لأنه يُستخدم من مواقع متعددة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> jwt = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;jsonwebtoken&#x27;</span>)
<span class="hljs-keyword">const</span> { <span class="hljs-variable constant_">SECRET</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./config.js&#x27;</span>)

<span class="hljs-keyword">const</span> tokenExtractor = (req, res, next) =&amp;gt; {
  <span class="hljs-keyword">const</span> authorization = req.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;authorization&#x27;</span>)
  <span class="hljs-keyword">if</span> (authorization &amp;amp;&amp;amp; authorization.<span class="hljs-title function_">toLowerCase</span>().<span class="hljs-title function_">startsWith</span>(<span class="hljs-string">&#x27;bearer &#x27;</span>)) {
    <span class="hljs-keyword">try</span> {
      req.<span class="hljs-property">decodedToken</span> = jwt.<span class="hljs-title function_">verify</span>(authorization.<span class="hljs-title function_">substring</span>(<span class="hljs-number">7</span>), <span class="hljs-variable constant_">SECRET</span>)
    } <span class="hljs-keyword">catch</span>{
      <span class="hljs-keyword">return</span> res.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token invalid&#x27;</span> })
    }
  } <span class="hljs-keyword">else</span> {
    <span class="hljs-keyword">return</span> res.<span class="hljs-title function_">status</span>(<span class="hljs-number">401</span>).<span class="hljs-title function_">json</span>({ <span class="hljs-attr">error</span>: <span class="hljs-string">&#x27;token missing&#x27;</span> })
  }
  <span class="hljs-title function_">next</span>()
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = { tokenExtractor }
</code></pre>
<p>وربما من الجيد أيضاً نقل الوسيط <em>isAdmin</em> إلى الملف نفسه.</p>
<p>يمكن للمشرف الآن إعادة تمكين المستخدم <em>jakousa</em> بتوجيه طلب PUT إلى <em>/api/users/jakousa</em> مرفقاً بالبيانات التالية:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;disabled&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-literal"><span class="hljs-keyword">false</span></span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>كما أشرنا في <a href="/part4/token_authentication#problems-of-token-based-authentication" target="_blank" rel="noreferrer noopener">نهاية الجزء الرابع</a>، فإن طريقة تنفيذنا لتعطيل المستخدمين هنا إشكالية. إذ لا يُتحقق مما إذا كان المستخدم معطّلاً إلا عند <em>تسجيل الدخول</em>؛ فإذا كان لدى المستخدم رمز مميز في وقت تعطيله، فقد يواصل استخدام الرمز نفسه، لأنه لم تُحدَّد مدة صلاحية للرمز ولا يُتحقق من حالة تعطيل المستخدم عند إنشاء الملاحظات.</p>
<p>قبل أن نمضي قدماً، لننشئ سكربت npm للتطبيق يتيح لنا التراجع عن الترحيل السابق. فليس كل شيء يسير على ما يرام من المحاولة الأولى عند تطوير الترحيلات.</p>
<p>لنعدّل الملف <em>util/db.js</em> كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Sequelize</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)
<span class="hljs-keyword">const</span> { <span class="hljs-variable constant_">DATABASE_URL</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./config&#x27;</span>)
<span class="hljs-keyword">const</span> { <span class="hljs-title class_">Umzug</span>, <span class="hljs-title class_">SequelizeStorage</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;umzug&#x27;</span>)

<span class="hljs-keyword">const</span> sequelize = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Sequelize</span>(<span class="hljs-variable constant_">DATABASE_URL</span>, {
  <span class="hljs-attr">dialectOptions</span>: {
    <span class="hljs-attr">ssl</span>: {
      <span class="hljs-attr">require</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-attr">rejectUnauthorized</span>: <span class="hljs-literal">false</span>
    }
  },
});

<span class="hljs-keyword">const</span> <span class="hljs-title function_">connectToDatabase</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">try</span> {
    <span class="hljs-keyword">await</span> sequelize.<span class="hljs-title function_">authenticate</span>()
    <span class="hljs-keyword">await</span> <span class="hljs-title function_">runMigrations</span>()
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;connected to the database&#x27;</span>)
  } <span class="hljs-keyword">catch</span> (err) {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;failed to connect to the database&#x27;</span>)
    <span class="hljs-keyword">return</span> process.<span class="hljs-title function_">exit</span>(<span class="hljs-number">1</span>)
  }
}

<span class="hljs-keyword">const</span> migrationConf = {
  <span class="hljs-attr">migrations</span>: {
    <span class="hljs-attr">glob</span>: <span class="hljs-string">&#x27;migrations/*.js&#x27;</span>,
  },
  <span class="hljs-attr">storage</span>: <span class="hljs-keyword">new</span> <span class="hljs-title class_">SequelizeStorage</span>({ sequelize, <span class="hljs-attr">tableName</span>: <span class="hljs-string">&#x27;migrations&#x27;</span> }),
  <span class="hljs-attr">context</span>: sequelize.<span class="hljs-title function_">getQueryInterface</span>(),
  <span class="hljs-attr">logger</span>: <span class="hljs-variable language_">console</span>,
}

<span class="hljs-keyword">const</span> <span class="hljs-title function_">runMigrations</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">const</span> migrator = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Umzug</span>(migrationConf)
  <span class="hljs-keyword">const</span> migrations = <span class="hljs-keyword">await</span> migrator.<span class="hljs-title function_">up</span>()
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&#x27;Migrations up to date&#x27;</span>, {
    <span class="hljs-attr">files</span>: migrations.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">mig</span>) =&gt;</span> mig.<span class="hljs-property">name</span>),
  })
}
<span class="hljs-keyword">const</span> <span class="hljs-title function_">rollbackMigration</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">await</span> sequelize.<span class="hljs-title function_">authenticate</span>()
  <span class="hljs-keyword">const</span> migrator = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Umzug</span>(migrationConf)
  <span class="hljs-keyword">await</span> migrator.<span class="hljs-title function_">down</span>()
}

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = { connectToDatabase, sequelize, rollbackMigration }
</code></pre>
<p>لننشئ ملفاً هو <em>util/rollback.js</em> يتيح لسكربت npm تنفيذ دالة التراجع عن الترحيل المحددة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { rollbackMigration } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./db&#x27;</span>)

<span class="hljs-title function_">rollbackMigration</span>()
</code></pre>
<p>والسكربت في الملف <em>package.json</em>:</p>
<pre><code class="language-json"><span class="hljs-punctuation">{</span>
  <span class="hljs-attr">&quot;scripts&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span>
    <span class="hljs-attr">&quot;dev&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node --watch index.js&quot;</span><span class="hljs-punctuation">,</span>
    <span class="hljs-attr">&quot;migration:down&quot;</span><span class="hljs-punctuation">:</span> <span class="hljs-string">&quot;node util/rollback.js&quot;</span>
  <span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>
<span class="hljs-punctuation">}</span>
</code></pre>
<p>إذن يمكننا الآن التراجع عن الترحيل السابق بتنفيذ <em>npm run migration:down</em> من سطر الأوامر.</p>
<p>تُنفَّذ الترحيلات حالياً تلقائياً عند بدء تشغيل البرنامج. وفي مرحلة تطوير البرنامج، قد يكون من الأنسب أحياناً تعطيل التنفيذ التلقائي للترحيلات وإجراء الترحيلات يدوياً من سطر الأوامر.</p>
<p>الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step7" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step7</em>.</p>
<div class="tasks">
<p><strong>18. إعداد الترحيلات</strong></p>
</div>
<div class="tasks">
<p><strong>19. تذكّر السنة</strong></p>
</div>
<h3 id="علاقات-متعدد-إلى-متعدد">علاقات متعدد إلى متعدد</h3>
<p>سنواصل توسيع التطبيق بحيث يمكن إضافة كل مستخدم إلى واحد أو أكثر من <em>الفرق</em>.</p>
<p>بما أن عدداً اعتباطياً من المستخدمين يمكنهم الانضمام إلى فريق واحد، ويمكن لمستخدم واحد الانضمام إلى عدد اعتباطي من الفرق، فإننا نتعامل مع علاقة <a href="https://sequelize.org/master/manual/assocs.html#many-to-many-relationships" target="_blank" rel="noreferrer noopener">متعدد إلى متعدد</a>، وهي تُنفَّذ تقليدياً في قواعد البيانات العلائقية باستخدام <em>جدول ربط</em>.</p>
<p>لننشئ الآن الشيفرة اللازمة لجدول الفرق وكذلك جدول الربط. الترحيل (المحفوظ في الملف <em>20260211_03_add_teams_and_memberships.js</em>) كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">up</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;teams&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">name</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">TEXT</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">unique</span>: <span class="hljs-literal">true</span>
      },
    })
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;memberships&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">user_id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
      },
      <span class="hljs-attr">team_id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;teams&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
      },
    })
  },
  <span class="hljs-attr">down</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;memberships&#x27;</span>)
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;teams&#x27;</span>)
  },
}
</code></pre>
<p>تحتوي النماذج على الشيفرة نفسها تقريباً الموجودة في الترحيل. نموذج الفريق في <em>models/team.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">Model</span>, <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-keyword">const</span> { sequelize } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;../util/db&#x27;</span>)

<span class="hljs-keyword">class</span> <span class="hljs-title class_">Team</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {}

<span class="hljs-title class_">Team</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-attr">id</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-attr">name</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">TEXT</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">unique</span>: <span class="hljs-literal">true</span>
  },
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;team&#x27;</span>
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">Team</span>
</code></pre>
<p>نموذج جدول الربط في <em>models/membership.js</em>:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">Model</span>, <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-keyword">const</span> { sequelize } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;../util/db&#x27;</span>)

<span class="hljs-keyword">class</span> <span class="hljs-title class_">Membership</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {}

<span class="hljs-title class_">Membership</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-attr">id</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-attr">userId</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
  },
  <span class="hljs-attr">teamId</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;teams&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
  },
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;membership&#x27;</span>
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">Membership</span>
</code></pre>
<p>إذن أعطينا جدول الربط اسماً يصفه جيداً، وهو <em>membership</em>. ولا يوجد دائماً اسم مناسب لجدول الربط، وفي هذه الحالة يمكن أن يكون اسم جدول الربط مزيجاً من أسماء الجداول المربوطة، فمثلاً قد يناسب <em>user_teams</em> حالتنا.</p>
<p>نضيف إضافة صغيرة إلى الملف <em>models/index.js</em> لربط الفرق والمستخدمين على مستوى الشيفرة باستخدام دالة <a href="https://sequelize.org/docs/v6/core-concepts/assocs/#implementation-2" target="_blank" rel="noreferrer noopener">belongsToMany</a>.</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Note</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./note&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./user&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Team</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./team&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Membership</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./membership&#x27;</span>)

<span class="hljs-title class_">Note</span>.<span class="hljs-title function_">belongsTo</span>(<span class="hljs-title class_">User</span>)
<span class="hljs-title class_">User</span>.<span class="hljs-title function_">hasMany</span>(<span class="hljs-title class_">Note</span>)

<span class="hljs-title class_">User</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">Team</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">Membership</span> })
<span class="hljs-title class_">Team</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">User</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">Membership</span> })

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-title class_">Note</span>, <span class="hljs-title class_">User</span>, <span class="hljs-title class_">Team</span>, <span class="hljs-title class_">Membership</span>
}
</code></pre>
<p>لاحظ الفرق بين ترحيل جدول الربط والنموذج عند تعريف حقول المفاتيح الأجنبية. أثناء الترحيل، تُعرَّف الحقول بصيغة snake case:</p>
<pre><code>await queryInterface.createTable('memberships', {
  // ...
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  }
})
</code></pre>
<p>وفي النموذج، تُعرَّف الحقول نفسها بصيغة camel case:</p>
<pre><code>Membership.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
  // ...
})
</code></pre>
<p>لننشئ الآن فريقين من طرفية psql، وكذلك بعض العضويات:</p>
<pre><code class="language-sql"><span class="hljs-keyword">insert into</span> teams (name) <span class="hljs-keyword">values</span> (<span class="hljs-string">&#x27;toska&#x27;</span>);
<span class="hljs-keyword">insert into</span> teams (name) <span class="hljs-keyword">values</span> (<span class="hljs-string">&#x27;mosa climbers&#x27;</span>);
<span class="hljs-keyword">insert into</span> memberships (user_id, team_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">1</span>, <span class="hljs-number">1</span>);
<span class="hljs-keyword">insert into</span> memberships (user_id, team_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">1</span>, <span class="hljs-number">2</span>);
<span class="hljs-keyword">insert into</span> memberships (user_id, team_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">2</span>, <span class="hljs-number">1</span>);
<span class="hljs-keyword">insert into</span> memberships (user_id, team_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">3</span>, <span class="hljs-number">2</span>);
</code></pre>
<p>ثم تُضاف معلومات فرق المستخدمين إلى المسار الخاص بجلب جميع المستخدمين</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> users = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findAll</span>({
    <span class="hljs-attr">include</span>: [
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>] }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Team</span>,
        <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;id&#x27;</span>],
      }
    ]
  })
  res.<span class="hljs-title function_">json</span>(users)
})
</code></pre>
<p>سيلاحظ الأكثر انتباهاً أن الاستعلام المطبوع في الطرفية يجمع الآن ثلاثة جداول.</p>
<p>الحل جيد جداً، لكن فيه عيب واحد. فالنتيجة تتضمن أيضاً خصائص صف جدول الربط، مع أننا لا نريدها:</p>
<p><img src="/images/mooc/b99243067a92.webp" alt="صورة توضيحية"></p>
<p>بقراءة التوثيق بعناية، يمكنك إيجاد <a href="https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table" target="_blank" rel="noreferrer noopener">حل</a>:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> users = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findAll</span>({
    <span class="hljs-attr">include</span>: [
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>] }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Team</span>,
        <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;id&#x27;</span>],
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        }
      }
    ]
  })
  res.<span class="hljs-title function_">json</span>(users)
})
</code></pre>
<p>الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step8" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع<em> step8</em>.</p>
<h3 id="ملاحظة-عن-خصائص-كائنات-نماذج-sequelize">ملاحظة عن خصائص كائنات نماذج Sequelize</h3>
<p>تضمّن تعريف نماذجنا الأسطر التالية من بين أسطر أخرى:</p>
<pre><code>User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
</code></pre>
<p>تتيح هذه الأسطر لـSequelize إجراء استعلامات تجلب، مثلاً، جميع ملاحظات المستخدمين أو جميع أعضاء فريق.</p>
<p>وبفضل هذه التعريفات، يمكننا أيضاً الوصول مباشرة في الشيفرة إلى ملاحظات المستخدم مثلاً. فمثلاً، تبحث الشيفرة التالية عن المستخدم ذي المعرّف 1 وتطبع الملاحظات المرتبطة بذلك المستخدم:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(<span class="hljs-number">1</span>, {
  <span class="hljs-attr">include</span>: {
    <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>
  }
})

user.<span class="hljs-property">notes</span>.<span class="hljs-title function_">forEach</span>(note =&amp;gt; {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(note.<span class="hljs-property">content</span>)
})
</code></pre>
<p>وهكذا يُرفق تعريف <em>User.hasMany(Note)</em> خاصية <em>notes</em> بكائن <em>user</em>، ما يتيح الوصول إلى الملاحظات التي أنشأها المستخدم. وبالمثل، يُرفق تعريف <em>User.belongsToMany(Team, { through: Membership }))</em> خاصية <em>teams</em> بكائن <em>user</em>، ويمكن استخدامها أيضاً في الشيفرة:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(<span class="hljs-number">1</span>, {
  <span class="hljs-attr">include</span>: {
    <span class="hljs-attr">model</span>: <span class="hljs-title class_">Team</span>
  }
})

user.<span class="hljs-property">teams</span>.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">team</span> =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(team.<span class="hljs-property">name</span>)
})
</code></pre>
<p>لنفترض أننا نريد إعادة كائن JSON من مسار مستخدم واحد يحتوي على اسم المستخدم واسم الدخول وعدد الملاحظات المنشأة. يمكننا أن نجرّب ما يلي:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>, {
    <span class="hljs-attr">include</span>: {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>
      }
    }
  )

  <span class="hljs-keyword">if</span> (user) {
    user.<span class="hljs-property">note_count</span> = user.<span class="hljs-property">notes</span>.<span class="hljs-property">length</span>
    <span class="hljs-keyword">delete</span> user.<span class="hljs-property">notes</span>
    res.<span class="hljs-title function_">json</span>(user)
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }
})
</code></pre>
<p>إذن حاولنا إضافة الحقل <em>noteCount</em> إلى الكائن الذي تعيده Sequelize وحذف الحقل <em>notes</em> منه. غير أن هذا الأسلوب لا يعمل لأن الكائنات التي تعيدها Sequelize ليست كائنات عادية يمكننا إضافة حقول جديدة إليها كما نشاء.</p>
<p>الحل الأفضل هو إنشاء كائن جديد تماماً استناداً إلى البيانات المجلوبة من قاعدة البيانات:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>, {
    <span class="hljs-attr">include</span>: {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>
      }
    }
  )

  <span class="hljs-keyword">if</span> (user) {
    res.<span class="hljs-title function_">json</span>({
      <span class="hljs-attr">username</span>: user.<span class="hljs-property">username</span>,
      <span class="hljs-attr">name</span>: user.<span class="hljs-property">name</span>,
      <span class="hljs-attr">note_count</span>: user.<span class="hljs-property">notes</span>.<span class="hljs-property">length</span>
    })
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }
})
</code></pre>
<h3 id="إعادة-النظر-في-علاقات-متعدد-إلى-متعدد">إعادة النظر في علاقات متعدد إلى متعدد</h3>
<p>لنُنشئ علاقة أخرى متعدد إلى متعدد في التطبيق. كل ملاحظة مرتبطة بالمستخدم الذي أنشأها عبر مفتاح أجنبي. وقد تقرر الآن أن يدعم التطبيق أيضاً إمكانية ربط الملاحظة بمستخدمين آخرين، وأن يرتبط المستخدم بعدد اعتباطي من الملاحظات التي أنشأها مستخدمون آخرون. والفكرة أن هذه الملاحظات هي التي <em>علّمها</em> المستخدم لنفسه.</p>
<p>لنُنشئ جدول ربط باسم <em>user_notes</em> لهذه الحالة. والترحيل، المحفوظ في الملف <em>20260211_04_add_user_notes.js</em>، مباشر وبسيط:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">up</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;user_notes&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">user_id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
      },
      <span class="hljs-attr">note_id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;notes&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
      },
    })
  },
  <span class="hljs-attr">down</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;user_notes&#x27;</span>)
  },
}
</code></pre>
<p>كما لا يوجد شيء خاص في النموذج:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">Model</span>, <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-keyword">const</span> { sequelize } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;../util/db&#x27;</span>)

<span class="hljs-keyword">class</span> <span class="hljs-title class_">UserNotes</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {}

<span class="hljs-title class_">UserNotes</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-attr">id</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-attr">userId</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;users&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
  },
  <span class="hljs-attr">noteId</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">references</span>: { <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;notes&#x27;</span>, <span class="hljs-attr">key</span>: <span class="hljs-string">&#x27;id&#x27;</span> },
  },
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;user_notes&#x27;</span>
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">UserNotes</span>
</code></pre>
<p>أما الملف <em>models/index.js</em> فيأتي بتغيير طفيف عما رأيناه سابقاً:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Note</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./note&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">User</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./user&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Team</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./team&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">Membership</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./membership&#x27;</span>)
<span class="hljs-keyword">const</span> <span class="hljs-title class_">UserNotes</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./user_notes&#x27;</span>)

<span class="hljs-title class_">Note</span>.<span class="hljs-title function_">belongsTo</span>(<span class="hljs-title class_">User</span>)
<span class="hljs-title class_">User</span>.<span class="hljs-title function_">hasMany</span>(<span class="hljs-title class_">Note</span>)

<span class="hljs-title class_">User</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">Team</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">Membership</span> })
<span class="hljs-title class_">Team</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">User</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">Membership</span> })

<span class="hljs-title class_">User</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">Note</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">UserNotes</span>, <span class="hljs-attr">as</span>: <span class="hljs-string">&#x27;marked_notes&#x27;</span> })
<span class="hljs-title class_">Note</span>.<span class="hljs-title function_">belongsToMany</span>(<span class="hljs-title class_">User</span>, { <span class="hljs-attr">through</span>: <span class="hljs-title class_">UserNotes</span>, <span class="hljs-attr">as</span>: <span class="hljs-string">&#x27;users_marked&#x27;</span> })

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-title class_">Note</span>, <span class="hljs-title class_">User</span>, <span class="hljs-title class_">Team</span>, <span class="hljs-title class_">Membership</span>, <span class="hljs-title class_">UserNotes</span>
}
</code></pre>
<p>مرة أخرى، تُستخدم <em>belongsToMany</em> لربط المستخدم بملاحظاته. ويتم الربط عبر جدول الربط المقابل للنموذج UserNotes. غير أننا هذه المرة نعطي <em>اسماً مستعاراً</em> للخاصية المتكوّنة باستخدام الكلمة المفتاحية as. فالاسم الافتراضي <em>user.notes</em> كان سيتداخل مع معناه السابق، أي الملاحظات التي أنشأها المستخدم.</p>
<p>نوسّع مسار المستخدم الفردي ليعيد فرق المستخدم وملاحظاته الخاصة والملاحظات الأخرى التي علّمها المستخدم:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&amp;gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>, {
    <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;&#x27;</span>] } ,
    <span class="hljs-attr">include</span>:[{
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>] }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">as</span>: <span class="hljs-string">&#x27;marked_notes&#x27;</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>]},
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Team</span>,
        <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;id&#x27;</span>],
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        }
      },
    ]
  })

  <span class="hljs-keyword">if</span> (user) {
    res.<span class="hljs-title function_">json</span>(user)
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }
})
</code></pre>
<p>وفي سياق include، يجب الآن استخدام الاسم المستعار <em>marked_notes</em> الذي عرّفناه للتو بالخاصية <em>as</em>.</p>
<p>لاختبار الميزة، لننشئ بعض بيانات الاختبار في قاعدة البيانات:</p>
<pre><code class="language-sql"><span class="hljs-keyword">insert into</span> user_notes (user_id, note_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">3</span>, <span class="hljs-number">1</span>);
<span class="hljs-keyword">insert into</span> user_notes (user_id, note_id) <span class="hljs-keyword">values</span> (<span class="hljs-number">3</span>, <span class="hljs-number">3</span>);
</code></pre>
<p>تبدو النتيجة النهائية جيدة:</p>
<p><img src="/images/mooc/8fe5b762dfd2.webp" alt="صورة توضيحية"></p>
<p>ماذا لو أردنا تضمين معلومات عن كاتب الملاحظة في الملاحظات التي علّمها المستخدم أيضاً؟ يمكن فعل ذلك بإضافة <em>include</em> إلى الملاحظات المعلَّمة:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>, {
    <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;&#x27;</span>] } ,
    <span class="hljs-attr">include</span>:[{
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>] }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">as</span>: <span class="hljs-string">&#x27;marked_notes&#x27;</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>]},
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        },
        <span class="hljs-attr">include</span>: {
          <span class="hljs-attr">model</span>: <span class="hljs-title class_">User</span>,
          <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>]
        }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Team</span>,
        <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;id&#x27;</span>],
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        }
      },
    ]
  })

  <span class="hljs-keyword">if</span> (user) {
    res.<span class="hljs-title function_">json</span>(user)
  } <span class="hljs-keyword">else</span> {
    res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }
})
</code></pre>
<p>وأخيراً نحصل على ما نريد:</p>
<p><img src="/images/mooc/09d7a4b213c2.webp" alt="صورة توضيحية"></p>
<p>الشيفرة الحالية للتطبيق موجودة بالكامل على <a href="https://github.com/fullstack-hy2020/fs-psql/tree/step9" target="_blank" rel="noreferrer noopener">GitHub</a>، الفرع <em>step9</em>.</p>
<div class="tasks">
<p><strong>20. قائمة القراءة</strong></p>
</div>
<div class="tasks">
<p><strong>21. توسيع قائمة القراءة</strong></p>
</div>
<div class="tasks">
<p><strong>22. مسك الدفاتر</strong></p>
</div>
<div class="tasks">
<p><strong>23. مسك دفاتر أفضل</strong></p>
</div>
<div class="tasks">
<p><strong>24. مزيد من التحكم</strong></p>
</div>
<h3 id="ملاحظات-ختامية">ملاحظات ختامية</h3>
<p>تطبيقنا الآن في حالة مقبولة على الأقل. غير أننا قبل أن نختتم هذا القسم، سنتناول بضع نقاط أخرى.</p>
<h4 id="الجلب-المتلهف-مقابل-الجلب-الكسول">الجلب المتلهف مقابل الجلب الكسول</h4>
<p>عندما نُجري استعلامات باستخدام الخاصية <em>include</em>:</p>
<pre><code>User.findOne({
  include: {
    model: note
  }
})
</code></pre>
<p>يتسبب هذا في <a href="https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations" target="_blank" rel="noreferrer noopener">جلب متلهف (eager)</a>، أي أن جميع صفوف الجداول المرتبطة بالمستخدم عبر استعلام الربط، وفي المثال الملاحظات التي أنشأها المستخدم، تُجلب من قاعدة البيانات في الوقت نفسه. وهذا غالباً ما نريده، لكن هناك أيضاً حالات تريد فيها إجراء <em>جلب كسول (lazy)</em>، أي البحث عن الفرق المرتبطة بالمستخدم فقط عند الحاجة إليها.</p>
<p>لنعدّل الآن مسار المستخدم الفردي بحيث يجلب فرق المستخدم فقط إذا كان معامل الاستعلام <em>teams</em> مضبوطاً في الطلب:</p>
<pre><code class="language-js">router.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;/:id&#x27;</span>, <span class="hljs-title function_">async</span> (req, res) =&gt; {
  <span class="hljs-keyword">const</span> user = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findByPk</span>(req.<span class="hljs-property">params</span>.<span class="hljs-property">id</span>, {
    <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;&#x27;</span>] } ,
    <span class="hljs-attr">include</span>:[{
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>] }
      },
      {
        <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
        <span class="hljs-attr">as</span>: <span class="hljs-string">&#x27;marked_notes&#x27;</span>,
        <span class="hljs-attr">attributes</span>: { <span class="hljs-attr">exclude</span>: [<span class="hljs-string">&#x27;userId&#x27;</span>]},
        <span class="hljs-attr">through</span>: {
          <span class="hljs-attr">attributes</span>: []
        },
        <span class="hljs-attr">include</span>: {
          <span class="hljs-attr">model</span>: <span class="hljs-title class_">User</span>,
          <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>]
        }
      },
    ]
  })

  <span class="hljs-keyword">if</span> (!user) {
    <span class="hljs-keyword">return</span> res.<span class="hljs-title function_">status</span>(<span class="hljs-number">404</span>).<span class="hljs-title function_">end</span>()
  }

  <span class="hljs-keyword">let</span> teams = <span class="hljs-literal">undefined</span>
  <span class="hljs-keyword">if</span> (req.<span class="hljs-property">query</span>.<span class="hljs-property">teams</span>) {
    teams = <span class="hljs-keyword">await</span> user.<span class="hljs-title function_">getTeams</span>({
      <span class="hljs-attr">attributes</span>: [<span class="hljs-string">&#x27;name&#x27;</span>],
      <span class="hljs-attr">joinTableAttributes</span>: []
    })
  }
  res.<span class="hljs-title function_">json</span>({ ...user.<span class="hljs-title function_">toJSON</span>(), teams })
})
</code></pre>
<p>إذن الآن، لا يجلب استعلام <em>User.findByPk</em> الفرق، بل تُجلب عند الحاجة بواسطة دالة <em>user</em> المسماة <em>getTeams</em> التي تولّدها Sequelize تلقائياً لكائن النموذج. وتُولَّد تلقائياً دوال مشابهة تبدأ بـ <em>get</em> وغيرها من الدوال المفيدة <a href="https://sequelize.org/master/manual/assocs.html#special-methodsmixins-added-to-instances" target="_blank" rel="noreferrer noopener">عند تعريف ارتباطات الجداول</a> على مستوى Sequelize.</p>
<h4 id="ميزات-النماذج">ميزات النماذج</h4>
<p>هناك بعض الحالات التي لا نريد فيها، افتراضياً، التعامل مع جميع صفوف جدول معين. ومن هذه الحالات ألا نريد عادةً عرض المستخدمين الذين <em>عُطّلوا</em> في تطبيقنا. وفي مثل هذه الحالة، يمكننا تعريف <a href="https://sequelize.org/master/manual/scopes.html" target="_blank" rel="noreferrer noopener">النطاق (scope)</a> الافتراضي للنموذج كما يلي:</p>
<pre><code class="language-js"><span class="hljs-keyword">class</span> <span class="hljs-title class_">User</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {}

<span class="hljs-title class_">User</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-comment">// تعريفات الحقول</span>
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;user&#x27;</span>,
  <span class="hljs-attr">defaultScope</span>: {
    <span class="hljs-attr">where</span>: {
      <span class="hljs-attr">disabled</span>: <span class="hljs-literal">false</span>
    }
  },
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">User</span>
</code></pre>
<p>الآن أصبح الاستعلام الناتج عن استدعاء الدالة <em>User.findAll()</em> يتضمن شرط WHERE التالي:</p>
<pre><code>WHERE &quot;user&quot;. &quot;disabled&quot; = false;
</code></pre>
<p>وبالنسبة للنماذج، يمكن تعريف نطاقات أخرى أيضاً:</p>
<pre><code class="language-js"><span class="hljs-title class_">User</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-comment">// تعريفات الحقول</span>
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;user&#x27;</span>,
  <span class="hljs-attr">defaultScope</span>: {
    <span class="hljs-attr">where</span>: {
      <span class="hljs-attr">disabled</span>: <span class="hljs-literal">false</span>
    }
  },
  <span class="hljs-attr">scopes</span>: {
    <span class="hljs-attr">admin</span>: {
      <span class="hljs-attr">where</span>: {
        <span class="hljs-attr">admin</span>: <span class="hljs-literal">true</span>
      }
    },
    <span class="hljs-attr">disabled</span>: {
      <span class="hljs-attr">where</span>: {
        <span class="hljs-attr">disabled</span>: <span class="hljs-literal">true</span>
      }
    },
    <span class="hljs-title function_">name</span>(<span class="hljs-params">value</span>) {
      <span class="hljs-keyword">return</span> {
        <span class="hljs-attr">where</span>: {
          <span class="hljs-attr">name</span>: {
            [<span class="hljs-title class_">Op</span>.<span class="hljs-property">iLike</span>]: value
          }
        }
      }
    },
  }
})
</code></pre>
<p>تُستخدم النطاقات كما يلي:</p>
<pre><code class="language-js"><span class="hljs-comment">// جميع المشرفين</span>
<span class="hljs-keyword">const</span> adminUsers = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">scope</span>(<span class="hljs-string">&#x27;admin&#x27;</span>).<span class="hljs-title function_">findAll</span>()

<span class="hljs-comment">// جميع المستخدمين غير النشطين</span>
<span class="hljs-keyword">const</span> disabledUsers = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">scope</span>(<span class="hljs-string">&#x27;disabled&#x27;</span>).<span class="hljs-title function_">findAll</span>()

<span class="hljs-comment">// المستخدمون الذين يحتوي اسمهم على النص jami</span>
<span class="hljs-keyword">const</span> jamiUsers = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">scope</span>({ <span class="hljs-attr">method</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;%jami%&#x27;</span>] }).<span class="hljs-title function_">findAll</span>()
</code></pre>
<p>ومن الممكن أيضاً تسلسل النطاقات:</p>
<pre><code class="language-js"><span class="hljs-comment">// مشرفون يحتوي اسمهم على النص jami</span>
<span class="hljs-keyword">const</span> jamiUsers = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">scope</span>(<span class="hljs-string">&#x27;admin&#x27;</span>, { <span class="hljs-attr">method</span>: [<span class="hljs-string">&#x27;name&#x27;</span>, <span class="hljs-string">&#x27;%jami%&#x27;</span>] }).<span class="hljs-title function_">findAll</span>()
</code></pre>
<p>بما أن نماذج Sequelize هي أصناف <a href="https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes" target="_blank" rel="noreferrer noopener">JavaScript</a> عادية، فمن الممكن إضافة دوال جديدة إليها.</p>
<p>وفيما يلي مثالان:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">Model</span>, <span class="hljs-title class_">DataTypes</span>, <span class="hljs-title class_">Op</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-keyword">const</span> <span class="hljs-title class_">Note</span> = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;./note&#x27;</span>)
<span class="hljs-keyword">const</span> { sequelize } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;../util/db&#x27;</span>)

<span class="hljs-keyword">class</span> <span class="hljs-title class_">User</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {

  <span class="hljs-keyword">async</span> <span class="hljs-title function_">numberOfNotes</span>(<span class="hljs-params"></span>) {
    <span class="hljs-keyword">return</span> (<span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">getNotes</span>()).<span class="hljs-property">length</span>
  }

  <span class="hljs-keyword">static</span> <span class="hljs-keyword">async</span> <span class="hljs-title function_">withNotes</span>(<span class="hljs-params">limit</span>){
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findAll</span>({
      <span class="hljs-attr">attributes</span>: {
        <span class="hljs-attr">include</span>: [[ sequelize.<span class="hljs-title function_">fn</span>(<span class="hljs-string">&quot;COUNT&quot;</span>, sequelize.<span class="hljs-title function_">col</span>(<span class="hljs-string">&quot;notes.id&quot;</span>)), <span class="hljs-string">&quot;note_count&quot;</span> ]]
      },
      <span class="hljs-attr">include</span>: [
        {
          <span class="hljs-attr">model</span>: <span class="hljs-title class_">Note</span>,
          <span class="hljs-attr">attributes</span>: []
        },
      ],
      <span class="hljs-attr">group</span>: [<span class="hljs-string">&#x27;user.id&#x27;</span>],
      <span class="hljs-attr">having</span>: sequelize.<span class="hljs-title function_">literal</span>(<span class="hljs-string">\`COUNT(notes.id) &gt; <span class="hljs-subst">\${limit}</span>\`</span>)
    })
  }
}

<span class="hljs-title class_">User</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-comment">// ...</span>
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">User</span>
</code></pre>
<p>الدالة الأولى <em>numberOfNotes</em> هي <em>دالة نسخة (instance method)</em>، أي أنها تُستدعى على نسخ النموذج:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> jami = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">findOne</span>({ <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Jami Kousa&#x27;</span>})
<span class="hljs-keyword">const</span> cnt = <span class="hljs-keyword">await</span> jami.<span class="hljs-title function_">numberOfNotes</span>()
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">\`Jami has created <span class="hljs-subst">\${cnt}</span> notes\`</span>)
</code></pre>
<p>وهكذا تشير الكلمة المفتاحية <em>this</em> داخل دالة النسخة إلى النسخة نفسها:</p>
<pre><code class="language-js"><span class="hljs-keyword">async</span> <span class="hljs-title function_">numberOfNotes</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> (<span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-title function_">getNotes</span>()).<span class="hljs-property">length</span>
}
</code></pre>
<p>أما الدالة الثانية <em>withNotes</em> فتعيد المستخدمين الذين لديهم على الأقل العدد المحدد من الملاحظات. وهي <em>دالة صنف (class method)</em>، أي أنها تُستدعى مباشرة على النموذج:</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> users = <span class="hljs-keyword">await</span> <span class="hljs-title class_">User</span>.<span class="hljs-title function_">withNotes</span>(<span class="hljs-number">2</span>)
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>(users, <span class="hljs-literal">null</span>, <span class="hljs-number">2</span>))
users.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">u</span> =&gt;</span> {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(u.<span class="hljs-property">name</span>)
})
</code></pre>
<h4 id="تكرار-الشيفرة-في-النماذج-والترحيلات">تكرار الشيفرة في النماذج والترحيلات</h4>
<p>لاحظنا أن شيفرة النماذج والترحيلات متشابهة جداً. فمثلاً، نموذج الفرق</p>
<pre><code class="language-js"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Team</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">Model</span> {}

<span class="hljs-title class_">Team</span>.<span class="hljs-title function_">init</span>({
  <span class="hljs-attr">id</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
    <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-attr">name</span>: {
    <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">TEXT</span>,
    <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
    <span class="hljs-attr">unique</span>: <span class="hljs-literal">true</span>
  },
}, {
  sequelize,
  <span class="hljs-attr">underscored</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-attr">timestamps</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-attr">modelName</span>: <span class="hljs-string">&#x27;team&#x27;</span>
})

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-title class_">Team</span>
</code></pre>
<p>والترحيل يحتويان على الكثير من الشيفرة نفسها</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> { <span class="hljs-title class_">DataTypes</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">&#x27;sequelize&#x27;</span>)

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">up</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">createTable</span>(<span class="hljs-string">&#x27;teams&#x27;</span>, {
      <span class="hljs-attr">id</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">INTEGER</span>,
        <span class="hljs-attr">primaryKey</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">autoIncrement</span>: <span class="hljs-literal">true</span>
      },
      <span class="hljs-attr">name</span>: {
        <span class="hljs-attr">type</span>: <span class="hljs-title class_">DataTypes</span>.<span class="hljs-property">TEXT</span>,
        <span class="hljs-attr">allowNull</span>: <span class="hljs-literal">false</span>,
        <span class="hljs-attr">unique</span>: <span class="hljs-literal">true</span>
      },
    })
  },
  <span class="hljs-attr">down</span>: <span class="hljs-title function_">async</span> ({ <span class="hljs-attr">context</span>: queryInterface }) =&amp;gt; {
    <span class="hljs-keyword">await</span> queryInterface.<span class="hljs-title function_">dropTable</span>(<span class="hljs-string">&#x27;teams&#x27;</span>)
  },
}
</code></pre>
<p>ألا يمكننا تحسين الشيفرة بحيث يصدّر النموذج مثلاً الأجزاء المشتركة اللازمة للترحيل؟</p>
<p>المشكلة أن تعريف النموذج قد يتغير بمرور الوقت، فمثلاً قد يتغير حقل الاسم أو يتغير نوع بياناته. ويجب أن يكون بالإمكان تنفيذ الترحيلات بنجاح في أي وقت من البداية إلى النهاية، وإذا كانت الترحيلات تعتمد على أن يحتوي النموذج على محتوى معين، فقد لا يبقى ذلك صحيحاً بعد شهر أو سنة. لذلك، ورغم «النسخ واللصق»، ينبغي أن تكون شيفرة الترحيل منفصلة تماماً عن شيفرة النموذج.</p>
<p>ومن الحلول استخدام <a href="https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration" target="_blank" rel="noreferrer noopener">أداة سطر الأوامر</a> الخاصة بـSequelize، التي تولّد كلاً من النماذج وملفات الترحيل بناءً على أوامر تُعطى في سطر الأوامر. فمثلاً، سيُنشئ الأمر التالي نموذج <em>User</em> بخصائص <em>name</em> و <em>username</em> و <em>admin</em>، بالإضافة إلى الترحيل الذي يدير إنشاء جدول قاعدة البيانات:</p>
<pre><code class="language-bash">npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
</code></pre>
<p>ومن سطر الأوامر، يمكنك أيضاً تنفيذ عمليات التراجع، أي إلغاء الترحيلات. لكن توثيق سطر الأوامر ناقص للأسف، وقد قررنا في هذا المقرر إجراء النماذج والترحيلات يدوياً. وقد يكون هذا الحل حكيماً أو لا يكون.</p>
<div class="tasks">
<p><strong>25. الختام الكبير</strong></p>
</div>
<div class="tasks">
<p><strong>26. الفحص النهائي</strong></p>
</div>
<div class="tasks">
<p><strong>27. مستودع GitHub الخاص بك</strong></p>
</div>
`,r={part:13,letter:"d",file:s,title:a,slug:n,mainImage:l,headings:p,html:e};export{r as default,s as file,p as headings,e as html,c as letter,l as mainImage,t as part,n as slug,a as title};
