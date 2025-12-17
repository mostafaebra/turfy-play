import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { 
  MdCheckCircle, 
  MdCloudUpload, 
  MdImage, 
  MdCalendarToday, 
  MdLocationOn, 
  MdUpload,
  MdEmojiEvents,
  MdAttachMoney,
  MdGroups,
  MdPerson,
  MdEmail,
  MdArticle,
  MdGavel,
  MdAccessTime,
  MdOutlineSportsTennis 
} from 'react-icons/md';
import { createCompetition } from '../services/apiservices';
import ConfirmationModal from './ConfirmationModal';

const CreateCompetitionStep4 = ({ onBack, onSubmit, competitionData }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false, type: 'success', title: '', message: '', details: ''
  });
  const fileInputRef = useRef(null);

  // --- HELPERS ---
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getVenueDisplay = () => {
    if (competitionData.addedVenues && competitionData.addedVenues.length > 0) {
      const v = competitionData.addedVenues[0];
      return { name: v.name, location: v.location };
    }
    return { name: 'No Venue Selected', location: '' };
  };

  const venueInfo = getVenueDisplay();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setCoverImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * 🛠️ FIX: DATA MAPPING
   * Transform frontend data to match Backend Requirements
   */
  const prepareFormData = () => {
    const formData = new FormData();

    // 1. Basic Fields
    formData.append('Name', competitionData.competitionName || '');
    formData.append('Rules', competitionData.rules || '');
    formData.append('OrganizerName', competitionData.organizerName || '');
    formData.append('OrganizerEmail', competitionData.organizerEmail || '');
    
    // 2. Map Prizes to Backend Format
    const formattedPrizes = (competitionData.prizes || []).map((p, index) => ({
        Rank: index + 1, 
        Reward: `${p.cash || '0'} EGP + ${p.merch || ''}`.trim()
    }));
    formData.append('Prizes', JSON.stringify(formattedPrizes));

    // 3. Other Essential Fields
    formData.append('EventDetails', competitionData.overview || ''); 
    formData.append('StartDate', competitionData.startDate || '');
    formData.append('EndDate', competitionData.endDate || '');
    formData.append('RegistrationDeadline', competitionData.deadlineDate || '');
    formData.append('EntryFee', competitionData.entryFee || 0);
    formData.append('MaxTeams', competitionData.maxTeams || 0);
    
    // 4. Hardcoded Types
    formData.append('SportType', '1'); 
    formData.append('CompetitionType', '3'); 
    formData.append('RewardsDescription', 'Cash and Trophies');

    // 5. IDs
    // ✅ ADDED: The specific Organizer ID provided
    formData.append('OrganizerId', '23573DA0-7FCE-4768-8ACA-0071AFFA4CFD');

    if (competitionData.addedVenues && competitionData.addedVenues.length > 0) {
        formData.append('FieldId', competitionData.addedVenues[0].id);
    }

    // 6. The File
    if (coverImage) {
        formData.append('CompetitionImage', coverImage);
    }

    return formData;
  };

  const handlePublish = async () => {
    if (!coverImage) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Missing Cover Photo',
        message: 'The CompetitionImage field is required.',
        details: 'Please upload a photo to continue.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiFormData = prepareFormData();
      const result = await createCompetition(apiFormData);

      setIsSubmitting(false);

      if (result.success) {
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Competition Created!',
          message: 'Your competition is now live.',
          details: `Success! The competition has been published.`
        });
        if (onSubmit) onSubmit(result.data);
      } else {
        let errorDetails = '';
        if (result.error && result.error.errors) {
            errorDetails = Object.entries(result.error.errors)
                .map(([key, msgs]) => `• ${key}: ${msgs.join(', ')}`)
                .join('\n');
        } else {
            errorDetails = result.message || 'Unknown error';
        }

        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Validation Failed',
          message: 'Please check the following errors:',
          details: errorDetails
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'System Error',
        message: 'Something went wrong connecting to the server.',
        details: error.message
      });
    }
  };

  const handleCloseModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        details={modalState.details}
        onConfirm={handleCloseModal}
        onClose={handleCloseModal}
        confirmText="OK"
      />
      
      {/* 1. MEDIA UPLOAD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-2 ring-emerald-500/20">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MdImage className="text-emerald-500" size={24} />
            Cover Media
          </h3>
          <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Step 4</span>
        </div>
        <div className="p-6">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative group h-48 flex flex-col items-center justify-center overflow-hidden ${previewUrl ? 'border-emerald-500' : ''}`}
            >
                <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleImageChange} />
                {previewUrl ? (
                    <img src={previewUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <MdCloudUpload className="text-slate-500" size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-900">Upload Cover Photo</p>
                            <p className="text-xs text-slate-500 mt-1">1200x400px (3:1 ratio)</p>
                        </div>
                    </>
                )}
                {previewUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium text-sm flex items-center gap-2"><MdUpload size={16} /> Change Photo</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 2. MASTER REVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                        <div className="size-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                             <MdOutlineSportsTennis size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{competitionData.competitionName || 'Untitled'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wide">
                                    {competitionData.level || 'Open'}
                                </span>
                                <span className="text-xs text-slate-500">Created today</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Capacity</div>
                        <div className="flex items-center gap-2 font-bold text-slate-900"><MdGroups className="text-slate-400" size={20} /> {competitionData.maxTeams || 0} Teams</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-semibold uppercase mb-1">Entry Fee</div>
                        <div className="flex items-center gap-2 font-bold text-slate-900"><MdAttachMoney className="text-slate-400" size={20} /> {competitionData.entryFee || 0} EGP</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><MdArticle className="text-slate-400" size={20} /> Event Overview</h4>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: competitionData.overview || 'No overview.' }} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><MdGavel className="text-slate-400" size={20} /> Rules</h4>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-slate-100" dangerouslySetInnerHTML={{ __html: competitionData.rules || 'No rules.' }} />
            </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Schedule & Location</h4>
                <div className="space-y-4">
                    <div><div className="text-xs text-slate-400 uppercase font-bold mb-1">Dates</div><div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><MdCalendarToday className="text-emerald-500" /> {formatDate(competitionData.startDate)} - {formatDate(competitionData.endDate)}</div></div>
                    <div><div className="text-xs text-slate-400 uppercase font-bold mb-1">Reg. Deadline</div><div className="flex items-center gap-2 text-sm font-semibold text-orange-600"><MdAccessTime /> {formatDate(competitionData.deadlineDate)}</div></div>
                    <div><div className="text-xs text-slate-400 uppercase font-bold mb-1">Venue</div><div className="flex items-start gap-2 text-sm font-semibold text-slate-900"><MdLocationOn className="text-emerald-500 mt-0.5 shrink-0" /><div><div>{venueInfo.name}</div><div className="text-xs text-slate-500 font-normal">{venueInfo.location}</div></div></div></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Prize Pool</h4>
                <div className="space-y-3">
                    {competitionData.prizes && competitionData.prizes.length > 0 ? (
                        competitionData.prizes.map((prize, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</div><span className="font-medium text-slate-700">{prize.rank}</span></div>
                                <div className="text-right"><div className="font-bold text-slate-900">{prize.cash} EGP</div>{prize.merch && <div className="text-[10px] text-emerald-600 font-medium">+ {prize.merch}</div>}</div>
                            </div>
                        ))
                    ) : <p className="text-xs text-slate-400 italic">No prizes listed.</p>}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Organizer</h4>
                <div className="flex items-center gap-3"><div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">{competitionData.organizerName ? competitionData.organizerName.charAt(0) : 'O'}</div><div><div className="text-sm font-bold text-slate-900 flex items-center gap-1">{competitionData.organizerName || 'Unknown'} <MdCheckCircle className="text-emerald-500" size={14} /></div><div className="text-xs text-slate-500">Tournament Director</div></div></div>
                <div className="mt-4 space-y-2"><div className="flex items-center gap-2 text-xs text-slate-600"><MdEmail size={14} /> {competitionData.organizerEmail || 'N/A'}</div></div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-white border-t border-slate-200 flex justify-between rounded-xl shadow-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900"><ArrowLeft size={18} /> Back to Details</button>
          <button onClick={handlePublish} disabled={isSubmitting} className={`px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}>
            {isSubmitting ? 'Publishing...' : 'Confirm & Publish'} {!isSubmitting && <MdCheckCircle size={18} className="text-emerald-400" />}
          </button>
      </div>
    </div>
  );
};

export default CreateCompetitionStep4;