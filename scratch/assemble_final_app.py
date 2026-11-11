# scratch/assemble_final_app.py

header_and_router = '''/**
 * MY VIRTUAL LAB - Master Application Router & Controller
 * Designed with a modern, futuristic aesthetic.
 * Made in India • Conceived & Developed by Govind Kumar (Founder & Chief Architect, Electrical 2025-29).
 */

const SafeStorage = {
  get: function(key, fallback = null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : fallback;
      }
    } catch (e) {}
    return fallback;
  },
  set: function(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  remove: function(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  },
  getSession: function(key, fallback = null) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const val = window.sessionStorage.getItem(key);
        return val !== null ? val : fallback;
      }
    } catch (e) {}
    return fallback;
  },
  setSession: function(key, val) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeSession: function(key) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {}
  }
};
window.SafeStorage = SafeStorage;

class AppController {
  constructor() {
    this.currentPage = 'home';
    this.currentExpId = 'superposition-theorem';
    this.currentLanguage = SafeStorage.get('mvl_lang', 'en');
    this.currentTheme = SafeStorage.get('mvl_theme', 'dark');
    this.activeProcedureStep = 0;
    this.activeExpTab = 'aim';
    this.isNotifOpen = false;
    this.deviceMode = SafeStorage.get('mvl_device_mode', (typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'pc'));
    this.notifications = this.loadNotifications();
    this.sandboxVolts = 12.0;
    this.sandboxOhms = 100;
    this.introInterval = null;
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLanguage);
    this.bindGlobalEvents();
    this.renderNavigation();
    this.navigateTo(this.currentPage);
    
    // Automatic 7-8 seconds opening animation on website open
    this.playOpeningAnimation(true);
  }

  /* =========================================================================
     DEVICE MODE (PC / MOBILE)
     ========================================================================= */

  toggleDeviceMode() {
    this.deviceMode = this.deviceMode === 'pc' ? 'mobile' : 'pc';
    SafeStorage.set('mvl_device_mode', this.deviceMode);
    if (window.simulator) {
      window.simulator.setDeviceMode(this.deviceMode);
    }
    this.renderNavigation();
    if (window.simulator) {
      window.simulator.showToast(`Switched to ${this.deviceMode.toUpperCase()} Mode`, 'info');
    }
  }

  /* =========================================================================
     NOTIFICATIONS SYSTEM
     ========================================================================= */

  loadNotifications() {
    return [
      {
        id: 'notif-1',
        title: 'Apparatus Calculations Verified',
        body: 'Dipali Kumari (Electrical Engineering 25–29) completed verification for Superposition Theorem and Thevenin/Norton Theorem calculations.',
        time: '2 hours ago',
        icon: '⚡',
        unread: true
      },
      {
        id: 'notif-2',
        title: 'Two-Port Parameters Calibrated',
        body: 'Subham Patel (ECE 25–29) initiated circuit parameter calibration for Two-Port Z & H parameters digital twin schematics.',
        time: '5 hours ago',
        icon: '📡',
        unread: true
      },
      {
        id: 'notif-3',
        title: 'Zero-Error Benchmarks Live',
        body: 'Founder Govind Kumar activated continuous Kirchhoff nodal equation solvers ensuring 100% mathematical zero-error calculations.',
        time: '1 day ago',
        icon: '🎯',
        unread: false
      }
    ];
  }

  getUnreadNotificationCount() {
    return this.notifications.filter(n => n.unread).length;
  }

  toggleNotificationModal() {
    this.isNotifOpen = !this.isNotifOpen;
    const existing = document.getElementById('notification-modal-slot');
    if (!this.isNotifOpen) {
      if (existing) existing.innerHTML = '';
      return;
    }

    if (!existing) return;
    existing.innerHTML = `
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-end p-4 sm:p-6" onclick="window.app.toggleNotificationModal()">
        <div class="w-full max-w-sm rounded-2xl glass-panel border border-slate-700 shadow-2xl p-4 space-y-3 mt-14" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between pb-2 border-b border-slate-700">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-bold font-heading text-white">Notifications & Alerts</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Lab Live</span>
            </div>
            <button onclick="window.app.markAllNotificationsRead()" class="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono transition">Mark all read</button>
          </div>
          <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
            ${this.notifications.map(n => `
              <div class="p-2.5 rounded-xl border transition ${n.unread ? 'bg-slate-800/80 border-cyan-500/40' : 'bg-slate-900/60 border-slate-800 opacity-70'}">
                <div class="flex items-start space-x-2.5">
                  <span class="text-lg flex-shrink-0">${n.icon}</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold text-white truncate">${n.title}</div>
                    <div class="text-[11px] text-slate-300 mt-0.5 leading-snug">${n.body}</div>
                    <div class="text-[9px] font-mono text-slate-400 mt-1">${n.time}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => n.unread = false);
    this.renderNavigation();
    this.toggleNotificationModal();
    if (window.simulator) window.simulator.showToast('All notifications marked as read', 'info');
  }

  /* =========================================================================
     THEME & LANGUAGE TOGGLE
     ========================================================================= */

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    SafeStorage.set('mvl_theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
    this.renderNavigation();
    if (window.simulator) window.simulator.render();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'hi' : 'en';
    SafeStorage.set('mvl_lang', this.currentLanguage);
    this.applyLanguage(this.currentLanguage);
    this.renderNavigation();
    this.navigateTo(this.currentPage, this.currentExpId);
  }

  applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
  }

  /* =========================================================================
     ROUTER (DASHBOARD REMOVED AS DIRECTED)
     ========================================================================= */

  navigateTo(pageId, expId = null) {
    // If dashboard was requested, redirect home
    if (pageId === 'dashboard') pageId = 'home';

    this.currentPage = pageId;
    if (expId) this.currentExpId = expId;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const contentArea = document.getElementById('main-page-content');
    if (!contentArea) return;

    switch (pageId) {
      case 'home':
        this.renderHomePage(contentArea);
        break;
      case 'lab-hub':
        this.renderLabHubPage(contentArea);
        break;
      case 'experiment':
        this.renderExperimentPage(contentArea);
        break;
      case 'simulator':
        this.renderSimulatorPage(contentArea);
        break;
      case 'instruments':
        this.renderInstrumentsPage(contentArea);
        break;
      case 'blogs':
        this.renderBlogsPage(contentArea);
        break;
      case 'contributors':
        this.renderContributorsPage(contentArea);
        break;
      case 'admin':
        this.renderAdminPage(contentArea);
        break;
      default:
        this.renderHomePage(contentArea);
    }

    this.updateActiveNavPill();
  }

  /* =========================================================================
     GLOBAL NAVIGATION BAR (NO DASHBOARD, CONTRIBUTORS CHANGED TO ADMIN PANEL)
     ========================================================================= */

  renderNavigation() {
    const nav = document.getElementById('global-navbar');
    if (!nav) return;

    const isHindi = this.currentLanguage === 'hi';
    const isDark = this.currentTheme === 'dark';
    const unreadCount = this.getUnreadNotificationCount();
    const isMobile = this.deviceMode === 'mobile';
    const sysBanner = SafeStorage.get('mvl_system_banner', '');

    nav.innerHTML = `
      ${sysBanner ? `
        <div class="bg-gradient-to-r from-cyan-950 via-slate-900 to-amber-950 border-b border-cyan-500/30 py-1.5 px-4 text-center text-[11px] font-mono text-cyan-300 flex items-center justify-center space-x-2">
          <span>📢</span>
          <span><strong>Notice:</strong> ${sysBanner}</span>
        </div>
      ` : ''}

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-3">
          
          <!-- Futuristic High-Tech Logo -->
          <div class="flex items-center space-x-3 cursor-pointer group flex-shrink-0" onclick="window.app.navigateTo('home')">
            <div class="relative w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.35)] overflow-hidden transition transform group-hover:scale-105">
              <svg class="w-7 h-7" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="url(#nav_logo_grad)" stroke-width="2" stroke-dasharray="4 2">
                  <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="12s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="20" r="10" stroke="#00F2FE" stroke-width="2" opacity="0.8" />
                <circle cx="20" cy="20" r="4" fill="#8B5CF6">
                  <animate attributeName="r" values="3.5;4.8;3.5" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <path d="M 20 3 L 20 10 M 20 30 L 20 37 M 3 20 L 10 20 M 30 20 L 37 20" stroke="#00F2FE" stroke-width="2" stroke-linecap="round" />
                <defs>
                  <linearGradient id="nav_logo_grad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stop-color="#00F2FE" />
                    <stop offset="50%" stop-color="#3B82F6" />
                    <stop offset="100%" stop-color="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-base font-bold font-heading tracking-tight text-white group-hover:text-cyan-300 transition">MY VIRTUAL LAB</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-semibold shadow-inner">🇮🇳 Made in India</span>
              </div>
              <p class="text-[10px] font-mono text-slate-400">Digital Twin of Real Lab Instruments</p>
            </div>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden lg:flex items-center space-x-1">
            <button onclick="window.app.navigateTo('home')" class="nav-btn px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition" data-nav="home">
              ${isHindi ? 'होम' : 'Home'}
            </button>
            <button onclick="window.app.navigateTo('lab-hub')" class="nav-btn px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition" data-nav="lab-hub">
              ${isHindi ? 'प्रयोगशाला हब' : 'Labs'}
            </button>
            <button onclick="window.app.navigateTo('simulator', 'superposition-theorem')" class="nav-btn px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200 rounded-lg transition flex items-center space-x-1" data-nav="simulator">
              <span>⚡</span>
              <span>${isHindi ? 'सिमुलेटर' : 'Simulator'}</span>
            </button>
            <button onclick="window.app.navigateTo('blogs')" class="nav-btn px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition" data-nav="blogs">
              ${isHindi ? 'गाइड्स' : 'Guides'}
            </button>
            
            <!-- ADMIN PANEL ONLY FOR GOVIND KUMAR (Double Password Protected) -->
            <button onclick="window.app.navigateTo('admin')" class="nav-btn px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-xl transition flex items-center space-x-1.5 shadow-sm" data-nav="admin">
              <span>👑</span>
              <span>${isHindi ? 'व्यवस्थापक' : 'Admin Panel'}</span>
            </button>
          </div>

          <!-- Quick Search Pill -->
          <button onclick="window.app.openQuickSearchModal()" class="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 text-xs font-mono transition shadow-inner">
            <span class="text-cyan-400">🔍</span>
            <span>Search Experiment...</span>
            <kbd class="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">Ctrl+K</kbd>
          </button>

          <!-- Right Utility Toggles & Actions -->
          <div class="flex items-center space-x-2">
            <button onclick="window.app.openQuickSearchModal()" class="md:hidden p-1.5 text-cyan-300 bg-slate-800/80 rounded-lg border border-slate-700" title="Quick Experiment Finder">
              🔍
            </button>

            <!-- PC / Mobile Mode Toggle in Navbar -->
            <button onclick="window.app.toggleDeviceMode()" class="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition shadow-sm" title="Toggle PC / Mobile View Mode">
              ${isMobile ? '📱 Mobile' : '🖥️ PC'}
            </button>

            <!-- Notification Bell with Alert Counter -->
            <button onclick="window.app.toggleNotificationModal()" class="relative p-1.5 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700 transition" title="Lab Alerts & Updates">
              🔔
              ${unreadCount > 0 ? `
                <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                  ${unreadCount}
                </span>
              ` : ''}
            </button>

            <!-- Language Toggle (Hindi / English) -->
            <button onclick="window.app.toggleLanguage()" class="px-2 py-1 text-xs font-mono font-semibold bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition" title="Toggle Language (Hindi / English)">
              ${isHindi ? 'EN' : 'HI'}
            </button>

            <!-- Dark / Light Mode Toggle -->
            <button onclick="window.app.toggleTheme()" class="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700 transition" title="Toggle Dark/Light Mode">
              ${isDark ? '☀️' : '🌙'}
            </button>

            <!-- Sound Mute Toggle -->
            <button onclick="window.app.toggleMute()" id="nav-sound-btn" class="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700 transition" title="Mute/Unmute Lab Sounds">
              🔊
            </button>

            <!-- Settings Button -->
            <button onclick="window.labSettings.openSettingsModal()" class="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800/80 rounded-lg border border-slate-700 transition" title="Laboratory & Simulator Settings">
              ⚙️
            </button>
          </div>

        </div>
      </div>
    `;
  }

  updateActiveNavPill() {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
      const page = btn.getAttribute('data-nav');
      if (page === this.currentPage) {
        btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border', 'border-cyan-500/40');
      } else {
        btn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border', 'border-cyan-500/40');
      }
    });
  }

  openQuickSearchModal() {
    let slot = document.getElementById('global-search-modal-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'global-search-modal-slot';
      document.body.appendChild(slot);
    }

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn" onclick="document.getElementById('global-search-modal-slot').innerHTML=''">
        <div class="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative text-slate-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-cyan-400 text-lg">🔍</span>
              <h3 class="text-sm font-bold font-heading text-white">Quick Experiment Finder</h3>
            </div>
            <button onclick="document.getElementById('global-search-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1 text-sm">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-slate-300 text-xs mb-1 font-mono">Select Experiment:</label>
              <select id="modal-exp-sel" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono focus:border-cyan-400 focus:outline-none">
                ${(window.EXPERIMENTS_DATA || []).map(e => `<option value="${e.id}">${e.code} — ${e.title.en}</option>`).join('')}
              </select>
            </div>

            <div class="pt-3 flex justify-end space-x-2 text-xs">
              <button onclick="document.getElementById('global-search-modal-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">Cancel</button>
              <button onclick="window.app.launchFromModalSearch()" class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg">Open in Simulator ⚡</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  launchFromModalSearch() {
    const expId = document.getElementById('modal-exp-sel')?.value || 'superposition-theorem';
    document.getElementById('global-search-modal-slot').innerHTML = '';
    this.navigateTo('simulator', expId);
  }

  toggleMute() {
    if (window.labAudio) {
      const isMuted = window.labAudio.toggleMute();
      const btn = document.getElementById('nav-sound-btn');
      if (btn) btn.innerText = isMuted ? '🔇' : '🔊';
      if (window.simulator) window.simulator.showToast(isMuted ? 'Sound effects muted' : 'Sound effects unmuted', 'info');
    }
  }

  /* =========================================================================
     7-8 SECONDS OPENING CINEMATIC LABORATORY ANIMATION
     (Runs automatically on opening without requiring replay click)
     ========================================================================= */

  playOpeningAnimation(auto = false) {
    let slot = document.getElementById('opening-animation-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'opening-animation-slot';
      document.body.prepend(slot);
    }

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
          
          <!-- Animated MO-65 Meter SVG Dial with 3D Depth -->
          <div class="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg class="w-full h-full drop-shadow-[0_0_30px_rgba(0,242,254,0.4)]" viewBox="0 0 200 200" fill="none">
              <!-- Outer 3D Bezel -->
              <circle cx="100" cy="100" r="92" fill="#0D1527" stroke="#1E293B" stroke-width="4" />
              <circle cx="100" cy="100" r="84" fill="#070B19" stroke="#00F2FE" stroke-width="1.8" stroke-dasharray="6 4" class="spin-orbit-slow" />
              
              <!-- Dial Face -->
              <circle cx="100" cy="100" r="76" fill="#F8FAFC" opacity="0.95" />
              <path d="M 38 105 A 64 64 0 0 1 162 105" stroke="#1E293B" stroke-width="2" fill="none" />
              <path d="M 48 100 A 54 54 0 0 1 152 100" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="2 3" fill="none" opacity="0.6" />

              <text x="100" y="85" text-anchor="middle" font-size="11" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#0F172A">MO-65</text>
              <text x="100" y="125" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#334155">DIGITAL TWIN</text>

              <!-- Spring-Damped Sweeping Pointer -->
              <g id="intro-needle-group" class="intro-needle-sweep">
                <line x1="100" y1="94" x2="100" y2="38" stroke="#DC2626" stroke-width="3" stroke-linecap="round" filter="drop-shadow(0 0 6px #EF4444)" />
                <circle cx="100" cy="94" r="5" fill="#1E293B" stroke="#DC2626" stroke-width="2" />
              </g>

              <!-- Center Power Indicator Node -->
              <circle cx="100" cy="100" r="10" fill="#070B19" stroke="#8B5CF6" stroke-width="2" />
              <circle cx="100" cy="100" r="4" fill="#00F2FE" class="animate-ping" />
            </svg>
          </div>

          <!-- Dynamic Status & Boot Phase Sequence -->
          <div class="space-y-3">
            <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span id="intro-status-dot" class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span id="intro-status-text">INITIALIZING DIGITAL TWIN BENCH...</span>
            </div>

            <h1 id="intro-headline" class="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              MY VIRTUAL LAB
            </h1>

            <p id="intro-subtext" class="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
              Photorealistic digital twin of physical college electrical engineering laboratory apparatus.
            </p>
          </div>

          <!-- Futuristic 7.5s Progress Bar -->
          <div class="space-y-1.5 max-w-md mx-auto pt-2">
            <div class="w-full h-2.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden p-0.5 shadow-inner">
              <div id="intro-progress-bar" class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all ease-linear" style="width: 0%;"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span id="intro-stage-label">STAGE 1: POWER BUS (12V DC READY)</span>
              <span id="intro-pct-label">0%</span>
            </div>
          </div>

          <!-- Founder & Verification Authority Badge -->
          <div class="pt-2 text-[11px] font-mono text-slate-400">
            Conceived & Developed by <strong class="text-amber-300 font-bold">Govind Kumar</strong> • Electrical Engineering (Batch 2025–2029)
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
        if (stageLabel) stageLabel.innerText = 'STAGE 1: 12V DC REGULATED POWER BUS';
        if (statusText) statusText.innerText = '⚡ ENERGIZING 12V DC REGULATED POWER RAILS...';
      } else if (elapsed < 3800) {
        if (stageLabel) stageLabel.innerText = 'STAGE 2: MO-65 ANALOG METER CALIBRATION';
        if (statusText) statusText.innerText = '🧭 CALIBRATING MO-65 ANALOG METERS & SPRING DAMPING...';
      } else if (elapsed < 5500) {
        if (stageLabel) stageLabel.innerText = 'STAGE 3: ZERO-ERROR PHYSICS ENGINE';
        if (statusText) statusText.innerText = '🔬 SOLVING CONTINUOUS NODAL EQUATIONS (100% ZERO-ERROR)...';
      } else {
        if (stageLabel) stageLabel.innerText = 'STAGE 4: DIGITAL TWIN ONLINE';
        if (statusText) statusText.innerText = '✓ SYSTEM ONLINE • WELCOME TO MY VIRTUAL LAB';
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        if (window.simulator) window.simulator.showToast('✓ Email copied: myvirtuallablive@gmail.com', 'success');
      }).catch(() => {
        prompt('Founder official email:', email);
      });
    } else {
      prompt('Founder official email:', email);
    }
  }

  updateSandboxCurrent(volts, ohms) {
    if (volts !== undefined) this.sandboxVolts = parseFloat(volts) || 12.0;
    if (ohms !== undefined) this.sandboxOhms = parseFloat(ohms) || 100;

    // Zero-Error Physics calculation: I = (V / R) * 1000 mA
    const current_mA = (this.sandboxVolts / this.sandboxOhms) * 1000;
    const power_W = (this.sandboxVolts * current_mA) / 1000;

    // Deflection angle on 250mA meter dial (-45 deg to +45 deg)
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

  toggleFaq(index) {
    const answer = document.getElementById(`faq-ans-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if (!answer || !icon) return;

    if (answer.classList.contains('hidden')) {
      answer.classList.remove('hidden');
      icon.innerText = '−';
    } else {
      answer.classList.add('hidden');
      icon.innerText = '+';
    }
  }

  /* =========================================================================
     PAGE 1: ULTRA-MODERN FUTURISTIC HOME PAGE
     (3D Visuals, Live Sandbox Simulation, Why Practice Here, Lab FAQ,
      and Centralized Email Instructions to myvirtuallablive@gmail.com)
     ========================================================================= */

  renderHomePage(container) {
    try {
      const isHindi = this.currentLanguage === 'hi';
      const contributors = (window.adminPanel && typeof window.adminPanel.getContributors === 'function') 
        ? window.adminPanel.getContributors() 
        : [];
      const govindPhoto = SafeStorage.get('mvl_photo_govind', '');

      const v = typeof this.sandboxVolts === 'number' ? this.sandboxVolts : 12.0;
      const r = typeof this.sandboxOhms === 'number' ? this.sandboxOhms : 100;
      const initI = ((v / r) * 1000).toFixed(1);
      const initP = ((v * (v / r))).toFixed(2);
      const initAngle = (-45 + (Math.min(250, (v / r) * 1000) / 250) * 90).toFixed(1);

      container.innerHTML = `
        <div class="space-y-12 py-6 animate-fadeIn">
          
          <!-- ===================================================================
               1. 3D-STYLED FUTURISTIC HERO BANNER
               =================================================================== -->
          <div class="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-10 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.12)] bg-gradient-to-b from-slate-900/95 via-[#081024]/95 to-slate-900/95">
            <div class="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <!-- Left Hero Content -->
              <div class="lg:col-span-7 space-y-5">
                <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>🇮🇳 MADE IN INDIA • ADVANCED DIGITAL TWIN LAB</span>
                </div>

                <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                  ${isHindi ? 'असली लैब उपकरणों का डिजिटल अनुभव' : 'Next-Gen Digital Twin of Real College Laboratories'}
                </h1>

                <p class="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-body">
                  ${isHindi 
                    ? 'असली कॉलेज लैब उपकरणों की 1:1 प्रतिकृति पर अभ्यास करें। टर्मिनलों के बीच तार जोड़ें, नॉब घुमाएं, स्प्रिंग-डैम्प्ड मीटर पढ़ें और वास्तविक प्रयोग से पहले बिना किसी खतरे के पूर्ण आत्मविश्वास प्राप्त करें।'
                    : 'Experience interactive, photorealistic digital replicas of real college laboratory apparatus. Drag flexible patchcords between terminals, turn rotary potentiometers, read spring-inertia analog meters, and verify circuit theorems before handling expensive, risky physical equipment.'}
                </p>

                <!-- Main Hero Actions -->
                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <button onclick="window.app.navigateTo('lab-hub')" class="px-5 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-heading font-bold text-xs rounded-xl shadow-[0_0_25px_rgba(0,242,254,0.4)] transition transform hover:-translate-y-0.5 flex items-center space-x-2">
                    <span>🔬</span>
                    <span>${isHindi ? 'प्रयोगशाला हब खोलें' : 'Start an Experiment'}</span>
                    <span>→</span>
                  </button>

                  <button onclick="document.getElementById('how-it-works-section')?.scrollIntoView({behavior: 'smooth'})" class="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-heading font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-2">
                    <span>⚡</span>
                    <span>${isHindi ? 'यह कैसे उपयोगी है?' : 'How It Is Useful'}</span>
                  </button>

                  <button onclick="window.app.navigateTo('blogs')" class="px-3.5 py-3 text-xs text-cyan-300 hover:text-cyan-200 bg-slate-900/80 rounded-xl border border-cyan-500/30 transition">
                    ${isHindi ? 'इंजीनियरिंग गाइड्स' : 'Lab Guides & Theory'} →
                  </button>
                </div>

                <!-- Academic Caution Note -->
                <div class="p-3 bg-slate-900/80 rounded-xl border border-amber-500/30 text-[11px] text-slate-400 font-mono flex items-center space-x-2.5">
                  <span class="text-amber-400 text-base">⚠️</span>
                  <span><strong>Lab Safety & Precision Note:</strong> Digital twins simulate pure theoretical equations. Real physical measurements in college may vary slightly due to contact resistance and component tolerances.</span>
                </div>
              </div>

              <!-- Right Hero Visual: 3D-Styled Holographic Multimeter Workbench -->
              <div class="lg:col-span-5 flex justify-center">
                <div class="relative w-full max-w-sm rounded-3xl p-5 glass-panel border border-cyan-500/50 shadow-[0_0_35px_rgba(0,242,254,0.2)] flex flex-col items-center bg-slate-950/90">
                  
                  <div class="flex items-center justify-between w-full mb-2 text-[10px] font-mono border-b border-slate-700/80 pb-2">
                    <span class="text-cyan-400 font-bold flex items-center space-x-1.5">
                      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>3D VIRTUAL MULTIMETER</span>
                    </span>
                    <span class="text-emerald-400 font-bold">100% ZERO-ERROR</span>
                  </div>

                  <!-- 3D SVG MO-65 Milliammeter Chassis -->
                  <div class="relative w-full h-40 flex items-center justify-center">
                    <svg class="w-full h-full drop-shadow-xl" viewBox="0 0 160 110" fill="none">
                      <rect x="5" y="5" width="150" height="100" rx="12" fill="#0F172A" stroke="#334155" stroke-width="2" />
                      <!-- Screws -->
                      <circle cx="12" cy="12" r="2.5" fill="#94A3B8" />
                      <circle cx="148" cy="12" r="2.5" fill="#94A3B8" />
                      <circle cx="12" cy="98" r="2.5" fill="#94A3B8" />
                      <circle cx="148" cy="98" r="2.5" fill="#94A3B8" />

                      <circle cx="80" cy="75" r="48" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
                      
                      <!-- Scale Markings -->
                      <path d="M 42 75 A 38 38 0 0 1 118 75" stroke="#1E293B" stroke-width="1.5" fill="none" />
                      <text x="42" y="85" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">0</text>
                      <text x="80" y="44" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">125</text>
                      <text x="118" y="85" text-anchor="middle" font-size="7" font-family="monospace" fill="#334155" font-weight="bold">250</text>
                      
                      <text x="80" y="60" text-anchor="middle" font-size="9" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#0F172A">mA DC</text>
                      
                      <!-- Anti-Parallax Mirror Strip -->
                      <path d="M 48 75 A 32 32 0 0 1 112 75" stroke="#94A3B8" stroke-width="2" stroke-dasharray="2 2" fill="none" opacity="0.6" />

                      <!-- Dynamic Needle -->
                      <g id="sandbox-needle" class="sandbox-meter-needle" transform="rotate(${initAngle} 80 75)">
                        <line x1="80" y1="75" x2="80" y2="40" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" />
                        <circle cx="80" cy="75" r="3.5" fill="#1E293B" stroke="#DC2626" stroke-width="1" />
                      </g>

                      <!-- Pilot LED -->
                      <circle id="sandbox-pilot-led" cx="140" cy="20" r="4" fill="#00F2FE" style="filter: drop-shadow(0 0 8px #00F2FE);" />
                    </svg>
                  </div>

                  <!-- Live Interactive Sliders -->
                  <div class="w-full space-y-2.5 pt-2 text-xs">
                    <div>
                      <div class="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>DC Voltage (V):</span>
                        <span id="sandbox-v-val" class="text-cyan-400 font-bold">${v.toFixed(1)} V</span>
                      </div>
                      <input type="range" min="0" max="15" step="0.5" value="${v}" class="w-full accent-cyan-400 cursor-pointer" oninput="window.app.updateSandboxCurrent(this.value, undefined)">
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Load Resistance (R):</span>
                        <span id="sandbox-r-val" class="text-amber-400 font-bold">${r} Ω</span>
                      </div>
                      <input type="range" min="20" max="500" step="10" value="${r}" class="w-full accent-amber-400 cursor-pointer" oninput="window.app.updateSandboxCurrent(undefined, this.value)">
                    </div>
                  </div>

                  <!-- Instant Zero-Error Telemetry -->
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
               2. HOW IT IS USEFUL FOR YOU (CORE PURPOSE & BENEFITS)
               =================================================================== -->
          <div id="how-it-works-section" class="space-y-6 pt-2">
            <div class="text-center max-w-2xl mx-auto space-y-2">
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
                <span>🎓</span>
                <span>ENGINEERING EDUCATION IMPACT</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold font-heading text-white">
                How My Virtual Lab Is Useful For You
              </h2>
              <p class="text-xs text-slate-400">
                Bridging textbook mathematics with real laboratory confidence so you excel in practical exams and physical lab sessions.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div class="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-cyan-400/60 transition">
                <div class="space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <h3 class="text-base font-bold font-heading text-white">1. Zero-Risk Safe Practice</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-body">
                    Real laboratory benches carry risks of blown fuses, coil burnout, and electric faults. Here you can make wiring mistakes safely and understand what causes short circuits without fear.
                  </p>
                </div>
                <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 font-semibold">
                  Pre-Lab Confidence
                </div>
              </div>

              <div class="glass-card rounded-2xl p-6 border border-violet-500/30 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-violet-400/60 transition">
                <div class="space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-2xl">
                    🔌
                  </div>
                  <h3 class="text-base font-bold font-heading text-white">2. Master Complex Wiring</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-body">
                    Wiring 8 to 14 banana sockets on real boards can be overwhelming in physical lab hours. Practice patchcord routing at your own pace so you finish lab tasks before everyone else.
                  </p>
                </div>
                <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-violet-400 font-semibold">
                  Intuitive Wiring Flow
                </div>
              </div>

              <div class="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-emerald-400/60 transition">
                <div class="space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <h3 class="text-base font-bold font-heading text-white">3. Zero-Error Calculations</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-body">
                    Verify theoretical derivations against exact continuous nodal equations. Never get confused by damaged rheostats or faulty laboratory components again.
                  </p>
                </div>
                <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold">
                  Pure Physics Precision
                </div>
              </div>

              <div class="glass-card rounded-2xl p-6 border border-amber-500/30 bg-slate-900/40 flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition">
                <div class="space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                    📑
                  </div>
                  <h3 class="text-base font-bold font-heading text-white">4. On-Time PDF Reports</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-body">
                    Record observation values directly on time and export print-ready PDF observation tables with your name, date, graph plots, and viva questions. No accounts or saving needed!
                  </p>
                </div>
                <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 font-semibold">
                  Instant Download
                </div>
              </div>

            </div>
          </div>

          <!-- ===================================================================
               3. 3D DIGITAL TWIN APPARATUS SHOWCASE (5 EXPERIMENTS)
               =================================================================== -->
          <div class="space-y-6 pt-2">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 class="text-xl md:text-2xl font-bold font-heading text-white flex items-center space-x-2">
                  <span>🔬</span>
                  <span>Physical Laboratory Digital Twins</span>
                </h2>
                <p class="text-xs text-slate-400">
                  Exact digital replicas of actual laboratory benches fabricated with true terminal coordinates and dial scales.
                </p>
              </div>
              <button onclick="window.app.navigateTo('lab-hub')" class="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold">
                Explore All in Hub →
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              ${(window.EXPERIMENTS_DATA || []).map(exp => `
                <div class="glass-card rounded-2xl p-5 border border-slate-700/80 bg-slate-900/60 flex flex-col justify-between group hover:border-cyan-500/50 transition">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ${exp.code}
                      </span>
                      <span class="text-[10px] font-mono text-emerald-400 font-semibold">✓ Zero-Error Twin</span>
                    </div>

                    <h3 class="text-base font-bold font-heading text-white group-hover:text-cyan-400 transition leading-snug">
                      ${exp.title.en}
                    </h3>

                    <p class="text-xs text-slate-300 line-clamp-3 font-body">
                      ${exp.summary.en}
                    </p>
                  </div>

                  <div class="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-slate-400">${exp.model}</span>
                    <button onclick="window.app.navigateTo('simulator', '${exp.id}')" class="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1">
                      <span>⚡</span>
                      <span>Launch Twin</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ===================================================================
               4. FOUNDER LEADERSHIP & VERIFICATION CONTRIBUTORS
               =================================================================== -->
          <div class="space-y-6 pt-2">
            
            <!-- Founder Executive Card (Govind Kumar) -->
            <div class="founder-card rounded-3xl p-6 md:p-8 border border-amber-500/50 relative overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
              <div class="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
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
                      Open Admin Suite (Password Protected) 🔐
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
               5. CENTRALIZED INQUIRY HUB & EMAIL INSTRUCTIONS
               (Clear instructions for Report, Request, Review to myvirtuallablive@gmail.com)
               =================================================================== -->
          <div id="contact-instructions-section" class="glass-panel rounded-3xl p-6 md:p-8 border border-cyan-500/40 relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 shadow-2xl">
            <div class="max-w-3xl mx-auto space-y-6">
              
              <div class="text-center space-y-2">
                <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                  <span>✉️</span>
                  <span>CENTRALIZED COMMUNICATION HUB</span>
                </div>
                <h2 class="text-2xl md:text-3xl font-extrabold font-heading text-white">
                  Report, Request & Review Instructions
                </h2>
                <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-body max-w-xl mx-auto">
                  To report any observed error, request a new experiment added to the lab, or share feedback, follow these instructions to contact Founder Govind Kumar directly:
                </p>
              </div>

              <!-- Official Email Card -->
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

              <!-- Clear Instruction Cards for Report, Request, Review -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                <!-- Instruction 1: Report an Error -->
                <div class="p-4 rounded-2xl bg-slate-900/70 border border-rose-500/30 space-y-2">
                  <div class="flex items-center space-x-2 text-rose-300 font-bold font-heading text-sm">
                    <span>🐞</span>
                    <span>1. Report an Error</span>
                  </div>
                  <p class="text-slate-300 leading-relaxed font-body text-[11px]">
                    Noticed a calculation discrepancy, needle misreading, or socket labeling issue?
                  </p>
                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                    <div><strong>Subject:</strong> Bug Report - [Exp Name]</div>
                    <div><strong>Include:</strong> Voltage/Resistance used and the observed meter reading.</div>
                  </div>
                </div>

                <!-- Instruction 2: Request New Experiment -->
                <div class="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-2">
                  <div class="flex items-center space-x-2 text-cyan-300 font-bold font-heading text-sm">
                    <span>💡</span>
                    <span>2. Request Experiment</span>
                  </div>
                  <p class="text-slate-300 leading-relaxed font-body text-[11px]">
                    Want an experiment from your college syllabus digitized into a working twin?
                  </p>
                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                    <div><strong>Subject:</strong> Experiment Request - [Title]</div>
                    <div><strong>Include:</strong> Syllabus circuit schematic, aim, and apparatus photo.</div>
                  </div>
                </div>

                <!-- Instruction 3: Submit Review & Feedback -->
                <div class="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/30 space-y-2">
                  <div class="flex items-center space-x-2 text-amber-300 font-bold font-heading text-sm">
                    <span>⭐</span>
                    <span>3. Submit Review</span>
                  </div>
                  <p class="text-slate-300 leading-relaxed font-body text-[11px]">
                    Share how the digital twin helped your laboratory preparation and exam readiness.
                  </p>
                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                    <div><strong>Subject:</strong> Student Review / Feedback</div>
                    <div><strong>Include:</strong> Your feedback, branch/year, and suggestions.</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- ===================================================================
               6. DESIGN LAB FAQ ACCORDION (FREQUENTLY ASKED QUESTIONS)
               =================================================================== -->
          <div class="space-y-4 pt-2 max-w-3xl mx-auto">
            <div class="text-center space-y-1">
              <h2 class="text-xl md:text-2xl font-bold font-heading text-white flex items-center justify-center space-x-2">
                <span>❓</span>
                <span>Frequently Asked Questions</span>
              </h2>
              <p class="text-xs text-slate-400">Everything you need to know about My Virtual Lab digital twins.</p>
            </div>

            <div class="space-y-3 text-xs">
              
              <!-- FAQ 1 -->
              <div class="glass-card rounded-2xl p-4 border border-slate-700/80 bg-slate-900/50 cursor-pointer" onclick="window.app.toggleFaq(1)">
                <div class="flex items-center justify-between font-bold text-white text-sm">
                  <span>How does My Virtual Lab calculate meter readings with zero error?</span>
                  <span id="faq-icon-1" class="text-cyan-400 font-mono text-base">+</span>
                </div>
                <div id="faq-ans-1" class="hidden mt-2 text-slate-300 font-body leading-relaxed border-t border-slate-800 pt-2 text-[11px]">
                  The simulator executes continuous matrix nodal analysis and Kirchhoff\\'s loop equations directly on your wiring configuration. It derives exact mathematical current and voltage from fundamental electrical physics rather than approximating or faking readings.
                </div>
              </div>

              <!-- FAQ 2 -->
              <div class="glass-card rounded-2xl p-4 border border-slate-700/80 bg-slate-900/50 cursor-pointer" onclick="window.app.toggleFaq(2)">
                <div class="flex items-center justify-between font-bold text-white text-sm">
                  <span>Are the digital boards identical to our real college laboratory machines?</span>
                  <span id="faq-icon-2" class="text-cyan-400 font-mono text-base">+</span>
                </div>
                <div id="faq-ans-2" class="hidden mt-2 text-slate-300 font-body leading-relaxed border-t border-slate-800 pt-2 text-[11px]">
                  Yes. Every apparatus in My Virtual Lab is a photorealistic digital twin constructed from physical college laboratory apparatus photos, preserving exact banana socket positions, MO-65 meter scales, dual ranges, and knife switches.
                </div>
              </div>

              <!-- FAQ 3 -->
              <div class="glass-card rounded-2xl p-4 border border-slate-700/80 bg-slate-900/50 cursor-pointer" onclick="window.app.toggleFaq(3)">
                <div class="flex items-center justify-between font-bold text-white text-sm">
                  <span>How do I download my observation table for lab submissions?</span>
                  <span id="faq-icon-3" class="text-cyan-400 font-mono text-base">+</span>
                </div>
                <div id="faq-ans-3" class="hidden mt-2 text-slate-300 font-body leading-relaxed border-t border-slate-800 pt-2 text-[11px]">
                  During simulation, whenever you set a voltage or connect a load, click "Record Reading" to log the values into your observation table. Then click "Download PDF Report" to instantly generate a print-ready lab report with your name, date, tables, circuit diagram, and viva questions. No saving or account required!
                </div>
              </div>

              <!-- FAQ 4 -->
              <div class="glass-card rounded-2xl p-4 border border-slate-700/80 bg-slate-900/50 cursor-pointer" onclick="window.app.toggleFaq(4)">
                <div class="flex items-center justify-between font-bold text-white text-sm">
                  <span>Can I use My Virtual Lab on a mobile phone?</span>
                  <span id="faq-icon-4" class="text-cyan-400 font-mono text-base">+</span>
                </div>
                <div id="faq-ans-4" class="hidden mt-2 text-slate-300 font-body leading-relaxed border-t border-slate-800 pt-2 text-[11px]">
                  Yes! My Virtual Lab is fully optimized for smartphones and tablets. It includes a dedicated Mobile Mode button in the navigation bar and uses scalable vector apparatus graphics so you can zoom in, drag patchcords, and read meters smoothly on touchscreens.
                </div>
              </div>

            </div>
          </div>

        </div>
      `;
    } catch (err) {
      console.error("Critical renderHomePage error:", err);
      container.innerHTML = `
        <div class="p-8 text-center space-y-4">
          <div class="text-4xl">🔬</div>
          <h2 class="text-xl font-bold text-white font-heading">Welcome to My Virtual Lab</h2>
          <p class="text-xs text-slate-400">Digital twin of physical electrical engineering laboratory instruments.</p>
          <button onclick="window.app.navigateTo('lab-hub')" class="px-5 py-2.5 bg-cyan-600 text-white text-xs font-semibold rounded-xl">
            Open Laboratory Hub →
          </button>
        </div>
      `;
    }
  }
'''

# Read labhub_part.js (which contains everything from LabHub onwards)
with open('scratch/labhub_part.js', 'r', encoding='utf-8') as f:
    labhub_and_rest = f.read()

# Assemble full js/app.js
full_app_code = header_and_router + '\n\n' + labhub_and_rest

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(full_app_code)

print("Saved complete, robust js/app.js successfully!")
