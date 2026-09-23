---
part: 7
letter: c
title: "داخلية Vite وesbuild"
mainImage: /images/part-7.svg
lang: ar
---
في الأيام الأولى، اشتهر React نوعاً ما بأن تهيئة الأدوات اللازمة لتطوير التطبيقات كانت بالغة الصعوبة. ولتسهيل الأمر طُوِّر <a href="https://github.com/facebookincubator/create-react-app" target="_blank" rel="noopener">Create React App</a> الذي أزال المشكلات المتعلقة بالتهيئة. ومنذ ذلك الحين حلّ <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a>، المستخدم في هذا المقرر، محل Create React App كأداة معيارية لتطبيقات React الجديدة.

يستخدم كل من Vite وCreate React App&nbsp;<em>أدوات تجميع الحزم</em> (bundlers)&nbsp;للقيام بالعمل الفعلي. في هذا القسم سنلقي نظرة أقرب على ما تفعله أدوات تجميع الحزم فعلاً، وكيف يعمل Vite في الخلفية، وكيف نُهيّئه لسيناريوهات مختلفة. سنفحص أيضاً بإيجاز&nbsp;<a href="https://esbuild.github.io/" target="_blank" rel="noopener">esbuild</a>، وهي أداة تجميع منخفضة المستوى يستخدمها Vite داخلياً؛ وفهم esbuild يساعد في توضيح ما يعنيه تجميع الحزم جوهرياً.

> ماذا عن Webpack؟
>
> كان Webpack أداة تجميع الحزم المهيمنة في معظم سنوات العقد 2010، ولا يزال يُصادف في قواعد الشيفرة القديمة وفي المؤسسات. غطّى هذا المقرر أيضاً Webpack حتى ربيع 2026.
>
> إذا كنت تعمل على مشروع قديم، فمن المفيد أن تعرف أن Webpack موجود ويستخدم المفاهيم الجوهرية نفسها (نقاط الدخول، والمحمّلات/الإضافات، والمخرجات). ومع ذلك، لا يُنصح بإعداد مشروع جديد باستخدام Webpack في 2026. فتهيئته معقدة، والأدوات الحديثة مثل Vite تقدم تجربة مطوّر أفضل بكثير. لن نغطي تهيئة Webpack في هذا المقرر.

### تجميع الحزم

لقد نفّذنا تطبيقاتنا بتقسيم شيفرتنا إلى وحدات منفصلة&nbsp;<em>تُستورَد</em>&nbsp;إلى المواضع التي تحتاجها. ورغم أن وحدات ES6 معرّفة في معيار ECMAScript، فإنه ليست كل بيئات التنفيذ تتعامل تلقائياً مع الشيفرة القائمة على الوحدات. حتى المتصفحات الحديثة تستفيد من معالجة الاعتماديات مسبقاً وتحسينها قبل توصيلها.

ولهذا السبب، تُجمَّع الشيفرة المقسمة إلى وحدات&nbsp;<em>للإنتاج</em>، أي أن ملفات الشيفرة المصدرية تُحوَّل وتُدمج في مجموعة محسّنة من الملفات يمكن للمتصفح تحميلها بكفاءة. عندما شغّلنا&nbsp;<em>npm run build</em>&nbsp;في الأجزاء السابقة من هذا المقرر، قام Vite بعملية التجميع هذه. تظهر المخرجات في مجلد&nbsp;<em>dist</em>:

```
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

يحمّل ملف&nbsp;<em>index.html</em>&nbsp;في الجذر ملف JavaScript المجمّع عبر وسم&nbsp;<em>script</em>:

```
&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" type="image/svg+xml" href="/vite.svg" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;Vite + React&lt;/title&gt;
    // BEGIN HIGHLIGHT
    &lt;script type="module" crossorigin src="/assets/index-e92ae01e.js"&gt;&lt;/script&gt;
    // END HIGHLIGHT
    // BEGIN HIGHLIGHT
    &lt;link rel="stylesheet" href="/assets/index-d526a0c5.css"&gt;
    // END HIGHLIGHT
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

