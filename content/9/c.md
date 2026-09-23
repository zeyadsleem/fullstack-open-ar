---
part: 9
letter: c
title: "الخطوات الأولى مع TypeScript"
mainImage: /images/part-9.svg
lang: ar
---
بعد المقدمة الموجزة عن المبادئ الرئيسية لـ TypeScript، أصبحنا الآن مستعدين لبدء رحلتنا نحو أن نصبح مطوّري FullStack بلغة TypeScript. وبدلاً من تقديم مقدمة شاملة عن جميع جوانب TypeScript، سنركّز في هذا الجزء على أكثر المشكلات شيوعاً التي تظهر عند تطوير واجهة خلفية بـ Express أو واجهة أمامية بـ React باستخدام TypeScript. وإلى جانب ميزات اللغة، سنولي أيضاً اهتماماً قوياً بالأدوات.

### إعداد الأمور

منذ الإصدار 22.6 الذي صدر في أغسطس 2024، أصبح Node.js قادراً على تشغيل شيفرة TypeScript. في الواقع، لا يفهم Node لغة TypeScript، بل يحذف فقط تعليقات الأنواع ويشغّل شيفرة JavaScript المتبقية.

لا يجري Node.js فحصاً للأنواع، لذا لن تحصل إلا على مجموعة صغيرة من مزايا TypeScript بشكل جاهز. وللحصول على تجربة TypeScript الكاملة — فحص الأنواع والترجمة وأدوات أغنى — سنحتاج أيضاً إلى تثبيت حزمة npm المسماة <a href="https://www.npmjs.com/package/typescript" data-type="link" data-id="https://www.npmjs.com/package/typescript">TypeScript</a>، التي توفّر المترجم (tsc) وخدمات اللغة.

كما نتذكّر من <a href="/part3" target="_blank" rel="noreferrer noopener">الجزء 3</a>، يُنشأ مشروع npm بتشغيل الأمر <code>npm init</code> في دليل فارغ. ثم يمكننا تثبيت الاعتمادية بتشغيل

```bash
npm install --save-dev typescript
```

لنُعِد أيضاً <em>scripts</em> داخل الملف <em>package.json</em>:

