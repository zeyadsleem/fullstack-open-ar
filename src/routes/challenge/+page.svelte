<script>
  import { challenge } from '$lib/site.js';
</script>

<svelte:head>
  <title>تحدّي Full Stack | Full Stack open</title>
  <meta
    name="description"
    content="جامعة هلسنكي وHouston Inc. تتشاركان لتحدّي المطوّرين والشركات على تعلّم تطوير Full Stack."
  />
</svelte:head>

<div class="container page">
  <h1>هذا هو تحدّي Full Stack</h1>
  <div class="course-content">
    {#each challenge.aboutContent as paragraph}
      <p>{paragraph}</p>
    {/each}
  </div>

  <h2 class="section-title">أيها الشركات، لبّوا النداء!</h2>
  <div class="course-content">
    {#each challenge.joinContent as paragraph}
      <p>{paragraph}</p>
    {/each}
  </div>

  <a
    class="button"
    target="_blank"
    rel="noopener noreferrer"
    href="mailto:matti.luukkainen@helsinki.fi">سجّل شركتك في التحدي</a
  >
</div>
