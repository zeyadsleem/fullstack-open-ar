---
mainImage: /images/part-5.svg
part: 5
letter: d
lang: ar
---

<div class="content">

حتى الآن اختبرنا الواجهة الخلفية ككل على مستوى API باستخدام اختبارات التكامل، واختبرنا بعض مكوّنات الواجهة الأمامية باستخدام اختبارات الوحدات.

بعد ذلك، سنتناول طريقة لاختبار [النظام ككل](https://en.wikipedia.org/wiki/System_testing) باستخدام اختبارات <i>من الطرف إلى الطرف</i> (E2E).

يمكننا إجراء اختبارات E2E لتطبيق ويب باستخدام متصفح ومكتبة اختبار. وتتوفر مكتبات متعددة. ومن الأمثلة عليها [Selenium](http://www.seleniumhq.org/) الذي يمكن استخدامه مع أي متصفح تقريباً.
ومن خيارات المتصفحات أيضاً ما يُسمى [المتصفحات بلا واجهة رسومية](https://en.wikipedia.org/wiki/Headless_browser)، وهي متصفحات بلا واجهة مستخدم رسومية. فمثلاً يمكن استخدام Chrome في الوضع بلا واجهة.

اختبارات E2E هي على الأرجح أكثر فئات الاختبارات فائدة لأنها تختبر النظام عبر الواجهة نفسها التي يستخدمها المستخدمون الحقيقيون.

لكن لها بعض العيوب أيضاً. فإعداد اختبارات E2E أصعب من اختبارات الوحدات أو التكامل. كما أنها تميل إلى البطء الشديد، وفي نظام كبير قد يستغرق تنفيذها دقائق أو حتى ساعات. وهذا سيئ أثناء التطوير، لأنه من المفيد أثناء كتابة الشيفرة أن تكون قادراً على تشغيل الاختبارات بأكبر قدر ممكن من التكرار تحسباً لحدوث [انحدارات](https://en.wikipedia.org/wiki/Regression_testing) في الشيفرة.

قد تكون اختبارات E2E أيضاً [متقلبة](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).
فقد تنجح بعض الاختبارات مرة وتفشل أخرى، حتى لو لم تتغير الشيفرة إطلاقاً.

ربما تكون أسهل مكتبتين لاختبار الطرف إلى الطرف في الوقت الحالي هما [Playwright](https://playwright.dev/) و[Cypress](https://www.cypress.io/).

من الإحصاءات على [npmtrends.com](https://npmtrends.com/cypress-vs-playwright) نرى أن Playwright تجاوزت Cypress في أعداد التنزيلات خلال عام 2024، ولا تزال شعبيتها تنمو:

![مقارنة cypress وplaywright على npm trends](../../images/5/pwc.webp)

استخدمت هذه الدورة Cypress لسنوات. أما الآن فخيارنا هو Playwright.


إذن [Playwright](https://playwright.dev/) وافد جديد إلى اختبارات الطرف إلى الطرف، وقد بدأت شعبيتها تنفجر نحو نهاية عام 2023. وPlaywright تكاد تكون على قدم المساواة مع Cypress من حيث سهولة الاستخدام. وتختلف المكتبتان قليلاً في طريقة عملهما. فـ Cypress مختلفة جذرياً عن معظم المكتبات المناسبة لاختبارات E2E، لأن اختبارات Cypress تُنفَّذ بالكامل داخل المتصفح. أما اختبارات Playwright فتُنفَّذ في عملية Node المتصلة بالمتصفح عبر واجهات برمجية.


لنستكشف Playwright الآن.

### تهيئة الاختبارات

خلافاً لاختبارات الواجهة الخلفية أو اختبارات الوحدات المُجراة على واجهة React الأمامية، لا يلزم أن تكون اختبارات الطرف إلى الطرف في مشروع npm نفسه الذي توجد فيه الشيفرة. لننشئ مشروعاً منفصلاً تماماً لاختبارات E2E بالأمر _npm init_. ثم ثبّت Playwright بتشغيل الأمر التالي في مجلد المشروع الجديد:

```js
npm init playwright@latest
```

سيسألك سكربت التثبيت بضعة أسئلة، أجب عنها كما يلي:

![الإجابة: javascript، tests، false، true](../../images/5/play0.webp)

لاحظ أنه عند تثبيت Playwright قد لا يدعم نظام تشغيلك جميع المتصفحات التي توفرها Playwright، وقد تظهر لك رسالة خطأ مثل التالية:
```
Webkit 18.0 (playwright build v2070) downloaded to /home/user/.cache/ms-playwright/webkit-2070
Playwright Host validation warning: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libicudata.so.66                                 ║
║     libicui18n.so.66                                 ║
║     libicuuc.so.66                                   ║
║     libjpeg.so.8                                     ║
║     libwebp.so.6                                     ║
║     libpcre.so.3                                     ║
║     libffi.so.7                                      ║
╚══════════════════════════════════════════════════════╝
```
إذا كان الأمر كذلك، يمكنك إما تحديد متصفحات معينة للاختبار بـ `--project=` في ملف _package.json_:

```js
    "test": "playwright test --project=chromium --project=firefox",
```

أو إزالة الإدخال الخاص بأي متصفحات مشكِلة من ملف _playwright.config.js_:
```js
  projects: [
    // ...
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},
    // ...
  ]
```

لنعرّف سكربت npm لتشغيل الاختبارات وتقارير الاختبار في _package.json_:

```js
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

أثناء التثبيت، تُطبع الرسالة التالية في الطرفية:

```
And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration
```

أي موقع بعض الاختبارات النموذجية للمشروع التي أنشأها التثبيت.

لنشغّل الاختبارات:

```bash
$ npm test

> notes-e2e@1.0.0 test
> playwright test


Running 6 tests using 5 workers
  6 passed (3.9s)

To open last HTML report run:

  npx playwright show-report
```

تنجح الاختبارات. ويمكن فتح تقرير اختبار أكثر تفصيلاً إما بالأمر الذي اقترحه الناتج، أو بسكربت npm الذي عرّفناه للتو:

```
npm run test:report
```

يمكن أيضاً تشغيل الاختبارات عبر الواجهة الرسومية بالأمر:

```
npm run test -- --ui
```

تبدو الاختبارات النموذجية في الملف tests/example.spec.js هكذا:

```js
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/'); // highlight-line

  // توقّع أن "يحتوي" العنوان على سلسلة فرعية.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // انقر على رابط البدء.
  await page.getByRole('link', { name: 'Get started' }).click();

  // يتوقع أن تحتوي الصفحة على عنوان فرعي باسم Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

يقول السطر الأول من دوال الاختبار إن الاختبارات تختبر الصفحة الموجودة على https://playwright.dev/.

### اختبار شيفرتنا

لنحذف الآن الاختبارات النموذجية ونبدأ باختبار تطبيقنا.

تفترض اختبارات Playwright أن النظام قيد الاختبار يعمل عند تنفيذ الاختبارات. وخلافاً مثلاً لاختبارات تكامل الواجهة الخلفية، <i>لا تشغّل</i> اختبارات Playwright النظام قيد الاختبار أثناء الاختبار.

لننشئ سكربت npm للـ<i>واجهة الخلفية</i> يتيح تشغيلها في وضع الاختبار، أي بحيث تأخذ <i>NODE\_ENV</i> القيمة <i>test</i>.

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test",
    "lint": "eslint .",
    // ...
    "start:test": "cross-env NODE_ENV=test node --watch index.js" // highlight-line
  },
  // ...
}
```

لنشغّل الواجهة الأمامية والخلفية، وننشئ أول ملف اختبار للتطبيق <code>tests/note\_app.spec.js</code>:

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
})
```

أولاً، يفتح الاختبار التطبيق بالدالة [page.goto](https://playwright.dev/docs/writing-tests#navigation). بعد ذلك يستخدم الدالة [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) للحصول على [محدِّد موقع](https://playwright.dev/docs/locators) (locator) يقابل العنصر الذي يوجد فيه النص <i>Notes</i>.

تضمن الدالة [toBeVisible](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible) أن العنصر المقابل للمحدِّد الموقع ظاهر في الصفحة.

أُجري التحقق الثاني دون استخدام المتغير المساعد.

يفشل الاختبار لأن سنة قديمة وردت في الاختبار. يفتح Playwright تقرير الاختبار في المتصفح، ويتضح أن Playwright نفّذ الاختبارات فعلاً بثلاثة متصفحات مختلفة: Chrome وFirefox وWebkit، أي محرك المتصفح الذي يستخدمه Safari:

![تقرير الاختبار يظهر فشل الاختبار في ثلاثة متصفحات مختلفة](../../images/5/play2.webp)

بالنقر على تقرير أحد المتصفحات، يمكننا رؤية رسالة خطأ أكثر تفصيلاً:

![رسالة خطأ الاختبار](../../images/5/play3a.webp)

في الصورة الكبيرة، من الجيد جداً بطبيعة الحال أن يجري الاختبار بجميع محركات المتصفحات الثلاثة الشائعة، لكن هذا بطيء، وعند تطوير الاختبارات من الأفضل على الأرجح تنفيذها أساساً بمتصفح واحد فقط. يمكنك تحديد محرك المتصفح المستخدم بوسيط سطر الأوامر:

```js
npm test -- --project chromium
```

لنصحّح الآن الاختبار بالسنة الصحيحة، ولنضف كتلة _describe_ إلى الاختبارات:

```js
const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {  // highlight-line
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })
})
```

قبل أن نمضي قدماً، لنجعل الاختبارات تفشل مرة أخرى. نلاحظ أن تنفيذ الاختبارات سريع جداً عندما تنجح، لكنه أبطأ بكثير إذا لم تنجح. والسبب في ذلك أن سياسة Playwright هي الانتظار للعناصر المبحوث عنها حتى [تُعرَض وتصبح جاهزة للتفاعل](https://playwright.dev/docs/actionability). وإذا لم يُعثر على العنصر، يُرفَع _TimeoutError_ ويفشل الاختبار. وينتظر Playwright العناصر افتراضياً 5 أو 30 ثانية [حسب الدوال المستخدمة في الاختبار](https://playwright.dev/docs/test-timeouts#introduction).

عند تطوير الاختبارات، قد يكون من الحكمة تقليل زمن الانتظار إلى بضع ثوانٍ. ووفقاً [للتوثيق](https://playwright.dev/docs/test-timeouts)، يمكن فعل ذلك بتغيير ملف _playwright.config.js_ كما يلي:

```js
export default defineConfig({
  // ...
  timeout: 3000, // highlight-line
  fullyParallel: false, // highlight-line
  workers: 1, // highlight-line
  // ...
})
```

أجرينا أيضاً تغييرين آخرين على الملف، حددنا فيهما أن [تُنفَّذ](https://playwright.dev/docs/test-parallel) جميع الاختبارات واحداً تلو الآخر. فمع الإعداد الافتراضي يحدث التنفيذ على التوازي، ولأن اختباراتنا تستخدم قاعدة بيانات، يسبب التنفيذ المتوازي مشكلات.

### الكتابة في النموذج

لنكتب اختباراً جديداً يحاول تسجيل الدخول إلى التطبيق. لنفترض أن مستخدماً مخزَّناً في قاعدة البيانات باسم المستخدم <i>mluukkai</i> وكلمة المرور <i>salainen</i>.

لنبدأ بفتح نموذج تسجيل الدخول.

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
  })
})
```

يستخدم الاختبار أولاً الدالة [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) لاسترجاع الزر بناءً على نصه. وتعيد الدالة [المحدِّد الموقع](https://playwright.dev/docs/api/class-locator) (Locator) المقابل لعنصر الزر. ويُنفَّذ الضغط على الزر باستخدام دالة المحدِّد الموقع [click](https://playwright.dev/docs/api/class-locator#locator-click).

عند تطوير الاختبارات، يمكنك استخدام [وضع واجهة المستخدم](https://playwright.dev/docs/test-ui-mode) في Playwright، أي نسخة واجهة المستخدم. لنشغّل الاختبارات في وضع واجهة المستخدم كما يلي:

```
npm test -- --ui
```

نرى الآن أن الاختبار يعثر على الزر

![واجهة Playwright تعرض تطبيق الملاحظات أثناء اختباره](../../images/5/play4.webp)

بعد النقر، سيظهر النموذج

![واجهة Playwright تعرض نموذج تسجيل الدخول في تطبيق الملاحظات](../../images/5/play5.webp)

عند فتح النموذج، ينبغي أن يبحث الاختبار عن حقول النص ويدخل اسم المستخدم وكلمة المرور فيها. لنقم بالمحاولة الأولى باستخدام الدالة [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role):

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('textbox').fill('mluukkai')  // highlight-line
  })
})
```

ينتج عن ذلك خطأ:

```bash
Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
  1) <input value=""/> aka locator('div').filter({ hasText: /^username$/ }).getByRole('textbox')
  2) <input value="" type="password"/> aka locator('input[type="password"]')
```

المشكلة الآن أن _getByRole_ يجد حقلَي نص، ويفشل استدعاء الدالة [fill](https://playwright.dev/docs/api/class-locator#locator-fill) لأنه يفترض وجود حقل نص واحد فقط. ومن طرق التفاف حول المشكلة استخدام الدالتين [first](https://playwright.dev/docs/api/class-locator#locator-first) و[last](https://playwright.dev/docs/api/class-locator#locator-last):

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    // highlight-start
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    // highlight-end
  })
})
```

بعد الكتابة في حقلي النص، يضغط الاختبار على زر _login_ ويتحقق من أن التطبيق يعرض على الشاشة معلومات المستخدم المسجَّل دخوله.

لو كان هناك أكثر من حقلَي نص، لما كفت الدالتان _first_ و_last_. ومن الاحتمالات استخدام الدالة [all](https://playwright.dev/docs/api/class-locator#locator-all) التي تحوّل المحدِّدات الموقعة التي عُثر عليها إلى مصفوفة يمكن فهرستها:

```js
describe('Note app', () => {
  // ...
  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    // highlight-start
    const textboxes = await page.getByRole('textbox').all()

    await textboxes[0].fill('mluukkai')
    await textboxes[1].fill('salainen')
    // highlight-end

    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })  
})
```

تعمل هذه النسخة ونسخة الاختبار السابقة. لكن كلتيهما إشكالية إلى حد أنه إذا تغيّر نموذج التسجيل، فقد تتعطل الاختبارات لأنها تعتمد على وجود الحقول في الصفحة بترتيب معيّن.

إذا كان تحديد موقع عنصر صعباً في الاختبارات، يمكنك إسناده خاصية <i>test-id</i> مستقلة والعثور على العنصر في الاختبارات باستخدام الدالة [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id).

لنستفد الآن من العناصر الموجودة في نموذج تسجيل الدخول. فقد أُسندت إلى حقول إدخال نموذج تسجيل الدخول <i>تسميات</i> فريدة:

```js
// ...
<form onSubmit={handleSubmit}>
  <div>
    <label> // highlight-line
      username // highlight-line
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
      />
    </label> // highlight-line
  </div>
  <div>
    <label> // highlight-line
      password // highlight-line
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
    </label> // highlight-line
  </div>
  <button type="submit">login</button>
