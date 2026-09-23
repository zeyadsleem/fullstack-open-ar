---
part: 12
letter: c
title: "الفصل 3: بناء البيئات وتهيئتها"
mainImage: /images/part-12.svg
lang: ar
---
في القسم السابق، استخدمنا صورتين أساسيتين مختلفتين: ubuntu وnode، وقمنا ببعض العمل اليدوي لتشغيل تطبيق بسيط يطبع «Hello, World!». وستكون الأدوات والأوامر التي تعلمناها خلال تلك العملية مفيدة. في هذا القسم، سنتعلم كيفية بناء الصور وتهيئة البيئات لتطبيقاتنا. سنبدأ بواجهة خلفية عادية بـExpress/Node.js ثم نبني فوقها خدمات أخرى، بما في ذلك قاعدة بيانات MongoDB.

### Dockerfile

بدلاً من تعديل حاوية عبر نسخ الملفات إليها، يمكننا إنشاء صورة جديدة تحتوي على تطبيق «Hello, World!». الأداة اللازمة لذلك هي <a href="https://docs.docker.com/build/concepts/dockerfile/" data-type="link" data-id="https://docs.docker.com/build/concepts/dockerfile/">Dockerfile.</a> وملف Dockerfile هو ملف نصي بسيط يحتوي على كل التعليمات اللازمة لإنشاء صورة. لننشئ ملف Dockerfile مثالياً لتطبيق «Hello, World!».

لننشئ الآن مجلداً وملفاً باسم <em>Dockerfile</em> داخل ذلك المجلد. ولنضع أيضاً ملف <em>index.js</em> يحتوي على <em>console.log('Hello, World!')</em> بجانب ملف Dockerfile. يبدو هيكل المجلد هكذا:

```
├── index.js
└── Dockerfile
```

داخل ملف Dockerfile سنخبر الصورة بثلاثة أمور:
- استخدام <a href="https://hub.docker.com/_/node">node:24</a> كأساس لصورتنا
- تضمين ملف index.js داخل الصورة، حتى لا نحتاج إلى نسخه يدوياً إلى الحاوية
- عند تشغيل حاوية من الصورة، استخدم Node لتنفيذ ملف index.js.

ستترجم الأمنيات أعلاه إلى ملف Dockerfile أساسي. وأفضل مكان لوضع هذا الملف هو عادةً جذر المشروع.

يبدو <em>Dockerfile</em>&nbsp;الناتج هكذا:

```
FROM node:24

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD ["node", "index.js"]
```

تُخبر تعليمة <a href="https://docs.docker.com/reference/dockerfile/#from" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#from">FROM</a> برنامج Docker بأن أساس الصورة هو node:24. وتنسخ تعليمة <a href="https://docs.docker.com/reference/dockerfile/#copy" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#copy">COPY</a> الملف <em>index.js</em> من الجهاز المضيف إلى ملف بالاسم نفسه داخل الصورة. أما تعليمة <a href="https://docs.docker.com/reference/dockerfile/#cmd" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#cmd">CMD</a> فتحدد الأمر الافتراضي الذي يُنفَّذ عند تشغيل حاوية باستخدام <code>docker run</code>. نحن نستخدم صيغة <a href="https://docs.docker.com/reference/dockerfile/#exec-form" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#exec-form">exec</a> <code>CMD ["node", "index.js"]</code> التي تنفّذ الملف التنفيذي <em>node</em> مع <em>index.js</em> كوسيط له.

أُضيفت تعليمة <a href="https://docs.docker.com/reference/dockerfile/#workdir" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#workdir">WORKDIR</a> لضمان عدم تعارضنا مع محتويات الصورة. فهي تضمن أن يكون <em>/usr/src/app</em> هو مجلد العمل لجميع الأوامر التالية. وإذا لم يكن المجلد موجوداً في الصورة الأساسية، فسيُنشأ تلقائياً.

> إذا لم نحدد WORKDIR، فإننا نخاطر بالكتابة فوق ملفات مهمة عن طريق الخطأ. وإذا فحصت الجذر (<em>/</em>) في صورة node:24 باستخدام <code>docker run node:24 ls</code> فستلاحظ كل المجلدات والملفات المضمّنة أصلاً في الصورة.

يمكننا الآن استخدام الأمر <code>docker build</code> لبناء صورة انطلاقاً من ملف Dockerfile. لنضف إلى الأمر علامة إضافية واحدة: <code>-t</code> التي ستساعدنا على تسمية الصورة:

```
$ docker build -t fs-hello-world .
[+] Building 3.9s (8/8) FINISHED
...
```

إذن النتيجة هي

> يا Docker، ابنِ بالوسم (يمكنك اعتبار الوسم اسم الصورة الناتجة) <em>fs-hello-world</em> ملفَ Dockerfile الموجود في هذا المجلد.

يمكنك الإشارة إلى أي ملف Dockerfile، لكن في حالتنا تعني النقطة البسيطة أن ملف Dockerfile موجود في <em>هذا</em> المجلد. ولهذا ينتهي الأمر بنقطة. بعد انتهاء البناء، يمكنك تشغيله باستخدام <code>docker run fs-hello-world</code>:

```
$ docker run fs-hello-world
Hello, World
```

