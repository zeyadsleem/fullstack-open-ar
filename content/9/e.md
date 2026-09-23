---
part: 9
letter: e
title: "React مع الأنواع"
mainImage: /images/part-9.svg
lang: ar
---
قبل أن نبدأ في التعمّق في كيفية استخدام TypeScript مع React، ينبغي أن ننظر أولاً إلى ما نريد تحقيقه. عندما يعمل كل شيء كما ينبغي، ستساعدنا TypeScript في اكتشاف الأخطاء التالية:
- محاولة تمرير prop إضافي/غير مرغوب إلى مكوّن
- نسيان تمرير prop مطلوب إلى مكوّن
- تمرير prop بنوع خاطئ إلى مكوّن

إذا ارتكبنا أيّاً من هذه الأخطاء، يمكن أن تساعدنا TypeScript في اكتشافها في محرّرنا فوراً. وإذا لم نستخدم TypeScript، فسيتعيّن علينا اكتشاف هذه الأخطاء لاحقاً أثناء الاختبار. وقد نُضطر إلى إجراء بعض تصحيح الأخطاء الممل للعثور على سبب الأخطاء.

هذا قدر كافٍ من التبرير الآن. لنبدأ العمل فعلياً!

### Vite مع TypeScript

يمكننا استخدام&nbsp;<a href="https://vitejs.dev/" target="_blank" rel="noreferrer noopener">Vite</a>&nbsp;لإنشاء تطبيق TypeScript بتحديد قالب&nbsp;<em>react-ts</em>&nbsp;في سكربت التهيئة. لذا لإنشاء تطبيق TypeScript، نفّذ الأمر التالي:

```bash
npm create vite@latest my-app-name -- --template react-ts
```

بعد تنفيذ الأمر، سيكون لديك تطبيق React أساسي كامل يستخدم TypeScript. يمكنك تشغيل التطبيق بتنفيذ <code>npm run dev</code> في جذر التطبيق.

إذا ألقيت نظرة على الملفات والمجلدات، ستلاحظ أن التطبيق لا يختلف كثيراً عن تطبيق يستخدم JavaScript خالصة. الفروق الوحيدة هي أن ملفات <em>.jsx</em> أصبحت الآن ملفات <em>.tsx</em>، وأنها تحتوي على بعض توصيفات الأنواع، وأن المجلد الجذر يحتوي على ملف <em>tsconfig.app.json</em>.

الآن، لنلقِ نظرة على ملف <em>tsconfig.app.json</em> الذي أُنشئ لنا:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* وضع تجميع الحزم */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* فحص الشيفرة */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

```

تشمل <em>compilerOptions</em> الآن المفتاح <em>lib</em> مع <em>DOM</em>، وهو ما يضيف تعريفات أنواع لواجهات بيئة المتصفح مثل <em>document</em>. ومعظم الإعدادات الأخرى واضحة إلى حد ما أو مألوفة لنا بالفعل.

في مشروعنا السابق، استخدمنا ESLint لمساعدتنا في فرض أسلوب كتابة الشيفرة، وسنفعل الشيء نفسه مع هذا التطبيق. لا نحتاج إلى تثبيت أي اعتماديات، لأن Vite تولّى ذلك بالفعل.

عندما ننظر إلى ملف <em>main.tsx</em> الذي أنشأه Vite، يبدو مألوفاً، لكن هناك فرق صغير لكنه ملحوظ؛ إذ توجد علامة تعجّب بعد العبارة <em>document.getElementById('root')</em>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;React.StrictMode&gt;
    &lt;App /&gt;
  &lt;/React.StrictMode&gt;,
)
```

السبب في ذلك أن العبارة قد تُعيد القيمة null، لكن&nbsp;<em>ReactDOM.createRoot</em>&nbsp;لا يقبل null كوسيط. وباستخدام&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-" target="_blank" rel="noreferrer noopener">معامل !</a>، يمكن تأكيد لمترجم TypeScript أن القيمة ليست null.

في وقت سابق من هذا الجزء، <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3">حذّرنا</a> من مخاطر تأكيدات الأنواع، لكن التأكيد مقبول في حالتنا لأننا متأكدون أن ملف <em>index.html</em> يحتوي فعلاً على هذا المعرّف تحديداً، وأن الدالة تُعيد دائماً عنصر HTMLElement.

