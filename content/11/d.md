---
part: 11
letter: d
title: "النشر"
mainImage: /images/part-11.svg
lang: ar
---
بعد أن كتبنا تطبيقاً جميلاً، حان الوقت للتفكير في كيفية نشره لاستخدام المستخدمين الحقيقيين.

في&nbsp;<a href="/part3/deploying_app_to_internet" target="_blank" rel="noreferrer noopener">الجزء 3</a>&nbsp;من هذه الدورة، فعلنا ذلك بمجرد تشغيل أمر واحد من الطرفية لرفع الشيفرة وتشغيلها على خوادم مزوّد الخدمات السحابية&nbsp;<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a>&nbsp;أو&nbsp;<a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>.

إن إصدار البرمجيات في Fly.io وRender بسيط جداً، على الأقل مقارنةً بالكثير من أنواع إعدادات الاستضافة الأخرى، لكنه لا يزال ينطوي على مخاطر: فلا شيء يمنعنا من نشر شيفرة معطوبة إلى بيئة الإنتاج عن غير قصد.

بعد ذلك، سنتناول مبادئ إجراء النشر بأمان وبعض مبادئ نشر البرمجيات على النطاقين الصغير والكبير.

### كل ما يمكن أن يسوء...

نودّ أن نضع بعض القواعد حول كيفية عمل عملية النشر لدينا، لكن قبل ذلك علينا أن ننظر في بعض قيود الواقع.

تقول إحدى صيغ قانون مورفي: «كل ما يمكن أن يسوء سيسوء».

من المهم تذكّر ذلك عندما نخطط نظام النشر لدينا. ومن الأمور التي سنحتاج إلى أخذها في الحسبان:
- ماذا لو تعطّل حاسوبي أو تجمّد أثناء النشر؟
- أنا متصل بالخادم وأنشر عبر الإنترنت، ماذا يحدث إذا انقطع اتصالي بالإنترنت؟
- ماذا يحدث إذا فشل أي أمر معيّن في نص أو نظام النشر لدي؟
- ماذا يحدث إذا لم تعمل برمجيتي كما هو متوقع، لأي سبب كان، على الخادم الذي أنشر عليه؟ هل يمكنني التراجع إلى إصدار سابق؟
- ماذا يحدث إذا أرسل مستخدم طلب HTTP إلى برمجيتنا قبل النشر مباشرة (ولم يكن لدينا وقت لإرسال استجابة للمستخدم)؟

هذه مجرد مجموعة صغيرة مما يمكن أن يسوء أثناء النشر، أو بالأحرى أمور ينبغي أن نخطط لها. وبغض النظر عما يحدث، يجب أن&nbsp;<strong>لا يترك أبداً</strong>&nbsp;نظام النشر لدينا برمجيتنا في حالة معطوبة. كما ينبغي أن نعرف دائماً (أو نكون قادرين بسهولة على معرفة) الحالة التي وصل إليها النشر.

وثمة قاعدة مهمة أخرى ينبغي تذكّرها فيما يتعلق بالنشر (وبـCI بشكل عام): «الإخفاقات الصامتة&nbsp;<strong>سيئة للغاية</strong>!»

هذا لا يعني أنه يجب إظهار الإخفاقات لمستخدمي البرمجية، بل يعني أننا نحتاج إلى أن نكون على علم إذا ساء أي شيء. فإذا علمنا بمشكلة أمكننا إصلاحها. أما إذا لم يُظهر نظام النشر أي أخطاء لكنه فشل، فقد ننتهي إلى حالة نظن فيها أننا أصلحنا خطأً حرجاً، بينما فشل النشر، فبقي الخطأ في بيئة الإنتاج ونحن غير مدركين للحالة.

### ماذا يفعل نظام النشر الجيد؟

