---
part: 8
letter: c
title: "الفصل 3: React وGraphQL"
mainImage: /images/part-8.svg
lang: ar
---
سننفّذ بعد ذلك تطبيق React يستخدم خادم GraphQL الذي أنشأناه.

تجد الشيفرة الحالية للخادم على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>، في الفرع&nbsp;<em>part8-3</em>.

من حيث المبدأ، يمكننا استخدام GraphQL عبر طلبات HTTP من نوع POST. يُظهر ما يلي مثالاً على ذلك باستخدام Postman:

![Postman يعرض localhost:4000 graphql مع استعلام allPersons](/images/mooc/8cb04b83e47f.webp)

يتم التواصل عبر إرسال طلبات HTTP من نوع POST إلى&nbsp;<a href="http://localhost:4000/graphql" target="_blank" rel="noreferrer noopener">http://localhost:4000/graphql</a>. والاستعلام نفسه نص يُرسل كقيمة للمفتاح&nbsp;<em>query</em>.

يمكننا تولّي أمر التواصل بين تطبيق React وGraphQL باستخدام Axios. لكن في معظم الأحيان، ليس من الحكمة كثيراً فعل ذلك. من الأفضل استخدام مكتبة أعلى مستوى قادرة على تجريد التفاصيل غير الضرورية من التواصل.

حالياً، هناك خياران جيدان:&nbsp;<a href="https://facebook.github.io/relay/" target="_blank" rel="noreferrer noopener">Relay</a>&nbsp;من Facebook و&nbsp;<a href="https://www.apollographql.com/docs/react/" target="_blank" rel="noreferrer noopener">Apollo Client</a>، وهو الجانب الخاص بالعميل من المكتبة نفسها التي استخدمناها في القسم السابق. Apollo هو بالتأكيد الأكثر شعبية بين الاثنين، وسنستخدمه في هذا القسم أيضاً.

## عميل Apollo

لننشئ تطبيق React جديداً ونثبّت الاعتماديات اللازمة لـ&nbsp;<a href="https://www.apollographql.com/docs/react/get-started/" target="_blank" rel="noreferrer noopener">عميل Apollo</a>.

```bash
npm install @apollo/client graphql

```

استبدل المحتوى الافتراضي للملف&nbsp;<em>main.jsx</em>&nbsp;بهيكل البرنامج التالي:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