### مكوّنات React مع TypeScript

لنتأمل مثال React التالي المكتوب بـ JavaScript:

```js
import ReactDOM from 'react-dom/client'

const Welcome = props => {
  return &lt;h1>Hello, {props.name}&lt;/h1>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  &lt;Welcome name="Sarah" />
)
```

في هذا المثال، لدينا مكوّن يُسمى <em>Welcome</em> نمرّر إليه <em>name</em> كـ prop. ثم يعرض الاسم على الشاشة. نحن نعلم أن <em>name</em> ينبغي أن يكون نصاً. وفي React، لا توجد طريقة لضمان استخدام المكوّن استخداماً صحيحاً.

> في إصدارات React الأقدم، كان من الممكن تعريف الأنواع المتوقعة لـ props المكوّن وتلقّي تحذيرات بشأن عدم تطابق الأنواع باستخدام ميزة <a href="https://www.npmjs.com/package/prop-types" target="_blank" rel="noreferrer noopener">prop-types</a>، لكن الدعم لهذا أُزيل في React 19.

مع TypeScript، يمكننا تعريف الأنواع بمساعدة TypeScript، تماماً كما نعرّف الأنواع لدالة عادية، لأن مكوّنات React ليست سوى دوال. سنستخدم interface لأنواع الوسائط (أي props) و<em>JSX.Element</em> كنوع الإرجاع لأي مكوّن React:

```ts
import ReactDOM from 'react-dom/client'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element =&gt; {
  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;Welcome name="Sarah" /&gt;
)
```

عرّفنا نوعاً جديداً هو&nbsp;<em>WelcomeProps</em>، ومرّرناه إلى أنواع وسائط الدالة.

```js
const Welcome = (props: WelcomeProps): JSX.Element =&gt; {
```

يمكنك كتابة الشيء نفسه باستخدام صياغة أكثر إسهاباً:

```ts
const Welcome = ({ name }: { name: string }): JSX.Element =&gt; (
  &lt;h1&gt;Hello, {name}&lt;/h1&gt;
);
```

الآن يعرف محرّرنا أن prop الـ&nbsp;<em>name</em>&nbsp;نص.

لا حاجة فعلياً إلى تعريف نوع الإرجاع لمكوّن React لأن مترجم TypeScript يستنتج النوع تلقائياً، لذا يمكننا أن نكتب فقط:

```ts
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {  // HIGHLIGHT LINE
   return &lt;h1>Hello, {props.name}&lt;/h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;Welcome name="Sarah" />
)
```

<div class="tasks">

**17. الدورة، الخطوة 1**

</div>

### استخدام أعمق للأنواع

في التمرين السابق، كان لدينا ثلاثة أجزاء من دورة، وكانت كل الأجزاء تشترك في الخصيصتين&nbsp;<em>name</em>&nbsp;و<em>exerciseCount</em>. لكن ماذا لو احتجنا خصائص إضافية لجزء معيّن؟ كيف سيبدو ذلك من حيث الشيفرة؟ لنتأمل المثال التالي:

```js
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

في المثال أعلاه، أضفنا بعض الخصائص الإضافية إلى كل جزء من أجزاء الدورة. لكل جزء خاصيتا&nbsp;<em>name</em>&nbsp;و<em>exerciseCount</em>، لكن الجزء الأول والثالث والرابع لها أيضاً خاصية تُسمى&nbsp;<em>description</em>. كما أن الجزأين الثاني والرابع لهما بعض الخصائص الإضافية المميّزة.

لنتخيّل أن تطبيقنا يستمر في النمو، وأننا نحتاج إلى تمرير أجزاء الدورة المختلفة في أنحاء شيفرتنا. وفوق ذلك، تُضاف أيضاً خصائص وأجزاء دورة إضافية إلى المزيج. كيف يمكننا أن نعرف أن شيفرتنا قادرة على التعامل مع كل أنواع البيانات المختلفة بشكل صحيح، وأننا مثلاً لا ننسى عرض جزء دورة جديد في إحدى الصفحات؟ هنا تأتي فائدة TypeScript!

لنبدأ بتعريف أنواع لأجزاء الدورة المختلفة لدينا. نلاحظ أن الأول والثالث لهما المجموعة نفسها من الخصائص. أما الثاني والرابع فمختلفان قليلاً، لذا لدينا ثلاثة أنواع مختلفة من عناصر أجزاء الدورة.

لذا لنعرّف نوعاً لكل نوع مختلف من أجزاء الدورة:

```ts
interface CoursePartBasic {
  name: string;
  exerciseCount: number;
  description: string;
  kind: "basic"
}

