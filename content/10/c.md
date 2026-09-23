---
part: 10
letter: c
title: "أساسيات React Native"
mainImage: /images/part-10.svg
lang: ar
---
الآن بعد أن أعددنا بيئة التطوير لدينا، يمكننا الخوض في أساسيات React Native والبدء بتطوير تطبيقنا. في هذا القسم، سنتعلم كيفية بناء واجهات المستخدم باستخدام المكوّنات الأساسية في React Native، وكيفية إضافة خصائص الأنماط إلى هذه المكوّنات الأساسية، وكيفية الانتقال بين العروض، وكيفية إدارة حالة النموذج بكفاءة.

## المكوّنات الأساسية

تعلمنا في الأجزاء السابقة أنه يمكننا استخدام React لتعريف المكوّنات كدوال، تستقبل props كوسيط وتُعيد شجرة من عناصر React. وتُمثَّل هذه الشجرة عادةً بصيغة JSX. وفي بيئة المتصفح، استخدمنا مكتبة&nbsp;<a href="https://react.dev/reference/react-dom" target="_blank" rel="noreferrer noopener">ReactDOM</a>&nbsp;لتحويل هذه المكوّنات إلى شجرة DOM يمكن للمتصفح عرضها. وإليك مثالاً ملموساً على مكوّن بسيط جداً:

```js
const HelloWorld = props =&gt; {
  return &lt;div&gt;Hello world!&lt;/div&gt;;
};
```

يعيد مكوّن <code>HelloWorld</code> عنصر <em>div</em> وحيداً أُنشئ باستخدام صيغة JSX. وقد نتذكر أن صيغة JSX هذه تُصرَّف إلى استدعاءات للدالة <code>React.createElement</code>، مثل هذا:

```
React.createElement('div', null, 'Hello world!');
```

ينشئ هذا السطر من الشيفرة عنصر <em>div</em> دون أي props ومع عنصر ابن وحيد هو نص <em>"Hello world"</em>. وعندما نعرض هذا المكوّن في عنصر DOM جذري باستخدام الدالة <code>render</code>، سيُعرض عنصر <em>div</em> كعنصر DOM المقابل له.

وكما نرى، فإن React غير مرتبطة ببيئة معينة مثل بيئة المتصفح. وبدلاً من ذلك، هناك مكتبات مثل ReactDOM يمكنها عرض&nbsp;<em>مجموعة من المكوّنات المعرّفة مسبقاً</em>، مثل عناصر DOM، في بيئة محددة. وفي React Native تُسمّى هذه المكوّنات المعرّفة مسبقاً&nbsp;<em>المكوّنات الأساسية</em>.

<a href="https://reactnative.dev/docs/intro-react-native-components" target="_blank" rel="noreferrer noopener">المكوّنات الأساسية</a>&nbsp;هي مجموعة من المكوّنات التي يوفّرها React Native، والتي تستخدم خلف الكواليس المكوّنات الأصلية للمنصة. لنُنفّذ المثال السابق باستخدام React Native:

```js
import { Text } from 'react-native'; // HIGHLIGHT LINE

const HelloWorld = props => {
  return &lt;Text>Hello world!&lt;/Text>; // HIGHLIGHT LINE
};
```

إذن نستورد مكوّن <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> من React Native ونستبدل عنصر <code>div</code> بعنصر <code>Text</code>. ولكثير من عناصر DOM المألوفة نظيراتها في React Native. وإليك بعض الأمثلة المختارة من <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">وثائق المكوّنات الأساسية</a> في React Native:
- مكوّن <a href="https://reactnative.dev/docs/text" target="_blank" rel="noreferrer noopener">Text</a> هو <em>المكوّن الوحيد</em> في React Native الذي يمكن أن يحتوي على أبناء نصية. وهو مشابه مثلاً لعنصري <code>&lt;strong></code> و<code>&lt;h1></code>.
- مكوّن <a href="https://reactnative.dev/docs/view" target="_blank" rel="noreferrer noopener">View</a> هو لبنة بناء واجهة المستخدم الأساسية المشابهة لعنصر <code>&lt;div></code>.
- مكوّن <a href="https://reactnative.dev/docs/textinput" target="_blank" rel="noreferrer noopener">TextInput</a> هو مكوّن حقل نصي مشابه لعنصر <code>&lt;input></code>.
- مكوّن <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> مخصّص لالتقاط أحداث الضغط المختلفة. وهو مشابه مثلاً لعنصر <code>&lt;button></code>.

هناك بعض الفروق الجديرة بالملاحظة بين المكوّنات الأساسية وعناصر DOM. الفرق الأول أن مكوّن <code>Text</code> هو <em>المكوّن الوحيد</em> في React Native الذي يمكن أن يحتوي على أبناء نصية. وهذا يعني أنه لا يمكنك، مثلاً، استبدال مكوّن <code>Text</code> بمكوّن <code>View</code> في المثال السابق.

الفرق الثاني الجدير بالملاحظة يتعلق بمعالجات الأحداث. فعند العمل مع عناصر DOM اعتدنا إضافة معالجات أحداث مثل <code>onClick</code> إلى أي عنصر تقريباً مثل <code>&lt;div></code> و<code>&lt;button></code>. أما في React Native فعلينا قراءة <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noreferrer noopener">وثائق API</a> بعناية لمعرفة معالجات الأحداث (وكذلك props الأخرى) التي يقبلها المكوّن. فعلى سبيل المثال، يوفّر مكوّن <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">Pressable</a> خصائص للاستماع إلى أنواع مختلفة من أحداث الضغط. ويمكننا مثلاً استخدام خاصية <a href="https://reactnative.dev/docs/pressable" target="_blank" rel="noreferrer noopener">onPress</a> في المكوّن للاستماع إلى أحداث الضغط:

```js
import { Text, Pressable, Alert } from 'react-native';

const PressableText = props =&gt; {
  return (
    &lt;Pressable
      onPress={() =&gt; Alert.alert('You pressed the text!')}
    &gt;
      &lt;Text&gt;You can press me&lt;/Text&gt;
    &lt;/Pressable&gt;
  );
};
```

## تثبيت الاعتماديات في مشروع Expo

في الأجزاء السابقة من المقرر، ثبّتنا المكتبات أساساً كاعتماديات للمشروع باستخدام الأمر <code>npm install</code>. غير أنه عند تثبيت مكتبات Expo وReact Native، يُوصى باستخدام الأمر <code>npx expo install</code> بدلاً من ذلك. فهذا يتيح لواجهة سطر أوامر Expo اختيار إصدار من المكتبة يتوافق مع المشروع وإصدار SDK الخاص به.

سنحتاج قريباً إلى مكتبة&nbsp;<em>expo-constants</em>&nbsp;التي تزوّد التطبيق بمعلومات البيئة مثل ارتفاع شريط الحالة الصحيح. ثبّت المكتبة بالأمر:

```bash
npx expo install expo-constants
```

وإذا لم تكن متأكداً مما إذا كانت المكتبة تحتوي على شيفرة أصلية خاصة بـ Expo أو React Native، فيمكنك دائماً تثبيتها باستخدام الأمر <code>npx expo install</code>. وإذا لم يتعرّف Expo على الحزمة، فسيعود إلى تثبيتها باستخدام الأمر العادي <code>npm install</code>.

## هيكلة مشروعنا

الآن بعد أن اكتسبنا فهماً أساسياً للمكوّنات الأساسية، لنبدأ بإعطاء مشروعنا بعض الهيكلة. أنشئ مجلد&nbsp;<em>src</em>&nbsp;في المجلد الجذري لمشروعك، وأنشئ داخل مجلد&nbsp;<em>src</em>&nbsp;مجلد&nbsp;<em>components</em>.

وفي مجلد&nbsp;<em>components</em>&nbsp;أنشئ ملف&nbsp;<em>Main.jsx</em>&nbsp;بالمحتوى التالي:

```js
import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
  },
});

const Main = () =&gt; {
  return (
    &lt;View style={styles.container}&gt;
      &lt;Text&gt;Rate Repository Application&lt;/Text&gt;
    &lt;/View&gt;
  );
};

export default Main;
```

بعد ذلك، لنستخدم مكوّن <code>Main</code> في مكوّن <code>App</code> داخل ملف <em>App.js</em> الموجود في المجلد الجذري لمشروعنا. استبدل المحتوى الحالي للملف بهذا:

```js
import Main from './src/components/Main';

const App = () =&gt; {
  return &lt;Main /&gt;;
};

export default App;
```

## إعادة تحميل التطبيق يدوياً

كما رأينا، سيعيد Expo تحميل التطبيق تلقائياً عند إجراء تغييرات على الشيفرة. غير أنه قد تكون هناك أوقات لا تعمل فيها إعادة التحميل التلقائي، فيلزم إعادة تحميل التطبيق يدوياً. وفي واجهة سطر أوامر Expo، يمكنك الضغط على <code>r</code> لإعادة التحميل؛ وهذا يفعّل إعادة التحميل عادةً.

ويمكن تحقيق ذلك أيضاً عبر قائمة المطوّر داخل التطبيق. ويمكنك الوصول إلى قائمة المطوّر بهزّ جهازك أو باختيار "Shake Gesture" داخل قائمة Hardware في محاكي iOS. ويمكنك أيضاً استخدام اختصار لوحة المفاتيح <code>⌘D</code> عندما يعمل تطبيقك في محاكي iOS، أو <code>⌘M</code> عند التشغيل في محاكي Android على نظام Mac OS، و<code>Ctrl+M</code> على Windows وLinux.

وبمجرد فتح قائمة المطوّر، اضغط ببساطة "Reload" لإعادة تحميل التطبيق. وبعد إعادة تحميل التطبيق، ينبغي أن تعمل عمليات إعادة التحميل التلقائية دون الحاجة إلى إعادة تحميل يدوية.

<div class="tasks">

**3. قائمة المستودعات المُقيَّمة**

</div>

## الأنماط

الآن بعد أن أصبح لدينا فهم أساسي لكيفية عمل المكوّنات الأساسية ويمكننا استخدامها لبناء واجهة مستخدم بسيطة، حان وقت إضافة بعض الأنماط. في <a href="/part2/adding_styles_to_react_app" target="_blank" rel="noreferrer noopener">الجزء 2</a> تعلمنا أنه في بيئة المتصفح يمكننا تعريف خصائص أنماط مكوّنات React باستخدام CSS. وكان لدينا خيار تعريف هذه الأنماط مضمّنة باستخدام خاصية <code>style</code> أو في ملف CSS بمحدّد مناسب.