تُجمَّع CSS أيضاً في ملف واحد.

عملياً، يبدأ تجميع الحزم من نقطة دخول (entry point)، وهي عادةً&nbsp;<em>main.jsx</em>. لا يضم Vite الشيفرة من نقطة الدخول فحسب، بل أيضاً كل ما تستورده، بشكل متكرر، حتى تُحلّ كامل شبكة الاعتماديات.

ولأن جزءاً من الملفات المستوردة عبارة عن حزم مثل React وReact-router وAxios، فإن ملف JavaScript المجمّع سيحتوي أيضاً على محتويات كل من هذه المكتبات.

> قبل توفر أدوات تجميع الحزم، كان الأسلوب القديم يعتمد على أن ملف index.html يحمّل كل ملفات JavaScript المنفصلة للتطبيق بمساعدة وسوم script. أدى ذلك إلى تراجع الأداء، لأن تحميل كل ملف منفصل يسبب بعض التكلفة الإضافية. ولهذا السبب، فإن الطريقة المفضلة اليوم هي تجميع الشيفرة في ملف واحد. كما يتيح تجميع الحزم تحسينات مثل التصغير (minification) وtree-shaking (إزالة الشيفرة غير المستخدمة).

### كيف يعمل Vite

لـ Vite وضعا تشغيل مختلفان يعملان بطريقتين مختلفتين تماماً.

<strong>وضع التطوير</strong>&nbsp;(<em>npm run dev</em>) لا يجمّع شيفرتك إطلاقاً. بدلاً من ذلك، يشغّل Vite خادم تطوير يقدّم ملفاتك المصدرية كوحدات ES أصلية، تاركاً للمتصفح حلّ الاستيرادات مباشرة. ولهذا يكون بدء التشغيل فورياً تقريباً بصرف النظر عن حجم المشروع. هناك استثناء واحد: اعتماديات الطرف الثالث من node_modules تُجمَّع مسبقاً بواسطة esbuild قبل تشغيل الخادم. يعالج هذا مشكلتين: كثير من حزم npm لا تزال بصيغة CommonJS (التي لا تستطيع المتصفحات استهلاكها أصلياً)، وبعض المكتبات تتكون من مئات الملفات الداخلية الصغيرة التي قد تتسبب لولا ذلك في مئات الطلبات المنفصلة. يحوّلها esbuild ويدمجها، ويخزّن النتيجة مؤقتاً على القرص، فتصبح عمليات التشغيل اللاحقة فورية تقريباً.

<strong>وضع الإنتاج</strong> (<em>npm run build</em>) يستخدم <a href="https://rollupjs.org/" target="_blank" rel="noopener">Rollup</a> لتجميع الحزم، بينما يظل <a href="https://esbuild.github.io/" data-type="link" data-id="https://esbuild.github.io/">esbuild</a> يتولى مهام أخرى مثل التحويل (transpilation) (JSX وTypeScript) والتصغير. صُمّم Rollup من الأساس لوحدات ES، مما يجعله بارعاً استثنائياً في <em>tree-shaking</em> وهي تقنية تحلل بشكل ساكن أي الصادرات من كل وحدة تُستخدم فعلاً وتزيل الباقي من الحزمة النهائية. مثلاً، إذا استوردت دالة مساعدة واحدة فقط من مكتبة كبيرة، يضمن tree-shaking ألا تُضمَّن بقية شيفرة تلك المكتبة في الحزمة. وهذا يمكن أن يقلل حجم الحزمة بشكل كبير.

تقسيم العمل، esbuild للسرعة وRollup لجودة الحزمة، أمر جوهري في تصميم Vite.

