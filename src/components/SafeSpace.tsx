import { Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Shield, Mail } from "lucide-react";

type SectionId = "home" | "what" | "where" | "when" | "want" | "connect";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "what", label: "What" },
  { id: "where", label: "Where" },
  { id: "when", label: "When" },
  { id: "want", label: "Action" },
  { id: "connect", label: "Connect" },
];

function PCModel({
  pointer,
  children,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointer.current.x * 0.35;
    const targetX = -pointer.current.y * 0.2;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
  });

  return (
    <group ref={group}>
      {/* Monitor base */}
      <mesh position={[0, -1.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 0.8]} />
        <meshStandardMaterial color="#2a2d3a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 24]} />
        <meshStandardMaterial color="#3a3d4a" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Monitor frame */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[3.6, 2.3, 0.18]} />
        <meshStandardMaterial color="#1a1c24" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Screen recess */}
      <mesh position={[0, 0.12, 0.092]}>
        <boxGeometry args={[3.4, 2.1, 0.02]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* HTML screen content */}
      <Html
        transform
        occlude
        position={[0, 0.12, 0.105]}
        distanceFactor={1.2}
        style={{
          width: "560px",
          height: "345px",
          borderRadius: "6px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #faf7ff 0%, #f0eafc 100%)",
        }}
      >
        {children}
      </Html>
      {/* Brand bump */}
      <mesh position={[0, -1.05, 0.1]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function ScreenContent({ section }: { section: SectionId }) {
  return (
    <div className="w-full h-full p-6 text-slate-800 font-sans overflow-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="h-full"
        >
          {section === "home" && <Home />}
          {section === "what" && <WhatHappened />}
          {section === "where" && <Where />}
          {section === "when" && <When />}
          {section === "want" && <WhatYouWant />}
          {section === "connect" && <Connect />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400";

function Home() {
  return (
    <div className="flex flex-col h-full justify-center text-center">
      <Shield className="mx-auto mb-3 text-violet-600" size={40} />
      <h1 className="text-2xl font-bold text-slate-900">You are heard.</h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
        A private space for women to share what they were not yet ready to say.
        Use the navigation to file a complaint, anonymously and at your own pace.
      </p>
      <p className="mt-4 text-xs text-violet-700 font-medium">
        Tap the arrows or the menu above to navigate the screen.
      </p>
    </div>
  );
}

function WhatHappened() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">What happened?</h2>
      <Field label="Type of incident">
        <select className={inputClass}>
          <option>Select…</option>
          <option>Sexual assault</option>
          <option>Rape</option>
          <option>Harassment</option>
          <option>Stalking</option>
          <option>Domestic violence</option>
          <option>Other</option>
        </select>
      </Field>
      <Field label="Describe in your own words (optional)">
        <textarea rows={3} className={inputClass} placeholder="You can write as little or as much as you want…" />
      </Field>
    </div>
  );
}

function Where() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">Where did it happen?</h2>
      <Field label="State"><input className={inputClass} placeholder="e.g. Maharashtra" /></Field>
      <Field label="City"><input className={inputClass} placeholder="e.g. Mumbai" /></Field>
      <Field label="Locality (optional)"><input className={inputClass} placeholder="Neighbourhood, landmark…" /></Field>
    </div>
  );
}

function When() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">When did it happen?</h2>
      <Field label="Date of incident"><input type="date" className={inputClass} /></Field>
      <Field label="Approximate time (optional)"><input type="time" className={inputClass} /></Field>
    </div>
  );
}

function WhatYouWant() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">What do you want?</h2>
      <p className="text-xs text-slate-600 mb-3">Choose how you'd like this incident to be addressed.</p>
      {["File a direct complaint to police", "Pursue legal action in court", "Social media reform / awareness", "Just record it — I am not ready yet"].map((opt) => (
        <label key={opt} className="flex items-start gap-2 mb-2 rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm cursor-pointer hover:bg-violet-50">
          <input type="radio" name="action" className="mt-1 accent-violet-600" />
          <span>{opt}</span>
        </label>
      ))}
      <button className="mt-3 w-full rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2 transition">
        Submit complaint
      </button>
    </div>
  );
}

function Connect() {
  return (
    <div className="flex flex-col h-full justify-center text-center">
      <Mail className="mx-auto mb-3 text-violet-600" size={36} />
      <h2 className="text-xl font-bold text-slate-900">Connect with us</h2>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
        If you'd like to share your personal experience privately, you can email:
      </p>
      <a
        href="mailto:infocasetch@gmail.com"
        className="mt-3 inline-block font-semibold text-violet-700 hover:text-violet-900 break-all"
      >
        infocasetch@gmail.com
      </a>
      <p className="mt-3 text-xs text-slate-500">Your message is confidential.</p>
    </div>
  );
}

export default function SafeSpace() {
  const [section, setSection] = useState<SectionId>("home");
  const pointer = useRef({ x: 0, y: 0 });

  const idx = SECTIONS.findIndex((s) => s.id === section);
  const next = () => setSection(SECTIONS[(idx + 1) % SECTIONS.length].id);
  const prev = () => setSection(SECTIONS[(idx - 1 + SECTIONS.length) % SECTIONS.length].id);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900"
      onPointerMove={(e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        pointer.current = { x, y };
      }}
    >
      {/* Glassmorphism nav */}
      <nav className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-2 py-2 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
        <ul className="flex items-center gap-1">
          <li className="px-3 py-1.5 text-xs font-bold text-white/90 tracking-widest border-r border-white/20 mr-1">
            CASETCH
          </li>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setSection(s.id)}
                className={`px-3 py-1.5 rounded-xl text-sm transition ${
                  section === s.id
                    ? "bg-white text-violet-700 font-semibold"
                    : "text-white/80 hover:bg-white/15"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
      >
        <ChevronRight size={22} />
      </button>

      {/* Footer hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/60 text-xs tracking-wide">
        Move your mouse to tilt the screen · A safe, anonymous space
      </div>

      <Canvas shadows camera={{ position: [0, 0.3, 5.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#0b0716"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.3} color="#a78bfa" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
            <PCModel pointer={pointer}>
              <ScreenContent section={section} />
            </PCModel>
          </Float>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
