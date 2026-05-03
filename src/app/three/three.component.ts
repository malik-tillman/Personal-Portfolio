/**
 * three.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  RectAreaLight,
  MathUtils,
  MeshPhysicalMaterial
} from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

  ngAfterViewInit(): void {
    /* Create renderer and scene */
    let renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true
    });
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

    let rectLight = new RectAreaLight("rgb(0,13,61)", 40, 1000, 1000);
    rectLight.position.set(10,50,-200);
    rectLight.rotation.y = MathUtils.degToRad(150);

    let secRectLight = new RectAreaLight("rgb(0,31,199)", 15, 100, 100);
    secRectLight.position.set(0,30,100);

    let mainRectLight = new RectAreaLight("rgb(218,227,255)", 2.5, 100, 100);
    mainRectLight.position.set(10,50,100);

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
        color: "rgb(237,0,0)",
        flatShading: true
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

      /* Add object and lights */
      scene.add(gltfObj);
      scene.add(rectLight);
      scene.add(mainRectLight);
      scene.add(secRectLight);
    }))

    /* Render animation frames */
    const render = () => {
      requestAnimationFrame(render);

      /* Fix aspect on window resize */
      if (resizeRenderer(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

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
      renderer.render(scene, camera);
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

    render();
  }
}
