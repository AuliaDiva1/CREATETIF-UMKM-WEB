"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float, Center } from "@react-three/drei";
import { useRef } from "react";

// Komponen Kubus Kaca
const GlassCube = ({ scale = 1, config }) => {
  const mesh = useRef();

  // Animasi rotasi otomatis
  useFrame((state, delta) => {
    if (mesh.current) {
      // PERUBAHAN: Kecepatan rotasi diperlambat secara signifikan
      mesh.current.rotation.x += delta * 0.05; // Sebelumnya 0.2 (Sekarang 4x lebih lambat)
      mesh.current.rotation.y += delta * 0.08; // Sebelumnya 0.3
    }
  });

  return (
    // PERUBAHAN: speed={1} (Sebelumnya 2) agar gerakan mengambang lebih lambat & smooth
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} scale={scale * 3}>
        {/* Bentuk Geometri: Torus Knot (Lebih artistik daripada kubus biasa) */}
        <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
        
        {/* Material Kaca Premium */}
        <MeshTransmissionMaterial 
          backside
          samples={8} // Kualitas render (kurangi jika lag)
          resolution={512}
          thickness={config?.thickness || 2}
          chromaticAberration={config?.chromaticAberration || 0.5}
          anisotropy={config?.anisotropy || 0.1}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          ior={config?.ior || 1.2}
          color="#a5b4fc" // Warna tint kaca (kebiruan)
          background="#ffffff"
        />
      </mesh>
    </Float>
  );
};

const FluidGlass = ({ cubeProps }) => {
  return (
    // Canvas adalah area render 3D
    <Canvas 
      camera={{ position: [0, 0, 6], fov: 45 }} 
      style={{ background: 'transparent' }}
      dpr={[1, 2]} // Optimasi resolusi
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      
      <Center>
        <GlassCube scale={cubeProps?.scale || 1} config={cubeProps} />
      </Center>

      {/* Environment untuk refleksi kaca */}
      <Environment preset="city" />
    </Canvas>
  );
};

export default FluidGlass;