```json
{
  // ...
  "type": "module",      // HIGHLIGHT LINE
  "scripts": {
   "tsc": "tsc --noEmit" // HIGHLIGHT LINE
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

يمكننا الآن استخدام السكربت لفحص أنواع ملف TypeScript:

```bash
npm run tsc file.ts
```

يخبر الخيار --noEmit مترجم TypeScript بألا يولّد مخرجات JavaScript. فهو يشغّل فحص الأنواع فقط، دون توليد ملف مترجم.

لاحظ أننا عرّفنا <em>"type": "module"</em> الذي يخبر Node.js بمعاملة الملفات في هذه الحزمة كوحدات ES (ESM) بدلاً من وحدات CommonJS، ما يعني أنه يمكننا استخدام صيغة <em>import/export </em>بدلاً من <em>require</em>، وهي الطريقة المفضّلة في TypeScript.

لنضف ملف إعدادات&nbsp;<em>tsconfig.json</em>&nbsp;إلى المشروع بالمحتوى التالي:

```json
{
  "compilerOptions":{
    "noImplicitAny": false,
    "noEmit": true
  }
}
```

يُستخدم ملف <em>tsconfig.json</em> لتحديد كيف ينبغي لمترجم TypeScript أن يفسّر الشيفرة، ومدى صرامة عمل المترجم، والملفات التي يجب مراقبتها أو تجاهلها، <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html" target="_blank" rel="noreferrer noopener">وأمور أخرى كثيرة</a>. في الوقت الحالي، سنعطّل فقط خيار المترجم <a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>، بحيث لا يُشترط كتابة أنواع لجميع المتغيرات المستخدمة. عرّفنا أيضاً <a href="https://www.typescriptlang.org/tsconfig/#noEmit">"noEmit": true</a> لأننا سنستخدم مترجم TypeScript للفحص فقط.

يمكننا الآن حذف المعامل <em>--noEmit</em> من سكربت npm:

```json
{<br>  // ...<br>  "scripts": {<br>   "tsc": "tsc" // HIGHLIGHT LINE<br>  },<br>  // ...<br>}
```

> ملاحظة حول أسلوب كتابة الشيفرة
>
> JavaScript لغة متسامحة جداً بطبيعتها، ويمكن غالباً إنجاز الأمور بطرق مختلفة متعددة. على سبيل المثال، لدينا الدوال المسماة مقابل الدوال المجهولة، واستخدام const وlet أو var، والاستخدام الاختياري لـ<em>الفواصل المنقوطة</em>. يختلف هذا الجزء من المقرر عن بقية الأجزاء باستخدامه الفواصل المنقوطة. وهو ليس نمطاً خاصاً بـ TypeScript بل قرار عام في أسلوب كتابة الشيفرة يُتخذ عند إنشاء أي نوع من مشاريع JavaScript. وعادة ما يكون قرار استخدامها من عدمه بيد المبرمج، ولكن بما أنه يُتوقع من المرء أن يكيّف عاداته البرمجية مع قاعدة الشيفرة القائمة، فمن المتوقع أن تستخدم الفواصل المنقوطة وأن تتكيّف مع أسلوب كتابة الشيفرة في تمارين هذا الجزء. يحتوي هذا الجزء أيضاً على بعض الفروق الأخرى في أسلوب كتابة الشيفرة مقارنة ببقية المقرر، مثل اصطلاحات تسمية الأدلة.

لنبدأ بإنشاء مضاعِف بسيط في الملف <em>multiplier.ts</em>. يبدو تماماً كما سيكون في JavaScript.

```js
const multiplicator = (a, b, printText) =&gt; {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

كما ترى، هذه لا تزال شيفرة JavaScript أساسية عادية دون أي ميزات إضافية من TS. وعندما نستخدم مترجم TypeScript لفحص الأنواع بالأمر <code>npm run tsc multiplier.ts</code> لا تظهر أي شكاوى. لذا نعرف أن الشيفرة آمنة الأنواع، ويمكننا تشغيلها بثقة بالأمر <code>node multiplier.ts</code>.

لتسريع الأمور، لننشئ سكربتاً يقوم أولاً بفحص الأنواع ثم يشغّل الشيفرة إذا نجحت الفحوصات.

```json
{
  // ..
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc &amp;&amp; <span style="background-color: rgba(30, 30, 30, 0.2); font-family: inherit; text-align: initial;">node multiplier.ts</span>" // HIGHLIGHT LINE
  },
  // ..
}
```

فالآن يكفي <code>npm run multiply</code> لفحص الأنواع وتشغيل الشيفرة.

ماذا يحدث إذا انتهى بنا الأمر بتمرير <em>أنواع</em> خاطئة من المعاملات إلى الدالة multiplicator؟

لنجرّب ذلك!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

الآن عندما نشغّل الشيفرة، يكون الناتج:&nbsp;<em>Multiplied a string and 4, the result is: NaN</em>.

ألن يكون جميلاً لو استطاعت اللغة نفسها أن تمنعنا من الانتهاء في مواقف كهذه؟ هنا نرى أولى مزايا TypeScript. لنضف أنواعاً إلى المعاملات ونرَ إلى أين يأخذنا ذلك.

تدعم TypeScript أصلاً أنواعاً متعددة منها&nbsp;<em>number</em>&nbsp;و<em>string</em>&nbsp;و<em>Array</em>. اطّلع على القائمة الشاملة&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" target="_blank" rel="noreferrer noopener">هنا</a>. ويمكن أيضاً إنشاء أنواع مخصّصة أكثر تعقيداً.

المعاملان الأولان في دالتنا من النوع number والأخير من النوع string، وكلا النوعين من&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean" target="_blank" rel="noreferrer noopener">الأنواع الأولية</a>:

```ts
const multiplicator = (a: number, b: number, printText: string) => { // HIGHLIGHT LINE
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

الآن لم تعد الشيفرة صالحة في TypeScript. وعندما نحاول تشغيل الشيفرة، نلاحظ أنها لا تُترجم:

![صورة توضيحية](/images/mooc/e09f293805d1.webp)

من أفضل ما في دعم TypeScript في المحرّر أنك لا تحتاج بالضرورة إلى تشغيل الشيفرة لترى المشكلات. فـ VSCode فعّال لدرجة أنه يخبرك فوراً عندما تحاول استخدام نوع غير صحيح:

![صورة توضيحية](/images/mooc/e11f787a659d.webp)

### إنشاء أنواعك الأولى

لنوسّع مضاعِفنا ليصبح آلة حاسبة أكثر تنوعاً تدعم أيضاً الجمع والقسمة. ينبغي أن تقبل الآلة الحاسبة ثلاث وسائط: عددين والعملية، إما&nbsp;<em>multiply</em>&nbsp;أو&nbsp;<em>add</em>&nbsp;أو&nbsp;<em>divide</em>، التي تخبرها ما تفعله بالعددين.

في JavaScript، ستتطلب الشيفرة تحققاً إضافياً للتأكد من أن الوسيط الأخير نص بالفعل. تقدّم TypeScript طريقة لتعريف أنواع محددة للمدخلات، تصف بدقة نوع المدخل المقبول. علاوة على ذلك، تستطيع TypeScript أيضاً عرض معلومات القيم المقبولة على مستوى المحرّر نفسه.

يمكننا إنشاء&nbsp;<em>نوع</em>&nbsp;باستخدام الكلمة المفتاحية الأصلية في TypeScript وهي&nbsp;<em>type</em>. لنصف نوعنا&nbsp;<em>Operation</em>:

```ts
type Operation = 'multiply' | 'add' | 'divide';
```

الآن لا يقبل نوع <em>Operation</em> سوى ثلاثة أنواع من القيم؛ تحديداً النصوص الثلاثة التي أردناها. وباستخدام المعامل OR وهو | يمكننا تعريف متغير ليقبل قيماً متعددة عبر إنشاء نوع اتحادي. في هذه الحالة، استخدمنا نصوصاً محددة (تُسمى بمصطلحات تقنية أنواع النصوص الحرفية)، لكن مع الأنواع الاتحادية يمكنك أيضاً جعل المترجم يقبل مثلاً النص والعدد معاً: <em>string | number</em>.

تعريف الكلمة المفتاحية&nbsp;<em>type</em>&nbsp;اسم جديد لنوع:&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">اسم مستعار للنوع</a>. وبما أن النوع المعرّف هو اتحاد لثلاث قيم محتملة، فمن المفيد إعطاؤه اسماً مستعاراً ذا اسم معبّر.

لنلقِ نظرة على آلتنا الحاسبة الآن:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) =&gt; {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can\'t divide by 0!';
    return a / b;
  }
}
```

الآن، عندما نمرّر المؤشر فوق نوع <em>Operation</em> في دالة calculator، يمكننا أن نرى فوراً اقتراحات حول ما يمكن فعله به:

![صورة توضيحية](/images/mooc/09fe4d4fe943.webp)

وإذا حاولنا استخدام قيمة ليست ضمن نوع <em>Operation</em>، نحصل على إشارة التحذير الحمراء المألوفة ومعلومات إضافية من محرّرنا:

![صورة توضيحية](/images/mooc/f8c733f3b516.webp)

هذا جيد جداً بالفعل، لكن هناك أمر لم نلمسه بعد وهو كتابة نوع القيمة المُعادة من الدالة. عادةً، تريد معرفة ما تُعيده الدالة، وسيكون من الجميل ضمان أنها تُعيد ما تدّعي أنها تُعيده. لنضف نوع القيمة المُعادة&nbsp;<em>number</em>&nbsp;إلى دالة calculator:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => { // HIGHLIGHT LINE
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'this cannot be done';
    return a / b;
  }
}
```

يشتكي المترجم فوراً لأن الدالة تُعيد نصاً في إحدى الحالات. وهناك بضع طرق لإصلاح ذلك:

يمكننا توسيع نوع القيمة المُعادة ليسمح بقيم نصية، هكذا:

```ts
const calculator = (a: number, b: number, op: Operation): number | string =&gt;  {
  // ...
}
```

أو يمكننا إنشاء نوع للقيمة المُعادة يشمل كلا النوعين المحتملين، تماماً مثل نوع Operation لدينا:

```ts
type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result =&gt;  {
  // ...
}
```

لكن السؤال الآن هو: هل من <em>المقبول حقاً</em> أن تُعيد الدالة نصاً؟

عندما يمكن أن تنتهي شيفرتك في موقف تُقسم فيه قيمة على 0، فقد حدث خطأ فادح على الأرجح، وينبغي رمي خطأ ومعالجته حيث استُدعيت الدالة. وعندما تقرّر إعادة قيم لم تكن تتوقعها أصلاً، فإن التحذيرات التي تراها من TypeScript تمنعك من اتخاذ قرارات متعجلة وتساعدك على إبقاء شيفرتك تعمل كما هو متوقع.

هناك أمر آخر ينبغي مراعاته وهو أنه حتى مع تعريفنا أنواعاً لمعاملاتنا، فإن شيفرة JavaScript المولّدة والمستخدمة وقت التشغيل لا تحتوي على فحوصات الأنواع. لذا إذا كانت قيمة المعامل <em>Operation</em> مثلاً تأتي من واجهة خارجية، فلا يوجد ضمان مؤكد أنها ستكون إحدى القيم المسموح بها. لذلك، لا يزال من الأفضل تضمين معالجة الأخطاء والاستعداد لحدوث غير المتوقع. في هذه الحالة، عندما تكون هناك قيم مقبولة متعددة محتملة وينبغي أن تؤدي كل القيم غير المتوقعة إلى خطأ، تناسبنا عبارة <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch" data-type="link" data-id="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">switch...case</a> أكثر من if...else في شيفرتنا.

ينبغي أن تبدو شيفرة آلتنا الحاسبة شيئاً كهذا:

```ts
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) : number => {   // HIGHLIGHT LINE
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can\'t divide by 0!'); // HIGHLIGHT LINE
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!'); // HIGHLIGHT LINE
  }
}

