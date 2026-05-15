<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import Scene3D from './Scene3D.svelte';
  
  let heroRef: HTMLDivElement;
  let currentYear = new Date().getFullYear();
  let prefersReducedMotion = false;
  
  onMount(() => {
    // Check for reduced motion preference
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Main timeline
      const tl = gsap.timeline();
      
      tl.fromTo(heroRef, 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      ).fromTo('.hero-badge',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.8"
      ).fromTo('.hero-text',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.5"
      ).fromTo('.hero-buttons',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      ).fromTo('.social-links',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.3"
      );
      
      // Floating animation for the badge
      gsap.to('.hero-badge', {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  });
</script>

<section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
  <!-- 3D Background Scene -->
  <div class="absolute inset-0 z-0">
    <Scene3D />
  </div>
  
  <div bind:this={heroRef} class="max-w-7xl mx-auto text-center z-10 relative">
    <!-- Badge -->
    <div class="mb-8 hero-badge inline-block">
      <div class="glass-effect px-5 py-2 rounded-full text-sm font-medium">
        <span class="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" aria-hidden="true"></span>
        ✨ Available for opportunities • {currentYear}
      </div>
    </div>
    
    <!-- Main Title -->
    <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 hero-text">
      <span class="text-gradient animate-gradient">Solanke</span>
      <br />
      <span class="text-white">Aishat</span>
    </h1>
    
    <!-- Subtitle -->
    <p class="text-xl md:text-2xl text-gray-300 mb-4 hero-text">
      Senior Frontend Engineer • Svelte Developer
    </p>
    
    <!-- Description -->
    <p class="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 hero-text px-4">
      Building immersive digital experiences with cutting-edge web technologies.
      Specialized in creating performant, animated, and user-centric applications.
    </p>
    
    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 hero-buttons">
      <button 
        on:click={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        class="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Explore my work - scroll to projects section"
      >
        <span class="relative z-10 flex items-center gap-2">
          <span class="text-xl">✨</span>
          Explore My Work
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      
      <button 
        on:click={() => {
          const link = document.createElement('a');
          link.href = 'https://drive.google.com/file/d/1resume/view?usp=sharing';
          link.target = '_blank';
          link.click();
        }}
        class="px-8 py-3 glass-effect rounded-lg font-semibold flex items-center gap-2 justify-center hover:bg-white/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Download my resume PDF"
      >
        <span aria-hidden="true">📄</span>
        Download Resume 
      </button>
    </div>
    
    <!-- Social Links -->
    <div class="flex gap-6 justify-center social-links" role="navigation" aria-label="Social media links">
      <a 
        href="https://github.com/solanke-aishat" 
        target="_blank" 
        rel="noopener noreferrer"
        class="glass-effect p-3 rounded-full hover:scale-110 hover:bg-purple-500/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Visit GitHub profile"
        title="GitHub"
      >
        <svg class="w-6 h-6 group-hover:text-purple-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
      <a 
        href="https://linkedin.com/in/solanke-aishat" 
        target="_blank" 
        rel="noopener noreferrer"
        class="glass-effect p-3 rounded-full hover:scale-110 hover:bg-purple-500/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Visit LinkedIn profile"
        title="LinkedIn"
      >
        <svg class="w-6 h-6 group-hover:text-purple-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
      <a 
        href="https://twitter.com/solanke_aishat" 
        target="_blank" 
        rel="noopener noreferrer"
        class="glass-effect p-3 rounded-full hover:scale-110 hover:bg-purple-500/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Visit Twitter profile"
        title="Twitter"
      >
        <svg class="w-6 h-6 group-hover:text-purple-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      </a>
    </div>
  </div>
  
  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
      <div class="w-1 h-2 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
</section> 