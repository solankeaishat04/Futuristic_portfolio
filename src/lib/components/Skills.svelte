<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  interface Skill {
    name: string;
    level: number;
    icon: string;
    description: string;
  }
  
  const skills: Skill[] = [
    { name: "Svelte/SvelteKit", level: 95, icon: "⚡", description: "Reactive frameworks" },
    { name: "TypeScript", level: 90, icon: "📘", description: "Type-safe development" },
    { name: "Three.js", level: 85, icon: "🎨", description: "3D WebGL experiences" },
    { name: "GSAP", level: 88, icon: "✨", description: "Smooth animations" },
    { name: "TailwindCSS", level: 92, icon: "🎨", description: "Utility-first CSS" },
    { name: "React", level: 87, icon: "⚛️", description: "Component-based UI" }
  ];
  
  const tools = [
    "GSAP", "Three.js", "TypeScript", "TailwindCSS", "Jest", 
    "WebGL", "Node.js", "GraphQL", "Docker", "Figma", "Vite", "Webpack"
  ];
  
  let bars: HTMLDivElement[] = [];
  let skillItems: HTMLDivElement[] = [];
  let prefersReducedMotion = false;
  
  onMount(() => {
    // Check for reduced motion preference
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Animate skill bars
    bars?.forEach((bar) => {
      const level = bar.dataset.level;
      gsap.fromTo(bar,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    
    // Animate skill items
    skillItems?.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: item,
            start: "top bottom-=100"
          }
        }
      );
    });
  });
</script>

<section id="skills" class="py-20 px-4 relative">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-gradient">
        Skills & Expertise
      </h2>
      <p class="text-gray-400 text-lg">
        Constantly learning and evolving with modern technologies
      </p>
      <div class="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
    </div>
    
    <div class="grid md:grid-cols-2 gap-12">
      <!-- Left side - Skills bars -->
      <div class="space-y-6">
        {#each skills as skill, idx}
          <div bind:this={skillItems[idx]} class="space-y-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{skill.icon}</span>
                <div>
                  <span class="text-lg font-semibold">{skill.name}</span>
                  <p class="text-xs text-gray-500">{skill.description}</p>
                </div>
              </div>
              <span class="text-purple-400 font-mono">{skill.level}%</span>
            </div>
            <div class="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                bind:this={bars[idx]}
                data-level={skill.level}
                class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Right side - Tools grid -->
      <div>
        <div class="glass-effect rounded-xl p-6">
          <h3 class="text-2xl font-bold mb-4 text-center text-gradient">Tools & Technologies</h3>
          <div class="flex flex-wrap gap-3 justify-center">
            {#each tools as tool}
              <span class="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-purple-500/20 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10">
                {tool}
              </span>
            {/each}
          </div>
        </div>
        
        <!-- Achievement stats -->
        <div class="grid grid-cols-2 gap-6 mt-8">
          <div class="glass-effect rounded-xl p-4 text-center">
            <h4 class="text-3xl font-bold text-gradient">50+</h4>
            <p class="text-gray-400 text-sm">Projects Completed</p>
          </div>
          <div class="glass-effect rounded-xl p-4 text-center">
            <h4 class="text-3xl font-bold text-gradient">5</h4>
            <p class="text-gray-400 text-sm">Years of Experience</p>
          </div>
          <div class="glass-effect rounded-xl p-4 text-center">
            <h4 class="text-3xl font-bold text-gradient">100%</h4>
            <p class="text-gray-400 text-sm">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>