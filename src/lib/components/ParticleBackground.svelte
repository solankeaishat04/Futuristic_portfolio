<script lang="ts">
  import { onMount } from 'svelte';
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let particles: Particle[] = [];
  let animationFrame: number;
  let mouseX = 0;
  let mouseY = 0;
  let mouseRadius = 150;
  
  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    originalX: number;
    originalY: number;
    
    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.originalX = this.x;
      this.originalY = this.y;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 0.5;
      const hue = Math.random() * 60 + 260; // Purple to pink range
      this.color = `hsl(${hue}, 80%, 65%)`;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    
    update(width: number, height: number, mouseX: number, mouseY: number) {
      // Mouse interaction - repulsion
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseRadius - distance) / mouseRadius * 0.5;
        this.vx -= Math.cos(angle) * force;
        this.vy -= Math.sin(angle) * force;
      }
      
      // Return to original position
      const returnForce = 0.01;
      this.vx += (this.originalX - this.x) * returnForce;
      this.vy += (this.originalY - this.y) * returnForce;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Boundary with bounce
      if (this.x < 0 || this.x > width) {
        this.vx *= -0.8;
        this.x = Math.max(0, Math.min(width, this.x));
      }
      if (this.y < 0 || this.y > height) {
        this.vy *= -0.8;
        this.y = Math.max(0, Math.min(height, this.y));
      }
      
      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      
      // Update original position if mouse not interacting
      if (distance > mouseRadius) {
        this.originalX += (this.x - this.originalX) * 0.01;
        this.originalY += (this.y - this.originalY) * 0.01;
      }
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }
  
  function initParticles(width: number, height: number) {
    const particleCount = Math.min(200, Math.floor((width * height) / 8000));
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height));
    }
  }
  
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;
        
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = 0.15 * (1 - distance / maxDistance);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  
  function drawGradientGlow() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(88, 28, 135, 0.05)');
    gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function animate() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGradientGlow();
    
    particles.forEach(particle => {
      particle.update(canvas.width, canvas.height, mouseX, mouseY);
      particle.draw(ctx);
    });
    
    drawConnections();
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  function handleMouseMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
  }
  
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas.width, canvas.height);
  }
  
  onMount(() => {
    ctx = canvas.getContext('2d')!;
    handleResize();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<svelte:window />
<canvas 
  bind:this={canvas} 
  class="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
  style="background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);"
></canvas>