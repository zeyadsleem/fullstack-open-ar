---
part: 12
letter: b
title: "الفصل الثاني: مقدمة إلى الحاويات"
mainImage: /images/part-12.svg
lang: ar
---
تمتدّ تطوير البرمجيات على دورة الحياة بأكملها — من تصوّر الحل وتصميمه، إلى تنفيذه وإطلاقه للمستخدمين وصيانته مع مرور الوقت. سيقدّم هذا الجزء الحاويات، وهي أداة حديثة تُستخدم في المراحل الأخيرة من دورة حياة البرمجيات.

تُغلّف الحاويات تطبيقك في حزمة واحدة. وستضم هذه الحزمة التطبيق وجميع اعتمادياته. ونتيجة لذلك، يمكن تشغيل كل حاوية بمعزل عن الحاويات الأخرى.

تعزل الحاويات التطبيقات عن النظام المضيف، وتحدّ افتراضياً من وصولها إلى الملفات وموارد النظام. ويمكن للمطوّرين منح الوصول صراحةً (على سبيل المثال، تركيب أدلة محددة أو كشف أجهزة)، وتحديد حدود للموارد مثل المعالج والذاكرة والشبكة والتخزين. ويحسّن هذا العزل المتحكَّم فيه الأمان وقابلية إعادة الإنتاج وقابلية النقل بين البيئات.

وبشكل أكثر تحديداً، الحاويات شكل من أشكال المحاكاة الافتراضية على مستوى نظام التشغيل. وأقرب مقارنة لها هي الآلة الافتراضية (VM): تتيح لك الآلات الافتراضية تشغيل أنظمة تشغيل متعددة على مضيف فيزيائي واحد، ولكل منها حزمة نظام تشغيل كاملة خاصة به. في المقابل، تتشارك الحاويات نظام تشغيل المضيف وتشغّل تطبيقك في بيئة معزولة في مساحة المستخدم. ولأن الحاويات لا تُقلع نظام تشغيل منفصلاً، فإن عبئها الإضافي أقل بكثير من الآلات الافتراضية، وتُستخدم عادةً لتشغيل عملية واحدة أو خدمة واحدة بكفاءة.

ولأن الحاويات خفيفة نسبياً، على الأقل مقارنة بالآلات الافتراضية، يمكن توسيعها بسرعة. ولأنها تعزل البرمجيات التي تعمل بداخلها، فإنها تتيح تشغيل هذه البرمجيات بشكل متطابق في أي مكان تقريباً. ولهذا فهي الخيار المفضّل في أي بيئة سحابية أو تطبيق يتجاوز عدد مستخدميه حفنة قليلة.

تدعم الخدمات السحابية مثل AWS وGoogle Cloud وMicrosoft Azure الحاويات بأشكال متعددة ومختلفة. ومنها AWS Fargate وGoogle Cloud Run، وكلاهما يشغّل الحاويات بطريقة serverless — حيث لا تحتاج حاوية التطبيق حتى إلى أن تكون قيد التشغيل إن لم تُستخدم. يمكنك أيضاً تثبيت وقت تشغيل الحاويات (container runtime) على معظم الأجهزة وتشغيل الحاويات عليها بنفسك — بما في ذلك جهازك الخاص.

تستخدم الحاويات على نطاق واسع في البيئات السحابية وفي التطوير المحلي. ما فوائد استخدام الحاويات؟ إليك سيناريوهان شائعان:

<em>السيناريو الأول: أنت تطوّر تطبيقاً جديداً يحتاج إلى العمل على الجهاز نفسه الذي يعمل عليه تطبيق قديم. وكلاهما يتطلب تثبيت إصدارات مختلفة من Node.</em>

يمكنك على الأرجح استخدام nvm أو الآلات الافتراضية أو سحر أسود لتشغيلهما في الوقت نفسه. ومع ذلك، فإن الحاويات حل ممتاز إذ يمكنك تشغيل كلا التطبيقين في حاويتيهما الخاصتين. فهما معزولان عن بعضهما ولا يتعارضان.