بما أن الصور مجرد ملفات، فيمكن نقلها وتنزيلها وحذفها. يمكنك سرد الصور الموجودة لديك محلياً باستخدام <code>docker image ls</code>، وحذفها باستخدام <code>docker image rm</code>. ولمعرفة الأوامر الأخرى المتاحة لديك استخدم <code>docker image --help</code>.

أمر آخر: ذُكر أن الأمر الافتراضي المحدد بواسطة CMD في ملف Dockerfile يمكن تجاوزه عند الحاجة. يمكننا مثلاً فتح جلسة bash في الحاوية وفحص محتواها:

```
$ docker run -it fs-hello-world bash
root@2932e32dbc09:/usr/src/app# ls
index.js
root@2932e32dbc09:/usr/src/app#
```

### صورة أكثر فائدة

نقل خادم Express إلى حاوية ينبغي أن يكون بسيطاً مثل نقل تطبيق «Hello, World!» إلى حاوية. الفرق الوحيد هو وجود ملفات أكثر. ولحسن الحظ، يمكن لتعليمة <em>COPY</em>&nbsp;التعامل مع كل ذلك. لنحذف ملف index.js وننشئ خادم Express جديداً. لنستخدم <a href="https://expressjs.com/en/starter/generator.html" target="_blank" rel="noreferrer noopener">express-generator</a>&nbsp;لإنشاء هيكل أساسي لتطبيق Express.

```
$ npx express-generator
  ...

  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

أولاً، لنشغّل التطبيق لنأخذ فكرة عما أنشأناه للتو. لاحظ أن أمر تشغيل التطبيق قد يختلف لديك؛ فمجلدي كان اسمه playground.

```
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

رائع، يمكننا الآن الانتقال إلى <a href="http://localhost:3000/" target="_blank" rel="noreferrer noopener">http://localhost:3000</a> حيث يعمل التطبيق:

![صورة توضيحية](/images/mooc/7b576695c8d1.webp)

وضع ذلك في حاوية ينبغي أن يكون سهلاً نسبياً بناءً على المثال السابق.
- استخدام node كأساس
- تحديد مجلد العمل حتى لا نتعارض مع محتويات الصورة الأساسية
- نسخ كل ملفات هذا المجلد إلى الصورة
- البدء بـ DEBUG=playground:* npm start

تتوقع <a href="https://docs.docker.com/reference/dockerfile/#shell-and-exec-form" target="_blank" rel="noreferrer noopener">صيغة exec</a> من تعليمة CMD وسائط بالصيغة ["executable", "param1", "param2", ...]، أي أن العنصر الأول يجب أن يكون أمراً تنفيذياً. في حالتنا، يبدأ الأمر بتعيين متغير بيئة، وهذا لا يحقق هذا الشرط. النهج الصحيح هو تعيين متغير البيئة باستخدام تعليمة <a href="https://docs.docker.com/reference/dockerfile/#env" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#env">ENV</a> بدلاً من ذلك.

لنضع ملف Dockerfile التالي في جذر المشروع:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

ENV DEBUG=playground:*

CMD ["npm", "start"]
```

يمكننا الآن بناء الصورة من ملف Dockerfile وتشغيلها:

```bash
docker build -t express-server .
docker run -p 3123:3000 express-server
```

تُخبر العلامة <code>-p</code> في أمر التشغيل برنامج Docker بضرورة فتح منفذ من الجهاز المضيف وتوجيهه إلى منفذ في الحاوية. الصيغة هي <code>-p host-port:application-port</code>.

التطبيق يعمل الآن! لنختبره بإرسال طلب GET إلى <a href="http://localhost:3123/" target="_blank" rel="noreferrer noopener">http://localhost:3123/</a>.

> إذا لم يعمل لديك، فتجاوز إلى القسم التالي. فهناك تفسير لسبب عدم عمله حتى لو اتبعت الخطوات بشكل صحيح.

إيقاف التطبيق يمثل صداعاً في الوقت الحالي. استخدم طرفية أخرى وأمر <code>docker kill</code> لقتل التطبيق. سيرسل الأمر <code>docker kill</code> إشارة قتل (SIGKILL) إلى التطبيق لإجباره على الإيقاف. ويحتاج إلى اسم الحاوية أو معرّفها كوسيط.

لاحظ أنه عند استخدام المعرّف كوسيط، تكفي بداية المعرّف ليعرف Docker أي حاوية نقصد.

```
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123-&gt;3000/tcp, :::3123-&gt;3000/tcp   infallible_booth

$ docker kill 48
  48
