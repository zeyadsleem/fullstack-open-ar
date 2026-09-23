---
part: 10
letter: b
title: "مقدمة إلى React Native"
mainImage: /images/part-10.svg
lang: ar
---
تقليدياً، تطلّب تطوير تطبيقات iOS وAndroid الأصلية من المطوّر استخدام لغات برمجة وبيئات تطوير خاصة بكل منصة. فبالنسبة لتطوير iOS، يعني ذلك استخدام Objective C أو Swift، وبالنسبة لتطوير Android استخدام لغات قائمة على JVM مثل Java أو Scala أو Kotlin. ومن الناحية التقنية، يتطلب إصدار تطبيق للمنصتين معاً تطوير تطبيقين منفصلين بلغات برمجة مختلفة. وهذا يستلزم موارد تطوير كبيرة.

أحد الأساليب الشائعة لتوحيد التطوير الخاص بكل منصة كان استخدام المتصفح كمحرّك عرض.&nbsp;<a href="https://cordova.apache.org/" target="_blank" rel="noreferrer noopener">Cordova</a>&nbsp;من أشهر المنصات لبناء التطبيقات متعددة المنصات. فهي تتيح تطوير تطبيقات متعددة المنصات باستخدام تقنيات الويب القياسية: HTML5 وCSS3 وJavaScript. غير أن تطبيقات Cordova تعمل داخل نافذة متصفح مضمّنة في جهاز المستخدم. ولهذا لا تستطيع هذه التطبيقات تحقيق أداء التطبيقات الأصلية ولا مظهرها وإحساسها، وهي التطبيقات التي تستخدم مكوّنات واجهة مستخدم أصلية فعلية.

<a href="https://reactnative.dev/" target="_blank" rel="noreferrer noopener">React Native</a>&nbsp;إطار عمل لتطوير تطبيقات Android وiOS الأصلية باستخدام JavaScript وReact. وهو يوفّر مجموعة من المكوّنات متعددة المنصات التي تستخدم خلف الكواليس المكوّنات الأصلية للمنصة. ويتيح لنا استخدام React Native جلب كل الميزات المألوفة في React مثل JSX والمكوّنات وprops والحالة والخطافات إلى تطوير التطبيقات الأصلية. وفوق ذلك، يمكننا الاستفادة من العديد من المكتبات المألوفة في منظومة React مثل&nbsp;<a href="https://react-redux.js.org/" target="_blank" rel="noreferrer noopener">React Redux</a>،&nbsp;<a href="https://www.apollographql.com/docs/react" target="_blank" rel="noreferrer noopener">Apollo</a>،&nbsp;<a href="https://reactrouter.com/en/main" target="_blank" rel="noreferrer noopener">React Router</a>&nbsp;وغيرها الكثير.

تُعدّ سرعة التطوير والمنحنى التعليمي اللطيف للمطورين المألوفين مع React من أهم مزايا React Native. وإليك اقتباساً تحفيزياً من مقال Coinbase بعنوان&nbsp;<a href="https://benbronsteiny.wordpress.com/2020/02/27/onboarding-thousands-of-users-with-react-native/" target="_blank" rel="noreferrer noopener">Onboarding thousands of users with React Native</a>&nbsp;حول مزايا React Native:

> <em>لو أردنا اختصار مزايا React Native في كلمة واحدة، لكانت «السرعة». ففي المتوسط، تمكّن فريقنا من تأهيل المهندسين في وقت أقل، ومشاركة مزيد من الشيفرة (وهو ما نتوقع أن يؤدي إلى تعزيز الإنتاجية مستقبلاً)، وفي النهاية تقديم الميزات بوتيرة أسرع مما لو اتبعنا نهجاً أصلياً بحتاً.</em>

## عن هذا الجزء

خلال هذا الجزء، سنطوّر تطبيقاً لتقييم مستودعات <a href="https://github.com/" target="_blank" rel="noreferrer noopener">GitHub</a>. وسيتضمن تطبيقنا ميزات مثل ترتيب المستودعات المُقيَّمة وتصفيتها، وتسجيل مستخدم، وتسجيل الدخول، وإنشاء تقييم لمستودع. وستُوفَّر لنا الواجهة الخلفية للتطبيق حتى نركّز فقط على تطوير React Native.

