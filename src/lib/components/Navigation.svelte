<script lang="ts">
  import { onMount } from 'svelte';
  
  let isOpen = $state(false);
  let isDark = $state(true);
  let activeSection = $state('home');
  let scrolled = $state(false);
  
  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  function scrollToSection(sectionId: string) {
    activeSection = sectionId;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    isOpen = false;
  }
  
  function handleKeyDown(e: KeyboardEvent, sectionId: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  }
  
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      isDark = false;
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
    }
    
    // Handle scroll effect
    window.addEventListener('scroll', () => {
      scrolled = window.scrollY > 50;
    });
    
    // Set active section on scroll
    const sections = ['home', 'projects', 'skills', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  });
</script>

<nav class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  scrolled ? 'glass-effect border-b border-white/10' : 'bg-transparent'
}`}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <button 
        class="flex items-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-2 py-1"
        onclick={() => scrollToSection('home')}
        onkeydown={(e) => handleKeyDown(e, 'home')}
        aria-label="Back to home"
      >
        <div class="text-2xl font-bold text-gradient animate-gradient">
          SA
        </div>
        <div class="ml-2 w-1 h-1 bg-purple-500 rounded-full group-hover:scale-150 transition-transform" aria-hidden="true"></div>
      </button>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8">
        {#each ['home', 'projects', 'skills', 'contact'] as section}
          <button
            onclick={() => scrollToSection(section)}
            onkeydown={(e) => handleKeyDown(e, section)}
            class={`relative px-3 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded ${
              activeSection === section
                ? 'text-purple-400'
                : 'text-gray-300 hover:text-white'
            }`}
            aria-current={activeSection === section ? 'page' : undefined}
            aria-label={`Navigate to ${section} section`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
            {#if activeSection === section}
              <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            {/if}
          </button>
        {/each}
        
        <button
          onclick={toggleTheme}
          class="glass-effect p-2 rounded-lg hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {#if isDark}
            <span class="text-yellow-400" aria-hidden="true">☀️</span>
          {:else}
            <span class="text-purple-600">🌙</span>
          {/if}
        </button>
      </div>
      
      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center gap-2">
        <button
          onclick={toggleTheme}
          class="glass-effect p-2 rounded-lg hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {#if isDark}
            <span class="text-yellow-400" aria-hidden="true">☀️</span>
          {:else}
            <span class="text-purple-600" aria-hidden="true">🌙</span>
          {/if}
        </button>
        
        <button
          onclick={() => isOpen = !isOpen}
          class="glass-effect p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {#if isOpen}
            <span class="text-xl" aria-hidden="true">✕</span>
          {:else}
            <span class="text-xl" aria-hidden="true">☰</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu -->
  {#if isOpen}
    <div class="md:hidden glass-effect border-t border-white/10 animate-slide-down" role="navigation" aria-label="Mobile navigation">
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#each ['home', 'projects', 'skills', 'contact'] as section}
          <button
            onclick={() => scrollToSection(section)}
            onkeydown={(e) => handleKeyDown(e, section)}
            class="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-current={activeSection === section ? 'page' : undefined}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</nav>