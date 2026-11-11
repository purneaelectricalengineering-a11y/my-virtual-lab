/**
 * MY VIRTUAL LAB - Viva Voce & Quiz Evaluator
 * Interactive assessment for laboratory experiments with instant scoring,
 * conceptual explanations, and automated progress logging.
 */

class VivaQuizEvaluator {
  constructor() {
    this.container = null;
    this.currentExpId = null;
    this.userAnswers = {};
    this.submitted = false;
  }

  render(containerId, expId) {
    this.container = document.getElementById(containerId);
    this.currentExpId = expId;
    this.userAnswers = {};
    this.submitted = false;

    if (!this.container) return;
    this.updateUI();
  }

  updateUI() {
    const exp = window.EXPERIMENTS_DATA.find(e => e.id === this.currentExpId) || window.EXPERIMENTS_DATA[0];
    const isHindi = document.documentElement.getAttribute('lang') === 'hi';
    const questions = exp.vivaQuestions || [];

    if (questions.length === 0) {
      this.container.innerHTML = `<div class="p-4 text-xs text-slate-400">Viva questions being curated for this experiment.</div>`;
      return;
    }

    let score = 0;
    if (this.submitted) {
      questions.forEach((q, idx) => {
        if (this.userAnswers[idx] === q.answer) score++;
      });
    }

    this.container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-heading font-bold text-white flex items-center space-x-2">
              <span>🎓</span>
              <span>${isHindi ? 'वाइवा-वोस एवं स्व-मूल्यांकन प्रश्नोत्तरी' : 'Viva-Voce & Self Assessment Quiz'}</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              ${isHindi ? 'प्रयोग की समझ जांचने के लिए प्रश्नों के उत्तर दें। सही उत्तरों के साथ तुरंत व्याख्या देखें।' : 'Test your conceptual understanding of this experiment. Instant scoring and verified explanations.'}
            </p>
          </div>

          ${this.submitted ? `
            <div class="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center space-x-2">
              <span class="text-lg">🏆</span>
              <div>
                <div class="font-bold">Score: ${score} / ${questions.length}</div>
                <div class="text-[10px] text-emerald-400">${Math.round((score / questions.length) * 100)}% Proficiency</div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Questions List -->
        <div class="space-y-4">
          ${questions.map((q, qIdx) => `
            <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
              <div class="font-semibold text-slate-200 flex items-start space-x-2">
                <span class="text-cyan-400 font-mono">Q${qIdx + 1}.</span>
                <span>${q.q}</span>
              </div>

              <!-- Options -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                ${q.options.map((opt, optIdx) => {
                  let optClass = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500';
                  const isSelected = this.userAnswers[qIdx] === optIdx;

                  if (this.submitted) {
                    if (optIdx === q.answer) {
                      optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && optIdx !== q.answer) {
                      optClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    } else {
                      optClass = 'opacity-50 border-slate-800 text-slate-500';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-semibold';
                  }

                  return `
                    <button 
                      onclick="window.vivaQuizEvaluator.selectOption(${qIdx}, ${optIdx})" 
                      class="p-2.5 rounded-lg border text-left transition flex items-center space-x-2 ${optClass}"
                      ${this.submitted ? 'disabled' : ''}
                    >
                      <span class="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-mono shrink-0">
                        ${String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>${opt}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Explanation after submission -->
              ${this.submitted ? `
                <div class="p-2.5 rounded-lg bg-[#070D1A] border border-slate-800 text-[11px] text-slate-300 font-mono">
                  <span class="text-cyan-400 font-semibold">Explanation: </span>
                  ${q.explanation}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Submit Button -->
        <div class="pt-2 flex justify-end">
          ${!this.submitted ? `
            <button onclick="window.vivaQuizEvaluator.submitQuiz()" class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center space-x-2">
              <span>Submit Viva Answers</span>
              <span>→</span>
            </button>
          ` : `
            <button onclick="window.vivaQuizEvaluator.resetQuiz()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition">
              Retake Quiz
            </button>
          `}
        </div>
      </div>
    `;
  }

  selectOption(qIdx, optIdx) {
    if (this.submitted) return;
    this.userAnswers[qIdx] = optIdx;
    if (window.labAudio) window.labAudio.playSwitchClick(true);
    this.updateUI();
  }

  submitQuiz() {
    this.submitted = true;
    if (window.labAudio) window.labAudio.playSuccessChime();

    // Trigger celebration
    if (typeof confetti === 'function') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }

    this.updateUI();
  }

  resetQuiz() {
    this.userAnswers = {};
    this.submitted = false;
    this.updateUI();
  }
}

window.vivaQuizEvaluator = new VivaQuizEvaluator();
