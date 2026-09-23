---
part: 10
letter: e
title: "اختبار تطبيقنا وتوسيعه"
mainImage: /images/part-10.svg
lang: ar
---
الآن بعد أن أرسينا أساساً جيداً لمشروعنا، حان وقت البدء بتوسيعه. في هذا القسم يمكنك أن توظّف كل معرفتك بـReact Native التي اكتسبتها حتى الآن. وإلى جانب توسيع تطبيقنا، سنغطّي بعض المجالات الجديدة مثل الاختبار، وموارد إضافية.

## اختبار تطبيقات React Native

للبدء باختبار شيفرة من أي نوع، أول ما نحتاجه هو إطار عمل للاختبار يمكننا استخدامه لتشغيل مجموعة من حالات الاختبار وفحص نتائجها. لاختبار تطبيق JavaScript، يُعدّ&nbsp;<a href="https://jestjs.io/" target="_blank" rel="noreferrer noopener">Jest</a>&nbsp;مرشحاً شائعاً لهذا النوع من أطر الاختبار. ولاختبار تطبيق React Native قائم على Expo باستخدام Jest، يوفّر Expo مجموعة من إعدادات Jest على شكل إعداد مسبق&nbsp;<a href="https://github.com/expo/expo/tree/master/packages/jest-expo" target="_blank" rel="noreferrer noopener">jest-expo</a>. لنبدأ بتثبيت الحزم:

```bash
npx expo install jest-expo jest @types/jest --dev
```

لاستخدام الإعداد المسبق jest-expo في Jest، نحتاج إلى إضافة&nbsp;<a href="https://docs.expo.dev/develop/unit-testing/#additional-configuration-for-using-transformignorepatterns" target="_blank" rel="noreferrer noopener">إعداد Jest</a>&nbsp;التالي إلى ملف&nbsp;<em>package.json</em>&nbsp;إلى جانب سكربت&nbsp;<em>test</em>:

```json
{
  // ...
  "scripts": {
    // سكربتات أخرى...
    "test": "jest" // HIGHLIGHT LINE
  },
  // BEGIN HIGHLIGHT
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-router-native)"
    ]
  }
  // END HIGHLIGHT
  // ...
}
```

نحتاج أيضاً إلى قليل من الإعداد حتى يتمكن VS Code من اقتراح المطابِقات (matchers) المناسبة لكلمة&nbsp;<code>expect</code>&nbsp;مثلاً. ويمكن فعل ذلك بإنشاء ملف&nbsp;<em>jsconfig.json</em>&nbsp;في جذر المشروع بالمحتوى التالي:

```json
{
  "compilerOptions": {
    "checkJs": false,
    "types": ["jest"]
  }
}
```

لاستخدام ESLint في ملفات اختبار Jest، نحتاج أيضاً إلى إضافة&nbsp;<a href="https://www.npmjs.com/package/eslint-plugin-jest" target="_blank" rel="noreferrer noopener">eslint-plugin-jest</a>&nbsp;الخاصة بـESLint. لنثبّتها:

```bash
npm install eslint-plugin-jest --save-dev
```

لاستخدام إضافة eslint-plugin-jest، نحتاج إلى تفعيلها في ملف&nbsp;<em>eslint.config.js</em>:

```js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginJest = require('eslint-plugin-jest'); // HIGHLIGHT LINE

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // BEGIN HIGHLIGHT
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    ...pluginJest.configs['flat/recommended'],
  },
  // END HIGHLIGHT
]);
```

للتأكد من أن الإعداد يعمل، أنشئ مجلد&nbsp;<em>__tests__</em>&nbsp;داخل مجلد&nbsp;<em>src</em>&nbsp;وأنشئ في المجلد الذي أنشأته ملفاً باسم&nbsp;<em>example.test.js</em>. وأضف في ذلك الملف هذا الاختبار البسيط:

```
describe('Example', () =&gt; {
  it('works', () =&gt; {
    expect(1).toBe(1);
  });
});
```

الآن، لنشغّل اختبارنا النموذجي بتنفيذ&nbsp;<code>npm test</code>. ينبغي أن تشير مخرجات الأمر إلى أن الاختبار الموجود في ملف&nbsp;<em>src/__tests__/example.test.js</em>&nbsp;قد نجح.

## تنظيم الاختبارات

تنظيم ملفات الاختبار في مجلد&nbsp;<em>__tests__</em>&nbsp;واحد هو أحد أساليب تنظيم الاختبارات. وعند اختيار هذا الأسلوب، يُوصى بوضع ملفات الاختبار في المجلدات الفرعية المقابلة لها تماماً كما هي الشيفرة نفسها. وهذا يعني مثلاً أن الاختبارات المتعلقة بالمكوّنات تكون في مجلد&nbsp;<em>components</em>، والاختبارات المتعلقة بالأدوات المساعدة تكون في مجلد&nbsp;<em>utils</em>، وهكذا. وسينتج عن ذلك البنية التالية:

```
src/
  __tests__/
    components/
      AppBar.js
      RepositoryList.js
      ...
    utils/
      authStorage.js
      ...
    ...
```

وثمة أسلوب آخر هو تنظيم الاختبارات قرب التنفيذ. وهذا يعني مثلاً أن ملف الاختبار الذي يحوي اختبارات مكوّن&nbsp;<code>AppBar</code>&nbsp;يوجد في المجلد نفسه الذي توجد فيه شيفرة المكوّن. وسينتج عن ذلك البنية التالية:

```
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
    ...
  ...
```

