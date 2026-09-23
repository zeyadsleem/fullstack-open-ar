<script>
  import { withBasePath } from '$lib/html.js';
</script>

<svelte:head>
  <title>الصفحة غير موجودة | Full Stack open</title>
</svelte:head>

<div class="container page">
  <h1>404 - الصفحة غير موجودة</h1>
  <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
  <p><a class="button" href={withBasePath('/')}>العودة إلى الصفحة الرئيسية</a></p>
</div>