<em>السيناريو الثاني: يعمل تطبيقك على جهازك. وتحتاج إلى نقل التطبيق إلى خادم.</em>

ليس نادراً أن لا يعمل التطبيق على الخادم رغم أنه يعمل بشكل جيد على جهازك. وقد يعود السبب إلى اعتمادية مفقودة أو اختلافات أخرى في البيئتين. هنا تكون الحاويات حلاً ممتازاً لأنك تستطيع تشغيل التطبيق في بيئة تنفيذ واحدة على جهازك وعلى الخادم معاً. وهو ليس حلاً مثالياً: فقد تشكّل اختلافات العتاد مشكلة، لكن يمكنك الحدّ من الفروق بين البيئات.

قد تسمع أحياناً عن مشكلة&nbsp;<em>«تعمل في حاويتي»</em>. تصف هذه العبارة حالة يعمل فيها التطبيق بشكل جيد في حاوية تعمل على جهازك لكنه يتعطل عند تشغيل الحاوية على خادم. والعبارة تلاعب بمشكلة&nbsp;<em>«تعمل على جهازي»</em>&nbsp;السيئة السمعة، التي كثيراً ما يُوعَد بأن الحاويات ستحلها. والأرجح أيضاً أن الحالة ناتجة عن خطأ في الاستخدام.

### عن هذا الجزء

في هذا الجزء، لن ينصبّ تركيزنا على شيفرة JavaScript. بل سنُعنى بدلاً من ذلك بتهيئة البيئة التي تُنفَّذ فيها البرمجيات. ونتيجة لذلك، قد لا تتضمن التمارين أي برمجة، فالتطبيقات متاحة لك عبر GitHub وستشمل مهامك تهيئتها. وتُسلَّم التمارين في&nbsp;<em>مستودع GitHub واحد</em>&nbsp;يضم كل الشيفرة المصدرية والتهيئات التي تجريها خلال هذا الجزء.

ستحتاج إلى معرفة أساسية بـ Node وExpress وReact. ولا يُشترط إكمال قبل هذا الجزء سوى الأجزاء الأساسية من 1 إلى 5.

> تحذير
>
> بما أننا نخرج هنا مباشرةً من منطقة راحتنا كمطوّري JavaScript، فقد يتطلب منك هذا الجزء القيام بجولة جانبية للتعرّف على shell / سطر الأوامر / موجه الأوامر / الطرفية قبل البدء.
>
> إذا لم تستخدم يوماً سوى واجهة مستخدم رسومية ولم تلمس مثلاً Linux أو الطرفية على Mac، أو إذا واجهت صعوبة في التمارين الأولى، فنوصي بإكمال الجزء الأول من «Computing tools for CS studies» أولاً: <a href="https://tkt-lapio.github.io/en/" target="_blank" rel="noreferrer noopener">https://tkt-lapio.github.io/en/</a>. تخطَّ قسم «SSH connection» والتمرين 11. وبخلاف ذلك، فهو يتضمن كل ما ستحتاجه للبدء هنا!

<div class="tasks">

**1. استخدام حاسوب (دون واجهة مستخدم رسومية)**

</div>

### أدوات المهنة

تختلف الأدوات الأساسية التي ستحتاجها باختلاف أنظمة التشغيل:
- <a href="https://docs.microsoft.com/en-us/windows/wsl/install-win10" target="_blank" rel="noreferrer noopener">طرفية WSL 2</a> على Windows
- الطرفية على Mac
- سطر الأوامر على Linux

### تثبيت كل ما يتطلبه هذا الجزء

سنبدأ بتثبيت البرمجيات المطلوبة. وستكون خطوة التثبيت إحدى العقبات المحتملة. ولأننا نتعامل مع محاكاة افتراضية على مستوى نظام التشغيل، فستتطلب الأدوات وصولاً بصلاحيات المستخدم الخارق (superuser) على الحاسوب. وسيكون لديها وصول إلى نواة نظام التشغيل لديك.

