# scratch/replace_homepage_and_contributors.py
import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# =========================================================================
# NEW OPENING ANIMATION & HELPER METHODS
# =========================================================================
opening_animation_code = '''
  /* =========================================================================
     7-8 SECONDS OPENING CINEMATIC LABORATORY ANIMATION
     ========================================================================= */

  initOpeningAnimation() {
    if (sessionStorage.getItem('mvl_intro_seen') === 'true') return;
    this.playOpeningAnimation();
  }

  playOpeningAnimation() {
    sessionStorage.setItem('mvl_intro_seen', 'true');
    const slot = document.getElementById('opening-animation-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div id="lab-intro-overlay" class="animate-fadeIn">
        <!-- Animated Circuit Grid Background -->
        <div class="intro-grid-layer"></div>
        <div class="intro-scanline"></div>

        <!-- Top Controls: Skip Button -->
        <div class="absolute top-6 right-6 z-20 flex items-center space-x-3">
          <button onclick="window.app.dismissOpeningAnimation()" class="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono font-semibold transition flex items-center space-x-2 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <span>Skip Intro</span>
            <kbd class="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">ESC</kbd>
            <span>⏭️</span>
          </button>
        </div>

        <!-- Main Center Calibration Console -->
        <div class="relative z-10 max-w-xl w-full mx-auto px-6 text-center space-y-6">
          
          <!-- Animated MO-65 Meter SVG Dial -->
          <div class="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg class="w-full h-full drop-shadow-[0_0_25px_rgba(0,242,254,0.35)]" viewBox="0 0 200 200" fill="none">
              <!-- Outer Chassis Bezel -->
              <circle cx="100" cy="100" r="90" fill="#131B2E" stroke="#334155" stroke-width="4" />
              <circle cx="100" cy="100" r="82" fill="#0D1527" stroke="#00F2FE" stroke-width="1.5" stroke-dasharray="6 4" class="spin-orbit-slow" />
              
              <!-- Meter Dial Scale Arc -->
              <path d="M 30 110 A 70 70 0 0 1 170 110" stroke="#475569" stroke-width="2" fill="none" />
              <path d="M 40 105 A 60 60 0 0 1 160 105" stroke="#00F2FE" stroke-width="2.5" fill="none" stroke-linecap="round" />
              
              <!-- Anti-parallax Mirror Strip -->
              <path d="M 50 100 A 50 50 0 0 1 150 100" stroke="#94A3B8" stroke-width="3" stroke-dasharray="2 3" fill="none" opacity="0.4" />

              <!-- Spring-Damped Sweeping Pointer -->
              <g id="intro-needle-group" class="intro-needle-sweep">
                <line x1="100" y1="92" x2="100" y2="40" stroke="#EF4444" stroke-width="3" stroke-linecap="round" filter="drop-shadow(0 0 6px #EF4444)" />
                <circle cx="100" cy="92" r="5" fill="#1E293B" stroke="#CBD5E1" stroke-width="2" />
              </g>

              <!-- Central Node -->
              <circle cx="100" cy="100" r="12" fill="#070B19" stroke="#8B5CF6" stroke-width="2" />
              <circle cx="100" cy="100" r="4" fill="#00F2FE" class="animate-ping" />
            </svg>
          </div>

          <!-- Dynamic Status & Boot Phase Sequence -->
          <div class="space-y-3">
            <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span id="intro-status-dot" class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span id="intro-status-text">INITIALIZING DIGITAL TWIN BENCH...</span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              MY VIRTUAL LAB
            </h1>

            <p class="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
              Photorealistic digital twins of real college electrical engineering laboratory apparatus.
            </p>
          </div>

          <!-- Futuristic 7.5s Progress Bar -->
          <div class="space-y-1.5 max-w-md mx-auto pt-2">
            <div class="w-full h-2 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden p-0.5 shadow-inner">
              <div id="intro-progress-bar" class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all ease-linear" style="width: 0%;"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span id="intro-stage-label">STAGE 1: POWER BUS INITIALIZATION</span>
              <span id="intro-pct-label">0%</span>
            </div>
          </div>

          <!-- Founder & Verification Authority Badge -->
          <div class="pt-2 text-[11px] font-mono text-slate-400">
            Conceived & Developed by <strong class="text-amber-300">Govind Kumar</strong> • Electrical Engineering (2025–2029)
          </div>

        </div>
      </div>
    `;

    const startTime = Date.now();
    const duration = 7500; // 7.5 seconds total

    if (this.introInterval) clearInterval(this.introInterval);

    this.introInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));

      const bar = document.getElementById('intro-progress-bar');
      const pctLabel = document.getElementById('intro-pct-label');
      const stageLabel = document.getElementById('intro-stage-label');
      const statusText = document.getElementById('intro-status-text');

      if (bar) bar.style.width = pct + '%';
      if (pctLabel) pctLabel.innerText = pct + '%';

      if (elapsed < 1800) {
        if (stageLabel) stageLabel.innerText = 'STAGE 1: POWER BUS (12V DC READY)';
        if (statusText) statusText.innerText = '⚡ ENERGIZING 12V DC REGULATED POWER RAILS...';
      } else if (elapsed < 3800) {
        if (stageLabel) stageLabel.innerText = 'STAGE 2: MO-65 ANALOG METER CALIBRATION';
        if (statusText) statusText.innerText = '🧭 CALIBRATING MO-65 ANALOG METERS & SPRING DAMPING...';
      } else if (elapsed < 5500) {
        if (stageLabel) stageLabel.innerText = 'STAGE 3: ZERO-ERROR PHYSICS ENGINE';
        if (statusText) statusText.innerText = '🔬 SOLVING NODAL EQUATIONS (100% ZERO-ERROR COMPLIANT)...';
      } else {
        if (stageLabel) stageLabel.innerText = 'STAGE 4: SYSTEM ONLINE';
        if (statusText) statusText.innerText = '✓ DIGITAL TWIN ONLINE • WELCOME TO MY VIRTUAL LAB';
      }

      if (elapsed >= duration) {
        clearInterval(this.introInterval);
        this.dismissOpeningAnimation();
      }
    }, 50);

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.dismissOpeningAnimation();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);
  }

  dismissOpeningAnimation() {
    if (this.introInterval) clearInterval(this.introInterval);
    const overlay = document.getElementById('lab-intro-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        const slot = document.getElementById('opening-animation-slot');
        if (slot) slot.innerHTML = '';
      }, 700);
    }
  }

  /* =========================================================================
     SANDBOX & OFFICIAL EMAIL UTILITIES
     ========================================================================= */

  copyContactEmail() {
    const email = 'myvirtuallablive@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      if (window.simulator) window.simulator.showToast('✓ Email copied to clipboard: myvirtuallablive@gmail.com', 'success');
    }).catch(() => {
      prompt('Founder official email:', email);
    });
  }

  updateSandboxCurrent(volts, ohms) {
    if (volts !== undefined) this.sandboxVolts = parseFloat(volts);
    if (ohms !== undefined) this.sandboxOhms = parseFloat(ohms);

    // Exact Zero-Error Calculation: I = (V / R) * 1000 mA
    const current_mA = (this.sandboxVolts / this.sandboxOhms) * 1000;
    const power_W = (this.sandboxVolts * current_mA) / 1000;

    // Needle sweep angle on 250mA meter dial (-45 deg to +45 deg)
    const maxScale = 250;
    const clampedI = Math.min(maxScale, current_mA);
    const angle = -45 + (clampedI / maxScale) * 90;

    const needle = document.getElementById('sandbox-needle');
    if (needle) {
      needle.setAttribute('transform', `rotate(${angle.toFixed(1)} 80 75)`);
    }

    const vText = document.getElementById('sandbox-v-val');
    if (vText) vText.innerText = this.sandboxVolts.toFixed(1) + ' V';

    const rText = document.getElementById('sandbox-r-val');
    if (rText) rText.innerText = this.sandboxOhms + ' Ω';

    const iText = document.getElementById('sandbox-i-val');
    if (iText) iText.innerText = current_mA.toFixed(1) + ' mA';

    const pText = document.getElementById('sandbox-p-val');
    if (pText) pText.innerText = power_W.toFixed(2) + ' W';

    const led = document.getElementById('sandbox-pilot-led');
    if (led) {
      const brightness = Math.min(1, current_mA / 120);
      led.style.filter = `drop-shadow(0 0 ${14 * brightness}px #00F2FE)`;
      led.style.opacity = Math.max(0.25, brightness);
    }
  }
'''