هناك أوجه تشابه كثيرة في طريقة إرفاق خصائص الأنماط بالمكوّنات الأساسية في React Native وطريقة إرفاقها بعناصر DOM. ففي React Native تقبل معظم المكوّنات الأساسية خاصية تُسمّى <code>style</code>. وتقبل خاصية <code>style</code> كائناً يحوي خصائص الأنماط وقيمها. وهذه الخصائص هي في معظم الحالات نفسها كما في CSS، غير أن أسماء الخصائص تُكتب بصيغة <em>camelCase</em>. وهذا يعني أن خصائص CSS مثل <code>padding-top</code> و<code>font-size</code> تُكتب <code>paddingTop</code> و<code>fontSize</code>. وإليك مثالاً بسيطاً على كيفية استخدام خاصية <code>style</code>:

```js
import { Text, View } from 'react-native';

const BigBlueText = () =&gt; {
  return (
    &lt;View style={{ padding: 20 }}&gt;
      &lt;Text style={{ color: 'blue', fontSize: 24, fontWeight: '700' }}&gt;
        Big blue text
      &lt;/Text&gt;
    &lt;/View&gt;
  );
};
```

إضافةً إلى أسماء الخصائص، ربما لاحظت فرقاً آخر في المثال. ففي CSS تكون القيم الرقمية للخصائص عادةً مصحوبة بوحدة مثل <em>px</em> أو <em>%</em> أو <em>em</em> أو <em>rem</em>. أما في React Native فجميع قيم الخصائص المتعلقة بالأبعاد مثل <code>width</code> و<code>height</code> و<code>padding</code> و<code>margin</code> وكذلك أحجام الخطوط تكون <em>دون وحدة</em>. وتمثّل هذه القيم الرقمية بلا وحدة <em>بكسلات مستقلة عن الكثافة</em>. وإذا كنت تتساءل عن خصائص الأنماط المتاحة لمكوّنات أساسية معينة، فراجع <a href="https://github.com/vhpoet/react-native-styling-cheat-sheet" target="_blank" rel="noreferrer noopener">ورقة أنماط React Native المرجعية</a>.

بشكل عام، لا يُعدّ تعريف الأنماط مباشرة في خاصية <code>style</code> فكرة جيدة، لأنه يجعل المكوّنات متضخمة وغير واضحة. وبدلاً من ذلك، ينبغي تعريف الأنماط خارج دالة عرض المكوّن باستخدام الدالة <a href="https://reactnative.dev/docs/stylesheet#create" target="_blank" rel="noreferrer noopener">StyleSheet.create</a>. وتقبل الدالة <code>StyleSheet.create</code> وسيطاً وحيداً هو كائن يتألف من كائنات أنماط مُسمّاة، وهي تُنشئ مرجع نمط StyleSheet من الكائن المعطى. وإليك مثالاً على كيفية إعادة هيكلة المثال السابق باستخدام الدالة <code>StyleSheet.create</code>:

```js
import { Text, View, StyleSheet } from 'react-native'; // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: '700',
  },
});
// END HIGHLIGHT

const BigBlueText = () => {
  return (
    &lt;View style={styles.container}> // HIGHLIGHT LINE
      &lt;Text style={styles.text}> // HIGHLIGHT LINE
        Big blue text
      &lt;/Text>
    &lt;/View>
  );
};
```

أنشأنا كائني نمط مُسمّيين، <code>styles.container</code> و<code>styles.text</code>. ويمكننا داخل المكوّن الوصول إلى كائنات أنماط محددة بالطريقة نفسها التي نصل بها إلى أي مفتاح في كائن عادي.

إضافةً إلى كائن، تقبل خاصية <code>style</code> أيضاً مصفوفة من الكائنات. وفي حالة المصفوفة، تُدمج الكائنات من اليسار إلى اليمين بحيث تكون أولوية خصائص الأنماط اللاحقة أعلى. ويعمل هذا بشكل تعاودي، فيمكن أن تكون لدينا مثلاً مصفوفة تحتوي على مصفوفة من الأنماط وهكذا. وإذا احتوت المصفوفة على قيم تُقيَّم إلى false، مثل <code>null</code> أو <code>undefined</code>، فتُتجاهل هذه القيم. وهذا يسهّل تعريف <em>أنماط شرطية</em> مثلاً بناءً على قيمة prop. وإليك مثالاً على الأنماط الشرطية:

```js
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 14,
  },
  blueText: {
    color: 'blue',
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const FancyText = ({ isBlue, isBig, children }) =&gt; {
  const textStyles = [
    styles.text,
    isBlue &amp;&amp; styles.blueText,
    isBig &amp;&amp; styles.bigText,
  ];

  return &lt;Text style={textStyles}&gt;{children}&lt;/Text&gt;;
};

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

تُعرَّف props الآن دون قيمة صريحة:

```
&lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
```

في JSX، تزويد prop بدون قيمة هو صيغة خاصة تعني نفس معنى ={true}. ولذلك فإن السطرين التاليين متكافئان:

```
&lt;FancyText isBlue&gt;Blue text&lt;/FancyText&gt;
&lt;FancyText isBlue={true}&gt;Blue text&lt;/FancyText&gt;
```

في المثال، نستخدم المعامل <code>&amp;&amp;</code> مع التعبير <code>condition &amp;&amp; exprIfTrue</code>:

```js
    const textStyles = [
    styles.text,
    isBlue &amp;&amp; styles.blueText, // HIGHLIGHT LINE
    isBig &amp;&amp; styles.bigText,
  ];
