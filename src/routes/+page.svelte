<script>
  import { home, partnerLogos } from '$lib/site.js';
  import { parts, partPath } from '$lib/content.js';
  import { withBase, withBasePath } from '$lib/html.js';
</script>

<svelte:head>
  <title>Full Stack open - دورة تطوير الويب الحديثة بالعربية</title>
  <meta
    name="description"
    content="دورة Full Stack open كاملة باللغة العربية: React وNode.js وMongoDB وGraphQL وTypeScript وغيرها."
  />
</svelte:head>

<section class="hero">
  <div class="container">
    <h1 class="hero__title">{home.mainTitle}</h1>
    <p class="hero__intro">{home.intro}</p>
    <div class="hero__actions">
      <a class="button" href={withBasePath('/about')}>ابدأ الدورة</a>
      <a class="button button--outline" href={partPath(0)}>اقرأ الجزء 0</a>
    </div>
  </div>
</section>

<div class="container">
  <section class="parts-section" id="parts">
    <h2 class="section-title">محتويات الدورة</h2>
    <div class="parts-grid">
      {#each parts as part}
        <a class="part-card" href={partPath(part.part)}>
          <div class="part-card__header">
            <span
              class="part-card__number"
              style={`background:${part.color}`}>{part.part}</span
            >
            <h3 class="part-card__title">{part.title}</h3>
          </div>
          <p class="part-card__description">{part.description}</p>
          <p class="part-card__meta">{part.chapters.length} فصول</p>
        </a>
      {/each}
    </div>
  </section>

  <section class="announcements">
    <h2 class="section-title">إعلانات</h2>
    <ul>
      {#each home.announcements as item}
        <li>{@html withBase(item)}</li>
      {/each}
    </ul>
  </section>

  <section class="announcements">
    <h2 class="section-title">المؤلفون والترخيص</h2>
    <p>{@html withBase(home.authors)}</p>
    <p>{@html withBase(home.licensed)}</p>
  </section>

  <section class="parts-section">
    <h2 class="section-title">بالشراكة مع</h2>
    <div class="partners-row">
      {#each partnerLogos as logo}
        <img src={withBasePath(`/images/company_logos/${logo}`)} alt="شعار شريك" />
      {/each}
    </div>
  </section>
</div>
