<script>
  import { partnerLogos, stories } from '$lib/site.js';
  import { withBasePath } from '$lib/html.js';
</script>

<svelte:head>
  <title>الشركاء | Full Stack open</title>
  <meta name="description" content="شركات شريكة وقصص مطوّرين" />
</svelte:head>

<div class="container page">
  <h1>الشركاء</h1>
  <p class="page__lead">
    تتعاون الدورة مع شركات تقنية رائدة في فنلندا وخارجها.
  </p>

  <div class="partners-row">
    {#each partnerLogos as logo}
      <img src={withBasePath(`/images/company_logos/${logo}`)} alt="شعار شريك" />
    {/each}
  </div>

  <h2 class="section-title" style="margin-top:3rem">قصص المطوّرين من شركائنا</h2>
  {#each stories as story}
    <article class="story">
      <img src={withBasePath(story.image)} alt={story.name} />
      <div>
        <h3 class="story__name">{story.name}</h3>
        <p class="story__title">{story.title}</p>
        {#each story.text as paragraph}
          <p>{paragraph}</p>
        {/each}
        <img class="story__logo" src={withBasePath(story.companyLogo)} alt="شعار الشركة" />
      </div>
    </article>
  {/each}
</div>
