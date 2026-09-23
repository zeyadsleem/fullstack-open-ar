---
part: 9
letter: f
title: "الختام الكبير: Patientor"
mainImage: /images/part-9.svg
lang: ar
---
### العمل مع قاعدة شيفرة قائمة

عند الغوص في قاعدة شيفرة قائمة للمرة الأولى، من الجيد أن تحصل على نظرة شاملة على أعراف المشروع وبنيته. يمكنك أن تبدأ بحثك بقراءة&nbsp;<em>README.md</em>&nbsp;في جذر المستودع. يحتوي README عادةً على وصف موجز للتطبيق ومتطلبات استخدامه، وكذلك كيفية تشغيله للتطوير. وإذا لم يكن README متوفراً أو «وفّر» أحدهم وقته وتركه مجرد هيكل فارغ، يمكنك إلقاء نظرة على&nbsp;<em>package.json</em>. ومن الأفكار الجيدة دائماً أن تشغّل التطبيق وتتنقّل فيه للتأكد من أن بيئة التطوير لديك صالحة للعمل.

يمكنك أيضاً تصفّح بنية المجلدات للحصول على بعض الإلمام بوظائف التطبيق و/أو البنية المعمارية المستخدمة. ليست هذه الأمور واضحة دائماً، وقد يكون المطوّرون قد اختاروا طريقة لتنظيم الشيفرة غير مألوفة لك. <a href="https://github.com/fullstack-hy2020/fs-typescript/tree/main/patientor/frontend" target="_blank" rel="noreferrer noopener">المشروع النموذجي</a> المستخدم في بقية هذا الجزء منظَّم حسب الميزات. يمكنك أن ترى ما الصفحات التي يضمها التطبيق، وبعض المكوّنات العامة، مثل النوافذ المنبثقة (modals) والحالة. ضع في اعتبارك أن الميزات قد تختلف في نطاقها. فالنوافذ المنبثقة، مثلاً، مكوّنات ظاهرة على مستوى واجهة المستخدم، أما الحالة فتقارب منطق العمل وتحافظ على تنظيم البيانات في الخفاء لتستخدمها بقية أجزاء التطبيق.

يوفّر TypeScript أنواعاً لما ينبغي توقّعه من بنى بيانات ودوال ومكوّنات وحالة. يمكنك أن تحاول البحث عن <em>types.ts</em> أو شيء مشابه للبدء. VSCode عون كبير، ومجرد تظليل المتغيرات والمعاملات قد يمنحك قدراً كبيراً من الفهم. يعتمد كل هذا بطبيعة الحال على كيفية استخدام الأنواع في المشروع.

إذا كان المشروع يضم اختبارات وحدة أو تكامل أو من الطرف إلى الطرف، فمن المرجح أن تكون قراءتها مفيدة. فحالات الاختبار هي أداتك الأهم عند إعادة هيكلة التطبيق أو إضافة ميزات جديدة إليه. أنت تريد أن تتأكد من عدم كسر أي ميزة قائمة أثناء العبث بالشيفرة. ويمكن أن يرشدك TypeScript أيضاً في أنواع المعاملات والقيم المُعادة عند تغيير الشيفرة.

تذكّر أن قراءة الشيفرة مهارة بحد ذاتها، فلا تقلق إن لم تفهم الشيفرة من القراءة الأولى. فقد تحتوي الشيفرة على حالات حافة كثيرة، وربما أُضيفت أجزاء من المنطق هنا وهناك طوال دورة تطويرها. من الصعب تخيّل نوع المشكلات التي صارعها المطوّر السابق. فكّر في الأمر كله مثل <a href="https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings" target="_blank" rel="noreferrer noopener">حلقات النمو في الأشجار</a>. يتطلب فهم كل شيء التعمق في الشيفرة ومتطلبات مجال العمل. وكلما قرأت شيفرة أكثر، تحسّنت في فهمها. ومن المرجح أن تقرأ في حياتك شيفرة أكثر بكثير مما ستكتبه.

