import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  MdEditDocument, 
  MdSportsSoccer, 
  MdSportsTennis, 
  MdSportsBaseball, 
  MdSportsBasketball, 
  MdGroups, 
  MdCheckCircle,
  MdSignalCellularAlt // Icon for Level
} from 'react-icons/md';

const CreateCompetitionStep1 = ({ onNext }) => {
  // --- STATE ---
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('turfy_comp_draft_step1');
    return savedDraft ? JSON.parse(savedDraft) : {
      competitionName: '',
      level: '',
      sport: 'Padel',
      maxTeams: '',
      entryFee: ''
    };
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const nameRef = useRef(null);
  const maxTeamsRef = useRef(null);
  const feeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('turfy_comp_draft_step1', JSON.stringify(formData));
  }, [formData]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

  const validate = () => {
    const newErrors = {};
    if (!formData.competitionName.trim()) {
      newErrors.competitionName = "Competition Name is required";
      showToast('error', "Please enter a competition name");
      nameRef.current?.focus();
      return false;
    }
    if (!formData.level) {
        newErrors.level = "Please select a level"; // Validate Level
        showToast('error', "Please select a competition level");
        return false;
    }
    if (!formData.maxTeams) {
        newErrors.maxTeams = "Max Teams is required";
        showToast('error', "Please enter the number of teams");
        maxTeamsRef.current?.focus();
        return false;
    } else {
        const teams = parseInt(formData.maxTeams);
        if (teams < 2) {
            newErrors.maxTeams = "Min 2 teams";
            return false;
        }
        if (!isPowerOfTwo(teams)) {
            newErrors.maxTeams = `Must be 4, 8, 16...`;
            showToast('error', "Teams must be a power of 2 (4, 8, 16, etc.)");
            return false;
        }
    }
    if (!formData.entryFee) {
      newErrors.entryFee = "Entry fee is required";
      feeRef.current?.focus();
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      showToast('success', "Essentials saved!");
      setTimeout(() => onNext(formData), 500);
    }
  };

  const getSportIcon = (iconName) => {
    switch(iconName) {
        case 'football': return <MdSportsSoccer size={24} />;
        case 'padel': return <MdSportsTennis size={24} />;
        case 'tennis': return <MdSportsBaseball size={24} />;
        case 'basketball': return <MdSportsBasketball size={24} />;
        default: return <MdSportsSoccer size={24} />;
    }
  };

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} border`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-2 ring-emerald-500/20">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <MdEditDocument className="text-emerald-500" size={20} />
            <span className="hidden sm:inline">Event Essentials</span>
            <span className="sm:hidden">Essentials</span>
          </h3>
          <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Step 1</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Competition Name <span className="text-red-500">*</span></label>
            <input 
              ref={nameRef}
              type="text"
              placeholder="e.g. Summer Padel Cup"
              className={`w-full h-12 px-4 rounded-xl border focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400 ${errors.competitionName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              value={formData.competitionName}
              onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
            />
          </div>

          {/* 📱 NEW: PILL SELECTOR FOR LEVEL (Better for Mobile) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                Competition Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Beginners', 'Intermediate', 'Professional'].map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setFormData({ ...formData, level: lvl })}
                        className={`relative h-12 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 border ${
                            formData.level === lvl 
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                        }`}
                    >
                        {formData.level === lvl && <MdCheckCircle size={16} className="animate-in zoom-in" />}
                        {lvl}
                    </button>
                ))}
            </div>
            {errors.level && <p className="text-xs text-red-500">{errors.level}</p>}
          </div>

          {/* Sport Category */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Sport Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Football', icon: 'football' },
                { id: 'Padel', icon: 'padel' }, 
                { id: 'Tennis', icon: 'tennis' }, 
                { id: 'Basketball', icon: 'basketball' }
              ].map((item) => (
                <label key={item.id} className="cursor-pointer relative group">
                  <input type="radio" name="sport" className="peer sr-only" checked={formData.sport === item.id} onChange={() => setFormData({ ...formData, sport: item.id })} />
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-emerald-500/50 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/5 transition-all h-full">
                    <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-slate-600">{getSportIcon(item.icon)}</div>
                    <span className="font-medium text-xs sm:text-sm text-slate-700 peer-checked:text-emerald-600">{item.id}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 📱 MOBILE RESPONSIVE GRID (grid-cols-1 on mobile, 2 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Max Teams <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MdGroups size={20} /></div>
                <input 
                  ref={maxTeamsRef}
                  type="number" 
                  placeholder="e.g. 16"
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 ${errors.maxTeams ? 'border-red-300' : 'border-slate-200'}`}
                  value={formData.maxTeams}
                  onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
                />
              </div>
              {errors.maxTeams && <p className="text-xs text-red-500">{errors.maxTeams}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Entry Fee <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><span className="font-bold text-sm">EGP</span></div>
                <input 
                  ref={feeRef}
                  type="number" 
                  placeholder="200"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center text-sm sm:text-base">
            Next Step <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCompetitionStep1;