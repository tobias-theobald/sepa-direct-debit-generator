import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ClubInfo } from '../types';
import { validateIBAN, validateBIC, validateCreditorID, formatIBAN } from '../utils/validation';

interface ClubInfoFormProps {
  clubInfo: ClubInfo;
  setClubInfo: React.Dispatch<React.SetStateAction<ClubInfo>>;
  onNext: () => void;
}

const ClubInfoForm: React.FC<ClubInfoFormProps> = ({ clubInfo, setClubInfo, onNext }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate IBAN
    if (clubInfo.iban) {
      const ibanResult = validateIBAN(clubInfo.iban);
      if (!ibanResult.isValid) {
        isValid = false;
        newErrors.iban = ibanResult.message || t('validation.invalidIban');
      }
    } else {
      isValid = false;
      newErrors.iban = t('validation.required');
    }
    
    // Validate BIC
    if (clubInfo.bic) {
      const bicResult = validateBIC(clubInfo.bic);
      if (!bicResult.isValid) {
        isValid = false;
        newErrors.bic = bicResult.message || t('validation.invalidBic');
      }
    } else {
      isValid = false;
      newErrors.bic = t('validation.required');
    }
    
    // Validate Creditor ID
    if (clubInfo.creditorId) {
      const creditorIdResult = validateCreditorID(clubInfo.creditorId);
      if (!creditorIdResult.isValid) {
        isValid = false;
        newErrors.creditorId = creditorIdResult.message || t('validation.required');
      }
    } else {
      isValid = false;
      newErrors.creditorId = t('validation.required');
    }
    
    // Validate other required fields
    if (!clubInfo.name) {
      isValid = false;
      newErrors.name = t('validation.required');
    }
    
    if (!clubInfo.purpose) {
      isValid = false;
      newErrors.purpose = t('validation.required');
    }
    
    if (!clubInfo.reference) {
      isValid = false;
      newErrors.reference = t('validation.required');
    }
    
    if (!clubInfo.membershipFee || clubInfo.membershipFee <= 0) {
      isValid = false;
      newErrors.membershipFee = t('validation.required');
    }
    
    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  }, [clubInfo, t]);

  // Validate form whenever clubInfo changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    if (type === 'number') {
      setClubInfo(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else if (name === 'iban') {
      // Format IBAN with spaces for better readability
      setClubInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setClubInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format IBAN without spaces before proceeding
      setClubInfo(prev => ({
        ...prev,
        iban: prev.iban.replace(/\s+/g, ''),
        bic: prev.bic.replace(/\s+/g, '')
      }));
      onNext();
    }
  };

  // Format IBAN for display
  const formatIbanForDisplay = (iban: string) => {
    return formatIBAN(iban);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="hidden sm:block text-2xl font-bold mb-6 text-gray-800">{t('clubInfo.title')}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full width on all screens */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.creditorName')}
            </label>
            <input
              type="text"
              name="name"
              placeholder="Mein Verein e.V."
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Responsive fields - full width on mobile, half width on larger screens */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.creditorIban')}
            </label>
            <input
              type="text"
              name="iban"
              value={clubInfo.iban}
              onChange={handleChange}
              onBlur={() => {
                // Format IBAN on blur
                setClubInfo(prev => ({ 
                  ...prev, 
                  iban: formatIbanForDisplay(prev.iban) 
                }));
              }}
              placeholder="DE40 9876 5432 9876 5432 10"
              className={`w-full px-3 py-2 border ${errors.iban ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.iban && (
              <p className="mt-1 text-sm text-red-600">{errors.iban}</p>
            )}
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.creditorBic')}
            </label>
            <input
              type="text"
              name="bic"
              value={clubInfo.bic}
              onChange={handleChange}
              placeholder="BANKDE12"
              className={`w-full px-3 py-2 border ${errors.bic ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.bic && (
              <p className="mt-1 text-sm text-red-600">{errors.bic}</p>
            )}
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.creditorId')}
            </label>
            <input
              type="text"
              name="creditorId"
              value={clubInfo.creditorId}
              onChange={handleChange}
              placeholder="DE98ZZZ09999999999"
              className={`w-full px-3 py-2 border ${errors.creditorId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.creditorId && (
              <p className="mt-1 text-sm text-red-600">{errors.creditorId}</p>
            )}
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.executionDate')}
            </label>
            <input
              type="number"
              name="executionDaysInFuture"
              value={clubInfo.executionDaysInFuture}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border ${errors.executionDaysInFuture ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.executionDaysInFuture && (
              <p className="mt-1 text-sm text-red-600">{errors.executionDaysInFuture}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t('clubInfo.executionDateHelp')}
            </p>
          </div>
          
          {/* Purpose field - full width */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.purpose')}
            </label>
            <input
              type="text"
              name="purpose"
              value={clubInfo.purpose}
              onChange={handleChange}
              placeholder="Mitgliedsbeitrag 2025"
              className={`w-full px-3 py-2 border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
            )}
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.mandateReference')}
            </label>
            <input
              type="text"
              name="reference"
              value={clubInfo.reference}
              onChange={handleChange}
              placeholder="VEREIN.BEITRAG.2025-"
              className={`w-full px-3 py-2 border ${errors.reference ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.reference && (
              <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t('clubInfo.mandateReferenceHelp')}
            </p>
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clubInfo.membershipFee')}
            </label>
            <input
              type="number"
              name="membershipFee"
              value={clubInfo.membershipFee || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="25"
              className={`w-full px-3 py-2 border ${errors.membershipFee ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
            />
            {errors.membershipFee && (
              <p className="mt-1 text-sm text-red-600">{errors.membershipFee}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t('clubInfo.membershipFeeHelp')}
            </p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-8 flex justify-center sm:justify-end">
          <button
            type="submit"
            className={`px-6 py-2 w-full sm:w-auto bg-blue-600 text-white rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={!isFormValid}
          >
            {t('clubInfo.continue')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubInfoForm;
