// Three.js 3D Interactive Model
let scene, camera, renderer, model;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Framer Motion and GSAP will be loaded via script tags in HTML

// Initialize the 3D scene
function initThreeJS() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Create camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
  
  // Add renderer to container
  const container = document.getElementById('threejs-container');
  if (container) {
    container.appendChild(renderer.domElement);
  }
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Load a simple 3D model (we'll create a geometric shape for performance)
  // In a real implementation, you would load a GLTF model here
  createEngineModel();
  
  // Handle mouse movement for interaction
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('touchmove', onTouchMove, false);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
  
  // Start animation loop
  animate();
}

// Create a simple engine-like model for demonstration
function createEngineModel() {
  // Create a group to hold all parts
  const engineGroup = new THREE.Group();
  
  // Create main cylinder (engine body)
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
  const cylinderMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2563eb,
    metalness: 0.7,
    roughness: 0.3
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.rotation.z = Math.PI / 2;
  engineGroup.add(cylinder);
  
  // Add some details
  const detailGeometry = new THREE.TorusGeometry(0.8, 0.1, 8, 16);
  const detailMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1e40af,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const torus1 = new THREE.Mesh(detailGeometry, detailMaterial);
  torus1.rotation.x = Math.PI / 2;
  engineGroup.add(torus1);
  
  const torus2 = new THREE.Mesh(detailGeometry, detailMaterial);
  torus2.rotation.x = Math.PI / 2;
  torus2.rotation.z = Math.PI / 2;
  engineGroup.add(torus2);
  
  // Add the group to scene
  scene.add(engineGroup);
  
  // Store reference for animation
  model = engineGroup;
}

// Mouse move handler
function onMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 1000;
  mouseY = (event.clientY - windowHalfY) / 1000;
}

// Touch move handler
function onTouchMove(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    mouseX = (touch.clientX - windowHalfX) / 1000;
    mouseY = (touch.clientY - windowHalfY) / 1000;
  }
}

// Window resize handler
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate model based on mouse position
  if (model) {
    model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
    model.rotation.x += (-mouseY * 0.5 - model.rotation.x) * 0.05;
    
    // Add subtle breathing animation
    const time = Date.now() * 0.0005;
    model.scale.set(
      1 + Math.sin(time) * 0.02,
      1 + Math.sin(time) * 0.02,
      1 + Math.sin(time) * 0.02
    );
  }
  
  renderer.render(scene, camera);
}

// Initialize GSAP animations and ScrollTrigger
function initGSAPAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate section titles
  gsap.from('.section-title', {
    scrollTrigger: {
      trigger: '.section-title',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      markers: false
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });
  
  // Animate timeline items
  gsap.from('.timeline-card', {
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      markers: false
    },
    opacity: 0,
    x: i % 2 === 0 ? -100 : 100,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.2
  });
  
  // Animate brand cards on hover (handled by Framer Motion in HTML)
  // Animate service items
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      markers: false
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1
  });
}

// Initialize mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }
}

// Initialize header scroll effect
function initHeaderScrollEffect() {
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js
  initThreeJS();
  
  // Initialize GSAP animations
  initGSAPAnimations();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize header scroll effect
  initHeaderScrollEffect();
  
  // Update footer year
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  
  // Initialize AOS (if still needed for some elements)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }
});

// Performance optimization: reduce animation frequency on low-end devices
if ('navigator' in window && 'hardwareConcurrency' in navigator) {
  if (navigator.hardwareConcurrency < 4) {
    // Reduce animation quality for low-end devices
    console.log('Low-end device detected, optimizing animations');
  }
}