في هذا المثال، توجد شيفرة المكوّن في ملف&nbsp;<em>index.jsx</em>&nbsp;والاختبار في ملف&nbsp;<em>AppBar.test.jsx</em>. لاحظ أنه لكي يعثر Jest على ملفات اختبارك، عليك إما وضعها في مجلد&nbsp;<em>__tests__</em>، أو استخدام اللاحقة&nbsp;<em>.test</em>&nbsp;أو&nbsp;<em>.spec</em>، أو&nbsp;<a href="https://jestjs.io/docs/en/configuration#testmatch-arraystring" target="_blank" rel="noreferrer noopener">ضبط الأنماط العامة يدوياً</a>.

## اختبار المكوّنات

الآن بعد أن نجحنا في إعداد Jest وتشغيل اختبار بسيط جداً، حان وقت معرفة كيفية اختبار المكوّنات. وكما نعلم، يتطلب اختبار المكوّنات وسيلة لتسلسل مخرجات عرض المكوّن ومحاكاة إطلاق أحداث مختلفة الأنواع، مثل الضغط على زر. ولهذه الأغراض توجد عائلة&nbsp;<a href="https://testing-library.com/docs/intro" target="_blank" rel="noreferrer noopener">Testing Library</a>&nbsp;التي توفّر مكتبات لاختبار مكوّنات واجهة المستخدم على منصات مختلفة. وتتشارك هذه المكتبات جميعها واجهة برمجية مشابهة لاختبار مكوّنات واجهة المستخدم بطريقة محورها المستخدم.

في&nbsp;<a href="/part5/testing_react_apps" target="_blank" rel="noreferrer noopener">الجزء 5</a>&nbsp;تعرفنا على إحدى هذه المكتبات، وهي&nbsp;<a href="https://testing-library.com/docs/react-testing-library/intro" target="_blank" rel="noreferrer noopener">React Testing Library</a>. ولسوء الحظ، هذه المكتبة مناسبة فقط لاختبار تطبيقات React للويب. ولحسن الحظ، يوجد نظير لهذه المكتبة خاص بـReact Native، وهو&nbsp;<a href="https://callstack.github.io/react-native-testing-library/" target="_blank" rel="noreferrer noopener">React Native Testing Library</a>. هذه هي المكتبة التي سنستخدمها أثناء اختبار مكوّنات تطبيقنا بـReact Native. والخبر السار أن هاتين المكتبتين تتشاركان واجهة برمجية شديدة التشابه، لذا ليست هناك مفاهيم جديدة كثيرة يجب تعلمها. لنثبّت مكتبة&nbsp;<em>@testing-library/react-native</em>&nbsp;في مشروعنا:

```bash
npx expo install @testing-library/react-native --dev
```

> <strong>ملاحظة:</strong>&nbsp;إذا فشل التثبيت بسبب مشكلات في الاعتماديات النظيرة (peer dependencies)، جرّب تثبيت مكتبة react-test-renderer صراحةً مع الراية&nbsp;<code>--legacy-peer-deps</code>:
>
> <code>npm install --save-dev --legacy-peer-deps --save-exact react-test-renderer@19.2.0 @testing-library/react-native</code>
>
> تأكد من أن إصدار react-test-renderer يطابق إصدار React في المشروع في أمر&nbsp;<code>npm install</code>&nbsp;أعلاه. يمكنك التحقق من إصدار React بتنفيذ&nbsp;<code>npm list react --depth=0</code>.

المفهومان الرئيسيان في React Native Testing Library هما&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api/queries" target="_blank" rel="noreferrer noopener">الاستعلامات</a>&nbsp;(queries) و<a href="https://oss.callstack.com/react-native-testing-library/docs/api/events/fire-event" target="_blank" rel="noreferrer noopener">إطلاق الأحداث</a>. تُستخدم الاستعلامات لاستخراج مجموعة من العُقد من المكوّن الذي يُعرض باستخدام دالة&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/render" target="_blank" rel="noreferrer noopener">render</a>. وتكون الاستعلامات مفيدة في الاختبارات التي نتوقع فيها مثلاً وجود نص ما، مثل اسم مستودع، في المكوّن المعروض. وإليك مثالاً على استخدام استعلام&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/queries/#by-text" target="_blank" rel="noreferrer noopener">ByText</a>&nbsp;للتحقق من أن عنصر&nbsp;<code>Text</code>&nbsp;في المكوّن يحوي المحتوى النصي الصحيح:

```js
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const Greeting = ({ name }) =&gt; {
  return (
    &lt;View&gt;
      &lt;Text&gt;Hello {name}!&lt;/Text&gt;
    &lt;/View&gt;
  );
};

describe('Greeting', () =&gt; {
  it('renders a greeting message based on the name prop', () =&gt; {
    render(&lt;Greeting name="Kalle" /&gt;);

    screen.debug();

    expect(screen.getByText('Hello Kalle!')).toBeDefined();
  });
});
```

تستخدم الاختبارات الكائن&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/screen" target="_blank" rel="noreferrer noopener">screen</a>&nbsp;لإجراء الاستعلامات على المكوّن المعروض.

نحصل على عقدة&nbsp;<code>Text</code>&nbsp;التي تحوي نصاً معيناً باستخدام الدالة&nbsp;<code>getByText</code>. ويُستخدم مطابِق Jest&nbsp;<a href="https://jestjs.io/docs/expect#tobedefined" target="_blank" rel="noreferrer noopener">toBeDefined</a>&nbsp;للتأكد من أن الاستعلام قد وجد العنصر.

يحتوي توثيق React Native Testing Library على إرشادات جيدة حول&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/guides/how-to-query" target="_blank" rel="noreferrer noopener">كيفية الاستعلام عن أنواع مختلفة من العناصر</a>. وهناك دليل آخر يستحق القراءة، وهو مقال Kent C. Dodds بعنوان&nbsp;<a href="https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change" target="_blank" rel="noreferrer noopener">Making your UI tests resilient to change</a>.

