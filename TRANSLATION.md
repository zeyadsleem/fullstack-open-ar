# دليل ترجمة Full Stack open إلى العربية

هذا الدليل إلزامي لكل من يترجم محتوى الدورة. الهدف: ترجمة عربية كاملة، دقيقة،
طبيعية، تحافظ على بنية الملفات الأصلية حرفياً.

## القواعد الذهبية

1. **ترجم كل نص ظاهر**: العناوين، الفقرات، عناصر القوائم، خلايا الجداول،
   نص الروابط، النصوص البديلة للصور (alt)، التلميحات، والاقتباسات.
2. **لا تترجم ولا تغيّر إطلاقاً**:
   - أسماء الوسوم والخصائص في HTML: `div`, `class`, `href`, `src`, `target`, `rel`, `id`...
   - قيم الخصائص: `class="content"`, `class="tasks"`, `class="intro"`, `class="note"`.
   - الشيفرة داخل ` ``` ` (مع استثناء وحيد: التعليقات داخل الشيفرة تُترجم).
   - أسماء المتغيرات والدوال والمكتبات والأوامر وأسماء الملفات والمسارات.
   - روابط URL نفسها (عدا تحويل الروابط الداخلية كما في القسم أدناه).
   - صيغة Markdown نفسها (`#`, `-`, `**`, `>`, `[]()`, `![]()`).
3. **أبقِ أسماء التقنيات باللاتينية**: React, Redux, Node.js, Express, MongoDB,
   GraphQL, TypeScript, JavaScript, HTML, CSS, JSX, npm, Git, GitHub, Docker,
   Vite, Webpack, ESLint, Jest, Cypress, Playwright, Next.js, Zustand,
   TanStack Query, Sequelize, PostgreSQL, SQLite, REST, API, CI/CD.
4. **أسلوب عربي فصيح واضح** بضمير المخاطب «أنت»، ونبرة تعليمية ودودة.
5. **المصطلحات المتكررة**:
   - component = مكوّن | components = مكوّنات
   - state = الحالة | props = props (تبقى) | hook = خطاف | hooks = الخطافات
   - reducer = reducer (تبقى) | store = store (تبقى) | action = action (تبقى)
   - render = عرض | rendering = العرض
   - server = الخادم | client = العميل | browser = المتصفح
   - frontend = الواجهة الأمامية | backend = الواجهة الخلفية
   - database = قاعدة البيانات | query = استعلام | mutation = mutation (تبقى)
   - request = طلب | response = استجابة | endpoint = نقطة نهاية
   - middleware = الوسيط | route = مسار | router = الموجّه
   - test = اختبار | testing = الاختبار | debugging = تصحيح الأخطاء
   - deploy = نشر | deployment = النشر | build = بناء | bundle = حزمة
   - container = حاوية | image = صورة | dependency = اعتمادية | package = حزمة
   - function = دالة | variable = متغير | array = مصفوفة | object = كائن
   - string = نص | number = عدد | boolean = قيمة منطقية | error = خطأ
   - warning = تحذير | event = حدث | handler = معالج | form = نموذج
   - input = حقل إدخال | button = زر | link = رابط | cache = الذاكرة المؤقتة
   - schema = المخطط | migration = الترحيل | seed = بيانات أولية
   - source code = الشيفرة المصدرية | code = شيفرة
   - branch = فرع | commit = commit (تبقى) | merge = دمج
6. **عند أول ذكر لمصطلح تقني مهم** يمكن وضع الأصل الإنجليزي بين قوسين:
   «الخطافات (hooks)». لا تُكثر من ذلك.
7. **لا إيموجي**، ولا إضافات أو حذف للمحتوى. الترجمة أمينة للمصدر.
8. حافظ على الأسطر الفارغة والبنية العامة كما هي؛ لا يهم التطابق سطراً بسطر
   لكن يجب أن يبقى هيكل Markdown/HTML صالحاً تماماً.

## تحويل الروابط الداخلية