try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### تضييق الأنواع

النوع الافتراضي لمعامل كتلة catch وهو&nbsp;<em>error</em>&nbsp;هو&nbsp;<em>unknown</em>. و<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noreferrer noopener">unknown</a>&nbsp;نوع من أنواع القمة الذي أُدخل في الإصدار 3 من TypeScript ليكون النظير الآمن الأنواع لـ<em>any</em>. أي شيء يمكن إسناده إلى&nbsp;<em>unknown</em>، لكن&nbsp;<em>unknown</em>&nbsp;لا يمكن إسناده إلى أي شيء سوى نفسه و<em>any</em> دون تأكيد نوع أو تضييق نوع قائم على تدفق التحكم. وبالمثل، لا يُسمح بأي عمليات على قيمة من نوع&nbsp;<em>unknown</em>&nbsp;دون تأكيدها أو تضييقها أولاً إلى نوع أكثر تحديداً.

كلا السببين المحتملين للاستثناء (معامل خاطئ أو قسمة على صفر) سيرمي كائن&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank" rel="noreferrer noopener">Error</a>&nbsp;مع رسالة خطأ يطبعها برنامجنا للمستخدم.

لو كانت شيفرتنا JavaScript، لأمكننا طباعة رسالة الخطأ بمجرد الإشارة إلى الحقل&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message" target="_blank" rel="noreferrer noopener">message</a>&nbsp;في الكائن&nbsp;<em>error</em>&nbsp;كما يلي:

```
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error) {
  console.log('Something went wrong: ' + error.message); // HIGHLIGHT LINE
}
```

بما أن النوع الافتراضي للكائن&nbsp;<em>error</em>&nbsp;في TypeScript هو&nbsp;<em>unknown</em>، علينا أن&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">نضيّق</a>&nbsp;النوع للوصول إلى الحقل:

```js
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  // هنا لا يمكننا استخدام error.message
// BEGIN HIGHLIGHT
  if (error instanceof Error) {
   // تم تضييق النوع ويمكننا الإشارة إلى error.message
// END HIGHLIGHT
    errorMessage += error.message;
}
  // هنا لا يمكننا استخدام error.message // HIGHLIGHT LINE

  console.log(errorMessage);
}
```

هنا، أُجري التضييق باستخدام حارس النوع instanceof، وهو مجرد واحدة من طرق كثيرة لتضييق نوع. وسنرى طرقاً أخرى كثيرة لاحقاً في هذا الجزء.

### الوصول إلى معاملات سطر الأوامر

البرامج التي كتبناها جيدة، لكن سيكون من الأفضل بالتأكيد لو استطعنا استخدام معاملات سطر الأوامر بدلاً من الاضطرار دائماً إلى تغيير الشيفرة لحساب أشياء مختلفة.

لنجرّب ذلك، كما نفعل في تطبيق Node عادي، عبر الوصول إلى <em>process.argv</em>. ومع ذلك، هناك شيء غير صحيح:

![صورة توضيحية](/images/mooc/b48ba06e9482.webp)

تعطينا رسالة الخطأ تلميحاً عن كيفية إصلاح المشكلة:

```bash
npm install --save-dev @types/node
```

عند تثبيت الحزمة <em>@types/node</em>، لا يشتكي المترجم من المتغير process. لاحظ أنه لا حاجة لاستيراد الأنواع في الشيفرة، فمجرد تثبيت الحزمة كافٍ!

### حول @types/{npm_package}

ثبّتنا للتو حزمة npm المسماة <em>@types/node </em>للتخلص من خطأ في الأنواع. فما هي هذه الحزمة في الواقع؟

تتوقع TypeScript وجود أنواع لكل شيفرة تستخدمها، بما في ذلك المكتبات الخارجية، حتى تستطيع توفير IntelliSense ودعم المحرّر وفحوصات وقت الترجمة. كثير من المكتبات لا تتضمن أنواعها الخاصة. وعندما يحدث ذلك، تُنشر تعريفات الأنواع التي يصونها المجتمع من&nbsp;<a href="https://github.com/DefinitelyTyped/DefinitelyTyped">DefinitelyTyped</a>&nbsp;على npm تحت منظمة @types.

ثبّت حزم @types فقط إذا كانت المكتبة لا تتضمن أنواعاً بالفعل. يمكنك التحقق من توثيق الحزمة أو من حقل types في package.json. ثبّت هذه الحزم كـ<em>devDependencies</em>، لأنها لا تُحتاج إلا أثناء التطوير والبناء، وأبقِ إصداراتها متوافقة مع المكتبة لتجنب عدم التطابق.

على سبيل المثال، تضيف&nbsp;<em>@types/express</em>&nbsp;أنواعاً لـ Request وResponse وRouter والوسيط، ما يحسّن الأمان وسهولة الاستخدام عند بناء المسارات. وبالمثل، يمكنك تثبيت أنواع لمكتبات أخرى تفتقر إلى أنواع مدمجة، مثل&nbsp;<em>@types/react</em>&nbsp;و<em>@types/lodash,</em>&nbsp;أو&nbsp;<em>@types/mongoose</em>.

خلف هذه الحزم يقف مشروع&nbsp;<a href="https://github.com/DefinitelyTyped/DefinitelyTyped">DefinitelyTyped</a>&nbsp;، وهو مجتمع نشط يصون ويحدّث تعريفات الأنواع لعدد هائل من مكتبات npm. وفي معظم الحالات، يمكنك الاعتماد على هذه بدلاً من كتابة تعريفاتك الخاصة. والخلاصة: فضّل الأنواع المدمجة عند توفرها؛ وإلا فثبّت حزم @types المناسبة كـ devDependencies وأبقِها متزامنة مع إصدارات مكتباتك.

### تحسين المشروع

يمكننا جعل <em>multiplier</em> يعمل بمعاملات سطر الأوامر كما يلي:

```ts
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

// BEGIN HIGHLIGHT
// تبدأ معاملات سطر الأوامر من process.argv[2]
const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])

multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
// END HIGHLIGHT
```

ويمكننا تشغيله بـ:

```bash
npm run multiply 5 2
```

إذا شُغّل البرنامج بمعاملات ليست من النوع الصحيح، مثل:

```bash
npm run multiply 5 lol
```

فإنه "يعمل" لكنه يعطينا الجواب:

```
Multiplied 5 and NaN, the result is: NaN
```

والسبب في ذلك أن&nbsp;<em>Number('lol')</em>&nbsp;تُعيد&nbsp;<em>NaN</em>، وهو في الواقع من النوع&nbsp;<em>number</em>، لذا لا تملك TypeScript أي قدرة على إنقاذنا من موقف كهذا.

لمنع هذا النوع من السلوك، علينا التحقق من البيانات المعطاة لنا من سطر الأوامر.

تبدو النسخة المحسّنة من المضاعِف هكذا:

```ts
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length &lt; 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) &amp;&amp; !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is:`);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
```

عندما نشغّل البرنامج الآن:

```bash
npm run multiply 1 lol
```

نحصل على رسالة خطأ مناسبة:

```
Something bad happened. Error: Provided values were not numbers!
```

هناك الكثير مما يجري في الشيفرة. وأهم إضافة هي الدالة&nbsp;<em>parseArguments</em>&nbsp;التي تضمن أن المعاملات المعطاة إلى&nbsp;<em>multiplicator</em>&nbsp;من النوع الصحيح. وإلا، يُرمى استثناء برسالة خطأ وصفية.

في تعريف الدالة بضعة أمور مثيرة للاهتمام:

```ts
const parseArguments = (args: string[]): MultiplyValues =&gt; {
  // ...
}
```

أولاً، المعامل&nbsp;<em>args</em>&nbsp;هو&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" target="_blank" rel="noreferrer noopener">مصفوفة</a>&nbsp;من النصوص.

القيمة المُعادة من الدالة من النوع&nbsp;<em>MultiplyValues</em>، المعرّف كما يلي:

```ts
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

يستخدم التعريف الكلمة المفتاحية&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">Interface</a>&nbsp;في TypeScript، وهي إحدى طرق تعريف "الشكل" الذي ينبغي أن يكون عليه الكائن. في حالتنا، من الواضح تماماً أن القيمة المُعادة ينبغي أن تكون كائناً بخاصيتين هما&nbsp;<em>value1</em>&nbsp;و<em>value2</em>، وينبغي أن يكون كلاهما من النوع number.

#### صيغة المصفوفات البديلة

لاحظ أن هناك أيضاً صيغة بديلة لـ<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" target="_blank" rel="noreferrer noopener">المصفوفات</a>&nbsp;في TypeScript. فبدلاً من كتابة

