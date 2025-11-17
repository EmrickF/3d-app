
'use client'
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

export default function Home() {
  
  return (
    <Canvas camera={{position: [30,30,3]}}>
      <ambientLight intensity={0.5} />
      <pointLight position={[23,1,4]} />
        <Cube />
      <OrbitControls/>
    </Canvas>
  );
}
function Cube() {
  const cubeRef = useRef<Mesh>(null)
  useFrame((_, delta)=> {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta
    }
  })
  return (
    <mesh ref={cubeRef}>
        <boxGeometry args={[3,3,3]} />
        <meshStandardMaterial color="red" />
      </mesh>
  )
}