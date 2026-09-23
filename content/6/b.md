---
part: 6
letter: b
title: "الفصل 2: معمارية Flux و Zustand"
mainImage: /images/part-6.svg
lang: ar
---
اتّبعنا الممارسة التي توصي بها React لإدارة حالة التطبيق، وذلك بتعريف الحالة التي تحتاجها مكوّنات متعددة والدوال التي تتعامل معها في المكوّنات&nbsp;<a href="https://reactjs.org/docs/lifting-state-up.html" target="_blank" rel="noopener">العليا</a>&nbsp;في التسلسل الهرمي للمكوّنات. وعادةً ما كانت معظم الحالة والدوال التي تتعامل معها تُعرَّف مباشرة في المكوّن الجذري وتُمرَّر عبر props إلى المكوّنات التي تحتاجها. وهذا ينجح إلى حدٍّ ما، لكن مع نمو التطبيق تصبح إدارة الحالة صعبة.

### معمارية Flux

طوّرت Facebook معمارية <a href="https://facebookarchive.github.io/flux/docs/in-depth-overview" target="_blank" rel="noopener">Flux</a> في بدايات تاريخ React للتخفيف من مشكلات إدارة الحالة. في Flux، تُفصَل إدارة حالة التطبيق بالكامل في <em>stores</em> خارجية خارج مكوّنات React. ولا تُغيَّر الحالة في store مباشرة، بل عبر <em>actions</em> محددة تُنشأ لهذا الغرض.

عندما يُرسَل action ويغيّر حالة store، تُعاد عرض الواجهات:

![صورة توضيحية](/images/mooc/c6580b86efb4.webp)

إذا استدعى استخدام التطبيق (مثل الضغط على زر) تغيير الحالة، فيحدث التغيير عبر action. وهذا بدوره يؤدي إلى إعادة عرض الواجهة:

![صورة توضيحية](/images/mooc/9ff17e8407bf.webp)

وهكذا يوفّر Flux طريقة معيارية لكيفية ومكان حفظ حالة التطبيق ولإجراء تغييرات عليها.

### Redux

كان <a href="https://redux.js.org/" target="_blank" rel="noopener">Redux</a>، الذي يتبع معمارية Flux، الحل المهيمن لإدارة الحالة في تطبيقات React لما يقارب عقداً كاملاً. وفي هذه الدورة أيضاً استُخدم Redux حتى ربيع 2026. وقد لازمت Redux دائماً مشكلة التعقيد وكثرة الشيفرة النمطية المتكررة (boilerplate). تحسّن الوضع كثيراً مع ظهور Redux Toolkit، لكن رغم ذلك واصل المجتمع تطوير حلول بديلة لإدارة الحالة، مثل <a href="https://mobx.js.org/README.html">MobX</a> و<a href="https://recoiljs.org/">Recoil</a> و<a href="https://www.npmjs.com/package/jotai" target="_blank" rel="noopener">Jotai</a>. وقد تفاوتت شعبيتها.

أكثر الوافدين الجدد إثارةً للاهتمام، وبلا شك الأكثر شعبية، هو <a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener">Zustand</a>، وهو أيضاً اختيارنا لحل إدارة الحالة. ويبدو أن Zustand قد لحق فعلاً بـ Redux في الشعبية:

![صورة توضيحية](/images/mooc/a388491aa9a6.webp)

### Zustand

لنتعرّف على Zustand من خلال تنفيذ تطبيق عدّاد مرة أخرى:

![صورة توضيحية](/images/mooc/46faac4f212d.webp)

سننشئ تطبيق Vite جديداً ونثبّت <em>Zustand</em>:

```bash
npm install zustand
```

النسخة الأولى، التي تعمل فيها زيادة العدّاد فقط، هي كما يلي:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
}))

const App = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)
  const increment = useCounterStore(state =&gt; state.increment)

  return (
    &lt;div&gt;
      &lt;div&gt;{counter}&lt;/div&gt;
      &lt;div&gt;
        &lt;button onClick={increment}&gt;plus&lt;/button&gt;
        &lt;button&gt;minus&lt;/button&gt;
        &lt;button&gt;zero&lt;/button&gt;
      &lt;/div&gt;

    &lt;/div&gt;
  )
}
```

يبدأ التطبيق بإنشاء&nbsp;<em>store</em>، أي الحالة العامة، باستخدام دالة&nbsp;<a href="https://zustand.docs.pmnd.rs/reference/apis/create" target="_blank" rel="noopener">create</a>&nbsp;في Zustand:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
}))
```