بُني هذا الجزء على فكرة أن تطوّر تطبيقك بينما تتقدّم في المادة. لذا <em>لا</em> تنتظر حتى التمارين لتبدأ التطوير. بل طوّر تطبيقك بالوتيرة نفسها التي تتقدّم بها المادة.

ستبدو النسخة النهائية من تطبيقنا شيئاً كهذا:

![معاينة التطبيق](/images/mooc/a76d099ec121.webp)

## تهيئة التطبيق

للبدء بتطبيقنا نحتاج إلى إعداد بيئة التطوير لدينا. تعلمنا من الأجزاء السابقة أن هناك أدوات مفيدة لإعداد تطبيقات React بسرعة مثل Vite. ولحسن الحظ، لدى React Native أدوات من هذا النوع أيضاً.

لتطوير تطبيقنا، سنستخدم <a href="https://docs.expo.dev/versions/latest/" target="_blank" rel="noreferrer noopener">Expo</a>. وExpo منصة تسهّل إعداد تطبيقات React Native وتطويرها وبناءها ونشرها. ولدى Expo <a href="https://docs.expo.dev/faq/#limitations" target="_blank" rel="noreferrer noopener">بعض القيود</a> مقارنةً بـ React Native CLI العادي. غير أن هذه القيود لا تؤثر في التطبيق المُنفَّذ في المادة.

لنبدأ مع Expo بتهيئة مشروعنا باستخدام <em>create-expo-app</em>:

```bash
npx create-expo-app rate-repository-app --template blank@sdk-55
```

> لاحظ أن <code>@sdk-55</code> يضبط <em>إصدار Expo SDK للمشروع على 5</em>5. ينبغي أن تستخدم هذا الإصدار بالتحديد أثناء متابعة هذه المادة.

بعد ذلك، لننتقل إلى مجلد&nbsp;<em>rate-repository-app</em>&nbsp;المنشأ باستخدام الطرفية ونثبّت بعض الاعتماديات التي سنحتاجها قريباً:

```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

الآن بعد أن هُيّئ تطبيقنا، افتح مجلد <em>rate-repository-app</em> المنشأ باستخدام محرّر مثل <a href="https://code.visualstudio.com/" target="_blank" rel="noreferrer noopener">Visual Studio Code</a>. وينبغي أن تكون البنية على النحو التالي تقريباً:

![بنية المشروع](/images/mooc/92af0d24c1cc.webp)

قد نلاحظ بعض الملفات والمجلدات المألوفة مثل&nbsp;<em>package.json</em>&nbsp;و&nbsp;<em>node_modules</em>. وفوق ذلك، فإن الملفين الأكثر أهمية هما ملف&nbsp;<em>app.json</em>&nbsp;الذي يحتوي على إعدادات متعلقة بـ Expo، وملف&nbsp;<em>App.js</em>&nbsp;وهو المكوّن الجذري لتطبيقنا.&nbsp;<em>لا</em>&nbsp;تُعِد تسمية ملف&nbsp;<em>App.js</em>&nbsp;أو تنقله لأن Expo يستورده افتراضياً من أجل&nbsp;<a href="https://docs.expo.dev/versions/latest/sdk/expo/#registerrootcomponentcomponent" target="_blank" rel="noreferrer noopener">تسجيل المكوّن الجذري</a>.

لنلقِ نظرة على قسم&nbsp;<em>scripts</em>&nbsp;في ملف&nbsp;<em>package.json</em>&nbsp;الذي يحتوي على السكربتات التالية:

```json
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  // ...
}
```

لنشغّل الآن السكربت <code>npm start</code>

![مخرجات طرفية حزمة Metro](/images/mooc/19d5da9ef95b.webp)

> <em>إذا فشل السكربت بخطأ</em>&nbsp;<em>فالمشكلة على الأرجح في إصدار Node لديك. وفي حال واجهت مشكلات، انتقل إلى الإصدار&nbsp;22.</em>

يشغّل الأمر خادم تطوير Expo (<a href="https://docs.expo.dev/more/expo-cli/" target="_blank" rel="noreferrer noopener">Expo CLI</a>). ويستخدم الخادم&nbsp;<a href="https://metrobundler.dev/" target="_blank" rel="noreferrer noopener">حزمة Metro</a> التي تجمع JavaScript وتقدّمها للتطبيق. ولدى واجهة سطر الأوامر مجموعة مفيدة من الأوامر لعرض سجلات التطبيق وتشغيل التطبيق في محاكي أو على جهاز فعلي (مثلاً باستخدام Expo Go). سنصل إلى المحاكيات وExpo Go قريباً، لكن أولاً لنفتح تطبيقنا في المتصفح.

تقترح واجهة سطر أوامر Expo بضع طرق لفتح تطبيقنا. لنضغط المفتاح "w" في نافذة الطرفية لفتح التطبيق في المتصفح. وينبغي أن نرى قريباً النص المعرّف في ملف <em>App.js</em> في نافذة المتصفح. افتح ملف <em>App.js</em> بمحرّر وأجرِ تغييراً صغيراً على النص في مكوّن <code>Text</code>. وبعد حفظ الملف، ينبغي أن تظهر التغييرات عادةً تلقائياً بفضل التحديث السريع (Fast Refresh).

## إعداد الأجهزة الافتراضية

ألقينا النظرة الأولى على تطبيقنا باستخدام عرض Expo في المتصفح. ومع أن عرض المتصفح قابل للاستخدام تماماً، فإنه يبقى محاكاة ضعيفة إلى حد كبير للبيئة الأصلية. لنلقِ نظرة على البدائل المتاحة لنا فيما يخص بيئة التطوير.

يمكن محاكاة أجهزة Android وiOS مثل الأجهزة اللوحية والهواتف في الحواسيب باستخدام <em>محاكيات</em>&nbsp;مخصصة. وهذا مفيد جداً لتطوير التطبيقات الأصلية. ويمكن لمستخدمي macOS استخدام محاكيات Android وiOS معاً على حواسيبهم. أما مستخدمو أنظمة التشغيل الأخرى، مثل Linux وWindows، فعليهم الاكتفاء بمحاكيات Android. بعد ذلك، وتبعاً لنظام تشغيلك، اتبع إحدى هذه التعليمات لإعداد محاكٍ:
- <a href="https://docs.expo.dev/workflow/android-studio-emulator/#set-up-android-studio" target="_blank" rel="noreferrer noopener">إعداد محاكي Android باستخدام Android Studio</a> (أي نظام تشغيل)
- <a href="https://docs.expo.dev/workflow/ios-simulator/" target="_blank" rel="noreferrer noopener">إعداد محاكي iOS باستخدام Xcode</a> (نظام macOS)

عندما تنتهي من إعداد المحاكي، شغّله حتى ترى الجهاز الافتراضي على شاشتك. ثم شغّل Expo CLI كما فعلنا سابقاً بتنفيذ <kbd><code>npm start</code></kbd>. وتبعاً للمحاكي الذي تشغّله، اضغط إما المفتاح المقابل لـ "فتح Android" أو "فتح محاكي iOS". وبعد الضغط على المفتاح، ينبغي أن يتصل Expo بالمحاكي وأن ترى التطبيق في النهاية داخل المحاكي. تحلَّ بالصبر، فقد يستغرق هذا بعض الوقت.

## استخدام هاتفك الخاص مع Expo Go

إضافةً إلى المحاكيات، هناك طريقة مفيدة للغاية لتطوير تطبيقات React Native باستخدام Expo: تطبيق Expo Go. فباستخدام Expo Go، يمكنك معاينة تطبيقك على جهازك المحمول الفعلي، وهو ما يمنح تجربة تطوير أكثر واقعية بقليل مقارنةً بالمحاكيات.

ينبغي أن يطابق الإصدار الرئيسي من Expo Go إصدار Expo SDK المستخدم، وهو في هذه الحالة 55. وقد تدعم بعض إصدارات Expo Go أيضاً مشاريع تستخدم إصدار SDK أقدم قليلاً، لكن هذا غير مضمون. لاحظ أن إصدار Expo Go المتاح في متاجر التطبيقات قد لا يكون مطابقاً لإصدار SDK المستخدم في هذه الدورة.

لنثبّت Expo Go:
- على هواتف Android، من الممكن تثبيت أي إصدار من Expo Go من <a href="https://expo.dev/go" data-type="link" data-id="https://expo.dev/go">موقع Expo</a>.
- لسوء الحظ، على مستخدمي iOS استخدام الإصدار المتاح في App Store، وقد لا يكون متوافقاً مع مادة الدورة. وإذا أردت، يمكنك استخدام إصدار SDK في الدورة يطابق إصدار Expo Go المتاح في App Store. غير أن لاحظ أن ليس كل أجزاء مادة الدورة متوافقة بالضرورة مع إصدارات SDK الأخرى. (ينبغي أن يُطرح إصدار Expo Go رقم 55 في App Store قريباً جداً.)

إذا ثبّتّ Expo Go من متجر التطبيقات، فمن المستحسن تعطيل التحديثات التلقائية للتطبيق في المتجر، لأن التحديثات قد تكسر التوافق. ولأسهل إعداد، أبقِ جهازك المحمول على الشبكة المحلية نفسها (مثل شبكة Wi-Fi نفسها) التي يستخدمها حاسوب التطوير.

بعد ذلك، إذا لم تكن أدوات تطوير Expo تعمل بالفعل، فشغّلها بتنفيذ <code>npm start</code>. وينبغي أن ترى رمز QR في بداية مخرجات الأمر. افتح التطبيق بمسح رمز QR في Expo Go. وسيبدأ Expo Go ببناء حزمة JavaScript، وبعد انتهائه ينبغي أن ترى تطبيقك. والآن، في كل مرة تريد فيها إعادة فتح تطبيقك في Expo Go، ينبغي أن تتمكن من الوصول إلى التطبيق دون مسح رمز QR بالضغط عليه في قائمة <em>المفتوحة مؤخراً</em> في عرض <em>المشاريع</em>.

إذا لم يتمكن هاتفك من الاتصال بخادم التطوير، يمكنك محاولة تشغيل Expo CLI بالأمر:

```bash
npx expo start --tunnel
```

في هذا الوضع، لا تحتاج أجهزتك إلى أن تكون على الشبكة المحلية نفسها، بل يُوجَّه الاتصال عبر الإنترنت بدلاً من ذلك. وقد يساعد ذلك في تجاوز مشكلات متنوعة متعلقة بجدار الحماية وإعدادات الشبكة. غير أن Expo Go قد يعمل ببطء أكبر لأن الشيفرة والحزم تُجلب الآن عبر النفق.

<div class="tasks">

**1. تهيئة التطبيق**

</div>

## ESLint

الآن بعد أن أصبحنا ملمّين إلى حد ما ببيئة التطوير، لنعزّز تجربة التطوير لدينا أكثر بإعداد مدقّق شيفرة. سنستخدم&nbsp;<a href="https://eslint.org/" target="_blank" rel="noreferrer noopener">ESLint</a>&nbsp;المألوف لنا من الأجزاء السابقة. لنُعدّ ESLint بالأمر:

```bash
npx expo lint
```

سيثبّت الأمر الاعتماديات اللازمة وينشئ ملف <em>eslint.config.js</em> في جذر المشروع. كما يضيف تلقائياً سكربت <code>lint</code> إلى ملف <em>package.json</em>:

```
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"  }, // HIGHLIGHT LINE
```

يبدو ملف&nbsp;<em>eslint.config.js</em>&nbsp;كما يلي:

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);
```

