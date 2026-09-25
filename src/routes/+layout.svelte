<script>
  import 'highlight.js/styles/atom-one-dark.css';
  import '../app.css';
  import '../lib/content.css';
  import { page } from '$app/state';
  import { withBasePath } from '$lib/html.js';
  import { site } from '$lib/site.js';

  let { children } = $props();
  let menuOpen = $state(false);

  const navItems = [
    { href: withBasePath('/about'), label: 'عن الدورة' },
    { href: withBasePath('/#parts'), label: 'محتويات الدورة' },
    { href: withBasePath('/faq'), label: 'الأسئلة الشائعة' },
    { href: withBasePath('/companies'), label: 'الشركاء' },
    { href: withBasePath('/challenge'), label: 'التحدي' },
  ];

  let theme = $state('light');

  $effect(() => {
    if (typeof document === 'undefined') return;
    theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  };

  const currentPath = $derived(page.url.pathname);
  const searchHref = withBasePath('/search');
</script>

<svelte:head>
  <title>{site.title} - النسخة العربية</title>
</svelte:head>

<div class="app">
  <a class="skip-link" href="#main">الانتقال إلى المحتوى</a>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href={withBasePath('/')} aria-label="Full Stack open">
        <span class="logo__mark">{'{() => fs}'}</span>
      </a>

      <button
        class="menu-toggle"
        aria-label="قائمة التنقل"
        aria-expanded={menuOpen}
        onclick={() => (menuOpen = !menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="site-nav" class:site-nav--open={menuOpen}>
        {#each navItems as item}
          <a
            href={item.href}
            class:active={currentPath === item.href}
            onclick={() => (menuOpen = false)}>{item.label}</a
          >
        {/each}
        <a
          href={searchHref}
          class:active={currentPath === searchHref}
          onclick={() => (menuOpen = false)}>البحث</a
        >
        <button class="theme-toggle" onclick={toggleTheme} aria-label="تبديل السمة">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </nav>
    </div>
  </header>

  <main id="main">
    {@render children()}
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div>
        <p class="site-footer__title">{site.title} - النسخة العربية</p>
        <p class="site-footer__text">
          مادة الدورة الأصلية من إعداد جامعة هلسنكي وHouston Inc.، ومرخّصة بموجب
          رخصة <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
            >Creative Commons BY-NC-SA 3.0</a
          >.
        </p>
      </div>
      <nav class="site-footer__nav">
        <a href={withBasePath('/about')}>عن الدورة</a>
        <a href={withBasePath('/faq')}>الأسئلة الشائعة</a>
        <a href={withBasePath('/companies')}>الشركاء</a>
        <a href={withBasePath('/challenge')}>التحدي</a>
        <a href={withBasePath('/search')}>البحث</a>
      </nav>
    </div>
  </footer>
</div>