تستقبل الدالة كمعامل&nbsp;<em>دالة</em>&nbsp;تُعيد الحالة المطلوب تعريفها للتطبيق. إذن المعامل هو كما يلي:

```
set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
})
```

وهكذا تحتوي الحالة على&nbsp;<em>counter</em>&nbsp;بقيمة صفر، و<em>increment</em>&nbsp;وهي دالة.

يمكن لمكوّنات التطبيق الوصول إلى القيم والدوال المعرّفة في الحالة عبر دالة&nbsp;<em>useCounterStore</em>&nbsp;المعرّفة باستخدام <em>create</em>&nbsp;في Zustand. ويستخدم مكوّن&nbsp;<em>App</em>&nbsp;المحدّدات (selectors) لاسترجاع قيمة&nbsp;<em>counter</em>&nbsp;ودالة&nbsp;<em>increment</em>&nbsp;من الحالة:

```js
const App = () => {
  // استخدام selector لاختيار الجزء الصحيح من حالة store
// BEGIN HIGHLIGHT
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)
// END HIGHLIGHT

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;div>{counter}&lt;/div>
// END HIGHLIGHT
      &lt;div>
// BEGIN HIGHLIGHT
        &lt;button onClick={increment}>plus&lt;/button>
// END HIGHLIGHT
        &lt;button>minus&lt;/button>
        &lt;button>zero&lt;/button>
      &lt;/div>

    &lt;/div>
  )
}
```

تخزّن الشيفرة قيمة counter الخاصة بـ store في متغير كما يلي:

```js
const counter = useCounterStore(state =&gt; state.counter)
```

تُستخدم دالة محدّد&nbsp;<em>state =&gt; state.counter</em>&nbsp;، وهي تحدد ما يُعاد من محتويات store. وبالطريقة نفسها، تُسترجع الدالة المخزّنة في store إلى المتغير&nbsp;<em>increment</em>.

تُعطى دالة الحالة&nbsp;<em>increment</em>&nbsp;، التي عُرِّفت كما يلي، كمعالج نقر لزر "plus":

```js
const useCounterStore = create(set => ({
  counter: 0,
// BEGIN HIGHLIGHT
  increment: () => set(state => ({ counter: state.counter + 1 })),
// END HIGHLIGHT
}))
```

لننظر إلى تعريف الدالة بشكل منفصل:

```
() =&gt; set(state =&gt; ({ counter: state.counter + 1 }))
```

هذه دالة تستدعي دالة&nbsp;<a href="https://zustand.docs.pmnd.rs/learn/guides/updating-state" target="_blank" rel="noopener">set</a>&nbsp;وتمرّر لها دالة أخرى كمعامل. وهذه الدالة الممرَّرة كمعامل تحدد كيف تتغير الحالة:

```
state =&gt; ({ counter: state.counter + 1 })
```

وهي صيغة مختصرة لـ:

```js
state =&gt; {
  return { counter: state.counter + 1 }
}
```

تُعيد الدالة حالة جديدة تحسبها بناءً على الحالة القديمة التي يمكنها الوصول إليها عبر المعامل&nbsp;<em>state</em>. فإذا كانت الحالة القديمة، على سبيل المثال:

```js
{
  counter: 1,
  increment: // تعريف الدالة
}
```

تصبح الحالة الجديدة:

```js
{
  counter: 2,
  increment: // تعريف الدالة
}
```

تحتوي الحالة دائماً أيضاً على الدالة&nbsp;<em>increment</em>&nbsp;التي تغيّر الحالة.

دالة انتقال الحالة

```
state =&gt; ({ counter: state.counter + 1 })
```

تؤثر فقط على قيمة&nbsp;<em>counter</em>&nbsp;في الحالة.

لا شيء يمنع تغيير الدالة الموجودة في الحالة داخل دالة انتقال الحالة؛ فمثلاً لو عرّفناها كما يلي:

```js
state =&gt; {
  return {
    counter: state.counter + 1 ,
    increment: console.log('increment broken')
  }
}
```

فلن يعمل زر الزيادة إلا في المرة الأولى؛ وبعدها لن يؤدي الضغط على الزر إلا إلى الطباعة في الطرفية.

عندما تُضبط الحالة الجديدة كما يلي:

```
state =&gt; ({ counter: state.counter + 1 })
```

لا تُحدَّث إلا قيمة المفتاح&nbsp;<em>counter</em>&nbsp;في الحالة؛ إذ تُحصل على الحالة الجديدة بدمج الحالة القديمة مع القيمة التي تُعيدها دالة تغيير الحالة. ولهذا فإن دالة انتقال الحالة التالية:

```
state =&gt; ({})
```

لا تؤثر على الحالة إطلاقاً.

لنكمل التطبيق لبقية الأزرار أيضاً:

```js
const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
  decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
  zero: () =&gt; set(() =&gt; ({ counter: 0 })),
}))

const App = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)
  const increment = useCounterStore(state =&gt; state.increment)
  const decrement = useCounterStore(state =&gt; state.decrement)
  const zero = useCounterStore(state =&gt; state.zero)

  return (
    &lt;div&gt;
      &lt;div&gt;{counter}&lt;/div&gt;
      &lt;div&gt;
        &lt;button onClick={increment}&gt;plus&lt;/button&gt;
        &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
        &lt;button onClick={zero}&gt;zero&lt;/button&gt;
      &lt;/div&gt;

    &lt;/div&gt;
  )
}
```

> من أين يأتي set و state؟
>
> من أين يأتي&nbsp;<em>set</em>؟ إنها دالة مساعدة توفّرها دالة <em>create</em>&nbsp;في Zustand، وتُستخدم لتحديث الحالة. تستدعي <em>create</em>&nbsp;الدالة الممرَّرة إليها كمعامل وتمرّر لها <em>set</em>&nbsp;تلقائياً. لا تحتاج إلى استدعائها أو استيرادها بنفسك؛ يتولى Zustand ذلك.
>
> من أين يأتي&nbsp;<em>state</em>؟ عندما تُمرَّر دالة كمعامل إلى <em>set</em>&nbsp;(بدلاً من كائن حالة جديد مباشرة)، يستدعي Zustand تلك الدالة مع الحالة الحالية لـ store كوسيط لها. بهذه الطريقة، يمكن لدوال تحديث الحالة الوصول إلى الحالة القديمة لحساب الحالة الجديدة.

### استخدام الحالة من مكوّنات مختلفة

لنُعِد هيكلة التطبيق بحيث يُنقل تعريف store إلى ملفه الخاص&nbsp;<em>store.js</em>، وتُقسَّم الواجهة إلى مكوّنات متعددة، كل منها معرّف في ملفه الخاص.

محتويات&nbsp;<em>store.js</em>&nbsp;بسيطة ومباشرة:

```js
export const useCounterStore = create(set =&gt; ({
  counter: 0,
  increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
  decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
  zero: () =&gt; set(() =&gt; ({ counter: 0 })),
}))
```

يُبسَّط مكوّن&nbsp;<em>App</em>&nbsp;كما يلي:

```js
import Display from './Display'
import Controls from './Controls'

const App = () =&gt; {
  return (
    &lt;div&gt;
      &lt;Display /&gt;
      &lt;Controls /&gt;
    &lt;/div&gt;
  )
}

export default App
```

الجدير بالملاحظة هنا أن مكوّن&nbsp;<em>App</em>&nbsp;لم يعد يمرّر الحالة إلى مكوّناته الفرعية. بل إن المكوّن لا يلمس الحالة بأي شكل؛ فقد فُصل تعريف store بالكامل خارج المكوّن.

المكوّن الذي يعرض قيمة العدّاد بسيط:

```js
import { useCounterStore } from './store'

const Display = () =&gt; {
  const counter = useCounterStore(state =&gt; state.counter)

  return (
    &lt;div&gt;{counter}&lt;/div&gt;
  )
}

export default Display
```

