'use client';

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as THREE from 'three';

export interface WarpDriveShaderHandle {
  /** Kick off the warp-speed tunnel zoom. Calls `onComplete` when the flash
   *  is fully white (safe to scroll / navigate). Resets internally after. */
  triggerWarp: (onComplete: () => void) => void;
}

const WARP_DURATION_MS = 1400; // total ramp-up time
const MAX_SPEED        = 14;   // shader time multiplier at peak

const WarpDriveShader = forwardRef<WarpDriveShaderHandle>((_, ref) => {
  // Outer wrapper: fixed, fullscreen, clips the scaled inner div
  const clipRef      = useRef<HTMLDivElement>(null);
  // Inner wrapper: the div we CSS-scale for the zoom effect
  const zoomRef      = useRef<HTMLDivElement>(null);
  // Canvas host
  const canvasRef    = useRef<HTMLDivElement>(null);
  // White flash overlay
  const flashRef     = useRef<HTMLDivElement>(null);

  // Mutable refs shared between useEffect and useImperativeHandle
  const speedRef     = useRef(1);          // current shader speed multiplier
  const warpingRef   = useRef(false);      // guard against double-triggers
  const rafRef       = useRef<number>(0);  // rAF handle for cleanup

  /* ─── Expose triggerWarp ─────────────────────────────────────────── */
  useImperativeHandle(ref, () => ({
    triggerWarp(onComplete) {
      if (warpingRef.current) return;
      warpingRef.current = true;

      const startTime = performance.now();

      // Prevent body scroll while warping
      document.body.style.overflow = 'hidden';

      const tick = (now: number) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / WARP_DURATION_MS, 1);

        // Ease-in-quad for both speed and zoom
        const eased = progress * progress;

        // 1) Ramp shader speed
        speedRef.current = 1 + eased * (MAX_SPEED - 1);

        // 2) CSS zoom on inner wrapper (DOM direct — no React re-render)
        const scale = 1 + eased * 2.2;
        if (zoomRef.current) {
          zoomRef.current.style.transform = `scale(${scale})`;
        }

        // 3) Flash fades in during the last 35% of the animation
        if (progress > 0.65 && flashRef.current) {
          const flashProgress = (progress - 0.65) / 0.35;
          flashRef.current.style.opacity = String(
            Math.min(flashProgress * flashProgress, 1)
          );
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // Flash fully white — hand off to parent which will unmount this component
          if (flashRef.current) flashRef.current.style.opacity = '1';
          onComplete();
          // No reset needed: the parent will unmount us immediately after onComplete
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
  }));

  /* ─── Three.js setup ─────────────────────────────────────────────── */
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock  = new THREE.Clock();

    /* Vertex shader */
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    /* Fragment shader — tunnel rings */
    const fragmentShader = `
      precision highp float;
      uniform vec2  iResolution;
      uniform float iTime;
      uniform vec2  iMouse;

      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse          - 0.5 * iResolution.xy) / iResolution.y;

        float t = iTime * 0.5;
        uv -= mouse;

        float r = length(uv) * 0.8;

        vec3 col = vec3(0.0);
        float offset = 0.01;
        col.r = pow(fract(0.5 / length(uv + vec2(offset, 0.0)) + t * 2.0), 15.0);
        col.g = pow(fract(0.5 / length(uv)                     + t * 2.0), 15.0);
        col.b = pow(fract(0.5 / length(uv - vec2(offset, 0.0)) + t * 2.0), 15.0);

        float fade = smoothstep(0.0, 0.1, r);
        col *= fade;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const uniforms: {
      iTime:       THREE.IUniform<number>;
      iResolution: THREE.IUniform<THREE.Vector2>;
      iMouse:      THREE.IUniform<THREE.Vector2>;
    } = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    /* Resize */
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    /* Mouse */
    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(e.clientX, container.clientHeight - e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);

    /* Animation loop — uses accumulated time so speed multiplier works */
    let accTime  = 0;
    let lastReal = clock.getElapsedTime();

    renderer.setAnimationLoop(() => {
      const real  = clock.getElapsedTime();
      const delta = real - lastReal;
      lastReal    = real;

      accTime += delta * speedRef.current;
      uniforms.iTime.value = accTime;
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      canvas?.parentNode?.removeChild(canvas);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  /* ─── DOM structure ──────────────────────────────────────────────── */
  return (
    /* Outer: absolute within hero section, clips the scaled inner div */
    <div
      ref={clipRef}
      style={{
        position:     'absolute',
        inset:        0,
        zIndex:       0,
        pointerEvents:'none',
        overflow:     'hidden',
      }}
      aria-label="Warp Drive animated background"
    >
      {/* Inner: scaled for zoom effect */}
      <div
        ref={zoomRef}
        style={{
          width:           '100%',
          height:          '100%',
          transformOrigin: 'center center',
          willChange:      'transform',
        }}
      >
        {/* Canvas host */}
        <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* White flash overlay */}
      <div
        ref={flashRef}
        style={{
          position:     'absolute',
          inset:        0,
          background:   '#ffffff',
          opacity:      0,
          pointerEvents:'none',
        }}
      />
    </div>
  );
});

WarpDriveShader.displayName = 'WarpDriveShader';
export default WarpDriveShader;