تم بناء المادة حول&nbsp;<a href="https://www.docker.com/" target="_blank" rel="noreferrer noopener">Docker</a>، وهي مجموعة منتجات سنستخدمها لتغليف الحاويات وإدارتها. وللأسف، إذا لم تستطع تثبيت Docker فمن المحتمل ألا تستطيع إكمال هذا الجزء.

ولأن تعليمات التثبيت تعتمد على نظام التشغيل لديك، سيكون عليك العثور على تعليمات التثبيت الصحيحة من الرابط أدناه. لاحظ أنها قد تتضمن خيارات مختلفة متعددة لنظام تشغيلك.
- <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noreferrer noopener">احصل على Docker</a>

والآن بعد أن انتهى هذا الصداع كما نأمل، لنتأكد من تطابق إصداراتنا. قد تكون أرقام إصدارك أعلى قليلاً من الأرقام هنا:

```
$ docker -v
Docker version 28.0.1, build 068a01e
```

### الحاويات والصور

هناك مفهومان أساسيان في هذا الجزء:&nbsp;<em>الحاوية</em>&nbsp;و&nbsp;<em>الصورة</em>. ومن السهل الخلط بينهما.

<em>الحاوية</em>&nbsp;هي نسخة قيد التشغيل من&nbsp;<em>الصورة</em>.

العبارتان التاليتان صحيحتان:
- تتضمن الصور كل الشيفرة والاعتماديات والتعليمات الخاصة بكيفية تشغيل التطبيق
- تغلّف الحاويات البرمجيات في وحدات موحّدة

ولا عجب أن يسهل الخلط بينهما.

وللمساعدة في تجاوز هذا الالتباس، يستخدم الجميع تقريباً كلمة حاوية للدلالة على كليهما. لكنك لا تستطيع فعلياً بناء حاوية أو تنزيلها أبداً لأن الحاويات لا توجد إلا أثناء التشغيل. أما الصور فهي ملفات&nbsp;<strong>غير قابلة للتغيير</strong>. ونتيجة لهذا الثبات، لا يمكنك تعديل صورة بعد إنشائها. ومع ذلك، يمكنك استخدام صور موجودة لإنشاء&nbsp;<em>صورة جديدة</em>&nbsp;بإضافة طبقات جديدة فوق الطبقات الموجودة.

استعارة من عالم الطبخ:
- الصورة وجبة مسبقة الطهي ومجمّدة.
- الحاوية هي الوجبة اللذيذة.

<a href="https://www.docker.com/" target="_blank" rel="noreferrer noopener">Docker</a> هي تقنية تغليف الحاويات الأكثر شيوعاً، وقد كانت السبّاقة إلى المعايير التي تستخدمها معظم تقنيات تغليف الحاويات اليوم. وعملياً، Docker مجموعة منتجات تساعدنا على إدارة الصور والحاويات. وستتيح لنا هذه المجموعة الاستفادة من كل مزايا الحاويات. فمثلاً، يأخذ <em>محرك Docker</em> صورةً — وهي لقطة غير قابلة للتغيير للقراءة فقط من نظام ملفات (مجموعة ملفات وبيانات وصفية) — ويشغّلها كحاوية.

ولإدارة حاويات Docker، هناك أيضاً أداة تُسمى&nbsp;<a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer noopener">Docker Compose</a>&nbsp;تتيح لك&nbsp;<strong>تنسيق</strong>&nbsp;(التحكم في) حاويات متعددة في الوقت نفسه. وسنستخدم Docker Compose في هذا الجزء لتهيئة بيئة تطوير محلية معقدة. وفي النسخة النهائية من بيئة التطوير التي سنهيئها، لن يعود تثبيت Node على جهازنا مطلوباً حتى.