> قد تتساءل لماذا لا يستخدم Vite أداة esbuild أيضاً لتجميع حزم الإنتاج، نظراً لسرعته الكبيرة. السبب هو أن مخرجات تجميع esbuild، رغم صحتها، تنتج نتائج أقل تحسيناً في السيناريوهات المتقدمة: فدعمه لتقسيم الشيفرة محدود، ولا ينتج المستوى نفسه من تحسين القطع (chunks)، ولا يزال نظامه البيئي من الإضافات الخاص بالتحويلات على مستوى الحزمة في طور النضوج. مخرجات Rollup أكثر قابلية للتنبؤ وأفضل ضبطاً لشبكات الاعتماديات المعقدة التي تنتجها التطبيقات الحقيقية. وقد&nbsp;<a href="https://vitejs.dev/guide/why.html#why-not-bundle-with-esbuild" target="_blank" rel="noopener">صرّح</a>&nbsp;مؤلفو Vite بأنهم يعتزمون التحول إلى esbuild لتجميع حزم الإنتاج بمجرد أن تسدّ قدراته هذه الفجوة.

### فهم esbuild

لفهم ما يتضمنه تجميع الحزم جوهرياً، من المفيد العمل مع&nbsp;<a href="https://esbuild.github.io/" target="_blank" rel="noopener">esbuild</a>&nbsp;مباشرة، دون طبقة التجريد التي يضيفها Vite فوقها. لنبنِ بيئة React بسيطة من الصفر.

بعد ذلك، سننشئ تطبيق React بسيطاً بالبنية المجلدية التالية:

```
├── dist
│   └── index.html
├── src
│   ├── main.jsx
│   └── App.jsx
└── package.json
```

نبدأ بتثبيت React وreact-dom:

```bash
npm install react react-dom
```

نحتاج أيضاً إلى تثبيت esbuild:

```bash
npm install --save-dev esbuild
```

في البداية نضيف سكربتين إلى&nbsp;<em>package.json</em>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  },
  // ...
}
```

نحتاج للتطبيق إلى الملف&nbsp;<em>dist/index.html</em>&nbsp;الذي يحمّل حزمة JavaScript:

```
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;esbuild app&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
    &lt;script src="./main.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

نقطة الدخول&nbsp;<em>src/main.jsx</em>&nbsp;هي المعتادة:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(&lt;App /&gt;)
```

مكوّن التطبيق البسيط&nbsp;<em>src/App.jsx</em>&nbsp;كما يلي:

```js
import React, { useState } from 'react'

const App = () =&gt; {
  const [counter, setCounter] = useState(0)

  return (
    &lt;div&gt;
      &lt;p&gt;count: {counter}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCounter(counter + 1)}&gt;increment&lt;/ button&gt;
    &lt;/div&gt;
  )
}

