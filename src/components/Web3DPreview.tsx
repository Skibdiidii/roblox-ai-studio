import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PreviewElement, DeviceViewport, DeviceOrientation } from '../types';
import {
  RotateCcw,
  Play,
  Pause,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  MessageSquare,
  Users
} from 'lucide-react';

interface Web3DPreviewProps {
  elements: PreviewElement[];
  onSelectElement?: (element: PreviewElement) => void;
}

export function Web3DPreview({ elements, onSelectElement }: Web3DPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [showWireframe, setShowWireframe] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PreviewElement | null>(null);
  const [dummyCount, setDummyCount] = useState(0);
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [orientation, setOrientation] = useState<DeviceOrientation>('landscape');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsState = useRef({
    isDragging: false,
    isPanning: false,
    previousMousePosition: { x: 0, y: 0 },
    radius: 75,
    theta: 45,
    phi: 60,
    target: new THREE.Vector3(0, 2, 0)
  });
  const animatedObjectsRef = useRef<{ mesh: THREE.Object3D; basePos: THREE.Vector3; type: string; speed: number }[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const dummies = elements.filter(e => e.type === 'dummy').length;
    setDummyCount(dummies);
  }, [elements]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const updateCameraPos = () => {
      const state = controlsState.current;
      const phiRad = THREE.MathUtils.degToRad(state.phi);
      const thetaRad = THREE.MathUtils.degToRad(state.theta);
      camera.position.x = state.target.x + state.radius * Math.sin(phiRad) * Math.sin(thetaRad);
      camera.position.y = state.target.y + state.radius * Math.cos(phiRad);
      camera.position.z = state.target.z + state.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      camera.lookAt(state.target);
    };
    updateCameraPos();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.shiftKey) {
        controlsState.current.isPanning = true;
      } else {
        controlsState.current.isDragging = true;
      }
      controlsState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const state = controlsState.current;
      const deltaX = e.clientX - state.previousMousePosition.x;
      const deltaY = e.clientY - state.previousMousePosition.y;

      if (state.isDragging) {
        state.theta -= deltaX * 0.4;
        state.phi = Math.max(10, Math.min(88, state.phi - deltaY * 0.4));
        updateCameraPos();
      } else if (state.isPanning) {
        const panSpeed = 0.05 * (state.radius / 50);
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();

        const up = new THREE.Vector3();
        up.copy(camera.up).normalize();

        state.target.addScaledVector(right, -deltaX * panSpeed);
        state.target.addScaledVector(up, deltaY * panSpeed);
        updateCameraPos();
      }
      state.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      controlsState.current.isDragging = false;
      controlsState.current.isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = controlsState.current;
      state.radius = Math.max(15, Math.min(220, state.radius + e.deltaY * 0.08));
      updateCameraPos();
    };

    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        controlsState.current.isDragging = true;
        controlsState.current.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        controlsState.current.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const state = controlsState.current;
      if (e.touches.length === 1 && state.isDragging) {
        const deltaX = e.touches[0].clientX - state.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - state.previousMousePosition.y;
        state.theta -= deltaX * 0.5;
        state.phi = Math.max(10, Math.min(88, state.phi - deltaY * 0.5));
        updateCameraPos();
        state.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = touchStartDist - dist;
        state.radius = Math.max(15, Math.min(220, state.radius + delta * 0.15));
        updateCameraPos();
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      controlsState.current.isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('contextmenu', e => e.preventDefault());

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    animatedObjectsRef.current = [];

    let skyColor = 0x0f172a;
    let groundColor = 0x1e293b;
    let sunColor = 0xffffff;
    let sunIntensity = 1.6;
    let ambientIntensity = 0.7;

    if (timeOfDay === 'day') {
      skyColor = 0x38bdf8;
      groundColor = 0x14532d;
      sunColor = 0xfffbeb;
      sunIntensity = 2.0;
      ambientIntensity = 0.8;
      scene.fog = new THREE.FogExp2(0x93c5fd, 0.005);
    } else if (timeOfDay === 'sunset') {
      skyColor = 0xf97316;
      groundColor = 0x451a03;
      sunColor = 0xfb923c;
      sunIntensity = 1.8;
      ambientIntensity = 0.6;
      scene.fog = new THREE.FogExp2(0x7c2d12, 0.006);
    } else {
      skyColor = 0x020617;
      groundColor = 0x090d16;
      sunColor = 0x38bdf8;
      sunIntensity = 0.8;
      ambientIntensity = 0.3;
      scene.fog = new THREE.FogExp2(0x020617, 0.008);
    }

    scene.background = new THREE.Color(skyColor);

    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(sunColor, sunIntensity);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const baseplateGeo = new THREE.BoxGeometry(160, 1, 160);
    const baseplateMat = new THREE.MeshStandardMaterial({
      color: groundColor,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: showWireframe
    });
    const baseplate = new THREE.Mesh(baseplateGeo, baseplateMat);
    baseplate.position.y = -0.5;
    baseplate.receiveShadow = true;
    scene.add(baseplate);

    const grid = new THREE.GridHelper(160, 40, 0x475569, 0x334155);
    grid.position.y = 0.02;
    scene.add(grid);

    elements.forEach(elem => {
      let group = new THREE.Group();
      group.position.set(elem.position[0], elem.position[1], elem.position[2]);

      const baseMat = new THREE.MeshStandardMaterial({
        color: elem.color,
        roughness: 0.5,
        metalness: 0.2,
        wireframe: showWireframe
      });

      if (elem.type === 'dummy') {
        const torsoGeo = new THREE.BoxGeometry(elem.size[0], elem.size[1] * 0.5, elem.size[2]);
        const torso = new THREE.Mesh(torsoGeo, baseMat);
        torso.castShadow = true;
        torso.receiveShadow = true;
        group.add(torso);

        const headGeo = new THREE.BoxGeometry(elem.size[0] * 0.65, elem.size[0] * 0.65, elem.size[2]);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = elem.size[1] * 0.45;
        head.castShadow = true;
        group.add(head);

        const postGeo = new THREE.CylinderGeometry(0.3, 0.3, elem.size[1] * 0.5, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x52525b });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.y = -elem.size[1] * 0.4;
        post.castShadow = true;
        group.add(post);

        animatedObjectsRef.current.push({
          mesh: group,
          basePos: new THREE.Vector3(elem.position[0], elem.position[1], elem.position[2]),
          type: 'dummy',
          speed: 2 + Math.random() * 2
        });
      } else if (elem.type === 'spawn') {
        const padGeo = new THREE.BoxGeometry(elem.size[0], elem.size[1], elem.size[2]);
        const pad = new THREE.Mesh(padGeo, baseMat);
        pad.receiveShadow = true;
        group.add(pad);

        const ringGeo = new THREE.TorusGeometry(elem.size[0] * 0.35, 0.2, 12, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0x10b981, emissiveIntensity: 0.4 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = elem.size[1] * 0.55;
        group.add(ring);

        animatedObjectsRef.current.push({
          mesh: ring,
          basePos: new THREE.Vector3(0, elem.size[1] * 0.55, 0),
          type: 'spin',
          speed: 1.5
        });
      } else if (elem.type === 'npc') {
        const torsoGeo = new THREE.BoxGeometry(elem.size[0], elem.size[1] * 0.55, elem.size[2]);
        const torso = new THREE.Mesh(torsoGeo, baseMat);
        torso.castShadow = true;
        group.add(torso);

        const headGeo = new THREE.BoxGeometry(elem.size[0] * 0.7, elem.size[0] * 0.7, elem.size[2]);
        const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.5 }));
        head.position.y = elem.size[1] * 0.5;
        head.castShadow = true;
        group.add(head);

        const iconGeo = new THREE.OctahedronGeometry(0.7);
        const iconMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.5 });
        const icon = new THREE.Mesh(iconGeo, iconMat);
        icon.position.y = elem.size[1] * 1.0;
        group.add(icon);

        animatedObjectsRef.current.push({
          mesh: icon,
          basePos: new THREE.Vector3(0, elem.size[1] * 1.0, 0),
          type: 'float_spin',
          speed: 2
        });
      } else if (elem.shape === 'cylinder') {
        const geo = new THREE.CylinderGeometry(elem.size[0] / 2, elem.size[0] / 2, elem.size[1], 32);
        const mesh = new THREE.Mesh(geo, baseMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      } else if (elem.shape === 'sphere') {
        const geo = new THREE.SphereGeometry(elem.size[0] / 2, 24, 24);
        const mesh = new THREE.Mesh(geo, baseMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        animatedObjectsRef.current.push({
          mesh: group,
          basePos: new THREE.Vector3(elem.position[0], elem.position[1], elem.position[2]),
          type: 'egg_pulse',
          speed: 1.8
        });
      } else {
        const geo = new THREE.BoxGeometry(elem.size[0], elem.size[1], elem.size[2]);
        const mesh = new THREE.Mesh(geo, baseMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      }

      scene.add(group);
    });

    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isPlayingAnimation) {
        animatedObjectsRef.current.forEach(item => {
          if (item.type === 'dummy') {
            item.mesh.position.y = item.basePos.y + Math.sin(elapsedTime * item.speed) * 0.15;
            item.mesh.rotation.y = Math.sin(elapsedTime * item.speed * 0.5) * 0.1;
          } else if (item.type === 'spin') {
            item.mesh.rotation.z += 0.02;
          } else if (item.type === 'float_spin') {
            item.mesh.rotation.y += 0.03;
            item.mesh.position.y = item.basePos.y + Math.sin(elapsedTime * 3) * 0.2;
          } else if (item.type === 'egg_pulse') {
            const scale = 1 + Math.sin(elapsedTime * item.speed) * 0.05;
            item.mesh.scale.set(scale, scale, scale);
          }
        });
      }

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [elements, timeOfDay, showWireframe, isPlayingAnimation]);

  const resetCamera = () => {
    controlsState.current.radius = 75;
    controlsState.current.theta = 45;
    controlsState.current.phi = 60;
    controlsState.current.target.set(0, 2, 0);
    const camera = cameraRef.current;
    if (!camera) return;
    const state = controlsState.current;
    const phiRad = THREE.MathUtils.degToRad(state.phi);
    const thetaRad = THREE.MathUtils.degToRad(state.theta);
    camera.position.x = state.target.x + state.radius * Math.sin(phiRad) * Math.sin(thetaRad);
    camera.position.y = state.target.y + state.radius * Math.cos(phiRad);
    camera.position.z = state.target.z + state.radius * Math.sin(phiRad) * Math.cos(thetaRad);
    camera.lookAt(state.target);
  };

  const getDeviceDimensions = () => {
    if (viewport === 'desktop') {
      return 'w-full h-full';
    }
    if (viewport === 'tablet') {
      return orientation === 'landscape'
        ? 'w-[820px] max-w-[96%] h-[560px] max-h-[94%]'
        : 'w-[560px] max-w-[96%] h-[780px] max-h-[94%]';
    }
    return orientation === 'landscape'
      ? 'w-[680px] max-w-[96%] h-[340px] max-h-[94%]'
      : 'w-[360px] max-w-[96%] h-[680px] max-h-[94%]';
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950 flex flex-col overflow-hidden select-none">
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-md backdrop-blur-md shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-300">3D PREVIEW</span>
        </div>

        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 rounded-md backdrop-blur-md">
          <button
            id="btn-viewport-desktop"
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop Mode (Full)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            id="btn-viewport-tablet"
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet Device Viewport"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            id="btn-viewport-mobile"
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile Phone Viewport"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          {viewport !== 'desktop' && (
            <button
              id="btn-viewport-orientation"
              type="button"
              onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
              className="flex items-center gap-1 px-2 py-1 ml-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors border border-slate-700"
              title={`Orientation: ${orientation} (click to rotate)`}
            >
              <RotateCw className="w-3 h-3" />
              <span className="capitalize">{orientation}</span>
            </button>
          )}
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg backdrop-blur-md shadow-lg">
        <button
          id="btn-preview-toggle-anim"
          onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
          className={`p-1.5 rounded transition-colors ${isPlayingAnimation ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          title={isPlayingAnimation ? 'Pause Animation' : 'Play Animation'}
        >
          {isPlayingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          id="btn-preview-time-toggle"
          onClick={() => {
            const next = timeOfDay === 'day' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'day';
            setTimeOfDay(next);
          }}
          className="p-1.5 rounded text-slate-400 hover:text-amber-400 transition-colors"
          title={`Lighting: ${timeOfDay.toUpperCase()}`}
        >
          {timeOfDay === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : timeOfDay === 'sunset' ? <Sparkles className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        <button
          id="btn-preview-wireframe"
          onClick={() => setShowWireframe(!showWireframe)}
          className={`p-1.5 rounded transition-colors ${showWireframe ? 'bg-cyan-600/30 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
          title="Toggle Wireframe"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          id="btn-preview-reset-cam"
          onClick={resetCamera}
          className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full h-full flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
        {viewport === 'desktop' ? (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`relative ${getDeviceDimensions()} bg-slate-900 border-4 border-slate-700/90 rounded-[28px] shadow-2xl shadow-black/80 flex flex-col overflow-hidden ring-1 ring-white/10`}>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-slate-950/80 px-3 py-0.5 rounded-full border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>

              <div className="absolute top-0 left-0 right-0 h-9 bg-slate-950/80 backdrop-blur-md z-20 flex items-center justify-between px-3 border-b border-slate-800/60 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 bg-white rotate-12 rounded-[1px]"></div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <Users className="w-3 h-3 text-slate-400 ml-1" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 pointer-events-auto">
                  <span>Coins: 1,200</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-indigo-400">Power: 450</span>
                </div>
              </div>

              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

              <div className="absolute bottom-4 left-4 z-20 pointer-events-none opacity-60">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-xs">
                  <div className="w-5 h-5 rounded-full bg-white/30"></div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-20 pointer-events-none opacity-70">
                <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-xs text-white font-bold text-xs">
                  ▲
                </div>
              </div>

              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-slate-600/70 z-30 pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/85 border border-slate-800/80 px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-auto text-xs text-slate-300 flex items-center gap-3">
          <span>Objects: <strong className="text-white">{elements.length}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Dummies: <strong className="text-amber-400">{dummyCount}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            {viewport === 'desktop' ? 'Orbit: Drag · Pan: Shift/Right Drag · Zoom: Scroll' : 'Touch / Drag to orbit 3D view'}
          </span>
        </div>

        {selectedItem && (
          <div className="bg-indigo-950/90 border border-indigo-700/80 px-3 py-1.5 rounded-md backdrop-blur-sm pointer-events-auto text-xs text-indigo-200 flex items-center gap-2">
            <span>Selected: <strong>{selectedItem.name}</strong> ({selectedItem.type})</span>
            <button
              id="btn-preview-dismiss-selected"
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