client.query({ query }).then((response) => {
  console.log(response.data)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

تُنشئ بداية الشيفرة كائن&nbsp;<a href="https://www.apollographql.com/docs/react/get-started#step-3-initialize-apolloclient" target="_blank" rel="noreferrer noopener">عميل</a>&nbsp;جديداً، يُستخدم بعدها لإرسال استعلام إلى الخادم:

```
client.query({ query }).then((response) => {
  console.log(response.data)
})

```

تُطبع استجابة الخادم في وحدة التحكم:

![أدوات المطورين تعرض مصفوفة allPersons مع 3 أشخاص](/images/mooc/e1d6c9ca3a7c.webp)

يُضاف وسم&nbsp;<code>gql</code>&nbsp;قبل القالب النصي الذي يشكّل الاستعلام، وهو مستورد من حزمة @apollo/client:

```js
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

// ...

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

```

بفضل الوسم، تتعرّف إضافة GraphQL في VS Code والأدوات الأخرى على التعريف باعتباره GraphQL، ما يتيح ميزات مثل إبراز الصيغة في المحرر. أما في جهة الخادم، فقد حققنا الشيء نفسه بإضافة تعليق يحدد النوع قبل القالب النصي، لأن مكتبة @apollo/server المستخدمة في الخادم لا تتضمن وسم&nbsp;<code>gql</code>&nbsp;مقابلاً.

يمكن للتطبيق أن يتواصل مع خادم GraphQL باستخدام كائن&nbsp;<code>client</code>. ويمكن جعل العميل متاحاً لجميع مكوّنات التطبيق بتغليف مكوّن&nbsp;<em>App</em>&nbsp;بـ&nbsp;<a href="https://www.apollographql.com/docs/react/get-started#step-4-connect-your-client-to-react" target="_blank" rel="noreferrer noopener">ApolloProvider</a>.

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

// ...

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)

```

## إجراء الاستعلامات

أصبحنا مستعدين لتنفيذ العرض الرئيسي للتطبيق، الذي يعرض قائمة باسم الشخص ورقم هاتفه.

يقدم Apollo Client بضعة بدائل لإجراء&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/" target="_blank" rel="noreferrer noopener">الاستعلامات</a>. حالياً، يُعد استخدام دالة الخطاف&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#usequery" target="_blank" rel="noreferrer noopener">useQuery</a>&nbsp;هو الممارسة السائدة.

يُجري الاستعلام مكوّن&nbsp;<em>App</em>&nbsp;، وشيفرته كالتالي:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}

export default App

```

عند استدعائه، يُجري&nbsp;<code>useQuery</code>&nbsp;الاستعلام الذي يستقبله كمعامل. وهو يعيد كائناً فيه عدة&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#result" target="_blank" rel="noreferrer noopener">حقول</a>. يكون الحقل&nbsp;<em>loading</em>&nbsp;قيمته true إذا لم يتلقَّ الاستعلام استجابة بعد. عندئذٍ تُعرض الشيفرة التالية:

```js
if (result.loading) {
  return <div>loading...</div>
}

```

عند استلام استجابة، يمكن العثور على نتيجة استعلام&nbsp;<em>allPersons</em>&nbsp;في الحقل data، ويمكننا عرض قائمة الأسماء على الشاشة.

```
<div>
  {result.data.allPersons.map(p => p.name).join(', ')}
</div>

```

افصل عرض الأشخاص في مكوّن خاص به في الملف&nbsp;<em>src/components/Persons.jsx</em>:

```js
const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.id}>
          {p.name} {p.phone}
        </div>
      )}
    </div>
  )
}

export default Persons

```

لا يزال مكوّن&nbsp;<code>App</code>&nbsp;يجري الاستعلام، ويمرر النتيجة إلى المكوّن الجديد ليُعرض:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Persons from './components/Persons'

// ...

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return <Persons persons={result.data.allPersons} />
}

```

## الاستعلامات المسماة والمتغيرات

لننفّذ وظيفة لعرض تفاصيل عنوان شخص. استعلام&nbsp;<em>findPerson</em>&nbsp;مناسب تماماً لهذا.

الاستعلامات التي أجريناها في الفصل السابق كانت تحمل المعامل مضمَّناً مباشرة في الاستعلام:

```
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
    id
  }
}

```

عندما نُجري استعلامات برمجياً، يجب أن نكون قادرين على إعطائها معاملات ديناميكياً.

تناسب&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">متغيرات</a>&nbsp;GraphQL هذا الغرض تماماً. ولكي نتمكن من استخدام المتغيرات، يجب أيضاً أن نسمّي استعلاماتنا.

صيغة جيدة للاستعلام هي هذه:

```
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone
    address {
      street
      city
    }
  }
}

```

اسم الاستعلام هو&nbsp;<em>findPersonByName</em>، ويُعطى نصاً&nbsp;<em>$nameToSearch</em>&nbsp;كمعامل.

من الممكن أيضاً إجراء استعلامات ذات معاملات باستخدام Apollo Explorer. تُعطى المعاملات في&nbsp;<em>Variables</em>:

![apollostudio findPersonByName مع إبراز nameToSearch وArto Hellas](/images/mooc/cb57470830d9.webp)

خطاف&nbsp;<code>useQuery</code>&nbsp;مناسب تماماً للحالات التي يُجرى فيها الاستعلام عند عرض المكوّن. لكننا نريد الآن إجراء الاستعلام فقط عندما يريد المستخدم رؤية تفاصيل شخص معيّن، لذا لا يُجرى الاستعلام إلا&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually" target="_blank" rel="noreferrer noopener">عند الحاجة</a>.

أحد الاحتمالات لهذا النوع من الحالات هو دالة الخطاف&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/useLazyQuery" target="_blank" rel="noreferrer noopener">useLazyQuery</a>&nbsp;التي تجعل من الممكن تعريف استعلام يُنفَّذ&nbsp;<em>عندما</em>&nbsp;يريد المستخدم رؤية المعلومات التفصيلية لشخص.

لكن في حالتنا يمكننا الاكتفاء بـ&nbsp;<code>useQuery</code>&nbsp;واستخدام الخيار&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries#skipoptional" target="_blank" rel="noreferrer noopener">skip</a>، الذي يجعل من الممكن إجراء الاستعلام فقط إذا تحقق شرط محدد.

بعد التغييرات، يصبح الملف&nbsp;<em>Persons.jsx</em>&nbsp;كالتالي:

```js
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