export default App
```

الآن يمكننا تجميع التطبيق:

```bash
npm run build
```

المخرج هو ملف واحد&nbsp;<em>dist/main.js</em>&nbsp;يحتوي شيفرة تطبيقك مع مكتبة React مجمّعة معاً.

يمكننا الآن تشغيل التطبيق المجمّع عبر <em>npm run serve</em>. يستخدم هذا حزمة <a href="https://www.npmjs.com/package/serve" target="_blank" rel="noopener">serve</a> لبدء خادم ملفات ساكن محلي لمجلد <em>dist</em>، مما يجعل التطبيق متاحاً على <em><a href="http://localhost:3000/" target="_blank" rel="noopener">http://localhost:3000</a></em>:

![صورة توضيحية](/images/mooc/2ccdf0013182.webp)

يدعم esbuild أيضاً&nbsp;<a href="https://en.wikipedia.org/wiki/Minification_(programming)" target="_blank" rel="noopener">التصغير</a>&nbsp;عبر أعلام سطر الأوامر. يزيل التصغير المسافات البيضاء والتعليقات، ويقصّر أسماء المتغيرات، ويطبق تحسينات أخرى للحجم. ستكون الحزمة كبيرة بشكل ملحوظ لأنها تتضمن مكتبة React كاملة. يقلل التصغير حجمها بشكل كبير.

لنُمكّن التصغير الآن:

```json
{
  "scripts": {
    // BEGIN HIGHLIGHT
    "build": "esbuild src/main.jsx --bundle --minify --outfile=dist/main.js --jsx=automatic",
    // END HIGHLIGHT
    "serve": "npx serve dist"
  }
}
```

يخفض التصغير حجم الحزمة من نحو 1.1 MB إلى نحو 190 KB، وهو انخفاض كبير.

للتصغير مشكلة: إذا ألقى التطبيق خطأ أثناء التشغيل، ستشير أدوات مطوّري المتصفح إلى سطر في ملف <em>main.js</em> المصغّر، وهو أمر شبه مستحيل القراءة:

![صورة توضيحية](/images/mooc/c2c230177d6f.webp)

الحل هو&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Glossary/Source_map" target="_blank" rel="noopener">خريطة المصدر</a> (source map): ملف مرافق (<em>dist/main.js.map</em>) يسجّل كيف يقابل كل سطر من الحزمة المصغّرة الشيفرة الأصلية. عند تمكينها، يشير تتبّع المكدس إلى السطر الدقيق في&nbsp;<em>App.jsx</em>&nbsp;أو&nbsp;<em>main.jsx</em>&nbsp;بدلاً من مكان ما داخل جدار غير مقروء من الشيفرة المصغّرة.

يمكننا تمكين خرائط المصدر بإضافة العلم&nbsp;<em>--sourcemap</em>:

```json
{
  "scripts": {
    // BEGIN HIGHLIGHT
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    // END HIGHLIGHT
    "serve": "npx serve dist"
  }
}
```

الآن صار الخطأ مفهوماً:

![صورة توضيحية](/images/mooc/2443fab4a586.webp)

لاحظ أن خرائط المصدر لا تقدر بثمن أثناء التطوير وتصحيح الأخطاء، لكن قد ترغب في استبعادها من بناء إنتاجي عام. لأن خريطة المصدر تحتوي شيفرتك المصدرية الأصلية، يمكن لأي شخص يفتح أدوات مطوّري المتصفح أن يقرأ منطق تطبيقك غير المصغّر. إذا كان ذلك يقلقك، فما عليك سوى حذف العلم&nbsp;<em>--sourcemap</em>&nbsp;من أمر بناء الإنتاج.

### التحويل

إلى جانب تجميع الحزم، يؤدي esbuild مهمة جوهرية أخرى:&nbsp;<em>التحويل</em> (transpilation). يعني التحويل تحويل شيفرة مصدرية مكتوبة بصيغة من JavaScript إلى صيغة أخرى، عادةً من صيغة حديثة أو موسّعة إلى JavaScript عادي يمكن للمتصفحات تنفيذه.

تفهم المتصفحات JavaScript المعياري، لكن JSX ليس JavaScript صالحاً، ولا يمكن لأي متصفح تحليله مباشرة. عندما نكتب:

```js
const element = &lt;App /&gt;
```

يجب تحويله إلى شيء يمكن للمتصفح تشغيله:

```js
const element = React.createElement(App, null)
```

ولهذا فإن التحويل خطوة مطلوبة لأي مشروع React، وليس تحسيناً اختيارياً. ينفذه esbuild تلقائياً أثناء تجميع الحزم. مع العلم&nbsp;<em>--jsx=automatic</em>، يتعامل esbuild مع JSX دون أي أداة خارجية. في سير العمل القديم القائم على Webpack كان عليك تثبيت&nbsp;<a href="https://babeljs.io/" target="_blank" rel="noopener">Babel</a>&nbsp;والحزم المتعلقة به وتهيئتها لتحويل JSX من أجل المتصفح. مع esbuild، تُحوَّل الملفات المنتهية بـ&nbsp;<em>.jsx</em>&nbsp;مباشرة دون إعداد إضافي.

### بيئة التطوير

حتى الآن، كل تغيير يتطلب تشغيل&nbsp;<em>npm run build</em>&nbsp;وتحديث المتصفح يدوياً، وهي حلقة بطيئة سرعان ما تصبح مملة. يحل هذا <a href="https://esbuild.github.io/api/#serve" target="_blank" rel="noopener">خادم التطوير</a>&nbsp;المدمج في esbuild. أضف سكربت&nbsp;<em>dev</em>&nbsp;إلى&nbsp;<em>package.json</em>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    // BEGIN HIGHLIGHT
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch"
    // END HIGHLIGHT
  }
}
```

