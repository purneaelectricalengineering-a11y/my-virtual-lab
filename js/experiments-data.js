/**
 * MY VIRTUAL LAB - Core 5 Experiments Data Store
 * Course: B.Tech (Electrical Engineering) - Course Code: 103301P
 * Electrical Circuit Analysis Lab
 * Curated & Designed by Govind Kumar (Founder & Chief Architect),
 * Verified by Dipali Kumari (Lead Verifier, Electrical) and Subham Patel (Technical Verifier, ECE).
 */

const EXPERIMENTS_DATA = [
  {
    id: "superposition-theorem",
    boardId: "board-sup",
    title: {
      en: "Verification of Superposition Theorem",
      hi: "सुपरपोज़िशन प्रमेय का सत्यापन"
    },
    branch: "Electrical Engineering",
    category: "Circuit Analysis",
    status: "Verified",
    verifiedBy: "Dipali Kumari (Lead Verifier, Electrical)",
    difficulty: "Core Experiment",
    estimatedTime: "40 mins",
    summary: {
      en: "Verify that in any linear bilateral DC network having multiple sources, the net branch current is the algebraic sum of individual currents when each source acts alone.",
      hi: "सत्यापित करें कि किसी भी रैखिक द्विपक्षीय नेटवर्क में कई स्रोतों के होने पर, प्रत्येक शाखा की कुल धारा उन सभी धाराओं का बीजगणितीय योग होती है जो प्रत्येक स्रोत द्वारा अकेले कार्य करने पर उत्पन्न होती हैं।"
    },
    aim: {
      en: "To verify Superposition Theorem experimentally using dual DC power supplies (12V and 5V) and precision resistor network (50Ω, 10Ω, 50Ω), comparing measured values with theoretical calculations.",
      hi: "दोहरी डीसी बिजली आपूर्ति (12V और 5V) और सटीक प्रतिरोधक नेटवर्क (50Ω, 10Ω, 50Ω) का उपयोग करके सुपरपोज़िशन प्रमेय को प्रयोगात्मक रूप से सत्यापित करना।"
    },
    theory: {
      en: `Superposition Theorem states that in a network of linear resistances containing more than one source of e.m.f, the current which flows at any point is the sum of all the currents which would flow at that point if each e.m.f source were considered separately and all other e.m.f sources replaced for the time being by resistances equal to their internal resistances (short-circuited for ideal voltage sources).
      
      Circuit Parameters:
      • R1 = 50 Ω, R2 = 10 Ω, R3 = 50 Ω
      • Source 1: V1 = 12 V DC Regulated
      • Source 2: V2 = 5 V DC Regulated
      
      Case 1: When 12V source acts alone (5V deactivated/shorted):
      Total Resistance: RT = R1 + (R2 || R3) = 50 + (10 * 50 / 60) = 58.33 Ω
      Total current I1 = 12V / 58.33Ω = 205.7 mA
      Current through R3: I3 = 205.7 * 10 / 60 = 34.2 mA
      Current through R2: I2 = I1 - I3 = 171.4 mA
      
      Case 2: When 5V source acts alone (12V deactivated/shorted):
      Total Resistance: RT' = R3 + (R1 || R2) = 50 + (50 * 10 / 60) = 58.33 Ω
      Total current I'3 = 5V / 58.33Ω = 85.7 mA
      Current through R1: I'1 = 85.7 * 10 / 60 = 14.3 mA
      Current through R2: I'2 = 85.7 - 14.3 = 71.4 mA
      
      Case 3: When BOTH 12V and 5V sources act simultaneously:
      Net I1 = I1 - I'1 = 205.7 - 14.3 = 191.4 mA
      Net I2 = I2 + I'2 = 171.4 + 71.4 = 242.8 mA ≈ 242.9 mA
      Net I3 = I'3 - I3 = 85.7 - 34.2 = 51.5 mA`,
      hi: `सुपरपोज़िशन प्रमेय के अनुसार: किसी भी रैखिक परिपथ में जिसमें एक से अधिक वोल्टेज स्रोत उपस्थित हों, किसी भी शाखा में प्रवाहित होने वाली धारा प्रत्येक वोल्टेज स्रोत द्वारा अकेले सक्रिय होने पर उत्पन्न धाराओं का बीजगणितीय योग होती है।`
    },
    procedure: [
      {
        step: 1,
        title: "Setup and Terminal Check",
        desc: "Ensure main power is in OFF position. Connect patchcords carefully. Milliammeters must always be connected strictly in SERIES with the measured branch."
      },
      {
        step: 2,
        title: "Case A: 12V Active Only",
        desc: "Connect 12V DC positive to R1 input. Short the 5V terminal sockets. Connect the milliammeter in series with branch 1, 2, and 3 one by one to record I1, I2, and I3."
      },
      {
        step: 3,
        title: "Case B: 5V Active Only",
        desc: "Short the 12V supply terminals. Connect 5V DC supply to R3 input. Measure branch currents I'1, I'2, and I'3 using the current meter."
      },
      {
        step: 4,
        title: "Case C: Both Sources Active Simultaneously",
        desc: "Connect 12V to branch 1 and 5V to branch 3 simultaneously. Measure net currents I1_net, I2_net, and I3_net. Compare with algebraic sum."
      }
    ],
    instruments: [
      { name: "Dual DC Regulated Power Supply", spec: "12V and 5V DC fixed regulated outputs" },
      { name: "DC Milliammeters", spec: "0 - 250 mA precision moving coil meters" },
      { name: "Precision Resistor Network", spec: "R1=50Ω, R2=10Ω, R3=50Ω" },
      { name: "Connecting Patchcords", spec: "Standard 4mm banana plug cables" }
    ],
    vivaQuestions: [
      {
        q: "What is the primary condition for Superposition Theorem to hold true?",
        options: [
          "Circuit must be linear and bilateral",
          "Circuit must contain AC sources only",
          "Circuit must be non-linear",
          "Applicable only to digital circuits"
        ],
        answer: 0,
        explanation: "Superposition theorem applies only to linear, bilateral networks where response is proportional to excitation."
      },
      {
        q: "How should an independent ideal voltage source be replaced when calculating individual contribution?",
        options: [
          "Replaced by an open circuit",
          "Replaced by a short circuit (zero internal resistance)",
          "Replaced by a 100 kΩ resistor",
          "Replaced by an inductor"
        ],
        answer: 1,
        explanation: "An ideal voltage source has zero internal resistance, hence it is deactivated by replacing it with a short circuit."
      },
      {
        q: "Can Superposition Theorem be directly applied for calculating power in a branch?",
        options: [
          "Yes, direct summation of powers works",
          "No, because power is a non-linear function (P = I²R)",
          "Yes, only for DC circuits",
          "Yes, only for resistor values below 50Ω"
        ],
        answer: 1,
        explanation: "Power is proportional to current squared (I²R), which is a non-linear relationship. Superposition applies directly only to voltages and currents."
      }
    ]
  },
  {
    id: "thevenin-norton-theorem",
    boardId: "board-tn",
    title: {
      en: "Verification of Thevenin & Norton Theorem",
      hi: "थेवेनिन एवं नॉर्टन प्रमेय का सत्यापन"
    },
    branch: "Electrical Engineering",
    category: "Circuit Analysis",
    status: "Verified",
    verifiedBy: "Dipali Kumari (Lead Verifier, Electrical)",
    difficulty: "Core Experiment",
    estimatedTime: "45 mins",
    summary: {
      en: "Represent any complex linear two-terminal active DC network by an equivalent Thevenin voltage source with series resistance, and Norton current source with parallel resistance.",
      hi: "किसी भी जटिल रैखिक दो-टर्मिनल सक्रिय नेटवर्क को समतुल्य थेवेनिन वोल्टेज स्रोत और श्रेणी प्रतिरोध, तथा नॉर्टन धारा स्रोत और समानांतर प्रतिरोध में परिवर्तित कर सत्यापित करना।"
    },
    aim: {
      en: "To verify Thevenin's and Norton's theorem experimentally and measure load currents for RL = 25Ω, 50Ω, and 100Ω.",
      hi: "थेवेनिन एवं नॉर्टन प्रमेय का प्रयोगात्मक सत्यापन करना तथा RL = 25Ω, 50Ω, 100Ω के लिए लोड धाराओं का मापन करना।"
    },
    theory: {
      en: `Thevenin's Theorem states that any linear active bilateral network with output terminals can be replaced by an equivalent circuit consisting of an open circuit voltage source Vth in series with an internal resistance Rth.
      
      Circuit Parameters (Thevenin Section):
      • Supply: V = 12 V DC
      • R1 = 500 Ω, R2 = 100 Ω, R3 = 90 Ω
      • Open Circuit Voltage Vth:
        Vth = V * R2 / (R1 + R2) = 12V * 100 / (500 + 100) = 1200 / 600 = 2.0 V
      • Thevenin Resistance Rth looking into output terminals:
        Rth = (R1 || R2) + R3 = (500 * 100 / 600) + 90 = 83.33 + 90 = 173.33 Ω
        
      Load Currents (IL = Vth / (Rth + RL)):
      • RL = 25 Ω:  IL = 2.0 / (173.33 + 25) = 2.0 / 198.33 = 10.08 mA ≈ 10.1 mA
      • RL = 50 Ω:  IL = 2.0 / (173.33 + 50) = 2.0 / 223.33 = 8.96 mA ≈ 9.0 mA
      • RL = 100 Ω: IL = 2.0 / (173.33 + 100) = 2.0 / 273.33 = 7.32 mA ≈ 7.3 mA
      
      Norton's Section Parameters:
      • R1 = 1 kΩ, R2 = 2 kΩ, R3 = 500 Ω, R4 = 2 kΩ
      • Short Circuit Current Isc: Isc = Vth / Rth ≈ 11.5 mA.`,
      hi: `थेवेनिन प्रमेय के अनुसार किसी भी रैखिक द्विपक्षीय नेटवर्क को केवल एक वोल्टेज स्रोत (Vth) तथा उसके श्रेणी में लगे समतुल्य प्रतिरोध (Rth) द्वारा व्यक्त किया जा सकता है।`
    },
    procedure: [
      {
        step: 1,
        title: "Measure Open Circuit Voltage (Vth)",
        desc: "Disconnect load resistance RL. Connect the DC voltmeter across output terminals. Turn ON 12V DC power and observe Vth = 2.0 V."
      },
      {
        step: 2,
        title: "Measure Short Circuit Current (Isc)",
        desc: "Connect the mA meter directly across output terminals to short-circuit the load. Measure Isc = 11.5 mA. Calculate Rth = Vth / Isc = 173.3 Ω."
      },
      {
        step: 3,
        title: "Connect Load Resistors",
        desc: "Patch load resistors RL = 25Ω, 50Ω, 100Ω one by one in series with the milliammeter. Verify measured current matches IL = Vth / (Rth + RL)."
      }
    ],
    instruments: [
      { name: "DC Regulated Supply", spec: "12V DC fixed supply" },
      { name: "Dual-Range DC Voltmeter", spec: "0 - 3 V / 0 - 15 V DC analog meter" },
      { name: "DC Milliammeter", spec: "0 - 15 mA DC analog meter" },
      { name: "Precision Resistor Bank", spec: "500Ω, 100Ω, 90Ω, and selectable RL (25Ω, 50Ω, 100Ω)" }
    ],
    vivaQuestions: [
      {
        q: "What is Thevenin voltage Vth?",
        options: [
          "Open circuit voltage across the load terminals with load removed",
          "Short circuit voltage across the supply",
          "Full load operating voltage",
          "Voltage across the ground pin"
        ],
        answer: 0,
        explanation: "Vth is the potential difference appearing across the load terminals when the load impedance is completely disconnected (open-circuited)."
      },
      {
        q: "How are Thevenin voltage and Norton current related?",
        options: [
          "Vth = Isc * Rth",
          "Vth = Isc / Rth",
          "Vth = Isc + Rth",
          "They are unrelated"
        ],
        answer: 0,
        explanation: "By source transformation, the open circuit voltage Vth equals Norton short-circuit current Isc multiplied by Thevenin resistance Rth (Vth = Isc * Rth)."
      }
    ]
  },
  {
    id: "max-power-transfer-theorem",
    boardId: "board-mpt",
    title: {
      en: "Verification of Maximum Power Transfer Theorem",
      hi: "अधिकतम शक्ति संचरण प्रमेय का सत्यापन"
    },
    branch: "Electrical Engineering",
    category: "Circuit Analysis",
    status: "Verified",
    verifiedBy: "Govind Kumar (Lead Systems Engineer)",
    difficulty: "Core Experiment",
    estimatedTime: "35 mins",
    summary: {
      en: "Determine experimentally that maximum electrical power is transferred from a source to a load when load resistance equals the internal source resistance (RL = Ri).",
      hi: "प्रायोगिक रूप से सिद्ध करना कि किसी स्रोत से लोड को अधिकतम विद्युत शक्ति तभी हस्तांतरित होती है जब लोड प्रतिरोध स्रोत के आंतरिक प्रतिरोध के बराबर हो (RL = Ri)।"
    },
    aim: {
      en: "To design and verify the load resistor condition which absorbs maximum power from a DC source and plot the Power vs Load Resistance (P vs RL) curve.",
      hi: "लोड प्रतिरोध की स्थिति की पुष्टि करना जो स्रोत से अधिकतम शक्ति अवशोषित करती है तथा P बनाम RL वक्र खींचना।"
    },
    theory: {
      en: `Maximum Power Transfer Theorem states that maximum power is transferred from a source to a load when the resistance of the load equals the internal resistance of the source as seen from the load terminals (RL = Ri).
      
      Mathematical Derivation:
      Let source voltage = E, internal source resistance = Ri, load resistance = RL.
      Current I = E / (Ri + RL)
      Power consumed in load: P = I² * RL = [E / (Ri + RL)]² * RL
      Setting dP/dRL = 0 yields: RL = Ri.
      
      Maximum Power value:
      Pmax = E² / (4 * Ri)
      At this peak point, the electrical efficiency of transmission is exactly 50%.
      
      For Ri = 100 Ω and E = 12 V:
      Pmax = 12² / (4 * 100) = 144 / 400 = 0.36 W = 360 mW.`,
      hi: `अधिकतम शक्ति संचरण प्रमेय के अनुसार: किसी दिष्ट धारा (DC) परिपथ में स्रोत से लोड में अधिकतम शक्ति तब प्रवाहित होती है जब लोड का प्रतिरोध (RL) स्रोत के आंतरिक प्रतिरोध (Ri) के समान हो।`
    },
    procedure: [
      {
        step: 1,
        title: "Circuit Connection",
        desc: "Connect 12V DC supply in series with selected source resistor Ri (e.g. 100Ω), the DC milliammeter, and the variable potentiometer VR."
      },
      {
        step: 2,
        title: "Connect Voltmeter",
        desc: "Connect the DC voltmeter across the load potentiometer VR terminals."
      },
      {
        step: 3,
        title: "Vary Potentiometer in Steps",
        desc: "Turn the VR knob from low resistance up to 500Ω. At each step, record Voltage V and Current I. Calculate Power P = V * I."
      },
      {
        step: 4,
        title: "Plot and Identify Peak",
        desc: "Notice how power starts low, climbs to a peak right when RL = 100Ω, and then gradually decreases. Graph forms a smooth bell-shaped curve."
      }
    ],
    instruments: [
      { name: "DC Regulated Supply", spec: "+12V DC output" },
      { name: "Variable Load Potentiometer (VR)", spec: "0 - 500 Ω precision linear dial" },
      { name: "Source Resistors", spec: "50 Ω, 100 Ω, 500 Ω precision wirewound" },
      { name: "Analog Meters", spec: "0 - 15 V DC Voltmeter & 0 - 150 mA Ammeter" }
    ],
    vivaQuestions: [
      {
        q: "What is the theoretical maximum transfer efficiency when maximum power condition is satisfied?",
        options: [
          "50 %",
          "100 %",
          "70.7 %",
          "25 %"
        ],
        answer: 0,
        explanation: "When RL = Ri, half the generated power is consumed in the internal resistance and half is delivered to the load, giving exactly 50% efficiency."
      },
      {
        q: "Why do high-voltage electric power distribution grids NOT operate at maximum power transfer condition?",
        options: [
          "Because 50% efficiency causes excessive heat losses and voltage drop",
          "Because wires cannot carry AC current",
          "Because generators cannot produce 12V",
          "Because power grids operate only at resonance"
        ],
        answer: 0,
        explanation: "Power utility networks aim for maximum efficiency (typically > 95%), so they make source/line resistance as small as possible. MPTT is vital in electronics/communications for signal strength, not high-voltage power transmission."
      }
    ]
  },
  {
    id: "two-port-zh-parameters",
    boardId: "board-zh",
    title: {
      en: "Z & H Parameters of Two-Port Network (DC Only)",
      hi: "टू-पोर्ट नेटवर्क के Z एवं H प्राचलों का अध्ययन"
    },
    branch: "Electrical Engineering",
    category: "Network Theory",
    status: "Verified",
    verifiedBy: "Subham Patel (Technical Verifier, ECE)",
    difficulty: "Advanced",
    estimatedTime: "50 mins",
    summary: {
      en: "Determine open-circuit impedance (Z) parameters and hybrid (h) parameters of single and cascaded symmetrical T-networks with variable DC supply.",
      hi: "एकल और कैस्केडेड सममित T-नेटवर्क के ओपन-सर्किट प्रतिबाधा (Z) और हाइब्रिड (h) प्राचलों का निर्धारण करना।"
    },
    aim: {
      en: "To determine Z-parameters and h-parameters of a two-port network under open circuit and short circuit conditions.",
      hi: "ओपन सर्किट एवं शॉर्ट सर्किट परिस्थितियों में टू-पोर्ट नेटवर्क के Z-प्राचल और h-प्राचल का अध्ययन करना।"
    },
    theory: {
      en: `A two-port network has four terminal variables: V1, I1 at Port 1 (Input), and V2, I2 at Port 2 (Output).
      
      Z-Parameters (Open-Circuit Impedance):
      V1 = Z11 * I1 + Z12 * I2
      V2 = Z21 * I1 + Z22 * I2
      
      When Port 2 is open circuited (I2 = 0):
      • Z11 = V1 / I1  (Input driving point impedance)
      • Z21 = V2 / I1  (Forward transfer impedance)
      
      When Port 1 is open circuited (I1 = 0):
      • Z12 = V1 / I2  (Reverse transfer impedance)
      • Z22 = V2 / I2  (Output driving point impedance)
      
      For symmetrical T-network with 1 kΩ arms:
      When I2 = 0, total input resistance = 1kΩ + 1kΩ = 2 kΩ.
      If V1 = 10 V: I1 = 5.0 mA, V2 = 5.0 V.
      Z11 = 2000 Ω = 2 kΩ; Z21 = 1000 Ω = 1 kΩ. Reciprocity condition Z12 = Z21 is satisfied!`,
      hi: `टू-पोर्ट नेटवर्क में चार चर होते हैं: V1, I1, V2, I2। Z-प्राचलों में दोनों वोल्टेज धाराओं के फलन के रूप में व्यक्त किए जाते हैं।`
    },
    procedure: [
      {
        step: 1,
        title: "Connect Variable Supply",
        desc: "Connect the 0-10V DC regulated supply to Port 1 through the analog current meter."
      },
      {
        step: 2,
        title: "Open Circuit Condition (I2 = 0)",
        desc: "Leave Port 2 open circuited. Connect the analog voltmeter across Port 2 to measure open circuit voltage V2."
      },
      {
        step: 3,
        title: "Set Voltage to 10V",
        desc: "Adjust the voltage potentiometer to 10V. Record input current I1 and output voltage V2."
      },
      {
        step: 4,
        title: "Calculate Z-Parameters",
        desc: "Compute Z11 = V1/I1 and Z21 = V2/I1."
      }
    ],
    instruments: [
      { name: "Variable DC Supply", spec: "0 - 10V continuously variable regulated supply" },
      { name: "Dual-Range DC Voltmeter", spec: "0 - 12 V DC precision analog meter" },
      { name: "DC Milliammeter", spec: "0 - 10 mA DC precision analog meter" },
      { name: "T-Network Apparatus", spec: "Two 1 kΩ precision symmetrical T-networks" }
    ],
    vivaQuestions: [
      {
        q: "What is the condition for a two-port network to be reciprocal in terms of Z-parameters?",
        options: [
          "Z12 = Z21",
          "Z11 = Z22",
          "Z11 * Z22 = 1",
          "Z12 = -Z21"
        ],
        answer: 0,
        explanation: "A bilateral linear network satisfies reciprocity when reverse transfer impedance Z12 equals forward transfer impedance Z21."
      }
    ]
  },
  {
    id: "series-parallel-resonance",
    boardId: "board-res",
    title: {
      en: "Study of Series & Parallel Resonance Circuit",
      hi: "श्रेणी एवं समानांतर अनुनाद परिपथ का अध्ययन"
    },
    branch: "Electrical Engineering",
    category: "AC Circuits",
    status: "Verified",
    verifiedBy: "Subham Patel (Technical Verifier, ECE)",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    summary: {
      en: "Investigate resonance frequency, bandwidth, and quality factor (Q-factor) in RLC circuits with AC signal excitation.",
      hi: "एसी सिग्नल के साथ RLC श्रेणी परिपथ में अनुनाद आवृत्ति, बैंडविड्थ और गुणवत्ता कारक (Q-फैक्टर) का अध्ययन करना।"
    },
    aim: {
      en: "To determine resonant frequency fr, quality factor Q, and bandwidth of a series RLC circuit.",
      hi: "एक श्रेणी RLC परिपथ की अनुनाद आवृत्ति fr, गुणवत्ता कारक Q, और बैंडविड्थ ज्ञात करना।"
    },
    theory: {
      en: `In a series R-L-C circuit connected across an AC voltage source V, impedance is:
      Z = R + j(ωL - 1/ωC)
      At resonance, inductive reactance equals capacitive reactance:
      XL = XC  =>  ωL = 1 / (ωC)
      Resonant Frequency:
      fr = 1 / (2 * π * √(L * C))
      At fr, total impedance Z is pure resistance R (minimum impedance), hence circuit current reaches maximum.`,
      hi: `एक श्रेणी RLC परिपथ में अनुनाद उस आवृत्ति पर होता है जहां प्रेरक प्रतिघात धारितीय प्रतिघात के बराबर हो जाता है।`
    },
    procedure: [
      {
        step: 1,
        title: "Connect RLC in Series",
        desc: "Wire resistor R (100Ω), inductor L (10mH), and capacitor C (0.1μF) in series with the AC source."
      },
      {
        step: 2,
        title: "Sweep Frequency",
        desc: "Vary generator frequency from 1 kHz to 10 kHz in steps while keeping input voltage constant at 5V RMS."
      },
      {
        step: 3,
        title: "Plot Resonance Curve",
        desc: "Observe how current peaks sharply at fr = 5.03 kHz. Mark half-power frequencies to compute Bandwidth."
      }
    ],
    instruments: [
      { name: "RLC Resonance Board", spec: "Inductors (5mH, 10mH), Capacitors (0.01μF, 0.1μF), Decade resistor" },
      { name: "AC Signal Generator", spec: "0 - 100 kHz Sine wave generator" },
      { name: "True RMS AC Milliammeter", spec: "0 - 100 mA" }
    ],
    vivaQuestions: [
      {
        q: "What is the power factor of a series RLC circuit at resonance?",
        options: [
          "Unity (1.0)",
          "Zero lagging",
          "Zero leading",
          "0.707 lagging"
        ],
        answer: 0,
        explanation: "At resonance, XL = XC, making the circuit purely resistive with unity power factor (cos φ = 1)."
      }
    ]
  }
];

window.EXPERIMENTS_DATA = EXPERIMENTS_DATA;