const Persons = ({ persons }) => {

  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })



  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }


  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.id}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>
            show address
          </button>
        </div>
      ))}
    </div>
  )
}

export default Persons

```

تغيّرت الشيفرة كثيراً، وليست كل التغييرات ظاهرة تماماً.

عند الضغط على زر&nbsp;<em>show address</em>&nbsp;لشخص ما، يُضبط اسم الشخص في الحالة&nbsp;<em>nameToSearch</em>:

```
<button onClick={() => setNameToSearch(p.name)}>
  show address
</button>

```

يتسبب هذا في إعادة عرض المكوّن لنفسه. وعند العرض يُنفَّذ استعلام&nbsp;<em>FIND_PERSON</em>&nbsp;الذي يجلب المعلومات التفصيلية لمستخدم إذا كانت للمتغير&nbsp;<em>nameToSearch</em>&nbsp;قيمة:

```js
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch,
})

```

عندما لا يهتم المستخدم برؤية المعلومات التفصيلية لأي شخص، يكون متغير الحالة&nbsp;<em>nameToSearch</em>&nbsp;قيمته null ولا يُنفَّذ الاستعلام.

إذا كانت للحالة&nbsp;<em>nameToSearch</em>&nbsp;قيمة وكانت نتيجة الاستعلام جاهزة، يعرض مكوّن&nbsp;<em>Person</em>&nbsp;المعلومات التفصيلية لشخص:

```js
if (nameToSearch && result.data) {
  return (
    <Person
      person={result.data.findPerson}
      onClose={() => setNameToSearch(null)}
    />
  )
}

```

يبدو عرض الشخص الواحد كالتالي:

![المتصفح يعرض شخصاً واحداً](/images/mooc/e0c37be995e1.webp)

عندما يريد المستخدم العودة إلى قائمة الأشخاص، تُضبط حالة&nbsp;<code>nameToSearch</code>&nbsp;على&nbsp;<code>null</code>.

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part8-1</em>.

### الذاكرة المؤقتة

عندما نُجري استعلامات متعددة، مثلاً بتفاصيل عنوان Arto Hellas، نلاحظ شيئاً مثيراً للاهتمام: لا يُجرى الاستعلام إلى الواجهة الخلفية إلا في المرة الأولى. بعد ذلك، ورغم إجراء الشيفرة للاستعلام نفسه مرة أخرى، لا يُرسل الاستعلام إلى الواجهة الخلفية.

![المتصفح يعرض استجابة أدوات المطورين مع تبويب الشبكة وgraphql](/images/mooc/0fc3b52f0877.webp)

يحفظ عميل Apollo استجابات الاستعلامات في <a href="https://www.apollographql.com/docs/react/caching/overview/" target="_blank" rel="noreferrer noopener">الذاكرة المؤقتة</a>. ولتحسين الأداء، إذا كانت استجابة الاستعلام موجودة أصلاً في الذاكرة المؤقتة، فلا يُرسل الاستعلام إلى الخادم إطلاقاً.

![أدوات مطوري Apollo تعرض root_query allPersons](/images/mooc/bf7ef641cb8f.webp)

تُظهر الذاكرة المؤقتة المعلومات التفصيلية عن Arto Hellas بعد استعلام <em>findPerson</em>:

![أدوات مطوري Apollo تعرض أول شخص مع معلوماته](/images/mooc/dec90af18c4d.webp)

## إجراء الـ mutations

لننفّذ وظيفة لإضافة أشخاص جدد.

في الفصل السابق، ضمّنّا المعاملات مباشرة في الـ mutations. الآن، نحتاج إلى نسخة من mutation الـ addPerson تستخدم&nbsp;<a href="https://graphql.org/learn/queries/#variables" target="_blank" rel="noreferrer noopener">المتغيرات</a>:

```bash
const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

