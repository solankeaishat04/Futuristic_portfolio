<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  
  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let cube: THREE.Mesh;
  let particles: THREE.Points;
  let mouseX = 0;
  let mouseY = 0;
  let animationFrame: number;
  let isLoaded = false;
  
  function createScene() {
    if (!canvas) return;
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 15);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 100);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xec4899, 0.8, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Main cube geometry
    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    
    // Create custom shader material for gradient effect
    const material = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c2d7f,
      shininess: 100,
      wireframe: false
    });
    
    cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    
    // Particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Handle resize
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    isLoaded = true;
    animate();
  }
  
  function handleMouseMove(e: MouseEvent) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  
  function handleWindowResize() {
    if (!canvas) return;
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    
    if (cube) {
      cube.rotation.x += 0.002;
      cube.rotation.y += 0.003;
      
      // Mouse interaction
      cube.rotation.x += mouseY * 0.01;
      cube.rotation.y += mouseX * 0.01;
      
      // Pulsing effect
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      cube.scale.set(scale, scale, scale);
      
      // Color animation
      const time = Date.now() * 0.0005;
      const hue = (time % 1);
      if (cube.material instanceof THREE.MeshPhongMaterial) {
        cube.material.color.setHSL(0.7 + hue * 0.2, 0.8, 0.6);
      }
    }
    
    if (particles) {
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;
    }
    
    renderer.render(scene, camera);
  }
  
  onMount(() => {
    createScene();
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
      if (renderer) renderer.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full" aria-hidden="true"></canvas>
<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>

<style>
  canvas {
    display: block;
    opacity: 0.8;
    mix-blend-mode: screen;
  }
</style>
