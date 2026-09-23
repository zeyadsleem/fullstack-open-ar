const s=11,a="d",e="d.md",n="النشر",r="deployment",p="/images/part-11.svg",t=[{depth:3,id:"كل-ما-يمكن-أن-يسوء",text:"كل ما يمكن أن يسوء..."},{depth:3,id:"ماذا-يفعل-نظام-النشر-الجيد",text:"ماذا يفعل نظام النشر الجيد؟"},{depth:3,id:"هل-تم-نشر-التطبيق",text:"هل تم نشر التطبيق؟"},{depth:3,id:"التمارين-10-12-flyio",text:"التمارين 10.-12. (Fly.io)"},{depth:3,id:"التمارين-10-12-render",text:"التمارين 10.-12. (Render)"}],o=`<p>بعد أن كتبنا تطبيقاً جميلاً، حان الوقت للتفكير في كيفية نشره لاستخدام المستخدمين الحقيقيين.</p>
<p>في <a href="/part3/deploying_app_to_internet" target="_blank" rel="noreferrer noopener">الجزء 3</a> من هذه الدورة، فعلنا ذلك بمجرد تشغيل أمر واحد من الطرفية لرفع الشيفرة وتشغيلها على خوادم مزوّد الخدمات السحابية <a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a> أو <a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>.</p>
<p>إن إصدار البرمجيات في Fly.io وRender بسيط جداً، على الأقل مقارنةً بالكثير من أنواع إعدادات الاستضافة الأخرى، لكنه لا يزال ينطوي على مخاطر: فلا شيء يمنعنا من نشر شيفرة معطوبة إلى بيئة الإنتاج عن غير قصد.</p>
<p>بعد ذلك، سنتناول مبادئ إجراء النشر بأمان وبعض مبادئ نشر البرمجيات على النطاقين الصغير والكبير.</p>
<h3 id="كل-ما-يمكن-أن-يسوء">كل ما يمكن أن يسوء...</h3>
<p>نودّ أن نضع بعض القواعد حول كيفية عمل عملية النشر لدينا، لكن قبل ذلك علينا أن ننظر في بعض قيود الواقع.</p>
<p>تقول إحدى صيغ قانون مورفي: «كل ما يمكن أن يسوء سيسوء».</p>
<p>من المهم تذكّر ذلك عندما نخطط نظام النشر لدينا. ومن الأمور التي سنحتاج إلى أخذها في الحسبان:</p>
<ul>
<li>ماذا لو تعطّل حاسوبي أو تجمّد أثناء النشر؟</li>
<li>أنا متصل بالخادم وأنشر عبر الإنترنت، ماذا يحدث إذا انقطع اتصالي بالإنترنت؟</li>
<li>ماذا يحدث إذا فشل أي أمر معيّن في نص أو نظام النشر لدي؟</li>
<li>ماذا يحدث إذا لم تعمل برمجيتي كما هو متوقع، لأي سبب كان، على الخادم الذي أنشر عليه؟ هل يمكنني التراجع إلى إصدار سابق؟</li>
<li>ماذا يحدث إذا أرسل مستخدم طلب HTTP إلى برمجيتنا قبل النشر مباشرة (ولم يكن لدينا وقت لإرسال استجابة للمستخدم)؟</li>
</ul>
<p>هذه مجرد مجموعة صغيرة مما يمكن أن يسوء أثناء النشر، أو بالأحرى أمور ينبغي أن نخطط لها. وبغض النظر عما يحدث، يجب أن <strong>لا يترك أبداً</strong> نظام النشر لدينا برمجيتنا في حالة معطوبة. كما ينبغي أن نعرف دائماً (أو نكون قادرين بسهولة على معرفة) الحالة التي وصل إليها النشر.</p>
<p>وثمة قاعدة مهمة أخرى ينبغي تذكّرها فيما يتعلق بالنشر (وبـCI بشكل عام): «الإخفاقات الصامتة <strong>سيئة للغاية</strong>!»</p>
<p>هذا لا يعني أنه يجب إظهار الإخفاقات لمستخدمي البرمجية، بل يعني أننا نحتاج إلى أن نكون على علم إذا ساء أي شيء. فإذا علمنا بمشكلة أمكننا إصلاحها. أما إذا لم يُظهر نظام النشر أي أخطاء لكنه فشل، فقد ننتهي إلى حالة نظن فيها أننا أصلحنا خطأً حرجاً، بينما فشل النشر، فبقي الخطأ في بيئة الإنتاج ونحن غير مدركين للحالة.</p>
<h3 id="ماذا-يفعل-نظام-النشر-الجيد">ماذا يفعل نظام النشر الجيد؟</h3>
<p>من الصعب وضع قواعد أو متطلبات نهائية لنظام النشر، لكن لنحاول على أي حال:</p>
<ul>
<li>ينبغي أن يكون نظام النشر لدينا قادراً على الفشل بلطف عند <strong>أي</strong> خطوة من خطوات النشر.</li>
<li>ينبغي أن <strong>لا يترك أبداً</strong> نظام النشر لدينا برمجيتنا في حالة معطوبة.</li>
<li>ينبغي أن يُعلمنا نظام النشر عند حدوث فشل. فالإشعار بالفشل أهم من الإشعار بالنجاح.</li>
<li>ينبغي أن يتيح لنا نظام النشر التراجع إلى نشر سابق.</li>
<li>ينبغي أن يتعامل نظام النشر مع الحالة التي يرسل فيها مستخدم طلب HTTP قبل النشر مباشرة أو أثناءه.</li>
<li>ينبغي أن يتأكد نظام النشر من أن البرمجية التي ننشرها تستوفي المتطلبات التي وضعناها لذلك (مثلاً، لا تنشر إذا لم تُشغَّل الاختبارات).</li>
</ul>
<p>لنحدد أيضاً بعض الأمور التي <strong>نريدها</strong> في نظام النشر الافتراضي هذا:</p>
<ul>
<li>نودّ أن يكون سريعاً.</li>
<li>نودّ ألا يكون هناك توقف خلال النشر (وهذا مختلف عن المتطلب الخاص بالتعامل مع طلبات المستخدمين قبل النشر مباشرة أو أثناءه).</li>
</ul>
<p>بعد ذلك سيكون لدينا مجموعتان من التمارين لأتمتة النشر باستخدام GitHub Actions، واحدة لـ<a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a> وأخرى لـ<a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. عملية النشر خاصة دائماً بمزوّد الخدمات السحابية المعيّن، لذا يمكنك أيضاً إنجاز مجموعتي التمارين إذا أردت رؤية الفروق في كيفية تعامل هاتين الخدمتين مع النشر.</p>
<h3 id="هل-تم-نشر-التطبيق">هل تم نشر التطبيق؟</h3>
<p>بما أننا لا نجري أي تغييرات حقيقية على التطبيق، فقد يكون من الصعب بعض الشيء رؤية ما إذا كان نشر التطبيق يعمل فعلاً. لننشئ نقطة نهاية وهمية في التطبيق تتيح إجراء بعض تغييرات الشيفرة والتأكد من أن الإصدار المنشور قد تغيّر بالفعل:</p>
<pre><code>app.get('/version', (req, res) =&amp;gt; {
  res.send('1') // غيّر هذا النص لضمان نشر إصدار جديد
})
</code></pre>
<p>لاحظ أن نقطة النهاية هذه تعمل فقط في بناء الإنتاج؛ فإذا شغّلت التطبيق باستخدام <code>npm start</code> فلن يُستخدم تطبيق Express إطلاقاً، وبالتالي فإن نقطة النهاية غير موجودة!</p>
<h3 id="التمارين-10-12-flyio">التمارين 10.-12. (Fly.io)</h3>
<p>إذا كنت تفضّل استخدام خيارات استضافة أخرى، فهناك مجموعة تمارين بديلة لـ <a href="/part11/deployment#exercises-11-10-11-12-render" target="_blank" rel="noreferrer noopener">Render</a>.</p>
<h4 id="10-نشر-تطبيقك-على-flyio">10. نشر تطبيقك على Fly.io</h4>
<p>أعدّ تطبيقك في خدمة الاستضافة <a href="https://fly.io/" target="_blank" rel="noreferrer noopener">Fly.io</a> كما فعلنا في <a href="/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">الجزء 3</a>.</p>
<p>وعلى خلاف الجزء 3، فإننا في هذا الجزء <em>لا ننشر الشيفرة</em> إلى Fly.io بأنفسنا (باستخدام الأمر <em>flyctl deploy</em>)، بل ندع سير عمل GitHub Actions يفعل ذلك نيابةً عنا.</p>
<p>قبل الانتقال إلى النشر الآلي، سنتأكد في هذا التمرين من إمكانية نشر التطبيق يدوياً.</p>
<p>إذن، أنشئ تطبيقاً جديداً في Fly.io. بعد ذلك، أنشئ رمز وصول لـFly.io API باستخدام الأمر</p>
<pre><code>fly tokens create deploy
</code></pre>
<p>ستحتاج إلى الرمز قريباً في سير عمل النشر لديك، لذا احفظه في مكان ما (لكن لا تُدرجه في commit على GitHub)!</p>
<p>وكما قلنا، قبل إعداد خط أنابيب النشر في التمرين التالي، سنتأكد الآن من أن النشر اليدوي باستخدام الأمر <em>flyctl deploy</em> يعمل.</p>
<p>هناك بضعة تغييرات مطلوبة.</p>
<p>ينبغي تعديل ملف الإعدادات <em>fly.toml</em> ليتضمن ما يلي:</p>
<pre><code>app = 'fs-pdex'
primary_region = 'arn'

[build]

// BEGIN HIGHLIGHT
[env]
  PORT=&quot;5001&quot;

[processes]
  app = &quot;node app.js&quot;
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
</code></pre>
<p>في <a href="https://fly.io/docs/reference/configuration/#the-processes-section" target="_blank" rel="noreferrer noopener">processes</a> نحدد الأمر الذي يبدأ التطبيق. فبدون هذا التغيير، يبدأ Fly.io خادم تطوير React فقط، ما يؤدي إلى توقفه لأن التطبيق نفسه لا يبدأ. سنضبط أيضاً قيمة PORT لتُمرَّر إلى التطبيق كمتغير بيئة.</p>
<p>ينبغي الآن أن يعمل النشر <em>إذا</em> كان بناء الإنتاج موجوداً على الجهاز المحلي، أي إذا نُفِّذ الأمر <em>npm build</em>.</p>
<p>قبل الانتقال إلى التمرين التالي، تأكد من أن النشر اليدوي باستخدام الأمر <em>flyctl deploy</em> يعمل!</p>
<h4 id="11-النشر-الآلي-إلى-flyio">11. النشر الآلي إلى Fly.io</h4>
<p>وسّع سير العمل بخطوة لنشر تطبيقك إلى Fly.io باتباع النصيحة الواردة هنا. تحقق من أحدث إصدار لإجراء <em>setup-flyctl</em> من <a href="https://github.com/superfly/flyctl-actions" data-type="link" data-id="https://github.com/superfly/flyctl-actions">هنا</a>.</p>
<p>لاحظ أنه ينبغي أن يُنشئ GitHub Action بناء الإنتاج (باستخدام <em>npm run build</em>) قبل خطوة النشر!</p>
<p>ستحتاج إلى رمز التفويض الذي أنشأته للتو من أجل النشر. والطريقة الصحيحة لتمرير قيمته إلى GitHub Actions هي استخدام <em>أسرار المستودع (Repository secrets)</em>:</p>
<p><img src="/images/mooc/c07c2407946e.webp" alt="صورة توضيحية"></p>
<p>الآن يمكن لسير العمل الوصول إلى قيمة الرمز كما يلي:</p>
<pre><code>\${{secrets.FLY_API_TOKEN}}
</code></pre>
<p>إذا سار كل شيء على ما يرام، ينبغي أن تبدو سجلات سير العمل لديك هكذا:</p>
<p><img src="/images/mooc/0dadf65c45e0.webp" alt="صورة توضيحية"></p>
<p><strong>تذكّر</strong> أنه من الضروري دائماً مراقبة ما يحدث في سجلات الخادم عند التجربة مع عمليات نشر الإنتاج، لذا استخدم <code>flyctl logs</code> مبكراً وبشكل متكرر. لا، استخدمه طوال الوقت!</p>
<h4 id="12-فحص-الحالة-في-flyio">12. فحص الحالة في Fly.io</h4>
<p>لنفترض أننا كسرنا التطبيق عن غير قصد بتشغيله على منفذ خاطئ:</p>
<p>const start = async () =&gt; {</p>
<pre><code class="language-js"><span class="hljs-keyword">const</span> <span class="hljs-title function_">start</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params"></span>) =&gt; {&lt;br&gt;  <span class="hljs-keyword">await</span> app.<span class="hljs-title function_">listen</span>(<span class="hljs-variable constant_">PORT</span>+<span class="hljs-number">1</span>) <span class="hljs-comment">// HIGHLIGHT LINE&lt;br&gt;  console.log(\`server started on port \${PORT}\`)&lt;br&gt;}</span>
</code></pre>
<p>لا تلاحظ اختباراتنا هذا التغيير الكاسر (لأن اختبارات e2e تُشغَّل في وضع التطوير)، وسيُنشَر التطبيق في حالة غير فعّالة. فكيف يمكننا منع ذلك؟</p>
<p>لحسن الحظ، لدى Fly.io عدة خيارات إعداد تضمن ألا يُنشر إصدار جديد من التطبيق إلى المستخدمين إلا إذا كان في <em>حالة سليمة</em>.</p>
<p>إحدى طرق منع عمليات النشر المعطوبة هي استخدام فحص على مستوى HTTP معرّف في قسم <a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank" rel="noreferrer noopener">http_service.http_checks</a> من ملف الإعدادات <em>fly.toml</em>. يمكن استخدام هذا النوع من الفحص للتأكد من أن التطبيق في حالة فعّالة.</p>
<p>أضف نقطة نهاية بسيطة لإجراء فحص حالة التطبيق إلى الواجهة الخلفية. يمكنك مثلاً نسخ هذه الشيفرة:</p>
<pre><code>app.get('/health', (req, res) =&amp;gt; {
  res.send('ok')
})
</code></pre>
<p>اضبط <span style="margin: 0px; padding: 0px;"><a href="https://fly.io/docs/reference/configuration/#http_service-checks" target="_blank">فحص HTTP</a> للتأكد من سلامة النشر بإرسال</span> طلب HTTP إلى نقطة نهاية فحص الحالة المعرّفة.</p>
<p>تحتاج أيضاً إلى ضبط <a href="https://fly.io/docs/reference/configuration/#picking-a-deployment-strategy" target="_blank" rel="noreferrer noopener">استراتيجية النشر</a> (في ملف <em>fly.toml</em>) للتطبيق لتكون <em>canary</em>. تضمن هذه الاستراتيجية ألا يُنشر إلا تطبيق في حالة سليمة.</p>
<p>تأكد من أن GitHub Actions يلاحظ إذا كسر أحد عمليات النشر تطبيقك:</p>
<p><img src="/images/mooc/49e19711139f.webp" alt="صورة توضيحية"></p>
<p>يمكنك محاكاة ذلك مثلاً كما يلي:</p>
<pre><code>app.get('/health', (req, res) =&gt; {
  // BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
</code></pre>
<h3 id="التمارين-10-12-render">التمارين 10.-12. (Render)</h3>
<p>إذا كنت تفضّل استخدام خيارات استضافة أخرى، فهناك مجموعة تمارين بديلة لـ<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration/chapter-4" target="_blank" rel="noreferrer noopener">Fly.io</a>.</p>
<h4 id="10-نشر-تطبيقك-على-render">10. نشر تطبيقك على Render</h4>
<p>أعدّ تطبيقك في <a href="https://render.com/" target="_blank" rel="noreferrer noopener">Render</a>. لم يعد الإعداد الآن بالبساطة نفسها التي كان عليها في <a href="/part3/deploying_app_to_internet#application-to-the-internet" target="_blank" rel="noreferrer noopener">الجزء 3</a>. عليك أن تفكر بعناية فيما ينبغي وضعه في هذه الإعدادات:</p>
<p><img src="/images/mooc/f65d5bf2b1d9.webp" alt="صورة توضيحية"></p>
<p>إذا احتجت إلى تشغيل عدة أوامر في أمر البناء أو التشغيل، فيمكنك استخدام نص صدفة (shell script) بسيط لذلك.</p>
<p>أنشئ مثلاً ملفاً باسم <em>build_step.sh</em> بالمحتوى التالي:</p>
<pre><code>&lt;strong&gt;#!/bin/bash&lt;/strong&gt;

echo &quot;Build script&quot;

# أضف الأوامر هنا
</code></pre>
<p>امنحه أذونات التنفيذ (ابحث في Google أو انظر مثلاً <a href="https://www.guru99.com/file-permissions.html" target="_blank" rel="noreferrer noopener">هذا</a> لمعرفة كيفية ذلك) وتأكد من قدرتك على تشغيله من سطر الأوامر:</p>
<pre><code>$ ./build_step.sh
Build script
</code></pre>
<p>وهناك خيار آخر هو استخدام <a href="https://docs.render.com/deploys#deploy-steps" target="_blank" rel="noreferrer noopener">أمر ما قبل النشر (Pre deploy command)</a>، والذي يتيح لك تشغيل أمر إضافي واحد قبل بدء النشر.</p>
<p>تحتاج أيضاً إلى فتح <em>الإعدادات المتقدمة (Advanced settings)</em> وإيقاف النشر التلقائي لأننا نريد التحكم في النشر من داخل GitHub Actions:</p>
<p><img src="/images/mooc/0b7fd8c8d040.webp" alt="صورة توضيحية"></p>
<p>تأكد الآن من أن التطبيق يعمل. استخدم <em>النشر اليدوي (Manual deploy)</em>.</p>
<p>على الأرجح ستفشل الأمور في البداية، لذا تذكّر أن تُبقي <em>السجلات (Logs)</em> مفتوحة طوال الوقت.</p>
<h4 id="11-النشر-الآلي-إلى-render">11. النشر الآلي إلى Render</h4>
<p>الخطوة التالية هي أتمتة النشر.</p>
<p>توجد بعض الإجراءات الجاهزة من أطراف ثالثة لنشر Render، لكن الخيار الأكثر موثوقية هو استخدام <a href="https://render.com/docs/deploy-hooks" target="_blank" rel="noreferrer noopener">خطاف النشر في Render (Render Deploy Hook)</a>، وهو رابط خاص لتشغيل النشر. يمكنك الحصول عليه من إعدادات تطبيقك:</p>
<p><img src="/images/mooc/da8aade4bf23.webp" alt="صورة توضيحية"></p>
<p>لا تستخدم الرابط المجرد في خط أنابيبك. بدلاً من ذلك، أنشئ سراً (secret) في GitHub من أجله:</p>
<p><img src="/images/mooc/a6ec91c00fda.webp" alt="صورة توضيحية"></p>
<p>ثم يمكنك استخدامه هكذا:</p>
<pre><code>- name: Trigger deployment
  run: curl \${{ secrets.RENDER_DEPLOY_HOOK }}
</code></pre>
<p>يستغرق النشر بعض الوقت. انظر إلى تبويب الأحداث (events) في لوحة تحكم Render لمعرفة متى يصبح النشر الجديد جاهزاً:</p>
<p><img src="/images/mooc/71f026faeae0.webp" alt="صورة توضيحية"></p>
<h4 id="12-فحص-الحالة-في-render">12. فحص الحالة في Render</h4>
<p>تنجح جميع الاختبارات ويُنشر الإصدار الجديد من التطبيق تلقائياً إلى Render، فيبدو أن كل شيء على ما يرام. لكن هل يعمل التطبيق فعلاً؟ إلى جانب الفحوصات التي تُجرى في خط أنابيب النشر، من المفيد جداً أن تكون لدينا أيضاً بعض فحوصات الحالة «على مستوى التطبيق» التي تضمن أن التطبيق فعلاً في حالة فعّالة.</p>
<p>ينبغي أن تضمن <a href="https://docs.render.com/deploys#zero-downtime-deploys" target="_blank" rel="noreferrer noopener">عمليات النشر دون توقف</a> في Render بقاء تطبيقك فعّالاً طوال الوقت!</p>
<p>أضف نقطة نهاية بسيطة لإجراء فحص حالة التطبيق إلى الواجهة الخلفية. يمكنك مثلاً نسخ هذه الشيفرة:</p>
<pre><code>app.get('/health', (req, res) =&amp;gt; {
  res.send('ok')
})
</code></pre>
<p>أدرج الشيفرة في commit وادفعها إلى GitHub. تأكد من قدرتك على الوصول إلى نقطة نهاية فحص الحالة في تطبيقك.</p>
<p>اضبط الآن <em>مسار فحص الحالة (Health Check Path)</em> لتطبيقك. يتم الإعداد في تبويب الإعدادات في لوحة تحكم Render.</p>
<p>أجرِ تغييراً في شيفرتك، وادفعها إلى GitHub، وتأكد من نجاح النشر.</p>
<p>لاحظ أنك تستطيع رؤية سجل النشر بالنقر على أحدث عملية نشر في تبويب الأحداث.</p>
<p>عندما تنتهي من إعداد فحص الحالة، حاكِ عملية نشر معطوبة بتغيير الشيفرة كما يلي:</p>
<pre><code>app.get('/health', (req, res) =&gt; {
// BEGIN HIGHLIGHT
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
// END HIGHLIGHT
  res.send('ok')
})
</code></pre>
<p>ادفع الشيفرة إلى GitHub وتأكد من عدم نشر إصدار معطوب ومن استمرار تشغيل الإصدار السابق من التطبيق.</p>
<p>قبل المتابعة، أصلح عملية النشر لديك وتأكد من أن التطبيق يعمل مرة أخرى كما هو مقصود.</p>
<p>قد تكون فكرة جيدة تغيير سياسة النشر في Render إلى <em>override</em>، كما هو موضح <a href="https://render.com/docs/deploys#managing-deploys" data-type="link" data-id="https://render.com/docs/deploys#managing-deploys">هنا</a>. وإلا فسيتعين على النشر الجديد الانتظار حتى 15 دقيقة ريثما يلغي Render عملية النشر الحالية المعطوبة.</p>
<div class="tasks">
<p><strong>10. نشر تطبيقك على مزوّد الخدمات السحابية</strong></p>
</div>
<div class="tasks">
<p><strong>11. النشر السحابي الآلي</strong></p>
</div>
<div class="tasks">
<p><strong>12. فحص الحالة</strong></p>
</div>
`,l={part:11,letter:"d",file:e,title:n,slug:r,mainImage:p,headings:t,html:o};export{l as default,e as file,t as headings,o as html,a as letter,p as mainImage,s as part,r as slug,n as title};
