---
part: 9
letter: f
title: "Grande finale: Patientor"
mainImage: /images/part-9.svg
lang: en
---
### Working with an existing codebase

When diving into an existing codebase for the first time, it is good to get an overall view of the conventions and structure of the project. You can start your research by reading the&nbsp;<em>README.md</em>&nbsp;in the root of the repository. Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development. If the README is not available or someone has "saved time" and left it as a stub, you can take a peek at the&nbsp;<em>package.json</em>. It is always a good idea to start the application and click around to verify you have a functional development environment.

You can also browse the folder structure to get some insight into the application's functionality and/or the architecture used. These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you. The <a href="https://github.com/fullstack-hy2020/fs-typescript/tree/main/patientor/frontend" target="_blank" rel="noreferrer noopener">sample project</a> used in the rest of this part is organized, feature-wise. You can see what pages the application has, and some general components, e.g., modals and state. Keep in mind that the features may have different scopes. For example, modals are visible UI-level components, whereas the state is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.

TypeScript provides types for what kind of data structures, functions, components, and state to expect. You can try looking for <em>types.ts</em> or something similar to get started. VSCode is a big help, and simply highlighting variables and parameters can provide quite a lot of insight. All this naturally depends on how types are used in the project.

If the project has unit, integration, or end-to-end tests, reading those is most likely beneficial. Test cases are your most important tool when refactoring or adding new features to the application. You want to make sure not to break any existing features when hammering around the code. TypeScript can also give you guidance with argument and return types when changing the code.

Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first read-through. The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle. It is hard to imagine what kind of problems the previous developer has wrestled with. Think of it all like <a href="https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings" target="_blank" rel="noreferrer noopener">growth rings in trees</a>. Understanding everything requires digging deep into the code and business domain requirements. The more code you read, the better you will be at understanding it. You will most likely read far more code than you are going to produce throughout your life.

### Patientor frontend

It's time to get our hands dirty finalizing the frontend for the backend we built in Exercises <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4" target="_blank" rel="noreferrer noopener">9-16</a>. We will actually also need to add some new features to the backend for finishing the app.

Before diving into the code, let us start both the frontend and the backend.

If all goes well, you should see a patient listing page. It fetches a list of patients from our backend, and renders it to the screen as a simple table. There is also a button for creating new patients on the backend. As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added. UI design has not been a strong point of the creators, so let's disregard the UI for now.

After verifying that everything works, we can start studying the code. All the interesting stuff resides in the&nbsp;<em>src</em>&nbsp;folder. For your convenience, there is already a&nbsp;<em>types.ts</em>&nbsp;file for basic types used in the app, which you will have to extend or refactor in the exercises.

In principle, we could use the same types for both the backend and the frontend, but usually, the frontend has different data structures and use cases for the data, which causes the types to be different. For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array. The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.

The folder structure looks as follows:

![folder structure of the frontend shown](/images/mooc/a51b184e0625.webp)

Besides the component&nbsp;<em>App</em>&nbsp;and a directory for services, there are currently three main components:&nbsp;<em>AddPatientModal</em>&nbsp;and&nbsp;<em>PatientListPage</em>&nbsp;which are both defined in a directory and a component&nbsp;<em>HealthRatingBar</em>&nbsp;defined in a file. If a component has some subcomponents not used elsewhere in the app, it might be a good idea to define the component and its subcomponents in a directory. For example, now the AddPatientModal is defined in the file&nbsp;<em>components/AddPatientModal/index.tsx</em>&nbsp;and its subcomponent&nbsp;<em>AddPatientForm</em>&nbsp;in its own file under the same directory.