تشغيل&nbsp;<em>npm run dev</em>&nbsp;يفعل شيئين في آن واحد. أولاً يخبر <a href="https://esbuild.github.io/api/#watch" target="_blank" rel="noopener">--watch</a>&nbsp;esbuild بمراقبة كل ملفات المصدر المستوردة بحثاً عن تغييرات وإعادة بناء الحزمة تلقائياً كلما حُفظ أي منها. ثانياً يبدأ <a href="https://esbuild.github.io/api/#serve" target="_blank" rel="noopener">--servedir</a>&nbsp;خادم HTTP خفيفاً يقدّم محتويات مجلد&nbsp;<em>dist</em>، أي <em>index.html</em>&nbsp;وملف <em>main.js</em>&nbsp;المبني حديثاً، على&nbsp;<em><a href="http://localhost:8000/" target="_blank" rel="noopener">http://localhost:8000</a></em>.

العلم&nbsp;<em>--servedir</em>&nbsp;هو ما يجعل الجزأين يعملان معاً: بدونه، سيعيد esbuild البناء في وضع المراقبة فقط لكنه لن يقدّم أي شيء. معه، يوصّل الخادم دائماً أحدث حزمة، فلا تحتاج سوى تحديث المتصفح بعد حفظ الملف.

لاحظ أنه بخلاف خادم التطوير في Vite، لا يدعم esbuild الاستبدال الحار للوحدات. تتطلب التغييرات في شيفرتك المصدرية تحديث المتصفح يدوياً لتسري.

توضح بساطة واجهة esbuild ما تفعله أداة تجميع الحزم جوهرياً: تأخذ نقطة دخول، وتتبع كل الاستيرادات، وتنتج مخرجاً محسّناً. يبني Vite على هذه الأساس ويضيف طبقة تجربة المطوّر، خادم تطوير، والاستبدال الحار للوحدات، وإعدادات افتراضية معقولة لمشاريع React.

الآن بعد أن صارت لدينا صورة أوضح عما يتضمنه تجميع الحزم والتحويل جوهرياً، لنعد إلى Vite وننظر في كيفية تهيئته.

### تهيئة Vite

لمعظم مشاريع React، يعمل Vite دون أي تهيئة إطلاقاً. لكن عندما تحتاج فعلاً إلى تخصيص السلوك، تعدّل&nbsp;<em>vite.config.js</em>&nbsp;(أو&nbsp;<em>vite.config.ts</em>).

تبدو تهيئة Vite الدنيا لمشروع React هكذا:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

تمكّن إضافة&nbsp;<em>@vitejs/plugin-react</em>&nbsp;تحويل JSX، والتحديث السريع (الاستبدال الحار للوحدات الذي يحافظ على حالة المكوّن)، وميزات أخرى خاصة بـ React.

#### تهيئة خادم التطوير

يمكنك تهيئة منفذ خادم التطوير وإعدادات أخرى تحت المفتاح&nbsp;<em>server</em>:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,        // فتح المتصفح تلقائياً
  },
})
```

#### تمرير طلبات API عبر وسيط

عند التطوير محلياً، يعمل تطبيق React عادةً على منفذ (مثلاً 3000) بينما تعمل الواجهة الخلفية على آخر (مثلاً 3001). ستمنع سياسة الأصل نفسه في المتصفح عادةً الطلبات بينهما. يحل إعداد الوسيط في Vite هذه المشكلة دون الحاجة إلى تهيئة CORS في الواجهة الخلفية:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

مع هذه التهيئة، يُمرَّر أي طلب يرسله تطبيق React إلى&nbsp;<em>/api/notes</em>&nbsp;تلقائياً إلى&nbsp;<em><a href="http://localhost:3001/api/notes" target="_blank" rel="noopener">http://localhost:3001/api/notes</a></em>&nbsp;بواسطة خادم التطوير في Vite. لا تحتاج شيفرة واجهتك الأمامية أبداً إلى تضمين&nbsp;<em>localhost:3001</em>&nbsp;في عناوين URL أثناء التطوير.

#### متغيرات البيئة

يدعم Vite مدمجاً متغيرات البيئة باستخدام ملفات&nbsp;<em>.env</em>. هذا هو البديل الحديث لحقن الثوابت يدوياً في الحزمة.

أنشئ ملف&nbsp;<em>.env</em>&nbsp;في جذر المشروع:

```
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