</form>
// ...
```

يمكن بل ينبغي تحديد موقع حقول الإدخال في الاختبارات باستخدام <i>التسميات</i> مع الدالة [getByLabel](https://playwright.dev/docs/api/class-page#page-get-by-label):

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai') // highlight-line
    await page.getByLabel('password').fill('salainen')  // highlight-line
  
    await page.getByRole('button', { name: 'login' }).click() 
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

عند تحديد مواقع العناصر، من المنطقي أن نسعى إلى الاستفادة من المحتوى الظاهر للمستخدم في الواجهة، لأن ذلك يحاكي على أفضل وجه كيفية عثور المستخدم فعلاً على حقل الإدخال المطلوب أثناء تنقله في التطبيق.

لاحظ أن نجاح الاختبار في هذه المرحلة يتطلب وجود مستخدم في قاعدة بيانات <i>الاختبار</i> في الواجهة الخلفية باسم المستخدم <i>mluukkai</i> وكلمة المرور <i>salainen</i>. أنشئ مستخدماً إذا لزم الأمر!

### تهيئة الاختبار

بما أن كلا الاختبارين يبدأ بالطريقة نفسها، أي بفتح الصفحة <i>http://localhost:5173</i>، يُستحسن عزل الجزء المشترك في كتلة <i>beforeEach</i> التي تُنفَّذ قبل كل اختبار:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // highlight-start
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })
  // highlight-end

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

### اختبار إنشاء ملاحظة

بعد ذلك، لننشئ اختباراً يضيف ملاحظة جديدة إلى التطبيق:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})
```