```

توفر دالة الخطاف&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#usemutation" target="_blank" rel="noreferrer noopener">useMutation</a>&nbsp;وظيفة إجراء الـ mutations.

أنشئ مكوّناً جديداً&nbsp;<em>PersonForm</em>&nbsp;لإضافة شخص جديد إلى التطبيق. محتوى الملف&nbsp;<em>src/components/PersonForm.jsx</em>&nbsp;كالتالي:

```bash
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON)

  const submit = (event) => {
    event.preventDefault()


    createPerson({ variables: { name, phone, street, city } })


    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm

```

شيفرة النموذج مباشرة وقد أُبرزت الأسطر المهمة. يمكننا تعريف دوال الـ mutation باستخدام خطاف&nbsp;<code>useMutation</code>. يعيد الخطاف&nbsp;<em>مصفوفة</em>، يحتوي عنصرها الأول على الدالة التي تُحدث الـ mutation.

```js
const [createPerson] = useMutation(CREATE_PERSON)

```

تتلقى متغيرات الاستعلام القيم عند إجراء الاستعلام:

```
createPerson({ variables: { name, phone, street, city } })

```

فعّل مكوّن&nbsp;<em>PersonForm</em>&nbsp;في الملف&nbsp;<em>App.jsx</em>:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

// ...

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }


  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <PersonForm />
    </div>
  )

}

export default App

```

يُضاف الأشخاص الجدد بشكل جيد، لكن الشاشة لا تُحدَّث. السبب أن Apollo Client لا يستطيع تحديث الذاكرة المؤقتة للتطبيق تلقائياً، لذا لا تزال تحتوي على الحالة السابقة للـ mutation. يمكننا تحديث الشاشة بإعادة تحميل الصفحة، إذ تُفرَّغ الذاكرة المؤقتة عند إعادة تحميل الصفحة. لكن لا بد أن تكون هناك طريقة أفضل لفعل ذلك.

## تحديث الذاكرة المؤقتة

توجد بضعة حلول مختلفة لهذا. إحدى الطرق هي جعل استعلام جميع الأشخاص&nbsp;<a href="https://www.apollographql.com/docs/react/data/queries/#polling" target="_blank" rel="noreferrer noopener">يستطلع (poll)</a>&nbsp;الخادم، أو إجراء الاستعلام بشكل متكرر.

التغيير صغير. لنضبط الاستعلام ليستطلع كل ثانيتين:

```js
const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons = {result.data.allPersons}/>
      <PersonForm />
    </div>
  )
}

export default App

```

الحل بسيط، وفي كل مرة يضيف فيها مستخدم شخصاً جديداً، يظهر فوراً على شاشات جميع المستخدمين.

الجانب السلبي في الاستطلاع هو بطبيعة الحال حركة الشبكة غير الضرورية التي يسببها. إضافة إلى ذلك، قد تبدأ الصفحة بالوميض، لأن المكوّن يُعاد عرضه مع كل تحديث للاستعلام وتكون&nbsp;<code>result.loading</code>&nbsp;قيمتها true للحظة وجيزة—فيتوهّج نص&nbsp;<em>loading...</em>&nbsp;على الشاشة لجزء من الثانية.

طريقة سهلة أخرى للحفاظ على تزامن الذاكرة المؤقتة هي استخدام معامل&nbsp;<a href="https://www.apollographql.com/docs/react/data/refetching/" target="_blank" rel="noreferrer noopener">refetchQueries</a>&nbsp;في خطاف&nbsp;<code>useMutation</code>&nbsp;لتعريف أنه كلما أُنشئ شخص جديد، يُعاد إجراء الاستعلام الذي يجلب جميع الأشخاص.

```js
// ...


const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`


const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')


  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
  })


  // ...
}

```

مزايا هذا الحل وعيوبه شبه معاكسة للحل السابق. لا توجد حركة ويب إضافية لأن الاستعلامات لا تُجرى احتياطاً. لكن إذا حدّث أحد المستخدمين الآن حالة الخادم، فلا تظهر التغييرات للمستخدمين الآخرين فوراً.

إذا أردت إجراء استعلامات متعددة، يمكنك تمرير عدة كائنات داخل refetchQueries. سيتيح لك ذلك تحديث أجزاء مختلفة من تطبيقك في الوقت نفسه. إليك مثالاً:

```js
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [
    { query: ALL_PERSONS },
    { query: OTHER_QUERY },
    { query: ANOTHER_QUERY },
  ], // مرّر ما تحتاج من استعلامات
})

