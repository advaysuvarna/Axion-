import React, { useRef } from 'react';
import { Thermometer, Droplets, AlertTriangle, Activity, Image as ImageIcon, Gauge, BarChart3, CheckCircle, Radio } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import './SectionDetails.css';

// ═══════════════════════════════════════════════════════════════════════════════
//  3-D CAD COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── I-beam rail (proper cross-section: web + top head + bottom foot) ──────────
const Rail = ({ x }) => (
  <group position={[x, 0, 0]}>
    {/* Web */}
    <mesh castShadow>
      <boxGeometry args={[0.038, 0.14, 8]} />
      <meshStandardMaterial color="#8b9ab0" metalness={0.95} roughness={0.07} />
    </mesh>
    {/* Head (top flange — riding surface) */}
    <mesh position={[0, 0.09, 0]} castShadow>
      <boxGeometry args={[0.10, 0.04, 8]} />
      <meshStandardMaterial color="#c0cad9" metalness={0.96} roughness={0.05} />
    </mesh>
    {/* Foot (bottom flange) */}
    <mesh position={[0, -0.09, 0]} castShadow>
      <boxGeometry args={[0.13, 0.03, 8]} />
      <meshStandardMaterial color="#8b9ab0" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

// ── Pre-stressed concrete sleeper with rail-seat detail ───────────────────────
const Sleeper = ({ z }) => (
  <group position={[0, -0.16, z]}>
    {/* Main block */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2.0, 0.14, 0.26]} />
      <meshStandardMaterial color="#6b7280" roughness={0.95} metalness={0.04} />
    </mesh>
    {/* Centre recess */}
    <mesh position={[0, 0.072, 0]}>
      <boxGeometry args={[1.95, 0.008, 0.05]} />
      <meshStandardMaterial color="#4b5563" roughness={1} />
    </mesh>
    {/* Rail seat rubber pads */}
    {[-0.66, 0.66].map((px, i) => (
      <mesh key={i} position={[px, 0.075, 0]}>
        <boxGeometry args={[0.18, 0.016, 0.22]} />
        <meshStandardMaterial color="#374151" roughness={0.75} />
      </mesh>
    ))}
  </group>
);

// ── Pandrol e-clip (orange spring clip) ───────────────────────────────────────
const Clip = ({ x, z }) => (
  <mesh position={[x, -0.038, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
    <torusGeometry args={[0.042, 0.013, 8, 18, Math.PI]} />
    <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
  </mesh>
);

// ── Seeded random ballast stones ───────────────────────────────────────────────
const stones = (() => {
  const arr = [];
  let seed = 137;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 90; i++) {
    const side = rand() > 0.5 ? 1 : -1;
    arr.push({ x: side * (0.62 + rand() * 0.72), y: -0.27 + rand() * 0.06, z: rand() * 8 - 4, s: 0.04 + rand() * 0.055, r: rand() });
  }
  for (let i = 0; i < 30; i++) {
    arr.push({ x: (rand() - 0.5) * 0.92, y: -0.31 + rand() * 0.04, z: rand() * 8 - 4, s: 0.033 + rand() * 0.04, r: rand() });
  }
  return arr;
})();

const BallastStone = ({ x, y, z, s, r }) => (
  <mesh position={[x, y, z]} rotation={[r * 6.28, r * 3.14, r * 9.42]} castShadow receiveShadow>
    <dodecahedronGeometry args={[s, 0]} />
    <meshStandardMaterial color="#4b5563" roughness={1} metalness={0} />
  </mesh>
);

// ── Pulsing anomaly marker with ring ─────────────────────────────────────────
const AnomalyMarker = ({ position, color }) => {
  const coreRef = useRef();
  const ringRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.18);
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.28);
      ringRef.current.material.opacity = 0.28 + Math.sin(t * 3) * 0.22;
    }
  });
  return (
    <group position={position}>
      <mesh ref={coreRef} castShadow>
        <sphereGeometry args={[0.072, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.8} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.013, 8, 28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.38} />
      </mesh>
    </group>
  );
};

