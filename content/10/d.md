---
part: 10
letter: d
title: "التواصل مع الخادم"
mainImage: /images/part-10.svg
lang: ar
---
حتى الآن، نفّذنا ميزات في تطبيقنا دون أي تواصل فعلي مع الخادم. فمثلاً، قائمة المستودعات المُقيَّمة التي نفّذناها تستخدم بيانات وهمية، ونموذج تسجيل الدخول لا يرسل بيانات اعتماد المستخدم إلى أي نقطة نهاية للمصادقة. في هذا القسم، سنتعلم كيفية التواصل مع خادم باستخدام طلبات HTTP، وكيفية استخدام Apollo Client في تطبيق React Native، وكيفية تخزين البيانات في جهاز المستخدم.

قريباً سنتعلم كيفية التواصل مع خادم في تطبيقنا. وقبل أن نصل إلى ذلك، نحتاج إلى خادم لنتواصل معه. ولهذا الغرض، لدينا تنفيذ خادم مكتمل في مستودع&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api" target="_blank" rel="noreferrer noopener">rate-repository-api</a>. ويلبي خادم&nbsp;rate-repository-api كل احتياجات تطبيقنا من API خلال هذا الجزء. وهو يستخدم قاعدة بيانات&nbsp;<a href="https://www.sqlite.org/index.html" target="_blank" rel="noreferrer noopener">SQLite</a>&nbsp;التي لا تحتاج إلى أي إعداد، ويوفّر واجهة Apollo GraphQL API إلى جانب بضع نقاط نهاية REST API.

قبل التقدم أكثر في المادة، أعدّ خادم rate-repository-api باتباع تعليمات الإعداد في ملف&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md" target="_blank" rel="noreferrer noopener">README</a> الخاص بالمستودع. لاحظ أنه إذا كنت تستخدم محاكياً للتطوير، فمن المستحسن تشغيل الخادم والمحاكي&nbsp;<em>على الحاسوب نفسه</em>. فهذا يسهّل طلبات الشبكة بدرجة كبيرة.

## طلبات HTTP

يوفّر React Native واجهة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noreferrer noopener">Fetch API</a>&nbsp;لإرسال طلبات HTTP في تطبيقاتنا. كما يدعم React Native واجهة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" target="_blank" rel="noreferrer noopener">XMLHttpRequest API</a>&nbsp;القديمة الجيدة، وهو ما يتيح استخدام مكتبات طرف ثالث مثل&nbsp;<a href="https://github.com/axios/axios" target="_blank" rel="noreferrer noopener">Axios</a>. وهاتان الواجهتان مماثلتان للواجهات الموجودة في بيئة المتصفح، وهما متاحتان عالمياً دون الحاجة إلى استيراد.

من استخدم واجهتي Fetch API وXMLHttpRequest API معاً يوافق على الأرجح على أن Fetch API أسهل استخداماً وأكثر حداثة. لكن هذا لا يعني أن واجهة XMLHttpRequest API بلا استخدامات. ومن أجل البساطة، سنستخدم Fetch API فقط في أمثلتنا.

يمكن إرسال طلبات HTTP باستخدام Fetch API عبر دالة&nbsp;<code>fetch</code>.&nbsp;والوسيط الأول للدالة هو عنوان URL الخاص بالمورد:

```
fetch('https://my-api.com/get-end-point');
```

طريقة الطلب الافتراضية هي&nbsp;<em>GET</em>. والوسيط الثاني لدالة&nbsp;<code>fetch</code>&nbsp;هو كائن خيارات، يمكنك استخدامه مثلاً لتحديد طريقة طلب مختلفة، أو ترويسات الطلب، أو جسم الطلب:

```
fetch('https://my-api.com/post-end-point', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'firstValue',
    secondParam: 'secondValue',
  }),
});
```

لاحظ أن عناوين URL هذه وهمية و(على الأرجح) لن ترسل استجابة لطلباتك. وبالمقارنة مع Axios، تعمل Fetch API على مستوى أدنى قليلاً. فمثلاً، لا توجد أي عملية تسلسل أو تحليل لجسم الطلب أو الاستجابة. وهذا يعني أنه عليك مثلاً ضبط ترويسة&nbsp;<em>Content-Type</em>&nbsp;بنفسك واستخدام دالة&nbsp;<code>JSON.stringify</code>&nbsp;لتسلسل جسم الطلب.

تُعيد دالة&nbsp;<code>fetch</code>&nbsp;قيمة promise تُحلّ إلى كائن&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noreferrer noopener">Response</a>.&nbsp;لاحظ أن رموز حالة الأخطاء مثل 400 و500&nbsp;<em>لا تُرفض</em>&nbsp;كما يحدث مثلاً في Axios. وفي حالة استجابة بصيغة JSON، يمكننا تحليل جسم الاستجابة باستخدام&nbsp;دالة&nbsp;<code>Response.json</code>:

