import React, { useState } from 'react';
import { MapPin, Wifi, ChevronDown, ChevronUp, Zap, Thermometer } from 'lucide-react';
import './FleetData.css';

// ── 50 Dolphin Cars ────────────────────────────────────────────────────────────
const fleetCars = [
  // NORTHERN ZONE
  { id: 'DL-401', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Delhi – Amritsar Line',          zone: 'Northern',   battery: 85, voltage: '3.82V', temp: '41°C', signal: 94,  lastPing: '2 min ago',  deployedDate: '2024-03-12', km: '12,480 km' },
  { id: 'DL-402', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Delhi – Chandigarh Sector',      zone: 'Northern',   battery: 79, voltage: '3.77V', temp: '39°C', signal: 91,  lastPing: '4 min ago',  deployedDate: '2024-04-01', km: '10,230 km' },
  { id: 'JP-731', model: 'Dolphin Mk IV',  status: 'Critical', location: 'Jaipur – Ahmedabad Sector',      zone: 'Northern',   battery: 18, voltage: '3.21V', temp: '58°C', signal: 42,  lastPing: '15 min ago', deployedDate: '2023-09-10', km: '16,550 km' },
  { id: 'JP-732', model: 'Dolphin Mk III', status: 'Standby',  location: 'Jaipur Depot – North Yard',      zone: 'Northern',   battery: 97, voltage: '3.98V', temp: '36°C', signal: 99,  lastPing: '30 min ago', deployedDate: '2023-07-15', km: '22,100 km' },
  { id: 'LK-115', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Ludhiana – Pathankot Corridor',  zone: 'Northern',   battery: 73, voltage: '3.71V', temp: '43°C', signal: 85,  lastPing: '6 min ago',  deployedDate: '2024-02-20', km: '8,940 km'  },
  { id: 'AM-210', model: 'Dolphin Mk III', status: 'Active',   location: 'Ambala – Ludhiana Fast',         zone: 'Northern',   battery: 66, voltage: '3.63V', temp: '44°C', signal: 80,  lastPing: '9 min ago',  deployedDate: '2023-12-05', km: '14,210 km' },
  { id: 'AG-320', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Agra – Mathura Segment',         zone: 'Northern',   battery: 88, voltage: '3.85V', temp: '40°C', signal: 93,  lastPing: '1 min ago',  deployedDate: '2024-06-10', km: '7,660 km'  },
  { id: 'VN-140', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Varanasi – Prayagraj Main',      zone: 'Northern',   battery: 61, voltage: '3.59V', temp: '46°C', signal: 77,  lastPing: '11 min ago', deployedDate: '2023-10-18', km: '17,800 km' },

  // EASTERN ZONE
  { id: 'KL-309', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Kolkata – Bhubaneswar East',     zone: 'Eastern',    battery: 68, voltage: '3.65V', temp: '43°C', signal: 82,  lastPing: '7 min ago',  deployedDate: '2024-01-15', km: '14,670 km' },
  { id: 'KL-310', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Kharagpur – Balasore Trunk',     zone: 'Eastern',    battery: 74, voltage: '3.72V', temp: '42°C', signal: 88,  lastPing: '5 min ago',  deployedDate: '2024-03-28', km: '11,350 km' },
  { id: 'PT-220', model: 'Dolphin Mk III', status: 'Active',   location: 'Patna – Gaya Corridor',          zone: 'Eastern',    battery: 55, voltage: '3.51V', temp: '48°C', signal: 74,  lastPing: '13 min ago', deployedDate: '2023-08-14', km: '20,440 km' },
  { id: 'PT-221', model: 'Dolphin Mk III', status: 'Standby',  location: 'Patna Junction Depot',           zone: 'Eastern',    battery: 100,voltage: '4.02V', temp: '34°C', signal: 100, lastPing: '45 min ago', deployedDate: '2023-06-01', km: '23,900 km' },
  { id: 'DN-430', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Dhanbad – Bokaro Sector',        zone: 'Eastern',    battery: 82, voltage: '3.80V', temp: '41°C', signal: 90,  lastPing: '3 min ago',  deployedDate: '2024-05-05', km: '9,780 km'  },
  { id: 'BB-516', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Bhubaneswar – Berhampur',        zone: 'Eastern',    battery: 69, voltage: '3.66V', temp: '44°C', signal: 83,  lastPing: '8 min ago',  deployedDate: '2024-01-30', km: '13,200 km' },
  { id: 'RC-601', model: 'Dolphin Mk III', status: 'Critical', location: 'Ranchi – Bokaro Segment',        zone: 'Eastern',    battery: 22, voltage: '3.28V', temp: '56°C', signal: 38,  lastPing: '18 min ago', deployedDate: '2023-05-12', km: '26,700 km' },

  // WESTERN ZONE
  { id: 'MU-218', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Mumbai – Pune Corridor',         zone: 'Western',    battery: 91, voltage: '3.91V', temp: '38°C', signal: 98,  lastPing: '1 min ago',  deployedDate: '2024-05-20', km: '9,200 km'  },
  { id: 'MU-219', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Mumbai – Surat Western Line',    zone: 'Western',    battery: 84, voltage: '3.81V', temp: '39°C', signal: 92,  lastPing: '2 min ago',  deployedDate: '2024-06-01', km: '8,100 km'  },
  { id: 'AH-310', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Ahmedabad – Vadodara Corridor',  zone: 'Western',    battery: 78, voltage: '3.76V', temp: '41°C', signal: 89,  lastPing: '5 min ago',  deployedDate: '2024-02-14', km: '11,600 km' },
  { id: 'AH-311', model: 'Dolphin Mk IV',  status: 'Standby',  location: 'Ahmedabad Sabarmati Depot',      zone: 'Western',    battery: 98, voltage: '3.99V', temp: '35°C', signal: 97,  lastPing: '22 min ago', deployedDate: '2024-04-18', km: '6,430 km'  },
  { id: 'ST-404', model: 'Dolphin Mk III', status: 'Active',   location: 'Surat – Baroda Express Line',    zone: 'Western',    battery: 63, voltage: '3.61V', temp: '45°C', signal: 78,  lastPing: '10 min ago', deployedDate: '2023-11-22', km: '17,500 km' },
  { id: 'JD-520', model: 'Dolphin Mk III', status: 'Active',   location: 'Jodhpur – Barmer Sector',        zone: 'Western',    battery: 47, voltage: '3.44V', temp: '52°C', signal: 65,  lastPing: '14 min ago', deployedDate: '2023-07-30', km: '21,800 km' },
  { id: 'BK-611', model: 'Dolphin Mk IV',  status: 'Critical', location: 'Bikaner – Jodhpur Line',         zone: 'Western',    battery: 14, voltage: '3.18V', temp: '60°C', signal: 35,  lastPing: '22 min ago', deployedDate: '2023-04-05', km: '28,400 km' },
  { id: 'VD-712', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Vadodara – Surat Main',          zone: 'Western',    battery: 87, voltage: '3.84V', temp: '40°C', signal: 94,  lastPing: '3 min ago',  deployedDate: '2024-07-08', km: '5,900 km'  },

  // SOUTHERN ZONE
  { id: 'CH-105', model: 'Dolphin Mk III', status: 'Active',   location: 'Chennai – Vijayawada Main',      zone: 'Southern',   battery: 72, voltage: '3.70V', temp: '45°C', signal: 87,  lastPing: '4 min ago',  deployedDate: '2023-11-08', km: '18,930 km' },
  { id: 'CH-106', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Chennai – Madurai Express',      zone: 'Southern',   battery: 80, voltage: '3.78V', temp: '42°C', signal: 91,  lastPing: '3 min ago',  deployedDate: '2024-04-22', km: '10,450 km' },
  { id: 'BG-940', model: 'Dolphin Mk III', status: 'Standby',  location: 'Bengaluru Carriage Depot',       zone: 'Southern',   battery: 95, voltage: '3.95V', temp: '37°C', signal: 99,  lastPing: '20 min ago', deployedDate: '2023-06-05', km: '25,400 km' },
  { id: 'BG-941', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Bengaluru – Mysuru Corridor',    zone: 'Southern',   battery: 76, voltage: '3.74V', temp: '40°C', signal: 88,  lastPing: '6 min ago',  deployedDate: '2024-03-10', km: '12,100 km' },
  { id: 'MD-330', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Madurai – Tirunelveli Sector',   zone: 'Southern',   battery: 65, voltage: '3.62V', temp: '46°C', signal: 80,  lastPing: '9 min ago',  deployedDate: '2023-12-18', km: '15,600 km' },
  { id: 'MD-331', model: 'Dolphin Mk III', status: 'Active',   location: 'Madurai – Salem Trunk',          zone: 'Southern',   battery: 53, voltage: '3.49V', temp: '49°C', signal: 72,  lastPing: '12 min ago', deployedDate: '2023-09-25', km: '19,200 km' },
  { id: 'HB-440', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Hubli – Bengaluru Main',         zone: 'Southern',   battery: 83, voltage: '3.81V', temp: '41°C', signal: 92,  lastPing: '2 min ago',  deployedDate: '2024-05-15', km: '9,870 km'  },
  { id: 'KK-512', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Kochi – Trivandrum Coastal',     zone: 'Southern',   battery: 70, voltage: '3.68V', temp: '44°C', signal: 84,  lastPing: '7 min ago',  deployedDate: '2024-01-20', km: '13,750 km' },
  { id: 'TY-618', model: 'Dolphin Mk III', status: 'Critical', location: 'Trichy – Salem Segment',         zone: 'Southern',   battery: 25, voltage: '3.30V', temp: '55°C', signal: 44,  lastPing: '20 min ago', deployedDate: '2023-03-28', km: '30,100 km' },

  // CENTRAL ZONE
  { id: 'NG-822', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Nagpur – Bilaspur Trunk',        zone: 'Central',    battery: 79, voltage: '3.77V', temp: '42°C', signal: 91,  lastPing: '2 min ago',  deployedDate: '2024-04-18', km: '8,740 km'  },
  { id: 'NG-823', model: 'Dolphin Mk III', status: 'Active',   location: 'Nagpur – Wardha Corridor',       zone: 'Central',    battery: 64, voltage: '3.62V', temp: '47°C', signal: 79,  lastPing: '10 min ago', deployedDate: '2023-10-04', km: '16,300 km' },
  { id: 'HY-614', model: 'Dolphin Mk III', status: 'Active',   location: 'Hyderabad – Nagpur Segment',     zone: 'Central',    battery: 55, voltage: '3.50V', temp: '49°C', signal: 76,  lastPing: '3 min ago',  deployedDate: '2023-08-22', km: '21,100 km' },
  { id: 'HY-615', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Hyderabad – Warangal Fast',      zone: 'Central',    battery: 88, voltage: '3.86V', temp: '40°C', signal: 95,  lastPing: '1 min ago',  deployedDate: '2024-06-25', km: '7,200 km'  },
  { id: 'BP-720', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Bhopal – Itarsi Corridor',       zone: 'Central',    battery: 71, voltage: '3.69V', temp: '43°C', signal: 86,  lastPing: '6 min ago',  deployedDate: '2024-02-08', km: '12,900 km' },
  { id: 'BP-721', model: 'Dolphin Mk III', status: 'Standby',  location: 'Bhopal Depot – West Yard',       zone: 'Central',    battery: 96, voltage: '3.97V', temp: '36°C', signal: 98,  lastPing: '35 min ago', deployedDate: '2023-05-30', km: '24,600 km' },
  { id: 'JB-830', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Jabalpur – Katni Sector',        zone: 'Central',    battery: 75, voltage: '3.73V', temp: '42°C', signal: 87,  lastPing: '5 min ago',  deployedDate: '2024-03-05', km: '10,880 km' },
  { id: 'BL-910', model: 'Dolphin Mk III', status: 'Active',   location: 'Bilaspur – Raipur Corridor',     zone: 'Central',    battery: 58, voltage: '3.54V', temp: '47°C', signal: 74,  lastPing: '11 min ago', deployedDate: '2023-09-17', km: '18,750 km' },

  // SOUTH-CENTRAL / SECUNDERABAD
  { id: 'VZ-115', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Visakhapatnam – Vijayawada',     zone: 'S-Central',  battery: 83, voltage: '3.80V', temp: '40°C', signal: 89,  lastPing: '5 min ago',  deployedDate: '2024-06-14', km: '7,860 km'  },
  { id: 'VZ-116', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Vizag – Srikakulam Coastal',     zone: 'S-Central',  battery: 76, voltage: '3.74V', temp: '41°C', signal: 88,  lastPing: '7 min ago',  deployedDate: '2024-04-30', km: '9,450 km'  },
  { id: 'VJ-225', model: 'Dolphin Mk III', status: 'Active',   location: 'Vijayawada – Guntur Sector',     zone: 'S-Central',  battery: 62, voltage: '3.60V', temp: '46°C', signal: 80,  lastPing: '9 min ago',  deployedDate: '2023-12-12', km: '16,800 km' },
  { id: 'SC-340', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Secunderabad – Warangal',        zone: 'S-Central',  battery: 89, voltage: '3.87V', temp: '39°C', signal: 96,  lastPing: '2 min ago',  deployedDate: '2024-07-02', km: '6,340 km'  },
  { id: 'SC-341', model: 'Dolphin Mk III', status: 'Standby',  location: 'Secunderabad Depot',             zone: 'S-Central',  battery: 93, voltage: '3.93V', temp: '37°C', signal: 97,  lastPing: '28 min ago', deployedDate: '2023-08-08', km: '20,200 km' },
  { id: 'NL-450', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Nellore – Ongole Sector',        zone: 'S-Central',  battery: 74, voltage: '3.72V', temp: '43°C', signal: 86,  lastPing: '6 min ago',  deployedDate: '2024-02-28', km: '11,100 km' },

  // NORTH-EAST ZONE
  { id: 'NE-502', model: 'Dolphin Mk IV',  status: 'Standby',  location: 'Guwahati Depot',                 zone: 'North-East', battery: 100,voltage: '4.01V', temp: '35°C', signal: 95,  lastPing: '12 min ago', deployedDate: '2024-07-01', km: '4,320 km'  },
  { id: 'NE-503', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Guwahati – Lumding Corridor',    zone: 'North-East', battery: 77, voltage: '3.75V', temp: '40°C', signal: 86,  lastPing: '8 min ago',  deployedDate: '2024-05-28', km: '8,650 km'  },
  { id: 'DB-610', model: 'Dolphin Mk III', status: 'Active',   location: 'Dibrugarh – Jorhat Sector',      zone: 'North-East', battery: 60, voltage: '3.57V', temp: '45°C', signal: 75,  lastPing: '14 min ago', deployedDate: '2023-11-14', km: '15,900 km' },
  { id: 'SL-710', model: 'Dolphin Mk IV',  status: 'Active',   location: 'Silchar – Lumding Main',         zone: 'North-East', battery: 72, voltage: '3.70V', temp: '43°C', signal: 82,  lastPing: '10 min ago', deployedDate: '2024-03-19', km: '10,200 km' },
  { id: 'AG-810', model: 'Dolphin Mk III', status: 'Critical', location: 'Agartala – Lumding Segment',     zone: 'North-East', battery: 19, voltage: '3.24V', temp: '57°C', signal: 40,  lastPing: '25 min ago', deployedDate: '2023-02-14', km: '31,500 km' },
  { id: 'NJP-901',model: 'Dolphin Mk IV',  status: 'Active',   location: 'NJP – Siliguri Corridor',        zone: 'North-East', battery: 86, voltage: '3.83V', temp: '39°C', signal: 93,  lastPing: '4 min ago',  deployedDate: '2024-06-17', km: '7,130 km'  },
];

// ── Status styles ─────────────────────────────────────────────────────────────
const statusStyle = {
  Active:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  Standby:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)'  },
};

// ── Battery bar ───────────────────────────────────────────────────────────────
const BatteryBar = ({ pct }) => {
  const color = pct >= 75 ? '#10b981' : pct >= 35 ? '#f59e0b' : '#ef4444';
  return (
    <div className="fd-battery-wrap">
      <div className="fd-battery-track">
        <div className="fd-battery-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="fd-battery-pct" style={{ color }}>{pct}%</span>
    </div>
  );
};

// ── Car card ──────────────────────────────────────────────────────────────────
const CarRow = ({ car }) => {
  const [expanded, setExpanded] = useState(false);
  const s = statusStyle[car.status];

  return (
    <div className={`fd-car-card ${expanded ? 'expanded' : ''}`}>
      <div className="fd-car-header" onClick={() => setExpanded(e => !e)}>
        <div className="fd-car-left">
          <span className="fd-car-id">{car.id}</span>
          <span className="fd-car-model">{car.model}</span>
        </div>
        <div className="fd-car-right">
          <span className="fd-status-pill" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            <span className="fd-dot" style={{ background: s.color }} />
            {car.status}
          </span>
          {expanded ? <ChevronUp size={14} className="fd-chevron" /> : <ChevronDown size={14} className="fd-chevron" />}
        </div>
      </div>

      <div className="fd-car-location">
        <MapPin size={11} className="fd-loc-icon" />
        <span>{car.location}</span>
        <span className="fd-zone-tag">{car.zone}</span>
      </div>

      <BatteryBar pct={car.battery} />

      {expanded && (
        <div className="fd-car-details">
          <div className="fd-detail-grid">
            <div className="fd-detail-item">
              <Zap size={12} style={{ color: '#f59e0b' }} />
              <div><p className="fd-dl">{car.voltage}</p><p className="fd-dt">Voltage</p></div>
            </div>
            <div className="fd-detail-item">
              <Thermometer size={12} style={{ color: '#ef4444' }} />
              <div><p className="fd-dl">{car.temp}</p><p className="fd-dt">Temp</p></div>
            </div>
            <div className="fd-detail-item">
              <Wifi size={12} style={{ color: '#3b82f6' }} />
              <div><p className="fd-dl">{car.signal}%</p><p className="fd-dt">Signal</p></div>
            </div>
            <div className="fd-detail-item">
              <MapPin size={12} style={{ color: '#8b5cf6' }} />
              <div><p className="fd-dl">{car.lastPing}</p><p className="fd-dt">Last Ping</p></div>
            </div>
          </div>
          <div className="fd-footer-row">
            <span>Deployed: {car.deployedDate}</span>
            <span>{car.km}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const FleetData = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const counts = {
    All:      fleetCars.length,
    Active:   fleetCars.filter(c => c.status === 'Active').length,
    Standby:  fleetCars.filter(c => c.status === 'Standby').length,
    Critical: fleetCars.filter(c => c.status === 'Critical').length,
  };

  const filtered = fleetCars
    .filter(c => filter === 'All' || c.status === filter)
    .filter(c =>
      !search.trim() ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.zone.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="fleet-data-page">
      {/* Header */}
      <div className="fd-top">
        <div>
          <h3 className="fd-title">Fleet Data</h3>
          <p className="fd-subtitle">Autonomous Rail Health Monitoring Cars — Dolphin Series</p>
        </div>
        <span className="fd-total">{fleetCars.length} units deployed</span>
      </div>

      {/* Summary chips */}
      <div className="fd-summary">
        <div className="fd-chip green"><span>{counts.Active}</span>Active</div>
        <div className="fd-chip yellow"><span>{counts.Standby}</span>Standby</div>
        <div className="fd-chip red"><span>{counts.Critical}</span>Critical</div>
        <div className="fd-chip grey"><span>{counts.All}</span>Total</div>
      </div>

      {/* Controls row */}
      <div className="fd-controls">
        <div className="fd-filters">
          {['All', 'Active', 'Standby', 'Critical'].map(f => (
            <button key={f} className={`fd-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
              <span className="fd-filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <input
          className="fd-search"
          type="text"
          placeholder="Search by ID, zone or location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Car grid */}
      <div className="fd-list">
        {filtered.map(car => <CarRow key={car.id} car={car} />)}
        {filtered.length === 0 && (
          <div className="fd-empty">No cars match the current filter.</div>
        )}
      </div>
    </div>
  );
};

export default FleetData;