يصل المكوّن إلى قيمة العدّاد عبر دالة&nbsp;<em>useCounterStore</em>&nbsp;التي تعرّف store. وهذا مريح من نواحٍ عديدة، فمثلاً لا حاجة لتمرير الحالة إلى المكوّن عبر props.

المكوّن الذي يعرّف الأزرار يبدو هكذا:

```js
import { useCounterStore } from './store'

const Controls = () =&gt; {
  const increment = useCounterStore(state =&gt; state.increment)
  const decrement = useCounterStore(state =&gt; state.decrement)
  const zero = useCounterStore(state =&gt; state.zero)

  return (
    &lt;div&gt;
      &lt;button onClick={increment}&gt;plus&lt;/button&gt;
      &lt;button onClick={decrement}&gt;minus&lt;/button&gt;
      &lt;button onClick={zero}&gt;zero&lt;/button&gt;
    &lt;/div&gt;
  )
}

export default Controls
```

تأخذ دالة&nbsp;<em>useCounterStore</em>&nbsp;دالة محدّد (selector) كمعامل لها، وهي تحدد أي جزء من الحالة سيُستخدم. على سبيل المثال:

```js
  const increment = useCounterStore(state =&gt; state.increment)
```

هنا تنتقي دالة المحدّد <em>state => state.increment</em> قيمة المفتاح <em>increment</em> من الحالة، أي الدالة التي تزيد العدّاد، وتخزّنها في المتغير <em>increment</em>.

يمكننا أيضاً الوصول إلى الحالة بأكملها كما يلي:

```js
  const state = useCounterStore()
  // يفعل الشيء نفسه مثل useCounterStore(state =&gt; state)، أي يختار الحالة بأكملها
```

يمكننا حينها الإشارة إلى قيمة العدّاد والدوال باستخدام الترميز النقطي (dot notation)، أي&nbsp;<em>state.counter</em>&nbsp;و<em>state.increment</em>.

يطرح سؤال طبيعي نفسه: هل يمكن استخدام أجزاء متعددة من الحالة عبر التفكيك (destructuring):

```js
import { useCounterStore } from './store'

const Controls = () => {
// BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useCounterStore()
// END HIGHLIGHT
  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}

export default Controls
```

الحل يعمل، لكن له عيب كبير. يؤدي التفكيك إلى إعادة عرض مكوّن&nbsp;<em>Controls</em>&nbsp;في كل مرة تتغير فيها قيمة العدّاد، مع أن المكوّن يعرض الأزرار فقط ولا يعرض القيمة نفسها.

<em>لذا فإن أفضل ممارسة في Zustand هي ألا تختار من الحالة إلا الأجزاء التي يحتاجها المكوّن المعني.</em> ولا يُعاد عرض المكوّن إلا عندما يتغير الجزء الذي اختاره من الحالة. أما عند كتابة:

```js
const increment = useCounterStore(state => state.increment)
const decrement = useCounterStore(state => state.decrement)
const zero = useCounterStore(state => state.zero)
```

فلم يعد المكوّن يتفاعل مع تغيّرات قيمة العدّاد لأنه لم يخترها من الحالة.

### إعادة تنظيم الحالة

يمكننا الوصول إلى حل أنيق تماماً بإعادة تنظيم الحالة كما يلي:

```js
export const useCounterStore = create(set =&gt; ({
  counter: 0,
  actions: {
    increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
    decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
    zero: () =&gt; set(() =&gt; ({ counter: 0 })),
  }
}))
```

أصبحت دوال تغيير الحالة الآن مجمّعة تحت مفتاحها الخاص&nbsp;<em>actions</em>، ويمكن اختيارها ككتلة واحدة وتفكيكها:

```js
const Controls = () => {
  const { increment, decrement, zero } = useCounterStore(state => state.actions)

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}
```

الآن لا تحدث أي إعادة عرض، لأن الدوال فقط هي التي اختيرت من الحالة، وهي تبقى نفسها طوال عمر store.

وفقاً لبعض&nbsp;<a href="https://tkdodo.eu/blog/working-with-zustand#only-export-custom-hooks" target="_blank" rel="noopener">أفضل الممارسات</a>، لا يُنصح بتصدير الدالة التي تعرّف الحالة بأكملها لاستخدامها في كل أنحاء التطبيق. وبدلاً من ذلك، ينبغي إنشاء عروض أصغر منها لا تكشف إلا الأجزاء اللازمة من الحالة. لنعدّل&nbsp;<em>store.js</em>&nbsp;كما يلي:

```js
import { create } from 'zustand'

const useCounterStore = create(set =&gt; ({
  counter: 0,
  actions: {
    increment: () =&gt; set(state =&gt; ({ counter: state.counter + 1 })),
    decrement: () =&gt; set(state =&gt; ({ counter: state.counter - 1 })),
    zero: () =&gt; set(() =&gt; ({ counter: 0 })),
  }
}))

// دوال الخطافات المستخدمة في مواضع أخرى من التطبيق
export const useCounter = () =&gt; useCounterStore(state =&gt; state.counter)
export const useCounterControls = () =&gt; useCounterStore(state =&gt; state.actions)
```

الآن، خارج الوحدة التي تعرّف الحالة، أصبحت الدالتان <em>useCounter</em>، التي تُعيد قيمة العدّاد عند استدعائها، و<em>useCounterControls</em>، التي تُعيد الدوال التي تعدّل قيمة العدّاد، متاحتين. ويتغير الاستخدام قليلاً:

```js
// BEGIN HIGHLIGHT
import { useCounter } from './store'
// END HIGHLIGHT

const Display = () => {
// BEGIN HIGHLIGHT
  const counter = useCounter()
// END HIGHLIGHT

  return (
    &lt;div>{counter}&lt;/div>
  )
}
```

```js
// BEGIN HIGHLIGHT
import { useCounterControls } from './store'
// END HIGHLIGHT

const Controls = () => {
// BEGIN HIGHLIGHT
  const { increment, decrement, zero } = useCounterControls()
// END HIGHLIGHT

  return (
    &lt;div>
      &lt;button onClick={increment}>plus&lt;/button>
      &lt;button onClick={decrement}>minus&lt;/button>
      &lt;button onClick={zero}>zero&lt;/button>
    &lt;/div>
  )
}
```

عند استخدام الحالة بهذه الطريقة، لم تعد هناك حاجة لاستخدام دوال المحدّد، إذ أصبح استخدامها مخفياً داخل تعريف الدوال المساعدة الجديدة.

لاحظ الأكثر انتباهاً أن الدوال المتعلقة بـ Zustand تبدأ أسماؤها بكلمة <em>use</em>. والسبب في ذلك أن الدالة التي تُعيدها دالة <em>create</em> في Zustand، وهي <em>useCounterStore</em> في مثالنا، هي دالة React <a href="https://react.dev/learn/reusing-logic-with-custom-hooks" target="_blank" rel="noopener">custom hook</a>. كما أن دوالنا المساعدة <em>useCounter</em> و<em>useCounterControls</em> هي أيضاً في جوهرها خطافات مخصصة لأنها تخفي استخدام الخطاف المخصص <em>useCounterStore</em> بداخلها.

تأتي الخطافات المخصصة بمجموعة من القواعد، فمثلاً يُتوقع أن تبدأ أسماؤها دائماً بـ&nbsp;<em>use</em>. كما تنطبق&nbsp;<a href="https://react.dev/warnings/invalid-hook-call-warning" target="_blank" rel="noopener">قواعد الخطافات</a>&nbsp;التي تناولناها في&nbsp;<a href="/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks" target="_blank" rel="noopener">الجزء 1</a>&nbsp;على الخطافات المخصصة أيضاً!

#### خطافات مخصصة مع حالة أكثر تعقيداً

افترض أننا نريد أيضاً عدّ عدد المرات التي تغيّرت فيها حالة العدّاد. يمكننا توسيع store كما يلي:

```js
const useCounterStore = create(set => ({<br>  counter: 0,<br> // BEGIN HIGHLIGHT<br>  changes: 0,<br> // END HIGHLIGHT<br>  actions: {<br>    increment: () => set(state => ({ <br>      counter: state.counter + 1, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>    decrement: () => set(state => ({ <br>      counter: state.counter - 1, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>    zero: () => set(state => ({ <br>      counter: 0, <br> // BEGIN HIGHLIGHT<br>      changes: state.changes + 1 <br> // END HIGHLIGHT<br>    })),<br>  }  <br>}))
```