```

توجد طرق أخرى لتحديث الذاكرة المؤقتة. المزيد عنها لاحقاً في هذا الجزء.

حالياً، تُعرَّف الاستعلامات والمكوّنات في المكان نفسه في شيفرتنا. لنفصل تعريفات الاستعلامات في ملفها الخاص&nbsp;<em>src/queries.js</em>:

```bash
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

```

ثم يستورد كل مكوّن الاستعلامات التي يحتاجها:

```js
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}

```

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part8-2</em>.

## معالجة أخطاء الـ mutation

إذا حاولنا إنشاء شخص غير صالح، مثلاً باستخدام اسم موجود أصلاً في التطبيق، فلا يحدث شيء. لا يُضاف الشخص إلى التطبيق، لكننا لا نتلقى أيضاً أي رسالة خطأ.

في وقت سابق، عرّفنا فحصاً في الخادم يمنع إضافة شخص آخر بالاسم نفسه ويرمي خطأً في مثل هذه الحالة. لكن الخطأ لم يُعالج بعد في الواجهة الأمامية. باستخدام&nbsp;<a href="https://www.apollographql.com/docs/react/api/react/hooks/#params-2" target="_blank" rel="noreferrer noopener">الخيار</a>&nbsp;<code>onError</code>&nbsp;في خطاف&nbsp;<code>useMutation</code>، يمكن تسجيل دالة معالج أخطاء للـ mutations.

لنسجّل معالج أخطاء للـ mutation. يتلقى مكوّن&nbsp;<em>PersonForm</em>&nbsp;دالة&nbsp;<code>setError</code>&nbsp;كـ prop، تُستخدم لضبط رسالة تشير إلى الخطأ:

```js
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    onError: (error) => setError(error.message),
  })

  // ...
}

```

أنشئ مكوّناً منفصلاً للإشعار في الملف&nbsp;<em>src/components/Notify.jsx</em>:

```js
const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default Notify

```

يتلقى المكوّن رسالة خطأ محتملة كـ prop. وإذا ضُبطت رسالة خطأ، تُعرض على الشاشة.

اعرض مكوّن&nbsp;<em>Notify</em>&nbsp;الذي يعرض رسالة الخطأ في الملف&nbsp;<em>App.jsx</em>:

```js
import Notify from './components/Notify'

// ...

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }


  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons = {result.data.allPersons} />
      <PersonForm setError={notify} />
    </div>
  )
}

```

الآن يُبلَّغ المستخدم بحدوث خطأ عبر إشعار بسيط.

![المتصفح يعرض باللون الأحمر الرسالة name must be unique](/images/mooc/56e165c88d0f.webp)

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part8-3</em>.

## تحديث رقم هاتف

لنضف إلى تطبيقنا إمكانية تغيير أرقام هواتف الأشخاص. الحل شبه مطابق للحل الذي استخدمناه لإضافة أشخاص جدد.

تتطلب الـ mutation مرة أخرى استخدام المتغيرات. أضف الاستعلام التالي إلى الملف&nbsp;<em>queries.js</em>:

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

```

أنشئ مكوّناً جديداً&nbsp;<em>PhoneForm</em>&nbsp;في الملف&nbsp;<em>src/components/PhoneForm.jsx</em>&nbsp;لتحديث رقم هاتف. يضيف المكوّن نموذجاً إلى التطبيق حيث يمكنك إدخال رقم هاتف جديد لشخص محدد. الأجزاء المثيرة للاهتمام في الشيفرة مُبرَزة:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_NUMBER } from '../queries'

const PhoneForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')


  const [ changeNumber ] = useMutation(EDIT_NUMBER)


  const submit = (event) => {
    event.preventDefault()


    changeNumber({ variables: { name, phone } })


    setName('')
    setPhone('')
  }

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button type='submit'>change number</button>
      </form>
    </div>
  )
}

export default PhoneForm