هناك مفاهيم عدة علينا المرور عليها. لكننا سنتجاوزها الآن ونتعلم Docker أولاً!

لنبدأ بالأمر&nbsp;<em>docker container run</em>&nbsp;الذي يُستخدم لتشغيل الصور داخل حاوية. وبنية الأمر هي التالية:&nbsp;<em>container run&nbsp;IMAGE-NAME</em>&nbsp;حيث نخبر Docker بإنشاء حاوية من صورة. ومن الميزات الرائعة خصوصاً في هذا الأمر أنه يستطيع تشغيل حاوية حتى لو لم تكن الصورة المطلوب تشغيلها منزَّلة بعد على جهازنا.

لنشغّل الأمر

```
$ docker container run hello-world
```

ستكون هناك مخرجات كثيرة، لكن لنقسّمها إلى عدة أقسام يمكننا فكّها معاً. لقد رقّمتُ الأسطر بنفسي ليسهل متابعة الشرح. ولن تحتوي مخرجاتك على هذه الأرقام.

```
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

ولأن الصورة&nbsp;<em>hello-world</em>&nbsp;لم تكن موجودة على جهازنا، نزّلها الأمر أولاً من سجل مجاني يُسمى&nbsp;<a href="https://hub.docker.com/" target="_blank" rel="noreferrer noopener">Docker Hub</a>. يمكنك الاطلاع على صفحة الصورة في Docker Hub عبر متصفحك هنا:&nbsp;<a href="https://hub.docker.com/_/hello-world" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/hello-world</a>

يوضح الجزء الأول من الرسالة أنه لم تكن لدينا بعد الصورة "hello-world:latest". وهذا يكشف بعض التفاصيل عن الصور نفسها؛ فأسماء الصور تتكون من أجزاء متعددة، أشبه ما تكون برابط URL. ويكون اسم الصورة بالصيغة التالية:
- <em>registry/organisation/image:tag</em>

وفي هذه الحالة أخذت الحقول الثلاثة الناقصة القيم الافتراضية:
- <em>index.docker.io/library/hello-world:latest</em>

ويوضح السطر الثاني اسم المنظمة، "library"، التي ستُجلب منها الصورة. وفي رابط Docker Hub، يُختصر "library" إلى _.

يعرض السطران الثالث والخامس الحالة فقط. لكن السطر الرابع قد يكون مثيراً للاهتمام: فلكل صورة بصمة (digest) فريدة مبنية على&nbsp;<em>الطبقات</em>&nbsp;التي تُبنى منها الصورة. وعملياً، تُنشئ كل خطوة أو أمر استُخدم في بناء الصورة طبقة فريدة. وتستخدم Docker البصمة للتأكد من أن الصورة هي نفسها. ويحدث ذلك عندما تحاول سحب الصورة نفسها مرة أخرى.

إذن كانت نتيجة استخدام الأمر سحباً ثم إخراج معلومات عن&nbsp;<strong>الصورة</strong>. وبعد ذلك، أخبرتنا الحالة بأن نسخة جديدة من&nbsp;<em>hello-world:latest</em>&nbsp;قد نُزّلت فعلاً. يمكنك تجربة سحب الصورة بالأمر&nbsp;<em>docker image pull hello-world</em>&nbsp;ومشاهدة ما يحدث.

كانت المخرجات التالية من الحاوية نفسها. وهي تشرح أيضاً ما حدث عندما شغّلنا&nbsp;<em>docker container run hello-world</em>.

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker container run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

تحتوي المخرجات على بعض الأمور الجديدة التي علينا تعلمها.&nbsp;<em>Docker daemon</em>&nbsp;خدمة تعمل في الخلفية وتتأكد من أن الحاويات تعمل، ونستخدم&nbsp;<em>عميل Docker (Docker client)</em>&nbsp;للتفاعل مع البرنامج الخفي (daemon). لقد تفاعلنا الآن مع الصورة الأولى وأنشأنا حاوية من الصورة. وأثناء تنفيذ تلك الحاوية، تلقينا المخرجات.

<div class="tasks">

**2. تشغيل حاويتك الثانية**

</div>

### صورة Ubuntu

يحتوي الأمر الذي استخدمته للتو لتشغيل حاوية Ubuntu، <code>docker container run -it ubuntu bash</code>، على بعض الإضافات مقارنةً بأمر hello-world السابق. لنطّلع على <code>--help</code> لفهم أفضل. وسأقتطع بعض المخرجات لنركّز على الأجزاء ذات الصلة.

```
$ docker container run --help

