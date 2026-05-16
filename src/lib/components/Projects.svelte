<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  interface Project {
    title: string;
    description: string;
    technologies: string[];
    icon: string;
    demoUrl: string;
    githubUrl: string;
    color: string;
    stats?: string;
  }
  
  const projects: Project[] = [
    {
      title: "Interactive 3D Portfolio",
      description: "Immersive 3D web experience with interactive WebGL animations, particle systems, and cinematic scroll storytelling. Showcases advanced frontend engineering with Three.js and GSAP.",
      technologies: ["SvelteKit", "Three.js", "GSAP", "WebGL", "TypeScript"],
      icon: "🌐",
      demoUrl: "https://solanke.dev",
      githubUrl: "https://github.com/solanke-aishat/portfolio-3d",
      color: "from-purple-500 to-pink-500",
      stats: "Featured on Awwwards"
    },
    {
      title: "Real-time Collaboration Hub",
      description: "WebSocket-based real-time collaboration platform with live messaging, code sharing, and presence awareness. Built for seamless team communication.",
      technologies: ["Svelte", "Socket.io", "Redis", "Express", "PostgreSQL"],
      icon: "💬",
      demoUrl: "https://collab-hub.demo",
      githubUrl: "https://github.com/solanke-aishat/collab-hub",
      color: "from-orange-500 to-red-500",
      stats: "50ms latency"
    },
    {
      title: "AI Content Summarizer",
      description: "Chrome extension powered by Gemini AI for intelligent content summarization. Extracts key points from articles and web content with one click.",
      technologies: ["TypeScript", "Gemini API", "Chrome API", "React", "Tailwind"],
      icon: "🤖",
      demoUrl: "https://chrome.google.com/webstore/detail/ai-summarizer",
      githubUrl: "https://github.com/solanke-aishat/ai-summarizer",
      color: "from-green-500 to-emerald-500",
      stats: "3.2k+ downloads"
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time analytics dashboard with AI-powered insights, predictive analytics, and interactive data visualization using D3.js and TensorFlow.js.",
      technologies: ["React", "D3.js", "TensorFlow.js", "GSAP", "Node.js"],
      icon: "📊",
      demoUrl: "https://analytics-demo.solanke.dev",
      githubUrl: "https://github.com/solanke-aishat/analytics-dashboard",
      color: "from-blue-500 to-cyan-500",
      stats: "5k+ daily users"
    },
    {
      title: "Design System Component Library",
      description: "Production-ready component library with comprehensive documentation, accessibility features, and theme customization. Supports dark mode and custom theming.",
      technologies: ["SvelteKit", "Storybook", "TypeScript", "Tailwind", "Vite"],
      icon: "🎨",
      demoUrl: "https://design-system.solanke.dev",
      githubUrl: "https://github.com/solanke-aishat/design-system",
      color: "from-indigo-500 to-purple-500",
      stats: "50+ components"
    },
    {
      title: "Performance Optimization Suite",
      description: "Comprehensive suite for web performance monitoring, optimization analysis, and Lighthouse integration. Includes automated performance reporting and recommendations.",
      technologies: ["TypeScript", "Jest", "Node.js", "GitHub API", "GraphQL"],
      icon: "⚡",
      demoUrl: "https://perf-suite.solanke.dev",
      githubUrl: "https://github.com/solanke-aishat/perf-suite",
      color: "from-yellow-500 to-orange-500",
      stats: "Lighthouse 98+"
    }
  ];
  
  let cardsRef: HTMLDivElement[] = [];
  let hoveredCard: number | null = null;
  
  onMount(() => {
    // Animate cards on scroll
    cardsRef?.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    
    // Section title animation
    gsap.fromTo('.section-title',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.section-title',
          start: "top bottom-=100"
        }
      }
    );
  });
</script>

<section id="projects" class="py-20 px-4 relative overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16 section-title">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-gradient">
        Featured Projects
      </h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">
        Exploring the intersection of creativity and technology
      </p>
      <div class="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each projects as project, index}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div 
          bind:this={cardsRef[index]}
          class="group relative glass-effect rounded-xl overflow-hidden transition-all duration-500 cursor-pointer focus-within:ring-2 focus-within:ring-purple-500"
          onmouseenter={() => hoveredCard = index}
          onmouseleave={() => hoveredCard = null}
          role="article"
          tabindex="0"
          aria-label="{project.title} project"
          style="transform-style: preserve-3d;"
        >
          <!-- Animated gradient border -->
          <div class="absolute inset-0 bg-gradient-to-r {project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          
          <div class="relative p-6 bg-black/50 backdrop-blur-sm">
            <div class="text-6xl mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {project.icon}
            </div>
            
            <h3 class="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:{project.color} group-hover:bg-clip-text transition-all duration-300">
              {project.title}
            </h3>
            
            <p class="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
            
            <!-- Stats badge -->
            {#if project.stats}
              <div class="mb-4 inline-block">
                <span class="text-xs px-2 py-1 bg-white/10 rounded-full">
                  📊 {project.stats}
                </span>
              </div>
            {/if}
            
            <!-- Technologies -->
            <div class="flex flex-wrap gap-2 mb-6">
              {#each project.technologies as tech}
                <span class="text-xs px-2 py-1 bg-white/10 rounded-full hover:bg-purple-500/20 transition-colors">
                  {tech}
                </span>
              {/each}
            </div>
            
            <!-- Buttons -->
            <div class="flex gap-3">
              <a 
                href={project.demoUrl}
                target="_blank"
                class="flex-1 text-center px-4 py-2 bg-gradient-to-r {project.color} rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium group/btn"
              >
                <span>🚀</span>
                Live Demo
              </a>
              <a 
                href={project.githubUrl}
                target="_blank"
                class="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm group/btn"
              >
                <span>📦</span>
                Code
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>