<script>
  import searchIndex from '$lib/generated/search-index.json';
  import { chapterPath } from '$lib/content.js';

  let query = $state('');

  /**
   * @typedef {{ part: number, letter: string, title: string, slug: string, partTitle: string, text: string }} SearchChapter
   */

  /** @param {string} text */
  const normalize = (text) =>
    text
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .toLowerCase()
      .trim();

  const results = $derived.by(() => {
    const q = normalize(query);
    if (q.length < 2) return [];

    const terms = q.split(/\s+/).filter(Boolean);
    /** @type {{ chapter: SearchChapter, score: number }[]} */
    const scored = [];

    /** @type {SearchChapter[]} */
    const chapters = searchIndex.chapters;
    for (const chapter of chapters) {
      const haystack = `${normalize(chapter.title)} ${chapter.text}`;
      let score = 0;
      for (const term of terms) {
        const occurrences = haystack.split(term).length - 1;
        if (occurrences === 0) {
          score = 0;
          break;
        }
        score += occurrences;
        if (normalize(chapter.title).includes(term)) score += 10;
      }
      if (score > 0) {
        scored.push({ chapter, score });
      }
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 30);
  });

  /** @param {SearchChapter} chapter */
  const snippet = (chapter) => {
    const q = normalize(query);
    const text = chapter.text;
    const index = normalize(text).indexOf(q.split(/\s+/)[0]);
    if (index < 0) return text.slice(0, 220);
    const start = Math.max(0, index - 80);
    return text.slice(start, start + 260);
  };
</script>

<svelte:head>
  <title>البحث في المادة | Full Stack open</title>
</svelte:head>

<div class="container page">
  <h1>البحث في المادة</h1>

  <form class="search-form" onsubmit={(e) => e.preventDefault()}>
    <input
      type="search"
      placeholder="اكتب كلمة للبحث..."
      bind:value={query}
      aria-label="البحث في المادة"
    />
  </form>

  {#if query.length >= 2}
    <p>
      {results.length > 0
        ? `تم العثور على ${results.length} نتيجة`
        : 'لا توجد نتائج مطابقة'}
    </p>

    <div class="search-results">
      {#each results as result}
        <a
          class="search-result"
          href={chapterPath(result.chapter.part, result.chapter)}
        >
          <strong
            >الجزء {result.chapter.part}: {result.chapter.partTitle} —
            {result.chapter.title}</strong
          >
          <p>{snippet(result.chapter)}</p>
        </a>
      {/each}
    </div>
  {/if}
</div>
