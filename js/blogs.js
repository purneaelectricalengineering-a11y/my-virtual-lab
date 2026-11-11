/**
 * MY VIRTUAL LAB - Engineering Student & Lab Knowledge Guides
 * Technical articles, lab procedures, meter mechanics, and circuit theory insights.
 * (Author attribution removed as per project specifications - focuses purely on syllabus knowledge)
 */

class EngineeringBlogs {
  constructor() {
    this.container = null;
    this.defaultBlogs = [
      {
        id: "guide-analog-meters",
        title: "Understanding Moving Coil Meters & Reading Mirror Scales Accurately",
        category: "Laboratory Skills",
        date: "November 2026",
        readTime: "5 min read",
        summary: "Why precision laboratory meters feature a mirror strip behind the needle, how parallax error occurs, and the mechanical physics of eddy-current damping coils.",
        content: `
### The Mechanics of PMMC (Permanent Magnet Moving Coil) Instruments
Permanent Magnet Moving Coil (PMMC) instruments are among the most accurate and widely used analog meters in electrical engineering laboratories.

#### 1. Why is there an anti-parallax mirror under the meter scale?
When an engineer looks at the pointer from an angle, an optical parallax error is introduced — the pointer appears displaced relative to the scale division.
- **The Correct Technique**: Look directly perpendicular to the glass face so that the pointer completely occludes its own mirror reflection. Only when the needle and its reflection overlap are you reading the true, undistorted measurement.

#### 2. Damping Physics & Hairspring Motion
When current flows through the moving coil, electromagnetic torque deflects the needle against a phosphor-bronze hairspring restoring torque. To prevent the pointer from oscillating back and forth across the dial, eddy-current damping is provided by winding the coil on an aluminum former. This gives the characteristic slight mechanical bounce before settling.

#### 3. Critical Laboratory Precautions
- **Never connect a current meter across a voltage source**: Ammeters have an internal resistance close to zero. Parallel connection creates a dead short circuit across the voltage terminals, immediately blowing the internal protection fuse or burning the coil.
- **Always observe polarity**: Reversing (+) and (-) forces the needle backward against the mechanical zero stop pin, which can bend the delicate aluminum pointer.
        `
      },
      {
        id: "mptt-in-power-grids",
        title: "Why High-Voltage Power Grids Do Not Operate at Maximum Power Transfer",
        category: "Circuit Theory",
        date: "October 2026",
        readTime: "4 min read",
        summary: "Exploring the fundamental trade-off between power transfer and transmission efficiency: why communication systems maximize power while electric power utilities prioritize efficiency.",
        content: `
### Maximum Power Transfer vs. Energy Efficiency
The Maximum Power Transfer Theorem states that maximum power is delivered from a linear source to a resistive load when the load resistance equals the internal Thevenin resistance ($R_L = R_{th}$). At this exact condition, half the total generated power is consumed inside the source internal resistance, and the other half reaches the load:

$$\\text{Efficiency} = \\frac{P_L}{P_{\\text{total}}} = \\frac{I^2 R_L}{I^2 (R_{th} + R_L)} = \\frac{R_L}{2 R_L} = 50\\%$$

#### The Power Utility Perspective
In power utility grids (carrying gigawatts across hundreds of kilometers), operating at 50% efficiency would be catastrophic:
1. 50% of all generated electricity would turn into wasteful, dangerous heat inside generator windings and transmission lines.
2. Huge voltage drops across transmission lines would destabilize the grid.
3. Rapid thermal destruction of substation transformer insulation.

Therefore, power transmission networks operate with the lowest possible source and line resistance ($R_{th} \\ll R_L$) to achieve **95% to 98% transmission efficiency**.

#### Where is MPTT Actually Applied?
MPTT is indispensable in **telecommunications, audio electronics, RF antenna design, and transducer matching**, where signal power is minute (microvolts or milliwatts) and maximizing signal-to-noise ratio is vastly more critical than saving energy.
        `
      },
      {
        id: "ece-modules-preview",
        title: "Two-Port Parameters in Communication & High-Frequency RF Circuits",
        category: "Network Analysis",
        date: "November 2026",
        readTime: "6 min read",
        summary: "A practical guide to Z, Y, H, and ABCD parameters: how transistors are modeled as two-port networks and why cascade matrices simplify multistage amplifiers.",
        content: `
### Why Two-Port Networks Matter in Electrical Engineering
Rather than analyzing every individual semiconductor junction inside a complex circuit, engineers model the overall system as a "black box" having an input port and an output port.

#### 1. Hybrid (H) Parameters in Transistor Modeling
The H-parameters are especially suited for BJT (Bipolar Junction Transistor) small-signal models because input impedance ($h_{ie}$) is low and output admittance ($h_{oe}$) is high.
- $h_{11}$ represents short-circuit input impedance.
- $h_{21}$ represents forward current gain ($\\beta$).

#### 2. Cascade Connections (ABCD Parameters)
When multiple filter or amplifier stages are connected in cascade, the overall transmission matrix $[T]$ is simply the matrix product of individual stage matrices:
$$[T_{\\text{total}}] = [T_1] \\times [T_2] \\times \\dots \\times [T_n]$$

This modular formulation makes two-port network theory an essential cornerstone of both electrical circuit analysis and upcoming electronics laboratory modules.
        `
      }
    ];
  }

