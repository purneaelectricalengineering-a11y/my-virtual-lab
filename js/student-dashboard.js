/**
 * MY VIRTUAL LAB - Student Dashboard
 * Student profile management, experiment history, saved observations, report downloads, and progress tracking.
 */

class StudentDashboard {
  constructor() {
    this.container = null;
    this.profile = this.loadProfile();
  }

  loadProfile() {
    const defaultProfile = {
      name: "Govind Kumar",
      rollNo: "EE-2025-01",
      branch: "Electrical Engineering",
      batch: "Batch 2025–2029",
      avatarEmoji: "👨‍💻",
      completedExpIds: ["superposition-theorem", "max-power-transfer-theorem"],
      vivaAverageScore: 94
    };

    try {
      const stored = localStorage.getItem('mvl_student_profile');
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  }

  saveProfile() {
    try {
      localStorage.setItem('mvl_student_profile', JSON.stringify(this.profile));
    } catch (e) {}
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  render() {
    if (!this.container) return;

    const isHindi = document.documentElement.getAttribute('lang') === 'hi';
    const totalExpCount = window.EXPERIMENTS_DATA.length;
    const completedCount = this.profile.completedExpIds ? this.profile.completedExpIds.length : 2;
    const progressPercent = Math.round((completedCount / totalExpCount) * 100);

    let savedReadingsMap = {};
    try {
      savedReadingsMap = JSON.parse(localStorage.getItem('mvl_student_readings') || '{}');
    } catch (e) {}

    this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Student Profile Header Card -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/70 relative overflow-hidden">
          <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
                ${this.profile.avatarEmoji}
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h2 class="text-xl font-bold font-heading text-white">${this.profile.name}</h2>
                  <span class="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">${this.profile.batch}</span>
                </div>
                <p class="text-xs text-slate-400 font-mono mt-0.5">
                  Roll / ID: ${this.profile.rollNo} • ${this.profile.branch}
                </p>
                <p class="text-xs text-slate-300 font-mono mt-0.5">
                  🇮🇳 Made in India • Virtual Lab Practitioner
                </p>
              </div>
            </div>

            <!-- Profile Actions -->
            <div class="flex items-center space-x-2">
              <button onclick="window.studentDashboard.openEditProfileModal()" class="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center space-x-1.5">
                <span>✏️</span>
                <span>${isHindi ? 'प्रोफ़ाइल बदलें' : 'Edit Profile'}</span>
              </button>
              <button onclick="window.studentDashboard.shareProgress()" class="px-3.5 py-2 text-xs font-medium bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 rounded-xl transition flex items-center space-x-1.5">
                <span>🔗</span>
                <span>${isHindi ? 'साझा करें' : 'Share Progress'}</span>
              </button>
            </div>
          </div>

          <!-- Academic Progress Statistics -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div>
              <span class="text-xs text-slate-400 block">${isHindi ? 'प्रयोग पूर्णता' : 'Experiments Completed'}</span>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xl font-bold font-mono text-cyan-400">${progressPercent}%</span>
                <span class="text-xs text-slate-500 font-mono">(${completedCount}/${totalExpCount})</span>
              </div>
            </div>

            <div>
              <span class="text-xs text-slate-400 block">${isHindi ? 'वाइवा प्रवीणता' : 'Viva Proficiency'}</span>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xl font-bold font-mono text-emerald-400">${this.profile.vivaAverageScore}%</span>
                <span class="text-xs text-emerald-500">Mastered</span>
              </div>
            </div>

            <div>
              <span class="text-xs text-slate-400 block">${isHindi ? 'सक्रिय शाखा' : 'Active Engineering Branch'}</span>
              <span class="text-xs font-mono text-white mt-1 block">${this.profile.branch}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div class="bg-gradient-to-r from-cyan-400 to-violet-500 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Continue Last Experiment Banner -->
        <div class="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-slate-900/40 to-slate-900 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-3xl">🚀</span>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                ${isHindi ? 'अंतिम अभ्यास जारी रखें' : 'Continue Practicing'}
              </span>
              <h3 class="text-base font-bold font-heading text-white">
                Verification of Superposition Theorem
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Electrical Circuit Analysis</p>
            </div>
          </div>
          <button onclick="window.app.navigateTo('simulator', 'superposition-theorem')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow transition">
            ${isHindi ? 'सिमुलेटर खोलें' : 'Open Simulator'} →
          </button>
        </div>

        <!-- Saved Observations & Reports Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <span>📋</span>
              <span>${isHindi ? 'सहेजे गए लैब प्रेक्षण और रिपोर्ट' : 'Saved Lab Observations & Custom Tables'}</span>
            </h3>
            <button onclick="window.studentDashboard.confirmDeleteData()" class="text-xs text-rose-400 hover:text-rose-300 transition">
              🗑️ ${isHindi ? 'डेटा रीसेट करें' : 'Reset My Data'}
            </button>
          </div>

          <div class="space-y-3">
            ${window.EXPERIMENTS_DATA.map(exp => this.renderSavedExpRow(exp, savedReadingsMap[exp.id] || [], isHindi)).join('')}
          </div>
        </div>

      </div>

      <div id="dashboard-modal-slot"></div>
    `;
  }

  renderSavedExpRow(exp, readings, isHindi) {
    const isCompleted = this.profile.completedExpIds && this.profile.completedExpIds.includes(exp.id);
    const hasReadings = readings && readings.length > 0;

    return `
      <div class="glass-card rounded-xl p-4 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'} flex items-center justify-center font-bold text-sm">
            ${isCompleted ? '✓' : '○'}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">${exp.title.en}</h4>
            <p class="text-xs text-slate-400 font-mono">${exp.branch}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono text-slate-400 mr-2">
            ${hasReadings ? `${readings.length} trials recorded` : 'Default readings'}
          </span>
          <button onclick="window.app.navigateTo('experiment', '${exp.id}')" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition">
            ${isHindi ? 'मैनुअल' : 'Manual'}
          </button>
          <button onclick="window.pdfReportGenerator.generate('${exp.id}', ${JSON.stringify(readings).replace(/"/g, '&quot;')})" class="px-3 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg shadow transition flex items-center space-x-1">
            <span>📄</span>
            <span>PDF</span>
          </button>
        </div>
      </div>
    `;
  }

  openEditProfileModal() {
    const slot = document.getElementById('dashboard-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white">Edit Student Credentials</h3>
            <button onclick="document.getElementById('dashboard-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Student Full Name:</label>
              <input type="text" id="prof-name" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2" value="${this.profile.name}">
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Roll / ID Number:</label>
              <input type="text" id="prof-roll" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono" value="${this.profile.rollNo}">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-slate-400 mb-1">Branch:</label>
                <input type="text" id="prof-branch" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2" value="${this.profile.branch}">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Batch:</label>
                <input type="text" id="prof-batch" class="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2" value="${this.profile.batch}">
              </div>
            </div>

            <div class="pt-3 flex justify-end space-x-2">
              <button onclick="document.getElementById('dashboard-modal-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
              <button onclick="window.studentDashboard.saveProfileForm()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  saveProfileForm() {
    this.profile.name = document.getElementById('prof-name').value || this.profile.name;
    this.profile.rollNo = document.getElementById('prof-roll').value || this.profile.rollNo;
    this.profile.branch = document.getElementById('prof-branch').value || this.profile.branch;
    this.profile.batch = document.getElementById('prof-batch').value || this.profile.batch;

    this.saveProfile();
    document.getElementById('dashboard-modal-slot').innerHTML = '';
    this.render();

    if (window.simulator) window.simulator.showToast('Profile updated!', 'success');
  }

  shareProgress() {
    if (navigator.share) {
      navigator.share({
        title: 'My Virtual Lab - Engineering Portfolio',
        text: `Practicing interactive circuit experiments on My Virtual Lab!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      if (window.simulator) window.simulator.showToast('Progress link copied to clipboard!', 'info');
    }
  }

  confirmDeleteData() {
    if (confirm('Are you sure you want to clear your saved observations and reset your dashboard?')) {
      localStorage.removeItem('mvl_student_readings');
      if (window.simulator) window.simulator.showToast('Observation data reset', 'info');
      this.render();
    }
  }
}

window.studentDashboard = new StudentDashboard();
