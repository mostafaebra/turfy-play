import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  MdArticle, MdFormatBold, MdFormatItalic, MdFormatUnderlined, 
  MdFormatListBulleted, MdFormatListNumbered, MdEmojiEvents, 
  MdAddCircle, MdDelete, MdBadge, MdPerson, MdEmail, 
  MdAttachMoney, MdGavel 
} from 'react-icons/md';

// --- RESPONSIVE RICH TEXT EDITOR ---
const RichTextEditor = ({ label, value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const format = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const handleInput = (e) => onChange(e.currentTarget.innerHTML);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label} <span className="text-red-500">*</span></label>
      
      <div className={`border rounded-xl overflow-hidden bg-white transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 ${error ? 'border-red-300' : 'border-slate-200'}`}>
        {/* Toolbar - Now wraps on mobile */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap gap-1">
          <button type="button" onClick={() => format('bold')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"><MdFormatBold size={20} /></button>
          <button type="button" onClick={() => format('italic')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"><MdFormatItalic size={20} /></button>
          <button type="button" onClick={() => format('underline')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"><MdFormatUnderlined size={20} /></button>
          <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block"></div>
          <button type="button" onClick={() => format('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"><MdFormatListBulleted size={20} /></button>
          <button type="button" onClick={() => format('insertOrderedList')} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"><MdFormatListNumbered size={20} /></button>
        </div>

        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="w-full h-40 p-4 border-none focus:outline-none text-slate-700 text-sm overflow-y-auto"
          style={{ minHeight: '160px' }}
        ></div>
      </div>
      
      {!value && <p className="text-xs text-slate-400 mt-1">Tip: {placeholder}</p>}
    </div>
  );
};

// --- MAIN COMPONENT ---
const CreateCompetitionStep3 = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('turfy_comp_draft_step3');
    return saved ? JSON.parse(saved) : {
      overview: '',
      rules: '',
      prizes: [{ rank: '1st Place', reward:' $300 + Gold Trophy' }],
      organizerName: '',
      organizerEmail: ''
    };
  });
  
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!formData.organizerName && !formData.organizerEmail) {
        setFormData(prev => ({ ...prev, organizerName: 'Jane Doe', organizerEmail: 'jane@turfy.com' }));
    }
  }, []); 

  useEffect(() => { localStorage.setItem('turfy_comp_draft_step3', JSON.stringify(formData)); }, [formData]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData({ ...formData, prizes: newPrizes });
  };

  const addPrizeRow = () => {
    setFormData({ ...formData, prizes: [...formData.prizes, { rank: '', reward:'' }] });
  };

  const removePrizeRow = (index) => {
    if (formData.prizes.length === 1) { showToast('error', "One prize required."); return; }
    setFormData({ ...formData, prizes: formData.prizes.filter((_, i) => i !== index) });
  };

  const handleNext = () => {
    if (!formData.overview.trim() || !formData.rules.trim() || !formData.organizerName.trim()) {
        showToast('error', "Please fill in all required fields.");
        return;
    }
    onNext(formData);
  };

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* DETAILS SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-2 ring-emerald-500/20">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MdArticle className="text-emerald-500" size={20} />
                    <span className="hidden sm:inline">Event Details</span>
                    <span className="sm:hidden">Details</span>
                </h3>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Step 3</span>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                <RichTextEditor 
                    label="Event Overview"
                    value={formData.overview}
                    onChange={(val) => setFormData({...formData, overview: val})}
                    placeholder="Describe the format & location..."
                />
                <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MdGavel className="text-emerald-500" size={20} /> Competition Rules
                    </h4>
                    <RichTextEditor 
                        label="Rules & Regulations"
                        value={formData.rules}
                        onChange={(val) => setFormData({...formData, rules: val})}
                        placeholder="List rules & disqualification criteria..."
                    />
                </div>
            </div>
        </div>

        {/* PRIZES SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-2 ring-emerald-500/20">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MdEmojiEvents className="text-emerald-500" size={20} />
                    <span className="hidden sm:inline">Prizes & Organizer</span>
                    <span className="sm:hidden">Prizes</span>
                </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="block text-sm font-medium text-slate-700">Prize Pool</label>
                        <button type="button" onClick={addPrizeRow} className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                            <MdAddCircle size={16} /> Add Row
                        </button>
                    </div>
                    
                    {/* 📱 MOBILE RESPONSIVE TABLE WRAPPER */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[500px]"> 
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-1/4">Rank</th>
                                    <th className="px-4 py-3 w-1/4">Cash</th>
                                    <th className="px-4 py-3 w-1/3">Merch</th>
                                    <th className="px-4 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formData.prizes.map((prize, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50">
                                        <td className="px-4 py-3"><input type="text" value={prize.rank} onChange={(e) => handlePrizeChange(idx, 'rank', e.target.value)} className="w-full border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 1st" /></td>
                                        <td className="px-4 py-3"><div className="relative"><div className="absolute left-2 top-2 text-emerald-500"><MdAttachMoney size={16} /></div><input type="number" value={prize.cash} onChange={(e) => handlePrizeChange(idx, 'cash', e.target.value)} className="w-full border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="0" /></div></td>
                                        <td className="px-4 py-3"><input type="text" value={prize.merch} onChange={(e) => handlePrizeChange(idx, 'merch', e.target.value)} className="w-full border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="Trophy" /></td>
                                        <td className="px-4 py-3 text-center"><button type="button" onClick={() => removePrizeRow(idx)} className="text-slate-300 hover:text-red-500"><MdDelete size={20} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><MdBadge className="text-emerald-500" size={20} /> Organizer Info</h4>
                    {/* 📱 MOBILE RESPONSIVE GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="text" value={formData.organizerName} onChange={(e) => setFormData({...formData, organizerName: e.target.value})} className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 text-sm" />
                                <div className="absolute left-3 top-3 text-slate-400"><MdPerson size={20} /></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="email" value={formData.organizerEmail} onChange={(e) => setFormData({...formData, organizerEmail: e.target.value})} className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 text-sm" />
                                <div className="absolute left-3 top-3 text-slate-400"><MdEmail size={20} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button onClick={onBack} className="flex items-center justify-center gap-2 text-slate-600 font-medium hover:text-slate-900 text-sm sm:text-base px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"><ArrowLeft size={18} /> Back</button>
                <button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-2 transition-all text-sm sm:text-base w-full sm:w-auto">Next Step <ArrowRight size={18} /></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompetitionStep3;