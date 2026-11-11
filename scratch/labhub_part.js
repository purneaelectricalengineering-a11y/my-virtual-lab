  /* =========================================================================
     PAGE 2: LAB HUB
     ========================================================================= */

  renderLabHubPage(container) {
    const isHindi = this.currentLanguage === 'hi';

    container.innerHTML = `
      <div class="space-y-6 py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold font-heading text-white">
              ${isHindi ? 'प्रयोगशाला हब' : 'Engineering Lab Hub'}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Select experiment to access interactive digital twins and laboratory procedures.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <select class="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-mono">
              <option value="EE">⚡ Electrical Engineering (Active)</option>
              <option value="ECE" disabled>📡 Electronics (ECE - Coming Soon)</option>
              <option value="CSE" disabled>💻 Computer Science (Coming Soon)</option>
              <option value="ME" disabled>⚙️ Mechanical (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="hub-cards-container">
          ${window.EXPERIMENTS_DATA.map(exp => `
            <div class="glass-card rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-mono font-bold text-cyan-400">${exp.category}</span>
                  <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    ${exp.status}
                  </span>
                </div>
                <h3 class="text-base font-bold font-heading text-white group-hover:text-cyan-400 transition mb-1">
                  ${isHindi ? exp.title.hi : exp.title.en}
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed mb-4">${isHindi ? exp.summary.hi : exp.summary.en}</p>
              </div>

              <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button onclick="window.app.navigateTo('experiment', '${exp.id}')" class="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700">
                  ${isHindi ? 'मैनुअल' : 'Manual & Theory'}
                </button>
                <button onclick="window.app.navigateTo('simulator', '${exp.id}')" class="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow transition flex items-center space-x-1">
                  <span>⚡</span>
                  <span>${isHindi ? 'सिमुलेटर' : 'Open Simulator'}</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* =========================================================================
     PAGE 3: EXPERIMENT PAGE
     ========================================================================= */

  renderExperimentPage(container) {
    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];
    const isHindi = this.currentLanguage === 'hi';

    container.innerHTML = `
      <div class="space-y-6 py-6">
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/70">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
                <span>${exp.branch}</span>
                <span>•</span>
                <span class="text-slate-400">${exp.category}</span>
                <span>•</span>
                <span class="text-emerald-400 font-semibold">${exp.status}</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold font-heading text-white">
                ${isHindi ? exp.title.hi : exp.title.en}
              </h1>
              <p class="text-xs text-slate-400 font-mono mt-1">Verified by: ${exp.verifiedBy}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.app.navigateTo('simulator', '${exp.id}')" class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center space-x-1.5 transition">
                <span>⚡</span>
                <span>${isHindi ? 'सिमुलेटर में खोलें' : 'Open Simulator'}</span>
              </button>

              <button onclick="window.pdfReportGenerator.generate('${exp.id}')" class="px-4 py-2.5 bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 rounded-xl text-xs font-medium transition flex items-center space-x-1.5">
                <span>📄</span>
                <span>${isHindi ? 'रिपोर्ट (PDF)' : 'Download Report'}</span>
              </button>

              <button onclick="window.app.markCompleted('${exp.id}')" class="px-3.5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium transition flex items-center space-x-1">
                <span>✓</span>
                <span>${isHindi ? 'पूर्ण' : 'Mark Completed'}</span>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs">
            <button onclick="window.app.setExpTab('aim')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'aim' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-aim">
              🎯 ${isHindi ? 'उद्देश्य (Aim)' : 'Aim'}
            </button>
            <button onclick="window.app.setExpTab('theory')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'theory' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-theory">
              📐 ${isHindi ? 'सिद्धांत (Theory)' : 'Theory'}
            </button>
            <button onclick="window.app.setExpTab('procedure')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'procedure' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-procedure">
              📋 ${isHindi ? 'कार्यविधि (Procedure)' : 'Procedure'}
            </button>
            <button onclick="window.app.setExpTab('instruments')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'instruments' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-instruments">
              🧰 ${isHindi ? 'उपकरण (Instruments)' : 'Instruments'}
            </button>
            <button onclick="window.app.setExpTab('observation')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'observation' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-observation">
              📊 ${isHindi ? 'प्रेक्षण तालिका (Table)' : 'Observation Table'}
            </button>
            <button onclick="window.app.setExpTab('viva')" class="px-3.5 py-2 font-medium rounded-lg transition ${this.activeExpTab === 'viva' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}" id="tab-viva">
              🎓 ${isHindi ? 'वाइवा एवं क्विज़ (Viva)' : 'Viva & Quiz'}
            </button>
          </div>
        </div>

        <div id="exp-tab-content-slot" class="glass-panel rounded-2xl p-6 border border-slate-700/70">
          ${this.getExpTabContent(exp, isHindi)}
        </div>
      </div>
    `;

    if (this.activeExpTab === 'viva') {
      window.vivaQuizEvaluator.render('exp-tab-content-slot', exp.id);
    }
  }

  setExpTab(tabKey) {
    this.activeExpTab = tabKey;
    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];
    const isHindi = this.currentLanguage === 'hi';

    const slot = document.getElementById('exp-tab-content-slot');
    if (slot) {
      if (tabKey === 'viva') {
        window.vivaQuizEvaluator.render('exp-tab-content-slot', exp.id);
      } else {
        slot.innerHTML = this.getExpTabContent(exp, isHindi);
      }
    }

    ['aim', 'theory', 'procedure', 'instruments', 'observation', 'viva'].forEach(t => {
      const btn = document.getElementById(`tab-${t}`);
      if (btn) {
        btn.className = (t === tabKey) 
          ? 'px-3.5 py-2 font-medium rounded-lg transition bg-cyan-600 text-white' 
          : 'px-3.5 py-2 font-medium rounded-lg transition text-slate-400 hover:text-white';
      }
    });
  }

  getExpTabContent(exp, isHindi) {
    switch (this.activeExpTab) {
      case 'aim':
        return `
          <div class="space-y-4">
            <h3 class="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">Aim of Experiment</h3>
            <p class="text-sm text-slate-200 leading-relaxed bg-[#0B1220] p-4 rounded-xl border border-slate-800">
              ${isHindi ? exp.aim.hi : exp.aim.en}
            </p>
          </div>
        `;
      case 'theory':
        return `
          <div class="space-y-4">
            <h3 class="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">Theory & Governing Equations</h3>
            <div class="text-xs font-mono text-slate-300 leading-relaxed bg-[#0B1220] p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
              ${exp.theory.en}
            </div>
          </div>
        `;
      case 'procedure':
        return `
          <div class="space-y-4">
            <h3 class="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">Step-by-Step Procedure</h3>
            <div class="space-y-3">
              ${exp.procedure.map((step) => `
                <div class="p-4 rounded-xl border bg-slate-900/40 border-slate-800">
                  <div class="flex items-center space-x-2 text-xs font-bold text-white mb-1">
                    <span class="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-mono">
                      ${step.step}
                    </span>
                    <span>${step.title}</span>
                  </div>
                  <p class="text-xs text-slate-300 pl-8 leading-relaxed">${step.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'instruments':
        return `
          <div class="space-y-4">
            <h3 class="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">Apparatus Required</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${exp.instruments.map(inst => `
                <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                  <div class="font-bold text-white mb-0.5">${inst.name}</div>
                  <div class="text-slate-400 font-mono">${inst.spec}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'observation':
        return `
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">Observation Table</h3>
              <button onclick="window.app.navigateTo('simulator', '${exp.id}')" class="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg">
                Record Readings in Simulator →
              </button>
            </div>
            <p class="text-xs text-slate-400">Open the simulator to log live readings or add custom trials.</p>
          </div>
        `;
      default:
        return '';
    }
  }

  markCompleted(expId) {
    try {
      const prof = window.studentDashboard.profile;
      if (!prof.completedExpIds.includes(expId)) {
        prof.completedExpIds.push(expId);
        window.studentDashboard.saveProfile();
      }
      if (window.simulator) window.simulator.showToast('Experiment marked as Completed!', 'success');
      if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  }

  /* =========================================================================
     PAGE 4: SIMULATOR (FULL SCREEN 100% PHOTO-ACCURATE CHASSIS)
     ========================================================================= */

  renderSimulatorPage(container) {
    container.innerHTML = `<div id="active-simulator-container" class="w-full h-[calc(100vh-64px)]"></div>`;
    window.simulator.init('active-simulator-container');
    window.simulator.loadExperiment(this.currentExpId);
  }

  /* =========================================================================
     PAGE 5: INSTRUMENT LIBRARY
     ========================================================================= */

  renderInstrumentsPage(container) {
    container.innerHTML = `<div id="active-instruments-container" class="py-6"></div>`;
    window.instrumentLibrary.init('active-instruments-container');
  }

  /* =========================================================================
     PAGE 6: ENGINEERING BLOGS
     ========================================================================= */

  renderBlogsPage(container) {
    if (window.engineeringBlogs) {
      window.engineeringBlogs.render(container);
    }
  }

  /* =========================================================================
     PAGE 7: STUDENT DASHBOARD
     ========================================================================= */

  renderDashboardPage(container) {
    container.innerHTML = `<div id="active-dashboard-container" class="py-6"></div>`;
    window.studentDashboard.init('active-dashboard-container');
  }

  /* =========================================================================
     PAGE 8: CONTRIBUTORS & AWARDS (Featuring Govind Kumar as Owner/Founder)
     ========================================================================= */


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

  /* =========================================================================
     PAGE 9: ADMIN PANEL
     ========================================================================= */

  renderAdminPage(container) {
    container.innerHTML = `<div id="active-admin-container" class="py-6"></div>`;
    window.adminPanel.init('active-admin-container');
  }

  /* =========================================================================
     GLOBAL KEYBOARD SHORTCUTS
     ========================================================================= */

  bindGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.openQuickSearchModal();
      } else if (e.key === 'p' || e.key === 'P') {
        if (window.simulator) window.simulator.togglePower();
      } else if (e.key === 'r' || e.key === 'R') {
        if (window.simulator) window.simulator.recordReading();
      } else if (e.key === 'c' || e.key === 'C') {
        if (window.simulator) window.simulator.checkCircuitConnection();
      } else if (e.key === 'g' || e.key === 'G') {
        if (window.simulator) window.simulator.toggleGraphModal();
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleMute();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (window.simulator) window.simulator.undoWire();
      }
    });
  }
}

window.app = new AppController();