Usage:  docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
Run a command in a new container

Options:
  ...
  -i, --interactive                    Keep STDIN open even if not attached
  -t, --tty                            Allocate a pseudo-TTY
  ...
```

الخياران، أو العَلَمان، <code>-it</code> يضمنان أننا نستطيع التفاعل مع الحاوية. وبعد الخيارات، حدّدنا أن الصورة المطلوب تشغيلها هي ubuntu. ثم لدينا الأمر <em>bash</em> الذي سيُنفَّذ داخل الحاوية عند تشغيلها.

يمكنك تجربة أوامر أخرى قد تستطيع صورة Ubuntu تنفيذها. وكمثال، جرّب <code>docker container run --rm ubuntu ls -la</code>. سيسرد الأمر ls -la جميع الملفات في الدليل الافتراضي (الذي يصادف أنه الجذر /)، وسيزيل العَلَم <code><em>--</em>rm</code> الحاوية بعد التنفيذ. وبشكل طبيعي، لا تُحذف الحاويات تلقائياً.

لنكمل مع حاوية Ubuntu الأولى التي تحتوي على ملف <strong>index.js</strong>. لقد توقفت الحاوية عن العمل منذ خروجنا منها. يمكننا سرد جميع الحاويات بالأمر <code>container ls -a,</code> حيث سيسرد <em>-a</em> (أو --all) الحاويات التي خرجت بالفعل.

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

> <em>ملاحظة المحرر: للأمر&nbsp;docker container ls&nbsp;صيغة أقصر هي&nbsp;docker ps</em>، وأنا أفضل الأقصر.

لدينا خياران عند مخاطبة حاوية. فالمعرّف في العمود الأول يمكن استخدامه للتفاعل مع الحاوية في معظم الأحيان. إضافةً إلى ذلك، تقبل معظم الأوامر اسم الحاوية كطريقة أكثر ودّاً للتعامل معها. وقد وُلّد اسم الحاوية تلقائياً فكان&nbsp;<strong>"hopeful_clarke"</strong>&nbsp;في حالتي.

لقد خرجت الحاوية بالفعل، ومع ذلك يمكننا تشغيلها مجدداً بأمر start الذي يقبل معرّف الحاوية أو اسمها كمعامل: <code>start CONTAINER-ID-OR-CONTAINER-NAME</code>.

```
$ docker start hopeful_clarke
hopeful_clarke
```

سيشغّل أمر start الحاوية نفسها التي كانت لدينا سابقاً. وللأسف، نسينا تشغيلها بالعَلَم <code>--interactive</code> (الذي يمكن كتابته أيضاً <code>-i</code>) لذا لا يمكننا التفاعل معها.

الحاوية في الواقع قيد التشغيل كما يوضح الأمر <code>container ls -a</code>، لكننا لا نستطيع التواصل معها فحسب:

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

لاحظ أنه يمكننا أيضاً تنفيذ الأمر دون العَلَم <code>-a</code> لرؤية الحاويات التي تعمل فقط:

```
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke
```

لنقتلها بأمر <code>kill CONTAINER-ID-OR-CONTAINER-NAME</code> ونحاول مرة أخرى.

```
$ docker kill hopeful_clarke
hopeful_clarke
```

يرسل <code>docker kill</code> إشارة SIGKILL إلى العملية، مجبراً إياها على الخروج، وذلك يوقف الحاوية. ويمكننا التحقق من حالتها بالأمر <code>container ls -a</code>:

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

لنبدأ الحاوية الآن مرة أخرى، لكن هذه المرة في الوضع التفاعلي:

```
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