### واجهة Patientor الأمامية

حان وقت العمل الجاد لإتمام الواجهة الأمامية للواجهة الخلفية التي بنيناها في التمارين <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4" target="_blank" rel="noreferrer noopener">9-16</a>. بل سنحتاج فعلاً إلى إضافة بعض الميزات الجديدة إلى الواجهة الخلفية لإنجاز التطبيق.

قبل الغوص في الشيفرة، لنشغّل كلاً من الواجهة الأمامية والواجهة الخلفية.

إذا سار كل شيء على ما يرام، ينبغي أن ترى صفحة لقائمة المرضى. تجلب هذه الصفحة قائمة المرضى من واجهتنا الخلفية، وتعرضها على الشاشة في جدول بسيط. وهناك أيضاً زر لإنشاء مرضى جدد في الواجهة الخلفية. ولأننا نستخدم بيانات وهمية بدلاً من قاعدة بيانات، لن تبقى البيانات محفوظة - فإغلاق الواجهة الخلفية سيحذف كل البيانات التي أضفناها. لم يكن تصميم واجهة المستخدم نقطة قوة لدى المنشئين، لذا لنتجاهل واجهة المستخدم في الوقت الحالي.

بعد التحقق من أن كل شيء يعمل، يمكننا البدء بدراسة الشيفرة. كل الأمور المثيرة موجودة في&nbsp;<em>src</em>. ومن باب التسهيل، يوجد بالفعل ملف&nbsp;<em>types.ts</em>&nbsp;للأنواع الأساسية المستخدمة في التطبيق، وسيتعين عليك توسيعه أو إعادة هيكلته في التمارين.

من حيث المبدأ، يمكننا استخدام الأنواع نفسها لكل من الواجهة الخلفية والواجهة الأمامية، لكن الواجهة الأمامية عادةً ما تكون لها بنى بيانات وحالات استخدام مختلفة للبيانات، ما يجعل الأنواع مختلفة. فمثلاً، للواجهة الأمامية حالة وقد ترغب في حفظ البيانات في كائنات أو خرائط بينما تستخدم الواجهة الخلفية مصفوفة. وقد لا تحتاج الواجهة الأمامية إلى كل حقول كائن البيانات المحفوظ في الواجهة الخلفية، وقد تحتاج إلى إضافة بعض الحقول الجديدة لاستخدامها في العرض.

تبدو بنية المجلدات كما يلي:

![بنية مجلدات الواجهة الأمامية](/images/mooc/a51b184e0625.webp)

إلى جانب مكوّن&nbsp;<em>App</em>&nbsp;ومجلد للخدمات، هناك حالياً ثلاثة مكوّنات رئيسية:&nbsp;<em>AddPatientModal</em>&nbsp;و&nbsp;<em>PatientListPage</em>&nbsp;وكلاهما معرّف في مجلد، ومكوّن&nbsp;<em>HealthRatingBar</em>&nbsp;المعرّف في ملف. وإذا كان لمكوّن ما بعض المكوّنات الفرعية غير المستخدمة في مكان آخر في التطبيق، فقد تكون فكرة جيدة تعريف المكوّن ومكوّناته الفرعية في مجلد. فمثلاً، الآن يُعرَّف AddPatientModal في الملف&nbsp;<em>components/AddPatientModal/index.tsx</em>&nbsp;ومكوّنه الفرعي&nbsp;<em>AddPatientForm</em>&nbsp;في ملف خاص به ضمن المجلد نفسه.

لا شيء مفاجئاً كثيراً في الشيفرة. الحالة والتواصل مع الواجهة الخلفية مُنفَّذان بخطاف&nbsp;<em>useState</em>&nbsp;وAxios، على غرار تطبيق الملاحظات في القسم السابق. وتُستخدم <a href="/part5/react_router_ui_frameworks#ui-libraries" target="_blank" rel="noreferrer noopener">Material UI</a>&nbsp;لتنسيق التطبيق، وبنية التنقّل مُنفَّذة بـ<a href="/part5/react_router_ui_frameworks#react-router" target="_blank" rel="noreferrer noopener">React Router</a>، وكلاهما مألوف لنا من الجزء 5 من المقرر.

