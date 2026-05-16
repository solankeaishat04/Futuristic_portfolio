<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  let formData = $state({
    name: '',
    email: '',
    message: ''
  });
  
  let formErrors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);
  let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
  let errorMessage = $state('');
  let formRef = $state<HTMLFormElement>();
  
  function validateForm(): boolean {
    formErrors = {};
    
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      formErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      formErrors.message = 'Message must be at least 10 characters';
    }
    
    return Object.keys(formErrors).length === 0;
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!validateForm()) {
      submitStatus = 'error';
      errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    
    isSubmitting = true;
    submitStatus = 'idle';
    errorMessage = '';
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      submitStatus = 'success';
      formData = { name: '', email: '', message: '' };
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        submitStatus = 'idle';
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      submitStatus = 'error';
      errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  onMount(() => {
    gsap.fromTo('.contact-section',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.contact-section',
          start: "top bottom-=100"
        }
      }
    );
  });
</script>

<section id="contact" class="contact-section py-20 px-4 relative">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-gradient">
        Get In Touch
      </h2>
      <p class="text-gray-400 text-lg">
        Have a project in mind? Let's collaborate and bring ideas to life!
      </p>
      <div class="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Contact Info -->
      <div class="glass-effect rounded-xl p-6 md:col-span-1">
        <div class="text-center md:text-left">
          <div class="text-4xl mb-4" aria-hidden="true">📬</div>
          <h3 class="text-xl font-bold mb-4">Let's Connect</h3>
          <div class="space-y-3 text-sm text-gray-300">
            <div class="flex items-center gap-3 justify-center md:justify-start">
              <span aria-hidden="true">📧</span>
              <a href="mailto:contact@solankea.dev" class="hover:text-purple-400 transition">contact@solankea.dev</a>
            </div>
            <div class="flex items-center gap-3 justify-center md:justify-start">
              <span aria-hidden="true">💬</span>
              <span>Available for projects</span>
            </div>
            <div class="flex items-center gap-3 justify-center md:justify-start">
              <span aria-hidden="true">🌍</span>
              <span>UTC+1 (Lagos, Nigeria)</span>
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-white/10">
            <p class="text-sm text-gray-400">Response time: within 24-48 hours</p>
          </div>
        </div>
      </div>
      
      <!-- Contact Form -->
      <div class="glass-effect rounded-xl p-6 md:col-span-2">
        <form bind:this={formRef} onsubmit={handleSubmit} class="space-y-5" novalidate>
          <div>
            <label for="name-input" class="block text-sm font-medium mb-2 text-gray-300">
              Name <span class="text-red-400" aria-label="required">*</span>
            </label>
            <input
              id="name-input"
              type="text"
              bind:value={formData.name}
              required
              aria-invalid={formErrors.name ? 'true' : 'false'}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
              class="w-full px-4 py-2 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50"
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {#if formErrors.name}
              <p id="name-error" class="text-red-400 text-sm mt-1">{formErrors.name}</p>
            {/if}
          </div>
          
          <div>
            <label for="email-input" class="block text-sm font-medium mb-2 text-gray-300">
              Email <span class="text-red-400" aria-label="required">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              bind:value={formData.email}
              required
              aria-invalid={formErrors.email ? 'true' : 'false'}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
              class="w-full px-4 py-2 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {#if formErrors.email}
              <p id="email-error" class="text-red-400 text-sm mt-1">{formErrors.email}</p>
            {/if}
          </div>
          
          <div>
            <label for="message-input" class="block text-sm font-medium mb-2 text-gray-300">
              Message <span class="text-red-400" aria-label="required">*</span>
            </label>
            <textarea
              id="message-input"
              bind:value={formData.message}
              required
              aria-invalid={formErrors.message ? 'true' : 'false'}
              aria-describedby={formErrors.message ? 'message-error' : undefined}
              rows={4}
              class="w-full px-4 py-2 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none disabled:opacity-50"
              placeholder="Tell me about your project or inquiry..."
              disabled={isSubmitting}
            ></textarea>
            {#if formErrors.message}
              <p id="message-error" class="text-red-400 text-sm mt-1">{formErrors.message}</p>
            {/if}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-busy={isSubmitting}
          >
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true"></div>
              <span>Sending...</span>
            {:else}
              <span aria-hidden="true">🚀</span>
              <span>Send Message</span>
            {/if}
          </button>
          
          {#if submitStatus === 'success'}
            <div class="text-center text-green-400 p-4 bg-green-400/10 rounded-lg border border-green-400/30" role="alert">
              <div class="flex items-center justify-center gap-2">
                <span aria-hidden="true">✨</span>
                <span>Message sent successfully! I'll get back to you soon.</span>
              </div>
            </div>
          {:else if submitStatus === 'error' && errorMessage}
            <div class="text-center text-red-400 p-4 bg-red-400/10 rounded-lg border border-red-400/30" role="alert">
              <div class="flex items-center justify-center gap-2">
                <span aria-hidden="true">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          {/if}
        </form>
      </div>
    </div>
  </div>
</section>