عُرِّف الاختبار في كتلة _describe_ خاصة به. ويتطلب إنشاء ملاحظة أن يكون المستخدم مسجَّلاً دخوله، وهذا ما تعالجه كتلة _beforeEach_.

يعتمد الاختبار على أنه عند إنشاء ملاحظة جديدة يوجد حقل إدخال واحد فقط في الصفحة، فيبحث عنه كما يلي:

```js
page.getByRole('textbox')
```

لو كان هناك حقول أكثر، لتعطّل الاختبار. ولهذا قد يكون من الأفضل إضافة <i>test-id</i> إلى حقل إدخال النموذج والبحث عنه في الاختبار بناءً على هذا المعرّف.

**ملاحظة:** لن ينجح الاختبار إلا في المرة الأولى. والسبب في ذلك أن توقعه

```js
await expect(page.getByText('a note created by playwright')).toBeVisible()
```

يسبب مشكلات عندما تُنشأ الملاحظة نفسها في التطبيق أكثر من مرة. وسنحل المشكلة في الفصل التالي.

يبدو هيكل الاختبارات هكذا:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ....

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })
})
```

بما أننا منعنا تشغيل الاختبارات على التوازي، يشغّل Playwright الاختبارات بالترتيب الذي تظهر به في شيفرة الاختبار. أي أنه يُنفَّذ أولاً الاختبار <i>user can log in</i> الذي يسجّل فيه المستخدم دخوله إلى التطبيق. بعد ذلك يُنفَّذ الاختبار <i>a new note can be created</i> الذي يقوم أيضاً بتسجيل الدخول في كتلة <i>beforeEach</i>. لماذا نفعل هذا، أليس المستخدم مسجَّلاً دخوله بالفعل بفضل الاختبار السابق؟ لا، لأن تنفيذ <i>كل</i> اختبار يبدأ من «الحالة الصفرية» للمتصفح، فتُصفَّر جميع التغييرات التي أجرتها الاختبارات السابقة على حالة المتصفح.

### التحكم في حالة قاعدة البيانات

إذا احتاجت الاختبارات إلى القدرة على تعديل قاعدة بيانات الخادم، تصبح الحالة أكثر تعقيداً فوراً. فالمثالي أن تكون قاعدة بيانات الخادم هي نفسها في كل مرة نشغّل فيها الاختبارات، حتى تكون اختباراتنا قابلة للتكرار بموثوقية وسهولة.

كما هو الحال مع اختبارات الوحدات والتكامل، من الأفضل في اختبارات E2E إفراغ قاعدة البيانات وربما تهيئتها قبل تشغيل الاختبارات. والتحدي في اختبارات E2E أنها لا تستطيع الوصول إلى قاعدة البيانات.

الحل هو إنشاء نقاط نهاية API لاختبارات الواجهة الخلفية.
يمكننا إفراغ قاعدة البيانات باستخدام نقاط النهاية هذه.
لننشئ موجّهاً جديداً للاختبارات داخل مجلد <i>controllers</i>، في ملف <i>testing.js</i>

```js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```

ونضيفه إلى الواجهة الخلفية فقط <i>إذا كان التطبيق يعمل في وضع الاختبار</i>:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

بعد التغييرات، يؤدي طلب HTTP POST إلى نقطة النهاية <i>/api/testing/reset</i> إلى إفراغ قاعدة البيانات. تأكد من أن واجهتك الخلفية تعمل في وضع الاختبار بتشغيلها بهذا الأمر (المُعدّ سابقاً في ملف package.json):

```js
  npm run start:test