```

في المستقبل، لنستخدم المنفذ نفسه على جانبي <code>-p</code>. حتى لا نضطر إلى تذكر أي منفذ اخترناه.

#### إصلاح المشكلات المحتملة التي أنشأناها بالنسخ واللصق

هناك بضع خطوات نحتاج إلى تغييرها لإنشاء ملف Dockerfile أكثر شمولاً. بل قد لا يعمل المثال أعلاه في جميع الحالات لأننا تخطينا خطوة مهمة.

عندما شغّلنا <code>npm install</code> على جهازنا، فقد يقوم مدير حزم Node في بعض الحالات بتثبيت اعتماديات خاصة بنظام التشغيل أثناء خطوة التثبيت. وقد ننقل بالخطأ أجزاء غير عاملة إلى الصورة عبر تعليمة COPY. ويمكن أن يحدث هذا بسهولة إذا نسخنا مجلد <em>node_modules</em> إلى الصورة.

هذا أمر بالغ الأهمية يجب تذكره عند بناء صورنا. من الأفضل إنجاز معظم الأمور، مثل تشغيل <code>npm install</code> أثناء عملية البناء، <em>داخل الحاوية</em>، بدلاً من القيام بها قبل البناء. القاعدة السهلة هي نسخ الملفات التي ستدفعها إلى GitHub فقط. لا ينبغي نسخ نواتج البناء أو الاعتماديات لأنها يمكن تثبيتها أثناء عملية البناء.

يمكننا استخدام ملف <em>.dockerignore</em> لحل المشكلة. ملف .dockerignore شبيه جداً بملف .gitignore، ويمكنك استخدامه لمنع نسخ الملفات غير المرغوب فيها إلى صورتك. وينبغي وضع الملف بجانب ملف Dockerfile. إليك محتوى محتملاً لملف <em>.dockerignore</em>

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

في حالتنا، لا يُعد ملف .dockerignore الشيء الوحيد المطلوب. نحتاج أيضاً إلى تثبيت الاعتماديات أثناء خطوة البناء. يتغير ملف <em>Dockerfile</em> إلى:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

// BEGIN HIGHLIGHT
RUN npm install

ENV DEBUG=express:*

CMD ["npm", "start"]
// END HIGHLIGHT
```

قد يكون <code>npm install</code> محفوفاً بالمخاطر. فبدلاً من استخدام npm install، يقدم npm أداة أفضل بكثير لتثبيت الاعتماديات، وهي أمر <a href="https://docs.npmjs.com/cli/v9/commands/npm-ci" data-type="link" data-id="https://docs.npmjs.com/cli/v9/commands/npm-ci">ci</a>.

الفروق بين ci وinstall:
- قد يحدّث install ملف package-lock.json
- قد يثبّت install إصداراً مختلفاً من إحدى الاعتماديات إذا كان لديك ^ أو ~ في إصدار الاعتمادية.
- سيحذف ci مجلد node_modules قبل تثبيت أي شيء
- سيتبع ci ملف package-lock.json ولن يغيّر أي ملفات

باختصار: <em>ci</em>&nbsp;ينشئ عمليات بناء موثوقة، بينما <em>install</em>&nbsp;هو الذي تستخدمه عندما تريد تثبيت اعتماديات جديدة.

بما أننا لا نثبّت أي شيء جديد أثناء خطوة البناء، ولا نريد أن تتغير الإصدارات فجأة، فسنستخدم <em>ci</em>:

```
FROM node:24

WORKDIR /usr/src/app

COPY . .

// BEGIN HIGHLIGHT
RUN npm ci

ENV DEBUG=express:*

CMD ["npm", "start"]
// END HIGHLIGHT
```

والأفضل من ذلك، يمكننا استخدام <code>npm ci --omit=dev</code> لعدم إضاعة الوقت في تثبيت اعتماديات التطوير.

> كما لاحظت في المقارنة أعلاه، يحذف <code>npm ci</code> مجلد node_modules، لذا لم يكن لإنشاء ملف .dockerignore أي أهمية. ومع ذلك، يُعد .dockerignore أداة رائعة عندما تريد تحسين عملية البناء. سنتحدث بإيجاز عن هذه التحسينات لاحقاً.

الآن ينبغي أن يعمل ملف Dockerfile مرة أخرى. جرّبه باستخدام <code>docker build -t express-server . &amp;&amp; docker run -p 3123:3000 express-server</code>

> لاحظ أننا هنا نسلسل أمرين من أوامر bash باستخدام &amp;&amp;. يمكننا الحصول على التأثير نفسه (تقريباً) بتشغيل الأمرين بشكل منفصل. عند تسلسل الأوامر باستخدام &amp;&amp;، إذا فشل أحد الأوامر فلن تُنفَّذ الأوامر التالية في السلسلة.

### أفضل ممارسات Dockerfile

هناك قاعدتان عامتان ينبغي اتباعهما عند إنشاء الصور:
- حاول إنشاء صورة <strong>آمنة</strong> قدر الإمكان
- حاول إنشاء صورة <strong>صغيرة</strong> قدر الإمكان

الصور الأصغر أكثر أماناً لأن مساحة الهجوم فيها أقل، كما تنتقل أسرع في خطوط أنابيب النشر.

لدى Snyk قائمة رائعة بأفضل 10 ممارسات لوضع تطبيقات Node/Express في حاويات. اقرأها من <a href="https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/" target="_blank" rel="noreferrer noopener">هنا</a>.

لا تزال هناك مشكلة مهمة هي أن التطبيق يعمل بصلاحيات root بدلاً من مستخدم أقل امتيازاً. لنُجرِ تغييراً أخيراً على ملف Dockerfile ونستخدم تعليمة <a href="https://docs.docker.com/reference/dockerfile/#user" data-type="link" data-id="https://docs.docker.com/reference/dockerfile/#user">USER</a> لتعيين المستخدم إلى غير root.

```
FROM node:24

WORKDIR /usr/src/app

COPY --chown=node:node . . // HIGHLIGHT LINE

RUN npm ci

ENV DEBUG=playground:*

USER node // HIGHLIGHT LINE

CMD ["npm", "start"]
```

<div class="tasks">

**5. وضع تطبيق Node في حاوية**

</div>

### استخدام Docker compose