وملف&nbsp;<em>.env.production</em>&nbsp;لقيم الإنتاج:

```
VITE_BACKEND_URL=https://myapp.fly.dev/api/notes
```

<strong>مهم:</strong>&nbsp;يجب أن تبدأ كل متغيرات البيئة المكشوفة للمتصفح بالبادئة&nbsp;<em>VITE_</em>. تبقى المتغيرات بدون هذه البادئة على الخادم فقط ولا تُضمَّن في الحزمة. هذا إجراء أمني متعمد لمنع تسريب الأسرار عن غير قصد.

يمكنك الوصول إلى المتغير في شيفرة تطبيقك عبر&nbsp;<em>import.meta.env</em>:

```js
const App = () =&gt; {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    &lt;div&gt;
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    &lt;/div&gt;
  )
}
```

يختار Vite تلقائياً ملف&nbsp;<em>.env</em>&nbsp;الصحيح بناءً على الوضع:
- <em>npm run dev</em> يستخدم <em>.env</em> و<em>.env.development</em>
- <em>npm run build</em> يستخدم <em>.env</em> و<em>.env.production</em>

أضف&nbsp;<em>.env.production</em>&nbsp;إلى&nbsp;<em>.gitignore</em>&nbsp;إذا كان يحتوي قيماً حساسة، واستخدم&nbsp;<em>.env.example</em>&nbsp;لتوثيق المتغيرات المطلوبة.

#### التحويل

يتولى Vite تحويل الشيفرة تلقائياً. أثناء التطوير، يحوّل esbuild ملفات TypeScript وJSX عند الطلب. إنه سريع بما يكفي لفعل ذلك لكل ملف دون تأخير ملحوظ. أثناء عمليات بناء الإنتاج، يتولى Rollup تجميع الحزم بينما يتولى esbuild التحويل.

الهدف الافتراضي للتحويل في Vite هو المتصفحات الحديثة التي تدعم وحدات ES الأصلية (Chrome 87+، Firefox 78+، Safari 14+، Edge 88+). إذا كنت تحتاج إلى دعم متصفحات أقدم، يمكنك تهيئة الهدف صراحةً وإضافة إضافة&nbsp;<em>@vitejs/plugin-legacy</em>:

```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

تنشئ إضافة legacy تلقائياً حزمة منفصلة للمتصفحات الأقدم باستخدام Babel.

#### CSS

يتعامل Vite مع CSS دون أي تهيئة. ما عليك سوى استيراد ملف CSS من JavaScript:

```js
import './index.css'
```

سيعالجه Vite ويضمّنه في البناء. في الإنتاج، تُستخرج CSS إلى ملف منفصل. أثناء التطوير، تُحقن عبر وسوم&nbsp;<em>&lt;style&gt;</em>&nbsp;مع دعم إعادة التحميل الحار.

يدعم Vite أيضاً أصلياً&nbsp;<a href="https://github.com/css-modules/css-modules" target="_blank" rel="noopener">وحدات CSS</a>&nbsp;للأنماط محدودة النطاق. يُعامل أي ملف ينتهي بـ&nbsp;<em>.module.css</em>&nbsp;كوحدة CSS:

```js
import styles from './App.module.css'

