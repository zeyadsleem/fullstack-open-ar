---
part: 9
letter: d
title: "كتابة تطبيق Express بالأنواع"
mainImage: /images/part-9.svg
lang: ar
---
بعد أن صار لدينا فهم أساسي لكيفية عمل TypeScript وكيفية إنشاء مشاريع صغيرة به، حان الوقت لنبدأ بإنشاء شيء مفيد. سننشئ الآن مشروعاً جديداً يقدّم حالات استخدام أكثر واقعية بعض الشيء.

هناك تغيير جوهري عن الجزء السابق وهو أننا <em>لن نستخدم ts-node بعد الآن</em>. فهي أداة عملية تساعدك على البدء، لكن على المدى الطويل يُستحسن استخدام مترجم TypeScript الرسمي الذي يأتي مع حزمة npm ‏<em>typescript</em>. يولّد المترجم الرسمي ملفات JavaScript من ملفات .ts ويحزمها، بحيث لا تحتوي <em>نسخة الإنتاج</em> المبنية على أي شيفرة TypeScript بعد الآن. هذه هي النتيجة التي نصبو إليها بالضبط، لأن TypeScript نفسه غير قابل للتنفيذ في المتصفحات أو Node.

### تهيئة المشروع

سننشئ مشروعاً من أجل Ilari، الذي يحب <a href="https://www.youtube.com/watch?v=4CY_s_FxCa0" data-type="link" data-id="https://www.youtube.com/watch?v=4CY_s_FxCa0">قيادة الطائرات الصغيرة</a> لكنه يجد صعوبة في إدارة سجل رحلاته الجوية. هو مبرمج بنفسه، لذا لا يحتاج بالضرورة إلى واجهة مستخدم، لكنه يرغب في استخدام برنامج مخصّص يعمل عبر طلبات HTTP مع إبقاء إمكانية إضافة واجهة مستخدم قائمة على الويب إلى التطبيق لاحقاً.

لنبدأ بإنشاء أول مشروع حقيقي لنا:&nbsp;<em>مذكرات رحلات Ilari الجوية</em>. كالمعتاد، نفّذ&nbsp;<em>npm init</em>&nbsp;وثبّت حزمة&nbsp;<em>typescript</em>&nbsp;كاعتمادية تطوير.

```bash
 npm install typescript --save-dev
```

لنجرِ أيضاً التعديلات المطلوبة في <em>package.json</em>:

```json
{
  // ..
  "type": "module", // HIGHLIGHT LINE
  "scripts": {
    "tsc": "tsc"
  },
  // ..
}
```

يمكننا الآن تهيئة إعدادات tsconfig.json بتشغيل:

```bash
 npm run tsc -- --init
```

> <strong>لاحظ</strong> الشرطتين الإضافيتين <em>--</em> قبل الوسيط الفعلي! تُفسَّر الوسائط قبل <em>--</em> على أنها خاصة بأمر <em>npm</em>، أما التي بعدها فتكون مخصصة للأمر الذي يُشغَّل عبر السكربت (أي <em>tsc</em> في هذه الحالة).

يحتوي ملف <em>tsconfig.json</em> الذي أنشأناه للتو على قائمة طويلة بكل إعداد متاح لنا. غير أن معظمها معلّق. قد تساعدك دراسة هذا الملف في العثور على بعض خيارات الإعداد التي قد تحتاجها. ولا بأس إطلاقاً في إبقاء الأسطر المعلّقة، في حال احتجتها يوماً ما.

في الوقت الحالي، نريد تفعيل ما يلي:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "strict" : true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

لنتناول كل إعداد على حدة:

يضبط <em>target: "esnext"</em> أن يُترجم TypeScript إلى أحدث ميزات JavaScript. ستستخدم الشيفرة المترجمة صيغة JavaScript الأحدث. ولأننا نستخدم Node الإصدار 24، فنحن في الواقع لا نترجم الشيفرة، لذا لا يهم الهدف كثيراً.

أما <em>noEmit: true</em> فمألوف لدينا، فهو يخبر المترجم بالقيام بفحص الأنواع فقط دون توليد الشيفرة المترجمة.

يخبر <em>module: "nodenext"</em> TypeScript باستخدام آلية حلّ الوحدات الأصلية في Node.js لوحدات ESM (وحدات ES). عملياً، يعني هذا أنه يمكننا استخدام صيغة <em>import</em> في استيراد الوحدات.

يتيح <em>esModuleInterop: true</em> التوافق بين أنماط استيراد وحدات CommonJS وES modules في TypeScript.

بدونه، يتطلب استيراد وحدة CommonJS كتابة <code>import * as express from 'express';</code>

ومعه، يمكنك استخدام <code>import express from 'express';</code>

يتيح <em>allowImportingTsExtensions: true</em> استيراد ملفات TypeScript مباشرةً، وهذا ضروري عندما نشغّل الشيفرة بـNode.js

<em>strict : true</em> هو اختصار لعدة خيارات منفصلة:
- noImplicitAny
- noImplicitThis
- alwaysStrict
- strictBindCallApply
- strictNullChecks
- strictFunctionTypes
- strictPropertyInitialization

إنها توجّه أسلوب كتابتنا للشيفرة نحو استخدام ميزات TypeScript بصرامة أكبر. وربما أهمها بالنسبة لنا هو&nbsp;<a href="https://www.staging-typescript.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>&nbsp;المألوف سابقاً. فهو يمنع ضبط النوع&nbsp;<em>any</em>&nbsp;ضمنياً، وهو ما قد يحدث مثلاً إذا لم تحدّد أنواع معاملات دالة. يمكن العثور على تفاصيل بقية الإعدادات في&nbsp;<a href="https://www.staging-typescript.org/tsconfig#strict" target="_blank" rel="noreferrer noopener">توثيق tsconfig</a>. ويوصي التوثيق الرسمي باستخدام&nbsp;<em>strict</em>.
- <em>noUnusedLocals</em> يمنع وجود متغيرات محلية غير مستخدمة، و<em>noUnusedParameters</em> يرمي خطأً إذا احتوت دالة على معاملات غير مستخدمة.
- <em>noImplicitReturns</em> يفحص كل مسارات الشيفرة في الدالة للتأكد من أنها تُرجع قيمة.
- <em>noFallthroughCasesInSwitch</em> يضمن أن كل حالة في <em>switch case</em> تنتهي إما بعبارة <em>return</em> أو <em>break</em>.
- <em>esModuleInterop</em> يتيح التشغيل البيني بين CommonJS وES Modules

انظر المزيد في&nbsp;<a href="https://www.staging-typescript.org/tsconfig#esModuleInterop" target="_blank" rel="noreferrer noopener">التوثيق</a>.

بعد أن ضبطنا إعداداتنا، يمكننا المتابعة بتثبيت&nbsp;<em>express</em>&nbsp;وبالطبع أيضاً&nbsp;<em>@types/express</em>. ولأن هذا مشروع حقيقي يُقصد به أن ينمو مع الوقت، سنستخدم ESlint منذ البداية:

```bash
npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express
```

الآن يجب أن يبدو ملف&nbsp;<em>package.json</em>&nbsp;لدينا هكذا:

```json
{
  "name": "flights",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "tsc": "tsc"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@stylistic/eslint-plugin": "^5.10.0",
    "@types/express": "^5.0.6",
    "eslint": "^10.1.0",
    "typescript": "^6.0.2",
    "typescript-eslint": "^8.57.2"
  },
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

ننشئ أيضاً ملف&nbsp;<em>eslint.config.mjs</em>&nbsp;بالمحتوى التالي:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
  },
});

```

الآن نحتاج فقط إلى تهيئة بيئة التطوير لدينا، ونكون جاهزين لبدء كتابة شيفرة جدّية.

سنختار الخيار نفسه كما في السابق، ونشغّل <em>tsc</em> و<em>node --watch</em> بالتوازي. لنثبّت أولاً <a href="https://www.npmjs.com/package/concurrently">concurrently</a>:

```bash
npm install --save-dev concurrently
```

نعرّف أخيراً بضعة سكربتات npm إضافية، وها نحن جاهزون للبدء:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
// BEGIN HIGHLIGHT
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
    "start": "node index.ts",
    "lint": "eslint ."
