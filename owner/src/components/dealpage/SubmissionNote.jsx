// src/components/dealpage/SubmissionNote.jsx
import React from 'react';

const SubmissionNote = ({ note }) => {
  if (!note) return null;

  return (
    <section className="bg-white p-6 rounded-2xl border border-border-color font-display mt-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-dark">
        <span className="material-symbols-outlined text-secondary">chat_bubble</span>
        Submission Note
      </h3>
      <div className="p-4 bg-light-gray rounded-xl italic text-text-light text-sm border border-border-color">
        "{note}"
      </div>
    </section>
  );
};

export default SubmissionNote;