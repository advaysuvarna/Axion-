import React from 'react';
import { MapPin, Zap, Thermometer, Radio, Clock, Battery, BarChart3, Navigation } from 'lucide-react';
import './CarDetails.css';

// Full mock dataset for cars
const mockCars = {
  'DL-401': {
    model: 'Dolphin Mark IV', status: 'Active', zone: 'Northern',
    lastTrack: 'NR-001 · Delhi – Amritsar', lastTrackDate: '2026-08-18  14:32 IST',
    currentPosition: '31.1°N, 75.4°E · Phagwara segment',
    batteryHealth: 85, cellVoltage: '3.82V', temperature: '41°C', signalStrength: '94%',
    lastCharged: 'New Delhi Depot (Shivaji Bridge)', chargedDate: '2026-08-17  09:15 IST',
    totalKm: '12,480 km', deployedDate: '2024-03-12',
    speedHistory: [42, 38, 45, 50, 47, 43, 40, 44, 48, 46],
    batteryHistory: [92, 91, 89, 87, 86, 85, 85, 85, 85, 85],
  },
  'MU-218': {
    model: 'Dolphin Mark IV', status: 'Active', zone: 'Western',
    lastTrack: 'WR-001 · Mumbai – Pune Corridor', lastTrackDate: '2026-08-20  11:05 IST',
    currentPosition: '18.9°N, 73.1°E · Karjat segment',
    batteryHealth: 91, cellVoltage: '3.91V', temperature: '38°C', signalStrength: '98%',
    lastCharged: 'Mumbai Kurla Car Depot', chargedDate: '2026-08-19  22:00 IST',
    totalKm: '9,200 km', deployedDate: '2024-05-20',
    speedHistory: [50, 50, 48, 51, 50, 49, 52, 50, 51, 50],
    batteryHistory: [98, 97, 96, 95, 94, 93, 92, 91, 91, 91],
  },
  DEFAULT: {
    model: 'Dolphin Mark III', status: 'Standby', zone: 'Southern',
    lastTrack: 'SR-002 · Chennai – Vijayawada', lastTrackDate: '2026-07-31  08:00 IST',
    currentPosition: 'Chennai Ayanavaram Depot',
    batteryHealth: 62, cellVoltage: '3.61V', temperature: '47°C', signalStrength: '81%',
    lastCharged: 'Chennai Ayanavaram Depot', chargedDate: '2026-07-30  22:00 IST',
    totalKm: '8,920 km', deployedDate: '2023-11-08',
    speedHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    batteryHistory: [70, 68, 66, 64, 63, 62, 62, 62, 62, 62],
  },
};

const statusColors = {
  Active:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  Standby:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
};