في القسم السابق، أنشأنا خادم Express مع علمنا بأنه سيعمل على المنفذ 3123، واستخدمنا الأمرين <code>docker build -t express-server . &amp;&amp; docker run -p 3123:3000 express-server</code> لتشغيله. يبدو هذا بالفعل كشيء ستحتاج إلى وضعه في سكربت لتتذكره. لحسن الحظ، يقدم لنا Docker حلاً أفضل.

<a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer noopener">Docker compose</a>&nbsp;أداة رائعة أخرى يمكنها مساعدتنا في إدارة الحاويات. لنبدأ باستخدام compose بينما نتعلم المزيد عن الحاويات لأنه سيوفر علينا بعض الوقت في التهيئة.

يمكننا الآن تحويل التعويذة السابقة إلى ملف yaml. وأفضل ما في ملفات yaml هو أنه يمكنك حفظها في مستودع Git!

سننشئ الآن ملف <em>docker-compose.yml</em> ونضعه في جذر المشروع بجانب ملف Dockerfile. هذه المرة، سنستخدم المنفذ نفسه للمضيف والحاوية. محتوى الملف هو:

```
services:
  app:                    # اسم الخدمة، يمكن أن يكون أي شيء
    image: express-server # يحدد الصورة التي سيتم استخدامها
    build: .              # يحدد مكان البناء إذا لم توجد الصورة
    ports:                # يحدد المنافذ التي سيتم نشرها
      - 3000:3000
```

شُرح معنى كل سطر في تعليق. وإذا أردت رؤية المواصفات الكاملة فراجع <a href="https://docs.docker.com/compose/compose-file/" target="_blank" rel="noreferrer noopener">التوثيق</a>.

يمكننا الآن استخدام <code>docker compose up</code> لبناء التطبيق وتشغيله. وإذا أردنا إعادة بناء الصور، يمكننا استخدام <code>docker compose up --build</code>.

يمكنك أيضاً تشغيل التطبيق في الخلفية باستخدام <code>docker compose up -d</code> (حيث <code>-d</code> تعني منفصل) وإغلاقه باستخدام <code>docker compose down</code>.

> <em>لاحظ أن بعض إصدارات Docker الأقدم (خاصة في Windows) لا تدعم الأمر docker compose. ومن طرق التحايل على هذه المشكلة <a href="https://docs.docker.com/compose/install/" target="_blank" rel="noreferrer noopener">تثبيت</a> الأمر المستقل docker-compose الذي يعمل بشكل مشابه في الغالب لـdocker compose. لكن الإصلاح الأفضل هو تحديث Docker إلى إصدار أحدث.</em>

غالباً ما تكون ممارسة رائعة إنشاء ملفات مثل <em>docker-compose.yml</em> <em>تُصرّح</em> بما تريده بدلاً من ملفات سكربت تحتاج إلى تشغيلها بترتيب معين أو عدد معين من المرات.

<div class="tasks">

**6. Docker compose**

</div>

### الاستفادة من الحاويات أثناء التطوير

عند تطوير البرمجيات، يمكن استخدام الحاويات بطرق متنوعة لتحسين جودة حياتك. فباستخدام الحاويات، يمكنك تجنب تهيئة الأدوات عدة مرات، وفي كثير من الحالات يمكنك تخطي تثبيتها على جهازك المضيف تماماً.

يمكنك حتى وضع بيئة التطوير بأكملها في حاوية إذا أردت السير في هذا الاتجاه، وسنعود إلى هذه الفكرة لاحقاً. لكننا الآن سنركّز على تشغيل تطبيق Node <em>داخل</em> حاوية مع إبقاء بقية سير عملك على المضيف.

التطبيق الذي قابلناه في التمارين السابقة يستخدم MongoDB. لنستكشف <a href="https://hub.docker.com/" target="_blank" rel="noreferrer noopener">Docker Hub</a>&nbsp;للعثور على صورة MongoDB. Docker Hub هو المكان الافتراضي الذي يسحب منه Docker الصور، ويمكنك استخدام سجلات أخرى أيضاً، لكن بما أننا غرقنا حتى الرُّكب في Docker فهو خيار جيد. ببحث سريع، يمكننا العثور على&nbsp;<a href="https://hub.docker.com/_/mongo" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/mongo</a>

أنشئ ملف yaml جديداً باسم&nbsp;<em>todo-app/todo-backend/docker-compose.dev.yml</em>&nbsp;يبدو كما يلي:

```
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

شُرح معنى أول متغيري بيئة معرّفين أعلاه في صفحة Docker Hub:

> <em>هذان المتغيران، عند استخدامهما معاً، ينشئان مستخدماً جديداً ويعينان كلمة مروره. يُنشأ هذا المستخدم في قاعدة بيانات مصادقة المدير ويُمنح دور root، وهو دور «المستخدم الخارق».</em>

متغير البيئة الأخير&nbsp;<em>MONGO_INITDB_DATABASE</em>&nbsp;سيخبر MongoDB بإنشاء قاعدة بيانات بهذا الاسم.

يمكنك استخدام العلامة <code>-f</code> لتحديد <em>ملف</em> لتشغيل أمر Docker Compose، وعلينا استخدام العلامة الآن لأن لدينا أكثر من ملف compose. لنشغّل الآن MongoDB:

```bash
docker compose -f docker-compose.dev.yml up -d
```

كما ذُكر سابقاً، <strong>لا</strong> نريد حالياً تشغيل تطبيق Node داخل حاوية. فالتطوير بينما التطبيق نفسه داخل حاوية يمثل تحدياً. سنستكشف ذلك الخيار لاحقاً في هذا الجزء.

شغّل أولاً الأمر القديم الجيد <code>npm install</code> على جهازك لإعداد تطبيق Node. ثم ابدأ التطبيق بمتغير البيئة المناسب. يمكنك تعديل الشيفرة لتعيينها كقيم افتراضية أو استخدام ملف .env. ولا ضرر في وضع هذه المفاتيح على GitHub لأنها تُستخدم فقط في بيئة التطوير المحلية لديك. سنضعها مع <code>npm run dev</code> لمساعدتك في النسخ واللصق.

```
MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