// END HIGHLIGHT
  },
  // ...
}
```

عرّفنا أيضاً السكربت <code>npm start</code> لتشغيل نسخة الإنتاج من التطبيق.

كما ترى، هناك الكثير من الأمور التي يجب المرور بها قبل البدء بالبرمجة الفعلية. عندما تعمل على مشروع حقيقي، فإن التحضير المتأني يدعم عملية تطويرك. خذ الوقت اللازم لإنشاء إعداد جيد لك ولفريقك، حتى يسير كل شيء بسلاسة على المدى الطويل.

### ليكن هناك شيفرة

الآن يمكننا أخيراً البدء بالبرمجة! كالعادة، نبدأ بإنشاء نقطة نهاية ping، فقط للتأكد من أن كل شيء يعمل.

محتوى ملف&nbsp;<em>index.ts</em>:

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) =&gt; {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () =&gt; {
  console.log(`Server running on port ${PORT}`);
});
```

الآن، إذا شغّلنا التطبيق بـ<code>npm run dev</code> أو <code>npm start</code> يمكننا التحقق من أن طلباً إلى <a href="http://localhost:3000/ping" target="_blank" rel="noreferrer noopener">http://localhost:3000/ping</a> يعطي الاستجابة <em>pong</em>، أي أن إعدادنا سليم!

![صورة توضيحية](/images/mooc/8a21d6787f76.webp)

الآن لدينا خط أنابيب (pipeline) أدنى عامل لتطوير مشروعنا. بمساعدة المترجم وESLint نضمن الحفاظ على جودة شيفرة جيدة. بهذه القاعدة، يمكننا البدء بإنشاء تطبيق يمكننا لاحقاً نشره في بيئة إنتاج.

### كلمات قليلة عن تشغيل TypeScript مع Node.js

كما ذُكر، يعمل دعم TypeScript المدمج في Node عبر <em>إزالة الأنواع</em>، فهو ببساطة يحذف تعليقات الأنواع (type annotations) ويشغّل JavaScript المتبقية. هذا سريع وكافٍ لمعظم شيفرة TypeScript. غير أن بعض ميزات TypeScript تتجاوز مجرد تعليقات الأنواع وتتطلب تحويلاً فعلياً للشيفرة لتعمل بشكل صحيح في وقت التشغيل.

تتيح راية <em>--experimental-transform-types</em> لـNode.js التعامل مع هذه الميزات. ومن أبرزها <a href="https://www.typescriptlang.org/docs/handbook/enums.html">Enums</a>. تُترجم TypeScript enums إلى كائنات JavaScript حقيقية. بدون التحويل، ستزيل Node صيغة enum وتترك شيفرة غير صالحة.

بدون هذه الراية، سيؤدي استخدام enum في شيفرتك إلى خطأ في وقت التشغيل، حتى وإن لم يبلّغ مدقّق أنواع TypeScript عن أي مشاكل.

رغم عدم استخدامنا أياً من هذه الميزات الآن، لنضف الراية إلى السكربتات:

```json
{<br>  // ... <br>  "scripts": {<br>    "tsc": "tsc",<br>     // BEGIN HIGHLIGHT<br>    "dev": "concurrently \"tsc --watch\" \"node --watch --experimental-transform-types index.ts\"",<br>    "start": "node --experimental-transform-types index.ts",<br>     // END HIGHLIGHT<br>    "lint": "eslint ."<br>  },<br>  // ...<br>}
```

لاحظ أن الراية موسومة بـ<em>تجريبية</em>، أي أن سلوكها قد يتغير في إصدارات Node المستقبلية. ومع نضوج دعم TypeScript الأصلي في Node، يُتوقع أن تصبح ميزات مثل تحويل enum جزءاً من السلوك الافتراضي في النهاية.

ستحصل على تحذير بشأن الطابع التجريبي:

```
(node:80296) ExperimentalWarning: Transform Types is an experimental feature and might change at any time<br>(Use `node --trace-warnings ...` to show where the warning was created)
```

يمكن إسكات التحذير بإضافة الراية <code>--disable-warning=ExperimentalWarning</code>.

<div class="tasks">

**9. الواجهة الخلفية لـPatientor، الخطوة 1**

</div>

<div class="tasks">

**10. الواجهة الخلفية لـPatientor، الخطوة 2**

</div>

### تنفيذ الوظائف

أخيراً، نحن جاهزون لبدء كتابة بعض الشيفرة.

لنبدأ من الأساسيات. يريد Ilari أن يكون قادراً على تتبّع تجاربه في رحلاته الجوية.

يريد أن يكون قادراً على حفظ&nbsp;<em>مدخلات المذكرات</em>، التي تحتوي على:
- تاريخ المدخلة
- حالة الطقس (sunny أو windy أو cloudy أو rainy أو stormy)
- مدى الرؤية (great أو good أو ok أو poor)
- نص حر يصف التجربة

حصلنا على بعض البيانات النموذجية التي سنستخدمها كقاعدة نبني عليها. البيانات محفوظة بصيغة JSON ويمكن العثور عليها&nbsp;<a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">هنا</a>.

تبدو البيانات كالتالي:

```json
[
  {
    "id": 1,
    "date": "2026-01-01",
    "weather": "rainy",
    "visibility": "poor",
    "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  {
    "id": 2,
    "date": "2026-04-01",
    "weather": "sunny",
    "visibility": "good",
    "comment": "Everything went better than expected, I'm learning much"
  },
  // ...
]
```

لنبدأ بإنشاء نقطة نهاية تُرجع جميع مدخلات مذكرات الرحلات.

أولاً، علينا اتخاذ بعض القرارات حول كيفية تنظيم شيفرتنا المصدرية. من الأفضل وضع جميع الشيفرة المصدرية تحت دليل&nbsp;<em>src</em>، حتى لا تختلط مع ملفات الإعداد. سننقل&nbsp;<em>index.ts</em>&nbsp;إلى هناك ونجري التعديلات اللازمة على سكربتات npm.

سنضع جميع&nbsp;<a href="/part4/structure_of_backend_application_introduction_to_testing" target="_blank" rel="noreferrer noopener">الموجّهات</a>&nbsp;(routers) والوحدات المسؤولة عن معالجة مجموعة موارد محددة مثل&nbsp;<em>diaries</em>، تحت دليل&nbsp;<em>src/routes</em>. هذا مختلف قليلاً عما فعلناه في&nbsp;<a href="/part4" target="_blank" rel="noreferrer noopener">الجزء 4</a>، حيث استخدمنا دليل&nbsp;<em>src/controllers</em>.

الموجّه الذي يتولى جميع نقاط نهاية المذكرات موجود في&nbsp;<em>src/routes/diaries.ts</em>&nbsp;ويبدو هكذا:

```js
import express from 'express';

const router = express.Router();

router.get('/', (_req, res) =&gt; {
  res.send('Fetching all diaries!');
});

router.post('/', (_req, res) =&gt; {
  res.send('Saving a diary!');
});

export default router;
```

سنوجّه جميع الطلبات ذات البادئة&nbsp;<em>/api/diaries</em>&nbsp;إلى ذلك الموجّه تحديداً في&nbsp;<em>index.ts</em>

```js
import express from 'express';
import diaryRouter from './routes/diaries.ts'; // HIGHLIGHT LINE
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter); // HIGHLIGHT LINE

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

والآن، إذا أرسلنا طلب HTTP GET إلى&nbsp;<a href="http://localhost:3000/api/diaries" target="_blank" rel="noreferrer noopener">http://localhost:3000/api/diaries</a>، ينبغي أن نرى الرسالة:&nbsp;<em>Fetching all diaries!</em>

بعد ذلك، علينا البدء بتقديم البيانات الأولية (الموجودة&nbsp;<a href="https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json" target="_blank" rel="noreferrer noopener">هنا</a>) من التطبيق. سنجلب البيانات ونحفظها في&nbsp;<em>data/entries.json</em>.

لن نكتب شيفرة عمليات معالجة البيانات الفعلية في الموجّه. سننشئ بدلاً من ذلك&nbsp;<em>خدمة</em>&nbsp;(service) تتولى معالجة البيانات. من الممارسات الشائعة جداً فصل «منطق الأعمال» عن شيفرة الموجّه في وحدات تُسمى غالباً&nbsp;<em>خدمات</em>. اسم service أصله من&nbsp;<a href="https://en.wikipedia.org/wiki/Domain-driven_design" target="_blank" rel="noreferrer noopener">التصميم المدفوع بالمجال</a>&nbsp;وشاع استخدامه عبر إطار عمل&nbsp;<a href="https://spring.io/" target="_blank" rel="noreferrer noopener">Spring</a>.

لننشئ دليل&nbsp;<em>src/services</em>&nbsp;ونضع فيه ملف&nbsp;<em>diaryService.ts</em>. يحتوي الملف على دالتين لجلب مدخلات المذكرات وحفظها:

```js
import diaryData from '../../data/entries.json';