من ناحية الأنواع، هناك أمران مثيران للاهتمام. يمرّر مكوّن&nbsp;<em>App</em>&nbsp;الدالة&nbsp;<em>setPatients</em>&nbsp;كـ prop إلى مكوّن&nbsp;<em>PatientListPage</em>:

```js
const App = () => {
  const [patients, setPatients] = useState&lt;Patient[]>([]);
  // ...

  return (
    &lt;div className="App">
      &lt;Router>
        &lt;Container>
          &lt;Routes>
            // ...
            &lt;Route path="/" element={
              &lt;PatientListPage
                patients={patients}
                setPatients={setPatients} // HIGHLIGHT LINE
              />}
            />
          &lt;/Routes>
        &lt;/Container>
      &lt;/Router>
    &lt;/div>
  );
};
```

لإبقاء مترجم TypeScript راضياً، تُكتب الـ props بالأنواع كما يلي:

```js
interface Props {
  patients : Patient[]
  setPatients: React.Dispatch&lt;React.SetStateAction&lt;Patient[]&gt;&gt;
}

const PatientListPage = ({ patients, setPatients } : Props ) =&gt; {
  // ...
}
```

إذن نوع الدالة <em>setPatients</em> هو <em>React.Dispatch&lt;React.SetStateAction&lt;Patient[]>></em>. يمكننا رؤية النوع في المحرر عند مرور المؤشر فوق الدالة:

![يوضّح VS Code نوع setPatients](/images/mooc/f0bade821134.webp)

يضم <a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example#basic-prop-types-examples" target="_blank" rel="noreferrer noopener">React TypeScript cheatsheet</a>&nbsp;قائمة جميلة جداً بأنواع الـ props النموذجية، ويمكننا الاستعانة بها إذا لم يكن إيجاد الكتابة المناسبة للأنواع لـ props أمراً بديهياً.

يمرّر <em>PatientListPage</em>&nbsp;أربعة props إلى مكوّن&nbsp;<em>AddPatientModal</em>. اثنان من هذه الـ props دالتان. لنلقِ نظرة على كيفية كتابتهما بالأنواع:

```js
const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState&lt;boolean>(false);
  const [error, setError] = useState&lt;string>();

  // ...

  const closeModal = (): void => { // HIGHLIGHT LINE
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => { // HIGHLIGHT LINE
    // ...
  };
  // ...

  return (
    &lt;div className="App">
      // ...
      &lt;AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient} // HIGHLIGHT LINE
        error={error}
        onClose={closeModal} // HIGHLIGHT LINE
      />
    &lt;/div>
  );
};
```

تبدو الأنواع كما يلي:

```ts
interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => Promise&lt;void>;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  // ...
}
```

<em>onClose</em>&nbsp;مجرد دالة لا تأخذ أي معاملات ولا تعيد شيئاً، لذا فنوعها هو:

```
() =&gt; void
```

"نوع <code>onSubmit</code> أكثر إثارة للاهتمام قليلاً. فهو يأخذ معاملاً واحداً من النوع <code>PatientFormValues</code>، ولأنه دالة غير متزامنة، يعيد <code>Promise</code>. ولأن الدالة لا تعيد قيمة، فالنوع الكامل هو:

```
(values: PatientFormValues) => Promise&lt;void>
```

<div class="tasks">

**23. Patientor، الخطوة 1**

</div>

<div class="tasks">

**24. Patientor، الخطوة 2**

</div>

### المدخلات الكاملة