لن يكون هذا كافياً؛ نحتاج إلى إنشاء مستخدم ليُصرَّح له داخل الحاوية. فالرابط&nbsp;<a href="http://localhost:3000/todos" target="_blank" rel="noreferrer noopener">http://localhost:3000/todos</a>&nbsp;يؤدي إلى خطأ في المصادقة:

```
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
GET /todos 500 10015.695 ms - 519
MongooseError: Operation `todos.find()` buffering timed out after 10000ms
    at Timeout._onTimeout (/Users/mluukkai/opetus/2026-fs/osa12/tehtavat/todo-app/todo-backend/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:131:25)
    at listOnTimeout (node:internal/timers:605:17)
    at process.processTimers (node:internal/timers:541:7)
GET /todos 500 12.396 ms - 1808
MongoServerError: Command find requires authentication
    at Connection.sendCommand (/Users/mluukkai/opetus/2026-fs/osa12/tehtavat/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:320:27)
```

يمكننا استخدام مستخدم المدير الخارق لمصادقة قاعدة البيانات، بحيث يعمل الأمر التالي

```
MONGO_URL=mongodb://root:example@localhost:3456/the_database?authSource=admin npm run dev
```

لكن ليس من الجيد استخدام حساب مستخدم خارق للوصول العادي إلى قاعدة البيانات، لذا سنختار حلاً أكثر أماناً.

### الربط (bind mount) وتهيئة قاعدة البيانات

في توثيق MongoDB على Docker Hub، يوضح قسم <a href="https://hub.docker.com/_/mongo/#initializing-a-fresh-instance">تهيئة نسخة جديدة</a> كيفية تقديم ملفات JavaScript تعمل عند بدء حاوية Mongo. وهذا يتيح لك أتمتة خطوات الإعداد مثل إنشاء المستخدمين أو تهيئة قواعد البيانات.

يحتوي مشروع التمرين على ملف&nbsp;<em>todo-app/todo-backend/mongo/mongo-init.js</em>&nbsp;بمحتوى:

```
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

سيهيّئ هذا الملف قاعدة البيانات بمستخدم وبعض المهام (todos). بعد ذلك، نحتاج إلى إدخاله إلى الحاوية عند بدء التشغيل.

يمكننا إنشاء صورة جديدة FROM mongo ونسخ الملف إليها، أو يمكننا استخدام&nbsp;<a href="https://docs.docker.com/storage/bind-mounts/" target="_blank" rel="noreferrer noopener">ربط bind mount</a>&nbsp;لتثبيت الملف&nbsp;<em>mongo-init.js</em>&nbsp;في الحاوية. لنفعل الخيار الأخير.

الربط (bind mount) هو ربط ملف (أو مجلد) على الجهاز المضيف بملف (أو مجلد) في الحاوية. ويتم الربط بإضافة العلامة <code>-v</code> إلى الأمر <code>container run</code>. الصيغة هي <code>-v FILE-IN-HOST:FILE-IN-CONTAINER</code>.

بما أننا تعلمنا بالفعل عن Docker Compose فلنتخطَّ ذلك. يُصرَّح عن الربط تحت المفتاح <em>volumes</em> في ملف docker-compose.dev.yml. وبخلاف ذلك، الصيغة نفسها: المضيف أولاً ثم الحاوية:

```
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:       // HIGHLIGHT LINE
    - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js // HIGHLIGHT LINE
```

نتيجة الربط هي أن الملف&nbsp;<em>mongo-init.js</em>&nbsp;في مجلد mongo على الجهاز المضيف هو نفسه الملف&nbsp;<em>mongo-init.js</em>&nbsp;في مجلد /docker-entrypoint-initdb.d داخل الحاوية. وأي تغييرات في أحد الملفين ستكون متاحة في الآخر. ولا نحتاج إلى إجراء أي تغييرات أثناء وقت التشغيل. لكن هذا سيكون مفتاح تطوير البرمجيات في الحاويات.

شغّل <code>docker compose -f docker-compose.dev.yml down --volumes</code> للتأكد من عدم بقاء أي شيء، وابدأ من صفحة بيضاء باستخدام <code>docker compose -f docker-compose.dev.yml up</code> لتهيئة قاعدة البيانات.

إذا ظهر لك خطأ كهذا:

```
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

فقد تكون لديك مشكلة في صلاحية القراءة. وهذه ليست غير شائعة عند التعامل مع وحدات التخزين (volumes). في الحالة أعلاه، يمكنك استخدام <code>chmod a+r mongo-init.js</code> الذي سيمنح الجميع صلاحية قراءة ذلك الملف. كن حذراً عند استخدام <em>chmod</em> لأن منح مزيد من الامتيازات قد يمثل مشكلة أمنية. استخدم <em>chmod</em> فقط على ملف mongo-init.js على جهازك.