interface CoursePartGroup {
  name: string;
  exerciseCount: number;
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground {
  name: string;
  exerciseCount: number;
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

إلى جانب الخصائص الموجودة في أجزاء الدورة المختلفة، أدخلنا الآن خاصية إضافية تُسمى&nbsp;<em>kind</em>&nbsp;لها نوع&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" target="_blank" rel="noreferrer noopener">حرفي</a>&nbsp;(literal)، فهي نص «مُضمَّن مباشرة» مميّز لكل جزء من أجزاء الدورة. وسنرى قريباً أين تُستخدم خاصية kind!

بعد ذلك، سننشئ نوعاً&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" target="_blank" rel="noreferrer noopener">اتحادياً</a>&nbsp;(union) من كل هذه الأنواع. ويمكننا حينها استخدامه لتعريف نوع لمصفوفتنا، والذي ينبغي أن يقبل أي نوع من أنواع أجزاء الدورة هذه:

```ts
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

الآن يمكننا ضبط نوع المتغير&nbsp;<em>courseParts</em>:

```js
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"    // HIGHLIGHT LINE
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"    // HIGHLIGHT LINE
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"    // HIGHLIGHT LINE
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"    // HIGHLIGHT LINE
    },
  ]

  // ...
}
```

لاحظ أننا أضفنا الآن الخاصية&nbsp;<em>kind</em>&nbsp;بقيمة مناسبة إلى كل عنصر من عناصر المصفوفة.

سينبّهنا محرّرنا تلقائياً إذا استخدمنا نوعاً خاطئاً لخاصية، أو استخدمنا خاصية إضافية، أو نسينا ضبط خاصية متوقعة. فإذا حاولنا مثلاً إضافة ما يلي إلى المصفوفة

```
{
  name: "TypeScript in frontend",
  exerciseCount: 10,
  kind: "basic",
},
```

فسنرى فوراً خطأً في المحرّر:

![تحذير بفقدان description](/images/mooc/5bb7273a18a5.webp)

بما أن المدخلة الجديدة لدينا تحتوي على الخاصية&nbsp;<em>kind</em>&nbsp;بقيمة&nbsp;<em>"basic"</em>، تعرف TypeScript أن المدخلة لا تحمل النوع&nbsp;<em>CoursePart</em>&nbsp;فحسب، بل يُقصد بها فعلاً أن تكون&nbsp;<em>CoursePartBasic</em>. إذن هنا «تُضيّق» الخاصية&nbsp;<em>kind</em>&nbsp;نوع المدخلة من نوع أكثر عمومية إلى نوع أكثر تخصيصاً يمتلك مجموعة معيّنة من الخصائص. وسنرى قريباً هذا الأسلوب من تضييق الأنواع مطبَّقاً في الشيفرة!

لكننا لم نكتفِ بعد! فما زال هناك تكرار كثير في أنواعنا، ونريد تجنّب ذلك. نبدأ بتحديد الخصائص المشتركة بين كل أجزاء الدورة، وتعريف نوع أساسي يحتوي عليها. ثم سنقوم بـ<a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types" target="_blank" rel="noreferrer noopener">توسيع</a>&nbsp;(extend) ذلك النوع الأساسي لإنشاء أنواعنا الخاصة بكل kind:

```ts
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

### المزيد من تضييق الأنواع

كيف ينبغي لنا الآن استخدام هذه الأنواع في مكوّناتنا؟

إذا حاولنا الوصول إلى الكائنات في المصفوفة <em>courseParts: CoursePart[],</em> نلاحظ أنه لا يمكن الوصول إلا إلى الخصائص المشتركة بين كل الأنواع في الاتحاد:

![المحرّر يسمح فقط بالوصول إلى الخصائص المشتركة](/images/mooc/ee69c47fc4d6.webp)

وبالفعل، تقول&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types" target="_blank" rel="noreferrer noopener">وثائق</a>&nbsp;TypeScript ما يلي:

> <em>لن تسمح TypeScript بأي عملية (أو وصول إلى خاصية) إلا إذا كانت صالحة لكل عضو من أعضاء الاتحاد.</em>

وتذكر الوثائق أيضاً ما يلي:

> <em>الحل هو تضييق الاتحاد بالشيفرة... ويحدث التضييق عندما تستطيع TypeScript استنتاج نوع أكثر تخصيصاً لقيمة ما بناءً على بنية الشيفرة.</em>

وهكذا مرة أخرى يأتي&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noreferrer noopener">تضييق الأنواع</a>&nbsp;للإنقاذ!

من الطرق العملية لتضييق هذه الأنواع في TypeScript استخدام تعبيرات <em>switch case</em>. فبمجرد أن تستنتج TypeScript أن متغيراً ما من نوع اتحادي وأن كل نوع في الاتحاد يحتوي على خاصية حرفية معيّنة (وهي <em>kind</em> في حالتنا)، يمكننا استخدامها كمعرّف للنوع. ثم نبني switch case حول تلك الخاصية، وستعرف TypeScript أي الخصائص متاحة داخل كل كتلة case:

![يُظهر VS Code الآن خصائص أكثر عند تضييق النوع في حالات

  courseParts.forEach(part => {
    switch (part.kind) {
      case "basic":
        console.log(part.name, part.description, part.exerciseCount);
        break;
      case "group":
        console.log(part.name, part.exerciseCount, part.groupProjectCount);
        break;
      case "background":
        console.log(part.name, part.description, part.backgroundMaterial);
        break;](/images/mooc/d9d3b619180d.webp)

في المثال أعلاه، تعرف TypeScript أن&nbsp;<em>part</em>&nbsp;من النوع&nbsp;<em>CoursePart</em>، ثم تستنتج أن&nbsp;<em>part</em>&nbsp;إما من النوع&nbsp;<em>CoursePartBasic</em>&nbsp;أو&nbsp;<em>CoursePartGroup</em>&nbsp;أو&nbsp;<em>CoursePartBackground</em>&nbsp;بناءً على قيمة الخاصية&nbsp;<em>kind</em>.

التقنية المحددة لتضييق الأنواع حيث يُضيّق نوع اتحادي بناءً على قيمة خاصية حرفية تُسمى&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions" target="_blank" rel="noreferrer noopener">الاتحاد المُميَّز</a>&nbsp;(discriminated union).

لاحظ أن التضييق يمكن بطبيعة الحال أن يجري أيضاً باستخدام جملة&nbsp;<em>if</em>. فيمكننا مثلاً فعل ما يلي:

```
  courseParts.forEach(part =&gt; {
    if (part.kind === 'background') {
      console.log('see the following:', part.backgroundMaterial)
    }

    // لا يمكن الإشارة إلى part.backgroundMaterial هنا!
  });
```

ماذا عن إضافة أنواع جديدة؟ لو أردنا إضافة جزء دورة جديد، ألن يكون من الجيد أن نعرف ما إذا كنا قد نفّذنا بالفعل التعامل مع ذلك النوع في شيفرتنا؟ في المثال أعلاه، سيذهب النوع الجديد إلى كتلة&nbsp;<em>default</em>&nbsp;ولن يُطبع أي شيء للنوع الجديد. هذا مقبول تماماً أحياناً. فمثلاً، إذا أردت التعامل مع حالات محددة فقط (وليست كلها) من اتحاد أنواع، فوجود default أمر لا بأس به. ومع ذلك، يُوصى في معظم الحالات بالتعامل مع كل التباينات بشكل منفصل.

مع TypeScript، يمكننا استخدام أسلوب يُسمى&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking" target="_blank" rel="noreferrer noopener">الفحص الشامل للأنواع</a>&nbsp;(exhaustive type checking). ومبدؤه الأساسي أنه إذا صادفنا قيمة غير متوقعة، نستدعي دالة تقبل قيمة من النوع&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type" target="_blank" rel="noreferrer noopener">never</a>&nbsp;ويكون نوع إرجاعها أيضاً <em>never</em>.

قد تبدو نسخة مباشرة من الدالة هكذا:

```js
/**
 * دالة مساعدة للفحص الشامل للأنواع
 */
const assertNever = (value: never): never =&gt; {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

إذا استبدلنا الآن محتوى كتلة&nbsp;<em>default</em>&nbsp;لدينا بما يلي:

```js
default:
  return assertNever(part);
```

وأزلنا الحالة التي تتعامل مع النوع <em>CoursePartBackground</em>، فسنرى الخطأ التالي:

![يظهر خطأ إذا لم تكن حالات switch شاملة](/images/mooc/f79e544ebda4.webp)

تقول رسالة الخطأ إن

```
'CoursePartBackground' is not assignable to parameter of type 'never'.
```

وهو ما يخبرنا بأننا نستخدم متغيراً في موضع لا ينبغي أن يُستخدم فيه أبداً. وهذا يخبرنا بأن هناك شيئاً يحتاج إلى إصلاح.

<div class="tasks">

**18. الدورة، الجزء 2**

</div>

### تطبيق React مع الحالة

حتى الآن، نظرنا فقط إلى تطبيق يحفظ كل البيانات في متغير مُنمّط لكنه لا يحتوي على أي حالة. لنعد مرة أخرى إلى تطبيق <em>الملاحظات</em> القديم الجيد ونبنِ نسخة مُنمّطة منه.

نبدأ بالشيفرة التالية:

```js
import { useState } from 'react';

const App = () =&gt; {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  return null
}
```

عندما نمرّر مؤشر الفأرة فوق استدعاءات&nbsp;<em>useState</em>&nbsp;في المحرّر، نلاحظ أمرين مثيرين للاهتمام.

يبدو نوع الاستدعاء الأول&nbsp;<em>useState('')</em>&nbsp;هكذا:

```ts
useState&lt;string&gt;(initialState: string | (() =&gt; string)):
  [string, React.Dispatch&lt;React.SetStateAction&lt;string&gt;&gt;]
```

النوع صعب الفكّ إلى حد ما. وله «الشكل» التالي:

```
functionName(parameters): return_value
```

إذن نلاحظ أن مترجم TypeScript استنتج أن الحالة الأولية إما نص أو دالة تُعيد نصاً:

```ts
initialState: string | (() =&gt; string))
```

ونوع المصفوفة المُعادة هو التالي:

```
[string, React.Dispatch&lt;React.SetStateAction&lt;string&gt;&gt;]
```

إذن العنصر الأول، المُسنَد إلى&nbsp;<em>newNote</em>، هو نص، والعنصر الثاني الذي أسنَدناه إلى&nbsp;<em>setNewNote</em>&nbsp;له نوع أكثر تعقيداً قليلاً. نلاحظ أن هناك ذكراً لنص ما، لذا نعرف أنه لا بد أن يكون نوع دالة تضبط بيانات ذات قيمة. انظر&nbsp;<a href="https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/" target="_blank" rel="noreferrer noopener">هنا</a>&nbsp;إذا أردت معرفة المزيد عن أنواع دالة useState.

من كل هذا نرى أن TypeScript قد&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content" target="_blank" rel="noreferrer noopener">استنتجت</a>&nbsp;نوع أول useState بشكل صحيح، فأُنشئت حالة من النوع string.

وعندما ننظر إلى useState الثاني الذي له القيمة الأولية&nbsp;<em>[]</em>&nbsp;، يبدو النوع مختلفاً تماماً

```
useState&lt;never[]&gt;(initialState: never[] | (() =&gt; never[])):
  [never[], React.Dispatch&lt;React.SetStateAction&lt;never[]&gt;&gt;]
```

تستطيع TypeScript فقط استنتاج أن الحالة من النوع&nbsp;<em>never[]</em>، فهي مصفوفة لكن ليس لديها أي فكرة عن العناصر المخزَّنة فيها، لذا من الواضح أننا نحتاج إلى مساعدة المترجم وتقديم النوع صراحةً.

من أفضل المصادر للمعلومات عن تنميط React هو&nbsp;<a href="https://react-typescript-cheatsheet.netlify.app/" target="_blank" rel="noreferrer noopener">ورقة غش React وTypeScript</a>. ويوجّهنا فصل الورقة الخاص بخطاف&nbsp;<a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate" target="_blank" rel="noreferrer noopener">useState</a>&nbsp;إلى استخدام&nbsp;<em>وسيط نوع</em>&nbsp;(type parameter) في الحالات التي لا يستطيع فيها المترجم استنتاج النوع.

لنعرّف الآن نوعاً للملاحظات:

```ts
interface Note {
  id: string,
  content: string
}
```

الحل الآن بسيط:

```js
const [notes, setNotes] = useState&lt;Note[]&gt;([]);
```

وبالفعل، ضُبط النوع بشكل صحيح:

```
useState&lt;Note[]&gt;(initialState: Note[] | (() =&gt; Note[])):
  [Note[], React.Dispatch&lt;React.SetStateAction&lt;Note[]&gt;&gt;]
```

إذن، بمصطلحات تقنية، useState هي&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" target="_blank" rel="noreferrer noopener">دالة عامة</a>&nbsp;(generic function)، حيث يجب تحديد النوع كـ<em>وسيط نوع</em>&nbsp;في الحالات التي لا يستطيع فيها المترجم استنتاج النوع.

أصبح عرض الملاحظات الآن سهلاً. لنضف فقط بعض البيانات إلى الحالة حتى نرى أن الشيفرة تعمل:

```ts
interface Note {
  id: string,
  content: string
}

import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([
    { id: '1', content: 'testing' } // HIGHLIGHT LINE
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    &lt;div>
      &lt;ul>
// BEGIN HIGHLIGHT
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
// END HIGHLIGHT
      &lt;/ul>
    &lt;/div>
  )
}
```

المهمة التالية هي إضافة نموذج يتيح إنشاء ملاحظات جديدة:

```js
const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([
    { id: 1, content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;form>
        &lt;input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
         />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
// END HIGHLIGHT
      &lt;ul>
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
      &lt;/ul>
    &lt;/div>
  )
}
```

إنها تعمل ببساطة، ولا توجد أي شكاوى بشأن الأنواع! وعندما نمرّر مؤشر الفأرة فوق <em>event.target.value</em>، نرى أنه نص بالفعل، وهو بالضبط ما هو متوقع لوسيط <em>setNewNote</em>:

![يُظهر VS Code أن event.target.value نص](/images/mooc/6ae292f825ba.webp)

إذن ما زلنا نحتاج إلى معالج الحدث لإضافة الملاحظة الجديدة. لنجرّب ما يلي:

```js
const App = () => {
  // ...

  const noteCreation = (event) => {
    event.preventDefault()
    // ...
  };

  return (
    &lt;div>
      &lt;form onSubmit={noteCreation}> // HIGHLIGHT LINE
        &lt;input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
      // ...
    &lt;/div>
  )
}
```

إنها لا تعمل تماماً، فهناك خطأ من ESLint يشكو من any ضمني:

![يُظهر VS Code خطأً بأن الحدث من النوع any](/images/mooc/fa387bd9e00c.webp)

ليس لدى مترجم TypeScript الآن أي فكرة عن نوع الوسيط، ولهذا يكون النوع هو any الضمني سيئ السمعة الذي نريد <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-3" target="_blank" rel="noreferrer noopener">تجنّبه</a> بأي ثمن. وتأتي ورقة غش React وTypeScript للإنقاذ مرة أخرى. إذ يكشف الفصل الخاص بـ<a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" target="_blank" rel="noreferrer noopener">النماذج والأحداث</a> أن النوع الصحيح لمعالج الحدث هو <em>React.SyntheticEvent</em>.

تصبح الشيفرة

```ts
interface Note {
  id: string,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([]);
  const [newNote, setNewNote] = useState('');

// BEGIN HIGHLIGHT
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const noteToAdd = {
      content: newNote,
      id: String(notes.length + 1)
    }
    setNotes(notes.concat(noteToAdd));
    setNewNote('')
  };
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;form onSubmit={noteCreation}>
        &lt;input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        &lt;button type='submit'>add&lt;/button>
      &lt;/form>
      &lt;ul>
        {notes.map(note =>
          &lt;li key={note.id}>{note.content}&lt;/li>
        )}
      &lt;/ul>
    &lt;/div>
  )
}
```

وهذا كل شيء، تطبيقنا جاهز ومُنمّط بإتقان!

### التواصل مع الخادم

لنعدّل التطبيق بحيث تُحفظ الملاحظات في واجهة خلفية من نوع JSON server على الرابط&nbsp;<a href="http://localhost:3001/notes" target="_blank" rel="noreferrer noopener">http://localhost:3001/notes</a>

كما اعتدنا، سنستخدم Axios وخطاف useEffect لجلب الحالة الأولية من الخادم.

لنجرّب ما يلي:

```js
import axios from 'axios';

// ...

const App = () => {
  // ...
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
  // ...
}
```

عندما نمرّر مؤشر الفأرة فوق <em>response.data</em> نرى أن نوعه <em>any</em>

![نرى أن response من النوع any](/images/mooc/b341c307a568.webp)

لكي نضبط البيانات في الحالة باستخدام الدالة&nbsp;<em>setNotes</em>&nbsp;يجب أن ننمّطها بشكل صحيح.

مع قليل من&nbsp;<a href="https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps" target="_blank" rel="noreferrer noopener">المساعدة من الإنترنت</a>، نجد حيلة ذكية:

```
  useEffect(() => {
    axios.get&lt;Note[]>('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
```

عندما نمرّر مؤشر الفأرة فوق response.data نرى أن نوعه صحيح:

![فجأة أصبح response.data من النوع Note[]](/images/mooc/6aebedc988f2.webp)

يمكننا الآن ضبط البيانات في الحالة&nbsp;<em>notes</em>&nbsp;لتعمل الشيفرة:

```
  useEffect(() => {
    axios.get&lt;Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data)
    })
  }, [])
```

إذن، تماماً كما في حالة&nbsp;<em>useState</em>، أعطينا وسيط نوع إلى&nbsp;<em>axios.get</em>&nbsp;لنوجّهه إلى كيفية إجراء التنميط. وتماماً مثل&nbsp;<em>useState</em>، فإن&nbsp;<em>axios.get</em>&nbsp;أيضاً&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" target="_blank" rel="noreferrer noopener">دالة عامة</a>. وعلى عكس بعض الدوال العامة، فإن وسيط النوع في&nbsp;<em>axios.get</em>&nbsp;له قيمة افتراضية هي&nbsp;<em>any</em>&nbsp;، لذا إذا استُخدمت الدالة دون تعريف وسيط النوع، فسيكون نوع بيانات الاستجابة any.

الشيفرة تعمل، والمترجم وESLint سعيدان وملتزمان الصمت. غير أن إعطاء وسيط نوع إلى <em>axios.get</em> أمر قد يكون خطيراً. إذ <em>قد يحتوي جسم الاستجابة على بيانات بشكل عشوائي</em>، وعندما نعطي وسيط نوع، فإننا ببساطة نطلب من مترجم TypeScript أن يثق بنا في أن البيانات من النوع <em>Note[]</em>.

لذا فشيفرتنا في جوهرها آمنة بقدر ما ستكون عليه لو استُخدم&nbsp;<a href="/part9#type-assertion" target="_blank" rel="noreferrer noopener">تأكيد نوع</a>&nbsp;(وهذا ليس جيداً):

```
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      // response.body من النوع any
      setNotes(response.data as Note[])
    })
  }, [])