```ts
let values: number[];
```

يمكننا استخدام "صيغة الأنواع العامة" وكتابة

```js
let values: Array&lt;number&gt;;
```

في هذا المقرر، سنتبع غالباً الاصطلاح الذي تفرضه قاعدة Eslint المسماة&nbsp;<a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">array-simple</a>&nbsp;التي تقترح كتابة المصفوفات البسيطة بصيغة [] واستخدام صيغة &lt;&gt; للمصفوفات الأكثر تعقيداً، انظر&nbsp;<a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">هنا</a>&nbsp;للأمثلة.

<div class="tasks">

**1. مؤشر كتلة الجسم**

</div>

<div class="tasks">

**2. حاسبة التمارين**

</div>

<div class="tasks">

**3. سطر الأوامر**

</div>

### إضافة Express إلى المزيج

نحن الآن في وضع جيد جداً. مشروعنا جاهز، ولدينا فيه آلتان حاسبتان قابلتان للتنفيذ. ومع ذلك، بما أننا نهدف إلى تعلّم تطوير الويب المتكامل، فقد حان الوقت للبدء بالعمل مع بعض طلبات HTTP.

قبل ذلك، لنوسّع قليلاً إعداداتنا في الملف <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">tsconfig.json</a>، الذي لم يحتوِ حتى الآن سوى على قاعدة tsconfig واحدة هي <a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>. غيّر الملف ليكون بالمحتوى التالي:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
// BEGIN HIGHLIGHT
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true
// END HIGHLIGHT
  }
}
```

لا تقلق كثيراً بعد بشأن <em>compilerOptions</em>، فسيخضع لفحص أدق لاحقاً.

إذا أردت، يمكنك العثور على شروحات لكل إعداد من توثيق TypeScript، أو من <a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noreferrer noopener">صفحة tsconfig</a> المفيدة جداً، أو من <a href="http://json.schemastore.org/tsconfig" target="_blank" rel="noreferrer noopener">تعريف مخطط</a> tsconfig.

لنبدأ البرمجة بتثبيت Express:

```bash
npm install express
```

ثم نضيف سكربت&nbsp;<em>start</em>&nbsp;إلى package.json:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc  &amp;&amp; node multiplier.ts",
    "start": "tsc &amp;&amp; node index.ts"  // HIGHLIGHT LINE
  },
  // ..
}
```

الآن يمكننا إنشاء الملف&nbsp;<em>index.ts</em>&nbsp;وكتابة نقطة نهاية HTTP GET المسماة&nbsp;<em>ping</em>&nbsp;فيه:

```js
const express = require('express');
const app = express();

app.get('/ping', (req, res) =&gt; {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () =&gt; {
  console.log(`Server running on port ${PORT}`);
});
```

يبدو كل شيء آخر على ما يرام، لكن كما تتوقع، يحتاج المعاملان&nbsp;<em>req</em>&nbsp;و<em>res</em>&nbsp;في <em>app.get</em> إلى كتابة أنواع.

إذا نظرت بعناية، ستجد أن VSCode يشتكي أيضاً من استيراد Express. يمكنك رؤية سطر أصفر قصير من النقاط تحت <em>require</em>. لنمرّر المؤشر فوق المشكلة:

![صورة توضيحية](/images/mooc/545769391140.webp)

الشكوى هي أن&nbsp;<em>استدعاء 'require' يمكن تحويله إلى import</em>. لنتبع النصيحة ونكتب الاستيراد كما يلي:

```js
import express from 'express';
```

> يمنحك VSCode إمكانية إصلاح المشكلات تلقائياً بالنقر على زر <em>Quick Fix...</em>. أبقِ عينيك مفتوحتين على هذه المساعدات/الإصلاحات السريعة؛ فالاستماع إلى محرّرك يجعل شيفرتك عادةً أفضل وأسهل قراءة. ويمكن أن توفّر الإصلاحات التلقائية للمشكلات وقتاً كبيراً أيضاً.

صيغة الاستيراد هي الخيار الأمثل مع TypeScript، لذا سنلتزم بها من هذه النقطة فصاعداً!

الآن نصطدم بمشكلة أخرى: يشتكي المترجم من عبارة الاستيراد. ومرة أخرى، يكون المحرّر أفضل صديق لنا عند محاولة معرفة ماهية المشكلة:

![صورة توضيحية](/images/mooc/88ec93b02966.webp)

سبب الخطأ هو أننا لم نثبّت أنواعاً لـ<em>Express</em>. لنفعل ما يقترحه الاقتراح ونشغّل:

```bash
npm install --save-dev @types/express
```

لا ينبغي أن تبقى أي أخطاء. لاحظ أنك قد تحتاج إلى إعادة فتح الملف في المحرّر ليتزامن VS Code.

هناك مشكلة أخرى في الشيفرة:

![صورة توضيحية](/images/mooc/2eebb4d3ea9a.webp)