# =========================================================================
# NEW CREATIVE, RICH, AESTHETIC HOME PAGE (NO DIRECT EXPERIMENT BOARD LINKS)
# REPLACED FEEDBACK / ERROR / REQUEST WITH myvirtuallablive@gmail.com
# =========================================================================
new_homepage_code = '''
  renderHomePage(container) {
    const isHindi = this.currentLanguage === 'hi';
    const contributors = window.adminPanel ? window.adminPanel.getContributors() : [];
    const govindPhoto = localStorage.getItem('mvl_photo_govind') || '';

    // Initial sandbox calculations
    const initI = ((this.sandboxVolts / this.sandboxOhms) * 1000).toFixed(1);
    const initP = ((this.sandboxVolts * (this.sandboxVolts / this.sandboxOhms))).toFixed(2);
    const initAngle = (-45 + (Math.min(250, (this.sandboxVolts / this.sandboxOhms) * 1000) / 250) * 90).toFixed(1);

    container.innerHTML = `
      <div class="space-y-12 py-6">
        
        <!-- ===================================================================
             1. ULTRA-MODERN HERO SECTION
             =================================================================== -->
        <div class="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-10 border border-slate-700/80 shadow-2xl bg-gradient-to-b from-slate-900/90 via-[#0a1124]/90 to-slate-900/90">
          <div class="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <!-- Left Hero Content -->
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>🇮🇳 MADE IN INDIA • DIGITAL TWIN LABORATORY</span>
              </div>

              <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                ${isHindi ? 'असली लैब उपकरणों का डिजिटल अनुभव' : 'Real Laboratory Instruments, Brought to Your Screen'}
              </h1>

              <p class="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-body">
                ${isHindi 
                  ? 'असली लैब मशीनों की हूबहू प्रतिकृति पर अभ्यास करें। टर्मिनलों के बीच तार जोड़ें, नॉब घुमाएं, मीटर पढ़ें और बिना किसी खतरे के सर्किट थ्योरम का प्रत्यक्ष अनुभव प्राप्त करें।'
                  : 'Experience interactive digital replicas of real college laboratory apparatus. Drag flexible patchcords between terminals, turn rotary potentiometers, read spring-inertia analog meters, and verify circuit theorems before touching high-risk physical hardware.'}
              </p>

              <!-- Main Hero Actions (Clean & Focused) -->
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <button onclick="window.app.navigateTo('lab-hub')" class="px-5 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-heading font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.35)] transition transform hover:-translate-y-0.5 flex items-center space-x-2">
                  <span>🔬</span>
                  <span>${isHindi ? 'प्रयोगशाला हब खोलें' : 'Start an Experiment'}</span>
                  <span>→</span>
                </button>

                <button onclick="document.getElementById('curriculum-roadmap-section')?.scrollIntoView({behavior: 'smooth'})" class="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-heading font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-2">
                  <span>📋</span>
                  <span>${isHindi ? 'पाठ्यक्रम रोडमैप' : 'Curriculum Roadmap'}</span>
                </button>

                <button onclick="window.app.navigateTo('blogs')" class="px-3.5 py-3 text-xs text-cyan-300 hover:text-cyan-200 bg-slate-900/80 rounded-xl border border-cyan-500/30 transition">
                  ${isHindi ? 'इंजीनियरिंग गाइड्स' : 'Lab Articles & Guides'} →
                </button>
              </div>

              <!-- Academic Caution Note -->
              <div class="p-2.5 bg-slate-900/80 rounded-xl border border-amber-500/30 text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                <span class="text-amber-400 text-sm">⚠️</span>
                <span><strong>Engineering Safety Note:</strong> Digital twins simulate idealized physical equations. Physical college measurements may naturally vary slightly due to wire resistance and component tolerances.</span>
              </div>
            </div>

            <!-- Right Hero Visual: Interactive Virtual Multimeter Sandbox Widget -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="relative w-full max-w-sm rounded-3xl p-5 glass-panel border border-cyan-500/40 shadow-[0_0_35px_rgba(0,242,254,0.15)] flex flex-col items-center bg-slate-950/80">
                
                <div class="flex items-center justify-between w-full mb-2 text-[10px] font-mono border-b border-slate-700/80 pb-2">
                  <span class="text-cyan-400 font-bold flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>LIVE MULTIMETER SANDBOX</span>
                  </span>
                  <span class="text-emerald-400 font-bold">100% ZERO-ERROR</span>
                </div>

                <!-- Interactive SVG MO-65 Milliammeter Dial -->
                <div class="relative w-full h-40 flex items-center justify-center">
                  <svg class="w-full h-full drop-shadow-lg" viewBox="0 0 160 110" fill="none">
                    <!-- Gauge Outer Frame -->
                    <rect x="5" y="5" width="150" height="100" rx="12" fill="#0F172A" stroke="#334155" stroke-width="2" />
                    <circle cx="80" cy="75" r="48" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
                    
                    <!-- Scale Markings -->
                    <path d="M 42 75 A 38 38 0 0 1 118 75" stroke="#1E293B" stroke-width="1.5" fill="none" />
                    <text x="42" y="85" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">0</text>
                    <text x="80" y="44" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">125</text>
                    <text x="118" y="85" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">250</text>
                    
                    <text x="80" y="60" text-anchor="middle" font-size="9" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#0F172A">mA DC</text>
                    
                    <!-- Mirror Arc -->
                    <path d="M 48 75 A 32 32 0 0 1 112 75" stroke="#94A3B8" stroke-width="2" stroke-dasharray="2 2" fill="none" opacity="0.6" />

                    <!-- Dynamic Needle -->
                    <g id="sandbox-needle" class="sandbox-meter-needle" transform="rotate(${initAngle} 80 75)">
                      <line x1="80" y1="75" x2="80" y2="40" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
                      <circle cx="80" cy="75" r="3.5" fill="#1E293B" stroke="#DC2626" stroke-width="1" />
                    </g>

                    <!-- Pilot LED in corner -->
                    <circle id="sandbox-pilot-led" cx="140" cy="20" r="4" fill="#00F2FE" style="filter: drop-shadow(0 0 8px #00F2FE);" />
                  </svg>
                </div>

                <!-- Live Interactive Sliders -->
                <div class="w-full space-y-2.5 pt-2 text-xs">
                  <div>
                    <div class="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                      <span>Voltage (V):</span>
                      <span id="sandbox-v-val" class="text-cyan-400 font-bold">${this.sandboxVolts.toFixed(1)} V</span>
                    </div>
                    <input type="range" min="0" max="15" step="0.5" value="${this.sandboxVolts}" class="w-full accent-cyan-400 cursor-pointer" oninput="window.app.updateSandboxCurrent(this.value, undefined)">
                  </div>

                  <div>
                    <div class="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                      <span>Resistance (R):</span>
                      <span id="sandbox-r-val" class="text-amber-400 font-bold">${this.sandboxOhms} Ω</span>
                    </div>
                    <input type="range" min="20" max="500" step="10" value="${this.sandboxOhms}" class="w-full accent-amber-400 cursor-pointer" oninput="window.app.updateSandboxCurrent(undefined, this.value)">
                  </div>
                </div>

                <!-- Instant Calculation Readout -->
                <div class="grid grid-cols-2 gap-2 w-full mt-3 text-[10px] font-mono">
                  <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                    <span class="text-slate-400 block text-[9px]">CALCULATED CURRENT</span>
                    <span id="sandbox-i-val" class="text-emerald-300 font-bold text-xs">${initI} mA</span>
                  </div>
                  <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                    <span class="text-slate-400 block text-[9px]">POWER DISSIPATION</span>
                    <span id="sandbox-p-val" class="text-violet-300 font-bold text-xs">${initP} W</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- ===================================================================
             2. FOUR CORE PILLARS OF THE DIGITAL TWIN LABORATORY
             =================================================================== -->
        <div class="space-y-4">
          <div class="text-center max-w-2xl mx-auto space-y-1">
            <h2 class="text-xl md:text-2xl font-bold font-heading text-white">
              Why Engineers Practice on My Virtual Lab
            </h2>
            <p class="text-xs text-slate-400">
              Built from physical laboratory instruments to bridge theoretical classroom concepts with real hardware confidence.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="glass-card rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between bg-slate-900/40">
              <div class="space-y-2">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-400">
                  🧭
                </div>
                <h3 class="text-sm font-bold font-heading text-white">1:1 Physical Twin</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Exact digital replica of college apparatus: MO-65 analog meters, anti-parallax mirror strips, 4mm banana sockets, and rotary rheostats.
                </p>
              </div>
              <div class="text-[10px] font-mono text-cyan-400 pt-3 border-t border-slate-800">
                Photorealistic Precision
              </div>
            </div>

            <div class="glass-card rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between bg-slate-900/40">
              <div class="space-y-2">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
                  ⚙️
                </div>
                <h3 class="text-sm font-bold font-heading text-white">Zero-Error Physics</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Continuous nodal equations derived from Kirchhoff\\'s laws and network theorems calculate exact theoretical values with zero math errors.
                </p>
              </div>
              <div class="text-[10px] font-mono text-emerald-400 pt-3 border-t border-slate-800">
                100% Nodal Accuracy
              </div>
            </div>

            <div class="glass-card rounded-2xl p-5 border border-amber-500/30 flex flex-col justify-between bg-slate-900/40">
              <div class="space-y-2">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
                  🛡️
                </div>
                <h3 class="text-sm font-bold font-heading text-white">Safe Error Learning</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Make wiring mistakes safely. Learn how short circuits, blown fuses, and meter over-ranges occur without burning costly laboratory instruments.
                </p>
              </div>
              <div class="text-[10px] font-mono text-amber-400 pt-3 border-t border-slate-800">
                Risk-Free Experimentation
              </div>
            </div>

            <div class="glass-card rounded-2xl p-5 border border-violet-500/30 flex flex-col justify-between bg-slate-900/40">
              <div class="space-y-2">
                <div class="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-xl text-violet-400">
                  📑
                </div>
                <h3 class="text-sm font-bold font-heading text-white">Instant Lab Reports</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Record readings with one click, generate mathematical graphs, and download university-standard PDF observation sheets with viva questions.
                </p>
              </div>
              <div class="text-[10px] font-mono text-violet-400 pt-3 border-t border-slate-800">
                Printable PDF Export
              </div>
            </div>

          </div>
        </div>

        <!-- ===================================================================
             3. CURRICULUM ROADMAP SECTION (ACADEMIC PROGRESSION)
             =================================================================== -->
        <div id="curriculum-roadmap-section" class="space-y-5 pt-2">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-xl font-bold font-heading text-white flex items-center space-x-2">
                <span>📚</span>
                <span>Curriculum Roadmap (Electrical Engineering)</span>
              </h2>
              <p class="text-xs text-slate-400">
                Course Code 103301P: Electrical Circuit Analysis Laboratory & Multi-Branch Expansion
              </p>
            </div>
            <button onclick="window.app.navigateTo('lab-hub')" class="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold flex items-center space-x-1">
              <span>View All Experiments</span>
              <span>→</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <!-- Sem III Module -->
            <div class="glass-panel rounded-2xl p-5 border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    SEMESTER III
                  </span>
                  <span class="text-emerald-400 font-mono text-[11px]">✓ 100% LIVE</span>
                </div>
                <h3 class="text-base font-bold font-heading text-white mb-2">Circuit Analysis Laboratory</h3>
                <ul class="text-xs text-slate-300 space-y-2 font-body">
                  <li class="flex items-center space-x-2">
                    <span class="text-cyan-400">⚡</span>
                    <span>Verification of Superposition Theorem</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-cyan-400">⚡</span>
                    <span>Verification of Thevenin & Norton Theorem</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-cyan-400">⚡</span>
                    <span>Maximum Power Transfer Theorem (MPTT)</span>
                  </li>
                </ul>
              </div>
              <div class="pt-4 mt-4 border-t border-slate-800">
                <button onclick="window.app.navigateTo('lab-hub')" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold transition border border-slate-700">
                  Open Semester Experiments →
                </button>
              </div>
            </div>

            <!-- Sem IV Module -->
            <div class="glass-panel rounded-2xl p-5 border border-violet-500/40 bg-gradient-to-b from-violet-950/20 to-slate-900/60 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 font-bold border border-violet-500/40">
                    SEMESTER IV
                  </span>
                  <span class="text-emerald-400 font-mono text-[11px]">✓ 100% LIVE</span>
                </div>
                <h3 class="text-base font-bold font-heading text-white mb-2">Network Parameters & Resonance</h3>
                <ul class="text-xs text-slate-300 space-y-2 font-body">
                  <li class="flex items-center space-x-2">
                    <span class="text-violet-400">📡</span>
                    <span>Two-Port Network (Z & H Parameters)</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-violet-400">📡</span>
                    <span>Series & Parallel R-L-C Resonance</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-slate-400">⏳</span>
                    <span class="text-slate-400">Driving Point & Transfer Functions</span>
                  </li>
                </ul>
              </div>
              <div class="pt-4 mt-4 border-t border-slate-800">
                <button onclick="window.app.navigateTo('lab-hub')" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-violet-300 rounded-xl text-xs font-semibold transition border border-slate-700">
                  Open Semester Experiments →
                </button>
              </div>
            </div>

            <!-- Upcoming Module -->
            <div class="glass-panel rounded-2xl p-5 border border-slate-700 bg-slate-900/40 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    UPCOMING HORIZONS
                  </span>
                  <span class="text-amber-400 font-mono text-[11px]">IN PIPELINE</span>
                </div>
                <h3 class="text-base font-bold font-heading text-white mb-2">Machines & Electronics Expansion</h3>
                <ul class="text-xs text-slate-400 space-y-2 font-body">
                  <li class="flex items-center space-x-2">
                    <span>🔌</span>
                    <span>Electrical Machines (Transformers & Motors)</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span>📻</span>
                    <span>Electronics & Communication (ECE Op-Amps)</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span>💻</span>
                    <span>Computer Organization & Microprocessors</span>
                  </li>
                </ul>
              </div>
              <div class="pt-4 mt-4 border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
                Designed for Engineering Students
              </div>
            </div>

          </div>
        </div>

        <!-- ===================================================================
             4. FOUNDER LEADERSHIP & VERIFICATION TEAM SPOTLIGHT
             =================================================================== -->
        <div class="space-y-6 pt-2">
          
          <!-- Founder Executive Card (Govind Kumar) -->
          <div class="founder-card rounded-3xl p-6 md:p-8 border border-amber-500/50 relative overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
            <div class="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              
              <!-- Founder Photo with Upload Persistence -->
              <div class="md:col-span-4 flex flex-col items-center">
                <div class="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-slate-900 flex items-center justify-center">
                  ${govindPhoto ? `<img src="${govindPhoto}" class="w-full h-full object-cover">` : `
                    <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-700 via-blue-800 to-amber-700 text-white">
                      <span class="text-4xl">👑</span>
                    </div>
                  `}
                </div>
                <div class="mt-2 text-center">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold inline-block">
                    PROJECT FOUNDER & OWNER
                  </span>
                </div>
              </div>

              <!-- Founder Description & Credentials -->
              <div class="md:col-span-8 space-y-2.5">
                <h3 class="text-2xl font-extrabold font-heading text-white">
                  Govind Kumar
                </h3>
                <p class="text-xs text-amber-300 font-mono">
                  Electrical Engineering Branch • Batch 2025–2029
                </p>
                <p class="text-xs text-slate-300 leading-relaxed font-body">
                  Founder, Creator & Systems Architect of <strong>My Virtual Lab</strong>. Conceived and engineered the complete digital twin framework, photorealistic apparatus chassis matching actual laboratory hardware, Bezier flexible patchcord mechanics, and spring-inertia analog meter dynamics so every student can gain safe, high-confidence pre-lab practice.
                </p>

                <div class="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="font-mono text-emerald-300 text-[11px]">Sole Platform Architect & Administrator</span>
                  </div>
                  <button onclick="window.app.navigateTo('admin')" class="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-mono text-xs transition">
                    Open Admin Control Suite ⚙️
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Dynamic Verification Contributors (Added from Admin Panel) -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 class="text-base font-bold font-heading text-white flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Technical Verification Contributors</span>
                </h3>
                <p class="text-xs text-slate-400">
                  Authorized technical contributors who assist Founder Govind Kumar in verifying circuit formulas, node accuracy, and observation sheets.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              ${contributors.map(c => `
                <div class="glass-card rounded-2xl p-5 border border-slate-700/80 bg-slate-900/40 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center space-x-3.5 mb-3">
                      <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        ${c.photo ? `<img src="${c.photo}" class="w-full h-full object-cover">` : `<span class="text-2xl">👩‍🔬</span>`}
                      </div>
                      <div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold inline-block mb-1">
                          ${c.role || 'Technical Verifier'}
                        </span>
                        <h4 class="text-sm font-bold font-heading text-white">${c.name}</h4>
                        <p class="text-[11px] text-cyan-400 font-mono">${c.branch} • ${c.batch}</p>
                      </div>
                    </div>

                    <p class="text-xs text-slate-300 leading-relaxed mb-3">
                      ${c.description}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Verified: ${c.verifiedScope || 'Circuits'}</span>
                    <span class="text-emerald-400">✓ Verified Scope</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- ===================================================================
             5. REPLACED SECTION: CENTRALIZED INQUIRY & EMAIL COMMUNICATION HUB
             (Replaces Feedback, Error Report & Request forms with myvirtuallablive@gmail.com)
             =================================================================== -->
        <div id="contact-founder-section" class="glass-panel rounded-3xl p-6 md:p-8 border border-cyan-500/40 relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 shadow-2xl">
          <div class="max-w-3xl mx-auto text-center space-y-5">
            
            <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <span>✉️</span>
              <span>OFFICIAL FEEDBACK, ERROR REPORTING & EXPERIMENT INQUIRIES</span>
            </div>

            <h2 class="text-2xl md:text-3xl font-extrabold font-heading text-white">
              Connect Directly with the Founder
            </h2>

            <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-body max-w-xl mx-auto">
              Have feedback on the simulator, noticed a calculation discrepancy, or want your college lab experiment added to the digital twin library? Email Founder Govind Kumar directly:
            </p>

            <!-- Central Glowing Email Card -->
            <div class="p-4 md:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,242,254,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
              <div class="text-left">
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Official Contact Email</span>
                <span class="text-base sm:text-lg font-mono font-bold text-cyan-300 select-all">myvirtuallablive@gmail.com</span>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <button onclick="window.app.copyContactEmail()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-mono border border-slate-700 transition flex items-center space-x-1.5 shadow">
                  <span>📋</span>
                  <span>Copy</span>
                </button>
                <a href="mailto:myvirtuallablive@gmail.com?subject=My%20Virtual%20Lab%20Inquiry" class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition flex items-center space-x-1.5">
                  <span>✉️</span>
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            <!-- Inquiry Prompt Pills -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left max-w-2xl mx-auto text-xs">
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div class="font-bold text-cyan-300 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Request Experiment</span>
                </div>
                <p class="text-[11px] text-slate-400">Share your syllabus apparatus and circuit schematic for digital twin fabrication.</p>
              </div>

              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div class="font-bold text-rose-300 flex items-center space-x-1">
                  <span>🐞</span>
                  <span>Report Observed Bug</span>
                </div>
                <p class="text-[11px] text-slate-400">Found any calculation or wiring issue? Email the specific reading for instant fix.</p>
              </div>

              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div class="font-bold text-amber-300 flex items-center space-x-1">
                  <span>⭐</span>
                  <span>Feedback & Suggestions</span>
                </div>
                <p class="text-[11px] text-slate-400">Share your practical lab experience and suggestions to make learning easier.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }
'''