كما يمتلك الكائن&nbsp;<code>screen</code>&nbsp;دالة مساعدة هي&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/screen#debug" target="_blank" rel="noreferrer noopener">debug</a>&nbsp;تطبع شجرة React المعروضة بصيغة سهلة القراءة. استخدمها إن لم تكن متأكداً من شكل شجرة React التي تعرضها دالة&nbsp;<code>render</code>.

للاطلاع على جميع الاستعلامات المتاحة، راجع&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api/queries" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;React Native Testing Library. ويمكن العثور على القائمة الكاملة للمطابِقات المتاحة الخاصة بـReact Native في&nbsp;<a href="https://oss.callstack.com/react-native-testing-library/docs/api/jest-matchers" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;React Native Testing Library. بينما يحتوي&nbsp;<a href="https://jestjs.io/docs/en/expect" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;Jest على كل مطابِق عام في Jest.

المفهوم الثاني المهم جداً في React Native Testing Library هو إطلاق الأحداث. يمكننا إطلاق حدث في عقدة معيّنة باستخدام دوال الكائن&nbsp;<a href="https://callstack.github.io/react-native-testing-library/docs/api#fireevent" target="_blank" rel="noreferrer noopener">fireEvent</a>. وهذا مفيد مثلاً في كتابة نص في حقل إدخال نصي أو الضغط على زر. وإليك مثالاً على كيفية اختبار إرسال نموذج بسيط:

```js
import { useState } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';

const Form = ({ onSubmit }) =&gt; {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () =&gt; {
    onSubmit({ username, password });
  };

  return (
    &lt;View&gt;
      &lt;View&gt;
        &lt;TextInput
          value={username}
          onChangeText={(text) =&gt; setUsername(text)}
          placeholder="Username"
        /&gt;
      &lt;/View&gt;
      &lt;View&gt;
        &lt;TextInput
          value={password}
          onChangeText={(text) =&gt; setPassword(text)}
          placeholder="Password"
        /&gt;
      &lt;/View&gt;
      &lt;View&gt;
        &lt;Pressable onPress={handleSubmit}&gt;
          &lt;Text&gt;Submit&lt;/Text&gt;
        &lt;/Pressable&gt;
      &lt;/View&gt;
    &lt;/View&gt;
  );
};

describe('Form', () =&gt; {
  it('calls function provided by onSubmit prop after pressing the submit button', () =&gt; {
    const onSubmit = jest.fn();
    render(&lt;Form onSubmit={onSubmit} /&gt;);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // onSubmit.mock.calls[0][0] يحتوي الوسيط الأول للاستدعاء الأول
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

في هذا الاختبار، نريد اختبار أنه بعد ملء حقول النموذج باستخدام الدالة&nbsp;<code>fireEvent.changeText</code>&nbsp;والضغط على زر الإرسال باستخدام الدالة&nbsp;<code>fireEvent.press</code>، تُستدعى دالة النداء العكسي&nbsp;<code>onSubmit</code>&nbsp;بشكل صحيح. وللفحص مما إذا كانت دالة&nbsp;<code>onSubmit</code>&nbsp;قد استُدعيت وبأي وسائط، يمكننا استخدام&nbsp;<a href="https://jestjs.io/docs/en/mock-function-api" target="_blank" rel="noreferrer noopener">دالة وهمية</a>&nbsp;(mock function). الدوال الوهمية دوال ذات سلوك مبرمج مسبقاً مثل قيمة إرجاع محددة. وإضافة إلى ذلك، يمكننا إنشاء توقعات للدوال الوهمية مثل «توقّع أن تكون الدالة الوهمية قد استُدعيت مرة واحدة». ويمكن العثور على القائمة الكاملة للتوقعات المتاحة في&nbsp;<a href="https://jestjs.io/docs/en/expect" target="_blank" rel="noreferrer noopener">توثيق expect</a>&nbsp;في Jest.

قبل التعمق أكثر في عالم اختبار تطبيقات React Native، جرّب هذه الأمثلة بإضافة ملف اختبار في مجلد&nbsp;<em>__tests__</em>&nbsp;الذي أنشأناه سابقاً.

## التعامل مع الاعتماديات في الاختبارات

المكوّنات في الأمثلة السابقة سهلة الاختبار إلى حد كبير لأنها&nbsp;<em>نقية</em>&nbsp;إلى حدٍّ ما. فالمكوّنات النقية لا تعتمد على&nbsp;<em>آثار جانبية</em>&nbsp;مثل طلبات الشبكة أو استخدام واجهة برمجية أصلية مثل AsyncStorage. ومكوّن&nbsp;<code>Form</code>&nbsp;أقل نقاءً بكثير من مكوّن&nbsp;<code>Greeting</code>&nbsp;لأن تغيّرات حالته يمكن اعتبارها أثراً جانبياً. ومع ذلك، ليس اختباره صعباً للغاية.

بعد ذلك، لنلقِ نظرة على استراتيجية لاختبار المكوّنات ذات الآثار الجانبية. لنأخذ مكوّن&nbsp;<code>RepositoryList</code>&nbsp;من تطبيقنا كمثال. في الوقت الحالي، للمكوّن أثر جانبي واحد هو استعلام GraphQL لجلب المستودعات المُقيَّمة. والتنفيذ الحالي لمكوّن&nbsp;<code>RepositoryList</code>&nbsp;يبدو شيئاً كهذا:

```js
const RepositoryList = () =&gt; {
  const { repositories } = useRepositories();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

الأثر الجانبي الوحيد هو استخدام خطاف&nbsp;<code>useRepositories</code>&nbsp;الذي يرسل استعلام GraphQL. وهناك طرق عدة لاختبار هذا المكوّن. إحدى الطرق هي محاكاة استجابات Apollo Client على النحو الموضح في&nbsp;<a href="https://www.apollographql.com/docs/react/development-testing/testing/" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;Apollo Client. وهناك طريقة أبسط هي افتراض أن خطاف&nbsp;<code>useRepositories</code>&nbsp;يعمل كما هو مقصود (ويُفضّل ذلك بعد اختباره) واستخراج الشيفرة «النقية» من المكوّن إلى مكوّن آخر مثل مكوّن&nbsp;<code>RepositoryListContainer</code>:

```js
export const RepositoryListContainer = ({ repositories }) =&gt; {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
    /&gt;
  );
};

const RepositoryList = () =&gt; {
  const { repositories } = useRepositories();

  return &lt;RepositoryListContainer repositories={repositories} /&gt;;
};

export default RepositoryList;
```

الآن، لم يعد مكوّن <code>RepositoryList</code> يحتوي إلا على الآثار الجانبية وتنفيذه بسيط جداً. ويمكننا اختبار مكوّن <code>RepositoryListContainer</code> بتزويده ببيانات مستودعات مقسّمة إلى صفحات عبر خاصية <code>repositories</code> والتحقق من أن المحتوى المعروض يحوي المعلومات الصحيحة.

<div class="tasks">

**17. اختبار قائمة المستودعات المُقيَّمة**

</div>

<div class="tasks">

**18. اختبار نموذج تسجيل الدخول**

</div>

## توسيع تطبيقنا

حان وقت الاستفادة القصوى من كل ما تعلمناه حتى الآن والبدء بتوسيع تطبيقنا. ما زال تطبيقنا يفتقر إلى بعض الميزات المهمة مثل تقييم مستودع وتسجيل مستخدم. وستركز التمارين القادمة على هذه الميزات الأساسية.

<div class="tasks">

**19. عرض المستودع المفرد**

</div>

<div class="tasks">

**20. قائمة تقييمات المستودع**

</div>

<div class="tasks">

**21. نموذج التقييم**

</div>

<div class="tasks">

**22. نموذج إنشاء الحساب**

</div>

<div class="tasks">

**23. ترتيب قائمة المستودعات المُقيَّمة**

</div>

<div class="tasks">

**24. تصفية قائمة المستودعات المُقيَّمة**

</div>

####

<div class="tasks">

**25. عرض تقييمات المستخدم**

</div>

####

<div class="tasks">

**26. إجراءات التقييم**

</div>
## ترقيم الصفحات المعتمد على المؤشر

عندما تعيد واجهة برمجية قائمة مرتبة من العناصر من مجموعة ما، فإنها تعيد عادةً مجموعة فرعية من المجموعة الكاملة للعناصر لتقليل عرض النطاق المطلوب وتخفيف استهلاك الذاكرة في تطبيقات العميل. ويمكن تقييد المجموعة الفرعية المرغوبة من العناصر بحيث يستطيع العميل أن يطلب مثلاً أول عشرين عنصراً في القائمة بعد فهرس معيّن. وتُعرف هذه التقنية عموماً باسم&nbsp;<em>ترقيم الصفحات</em>. وعندما يمكن طلب عناصر بعد عنصر معيّن يحدده&nbsp;<em>مؤشر</em>&nbsp;(cursor)، فإننا نتحدث عن&nbsp;<em>ترقيم الصفحات المعتمد على المؤشر</em>.

إذن المؤشر ليس سوى تمثيل متسلسل لعنصر في قائمة مرتبة. لنلقِ نظرة على المستودعات المقسّمة إلى صفحات التي يعيدها استعلام&nbsp;<code>repositories</code>&nbsp;باستخدام الاستعلام التالي:

```
{
  repositories(first: 2) {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

تخبر الوسيطة&nbsp;<code>first</code>&nbsp;الواجهة البرمجية بأن تعيد أول مستودعين فقط. وإليك مثالاً على نتيجة الاستعلام:

```json
{
  "data": {
    "repositories": {
      "totalCount": 10,
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js",
            "createdAt": "2020-05-15T11:59:57.557Z"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        },
        {
          "node": {
            "id": "zeit.swr",
            "fullName": "zeit/swr",
            "createdAt": "2020-05-15T11:58:53.867Z"
          },
          "cursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10="
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "startCursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd",
        "hasNextPage": true
      }
    }
  }
}
```

تعتمد صيغة كائن النتيجة والوسائط على&nbsp;<a href="https://relay.dev/graphql/connections.htm" target="_blank" rel="noreferrer noopener">مواصفة اتصالات المؤشر في GraphQL من Relay</a>، التي أصبحت مواصفة ترقيم صفحات شائعة إلى حد كبير واعتُمدت على نطاق واسع مثلاً في&nbsp;<a href="https://docs.github.com/en/graphql" target="_blank" rel="noreferrer noopener">واجهة GitHub البرمجية لـGraphQL</a>. في كائن النتيجة، لدينا مصفوفة&nbsp;<code>edges</code>&nbsp;تحتوي عناصر لها خاصيتا&nbsp;<code>node</code>&nbsp;و<code>cursor</code>. وكما نعلم، يحتوي&nbsp;<code>node</code>&nbsp;على المستودع نفسه. أما&nbsp;<code>cursor</code>&nbsp;فهو تمثيل مرمّز بترميز Base64 للعقدة. وفي هذه الحالة، يحتوي على معرّف المستودع وتاريخ إنشاء المستودع على شكل طابع زمني. وهذه هي المعلومات التي نحتاجها للإشارة إلى العنصر عندما تُرتَّب العناصر حسب وقت إنشاء المستودع. ويحتوي&nbsp;<code>pageInfo</code>&nbsp;على معلومات مثل مؤشر العنصر الأول والأخير في المصفوفة.

لنفترض أننا نريد جلب المجموعة التالية من العناصر&nbsp;<em>بعد</em>&nbsp;العنصر الأخير في المجموعة الحالية، وهو المستودع «zeit/swr». يمكننا ضبط الوسيطة&nbsp;<code>after</code>&nbsp;في الاستعلام على قيمة&nbsp;<code>endCursor</code>&nbsp;هكذا:

```
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