// ── Dolphin Mk IV scanner car ─────────────────────────────────────────────────
const DolphinCar = () => {
  const beamRef = useRef();
  useFrame(({ clock }) => {
    if (beamRef.current) beamRef.current.rotation.z = Math.sin(clock.elapsedTime * 4.5) * 0.48;
  });

  return (
    <group position={[0, 0.28, 0]}>
      {/* ── Main hull */}
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.22, 1.28]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.28} />
      </mesh>
      {/* ── Blue top panel */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.66, 0.065, 1.20]} />
        <meshStandardMaterial color="#0070f3" metalness={0.5} roughness={0.2} emissive="#0070f3" emissiveIntensity={0.22} />
      </mesh>
      {/* ── Nose cone */}
      <mesh position={[0, -0.005, -0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.22, 0.32, 8]} />
        <meshStandardMaterial color="#0d1524" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* ── Axle housings (front + rear) */}
      {[-0.37, 0.37].map((z, i) => (
        <mesh key={i} position={[0, -0.14, z]} castShadow>
          <cylinderGeometry args={[0.088, 0.088, 0.87, 14]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.24} />
        </mesh>
      ))}
      {/* ── Wheels (4 corners) */}
      {[[-0.43, -0.37], [0.43, -0.37], [-0.43, 0.37], [0.43, 0.37]].map(([wx, wz], i) => (
        <group key={i} position={[wx, -0.14, wz]}>
          {/* Tyre */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.094, 0.094, 0.062, 22]} />
            <meshStandardMaterial color="#111827" metalness={0.88} roughness={0.14} />
          </mesh>
          {/* Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.058, 0.058, 0.068, 12]} />
            <meshStandardMaterial color="#374151" metalness={0.75} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* ── Camera/sensor dome (bottom) */}
      <mesh position={[0, -0.148, 0.06]}>
        <sphereGeometry args={[0.112, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#000814" metalness={0.25} roughness={0.05} transparent opacity={0.88} />
      </mesh>
      {/* ── Axion side accent stripe */}
      <mesh position={[0, 0.016, 0]}>
        <boxGeometry args={[0.735, 0.022, 1.30]} />
        <meshStandardMaterial color="#0070f3" emissive="#0070f3" emissiveIntensity={0.7} />
      </mesh>
      {/* ── Antenna nub */}
      <mesh position={[0, 0.178, 0.3]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.12, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── Scanning laser fan (animated) */}
      <group ref={beamRef} position={[0, -0.162, 0.06]}>
        {[-0.44, -0.26, -0.10, 0.10, 0.26, 0.44].map((bx, i) => (
          <mesh key={i} position={[bx, -0.13, 0]}>
            <boxGeometry args={[0.005, 0.26, 0.005]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={4.5} transparent opacity={0.65} />
          </mesh>
        ))}
        {/* Horizontal scan line */}
        <mesh position={[0, -0.255, 0]}>
          <boxGeometry args={[1.02, 0.006, 0.006]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={6} transparent opacity={0.92} />
        </mesh>
      </group>
    </group>
  );
};

// ── Assembled track CAD scene ─────────────────────────────────────────────────
const TrackModel = ({ deformities, cracks }) => {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.35;
  });

  const sleeperZ = [-3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2];

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh position={[0, -0.40, 0]} receiveShadow>
        <boxGeometry args={[5.5, 0.04, 11]} />
        <meshStandardMaterial color="#0d0d14" roughness={1} />
      </mesh>
      {/* Ballast sub-bed */}
      <mesh position={[0, -0.34, 0]} receiveShadow>
        <boxGeometry args={[2.9, 0.10, 9.2]} />
        <meshStandardMaterial color="#2d3748" roughness={1} />
      </mesh>
      {/* Ballast stones */}
      {stones.map((s, i) => <BallastStone key={i} {...s} />)}
      {/* Sleepers */}
      {sleeperZ.map(z => <Sleeper key={z} z={z} />)}
      {/* Rails (I-beam) */}
      <Rail x={-0.66} />
      <Rail x={ 0.66} />
      {/* Pandrol clips */}
      {sleeperZ.map(z => (
        <React.Fragment key={z}>
          <Clip x={-0.66} z={z} />
          <Clip x={ 0.66} z={z} />
        </React.Fragment>
      ))}
      {/* Anomaly markers */}
      {deformities > 0 && <AnomalyMarker position={[-0.66, 0.155, 1.0]}  color="#ef4444" />}
      {deformities > 1 && <AnomalyMarker position={[ 0.66, 0.155, -1.8]} color="#f59e0b" />}
      {cracks      > 0 && <AnomalyMarker position={[-0.66, 0.12,  -0.5]} color="#ef4444" />}
      {/* Dolphin scanner car */}
      <DolphinCar />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════
const mockSections = {
  'T-001': {
    name: 'Delhi – Amritsar', zoneCode: 'NR-001', zone: 'Northern',
    thermals: '38°C', thermalStatus: 'Normal',
    humidity: '65%', humidityStatus: 'High',
    deformities: 2, cracks: 1,
    profile: 'Nominal gauge. Minor deviation at km 48 — monitoring scheduled.',
    lastScan: '2026-08-18 · 14:32 IST',
    length: '448 km', condition: 'Fair',
    thermalHistory: [36, 37, 37, 38, 38, 39, 38, 38, 38, 38],
    humidityHistory: [58, 60, 62, 63, 64, 65, 65, 65, 65, 65],
  },
  'NR-002': {
    name: 'Delhi – Jaipur – Ahmedabad', zoneCode: 'NR-002', zone: 'Northern',
    thermals: '42°C', thermalStatus: 'Elevated',
    humidity: '48%', humidityStatus: 'Normal',
    deformities: 0, cracks: 0,
    profile: 'All parameters nominal. Track in good condition.',
    lastScan: '2026-07-22 · 09:00 IST',
    length: '934 km', condition: 'Good',
    thermalHistory: [40, 41, 41, 42, 42, 43, 42, 42, 42, 42],
    humidityHistory: [50, 50, 49, 48, 48, 48, 48, 48, 48, 48],
  },
  DEFAULT: {
    name: 'Section Overview', zoneCode: '—', zone: 'Unknown',
    thermals: '44°C', thermalStatus: 'Elevated',
    humidity: '52%', humidityStatus: 'Normal',
    deformities: 0, cracks: 0,
    profile: 'No prior scan data. Schedule a Dolphin run.',
    lastScan: 'Not scanned',
    length: '—', condition: 'Unknown',
    thermalHistory: [44, 44, 44, 44, 44, 44, 44, 44, 44, 44],
    humidityHistory: [52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SPARKLINE
// ═══════════════════════════════════════════════════════════════════════════════
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="sparkline">
      {data.map((v, i) => (
        <div key={i} className="spark-bar"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.5 + (i / data.length) * 0.5 }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const SectionDetails = ({ sectionId, onBack }) => {
  const section = mockSections[sectionId] || { ...mockSections.DEFAULT, name: `Section ${sectionId}` };
  const hasIssues = section.deformities > 0 || section.cracks > 0;
  const conditionColor = section.condition === 'Good' ? '#10b981' : section.condition === 'Fair' ? '#f59e0b' : '#64748b';

  return (
    <div className="section-details-page">

      {/* Page Header */}
      <div className="sdp-header">
        <div className="sdp-title-row">
          <div>
            <h2 className="sdp-id">{sectionId}</h2>
            <p className="sdp-name">{section.name} · {section.zone} Zone</p>
          </div>
          <div className="sdp-badges">
            <span className="sdp-badge" style={{ color: conditionColor, background: `${conditionColor}18`, border: `1px solid ${conditionColor}44` }}>
              {section.condition}
            </span>
            {hasIssues ? (
              <span className="sdp-badge warn">
                <AlertTriangle size={12} /> {section.deformities + section.cracks} Issues
              </span>
            ) : (
              <span className="sdp-badge good">
                <CheckCircle size={12} /> Clear
              </span>
            )}
          </div>
        </div>
        <p className="sdp-meta">Length: {section.length} · Last scan: {section.lastScan}</p>
      </div>

      {/* Content grid */}
      <div className="sdp-grid">

        {/* 3D CAD Viewer */}
        <div className="sdp-card sdp-cad-card">
          <div className="sdp-card-header">
            <Gauge size={14} />
            <p className="sdp-card-title">3D CAD PROFILING — DOLPHIN Mk IV</p>
            <span className="sdp-live"><span className="sdp-blink" /> Live Model</span>
          </div>
          <div className="sdp-canvas">
            <Canvas camera={{ position: [3.2, 2.2, 4.2], fov: 36 }} shadows>
              <fog attach="fog" args={['#06060a', 4, 12]} />
              <ambientLight intensity={0.3} />
              <spotLight position={[6, 12, 6]}  angle={0.22} penumbra={0.8} intensity={2.2} castShadow shadowMapWidth={2048} shadowMapHeight={2048} />
              <spotLight position={[-6, 8, -4]} angle={0.35} penumbra={1.0} intensity={0.8} castShadow color="#1a4fa0" />
              <pointLight position={[0, 3, 0]}  intensity={0.4} color="#3b82f6" />
              <pointLight position={[0, -1, 2]} intensity={0.5} color="#0070f3" />
              <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.6} far={2} color="#000000" position={[0, -0.41, 0]} />
              <Sparkles count={60} scale={12} size={1.5} speed={0.2} opacity={0.3} color="#5aacff" />
              <TrackModel deformities={section.deformities} cracks={section.cracks} />
              <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={0.2} maxPolarAngle={1.55} />
              <Environment preset="night" />
            </Canvas>
          </div>
          <p className="sdp-cad-hint">Drag to rotate · Scroll to zoom · 🔴 Deformity · 🟠 Gauge deviation · Green beam = active LiDAR scan</p>
        </div>

        {/* Row 2: Thermal & Humidity */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <Thermometer size={14} style={{ color: '#f97316' }} />
            <p className="sdp-card-title">THERMAL MONITORING</p>
            <span className={`sdp-status-tag ${section.thermalStatus === 'Normal' ? 'good' : 'warn'}`}>
              {section.thermalStatus}
            </span>
          </div>
          <p className="sdp-big-value orange">{section.thermals}</p>
          <div className="sdp-sparkline-label"><BarChart3 size={11} /> 10-reading trend</div>
          <Sparkline data={section.thermalHistory} color="#f97316" />
        </div>

        <div className="sdp-card">
          <div className="sdp-card-header">
            <Droplets size={14} style={{ color: '#3b82f6' }} />
            <p className="sdp-card-title">HUMIDITY & ENVIRONMENT</p>
            <span className={`sdp-status-tag ${section.humidityStatus === 'Normal' ? 'good' : 'warn'}`}>
              {section.humidityStatus}
            </span>
          </div>
          <p className="sdp-big-value blue">{section.humidity}</p>
          <div className="sdp-sparkline-label"><BarChart3 size={11} /> 10-reading trend</div>
          <Sparkline data={section.humidityHistory} color="#3b82f6" />
        </div>

        {/* Row 3: Anomaly Detection & Acoustic Signature */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <Activity size={14} />
            <p className="sdp-card-title">ANOMALY DETECTION</p>
          </div>
          {hasIssues ? (
            <div className="sdp-anomaly-list">
              {section.deformities > 0 && (
                <div className="sdp-anomaly-item warn">
                  <AlertTriangle size={16} />
                  <div>
                    <p className="sdp-anomaly-title">{section.deformities} Deformit{section.deformities > 1 ? 'ies' : 'y'} Detected</p>
                    <p className="sdp-anomaly-desc">Structural deviation above threshold. Review required.</p>
                  </div>
                </div>
              )}
              {section.cracks > 0 && (
                <div className="sdp-anomaly-item crit">
                  <Activity size={16} />
                  <div>
                    <p className="sdp-anomaly-title">{section.cracks} Hairline Crack{section.cracks > 1 ? 's' : ''} Identified</p>
                    <p className="sdp-anomaly-desc">High-priority. Immediate inspection recommended.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sdp-clear">
              <CheckCircle size={32} style={{ color: '#10b981' }} />
              <p>No anomalies detected</p>
              <span>Section within all safety parameters</span>
            </div>
          )}
          <div className="sdp-profile-box">
            <p className="sdp-profile-label">TRACK PROFILE</p>
            <p className="sdp-profile-text">{section.profile}</p>
          </div>
        </div>

        {/* Captured Images */}
        <div className="sdp-card sdp-images-card">
          <div className="sdp-card-header">
            <ImageIcon size={14} />
            <p className="sdp-card-title">CAPTURED IMAGES</p>
            <span className="sdp-img-count">24 frames</span>
          </div>
          <div className="sdp-image-grid">
            {[
              { label: 'Rail Head — km 48',     bg: 'linear-gradient(135deg, #1e293b, #0f172a)', accent: '#3b82f6' },
              { label: 'Deformity — km 48.2',   bg: 'linear-gradient(135deg, #2d1515, #1a0a0a)', accent: '#ef4444' },
              { label: 'Sleeper Joint — km 52', bg: 'linear-gradient(135deg, #1a1f2e, #111827)', accent: '#8b5cf6' },
              { label: 'Ballast Bed — km 55',   bg: 'linear-gradient(135deg, #0f2922, #071a15)', accent: '#10b981' },
            ].map((img, i) => (
              <div key={i} className="sdp-img-thumb" style={{ background: img.bg }}>
                <div className="sdp-img-overlay">
                  <div className="sdp-img-icon" style={{ color: img.accent }}>
                    <ImageIcon size={22} />
                  </div>
                  <p className="sdp-img-label">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SectionDetails;
