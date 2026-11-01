import React, { Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";

function Scene({ progress, pointer }) {
  const group = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progress;
    const targetX = pointer.x * 0.22;
    const targetY = pointer.y * 0.14;
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.position.z += ((5.8 - p * 1.7) - camera.position.z) * 0.018;

    if (group.current) {
      group.current.rotation.y += 0.0018;
      group.current.rotation.x = Math.sin(t * 0.25) * 0.035 + p * 0.08;
      group.current.position.y = Math.sin(t * 0.5) * 0.08 - p * 0.55;
    }
  });

  return (
    <>
      <color attach="background" args={["#040404"]} />
      <fog attach="fog" args={["#040404", 7, 20]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 4, 4]} intensity={35} distance={13} color="#ff7a18" />
      <pointLight position={[-4, -2, 2]} intensity={14} distance={12} color="#743cff" />
      <Environment preset="city" environmentIntensity={0.28} />
      <Stars radius={70} depth={25} count={900} factor={1.4} saturation={0} fade speed={0.25} />

      <group ref={group}>
        <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.55}>
          <mesh>
            <icosahedronGeometry args={[1.38, 2]} />
            <MeshTransmissionMaterial
              thickness={0.7}
              roughness={0.16}
              transmission={0.82}
              ior={1.35}
              chromaticAberration={0.06}
              distortion={0.16}
              distortionScale={0.35}
              color="#ff6814"
              emissive="#3b1204"
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh scale={0.62}>
            <icosahedronGeometry args={[1.38, 1]} />
            <meshStandardMaterial color="#090909" metalness={0.85} roughness={0.2} />
          </mesh>
          <Text
            position={[0, 0, 1.0]}
            fontSize={0.48}
            letterSpacing={-0.04}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            XIRO
          </Text>
        </Float>

        {[...Array(10)].map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const r = 2.4 + (i % 3) * 0.45;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, Math.sin(a * 1.7) * 1.2, Math.sin(a) * r - 1]}
              rotation={[i * 0.4, i * 0.3, i]}
            >
              <boxGeometry args={[0.13 + (i % 2) * 0.1, 0.13, 0.13]} />
              <meshStandardMaterial
                color={i % 2 ? "#ff6a19" : "#7e43ff"}
                emissive={i % 2 ? "#7c2607" : "#29135f"}
                emissiveIntensity={2}
                metalness={0.65}
                roughness={0.25}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [menu, setMenu] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max ? window.scrollY / max : 0);
      if (videoRef.current && videoRef.current.duration) {
        const section = document.querySelector("#cinematic");
        if (section) {
          const r = section.getBoundingClientRect();
          const local = THREE.MathUtils.clamp((window.innerHeight - r.top) / (r.height + window.innerHeight), 0, 1);
          videoRef.current.currentTime = local * videoRef.current.duration;
        }
      }
    };
    const onPointer = (e) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const features = [
    ["01", "PERFORMANCE", "Stay focused on the game with a client experience designed around responsiveness."],
    ["02", "PVP", "Bring your HUD, crosshair and combat information together in one focused interface."],
    ["03", "CUSTOMIZATION", "Shape the interface around the way you actually play."],
    ["04", "EXPERIENCE", "A polished launcher and client designed to feel like one product."],
  ];

  return (
    <div className="site">
      <div className="webgl">
        <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Suspense fallback={null}>
            <Scene progress={progress} pointer={pointer} />
          </Suspense>
        </Canvas>
      </div>

      <header className="nav">
        <a className="brand" href="#top"><span className="brand-mark">X</span><span>XI​RO</span></a>
        <nav className={menu ? "open" : ""}>
          <a href="#performance" onClick={() => setMenu(false)}>Performance</a>
          <a href="#pvp" onClick={() => setMenu(false)}>PvP</a>
          <a href="#customization" onClick={() => setMenu(false)}>Customization</a>
          <a href="#features" onClick={() => setMenu(false)}>Features</a>
        </nav>
        <a className="nav-download" href="/downloads/Xiro-Client-Setup.msi" download>Download</a>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Open menu"><span/><span/></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy reveal">
            <div className="eyebrow"><i/> XIRO CLIENT <span>01</span></div>
            <h1>Your Minecraft.<br/><em>Your way.</em></h1>
            <p>A cinematic client experience built around performance, PvP and complete customization.</p>
            <div className="actions">
              <a className="primary" href="/downloads/Xiro-Client-Setup.msi" download><span>Download Xiro</span><b>↗</b></a>
              <a className="secondary" href="#cinematic">Explore the experience <span>↓</span></a>
            </div>
          </div>
          <div className="hero-meta"><span>SCROLL TO ENTER</span><div className="line"/></div>
        </section>

        <section id="cinematic" className="cinematic">
          <div className="section-copy">
            <div className="eyebrow"><i/> THE EXPERIENCE <span>02</span></div>
            <h2>Built for the<br/><strong>way you play.</strong></h2>
            <p>Scroll through the Xiro world. The scene, camera and cinematic timeline move with you.</p>
          </div>
          <div className="video-shell">
            <video ref={videoRef} src="/videos/xiro-showcase.mp4" muted playsInline preload="metadata"/>
            <div className="video-fallback"><div className="fallback-x">X</div><span>YOUR GAME. YOUR SPACE.</span></div>
            <div className="scanline"/>
          </div>
        </section>

        <section id="performance" className="story performance">
          <div className="story-inner">
            <div className="eyebrow"><i/> PERFORMANCE <span>03</span></div>
            <h2>Performance<br/><strong>without compromise.</strong></h2>
            <p>Every layer of the experience is designed to stay focused, responsive and out of your way.</p>
            <div className="stats">
              <div><strong>FPS</strong><span>Focused rendering</span></div>
              <div><strong>LOW</strong><span>Latency mindset</span></div>
              <div><strong>FAST</strong><span>Instant interaction</span></div>
            </div>
          </div>
        </section>

        <section id="pvp" className="story pvp">
          <div className="story-inner right">
            <div className="eyebrow"><i/> PVP <span>04</span></div>
            <h2>Built for<br/><strong>the fight.</strong></h2>
            <p>Keep the information that matters close without turning your screen into clutter.</p>
            <div className="hud-card">
              <div className="hud-top"><span>XI​RO HUD</span><b>LIVE</b></div>
              <div className="hud-grid"><div>FPS <strong>240</strong></div><div>PING <strong>32</strong></div><div>CPS <strong>12</strong></div><div>XYZ <strong>128 / 64</strong></div></div>
            </div>
          </div>
        </section>

        <section id="customization" className="story customization">
          <div className="story-inner">
            <div className="eyebrow"><i/> CUSTOMIZATION <span>05</span></div>
            <h2>Make it<br/><strong>yours.</strong></h2>
            <p>Build an interface around your playstyle. Clean when you want it. Information-rich when you need it.</p>
            <div className="ui-stack">
              <div className="ui-panel p1"><small>XI​RO / HUD</small><div className="mini-bars"><i/><i/><i/><i/></div></div>
              <div className="ui-panel p2"><small>SETTINGS</small><div className="toggle on"/><div className="toggle"/><div className="toggle on"/></div>
              <div className="ui-panel p3"><small>CROSSHAIR</small><div className="cross">+</div></div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="features-head">
            <div className="eyebrow"><i/> XIRO SYSTEM <span>06</span></div>
            <h2>Everything in<br/><strong>one experience.</strong></h2>
          </div>
          <div className="feature-list">
            {features.map(([n, t, d]) => (
              <article className="feature" key={n}>
                <span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b>
              </article>
            ))}
          </div>
        </section>

        <section className="download">
          <div className="download-orbit"><div className="orbit-ring r1"/><div className="orbit-ring r2"/><div className="orbit-core">X</div></div>
          <div className="download-copy">
            <div className="eyebrow"><i/> READY? <span>07</span></div>
            <h2>Enter<br/><strong>Xiro.</strong></h2>
            <p>Your Minecraft. Your way.</p>
            <a className="primary huge" href="/downloads/Xiro-Client-Setup.msi" download><span>Download Xiro Client</span><b>↗</b></a>
            <small>WINDOWS · INSTALLER</small>
          </div>
        </section>
      </main>

      <footer><div>XI​RO CLIENT</div><span>YOUR MINECRAFT. YOUR WAY.</span><span>© {new Date().getFullYear()} XIRO</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
