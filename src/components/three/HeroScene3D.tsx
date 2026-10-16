import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparkleIcon, Truck, Tag, ShieldCheck } from 'lucide-react';

interface HoverableProduceProps {
  position: [number, number, number];
  label: string;
  sublabel: string;
  reducedMotion: boolean;
  children: React.ReactNode;
}

const HoverableProduce: React.FC<HoverableProduceProps> = ({
  position,
  label,
  sublabel,
  reducedMotion,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (hovered) {
      groupRef.current.rotation.y += delta * 2.6;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.18, 0.1);
      groupRef.current.scale.lerp(new THREE.Vector3(1.22, 1.22, 1.22), 0.12);
    } else {
      if (!reducedMotion) {
        groupRef.current.rotation.y += delta * 0.45;
      }
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 2.1}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.85}
      position={position}
    >
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {children}
        {hovered && (
          <Html distanceFactor={8} position={[0, 0.72, 0]} center>
            <div className="pointer-events-none whitespace-nowrap rounded-xl bg-forest-950/90 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-md border border-forest-400/40">
              <p className="font-bold text-forest-300">{label}</p>
              <p className="text-[10px] text-cream-100/90">{sublabel}</p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

// 3D Apple Mesh
export const Apple3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.34, 28, 28]} />
      <meshStandardMaterial color="#e11d48" roughness={0.22} metalness={0.08} />
    </mesh>
    {/* Stem */}
    <mesh position={[0, 0.34, 0]}>
      <cylinderGeometry args={[0.02, 0.03, 0.16, 10]} />
      <meshStandardMaterial color="#5c4033" roughness={0.8} />
    </mesh>
    {/* Leaf */}
    <mesh position={[0.09, 0.36, 0]} rotation={[0.2, 0.3, -0.6]}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial color="#22c55e" roughness={0.35} />
    </mesh>
  </group>
);

// 3D Orange Mesh
export const Orange3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.33, 28, 28]} />
      <meshStandardMaterial color="#f97316" roughness={0.42} bumpScale={0.03} />
    </mesh>
    <mesh position={[0, 0.33, 0]}>
      <SphereLeaf />
    </mesh>
  </group>
);

const SphereLeaf = () => (
  <mesh position={[0.06, 0.02, 0]} rotation={[0, 0, -0.5]} scale={[1.4, 0.4, 0.8]}>
    <sphereGeometry args={[0.06, 12, 12]} />
    <meshStandardMaterial color="#15803d" roughness={0.4} />
  </mesh>
);

// 3D Banana Bunch
export const Banana3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale} rotation={[0.2, 0.4, -0.3]}>
    <mesh castShadow>
      <torusGeometry args={[0.34, 0.085, 16, 28, Math.PI * 0.78]} />
      <meshStandardMaterial color="#facc15" roughness={0.3} />
    </mesh>
    <mesh castShadow position={[0.05, -0.05, 0.07]} rotation={[0.1, 0.15, 0]}>
      <torusGeometry args={[0.33, 0.08, 16, 28, Math.PI * 0.75]} />
      <meshStandardMaterial color="#eab308" roughness={0.32} />
    </mesh>
  </group>
);

// 3D Grape Cluster
export const Grapes3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const offsets: [number, number, number][] = [
    [0, 0.15, 0],
    [-0.11, 0.12, 0.08],
    [0.11, 0.12, 0.08],
    [0, 0.12, -0.11],
    [-0.08, 0.0, 0.06],
    [0.08, 0.0, 0.06],
    [0, 0.0, -0.07],
    [0, -0.12, 0],
  ];
  return (
    <group scale={scale}>
      {offsets.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color="#6b21a8" roughness={0.18} metalness={0.12} />
        </mesh>
      ))}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  );
};

// 3D Strawberry
export const Strawberry3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh castShadow rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.24, 0.44, 22]} />
      <meshStandardMaterial color="#dc2626" roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.22, 0]}>
      <cylinderGeometry args={[0.18, 0.04, 0.06, 7]} />
      <meshStandardMaterial color="#16a34a" roughness={0.5} />
    </mesh>
  </group>
);

// 3D Carrot (Floating Vegetable)
export const Carrot3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale} rotation={[0.3, 0.2, -0.6]}>
    <mesh castShadow rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.16, 0.72, 22]} />
      <meshStandardMaterial color="#ea580c" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0.2]}>
      <coneGeometry args={[0.14, 0.25, 8]} />
      <meshStandardMaterial color="#16a34a" roughness={0.45} />
    </mesh>
  </group>
);