```js
const fetchMovies = async () =&gt; {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();

  return json;
};
```

لمقدمة أكثر تفصيلاً عن Fetch API، اقرأ مقال&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank" rel="noreferrer noopener">Using Fetch</a>&nbsp;في وثائق MDN.

بعد ذلك، لنجرّب Fetch API عملياً. يوفّر خادم rate-repository-api نقطة نهاية لإرجاع قائمة مُقسَّمة إلى صفحات من المستودعات المُقيَّمة. وبعد تشغيل الخادم، ينبغي أن تكون قادراً على الوصول إلى نقطة النهاية على&nbsp;<a href="http://localhost:5000/api/repositories" target="_blank" rel="noreferrer noopener">http://localhost:5000/api/repositories</a>&nbsp;(إلا إذا غيّرت المنفذ). والبيانات مُقسَّمة إلى صفحات بصيغة&nbsp;<a href="https://graphql.org/learn/pagination/" target="_blank" rel="noreferrer noopener">ترقيم صفحات معتمد على المؤشر (cursor based pagination)</a>&nbsp;الشائعة. وتوجد بيانات المستودعات الفعلية خلف مفتاح&nbsp;<em>node</em>&nbsp;في مصفوفة&nbsp;<em>edges</em>.

لسوء الحظ، إذا كنا نستخدم جهازاً خارجياً، فلا يمكننا الوصول إلى الخادم مباشرةً في تطبيقنا باستخدام عنوان <em><a href="http://localhost:5000/api/repositories" target="_blank" rel="noreferrer noopener">http://localhost:5000/api/repositories</a></em>. ولإرسال طلب إلى نقطة النهاية هذه في تطبيقنا، نحتاج إلى الوصول إلى الخادم باستخدام عنوان IP الخاص به في شبكته المحلية. ولمعرفة ما هو هذا العنوان، افتح أدوات تطوير Expo بتشغيل <code>npm start</code>. في الطرفية ينبغي أن ترى عنوان URL يبدأ بـ <em>exp://</em> أسفل رمز QR، بعد نص "Metro waiting on":

