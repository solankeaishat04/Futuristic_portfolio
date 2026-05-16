<script lang="ts">
  import { onMount } from 'svelte';
  
  let inputValue = $state("");
  let output = $state<Array<{type: 'command' | 'output' | 'header'; content: string}>>([]);
  let terminalRef = $state<HTMLDivElement>();
  let minimized = $state(false);
  let commandHistory = $state<string[]>([]);
  let historyIndex = $state(-1);
  
  const commands: Record<string, (args?: string) => string> = {
    help: () => {
      return `📚 AVAILABLE COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  about          About me and my background
  projects       View all featured projects
  skills         Technical skills & expertise
  experience     Work experience timeline
  contact        Contact information
  social         Social media links
  github <user>  Visit GitHub repository
  resume         Download my resume
  system         System information
  clear          Clear terminal history
  theme [d/l]    Toggle dark/light theme
  help           Show this help message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Type: <command> --help for more info`;
    },
    about: () => {
      return `👨‍💻 ABOUT ME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
name:           Solanke Aishat
role:           Senior Frontend Engineer
specialization: Interactive Web Experiences
focus:          Svelte • Three.js • Web Performance

I build immersive digital experiences that blend 
creativity with engineering excellence. Passionate 
about pushing the boundaries of what's possible 
on the web.

Expertise in:
  • Component Architecture & Design Systems
  • Advanced Animation & Interactions
  • Performance Optimization
  • 3D Web Graphics (Three.js, WebGL)
  • Accessibility & User Experience

Currently exploring AI integrations and real-time 
collaborative experiences.`;
    },
    projects: () => {
      return `🚀 FEATURED PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] AI Analytics Dashboard
    Stack: React, GSAP, TensorFlow.js, D3.js
    Role: Lead Frontend Engineer
    
[2] 3D Interactive Portfolio
    Stack: SvelteKit, Three.js, GSAP, WebGL
    Role: Full Stack Developer
    
[3] Chrome Extension (AI Summary)
    Stack: TypeScript, Gemini API, React
    Role: Solo Developer
    
[4] Real-time Collaboration Chat
    Stack: Svelte, Socket.io, Redis, Express
    Role: Full Stack Engineer

Type: projects --detail for full information`;
    },
    skills: () => {
      return `💻 TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frontend:       Svelte(95%) React(87%) Vue(82%)
styling:        TailwindCSS(92%) SCSS(88%) CSS-in-JS(85%)
3d-graphics:    Three.js(85%) WebGL(82%) Babylon.js(78%)
animation:      GSAP(90%) Framer(85%) Native(88%)
typescript:     Advanced (90%)
backend:        Node.js(83%) Express(85%) GraphQL(80%)
database:       PostgreSQL(80%) MongoDB(78%) Redis(82%)
tools:          Vite(92%) Webpack(85%) Docker(75%)
performance:    Lighthouse(94%) Web Vitals Expert(93%)
testing:        Vitest(85%) Jest(88%) Testing-Library(87%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Learning: Rust, AI/ML, System Design`;
    },
    experience: () => {
      return `📅 WORK EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2022-Present   Senior Frontend Engineer @ Tech Company
                • Led 3+ major product initiatives
                • Mentored 5+ junior developers
                • Improved performance by 40%
                
2020-2022      Frontend Engineer @ Startup
                • Built core UI components
                • Shipped 15+ features
                • Implemented animation system
                
2018-2020      Junior Developer @ Agency
                • Worked on 20+ client projects
                • Full-stack development
                • Client management

achievements:
  ✓ 2.5M+ portfolio impressions
  ✓ Featured on Awwwards
  ✓ 10k+ GitHub followers
  ✓ Speaking engagements`;
    },
    contact: () => {
      return `📬 CONTACT & REACH OUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
email:          contact@solankea.dev
github:         /solanke-aishat
linkedin:       /in/solanke-aishat
twitter:        @solanke_aishat
website:        solanke.dev

preferred contact: email or LinkedIn
response time:     24-48 hours
timezone:          UTC+1 (Lagos, Nigeria)`;
    },
    social: () => {
      return `🌐 SOCIAL & WEB PRESENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Portfolio:   https://solanke.dev
🐙 GitHub:      https://github.com/solanke-aishat
💼 LinkedIn:    https://linkedin.com/in/solanke-aishat
🐦 Twitter:     https://twitter.com/solanke_aishat
📧 Email:       contact@solankea.dev
🎨 Codepen:     https://codepen.io/solanke-aishat

Connect with me on any platform - let's build
something amazing together!`;
    },
    resume: () => {
      return `📄 RESUME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Resume ready to download
✓ Format: PDF
✓ Last updated: May 2024

Downloading resume...`;
    },
    system: () => {
      const userAgent = navigator.userAgent;
      const now = new Date();
      return `🖥️  SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
os:             ${userAgent.includes('Win') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : 'Linux'}
browser:        ${userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Unknown'}
time:           ${now.toLocaleString()}
language:       ${navigator.language}
hardware:       ${navigator.hardwareConcurrency} cores
connection:     ${(navigator as any).connection?.effectiveType || 'unknown'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
portfolio version: 2.0.0`;
    },
    github: (arg?: string) => {
      if (arg === '--help') {
        return `github <username|--profile|--repos>\n  --profile   View my GitHub profile\n  --repos     View my repositories`;
      }
      if (arg === '--profile' || arg === '--repos') {
        return `🔗 Opening GitHub repository...\nvisit: https://github.com/solanke-aishat`;
      }
      return `🔗 GitHub: https://github.com/solanke-aishat`;
    },
    clear: () => "CLEAR"
  };
  
  function handleCommand() {
    const fullCmd = inputValue.trim();
    if (fullCmd === "") return;
    
    // Add to history
    commandHistory.push(fullCmd);
    historyIndex = commandHistory.length;
    
    // Add command to output
    output.push({ type: 'command', content: `$ ${fullCmd}` });
    
    const [cmd, ...args] = fullCmd.toLowerCase().split(' ');
    
    if (cmd === "clear") {
      output = [];
    } else if (cmd === "theme" && args[0]) {
      if (args[0] === 'dark') {
        document.documentElement.classList.add('dark');
        output.push({ type: 'output', content: '✓ Theme changed to dark mode' });
      } else if (args[0] === 'light') {
        document.documentElement.classList.remove('dark');
        output.push({ type: 'output', content: '✓ Theme changed to light mode' });
      } else {
        output.push({ type: 'output', content: '❌ Usage: theme [dark/light]' });
      }
    } else if (cmd === "view" && args[0]) {
      output.push({ type: 'output', content: `📁 Project details for "${args[0]}" coming soon! Check the projects section above for more info.` });
    } else if (commands[cmd]) {
      const result = commands[cmd](args[0]);
      if (result !== "CLEAR") {
        output.push({ type: 'output', content: result });
      }
    } else if (cmd !== "") {
      output.push({ type: 'output', content: `❌ Command not found: ${cmd}. Type 'help' for available commands.` });
    }
    
    inputValue = "";
    
    setTimeout(() => {
      if (terminalRef) {
        terminalRef.scrollTop = terminalRef.scrollHeight;
      }
    }, 50);
  }
  
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputValue = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputValue = commandHistory[historyIndex];
      } else if (historyIndex === commandHistory.length - 1) {
        historyIndex = commandHistory.length;
        inputValue = "";
      }
    }
  }
  
  function addWelcomeMessage() {
    output.push({ type: 'output', content: '╔═══════════════════════════════════════╗' });
    output.push({ type: 'output', content: '║   Welcome to Interactive Terminal!   ║' });
    output.push({ type: 'output', content: '╚═══════════════════════════════════════╝' });
    output.push({ type: 'output', content: '' });
    output.push({ type: 'output', content: '🎮 Type "help" to see all available commands' });
    output.push({ type: 'output', content: '💡 Try: projects, skills, about, or theme dark' });
    output.push({ type: 'output', content: '' });
  }
  
  onMount(() => {
    addWelcomeMessage();
  });