من الصعب وضع قواعد أو متطلبات نهائية لنظام النشر، لكن لنحاول على أي حال:
- ينبغي أن يكون نظام النشر لدينا قادراً على الفشل بلطف عند&nbsp;<strong>أي</strong>&nbsp;خطوة من خطوات النشر.
- ينبغي أن&nbsp;<strong>لا يترك أبداً</strong>&nbsp;نظام النشر لدينا برمجيتنا في حالة معطوبة.
- ينبغي أن يُعلمنا نظام النشر عند حدوث فشل. فالإشعار بالفشل أهم من الإشعار بالنجاح.
- ينبغي أن يتيح لنا نظام النشر التراجع إلى نشر سابق.
- ينبغي أن يتعامل نظام النشر مع الحالة التي يرسل فيها مستخدم طلب HTTP قبل النشر مباشرة أو أثناءه.
- ينبغي أن يتأكد نظام النشر من أن البرمجية التي ننشرها تستوفي المتطلبات التي وضعناها لذلك (مثلاً، لا تنشر إذا لم تُشغَّل الاختبارات).

لنحدد أيضاً بعض الأمور التي&nbsp;<strong>نريدها</strong>&nbsp;في نظام النشر الافتراضي هذا:
- نودّ أن يكون سريعاً.
- نودّ ألا يكون هناك توقف خلال النشر (وهذا مختلف عن المتطلب الخاص بالتعامل مع طلبات المستخدمين قبل النشر مباشرة أو أثناءه).

بعد ذلك سيكون لدينا مجموعتان من التمارين لأتمتة النشر باستخدام GitHub Actions، واحدة لـ<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a> وأخرى لـ<a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. عملية النشر خاصة دائماً بمزوّد الخدمات السحابية المعيّن، لذا يمكنك أيضاً إنجاز مجموعتي التمارين إذا أردت رؤية الفروق في كيفية تعامل هاتين الخدمتين مع النشر.

### هل تم نشر التطبيق؟

بما أننا لا نجري أي تغييرات حقيقية على التطبيق، فقد يكون من الصعب بعض الشيء رؤية ما إذا كان نشر التطبيق يعمل فعلاً. لننشئ نقطة نهاية وهمية في التطبيق تتيح إجراء بعض تغييرات الشيفرة والتأكد من أن الإصدار المنشور قد تغيّر بالفعل:

```
app.get('/version', (req, res) =&gt; {
  res.send('1') // غيّر هذا النص لضمان نشر إصدار جديد
})
```

لاحظ أن نقطة النهاية هذه تعمل فقط في بناء الإنتاج؛ فإذا شغّلت التطبيق باستخدام <code>npm start</code> فلن يُستخدم تطبيق Express إطلاقاً، وبالتالي فإن نقطة النهاية غير موجودة!

### التمارين 10.-12. (Fly.io)

إذا كنت تفضّل استخدام خيارات استضافة أخرى، فهناك مجموعة تمارين بديلة لـ&nbsp;<a href="/part11/deployment#exercises-11-10-11-12-render" target="_blank" rel="noreferrer noopener">Render</a>.

#### 10. نشر تطبيقك على Fly.io

أعدّ تطبيقك في خدمة الاستضافة&nbsp;<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a>&nbsp;كما فعلنا في&nbsp;<a href="/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">الجزء 3</a>.

وعلى خلاف الجزء 3، فإننا في هذا الجزء&nbsp;<em>لا ننشر الشيفرة</em>&nbsp;إلى Fly.io بأنفسنا (باستخدام الأمر&nbsp;<em>flyctl deploy</em>)، بل ندع سير عمل GitHub Actions يفعل ذلك نيابةً عنا.

قبل الانتقال إلى النشر الآلي، سنتأكد في هذا التمرين من إمكانية نشر التطبيق يدوياً.

إذن، أنشئ تطبيقاً جديداً في Fly.io. بعد ذلك، أنشئ رمز وصول لـFly.io API باستخدام الأمر

```
fly tokens create deploy
```

ستحتاج إلى الرمز قريباً في سير عمل النشر لديك، لذا احفظه في مكان ما (لكن لا تُدرجه في commit على GitHub)!