const getEntries = () =&gt; {
  return diaryData;
};

const addDiary = () =&gt; {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

لكن هناك شيء غير صحيح:

![صورة توضيحية](/images/mooc/35e3e4a798db.webp)

لحسن الحظ، هناك حل سهل، فقط غيّر الاستيراد كما يلي:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
```

هذا مطلوب لأنه إذا كنت تستورد شيئاً غير الشيفرة، يحتاج Node.js إلى معرفة نوع الملف الذي تستورده. بدون هذه الإشارة، يرى ملف <em>.json</em> ولا يعرف ما إذا كان عليه التعامل معه كشيفرة أو كبيانات، فيرمي خطأً.

لنضمن الآن عمل الوظائف من الطرف إلى الطرف، ولنربط الموجّه بالخدمة:

```js
import express from 'express';<br>import diaryService from '../services/diaryService.ts'; // HIGHLIGHT LINE<br><br>const router = express.Router();<br><br>router.get('/', (_req, res) => {<br>  // BEGIN HIGHLIGHT<br>  const data = diaryService.getEntries()<br>  res.send(data);<br>  // END HIGHLIGHT<br>});<br><br>router.post('/', (_req, res) => {<br>  res.send("add a new diary");<br>});<br><br>export default router;
```

وبالفعل، نرى المذكرات في نقطة النهاية:

![صورة توضيحية](/images/mooc/ca4ce04c0f96.webp)

### تعريف الأنواع

رأينا سابقاً كيف يستطيع المترجم تحديد نوع متغير من القيمة المُسندة إليه. وبالمثل، يمكن للمترجم تفسير مجموعات بيانات كبيرة مكوّنة من كائنات ومصفوفات:

![صورة توضيحية](/images/mooc/0f5ba8636b7a.webp)

نتيجة لذلك، يحذّرنا المترجم إذا حاولنا فعل شيء مثير للشك ببيانات JSON التي نتعامل معها. مثلاً، إذا كنا نتعامل مع مصفوفة تحتوي كائنات من نوع معيّن، وحاولنا إضافة كائن لا يملك كل الحقول التي تملكها الكائنات الأخرى، أو به تعارضات في الأنواع (مثلاً، عدد حيث ينبغي أن يكون نصاً)، يستطيع المترجم أن يعطينا تحذيراً.

رغم أن المترجم جيد جداً في التأكد من عدم قيامنا بأي شيء غير مرغوب، إلا أنه أكثر أماناً أن نعرّف أنواع البيانات بأنفسنا.

حالياً، لدينا تطبيق Express بلغة TypeScript عامل بشكل أساسي، لكن لا تكاد توجد&nbsp;<em>أنواع</em>&nbsp;فعلية في الشيفرة. ولأننا نعرف نوع البيانات التي ينبغي قبولها في حقلَي&nbsp;<em>weather</em>&nbsp;و<em>visibility</em>، فلا سبب يمنعنا من تضمين أنواعهما في الشيفرة.

لننشئ ملفاً لأنواعنا،&nbsp;<em>types.ts</em>، نعرّف فيه جميع أنواعنا لهذا المشروع.

أولاً، لنكتب أنواع قيم&nbsp;<em>Weather</em>&nbsp;و<em>Visibility</em>&nbsp;باستخدام&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" target="_blank" rel="noreferrer noopener">نوع اتحادي</a>&nbsp;(union type) من النصوص المسموح بها:

```ts
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

ومن هناك، يمكننا المتابعة بإنشاء نوع DiaryEntry، الذي سيكون&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">واجهة</a>&nbsp;(interface):

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

يمكننا الآن محاولة كتابة نوع JSON المستورد:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
import type { DiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

const diaries: DiaryEntry[] = diaryData; // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const getEntries = (): DiaryEntry[]  => {
  return diaries;
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

لكن بما أن قيم JSON معلنة مسبقاً، فإن إسناد نوع لمجموعة البيانات يؤدي إلى خطأ:

![صورة توضيحية](/images/mooc/91423407b18a.webp)

تكشف نهاية رسالة الخطأ عن المشكلة: حقول&nbsp;<em>weather</em>&nbsp;غير متوافقة. في&nbsp;<em>DiaryEntry</em>&nbsp;حدّدنا أن نوعه&nbsp;<em>Weather</em>، لكن مترجم TypeScript استنتج أن نوعه&nbsp;<em>string</em>.

يمكننا إصلاح المشكلة بإجراء <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noreferrer noopener">تأكيد نوع</a> (type assertion). وكما <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3#bc2e1861-1334-4a2c-a678-03f486621ce7" target="_blank" rel="noreferrer noopener">ذكرنا</a> سابقاً، ينبغي ألا يُجرى تأكيد النوع إلا إذا كنا واثقين من معرفتنا بما نفعل!

إذا أكّدنا نوع المتغير&nbsp;<em>diaryData</em>&nbsp;ليكون&nbsp;<em>DiaryEntry</em>&nbsp;بالكلمة المفتاحية&nbsp;<em>as</em>، فينبغي أن يعمل كل شيء:

```js
import diaryData from '../../data/entries.json' with { type: "json" };
import type { DiaryEntry } from '../types.ts';

const diaries: DiaryEntry[] = diaryData as DiaryEntry[]; // HIGHLIGHT LINE

const getEntries = (): DiaryEntry[]  => {
  return diaries;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

ينبغي ألا نستخدم تأكيد النوع أبداً إلا إذا لم يكن هناك طريقة أخرى للمتابعة، إذ يبقى هناك دائماً خطر تأكيد نوع غير مناسب لكائن والتسبب في خطأ تشغيل سيئ. وبينما يثق المترجم بأنك تعرف ما تفعل عند استخدام&nbsp;<em>as</em>، فإننا بهذا لا نستفيد من كامل قوة TypeScript بل نعتمد على المبرمج في تأمين الشيفرة.

في حالتنا، يمكننا تغيير طريقة تصدير بياناتنا بحيث نكتب نوعها داخل ملف البيانات. ولأننا لا نستطيع استخدام الأنواع في ملف JSON، ينبغي تحويل ملف JSON إلى ملف ts باسم <em>entries.ts</em>، يصدّر البيانات المكتوبة النوع هكذا:

```js
import type { DiaryEntry } from "../src/types.ts";
const diaryEntries: DiaryEntry[] = [
  {
      "id": 1,
      "date": "2026-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries;
```

الآن، عندما نستورد المصفوفة، يفسّرها المترجم بشكل صحيح:

```js
import diaries from '../../data/entries.ts'; // HIGHLIGHT LINE
import type { DiaryEntry } from '../types.ts';

const getEntries = (): DiaryEntry[] => {
  return diaries;
}

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  addDiary
};
```

لاحظ أنه إذا أردنا أن نكون قادرين على حفظ مدخلات دون حقل معيّن، مثل&nbsp;<em>comment</em>، يمكننا ضبط نوع الحقل&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties" target="_blank" rel="noreferrer noopener">اختيارياً</a>&nbsp;بإضافة&nbsp;<em>?</em>&nbsp;إلى تعريف النوع:

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

> <strong>import type</strong>
>
> عند استيراد نوع لا يكفي أن تكتب فحسب
>
> import { DiaryEntry } from '../types.ts';
>
> بل يجب بدلاً من ذلك إجراء <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export">استيراد الأنواع فقط</a>
>
> import type { DiaryEntry } from '../types.ts';
>
> عند تشغيل ملفات TypeScript مباشرةً بـNode.js، تُزال معلومات أنواع TypeScript في وقت التشغيل. يعني هذا أنه إذا استوردت شيئاً موجوداً كنوع فقط، مثل interface أو type alias، ولم تضع عليه <em>import type,</em> بشكل صريح، فقد يحاول وقت التشغيل حلّه كقيمة JavaScript حقيقية ويفشل.
>
> استخدام <em>import type</em> يخبر كلاً من مترجم TypeScript وتحويل وقت التشغيل بأن هذا الاستيراد موجود لأغراض فحص الأنواع فقط ويجب محوه بالكامل قبل التنفيذ.
>
> لحسن الحظ، هناك قاعدة ESLint هي <a href="https://typescript-eslint.io/rules/consistent-type-imports/">consistent-type-imports</a> تساعدنا على عدم نسيان استخدام import type. لنفعّل القاعدة في _.esling.config.mjs_:
>
> rules: {<br>    // ...<br>    "@typescript-eslint/consistent-type-imports": "error",<br>  },
>
> الآن يُنبَّهنا عند أي سهو!

### الأنواع المساعدة (Utility Types)

أحياناً، قد نرغب في استخدام تعديل معيّن على نوع ما. تخيّل مثلاً صفحة لعرض بعض البيانات، بعضها حساس وبعضها غير حساس. قد نريد التأكد من عدم استخدام أو عرض أي بيانات حساسة. يمكننا <em>اختيار</em> حقول النوع المسموح باستخدامها لفرض ذلك. ويمكننا فعل هذا باستخدام النوع المساعد&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a>.

في مشروعنا، ينبغي أن نأخذ في الحسبان أن Ilari قد يرغب في إنشاء قائمة بجميع مدخلات مذكراته&nbsp;<em>باستثناء</em>&nbsp;حقل التعليق، لأنه خلال رحلة مخيفة جداً قد ينتهي به الأمر بكتابة شيء لا يرغب بالضرورة في إظهاره لأي شخص آخر.

يتيح لنا النوع المساعد&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" target="_blank" rel="noreferrer noopener">Pick</a>&nbsp;اختيار حقول نوع موجود نريد استخدامها. يمكن استخدام Pick إما لبناء نوع جديد تماماً أو لإخبار دالة بما ينبغي أن تُرجعه في وقت التشغيل. الأنواع المساعدة نوع خاص من الأنواع، لكن يمكن استخدامها تماماً كالأنواع العادية.

في حالتنا، لإنشاء نسخة «خاضعة للرقابة» من&nbsp;<em>DiaryEntry</em>&nbsp;للعرض العام، يمكننا استخدام&nbsp;<em>Pick</em>&nbsp;في تعريف الدالة:

```js
const getNonSensitiveEntries =
  (): Pick&lt;DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'&gt;[] =&gt; {
    // ...
  }
```

وسيتوقع المترجم من الدالة أن تُرجع مصفوفة قيم من نوع&nbsp;<em>DiaryEntry</em>&nbsp;المعدّل، تشمل الحقول الأربعة المختارة فقط.

في هذه الحالة، نريد استبعاد حقل واحد فقط، لذا سيكون من الأفضل استخدام النوع المساعد&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a>&nbsp;الذي يمكننا استخدامه لتحديد الحقول المراد استبعادها:

```js
const getNonSensitiveEntries = (): Omit&lt;DiaryEntry, 'comment'&gt;[] =&gt; {
  // ...
}
```

لتحسين القراءة، ينبغي بالتأكيد تعريف&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">اسم نوع مستعار</a>&nbsp;(type alias)&nbsp;<em>NonSensitiveDiaryEntry</em>&nbsp;في ملف&nbsp;<em>types.ts</em>:

```ts
export type NonSensitiveDiaryEntry = Omit&lt;DiaryEntry, 'comment'&gt;;
```

تتغير الشيفرة هكذا:

```js
import diaries from '../../data/entries.ts';
import type { NonSensitiveDiaryEntry, DiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

// BEGIN HIGHLIGHT
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries;
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary,
  getNonSensitiveEntries // HIGHLIGHT LINE
};
```

هناك أمر مقلق في تطبيقنا. في&nbsp;<em>getNonSensitiveEntries</em>، نُعيد مدخلات المذكرات كاملة، و<em>لا يظهر أي خطأ</em>&nbsp;رغم كتابة الأنواع!

يحدث هذا لأن&nbsp;<a href="http://www.typescriptlang.org/docs/handbook/type-compatibility.html" target="_blank" rel="noreferrer noopener">TypeScript يفحص فقط</a>&nbsp;ما إذا كانت لدينا جميع الحقول المطلوبة أم لا، لكنه لا يمنع الحقول الزائدة. في حالتنا، يعني هذا أنه&nbsp;<em>غير ممنوع</em>&nbsp;إرجاع كائن من نوع&nbsp;<em>DiaryEntry[]</em>، لكن لو حاولنا الوصول إلى حقل&nbsp;<em>comment</em>&nbsp;لما أمكننا ذلك لأننا سنصل إلى حقل لا يعرفه TypeScript حتى وإن كان موجوداً.

للأسف، قد يؤدي هذا إلى سلوك غير مرغوب إذا لم تكن مدركاً لما تفعله؛ فالوضع سليم بقدر ما يهم TypeScript، لكنك على الأرجح تسمح باستخدام غير مرغوب. لو أعدنا الآن جميع مدخلات المذكرات من دالة&nbsp;<em>getNonSensitiveEntries</em>&nbsp;إلى الواجهة الأمامية، فسنكون&nbsp;<em>نسرّب الحقول غير المرغوبة إلى المتصفح الطالب</em>&nbsp;- حتى وإن بدت أنواعنا تشير إلى غير ذلك!

ولأن TypeScript لا يعدّل البيانات الفعلية بل نوعها فقط، علينا استبعاد الحقول بأنفسنا:

```js
import diaries from '../../data/entries.ts'

import type { NonSensitiveDiaryEntry, DiaryEntry } from '../types.ts'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// BEGIN HIGHLIGHT
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// END HIGHLIGHT

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

تشمل الأنواع المساعدة العديد من الأدوات العملية، ومن الجدير بلا شك أن تستغرق بعض الوقت في دراسة&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html" target="_blank" rel="noreferrer noopener">التوثيق</a>.

لنغيّر الآن المسار بحيث يُرجع بيانات المذكرات غير الحساسة فقط:

```js
import express from 'express';
import diaryService from '../services/diaryService.ts';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries()); // HIGHLIGHT LINE
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;
```

الاستجابة هي ما نتوقعه بالضبط:

![صورة توضيحية](/images/mooc/2f2af9471d6d.webp)

### كتابة أنواع الطلب والاستجابة

حتى الآن لم نناقش أي شيء عن أنواع معاملات معالج المسار.

إذا مرّرنا المؤشر مثلاً فوق المعامل <em>res</em>، نلاحظ أن نوعه هو:

```
Response&lt;any, Record&lt;string, any&gt;, number&gt;
```

يبدو غريباً بعض الشيء. النوع&nbsp;<em>Response</em>&nbsp;هو&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">نوع عام</a>&nbsp;(generic type) له ثلاثة&nbsp;<em>معاملات نوع</em>. إذا فتحنا تعريف النوع (بالنقر بزر الفأرة الأيمن واختيار&nbsp;<em>Go to Type Definition</em>&nbsp;في VS Code) نرى ما يلي:

```js
export interface Response&lt;
    ResBody = any,
    LocalsObj extends Record&lt;string, any&gt; = Record&lt;string, any&gt;,
    StatusCode extends number = number,
&gt; extends http.ServerResponse, Express.Response {
```

معامل النوع الأول هو الأكثر إثارة للاهتمام بالنسبة لنا، فهو يقابل&nbsp;<em>جسم الاستجابة</em>&nbsp;(response body) وقيمته الافتراضية&nbsp;<em>any</em>. ولهذا يقبل مترجم TypeScript أي نوع من الاستجابات ولا نحصل على أي مساعدة لجعل الاستجابة صحيحة.

يمكننا، بل وينبغي لنا على الأرجح، إعطاء نوع مناسب كمتغير النوع. في حالتنا، هو مصفوفة من مدخلات المذكرات:

```js
import express, { type Response } from 'express'; // HIGHLIGHT LINE
import type { NonSensitiveDiaryEntry } from "../types.ts";
// ...

router.get('/', (_req, res: Response&lt;NonSensitiveDiaryEntry[]>) => { // HIGHLIGHT LINE
  res.send(diaryService.getNonSensitiveEntries());
});

// ...
```

إذا حاولنا الآن الاستجابة بنوع بيانات خاطئ، نحصل على خطأ نوع

![صورة توضيحية](/images/mooc/6a230c446155.webp)

وبالمثل، فإن معامل الطلب من النوع&nbsp;<em>Request</em>&nbsp;وهو أيضاً نوع عام. سنلقي نظرة أقرب عليه لاحقاً.

<div class="tasks">

**11. الواجهة الخلفية لـPatientor، الخطوة 3**

</div>

<div class="tasks">

**12. الواجهة الخلفية لـPatientor، الخطوة 4**

</div>

### منع نتيجة undefined غير المقصودة

لنوسّع الواجهة الخلفية لدعم جلب مدخلة واحدة محددة بطلب HTTP GET إلى المسار&nbsp;<em>api/diaries/:id</em>.

يحتاج DiaryService إلى توسعة بدالة&nbsp;<em>findById</em>:

```ts
// ...

const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById // HIGHLIGHT LINE
}
```

لكن تظهر مرة أخرى مشكلة جديدة:

![صورة توضيحية](/images/mooc/99a625c21be0.webp)

المشكلة هي أنه لا يوجد ضمان بإمكانية العثور على مدخلة بالمعرّف المحدد. من الجيد أن يُنبَّهنا إلى هذه المشكلة المحتملة في مرحلة الترجمة أصلاً. بدون TypeScript لن يُحذَّرنا من هذه المشكلة، وفي أسوأ الأحوال كنا سننتهي بإرجاع كائن <em>undefined</em> بدلاً من إخبار المستخدم بأن المدخلة المحددة غير موجودة.

أولاً وقبل كل شيء، في حالات كهذه، علينا أن نقرر ما ينبغي أن تكون عليه&nbsp;<em>قيمة الإرجاع</em>&nbsp;إذا لم يُعثر على الكائن، وكيف ينبغي التعامل مع الحالة. تُرجع دالة&nbsp;<em>find</em>&nbsp;في المصفوفة القيمة&nbsp;<em>undefined</em>&nbsp;إذا لم يُعثر على الكائن، وهذا مناسب. يمكننا حل مشكلتنا بكتابة نوع قيمة الإرجاع كما يلي:

```ts
const findById = (id: number): DiaryEntry | undefined => {  // HIGHLIGHT LINE
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

معالج المسار هو التالي:

```js
import express from 'express';
import diaryService from '../services/diaryService.ts'

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

// ...

export default router;
```

### إضافة مذكرة جديدة

لنبدأ ببناء نقطة نهاية HTTP POST لإضافة مدخلات مذكرات رحلات جديدة. ينبغي أن تكون المدخلات الجديدة من النوع نفسه الذي للبيانات الموجودة.

تبدو شيفرة معالجة الاستجابة كما يلي:

```js
router.post('/', (req, res) => {<br>  const { date, weather, visibility, comment } = req.body;<br>  const addedEntry = diaryService.addDiary({    <br>    date,<br>    weather,<br>    visibility,<br>    comment,<br>  });  <br>  res.json(addedEntry);<br>})
```

إذن، تفكّك الشيفرة المعاملات من جسم الطلب (request body) وتضعها في كائن يُعطى كمعامل للدالة <em>addDiary</em> في <em>diaryService</em>.

لكن انتظر، ما نوع هذا الكائن؟ إنه ليس بالضبط&nbsp;<em>DiaryEntry</em>، لأنه ما زال يفتقد حقل&nbsp;<em>id</em>. قد يكون من المفيد إنشاء نوع جديد&nbsp;<em>NewDiaryEntry</em>&nbsp;لمدخلة لم تُحفظ بعد. لننشئه في&nbsp;<em>types.ts</em>&nbsp;باستخدام نوع&nbsp;<em>DiaryEntry</em>&nbsp;الموجود والنوع المساعد&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank" rel="noreferrer noopener">Omit</a>:

```ts
export type NewDiaryEntry = Omit&lt;DiaryEntry, 'id'&gt;;
```

الآن يمكننا استخدام النوع الجديد في <em>diaryService</em>، وتفكيك كائن المدخلة الجديدة عند إنشاء مدخلة ليتم حفظها:

```js
import type { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types';

// ...

const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

هناك الكثير من الأحمر في محررنا:

![صورة توضيحية](/images/mooc/ce8d357c45df.webp)

السبب هو قاعدة ESlint ‏<a href="https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md" target="_blank" rel="noreferrer noopener">@typescript-eslint/no-unsafe-assignment</a>&nbsp;التي تمنعنا من إسناد حقول جسم الطلب إلى متغيرات.

في الوقت الحالي، لنتجاهل قاعدة ESlint من الملف كله بإضافة السطر التالي كأول سطر في الملف:

```
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

لتحليل البيانات الواردة، يجب أن يكون وسيط&nbsp;<em>json</em>&nbsp;مهيأً:

```js
import express from 'express';
import diaryRouter from './routes/diaries.ts';
const app = express();
app.use(express.json());
const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

الآن التطبيق جاهز لاستقبال طلبات HTTP POST لمدخلات مذكرات جديدة من النوع الصحيح!

### التحقق من صحة الطلبات

هناك الكثير من الأمور التي قد تسوء عندما نقبل بيانات من مصادر خارجية. نادراً ما تعمل التطبيقات بالكامل بمفردها، ونحن مضطرون للتعايش مع حقيقة أن البيانات من مصادر خارج نظامنا لا يمكن الوثوق بها تماماً. عندما نستقبل بيانات من مصدر خارجي، لا سبيل لأن تكون مكتوبة النوع أصلاً عندما تصل إلينا. علينا اتخاذ قرارات حول كيفية التعامل مع عدم اليقين المصاحب لذلك.

قاعدة ESlint المعطّلة كانت تشير إلى أن الإسناد التالي محفوف بالمخاطر:

```js
const newDiaryEntry = diaryService.addDiary({
  date,
  weather,
  visibility,
  comment,
});
```

نودّ الحصول على ضمان بأن الكائن في طلب POST من النوع الصحيح. لنعرّف الآن دالة <em>parseNewDiaryEntry</em> تستقبل جسم الطلب كمعامل وتُرجع كائن <em>NewDiaryEntry</em> مكتوب النوع بشكل صحيح. ستُعرَّف الدالة في ملف <em>utils.ts</em>.

يستخدم تعريف المسار الدالة كما يلي:

```js
import parseNewDiaryEntry from '../utils.ts';
// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body); // HIGHLIGHT LINE
    const addedEntry = diaryService.addDiary(newDiaryEntry);   // HIGHLIGHT LINE
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})
```

يمكننا الآن أيضاً إزالة السطر الأول الذي يتجاهل قاعدة ESLint ‏<em>no-unsafe-assignment</em>.

وبما أننا نكتب الآن شيفرة آمنة ونحاول ضمان حصولنا بالضبط على البيانات التي نريدها من الطلبات، ينبغي أن نبدأ بتحليل والتحقق من صحة كل حقل نتوقع استقباله.

يبدو هيكل دالة <em>parseNewDiaryEntry</em> كالتالي:

```js
import type { NewDiaryEntry } from './types.ts';

const parseNewDiaryEntry = (object): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  };

  return newEntry;
};

export default parseNewDiaryEntry;
```

ينبغي أن تحلل الدالة كل حقل وأن تتأكد من أن قيمة الإرجاع من النوع&nbsp;<em>NewDiaryEntry</em>&nbsp;بالضبط. يعني هذا أنه يجب علينا فحص كل حقل على حدة.

مرة أخرى، لدينا مشكلة نوع: ما نوع المعامل&nbsp;<em>object</em>؟ بما أن&nbsp;<em>object</em>&nbsp;هو جسم طلب، فقد كتبه Express بالنوع&nbsp;<em>any</em>. ولأن فكرة هذه الدالة هي تحويل حقول مجهولة النوع إلى حقول بالنوع الصحيح والتحقق مما إذا كانت معرّفة كما هو متوقع، فقد تكون هذه هي الحالة النادرة التي&nbsp;<em>نريد فيها السماح بالنوع <strong>any</strong></em>.

لكن إذا كتبنا نوع الكائن كـ<em>any</em>، تشتكي ESLint من ذلك:

![صورة توضيحية](/images/mooc/1f1eac7a30f8.webp)

يمكننا تجاهل قاعدة ESlint لكن الفكرة الأفضل هي اتباع إحدى النصائح التي يعرضها المحرر في&nbsp;<em>Quick Fix</em>&nbsp;وضبط نوع المعامل على&nbsp;<em>unknown</em>:

```js
import type { NewDiaryEntry } from './types.ts';

const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default parseNewDiaryEntry;
```

<a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown" target="_blank" rel="noreferrer noopener">unknown</a>&nbsp;هو النوع الأمثل لحالتنا هذه من التحقق من صحة المدخلات، لأننا لا نحتاج بعد إلى تعريف نوع يطابق&nbsp;<em>any</em>، بل يمكننا أولاً التحقق من النوع ثم تأكيد أنه النوع المتوقع. باستخدام&nbsp;<em>unknown</em>&nbsp;لا نحتاج أيضاً للقلق بشأن قاعدة ESlint ‏<em>@typescript-eslint/no-explicit-any</em>، لأننا لا نستخدم&nbsp;<em>any</em>. غير أننا قد نحتاج مع ذلك إلى استخدام&nbsp;<em>any</em>&nbsp;في بعض الحالات التي لا نكون فيها بعد متأكدين من النوع ونحتاج إلى الوصول إلى خصائص كائن من نوع&nbsp;<em>any</em>&nbsp;للتحقق من قيم الخصائص نفسها أو فحص أنواعها.

> ملاحظة جانبية من المحرّر
>
> <em>إذا كنت مثلي وتكره أن تبقى شيفرتك في حالة معطوبة لفترة طويلة بسبب أنواع غير مكتملة، يمكنك البدء بـ«تزييف» الدالة:</em>
>
> const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
>
>  console.log(object); // الآن لم يعد object غير مستخدم
>  const newEntry: NewDiaryEntry = {
>    weather: 'cloudy', // زيِّف قيمة الإرجاع
>    visibility: 'great',
>    date: '2026-1-1',
>    comment: 'fake news'
>  };
>
>  return newEntry;
> };
>
> <em>إذن، قبل أن تصبح البيانات والأنواع الحقيقية جاهزة للاستخدام، أُعيد هنا شيئاً من النوع الصحيح بالتأكيد. تبقى الشيفرة في حالة تشغيلية طوال الوقت ويبقى ضغط دمي في مستوياته الطبيعية.</em>

### حرّاس الأنواع

لنبدأ بإنشاء المحلّلات لكل حقل من حقول المعامل&nbsp;<em>object: unknown</em>.

للتحقق من صحة حقل&nbsp;<em>comment</em>، علينا فحص وجوده والتأكد من أنه من النوع&nbsp;<em>string</em>.

ينبغي أن تبدو الدالة هكذا تقريباً:

```ts
const parseComment = (comment: unknown): string =&gt; {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

تستقبل الدالة معاملاً من نوع&nbsp;<em>unknown</em>&nbsp;وتُرجعه بالنوع&nbsp;<em>string</em>&nbsp;إذا كان موجوداً وبالنوع الصحيح.

تبدو دالة التحقق من النص كما يلي:

```js
const isString = (text: unknown): text is string =&gt; {
  return typeof text === 'string' || text instanceof String;
};
```

الدالة هي ما يُسمى&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" target="_blank" rel="noreferrer noopener">حارس نوع</a> (type guard). يعني ذلك أنها دالة تُرجع قيمة منطقية&nbsp;<em>و</em>&nbsp;لديها&nbsp;<em>مُحمَّل نوع</em>&nbsp;(type predicate) كنوع إرجاع. في حالتنا، مُحمَّل النوع هو:

```
text is string
```

الصيغة العامة لمُحمَّل النوع هي&nbsp;<em>parameterName is Type</em>&nbsp;حيث&nbsp;<em>parameterName</em>&nbsp;هو اسم معامل الدالة و<em>Type</em>&nbsp;هو النوع المستهدف.

إذا أعادت دالة حارس النوع القيمة true، يعرف مترجم TypeScript أن المتغير المفحوص من النوع المعرَّف في مُحمَّل النوع.

قبل استدعاء حارس النوع، لا يكون النوع الفعلي للمتغير <em>comment</em> معروفاً:

![صورة توضيحية](/images/mooc/83b148edd27a.webp)

لكن بعد الاستدعاء، إذا استمرت الشيفرة بعد الاستثناء (أي أن حارس النوع أعاد true)، يعرف المترجم أن <em>comment</em> من النوع <em>string</em>

![صورة توضيحية](/images/mooc/2cd1b17a0381.webp)

استخدام حارس نوع يُرجع مُحمَّل نوع هو إحدى طرق القيام بـ<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">تضييق النوع</a>&nbsp;(type narrowing)، أي إعطاء متغير نوع أكثر صرامة أو دقة. وكما سنرى قريباً، هناك أيضاً أنواع أخرى من&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">حرّاس الأنواع</a>&nbsp;متاحة.

> ملاحظة جانبية: اختبار ما إذا كان شيء ما نصاً
>
> <em>لماذا لدينا شرطان في حارس نوع النص؟</em>
>
> const isString = (text: unknown): text is string =&gt; {
>  return typeof text === 'string' || text instanceof String;}
>
> <em>ألا يكفي كتابة الحارس هكذا؟</em>
>
> const isString = (text: unknown): text is string =&gt; {
>  return typeof text === 'string';
> }
>
> <em>على الأرجح، الصيغة الأبسط كافية لجميع الأغراض العملية. لكن إذا أردنا التأكد، فثمة حاجة إلى الشرطين معاً. هناك طريقتان مختلفتان لإنشاء نص في JavaScript، إحداهما كنوع أولي (primitive) والأخرى ككائن، وكلتاهما تعمل بشكل مختلف قليلاً عند مقارنتهما بالمعاملين <strong>typeof</strong> و<strong>instanceof</strong>:</em>
>
> const a = "I'm a string primitive";
> const b = new String("I'm a String Object");
> typeof a; --&gt; returns 'string'
> typeof b; --&gt; returns 'object'
> a instanceof String; --&gt; returns false
> b instanceof String; --&gt; returns true
>
> <em>غير أنه من غير المرجح أن ينشئ أحد نصاً بدالة إنشاء (constructor). على الأرجح ستكون النسخة الأبسط من حارس النوع كافية تماماً.</em>

بعد ذلك، لننظر في حقل&nbsp;<em>date</em>. تحليل كائن التاريخ والتحقق من صحته مشابه جداً لما فعلناه مع التعليقات. وبما أن TypeScript لا يعرف نوعاً للتاريخ، علينا التعامل معه كنص&nbsp;<em>string</em>. ينبغي مع ذلك أن نستخدم تحققاً على مستوى JavaScript لفحص ما إذا كانت صيغة التاريخ مقبولة.

سنضيف الدالتين التاليتين:

```ts
const isDate = (date: string): boolean =&gt; {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string =&gt; {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

الشيفرة ليست شيئاً مميزاً. الأمر الوحيد هو أننا لا نستطيع استخدام حارس نوع مبني على مُحمَّل نوع هنا، لأن التاريخ في هذه الحالة يُعتبر مجرد&nbsp;<em>string</em>. لاحظ أنه رغم أن دالة&nbsp;<em>parseDate</em>&nbsp;تقبل المتغير&nbsp;<em>date</em>&nbsp;بوصفه&nbsp;<em>unknown</em>، فبعد فحص نوعه بـ<em>isString</em>، يعرف مترجم TypeScript أن نوعه&nbsp;<em>string</em>، ولهذا يمكننا إعطاء المتغير لدالة&nbsp;<em>isDate</em>&nbsp;التي تتطلب نصاً دون أي مشاكل.

أخيراً، نحن جاهزون للانتقال إلى النوعين الأخيرين،&nbsp;<em>Weather</em>&nbsp;و<em>Visibility</em>.

نريد أن يعمل التحقق والتحليل كما يلي:

```js
const parseWeather = (weather: unknown): Weather =&gt; {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

السؤال هو: كيف يمكننا التحقق من أن النص بصيغة محددة؟ إحدى الطرق الممكنة لكتابة حارس النوع هي هذه:

```ts
const isWeather = (str: string): str is Weather =&gt; {
  return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
};
```

سيعمل هذا بشكل جيد، لكن المشكلة أن قائمة القيم الممكنة لـWeather لا تبقى بالضرورة متزامنة مع تعريفات الأنواع إذا عُدّل النوع. هذا بالتأكيد ليس جيداً، لأننا نريد مصدراً واحداً فقط لجميع أنواع الطقس الممكنة.

### كائن as const

في حالتنا، سيكون الحل الأفضل هو تحسين نوع Weather نفسه. بدلاً من اسم نوع مستعار، يمكننا استخدام <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions" data-type="link" data-id="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions">كائن const</a>، وهو يتيح لنا استخدام القيم الفعلية في شيفرتنا في وقت التشغيل، وليس في مرحلة الترجمة فقط.

لنُعِد تعريف النوع Weather كما يلي:

```ts
export const Weather = {
  Sunny: 'sunny',
  Rainy: 'rainy',
  Cloudy: 'cloudy',
  Stormy: 'stormy',
  Windy: 'windy',
} as const;

export type Weather = typeof Weather[keyof typeof Weather];
```

لاحظ أننا نعرّف كائناً ثابتاً (const object) ونوعاً بالاسم نفسه. يتيح TypeScript ذلك لأنهما يعيشان في مساحتَي أسماء منفصلتين. النوع مشتق مباشرةً من قيم الكائن، لذا يبقيان متزامنين تلقائياً دائماً.

الآن يمكننا التحقق من أن نصاً ما هو إحدى القيم المقبولة، ويمكن كتابة حارس النوع هكذا:

```ts
const isWeather = (param: string): param is Weather =&gt; {
  return (Object.values(Weather) as string[]).includes(param);
};
```

لا يوجد شيء مفاجئ في المحلّل:

```js
const parseWeather = (weather: unknown): Weather => {<br>  if (!weather || !isString(weather) || !isWeather(weather)) {<br>    throw new Error('Incorrect or missing weather: ' + weather);<br>  }<br>  return weather;<br>};
```

ما زلنا بحاجة إلى إعطاء المعاملة نفسها للنوع Visibility. يبدو <em>كائن const</em> كما يلي:

```ts
export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor',
} as const;

export type Visibility = typeof Visibility[keyof typeof Visibility];
```

حارس النوع والمحلّل أدناه:

```ts
const isVisibility = (param: string): param is Visibility =&gt; {
  return (Object.values(Visibility) as string[]).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility =&gt; {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
    throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

---

تُستخدم كائنات <em>as const</em> عادةً عندما تكون هناك مجموعة قيم محددة سلفاً لا يُتوقع أن تتغير مستقبلاً. وهي تقدّم طريقة رائعة للتحقق من القيم الواردة مع بقائها كائنات JavaScript عادية، مما يجعلها أكثر مرونة في بعض الحالات من <a href="https://www.typescriptlang.org/docs/handbook/enums.html">enums</a>، التي كانت سابقاً خياراً شائعاً لتعريف غرض مشابه.

> <strong>ما هو في الحقيقة النوع Visibility وكائن Visibility</strong>
>
> عندما عرّفنا
>
> export const Visibility = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof Visibility[keyof typeof Visibility];<br>
>
> عرّفنا شيئين متميزين، <em>كائن const المسمى Visibility</em> و<em>النوع Visibility</em>، ومن المثير للاهتمام أن TypeScript يتيح تعايشهما رغم حمل الاسم نفسه.
>
> إذا مرّرنا المؤشر فوق النوع Visibility، نرى ما هو في الحقيقة:
>
>
>
> إذن هو ببساطة يُختزل إلى اتحاد أربع قيم نصية حرفية. يمكن استخدامه مثلاً كما يلي:
>
> const x: Visibility = "great";<br>const y: Visibility = Visibility.Ok;
>
> في المثال الأخير، نستخدم كائن const المسمى Visibility ونسند قيمته Ok (أي النص <em>ok</em>) إلى y.
>
> يمكننا أيضاً استخدام أسماء مختلفة لكائن const والنوع:
>
> export const VisibilityValues = {<br>  Great: 'great',<br>  Good: 'good',<br>  Ok: 'ok',<br>  Poor: 'poor',<br>} as const;<br><br>export type Visibility = typeof VisibilityValues[keyof typeof VisibilityValues];
>
> عندها يصبح الحارس
>
> import { VisibilityValues, type Visibility, ... } from './types.ts';<br><br>const isVisibility = (param: string): param is Visibility => {<br>  return (Object.values(VisibilityValues) as string[]).includes(param);<br>};
>
> في هذه الحالة، سنحتاج أيضاً إلى استيراد كليهما على حدة الآن. وبعد أن فهمنا ما يجري، سنلتزم باستخدام الاسم نفسه لكليهما لأنه يجعل الشيفرة أقل إسهاباً قليلاً.
>
> لكن لا يزال هناك سؤال واحد. ما هو بحق العالم
>
> typeof Visibility[keyof typeof Visibility]
>
> لنفككه خطوة بخطوة. يعطيك <em>typeof Visibility</em> نوع الكائن نفسه:
>
> {
  readonly Great: 'great',
  readonly Good: 'good',
  readonly Ok: 'ok',
  readonly Poor: 'poor',
}
>
> يستخرج <em>keyof</em> جميع مفاتيح ذلك النوع كاتحاد:
>
> 'Great' | 'Good' | 'Ok' | 'Poor'
>
> الطبقة الأخيرة، الفهرسة في <em>typeof Visibility</em> باستخدام تلك المفاتيح، تبحث عن <em>أنواع القيم</em> لكل مفتاح من الكائن <em>Visibility</em>، منتجةً اتحاداً لجميع أنواع القيم (وهي في حالتنا مجرد نصوص حرفية):
>
> 'great' | 'good' | 'ok' | 'poor'

أخيراً، يمكننا إنهاء دالة parseNewDiaryEntry التي تتولى التحقق من صحة حقول جسم POST وتحليلها. غير أن هناك أمراً آخر يجب الاعتناء به. إذا حاولنا الوصول إلى حقول المعامل <em>object</em> كما يلي:

```js
const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

لا تجتاز الشيفرة فحص الأنواع:

![صورة توضيحية](/images/mooc/0ccf77e2393b.webp)

السبب هو أن نوع <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noreferrer noopener">unknown</a> لا يسمح بأي عمليات، لذا لا يمكن الوصول إلى الحقول:

يمكننا إصلاح المشكلة مرة أخرى بتضييق النوع. لدينا الآن حارسا نوع، أولهما يفحص وجود كائن المعامل وأنه من النوع <em>object</em>. بعد ذلك، يستخدم حارس النوع الثاني المعامل <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a> للتأكد من أن الكائن يملك جميع الحقول المطلوبة:

```js
const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

إذا لم يُقيَّم الحارس إلى true، يُرمى استثناء.

استخدام المعامل <em>in</em> يضمن فعلياً وجود الحقول في الكائن. وبسبب ذلك، لم تعد فحوصات الوجود في المحلّلات ضرورية:

```js
const parseVisibility = (visibility: unknown): Visibility => {
  // أُزيل فحص !visibility
  if (!isString(visibility) || !isVisibility(visibility)) { // HIGHLIGHT LINE
      throw new Error('Incorrect visibility: ' + visibility);
  }
  return visibility;
};
```

إذا كان حقل ما، مثل&nbsp;<em>comment</em>، اختيارياً، ينبغي أن يأخذ تضييق النوع ذلك في الحسبان، ولم يكن ممكناً استخدام المعامل&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing" target="_blank" rel="noreferrer noopener">in</a>&nbsp;تماماً كما فعلنا هنا، لأن اختبار&nbsp;<em>in</em>&nbsp;يتطلب وجود الحقل.

إذا حاولنا الآن إنشاء مدخلة مذكرة جديدة بحقول غير صالحة أو ناقصة، نحصل على رسالة خطأ مناسبة:

![صورة توضيحية](/images/mooc/1de244de9cca.webp)

يمكن العثور على الشيفرة المصدرية للتطبيق على <a href="https://github.com/fullstack-hy2020/flightdiary/tree/part1" target="_blank" rel="noreferrer noopener">GitHub</a>.

<div class="tasks">

**13. الواجهة الخلفية لـPatientor، الخطوة 5**

</div>

<div class="tasks">

**14. الواجهة الخلفية لـPatientor، الخطوة 6**

</div>

#### استخدام مكتبات التحقق من المخططات

كتابة مدقّق لجسم الطلب قد تكون عبئاً كبيراً. لحسن الحظ، توجد عدة&nbsp;<em>مكتبات للتحقق من المخططات</em>&nbsp;(schema validator libraries) يمكنها المساعدة. لنلقِ الآن نظرة على&nbsp;<a href="https://zod.dev/" target="_blank" rel="noreferrer noopener">Zod</a>&nbsp;التي تعمل بشكل جيد جداً مع TypeScript.

لنبدأ:

```bash
npm install zod
```

إن محلّلات الحقول ذات القيم الأولية مثل

```ts
const isString = (text: unknown): text is string =&gt; {
  return typeof text === 'string' || text instanceof String;
};

const parseComment = (comment: unknown): string =&gt; {
  if (!isString(comment)) {
    throw new Error('Incorrect comment');
  }

  return comment;
};
```

يسهل استبدالها كما يلي:

```ts
import { z } from 'zod';

// ...

const parseComment = (comment: unknown): string => {
  return z.string().parse(comment);
};
```

أولاً تُستخدم دالة&nbsp;<a href="https://zod.dev/?id=strings" target="_blank" rel="noreferrer noopener">string</a>&nbsp;في Zod لتعريف النوع المطلوب (أو <em>المخطط</em>&nbsp;بمصطلحات Zod). بعد ذلك يُحلَّل المتغير (وهو من النوع&nbsp;<em>unknown</em>) بالدالة&nbsp;<a href="https://zod.dev/?id=parse" target="_blank" rel="noreferrer noopener">parse</a>&nbsp;التي تُرجع القيمة بالنوع المطلوب أو ترمي استثناءً.

لا نحتاج فعلياً إلى الدالة المساعدة&nbsp;<em>parseComment</em>&nbsp;بعد الآن، ويمكننا استخدام محلّل Zod مباشرةً:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: z.string().parse(object.comment)     // HIGHLIGHT LINE
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

لدى Zod مجموعة من عمليات التحقق الخاصة بالنصوص، مثلاً واحدة تتحقق مما إذا كان النص <a href="https://zod.dev/?id=dates" target="_blank" rel="noreferrer noopener">تاريخاً</a>&nbsp;صالحاً، لذا نتخلص أيضاً من محلّل حقل التاريخ:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: z.iso.date().parse(object.date),      // HIGHLIGHT LINE
      comment: z.string().optional().parse(object.comment)    // HIGHLIGHT LINE
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

قرّرنا أيضاً جعل حقل التعليق <a href="https://zod.dev/?id=optional" target="_blank" rel="noreferrer noopener">اختيارياً</a>.

مدقّق Zod الخاص بـ<a href="https://zod.dev/api?id=enums" target="_blank" rel="noreferrer noopener">enums</a>&nbsp;يناسب حالة تكون فيها المدخلات الممكنة مجموعة ثابتة من النصوص، وهذه هي الحالة مع weather وvisibility.

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object &amp;&amp; 'date' in object &amp;&amp; 'weather' in object &amp;&amp; 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
// BEGIN HIGHLIGHT
      weather: z.enum(Weather).parse(object.weather),
      visibility: z.enum(Visibility).parse(object.visibility),
// END HIGHLIGHT
      date: z.iso.date().parse(object.date),
      comment: z.string().parse(object.comment)
    };

  throw new Error('Incorrect data: some fields are missing');
};
```

حتى الآن استخدمنا Zod فقط لتحليل نوع أو مخطط الحقول الفردية، لكن يمكننا المضي خطوة أبعد وتعريف&nbsp;<em>مدخلة المذكرة الجديدة</em>&nbsp;كاملةً كمخطط&nbsp;<a href="https://zod.dev/?id=objects" target="_blank" rel="noreferrer noopener">كائن</a>&nbsp;في Zod:

```js
const NewEntrySchema = z.object({
  weather: z.enum(Weather),
  visibility: z.enum(Visibility),
  date: z.iso.date(),
  comment: z.string().optional()
});
```

الآن يكفي استدعاء&nbsp;<em>parse</em>&nbsp;على المخطط المعرَّف:

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};
```

بمساعدة&nbsp;<a href="https://zod.dev/basics?id=handling-errors" target="_blank" rel="noreferrer noopener">التوثيق</a>&nbsp;يمكننا أيضاً تحسين معالجة الأخطاء:

```js
import { z } from 'zod';

//

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
   // BEGIN HIGHLIGHT
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
   // END HIGHLIGHT
  }
});
```

تبدو الاستجابة في حالة الخطأ جيدة جداً:

![صورة توضيحية](/images/mooc/2039abaa78c4.webp)

يمكننا تطوير حلنا بضع خطوات أخرى. تبدو تعريفات أنواعنا حالياً هكذا:

```ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export type NewDiaryEntry = Omit&lt;DiaryEntry, 'id'&gt;;
```

إذن، إلى جانب النوع&nbsp;<em>NewDiaryEntry</em>&nbsp;لدينا أيضاً مخطط Zod باسم&nbsp;<em>NewEntrySchema</em>&nbsp;يعرّف شكل المدخلة الجديدة. يمكننا استخدام المخطط لـ<a href="https://zod.dev/?id=type-inference" target="_blank" rel="noreferrer noopener">استنتاج</a>&nbsp;النوع:

```ts
import { z } from 'zod';
import { NewEntrySchema } from './utils.ts'

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

// استنتاج النوع من المخطط
export type NewDiaryEntry = z.infer&lt;typeof NewEntrySchema>;
```

يمكننا المضي في هذا أبعد قليلاً وتعريف&nbsp;<em>DiaryEntry</em>&nbsp;انطلاقاً من&nbsp;<em>NewDiaryEntry</em>:

```ts
export type NewDiaryEntry = z.infer&lt;typeof NewEntrySchema>;

export interface DiaryEntry extends NewDiaryEntry {
  id: number;
}
```

يزيل هذا كل التكرار في تعريفات الأنواع والمخططات. يبدو الأمر رجعياً بعض الشيء، لكن للأسف العكس غير ممكن: لا يمكننا تعريف مخطط Zod انطلاقاً من تعريفات أنواع TypeScript، لذا أصبح مخطط Zod الآن المصدر الوحيد لنوعنا. وبما أن المخطط هو أيضاً أساس النوع، سننقل تعريف المخطط إلى ملف <em>types.ts</em>.

يمكن العثور على الحالة الحالية للشيفرة المصدرية في فرع part2 من مستودع GitHub ‏<a href="https://github.com/fullstack-hy2020/flightdiary/tree/part2" target="_blank" rel="noreferrer noopener">هذا</a>.

### تحليل جسم الطلب في الوسيط

يمكننا الآن التخلص من هذه الدالة كلياً

```js
export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};
```

واستدعاء محلّل Zod مباشرةً في معالج المسار:

```js
import { NewEntrySchema, type NonSensitiveDiaryEntry } from '../types.ts'; // HIGHLIGHT LINE

router.post('/', (req, res) => {  try {
    const newDiaryEntry = NewEntrySchema.parse(req.body); // HIGHLIGHT LINE
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});
```

يمكننا المضي قدماً خطوة إضافية. فبدلاً من استدعاء دالة تحليل جسم الطلب صراحةً في معالج المسار، يمكن أيضاً إجراء التحقق من صحة المدخلات في دالة وسيط.

أضفنا أيضاً تعريفات الأنواع إلى معاملات معالج المسار، وسنستخدم الأنواع أيضاً في دالة الوسيط&nbsp;<em>newDiaryParser</em>:

```js
import express, { type Request, type Response, type NextFunction } from 'express';

// ...

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
```

يستدعي الوسيط فقط محلّل المخطط على جسم الطلب. وإذا رمى التحليل استثناءً، يُمرَّر إلى وسيط معالجة الأخطاء.

إذن، بعد أن يجتاز الطلب هذا الوسيط،&nbsp;<em>يُعرف أن جسم الطلب مدخلة مذكرة جديدة سليمة</em>. يمكننا إخبار مترجم TypeScript بهذه الحقيقة بإعطاء معامل نوع لـ<em>Request</em>:

```js
router.post('/', newDiaryParser, (req: Request&lt;unknown, unknown, NewDiaryEntry>, res: Response&lt;DiaryEntry>) => {
  const addedEntry = diaryService.addDiary(req.body);
  res.json(addedEntry);
});
```

بفضل الوسيط، أصبح جسم الطلب معروف النوع الصحيح ويمكن إعطاؤه مباشرةً كمعامل للدالة&nbsp;<em>diaryService.addDiary</em>.

تبدو صيغة&nbsp;<em>Request&lt;unknown, unknown, NewDiaryEntry&gt;</em>&nbsp;غريبة بعض الشيء. النوع&nbsp;<em>Request</em>&nbsp;هو&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types" target="_blank" rel="noreferrer noopener">نوع عام</a>&nbsp;له عدة معاملات نوع. معامل النوع الثالث يمثّل جسم الطلب، ولكي نعطيه القيمة&nbsp;<em>NewDiaryEntry</em>&nbsp;علينا إعطاء&nbsp;<em>قيمة ما</em>&nbsp;للمعاملين الأولين. نقرر تعريفهما كـ<em>unknown</em>&nbsp;لأننا لا نحتاجهما الآن.

وبما أن الأخطاء المحتملة في التحقق تُعالج الآن في وسيط معالجة الأخطاء، نحتاج إلى تعريف وسيط يتعامل مع أخطاء Zod بشكل صحيح:

```js
const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newDiaryParser, (req: Request&lt;unknown, unknown, NewDiaryEntry>, res: Response&lt;DiaryEntry>) => {
  // ...
});

router.use(errorMiddleware); // HIGHLIGHT LINE
```

يمكن العثور على النسخة النهائية من الشيفرة المصدرية في فرع part3 من مستودع GitHub ‏<a href="https://github.com/fullstack-hy2020/flightdiary/tree/part3" target="_blank" rel="noreferrer noopener">هذا</a>.

<div class="tasks">

**15. الواجهة الخلفية لـPatientor، الخطوة 7**

</div>

<div class="tasks">

**16. فحص**

</div>