// 3D Vine Tomato (Floating Vegetable)
export const Tomato3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh castShadow scale={[1.08, 0.88, 1.08]}>
      <sphereGeometry args={[0.31, 26, 26]} />
      <meshStandardMaterial color="#ef4444" roughness={0.16} metalness={0.08} />
    </mesh>
    <mesh position={[0, 0.28, 0]}>
      <cylinderGeometry args={[0.14, 0.02, 0.05, 6]} />
      <meshStandardMaterial color="#15803d" roughness={0.5} />
    </mesh>
  </group>
);

// 3D Broccoli Florets (Floating Vegetable)
export const Broccoli3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <mesh position={[0, -0.14, 0]} castShadow>
      <cylinderGeometry args={[0.11, 0.08, 0.32, 14]} />
      <meshStandardMaterial color="#86efac" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.1, 0]} castShadow>
      <sphereGeometry args={[0.22, 18, 18]} />
      <meshStandardMaterial color="#15803d" roughness={0.75} />
    </mesh>
    <mesh position={[-0.14, 0.05, 0.08]} castShadow>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial color="#166534" roughness={0.75} />
    </mesh>
    <mesh position={[0.14, 0.05, 0.08]} castShadow>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial color="#16a34a" roughness={0.75} />
    </mesh>
  </group>
);

// 3D Bell Pepper / Capsicum (Floating Vegetable)
export const BellPepper3D: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <group scale={scale}>
    <RoundedBox args={[0.42, 0.46, 0.42]} radius={0.14} smoothness={4} castShadow>
      <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.05} />
    </RoundedBox>
    <mesh position={[0, 0.26, 0]} rotation={[0, 0, -0.15]}>
      <cylinderGeometry args={[0.03, 0.04, 0.14, 10]} />
      <meshStandardMaterial color="#15803d" roughness={0.5} />
    </mesh>
  </group>
);

// 3D Woven Fruit Basket
const WovenFruitBasket: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const basketRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!basketRef.current) return;
    if (!reducedMotion) {
      basketRef.current.rotation.y += delta * 0.28;
    }
    // Smooth mouse-following parallax
    const targetX = state.pointer.y * 0.18;
    const targetZ = -state.pointer.x * 0.18;
    basketRef.current.rotation.x = THREE.MathUtils.lerp(basketRef.current.rotation.x, targetX, 0.06);
    basketRef.current.rotation.z = THREE.MathUtils.lerp(basketRef.current.rotation.z, targetZ, 0.06);
  });

  return (
    <group ref={basketRef} position={[0, -0.35, 0]}>
      {/* Woven Basket Body */}
      <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1.38, 0.92, 0.88, 32]} />
        <meshStandardMaterial color="#b45309" roughness={0.72} metalness={0.05} />
      </mesh>
      {/* Woven Rim */}
      <mesh castShadow position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.09, 16, 48]} />
        <meshStandardMaterial color="#92400e" roughness={0.65} />
      </mesh>
      {/* Decorative Green Ribbon Band */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.26, 1.18, 0.16, 32]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>
      {/* Basket Arched Handle */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <torusGeometry args={[1.32, 0.065, 16, 48, Math.PI]} />
        <meshStandardMaterial color="#78350f" roughness={0.68} />
      </mesh>

      {/* Fruits nested inside the rotating basket: Apples, Oranges, Bananas, Grapes, Strawberries */}
      <group position={[-0.55, 0.35, 0.3]}>
        <Apple3D scale={1.05} />
      </group>
      <group position={[0.52, 0.34, 0.35]}>
        <Orange3D scale={1.05} />
      </group>
      <group position={[0.05, 0.46, 0.05]}>
        <Banana3D scale={1.25} />
      </group>
      <group position={[-0.38, 0.42, -0.42]}>
        <Grapes3D scale={1.2} />
      </group>
      <group position={[0.45, 0.38, -0.38]}>
        <Strawberry3D scale={1.1} />
      </group>
      <group position={[0, 0.32, 0.62]}>
        <Strawberry3D scale={0.95} />
      </group>
      <group position={[-0.75, 0.28, -0.1]}>
        <Orange3D scale={0.88} />
      </group>
      <group position={[0.72, 0.28, -0.05]}>
        <Apple3D scale={0.9} />
      </group>
    </group>
  );
};