</script>

<div class="fixed bottom-4 right-4 z-50 w-96">
  <div class={`glass-effect rounded-lg overflow-hidden transition-all duration-300 shadow-2xl ${minimized ? 'h-12' : 'h-96'}`}>
    <!-- Terminal Header -->
    <div class="flex justify-between items-center p-3 border-b border-white/10 cursor-pointer bg-black/30" role="button" tabindex="0" onclick={() => minimized = !minimized} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); minimized = !minimized; } }}>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
        <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="ml-2 text-purple-400">💻</span>
        <span class="text-sm font-mono text-purple-400">developer@portfolio:~/terminal</span>
      </div>
      <div class="flex gap-2">
        <button type="button" class="text-xs hover:text-purple-400 transition cursor-pointer" onclick={(e) => {
          e.stopPropagation();
          minimized = true;
        }}>−</button>
        <button type="button" class="text-xs hover:text-red-400 transition cursor-pointer" onclick={(e) => {
          e.stopPropagation();
          minimized = true;
        }}>✕</button>
      </div>
    </div>
    
    <!-- Terminal Body -->
    {#if !minimized}
      <div 
        bind:this={terminalRef}
        class="h-80 overflow-y-auto p-3 font-mono text-xs bg-black/50"
      >
        {#each output as line}
          <div class="mb-1">
            {#if line.type === 'command'}
              <div class="flex gap-2">
                <span class="text-green-400">$</span>
                <span class="text-white">{line.content.slice(2)}</span>
              </div>
            {:else}
              <pre class="text-gray-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">{line.content}</pre>
            {/if}
          </div>
        {/each}
        
        <div class="flex gap-2 mt-2">
          <span class="text-green-400">$</span>
          <input
            bind:value={inputValue}
            onkeydown={handleKeyPress}
            class="flex-1 bg-transparent outline-none text-white font-mono text-xs"
            placeholder="Type a command..."
            autocomplete="off"
            spellcheck="false"
          />
          <span class="animate-pulse text-purple-400">█</span>
        </div>
      </div>
    {/if}
  </div>
</div>