الملف قصير، لكنه يتضمن أهم قواعد ESLint لمشروع React Native. و<em>eslint-config-expo/flat</em> إعداد مسبق شامل يوفّر تلقائياً قواعد ESLint الأساسية وقواعد React وقواعد React Native وأفضل الممارسات الخاصة بـ Expo.

بعد الإعداد الأولي، يمكنك تدقيق شيفرتك بتشغيل:

```bash
npm run lint
```

يمكنك أيضاً دمج ESLint مع محرّرك. وفي Visual Studio Code، يمكنك فعل ذلك بالانتقال إلى قسم الإضافات والتأكد من أن إضافة ESLint مثبّتة ومفعّلة:

![إضافات ESLint في Visual Studio Code](/images/mooc/cdc3b63d08c5.webp)

إعداد ESLint المقدَّم مجرد نقطة بداية. فلا تتردد في تعديله وإضافة قواعدك الخاصة إن رغبت في ذلك.

<div class="tasks">

**2. إعداد ESLint**

</div>

## تصحيح الأخطاء

عندما لا يعمل تطبيقنا كما هو مقصود، ينبغي أن نبدأ فوراً&nbsp;<em>تصحيح الأخطاء</em>. وعملياً، يعني ذلك أننا سنحتاج إلى إعادة إنتاج السلوك الخاطئ ومراقبة تنفيذ الشيفرة لمعرفة أي جزء من الشيفرة يتصرف بشكل غير صحيح. خلال الدورة، قمنا بالفعل بالكثير من تصحيح الأخطاء عبر تسجيل الرسائل وفحص حركة الشبكة واستخدام أدوات تطوير مخصصة مثل&nbsp;<em>React Developer Tools</em>. وبشكل عام، لا يختلف تصحيح الأخطاء كثيراً في React Native، إذ نحتاج فقط إلى الأدوات المناسبة للمهمة.

