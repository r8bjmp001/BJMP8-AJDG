import React, { forwardRef } from 'react';
import { PersonnelType, RegionalData, UnitData } from '../types';
import { User, Briefcase, FileText } from 'lucide-react';

interface JobDescriptionPreviewProps {
  type: PersonnelType;
  data: RegionalData | UnitData;
}

export const JobDescriptionPreview = forwardRef<HTMLDivElement, JobDescriptionPreviewProps>(({ type, data }, ref) => {
  const isRegional = type === PersonnelType.REGIONAL;
  const regionalData = isRegional ? (data as RegionalData) : null;
  const unitData = !isRegional ? (data as UnitData) : null;

  // Defaults
  const defaultBjmpLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Bureau_of_Jail_Management_and_Penology_%28BJMP%29.svg/1024px-Bureau_of_Jail_Management_and_Penology_%28BJMP%29.svg.png";
  const defaultBagongPilipinasUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bagong_Pilipinas_logo.svg/240px-Bagong_Pilipinas_logo.svg.png";

  // Determine Logos
  const customBjmpLogo = isRegional ? regionalData?.bjmpLogo : unitData?.bjmpLogo;
  const bjmpLogo = customBjmpLogo || defaultBjmpLogoUrl;

  const regionalLogo = isRegional ? regionalData?.regionalLogo : null;
  const unitLogo = !isRegional ? unitData?.unitLogo : null;

  const customGovLogo = isRegional ? regionalData?.govLogo : unitData?.govLogo;
  const rightLogo = customGovLogo || defaultBagongPilipinasUrl;

  // Header Text
  const headerText = isRegional ? regionalData?.office : unitData?.jailUnit;
  const unitAddress = !isRegional ? unitData?.address : null;

  return (
    <div 
      ref={ref} 
      id="pdf-preview-container"
      className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-900 relative flex flex-col font-sans shadow-lg"
      style={{ aspectRatio: '210/297' }}
    >
      {/* 1. Header Logos Section - Changed background to light grey */}
      <div className="bg-gray-100 relative h-[140px] shrink-0 border-b border-gray-200 overflow-hidden print:h-[140px]">
         
         {/* Left Logos (Absolute - Compressed) */}
         <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <img 
              src={bjmpLogo} 
              alt="BJMP Logo" 
              className="h-28 w-auto object-contain" 
              crossOrigin="anonymous"
            />
            {regionalLogo && (
               <img 
                 src={regionalLogo} 
                 alt="Regional Logo" 
                 className="h-28 w-auto object-contain" 
                 crossOrigin="anonymous" 
               />
            )}
            {!isRegional && unitLogo && (
               <img 
                 src={unitLogo} 
                 alt="Unit Logo" 
                 className="h-28 w-auto object-contain" 
                 crossOrigin="anonymous" 
               />
            )}
         </div>

         {/* Center Content (Absolute Centered with max-width to prevent overlap) */}
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-0">
             <div className="w-[50%] mx-auto px-1">
                {headerText && (
                    <h2 className="text-xl sm:text-2xl font-black text-[#102446] uppercase leading-tight">
                        {headerText}
                    </h2>
                )}
                
                {unitAddress && (
                    <p className="text-[10px] sm:text-xs font-semibold text-[#102446] mt-1 uppercase leading-tight">
                        {unitAddress}
                    </p>
                )}
             </div>
         </div>

         {/* Right Logo (Absolute) */}
         <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
             <img 
               src={rightLogo} 
               alt="Right Logo" 
               className="h-28 w-auto object-contain" 
               crossOrigin="anonymous"
             />
         </div>
      </div>

      {/* 2. Blue Profile Banner (Rank & Name beside Photo) */}
      <div className="bg-[#102446] w-full px-12 py-6 flex items-center gap-6 shrink-0">
          {/* Photo */}
          <div className="w-[120px] h-[140px] bg-gray-200 shrink-0 border-[3px] border-white shadow-md overflow-hidden bg-white">
            {data.photo ? (
                <img src={data.photo} alt="Personnel" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <User className="w-10 h-10 opacity-50" />
                </div>
            )}
          </div>

          {/* Text Details - Tahoma, White */}
          <div className="flex flex-col justify-center text-white flex-1" style={{ fontFamily: 'Tahoma, Verdana, sans-serif' }}>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h1 className="text-2xl font-bold uppercase tracking-wide leading-none mb-2">
                    {data.rankName || 'RANK & FULL NAME'}
                </h1>
                <p className="text-lg font-medium uppercase text-blue-100 tracking-wider">
                    {data.designation || 'DESIGNATION'}
                </p>
              </div>
          </div>
      </div>

      {/* 3. Main Content - Job Description */}
      <div className="flex-1 px-8 py-6 relative overflow-hidden bg-white">
        
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Light Blue Swoosh - Top Right */}
                <path d="M100 0 H40 Q70 30 100 60 V0 Z" fill="#e0f2fe" opacity="0.7" />
                
                {/* Light Grey Angular Shape - Bottom Left */}
                <path d="M0 100 H60 Q30 70 0 40 V100 Z" fill="#f3f4f6" opacity="0.8" />
                
                {/* Subtle Geometric Accents */}
                <circle cx="90" cy="85" r="15" fill="#f3f4f6" opacity="0.5" />
                <circle cx="10" cy="15" r="8" fill="#e0f2fe" opacity="0.6" />
                
                {/* Decorative Lines */}
                <line x1="85" y1="10" x2="95" y2="20" stroke="#bae6fd" strokeWidth="0.5" />
                <line x1="88" y1="8" x2="98" y2="18" stroke="#bae6fd" strokeWidth="0.5" />
            </svg>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10">
            {/* Title */}
            <div className="flex items-center justify-center gap-3 mb-4 border-b-2 border-blue-200 pb-2">
                <div className="p-1.5 bg-white rounded text-blue-800 shadow-sm border border-blue-100">
                    <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#102446] uppercase tracking-wide font-sans">
                    JOB DESCRIPTION
                </h2>
            </div>

            {/* Content Body */}
            <div className="text-[11pt] leading-relaxed text-justify text-slate-800 font-sans min-h-[300px]">
                 {data.jobFunctions ? (
                    <div className="whitespace-pre-wrap break-words">
                        {data.jobFunctions}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-blue-200 rounded-lg bg-white/60 backdrop-blur-sm">
                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                        <p className="italic">Job functions content will appear here...</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="bg-[#102446] py-3 text-center shrink-0 mt-auto flex flex-col justify-center">
          <p className="text-white opacity-90" style={{ fontFamily: '"Lucida Calligraphy", "Lucida Handwriting", cursive', fontSize: '10pt' }}>
              &quot;Changing lives Building a Safer Nation&quot;
          </p>
      </div>
    </div>
  );
});

JobDescriptionPreview.displayName = 'JobDescriptionPreview';