في <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4#5d956dd3-2171-4755-a813-550d9bc68124">التمرين 11</a>، نفّذنا نقطة نهاية لجلب معلومات عن تشخيصات مختلفة، لكننا ما زلنا لا نستخدم تلك النقطة إطلاقاً. ولأن لدينا الآن صفحة لعرض معلومات المريض، سيكون من الجميل توسيع بياناتنا قليلاً. لنضف حقلاً من نوع <em>Entry</em> إلى بيانات المريض بحيث تحتوي بيانات المريض على مدخلاته الطبية، بما في ذلك التشخيصات المحتملة.

لنتخلّص من بيانات المرضى الأولية القديمة في الواجهة الخلفية ونبدأ باستخدام <a href="https://github.com/fullstack-hy2020/misc/blob/master/patients-full.ts" target="_blank" rel="noreferrer noopener">هذه الصيغة الموسّعة</a>.

لننشئ الآن نوع <em>Entry</em> مناسباً استناداً إلى البيانات التي لدينا.

إذا أمعنّا النظر في البيانات، نرى أن المدخلات مختلفة تماماً عن بعضها. فلنلقِ نظرة، مثلاً، على المدخلين الأولين:

```
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: '2015-01-16',
    criteria: 'Thumb has healed.',
  }
}
...
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'MD House',
  employerName: 'HyPD',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description:
    'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

نلاحظ فوراً أنه في حين أن الحقول الأولى متماثلة، يحتوي المدخل الأول على حقل <em>discharge</em> ويحتوي المدخل الثاني على الحقلين <em>employerName</em> و<em>sickLeave</em>. ويبدو أن لجميع المدخلات بعض الحقول المشتركة، لكن بعض الحقول خاصة بكل مدخل.

عند النظر إلى <em>type</em>، نرى أن هناك ثلاثة أنواع من المدخلات:
- <em>OccupationalHealthcare</em>
- <em>Hospital</em>
- <em>HealthCheck</em>

يشير هذا إلى أننا بحاجة إلى ثلاثة أنواع منفصلة. ولأنها جميعاً تشترك في بعض الحقول، قد نرغب ببساطة في إنشاء واجهة مدخل أساسية يمكننا توسيعها بالحقول المختلفة في كل نوع.

عند النظر إلى البيانات، يبدو أن الحقول&nbsp;<em>id</em>&nbsp;و&nbsp;<em>description</em>&nbsp;و&nbsp;<em>date</em>&nbsp;و&nbsp;<em>specialist</em>&nbsp;موجودة في كل مدخل. علاوة على ذلك، يبدو أن&nbsp;<em>diagnosisCodes</em>&nbsp;موجود فقط في مدخل واحد من نوع&nbsp;<em>OccupationalHealthcare</em>&nbsp;ومدخل واحد من نوع&nbsp;<em>Hospital</em>. ولأنه لا يُستخدم دائماً حتى في هذين النوعين من المدخلات، فمن الآمن افتراض أن الحقل اختياري. ويمكننا أن نفكر في إضافته إلى نوع&nbsp;<em>HealthCheck</em>&nbsp;أيضاً لأنه ربما لم يُستخدم فقط في هذه المدخلات تحديداً.

إذن سيكون <em>BaseEntry</em>&nbsp;الذي يمكن توسيع كل نوع منه كما يلي:

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

إذا أردنا ضبطه أكثر قليلاً، فبما أن لدينا بالفعل نوع&nbsp;<em>Diagnosis</em>&nbsp;معرّفاً في الواجهة الخلفية، قد نرغب ببساطة في الإشارة إلى حقل&nbsp;<em>code</em>&nbsp;من نوع&nbsp;<em>Diagnosis</em>&nbsp;مباشرةً في حال تغيّر نوعه يوماً ما. يمكننا فعل ذلك هكذا:

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnosis['code'][]; // HIGHLIGHT LINE
}
```

