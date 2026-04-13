import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Brain, Activity, Sparkles, Lightbulb, Volume2, HelpCircle, XCircle } from 'lucide-react';

export default function ResultCards({ data, onReset }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Web Speech API for Text-to-Speech
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text to speech!");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer a nice english voice if available
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('UK')));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech if unmounted
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getScoreColor = (score) => {
    if (score < 30) return 'from-red-500 to-rose-600';
    if (score < 70) return 'from-amber-400 to-orange-500';
    return 'from-emerald-400 to-teal-500';
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto w-full space-y-6 text-left origin-top"
    >
      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <button 
          onClick={() => speakText(data.roast + ". " + data.summary)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            isSpeaking ? 'bg-violet-600 text-[var(--text-main)] animate-pulse' : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] hover:shadow-md'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          {isSpeaking ? 'Stop roasting...' : 'Roast me out loud'}
        </button>

        <button 
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] hover:shadow-md transition-all font-medium"
        >
          <HelpCircle className="h-4 w-4 text-violet-400" />
          Why did AI say this?
        </button>
      </div>

      <AnimatePresence>
        {showReasoning && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-violet-900/40 border border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)] rounded-xl p-5 mb-6 text-violet-200 text-sm italic font-mono flex items-start gap-4">
              <Brain className="h-5 w-5 mt-0.5 flex-shrink-0 text-violet-400" />
              <p>{data.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Roast & Prediction */}
        <div className="md:col-span-8 space-y-6">
          <motion.div variants={item} className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flame className="h-24 w-24 text-rose-500" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Flame className="h-5 w-5" /></div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">The Roast</h3>
            </div>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed relative z-10">{data.roast}</p>
          </motion.div>

          <motion.div variants={item} className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fuchsia-500/20 rounded-lg text-fuchsia-400"><Activity className="h-5 w-5" /></div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">Day Prediction</h3>
            </div>
            <p className="text-[var(--text-muted)]">{data.prediction}</p>
          </motion.div>
        </div>

        {/* Right Column: Score & Advice */}
        <div className="md:col-span-4 space-y-6">
          <motion.div variants={item} className="glass-card flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">Survival Score</h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700/50"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${data.survival_score}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`${data.survival_score < 50 ? 'text-rose-500' : 'text-emerald-500'}`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={data.survival_score < 50 ? "#f43f5e" : "#10b981"} />
                    <stop offset="100%" stopColor={data.survival_score < 50 ? "#fb923c" : "#14b8a6"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-main)] to-[var(--text-muted)]">
                  {data.survival_score}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">/100</span>
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {data.survival_score < 30 ? "It's so over." : data.survival_score < 70 ? "We endure." : "We're so back!"}
            </p>
          </motion.div>

          <motion.div variants={item} className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Lightbulb className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Wisdom</h3>
            </div>
            <p className="text-[var(--text-muted)] text-sm">{data.advice}</p>
          </motion.div>
        </div>
      </div>

      {/* Full Width: Future Simulation */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Sparkles className="h-5 w-5" /></div>
          <h3 className="text-xl font-bold text-[var(--text-main)]">Future Simulation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden group hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            <h4 className="text-emerald-400 text-xs uppercase font-bold tracking-wider mb-2 flex items-center justify-between relative z-10">Best Case <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">1% chance</span></h4>
            <p className="text-slate-200 text-sm relative z-10">{data.future?.best || "You somehow succeed."}</p>
          </div>
          <div className="bg-rose-900/20 rounded-xl p-5 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)] relative overflow-hidden group hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent"></div>
            <h4 className="text-rose-400 text-xs uppercase font-bold tracking-wider mb-2 flex items-center justify-between relative z-10">Worst Case <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded text-[10px]">99% chance</span></h4>
            <p className="text-slate-200 text-sm relative z-10">{data.future?.worst || "Total catastrophe."}</p>
          </div>
          <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden group hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
            <h4 className="text-amber-400 text-xs uppercase font-bold tracking-wider mb-2 flex items-center justify-between relative z-10">Realistic <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">Loading...</span></h4>
            <p className="text-slate-200 text-sm relative z-10">{data.future?.realistic || "A very mediocre day."}</p>
          </div>
        </div>
      </motion.div>

      {/* Final Verdict */}
      <motion.div variants={item} className="mt-8 flex flex-col items-center">
        <div className="h-px w-full max-w-sm bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-8"></div>
        <h2 className="text-2xl md:text-3xl font-black text-center mb-2 primary-gradient-text">
          Final Verdict
        </h2>
        <p className="text-[var(--text-muted)] text-center max-w-2xl text-lg mb-8 italic">
          "{data.summary}"
        </p>

        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_0_20px_var(--glow-hover)] hover:shadow-[0_0_30px_var(--glow-hover)] text-white transition-all transform hover:scale-[1.05] font-bold"
        >
          <XCircle className="h-5 w-5" />
          End Simulation (Start Over)
        </button>
      </motion.div>
    </motion.div>
  );
}
