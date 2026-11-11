/**
 * MY VIRTUAL LAB - Live Lab Board Manager
 * Digital Twin of physical college lab benches at Bihar Engineering University.
 * Real-time availability tracking, staff status controls, fault reporting, and student alerts.
 */

class LiveLabBoard {
  constructor() {
    this.container = null;
    this.filterStatus = 'ALL'; // 'ALL', 'FREE', 'IN_USE', 'MAINTENANCE'
    this.benches = this.loadBenches();
  }

  loadBenches() {
    const defaultBenches = [
      {
        id: "bench-1",
        name: "Lab Bench 01",
        instrument: "MARS ME 592B Superposition Apparatus",
        model: "ME 592B",
        lab: "Circuit Analysis Lab (Room 204)",
        status: "FREE", // FREE, IN_USE, MAINTENANCE
        currentUser: null,
        timeRemaining: null,
        specs: "Built-in 12V & 5V DC supplies, 3 Analog Milliammeters",
        lastInspection: "Today, 10:30 AM"
      },
      {
        id: "bench-2",
        name: "Lab Bench 02",
        instrument: "MARS ME 593-B Thevenin & Norton Apparatus",
        model: "ME 593-B",
        lab: "Circuit Analysis Lab (Room 204)",
        status: "IN_USE",
        currentUser: "Aarav Sharma (Roll: 22105123004)",
        timeRemaining: "18 mins remaining",
        specs: "Dual-range analog meters, 12V DC, Precision resistance bank",
        lastInspection: "Yesterday"
      },
      {
        id: "bench-3",
        name: "Lab Bench 03",
        instrument: "MARS ME 595B Maximum Power Transfer Kit",
        model: "ME 595B",
        lab: "Circuit Analysis Lab (Room 204)",
        status: "FREE",
        currentUser: null,
        timeRemaining: null,
        specs: "12V DC, 1kΩ Variable Potentiometer, Voltmeter & Ammeter",
        lastInspection: "Today, 09:15 AM"
      },
      {
        id: "bench-4",
        name: "Lab Bench 04",
        instrument: "MARS ME 986B-ZH Two-Port Z & H Kit",
        model: "ME 986B-ZH",
        lab: "Network Theory Lab (Room 206)",
        status: "IN_USE",
        currentUser: "Priya Kumari (Roll: 22105123022)",
        timeRemaining: "32 mins remaining",
        specs: "0-10V Continuously Variable Regulated Supply, Dual T-Networks",
        lastInspection: "Today, 11:00 AM"
      },
      {
        id: "bench-5",
        name: "Lab Bench 05",
        instrument: "RLC Series & Parallel Resonance Trainer",
        model: "ME 598-RLC",
        lab: "AC Fundamentals Lab (Room 204)",
        status: "FREE",
        currentUser: null,
        timeRemaining: null,
        specs: "Inductor bank (5mH, 10mH), Capacitor bank, Decade box",
        lastInspection: "2 days ago"
      },
      {
        id: "bench-6",
        name: "Lab Bench 06",
        instrument: "3-Phase Induction Motor & Brake Dynamometer",
        model: "ME 702-EM",
        lab: "Electrical Machines Lab (Room 101)",
        status: "MAINTENANCE",
        currentUser: null,
        timeRemaining: "Under calibration check",
        specs: "415V AC 3-Phase, Stator-Rotor starter, Tachometer sensor",
        lastInspection: "Inspection scheduled"
      },
      {
        id: "bench-7",
        name: "Lab Bench 07",
        instrument: "Single-Phase Transformer OC & SC Test Bench",
        model: "ME 704-TR",
        lab: "Electrical Machines Lab (Room 101)",
        status: "FREE",
        currentUser: null,
        timeRemaining: null,
        specs: "1 kVA 230V/115V Transformer, Wattmeter LPF & UPF, Variac",
        lastInspection: "Today, 08:30 AM"
      },
      {
        id: "bench-8",
        name: "Lab Bench 08",
        instrument: "Digital Multimeter & Calibration Station",
        model: "DMM 4½ Digit",
        lab: "General Measurement Lab",
        status: "IN_USE",
        currentUser: "Rohan Patel (Roll: 22105123041)",
        timeRemaining: "12 mins remaining",
        specs: "0.02% Accuracy DC Voltage, True RMS AC, 100MHz Scope",
        lastInspection: "Today, 09:00 AM"
      }
    ];

    try {
      const stored = localStorage.getItem('mvl_live_benches');
      return stored ? JSON.parse(stored) : defaultBenches;
    } catch (e) {
      return defaultBenches;
    }
  }

