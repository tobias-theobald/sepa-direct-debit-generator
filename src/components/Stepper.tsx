import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile view - radial step indicator
  if (isMobile) {
    const currentStepIndex = currentStep - 1;
    const currentStepName = steps[currentStepIndex] || '';
    
    return (
      <div className="w-full py-3">
        <div className="flex items-center px-4">
          {/* Radial step indicator */}
          <div className="relative">
            {/* Outer circle - progress ring */}
            <div className="w-[5.5rem] h-[5.5rem] rounded-full border-4 border-gray-100 flex items-center justify-center">
              {/* Inner circle with step number */}
              <div className="w-[4.2rem] h-[4.2rem] rounded-full bg-white shadow-xs flex items-center justify-center">
                <span className="text-sm font-medium whitespace-nowrap text-gray-700">
                  {currentStep} {t('common.of')} {steps.length}
                </span>
              </div>
              
              {/* Progress circle overlay */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="289.02652413026095" 
                  strokeDashoffset={289.02652413026095 * (1 - currentStep / steps.length)}
                  className="text-blue-500"
                />
              </svg>
            </div>
          </div>
          
          {/* Step name */}
          <div className="ml-4 font-bold text-gray-800 text-lg">
            {currentStepName}
          </div>
        </div>
      </div>
    );
  }

  // Desktop view - horizontal stepper
  return (
    <div className="w-full py-6">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep - 1
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index === currentStep - 1
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {index < currentStep - 1 ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-xs mt-2 text-center">{step}</div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-auto border-t-2 ${
                  index < currentStep - 1 ? 'border-blue-600' : 'border-gray-300'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