// Animated Floating Green Leaves
const FloatingLeavesField: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const leavesRef = useRef<THREE.Group>(null);
  const leaves = useMemo(
    () => [
      { pos: [-2.4, 1.5, -0.8] as [number, number, number], rot: [0.4, 0.5, 0.2] as [number, number, number], scale: 0.9 },
      { pos: [2.5, 1.3, -0.6] as [number, number, number], rot: [-0.3, 0.8, -0.4] as [number, number, number], scale: 1.0 },
      { pos: [-2.1, -1.2, 0.5] as [number, number, number], rot: [0.2, -0.5, 0.6] as [number, number, number], scale: 0.75 },
      { pos: [2.2, -1.1, 0.6] as [number, number, number], rot: [0.6, 0.2, -0.5] as [number, number, number], scale: 0.85 },
      { pos: [0.2, 2.1, -1.1] as [number, number, number], rot: [0.1, 0.9, 0.3] as [number, number, number], scale: 0.7 },
    ],
    []
  );

  useFrame((state) => {
    if (!leavesRef.current || reducedMotion) return;
    leavesRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(state.clock.elapsedTime * 1.4 + i) * 0.0018;
      child.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={leavesRef}>
      {leaves.map((l, idx) => (
        <mesh key={idx} position={l.pos} rotation={l.rot} scale={[l.scale * 1.6, l.scale * 0.35, l.scale * 0.9]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#22c55e" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};

export const HeroScene3D: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  return (
    <div className="relative h-[440px] sm:h-[520px] lg:h-[570px] w-full select-none">
      {/* Subtle Sunlight Glow Backdrop */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-forest-200/50 via-cream-100/30 to-citrus-100/50 blur-2xl" />

      {/* Floating Discount & Delivery Badges around the 3D Scene */}
      <div className="pointer-events-none absolute left-2 top-4 z-10 sm:left-4 sm:top-6">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-soft backdrop-blur-md border border-forest-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-citrus-500 text-white shadow-sm">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-citrus-600">Coupon GREEN10</p>
            <p className="text-xs font-semibold text-slate-800">10% OFF Eligible Orders</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-2 top-12 z-10 sm:right-4 sm:top-10">
        <div className="flex items-center gap-2.5 rounded-2xl bg-forest-900/95 px-3.5 py-2.5 text-white shadow-soft backdrop-blur-md border border-forest-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-500 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-300">Vegetable Grading</p>
            <p className="text-xs font-semibold text-white">Grade A • Grade B • Grade C</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-3 z-10 sm:bottom-6 sm:left-6">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-soft backdrop-blur-md border border-forest-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600 text-white animate-truck">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">Scheduled & Express</p>
            <p className="text-xs font-semibold text-slate-800">7 AM – 8 PM Slots + 45m Express</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 right-3 z-10 hidden sm:flex items-center gap-1.5 rounded-full bg-forest-950/80 px-3 py-1.5 text-[11px] font-medium text-forest-200 backdrop-blur-md">
        <SparkleIcon className="h-3.5 w-3.5 text-citrus-400" />
        <span>Hover 3D fruits & veggies to inspect</span>
      </div>

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.15, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Warm Morning Sunlight & Ambient Fill */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.55}
          color="#fffbeb"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -3]} intensity={0.7} color="#4ade80" />
        <pointLight position={[4, -2, 2]} intensity={0.5} color="#fb923c" />

        {!reducedMotion && (
          <Sparkles count={32} scale={5.5} size={2.2} speed={0.35} color="#86efac" opacity={0.65} />
        )}

        {/* Central Rotating 3D Fruit Basket */}
        <WovenFruitBasket reducedMotion={reducedMotion} />

        {/* Orbiting / Floating 3D Vegetables & Fruits (Interactive on Hover!) */}
        <HoverableProduce
          position={[-2.05, 1.05, 0.35]}
          label="Vine-Ripened Tomato"
          sublabel="Grade A • ₹48/kg"
          reducedMotion={reducedMotion}
        >
          <Tomato3D scale={0.95} />
        </HoverableProduce>

        <HoverableProduce
          position={[2.05, 0.95, 0.3]}
          label="Ooty Sweet Carrot"
          sublabel="Grade A • ₹45/500g"
          reducedMotion={reducedMotion}
        >
          <Carrot3D scale={1.0} />
        </HoverableProduce>

        <HoverableProduce
          position={[-1.9, -0.65, 0.7]}
          label="Fresh Green Broccoli"
          sublabel="Grade A • ₹68/pc"
          reducedMotion={reducedMotion}
        >
          <Broccoli3D scale={0.95} />
        </HoverableProduce>

        <HoverableProduce
          position={[1.9, -0.6, 0.65]}
          label="Trio Bell Pepper"
          sublabel="Grade A • ₹64/500g"
          reducedMotion={reducedMotion}
        >
          <BellPepper3D scale={0.92} />
        </HoverableProduce>

        <HoverableProduce
          position={[0, 1.55, -0.35]}
          label="Kashmiri Honeycrisp Apple"
          sublabel="Wax-Free • ₹185/kg"
          reducedMotion={reducedMotion}
        >
          <Apple3D scale={0.88} />
        </HoverableProduce>

        <FloatingLeavesField reducedMotion={reducedMotion} />

        <ContactShadows position={[0, -1.55, 0]} opacity={0.32} scale={7} blur={2.4} far={4} />
      </Canvas>
    </div>
  );
};
