import React from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, CircleMarker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackMap.css';

// ─── Accurate Indian Railway Routes (ALL within India borders) ─────────────────
// Verified coordinates — Amritsar: 31.634°N 74.872°E (NOT 74.34 which is Pakistan)
// NE corridor: via Siliguri / NJP, stays inside India

const mockTracks = [
  // ── NORTHERN ZONE ──────────────────────────────────────────────────────────
  {
    id: 'NR-001', name: 'Delhi – Ludhiana – Amritsar', zone: 'Northern', status: 'recent',
    positions: [
      [28.6139, 77.2090],  // New Delhi
      [29.3909, 76.9635],  // Panipat
      [29.9457, 76.8174],  // Kurukshetra
      [30.7333, 76.7794],  // Chandigarh
      [30.9010, 75.8573],  // Ludhiana
      [31.3260, 75.5762],  // Phagwara
      [31.6340, 74.8723],  // Amritsar ← corrected lon (was 74.34 = Pakistan)
    ]
  },
  {
    id: 'NR-002', name: 'Delhi – Jaipur – Ahmedabad', zone: 'Northern', status: 'old',
    positions: [
      [28.6139, 77.2090],  // New Delhi
      [27.8974, 76.6093],  // Alwar
      [26.9124, 75.7873],  // Jaipur
      [26.4499, 74.6399],  // Ajmer
      [25.3511, 74.6399],  // Bhilwara
      [24.5854, 73.7125],  // Chittorgarh area
      [23.0225, 72.5714],  // Ahmedabad
    ]
  },
  {
    id: 'NR-003', name: 'Delhi – Agra – Bhopal – Mumbai', zone: 'Northern', status: 'scheduled',
    positions: [
      [28.6139, 77.2090],  // New Delhi
      [27.1767, 78.0081],  // Agra
      [25.4358, 78.5691],  // Jhansi
      [23.2599, 77.4126],  // Bhopal
      [22.7196, 75.8577],  // Indore area
      [21.1458, 79.0882],  // Nagpur (via Itarsi)
      [19.9975, 75.3100],  // Aurangabad
      [19.0760, 72.8777],  // Mumbai CST
    ]
  },

  // ── EASTERN ZONE ───────────────────────────────────────────────────────────
  {
    id: 'ER-001', name: 'Delhi – Kanpur – Patna – Kolkata', zone: 'Eastern', status: 'old',
    positions: [
      [28.6139, 77.2090],  // New Delhi
      [26.8467, 80.9462],  // Lucknow
      [26.4499, 80.3319],  // Kanpur
      [26.1197, 81.7787],  // Prayagraj
      [25.3176, 82.9739],  // Varanasi
      [25.5941, 85.1376],  // Patna
      [24.7914, 85.5166],  // Gaya
      [23.8103, 86.4304],  // Dhanbad
      [22.9868, 87.8550],  // Kharagpur
      [22.5726, 88.3639],  // Kolkata / Howrah
    ]
  },
  {
    id: 'ER-002', name: 'Kolkata – Bhubaneswar – Visakhapatnam', zone: 'Eastern', status: 'unmonitored',
    positions: [
      [22.5726, 88.3639],  // Kolkata
      [21.9139, 87.1235],  // Balasore
      [20.9517, 85.0985],  // Bhubaneswar
      [19.8135, 85.8312],  // Berhampur
      [18.4386, 83.9408],  // Srikakulam
      [17.6868, 83.2185],  // Visakhapatnam
    ]
  },

  // ── NORTH-EAST CORRIDOR (inside India, via Siliguri) ───────────────────────
  {
    id: 'NE-001', name: 'Kolkata – Siliguri – Guwahati – Dibrugarh', zone: 'North-East', status: 'unmonitored',
    positions: [
      [22.5726, 88.3639],  // Howrah/Kolkata
      [23.5204, 88.3639],  // Burdwan direction north
      [24.8197, 87.8639],  // Malda
      [26.7221, 88.3953],  // New Jalpaiguri / Siliguri — stays in India
      [26.7509, 91.7462],  // Guwahati (via the NF Railway corridor)
      [26.7509, 94.2037],  // Jorhat
      [27.4728, 95.0120],  // Dibrugarh
    ]
  },

  // ── WESTERN ZONE ───────────────────────────────────────────────────────────
  {
    id: 'WR-001', name: 'Mumbai – Surat – Vadodara – Ahmedabad', zone: 'Western', status: 'recent',
    positions: [
      [19.0760, 72.8777],  // Mumbai CST
      [21.1702, 72.8311],  // Surat
      [22.3072, 73.1812],  // Vadodara
      [22.6700, 72.8700],  // Anand
      [23.0225, 72.5714],  // Ahmedabad
    ]
  },
  {
    id: 'WR-002', name: 'Ahmedabad – Jodhpur – Delhi', zone: 'Western', status: 'scheduled',
    positions: [
      [23.0225, 72.5714],  // Ahmedabad
      [24.5928, 72.7156],  // Palanpur
      [25.2838, 73.0243],  // Abu Road
      [26.2938, 73.0169],  // Jodhpur
      [27.6010, 73.0169],  // Luni Junction
      [26.9124, 75.7873],  // Jaipur
      [28.6139, 77.2090],  // Delhi
    ]
  },

  // ── SOUTHERN ZONE ──────────────────────────────────────────────────────────
  {
    id: 'SR-001', name: 'Mumbai – Pune – Bengaluru – Chennai', zone: 'Southern', status: 'old',
    positions: [
      [19.0760, 72.8777],  // Mumbai
      [18.5204, 73.8567],  // Pune
      [17.6805, 74.0183],  // Satara
      [16.8302, 74.1240],  // Kolhapur
      [15.3647, 75.1239],  // Hubli
      [13.3379, 77.1173],  // Tumkur
      [12.9716, 77.5946],  // Bengaluru
      [13.0827, 80.2707],  // Chennai
    ]
  },
  {
    id: 'SR-002', name: 'Chennai – Vijayawada – Hyderabad', zone: 'Southern', status: 'recent',
    positions: [
      [13.0827, 80.2707],  // Chennai
      [14.4673, 79.9848],  // Nellore
      [16.5062, 80.6480],  // Vijayawada
      [17.9784, 79.5941],  // Warangal
      [17.3850, 78.4867],  // Secunderabad / Hyderabad
    ]
  },
  {
    id: 'SR-003', name: 'Hyderabad – Solapur – Pune', zone: 'Southern', status: 'unmonitored',
    positions: [
      [17.3850, 78.4867],  // Hyderabad
      [17.6599, 75.9064],  // Solapur
      [18.0667, 76.0167],  // Kurduwadi
      [18.5204, 73.8567],  // Pune
    ]
  },
  {
    id: 'SR-004', name: 'Chennai – Madurai – Kanyakumari', zone: 'Southern', status: 'scheduled',
    positions: [
      [13.0827, 80.2707],  // Chennai
      [11.9416, 79.8083],  // Villupuram
      [11.1271, 77.3411],  // Salem
      [10.7905, 78.7047],  // Trichy
      [9.9252,  78.1198],  // Madurai
      [8.7293,  77.7187],  // Tirunelveli
      [8.0883,  77.5385],  // Kanyakumari
    ]
  },

  // ── CENTRAL / CROSS-COUNTRY ────────────────────────────────────────────────
  {
    id: 'CR-001', name: 'Mumbai – Nagpur – Kolkata (SEW)', zone: 'Central', status: 'recent',
    positions: [
      [19.0760, 72.8777],  // Mumbai
      [20.3884, 77.1625],  // Akola
      [21.1458, 79.0882],  // Nagpur
      [21.8135, 80.0000],  // Gondia
      [22.0579, 82.1409],  // Bilaspur
      [22.9868, 87.8550],  // Kharagpur
      [22.5726, 88.3639],  // Kolkata
    ]
  },
  {
    id: 'CR-002', name: 'Nagpur – Hyderabad (SCR)', zone: 'Central', status: 'scheduled',
    positions: [
      [21.1458, 79.0882],  // Nagpur
      [19.9975, 79.2961],  // Chandrapur
      [18.9949, 79.5941],  // Mancherial
      [17.9661, 79.5941],  // Warangal
      [17.3850, 78.4867],  // Hyderabad
    ]
  },

  // ── VISAKHAPATNAM – VIJAYAWADA connector ─────────────────────────────────
  {
    id: 'SR-005', name: 'Visakhapatnam – Vijayawada', zone: 'Southern', status: 'old',
    positions: [
      [17.6868, 83.2185],  // Visakhapatnam
      [17.0005, 81.7799],  // Eluru
      [16.5062, 80.6480],  // Vijayawada
    ]
  },

  // ── NEW CROWDED ROUTES ─────────────────────────────────────────────────────
  {
    id: 'NR-004', name: 'Delhi – Lucknow – Gorakhpur', zone: 'Northern', status: 'recent',
    positions: [
      [28.6139, 77.2090], // Delhi
      [28.8386, 78.7733], // Moradabad
      [28.3670, 79.4304], // Bareilly
      [26.8467, 80.9462], // Lucknow
      [26.7922, 82.1963], // Ayodhya
      [26.7606, 83.3732], // Gorakhpur
    ]
  },
  {
    id: 'NR-005', name: 'Delhi – Dehradun', zone: 'Northern', status: 'unmonitored',
    positions: [
      [28.6139, 77.2090], // Delhi
      [28.9845, 77.7064], // Meerut
      [29.4727, 77.7085], // Muzaffarnagar
      [29.9457, 78.1642], // Haridwar
      [30.3165, 78.0322], // Dehradun
    ]
  },
  {
    id: 'CR-003', name: 'Mumbai – Indore – Gwalior', zone: 'Central', status: 'unmonitored',
    positions: [
      [19.0760, 72.8777], // Mumbai
      [21.1702, 72.8311], // Surat
      [22.7196, 75.8577], // Indore
      [23.1815, 75.7731], // Ujjain
      [26.2124, 78.1772], // Gwalior
      [27.1767, 78.0081], // Agra
    ]
  },
  {
    id: 'SR-006', name: 'Bengaluru – Mangaluru – Goa', zone: 'Southern', status: 'scheduled',
    positions: [
      [12.9716, 77.5946], // Bengaluru
      [12.2958, 76.6394], // Mysuru
      [12.8732, 74.8436], // Mangaluru
      [13.3409, 74.7421], // Udupi
      [15.2993, 74.1240], // Goa
      [15.8497, 74.4977], // Belagavi
    ]
  },
  {
    id: 'SR-007', name: 'Chennai – Coimbatore – Kochi', zone: 'Southern', status: 'old',
    positions: [
      [13.0827, 80.2707], // Chennai
      [12.9165, 79.1325], // Vellore
      [11.6643, 78.1460], // Salem
      [11.0168, 76.9558], // Coimbatore
      [10.5276, 76.2144], // Thrissur
      [9.9312, 76.2673],  // Kochi
      [8.5241, 76.9366],  // Thiruvananthapuram
    ]
  },
  {
    id: 'ER-003', name: 'Kolkata – Ranchi – Raipur', zone: 'Eastern', status: 'recent',
    positions: [
      [22.5726, 88.3639], // Kolkata
      [22.8046, 86.2029], // Jamshedpur
      [23.3441, 85.3096], // Ranchi
      [22.1467, 82.1388], // Bilaspur
      [21.2514, 81.6296], // Raipur
      [21.1458, 79.0882], // Nagpur
    ]
  },
  {
    id: 'WR-003', name: 'Ahmedabad – Rajkot – Dwarka', zone: 'Western', status: 'recent',
    positions: [
      [23.0225, 72.5714], // Ahmedabad
      [22.7533, 71.6284], // Surendranagar
      [22.3039, 70.8022], // Rajkot
      [22.4707, 70.0577], // Jamnagar
      [22.2442, 68.9685], // Dwarka
    ]
  },
  // ── MORE CROWDED BRANCHES ──────────────────────────────────────────────────
  {
    id: 'NR-006', name: 'Delhi – Chandigarh – Shimla', zone: 'Northern', status: 'recent',
    positions: [
      [28.6139, 77.2090], // Delhi
      [29.3909, 76.9635], // Panipat
      [30.3752, 76.7821], // Ambala
      [30.7333, 76.7794], // Chandigarh
      [31.1048, 77.1734], // Shimla
    ]
  },
  {
    id: 'NR-007', name: 'Delhi – Rohtak – Bathinda', zone: 'Northern', status: 'old',
    positions: [
      [28.6139, 77.2090], // Delhi
      [28.8955, 76.6066], // Rohtak
      [29.1492, 75.7217], // Hisar
      [30.2110, 74.9455], // Bathinda
    ]
  },
  {
    id: 'ER-004', name: 'Kolkata – Patna – Varanasi', zone: 'Eastern', status: 'scheduled',
    positions: [
      [22.5726, 88.3639], // Kolkata
      [23.6739, 86.9524], // Asansol
      [24.7914, 85.0002], // Gaya
      [25.5941, 85.1376], // Patna
      [25.3176, 82.9739], // Varanasi
    ]
  },
  {
    id: 'ER-005', name: 'Kolkata – Siliguri – Guwahati', zone: 'Eastern', status: 'unmonitored',
    positions: [
      [22.5726, 88.3639], // Kolkata
      [24.0988, 88.2679], // Murshidabad
      [25.0715, 87.9898], // Malda
      [26.7161, 88.4237], // Siliguri (NJP)
      [26.3452, 89.5447], // Cooch Behar
      [26.1445, 91.7362], // Guwahati
    ]
  },
  {
    id: 'WR-004', name: 'Ahmedabad – Udaipur – Ajmer', zone: 'Western', status: 'recent',
    positions: [
      [23.0225, 72.5714], // Ahmedabad
      [23.5880, 72.3693], // Mehsana
      [24.5854, 73.7125], // Udaipur
      [25.3475, 74.6408], // Bhilwara
      [26.4499, 74.6399], // Ajmer
    ]
  },
  {
    id: 'WR-005', name: 'Mumbai – Pune – Solapur', zone: 'Western', status: 'old',
    positions: [
      [19.0760, 72.8777], // Mumbai
      [18.5204, 73.8567], // Pune
      [18.1122, 74.5641], // Baramati (approx)
      [17.6599, 75.9064], // Solapur
    ]
  },
  {
    id: 'SR-008', name: 'Bengaluru – Hubballi – Pune', zone: 'Southern', status: 'recent',
    positions: [
      [12.9716, 77.5946], // Bengaluru
      [13.3409, 77.1005], // Tumakuru
      [14.1670, 76.5401], // Chitradurga
      [15.3647, 75.1240], // Hubballi
      [15.8497, 74.4977], // Belagavi
      [16.7050, 74.2433], // Kolhapur
      [18.5204, 73.8567], // Pune
    ]
  },
  {
    id: 'SR-009', name: 'Hyderabad – Kurnool – Anantapur', zone: 'Southern', status: 'scheduled',
    positions: [
      [17.3850, 78.4867], // Hyderabad
      [16.7270, 78.1068], // Mahbubnagar
      [15.8281, 78.0373], // Kurnool
      [15.4764, 77.5975], // Gooty
      [14.6819, 77.6006], // Anantapur
    ]
  },
  {
    id: 'CR-004', name: 'Bhopal – Jabalpur – Bilaspur', zone: 'Central', status: 'recent',
    positions: [
      [23.2599, 77.4126], // Bhopal
      [22.7538, 77.7196], // Hoshangabad
      [23.1815, 79.9864], // Jabalpur
      [23.1652, 81.3503], // Shahdol
      [22.0579, 82.1409], // Bilaspur
    ]
  },
  {
    id: 'CR-005', name: 'Nagpur – Raipur – Sambalpur', zone: 'Central', status: 'unmonitored',
    positions: [
      [21.1458, 79.0882], // Nagpur
      [21.1938, 80.3290], // Dongargarh
      [21.2514, 81.6296], // Raipur
      [21.8974, 83.3950], // Raigarh
      [21.4669, 83.9812], // Sambalpur
    ]
  },
  {
    id: 'ER-006', name: 'Bhubaneswar – Vizianagaram', zone: 'Eastern', status: 'old',
    positions: [
      [20.2961, 85.8245], // Bhubaneswar
      [19.8055, 85.3180], // Khordha
      [19.3149, 84.7941], // Berhampur
      [18.1067, 83.3956], // Vizianagaram
      [17.6868, 83.2185], // Visakhapatnam
    ]
  },
  {
    id: 'NR-008', name: 'Jaipur – Bikaner – Jaisalmer', zone: 'Northern', status: 'recent',
    positions: [
      [26.9124, 75.7873], // Jaipur
      [27.6094, 75.1398], // Sikar
      [28.0229, 73.3119], // Bikaner
      [27.4646, 71.6980], // Phalodi
      [26.9157, 70.9083], // Jaisalmer
    ]
  },
];

