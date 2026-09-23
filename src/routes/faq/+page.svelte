<script>
  import { faq } from '$lib/site.js';
  import { withBase } from '$lib/html.js';
</script>

<svelte:head>
  <title>الأسئلة الشائعة | Full Stack open</title>
  <meta name="description" content="الأسئلة الشائعة حول دورة Full Stack open" />
</svelte:head>

<div class="container page">
  <h1>الأسئلة الشائعة</h1>
  {#each faq as item}
    <details class="faq-item">
      <summary>{item.title}</summary>
      <div class="faq-item__body">
        {#each item.text as paragraph}
          <p>{@html withBase(paragraph)}</p>
        {/each}
      </div>
    </details>
  {/each}
</div>