يمكننا حينها أن نحاول كتابة الخطاف الخاص بالوصول إلى القيم كما يلي:

```js
export const useValues = () => useCounterStore(state => ({ <br>   counter: state.counter,<br>   changes: state.changes<br>})
```

هذا لا يعمل، لأن دالة المحدّد تُعيد <em>كائناً جديداً في كل عرض</em>، حتى عندما لا تكون القيم الأساسية قد تغيرت. يقارن Zustand نتيجة المحدّد السابقة والجديدة بفحص تساوي المراجع (<code>===</code>)، لذا يُرى الكائن الجديد دائماً على أنه "متغيّر". وهذا يؤدي إلى إطلاق إعادة عرض تستدعي المحدّد من جديد، الذي يُعيد كائناً جديداً آخر، وهكذا، في حلقة عرض لا نهائية.

الحل هو تغليف المحدّد بـ <a href="https://zustand.docs.pmnd.rs/reference/hooks/use-shallow"><code>useShallow</code></a>، وهو يخبر Zustand بمقارنة حقول الكائن المُعاد بفحص تساوٍ سطحي (shallow equality) بدلاً من مقارنة مراجع الكائنات:

```js
import { useShallow } from "zustand/react/shallow"<br><br>export const useValues = () => useCounterStore(state => { <br>  useShallow((state) => ({<br>    counter: state.counter,<br>    changes: state.changes,<br>  })),<br>)
```

الآن لا يُطلق Zustand إعادة عرض إلا عندما تحصل <em>counter</em> أو <em>changes</em> فعلاً على قيمة جديدة، وليس فقط عند إنشاء كائن جديد.

<div class="tasks">

**1. عودة إلى Unicafe**

</div>

<div class="tasks">

**2. تشغيل الاختبارات**

</div>

### ملاحظات Zustand

هدفنا هو إنشاء نسخة قائمة على Zustand من تطبيق الملاحظات العريق.

النسخة الأولى من التطبيق هي التالية. مكوّن&nbsp;<em>App</em>:

```js
import { useNotes } from './store'

const App = () =&gt; {
  const notes = useNotes()

  return (
    &lt;div&gt;
      &lt;ul&gt;
        {notes.map(note =&gt; (
          &lt;li key={note.id}&gt;
            {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  )
}
export default App
```

يُعرَّف store في البداية كما يلي:

```js
import { create } from 'zustand'

const useNoteStore = create(set =&gt; ({
  notes: [
    {
      id: 1,
      content: 'Zustand is less complex than Redux',
      important: true,
    },
  ],
}))

export const useNotes = () =&gt; useNoteStore(state =&gt; state.notes)
```

في الوقت الحالي، لا يملك التطبيق وظيفة إضافة ملاحظات جديدة، ولا يدعمها store بعد. وقد هُيِّئت الحالة بملاحظة واحدة مضافة مسبقاً حتى نتحقق من أن التطبيق قادر على عرض الحالة بنجاح.

### الدوال النقية والكائنات غير القابلة للتغيير

المحاولة الأولى لكتابة action يضيف ملاحظة هي التالية:

```js
note =&gt; set(
          state =&gt; {
            state.notes.push(note)
            return state
          }
        )
```

تستقبل الدالة ملاحظة كمعامل وتُعيد حالة أُضيفت فيها الملاحظة الجديدة إلى الحالة القديمة <em>state</em>.

غير أن محاولتنا ليست سليمة. يذكر <a href="https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging" target="_blank" rel="noopener">توثيق</a> Zustand أنه <em>كما هو الحال مع useState في React، نحتاج إلى تحديث الحالة بشكل غير قابل للتغيير (immutably)</em>. وكما نعلم، فإن <em>state.notes.push</em> تعدّل (أي mutate) كائن الحالة، لذا يجب تغيير الحل.

الطريقة السليمة هي استخدام، على سبيل المثال، دالة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat" target="_blank" rel="noopener">Array.concat</a>&nbsp;، التي لا تعدّل الحالة الموجودة بل تنشئ نسخة جديدة منها مع إضافة الملاحظة الجديدة:

```js
note =&gt; set(
          state =&gt; {
            return { notes: state.notes.concat(note) }
          }
        )
```

