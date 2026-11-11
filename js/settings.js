/**
 * MY VIRTUAL LAB - User & Laboratory Settings Manager
 * Configures wire gauge appearance, needle dynamics, audio volume, auto-save, and language preferences.
 */

class LabSettingsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const defaultSettings = {
      wireThickness: 5, // 3, 5, 7
      needleSpringBounce: true,
      soundMute: false,
      enableHum: true,
      autoSaveReadings: true,
      theme: 'dark'
    };
    try {
      const stored = localStorage.getItem('mvl_user_settings');
      return stored ? Object.assign(defaultSettings, JSON.parse(stored)) : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('mvl_user_settings', JSON.stringify(this.settings));
    } catch (e) {}
  }

  openSettingsModal() {
    let slot = document.getElementById('global-settings-modal-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'global-settings-modal-slot';
      document.body.appendChild(slot);
    }

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>⚙️</span>
              <span>Laboratory & Simulator Settings</span>
            </h3>
            <button onclick="document.getElementById('global-settings-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <!-- Wire Gauge / Thickness -->
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Patchcord Wire Thickness:</label>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="window.labSettings.setWireThickness(3)" class="py-2 rounded-lg border text-center transition ${this.settings.wireThickness === 3 ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
                  Thin (3mm)
                </button>
                <button onclick="window.labSettings.setWireThickness(5)" class="py-2 rounded-lg border text-center transition ${this.settings.wireThickness === 5 ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
                  Standard (5mm)
                </button>
                <button onclick="window.labSettings.setWireThickness(7)" class="py-2 rounded-lg border text-center transition ${this.settings.wireThickness === 7 ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300'}">
                  Heavy-Duty (7mm)
                </button>
              </div>
            </div>

            <!-- Needle Dynamics -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span class="font-semibold text-white block">Mechanical Needle Spring Inertia</span>
                <span class="text-[11px] text-slate-400">Simulates physical pointer oscillation & damping settling</span>
              </div>
              <input type="checkbox" onchange="window.labSettings.toggleNeedleSpring(this.checked)" ${this.settings.needleSpringBounce ? 'checked' : ''} class="w-4 h-4 accent-cyan-400 cursor-pointer">
            </div>

            <!-- 50Hz Lab Transformer Hum -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span class="font-semibold text-white block">50Hz Lab Transformer Hum</span>
                <span class="text-[11px] text-slate-400">Subtle ambient mains AC transformer hum when power is ON</span>
              </div>
              <input type="checkbox" onchange="window.labSettings.toggleHum(this.checked)" ${this.settings.enableHum ? 'checked' : ''} class="w-4 h-4 accent-cyan-400 cursor-pointer">
            </div>

            <!-- Auto-save Readings -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span class="font-semibold text-white block">Auto-Save Observation Tables</span>
                <span class="text-[11px] text-slate-400">Preserve student trials across browser reloads</span>
              </div>
              <input type="checkbox" onchange="window.labSettings.toggleAutoSave(this.checked)" ${this.settings.autoSaveReadings ? 'checked' : ''} class="w-4 h-4 accent-cyan-400 cursor-pointer">
            </div>

            <!-- Reset All Data -->
            <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button onclick="window.labSettings.resetLabData()" class="text-xs text-rose-400 hover:text-rose-300">
                🗑️ Reset All Saved Trials
              </button>
              <button onclick="document.getElementById('global-settings-modal-slot').innerHTML=''" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setWireThickness(val) {
    this.settings.wireThickness = val;
    this.saveSettings();
    if (window.simulator) window.simulator.drawWires();
    this.openSettingsModal();
  }

  toggleNeedleSpring(val) {
    this.settings.needleSpringBounce = val;
    this.saveSettings();
  }

  toggleHum(val) {
    this.settings.enableHum = val;
    this.saveSettings();
    if (!val && window.labAudio) window.labAudio.stopLabHum();
  }

  toggleAutoSave(val) {
    this.settings.autoSaveReadings = val;
    this.saveSettings();
  }

  resetLabData() {
    if (confirm('Clear all saved observation tables and local student data?')) {
      localStorage.removeItem('mvl_student_readings');
      localStorage.removeItem('mvl_community_reviews');
      if (window.simulator) {
        window.simulator.readings = [];
        window.simulator.renderSimulatorUI();
        window.simulator.showToast('All stored lab data has been reset.', 'info');
      }
      document.getElementById('global-settings-modal-slot').innerHTML = '';
    }
  }
}

window.labSettings = new LabSettingsManager();