```

مكوّن&nbsp;<em>PhoneForm</em>&nbsp;مباشر: يطلب اسم الشخص ورقم هاتف جديداً عبر نموذج. وعند إرسال النموذج، يستدعي دالة&nbsp;<code>changeNumber</code>&nbsp;التي تتولى التحديث، والمُنشأة بخطاف&nbsp;<code>useMutation</code>.

فعّل المكوّن الجديد في الملف&nbsp;<em>App.jsx</em>:

```js
import PhoneForm from './components/PhoneForm'

const App = () => {
  // ...

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

```

يبدو قاتماً، لكنه يعمل:

![المتصفح يعرض الصفحة الرئيسية مع معلومات في حقلَي الإدخال name وphone](/images/mooc/842b2800e5a8.webp)

من المثير للدهشة أنه عند تغيير رقم شخص، يظهر الرقم الجديد تلقائياً في قائمة الأشخاص التي يعرضها مكوّن&nbsp;<em>Persons</em>. يحدث هذا لأن لكل شخص حقلاً معرِّفاً من النوع&nbsp;<em>ID</em>، لذا تُحدَّث تفاصيل الشخص المحفوظة في الذاكرة المؤقتة تلقائياً عند تغييرها بالـ mutation.

لا يزال في تطبيقنا عيب صغير واحد. إذا حاولنا تغيير رقم هاتف لاسم غير موجود، لا يبدو أن شيئاً يحدث. يحدث هذا لأنه إذا تعذّر العثور على شخص بالاسم المعطى، تكون استجابة الـ mutation هي&nbsp;<em>null</em>:

![أدوات المطورين تعرض الشبكة مع localhost والاستجابة التي فيها editNumber بقيمة null](/images/mooc/c12257e022e7.webp)

بما أن GraphQL لا يعتبر هذا حالة خطأ، فلن يكون تسجيل معالج أخطاء&nbsp;<code>onError</code>&nbsp;مفيداً في هذه الحالة. لكن يمكننا إضافة دالة استدعاء راجعة&nbsp;<code>onCompleted</code>&nbsp;إلى خطاف&nbsp;<code>useMutation</code>، حيث يمكننا توليد رسالة خطأ محتملة:

```js
const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')


  const [changeNumber] = useMutation(EDIT_NUMBER, {
    onCompleted: (data) => {
      if (!data.editNumber) {
        setError('person not found')
      }
    }
  })


  // ...
}

```

تُنفَّذ دالة الاستدعاء الراجعة&nbsp;<code>onCompleted</code>&nbsp;دائماً عند اكتمال الـ mutation بنجاح. وإذا لم يُعثر على الشخص—أي إذا كانت نتيجة الاستعلام&nbsp;<code>data.editNumber</code>&nbsp;قيمتها&nbsp;<code>null</code>—يستخدم المكوّن دالة الاستدعاء الراجعة&nbsp;<code>setError</code>&nbsp;التي تلقاها عبر props لضبط رسالة خطأ مناسبة.

تجد الشيفرة الحالية للتطبيق على&nbsp;<a href="https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4" target="_blank" rel="noreferrer noopener">GitHub</a>&nbsp;في الفرع&nbsp;<em>part8-4</em>.

## Apollo Client وحالة التطبيق

في مثالنا، أصبحت إدارة حالة التطبيق في معظمها من مسؤولية Apollo Client. هذا حل نموذجي تماماً لتطبيقات GraphQL. يستخدم مثالنا حالة مكوّنات React فقط لإدارة حالة نموذج ولعرض إشعارات الأخطاء. ونتيجة لذلك، قد لا توجد أسباب مبررة لاستخدام Redux لإدارة حالة التطبيق عند استخدام GraphQL.

عند الحاجة، يتيح Apollo حفظ الحالة المحلية للتطبيق في&nbsp;<a href="https://www.apollographql.com/docs/react/local-state/local-state-management/" target="_blank" rel="noreferrer noopener">ذاكرة Apollo المؤقتة</a>.

<div class="tasks">

**8. عرض المؤلفين**

</div>

<div class="tasks">

**9. عرض الكتب**

</div>

<div class="tasks">

**10. إضافة كتاب**

</div>

<div class="tasks">

**11. سنة ميلاد المؤلفين**

</div>

<div class="tasks">

**12. سنة ميلاد المؤلفين المتقدمة**

</div>
