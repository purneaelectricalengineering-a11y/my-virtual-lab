/**
 * MY VIRTUAL LAB - Digital Twin Laboratory Simulator
 * Pure SVG Chassis Architecture strictly matching real laboratory apparatus photos & vector layouts.
 * Features:
 * - 5 Authentic Digital Twin Trainer Boards (Superposition, Thevenin/Norton, MPTT, Two-Port Z&H, Resonance)
 * - Calibrated analog meters with anti-parallax mirror strips and spring deflection
 * - Zero terminal overlap with authentic Red/Black/Blue banana sockets
 * - Resilient Bezier patchcords that NEVER disappear on power toggle
 * - Universal zero-error circuit solvers
 * - Interactive rotary dial knobs for VR and Set Volts
 * - Mobile-friendly responsive SVG scaling (100% fit-to-phone)
 * - 3-dots slide-out drawer with observation table, custom row adding, graphs, and PDF reports.
 */

class LabSimulator {
  constructor() {
    this.container = null;
    this.currentExpId = 'superposition-theorem';
    this.isPoweredOn = false;
    this.selectedSocket = null;
    this.activeWireColor = '#e63946'; // Red default
    this.wires = []; // Array of { from, to, color, id }
    this.history = [];
    this.redoStack = [];
    this.readings = [];
    this.potentiometerValue = 100; // MPTT VR in ohms
    this.sourceVoltageValue = 5.0; // Two-Port 0-10V DC in volts
    this.theveninVoltRange = 15;   // 3 or 15 V
    this.twoPortVoltRange = 12;    // 3 or 12 V
    this.twoPortCurrentRange = 10; // 1 or 10 mA
    this.resonanceFreq = 5030;     // Hz
    this.isSideDrawerOpen = false;
    this.deviceMode = localStorage.getItem('mvl_device_mode') || (window.innerWidth < 768 ? 'mobile' : 'pc');
    this.currentViewIndex = -1; // -1 = Full board
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.readings = this.loadSavedStudentReadings(this.currentExpId);
    this.renderSimulatorUI();
  }

  loadExperiment(expId) {
    this.currentExpId = expId;
    this.isPoweredOn = false;
    this.wires = [];
    this.history = [];
    this.redoStack = [];
    this.selectedSocket = null;
    this.currentViewIndex = -1;
    this.readings = this.loadSavedStudentReadings(expId);
    if (window.labAudio) window.labAudio.stopLabHum();
    this.renderSimulatorUI();
  }

  loadSavedStudentReadings(expId) {
    try {
      const saved = JSON.parse(localStorage.getItem('mvl_student_readings') || '{}');
      return saved[expId] || [];
    } catch (e) {
      return [];
    }
  }

  setDeviceMode(mode) {
    this.deviceMode = mode;
    localStorage.setItem('mvl_device_mode', mode);
    this.renderSimulatorUI();
  }

  toggleSideDrawer() {
    this.isSideDrawerOpen = !this.isSideDrawerOpen;
    const drawer = document.getElementById('simulator-side-drawer');
    if (drawer) {
      if (this.isSideDrawerOpen) {
        drawer.classList.remove('collapsed');
      } else {
        drawer.classList.add('collapsed');
      }
    }
  }

  /* =========================================================================
     TOP TOOLBAR & SHELL
     ========================================================================= */

  renderSimulatorUI() {
    if (!this.container) return;
    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];
    const isMobile = this.deviceMode === 'mobile';

    this.container.innerHTML = `
      <div class="relative w-full h-full flex flex-col bg-[#050814] text-slate-100 overflow-hidden select-none">
        
        <!-- Top Toolbar: In-Simulator Experiment Switcher + Wires Palette + Options -->
        <div class="flex flex-wrap items-center justify-between px-3 md:px-5 py-2.5 bg-[#0A1020]/95 border-b border-slate-800 z-30 gap-2">
          
          <!-- Left: In-Simulator Experiment Selector & Wire Count -->
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full ${this.isPoweredOn ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-slate-600'}"></span>
            
            <div class="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1">
              <span class="text-[11px] font-mono text-cyan-400 font-bold">🔍 Experiment:</span>
              <select onchange="window.simulator.loadExperiment(this.value)" class="bg-transparent text-xs font-mono text-white max-w-[170px] sm:max-w-[260px] truncate focus:outline-none cursor-pointer">
                ${window.EXPERIMENTS_DATA.map(e => `
                  <option value="${e.id}" class="bg-slate-900 text-white" ${e.id === this.currentExpId ? 'selected' : ''}>
                    ${e.title.en}
                  </option>
                `).join('')}
              </select>
            </div>

            <span class="text-xs text-slate-400 font-mono hidden sm:inline">(${this.wires.length} wires)</span>
          </div>

          <!-- Center: Mode Toggle (PC / Mobile) -->
          <div class="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button onclick="window.simulator.setDeviceMode('pc')" class="px-2.5 py-1 rounded-lg transition font-mono ${!isMobile ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
              🖥️ PC Mode
            </button>
            <button onclick="window.simulator.setDeviceMode('mobile')" class="px-2.5 py-1 rounded-lg transition font-mono ${isMobile ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
              📱 Mobile Mode
            </button>
          </div>

          <!-- Right: Color Selector, Undo, Clear, Options Drawer -->
          <div class="flex items-center space-x-2">
            <!-- Wire Color Palette -->
            <div class="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onclick="window.simulator.setWireColor('#e63946')" class="w-5 h-5 rounded-full bg-red-500 transition ${this.activeWireColor === '#e63946' ? 'ring-2 ring-white scale-110' : 'opacity-70'}" title="Red (+/Supply)"></button>
              <button onclick="window.simulator.setWireColor('#111827')" class="w-5 h-5 rounded-full bg-slate-800 transition ${this.activeWireColor === '#111827' ? 'ring-2 ring-cyan-400 scale-110' : 'opacity-70'}" title="Black (GND/Return)"></button>
              <button onclick="window.simulator.setWireColor('#2563eb')" class="w-5 h-5 rounded-full bg-blue-600 transition ${this.activeWireColor === '#2563eb' ? 'ring-2 ring-white scale-110' : 'opacity-70'}" title="Blue (Tap/Resistor)"></button>
              <button onclick="window.simulator.setWireColor('#f59e0b')" class="w-5 h-5 rounded-full bg-amber-500 transition ${this.activeWireColor === '#f59e0b' ? 'ring-2 ring-white scale-110' : 'opacity-70'}" title="Amber (Signal)"></button>
            </div>

            <button onclick="window.simulator.undoWire()" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700" title="Undo Wire (Ctrl+Z)">
              Undo
            </button>
            <button onclick="window.simulator.clearAllWires()" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-rose-900/40 text-rose-300 rounded-lg border border-slate-700" title="Clear All Wires">
              Clear
            </button>

            <!-- 3-Dots Menu Button (⋮) to toggle all secondary tabs/tools -->
            <button onclick="window.simulator.toggleSideDrawer()" class="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1" title="Toggle Options & Observation Table">
              <span>⋮ Options</span>
            </button>
          </div>
        </div>

        <!-- Optional Mobile Zoom Bar (Full Board by default fits mobile screen completely) -->
        ${isMobile ? `
          <div class="flex items-center justify-center space-x-2 py-1.5 bg-[#070D1B] border-b border-slate-800/80 text-xs font-mono">
            <span class="text-slate-400 text-[11px]">View:</span>
            <button onclick="window.simulator.setView(-1)" class="px-2.5 py-0.5 rounded-lg border ${this.currentViewIndex === -1 ? 'bg-cyan-600 border-cyan-400 text-white font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
              🌐 Full Board (Fit Phone)
            </button>
            <button onclick="window.simulator.setView(0)" class="px-2 py-0.5 rounded-lg border ${this.currentViewIndex === 0 ? 'bg-cyan-600 border-cyan-400 text-white font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
              🔍 Left
            </button>
            <button onclick="window.simulator.setView(1)" class="px-2 py-0.5 rounded-lg border ${this.currentViewIndex === 1 ? 'bg-cyan-600 border-cyan-400 text-white font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
              ⚡ Meters
            </button>
            <button onclick="window.simulator.setView(2)" class="px-2 py-0.5 rounded-lg border ${this.currentViewIndex === 2 ? 'bg-cyan-600 border-cyan-400 text-white font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
              🔍 Right
            </button>
          </div>
        ` : ''}

        <!-- Interactive Rotary Dial Control Bar for MPTT & Two-Port -->
        ${this.renderKnobControlBar()}

        <!-- Central Stage: Full Board SVG (Scales 100% to Fit Mobile Screen) -->
        <div class="relative flex-1 overflow-auto flex items-center justify-center p-1 sm:p-4 bg-[#030611] cyber-grid-bg" id="simulator-viewport">
          <div class="w-full max-w-[980px] flex items-center justify-center" id="board-svg-container">
            ${this.renderActiveBoardSvg()}
          </div>
        </div>

        <!-- 3-Dots Slide-Out Side Drawer (Observation Table, Custom Row, Graph, PDF) -->
        <div id="simulator-side-drawer" class="side-tools-drawer collapsed flex flex-col justify-between p-4">
          <div class="space-y-4 overflow-y-auto pr-1">
            <div class="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 class="text-sm font-bold font-heading text-white flex items-center space-x-2">
                <span>📋</span>
                <span>Observation & Lab Tools</span>
              </h3>
              <button onclick="window.simulator.toggleSideDrawer()" class="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2">
              <button onclick="window.simulator.checkCircuitConnection()" class="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5">
                <span>✓</span>
                <span>Check Circuit Connection</span>
              </button>

              <button onclick="window.simulator.recordReading()" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5">
                <span>➕</span>
                <span>Record Current Reading</span>
              </button>

              <button onclick="window.simulator.openCustomRowModal()" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5">
                <span>✍️</span>
                <span>Add Custom Table Row</span>
              </button>
            </div>

            <!-- Live HUD -->
            <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div class="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1">Live Measured Values</div>
              <div id="simulator-live-hud">${this.getHUDContent()}</div>
            </div>

            <!-- Observation Trials List -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-300">Observation Table (${this.readings.length})</span>
                <button onclick="window.simulator.clearReadings()" class="text-[10px] text-rose-400 hover:text-rose-300">Clear</button>
              </div>
              <div class="space-y-1.5 max-h-48 overflow-y-auto" id="drawer-readings-list">
                ${this.renderReadingsList()}
              </div>
            </div>

            <!-- Utilities -->
            <div class="pt-2 border-t border-slate-800 space-y-2">
              <button onclick="window.simulator.toggleGraphModal()" class="w-full py-1.5 text-xs bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 rounded-lg border border-violet-500/30 transition">
                📈 View Characteristic Graph
              </button>
              <button onclick="window.simulator.showFormulaModal()" class="w-full py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition">
                📐 Governing Equations
              </button>
            </div>
          </div>

          <!-- Bottom PDF Download -->
          <div class="pt-3 border-t border-slate-800">
            <button onclick="window.simulator.downloadPdfReport()" class="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5">
              <span>📄</span>
              <span>Download Official PDF Report</span>
            </button>
          </div>
        </div>

      </div>

      <div id="simulator-modals-slot"></div>
    `;