وذلك لأننا منعنا المعاملات غير المستخدمة في ملف&nbsp;<em>tsconfig.json</em>:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // HIGHLIGHT LINE
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true
  }
}
```

قد يخلق هذا الإعداد مشكلات إذا كانت لديك دوال معرّفة مسبقاً على مستوى المكتبة تتطلب تعريف متغير حتى لو لم يُستخدم إطلاقاً، كما هو الحال هنا. لحسن الحظ، هذه المشكلة محلولة بالفعل على مستوى الإعدادات. ومرة أخرى، يمنحنا تمرير المؤشر فوق المشكلة حلاً. هذه المرة، يمكننا فقط النقر على زر الإصلاح السريع:

![صورة توضيحية](/images/mooc/6ad212819a1c.webp)

إذا كان من المستحيل تماماً التخلص من متغير غير مستخدم، يمكنك أن تسبقه بشرطة سفلية لإبلاغ المترجم بأنك فكّرت في الأمر ولا شيء يمكنك فعله.

لنُعِد تسمية المتغير <em>req</em> إلى <em>_req</em>.

أخيراً، أصبحنا مستعدين لبدء التطبيق. يبدو أنه يعمل بشكل جيد:

![صورة توضيحية](/images/mooc/3f2bf36fca3b.webp)

لتبسيط عملية التطوير، ينبغي تمكين إعادة التحميل التلقائي. لقد استخدمت <em>node --watch </em>سابقاً في هذا المقرر،

يمكننا تجربة ما يلي:

```json
{
  // ...
  "scripts": {
      // ...
      "dev": "tsc &amp;&amp; node --watch index.ts",
  },
  // ...
}
```

ومع ذلك، هذا لا يعمل تماماً. إذ يجري فحص الأنواع في البداية فقط. وأحد الحلول سيكون تشغيل فحص الأنواع وNode في وضع المراقبة في الوقت نفسه. وهذا سهل باستخدام حزمة npm المسماة <a href="https://www.npmjs.com/package/concurrently">concurrently</a>. لنثبّتها:

```bash
npm install --save-dev concurrently
```

أضف سكربتاً إلى&nbsp;<em>package.json</em>:

```
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc &amp;&amp; node multiplier.ts",
    "calculate": "tsc &amp;&amp; node calculator.ts",
// BEGIN HIGHLIGHT
    "start": "node index.ts",
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\""
// END HIGHLIGHT
  },
```

أصبح <code>npm start</code> الآن أبسط، ويُفترض أن فحص الأنواع يجري <em>قبل</em> تشغيل الشيفرة.

والآن، بتشغيل <code>npm run dev,</code> لدينا بيئة تطوير عاملة تعيد التحميل تلقائياً لمشروعنا! ومع ذلك، هناك أمر واحد جدير بالملاحظة. إذا أُدخل خطأ في الأنواع إلى البرنامج، يلاحظه فاحص الأنواع، لكن التطبيق يستمر في العمل، لذا عليك أن تراقب ما يحدث في الطرفية:

![صورة توضيحية](/images/mooc/5f8c905a4b47.webp)

هناك أيضاً إعدادات من شأنها إيقاف البرنامج عن العمل في حال حدوث خطأ في الأنواع. لكننا نفضّل نهجاً أخف.

الاتجاه الحالي هو الاعتماد إلى حد كبير على المحرّر في فحص الأنواع أثناء كتابة الشيفرة، وتشغيل <code>tsc --noEmit</code> في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration">خط أنابيب التكامل المستمر </a>أو كخطاف Git <a href="https://pre-commit.com/" data-type="link" data-id="https://pre-commit.com/">pre-commit</a>. هذا يبقي حلقة التطوير خفيفة. فـ <code>node --watch src/index.ts</code> يشغّل شيفرتك عند الحفظ فقط، بينما يعرض المحرّر أخطاء الأنواع في الوقت الفعلي. ويظل أمان الأنواع مفروضاً، لكن في اللحظات المهمة فقط بدلاً من إعاقة كل تشغيل.

<div class="tasks">

**4. Express**

</div>

<div class="tasks">

**5. WebBmi**

</div>

### أهوال&nbsp;<em>any</em>

الآن بعد أن أكملنا أولى نقاط النهاية لدينا، قد تلاحظ أننا بالكاد استخدمنا أي شيء من TypeScript في هذه الأمثلة الصغيرة. وعند فحص الشيفرة عن قرب أكثر، يمكننا رؤية بعض المخاطر الكامنة فيها.

لنضف نقطة نهاية HTTP POST المسماة&nbsp;<em>calculate</em>&nbsp;إلى تطبيقنا:

```js
import { calculator } from './calculator.ts';

app.use(express.json());

// ...

