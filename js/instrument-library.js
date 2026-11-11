/**
 * MY VIRTUAL LAB - Instrument Library
 * Technical specifications, operating ranges, safety protocols, and direct simulator launching.
 */

class InstrumentLibrary {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.selectedLab = 'ALL';
    this.instruments = this.getInstrumentsData();
  }

  getInstrumentsData() {
    return [
      {
        id: "superposition-trainer",
        name: "Superposition Theorem Trainer Apparatus",
        category: "Circuit Analysis",
        specs: [
          "Fixed Output DC Regulated Power Supplies: 12V & 5V DC (Overload Protected)",
          "Three built-in Analog Milliammeters: 0 - 250 mA DC with mirrored scales",
          "Precision carbon-film resistor network: R1=50Ω, R2=10Ω, R3=50Ω",
          "Standard 4mm gold-plated banana socket terminals"
        ],
        safetyTips: [
          "Always switch OFF the main power toggle before changing patchcord connections.",
          "Ensure milliammeters are connected strictly in SERIES with the respective resistor branches.",
          "Never connect an ammeter directly across the 12V or 5V power supply terminals (causes dead short)."
        ],
        linkedExpId: "superposition-theorem",
        imageEmoji: "⚡",
        badge: "Core Apparatus"
      },
      {
        id: "thevenin-trainer",
        name: "Thevenin & Norton Theorem Trainer",
        category: "Circuit Analysis",
        specs: [
          "Built-in 12V DC Regulated Power Supply",
          "Dual Range DC Voltmeter: 0 - 15V with mirror scale",
          "Precision Resistor Bank: R1=500Ω, R2=100Ω, R3=90Ω",
          "Selectable Load Resistor Bank (RL): 25Ω, 50Ω, 100Ω"
        ],
        safetyTips: [
          "To measure Thevenin resistance (Rth), ensure the 12V supply is disconnected and shorted.",
          "Do not apply external AC voltages to DC terminals."
        ],
        linkedExpId: "thevenin-norton-theorem",
        imageEmoji: "🎛️",
        badge: "Verified Apparatus"
      },
      {
        id: "mptt-trainer",
        name: "Maximum Power Transfer Apparatus",
        category: "Circuit Analysis",
        specs: [
          "Fixed Output DC Regulated Power Supply: +12V DC",
          "Precision Wirewound Rotary Potentiometer VR: 0 - 600 Ω linear taper",
          "Three Built-in Source Resistors (Ri): 50 Ω, 100 Ω, 500 Ω",
          "Dual Analog Meters: 0-15V Voltmeter & 0-250mA Ammeter"
        ],
        safetyTips: [
          "Do not leave the potentiometer at zero ohms (0Ω) for extended periods when connected across 12V.",
          "Rotate potentiometer dial smoothly to avoid brush friction wear."
        ],
        linkedExpId: "max-power-transfer-theorem",
        imageEmoji: "🔋",
        badge: "Precision Calibrated"
      },
      {
        id: "two-port-trainer",
        name: "Two-Port Network Parameters Apparatus",
        category: "Network Theory",
        specs: [
          "Continuously Variable 0 - 10V DC Regulated Power Supply with rotary dial",
          "Short circuit and overload protection circuit with automatic foldback",
          "Dual Symmetrical T-Networks with 1 kΩ precision arms",
          "Cascading jumper sockets for compound network analysis"
        ],
        safetyTips: [
          "When determining Z-parameters, ensure the open-circuit port has no inadvertent grounding.",
          "Verify meter polarity (+ to +) before increasing voltage dial."
        ],
        linkedExpId: "two-port-zh-parameters",
        imageEmoji: "🌐",
        badge: "Advanced Network Kit"
      },
      {
        id: "analog-ammeter",
        name: "Precision Moving Coil DC Milliammeter",
        category: "General Measurement",
        specs: [
          "Range: 0 - 250 mA DC",
          "Accuracy: High sensitivity moving coil movement",
          "Knife-edge pointer with anti-parallax mirrored scale",
          "Zero adjustment screw on front panel"
        ],
        safetyTips: [
          "Must ALWAYS be wired in series with circuit elements.",
          "If current exceeds 250mA, immediately disconnect to prevent galvanometer coil burn-out."
        ],
        linkedExpId: "superposition-theorem",
        imageEmoji: "⏱️",
        badge: "Standard Meter"
      },
      {
        id: "digital-multimeter",
        name: "Digital Multimeter (DMM)",
        category: "General Measurement",
        specs: [
          "Measurement: DCV (200mV - 1000V), DCA (200μA - 10A), Resistance (200Ω - 20MΩ)",
          "Input Impedance: 10 MΩ DC",
          "Backlit LCD with auto-polarity indication",
          "Continuity buzzer and diode test mode"
        ],
        safetyTips: [
          "NEVER measure resistance on an energized / live circuit.",
          "Ensure probes are in the 'V/Ω' jack when measuring voltage, NOT the 10A current port."
        ],
        linkedExpId: "thevenin-norton-theorem",
        imageEmoji: "📟",
        badge: "Digital Instrument"
      }
    ];
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.render();
  }

  setLabFilter(lab) {
    this.selectedLab = lab;
    this.render();
  }

  render() {
    if (!this.container) return;

    const filtered = this.instruments.filter(inst => {
      const matchSearch = inst.name.toLowerCase().includes(this.searchQuery) ||
                          inst.category.toLowerCase().includes(this.searchQuery);
      const matchLab = this.selectedLab === 'ALL' || inst.category === this.selectedLab;
      return matchSearch && matchLab;
    });

    const isHindi = document.documentElement.getAttribute('lang') === 'hi';

    this.container.innerHTML = `
      <div class="space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold font-heading text-white">
              ${isHindi ? 'प्रयोगशाला उपकरण पुस्तकालय' : 'Instrument Library & Apparatus Specs'}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              ${isHindi 
                ? 'विस्तृत तकनीकी विनिर्देश, सुरक्षा नियम और संचालन मार्गदर्शिका।'
                : 'Complete technical documentation, circuit schematics, and laboratory safety protocols for all hardware apparatus.'}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative">
              <input type="text" placeholder="${isHindi ? 'उपकरण खोजें...' : 'Search instruments...'}" value="${this.searchQuery}" oninput="window.instrumentLibrary.setSearch(this.value)" class="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs w-48 md:w-64 focus:outline-none focus:border-cyan-400">
              <span class="absolute right-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>

            <select onchange="window.instrumentLibrary.setLabFilter(this.value)" class="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400">
              <option value="ALL">All Categories</option>
              <option value="Circuit Analysis">Circuit Analysis</option>
              <option value="Network Theory">Network Theory</option>
              <option value="General Measurement">General Measurement</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${filtered.map(inst => this.renderInstrumentCard(inst, isHindi)).join('')}
        </div>

      </div>

      <div id="instrument-details-modal-slot"></div>
    `;
  }

  renderInstrumentCard(inst, isHindi) {
    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
              ${inst.imageEmoji}
            </div>
            <span class="px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              ${inst.badge}
            </span>
          </div>

          <h3 class="text-base font-bold font-heading text-white group-hover:text-cyan-400 transition mb-1">
            ${inst.name}
          </h3>
          <p class="text-xs text-slate-400 mb-3 font-mono">${inst.category}</p>

          <div class="space-y-1 text-xs text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <div class="text-[10px] uppercase font-semibold text-slate-500 mb-1">Key Specifications</div>
            ${inst.specs.slice(0, 2).map(s => `<div class="truncate">• ${s}</div>`).join('')}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center space-x-2">
          <button onclick="window.instrumentLibrary.viewDetails('${inst.id}')" class="flex-1 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition">
            ${isHindi ? 'विवरण और सुरक्षा' : 'Details & Safety'}
          </button>
          <button onclick="window.app.navigateTo('simulator', '${inst.linkedExpId}')" class="py-1.5 px-3 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow transition flex items-center space-x-1" title="Open in Simulator">
            <span>⚡</span>
            <span>${isHindi ? 'अभ्यास' : 'Simulate'}</span>
          </button>
        </div>
      </div>
    `;
  }

  viewDetails(instId) {
    const inst = this.instruments.find(i => i.id === instId);
    if (!inst) return;

    const slot = document.getElementById('instrument-details-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">${inst.imageEmoji}</span>
              <div>
                <h3 class="text-base font-heading font-bold text-white">${inst.name}</h3>
                <span class="text-xs font-mono text-cyan-400">${inst.category}</span>
              </div>
            </div>
            <button onclick="document.getElementById('instrument-details-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="space-y-4 text-xs text-slate-300 max-h-[420px] overflow-y-auto pr-1">
            <div>
              <h4 class="text-xs font-bold font-heading text-cyan-400 uppercase tracking-wider mb-2">Technical Specifications</h4>
              <ul class="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono">
                ${inst.specs.map(s => `<li>• ${s}</li>`).join('')}
              </ul>
            </div>

            <div>
              <h4 class="text-xs font-bold font-heading text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <span>⚠️</span>
                <span>Mandatory Lab Safety Protocols</span>
              </h4>
              <ul class="space-y-1.5 bg-amber-950/20 p-3 rounded-xl border border-amber-900/30 text-amber-200">
                ${inst.safetyTips.map(tip => `<li>✓ ${tip}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button onclick="document.getElementById('instrument-details-modal-slot').innerHTML=''" class="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">Close</button>
            <button onclick="window.app.navigateTo('simulator', '${inst.linkedExpId}'); document.getElementById('instrument-details-modal-slot').innerHTML='';" class="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow">
              Open in Digital Twin Simulator
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.instrumentLibrary = new InstrumentLibrary();
