# scratch/fix_nodes_exact.py
import re

with open('js/simulator.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Thevenin Config
thevenin_old = """      sockets: [
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
      ]"""

thevenin_new = """      sockets: [
        // 12V DC Supply Output at left
        { id: 'S12P', x: 80, y: 440, color: 'r', label: '12V+' },
        { id: 'S12N', x: 80, y: 520, color: 'k', label: '12V-' },

        // Meters Sockets directly below MO-65 meters
        { id: 'v1n', x: 268, y: 296, color: 'k', label: 'V-' },
        { id: 'v1p', x: 392, y: 296, color: 'r', label: 'V+' },

        { id: 'a1n', x: 695, y: 296, color: 'k', label: 'mA-' },
        { id: 'a1p', x: 816, y: 296, color: 'r', label: 'mA+' },

        // Thevenin Circuit (Left) - Exactly matching Image 1
        { id: 'T_IN_p', x: 160, y: 440, color: 'r', label: 'T_IN+' },
        { id: 'T_IN_n', x: 160, y: 584, color: 'k', label: 'G' },
        { id: 'T_R1a', x: 160, y: 376, color: 'b', label: 'T_R1a' },
        { id: 'T_R1b', x: 264, y: 376, color: 'b', label: 'T_R1b' },
        { id: 'T_R2t', x: 264, y: 436, color: 'b', label: 'T_R2t' },
        { id: 'T_R2b', x: 264, y: 584, color: 'b', label: 'G' },
        { id: 'T_R3out', x: 368, y: 376, color: 'r', label: 'T_R3out' },
        { id: 'T_mA_neg', x: 448, y: 376, color: 'k', label: 'T_mA_neg' },

        // Thevenin Loads (RL1, RL2, RL3 top, exactly ONE return socket on bottom rail)
        { id: 'T_RL1t', x: 380, y: 436, color: 'b', label: 'RL1_t' },
        { id: 'T_RL2t', x: 448, y: 436, color: 'b', label: 'RL2_t' },
        { id: 'T_RL3t', x: 516, y: 436, color: 'b', label: 'RL3_t' },
        { id: 'T_RL_b', x: 448, y: 584, color: 'b', label: 'G' },

        // Norton Circuit (Right) - Exactly matching Image 1
        { id: 'N_IN_p', x: 596, y: 440, color: 'r', label: 'N_IN+' },
        { id: 'N_IN_n', x: 596, y: 584, color: 'k', label: 'GN' },
        { id: 'N_R1a', x: 596, y: 376, color: 'b', label: 'N_R1a' },
        { id: 'N_R1b', x: 696, y: 376, color: 'b', label: 'N_R1b' },
        { id: 'N_R2t', x: 680, y: 436, color: 'b', label: 'N_R2t' },
        { id: 'N_R2b', x: 680, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R4t', x: 760, y: 436, color: 'b', label: 'N_R4t' },
        { id: 'N_R4b', x: 760, y: 584, color: 'b', label: 'GN' },
        { id: 'N_R3out', x: 800, y: 376, color: 'r', label: 'N_R3out' },
        { id: 'N_mA_neg', x: 876, y: 376, color: 'k', label: 'N_mA_neg' },

        // Norton Loads (Top only, bottom connects to return bus)
        { id: 'N_RL1t', x: 812, y: 436, color: 'b', label: 'N_RL1_t' },
        { id: 'N_RL2t', x: 880, y: 436, color: 'b', label: 'N_RL2_t' },
        { id: 'N_RL3t', x: 948, y: 436, color: 'b', label: 'N_RL3_t' }
      ]"""

if thevenin_old in code:
    code = code.replace(thevenin_old, thevenin_new)
    print("Updated Thevenin/Norton sockets successfully!")
else:
    print("Could not match Thevenin/Norton sockets block!")

# 2. Update Two-Port Z&H Config
twoport_old = """        // NETWORK-1 (T-Network)
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
        { id: 'N2_OUT_n', x: 852, y: 468, color: 'k', label: 'N2_OUT-' }"""

twoport_new = """        // NETWORK-1 (T-Network) - Exactly 8 sockets matching Image 2
        { id: 'N1_IN_p', x: 350, y: 298, color: 'r', label: 'N1_IN+' },
        { id: 'N1_Ta', x: 390, y: 298, color: 'b', label: 'N1_Ta' },
        { id: 'N1_Tc', x: 530, y: 298, color: 'b', label: 'N1_Tc' },
        { id: 'N1_OUT_p', x: 570, y: 298, color: 'r', label: 'N1_OUT+' },

        { id: 'N1_IN_n', x: 350, y: 468, color: 'k', label: 'N1_IN-' },
        { id: 'N1_Ga', x: 390, y: 468, color: 'b', label: 'N1_Ga' },
        { id: 'N1_Gc', x: 530, y: 468, color: 'b', label: 'N1_Gc' },
        { id: 'N1_OUT_n', x: 570, y: 468, color: 'k', label: 'N1_OUT-' },

        // NETWORK-2 (Identical T-Network) - Exactly 8 sockets matching Image 2
        { id: 'N2_IN_p', x: 635, y: 298, color: 'r', label: 'N2_IN+' },
        { id: 'N2_Ta', x: 675, y: 298, color: 'b', label: 'N2_Ta' },
        { id: 'N2_Tc', x: 810, y: 298, color: 'b', label: 'N2_Tc' },
        { id: 'N2_OUT_p', x: 850, y: 298, color: 'r', label: 'N2_OUT+' },

        { id: 'N2_IN_n', x: 635, y: 468, color: 'k', label: 'N2_IN-' },
        { id: 'N2_Ga', x: 675, y: 468, color: 'b', label: 'N2_Ga' },
        { id: 'N2_Gc', x: 810, y: 468, color: 'b', label: 'N2_Gc' },
        { id: 'N2_OUT_n', x: 850, y: 468, color: 'k', label: 'N2_OUT-' }"""

if twoport_old in code:
    code = code.replace(twoport_old, twoport_new)
    print("Updated Two-Port sockets successfully!")
else:
    print("Could not match Two-Port sockets block!")

# 3. Update Two-Port SVG rendering lines so resistors and text align to new sockets
twoport_svg_old = """        <!-- ================= LOWER CENTER: NETWORK-1 (T-NETWORK) ================= -->
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
        <path d="M 636 468 H 852" stroke="#111827" stroke-width="2.2" fill="none" />"""

twoport_svg_new = """        <!-- ================= LOWER CENTER: NETWORK-1 (T-NETWORK) ================= -->
        <path d="M 350 298 H 390" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 390 298 H 408 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 460 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 530" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="424" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="495" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) - connects to line, NO socket at bottom -->
        <path d="M 460 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <circle cx="460" cy="468" r="3" fill="#111827" />
        <text x="476" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N1_OUT_p -->
        <path d="M 530 298 H 570" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-1 with Blue nodes at 390 and 530 -->
        <path d="M 350 468 H 570" stroke="#111827" stroke-width="2.2" fill="none" />

        <text x="365" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">INPUT</text>
        <text x="550" y="388" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">OUTPUT</text>
        <text x="460" y="492" text-anchor="middle" font-size="11" font-family="'Space Grotesk', sans-serif" font-weight="bold" fill="#111827">NETWORK-1</text>

        <!-- ================= LOWER RIGHT: NETWORK-2 (IDENTICAL T-NETWORK) ================= -->
        <path d="M 635 298 H 675" stroke="#111827" stroke-width="2.2" fill="none" />
        <!-- Series Resistors (1KΩ and 1KΩ) -->
        <path d="M 675 298 H 692 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 742 l 5 -7 l 8 14 l 8 -14 l 8 14 l 5 -7 H 810" stroke="#111827" stroke-width="2.2" fill="none" />
        <text x="704" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>
        <text x="775" y="284" text-anchor="middle" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Shunt 1KΩ Resistor (Vertical) - connects to line, NO socket at bottom -->
        <path d="M 742 298 V 355 l -7 5 l 14 8 l -14 8 l 14 8 l -7 5 V 468" stroke="#111827" stroke-width="2.2" fill="none" />
        <circle cx="742" cy="468" r="3" fill="#111827" />
        <text x="758" y="390" text-anchor="start" font-size="9" font-family="monospace" font-weight="bold" fill="#111827">1KΩ</text>

        <!-- Output wire to N2_OUT_p -->
        <path d="M 810 298 H 850" stroke="#111827" stroke-width="2.2" fill="none" />

        <!-- Bottom ground line for Network-2 with Blue nodes at 675 and 810 -->
        <path d="M 635 468 H 850" stroke="#111827" stroke-width="2.2" fill="none" />"""

if twoport_svg_old in code:
    code = code.replace(twoport_svg_old, twoport_svg_new)
    print("Updated Two-Port SVG layout successfully!")
else:
    print("Could not match Two-Port SVG block!")

with open('js/simulator.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved updated js/simulator.js")