الآن بعد أن حصلنا على العنصرين التاليين، يمكننا مواصلة فعل ذلك حتى تأخذ&nbsp;<code>hasNextPage</code>&nbsp;القيمة&nbsp;<code>false</code>، أي أننا وصلنا إلى نهاية القائمة. للتعمق أكثر في ترقيم الصفحات المعتمد على المؤشر، اقرأ مقال Shopify بعنوان&nbsp;<a href="https://shopify.engineering/pagination-relative-cursors" target="_blank" rel="noreferrer noopener">Pagination with Relative Cursors</a>. فهو يقدّم تفاصيل رائعة عن التنفيذ نفسه والفوائد مقارنةً بترقيم الصفحات التقليدي المعتمد على الفهرس.

## التمرير اللانهائي

تُنفَّذ القوائم القابلة للتمرير عمودياً في تطبيقات الجوال وسطح المكتب عادةً باستخدام تقنية تسمى&nbsp;<em>التمرير اللانهائي</em>. ومبدأ التمرير اللانهائي بسيط جداً:
- جلب المجموعة الأولية من العناصر
- عندما يصل المستخدم إلى العنصر الأخير، جلب المجموعة التالية من العناصر بعد العنصر الأخير

وتُكرَّر الخطوة الثانية حتى يتعب المستخدم من التمرير أو يُتجاوز حدّ معيّن للتمرير. ويشير اسم «التمرير اللانهائي» إلى الطريقة التي تبدو بها القائمة لانهائية - إذ يمكن للمستخدم أن يواصل التمرير بينما تستمر عناصر جديدة في الظهور في القائمة.

لنلقِ نظرة على كيفية عمل ذلك عملياً باستخدام خطاف&nbsp;<code>useQuery</code>&nbsp;في Apollo Client. لدى Apollo Client&nbsp;<a href="https://www.apollographql.com/docs/react/pagination/cursor-based/" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;رائع حول تنفيذ ترقيم الصفحات المعتمد على المؤشر. لننفّذ التمرير اللانهائي لقائمة المستودعات المُقيَّمة كمثال.

أولاً، نحتاج إلى معرفة متى وصل المستخدم إلى نهاية القائمة. ولحسن الحظ، يمتلك مكوّن&nbsp;<code>FlatList</code>&nbsp;خاصية&nbsp;<a href="https://reactnative.dev/docs/virtualizedlist#onendreached" target="_blank" rel="noreferrer noopener">onEndReached</a>&nbsp;تستدعي الدالة المزوّدة بمجرد أن يمرّر المستخدم إلى العنصر الأخير في القائمة. ويمكنك تغيير مدى مبكر استدعاء دالة النداء العكسي&nbsp;<code>onEndReached</code>&nbsp;باستخدام خاصية&nbsp;<a href="https://reactnative.dev/docs/virtualizedlist#onendreachedthreshold" target="_blank" rel="noreferrer noopener">onEndReachedThreshold</a>. عدّل مكوّن&nbsp;<code>FlatList</code>&nbsp;داخل مكوّن&nbsp;<code>RepositoryList</code>&nbsp;بحيث يسجّل رسالة في الطرفية بمجرد الوصول إلى نهاية القائمة:

```js
export const RepositoryListContainer = ({
  repositories,
  onEndReached, // HIGHLIGHT LINE
  /* ... */,
}) =&gt; {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) =&gt; edge.node)
    : [];

  return (
    &lt;FlatList
      data={repositoryNodes}
      // ...
      // BEGIN HIGHLIGHT
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      // END HIGHLIGHT
    /&gt;
  );
};

const RepositoryList = () =&gt; {
  // ...

  const { repositories } = useRepositories(/* ... */);

  return (
    &lt;RepositoryListContainer
      repositories={repositories}
      onEndReached={() =&gt; console.log('End of the list reached');} // HIGHLIGHT LINE
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

جرّب التمرير إلى نهاية قائمة المستودعات المُقيَّمة، وينبغي أن ترى الرسالة في السجلات.

بعد ذلك، نحتاج إلى جلب مزيد من المستودعات بمجرد الوصول إلى نهاية القائمة. ويمكن تحقيق ذلك باستخدام دالة&nbsp;<a href="https://www.apollographql.com/docs/react/pagination/core-api/#the-fetchmore-function" target="_blank" rel="noreferrer noopener">fetchMore</a>&nbsp;التي يوفّرها خطاف&nbsp;<code>useQuery</code>. ولوصف كيفية دمج المستودعات الموجودة في الذاكرة المؤقتة مع المجموعة التالية من المستودعات لـApollo Client، يمكننا استخدام&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/" target="_blank" rel="noreferrer noopener">سياسة حقل</a>. وبشكل عام، يمكن استخدام سياسات الحقول لتخصيص سلوك الذاكرة المؤقتة أثناء عمليات القراءة والكتابة باستخدام دالتي&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function" target="_blank" rel="noreferrer noopener">read</a>&nbsp;و<a href="https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function" target="_blank" rel="noreferrer noopener">merge</a>.

لنضف سياسة حقل لاستعلام&nbsp;<code>repositories</code>&nbsp;في ملف&nbsp;<em>apolloClient.js</em>:

```js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities'; // HIGHLIGHT LINE

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

// BEGIN HIGHLIGHT
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
  },
});
// END HIGHLIGHT

const createApolloClient = authStorage =&gt; {
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
    cache, // HIGHLIGHT LINE
  });
};