```

يمكن العثور على شيفرة الواجهة الخلفية المعدّلة في فرع <i>part5-1</i> على [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1).

بعد ذلك، سنغيّر كتلة _beforeEach_ بحيث تفرغ قاعدة بيانات الخادم قبل تشغيل الاختبارات.

حالياً لا يمكن إضافة مستخدمين جدد عبر واجهة المستخدم في الواجهة الأمامية، لذا نضيف مستخدماً جديداً إلى الواجهة الخلفية من كتلة beforeEach.

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  
  test('front page can be opened',  () => {
    // ...
  })

  test('user can login', () => {
    // ...
  })

  describe('when logged in', () => {
    // ...
  })
})
```

أثناء التهيئة، يوجّه الاختبار طلبات HTTP إلى الواجهة الخلفية بالدالة [post](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post) الخاصة بالمعامل _request_.

خلافاً لما سبق، يبدأ اختبار الواجهة الخلفية الآن دائماً من الحالة نفسها، أي وجود مستخدم واحد ولا ملاحظات في قاعدة البيانات.

لننشئ اختباراً يتحقق من إمكانية تغيير أهمية الملاحظات.

هناك بضعة مقاربات مختلفة لإجراء الاختبار.

في ما يلي، نبحث أولاً عن ملاحظة وننقر على زرها الذي نصه <i>make not important</i>. بعد ذلك نتحقق من أن الملاحظة تحتوي على الزر <i>make important</i>.

```js
describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    // ...

    // highlight-start
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    // highlight-end
    })
  })
})
```

يبحث الأمر الأول أولاً عن المكوّن الذي يوجد فيه النص <i>another note by playwright</i> ثم عن الزر <i>make not important</i> بداخله وينقر عليه.

ويضمن الأمر الثاني أن نص الزر نفسه قد تغيّر إلى <i>make important</i>.