الآن ينبغي أن يعمل تشغيل تطبيق Express مع متغير البيئة الصحيح:

```
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

لنتحقق من أن&nbsp;<a href="http://localhost:3000/todos" target="_blank" rel="noreferrer noopener">http://localhost:3000/todos</a>&nbsp;يعيد المهمتين (todos) اللتين أدخلناهما في التهيئة. يمكننا، بل <em>ينبغي</em>، استخدام Postman لاختبار الوظائف الأساسية للتطبيق، مثل إضافة مهمة أو حذفها.

### ما زالت هناك مشكلات؟

لسبب ما، سببت تهيئة Mongo مشكلات لكثيرين.

إذا لم يعمل التطبيق وما زلت تنتهي بالخطأ التالي:

```
/Users/mluukkai/dev/fs-ci/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272
          callback(new MongoError(document));
                   ^
MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/dev/fs-ci/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272:20)
```

شغّل هذه الأوامر:

```bash
docker compose -f docker-compose.dev.yml down --volumes
docker image rm mongo
```

بعد ذلك، حاول تشغيل Mongo مرة أخرى.

إذا استمرت المشكلة، فلنتخلَّ عن فكرة وحدة التخزين (volume) تماماً وننسخ سكربت التهيئة إلى صورة مخصصة. أنشئ ملف <em>Dockerfile</em>&nbsp;التالي في المجلد&nbsp;<em>todo-app/todo-backend/mongo</em>:

```
FROM mongo

COPY ./mongo-init.js /docker-entrypoint-initdb.d/
```

ابنِه إلى صورة بالأمر:

```bash
docker build -t initialized-mongo .
```

الآن غيّر ملف&nbsp;<em>docker-compose.dev.yml</em>&nbsp;ليستخدم الصورة الجديدة:

```
  mongo:
    image: initialized-mongo  // HIGHLIGHT LINE
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

الآن ينبغي أن يعمل التطبيق أخيراً.

### حفظ البيانات بشكل دائم باستخدام وحدات التخزين

افتراضياً، لن تحافظ حاويات قواعد البيانات على بياناتنا. وعند إغلاق حاوية قاعدة البيانات قد تتمكن أو <em>قد لا تتمكن</em> من استعادة البيانات.

> في الواقع، Mongo حالة نادرة حيث تحافظ الحاوية فعلاً على البيانات. ويحدث هذا لأن المطورين الذين صنعوا صورة Docker لـMongo عرّفوا وحدة تخزين (volume) لاستخدامها. <a href="https://github.com/docker-library/mongo/blob/master/8.0/Dockerfile#L111" target="_blank" rel="noreferrer noopener">هذا السطر</a> في ملف Dockerfile سيرشد Docker إلى الحفاظ على البيانات في وحدة تخزين.

هناك طريقتان مختلفتان لتخزين البيانات:
- تحديد موقع في نظام ملفاتك (يُسمى&nbsp;<a href="https://docs.docker.com/storage/bind-mounts/" target="_blank" rel="noreferrer noopener">ربط bind mount</a>)
- ترك Docker يقرر مكان تخزين البيانات (<a href="https://docs.docker.com/storage/volumes/" target="_blank" rel="noreferrer noopener">وحدة تخزين volume</a>)

الخيار الأول مفضل في معظم الحالات كلما احتاج المرء <em>حقاً</em>&nbsp;إلى تجنب حذف البيانات.

لنرَ كليهما عملياً مع Docker compose. لنبدأ بـ<em>الربط bind mount:</em>

```
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db // HIGHLIGHT LINE
```

سينشئ ما سبق مجلداً باسم&nbsp;<em>mongo_data</em>&nbsp;في نظام ملفاتك المحلي ويربطه في الحاوية باسم&nbsp;<em>/data/db</em>. وهذا يعني أن البيانات في&nbsp;<em>/data/db</em>&nbsp;تُخزَّن خارج الحاوية لكنها تبقى متاحة للحاوية! فقط تذكر إضافة المجلد إلى .gitignore.

يمكن تحقيق نتيجة مشابهة باستخدام&nbsp;<em>وحدة تخزين مسماة:</em>

```
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db // HIGHLIGHT LINE

volumes:   // HIGHLIGHT LINE
  mongo_data: // HIGHLIGHT LINE
```

الآن أُنشئت وحدة التخزين وتديرها Docker. بعد تشغيل التطبيق (<code>docker compose -f docker-compose.dev.yml up</code>) يمكنك سرد وحدات التخزين باستخدام <code>docker volume ls</code>، وفحص إحداها باستخدام <code>docker volume inspect</code>، وحتى حذفها باستخدام <code>docker volume rm</code>:

```
$ docker volume ls
DRIVER    VOLUME NAME
local     todo-backend_mongo_data
$ docker volume inspect todo-backend_mongo_data
[
    {
        "CreatedAt": "2026-03-01T11:48:30Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.config-hash": "04a085ca56ca9326ae3e24058b0dc2a710003ba3ca583a2e333b4d6c491cfb94",
            "com.docker.compose.project": "todo-backend",
            "com.docker.compose.version": "2.33.1",
            "com.docker.compose.volume": "mongo_data"
        },
        "Mountpoint": "/var/lib/docker/volumes/todo-backend_mongo_data/_data",
        "Name": "todo-backend_mongo_data",
        "Options": null,
        "Scope": "local"
    }
]
```

