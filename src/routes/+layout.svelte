<script>
  let { children } = $props();
  import '../app.css';
  // @ts-ignore
  import Navigation from '$lib/components/Navigation.svelte';
  import ParticleBackground from '$lib/components/ParticleBackground.svelte';
  import Terminal from '$lib/components/Terminal.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Contact from '$lib/components/Contact.svelte';
</script>

<!-- Skip to main content link for accessibility -->
<a 
  href="#main-content" 
  class="absolute top-0 left-0 px-4 py-2 bg-purple-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 -translate-y-full focus:translate-y-0 transition-transform"
>
  Skip to main content
</a>

<Navigation />
<ParticleBackground />
<main class="relative z-10" id="main-content">
  <Hero />
  <Projects />
  <Skills />
  <Contact />
  {@render children()}
</main>
<Terminal />