توجد الشيفرة الحالية للاختبارات على [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-1)، في فرع <i>part5-1</i>.

### اختبار فشل تسجيل الدخول

لنُجرِ الآن اختباراً يضمن فشل محاولة تسجيل الدخول إذا كانت كلمة المرور خاطئة.

تبدو النسخة الأولى من الاختبار هكذا:

```js
describe('Note app', () => {
  // ...

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong credentials')).toBeVisible()
  })

  // ...
})
```

يتحقق الاختبار بالدالة [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) من أن التطبيق يطبع رسالة خطأ.

يعرض التطبيق رسالة الخطأ في عنصر يحتوي على صنف CSS وهو <i>error</i>:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```

يمكننا تحسين الاختبار لضمان طباعة رسالة الخطأ في المكان الصحيح بالضبط، أي في العنصر الذي يحتوي على صنف CSS وهو <i>error</i>:

```js
test('login fails with wrong password', async ({ page }) => {
  // ...

  const errorDiv = page.locator('.error') // highlight-line
  await expect(errorDiv).toContainText('wrong credentials')
})
```

إذن يستخدم الاختبار الدالة [page.locator](https://playwright.dev/docs/api/class-page#page-locator) للعثور على المكوّن الذي يحتوي على صنف CSS وهو <i>error</i> ويخزّنه في متغير. ويمكن التحقق من صحة النص المرتبط بالمكوّن بالتوقع [toContainText](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text). لاحظ أن [محدِّد صنف CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) يبدأ بنقطة، لذا فإن محدِّد الصنف <i>error</i> هو <i> .error</i>.

يمكن اختبار أنماط CSS في التطبيق بالمطابق [toHaveCSS](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css). فيمكننا مثلاً التأكد من أن لون رسالة الخطأ أحمر، ومن وجود إطار حولها:

```js
test('login fails with wrong password', async ({ page }) => {
  // ...

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid') // highlight-line
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)') // highlight-line
})
```

يجب تعريف الألوان لـ Playwright برموز [rgb](https://rgbcolorcode.com/color/red).

لنُكمل الاختبار بحيث يضمن أيضاً أن التطبيق **لا يعرض** النص الذي يصف نجاح تسجيل الدخول <i>'Matti Luukkainen logged in'</i>:

```js
test('login fails with wrong password', async ({ page }) =>{
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

  await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible() // highlight-line
})
```

### تشغيل الاختبارات واحداً تلو الآخر

افتراضياً، يشغّل Playwright دائماً جميع الاختبارات، وبازدياد عدد الاختبارات يصبح ذلك مستهلكاً للوقت. عند تطوير اختبار جديد أو تصحيح اختبار معطوب، يمكن تعريف الاختبار بدلاً من الأمر <i>test</i> بالأمر <i>test.only</i>، وحينها سيشغّل Playwright ذلك الاختبار فقط:

```js
describe(() => {
  // هذا هو الاختبار الوحيد الذي سيُنفَّذ!
  test.only('login fails with wrong password', async ({ page }) => {  // highlight-line
    // ...
  })

  // هذا الاختبار يُتخطى...
  test('user can login with correct credentials', async ({ page }) => {
    // ...
  })

  // ...
})
```

عندما يصبح الاختبار جاهزاً، يمكن بل **يجب** حذف <i>only</i>.

ومن الخيارات الأخرى لتشغيل اختبار واحد استخدام وسيط سطر الأوامر:

```
npm test -- -g "login fails with wrong password"
```

### دوال مساعدة للاختبارات

تبدو اختبارات تطبيقنا حالياً هكذا:

```js 
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  test('user can login with correct credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) =>{
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      // ...
    })
  
    // ...
  })  
})
```

أولاً تُختبر دالة تسجيل الدخول. بعد ذلك تحتوي كتلة _describe_ أخرى على مجموعة اختبارات تفترض أن المستخدم مسجَّل دخوله، ويُعالَج تسجيل الدخول داخل كتلة التهيئة _beforeEach_.

كما ذُكر سابقاً، يُنفَّذ كل اختبار بدءاً من الحالة الأولية (حيث تُفرَّغ قاعدة البيانات ويُنشأ فيها مستخدم واحد)، لذا حتى لو عُرِّف الاختبار بعد اختبار آخر في الشيفرة، فإنه لا يبدأ من الحالة نفسها التي تركتها الاختبارات المنفَّذة سابقاً في الشيفرة!

من الجدير أيضاً السعي إلى عدم تكرار الشيفرة في الاختبارات. لنعزل الشيفرة التي تعالج تسجيل الدخول في دالة مساعدة توضع مثلاً في الملف _tests/helper.js_:

```js 
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }
```

تصبح الاختبارات أبسط وأوضح:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper') // highlight-line

describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong') // highlight-line

    const errorDiv = page.locator('.error')
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    })

    // ...
  })
})
```