// Sparkline with axes
const Sparkline = ({ data, color, yLabel = '', yMax, yMin = 0, xLabel }) => {
  const max = yMax !== undefined ? yMax : Math.max(...data, 1);
  const min = yMin;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '12px' }}>
      <div style={{ display: 'flex', width: '100%', height: '50px', gap: '6px' }}>
        {/* Y-Axis */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-mut)', textAlign: 'right', width: '28px', paddingBottom: '2px', opacity: 0.8 }}>
          <span>{max}{yLabel}</span>
          <span>{min}{yLabel}</span>
        </div>
        
        {/* Chart Area */}
        <div className="sparkline" style={{ flex: 1, borderBottom: '1px solid var(--color-border)', borderLeft: '1px solid var(--color-border)' }}>
          {data.map((v, i) => {
            const heightPct = Math.max(0, Math.min(100, ((v - min) / (max - min || 1)) * 100));
            return (
              <div
                key={i}
                className="spark-bar"
                style={{ height: `${heightPct}%`, background: color, opacity: 0.6 + (i / data.length) * 0.4, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}
                title={`${v}${yLabel}`}
              />
            );
          })}
        </div>
      </div>
      {/* X-Axis */}
      {xLabel && (
        <div style={{ textAlign: 'center', fontSize: '9px', color: 'var(--color-text-mut)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '34px', opacity: 0.7 }}>
          {xLabel}
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ icon: Icon, iconColor, label, value, sub }) => (
  <div className="cd-metric-card">
    <div className="cd-metric-icon" style={{ color: iconColor, background: `${iconColor}18` }}>
      <Icon size={18} />
    </div>
    <div className="cd-metric-info">
      <p className="cd-metric-label">{label}</p>
      <p className="cd-metric-value">{value}</p>
      {sub && <p className="cd-metric-sub">{sub}</p>}
    </div>
  </div>
);

const CarDetails = ({ carId, onBack }) => {
  const car = mockCars[carId] || { ...mockCars.DEFAULT };
  const batteryColor = car.batteryHealth >= 75 ? '#10b981' : car.batteryHealth >= 40 ? '#f59e0b' : '#ef4444';
  const s = statusColors[car.status] || statusColors.Active;

  // Dynamically calculate high-voltage pack reading based on battery percentage (0% = 225V, 100% = 378V)
  const calculatedVoltage = Math.round(225 + (car.batteryHealth / 100) * (378 - 225)) + 'V';

  return (
    <div className="car-details-page">
      {/* Page Header */}
      <div className="cdp-header">
        <div className="cdp-title-row">
          <div>
            <h2 className="cdp-car-id">{carId}</h2>
            <p className="cdp-model">{car.model} · {car.zone} Zone</p>
          </div>
          <span className="cdp-status-pill" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            <span className="cdp-dot" style={{ background: s.color }} />
            {car.status}
          </span>
        </div>
        <p className="cdp-meta">Deployed: {car.deployedDate} · Total: {car.totalKm}</p>
      </div>

      {/* Grid */}
      <div className="cdp-grid">

        {/* Location Card */}
        <div className="cdp-card cdp-card--wide">
          <p className="cdp-card-title">LOCATION & TRACKING</p>
          <div className="cdp-loc-grid">
            <div className="cdp-loc-item">
              <Navigation size={14} style={{ color: '#3b82f6' }} />
              <div>
                <p className="cdp-loc-label">Current Position</p>
                <p className="cdp-loc-value">{car.currentPosition}</p>
              </div>
            </div>
            <div className="cdp-loc-item">
              <MapPin size={14} style={{ color: '#10b981' }} />
              <div>
                <p className="cdp-loc-label">Last Monitored Track</p>
                <p className="cdp-loc-value">{car.lastTrack}</p>
                <p className="cdp-loc-sub"><Clock size={10} /> {car.lastTrackDate}</p>
              </div>
            </div>
            <div className="cdp-loc-item">
              <Zap size={14} style={{ color: '#8b5cf6' }} />
              <div>
                <p className="cdp-loc-label">Last Charged At</p>
                <p className="cdp-loc-value">{car.lastCharged}</p>
                <p className="cdp-loc-sub"><Clock size={10} /> {car.chargedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Battery Card */}
        <div className="cdp-card">
          <p className="cdp-card-title">BATTERY HEALTH</p>
          <div className="cdp-battery-display">
            <div className="cdp-battery-ring">
              <svg viewBox="0 0 80 80" className="cdp-ring-svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={batteryColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - car.batteryHealth / 100)}`}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <span className="cdp-ring-pct" style={{ color: batteryColor }}>{car.batteryHealth}%</span>
            </div>
            <div className="cdp-battery-metrics">
              <div className="cdp-bm-row">
                <Zap size={13} style={{ color: '#f59e0b' }} />
                <span className="cdp-bm-label">Battery Voltage</span>
                <span className="cdp-bm-val">{calculatedVoltage}</span>
              </div>
              <div className="cdp-bm-row">
                <Thermometer size={13} style={{ color: '#ef4444' }} />
                <span className="cdp-bm-label">Temperature</span>
                <span className="cdp-bm-val">{car.temperature}</span>
              </div>
              <div className="cdp-bm-row">
                <Radio size={13} style={{ color: '#3b82f6' }} />
                <span className="cdp-bm-label">Signal</span>
                <span className="cdp-bm-val">{car.signalStrength}</span>
              </div>
            </div>
          </div>
          <div className="cdp-sparkline-label">
            <BarChart3 size={12} /> Battery trend (last 10 readings)
          </div>
          <Sparkline data={car.batteryHistory} color={batteryColor} yLabel="%" yMax={100} xLabel="Time (Last 10 Scans)" />
        </div>

        {/* Speed Card */}
        <div className="cdp-card">
          <p className="cdp-card-title">SPEED PROFILE</p>
          <p className="cdp-speed-now">
            {car.speedHistory[car.speedHistory.length - 1]}
            <span> km/h</span>
          </p>
          <p className="cdp-speed-sub">Current monitoring speed</p>
          <div className="cdp-sparkline-label">
            <BarChart3 size={12} /> Speed log (last 10 readings)
          </div>
          <Sparkline data={car.speedHistory} color="#3b82f6" yLabel="km/h" yMax={60} xLabel="Time (Last 10 Scans)" />
        </div>

        {/* System Metrics */}
        <div className="cdp-card cdp-card--wide">
          <p className="cdp-card-title">SYSTEM METRICS</p>
          <div className="cdp-metrics-row">
            <MetricCard icon={Battery}      iconColor="#10b981" label="Battery"     value={`${car.batteryHealth}%`}    sub="Health" />
            <MetricCard icon={Zap}          iconColor="#f59e0b" label="Voltage"     value={calculatedVoltage}          sub="Pack Level" />
            <MetricCard icon={Thermometer}  iconColor="#ef4444" label="Temp"        value={car.temperature}            sub="Internal" />
            <MetricCard icon={Radio}        iconColor="#3b82f6" label="Signal"      value={car.signalStrength}         sub="4G LTE" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarDetails;