أصبح تعريف store الآن كما يلي:

```js
import { create } from 'zustand'

const useNoteStore = create(set =&gt; ({
  notes: [],
  actions: {
    add: note =&gt; set(
      state =&gt; ({ notes: state.notes.concat(note) })
    )
  }
}))

export const useNotes = () =&gt; useNoteStore(state =&gt; state.notes)
export const useNoteActions = () =&gt; useNoteStore(state =&gt; state.actions)
```

> صيغة نشر المصفوفة
>
> من الطرق الأخرى الشائعة لفعل الشيء نفسه استخدام صيغة&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener">النشر (spread)</a>&nbsp;للمصفوفات:
>
> state =&gt; ({ notes: [...state.notes, note] })
>
> هنا تتكوّن مصفوفة بنشر كل عنصر من عناصر مصفوفة&nbsp;<em>state.notes</em>&nbsp;باستخدام صيغة النشر، ثم إلحاق الملاحظة الجديدة في النهاية. والاختيار بين استخدام spread أو دالة&nbsp;<em>concat</em>&nbsp;مسألة تفضيل شخصي.

من الناحية التقنية، الحالة المنشأة بـ Zustand <a href="https://developer.mozilla.org/en-US/docs/Glossary/Immutable" target="_blank" rel="noopener">غير قابلة للتغيير (immutable)</a>، ويجب أن تكون دوال action التي تعدّل الحالة <a href="https://en.wikipedia.org/wiki/Pure_function" target="_blank" rel="noopener">دوالاً نقية (pure functions)</a>.

الدوال النقية هي التي&nbsp;<em>لا تُنتج آثاراً جانبية</em>&nbsp;وتُعيد دائماً النتيجة نفسها عند استدعائها بالمعاملات نفسها.

### النموذج غير المتحكَّم به

لنضف إلى التطبيق القدرة على إنشاء ملاحظات جديدة:

```js
import { useNotes, useNoteActions } from './store'

const App = () => {
  const notes = useNotes()

  // BEGIN HIGHLIGHT
  const { add } = useNoteActions()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
// END HIGHLIGHT

  return (
    &lt;div>
// BEGIN HIGHLIGHT
      &lt;form onSubmit={addNote}>
        &lt;input name="note" />
        &lt;button type="submit">add&lt;/button>
      &lt;/form>
// END HIGHLIGHT
      &lt;ul>
        {notes.map(note => (
          &lt;li key={note.id}>
            {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
          &lt;/li>
        ))}
      &lt;/ul>
    &lt;/div>
  )
}
```

التنفيذ مباشر إلى حد كبير. والجدير بالملاحظة عند إضافة ملاحظة جديدة أننا، بخلاف نماذجنا السابقة المنفذة بـ React، <em>لم</em> نربط قيمة حقل النموذج بحالة مكوّن <em>App</em>. ويسمي React مثل هذه النماذج <a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components" target="_blank" rel="noopener">غير المتحكَّم بها (uncontrolled)</a>.

> للنماذج غير المتحكَّم بها قيود معينة. فهي لا تسمح، مثلاً، بتقديم رسائل تحقق فورية، ولا بتعطيل زر الإرسال بناءً على المحتوى، وما إلى ذلك. لكنها مناسبة لحالتنا هذه المرة. ويمكنك قراءة المزيد عن الموضوع&nbsp;<a href="https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/" target="_blank" rel="noopener">هنا</a>&nbsp;إن أردت.

النموذج بسيط جداً:

```
&lt;form onSubmit={addNote}&gt;
  &lt;input name="note" /&gt;
  &lt;button type="submit"&gt;add&lt;/button&gt;
&lt;/form&gt;
```

الجدير بالملاحظة في النموذج أن حقل الإدخال له اسم (name). وهذا يتيح لدالة المعالج الوصول إلى قيمة الحقل.

معالج الإضافة مباشر أيضاً:

```js
  const addNote = (e) =&gt; {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
```

يُسترجع المحتوى من حقل نص النموذج باستخدام&nbsp;<em>e.target.note.value</em>&nbsp;إلى متغير، يُستخدم كمعامل في استدعاء دالة إضافة الملاحظة&nbsp;<em>add</em>.