// ─── Major stations ────────────────────────────────────────────────────────────
const majorStations = [
  { name: 'New Delhi',         lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai CST',        lat: 19.0760, lng: 72.8777 },
  { name: 'Chennai Central',   lat: 13.0827, lng: 80.2707 },
  { name: 'Howrah / Kolkata',  lat: 22.5726, lng: 88.3639 },
  { name: 'Bengaluru City',    lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad Deccan',  lat: 17.3850, lng: 78.4867 },
  { name: 'Ahmedabad',         lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur',            lat: 26.9124, lng: 75.7873 },
  { name: 'Nagpur',            lat: 21.1458, lng: 79.0882 },
  { name: 'Patna',             lat: 25.5941, lng: 85.1376 },
  { name: 'Lucknow',           lat: 26.8467, lng: 80.9462 },
  { name: 'Bhubaneswar',       lat: 20.9517, lng: 85.0985 },
  { name: 'Guwahati',          lat: 26.7509, lng: 91.7462 },
  { name: 'Visakhapatnam',     lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada',        lat: 16.5062, lng: 80.6480 },
  { name: 'Pune',              lat: 18.5204, lng: 73.8567 },
  { name: 'Amritsar',          lat: 31.6340, lng: 74.8723 },  // ← corrected
  { name: 'Varanasi',          lat: 25.3176, lng: 82.9739 },
  { name: 'Madurai',           lat:  9.9252, lng: 78.1198 },
  { name: 'Siliguri / NJP',   lat: 26.7221, lng: 88.3953 },
  { name: 'Jodhpur',           lat: 26.2938, lng: 73.0169 },
  { name: 'Bhopal',            lat: 23.2599, lng: 77.4126 },
  { name: 'Agra',              lat: 27.1767, lng: 78.0081 },
  { name: 'Dehradun',          lat: 30.3165, lng: 78.0322 },
  { name: 'Kochi',             lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram',lat: 8.5241, lng: 76.9366 },
  { name: 'Ranchi',            lat: 23.3441, lng: 85.3096 },
  { name: 'Goa',               lat: 15.2993, lng: 74.1240 },
  { name: 'Dwarka',            lat: 22.2442, lng: 68.9685 },
];

const statusMeta = {
  recent:      { color: '#10b981', label: '< 2 Months' },
  old:         { color: '#f59e0b', label: '> 2 Months' },
  unmonitored: { color: '#3b82f6', label: 'Unmonitored' },
  scheduled:   { color: '#8b5cf6', label: 'Scheduled'  },
};

const TrackMap = ({ isLight }) => {
  const indiaCenter = [22.5937, 80.9629];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={indiaCenter}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        maxBounds={[[6, 67], [37, 98]]}   // tightly bounded to India
        maxBoundsViscosity={1.0}
        minZoom={4}
      >
        <ZoomControl position="bottomright" />

        {/* Basemap layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={isLight 
            ? "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          }
        />
        {/* Label overlay */}
        <TileLayer
          url={isLight
            ? "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          }
          pane="overlayPane"
        />

        {/* Railway tracks */}
        {mockTracks.map(track => (
          <Polyline
            key={track.id}
            positions={track.positions}
            color={statusMeta[track.status].color}
            weight={1.5}
            opacity={0.85}
            lineJoin="round"
            lineCap="round"
          >
            <Tooltip sticky>
              <div className="tooltip-content">
                <strong>{track.name}</strong>
                <span className="tooltip-id">Section: {track.id} · Zone: {track.zone}</span>
                <span style={{ color: statusMeta[track.status].color, fontWeight: 600 }}>
                  ● {statusMeta[track.status].label}
                </span>
              </div>
            </Tooltip>
          </Polyline>
        ))}

        {/* Station markers */}
        {majorStations.map(station => (
          <CircleMarker
            key={station.name}
            center={[station.lat, station.lng]}
            radius={2.5}
            color="#ffffff"
            weight={1}
            fillColor="#0070f3"
            fillOpacity={1}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <span className="station-tooltip">{station.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="map-legend">
        <p className="legend-title">STATUS LEGEND</p>
        {Object.entries(statusMeta).map(([key, val]) => (
          <div className="legend-item" key={key}>
            <span className="legend-line" style={{ backgroundColor: val.color }} />
            <span>{val.label}</span>
          </div>
        ))}
      </div>

      {/* Live badge */}
      <div className="map-live-badge">
        <span className="live-dot" />
        LIVE
      </div>
    </div>
  );
};

export default TrackMap;