كما ذُكر <a href="/part9/first_steps_with_typescript#the-alternative-array-syntax" target="_blank" rel="noreferrer noopener">سابقاً في هذا الجزء</a>، يمكننا تعريف مصفوفة بالصيغة&nbsp;<em>Array&lt;Type&gt;</em>&nbsp;بدلاً من تعريفها&nbsp;<em>Type[]</em>. في هذه الحالة تحديداً، تبدأ كتابة&nbsp;<em>Diagnosis['code'][]</em>&nbsp;تبدو غريبة بعض الشيء، لذا سنقرر استخدام الصيغة البديلة (التي توصي بها أيضاً قاعدة ESlint المسماة <a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">array-simple</a>):

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array&lt;Diagnosis['code']>; // HIGHLIGHT LINE
}
```

الآن وقد عرّفنا <em>BaseEntry</em>، يمكننا البدء بإنشاء أنواع المدخلات الموسّعة التي سنستخدمها فعلاً. لنبدأ بإنشاء نوع&nbsp;<em>HealthCheckEntry</em>.

تحتوي المدخلات من نوع <em>HealthCheck</em> على الحقل <em>HealthCheckRating</em>، وهو عدد صحيح من 0 إلى 3، حيث يعني الصفر <em>Healthy</em> ويعني الثلاثة <em>CriticalRisk</em>. هذه حالة مثالية لـ<em>const as object</em>. وبهذه المواصفات، يمكننا كتابة تعريف نوع <em>HealthCheckEntry</em> كما يلي:

```ts
const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
```

الآن نحتاج فقط إلى إنشاء نوعي&nbsp;<em>OccupationalHealthcareEntry</em>&nbsp;و&nbsp;<em>HospitalEntry</em>&nbsp;حتى نتمكن من دمجهما في اتحاد (union) وتصديرهما كنوع Entry هكذا:

```ts
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

### Omit مع الاتحادات

ثمة نقطة مهمة تتعلق بالاتحادات: عندما تستخدمها مع&nbsp;<em>Omit</em>&nbsp;لاستبعاد خاصية ما، فإنها تعمل بطريقة قد تكون غير متوقعة. لنفترض أننا نريد إزالة&nbsp;<em>id</em>&nbsp;من كل&nbsp;<em>Entry</em>. قد نفكر في استخدام

```
Omit&lt;Entry, 'id'&gt;
```

لكن <a href="https://github.com/microsoft/TypeScript/issues/42680" target="_blank" rel="noreferrer noopener">ذلك لن يعمل كما قد نتوقع</a>. في الواقع، سيحتوي النوع الناتج على الخصائص المشتركة فقط، وليس الخصائص غير المشتركة بينها. ومن الحلول البديلة الممكنة تعريف دالة خاصة شبيهة بـOmit للتعامل مع مثل هذه الحالات:

```ts
// تعريف Omit خاص للاتحادات
type UnionOmit&lt;T, K extends string | number | symbol&gt; = T extends unknown ? Omit&lt;T, K&gt; : never;
// تعريف Entry بدون خاصية 'id'
type EntryWithoutId = UnionOmit&lt;Entry, 'id'&gt;;
```

الآن أصبحنا مستعدين لوضع اللمسات الأخيرة على التطبيق!

<div class="tasks">

**25. Patientor، الخطوة 3**

</div>

<div class="tasks">

**26. Patientor، الخطوة 4**

</div>

<div class="tasks">

**27. Patientor، الخطوة 5**

</div>

<div class="tasks">

**28. Patientor، الخطوة 6**

</div>

<div class="tasks">

**29. Patientor، الخطوة 7**

</div>

<div class="tasks">

**30. Patientor، الخطوة 8**

</div>

<div class="tasks">

**31. Patientor، الخطوة 9**

</div>

<div class="tasks">

**32. Patientor، الخطوة 10**

</div>

<div class="tasks">

**33. Patientor، الفحص النهائي**

</div>

<div class="tasks">

**34. مستودع GitHub الخاص بك**

</div>