  saveBenches() {
    try {
      localStorage.setItem('mvl_live_benches', JSON.stringify(this.benches));
    } catch (e) {}
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  setFilter(status) {
    this.filterStatus = status;
    this.render();
  }

  refresh() {
    if (window.labAudio) window.labAudio.playSwitchClick(true);
    // Simulate real-time heartbeat refresh
    this.benches = this.loadBenches();
    this.render();
    if (window.simulator) window.simulator.showToast('Live Lab Board refreshed with college lab telemetry', 'info');
  }

  render() {
    if (!this.container) return;

    const filtered = this.benches.filter(b => {
      if (this.filterStatus === 'ALL') return true;
      return b.status === this.filterStatus;
    });

    const isHindi = document.documentElement.getAttribute('lang') === 'hi';

    const freeCount = this.benches.filter(b => b.status === 'FREE').length;
    const inUseCount = this.benches.filter(b => b.status === 'IN_USE').length;
    const maintCount = this.benches.filter(b => b.status === 'MAINTENANCE').length;

    this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Live Header Banner -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/70 relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>${isHindi ? 'लाइव कॉलेज लैब डिजिटल ट्विन टेलीमेट्री' : 'LIVE COLLEGE LAB DIGITAL TWIN TELEMETRY'}</span>
              </div>
              <h2 class="text-2xl font-bold font-heading text-white">
                ${isHindi ? 'लाइव लैब बोर्ड (भौतिक उपकरण स्थिति)' : 'Live Lab Board (Physical Instrument Twin)'}
              </h2>
              <p class="text-xs text-slate-400 mt-1 max-w-2xl">
                ${isHindi 
                  ? 'कॉलेज लैब के भौतिक बेंचों की लाइव उपलब्धता देखें। जब कोई उपकरण खाली हो जाए तो अभ्यास के लिए तुरंत सिमुलेटर खोलें।'
                  : 'Live occupancy status of physical hardware benches at Bihar Engineering University. Check which apparatus is currently free, under student practice, or scheduled for maintenance.'}
              </p>
            </div>

            <!-- Action Controls -->
            <div class="flex items-center space-x-2">
              <button onclick="window.liveLabBoard.subscribeAlerts()" class="px-3.5 py-2 text-xs font-medium bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-xl flex items-center space-x-1.5 transition">
                <span>🔔</span>
                <span>${isHindi ? 'खाली होने पर अलर्ट पाएं' : 'Subscribe to Alerts'}</span>
              </button>
              <button onclick="window.liveLabBoard.refresh()" class="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center space-x-1.5 transition">
                <span>🔄</span>
                <span>${isHindi ? 'रीफ्रेश' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <!-- Quick Statistics Bar -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-400 block">${isHindi ? 'कुल बेंच' : 'Total Benches'}</span>
                <span class="text-xl font-bold font-mono text-white">${this.benches.length}</span>
              </div>
              <span class="text-2xl">🏛️</span>
            </div>

            <div class="bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40 flex items-center justify-between">
              <div>
                <span class="text-xs text-emerald-400 block">${isHindi ? 'उपलब्ध (Free)' : 'Available (Free)'}</span>
                <span class="text-xl font-bold font-mono text-emerald-300">${freeCount}</span>
              </div>
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div class="bg-amber-950/20 p-3 rounded-xl border border-amber-900/40 flex items-center justify-between">
              <div>
                <span class="text-xs text-amber-400 block">${isHindi ? 'उपयोग में (In Use)' : 'In Use'}</span>
                <span class="text-xl font-bold font-mono text-amber-300">${inUseCount}</span>
              </div>
              <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            </div>

            <div class="bg-rose-950/20 p-3 rounded-xl border border-rose-900/40 flex items-center justify-between">
              <div>
                <span class="text-xs text-rose-400 block">${isHindi ? 'रखरखाव (Maintenance)' : 'Maintenance'}</span>
                <span class="text-xl font-bold font-mono text-rose-300">${maintCount}</span>
              </div>
              <span class="w-3 h-3 rounded-full bg-rose-400"></span>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center space-x-2">
          <button onclick="window.liveLabBoard.setFilter('ALL')" class="px-4 py-1.5 text-xs font-medium rounded-lg transition ${this.filterStatus === 'ALL' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}">
            ${isHindi ? 'सभी उपकरण' : 'All Benches'} (${this.benches.length})
          </button>
          <button onclick="window.liveLabBoard.setFilter('FREE')" class="px-4 py-1.5 text-xs font-medium rounded-lg transition ${this.filterStatus === 'FREE' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}">
            🟢 ${isHindi ? 'उपलब्ध' : 'Free / Available'} (${freeCount})
          </button>
          <button onclick="window.liveLabBoard.setFilter('IN_USE')" class="px-4 py-1.5 text-xs font-medium rounded-lg transition ${this.filterStatus === 'IN_USE' ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}">
            🟡 ${isHindi ? 'उपयोग में' : 'In Use'} (${inUseCount})
          </button>
          <button onclick="window.liveLabBoard.setFilter('MAINTENANCE')" class="px-4 py-1.5 text-xs font-medium rounded-lg transition ${this.filterStatus === 'MAINTENANCE' ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}">
            🔴 ${isHindi ? 'रखरखाव' : 'Maintenance'} (${maintCount})
          </button>
        </div>

        <!-- Benches Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filtered.map(bench => this.renderBenchCard(bench, isHindi)).join('')}
        </div>

      </div>

      <!-- Staff Status Modal Container -->
      <div id="live-board-modal-slot"></div>
    `;
  }

  renderBenchCard(bench, isHindi) {
    const statusBg = bench.status === 'FREE' 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      : bench.status === 'IN_USE' 
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

    const statusDot = bench.status === 'FREE'
      ? 'bg-emerald-400 animate-ping'
      : bench.status === 'IN_USE'
      ? 'bg-amber-400'
      : 'bg-rose-400';

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between relative group">
        <div>
          <!-- Top Row: Bench name & Status Badge -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-semibold text-slate-400 flex items-center space-x-1.5">
              <span>📍</span>
              <span>${bench.name}</span>
            </span>
            <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${statusBg}">
              <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
              <span class="font-bold">${bench.status}</span>
            </div>
          </div>

          <!-- Instrument Name -->
          <h3 class="text-base font-bold font-heading text-white group-hover:text-cyan-400 transition mb-1">
            ${bench.instrument}
          </h3>
          <p class="text-xs text-slate-400 font-mono mb-3">${bench.lab}</p>

          <!-- Specifications Note -->
          <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono mb-3">
            <div class="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Apparatus Hardware Specs</div>
            ${bench.specs}
          </div>

          <!-- Current Student / Occupant Info -->
          ${bench.status === 'IN_USE' ? `
            <div class="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30 mb-3">
              <span>👤</span>
              <div class="truncate">
                <div>${bench.currentUser}</div>
                <div class="text-[10px] text-amber-400/80 font-mono">⏳ ${bench.timeRemaining}</div>
              </div>
            </div>
          ` : bench.status === 'MAINTENANCE' ? `
            <div class="text-xs text-rose-300 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30 mb-3 font-mono">
              ⚠️ ${bench.timeRemaining}
            </div>
          ` : `
            <div class="text-xs text-emerald-400 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30 mb-3 font-mono">
              ✓ Ready for Student Practice Session
            </div>
          `}
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          ${bench.status === 'FREE' ? `
            <button onclick="window.app.navigateTo('simulator', 'superposition-theorem')" class="flex-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center justify-center space-x-1">
              <span>⚡</span>
              <span>${isHindi ? 'सिमुलेटर शुरू करें' : 'Open Simulator'}</span>
            </button>
          ` : `
            <button onclick="window.liveLabBoard.subscribeAlerts('${bench.name}')" class="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center justify-center space-x-1">
              <span>🔔</span>
              <span>${isHindi ? 'अलर्ट सेट करें' : 'Notify Me'}</span>
            </button>
          `}

          <!-- Lab Staff Control Button -->
          <button onclick="window.liveLabBoard.openStaffStatusModal('${bench.id}')" class="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700" title="Lab Staff: Change Status or Report Fault">
            ⚙️ ${isHindi ? 'स्टाफ' : 'Staff'}
          </button>
        </div>
      </div>
    `;
  }

  openStaffStatusModal(benchId) {
    const bench = this.benches.find(b => b.id === benchId);
    if (!bench) return;

    const slot = document.getElementById('live-board-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>🛠️</span>
              <span>Lab Staff Controls: ${bench.name}</span>
            </h3>
            <button onclick="document.getElementById('live-board-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Instrument:</label>
              <div class="p-2 bg-slate-900 rounded font-mono text-white">${bench.instrument}</div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Update Status:</label>
              <select id="staff-status-select" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono">
                <option value="FREE" ${bench.status === 'FREE' ? 'selected' : ''}>FREE (Available)</option>
                <option value="IN_USE" ${bench.status === 'IN_USE' ? 'selected' : ''}>IN_USE (Student Practice)</option>
                <option value="MAINTENANCE" ${bench.status === 'MAINTENANCE' ? 'selected' : ''}>MAINTENANCE (Inspection/Repair)</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Occupant Note / Fault Details:</label>
              <input type="text" id="staff-note-input" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2" placeholder="e.g. Broken patch terminal or Roll No" value="${bench.currentUser || ''}">
            </div>

            <div class="pt-2 flex items-center space-x-2">
              <button onclick="window.liveLabBoard.updateBenchStatus('${bench.id}')" class="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow">
                Save Status
              </button>
              <button onclick="window.liveLabBoard.reportFault('${bench.id}')" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow">
                Report Fault
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateBenchStatus(benchId) {
    const bench = this.benches.find(b => b.id === benchId);
    if (!bench) return;

    const select = document.getElementById('staff-status-select');
    const input = document.getElementById('staff-note-input');

    if (select) bench.status = select.value;
    if (input) {
      if (bench.status === 'IN_USE') {
        bench.currentUser = input.value || "Student Practice";
        bench.timeRemaining = "25 mins remaining";
      } else if (bench.status === 'MAINTENANCE') {
        bench.currentUser = null;
        bench.timeRemaining = input.value || "Maintenance check";
      } else {
        bench.currentUser = null;
        bench.timeRemaining = null;
      }
    }

    this.saveBenches();
    document.getElementById('live-board-modal-slot').innerHTML = '';
    this.render();

    if (window.simulator) window.simulator.showToast(`Updated status of ${bench.name} to ${bench.status}`, 'success');
  }

  reportFault(benchId) {
    const bench = this.benches.find(b => b.id === benchId);
    if (!bench) return;

    bench.status = 'MAINTENANCE';
    bench.timeRemaining = 'Fault reported to lab assistant';
    this.saveBenches();

    document.getElementById('live-board-modal-slot').innerHTML = '';
    this.render();

    if (window.simulator) window.simulator.showToast(`Fault logged for ${bench.name}. Technicians alerted.`, 'warning');
  }

  subscribeAlerts(benchName = "any instrument") {
    if (window.simulator) {
      window.simulator.showToast(`🔔 Subscribed! You will be alerted as soon as ${benchName} becomes free.`, 'success');
    }
  }
}

window.liveLabBoard = new LiveLabBoard();
