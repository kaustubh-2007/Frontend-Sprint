import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultCards from './components/ResultCards';
import { fetchWeather } from './services/weather';
import { generateRealityCheck } from './services/groq';
import './index.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleAnalyze = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      // 1. Fetch Weather
      const weatherData = await fetchWeather(userData.city);
      setTemperature(weatherData.temperature);
      
      // 2. Fetch AI Analysis
      const analysisData = await generateRealityCheck(userData, weatherData, userData.mode);
      
      setResult(analysisData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went horribly wrong. How fitting.');
    } finally {
      setLoading(false);
    }
  };

  let bgStyle = {
    background: "radial-gradient(circle at top right, var(--bg-top) 0%, var(--bg-bottom) 100%)",
    transition: "background 1.5s ease"
  };
  
  if (temperature !== null) {
    if (temperature > 30) {
      bgStyle.background = "radial-gradient(circle at top right, #7f1d1d 0%, var(--bg-bottom) 100%)";
    } else if (temperature < 15) {
      bgStyle.background = "radial-gradient(circle at top right, #0c4a6e 0%, var(--bg-bottom) 100%)";
    }
  }

  // Toggle theme utility
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen py-12 px-4 flex flex-col items-center ${isDarkMode ? 'dark' : ''}`} style={bgStyle}>
      {/* Header Actions */}
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <button 
          onClick={toggleTheme}
          className="px-4 py-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md hover:scale-105 transition-transform font-bold z-50 text-[var(--text-main)]"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-violet-600/20 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Bot className="h-10 w-10 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight m-0 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            AI Roast My Life 2.0
          </h1>
        </div>
        <p className="text-[var(--text-muted)] text-lg font-medium max-w-lg mx-auto">
          The ultimate reality check engine. Let AI analyze your pathetic existence and simulate your future.
        </p>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-rose-500/10 border border-rose-500/50 text-rose-200 px-6 py-4 rounded-xl mb-8 flex items-center justify-center max-w-xl shadow-lg"
          >
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="form"
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
            >
              <InputForm onSubmit={handleAnalyze} isLoading={loading} />
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResultCards data={result} onReset={() => setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-auto pt-16 pb-4 text-center text-slate-500 text-sm w-full"
      >
        <p>Powered by Groq ✨ Open-Meteo ☁️ React ⚛️</p>
        <p className="mt-1">Nobody is safe from the AI Reality Check Engine.</p>
      </motion.footer>
    </div>
  );
}

export default App;