  loadCustomBlogs() {
    try {
      const stored = localStorage.getItem('mvl_custom_blogs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomBlog(article) {
    const list = this.loadCustomBlogs();
    list.unshift(article);
    try {
      localStorage.setItem('mvl_custom_blogs', JSON.stringify(list));
    } catch (e) {}
  }

  deleteCustomBlog(id) {
    let list = this.loadCustomBlogs();
    list = list.filter(b => b.id !== id);
    try {
      localStorage.setItem('mvl_custom_blogs', JSON.stringify(list));
    } catch (e) {}
    this.render();
  }

  getAllBlogs() {
    const custom = this.loadCustomBlogs();
    return [...custom, ...this.defaultBlogs];
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  render(container = null) {
    if (container) this.container = container;
    if (!this.container) return;

    const blogs = this.getAllBlogs();

    this.container.innerHTML = `
      <div class="space-y-8 py-6">
        
        <!-- Header with Authoring Action -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-700/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <span>📚</span>
              <span>ENGINEERING LAB INSIGHTS & SYLLABUS GUIDES</span>
            </div>
            <h2 class="text-2xl font-bold font-heading text-white">
              Engineering Articles & Lab Guides
            </h2>
            <p class="text-xs text-slate-400 mt-1 max-w-2xl">
              Curriculum guides on meter calibration, circuit derivations, practical lab safety protocols, and theoretical derivations.
            </p>
          </div>

          <!-- Write Article Button -->
          <button onclick="window.engineeringBlogs.openWriteArticleModal()" class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 flex-shrink-0">
            <span>✍️</span>
            <span>Publish New Article</span>
          </button>
        </div>

        <!-- Blog Cards Grid (NO AUTHOR DISPLAYED) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${blogs.map(blog => `
            <div class="glass-card rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">
                    ${blog.category}
                  </span>
                  <span class="text-slate-500 font-mono text-[11px]">${blog.readTime || '4 min read'}</span>
                </div>

                <h3 class="text-base font-bold font-heading text-white group-hover:text-cyan-400 transition mb-2 leading-snug">
                  ${blog.title}
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed mb-4">
                  ${blog.summary}
                </p>
              </div>

              <!-- Footer (Date & Read Action - NO AUTHOR) -->
              <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div class="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                  <span>📅</span>
                  <span>${blog.date}</span>
                </div>
                <button onclick="window.engineeringBlogs.readArticle('${blog.id}')" class="px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 font-medium transition flex items-center space-x-1">
                  <span>Read Guide</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>

      <div id="blog-reader-modal-slot"></div>
      <div id="blog-writer-modal-slot"></div>
    `;
  }

  openWriteArticleModal() {
    const slot = document.getElementById('blog-writer-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div class="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-y-auto text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>✍️</span>
              <span>Publish Laboratory Guide Article</span>
            </h3>
            <button onclick="document.getElementById('blog-writer-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1 text-sm">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Article Category:</label>
              <select id="post-category" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:border-cyan-400 focus:outline-none">
                <option value="Laboratory Skills">Laboratory Skills & Meter Calibration</option>
                <option value="Circuit Theory">Circuit Theory & Theorems</option>
                <option value="Network Analysis">Network Analysis & Two-Port Parameters</option>
                <option value="Hardware Twin Physics">Hardware Digital Twin Physics</option>
                <option value="Safety Protocols">Safety Protocols & Fault Prevention</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Article Title:</label>
              <input type="text" id="post-title" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Practical Verification of Norton\'s Theorem in Academic Labs">
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Summary (1-2 sentences):</label>
              <input type="text" id="post-summary" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none" placeholder="A concise summary of what this guide explains...">
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1">Article Content (Markdown supported):</label>
              <textarea id="post-content" class="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 h-48 font-mono text-xs focus:border-cyan-400 focus:outline-none" placeholder="Write the technical lab guide here..."></textarea>
            </div>

            <div class="pt-3 border-t border-slate-700 flex justify-end space-x-3">
              <button onclick="document.getElementById('blog-writer-modal-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition">Cancel</button>
              <button onclick="window.engineeringBlogs.submitNewArticle()" class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition">Publish Article</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  submitNewArticle() {
    const category = document.getElementById('post-category')?.value;
    const title = document.getElementById('post-title')?.value.trim();
    const summary = document.getElementById('post-summary')?.value.trim();
    const content = document.getElementById('post-content')?.value.trim();

    if (!title || !content) {
      if (window.simulator) window.simulator.showToast('Please provide an article title and content.', 'warning');
      return;
    }

    const words = content.split(/\\s+/).length;
    const readTime = Math.max(2, Math.ceil(words / 130)) + ' min read';

    const newBlog = {
      id: 'blog-' + Date.now(),
      title,
      category,
      readTime,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      summary: summary || title,
      content
    };

    this.saveCustomBlog(newBlog);
    document.getElementById('blog-writer-modal-slot').innerHTML = '';
    this.render();

    if (window.simulator) window.simulator.showToast('✓ Article published successfully!', 'success');
  }

  readArticle(id) {
    const blogs = this.getAllBlogs();
    const b = blogs.find(item => item.id === id);
    if (!b) return;

    const slot = document.getElementById('blog-reader-modal-slot');
    if (!slot) return;

    slot.innerHTML = `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div class="glass-panel w-full max-w-3xl max-h-[90vh] rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-y-auto text-slate-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
              ${b.category}
            </span>
            <button onclick="document.getElementById('blog-reader-modal-slot').innerHTML=''" class="text-slate-400 hover:text-white p-1 text-base">✕</button>
          </div>

          <h2 class="text-xl md:text-2xl font-bold font-heading text-white mb-2 leading-tight">
            ${b.title}
          </h2>

          <!-- Meta (NO AUTHOR - Category, Date, Read Time) -->
          <div class="flex items-center space-x-2 text-xs text-slate-400 font-mono mb-6 pb-3 border-b border-slate-800">
            <span>📅 ${b.date}</span>
            <span>•</span>
            <span class="text-cyan-400">${b.readTime || '4 min read'}</span>
          </div>

          <div class="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-body">
            ${b.content}
          </div>

          <div class="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span class="text-slate-500 font-mono">My Virtual Lab • Knowledge Resource</span>
            <button onclick="document.getElementById('blog-reader-modal-slot').innerHTML=''" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition">
              Close Guide
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.engineeringBlogs = new EngineeringBlogs();