```

فمثلاً، في السطر المميّز، يعطي التعبير <code>styles.blueText</code> إذا قُيّمت الشرط <code>isBlue</code> إلى true، وإلا فإنه يعطي <code>condition</code>، وهي في تلك الحالة قيمة تُقيَّم إلى false. وهذا اختصار عملي وواسع الانتشار للغاية.

وخيار آخر هو استخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator" target="_blank" rel="noreferrer noopener">المعامل الشرطي</a>&nbsp;هكذا:

```
condition ? exprIfTrue : exprIfFalse
```

## واجهة مستخدم متسقة باستخدام الثيم

لنبقَ مع مفهوم الأنماط لكن من منظور أوسع قليلاً. معظمنا استخدم عدداً كبيراً من التطبيقات المختلفة وقد نتفق على أن إحدى السمات التي تصنع واجهة مستخدم جيدة هي&nbsp;<em>الاتساق</em>. وهذا يعني أن مظهر مكوّنات واجهة المستخدم مثل حجم الخط وعائلة الخط واللون يتبع نمطاً متسقاً. ولتحقيق ذلك علينا بطريقة ما&nbsp;<em>تحديد قيم خصائص الأنماط المختلفة كمعاملات</em>. وتُعرف هذه الطريقة عادةً بـ&nbsp;<em>الثيم</em> (theming).

قد يكون مستخدمو مكتبات واجهات المستخدم الشائعة مثل <a href="https://getbootstrap.com/docs/4.4/getting-started/theming/" target="_blank" rel="noreferrer noopener">Bootstrap</a> و<a href="https://material-ui.com/customization/theming/" target="_blank" rel="noreferrer noopener">Material UI</a> على دراية كبيرة بالثيم أصلاً. ومع أن تطبيقات الثيم تختلف، فإن الفكرة الرئيسية هي دائماً استخدام متغيرات مثل <code>colors.primary</code> بدلاً من <a href="https://en.wikipedia.org/wiki/Magic_number_(programming)" target="_blank" rel="noreferrer noopener">"الأرقام السحرية"</a> مثل <code>#0366d6</code> عند تعريف الأنماط. وهذا يؤدي إلى زيادة الاتساق والمرونة.

لنرَ كيف يمكن أن يعمل الثيم عملياً في تطبيقنا. سنستخدم الكثير من النصوص بتنويعات مختلفة، مثل أحجام وألوان خطوط مختلفة. ولأن React Native لا يدعم الأنماط العامة، ينبغي أن ننشئ مكوّن <code>Text</code> خاصاً بنا للحفاظ على اتساق المحتوى النصي. لنبدأ بإضافة كائن إعداد الثيم التالي في ملف <em>theme.js</em> في مجلد <em>src</em>:

```js
const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
```

بعد ذلك، ينبغي إنشاء مكوّن <code>Text</code> الفعلي الذي يستخدم إعداد الثيم هذا. أنشئ ملف <em>Text.jsx</em> في مجلد <em>components</em> حيث لدينا بالفعل بقية مكوّناتنا. وأضف المحتوى التالي إلى ملف <em>Text.jsx</em>:

```js
import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) =&gt; {
  const textStyle = [
    styles.text,
    color === 'textSecondary' &amp;&amp; styles.colorTextSecondary,
    color === 'primary' &amp;&amp; styles.colorPrimary,
    fontSize === 'subheading' &amp;&amp; styles.fontSizeSubheading,
    fontWeight === 'bold' &amp;&amp; styles.fontWeightBold,
    style,
  ];

  return &lt;NativeText style={textStyle} {...props} /&gt;;
};

export default Text;
```

الآن نفّذنا مكوّن النص لدينا. ولهذا المكوّن متغيّرات متسقة من الألوان وأحجام الخطوط وأوزان الخطوط يمكننا استخدامها في أي مكان في تطبيقنا. ويمكننا الحصول على تنويعات نصية مختلفة باستخدام props مختلفة هكذا:

```js
import Text from './Text';

const Main = () =&gt; {
  return (
    &lt;&gt;
      &lt;Text&gt;Simple text&lt;/Text&gt;
      &lt;Text style={{ paddingBottom: 10 }}&gt;Text with custom style&lt;/Text&gt;
      &lt;Text fontWeight="bold" fontSize="subheading"&gt;
        Bold subheading
      &lt;/Text&gt;
      &lt;Text color="textSecondary"&gt;Text with secondary color&lt;/Text&gt;
    &lt;/&gt;
  );
};

export default Main;
```

لا تتردد في توسيع هذا المكوّن أو تعديله إن رغبت في ذلك. وقد تكون فكرة جيدة أيضاً إنشاء مكوّنات نصية قابلة لإعادة الاستخدام مثل <code>Subheading</code> تستخدم مكوّن <code>Text</code>. كذلك واصل توسيع إعداد الثيم وتعديله مع تقدّم تطبيقك.

## استخدام flexbox للتخطيط

المفهوم الأخير الذي سنتناوله فيما يتعلق بالأنماط هو تنفيذ التخطيطات باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" target="_blank" rel="noreferrer noopener">flexbox</a>. ويعرف من هم أكثر إلماماً بـCSS أن flexbox لا يتعلق بـReact Native فقط، فله حالات استخدام كثيرة في تطوير الويب أيضاً. ومن يعرف كيف يعمل flexbox في تطوير الويب لن يتعلم كثيراً من هذا القسم على الأرجح. ومع ذلك، لنتعلم أساسيات flexbox أو نراجعها.

flexbox هو كيان تخطيط يتألف من جزأين منفصلين: <em>حاوية flex</em> وداخلها مجموعة من <em>عناصر flex</em>. ولحاوية flex مجموعة من الخصائص التي تتحكم في انسياب عناصرها. ولكي يصبح مكوّن حاوية flex يجب أن تكون خاصية النمط <code>display</code> فيه مضبوطة على <code>flex</code>، وهي القيمة الافتراضية للخاصية <code>display</code>. وإليك مثالاً على حاوية flex:

```js
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
});