لنحرّر الملف&nbsp;<em>index.js</em>&nbsp;ونضف إليه بعض شيفرة JavaScript لتنفيذها. ينقصنا فقط أدوات تحرير الملف.&nbsp;<a href="https://www.nano-editor.org/" target="_blank" rel="noreferrer noopener">Nano</a>&nbsp;سيكون محرر نصوص جيداً في الوقت الحالي. وقد وُجدت تعليمات التثبيت من أول نتيجة في Google. وسنستغني عن استخدام sudo لأننا بالفعل root.

```
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

الآن أصبح Nano مثبتاً ويمكننا البدء في تحرير الملفات!

<div class="tasks">

**3. Ubuntu 101**

</div>

<div class="tasks">

**4. Ubuntu 102**

</div>

### أوامر Docker أخرى

الآن بعد أن أصبح Node مثبتاً في الحاوية، يمكننا تنفيذ JavaScript داخل الحاوية! لننشئ صورة جديدة من الحاوية. الأمر

```
commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME
```

سينشئ صورة جديدة تتضمن التغييرات التي أجريناها. ويمكنك استخدام <code>container diff</code> للتحقق من التغييرات بين الصورة الأصلية والحاوية قبل فعل ذلك.

```
$ docker commit hopeful_clarke hello-node-world
```

يمكنك سرد صورك بالأمر <code>image ls</code>:

```
$ docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
```

يمكنك الآن تشغيل الصورة الجديدة كما يلي:

```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

هناك طرق متعددة لفعل الشيء نفسه. لنجرّب حلاً أفضل. سنبدأ من صفحة بيضاء باستخدام <code>container rm</code> لإزالة الحاوية القديمة.

```
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

أنشئ ملفاً باسم&nbsp;<em>index.js</em>&nbsp;في دليلك الحالي واكتب داخله&nbsp;<em>console.log('Hello, World')</em>. لا حاجة إلى الحاويات بعد.

بعد ذلك، لنتخطَّ تثبيت Node كلياً. فهناك الكثير من صور Docker المفيدة في Docker Hub الجاهزة لاستخدامنا. لنستخدم الصورة&nbsp;<a href="https://hub.docker.com/_/node" target="_blank" rel="noreferrer noopener">https://hub.docker.com/_/node</a>&nbsp;التي تحتوي على Node مثبتاً بالفعل. كل ما علينا فعله هو اختيار إصدار.

بالمناسبة، يقبل <code>container run</code> العَلَم <code>--name</code> الذي يمكننا استخدامه لإعطاء اسم للحاوية.

```
$ docker container run -it --name hello-node node:24 bash
```

لننشئ دليلاً للشيفرة داخل الحاوية:

```
root@77d1023af893:/# mkdir /usr/src/app
```

وبينما نحن داخل الحاوية في هذه الطرفية، افتح طرفية أخرى واستخدم الأمر <code>container cp</code> لنسخ الملف من جهازك إلى الحاوية:

```
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

والآن يمكننا تشغيل <code>node /usr/src/app/index.js</code> داخل الحاوية. يمكننا عمل commit لهذا كصورة جديدة أخرى، لكن هناك حل أفضل من ذلك. سيكون القسم التالي كله عن بناء صورك كالمحترفين.

ستجد المزيد عن أوامر Docker في التوثيق <a href="https://docs.docker.com/">https://docs.docker.com/</a> ولاحظ أيضاً <em>Docker Cheat Sheet</em> الرائع في https://docker.how/ الذي يحتوي على الكثير من المعلومات في صيغة مضغوطة أنيقة.