لا تزال وحدة التخزين المسماة مخزنة في نظام ملفاتك المحلي، لكن معرفة <em>مكان</em> تخزينها قد لا يكون بهذه السهولة كما في الخيار السابق.

<div class="tasks">

**7. قليل من البرمجة بـMongoDB**

</div>

### تصحيح المشكلات في الحاويات

> <em>عند البرمجة، من المرجح أن تنتهي في حالة يكون فيها كل شيء معطلاً.</em>
>
> - Matti Luukkainen

عند التطوير باستخدام الحاويات، نحتاج إلى تعلم أدوات جديدة لتصحيح الأخطاء، إذ لا يمكننا ببساطة «console.log» كل شيء. وعندما تحتوي الشيفرة على خطأ، غالباً ما تكون في حالة يعمل فيها شيء ما على الأقل، فتستطيع التقدم انطلاقاً من ذلك. أما التهيئة فغالباً ما تكون في إحدى حالتين: 1. تعمل أو 2. معطلة. سنستعرض بعض الأدوات التي يمكنها المساعدة عندما يكون تطبيقك في الحالة الثانية.

عند تطوير البرمجيات، يمكنك التقدم بأمان خطوة بخطوة، متحققاً طوال الوقت من أن ما كتبته يتصرف كما هو متوقع. لكن هذا غالباً لا ينطبق على التهيئة. فالتهيئة التي قد تكتبها يمكن أن تكون معطلة حتى اللحظة التي تكتمل فيها. لذا عندما تكتب ملف docker-compose.yml أو Dockerfile طويلاً ولا يعمل، عليك أن تتوقف لحظة وتفكر في الطرق المختلفة التي يمكنك بها التأكد من أن شيئاً ما يعمل.

<em>شكّك في كل شيء</em>&nbsp;لا يزال قابلاً للتطبيق هنا. وكما قيل في&nbsp;<a href="/part3/saving_data_to_mongo_db" target="_blank" rel="noreferrer noopener">الجزء 3</a>: المفتاح هو أن تكون منهجياً. وبما أن المشكلة قد توجد في أي مكان،&nbsp;<em>فعليك أن تشكّ في كل شيء</em>، وتستبعد كل مصادر الخطأ المحتملة واحداً تلو الآخر.

بالنسبة لي، أثمن طريقة لتصحيح الأخطاء هي التوقف والتفكير في ما أحاول إنجازه بدلاً من مجرد خبط رأسي في المشكلة. فغالباً ما يوجد حل بديل بسيط أو بحث سريع على Google يدفعني إلى الأمام.

#### exec

أمر Docker&nbsp;<a href="https://docs.docker.com/engine/reference/commandline/exec/" target="_blank" rel="noreferrer noopener">exec</a>&nbsp;سلاح قوي. ويمكن استخدامه للقفز مباشرة إلى الحاوية عندما تكون قيد التشغيل.

لنبدأ خادم ويب في الخلفية ونقم بقليل من التصحيح لنجعله يعمل ويعرض الرسالة «Hello, exec!» في متصفحنا. لنختر&nbsp;<a href="https://www.nginx.com/" target="_blank" rel="noreferrer noopener">Nginx</a>&nbsp;وهو، بين أمور أخرى، خادم قادر على تقديم ملفات HTML الثابتة. وله ملف index.html افتراضي يمكننا استبداله.

```
$ docker container run -d nginx
```

حسناً، الأسئلة الآن هي:
- إلى أين نذهب بمتصفحنا؟
- هل هو حتى قيد التشغيل؟

نعرف كيف نجيب عن السؤال الأخير: بسرد الحاويات قيد التشغيل.

```
$ docker container ls
CONTAINER ID   IMAGE   COMMAND  CREATED     STATUS    PORTS     NAMES
3f831a57b7cc   nginx   ...      3 sec ago   Up 2 sec  80/tcp    keen_darwin
```

أجل! لقد أجبنا عن السؤال الأول أيضاً. يبدو أنه يستمع على المنفذ 80، كما يظهر في المخرجات أعلاه.

لنوقفه ونعيد تشغيله بالعلامة <code>-p</code> ليتسنى لمتصفحنا الوصول إليه.

```
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

> <em><strong>ملاحظة المحرر:</strong> أثناء التطوير، من <strong>الضروري</strong> متابعة سجلات الحاوية باستمرار. أنا عادةً لا أشغّل الحاويات في الوضع المنفصل (أي مع <code>-d</code>) لأنه يتطلب جهداً إضافياً بسيطاً لفتح السجلات.</em>
>
> <em>عندما أكون متأكداً 100% أن كل شيء يعمل... لا، عندما أكون متأكداً 200%، حينها قد أسترخي قليلاً وأشغّل الحاويات في الوضع المنفصل. إلى أن ينهار كل شيء مرة أخرى ويحين وقت فتح السجلات من جديد.</em>

لننظر إلى التطبيق بالانتقال إلى <a href="http://localhost:8080/" target="_blank" rel="noreferrer noopener">http://localhost:8080</a>. يبدو أنه يعرض رسالة خاطئة! لنقفز مباشرة إلى الحاوية ونصلح هذا. أبقِ متصفحك مفتوحاً، فلن نحتاج إلى إيقاف الحاوية لإجراء هذا الإصلاح. سننفّذ bash داخل الحاوية، والعلامتان <code>-it</code> تضمنان أننا نستطيع التفاعل مع الحاوية:

```
$ docker container ls
CONTAINER ID   IMAGE     COMMAND  PORTS                  NAMES
7edcb36aff08   nginx     ...      0.0.0.0:8080-&gt;80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