const FlexboxExample = () =&gt; {
  return &lt;View style={styles.flexContainer}&gt;{/* ... */}&lt;/View&gt;;
};
```

ربما تكون أهم خصائص حاوية flex هي التالية:
- تتحكم خاصية <a href="https://css-tricks.com/almanac/properties/f/flex-direction/" target="_blank" rel="noreferrer noopener">flexDirection</a> في الاتجاه الذي تُرتَّب فيه عناصر flex داخل الحاوية. والقيم الممكنة لهذه الخاصية هي <code>row</code> و<code>row-reverse</code> و<code>column</code> (القيمة الافتراضية) و<code>column-reverse</code>. واتجاه flex <code>row</code> سيرتّب عناصر flex من اليسار إلى اليمين، بينما <code>column</code> من الأعلى إلى الأسفل. واتجاهات <code>*-reverse</code> تعكس ببساطة ترتيب عناصر flex.
- تتحكم خاصية <a href="https://css-tricks.com/almanac/properties/j/justify-content/" target="_blank" rel="noreferrer noopener">justifyContent</a> في محاذاة عناصر flex على طول المحور الرئيسي (المحدَّد بخاصية <code>flexDirection</code>). والقيم الممكنة لهذه الخاصية هي <code>flex-start</code> (القيمة الافتراضية) و<code>flex-end</code> و<code>center</code> و<code>space-between</code> و<code>space-around</code> و<code>space-evenly</code>.
- تفعل خاصية <a href="https://css-tricks.com/almanac/properties/a/align-items/" target="_blank" rel="noreferrer noopener">alignItems</a> الشيء نفسه الذي تفعله <code>justifyContent</code> لكن على المحور المقابل. والقيم الممكنة لهذه الخاصية هي <code>flex-start</code> و<code>flex-end</code> و<code>center</code> و<code>baseline</code> و<code>stretch</code> (القيمة الافتراضية).

لننتقل إلى عناصر flex. وكما ذُكر، يمكن أن تحتوي حاوية flex على عنصر flex واحد أو عدة عناصر. ولعناصر flex خصائص تتحكم في كيفية تصرفها بالنسبة إلى عناصر flex الأخرى في الحاوية نفسها. ولكي تجعل مكوّناً ما عنصر flex، كل ما عليك فعله هو جعله ابناً مباشراً لحاوية flex:

```js
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: 'green',
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
});

const FlexboxExample = () =&gt; {
  return (
    &lt;View style={styles.flexContainer}&gt;
      &lt;View style={styles.flexItemA}&gt;
        &lt;Text&gt;Flex item A&lt;/Text&gt;
      &lt;/View&gt;
      &lt;View style={styles.flexItemB}&gt;
        &lt;Text&gt;Flex item B&lt;/Text&gt;
      &lt;/View&gt;
    &lt;/View&gt;
  );
};
```

من أكثر خصائص عناصر flex استخداماً خاصية <a href="https://css-tricks.com/almanac/properties/f/flex-grow/" target="_blank" rel="noreferrer noopener">flexGrow</a>. وهي تقبل قيمة بلا وحدة تحدّد قدرة عنصر flex على التمدد عند الحاجة. وإذا كانت قيمة <code>flexGrow</code> لجميع عناصر flex تساوي 1، فسيتقاسمون كل المساحة المتاحة بالتساوي. وإذا كانت قيمة <code>flexGrow</code> لعنصر flex تساوي 0، فسيستخدم فقط المساحة التي يتطلبها محتواه ويترك بقية المساحة لعناصر flex الأخرى.

هنا يمكنك أن تجد كيفية تبسيط التخطيطات باستخدام Flexbox gap:&nbsp;<a href="https://reactnative.dev/blog/2023/01/12/version-071#simplifying-layouts-with-flexbox-gap" target="_blank" rel="noreferrer noopener">Flexbox gap</a>.

بعد ذلك، اقرأ مقال <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noreferrer noopener">دليل شامل إلى Flexbox</a> الذي يتضمن أمثلة بصرية شاملة عن flexbox. ومن الجيد أيضاً التجربة مع خصائص flexbox في <a href="https://flexbox.tech/" target="_blank" rel="noreferrer noopener">Flexbox Playground</a> لترى كيف تؤثر خصائص flexbox المختلفة في التخطيط. وتذكّر أنه في React Native تكون أسماء الخصائص هي نفسها كما في CSS باستثناء تسمية <em>camelCase</em>. أما <em>قيم الخصائص</em> مثل <code>flex-start</code> و<code>space-between</code> فهي متطابقة تماماً.

<strong>ملاحظة:</strong> هناك بعض الفروق بين React Native وCSS فيما يخص flexbox. وأهم فرق أن القيمة الافتراضية لخاصية <code>flexDirection</code> في React Native هي <code>column</code>. ومن الجدير بالذكر أيضاً أن اختصار <code>flex</code> لا يقبل قيماً متعددة في React Native. ويمكن قراءة المزيد عن تنفيذ flexbox في React Native في <a href="https://reactnative.dev/docs/flexbox" target="_blank" rel="noreferrer noopener">الوثائق</a>.

<div class="tasks">

**4. شريط التطبيق**

</div>

<div class="tasks">

**5. قائمة المستودعات المُقيَّمة المصقولة**

</div>

## نمط شريط الحالة

اخترنا لون خلفية داكناً لمكوّن&nbsp;<em>AppBar</em>. والمشكلة الآن أن أيقونات شريط الحالة — مثل الساعة وحالة البطارية — لا تبرز جيداً:

![شريط حالة بنمط داكن](/images/mooc/73241e589990.webp)

ثبّتنا مكتبة <em>expo-status-bar</em> بالفعل عند إعداد Expo سابقاً. والمشكلة سهلة الإصلاح بإضافة مكوّن <code>StatusBar</code> إلى ملف <em>App.js</em>:

```js
import { StatusBar } from 'expo-status-bar'; // HIGHLIGHT LINE

