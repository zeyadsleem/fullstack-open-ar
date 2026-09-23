<script>
  import { chapterPath, partPath } from '$lib/content.js';
  import { withBase } from '$lib/html.js';

  let { data } = $props();

  const { part, chapter, content, prev, next } = $derived(data);

  let activeId = $state('');

  $effect(() => {
    if (!content?.headings?.length) return;
    const elements = content.headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    const onScroll = () => {
      let current = elements[0]?.id || '';
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= 120) {
          current = el.id;
        }
      }
      activeId = current;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:head>
  <title>{chapter.title} - الجزء {part.part} | Full Stack open</title>
  <meta name="description" content={part.description} />
</svelte:head>

<div class="container">
  <div class="chapter-layout">
    <aside class="toc">
      <p class="toc__title">في هذه الصفحة</p>
      <ul>
        {#each content?.headings || [] as heading}
          <li class:toc__depth-3={heading.depth === 3}>
            <a
              href={`#${heading.id}`}
              class:active={activeId === heading.id}>{heading.text}</a
            >
          </li>
        {/each}
      </ul>
    </aside>

    <article>
      <div class="chapter-banner" style={`background:${part.color}`}></div>

      <div class="chapter-header">
        <p class="chapter-header__part">
          <a href={partPath(part.part)}>الجزء {part.part}: {part.title}</a>
        </p>
        <h1>{chapter.title}</h1>
      </div>

      <div class="course-content">
        {@html withBase(content?.html) || ''}
      </div>

      <div class="prev-next">
        {#if prev}
          <a class="prev" href={chapterPath(prev.part, prev.chapter)}>
            <span class="prev-next__label">الفصل السابق</span>
            <span class="prev-next__title">{prev.chapter.title}</span>
          </a>
        {:else}
          <a class="prev" href={partPath(part.part)}>
            <span class="prev-next__label">العودة</span>
            <span class="prev-next__title">فصول الجزء {part.part}</span>
          </a>
        {/if}
        {#if next}
          <a class="next" href={chapterPath(next.part, next.chapter)}>
            <span class="prev-next__label">الفصل التالي</span>
            <span class="prev-next__title">{next.chapter.title}</span>
          </a>
        {/if}
      </div>
    </article>
  </div>
</div>
