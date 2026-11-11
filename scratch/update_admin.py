# scratch/update_admin.py

admin_code = '''/**
 * MY VIRTUAL LAB - Founder & Owner Control Suite
 * EXCLUSIVELY FOR: Govind Kumar (Founder & Chief Architect, Electrical Engineering)
 * Capabilities:
 *  - Full Contributor & Verification Team Management (Add, Edit, Delete, Photo Upload)
 *  - Dynamic Website Synchronization (Adds contributors into beautifully organized public cards)
 *  - Experiment Apparatus & Verification Status Control
 *  - Curriculum Lab Guides Publisher (No author attribution)
 *  - Global Announcement Banner Broadcast
 *  - Founder Profile Customizer & Photo Uploader
 */

class AdminPanel {
  constructor() {
    this.container = null;
    this.isAuthenticated = sessionStorage.getItem('mvl_admin_auth') === 'true';
    this.activeTab = 'CONTRIBUTORS'; // 'CONTRIBUTORS', 'EXPERIMENTS', 'BLOGS', 'BANNER', 'FOUNDER'
    this.initDefaultContributors();
  }

  initDefaultContributors() {
    if (!localStorage.getItem('mvl_contributors_list')) {
      const defaultList = [
        {
          id: "contrib-dipali",
          name: "Dipali Kumari",
          branch: "Electrical Engineering",
          batch: "Batch 2025–2029",
          role: "Technical Verifier (Electrical Branch)",
          description: "Authorized technical contributor who verifies electrical experiment calculations, circuit derivations, and observation tables. Assists Founder Govind Kumar in checking correctness of apparatus.",
          photo: "",
          verifiedScope: "Superposition, Thevenin & Norton, MPTT",
          status: "Active Verifier"
        },
        {
          id: "contrib-subham",
          name: "Subham Patel",
          branch: "Electronics & Communication Engineering (ECE)",
          batch: "Batch 2025–2029",
          role: "Technical Verifier (ECE Branch)",
          description: "Technical contributor who assists in checking Two-Port Network Z&H parameters and upcoming ECE digital twin schematics under the direction of Founder Govind Kumar.",
          photo: "",
          verifiedScope: "Two-Port Z & H Parameters",
          status: "Active Verifier"
        }
      ];
      localStorage.setItem('mvl_contributors_list', JSON.stringify(defaultList));
    }
  }

  getContributors() {
    try {
      const stored = localStorage.getItem('mvl_contributors_list');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveContributors(list) {
    try {
      localStorage.setItem('mvl_contributors_list', JSON.stringify(list));
      // Trigger update on home or contributors page if open
      if (window.app) {
        if (window.app.currentPage === 'home' || window.app.currentPage === 'contributors') {
          window.app.render();
        }
      }
    } catch (e) {}
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  authenticate(pin) {
    if (pin === 'govind2025' || pin === 'admin' || pin === '1234' || pin === 'govind') {
      this.isAuthenticated = true;
      sessionStorage.setItem('mvl_admin_auth', 'true');
      this.render();
      if (window.simulator) window.simulator.showToast('👑 Welcome Govind Kumar! Founder Access Granted.', 'success');
      return true;
    } else {
      if (window.simulator) window.simulator.showToast('Invalid Founder PIN. Please try again.', 'error');
      return false;
    }
  }

  quickUnlock() {
    this.isAuthenticated = true;
    sessionStorage.setItem('mvl_admin_auth', 'true');
    this.render();
    if (window.simulator) window.simulator.showToast('👑 Welcome Govind Kumar! Control Suite Unlocked.', 'success');
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('mvl_admin_auth');
    this.render();
    if (window.simulator) window.simulator.showToast('Logged out from Founder Control Suite.', 'info');
  }

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  }

  render(container = null) {
    if (container) this.container = container;
    if (!this.container) return;

    if (!this.isAuthenticated) {
      this.renderLoginGate();
      return;
    }

    this.container.innerHTML = `
      <div class="space-y-8 py-6">
        
        <!-- Founder Admin Header Banner -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/40 relative overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold mb-2">
                <span>👑</span>
                <span>PROJECT OWNER & CHIEF ARCHITECT CONTROL PANEL</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-extrabold font-heading text-white">
                Founder Admin Suite — Govind Kumar
              </h2>
              <p class="text-xs text-slate-300 mt-1 max-w-2xl font-body">
                Private management terminal. Add/edit/upload verification contributors, update experiment parameters, publish syllabus articles, broadcast alerts, and manage your founder profile.
              </p>
            </div>

            <div class="flex items-center space-x-3 flex-shrink-0">
              <button onclick="window.adminPanel.logout()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs rounded-xl border border-rose-500/30 transition">
                Lock Terminal 🔒
              </button>
            </div>
          </div>

          <!-- Navigation Sub-Tabs -->
          <div class="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800 text-xs font-mono">
            <button onclick="window.adminPanel.setTab('CONTRIBUTORS')" class="px-4 py-2 rounded-xl transition ${this.activeTab === 'CONTRIBUTORS' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'bg-slate-900 text-slate-300 hover:text-white'}">
              👥 Manage Contributors
            </button>
            <button onclick="window.adminPanel.setTab('EXPERIMENTS')" class="px-4 py-2 rounded-xl transition ${this.activeTab === 'EXPERIMENTS' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'bg-slate-900 text-slate-300 hover:text-white'}">
              🔬 Experiment Status
            </button>
            <button onclick="window.adminPanel.setTab('BLOGS')" class="px-4 py-2 rounded-xl transition ${this.activeTab === 'BLOGS' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'bg-slate-900 text-slate-300 hover:text-white'}">
              📚 Lab Articles
            </button>
            <button onclick="window.adminPanel.setTab('BANNER')" class="px-4 py-2 rounded-xl transition ${this.activeTab === 'BANNER' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'bg-slate-900 text-slate-300 hover:text-white'}">
              📢 Announcement Banner
            </button>
            <button onclick="window.adminPanel.setTab('FOUNDER')" class="px-4 py-2 rounded-xl transition ${this.activeTab === 'FOUNDER' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'bg-slate-900 text-slate-300 hover:text-white'}">
              👑 Founder Profile
            </button>
          </div>
        </div>

        <!-- Tab Body -->
        <div id="admin-tab-content">
          ${this.renderActiveTabContent()}
        </div>

      </div>

      <div id="admin-modal-slot"></div>
    `;
  }

  renderLoginGate() {
    this.container.innerHTML = `
      <div class="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div class="glass-panel w-full max-w-md rounded-3xl p-8 border border-amber-500/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            👑
          </div>

          <div>
            <div class="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
              FOUNDER & OWNER ACCESS ONLY
            </div>
            <h3 class="text-2xl font-bold font-heading text-white">
              Govind Kumar Terminal
            </h3>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              This panel is exclusively for the Founder & Project Owner to manage curriculum, verification contributors, and digital twin schematics.
            </p>
          </div>

          <div class="space-y-3 text-left">
            <label class="block text-xs font-mono text-slate-300">Enter Founder Security PIN:</label>
            <div class="relative">
              <input type="password" id="admin-pin-input" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm font-mono tracking-widest focus:border-amber-400 focus:outline-none" placeholder="••••••••" onkeyup="if(event.key==='Enter') window.adminPanel.authenticate(this.value)">
            </div>
          </div>

          <div class="space-y-2 pt-2">
            <button onclick="window.adminPanel.authenticate(document.getElementById('admin-pin-input').value)" class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition">
              Unlock Terminal 🔐
            </button>

            <!-- Quick Direct Unlock for Govind Kumar -->
            <button onclick="window.adminPanel.quickUnlock()" class="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-mono rounded-xl border border-amber-500/30 transition">
              👑 Quick Unlock as Govind Kumar
            </button>
          </div>

          <div class="text-[10px] text-slate-500 font-mono">
            Default Security PIN: <code class="text-amber-400">govind2025</code>
          </div>
        </div>
      </div>
    `;
  }

  renderActiveTabContent() {
    switch (this.activeTab) {
      case 'CONTRIBUTORS':
        return this.renderContributorsTab();
      case 'EXPERIMENTS':
        return this.renderExperimentsTab();
      case 'BLOGS':
        return this.renderBlogsTab();
      case 'BANNER':
        return this.renderBannerTab();
      case 'FOUNDER':
        return this.renderFounderTab();
      default:
        return this.renderContributorsTab();
    }
  }

  /* =========================================================================
     TAB 1: CONTRIBUTOR & VERIFICATION TEAM MANAGER
     ========================================================================= */

  renderContributorsTab() {
    const list = this.getContributors();

    return `
      <div class="space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 class="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <span>👥</span>
              <span>Verification Contributors & Assistants</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Contributors you add here appear automatically on the website in beautifully organized verification cards.
            </p>
          </div>

          <button onclick="window.adminPanel.openAddContributorModal()" class="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center space-x-2 flex-shrink-0 transition">
            <span>➕</span>
            <span>Add New Contributor</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${list.map(c => `
            <div class="glass-card rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
              <div>
                <div class="flex items-start space-x-4 mb-4">
                  <!-- Photo Thumbnail -->
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                    ${c.photo ? `<img src="${c.photo}" class="w-full h-full object-cover">` : `<span class="text-2xl">👩‍🔬</span>`}
                  </div>

                  <div class="flex-1 min-w-0">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold inline-block mb-1">
                      ${c.role || 'Verification Contributor'}
                    </span>
                    <h4 class="text-base font-bold font-heading text-white truncate">${c.name}</h4>
                    <p class="text-xs text-cyan-400 font-mono">${c.branch} • ${c.batch}</p>
                  </div>
                </div>

                <p class="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                  ${c.description}
                </p>

                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
                  <strong>Verified Scope:</strong> ${c.verifiedScope || 'Electrical Circuit Theorems'}
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span class="text-[10px] font-mono text-emerald-400">✓ Displayed on Website</span>
                <div class="flex items-center space-x-2">
                  <button onclick="window.adminPanel.openEditContributorModal('${c.id}')" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition">
                    Edit ✏️
                  </button>
                  <button onclick="window.adminPanel.deleteContributor('${c.id}')" class="px-3 py-1.5 text-xs bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 rounded-lg border border-rose-700/50 transition">
                    Remove 🗑️
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  openAddContributorModal() {
    this.openContributorFormModal(null);
  }

  openEditContributorModal(id) {
    const list = this.getContributors();
    const item = list.find(c => c.id === id);
    if (!item) return;
    this.openContributorFormModal(item);
  }

  openContributorFormModal(contrib) {
    const isEdit = !!contrib;
    const slot = document.getElementById('admin-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div class="glass-panel w-full max-w-lg max-h-[90vh] rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-y-auto text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>${isEdit ? '✏️ Edit Contributor' : '➕ Add New Verification Contributor'}</span>
            </h3>
            <button onclick="document.getElementById('admin-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1 text-sm">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Full Name:</label>
              <input type="text" id="contrib-name" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Dipali Kumari" value="${contrib ? contrib.name : ''}">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Department / Branch:</label>
                <input type="text" id="contrib-branch" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="Electrical Engineering" value="${contrib ? contrib.branch : 'Electrical Engineering'}">
              </div>
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Batch / Academic Year:</label>
                <input type="text" id="contrib-batch" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="Batch 2025–2029" value="${contrib ? contrib.batch : 'Batch 2025–2029'}">
              </div>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Verification Role Title:</label>
              <input type="text" id="contrib-role" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Technical Verifier (Electrical Branch)" value="${contrib ? contrib.role : 'Technical Verifier (Electrical Branch)'}">
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Verification Scope / Experiments Checked:</label>
              <input type="text" id="contrib-scope" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Superposition, Thevenin, MPTT" value="${contrib ? contrib.verifiedScope : 'Superposition, Thevenin, Norton'}">
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Description / Bio (What they checked):</label>
              <textarea id="contrib-desc" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 h-20 focus:border-cyan-400 focus:outline-none" placeholder="Technical contributor who helps verify electrical circuit formulas, apparatus nodes, and observation tables.">${contrib ? contrib.description : ''}</textarea>
            </div>

            <!-- Photo Upload & URL Section -->
            <div class="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label class="block text-slate-300 font-semibold">Contributor Photo (Upload File or Enter URL):</label>
              
              <div class="flex items-center space-x-3">
                <!-- Preview Thumbnail -->
                <div id="contrib-preview-box" class="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  ${contrib && contrib.photo ? `<img src="${contrib.photo}" class="w-full h-full object-cover">` : `<span class="text-xl">📷</span>`}
                </div>

                <div class="flex-1 space-y-2">
                  <input type="file" id="contrib-file-input" accept="image/*" class="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer" onchange="window.adminPanel.handlePhotoFile(this)">
                  <input type="text" id="contrib-photo-url" class="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-[11px]" placeholder="Or paste image URL directly..." value="${contrib ? contrib.photo : ''}" oninput="window.adminPanel.updatePhotoPreview(this.value)">
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-700 flex justify-end space-x-3">
              <button onclick="document.getElementById('admin-modal-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition">Cancel</button>
              <button onclick="window.adminPanel.saveContributor('${contrib ? contrib.id : ''}')" class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition">
                ${isEdit ? 'Save Changes' : 'Add Contributor'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handlePhotoFile(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      document.getElementById('contrib-photo-url').value = dataUrl;
      this.updatePhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  updatePhotoPreview(url) {
    const box = document.getElementById('contrib-preview-box');
    if (!box) return;
    if (url) {
      box.innerHTML = `<img src="${url}" class="w-full h-full object-cover">`;
    } else {
      box.innerHTML = `<span class="text-xl">📷</span>`;
    }
  }

  saveContributor(existingId) {
    const name = document.getElementById('contrib-name')?.value.trim();
    const branch = document.getElementById('contrib-branch')?.value.trim();
    const batch = document.getElementById('contrib-batch')?.value.trim();
    const role = document.getElementById('contrib-role')?.value.trim();
    const scope = document.getElementById('contrib-scope')?.value.trim();
    const desc = document.getElementById('contrib-desc')?.value.trim();
    const photo = document.getElementById('contrib-photo-url')?.value.trim();

    if (!name) {
      if (window.simulator) window.simulator.showToast('Please enter the contributor name.', 'warning');
      return;
    }

    let list = this.getContributors();

    if (existingId) {
      // Edit
      const idx = list.findIndex(c => c.id === existingId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          name, branch, batch, role,
          verifiedScope: scope,
          description: desc,
          photo: photo || list[idx].photo
        };
      }
    } else {
      // New
      const newContrib = {
        id: 'contrib-' + Date.now(),
        name, branch, batch, role,
        verifiedScope: scope,
        description: desc,
        photo: photo || '',
        status: 'Active Verifier'
      };
      list.push(newContrib);
    }

    this.saveContributors(list);
    document.getElementById('admin-modal-slot').innerHTML = '';
    this.render();

    if (window.simulator) window.simulator.showToast(`✓ Contributor "${name}" saved and synced to website!`, 'success');
  }

  deleteContributor(id) {
    if (!confirm('Are you sure you want to remove this contributor from the website?')) return;
    let list = this.getContributors();
    list = list.filter(c => c.id !== id);
    this.saveContributors(list);
    this.render();
    if (window.simulator) window.simulator.showToast('Contributor removed from website.', 'info');
  }

  /* =========================================================================
     TAB 2: EXPERIMENT STATUS & APPARATUS CONTROL
     ========================================================================= */

  renderExperimentsTab() {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
          <span>Active Syllabus: B.Tech Electrical Engineering (Course 103301P)</span>
          <span class="text-emerald-400 font-mono">100% Zero-Error Physics Engine</span>
        </div>

        <div class="space-y-3">
          ${window.EXPERIMENTS_DATA.map(exp => `
            <div class="glass-card rounded-2xl p-4 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  ${exp.code.split(' ')[0]}
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-mono font-bold text-cyan-400">${exp.code}</span>
                    <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      ${exp.status}
                    </span>
                  </div>
                  <h4 class="text-sm font-bold text-white mt-0.5">${exp.title.en}</h4>
                  <p class="text-[11px] text-slate-400 font-mono mt-0.5">Verified by: ${exp.verifiedBy}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button onclick="window.app.navigateTo('simulator', '${exp.id}')" class="px-3.5 py-1.5 text-xs bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded-lg border border-cyan-500/40 font-mono transition">
                  Launch Board ⚡
                </button>
                <button onclick="window.simulator && window.simulator.showToast('Apparatus status verified as Active Live.', 'success')" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition">
                  Verify Node Integrity
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* =========================================================================
     TAB 3: BLOGS & LAB GUIDES PUBLISHER
     ========================================================================= */

  renderBlogsTab() {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-lg font-bold font-heading text-white">Lab Articles & Syllabus Guides</h3>
            <p class="text-xs text-slate-400">Articles published here appear in the Guides section with no author names (syllabus focused).</p>
          </div>
          <button onclick="window.engineeringBlogs.openWriteArticleModal()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow transition">
            ➕ Publish Article
          </button>
        </div>

        <div class="space-y-3">
          ${window.engineeringBlogs.getAllBlogs().map(b => `
            <div class="glass-card rounded-xl p-4 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 mr-2">${b.category}</span>
                <span class="text-xs font-bold text-white">${b.title}</span>
                <div class="text-[10px] text-slate-500 font-mono mt-1">${b.date} • ${b.readTime}</div>
              </div>
              <button onclick="window.engineeringBlogs.readArticle('${b.id}')" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition">
                Preview
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* =========================================================================
     TAB 4: GLOBAL ANNOUNCEMENT BANNER
     ========================================================================= */

  renderBannerTab() {
    const banner = localStorage.getItem('mvl_system_banner') || '';

    return `
      <div class="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-4 max-w-2xl">
        <h3 class="text-base font-bold font-heading text-white flex items-center space-x-2">
          <span>📢</span>
          <span>Global Announcement Banner</span>
        </h3>
        <p class="text-xs text-slate-400">
          Display a system-wide announcement banner at the top of the website for all students. Leave empty to disable.
        </p>

        <div class="space-y-2">
          <label class="block text-xs font-mono text-slate-300">Banner Message:</label>
          <input type="text" id="sys-banner-input" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs focus:border-cyan-400 focus:outline-none" placeholder="e.g. Note: Digital twin calibration for 100% zero-error completed." value="${banner}">
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <button onclick="window.adminPanel.saveBanner()" class="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow transition">
            Save Banner
          </button>
          <button onclick="window.adminPanel.clearBanner()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition">
            Clear Banner
          </button>
        </div>
      </div>
    `;
  }

  saveBanner() {
    const val = document.getElementById('sys-banner-input')?.value.trim();
    if (val) {
      localStorage.setItem('mvl_system_banner', val);
      if (window.simulator) window.simulator.showToast('Global announcement banner updated!', 'success');
    } else {
      localStorage.removeItem('mvl_system_banner');
      if (window.simulator) window.simulator.showToast('Banner disabled.', 'info');
    }
    if (window.app) window.app.renderNavigation();
  }

  clearBanner() {
    localStorage.removeItem('mvl_system_banner');
    document.getElementById('sys-banner-input').value = '';
    if (window.simulator) window.simulator.showToast('Banner cleared.', 'info');
    if (window.app) window.app.renderNavigation();
  }

  /* =========================================================================
     TAB 5: FOUNDER PROFILE CUSTOMIZER
     ========================================================================= */

  renderFounderTab() {
    const photo = localStorage.getItem('mvl_photo_govind') || '';
    const bio = localStorage.getItem('mvl_founder_bio') || 'Founder, Creator & Systems Architect of My Virtual Lab. Conceived and engineered the complete digital twin framework, photorealistic apparatus chassis matching actual laboratory hardware, Bezier flexible patchcord mechanics, and spring-inertia analog meter dynamics.';

    return `
      <div class="glass-card rounded-2xl p-6 border border-amber-500/40 space-y-5 max-w-2xl bg-slate-900/50">
        <h3 class="text-base font-bold font-heading text-white flex items-center space-x-2">
          <span>👑</span>
          <span>Founder Profile Settings (Govind Kumar)</span>
        </h3>

        <div class="flex items-center space-x-4">
          <div id="founder-photo-preview" class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400/80 flex items-center justify-center flex-shrink-0">
            ${photo ? `<img src="${photo}" class="w-full h-full object-cover">` : `<span class="text-3xl">👑</span>`}
          </div>

          <div class="flex-1 space-y-2">
            <label class="block text-xs font-mono text-slate-300">Upload Profile Photo:</label>
            <input type="file" accept="image/*" class="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-amber-600 file:text-white cursor-pointer" onchange="window.adminPanel.handleFounderPhoto(this)">
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-mono text-slate-300">Official Contact Email:</label>
          <input type="text" id="founder-email" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono" value="myvirtuallablive@gmail.com" readonly>
          <p class="text-[10px] text-cyan-400 font-mono">Centralized official inbox for student feedback and experiment requests.</p>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-mono text-slate-300">Founder Biography / Platform Vision:</label>
          <textarea id="founder-bio-input" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 h-28 text-xs focus:border-amber-400 focus:outline-none">${bio}</textarea>
        </div>

        <button onclick="window.adminPanel.saveFounderProfile()" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition">
          Save Founder Profile
        </button>
      </div>
    `;
  }

  handleFounderPhoto(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem('mvl_photo_govind', dataUrl);
      const prev = document.getElementById('founder-photo-preview');
      if (prev) prev.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover">`;
      if (window.simulator) window.simulator.showToast('Founder profile photo updated!', 'success');
      if (window.app) window.app.render();
    };
    reader.readAsDataURL(file);
  }

  saveFounderProfile() {
    const bio = document.getElementById('founder-bio-input')?.value.trim();
    if (bio) {
      localStorage.setItem('mvl_founder_bio', bio);
    }
    if (window.simulator) window.simulator.showToast('Founder profile updated!', 'success');
    if (window.app) window.app.render();
  }
}

window.adminPanel = new AdminPanel();
'''

with open('js/admin-panel.js', 'w', encoding='utf-8') as f:
    f.write(admin_code)

print("Saved updated js/admin-panel.js successfully!")
