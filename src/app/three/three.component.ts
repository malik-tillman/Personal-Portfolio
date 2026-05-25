/**
 * three.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  RectAreaLight,
  DirectionalLight,
  PointLight,
  AmbientLight,
  MathUtils,
  MeshPhysicalMaterial,
  CircleGeometry,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  Color,
  Vector2,
  WebGLRenderTarget,
  Raycaster,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  AdditiveBlending,
  Fog
} from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

@Component({
    selector: 'three', templateUrl: './three.component.html', styleUrls: ['./three.component.scss'],
    standalone: false
})
export class ThreeComponent implements AfterViewInit, OnDestroy {
  /* 3d Canvas Reference */
  @ViewChild("main") _canvas: ElementRef;

  /* Keep tracking rendering state to prevent leaks on destroy */
  private animationFrameId: number | null = null;
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private composer: EffectComposer | null = null;
  private floorGeometry: CircleGeometry | null = null;
  private floorMaterial: ShaderMaterial | null = null;
  private particleGeometry: BufferGeometry | null = null;
  private particleMaterial: PointsMaterial | null = null;
  private logoMaterial: MeshPhysicalMaterial | null = null;

  /* Getter for canvas native element */
  private get canvas(): HTMLCanvasElement {
    return this._canvas.nativeElement;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Cancel the animation frame loop
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      // 2. Dispose floor mesh materials & geometry
      if (this.floorGeometry) this.floorGeometry.dispose();
      if (this.floorMaterial) this.floorMaterial.dispose();

      // 3. Dispose particles
      if (this.particleGeometry) this.particleGeometry.dispose();
      if (this.particleMaterial) this.particleMaterial.dispose();

      // 4. Dispose logo material
      if (this.logoMaterial) this.logoMaterial.dispose();

      // 5. Traverse scene to dispose leftover textures/geometries
      if (this.scene) {
        this.scene.traverse((object: any) => {
          if (!object.isMesh) return;

          if (object.geometry) object.geometry.dispose();

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }

      // 6. Dispose EffectComposer and WebGLRenderer target textures
      if (this.composer) {
        this.composer.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    /* Create renderer and scene */
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // Disabled alpha to fix post-processing transparency bugs
      antialias: true,
      powerPreference: 'high-performance' // Request high-performance GPU context
    });
    this.renderer.setClearColor(new Color('#0c0c0c')); // Match site background
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // Cap at 2x to save mobile battery/performance
    this.scene = new Scene();

    /* Phase 8: Add subtle scene fog for atmospheric depth */
    this.scene.fog = new Fog('#0c0c0c', 15, 60);

    const _positions = {
      _d: {
        _x: 0, _y: 27, _z: 15
      },
      _m: {
        _x: 0, _y: 26, _z: 20
      }
    }

    const _targets = {
      _d: {
        _x: 0, _y: 27.5, _z: 0
      },
      _m: {
        _x: -.5, _y: 25, _z: 0
      }
    }

    /* Create and set camera */
    let camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );

    // Set initial camera based on screen size
    if (window.innerWidth < 630) {
      camera.position.set(_positions._m._x, _positions._m._y, _positions._m._z);
      camera.lookAt(_targets._m._x, _targets._m._y, _targets._m._z);
    } else {
      camera.position.set(_positions._d._x, _positions._d._y, _positions._d._z);
      camera.lookAt(_targets._d._x, _targets._d._y, _targets._d._z);
    }

    /* Create Lights */
    RectAreaLightUniformsLib.init();

    /* Studio 3-Point Lighting Setup */
    let keyLight, fillLight, rimLight;

    // Feature detection for RectAreaLight capabilities
    // RectAreaLight relies on float/half-float textures which older/buggy WebGL implementations (like older iOS Safari) struggle with
    const supportsRectAreaLight = this.renderer.capabilities.isWebGL2 ||
                                  this.renderer.capabilities.floatFragmentTextures ||
                                  this.renderer.extensions.get('OES_texture_half_float');

    if (supportsRectAreaLight) {
      // Key Light - Main light, front-right, warm white
      keyLight = new RectAreaLight("rgb(255,250,244)", 1, 60, 60);
      keyLight.position.set(30, 40, 50);
      keyLight.lookAt(0, 27, 0);

      // Fill Light - Softer, front-left, neutral/cool
      fillLight = new RectAreaLight("rgb(200,210,255)", 1, 50, 50);
      fillLight.position.set(-35, 30, 40);
      fillLight.lookAt(0, 27, 0);

      // Rim/Back Light - Behind, creates edge separation, blue accent
      rimLight = new RectAreaLight("rgb(80,120,255)", 1, 80, 80);
      rimLight.position.set(0, 35, -40);
      rimLight.lookAt(0, 27, 0);
    } else {

      // FALLBACK: Directional and Point lights for broader device compatibility
      // Key Light
      keyLight = new DirectionalLight("rgb(255,250,244)", 0); // Boosted intensity for fallback
      keyLight.position.set(30, 40, 50);
      keyLight.lookAt(0, 27, 0);

      // Fill Light
      fillLight = new DirectionalLight("rgb(200,210,255)", 0); // Boosted intensity
      fillLight.position.set(-35, 30, 40);
      fillLight.lookAt(0, 27, 0);

      // Rim/Back Light
      rimLight = new PointLight("rgb(80,120,255)", 1, 150);
      rimLight.position.set(0, 35, -40);
    }

    // Ambient Light
    let ambientLight = new AmbientLight("rgb(255,255,255)", 3);
    ambientLight.position.set(0, 50, 100);
    ambientLight.lookAt(0, 27, 0);

    /* Gradient Floor Plane */
    this.floorGeometry = new CircleGeometry(25, 64);
    this.floorMaterial = new ShaderMaterial({
      uniforms: {
        innerColor: { value: new Color("hsl(0, 0%, 15%)") },
        outerColor: { value: new Color("hsl(0, 0%, 4%)") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;

        // Pseudo-random noise function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          // Distance from center for the gradient
          float dist = distance(vUv, vec2(0.5, 0.5)) * 2.0;

          // Generate fine grain/noise based on UVs
          float noise = random(vUv * 500.0) * 0.05; // 0.05 controls grain intensity

          // Mix colors based on distance, then add noise only where it's not fully black
          vec3 baseColor = mix(innerColor, outerColor, smoothstep(0.0, 1.0, dist));
          vec3 finalColor = baseColor + (noise * (1.0 - smoothstep(0.0, 1.0, dist)));

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: DoubleSide
    });
    const floor = new Mesh(this.floorGeometry, this.floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 18, 0);
    this.scene.add(floor);

    /* Phase 6: Floating Particles (Ambient Dust) */
    this.particleGeometry = new BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      // Spread particles randomly in a 150-unit volume
      posArray[i] = (Math.random() - 0.5) * 150;
    }

    this.particleGeometry.setAttribute('position', new Float32BufferAttribute(posArray, 3));
    this.particleMaterial = new PointsMaterial({
      size: 0.1,
      color: "rgb(255, 230, 230)", // Subtle warm tint
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending
    });

    const particlesMesh = new Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(particlesMesh);

    /* Load GLTF Object */
    const gltfLoader = new GLTFLoader();
    let gltfObj;
    let logo;

    /* Mouse Parallax Targets */
    let targetRotationX = 0;
    let targetRotationY = 0;

    gltfLoader.load('assets/3d/home-1.gltf', ( gltf => {
      /* Get gltf objects */
      gltfObj = gltf.scene;

      /* Set object scene size */
      gltfObj.scale.set(.5,.5,.5);

      /* create material */
      this.logoMaterial = new MeshPhysicalMaterial({
        color: supportsRectAreaLight ? "rgb(125,40,40)" : "rgb(180,55,55)", // Brighter red on fallback
        metalness: supportsRectAreaLight ? 0.9 : 0.8,
        roughness: supportsRectAreaLight ? 0.25 : 0.5, // Lower roughness so it reflects better
        clearcoat: supportsRectAreaLight ? 1.0 : 1.0,
        clearcoatRoughness: supportsRectAreaLight ? 0.2 : 0.5,
        reflectivity: supportsRectAreaLight ? 1.0 : 0.2,
        flatShading: false
      });

      /* Apply material */
      gltfObj.traverse(obj => {
        if (obj.isMesh) obj.material = this.logoMaterial;
      })

      /* Parse object */
      logo = {
        MAIN: gltfObj.getObjectByName('Logo'),
        CHUNKS: [
          gltfObj.getObjectByName('(A)_Extrude'),
          gltfObj.getObjectByName('(L)_Extrude'),
          gltfObj.getObjectByName('(E_1)_Extrude'),
          gltfObj.getObjectByName('(E_2)_Extrude'),
          gltfObj.getObjectByName('(K)_Null')
        ]
      };

      /* Phase 5: Easter Egg Click Animation */
      logo.CHUNKS.forEach((chunk) => {
        if (!chunk) return;
        // Save original position & rotation into userData
        chunk.userData.originalPos = chunk.position.clone();
        chunk.userData.originalRot = chunk.rotation.clone();
      });

      /* Add object and lights */
      if (this.scene) {
        this.scene.add(gltfObj);
        this.scene.add(keyLight);
        this.scene.add(fillLight);
        this.scene.add(rimLight);
        this.scene.add(ambientLight);
      }

      /* Phase 5: Cinematic Entrance Animation */
      // Shift logo down slightly for a very subtle rise
      gltfObj.position.y -= 2;

      // Animate Logo Rise subtly
      gsap.to(gltfObj.position, {
        y: "+=2",
        duration: 1.5,
        ease: "power2.out"
      });

      /* Click & Hover Events for Easter Egg */
      const raycaster = new Raycaster();
      const mouse = new Vector2();
      let isAnimating = false;

      const triggerEasterEgg = (clientX: number, clientY: number) => {
        if (!logo || isAnimating) return;

        const rect = this.canvas.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check if user clicked the logo
        const intersects = raycaster.intersectObjects(logo.CHUNKS, true);
        if (intersects.length > 0) {
          isAnimating = true;

          logo.CHUNKS.forEach((chunk, index) => {
            if (!chunk) return;
            const origPos = chunk.userData.originalPos;
            const origRot = chunk.userData.originalRot;

            // Subtle explode parameters
            const radius = .5;
            const angle = Math.random() * Math.PI * 2;

            // 1. Explode out quickly
            gsap.to(chunk.position, {
              x: origPos.x + Math.cos(angle) * radius,
              y: origPos.y + (Math.random() - 0.5) * 5,
              z: origPos.z + Math.sin(angle) * radius,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                // 2. Snap back elastically
                gsap.to(chunk.position, {
                  x: origPos.x,
                  y: origPos.y,
                  z: origPos.z,
                  duration: 1.5,
                  ease: "elastic.out(1.2, 0.4)",
                  onComplete: () => {
                    // Unlock animation when last chunk finishes
                    if (index === logo.CHUNKS.length - 1) isAnimating = false;
                  }
                });
              }
            });

            // Random jiggle rotation
            gsap.to(chunk.rotation, {
              x: origRot.x + (Math.random() - 0.5) * 1.5,
              y: origRot.y + (Math.random() - 0.5) * 1.5,
              z: origRot.z + (Math.random() - 0.5) * 1.5,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(chunk.rotation, {
                  x: origRot.x,
                  y: origRot.y,
                  z: origRot.z,
                  duration: 1.5,
                  ease: "elastic.out(1.2, 0.4)"
                });
              }
            });
          });
        }
      };

      // Handle hover cursor (Desktop only)
      this.canvas.addEventListener('mousemove', (event) => {
        if (!logo || isAnimating) {
          this.canvas.style.cursor = 'default';
          return;
        }

        const rect = this.canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Map mouse to rotation (adjust multiplier for intensity)
        targetRotationY = mouse.x * 0.5;
        targetRotationX = -mouse.y * 0.3;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(logo.CHUNKS, true);

        this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
      });

      // Desktop Double Click
      this.canvas.addEventListener('dblclick', (event) => {
        triggerEasterEgg(event.clientX, event.clientY);
      });

      // Mobile Drag & Double Tap
      let lastTap = 0;
      let isDragging = false;
      let previousTouch = { x: 0, y: 0 };

      this.canvas.addEventListener('touchstart', (event) => {
        if (!logo || isAnimating) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        // Handle Double Tap Easter Egg
        if (tapLength < 500 && tapLength > 0) {
          triggerEasterEgg(event.touches[0].clientX, event.touches[0].clientY);
          event.preventDefault(); // Prevent zoom
        } else {
          // Start dragging
          isDragging = true;
          previousTouch.x = event.touches[0].clientX;
          previousTouch.y = event.touches[0].clientY;
        }
        lastTap = currentTime;
      }, { passive: false });

      this.canvas.addEventListener('touchmove', (event) => {
        if (!isDragging || !logo || isAnimating) return;

        // Calculate delta
        const deltaX = event.touches[0].clientX - previousTouch.x;
        const deltaY = event.touches[0].clientY - previousTouch.y;

        // Accumulate rotation (adjust sensitivity with multiplier)
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;

        // Clamp rotation so the back of the logo isn't exposed
        targetRotationY = MathUtils.clamp(targetRotationY, -0.6, 0.6);
        targetRotationX = MathUtils.clamp(targetRotationX, -0.4, 0.4);

        // Update previous touch
        previousTouch.x = event.touches[0].clientX;
        previousTouch.y = event.touches[0].clientY;

        event.preventDefault(); // Prevent page scrolling while rotating the logo
      }, { passive: false });

      this.canvas.addEventListener('touchend', () => {
        isDragging = false;
      });
      this.canvas.addEventListener('touchcancel', () => {
        isDragging = false;
      });
    }))

    /* Post-processing (Bloom) */
    const renderScene = new RenderPass(this.scene, camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.2; // Raised threshold so ONLY the brightest highlights glow, preventing a washed-out look
    bloomPass.strength = supportsRectAreaLight ? 0.5 : 0.7;   // Intensity of the glow
    bloomPass.radius = supportsRectAreaLight ? 0.4 : 0.3;     // Softness/spread of the glow

    // Restore Anti-Aliasing for EffectComposer
    const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      samples: 4
    });

    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    /* Render animation frames */
    const render = (timeMs: number) => {
      this.animationFrameId = requestAnimationFrame(render);
      const time = timeMs * 0.001; // Convert to seconds

      /* Animate Particles */
      particlesMesh.rotation.y = time * 0.01;
      particlesMesh.rotation.z = time * 0.005;

      /* Animate Lights */
      if (rimLight && supportsRectAreaLight) {
        // Pulse rim light intensity between 1.5 and 3.5
        rimLight.intensity = 1.5 + Math.sin(time * 2) * 0.5;
      }

      if (keyLight && supportsRectAreaLight) {
        // Very subtle pulse on the main light between 1.3 and 1.7
        keyLight.intensity = 1.5 + Math.sin(time * 1.2) * 0.2;
      }

      /* Fix aspect on window resize */
      if (this.renderer && resizeRenderer(this.renderer)) {
        const canvas = this.renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        this.composer?.setSize(canvas.clientWidth, canvas.clientHeight);

        /* Reset camera */
        if (window.innerWidth < 630) {
          camera.position.set(_positions._m._x, _positions._m._y, _positions._m._z);
          camera.lookAt(_targets._m._x, _targets._m._y, _targets._m._z);
        } else {
          camera.position.set(_positions._d._x, _positions._d._y, _positions._d._z);
          camera.lookAt(_targets._d._x, _targets._d._y, _targets._d._z);
        }
      }

      /* Rotate logo */
      if (logo){
        // Smoothly interpolate current rotation towards target mouse rotation
        logo.MAIN.rotation.x += (targetRotationX - logo.MAIN.rotation.x) * 0.05;
        logo.MAIN.rotation.y += (targetRotationY - logo.MAIN.rotation.y) * 0.05;
      }

      /* Render Frame */
      this.composer?.render();
    }

    /**
     * ResizeRenderer
     * Checks if render needs to be resized to container size
     */
    function resizeRenderer(renderer) {
      /* Declare variables */
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      /* Determine if renderer needs resize */
      const needsResize = canvas.width !== width || canvas.height !== height;

      /* Resize renderer */
      if (needsResize) {
        renderer.width = width;
        renderer.height = height;
        renderer.setSize(width, height, false)
      }

      /* Return resize boolean */
      return needsResize;
    }

    render(0);
  }
}
