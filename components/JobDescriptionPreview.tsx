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
  const defaultBjmpLogoUrl = "https://res.cloudinary.com/dmroxqgop/image/upload/v1739983995/1_vohwuy.png";
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
      {/* 1. Header Logos Section */}
      <div className="bg-white relative h-[160px] shrink-0 border-b border-gray-100 overflow-hidden print:h-[160px]">
         
         {/* Left Logos (Absolute) */}
         <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10">
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

         {/* Center Content (Absolute Centered) */}
         <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center pointer-events-none z-0">
             {/* Standard Government text removed as requested for both Regional and Unit tabs */}
             
             {headerText && (
                <h2 className="text-2xl sm:text-3xl font-black font-bold text-[#102446] uppercase w-full max-w-lg mx-auto">
                    {headerText}
                </h2>
             )}
             
             {unitAddress && (
                 <p className="text-sm font-semibold text-[#102446] mt-1 uppercase">
                     {unitAddress}
                 </p>
             )}
         </div>

         {/* Right Logo (Absolute) */}
         <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
             <img 
               src={rightLogo} 
               alt="Right Logo" 
               className="h-28 w-auto object-contain" 
               crossOrigin="anonymous"
             />
         </div>
      </div>

      {/* 2. Blue Profile Banner (Rank & Name beside Photo) */}
      <div className="bg-[#102446] w-full px-12 py-8 flex items-center gap-8 shrink-0">
          {/* Photo */}
          <div className="w-[140px] h-[160px] bg-gray-200 shrink-0 border-[3px] border-white shadow-md overflow-hidden bg-white">
            {data.photo ? (
                <img src={data.photo} alt="Personnel" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <User className="w-12 h-12 opacity-50" />
                </div>
            )}
          </div>

          {/* Text Details - Tahoma, White */}
          <div className="flex flex-col justify-center text-white flex-1" style={{ fontFamily: 'Tahoma, Verdana, sans-serif' }}>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h1 className="text-3xl font-bold uppercase tracking-wide leading-none mb-2">
                    {data.rankName || 'RANK & FULL NAME'}
                </h1>
                <p className="text-xl font-medium uppercase text-blue-100 tracking-wider">
                    {data.designation || 'DESIGNATION'}
                </p>
              </div>
          </div>
      </div>

      {/* 3. Main Content - Job Description */}
      <div className="flex-1 px-16 py-12 bg-blue-50">
        
        {/* Title */}
        <div className="flex items-center gap-4 mb-8 border-b-2 border-blue-200 pb-4">
            <div className="p-2 bg-white rounded text-blue-800 shadow-sm">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-[#102446] uppercase tracking-wide font-sans">
                    JOB DESCRIPTION
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isRegional ? 'Regional Office Personnel' : 'Unit Office Personnel'}
                </p>
            </div>
        </div>

        {/* Content Body */}
        <div className="text-[11pt] leading-relaxed text-justify text-slate-800 font-sans min-h-[300px]">
             {data.jobFunctions ? (
                <div className="whitespace-pre-wrap break-words">
                    {data.jobFunctions}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-blue-200 rounded-lg bg-white/50">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <p className="italic">Job functions content will appear here...</p>
                </div>
            )}
        </div>
      </div>

      {/* 4. Footer */}
      <div className="bg-[#102446] py-3 text-center shrink-0 mt-auto flex flex-col justify-center">
          <p className="text-white opacity-90" style={{ fontFamily: '"Lucida Calligraphy", "Lucida Handwriting", cursive', fontSize: '11pt' }}>
              &quot;Changing lives Building a Safer Nation&quot;
          </p>
      </div>
    </div>
  );
});

JobDescriptionPreview.displayName = 'JobDescriptionPreview';