```

بما أن أنواع TypeScript لا وجود لها حتى وقت التشغيل، فشيفرتنا لا تمنحنا أي أمان ضد الحالات التي يحتوي فيها جسم الطلب على بيانات بشكل خاطئ.

قد يكون إعطاء وسيط نوع إلى <em>axios.get</em> مقبولاً إذا كنا <em>متأكدين تماماً</em> أن الواجهة الخلفية تتصرف بشكل صحيح وتُعيد البيانات دائماً بالشكل الصحيح. وإذا أردنا بناء نظام متين، ينبغي أن نستعد للمفاجآت ونحلّل بيانات الاستجابة (على غرار ما فعلناه <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4" target="_blank" rel="noreferrer noopener">في القسم السابق</a> مع الطلبات إلى الواجهة الخلفية).

لنُكمل الآن تطبيقنا بتنفيذ إضافة الملاحظة الجديدة:

```js
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
// BEGIN HIGHLIGHT
    axios.post&lt;Note>('http://localhost:3001/notes', { content: newNote })
      .then(response => {
        setNotes(notes.concat(response.data))
      })
// END HIGHLIGHT
    setNewNote('')
  };
```

نمنح&nbsp;<em>axios.post</em>&nbsp;مرة أخرى وسيط نوع. نحن نعلم أن استجابة الخادم هي الملاحظة المضافة، لذا فوسيط النوع المناسب هو&nbsp;<em>Note</em>.

لنرتّب الشيفرة قليلاً. لتعريفات الأنواع، ننشئ ملفاً باسم&nbsp;<em>types.ts</em>&nbsp;بالمحتوى التالي:

```ts
export interface Note {
  id: string,
  content: string
}

