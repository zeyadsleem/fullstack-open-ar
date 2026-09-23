<script>
  import { chapterPath, loadPartIntro, partPath } from '$lib/content.js';
  import { withBase } from '$lib/html.js';

  let { data } = $props();

  const introPromise = loadPartIntro(data.part.part);
</script>

<svelte:head>
  <title>الجزء {data.part.part} - {data.part.title} | Full Stack open</title>
  <meta name="description" content={data.part.description} />
</svelte:head>

<section class="part-hero" style={`background:${data.part.color}22`}>
  <div class="container">
    <span class="part-hero__badge" style={`background:${data.part.color}`}
      >الجزء {data.part.part}</span
    >
    <h1 class="part-hero__title">{data.part.title}</h1>
    <p class="page__lead">{data.part.description}</p>
  </div>
</section>

<div class="container">
  {#await introPromise}
    <p>جارٍ التحميل...</p>
  {:then intro}
    {#if intro}
      <div class="course-content">{@html withBase(intro.html)}</div>
    {/if}
  {/await}

  <h2 class="section-title">فصول الجزء</h2>
  <ul class="chapter-list">
    {#each data.part.chapters as chapter}
      <li>
        <a href={chapterPath(data.part.part, chapter)}>
          <span class="chapter-list__letter">{chapter.letter}</span>
          <span>{chapter.title}</span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="prev-next">
    {#if data.prevPart}
      <a href={partPath(data.prevPart.part)} class="prev">
        <span class="prev-next__label">الجزء السابق</span>
        <span class="prev-next__title">{data.prevPart.title}</span>
      </a>
    {/if}
    {#if data.nextPart}
      <a href={partPath(data.nextPart.part)} class="next">
        <span class="prev-next__label">الجزء التالي</span>
        <span class="prev-next__title">{data.nextPart.title}</span>
      </a>
    {/if}
  </div>
</div>
