/**
 * MY VIRTUAL LAB - Web Audio Sound Engine
 * Synthesizes realistic hardware switch clicks, wire sparks, 50Hz lab hum, error buzz, and success chimes.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.humOscillator = null;
    this.humGain = null;
    this.initContext();
  }

  initContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.humOscillator) {
      this.stopLabHum();
    }
    return this.isMuted;
  }

  // Realistic Rocker Switch Click
  playSwitchClick(isOn = true) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isOn ? 380 : 260, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Wire Terminal Snap & Micro-Spark
  playWireSnap() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // High frequency micro snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Subtle 50Hz Lab Transformer Hum when Power is ON
  startLabHum() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || this.humOscillator) return;

    const t = this.ctx.currentTime;
    this.humOscillator = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();

    this.humOscillator.type = 'sine';
    this.humOscillator.frequency.setValueAtTime(50, t); // 50 Hz AC Indian mains hum

    this.humGain.gain.setValueAtTime(0.001, t);
    this.humGain.gain.exponentialRampToValueAtTime(0.035, t + 0.3); // soft ambient volume

    this.humOscillator.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);

    this.humOscillator.start(t);
  }

  stopLabHum() {
    if (!this.ctx || !this.humOscillator) return;
    try {
      const t = this.ctx.currentTime;
      this.humGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      setTimeout(() => {
        if (this.humOscillator) {
          this.humOscillator.stop();
          this.humOscillator.disconnect();
          this.humOscillator = null;
          this.humGain = null;
        }
      }, 160);
    } catch (e) {
      this.humOscillator = null;
    }
  }

  // Error Buzz when a wrong connection is made or short-circuit detected
  playErrorBuzz() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.setValueAtTime(95, t + 0.1);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // Success Harmonic Chime when circuit verified or reading recorded
  playSuccessChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }
}

window.labAudio = new SoundEngine();
