/**
 * three.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  RectAreaLight,
  MathUtils,
  MeshPhysicalMaterial,
  CircleGeometry,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  Color,
  Vector2,
  WebGLRenderTarget,
  Raycaster
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
export class ThreeComponent implements AfterViewInit {
  /* 3d Canvas Reference */
  @ViewChild("main") _canvas: ElementRef;

  /* Getter for canvas native element */
  private get canvas(): HTMLCanvasElement {
    return this._canvas.nativeElement;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    /* Create renderer and scene */
    let renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // Disabled alpha to fix post-processing transparency bugs
      antialias: true
    });
    renderer.setClearColor(new Color('#0c0c0c')); // Match site background
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    let scene = new Scene();

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

    camera.position.set(_positions._d._x, _positions._d._y, _positions._d._z);
    camera.lookAt(_targets._d._x, _targets._d._y, _targets._d._z);

    /* Create Lights */
    RectAreaLightUniformsLib.init();
    // let rectLight = new RectAreaLight("rgb(0,13,61)", 40, 1000, 1000);
    // rectLight.position.set(10,50,-200);
    // rectLight.rotation.y = MathUtils.degToRad(150);
    // let mainRectLight = new RectAreaLight("rgb(218,227,255)", 2.5, 100, 100);
    // mainRectLight.position.set(10,50,100);

    /* Studio 3-Point Lighting Setup */

    // Key Light - Main light, front-right, warm white
    let keyLight = new RectAreaLight("rgb(255,250,244)", 1, 60, 60);
    keyLight.position.set(30, 40, 50);
    keyLight.lookAt(0, 27, 0);

    // Fill Light - Softer, front-left, neutral/cool
    let fillLight = new RectAreaLight("rgb(200,210,255)", 2, 50, 50);
    fillLight.position.set(-35, 30, 40);
    fillLight.lookAt(0, 27, 0);

    // Rim/Back Light - Behind, creates edge separation, blue accent
    let rimLight = new RectAreaLight("rgb(80,120,255)", 2, 80, 80);
    rimLight.position.set(0, 35, -40);
    rimLight.lookAt(0, 27, 0);

    /* Gradient Floor Plane */
    const floorGeometry = new CircleGeometry(25, 64);
    const floorMaterial = new ShaderMaterial({
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
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 18, 0);
    scene.add(floor);

    /* Load GLTF Object */
    const gltfLoader = new GLTFLoader();
    let gltfObj;
    let logo;

    gltfLoader.load('assets/3d/home-1.gltf', ( gltf => {
      /* Get gltf objects */
      gltfObj = gltf.scene;

      /* Set object scene size */
      gltfObj.scale.set(.5,.5,.5);

      /* create material */
      let material = new MeshPhysicalMaterial({
        color: "rgb(250,100,100)",
        metalness: 1.0,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.02,
        reflectivity: 0.75,
        flatShading: false
      });

      /* Apply material */
      gltfObj.traverse(obj => {
        if (obj.isMesh) obj.material = material;
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
      scene.add(gltfObj);
      scene.add(keyLight);
      scene.add(fillLight);
      scene.add(rimLight);

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

      // Handle hover cursor
      this.canvas.addEventListener('mousemove', (event) => {
        if (!logo || isAnimating) {
          this.canvas.style.cursor = 'default';
          return;
        }

        const rect = this.canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(logo.CHUNKS, true);

        this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
      });

      this.canvas.addEventListener('dblclick', (event) => {
        if (!logo || isAnimating) return;

        // Calculate mouse position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

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

            // Random rotation jiggle
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
      });
    }))

    /* Post-processing (Bloom) */
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.15; // Only glow bright things
    bloomPass.strength = 0.2;   // Intensity of the glow
    bloomPass.radius = 0.5;     // Softness/spread of the glow

    // Restore Anti-Aliasing for EffectComposer
    const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      samples: 4
    });

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    /* Render animation frames */
    const render = (timeMs: number) => {
      requestAnimationFrame(render);
      const time = timeMs * 0.001; // Convert to seconds

      /* Animate Lights */
      if (rimLight) {
        // Pulse rim light intensity between 2.5 and 5.5
        rimLight.intensity = 4 + Math.sin(time * 2) * 1.5;
      }

      if (keyLight) {
        // Very subtle pulse on the main light between 2.7 and 3.3
        keyLight.intensity = 3 + Math.sin(time * 1.2) * 0.3;
      }

      /* Fix aspect on window resize */
      if (resizeRenderer(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        composer.setSize(canvas.clientWidth, canvas.clientHeight);

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
        if (window.innerWidth < 630)
          logo.MAIN.rotation.y += MathUtils.degToRad(-.5);
        else
          logo.MAIN.rotation.y += MathUtils.degToRad(-.3);
      }

      /* Render Frame */
      composer.render();
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

    /**
     * ObjectToSceneGraph
     * Prints gltf object scenegraph
     * */
    const objectToSceneGraph = (obj, lines = [], isLast = true, prefix = '') => {
      const localPrefix = isLast ? '└─' : '├─';
      lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);

      const newPrefix = prefix + (isLast ? '  ' : '│ ');
      const lastNdx = obj.children.length - 1;

      obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        objectToSceneGraph(child, lines, isLast, newPrefix);
      });

      return lines;
    }

    render(0);
  }
}