وكما قلنا، قبل إعداد خط أنابيب النشر في التمرين التالي، سنتأكد الآن من أن النشر اليدوي باستخدام الأمر&nbsp;<em>flyctl deploy</em>&nbsp;يعمل.

هناك بضعة تغييرات مطلوبة.

ينبغي تعديل ملف الإعدادات&nbsp;<em>fly.toml</em>&nbsp;ليتضمن ما يلي:

```
app = 'fs-pdex'
primary_region = 'arn'

[build]

// BEGIN HIGHLIGHT
[env]
  PORT="5001"

[processes]
  app = "node app.js"
// END HIGHLIGHT

[http_service]
// BEGIN HIGHLIGHT
  internal_port = 5001 # تأكد من أن هذا مطابق لما ورد أعلاه!
// END HIGHLIGHT
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpus = 1
  memory_mb = 1024
```

في <a href="https://fly.io/docs/reference/configuration/#the-processes-section" target="_blank" rel="noreferrer noopener">processes</a> نحدد الأمر الذي يبدأ التطبيق. فبدون هذا التغيير، يبدأ Fly.io خادم تطوير React فقط، ما يؤدي إلى توقفه لأن التطبيق نفسه لا يبدأ. سنضبط أيضاً قيمة PORT لتُمرَّر إلى التطبيق كمتغير بيئة.

ينبغي الآن أن يعمل النشر&nbsp;<em>إذا</em>&nbsp;كان بناء الإنتاج موجوداً على الجهاز المحلي، أي إذا نُفِّذ الأمر&nbsp;<em>npm build</em>.

قبل الانتقال إلى التمرين التالي، تأكد من أن النشر اليدوي باستخدام الأمر&nbsp;<em>flyctl deploy</em>&nbsp;يعمل!

#### 11. النشر الآلي إلى Fly.io

وسّع سير العمل بخطوة لنشر تطبيقك إلى Fly.io باتباع النصيحة الواردة هنا. تحقق من أحدث إصدار لإجراء <em>setup-flyctl</em> من <a href="https://github.com/superfly/flyctl-actions" data-type="link" data-id="https://github.com/superfly/flyctl-actions">هنا</a>.

لاحظ أنه ينبغي أن يُنشئ GitHub Action بناء الإنتاج (باستخدام&nbsp;<em>npm run build</em>) قبل خطوة النشر!

ستحتاج إلى رمز التفويض الذي أنشأته للتو من أجل النشر. والطريقة الصحيحة لتمرير قيمته إلى GitHub Actions هي استخدام <em>أسرار المستودع (Repository secrets)</em>:

![صورة توضيحية](/images/mooc/c07c2407946e.webp)

الآن يمكن لسير العمل الوصول إلى قيمة الرمز كما يلي:

```
${{secrets.FLY_API_TOKEN}}
```

إذا سار كل شيء على ما يرام، ينبغي أن تبدو سجلات سير العمل لديك هكذا:

![صورة توضيحية](/images/mooc/0dadf65c45e0.webp)

<strong>تذكّر</strong>&nbsp;أنه من الضروري دائماً مراقبة ما يحدث في سجلات الخادم عند التجربة مع عمليات نشر الإنتاج، لذا استخدم&nbsp;<code>flyctl logs</code>&nbsp;مبكراً وبشكل متكرر. لا، استخدمه طوال الوقت!

#### 12. فحص الحالة في Fly.io

لنفترض أننا كسرنا التطبيق عن غير قصد بتشغيله على منفذ خاطئ:

