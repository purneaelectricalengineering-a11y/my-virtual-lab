# scratch/build_updated_app.py
import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update constructor to include sandbox state and banner
constructor_old = """    this.isNotifOpen = false;
    this.deviceMode = localStorage.getItem('mvl_device_mode') || (window.innerWidth < 768 ? 'mobile' : 'pc');
    this.notifications = this.loadNotifications();
  }"""

constructor_new = """    this.isNotifOpen = false;
    this.deviceMode = localStorage.getItem('mvl_device_mode') || (window.innerWidth < 768 ? 'mobile' : 'pc');
    this.notifications = this.loadNotifications();
    this.sandboxVolts = 12.0;
    this.sandboxOhms = 100;
    this.introInterval = null;
  }"""

code = code.replace(constructor_old, constructor_new)

# 2. Update init() to trigger opening animation
init_old = """  init() {
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLanguage);
    this.bindGlobalEvents();
    this.renderNavigation();
    this.navigateTo(this.currentPage);
  }"""

init_new = """  init() {
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLanguage);
    this.bindGlobalEvents();
    this.renderNavigation();
    this.navigateTo(this.currentPage);
    this.initOpeningAnimation();
  }"""

code = code.replace(init_old, init_new)

# 3. Update renderNavigation() to replace Contributors with Admin Panel & show announcement banner
nav_replace_target = """            <button onclick="window.app.navigateTo('contributors')" class="nav-btn px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition" data-nav="contributors">
              ${isHindi ? 'योगदानकर्ता' : 'Contributors'}
            </button>"""

nav_replace_with = """            <button onclick="window.app.navigateTo('admin')" class="nav-btn px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-xl transition flex items-center space-x-1.5 shadow-sm" data-nav="admin">
              <span>👑</span>
              <span>${isHindi ? 'व्यवस्थापक' : 'Admin Panel'}</span>
            </button>"""

if nav_replace_target in code:
    code = code.replace(nav_replace_target, nav_replace_with)
    print("Replaced Contributors with Admin Panel in Desktop Navigation!")
else:
    print("Could not find Contributors button in Desktop Navigation!")

# 4. Add Announcement Banner bar inside renderNavigation if set
banner_insert_target = """  renderNavigation() {
    const nav = document.getElementById('global-navbar');
    if (!nav) return;

    const isHindi = this.currentLanguage === 'hi';
    const isDark = this.currentTheme === 'dark';
    const unreadCount = this.getUnreadNotificationCount();
    const isMobile = this.deviceMode === 'mobile';

    nav.innerHTML = `"""

banner_insert_with = """  renderNavigation() {
    const nav = document.getElementById('global-navbar');
    if (!nav) return;

    const isHindi = this.currentLanguage === 'hi';
    const isDark = this.currentTheme === 'dark';
    const unreadCount = this.getUnreadNotificationCount();
    const isMobile = this.deviceMode === 'mobile';
    const sysBanner = localStorage.getItem('mvl_system_banner') || '';

    nav.innerHTML = `
      ${sysBanner ? `
        <div class="bg-gradient-to-r from-cyan-950 via-slate-900 to-amber-950 border-b border-cyan-500/30 py-1.5 px-4 text-center text-[11px] font-mono text-cyan-300 flex items-center justify-center space-x-2">
          <span>📢</span>
          <span><strong>Notice:</strong> ${sysBanner}</span>
        </div>
      ` : ''}"""

code = code.replace(banner_insert_target, banner_insert_with)

print("Saved preliminary Navigation and Constructor modifications!")