export type NewNote = Omit&lt;Note, 'id'&gt;
```

أضفنا نوعاً جديداً لـ<em>ملاحظة جديدة</em>، وهي ملاحظة لم يُسنَد إليها حقل <em>id</em> بعد.

كما استُخرجت الشيفرة التي تتواصل مع الواجهة الخلفية إلى وحدة في ملف&nbsp;<em>noteService.ts</em>

```js
import axios from 'axios'
import type { Note, NewNote } from './types'

const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios
    .get&lt;Note[]>(baseUrl)
    .then(response => response.data)
}

const create = (object: NewNote) => {
  return axios
    .post&lt;Note>(baseUrl, object)
    .then(response => response.data)
}

export default { getAll, create }

```

أصبح المكوّن&nbsp;<em>App</em>&nbsp;الآن أنظف بكثير:

```js
import { useState, useEffect } from 'react'
import type { Note } from './types'
import noteService from './noteService'

const App = () => {
  const [notes, setNotes] = useState&lt;Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    noteService.create({ content: newNote })
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
    setNewNote('')
  };

  return (
    // ...
  )
}

export default App

```

أصبح التطبيق الآن مُنمّطاً بشكل جيد وجاهزاً لمزيد من التطوير!

يمكن العثور على شيفرة تطبيق الملاحظات المُنمّط&nbsp;<a href="https://github.com/fullstack-hy2020/typed-notes" target="_blank" rel="noreferrer noopener">هنا</a>.

### ملاحظة حول تعريف أنواع الكائنات

استخدمنا&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" target="_blank" rel="noreferrer noopener">واجهات</a>&nbsp;(interfaces) لتعريف أنواع الكائنات، مثل مدخلات اليوميات، في القسم السابق

```ts
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

