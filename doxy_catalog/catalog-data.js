/* Canonical Doxy Electricals catalog. */
const DOXY_CATALOG = [
  { id: "electrical-cables", name: "Electrical Cables", icon: "🔌", subcategories: [
    { id: "house-wiring", name: "House Wiring Wires (Single Core)", products: [
      { id: "cab-001", name: "Coleman 1.5mm Copper Cable (90m)", brand: "Coleman", price: 12000, inStock: true, unit: "Coil", image: "./assets/images/Coleman-1-5mm-Copper-Cable.jpg" },
      { id: "cab-002", name: "Coleman 2.5mm Copper Cable (90m)", brand: "Coleman", price: 18500, inStock: true, unit: "Coil", image: "./assets/images/Coleman-2-5mm-Copper-Cable.jpg" },
      { id: "cab-003", name: "Cutix 4.0mm Single Core Wire", brand: "Cutix", price: 29000, inStock: true, unit: "Coil" },
      { id: "cab-004", name: "MicCom 6.0mm Single Core Wire", brand: "MicCom", price: 42000, inStock: false, unit: "Coil" }
    ] },
    { id: "armoured-cables", name: "Armoured Cables (Copper & Aluminium)", products: [
      { id: "cab-005", name: "4-Core 16mm Copper Armoured Cable", brand: "Coleman", price: 14500, inStock: true, unit: "Meter" },
      { id: "cab-006", name: "4-Core 25mm Aluminium Armoured Cable", brand: "Generic", price: 6800, inStock: true, unit: "Meter" }
    ] },
    { id: "flexible-cables", name: "Flexible Cables", products: [{ id: "cab-007", name: "3-Core 2.5mm Flexible Wire", brand: "Coleman", price: 22000, inStock: true, unit: "Coil" }] },
    { id: "control-comm", name: "Control & Communication Cables", products: [] },
    { id: "submersible-pump", name: "Submersible Pump Cables", products: [] }
  ] },
  { id: "switches-sockets", name: "Switches & Sockets", icon: "🔘", subcategories: [
    { id: "wall-switches", name: "Wall Switches", products: [
      { id: "sw-001", name: "Schneider 1-Gang 2-Way Switch", brand: "Schneider", price: 2500, inStock: true, unit: "Piece", image: "./assets/images/Schneider-1-Gang-2-Way-Switch.jpg" },
      { id: "sw-002", name: "Schneider 2-Gang Switch Matrix", brand: "Schneider", price: 3800, inStock: true, unit: "Piece" }
    ] },
    { id: "power-sockets", name: "Power Sockets", products: [{ id: "sw-003", name: "13A Twin Socket with USB Ports", brand: "BG Electrical", price: 7500, inStock: true, unit: "Piece" }] },
    { id: "heavy-duty-switches", name: "Cooker Units & Water Heater Switches", products: [{ id: "sw-004", name: "45A Cooker Control Unit Neon", brand: "Schneider", price: 9200, inStock: true, unit: "Piece" }] },
    { id: "industrial-plugs", name: "Industrial Plugs & Sockets", products: [] },
    { id: "changeover-switches", name: "Changeover Switches", products: [{ id: "sw-005", name: "60A Manual Changeover Switch Box", brand: "Generic", price: 15000, inStock: true, unit: "Piece" }] }
  ] },
  { id: "circuit-breakers", name: "Circuit Breakers", icon: "🛡️", subcategories: [
    { id: "mcb", name: "Miniature Circuit Breakers (MCBs)", products: [
      { id: "cb-001", name: "Schneider 20A Single Pole MCB", brand: "Schneider", price: 8000, inStock: true, unit: "Piece" },
      { id: "cb-002", name: "ABB 32A Double Pole MCB", brand: "ABB", price: 14000, inStock: true, unit: "Piece", image: "./assets/images/ABB-32A-Double-Pole-MCB.jpg" }
    ] },
    { id: "rccb-elcb", name: "Residual Current Devices (RCCBs / ELCBs)", products: [] },
    { id: "mccb", name: "Moulded Case Circuit Breakers (MCCBs)", products: [] },
    { id: "spd", name: "Surge Protection Devices (SPD)", products: [] }
  ] },
  { id: "lighting", name: "Lighting", icon: "💡", subcategories: [
    { id: "led-bulbs", name: "LED Bulbs & Tube Lights", products: [
      { id: "lit-001", name: "LED Bulb 12W Screw Type", brand: "Generic", price: 2800, inStock: true, unit: "Piece", image: "./assets/images/LED-Bulb-12W-Screw-Type.jpg" },
      { id: "lit-002", name: "Rechargeable Emergency LED Bulb 15W", brand: "Generic", price: 5500, inStock: true, unit: "Piece", image: "./assets/images/Rechargeable-Emergency-LED-Bulb-15W.jpg" }
    ] },
    { id: "indoor-deco", name: "Indoor & Decorative Lighting", products: [] },
    { id: "outdoor-security", name: "Outdoor & Security Lighting", products: [{ id: "lit-003", name: "LED Floodlight 100W Outdoor IP66", brand: "Generic", price: 24000, inStock: true, unit: "Piece" }] },
    { id: "industrial-luminaires", name: "Industrial Luminaires", products: [] }
  ] },
  { id: "distribution-boards", name: "Distribution Boards", icon: "📦", subcategories: [
    { id: "consumer-units", name: "Consumer Units (SPN Boards)", products: [
      { id: "db-001", name: "Schneider 8-Way Distribution Board", brand: "Schneider", price: 45000, inStock: true, unit: "Piece", image: "./assets/images/Schneider-8-Way-Distribution-Board.jpg" },
      { id: "db-002", name: "Tenby 12-Way Consumer Unit Flush", brand: "Tenby", price: 58000, inStock: false, unit: "Piece" }
    ] },
    { id: "three-phase-boards", name: "Three-Phase Boards (TPN Boards)", products: [] },
    { id: "busbar-chambers", name: "Busbar Chambers & Enclosures", products: [] }
  ] },
  { id: "electrical-conduits", name: "Electrical Conduits", icon: "🧵", subcategories: [
    { id: "pvc-pipes", name: "PVC Conduit Pipes", products: [{ id: "con-001", name: "20mm High Impact PVC Conduit Pipe (White)", brand: "Generic", price: 1800, inStock: true, unit: "Length", image: "./assets/images/20mm-High-Impact-PVC-Conduit-Pipe(White).jpg" }] },
    { id: "flexible-conduits", name: "Flexible Conduit Pipes (Gooseneck)", products: [] },
    { id: "conduit-fittings", name: "Conduit Fittings & Adapters", products: [] },
    { id: "trunking-casings", name: "Trunking & Casings", products: [] }
  ] },
  { id: "wiring-accessories", name: "Wiring Accessories", icon: "🧰", subcategories: [
    { id: "junction-boxes", name: "Junction Boxes & Adaptable Boxes", products: [] },
    { id: "knockout-boxes", name: "Knockout Boxes (Pattress Boxes)", products: [{ id: "acc-001", name: "Single Gang Metal Knockout Box Flush", brand: "Generic", price: 950, inStock: true, unit: "Piece", image: "./assets/images/Single-Gang-Metal-Knockout-Box-Flush.jpg" }] },
    { id: "insulation-tape", name: "Insulation Tape & Connectors", products: [{ id: "acc-002", name: "Deer Brand PVC Insulation Tape (Black)", brand: "Deer Brand", price: 1200, inStock: true, unit: "Piece" }] },
    { id: "clips-glands-ties", name: "Clips, Glands, & Ties", products: [] }
  ] },
  { id: "electrical-tools", name: "Electrical Tools", icon: "🛠️", subcategories: [
    { id: "hand-tools", name: "Electrician Hand Tools", products: [
      { id: "tol-001", name: "Insulated Combination Pliers 8-Inch", brand: "Ingco", price: 8500, inStock: true, unit: "Piece", image: "./assets/images/Insulated-Combination-Pliers-8-Inch.jpg" },
      { id: "tol-002", name: "Digital Line Tester Screwdriver", brand: "Generic", price: 2000, inStock: true, unit: "Piece" }
    ] },
    { id: "testing-measuring", name: "Testing & Measuring Instruments", products: [] },
    { id: "power-tools", name: "Power Tools", products: [] }
  ] }
];

window.DOXY_CATALOG = DOXY_CATALOG;