import Main from './src/components/Main';

const App = () => {
  // BEGIN HIGHLIGHT
  return (
    &lt;>
      &lt;StatusBar style="light" />
      &lt;Main />
    &lt;/>
  );
  // END HIGHLIGHT
};

export default App;
```

يخبر مكوّن <code>StatusBar</code> نظام التشغيل بكيفية عرض شريط الحالة. وبضبط نمطه على <em>light</em>، تصبح أيقونات شريط الحالة أسهل رؤية على خلفية داكنة:

![شريط حالة بنمط فاتح](/images/mooc/7b66a9770608.webp)

## التوجيه

عندما نبدأ بتوسيع تطبيقنا سنحتاج إلى طريقة للانتقال بين عروض مختلفة مثل عرض المستودعات وعرض تسجيل الدخول. في <a href="/part5/react_router_ui_frameworks" target="_blank" rel="noreferrer noopener">الجزء 5</a> تعرّفنا على مكتبة <a href="https://reactrouter.com/" target="_blank" rel="noreferrer noopener">React router</a> وتعلمنا كيفية استخدامها لتنفيذ التوجيه في تطبيق ويب.

التوجيه في تطبيق React Native يختلف قليلاً عن التوجيه في تطبيق ويب. والفرق الرئيسي أننا لا نستطيع الإشارة إلى الصفحات بعناوين URL نكتبها في شريط عنوان المتصفح، ولا التنقل ذهاباً وإياباً عبر سجل المستخدم باستخدام&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API" target="_blank" rel="noreferrer noopener">history API</a> في المتصفح. غير أن هذه مجرد مسألة تتعلق بواجهة الموجّه التي نستخدمها.

مع React Native يمكننا استخدام نواة React router كاملة، بما في ذلك الخطافات والمكوّنات. والفرق الوحيد عن بيئة المتصفح أن علينا استبدال <code>BrowserRouter</code> بـ<a href="https://reactrouter.com/en/6.4.5/router-components/native-router" target="_blank" rel="noreferrer noopener">NativeRouter</a> المتوافق مع React Native، الذي توفّره مكتبة <a href="https://www.npmjs.com/package/react-router-native" target="_blank" rel="noreferrer noopener">react-router-native</a>. لنبدأ بتثبيت مكتبة <em>react-router-native</em>:

```bash
npm install react-router-native
```

بعد ذلك، افتح ملف <em>App.js</em> وأضف مكوّن <code>NativeRouter</code> إلى مكوّن <code>App</code>:

```js
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native'; // HIGHLIGHT LINE

import Main from './src/components/Main';

const App = () => {
  return (
    &lt;>
      &lt;StatusBar style="auto" />
      // BEGIN HIGHLIGHT
      &lt;NativeRouter>
        &lt;Main />
      &lt;/NativeRouter>
      // END HIGHLIGHT
    &lt;/>
  );
};

export default App;
```

وبعد أن أصبح الموجّه جاهزاً، لنضف مسارنا الأول إلى مكوّن Main في ملف&nbsp;<em>Main.jsx</em>:

```js
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native'; // HIGHLIGHT LINE

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flex: 1,
  },
});

const Main = () => {
  return (
    &lt;View style={styles.container}>
      &lt;AppBar />
      // BEGIN HIGHLIGHT
      &lt;Routes>
        &lt;Route path="/" element={&lt;RepositoryList />} />
        &lt;Route path="*" element={&lt;Navigate to="/" replace />} />
      &lt;/Routes>
      // END HIGHLIGHT
    &lt;/View>
  );
};