app.post('/calculate', (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  return res.send({ result });
});
```

لجعل هذا يعمل، علينا إضافة&nbsp;<em>export</em>&nbsp;إلى الدالة&nbsp;<em>calculator</em>:

```ts
export const calculator = (a: number, b: number, op: Operation) : number =&gt; {
```

عندما تمرّر المؤشر فوق الدالة <em>calculate</em>، يمكنك رؤية أنواع <em>calculator</em> حتى مع أن الشيفرة نفسها لا تحتوي على أي كتابة أنواع:

![صورة توضيحية](/images/mooc/bb9e398fffda.webp)

لكن إذا مرّرت المؤشر فوق القيم المستخرجة من الطلب، تظهر مشكلة:

![صورة توضيحية](/images/mooc/a75fc1a7f6ca.webp)

جميع المتغيرات من النوع&nbsp;<em>any</em>. وهذا ليس مفاجئاً كثيراً، إذ لم يمنحها أحد نوعاً بعد. وهناك بضع طرق لإصلاح ذلك، لكن أولاً، علينا التفكير في سبب قبول هذا ومن أين جاء النوع&nbsp;<em>any</em>.

في TypeScript، يصبح كل متغير غير منمّط يتعذّر استنتاج نوعه ضمنياً من النوع&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any" target="_blank" rel="noreferrer noopener">any</a>. وany نوع يشبه "بطاقة جامحة"، يمثل&nbsp;<em>أي</em>&nbsp;نوع. وتصبح الأشياء من نوع any ضمنياً في كثير من الأحيان عندما ينسى المرء كتابة أنواع الدوال.

يمكننا أيضاً كتابة الأنواع <em>any</em> صراحةً. والفرق الوحيد بين النوع any الضمني والصراحي هو شكل الشيفرة؛ فلا يهتم المترجم بالفرق.

لكن المبرمجين يرون الشيفرة بشكل مختلف عندما يُفرض&nbsp;<em>any</em>&nbsp;صراحةً عما عندما يُستنتج ضمنياً. وعادة ما تُعتبر كتابات&nbsp;<em>any</em>&nbsp;الضمنية مشكلة لأنها كثيراً ما تكون بسبب نسيان المبرمج إسناد الأنواع (أو تكاسله عن ذلك)، وتعني أيضاً أن قوة TypeScript الكاملة لا تُستغل استغلالاً صحيحاً.

لهذا السبب توجد قاعدة الإعدادات&nbsp;<a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noreferrer noopener">noImplicitAny</a>&nbsp;على مستوى المترجم، ويوصى بشدة بإبقائها مفعّلة في جميع الأوقات. وفي المناسبات النادرة التي لا يمكنك فيها حقاً معرفة نوع متغير ما، ينبغي أن تذكر ذلك صراحةً في الشيفرة:

```js
const a : any = /* no clue what the type will be! */.
```

لدينا بالفعل <em>noImplicitAny: true</em> مضبوط في مثالنا، فلماذا لا يشتكي المترجم من أنواع <em>any</em> الضمنية؟ السبب هو أن حقل <em>body</em> في كائن <a href="https://expressjs.com/en/5x/api.html#req" target="_blank" rel="noreferrer noopener">Request</a> الخاص بـ Express منمّط صراحةً بـ<em>any</em>. وينطبق الشيء نفسه على حقل <em>request.query</em> الذي يستخدمه Express لمعاملات الاستعلام.

> <strong>ملاحظة حول الاستيراد</strong>
>
> إذا نظرت بدقة إلى الشيفرة، لاحظت على الأرجح أن الاستيراد يستخدم اسم الملف الكامل بما في ذلك الامتداد:
>
> import { calculator } from './calculator.ts';
>
> وذلك لأن Node.js يحتاج إلى التمييز بين الملف المصدر <em>.ts</em> وملف <em>.js</em> المترجم المحتمل بالاسم نفسه، رغم أننا في حالتنا لن نملك حتى ملفات <em>.js</em>.

ماذا لو أردنا تقييد المطورين من استخدام النوع&nbsp;<em>any</em>؟ لحسن الحظ، لدينا طرق غير&nbsp;<em>tsconfig.json</em>&nbsp;لفرض أسلوب كتابة الشيفرة. ما يمكننا فعله هو استخدام&nbsp;<em>ESlint</em>&nbsp;لإدارة شيفرتنا. لنثبّت ESlint وإضافاته الخاصة بـ TypeScript:

```bash
npm install --save-dev eslint @eslint/js typescript-eslint
```

> <strong>ملاحظة:</strong> في وقت كتابة هذا النص (28.3.2026)، فإن أحدث إصدار من <a href="https://www.npmjs.com/package/typescript-eslint">typescript-eslint</a> (وهو 5.57.2) غير متوافق مع TypeScript 6، الذي صدر في 23.3.2026. وبسبب ذلك، يفشل الأمر <code>npm install</code>. وإلى أن يصدر إصدار جديد، عليك تشغيل الأمر بالصيغة <code>npm install --legacy-peer-deps</code>

سنضبط ESlint على&nbsp;<a href="https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-explicit-any.mdx" target="_blank" rel="noreferrer noopener">منع any الصراحي</a>. اكتب القواعد التالية في&nbsp;<em>eslint.config.mjs</em>:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});

```

لنُعِد أيضاً سكربت npm باسم&nbsp;<em>lint</em>&nbsp;لفحص الملفات عبر تعديل ملف&nbsp;<em>package.json</em>:

```json
{
  // ...
  "scripts": {
      "tsc": "tsc",
      "calculate": "tsc &amp;&amp; node calculator.ts",
      "multiply": "tsc &amp;&amp; node multiplier.ts",
      "start": "node index.ts",
      "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
      "lint": "eslint ."      // HIGHLIGHT LINE
      //  ...
  },
  // ...
}
```

الآن سيشكو lint إذا حاولنا تعريف متغير من النوع <em>any</em>:

![صورة توضيحية](/images/mooc/dc0e824278bf.webp)

لدى typescript-eslint الكثير من قواعد ESLint الخاصة بـ TypeScript، لكن يمكنك أيضاً استخدام جميع قواعد ESLint الأساسية في مشاريع TypeScript. في الوقت الحالي، ينبغي أن نمضي غالباً مع الإعدادات الموصى بها، وسنعدّل القواعد أثناء تقدمنا كلما وجدنا شيئاً نريد تغيير سلوكه.

علاوة على الإعدادات الموصى بها، ينبغي أن نحاول التعرّف على أسلوب كتابة الشيفرة المطلوب في هذا الجزء و<em>جعل الفاصلة المنقوطة في نهاية كل سطر شيفرة مطلوبة</em>. ولذلك، ينبغي أن نثبّت ونضبط <a href="https://eslint.style/packages/default" target="_blank" rel="noreferrer noopener">@stylistic/eslint-plugin</a>:

```bash
npm install --save-dev @stylistic/eslint-plugin
```

يبدو ملفنا النهائي&nbsp;<em>eslint.config.mjs</em>&nbsp;كما يلي:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
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
      { 'argsIgnorePattern': '^_' }
    ],
  },
});
```

هناك عدد لا بأس به من الفواصل المنقوطة المفقودة، لكن إضافتها سهلة. وعلينا أيضاً حل مشكلات ESLint المتعلقة بنوع <em>any</em>:

![صورة توضيحية](/images/mooc/ef9805eea404.webp)

يمكننا، بل ينبغي لنا على الأرجح، تعطيل بعض قواعد ESlint للحصول على البيانات من جسم الطلب.

تعطيل&nbsp;<em>@typescript-eslint/no-unsafe-assignment</em>&nbsp;من أجل إسناد التفكيك واستدعاء دالة بناء <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number" target="_blank" rel="noreferrer noopener">Number</a>&nbsp;على القيم يكاد يكون كافياً:

```js
app.post('/calculate', (req, res) => {
  // BEGIN HIGHLIGHT
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;
// END HIGHLIGHT

  const result = calculator(Number(value1), Number(value2), op);   // HIGHLIGHT LINE
  return res.send({ result });
});
```

لكن هذا لا يزال يترك مشكلة واحدة للتعامل معها، وهي أن المعامل الأخير في استدعاء الدالة غير آمن:

![صورة توضيحية](/images/mooc/299688d2f185.webp)

يمكننا فقط تعطيل قاعدة ESlint أخرى للتخلص من ذلك:

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// BEGIN HIGHLIGHT
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// END HIGHLIGHT
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

لقد أسكتنا ESlint الآن، لكننا تحت رحمة المستخدم تماماً. ينبغي بالتأكيد أن نجري بعض التحقق على بيانات POST ونعطي رسالة خطأ مناسبة إذا كانت البيانات غير صالحة:

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// BEGIN HIGHLIGHT
  if ( !value1 || isNaN(Number(value1)) ) {
     return res.status(400).send({ error: '...'});
  }
  // المزيد من عمليات التحقق هنا...
// END HIGHLIGHT

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

سنرى لاحقاً في هذا الجزء بعض التقنيات التي يمكن بها&nbsp;<em>تضييق</em>&nbsp;البيانات من النوع <em>any</em> (مثل المدخلات التي يستقبلها التطبيق من المستخدم) إلى نوع أكثر تحديداً (مثل number). ومع التضييق الصحيح للأنواع، لن تبقى هناك حاجة لإسكات قواعد ESlint.

> <strong>تحذير</strong>
>
> كثيراً ما يفقد VS code تتبّع ما يجري فعلاً في الشيفرة ويعرض تحذيرات متعلقة بالأنواع أو الأسلوب رغم إصلاح الشيفرة. إذا حدث هذا (وقد حدث معي كثيراً)، فأغلق الملف الذي يسبب لك المشكلة وافتحه، أو أعد تشغيل المحرّر فقط. ومن الجيد أيضاً التأكد مرتين من أن كل شيء يعمل فعلاً بتشغيل المترجم وESlint من سطر الأوامر بالأمرين:
>
> npm run tsc
> npm run lint
>
> فعند التشغيل من سطر الأوامر تحصل على "النتيجة الحقيقية" بالتأكيد. لذا، لا تثق بالمحرّر كثيراً أبداً!

### تأكيد النوع

استخدام&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noreferrer noopener">تأكيد النوع</a>&nbsp;هو "حيلة ملتوية" أخرى يمكن القيام بها لإبقاء مترجم TypeScript وEslint صامتين. لنصدّر النوع Operation في&nbsp;<em>calculator.ts</em>:

```ts
export type Operation = 'multiply' | 'add' | 'divide';
```

الآن يمكننا استيراد النوع واستخدام تأكيد النوع&nbsp;<em>as</em>&nbsp;لإخبار مترجم TypeScript بنوع المتغير:

```js
import { calculator, type Operation } from './calculator'; // HIGHLIGHT LINE
// ...

