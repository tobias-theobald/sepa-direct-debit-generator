import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Member, ClubInfo } from '../types';
import { validateIBAN, formatIBAN } from '../utils/validation';

interface MemberPreviewProps {
  members: Member[];
  clubInfo?: ClubInfo;
  defaultFee?: number;
  onNext: () => void;
  onBack: () => void;
}

const MemberPreview: React.FC<MemberPreviewProps> = ({ members, clubInfo, defaultFee, onNext, onBack }) => {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [validatedMembers, setValidatedMembers] = useState<Member[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  // Use defaultFee if provided, otherwise use clubInfo.membershipFee if available
  const membershipFee = defaultFee !== undefined ? defaultFee : (clubInfo?.membershipFee || 0);
  
  useEffect(() => {
    // Validate all members' IBANs
    const errors: Record<number, string[]> = {};
    const validated = members.map((member, index) => {
      const memberErrors: string[] = [];
      
      // Validate IBAN
      if (member.iban) {
        const ibanResult = validateIBAN(member.iban);
        if (!ibanResult.isValid) {
          memberErrors.push(`${t('validation.invalidIban')}: ${ibanResult.message}`);
        }
      } else {
        memberErrors.push(t('memberPreview.errors.missingIban'));
      }
      
      // Validate mandate reference
      if (!member.mandateReference) {
        memberErrors.push(t('memberPreview.errors.missingMandateReference'));
      }
      
      // Validate mandate date
      if (!member.mandateDate) {
        memberErrors.push(t('memberPreview.errors.missingMandateDate'));
      }
      
      // Store errors if any
      if (memberErrors.length > 0) {
        errors[index] = memberErrors;
      }
      
      return member;
    });
    
    setValidationErrors(errors);
    setValidatedMembers(validated);
    setIsFormValid(Object.keys(errors).length === 0 && members.length > 0);
  }, [members, t]);
  
  if (!members || members.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h2 className="hidden sm:block text-2xl font-bold mb-6 text-gray-800">{t('memberPreview.title')}</h2>
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md mb-6">
          {t('memberPreview.noMembers')}. {t('memberPreview.checkFileAndMapping')}
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('memberPreview.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="hidden sm:block text-2xl font-bold mb-6 text-gray-800">{t('memberPreview.title')}</h2>
      
      {!isFormValid && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">{t('memberPreview.notices')}</h3>
          <p className="text-yellow-700 mb-2">
            {t('memberPreview.dataProblems')}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          <span className="font-medium">{t('memberPreview.numberOfMembers')}:</span> {members.length}
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">{t('memberPreview.standardFee')}:</span> {membershipFee.toFixed(2)} €
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">{t('memberPreview.totalAmount')}:</span>{' '}
          {validatedMembers.reduce((sum, member) => {
            const fee = member.fee !== undefined ? member.fee : membershipFee;
            return sum + (fee || 0);
          }, 0).toFixed(2)}{' '}
          €
        </p>
      </div>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('memberPreview.name')}
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('memberPreview.iban')}
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">{t('memberPreview.combinedReference')}</span>
                  <span className="sm:hidden">{t('memberPreview.referenceShort')}</span>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">{t('memberPreview.mandateDate')}</span>
                  <span className="sm:hidden">{t('memberPreview.dateShort')}</span>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">{t('memberPreview.fee')}</span>
                  <span className="sm:hidden">€</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validatedMembers.map((member, index) => {
                const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
                const fee = member.fee !== undefined ? member.fee : membershipFee;
                const hasError = validationErrors[index] !== undefined;
                
                return (
                  <tr key={index} className={hasError ? 'bg-red-50' : ''}>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {memberName || t('memberPreview.unknown')}
                      {hasError && (
                        <div className="mt-1">
                          {validationErrors[index].map((error, errIndex) => (
                            <p key={errIndex} className="text-xs text-red-600">{error}</p>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      <span className="hidden sm:inline">{formatIBAN(member.iban)}</span>
                      <span className="sm:hidden">{formatIBAN(member.iban).slice(0, 12)}...</span>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {clubInfo?.reference ? (
                        <>
                          <span className="hidden sm:inline">{`${clubInfo.reference}${member.mandateReference || ''}`}</span>
                          <span className="sm:hidden">{`${clubInfo.reference.slice(0, 5)}...${member.mandateReference?.slice(0, 3) || ''}`}</span>
                        </>
                      ) : (
                        member.mandateReference || ''
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {member.mandateDate || ''}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {fee !== undefined ? fee.toFixed(2) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-2 sm:order-1"
        >
          {t('memberPreview.back')}
        </button>
        
        <button
          onClick={onNext}
          className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2 ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={!isFormValid}
        >
          {t('memberPreview.generateXml')}
        </button>
      </div>
      
      {!isFormValid && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            {t('memberPreview.correctErrors')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberPreview;
