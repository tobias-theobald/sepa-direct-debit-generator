import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stepper from './components/Stepper';
import ClubInfoForm from './components/ClubInfoForm';
import FileUploader from './components/FileUploader';
import ColumnMapper from './components/ColumnMapper';
import MemberPreview from './components/MemberPreview';
import GenerateXML from './components/GenerateXML';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ClubInfo, Member, ColumnMapping } from './types';
import { mapFileToMembers } from './utils/fileParser';

function App() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [clubInfo, setClubInfo] = useState<ClubInfo>({
    name: '',
    iban: '',
    bic: '',
    creditorId: '',
    executionDaysInFuture: 3,
    purpose: '',
    reference: '',
    membershipFee: 0
  });
  
  const [fileData, setFileData] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: -1,
    firstName: -1,
    lastName: -1,
    iban: -1,
    mandateDate: -1,
    mandateReference: -1,
    fee: -1
  });
  
  const [members, setMembers] = useState<Member[]>([]);
  
  const handleNext = () => {
    if (currentStep === 3) {
      // Map CSV data to members when moving from column mapping to preview
      const mappedMembers = mapFileToMembers(fileData, columnMapping, hasHeader);
      setMembers(mappedMembers);
    }
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleFileDataLoaded = (data: string[][], hasHeaderRow: boolean) => {
    setFileData(data);
    setHasHeader(hasHeaderRow);
  };
  
  const handleColumnMappingChange = (mapping: ColumnMapping) => {
    setColumnMapping(mapping);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClubInfoForm
            clubInfo={clubInfo}
            setClubInfo={setClubInfo}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <FileUploader
            onDataLoaded={handleFileDataLoaded}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ColumnMapper
            csvData={fileData}
            hasHeader={hasHeader}
            columnMapping={columnMapping}
            onColumnMappingChange={handleColumnMappingChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <MemberPreview
            members={members}
            clubInfo={clubInfo}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <GenerateXML
            clubInfo={clubInfo}
            members={members}
            onBack={handleBack}
            onReset={() => setCurrentStep(1)}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            {t('app.title')}
          </h1>
          <LanguageSwitcher />
        </div>
        
        <Stepper
          steps={[
            t('steps.clubInfo'),
            t('steps.fileUpload'),
            t('steps.columnMapping'),
            t('steps.preview'),
            t('steps.generate')
          ]}
          currentStep={currentStep}
        />
        
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default App;