![مخرجات طرفية Metro مع إبراز عنوان exp://<ip>](/images/mooc/306b11b5055e.webp)

انسخ عنوان IP الواقع بين&nbsp;<em>exp://</em>&nbsp;و&nbsp;<em>:</em>، وهو في هذا المثال&nbsp;<em>192.168.1.33</em>. أنشئ عنوان URL بالصيغة&nbsp;<em>http://&lt;IP_ADDRESS&gt;:5000/api/repositories</em>&nbsp;وافتحه في المتصفح. ينبغي أن ترى الاستجابة نفسها التي رأيتها مع عنوان&nbsp;<em>localhost</em>.

الآن بعد أن عرفنا عنوان URL لنقطة النهاية، لنستخدم البيانات الفعلية التي يوفّرها الخادم في قائمة المستودعات المُقيَّمة. نستخدم حالياً بيانات وهمية مخزّنة في متغير&nbsp;<code>repositories</code>.&nbsp;احذف متغير&nbsp;<code>repositories</code>&nbsp;واستبدل استخدام البيانات الوهمية بهذه القطعة من الشيفرة&nbsp;في ملف&nbsp;<em>RepositoryList.jsx</em>&nbsp;في مجلد&nbsp;<em>components</em>:

```js
import { useState, useEffect } from 'react';  // HIGHLIGHT LINE
// ...

const RepositoryList = () =&gt; {
  // BEGIN HIGHLIGHT
  const [repositories, setRepositories] = useState();

  const fetchRepositories = async () =&gt; {
    // استبدل جزء عنوان IP بعنوان IP الخاص بك!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    console.log(json);

    setRepositories(json);
  };

  useEffect(() =&gt; {
    fetchRepositories();
  }, []);

  // احصل على العناصر (nodes) من مصفوفة edges
  const repositoryNodes = repositories
    ? repositories.edges.map(edge =&gt; edge.node)
    : [];
  // END HIGHLIGHT

  return (
    &lt;FlatList
      data={repositoryNodes}  // HIGHLIGHT LINE
      // props أخرى
    /&gt;
  );
};

export default RepositoryList;
```

نستخدم خطاف&nbsp;<code>useState</code>&nbsp;من React للحفاظ على حالة قائمة المستودعات، وخطاف&nbsp;<code>useEffect</code>&nbsp;لاستدعاء دالة&nbsp;<code>fetchRepositories</code>&nbsp;عند تركيب مكوّن&nbsp;<code>RepositoryList</code>.&nbsp;ونستخرج المستودعات الفعلية إلى متغير&nbsp;<code>repositoryNodes</code>&nbsp;ونستبدل به المتغير&nbsp;<code>repositories</code>&nbsp;المستخدم سابقاً في خاصية&nbsp;<code>data</code>&nbsp;لمكوّن&nbsp;<code>FlatList</code>.&nbsp;والآن ينبغي أن ترى بيانات فعلية يوفّرها الخادم في قائمة المستودعات المُقيَّمة.

من المفيد عادةً تسجيل استجابة الخادم خلال مرحلة التطوير لتتمكن من فحصها كما فعلنا في دالة <code>fetchRepositories</code>. ينبغي أن ترى رسالة السجل هذه في طرفية Expo CLI أو في أدوات تطوير Expo إذا انتقلت إلى سجلات جهازك كما تعلمنا في قسم <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-react-native/chapter-2#debugging" target="_blank" rel="noreferrer noopener">تصحيح الأخطاء</a>. وإذا كنت تستخدم تطبيق Expo للهواتف المحمولة في التطوير وفشل طلب الشبكة، فتأكد من أن الحاسوب الذي تشغّل عليه الخادم وهاتفك <em>متصلان بشبكة Wi-Fi نفسها</em>. وإذا لم يكن ذلك ممكناً، فإما أن تستخدم محاكياً على الحاسوب نفسه الذي يعمل عليه الخادم، أو <a href="/part10/introduction_to_react_native#using-your-own-phone-with-expo-go" target="_blank" rel="noreferrer noopener">أن تستخدم خيار النفق</a>.

يمكن تحسين شيفرة جلب البيانات الحالية في مكوّن&nbsp;<code>RepositoryList</code>&nbsp;ببعض إعادة الهيكلة. فمثلاً، المكوّن على علم بتفاصيل طلب الشبكة مثل عنوان URL لنقطة النهاية. وإضافةً إلى ذلك، لشيفرة جلب البيانات إمكانات كبيرة لإعادة الاستخدام. لنُعِد هيكلة شيفرة المكوّن باستخراج شيفرة جلب البيانات إلى خطاف خاص بها. أنشئ مجلد&nbsp;<em>hooks</em>&nbsp;في مجلد&nbsp;<em>src</em>،&nbsp;وأنشئ في مجلد&nbsp;<em>hooks</em>&nbsp;هذا ملف&nbsp;<em>useRepositories.js</em>&nbsp;بالمحتوى التالي:

```js
import { useState, useEffect } from 'react';

const useRepositories = () =&gt; {
  const [repositories, setRepositories] = useState();
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () =&gt; {
    setLoading(true);

    // استبدل جزء عنوان IP بعنوان IP الخاص بك!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    setLoading(false);
    setRepositories(json);
  };

  useEffect(() =&gt; {
    fetchRepositories();
  }, []);

  return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;
```

الآن بعد أن أصبح لدينا تجريد نظيف لجلب المستودعات المُقيَّمة، لنستخدم&nbsp;خطاف&nbsp;<code>useRepositories</code>&nbsp;في مكوّن&nbsp;<code>RepositoryList</code>:

```js
// ...
import useRepositories from '../hooks/useRepositories'; // HIGHLIGHT LINE

const RepositoryList = () =&gt; {
  const { repositories } = useRepositories(); // HIGHLIGHT LINE

  const repositoryNodes = repositories
    ? repositories.edges.map(edge =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // props أخرى
    /&gt;
  );
};

export default RepositoryList;
```

وهذا كل شيء، الآن لم يعد مكوّن&nbsp;<code>RepositoryList</code>&nbsp;على علم بطريقة الحصول على المستودعات. وربما في المستقبل سنحصل عليها عبر GraphQL API بدلاً من REST API. سنرى ما سيحدث.

## GraphQL وApollo Client

في&nbsp;<a href="/part8" target="_blank" rel="noreferrer noopener">الجزء 8</a>&nbsp;تعلمنا عن GraphQL وكيفية إرسال استعلامات GraphQL إلى خادم Apollo باستخدام&nbsp;<a href="https://www.apollographql.com/docs/react/" target="_blank" rel="noreferrer noopener">Apollo Client</a>&nbsp;في تطبيقات React. والخبر السار أننا نستطيع استخدام Apollo Client في تطبيق React Native تماماً كما نفعل في تطبيق React للويب.

كما ذُكر سابقاً، يوفّر خادم rate-repository-api واجهة GraphQL API منفَّذة باستخدام Apollo Server. وبعد تشغيل الخادم، يمكنك الوصول إلى <a href="https://www.apollographql.com/docs/graphos/platform/sandbox" target="_blank" rel="noreferrer noopener">Apollo Sandbox</a> على <a href="http://localhost:4000/" target="_blank" rel="noreferrer noopener">http://localhost:4000</a>. وApollo Sandbox أداة لإنشاء استعلامات GraphQL وفحص مخطط GraphQL APIs وتوثيقها. وإذا احتجت إلى إرسال استعلام في تطبيقك <em>فاختبره دائماً</em> أولاً باستخدام Apollo Sandbox قبل تنفيذه في الشيفرة. فتصحيح المشكلات المحتملة في الاستعلام أسهل بكثير في Apollo Sandbox منه في التطبيق. وإذا لم تكن متأكداً من الاستعلامات المتاحة أو كيفية استخدامها، فيمكنك الاطلاع على التوثيق بجوار محرّر العمليات:

![Apollo Sandbox](/images/mooc/1bf23e6ced47.webp)

في تطبيق React Native الخاص بنا، سنستخدم مكتبة&nbsp;<a href="https://www.npmjs.com/package/@apollo/client" target="_blank" rel="noreferrer noopener">@apollo/client</a>&nbsp;نفسها كما في الجزء 8. لنبدأ بتثبيت المكتبة إلى جانب مكتبة&nbsp;<a href="https://www.npmjs.com/package/graphql" target="_blank" rel="noreferrer noopener">graphql</a>&nbsp;المطلوبة كاعتمادية نظيرة (peer dependency):

```bash
npm install @apollo/client graphql
```

لننشئ دالة مساعدة لإنشاء Apollo Client بالإعدادات المطلوبة. أنشئ مجلد&nbsp;<em>utils</em>&nbsp;في مجلد&nbsp;<em>src</em>،&nbsp;وأنشئ في مجلد&nbsp;<em>utils</em>&nbsp;هذا ملف&nbsp;<em>apolloClient.js</em>. وفي ذلك الملف اضبط Apollo Client للاتصال بخادم Apollo:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://192.168.1.100:4000/graphql',
});

