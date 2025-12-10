'use client';
// w 
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Glitch, ChromaticAberration } from "@react-three/postprocessing";

import * as THREE from "three";

  // @ts-ignore
import CLOUDS2 from 'vanta/dist/vanta.clouds2.min';

export default function Home() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [aberrationOffset, setAberrationOffset] = useState<number[]>([0.04, 0.05]);

  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    if (vantaEffect && typeof vantaEffect.destroy === "function") {
      vantaEffect.destroy();
      setVantaEffect(null);
    }

    const options = {
      el: vantaRef.current,
      THREE,
      backgroundColor: lightMode ? 0xf7f7f7 : 0x990000,
      skyColor: lightMode ? 0xf0f0f0 : 0x990000,
      cloudColor: lightMode ? 0xe0e0e0 : 0xc30101,
      lightColor: lightMode ? 0xffffff : 0xcd1c18,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      texturePath: "/gallery/noise.png"
    };

    setVantaEffect((CLOUDS2 as any)(options));

    return () => {
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
  }, [lightMode]);

  function handleToggleMode() {
    setLightMode((e) => !e);
    setAberrationOffset((prev) =>
      prev[0] > 0.01 ? [0.003, 0.003] : [0.04, 0.05]
    );
  }

  return (
    <div
      ref={vantaRef}
      className={
        lightMode
          ? "w-full h-screen relative overflow-hidden bg-white"
          : "w-full h-screen relative overflow-hidden"
      }
    >
      <div className="absolute z-30 top-4 right-4">
        <button
          onClick={handleToggleMode}
          className="px-3 py-2 rounded-lg bg-white hover:bg-white/20 border hover:text-white border-white/20 text-black backdrop-blur-sm"
          aria-pressed={lightMode}
        >
          {lightMode ? "Dark mode" : "Light mode"}
        </button>
      </div>

      <div className="absolute inset-0 z-10">
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 50, 120], fov: 45 }}
        >
          <ambientLight intensity={0.67} />
          <directionalLight position={[50, 20, 10]} intensity={3} />

          <Suspense fallback={null}>
            <Model src="/fgc_skeleton.glb" />
          </Suspense>

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.7} intensity={1.5} />
            <ChromaticAberration offset={aberrationOffset} />
       <Glitch
          {...({
            delay: 2,
            duration: 0.4,
            strength: 0.15,
          } as any)}
/>

          </EffectComposer>

          <OrbitControls
            target={[0, 33, 0]}
            enablePan={false}
            enableZoom={false}
          />
        </Canvas>
      </div>
    </div>
  );
}

function Model({ src, ...props }: { src: string } & JSX.IntrinsicElements["group"]) {
  const gltf = useGLTF(src) as any;

  useFrame((_, delta) => {
    if (gltf.scene) gltf.scene.rotation.y += delta * 0.3;
  });

  return (
    <group {...props} scale={1.4}>
      <primitive object={gltf.scene} />
    </group>
  );
}