There is nothing too surprising in the code. The state and communication with the backend are implemented with&nbsp;<em>useState</em>&nbsp;hook and Axios, similar to the notes app in the previous section.&nbsp;<a href="https://fullstackopen.com/en/part5/react_router_ui_frameworks#ui-libraries" target="_blank" rel="noreferrer noopener">Material UI</a>&nbsp;is used to style the app and the navigation structure is implemented with&nbsp;<a href="https://fullstackopen.com/en/part5/react_router_ui_frameworks#react-router" target="_blank" rel="noreferrer noopener">React Router</a>, both familiar to us from part 5 of the course.

From the typing point of view, there are a couple of interesting things. Component&nbsp;<em>App</em>&nbsp;passes the function&nbsp;<em>setPatients</em>&nbsp;as a prop to the component&nbsp;<em>PatientListPage</em>:

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

To keep the TypeScript compiler happy, the props are typed as follows:

```js
interface Props {
  patients : Patient[]
  setPatients: React.Dispatch&lt;React.SetStateAction&lt;Patient[]&gt;&gt;
}

const PatientListPage = ({ patients, setPatients } : Props ) =&gt; {
  // ...
}
```

So the function <em>setPatients</em> has type <em>React.Dispatch&lt;React.SetStateAction&lt;Patient[]>></em>. We can see the type in the editor when we hover over the function:

![VS Code shows that the type of setPatients](/images/mooc/f0bade821134.webp)

The&nbsp;<a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example#basic-prop-types-examples" target="_blank" rel="noreferrer noopener">React TypeScript cheatsheet</a>&nbsp;has a pretty nice list of typical prop types, where we can seek help if finding the proper typing for props is not obvious.

<em>PatientListPage</em>&nbsp;passes four props to the component&nbsp;<em>AddPatientModal</em>. Two of these props are functions. Let us have a look at how these are typed:

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

Types look like the following:

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

<em>onClose</em>&nbsp;is just a function that takes no parameters and does not return anything, so the type is:

```
() =&gt; void
```

"The type of <code>onSubmit</code> is a bit more interesting. It takes a single parameter of type <code>PatientFormValues</code> and, since it is an async function, returns a <code>Promise</code>. Because the function doesn't return a value, the full type is:

```
(values: PatientFormValues) => Promise&lt;void>
```

<div class="tasks">

**23. Patientor, step 1**

</div>

<div class="tasks">

**24. Patientor, step 2**

</div>

### Full entries

In <a href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript/chapter-4#5d956dd3-2171-4755-a813-550d9bc68124">exercise 11</a>, we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all. Since we now have a page for viewing a patient's information, it would be nice to expand our data a bit. Let's add an <em>Entry</em> field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.

Let's ditch our old patient seed data from the backend and start using&nbsp;<a href="https://github.com/fullstack-hy2020/misc/blob/master/patients-full.ts" target="_blank" rel="noreferrer noopener">this expanded format</a>.

Let us now create a proper&nbsp;<em>Entry</em>&nbsp;type based on the data we have.

If we take a closer look at the data, we can see that the entries are quite different from one another. For example, let's take a look at the first two entries:

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

Immediately, we can see that while the first few fields are the same, the first entry has a&nbsp;<em>discharge</em>&nbsp;field and the second entry has&nbsp;<em>employerName</em>&nbsp;and&nbsp;<em>sickLeave</em>&nbsp;fields. All the entries seem to have some fields in common, but some fields are entry-specific.

When looking at the&nbsp;<em>type</em>, we can see that there are three kinds of entries:
- <em>OccupationalHealthcare</em>
- <em>Hospital</em>
- <em>HealthCheck</em>

This indicates we need three separate types. Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.

When looking at the data, it seems that the fields&nbsp;<em>id</em>,&nbsp;<em>description</em>,&nbsp;<em>date</em>&nbsp;and&nbsp;<em>specialist</em>&nbsp;are something that can be found in each entry. On top of that, it seems that&nbsp;<em>diagnosisCodes</em>&nbsp;is only found in one&nbsp;<em>OccupationalHealthcare</em>&nbsp;and one&nbsp;<em>Hospital</em>&nbsp;type entry. Since it is not always used, even in those types of entries, it is safe to assume that the field is optional. We could consider adding it to the&nbsp;<em>HealthCheck</em>&nbsp;type as well since it might just not be used in these specific entries.