تظهر رسائل console.log القديمة الجيدة في سطر أوامر Expo CLI:

![تظهر رسائل console log في سطر أوامر Expo CLI](/images/mooc/7a9506957f8d.webp)

وقد يكون ذلك كافياً في معظم الحالات، لكننا نحتاج أحياناً إلى أكثر من ذلك.

يوفّر React Native <a href="https://docs.expo.dev/debugging/tools/#developer-menu" target="_blank" rel="noreferrer noopener"><strong>قائمة مطوّر داخل التطبيق</strong></a> تقدّم عدة خيارات لتصحيح الأخطاء وتتيح لك القيام بأشياء مثل إعادة تحميل التطبيق. ويمكنك تفعيل <em>مفتش العناصر</em> (Element Inspector) الذي يعرض طبقة علوية لفحص عناصر واجهة المستخدم وتخطيطها. ومن الخيارات المفيدة أيضاً <em>مراقب الأداء</em> (Performance Monitor)، وهو طبقة علوية داخل التطبيق تعرض مقاييس أداء أساسية مثل معدل الإطارات ونشاط خيط JavaScript/الواجهة.

<a href="https://reactnative.dev/docs/react-native-devtools" target="_blank" rel="noreferrer noopener"><strong>React Native DevTools</strong></a>&nbsp;أداة قوية لتصحيح أخطاء تطبيقك. وهي تقدّم مجموعة من ميزات تصحيح الأخطاء مشابهة لميزات DevTools في Chrome، وتتضمن أيضاً الميزات نفسها الموجودة في&nbsp;<em>React DevTools</em>&nbsp;التي استخدمناها سابقاً كإضافة في متصفح Chrome.

عندما يعمل التطبيق في محاكٍ أو على هاتفك عبر Expo Go، يمكنك فتح React Native DevTools من Expo CLI بالضغط على <code>j</code>. وستُفتح DevTools في نافذة متصفح:

![عرض React Native DevTools](/images/mooc/2e287cba0a24.webp)

يمكنك استخدام DevTools لفحص حالة المكوّن وprops وكذلك <em>تغييرها</em>. جرّب العثور على مكوّن <code>Text</code> الذي يعرضه مكوّن <code>App</code> باستخدام DevTools. ويمكنك إما استخدام البحث أو التنقل عبر شجرة المكوّنات. وبمجرد أن تجد مكوّن <code>Text</code><em> </em>في الشجرة، انقر عليه وغيّر قيمة خاصية <code>children</code>. وينبغي أن يكون التغيير مرئياً تلقائياً في معاينة التطبيق.

يمكنك قراءة المزيد عن خيارات تصحيح الأخطاء المختلفة في React Native في <a href="https://docs.expo.dev/debugging/tools/" target="_blank" rel="noreferrer noopener">وثائق تصحيح الأخطاء</a> لدى Expo.
