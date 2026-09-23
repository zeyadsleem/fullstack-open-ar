---
part: 8
letter: e
title: "الفصل 5: تسجيل الدخول وتحديث الذاكرة المؤقتة"
mainImage: /images/part-8.svg
lang: ar
---
تعرض الواجهة الأمامية لتطبيقنا دليل الهاتف بشكل جيد مع الخادم المحدّث. لكن إذا أردنا إضافة أشخاص جدد، فعلينا إضافة وظيفة تسجيل الدخول إلى الواجهة الأمامية.

## تسجيل دخول المستخدم

لنُعرّف أولاً الـ mutation الخاصة بتسجيل الدخول في الملف&nbsp;<em>src/queries.js</em>:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

لنُعرّف المكوّن&nbsp;<code>LoginForm</code>&nbsp;المسؤول عن تسجيل الدخول في الملف&nbsp;<em>src/components/LoginForm.jsx</em>. وهو يعمل بالطريقة نفسها تقريباً التي تعمل بها المكوّنات السابقة التي تتعامل مع الـ mutations. الأسطر المهمة مُبرَزة في الشيفرة:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) =&gt; { // HIGHLIGHT LINE
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // BEGIN HIGHLIGHT
  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) =&gt; {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('phonebook-user-token', token)
    },
    onError: (error) =&gt; {
      setError(error.message)
    }
  })
  // END HIGHLIGHT

  // BEGIN HIGHLIGHT
  const submit = (event) =&gt; {
    event.preventDefault()
    login({ variables: { username, password } })
  }
  // END HIGHLIGHT

  return (
    &lt;div&gt;
      &lt;form onSubmit={submit}&gt;
        &lt;div&gt;
          username &lt;input
            value={username}
            onChange={({ target }) =&gt; setUsername(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;div&gt;
          password &lt;input
            type='password'
            value={password}
            onChange={({ target }) =&gt; setPassword(target.value)}
          /&gt;
        &lt;/div&gt;
        &lt;button type='submit'&gt;login&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  )
}

export default LoginForm
```

يتلقّى المكوّن الدالتين&nbsp;<code>setError</code>&nbsp;و<code>setToken</code>&nbsp;كـ props، ويمكن استخدامهما لتغيير حالة التطبيق. ويُترك تعريف إدارة الحالة إلى المكوّن&nbsp;<code>App</code>.

بالنسبة إلى دالة&nbsp;<code>useMutation</code>&nbsp;التي تنفّذ تسجيل الدخول، تُعرَّف دالة استدعاء راجعة (callback) باسم&nbsp;<code>onCompleted</code>. وتُستدعى هذه الدالة عند تنفيذ الـ mutation بنجاح. وفي دالة الاستدعاء الراجعة، تُقرأ قيمة token من بيانات الاستجابة ثم تُخزَّن في حالة التطبيق وفي localStorage الخاص بالمتصفح.

لنستخدم الآن مكوّن&nbsp;<em>LoginForm</em>&nbsp;في ملف&nbsp;<em>App.jsx</em>. نضيف متغير&nbsp;<code>token</code>&nbsp;إلى حالة التطبيق لتخزين token بعد تسجيل دخول المستخدم. وإذا لم يكن&nbsp;<code>token</code>&nbsp;معرَّفاً، نعرض نموذج تسجيل الدخول فقط:

```js
import LoginForm from './components/LoginForm' // HIGHLIGHT LINE
// ...

const App = () =&gt; {
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token')) // HIGHLIGHT LINE
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  const notify = (message) =&gt; {
    setErrorMessage(message)
    setTimeout(() =&gt; {
      setErrorMessage(null)
    }, 10000)
  }

  // BEGIN HIGHLIGHT
  if (!token) {
    return (
      &lt;div&gt;
        &lt;Notify errorMessage={errorMessage} /&gt;
        &lt;h2&gt;Login&lt;/h2&gt;
        &lt;LoginForm
          setToken={setToken}
          setError={notify}
        /&gt;
      &lt;/div&gt;
    )
  }
  // END HIGHLIGHT

  return (
    // ...
  )
}
```

يُهيَّأ token الآن من قيمة token قد توجد في localStorage:

```js
const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
```

بهذه الطريقة، يُستعاد token أيضاً عند إعادة تحميل الصفحة، ويبقى المستخدم مسجّلاً الدخول. وإذا لم يحتوي localStorage على قيمة للمفتاح&nbsp;<em>phonebook-user-token</em>، فستكون قيمة token هي&nbsp;<code>null</code>.

نضيف أيضاً زراً يسمح للمستخدم المسجّل الدخول بتسجيل الخروج. في معالج النقر على الزر، نضبط&nbsp;<code>token</code>&nbsp;على&nbsp;<code>null</code>، ونحذف token من localStorage، ونعيد تعيين الذاكرة المؤقتة الخاصة بـ Apollo Client:

```js
import { useApolloClient, useQuery } from '@apollo/client/react' // HIGHLIGHT LINE
//...

const App = () =&gt; {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient() // HIGHLIGHT LINE

  if (result.loading)  {
    return &lt;div&gt;loading...&lt;/div&gt;
  }

  // BEGIN HIGHLIGHT
  const onLogout = () =&gt; {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  // END HIGHLIGHT

  // ...

  return (
    &lt;&gt;
      &lt;Notify errorMessage={errorMessage} /&gt;
      &lt;button onClick={onLogout}&gt;logout&lt;/button&gt; // HIGHLIGHT LINE
      &lt;Persons persons={result.data.allPersons} /&gt;
      &lt;PersonForm setError={notify} /&gt;
      &lt;PhoneForm setError={notify} /&gt;
    &lt;/&gt;
  )
}
```

تتم إعادة تعيين الذاكرة المؤقتة باستخدام الدالة&nbsp;<a href="https://www.apollographql.com/docs/react/api/core/ApolloClient#resetstore" target="_blank" rel="noreferrer noopener">resetStore</a>&nbsp;في كائن Apollo&nbsp;<code>client</code>، ويمكن الوصول إلى client نفسه عبر الخطاف&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/useApolloClient" target="_blank" rel="noreferrer noopener">useApolloClient</a>. ومسح الذاكرة المؤقتة&nbsp;<a href="https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout" target="_blank" rel="noreferrer noopener">مهم</a>، لأن بعض الاستعلامات قد تكون جلبت بيانات إلى الذاكرة المؤقتة لا يُسمح بالوصول إليها إلا لمستخدم مُصادَق عليه.

## إضافة token إلى الترويسة

بعد تغييرات الواجهة الخلفية، تتطلب إضافة أشخاص جدد إرسال token صالح للمستخدم مع الطلب. وهذا يتطلب تغييرات في تهيئة Apollo Client في ملف&nbsp;<em>main.jsx</em>:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context' // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const authLink  = new SetContextLink(({ headers }) =&gt; {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
// END HIGHLIGHT

const httpLink = new HttpLink({ uri: 'http://localhost:4000' }) // HIGHLIGHT LINE

// BEGIN HIGHLIGHT
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
// END HIGHLIGHT

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;ApolloProvider client={client}&gt;
      &lt;App /&gt;
    &lt;/ApolloProvider&gt;
  &lt;/StrictMode&gt;,
)
```

كما في السابق، يُغلَّف عنوان URL الخاص بالخادم باستخدام مُنشئ&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-http" target="_blank" rel="noreferrer noopener">HttpLink</a>&nbsp;لإنشاء كائن&nbsp;<code>httpLink</code>&nbsp;مناسب. لكن هذه المرة، يُعدَّل باستخدام&nbsp;<a href="https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview" target="_blank" rel="noreferrer noopener">context</a>&nbsp;المعرَّف بواسطة كائن&nbsp;<code>authLink</code>&nbsp;بحيث تُضبط ترويسة&nbsp;<em>authorization</em>&nbsp;لكل طلب على token الذي قد يكون مخزَّناً في localStorage.

تعمل إضافة الأشخاص الجدد وتغيير الأرقام مرة أخرى.

## إصلاح التحققات

في التطبيق، ينبغي أن يكون ممكناً إضافة شخص دون رقم هاتف. لكن إذا حاولنا الآن إضافة شخص دون رقم هاتف، فلن ينجح الأمر:

![المتصفح يعرض فشل التحقق من صحة بيانات الشخص](/images/mooc/2ad4ea9510aa.webp)

يفشل التحقق، لأن الواجهة الأمامية ترسل نصاً فارغاً كقيمة للحقل&nbsp;<code>phone</code>.

لنغيّر الدالة التي تنشئ أشخاصاً جدد بحيث تضبط&nbsp;<code>phone</code>&nbsp;على&nbsp;<code>undefined</code>&nbsp;إذا لم يُدخل المستخدم قيمة:

```js
const PersonForm = ({ setError }) =&gt; {
  // ...
  const submit = async (event) =&gt; {
    event.preventDefault()

    // BEGIN HIGHLIGHT
    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length &gt; 0 ? phone : undefined,
      },
    })
    // END HIGHLIGHT

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  // ...
}
```

من منظور الواجهة الخلفية وقاعدة البيانات، لم تعد لسمة&nbsp;<em>phone</em>&nbsp;قيمة إذا ترك المستخدم الحقل فارغاً. وتعمل إضافة شخص دون رقم هاتف مرة أخرى.

هناك أيضاً مشكلة في وظيفة تغيير رقم الهاتف. فتحققات قاعدة البيانات تشترط أن يكون رقم الهاتف 5 محارف على الأقل، لكن إذا حاولنا تحديث رقم هاتف شخص موجود إلى رقم قصير جداً، فلا يبدو أن شيئاً يحدث. لا يُحدَّث رقم هاتف الشخص، لكن في المقابل لا تظهر رسالة خطأ أيضاً.

من تبويب&nbsp;<em>Network</em>&nbsp;في وحدة التحكم يمكننا أن نرى أن الطلب يُجاب برسالة خطأ:

![يعرض تبويب Network في وحدة التحكم رسالة الخطأ المُعادة في الاستجابة](/images/mooc/d455f2772201.webp)

لنعدّل التطبيق بحيث تظهر أخطاء التحقق أيضاً عند تغيير رقم هاتف:

```js
const PhoneForm = ({ setError }) =&gt; {
  // ...

  const submit = async (event) =&gt; {
    event.preventDefault()

    // BEGIN HIGHLIGHT
    try {
      await changeNumber({ variables: { name, phone } })
    } catch (error) {
      setError(error.message)
    }
    // END HIGHLIGHT

    setName('')
    setPhone('')
  }

  // ...
}
```

الطلب الذي يحدّث الرقم، <code>changeNumber</code>، يُنفَّذ الآن داخل كتلة <em>try</em>. وإذا فشلت تحققات قاعدة البيانات، ينتهي التنفيذ في كتلة <em>catch</em>، حيث تُضبط رسالة خطأ مناسبة في التطبيق باستخدام الدالة <code>setError</code>:

![يعرض التطبيق رسالة خطأ إذا كان رقم الهاتف أقصر من 5 محارف](/images/mooc/bb80cd39240f.webp)

## تحديث الذاكرة المؤقتة مرة أخرى

علينا&nbsp;<a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql/chapter-3#updating-the-cache" target="_blank" rel="noreferrer noopener">تحديث</a>&nbsp;الذاكرة المؤقتة لعميل Apollo عند إنشاء أشخاص جدد. يمكننا تحديثها باستخدام خيار&nbsp;<code>refetchQueries</code>&nbsp;الخاص بالـ mutation لتحديد إعادة تنفيذ استعلام&nbsp;<code>ALL_PERSONS</code>.

```js
const PersonForm = ({ setError }) =&gt; {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) =&gt; setError(error.message),
    refetchQueries: [{ query: ALL_PERSONS }], // HIGHLIGHT LINE
  })

// ...
}
```

هذا الأسلوب جيد جداً، وعيبه أن الاستعلام يُعاد تنفيذه دائماً مع أي تحديثات.

من الممكن تحسين الحل بتحديث الذاكرة المؤقتة يدوياً. ويتم ذلك بتعريف دالة استدعاء راجعة&nbsp;<a href="https://www.apollographql.com/docs/react/data/mutations/#the-update-function" target="_blank" rel="noreferrer noopener">update</a>&nbsp;مناسبة للـ mutation بدلاً من استخدام السمة&nbsp;<code>refetchQueries</code>. ينفّذ Apollo دالة الاستدعاء الراجعة هذه بعد اكتمال الـ mutation:

```sql
const PersonForm = ({ setError }) =&gt; {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) =&gt; setError(error.message),
    // BEGIN HIGHLIGHT
    update: (cache, response) =&gt; {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) =&gt; {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
    // END HIGHLIGHT
  })

  // ..
}
```

تُعطى دالة الاستدعاء الراجعة مرجعاً إلى الذاكرة المؤقتة والبيانات التي أعادتها الـ mutation كمعاملات. وفي حالتنا مثلاً، ستكون هذه البيانات هي الشخص المُنشأ.

وباستخدام الدالة&nbsp;<a href="https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment" target="_blank" rel="noreferrer noopener">updateQuery</a>&nbsp;تحدّث الشيفرة استعلام ALLPERSONS في الذاكرة المؤقتة بإضافة الشخص الجديد إلى البيانات المخزَّنة مؤقتاً.

في بعض الحالات، تكون دالة الاستدعاء الراجعة&nbsp;<code>update</code>&nbsp;هي الطريقة المعقولة الوحيدة لإبقاء الذاكرة المؤقتة محدَّثة.

عند الحاجة، يمكن تعطيل الذاكرة المؤقتة للتطبيق بأكمله أو&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#options" target="_blank" rel="noreferrer noopener">لاستعلامات منفردة</a>&nbsp;بضبط الحقل الذي يدير استخدام الذاكرة المؤقتة،&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy" target="_blank" rel="noreferrer noopener">fetchPolicy</a>&nbsp;على&nbsp;<code>no-cache</code>.

كن مجتهداً مع الذاكرة المؤقتة. فالبيانات القديمة فيها قد تسبب أخطاء يصعب العثور عليها. وكما نعلم، فإن إبقاء الذاكرة المؤقتة محدَّثة أمر صعب جداً. وحسب مثل شائع بين المبرمجين:

> <em>هناك شيئان صعبان فقط في علوم الحاسوب: إبطال صلاحية الذاكرة المؤقتة وتسمية الأشياء.</em>&nbsp;اقرأ المزيد&nbsp;<a href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noreferrer noopener">هنا</a>.

يمكن العثور على الشيفرة الحالية للتطبيق على <a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5" target="_blank" rel="noreferrer noopener">Github</a>، في الفرع <em>part8-5</em>.

<div class="tasks">

**18. سرد الكتب**

</div>

<div class="tasks">

**19. تسجيل الدخول**

</div>

<div class="tasks">

**20. الكتب حسب النوع، الجزء 1**

</div>

<div class="tasks">

**21. الكتب حسب النوع، الجزء 2**

</div>

<div class="tasks">

**22. الكتب حسب النوع باستخدام GraphQL**

</div>

<div class="tasks">

**23. الذاكرة المؤقتة المحدَّثة وتوصيات الكتب**

</div>

<div class="tasks">

**24. فحص**

</div>