app.post('/calculate', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  if ( !value1 || isNaN(Number(value1)) ) {
     return res.status(400).send({ error: '...'});
  }

  const operation = op as Operation;  // HIGHLIGHT LINE
  const result = calculator(Number(value1), Number(value2), operation);  // HIGHLIGHT LINE
  return res.send({ result });
});
```

> لاحظ أننا استوردنا النوع Operation باستخدام الكلمة المفتاحية <em>type</em>:
>
> import { calculator, type Operation } from './calculator';
>
> وهذا مطلوب لأننا نشغّل الشيفرة مباشرةً بـ Node.js، الذي يزيل أنواع TypeScript وقت التشغيل، لذا يجب وسم أي استيرادات للأنواع فقط بهذا الشكل صراحةً.

أصبح للمتغير المعرّف <em>operation</em> الآن نوع Operation، والمترجم راضٍ تماماً، ولا حاجة لإسكات قاعدة Eslint في استدعاء الدالة التالي. وفي الواقع، المتغير الجديد غير مطلوب، إذ يمكن إجراء تأكيد النوع عند تمرير وسيط إلى الدالة:

```js
app.post('/calculate', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // التحقق من البيانات هنا

  const result = calculator(Number(value1), Number(value2), op as Operation); // HIGHLIGHT LINE

  return res.send({ result });
});
```

استخدام تأكيد النوع (أو إسكات قاعدة ESLint) ينطوي دائماً على بعض المخاطرة. فهو يُعفي مترجم TypeScript من المسؤولية، ويثق المترجم فقط بأننا، كمطورين، نعرف ما نفعله. وإذا لم يكن للنوع المؤكَّد <em>القيمة</em> الصحيحة، ستكون النتيجة خطأ وقت التشغيل، لذا يجب أن يكون المرء حذراً جداً عند التحقق من البيانات إذا استُخدم تأكيد النوع.

في الفصل التالي، سنلقي نظرة على&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">تضييق الأنواع</a>&nbsp;الذي سيوفر طريقة أكثر أماناً بكثير لإعطاء نوع أكثر صرامة للبيانات القادمة من مصدر خارجي.

<div class="tasks">

**6. Eslint**

</div>

<div class="tasks">

**7. WebExercises**

</div>

<div class="tasks">

**8. Checkup**

</div>
