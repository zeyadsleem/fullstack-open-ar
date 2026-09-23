<script>
  import { about, site } from '$lib/site.js';
  import { withBasePath } from '$lib/html.js';
  import { withBase } from '$lib/html.js';
</script>

<svelte:head>
  <title>عن الدورة | Full Stack open</title>
  <meta name="description" content={site.description} />
</svelte:head>

<div class="container page">
  <h1>عن الدورة</h1>
  <div class="course-content">
    {#each about.intro as paragraph}
      <p>{@html withBase(paragraph)}</p>
    {/each}
  </div>

  {#each about.info as section}
    <section>
      <h2>{section.title}</h2>
      {#each section.content as paragraph}
        <p>{@html withBase(paragraph)}</p>
      {/each}
    </section>
  {/each}

  <a class="button" href={withBasePath('/part0')}>ابدأ الدورة</a>
</div>