export default Main;
```

وهذا كل شيء! آخر <code>Route</code> داخل <code>Routes</code> مخصص لالتقاط المسارات التي لا تطابق أي مسار معرّف سابقاً. وفي هذه الحالة، نريد الانتقال إلى العرض الرئيسي.

<div class="tasks">

**6. عرض تسجيل الدخول**

</div>

<div class="tasks">

**7. شريط التطبيق القابل للتمرير**

</div>

## إدارة حالة النموذج

الآن بعد أن أصبح لدينا عنصر نائب لعرض تسجيل الدخول، ستكون الخطوة التالية تنفيذ نموذج تسجيل الدخول. وقبل أن نصل إلى ذلك، لنتحدث عن النماذج من منظور أوسع.

يعتمد تنفيذ النماذج اعتماداً كبيراً على إدارة الحالة. وقد يؤدي استخدام خطاف <code>useState</code> في React لإدارة الحالة الغرض في النماذج الصغيرة. غير أنه سيجعل إدارة الحالة للنماذج الأكثر تعقيداً مرهقة بسرعة. ولحسن الحظ هناك مكتبات جيدة كثيرة في منظومة React تسهّل إدارة حالة النماذج. ومن هذه المكتبات <a href="https://formik.org/" target="_blank" rel="noreferrer noopener">Formik</a>.

المفهومان الرئيسيان في Formik هما&nbsp;<em>السياق</em>&nbsp;(context) و&nbsp;<em>الحقل</em>&nbsp;(field). غير أن أسهل طريقة لتنفيذ إرسال نموذج بسيط هي استخدام useFormik(). فهو خطاف مخصص في React يعيد كل حالة Formik والدوال المساعدة مباشرة.

هناك بعض القيود المتعلقة باستخدام UseFormik(). اقرأ هذا لتتعرّف على <a href="https://formik.org/docs/api/useFormik" target="_blank" rel="noreferrer noopener">useFormik()</a>.

لنثبّت Formik أولاً:

```bash
npm install formik
```

لنرَ كيف تعمل إدارة الحالة مع Formik بإنشاء نموذج لحساب&nbsp;<a href="https://en.wikipedia.org/wiki/Body_mass_index" target="_blank" rel="noreferrer noopener">مؤشر كتلة الجسم</a>:

```js
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) =&gt; {
  return Math.round(mass / Math.pow(height, 2));
};

const BodyMassIndexForm = ({ onSubmit }) =&gt; {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    &lt;View&gt;
      &lt;TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
      /&gt;
      &lt;TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
      /&gt;
      &lt;Pressable onPress={formik.handleSubmit}&gt;
        &lt;Text&gt;Calculate&lt;/Text&gt;
      &lt;/Pressable&gt;
    &lt;/View&gt;
  );
};

const BodyMassIndexCalculator = () =&gt; {
  const onSubmit = values =&gt; {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) &amp;&amp; !isNaN(height) &amp;&amp; height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return &lt;BodyMassIndexForm onSubmit={onSubmit} /&gt;;
};

export default BodyMassIndexCalculator;
```

هذا المثال ليس جزءاً من تطبيقنا، لذا لا تحتاج إلى إضافة هذه الشيفرة إلى التطبيق. لكن يمكنك تجربته مثلاً في <a href="https://snack.expo.io/" target="_blank" rel="noreferrer noopener">Expo Snack</a>. وExpo Snack محرّر عبر الإنترنت لـReact Native، مشابه لـ<a href="https://jsfiddle.net/" target="_blank" rel="noreferrer noopener">JSFiddle</a> و<a href="https://codepen.io/" target="_blank" rel="noreferrer noopener">CodePen</a>. وهو منصة مفيدة لتجربة الشيفرة بسرعة. لاحظ أنك تحتاج أيضاً إلى إضافة Formik كاعتمادية في Expo Snack. ويمكنك فعل ذلك بإضافة الاعتمادية مباشرة إلى ملف <em>package.json</em>، مثلاً السطر: <code>"formik": "^2.4.9"</code>.

يمكنك مشاركة Expo Snacks مع الآخرين باستخدام رابط أو بتضمينها كـ&nbsp;<em>Snack Player</em>&nbsp;على موقع ويب. وربما صادفت Snack Players مثلاً في هذه المادة وفي وثائق React Native.

<div class="tasks">

**8. نموذج تسجيل الدخول**

</div>

## التحقق من صحة النموذج

يوفّر Formik طريقتين للتحقق من صحة النموذج: دالة تحقق أو مخطط تحقق. ودالة التحقق هي دالة تُمرَّر إلى مكوّن <code>Formik</code> كقيمة لخاصية <a href="https://formik.org/docs/guides/validation#validate" target="_blank" rel="noreferrer noopener">validate</a>. وهي تستقبل قيم النموذج كوسيط وتعيد كائناً يحوي رسائل خطأ محتملة خاصة بكل حقل.

والطريقة الثانية هي مخطط التحقق الذي يُمرَّر إلى مكوّن <code>Formik</code> كقيمة لخاصية <a href="https://formik.org/docs/guides/validation#validationschema" target="_blank" rel="noreferrer noopener">validationSchema</a>. ويمكن إنشاء مخطط التحقق هذا باستخدام مكتبة تحقق تُسمّى <a href="https://github.com/jquense/yup" target="_blank" rel="noreferrer noopener">Yup</a>. لنبدأ بتثبيت Yup:

```bash
npm install yup
```

بعد ذلك، كمثال، لننشئ مخطط تحقق لنموذج مؤشر كتلة الجسم الذي نفّذناه سابقاً. نريد التحقق من أن الحقلين <code>mass</code> و<code>height</code> موجودان وأنهما رقميان. كذلك ينبغي أن تكون قيمة <code>mass</code> أكبر من أو تساوي 1، وقيمة <code>height</code> أكبر من أو تساوي 0.5. وإليك كيفية تعريف المخطط:

```js
import * as yup from 'yup'; // HIGHLIGHT LINE

// ...

// BEGIN HIGHLIGHT
const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or equal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});
// END HIGHLIGHT

const BodyMassIndexForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    // BEGIN HIGHLIGHT
    validationSchema,
    // END HIGHLIGHT
    onSubmit,
  });

  return (
    &lt;View>
      &lt;TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
        onBlur={formik.handleBlur('mass')} // HIGHLIGHT LINE
      />
      // BEGIN HIGHLIGHT
      {formik.touched.mass &amp;&amp; formik.errors.mass &amp;&amp; (
        &lt;Text style={{ color: 'red' }}>{formik.errors.mass}&lt;/Text>
      )}
      // END HIGHLIGHT
      &lt;TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
        onBlur={formik.handleBlur('height')} // HIGHLIGHT LINE
      />
      // BEGIN HIGHLIGHT
      {formik.touched.height &amp;&amp; formik.errors.height &amp;&amp; (
        &lt;Text style={{ color: 'red' }}>{formik.errors.height}&lt;/Text>
      )}
      // END HIGHLIGHT
      &lt;Pressable onPress={formik.handleSubmit}>
        &lt;Text>Calculate&lt;/Text>
      &lt;/Pressable>
    &lt;/View>
  );
};

const BodyMassIndexCalculator = () => {
  // ...
}
```

كن على علم بأنك تحتاج إلى تضمين مكوّنات Text هذه داخل View الذي يعيده النموذج لعرض أخطاء التحقق:

```
 {formik.touched.mass &amp;&amp; formik.errors.mass &amp;&amp; (
  &lt;Text style={{ color: 'red' }}&gt;{formik.errors.mass}&lt;/Text&gt;
 )}
```

```
 {formik.touched.height &amp;&amp; formik.errors.height &amp;&amp; (
  &lt;Text style={{ color: 'red' }}&gt;{formik.errors.height}&lt;/Text&gt;
 )}
```

يُجرى التحقق افتراضياً في كل مرة تتغير فيها قيمة حقل وعند استدعاء الدالة <code>handleSubmit</code>. وإذا فشل التحقق، فلا تُستدعى الدالة المُمرَّرة لخاصية <code>onSubmit</code> في مكوّن <code>Formik</code>.

<div class="tasks">

**9. التحقق من صحة نموذج تسجيل الدخول**

</div>

## الشيفرة الخاصة بالمنصة

من المزايا الكبيرة في React Native أننا لا نحتاج إلى القلق بشأن ما إذا كان التطبيق يعمل على جهاز Android أو iOS. غير أنه قد تكون هناك حالات نحتاج فيها إلى تنفيذ&nbsp;<em>شيفرة خاصة بالمنصة</em>. ومثل هذه الحالات قد تكون مثلاً استخدام تنفيذ مختلف لمكوّن على منصة مختلفة.

يمكننا الوصول إلى منصة المستخدم عبر الثابت <code>Platform.OS</code>:

```js
import { Platform, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === 'android' ? 'green' : 'blue',
  },
});

const WhatIsMyPlatform = () =&gt; {
  return &lt;Text style={styles.text}&gt;Your platform is: {Platform.OS}&lt;/Text&gt;;
};
```

القيم الممكنة لثوابت <code>Platform.OS</code> هي <code>android</code> و<code>ios</code>. وهناك طريقة مفيدة أخرى لتعريف فروع شيفرة خاصة بالمنصة هي استخدام الدالة <code>Platform.select</code>. فعند تمرير كائن تكون مفاتيحه واحداً من <code>ios</code> أو <code>android</code> أو <code>native</code> أو <code>default</code>، تعيد الدالة <code>Platform.select</code> القيمة الأنسب للمنصة التي يعمل عليها المستخدم حالياً. ويمكننا إعادة كتابة المتغير <code>styles</code> في المثال السابق باستخدام الدالة <code>Platform.select</code> هكذا:

```js
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
});
```

يمكننا حتى استخدام الدالة <code>Platform.select</code> لاستدعاء مكوّن خاص بمنصة عبر <code>require</code>:

```js
const MyComponent = Platform.select({
  ios: () =&gt; require('./MyIOSComponent'),
  android: () =&gt; require('./MyAndroidComponent'),
})();

&lt;MyComponent /&gt;;
```

غير أن هناك طريقة أكثر تطوراً لتنفيذ واستيراد مكوّنات خاصة بالمنصة (أو أي قطعة شيفرة أخرى) وهي استخدام امتدادي الملفين&nbsp;<em>.ios.jsx</em>&nbsp;و&nbsp;<em>.android.jsx</em>. لاحظ أن الامتداد&nbsp;<em>.jsx</em>&nbsp;يمكن أن يكون أيضاً امتداداً آخر يتعرّف عليه المُجمِّع، مثل&nbsp;<em>.js</em>. فيمكن أن تكون لدينا مثلاً الملفان&nbsp;<em>Button.ios.jsx</em>&nbsp;و&nbsp;<em>Button.android.jsx</em>&nbsp;اللذان يمكننا استيرادهما هكذا:

```js
import Button from './Button';

const PlatformSpecificButton = () =&gt; {
  return &lt;Button /&gt;;
};
```

الآن، ستحتوي حزمة Android للتطبيق على المكوّن المعرّف في&nbsp;<em>Button.android.jsx</em>، بينما تحتوي حزمة iOS على المكوّن المعرّف في ملف <em>Button.ios.jsx</em>.

<div class="tasks">

**10. خط خاص بالمنصة**

</div>