بعد أن دخلنا، نحتاج إلى إيجاد الملف المعطوب واستبداله. يخبرنا بحث سريع على Google أن الملف نفسه هو&nbsp;<em>/usr/share/nginx/html/index.html</em>.

لننتقل إلى المجلد ونحذف الملف

```
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

الآن، إذا ذهبنا إلى&nbsp;<a href="http://localhost:8080/" target="_blank" rel="noreferrer noopener">http://localhost:8080/</a>&nbsp;نعرف أننا حذفنا الملف الصحيح. تعرض الصفحة 404. لنستبدله بملف يحتوي على المحتوى الصحيح:

```
root@7edcb36aff08:/# echo "Hello, exec!" &gt; index.html
```

حدّث الصفحة، وستُعرض رسالتنا! الآن نعرف كيف يمكن استخدام exec للتفاعل مع الحاويات. تذكر أن كل التغييرات تُفقد عند حذف الحاوية. وللحفاظ على التغييرات، عليك استخدام&nbsp;<code>commit</code >&nbsp;تماماً كما فعلنا في&nbsp;<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-containers/chapter-2" target="_blank" rel="noreferrer noopener">القسم السابق</a>.

<div class="tasks">

**8. Mongo CLI**

</div>

### Redis

<a href="https://redis.io/" target="_blank" rel="noreferrer noopener">Redis</a> هو مخزن <a href="https://redis.com/nosql/key-value-databases/" target="_blank" rel="noreferrer noopener">مفتاح-قيمة (key-value)</a>، أي أنه يخزّن البيانات كأزواج بسيطة: <strong>مفتاح</strong> و<strong>القيمة</strong> المرتبطة به. وخلافاً لقواعد البيانات الموجّهة بالمستندات مثل MongoDB، لا ينظّم Redis البيانات في مجموعات أو جداول. بل يحتفظ بقطع بيانات فردية تسترجعها مباشرةً بالإشارة إلى مفاتيحها.

افتراضياً، يعمل Redis <em>في الذاكرة (in-memory)</em>، ما يعني أنه لا يخزّن البيانات بشكل دائم.

من حالات الاستخدام الممتازة لـRedis استخدامه كذاكرة مؤقتة (cache). فغالباً ما تُستخدم الذاكرات المؤقتة لتخزين بيانات يكون جلبها بطيئاً بخلاف ذلك، وحفظها حتى تصبح غير صالحة. وبعد أن تصبح الذاكرة المؤقتة غير صالحة، تجلب البيانات مرة أخرى وتخزّنها في الذاكرة المؤقتة.

لا علاقة لـRedis بالحاويات. لكن بما أننا قادرون بالفعل على إضافة&nbsp;<em>أي</em>&nbsp;خدمة طرف ثالث إلى تطبيقاتك، فلمَ لا نتعرف على خدمة جديدة؟

<div class="tasks">

**9. إعداد Redis للمشروع**

</div>

<div class="tasks">

**10. استعد للانطلاق!**

</div>

<div class="tasks">

**11. Redis CLI**

</div>

### حفظ بيانات Redis بشكل دائم

ذُكر في القسم السابق أن Redis <em>افتراضياً</em>&nbsp;لا يحفظ البيانات بشكل دائم. لكن تفعيل الحفظ الدائم سهل. نحتاج فقط إلى تشغيل Redis بأمر مختلف، كما هو موضح في&nbsp;<a href="https://hub.docker.com/_/redis" target="_blank" rel="noreferrer noopener">صفحة Docker Hub</a>:

```
services:
  redis:
    # كل ما تبقى
    command: ['redis-server', '--appendonly', 'yes'] # الكتابة فوق CMD
    volumes: # التصريح عن وحدة التخزين
      - ./redis_data:/data
```

ستُحفظ البيانات الآن بشكل دائم في المجلد&nbsp;<em>redis_data</em>&nbsp;على الجهاز المضيف. تذكر إضافة المجلد إلى .gitignore!

#### وظائف أخرى لـRedis

بالإضافة إلى عمليات GET وSET وDEL على المفاتيح والقيم، يمكن لـRedis فعل الكثير أيضاً. فيمكنه مثلاً إنهاء صلاحية المفاتيح تلقائياً، وهي ميزة مفيدة جداً عند استخدام Redis كذاكرة مؤقتة.

يمكن أيضاً استخدام Redis لتنفيذ ما يُسمى نمط&nbsp;<a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank" rel="noreferrer noopener">النشر-الاشتراك (publish-subscribe)</a>&nbsp;(أو PubSub) وهو آلية اتصال غير متزامنة للبرمجيات الموزعة. في هذا السيناريو، يعمل Redis كـ<em>وسيط رسائل</em>&nbsp;بين خدمتين أو أكثر. بعض الخدمات <em>تنشر</em>&nbsp;رسائل بإرسالها إلى Redis، والذي يخبر عند وصول رسالة الأطراف التي <em>اشتركت</em>&nbsp;في تلك الرسائل.

<div class="tasks">

**12. حفظ البيانات بشكل دائم في Redis**

</div>