export default createApolloClient;
```

كما ذُكر سابقاً، تعتمد صيغة كائن نتيجة ترقيم الصفحات والوسائط على مواصفة ترقيم الصفحات من Relay. ولحسن الحظ، يوفّر Apollo Client سياسة حقل معرّفة مسبقاً هي&nbsp;<code>relayStylePagination</code>&nbsp;التي يمكن استخدامها في هذه الحالة.

بعد ذلك، لنعدّل خطاف&nbsp;<code>useRepositories</code>&nbsp;بحيث يعيد دالة&nbsp;<code>fetchMore</code>&nbsp;مزيّنة تستدعي دالة&nbsp;<code>fetchMore</code>&nbsp;الفعلية بوسائط مناسبة حتى نتمكن من جلب المجموعة التالية من المستودعات:

```js
const useRepositories = (variables) =&gt; {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {  // HIGHLIGHT LINE
    variables,
    // ...
  });

  // BEGIN HIGHLIGHT
  const handleFetchMore = () =&gt; {
    const canFetchMore = !loading &amp;&amp; data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };
  // END HIGHLIGHT

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,  // HIGHLIGHT LINE
    loading,
    ...result,
  };
};
```

تأكد من وجود الحقلين&nbsp;<code>pageInfo</code>&nbsp;و<code>cursor</code>&nbsp;في استعلام&nbsp;<code>repositories</code>&nbsp;كما هو موضح في أمثلة ترقيم الصفحات. وستحتاج أيضاً إلى تضمين الوسيطتين&nbsp;<code>after</code>&nbsp;و<code>first</code>&nbsp;في الاستعلام.

ستستدعي دالة&nbsp;<code>handleFetchMore</code>&nbsp;دالة&nbsp;<code>fetchMore</code>&nbsp;في Apollo Client إن كانت هناك عناصر أخرى يمكن جلبها، وهو ما تحدده خاصية&nbsp;<code>hasNextPage</code>. ونريد أيضاً منع جلب مزيد من العناصر إذا كانت عملية الجلب جارية بالفعل. وفي هذه الحالة، ستكون&nbsp;<code>loading</code>&nbsp;هي&nbsp;<code>true</code>. وفي دالة&nbsp;<code>fetchMore</code>&nbsp;نزوّد الاستعلام بمتغير&nbsp;<code>after</code>&nbsp;الذي يتلقى أحدث قيمة لـ<code>endCursor</code>.

الخطوة الأخيرة هي تمرير دالة&nbsp;<code>fetchMore</code>&nbsp;كقيمة للخاصية&nbsp;<code>onEndReached</code>:

```js
const RepositoryList = () =&gt; {
  // ...

  const { repositories, fetchMore } = useRepositories({  // HIGHLIGHT LINE
    first: 5, // HIGHLIGHT LINE
    // ...
  });

  return (
    &lt;RepositoryListContainer
      repositories={repositories}
      onEndReached={fetchMore}  // HIGHLIGHT LINE
      // ...
    /&gt;
  );
};