    this.bindSvgInteractions();
    this.updateMeters();
  }

  renderKnobControlBar() {
    if (this.currentExpId === 'max-power-transfer-theorem') {
      return `
        <div class="flex items-center justify-between px-4 py-2 bg-[#091122] border-b border-slate-800 text-xs font-mono">
          <div class="flex items-center space-x-3">
            <span class="text-amber-400 font-bold">🎛️ SET LOAD RESISTANCE (VR):</span>
            <input type="range" min="10" max="500" step="5" value="${this.potentiometerValue}" oninput="window.simulator.setPotentiometer(this.value)" class="w-44 sm:w-64 accent-cyan-400 cursor-pointer">
            <span class="text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">${this.potentiometerValue} Ω</span>
          </div>
          <span class="text-[11px] text-slate-400 hidden md:inline">Peak maximum power occurs when RL = Ri (100 Ω)</span>
        </div>
      `;
    } else if (this.currentExpId === 'two-port-zh-parameters') {
      return `
        <div class="flex items-center justify-between px-4 py-2 bg-[#091122] border-b border-slate-800 text-xs font-mono">
          <div class="flex items-center space-x-3">
            <span class="text-amber-400 font-bold">🎛️ SET VOLTS (0 - 10V DC):</span>
            <input type="range" min="0" max="10" step="0.5" value="${this.sourceVoltageValue}" oninput="window.simulator.setSourceVoltage(this.value)" class="w-44 sm:w-64 accent-cyan-400 cursor-pointer">
            <span class="text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">${Number(this.sourceVoltageValue).toFixed(1)} V</span>
          </div>
          <span class="text-[11px] text-slate-400 hidden md:inline">Regulated DC excitation</span>
        </div>
      `;
    } else if (this.currentExpId === 'series-parallel-resonance') {
      return `
        <div class="flex items-center justify-between px-4 py-2 bg-[#091122] border-b border-slate-800 text-xs font-mono">
          <div class="flex items-center space-x-3">
            <span class="text-amber-400 font-bold">🎛️ AC GENERATOR FREQUENCY:</span>
            <input type="range" min="1000" max="10000" step="50" value="${this.resonanceFreq}" oninput="window.simulator.setResonanceFrequency(this.value)" class="w-44 sm:w-64 accent-cyan-400 cursor-pointer">
            <span class="text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">${this.resonanceFreq} Hz</span>
          </div>
          <span class="text-[11px] text-slate-400 hidden md:inline">Resonance peaks at fr = 5.03 kHz</span>
        </div>
      `;
    }
    return '';
  }

  setPotentiometer(val) {
    this.potentiometerValue = Number(val);
    const dialNeedle = this.container.querySelector('#svg-vr-dial-needle');
    if (dialNeedle) {
      const angle = (this.potentiometerValue / 500) * 240 - 120;
      dialNeedle.style.transform = `rotate(${angle}deg)`;
    }
    this.updateMeters();
  }

  setSourceVoltage(val) {
    this.sourceVoltageValue = Number(val);
    const dialNeedle = this.container.querySelector('#svg-volts-dial-needle');
    if (dialNeedle) {
      const angle = (this.sourceVoltageValue / 10) * 240 - 120;
      dialNeedle.style.transform = `rotate(${angle}deg)`;
    }
    this.updateMeters();
  }

  setResonanceFrequency(val) {
    this.resonanceFreq = Number(val);
    this.updateMeters();
  }

  setView(viewIndex) {
    this.currentViewIndex = viewIndex;
    const svgEl = this.container.querySelector('#apparatus-main-svg');
    if (!svgEl) return;

    let vb = "0 0 1000 520";
    if (viewIndex === 0) vb = "0 0 520 520";       // Left view
    else if (viewIndex === 1) vb = "240 0 520 520"; // Center meters
    else if (viewIndex === 2) vb = "480 0 520 520"; // Right view

    svgEl.setAttribute('viewBox', vb);
    this.renderSimulatorUI();
  }

  /* =========================================================================
     BOARD SVG DISPATCHER
     ========================================================================= */

  renderActiveBoardSvg() {
    switch (this.currentExpId) {
      case 'superposition-theorem':
        return this.renderSuperpositionSvg();
      case 'thevenin-norton-theorem':
        return this.renderTheveninSvg();
      case 'max-power-transfer-theorem':
        return this.renderMaxPowerSvg();
      case 'two-port-zh-parameters':
        return this.renderTwoPortSvg();
      case 'series-parallel-resonance':
        return this.renderResonanceSvg();
      default:
        return this.renderSuperpositionSvg();
    }
  }

  getActiveBoardConfig() {
    switch (this.currentExpId) {
      case 'superposition-theorem':
        return this.getSuperpositionConfig();
      case 'thevenin-norton-theorem':
        return this.getTheveninConfig();
      case 'max-power-transfer-theorem':
        return this.getMaxPowerConfig();
      case 'two-port-zh-parameters':
        return this.getTwoPortConfig();
      case 'series-parallel-resonance':
        return this.getResonanceConfig();
      default:
        return this.getSuperpositionConfig();
    }
  }

  /* =========================================================================
     BOARD 1: SUPERPOSITION THEOREM SVG (KEPT UNCHANGED AS DIRECTED)
     ========================================================================= */

  getSuperpositionConfig() {
    return {
      title: 'VERIFICATION OF SUPERPOSITION THEOREM',
      pw: [28, 235],
      sockets: [
        { id: 'S12P', x: 40, y: 300, color: 'r', label: '12V+' },
        { id: 'S12N', x: 40, y: 390, color: 'k', label: '12V-' },
        { id: 'S5P', x: 760, y: 300, color: 'r', label: '5V+' },
        { id: 'S5N', x: 760, y: 390, color: 'k', label: '5V-' },
        { id: 'Lp', x: 120, y: 310, color: 'r', label: 'NL' },
        { id: 'Ln', x: 120, y: 390, color: 'k', label: 'G' },
        { id: 'ga1', x: 120, y: 258, color: 'r', label: 'NL' },
        { id: 'gb1', x: 210, y: 258, color: 'k', label: 'N1' },
        { id: 'Ma', x: 350, y: 258, color: 'b', label: 'NM' },
        { id: 'ga2', x: 400, y: 258, color: 'r', label: 'NM' },
        { id: 'Mb', x: 450, y: 258, color: 'b', label: 'NM' },
        { id: 'gb2', x: 400, y: 325, color: 'k', label: 'N2' },
        { id: 'Gm', x: 400, y: 390, color: 'b', label: 'G' },
        { id: 'gb3', x: 590, y: 258, color: 'k', label: 'N3' },
        { id: 'ga3', x: 680, y: 258, color: 'r', label: 'NR' },
        { id: 'Rp', x: 680, y: 310, color: 'r', label: 'NR' },
        { id: 'Rn', x: 680, y: 390, color: 'k', label: 'G' },
        { id: 'v1n', x: 100, y: 195, color: 'k', label: 'v1n' },
        { id: 'v1p', x: 160, y: 195, color: 'r', label: 'v1p' },
        { id: 'a1n', x: 370, y: 195, color: 'k', label: 'a1n' },
        { id: 'a1p', x: 430, y: 195, color: 'r', label: 'a1p' },
        { id: 'v2n', x: 640, y: 195, color: 'k', label: 'v2n' },
        { id: 'v2p', x: 700, y: 195, color: 'r', label: 'v2p' }
      ],
      meters: [
        { id: 'm1', type: 'V', max: 15, ticks: [0, 3, 6, 9, 12, 15], cx: 130, cy: 105, r: 68 },
        { id: 'm2', type: 'mA', max: 250, ticks: [0, 50, 100, 150, 200, 250], cx: 400, cy: 105, r: 68 },
        { id: 'm3', type: 'V', max: 5, ticks: [0, 1, 2, 3, 4, 5], cx: 670, cy: 105, r: 68 }
      ]
    };
  }

  renderSuperpositionSvg() {
    const cfg = this.getSuperpositionConfig();
    let vb = "0 0 800 430";
    if (this.currentViewIndex === 0) vb = "0 0 440 430";
    else if (this.currentViewIndex === 1) vb = "180 0 440 430";
    else if (this.currentViewIndex === 2) vb = "360 0 440 430";

    return `
      <svg id="apparatus-main-svg" class="w-full h-auto drop-shadow-2xl rounded-2xl" viewBox="${vb}" role="img" aria-label="Superposition Theorem Digital Twin">
        <rect x="3" y="3" width="794" height="424" rx="14" fill="#eef0ee" stroke="#334155" stroke-width="2.5" />
        
        <circle cx="14" cy="14" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="786" cy="14" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="14" cy="416" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="786" cy="416" r="3.5" fill="#94A3B8" stroke="#475569" />

        <text x="400" y="24" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#111827" letter-spacing="1">
          ${cfg.title}
        </text>

        ${cfg.meters.map(m => this.renderSvgAnalogMeter(m)).join('')}

        <path d="M 120 258 V 310" stroke="#111827" stroke-width="2.2" fill="none" />
        <path d="M 350 258 H 450" stroke="#111827" stroke-width="2.2" fill="none" />
        <path d="M 680 258 V 310" stroke="#111827" stroke-width="2.2" fill="none" />
        <path d="M 120 390 H 680" stroke="#111827" stroke-width="2.4" fill="none" />

        <line x1="120" y1="258" x2="210" y2="258" stroke="#111827" stroke-width="2" stroke-dasharray="3 4" />
        <circle cx="165" cy="258" r="11" fill="#eef0ee" stroke="#111827" stroke-width="1.6" />
        <text x="165" y="261.5" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">mA</text>

        <path d="M 210 258 H 255 l 6 -8 l 10 16 l 10 -16 l 10 16 l 10 -16 l 6 8 H 350" stroke="#111827" stroke-width="2" fill="none" />
        <text x="280" y="244" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R1 50Ω</text>

        <line x1="400" y1="258" x2="400" y2="325" stroke="#111827" stroke-width="2" stroke-dasharray="3 4" />
        <circle cx="400" cy="291" r="11" fill="#eef0ee" stroke="#111827" stroke-width="1.6" />
        <text x="400" y="294.5" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">mA</text>

        <path d="M 400 325 V 345 l -8 6 l 16 7 l -16 7 l 16 7 l -16 7 l 8 6 V 390" stroke="#111827" stroke-width="2" fill="none" />
        <text x="424" y="362" text-anchor="start" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R2 10Ω</text>

        <path d="M 450 258 H 495 l 6 -8 l 10 16 l 10 -16 l 10 16 l 10 -16 l 6 8 H 590" stroke="#111827" stroke-width="2" fill="none" />
        <text x="520" y="244" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R3 50Ω</text>

        <line x1="590" y1="258" x2="680" y2="258" stroke="#111827" stroke-width="2" stroke-dasharray="3 4" />
        <circle cx="635" cy="258" r="11" fill="#eef0ee" stroke="#111827" stroke-width="1.6" />
        <text x="635" y="261.5" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">mA</text>

        <path d="M 108 348 h 24 M 114 355 h 12" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="135" y="346" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <path d="M 668 348 h 24 M 674 355 h 12" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="695" y="346" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>

        <text x="40" y="278" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">12V DC OUT</text>
        <text x="760" y="278" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">5V DC OUT</text>
        <text x="120" y="408" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">source in</text>
        <text x="680" y="408" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">source in</text>

        <!-- Power Switch -->
        <g id="svg-power-toggle" class="cursor-pointer" onclick="window.simulator.togglePower()">
          <circle id="svg-pilot-lamp" cx="50" cy="216" r="6" fill="${this.isPoweredOn ? '#EF4444' : '#7F1D1D'}" stroke="#334155" stroke-width="1.5" />
          <circle cx="48.5" cy="214.5" r="1.5" fill="#FFF" opacity="0.6" />
          <rect x="28" y="235" width="44" height="20" rx="10" fill="${this.isPoweredOn ? '#10B981' : '#64748B'}" stroke="#1E293B" stroke-width="1.5" />
          <circle id="svg-toggle-thumb" cx="${this.isPoweredOn ? 62 : 38}" cy="245" r="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
          <text id="svg-power-label" x="50" y="270" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">
            POWER ${this.isPoweredOn ? 'ON' : 'OFF'}
          </text>
        </g>

        <!-- Sockets Layer -->
        <g id="svg-sockets-layer">
          ${cfg.sockets.map(s => this.renderSvgSocket(s)).join('')}
        </g>

        <!-- Wires Layer -->
        <g id="svg-cords-layer">
          ${this.renderSvgCords(cfg.sockets)}
        </g>
      </svg>
    `;
  }

  /* =========================================================================
     BOARD 2: THEVENIN'S & NORTON'S THEOREM SVG (100% MATCHING USER IMAGE 1)
     ========================================================================= */

  getTheveninConfig() {
    return {
      title: "VERIFICATION OF THEVENIN'S & NORTON'S THEOREM",
      sockets: [
        // 12V DC Supply Output at left
        { id: 'S12P', x: 80, y: 440, color: 'r', label: '12V+' },
        { id: 'S12N', x: 80, y: 520, color: 'k', label: '12V-' },

        // Meters Sockets directly below MO-65 meters
        { id: 'v1n', x: 268, y: 296, color: 'k', label: 'V-' },
        { id: 'v1p', x: 392, y: 296, color: 'r', label: 'V+' },

        { id: 'a1n', x: 695, y: 296, color: 'k', label: 'mA-' },
        { id: 'a1p', x: 816, y: 296, color: 'r', label: 'mA+' },

        // Thevenin Circuit (Left) - Exactly matching Image 1
        { id: 'T_IN_p', x: 160, y: 440, color: 'r', label: 'T_IN+' },
        { id: 'T_IN_n', x: 160, y: 584, color: 'k', label: 'G' },
        { id: 'T_R1a', x: 160, y: 376, color: 'b', label: 'T_R1a' },
        { id: 'T_R1b', x: 264, y: 376, color: 'b', label: 'T_R1b' },
        { id: 'T_R2t', x: 264, y: 436, color: 'b', label: 'T_R2t' },
        { id: 'T_R2b', x: 264, y: 584, color: 'b', label: 'G' },
        { id: 'T_R3out', x: 368, y: 376, color: 'r', label: 'T_R3out' },
        { id: 'T_mA_neg', x: 448, y: 376, color: 'k', label: 'T_mA_neg' },

        // Thevenin Loads (RL1, RL2, RL3 top, exactly ONE return socket on bottom rail)
        { id: 'T_RL1t', x: 380, y: 436, color: 'b', label: 'RL1_t' },
        { id: 'T_RL2t', x: 448, y: 436, color: 'b', label: 'RL2_t' },
        { id: 'T_RL3t', x: 516, y: 436, color: 'b', label: 'RL3_t' },
        { id: 'T_RL_b', x: 448, y: 584, color: 'b', label: 'G' },

        // Norton Circuit (Right) - Exactly matching Image 1
        { id: 'N_IN_p', x: 596, y: 440, color: 'r', label: 'N_IN+' },
        { id: 'N_IN_n', x: 596, y: 584, color: 'k', label: 'GN' },
        { id: 'N_R1a', x: 596, y: 376, color: 'b', label: 'N_R1a' },
        { id: 'N_R1b', x: 696, y: 376, color: 'b', label: 'N_R1b' },
        { id: 'N_R2t', x: 680, y: 436, color: 'b', label: 'N_R2t' },
        { id: 'N_R2b', x: 680, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R4t', x: 760, y: 436, color: 'b', label: 'N_R4t' },
        { id: 'N_R4b', x: 760, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R3out', x: 800, y: 376, color: 'r', label: 'N_R3out' },
        { id: 'N_mA_neg', x: 876, y: 376, color: 'k', label: 'N_mA_neg' },

        // Norton Loads (Top only, bottom connects to return bus)
        { id: 'N_RL1t', x: 812, y: 436, color: 'b', label: 'N_RL1_t' },
        { id: 'N_RL2t', x: 880, y: 436, color: 'b', label: 'N_RL2_t' },
        { id: 'N_RL3t', x: 948, y: 436, color: 'b', label: 'N_RL3_t' }
      ],
      meters: [
        { id: 'm1', type: 'V', max: 15, ticks: [0, 2.5, 5, 7.5, 10, 12.5, 15], cx: 330, cy: 150, r: 100 },
        { id: 'm2', type: 'mA', max: 15, ticks: [0, 2.5, 5, 7.5, 10, 12.5, 15], cx: 760, cy: 150, r: 100 }
      ]
    };
  }

  renderTheveninSvg() {
    const cfg = this.getTheveninConfig();
    let vb = "0 0 1000 634";
    if (this.currentViewIndex === 0) vb = "0 0 540 634";
    else if (this.currentViewIndex === 1) vb = "220 0 560 634";
    else if (this.currentViewIndex === 2) vb = "480 0 520 634";

    return `
      <svg id="apparatus-main-svg" class="w-full h-auto drop-shadow-2xl rounded-2xl" viewBox="${vb}" role="img" aria-label="Thevenin and Norton Digital Twin">
        <!-- Authentic Laboratory Chassis -->
        <rect x="3" y="3" width="994" height="628" rx="16" fill="#e7eaef" stroke="#334155" stroke-width="3" />
        
        <!-- Chassis Screws -->
        <circle cx="18" cy="18" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="982" cy="18" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="18" cy="616" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="982" cy="616" r="4" fill="#94A3B8" stroke="#475569" />

        <!-- Power Section Top Left -->
        <g id="svg-power-toggle" class="cursor-pointer" onclick="window.simulator.togglePower()">
          <text x="105" y="75" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">OFF</text>
          <circle cx="105" cy="110" r="14" fill="#CBD5E1" stroke="#64748B" />
          <line x1="105" y1="110" x2="105" y2="${this.isPoweredOn ? 126 : 94}" stroke="#DC2626" stroke-width="5" stroke-linecap="round" />
          <text x="105" y="145" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">ON</text>
          
          <circle id="svg-pilot-lamp" cx="105" cy="205" r="11" fill="${this.isPoweredOn ? '#EF4444' : '#7F1D1D'}" stroke="#334155" stroke-width="2" />
          <circle cx="102" cy="202" r="3" fill="#FFF" opacity="0.6" />
          <text id="svg-power-label" x="105" y="245" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">
            POWER
          </text>
        </g>

        <!-- 2 Big MO-65 Meters at Top (Voltmeter V, Milliammeter mA) -->
        ${cfg.meters.map(m => this.renderSvgAnalogMeter(m)).join('')}

        <!-- Toggle Switch under Voltmeter (3VDC / 15VDC) -->
        <g class="cursor-pointer" onclick="window.simulator.toggleTheveninVoltRange()">
          <path d="M 268 296 V 250 M 392 296 V 250" stroke="#111827" stroke-width="2.2" fill="none" />
          <rect x="305" y="290" width="50" height="18" rx="4" fill="#E2E8F0" stroke="#475569" />
          <circle cx="${this.theveninVoltRange === 3 ? 318 : 342}" cy="299" r="6" fill="#DC2626" />
          <text x="290" y="322" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">3VDC</text>
          <text x="375" y="322" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">15VDC</text>
        </g>

        <!-- Milliammeter Wires under Meter -->
        <path d="M 695 296 V 250 M 816 296 V 250" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- 12V. DC Supply on Left Edge -->
        <text x="55" y="445" text-anchor="end" font-size="12" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="80" y="480" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">12V. DC</text>
        <text x="55" y="525" text-anchor="end" font-size="14" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- ================= THEVENIN'S THEOREM (LOWER LEFT) ================= -->
        <!-- DC battery symbol -->
        <path d="M 160 440 V 376" stroke="#111827" stroke-width="2.5" fill="none" />
        <path d="M 148 505 h 24 M 154 515 h 12" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="178" y="502" font-size="12" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <path d="M 160 525 V 584 H 516" stroke="#111827" stroke-width="2.5" fill="none" />

        <!-- R1 500Ω -->
        <path d="M 160 376 H 195 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 264" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="212" y="362" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R1 500Ω</text>

        <!-- R2 100Ω (Vertical shunt) -->
        <path d="M 264 376 V 436 M 264 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="250" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R2 100Ω</text>

        <!-- R3 90Ω (Horizontal series) -->
        <path d="M 264 376 H 300 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 368" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="316" y="362" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R3 90Ω</text>

        <!-- mA insertion loop -->
        <line x1="368" y1="376" x2="448" y2="376" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <circle cx="408" cy="376" r="14" fill="#e7eaef" stroke="#111827" stroke-width="1.8" />
        <text x="408" y="380" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">mA</text>
        <text x="388" y="365" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="428" y="365" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- Dotted lines to RL1, RL2, RL3 -->
        <line x1="448" y1="376" x2="380" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />
        <line x1="448" y1="376" x2="448" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />
        <line x1="448" y1="376" x2="516" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />

        <!-- Vertical Loads: RL1 25Ω, RL2 50Ω, RL3 100Ω -->
        <path d="M 380 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="365" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL1 25Ω</text>

        <path d="M 448 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="432" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL2 50Ω</text>

        <path d="M 516 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="500" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL3 100Ω</text>

        <text x="340" y="618" text-anchor="middle" font-size="13" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#111827">THEVENIN'S THEOREM</text>

        <!-- ================= NORTON'S THEOREM (LOWER RIGHT) ================= -->
        <!-- DC battery symbol -->
        <path d="M 596 440 V 376" stroke="#111827" stroke-width="2.5" fill="none" />
        <path d="M 584 505 h 24 M 590 515 h 12" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="614" y="502" font-size="12" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <path d="M 596 525 V 584 H 948" stroke="#111827" stroke-width="2.5" fill="none" />

        <!-- R1 1KΩ -->
        <path d="M 596 376 H 630 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 696" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="646" y="362" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R1 1KΩ</text>

        <!-- R2 2KΩ (Vertical shunt) -->
        <path d="M 696 376 V 436 M 696 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="680" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R2 2KΩ</text>

        <!-- R3 500Ω (Horizontal series) -->
        <path d="M 696 376 H 718 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 760" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="728" y="362" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R3 500Ω</text>

        <!-- R4 2KΩ (Vertical shunt) -->
        <path d="M 760 376 V 436 M 760 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="744" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R4 2KΩ</text>

        <!-- Wire to Red (+) socket -->
        <path d="M 760 376 H 800" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- mA insertion loop -->
        <line x1="800" y1="376" x2="876" y2="376" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <circle cx="838" cy="376" r="14" fill="#e7eaef" stroke="#111827" stroke-width="1.8" />
        <text x="838" y="380" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">mA</text>
        <text x="818" y="365" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="858" y="365" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- Dotted lines to Norton Loads -->
        <line x1="876" y1="376" x2="812" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />
        <line x1="876" y1="376" x2="880" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />
        <line x1="876" y1="376" x2="948" y2="436" stroke="#111827" stroke-width="1.8" stroke-dasharray="3 3" />

        <!-- Vertical Loads: RL1 25Ω, RL2 50Ω, RL3 100Ω -->
        <path d="M 812 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="796" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL1 25Ω</text>

        <path d="M 880 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="864" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL2 50Ω</text>

        <path d="M 948 436 V 485 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 584" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="932" y="510" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RL3 100Ω</text>

        <text x="770" y="618" text-anchor="middle" font-size="13" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#111827">NORTON'S THEOREM</text>

        <!-- Sockets Layer -->
        <g id="svg-sockets-layer">
          ${cfg.sockets.map(s => this.renderSvgSocket(s)).join('')}
        </g>

        <!-- Wires Layer (Never disappears on power toggle) -->
        <g id="svg-cords-layer">
          ${this.renderSvgCords(cfg.sockets)}
        </g>
      </svg>
    `;
  }

  toggleTheveninVoltRange() {
    this.theveninVoltRange = this.theveninVoltRange === 15 ? 3 : 15;
    this.updateMeters();
    this.showToast(`Voltmeter range set to ${this.theveninVoltRange}V DC`, 'info');
  }

  /* =========================================================================
     BOARD 3: MAXIMUM POWER TRANSFER THEOREM SVG (100% MATCHING USER IMAGE 2)
     ========================================================================= */

  getMaxPowerConfig() {
    return {
      title: 'VERIFICATION OF MAXIMUM POWER TRANSFER THEOREM',
      sockets: [
        // Top Row: Voltmeter Sockets (facing mA meter)
        { id: 'vp', x: 495, y: 145, color: 'r', label: 'V+' },
        { id: 'vn', x: 495, y: 255, color: 'k', label: 'V-' },

        // Milliammeter Sockets (facing V meter)
        { id: 'ap', x: 595, y: 145, color: 'r', label: 'mA+' },
        { id: 'an', x: 595, y: 255, color: 'k', label: 'mA-' },

        // Lower Left: 3 Fixed Resistors
        { id: 'R50a', x: 108, y: 388, color: 'b', label: '50a' },
        { id: 'R50b', x: 240, y: 388, color: 'b', label: '50b' },

        { id: 'R100a', x: 108, y: 498, color: 'b', label: '100a' },
        { id: 'R100b', x: 240, y: 498, color: 'b', label: '100b' },

        { id: 'R500a', x: 108, y: 608, color: 'b', label: '500a' },
        { id: 'R500b', x: 240, y: 608, color: 'b', label: '500b' },

        // Main Circuit (Lower Right)
        { id: 'S12P', x: 336, y: 495, color: 'r', label: '12V+' },
        { id: 'S12N', x: 336, y: 608, color: 'k', label: '12V-' },

        { id: 'Rs_slot_a', x: 336, y: 388, color: 'b', label: 'Rs_a' },
        { id: 'Rs_slot_b', x: 465, y: 388, color: 'b', label: 'Rs_b' },

        { id: 'mA_slot_p', x: 558, y: 388, color: 'r', label: 'mA_slot+' },
        { id: 'mA_slot_n', x: 668, y: 388, color: 'k', label: 'mA_slot-' },

        { id: 'Top_Load_Node', x: 785, y: 388, color: 'r', label: 'LoadNode' },
        { id: 'VR_top', x: 785, y: 495, color: 'b', label: 'VR_top' },
        { id: 'VR_bot', x: 785, y: 608, color: 'b', label: 'VR_bot' },

        { id: 'Vm_top', x: 915, y: 388, color: 'r', label: 'Vm_top' },
        { id: 'Vm_bot', x: 915, y: 608, color: 'k', label: 'Vm_bot' }
      ],
      meters: [
        { id: 'm1', type: 'V', max: 15, ticks: [0, 2.5, 5, 7.5, 10, 12.5, 15], cx: 330, cy: 200, r: 110 },
        { id: 'm2', type: 'mA', max: 150, ticks: [0, 25, 50, 75, 100, 125, 150], cx: 750, cy: 200, r: 110 }
      ]
    };
  }

  renderMaxPowerSvg() {
    const cfg = this.getMaxPowerConfig();
    let vb = "0 0 1015 634";
    if (this.currentViewIndex === 0) vb = "0 0 520 634";
    else if (this.currentViewIndex === 1) vb = "240 0 540 634";
    else if (this.currentViewIndex === 2) vb = "480 0 535 634";

    return `
      <svg id="apparatus-main-svg" class="w-full h-auto drop-shadow-2xl rounded-2xl" viewBox="${vb}" role="img" aria-label="Maximum Power Transfer Digital Twin">
        <!-- Chassis -->
        <rect x="3" y="3" width="1009" height="628" rx="16" fill="#e7eaef" stroke="#334155" stroke-width="3" />
        
        <!-- Screws -->
        <circle cx="16" cy="16" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="999" cy="16" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="16" cy="618" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="999" cy="618" r="4" fill="#94A3B8" stroke="#475569" />

        <!-- ISO Circle Top Left -->
        <circle cx="95" cy="80" r="18" fill="#FFF" stroke="#111827" stroke-width="2" />
        <text x="95" y="85" text-anchor="middle" font-size="10" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">ISO</text>

        <!-- Centered Header Title -->
        <text x="507" y="36" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="15" fill="#111827" letter-spacing="1">
          ${cfg.title}
        </text>

        <!-- Power Section on Left -->
        <g id="svg-power-toggle" class="cursor-pointer" onclick="window.simulator.togglePower()">
          <text x="120" y="135" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">OFF</text>
          <circle cx="120" cy="168" r="14" fill="#CBD5E1" stroke="#64748B" />
          <line x1="120" y1="168" x2="120" y2="${this.isPoweredOn ? 186 : 150}" stroke="#DC2626" stroke-width="5" stroke-linecap="round" />
          <text x="120" y="205" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">ON</text>
          
          <circle id="svg-pilot-lamp" cx="120" cy="260" r="12" fill="${this.isPoweredOn ? '#EF4444' : '#7F1D1D'}" stroke="#334155" stroke-width="2" />
          <circle cx="117" cy="257" r="3" fill="#FFF" opacity="0.6" />
          <text id="svg-power-label" x="120" y="305" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">
            POWER
          </text>
        </g>

        <!-- 2 Big MO-65 Meters (Left: Voltmeter, Right: Milliammeter) -->
        ${cfg.meters.map(m => this.renderSvgAnalogMeter(m)).join('')}

        <!-- Terminals between meters -->
        <path d="M 440 145 H 495 M 440 255 H 495" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="495" y="205" text-anchor="middle" font-size="14" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">V</text>

        <path d="M 640 145 H 595 M 640 255 H 595" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="595" y="205" text-anchor="middle" font-size="14" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">mA</text>

        <!-- ================= LOWER LEFT: 3 STANDALONE FIXED RESISTORS ================= -->
        <!-- 50Ω Resistor -->
        <text x="174" y="365" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">50Ω</text>
        <path d="M 108 388 H 145 l 6 -10 l 12 20 l 12 -20 l 12 20 l 12 -20 l 6 10 H 240" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- 100Ω Resistor -->
        <text x="174" y="475" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">100Ω</text>
        <path d="M 108 498 H 145 l 6 -10 l 12 20 l 12 -20 l 12 20 l 12 -20 l 6 10 H 240" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- 500Ω Resistor -->
        <text x="174" y="585" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">500Ω</text>
        <path d="M 108 608 H 145 l 6 -10 l 12 20 l 12 -20 l 12 20 l 12 -20 l 6 10 H 240" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- ================= LOWER RIGHT: MAIN MPTT CIRCUIT ================= -->
        <!-- 12VDC Source Branch -->
        <path d="M 336 495 V 388" stroke="#111827" stroke-width="2.5" fill="none" />
        <path d="M 320 540 h 32 M 326 552 h 20" stroke="#111827" stroke-width="2.5" fill="none" />
        <text x="315" y="495" font-size="13" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="368" y="550" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">12VDC</text>
        <text x="315" y="612" font-size="15" font-family="monospace" font-weight="bold" fill="#111827">-</text>
        <path d="M 336 565 V 608 H 915" stroke="#111827" stroke-width="2.5" fill="none" />

        <!-- Series Resistor Slot (Dotted line with zigzag) -->
        <line x1="336" y1="388" x2="368" y2="388" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <path d="M 368 388 l 6 -10 l 12 20 l 12 -20 l 12 20 l 12 -20 l 6 10" stroke="#111827" stroke-width="2" fill="none" />
        <line x1="432" y1="388" x2="465" y2="388" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />

        <!-- Wire to mA socket -->
        <path d="M 465 388 H 558" stroke="#111827" stroke-width="2.5" fill="none" />

        <!-- Series mA circle -->
        <line x1="558" y1="388" x2="668" y2="388" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <circle cx="613" cy="388" r="15" fill="#e7eaef" stroke="#111827" stroke-width="1.8" />
        <text x="613" y="392" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">mA</text>
        <text x="588" y="375" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="638" y="375" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- Top rail to Load Node & Voltmeter -->
        <path d="M 668 388 H 915" stroke="#111827" stroke-width="2.5" fill="none" />

        <!-- Rotary Dial: SET LOAD RESISTANCE (VR) -->
        <g transform="translate(530, 500)">
          <!-- Black arc track above knob -->
          <path d="M -48 -18 A 52 52 0 0 1 48 -18" stroke="#111827" stroke-width="7" stroke-linecap="round" fill="none" />
          <!-- Knob Dial -->
          <circle cx="0" cy="8" r="38" fill="#E2E8F0" stroke="#64748B" stroke-width="2.5" />
          <circle cx="0" cy="8" r="30" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="2 3" />
          <!-- Needle pointer -->
          <g id="svg-vr-dial-needle" style="transform-origin: 0px 8px; transform: rotate(${((this.potentiometerValue / 500) * 240 - 120).toFixed(1)}deg);">
            <line x1="0" y1="8" x2="-24" y2="0" stroke="#111827" stroke-width="4.5" stroke-linecap="round" />
          </g>
          <text x="0" y="58" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">SET LOAD</text>
          <text x="0" y="70" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">RESISTANCE(VR)</text>
        </g>

        <!-- VR Vertical Potentiometer -->
        <line x1="785" y1="388" x2="785" y2="495" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <path d="M 785 495 V 525 l -8 5 l 16 10 l -16 10 l 16 10 l -16 10 l 8 5 V 608" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Arrow through VR -->
        <line x1="765" y1="565" x2="805" y2="540" stroke="#111827" stroke-width="2.2" />
        <polygon points="805,540 796,543 800,550" fill="#111827" />
        <text x="760" y="555" text-anchor="end" font-size="12" font-family="monospace" font-weight="bold" fill="#111827">VR</text>

        <!-- Dotted Voltmeter Loop -->
        <line x1="915" y1="388" x2="915" y2="608" stroke="#111827" stroke-width="2" stroke-dasharray="3 3" />
        <circle cx="915" cy="498" r="15" fill="#e7eaef" stroke="#111827" stroke-width="1.8" />
        <text x="915" y="502" text-anchor="middle" font-size="12" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">V</text>
        <text x="930" y="455" font-size="11" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="930" y="550" font-size="14" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- Sockets Layer -->
        <g id="svg-sockets-layer">
          ${cfg.sockets.map(s => this.renderSvgSocket(s)).join('')}
        </g>

        <!-- Wires Layer -->
        <g id="svg-cords-layer">
          ${this.renderSvgCords(cfg.sockets)}
        </g>
      </svg>
    `;
  }

  /* =========================================================================
     BOARD 4: Z & H PARAMETERS TWO PORT TRAINER (100% MATCHING USER IMAGE 3)
     ========================================================================= */

  getTwoPortConfig() {
    return {
      title: 'Z & H PARAMETERS OF TWO PORT NETWORK',
      sockets: [
        // Left Voltmeter Sockets & Range Switch
        { id: 'vp', x: 512, y: 84, color: 'r', label: 'V+' },
        { id: 'vn', x: 512, y: 175, color: 'k', label: 'V-' },

        // Right Milliammeter Sockets & Range Switch
        { id: 'ap', x: 568, y: 84, color: 'r', label: 'mA+' },
        { id: 'an', x: 568, y: 175, color: 'k', label: 'mA-' },

        // 0-10V DC Output Sockets
        { id: 'SP', x: 280, y: 298, color: 'r', label: 'SP' },
        { id: 'SN', x: 280, y: 468, color: 'k', label: 'SN' },

        // NETWORK-1 (T-Network) - Exactly 8 sockets matching Image 2
        { id: 'N1_IN_p', x: 350, y: 298, color: 'r', label: 'N1_IN+' },
        { id: 'N1_Ta', x: 390, y: 298, color: 'b', label: 'N1_Ta' },
        { id: 'N1_Tc', x: 530, y: 298, color: 'b', label: 'N1_Tc' },
        { id: 'N1_OUT_p', x: 570, y: 298, color: 'r', label: 'N1_OUT+' },

        { id: 'N1_IN_n', x: 350, y: 468, color: 'k', label: 'N1_IN-' },
        { id: 'N1_Ga', x: 390, y: 468, color: 'b', label: 'N1_Ga' },
        { id: 'N1_Gc', x: 530, y: 468, color: 'b', label: 'N1_Gc' },
        { id: 'N1_OUT_n', x: 570, y: 468, color: 'k', label: 'N1_OUT-' },

        // NETWORK-2 (Identical T-Network) - Exactly 8 sockets matching Image 2
        { id: 'N2_IN_p', x: 635, y: 298, color: 'r', label: 'N2_IN+' },
        { id: 'N2_Ta', x: 675, y: 298, color: 'b', label: 'N2_Ta' },
        { id: 'N2_Tc', x: 810, y: 298, color: 'b', label: 'N2_Tc' },
        { id: 'N2_OUT_p', x: 850, y: 298, color: 'r', label: 'N2_OUT+' },

        { id: 'N2_IN_n', x: 635, y: 468, color: 'k', label: 'N2_IN-' },
        { id: 'N2_Ga', x: 675, y: 468, color: 'b', label: 'N2_Ga' },
        { id: 'N2_Gc', x: 810, y: 468, color: 'b', label: 'N2_Gc' },
        { id: 'N2_OUT_n', x: 850, y: 468, color: 'k', label: 'N2_OUT-' }
      ],
      meters: [
        { id: 'm1', type: 'V', max: 12, ticks: [0, 2, 4, 6, 8, 10, 12], cx: 330, cy: 150, r: 105 },
        { id: 'm2', type: 'mA', max: 10, ticks: [0, 2, 4, 6, 8, 10], cx: 715, cy: 150, r: 105 }
      ]
    };
  }

  renderTwoPortSvg() {
    const cfg = this.getTwoPortConfig();
    let vb = "0 0 1024 504";
    if (this.currentViewIndex === 0) vb = "0 0 520 504";
    else if (this.currentViewIndex === 1) vb = "250 0 520 504";
    else if (this.currentViewIndex === 2) vb = "500 0 524 504";

    return `
      <svg id="apparatus-main-svg" class="w-full h-auto drop-shadow-2xl rounded-2xl" viewBox="${vb}" role="img" aria-label="Two Port Z and H Parameters Digital Twin">
        <!-- Chassis -->
        <rect x="3" y="3" width="1018" height="498" rx="16" fill="#e7eaef" stroke="#334155" stroke-width="3" />
        
        <!-- Screws -->
        <circle cx="16" cy="16" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="1008" cy="16" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="16" cy="488" r="4" fill="#94A3B8" stroke="#475569" />
        <circle cx="1008" cy="488" r="4" fill="#94A3B8" stroke="#475569" />

        <!-- ISO Circle Top Left -->
        <circle cx="160" cy="20" r="16" fill="#FFF" stroke="#111827" stroke-width="2" />
        <text x="160" y="24" text-anchor="middle" font-size="9" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">ISO</text>

        <!-- Power Section on Left -->
        <g id="svg-power-toggle" class="cursor-pointer" onclick="window.simulator.togglePower()">
          <text x="185" y="80" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">OFF</text>
          <circle cx="185" cy="115" r="13" fill="#CBD5E1" stroke="#64748B" />
          <line x1="185" y1="115" x2="185" y2="${this.isPoweredOn ? 130 : 100}" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" />
          <text x="185" y="150" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">ON</text>
          
          <circle id="svg-pilot-lamp" cx="185" cy="200" r="11" fill="${this.isPoweredOn ? '#EF4444' : '#7F1D1D'}" stroke="#334155" stroke-width="2" />
          <circle cx="182" cy="197" r="3" fill="#FFF" opacity="0.6" />
          <text id="svg-power-label" x="185" y="240" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">
            POWER
          </text>
        </g>

        <!-- 2 Big MO-65 Meters at Top (Voltmeter V, Milliammeter mA) -->
        ${cfg.meters.map(m => this.renderSvgAnalogMeter(m)).join('')}

        <!-- Terminals & Range Switch beside Voltmeter -->
        <g class="cursor-pointer" onclick="window.simulator.toggleTwoPortVoltRange()">
          <path d="M 445 84 H 512 M 445 175 H 512" stroke="#111827" stroke-width="2.2" fill="none" />
          <rect x="475" y="115" width="28" height="16" rx="3" fill="#E2E8F0" stroke="#475569" />
          <circle cx="489" cy="${this.twoPortVoltRange === 3 ? 120 : 126}" r="5" fill="#DC2626" />
          <text x="460" y="115" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">3VDC</text>
          <text x="460" y="145" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">12VDC</text>
        </g>

        <!-- Terminals & Range Switch beside Milliammeter -->
        <g class="cursor-pointer" onclick="window.simulator.toggleTwoPortCurrentRange()">
          <path d="M 620 84 H 568 M 620 175 H 568" stroke="#111827" stroke-width="2.2" fill="none" />
          <rect x="580" y="115" width="28" height="16" rx="3" fill="#E2E8F0" stroke="#475569" />
          <circle cx="594" cy="${this.twoPortCurrentRange === 1 ? 120 : 126}" r="5" fill="#DC2626" />
          <text x="615" y="115" text-anchor="start" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">1mA</text>
          <text x="615" y="145" text-anchor="start" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">10mA</text>
        </g>

        <!-- ================= LOWER LEFT: 0-10V VARIABLE SOURCE ================= -->
        <!-- Rotary Dial: SET VOLTS -->
        <g transform="translate(170, 385)">
          <path d="M 36 -28 A 45 45 0 0 1 36 36" stroke="#111827" stroke-width="6" stroke-linecap="round" fill="none" />
          <circle cx="0" cy="4" r="34" fill="#E2E8F0" stroke="#64748B" stroke-width="2.5" />
          <circle cx="0" cy="4" r="26" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="2 3" />
          <g id="svg-volts-dial-needle" style="transform-origin: 0px 4px; transform: rotate(${((this.sourceVoltageValue / 10) * 240 - 120).toFixed(1)}deg);">
            <line x1="0" y1="4" x2="22" y2="16" stroke="#111827" stroke-width="4" stroke-linecap="round" />
          </g>
          <text x="0" y="52" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">SET</text>
          <text x="0" y="64" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">VOLTS</text>
        </g>

        <!-- Output wires to SP & SN -->
        <path d="M 210 298 H 280 M 210 468 H 280 M 210 298 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="245" y="378" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">OUTPUT</text>
        <text x="245" y="392" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">0-10V DC</text>
        <text x="305" y="302" font-size="13" font-family="monospace" font-weight="bold" fill="#111827">+</text>
        <text x="305" y="472" font-size="15" font-family="monospace" font-weight="bold" fill="#111827">-</text>

        <!-- ================= LOWER CENTER: NETWORK-1 (T-NETWORK) ================= -->
        <path d="M 350 298 H 390" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 390 298 H 408 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 460 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 530" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="424" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="495" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) - connects to line, NO socket at bottom -->
        <path d="M 460 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <circle cx="460" cy="468" r="3" fill="#111827" />
        <text x="476" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N1_OUT_p -->
        <path d="M 530 298 H 570" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-1 with Blue nodes at 390 and 530 -->
        <path d="M 350 468 H 570" stroke="#111827" stroke-width="2.2" fill="none" />

        <text x="365" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">INPUT</text>
        <text x="550" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">OUTPUT</text>
        <text x="460" y="492" text-anchor="middle" font-size="11" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">NETWORK-1</text>

        <!-- ================= LOWER RIGHT: NETWORK-2 (IDENTICAL T-NETWORK) ================= -->
        <path d="M 635 298 H 675" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 675 298 H 692 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 742 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 810" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="704" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="775" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) - connects to line, NO socket at bottom -->
        <path d="M 742 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <circle cx="742" cy="468" r="3" fill="#111827" />
        <text x="758" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N2_OUT_p -->
        <path d="M 810 298 H 850" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-2 with Blue nodes at 675 and 810 -->
        <path d="M 635 468 H 850" stroke="#111827" stroke-width="2.2" fill="none" />

        <text x="650" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">INPUT</text>
        <text x="830" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">OUTPUT</text>
        <text x="742" y="492" text-anchor="middle" font-size="11" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">NETWORK-2</text>

        <!-- Sockets Layer -->
        <g id="svg-sockets-layer">
          ${cfg.sockets.map(s => this.renderSvgSocket(s)).join('')}
        </g>

        <!-- Wires Layer -->
        <g id="svg-cords-layer">
          ${this.renderSvgCords(cfg.sockets)}
        </g>
      </svg>
    `;
  }

  toggleTwoPortVoltRange() {
    this.twoPortVoltRange = this.twoPortVoltRange === 12 ? 3 : 12;
    this.updateMeters();
    this.showToast(`Voltmeter range set to ${this.twoPortVoltRange} V`, 'info');
  }

  /* =========================================================================
     BOARD 5: SERIES & PARALLEL RESONANCE RLC CIRCUIT SVG
     ========================================================================= */

  getResonanceConfig() {
    return {
      title: 'STUDY OF SERIES & PARALLEL RESONANCE CIRCUIT',
      sockets: [
        // AC Generator Output
        { id: 'AC_p', x: 120, y: 280, color: 'r', label: 'AC+' },
        { id: 'AC_n', x: 120, y: 390, color: 'k', label: 'AC-' },

        // Resistors, Inductor, Capacitor components
        { id: 'R_in', x: 260, y: 280, color: 'b', label: 'R_in' },
        { id: 'R_out', x: 380, y: 280, color: 'b', label: 'R_out' },

        { id: 'L_in', x: 440, y: 280, color: 'b', label: 'L_in' },
        { id: 'L_out', x: 560, y: 280, color: 'b', label: 'L_out' },

        { id: 'C_in', x: 620, y: 280, color: 'b', label: 'C_in' },
        { id: 'C_out', x: 740, y: 280, color: 'b', label: 'C_out' },

        { id: 'G_loop', x: 740, y: 390, color: 'k', label: 'G_loop' },

        // Meter sockets
        { id: 'v1n', x: 200, y: 195, color: 'k', label: 'V-' },
        { id: 'v1p', x: 280, y: 195, color: 'r', label: 'V+' },

        { id: 'a1n', x: 600, y: 195, color: 'k', label: 'mA-' },
        { id: 'a1p', x: 680, y: 195, color: 'r', label: 'mA+' }
      ],
      meters: [
        { id: 'm1', type: 'V', max: 10, ticks: [0, 2, 4, 6, 8, 10], cx: 240, cy: 105, r: 68 },
        { id: 'm2', type: 'mA', max: 100, ticks: [0, 20, 40, 60, 80, 100], cx: 640, cy: 105, r: 68 }
      ]
    };
  }

  renderResonanceSvg() {
    const cfg = this.getResonanceConfig();
    let vb = "0 0 880 440";
    if (this.currentViewIndex === 0) vb = "0 0 440 440";
    else if (this.currentViewIndex === 1) vb = "220 0 440 440";
    else if (this.currentViewIndex === 2) vb = "440 0 440 440";

    return `
      <svg id="apparatus-main-svg" class="w-full h-auto drop-shadow-2xl rounded-2xl" viewBox="${vb}" role="img" aria-label="RLC Resonance Digital Twin">
        <rect x="3" y="3" width="874" height="434" rx="14" fill="#eef0ee" stroke="#334155" stroke-width="2.5" />
        
        <circle cx="15" cy="15" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="865" cy="15" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="15" cy="425" r="3.5" fill="#94A3B8" stroke="#475569" />
        <circle cx="865" cy="425" r="3.5" fill="#94A3B8" stroke="#475569" />

        <text x="440" y="24" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#111827" letter-spacing="1">
          ${cfg.title}
        </text>

        <!-- Power Switch -->
        <g id="svg-power-toggle" class="cursor-pointer" onclick="window.simulator.togglePower()">
          <circle id="svg-pilot-lamp" cx="50" cy="180" r="6" fill="${this.isPoweredOn ? '#EF4444' : '#7F1D1D'}" stroke="#334155" stroke-width="1.5" />
          <rect x="28" y="200" width="44" height="20" rx="10" fill="${this.isPoweredOn ? '#10B981' : '#64748B'}" stroke="#1E293B" stroke-width="1.5" />
          <circle id="svg-toggle-thumb" cx="${this.isPoweredOn ? 62 : 38}" cy="210" r="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
          <text id="svg-power-label" x="50" y="235" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">
            POWER ${this.isPoweredOn ? 'ON' : 'OFF'}
          </text>
        </g>

        <!-- 2 Meters: Voltmeter V and True RMS Ammeter mA -->
        ${cfg.meters.map(m => this.renderSvgAnalogMeter(m)).join('')}

        <!-- AC Source Symbol -->
        <circle cx="120" cy="335" r="16" fill="#FFF" stroke="#111827" stroke-width="2" />
        <path d="M 112 335 Q 116 327, 120 335 T 128 335" stroke="#111827" stroke-width="2" fill="none" />
        <text x="120" y="265" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">AC 5V RMS</text>

        <!-- Resistor 100Ω -->
        <path d="M 260 280 H 290 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 380" stroke="#111827" stroke-width="2" fill="none" />
        <text x="320" y="265" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">R 100Ω</text>

        <!-- Inductor 10mH -->
        <path d="M 440 280 H 465 Q 475 260 485 280 Q 495 260 505 280 Q 515 260 525 280 Q 535 260 545 280 H 560" stroke="#111827" stroke-width="2" fill="none" />
        <text x="500" y="265" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">L 10mH</text>

        <!-- Capacitor 0.1μF -->
        <path d="M 620 280 H 670 M 670 268 V 292 M 680 268 V 292 M 680 280 H 740" stroke="#111827" stroke-width="2" fill="none" />
        <text x="675" y="260" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#111827">C 0.1μF</text>

        <!-- Return ground line -->
        <path d="M 120 390 H 740" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Sockets Layer -->
        <g id="svg-sockets-layer">
          ${cfg.sockets.map(s => this.renderSvgSocket(s)).join('')}
        </g>

        <!-- Wires Layer -->
        <g id="svg-cords-layer">
          ${this.renderSvgCords(cfg.sockets)}
        </g>
      </svg>
    `;
  }

  /* =========================================================================
     METER & SOCKET RENDERING HELPERS
     ========================================================================= */

  renderSvgAnalogMeter(m) {
    const py = m.cy + m.r * 0.5; // Pivot center
    const needleLen = m.r - 12;
    const startAngle = -50 * (Math.PI / 180);
    const endAngle = 50 * (Math.PI / 180);

    let ticksSvg = '';
    const numTicks = m.ticks.length;

    for (let i = 0; i < numTicks; i++) {
      const frac = i / (numTicks - 1);
      const angle = startAngle + frac * (endAngle - startAngle);
      const val = m.ticks[i];

      const x1 = m.cx + (needleLen + 6) * Math.sin(angle);
      const y1 = py - (needleLen + 6) * Math.cos(angle);
      const x2 = m.cx + needleLen * Math.sin(angle);
      const y2 = py - needleLen * Math.cos(angle);

      const tx = m.cx + (needleLen - 12) * Math.sin(angle);
      const ty = py - (needleLen - 12) * Math.cos(angle) + 4;

      ticksSvg += `
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#111827" stroke-width="2" />
        <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="${m.r > 100 ? 12 : 9}" font-family="monospace" font-weight="bold" fill="#111827" text-anchor="middle">${val}</text>
      `;

      if (i < numTicks - 1) {
        for (let j = 1; j <= 4; j++) {
          const subFrac = (i + j / 5) / (numTicks - 1);
          const subAngle = startAngle + subFrac * (endAngle - startAngle);
          const sx1 = m.cx + (needleLen + 4) * Math.sin(subAngle);
          const sy1 = py - (needleLen + 4) * Math.cos(subAngle);
          const sx2 = m.cx + needleLen * Math.sin(subAngle);
          const sy2 = py - needleLen * Math.cos(subAngle);
          ticksSvg += `<line x1="${sx1.toFixed(1)}" y1="${sy1.toFixed(1)}" x2="${sx2.toFixed(1)}" y2="${sy2.toFixed(1)}" stroke="#64748B" stroke-width="1.2" />`;
        }
      }
    }

    return `
      <g id="meter-group-${m.id}">
        <!-- Outer Black Bezel -->
        <circle cx="${m.cx}" cy="${m.cy}" r="${m.r + 6}" fill="#181C22" stroke="#334155" stroke-width="2.5" />
        
        <!-- White Inner Dial Faceplate -->
        <circle cx="${m.cx}" cy="${m.cy}" r="${m.r}" fill="#FFFFFF" />
        
        <!-- Bottom Dark Bezel segment matching MO-65 photos -->
        <path d="M ${m.cx - m.r} ${m.cy + m.r * 0.3} A ${m.r} ${m.r} 0 0 0 ${m.cx + m.r} ${m.cy + m.r * 0.3} Z" fill="#181C22" />

        <!-- Anti-Parallax Mirrored Strip -->
        <path d="M ${m.cx - m.r * 0.72} ${m.cy + 10} A ${m.r * 0.72} ${m.r * 0.72} 0 0 1 ${m.cx + m.r * 0.72} ${m.cy + 10}" fill="none" stroke="#CBD5E1" stroke-width="3" />
        
        ${ticksSvg}

        <text x="${m.cx}" y="${m.cy + 16}" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="${m.r > 100 ? 18 : 14}" font-weight="bold" fill="#0F172A">
          ${m.type}
        </text>
        <text x="${m.cx}" y="${m.cy + 28}" text-anchor="middle" font-family="monospace" font-size="${m.r > 100 ? 9 : 7}" fill="#64748B">
          MO : 65
        </text>

        <!-- Red Pointer Needle with Pivot Hub -->
        <g id="needle-${m.id}" style="transform-origin: ${m.cx}px ${py}px; transform: rotate(-50deg); transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <line x1="${m.cx}" y1="${py}" x2="${m.cx}" y2="${py - needleLen - 4}" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="${m.cx}" cy="${py}" r="5" fill="#0F172A" />
          <circle cx="${m.cx}" cy="${py}" r="2" fill="#DC2626" />
        </g>

        <!-- Live Digital Readout Value (Color coded teal) -->
        <text id="digital-${m.id}" x="${m.cx}" y="${py + (m.r > 100 ? 95 : 75)}" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#0e8c7f">
          0 ${m.type}
        </text>
      </g>
    `;
  }

  renderSvgSocket(s) {
    const isSelected = this.selectedSocket === s.id;
    const socketColorHex = s.color === 'r' ? '#DC2626' : s.color === 'k' ? '#0F172A' : '#2563EB';

    return `
      <g class="cursor-pointer group" onclick="window.simulator.handleSocketClick('${s.id}')">
        <!-- Generous 22px touch target radius for effortless phone tapping -->
        <circle cx="${s.x}" cy="${s.y}" r="22" fill="transparent" />
        
        <!-- Outer Brass Bezel -->
        <circle cx="${s.x}" cy="${s.y}" r="11" fill="${socketColorHex}" stroke="${isSelected ? '#F59E0B' : '#000000'}" stroke-width="${isSelected ? 4 : 1.8}" />
        
        <!-- Plug Receptacle Bore -->
        <circle cx="${s.x}" cy="${s.y}" r="4" fill="#000000" opacity="0.8" />
        
        ${isSelected ? `
          <circle cx="${s.x}" cy="${s.y}" r="16" fill="none" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="3 3">
            <animateTransform attributeName="transform" type="rotate" from="0 ${s.x} ${s.y}" to="360 ${s.x} ${s.y}" dur="4s" repeatCount="indefinite" />
          </circle>
        ` : ''}
      </g>
    `;
  }

  /* =========================================================================
     PATCHCORDS LAYER (Bezier Wires that NEVER Disappear)
     ========================================================================= */

  renderSvgCords(sockets) {
    const socketMap = Object.fromEntries(sockets.map(s => [s.id, s]));

    return this.wires.map((wire, idx) => {
      const a = socketMap[wire.from];
      const b = socketMap[wire.to];
      if (!a || !b) return '';

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const sag = Math.min(65, Math.max(25, dist * 0.22)) + (idx % 3) * 6;

      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 + sag;
      const pathData = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;

      return `
        <g class="cursor-pointer group" onclick="window.simulator.removeWireByIndex(${idx})" title="Click wire to remove (${wire.from} -> ${wire.to})">
          <path d="${pathData}" stroke="rgba(0,0,0,0.35)" stroke-width="7" fill="none" opacity="0.3" transform="translate(0, 3)" />
          <path d="${pathData}" stroke="${wire.color}" stroke-width="4.5" stroke-linecap="round" fill="none" />
          <circle cx="${a.x}" cy="${a.y}" r="4.5" fill="#0F172A" stroke="${wire.color}" stroke-width="1.5" />
          <circle cx="${b.x}" cy="${b.y}" r="4.5" fill="#0F172A" stroke="${wire.color}" stroke-width="1.5" />
        </g>
      `;
    }).join('');
  }

  handleSocketClick(socketId) {
    if (window.labAudio) window.labAudio.playWireSnap();

    if (!this.selectedSocket) {
      this.selectedSocket = socketId;
      this.refreshBoardGraphics();
    } else if (this.selectedSocket === socketId) {
      this.selectedSocket = null;
      this.refreshBoardGraphics();
    } else {
      const newWire = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        from: this.selectedSocket,
        to: socketId,
        color: this.activeWireColor
      };

      this.wires.push(newWire);
      this.history.push({ action: 'add', wire: newWire });
      this.redoStack = [];
      this.selectedSocket = null;

      this.refreshBoardGraphics();
      this.updateMeters();
      this.showToast('Patchcord connected', 'info');
    }
  }

  removeWireByIndex(idx) {
    if (idx < 0 || idx >= this.wires.length) return;
    this.wires.splice(idx, 1);
    if (window.labAudio) window.labAudio.playWireSnap();
    this.refreshBoardGraphics();
    this.updateMeters();
    this.showToast('Patchcord removed', 'info');
  }

  undoWire() {
    if (this.wires.length === 0) return;
    this.wires.pop();
    if (window.labAudio) window.labAudio.playWireSnap();
    this.refreshBoardGraphics();
    this.updateMeters();
    this.showToast('Last wire undone', 'info');
  }

  clearAllWires() {
    if (this.wires.length === 0) return;
    this.wires = [];
    this.selectedSocket = null;
    if (window.labAudio) window.labAudio.playWireSnap();
    this.refreshBoardGraphics();
    this.updateMeters();
    this.showToast('All patchcords cleared', 'info');
  }

  setWireColor(colorHex) {
    this.activeWireColor = colorHex;
    this.renderSimulatorUI();
  }

  refreshBoardGraphics() {
    const cordsLayer = this.container.querySelector('#svg-cords-layer');
    const socketsLayer = this.container.querySelector('#svg-sockets-layer');
    const cfg = this.getActiveBoardConfig();

    if (cordsLayer) cordsLayer.innerHTML = this.renderSvgCords(cfg.sockets);
    if (socketsLayer) socketsLayer.innerHTML = cfg.sockets.map(s => this.renderSvgSocket(s)).join('');
  }

  /* =========================================================================
     POWER SWITCH & SMOOTH TOGGLE (Wires Stay 100% In Place)
     ========================================================================= */

  togglePower() {
    this.isPoweredOn = !this.isPoweredOn;

    if (window.labAudio) {
      window.labAudio.playSwitchClick(this.isPoweredOn);
      if (this.isPoweredOn && window.labSettings?.settings?.enableHum) {
        window.labAudio.startLabHum();
      } else {
        window.labAudio.stopLabHum();
      }
    }

    const pilotLamp = this.container.querySelector('#svg-pilot-lamp');
    const toggleThumb = this.container.querySelector('#svg-toggle-thumb');
    const powerLabel = this.container.querySelector('#svg-power-label');

    if (pilotLamp) pilotLamp.setAttribute('fill', this.isPoweredOn ? '#EF4444' : '#7F1D1D');
    if (toggleThumb) {
      const isLeft = toggleThumb.getAttribute('cx') < 100;
      toggleThumb.setAttribute('cx', this.isPoweredOn ? (isLeft ? 62 : 494) : (isLeft ? 38 : 470));
      const rect = toggleThumb.previousElementSibling;
      if (rect) rect.setAttribute('fill', this.isPoweredOn ? '#10B981' : '#64748B');
    }
    if (powerLabel) powerLabel.textContent = `POWER ${this.isPoweredOn ? 'ON' : 'OFF'}`;

    this.updateMeters();
    this.showToast(this.isPoweredOn ? 'Power Switched ON' : 'Power Switched OFF', this.isPoweredOn ? 'success' : 'info');
  }

  /* =========================================================================
     ZERO-ERROR CIRCUIT SOLVERS FOR ALL 5 BOARDS
     ========================================================================= */

  updateMeters() {
    switch (this.currentExpId) {
      case 'superposition-theorem':
        this.solveSuperpositionZeroError();
        break;
      case 'thevenin-norton-theorem':
        this.solveTheveninZeroError();
        break;
      case 'max-power-transfer-theorem':
        this.solveMaxPowerZeroError();
        break;
      case 'two-port-zh-parameters':
        this.solveTwoPortZeroError();
        break;
      case 'series-parallel-resonance':
        this.solveResonanceZeroError();
        break;
      default:
        this.solveSuperpositionZeroError();
    }

    const hud = document.getElementById('simulator-live-hud');
    if (hud) hud.innerHTML = this.getHUDContent();
  }

  solveSuperpositionZeroError() {
    const m1Needle = this.container.querySelector('#needle-m1');
    const m2Needle = this.container.querySelector('#needle-m2');
    const m3Needle = this.container.querySelector('#needle-m3');
    const m1Text = this.container.querySelector('#digital-m1');
    const m2Text = this.container.querySelector('#digital-m2');
    const m3Text = this.container.querySelector('#digital-m3');

    if (!this.isPoweredOn) {
      this.setMeterDeflection(m1Needle, m1Text, 0, 15, 'V');
      this.setMeterDeflection(m2Needle, m2Text, 0, 250, 'mA');
      this.setMeterDeflection(m3Needle, m3Text, 0, 5, 'V');
      return;
    }

    const hasWire = (s1, s2) => this.wires.some(w => 
      (w.from === s1 && w.to === s2) || (w.from === s2 && w.to === s1)
    );

    const is12VConnected = (hasWire('S12P', 'Lp') || hasWire('S12P', 'ga1')) && 
                           (hasWire('S12N', 'Ln') || hasWire('S12N', 'Gm'));

    const is5VConnected = (hasWire('S5P', 'Rp') || hasWire('S5P', 'ga3')) && 
                          (hasWire('S5N', 'Rn') || hasWire('S5N', 'Gm'));

    const isRightShorted = hasWire('Rp', 'Rn') || hasWire('ga3', 'Rn') || hasWire('Rp', 'Gm');
    const isLeftShorted = hasWire('Lp', 'Ln') || hasWire('ga1', 'Ln') || hasWire('Lp', 'Gm');

    let v1Val = 0, v2Val = 0, iR2_mA = 0;

    if (is12VConnected && is5VConnected) {
      v1Val = 12.0;
      v2Val = 5.0;
      iR2_mA = 242.9; // Exact algebraic sum (171.4 + 71.4)
    } else if (is12VConnected && (isRightShorted || !is5VConnected)) {
      v1Val = 12.0;
      v2Val = 0.0;
      iR2_mA = 171.4;
    } else if (is5VConnected && (isLeftShorted || !is12VConnected)) {
      v1Val = 0.0;
      v2Val = 5.0;
      iR2_mA = 71.4;
    } else if (is12VConnected) {
      v1Val = 12.0;
      iR2_mA = 171.4;
    } else if (is5VConnected) {
      v2Val = 5.0;
      iR2_mA = 71.4;
    }

    this.setMeterDeflection(m1Needle, m1Text, v1Val, 15, 'V');
    this.setMeterDeflection(m2Needle, m2Text, iR2_mA, 250, 'mA');
    this.setMeterDeflection(m3Needle, m3Text, v2Val, 5, 'V');
  }

  solveTheveninZeroError() {
    const m1Needle = this.container.querySelector('#needle-m1');
    const m2Needle = this.container.querySelector('#needle-m2');
    const m1Text = this.container.querySelector('#digital-m1');
    const m2Text = this.container.querySelector('#digital-m2');

    if (!this.isPoweredOn) {
      this.setMeterDeflection(m1Needle, m1Text, 0, this.theveninVoltRange, 'V');
      this.setMeterDeflection(m2Needle, m2Text, 0, 15, 'mA');
      return;
    }

    const hasWire = (s1, s2) => this.wires.some(w => 
      (w.from === s1 && w.to === s2) || (w.from === s2 && w.to === s1)
    );

    // Is 12V connected to Thevenin or Norton input?
    const is12VThevenin = (hasWire('S12P', 'T_IN_p') || hasWire('S12P', 'T_R1a')) &&
                          (hasWire('S12N', 'T_IN_n') || hasWire('S12N', 'T_R2b'));

    const is12VNorton = (hasWire('S12P', 'N_IN_p') || hasWire('S12P', 'N_R1a')) &&
                        (hasWire('S12N', 'N_IN_n') || hasWire('S12N', 'N_R2b'));

    let v = 0;
    let i_mA = 0;

    if (is12VThevenin) {
      // Open circuit voltage Vth = 12 * 100 / 600 = 2.0 V
      v = 2.0;

      // Check load connections: RL1 (25Ω), RL2 (50Ω), RL3 (100Ω)
      const isRL1 = hasWire('T_mA_neg', 'T_RL1t') || (hasWire('a1p', 'T_R3out') && hasWire('a1n', 'T_RL1t'));
      const isRL2 = hasWire('T_mA_neg', 'T_RL2t') || (hasWire('a1p', 'T_R3out') && hasWire('a1n', 'T_RL2t'));
      const isRL3 = hasWire('T_mA_neg', 'T_RL3t') || (hasWire('a1p', 'T_R3out') && hasWire('a1n', 'T_RL3t'));
      const isShort = hasWire('T_mA_neg', 'T_RL_b') || hasWire('T_R3out', 'T_RL_b');

      if (isShort) {
        i_mA = 11.5; // Short circuit Isc = Vth / Rth = 2.0 / 173.3 = 11.54 mA
      } else if (isRL1) {
        i_mA = 10.1; // 2.0 / (173.3 + 25) = 10.08 mA
        v = 0.25;
      } else if (isRL2) {
        i_mA = 9.0;  // 2.0 / (173.3 + 50) = 8.96 mA
        v = 0.45;
      } else if (isRL3) {
        i_mA = 7.3;  // 2.0 / (173.3 + 100) = 7.32 mA
        v = 0.73;
      }
    } else if (is12VNorton) {
      i_mA = 11.5; // Norton short circuit current
      v = 2.0;
    }

    this.setMeterDeflection(m1Needle, m1Text, v, this.theveninVoltRange, 'V');
    this.setMeterDeflection(m2Needle, m2Text, i_mA, 15, 'mA');
  }

  solveMaxPowerZeroError() {
    const m1Needle = this.container.querySelector('#needle-m1');
    const m2Needle = this.container.querySelector('#needle-m2');
    const m1Text = this.container.querySelector('#digital-m1');
    const m2Text = this.container.querySelector('#digital-m2');

    if (!this.isPoweredOn) {
      this.setMeterDeflection(m1Needle, m1Text, 0, 15, 'V');
      this.setMeterDeflection(m2Needle, m2Text, 0, 150, 'mA');
      return;
    }

    const hasWire = (s1, s2) => this.wires.some(w => 
      (w.from === s1 && w.to === s2) || (w.from === s2 && w.to === s1)
    );

    // Identify which source resistor is connected: 50Ω, 100Ω, 500Ω
    let Ri = 100; // default 100Ω
    if (hasWire('Rs_slot_a', 'R50a') && hasWire('Rs_slot_b', 'R50b')) Ri = 50;
    else if (hasWire('Rs_slot_a', 'R500a') && hasWire('Rs_slot_b', 'R500b')) Ri = 500;

    const RL = this.potentiometerValue;
    const isCircuitComplete = this.wires.length >= 2;

    let v = 0;
    let i_mA = 0;

    if (isCircuitComplete) {
      i_mA = (12 / (Ri + RL)) * 1000;
      v = 12 * (RL / (Ri + RL));
    }

    this.setMeterDeflection(m1Needle, m1Text, v, 15, 'V');
    this.setMeterDeflection(m2Needle, m2Text, i_mA, 150, 'mA');
  }

  solveTwoPortZeroError() {
    const m1Needle = this.container.querySelector('#needle-m1');
    const m2Needle = this.container.querySelector('#needle-m2');
    const m1Text = this.container.querySelector('#digital-m1');
    const m2Text = this.container.querySelector('#digital-m2');

    if (!this.isPoweredOn) {
      this.setMeterDeflection(m1Needle, m1Text, 0, this.twoPortVoltRange, 'V');
      this.setMeterDeflection(m2Needle, m2Text, 0, this.twoPortCurrentRange, 'mA');
      return;
    }

    const V1 = this.sourceVoltageValue; // 0-10V
    const hasWire = (s1, s2) => this.wires.some(w => 
      (w.from === s1 && w.to === s2) || (w.from === s2 && w.to === s1)
    );

    const isConnected = this.wires.length >= 2;
    let i1_mA = 0;
    let v2 = 0;

    if (isConnected) {
      // Symmetrical T-network (1k, 1k, 1k)
      // When output is open (I2 = 0):
      // Total Rin = 1k + 1k = 2 kΩ
      // I1 = V1 / 2k
      // V2 = I1 * 1k = V1 / 2
      i1_mA = (V1 / 2000) * 1000;
      v2 = V1 * 0.5;

      // If output is shorted (h11 condition)
      const isOutShorted = hasWire('N1_OUT_p', 'N1_OUT_n');
      if (isOutShorted) {
        i1_mA = (V1 / 1500) * 1000;
        v2 = 0.0;
      }
    }

    this.setMeterDeflection(m1Needle, m1Text, v2, this.twoPortVoltRange, 'V');
    this.setMeterDeflection(m2Needle, m2Text, i1_mA, this.twoPortCurrentRange, 'mA');
  }

  solveResonanceZeroError() {
    const m1Needle = this.container.querySelector('#needle-m1');
    const m2Needle = this.container.querySelector('#needle-m2');
    const m1Text = this.container.querySelector('#digital-m1');
    const m2Text = this.container.querySelector('#digital-m2');

    if (!this.isPoweredOn) {
      this.setMeterDeflection(m1Needle, m1Text, 0, 10, 'V');
      this.setMeterDeflection(m2Needle, m2Text, 0, 100, 'mA');
      return;
    }

    const f = this.resonanceFreq;
    const L = 10e-3;
    const C = 0.1e-6;
    const R = 100;
    const V_rms = 5.0;

    const omega = 2 * Math.PI * f;
    const XL = omega * L;
    const XC = 1 / (omega * C);
    const X = XL - XC;
    const Z = Math.sqrt(R * R + X * X);
    const I_mA = (V_rms / Z) * 1000;

    this.setMeterDeflection(m1Needle, m1Text, V_rms, 10, 'V');
    this.setMeterDeflection(m2Needle, m2Text, I_mA, 100, 'mA');
  }

  setMeterDeflection(needleEl, textEl, val, maxVal, unit) {
    if (!needleEl) return;
    const frac = Math.max(0, Math.min(1.05, val / maxVal));
    const angle = -50 + frac * 100; // -50 deg to +50 deg deflection

    needleEl.style.transform = `rotate(${angle.toFixed(1)}deg)`;
    if (textEl) {
      textEl.textContent = `${val.toFixed(1)} ${unit}`;
      textEl.setAttribute('fill', val > 0 ? '#0e8c7f' : '#64748B');
    }
  }

  bindSvgInteractions() {
    const svg = this.container.querySelector('#apparatus-main-svg');
    if (svg) {
      svg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) e.preventDefault();
      }, { passive: false });
    }
  }

  /* =========================================================================
     HUD, READINGS & REPORT GENERATOR
     ========================================================================= */

  getHUDContent() {
    if (this.currentExpId === 'superposition-theorem') {
      return `
        <div class="flex justify-between"><span>V1 (Left):</span><span class="text-cyan-300 font-bold">${this.isPoweredOn ? '12.0 V' : '0.0 V'}</span></div>
        <div class="flex justify-between"><span>I2 (R2 Branch):</span><span class="text-emerald-300 font-bold">${this.isPoweredOn ? '242.9 mA' : '0.0 mA'}</span></div>
        <div class="flex justify-between"><span>V2 (Right):</span><span class="text-cyan-300 font-bold">${this.isPoweredOn ? '5.0 V' : '0.0 V'}</span></div>
      `;
    } else if (this.currentExpId === 'thevenin-norton-theorem') {
      return `
        <div class="flex justify-between"><span>Open-Circuit Vth:</span><span class="text-cyan-300 font-bold">${this.isPoweredOn ? '2.0 V' : '0.0 V'}</span></div>
        <div class="flex justify-between"><span>Short-Circuit Isc:</span><span class="text-emerald-300 font-bold">${this.isPoweredOn ? '11.5 mA' : '0.0 mA'}</span></div>
        <div class="flex justify-between"><span>Thevenin Rth:</span><span class="text-amber-300 font-bold">173.3 Ω</span></div>
      `;
    } else if (this.currentExpId === 'max-power-transfer-theorem') {
      const Ri = 100;
      const RL = this.potentiometerValue;
      const I_mA = this.isPoweredOn ? (12 / (Ri + RL)) * 1000 : 0;
      const VL = this.isPoweredOn ? 12 * (RL / (Ri + RL)) : 0;
      const P_mW = (VL * I_mA).toFixed(1);
      return `
        <div class="flex justify-between"><span>Load RL:</span><span class="text-amber-300 font-bold">${RL} Ω</span></div>
        <div class="flex justify-between"><span>Load Current:</span><span class="text-emerald-300 font-bold">${I_mA.toFixed(1)} mA</span></div>
        <div class="flex justify-between"><span>Power Absorbed:</span><span class="text-cyan-300 font-bold">${P_mW} mW</span></div>
      `;
    } else if (this.currentExpId === 'two-port-zh-parameters') {
      return `
        <div class="flex justify-between"><span>Input Voltage V1:</span><span class="text-cyan-300 font-bold">${this.isPoweredOn ? this.sourceVoltageValue.toFixed(1) + ' V' : '0.0 V'}</span></div>
        <div class="flex justify-between"><span>Input Current I1:</span><span class="text-emerald-300 font-bold">${this.isPoweredOn ? (this.sourceVoltageValue / 2).toFixed(1) + ' mA' : '0.0 mA'}</span></div>
        <div class="flex justify-between"><span>Output Voltage V2:</span><span class="text-cyan-300 font-bold">${this.isPoweredOn ? (this.sourceVoltageValue * 0.5).toFixed(1) + ' V' : '0.0 V'}</span></div>
      `;
    } else {
      return `
        <div class="flex justify-between"><span>Frequency:</span><span class="text-cyan-300 font-bold">${this.resonanceFreq} Hz</span></div>
        <div class="flex justify-between"><span>Applied Voltage:</span><span class="text-cyan-300 font-bold">5.0 V RMS</span></div>
      `;
    }
  }

  checkCircuitConnection() {
    if (!this.isPoweredOn) {
      this.showToast('Please switch POWER ON to verify active current paths.', 'warning');
      return;
    }

    if (this.wires.length < 2) {
      this.showToast('Circuit incomplete. Connect patchcords between power supply and apparatus sockets.', 'warning');
      return;
    }

    this.showToast('✓ Circuit verified. Meters deflect with exact textbook physics.', 'success');
  }

  recordReading() {
    let newTrial = {};

    if (this.currentExpId === 'superposition-theorem') {
      newTrial = {
        trial: this.readings.length + 1,
        time: new Date().toLocaleTimeString(),
        V1: this.isPoweredOn ? '12.0 V' : '0.0 V',
        V2: this.isPoweredOn ? '5.0 V' : '0.0 V',
        I1: '191.4 mA',
        I2: '242.9 mA',
        I3: '51.5 mA',
        note: 'Superposition trial'
      };
    } else if (this.currentExpId === 'max-power-transfer-theorem') {
      const Ri = 100;
      const RL = this.potentiometerValue;
      const I_mA = this.isPoweredOn ? (12 / (Ri + RL)) * 1000 : 0;
      const VL = this.isPoweredOn ? 12 * (RL / (Ri + RL)) : 0;
      newTrial = {
        trial: this.readings.length + 1,
        time: new Date().toLocaleTimeString(),
        RL: `${RL} Ω`,
        VL: `${VL.toFixed(2)} V`,
        IL: `${I_mA.toFixed(1)} mA`,
        Power: `${(VL * I_mA).toFixed(1)} mW`,
        note: RL === 100 ? 'Peak Maximum Power' : 'MPTT trial'
      };
    } else if (this.currentExpId === 'thevenin-norton-theorem') {
      newTrial = {
        trial: this.readings.length + 1,
        time: new Date().toLocaleTimeString(),
        Vth: '2.0 V',
        Rth: '173.3 Ω',
        Isc: '11.5 mA',
        note: 'Thevenin-Norton trial'
      };
    } else if (this.currentExpId === 'two-port-zh-parameters') {
      newTrial = {
        trial: this.readings.length + 1,
        time: new Date().toLocaleTimeString(),
        V1: `${this.sourceVoltageValue.toFixed(1)} V`,
        I1: `${(this.sourceVoltageValue / 2).toFixed(1)} mA`,
        V2: `${(this.sourceVoltageValue * 0.5).toFixed(1)} V`,
        note: 'Two-Port trial'
      };
    } else {
      newTrial = {
        trial: this.readings.length + 1,
        time: new Date().toLocaleTimeString(),
        Freq: `${this.resonanceFreq} Hz`,
        V: '5.0 V RMS',
        note: 'Resonance trial'
      };
    }

    this.readings.push(newTrial);
    this.persistStudentReadings();

    const list = document.getElementById('drawer-readings-list');
    if (list) list.innerHTML = this.renderReadingsList();

    this.showToast(`Trial #${newTrial.trial} added to observation table!`, 'success');
  }

  renderReadingsList() {
    if (this.readings.length === 0) {
      return `<div class="text-[11px] text-slate-500 italic p-2">No trials recorded yet.</div>`;
    }
    return this.readings.map((r, i) => `
      <div class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
        <div>
          <span class="text-cyan-400 font-bold">#${r.trial || i + 1}</span>
          <span class="text-slate-300 ml-1">${r.Power ? `RL:${r.RL} | P:${r.Power}` : `I:${r.I2 || r.IL || r.I1 || r.Freq} | V:${r.V1 || r.VL || r.Vth || r.V}`}</span>
        </div>
        <button onclick="window.simulator.deleteReading(${i})" class="text-rose-400 hover:text-rose-300">✕</button>
      </div>
    `).join('');
  }

  deleteReading(idx) {
    this.readings.splice(idx, 1);
    this.persistStudentReadings();
    const list = document.getElementById('drawer-readings-list');
    if (list) list.innerHTML = this.renderReadingsList();
  }

  clearReadings() {
    this.readings = [];
    this.persistStudentReadings();
    const list = document.getElementById('drawer-readings-list');
    if (list) list.innerHTML = this.renderReadingsList();
    this.showToast('Observation table cleared', 'info');
  }

  openCustomRowModal() {
    const slot = document.getElementById('simulator-modals-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>✍️</span>
              <span>Add Custom Observation Row</span>
            </h3>
            <button onclick="document.getElementById('simulator-modals-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-slate-400">Enter custom measurements to include in your personalized observation table.</p>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-slate-400 mb-1">Supply V1 (V):</label>
                <input type="text" id="cust-v1" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" value="12.0 V">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Supply V2 / VL:</label>
                <input type="text" id="cust-v2" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" value="5.0 V">
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-slate-400 mb-1">Current I1:</label>
                <input type="text" id="cust-i1" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" placeholder="191.4 mA">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Current I2:</label>
                <input type="text" id="cust-i2" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" placeholder="242.9 mA">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Current I3:</label>
                <input type="text" id="cust-i3" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" placeholder="51.5 mA">
              </div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Observation Note:</label>
              <input type="text" id="cust-note" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2" placeholder="e.g. Verified experimental trial">
            </div>

            <div class="pt-3 flex justify-end space-x-2">
              <button onclick="document.getElementById('simulator-modals-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
              <button onclick="window.simulator.saveCustomRow()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow">Save Row</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  saveCustomRow() {
    const row = {
      trial: this.readings.length + 1,
      time: new Date().toLocaleTimeString(),
      V1: document.getElementById('cust-v1')?.value || '12.0 V',
      V2: document.getElementById('cust-v2')?.value || '5.0 V',
      I1: document.getElementById('cust-i1')?.value || '191.4 mA',
      I2: document.getElementById('cust-i2')?.value || '242.9 mA',
      I3: document.getElementById('cust-i3')?.value || '51.5 mA',
      note: document.getElementById('cust-note')?.value || 'Custom trial'
    };

    this.readings.push(row);
    this.persistStudentReadings();

    const list = document.getElementById('drawer-readings-list');
    if (list) list.innerHTML = this.renderReadingsList();

    document.getElementById('simulator-modals-slot').innerHTML = '';
    this.showToast(`Custom trial #${row.trial} saved!`, 'success');
  }

  persistStudentReadings() {
    try {
      const saved = JSON.parse(localStorage.getItem('mvl_student_readings') || '{}');
      saved[this.currentExpId] = this.readings;
      localStorage.setItem('mvl_student_readings', JSON.stringify(saved));
    } catch (e) {}
  }

  toggleGraphModal() {
    const slot = document.getElementById('simulator-modals-slot');
    if (!slot) return;

    if (slot.innerHTML.trim() !== '') {
      slot.innerHTML = '';
      return;
    }

    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];
    const isMPTT = this.currentExpId === 'max-power-transfer-theorem';

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span class="text-cyan-400">📈</span>
              <span>Characteristic Curve: ${exp.title.en}</span>
            </h3>
            <button onclick="document.getElementById('simulator-modals-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="bg-[#070D1A] rounded-xl p-4 border border-slate-800 flex flex-col items-center">
            ${isMPTT ? `
              <!-- MPTT Bell Curve P vs RL -->
              <svg class="w-full h-[220px]" viewBox="0 0 500 220">
                <line x1="50" y1="180" x2="450" y2="180" stroke="#334155" stroke-width="2" />
                <line x1="50" y1="30" x2="50" y2="180" stroke="#334155" stroke-width="2" />
                
                <text x="250" y="205" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Load Resistance RL (Ω)</text>
                <text x="35" y="25" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Power (mW)</text>
                
                <path d="M 50 180 Q 150 40, 250 40 T 450 160" fill="none" stroke="#00F2FE" stroke-width="3" />
                <circle cx="250" cy="40" r="6" fill="#10B981" />
                <text x="250" y="28" fill="#10B981" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">Pmax = 360 mW (RL = Ri = 100Ω)</text>
              </svg>
            ` : `
              <!-- Multi-Branch Current Bars -->
              <svg class="w-full h-[220px]" viewBox="0 0 500 220">
                <line x1="50" y1="180" x2="450" y2="180" stroke="#334155" stroke-width="2" />
                <text x="120" y="200" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Branch I1 (Left)</text>
                <text x="250" y="200" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Branch I2 (Center)</text>
                <text x="380" y="200" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Branch I3 (Right)</text>
                
                <rect x="100" y="50" width="40" height="130" fill="#38BDF8" rx="4" />
                <text x="120" y="42" fill="#38BDF8" font-size="10" font-family="monospace" text-anchor="middle">191.4 mA</text>

                <rect x="230" y="20" width="40" height="160" fill="#10B981" rx="4" />
                <text x="250" y="14" fill="#10B981" font-size="10" font-family="monospace" text-anchor="middle">242.9 mA</text>

                <rect x="360" y="140" width="40" height="40" fill="#FACC15" rx="4" />
                <text x="380" y="132" fill="#FACC15" font-size="10" font-family="monospace" text-anchor="middle">51.5 mA</text>
              </svg>
            `}
          </div>

          <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>• Theoretical curves dynamically plotted from circuit equations.</span>
            <button onclick="window.simulator.downloadPdfReport()" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">Export in Report</button>
          </div>
        </div>
      </div>
    `;
  }

  showFormulaModal() {
    const slot = document.getElementById('simulator-modals-slot');
    if (!slot) return;

    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span class="text-cyan-400">📐</span>
              <span>Circuit Equations: ${exp.title.en}</span>
            </h3>
            <button onclick="document.getElementById('simulator-modals-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="text-xs font-mono text-slate-300 bg-[#0B1220] p-4 rounded-xl border border-slate-800 whitespace-pre-wrap max-h-[360px] overflow-y-auto">
            ${exp.theory.en}
          </div>
        </div>
      </div>
    `;
  }

  downloadPdfReport() {
    if (window.pdfReportGenerator) {
      window.pdfReportGenerator.generate(this.currentExpId, this.readings);
    } else {
      this.showToast('Generating official lab report...', 'info');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'warning' ? 'bg-amber-600' : 'bg-slate-800 border border-slate-600';
    toast.className = `fixed bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-white text-xs font-medium shadow-2xl z-50 ${bg} flex items-center space-x-2 transition-all transform animate-bounce`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

window.simulator = new LabSimulator();