تقدم Playwright أيضاً [حلاً](https://playwright.dev/docs/auth) يُنفَّذ فيه تسجيل الدخول مرة واحدة قبل الاختبارات، ويبدأ كل اختبار من حالة يكون فيها التطبيق مسجَّلاً دخوله بالفعل. ولكي نستفيد من هذه الطريقة، ينبغي أن تكون تهيئة بيانات اختبار التطبيق مختلفة قليلاً عما هي عليه الآن. ففي الحل الحالي تُصفَّر قاعدة البيانات قبل كل اختبار، ولهذا يستحيل تسجيل الدخول مرة واحدة فقط قبل الاختبارات. ولكي نستخدم تسجيل الدخول المسبق الذي توفره Playwright، ينبغي تهيئة المستخدم مرة واحدة فقط قبل الاختبارات. ونلتزم بحلنا الحالي من أجل البساطة.

تنطبق الشيفرة المتكررة المقابلة فعلاً أيضاً على إنشاء ملاحظة جديدة. فهناك اختبار ينشئ ملاحظة باستخدام نموذج. وكذلك في كتلة التهيئة _beforeEach_ للاختبار الذي يختبر تغيير أهمية الملاحظة، تُنشأ ملاحظة باستخدام النموذج:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', () => {
    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })
  
      test('it can be made important', async ({ page }) => {
        // ...
      })
    })
  })
})
```

عُزل إنشاء الملاحظة أيضاً في دالة مساعدة خاصة به. ويتوسّع ملف _tests/helper.js_ كما يلي:

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

// highlight-start
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
}
// highlight-end

export { loginWith, createNote } // highlight-line
```

تُبسَّط الاختبارات كما يلي:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createNote, loginWith } = require('./helper') // highlight-line

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright') // highlight-line
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright') // highlight-line
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

