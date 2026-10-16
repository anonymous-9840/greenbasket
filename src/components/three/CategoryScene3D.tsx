import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  Apple3D,
  Orange3D,
  Banana3D,
  Grapes3D,
  Strawberry3D,
  Carrot3D,
  Tomato3D,
  Broccoli3D,
  BellPepper3D,
} from './HeroScene3D';
import { CategoryType } from '../../types';

// 3D Almond / Dry Fruit Mesh
export const Almond3D: React.FC<{ scale?: number; color?: string }> = ({
  scale = 1,
  color = '#b45309',
}) => (
  <group scale={scale} rotation={[0.2, 0.3, -0.2]}>
    <mesh castShadow scale={[0.7, 1.25, 0.45]}>
      <sphereGeometry args={[0.38, 24, 24]} />
      <meshStandardMaterial color={color} roughness={0.48} metalness={0.05} />
    </mesh>
  </group>
);

// 3D Cashew / Walnut / Dry Fruit Bowl
export const DryFruitBowl3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh castShadow position={[0, -0.18, 0]}>
      <cylinderGeometry args={[0.85, 0.55, 0.45, 28]} />
      <meshStandardMaterial color="#78350f" roughness={0.6} />
    </mesh>
    <group position={[-0.25, 0.14, 0.15]}>
      <Almond3D scale={0.75} color="#b45309" />
    </group>
    <group position={[0.28, 0.14, 0.1]}>
      <Almond3D scale={0.75} color="#fde047" />
    </group>
    <group position={[0, 0.18, -0.18]}>
      <Almond3D scale={0.75} color="#84cc16" />
    </group>
    <group position={[-0.1, 0.22, 0.0]}>
      <Almond3D scale={0.7} color="#92400e" />
    </group>
  </group>
);

const RotatingCluster: React.FC<{ category: CategoryType; reducedMotion: boolean }> = ({
  category,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  if (category === 'fruits') {
    return (
      <group ref={groupRef}>
        <Float speed={reducedMotion ? 0 : 2} floatIntensity={0.6} position={[-1.1, 0.2, 0]}>
          <Apple3D scale={1.35} />
        </Float>
        <Float speed={reducedMotion ? 0 : 2.2} floatIntensity={0.7} position={[0, 0.35, 0.3]}>
          <Banana3D scale={1.4} />
        </Float>
        <Float speed={reducedMotion ? 0 : 1.8} floatIntensity={0.6} position={[1.1, 0.1, 0]}>
          <Orange3D scale={1.3} />
        </Float>
        <Float speed={reducedMotion ? 0 : 2.4} floatIntensity={0.6} position={[-0.5, -0.45, 0.4]}>
          <Strawberry3D scale={1.15} />
        </Float>
        <Float speed={reducedMotion ? 0 : 2.1} floatIntensity={0.6} position={[0.6, -0.4, 0.35]}>
          <Grapes3D scale={1.25} />
        </Float>
      </group>
    );
  }

  if (category === 'vegetables') {
    return (
      <group ref={groupRef}>
        <Float speed={reducedMotion ? 0 : 2} floatIntensity={0.6} position={[-1.15, 0.15, 0]}>
          <Tomato3D scale={1.35} />
        </Float>
        <Float speed={reducedMotion ? 0 : 2.2} floatIntensity={0.7} position={[0, 0.25, 0.25]}>
          <Broccoli3D scale={1.35} />
        </Float>
        <Float speed={reducedMotion ? 0 : 1.9} floatIntensity={0.6} position={[1.15, 0.15, 0]}>
          <Carrot3D scale={1.3} />
        </Float>
        <Float speed={reducedMotion ? 0 : 2.3} floatIntensity={0.6} position={[0, -0.45, 0.45]}>
          <BellPepper3D scale={1.15} />
        </Float>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.8} floatIntensity={0.5} position={[0, 0, 0]}>
        <DryFruitBowl3D scale={1.35} />
      </Float>
      <Float speed={reducedMotion ? 0 : 2.2} floatIntensity={0.7} position={[-1.3, 0.35, 0.2]}>
        <Almond3D scale={1.1} color="#b45309" />
      </Float>
      <Float speed={reducedMotion ? 0 : 2.1} floatIntensity={0.7} position={[1.3, 0.3, 0.2]}>
        <Almond3D scale={1.1} color="#84cc16" />
      </Float>
    </group>
  );
};

export const CategoryBanner3D: React.FC<{ category: CategoryType; reducedMotion: boolean }> = ({
  category,
  reducedMotion,
}) => {
  return (
    <div className="h-52 sm:h-60 w-full">
      <Canvas camera={{ position: [0, 0.4, 3.8], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        {!reducedMotion && <Sparkles count={18} scale={4} size={1.8} speed={0.3} color="#bbf7d0" />}
        <RotatingCluster category={category} reducedMotion={reducedMotion} />
        <ContactShadows position={[0, -1.1, 0]} opacity={0.28} scale={5} blur={2} />
      </Canvas>
    </div>
  );
};

const SingleProductMesh: React.FC<{
  modelType: string;
  primaryColor: string;
  reducedMotion: boolean;
}> = ({ modelType, primaryColor, reducedMotion }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.y += delta * 0.65;
    }
  });

  const renderShape = () => {
    switch (modelType) {
      case 'apple':
      case 'pomegranate':
      case 'mango':
      case 'watermelon':
      case 'kiwi':
      case 'papaya':
        return <Apple3D scale={2.1} />;
      case 'banana':
        return <Banana3D scale={2.1} />;
      case 'orange':
        return <Orange3D scale={2.1} />;
      case 'grapes':
        return <Grapes3D scale={2.1} />;
      case 'strawberry':
        return <Strawberry3D scale={2.1} />;
      case 'tomato':
      case 'onion':
      case 'potato':
        return <Tomato3D scale={2.1} />;
      case 'carrot':
      case 'cucumber':
      case 'okra':
        return <Carrot3D scale={1.9} />;
      case 'broccoli':
      case 'cauliflower':
      case 'cabbage':
      case 'spinach':
        return <Broccoli3D scale={2.0} />;
      case 'pepper':
        return <BellPepper3D scale={1.9} />;
      default:
        return <DryFruitBowl3D scale={1.6} />;
    }
  };

  return (
    <Float speed={reducedMotion ? 0 : 2} floatIntensity={0.5}>
      <group ref={ref}>
        {renderShape()}
        <pointLight position={[1.5, 1.5, 1.5]} intensity={0.5} color={primaryColor} />
      </group>
    </Float>
  );
};

export const ProductPreview3D: React.FC<{
  modelType: string;
  primaryColor: string;
  reducedMotion: boolean;
}> = ({ modelType, primaryColor, reducedMotion }) => {
  return (
    <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-gradient-to-br from-forest-950 via-forest-900 to-slate-900 overflow-hidden">
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-forest-200 backdrop-blur-md border border-white/15">
        Interactive 3D View • Drag to Rotate
      </div>
      <Canvas camera={{ position: [0, 0.5, 3.2], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} />
        <SingleProductMesh
          modelType={modelType}
          primaryColor={primaryColor}
          reducedMotion={reducedMotion}
        />
        <OrbitControls enableZoom={false} enablePan={false} />
        <ContactShadows position={[0, -1.1, 0]} opacity={0.4} scale={4} blur={2.2} />
      </Canvas>
    </div>
  );
};