# =========================================================================
# NEW DYNAMIC CONTRIBUTORS PAGE (ADMIN CONTROLLED)
# =========================================================================
new_contributors_code = '''
  renderContributorsPage(container) {
    const isHindi = this.currentLanguage === 'hi';
    const govindPhoto = localStorage.getItem('mvl_photo_govind') || '';
    const contributors = window.adminPanel ? window.adminPanel.getContributors() : [];

    container.innerHTML = `
      <div class="space-y-10 py-6">
        
        <!-- Header Banner -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/70">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
                <span>🇮🇳 MADE IN INDIA</span>
                <span>•</span>
                <span>CORE ENGINEERING ARCHITECTURE</span>
              </div>
              <h2 class="text-2xl font-bold font-heading text-white">
                ${isHindi ? 'संस्थापक एवं तकनीकी सत्यापन दल' : 'Founder & Technical Verification Team'}
              </h2>
              <p class="text-xs text-slate-400 mt-1 max-w-2xl font-body">
                The architecture, photorealistic digital twin schematics, mathematical circuit solving, and multi-branch curriculum verification.
              </p>
            </div>
            <button onclick="window.app.navigateTo('admin')" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5">
              <span>👑</span>
              <span>Manage in Admin Suite</span>
            </button>
          </div>
        </div>

        <!-- 1. DEDICATED FOUNDER & OWNER SHOWCASE (GOVIND KUMAR) -->
        <div class="founder-card rounded-3xl p-8 border border-amber-500/50 relative overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            <!-- Founder Photo -->
            <div class="md:col-span-4 flex flex-col items-center">
              <div class="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-slate-900 flex items-center justify-center">
                ${govindPhoto ? `<img src="${govindPhoto}" class="w-full h-full object-cover">` : `
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-700 via-blue-800 to-amber-700 text-white">
                    <span class="text-5xl">👑</span>
                  </div>
                `}
              </div>
              <span class="text-[10px] font-mono text-amber-300 mt-2 font-semibold">Project Owner & Founder</span>
            </div>

            <!-- Founder Credentials & Vision -->
            <div class="md:col-span-8 space-y-3">
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold">
                <span>👑</span>
                <span>PROJECT OWNER & FOUNDER • CHIEF ARCHITECT</span>
              </div>

              <h3 class="text-2xl md:text-3xl font-extrabold font-heading text-white">
                Govind Kumar
              </h3>
              <p class="text-xs text-cyan-300 font-mono">
                Electrical Engineering Branch • Batch 2025–2029
              </p>

              <p class="text-xs md:text-sm text-slate-300 leading-relaxed pt-1 font-body">
                Founder, Creator & Systems Architect of <strong>My Virtual Lab</strong>. Conceived and engineered the complete digital twin framework, photorealistic apparatus chassis matching actual laboratory hardware, Bezier flexible patchcord mechanics, and spring-inertia analog meter dynamics. Created this platform so every student can gain safe, high-confidence pre-lab practice without the fear of damaging real equipment.
              </p>

              <div class="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="font-mono text-emerald-300 text-[11px]">Sole System Owner & Platform Administrator</span>
                </div>
                <button onclick="window.app.downloadCertificate('Govind Kumar', 'Project Founder & Chief Systems Architect')" class="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-semibold transition">
                  Download Founder Credential 📜
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- 2. TECHNICAL VERIFICATION CONTRIBUTORS (DYNAMICALLY MANAGED VIA ADMIN PANEL) -->
        <div class="space-y-4">
          <div class="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-lg font-bold font-heading text-white flex items-center space-x-2">
                <span>🛡️</span>
                <span>Authorized Technical Verifiers & Contributors</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Technical contributors who assist Founder Govind Kumar in checking correctness of apparatus, circuits, and calculations. Managed dynamically through the Admin Panel.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${contributors.map(c => `
              <div class="glass-card rounded-2xl p-6 border border-slate-700/80 bg-slate-900/40 flex flex-col justify-between relative">
                <div>
                  <div class="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-violet-500/60 shadow-lg bg-slate-800 flex items-center justify-center">
                    ${c.photo ? `<img src="${c.photo}" class="w-full h-full object-cover">` : `
                      <div class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-tr from-violet-600 to-purple-800 text-white">
                        👩‍🔬
                      </div>
                    `}
                  </div>

                  <div class="text-center mb-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold inline-block mb-1">
                      ${c.role || 'TECHNICAL VERIFIER'}
                    </span>
                    <h3 class="text-lg font-bold font-heading text-white">${c.name}</h3>
                    <p class="text-xs text-violet-400 font-mono">${c.branch} • ${c.batch}</p>
                  </div>

                  <p class="text-xs text-slate-300 leading-relaxed text-center mb-4">
                    ${c.description}
                  </p>

                  <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                    <div><strong>Verified Scope:</strong> ${c.verifiedScope || 'Circuits & Theorems'}</div>
                    <div><strong>Status:</strong> ${c.status || 'Active Verifier'}</div>
                  </div>
                </div>

                <div class="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-mono">${c.branch}</span>
                  <button onclick="window.app.downloadCertificate('${c.name}', '${c.role || 'Technical Verifier'}')" class="font-semibold text-cyan-400 hover:text-cyan-300">
                    View Certificate →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }
'''

# 1. Replace the old renderHomePage method block
idx_home_start = code.find('  renderHomePage(container) {')
idx_home_end = code.find('  /* =========================================================================\n     PAGE 2: LAB HUB\n     ========================================================================= */')

if idx_home_start != -1 and idx_home_end != -1:
    code = code[:idx_home_start] + opening_animation_code + new_homepage_code + '\n' + code[idx_home_end:]
    print("Replaced renderHomePage and added opening animation & sandbox methods successfully!")
else:
    print(f"Indices for renderHomePage replacement failed: {idx_home_start}, {idx_home_end}")

# 2. Replace the old renderContributorsPage method block
idx_contrib_start = code.find('  renderContributorsPage(container) {')
idx_contrib_end = code.find('  /* =========================================================================\n     PAGE 9: ADMIN PANEL\n     ========================================================================= */')

if idx_contrib_start != -1 and idx_contrib_end != -1:
    code = code[:idx_contrib_start] + new_contributors_code + '\n' + code[idx_contrib_end:]
    print("Replaced renderContributorsPage successfully!")
else:
    print(f"Indices for renderContributorsPage replacement failed: {idx_contrib_start}, {idx_contrib_end}")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved updated js/app.js successfully!")