والسطر الأخير،&nbsp;<em>e.target.reset()</em>، يفرّغ النموذج.

الشيفرة الحالية للتطبيق متاحة بالكامل على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-1" target="_blank" rel="noopener">GitHub</a>، في الفرع&nbsp;<em>part6-1</em>.

### مزيد من المكوّنات والوظائف

لنقسّم التطبيق إلى مزيد من المكوّنات. سنفصل إنشاء ملاحظة جديدة، وقائمة الملاحظات، وعرض ملاحظة واحدة، إلى مكوّنات خاصة بها.

مكوّن&nbsp;<em>App</em>&nbsp;بعد التغيير بسيط:

```js
const App = () =&gt; (
  &lt;div&gt;
    &lt;NoteForm /&gt;
    &lt;NoteList /&gt;
  &lt;/div&gt;
)
```

إنشاء الملاحظة، أي&nbsp;<em>NoteForm</em>، لا يحتوي على شيء مثير، لذا لا نعرض الشيفرة هنا.

المكوّن المسؤول عن سرد الملاحظات،&nbsp;<em>NoteList</em>، يبدو كما يلي:

```js
import { useNotes } from './store'
import Note from './Note'

const NoteList = () =&gt; {
  const notes = useNotes()

  return (
    &lt;ul&gt;
      {notes.map(note =&gt; (
        &lt;Note key={note.id} note={note} /&gt;
      ))}
    &lt;/ul&gt;
  )
}
```

يجلب المكوّن قائمة الملاحظات من store وينشئ مكوّن&nbsp;<em>Note</em>&nbsp;مقابلاً لكل ملاحظة، ويمرّر بيانات الملاحظة كـ props:

```js
const Note = ({ note }) =&gt; (
  &lt;li&gt;
    {note.important ? &lt;strong&gt;{note.content}&lt;/strong&gt; : note.content}
  &lt;/li&gt;
)
```

لنضف أيضاً القدرة على تبديل أهمية الملاحظة. المكوّن بعد التغيير هو التالي:

```js
import { useNoteActions } from './store'

const Note = ({ note }) => {
// BEGIN HIGHLIGHT
  const { toggleImportance } = useNoteActions()
// END HIGHLIGHT

  return (
    &lt;li>
      {note.important ? &lt;strong>{note.content}&lt;/strong> : note.content}
// BEGIN HIGHLIGHT
      &lt;button onClick={() => toggleImportance(note.id)}>
        {note.important ? 'make not important' : 'make important'}
      &lt;/button>
// END HIGHLIGHT
   &lt;/li>
  )
}
```

يفكّك المكوّن دالة تبديل الأهمية من القيمة المُعادة لـ&nbsp;<em>useNoteActions</em>، ويستدعيها عند النقر على زر التبديل.

تنفيذ دالة تبديل الأهمية يبدو كما يلي:

```js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [],
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    ),
// BEGIN HIGHLIGHT
    toggleImportance: id => set(
      state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    )
// END HIGHLIGHT
  }
}))
```

تستقبل الدالة معرّف الملاحظة المطلوب تعديلها كمعامل. وتتكوّن الحالة الجديدة من الحالة القديمة باستخدام دالة&nbsp;<em>map</em>&nbsp;بحيث تُضمَّن كل الملاحظات القديمة، باستثناء الملاحظة المطلوب تعديلها، إذ تُنشأ لها نسخة تُبدَّل فيها أهميتها:

```
{ ...note, important: !note.important }
```

الشيفرة الحالية للتطبيق متاحة بالكامل على&nbsp;<a href="https://github.com/fullstack-hy2020/zustand-notes/tree/part6-2" target="_blank" rel="noopener">GitHub</a>، في الفرع&nbsp;<em>part6-2</em>.

<div class="tasks">

**3. anecdotes الخطوة 1**

</div>

<div class="tasks">

**4. anecdotes الخطوة 2**

</div>

<div class="tasks">

**5. anecdotes الخطوة 3**

</div>

<div class="tasks">

**6. anecdotes الخطوة 4**

</div>

بعد إكمال التمارين، ينبغي أن يبدو التطبيق هكذا:

![صورة توضيحية](/images/mooc/e232f973b851.webp)