export default RepositoryList;
```

استخدم قيمة صغيرة نسبياً للوسيطة <code>first</code> مثل 5 أثناء تجربة التمرير اللانهائي. وبهذه الطريقة لن تحتاج إلى تقييم عدد كبير جداً من المستودعات. وإذا كانت القائمة تحتوي مستودعات قليلة بحيث تكون نهاية القائمة قريبة بالفعل أو مرئية، فقد تُستدعى <code>fetchMore</code> فوراً عند تحميل العرض أو قد لا تُطلق حتى يمرّر المستخدم. وإذا سبّب ذلك مشكلات أثناء الاختبار، يمكنك تجاوز هذه المسألة بزيادة قيمة الوسيطة <code>first</code>. وبمجرد أن تطمئن إلى أن التمرير اللانهائي يعمل، لا تتردد في استخدام قيمة أكبر للوسيطة <code>first</code>.

<div class="tasks">

**27. اختياري: التمرير اللانهائي لقائمة تقييمات المستودع**

</div>

## مشاركة التطبيق برمز QR

حتى الآن، طوّرنا التطبيق محلياً على جهازنا فقط واختبرناه على هاتفنا أو محاكينا. لكن ماذا لو أردنا أن نتيح للآخرين اختبار التطبيق أيضاً، بحيث يستطيع شخص آخر تجربته على هاتفه الخاص؟

يوفّر Expo حلاً جاهزاً لذلك.&nbsp;<a href="https://expo.dev/services" target="_blank" rel="noreferrer noopener">Expo Application Services</a>&nbsp;(EAS) هي خدمة سحابية من Expo توفّر أدوات لبناء التطبيقات وتحديثها وتوزيعها. و<a href="https://docs.expo.dev/eas-update/introduction/" target="_blank" rel="noreferrer noopener">EAS Update</a>&nbsp;خدمة مجانية تتيح لك نشر تطبيقك على خوادم Expo. ويُنشأ رمز QR فريد لكل إصدار منشور، وبه يمكن لأي شخص فتح التطبيق باستخدام تطبيق Expo Go.

لننشر الآن النسخة النهائية من التطبيق على خوادم Expo. ستحتاج إلى حساب Expo لاستخدام الخدمة. وإن لم يكن لديك حساب، أنشئ حساباً على&nbsp;<a href="https://expo.dev/signup" target="_blank" rel="noreferrer noopener">https://expo.dev/signup</a>.

سجّل الدخول إلى حساب Expo من سطر الأوامر:

```bash
npx eas-cli@latest login
```

بعد ذلك، هيّئ المستودع كمشروع EAS:

```bash
npx eas-cli@latest update:configure
```

يربط أمر&nbsp;<code>update:configure</code>&nbsp;المشروع بخدمة EAS من Expo ويضيف الإعداد المطلوب إلى ملف&nbsp;<em>app.json</em>.

اكتمل الإعداد الأولي الآن. غير أن هناك تفصيلاً واحداً لا يزال يحتاج إلى انتباه. لكي يعمل التطبيق، يحتاج إلى&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api" target="_blank" rel="noreferrer noopener">Rate Repository API</a>&nbsp;الذي يعمل كواجهة خلفية وقاعدة بيانات للتطبيق. ولأنه تطبيق منفصل تماماً عن واجهة React Native الأمامية، فسيحتاج عادةً إلى نشره في مكان ما بشكل منفصل.

للتمارين النهائية في هذا الجزء، توفّر الدورة واجهة Rate Repository API منشورة مسبقاً على <a href="https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi" target="_blank" rel="noopener">https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi</a>. وهذه هي واجهة Rate Repository API نفسها التي استخدمناها محلياً في التمارين السابقة. فوظائف الواجهة كما هي، وقد زُوّدت قاعدة البيانات ببيانات أولية تضم بعض المستخدمين والمستودعات وفقاً للتعليمات في&nbsp;<a href="https://github.com/fullstack-hy2020/rate-repository-api?tab=readme-ov-file#-getting-started" target="_blank" rel="noreferrer noopener">README</a>&nbsp;الخاصة بـ Rate Repository API.

تعمل الواجهة الآن في وضع الإنتاج، أي أن متغير البيئة NODE_ENV مضبوط على production. ولذلك بعض النتائج العملية. فمثلاً لا يعرف Apollo Sandbox مخطط الواجهة تلقائياً. كما تُعاد قاعدة البيانات التي تستخدمها Rate Repository API دورياً دون إنذار مسبق، لذا ينبغي أثناء التطوير المحلي استخدام نسخة محلية من Rate Repository API.

أنشئ متغير بيئة باسم&nbsp;<code>EXPO_PUBLIC_APOLLO_URI</code>&nbsp;لمشروع EAS واضبط قيمته على عنوان URL الخاص بواجهة Rate Repository API المنشورة مسبقاً باستخدام الأمر التالي:

```bash
npx eas-cli@latest env:create --name EXPO_PUBLIC_APOLLO_URI --value https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi/ --environment preview --visibility plaintext
```
- يُنشأ متغير البيئة في بيئة تسمى <code>preview</code>، وهي مخصّصة تحديداً لهذا النوع من اختبار التطبيقات.
- تُضبط رؤية متغير البيئة على <code>plaintext</code>، لأن القيمة ليست سرية بشكل خاص.

نحن الآن جاهزون لنشر التطبيق على خوادم Expo. ويتم النشر بالأمر التالي:

```bash
npx eas-cli@latest update --branch main --environment preview --message "The first deploy"
```
- يتيح EAS Update تجميع التحديثات في فروع مختلفة. وفي حالتنا، يحدّد الخيار <code>--branch</code> نشر التحديث في فرع يسمى <code>main</code>.
- بفضل الخيار <code>--environment</code> يحصل تطبيقنا على صلاحية الوصول إلى بيئة <code>preview</code> وإلى متغير البيئة <code>EXPO_PUBLIC_APOLLO_URI</code> الذي عرّفناه سابقاً.
- يضبط الخيار <code>--message</code> رسالة اعتباطية للتحديث حتى يمكن تمييزه عن التحديثات الأخرى.

عند نشر التحديث، سيطبع سطر الأوامر أخيراً رابطاً إلى صفحة لوحة EAS الخاصة بعملية النشر. وتضم اللوحة زر&nbsp;<em>Preview</em>&nbsp;يعرض رمز QR يؤدي إلى التطبيق. وعند مسح رمز QR بتطبيق Expo Go، ينبغي أن يفتح التطبيق على الهاتف وأن يعمل مع واجهة Rate Repository API الخارجية. بعبارة أخرى، ينبغي أن تُحمّل قائمة المستودعات، وأن يكون ممكناً إنشاء مستخدمين جدد في التطبيق وتسجيل الدخول ببيانات اعتماد موجودة، وهكذا.

إذا أردت إجراء تغييرات على التطبيق، يكفي تشغيل الأمر&nbsp;<code>npx eas-cli@latest update</code>&nbsp;مرة أخرى لنشر تحديث جديد. لاحظ أن كل تحديث منشور يحصل على رمز QR فريد خاص به.

يُسهّل استخدام EAS Update عرض تقدّم تطوير التطبيق على الآخرين، إذ لا حاجة إلى مشاركة الشيفرة المصدرية أو بناء حزم التثبيت أو نشر أي شيء في متجر تطبيقات. وتبقى عملية النشر بسيطة مع إتاحة اختبار التطبيق على أجهزة حقيقية.

<div class="tasks">

**28. نشر التطبيق عبر EAS Publish**

</div>

## موارد إضافية

بينما نقترب من نهاية هذا الجزء، لنأخذ لحظة للنظر في بعض الموارد الإضافية المتعلقة بـReact Native.&nbsp;<a href="https://github.com/jondot/awesome-react-native" target="_blank" rel="noreferrer noopener">Awesome React Native</a>&nbsp;قائمة منتقاة شاملة للغاية من موارد React Native مثل المكتبات والدروس والمقالات. ولأن القائمة طويلة بشكل مُستفيض، لنلقِ نظرة أقرب على بعض أبرز معالمها

### React Native Paper

> Paper مجموعة من المكوّنات القابلة للتخصيص والجاهزة للإنتاج لـReact Native، تتبع إرشادات التصميم Material Design من Google.

<a href="https://callstack.github.io/react-native-paper/" target="_blank" rel="noreferrer noopener">React Native Paper</a>&nbsp;هي لـReact Native ما هو&nbsp;<a href="https://material-ui.com/" target="_blank" rel="noreferrer noopener">Material-UI</a>&nbsp;لتطبيقات React للويب. فهي تقدّم تشكيلة واسعة من مكوّنات واجهة المستخدم عالية الجودة، ودعماً لـ<a href="https://callstack.github.io/react-native-paper/docs/guides/theming/" target="_blank" rel="noreferrer noopener">السمات المخصّصة</a>&nbsp;وإعداداً&nbsp;<a href="https://callstack.github.io/react-native-paper/docs/guides/getting-started" target="_blank" rel="noreferrer noopener">بسيطاً إلى حد كبير</a>&nbsp;لتطبيقات React Native القائمة على Expo.

### Styled-components

> باستخدام القوالب النصية الموسومة (tagged template literals) وقوة CSS، تتيح لك styled-components كتابة شيفرة CSS فعلية لتنسيق مكوّناتك. كما تُزيل الربط بين المكوّنات والأنماط – فاستخدام المكوّنات كبنية تنسيق منخفضة المستوى لم يكن أسهل من ذلك!

<a href="https://styled-components.com/" target="_blank" rel="noreferrer noopener">Styled-components</a>&nbsp;مكتبة لتنسيق مكوّنات React باستخدام تقنية&nbsp;<a href="https://en.wikipedia.org/wiki/CSS-in-JS" target="_blank" rel="noreferrer noopener">CSS-in-JS</a>. وفي React Native اعتدنا بالفعل تعريف أنماط المكوّن ككائن JavaScript، لذا فإن CSS-in-JS ليس أرضاً مجهولة تماماً. غير أن أسلوب styled-components مختلف تماماً عن استخدام الدالة&nbsp;<code>StyleSheet.create</code>&nbsp;والخاصية&nbsp;<code>style</code>.

في styled-components تُعرَّف أنماط المكوّنات مع المكوّن باستخدام ميزة تسمى&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates" target="_blank" rel="noreferrer noopener">القالب النصي الموسوم</a>&nbsp;أو كائن JavaScript عادي. وتتيح styled-components تعريف خصائص نمط جديدة للمكوّن بناءً على props الخاصة به&nbsp;<em>وقت التشغيل</em>. وهذا يفتح إمكانات كثيرة، مثل التبديل السلس بين سمة فاتحة وأخرى داكنة. كما أن لديها&nbsp;<a href="https://styled-components.com/docs/advanced#theming" target="_blank" rel="noreferrer noopener">دعماً كاملاً للسمات</a>. وإليك مثالاً على إنشاء مكوّن&nbsp;<code>Text</code>&nbsp;بتنويعات نمطية بناءً على props:

```js
import styled from 'styled-components/native';
import { css } from 'styled-components';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =&gt;
    isBlue &amp;&amp;
    css`
      color: blue;
    `}

  ${({ isBig }) =&gt;
    isBig &amp;&amp;
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Main = () =&gt; {
  return (
    &lt;&gt;
      &lt;FancyText&gt;Simple text&lt;/FancyText&gt;
      &lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
      &lt;FancyText isBig&gt;Big text&lt;/FancyText&gt;
      &lt;FancyText isBig isBlue&gt;
        Big blue text
      &lt;/FancyText&gt;
    &lt;/&gt;
  );
};
```

ولأن styled-components تعالج تعريفات الأنماط، فمن الممكن استخدام صيغة snake case الشبيهة بـCSS في أسماء الخصائص والوحدات في قيم الخصائص. غير أن الوحدات ليس لها أي تأثير لأن قيم الخصائص تُعامل داخلياً بلا وحدات. لمزيد من المعلومات عن styled-components، توجّه إلى&nbsp;<a href="https://styled-components.com/docs" target="_blank" rel="noreferrer noopener">التوثيق</a>.

### React-spring

> react-spring مكتبة تحريك قائمة على فيزياء النابض (spring-physics) ينبغي أن تغطي معظم احتياجاتك من التحريك المتعلقة بواجهة المستخدم. وهي تمنحك أدوات مرنة بما يكفي لتحويل أفكارك بثقة إلى واجهات متحركة.

<a href="https://www.react-spring.dev/" target="_blank" rel="noreferrer noopener">React-spring</a>&nbsp;مكتبة توفّر&nbsp;<a href="https://www.react-spring.dev/docs/getting-started" target="_blank" rel="noreferrer noopener">واجهة برمجية</a>&nbsp;نظيفة لتحريك مكوّنات React Native.

### React Navigation

> التوجيه والتنقل لتطبيقات React Native

<a href="https://reactnavigation.org/" target="_blank" rel="noreferrer noopener">React Navigation</a> مكتبة توجيه لـReact Native. وهي تتشارك بعض أوجه الشبه مع مكتبة React Router التي استخدمناها خلال هذا الجزء والأجزاء السابقة. غير أنها، بخلاف React Router، تقدّم ميزات أصلية أكثر مثل الإيماءات والحركات الأصلية للانتقال بين العروض.

## كلمة ختامية

هذا كل شيء، تطبيقنا جاهز. عمل رائع! لقد تعلمنا مفاهيم جديدة كثيرة خلال رحلتنا مثل إعداد تطبيق React Native باستخدام Expo، واستخدام المكوّنات الأساسية في React Native وإضافة أنماط إليها، والتواصل مع الخادم، واختبار تطبيقات React Native.

القطعة الأخيرة في اللغز ستكون نشر التطبيق في Apple App Store وGoogle Play Store. وهذا&nbsp;<em>اختياري</em>&nbsp;تماماً. وإذا قررت تجربته، فستحتاج أولاً إلى إنشاء بناءات iOS أو Android باتباع&nbsp;<a href="https://docs.expo.dev/build/setup/" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;Expo. ثم يمكنك رفع هذه البناءات إلى Apple App Store أو Google Play Store. ولدى Expo&nbsp;<a href="https://docs.expo.dev/submit/introduction/" target="_blank" rel="noreferrer noopener">توثيق</a>&nbsp;لهذا أيضاً.

<div class="tasks">

**29. مستودع GitHub الخاص بك**

</div>
