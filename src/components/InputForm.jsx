import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Smile, Moon, CalendarDays, Zap } from 'lucide-react';

export default function InputForm({ onSubmit, isLoading }) {
  const [city, setCity] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [sleep, setSleep] = useState('');
  const [plans, setPlans] = useState('');
  const [mode, setMode] = useState('Savage 😈');

  const modes = ['Savage 😈', 'Therapist 🧘', 'Analyst 🧠', 'Meme Lord 🤡'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ city, mood, sleep, plans, mode });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-xl mx-auto w-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
      
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)] text-left">Your Reality Check</h2>
      
      <form onSubmit={handleSubmit} className="space-y-7 text-left">
        <div>
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input 
              required
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Where are you surviving?" 
              className="input-glass shadow-inner focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] focus:border-violet-400 rounded-full"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Current Mood</label>
            <div className="relative">
              <Smile className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <select 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="input-glass appearance-none focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] focus:border-violet-400 rounded-full"
                style={{ paddingLeft: '40px' }}
              >
                <option className="bg-[var(--bg-bottom)]">Happy</option>
                <option className="bg-[var(--bg-bottom)]">Neutral</option>
                <option className="bg-[var(--bg-bottom)]">Sad</option>
                <option className="bg-[var(--bg-bottom)]">Anxious</option>
                <option className="bg-[var(--bg-bottom)]">Delusional</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Sleep (Hours)</label>
            <div className="relative">
              <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input 
                required
                type="number" 
                min="0"
                max="24"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                placeholder="Be honest..." 
                className="input-glass focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] focus:border-violet-400 rounded-full"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Today's Delusions (Plans)</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input 
              required
              type="text" 
              value={plans}
              onChange={(e) => setPlans(e.target.value)}
              placeholder="e.g. 'Fix my life', 'Code for 10 hours', 'Nothing'" 
              className="input-glass focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] focus:border-violet-400 rounded-full"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">AI Personality Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modes.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-3 px-3 rounded-full border text-sm font-bold transition-all duration-300 ${
                  mode === m 
                    ? 'bg-violet-600/30 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.8)] scale-[1.05] ring-2 ring-violet-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50 text-[var(--text-muted)] hover:border-slate-500 hover:text-slate-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-6 py-4 px-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-black rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex gap-1 items-center">
              <span className="opacity-80">AI is thinking</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
            </div>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Analyze My Existence
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