const App = () =&gt; (
  &lt;div className={styles.container}&gt;
    hello vite
  &lt;/div&gt;
)
```

يمكن إضافة معالجات CSS المسبقة مثل&nbsp;<a href="https://sass-lang.com/" target="_blank" rel="noopener">Sass</a>&nbsp;بمجرد تثبيت المعالج المسبق، دون إضافة أو تهيئة:

```bash
npm install --save-dev sass
```

بعد ذلك، تعمل ملفات&nbsp;<em>.scss</em>&nbsp;تلقائياً.

#### التصغير

عند تشغيل&nbsp;<em>npm run build</em>، يصغّر Vite المخرجات. يزيل التصغير المسافات البيضاء والتعليقات، ويقصّر أسماء المتغيرات، ويطبق تحسينات أخرى للحجم. النتيجة ملف أصغر بكثير يُحمَّل أسرع في المتصفح.

يستخدم Vite أداة esbuild لتصغير JavaScript ومصغّر CSS مدمجاً لأوراق الأنماط.

#### خرائط المصدر

تسمح خرائط المصدر لأدوات مطوّري المتصفح بإرجاع الأخطاء ونقاط التوقف إلى شيفرتك المصدرية الأصلية بدلاً من الحزمة المصغّرة. بدونها، يصبح تتبّع مكدس يشير إلى السطر 1 من&nbsp;<em>main.js</em>&nbsp;شبه عديم الفائدة لتصحيح الأخطاء.

في التطوير، يولّد Vite خرائط المصدر تلقائياً. لعمليات بناء الإنتاج، يمكنك تمكينها صراحةً:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

لاحظ أن خرائط مصدر الإنتاج تزيد وقت البناء وتكشف شيفرتك المصدرية لأي شخص ينظر إلى تبويب الشبكة. في كثير من الحالات يكون من الأفضل رفع خرائط المصدر إلى خدمة مراقبة الأخطاء (مثل Sentry) وإبقاؤها خارج الخادم العام.

#### الإضافات

تُوسَّع وظائف Vite عبر&nbsp;<a href="https://vite.dev/plugins/" target="_blank" rel="noopener">الإضافات</a>. نما نظام الإضافات البيئي بسرعة ويغطي معظم الاحتياجات الشائعة. من الإضافات المستخدمة على نطاق واسع:
- <em>@vitejs/plugin-react</em> — دعم React (JSX، التحديث السريع)
- <em>@vitejs/plugin-legacy</em> — دعم المتصفحات القديمة
- <em>vite-plugin-svgr</em> — استيراد ملفات SVG كمكوّنات React
- <em>rollup-plugin-visualizer</em> — تحليل حجم الحزمة

تُحدَّد الإضافات في مصفوفة&nbsp;<em>plugins</em>&nbsp;في&nbsp;<em>vite.config.js</em>. وهي تتبع الواجهة نفسها التي تتبعها إضافات Rollup، لذا تعمل كثير من إضافات Rollup أيضاً مع Vite.

#### الحشوات التعويضية

الحشوة التعويضية (polyfill) هي شيفرة تنفّذ ميزة للمتصفحات التي لا تدعمها أصلياً. لا يكفي التحويل وحده للميزات الصحيحة نحوياً لكن غير المنفَّذة. مثلاً، قد يحلل متصفح أقدم <em>Promise</em> بشكل صحيح لكن ليس لديه تنفيذ له.

مع Vite، تتولى الإضافة&nbsp;<em>@vitejs/plugin-legacy</em> الحشوات التعويضية، إذ تضمّن تلقائياً الحشوات اللازمة بناءً على أهداف المتصفحات لديك. إذا احتجت حشوة تعويضية محددة دون إضافة legacy، يمكنك تثبيتها مباشرة واستيرادها في أعلى ملف الدخول.

يمكنك التحقق من دعم المتصفحات لواجهات API محددة على&nbsp;<a href="https://caniuse.com/" target="_blank" rel="noopener">https://caniuse.com</a>&nbsp;أو&nbsp;<a href="https://developer.mozilla.org/" target="_blank" rel="noopener">توثيق MDN من Mozilla</a>.