So our&nbsp;<em>BaseEntry</em>&nbsp;from which each type could be extended would be the following:

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

If we want to finetune it a bit further, since we already have a&nbsp;<em>Diagnosis</em>&nbsp;type defined in the backend, we might just want to refer to the&nbsp;<em>code</em>&nbsp;field of the&nbsp;<em>Diagnosis</em>&nbsp;type directly in case its type ever changes. We can do that like so:

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnosis['code'][]; // HIGHLIGHT LINE
}
```

As was mentioned&nbsp;<a href="https://fullstackopen.com/en/part9/first_steps_with_type_script/#the-alternative-array-syntax" target="_blank" rel="noreferrer noopener">earlier in this part</a>, we could define an array with the syntax&nbsp;<em>Array&lt;Type&gt;</em>&nbsp;instead of defining it&nbsp;<em>Type[]</em>. In this particular case writing&nbsp;<em>Diagnosis['code'][]</em>&nbsp;starts to look a bit strange so we will decide to use the alternative syntax (that is also recommended by the ESlint rule&nbsp;<a href="https://typescript-eslint.io/rules/array-type/#array-simple" target="_blank" rel="noreferrer noopener">array-simple</a>):

```ts
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array&lt;Diagnosis['code']>; // HIGHLIGHT LINE
}
```

Now that we have the&nbsp;<em>BaseEntry</em>&nbsp;defined, we can start creating the extended entry types we will actually be using. Let's start by creating the&nbsp;<em>HealthCheckEntry</em>&nbsp;type.

Entries of type <em>HealthCheck</em> contain the field <em>HealthCheckRating</em>, which is an integer from 0 to 3, zero meaning <em>Healthy</em> and three meaning <em>CriticalRisk</em>. This is a perfect case for a <em>const as object</em>. With these specifications, we could write a <em>HealthCheckEntry</em> type definition like so:

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

Now we only need to create the&nbsp;<em>OccupationalHealthcareEntry</em>&nbsp;and&nbsp;<em>HospitalEntry</em>&nbsp;types so we can combine them in a union and export them as an Entry type like this:

```ts
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

### Omit with unions

An important point concerning unions is that, when you use them with&nbsp;<em>Omit</em>&nbsp;to exclude a property, it works in a possibly unexpected way. Suppose that we want to remove the&nbsp;<em>id</em>&nbsp;from each&nbsp;<em>Entry</em>. We could think of using

```
Omit&lt;Entry, 'id'&gt;
```

but&nbsp;<a href="https://github.com/microsoft/TypeScript/issues/42680" target="_blank" rel="noreferrer noopener">it wouldn't work as we might expect</a>. In fact, the resulting type would only contain the common properties, but not the ones they don't share. A possible workaround is to define a special Omit-like function to deal with such situations:

```ts
// Define special omit for unions
type UnionOmit&lt;T, K extends string | number | symbol&gt; = T extends unknown ? Omit&lt;T, K&gt; : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit&lt;Entry, 'id'&gt;;
```

Now we are ready to put the finishing touches on the app!

<div class="tasks">

**25. Patientor, step 3**

</div>

<div class="tasks">

**26. Patientor, step 4**

</div>

<div class="tasks">

**27. Patientor, step 5**

</div>

<div class="tasks">

**28. Patientor, step 6**

</div>

<div class="tasks">

**29. Patientor, step 7**

</div>

<div class="tasks">

**30. Patientor, step 8**

</div>

<div class="tasks">

**31. Patientor, step 9**

</div>

<div class="tasks">

**32. Patientor, step 10**

</div>

<div class="tasks">

**33. Patientor, the final check**

</div>

<div class="tasks">

**34. Your GitHub repository**

</div>
