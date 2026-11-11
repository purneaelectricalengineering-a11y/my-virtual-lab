# update_boards.py
# Replaces Boards 2, 3, and 4 in js/simulator.js to match uploaded image digital twins:
# Board 2: 1000 x 634
# Board 3: 1015 x 634
# Board 4: 1024 x 504

with open('js/simulator.js', 'r', encoding='utf-8') as f:
    content = f.read()

thevenin_replacement = '''  getTheveninConfig() {
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

        // Thevenin Circuit (Left)
        { id: 'T_IN_p', x: 160, y: 440, color: 'r', label: 'T_IN+' },
        { id: 'T_IN_n', x: 160, y: 584, color: 'k', label: 'G' },
        { id: 'T_R1a', x: 160, y: 376, color: 'b', label: 'T_R1a' },
        { id: 'T_R1b', x: 264, y: 376, color: 'b', label: 'T_R1b' },
        { id: 'T_R2t', x: 264, y: 436, color: 'b', label: 'T_R2t' },
        { id: 'T_R2b', x: 264, y: 584, color: 'b', label: 'G' },
        { id: 'T_R3out', x: 368, y: 376, color: 'r', label: 'T_R3out' },
        { id: 'T_mA_neg', x: 448, y: 376, color: 'k', label: 'T_mA_neg' },

        // Thevenin Loads
        { id: 'T_RL1t', x: 380, y: 436, color: 'b', label: 'RL1_t' },
        { id: 'T_RL1b', x: 380, y: 584, color: 'b', label: 'G' },
        { id: 'T_RL2t', x: 448, y: 436, color: 'b', label: 'RL2_t' },
        { id: 'T_RL2b', x: 448, y: 584, color: 'b', label: 'G' },
        { id: 'T_RL3t', x: 516, y: 436, color: 'b', label: 'RL3_t' },
        { id: 'T_RL3b', x: 516, y: 584, color: 'b', label: 'G' },

        // Norton Circuit (Right)
        { id: 'N_IN_p', x: 596, y: 440, color: 'r', label: 'N_IN+' },
        { id: 'N_IN_n', x: 596, y: 584, color: 'k', label: 'GN' },
        { id: 'N_R1a', x: 596, y: 376, color: 'b', label: 'N_R1a' },
        { id: 'N_R1b', x: 696, y: 376, color: 'b', label: 'N_R1b' },
        { id: 'N_R2t', x: 696, y: 436, color: 'b', label: 'N_R2t' },
        { id: 'N_R2b', x: 696, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R4t', x: 760, y: 436, color: 'b', label: 'N_R4t' },
        { id: 'N_R4b', x: 760, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R3out', x: 800, y: 376, color: 'r', label: 'N_R3out' },
        { id: 'N_mA_neg', x: 876, y: 376, color: 'k', label: 'N_mA_neg' },

        // Norton Loads
        { id: 'N_RL1t', x: 812, y: 436, color: 'b', label: 'N_RL1_t' },
        { id: 'N_RL1b', x: 812, y: 584, color: 'b', label: 'GN' },
        { id: 'N_RL2t', x: 880, y: 436, color: 'b', label: 'N_RL2_t' },
        { id: 'N_RL2b', x: 880, y: 584, color: 'b', label: 'GN' },
        { id: 'N_RL3t', x: 948, y: 436, color: 'b', label: 'N_RL3_t' },
        { id: 'N_RL3b', x: 948, y: 584, color: 'b', label: 'GN' }
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
  }'''

mptt_replacement = '''  getMaxPowerConfig() {
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
  }'''

two_port_replacement = '''  getTwoPortConfig() {
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

        // NETWORK-1 (T-Network)
        { id: 'N1_IN_p', x: 348, y: 298, color: 'r', label: 'N1_IN+' },
        { id: 'N1_Ta', x: 396, y: 298, color: 'b', label: 'N1_Ta' },
        { id: 'N1_Tc', x: 524, y: 298, color: 'b', label: 'N1_Tc' },
        { id: 'N1_OUT_p', x: 572, y: 298, color: 'r', label: 'N1_OUT+' },

        { id: 'N1_IN_n', x: 348, y: 468, color: 'k', label: 'N1_IN-' },
        { id: 'N1_Ga', x: 460, y: 468, color: 'b', label: 'N1_Ga' },
        { id: 'N1_OUT_n', x: 572, y: 468, color: 'k', label: 'N1_OUT-' },

        // NETWORK-2 (Identical T-Network)
        { id: 'N2_IN_p', x: 636, y: 298, color: 'r', label: 'N2_IN+' },
        { id: 'N2_Ta', x: 676, y: 298, color: 'b', label: 'N2_Ta' },
        { id: 'N2_Tc', x: 808, y: 298, color: 'b', label: 'N2_Tc' },
        { id: 'N2_OUT_p', x: 852, y: 298, color: 'r', label: 'N2_OUT+' },

        { id: 'N2_IN_n', x: 636, y: 468, color: 'k', label: 'N2_IN-' },
        { id: 'N2_Ga', x: 742, y: 468, color: 'b', label: 'N2_Ga' },
        { id: 'N2_OUT_n', x: 852, y: 468, color: 'k', label: 'N2_OUT-' }
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
        <path d="M 348 298 H 396" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 396 298 H 410 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 460 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 524" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="424" y="286" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="495" y="286" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) -->
        <path d="M 460 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="475" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N1_OUT_p -->
        <path d="M 524 298 H 572" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-1 -->
        <path d="M 348 468 H 572" stroke="#111827" stroke-width="2.2" fill="none" />

        <text x="365" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">INPUT</text>
        <text x="550" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">OUTPUT</text>
        <text x="460" y="492" text-anchor="middle" font-size="11" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">NETWORK-1</text>

        <!-- ================= LOWER RIGHT: NETWORK-2 (IDENTICAL T-NETWORK) ================= -->
        <path d="M 636 298 H 676" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 676 298 H 692 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 742 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 808" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="704" y="286" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="775" y="286" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) -->
        <path d="M 742 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="756" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N2_OUT_p -->
        <path d="M 808 298 H 852" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-2 -->
        <path d="M 636 468 H 852" stroke="#111827" stroke-width="2.2" fill="none" />

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
  }'''

# Locate and replace getTheveninConfig and renderTheveninSvg
idx1 = content.find('  getTheveninConfig() {')
idx2 = content.find('  toggleTheveninVoltRange() {')
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + thevenin_replacement + '\n\n' + content[idx2:]
    print('Replaced Thevenin & Norton section successfully.')
else:
    print('Failed to locate Thevenin section:', idx1, idx2)

# Locate and replace getMaxPowerConfig and renderMaxPowerSvg
idx3 = content.find('  getMaxPowerConfig() {')
idx4 = content.find('  /* =========================================================================\n     BOARD 4:')
if idx3 != -1 and idx4 != -1:
    content = content[:idx3] + mptt_replacement + '\n\n' + content[idx4:]
    print('Replaced MPTT section successfully.')
else:
    print('Failed to locate MPTT section:', idx3, idx4)

# Locate and replace getTwoPortConfig and renderTwoPortSvg
idx5 = content.find('  getTwoPortConfig() {')
idx6 = content.find('  toggleTwoPortVoltRange() {')
if idx5 != -1 and idx6 != -1:
    content = content[:idx5] + two_port_replacement + '\n\n' + content[idx6:]
    print('Replaced TwoPort section successfully.')
else:
    print('Failed to locate TwoPort section:', idx5, idx6)

with open('js/simulator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated js/simulator.js successfully!')