const start = async () =&gt; {

```js
const start = async () => {<br>  await app.listen(PORT+1) // HIGHLIGHT LINE<br>  console.log(`server started on port ${PORT}`)<br>}
```

لا تلاحظ اختباراتنا هذا التغيير الكاسر (لأن اختبارات e2e تُشغَّل في وضع التطوير)، وسيُنشَر التطبيق في حالة غير فعّالة. فكيف يمكننا منع ذلك؟

لحسن الحظ، لدى Fly.io عدة خيارات إعداد تضمن ألا يُنشر إصدار جديد من التطبيق إلى المستخدمين إلا إذا كان في <em>حالة سليمة</em>.

إحدى طرق منع عمليات النشر المعطوبة هي استخدام فحص على مستوى HTTP معرّف في قسم <a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank" rel="noreferrer noopener">http_service.http_checks</a> من ملف الإعدادات <em>fly.toml</em>. يمكن استخدام هذا النوع من الفحص للتأكد من أن التطبيق في حالة فعّالة.

أضف نقطة نهاية بسيطة لإجراء فحص حالة التطبيق إلى الواجهة الخلفية. يمكنك مثلاً نسخ هذه الشيفرة:

```
app.get('/health', (req, res) =&gt; {
  res.send('ok')
})
```

اضبط <span style="margin: 0px; padding: 0px;"><a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank">فحص HTTP</a> للتأكد من سلامة النشر بإرسال</span> طلب HTTP إلى نقطة نهاية فحص الحالة المعرّفة.

تحتاج أيضاً إلى ضبط <a href="https://fly.io/docs/reference/configuration/#picking-a-deployment-strategy" target="_blank" rel="noreferrer noopener">استراتيجية النشر</a> (في ملف <em>fly.toml</em>) للتطبيق لتكون <em>canary</em>. تضمن هذه الاستراتيجية ألا يُنشر إلا تطبيق في حالة سليمة.

تأكد من أن GitHub Actions يلاحظ إذا كسر أحد عمليات النشر تطبيقك:

![صورة توضيحية](/images/mooc/49e19711139f.webp)

يمكنك محاكاة ذلك مثلاً كما يلي:

```
app.get('/health', (req, res) => {
  // BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
```

### التمارين 10.-12. (Render)

إذا كنت تفضّل استخدام خيارات استضافة أخرى، فهناك مجموعة تمارين بديلة لـ<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration/chapter-4" target="_blank" rel="noreferrer noopener">Fly.io</a>.

#### 10. نشر تطبيقك على Render

أعدّ تطبيقك في <a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. لم يعد الإعداد الآن بالبساطة نفسها التي كان عليها في <a href="/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">الجزء 3</a>. عليك أن تفكر بعناية فيما ينبغي وضعه في هذه الإعدادات:

![صورة توضيحية](/images/mooc/f65d5bf2b1d9.webp)

إذا احتجت إلى تشغيل عدة أوامر في أمر البناء أو التشغيل، فيمكنك استخدام نص صدفة (shell script) بسيط لذلك.

أنشئ مثلاً ملفاً باسم&nbsp;<em>build_step.sh</em>&nbsp;بالمحتوى التالي:

```
<strong>#!/bin/bash</strong>

echo "Build script"

# أضف الأوامر هنا
```

امنحه أذونات التنفيذ (ابحث في Google أو انظر مثلاً&nbsp;<a href="https://www.guru99.com/file-permissions.html" target="_blank" rel="noreferrer noopener">هذا</a>&nbsp;لمعرفة كيفية ذلك) وتأكد من قدرتك على تشغيله من سطر الأوامر:

```
$ ./build_step.sh
Build script
```

وهناك خيار آخر هو استخدام <a href="https://docs.render.com/deploys#deploy-steps" target="_blank" rel="noreferrer noopener">أمر ما قبل النشر (Pre deploy command)</a>، والذي يتيح لك تشغيل أمر إضافي واحد قبل بدء النشر.

تحتاج أيضاً إلى فتح <em>الإعدادات المتقدمة (Advanced settings)</em> وإيقاف النشر التلقائي لأننا نريد التحكم في النشر من داخل GitHub Actions:

![صورة توضيحية](/images/mooc/0b7fd8c8d040.webp)

تأكد الآن من أن التطبيق يعمل. استخدم&nbsp;<em>النشر اليدوي (Manual deploy)</em>.

على الأرجح ستفشل الأمور في البداية، لذا تذكّر أن تُبقي&nbsp;<em>السجلات (Logs)</em>&nbsp;مفتوحة طوال الوقت.

#### 11. النشر الآلي إلى Render

الخطوة التالية هي أتمتة النشر.

توجد بعض الإجراءات الجاهزة من أطراف ثالثة لنشر Render، لكن الخيار الأكثر موثوقية هو استخدام <a href="https://render.com/docs/deploy-hooks" target="_blank" rel="noreferrer noopener">خطاف النشر في Render (Render Deploy Hook)</a>، وهو رابط خاص لتشغيل النشر. يمكنك الحصول عليه من إعدادات تطبيقك:

![صورة توضيحية](/images/mooc/da8aade4bf23.webp)

لا تستخدم الرابط المجرد في خط أنابيبك. بدلاً من ذلك، أنشئ سراً (secret) في GitHub من أجله:

![صورة توضيحية](/images/mooc/a6ec91c00fda.webp)

ثم يمكنك استخدامه هكذا:

```
- name: Trigger deployment
  run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

يستغرق النشر بعض الوقت. انظر إلى تبويب الأحداث (events) في لوحة تحكم Render لمعرفة متى يصبح النشر الجديد جاهزاً:

![صورة توضيحية](/images/mooc/71f026faeae0.webp)

#### 12. فحص الحالة في Render

تنجح جميع الاختبارات ويُنشر الإصدار الجديد من التطبيق تلقائياً إلى Render، فيبدو أن كل شيء على ما يرام. لكن هل يعمل التطبيق فعلاً؟ إلى جانب الفحوصات التي تُجرى في خط أنابيب النشر، من المفيد جداً أن تكون لدينا أيضاً بعض فحوصات الحالة «على مستوى التطبيق» التي تضمن أن التطبيق فعلاً في حالة فعّالة.

ينبغي أن تضمن <a href="https://docs.render.com/deploys#zero-downtime-deploys" target="_blank" rel="noreferrer noopener">عمليات النشر دون توقف</a> في Render بقاء تطبيقك فعّالاً طوال الوقت!

أضف نقطة نهاية بسيطة لإجراء فحص حالة التطبيق إلى الواجهة الخلفية. يمكنك مثلاً نسخ هذه الشيفرة:

```
app.get('/health', (req, res) =&gt; {
  res.send('ok')
})
```

أدرج الشيفرة في commit وادفعها إلى GitHub. تأكد من قدرتك على الوصول إلى نقطة نهاية فحص الحالة في تطبيقك.

اضبط الآن <em>مسار فحص الحالة (Health Check Path)</em> لتطبيقك. يتم الإعداد في تبويب الإعدادات في لوحة تحكم Render.

أجرِ تغييراً في شيفرتك، وادفعها إلى GitHub، وتأكد من نجاح النشر.

لاحظ أنك تستطيع رؤية سجل النشر بالنقر على أحدث عملية نشر في تبويب الأحداث.

عندما تنتهي من إعداد فحص الحالة، حاكِ عملية نشر معطوبة بتغيير الشيفرة كما يلي:

```
app.get('/health', (req, res) => {
// BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
```

ادفع الشيفرة إلى GitHub وتأكد من عدم نشر إصدار معطوب ومن استمرار تشغيل الإصدار السابق من التطبيق.

قبل المتابعة، أصلح عملية النشر لديك وتأكد من أن التطبيق يعمل مرة أخرى كما هو مقصود.

قد تكون فكرة جيدة تغيير سياسة النشر في Render إلى <em>override</em>، كما هو موضح <a href="https://render.com/docs/deploys#managing-deploys" data-type="link" data-id="https://render.com/docs/deploys#managing-deploys">هنا</a>. وإلا فسيتعين على النشر الجديد الانتظار حتى 15 دقيقة ريثما يلغي Render عملية النشر الحالية المعطوبة.

<div class="tasks">

**10. نشر تطبيقك على مزوّد الخدمات السحابية**

</div>

<div class="tasks">

**11. النشر السحابي الآلي**

</div>

<div class="tasks">

**12. فحص الحالة**

</div>