- `https://fullstackopen.com/en/partX/...` و `/en/partX/...`:
  - احذف البادئة `https://fullstackopen.com` و`/en`.
  - إذا كان المسار `/partX` أو `/partX/<slug>` وكان `<slug>` من قائمة الـ slugs
    المعتمدة في `content/navigation.json` للجزء X، فأبقِه كما هو بعد الحذف.
  - إذا لم يكن الـ slug معتمداً (روابط قديمة)، استبدله بجذر الجزء `/partX`.
  - أمثلة: `/en/part0/general_info` → `/part0/general_info`،
    `/en/part6/flux_architecture_and_redux` → `/part6/flux_architecture_and_zustand`،
    `/en/part9/typing_an_express_app` → `/part9/typing_an_express_app`.
- صفحات الموقع: `/en/about` → `/about`، `/en/faq` → `/faq`،
  `/en/companies` → `/companies`، `/en/challenge` → `/challenge`،
  `/en/search` → `/search`، `/en/` → `/`.
- الروابط الخارجية (mooc.fi، Wikipedia، MDN، react.dev...) تبقى كما هي.
- أبقِ `#anchors` في نهاية الروابط إن وُجدت.

## الواجهة الأمامية (frontmatter)

- غيّر `lang: en` إلى `lang: ar`.
- غيّر `mainImage: ../../../images/part-X.svg` إلى `mainImage: /images/part-X.svg`.
- لا تغيّر أي مفتاح آخر (`part`, `letter`).

## مسارات الإخراج

- ملفات المستودع (الأجزاء 0-5): من `content-src/repo/<part>/<file>.md`
  إلى `content/<part>/<file>.md` (الاسم نفسه).
- ملفات mooc.fi (الأجزاء 6-14): من `content-src/en/part-<part>/<file>.md`
  إلى `content/<part>/<file>.md` (الاسم نفسه).

## قائمة الـ slugs المعتمدة

الجزء 0: general_info, fundamentals_of_web_apps
الجزء 1: introduction_to_react, java_script, component_state_event_handlers,
a_more_complex_state_debugging_react_apps
الجزء 2: rendering_a_collection_modules, forms, getting_data_from_server,
altering_data_in_server, adding_styles_to_react_app
الجزء 3: node_js_and_express, deploying_app_to_internet, saving_data_to_mongo_db,
validation_and_es_lint
الجزء 4: structure_of_backend_application_introduction_to_testing,
testing_the_backend, user_administration, token_authentication
الجزء 5: login_in_frontend, props_children_and_component_refs,
testing_react_apps, end_to_end_testing, react_router_ui_frameworks
الجزء 6: getting_started, flux_architecture_and_zustand,
complex_state_fetch_testing, react_query_context_api
الجزء 7: getting_started, more_about_react_hooks, vite_internals_and_esbuild,
miscellaneous, exercises_extending_the_bloglist
الجزء 8: getting_started, graphql_server, react_and_graphql,
database_and_user_administration, login_and_updating_the_cache,
fragments_and_subscriptions
الجزء 9: getting_started, background_and_introduction,
first_steps_with_typescript, typing_an_express_app, react_with_types,
grande_finale_patientor
الجزء 10: getting_started, introduction_to_react_native, react_native_basics,
communicating_with_server, testing_and_extending_our_application
الجزء 11: getting_started, introduction_to_ci_cd,
getting_started_with_github_actions, deployment, keeping_green,
expanding_further
الجزء 12: getting_started, introduction_to_containers,
building_and_configuring_environments, basics_of_container_orchestration
الجزء 13: getting_started, using_relational_databases_with_sequelize,
join_tables_and_queries, migrations_many_to_many_relationships
الجزء 14: getting_started, from_spa_to_server_side_rendering,
databases_migrations_and_relations, authentication_and_more

## ملاحظة عن الملفات الكبيرة

إذا تجاوز الملف المصدر نحو 4000 كلمة، اكتب الترجمة على مرحلتين:
1. اكتب الجزء الأول في ملف الإخراج عبر `write`.
2. اكتب الجزء الثاني في ملف مؤقت `output.part2.md` عبر `write`، ثم نفّذ
   `cat output.part2.md >> output.md && rm output.part2.md` عبر bash.
لا تختصر ولا تحذف أي فقرة أبداً.
