import React, { useState, useRef } from 'react';
import { PersonnelType, RegionalData, UnitData } from './types';
import { Button } from './components/ui/Button';
import { Input, TextArea, FileUpload } from './components/ui/Input';
import { JobDescriptionPreview } from './components/JobDescriptionPreview';
import { refineJobDescription } from './services/geminiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Building2, 
  User, 
  Briefcase, 
  FileText, 
  Download, 
  ArrowLeft,
  Sparkles,
  Factory
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<PersonnelType>(PersonnelType.REGIONAL);
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Form State
  const [regionalData, setRegionalData] = useState<RegionalData>({
    office: '',
    rankName: '',
    designation: '',
    jobFunctions: '',
    photo: null,
    bjmpLogo: null,
    regionalLogo: null,
    govLogo: null
  });

  const [unitData, setUnitData] = useState<UnitData>({
    rankName: '',
    designation: '',
    jobFunctions: '',
    photo: null,
    unitLogo: null,
    bjmpLogo: null,
    govLogo: null,
    jailUnit: '',
    address: ''
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    field: keyof RegionalData | keyof UnitData, 
    value: string | null, 
    type: PersonnelType
  ) => {
    if (type === PersonnelType.REGIONAL) {
      setRegionalData(prev => ({ ...prev, [field]: value }));
    } else {
      setUnitData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePolish = async () => {
    setIsPolishing(true);
    const currentText = activeTab === PersonnelType.REGIONAL ? regionalData.jobFunctions : unitData.jobFunctions;
    
    if (currentText) {
      const refined = await refineJobDescription(currentText);
      if (activeTab === PersonnelType.REGIONAL) {
        setRegionalData(prev => ({ ...prev, jobFunctions: refined }));
      } else {
        setUnitData(prev => ({ ...prev, jobFunctions: refined }));
      }
    }
    setIsPolishing(false);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPdf(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`JobDescription_${activeTab}_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const currentData = activeTab === PersonnelType.REGIONAL ? regionalData : unitData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">AutoJobDesc Generator</h1>
              <h1 className="text-xl font-bold text-gray-900 sm:hidden">AutoJobDesc</h1>
            </div>
            {viewMode === 'preview' && (
              <Button 
                variant="outline" 
                onClick={() => setViewMode('form')}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="text-sm"
              >
                Back to Edit
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewMode === 'form' ? (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab(PersonnelType.REGIONAL)}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    activeTab === PersonnelType.REGIONAL
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Regional Office
                </button>
                <button
                  onClick={() => setActiveTab(PersonnelType.UNIT)}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    activeTab === PersonnelType.UNIT
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Factory className="w-4 h-4" />
                  Unit Office
                </button>
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {activeTab === PersonnelType.REGIONAL ? (
                    <>
                        <Input
                            label="Office Name"
                            placeholder="e.g. Northeast Regional HQ"
                            value={regionalData.office}
                            onChange={(e) => handleInputChange('office', e.target.value, PersonnelType.REGIONAL)}
                        />
                        <Input
                            label="Rank & Full Name"
                            placeholder="e.g. Director Jane Doe"
                            value={regionalData.rankName}
                            onChange={(e) => handleInputChange('rankName', e.target.value, PersonnelType.REGIONAL)}
                        />
                        <Input
                            label="Designation"
                            placeholder="e.g. Chief of Operations"
                            value={regionalData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value, PersonnelType.REGIONAL)}
                        />
                        
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Header Logos (Optional)</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <FileUpload
                                    label="BJMP Logo"
                                    currentImage={regionalData.bjmpLogo}
                                    onChange={(val) => handleInputChange('bjmpLogo', val, PersonnelType.REGIONAL)}
                                    className="mb-0"
                                />
                                <FileUpload
                                    label="Regional Logo"
                                    currentImage={regionalData.regionalLogo}
                                    onChange={(val) => handleInputChange('regionalLogo', val, PersonnelType.REGIONAL)}
                                    className="mb-0"
                                />
                                <FileUpload
                                    label="Gov Logo"
                                    currentImage={regionalData.govLogo}
                                    onChange={(val) => handleInputChange('govLogo', val, PersonnelType.REGIONAL)}
                                    className="mb-0"
                                />
                            </div>
                        </div>
                    </>
                  ) : (
                    <>
                         {/* Unit Logo - Primary Field */}
                         <div className="mb-2">
                            <FileUpload
                                label="Unit / Office Logo"
                                currentImage={unitData.unitLogo}
                                onChange={(val) => handleInputChange('unitLogo', val, PersonnelType.UNIT)}
                            />
                         </div>

                        <Input
                            label="Jail Unit"
                            placeholder="e.g. Manila City Jail"
                            value={unitData.jailUnit}
                            onChange={(e) => handleInputChange('jailUnit', e.target.value, PersonnelType.UNIT)}
                        />

                        <Input
                            label="Address"
                            placeholder="e.g. 123 Street, Manila City"
                            value={unitData.address}
                            onChange={(e) => handleInputChange('address', e.target.value, PersonnelType.UNIT)}
                        />

                        <Input
                            label="Rank & Full Name"
                            placeholder="e.g. Director Jane Doe"
                            value={unitData.rankName}
                            onChange={(e) => handleInputChange('rankName', e.target.value, PersonnelType.UNIT)}
                        />
                        <Input
                            label="Designation"
                            placeholder="e.g. Chief of Operations"
                            value={unitData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value, PersonnelType.UNIT)}
                        />

                         <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Other Header Logos (Optional)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FileUpload
                                    label="BJMP Logo"
                                    currentImage={unitData.bjmpLogo}
                                    onChange={(val) => handleInputChange('bjmpLogo', val, PersonnelType.UNIT)}
                                    className="mb-0"
                                />
                                <FileUpload
                                    label="Gov Logo"
                                    currentImage={unitData.govLogo}
                                    onChange={(val) => handleInputChange('govLogo', val, PersonnelType.UNIT)}
                                    className="mb-0"
                                />
                            </div>
                        </div>
                    </>
                  )}
                </div>

                {/* Right Column - Photo */}
                <div>
                  <FileUpload
                    label="Personnel Photo"
                    currentImage={activeTab === PersonnelType.REGIONAL ? regionalData.photo : unitData.photo}
                    onChange={(val) => handleInputChange('photo', val, activeTab)}
                  />
                  
                  {activeTab === PersonnelType.REGIONAL && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                          <p className="font-semibold mb-1">Regional Office Setup</p>
                          <p>Upload specific logos on the left to customize the document header, or leave them blank to use defaults.</p>
                      </div>
                  )}

                  {activeTab === PersonnelType.UNIT && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                          <p className="font-semibold mb-1">Unit Office Setup</p>
                          <p>Upload your Unit Logo (top left) to display it in the center of the header.</p>
                      </div>
                  )}
                </div>
              </div>

              {/* Full Width - Job Functions */}
              <div className="border-t pt-6">
                 <TextArea
                    label="Job Functions"
                    placeholder="List the key responsibilities here. You can use simple notes, and click 'AI Polish' to format them professionally."
                    value={activeTab === PersonnelType.REGIONAL ? regionalData.jobFunctions : unitData.jobFunctions}
                    onChange={(e) => handleInputChange('jobFunctions', e.target.value, activeTab)}
                    actions={
                        <button 
                            onClick={handlePolish}
                            disabled={isPolishing || !(activeTab === PersonnelType.REGIONAL ? regionalData.jobFunctions : unitData.jobFunctions)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-3 h-3" />
                            {isPolishing ? 'Refining...' : 'AI Polish'}
                        </button>
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Enter rough notes and use AI Polish to format them into professional bullet points.
                  </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end">
                <Button 
                    onClick={() => setViewMode('preview')}
                    className="w-full md:w-auto"
                >
                    Generate Preview
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Preview Mode */}
            <div className="w-full flex justify-between items-center mb-6 max-w-4xl">
                 <h2 className="text-xl font-bold text-gray-800">Preview</h2>
                 <Button 
                    variant="primary"
                    onClick={handleDownloadPDF}
                    isLoading={isGeneratingPdf}
                    icon={<Download className="w-4 h-4" />}
                 >
                    Download PDF
                 </Button>
            </div>
            
            {/* The Actual Document Preview */}
            <div className="w-full overflow-auto rounded shadow-2xl bg-gray-500 p-4 md:p-8 flex justify-center">
                <div className="transform scale-100 md:scale-100 origin-top">
                    <JobDescriptionPreview 
                        ref={previewRef}
                        type={activeTab} 
                        data={currentData} 
                    />
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}