const createApolloClient = () =&gt; {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

عنوان URL المستخدم للاتصال بخادم Apollo هو نفسه الذي استخدمته مع Fetch API، باستثناء أن المنفذ هو&nbsp;<em>4000</em>&nbsp;والمسار هو&nbsp;<em>/graphql</em>. وأخيراً، نحتاج إلى توفير Apollo Client باستخدام&nbsp;سياق&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/ApolloProvider" target="_blank" rel="noreferrer noopener">ApolloProvider</a>.&nbsp;وسنضيفه إلى مكوّن&nbsp;<code>App</code>&nbsp;في ملف&nbsp;<em>App.js</em>:

```js
import { ApolloProvider } from '@apollo/client/react';  // HIGHLIGHT LINE
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient'; // HIGHLIGHT LINE

const apolloClient = createApolloClient(); // HIGHLIGHT LINE

const App = () =&gt; {
  return (
    &lt;StatusBar style="light" /&gt;
    &lt;NativeRouter&gt;
      &lt;ApolloProvider client={apolloClient}&gt; // HIGHLIGHT LINE
        &lt;Main /&gt;
      &lt;/ApolloProvider&gt; // HIGHLIGHT LINE
    &lt;/NativeRouter&gt;
  );
};

export default App;
```

## تنظيم الشيفرة المتعلقة بـ GraphQL

الأمر متروك لك في كيفية تنظيم الشيفرة المتعلقة بـ GraphQL في تطبيقك. لكن من أجل بنية مرجعية، لنلقِ نظرة على طريقة بسيطة وفعّالة إلى حد كبير لتنظيم الشيفرة المتعلقة بـ GraphQL. في هذه البنية، نعرّف الاستعلامات وmutations وfragments وربما كيانات أخرى في ملفات خاصة بها. وتقع هذه الملفات في المجلد نفسه. وإليك مثالاً على البنية التي يمكنك استخدامها للبدء:

![بنية GraphQL](/images/mooc/2acedef0ee2f.webp)

يمكنك استيراد وسم القالب النصي (template literal tag)&nbsp;<code>gql</code>&nbsp;المستخدم لتعريف استعلامات GraphQL من مكتبة&nbsp;<em>@apollo/client</em>.&nbsp;وإذا اتبعنا البنية المقترحة أعلاه، فيمكن أن يكون لدينا ملف&nbsp;<em>queries.js</em>&nbsp;في مجلد&nbsp;<em>graphql</em>&nbsp;لاستعلامات GraphQL الخاصة بتطبيقنا. ويمكن تخزين كل استعلام في متغير وتصديره هكذا:

```js
import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      ${/* ... */}
    }
  }
`;

// استعلامات أخرى...
```

يمكننا استيراد هذه المتغيرات واستخدامها مع خطاف&nbsp;<code>useQuery</code>&nbsp;هكذا:

```js
import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () =&gt; {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

والأمر نفسه ينطبق على تنظيم mutations. والفرق الوحيد أننا نعرّفها في ملف مختلف هو&nbsp;<em>mutations.js</em>. ويُوصى باستخدام&nbsp;<a href="https://www.apollographql.com/docs/react/data/fragments/" target="_blank" rel="noreferrer noopener">fragments</a>&nbsp;في الاستعلامات لتجنب إعادة كتابة الحقول نفسها مراراً وتكراراً.

## تطوير البنية

عندما يكبر تطبيقنا، قد تأتي أوقات تصبح فيها ملفات معيّنة أكبر من أن يمكن إدارتها. فمثلاً، لدينا مكوّن&nbsp;<code>A</code>&nbsp;يعرض المكوّنين&nbsp;<code>B</code>&nbsp;و&nbsp;<code>C</code>. وكل هذه المكوّنات معرَّفة في ملف&nbsp;<em>A.jsx</em>&nbsp;في مجلد&nbsp;<em>components</em>.&nbsp;ونريد استخراج المكوّنين&nbsp;<code>B</code>&nbsp;و&nbsp;<code>C</code>&nbsp;إلى ملفين خاصين بهما&nbsp;<em>B.jsx</em>&nbsp;و&nbsp;<em>C.jsx</em>&nbsp;دون إعادة هيكلة كبيرة. ولدينا خياران:
- أنشئ ملفين <em>B.jsx</em> و <em>C.jsx</em> في مجلد <em>components</em>. وينتج عن ذلك البنية التالية:

```
components/
  A.jsx
  B.jsx
  C.jsx
  ...
```
- أنشئ مجلد <em>A</em> في مجلد <em>components</em> وأنشئ فيه ملفي <em>B.jsx</em> و <em>C.jsx</em>. ولتجنب كسر المكوّنات التي تستورد ملف <em>A.jsx</em>، انقل ملف <em>A.jsx</em> إلى مجلد <em>A</em> وأعد تسميته إلى <em>index.jsx</em>. وينتج عن ذلك البنية التالية:

```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
  ...
```

الخيار الأول مقبول تماماً، لكن إذا لم يكن المكوّنان&nbsp;<code>B</code>&nbsp;و&nbsp;<code>C</code>&nbsp;قابلين لإعادة الاستخدام خارج المكوّن&nbsp;<code>A</code>، فلا فائدة من تضخيم مجلد&nbsp;<em>components</em>&nbsp;بإضافتهما كملفين منفصلين. والخيار الثاني معياري (modular) تماماً ولا يكسر أي عمليات استيراد، لأن استيراد مسار مثل&nbsp;<em>./A</em>&nbsp;سيتطابق مع كلٍّ من&nbsp;<em>A.jsx</em>&nbsp;و&nbsp;<em>A/index.jsx</em>.

## تمرين 10.11

### تمرين 10.11: جلب المستودعات باستخدام Apollo Client

<div class="tasks">

**11. جلب المستودعات باستخدام Apollo Client**

</div>

## متغيرات البيئة

من المرجّح أن يعمل كل تطبيق في أكثر من بيئة واحدة. ومن أبرز هاتين البيئتين بيئة التطوير وبيئة الإنتاج. ومن بين هاتين، بيئة التطوير هي التي نشغّل فيها التطبيق الآن. وعادةً ما تكون لبيئات مختلفة اعتماديات مختلفة، فمثلاً قد يستخدم الخادم الذي نطوّره محلياً قاعدة بيانات محلية، بينما يستخدم الخادم المنشور في بيئة الإنتاج قاعدة بيانات الإنتاج. ولجعل الشيفرة مستقلة عن البيئة، نحتاج إلى جعل هذه الاعتماديات قابلة للضبط عبر معاملات. في الوقت الحالي، نستخدم في تطبيقنا قيمة مثبّتة في الشيفرة تعتمد اعتماداً كبيراً على البيئة: عنوان URL الخاص بالخادم.

تعلمنا سابقاً أنه يمكننا تزويد البرامج قيد التشغيل بمتغيرات البيئة. ويمكن تعريف هذه المتغيرات في سطر الأوامر أو باستخدام ملفات إعداد البيئة مثل ملفات <em>.env</em>. وقد استخدمنا سابقاً في المقرر مكتبة <em>dotenv</em> لقراءة ملفات <em>.env</em>. ويقرأ Expo تلقائياً ملف <em>.env</em> المعرَّف في جذر المشروع، لذا لا حاجة إلى مكتبة dotenv. غير أن كل متغير بيئة يجب أن يبدأ بالبادئة <code>EXPO_PUBLIC_</code>. يمكنك قراءة المزيد في <a href="https://docs.expo.dev/guides/environment-variables/" target="_blank" rel="noreferrer noopener">وثائق Expo</a>.

لننشئ ملف&nbsp;<em>.env</em>&nbsp;في جذر المشروع بالمحتوى التالي:

```
EXPO_PUBLIC_ENV=test
```

هنا نعرّف متغير بيئة باسم <code>EXPO_PUBLIC_ENV</code>. وقد تحتاج إلى إعادة تشغيل أدوات تطوير Expo لتطبيق التغييرات التي أجريتها على ملف <em>.env</em>.

وكالعادة، يمكنك الوصول إلى متغير البيئة في التطبيق باستخدام الصيغة <code>process.env.EXPO_PUBLIC_ENV</code>. وكاختبار سريع، يمكننا تسجيل متغير البيئة في مكوّن App:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () =&gt; {
  console.log("env check:", process.env.EXPO_PUBLIC_ENV);  // HIGHLIGHT LINE

  return (
    // ...
  );
};

export default App;
```

ينبغي أن ترى الآن 'env check: test' في السجلات.

لاحظ أنه <em>ليس</em> من الجيد أبداً وضع بيانات حساسة في إعدادات التطبيق. والسبب في ذلك أنه بمجرد أن ينزّل المستخدم تطبيقك، يمكنه نظرياً على الأقل إجراء هندسة عكسية لتطبيقك واكتشاف البيانات الحساسة التي خزّنتها في الشيفرة. فمتغيرات البيئة التي يستخدمها Expo يمكن العثور عليها كنص صريح في التطبيق المُصرَّف، لذا لا تُضمّن معلومات حساسة مثل المفاتيح الخاصة في متغيرات <code>EXPO_PUBLIC_</code>.

<div class="tasks">

**12. متغيرات البيئة**

</div>

## تخزين البيانات في جهاز المستخدم

هناك أوقات نحتاج فيها إلى تخزين بعض البيانات الدائمة في جهاز المستخدم. ومن السيناريوهات الشائعة لذلك تخزين رمز مصادقة المستخدم (authentication token) حتى نتمكن من استرجاعه حتى لو أغلق المستخدم تطبيقنا وأعاد فتحه. وقد استخدمنا في تطوير الويب كائن&nbsp;<code>localStorage</code>&nbsp;في المتصفح لتحقيق هذه الوظيفة. ويوفّر React Native تخزيناً دائماً مماثلاً هو&nbsp;<a href="https://github.com/react-native-async-storage/async-storage?tab=readme-ov-file#usage" target="_blank" rel="noreferrer noopener">AsyncStorage</a>.

يمكننا استخدام&nbsp;<code>npx expo install</code>&nbsp;لتثبيت إصدار حزمة&nbsp;<em>@react-native-async-storage/async-storage</em>&nbsp;المناسب لإصدار Expo SDK لدينا:

```bash
npx expo install @react-native-async-storage/async-storage
```

تتشابه واجهة&nbsp;<code>AsyncStorage</code>&nbsp;من نواحٍ كثيرة مع&nbsp;واجهة&nbsp;<code>localStorage</code>. فكلاهما تخزين مفتاح-قيمة بدوال متشابهة. وأكبر فرق بينهما هو أن عمليات&nbsp;<code>AsyncStorage</code>&nbsp;<em>غير متزامنة</em>&nbsp;كما يوحي الاسم.

ولأن&nbsp;<code>AsyncStorage</code>&nbsp;يعمل بمفاتيح نصية في نطاق أسماء عام، فمن الجيد إنشاء تجريد بسيط لعملياته. ويمكن تنفيذ هذا التجريد مثلاً باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes" target="_blank" rel="noreferrer noopener">صنف (class)</a>. وكمثال، يمكننا تنفيذ تخزين لسلة تسوق لتخزين المنتجات التي يريد المستخدم شراءها:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

class ShoppingCartStorage {
  constructor(namespace = 'shoppingCart') {
    this.namespace = namespace;
  }

  async getProducts() {
    const rawProducts = await AsyncStorage.getItem(
      `${this.namespace}:products`,
    );

    return rawProducts ? JSON.parse(rawProducts) : [];
  }

  async addProduct(productId) {
    const currentProducts = await this.getProducts();
    const newProducts = [...currentProducts, productId];

    await AsyncStorage.setItem(
      `${this.namespace}:products`,
      JSON.stringify(newProducts),
    );
  }

  async clearProducts() {
    await AsyncStorage.removeItem(`${this.namespace}:products`);
  }
}

const doShopping = async () =&gt; {
  const shoppingCartA = new ShoppingCartStorage('shoppingCartA');
  const shoppingCartB = new ShoppingCartStorage('shoppingCartB');

  await shoppingCartA.addProduct('chips');
  await shoppingCartA.addProduct('soda');

  await shoppingCartB.addProduct('milk');

  const productsA = await shoppingCartA.getProducts();
  const productsB = await shoppingCartB.getProducts();

  console.log(productsA, productsB);

  await shoppingCartA.clearProducts();
  await shoppingCartB.clearProducts();
};

doShopping();
```

ولأن&nbsp;مفاتيح&nbsp;<code>AsyncStorage</code>&nbsp;عامة، فمن الجيد عادةً إضافة&nbsp;<em>نطاق أسماء (namespace)</em>&nbsp;للمفاتيح. وفي هذا السياق، نطاق الأسماء مجرد بادئة نوفّرها لمفاتيح تجريد التخزين. ويحمي استخدام نطاق الأسماء مفاتيح التخزين من التعارض مع مفاتيح&nbsp;<code>AsyncStorage</code>&nbsp;أخرى. وفي هذا المثال، عُرِّف نطاق الأسماء كوسيط للمُنشئ (constructor)، ونستخدم الصيغة&nbsp;<code>namespace:key</code>&nbsp;للمفاتيح.

يمكننا إضافة عنصر إلى التخزين باستخدام&nbsp;دالة&nbsp;<code>AsyncStorage.setItem</code>. والوسيط الأول للدالة هو مفتاح العنصر والوسيط الثاني قيمته. ويجب أن تكون القيمة&nbsp;<em>نصاً</em>، لذا نحتاج إلى تسلسل القيم غير النصية كما فعلنا باستخدام&nbsp;دالة&nbsp;<code>JSON.stringify</code>&nbsp;سابقاً. ويمكن استخدام&nbsp;دالة&nbsp;<code>AsyncStorage.getItem</code>&nbsp;لجلب عنصر من التخزين. ووسيط الدالة هو مفتاح العنصر، الذي ستُحلّ قيمته. ويمكن استخدام&nbsp;دالة&nbsp;<code>AsyncStorage.removeItem</code>&nbsp;لحذف العنصر ذي المفتاح المقدَّم من التخزين.

<strong>ملاحظة:</strong> <a href="https://docs.expo.dev/versions/latest/sdk/securestore/" target="_blank" rel="noreferrer noopener">SecureStore</a> تخزين دائم مماثل لـ <code>AsyncStorage</code> لكنه يشفّر البيانات المخزّنة. وهذا يجعله أكثر ملاءمة لتخزين بيانات أكثر حساسية.

<div class="tasks">

**13. mutation نموذج تسجيل الدخول**

</div>

<div class="tasks">

**14. تخزين رمز الوصول، الخطوة 1**

</div>

## تحسين طلبات Apollo Client

الآن بعد أن نفّذنا تخزيناً لتخزين رمز وصول المستخدم، حان وقت البدء في استخدامه. هيّئ التخزين في&nbsp;مكوّن&nbsp;<code>App</code>:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage'; // HIGHLIGHT LINE

const authStorage = new AuthStorage(); // HIGHLIGHT LINE
const apolloClient = createApolloClient(authStorage); // HIGHLIGHT LINE

const App = () =&gt; {
  return (
    &lt;&gt;
      &lt;StatusBar style="light" /&gt;
      &lt;NativeRouter&gt;
        &lt;ApolloProvider client={apolloClient}&gt;
          &lt;Main /&gt;
        &lt;/ApolloProvider&gt;
      &lt;/NativeRouter&gt;
    &lt;/&gt;
  );
};

export default App;
```

كما قدّمنا نسخة التخزين إلى&nbsp;دالة&nbsp;<code>createApolloClient</code>&nbsp;كوسيط. وذلك لأننا سنرسل بعد ذلك رمز الوصول إلى خادم Apollo في كل طلب. وسيتوقع خادم Apollo وجود رمز الوصول في&nbsp;ترويسة&nbsp;<em>Authorization</em>&nbsp;بالصيغة&nbsp;<em>Bearer &lt;ACCESS_TOKEN&gt;</em>. ويمكننا تحسين طلب Apollo Client باستخدام&nbsp;دالة&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-context" target="_blank" rel="noreferrer noopener">setContextLink</a>. لنرسل رمز الوصول إلى خادم Apollo بتعديل&nbsp;دالة&nbsp;<code>createApolloClient</code>&nbsp;في ملف&nbsp;<em>apolloClient.js</em>:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context'; // HIGHLIGHT LINE

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

// BEGIN HIGHLIGHT
const createApolloClient = (authStorage) =&gt; {
  const authLink = new SetContextLink(async ({ headers }) =&gt; {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);
      return {
        headers,
      };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
// END HIGHLIGHT

export default createApolloClient;
```

## استخدام React Context لحقن الاعتماديات

القطعة الأخيرة في أحجية تسجيل الدخول هي دمج التخزين في&nbsp;خطاف&nbsp;<code>useSignIn</code>. ولتحقيق ذلك، يجب أن يكون الخطاف قادراً&nbsp;على الوصول إلى نسخة تخزين الرمز التي هيّأناها في مكوّن&nbsp;<code>App</code>.&nbsp;و<a href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noreferrer noopener">React Context</a>&nbsp;هو بالضبط الأداة التي نحتاجها لهذه المهمة. أنشئ مجلد&nbsp;<em>contexts</em>&nbsp;في مجلد&nbsp;<em>src</em>،&nbsp;وفي ذلك المجلد أنشئ ملف&nbsp;<em>AuthStorageContext.js</em>&nbsp;بالمحتوى التالي:

```js
import { createContext } from 'react';

const AuthStorageContext = createContext();

export default AuthStorageContext;
```

الآن يمكننا استخدام&nbsp;<code>AuthStorageContext.Provider</code>&nbsp;لتوفير نسخة التخزين إلى الأبناء في السياق. لنضفه إلى&nbsp;مكوّن&nbsp;<code>App</code>:

```js
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext'; // HIGHLIGHT LINE

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () =&gt; {
  return (
    &lt;&gt;
      &lt;StatusBar style="light" /&gt;
      &lt;NativeRouter&gt;
        &lt;ApolloProvider client={apolloClient}&gt;
          &lt;AuthStorageContext.Provider value={authStorage}&gt; // HIGHLIGHT LINE
            &lt;Main /&gt;
          &lt;/AuthStorageContext.Provider&gt; // HIGHLIGHT LINE
        &lt;/ApolloProvider&gt;
      &lt;/NativeRouter&gt;
    &lt;/&gt;
  );
};

export default App;
```

أصبح الوصول إلى نسخة التخزين في&nbsp;خطاف&nbsp;<code>useSignIn</code>&nbsp; ممكناً الآن باستخدام&nbsp;خطاف&nbsp;<a href="https://react.dev/reference/react/useContext" target="_blank" rel="noreferrer noopener">useContext</a> من React هكذا:

```js
// ...
import { useContext } from 'react'; // HIGHLIGHT LINE

import AuthStorageContext from '../contexts/AuthStorageContext';
const useSignIn = () =&gt; {
  const authStorage = useContext(AuthStorageContext);  // ...
};
```

لاحظ أن الوصول إلى قيمة سياق باستخدام&nbsp;خطاف&nbsp;<code>useContext</code>&nbsp;لا يعمل إلا إذا استُخدم خطاف&nbsp;<code>useContext</code>&nbsp;في مكوّن&nbsp;<em>ابن</em>&nbsp;لمكوّن&nbsp;<a href="https://react.dev/reference/react/createContext#provider" target="_blank" rel="noreferrer noopener">Context.Provider</a>.

الوصول إلى&nbsp;نسخة&nbsp;<code>AuthStorage</code>&nbsp;باستخدام&nbsp;<code>useContext(AuthStorageContext)</code>&nbsp;مطوّل بعض الشيء ويكشف تفاصيل التنفيذ. لنحسّن ذلك بتنفيذ خطاف&nbsp;<code>useAuthStorage</code>&nbsp;في ملف&nbsp;<em>useAuthStorage.js</em>&nbsp;في مجلد&nbsp;<em>hooks</em>:

```js
import { useContext } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () =&gt; {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;
```

تنفيذ الخطاف بسيط جداً، لكنه يحسّن قابلية قراءة وصيانة الخطافات والمكوّنات التي تستخدمه. ويمكننا استخدام الخطاف لإعادة هيكلة خطاف&nbsp;<code>useSignIn</code>&nbsp;هكذا:

```js
// ...
import useAuthStorage from '../hooks/useAuthStorage'; // HIGHLIGHT LINE

const useSignIn = () =&gt; {
  const authStorage = useAuthStorage();  // ...
};
```

تفتح القدرة على توفير البيانات لأبناء المكوّن الكثير من حالات الاستخدام لـ React Context، كما رأينا سابقاً في&nbsp;<a href="/part6" target="_blank" rel="noreferrer noopener">الفصل الأخير</a>&nbsp;من الجزء 6.

لمعرفة المزيد عن حالات الاستخدام هذه، اقرأ مقال Kent C. Dodds الملهِم <a href="https://kentcdodds.com/blog/how-to-use-react-context-effectively" target="_blank" rel="noreferrer noopener">How to use React Context effectively</a> لتكتشف كيفية الجمع بين خطاف <a href="https://react.dev/reference/react/useReducer" target="_blank" rel="noreferrer noopener">useReducer</a> والسياق لتنفيذ إدارة الحالة. وربما تجد طريقة لاستخدام هذه المعرفة في التمارين القادمة.

<div class="tasks">

**15. تخزين رمز الوصول، الخطوة 2**

</div>

<div class="tasks">

**16. تسجيل الخروج**

</div>