هناك سمة مزعجة أخرى في اختباراتنا. فعنوان الواجهة الأمامية <i>http:localhost:5173</i> وعنوان الواجهة الخلفية <i>http:localhost:3001</i> مكتوبان مباشرة في الاختبارات. ومن هذين، عنوان الواجهة الخلفية غير مفيد فعلاً، لأن وكيلاً (proxy) قد عُرِّف في إعدادات Vite للواجهة الأمامية، وهو يمرر جميع الطلبات التي تجريها الواجهة الأمامية إلى العنوان <i>http:localhost:5173/api</i> إلى الواجهة الخلفية:

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  // ...
})
```

لذا يمكننا استبدال جميع العناوين في الاختبارات من _http://localhost:3001/api/..._ إلى _http://localhost:5173/api/..._

يمكننا الآن تعريف _baseUrl_ للتطبيق في ملف إعدادات الاختبارات <i>playwright.config.js</i>:

```js
export default defineConfig({
  // ...
  use: {
    baseURL: 'http://localhost:5173',
    // ...
  },
  // ...
})
```

جميع الأوامر في الاختبارات التي تستخدم عنوان url للتطبيق، مثل

```js
await page.goto('http://localhost:5173')
await request.post('http://localhost:5173/api/testing/reset')
```

يمكن الآن تحويلها إلى:

```js
await page.goto('/')
await request.post('/api/testing/reset')
```

توجد الشيفرة الحالية للاختبارات على [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-2)، في فرع <i>part5-2</i>.

### إعادة النظر في تغيير أهمية الملاحظة

لنلقِ نظرة على الاختبار الذي أجريناه سابقاً، والذي يتحقق من إمكانية تغيير أهمية ملاحظة.

لنغيّر كتلة تهيئة الاختبار بحيث تنشئ ملاحظتين بدلاً من واحدة:

```js
describe('when logged in', () => {
  // ...
  describe('and several notes exists', () => { // highlight-line
    beforeEach(async ({ page }) => {
      // highlight-start
      await createNote(page, 'first note')
      await createNote(page, 'second note')
      // highlight-end
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      const otherNoteElement = page.getByText('first note')

      await otherNoteElement
        .getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
})
```

يبحث الاختبار أولاً عن العنصر المقابل للملاحظة الأولى المنشأة بالدالة _page.getByText_ ويخزّنه في متغير. بعد ذلك يُبحث داخل العنصر عن زر نصه _make not important_ ويُضغط عليه. وأخيراً يتحقق الاختبار من أن نص الزر قد تغيّر إلى _make important_.

كان يمكن أيضاً كتابة الاختبار دون المتغير المساعد:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  page.getByText('first note')
    .getByRole('button', { name: 'make not important' }).click()

  await expect(page.getByText('first note').getByText('make important'))
    .toBeVisible()
})
```

لنغيّر مكوّن _Note_ بحيث يُعرَض نص الملاحظة داخل عنصر _span_

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

تتعطل الاختبارات! والسبب في المشكلة أن الأمر _page.getByText('first note')_ يعيد الآن عنصر _span_ يحتوي على النص فقط، والزر خارج عنه.

ومن طرق إصلاح المشكلة ما يلي:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const otherNoteText = page.getByText('first note') // highlight-line
  const otherNoteElement = otherNoteText.locator('..') // highlight-line

  await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(otherNoteElement.getByText('make important')).toBeVisible()
})
```

يبحث السطر الأول الآن عن عنصر _span_ الذي يحتوي على النص المرتبط بالملاحظة الأولى المنشأة. وفي السطر الثاني تُستخدم الدالة _locator_ ويُمرَّر _.._ كوسيط، وهو يسترجع العنصر الأب للعنصر. ودالة المحدِّد الموقع مرنة جداً، ونستفيد من كونها تقبل [كوسيط](https://playwright.dev/docs/locators#locate-by-css-or-xpath) ليس محددات CSS فقط بل محدد [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) أيضاً. وكان يمكن التعبير عن الأمر نفسه بـ CSS، لكن XPath يوفر في هذه الحالة أبسط طريقة للعثور على العنصر الأب لعنصر.

يمكن بطبيعة الحال كتابة الاختبار باستخدام متغير مساعد واحد فقط:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const secondNoteElement = page.getByText('second note').locator('..')
  await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(secondNoteElement.getByText('make important')).toBeVisible()
})
```

لنغيّر الاختبار بحيث تُنشأ ثلاث ملاحظات، وتُغيَّر الأهمية في الملاحظة الثانية المنشأة:

```js
describe('when logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new note can be created', async ({ page }) => {
    await createNote(page, 'a note created by playwright', true)
    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })

  describe('and several notes exists', () => {
    beforeEach(async ({ page }) => {
      await createNote(page, 'first note')
      await createNote(page, 'second note')
      await createNote(page, 'third note') // highlight-line
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      const otherNoteText = page.getByText('second note') // highlight-line
      const otherNoteElement = otherNoteText.locator('..')
    
      await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
}) 
```

لسبب ما يبدأ الاختبار بالعمل بشكل غير موثوق، فينجح أحياناً ويفشل أحياناً. حان وقت أن نشمّر عن سواعدنا ونتعلم كيفية تصحيح أخطاء الاختبارات.

### تطوير الاختبارات وتصحيح الأخطاء

إذا لم تنجح الاختبارات وشككت في أن العيب في الاختبارات لا في الشيفرة، ينبغي أن تشغّل الاختبارات في وضع [التصحيح](https://playwright.dev/docs/debug#run-in-debug-mode-1) (debug).

يشغّل الأمر التالي الاختبار المشكِل في وضع التصحيح:

```
npm test -- -g'one of those can be made nonimportant' --debug
```

يعرض مفتّش Playwright (inspector) تقدم الاختبارات خطوة بخطوة. وزر السهم/النقطة في الأعلى ينقل الاختبارات خطوة إلى الأمام. وتُعرض في المتصفح العناصر التي عثرت عليها المحدِّدات الموقعة والتفاعل مع المتصفح:

![مفتّش Playwright يبرز العنصر الذي عثر عليه المحدِّد الموقع المحدد في التطبيق](../../images/5/play6a.webp)

افتراضياً، يتنقل وضع التصحيح عبر الاختبار أمراً بأمر. وإذا كان الاختبار معقداً، فقد يكون التنقل عبره حتى نقطة الاهتمام عبئاً كبيراً. ويمكن تجنّب ذلك باستخدام الأمر _await page.pause()_:

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause() // highlight-line
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

الآن يمكنك في الاختبار الانتقال إلى _page.pause()_ بخطوة واحدة، بالضغط على رمز السهم الأخضر في المفتّش.

عندما نشغّل الاختبار الآن وننتقل إلى الأمر _page.pause()_، نكتشف حقيقة مثيرة للاهتمام:

![مفتّش Playwright يعرض حالة التطبيق عند page.pause](../../images/5/play6b.webp)

يبدو أن المتصفح <i>لا يعرض</i> جميع الملاحظات المنشأة في كتلة _beforeEach_. فما المشكلة؟

السبب في المشكلة أن الاختبار عندما ينشئ ملاحظة، يبدأ بإنشاء التالية حتى قبل أن يستجيب الخادم، وتُعرَض الملاحظة المضافة على الشاشة. وهذا بدوره قد يؤدي إلى فقدان بعض الملاحظات (في الصورة، حدث ذلك للملاحظة الثانية المنشأة)، لأن المتصفح يُعاد عرضه عند استجابة الخادم بناءً على حالة الملاحظات في بداية عملية الإدراج تلك.

يمكن حل المشكلة بـ«إبطاء» عمليات الإدراج باستخدام الأمر [waitFor](https://playwright.dev/docs/api/class-locator#locator-wait-for) بعد الإدراج للانتظار حتى تُعرَض الملاحظة المُدرَجة:

```js
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor() // highlight-line
}
```

بدلاً من وضع التصحيح أو إلى جانبه، قد يكون تشغيل الاختبارات في وضع واجهة المستخدم مفيداً. وكما ذُكر سابقاً، تُشغَّل الاختبارات في وضع واجهة المستخدم كما يلي:

```
npm run test -- --ui
```

يشبه استخدام [عارض التتبع](https://playwright.dev/docs/trace-viewer-intro) (Trace Viewer) في Playwright وضعَ واجهة المستخدم تقريباً. والفكرة أن يُحفظ «تتبع مرئي» للاختبارات، يمكن عرضه عند الحاجة بعد اكتمال الاختبارات. ويُحفظ التتبع بتشغيل الاختبارات كما يلي:

```
npm run test -- --trace on
```

وعند الحاجة، يمكن عرض التتبع بالأمر

```
npx playwright show-report
```

أو بسكربت npm الذي عرّفناه _npm run test:report_

يبدو التتبع عملياً مثل تشغيل الاختبارات في وضع واجهة المستخدم.

يوفر وضع واجهة المستخدم وعارض التتبع أيضاً إمكانية البحث المدعوم عن المحدِّدات الموقعة. ويُفعل ذلك بالضغط على الدائرة المزدوجة على الجانب الأيسر من الشريط السفلي، ثم بالنقر على عنصر واجهة المستخدم المطلوب. فيعرض Playwright محدد موقع العنصر:

![عارض التتبع في Playwright مع أسهم حمراء تشير إلى موضع البحث المدعوم عن المحدِّد الموقع وإلى العنصر المحدد به مع عرض محدد موقع مقترح للعنصر](../../images/5/play8.webp)

يقترح Playwright ما يلي كمحدد موقع للملاحظة الثالثة

```js
page.locator('li').filter({ hasText: 'third note' }).getByRole('button')
```

تُستدعى الدالة [page.locator](https://playwright.dev/docs/api/class-page#page-locator) بالوسيط _li_، أي نبحث عن جميع عناصر li في الصفحة، وعددها ثلاثة إجمالاً. بعد ذلك، باستخدام دالة [locator.filter](https://playwright.dev/docs/api/class-locator#locator-filter)، نضيّق النطاق إلى عنصر li الذي يحتوي على النص <i>third note</i>، ويُؤخذ عنصر الزر بداخله باستخدام دالة [locator.getByRole](https://playwright.dev/docs/api/class-locator#locator-get-by-role).

يختلف المحدِّد الموقع الذي يولّده Playwright بعض الشيء عن المحدِّد الموقع الذي استخدمته اختباراتنا، وهو

```js
page.getByText('first note').locator('..').getByRole('button', { name: 'make not important' })
```

أي المحدِّدين الموقعين أفضل هو على الأرجح مسألة ذوق.

تتضمن Playwright أيضاً [مولّد اختبارات](https://playwright.dev/docs/codegen-intro) يتيح «تسجيل» اختبار عبر واجهة المستخدم. ويُشغَّل مولّد الاختبارات بالأمر:

```
npx playwright codegen http://localhost:5173/
```

عند تفعيل وضع _Record_، «يسجّل» مولّد الاختبارات تفاعل المستخدم في مفتّش Playwright، حيث يمكن نسخ المحدِّدات الموقعة والإجراءات إلى الاختبارات:

![وضع التسجيل في Playwright مفعّلاً مع ناتجه في المفتّش بعد تفاعل المستخدم](../../images/5/play9.webp)

بدلاً من سطر الأوامر، يمكن أيضاً استخدام Playwright عبر إضافة [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). وتوفر الإضافة ميزات مريحة عديدة، مثل استخدام نقاط التوقف عند تصحيح أخطاء الاختبارات.

لتجنّب المواقف الإشكالية وزيادة الفهم، يجدر بالتأكيد تصفح [توثيق](https://playwright.dev/docs/intro) Playwright عالي الجودة. والأقسام الأهم مذكورة أدناه:
- قسم [المحدِّدات الموقعة](https://playwright.dev/docs/locators) يقدم تلميحات جيدة للعثور على العناصر في الاختبار
- قسم [الإجراءات](https://playwright.dev/docs/input) يشرح كيف يمكن محاكاة التفاعل مع المتصفح في الاختبارات
- قسم [التوقعات](https://playwright.dev/docs/test-assertions) يعرض مختلف التوقعات التي توفرها Playwright للاختبار

يمكن العثور على تفاصيل أعمق في وصف [API](https://playwright.dev/docs/api/class-playwright)، ومن المفيد بشكل خاص صنف [Page](https://playwright.dev/docs/api/class-page) المقابل لنافذة المتصفح للتطبيق قيد الاختبار، وصنف [Locator](https://playwright.dev/docs/api/class-locator) المقابل للعناصر المبحوث عنها في الاختبارات.

توجد النسخة النهائية للاختبارات كاملة على [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-3)، في فرع <i>part5-3</i>.

توجد النسخة النهائية لشيفرة الواجهة الأمامية بكاملها على [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9)، في فرع <i>part5-9</i>.

</div>

<div class="tasks">

### تمارين 5.17.-5.23.

في التمارين الأخيرة من هذا الجزء، لنُجرِ بعض اختبارات E2E لتطبيق المدونات. وينبغي أن تكفي المادة أعلاه لإنجاز معظم التمارين. غير أنه يجدر بك بالتأكيد قراءة [توثيق](https://playwright.dev/docs/intro) Playwright و[وصف API](https://playwright.dev/docs/api/class-playwright)، على الأقل الأقسام المذكورة في نهاية الفصل السابق.

#### 5.17: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 1

أنشئ مشروع npm جديداً للاختبارات وهيئ Playwright فيه.

اكتب اختباراً يضمن أن التطبيق يعرض نموذج تسجيل الدخول افتراضياً.

ينبغي أن يكون جسم الاختبار كما يلي:

```js 
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })
})

```

#### 5.18: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 2

اكتب اختبارات تسجيل الدخول. اختبر تسجيل الدخول الناجح والفاشل معاً. وللاختبارات، أنشئ مستخدماً في كتلة _beforeEach_.

يتوسّع جسم الاختبارات كما يلي

```js 
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // أفرغ قاعدة البيانات هنا
    // أنشئ مستخدماً للواجهة الخلفية هنا
    // ...
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
    })
  })
})
```

يجب أن تفرّغ كتلة _beforeEach_ قاعدة البيانات باستخدام مثلاً طريقة reset التي استخدمناها في [المادة](/part5#controlling-the-state-of-the-database).

#### 5.19: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 3

أنشئ اختباراً يتحقق من أن مستخدماً مسجَّل دخوله يمكنه إنشاء مدونة. وقد يبدو جسم الاختبار كما يلي

```js 
describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // ...
  })

  test('a new blog can be created', async ({ page }) => {
    // ...
  })
})
```

ينبغي أن يضمن الاختبار ظهور المدونة المنشأة في قائمة المدونات.

#### 5.20: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 4

اكتب اختباراً يتأكد من إمكانية الإعجاب بالمدونة.

#### 5.21: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 5

اكتب اختباراً يضمن أن المستخدم الذي أضاف المدونة يمكنه حذف المدونة. وإذا كنت تستخدم حوار _window.confirm_ في عملية الحذف، فقد تحتاج إلى البحث في Google عن كيفية استخدام الحوار في اختبارات Playwright.

#### 5.22: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 6

اكتب اختباراً يضمن أن المستخدم الذي أضاف المدونة وحده يرى زر حذف المدونة.

#### 5.23: اختبار قائمة المدونات من الطرف إلى الطرف، الخطوة 7

اكتب اختباراً يضمن ترتيب المدونات حسب الإعجابات، فالمدونة الأكثر إعجابات أولاً.

<i>هذا التمرين أصعب بكثير من التمارين السابقة.</i>

</div>
