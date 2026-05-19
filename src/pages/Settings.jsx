import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/useSettingsStore';
import { Globe, ShieldCheck, Zap, Headphones, Check } from 'lucide-react';

const AVAILABLE_LANGUAGES = [
  { id: 'hindi', name: 'Hindi' },
  { id: 'english', name: 'English' },
  { id: 'tamil', name: 'Tamil' },
  { id: 'telugu', name: 'Telugu' },
  { id: 'punjabi', name: 'Punjabi' },
  { id: 'marathi', name: 'Marathi' },
  { id: 'gujarati', name: 'Gujarati' },
  { id: 'bengali', name: 'Bengali' },
  { id: 'kannada', name: 'Kannada' },
  { id: 'bhojpuri', name: 'Bhojpuri' },
  { id: 'malayalam', name: 'Malayalam' },
  { id: 'urdu', name: 'Urdu' },
  { id: 'haryanvi', name: 'Haryanvi' },
  { id: 'rajasthani', name: 'Rajasthani' },
  { id: 'odia', name: 'Odia' },
  { id: 'assamese', name: 'Assamese' }
];

const Settings = () => {
  const { languages, toggleLanguage, audioQuality, setAudioQuality } = useSettingsStore();

  const renderSection = (title, icon, description, children) => (
    <section className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase">{title}</h2>
          <p className="text-text-secondary text-sm font-medium">{description}</p>
        </div>
      </div>
      <div className="glass rounded-[3rem] p-8 border border-white/5 space-y-8">
        {children}
      </div>
    </section>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 pb-32 max-w-5xl mx-auto space-y-16"
    >
      <div className="space-y-4">
        <h1 className="text-7xl font-black tracking-tighter text-text-primary uppercase leading-none">Settings</h1>
        <p className="text-text-secondary text-xl font-medium tracking-wide">Configure your cosmic experience</p>
      </div>

      {renderSection(
        "Music Languages", 
        <Globe size={28} />, 
        "Select the languages you'd like to see on your homepage and trending sections.",
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = languages.includes(lang.id);
            return (
              <button
                key={lang.id}
                onClick={() => toggleLanguage(lang.id)}
                className={`relative group p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-3 ${
                  isSelected 
                    ? 'bg-primary/20 border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]' 
                    : 'glass border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'bg-primary text-white scale-110' : 'bg-white/5 text-text-secondary'
                }`}>
                  {isSelected ? <Check size={24} /> : <Globe size={20} />}
                </div>
                <span className={`font-black uppercase tracking-widest text-xs ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {lang.name}
                </span>
                
                {isSelected && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 rounded-3xl bg-primary/5 -z-10"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {renderSection(
        "Audio Quality", 
        <Headphones size={28} />, 
        "Choose your preferred streaming quality. Higher quality uses more data.",
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { id: '96kbps', name: 'Low', desc: 'Saves Data' },
            { id: '160kbps', name: 'Medium', desc: 'Balanced' },
            { id: '320kbps', name: 'Extreme', desc: 'Cosmic Audio' }
          ].map((quality) => {
            const isSelected = audioQuality === quality.id;
            return (
              <button
                key={quality.id}
                onClick={() => setAudioQuality(quality.id)}
                className={`p-8 rounded-[2.5rem] border transition-all text-left group ${
                  isSelected ? 'bg-primary text-white border-primary shadow-2xl scale-[1.02]' : 'glass border-white/5 hover:bg-white/5'
                }`}
              >
                <Zap className={`mb-4 transition-transform group-hover:scale-110 ${isSelected ? 'text-white' : 'text-primary'}`} size={32} />
                <p className="font-black uppercase tracking-[0.2em] text-xs mb-1 opacity-80">{quality.name}</p>
                <p className={`text-2xl font-black tracking-tight ${isSelected ? 'text-white' : 'text-text-primary'}`}>{quality.id}</p>
                <p className={`text-[10px] font-bold uppercase mt-2 ${isSelected ? 'text-white/70' : 'text-text-secondary'}`}>{quality.desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {renderSection(
        "About", 
        <ShieldCheck size={28} />, 
        "AuraMusic Platform Version 2.4.0 (Cosmic Edition)",
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed font-medium">
            SonicStream is built using the JioSaavn Sumit API to provide a high-fidelity streaming experience. 
            All audio content is served through secure CDN connections.
          </p>
          <div className="pt-4 flex gap-8">
            <div>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2">Developed By</p>
              <p className="text-text-primary font-bold">SonicStream Dev Team</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2">License</p>
              <p className="text-text-primary font-bold">Personal / Educational</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