وفي جزء الدورة في هذا القسم

```ts
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

كان يمكننا فعلاً تحقيق الأثر نفسه باستخدام&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" target="_blank" rel="noreferrer noopener">اسم مستعار للنوع</a>&nbsp;(type alias)

```ts
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

في معظم الحالات، يمكنك استخدام <em>type</em> أو <em>interface</em>، أيّهما شئت من الصياغتين. غير أن هناك بعض الأمور التي ينبغي وضعها في الاعتبار. فمثلاً، إذا عرّفت عدة واجهات (interfaces) بالاسم نفسه، فستؤدي إلى واجهة مدموجة، بينما إذا حاولت تعريف عدة أنواع بالاسم نفسه، فسيؤدي ذلك إلى خطأ يفيد بأن نوعاً بالاسم نفسه مُعلَن بالفعل.

وتوصي&nbsp;<a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces" target="_blank" rel="noreferrer noopener">وثائق TypeScript باستخدام interfaces</a>&nbsp;في معظم الحالات.

<div class="tasks">

**19. يوميات الطيران، الخطوة 1**

</div>

<div class="tasks">

**20. يوميات الطيران، الخطوة 2**

</div>

<div class="tasks">

**21. يوميات الطيران، الخطوة 3**

</div>

<div class="tasks">

**22. يوميات الطيران، الخطوة 4**

</div>
